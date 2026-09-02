import Image from "next/image";
import Link from "next/link";
import RetailPurchaseGate from "@/components/marketing/RetailPurchaseGate";
import { getRuntimeBrand } from "@/lib/white-label/settings";

export const dynamic = "force-dynamic";

export default async function RetailCheckoutPage() {
  const brand = await getRuntimeBrand();

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
        <h1 className="mt-2 text-3xl font-extrabold">Cek email pembelian</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Jika email sudah memiliki Paket Super Kids 1, kami akan menampilkan pilihan supaya Anda bisa memilih paket ulang atau hanya menambah kuota cerita.
        </p>

        <div className="mt-7">
          <RetailPurchaseGate />
        </div>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-faint">
        Pengecekan ini hanya digunakan untuk menentukan pilihan pembelian yang sesuai.
      </p>
    </div>
  </main>;
}
