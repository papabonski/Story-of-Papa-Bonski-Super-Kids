"use client";

import { useActionState, useState, useTransition } from "react";
import type { ActionResult } from "@/app/setup/actions";
import { checkAnonymousAuth, runDatabaseSetup, testGeminiKey } from "@/app/setup/actions";
import type { SetupEnvStatus } from "@/lib/setup/status";

const initialResult: ActionResult = { ok: false, message: "" };

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
        ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
      }`}
    >
      {ok ? "✓" : "…"} {label}
    </span>
  );
}

function ResultBanner({ result }: { result: ActionResult }) {
  if (!result.message) return null;
  return (
    <div
      className={`mt-3 rounded-card p-3 text-sm ${
        result.ok
          ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
          : "bg-rose-50 text-rose-800 ring-1 ring-rose-200"
      }`}
    >
      <p className="font-bold">{result.ok ? "Berhasil" : "Belum berhasil"}</p>
      <p>{result.message}</p>
      {result.detail ? (
        <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap break-all rounded bg-black/5 p-2 text-[11px]">
          {result.detail}
        </pre>
      ) : null}
    </div>
  );
}

function Step({
  number,
  title,
  done,
  children,
}: {
  number: number;
  title: string;
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4 rounded-card bg-surface-card p-4 ring-1 ring-black/[0.05]">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${
            done ? "bg-emerald-500 text-white" : "bg-brand-primary/15 text-brand-primary"
          }`}
        >
          {done ? "✓" : number}
        </span>
        <h2 className="text-sm font-extrabold text-ink">{title}</h2>
      </div>
      <div className="text-sm text-ink-soft">{children}</div>
    </section>
  );
}

export default function SetupWizard({ status }: { status: SetupEnvStatus }) {
  const [dbResult, dbAction, dbPending] = useActionState(runDatabaseSetup, initialResult);
  const [authResult, setAuthResult] = useState<ActionResult>(initialResult);
  const [geminiResult, setGeminiResult] = useState<ActionResult>(initialResult);
  const [authPending, startAuthCheck] = useTransition();
  const [geminiPending, startGeminiCheck] = useTransition();

  const authProvidersUrl = status.supabaseProjectRef
    ? `https://supabase.com/dashboard/project/${status.supabaseProjectRef}/auth/providers`
    : "https://supabase.com/dashboard/project/_/auth/providers";
  const dbSettingsUrl = status.supabaseProjectRef
    ? `https://supabase.com/dashboard/project/${status.supabaseProjectRef}/settings/database`
    : "https://supabase.com/dashboard/project/_/settings/database";

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <StatusPill ok={status.hasSupabaseUrl && status.hasSupabaseAnonKey} label="Supabase URL/Key" />
        <StatusPill ok={status.hasSupabaseServiceKey} label="Service Role Key" />
        <StatusPill ok={status.hasGeminiKey} label="Gemini API Key" />
        <StatusPill ok={status.hasWorkerSecret} label="Worker Secret" />
      </div>
      {!status.hasSupabaseUrl && (
        <div className="mb-4 rounded-card bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">
          Environment variable dasar (Supabase/Gemini) belum lengkap. Lengkapi dulu di{" "}
          <strong>Vercel → Project → Settings → Environment Variables</strong>, lalu redeploy sebelum
          melanjutkan langkah di bawah.
        </div>
      )}

      <Step number={1} title="Setup Database Otomatis" done={dbResult.ok}>
        <p className="mb-3">
          Tempel <strong>password database</strong> Supabase kamu (bukan anon/service key) — ambil dari{" "}
          <a href={dbSettingsUrl} target="_blank" rel="noreferrer" className="font-bold text-brand-primary underline">
            Project Settings → Database
          </a>
          . Aplikasi akan membuat semua tabel &amp; storage otomatis, sekali klik.
        </p>
        <form action={dbAction} className="flex flex-col gap-2">
          <input
            name="dbPassword"
            type="password"
            required
            placeholder="Password database Supabase"
            className="h-10 rounded-card border border-black/10 bg-surface px-3 text-sm"
          />
          <input
            name="setupSecret"
            type="password"
            placeholder="Worker/Admin secret (kalau sudah di-set)"
            className="h-10 rounded-card border border-black/10 bg-surface px-3 text-sm"
          />
          <button
            type="submit"
            disabled={dbPending}
            className="btn-primary h-10 disabled:opacity-60"
          >
            {dbPending ? "Menjalankan…" : "Jalankan Setup Database"}
          </button>
        </form>
        <ResultBanner result={dbResult} />
      </Step>

      <Step number={2} title="Aktifkan Anonymous Auth" done={authResult.ok}>
        <p className="mb-3">
          Ini satu-satunya langkah yang harus diklik manual di Supabase (Google/Supabase tidak
          mengizinkan ini diaktifkan dari luar dashboard). Buka link di bawah, nyalakan toggle{" "}
          <strong>Anonymous</strong>, lalu klik &quot;Cek Status&quot;.
        </p>
        <a
          href={authProvidersUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-2 inline-block font-bold text-brand-primary underline"
        >
          Buka Supabase → Authentication → Providers →
        </a>
        <div>
          <button
            type="button"
            disabled={authPending}
            onClick={() => startAuthCheck(async () => setAuthResult(await checkAnonymousAuth()))}
            className="btn-secondary h-10 disabled:opacity-60"
          >
            {authPending ? "Mengecek…" : "Cek Status"}
          </button>
        </div>
        <ResultBanner result={authResult} />
      </Step>

      <Step number={3} title="Tes Gemini API Key" done={geminiResult.ok}>
        <p className="mb-3">
          Mengecek apakah <code>GEMINI_API_KEY</code> yang kamu isi di Vercel sudah benar dan aktif.
        </p>
        <button
          type="button"
          disabled={geminiPending}
          onClick={() => startGeminiCheck(async () => setGeminiResult(await testGeminiKey()))}
          className="btn-secondary h-10 disabled:opacity-60"
        >
          {geminiPending ? "Mengecek…" : "Tes Sekarang"}
        </button>
        <ResultBanner result={geminiResult} />
      </Step>

      {dbResult.ok && authResult.ok && geminiResult.ok && (
        <div className="rounded-card bg-emerald-50 p-4 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
          🎉 Semua siap! Aplikasi sudah bisa dipakai untuk membuat cerita.
        </div>
      )}
    </div>
  );
}
