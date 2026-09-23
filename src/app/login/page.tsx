import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { getRuntimeBrand } from "@/lib/white-label/settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; next?: string; loggedOut?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // A returning member with a valid device session should never be asked for
  // another OTP. Module authorization remains enforced after entering /app.
  if (user && !user.is_anonymous) redirect("/app");

  const brand = await getRuntimeBrand();
  const isMandarinTarget = params.next?.startsWith("/mandarin") ?? false;
  const isMatematikaTarget = params.next?.startsWith("/matematika") ?? false;
  const productName = brand.name;
  const logoSrc = brand.logoSrc || "/logo.png";

  return <main className="min-h-[100dvh] bg-surface px-5 py-10 text-ink"><div className="mx-auto max-w-md">
    <div className="rounded-[2rem] bg-surface-card p-7 shadow-xl ring-1 ring-black/[0.06]">
      <div className="text-center">
        <Image src={logoSrc} alt={productName} width={112} height={112} className="mx-auto rounded-3xl" />
        <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">Login Member</p>
        <h1 className="mt-2 text-3xl font-extrabold">Masuk ke {productName}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">Satu login untuk seluruh modul Papa Bonski. Gunakan Email Penerima yang didaftarkan sebelum checkout. Pada login pertama, isi juga Nama Penerima, lalu kami kirim kode OTP 6 digit.</p>
      </div>
      {params.loggedOut === "1" && <div className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800">✅ Anda sudah keluar dari perangkat ini.</div>}
      <LoginForm initialEmail={params.email || ""} />
      <p className="mt-5 text-center text-xs text-ink-soft">Belum memiliki modul? <Link className="font-extrabold text-brand-primary hover:underline" href={isMandarinTarget ? "/mandarin/checkout" : isMatematikaTarget ? "/matematika/checkout" : "/"}>Lihat {isMandarinTarget ? "Papa Bonski Mandarin" : isMatematikaTarget ? "Papa Bonski Matematika" : "produk Papa Bonski"}</Link></p>
    </div>
  </div></main>;
}
