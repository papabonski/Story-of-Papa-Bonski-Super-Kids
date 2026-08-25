"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FavoriteStoryButton({
  id,
  favorite,
}: {
  id: string;
  favorite: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(favorite);

  async function toggle() {
    const next = !active;
    setActive(next);
    setBusy(true);
    try {
      const res = await fetch(`/api/stories/${id}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: next }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan favorit.");
      router.refresh();
    } catch {
      setActive(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={active}
      aria-label={active ? "Hapus dari favorit" : "Tambah ke favorit"}
      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm shadow-sm ring-1 transition active:scale-90 disabled:opacity-60 ${
        active
          ? "bg-amber-100 text-amber-600 ring-amber-200"
          : "bg-surface-card text-ink-faint ring-black/[0.06] hover:text-amber-600"
      }`}
    >
      {active ? "★" : "☆"}
    </button>
  );
}
