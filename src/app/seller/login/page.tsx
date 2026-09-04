import Image from "next/image";
import { redirect } from "next/navigation";
import { hasSellerSession, sellerAuthConfigured } from "@/lib/seller-auth";
import { sellerLogin } from "./actions";

export const dynamic = "force-dynamic";

function safeNext(value?: string) {
  return value?.startsWith("/seller") && !value.startsWith("//") ? value : "/seller";
}

export default async function SellerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await hasSellerSession()) redirect(next);
  const configured = sellerAuthConfigured();

  return (
    <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink">
      <div className="mx-auto max-w-md">
        <div className="rounded-[2rem] bg-surface-card p-7 shadow-xl ring-1 ring-black/[0.06]">
          <div className="text-center">
            <Image src="/logo.png" alt="Papa Bonski" width={96} height={96} className="mx-auto rounded-3xl" />
            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">Internal Access</p>
            <h1 className="mt-2 text-3xl font-extrabold">Seller Center</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">Area ini berisi data customer, order, webhook, dan konfigurasi operasional. Hanya administrator Papa Bonski yang boleh masuk.</p>
          </div>

          {!configured && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800 ring-1 ring-red-100">
              ⚠️ Seller Center belum diamankan. Set <code>ADMIN_DASHBOARD_SECRET</code> atau <code>STORY_WORKER_SECRET</code> di environment sebelum digunakan.
            </div>
          )}

          <form action={sellerLogin} className="mt-6 space-y-4">
            <input type="hidden" name="next" value={next} />
            <div>
              <label className="text-sm font-extrabold">Secret Administrator</label>
              <input
                name="secret"
                type="password"
                required
                autoComplete="current-password"
                disabled={!configured}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-brand-primary/20 focus:ring-4 disabled:opacity-50"
                placeholder="Masukkan secret administrator"
              />
            </div>
            <button disabled={!configured} className="btn-primary w-full disabled:opacity-50">Masuk ke Seller Center</button>
          </form>

          {params.error && (
            <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">⚠️ {params.error}</div>
          )}
          <p className="mt-5 text-center text-xs text-ink-soft">Sesi admin berlaku maksimal 12 jam dan disimpan dalam cookie HttpOnly.</p>
        </div>
      </div>
    </main>
  );
}
