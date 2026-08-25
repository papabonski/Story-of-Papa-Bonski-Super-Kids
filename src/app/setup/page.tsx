import Link from "next/link";
import SetupWizard from "@/components/setup/SetupWizard";
import { getSetupEnvStatus } from "@/lib/setup/status";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const status = getSetupEnvStatus();

  return (
    <main className="min-h-[100dvh] bg-surface px-4 py-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-ink">🛠️ Setup Aplikasi</h1>
          <Link href="/" className="text-sm font-bold text-ink-soft hover:text-ink">
            Buka App →
          </Link>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-ink-soft">
          Ikuti 3 langkah ini sekali saja setelah deploy. Tidak perlu buka SQL Editor atau
          copy-paste command — semuanya dijalankan dari halaman ini.
        </p>
        <SetupWizard status={status} />
      </div>
    </main>
  );
}
