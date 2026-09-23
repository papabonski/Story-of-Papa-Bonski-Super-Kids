import type { PublicTestimonial } from "@/lib/testimonials";

export default function TestimonialSection({
  testimonials,
  productName,
}: {
  testimonials: PublicTestimonial[];
  productName: string;
}) {
  if (!testimonials.length) return null;

  return <section className="px-5 py-14">
    <div className="mx-auto max-w-6xl">
      <p className="text-center text-xs font-black uppercase tracking-[.16em] text-brand-primary">Pengalaman pengguna</p>
      <h2 className="mt-2 text-center text-3xl font-extrabold">Cerita dari keluarga yang sudah mencoba</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item) => <figure key={item.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/[.06]">
          <div className="text-amber-500" aria-label={`${item.rating} dari 5 bintang`}>{"★".repeat(item.rating)}<span className="text-slate-200">{"★".repeat(5-item.rating)}</span></div>
          <blockquote className="mt-4 text-sm leading-relaxed text-ink-soft">“{item.review}”</blockquote>
          <figcaption className="mt-4 font-extrabold">{item.displayName}<span className="block text-xs font-semibold text-ink-soft">Pengguna {productName}</span></figcaption>
        </figure>)}
      </div>
    </div>
  </section>;
}
