"use client";

import { useMemo, useState } from "react";
import Confetti from "@/components/ui/Confetti";
import type { DigitalStoryExercise } from "@/lib/digital-stories";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/**
 * One-question-at-a-time quiz for a digital story.
 *
 * The exercises used to render as a long static list with the answer tucked in
 * a <details>, which is neither tidy nor practice. Here a child answers one
 * question, gets instant feedback, and finishes with a score plus a review of
 * every question.
 */
export default function QuizPanel({ exercises }: { exercises: DigitalStoryExercise[] }) {
  const [current, setCurrent] = useState(0);
  /** Chosen option per question index; undefined until answered. */
  const [picked, setPicked] = useState<(string | undefined)[]>(() =>
    exercises.map(() => undefined)
  );
  const [finished, setFinished] = useState(false);

  const exercise = exercises[current];
  const chosen = picked[current];
  const answered = picked.filter(Boolean).length;
  const score = useMemo(
    () => picked.filter((choice, i) => choice === exercises[i].answer).length,
    [picked, exercises]
  );

  function choose(option: string) {
    if (chosen) return; // one shot per question
    setPicked((all) => all.map((value, i) => (i === current ? option : value)));
  }

  function next() {
    if (current < exercises.length - 1) setCurrent(current + 1);
    else setFinished(true);
  }

  function restart() {
    setPicked(exercises.map(() => undefined));
    setCurrent(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <QuizResult
        exercises={exercises}
        picked={picked}
        score={score}
        onRestart={restart}
        onReview={(index) => {
          setCurrent(index);
          setFinished(false);
        }}
      />
    );
  }

  const progress = Math.round((answered / exercises.length) * 100);

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-soft">
          <div
            className="h-full rounded-full bg-brand-primary transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="shrink-0 text-xs font-extrabold text-ink-faint">
          {answered}/{exercises.length}
        </p>
      </div>

      <div className="mt-4 rounded-card bg-surface-soft p-4 ring-1 ring-black/[0.04] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-extrabold text-brand-primary">
            Soal {current + 1} dari {exercises.length}
          </span>
          <span className="text-xs font-extrabold text-ink-faint">Benar: {score}</span>
        </div>

        <p className="mt-3 text-lg font-extrabold leading-snug text-ink">
          {exercise.question}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {exercise.options.map((option, i) => {
            const isCorrect = option === exercise.answer;
            const isChosen = option === chosen;
            const state = !chosen
              ? "idle"
              : isCorrect
                ? "correct"
                : isChosen
                  ? "wrong"
                  : "muted";

            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(option)}
                disabled={Boolean(chosen)}
                className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm font-bold transition ${
                  state === "idle"
                    ? "bg-surface-card text-ink-soft ring-1 ring-black/[0.06] hover:-translate-y-0.5 hover:text-ink hover:ring-brand-primary/40 active:scale-95"
                    : state === "correct"
                      ? "bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400"
                      : state === "wrong"
                        ? "bg-rose-50 text-rose-800 ring-2 ring-rose-400"
                        : "bg-surface-card text-ink-faint opacity-60 ring-1 ring-black/[0.04]"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                    state === "correct"
                      ? "bg-emerald-500 text-white"
                      : state === "wrong"
                        ? "bg-rose-500 text-white"
                        : "bg-surface-soft text-ink-faint"
                  }`}
                  aria-hidden
                >
                  {state === "correct" ? "✓" : state === "wrong" ? "✕" : LETTERS[i]}
                </span>
                <span className="min-w-0 flex-1">{option}</span>
              </button>
            );
          })}
        </div>

        {chosen && (
          <div className="anim-fade-up mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p
              className={`text-sm font-extrabold ${
                chosen === exercise.answer ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {chosen === exercise.answer
                ? "🎉 Benar sekali!"
                : `💡 Jawaban yang benar: ${exercise.answer}`}
            </p>
            <button type="button" onClick={next} className="btn-primary py-2.5 text-sm">
              {current < exercises.length - 1 ? "Soal berikutnya →" : "Lihat hasil 🏁"}
            </button>
          </div>
        )}
      </div>

      {/* Question jump dots */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {exercises.map((item, i) => {
          const choice = picked[i];
          return (
            <button
              key={item.question}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Ke soal ${i + 1}`}
              aria-current={i === current}
              className={`h-7 w-7 rounded-lg text-[0.7rem] font-extrabold transition ${
                i === current
                  ? "bg-ink text-white"
                  : !choice
                    ? "bg-surface-soft text-ink-faint hover:text-ink"
                    : choice === item.answer
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuizResult({
  exercises,
  picked,
  score,
  onRestart,
  onReview,
}: {
  exercises: DigitalStoryExercise[];
  picked: (string | undefined)[];
  score: number;
  onRestart: () => void;
  onReview: (index: number) => void;
}) {
  const total = exercises.length;
  const percent = Math.round((score / total) * 100);
  const great = percent >= 80;

  return (
    <div className="anim-fade-up">
      {great && <Confetti count={30} />}

      <div className="rounded-card bg-gradient-to-b from-brand-primary/10 to-brand-accent/10 p-6 text-center ring-1 ring-brand-primary/15">
        <p className="text-4xl" aria-hidden>
          {great ? "🏆" : percent >= 50 ? "🌟" : "🌱"}
        </p>
        <h3 className="mt-2 text-2xl font-extrabold text-ink">
          {great ? "Hebat sekali!" : percent >= 50 ? "Bagus, terus berlatih!" : "Ayo coba lagi!"}
        </h3>
        <p className="mt-1 text-sm font-bold text-ink-soft">
          Kamu menjawab benar {score} dari {total} soal ({percent}%)
        </p>

        <div className="mx-auto mt-4 h-2.5 max-w-xs overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full bg-brand-primary transition-[width] duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>

        <button type="button" onClick={onRestart} className="btn-primary mt-5 py-3 text-sm">
          🔁 Ulangi latihan
        </button>
      </div>

      <h4 className="mt-6 text-sm font-extrabold uppercase tracking-wide text-ink-faint">
        Pembahasan
      </h4>
      <ul className="mt-3 space-y-2">
        {exercises.map((exercise, i) => {
          const choice = picked[i];
          const correct = choice === exercise.answer;
          return (
            <li key={exercise.question}>
              <button
                type="button"
                onClick={() => onReview(i)}
                className="flex w-full items-start gap-3 rounded-2xl bg-surface-soft px-3.5 py-3 text-left ring-1 ring-black/[0.04] transition hover:bg-surface-card"
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white ${
                    correct ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  aria-hidden
                >
                  {correct ? "✓" : "✕"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold text-ink">
                    {i + 1}. {exercise.question}
                  </span>
                  {!correct && (
                    <span className="mt-1 block text-xs font-bold text-ink-faint">
                      Jawabanmu: {choice ?? "—"} · Benar:{" "}
                      <span className="text-emerald-700">{exercise.answer}</span>
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
