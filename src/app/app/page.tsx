import Image from "next/image";
import Link from "next/link";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import { requireCustomerAccess } from "@/lib/customer-access";
import { getOrCreateUserId } from "@/lib/supabase/auth";
import { getStoryQuotaForUser } from "@/lib/story-quota";
import { getRuntimeBrand } from "@/lib/white-label/settings";

export const dynamic = "force-dynamic";

export default async function CustomerAppPage() {
  const [access, brand, quota] = await Promise.all([
    requireCustomerAccess(),
    getRuntimeBrand(),
    loadStoryQuota(),
  ]);

  const quotaExhausted = Boolean(quota && quota.remaining <= 0);

  return <main className="min-h-[100dvh] bg-surface px-5 py-8 text-ink"><div className="mx-auto max-w-3xl">
    <header className="flex items-center gap-3"><Image src={brand.logoSrc || "/logo.png"} alt={brand.name} width={64} height={64} className="rounded-2xl"/><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-primary">Papa Bonski Member</p><h1 className="text-2xl font-extrabold">Halo, {access.customerName} 👋</h1></div></header>

    <div className="mt-6 rounded-[2rem] bg-surface-card p-6 shadow-lg ring-1 ring-black/[0.05]"><h2 className="text-xl font-extrabold">Apa yang ingin dilakukan hari ini?</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">
      <Link href="/create" className={`rounded-2xl p-5 font-extrabold shadow-sm ${quotaExhausted ? "bg-red-50 text-red-800 ring-1 ring-red-100" : "bg-brand-primary text-white"}`}>{quotaExhausted ? "🔒 Kuota Cerita Habis" : "✨ Buat Cerita Personal"}<div className={`mt-1 text-xs font-semibold ${quotaExhausted ? "text-red-700/80" : "opacity-80"}`}>{quotaExhausted ? "Tambah kuota untuk membuat cerita baru." : "Buat cerita sesuai profil dan kebutuhan anak."}</div></Link>
      <Link href="/collection" className="rounded-2xl bg-white p-5 font-extrabold ring-1 ring-black/[0.06]">📚 Koleksi Cerita<div className="mt-1 text-xs font-semibold text-ink-soft">Lanjutkan dan baca cerita yang sudah dibuat.</div></Link>
      <Link href="/cerita/video" className="rounded-2xl bg-white p-5 font-extrabold ring-1 ring-black/[0.06]">🎬 English Learning<div className="mt-1 text-xs font-semibold text-ink-soft">Video, vocabulary, PDF dan kuis.</div></Link>
      <Link href="/install" className="rounded-2xl bg-white p-5 font-extrabold ring-1 ring-black/[0.06]">📲 Install Aplikasi<div className="mt-1 text-xs font-semibold text-ink-soft">Pasang Papa Bonski di Home Screen.</div></Link>
    </div></div>

    {quota && (
      <section className={`mt-5 rounded-[2rem] p-5 ring-1 ${quotaExhausted ? "bg-red-50 text-red-800 ring-red-100" : "bg-emerald-50 text-emerald-900 ring-emerald-100"}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide opacity-70">Kuota Cerita</p>
            <p className="mt-1 text-lg font-extrabold">{quota.used}/{quota.limit} terpakai · Sisa {quota.remaining}</p>
          </div>
          <span className="text-3xl" aria-hidden="true">{quotaExhausted ? "🔒" : "📚"}</span>
        </div>

        {quotaExhausted ? (
          <div className="mt-4">
            <p className="text-sm font-bold">Kuota sudah habis. Tambah kuota sekarang:</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <a href="/api/retail/member-topup?sku=PBSK-STORY-CREDIT-3" className="rounded-2xl bg-white px-4 py-4 text-center ring-1 ring-red-200 transition active:scale-95">
                <span className="block font-extrabold text-brand-primary">+3 Cerita</span>
                <span className="mt-1 block text-xs font-bold text-ink-soft">Rp50.000</span>
              </a>
              <a href="/api/retail/member-topup?sku=PBSK-STORY-CREDIT-8" className="rounded-2xl bg-brand-primary px-4 py-4 text-center text-white transition active:scale-95">
                <span className="block font-extrabold">+8 Cerita</span>
                <span className="mt-1 block text-xs font-bold text-white/90">Rp120.000 · Lebih hemat</span>
              </a>
            </div>
            <p className="mt-3 text-xs font-semibold text-red-700/80">Top-up otomatis masuk ke akun member yang sedang login.</p>
          </div>
        ) : (
          <p className="mt-2 text-sm font-semibold opacity-80">Kuota masih tersedia dan siap digunakan untuk membuat cerita baru.</p>
        )}
      </section>
    )}

    <div className="mt-5"><PwaInstallPrompt /></div>
    <div className="mt-5 rounded-2xl bg-surface-card p-4 text-sm text-ink-soft ring-1 ring-black/[0.05]">Status akun: <b className="text-emerald-700">Aktif</b>{access.expiresAt ? <> · Masa akses sampai <b className="text-ink">{new Date(access.expiresAt).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })}</b></> : null}</div>
  </div></main>;
}

async function loadStoryQuota() {
  try {
    const userId = await getOrCreateUserId();
    return await getStoryQuotaForUser(userId);
  } catch {
    return null;
  }
}
