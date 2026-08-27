import Link from "next/link";
import { verifyLicense } from "@/lib/licensing/verify";

export const dynamic = "force-dynamic";

export default function LicensePage() {
  const status = verifyLicense();
  const p = status.payload;
  return (
    <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink">
      <div className="mx-auto max-w-2xl rounded-3xl bg-surface-card p-7 shadow-sm ring-1 ring-black/[0.06]">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">Commercial Edition V4</p>
        <h1 className="mt-2 text-3xl font-extrabold">License Status</h1>
        <div className={`mt-6 rounded-2xl p-5 ring-1 ${status.valid ? "bg-green-50 ring-green-200" : "bg-red-50 ring-red-200"}`}>
          <div className="text-2xl">{status.valid ? "✅" : "❌"}</div>
          <h2 className="mt-2 text-xl font-extrabold">{status.valid ? "License valid" : "License needs attention"}</h2>
          <p className="mt-2 text-sm text-ink-soft">{status.reason}</p>
        </div>
        {p && <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="font-bold">Customer</dt><dd className="text-ink-soft">{p.customer || "—"}</dd></div>
          <div><dt className="font-bold">Installation ID</dt><dd className="text-ink-soft">{p.installationId || "—"}</dd></div>
          <div><dt className="font-bold">Plan</dt><dd className="text-ink-soft">{p.plan || "—"}</dd></div>
          <div><dt className="font-bold">Expires</dt><dd className="text-ink-soft">{p.expiresAt ? new Date(p.expiresAt).toLocaleDateString("id-ID") : "No expiry"}</dd></div>
        </dl>}
        <div className="mt-7 flex flex-wrap gap-3"><Link className="btn-secondary" href="/owner">← Owner Center</Link><Link className="btn-secondary" href="/seller">Seller Center</Link></div>
      </div>
    </main>
  );
}
