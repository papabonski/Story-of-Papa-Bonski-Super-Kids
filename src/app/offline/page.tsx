import Link from "next/link";
import { getRuntimeBrand } from "@/lib/white-label/settings";

export const dynamic = "force-dynamic";

export default async function OfflinePage() {
  const brand = await getRuntimeBrand();

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-surface px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-primary/10 text-4xl">
        {brand.logoEmoji}
      </div>
      <h1 className="mt-5 text-2xl font-extrabold text-ink">Sedang offline</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
        {brand.name} sudah terpasang di perangkat ini, tapi halaman yang diminta perlu koneksi
        internet untuk memuat cerita dan aset terbaru.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Coba lagi
      </Link>
    </main>
  );
}
