import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireSellerSession } from "@/lib/seller-auth";

export const dynamic="force-dynamic";

function pct(a:number,b:number){return b>0?`${Math.round((a/b)*100)}%`:"—";}
function money(n:number){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);}

export default async function SellerSalesPage(){
  await requireSellerSession("/seller/sales");
  const db=createSupabaseAdminClient();
  const now=Date.now();
  const since7=new Date(now-7*24*60*60*1000).toISOString();
  const since30=new Date(now-30*24*60*60*1000).toISOString();

  const [homeQ,viewQ,checkoutQ,paidQ,attrQ,lastEventQ]=await Promise.all([
    db.from("funnel_events").select("*",{count:"exact",head:true}).eq("event_name","BrandHomeView").gte("created_at",since7),
    db.from("funnel_events").select("*",{count:"exact",head:true}).eq("event_name","ViewContent").gte("created_at",since7),
    db.from("funnel_events").select("*",{count:"exact",head:true}).eq("event_name","InitiateCheckout").gte("created_at",since7),
    db.from("orders").select("amount,product_sku,paid_at").eq("status","paid").gte("paid_at",since7),
    db.from("attributions").select("utm_source,utm_medium,utm_campaign,utm_content,fbclid,created_at,order_id").gte("created_at",since30).order("created_at",{ascending:false}).limit(200),
    db.from("funnel_events").select("event_name,created_at,utm_source,utm_campaign,fbclid").order("created_at",{ascending:false}).limit(1),
  ]);

  const home=homeQ.count||0;
  const views=viewQ.count||0;
  const checkouts=checkoutQ.count||0;
  const paidRows=paidQ.data||[];
  const paid=paidRows.length;
  const revenue=paidRows.reduce((sum,row)=>sum+Number(row.amount||0),0);
  const attrRows=attrQ.data||[];
  const metaPixelConfigured=Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID);

  const sourceMap=new Map<string,{source:string,campaign:string,orders:number}>();
  for(const row of attrRows){
    const source=row.utm_source||((row.fbclid)?"meta/fbclid":"(direct/unknown)");
    const campaign=row.utm_campaign||"(no campaign)";
    const key=`${source}__${campaign}`;
    const prev=sourceMap.get(key)||{source,campaign,orders:0};
    prev.orders+=1;
    sourceMap.set(key,prev);
  }
  const sources=[...sourceMap.values()].sort((a,b)=>b.orders-a.orders).slice(0,10);
  const lastEvent=lastEventQ.data?.[0];

  return <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink">
    <div className="mx-auto max-w-6xl">
      <Link href="/seller" className="text-sm font-bold text-brand-primary">← Seller Center</Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-primary">V5.6 Sales Launch Readiness</p>
          <h1 className="mt-2 text-3xl font-extrabold">Sales Funnel</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">Pantau landing page, checkout, order paid, attribution campaign, dan kesiapan Meta tracking sebelum iklan dinaikkan.</p>
        </div>
        <a href="/super-kids?utm_source=meta&utm_medium=paid_social&utm_campaign=superkids_launch&utm_content=uat_tracking" target="_blank" rel="noreferrer" className="btn-secondary">Buka Landing UTM Test</a>
      </div>

      <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Brand Home",home],
          ["View Content",views],
          ["Initiate Checkout",checkouts],
          ["Paid Orders",paid],
          ["Revenue 7d",money(revenue)],
        ].map(([label,value])=><div key={String(label)} className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/[.06]"><div className="text-xs font-bold uppercase text-ink-soft">{label}</div><div className="mt-2 text-2xl font-black">{value}</div></div>)}
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/[.06]"><div className="text-xs font-bold uppercase text-ink-soft">Landing → Checkout</div><div className="mt-2 text-2xl font-black">{pct(checkouts,views)}</div><p className="mt-1 text-xs text-ink-soft">InitiateCheckout ÷ ViewContent, 7 hari.</p></div>
        <div className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/[.06]"><div className="text-xs font-bold uppercase text-ink-soft">Checkout → Paid*</div><div className="mt-2 text-2xl font-black">{pct(paid,checkouts)}</div><p className="mt-1 text-xs text-ink-soft">Indikatif; order test/internal juga dapat masuk hitungan.</p></div>
        <div className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/[.06]"><div className="text-xs font-bold uppercase text-ink-soft">Landing → Paid*</div><div className="mt-2 text-2xl font-black">{pct(paid,views)}</div><p className="mt-1 text-xs text-ink-soft">Gunakan setelah traffic iklan nyata mulai masuk.</p></div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-surface-card p-6 ring-1 ring-black/[.06]">
          <h2 className="text-xl font-extrabold">Tracking readiness</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-surface p-4"><div><b>First-party funnel</b><p className="mt-1 text-xs text-ink-soft">ViewContent dan InitiateCheckout disimpan di Supabase.</p></div><span className="font-extrabold text-emerald-700">READY</span></div>
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-surface p-4"><div><b>UTM / fbclid persistence</b><p className="mt-1 text-xs text-ink-soft">V5.6 mempertahankan attribution saat pengunjung berpindah halaman.</p></div><span className="font-extrabold text-emerald-700">READY</span></div>
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-surface p-4"><div><b>Meta Pixel ID</b><p className="mt-1 text-xs text-ink-soft">Environment NEXT_PUBLIC_META_PIXEL_ID.</p></div><span className={`font-extrabold ${metaPixelConfigured?"text-emerald-700":"text-amber-700"}`}>{metaPixelConfigured?"READY":"BELUM DIISI"}</span></div>
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-surface p-4"><div><b>Purchase source of truth</b><p className="mt-1 text-xs text-ink-soft">OrderHero webhook + tabel orders berstatus paid.</p></div><span className="font-extrabold text-emerald-700">READY</span></div>
          </div>
        </div>

        <div className="rounded-2xl bg-surface-card p-6 ring-1 ring-black/[.06]">
          <h2 className="text-xl font-extrabold">Attribution 30 hari</h2>
          <p className="mt-2 text-sm text-ink-soft">Attribution baru tercatat pada order paid jika UTM/fbclid terbawa dari landing hingga checkout.</p>
          <div className="mt-4 space-y-3">
            {sources.length?sources.map((s)=><div key={`${s.source}-${s.campaign}`} className="flex items-center justify-between gap-4 border-b border-black/5 pb-3 text-sm"><div><b>{s.source}</b><div className="text-xs text-ink-soft">{s.campaign}</div></div><span className="font-extrabold">{s.orders} order</span></div>):<div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-950 ring-1 ring-amber-100">Belum ada order dengan attribution UTM/fbclid. Sebelum launch, buka tombol <b>Landing UTM Test</b>, lanjutkan sampai checkout, lalu cek apakah attribution mulai terbaca pada transaksi test berikutnya.</div>}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-surface-card p-6 ring-1 ring-black/[.06]">
        <h2 className="text-xl font-extrabold">Template URL Meta Ads</h2>
        <p className="mt-2 text-sm text-ink-soft">Gunakan pola konsisten agar campaign/ad creative dapat dibedakan di Seller Center.</p>
        <code className="mt-4 block overflow-x-auto rounded-2xl bg-surface p-4 text-xs">/super-kids?utm_source=meta&amp;utm_medium=paid_social&amp;utm_campaign=superkids_launch&amp;utm_content=video_problem_01</code>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div><b>utm_campaign</b><p className="text-xs text-ink-soft">Nama campaign.</p></div><div><b>utm_content</b><p className="text-xs text-ink-soft">Nama creative/ad.</p></div><div><b>fbclid</b><p className="text-xs text-ink-soft">Ditambahkan Meta otomatis saat tersedia.</p></div></div>
        {lastEvent&&<p className="mt-5 text-xs text-ink-faint">Event terakhir: <b>{lastEvent.event_name}</b> · {new Date(lastEvent.created_at).toLocaleString("id-ID")}</p>}
      </section>
    </div>
  </main>;
}
