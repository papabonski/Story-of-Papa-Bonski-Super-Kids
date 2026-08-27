import Image from "next/image";
import Link from "next/link";
import { getCommercialReadiness } from "@/lib/commercial/readiness";

export const dynamic = "force-dynamic";

export default async function OwnerPage() {
  const items = await getCommercialReadiness();
  const readyCount = items.filter((item) => item.ok).length;
  const ready = readyCount === items.length;
  const percent = Math.round((readyCount / items.length) * 100);

  return (
    <main className="min-h-[100dvh] bg-surface px-5 py-8 text-ink">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Papa Bonski" width={86} height={86} className="rounded-2xl" />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">Commercial Edition V4</p>
              <h1 className="text-3xl font-extrabold">Owner Center</h1>
              <p className="text-sm text-ink-soft">Pusat kesiapan instalasi, brand, dan serah-terima customer.</p>
            </div>
          </div>
          <Link href="/" className="btn-secondary">← Buka Aplikasi</Link>
        </div>

        <section className={`mt-7 rounded-3xl p-6 ring-1 ${ready ? "bg-green-50 ring-green-200" : "bg-amber-50 ring-amber-200"}`}>
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-sm font-bold">Commercial readiness</p><p className="mt-1 text-2xl font-extrabold">{ready ? "Siap diserahkan ke customer" : "Masih perlu beberapa langkah"}</p></div>
            <div className="text-4xl font-black">{percent}%</div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10"><div className="h-full rounded-full bg-brand-primary" style={{ width: `${percent}%` }} /></div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-surface-card p-5 shadow-sm ring-1 ring-black/[0.06]">
              <div className="flex items-center justify-between gap-3"><h2 className="font-extrabold">{item.label}</h2><span className="text-xl">{item.ok ? "✅" : "⚠️"}</span></div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.detail}</p>
              {item.href && <Link href={item.href} className="mt-4 inline-block text-sm font-extrabold text-brand-primary hover:underline">{item.action ?? "Buka"} →</Link>}
            </div>
          ))}
        </div>

        <section className="mt-7 grid gap-4 lg:grid-cols-3">
          <Link href="/admin" className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/[0.06] hover:ring-brand-primary/30"><div className="text-2xl">🎨</div><h2 className="mt-2 font-extrabold">Brand & Paket</h2><p className="mt-1 text-sm text-ink-soft">Atur logo, warna, provider, limit, dan harga.</p></Link>
          <Link href="/setup" className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/[0.06] hover:ring-brand-primary/30"><div className="text-2xl">🧰</div><h2 className="mt-2 font-extrabold">Technical Check</h2><p className="mt-1 text-sm text-ink-soft">Validasi Supabase, database, Gemini, dan secret.</p></Link>
          <Link href="/install" className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/[0.06] hover:ring-brand-primary/30"><div className="text-2xl">📱</div><h2 className="mt-2 font-extrabold">Install App</h2><p className="mt-1 text-sm text-ink-soft">Halaman sederhana untuk customer memasang PWA.</p></Link>
          <Link href="/seller" className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/[0.06] hover:ring-brand-primary/30"><div className="text-2xl">💼</div><h2 className="mt-2 font-extrabold">Seller Center</h2><p className="mt-1 text-sm text-ink-soft">License dan deployment customer.</p></Link>
        </section>

        <section className="mt-7 rounded-2xl bg-surface-card p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-xl font-extrabold">Checklist sebelum dijual / diserahkan</h2>
          <ol className="mt-4 grid gap-3 text-sm text-ink-soft sm:grid-cols-2">
            <li>1. Semua status di atas hijau.</li><li>2. Buat satu cerita sampai flipbook selesai.</li><li>3. Tes export PDF, ZIP, share link, audio, dan gambar.</li><li>4. Buka aplikasi dari HP dan install PWA.</li><li>5. Ubah password admin khusus customer.</li><li>6. Simpan salinan konfigurasi seller secara aman.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
