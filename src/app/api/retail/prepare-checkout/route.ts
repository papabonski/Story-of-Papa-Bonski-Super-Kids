import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { CUSTOMER_ENTITLEMENTS, getCustomerAccess, getCustomerPortalAccess } from "@/lib/customer-access";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const CHECKOUTS: Record<string,string | undefined> = {
  "PBSK-SUPER-KIDS": "https://papabonski.orderhero.id/form/papa-bonski-super-kids",
  "PBSK-STORY-CREDIT-3": "https://papabonski.orderhero.id/form/papa-bonski-tambah-3-cerita",
  "PBSK-STORY-CREDIT-8": "https://papabonski.orderhero.id/form/papa-bonski-tambah-8-cerita",
  "PBM-MANDARIN": process.env.ORDERHERO_MANDARIN_CHECKOUT_URL ||
    "https://papabonski.orderhero.id/form/form-order-papa-bonski-mandarin",
  "PBM-MANDARIN-MEMBER": process.env.ORDERHERO_MANDARIN_MEMBER_CHECKOUT_URL ||
    "https://papabonski.orderhero.id/form/papa-bonski-mandarin-member-super-kids",
};

const PROMOTION_BY_SKU: Record<string,string> = {
  "PBSK-SUPER-KIDS": "super-kids-launch-50",
  "PBM-MANDARIN": "mandarin-launch-50",
};

function normalizeEmail(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function cleanAttribution(value: unknown) {
  const input = value && typeof value === "object" ? value as Record<string,unknown> : {};
  const out: Record<string,string> = {};
  for (const key of ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid"]) {
    const v = String(input[key] || "").trim().slice(0, 500);
    if (v) out[key] = v;
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let recipientEmail = normalizeEmail(body?.recipientEmail);
    const productSku = String(body?.productSku || "").trim().toUpperCase();
    const checkoutBase = CHECKOUTS[productSku];
    const isTopup =
      productSku === "PBSK-STORY-CREDIT-3" ||
      productSku === "PBSK-STORY-CREDIT-8";
    const isMandarinMember = productSku === "PBM-MANDARIN-MEMBER";
    let authUserId: string | null = null;
    let customerId: string | null = null;

    // Top-up ownership is derived ONLY from the authenticated member session.
    // Never fall back to an email supplied by the browser or by OrderHero.
    if (isTopup || isMandarinMember) {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.is_anonymous || !user.email) {
        return NextResponse.json(
          { ok: false, error: isMandarinMember ? "member_login_required" : "topup_login_required" },
          { status: 401 },
        );
      }
      authUserId = user.id;
      recipientEmail = normalizeEmail(user.email);

      if (isTopup) {
        const access = await getCustomerPortalAccess();
        if (!access?.hasAccess || access.email !== recipientEmail) {
          return NextResponse.json(
            { ok: false, error: "module_access_required" },
            { status: 403 },
          );
        }
        customerId = access.customerId;
      } else if (isMandarinMember) {
        const access = await getCustomerAccess(CUSTOMER_ENTITLEMENTS.superKids);
        if (!access?.hasAccess || access.email !== recipientEmail) {
          return NextResponse.json(
            { ok: false, error: "super_kids_access_required" },
            { status: 403 },
          );
        }
        customerId = access.customerId;
      }
    }

    if (!recipientEmail || !recipientEmail.includes("@") || recipientEmail.length > 254) {
      return NextResponse.json({ ok:false, error:"recipient_email_invalid" }, { status:400 });
    }
    if (!checkoutBase) {
      return NextResponse.json({ ok:false, error:"product_invalid" }, { status:400 });
    }

    const attribution = cleanAttribution(body?.attribution);
    const token = crypto.randomUUID().replace(/-/g, "");
    const db = createSupabaseAdminClient();
    let promo: null | { code: string; slot: number; remaining: number; expiresAt: string } = null;

    // Enforce the module upgrade path on the server. UI checks are only a
    // convenience; direct requests must not bypass the Rp0 exclusivity rule.
    if (!isTopup && !isMandarinMember) {
      const { data: customer, error: customerError } = await db
        .from("customers")
        .select("id")
        .ilike("email", recipientEmail)
        .maybeSingle();
      if (customerError) throw customerError;

      if (customer?.id) {
        const now = new Date().toISOString();
        const { data: activeSubscriptions, error: subscriptionError } = await db
          .from("subscriptions")
          .select("plans!inner(code)")
          .eq("customer_id", customer.id)
          .eq("status", "active")
          .or(`expires_at.is.null,expires_at.gt.${now}`)
          .in("plans.code", ["PBSK-PREMIUM-1Y", "PBM-MANDARIN-1Y"]);
        if (subscriptionError) throw subscriptionError;

        const activeCodes = new Set((activeSubscriptions || []).flatMap((item: any) => {
          const plan = Array.isArray(item.plans) ? item.plans[0] : item.plans;
          return plan?.code ? [String(plan.code)] : [];
        }));
        const hasSuperKids = activeCodes.has("PBSK-PREMIUM-1Y");
        const hasMandarin = activeCodes.has("PBM-MANDARIN-1Y");

        if (productSku === "PBSK-SUPER-KIDS" && hasSuperKids) {
          return NextResponse.json({ ok: false, error: "super_kids_already_active" }, { status: 409 });
        }
        if (productSku === "PBSK-SUPER-KIDS" && hasMandarin) {
          return NextResponse.json({ ok: false, error: "mandarin_story_topup_only" }, { status: 409 });
        }
        if (productSku === "PBM-MANDARIN" && hasMandarin) {
          return NextResponse.json({ ok: false, error: "mandarin_already_active" }, { status: 409 });
        }
        if (productSku === "PBM-MANDARIN" && hasSuperKids) {
          return NextResponse.json({ ok: false, error: "mandarin_member_addon_required" }, { status: 409 });
        }
      }
    }

    const promotionKey = PROMOTION_BY_SKU[productSku];
    if (promotionKey) {
      const { data: reservation, error: reservationError } = await db.rpc("reserve_promo_claim", {
        p_promotion_key: promotionKey,
        p_recipient_email: recipientEmail,
        p_checkout_intent_key: token,
      });
      // Promo migration can be deployed independently. Until it exists or is
      // activated, checkout safely continues at the normal Rp25.000 price.
      if (!reservationError) {
        const row = Array.isArray(reservation) ? reservation[0] : reservation;
        if (row?.reserved && row?.coupon_code) {
          promo = {
            code: String(row.coupon_code),
            slot: Number(row.slot_number),
            remaining: Number(row.remaining),
            expiresAt: String(row.reservation_expires_at),
          };
        }
      }
    }

    // Keep only the newest pending intent for this recipient + SKU. Older
    // abandoned attempts would otherwise make webhook recovery ambiguous if
    // OrderHero omits our UTM token.
    await db.from("webhook_events")
      .update({
        status: "ignored",
        error: "Superseded by a newer checkout intent.",
        processed_at: new Date().toISOString(),
      })
      .eq("provider", "retail_checkout")
      .eq("status", "pending")
      .contains("payload", {
        recipient_email: recipientEmail,
        product_sku: productSku,
        ...((isTopup || isMandarinMember)
          ? { intent_type: isMandarinMember ? "member_addon" : "member_topup" }
          : {}),
      });

    const { error } = await db.from("webhook_events").insert({
      provider: "retail_checkout",
      event_key: token,
      status: "pending",
      payload: {
        intent_type: isMandarinMember ? "member_addon" : isTopup ? "member_topup" : "recipient_purchase",
        auth_user_id: authUserId,
        customer_id: customerId,
        recipient_email: recipientEmail,
        product_sku: productSku,
        attribution,
        promo_key: promo ? promotionKey : null,
        promo_slot: promo?.slot ?? null,
        created_at: new Date().toISOString(),
      },
      normalized: {
        intentType: isMandarinMember ? "member_addon" : isTopup ? "member_topup" : "recipient_purchase",
        recipientEmail,
        productSku,
      },
    });
    if (error) throw error;

    const url = new URL(checkoutBase);
    for (const key of ["utm_source","utm_medium","utm_campaign","utm_term","fbclid"]) {
      if (attribution[key]) url.searchParams.set(key, attribution[key]);
    }
    url.searchParams.set("utm_content", `pbint_${token}`);

    return NextResponse.json({ ok:true, url:url.toString(), promo });
  } catch {
    return NextResponse.json({ ok:false, error:"prepare_failed" }, { status:500 });
  }
}
