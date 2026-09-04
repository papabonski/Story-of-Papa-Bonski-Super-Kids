"use client";

import { useState } from "react";

export function ReceiverTestButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function runTest() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/seller/orderhero/test", { method: "POST" });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.detail || result?.error || "Receiver test gagal.");
      }
      setMessage(`PASS · ${result.testOrderId} · status receiver ${result.receiverStatus}`);
      window.setTimeout(() => window.location.reload(), 900);
    } catch (error) {
      setMessage(`GAGAL · ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={runTest} disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Menguji…" : "🧪 Test Receiver Aman"}
      </button>
      {message && <p className="mt-2 text-xs font-semibold text-ink-soft">{message}</p>}
    </div>
  );
}

export function ReplayWebhookButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function replay() {
    if (!window.confirm("Replay event ini? Sistem akan membuat delivery webhook baru. Proteksi idempotency tetap mencegah subscription/kuota ganda.")) return;
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/seller/orderhero/replay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.detail || result?.error || "Replay gagal.");
      }
      const receiver = result?.receiverResult;
      const outcome = receiver?.needsMapping ? "masih needs_mapping" : receiver?.duplicate ? "duplicate aman" : receiver?.ok ? "processed" : "selesai";
      setMessage(`Replay selesai · ${outcome}`);
      window.setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setMessage(`GAGAL · ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      <button onClick={replay} disabled={loading} className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-extrabold text-orange-900 disabled:opacity-60">
        {loading ? "Replay…" : "↻ Replay Aman"}
      </button>
      {message && <p className="mt-2 text-xs font-semibold text-ink-soft">{message}</p>}
    </div>
  );
}
