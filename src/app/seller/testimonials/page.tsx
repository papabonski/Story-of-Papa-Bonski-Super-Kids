import Link from "next/link";
import TestimonialModerationActions from "@/components/seller/TestimonialModerationActions";
import { requireSellerSession } from "@/lib/seller-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { TESTIMONIAL_PRODUCTS } from "@/lib/testimonials";

export const dynamic = "force-dynamic";

const productByPromotion = Object.fromEntries(
  Object.values(TESTIMONIAL_PRODUCTS).map((config) => [config.promotionKey, config.name]),
) as Record<string, string>;

export default async function SellerTestimonialsPage() {
  await requireSellerSession("/seller/testimonials");
  const db = createSupabaseAdminClient();
  const { data: testimonials } = await db.from("testimonials")
    .select("id,promo_claim_id,rating,review,publication_consent,display_name,moderation_status,submitted_at,published_at")
    .order("submitted_at", { ascending: false });
  const claimIds = (testimonials || []).map((item) => item.promo_claim_id);
  const { data: claims } = claimIds.length
    ? await db.from("promo_claims").select("id,promotion_key").in("id", claimIds)
    : { data: [] as Array<{ id: string; promotion_key: string }> };
  const promotionByClaim = new Map((claims || []).map((claim) => [String(claim.id), String(claim.promotion_key)]));

  return <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink"><div className="mx-auto max-w-5xl">
    <Link href="/seller" className="text-sm font-extrabold text-brand-primary">← Seller Center</Link>
    <h1 className="mt-4 text-3xl font-extrabold">Moderasi Testimoni</h1>
    <p className="mt-2 text-sm text-ink-soft">Hanya testimoni yang disetujui dan memiliki izin publikasi yang tampil di landing page produk terkait.</p>
    <div className="mt-7 space-y-4">
      {(testimonials || []).length ? (testimonials || []).map((item) => {
        const promotionKey = promotionByClaim.get(String(item.promo_claim_id)) || "";
        return <article key={item.id} className="rounded-3xl bg-white p-6 ring-1 ring-black/[.06]">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wide text-brand-primary">{productByPromotion[promotionKey] || "Produk Papa Bonski"}</p><h2 className="mt-1 font-extrabold">{item.display_name} · {"★".repeat(Number(item.rating))}</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{item.moderation_status}</span></div>
          <blockquote className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">“{item.review}”</blockquote>
          <p className="mt-3 text-xs text-ink-soft">Izin publikasi: <b>{item.publication_consent ? "Ya" : "Tidak"}</b> · Dikirim {new Date(item.submitted_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}</p>
          <TestimonialModerationActions id={String(item.id)} canApprove={Boolean(item.publication_consent)} />
        </article>;
      }) : <div className="rounded-3xl bg-white p-6 text-sm text-ink-soft ring-1 ring-black/[.06]">Belum ada testimoni yang masuk.</div>}
    </div>
  </div></main>;
}
