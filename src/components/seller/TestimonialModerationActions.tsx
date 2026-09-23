"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestimonialModerationActions({ id, canApprove }: { id: string; canApprove: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function moderate(status: "approved" | "rejected") {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/seller/testimonials/${encodeURIComponent(id)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result?.error === "publication_consent_required" ? "Pengguna tidak memberikan izin publikasi." : "Perubahan belum tersimpan.");
      setLoading(false);
      return;
    }
    router.refresh();
    setLoading(false);
  }

  return <div className="mt-4">
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={loading || !canApprove} onClick={() => moderate("approved")} className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-extrabold text-white disabled:opacity-40">Setujui & Tampilkan</button>
      <button type="button" disabled={loading} onClick={() => moderate("rejected")} className="rounded-full bg-slate-200 px-4 py-2 text-xs font-extrabold text-slate-800 disabled:opacity-40">Tolak</button>
    </div>
    {!canApprove && <p className="mt-2 text-xs text-amber-700">Tidak dapat dipublikasikan karena pengguna tidak memberi izin.</p>}
    {error && <p className="mt-2 text-xs font-bold text-red-700">{error}</p>}
  </div>;
}
