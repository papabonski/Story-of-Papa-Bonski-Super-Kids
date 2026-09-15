/* Lapisan konfigurasi bersama untuk aplikasi pemain dan panel admin.
 *
 * Sumber nilai, dari prioritas terendah ke tertinggi:
 *   1. DEFAULT_CONFIG  — bawaan, selalu ada (juga saat dibuka via file://).
 *   2. config.json     — dikirim bersama situs, berlaku global untuk semua
 *                        pengunjung (hanya termuat di server http/https).
 *   3. override lokal  — perubahan admin di perangkat ini (localStorage),
 *                        untuk pratinjau instan.
 *
 * Catatan keamanan: ini situs statis tanpa server, jadi PIN admin hanya
 * "gerbang lembut" — tersimpan apa adanya dan bisa dilihat siapa pun yang
 * membuka source. Untuk keamanan sungguhan diperlukan backend.
 */
(() => {
  "use strict";

  const DEFAULT_CONFIG = {
    brand: {
      name: "Papa Bonski Mandarin",
      tagline: "Belajar Mandarin Seru untuk Anak · 汉语真好玩",
      logo: "🐻",
      logoImage: "assets/papa-bonski-logo.png",
      mascotImage: "assets/panda-mandarin.png",
      primary: "#A63D0B",
      secondary: "#D84A12"
    },
    defaults: { level: "beginner", focus: "all", questions: 30 },
    games: { disabled: [] },
    admin: { pin: "582741" },
    funnel: {
      website: "https://www.papabonski.com",
      productSlug: "papa-bonski-mandarin",
      entitlement: "papa_bonski_mandarin",
      checkoutProvider: "orderhero",
      trafficSource: "meta_ads"
    }
  };

  // ---------- Utilitas warna ----------
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  const hexToRgb = (h) => {
    h = String(h).replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgbToHex = (rgb) => "#" + rgb.map((x) => clamp(x).toString(16).padStart(2, "0")).join("");
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const contrast = (a, b) => {
    const la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  const rgbToHsl = ([r, g, b]) => {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h, s, l = (mx + mn) / 2;
    if (mx === mn) { h = s = 0; }
    else {
      const d = mx - mn;
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      switch (mx) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return [h, s, l];
  };
  const hslToRgb = ([h, s, l]) => {
    if (s === 0) { const v = l * 255; return [v, v, v]; }
    const hue = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [hue(p, q, h + 1 / 3) * 255, hue(p, q, h) * 255, hue(p, q, h - 1 / 3) * 255];
  };
  const mix = (aHex, bHex, t) => {
    const a = hexToRgb(aHex), b = hexToRgb(bHex);
    return rgbToHex([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t));
  };
  // Geser terang/gelap sebuah warna sampai kontrasnya terhadap bg memenuhi target.
  const toContrast = (hex, bgHex, target, dir) => {
    let [h, s, l] = rgbToHsl(hexToRgb(hex));
    const bg = hexToRgb(bgHex);
    for (let i = 0; i < 60; i++) {
      if (contrast(hslToRgb([h, s, l]), bg) >= target) break;
      l += dir === "lighten" ? 0.02 : -0.02;
      if (l <= 0) { l = 0; break; }
      if (l >= 1) { l = 1; break; }
    }
    return rgbToHex(hslToRgb([h, s, l]));
  };

  // Menurunkan seluruh set variabel CSS (terang & gelap) dari 2 warna merek,
  // menjaga semua peran tetap lolos WCAG AA.
  function derive(primary, secondary) {
    const AA = 4.6; // sedikit di atas 4.5 sebagai penyangga
    const safeOnWhite = (c) => toContrast(c, "#FFFFFF", AA, "darken");
    const light = {
      teal: safeOnWhite(primary),
      "teal-bright": primary,
      "teal-deep": toContrast(primary, "#F6EEDF", AA, "darken"),
      "accent-soft": mix(primary, "#FFFFFF", 0.86),
      coral: safeOnWhite(secondary),
      "coral-bright": secondary,
      "coral-deep": mix(safeOnWhite(secondary), "#000000", 0.28)
    };
    const dark = {
      teal: safeOnWhite(primary),
      "teal-bright": mix(primary, "#FFFFFF", 0.22),
      "teal-deep": toContrast(primary, "#2B3145", AA, "lighten"),
      "accent-soft": mix(primary, "#16171E", 0.80),
      coral: safeOnWhite(secondary),
      "coral-bright": mix(secondary, "#FFFFFF", 0.20),
      "coral-deep": mix(safeOnWhite(secondary), "#000000", 0.28)
    };
    return { light, dark };
  }

  const block = (theme, vars) =>
    `:root[data-theme="${theme}"]{` +
    Object.entries(vars).map(([k, v]) => `--${k}:${v};`).join("") +
    `--accent:${vars.teal};}`;

  function applyBrand(cfg) {
    const { primary, secondary } = cfg.brand;
    const { light, dark } = derive(primary, secondary);
    let el = document.getElementById("brandVars");
    if (!el) {
      el = document.createElement("style");
      el.id = "brandVars";
      document.head.appendChild(el);
    }
    el.textContent = block("light", light) + block("dark", dark);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", light.teal);
  }

  // ---------- Penyimpanan & penggabungan ----------
  const deepMerge = (base, over) => {
    if (!over || typeof over !== "object") return base;
    const out = Array.isArray(base) ? base.slice() : { ...base };
    for (const k of Object.keys(over)) {
      out[k] = over[k] && typeof over[k] === "object" && !Array.isArray(over[k])
        ? deepMerge(base[k] || {}, over[k])
        : over[k];
    }
    return out;
  };
  const readOverride = () => {
    try { return JSON.parse(localStorage.getItem("pbm.config") || "null"); }
    catch { return null; }
  };

  let shipped = {};          // dari config.json (server)
  let override = readOverride() || {};
  let current = deepMerge(deepMerge(DEFAULT_CONFIG, shipped), override);

  const recompute = () => {
    current = deepMerge(deepMerge(DEFAULT_CONFIG, shipped), override);
    applyBrand(current);
    document.dispatchEvent(new CustomEvent("pbm:config", { detail: current }));
  };

  // Ambil config.json (hanya di server; di file:// diblokir browser).
  function fetchShipped() {
    if (!location.protocol.startsWith("http")) return Promise.resolve();
    return fetch("config.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => { if (json) { shipped = json; recompute(); } })
      .catch(() => { /* config.json opsional */ });
  }

  const API = {
    DEFAULT_CONFIG,
    get: () => current,
    // Simpan sebagian perubahan sebagai override lokal (pratinjau instan).
    save(partial) {
      override = deepMerge(override, partial);
      try { localStorage.setItem("pbm.config", JSON.stringify(override)); } catch { /* mode privat */ }
      recompute();
      return current;
    },
    // Buang override lokal, kembali ke config.json / bawaan.
    resetLocal() {
      override = {};
      try { localStorage.removeItem("pbm.config"); } catch { /* abaikan */ }
      recompute();
      return current;
    },
    // Config lengkap untuk diekspor jadi config.json (tanpa cabang kosong).
    exportable: () => deepMerge(DEFAULT_CONFIG, deepMerge(shipped, override)),
    applyBrand,
    derive,
    contrastHex: (aHex, bHex) => contrast(hexToRgb(aHex), hexToRgb(bHex))
  };

  // Perubahan dari tab lain (mis. panel admin) langsung ikut diterapkan.
  window.addEventListener("storage", (e) => {
    if (e.key === "pbm.config") { override = readOverride() || {}; recompute(); }
  });

  window.BrandKit = API;

  // Terapkan segera (sinkron) dari bawaan+override supaya tak ada kedip di
  // perangkat admin, lalu perbarui saat config.json termuat.
  applyBrand(current);
  fetchShipped();
})();
