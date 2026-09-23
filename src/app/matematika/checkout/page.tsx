import Image from "next/image";
import Link from "next/link";
import MatematikaPurchaseGate from "@/components/marketing/MatematikaPurchaseGate";
import TestimonialSection from "@/components/marketing/TestimonialSection";
import { CUSTOMER_ENTITLEMENTS, getCustomerAccess } from "@/lib/customer-access";
import { getApprovedTestimonials } from "@/lib/testimonials";

export const dynamic = "force-dynamic";

export default async function MatematikaCheckoutPage() {
  const standaloneCheckoutReady = Boolean(process.env.ORDERHERO_MATEMATIKA_CHECKOUT_URL);
  const memberCheckoutReady = Boolean(process.env.ORDERHERO_MATEMATIKA_MEMBER_CHECKOUT_URL);
  const [superKidsAccess, mandarinAccess, matematikaAccess, testimonials] = await Promise.all([
    getCustomerAccess(CUSTOMER_ENTITLEMENTS.superKids),
    getCustomerAccess(CUSTOMER_ENTITLEMENTS.mandarin),
    getCustomerAccess(CUSTOMER_ENTITLEMENTS.matematika),
    getApprovedTestimonials("matematika"),
  ]);

  return (
    <main className="min-h-[100dvh] bg-[#f5eee3] px-5 py-8 text-ink">
      <div className="mx-auto max-w-lg">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-extrabold">
            <Image src="/matematika-game/assets/icons/icon-192.png" alt="Papa Bonski" width={46} height={46} className="rounded-xl" />
            <span>Papa Bonski Matematika</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-ink-soft">Kembali</Link>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-black/[0.06] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-primary">Sebelum pembayaran</p>
          <h1 className="mt-2 text-3xl font-extrabold">Siapa yang akan belajar Matematika?</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">Harga pelanggan baru adalah <b>Rp25.000</b>. Pemilik Super Kids atau Mandarin mendapat harga add-on <b>Rp15.000</b>.</p>
          <div className="mt-7"><MatematikaPurchaseGate
            standaloneCheckoutReady={standaloneCheckoutReady}
            memberCheckoutReady={memberCheckoutReady}
            signedInEmail={superKidsAccess?.email || mandarinAccess?.email || matematikaAccess?.email}
            hasSuperKidsAccess={Boolean(superKidsAccess?.hasAccess)}
            hasMandarinAccess={Boolean(mandarinAccess?.hasAccess)}
            hasMatematikaAccess={Boolean(matematikaAccess?.hasAccess)}
          /></div>
        </div>
      </div>
      <TestimonialSection testimonials={testimonials} productName="Papa Bonski Matematika" />
    </main>
  );
}
