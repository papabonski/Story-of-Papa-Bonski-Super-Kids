import { notFound } from "next/navigation";
import Link from "next/link";
import { brand } from "../../../../../config/brand";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { storyAssetPublicUrl } from "@/lib/storage";
import { sceneImagePaths } from "@/lib/scene";
import PrintButton from "@/components/story/PrintButton";

export const dynamic = "force-dynamic";

function LoadError({ message }: { message: string }) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-surface px-6 text-center">
      <div>
        <h1 className="text-xl font-extrabold text-ink">PDF belum bisa dibuat</h1>
        <p className="mt-2 max-w-md rounded-card bg-surface-soft px-4 py-3 text-sm text-ink-soft">
          {message}
        </p>
        <Link href="/collection" className="btn-primary mt-4">
          Kembali
        </Link>
      </div>
    </main>
  );
}

export default async function ExportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: story, error: storyErr } = await supabase
      .from("stories")
      .select(
        "id, title, opener_text, theme_label, subtheme_label, child_id, moral_text, doa_arabic, doa_latin, doa_translation, parent_activity, parent_questions, text_approved_at"
      )
      .eq("id", id)
      .maybeSingle();

    if (storyErr) return <LoadError message={storyErr.message} />;
    if (!story) notFound();
    if (!story.text_approved_at) {
      return <LoadError message="Cerita masih dalam tahap review. Setujui teks dulu sebelum export PDF." />;
    }

    const [{ data: child, error: childErr }, { data: scenes, error: scenesErr }] =
      await Promise.all([
        supabase.from("children").select("name").eq("id", story.child_id).maybeSingle(),
        supabase
          .from("scenes")
          .select("index, narration_text, image_path, image_paths")
          .eq("story_id", id)
          .order("index", { ascending: true }),
      ]);

    if (childErr) return <LoadError message={childErr.message} />;
    if (scenesErr) return <LoadError message={scenesErr.message} />;

    const rows = scenes ?? [];
    if (rows.length === 0) {
      return <LoadError message="Cerita belum memiliki adegan untuk diexport." />;
    }

    const firstImagePath = sceneImagePaths(rows[0])[0] ?? null;
    const coverUrl = firstImagePath ? storyAssetPublicUrl(firstImagePath) : null;
    const parentQuestions = Array.isArray(story.parent_questions)
      ? story.parent_questions.filter((item): item is string => typeof item === "string")
      : [];

    return (
      <main className="min-h-[100dvh] bg-[#f7f2ea] text-[#292524]">
        <style>{`
          @page { size: A4; margin: 14mm; }
          @media print {
            html, body { background: white !important; }
            .pdf-toolbar { display: none !important; }
            .pdf-sheet { box-shadow: none !important; margin: 0 !important; width: auto !important; min-height: auto !important; page-break-after: always; break-after: page; }
            .pdf-sheet:last-child { page-break-after: auto; break-after: auto; }
            .pdf-page { padding: 0 !important; }
          }
        `}</style>

        <div className="pdf-toolbar sticky top-0 z-40 border-b border-black/10 bg-surface/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
            <Link href={`/story/${id}`} className="text-sm font-bold text-ink-soft">
              Kembali
            </Link>
            <p className="min-w-0 truncate text-center text-sm font-extrabold text-ink">
              Export PDF Storybook
            </p>
            <PrintButton />
          </div>
        </div>

        <div className="pdf-page mx-auto max-w-[840px] px-4 py-6">
          <section className="pdf-sheet mb-6 min-h-[1120px] overflow-hidden rounded-[18px] bg-white shadow-xl ring-1 ring-black/10">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="Cover" className="h-[560px] w-full object-cover" />
            ) : (
              <div className="flex h-[560px] items-center justify-center bg-surface-soft text-6xl">
                {brand.logoEmoji}
              </div>
            )}
            <div className="p-10 text-center">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-primary">
                {brand.name}
              </p>
              <h1 className="mt-4 font-display text-5xl font-extrabold leading-tight text-ink">
                {story.title ?? `Cerita untuk ${child?.name ?? "si kecil"}`}
              </h1>
              <p className="mt-4 text-lg font-bold text-ink-soft">
                Untuk {child?.name ?? "si kecil"}
              </p>
              {(story.theme_label || story.subtheme_label) && (
                <p className="mt-3 text-sm font-semibold text-ink-faint">
                  {story.theme_label}
                  {story.subtheme_label ? ` · ${story.subtheme_label}` : ""}
                </p>
              )}
              {story.opener_text && (
                <p className="mx-auto mt-8 max-w-2xl text-left text-lg leading-relaxed text-ink-soft">
                  {story.opener_text}
                </p>
              )}
            </div>
          </section>

          {rows.map((scene) => {
            const imagePath = sceneImagePaths(scene)[0] ?? null;
            const imageUrl = imagePath ? storyAssetPublicUrl(imagePath) : null;

            return (
              <section
                key={scene.index}
                className="pdf-sheet mb-6 min-h-[1120px] overflow-hidden rounded-[18px] bg-white shadow-xl ring-1 ring-black/10"
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={`Adegan ${scene.index + 1}`}
                    className="h-[610px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[610px] items-center justify-center bg-surface-soft text-5xl">
                    Ilustrasi belum tersedia
                  </div>
                )}
                <div className="p-10">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-primary">
                    Adegan {scene.index + 1}
                  </p>
                  <p className="mt-5 text-2xl leading-relaxed text-ink">
                    {scene.narration_text}
                  </p>
                </div>
              </section>
            );
          })}

          <section className="pdf-sheet mb-6 min-h-[1120px] rounded-[18px] bg-white p-10 shadow-xl ring-1 ring-black/10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-primary">
              Penutup Cerita
            </p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-ink">
              Moral, Doa, dan Panduan
            </h2>

            {story.moral_text && (
              <div className="mt-8 border-l-4 border-brand-secondary bg-orange-50/70 p-5">
                <h3 className="font-display text-xl font-extrabold text-brand-secondary">
                  Pesan Moral
                </h3>
                <p className="mt-2 text-lg leading-relaxed text-ink-soft">{story.moral_text}</p>
              </div>
            )}

            {(story.doa_arabic || story.doa_latin || story.doa_translation) && (
              <div className="mt-6 border-l-4 border-emerald-500 bg-emerald-50/70 p-5">
                <h3 className="font-display text-xl font-extrabold text-emerald-700">
                  Mari Berdoa
                </h3>
                {story.doa_arabic && (
                  <p dir="rtl" lang="ar" className="mt-4 text-center text-4xl leading-loose text-ink">
                    {story.doa_arabic}
                  </p>
                )}
                {story.doa_latin && (
                  <p className="mt-3 text-center text-lg font-semibold italic text-emerald-800">
                    {story.doa_latin}
                  </p>
                )}
                {story.doa_translation && (
                  <p className="mt-2 text-center text-base text-ink-soft">
                    &ldquo;{story.doa_translation}&rdquo;
                  </p>
                )}
              </div>
            )}

            {(story.parent_activity || parentQuestions.length > 0) && (
              <div className="mt-6 bg-surface-soft/80 p-5">
                <h3 className="font-display text-xl font-extrabold text-ink">
                  Panduan Orang Tua
                </h3>
                {story.parent_activity && (
                  <p className="mt-3 text-lg leading-relaxed text-ink-soft">
                    {story.parent_activity}
                  </p>
                )}
                {parentQuestions.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {parentQuestions.map((question, index) => (
                      <li key={index} className="text-lg leading-relaxed text-ink-soft">
                        {index + 1}. {question}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <p className="mt-10 text-center text-sm font-bold text-ink-faint">
              Dibuat dengan {brand.name}
            </p>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <LoadError
        message={error instanceof Error ? error.message : "Terjadi kesalahan saat membuat PDF."}
      />
    );
  }
}
