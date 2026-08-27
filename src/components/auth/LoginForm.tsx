"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${origin}/auth/callback?next=/onboarding`, shouldCreateUser: true },
      });
      if (error) throw error;
      setMessage("Link masuk sudah dikirim. Buka email Bunda, lalu tekan tombol/link dari Papa Bonski.");
    } catch (e: any) {
      setError(e?.message || "Gagal mengirim link masuk. Coba lagi.");
    } finally { setLoading(false); }
  }

  return <form onSubmit={submit} className="mt-6 space-y-4 text-left">
    <div>
      <label className="text-sm font-extrabold">Email saat membeli</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" placeholder="bunda@email.com" className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-brand-primary/20 focus:ring-4" />
      <p className="mt-2 text-xs text-ink-soft">Gunakan email yang sama dengan transaksi OrderHero agar akses dapat ditemukan otomatis.</p>
    </div>
    <button disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? "Mengirim…" : "Kirim Link Masuk"}</button>
    {message && <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800">✅ {message}</div>}
    {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">⚠️ {error}</div>}
  </form>;
}
