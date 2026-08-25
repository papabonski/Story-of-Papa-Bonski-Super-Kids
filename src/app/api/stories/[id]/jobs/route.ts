import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateUserId } from "@/lib/supabase/auth";
import { enqueueStoryJob } from "@/lib/jobs/story-queue";
import { STORY_WORKER_HEADER } from "@/lib/jobs/worker-auth";
import { isPlaceholderPath, sceneImagePaths } from "@/lib/scene";

export const runtime = "nodejs";

function sceneNeedsImage(scene: { image_path: string | null; image_paths: (string | null)[] }): boolean {
  const [path] = sceneImagePaths(scene);
  return !path || isPlaceholderPath(path);
}

function computeStep(opts: {
  status: string;
  title: string | null;
  textApprovedAt: string | null;
  openerText: string | null;
  openerAudioPath: string | null;
  scenes: { image_path: string | null; image_paths: (string | null)[]; audio_path: string | null }[];
}): "text" | "review" | "assets" | "audio" | "ready" | "error" {
  if (opts.status === "error") return "error";
  if (!opts.title) return "text";
  if (!opts.textApprovedAt) return "review";
  if (opts.scenes.some(sceneNeedsImage)) return "assets";
  if ((opts.openerText && !opts.openerAudioPath) || opts.scenes.some((scene) => !scene.audio_path)) {
    return "audio";
  }
  return "ready";
}

async function maybeKickWorker(req: Request): Promise<{
  attempted: boolean;
  ok: boolean;
  status?: number;
  error?: string;
}> {
  const secret = process.env.STORY_WORKER_SECRET;
  if (!secret) return { attempted: false, ok: false, error: "STORY_WORKER_SECRET belum dikonfigurasi." };
  if (process.env.STORY_WORKER_AUTOKICK === "false") {
    return { attempted: false, ok: false, error: "STORY_WORKER_AUTOKICK=false." };
  }
  const rawLimit = Number(process.env.STORY_WORKER_AUTOKICK_LIMIT);
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(20, rawLimit)) : 5;
  try {
    const res = await fetch(new URL("/api/jobs/process", req.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [STORY_WORKER_HEADER]: secret,
      },
      body: JSON.stringify({ limit, workerId: "autokick" }),
    });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    const error = typeof json.error === "string" ? json.error : res.ok ? undefined : res.statusText;
    return { attempted: true, ok: res.ok, status: res.status, error };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Worker autokick gagal.";
    console.warn("[story-jobs:autokick]", message);
    return { attempted: true, ok: false, error: message };
  }
}

async function loadJobStatus(
  id: string,
  workerKick?: {
    attempted: boolean;
    ok: boolean;
    status?: number;
    error?: string;
  }
) {
  const supabase = await createSupabaseServerClient();
  const userId = await getOrCreateUserId();

  const { data: story } = await supabase
    .from("stories")
    .select("id, user_id, status, title, text_approved_at, opener_text, opener_audio_path, error_message")
    .eq("id", id)
    .maybeSingle();
  if (!story) return { response: NextResponse.json({ error: "Cerita tidak ditemukan." }, { status: 404 }) };
  if (story.user_id !== userId) {
    return { response: NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 }) };
  }

  const [{ data: scenes, error: scenesError }, { data: jobs, error: jobsError }] = await Promise.all([
    supabase
      .from("scenes")
      .select("image_path, image_paths, audio_path")
      .eq("story_id", id)
      .order("index", { ascending: true }),
    supabase
      .from("story_jobs")
      .select("*")
      .eq("story_id", id)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);
  if (scenesError) return { response: NextResponse.json({ error: scenesError.message }, { status: 500 }) };
  if (jobsError) return { response: NextResponse.json({ error: jobsError.message }, { status: 500 }) };

  const sceneRows = scenes ?? [];
  const imageTotal = sceneRows.length;
  const imageDone = sceneRows.filter((scene) => !sceneNeedsImage(scene)).length;
  const audioTotal = sceneRows.length + (story.opener_text ? 1 : 0);
  const audioDone =
    sceneRows.filter((scene) => !!scene.audio_path).length + (story.opener_text && story.opener_audio_path ? 1 : 0);
  const step = computeStep({
    status: story.status,
    title: story.title,
    textApprovedAt: story.text_approved_at,
    openerText: story.opener_text,
    openerAudioPath: story.opener_audio_path,
    scenes: sceneRows,
  });

  return {
    story,
    payload: {
      ok: true,
      step,
      status: story.status,
      titleReady: !!story.title,
      textApproved: !!story.text_approved_at,
      error: story.error_message,
      job: jobs?.[0] ?? null,
      worker: {
        configured: Boolean(process.env.STORY_WORKER_SECRET),
        autokick: process.env.STORY_WORKER_AUTOKICK !== "false",
        cronConfigured: Boolean(process.env.CRON_SECRET),
        lastKick: workerKick ?? null,
      },
      progress:
        step === "assets"
          ? { done: imageDone, total: imageTotal }
          : step === "audio"
            ? { done: audioDone, total: audioTotal }
            : { done: step === "ready" ? 1 : 0, total: 1 },
    },
  };
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await loadJobStatus(id);
  if ("response" in result) return result.response;
  return NextResponse.json(result.payload);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await loadJobStatus(id);
  if ("response" in result) return result.response;

  const phase = !result.story.title ? "text" : result.story.text_approved_at ? "assets" : "text";
  const supabase = await createSupabaseServerClient();
  const userId = await getOrCreateUserId();
  await enqueueStoryJob(supabase, {
    storyId: id,
    userId,
    phase,
    metadata: { source: "story_jobs_api" },
  });
  const workerKick = await maybeKickWorker(req);

  const next = await loadJobStatus(id, workerKick);
  if ("response" in next) return next.response;
  return NextResponse.json(next.payload);
}
