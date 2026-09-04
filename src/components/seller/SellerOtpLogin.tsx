"use client";

import { FormEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SellerOtpLogin({
  nextPath = "/seller",
  disabled = false,
}: {
  nextPath?: string;
  disabled?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const safeNext = useMemo(
    () => (nextPath.startsWith("/seller") && !nextPath.startsWith("//") ? nextPath : "/seller"),
    [nextPath],
  );

  async function requestOtp(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const prepareResponse = await fetch("/api/seller/prepare-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const prepareResult = await prepareResponse.json().catch(() => null);
      if (!prepareResponse.ok) {
        throw new Error(prepareResult?.error || "Email ini tidak dapat digunakan untuk Seller Center.");
      }

      const supabase = createSupabaseBrowserClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: { shouldCreateUser: false },
      });
      if (otpError) throw otpError;

      setEmail(normalizedEmail);
      setStep("otp");
      setMessage("Kode OTP sudah dikirim. Buka email terbaru dari Papa Bonski lalu masukkan kode 6 digitnya.");
    } catch (caught: any) {
      setError(caught?.message || "Gagal mengirim kode OTP. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const normalizedToken = token.replace(/\D/g, "").slice(0, 6);
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: normalizedToken,
        type: "email",
      });
      if (verifyError) throw verifyError;

      const sessionResponse = await fetch("/api/seller/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const sessionResult = await sessionResponse.json().catch(() => null);
      if (!sessionResponse.ok) {
        throw new Error(sessionResult?.error || "Login Seller Center tidak dapat diselesaikan.");
      }

      window.location.assign(safeNext);
    } catch (caught: any) {
      setError(caught?.message || "Kode OTP tidak valid atau sudah kedaluwarsa. Minta kode baru dan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={verifyOtp} className="mt-6 space-y-4 text-left">
        <div className="rounded-2xl bg-orange-50 p-4 text-sm text-orange-950 ring-1 ring-orange-100">
          Kode dikirim ke <b>{email}</b>. Masukkan kode OTP 6 digit dari email terbaru Papa Bonski.
        </div>
        <div>
          <label className="text-sm font-extrabold">Kode OTP 6 digit</label>
          <input
            value={token}
            onChange={(event) => setToken(event.target.value.replace(/\D/g, "").slice(0, 6))}
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
        <button disabled={loading || token.length !== 6} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Memverifikasi…" : "Verifikasi & Masuk"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setStep("email");
            setToken("");
            setError(null);
            setMessage(null);
          }}
          className="btn-secondary w-full disabled:opacity-60"
        >
          Ganti Email / Minta Kode Baru
        </button>
        {message && <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800">✅ {message}</div>}
        {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">⚠️ {error}</div>}
        <p className="text-center text-xs text-ink-soft">
          Demi keamanan, ada jeda singkat antar pengiriman kode. Jika diminta menunggu, tunggu sekitar 1 menit sebelum meminta kode baru.
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={requestOtp} className="mt-6 space-y-4 text-left">
      <div>
        <label className="text-sm font-extrabold">Email Administrator</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
          autoComplete="email"
          disabled={disabled}
          placeholder="admin@email.com"
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-brand-primary/20 focus:ring-4 disabled:opacity-50"
        />
        <p className="mt-2 text-xs text-ink-soft">
          Hanya email administrator Papa Bonski yang terdaftar yang dapat menerima kode login Seller Center.
        </p>
      </div>
      <button disabled={loading || disabled} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Mengirim…" : "Kirim Kode OTP"}
      </button>
      {message && <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800">✅ {message}</div>}
      {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">⚠️ {error}</div>}
    </form>
  );
}
