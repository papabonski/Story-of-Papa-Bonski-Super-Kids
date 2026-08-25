import { NextResponse } from "next/server";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateUserId } from "@/lib/supabase/auth";
import {
  generateStoryScript,
  validateStoryQuality,
  fallbackCharacterDescription,
  type StoryInput,
} from "@/lib/ai/story";
import { analyzeChildPhoto } from "@/lib/ai/image";
import { BUCKET_CHILD_PHOTOS } from "@/lib/storage";
import { sceneImageCount } from "@/lib/scene";
import { isStoryWorkerRequest } from "@/lib/jobs/worker-auth";
import { getWhiteLabelSettings } from "@/lib/white-label/settings";
import { resolveSceneCount } from "../../../../../../config/themes";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * POST /api/stories/:id/generate-text
 * Generates the structured story script with Gemini and saves it:
 *   - story: title, opener, moral, doa, parent guide, status → generating_assets
 *   - scenes: one row per page (narration + image_prompt), status → pending
 * Idempotent-ish: re-running regenerates the text and replaces scenes.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const worker = isStoryWorkerRequest(req);
  const supabase = worker ? createSupabaseAdminClient() : await createSupabaseServerClient();
  const userId = worker ? null : await getOrCreateUserId();

  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!story) return NextResponse.json({ error: "Cerita tidak ditemukan." }, { status: 404 });
  if (!worker && story.user_id !== userId)
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  // Already has text — return the saved content so a retry/refresh can resume
  // without leaving the client with empty title/opener/scenes.
  if ((story.status === "generating_assets" || story.status === "ready") && story.title) {
    const { data: existingScenes } = await supabase
      .from("scenes")
      .select("index, narration_text, image_prompts, image_prompt")
      .eq("story_id", id)
      .order("index", { ascending: true });

    return NextResponse.json({
      ok: true,
      status: story.status,
      title: story.title,
      opener: story.opener_text,
      themeLabel: story.theme_label,
      subThemeLabel: story.subtheme_label,
      textApprovedAt: story.text_approved_at,
      moral: story.moral_text,
      doa: {
        arabic: story.doa_arabic,
        latin: story.doa_latin,
        translation: story.doa_translation,
      },
      parentGuide: {
        activity: story.parent_activity,
        questions: story.parent_questions ?? [],
      },
      scenes: (existingScenes ?? []).map((s) => ({
        index: s.index,
        narration: s.narration_text,
        imagePrompt: s.image_prompt,
        imageCount: sceneImageCount(s),
      })),
    });
  }

  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("id", story.child_id)
    .maybeSingle();
  if (!child) return NextResponse.json({ error: "Data anak tidak ditemukan." }, { status: 404 });

  await supabase.from("stories").update({ status: "generating_text" }).eq("id", id);

  try {
    // Derive a consistent character look. Prefer analyzing the uploaded photo
    // once (stored on the child for reuse); fall back to a described character.
    let characterDescription = child.character_description;
    if (!characterDescription && child.photo_path) {
      try {
        const { data: blob } = await supabase.storage
          .from(BUCKET_CHILD_PHOTOS)
          .download(child.photo_path);
        if (blob) {
          const base64 = Buffer.from(await blob.arrayBuffer()).toString("base64");
          characterDescription = await analyzeChildPhoto(base64, blob.type || "image/jpeg");
          await supabase
            .from("children")
            .update({ character_description: characterDescription })
            .eq("id", child.id);
        }
      } catch {
        // Photo analysis is best-effort; continue with the fallback description.
      }
    }
    if (!characterDescription) {
      characterDescription = fallbackCharacterDescription({
        name: child.name,
        age: child.age,
        gender: child.gender,
      });
    }

    const settings = await getWhiteLabelSettings();
    const resolvedSceneCount = resolveSceneCount(story.length_id ?? "auto", child.age ?? 5);
    const sceneCount =
      settings.limits.maxScenesPerStory > 0
        ? Math.min(resolvedSceneCount, settings.limits.maxScenesPerStory)
        : resolvedSceneCount;

    const storyInput: StoryInput = {
      childName: child.name,
      age: child.age,
      gender: child.gender,
      themeLabel: story.theme_label ?? story.theme_id,
      subThemeLabel: story.subtheme_label ?? story.subtheme_id,
      situation: story.situation,
      languageLevel: story.language_level ?? "auto",
      characterDescription,
      sceneCount,
    };

    let script = await generateStoryScript(storyInput);
    let quality = await validateStoryQuality(storyInput, script);
    if (!quality.passed) {
      const feedback = [...quality.issues, ...quality.suggestions]
        .map((item) => `- ${item}`)
        .join("\n");
      console.warn("[generate-text:quality-regenerate]", {
        storyId: id,
        issues: quality.issues,
      });

      script = await generateStoryScript({
        ...storyInput,
        qualityFeedback: feedback || "Perbaiki kualitas cerita sesuai checklist sebelum membuat aset.",
      });
      quality = await validateStoryQuality(storyInput, script);
      if (!quality.passed) {
        throw new Error(`Quality check cerita belum lolos: ${quality.issues.join("; ")}`);
      }
    }

    // Persist story-level content.
    const { error: updErr } = await supabase
      .from("stories")
      .update({
        title: script.title,
        opener_text: script.opener,
        moral_text: script.moral,
        doa_arabic: script.doa.arabic,
        doa_latin: script.doa.latin,
        doa_translation: script.doa.translation,
        parent_activity: script.parentGuide.activity,
        parent_questions: script.parentGuide.questions,
        character_snapshot: characterDescription,
        text_approved_at: null,
        status: "generating_assets",
        error_message: null,
      })
      .eq("id", id);
    if (updErr) throw new Error(updErr.message);

    // Replace scenes. Each page carries one image prompt; the array column is
    // kept in sync for backward compatibility.
    await supabase.from("scenes").delete().eq("story_id", id);
    const rows = script.scenes.map((s, i) => ({
      story_id: id,
      index: i,
      narration_text: s.narration,
      image_prompt: s.imagePrompts[0] ?? "",
      image_prompts: s.imagePrompts,
      image_paths: [],
      status: "pending" as const,
    }));
    const { error: sceneErr } = await supabase.from("scenes").insert(rows);
    if (sceneErr) throw new Error(sceneErr.message);

    return NextResponse.json({
      ok: true,
      status: "generating_assets",
      title: script.title,
      opener: script.opener,
      themeLabel: story.theme_label,
      subThemeLabel: story.subtheme_label,
      textApprovedAt: null,
      moral: script.moral,
      doa: script.doa,
      parentGuide: script.parentGuide,
      scenes: script.scenes.map((s, i) => ({
        index: i,
        narration: s.narration,
        imagePrompt: s.imagePrompts[0] ?? "",
        imageCount: s.imagePrompts.length,
      })),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gagal membuat cerita.";
    console.error("[generate-text]", { storyId: id, message });
    await supabase
      .from("stories")
      .update({ status: "error", error_message: message })
      .eq("id", id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
