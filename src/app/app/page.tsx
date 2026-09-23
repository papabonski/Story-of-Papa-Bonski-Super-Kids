import Image from "next/image";
import Link from "next/link";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import { CUSTOMER_ENTITLEMENTS, getCustomerAccess, requireCustomerPortalAccess } from "@/lib/customer-access";
import { getOrCreateUserId } from "@/lib/supabase/auth";
import { getStoryQuotaForUser } from "@/lib/story-quota";
import { getRuntimeBrand } from "@/lib/white-label/settings";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { customerLogout } from "./actions";

export const dynamic = "force-dynamic";

export default async function CustomerAppPage() {
  const [access, brand, superKidsAccess, mandarinAccess, matematikaAccess] = await Promise.all([
    requireCustomerPortalAccess(),
    getRuntimeBrand(),
    getCustomerAccess(CUSTOMER_ENTITLEMENTS.superKids),
    getCustomerAccess(CUSTOMER_ENTITLEMENTS.mandarin),
    getCustomerAccess(CUSTOMER_ENTITLEMENTS.matematika),
  ]);
  const hasSuperKids = Boolean(superKidsAccess?.hasAccess);
  const hasMandarin = Boolean(mandarinAccess?.hasAccess);
  const hasMatematika = Boolean(matematikaAccess?.hasAccess);
  const quota = hasSuperKids ? await loadStoryQuota() : null;
  const superKidsFeedbackDue = hasSuperKids
    ? await loadSuperKidsFeedbackDue(access.customerId)
    : false;

  const quotaExhausted = Boolean(quota && quota.remaining <= 0);

  return <main className="min-h-[100dvh] bg-surface px-5 py-8 text-ink"><div className="mx-auto max-w-3xl">
    <header className="flex items-center gap-3"><Image src={brand.logoSrc || "/logo.png"} alt={brand.name} width={64} height={64} className="rounded-2xl"/><div className="min-w-0"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-primary">Papa Bonski Member</p><h1 className="text-2xl font-extrabold">Halo! 👋</h1><p className="mt-0.5 truncate text-sm font-semibold text-ink-soft" title={access.email}>Masuk sebagai {access.email}</p></div></header>

    {superKidsFeedbackDue && <section className="mt-5 flex flex-col gap-3 rounded-[2rem] bg-amber-50 p-5 text-amber-950 ring-1 ring-amber-200 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-extrabold">Sudah mencoba Papa Bonski selama satu hari?</p><p className="mt-1 text-sm">Bagikan ulasan jujur Anda sebagai peserta program 50 pengguna awal.</p></div><Link href="/super-kids/testimoni" className="btn-primary shrink-0">Isi Ulasan</Link></section>}

    <div className="mt-6 rounded-[2rem] bg-surface-card p-6 shadow-lg ring-1 ring-black/[0.05]"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-brand-primary">Modul Saya</p><h2 className="mt-1 text-xl font-extrabold">Pilih modul yang sudah aktif</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">Akses seumur hidup</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2">
      {hasSuperKids ? <Link href="/create" className={`rounded-2xl p-5 font-extrabold shadow-sm ${quotaExhausted ? "bg-red-50 text-red-800 ring-1 ring-red-100" : "bg-brand-primary text-white"}`}>{quotaExhausted ? "🔒 Kuota Cerita Habis" : "✨ Buat Cerita Personal"}<div className={`mt-1 text-xs font-semibold ${quotaExhausted ? "text-red-700/80" : "opacity-80"}`}>{quotaExhausted ? "Tambah kuota untuk membuat cerita baru." : "Buat cerita sesuai profil dan kebutuhan anak."}</div></Link> : <LockedModule title="✨ Buat Cerita Personal" description="Memerlukan hak akses Super Kids." />}
      {hasSuperKids ? <Link href="/collection" className="rounded-2xl bg-white p-5 font-extrabold ring-1 ring-black/[0.06]">📚 Koleksi Cerita<div className="mt-1 text-xs font-semibold text-ink-soft">Lanjutkan dan baca cerita yang sudah dibuat.</div></Link> : <LockedModule title="📚 Koleksi Cerita" description="Memerlukan hak akses Super Kids." />}
      {hasSuperKids ? <Link href="/cerita/video" className="rounded-2xl bg-white p-5 font-extrabold ring-1 ring-black/[0.06]">🎬 English Learning<div className="mt-1 text-xs font-semibold text-ink-soft">Video, vocabulary, PDF dan kuis.</div></Link> : <LockedModule title="🎬 English Learning" description="Memerlukan hak akses Super Kids." />}
      {hasMandarin ? <Link href="/mandarin" className="rounded-2xl bg-[#176f67] p-5 font-extrabold text-white shadow-sm">🐼 Mandarin Learning<div className="mt-1 text-xs font-semibold text-white/80">18 mini-game, pelafalan, dan tantangan bintang.</div></Link> : <LockedModule title="🐼 Mandarin Learning" description="Modul ini belum dimiliki." />}
      {hasMatematika ? <Link href="/matematika" className="rounded-2xl bg-[#e85d04] p-5 font-extrabold text-white shadow-sm">➗ Matematika<div className="mt-1 text-xs font-semibold text-white/80">Empat level, soal acak, dan penjelasan langkah.</div></Link> : <LockedModule title="➗ Matematika" description="Modul ini belum dimiliki." />}
    </div></div>

    {(!hasSuperKids || !hasMandarin || !hasMatematika) && <section className="mt-5 rounded-[2rem] bg-violet-50 p-5 ring-1 ring-violet-200"><h2 className="font-extrabold text-violet-950">Tambah modul</h2><p className="mt-1 text-sm text-violet-800">Modul yang belum dibeli tetap terlihat tetapi terkunci.</p><div className="mt-4 flex flex-wrap gap-3">
      {!hasSuperKids && !(hasMandarin || hasMatematika) && <Link href="/super-kids" className="btn-secondary">Lihat Super Kids</Link>}
      {!hasSuperKids && (hasMandarin || hasMatematika) && <><a href="/api/retail/member-topup?sku=PBSK-STORY-CREDIT-3" className="btn-secondary">Paket Nambah · Rp60.000</a><a href="/api/retail/member-topup?sku=PBSK-STORY-CREDIT-8" className="btn-secondary">Paket Rame-rame · Rp120.000</a></>}
      {!hasMandarin && <Link href="/mandarin/checkout" className="btn-primary">Beli Mandarin {hasSuperKids || hasMatematika ? "Rp15.000" : "Rp25.000"}</Link>}
      {!hasMatematika && <Link href="/matematika/checkout" className="btn-primary">Beli Matematika {hasSuperKids || hasMandarin ? "Rp15.000" : "Rp25.000"}</Link>}
    </div></section>}

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
                <span className="block font-extrabold text-brand-primary">Paket Nambah · +3 Cerita</span>
                <span className="mt-1 block text-xs font-bold text-ink-soft">Rp60.000</span>
              </a>
              <a href="/api/retail/member-topup?sku=PBSK-STORY-CREDIT-8" className="rounded-2xl bg-brand-primary px-4 py-4 text-center text-white transition active:scale-95">
                <span className="block font-extrabold">Paket Rame-Rame · +8 Cerita</span>
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
    <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-surface-card p-4 text-sm text-ink-soft ring-1 ring-black/[0.05] sm:flex-row sm:items-center sm:justify-between">
      <div>Status akun: <b className="text-emerald-700">Aktif</b> · Hak modul yang dibeli berlaku <b className="text-ink">seumur hidup</b>.</div>
      <form action={customerLogout}>
        <button type="submit" className="font-extrabold text-red-700 underline decoration-red-200 underline-offset-4 hover:text-red-800">Keluar dari perangkat ini</button>
      </form>
    </div>
  </div></main>;
}

function LockedModule({ title, description }: { title: string; description: string }) {
  return <div aria-disabled="true" className="cursor-not-allowed rounded-2xl bg-slate-100 p-5 font-extrabold text-slate-500 ring-1 ring-slate-200"><div className="flex items-center justify-between gap-3"><span>{title}</span><span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] uppercase tracking-wide">Terkunci</span></div><div className="mt-1 text-xs font-semibold text-slate-400">{description}</div></div>;
}

async function loadStoryQuota() {
  try {
    const userId = await getOrCreateUserId();
    return await getStoryQuotaForUser(userId);
  } catch {
    return null;
  }
}

async function loadSuperKidsFeedbackDue(customerId: string) {
  try {
    const db = createSupabaseAdminClient();
    const { data } = await db.from("promo_claims")
      .select("feedback_due_at,feedback_submitted_at")
      .eq("promotion_key", "super-kids-launch-50")
      .eq("customer_id", customerId)
      .eq("status", "activated")
      .maybeSingle();
    return Boolean(
      data?.feedback_due_at &&
      !data.feedback_submitted_at &&
      new Date(data.feedback_due_at).getTime() <= Date.now()
    );
  } catch {
    return false;
  }
}
