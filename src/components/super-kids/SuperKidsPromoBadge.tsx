"use client";

import { useEffect, useState } from "react";

type Availability = { active: boolean; total: number; claimed: number; remaining: number };

export default function SuperKidsPromoBadge({ compact = false }: { compact?: boolean }) {
  const [promo, setPromo] = useState<Availability | null>(null);

  useEffect(() => {
    fetch("/api/promotions/super-kids-launch", { cache: "no-store" })
      .then(response => response.json())
      .then(data => { if (data?.ok) setPromo(data); })
      .catch(() => {});
  }, []);

  if (!promo?.active || promo.remaining <= 0) return null;
  if (compact) return <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">🎁 Sisa {promo.remaining} paket gratis</span>;

  return <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-950 ring-1 ring-emerald-200">
    <p className="font-extrabold">50 pengguna pertama gratis</p>
    <p className="mt-1 text-sm">Masih tersedia <b>{promo.remaining}</b> dari {promo.total} Paket Cobain Rp0. Peserta diminta memberikan ulasan jujur setelah satu hari pemakaian.</p>
  </div>;
}
