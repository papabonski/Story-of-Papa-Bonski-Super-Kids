import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import { CUSTOMER_ENTITLEMENTS, requireCustomerAccess } from "@/lib/customer-access";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Papa Bonski Matematika — Belajar Matematika Seru untuk Anak",
  description: "Game matematika interaktif untuk anak usia 6–12 tahun dengan empat level, soal acak, dan penjelasan langkah demi langkah.",
  applicationName: "Papa Bonski Matematika",
  manifest: "/matematika-game/manifest.webmanifest",
  icons: {
    icon: "/matematika-game/assets/icons/icon-192.png",
    apple: "/matematika-game/assets/icons/apple-touch-icon.png",
  },
};

export default async function MatematikaPage() {
  const access = await requireCustomerAccess(CUSTOMER_ENTITLEMENTS.matematika, "/matematika");
  const db = createSupabaseAdminClient();
  const { data: promoClaim } = await db.from("promo_claims")
    .select("feedback_due_at,feedback_submitted_at")
    .eq("promotion_key", "matematika-launch-50")
    .eq("customer_id", access.customerId)
    .eq("status", "activated")
    .maybeSingle();
  const feedbackDue = Boolean(
    promoClaim?.feedback_due_at &&
    !promoClaim.feedback_submitted_at &&
    new Date(promoClaim.feedback_due_at).getTime() <= Date.now()
  );

  return (
    <main className="min-h-[100dvh] bg-[#f5eee3] text-ink">
      <header className="border-b border-black/5 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/matematika-game/assets/icons/icon-192.png"
              alt="Papa Bonski"
              width={48}
              height={48}
              className="rounded-xl"
              priority
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">Papa Bonski Matematika</p>
              <p className="truncate text-xs font-semibold text-ink-soft">Akses aktif · {access.customerName}</p>
            </div>
          </div>
          <a href="#install-matematika" className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-extrabold text-white">
            Pasang
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl p-3 sm:p-5">
        {feedbackDue && <div className="mb-4 flex flex-col gap-3 rounded-3xl bg-violet-50 p-5 text-violet-950 ring-1 ring-violet-200 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-extrabold">Sudah mencoba Matematika selama satu hari?</p><p className="mt-1 text-sm">Bagikan ulasan jujur Anda sebagai peserta program 50 pengguna awal.</p></div>
          <Link href="/matematika/testimoni" className="btn-primary shrink-0">Isi Ulasan</Link>
        </div>}
        <iframe
          src="/matematika-game/index.html"
          title="Papa Bonski Matematika"
          className="h-[calc(100dvh-6.25rem)] min-h-[620px] w-full rounded-3xl border-0 bg-white shadow-xl"
          allow="autoplay"
        />

        <div id="install-matematika" className="scroll-mt-4 pb-6 pt-2">
          <PwaInstallPrompt appName="Papa Bonski Matematika" />
        </div>
      </section>
    </main>
  );
}
