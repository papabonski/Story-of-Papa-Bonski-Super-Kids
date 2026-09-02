import { getRuntimeProviders } from "@/lib/white-label/settings";
import { callGoogleText, parseJsonFromText } from "./google";
import { callKieChatCompletion } from "./kie";

/** Structured story script returned by the LLM. */
export type StoryScript = {
  title: string;
  /** Intro paragraph ("Kenalkan, ini Adit…"). */
  opener: string;
  scenes: {
    /** Narration text read aloud on this page. */
    narration: string;
    /**
     * One English visual prompt describing the exact story moment on this page.
     * (beginning → middle → end of the moment), one prompt per illustration.
     */
    imagePrompts: string[];
  }[];
  moral: string;
  doa: {
    arabic: string;
    latin: string;
    translation: string;
  };
  parentGuide: {
    activity: string;
    questions: string[];
  };
};

export type StoryInput = {
  childName: string;
  age: number | null;
  gender: "male" | "female" | null;
  themeLabel: string;
  subThemeLabel: string;
  situation: string | null;
  languageLevel: string;
  /** Visual description of the child, kept consistent across all scenes. */
  characterDescription: string;
  /** Fixed wardrobe / recurring adult / recurring-room guide for this story. */
  visualContinuityGuide?: string;
  sceneCount: number;
  qualityFeedback?: string;
};

export type SceneRewriteMode = "regenerate" | "funnier" | "more-islamic";

export type StoryQualityReport = {
  passed: boolean;
  issues: string[];
  suggestions: string[];
};

const STORY_OUTFITS = [
  "a soft teal long-sleeve top with dark navy trousers",
  "a warm coral long-sleeve top with dark navy trousers",
  "a mustard-yellow long-sleeve top with deep brown trousers",
  "a sky-blue long-sleeve top with charcoal trousers",
] as const;

export function storyVisualContinuityGuide(storyId: string): string {
  let hash = 0;
  for (const ch of storyId) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const outfit = STORY_OUTFITS[hash % STORY_OUTFITS.length];

  return [
    `MAIN CHILD OUTFIT: the child wears ${outfit} in every scene; never change its colors or clothing unless the narration explicitly says the child changes clothes.`,
    "RECURRING MOTHER: whenever Ibu appears, keep exactly the same mother in every scene: same face and skin tone, cream hijab, muted teal long-sleeve blouse, and dark navy skirt; never add/remove the hijab or change clothing colors.",
    "CHILD BEDROOM: whenever a scene is in the child's bedroom, keep the same room: warm cream walls, wooden bed on the right with the same patchwork quilt, bookshelf on the left, window on the right, soft rug, and the same furniture positions and color palette.",
    "TIMELINE: assume the illustrated scenes happen in one continuous day unless the narration explicitly says a new day or a clothing change.",
  ].join(" ");
}

function languageLevelGuide(level: string, ageWord: string): string {
  if (level === "toddler") {
    return `Balita: untuk anak ${ageWord}. Pakai kalimat sangat pendek, konkret, ritme berulang, kosakata sehari-hari, dan narasi 2-3 kalimat sederhana per adegan.`;
  }
  if (level === "kindergarten") {
    return `TK: untuk anak ${ageWord}. Pakai kalimat pendek, imajinatif, dialog mudah ditiru, sedikit repetisi, dan narasi 3-4 kalimat per adegan.`;
  }
  if (level === "early-primary") {
    return `SD awal: untuk anak ${ageWord}. Pakai alur jelas, kosakata bertahap, sebab-akibat sederhana, emosi tokoh lebih tampak, dan narasi 4-5 kalimat per adegan.`;
  }
  if (level === "upper-primary") {
    return `SD besar: untuk anak ${ageWord}. Pakai konflik lebih kaya, refleksi lebih dalam, kosakata variatif namun tetap ramah anak, dan narasi 5-6 kalimat per adegan.`;
  }
  return `Otomatis: sesuaikan tingkat bahasa dengan anak ${ageWord}; makin kecil usia, makin pendek dan konkret kalimatnya.`;
}

function buildPrompt(input: StoryInput): string {
  const genderWord =
    input.gender === "female" ? "perempuan" : input.gender === "male" ? "laki-laki" : "anak";
  const ageWord = input.age != null ? `${input.age} tahun` : "usia dini";

  return `Buatkan sebuah cerita anak Islami dalam Bahasa Indonesia yang mendidik, hangat, dan menyenangkan.

TOKOH UTAMA (WAJIB jadi karakter utama dan pahlawan cerita):
- Nama: ${input.childName}
- Jenis kelamin: ${genderWord}
- Usia: ${ageWord}
- Penampilan (jaga KONSISTEN di semua adegan): ${input.characterDescription}
${input.visualContinuityGuide ? `- Kunci kontinuitas visual: ${input.visualContinuityGuide}` : ""}

LEVEL BAHASA:
${languageLevelGuide(input.languageLevel, ageWord)}

TEMA: ${input.themeLabel}
SUB TEMA (nilai yang ingin ditanamkan): ${input.subThemeLabel}
${input.situation ? `SITUASI NYATA yang ingin diperbaiki: ${input.situation}` : ""}

ALUR CERITA (WAJIB, bagi rata ke ${input.sceneCount} adegan sebagai satu kisah utuh):
1) Pembuka yang mengait: kenalkan ${input.childName} dan suasananya dengan hangat + rasa penasaran.
2) Muncul MASALAH/tantangan yang relevan dengan sub tema; naikkan ketegangan sedikit demi sedikit.
3) PUNCAK (klimaks): ${input.childName} menghadapi pilihan atau keputusan penting.
4) PENYELESAIAN yang hangat dan memuaskan: ${input.childName} belajar, berubah, dan semua terasa lega serta bahagia.
- Hadirkan 1-2 tokoh pendukung BERNAMA (mis. Ibu, Ayah, atau seorang sahabat dengan nama) yang konsisten dari awal sampai akhir.

KETENTUAN:
- Buat TEPAT ${input.sceneCount} adegan (scenes) yang mengalir mengikuti alur di atas menjadi satu kisah utuh.
- "title": judul singkat, khas, dan menggugah rasa penasaran (jangan datar/klise).
- Bahasa sederhana, positif, tanpa menggurui, dan WAJIB mengikuti LEVEL BAHASA di atas.
- Setiap "narration" harus hidup sesuai level bahasa: untuk Balita/TK lebih pendek dan konkret; untuk SD awal/SD besar boleh lebih panjang dan kaya. Munculkan emosi tokoh, detail suasana (suara, warna, gerakan, perasaan), sedikit ketegangan/kejutan yang bikin anak penasaran, dan momen lucu atau mengharukan. Hindari kalimat datar atau ringkasan.
- Buat SERU & LUCU: sisipkan efek suara/onomatope secukupnya (mis. "Wush!", "Deg!", "Hihi!"), humor ringan yang bersih, dan bila pas gunakan SATU frasa BERULANG (refrain) yang muncul di beberapa adegan agar mudah diingat anak. Jangan berlebihan.
- WAJIB ada PERCAKAPAN di sebagian besar adegan: tampilkan ${input.childName} berbicara langsung memakai tanda kutip ("..."), dan boleh ada dialog singkat dengan tokoh lain. Buat gaya bicara ${input.childName} natural, ceria, dan sopan seperti anak ${genderWord} berusia ${ageWord} — cara ${input.childName} berbicara dan cara tokoh lain menyapanya harus sesuai jenis kelaminnya (${genderWord}).
- Nilai Islami & ADAB dijalin ALAMI lewat perbuatan dan percakapan, bukan ceramah: tunjukkan contoh konkret seperti mengucap salam, "Bismillah" sebelum mulai, "Alhamdulillah" saat senang, jujur, sabar, meminta maaf & memaafkan, berbakti pada orang tua, atau berbagi. Sebut Allah dengan wajar sesuai konteks, dan tampilkan momen ${input.childName} berdoa/berdzikir pendek di saat yang pas dalam cerita.
- "opener" memperkenalkan ${input.childName} dengan hangat dan menggugah rasa ingin tahu (seperti "Kenalkan, ini ${input.childName}...").
- Setiap adegan punya "imagePrompts": array berisi TEPAT 1 prompt BAHASA INGGRIS untuk 1 ilustrasi halaman tersebut. Prompt harus menggambarkan PERSIS momen utama yang diceritakan di "narration" adegan itu, mencakup tokoh, aksi, emosi, benda penting, dan latar yang disebut di narasi (jangan menambah adegan/objek yang tidak ada di narasi). Prompt harus mendeskripsikan apa yang dilakukan ${input.childName}, ekspresi wajahnya, dan latar tempatnya, sambil menjaga penampilan ${input.childName} tetap sama persis di seluruh cerita. Jadikan ${input.childName} satu-satunya tokoh anak utama yang jelas. Jangan ada teks/tulisan/angka di dalam gambar.
- KONSISTENSI VISUAL WAJIB: untuk outfit anak, penampilan/pakaian Ibu yang berulang, dan kamar anak yang berulang, gunakan DESKRIPSI BAHASA INGGRIS YANG SAMA PERSIS pada setiap imagePrompt ketika elemen itu muncul. Jangan mengganti warna baju, jilbab, furnitur, posisi ranjang/rak/jendela, atau palet kamar hanya untuk variasi visual.
- "moral": pesan moral singkat yang selaras dengan nilai Islami.
- "doa": pilih SATU doa/dzikir pendek yang sahih dan relevan dengan tema. Sertakan teks Arab, transliterasi latin, dan terjemahan Indonesia yang akurat.
- "parentGuide.activity": satu aktivitas bermain peran/percakapan untuk orang tua & anak.
- "parentGuide.questions": tepat 3 pertanyaan reflektif singkat untuk anak.
${input.qualityFeedback ? `\nPERBAIKAN WAJIB DARI QUALITY CHECK SEBELUMNYA:\n${input.qualityFeedback}\n` : ""}

Balas HANYA JSON valid dengan struktur:
{
  "title": "string",
  "opener": "string",
  "scenes": [
    { "narration": "string", "imagePrompts": ["string"] }
  ],
  "moral": "string",
  "doa": { "arabic": "string", "latin": "string", "translation": "string" },
  "parentGuide": { "activity": "string", "questions": ["string", "string", "string"] }
}`;
}

const storyJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    opener: { type: "string" },
    scenes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          narration: { type: "string" },
          imagePrompts: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            maxItems: 1,
          },
        },
        required: ["narration", "imagePrompts"],
      },
    },
    moral: { type: "string" },
    doa: {
      type: "object",
      properties: {
        arabic: { type: "string" },
        latin: { type: "string" },
        translation: { type: "string" },
      },
      required: ["arabic", "latin", "translation"],
    },
    parentGuide: {
      type: "object",
      properties: {
        activity: { type: "string" },
        questions: { type: "array", items: { type: "string" } },
      },
      required: ["activity", "questions"],
    },
  },
  required: ["title", "opener", "scenes", "moral", "doa", "parentGuide"],
};

const storyQualityJsonSchema = {
  type: "object",
  properties: {
    passed: { type: "boolean" },
    issues: { type: "array", items: { type: "string" } },
    suggestions: { type: "array", items: { type: "string" } },
  },
  required: ["passed", "issues", "suggestions"],
};

async function callStoryModel(opts: {
  prompt: string;
  temperature: number;
  maxTokens: number;
  responseJsonSchema?: Record<string, unknown>;
}): Promise<string> {
  const providers = await getRuntimeProviders();
  if (providers.story.provider === "gemini") {
    return callGoogleText({
      model: providers.story.model,
      input: opts.prompt,
      temperature: opts.temperature,
      maxTokens: opts.maxTokens,
      responseJsonSchema: opts.responseJsonSchema,
    });
  }

  if (providers.story.provider === "kie") {
    return callKieChatCompletion({
      model: providers.story.model,
      messages: [{ role: "user", content: opts.prompt }],
      temperature: opts.temperature,
      maxTokens: opts.maxTokens,
      jsonMode: !!opts.responseJsonSchema,
    });
  }

  throw new Error(`Provider cerita "${providers.story.provider}" belum didukung.`);
}

/** Calls the configured Gemini provider to produce the structured story script. */
export async function generateStoryScript(input: StoryInput): Promise<StoryScript> {
  const prompt = buildPrompt(input);
  const text = await callStoryModel({
    prompt,
    temperature: 0.9,
    maxTokens: 8192,
    responseJsonSchema: storyJsonSchema,
  });

  let parsed: StoryScript;
  try {
    parsed = parseJsonFromText<StoryScript>(text);
  } catch {
    throw new Error("Gagal membaca hasil cerita dari Gemini (format JSON tidak valid).");
  }

  if (!parsed.scenes || parsed.scenes.length === 0) {
    throw new Error("Gemini tidak menghasilkan adegan cerita.");
  }

  // Defensive: some responses return multiple prompts or a legacy `imagePrompt`.
  // Normalize every scene to exactly one prompt so each page generates one image.
  parsed.scenes = parsed.scenes.map((scene) => ({
    ...scene,
    imagePrompts: normalizeImagePrompts(scene),
  }));

  return parsed;
}

function localStoryQualityIssues(input: StoryInput, script: StoryScript): string[] {
  const issues: string[] = [];
  const childName = input.childName.trim().toLowerCase();
  const joinedText = [
    script.title,
    script.opener,
    ...script.scenes.map((scene) => scene.narration),
    script.moral,
  ]
    .join(" ")
    .toLowerCase();

  if (script.scenes.length !== input.sceneCount) {
    issues.push(`Jumlah scene harus tepat ${input.sceneCount}, tetapi hasil berisi ${script.scenes.length}.`);
  }
  if (!script.doa?.arabic?.trim() || !script.doa?.latin?.trim() || !script.doa?.translation?.trim()) {
    issues.push("Doa harus lengkap: arabic, latin, dan translation.");
  }
  if (!Array.isArray(script.parentGuide?.questions) || script.parentGuide.questions.length !== 3) {
    issues.push("Parent guide harus berisi tepat 3 pertanyaan reflektif.");
  }
  if (!script.scenes.every((scene) => scene.imagePrompts?.length === 1 && scene.imagePrompts[0]?.trim())) {
    issues.push("Setiap scene harus memiliki tepat 1 image prompt yang tidak kosong.");
  }
  if (childName && !joinedText.includes(childName)) {
    issues.push(`Nama anak "${input.childName}" harus konsisten muncul sebagai tokoh utama.`);
  }

  return issues;
}

function buildQualityPrompt(input: StoryInput, script: StoryScript, localIssues: string[]): string {
  const ageWord = input.age != null ? `${input.age} tahun` : "usia dini";

  return `Kamu adalah quality checker ringan untuk cerita anak Islami sebelum gambar/audio dibuat.

KONTEKS:
- Nama anak: ${input.childName}
- Usia/level: ${ageWord}, ${input.languageLevel}
- Tema: ${input.themeLabel}
- Subtema: ${input.subThemeLabel}
- Situasi: ${input.situation ?? "-"}
- Target jumlah scene: ${input.sceneCount}

CEK WAJIB:
1. Doa/dzikir relevan dengan tema/subtema/situasi dan tidak asal tempel.
2. Jumlah scene tepat sesuai target.
3. Bahasa aman, positif, sesuai anak, tidak menakut-nakuti, tidak mempermalukan, tidak kasar.
4. Nama anak konsisten sebagai tokoh utama.
5. Nilai Islami/adab terasa alami lewat tindakan/dialog, tidak terlalu menggurui atau seperti ceramah.
6. Parent guide praktis dan pertanyaannya sesuai isi cerita.
7. Image prompt konsisten secara visual: outfit anak tidak berubah tanpa alasan cerita, Ibu yang berulang mempertahankan wajah/jilbab/pakaian yang sama, dan kamar anak yang sama mempertahankan tata letak, furnitur, serta warna yang sama. Jika ada perubahan tanpa alasan naratif, set passed=false.

MASALAH TERHITUNG OLEH SISTEM:
${localIssues.length ? localIssues.map((issue) => `- ${issue}`).join("\n") : "- Tidak ada"}

CERITA JSON:
${JSON.stringify(script)}

Balas HANYA JSON valid:
{
  "passed": true,
  "issues": [],
  "suggestions": []
}

Jika ada masalah yang perlu diperbaiki sebelum lanjut membuat gambar/audio, set "passed": false dan isi "issues" dengan alasan spesifik.`;
}

export async function validateStoryQuality(
  input: StoryInput,
  script: StoryScript
): Promise<StoryQualityReport> {
  const localIssues = localStoryQualityIssues(input, script);
  const text = await callStoryModel({
    prompt: buildQualityPrompt(input, script, localIssues),
    temperature: 0.1,
    maxTokens: 2048,
    responseJsonSchema: storyQualityJsonSchema,
  });

  let aiReport: StoryQualityReport;
  try {
    aiReport = parseJsonFromText<StoryQualityReport>(text);
  } catch {
    throw new Error("Gagal membaca hasil quality check cerita (format JSON tidak valid).");
  }

  const issues = [...localIssues, ...(Array.isArray(aiReport.issues) ? aiReport.issues : [])]
    .map((issue) => String(issue).trim())
    .filter(Boolean);
  const suggestions = (Array.isArray(aiReport.suggestions) ? aiReport.suggestions : [])
    .map((suggestion) => String(suggestion).trim())
    .filter(Boolean);

  return {
    passed: !!aiReport.passed && issues.length === 0,
    issues,
    suggestions,
  };
}

const sceneRewriteJsonSchema = {
  type: "object",
  properties: {
    narration: { type: "string" },
    imagePrompt: { type: "string" },
  },
  required: ["narration", "imagePrompt"],
};

function sceneRewriteInstruction(mode: SceneRewriteMode): string {
  if (mode === "funnier") {
    return "Buat adegan ini lebih lucu, hangat, dan hidup, dengan humor bersih untuk anak.";
  }
  if (mode === "more-islamic") {
    return "Perkuat nilai Islami/adab secara alami lewat tindakan atau dialog, tanpa terdengar seperti ceramah.";
  }
  return "Tulis ulang adegan ini agar lebih segar, rapi, dan menarik, sambil menjaga alur cerita.";
}

export async function rewriteStoryScene(input: {
  mode: SceneRewriteMode;
  childName: string;
  age: number | null;
  gender: "male" | "female" | null;
  themeLabel: string | null;
  subThemeLabel: string | null;
  title: string | null;
  sceneIndex: number;
  sceneCount: number;
  currentNarration: string;
  previousNarration?: string | null;
  nextNarration?: string | null;
  characterDescription: string | null;
  visualContinuityGuide?: string;
  languageLevel?: string | null;
}): Promise<{ narration: string; imagePrompt: string }> {
  const genderWord =
    input.gender === "female" ? "perempuan" : input.gender === "male" ? "laki-laki" : "anak";
  const ageWord = input.age != null ? `${input.age} tahun` : "usia dini";
  const prompt = `Tulis ulang SATU adegan cerita anak Islami dalam Bahasa Indonesia.

MODE: ${sceneRewriteInstruction(input.mode)}

KONTEKS CERITA:
- Judul: ${input.title ?? "Cerita anak"}
- Tokoh utama: ${input.childName}, ${genderWord}, ${ageWord}
- Level bahasa: ${languageLevelGuide(input.languageLevel ?? "auto", ageWord)}
- Penampilan konsisten: ${input.characterDescription ?? fallbackCharacterDescription({
    name: input.childName,
    age: input.age,
    gender: input.gender,
  })}
${input.visualContinuityGuide ? `- Kunci kontinuitas visual: ${input.visualContinuityGuide}` : ""}
- Tema: ${input.themeLabel ?? "-"}
- Sub tema: ${input.subThemeLabel ?? "-"}
- Adegan: ${input.sceneIndex + 1} dari ${input.sceneCount}
- Adegan sebelumnya: ${input.previousNarration ?? "-"}
- Adegan sekarang: ${input.currentNarration}
- Adegan berikutnya: ${input.nextNarration ?? "-"}

KETENTUAN:
- Pertahankan kesinambungan dengan adegan sebelum/sesudah.
- Ikuti level bahasa di atas; bahasa harus hangat, kaya detail secukupnya, dan enak dibacakan.
- ${input.childName} harus tetap menjadi tokoh utama.
- Sertakan dialog natural jika cocok.
- Balas HANYA JSON valid.
- "imagePrompt" harus Bahasa Inggris, tepat menggambarkan momen utama adegan ini, menjaga karakter konsisten, tanpa teks/tulisan/angka di gambar.
- Jika outfit anak, Ibu, atau kamar pernah muncul pada cerita ini, pertahankan detail dan warna yang sama persis sesuai kunci kontinuitas visual; jangan membuat variasi baru.

Struktur:
{
  "narration": "string",
  "imagePrompt": "string"
}`;

  const text = await callStoryModel({
    prompt,
    temperature: input.mode === "regenerate" ? 0.85 : 0.95,
    maxTokens: 2048,
    responseJsonSchema: sceneRewriteJsonSchema,
  });

  const parsed = parseJsonFromText<{ narration?: unknown; imagePrompt?: unknown }>(text);
  const narration = typeof parsed.narration === "string" ? parsed.narration.trim() : "";
  const imagePrompt = typeof parsed.imagePrompt === "string" ? parsed.imagePrompt.trim() : "";
  if (!narration) throw new Error("AI tidak mengembalikan narasi adegan.");
  return {
    narration,
    imagePrompt: imagePrompt || visualPromptFromNarration(narration, input.characterDescription),
  };
}

export function visualPromptFromNarration(
  narration: string,
  characterDescription: string | null
): string {
  const trimmed = narration.replace(/\s+/g, " ").trim().slice(0, 900);
  return [
    "Warm children's storybook illustration, 4:3 composition.",
    characterDescription ? `Keep the main child consistent: ${characterDescription}.` : "",
    `Illustrate this exact story moment: ${trimmed}`,
    "Show expressive faces, clear action, cozy colorful setting, no text, no letters, no numbers.",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Max illustrations rendered per scene page. */
export const MAX_IMAGES_PER_SCENE = 1;

/**
 * Coerce a scene's visual prompt(s) into a clean one-item array, tolerating
 * models that return a single string or the legacy singular `imagePrompt` field.
 */
export function normalizeImagePrompts(scene: {
  imagePrompts?: unknown;
  imagePrompt?: unknown;
}): string[] {
  const raw = Array.isArray(scene.imagePrompts)
    ? scene.imagePrompts
    : scene.imagePrompts != null
      ? [scene.imagePrompts]
      : scene.imagePrompt != null
        ? [scene.imagePrompt]
        : [];

  const cleaned = raw
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter((p) => p.length > 0)
    .slice(0, MAX_IMAGES_PER_SCENE);

  return cleaned.length > 0 ? cleaned : [""];
}

/** A sensible default look description when no photo has been analyzed yet. */
export function fallbackCharacterDescription(input: {
  name: string;
  age: number | null;
  gender: "male" | "female" | null;
}): string {
  const g = input.gender === "female" ? "seorang anak perempuan" : "seorang anak laki-laki";
  const age = input.age != null ? ` berusia sekitar ${input.age} tahun` : "";
  return `${g}${age} bernama ${input.name}, ceria, dengan pakaian rapi dan ramah.`;
}
