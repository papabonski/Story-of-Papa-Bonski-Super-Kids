import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AppHeader from "@/components/ui/AppHeader";
import ExpressionDialogPanel from "@/components/story/digital/ExpressionDialogPanel";
import QuizPanel from "@/components/story/digital/QuizPanel";
import StoryTabs, { type StoryTab } from "@/components/story/digital/StoryTabs";
import VocabularyPanel from "@/components/story/digital/VocabularyPanel";
import {
  digitalStories,
  findDigitalStory,
  getStoryNeighbours,
  isStoryReady,
  type DigitalStory,
} from "@/lib/digital-stories";

export function generateStaticParams() {
  return digitalStories.map((story) => ({ videoId: story.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ videoId: string }>;
}): Promise<Metadata> {
  const { videoId } = await params;
  const story = findDigitalStory(videoId);
  if (!story) return {};
  return {
    title: `${story.title} | Cerita Anak Digital`,
    description: `Video cerita anak digital berbahasa Inggris: ${story.title}.`,
  };
}

export default async function DigitalStoryDetailPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  const story = findDigitalStory(videoId);
  if (!story) notFound();

  const ready = isStoryReady(story);
  const { previous, next } = getStoryNeighbours(story.id);

  const tabs: StoryTab[] = [
    {
      id: "summary",
      label: "Ringkasan",
      emoji: "📖",
      content: (
        <Panel title="Ringkasan Cerita" hint="Apa yang terjadi di dalam cerita ini">
          <div className="max-w-3xl space-y-4 text-[0.95rem] leading-relaxed text-ink-soft">
            {story.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Panel>
      ),
    },
    {
      id: "vocabulary",
      label: "Vocabulary",
      emoji: "🔤",
      count: story.vocabulary.length || undefined,
      content: (
        <Panel title="Vocabulary" hint="Kata-kata penting beserta artinya">
          {story.vocabulary.length > 0 ? (
            <VocabularyPanel items={story.vocabulary} />
          ) : (
            <EmptyState
              emoji="🔤"
              text="Vocabulary belum tersedia untuk video ini."
            />
          )}
        </Panel>
      ),
    },
    ...(story.expressionDialogs.length > 0
      ? [
          {
            id: "expression",
            label: "Expression Dialog",
            emoji: "💬",
            count: story.expressionDialogs.length,
            content: (
              <Panel
                title="Expression Dialog"
                hint="Contoh percakapan pendek dari situasi cerita"
              >
                <ExpressionDialogPanel items={story.expressionDialogs} />
              </Panel>
            ),
          } satisfies StoryTab,
        ]
      : []),
    {
      id: "quiz",
      label: "Latihan Soal",
      emoji: "✏️",
      count: story.exercises.length || undefined,
      content: (
        <Panel title="Latihan Soal" hint="Jawab satu per satu, nilai muncul di akhir">
          {story.exercises.length > 0 ? (
            <QuizPanel exercises={story.exercises} />
          ) : (
            <EmptyState emoji="✏️" text="Latihan soal belum tersedia untuk video ini." />
          )}
        </Panel>
      ),
    },
    {
      id: "pdf",
      label: "PDF Storybook",
      emoji: "📄",
      content: (
        <Panel
          title="PDF Storybook"
          hint="Baca versi buku bergambarnya"
          action={
            story.pdfViewUrl && (
              <a
                href={story.pdfViewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-extrabold text-brand-primary hover:underline"
              >
                Buka di tab baru ↗
              </a>
            )
          }
        >
          {story.pdfPreviewUrl ? (
            <div className="overflow-hidden rounded-2xl bg-surface-soft ring-1 ring-black/[0.05]">
              <iframe
                src={story.pdfPreviewUrl}
                title={`${story.title} PDF`}
                loading="lazy"
                className="h-[70vh] min-h-[420px] w-full"
              />
            </div>
          ) : (
            <EmptyState emoji="📄" text="PDF belum tersedia untuk video ini." />
          )}
        </Panel>
      ),
    },
  ];

  return (
    <main className="min-h-[100dvh] bg-surface">
      <AppHeader wide backHref="/cerita/video" title={story.title} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-black/[0.04] bg-gradient-to-b from-brand-primary/[0.07] to-transparent">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="float-slow absolute -left-10 top-0 h-32 w-32 rounded-full bg-brand-accent/25 blur-3xl" />
          <span className="float absolute right-0 top-6 h-40 w-40 rounded-full bg-brand-secondary/15 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-7 pt-6">
          <nav aria-label="Breadcrumb" className="text-xs font-bold text-ink-faint">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="transition hover:text-brand-primary">
                  Beranda
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/cerita/video" className="transition hover:text-brand-primary">
                  Cerita Digital
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink-soft">Video {story.number}</li>
            </ol>
          </nav>

          <p className="anim-fade-up mt-3 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-primary">
            Digital Story for Kids · English
          </p>
          <h1 className="anim-fade-up d1 mt-1.5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            {story.title}
          </h1>

          <div className="anim-fade-up d2 mt-3 flex flex-wrap items-center gap-2">
            <Chip emoji="🎬">Video {story.number}</Chip>
            <Chip emoji="📶">{story.level}</Chip>
            <Chip emoji="🌍">{story.language}</Chip>
            {story.vocabulary.length > 0 && (
              <Chip emoji="🔤">{story.vocabulary.length} kata</Chip>
            )}
            {story.exercises.length > 0 && (
              <Chip emoji="✏️">{story.exercises.length} soal</Chip>
            )}
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                ready
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-ink/10 text-ink-soft"
              }`}
            >
              {ready ? "● Siap ditonton" : "● Segera hadir"}
            </span>
          </div>
        </div>
      </div>

      <section className="mx-auto w-full max-w-6xl px-5 py-5 sm:py-6">
        {/* ── Player + side panel ────────────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="anim-fade-up -mx-5 overflow-hidden bg-surface-card shadow-sm ring-y ring-black/[0.05] sm:mx-0 sm:rounded-card sm:ring-1">
            <div className="relative aspect-video w-full bg-ink">
              {story.videoPreviewUrl ? (
                <iframe
                  src={story.videoPreviewUrl}
                  title={story.title}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <>
                  <Image
                    src={story.thumbnail}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover opacity-30 grayscale"
                    priority
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <span className="text-4xl" aria-hidden>
                      🎬
                    </span>
                    <p className="mt-3 text-lg font-extrabold text-white">
                      Video segera hadir
                    </p>
                    <p className="mt-1 max-w-sm text-sm font-semibold text-white/70">
                      Materi untuk cerita ini sedang disiapkan. Sementara itu, jelajahi
                      cerita lain yang sudah siap.
                    </p>
                  </div>
                </>
              )}
            </div>
            {ready && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5 sm:px-5">
                <p className="text-sm font-extrabold text-ink">
                  🎧 Tonton sambil menyimak kata-katanya
                </p>
                {story.videoViewUrl && (
                  <a
                    href={story.videoViewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-extrabold text-brand-primary hover:underline"
                  >
                    Layar penuh di Drive ↗
                  </a>
                )}
              </div>
            )}
          </div>

          <aside className="anim-fade-up d2 lg:sticky lg:top-[calc(var(--app-header-h)+1.25rem)] lg:self-start">
            <div className="rounded-card bg-surface-card p-5 shadow-sm ring-1 ring-black/[0.05]">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-faint">
                Isi materi
              </h2>
              <ul className="mt-3 space-y-2">
                <MaterialRow emoji="🎬" label="Video cerita" available={ready} />
                <MaterialRow
                  emoji="📄"
                  label="PDF storybook"
                  available={Boolean(story.pdfPreviewUrl)}
                />
                <MaterialRow
                  emoji="🔤"
                  label="Vocabulary"
                  available={story.vocabulary.length > 0}
                  note={story.vocabulary.length ? `${story.vocabulary.length} kata` : undefined}
                />
                <MaterialRow
                  emoji="✏️"
                  label="Expression Dialog"
                  available={story.expressionDialogs.length > 0}
                  note={
                    story.expressionDialogs.length
                      ? `${story.expressionDialogs.length} dialog`
                      : undefined
                  }
                />
                <MaterialRow
                  emoji="✏️"
                  label="Latihan soal"
                  available={story.exercises.length > 0}
                  note={story.exercises.length ? `${story.exercises.length} soal` : undefined}
                />
              </ul>

              <div className="mt-5 grid gap-2.5">
                {story.videoViewUrl && (
                  <a
                    href={story.videoViewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary py-3 text-sm"
                  >
                    🎬 Buka Video Drive
                  </a>
                )}
                {story.pdfViewUrl && (
                  <a
                    href={story.pdfViewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary py-3 text-sm"
                  >
                    📄 Buka PDF Drive
                  </a>
                )}
                <Link href="/cerita/video" className="btn-secondary py-3 text-sm">
                  ← Kembali ke daftar
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Materials ─────────────────────────────────────────────────── */}
        <StoryTabs tabs={tabs} />

        {/* ── Pager ─────────────────────────────────────────────────────── */}
        <nav
          aria-label="Cerita lainnya"
          className="mt-8 grid gap-3 border-t border-black/[0.06] pt-6 sm:grid-cols-2"
        >
          <PagerLink story={previous} direction="prev" />
          <PagerLink story={next} direction="next" />
        </nav>
      </section>
    </main>
  );
}

function Chip({ emoji, children }: { emoji: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-card px-3 py-1.5 text-xs font-extrabold text-ink-soft shadow-sm ring-1 ring-black/[0.05]">
      <span aria-hidden>{emoji}</span>
      {children}
    </span>
  );
}

function MaterialRow({
  emoji,
  label,
  available,
  note,
}: {
  emoji: string;
  label: string;
  available: boolean;
  note?: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-surface-soft px-3 py-2.5 ring-1 ring-black/[0.03]">
      <span className="text-base" aria-hidden>
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-extrabold ${available ? "text-ink" : "text-ink-faint"}`}
        >
          {label}
        </span>
        {note && <span className="block text-xs font-bold text-ink-faint">{note}</span>}
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-extrabold text-white ${
          available ? "bg-emerald-500" : "bg-ink-faint/50"
        }`}
        aria-label={available ? "Tersedia" : "Belum tersedia"}
      >
        {available ? "✓" : "…"}
      </span>
    </li>
  );
}

function Panel({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card bg-surface-card p-5 shadow-sm ring-1 ring-black/[0.05] sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-ink">{title}</h2>
          {hint && <p className="mt-0.5 text-xs font-bold text-ink-faint">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="rounded-2xl bg-surface-soft px-4 py-10 text-center ring-1 ring-black/[0.04]">
      <p className="text-3xl opacity-60" aria-hidden>
        {emoji}
      </p>
      <p className="mt-2 text-sm font-bold text-ink-faint">{text}</p>
    </div>
  );
}

function PagerLink({
  story,
  direction,
}: {
  story?: DigitalStory;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";
  if (!story) return <span className="hidden sm:block" />;

  return (
    <Link
      href={`/cerita/video/${story.id}`}
      className={`hover-lift group flex items-center gap-3 rounded-card bg-surface-card p-4 shadow-sm ring-1 ring-black/[0.05] ${
        isNext ? "sm:flex-row-reverse sm:text-right" : ""
      }`}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition group-hover:bg-brand-primary group-hover:text-white"
        aria-hidden
      >
        {isNext ? "→" : "←"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-extrabold uppercase tracking-wide text-ink-faint">
          {isNext ? "Cerita berikutnya" : "Cerita sebelumnya"}
        </span>
        <span className="block truncate text-sm font-extrabold text-ink">{story.title}</span>
      </span>
    </Link>
  );
}
