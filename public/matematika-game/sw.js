/* Papa Bonski Matematika — Service Worker
   Membuat aplikasi bisa dipasang (PWA) dan tetap jalan tanpa internet.

   PENTING: naikkan VERSI setiap kali file di APP_SHELL diubah, supaya
   perangkat yang sudah memasang aplikasi mengambil versi terbaru. */

var CACHE_PREFIX = "papa-bonski-matematika-";
var VERSI = CACHE_PREFIX + "v1";
var CACHE_APP = VERSI + "-app";
var CACHE_FONT = VERSI + "-font";

/* Berkas inti yang disimpan saat pemasangan (agar bisa dibuka offline).
   Ikon 512px & maskable sengaja tidak ikut: itu hanya dipakai sistem operasi
   saat memasang aplikasi, bukan oleh halamannya — memasukkannya akan
   menambah ~800 KB unduhan pertama tanpa manfaat saat offline. */
var APP_SHELL = [
  "./",
  "./index.html",
  "./config.js",
  "./manifest.webmanifest",
  "./assets/style.css",
  "./assets/questions.js",
  "./assets/game.js",
  "./assets/pwa.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/favicon-32.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_APP).then(function (c) {
      // addAll gagal total bila satu berkas meleset — simpan satu per satu.
      return Promise.all(APP_SHELL.map(function (url) {
        return c.add(new Request(url, { cache: "reload" })).catch(function () { });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.map(function (n) {
        // Hanya buang cache Matematika versi lama. Cache Super Kids dan
        // Mandarin pada domain papabonski.com tidak boleh ikut terhapus.
        if (n.indexOf(CACHE_PREFIX) === 0 && n.indexOf(VERSI) !== 0) return caches.delete(n);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  /* Halaman: utamakan jaringan supaya versi terbaru langsung terpakai,
     jatuh ke cache bila sedang offline. */
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_APP).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        // Offline: sajikan halaman yang tersimpan. "/" dan "/index.html"
        // bisa berbeda kunci cache-nya (cleanUrls), jadi coba keduanya.
        return caches.match(req).then(function (hit) {
          return hit || caches.match("./index.html").then(function (h2) {
            return h2 || caches.match("./");
          });
        });
      })
    );
    return;
  }

  /* Font Google: simpan saat pertama kali dipakai, lalu sajikan dari cache. */
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE_FONT).then(function (c) { c.put(req, copy); });
          return res;
        }).catch(function () { return hit; });
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  /* Aset lokal: sajikan cepat dari cache, sambil menyegarkan di latar. */
  e.respondWith(
    caches.match(req).then(function (hit) {
      var segar = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE_APP).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || segar;
    })
  );
});
