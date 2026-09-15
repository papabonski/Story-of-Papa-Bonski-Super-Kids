import type { Metadata } from "next";
import Image from "next/image";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import { CUSTOMER_ENTITLEMENTS, requireCustomerAccess } from "@/lib/customer-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Papa Bonski Mandarin — Belajar Mandarin Seru untuk Anak",
  description: "18 mini-game belajar Mandarin untuk anak dengan suara pelafalan, tiga tingkat, dan tantangan bintang.",
  applicationName: "Papa Bonski Mandarin",
  manifest: "/mandarin-game/manifest.webmanifest",
  icons: {
    icon: "/mandarin-game/assets/icons/icon-192.png",
    apple: "/mandarin-game/assets/icons/apple-touch-icon.png",
  },
};

export default async function MandarinPage() {
  const access = await requireCustomerAccess(CUSTOMER_ENTITLEMENTS.mandarin, "/mandarin");

  return (
    <main className="min-h-[100dvh] bg-[#f5eee3] text-ink">
      <header className="border-b border-black/5 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/mandarin-game/assets/papa-bonski-logo.png"
              alt="Papa Bonski"
              width={48}
              height={48}
              className="rounded-xl"
              priority
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">Papa Bonski Mandarin</p>
              <p className="truncate text-xs font-semibold text-ink-soft">Akses aktif · {access.customerName}</p>
            </div>
          </div>
          <a href="#install-mandarin" className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-extrabold text-white">
            Pasang
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl p-3 sm:p-5">
        <iframe
          src="/mandarin-game/index.html"
          title="Papa Bonski Mandarin"
          className="h-[calc(100dvh-6.25rem)] min-h-[620px] w-full rounded-3xl border-0 bg-white shadow-xl"
          allow="autoplay"
        />

        <div id="install-mandarin" className="scroll-mt-4 pb-6 pt-2">
          <PwaInstallPrompt appName="Papa Bonski Mandarin" />
        </div>
      </section>
    </main>
  );
}
