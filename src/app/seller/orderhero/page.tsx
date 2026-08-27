import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { webhookAuthMode } from "@/lib/commerce/orderhero";
export const dynamic="force-dynamic";

export default async function OrderHeroIntegrationPage(){
  const authMode=webhookAuthMode();
  const vercelUrl=process.env.VERCEL_URL?`https://${process.env.VERCEL_URL}`:undefined;
  const base=(process.env.NEXT_PUBLIC_APP_URL||vercelUrl||"https://papabonski.com").replace(/\/$/,"");
  const token=process.env.ORDERHERO_WEBHOOK_TOKEN;
  const webhookUrl=`${base}/api/orderhero/webhook${authMode==="token"&&token?`?token=${encodeURIComponent(token)}`:""}`;
  let events:any[]=[]; let mappings:any[]=[]; let dbOk=true;
  try{
    const db=createSupabaseAdminClient();
    const [e,m]=await Promise.all([
      db.from("webhook_events").select("id,status,event_key,external_order_id,normalized,error,received_at").eq("provider","orderhero").order("received_at",{ascending:false}).limit(20),
      db.from("orderhero_product_mappings").select("id,match_type,match_value,product_sku,plan_code,active,notes").order("created_at",{ascending:false})
    ]); events=e.data||[]; mappings=m.data||[];
  }catch{dbOk=false;}
  const ready=authMode!=="missing"&&dbOk;
  return <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink"><div className="mx-auto max-w-6xl">
    <p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-primary">V5.4 Live Integration</p>
    <h1 className="mt-2 text-3xl font-extrabold">OrderHero Purchase Activation</h1>
    <p className="mt-2 max-w-3xl text-sm text-ink-soft">Pasang URL webhook ini di plugin Webhook OrderHero. Event pertama disimpan utuh agar payload nyata dapat diperiksa tanpa menebak schema.</p>
    <div className={`mt-6 rounded-2xl p-5 ring-1 ${ready?"bg-green-50 ring-green-200":"bg-amber-50 ring-amber-200"}`}><b>{ready?"✓ Receiver siap":"Perlu konfigurasi"}</b><div className="mt-1 text-sm">Auth: <code>{authMode}</code> · Database: {dbOk?"OK":"migration 0005 belum aktif"}</div></div>
    <section className="mt-6 rounded-2xl bg-surface-card p-6 ring-1 ring-black/[.06]"><h2 className="text-lg font-extrabold">Webhook URL</h2><div className="mt-3 break-all rounded-xl bg-black/5 p-4 font-mono text-sm">{webhookUrl}</div><p className="mt-3 text-xs text-ink-soft">Jika OrderHero menyediakan signature HMAC resmi, isi ORDERHERO_WEBHOOK_SECRET. Jika tidak, V5.4 mendukung secret-token URL/header melalui ORDERHERO_WEBHOOK_TOKEN.</p></section>
    <section className="mt-6 rounded-2xl bg-surface-card p-6 ring-1 ring-black/[.06]"><h2 className="text-lg font-extrabold">Product Mapping</h2><p className="mt-1 text-sm text-ink-soft">Setelah event nyata masuk, cocokkan product_id / nama produk / SKU OrderHero ke plan Papa Bonski.</p><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-2">Match</th><th className="p-2">Value</th><th className="p-2">Product</th><th className="p-2">Plan</th></tr></thead><tbody>{mappings.map(m=><tr key={m.id} className="border-b border-black/5"><td className="p-2">{m.match_type}</td><td className="p-2 font-mono text-xs">{m.match_value}</td><td className="p-2">{m.product_sku}</td><td className="p-2">{m.plan_code}</td></tr>)}</tbody></table></div></section>
    <section className="mt-6 rounded-2xl bg-surface-card p-6 ring-1 ring-black/[.06]"><h2 className="text-lg font-extrabold">20 webhook terakhir</h2><div className="mt-4 space-y-3">{events.length?events.map(e=><details key={e.id} className="rounded-xl border border-black/10 p-4"><summary className="cursor-pointer font-bold">{e.status} · {e.external_order_id||e.event_key||"tanpa order id"} <span className="font-normal text-ink-soft">— {new Date(e.received_at).toLocaleString("id-ID")}</span></summary><pre className="mt-3 overflow-auto rounded-lg bg-black/5 p-3 text-xs">{JSON.stringify(e.normalized||{},null,2)}</pre>{e.error&&<p className="mt-2 text-xs text-red-700">{e.error}</p>}</details>):<p className="text-sm text-ink-soft">Belum ada webhook OrderHero. Kirim test/live order dari OrderHero setelah URL di atas dipasang.</p>}</div></section>
  </div></main>;
}
