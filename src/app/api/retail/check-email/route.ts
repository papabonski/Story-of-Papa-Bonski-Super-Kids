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
      return NextResponse.json({ ok: true, hasActivePackage: false });
    }

    const now = new Date().toISOString();
    const { data: subscription, error: subscriptionError } = await db
      .from("subscriptions")
      .select("id,expires_at,plans!inner(code)")
      .eq("customer_id", customer.id)
      .eq("status", "active")
      .eq("plans.code", "PBSK-PREMIUM-1Y")
      .gt("expires_at", now)
      .order("expires_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subscriptionError) throw subscriptionError;

    return NextResponse.json({
      ok: true,
      hasActivePackage: Boolean(subscription?.id),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "check_failed" }, { status: 500 });
  }
}
