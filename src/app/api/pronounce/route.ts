import { NextResponse } from "next/server";
import { isGoogleAiRetryableError } from "@/lib/ai/google";
import { synthesizePronunciation } from "@/lib/ai/pronounce";
import { vocabularyWordSet } from "@/lib/digital-stories";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * GET /api/pronounce?word=journey
 *
 * Returns Gemini TTS audio for one English vocabulary word, for the pronounce
 * button in the digital-story vocabulary list.
 *
 * Only words that appear in the catalogue are accepted — this endpoint is
 * public (no story ownership to check against), and an open text parameter
 * would let anyone spend the owner's Gemini quota on arbitrary speech.
 */
export async function GET(req: Request) {
  const word = new URL(req.url).searchParams.get("word")?.trim().toLowerCase() ?? "";

  if (!word) {
    return NextResponse.json({ error: "Parameter 'word' wajib diisi." }, { status: 400 });
  }
  if (!vocabularyWordSet.has(word)) {
    return NextResponse.json(
      { error: "Kata tidak ada di daftar vocabulary." },
      { status: 404 }
    );
  }

  try {
    const { audio, mimeType } = await synthesizePronunciation(word);
    return new NextResponse(Buffer.from(audio), {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(audio.byteLength),
        // The catalogue is static, so the clip for a word never changes.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    const retryable = isGoogleAiRetryableError(error);
    const message = error instanceof Error ? error.message : "Gagal membuat audio.";
    console.error("[pronounce]", { word, message });

    // 503 tells the client to fall back to the browser's own speech engine.
    return NextResponse.json(
      {
        error: retryable
          ? "Suara sedang antre, coba lagi sebentar lagi."
          : "Suara AI tidak tersedia saat ini.",
        retry: retryable,
      },
      { status: 503 }
    );
  }
}
