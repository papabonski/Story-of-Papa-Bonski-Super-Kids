import Link from "next/link";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";
import { getWhiteLabelSettings } from "@/lib/white-label/settings";
import { requireSellerSession } from "@/lib/seller-auth";
import { resetWhiteLabelSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireSellerSession("/admin");
  const settings = await getWhiteLabelSettings();

  return (
    <main className="min-h-[100dvh] bg-surface">
      <header className="sticky top-0 z-30 border-b border-black/[0.05] bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3">
          <Link href="/seller/system" className="text-sm font-bold text-ink-soft hover:text-ink">
            ← System Readiness
          </Link>
          <form action={resetWhiteLabelSettings} className="flex items-center gap-2">
            <input
              name="adminSecret"
              type="password"
              placeholder="Secret"
              className="h-9 w-32 rounded-card border border-black/10 bg-surface-card px-3 text-xs"
            />
            <button className="h-9 rounded-card bg-surface-card px-3 text-xs font-bold text-ink-soft ring-1 ring-black/[0.05] hover:text-ink">
              Reset
            </button>
          </form>
        </div>
      </header>
      <AdminSettingsForm settings={settings} />
    </main>
  );
}
