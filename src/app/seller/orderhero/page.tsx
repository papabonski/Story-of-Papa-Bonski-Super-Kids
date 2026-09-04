import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { webhookAuthMode } from "@/lib/commerce/orderhero";
import { requireSellerSession } from "@/lib/seller-auth";
import { ReceiverTestButton, ReplayWebhookButton } from "@/components/seller/WebhookConsoleActions";

export const dynamic = "force-dynamic";

function statusClass(status: string) {
  if (status === "processed") return "bg-green-50 text-green-800 ring-green-100";
  if (status === "ignored") return "bg-slate-50 text-slate-700 ring-slate-200";
  if (status === "needs_mapping") return "bg-amber-50 text-amber-900 ring-amber-200";
  if (status === "error") return "bg-red-50 text-red-800 ring-red-200";
  return "bg-orange-50 text-orange-800 ring-orange-100";
}

export default async function OrderHeroIntegrationPage() {
  await requireSellerSession("/seller/orderhero");

  const authMode = webhookAuthMode();
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const base = (process.env.NEXT_PUBLIC_APP_URL || vercelUrl || "https://papabonski.com").replace(/\/$/, "");
  const token = process.env.ORDERHERO_WEBHOOK_TOKEN;
  const webhookUrl = `${base}/api/orderhero/webhook${authMode === "token" && token ? `?token=${encodeURIComponent(token)}` : ""}`;

  let events: any[] = [];
  let mappings: any[] = [];
  let healthEvents: any[] = [];
  let dbOk = true;

  try {
    const db = createSupabaseAdminClient();
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const [e, m, h] = await Promise.all([
      db
        .from("webhook_events")
        .select("id,status,event_key,external_order_id,normalized,error,received_at")
        .eq("provider", "orderhero")
        .order("received_at", { ascending: false })
        .limit(20),
      db
        .from("orderhero_product_mappings")
        .select("id,match_type,match_value,product_sku,plan_code,active,notes")
        .order("created_at", { ascending: false }),
      db
        .from("webhook_events")
        .select("id,status")
        .eq("provider", "orderhero")
        .gte("received_at", since24h)
        .limit(500),
    ]);
    events = e.data || [];
    mappings = m.data || [];
    healthEvents = h.data || [];
  } catch {
    dbOk = false;
  }

  const ready = authMode !== "missing" && dbOk;
  const counts = healthEvents.reduce(
    (acc: Record<string, number>, event: any) => {
      const key = String(event.status || "pending");
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {},
  );
  const actionable = (counts.error || 0) + (counts.needs_mapping || 0);

  return (
    <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink">
      <div className="mx-auto max-w-6xl">
        <Link href="/seller" className="text-sm font-bold text-brand-primary">← Seller Center</Link>
        <p className="mt-4 text-xs font-extrabold uppercase tracking-[.18em] text-brand-primary">V5.5 Webhook Health Console</p>
        <h1 className="mt-2 text-3xl font-extrabold">OrderHero Purchase Activation</h1>
        <p className="mt-2 max-w-3xl text-sm text-ink-soft">
          Pantau kesehatan webhook, mapping produk, dan lakukan replay aman untuk event yang gagal tanpa membuat subscription atau kuota ganda.
        </p>

        <div className={`mt-6 rounded-2xl p-5 ring-1 ${ready ? "bg-green-50 ring-green-200" : "bg-amber-50 ring-amber-200"}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <b>{ready ? "✓ Receiver siap" : "Perlu konfigurasi"}</b>
              <div className="mt-1 text-sm">Auth: <code>{authMode}</code> · Database: {dbOk ? "OK" : "migration 0005 belum aktif"}</div>
            </div>
            {ready && <ReceiverTestButton />}
          </div>
        </div>

        <section className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">Health 24 jam terakhir</h2>
              <p className="mt-1 text-sm text-ink-soft">Event test berstatus pending akan masuk kategori ignored dan tidak membuat entitlement.</p>
            </div>
            <div className={`rounded-full px-4 py-2 text-sm font-extrabold ring-1 ${actionable ? "bg-red-50 text-red-800 ring-red-200" : "bg-green-50 text-green-800 ring-green-200"}`}>
              {actionable ? `${actionable} perlu perhatian` : "✓ Tidak ada event bermasalah"}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Processed", counts.processed || 0],
              ["Ignored", counts.ignored || 0],
              ["Needs Mapping", counts.needs_mapping || 0],
              ["Error", counts.error || 0],
              ["Total", healthEvents.length],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/[.06]">
                <div className="text-xs font-bold uppercase text-ink-soft">{label}</div>
                <div className="mt-2 text-2xl font-black">{value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-surface-card p-6 ring-1 ring-black/[.06]">
          <h2 className="text-lg font-extrabold">Webhook URL</h2>
          <div className="mt-3 break-all rounded-xl bg-black/5 p-4 font-mono text-sm">{webhookUrl}</div>
          <p className="mt-3 text-xs text-ink-soft">Jangan membagikan URL ini. Jika memakai token URL, token tersebut adalah secret integrasi.</p>
        </section>

        <section className="mt-6 rounded-2xl bg-surface-card p-6 ring-1 ring-black/[.06]">
          <h2 className="text-lg font-extrabold">Product Mapping</h2>
          <p className="mt-1 text-sm text-ink-soft">Mapping product_id / nama produk / SKU OrderHero ke plan Papa Bonski.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b"><th className="p-2">Match</th><th className="p-2">Value</th><th className="p-2">Product</th><th className="p-2">Plan</th></tr></thead>
              <tbody>{mappings.map((m) => <tr key={m.id} className="border-b border-black/5"><td className="p-2">{m.match_type}</td><td className="p-2 font-mono text-xs">{m.match_value}</td><td className="p-2">{m.product_sku}</td><td className="p-2">{m.plan_code}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-surface-card p-6 ring-1 ring-black/[.06]">
          <h2 className="text-lg font-extrabold">20 webhook terakhir</h2>
          <p className="mt-1 text-sm text-ink-soft">Replay hanya tersedia untuk status error atau needs_mapping. Event lama tetap dipertahankan sebagai audit trail; replay membuat delivery baru.</p>
          <div className="mt-4 space-y-3">
            {events.length ? events.map((e) => (
              <details key={e.id} className="rounded-xl border border-black/10 p-4">
                <summary className="cursor-pointer font-bold">
                  <span className={`mr-2 rounded-full px-2.5 py-1 text-xs ring-1 ${statusClass(String(e.status))}`}>{e.status}</span>
                  {e.external_order_id || e.event_key || "tanpa order id"}
                  <span className="font-normal text-ink-soft"> — {new Date(e.received_at).toLocaleString("id-ID")}</span>
                </summary>
                <pre className="mt-3 overflow-auto rounded-lg bg-black/5 p-3 text-xs">{JSON.stringify(e.normalized || {}, null, 2)}</pre>
                {e.error && <p className="mt-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{e.error}</p>}
                {["error", "needs_mapping"].includes(String(e.status)) && <ReplayWebhookButton eventId={e.id} />}
              </details>
            )) : <p className="text-sm text-ink-soft">Belum ada webhook OrderHero.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
