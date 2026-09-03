import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { storyAssetPublicUrl } from "@/lib/storage";
import { sceneImagePaths } from "@/lib/scene";
import StoryView, { type StoryViewData } from "@/components/story/StoryView";
import AppHeader from "@/components/ui/AppHeader";
import { t } from "@/lib/i18n";

function LoadError() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="text-5xl">📖</div>
      <h1 className="text-xl font-extrabold text-ink">Cerita belum bisa dibuka</h1>
      <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
        Maaf, cerita belum berhasil dimuat. Silakan coba lagi beberapa saat.
      </p>
      <Link href="/collection" className="btn-primary mt-2">
        Kembali ke Koleksi
      </Link>
    </main>
  );
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let data: StoryViewData;
  let storyTitle: string | null;

  try {
    // Any of these can THROW rather than return an error: a missing/malformed
    // NEXT_PUBLIC_SUPABASE_URL makes createSupabaseServerClient throw, and a bad
    // storage URL makes storyAssetPublicUrl throw. Catch it all and show why.
    const supabase = await createSupabaseServerClient();
    const { data: story, error: storyErr } = await supabase
      .from("stories")
      .select(
        "id, status, title, opener_text, text_approved_at, theme_label, subtheme_label, error_message, share_token, child_id, moral_text, doa_arabic, doa_latin, doa_translation, parent_activity, parent_questions, opener_audio_path, opener_word_timings"
      )
      .eq("id", id)
      .maybeSingle();

    if (storyErr) return <LoadError />;
    if (!story) notFound();

    const [{ data: child, error: childErr }, { data: scenes, error: scenesErr }] =
      await Promise.all([
        supabase.from("children").select("name").eq("id", story.child_id).maybeSingle(),
        supabase
          .from("scenes")
          .select(
            "index, narration_text, image_prompt, image_prompts, image_path, image_paths, audio_path, word_timings"
          )
          .eq("story_id", id)
          .order("index", { ascending: true }),
      ]);
    if (childErr) return <LoadError />;
    if (scenesErr) return <LoadError />;

    storyTitle = story.title;
    data = {
      id: story.id,
      status: story.status,
      childName: child?.name ?? "si kecil",
      title: story.title,
      opener: story.opener_text,
      textApprovedAt: story.text_approved_at,
      themeLabel: story.theme_label,
      subThemeLabel: story.subtheme_label,
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
      errorMessage: story.error_message,
      shareToken: story.share_token,
      openerAudioUrl: story.opener_audio_path
        ? storyAssetPublicUrl(story.opener_audio_path)
        : null,
      openerTimings: story.opener_word_timings ?? [],
      scenes: (scenes ?? []).map((s) => ({
        index: s.index,
        narration: s.narration_text,
        imagePrompt: s.image_prompt ?? null,
        imageUrls: sceneImagePaths(s).map((p) => (p ? storyAssetPublicUrl(p) : null)),
        audioUrl: s.audio_path ? storyAssetPublicUrl(s.audio_path) : null,
        timings: s.word_timings ?? [],
      })),
    };
  } catch (e) {
    // notFound() throws a special error we must let propagate to the 404 page.
    if (e && typeof e === "object" && "digest" in e && String((e as { digest?: unknown }).digest).startsWith("NEXT_NOT_FOUND")) {
      throw e;
    }
    return <LoadError />;
  }

  return (
    <main className="flex min-h-[100dvh] flex-col bg-surface">
      <AppHeader backHref="/app" title={storyTitle ?? t("header.storyTitle")} />
      <div className="flex flex-1 flex-col">
        <StoryView data={data} />
      </div>
    </main>
  );
}
