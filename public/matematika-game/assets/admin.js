/* Papa Bonski Matematika — Panel Admin */

(function () {
  "use strict";

  var LS_KEY = "pbm_config_override";
  var LS_BOARD = "pbm_leaderboard";
  var LS_PASS = "pbm_admin_pass";      // password override (jika diganti dari panel)
  var SS_AUTH = "pbm_admin_session";   // sesi login (sessionStorage)

  /* ---------- Config helpers ---------- */
  function baseConfig() { return window.APP_CONFIG || {}; }
  function overrideConfig() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch (e) { return {}; }
  }
  function currentConfig() {
    var cfg = {}, base = baseConfig(), over = overrideConfig();
    Object.keys(base).forEach(function (k) { cfg[k] = base[k]; });
    Object.keys(over).forEach(function (k) { cfg[k] = over[k]; });
    return cfg;
  }
  function saveOverride(patch) {
    var over = overrideConfig();
    Object.keys(patch).forEach(function (k) { over[k] = patch[k]; });
    localStorage.setItem(LS_KEY, JSON.stringify(over));
  }
  function adminPassword() {
    return localStorage.getItem(LS_PASS) || baseConfig().adminPassword || "admin123";
  }

  /* ---------- UI helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 1800);
  }
  function escHtml(s) { var d = document.createElement("div"); d.textContent = String(s); return d.innerHTML; }

  function darken(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.max(0, (n >> 16) - amt), g = Math.max(0, ((n >> 8) & 255) - amt), b = Math.max(0, (n & 255) - amt);
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  }
  function soften(hex) {
    var n = parseInt(hex.slice(1), 16);
    var mix = function (c) { return Math.round(c + (255 - c) * 0.85); };
    return "#" + ((mix(n >> 16) << 16) | (mix((n >> 8) & 255) << 8) | mix(n & 255)).toString(16).padStart(6, "0");
  }
  function applyPreviewColors(cfg) {
    var r = document.documentElement.style;
    r.setProperty("--brand", cfg.colorPrimary);
    r.setProperty("--brand-dark", darken(cfg.colorPrimary, 40));
    r.setProperty("--brand-soft", soften(cfg.colorPrimary));
    r.setProperty("--accent", cfg.colorAccent);
    r.setProperty("--accent-soft", soften(cfg.colorAccent));
    r.setProperty("--success", cfg.colorSuccess);
    r.setProperty("--danger", cfg.colorDanger);
  }

  /* ---------- Auth ---------- */
  var screenLogin = $("screen-login");
  var screenAdmin = $("screen-admin");
  var btnLogout = $("btn-logout");

  function isAuthed() { return sessionStorage.getItem(SS_AUTH) === "1"; }
  function showAdmin() {
    screenLogin.style.display = "none";
    screenAdmin.style.display = "";
    btnLogout.style.display = "";
    fillForms();
    renderAdminBoard();
    refreshExport();
  }
  function showLogin() {
    screenLogin.style.display = "";
    screenAdmin.style.display = "none";
    btnLogout.style.display = "none";
  }

  $("btn-login").addEventListener("click", tryLogin);
  $("login-pass").addEventListener("keydown", function (e) { if (e.key === "Enter") tryLogin(); });
  function tryLogin() {
    var pass = $("login-pass").value;
    if (pass === adminPassword()) {
      sessionStorage.setItem(SS_AUTH, "1");
      $("login-error").style.display = "none";
      $("login-pass").value = "";
      showAdmin();
    } else {
      $("login-error").style.display = "";
    }
  }
  btnLogout.addEventListener("click", function () {
    sessionStorage.removeItem(SS_AUTH);
    showLogin();
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
      document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
      btn.classList.add("active");
      $("tab-" + btn.dataset.tab).classList.add("active");
    });
  });

  /* ---------- Isi form dari config ---------- */
  var textFields = ["appName", "tagline", "logoUrl", "footerText", "contactWa", "contactLabel"];
  var colorFields = ["colorPrimary", "colorAccent", "colorSuccess", "colorDanger"];
  // Semua level yang dikenal game (questions.js: L1-L4). Tambah di sini bila
  // menambah level baru — form admin ikut menyesuaikan sendiri.
  var LEVELS = [1, 2, 3, 4];

  function fillForms() {
    var cfg = currentConfig();

    textFields.forEach(function (k) { $("f-" + k).value = cfg[k] || ""; });
    colorFields.forEach(function (k) { $("f-" + k).value = cfg[k] || "#000000"; });
    $("f-questionsPerRound").value = cfg.questionsPerRound || 10;
    $("f-hearts").value = cfg.hearts || 3;

    var lv = cfg.enabledLevels || LEVELS;
    LEVELS.forEach(function (n) {
      $("f-lv" + n).checked = lv.indexOf(n) >= 0;
      $("f-lvName" + n).value = (cfg.levelNames && cfg.levelNames[n]) || "";
    });
    document.querySelectorAll("[data-lvname]").forEach(function (el) {
      el.textContent = (cfg.levelNames && cfg.levelNames[el.dataset.lvname]) || "";
    });

    $("f-showLeaderboard").checked = cfg.showLeaderboard !== false;
    $("f-soundEnabled").checked = cfg.soundEnabled !== false;

    $("brand-tagline").textContent = "Kelola " + (cfg.appName || "aplikasi");
    var logo = $("brand-logo");
    if (cfg.logoUrl) logo.innerHTML = '<img src="' + cfg.logoUrl.replace(/"/g, "&quot;") + '" alt="">';
    else logo.textContent = (cfg.appName || "PB").split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();

    applyPreviewColors(cfg);
  }

  /* Pratinjau warna langsung saat diubah */
  colorFields.forEach(function (k) {
    $("f-" + k).addEventListener("input", function () {
      var cfg = currentConfig();
      cfg[k] = $("f-" + k).value;
      applyPreviewColors(cfg);
    });
  });

  /* ---------- Simpan ---------- */
  function collectPatch() {
    var patch = {};
    textFields.forEach(function (k) { patch[k] = $("f-" + k).value.trim(); });
    colorFields.forEach(function (k) { patch[k] = $("f-" + k).value; });

    var n = parseInt($("f-questionsPerRound").value, 10);
    patch.questionsPerRound = isNaN(n) ? 10 : Math.min(20, Math.max(5, n));

    var hp = parseInt($("f-hearts").value, 10);
    patch.hearts = isNaN(hp) ? 3 : Math.min(9, Math.max(1, hp));

    var levels = LEVELS.filter(function (i) { return $("f-lv" + i).checked; });
    patch.enabledLevels = levels.length ? levels : [1];

    patch.levelNames = {};
    LEVELS.forEach(function (i) {
      patch.levelNames[i] = $("f-lvName" + i).value.trim() || ("Level " + i);
    });
    patch.showLeaderboard = $("f-showLeaderboard").checked;
    patch.soundEnabled = $("f-soundEnabled").checked;
    return patch;
  }

  document.querySelectorAll("[data-save]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      saveOverride(collectPatch());
      fillForms();
      refreshExport();
      toast("Pengaturan tersimpan");
    });
  });

  /* ---------- Papan juara ---------- */
  function renderAdminBoard() {
    var el = $("admin-board-list");
    var board;
    try { board = JSON.parse(localStorage.getItem(LS_BOARD) || "[]"); } catch (e) { board = []; }
    if (!board.length) {
      el.innerHTML = '<p class="board-empty">Belum ada skor tersimpan di browser ini.</p>';
      return;
    }
    var h = "";
    board.forEach(function (row, i) {
      h += '<li><span class="board-rank">' + (i + 1) + '</span>' +
        '<span class="board-name">' + escHtml(row.name) + '<div class="board-level">Level ' + row.level + '</div></span>' +
        '<span class="board-score">' + row.score + '</span></li>';
    });
    el.innerHTML = "<ul class='board-list'>" + h + "</ul>";
  }

  $("btn-reset-board").addEventListener("click", function () {
    if (!confirm("Hapus semua skor di papan juara browser ini?")) return;
    localStorage.removeItem(LS_BOARD);
    renderAdminBoard();
    toast("Papan juara dikosongkan");
  });

  /* ---------- Keamanan ---------- */
  $("btn-change-pass").addEventListener("click", function () {
    var p1 = $("f-newPass").value, p2 = $("f-newPass2").value;
    if (p1.length < 6) { toast("Password minimal 6 karakter"); return; }
    if (p1 !== p2) { toast("Password tidak sama"); return; }
    localStorage.setItem(LS_PASS, p1);
    $("f-newPass").value = ""; $("f-newPass2").value = "";
    toast("Password diganti");
  });

  /* ---------- Backup ---------- */
  function refreshExport() {
    var cfg = currentConfig();
    delete cfg.adminPassword; // jangan tampilkan password di export
    $("f-export").value = JSON.stringify(cfg, null, 2);
  }

  $("btn-copy-export").addEventListener("click", function () {
    $("f-export").select();
    try {
      navigator.clipboard.writeText($("f-export").value).then(function () { toast("Disalin ke clipboard"); });
    } catch (e) {
      document.execCommand("copy");
      toast("Disalin ke clipboard");
    }
  });

  $("btn-import").addEventListener("click", function () {
    try {
      var obj = JSON.parse($("f-export").value);
      delete obj.adminPassword;
      localStorage.setItem(LS_KEY, JSON.stringify(obj));
      fillForms();
      toast("Konfigurasi diterapkan");
    } catch (e) {
      toast("JSON tidak valid");
    }
  });

  $("btn-reset-config").addEventListener("click", function () {
    if (!confirm("Hapus semua override dan kembali ke pengaturan default config.js?")) return;
    localStorage.removeItem(LS_KEY);
    fillForms();
    refreshExport();
    toast("Kembali ke default");
  });

  /* ---------- Init ---------- */
  if (isAuthed()) showAdmin(); else showLogin();
  applyPreviewColors(currentConfig());
})();
