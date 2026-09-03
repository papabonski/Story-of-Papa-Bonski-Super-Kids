"use client";

import { FormEvent, useState } from "react";

type CheckState = "idle" | "checking" | "new" | "existing" | "redirecting" | "error";
type ProductSku = "PBSK-SUPER-KIDS" | "PBSK-STORY-CREDIT-3" | "PBSK-STORY-CREDIT-8";
type MemberMode = "choose" | "topup" | "gift";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

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

export default function RetailPurchaseGate({
  initialEmail = "",
  signedInEmail = "",
}: {
  initialEmail?: string;
  signedInEmail?: string;
}) {
  const memberEmail = normalizeEmail(signedInEmail);
  const isSignedInMember = Boolean(memberEmail);
  const [mode, setMode] = useState<MemberMode>(isSignedInMember ? "choose" : "gift");
  const [email, setEmail] = useState(isSignedInMember ? "" : initialEmail);
  const [state, setState] = useState<CheckState>("idle");
  const [error, setError] = useState<string | null>(null);

  function resetGiftForm() {
    setMode("gift");
    setEmail("");
    setState("idle");
    setError(null);
  }

  function openMemberTopup() {
    setMode("topup");
    setEmail(memberEmail);
    setState("idle");
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const recipient = normalizeEmail(email);
    if (!recipient) return;

    if (isSignedInMember && mode === "gift" && recipient === memberEmail) {
      setState("error");
      setError("Untuk akun yang sedang login, gunakan pilihan Tambah Kuota Akun Saya. Untuk hadiah, masukkan Email Penerima yang berbeda.");
      return;
    }

    setEmail(recipient);
    setState("checking");
    setError(null);

    try {
      const res = await fetch("/api/retail/check-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: recipient }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error("check_failed");
      setState(data.hasActivePackage ? "existing" : "new");
    } catch {
      setState("error");
      setError("Pengecekan belum berhasil. Silakan coba lagi.");
    }
  }

  function goToMemberTopup(productSku: "PBSK-STORY-CREDIT-3" | "PBSK-STORY-CREDIT-8") {
    window.location.assign(`/api/retail/member-topup?sku=${encodeURIComponent(productSku)}`);
  }

  async function goToCheckout(productSku: ProductSku, recipientEmail = email) {
    const recipient = normalizeEmail(recipientEmail);
    setState("redirecting");
    setError(null);
    try {
      const res = await fetch("/api/retail/prepare-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          recipientEmail: recipient,
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

  if (isSignedInMember && mode === "choose") {
    return <div className="space-y-4">
      <div className="rounded-3xl bg-white p-5 ring-1 ring-black/[0.06]">
        <p className="text-xs font-black uppercase tracking-wider text-brand-primary">Member yang sedang login</p>
        <p className="mt-2 break-all text-base font-extrabold text-ink">{memberEmail}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Pilih tujuan pembelian agar kuota atau paket tidak salah diberikan.
        </p>
      </div>

      <button
        type="button"
        onClick={openMemberTopup}
        className="w-full rounded-2xl bg-brand-primary px-5 py-4 text-left font-extrabold text-white shadow-sm"
      >
        Tambah Kuota Akun Saya
        <span className="mt-1 block text-xs font-semibold text-white/80">
          +3 atau +8 cerita akan otomatis masuk ke {memberEmail}.
        </span>
      </button>

      <button
        type="button"
        onClick={resetGiftForm}
        className="w-full rounded-2xl bg-white px-5 py-4 text-left font-extrabold text-ink ring-1 ring-black/[0.08]"
      >
        🎁 Beli Paket Super Kids untuk Orang Lain
        <span className="mt-1 block text-xs font-semibold text-ink-soft">
          Anda wajib memasukkan Email Penerima baru sebelum checkout.
        </span>
      </button>
    </div>;
  }

  if (isSignedInMember && mode === "topup") {
    return <div className="space-y-5">
      <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200">
        <p className="text-xs font-black uppercase tracking-wider text-amber-700">Top-up member login</p>
        <h2 className="mt-2 text-xl font-extrabold text-ink">Kuota akan masuk ke akun ini:</h2>
        <p className="mt-2 break-all font-extrabold text-ink">{memberEmail}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Email Pembeli di OrderHero boleh berbeda. Penerima kuota tetap akun member yang sedang login.
        </p>
      </div>

      <TopupChoices
        disabled={false}
        onThree={() => goToMemberTopup("PBSK-STORY-CREDIT-3")}
        onEight={() => goToMemberTopup("PBSK-STORY-CREDIT-8")}
      />

      {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

      <button type="button" onClick={() => { setMode("choose"); setState("idle"); setError(null); }} className="w-full py-2 text-sm font-bold text-ink-soft hover:text-ink">
        ← Pilih tujuan pembelian lain
      </button>
    </div>;
  }

  if (state === "existing") {
    return <div className="space-y-5">
      <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200">
        <p className="text-xs font-black uppercase tracking-wider text-amber-700">Email Penerima sudah memiliki Paket Super Kids 1</p>
        <h2 className="mt-2 text-xl font-extrabold text-ink">Penerima:</h2>
        <p className="mt-2 break-all font-extrabold text-ink">{email}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Akun ini sudah aktif. Untuk menambah kuota, pemilik akun tersebut harus login ke Papa Bonski lalu memilih Tambah Kuota Akun Saya. Top-up tidak dapat diberikan dari akun member lain.
        </p>
      </div>

      <button type="button" onClick={resetGiftForm} className="w-full py-2 text-sm font-bold text-brand-primary hover:underline">
        Gunakan Email Penerima lain
      </button>
    </div>;
  }

  if (state === "new") {
    return <div className="space-y-5">
      <div className="rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-200">
        <p className="text-xs font-black uppercase tracking-wider text-emerald-700">Siap membuat akun penerima</p>
        <h2 className="mt-2 text-xl font-extrabold text-ink">Paket ini akan diberikan kepada:</h2>
        <p className="mt-2 break-all rounded-2xl bg-white px-4 py-3 text-base font-extrabold text-ink ring-1 ring-emerald-200">{email}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Email ini akan menjadi pemilik lisensi, mendapat akses 1 tahun + 2 cerita personal, dan digunakan untuk login OTP.
        </p>
      </div>

      <button
        type="button"
        onClick={() => goToCheckout("PBSK-SUPER-KIDS")}
        className="w-full rounded-2xl bg-brand-primary px-5 py-4 font-extrabold text-white shadow-sm"
      >
        Konfirmasi & Lanjut ke Checkout — Rp50.000
      </button>

      <div className="rounded-2xl bg-surface p-4 text-sm leading-relaxed text-ink-soft">
        Di halaman OrderHero, pembeli mengisi <b>Email Pembeli</b>, nama, dan WhatsApp. Email Pembeli boleh sama atau berbeda dengan Email Penerima di atas.
      </div>

      <button type="button" onClick={resetGiftForm} className="w-full py-2 text-sm font-bold text-ink-soft hover:text-ink">
        Ganti Email Penerima
      </button>
    </div>;
  }

  return <form onSubmit={onSubmit} className="space-y-5">
    {isSignedInMember && mode === "gift" && (
      <div className="rounded-2xl bg-orange-50 p-4 text-sm leading-relaxed text-orange-950 ring-1 ring-orange-100">
        <b>Pembelian untuk orang lain.</b> Email akun Anda ({memberEmail}) tidak akan digunakan sebagai penerima paket.
      </div>
    )}

    <div>
      <label htmlFor="recipient-email" className="text-sm font-extrabold text-ink">
        Email Penerima {isSignedInMember ? "Baru" : "/ Email Login Papa Bonski"}
      </label>
      <input
        id="recipient-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (error) { setError(null); setState("idle"); } }}
        placeholder="penerima@email.com"
        className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-base outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
      />
      <p className="mt-2 text-xs leading-relaxed text-ink-faint">
        Email ini akan menjadi pemilik akses dan selalu digunakan untuk login OTP.
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
      {state === "checking" ? "Memeriksa Email Penerima..." : "Periksa Email Penerima"}
    </button>

    {isSignedInMember && (
      <button type="button" onClick={() => { setMode("choose"); setEmail(""); setState("idle"); setError(null); }} className="w-full py-2 text-sm font-bold text-ink-soft hover:text-ink">
        ← Batal beli untuk orang lain
      </button>
    )}

    <p className="text-center text-xs text-ink-faint">
      Data pembayaran dan Email Pembeli akan diisi pada checkout OrderHero.
    </p>
  </form>;
}

function TopupChoices({
  disabled,
  onThree,
  onEight,
}: {
  disabled: boolean;
  onThree: () => void;
  onEight: () => void;
}) {
  return <>
    <button type="button" disabled={disabled} onClick={onThree} className="block w-full rounded-3xl bg-surface-card p-5 text-left shadow-sm ring-2 ring-emerald-200 hover:ring-emerald-400 disabled:opacity-60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-extrabold text-ink">Tambah 3 Cerita</p>
          <p className="mt-1 text-sm text-ink-soft">Tambah kuota tanpa memperpanjang masa akses.</p>
        </div>
        <b className="whitespace-nowrap text-emerald-700">Rp50.000</b>
      </div>
      <div className="mt-4 rounded-2xl bg-emerald-600 px-4 py-3 text-center font-extrabold text-white">Pilih +3 Cerita</div>
    </button>

    <button type="button" disabled={disabled} onClick={onEight} className="block w-full rounded-3xl bg-surface-card p-5 text-left shadow-sm ring-1 ring-black/5 hover:ring-brand-primary/40 disabled:opacity-60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-extrabold text-ink">Tambah 8 Cerita</p>
          <p className="mt-1 text-sm text-ink-soft">Tambah kuota tanpa memperpanjang masa akses.</p>
        </div>
        <b className="whitespace-nowrap text-brand-primary">Rp120.000</b>
      </div>
      <div className="mt-4 rounded-2xl bg-brand-primary px-4 py-3 text-center font-extrabold text-white">Pilih +8 Cerita</div>
    </button>
  </>;
}
