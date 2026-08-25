import { getRuntimeProviders } from "@/lib/white-label/settings";
import { synthesizeGoogleSpeech } from "./google";

export type Pronunciation = {
  audio: Uint8Array;
  mimeType: string;
};

/**
 * Instruction tuned for single-word drilling: one clear, slow reading of the
 * word by itself. Without this the model tends to add a sentence around it.
 */
const INSTRUCTION = [
  "You are an English pronunciation coach for young children.",
  "Say ONLY the single English word below, clearly and slowly,",
  "in a friendly neutral American accent. Do not spell it,",
  "do not translate it, and do not add any other words.",
].join(" ");

/**
 * Process-level cache of synthesized words.
 *
 * The vocabulary is a small fixed set shared by every visitor, so one Gemini
 * call per word serves everyone until the server restarts. Without this each
 * play would burn a TTS request, and the audio purpose is rate-limited to one
 * call every few seconds.
 */
const cache = new Map<string, Pronunciation>();
const MAX_CACHED_WORDS = 500;

/** In-flight requests, so N clicks on the same word make one Gemini call. */
const inFlight = new Map<string, Promise<Pronunciation>>();

export function cacheKey(word: string, voice: string): string {
  return `${voice}:${word.toLowerCase()}`;
}

export function getCachedPronunciation(key: string): Pronunciation | undefined {
  return cache.get(key);
}

export async function synthesizePronunciation(word: string): Promise<Pronunciation> {
  const providers = await getRuntimeProviders();
  const key = cacheKey(word, providers.tts.voice);

  const cached = cache.get(key);
  if (cached) return cached;

  const pending = inFlight.get(key);
  if (pending) return pending;

  const task = (async () => {
    const synth = await synthesizeGoogleSpeech({
      model: providers.tts.model,
      voice: providers.tts.voice,
      text: word,
      instruction: INSTRUCTION,
    });
    const result: Pronunciation = { audio: synth.audio, mimeType: synth.mimeType };

    // Cheap FIFO eviction — the working set is tiny, this is only a guard rail.
    if (cache.size >= MAX_CACHED_WORDS) {
      const oldest = cache.keys().next().value;
      if (oldest) cache.delete(oldest);
    }
    cache.set(key, result);
    return result;
  })();

  inFlight.set(key, task);
  try {
    return await task;
  } finally {
    inFlight.delete(key);
  }
}
