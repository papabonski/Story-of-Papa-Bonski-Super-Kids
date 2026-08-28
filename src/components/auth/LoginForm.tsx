"use client";

import { FormEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginForm({ initialEmail = "", nextPath = "/onboarding" }: { initialEmail?: string; nextPath?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const safeNext = useMemo(
    () => nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/onboarding",
    [nextPath],
  );

  async function requestOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setStep("otp");
      setMessage("Kode OTP sudah dikirim. Masukkan 6 digit kode dari email Papa Bonski di bawah ini.");
    } catch (e: any) {
      setError(e?.message || "Gagal mengirim kode OTP. Coba lagi.");
    } finally { setLoading(false); }
  }

  async function verifyOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.replace(/\D/g, "").slice(0, 6),
        type: "email",
      });
      if (error) throw error;
      window.location.assign(safeNext);
    } catch (e: any) {
      setError(e?.message || "Kode OTP tidak valid atau sudah kedaluwarsa. Minta kode baru dan coba lagi.");
    } finally { setLoading(false); }
  }

  if (step === "otp") {
    return <form onSubmit={verifyOtp} className="mt-6 space-y-4 text-left">
      <div className="rounded-2xl bg-orange-50 p-4 text-sm text-orange-950 ring-1 ring-orange-100">
        Kode dikirim ke <b>{email}</b>. Jangan gunakan link konfirmasi lama; cukup masukkan kode 6 digit dari email terbaru.
      </div>
      <div>
        <label className="text-sm font-extrabold">Kode OTP 6 digit</label>
        <input
          value={token}
          onChange={e=>setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
          type="text"
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          placeholder="123456"
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-center text-2xl font-extrabold tracking-[0.35em] outline-none ring-brand-primary/20 focus:ring-4"
        />
      </div>
      <button disabled={loading || token.length !== 6} className="btn-primary w-full disabled:opacity-60">{loading ? "Memverifikasi…" : "Verifikasi & Masuk"}</button>
      <button type="button" disabled={loading} onClick={()=>{ setStep("email"); setToken(""); setError(null); setMessage(null); }} className="btn-secondary w-full disabled:opacity-60">Ganti Email / Minta Kode Baru</button>
      {message && <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800">✅ {message}</div>}
      {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">⚠️ {error}</div>}
      <p className="text-center text-xs text-ink-soft">Supabase menerapkan jeda keamanan antar pengiriman OTP. Jika diminta menunggu, tunggu sekitar 1 menit sebelum meminta kode baru.</p>
    </form>;
  }

  return <form onSubmit={requestOtp} className="mt-6 space-y-4 text-left">
    <div>
      <label className="text-sm font-extrabold">Email saat membeli</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" placeholder="bunda@email.com" className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-brand-primary/20 focus:ring-4" />
      <p className="mt-2 text-xs text-ink-soft">Gunakan email yang sama dengan transaksi OrderHero agar akses dapat ditemukan otomatis.</p>
    </div>
    <button disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? "Mengirim…" : "Kirim Kode OTP"}</button>
    {message && <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800">✅ {message}</div>}
    {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">⚠️ {error}</div>}
  </form>;
}
