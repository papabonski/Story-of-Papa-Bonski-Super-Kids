import "server-only";

import { TESTIMONIAL_PRODUCTS, type TestimonialProduct } from "@/lib/testimonials";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);
}

export async function sendTestimonialReminder({
  to,
  product,
  reminderNumber,
  idempotencyKey,
}: {
  to: string;
  product: TestimonialProduct;
  reminderNumber: number;
  idempotencyKey: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY belum dikonfigurasi.");

  const config = TESTIMONIAL_PRODUCTS[product];
  const origin = (process.env.NEXT_PUBLIC_APP_URL || "https://www.papabonski.com").replace(/\/$/, "");
  const formUrl = `${origin}${config.formPath}`;
  const isFirstRequest = reminderNumber === 1;
  const subject = isFirstRequest
    ? `Bagaimana pengalaman Anda dengan ${config.name}?`
    : `Pengingat ramah: ulasan ${config.name}`;
  const heading = isFirstRequest ? "Boleh berbagi pengalaman setelah satu hari mencoba?" : "Kami masih menunggu cerita jujur Anda";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: process.env.TESTIMONIAL_EMAIL_FROM || "Papa Bonski <halo@papabonski.com>",
      to: [to],
      subject,
      html: `<!doctype html><html><body style="margin:0;background:#f7f1e8;font-family:Arial,sans-serif;color:#2d1b12"><div style="max-width:560px;margin:0 auto;padding:32px 20px"><div style="background:#fff;border-radius:24px;padding:28px"><p style="color:#e85d04;font-size:12px;font-weight:700;text-transform:uppercase">Papa Bonski</p><h1 style="font-size:24px;line-height:1.25">${escapeHtml(heading)}</h1><p style="line-height:1.7">Terima kasih sudah mencoba ${escapeHtml(config.name)}. Ulasan tidak harus positif—kritik dan saran jujur sangat membantu kami memperbaiki pengalaman belajar anak.</p><p style="line-height:1.7">Pengisian hanya membutuhkan beberapa menit. Persetujuan untuk menampilkan kutipan di landing page tetap opsional.</p><p style="margin:28px 0"><a href="${escapeHtml(formUrl)}" style="display:inline-block;background:#e85d04;color:#fff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px">Isi Ulasan Jujur</a></p><p style="font-size:12px;color:#735c50">Akses Anda tetap aktif seumur hidup dan tidak bergantung pada isi ulasan.</p></div></div></body></html>`,
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(String(result?.message || result?.error || `Resend ${response.status}`));
  return result;
}
