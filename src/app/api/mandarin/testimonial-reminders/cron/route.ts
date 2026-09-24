import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const PROMOTION_KEY = "mandarin-launch-50";
const MAX_REMINDERS = 2;
const FOLLOW_UP_DELAY_MS = 3 * 24 * 60 * 60 * 1000;

type DueClaim = {
  id: string;
  recipient_email: string;
  feedback_due_at: string;
  last_reminded_at: string | null;
  reminder_count: number;
};

function appUrl(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  return (configured || new URL(req.url).origin).replace(/\/$/, "");
}

function emailHtml(link: string, reminderNumber: number): string {
  const intro = reminderNumber === 1
    ? "Sudah satu hari sejak Bunda mencoba Papa Bonski Mandarin bersama ananda."
    : "Kami ingin mengingatkan kembali, bila Bunda berkenan, untuk membagikan pengalaman menggunakan Papa Bonski Mandarin.";

  return `<!doctype html>
<html lang="id"><body style="margin:0;background:#fff8ef;font-family:Arial,sans-serif;color:#4b2412">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <div style="background:#ffffff;border:1px solid #f2dfcf;border-radius:20px;padding:28px">
      <p style="margin:0 0 8px;color:#ec6508;font-weight:700">Papa Bonski Mandarin</p>
      <h1 style="font-size:24px;line-height:1.25;margin:0 0 16px">Boleh berbagi pengalaman, Bunda?</h1>
      <p style="font-size:16px;line-height:1.65;margin:0 0 12px">${intro}</p>
      <p style="font-size:16px;line-height:1.65;margin:0 0 24px">Ulasan jujur Bunda membantu kami memperbaiki produk dan membantu orang tua lain mengenal pengalaman belajar ini. Akses seumur hidup Bunda tidak terpengaruh oleh isi ulasan.</p>
      <a href="${link}" style="display:inline-block;background:#ef6508;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px">Isi Testimoni Mandarin</a>
      <p style="font-size:13px;line-height:1.5;color:#806251;margin:24px 0 0">Jika tombol tidak dapat dibuka, salin tautan ini:<br><a href="${link}" style="color:#c94e00">${link}</a></p>
    </div>
  </div>
</body></html>`;
}

async function sendReminder(req: Request, claim: DueClaim, reminderNumber: number) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY belum dikonfigurasi.");

  const link = `${appUrl(req)}/mandarin/testimoni`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `mandarin-testimonial-${claim.id}-${reminderNumber}`,
    },
    body: JSON.stringify({
      from: process.env.TESTIMONIAL_EMAIL_FROM || "Papa Bonski <halo@papabonski.com>",
      to: [claim.recipient_email],
      subject: reminderNumber === 1
        ? "Bagaimana pengalaman Bunda dengan Papa Bonski Mandarin?"
        : "Pengingat untuk berbagi pengalaman Papa Bonski Mandarin",
      html: emailHtml(link, reminderNumber),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend ${response.status}: ${detail.slice(0, 300)}`);
  }
}

export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const db = createSupabaseAdminClient();
  const now = new Date();
  const { data, error } = await db.from("promo_claims")
    .select("id,recipient_email,feedback_due_at,last_reminded_at,reminder_count")
    .eq("promotion_key", PROMOTION_KEY)
    .eq("status", "activated")
    .is("feedback_submitted_at", null)
    .lte("feedback_due_at", now.toISOString())
    .lt("reminder_count", MAX_REMINDERS)
    .order("feedback_due_at", { ascending: true })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const claims = ((data ?? []) as DueClaim[]).filter((claim) => {
    if (claim.reminder_count === 0) return true;
    if (!claim.last_reminded_at) return true;
    return now.getTime() - new Date(claim.last_reminded_at).getTime() >= FOLLOW_UP_DELAY_MS;
  });

  let sent = 0;
  let failed = 0;
  for (const claim of claims) {
    const reminderNumber = claim.reminder_count + 1;
    try {
      await sendReminder(req, claim, reminderNumber);
      const sentAt = new Date().toISOString();
      const { error: updateError } = await db.from("promo_claims")
        .update({
          reminder_count: reminderNumber,
          last_reminded_at: sentAt,
          updated_at: sentAt,
        })
        .eq("id", claim.id)
        .eq("reminder_count", claim.reminder_count)
        .is("feedback_submitted_at", null);
      if (updateError) throw updateError;
      sent += 1;
    } catch (sendError) {
      failed += 1;
      console.error("Mandarin testimonial reminder failed", claim.id, sendError);
    }
  }

  return NextResponse.json({ ok: failed === 0, eligible: claims.length, sent, failed });
}
