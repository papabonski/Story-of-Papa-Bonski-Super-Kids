import Link from "next/link";
import { isBaseConfigMissing } from "@/lib/setup/status";

/**
 * Server component, zero network calls — only checks env var presence, so
 * it's safe to render on every page without slowing anything down.
 */
export default function SetupBanner() {
  let missing = false;
  try {
    missing = isBaseConfigMissing();
  } catch {
    missing = false;
  }
  if (!missing) return null;

  return (
    <Link
      href="/setup"
      className="fixed inset-x-0 bottom-0 z-50 block bg-amber-500 px-4 py-2 text-center text-xs font-bold text-white shadow-lg"
    >
      ⚠️ Setup belum selesai — klik di sini untuk lanjutkan konfigurasi
    </Link>
  );
}
