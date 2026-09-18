/* Papa Bonski Matematika — Game (halaman pengguna) */

(function () {
  "use strict";

  /* ============ CONFIG: default (config.js) + override admin (localStorage) ============ */
  var LS_KEY = "pbm_config_override";
  var LS_BOARD = "pbm_leaderboard";
  var LS_NAME = "pbm_player_name";
  var LS_STARS = "pbm_total_stars";

  function loadConfig() {
    var base = window.APP_CONFIG || {};
    var over = {};
    try { over = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch (e) { over = {}; }
    var cfg = {};
    Object.keys(base).forEach(function (k) { cfg[k] = base[k]; });
    Object.keys(over).forEach(function (k) { cfg[k] = over[k]; });
    return cfg;
  }

  var CFG = loadConfig();

  /* ============ Terapkan branding ============ */
  function darken(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.max(0, (n >> 16) - amt), g = Math.max(0, ((n >> 8) & 255) - amt), b = Math.max(0, (n & 255) - amt);
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  }
  function soften(hex) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16), g = ((n >> 8) & 255), b = (n & 255);
    var mix = function (c) { return Math.round(c + (255 - c) * 0.85); };
    return "#" + ((mix(r) << 16) | (mix(g) << 8) | mix(b)).toString(16).padStart(6, "0");
  }

  function applyBranding() {
    var r = document.documentElement.style;
    r.setProperty("--brand", CFG.colorPrimary);
    r.setProperty("--brand-dark", darken(CFG.colorPrimary, 40));
    r.setProperty("--brand-soft", soften(CFG.colorPrimary));
    r.setProperty("--accent", CFG.colorAccent);
    r.setProperty("--accent-dark", darken(CFG.colorAccent, 90));
    r.setProperty("--accent-soft", soften(CFG.colorAccent));
    r.setProperty("--success", CFG.colorSuccess);
    r.setProperty("--success-soft", soften(CFG.colorSuccess));
    r.setProperty("--danger", CFG.colorDanger);
    r.setProperty("--danger-soft", soften(CFG.colorDanger));

    document.title = CFG.appName + " — Game Matematika Anak";
    setText("brand-name", CFG.appName);
    setText("brand-tagline", CFG.tagline);
    setText("footer-text", CFG.footerText);
    setText("ln-app", CFG.appName);

    var logo = document.getElementById("brand-logo");
    if (logo) {
      if (CFG.logoUrl) {
        logo.innerHTML = '<img src="' + escAttr(CFG.logoUrl) + '" alt="Logo ' + escAttr(CFG.appName) + '">';
      } else {
        var initials = (CFG.appName || "MQ").split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
        logo.textContent = initials;
      }
    }

    var wa = document.getElementById("wa-link");
    if (wa) {
      if (CFG.contactWa) {
        wa.href = "https://wa.me/" + CFG.contactWa.replace(/\D/g, "");
        wa.textContent = CFG.contactLabel || "Hubungi Kami";
        wa.style.display = "";
      } else {
        wa.style.display = "none";
      }
    }
  }

  function setText(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }
  function escHtml(s) { var d = document.createElement("div"); d.textContent = String(s); return d.innerHTML; }
  function escAttr(s) { return String(s).replace(/"/g, "&quot;"); }

  /* ============ Suara sederhana (WebAudio, tanpa file) ============ */
  var soundOn = CFG.soundEnabled !== false;
  var audioCtx = null;
  function beep(freq, dur, type) {
    if (!soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type || "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.12, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + dur);
    } catch (e) { /* audio tidak tersedia */ }
  }
  function sfxCorrect() { beep(660, .12); setTimeout(function () { beep(880, .18); }, 110); }
  function sfxWrong() { beep(200, .25, "square"); }

  /* ============ Confetti ringan ============ */
  function confetti() {
    var colors = [CFG.colorPrimary, CFG.colorAccent, CFG.colorSuccess, "#ff7bac"];
    for (var i = 0; i < 60; i++) {
      var c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = (2 + Math.random() * 2) + "s";
      c.style.animationDelay = (Math.random() * .6) + "s";
      c.style.borderRadius = Math.random() < .5 ? "50%" : "2px";
      document.body.appendChild(c);
      setTimeout(function (el) { return function () { el.remove(); }; }(c), 5000);
    }
  }

  /* ============ Leaderboard (localStorage) ============ */
  function getBoard() {
    try { return JSON.parse(localStorage.getItem(LS_BOARD) || "[]"); } catch (e) { return []; }
  }
  // extra opsional: { correct, total, stars, mode, focus }
  function saveScore(name, score, level, extra) {
    extra = extra || {};
    var board = getBoard();
    board.push({
      name: String(name).slice(0, 20), score: score, level: level, at: Date.now(),
      correct: extra.correct, total: extra.total, stars: extra.stars,
      mode: extra.mode, focus: extra.focus, best: extra.best
    });
    board.sort(function (a, b) { return b.score - a.score; });
    board = board.slice(0, 10);
    localStorage.setItem(LS_BOARD, JSON.stringify(board));
  }
  function modeLabel(m) {
    return m === "party" ? "Main Bareng" : m === "challenge" ? "Tantangan" : m === "solo" ? "Main Sendiri" : "Game";
  }
  function timeAgo(t) {
    if (!t) return "-";
    var s = Math.floor((Date.now() - t) / 1000);
    if (s < 60) return "baru saja";
    var m = Math.floor(s / 60); if (m < 60) return m + " menit lalu";
    var h = Math.floor(m / 60); if (h < 24) return h + " jam lalu";
    var d = Math.floor(h / 24); return d + " hari lalu";
  }
  function boardSubline(row) {
    var parts = [];
    if (row.level != null) parts.push(escHtml(CFG.levelNames[row.level] || ("Level " + row.level)));
    if (row.focus) parts.push(escHtml(row.focus));
    if (row.correct != null && row.total != null) parts.push(row.correct + "/" + row.total + " benar");
    parts.push("+" + row.score + " ⭐");
    return parts.join(" · ");
  }
  function renderBoard() {
    var wrapEl = document.getElementById("board-card");
    if (!wrapEl) return;
    if (!CFG.showLeaderboard) { wrapEl.style.display = "none"; return; }
    wrapEl.style.display = "";
    var list = document.getElementById("board-list");
    var board = getBoard();
    if (!board.length) {
      list.innerHTML = '<p class="board-empty">Belum ada skor. Jadilah yang pertama di papan juara!</p>';
      return;
    }
    var medals = ["🥇", "🥈", "🥉"];
    var h = "";
    board.forEach(function (row, i) {
      h += '<li class="board-row" data-i="' + i + '" tabindex="0" title="Lihat rincian">' +
        '<span class="board-rank">' + (medals[i] || (i + 1)) + '</span>' +
        '<span class="board-name">' + escHtml(row.name) + '<div class="board-level">' + boardSubline(row) + '</div></span>' +
        '<span class="board-score">⭐ ' + row.score + '</span></li>';
    });
    list.innerHTML = "<ul class='board-list'>" + h + "</ul>";
    list.querySelectorAll(".board-row").forEach(function (li) {
      var open = function () { showScoreDetail(board[parseInt(li.dataset.i, 10)]); };
      li.addEventListener("click", open);
      li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  }

  /* ============ Modal serbaguna + rincian skor ============ */
  function closeModal() {
    var m = document.getElementById("app-modal");
    if (m) m.remove();
    document.removeEventListener("keydown", escCloseModal);
  }
  function escCloseModal(e) { if (e.key === "Escape") closeModal(); }
  function openModal(inner) {
    closeModal();
    var ov = document.createElement("div");
    ov.className = "modal-ov"; ov.id = "app-modal";
    ov.innerHTML = '<div class="modal-card" role="dialog" aria-modal="true">' +
      '<button class="modal-x" aria-label="Tutup">✕</button>' + inner + '</div>';
    document.body.appendChild(ov);
    ov.addEventListener("click", function (e) { if (e.target === ov) closeModal(); });
    ov.querySelector(".modal-x").addEventListener("click", closeModal);
    var c = ov.querySelector("#modal-close");
    if (c) c.addEventListener("click", closeModal);
    document.addEventListener("keydown", escCloseModal);
  }
  function showScoreDetail(row) {
    if (!row) return;
    var stars = row.stars || 0;
    var starRow = "";
    for (var i = 1; i <= 5; i++) starRow += '<span class="' + (i <= stars ? "on" : "off") + '">★</span>';
    var cells = [
      ["Skor ronde", "+" + row.score + " ⭐"],
      ["Level", row.level != null ? "Level " + row.level + " · " + (CFG.levelNames[row.level] || "") : "-"],
      ["Fokus", row.focus || "Semua materi"],
      ["Benar", row.correct != null ? row.correct + " / " + row.total : "-"],
      ["Mode", modeLabel(row.mode)],
      ["Waktu", timeAgo(row.at)]
    ];
    if (row.best != null) cells.push(["Streak terbaik", row.best + "×"]);
    var grid = cells.map(function (c, i) {
      var wide = (cells.length % 2 === 1 && i === cells.length - 1) ? " stat-cell-wide" : "";
      return '<div class="stat-cell' + wide + '"><div class="stat-cell-k">' + escHtml(c[0]) + '</div>' +
        '<div class="stat-cell-v">' + escHtml(c[1]) + '</div></div>';
    }).join("");
    openModal(
      '<div class="detail-stars">' + (stars ? starRow : "") + '</div>' +
      '<h3 class="detail-name">' + escHtml(row.name) + '</h3>' +
      '<div class="detail-grid">' + grid + '</div>' +
      '<button class="btn btn-primary detail-close" id="modal-close">Tutup</button>'
    );
  }

  /* ============ State game ============ */
  var S = null;
  var playerName = "";
  var pendingChallenge = null;   // kode tantangan dari URL yang menunggu nama
  var CHALLENGE_QS = 10;         // jumlah soal tetap untuk mode tantangan (harus sama di semua HP)
  var LS_CH = "pbm_challenge_scores";
  var elWelcome = document.getElementById("screen-welcome");
  var elSelect = document.getElementById("screen-select");
  var elSetup = document.getElementById("screen-setup");
  var elGame = document.getElementById("screen-game");
  var elStage = document.getElementById("game-stage");

  var homeNav = document.getElementById("btn-home-nav");
  function showHomeNav(on) { if (homeNav) homeNav.style.display = on ? "" : "none"; }
  // Tombol home saat bermain: konfirmasi dulu agar ronde tidak hilang tak sengaja.
  function navHome() {
    var playing = elGame && elGame.style.display !== "none" && elStage && !elStage.querySelector(".result");
    if (playing && !window.confirm("Keluar dari permainan? Skor ronde ini tidak akan disimpan.")) return;
    goHome();
  }

  function hideAllScreens() {
    [elWelcome, elSelect, elSetup, elGame].forEach(function (el) { if (el) el.style.display = "none"; });
    showHomeNav(false);
  }

  function clampN(v) { return Math.min(20, Math.max(5, parseInt(v, 10) || 10)); }

  /* ============ Nama pemain ============ */
  function loadName() {
    try { return (localStorage.getItem(LS_NAME) || "").trim(); } catch (e) { return ""; }
  }
  function storeName(name) {
    try { localStorage.setItem(LS_NAME, name); } catch (e) { /* abaikan */ }
  }
  function renderGreeting() {
    var el = document.getElementById("greet-line");
    if (!el) return;
    if (!playerName) { el.style.display = "none"; return; }
    el.style.display = "";
    el.innerHTML = "Halo, " + escHtml(playerName) + "! 👋" +
      '<button type="button" class="greet-change" id="btn-change-name">ganti nama</button>';
    var ch = document.getElementById("btn-change-name");
    if (ch) ch.addEventListener("click", showWelcome);
  }
  function showWelcome() {
    hideAllScreens();
    elWelcome.style.display = "";
    var input = document.getElementById("welcome-name");
    if (input) { input.value = playerName; input.focus(); }
    var err = document.getElementById("welcome-error");
    if (err) err.textContent = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function enterFromWelcome(name) {
    name = (name || "").trim();
    var err = document.getElementById("welcome-error");
    if (!name) {
      if (err) err.textContent = "Tulis dulu namamu ya, biar bisa mulai bermain 🙂";
      var input = document.getElementById("welcome-name");
      if (input) input.focus();
      return;
    }
    playerName = name.slice(0, 20);
    storeName(playerName);
    if (err) err.textContent = "";
    elWelcome.style.display = "none";
    elSelect.style.display = "";
    renderGreeting();
    showLevelStep();
    if (pendingChallenge) { var c = pendingChallenge; pendingChallenge = null; showChallengeInvite(c); }
  }

  /* ============ Bintang terkumpul (header) ============ */
  var totalStars = 0;
  function loadStars() {
    try { return parseInt(localStorage.getItem(LS_STARS), 10) || 0; } catch (e) { return 0; }
  }
  function renderStars() {
    var el = document.getElementById("star-count");
    if (el) el.textContent = totalStars;
  }
  function addStars(n) {
    totalStars += n;
    try { localStorage.setItem(LS_STARS, String(totalStars)); } catch (e) { /* abaikan */ }
    renderStars();
    var badge = document.getElementById("star-badge");
    if (badge) { badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop"); }
  }

  /* ============ Maskot yang bereaksi ============ */
  var MASCOTS = {
    idle: ["🦉", "Ayo pikirkan baik-baik…"],
    correct: ["🥳", "Keren! Lanjut terus!"],
    wrong: ["🫣", "Hampir! Coba lagi ya."],
    combo: ["🔥", "Wah, kamu jago banget!"]
  };
  function setMascot(mood) {
    var face = document.getElementById("mascot-face");
    var say = document.getElementById("mascot-say");
    var m = MASCOTS[mood] || MASCOTS.idle;
    if (face) { face.textContent = m[0]; face.classList.remove("react"); void face.offsetWidth; face.classList.add("react"); }
    if (say) say.textContent = m[1];
  }

  /* ============ Timer bonus kecepatan ============ */
  var BONUS_MS = 8000;      // durasi bonus penuh
  var BONUS_MAX = 8;        // poin bonus maksimum
  var qStartAt = 0;
  var bonusTimer = null;
  function startBonusTimer() {
    qStartAt = Date.now();
    var bar = document.getElementById("bonus-bar");
    if (bar) {
      bar.style.transition = "none";
      bar.style.width = "100%";
      void bar.offsetWidth;
      bar.style.transition = "width " + BONUS_MS + "ms linear";
      bar.style.width = "0%";
    }
  }
  function stopBonusTimer() {
    var bar = document.getElementById("bonus-bar");
    if (bar) {
      var w = getComputedStyle(bar).width;
      bar.style.transition = "none";
      bar.style.width = w;
    }
    if (bonusTimer) { clearTimeout(bonusTimer); bonusTimer = null; }
  }
  function currentBonus() {
    var elapsed = Date.now() - qStartAt;
    var frac = Math.max(0, 1 - elapsed / BONUS_MS);
    return Math.round(frac * BONUS_MAX);
  }

  /* ============ Angka melayang "+N" ============ */
  function floatPoints(text) {
    var host = document.getElementById("mascot") || elStage;
    if (!host) return;
    var el = document.createElement("div");
    el.className = "float-pts";
    el.textContent = text;
    host.appendChild(el);
    setTimeout(function () { el.remove(); }, 1200);
  }

  /* ============ Nyawa / hati ============ */
  var START_LIVES = Math.max(1, parseInt(CFG.hearts, 10) || 3);
  function renderHearts(hit) {
    var el = document.getElementById("hud-hearts");
    if (!el) return;
    var h = "";
    for (var k = 0; k < START_LIVES; k++) h += '<span class="heart' + (k < S.lives ? "" : " lost") + '">❤</span>';
    el.innerHTML = h;
    if (hit) { el.classList.remove("hit"); void el.offsetWidth; el.classList.add("hit"); }
  }

  /* ============ Lencana pencapaian ============ */
  var LS_ACH = "pbm_achievements";
  var ACHIEVEMENTS = [
    { id: "perfect", icon: "🏆", name: "Sempurna!", desc: "Semua jawaban benar dalam satu ronde", test: function (r) { return r.correct === r.total && r.total > 0; } },
    { id: "streak5", icon: "🔥", name: "Beruntun 5!", desc: "Benar 5 kali berturut-turut", test: function (r) { return r.best >= 5; } },
    { id: "speedster", icon: "⚡", name: "Si Kilat", desc: "Dapat bonus kecepatan 3 kali", test: function (r) { return r.speedy >= 3; } },
    { id: "flawless", icon: "🛡️", name: "Tanpa Luka", desc: "Selesai tanpa kehilangan nyawa", test: function (r) { return r.lives === r.startLives && r.finishedAll; } },
    { id: "century", icon: "💯", name: "Kolektor Bintang", desc: "Kumpulkan 100 bintang total", test: function (r) { return r.totalStars >= 100; } }
  ];
  function loadAch() {
    try { return JSON.parse(localStorage.getItem(LS_ACH) || "{}"); } catch (e) { return {}; }
  }
  function saveAch(obj) {
    try { localStorage.setItem(LS_ACH, JSON.stringify(obj)); } catch (e) { /* abaikan */ }
  }
  function renderAchievements() {
    var host = document.getElementById("ach-collection");
    if (!host) return;
    var owned = loadAch();
    var h = "";
    ACHIEVEMENTS.forEach(function (a) {
      var got = !!owned[a.id];
      h += '<div class="ach-item' + (got ? " got" : "") + '" title="' + escAttr(a.desc) + '">' +
        '<span class="ach-ico">' + (got ? a.icon : "🔒") + '</span>' +
        '<span class="ach-name">' + escHtml(a.name) + '</span></div>';
    });
    host.innerHTML = h;
  }
  // Kembalikan daftar lencana yang BARU terbuka pada ronde ini (dan simpan).
  function unlockAchievements(r) {
    var owned = loadAch();
    var fresh = [];
    ACHIEVEMENTS.forEach(function (a) {
      if (a.test(r) && !owned[a.id]) { owned[a.id] = Date.now(); fresh.push(a); }
    });
    if (fresh.length) saveAch(owned);
    return fresh;
  }

  /* ============ Hitung mundur "3…2…1… Mulai!" ============ */
  function runCountdown(done) {
    var seq = ["3", "2", "1", "Mulai!"];
    var ov = document.createElement("div");
    ov.className = "countdown-ov";
    document.body.appendChild(ov);
    var idx = 0;
    (function tick() {
      if (idx >= seq.length) { ov.remove(); done(); return; }
      var isGo = idx === seq.length - 1;
      ov.innerHTML = '<div class="countdown-num' + (isGo ? " go" : "") + '">' + seq[idx] + '</div>';
      beep(isGo ? 720 : 440, isGo ? 0.22 : 0.14);
      idx++;
      setTimeout(tick, isGo ? 620 : 720);
    })();
  }

  /* Katalog permainan: tiap topik = satu "game" (nama topik cocok dengan questions.js) */
  var CATALOG = {
    1: [
      { topic: "Perbandingan", icon: "🔢", sub: "Lebih besar / kecil" },
      { topic: "Ganjil dan genap", icon: "⚖️", sub: "Ganjil atau genap?" },
      { topic: "Urutan bilangan", icon: "🔜", sub: "Sebelum & sesudah" },
      { topic: "Penjumlahan", icon: "➕", sub: "Tambah bilangan" },
      { topic: "Pengurangan", icon: "➖", sub: "Kurang bilangan" },
      { topic: "Pola angka", icon: "🔁", sub: "Lanjutkan pola" },
      { topic: "Nilai tempat", icon: "🏠", sub: "Satuan, puluhan, ratusan" },
      { topic: "Soal cerita", icon: "📖", sub: "Cerita sehari-hari" },
      { topic: "Bilangan terbesar & terkecil", icon: "📊", sub: "Mana paling besar?" },
      { topic: "Melengkapi", icon: "🧩", sub: "Isi yang kosong" },
      { topic: "Bentuk", icon: "🔺", sub: "Sisi bangun datar" },
      { topic: "Penjumlahan berturut", icon: "3️⃣", sub: "Tambah 3 bilangan" },
      { topic: "Jam sederhana", icon: "🕐", sub: "Baca jam dinding" },
      { topic: "Uang sederhana", icon: "🪙", sub: "Belanja & kembalian" },
      { topic: "Menghitung benda", icon: "🍎", sub: "Hitung gambarnya" },
      { topic: "Banyak & sedikit", icon: "👀", sub: "Siapa lebih banyak?" }
    ],
    2: [
      { topic: "Perkalian", icon: "✖️", sub: "Kali bilangan" },
      { topic: "Pembagian", icon: "➗", sub: "Bagi bilangan" },
      { topic: "Pembagian bersisa", icon: "🧩", sub: "Bagi dengan sisa" },
      { topic: "Waktu", icon: "⏰", sub: "Jam & durasi" },
      { topic: "Kalender", icon: "📅", sub: "Hari & tanggal" },
      { topic: "Uang", icon: "💰", sub: "Belanja & kembalian" },
      { topic: "Pengukuran", icon: "📏", sub: "Panjang (m, cm)" },
      { topic: "Berat", icon: "🏋️", sub: "Berat (kg, gram)" },
      { topic: "Soal cerita", icon: "📖", sub: "Cerita sehari-hari" },
      { topic: "Kelipatan", icon: "⏭️", sub: "Kelipatan bilangan" },
      { topic: "Faktor", icon: "🔍", sub: "Pembagi bilangan" },
      { topic: "Pembulatan", icon: "📍", sub: "Ke puluhan/ratusan" },
      { topic: "Kapasitas", icon: "🥤", sub: "Liter & ml" },
      { topic: "Pecahan sederhana", icon: "🍰", sub: "Setengah & seperempat" },
      { topic: "Keliling bangun", icon: "🟦", sub: "Persegi & persegi panjang" },
      { topic: "Konversi waktu", icon: "🕰️", sub: "Jam, menit, detik" },
      { topic: "Suhu", icon: "🌡️", sub: "Naik & turun suhu" }
    ],
    3: [
      { topic: "Pecahan", icon: "🍕", sub: "Bagian dari utuh" },
      { topic: "Desimal", icon: "🔟", sub: "Bilangan desimal" },
      { topic: "Persentase", icon: "💯", sub: "Persen (%)" },
      { topic: "Diskon", icon: "🏷️", sub: "Potongan harga" },
      { topic: "Operasi campuran", icon: "🧮", sub: "Urutan operasi" },
      { topic: "Geometri", icon: "📐", sub: "Keliling & luas" },
      { topic: "Logika", icon: "🧠", sub: "Berpikir logis" },
      { topic: "Data dan grafik", icon: "📊", sub: "Baca data" },
      { topic: "Bilangan bulat", icon: "🔻", sub: "Positif & negatif" },
      { topic: "Rata-rata", icon: "📈", sub: "Nilai rata-rata" },
      { topic: "KPK dan FPB", icon: "🔗", sub: "Kelipatan & faktor" },
      { topic: "Perpangkatan", icon: "⏫", sub: "Kuadrat & akar" },
      { topic: "Bilangan prima", icon: "🔱", sub: "Prima atau bukan" },
      { topic: "Skala dan denah", icon: "🗺️", sub: "Jarak pada peta" },
      { topic: "Rasio", icon: "⚖️", sub: "Perbandingan a : b" },
      { topic: "Luas segitiga", icon: "🔺", sub: "Alas × tinggi ÷ 2" }
    ],
    4: [
      { topic: "Aljabar", icon: "🔤", sub: "Cari nilai x" },
      { topic: "Perbandingan senilai", icon: "⚖️", sub: "Proporsi harga" },
      { topic: "Volume", icon: "📦", sub: "Kubus & balok" },
      { topic: "Lingkaran", icon: "⭕", sub: "Keliling & luas" },
      { topic: "Kecepatan", icon: "🏎️", sub: "Jarak, waktu" },
      { topic: "Statistika", icon: "📉", sub: "Modus & median" },
      { topic: "Bilangan Romawi", icon: "🏛️", sub: "I, V, X, L, C" },
      { topic: "Sudut", icon: "📐", sub: "Penyiku & pelurus" },
      { topic: "Persen lanjut", icon: "💯", sub: "Berapa persen?" },
      { topic: "Peluang", icon: "🎲", sub: "Kemungkinan kejadian" },
      { topic: "Koordinat", icon: "🧭", sub: "Titik (x, y)" },
      { topic: "Deret bilangan", icon: "➿", sub: "Barisan & jumlahnya" },
      { topic: "Untung dan rugi", icon: "💹", sub: "Jual beli" }
    ]
  };

  /* Fokus materi: kelompok topik di tiap level (langkah 2 sebelum daftar game) */
  var FOCUS = {
    1: [
      { name: "Hitung Dasar", icon: "🧮", sub: "Tambah & kurang", topics: ["Penjumlahan", "Pengurangan", "Penjumlahan berturut", "Melengkapi", "Menghitung benda"] },
      { name: "Kenal Bilangan", icon: "🔢", sub: "Mengenal angka", topics: ["Perbandingan", "Ganjil dan genap", "Urutan bilangan", "Nilai tempat", "Bilangan terbesar & terkecil", "Banyak & sedikit"] },
      { name: "Pola & Bentuk", icon: "🧩", sub: "Pola dan bangun datar", topics: ["Pola angka", "Bentuk"] },
      { name: "Sehari-hari", icon: "🏠", sub: "Jam & uang", topics: ["Jam sederhana", "Uang sederhana"] },
      { name: "Soal Cerita", icon: "📖", sub: "Cerita sehari-hari", topics: ["Soal cerita"] }
    ],
    2: [
      { name: "Kali & Bagi", icon: "✖️", sub: "Perkalian & pembagian", topics: ["Perkalian", "Pembagian", "Pembagian bersisa"] },
      { name: "Waktu & Uang", icon: "⏰", sub: "Jam, tanggal, belanja", topics: ["Waktu", "Kalender", "Uang", "Konversi waktu"] },
      { name: "Pengukuran", icon: "📏", sub: "Panjang, berat, isi, suhu", topics: ["Pengukuran", "Berat", "Kapasitas", "Suhu"] },
      { name: "Kelipatan & Faktor", icon: "🔍", sub: "Kelipatan, faktor, bulat", topics: ["Kelipatan", "Faktor", "Pembulatan"] },
      { name: "Pecahan & Bangun", icon: "🍰", sub: "Pecahan awal & keliling", topics: ["Pecahan sederhana", "Keliling bangun"] },
      { name: "Soal Cerita", icon: "📖", sub: "Cerita sehari-hari", topics: ["Soal cerita"] }
    ],
    3: [
      { name: "Pecahan & Desimal", icon: "🍕", sub: "Bagian dari utuh", topics: ["Pecahan", "Desimal"] },
      { name: "Persen & Diskon", icon: "💯", sub: "Persen dan potongan", topics: ["Persentase", "Diskon"] },
      { name: "Operasi Bilangan", icon: "🧮", sub: "Campuran, pangkat, prima", topics: ["Operasi campuran", "Bilangan bulat", "KPK dan FPB", "Perpangkatan", "Bilangan prima"] },
      { name: "Geometri", icon: "📐", sub: "Keliling & luas", topics: ["Geometri", "Luas segitiga"] },
      { name: "Skala & Rasio", icon: "🗺️", sub: "Denah & perbandingan", topics: ["Skala dan denah", "Rasio"] },
      { name: "Data & Logika", icon: "📊", sub: "Grafik, rata-rata, logika", topics: ["Logika", "Data dan grafik", "Rata-rata"] }
    ],
    4: [
      { name: "Aljabar & Pola", icon: "🔤", sub: "Nilai x, proporsi, deret", topics: ["Aljabar", "Perbandingan senilai", "Deret bilangan"] },
      { name: "Geometri Lanjut", icon: "📐", sub: "Volume, lingkaran, koordinat", topics: ["Volume", "Lingkaran", "Sudut", "Koordinat"] },
      { name: "Matematika Terapan", icon: "🏎️", sub: "Kecepatan, persen, jual beli", topics: ["Kecepatan", "Persen lanjut", "Untung dan rugi"] },
      { name: "Data & Peluang", icon: "📉", sub: "Statistika, peluang, Romawi", topics: ["Statistika", "Bilangan Romawi", "Peluang"] }
    ]
  };

  function focusList(lv) { return FOCUS[lv] || []; }
  function gameInfo(lv, topic) {
    var found = null;
    (CATALOG[lv] || []).forEach(function (g) { if (g.topic === topic) found = g; });
    return found || { topic: topic, icon: "🎲", sub: "" };
  }

  /* ---------- Langkah 1: pilih level ---------- */
  var elStepLevel = document.getElementById("step-level");
  var elStepFocus = document.getElementById("step-focus");
  var elStepGames = document.getElementById("step-games");

  function showStep(which) {
    if (elStepLevel) elStepLevel.style.display = which === "level" ? "" : "none";
    if (elStepFocus) elStepFocus.style.display = which === "focus" ? "" : "none";
    if (elStepGames) elStepGames.style.display = which === "games" ? "" : "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function stepBar(active) {
    var h = "";
    for (var i = 1; i <= 3; i++) {
      if (i > 1) h += '<span class="step-line"></span>';
      h += '<span class="step-dot' + (i <= active ? " on" : "") + '">' + i + '</span>';
    }
    return '<div class="step-bar">' + h + "</div>";
  }

  function renderLevelGrid() {
    var host = document.getElementById("level-grid");
    if (!host) return;
    host.innerHTML = (CFG.enabledLevels || [1, 2, 3, 4]).map(function (lv) {
      var fc = focusList(lv).length;
      return '<button class="pick-card lv-' + lv + '" data-level="' + lv + '">' +
        '<span class="pick-badge">' + lv + '</span>' +
        '<span class="pick-name">' + escHtml(CFG.levelNames[lv]) + '</span>' +
        '<span class="pick-sub">' + escHtml((CFG.levelAges && CFG.levelAges[lv]) || "") + '</span>' +
        '<span class="pick-count">' + fc + ' fokus materi</span></button>';
    }).join("");
    host.querySelectorAll(".pick-card").forEach(function (btn) {
      btn.addEventListener("click", function () { showFocusStep(parseInt(btn.dataset.level, 10)); });
    });
  }

  /* ---------- Langkah 2: pilih fokus materi ---------- */
  function showFocusStep(lv) {
    var list = focusList(lv);
    var h = stepBar(2) +
      '<button class="btn btn-sm setup-back" id="focus-back">← Ganti level</button>' +
      '<div class="pick-head"><span class="pick-crumb lv-' + lv + '">Level ' + lv + ' · ' + escHtml(CFG.levelNames[lv]) + '</span>' +
      '<h2 class="pick-title">Pilih Fokus Materi</h2>' +
      '<p class="pick-desc">Mau latihan yang mana dulu? Pilih satu kelompok materi.</p></div>' +
      '<div class="pick-grid">';
    list.forEach(function (f, i) {
      h += '<button class="pick-card focus lv-' + lv + '" data-i="' + i + '">' +
        '<span class="pick-ico">' + f.icon + '</span>' +
        '<span class="pick-name">' + escHtml(f.name) + '</span>' +
        '<span class="pick-sub">' + escHtml(f.sub) + '</span>' +
        '<span class="pick-count">' + f.topics.length + ' game</span></button>';
    });
    h += '<button class="pick-card focus mix lv-' + lv + '" data-mix="1">' +
      '<span class="pick-ico">🎲</span>' +
      '<span class="pick-name">Campur Semua</span>' +
      '<span class="pick-sub">Semua materi level ini</span>' +
      '<span class="pick-count">langsung main</span></button>' +
      '</div>';

    elStepFocus.innerHTML = h;
    document.getElementById("focus-back").addEventListener("click", showLevelStep);
    elStepFocus.querySelectorAll(".pick-card").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.dataset.mix) startSolo(lv);
        else showGamesStep(lv, parseInt(btn.dataset.i, 10));
      });
    });
    showStep("focus");
  }

  /* ---------- Langkah 3: pilih game ---------- */
  function showGamesStep(lv, fi) {
    var f = focusList(lv)[fi];
    if (!f) { showFocusStep(lv); return; }
    var h = stepBar(3) +
      '<button class="btn btn-sm setup-back" id="games-back">← Ganti fokus</button>' +
      '<div class="pick-head"><span class="pick-crumb lv-' + lv + '">Level ' + lv + ' · ' + escHtml(f.name) + '</span>' +
      '<h2 class="pick-title">Pilih Game</h2>' +
      '<p class="pick-desc">Ketuk salah satu untuk mulai bermain.</p></div>' +
      '<div class="game-grid">' +
      '<button class="game-card mix lv-' + lv + '" data-mix="1">' +
      '<span class="game-ico">🎲</span><span class="game-name">Campur</span>' +
      '<span class="game-sub">Semua materi fokus ini</span></button>';
    f.topics.forEach(function (t) {
      var g = gameInfo(lv, t);
      h += '<button class="game-card lv-' + lv + '" data-topic="' + escAttr(t) + '">' +
        '<span class="game-ico">' + g.icon + '</span>' +
        '<span class="game-name">' + escHtml(t) + '</span>' +
        '<span class="game-sub">' + escHtml(g.sub) + '</span></button>';
    });
    h += "</div>";

    elStepGames.innerHTML = h;
    document.getElementById("games-back").addEventListener("click", function () { showFocusStep(lv); });
    elStepGames.querySelectorAll(".game-card").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.dataset.mix) startFocus(lv, fi);
        else startTopic(lv, btn.dataset.topic);
      });
    });
    showStep("games");
  }

  function showLevelStep() {
    renderBoard();
    renderAchievements();
    showStep("level");
  }

  function makePlayer(name) { return { name: name || "Kamu", score: 0, correct: 0, best: 0, streak: 0, speedy: 0 }; }
  function curP() { return S.players[S.t % S.players.length]; }

  function beginGame(init) {
    S = {
      mode: init.mode, level: init.level, code: init.code || null,
      topic: init.topic || null, title: init.title || null,
      focus: (init.focus === 0 || init.focus) ? init.focus : null,
      players: init.players, perPlayer: init.perPlayer, qs: init.qs,
      t: 0, answered: false,
      lives: init.lives || 0, dead: false
    };
    elSelect.style.display = "none";
    elSetup.style.display = "none";
    elGame.style.display = "";
    elStage.innerHTML = "";
    showHomeNav(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    runCountdown(function () {
      if (S.mode === "party") showHandoff(); else renderQuestion();
    });
  }

  function startSolo(level) {
    var n = clampN(CFG.questionsPerRound);
    beginGame({
      mode: "solo", level: level,
      players: [makePlayer(playerName)], perPlayer: n,
      qs: window.MFQ_QUESTIONS.build(level, n),
      lives: START_LIVES
    });
  }

  function startTopic(level, topic) {
    var n = clampN(CFG.questionsPerRound);
    beginGame({
      mode: "solo", level: level, topic: topic, title: topic,
      players: [makePlayer(playerName)], perPlayer: n,
      qs: window.MFQ_QUESTIONS.buildByTopic(level, topic, n),
      lives: START_LIVES
    });
  }

  /* Campur dalam satu fokus: soal diambil acak dari topik-topik fokus tsb. */
  function startFocus(level, fi) {
    var f = focusList(level)[fi];
    if (!f) { startSolo(level); return; }
    var n = clampN(CFG.questionsPerRound);
    var qs = [];
    for (var i = 0; i < n; i++) {
      var t = f.topics[Math.floor(Math.random() * f.topics.length)];
      qs.push(window.MFQ_QUESTIONS.buildByTopic(level, t, 1)[0]);
    }
    beginGame({
      mode: "solo", level: level, focus: fi, title: f.name,
      players: [makePlayer(playerName)], perPlayer: n,
      qs: qs, lives: START_LIVES
    });
  }

  function startParty(level, names) {
    var n = clampN(CFG.questionsPerRound);
    var players = names.map(makePlayer);
    beginGame({
      mode: "party", level: level,
      players: players, perPlayer: n,
      qs: window.MFQ_QUESTIONS.build(level, players.length * n)
    });
  }

  function startChallenge(code) {
    var level = codeLevel(code);
    beginGame({
      mode: "challenge", level: level, code: code,
      players: [makePlayer(playerName)], perPlayer: CHALLENGE_QS,
      qs: window.MFQ_QUESTIONS.build(level, CHALLENGE_QS, code)
    });
  }

  /* Layar serah-terima antar pemain (Main Bareng) */
  function showHandoff() {
    var p = curP();
    var round = Math.floor(S.t / S.players.length) + 1;
    var stand = S.players.slice().map(function (pl, idx) { return { pl: pl, idx: idx }; })
      .sort(function (a, b) { return b.pl.score - a.pl.score; });
    var rows = stand.map(function (o) {
      return '<li' + (o.idx === (S.t % S.players.length) ? ' class="me"' : '') + '>' +
        '<span>' + escHtml(o.pl.name) + '</span><span class="pill">' + o.pl.score + '</span></li>';
    }).join("");
    elStage.innerHTML =
      '<div class="card handoff">' +
      '<div class="handoff-emoji">🙌</div>' +
      '<p class="handoff-turn">Giliran <strong>' + escHtml(p.name) + '</strong>!</p>' +
      '<p class="handoff-sub">Serahkan perangkat ke ' + escHtml(p.name) + '. Soal ke-' + round + ' dari ' + S.perPlayer + '.</p>' +
      '<ul class="handoff-board">' + rows + '</ul>' +
      '<button class="btn btn-primary btn-big" id="btn-turn-go">Mulai giliranku 🚀</button>' +
      '</div>';
    document.getElementById("btn-turn-go").addEventListener("click", renderQuestion);
    document.getElementById("btn-turn-go").focus();
  }

  function renderQuestion() {
    var p = curP();
    var q = S.qs[S.t];
    var qNo = Math.floor(S.t / S.players.length) + 1;      // soal ke-berapa bagi pemain ini
    var pct = Math.round((qNo - 1) / S.perPlayer * 100);
    var flames = "";
    for (var f = 0; f < Math.min(p.streak, 5); f++) flames += "🔥";

    var leftInfo, tag = "";
    if (S.mode === "party") {
      leftInfo = '<span class="turn-name">' + escHtml(p.name) + '</span> · Soal ' + qNo + '/' + S.perPlayer;
    } else {
      var label = S.title ? escHtml(S.title) : ('Level ' + S.level + ' · ' + escHtml(CFG.levelNames[S.level]));
      leftInfo = label + ' — Soal ' + qNo + ' dari ' + S.perPlayer +
        (S.mode === "solo" ? '<span class="hearts" id="hud-hearts"></span>' : '');
      if (S.mode === "challenge") tag = '<div class="challenge-strip">🎯 Tantangan <strong>' + escHtml(S.code) + '</strong> — soal ini sama untuk semua pemain</div>';
    }

    var h = tag +
      '<div class="hud"><span>' + leftInfo + '</span>' +
      '<span>Skor<span class="pill" id="hud-score">' + p.score + '</span> Streak<span class="pill">' + p.streak + ' <span class="flames">' + flames + '</span></span></span></div>' +
      '<div class="progress"><div style="width:' + pct + '%"></div></div>' +
      (S.mode === "party" ? partyMiniBoard() : '') +
      '<div id="mascot" class="mascot">' +
      '<div id="mascot-face" class="mascot-face">🦉</div>' +
      '<div class="mascot-bubble" id="mascot-say">Ayo pikirkan baik-baik…</div>' +
      '</div>' +
      '<div class="card q-card">' +
      '<span class="topic-tag">' + escHtml(q.topic) + '</span>' +
      '<p class="question">' + escHtml(q.q) + '</p>' +
      '<div class="bonus-wrap" title="Jawab cepat untuk bonus bintang!">' +
      '<span class="bonus-label">⚡ Bonus kecepatan</span>' +
      '<div class="bonus-track"><div class="bonus-fill" id="bonus-bar"></div></div></div>' +
      '<div class="answers">';
    q.opts.forEach(function (o, idx) {
      h += '<button class="answer" data-idx="' + idx + '">' + escHtml(o) + '</button>';
    });
    h += '</div><div id="fb-slot"></div></div>';
    h += '<div class="q-back"><button class="btn btn-ghost btn-sm" id="btn-q-back">← Kembali</button></div>';
    elStage.innerHTML = h;
    elStage.querySelectorAll(".answer").forEach(function (btn) {
      btn.addEventListener("click", function () { answer(parseInt(btn.dataset.idx, 10)); });
    });
    document.getElementById("btn-q-back").addEventListener("click", navHome);
    if (S.mode === "solo") renderHearts();
    startBonusTimer();
  }

  function partyMiniBoard() {
    var meIdx = S.t % S.players.length;
    return '<div class="party-strip">' + S.players.map(function (pl, idx) {
      return '<span class="party-chip' + (idx === meIdx ? " on" : "") + '">' +
        escHtml(pl.name) + ' <b>' + pl.score + '</b></span>';
    }).join("") + '</div>';
  }

  function answer(idx) {
    if (S.answered) return;
    S.answered = true;
    stopBonusTimer();
    var p = curP();
    var q = S.qs[S.t];
    var ok = idx === q.ans;

    elStage.querySelectorAll(".answer").forEach(function (btn, j) {
      btn.classList.add("locked");
      if (j === q.ans) btn.classList.add("correct");
      else if (j === idx) { btn.classList.add("wrong"); btn.classList.add("shake"); }
    });

    var gained = 0;
    if (ok) {
      var bonus = currentBonus();
      if (bonus > 0) p.speedy++;
      gained = 10 + Math.min(p.streak, 5) + bonus;
      p.score += gained;
      p.correct++;
      p.streak++;
      p.best = Math.max(p.best, p.streak);
      if (S.mode !== "party") addStars(gained);
      floatPoints("+" + gained + (bonus > 0 ? " ⚡" : ""));
      setMascot(p.streak >= 3 ? "combo" : "correct");
      var hud = document.getElementById("hud-score");
      if (hud) { hud.textContent = p.score; hud.classList.remove("bump"); void hud.offsetWidth; hud.classList.add("bump"); }
      sfxCorrect();
    } else {
      p.streak = 0;
      if (S.mode === "solo") {
        S.lives = Math.max(0, S.lives - 1);
        renderHearts(true);
        if (S.lives <= 0) S.dead = true;
      }
      setMascot("wrong");
      sfxWrong();
    }

    var last = S.dead || S.t === S.qs.length - 1;
    var nextLabel = S.dead ? "Lihat hasil 💔" :
      (last ? "Lihat hasil" : (S.mode === "party" ? "Giliran berikutnya →" : "Soal berikutnya →"));
    var fb =
      '<div class="feedback ' + (ok ? "ok" : "no") + '">' +
      '<p class="fb-title">' + (ok ? "Benar! Hebat! +" + gained + " ⭐" : (S.dead ? "Nyawamu habis! Jawabannya: " + escHtml(q.opts[q.ans]) : "Belum tepat. Jawabannya: " + escHtml(q.opts[q.ans]))) + '</p>' +
      '<p class="fb-ex"><strong>Cara mengerjakan:</strong> ' + escHtml(q.ex) + '</p></div>' +
      '<div style="margin-top:14px;text-align:right">' +
      '<button class="btn btn-primary" id="btn-next">' + nextLabel + '</button></div>';
    document.getElementById("fb-slot").innerHTML = fb;
    document.getElementById("btn-next").addEventListener("click", nextQuestion);
    document.getElementById("btn-next").focus();
  }

  function nextQuestion() {
    if (S.dead) { finish(); return; }
    S.t++;
    S.answered = false;
    if (S.t >= S.qs.length) { finish(); return; }
    if (S.mode === "party") showHandoff(); else renderQuestion();
  }

  function finish() {
    if (S.mode === "party") return finishParty();
    if (S.mode === "challenge") return finishChallenge();
    return finishSolo();
  }

  function finishSolo() {
    var me = S.players[0];
    var finishedAll = !S.dead;
    var ratio = me.correct / S.perPlayer;
    var stars = ratio >= 0.95 ? 5 : ratio >= 0.8 ? 4 : ratio >= 0.6 ? 3 : ratio >= 0.35 ? 2 : 1;
    var msg = S.dead ? "Yah, nyawamu habis! Jangan menyerah — coba lagi dan kamu pasti lebih jago." :
      stars >= 4 ? "Luar biasa! Kamu sudah sangat menguasai materi level ini." :
        stars === 3 ? "Bagus! Sedikit lagi latihan dan kamu pasti makin lancar." :
          "Tidak apa-apa, mencoba lagi itu keren. Ayo main sekali lagi!";
    if (stars >= 4 && !S.dead) confetti();

    var starHtml = "";
    for (var i = 1; i <= 5; i++) starHtml += '<span class="' + (i <= stars ? "on" : "off") + '">★</span>';

    var fresh = unlockAchievements({
      correct: me.correct, total: S.perPlayer, best: me.best,
      speedy: me.speedy, lives: S.lives, startLives: START_LIVES,
      finishedAll: finishedAll, totalStars: totalStars
    });
    var achHtml = fresh.length ?
      '<div class="badges-panel"><div class="badges-head">🎉 Lencana baru terbuka!</div>' +
      fresh.map(function (a) {
        return '<div class="badge-new"><span class="badge-ico">' + a.icon + '</span>' +
          '<span class="badge-txt"><strong>' + escHtml(a.name) + '</strong>' +
          '<span class="badge-desc">' + escHtml(a.desc) + '</span></span></div>';
      }).join("") + '</div>' : "";

    if (CFG.showLeaderboard && playerName) saveScore(playerName, me.score, S.level, {
      correct: me.correct, total: S.perPlayer, stars: stars, mode: S.mode, focus: S.title || "Semua materi", best: me.best
    });
    var boardForm = CFG.showLeaderboard && playerName ?
      '<p class="result-saved">⭐ Skor <strong>' + escHtml(playerName) + '</strong> tersimpan di papan juara!</p>' : "";

    elStage.innerHTML =
      '<div class="card result">' +
      (S.dead ? '<div class="gameover-tag">💔 Nyawa habis</div>' : '') +
      '<div class="stars">' + starHtml + '</div>' +
      '<div class="result-score">Skor: ' + me.score + '</div>' +
      '<div class="result-meta">Benar ' + me.correct + ' dari ' + S.perPlayer + ' soal · streak terbaik ' + me.best + '</div>' +
      '<p class="result-msg">' + msg + '</p>' +
      achHtml + boardForm +
      '<div class="result-actions">' +
      '<button class="btn btn-primary" id="btn-again">Main lagi</button>' +
      '<button class="btn" id="btn-home">Ganti level</button>' +
      '</div></div>';

    var replayLevel = S.level, replayTopic = S.topic, replayFocus = S.focus;
    document.getElementById("btn-again").addEventListener("click", function () {
      if (replayTopic) startTopic(replayLevel, replayTopic);
      else if (replayFocus !== null && replayFocus !== undefined) startFocus(replayLevel, replayFocus);
      else startSolo(replayLevel);
    });
    document.getElementById("btn-home").addEventListener("click", goHome);
  }

  function finishParty() {
    var ranked = S.players.slice().sort(function (a, b) { return b.score - a.score; });
    var top = ranked[0].score;
    var winners = ranked.filter(function (p) { return p.score === top; });
    var medals = ["🥇", "🥈", "🥉", "🏅"];
    confetti();

    var rows = ranked.map(function (p, i) {
      return '<li class="podium-row' + (p.score === top ? " win" : "") + '" data-i="' + i + '" tabindex="0" title="Lihat rincian">' +
        '<span class="podium-medal">' + (medals[i] || "🏅") + '</span>' +
        '<span class="podium-name">' + escHtml(p.name) + '<div class="podium-meta">Benar ' + p.correct + '/' + S.perPlayer + ' · streak ' + p.best + '</div></span>' +
        '<span class="podium-score">' + p.score + '</span></li>';
    }).join("");

    var champ = winners.length > 1 ?
      "Seri! " + winners.map(function (p) { return escHtml(p.name); }).join(" & ") + " sama-sama juara! 🎉" :
      "🏆 Juaranya: " + escHtml(ranked[0].name) + "!";

    // Simpan semua skor pemain ke papan juara.
    if (CFG.showLeaderboard) S.players.forEach(function (p) {
      var pr = p.correct / S.perPlayer;
      var pst = pr >= 0.95 ? 5 : pr >= 0.8 ? 4 : pr >= 0.6 ? 3 : pr >= 0.35 ? 2 : 1;
      saveScore(p.name, p.score, S.level, {
        correct: p.correct, total: S.perPlayer, stars: pst, mode: "party", focus: "Semua materi", best: p.best
      });
    });

    elStage.innerHTML =
      '<div class="card result">' +
      '<div class="party-champ">' + champ + '</div>' +
      '<ul class="podium">' + rows + '</ul>' +
      '<div class="result-actions">' +
      '<button class="btn btn-primary" id="btn-again">Main bareng lagi</button>' +
      '<button class="btn" id="btn-home">Selesai</button>' +
      '</div></div>';

    var lv = S.level, per = S.perPlayer;
    elStage.querySelectorAll(".podium-row").forEach(function (li) {
      var open = function () {
        var p = ranked[parseInt(li.dataset.i, 10)];
        var pr = p.correct / per;
        var pst = pr >= 0.95 ? 5 : pr >= 0.8 ? 4 : pr >= 0.6 ? 3 : pr >= 0.35 ? 2 : 1;
        showScoreDetail({ name: p.name, score: p.score, level: lv, focus: "Semua materi", correct: p.correct, total: per, stars: pst, mode: "party", best: p.best, at: Date.now() });
      };
      li.addEventListener("click", open);
      li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });

    document.getElementById("btn-again").addEventListener("click", function () {
      startParty(S.level, S.players.map(function (p) { return p.name; }));
    });
    document.getElementById("btn-home").addEventListener("click", goHome);
  }

  function finishChallenge() {
    var me = S.players[0];
    var ratio = me.correct / S.perPlayer;
    var chStars = ratio >= 0.95 ? 5 : ratio >= 0.8 ? 4 : ratio >= 0.6 ? 3 : ratio >= 0.35 ? 2 : 1;
    confetti();
    saveChallengeScore(S.code, playerName, me.score, {
      correct: me.correct, total: S.perPlayer, stars: chStars, level: S.level, best: me.best, focus: "Tantangan " + S.code
    });
    var board = getChallengeBoard(S.code);
    var myRank = board.filter(function (r) { return r.score > me.score; }).length + 1;

    var medals = ["🥇", "🥈", "🥉"];
    var rows = board.slice(0, 8).map(function (r, i) {
      var sub = [r.correct != null ? r.correct + "/" + r.total + " benar" : "", r.at ? timeAgo(r.at) : ""].filter(Boolean).join(" · ");
      return '<li class="board-list-row board-row" data-i="' + i + '" tabindex="0" title="Lihat rincian">' +
        '<span class="board-rank">' + (medals[i] || (i + 1)) + '</span>' +
        '<span class="board-name">' + escHtml(r.name) + (sub ? '<div class="board-level">' + escHtml(sub) + '</div>' : '') + '</span>' +
        '<span class="board-score">⭐ ' + r.score + '</span></li>';
    }).join("");

    var link = challengeLink(S.code);
    var shareText = "Aku dapat " + me.score + " di Tantangan " + S.code + " (" + (CFG.levelNames[S.level] || ("Level " + S.level)) + ")! Bisa kalahkan aku? " + link;

    elStage.innerHTML =
      '<div class="card result">' +
      '<div class="challenge-badge">🎯 Tantangan ' + escHtml(S.code) + '</div>' +
      '<div class="result-score">Skor: ' + me.score + '</div>' +
      '<div class="result-meta">Benar ' + me.correct + ' dari ' + S.perPlayer + ' soal · peringkat #' + myRank + ' di HP ini</div>' +
      '<p class="result-msg">Soal ini sama untuk semua yang pakai kode <strong>' + escHtml(S.code) + '</strong>. Bagikan skormu dan tantang temanmu!</p>' +
      '<div class="ch-board"><div class="ch-board-head">🏆 Skor Tantangan ' + escHtml(S.code) + '</div><ul class="board-list">' + rows + '</ul></div>' +
      '<div class="result-actions">' +
      '<button class="btn btn-accent" id="btn-share-ch">📤 Bagikan skor</button>' +
      '<button class="btn btn-primary" id="btn-again">Coba lagi</button>' +
      '<button class="btn" id="btn-home">Selesai</button>' +
      '</div></div>';

    elStage.querySelectorAll(".ch-board .board-row").forEach(function (li) {
      var open = function () {
        var r = board[parseInt(li.dataset.i, 10)];
        showScoreDetail({ name: r.name, score: r.score, level: r.level, focus: r.focus || ("Tantangan " + S.code), correct: r.correct, total: r.total, stars: r.stars, mode: "challenge", best: r.best, at: r.at });
      };
      li.addEventListener("click", open);
      li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });

    document.getElementById("btn-share-ch").addEventListener("click", function () { shareChallenge(shareText, link); });
    document.getElementById("btn-again").addEventListener("click", function () { startChallenge(S.code); });
    document.getElementById("btn-home").addEventListener("click", goHome);
  }

  /* ============ Layar setup ============ */
  function showSetup(html) {
    elWelcome.style.display = "none";
    elSelect.style.display = "none";
    elGame.style.display = "none";
    elSetup.style.display = "";
    elSetup.innerHTML = html;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---- Main Bareng: setup pemain ---- */
  function showPartySetup() {
    var levels = (CFG.enabledLevels || [1, 2, 3, 4]);
    var levelOpts = levels.map(function (lv) {
      return '<option value="' + lv + '">Level ' + lv + ' · ' + escHtml(CFG.levelNames[lv]) + ' (' + escHtml(CFG.levelAges[lv]) + ')</option>';
    }).join("");
    showSetup(
      '<div class="card">' +
      '<button class="btn btn-ghost btn-sm setup-back" id="setup-back">← Kembali</button>' +
      '<h2 class="setup-title">👥 Main Bareng</h2>' +
      '<p class="setup-desc">Masukkan nama pemain (2–4 orang). Semua bermain bergiliran di perangkat ini, lalu lihat siapa juaranya!</p>' +
      '<div class="field"><label for="party-level">Level soal</label><select id="party-level">' + levelOpts + '</select></div>' +
      '<div class="field"><label>Nama pemain</label><div id="party-names"></div>' +
      '<button class="btn btn-sm" id="party-add" type="button">+ Tambah pemain</button></div>' +
      '<p id="party-err" class="welcome-error"></p>' +
      '<button class="btn btn-primary btn-big" id="party-start">Mulai Main Bareng 🎮</button>' +
      '</div>'
    );
    var namesHost = document.getElementById("party-names");
    function addRow(val) {
      if (namesHost.children.length >= 4) return;
      var row = document.createElement("div");
      row.className = "party-name-row";
      row.innerHTML = '<input type="text" maxlength="16" placeholder="Nama pemain ' + (namesHost.children.length + 1) + '" value="' + escAttr(val || "") + '">' +
        '<button class="btn btn-sm party-del" type="button" title="Hapus" aria-label="Hapus pemain">✕</button>';
      row.querySelector(".party-del").addEventListener("click", function () {
        if (namesHost.children.length > 2) row.remove();
      });
      namesHost.appendChild(row);
    }
    addRow(playerName); addRow("");
    document.getElementById("party-add").addEventListener("click", function () { addRow(""); });
    document.getElementById("setup-back").addEventListener("click", goHome);
    document.getElementById("party-start").addEventListener("click", function () {
      var vals = [].slice.call(namesHost.querySelectorAll("input")).map(function (i) { return i.value.trim(); }).filter(Boolean);
      if (vals.length < 2) { document.getElementById("party-err").textContent = "Butuh minimal 2 pemain ya 🙂"; return; }
      startParty(parseInt(document.getElementById("party-level").value, 10), vals);
    });
  }

  /* ---- Tantangan Teman: buat / ikut ---- */
  function showChallengeHub() {
    var levels = (CFG.enabledLevels || [1, 2, 3, 4]);
    var levelBtns = levels.map(function (lv) {
      return '<button class="btn ch-level" data-lv="' + lv + '">Level ' + lv + ' · ' + escHtml(CFG.levelNames[lv]) + '</button>';
    }).join("");
    showSetup(
      '<div class="card">' +
      '<button class="btn btn-ghost btn-sm setup-back" id="setup-back">← Kembali</button>' +
      '<h2 class="setup-title">🎯 Tantangan Teman</h2>' +
      '<p class="setup-desc">Buat tantangan lalu bagikan kodenya. Teman di HP lain akan dapat soal yang <strong>sama persis</strong> — cocok untuk guru menantang seisi kelas!</p>' +
      '<div class="field"><label>1. Pilih level & buat kode</label><div class="ch-levels">' + levelBtns + '</div></div>' +
      '<div id="ch-created"></div>' +
      '<hr class="ch-sep">' +
      '<div class="field"><label for="ch-join">Punya kode dari teman?</label>' +
      '<div style="display:flex;gap:8px"><input type="text" id="ch-join" placeholder="mis. 2PZ7K" maxlength="8" style="text-transform:uppercase">' +
      '<button class="btn btn-accent" id="ch-join-btn" style="flex:none">Ikut</button></div></div>' +
      '</div>'
    );
    document.getElementById("setup-back").addEventListener("click", goHome);
    elSetup.querySelectorAll(".ch-level").forEach(function (b) {
      b.addEventListener("click", function () { createChallenge(parseInt(b.dataset.lv, 10)); });
    });
    document.getElementById("ch-join-btn").addEventListener("click", function () {
      var code = (document.getElementById("ch-join").value || "").trim().toUpperCase();
      if (code.length >= 2) startChallenge(code);
    });
  }

  function createChallenge(level) {
    var code = genCode(level);
    var link = challengeLink(code);
    var host = document.getElementById("ch-created");
    host.innerHTML =
      '<div class="ch-result">' +
      '<div class="ch-code-big">' + escHtml(code) + '</div>' +
      '<p class="ch-code-cap">Kode tantangan · Level ' + level + ' — ' + escHtml(CFG.levelNames[level]) + '</p>' +
      '<div class="ch-link"><input type="text" id="ch-link" readonly value="' + escAttr(link) + '"><button class="btn btn-sm" id="ch-copy">Salin</button></div>' +
      '<div class="result-actions" style="margin-top:12px">' +
      '<button class="btn btn-accent" id="ch-share">📤 Bagikan</button>' +
      '<button class="btn btn-primary" id="ch-play">Main sekarang</button>' +
      '</div></div>';
    var shareText = "Ayo ikut Tantangan " + code + " di " + (CFG.appName || "Papa Bonski Matematika") + "! Soal sama untuk semua pemain. " + link;
    document.getElementById("ch-copy").addEventListener("click", function () { copyText(link, this); });
    document.getElementById("ch-share").addEventListener("click", function () { shareChallenge(shareText); });
    document.getElementById("ch-play").addEventListener("click", function () { startChallenge(code); });
  }

  function showChallengeInvite(code) {
    var level = codeLevel(code);
    showSetup(
      '<div class="card" style="text-align:center">' +
      '<div class="welcome-star">🎯</div>' +
      '<h2 class="setup-title">Kamu ditantang!</h2>' +
      '<p class="setup-desc">Tantangan <strong>' + escHtml(code) + '</strong> · Level ' + level + ' — ' + escHtml(CFG.levelNames[level]) + '.<br>Soal ini sama untuk semua pemain. Ayo tunjukkan kemampuanmu!</p>' +
      '<div class="result-actions" style="justify-content:center">' +
      '<button class="btn btn-primary btn-big" id="ch-inv-go">Mulai Tantangan 🚀</button>' +
      '<button class="btn" id="ch-inv-home">Nanti dulu</button>' +
      '</div></div>'
    );
    document.getElementById("ch-inv-go").addEventListener("click", function () { startChallenge(code); });
    document.getElementById("ch-inv-home").addEventListener("click", goHome);
  }

  /* ---- Kode tantangan: buat & baca ---- */
  function clampLevel(lv) { lv = parseInt(lv, 10) || 1; return Math.min(4, Math.max(1, lv)); }
  function codeLevel(code) { return clampLevel(parseInt(String(code).charAt(0), 10)); }
  function genCode(level) {
    var chars = "ACDEFGHJKLMNPQRSTUVWXYZ2345679"; // tanpa karakter membingungkan (O/0, I/1, B/8)
    var s = "";
    for (var i = 0; i < 4; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return String(clampLevel(level)) + s;
  }
  function challengeLink(code) {
    return location.origin + location.pathname + "?ch=" + encodeURIComponent(code);
  }

  /* ---- Papan skor per-tantangan (localStorage, per perangkat) ---- */
  function loadChAll() { try { return JSON.parse(localStorage.getItem(LS_CH) || "{}"); } catch (e) { return {}; } }
  function getChallengeBoard(code) {
    var arr = (loadChAll()[code] || []).slice();
    arr.sort(function (a, b) { return b.score - a.score; });
    return arr;
  }
  function saveChallengeScore(code, name, score, extra) {
    extra = extra || {};
    var all = loadChAll();
    var arr = all[code] || [];
    arr.push({
      name: (name || "Kamu").slice(0, 20), score: score, at: Date.now(),
      correct: extra.correct, total: extra.total, stars: extra.stars,
      level: extra.level, best: extra.best, mode: "challenge", focus: extra.focus
    });
    arr.sort(function (a, b) { return b.score - a.score; });
    all[code] = arr.slice(0, 20);
    try { localStorage.setItem(LS_CH, JSON.stringify(all)); } catch (e) { /* abaikan */ }
  }

  /* ---- Bagikan & salin ---- */
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand("copy"); } catch (e) { /* abaikan */ }
    ta.remove();
  }
  function copyText(text, btn) {
    var done = function () {
      if (!btn) return;
      var t = btn.textContent; btn.textContent = "Tersalin!";
      setTimeout(function () { btn.textContent = t; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  }
  function shareChallenge(text) {
    if (navigator.share) {
      navigator.share({ title: CFG.appName || "Papa Bonski Matematika", text: text }).catch(function () { });
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
    }
  }

  function goHome() {
    elGame.style.display = "none";
    elSetup.style.display = "none";
    elSetup.innerHTML = "";
    elSelect.style.display = "";
    showHomeNav(false);
    showLevelStep();
  }

  /* ============ Tombol suara ============ */
  var soundBtn = document.getElementById("btn-sound");
  function renderSoundBtn() {
    soundBtn.textContent = soundOn ? "🔊" : "🔇";
    soundBtn.setAttribute("aria-label", soundOn ? "Matikan suara" : "Nyalakan suara");
  }
  soundBtn.addEventListener("click", function () { soundOn = !soundOn; renderSoundBtn(); });

  /* ============ Init ============ */
  applyBranding();
  renderLevelGrid();
  renderSoundBtn();
  totalStars = loadStars();
  renderStars();

  var nameForm = document.getElementById("name-form");
  if (nameForm) {
    nameForm.addEventListener("submit", function (e) {
      e.preventDefault();
      enterFromWelcome(document.getElementById("welcome-name").value);
    });
  }

  if (homeNav) homeNav.addEventListener("click", navHome);

  var refreshBtn = document.getElementById("btn-board-refresh");
  if (refreshBtn) refreshBtn.addEventListener("click", function () {
    renderBoard();
    refreshBtn.classList.remove("spin"); void refreshBtn.offsetWidth; refreshBtn.classList.add("spin");
  });

  var partyBtn = document.getElementById("btn-mode-party");
  if (partyBtn) partyBtn.addEventListener("click", showPartySetup);
  var chBtn = document.getElementById("btn-mode-challenge");
  if (chBtn) chBtn.addEventListener("click", showChallengeHub);

  // Undangan tantangan lewat URL: index.html?ch=KODE
  var chParam = "";
  try { chParam = (new URLSearchParams(location.search).get("ch") || "").trim().toUpperCase(); } catch (e) { chParam = ""; }

  playerName = loadName();
  // Pintu masuk aplikasi: langsung minta nama.
  if (chParam.length >= 2) pendingChallenge = chParam;
  showWelcome();
})();
