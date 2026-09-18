import Link from "next/link";
import { requireSellerSession } from "@/lib/seller-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MatematikaPromoPage() {
  await requireSellerSession("/seller/matematika-promo");
  const db = createSupabaseAdminClient();
  const now = new Date().toISOString();
  const [{ data: promo }, { data: claims }] = await Promise.all([
    db.from("promotions").select("name,quota,active,coupon_code").eq("key","matematika-launch-50").maybeSingle(),
    db.from("promo_claims").select("id,slot_number,status,recipient_email,activated_at,feedback_due_at,feedback_submitted_at,reminder_count").eq("promotion_key","matematika-launch-50").order("slot_number"),
  ]);
  const activeClaims=(claims||[]).filter(c=>c.status==="activated");
  const reserved=(claims||[]).filter(c=>c.status==="reserved").length;
  const due=activeClaims.filter(c=>!c.feedback_submitted_at && c.feedback_due_at && c.feedback_due_at<=now);
  const submitted=activeClaims.filter(c=>c.feedback_submitted_at).length;
  const remaining=Math.max(Number(promo?.quota||50)-activeClaims.length-reserved,0);

  return <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink"><div className="mx-auto max-w-6xl">
    <Link href="/seller" className="text-sm font-extrabold text-brand-primary">← Seller Center</Link>
    <div className="mt-4 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.16em] text-brand-primary">Promo Matematika</p><h1 className="mt-2 text-3xl font-extrabold">50 pengguna awal</h1><p className="mt-2 text-sm text-ink-soft">Pantau kuota gratis dan ulasan yang sudah jatuh tempo.</p></div><span className={`rounded-full px-4 py-2 text-sm font-extrabold ${promo?.active?"bg-emerald-50 text-emerald-800":"bg-amber-50 text-amber-800"}`}>{promo?.active?"Aktif":"Belum aktif"}</span></div>
    <div className="mt-7 grid gap-3 sm:grid-cols-4">{[["Tersisa",remaining],["Aktif",activeClaims.length],["Ulasan masuk",submitted],["Perlu diingatkan",due.length]].map(([label,value])=><div key={String(label)} className="rounded-2xl bg-white p-5 ring-1 ring-black/[.06]"><p className="text-xs font-bold uppercase text-ink-soft">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>)}</div>
    <section className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-black/[.06]"><h2 className="text-xl font-extrabold">Tindak lanjut ulasan</h2><p className="mt-1 text-sm text-ink-soft">Akses tetap seumur hidup. Daftar ini hanya untuk pengingat yang sopan, bukan pencabutan akses.</p><div className="mt-5 space-y-3">{due.length?due.map(c=><div key={c.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-3"><div><p className="font-bold">Slot #{c.slot_number}</p><p className="text-xs text-ink-soft">{c.recipient_email}</p></div><div className="text-right text-xs text-ink-soft"><p>Jatuh tempo {new Date(c.feedback_due_at).toLocaleString("id-ID",{timeZone:"Asia/Jakarta"})}</p><p>Pengingat tercatat: {c.reminder_count}</p></div></div>):<p className="text-sm text-ink-soft">Tidak ada ulasan yang terlambat saat ini.</p>}</div></section>
  </div></main>;
}
