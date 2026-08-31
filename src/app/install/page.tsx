import Image from "next/image";
import Link from "next/link";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import { getRuntimeBrand } from "@/lib/white-label/settings";
import { requireCustomerAccess } from "@/lib/customer-access";

export const dynamic = "force-dynamic";

export default async function InstallPage() {
  if (process.env.REQUIRE_CUSTOMER_LOGIN === "true") await requireCustomerAccess();
  const brand = await getRuntimeBrand();

  return (
    <main className="min-h-[100dvh] bg-surface px-4 py-8 text-ink sm:px-6 sm:py-12">
      <div className="mx-auto max-w-xl">
        <section className="overflow-hidden rounded-[2rem] bg-surface-card shadow-xl ring-1 ring-black/[0.06]">
          <div className="bg-gradient-to-b from-amber-50 to-orange-50 px-6 pb-7 pt-8 text-center sm:px-10">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[2rem] bg-white p-2 shadow-md ring-1 ring-black/[0.06]">
              <Image
                src={brand.logoSrc || "/logo.png"}
                alt={`Logo ${brand.name}`}
                width={116}
                height={116}
                priority
                className="h-full w-full rounded-[1.55rem] object-contain"
              />
            </div>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-primary">
              Install di HP / Tablet
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">{brand.name}</h1>
            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-relaxed text-ink-soft sm:text-base">
              Pasang sekali ke Home Screen. Setelah itu Papa Bonski dapat dibuka seperti aplikasi biasa tanpa mencari link lagi.
            </p>
          </div>

          <div className="px-5 pb-6 pt-2 sm:px-8 sm:pb-8">
            <PwaInstallPrompt />

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-surface px-4 py-4 text-center ring-1 ring-black/[0.05]">
                <div className="text-2xl">🏠</div>
                <p className="mt-1 text-xs font-extrabold">Ada di Home Screen</p>
              </div>
              <div className="rounded-2xl bg-surface px-4 py-4 text-center ring-1 ring-black/[0.05]">
                <div className="text-2xl">⚡</div>
                <p className="mt-1 text-xs font-extrabold">Lebih cepat dibuka</p>
              </div>
              <div className="rounded-2xl bg-surface px-4 py-4 text-center ring-1 ring-black/[0.05]">
                <div className="text-2xl">🧸</div>
                <p className="mt-1 text-xs font-extrabold">Icon Papa Bonski</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]">
              <h2 className="text-sm font-extrabold">Jika tombol install belum muncul</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
                <p><b>Android / Chrome:</b> buka menu <b>⋮</b>, lalu pilih <b>Install app</b> atau <b>Add to Home screen</b>.</p>
                <p><b>iPhone / iPad:</b> buka halaman ini dengan <b>Safari</b>, tekan <b>Share</b>, lalu pilih <b>Add to Home Screen</b>.</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/app" className="btn-secondary w-full text-center">← Kembali ke Aplikasi</Link>
            </div>
          </div>
        </section>

        <p className="mt-5 text-center text-xs font-semibold leading-relaxed text-ink-faint">
          Gunakan hanya icon resmi Papa Bonski agar tampilan aplikasi konsisten di browser dan Home Screen.
        </p>
      </div>
    </main>
  );
}
