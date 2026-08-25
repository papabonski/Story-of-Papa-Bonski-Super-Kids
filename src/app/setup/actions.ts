"use server";

import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";
import { getMigrationSql } from "@/lib/setup/migrationSql";
import { getSetupEnvStatus, getSupabaseProjectRef } from "@/lib/setup/status";

export type ActionResult = {
  ok: boolean;
  message: string;
  detail?: string;
};

/**
 * Runs the (idempotent) database migration against the buyer's own Supabase
 * Postgres database, using the DB password they paste into the wizard.
 * The password is used once, in-memory, for this single connection — it is
 * never written to disk, logged, or stored anywhere.
 */
function requireSetupSecret(formData: FormData) {
  const configured = process.env.ADMIN_DASHBOARD_SECRET ?? process.env.STORY_WORKER_SECRET;
  if (!configured) return; // no secret configured yet — allow (first-run convenience)
  const submitted = String(formData.get("setupSecret") ?? "");
  if (submitted !== configured) {
    throw new Error(
      "Secret salah. Isi STORY_WORKER_SECRET (atau ADMIN_DASHBOARD_SECRET) yang kamu set di Environment Variables."
    );
  }
}

export async function runDatabaseSetup(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    requireSetupSecret(formData);
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Secret salah." };
  }

  const dbPassword = String(formData.get("dbPassword") ?? "").trim();
  if (!dbPassword) {
    return { ok: false, message: "Password database Supabase belum diisi." };
  }

  const { supabaseUrl } = getSetupEnvStatus();
  const projectRef = getSupabaseProjectRef(supabaseUrl);
  if (!projectRef) {
    return {
      ok: false,
      message:
        "NEXT_PUBLIC_SUPABASE_URL belum di-set atau formatnya tidak dikenali. Set dulu di Vercel Environment Variables, lalu redeploy.",
    };
  }

  const connectionString = `postgresql://postgres:${encodeURIComponent(
    dbPassword
  )}@db.${projectRef}.supabase.co:5432/postgres`;

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
  } catch (err) {
    return {
      ok: false,
      message:
        "Gagal konek ke database. Cek lagi password database (bukan anon/service key) di Supabase → Project Settings → Database.",
      detail: err instanceof Error ? err.message : String(err),
    };
  }

  try {
    const sql = getMigrationSql();
    await client.query(sql);
    return {
      ok: true,
      message:
        "Berhasil! Semua tabel, storage bucket, dan aturan keamanan sudah dibuat di database kamu.",
    };
  } catch (err) {
    return {
      ok: false,
      message: "Koneksi berhasil, tapi ada error saat menjalankan setup database.",
      detail: err instanceof Error ? err.message : String(err),
    };
  } finally {
    await client.end().catch(() => {});
  }
}

/**
 * Confirms anonymous auth is enabled by attempting a real anonymous sign-in
 * with the project's public anon key. This can't be toggled remotely (it's a
 * project-level Supabase setting), so this only checks and reports status.
 */
export async function checkAnonymousAuth(): Promise<ActionResult> {
  const { hasSupabaseUrl, hasSupabaseAnonKey, supabaseUrl } = getSetupEnvStatus();
  if (!hasSupabaseUrl || !hasSupabaseAnonKey) {
    return { ok: false, message: "Supabase URL / anon key belum di-set." };
  }

  try {
    const supabase = createClient(supabaseUrl as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      return {
        ok: false,
        message: "Anonymous auth belum aktif. Aktifkan dulu lewat link di atas, lalu cek lagi.",
        detail: error.message,
      };
    }
    return { ok: true, message: "Anonymous auth sudah aktif dan berfungsi." };
  } catch (err) {
    return {
      ok: false,
      message: "Gagal memeriksa anonymous auth.",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Pings Google AI Studio with the configured Gemini key to confirm it's valid. */
export async function testGeminiKey(): Promise<ActionResult> {
  const key =
    process.env.GEMINI_API_KEY ||
    (process.env.GEMINI_API_KEYS ?? "").split(",")[0]?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!key) {
    return { ok: false, message: "GEMINI_API_KEY belum di-set di Environment Variables." };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
      { method: "GET" }
    );
    if (!res.ok) {
      const body = await res.text();
      return {
        ok: false,
        message: "Key Gemini ditolak Google. Cek lagi key-nya di Google AI Studio.",
        detail: body.slice(0, 300),
      };
    }
    return { ok: true, message: "Key Gemini valid dan aktif." };
  } catch (err) {
    return {
      ok: false,
      message: "Gagal menghubungi Google AI Studio.",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}
