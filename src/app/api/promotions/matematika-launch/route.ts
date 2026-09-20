import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = createSupabaseAdminClient();
    const { data: promo, error: promoError } = await db
      .from("promotions")
      .select("quota,active,starts_at,ends_at")
      .eq("key", "matematika-launch-50")
      .maybeSingle();
    if (promoError || !promo) throw promoError || new Error("promo_not_found");

    const now = new Date().toISOString();
    const active = Boolean(
      promo.active &&
      (!promo.starts_at || promo.starts_at <= now) &&
      (!promo.ends_at || promo.ends_at > now)
    );
    const { count, error: countError } = await db
      .from("promo_claims")
      .select("*", { count: "exact", head: true })
      .eq("promotion_key", "matematika-launch-50")
      .in("status", ["reserved", "activated"])
      .or(`status.eq.activated,reservation_expires_at.gt.${now}`);
    if (countError) throw countError;

    const claimed = Math.min(Number(count || 0), promo.quota);
    return NextResponse.json({
      ok: true,
      active,
      total: promo.quota,
      claimed,
      remaining: active ? Math.max(promo.quota - claimed, 0) : 0,
    }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, active: false, total: 50, claimed: 0, remaining: 0 });
  }
}
