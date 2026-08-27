import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isPaid, normalizeOrderHeroPayload, payloadReadiness, verifyWebhook } from "@/lib/commerce/orderhero";

export const runtime = "nodejs";

const ORDERHERO_SUPER_KIDS_PRODUCT_ID = "6a906158ffceb421fe4ee6ca";

function safeHeaders(req:Request){
  const allowed=[
    "content-type","user-agent","x-request-id",
    "x-webhook-event","x-webhook-delivery","x-webhook-timestamp","x-webhook-signature",
    "x-orderhero-signature","x-signature"
  ];
  return Object.fromEntries(allowed.map(k=>[k,req.headers.get(k)]).filter(([,v])=>v));
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
  const eventKey=n.eventKey ?? req.headers.get("x-webhook-delivery") ?? n.externalOrderId ?? req.headers.get("x-request-id") ?? undefined;

  const inserted=await db.from("webhook_events").insert({provider:"orderhero",event_key:eventKey,payload,normalized:n,external_order_id:n.externalOrderId,http_headers:safeHeaders(req)}).select("id").single();
  if(inserted.error?.code==="23505") return NextResponse.json({ok:true,duplicate:true});
  if(inserted.error) return NextResponse.json({ok:false,error:"event_store_failed",detail:inserted.error.message},{status:500});
  const event=inserted.data;

  try {
    const readiness=payloadReadiness(n);
    if(!readiness.ready){
      await db.from("webhook_events").update({status:"needs_mapping",error:`Missing: ${readiness.missing.join(", ")}`,processed_at:new Date().toISOString()}).eq("id",event.id);
      return NextResponse.json({ok:true,accepted:true,needsMapping:true,missing:readiness.missing},{status:202});
    }
    if(!isPaid(n.status)) {
      await db.from("webhook_events").update({status:"ignored",processed_at:new Date().toISOString()}).eq("id",event.id);
      return NextResponse.json({ok:true,ignored:true,status:n.status});
    }

    let productSku=n.productSku || "PBSK-SUPER-KIDS";
    let planCode=process.env.ORDERHERO_DEFAULT_PLAN||"PBSK-PREMIUM-1Y";

    // Canonical V5.4 mapping for the live OrderHero Papa Bonski Super Kids product.
    // Keep this explicit so purchase activation does not depend on a mutable product name.
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
        const {data:m}=await db.from("orderhero_product_mappings").select("product_sku,plan_code").eq("match_type",c.match_type).ilike("match_value",c.match_value).eq("active",true).maybeSingle();
        if(m){ productSku=m.product_sku; planCode=m.plan_code; break; }
      }
    }

    let customerId:string|undefined;
    if(n.email){ const {data}=await db.from("customers").select("id").ilike("email",n.email).maybeSingle(); customerId=data?.id; }
    if(!customerId){
      const {data,error}=await db.from("customers").insert({name:n.name||"Customer Papa Bonski",email:n.email||null,whatsapp:n.phone||null,status:"active"}).select("id").single();
      if(error) throw error; customerId=data.id;
    } else {
      await db.from("customers").update({status:"active",name:n.name||undefined,whatsapp:n.phone||undefined,updated_at:new Date().toISOString()}).eq("id",customerId);
    }

    const {data:order,error:orderError}=await db.from("orders").upsert({
      provider:"orderhero", external_order_id:n.externalOrderId, customer_id:customerId,
      product_sku:productSku, amount:n.amount||null, currency:n.currency||"IDR", status:"paid",
      buyer_email:n.email||null,buyer_phone:n.phone||null,raw_payload:payload,
      paid_at:n.paidAt || new Date().toISOString()
    },{onConflict:"provider,external_order_id"}).select("id").single();
    if(orderError) throw orderError;

    const {data:plan}=await db.from("plans").select("id,duration_days,code").eq("code",planCode).eq("active",true).maybeSingle();
    if(!plan) throw new Error(`Plan mapping not found: ${planCode}`);
    const expires=new Date(Date.now()+(plan.duration_days||365)*86400000).toISOString();

    const existingSub=await db.from("subscriptions").select("id").eq("source_order_id",order.id).maybeSingle();
    if(!existingSub.data){
      const sub=await db.from("subscriptions").insert({customer_id:customerId,plan_id:plan.id,source_order_id:order.id,status:"active",expires_at:expires});
      if(sub.error) throw sub.error;
    }
    const entitlement=await db.from("entitlements").upsert({customer_id:customerId,key:"super_kids_access",value:true,expires_at:expires},{onConflict:"customer_id,key"});
    if(entitlement.error) throw entitlement.error;

    if(n.utm && Object.values(n.utm).some(Boolean)) {
      await db.from("attributions").insert({customer_id:customerId,order_id:order.id,utm_source:n.utm.source,utm_medium:n.utm.medium,utm_campaign:n.utm.campaign,utm_content:n.utm.content,utm_term:n.utm.term,fbclid:n.utm.fbclid,landing_path:n.utm.landingPath});
    }
    const existingActivation=await db.from("activations").select("id").eq("order_id",order.id).maybeSingle();
    if(!existingActivation.data) await db.from("activations").insert({customer_id:customerId,order_id:order.id,status:"active",metadata:{source:"orderhero_webhook",plan_code:plan.code,orderhero_product_id:n.externalProductId}});
    await db.from("webhook_events").update({status:"processed",processed_at:new Date().toISOString(),normalized:{...n,productSku,planCode}}).eq("id",event.id);
    return NextResponse.json({ok:true,activated:true,customerId,orderId:order.id,planCode});
  } catch(e:any){
    await db.from("webhook_events").update({status:"error",error:String(e?.message||e),processed_at:new Date().toISOString()}).eq("id",event.id);
    return NextResponse.json({ok:false,error:"processing_failed"},{status:500});
  }
}
