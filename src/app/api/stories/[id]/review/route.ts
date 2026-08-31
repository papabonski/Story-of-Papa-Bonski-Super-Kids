import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateUserId } from "@/lib/supabase/auth";
import { visualPromptFromNarration } from "@/lib/ai/story";
import { enqueueStoryJob } from "@/lib/jobs/story-queue";
import { STORY_WORKER_HEADER } from "@/lib/jobs/worker-auth";
import type { StoryRow } from "@/lib/database.types";

export const runtime = "nodejs";
export const maxDuration = 60;

type ReviewScene = {
  index?: unknown;
  narration?: unknown;
  imagePrompt?: unknown;
};

type WorkerKickResult = {
  attempted: boolean;
  ok: boolean;
  status?: number;
  error?: string;
};

function cleanText(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function cleanQuestions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, 6);
}

async function kickStoryWorker(req: Request): Promise<WorkerKickResult> {
  const secret = process.env.STORY_WORKER_SECRET;
  if (!secret) {
    return {
      attempted: false,
      ok: false,
      error: "STORY_WORKER_SECRET belum dikonfigurasi.",
    };
  }
  if (process.env.STORY_WORKER_AUTOKICK === "false") {
    return {
      attempted: false,
      ok: false,
      error: "STORY_WORKER_AUTOKICK=false.",
    };
  }

  try {
    // Process one job immediately. Keeping the limit at one makes the approval
    // request predictable while the normal queue polling can continue the rest.
    const res = await fetch(new URL("/api/jobs/process", req.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [STORY_WORKER_HEADER]: secret,
      },
      body: JSON.stringify({ limit: 1, workerId: "review-autokick" }),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    const error = typeof json.error === "string" ? json.error : res.ok ? undefined : res.statusText;
    return { attempted: true, ok: res.ok, status: res.status, error };
  } catch (error) {
    return {
      attempted: true,
      ok: false,
      error: error instanceof Error ? error.message : "Worker autokick gagal.",
    };
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    title?: unknown;
    opener?: unknown;
    moral?: unknown;
    doa?: { arabic?: unknown; latin?: unknown; translation?: unknown };
    activity?: unknown;
    questions?: unknown;
    scenes?: ReviewScene[];
    approve?: unknown;
  };

  const supabase = await createSupabaseServerClient();
  const userId = await getOrCreateUserId();

  const { data: story } = await supabase
    .from("stories")
    .select("id, user_id, character_snapshot, opener_text")
    .eq("id", id)
    .maybeSingle();
  if (!story) return NextResponse.json({ error: "Cerita tidak ditemukan." }, { status: 404 });
  if (story.user_id !== userId)
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  const title = cleanText(body.title);
  if (!title) return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });

  const opener = cleanText(body.opener);
  const moral = cleanText(body.moral);
  const doa = body.doa ?? {};
  const questions = cleanQuestions(body.questions);
  const approve = body.approve === true;
  const approvedAt = approve ? new Date().toISOString() : null;
  const storyUpdate: Partial<StoryRow> = {
    title,
    opener_text: opener,
    moral_text: moral,
    doa_arabic: cleanText(doa.arabic),
    doa_latin: cleanText(doa.latin),
    doa_translation: cleanText(doa.translation),
    parent_activity: cleanText(body.activity),
    parent_questions: questions,
    text_approved_at: approvedAt,
    status: approve ? "generating_assets" : "generating_text",
    error_message: null,
  };
  if (opener !== story.opener_text) {
    storyUpdate.opener_audio_path = null;
    storyUpdate.opener_word_timings = [];
  }

  const { error: storyErr } = await supabase
    .from("stories")
    .update(storyUpdate)
    .eq("id", id);
  if (storyErr) return NextResponse.json({ error: storyErr.message }, { status: 500 });

  const scenes = Array.isArray(body.scenes) ? body.scenes : [];
  for (const scene of scenes) {
    const index = Number(scene.index);
    const narration = cleanText(scene.narration);
    if (!Number.isInteger(index) || index < 0 || !narration) continue;
    const imagePrompt =
      cleanText(scene.imagePrompt) ?? visualPromptFromNarration(narration, story.character_snapshot);

    const { error: sceneErr } = await supabase
      .from("scenes")
      .update({
        narration_text: narration,
        image_prompt: imagePrompt,
        image_prompts: [imagePrompt],
        image_path: null,
        image_paths: [],
        audio_path: null,
        word_timings: [],
        status: "pending",
      })
      .eq("story_id", id)
      .eq("index", index);
    if (sceneErr) return NextResponse.json({ error: sceneErr.message }, { status: 500 });
  }

  let workerKick: WorkerKickResult | null = null;
  if (approve) {
    try {
      await enqueueStoryJob(supabase, {
        storyId: id,
        userId,
        phase: "assets",
        metadata: { source: "story_review" },
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Gagal membuat job cerita." },
        { status: 500 }
      );
    }

    // Start processing from the approval request itself. The job remains safely
    // queued even if this kick fails, so a transient worker issue never loses it.
    workerKick = await kickStoryWorker(req);
  }

  return NextResponse.json({
    ok: true,
    approved: approve,
    textApprovedAt: approvedAt,
    workerKick,
  });
}
