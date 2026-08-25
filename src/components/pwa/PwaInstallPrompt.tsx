"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

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

  const isIos = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    setInstalled(isStandalone());

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setInstalled(true);
      setPromptEvent(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || dismissed) return null;

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice.catch(() => null);
    if (choice?.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  }

  return (
    <div className="anim-fade-up d4 mt-5 rounded-card bg-surface-card p-4 text-left shadow-sm ring-1 ring-black/[0.06]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-ink">Install di HP atau tablet</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            Buka lebih cepat dari home screen, tampil seperti aplikasi, dan punya fallback offline.
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
          Install Aplikasi
        </button>
      ) : isIos ? (
        <ol className="mt-3 space-y-1.5 text-xs font-semibold leading-relaxed text-ink-soft">
          <li>1. Tap tombol Share di Safari.</li>
          <li>2. Pilih Add to Home Screen.</li>
          <li>3. Tap Add untuk memasang aplikasi.</li>
        </ol>
      ) : (
        <p className="mt-3 text-xs font-semibold leading-relaxed text-ink-soft">
          Jika tombol install belum muncul, buka menu browser lalu pilih Install app atau Add to
          Home screen.
        </p>
      )}
    </div>
  );
}
