"use client";

import { FormEvent, useState } from "react";

type CheckState = "idle" | "checking" | "new" | "existing" | "redirecting" | "error";
type ProductSku = "PBSK-SUPER-KIDS" | "PBSK-STORY-CREDIT-3" | "PBSK-STORY-CREDIT-8";

function readAttribution() {
  if (typeof window === "undefined") return {};
  const current = new URLSearchParams(window.location.search);
  let stored: Record<string,string> = {};
  try { stored = JSON.parse(localStorage.getItem("pb_attribution") || "{}"); } catch {}
  const out: Record<string,string> = {};
  for (const k of ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid"]) {
    const short = k.replace("utm_", "");
    const v = current.get(k) || stored[short] || stored[k];
    if (v) out[k] = v;
  }
  return out;
}

export default function RetailPurchaseGate({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [state, setState] = useState<CheckState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("checking");
    setError(null);

    try {
      const res = await fetch("/api/retail/check-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error("check_failed");
      setState(data.hasActivePackage ? "existing" : "new");
    } catch {
      setState("error");
      setError("Pengecekan belum berhasil. Silakan coba lagi.");
    }
  }

  async function goToCheckout(productSku: ProductSku) {
    setState("redirecting");
    setError(null);
    try {
      const res = await fetch("/api/retail/prepare-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          recipientEmail: email,
          productSku,
          attribution: readAttribution(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok || !data?.url) throw new Error("prepare_failed");
      window.location.assign(data.url);
    } catch {
      setState("error");
      setError("Checkout belum dapat dibuka. Silakan coba lagi.");
    }
  }

  if (state === "existing") {
    return <div className="space-y-5">
      <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200">
        <p className="text-xs font-black uppercase tracking-wider text-amber-700">Email Penerima sudah memiliki Paket Super Kids 1</p>
        <h2 className="mt-2 text-2xl font-extrabold text-ink">Tambahkan kuota cerita ke akun ini.</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Email Penerima ini adalah email login Papa Bonski. Jika paket ditujukan untuk orang lain, gunakan Email Penerima yang berbeda.
        </p>
      </div>

      <button type="button" onClick={() => goToCheckout("PBSK-STORY-CREDIT-3")} className="block w-full rounded-3xl bg-surface-card p-5 text-left shadow-sm ring-2 ring-emerald-200 hover:ring-emerald-400">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-extrabold text-ink">Tambah 3 Cerita</p>
            <p className="mt-1 text-sm text-ink-soft">Tambah kuota ke Email Penerima ini, tanpa memperpanjang masa akses.</p>
          </div>
          <b className="whitespace-nowrap text-emerald-700">Rp50.000</b>
        </div>
        <div className="mt-4 rounded-2xl bg-emerald-600 px-4 py-3 text-center font-extrabold text-white">Pilih +3 Cerita</div>
      </button>

      <button type="button" onClick={() => goToCheckout("PBSK-STORY-CREDIT-8")} className="block w-full rounded-3xl bg-surface-card p-5 text-left shadow-sm ring-1 ring-black/5 hover:ring-brand-primary/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-extrabold text-ink">Tambah 8 Cerita</p>
            <p className="mt-1 text-sm text-ink-soft">Tambah kuota ke Email Penerima ini, tanpa memperpanjang masa akses.</p>
          </div>
          <b className="whitespace-nowrap text-brand-primary">Rp120.000</b>
        </div>
        <div className="mt-4 rounded-2xl bg-brand-primary px-4 py-3 text-center font-extrabold text-white">Pilih +8 Cerita</div>
      </button>

      <button type="button" onClick={() => { setState("idle"); setEmail(""); setError(null); }} className="w-full py-2 text-sm font-bold text-brand-primary hover:underline">
        Paket ini untuk orang lain? Gunakan Email Penerima lain
      </button>
    </div>;
  }

  if (state === "new") {
    return <div className="space-y-5">
      <div className="rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-200">
        <p className="text-xs font-black uppercase tracking-wider text-emerald-700">Siap membuat akun penerima</p>
        <h2 className="mt-2 text-2xl font-extrabold text-ink">Paket Super Kids 1 untuk Email Penerima ini.</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Akun akan mendapat akses 1 tahun + 2 cerita personal. Login nantinya selalu menggunakan Email Penerima ini.
        </p>
      </div>

      <button type="button" onClick={() => goToCheckout("PBSK-SUPER-KIDS")} className="w-full rounded-2xl bg-brand-primary px-5 py-4 font-extrabold text-white shadow-sm">
        Lanjut ke Checkout — Rp50.000
      </button>

      <div className="rounded-2xl bg-surface p-4 text-sm leading-relaxed text-ink-soft">
        Di halaman OrderHero, pembeli mengisi <b>Email Pembeli</b>, nama, dan WhatsApp. Email Pembeli boleh sama atau berbeda dengan Email Penerima.
      </div>

      <button type="button" onClick={() => setState("idle")} className="w-full py-2 text-sm font-bold text-ink-soft hover:text-ink">
        Ganti Email Penerima
      </button>
    </div>;
  }

  return <form onSubmit={onSubmit} className="space-y-5">
    <div>
      <label htmlFor="recipient-email" className="text-sm font-extrabold text-ink">Email Penerima / Email Login Papa Bonski</label>
      <input
        id="recipient-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="penerima@email.com"
        className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-base outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
      />
      <p className="mt-2 text-xs leading-relaxed text-ink-faint">
        Email ini akan menjadi pemilik akses dan selalu digunakan untuk login OTP. Jika membeli untuk diri sendiri, Email Penerima boleh sama dengan Email Pembeli.
      </p>
    </div>

    {error && (
      <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>
    )}

    <button
      type="submit"
      disabled={state === "checking" || state === "redirecting"}
      className="w-full rounded-2xl bg-brand-primary px-5 py-4 font-extrabold text-white shadow-sm disabled:cursor-wait disabled:opacity-60"
    >
      {state === "checking" ? "Memeriksa Email Penerima..." : state === "redirecting" ? "Membuka checkout..." : "Lanjut"}
    </button>

    <p className="text-center text-xs text-ink-faint">
      Data pembayaran dan Email Pembeli akan diisi pada checkout OrderHero.
    </p>
  </form>;
}
