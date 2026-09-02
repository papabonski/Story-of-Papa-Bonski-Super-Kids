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
  const initialEmail = user && !user.is_anonymous ? (user.email || "") : "";

  return <main className="min-h-[100dvh] bg-surface px-5 py-8 text-ink">
    <div className="mx-auto max-w-lg">
      <div className="mb-5 flex items-center justify-between">
        <Link href="/super-kids" className="flex items-center gap-2 font-extrabold">
          <Image src={brand.logoSrc || "/logo.png"} alt={brand.name} width={44} height={44} className="rounded-xl" />
          <span>Papa Bonski</span>
        </Link>
        <Link href="/super-kids" className="text-sm font-bold text-ink-soft hover:text-ink">Kembali</Link>
      </div>

      <div className="rounded-[2rem] bg-surface-card p-6 shadow-xl ring-1 ring-black/[0.06] sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-primary">Sebelum checkout</p>
        <h1 className="mt-2 text-3xl font-extrabold">Tentukan Email Penerima</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Email Penerima adalah email yang akan memiliki lisensi, kuota cerita, koleksi, dan digunakan untuk login OTP. Email Pembeli akan diisi terpisah di halaman pembayaran OrderHero.
        </p>

        <div className="mt-7">
          <RetailPurchaseGate initialEmail={initialEmail} />
        </div>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-faint">
        Jika membeli sebagai hadiah, masukkan email orang tua atau wali yang akan menggunakan Papa Bonski.
      </p>
    </div>
  </main>;
}
