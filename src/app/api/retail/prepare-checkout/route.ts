import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const CHECKOUTS: Record<string,string> = {
  "PBSK-SUPER-KIDS": "https://papabonski.orderhero.id/form/papa-bonski-super-kids",
  "PBSK-STORY-CREDIT-3": "https://papabonski.orderhero.id/form/papa-bonski-tambah-3-cerita",
  "PBSK-STORY-CREDIT-8": "https://papabonski.orderhero.id/form/papa-bonski-tambah-8-cerita",
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
    let authUserId: string | null = null;

    // Top-up ownership is derived ONLY from the authenticated member session.
    // Never fall back to an email supplied by the browser or by OrderHero.
    if (isTopup) {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.is_anonymous || !user.email) {
        return NextResponse.json(
          { ok: false, error: "topup_login_required" },
          { status: 401 },
        );
      }
      authUserId = user.id;
      recipientEmail = normalizeEmail(user.email);
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
        ...(isTopup ? { intent_type: "member_topup" } : {}),
      });

    const { error } = await db.from("webhook_events").insert({
      provider: "retail_checkout",
      event_key: token,
      status: "pending",
      payload: {
        intent_type: isTopup ? "member_topup" : "recipient_purchase",
        auth_user_id: authUserId,
        recipient_email: recipientEmail,
        product_sku: productSku,
        attribution,
        created_at: new Date().toISOString(),
      },
      normalized: {
        intentType: isTopup ? "member_topup" : "recipient_purchase",
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

    return NextResponse.json({ ok:true, url:url.toString() });
  } catch {
    return NextResponse.json({ ok:false, error:"prepare_failed" }, { status:500 });
  }
}
