import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const TOPUP_CHECKOUTS: Record<string, string> = {
  "PBSK-STORY-CREDIT-3": "https://papabonski.orderhero.id/form/papa-bonski-tambah-3-cerita",
  "PBSK-STORY-CREDIT-8": "https://papabonski.orderhero.id/form/papa-bonski-tambah-8-cerita",
};

function normalizeEmail(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

export async function GET(req: Request) {
  try {
    const requestUrl = new URL(req.url);
    const productSku = String(requestUrl.searchParams.get("sku") || "").trim().toUpperCase();
    const checkoutBase = TOPUP_CHECKOUTS[productSku];

    if (!checkoutBase) {
      return NextResponse.json({ ok: false, error: "topup_product_invalid" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const recipientEmail = normalizeEmail(user?.email);

    if (!user || user.is_anonymous || !recipientEmail) {
      const loginUrl = new URL("/login", requestUrl.origin);
      loginUrl.searchParams.set("next", "/app");
      return NextResponse.redirect(loginUrl, 303);
    }

    const db = createSupabaseAdminClient();

    const { data: customer, error: customerError } = await db
      .from("customers")
      .select("id,status")
      .ilike("email", recipientEmail)
      .eq("status", "active")
      .maybeSingle();
    if (customerError) throw customerError;

    if (!customer?.id) {
      return NextResponse.json(
        { ok: false, error: "active_member_not_found" },
        { status: 403 },
      );
    }

    const nowIso = new Date().toISOString();
    const { data: activeSub, error: subError } = await db
      .from("subscriptions")
      .select("id")
      .eq("customer_id", customer.id)
      .eq("status", "active")
      .gt("expires_at", nowIso)
      .order("expires_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (subError) throw subError;

    if (!activeSub?.id) {
      return NextResponse.json(
        { ok: false, error: "active_subscription_required" },
        { status: 403 },
      );
    }

    const token = crypto.randomUUID().replace(/-/g, "");
    const createdAt = new Date().toISOString();

    // Only the newest open top-up intent for this member + SKU remains valid.
    const { error: supersedeError } = await db
      .from("webhook_events")
      .update({
        status: "ignored",
        error: "Superseded by a newer signed-in member top-up intent.",
        processed_at: createdAt,
      })
      .eq("provider", "retail_checkout")
      .eq("status", "pending")
      .contains("payload", {
        intent_type: "member_topup",
        recipient_email: recipientEmail,
        product_sku: productSku,
      });
    if (supersedeError) throw supersedeError;

    const { error: intentError } = await db.from("webhook_events").insert({
      provider: "retail_checkout",
      event_key: token,
      status: "pending",
      payload: {
        intent_type: "member_topup",
        auth_user_id: user.id,
        customer_id: customer.id,
        recipient_email: recipientEmail,
        product_sku: productSku,
        created_at: createdAt,
      },
      normalized: {
        intentType: "member_topup",
        recipientEmail,
        productSku,
      },
    });
    if (intentError) throw intentError;

    const checkoutUrl = new URL(checkoutBase);
    // Keep the token for OrderHero versions that preserve UTM. The webhook is
    // also able to recover a unique recent signed-in top-up intent if OrderHero
    // omits UTM data.
    checkoutUrl.searchParams.set("utm_content", `pbint_${token}`);

    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error) {
    console.error("member-topup checkout failed", error);
    return NextResponse.json(
      { ok: false, error: "member_topup_prepare_failed" },
      { status: 500 },
    );
  }
}
