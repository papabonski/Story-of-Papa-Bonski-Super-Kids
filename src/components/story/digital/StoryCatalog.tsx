"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { DigitalStory } from "@/lib/digital-stories";

type CatalogStory = Pick<
  DigitalStory,
  "id" | "number" | "title" | "level" | "thumbnail"
> & {
  ready: boolean;
  vocabularyCount: number;
  expressionCount: number;
  exerciseCount: number;
};

type Filter = "all" | "ready" | "soon";

const FILTERS: { id: Filter; label: string; emoji: string }[] = [
  { id: "all", label: "Semua", emoji: "📚" },
  { id: "ready", label: "Siap ditonton", emoji: "▶️" },
  { id: "soon", label: "Segera hadir", emoji: "⏳" },
];

/**
 * Searchable, filterable grid of digital stories.
 *
 * With 20 cards — most of them still placeholders — an unfiltered grid buries
 * the handful that are actually watchable, so the catalog leads with a filter
 * for ready stories and a title search.
 */
export default function StoryCatalog({ stories }: { stories: CatalogStory[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const readyCount = useMemo(() => stories.filter((s) => s.ready).length, [stories]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stories.filter((story) => {
      if (filter === "ready" && !story.ready) return false;
      if (filter === "soon" && story.ready) return false;
      if (!q) return true;
      return (
        story.title.toLowerCase().includes(q) ||
        story.level.toLowerCase().includes(q) ||
        `video ${story.number}`.includes(q)
      );
    });
  }, [stories, query, filter]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((item) => {
            const isActive = item.id === filter;
            const count =
              item.id === "all"
                ? stories.length
                : item.id === "ready"
                  ? readyCount
                  : stories.length - readyCount;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={isActive}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition active:scale-95 ${
                  isActive
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-surface-card text-ink-soft ring-1 ring-black/[0.06] hover:bg-surface-soft hover:text-ink"
                }`}
              >
                <span aria-hidden>{item.emoji}</span>
                {item.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[0.65rem] ${
                    isActive ? "bg-white/25" : "bg-surface-soft text-ink-faint"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative lg:w-72">
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm"
          >
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul cerita…"
            aria-label="Cari cerita"
            className="field-input pl-10"
          />
        </div>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="mt-6 rounded-card bg-surface-card px-4 py-14 text-center shadow-sm ring-1 ring-black/[0.05]">
          <p className="text-3xl" aria-hidden>
            🔎
          </p>
          <p className="mt-3 text-base font-extrabold text-ink">Cerita tidak ditemukan</p>
          <p className="mt-1 text-sm font-semibold text-ink-faint">
            Coba kata kunci lain atau pilih filter “Semua”.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="btn-secondary mt-5 py-2.5 text-sm"
          >
            Atur ulang pencarian
          </button>
        </div>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((story, index) => (
            <li key={story.id} className="anim-fade-up" style={{ animationDelay: `${Math.min(index, 8) * 0.04}s` }}>
              <Link
                href={`/cerita/video/${story.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-card bg-surface-card shadow-sm ring-1 ring-black/[0.05] transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-brand-primary/25"
              >
                <div className="relative aspect-video bg-surface-soft">
                  <Image
                    src={story.thumbnail}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className={`object-cover transition duration-500 group-hover:scale-105 ${
                      story.ready ? "" : "opacity-40 grayscale"
                    }`}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-extrabold text-ink shadow-sm backdrop-blur">
                    Video {story.number}
                  </span>

                  {story.ready ? (
                    <>
                      <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-brand-primary shadow-lg transition duration-200 group-hover:scale-110"
                      >
                        ▶
                      </span>
                      <span className="absolute bottom-3 left-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[0.7rem] font-extrabold text-white shadow-sm">
                        Siap ditonton
                      </span>
                    </>
                  ) : (
                    <span className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-2.5 py-1 text-[0.7rem] font-bold text-white backdrop-blur">
                      Segera hadir
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[0.7rem] font-extrabold uppercase tracking-wide text-brand-primary">
                    {story.level}
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold leading-snug text-ink">
                    {story.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                    {story.ready ? (
                      <>
                        <Tag>🎬 Video</Tag>
                        <Tag>📄 PDF</Tag>
                        {story.vocabularyCount > 0 && <Tag>🔤 {story.vocabularyCount} kata</Tag>}
                        {story.exerciseCount > 0 && <Tag>✏️ {story.exerciseCount} soal</Tag>}
                      </>
                    ) : (
                      <Tag>⏳ Materi sedang disiapkan</Tag>
                    )}
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-primary">
                    {story.ready ? "Mulai belajar" : "Lihat halaman"}
                    <span className="transition group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-surface-soft px-2.5 py-1 text-[0.68rem] font-bold text-ink-faint">
      {children}
    </span>
  );
}
