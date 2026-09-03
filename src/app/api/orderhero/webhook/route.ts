import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isPaid, normalizeOrderHeroPayload, payloadReadiness, verifyWebhook } from "@/lib/commerce/orderhero";

export const runtime = "nodejs";

const ORDERHERO_SUPER_KIDS_PRODUCT_ID = "6a906158ffceb421fe4ee6ca";
const STORY_TOPUPS: Record<string, { credits: number; name: string }> = {
  "PBSK-STORY-CREDIT-3": { credits: 3, name: "Papa Bonski - Tambah 3 Cerita" },
  "PBSK-STORY-CREDIT-8": { credits: 8, name: "Papa Bonski - Tambah 8 Cerita" },
};

function safeHeaders(req:Request){
  const allowed=[
    "content-type","user-agent","x-request-id",
    "x-webhook-event","x-webhook-delivery","x-webhook-timestamp","x-webhook-signature",
    "x-orderhero-signature","x-signature"
  ];
  return Object.fromEntries(allowed.map(k=>[k,req.headers.get(k)]).filter(([,v])=>v));
}

function normalizeEmail(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function intentTokenFromContent(content?: string) {
  const value=String(content || "").trim();
  return value.startsWith("pbint_") ? value.slice("pbint_".length) : "";
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req)) return NextResponse.json({ok:false,error:"invalid_webhook_auth"},{status:401});
  let payload: Record<string,unknown>;
  try { payload=JSON.parse(raw); } catch { return NextResponse.json({ok:false,error:"invalid_json"},{status:400}); }

  const n=normalizeOrderHeroPayload(payload);
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) return NextResponse.json({ok:false,error:"server_not_configured"},{status:503});
  const db=createClient(url,key,{auth:{persistSession:false}});

  const deliveryId=req.headers.get("x-webhook-delivery");
  const eventName=req.headers.get("x-webhook-event") ?? n.eventName;
  const eventKey=deliveryId ?? n.eventKey ?? (eventName && n.externalOrderId ? `${eventName}:${n.externalOrderId}` : undefined) ?? req.headers.get("x-request-id") ?? n.externalOrderId ?? undefined;

  const inserted=await db.from("webhook_events").insert({
    provider:"orderhero",
    event_key:eventKey,
    payload,
    normalized:{...n,eventName:eventName ?? n.eventName},
    external_order_id:n.externalOrderId,
    http_headers:safeHeaders(req)
  }).select("id").single();

  if(inserted.error?.code==="23505") return NextResponse.json({ok:true,duplicate:true,eventKey});
  if(inserted.error) return NextResponse.json({ok:false,error:"event_store_failed",detail:inserted.error.message},{status:500});
  const event=inserted.data;

  try {
    const readiness=payloadReadiness(n);
    if(!readiness.ready){
      await db.from("webhook_events").update({
        status:"needs_mapping",
        error:`Missing: ${readiness.missing.join(", ")}`,
        processed_at:new Date().toISOString()
      }).eq("id",event.id);
      return NextResponse.json({ok:true,accepted:true,needsMapping:true,missing:readiness.missing},{status:202});
    }

    if(!isPaid(n.status)) {
      await db.from("webhook_events").update({status:"ignored",processed_at:new Date().toISOString()}).eq("id",event.id);
      return NextResponse.json({ok:true,ignored:true,status:n.status});
    }

    const normalizedSku = String(n.productSku || "").trim().toUpperCase();
    const normalizedName = String(n.productName || "").trim().toLowerCase();
    const topupEntry =
      STORY_TOPUPS[normalizedSku] ??
      Object.entries(STORY_TOPUPS).find(([, item]) => item.name.toLowerCase() === normalizedName)?.[1];
    const topupSku =
      STORY_TOPUPS[normalizedSku] ? normalizedSku :
      Object.entries(STORY_TOPUPS).find(([, item]) => item.name.toLowerCase() === normalizedName)?.[0];
    const topupCredits = topupEntry?.credits ?? 0;

    let productSku=n.productSku || (topupSku || "PBSK-SUPER-KIDS");
    let planCode=process.env.ORDERHERO_DEFAULT_PLAN||"PBSK-PREMIUM-1Y";

    if (n.externalProductId === ORDERHERO_SUPER_KIDS_PRODUCT_ID) {
      productSku = "PBSK-SUPER-KIDS";
      planCode = "PBSK-PREMIUM-1Y";
    } else {
      const candidates=[
        n.productSku && {match_type:"sku",match_value:String(n.productSku)},
        n.externalProductId && {match_type:"product_id",match_value:String(n.externalProductId)},
        n.productName && {match_type:"product_name",match_value:String(n.productName)}
      ].filter(Boolean) as {match_type:string;match_value:string}[];

      for(const c of candidates){
        const {data:m}=await db.from("orderhero_product_mappings")
          .select("product_sku,plan_code")
          .eq("match_type",c.match_type)
          .ilike("match_value",c.match_value)
          .eq("active",true)
          .maybeSingle();
        if(m){ productSku=m.product_sku; planCode=m.plan_code; break; }
      }
    }

    const actualSku=String(topupSku || productSku || "").trim().toUpperCase();
    const isTopup=topupCredits > 0;

    // Duplicate OrderHero deliveries are common. If this order already granted
    // top-up credits, treat the new delivery as a duplicate instead of trying
    // to resolve ownership again.
    if(isTopup && n.externalOrderId){
      const {data:existingOrder,error:existingOrderError}=await db.from("orders")
        .select("id,customer_id,product_sku")
        .eq("provider","orderhero")
        .eq("external_order_id",n.externalOrderId)
        .maybeSingle();
      if(existingOrderError) throw existingOrderError;

      if(existingOrder?.id){
        const {data:existingGrant,error:existingGrantError}=await db.from("story_credit_grants")
          .select("id,credits")
          .eq("order_id",existingOrder.id)
          .maybeSingle();
        if(existingGrantError) throw existingGrantError;

        if(existingGrant?.id){
          const {data:existingCustomer}=await db.from("customers")
            .select("email")
            .eq("id",existingOrder.customer_id)
            .maybeSingle();
          await db.from("webhook_events").update({
            status:"processed",
            processed_at:new Date().toISOString(),
            normalized:{
              ...n,
              eventName:eventName ?? n.eventName,
              productSku:existingOrder.product_sku,
              recipientEmail:existingCustomer?.email ?? null,
              creditsAdded:existingGrant.credits,
              duplicate:true
            }
          }).eq("id",event.id);
          return NextResponse.json({ok:true,duplicate:true,orderId:existingOrder.id});
        }
      }
    }

    const intentToken=intentTokenFromContent(n.utm?.content);
    let intent:any=null;
    if(intentToken){
      const {data,error}=await db.from("webhook_events")
        .select("id,status,payload,received_at,external_order_id")
        .eq("provider","retail_checkout")
        .eq("event_key",intentToken)
        .maybeSingle();
      if(error) throw error;
      intent=data;
    }

    // OrderHero currently does not reliably return our UTM intent token.
    // For top-ups, ownership must still come ONLY from a signed-in member
    // intent created by Papa Bonski. If exactly one recent intent for this SKU
    // exists, it is safe to recover it. Zero or multiple candidates are held
    // for manual mapping rather than using the OrderHero email.
    if(!intent){
      const windowMs=isTopup ? 30*60*1000 : 24*60*60*1000;
      const cutoff=new Date(Date.now()-windowMs).toISOString();
      const {data:candidates,error:candidateError}=await db.from("webhook_events")
        .select("id,status,payload,received_at,external_order_id")
        .eq("provider","retail_checkout")
        .eq("status","pending")
        .gte("received_at",cutoff)
        .order("received_at",{ascending:false})
        .limit(100);
      if(candidateError) throw candidateError;

      const matching=(candidates || []).filter((candidate:any) => {
        const candidateSku=String(candidate?.payload?.product_sku || "").trim().toUpperCase();
        if(candidateSku !== actualSku) return false;
        if(!isTopup) return true;
        return String(candidate?.payload?.intent_type || "") === "member_topup";
      });

      if(matching.length===1){
        intent=matching[0];
      } else if(isTopup){
        const reason=matching.length===0 ? "topup_intent_missing" : "topup_intent_ambiguous";
        await db.from("webhook_events").update({
          status:"needs_mapping",
          error:matching.length===0
            ? "Top-up payment has no signed-in member intent. OrderHero email was intentionally ignored."
            : "Top-up payment matches multiple signed-in member intents. OrderHero email was intentionally ignored.",
          processed_at:new Date().toISOString(),
          normalized:{...n,eventName:eventName ?? n.eventName,productSku:topupSku}
        }).eq("id",event.id);
        return NextResponse.json({ok:true,accepted:true,needsMapping:true,reason},{status:202});
      }
    }

    if(isTopup && String(intent?.payload?.intent_type || "") !== "member_topup"){
      await db.from("webhook_events").update({
        status:"needs_mapping",
        error:"Top-up requires a signed-in member intent. OrderHero email was intentionally ignored.",
        processed_at:new Date().toISOString(),
        normalized:{...n,eventName:eventName ?? n.eventName,productSku:topupSku}
      }).eq("id",event.id);
      return NextResponse.json({ok:true,accepted:true,needsMapping:true,reason:"topup_intent_invalid"},{status:202});
    }

    const intendedSku=String(intent?.payload?.product_sku || "").trim().toUpperCase();
    if(intendedSku && intendedSku !== actualSku){
      await db.from("webhook_events").update({
        status:"needs_mapping",
        error:"Retail checkout intent does not match the paid product.",
        processed_at:new Date().toISOString()
      }).eq("id",event.id);
      if(intent?.id){
        await db.from("webhook_events").update({
          status:"needs_mapping",
          error:"Paid product did not match the selected retail checkout product.",
          processed_at:new Date().toISOString()
        }).eq("id",intent.id);
      }
      return NextResponse.json({ok:true,accepted:true,needsMapping:true,reason:"intent_product_mismatch"},{status:202});
    }

    const buyerEmail=normalizeEmail(n.email);
    const recipientEmail=normalizeEmail(
      isTopup
        ? intent?.payload?.recipient_email
        : (intent?.payload?.recipient_email || n.email)
    );
    if(!recipientEmail){
      await db.from("webhook_events").update({
        status:"needs_mapping",
        error:isTopup
          ? "Signed-in member recipient is missing from top-up intent."
          : "Recipient email is missing.",
        processed_at:new Date().toISOString()
      }).eq("id",event.id);
      return NextResponse.json({
        ok:true,
        accepted:true,
        needsMapping:true,
        reason:isTopup ? "topup_recipient_missing" : "recipient_email_missing"
      },{status:202});
    }

    const buyerIsRecipient=Boolean(buyerEmail && buyerEmail === recipientEmail);
    const {data:customer,error:customerLookupError}=await db.from("customers")
      .select("id")
      .ilike("email",recipientEmail)
      .order("created_at",{ascending:true})
      .limit(1)
      .maybeSingle();
    if(customerLookupError) throw customerLookupError;

    let customerId:string|undefined=customer?.id;

    if(!customerId && topupCredits > 0){
      await db.from("webhook_events").update({
        status:"needs_mapping",
        error:"Top-up requires an existing Papa Bonski recipient account.",
        processed_at:new Date().toISOString(),
        normalized:{...n,eventName:eventName ?? n.eventName,recipientEmail,productSku:topupSku}
      }).eq("id",event.id);
      if(intent?.id){
        await db.from("webhook_events").update({
          status:"needs_mapping",
          error:"Recipient account was not found for this top-up.",
          processed_at:new Date().toISOString()
        }).eq("id",intent.id);
      }
      return NextResponse.json({
        ok:true,
        accepted:true,
        needsMapping:true,
        reason:"topup_recipient_not_found"
      },{status:202});
    }

    if(!customerId){
      const {data,error}=await db.from("customers").insert({
        name: buyerIsRecipient ? (n.name||"Member Papa Bonski") : "Member Papa Bonski",
        email: recipientEmail,
        whatsapp: buyerIsRecipient ? (n.phone||null) : null,
        status:"active"
      }).select("id").single();
      if(error) throw error;
      customerId=data.id;
    } else {
      const update:Record<string,unknown>={
        status:"active",
        updated_at:new Date().toISOString()
      };
      if(buyerIsRecipient){
        if(n.name) update.name=n.name;
        if(n.phone) update.whatsapp=n.phone;
      }
      const {error}=await db.from("customers").update(update).eq("id",customerId);
      if(error) throw error;
    }

    const {data:order,error:orderError}=await db.from("orders").upsert({
      provider:"orderhero",
      external_order_id:n.externalOrderId,
      customer_id:customerId,
      product_sku:productSku,
      amount:n.amount||null,
      currency:n.currency||"IDR",
      status:"paid",
      buyer_email:n.email||null,
      buyer_phone:n.phone||null,
      raw_payload:payload,
      paid_at:n.paidAt || new Date().toISOString()
    },{onConflict:"provider,external_order_id"}).select("id").single();
    if(orderError) throw orderError;

    if (topupCredits > 0) {
      const grant = await db.from("story_credit_grants").upsert({
        customer_id: customerId,
        order_id: order.id,
        credits: topupCredits,
        product_sku: topupSku!,
        source: "orderhero_topup",
      }, { onConflict: "order_id" });
      if (grant.error) throw grant.error;

      await db.from("webhook_events").update({
        status:"processed",
        processed_at:new Date().toISOString(),
        normalized:{
          ...n,
          eventName:eventName ?? n.eventName,
          productSku:topupSku,
          recipientEmail,
          creditsAdded:topupCredits
        }
      }).eq("id",event.id);

      if(intent?.id){
        await db.from("webhook_events").update({
          status:"processed",
          processed_at:new Date().toISOString(),
          external_order_id:n.externalOrderId
        }).eq("id",intent.id);
      }

      return NextResponse.json({
        ok:true,
        creditsAdded:topupCredits,
        customerId,
        orderId:order.id,
        productSku:topupSku
      });
    }

    const nowIso=new Date().toISOString();
    const {data:activeSub,error:activeSubError}=await db.from("subscriptions")
      .select("id,expires_at")
      .eq("customer_id",customerId)
      .eq("status","active")
      .gt("expires_at",nowIso)
      .order("expires_at",{ascending:false})
      .limit(1)
      .maybeSingle();
    if(activeSubError) throw activeSubError;

    // One recipient email owns one active retail license. A second base-package
    // payment for the same active recipient is held for resolution rather than
    // silently extending or merging it into the existing account.
    if(activeSub?.id){
      await db.from("webhook_events").update({
        status:"needs_mapping",
        error:"Recipient email already has an active Paket Super Kids 1. Choose story top-up or a different recipient email.",
        processed_at:new Date().toISOString(),
        normalized:{
          ...n,
          eventName:eventName ?? n.eventName,
          productSku,
          planCode,
          recipientEmail
        }
      }).eq("id",event.id);

      if(intent?.id){
        await db.from("webhook_events").update({
          status:"needs_mapping",
          error:"Recipient already has an active package.",
          processed_at:new Date().toISOString(),
          external_order_id:n.externalOrderId
        }).eq("id",intent.id);
      }

      return NextResponse.json({
        ok:true,
        accepted:true,
        needsMapping:true,
        reason:"recipient_already_active",
        orderId:order.id
      },{status:202});
    }

    const {data:plan}=await db.from("plans")
      .select("id,duration_days,code")
      .eq("code",planCode)
      .eq("active",true)
      .maybeSingle();
    if(!plan) throw new Error(`Plan mapping not found: ${planCode}`);

    const expires=new Date(Date.now()+(plan.duration_days||365)*86400000).toISOString();

    const existingSub=await db.from("subscriptions").select("id").eq("source_order_id",order.id).maybeSingle();
    if(!existingSub.data){
      const sub=await db.from("subscriptions").insert({
        customer_id:customerId,
        plan_id:plan.id,
        source_order_id:order.id,
        status:"active",
        expires_at:expires
      });
      if(sub.error) throw sub.error;
    }

    const entitlement=await db.from("entitlements").upsert({
      customer_id:customerId,
      key:"super_kids_access",
      value:true,
      expires_at:expires
    },{onConflict:"customer_id,key"});
    if(entitlement.error) throw entitlement.error;

    const attribution=intent?.payload?.attribution || n.utm;
    if(attribution && Object.values(attribution).some(Boolean)) {
      await db.from("attributions").insert({
        customer_id:customerId,
        order_id:order.id,
        utm_source:attribution.utm_source ?? attribution.source,
        utm_medium:attribution.utm_medium ?? attribution.medium,
        utm_campaign:attribution.utm_campaign ?? attribution.campaign,
        utm_content:attribution.utm_content ?? attribution.content,
        utm_term:attribution.utm_term ?? attribution.term,
        fbclid:attribution.fbclid,
        landing_path:attribution.landing_path ?? attribution.landingPath
      });
    }

    const existingActivation=await db.from("activations").select("id").eq("order_id",order.id).maybeSingle();
    if(!existingActivation.data){
      await db.from("activations").insert({
        customer_id:customerId,
        order_id:order.id,
        status:"active",
        metadata:{
          source:"orderhero_webhook",
          plan_code:plan.code,
          orderhero_product_id:n.externalProductId,
          recipient_email:recipientEmail
        }
      });
    }

    await db.from("webhook_events").update({
      status:"processed",
      processed_at:new Date().toISOString(),
      normalized:{
        ...n,
        eventName:eventName ?? n.eventName,
        productSku,
        planCode,
        recipientEmail,
        accessExpiresAt:expires,
      }
    }).eq("id",event.id);

    if(intent?.id){
      await db.from("webhook_events").update({
        status:"processed",
        processed_at:new Date().toISOString(),
        external_order_id:n.externalOrderId
      }).eq("id",intent.id);
    }

    return NextResponse.json({
      ok:true,
      activated:true,
      customerId,
      orderId:order.id,
      planCode,
      accessExpiresAt:expires,
    });
  } catch(e:any){
    await db.from("webhook_events").update({
      status:"error",
      error:String(e?.message||e),
      processed_at:new Date().toISOString()
    }).eq("id",event.id);
    return NextResponse.json({ok:false,error:"processing_failed"},{status:500});
  }
}
