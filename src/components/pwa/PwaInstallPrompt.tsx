"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

declare global {
  interface Window {
    __PWA_INSTALL_PROMPT__?: BeforeInstallPromptEvent | null;
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export default function PwaInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [preparing, setPreparing] = useState(true);
  const [installing, setInstalling] = useState(false);

  const isIos = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    setInstalled(isStandalone());

    function useCapturedPrompt() {
      const captured = window.__PWA_INSTALL_PROMPT__ ?? null;
      if (captured) {
        setPromptEvent(captured);
        setPreparing(false);
      }
    }

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      const installEvent = event as BeforeInstallPromptEvent;
      window.__PWA_INSTALL_PROMPT__ = installEvent;
      setPromptEvent(installEvent);
      setPreparing(false);
    }

    function onInstalled() {
      setInstalled(true);
      setPromptEvent(null);
      setInstalling(false);
      window.__PWA_INSTALL_PROMPT__ = null;
    }

    useCapturedPrompt();
    window.addEventListener("pwa-install-prompt-ready", useCapturedPrompt);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    const timer = window.setTimeout(() => setPreparing(false), 1200);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pwa-install-prompt-ready", useCapturedPrompt);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    const currentPrompt = promptEvent ?? window.__PWA_INSTALL_PROMPT__ ?? null;
    if (!currentPrompt) return;

    setInstalling(true);
    try {
      await currentPrompt.prompt();
      const choice = await currentPrompt.userChoice.catch(() => null);
      if (choice?.outcome === "accepted") setInstalled(true);
    } finally {
      setPromptEvent(null);
      setInstalling(false);
      window.__PWA_INSTALL_PROMPT__ = null;
    }
  }

  if (installed) {
    return (
      <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-center ring-1 ring-emerald-200">
        <p className="text-sm font-extrabold text-emerald-800">✓ Papa Bonski Super Kids sudah terpasang</p>
        <p className="mt-1 text-xs font-semibold text-emerald-700">Buka dari icon Papa Bonski di Home Screen.</p>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/[0.06] sm:p-5">
      <div className="text-center">
        <p className="text-base font-extrabold text-ink">Siap dipasang di perangkat ini</p>
        <p className="mx-auto mt-1 max-w-sm text-xs font-semibold leading-relaxed text-ink-soft">
          Install tidak mengubah akun atau paket Anda. Aplikasi tetap memakai akses member Papa Bonski yang sama.
        </p>
      </div>

      {promptEvent ? (
        <button
          type="button"
          onClick={install}
          disabled={installing}
          className="btn-primary mt-4 w-full py-3 text-base disabled:cursor-wait disabled:opacity-70"
        >
          {installing ? "Membuka pilihan install…" : "Install Papa Bonski Super Kids"}
        </button>
      ) : isIos ? (
        <div className="mt-4 rounded-2xl bg-surface px-4 py-4 text-sm font-semibold leading-relaxed text-ink-soft">
          <p className="font-extrabold text-ink">iPhone / iPad</p>
          <ol className="mt-2 space-y-1.5">
            <li>1. Buka halaman ini dengan Safari.</li>
            <li>2. Tekan tombol Share.</li>
            <li>3. Pilih Add to Home Screen, lalu Add.</li>
          </ol>
        </div>
      ) : preparing ? (
        <button type="button" disabled className="btn-primary mt-4 w-full py-3 opacity-70">
          Menyiapkan tombol install…
        </button>
      ) : (
        <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-4 text-sm font-semibold leading-relaxed text-amber-900 ring-1 ring-amber-200">
          <p className="font-extrabold">Tombol otomatis belum tersedia.</p>
          <p className="mt-1">Di Chrome, tekan menu <b>⋮</b> lalu pilih <b>Install app</b> atau <b>Add to Home screen</b>.</p>
        </div>
      )}
    </div>
  );
}
