import Image from "next/image";
import Link from "next/link";
import RetailPurchaseGate from "@/components/marketing/RetailPurchaseGate";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRuntimeBrand } from "@/lib/white-label/settings";

export const dynamic = "force-dynamic";

export default async function RetailCheckoutPage() {
  const [brand, supabase] = await Promise.all([
    getRuntimeBrand(),
    createSupabaseServerClient(),
  ]);
  const { data: { user } } = await supabase.auth.getUser();
  const signedInMember = Boolean(user && !user.is_anonymous && user.email);
  const initialEmail = signedInMember ? (user?.email || "") : "";
  const returnHref = signedInMember ? "/app" : "/super-kids";
  const returnLabel = signedInMember ? "Beranda Member" : "Kembali";

  return <main className="min-h-[100dvh] bg-surface px-5 py-8 text-ink">
    <div className="mx-auto max-w-lg">
      <div className="mb-5 flex items-center justify-between gap-4">
        <Link href={returnHref} className="flex items-center gap-2 font-extrabold">
          <Image src={brand.logoSrc || "/logo.png"} alt={brand.name} width={44} height={44} className="rounded-xl" />
          <span>Papa Bonski</span>
        </Link>
        <Link href={returnHref} className="text-sm font-bold text-ink-soft hover:text-ink">{returnLabel}</Link>
      </div>

      <div className="rounded-[2rem] bg-surface-card p-6 shadow-xl ring-1 ring-black/[0.06] sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-primary">Langkah 1 dari 2 sebelum pembayaran</p>
        <h1 className="mt-2 text-3xl font-extrabold">Siapa yang akan memakai Papa Bonski?</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Masukkan <b>Email Penerima</b>—yaitu email yang nanti dipakai untuk login Papa Bonski dengan kode OTP. Jika membeli untuk diri sendiri, gunakan email Anda sendiri.
        </p>

        <div className="mt-5 rounded-2xl bg-orange-50 p-4 text-sm leading-relaxed text-orange-950 ring-1 ring-orange-100">
          <b>Email Pembeli boleh sama atau berbeda.</b> Nama, WhatsApp, dan Email Pembeli untuk transaksi baru akan diisi pada langkah pembayaran OrderHero berikutnya.
        </div>

        {signedInMember && (
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900 ring-1 ring-emerald-100">
            <p className="font-extrabold">Anda sedang login sebagai member Papa Bonski.</p>
            <p className="mt-1">
              Untuk menambah cerita ke akun Anda, pilih top-up. Untuk membeli sebagai hadiah, gunakan Email Penerima yang berbeda.
            </p>
            <Link href="/app" className="btn-secondary mt-3 w-full">
              ← Kembali ke Beranda Member
            </Link>
          </div>
        )}

        <div className="mt-7">
          <RetailPurchaseGate initialEmail={initialEmail} signedInEmail={signedInMember ? (user?.email || "") : ""} />
        </div>
      </div>

      <div className="mt-5 grid gap-2 text-center text-xs leading-relaxed text-ink-faint sm:grid-cols-3">
        <span>🔐 Login dengan OTP</span><span>💳 Pembayaran via OrderHero</span><span>🎁 Bisa sebagai hadiah</span>
      </div>
    </div>
  </main>;
}
