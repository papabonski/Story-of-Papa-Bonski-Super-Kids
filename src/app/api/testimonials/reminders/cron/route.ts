import { NextResponse } from "next/server";
import { sendTestimonialReminder } from "@/lib/email/testimonial-reminder";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { TESTIMONIAL_PRODUCTS, type TestimonialProduct } from "@/lib/testimonials";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_EMAILS_PER_RUN = 25;
const MAX_REMINDERS = 3;
const REMINDER_GAP_MS = 3 * 24 * 60 * 60 * 1000;

const productByPromotion = Object.fromEntries(
  Object.entries(TESTIMONIAL_PRODUCTS).map(([product, config]) => [config.promotionKey, product]),
) as Record<string, TestimonialProduct>;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY_missing" }, { status: 503 });
  }

  const db = createSupabaseAdminClient();
  const now = new Date();
  const reminderCutoff = new Date(now.getTime() - REMINDER_GAP_MS).toISOString();
  const { data: claims, error } = await db
    .from("promo_claims")
    .select("id,promotion_key,recipient_email,feedback_due_at,feedback_submitted_at,last_reminded_at,reminder_count")
    .eq("status", "activated")
    .is("feedback_submitted_at", null)
    .lte("feedback_due_at", now.toISOString())
    .lt("reminder_count", MAX_REMINDERS)
    .or(`last_reminded_at.is.null,last_reminded_at.lte.${reminderCutoff}`)
    .order("feedback_due_at", { ascending: true })
    .limit(MAX_EMAILS_PER_RUN);
  if (error) return NextResponse.json({ ok: false, error: "claims_query_failed" }, { status: 500 });

  let sent = 0;
  const failures: Array<{ claimId: string; error: string }> = [];
  for (const claim of claims || []) {
    const product = productByPromotion[String(claim.promotion_key)];
    if (!product) continue;
    const reminderNumber = Number(claim.reminder_count || 0) + 1;
    try {
      await sendTestimonialReminder({
        to: String(claim.recipient_email),
        product,
        reminderNumber,
        idempotencyKey: `testimonial-${claim.id}-${reminderNumber}`,
      });
      const { error: updateError } = await db.from("promo_claims").update({
        reminder_count: reminderNumber,
        last_reminded_at: now.toISOString(),
        updated_at: now.toISOString(),
      }).eq("id", claim.id).is("feedback_submitted_at", null);
      if (updateError) throw updateError;
      sent += 1;
    } catch (sendError) {
      failures.push({ claimId: String(claim.id), error: sendError instanceof Error ? sendError.message : "send_failed" });
    }
  }

  return NextResponse.json({ ok: failures.length === 0, due: claims?.length || 0, sent, failed: failures.length, failures });
}
