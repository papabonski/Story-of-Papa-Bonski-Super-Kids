import Link from "next/link";
import { getCustomerAccess } from "@/lib/customer-access";

export const dynamic = "force-dynamic";
export default async function InactivePage() {
  const access = await getCustomerAccess();
  return <main className="min-h-[100dvh] bg-surface px-5 py-12 text-ink"><div className="mx-auto max-w-lg rounded-[2rem] bg-surface-card p-7 text-center shadow-lg ring-1 ring-black/[0.06]"><div className="text-5xl">🔐</div><h1 className="mt-4 text-2xl font-extrabold">Akses Papa Bonski belum aktif</h1><p className="mt-3 text-sm leading-relaxed text-ink-soft">{access ? `Akun ${access.customerName} sudah terhubung, tetapi subscription/entitlement Super Kids tidak aktif atau sudah berakhir.` : "Akun belum terhubung ke pembelian aktif."}</p><div className="mt-5 rounded-2xl bg-amber-50 p-4 text-left text-sm text-amber-900">Jika Bunda sudah melakukan pembayaran atau perpanjangan, tunggu sebentar lalu coba lagi. Bila status belum berubah, hubungi dukungan Papa Bonski dengan order ID.</div><div className="mt-6 flex flex-col gap-3"><Link href="/onboarding" className="btn-primary">Cek Aktivasi Lagi</Link><Link href="/login" className="btn-secondary">Masuk dengan Email Lain</Link></div></div></main>;
}
