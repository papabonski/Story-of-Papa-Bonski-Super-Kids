/* Service worker: cache-first agar game bisa dimainkan offline. */
// Naikkan versi ini setiap kali isi /assets berubah, kalau tidak pengguna lama
// akan terus melihat versi lama (cache-first).
const CACHE = "papa-bonski-mandarin-integrated-v1";
const ASSETS = [
  "/mandarin",
  "/mandarin-game/index.html",
  "/mandarin-game/config.json",
  "/mandarin-game/assets/css/style.css",
  "/mandarin-game/assets/js/config.js",
  "/mandarin-game/assets/js/data.js",
  "/mandarin-game/assets/js/app.js",
  "/mandarin-game/assets/papa-bonski-logo.png",
  "/mandarin-game/assets/panda-mandarin.png",
  "/mandarin-game/assets/icons/icon-16.png",
  "/mandarin-game/assets/icons/icon-32.png",
  "/mandarin-game/assets/icons/icon-48.png",
  "/mandarin-game/assets/icons/icon-72.png",
  "/mandarin-game/assets/icons/icon-96.png",
  "/mandarin-game/assets/icons/icon-128.png",
  "/mandarin-game/assets/icons/icon-144.png",
  "/mandarin-game/assets/icons/icon-152.png",
  "/mandarin-game/assets/icons/icon-167.png",
  "/mandarin-game/assets/icons/icon-180.png",
  "/mandarin-game/assets/icons/icon-192.png",
  "/mandarin-game/assets/icons/icon-384.png",
  "/mandarin-game/assets/icons/icon-512.png",
  "/mandarin-game/assets/icons/maskable-192.png",
  "/mandarin-game/assets/icons/maskable-512.png",
  "/mandarin-game/assets/icons/apple-touch-icon.png",
  "/mandarin-game/manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  // config.json: jaringan-dulu agar perubahan branding cepat tersebar; cache
  // hanya dipakai sebagai cadangan saat offline.
  if (new URL(e.request.url).pathname.endsWith("/config.json")) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Sisanya cache-dulu agar cepat & bisa offline.
  e.respondWith(
    caches.match(e.request).then((hit) =>
      hit ||
      fetch(e.request)
        .then((res) => {
          if (res.ok && new URL(e.request.url).origin === location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => caches.match("/mandarin"))
    )
  );
});
