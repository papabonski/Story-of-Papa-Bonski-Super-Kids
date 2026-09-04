import Link from "next/link";
import { getCommercialReadiness } from "@/lib/commercial/readiness";
import { requireSellerSession } from "@/lib/seller-auth";

export const dynamic = "force-dynamic";

export default async function SellerSystemPage() {
  await requireSellerSession("/seller/system");
  const items = await getCommercialReadiness();
  const readyCount = items.filter((item) => item.ok).length;
  const ready = readyCount === items.length;
  const percent = Math.round((readyCount / Math.max(items.length, 1)) * 100);

  return (
    <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink">
      <div className="mx-auto max-w-5xl">
        <Link href="/seller" className="text-sm font-bold text-brand-primary">← Seller Center</Link>
        <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">Seller Operations V5.5</p>
        <h1 className="mt-2 text-3xl font-extrabold">System Readiness</h1>
        <p className="mt-2 text-sm text-ink-soft">Status kesiapan aplikasi, database, provider, dan konfigurasi operasional.</p>

        <section className={`mt-6 rounded-3xl p-6 ring-1 ${ready ? "bg-green-50 ring-green-200" : "bg-amber-50 ring-amber-200"}`}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold">Commercial readiness</p>
              <p className="mt-1 text-2xl font-extrabold">{ready ? "Siap digunakan" : "Masih ada konfigurasi yang perlu dicek"}</p>
            </div>
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

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <Link href="/setup" className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/[0.06]"><div className="text-2xl">🧰</div><h2 className="mt-2 font-extrabold">Technical Check</h2><p className="mt-1 text-sm text-ink-soft">Cek koneksi Supabase, AI provider, worker, dan schema.</p></Link>
          <Link href="/admin" className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/[0.06]"><div className="text-2xl">🎨</div><h2 className="mt-2 font-extrabold">Brand & Paket</h2><p className="mt-1 text-sm text-ink-soft">Konfigurasi internal yang hanya boleh diakses administrator.</p></Link>
        </div>
      </div>
    </main>
  );
}
