const CACHE_NAME = "papa-bonski-super-kids-pwa-v6";
const APP_SHELL = ["/offline"];
const PRIVATE_NAV_PREFIXES = [
  "/app",
  "/create",
  "/collection",
  "/onboarding",
  "/install",
  "/super-kids/checkout",
  "/story/",
];

function isPrivateNavigation(pathname) {
  return PRIVATE_NAV_PREFIXES.some((prefix) =>
    prefix.endsWith("/") ? pathname.startsWith(prefix) : pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function offlineHtml() {
  return new Response(
    `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sedang offline</title>
    <style>
      body{margin:0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f8fafc;color:#111827;display:grid;min-height:100vh;place-items:center;padding:24px}
      main{max-width:360px;text-align:center}
      h1{font-size:24px;margin:0 0 8px;font-weight:800}
      p{margin:0;color:#64748b;line-height:1.5}
    </style>
  </head>
  <body>
    <main>
      <h1>Sedang offline</h1>
      <p>Koneksi terputus. Buka kembali halaman ini saat internet tersedia.</p>
    </main>
  </body>
</html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

function emptyFallback() {
  return new Response("", { status: 504, statusText: "Gateway Timeout" });
}

async function safeCachePut(request, response) {
  try {
    if (!response || !response.ok) return;
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  } catch {
    // Ignore cache write failures. Fetch must still resolve with a Response.
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (url.pathname === "/manifest.webmanifest") {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  if (request.mode === "navigate") {
    const privateNavigation = isPrivateNavigation(url.pathname);
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then((response) => {
          if (!privateNavigation) event.waitUntil(safeCachePut(request, response));
          return response;
        })
        .catch(async () => {
          if (!privateNavigation) {
            const cached = await caches.match(request);
            if (cached) return cached;
          }
          return (await caches.match("/offline")) || offlineHtml();
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(async (cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          event.waitUntil(safeCachePut(request, response));
          return response;
        })
        .catch(() => emptyFallback());
    })
  );
});
