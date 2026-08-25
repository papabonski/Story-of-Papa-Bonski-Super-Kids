import { notFound } from "next/navigation";
import Link from "next/link";
import { brand } from "../../../../config/brand";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { storyAssetPublicUrl } from "@/lib/storage";
import { sceneImagePaths } from "@/lib/scene";

export const dynamic = "force-dynamic";

function LoadError({ message }: { message: string }) {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-surface px-6 text-center">
      <div className="text-5xl">🔒</div>
      <h1 className="text-xl font-extrabold text-ink">Link cerita belum bisa dibuka</h1>
      <p className="max-w-md rounded-card bg-surface-soft px-4 py-3 text-sm text-ink-soft">
        {message}
      </p>
    </main>
  );
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!token || token.length < 16) notFound();

  try {
    const supabase = createSupabaseAdminClient();
    const { data: story, error: storyErr } = await supabase
      .from("stories")
      .select(
        "id, title, opener_text, theme_label, subtheme_label, child_id, moral_text, doa_arabic, doa_latin, doa_translation, parent_activity, parent_questions, opener_audio_path, text_approved_at"
      )
      .eq("share_token", token)
      .maybeSingle();

    if (storyErr) return <LoadError message={storyErr.message} />;
    if (!story) notFound();
    if (!story.text_approved_at) {
      return <LoadError message="Cerita ini masih dalam tahap review dan belum dibagikan untuk dibaca." />;
    }

    const [{ data: child }, { data: scenes }] = await Promise.all([
      supabase.from("children").select("name").eq("id", story.child_id).maybeSingle(),
      supabase
        .from("scenes")
        .select("index, narration_text, image_path, image_paths, audio_path")
        .eq("story_id", story.id)
        .order("index", { ascending: true }),
    ]);

    const sceneRows = scenes ?? [];
    const parentQuestions = Array.isArray(story.parent_questions)
      ? (story.parent_questions as string[]).filter((question) => typeof question === "string")
      : [];
    const openerAudioUrl = story.opener_audio_path
      ? storyAssetPublicUrl(story.opener_audio_path)
      : null;

    return (
      <main className="min-h-[100dvh] bg-surface">
        <header className="border-b border-black/[0.05] bg-surface-card">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-lg">
              {brand.logoEmoji}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-ink">
                {story.title ?? `Cerita untuk ${child?.name ?? "si kecil"}`}
              </p>
              <p className="truncate text-xs text-ink-faint">Link privat dari {brand.name}</p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-5 py-6">
          <section className="mb-5 rounded-card bg-brand-primary/5 p-5 ring-1 ring-brand-primary/10">
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-primary">
              Cerita untuk {child?.name ?? "si kecil"}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-ink">
              {story.title ?? `Cerita untuk ${child?.name ?? "si kecil"}`}
            </h1>
            {(story.theme_label || story.subtheme_label) && (
              <p className="mt-2 text-xs font-semibold text-ink-faint">
                {story.theme_label}
                {story.subtheme_label ? ` · ${story.subtheme_label}` : ""}
              </p>
            )}
            {story.opener_text && (
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{story.opener_text}</p>
            )}
            {openerAudioUrl && (
              <audio className="mt-4 w-full" src={openerAudioUrl} controls preload="metadata" />
            )}
          </section>

          <div className="space-y-5">
            {sceneRows.map((scene) => {
              const imagePath = sceneImagePaths(scene)[0] ?? null;
              const imageUrl = imagePath ? storyAssetPublicUrl(imagePath) : null;
              const audioUrl = scene.audio_path ? storyAssetPublicUrl(scene.audio_path) : null;

              return (
                <article key={scene.index} className="card overflow-hidden">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={`Adegan ${scene.index + 1}`}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-surface-soft text-4xl">
                      📖
                    </div>
                  )}
                  <div className="p-4">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-brand-primary">
                      Adegan {scene.index + 1}
                    </p>
                    {scene.narration_text && (
                      <p className="text-base leading-relaxed text-ink">{scene.narration_text}</p>
                    )}
                    {audioUrl && (
                      <audio className="mt-4 w-full" src={audioUrl} controls preload="metadata" />
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <section className="mt-6 space-y-4">
            {story.moral_text && (
              <div className="card border-l-4 border-brand-secondary p-5">
                <h2 className="font-display text-base font-bold text-brand-secondary">
                  Pesan Moral
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{story.moral_text}</p>
              </div>
            )}

            {(story.doa_arabic || story.doa_latin || story.doa_translation) && (
              <div className="card border-l-4 border-emerald-500 bg-emerald-50/40 p-5">
                <h2 className="font-display text-base font-bold text-emerald-700">
                  Mari Berdoa
                </h2>
                {story.doa_arabic && (
                  <p dir="rtl" lang="ar" className="mt-3 text-center text-2xl leading-loose text-ink">
                    {story.doa_arabic}
                  </p>
                )}
                {story.doa_latin && (
                  <p className="mt-2 text-center text-sm font-medium italic text-emerald-800">
                    {story.doa_latin}
                  </p>
                )}
                {story.doa_translation && (
                  <p className="mt-1 text-center text-xs text-ink-soft">
                    &ldquo;{story.doa_translation}&rdquo;
                  </p>
                )}
              </div>
            )}

            {(story.parent_activity || parentQuestions.length > 0) && (
              <div className="card p-5">
                <h2 className="font-display text-base font-bold text-ink">Panduan Orang Tua</h2>
                {story.parent_activity && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {story.parent_activity}
                  </p>
                )}
                {parentQuestions.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {parentQuestions.map((question, index) => (
                      <li key={index} className="text-sm leading-relaxed text-ink-soft">
                        • {question}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>

          <div className="py-8 text-center">
            <Link href="/" className="text-sm font-bold text-brand-primary">
              Dibuat dengan {brand.name}
            </Link>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <LoadError
        message={
          error instanceof Error
            ? error.message
            : "Konfigurasi server belum lengkap untuk membuka link privat."
        }
      />
    );
  }
}
