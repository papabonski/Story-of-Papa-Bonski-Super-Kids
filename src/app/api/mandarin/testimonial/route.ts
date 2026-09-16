import { NextResponse } from "next/server";
import { CUSTOMER_ENTITLEMENTS, getCustomerAccess } from "@/lib/customer-access";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function context() {
  const access = await getCustomerAccess(CUSTOMER_ENTITLEMENTS.mandarin);
  if (!access?.hasAccess) return null;
  const db = createSupabaseAdminClient();
  const { data: claim } = await db.from("promo_claims")
    .select("id,feedback_due_at,feedback_submitted_at")
    .eq("promotion_key", "mandarin-launch-50")
    .eq("customer_id", access.customerId)
    .eq("status", "activated")
    .maybeSingle();
  return { access, db, claim };
}
export async function GET() {
  const ctx = await context();
  if (!ctx) return NextResponse.json({ ok: false, error: "access_required" }, { status: 401 });
  if (!ctx.claim) return NextResponse.json({ ok: true, eligible: false });
  const { data: testimonial } = await ctx.db.from("testimonials")
    .select("rating,review,publication_consent,display_name,moderation_status,submitted_at")
    .eq("promo_claim_id", ctx.claim.id)
    .maybeSingle();
  return NextResponse.json({ ok: true, eligible: true, claim: ctx.claim, testimonial });
}

export async function POST(req: Request) {
  const ctx = await context();
  if (!ctx) return NextResponse.json({ ok: false, error: "access_required" }, { status: 401 });
  if (!ctx.claim) return NextResponse.json({ ok: false, error: "promo_claim_required" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const rating = Number(body?.rating);
  const review = String(body?.review || "").trim();
  const publicationConsent = body?.publicationConsent === true;
  const displayName = String(body?.displayName || "Anonim").trim().slice(0, 80);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: "rating_invalid" }, { status: 400 });
  }
  if (review.length < 20 || review.length > 2000 || !displayName) {
    return NextResponse.json({ ok: false, error: "review_invalid" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { error } = await ctx.db.from("testimonials").upsert({
    promo_claim_id: ctx.claim.id,
    customer_id: ctx.access.customerId,
    rating,
    review,
    publication_consent: publicationConsent,
    display_name: displayName,
    moderation_status: "submitted",
    submitted_at: now,
    updated_at: now,
  }, { onConflict: "promo_claim_id" });
  if (error) return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });

  await ctx.db.from("promo_claims").update({ feedback_submitted_at: now, updated_at: now }).eq("id", ctx.claim.id);
  return NextResponse.json({ ok: true });
}
