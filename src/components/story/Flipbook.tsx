"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import type { WordTiming } from "@/lib/database.types";

export type FlipScene = {
  index: number;
  narration: string | null;
  /** One illustration shown on the page. */
  imageUrls: (string | null)[];
  audioUrl: string | null;
  timings: WordTiming[];
};

const SWIPE_THRESHOLD = 60; // px

/**
 * Renders a scene's first illustration as a classic full-frame page image.
 * Extra URLs from older data are ignored so the page only loads one image.
 */
function SceneImages({
  images,
  sceneNumber,
}: {
  images: (string | null)[];
  sceneNumber: number;
}) {
  const urls = [images[0] ?? null];
  const single = true;

  return (
    <div
      className={`mx-auto w-full max-w-xl rounded-card bg-surface-card p-2 shadow-sm ring-1 ring-black/[0.05] md:max-w-none ${
        single ? "" : "grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2"
      }`}
    >
      {urls.map((url, i) =>
        url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={url}
            alt={`Adegan ${sceneNumber}`}
            className={`w-full rounded-[1rem] object-cover ring-1 ring-black/[0.04] ${
              single ? "kenburns aspect-[4/3]" : "aspect-[3/4]"
            }`}
          />
        ) : (
          <div
            key={i}
            className={`flex w-full items-center justify-center rounded-[1rem] bg-surface-soft text-ink-faint ${
              single ? "aspect-[4/3]" : "aspect-[3/4]"
            }`}
          >
            🎨
          </div>
        )
      )}
    </div>
  );
}

export default function Flipbook({
  storyId,
  title,
  scenes,
  initialSceneIndex = 0,
}: {
  storyId: string;
  title: string | null;
  scenes: FlipScene[];
  initialSceneIndex?: number;
}) {
  const router = useRouter();
  const [cur, setCur] = useState(() =>
    Math.max(0, Math.min(initialSceneIndex, Math.max(0, scenes.length - 1)))
  );
  const [playing, setPlaying] = useState(false);
  const [auto, setAuto] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 of current scene audio

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastProgressAtRef = useRef(Date.now());
  const pendingReadMsRef = useRef(0);
  // Latest flags for use inside audio event handlers (avoid stale closures).
  const autoRef = useRef(auto);
  const playingRef = useRef(playing);
  autoRef.current = auto;
  playingRef.current = playing;

  const scene = scenes[cur];
  const isLast = cur >= scenes.length - 1;
  const pageProgress = scenes.length > 0 ? ((cur + 1) / scenes.length) * 100 : 0;

  const postProgress = useCallback(
    (sceneIndex: number, completed = false) => {
      const now = Date.now();
      const elapsed = now - lastProgressAtRef.current;
      lastProgressAtRef.current = now;
      pendingReadMsRef.current += Math.max(0, Math.min(elapsed, 5 * 60_000));
      const elapsedMs = pendingReadMsRef.current;
      pendingReadMsRef.current = 0;

      const payload = JSON.stringify({ sceneIndex, elapsedMs, completed });
      const url = `/api/stories/${storyId}/reading-progress`;
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        if (navigator.sendBeacon(url, blob)) return;
      }
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    },
    [storyId]
  );

  const finish = useCallback(() => {
    postProgress(cur, true);
    router.push(`/story/${storyId}/ending`);
  }, [cur, postProgress, router, storyId]);

  const goPrev = useCallback(() => {
    setCur((c) => (c > 0 ? c - 1 : c));
  }, []);

  const goNext = useCallback(() => {
    if (!isLast) setCur((c) => c + 1);
    else finish();
  }, [isLast, finish]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || !scene?.audioUrl) return;
    if (a.paused) {
      void a.play().catch(() => {});
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  }, [scene?.audioUrl]);

  // Reset + auto-resume playback when the page turns.
  useEffect(() => {
    postProgress(cur, false);
    const a = audioRef.current;
    setProgress(0);
    if (!a) return;
    a.currentTime = 0;
    if (playingRef.current || autoRef.current) {
      void a.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur, postProgress]);

  useEffect(() => {
    function onPageHide() {
      postProgress(cur, false);
    }
    window.addEventListener("pagehide", onPageHide);
    return () => {
      postProgress(cur, false);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [cur, postProgress]);

  // Preload the NEXT scene's image + audio so page turns feel instant.
  useEffect(() => {
    const next = scenes[cur + 1];
    if (!next) return;
    const url = next.imageUrls[0];
    if (url) {
      const img = new Image();
      img.src = url;
    }
    if (next.audioUrl) {
      const a = new Audio();
      a.preload = "auto";
      a.src = next.audioUrl;
    }
  }, [cur, scenes]);

  // Keyboard: ← → navigate, Space play/pause, Esc closes.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "Escape") {
        router.push(`/story/${storyId}`);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, togglePlay, router, storyId]);

  // Swipe left/right to turn pages (primary interaction on phones).
  const touchStartX = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) goNext();
    else goPrev();
  }

  function onTimeUpdate() {
    const a = audioRef.current;
    if (!a) return;
    if (a.duration > 0) setProgress(a.currentTime / a.duration);
  }

  function onEnded() {
    setProgress(1);
    if (autoRef.current && !isLast) {
      setCur((c) => c + 1); // effect auto-plays the next page
    } else if (autoRef.current && isLast) {
      setPlaying(false);
      setAuto(false);
      finish();
    } else {
      setPlaying(false);
    }
  }

  function toggleAuto() {
    const next = !auto;
    setAuto(next);
    if (next) {
      const a = audioRef.current;
      if (a) {
        void a.play().catch(() => {});
        setPlaying(true);
      }
    }
  }

  /** Tap a word to replay the narration from that word. */
  function seekToWord(i: number) {
    const a = audioRef.current;
    const timing = scene.timings[i];
    if (!a || !timing) return;
    a.currentTime = timing.startMs / 1000;
    void a.play().catch(() => {});
    setPlaying(true);
  }

  return (
    <main
      className="flex min-h-[100dvh] flex-col bg-surface"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div className="pt-safe flex items-center justify-between px-4 pb-2">
        <Link
          href={`/story/${storyId}`}
          aria-label="Tutup"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-card text-lg text-ink-soft ring-1 ring-black/[0.05] transition active:scale-90"
        >
          ✕
        </Link>
        <p className="truncate px-2 text-sm font-bold text-ink">{title}</p>
        <button
          onClick={toggleAuto}
          aria-pressed={auto}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition active:scale-95 ${
            auto
              ? "bg-brand-primary text-white ring-brand-primary"
              : "bg-surface-card text-ink-soft ring-black/[0.05]"
          }`}
        >
          {auto ? "■ " : "▶ "}
          {t("story.autoplay").replace(/^▶\s*/, "")}
        </button>
      </div>
      <div className="px-4 pb-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-soft">
          <div
            className="h-full rounded-full bg-brand-accent transition-[width] duration-300"
            style={{ width: `${pageProgress}%` }}
          />
        </div>
      </div>

      {/* Book page (re-animates on page turn via key) */}
      <div
        key={cur}
        className="anim-page mx-auto grid w-full max-w-6xl flex-1 grid-rows-[auto_1fr] gap-4 px-4 pb-3 md:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] md:grid-rows-1 md:items-center md:gap-6 lg:px-8"
      >
        {/* Page illustration */}
        <div className="min-w-0">
          <SceneImages images={scene.imageUrls} sceneNumber={cur + 1} />
        </div>

        {/* Narration with karaoke highlight */}
        <section className="min-w-0 rounded-card bg-surface-card p-4 shadow-sm ring-1 ring-black/[0.05] md:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-primary">
              {t("story.sceneOf", { current: cur + 1, total: scenes.length })}
            </p>
            <span className="shrink-0 rounded-full bg-surface-soft px-2.5 py-1 text-[11px] font-bold text-ink-soft">
              {cur + 1}/{scenes.length}
            </span>
          </div>
          <div className="max-h-[36dvh] overflow-y-auto pr-1 md:max-h-[58dvh]">
            <p className="text-lg leading-relaxed text-ink md:text-xl">
              {scene.timings.length > 0
                ? scene.timings.map((w, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => seekToWord(i)}
                      className="inline cursor-pointer rounded px-0.5 transition-colors duration-150 hover:bg-surface-soft"
                    >
                      {w.word}&nbsp;
                    </button>
                  ))
                : scene.narration}
            </p>
          </div>
          {scene.timings.length > 0 && (
            <p className="mt-3 border-t border-black/[0.06] pt-3 text-[11px] text-ink-faint">
              {t("story.tapWordHint")}
            </p>
          )}
        </section>
      </div>

      {/* Audio element for the current scene */}
      <audio
        ref={audioRef}
        src={scene.audioUrl ?? undefined}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        preload="auto"
      />

      {/* Audio progress */}
      <div className="px-6">
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface-soft">
          <div
            className="h-full rounded-full bg-brand-primary transition-[width] duration-150"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 px-4 py-5">
        <button
          onClick={goPrev}
          disabled={cur === 0}
          aria-label={t("story.prev")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-card text-xl text-ink ring-1 ring-black/[0.05] transition hover:bg-surface-soft active:scale-90 disabled:opacity-40"
        >
          ‹
        </button>
        <button
          onClick={togglePlay}
          disabled={!scene.audioUrl}
          aria-label={playing ? t("story.pause") : t("story.play")}
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-2xl text-white shadow-md transition active:scale-90 disabled:opacity-50 ${
            playing ? "pulse-glow" : ""
          }`}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button
          onClick={goNext}
          aria-label={t("story.next")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-card text-xl text-ink ring-1 ring-black/[0.05] transition hover:bg-surface-soft active:scale-90"
        >
          ›
        </button>
      </div>

      {/* Page dots (tap to jump) */}
      <div className="pb-safe flex items-center justify-center gap-1.5">
        {scenes.map((s, i) => (
          <button
            key={s.index}
            onClick={() => setCur(i)}
            aria-label={`Adegan ${i + 1}`}
            aria-current={i === cur}
            className={`h-1.5 rounded-full transition-all ${
              i === cur ? "w-5 bg-brand-primary" : "w-1.5 bg-ink-faint/40 hover:bg-ink-faint/70"
            }`}
          />
        ))}
      </div>
    </main>
  );
}
