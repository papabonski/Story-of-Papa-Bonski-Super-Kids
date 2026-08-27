import Image from "next/image";
import Link from "next/link";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import { getRuntimeBrand } from "@/lib/white-label/settings";
import { requireCustomerAccess } from "@/lib/customer-access";

export const dynamic = "force-dynamic";

export default async function InstallPage() {
  if (process.env.REQUIRE_CUSTOMER_LOGIN === "true") await requireCustomerAccess();
  const brand = await getRuntimeBrand();
  return <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink"><div className="mx-auto max-w-lg text-center">
    <Image src={brand.logoSrc || "/logo.png"} alt={brand.name} width={128} height={128} className="mx-auto rounded-3xl" />
    <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">Install di HP / Tablet</p>
    <h1 className="mt-2 text-3xl font-extrabold">{brand.name}</h1>
    <p className="mt-3 text-sm leading-relaxed text-ink-soft">Pasang aplikasi ke Home Screen agar dapat dibuka seperti aplikasi biasa tanpa mencari link lagi.</p>
    <div className="mt-6 text-left"><PwaInstallPrompt /></div>
    <div className="mt-6 rounded-2xl bg-surface-card p-5 text-left ring-1 ring-black/[0.06]"><h2 className="font-extrabold">Jika tombol install tidak muncul</h2><p className="mt-2 text-sm leading-relaxed text-ink-soft"><b>Android / Chrome:</b> buka menu ⋮ lalu pilih <b>Install app</b> atau <b>Add to Home screen</b>.<br/><br/><b>iPhone / iPad:</b> buka dengan Safari, tekan Share, lalu pilih <b>Add to Home Screen</b>.</p></div>
    <Link href="/" className="btn-secondary mt-6">← Kembali</Link>
  </div></main>;
}
