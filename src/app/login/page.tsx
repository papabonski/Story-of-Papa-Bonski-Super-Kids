import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { getRuntimeBrand } from "@/lib/white-label/settings";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ email?: string; next?: string }> }) {
  const brand = await getRuntimeBrand();
  const params = await searchParams;
  const requestedNext = params.next || "/onboarding";
  const safeNext = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/onboarding";

  return <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink"><div className="mx-auto max-w-md">
    <div className="rounded-[2rem] bg-surface-card p-7 shadow-xl ring-1 ring-black/[0.06]">
      <div className="text-center">
        <Image src={brand.logoSrc || "/logo.png"} alt={brand.name} width={112} height={112} className="mx-auto rounded-3xl" />
        <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">Login Member</p>
        <h1 className="mt-2 text-3xl font-extrabold">Masuk ke {brand.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">Masukkan email yang sama seperti saat pembelian. Kami akan mengirim kode OTP 6 digit untuk masuk.</p>
      </div>
      <LoginForm initialEmail={params.email || ""} nextPath={safeNext} />
      <p className="mt-5 text-center text-xs text-ink-soft">Belum membeli? <Link className="font-extrabold text-brand-primary hover:underline" href="/">Lihat Papa Bonski</Link></p>
    </div>
  </div></main>;
}
