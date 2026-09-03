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
      <div className="mb-5 flex items-center justify-between">
        <Link href={returnHref} className="flex items-center gap-2 font-extrabold">
          <Image src={brand.logoSrc || "/logo.png"} alt={brand.name} width={44} height={44} className="rounded-xl" />
          <span>Papa Bonski</span>
        </Link>
        <Link href={returnHref} className="text-sm font-bold text-ink-soft hover:text-ink">{returnLabel}</Link>
      </div>

      <div className="rounded-[2rem] bg-surface-card p-6 shadow-xl ring-1 ring-black/[0.06] sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-primary">Sebelum checkout</p>
        <h1 className="mt-2 text-3xl font-extrabold">Tentukan Email Penerima</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Email Penerima adalah email yang akan memiliki lisensi, kuota cerita, koleksi, dan digunakan untuk login OTP. Email Pembeli akan diisi terpisah di halaman pembayaran OrderHero.
        </p>

        {signedInMember && (
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900 ring-1 ring-emerald-100">
            <p className="font-extrabold">Anda sedang login sebagai member Papa Bonski.</p>
            <p className="mt-1">
              Top-up hanya diperlukan jika ingin membuat cerita baru. Untuk membaca cerita yang sudah dibuat, kembali ke Beranda Member lalu pilih Koleksi Cerita.
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

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-faint">
        Jika membeli sebagai hadiah, masukkan email orang tua atau wali yang akan menggunakan Papa Bonski.
      </p>
    </div>
  </main>;
}
