"use client";

import { FormEvent, useState } from "react";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function readAttribution() {
  const query = new URLSearchParams(window.location.search);
  let stored: Record<string, string> = {};
  try { stored = JSON.parse(localStorage.getItem("pb_attribution") || "{}"); } catch {}
  const attribution: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"]) {
    const value = query.get(key) || stored[key.replace("utm_", "")] || stored[key];
    if (value) attribution[key] = value;
  }
  return attribution;
}

type MandarinPurchaseGateProps = {
  standaloneCheckoutReady: boolean;
  memberCheckoutReady: boolean;
  signedInEmail?: string | null;
  hasSuperKidsAccess: boolean;
  hasMandarinAccess: boolean;
};

export default function MandarinPurchaseGate({
  standaloneCheckoutReady,
  memberCheckoutReady,
  signedInEmail,
  hasSuperKidsAccess,
  hasMandarinAccess,
}: MandarinPurchaseGateProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "new" | "member" | "existing" | "redirecting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function checkRecipient(event: FormEvent) {
    event.preventDefault();
    const recipientEmail = normalizeEmail(email);
    setEmail(recipientEmail);
    setState("checking");
    setError(null);
    try {
      const response = await fetch("/api/retail/check-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: recipientEmail, productSku: "PBM-MANDARIN" }),
      });
      const result = await response.json();
      if (!response.ok || !result?.ok) throw new Error("check_failed");
      setState(result.hasActivePackage ? "existing" : result.hasActiveSuperKids ? "member" : "new");
    } catch {
      setState("error");
      setError("Pengecekan email belum berhasil. Silakan coba lagi.");
    }
  }

  async function continueToOrderHero(productSku: "PBM-MANDARIN" | "PBM-MANDARIN-MEMBER") {
    const checkoutReady = productSku === "PBM-MANDARIN-MEMBER"
      ? memberCheckoutReady
      : standaloneCheckoutReady;
    if (!checkoutReady) {
      setState("error");
      setError("Form pembayaran Mandarin sedang dipersiapkan.");
      return;
    }
    setState("redirecting");
    setError(null);
    try {
      const response = await fetch("/api/retail/prepare-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          recipientEmail: productSku === "PBM-MANDARIN-MEMBER" ? undefined : email,
          productSku,
          attribution: readAttribution(),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result?.ok || !result?.url) throw new Error("checkout_failed");
      window.location.assign(result.url);
    } catch {
      setState("error");
      setError("Checkout belum dapat dibuka. Silakan coba lagi.");
    }
  }

  if (hasMandarinAccess && signedInEmail) {
    return <div className="space-y-4 rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-200">
      <p className="font-extrabold text-emerald-900">Akses Mandarin pada akun ini sudah aktif.</p>
      <a href="/mandarin" className="btn-primary w-full">Buka Papa Bonski Mandarin</a>
    </div>;
  }

  if (hasSuperKidsAccess && signedInEmail) {
    return <div className="space-y-4 rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-200">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Harga khusus member Super Kids</p>
        <p className="mt-1 text-3xl font-extrabold text-emerald-950">Rp15.000</p>
        <p className="mt-2 text-sm text-emerald-900">Akses Mandarin akan ditambahkan ke akun <b>{signedInEmail}</b>.</p>
      </div>
      <button type="button" onClick={() => continueToOrderHero("PBM-MANDARIN-MEMBER")} disabled={state === "redirecting"} className="btn-primary w-full disabled:opacity-60">
        {state === "redirecting" ? "Membuka OrderHero…" : "Beli Add-on Mandarin"}
      </button>
      {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    </div>;
  }

  if (state === "existing") {
    return <div className="space-y-4 rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200">
      <p className="font-extrabold text-amber-900">Email ini sudah memiliki akses Mandarin aktif.</p>
      <a href={`/login?next=${encodeURIComponent("/mandarin")}&email=${encodeURIComponent(email)}`} className="btn-primary w-full">Masuk dengan OTP</a>
      <button type="button" onClick={() => setState("idle")} className="btn-secondary w-full">Gunakan email lain</button>
    </div>;
  }

  if (state === "member") {
    return <div className="space-y-4 rounded-3xl bg-violet-50 p-5 ring-1 ring-violet-200">
      <div>
        <p className="font-extrabold text-violet-950">Email ini berhak mendapat harga member Rp15.000.</p>
        <p className="mt-2 text-sm text-violet-900">Masuk dengan OTP terlebih dahulu agar harga khusus dan tujuan akses dapat diverifikasi dengan aman.</p>
      </div>
      <a href={`/login?next=${encodeURIComponent("/mandarin/checkout")}&email=${encodeURIComponent(email)}`} className="btn-primary w-full">Masuk & Ambil Harga Member</a>
      <button type="button" onClick={() => setState("idle")} className="btn-secondary w-full">Gunakan email lain</button>
    </div>;
  }

  if (state === "new" || state === "redirecting") {
    return <div className="space-y-4 rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-200">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Harga pelanggan baru</p>
        <p className="mt-1 text-3xl font-extrabold text-emerald-950">Rp25.000</p>
      </div>
      <p className="text-sm text-emerald-900">Lisensi Mandarin akan diberikan kepada:</p>
      <p className="break-all rounded-2xl bg-white p-4 font-extrabold ring-1 ring-emerald-200">{email}</p>
      <button type="button" onClick={() => continueToOrderHero("PBM-MANDARIN")} disabled={state === "redirecting"} className="btn-primary w-full disabled:opacity-60">
        {state === "redirecting" ? "Membuka OrderHero…" : "Konfirmasi & Lanjut ke Pembayaran"}
      </button>
      <button type="button" onClick={() => setState("idle")} className="btn-secondary w-full">Ganti Email Penerima</button>
    </div>;
  }

  return <form onSubmit={checkRecipient} className="space-y-4">
    <div>
      <label htmlFor="mandarin-recipient" className="text-sm font-extrabold">Email Penerima / Email Login</label>
      <input id="mandarin-recipient" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="penerima@email.com" className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none focus:ring-2 focus:ring-brand-primary/20" />
      <p className="mt-2 text-xs text-ink-soft">Email ini menjadi pemilik lisensi dan digunakan untuk menerima kode OTP.</p>
    </div>
    {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    <button disabled={state === "checking"} className="btn-primary w-full disabled:opacity-60">{state === "checking" ? "Memeriksa…" : "Periksa Email Penerima"}</button>
  </form>;
}
