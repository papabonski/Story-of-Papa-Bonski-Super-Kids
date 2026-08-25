"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    if (process.env.NODE_ENV !== "production" && !isLocalhost && !process.env.NEXT_PUBLIC_ENABLE_SW_IN_DEV) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => registration.update().catch(() => {}))
      .catch((error) => {
        console.warn("[pwa] service worker registration failed", error);
      });
  }, []);

  return null;
}
