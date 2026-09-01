"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { brand } from "../../../config/brand";
import { t, tArray } from "@/lib/i18n";
import type { StoryStatus, WordTiming } from "@/lib/database.types";

type SceneData = {
  index: number;
  narration: string | null;
  imagePrompt: string | null;
  /** One image per page; null means it is not generated yet. */
  imageUrls: (string | null)[];
  audioUrl: string | null;
  timings: WordTiming[];
};

export type StoryViewData = {
  id: string;
  status: StoryStatus;
  childName: string;
  title: string | null;
  opener: string | null;
  textApprovedAt: string | null;
  themeLabel: string | null;
  subThemeLabel: string | null;
  moral: string | null;
  doa: { arabic: string | null; latin: string | null; translation: string | null };
  parentGuide: { activity: string | null; questions: string[] };
  errorMessage: string | null;
  shareToken: string | null;
  openerAudioUrl: string | null;
  openerTimings: WordTiming[];
  scenes: SceneData[];
};

type Step = "text" | "review" | "assets" | "audio" | "ready" | "error";
type ApiJson = Record<string, unknown>;
type JobInfo = {
  phase: "text" | "assets" | "audio";
  status: "queued" | "running" | "waiting_review" | "completed" | "failed";
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};
type WorkerKickInfo = {
  attempted: boolean;
  ok: boolean;
  status: number | null;
  error: string | null;
};
type WorkerInfo = {
  configured: boolean;
  autokick: boolean;
  cronConfigured: boolean;
  lastKick: WorkerKickInfo | null;
};
type DraftScene = { index: number; narration: string; imagePrompt: string };
type DraftContent = {
  title: string;
  opener: string;
  moral: string;
  doa: { arabic: string; latin: string; translation: string };
  activity: string;
  questions: string[];
  scenes: DraftScene[];
};

async function readApiJson(res: Response): Promise<ApiJson> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as ApiJson;
  } catch {
    return {
      error: text.replace(/\s+/g, " ").trim().slice(0, 300) || res.statusText,
    };
  }
}

function apiError(json: ApiJson, fallback: string) {
  return typeof json.error === "string" && json.error ? json.error : fallback;
}

function optionalText(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function textValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => (typeof item === "string" ? item : "")).slice(0, 6)
    : [];
}

function draftFromData(data: {
  title: string | null;
  opener: string | null;
  moral: string | null;
  doa: { arabic: string | null; latin: string | null; translation: string | null };
  parentGuide: { activity: string | null; questions: string[] };
  scenes: SceneData[];
}): DraftContent {
  const questions = [...data.parentGuide.questions];
  while (questions.length < 3) questions.push("");
  return {
    title: data.title ?? "",
    opener: data.opener ?? "",
    moral: data.moral ?? "",
    doa: {
      arabic: data.doa.arabic ?? "",
      latin: data.doa.latin ?? "",
      translation: data.doa.translation ?? "",
    },
    activity: data.parentGuide.activity ?? "",
    questions,
    scenes: data.scenes.map((scene) => ({
      index: scene.index,
      narration: scene.narration ?? "",
      imagePrompt: scene.imagePrompt ?? "",
    })),
  };
}

function draftFromJson(json: ApiJson, scenes: SceneData[]): DraftContent {
  const doa = json.doa && typeof json.doa === "object" ? (json.doa as ApiJson) : {};
  const parentGuide =
    json.parentGuide && typeof json.parentGuide === "object"
      ? (json.parentGuide as ApiJson)
      : {};
  return draftFromData({
    title: optionalText(json.title),
    opener: optionalText(json.opener),
    moral: optionalText(json.moral),
    doa: {
      arabic: optionalText(doa.arabic),
      latin: optionalText(doa.latin),
      translation: optionalText(doa.translation),
    },
    parentGuide: {
      activity: optionalText(parentGuide.activity),
      questions: stringArray(parentGuide.questions),
    },
    scenes,
  });
}

function clientDelayMs(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function wait(ms: number): Promise<void> {
  return ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
}

const IMAGE_STEP_DELAY_MS = clientDelayMs(
  process.env.NEXT_PUBLIC_GENERATE_IMAGE_STEP_DELAY_MS,
  2_500
);
const IMAGE_RETRY_LIMIT = clientDelayMs(
  process.env.NEXT_PUBLIC_GENERATE_IMAGE_RETRY_LIMIT,
  6
);
const IMAGE_RETRY_DELAY_MS = clientDelayMs(
  process.env.NEXT_PUBLIC_GENERATE_IMAGE_RETRY_DELAY_MS,
  9_000
);
const AUDIO_STEP_DELAY_MS = clientDelayMs(
  process.env.NEXT_PUBLIC_GENERATE_AUDIO_STEP_DELAY_MS,
  1_500
);
const AUDIO_RETRY_LIMIT = clientDelayMs(
  process.env.NEXT_PUBLIC_GENERATE_AUDIO_RETRY_LIMIT,
  10
);
const AUDIO_RETRY_DELAY_MS = clientDelayMs(
  process.env.NEXT_PUBLIC_GENERATE_AUDIO_RETRY_DELAY_MS,
  8_000
);
const STORY_QUEUE_POLL_MS = clientDelayMs(process.env.NEXT_PUBLIC_STORY_QUEUE_POLL_MS, 2_500);
const STORY_QUEUE_MAX_POLLS = clientDelayMs(process.env.NEXT_PUBLIC_STORY_QUEUE_MAX_POLLS, 240);
const STORY_QUEUE_NUDGE_EVERY_POLLS = Math.max(
  1,
  clientDelayMs(process.env.NEXT_PUBLIC_STORY_QUEUE_NUDGE_EVERY_POLLS, 4)
);

function retryDelayFrom(json: ApiJson, fallback: number): number {
  const raw = json.retryAfterMs;
  const n = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/**
 * A saved image path counts as complete for the automatic workflow.
 * Quota fallback SVGs can still be regenerated explicitly later, but must not
 * keep the story stuck forever in the illustration step.
 */
function slotNeedsImage(url: string | null): boolean {
  return !url;
}

/** Does this scene still need its single page image? */
function sceneNeedsImages(scene: { imageUrls: (string | null)[] }): boolean {
  return slotNeedsImage(scene.imageUrls[0] ?? null);
}

/**
 * Generate one scene illustration, retrying while every image key is on
 * quota cooldown (the route answers 202 + retry). On the final attempt we let
 * the server persist a placeholder so a genuine outage still completes.
 */
async function postImageTask(
  storyId: string,
  index: number
): Promise<ApiJson> {
  for (let attempt = 0; attempt <= IMAGE_RETRY_LIMIT; attempt++) {
    const allowFallback = attempt >= IMAGE_RETRY_LIMIT;
    const res = await fetch(`/api/stories/${storyId}/generate-asset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, kind: "image", allowFallback }),
    });
    const json = await readApiJson(res);

    if (res.status === 202 && json.retry === true && !allowFallback) {
      await wait(retryDelayFrom(json, IMAGE_RETRY_DELAY_MS));
      continue;
    }

    if (!res.ok) throw new Error(apiError(json, "Gagal membuat ilustrasi."));
    return json;
  }

  throw new Error("Ilustrasi masih antre. Coba lagi dalam beberapa saat.");
}

async function postAudioTask(
  storyId: string,
  task: { kind: "opener" } | { kind: "scene"; index: number }
): Promise<ApiJson> {
  for (let attempt = 0; attempt <= AUDIO_RETRY_LIMIT; attempt++) {
    const res = await fetch(`/api/stories/${storyId}/generate-audio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    const json = await readApiJson(res);

    if (res.status === 202 && json.retry === true) {
      if (attempt >= AUDIO_RETRY_LIMIT) {
        throw new Error(
          apiError(json, "Audio masih antre. Coba lagi dalam beberapa saat.")
        );
      }
      await wait(retryDelayFrom(json, AUDIO_RETRY_DELAY_MS));
      continue;
    }

    if (!res.ok) throw new Error(apiError(json, "Gagal membuat audio."));
    return json;
  }

  throw new Error("Audio masih antre. Coba lagi dalam beberapa saat.");
}

async function postStoryJob(storyId: string): Promise<ApiJson> {
  const res = await fetch(`/api/stories/${storyId}/jobs`, { method: "POST" });
  const json = await readApiJson(res);
  if (!res.ok) throw new Error(apiError(json, "Gagal memasukkan cerita ke antrean."));
  return json;
}

async function getStoryJob(storyId: string): Promise<ApiJson> {
  const res = await fetch(`/api/stories/${storyId}/jobs`, { method: "GET" });
  const json = await readApiJson(res);
  if (!res.ok) throw new Error(apiError(json, "Gagal membaca status antrean cerita."));
  return json;
}

function stepFromJobStatus(json: ApiJson): Step | null {
  const step = json.step;
  return step === "text" ||
    step === "review" ||
    step === "assets" ||
    step === "audio" ||
    step === "ready" ||
    step === "error"
    ? step
    : null;
}

function progressFromJobStatus(json: ApiJson): { done: number; total: number } | null {
  const raw = json.progress;
  if (!raw || typeof raw !== "object") return null;
  const progress = raw as Record<string, unknown>;
  const done = Number(progress.done);
  const total = Number(progress.total);
  if (!Number.isFinite(done) || !Number.isFinite(total)) return null;
  return { done, total };
}

function jobInfoFromStatus(json: ApiJson): JobInfo | null {
  const raw = json.job;
  if (!raw || typeof raw !== "object") return null;
  const job = raw as Record<string, unknown>;
  const phase = job.phase;
  const status = job.status;
  if (phase !== "text" && phase !== "assets" && phase !== "audio") return null;
  if (
    status !== "queued" &&
    status !== "running" &&
    status !== "waiting_review" &&
    status !== "completed" &&
    status !== "failed"
  ) {
    return null;
  }

  return {
    phase,
    status,
    attempts: Number(job.attempts) || 0,
    maxAttempts: Number(job.max_attempts) || Number(job.maxAttempts) || 0,
    lastError: optionalText(job.last_error) ?? optionalText(job.lastError),
    createdAt: optionalText(job.created_at) ?? optionalText(job.createdAt),
    updatedAt: optionalText(job.updated_at) ?? optionalText(job.updatedAt),
  };
}

function workerInfoFromStatus(json: ApiJson): WorkerInfo | null {
  const raw = json.worker;
  if (!raw || typeof raw !== "object") return null;
  const worker = raw as Record<string, unknown>;
  const rawKick = worker.lastKick;
  const kick = rawKick && typeof rawKick === "object" ? (rawKick as Record<string, unknown>) : null;
  const status = Number(kick?.status);
  return {
    configured: worker.configured === true,
    autokick: worker.autokick !== false,
    cronConfigured: worker.cronConfigured === true,
    lastKick: kick
      ? {
          attempted: kick.attempted === true,
          ok: kick.ok === true,
          status: Number.isFinite(status) ? status : null,
          error: optionalText(kick.error),
        }
      : null,
  };
}

function imageTitle(progress: { done: number; total: number }): string {
  return progress.total > 0
    ? t("generating.preparingImages", { done: progress.done, total: progress.total })
    : "Menyiapkan ilustrasi cerita...";
}

function audioTitle(progress: { done: number; total: number }): string {
  return progress.total > 0
    ? t("generating.preparingAudio", { done: progress.done, total: progress.total })
    : "Menyiapkan audio cerita...";
}

export default function StoryView({ data }: { data: StoryViewData }) {
  const [content, setContent] = useState({
    title: data.title,
    opener: data.opener,
    themeLabel: data.themeLabel,
    subThemeLabel: data.subThemeLabel,
    moral: data.moral,
    doa: data.doa,
    parentGuide: data.parentGuide,
  });
  const [scenes, setScenes] = useState<SceneData[]>(data.scenes);
  const [openerAudio, setOpenerAudio] = useState<string | null>(data.openerAudioUrl);
  const [textApproved, setTextApproved] = useState(Boolean(data.textApprovedAt));
  const [draft, setDraft] = useState<DraftContent>(() => draftFromData(data));
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null);
  const [workerInfo, setWorkerInfo] = useState<WorkerInfo | null>(null);
  const [kickBusy, setKickBusy] = useState(false);
  const [error, setError] = useState<string | null>(data.errorMessage);

  const initialStep: Step =
    data.status === "error" && !data.title
      ? "error"
      : !data.title
        ? "text"
        : !data.textApprovedAt
          ? "review"
          : data.scenes.some((s) => sceneNeedsImages(s))
            ? "assets"
            : !data.openerAudioUrl || data.scenes.some((s) => !s.audioUrl)
              ? "audio"
              : "ready";
  const [step, setStep] = useState<Step>(initialStep);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    if (initialStep === "error" || initialStep === "ready" || initialStep === "review") return;
    ranRef.current = true;
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(
    opts: {
      approved?: boolean;
      content?: typeof content;
      scenes?: SceneData[];
      openerAudio?: string | null;
    } = {}
  ) {
    setError(null);
    try {
      const approvedForRun = opts.approved ?? textApproved;

      if (!(opts.content ?? content).title) {
        setStep("text");
        await waitForQueuedStory(["review"]);
        return;
      }

      if (!approvedForRun) {
        setStep("review");
        return;
      }

      const nextScenes = opts.scenes ?? scenes;
      const nextOpenerAudio = opts.openerAudio ?? openerAudio;
      if (nextScenes.some((s) => sceneNeedsImages(s))) setStep("assets");
      else if (!nextOpenerAudio || nextScenes.some((s) => !s.audioUrl)) setStep("audio");
      else setStep("ready");

      await waitForQueuedStory(["ready"]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
      setStep("error");
    }
  }

  async function waitForQueuedStory(targetSteps: Step[]) {
    let json = await postStoryJob(data.id);
    applyJobStatus(json);

    const firstStep = stepFromJobStatus(json);
    if (firstStep && targetSteps.includes(firstStep)) {
      window.location.reload();
      return;
    }

    for (let attempt = 0; attempt < STORY_QUEUE_MAX_POLLS; attempt++) {
      await wait(STORY_QUEUE_POLL_MS);
      json =
        attempt > 0 && attempt % STORY_QUEUE_NUDGE_EVERY_POLLS === 0
          ? await postStoryJob(data.id)
          : await getStoryJob(data.id);
      applyJobStatus(json);

      const nextStep = stepFromJobStatus(json);
      const message = optionalText(json.error);

      if (nextStep === "error") throw new Error(message ?? "Job cerita gagal diproses.");

      if (nextStep && targetSteps.includes(nextStep)) {
        window.location.reload();
        return;
      }
    }

    throw new Error("Cerita masih diproses di antrean. Halaman boleh ditutup dan dibuka lagi nanti.");
  }

  async function kickStoryWorkerNow() {
    setKickBusy(true);
    setError(null);
    try {
      const json = await postStoryJob(data.id);
      applyJobStatus(json);

      const nextStep = stepFromJobStatus(json);
      const message = optionalText(json.error);
      if (nextStep === "error") throw new Error(message ?? "Job cerita gagal diproses.");
      if (nextStep === "review" || nextStep === "ready") window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengecek worker.");
      setStep("error");
    } finally {
      setKickBusy(false);
    }
  }

  function applyJobStatus(json: ApiJson) {
    const nextProgress = progressFromJobStatus(json);
    const nextJob = jobInfoFromStatus(json);
    const nextWorker = workerInfoFromStatus(json);
    const nextStep = stepFromJobStatus(json);

    if (nextProgress) setProgress(nextProgress);
    if (nextJob) setJobInfo(nextJob);
    if (nextWorker) setWorkerInfo(nextWorker);
    if (nextStep && nextStep !== "ready") setStep(nextStep);
  }

  function contentFromDraft(nextDraft: DraftContent): typeof content {
    return {
      ...content,
      title: nextDraft.title,
      opener: nextDraft.opener,
      moral: nextDraft.moral,
      doa: {
        arabic: nextDraft.doa.arabic || null,
        latin: nextDraft.doa.latin || null,
        translation: nextDraft.doa.translation || null,
      },
      parentGuide: {
        activity: nextDraft.activity || null,
        questions: nextDraft.questions.filter((q) => q.trim() !== ""),
      },
    };
  }

  function scenesFromDraft(nextDraft: DraftContent): SceneData[] {
    return nextDraft.scenes.map((scene) => ({
      index: scene.index,
      narration: scene.narration,
      imagePrompt: scene.imagePrompt,
      imageUrls: [null],
      audioUrl: null,
      timings: [],
    }));
  }

  async function postReview(nextDraft: DraftContent, approve: boolean): Promise<void> {
    const res = await fetch(`/api/stories/${data.id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: nextDraft.title,
        opener: nextDraft.opener,
        moral: nextDraft.moral,
        doa: nextDraft.doa,
        activity: nextDraft.activity,
        questions: nextDraft.questions,
        scenes: nextDraft.scenes,
        approve,
      }),
    });
    const json = await readApiJson(res);
    if (!res.ok) throw new Error(apiError(json, "Gagal menyimpan review cerita."));
  }

  async function saveDraft(nextDraft: DraftContent): Promise<void> {
    await postReview(nextDraft, false);
    setDraft(nextDraft);
    setContent(contentFromDraft(nextDraft));
    setScenes(scenesFromDraft(nextDraft));
    setTextApproved(false);
  }

  async function approveDraft(nextDraft: DraftContent): Promise<void> {
    await postReview(nextDraft, true);
    const nextContent = contentFromDraft(nextDraft);
    const nextScenes = scenesFromDraft(nextDraft);
    setDraft(nextDraft);
    setContent(nextContent);
    setScenes(nextScenes);
    setOpenerAudio(null);
    setTextApproved(true);
    await run({
      approved: true,
      content: nextContent,
      scenes: nextScenes,
      openerAudio: null,
    });
  }

  if (step === "error") {
    return (
      <Centered>
        <div className="text-5xl">😔</div>
        <h1 className="text-xl font-bold text-ink">Ada kendala saat membuat cerita</h1>
        <p className="max-w-xs text-sm text-ink-soft">{error}</p>
        <button
          onClick={() => {
            ranRef.current = true;
            void run();
          }}
          className="btn-primary mt-2"
        >
          Coba Lagi
        </button>
        <Link href="/create" className="btn-secondary">
          {t("wizard.back")}
        </Link>
      </Centered>
    );
  }

  if (step === "text") {
    return (
      <Loader
        title={t("generating.title")}
        subtitle={t("generating.forChild", { name: data.childName })}
        step={step}
        jobInfo={jobInfo}
        workerInfo={workerInfo}
        onKickNow={kickStoryWorkerNow}
        kickBusy={kickBusy}
        details={[
          "Biasanya teks awal muncul kurang dari 1 menit.",
          "Gambar dan audio baru dibuat setelah orang tua menyetujui teks.",
        ]}
      />
    );
  }

  if (step === "review") {
    return (
      <StoryReviewEditor
        storyId={data.id}
        childName={data.childName}
        draft={draft}
        onDraftChange={setDraft}
        onSave={saveDraft}
        onApprove={approveDraft}
        onError={(message) => {
          setError(message);
          setStep("error");
        }}
      />
    );
  }

  if (step === "assets") {
    return (
      <Loader
        title={imageTitle(progress)}
        subtitle={t("generating.drawingFor", { name: data.childName })}
        step={step}
        progress={progress}
        jobInfo={jobInfo}
        workerInfo={workerInfo}
        onKickNow={kickStoryWorkerNow}
        kickBusy={kickBusy}
        details={[
          "Ilustrasi dibuat bertahap per halaman.",
          "Halaman ini boleh ditutup; cerita tetap diproses di background.",
          "Kalau provider gambar sedang antre, sistem akan mencoba lagi otomatis.",
        ]}
      />
    );
  }

  if (step === "audio") {
    return (
      <Loader
        title={audioTitle(progress)}
        subtitle={t("generating.forChild", { name: data.childName })}
        step={step}
        progress={progress}
        jobInfo={jobInfo}
        workerInfo={workerInfo}
        onKickNow={kickStoryWorkerNow}
        kickBusy={kickBusy}
        details={[
          "Audio dibuat setelah ilustrasi siap.",
          "Cerita tetap lanjut diproses walaupun browser ditutup.",
          "Buka Koleksi Cerita nanti untuk mengecek hasil akhirnya.",
        ]}
      />
    );
  }

  return (
    <OpenerView
      storyId={data.id}
      childName={data.childName}
      title={content.title}
      opener={content.opener}
      themeLabel={content.themeLabel}
      subThemeLabel={content.subThemeLabel}
      openerAudioUrl={openerAudio}
      sceneCount={scenes.length}
      initialShareToken={data.shareToken}
    />
  );
}

function StoryReviewEditor({
  storyId,
  childName,
  draft,
  onDraftChange,
  onSave,
  onApprove,
  onError,
}: {
  storyId: string;
  childName: string;
  draft: DraftContent;
  onDraftChange: (draft: DraftContent) => void;
  onSave: (draft: DraftContent) => Promise<void>;
  onApprove: (draft: DraftContent) => Promise<void>;
  onError: (message: string) => void;
}) {
  const [busy, setBusy] = useState<"save" | "approve" | string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  function update(patch: Partial<DraftContent>) {
    onDraftChange({ ...draft, ...patch });
    setNote(null);
  }

  function updateDoa(key: keyof DraftContent["doa"], value: string) {
    update({ doa: { ...draft.doa, [key]: value } });
  }

  function updateQuestion(index: number, value: string) {
    const questions = [...draft.questions];
    questions[index] = value;
    update({ questions });
  }

  function updateScene(index: number, patch: Partial<DraftScene>) {
    update({
      scenes: draft.scenes.map((scene) =>
        scene.index === index ? { ...scene, ...patch } : scene
      ),
    });
  }

  function validateDraft(): string | null {
    if (!draft.title.trim()) return "Judul cerita wajib diisi.";
    if (!draft.opener.trim()) return "Pembuka cerita wajib diisi.";
    if (draft.scenes.length === 0) return "Cerita belum memiliki adegan.";
    if (draft.scenes.some((scene) => !scene.narration.trim())) {
      return "Semua adegan harus punya narasi.";
    }
    return null;
  }

  async function runAction(action: "save" | "approve") {
    const validation = validateDraft();
    if (validation) {
      setNote(validation);
      return;
    }

    setBusy(action);
    setNote(null);
    try {
      if (action === "save") {
        await onSave(draft);
        setNote("Draft tersimpan.");
      } else {
        await onApprove(draft);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "Gagal menyimpan review cerita.");
    } finally {
      setBusy(null);
    }
  }

  async function rewriteScene(index: number, mode: "regenerate" | "funnier" | "more-islamic") {
    const scene = draft.scenes.find((item) => item.index === index);
    if (!scene) return;

    const busyId = `${mode}-${index}`;
    setBusy(busyId);
    setNote(null);
    try {
      const res = await fetch(`/api/stories/${storyId}/rewrite-scene`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, mode, narration: scene.narration }),
      });
      const json = await readApiJson(res);
      if (!res.ok) throw new Error(apiError(json, "Gagal menulis ulang adegan."));
      updateScene(index, {
        narration: textValue(json.narration),
        imagePrompt: textValue(json.imagePrompt),
      });
      setNote("Adegan diperbarui. Review dulu sebelum lanjut membuat gambar.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Gagal menulis ulang adegan.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-6">
      <div className="mb-5 rounded-card bg-brand-primary/5 p-4 ring-1 ring-brand-primary/10">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-primary">
          Review Cerita
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">
          Edit dulu sebelum gambar & audio dibuat
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          Cerita untuk {childName} masih berupa teks. Simpan perubahan, regenerate adegan,
          lalu setujui untuk mulai membuat ilustrasi dan narasi audio.
        </p>
      </div>

      {note && (
        <p className="mb-4 rounded-card bg-surface-soft px-4 py-3 text-sm font-semibold text-ink-soft">
          {note}
        </p>
      )}

      <div className="space-y-4">
        <TextField
          label="Judul"
          value={draft.title}
          onChange={(value) => update({ title: value })}
        />
        <AreaField
          label="Pembuka"
          rows={4}
          value={draft.opener}
          onChange={(value) => update({ opener: value })}
        />

        <section>
          <h2 className="mb-2 text-base font-extrabold text-ink">Adegan Cerita</h2>
          <div className="space-y-3">
            {draft.scenes.map((scene) => (
              <div key={scene.index} className="card p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-brand-primary">
                    Adegan {scene.index + 1}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <RewriteButton
                      label="Regenerate"
                      busy={busy === `regenerate-${scene.index}`}
                      onClick={() => rewriteScene(scene.index, "regenerate")}
                    />
                    <RewriteButton
                      label="Lebih lucu"
                      busy={busy === `funnier-${scene.index}`}
                      onClick={() => rewriteScene(scene.index, "funnier")}
                    />
                    <RewriteButton
                      label="Lebih Islami"
                      busy={busy === `more-islamic-${scene.index}`}
                      onClick={() => rewriteScene(scene.index, "more-islamic")}
                    />
                  </div>
                </div>
                <AreaField
                  label="Narasi"
                  rows={5}
                  value={scene.narration}
                  onChange={(value) => updateScene(scene.index, { narration: value })}
                />
              </div>
            ))}
          </div>
        </section>

        <AreaField
          label="Pesan Moral"
          rows={3}
          value={draft.moral}
          onChange={(value) => update({ moral: value })}
        />

        <section className="card p-4">
          <h2 className="mb-3 text-base font-extrabold text-ink">Doa</h2>
          <div className="space-y-3">
            <AreaField
              label="Arab"
              rows={3}
              value={draft.doa.arabic}
              onChange={(value) => updateDoa("arabic", value)}
            />
            <TextField
              label="Latin"
              value={draft.doa.latin}
              onChange={(value) => updateDoa("latin", value)}
            />
            <AreaField
              label="Terjemahan"
              rows={2}
              value={draft.doa.translation}
              onChange={(value) => updateDoa("translation", value)}
            />
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-3 text-base font-extrabold text-ink">Panduan Orang Tua</h2>
          <AreaField
            label="Aktivitas"
            rows={3}
            value={draft.activity}
            onChange={(value) => update({ activity: value })}
          />
          <div className="mt-3 space-y-2">
            {[0, 1, 2].map((index) => (
              <TextField
                key={index}
                label={`Pertanyaan ${index + 1}`}
                value={draft.questions[index] ?? ""}
                onChange={(value) => updateQuestion(index, value)}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 -mx-5 mt-5 border-t border-black/[0.06] bg-surface/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-3">
          <button
            type="button"
            onClick={() => void runAction("save")}
            disabled={busy !== null}
            className="btn-secondary flex-1"
          >
            {busy === "save" ? "Menyimpan..." : "Simpan Draft"}
          </button>
          <button
            type="button"
            onClick={() => void runAction("approve")}
            disabled={busy !== null}
            className="btn-primary flex-1"
          >
            {busy === "approve" ? "Memproses..." : "Setujui & Buat Gambar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RewriteButton({
  label,
  busy,
  onClick,
}: {
  label: string;
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="rounded-full bg-surface-soft px-3 py-1.5 text-xs font-bold text-ink-soft transition hover:bg-brand-primary/10 hover:text-brand-primary active:scale-95 disabled:opacity-60"
    >
      {busy ? "..." : label}
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="field-input" />
    </label>
  );
}

function AreaField({
  label,
  value,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="field-input resize-y leading-relaxed"
      />
    </label>
  );
}

function Loader({
  title,
  subtitle,
  step,
  progress,
  jobInfo,
  workerInfo,
  onKickNow,
  kickBusy = false,
  details = [],
}: {
  title: string;
  subtitle?: string;
  step: Step;
  progress?: { done: number; total: number };
  jobInfo?: JobInfo | null;
  workerInfo?: WorkerInfo | null;
  onKickNow?: () => void;
  kickBusy?: boolean;
  details?: string[];
}) {
  const facts = tArray("funFacts");
  const [factIdx, setFactIdx] = useState(0);
  useEffect(() => {
    if (facts.length < 2) return;
    const iv = setInterval(() => setFactIdx((i) => (i + 1) % facts.length), 3500);
    return () => clearInterval(iv);
  }, [facts.length]);

  const pct = progress && progress.total > 0 ? (progress.done / progress.total) * 100 : null;
  const statusText = jobInfo ? jobStatusLabel(jobInfo) : null;
  const staleQueue = queuedTooLong(jobInfo ?? null);
  const workerWarning = workerQueueWarning(workerInfo ?? null, staleQueue);

  return (
    <Centered>
      <div className="float mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-card text-3xl shadow-sm ring-1 ring-black/[0.04]">
        {brand.logoEmoji}
      </div>
      <h1 className="anim-fade-up max-w-sm text-xl font-extrabold text-ink">{title}</h1>
      {subtitle && <p className="max-w-xs text-sm text-ink-soft">{subtitle}</p>}

      <GenerationMilestones step={step} />

      <div className="my-3 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-primary"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {pct !== null && (
        <div className="w-full max-w-xs">
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-ink-faint">
            <span>Progress</span>
            <span>
              {progress?.done ?? 0}/{progress?.total ?? 0}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-soft">
            <div
              className="relative h-full overflow-hidden rounded-full bg-brand-primary transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
            >
              <span className="shimmer absolute inset-0 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {(statusText || details.length > 0 || jobInfo?.lastError) && (
        <div className="card w-full max-w-xs px-4 py-3 text-left">
          {statusText && (
            <p className="text-xs font-extrabold uppercase tracking-wide text-brand-primary">
              {statusText}
            </p>
          )}
          {details.length > 0 && (
            <ul className="mt-2 space-y-1.5 text-xs font-semibold leading-relaxed text-ink-soft">
              {details.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          )}
          {jobInfo?.lastError && (
            <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
              Percobaan terakhir: {jobInfo.lastError}
            </p>
          )}
          {workerWarning && (
            <div className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold leading-relaxed text-red-700">
              <p>{workerWarning}</p>
              {onKickNow && (
                <button
                  type="button"
                  onClick={onKickNow}
                  disabled={kickBusy}
                  className="mt-2 rounded-xl bg-white px-3 py-2 text-[11px] font-extrabold text-red-700 ring-1 ring-red-100 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {kickBusy ? "Mengecek worker..." : "Cek worker sekarang"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="card anim-fade-in w-full max-w-xs px-4 py-3 text-center">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-primary">
          {t("generating.didYouKnow")}
        </p>
        <p className="mt-1 text-sm italic text-ink-soft">&ldquo;{facts[factIdx] ?? ""}&rdquo;</p>
      </div>
    </Centered>
  );
}

function GenerationMilestones({ step }: { step: Step }) {
  const items: { step: Step; label: string }[] = [
    { step: "text", label: "Teks" },
    { step: "review", label: "Review" },
    { step: "assets", label: "Gambar" },
    { step: "audio", label: "Audio" },
    { step: "ready", label: "Siap" },
  ];
  const activeIndex = Math.max(0, items.findIndex((item) => item.step === step));

  return (
    <div className="mt-3 grid w-full max-w-sm grid-cols-5 gap-1.5">
      {items.map((item, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <div
            key={item.step}
            className={`rounded-2xl px-2 py-2 text-center text-[10px] font-extrabold ring-1 ${
              active
                ? "bg-brand-primary text-white ring-brand-primary"
                : done
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                  : "bg-surface-card text-ink-faint ring-black/[0.05]"
            }`}
          >
            <span className="block text-xs">{done ? "✓" : active ? "•" : "…"}</span>
            <span className="block truncate">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function jobStatusLabel(job: JobInfo): string {
  const phase =
    job.phase === "text" ? "teks" : job.phase === "assets" ? "ilustrasi" : "audio";
  const attempt =
    job.maxAttempts > 0 ? ` · percobaan ${job.attempts}/${job.maxAttempts}` : "";
  if (job.status === "queued") return `Antrean ${phase}${attempt}`;
  if (job.status === "running") return `Sedang memproses ${phase}${attempt}`;
  if (job.status === "waiting_review") return "Menunggu review orang tua";
  if (job.status === "failed") return `Gagal memproses ${phase}`;
  return `Selesai memproses ${phase}`;
}

function queuedTooLong(job: JobInfo | null): boolean {
  if (!job || job.status !== "queued" || job.attempts > 0) return false;
  // A job can return to queued with attempts reset to 0 after each successful
  // image/audio step. Use its latest update time, not its original creation time,
  // so an actively progressing story is never mislabelled as "never picked up".
  const activityAt = job.updatedAt ?? job.createdAt;
  if (!activityAt) return false;
  const activityMs = Date.parse(activityAt);
  if (!Number.isFinite(activityMs)) return false;
  return Date.now() - activityMs > 90_000;
}

function workerQueueWarning(worker: WorkerInfo | null, staleQueue: boolean): string | null {
  if (!worker) return staleQueue ? "Antrean belum diambil server. Coba buka Koleksi Cerita lagi sebentar lagi." : null;
  if (!worker.configured) {
    return "Worker background belum dikonfigurasi. Admin perlu mengisi STORY_WORKER_SECRET di Vercel lalu redeploy.";
  }
  if (!worker.autokick && !worker.cronConfigured) {
    return "Worker otomatis sedang dimatikan dan cron belum dikonfigurasi. Admin perlu mengaktifkan autokick atau cron worker.";
  }
  if (worker.lastKick?.attempted && !worker.lastKick.ok) {
    const status = worker.lastKick.status ? ` HTTP ${worker.lastKick.status}` : "";
    const error = worker.lastKick.error ? `: ${worker.lastKick.error}` : ".";
    return `Autokick worker gagal${status}${error}`;
  }
  if (worker.lastKick && !worker.lastKick.attempted && worker.lastKick.error && staleQueue) {
    return `Autokick worker tidak berjalan: ${worker.lastKick.error}`;
  }
  if (staleQueue) {
    if (worker.lastKick?.ok) {
      return "Worker sudah dipanggil, tetapi antrean belum berubah status. Cek log /api/jobs/process di Vercel untuk melihat error provider AI atau database.";
    }
    return "Antrean belum diambil server. Cerita tetap tersimpan, tetapi admin perlu mengecek worker background atau cron.";
  }
  return null;
}

function OpenerView({
  storyId,
  childName,
  title,
  opener,
  themeLabel,
  subThemeLabel,
  openerAudioUrl,
  sceneCount,
  initialShareToken,
}: {
  storyId: string;
  childName: string;
  title: string | null;
  opener: string | null;
  themeLabel: string | null;
  subThemeLabel: string | null;
  openerAudioUrl: string | null;
  sceneCount: number;
  initialShareToken: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initial = (childName?.[0] ?? "🙂").toUpperCase();

  function toggleOpenerAudio() {
    if (!openerAudioUrl) return;
    if (!audioRef.current) audioRef.current = new Audio();
    const el = audioRef.current;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    el.src = openerAudioUrl;
    el.onended = () => setPlaying(false);
    void el.play();
    setPlaying(true);
  }

  return (
    <div className="anim-fade-in mx-auto w-full max-w-md px-5 py-8">
      <div className="anim-fade-up rounded-card bg-gradient-to-b from-brand-primary/10 to-transparent p-6 text-center">
        <p className="anim-fade-up d1 text-xs font-semibold uppercase tracking-wide text-brand-primary">
          {t("story.opener")} · {sceneCount} adegan
        </p>
        <h1 className="anim-fade-up d2 mt-2 text-2xl font-extrabold text-ink">
          {title ?? "Cerita untuk " + childName}
        </h1>

        <div className="anim-pop breathe mx-auto my-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary text-3xl font-extrabold text-white ring-4 ring-brand-accent/50">
          {initial}
        </div>

        {(themeLabel || subThemeLabel) && (
          <p className="mb-3 inline-block rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-ink-soft">
            {themeLabel}
            {subThemeLabel ? ` · ${subThemeLabel}` : ""}
          </p>
        )}

        {opener && <p className="text-left text-sm leading-relaxed text-ink-soft">{opener}</p>}

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={toggleOpenerAudio}
            disabled={!openerAudioUrl}
            className="btn-secondary w-full disabled:opacity-60"
          >
            {playing ? "⏸ Jeda" : `🔊 ${t("story.listenOpener")}`}
          </button>
          <Link href={`/story/${storyId}/read`} className="btn-primary pulse-glow w-full">
            {t("story.startStory")}
          </Link>
          <Link href={`/story/${storyId}/export`} className="btn-secondary w-full">
            Export PDF
          </Link>
          <a href={`/api/stories/${storyId}/download`} className="btn-secondary w-full">
            Download Paket ZIP
          </a>
          <PrivateShareButton storyId={storyId} initialToken={initialShareToken} />
        </div>
      </div>
    </div>
  );
}

function PrivateShareButton({
  storyId,
  initialToken,
}: {
  storyId: string;
  initialToken: string | null;
}) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (initialToken) setShareUrl(`${window.location.origin}/share/${initialToken}`);
  }, [initialToken]);

  async function createLink() {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch(`/api/stories/${storyId}/share`, { method: "POST" });
      const json = await readApiJson(res);
      if (!res.ok) throw new Error(apiError(json, "Gagal membuat link privat."));
      const url = optionalText(json.url);
      setShareUrl(url);
      if (url && navigator.clipboard) {
        await navigator.clipboard.writeText(url).catch(() => {});
        setNote("Link privat disalin.");
      } else {
        setNote("Link privat siap dibagikan.");
      }
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Gagal membuat link privat.");
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    await navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setNote("Link privat disalin.");
  }

  async function disableLink() {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch(`/api/stories/${storyId}/share`, { method: "DELETE" });
      const json = await readApiJson(res);
      if (!res.ok) throw new Error(apiError(json, "Gagal mematikan link privat."));
      setShareUrl(null);
      setNote("Link privat dimatikan.");
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Gagal mematikan link privat.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-card bg-surface-card p-3 text-left ring-1 ring-black/[0.05]">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={shareUrl ? copyLink : createLink}
          disabled={busy}
          className="btn-secondary min-w-0 flex-1 px-4 py-2.5 text-sm"
        >
          {busy ? "Menyiapkan..." : shareUrl ? "Salin Link Privat" : "Bagikan Link Privat"}
        </button>
        {shareUrl && (
          <button
            type="button"
            onClick={disableLink}
            disabled={busy}
            className="rounded-full bg-red-50 px-3 text-xs font-bold text-red-600 transition active:scale-95 disabled:opacity-60"
          >
            Matikan
          </button>
        )}
      </div>
      {shareUrl && (
        <p className="mt-2 truncate rounded-lg bg-surface-soft px-2 py-1 text-[11px] text-ink-faint">
          {shareUrl}
        </p>
      )}
      {note && <p className="mt-2 text-[11px] font-semibold text-ink-faint">{note}</p>}
    </div>
  );
}

/** Fills the space under the app header (avoids nesting a second <main>). */
function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      {children}
    </div>
  );
}
