import Link from 'next/link';
import Image from 'next/image';
import { requireSellerSession } from '@/lib/seller-auth';

export const dynamic = 'force-dynamic';

type Check = { name: string; ok: boolean; detail: string };
async function checks(): Promise<Check[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const gemini = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const worker = process.env.STORY_WORKER_SECRET;
  const admin = process.env.ADMIN_DASHBOARD_SECRET || worker;
  const out: Check[] = [
    { name: 'Supabase URL', ok: !!url, detail: url ? 'Terisi' : 'Belum diisi' },
    { name: 'Supabase anon key', ok: !!anon, detail: anon ? 'Terisi' : 'Belum diisi' },
    { name: 'Service role key', ok: !!service, detail: service ? 'Terisi' : 'Belum diisi' },
    { name: 'Gemini API key', ok: !!gemini, detail: gemini ? 'Terisi' : 'Belum diisi' },
    { name: 'Worker secret', ok: !!worker, detail: worker ? 'Terisi' : 'Belum diisi' },
    { name: 'Admin session secret', ok: !!admin, detail: admin ? 'Siap' : 'Belum diisi' },
  ];
  if (url && service) {
    try {
      const r = await fetch(`${url}/rest/v1/white_label_settings?select=id&limit=1`, {
        headers: { apikey: service, Authorization: `Bearer ${service}` }, cache: 'no-store'
      });
      out.push({ name: 'Database schema', ok: r.ok, detail: r.ok ? '0001_init.sql terdeteksi' : `Belum siap (HTTP ${r.status})` });
    } catch { out.push({ name: 'Database schema', ok: false, detail: 'Tidak dapat terhubung ke Supabase' }); }
  } else out.push({ name: 'Database schema', ok: false, detail: 'Isi Supabase terlebih dahulu' });
  if (gemini) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(gemini)}`, { cache:'no-store' });
      out.push({ name: 'Gemini connection', ok: r.ok, detail: r.ok ? 'API key aktif' : `API key ditolak (HTTP ${r.status})` });
    } catch { out.push({ name: 'Gemini connection', ok: false, detail: 'Tidak dapat menghubungi Google AI' }); }
  } else out.push({ name: 'Gemini connection', ok: false, detail: 'Isi Gemini API key terlebih dahulu' });
  return out;
}

export default async function SetupPage() {
  await requireSellerSession('/setup');
  const items = await checks();
  const ready = items.every(x => x.ok);
  return <main className="min-h-[100dvh] bg-surface px-5 py-8 text-ink">
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-4"><Image src="/logo.png" alt="Papa Bonski" width={82} height={82} className="rounded-2xl"/><div><p className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">Seller Operations V5.5</p><h1 className="text-3xl font-extrabold">Technical Check</h1><p className="text-sm text-ink-soft">Setup & Configuration Checker</p></div></div>
      <div className={`mb-6 rounded-2xl p-5 ring-1 ${ready?'bg-green-50 ring-green-200':'bg-amber-50 ring-amber-200'}`}><b>{ready?'✅ Aplikasi siap digunakan':'🛠️ Setup belum lengkap'}</b><p className="mt-1 text-sm">Halaman ini hanya menampilkan status. Nilai secret tidak pernah ditampilkan.</p></div>
      <div className="grid gap-3 sm:grid-cols-2">{items.map(x=><div key={x.name} className="rounded-2xl bg-surface-card p-4 shadow-sm ring-1 ring-black/5"><div className="flex items-center justify-between gap-3"><b>{x.name}</b><span>{x.ok?'✅':'❌'}</span></div><p className="mt-1 text-sm text-ink-soft">{x.detail}</p></div>)}</div>
      <section className="mt-7 rounded-2xl bg-surface-card p-5 ring-1 ring-black/5"><h2 className="text-xl font-extrabold">Catatan operasional</h2><p className="mt-3 text-sm text-ink-soft">Pemeriksaan teknis ini sekarang berada di area administrator dan hanya dapat dibuka setelah login Seller Center via Email + OTP.</p></section>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/seller/system" className="btn-secondary">← System Readiness</Link><Link href="/admin" className="btn-primary">Brand & Paket</Link><Link href="/seller" className="btn-secondary">Seller Center</Link></div>
    </div>
  </main>
}
