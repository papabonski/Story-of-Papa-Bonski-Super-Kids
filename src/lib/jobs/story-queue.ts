import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, StoryJobPhase, StoryJobRow } from "@/lib/database.types";

type AppSupabase = SupabaseClient<Database>;

export async function enqueueStoryJob(
  supabase: AppSupabase,
  opts: {
    storyId: string;
    userId: string;
    phase: StoryJobPhase;
    maxAttempts?: number;
    metadata?: Record<string, unknown>;
  }
): Promise<StoryJobRow | null> {
  const { data: existingRows, error: existingError } = await supabase
    .from("story_jobs")
    .select("*")
    .eq("story_id", opts.storyId)
    .in("status", ["queued", "running", "waiting_review"])
    .order("created_at", { ascending: false })
    .limit(1);
  if (existingError) throw new Error(existingError.message);

  const existing = existingRows?.[0] ?? null;
  if (existing) {
    const shouldWake =
      existing.status === "waiting_review" ||
      phaseOrder(opts.phase) > phaseOrder(existing.phase);
    const { data, error } = await supabase
      .from("story_jobs")
      .update({
        phase: shouldWake ? opts.phase : existing.phase,
        status: shouldWake ? "queued" : existing.status,
        attempts: shouldWake ? 0 : existing.attempts,
        available_at: new Date().toISOString(),
        locked_at: null,
        locked_by: null,
        last_error: null,
        metadata: opts.metadata ?? existing.metadata ?? {},
      })
      .eq("id", existing.id)
      .select("*")
      .limit(1);
    if (error) throw new Error(error.message);
    return data?.[0] ?? null;
  }

  const { data, error } = await supabase
    .from("story_jobs")
    .insert({
      story_id: opts.storyId,
      user_id: opts.userId,
      phase: opts.phase,
      status: "queued",
      max_attempts: opts.maxAttempts ?? 6,
      metadata: opts.metadata ?? {},
    })
    .select("*");
  if (error) {
    if (error.code === "23505") {
      return enqueueStoryJob(supabase, opts);
    }
    throw new Error(error.message);
  }
  return data?.[0] ?? null;
}

function phaseOrder(phase: StoryJobPhase): number {
  if (phase === "text") return 0;
  if (phase === "assets") return 1;
  return 2;
}
