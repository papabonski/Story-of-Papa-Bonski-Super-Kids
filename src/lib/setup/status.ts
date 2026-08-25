// Server-only helpers to figure out whether a fresh deployment still needs
// the guided /setup wizard, and to derive the Supabase project ref from the
// public project URL (used to build direct dashboard links and the Postgres
// connection string for the automatic migration runner).

export type SetupEnvStatus = {
  hasSupabaseUrl: boolean;
  hasSupabaseAnonKey: boolean;
  hasSupabaseServiceKey: boolean;
  hasGeminiKey: boolean;
  hasWorkerSecret: boolean;
  supabaseProjectRef: string | null;
  supabaseUrl: string | null;
};

/** Extracts "abcdefgh" from "https://abcdefgh.supabase.co". */
export function getSupabaseProjectRef(url: string | undefined | null): string | null {
  if (!url) return null;
  const match = /^https?:\/\/([a-z0-9-]+)\.supabase\.co/i.exec(url.trim());
  return match ? match[1] : null;
}

export function getSetupEnvStatus(): SetupEnvStatus {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  return {
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasSupabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasSupabaseServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasGeminiKey: Boolean(
      process.env.GEMINI_API_KEY ||
        process.env.GEMINI_API_KEYS ||
        process.env.GOOGLE_GENERATIVE_AI_API_KEY
    ),
    hasWorkerSecret: Boolean(process.env.STORY_WORKER_SECRET),
    supabaseProjectRef: getSupabaseProjectRef(supabaseUrl),
    supabaseUrl,
  };
}

/**
 * Cheap, synchronous, no-network check used on every page (via the layout
 * banner) to decide whether to nudge the buyer toward /setup. Never throws.
 */
export function isBaseConfigMissing(): boolean {
  const s = getSetupEnvStatus();
  return !(s.hasSupabaseUrl && s.hasSupabaseAnonKey && s.hasSupabaseServiceKey && s.hasGeminiKey);
}
