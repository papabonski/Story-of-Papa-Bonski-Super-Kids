import Image from "next/image";
import Link from "next/link";
import MandarinPurchaseGate from "@/components/marketing/MandarinPurchaseGate";
import { CUSTOMER_ENTITLEMENTS, getCustomerAccess } from "@/lib/customer-access";

export const dynamic = "force-dynamic";

export default async function MandarinCheckoutPage() {
  // The Papa Bonski store checkout is a public, non-secret default. Keeping an
  // environment override makes white-label deployments possible without
  // forcing the standard installation to configure another variable.
  const standaloneCheckoutReady = Boolean(
    process.env.ORDERHERO_MANDARIN_CHECKOUT_URL ||
      "https://papabonski.orderhero.id/form/form-order-papa-bonski-mandarin",
  );
  const memberCheckoutReady = Boolean(
    process.env.ORDERHERO_MANDARIN_MEMBER_CHECKOUT_URL ||
      "https://papabonski.orderhero.id/form/papa-bonski-mandarin-member-super-kids",
  );
  const [superKidsAccess, matematikaAccess, mandarinAccess] = await Promise.all([
    getCustomerAccess(CUSTOMER_ENTITLEMENTS.superKids),
    getCustomerAccess(CUSTOMER_ENTITLEMENTS.matematika),
    getCustomerAccess(CUSTOMER_ENTITLEMENTS.mandarin),
  ]);

  return (
    <main className="min-h-[100dvh] bg-[#f5eee3] px-5 py-8 text-ink">
      <div className="mx-auto max-w-lg">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-extrabold">
            <Image src="/mandarin-game/assets/papa-bonski-logo.png" alt="Papa Bonski" width={46} height={46} className="rounded-xl" />
            <span>Papa Bonski Mandarin</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-ink-soft">Kembali</Link>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-black/[0.06] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-primary">Sebelum pembayaran</p>
          <h1 className="mt-2 text-3xl font-extrabold">Siapa yang akan belajar Mandarin?</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">Harga normal pelanggan baru adalah <b>Rp25.000</b>. Selama kuota tersedia, 50 pengguna awal yang belum pernah mengambil promo Rp0 mendapat akses gratis dan diminta memberikan ulasan jujur setelah satu hari. Pemilik Super Kids atau Matematika mendapat harga add-on <b>Rp15.000</b>.</p>
          <div className="mt-7"><MandarinPurchaseGate
            standaloneCheckoutReady={standaloneCheckoutReady}
            memberCheckoutReady={memberCheckoutReady}
            signedInEmail={superKidsAccess?.email || matematikaAccess?.email || mandarinAccess?.email}
            hasSuperKidsAccess={Boolean(superKidsAccess?.hasAccess)}
            hasMatematikaAccess={Boolean(matematikaAccess?.hasAccess)}
            hasMandarinAccess={Boolean(mandarinAccess?.hasAccess)}
          /></div>
        </div>
      </div>
    </main>
  );
}
