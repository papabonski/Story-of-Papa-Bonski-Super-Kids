import Image from "next/image";
import { redirect } from "next/navigation";
import SellerOtpLogin from "@/components/seller/SellerOtpLogin";
import { hasSellerSession, safeSellerAdminNextPath, sellerOtpConfigured } from "@/lib/seller-auth";

export const dynamic = "force-dynamic";

export default async function SellerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = safeSellerAdminNextPath(params.next);
  if (await hasSellerSession()) redirect(next);
  const configured = sellerOtpConfigured();

  return (
    <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink">
      <div className="mx-auto max-w-md">
        <div className="rounded-[2rem] bg-surface-card p-7 shadow-xl ring-1 ring-black/[0.06]">
          <div className="text-center">
            <Image src="/logo.png" alt="Papa Bonski" width={96} height={96} className="mx-auto rounded-3xl" />
            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">Internal Access</p>
            <h1 className="mt-2 text-3xl font-extrabold">Seller Center</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Masuk dengan email administrator Papa Bonski. Kode OTP 6 digit akan dikirim ke email yang terdaftar.
            </p>
          </div>

          {!configured && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800 ring-1 ring-red-100">
              ⚠️ Login OTP Seller Center belum siap. Konfigurasi Supabase atau secret session admin belum lengkap.
            </div>
          )}

          <SellerOtpLogin nextPath={next} disabled={!configured} />

          <p className="mt-5 text-center text-xs text-ink-soft">
            Kode OTP hanya berlaku singkat. Setelah berhasil masuk, sesi Seller Center berlaku maksimal 12 jam dan disimpan dalam cookie HttpOnly.
          </p>
        </div>
      </div>
    </main>
  );
}
