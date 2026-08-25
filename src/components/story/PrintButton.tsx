"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-95"
    >
      Export PDF
    </button>
  );
}
