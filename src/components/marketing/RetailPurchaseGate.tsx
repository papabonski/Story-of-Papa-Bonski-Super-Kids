"use client";

import { FormEvent, useMemo, useState } from "react";

const BASE_URL = "https://papabonski.orderhero.id/form/papa-bonski-super-kids";
const TOPUP_3_URL = "https://papabonski.orderhero.id/form/papa-bonski-tambah-3-cerita";
const TOPUP_8_URL = "https://papabonski.orderhero.id/form/papa-bonski-tambah-8-cerita";

type CheckState = "idle" | "checking" | "existing" | "error";

function buildCheckoutUrl(base: string, email: string) {
  try {
    const u = new URL(base);
    if (typeof window !== "undefined") {
      const current = new URLSearchParams(window.location.search);
      let stored: Record<string,string> = {};
      try { stored = JSON.parse(localStorage.getItem("pb_attribution") || "{}"); } catch {}
      for (const k of ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid"]) {
        const short = k.replace("utm_", "");
        const v = current.get(k) || stored[short] || stored[k];
        if (v) u.searchParams.set(k, v);
      }
    }
    u.searchParams.set("email", email);
    return u.toString();
  } catch {
    return base;
  }
}

export default function RetailPurchaseGate() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<CheckState>("idle");

  const baseHref = useMemo(() => buildCheckoutUrl(BASE_URL, email), [email]);
  const topup3Href = useMemo(() => buildCheckoutUrl(TOPUP_3_URL, email), [email]);
  const topup8Href = useMemo(() => buildCheckoutUrl(TOPUP_8_URL, email), [email]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("checking");

    try {
      const res = await fetch("/api/retail/check-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error("check_failed");

      if (data.hasActivePackage) {
        setState("existing");
        return;
      }

      window.location.href = buildCheckoutUrl(BASE_URL, email);
    } catch {
      setState("error");
    }
  }

  if (state === "existing") {
    return <div className="space-y-5">
      <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200">
        <p className="text-xs font-black uppercase tracking-wider text-amber-700">Email sudah memiliki Paket Super Kids 1</p>
        <h2 className="mt-2 text-2xl font-extrabold text-ink">Anda ingin melanjutkan yang mana?</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Gunakan email yang sama saat checkout agar pembelian masuk ke akun Papa Bonski yang sama.
        </p>
      </div>

      <a href={baseHref} className="block rounded-3xl bg-surface-card p-5 shadow-sm ring-1 ring-black/5 hover:ring-brand-primary/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-extrabold text-ink">Beli Paket Super Kids 1 Lagi</p>
            <p className="mt-1 text-sm text-ink-soft">+2 cerita personal dan +1 tahun masa akses.</p>
          </div>
          <b className="whitespace-nowrap text-brand-primary">Rp50.000</b>
        </div>
        <div className="mt-4 rounded-2xl bg-brand-primary px-4 py-3 text-center font-extrabold text-white">Pilih Paket Super Kids 1</div>
      </a>

      <a href={topup3Href} className="block rounded-3xl bg-surface-card p-5 shadow-sm ring-2 ring-emerald-200 hover:ring-emerald-400">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-extrabold text-ink">Tambah 3 Cerita</p>
            <p className="mt-1 text-sm text-ink-soft">Tambah kuota saja, tanpa memperpanjang masa akses.</p>
          </div>
          <b className="whitespace-nowrap text-emerald-700">Rp50.000</b>
        </div>
        <div className="mt-4 rounded-2xl bg-emerald-600 px-4 py-3 text-center font-extrabold text-white">Pilih +3 Cerita</div>
      </a>

      <a href={topup8Href} className="block rounded-3xl bg-surface-card p-5 shadow-sm ring-1 ring-black/5 hover:ring-brand-primary/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-extrabold text-ink">Tambah 8 Cerita</p>
            <p className="mt-1 text-sm text-ink-soft">Tambah kuota saja, tanpa memperpanjang masa akses.</p>
          </div>
          <b className="whitespace-nowrap text-brand-primary">Rp120.000</b>
        </div>
        <div className="mt-4 rounded-2xl bg-brand-primary px-4 py-3 text-center font-extrabold text-white">Pilih +8 Cerita</div>
      </a>

      <button type="button" onClick={() => setState("idle")} className="w-full py-2 text-sm font-bold text-ink-soft hover:text-ink">
        Gunakan email lain
      </button>
    </div>;
  }

  return <form onSubmit={onSubmit} className="space-y-5">
    <div>
      <label htmlFor="purchase-email" className="text-sm font-extrabold text-ink">Email yang akan digunakan saat membeli</label>
      <input
        id="purchase-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="bunda@email.com"
        className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-base outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
      />
      <p className="mt-2 text-xs leading-relaxed text-ink-faint">
        Kami cek apakah email ini sudah mempunyai Paket Super Kids 1 agar Anda tidak salah membeli paket.
      </p>
    </div>

    {state === "error" && (
      <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
        Pengecekan belum berhasil. Silakan coba lagi.
      </div>
    )}

    <button
      type="submit"
      disabled={state === "checking"}
      className="w-full rounded-2xl bg-brand-primary px-5 py-4 font-extrabold text-white shadow-sm disabled:cursor-wait disabled:opacity-60"
    >
      {state === "checking" ? "Memeriksa email..." : "Lanjut ke Pembelian"}
    </button>

    <p className="text-center text-xs text-ink-faint">
      Belum punya Paket Super Kids 1? Anda akan langsung diarahkan ke checkout paket utama.
    </p>
  </form>;
}
