"use client";

import { FormEvent, useState } from "react";

export default function MatematikaTestimonialForm({ customerName }: { customerName: string }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [displayName, setDisplayName] = useState(customerName.split(/\s+/)[0] || "Anonim");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle"|"saving"|"done"|"error">("idle");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setState("saving");
    const response = await fetch("/api/matematika/testimonial", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rating, review, displayName, publicationConsent: consent }),
    });
    setState(response.ok ? "done" : "error");
  }

  if (state === "done") return <div className="rounded-3xl bg-emerald-50 p-6 text-emerald-950 ring-1 ring-emerald-200"><h2 className="text-xl font-extrabold">Terima kasih atas ulasan jujurnya.</h2><p className="mt-2 text-sm">Masukan Anda membantu Papa Bonski Matematika menjadi lebih baik.</p></div>;

  return <form onSubmit={submit} className="space-y-5">
    <div><label className="font-extrabold">Pengalaman belajar sejauh ini</label><div className="mt-2 flex gap-2" role="radiogroup" aria-label="Nilai pengalaman">{[1,2,3,4,5].map(n=><button key={n} type="button" onClick={()=>setRating(n)} aria-pressed={rating===n} className={`rounded-xl px-3 py-2 text-xl ${rating===n?"bg-amber-100 ring-2 ring-amber-400":"bg-surface"}`}>★</button>)}</div></div>
    <div><label htmlFor="review" className="font-extrabold">Ulasan jujur</label><textarea id="review" required minLength={20} maxLength={2000} rows={6} value={review} onChange={e=>setReview(e.target.value)} placeholder="Ceritakan apa yang anak sukai, bagian yang membantu, dan apa yang masih perlu diperbaiki." className="mt-2 w-full rounded-2xl border border-black/10 p-4"/><p className="mt-1 text-xs text-ink-soft">Tidak harus positif. Kritik dan saran tetap sangat kami hargai.</p></div>
    <div><label htmlFor="displayName" className="font-extrabold">Nama yang ditampilkan bila diizinkan</label><input id="displayName" required maxLength={80} value={displayName} onChange={e=>setDisplayName(e.target.value)} className="mt-2 w-full rounded-2xl border border-black/10 p-4"/></div>
    <label className="flex items-start gap-3 rounded-2xl bg-violet-50 p-4 text-sm"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1"/><span>Saya mengizinkan kutipan ulasan dan nama tampilan di atas digunakan pada landing page Papa Bonski. Persetujuan ini opsional.</span></label>
    {state==="error"&&<p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">Ulasan belum tersimpan. Silakan coba lagi.</p>}
    <button disabled={state==="saving"} className="btn-primary w-full disabled:opacity-60">{state==="saving"?"Menyimpan…":"Kirim Ulasan"}</button>
  </form>;
}
