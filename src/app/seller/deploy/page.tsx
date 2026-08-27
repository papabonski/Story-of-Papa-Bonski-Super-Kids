import Link from "next/link";

export default function DeployPage() {
  const repo = process.env.PAPA_BONSKI_TEMPLATE_REPOSITORY_URL || "";
  const deployUrl = repo ? `https://vercel.com/new/clone?repository-url=${encodeURIComponent(repo)}` : "";
  return <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink"><div className="mx-auto max-w-2xl rounded-3xl bg-surface-card p-7 ring-1 ring-black/[0.06]">
    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">Seller Deployment</p><h1 className="mt-2 text-3xl font-extrabold">One-Click Deployment</h1>
    <p className="mt-3 text-sm leading-relaxed text-ink-soft">Vercel dapat membuat repository/project dari sebuah template repo melalui Deploy flow. Rahasia Supabase, Gemini, dan license tetap harus dimasukkan sebagai Environment Variables di project customer.</p>
    {deployUrl ? <a href={deployUrl} className="btn-primary mt-6 inline-flex">🚀 Deploy with Vercel</a> : <div className="mt-6 rounded-2xl bg-amber-50 p-5 text-sm ring-1 ring-amber-200"><strong>Belum aktif.</strong> Isi <code>PAPA_BONSKI_TEMPLATE_REPOSITORY_URL</code> dengan URL GitHub repository template milik seller, lalu redeploy.</div>}
    <div className="mt-6 rounded-2xl bg-surface p-5"><h2 className="font-extrabold">Alternatif one-command</h2><p className="mt-2 text-sm text-ink-soft">Dari folder aplikasi jalankan <code>npm run deploy:vercel</code>. Script menggunakan Vercel CLI dan deployment production.</p></div>
    <Link href="/seller" className="mt-7 inline-block text-sm font-extrabold text-brand-primary">← Seller Center</Link>
  </div></main>;
}
