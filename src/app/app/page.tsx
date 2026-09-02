import Image from "next/image";
import Link from "next/link";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import { requireCustomerAccess } from "@/lib/customer-access";
import { getRuntimeBrand } from "@/lib/white-label/settings";

export const dynamic = "force-dynamic";

export default async function CustomerAppPage() {
  const [access, brand] = await Promise.all([requireCustomerAccess(), getRuntimeBrand()]);
  return <main className="min-h-[100dvh] bg-surface px-5 py-8 text-ink"><div className="mx-auto max-w-3xl">
    <header className="flex items-center gap-3"><Image src={brand.logoSrc || "/logo.png"} alt={brand.name} width={64} height={64} className="rounded-2xl"/><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-primary">Papa Bonski Member</p><h1 className="text-2xl font-extrabold">Halo, {access.customerName} 👋</h1></div></header>
    <div className="mt-6 rounded-[2rem] bg-surface-card p-6 shadow-lg ring-1 ring-black/[0.05]"><h2 className="text-xl font-extrabold">Apa yang ingin dilakukan hari ini?</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">
      <Link href="/create" className="rounded-2xl bg-brand-primary p-5 font-extrabold text-white shadow-sm">✨ Buat Cerita Personal<div className="mt-1 text-xs font-semibold opacity-80">Buat cerita sesuai profil dan kebutuhan anak.</div></Link>
      <Link href="/collection" className="rounded-2xl bg-white p-5 font-extrabold ring-1 ring-black/[0.06]">📚 Koleksi Cerita<div className="mt-1 text-xs font-semibold text-ink-soft">Lanjutkan dan baca cerita yang sudah dibuat.</div></Link>
      <Link href="/cerita/video" className="rounded-2xl bg-white p-5 font-extrabold ring-1 ring-black/[0.06]">🎬 English Learning<div className="mt-1 text-xs font-semibold text-ink-soft">Video, vocabulary, PDF dan kuis.</div></Link>
      <Link href="/install" className="rounded-2xl bg-white p-5 font-extrabold ring-1 ring-black/[0.06]">📲 Install Aplikasi<div className="mt-1 text-xs font-semibold text-ink-soft">Pasang Papa Bonski di Home Screen.</div></Link>
    </div></div>
    <div className="mt-5"><PwaInstallPrompt /></div>
    <div className="mt-5 rounded-2xl bg-surface-card p-4 text-sm text-ink-soft ring-1 ring-black/[0.05]">Status akun: <b className="text-emerald-700">Aktif</b>{access.expiresAt ? <> · Masa akses sampai <b className="text-ink">{new Date(access.expiresAt).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })}</b></> : null}</div>
  </div></main>;
}
