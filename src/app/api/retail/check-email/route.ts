import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function normalizeEmail(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(body?.email);
    const productSku = String(body?.productSku || "PBSK-SUPER-KIDS").trim().toUpperCase();
    const planCode = productSku.startsWith("PBM-MANDARIN") ? "PBM-MANDARIN-1Y" : "PBSK-PREMIUM-1Y";

    if (!email || !email.includes("@") || email.length > 254) {
      return NextResponse.json({ ok: false, error: "email_invalid" }, { status: 400 });
    }

    const db = createSupabaseAdminClient();
    const { data: customer, error: customerError } = await db
      .from("customers")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    if (customerError) throw customerError;
    if (!customer?.id) {
      return NextResponse.json({ ok: true, hasActivePackage: false, hasActiveSuperKids: false });
    }

    const now = new Date().toISOString();
    const [
      { data: subscription, error: subscriptionError },
      { data: superKidsSubscription, error: superKidsError },
    ] = await Promise.all([
      db
        .from("subscriptions")
        .select("id,expires_at,plans!inner(code)")
        .eq("customer_id", customer.id)
        .eq("status", "active")
        .eq("plans.code", planCode)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order("expires_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      db
        .from("subscriptions")
        .select("id,expires_at,plans!inner(code)")
        .eq("customer_id", customer.id)
        .eq("status", "active")
        .eq("plans.code", "PBSK-PREMIUM-1Y")
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order("expires_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (subscriptionError) throw subscriptionError;
    if (superKidsError) throw superKidsError;

    return NextResponse.json({
      ok: true,
      hasActivePackage: Boolean(subscription?.id),
      hasActiveSuperKids: Boolean(superKidsSubscription?.id),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "check_failed" }, { status: 500 });
  }
}
