"use client";

import { FormEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginForm({ initialEmail = "", nextPath = "/app" }: { initialEmail?: string; nextPath?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const safeNext = useMemo(
    () => nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/app",
    [nextPath],
  );

  async function requestOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const normalizedEmail = email.trim().toLowerCase();

      const prepareResponse = await fetch("/api/auth/prepare-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const prepareResult = await prepareResponse.json().catch(() => null);

      if (!prepareResponse.ok) {
        throw new Error(
          prepareResult?.error ||
            "Email Penerima belum siap untuk login. Pastikan email sama dengan yang didaftarkan sebelum checkout.",
        );
      }

      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: { shouldCreateUser: false },
      });
      if (error) throw error;

      setEmail(normalizedEmail);
      setStep("otp");
      setMessage("Kode OTP sudah diminta. Jika ini login pertama dan OTP belum tiba, buka email konfirmasi akun Papa Bonski terlebih dahulu, konfirmasikan email, lalu minta kode baru.");
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
        Kode dikirim ke <b>{email}</b>. Masukkan kode OTP 6 digit dari email terbaru Papa Bonski.
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
      <p className="text-center text-xs text-ink-soft">Demi keamanan, ada jeda singkat antar pengiriman kode. Jika diminta menunggu, tunggu sekitar 1 menit sebelum meminta kode baru.</p>
    </form>;
  }

  return <form onSubmit={requestOtp} className="mt-6 space-y-4 text-left">
    <div>
      <label className="text-sm font-extrabold">Email Penerima / Email Login Papa Bonski</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" placeholder="penerima@email.com" className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-brand-primary/20 focus:ring-4" />
      <p className="mt-2 text-xs text-ink-soft">Gunakan Email Penerima yang didaftarkan sebelum checkout. Email inilah yang memiliki akses dan digunakan untuk login OTP.</p>
    </div>
    <div className="rounded-2xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-100">
      <b>Login pertama?</b> Jika OTP belum masuk dan Anda menerima email konfirmasi akun Papa Bonski, klik konfirmasi email tersebut terlebih dahulu. Setelah itu kembali ke halaman ini dan minta OTP lagi.
    </div>
    <button disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? "Mengirim…" : "Kirim Kode OTP"}</button>
    {message && <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800">✅ {message}</div>}
    {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">⚠️ {error}</div>}
  </form>;
}
