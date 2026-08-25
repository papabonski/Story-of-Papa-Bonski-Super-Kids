import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateUserId } from "@/lib/supabase/auth";
import type { StoryRow } from "@/lib/database.types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    sceneIndex?: unknown;
    elapsedMs?: unknown;
    completed?: unknown;
  };

  const sceneIndex = Number(body.sceneIndex);
  const elapsedMs = Number(body.elapsedMs);
  const completed = body.completed === true;

  if (!Number.isInteger(sceneIndex) || sceneIndex < 0) {
    return NextResponse.json({ error: "sceneIndex tidak valid." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getOrCreateUserId();

  const { data: story, error: storyErr } = await supabase
    .from("stories")
    .select("id, user_id, total_read_ms")
    .eq("id", id)
    .maybeSingle();
  if (storyErr) return NextResponse.json({ error: storyErr.message }, { status: 500 });
  if (!story) return NextResponse.json({ error: "Cerita tidak ditemukan." }, { status: 404 });
  if (story.user_id !== userId)
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  const safeElapsed = Number.isFinite(elapsedMs) && elapsedMs > 0 ? Math.min(elapsedMs, 10 * 60_000) : 0;
  const nextTotal = Math.max(0, (story.total_read_ms ?? 0) + safeElapsed);
  const update: Partial<StoryRow> = {
    last_read_scene_index: sceneIndex,
    total_read_ms: nextTotal,
  };
  if (completed) update.completed_at = new Date().toISOString();

  const { error } = await supabase
    .from("stories")
    .update(update)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, totalReadMs: nextTotal });
}
