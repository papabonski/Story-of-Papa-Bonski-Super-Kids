import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireStoryWorker, STORY_WORKER_HEADER } from "@/lib/jobs/worker-auth";
import { sceneImagePaths } from "@/lib/scene";
import type { Database, StoryJobRow } from "@/lib/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 300;

type AdminClient = SupabaseClient<Database>;

type WorkerResult = {
  processed: number;
  completed: number;
  waiting: number;
  failed: number;
  messages: string[];
};

function retryDelayMs(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function availableAt(delayMs: number): string {
  return new Date(Date.now() + Math.max(0, delayMs)).toISOString();
}

async function claimNextJob(admin: AdminClient, workerId: string): Promise<StoryJobRow | null> {
  const { data: jobs, error } = await admin
    .from("story_jobs")
    .select("*")
    .eq("status", "queued")
    .lte("available_at", new Date().toISOString())
    .order("attempts", { ascending: true })
    .order("available_at", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(5);
  if (error) throw new Error(error.message);

  for (const job of jobs ?? []) {
    const { data: claimed, error: claimError } = await admin
      .from("story_jobs")
      .update({
        status: "running",
        locked_at: new Date().toISOString(),
        locked_by: workerId,
        attempts: job.attempts + 1,
      })
      .eq("id", job.id)
      .eq("status", "queued")
      .select("*")
      .maybeSingle();
    if (claimError) throw new Error(claimError.message);
    if (claimed) return claimed;
  }

  return null;
}

async function callStoryEndpoint(
  req: Request,
  path: string,
  body?: Record<string, unknown>
): Promise<{ retryAfterMs?: number }> {
  const secret = process.env.STORY_WORKER_SECRET;
  if (!secret) throw new Error("STORY_WORKER_SECRET belum dikonfigurasi.");

  const res = await fetch(new URL(path, req.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [STORY_WORKER_HEADER]: secret,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (res.status === 202 && json.retry === true) {
    return { retryAfterMs: retryDelayMs(json.retryAfterMs, 10_000) };
  }

  if (!res.ok) {
    const message = typeof json.error === "string" ? json.error : res.statusText;
    throw new Error(message || "Worker gagal memproses endpoint cerita.");
  }

  return {};
}

async function markQueued(
  admin: AdminClient,
  job: StoryJobRow,
  opts: { phase?: StoryJobRow["phase"]; delayMs?: number; resetAttempts?: boolean; lastError?: string | null } = {}
) {
  const { error } = await admin
    .from("story_jobs")
    .update({
      phase: opts.phase ?? job.phase,
      status: "queued",
      attempts: opts.resetAttempts ? 0 : job.attempts,
      available_at: availableAt(opts.delayMs ?? 0),
      locked_at: null,
      locked_by: null,
      last_error: opts.lastError ?? null,
    })
    .eq("id", job.id);
  if (error) throw new Error(error.message);
}

async function markWaitingReview(admin: AdminClient, job: StoryJobRow) {
  const { error } = await admin
    .from("story_jobs")
    .update({
      status: "waiting_review",
      attempts: 0,
      locked_at: null,
      locked_by: null,
      last_error: null,
    })
    .eq("id", job.id);
  if (error) throw new Error(error.message);
}

async function markCompleted(admin: AdminClient, job: StoryJobRow) {
  const { error } = await admin
    .from("story_jobs")
    .update({
      status: "completed",
      attempts: 0,
      locked_at: null,
      locked_by: null,
      last_error: null,
    })
    .eq("id", job.id);
  if (error) throw new Error(error.message);
}

async function markFailed(admin: AdminClient, job: StoryJobRow, message: string) {
  await admin.from("stories").update({ status: "error", error_message: message }).eq("id", job.story_id);
  const { error } = await admin
    .from("story_jobs")
    .update({
      status: "failed",
      locked_at: null,
      locked_by: null,
      last_error: message,
    })
    .eq("id", job.id);
  if (error) throw new Error(error.message);
}

function sceneNeedsImage(scene: { image_path: string | null; image_paths: (string | null)[] }): boolean {
  const [path] = sceneImagePaths(scene);
  return !path;
}

async function processTextJob(req: Request, admin: AdminClient, job: StoryJobRow) {
  await callStoryEndpoint(req, `/api/stories/${job.story_id}/generate-text`);
  await markWaitingReview(admin, job);
}

async function processAssetsJob(req: Request, admin: AdminClient, job: StoryJobRow) {
  const { data: story, error: storyError } = await admin
    .from("stories")
    .select("text_approved_at")
    .eq("id", job.story_id)
    .maybeSingle();
  if (storyError) throw new Error(storyError.message);
  if (!story?.text_approved_at) {
    await markWaitingReview(admin, job);
    return;
  }

  const { data: scenes, error } = await admin
    .from("scenes")
    .select("index, image_path, image_paths")
    .eq("story_id", job.story_id)
    .order("index", { ascending: true });
  if (error) throw new Error(error.message);

  const nextScene = (scenes ?? []).find(sceneNeedsImage);
  if (nextScene) {
    const result = await callStoryEndpoint(req, `/api/stories/${job.story_id}/generate-asset`, {
      index: nextScene.index,
      allowFallback: job.attempts >= job.max_attempts,
    });
    await markQueued(admin, job, {
      phase: "assets",
      delayMs: result.retryAfterMs ?? 0,
      resetAttempts: !result.retryAfterMs,
      lastError: result.retryAfterMs ? "Ilustrasi masih antre karena limit sementara." : null,
    });
    return;
  }

  await markQueued(admin, job, { phase: "audio", resetAttempts: true });
}

async function processAudioJob(req: Request, admin: AdminClient, job: StoryJobRow) {
  const { data: story, error: storyError } = await admin
    .from("stories")
    .select("opener_text, opener_audio_path")
    .eq("id", job.story_id)
    .maybeSingle();
  if (storyError) throw new Error(storyError.message);
  if (!story) throw new Error("Cerita tidak ditemukan.");

  if (story.opener_text && !story.opener_audio_path) {
    const result = await callStoryEndpoint(req, `/api/stories/${job.story_id}/generate-audio`, {
      kind: "opener",
    });
    await markQueued(admin, job, {
      phase: "audio",
      delayMs: result.retryAfterMs ?? 0,
      resetAttempts: !result.retryAfterMs,
      lastError: result.retryAfterMs ? "Audio pembuka masih antre karena limit sementara." : null,
    });
    return;
  }

  const { data: scenes, error } = await admin
    .from("scenes")
    .select("index, audio_path")
    .eq("story_id", job.story_id)
    .order("index", { ascending: true });
  if (error) throw new Error(error.message);

  const nextScene = (scenes ?? []).find((scene) => !scene.audio_path);
  if (nextScene) {
    const result = await callStoryEndpoint(req, `/api/stories/${job.story_id}/generate-audio`, {
      kind: "scene",
      index: nextScene.index,
    });
    await markQueued(admin, job, {
      phase: "audio",
      delayMs: result.retryAfterMs ?? 0,
      resetAttempts: !result.retryAfterMs,
      lastError: result.retryAfterMs ? "Audio adegan masih antre karena limit sementara." : null,
    });
    return;
  }

  await admin.from("stories").update({ status: "ready", error_message: null }).eq("id", job.story_id);
  await markCompleted(admin, job);
}

async function processJob(req: Request, admin: AdminClient, job: StoryJobRow): Promise<StoryJobRow["status"]> {
  try {
    if (job.phase === "text") await processTextJob(req, admin, job);
    else if (job.phase === "assets") await processAssetsJob(req, admin, job);
    else await processAudioJob(req, admin, job);
    return "completed";
  } catch (error) {
    const message = error instanceof Error ? error.message : "Worker gagal memproses job.";
    if (job.attempts >= job.max_attempts) {
      await markFailed(admin, job, message);
      return "failed";
    }
    await markQueued(admin, job, {
      delayMs: Math.min(60_000, 5_000 * Math.max(1, job.attempts)),
      lastError: message,
    });
    return "queued";
  }
}

export async function POST(req: Request) {
  const unauthorized = requireStoryWorker(req);
  if (unauthorized) return unauthorized;

  const body = (await req.json().catch(() => ({}))) as { limit?: number; workerId?: string };
  const limit = Math.min(20, Math.max(1, Number(body.limit) || 5));
  const workerId = body.workerId || `worker-${Date.now()}`;
  const admin = createSupabaseAdminClient() as AdminClient;
  const result: WorkerResult = { processed: 0, completed: 0, waiting: 0, failed: 0, messages: [] };

  for (let i = 0; i < limit; i++) {
    const job = await claimNextJob(admin, workerId);
    if (!job) break;

    result.processed += 1;
    result.messages.push(`${job.story_id}:${job.phase}`);
    const status = await processJob(req, admin, job);
    if (status === "failed") result.failed += 1;
    else if (status === "waiting_review") result.waiting += 1;
    else result.completed += 1;
  }

  return NextResponse.json({ ok: true, ...result });
}
