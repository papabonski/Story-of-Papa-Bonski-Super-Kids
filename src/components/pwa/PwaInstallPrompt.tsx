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
  const [dismissed, setDismissed] = useState(false);
  const [preparing, setPreparing] = useState(true);

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

  if (installed || dismissed) return null;

  async function install() {
    const currentPrompt = promptEvent ?? window.__PWA_INSTALL_PROMPT__ ?? null;
    if (!currentPrompt) return;

    await currentPrompt.prompt();
    const choice = await currentPrompt.userChoice.catch(() => null);
    if (choice?.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
    window.__PWA_INSTALL_PROMPT__ = null;
  }

  return (
    <div className="anim-fade-up d4 mt-5 rounded-card bg-surface-card p-4 text-left shadow-sm ring-1 ring-black/[0.06]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-ink">Install di HP atau tablet</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            Pasang Papa Bonski Super Kids ke Home Screen agar dapat dibuka seperti aplikasi biasa.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Tutup"
          className="rounded-full px-2 text-lg leading-none text-ink-faint hover:text-ink"
        >
          ×
        </button>
      </div>

      {promptEvent ? (
        <button type="button" onClick={install} className="btn-primary mt-3 w-full">
          Install Papa Bonski Super Kids
        </button>
      ) : isIos ? (
        <ol className="mt-3 space-y-1.5 text-xs font-semibold leading-relaxed text-ink-soft">
          <li>1. Tap tombol Share di Safari.</li>
          <li>2. Pilih Add to Home Screen.</li>
          <li>3. Tap Add untuk memasang aplikasi.</li>
        </ol>
      ) : preparing ? (
        <p className="mt-3 text-xs font-semibold leading-relaxed text-ink-soft">Menyiapkan tombol install…</p>
      ) : (
        <div className="mt-3 rounded-xl bg-surface px-3 py-3 text-xs font-semibold leading-relaxed text-ink-soft">
          Tombol install otomatis belum tersedia di browser ini. Buka menu ⋮ Chrome lalu pilih <b>Install app</b> atau <b>Add to Home screen</b>.
        </div>
      )}
    </div>
  );
}
