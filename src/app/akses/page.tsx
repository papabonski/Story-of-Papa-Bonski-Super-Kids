import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomerAccess } from "@/lib/customer-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRuntimeBrand } from "@/lib/white-label/settings";

export const dynamic = "force-dynamic";

export default async function AccessPage() {
  const [brand, supabase] = await Promise.all([
    getRuntimeBrand(),
    createSupabaseServerClient(),
  ]);

  const { data: { user } } = await supabase.auth.getUser();

  if (user && !user.is_anonymous && user.email) {
    const access = await getCustomerAccess();
    if (access?.hasAccess) redirect("/app");
    redirect("/onboarding");
  }

  return (
    <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink">
      <div className="mx-auto max-w-lg">
        <div className="rounded-[2rem] bg-surface-card p-7 text-center shadow-xl ring-1 ring-black/[0.06]">
          <Image
            src={brand.logoSrc || "/logo.png"}
            alt={brand.name}
            width={116}
            height={116}
            className="mx-auto rounded-3xl"
            priority
          />
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">
            Akses Member
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">Papa Bonski Super Kids</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Sudah membeli? Masuk menggunakan <b>Email Penerima</b> yang didaftarkan sebelum checkout. Email Pembeli hanya digunakan untuk transaksi.
          </p>

          <div className="mt-6 rounded-2xl bg-white p-5 text-left text-sm ring-1 ring-black/[0.06]">
            <div className="font-extrabold">Cara masuk:</div>
            <ol className="mt-3 space-y-2 text-ink-soft">
              <li><b className="text-ink">1.</b> Tekan tombol Akses Produk.</li>
              <li><b className="text-ink">2.</b> Masukkan Email Penerima / email login Papa Bonski.</li>
              <li><b className="text-ink">3.</b> Masukkan kode OTP 6 digit dari email Papa Bonski.</li>
              <li><b className="text-ink">4.</b> Akses Super Kids akan diverifikasi otomatis.</li>
            </ol>
          </div>

          <Link href="/login?next=/onboarding" className="btn-primary mt-6 w-full">
            Akses Papa Bonski Super Kids →
          </Link>

          <p className="mt-5 text-xs leading-relaxed text-ink-soft">
            Link ini boleh disimpan atau dibagikan, tetapi fitur Papa Bonski hanya dapat dibuka oleh akun dengan akses aktif.
          </p>
        </div>
      </div>
    </main>
  );
}
