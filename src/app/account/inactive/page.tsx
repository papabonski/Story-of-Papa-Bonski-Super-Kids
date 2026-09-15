import Link from "next/link";
import { CUSTOMER_ENTITLEMENTS, getCustomerAccess } from "@/lib/customer-access";

export const dynamic = "force-dynamic";
export default async function InactivePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const params = await searchParams;
  const isMandarin = params.product === "mandarin";
  const isPortal = params.product === "portal";
  const nextPath = isMandarin ? "/mandarin" : "/app";
  const productName = isMandarin ? "Papa Bonski Mandarin" : isPortal ? "Papa Bonski" : "Papa Bonski Super Kids";
  const access = await getCustomerAccess(isMandarin ? CUSTOMER_ENTITLEMENTS.mandarin : CUSTOMER_ENTITLEMENTS.superKids);
  return <main className="min-h-[100dvh] bg-surface px-5 py-12 text-ink"><div className="mx-auto max-w-lg rounded-[2rem] bg-surface-card p-7 text-center shadow-lg ring-1 ring-black/[0.06]"><div className="text-5xl">🔐</div><h1 className="mt-4 text-2xl font-extrabold">Akses {productName} belum aktif</h1><p className="mt-3 text-sm leading-relaxed text-ink-soft">{access ? `Akun ${access.customerName} sudah terhubung, tetapi hak akses ${isMandarin ? "Mandarin" : "Super Kids"} belum dimiliki atau sedang dinonaktifkan.` : "Akun belum terhubung ke pembelian aktif."}</p><div className="mt-5 rounded-2xl bg-amber-50 p-4 text-left text-sm text-amber-900">Hak akses Papa Bonski tidak kedaluwarsa. Jika Bunda baru membayar, tunggu sebentar lalu coba lagi. Bila status belum berubah, hubungi Papa Bonski dengan nomor pesanan.</div><div className="mt-6 flex flex-col gap-3"><Link href={`/onboarding?next=${encodeURIComponent(nextPath)}`} className="btn-primary">Cek Aktivasi Lagi</Link><Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="btn-secondary">Masuk dengan Email Penerima Lain</Link></div></div></main>;
}
