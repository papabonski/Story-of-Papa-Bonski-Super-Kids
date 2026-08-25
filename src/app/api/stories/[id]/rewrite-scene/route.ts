import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateUserId } from "@/lib/supabase/auth";
import { rewriteStoryScene, type SceneRewriteMode } from "@/lib/ai/story";

export const runtime = "nodejs";
export const maxDuration = 60;

function rewriteMode(value: unknown): SceneRewriteMode {
  if (value === "funnier" || value === "more-islamic") return value;
  return "regenerate";
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    index?: unknown;
    mode?: unknown;
    narration?: unknown;
  };
  const index = Number(body.index);
  if (!Number.isInteger(index) || index < 0) {
    return NextResponse.json({ error: "index tidak valid." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getOrCreateUserId();

  const { data: story } = await supabase
    .from("stories")
    .select(
      "id, user_id, child_id, title, theme_label, subtheme_label, character_snapshot, language_level"
    )
    .eq("id", id)
    .maybeSingle();
  if (!story) return NextResponse.json({ error: "Cerita tidak ditemukan." }, { status: 404 });
  if (story.user_id !== userId)
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  const [{ data: child }, { data: scenes }] = await Promise.all([
    supabase.from("children").select("name, age, gender").eq("id", story.child_id).maybeSingle(),
    supabase
      .from("scenes")
      .select("id, index, narration_text")
      .eq("story_id", id)
      .order("index", { ascending: true }),
  ]);

  if (!child) return NextResponse.json({ error: "Data anak tidak ditemukan." }, { status: 404 });
  const rows = scenes ?? [];
  const current = rows.find((scene) => scene.index === index);
  if (!current) return NextResponse.json({ error: "Adegan tidak ditemukan." }, { status: 404 });

  try {
    const rewritten = await rewriteStoryScene({
      mode: rewriteMode(body.mode),
      childName: child.name,
      age: child.age,
      gender: child.gender,
      themeLabel: story.theme_label,
      subThemeLabel: story.subtheme_label,
      title: story.title,
      sceneIndex: index,
      sceneCount: rows.length,
      currentNarration:
        typeof body.narration === "string" && body.narration.trim() !== ""
          ? body.narration.trim()
          : current.narration_text ?? "",
      previousNarration: rows.find((scene) => scene.index === index - 1)?.narration_text,
      nextNarration: rows.find((scene) => scene.index === index + 1)?.narration_text,
      characterDescription: story.character_snapshot,
      languageLevel: story.language_level,
    });

    const { error: sceneErr } = await supabase
      .from("scenes")
      .update({
        narration_text: rewritten.narration,
        image_prompt: rewritten.imagePrompt,
        image_prompts: [rewritten.imagePrompt],
        image_path: null,
        image_paths: [],
        audio_path: null,
        word_timings: [],
        status: "pending",
      })
      .eq("id", current.id);
    if (sceneErr) throw new Error(sceneErr.message);

    await supabase
      .from("stories")
      .update({ text_approved_at: null, error_message: null })
      .eq("id", id);

    return NextResponse.json({ ok: true, ...rewritten });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menulis ulang adegan.";
    console.error("[rewrite-scene]", { storyId: id, index, message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
