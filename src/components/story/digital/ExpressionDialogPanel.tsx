import type { DigitalStoryExpression } from "@/lib/digital-stories";

export default function ExpressionDialogPanel({
  items,
}: {
  items: DigitalStoryExpression[];
}) {
  return (
    <div>
      <div className="rounded-2xl bg-brand-primary/10 px-4 py-3 ring-1 ring-brand-primary/15">
        <p className="text-sm font-extrabold text-brand-primary">
          Belajar expression dari situasi cerita
        </p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-soft">
          Baca dialognya, tirukan intonasinya, lalu pakai prompt latihan untuk
          role-play bersama orang tua atau guru.
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {items.map((item, index) => (
          <article
            key={item.expression}
            className="rounded-card bg-surface-soft p-4 ring-1 ring-black/[0.05]"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-extrabold text-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-ink">{item.expression}</h3>
                <p className="mt-0.5 text-sm font-semibold text-ink-faint">{item.meaning}</p>
              </div>
            </div>

            <p className="mt-3 rounded-xl bg-surface-card px-3 py-2 text-xs font-bold leading-relaxed text-ink-soft ring-1 ring-black/[0.04]">
              {item.useCase}
            </p>

            <div className="mt-3 space-y-2">
              {item.dialog.map((line) => (
                <div
                  key={`${item.expression}-${line.speaker}-${line.text}`}
                  className="rounded-2xl bg-surface-card p-3 ring-1 ring-black/[0.04]"
                >
                  <p className="text-[0.7rem] font-extrabold uppercase tracking-wide text-brand-primary">
                    {line.speaker}
                  </p>
                  <p className="mt-1 text-sm font-extrabold leading-relaxed text-ink">
                    "{line.text}"
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-faint">
                    {line.translation}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl bg-brand-accent/10 px-3 py-2 ring-1 ring-brand-accent/15">
              <p className="text-[0.7rem] font-extrabold uppercase tracking-wide text-brand-accent">
                Practice
              </p>
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink-soft">
                {item.practicePrompt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
