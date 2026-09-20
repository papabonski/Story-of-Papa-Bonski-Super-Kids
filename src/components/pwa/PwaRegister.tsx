"use client";

import { useEffect, useState } from "react";

export default function PwaRegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    if (process.env.NODE_ENV !== "production" && !isLocalhost && !process.env.NEXT_PUBLIC_ENABLE_SW_IN_DEV) {
      return;
    }

    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    let registration: ServiceWorkerRegistration | null = null;

    const offerUpdate = (worker: ServiceWorker | null) => {
      if (!worker || !navigator.serviceWorker.controller) return;
      setWaitingWorker(worker);
      setDismissed(false);
    };

    const watchRegistration = (nextRegistration: ServiceWorkerRegistration) => {
      registration = nextRegistration;
      offerUpdate(nextRegistration.waiting);

      nextRegistration.addEventListener("updatefound", () => {
        const installingWorker = nextRegistration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state === "installed") offerUpdate(installingWorker);
        });
      });
    };

    const checkForUpdate = () => {
      registration?.update().catch(() => {});
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") checkForUpdate();
    };

    navigator.serviceWorker
      .register("/sw.js")
      .then((nextRegistration) => {
        watchRegistration(nextRegistration);
        return nextRegistration.update();
      })
      .catch((error) => {
        console.warn("[pwa] service worker registration failed", error);
      });

    window.addEventListener("focus", checkForUpdate);
    window.addEventListener("online", checkForUpdate);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      window.removeEventListener("focus", checkForUpdate);
      window.removeEventListener("online", checkForUpdate);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const applyUpdate = () => {
    if (!waitingWorker) return;
    setUpdating(true);
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  };

  if (!waitingWorker || dismissed) return null;

  return (
    <aside
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-md rounded-3xl border border-amber-200 bg-white p-4 shadow-2xl shadow-amber-950/20 sm:bottom-6"
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-2xl"
        >
          🎉
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-lg font-extrabold text-slate-900">
            Versi baru Papa Bonski tersedia
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            Perbarui untuk melihat modul dan tampilan terbaru. Akses yang sudah dimiliki tetap aman.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyUpdate}
              disabled={updating}
              className="rounded-full bg-amber-500 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
            >
              {updating ? "Memperbarui…" : "Perbarui Sekarang"}
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              disabled={updating}
              className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
