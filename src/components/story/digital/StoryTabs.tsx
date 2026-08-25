"use client";

import { useState, type ReactNode } from "react";

export type StoryTab = {
  id: string;
  label: string;
  emoji: string;
  /** Small number shown next to the label (e.g. how many words / questions). */
  count?: number;
  content: ReactNode;
};

/**
 * Sticky tab bar for the digital-story detail page.
 *
 * The four material blocks (summary, vocabulary, quiz, PDF) used to stack in
 * two uneven columns, which left large empty gutters next to the short cards.
 * Tabs keep the page one column tall and let a child jump straight to the part
 * they want.
 *
 * Panels mount lazily on first visit and then stay mounted (hidden), so the
 * Drive PDF iframe is not fetched until asked for and does not reload on every
 * tab switch.
 */
export default function StoryTabs({ tabs }: { tabs: StoryTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const [mounted, setMounted] = useState<string[]>(tabs[0] ? [tabs[0].id] : []);

  function select(id: string) {
    setActive(id);
    setMounted((seen) => (seen.includes(id) ? seen : [...seen, id]));
  }

  return (
    <div className="mt-6">
      <div
        className="sticky z-20 -mx-5 border-y border-black/[0.05] bg-surface/90 px-5 backdrop-blur"
        style={{ top: "var(--app-header-h)" }}
      >
        <div
          role="tablist"
          aria-label="Bagian materi cerita"
          className="scrollbar-none -mb-px flex gap-1 overflow-x-auto py-2"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => select(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition ${
                  isActive
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-surface-card text-ink-soft ring-1 ring-black/[0.06] hover:bg-surface-soft hover:text-ink"
                }`}
              >
                <span aria-hidden>{tab.emoji}</span>
                {tab.label}
                {typeof tab.count === "number" && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[0.65rem] font-extrabold ${
                      isActive ? "bg-white/25 text-white" : "bg-surface-soft text-ink-faint"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {tabs.map((tab) => {
        const isActive = tab.id === active;
        if (!mounted.includes(tab.id)) return null;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={!isActive}
            className={isActive ? "anim-fade-up mt-5" : undefined}
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}
