import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateUserId } from "@/lib/supabase/auth";
import { sceneImagePaths } from "@/lib/scene";
import { storyAssetPublicUrl } from "@/lib/storage";
import { createZip, textFile } from "@/lib/zip";

export const runtime = "nodejs";
export const maxDuration = 60;

type ZipEntry = Parameters<typeof createZip>[0][number];

function safeFileName(value: string | null | undefined): string {
  const cleaned = (value ?? "storybook")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  return cleaned || "storybook";
}

function extension(path: string, fallback: string): string {
  const clean = path.split("?")[0];
  const match = clean.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : fallback;
}

function padScene(index: number): string {
  return String(index + 1).padStart(2, "0");
}

async function fetchAsset(path: string): Promise<Uint8Array | null> {
  const res = await fetch(storyAssetPublicUrl(path));
  if (!res.ok) return null;
  return Uint8Array.from(Buffer.from(await res.arrayBuffer()));
}

function storyMarkdown(input: {
  title: string | null;
  childName: string;
  opener: string | null;
  themeLabel: string | null;
  subThemeLabel: string | null;
  moral: string | null;
  doa: { arabic: string | null; latin: string | null; translation: string | null };
  activity: string | null;
  questions: string[];
  scenes: { index: number; narration_text: string | null }[];
}): string {
  const lines = [
    `# ${input.title ?? `Cerita untuk ${input.childName}`}`,
    "",
    `Untuk: ${input.childName}`,
    input.themeLabel || input.subThemeLabel
      ? `Tema: ${[input.themeLabel, input.subThemeLabel].filter(Boolean).join(" - ")}`
      : "",
    "",
    "## Pembuka",
    input.opener ?? "",
    "",
    "## Adegan",
    "",
  ].filter((line) => line !== "");

  for (const scene of input.scenes) {
    lines.push(`### Adegan ${scene.index + 1}`, scene.narration_text ?? "", "");
  }

  if (input.moral) lines.push("## Pesan Moral", input.moral, "");
  if (input.doa.arabic || input.doa.latin || input.doa.translation) {
    lines.push("## Doa");
    if (input.doa.arabic) lines.push(input.doa.arabic);
    if (input.doa.latin) lines.push(input.doa.latin);
    if (input.doa.translation) lines.push(input.doa.translation);
    lines.push("");
  }
  if (input.activity || input.questions.length > 0) {
    lines.push("## Panduan Orang Tua");
    if (input.activity) lines.push(input.activity, "");
    input.questions.forEach((question, index) => lines.push(`${index + 1}. ${question}`));
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const userId = await getOrCreateUserId();

  const { data: story, error: storyErr } = await supabase
    .from("stories")
    .select(
      "id, user_id, title, opener_text, theme_label, subtheme_label, child_id, moral_text, doa_arabic, doa_latin, doa_translation, parent_activity, parent_questions, opener_audio_path"
    )
    .eq("id", id)
    .maybeSingle();

  if (storyErr) return NextResponse.json({ error: storyErr.message }, { status: 500 });
  if (!story) return NextResponse.json({ error: "Cerita tidak ditemukan." }, { status: 404 });
  if (story.user_id !== userId)
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  const [{ data: child }, { data: scenes, error: scenesErr }] = await Promise.all([
    supabase.from("children").select("name").eq("id", story.child_id).maybeSingle(),
    supabase
      .from("scenes")
      .select("index, narration_text, image_path, image_paths, audio_path")
      .eq("story_id", id)
      .order("index", { ascending: true }),
  ]);

  if (scenesErr) return NextResponse.json({ error: scenesErr.message }, { status: 500 });

  const rows = scenes ?? [];
  const childName = child?.name ?? "si kecil";
  const parentQuestions = Array.isArray(story.parent_questions)
    ? story.parent_questions.filter((item): item is string => typeof item === "string")
    : [];
  const entries: ZipEntry[] = [];

  const metadata = {
    id: story.id,
    title: story.title,
    childName,
    theme: {
      main: story.theme_label,
      sub: story.subtheme_label,
    },
    opener: story.opener_text,
    scenes: rows.map((scene) => ({
      index: scene.index,
      narration: scene.narration_text,
      imagePaths: sceneImagePaths(scene).filter(Boolean),
      audioPath: scene.audio_path,
    })),
    moral: story.moral_text,
    doa: {
      arabic: story.doa_arabic,
      latin: story.doa_latin,
      translation: story.doa_translation,
    },
    parentGuide: {
      activity: story.parent_activity,
      questions: parentQuestions,
    },
  };
  const markdownData = {
    title: story.title,
    childName,
    opener: story.opener_text,
    themeLabel: story.theme_label,
    subThemeLabel: story.subtheme_label,
    moral: story.moral_text,
    doa: {
      arabic: story.doa_arabic,
      latin: story.doa_latin,
      translation: story.doa_translation,
    },
    activity: story.parent_activity,
    questions: parentQuestions,
    scenes: rows,
  };

  entries.push({
    path: "README.txt",
    data: textFile(
      [
        "Paket storybook offline",
        "",
        "Isi folder:",
        "- story.md: teks cerita siap edit/cetak",
        "- story.json: data terstruktur",
        "- cover.*: cover dari ilustrasi adegan pertama",
        "- images/: ilustrasi per adegan",
        "- audio/: narasi pembuka dan adegan jika sudah tersedia",
        "",
        "Catatan: format audio mengikuti hasil generator aplikasi (misalnya mp3 atau wav).",
      ].join("\n")
    ),
  });
  entries.push({ path: "story.md", data: textFile(storyMarkdown(markdownData)) });
  entries.push({ path: "story.json", data: textFile(JSON.stringify(metadata, null, 2)) });

  const firstImagePath = sceneImagePaths(rows[0] ?? {})[0] ?? null;
  if (firstImagePath) {
    const cover = await fetchAsset(firstImagePath);
    if (cover) entries.push({ path: `cover.${extension(firstImagePath, "png")}`, data: cover });
  }

  for (const scene of rows) {
    const imagePath = sceneImagePaths(scene)[0] ?? null;
    if (imagePath) {
      const image = await fetchAsset(imagePath);
      if (image) {
        entries.push({
          path: `images/scene-${padScene(scene.index)}.${extension(imagePath, "png")}`,
          data: image,
        });
      }
    }

    if (scene.audio_path) {
      const audio = await fetchAsset(scene.audio_path);
      if (audio) {
        entries.push({
          path: `audio/scene-${padScene(scene.index)}.${extension(scene.audio_path, "mp3")}`,
          data: audio,
        });
      }
    }
  }

  if (story.opener_audio_path) {
    const openerAudio = await fetchAsset(story.opener_audio_path);
    if (openerAudio) {
      entries.push({
        path: `audio/opener.${extension(story.opener_audio_path, "mp3")}`,
        data: openerAudio,
      });
    }
  }

  const zip = createZip(entries);
  const filename = `${safeFileName(story.title ?? `cerita-${childName}`)}-paket.zip`;
  const body = zip.buffer.slice(zip.byteOffset, zip.byteOffset + zip.byteLength) as ArrayBuffer;

  return new Response(body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
