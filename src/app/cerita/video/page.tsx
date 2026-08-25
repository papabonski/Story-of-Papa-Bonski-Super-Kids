import type { Metadata } from "next";
import AppHeader from "@/components/ui/AppHeader";
import StoryCatalog from "@/components/story/digital/StoryCatalog";
import { digitalStories, isStoryReady } from "@/lib/digital-stories";

export const metadata: Metadata = {
  title: "Cerita Anak Digital (English)",
  description: "Katalog video cerita anak digital berbahasa Inggris.",
};

export default function DigitalStoryListPage() {
  // Only the fields the client grid renders — keeps the serialized payload small.
  const catalog = digitalStories.map((story) => ({
    id: story.id,
    number: story.number,
    title: story.title,
    level: story.level,
    thumbnail: story.thumbnail,
    ready: isStoryReady(story),
    vocabularyCount: story.vocabulary.length,
    expressionCount: story.expressionDialogs.length,
    exerciseCount: story.exercises.length,
  }));

  const readyCount = catalog.filter((story) => story.ready).length;

  return (
    <main className="min-h-[100dvh] bg-surface">
      <AppHeader wide backHref="/" title="Cerita Anak Digital" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-black/[0.04] bg-gradient-to-b from-brand-primary/[0.07] to-transparent">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="float-slow absolute -left-12 top-0 h-40 w-40 rounded-full bg-brand-accent/25 blur-3xl" />
          <span className="float absolute right-0 top-4 h-44 w-44 rounded-full bg-brand-secondary/15 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-8 pt-7">
          <p className="anim-fade-up text-xs font-extrabold uppercase tracking-[0.14em] text-brand-primary">
            English Digital Stories
          </p>
          <h1 className="anim-fade-up d1 mt-1.5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Cerita Anak Digital
          </h1>
          <p className="anim-fade-up d2 mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
            Nonton videonya, baca buku PDF-nya, hafalkan kosakatanya, lalu uji pemahaman
            lewat latihan soal interaktif — semuanya dalam bahasa Inggris.
          </p>

          <div className="anim-fade-up d3 mt-5 flex flex-wrap gap-2.5">
            <Stat emoji="🎬" value={catalog.length} label="Cerita" />
            <Stat emoji="✅" value={readyCount} label="Siap ditonton" />
            <Stat emoji="🔤" value="30+" label="Kosakata / cerita" />
            <Stat emoji="✏️" value="20" label="Soal / cerita" />
          </div>
        </div>
      </div>

      <section className="mx-auto w-full max-w-6xl px-5 py-6">
        <StoryCatalog stories={catalog} />
      </section>
    </main>
  );
}

function Stat({
  emoji,
  value,
  label,
}: {
  emoji: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-surface-card px-3.5 py-2.5 shadow-sm ring-1 ring-black/[0.05]">
      <span className="text-lg" aria-hidden>
        {emoji}
      </span>
      <span>
        <span className="block text-base font-extrabold leading-none text-ink">{value}</span>
        <span className="block text-[0.7rem] font-bold text-ink-faint">{label}</span>
      </span>
    </div>
  );
}
