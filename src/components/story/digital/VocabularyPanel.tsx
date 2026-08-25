"use client";

import { useMemo, useState } from "react";
import type { DigitalStoryWord } from "@/lib/digital-stories";
import { usePronounce } from "./usePronounce";

/**
 * Vocabulary list with IPA phonetics, Gemini TTS playback, search, and a
 * flashcard practice mode.
 *
 * Thirty word/meaning pairs in a plain grid read as a wall of text. Each card
 * now makes the IPA transcription and TTS action explicit, while the
 * Indonesian side can be hidden to turn the list into a self-quiz.
 */
export default function VocabularyPanel({ items }: { items: DigitalStoryWord[] }) {
  const [query, setQuery] = useState("");
  const [practice, setPractice] = useState(false);
  const [revealed, setRevealed] = useState<string[]>([]);
  const { speak, status, activeWord, fallback } = usePronounce();

  // Numbering follows the original list order, so it stays stable while filtering.
  const numbered = useMemo(
    () => items.map((item, i) => ({ ...item, index: i + 1 })),
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return numbered;
    return numbered.filter(
      (item) =>
        item.word.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.phonetic.toLowerCase().includes(q)
    );
  }, [numbered, query]);

  function togglePractice() {
    setPractice((on) => !on);
    setRevealed([]);
  }

  function reveal(word: string) {
    if (!practice) return;
    setRevealed((list) =>
      list.includes(word) ? list.filter((w) => w !== word) : [...list, word]
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
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
            placeholder="Cari kata, arti, atau fonetik…"
            aria-label="Cari vocabulary"
            className="field-input pl-10"
          />
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-primary/10 px-3 py-2 text-xs font-extrabold text-brand-primary ring-1 ring-brand-primary/15">
            IPA + TTS aktif
          </span>
          <button
            type="button"
            onClick={togglePractice}
            aria-pressed={practice}
            className={`rounded-full px-5 py-3 text-sm font-extrabold shadow-sm transition active:scale-95 ${
              practice
                ? "bg-brand-primary text-white"
                : "bg-surface-soft text-ink-soft ring-1 ring-black/[0.06] hover:text-ink"
            }`}
          >
            {practice ? "🙈 Arti disembunyikan" : "🧠 Mode latihan"}
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs font-bold text-ink-faint">
        {filtered.length} dari {items.length} kata · simbol /.../ adalah IPA · ketuk TTS untuk mendengar pelafalan
        {practice && " · ketuk kartu untuk melihat artinya"}
      </p>

      {fallback && (
        <p className="mt-2 rounded-xl bg-brand-accent/15 px-3 py-2 text-xs font-bold text-ink-soft ring-1 ring-brand-accent/25">
          {fallback === "browser"
            ? "ℹ️ Suara AI sedang tidak tersedia — memakai suara bawaan perangkat."
            : "ℹ️ Suara AI sedang tidak tersedia dan perangkat ini tidak punya suara bawaan."}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-card bg-surface-soft px-4 py-8 text-center ring-1 ring-black/[0.04]">
          <p className="text-2xl" aria-hidden>
            🔎
          </p>
          <p className="mt-2 text-sm font-bold text-ink-soft">
            Tidak ada kata yang cocok dengan “{query}”.
          </p>
        </div>
      ) : (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ index, ...item }) => {
            const show = !practice || revealed.includes(item.word);
            const isActive = activeWord === item.word;
            return (
              <li
                key={item.word}
                className={`flex items-center gap-2.5 rounded-2xl bg-surface-soft py-2.5 pl-3 pr-2 ring-1 transition ${
                  isActive ? "ring-brand-primary/50" : "ring-black/[0.04]"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-[0.7rem] font-extrabold text-brand-primary">
                  {index}
                </span>

                <button
                  type="button"
                  onClick={() => reveal(item.word)}
                  disabled={!practice}
                  className={`min-w-0 flex-1 text-left ${
                    practice ? "cursor-pointer" : "cursor-default"
                  }`}
                  aria-label={practice ? `Tampilkan arti ${item.word}` : undefined}
                >
                  <span className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <span className="truncate text-sm font-extrabold text-ink">{item.word}</span>
                    <span className="inline-flex max-w-full shrink-0 items-center gap-1 rounded-full bg-brand-primary/10 px-2 py-0.5 font-mono text-[0.68rem] font-semibold text-brand-primary ring-1 ring-brand-primary/15">
                      <span className="font-sans text-[0.58rem] font-extrabold uppercase tracking-wide">
                        IPA
                      </span>
                      <span className="truncate">/{item.phonetic}/</span>
                    </span>
                  </span>
                  <span
                    className={`block truncate text-xs font-semibold ${
                      show ? "text-ink-faint" : "select-none text-transparent"
                    }`}
                    style={
                      show ? undefined : { background: "rgb(0 0 0 / 0.06)", borderRadius: "6px" }
                    }
                  >
                    {show ? item.meaning : "•••••"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => speak(item.word)}
                  disabled={isActive && status === "loading"}
                  aria-label={`Dengarkan pelafalan ${item.word}`}
                  title={`Dengarkan TTS: ${item.word}`}
                  className={`flex h-9 min-w-[4.35rem] shrink-0 items-center justify-center gap-1 rounded-full px-2 text-xs font-extrabold transition active:scale-90 ${
                    isActive
                      ? "bg-brand-primary text-white shadow-sm"
                      : "bg-surface-card text-ink-soft ring-1 ring-black/[0.06] hover:bg-brand-primary hover:text-white"
                  }`}
                >
                  {isActive && status === "loading" ? (
                    <span
                      aria-hidden
                      className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                  ) : (
                    <>
                      <span aria-hidden className={isActive ? "breathe" : undefined}>
                        🔊
                      </span>
                      <span>TTS</span>
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
