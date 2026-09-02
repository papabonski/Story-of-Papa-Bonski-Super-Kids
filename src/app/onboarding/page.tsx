import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { claimCustomerByVerifiedEmail, getCustomerAccess } from "@/lib/customer-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRuntimeBrand } from "@/lib/white-label/settings";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const brand = await getRuntimeBrand();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.is_anonymous || !user.email) redirect("/login");

  await claimCustomerByVerifiedEmail();
  const access = await getCustomerAccess();

  if (!access) return <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink"><div className="mx-auto max-w-lg rounded-[2rem] bg-surface-card p-7 text-center shadow-xl ring-1 ring-black/[0.06]">
    <Image src={brand.logoSrc || "/logo.png"} alt={brand.name} width={104} height={104} className="mx-auto rounded-3xl" />
    <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">Aktivasi Akses</p>
    <h1 className="mt-2 text-2xl font-extrabold">Pembelian belum ditemukan</h1>
    <p className="mt-3 text-sm leading-relaxed text-ink-soft">Kami sudah memverifikasi email <b>{user.email}</b>, tetapi belum menemukan transaksi Papa Bonski Super Kids yang aktif dengan email tersebut.</p>
    <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-left text-sm text-amber-900"><b>Yang bisa dilakukan:</b><br/>1. Pastikan email ini sama dengan email saat pembelian.<br/>2. Jika baru membayar, tunggu sebentar lalu muat ulang halaman.<br/>3. Jika tetap belum aktif, hubungi Papa Bonski dan sertakan bukti pembayaran atau nomor pesanan.</div>
    <Link href="/login" className="btn-secondary mt-6">Gunakan Email Lain</Link>
  </div></main>;

  if (!access.hasAccess) redirect("/account/inactive");

  return <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink"><div className="mx-auto max-w-lg">
    <div className="rounded-[2rem] bg-surface-card p-7 text-center shadow-xl ring-1 ring-black/[0.06]">
      <Image src={brand.logoSrc || "/logo.png"} alt={brand.name} width={116} height={116} className="mx-auto rounded-3xl" />
      <div className="mt-4 text-4xl">🎉</div>
      <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">Akses Aktif</p>
      <h1 className="mt-2 text-3xl font-extrabold">Selamat datang, {access.customerName}!</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">Pembelian berhasil. Akses Papa Bonski Super Kids sudah aktif dan siap digunakan.</p>
      <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-black/[0.05]"><div className="text-xs font-bold text-ink-faint">ID Member</div><div className="mt-1 font-extrabold">{access.customerCode}</div></div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-black/[0.05]"><div className="text-xs font-bold text-ink-faint">Status Akun</div><div className="mt-1 font-extrabold text-emerald-700">Aktif</div></div>
      </div>
      {access.expiresAt ? <p className="mt-3 text-xs text-ink-faint">Masa akses sampai {new Date(access.expiresAt).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })}.</p> : null}
      <div className="mt-6 flex flex-col gap-3"><Link href="/app" className="btn-primary w-full">Mulai Menggunakan Papa Bonski →</Link><Link href="/install" className="btn-secondary w-full">📲 Install di HP / Tablet</Link></div>
    </div>
  </div></main>;
}
