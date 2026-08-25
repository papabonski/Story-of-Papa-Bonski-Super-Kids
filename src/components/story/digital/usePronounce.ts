"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PronounceStatus = "idle" | "loading" | "playing";

/** null = Gemini working; "browser" = fell back; "none" = no engine at all. */
export type PronounceFallback = null | "browser" | "none";

/**
 * Plays the Gemini TTS clip for a vocabulary word.
 *
 * Clips are fetched once and kept as object URLs for the life of the page, so
 * repeat taps — which children do a lot — are instant and cost nothing. If the
 * API is unavailable (no Gemini key, quota exhausted), it falls back to the
 * browser's built-in speech engine so the button always does something.
 */
export function usePronounce() {
  const [status, setStatus] = useState<PronounceStatus>("idle");
  /** Which word is loading/playing right now; null when idle. */
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [fallback, setFallback] = useState<PronounceFallback>(null);

  const urlCache = useRef(new Map<string, string>());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const urls = urlCache.current;
    return () => {
      audioRef.current?.pause();
      for (const url of urls.values()) URL.revokeObjectURL(url);
      urls.clear();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const speakWithBrowser = useCallback((word: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return false;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return true;
  }, []);

  const speak = useCallback(
    async (word: string) => {
      const id = ++requestId.current;
      const key = word.toLowerCase();

      audioRef.current?.pause();
      window.speechSynthesis?.cancel();

      setActiveWord(word);
      setStatus(urlCache.current.has(key) ? "playing" : "loading");

      let url = urlCache.current.get(key);
      if (!url) {
        try {
          const res = await fetch(`/api/pronounce?word=${encodeURIComponent(key)}`);
          if (!res.ok) throw new Error(String(res.status));
          const blob = await res.blob();
          url = URL.createObjectURL(blob);
          urlCache.current.set(key, url);
        } catch {
          // A newer tap already took over — drop this one silently.
          if (id !== requestId.current) return;
          setFallback(speakWithBrowser(word) ? "browser" : "none");
          setStatus("idle");
          setActiveWord(null);
          return;
        }
      }

      if (id !== requestId.current) return;

      const audio = (audioRef.current ??= new Audio());
      audio.src = url;
      audio.onended = () => {
        if (id !== requestId.current) return;
        setStatus("idle");
        setActiveWord(null);
      };

      try {
        setStatus("playing");
        await audio.play();
      } catch {
        if (id !== requestId.current) return;
        setStatus("idle");
        setActiveWord(null);
      }
    },
    [speakWithBrowser]
  );

  return { speak, status, activeWord, fallback };
}
