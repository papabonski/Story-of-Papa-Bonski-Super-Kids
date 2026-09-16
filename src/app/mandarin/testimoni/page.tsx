import Link from "next/link";
import MandarinTestimonialForm from "@/components/mandarin/MandarinTestimonialForm";
import { CUSTOMER_ENTITLEMENTS, requireCustomerAccess } from "@/lib/customer-access";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MandarinTestimonialPage() {
  const access = await requireCustomerAccess(CUSTOMER_ENTITLEMENTS.mandarin, "/mandarin/testimoni");
  const db = createSupabaseAdminClient();
  const { data: claim } = await db.from("promo_claims").select("id,feedback_submitted_at").eq("promotion_key","mandarin-launch-50").eq("customer_id",access.customerId).eq("status","activated").maybeSingle();
  const alreadySubmitted = Boolean(claim?.feedback_submitted_at);

  return <main className="min-h-[100dvh] bg-[#f5eee3] px-5 py-8 text-ink"><div className="mx-auto max-w-2xl">
    <Link href="/mandarin" className="text-sm font-extrabold text-brand-primary">← Kembali ke Mandarin</Link>
    <section className="mt-5 rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-black/[.06] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[.16em] text-brand-primary">Program 50 pengguna awal</p>
      <h1 className="mt-2 text-3xl font-extrabold">Bagaimana pengalaman belajar anak?</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">Terima kasih sudah mencoba Papa Bonski Mandarin. Kami meminta ulasan jujur setelah pemakaian—pujian, kritik, dan saran semuanya berguna.</p>
      <div className="mt-7">{!claim?<div className="rounded-2xl bg-amber-50 p-5 text-sm font-semibold text-amber-900">Form ini khusus peserta promo 50 pengguna awal.</div>:alreadySubmitted?<div className="rounded-2xl bg-emerald-50 p-5 font-bold text-emerald-900">Ulasan Anda sudah diterima. Terima kasih.</div>:<MandarinTestimonialForm customerName={access.customerName}/>}</div>
    </section>
  </div></main>;
}

