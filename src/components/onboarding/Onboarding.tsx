"use client";

import { useCallback, useEffect, useState } from "react";
import { t, tArray } from "@/lib/i18n";

/** Bump the suffix to re-show onboarding after a major product change. */
export const ONBOARDING_KEY = "gk_onboarding_v2";

const SLIDES = [
  {
    emoji: "📍",
    titleKey: "onboarding.s1Title",
    bodyKey: "onboarding.s1Body",
    itemsKey: "onboarding.s1Items",
    tipKey: "onboarding.s1Tip",
  },
  {
    emoji: "🧒",
    titleKey: "onboarding.s2Title",
    bodyKey: "onboarding.s2Body",
    itemsKey: "onboarding.s2Items",
    tipKey: "onboarding.s2Tip",
  },
  {
    emoji: "🎛️",
    titleKey: "onboarding.s3Title",
    bodyKey: "onboarding.s3Body",
    itemsKey: "onboarding.s3Items",
    tipKey: "onboarding.s3Tip",
  },
  {
    emoji: "✍️",
    titleKey: "onboarding.s4Title",
    bodyKey: "onboarding.s4Body",
    itemsKey: "onboarding.s4Items",
    tipKey: "onboarding.s4Tip",
  },
  {
    emoji: "⚙️",
    titleKey: "onboarding.s5Title",
    bodyKey: "onboarding.s5Body",
    itemsKey: "onboarding.s5Items",
    tipKey: "onboarding.s5Tip",
  },
  {
    emoji: "📚",
    titleKey: "onboarding.s6Title",
    bodyKey: "onboarding.s6Body",
    itemsKey: "onboarding.s6Items",
    tipKey: "onboarding.s6Tip",
  },
  {
    emoji: "🏷️",
    titleKey: "onboarding.s7Title",
    bodyKey: "onboarding.s7Body",
    itemsKey: "onboarding.s7Items",
    tipKey: "onboarding.s7Tip",
  },
];

/**
 * First-run walkthrough. Renders nothing on the server and for returning
 * visitors — visibility is decided after mount so there's no hydration
 * mismatch and no flash for people who've already seen it.
 *
 * Listens for the `gk:show-onboarding` window event so a "Cara pakai" link can
 * replay it at any time.
 */
export default function Onboarding() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARDING_KEY)) setOpen(true);
    } catch {
      // Private mode / storage blocked — just skip onboarding.
    }
  }, []);

  useEffect(() => {
    function replay() {
      setI(0);
      setOpen(true);
    }
    window.addEventListener("gk:show-onboarding", replay);
    return () => window.removeEventListener("gk:show-onboarding", replay);
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  const isLast = i === SLIDES.length - 1;
  const slide = SLIDES[i];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("onboarding.howTo")}
      className="anim-fade-in fixed inset-0 z-[60] flex flex-col bg-surface/95 backdrop-blur-sm"
    >
      {/* Skip */}
      <div className="pt-safe flex items-center justify-between px-5 pb-2">
        <p className="rounded-full bg-brand-primary/10 px-3 py-1.5 text-xs font-extrabold text-brand-primary">
          {i + 1}/{SLIDES.length}
        </p>
        <button
          onClick={dismiss}
          className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink-soft transition hover:text-ink active:scale-95"
        >
          {t("onboarding.skip")}
        </button>
      </div>

      {/* Slide */}
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-3">
        {/* key forces the entrance animation to replay on each slide */}
        <div key={i} className="anim-fade-up mx-auto flex w-full max-w-md flex-col items-center text-center">
          <div className="float mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-brand-primary/10 text-5xl">
            {slide.emoji}
          </div>
          <h2 className="text-2xl font-extrabold text-ink">{t(slide.titleKey)}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {t(slide.bodyKey)}
          </p>

          <ul className="mt-5 w-full space-y-2 text-left">
            {tArray(slide.itemsKey).map((item) => (
              <li
                key={item}
                className="rounded-card bg-surface-card px-3 py-2 text-sm font-semibold leading-relaxed text-ink-soft ring-1 ring-black/[0.05]"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-4 w-full rounded-card bg-brand-accent/15 px-3 py-2 text-left text-xs font-bold leading-relaxed text-ink-soft ring-1 ring-brand-accent/20">
            {t(slide.tipKey)}
          </div>
        </div>
      </div>

      {/* Dots + action */}
      <div className="pb-safe px-8">
        <div className="mb-5 flex items-center justify-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              aria-current={idx === i}
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-6 bg-brand-primary" : "w-2 bg-ink-faint/40"
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-[0.75fr_1fr] gap-3">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="btn-secondary disabled:opacity-40"
          >
            {t("onboarding.prev")}
          </button>
          <button
            onClick={() => (isLast ? dismiss() : setI((v) => v + 1))}
            className={`btn-primary ${isLast ? "pulse-glow" : ""}`}
          >
            {isLast ? t("onboarding.start") : t("onboarding.next")}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Small link that replays the walkthrough (used on the landing page). */
export function HowToButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("gk:show-onboarding"))}
      className="text-xs font-semibold text-ink-faint underline transition hover:text-ink-soft"
    >
      {t("onboarding.howTo")}
    </button>
  );
}
