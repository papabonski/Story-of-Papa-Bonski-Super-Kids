/* Papa Bonski Mandarin — mesin game */
(() => {
  "use strict";

  // ---------- Util ----------
  const $ = (id) => document.getElementById(id);
  const shuf = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const pick = (a, n) => shuf(a).slice(0, n);

  // Ambil n soal dari sebuah kolam. Kalau kolamnya lebih kecil dari n, kolam
  // didaur ulang (diacak lagi tiap putaran) — ini wajib untuk materi yang
  // memang terbatas, misalnya angka 1–10 tak mungkin punya 30 soal unik.
  // Batas antar-putaran ditukar supaya tak ada soal sama berturut-turut.
  function series(pool, n) {
    if (!pool.length) return [];
    const out = [];
    while (out.length < n) {
      const batch = shuf(pool);
      if (out.length && batch.length > 1 && batch[0] === out[out.length - 1]) {
        [batch[0], batch[1]] = [batch[1], batch[0]];
      }
      out.push(...batch.slice(0, n - out.length));
    }
    return out;
  }
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  // "nǐ hǎo" -> "nihao" — supaya anak boleh mengetik tanpa tanda nada
  const plain = (s) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\s'’]/g, "");
  const dayKey = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const store = {
    get(k, d) {
      try { const v = localStorage.getItem("pbm." + k); return v === null ? d : JSON.parse(v); }
      catch { return d; }
    },
    set(k, v) {
      try { localStorage.setItem("pbm." + k, JSON.stringify(v)); } catch { /* mode privat */ }
    }
  };

  // ---------- Konfigurasi merek (whitelabel) ----------
  const getCfg = () => (window.BrandKit ? window.BrandKit.get()
    : { brand: {}, defaults: { level: "beginner", focus: "all" }, games: { disabled: [] } });
  const disabledGames = () => (getCfg().games && getCfg().games.disabled) || [];
  const isEnabled = (id) => !disabledGames().includes(id);
  // Jumlah soal per ronde (bisa diatur admin).
  const nQ = () => {
    const n = parseInt(getCfg().defaults.questions, 10);
    return Number.isFinite(n) && n >= 5 && n <= 50 ? n : 30;
  };

  function applyBrandText() {
    const b = getCfg().brand || {};
    const name = $("brandName"), tag = $("brandTag"), logo = $("brandLogo");
    if (name && b.name) name.textContent = b.name;
    if (tag && b.tagline) tag.textContent = b.tagline;
    if (logo) {
      logo.replaceChildren();
      if (b.logoImage) {
        const img = document.createElement("img");
        img.src = b.logoImage;
        img.alt = "";
        img.className = "brand-logo-img";
        logo.appendChild(img);
      } else logo.textContent = b.logo || "";
    }
    if (b.name) document.title = b.name + " — 18 Mini Game";
  }

  // ---------- Suara ----------
  let soundOn = store.get("sound", true);
  let audioCtx = null;
  let installPrompt = null;
  function beep(ok) {
    if (!soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = "sine";
      if (ok) { osc.frequency.setValueAtTime(660, t); osc.frequency.setValueAtTime(880, t + 0.09); }
      else { osc.frequency.setValueAtTime(320, t); osc.frequency.setValueAtTime(240, t + 0.09); }
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.start(t); osc.stop(t + 0.22);
    } catch { /* audio tidak tersedia */ }
  }

  const canSpeak = "speechSynthesis" in window;
  function speak(text) {
    if (!canSpeak || !soundOn) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN"; u.rate = 0.8;
      const v = speechSynthesis.getVoices().find((x) => /^zh/i.test(x.lang));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch { /* TTS gagal */ }
  }
  if (canSpeak) speechSynthesis.getVoices();

  // ---------- Efek visual ----------
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let fxLayer = null;
  const getFx = () => {
    if (!fxLayer) {
      fxLayer = document.createElement("div");
      fxLayer.className = "fx-layer";
      fxLayer.setAttribute("aria-hidden", "true");
      document.body.appendChild(fxLayer);
    }
    return fxLayer;
  };

  // Semburan emoji dari titik (x,y) di layar — dipakai saat jawaban benar.
  function burst(x, y, emojis, count) {
    if (reduceMotion) return;
    const layer = getFx();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "fx-bit";
      s.textContent = emojis[i % emojis.length];
      const ang = (Math.PI * 2 * i) / count + Math.random();
      const dist = 40 + Math.random() * 60;
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      s.style.setProperty("--dy", (Math.sin(ang) * dist - 40) + "px");
      s.style.fontSize = 14 + Math.random() * 12 + "px";
      layer.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  }
  const burstFrom = (el, emojis, count) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, emojis, count);
  };

  // Hujan confetti dari atas layar — untuk skor sempurna.
  function confetti() {
    if (reduceMotion) return;
    const layer = getFx();
    const cols = ["#2BB3A3", "#F4695F", "#F5B335", "#5B3E9E", "#3D8B6B"];
    for (let i = 0; i < 60; i++) {
      const s = document.createElement("span");
      s.className = "fx-confetti";
      s.style.left = Math.random() * 100 + "vw";
      s.style.background = cols[i % cols.length];
      s.style.animationDelay = Math.random() * 0.6 + "s";
      s.style.animationDuration = 1.6 + Math.random() * 1.4 + "s";
      layer.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  }

  // ---------- Level ----------
  // Level bukan sekadar label: ia mengubah jumlah pilihan, panjang kata,
  // rentang angka, panjang kalimat, dan jumlah kartu memori.
  const LEVELS = [
    ["beginner", "Beginner", "Kata pendek, angka 1–10, 3 pilihan"],
    ["intermediate", "Intermediate", "Kata lebih panjang, angka 6–50, 4 pilihan"],
    ["advanced", "Advanced", "Kalimat panjang, angka 31–100, 5 pilihan"]
  ];
  const LEVEL_CFG = {
    beginner:     { opts: 3, maxHanzi: 1, num: [1, 10],  sent: [2, 3], pairs: 6 },
    intermediate: { opts: 4, maxHanzi: 9, num: [6, 50],  sent: [2, 4], pairs: 6 },
    advanced:     { opts: 5, minHanzi: 2, num: [31, 100], sent: [4, 9], pairs: 8 }
  };
  let level = store.get("level", getCfg().defaults.level);
  if (!LEVEL_CFG[level]) level = "beginner";
  const cfg = () => LEVEL_CFG[level];
  const nOpt = () => cfg().opts;

  // Kolam data yang menyempit/melebar mengikuti level.
  const vocabPool = () => {
    const c = cfg();
    const out = VOCAB.filter(
      (v) => (!c.maxHanzi || v[0].length <= c.maxHanzi) && (!c.minHanzi || v[0].length >= c.minHanzi)
    );
    return out.length >= nOpt() + 2 ? out : VOCAB;
  };
  const numPool = () => {
    const [lo, hi] = cfg().num;
    const out = NUMS.filter((n) => n[0] >= lo && n[0] <= hi);
    return out.length >= nOpt() + 1 ? out : NUMS;
  };
  const sentPool = () => {
    const [lo, hi] = cfg().sent;
    const out = SENTS.filter((s) => s[0].length >= lo && s[0].length <= hi);
    return out.length >= 4 ? out : SENTS;
  };

  // ---------- Katalog game ----------
  // [id, nama, deskripsi, emoji, warnaLatar, warnaIkon]
  const GAMES = [
    ["vocab",    "Tebak kata",      "Hanzi ke arti",            "🎴", "#DCF3EF", "#1E8C80"],
    ["pinyin",   "Tebak pinyin",    "Cara baca hanzi",          "🔤", "#E3EEFB", "#215B96"],
    ["reverse",  "Arti ke hanzi",   "Ingat tulisannya",         "🀄", "#FDE6E3", "#A83324"],
    ["memory",   "Kartu memori",    "Pasangkan hanzi & arti",   "🧠", "#EFE7FB", "#5B3E9E"],
    ["tone",     "Tebak nada",      "Nada 1–4",                 "🎵", "#DCF3EF", "#1E8C80"],
    ["listen",   "Dengar & tebak",  "Latihan menyimak",         "🔊", "#E3EEFB", "#215B96"],
    ["typing",   "Ketik pinyin",    "Tulis cara bacanya",       "⌨️", "#E7F3DC", "#3D6B14"],
    ["number",   "Cocokkan angka",  "Angka dalam hanzi",        "🔢", "#FDF0D8", "#8A5A08"],
    ["math",     "Matematika",      "Berhitung pakai hanzi",    "➕", "#FDE6E3", "#A83324"],
    ["days",     "Hari & waktu",    "Kalender",                 "📅", "#E7F3DC", "#3D6B14"],
    ["time",     "Jam berapa",      "Membaca jam",              "🕘", "#E3EEFB", "#215B96"],
    ["measure",  "Kata ukur",       "个 只 本 条",               "📏", "#FDF0D8", "#8A5A08"],
    ["opposite", "Lawan kata",      "Kata berlawanan",          "↔️", "#EFE7FB", "#5B3E9E"],
    ["sentence", "Susun kalimat",   "Pola kalimat",             "🧩", "#FDE6E3", "#A83324"],
    ["greeting", "Salam sopan",     "Sapaan sehari-hari",       "🙋", "#DCF3EF", "#1E8C80"],
    ["dialog",   "Lengkapi dialog", "Percakapan",               "💬", "#E7F3DC", "#3D6B14"],
    ["speed",    "Lomba cepat",     "60 detik adu cepat",       "⚡", "#FDF0D8", "#8A5A08"],
    ["mixed",    "Kuis campuran",   "Semua materi diacak",      "🏆", "#EFE7FB", "#5B3E9E"]
  ];
  const TITLES = {};
  GAMES.forEach((g) => (TITLES[g[0]] = g[1]));

  // [id, nama, deskripsi, daftar game]
  const FOCUS = [
    ["all", "Semua", "Semua materi", GAMES.map((g) => g[0])],
    ["kosakata", "Kosakata", "Kata, arti, tulisan", ["vocab", "pinyin", "reverse", "memory"]],
    ["dengar", "Dengar & Ucap", "Nada, menyimak, pelafalan", ["tone", "listen", "typing"]],
    ["angka", "Angka & Waktu", "Berhitung, hari, jam", ["number", "math", "days", "time"]],
    ["tatabahasa", "Tata Bahasa", "Kata ukur, lawan kata, kalimat", ["measure", "opposite", "sentence"]],
    ["percakapan", "Percakapan", "Sapaan & dialog", ["greeting", "dialog"]],
    ["tantangan", "Tantangan", "Adu cepat & kuis campuran", ["speed", "mixed"]]
  ];
  let focus = store.get("focus", getCfg().defaults.focus);
  if (!FOCUS.some((f) => f[0] === focus)) focus = "all";
  const focusOf = (id) => FOCUS.find((f) => f[0] === id);

  // Pemilihan level & fokus berjalan selangkah demi selangkah: 1 = level,
  // 2 = fokus, 3 = selesai (daftar game tampil). Anak yang sudah pernah memilih
  // langsung mendarat di langkah 3 — pilihannya tersimpan, jadi tak perlu
  // mengulang wizard tiap kali keluar dari game.
  let step = store.get("setup", false) ? 3 : 1;

  // ---------- Pemain & papan bintang ----------
  let player = store.get("player", null);
  let avatar = store.get("avatar", AVATARS[0]);
  let board = store.get("board", {});
  let sessions = store.get("sessions", []);

  function addStars(n, last) {
    if (!player) return;
    const key = player.toLowerCase();
    const row = board[key] || { name: player, stars: 0 };
    row.name = player;
    row.avatar = avatar;
    row.stars += n;
    row.last = last;
    board[key] = row;
    store.set("board", board);
    sessions.push({ ...last, mode: last.mode || mode || "", player, avatar, stars: n, at: new Date().toISOString(), day: dayKey() });
    sessions = sessions.slice(-120);
    store.set("sessions", sessions);
    paintStars();
  }
  const myStars = () => (player && board[player.toLowerCase()] ? board[player.toLowerCase()].stars : 0);
  function paintStars() {
    $("starTotal").textContent = myStars();
    $("headAvatar").textContent = player ? avatar : "";
    $("helloAvatar").textContent = avatar;
  }

  let bestByGame = store.get("best", {});
  const saveBest = (m, stars) => {
    if ((bestByGame[m] || 0) < stars) { bestByGame[m] = stars; store.set("best", bestByGame); }
  };

  function renderAvatarPick() {
    $("avatarPick").innerHTML = AVATARS.map((a) =>
      `<button type="button" class="avatar-opt" role="radio" data-avatar="${a}" aria-checked="${a === avatar}" aria-label="Avatar ${a}">${a}</button>`
    ).join("");
  }

  // ---------- Pembuat soal ----------
  const opt = (html, correct) => ({ html, correct });

  // Pengecoh harus beda arti DAN beda hanzi dari jawaban, supaya tidak pernah
  // muncul dua opsi yang sama-sama benar.
  const distractors = (q, n, poolFn) =>
    pick((poolFn || vocabPool)().filter((v) => v[2] !== q[2] && v[0] !== q[0]), n);

  // Greeting & dialog hanya menyimpan 3 pengecoh per soal, sedangkan Advanced
  // butuh 4. Ambil tambahan dari jawaban soal lain, buang yang kembar dengan
  // jawaban benar supaya tidak ada dua opsi yang sama.
  function padWrong(own, answer, allAnswers) {
    const want = nOpt() - 1;
    const seen = new Set([answer]);
    const out = [];
    for (const list of [shuf(own), shuf(allAnswers)]) {
      for (const o of list) {
        if (out.length >= want) break;
        if (seen.has(o)) continue;
        seen.add(o);
        out.push(o);
      }
    }
    return out;
  }

  const QUIZ = {
    vocab: {
      build: () => series(vocabPool(), nQ()),
      make: (q) => ({
        prompt: "Apa arti kata ini?",
        big: q[0], sub: q[1], speak: q[0],
        layout: "list",
        options: shuf(distractors(q, nOpt() - 1).concat([q])).map((v) => opt(esc(v[2]), v[2] === q[2])),
        explain: `Jawabannya: ${q[2]} (${q[0]} ${q[1]}).`
      })
    },

    pinyin: {
      build: () => series(vocabPool(), nQ()),
      make: (q) => ({
        prompt: `Bagaimana cara membaca hanzi ini? (artinya: ${q[2]})`,
        big: q[0], speak: q[0],
        layout: "list",
        options: shuf(distractors(q, nOpt() - 1).concat([q])).map((v) => opt(esc(v[1]), v[1] === q[1])),
        explain: `Bacanya: ${q[1]}.`
      })
    },

    reverse: {
      build: () => series(vocabPool(), nQ()),
      make: (q) => ({
        prompt: "Mana hanzi yang tepat?",
        big: q[2],
        layout: "grid",
        options: shuf(distractors(q, nOpt() - 1).concat([q])).map((v) =>
          opt(`<span class="opt-main" style="font-size:25px">${esc(v[0])}</span><span class="opt-sub">${esc(v[1])}</span>`, v[0] === q[0])
        ),
        explain: `Jawabannya: ${q[0]} (${q[1]}).`
      })
    },

    // Nada selalu 4 pilihan — itu memang jumlah nada dalam Mandarin.
    tone: {
      build: () => series(TONES, nQ()),
      make: (q) => ({
        prompt: `Nada berapakah kata ini? (artinya: ${q[1]})`,
        big: q[0], speak: q[0],
        layout: "grid",
        options: [[1, "Datar tinggi"], [2, "Naik"], [3, "Turun lalu naik"], [4, "Turun tajam"]]
          .map((t) => opt(`<span class="opt-main">Nada ${t[0]}</span><span class="opt-sub">${t[1]}</span>`, t[0] === q[2])),
        explain: `${q[0]} adalah nada ${q[2]}.`
      })
    },

    number: {
      build: () => series(numPool(), nQ()),
      make: (q) => {
        const wrong = pick(numPool().filter((n) => n[0] !== q[0]), nOpt() - 1);
        return {
          prompt: "Mana hanzi untuk angka ini?",
          big: String(q[0]),
          layout: "grid",
          options: shuf(wrong.concat([q])).map((n) =>
            opt(`<span class="opt-main" style="font-size:25px">${esc(n[1])}</span><span class="opt-sub">${esc(n[2])}</span>`, n[0] === q[0])
          ),
          explain: `${q[0]} = ${q[1]} (${q[2]}).`
        };
      }
    },

    math: {
      // Susun dulu SEMUA kombinasi valid yang unik, lalu serahkan ke series()
      // seperti game lain — kalau diundi acak, soal yang sama bisa muncul
      // berturut-turut karena kombinasinya terbatas.
      build: () => {
        const [lo, hi] = cfg().num;
        const min = Math.max(1, lo - 4);
        const pool = [];
        const maxOperand = Math.min(50, hi);
        for (let a = 1; a <= maxOperand; a++) {
          for (let b = 1; b <= maxOperand; b++) {
            for (const plus of [true, false]) {
              if (!plus && a <= b) continue;
              const r = plus ? a + b : a - b;
              if (r < min || r > hi) continue;
              if (!NUMS.some((n) => n[0] === r)) continue;
              pool.push({ a, b, plus, r });
            }
          }
        }
        return series(pool.length ? pool : [{ a: 1, b: 1, plus: true, r: 2 }], nQ());
      },
      make: (q) => {
        const han = (n) => (NUMS.find((x) => x[0] === n) || [n, String(n), ""])[1];
        const pin = (n) => (NUMS.find((x) => x[0] === n) || [n, "", ""])[2];
        const right = NUMS.find((n) => n[0] === q.r) || [q.r, String(q.r), ""];
        const wrong = pick(numPool().filter((n) => n[0] !== q.r), nOpt() - 1);
        return {
          prompt: "Berapa hasilnya? Pilih hanzi yang benar.",
          big: `${han(q.a)} ${q.plus ? "+" : "−"} ${han(q.b)} = ?`,
          sub: `${pin(q.a)} ${q.plus ? "jiā" : "jiǎn"} ${pin(q.b)}`,
          layout: "grid",
          options: shuf(wrong.concat([right])).map((n) =>
            opt(`<span class="opt-main" style="font-size:25px">${esc(n[1])}</span><span class="opt-sub">${esc(n[2])}</span>`, n[0] === q.r)
          ),
          explain: `${q.a} ${q.plus ? "+" : "−"} ${q.b} = ${q.r} (${right[1]} / ${right[2]}).`
        };
      }
    },

    measure: {
      build: () => series(MEAS, nQ()),
      make: (q) => {
        const all = Object.keys(MEXP);
        const wrong = pick(all.filter((o) => o !== q[3]), nOpt() - 1);
        return {
          prompt: `Pilih kata ukur yang tepat untuk ${q[2]}:`,
          big: `一 <span style="color:var(--coral)">___</span> ${esc(q[0])} <span style="font-size:15px;color:var(--text-secondary);font-style:italic">(${esc(q[1])})</span>`,
          rawBig: true,
          layout: "grid",
          options: shuf(wrong.concat([q[3]])).map((o) =>
            opt(`<span class="opt-main" style="font-size:25px">${o}</span>`, o === q[3])
          ),
          explain: `Yang tepat: 一${q[3]}${q[0]}. ${MEXP[q[3]]}`
        };
      }
    },

    days: {
      build: () => series(DAYS, nQ()),
      make: (q) => {
        const wrong = pick(DAYS.filter((d) => d[1] !== q[1] && d[0] !== q[0]), nOpt() - 1);
        return {
          prompt: "Apa bahasa Mandarin dari:",
          big: q[0],
          layout: "list",
          options: shuf(wrong.concat([q])).map((d) =>
            opt(`<span style="font-size:19px">${esc(d[1])}</span> <span class="opt-sub" style="display:inline">${esc(d[2])}</span>`, d[1] === q[1])
          ),
          explain: `Jawabannya: ${q[1]} (${q[2]}).`
        };
      }
    },

    time: {
      build: () => series(TIMES, nQ()),
      make: (q) => {
        const wrong = pick(TIMES.filter((t) => t[2] !== q[2]), nOpt() - 1);
        return {
          prompt: "Jam berapa ini dalam bahasa Mandarin?",
          big: `${q[0]}:${String(q[1]).padStart(2, "0")}`,
          layout: "list",
          options: shuf(wrong.concat([q])).map((t) =>
            opt(`<span style="font-size:19px">${esc(t[2])}</span> <span class="opt-sub" style="display:inline">${esc(t[3])}</span>`, t[2] === q[2])
          ),
          explain: `Jawabannya: ${q[2]} (${q[3]}).`
        };
      }
    },

    opposite: {
      build: () => series(OPPOSITES, nQ()).map((p) => (Math.random() < 0.5 ? p : [p[1], p[0]])),
      make: (q) => {
        const [a, b] = q;
        // Buang pengecoh yang artinya sama dengan jawaban, agar tidak ada dua opsi benar.
        const others = OPPOSITES.flat().filter((w) => w[0] !== a[0] && w[0] !== b[0] && w[2] !== b[2]);
        return {
          prompt: `Apa lawan kata dari "${a[2]}"?`,
          big: a[0], sub: a[1], speak: a[0],
          layout: "grid",
          options: shuf(pick(others, nOpt() - 1).concat([b])).map((w) =>
            opt(`<span class="opt-main" style="font-size:25px">${esc(w[0])}</span><span class="opt-sub">${esc(w[1])} · ${esc(w[2])}</span>`, w[0] === b[0])
          ),
          explain: `Lawan ${a[0]} (${a[2]}) adalah ${b[0]} — ${b[1]}, ${b[2]}.`
        };
      }
    },

    greeting: {
      build: () => series(GREETINGS, nQ()),
      make: (q) => ({
        prompt: "Apa yang sebaiknya kamu ucapkan?",
        big: `<span style="font-size:26px">${esc(q[0])}</span>`,
        rawBig: true,
        layout: "list",
        options: shuf(padWrong(q[3], q[1], GREETINGS.map((x) => x[1])).concat([q[1]]))
          .map((o) => opt(esc(o), o === q[1])),
        explain: `Ucapkan: ${q[1]} (${q[2]})`
      })
    },

    dialog: {
      build: () => series(DIALOG, nQ()),
      make: (q) => ({
        prompt: "Pilih jawaban yang paling cocok:",
        bubble: [q[0], q[1]],
        speak: q[0],
        layout: "list",
        options: shuf(padWrong(q[3], q[2], DIALOG.map((x) => x[2])).concat([q[2]]))
          .map((o) => opt(esc(o), o === q[2])),
        explain: `Jawaban yang cocok: ${q[2]}`
      })
    },

    listen: {
      build: () => series(vocabPool(), nQ()),
      make: (q) => ({
        prompt: "Dengarkan, lalu pilih artinya. Ketuk tombol untuk mengulang.",
        speaker: q[0], autoSpeak: true,
        layout: "list",
        options: shuf(distractors(q, nOpt() - 1).concat([q])).map((v) => opt(esc(v[2]), v[2] === q[2])),
        explain: `Yang dibacakan: ${q[0]} (${q[1]}) = ${q[2]}.`
      })
    }
  };

  const MIX = ["vocab", "pinyin", "reverse", "tone", "number", "days", "measure", "opposite", "time", "greeting"];
  QUIZ.mixed = {
    build: () => {
      const src = MIX.filter(isEnabled);
      return series(src.length ? src : MIX, nQ()).map((m) => ({ _m: m, _q: QUIZ[m].build()[0] }));
    },
    make: (item) => {
      const s = QUIZ[item._m].make(item._q);
      s.prompt = `[${TITLES[item._m]}] ${s.prompt}`;
      return s;
    }
  };

  // ---------- State ----------
  const g = $("game"), homeEl = $("home"), onboardEl = $("onboard");
  let mode = null, qs = [], qi = 0, score = 0, streak = 0, lock = false, spec = null;
  let built = [], mem = null, timer = null, speed = null;

  // ---------- Layar ----------
  function show(which) {
    onboardEl.hidden = which !== "onboard";
    homeEl.hidden = which !== "home";
    g.hidden = which !== "game";
    if (which !== "game") g.innerHTML = "";
  }

  const gameById = (id) => GAMES.find((g) => g[0] === id);
  const focusForGame = (id) => FOCUS.slice(1).find((f) => f[3].includes(id));
  const playerSessions = () => {
    const key = (player || "").toLowerCase();
    return sessions.filter((s) => (s.player || "").toLowerCase() === key);
  };
  const pct = (n, d) => Math.max(0, Math.min(100, Math.round((n / Math.max(1, d)) * 100)));

  function missionRow(icon, title, now, goal) {
    const done = now >= goal;
    return `<li class="mission-row${done ? " done" : ""}">
      <span class="mission-ico" aria-hidden="true">${icon}</span>
      <span class="mission-copy">
        <span class="mission-title">${esc(title)}</span>
        <span class="mission-bar"><span style="width:${pct(now, goal)}%"></span></span>
      </span>
      <span class="mission-count">${Math.min(now, goal)} / ${goal}</span>
    </li>`;
  }

  function renderPathNode(f, idx, enabledGames, histories, bestIds) {
    const chapterGames = enabledGames(f);
    const done = chapterGames.filter((id) => bestIds.includes(id)).length;
    const prev = idx === 0 ? true : enabledGames(FOCUS.slice(1)[idx - 1]).some((id) => bestIds.includes(id));
    const unlocked = prev || done > 0 || myStars() >= idx * 20;
    const first = chapterGames[0];
    const last = histories.find((s) => chapterGames.includes(s.mode));
    return `<div class="path-stop ${idx % 2 ? "right" : "left"}">
      <button class="path-card gcard${done ? " cleared" : ""}" data-mode="${esc(first || "")}" ${!unlocked || !first ? "disabled" : ""}>
        <span class="path-pin" aria-hidden="true">${done ? "✓" : unlocked ? idx + 1 : "🔒"}</span>
        <span>
          <span class="path-title">${esc(f[1])}</span>
          <span class="path-sub">${done}/${chapterGames.length} game selesai${last ? ` · terakhir ${esc(last.game)}` : ""}</span>
        </span>
      </button>
    </div>`;
  }

  function renderCollection(history, bestIds) {
    const total = myStars();
    const focusDone = FOCUS.slice(1).filter((f) => f[3].some((id) => bestIds.includes(id))).length;
    const badges = [
      ["🌟", "Langkah Pertama", history.length >= 1, "Selesaikan 1 permainan"],
      ["🎯", "Fokus Hebat", focusDone >= 3, "Coba 3 fokus belajar"],
      ["🏆", "Juara Kecil", total >= 50, "Kumpulkan 50 bintang"],
      ["🎵", "Telinga Nada", (bestByGame.tone || 0) >= 2, "Raih ★★ di nada"],
      ["💬", "Teman Bicara", (bestByGame.dialog || 0) >= 2, "Raih ★★ di dialog"],
      ["⚡", "Cepat Tangkas", (bestByGame.speed || 0) >= 2, "Raih ★★ di lomba cepat"],
      ["📚", "Kolektor Kata", bestIds.length >= 8, "Selesaikan 8 game"],
      ["👑", "Master Mini", bestIds.length >= 18, "Buka semua game"]
    ];
    return `<section class="card collection-card">
      <div class="dash-head">
        <div>
          <p class="kicker">Koleksiku</p>
          <h3 class="dash-title">Lencana belajar</h3>
        </div>
        <span class="count-badge">${badges.filter((b) => b[2]).length}/${badges.length}</span>
      </div>
      <div class="badge-grid">${badges.map((b) => `
        <div class="badge-tile${b[2] ? " unlocked" : ""}">
          <span aria-hidden="true">${b[2] ? b[0] : "?"}</span>
          <strong>${esc(b[1])}</strong>
          <small>${esc(b[3])}</small>
        </div>`).join("")}</div>
    </section>`;
  }

  function renderHome() {
    $("playerName").textContent = player || "";
    paintStars();

    const lv = LEVELS.find((l) => l[0] === level);
    $("levelHint").textContent = lv[2];
    $("levelOpts").innerHTML = LEVELS.map((l) =>
      `<button class="pick" data-kind="level" data-val="${l[0]}" aria-pressed="${l[0] === level}">
         <span class="pick-name">${esc(l[1])}</span>
         <span class="pick-desc">${esc(l[2])}</span>
       </button>`).join("");

    const enabledIn = (f) => f[3].filter(isEnabled);
    const fc = focusOf(focus);
    $("focusTitle").textContent = fc[1];
    $("focusHint").textContent = fc[2];
    $("focusOpts").innerHTML = FOCUS.map((f) =>
      `<button class="pick" data-kind="focus" data-val="${f[0]}" aria-pressed="${f[0] === focus}">
         <span class="pick-name">${esc(f[1])}</span>
         <span class="pick-desc">${enabledIn(f).length} game</span>
       </button>`).join("");

    const groups = (focus === "all" ? FOCUS.slice(1) : [fc]).filter((f) => enabledIn(f).length);
    const history = playerSessions().slice().reverse();
    const today = history.filter((s) => s.day === dayKey());
    const bestIds = Object.keys(bestByGame).filter((id) => bestByGame[id] > 0);
    const focusToday = new Set(today.map((s) => (focusForGame(s.mode) || [])[0]).filter(Boolean)).size;
    const correctToday = today.reduce((n, s) => n + (parseInt(s.correct, 10) || 0), 0);
    const suggested = (enabledIn(fc)[0] || enabledIn(FOCUS[0])[0] || "mixed");
    const quick = isEnabled("mixed") ? "mixed" : suggested;
    const totalGames = GAMES.filter((g) => isEnabled(g[0])).length;
    const completePct = pct(bestIds.length, totalGames);

    $("sections").innerHTML = groups.length ? `
      <section class="dash-hero">
        <div class="hero-avatar" aria-hidden="true">${avatar}</div>
        <div class="hero-copy">
          <p class="kicker">Ruang belajar</p>
          <h3>Halo, ${esc(player || "teman kecil")}!</h3>
          <p>Semua latihan Mandarinmu disusun seperti perjalanan. Selesaikan misi, buka pos baru, dan kumpulkan lencana.</p>
        </div>
        <button class="btn-plain sm" data-act="wiz-edit">Ganti rute</button>
      </section>

      <section class="card mission-card">
        <div class="dash-head">
          <div>
            <p class="kicker">Misi hari ini</p>
            <h3 class="dash-title">${today.length ? "Lanjutkan momentum" : "Mulai langkah pertama"}</h3>
          </div>
          <span class="count-badge">${today.length} ronde</span>
        </div>
        <ol class="mission-list">
          ${missionRow("🏆", "Selesaikan 1 permainan", today.length, 1)}
          ${missionRow("🧭", "Main di 2 fokus belajar", focusToday, 2)}
          ${missionRow("🔥", "Dapat 5 jawaban benar", correctToday, 5)}
        </ol>
      </section>

      <section class="practice-card">
        <div class="practice-main card">
          <div>
            <p class="kicker">Kamu mau main sendiri</p>
            <h3 class="dash-title">Pilih latihan cepat</h3>
            <p class="practice-sub">Mulai dari rekomendasi, atau pilih mini-game di bawah.</p>
          </div>
          <div class="practice-actions">
            <button class="btn-cta gcard" data-mode="${esc(suggested)}">Mulai ronde</button>
            <button class="btn-plain gcard" data-mode="${esc(quick)}">Kuis campuran</button>
          </div>
        </div>
        <div class="stat-strip">
          <div class="mini-stat"><strong>${myStars()}</strong><span>Bintang</span></div>
          <div class="mini-stat"><strong>${bestIds.length}</strong><span>Game selesai</span></div>
          <div class="mini-stat"><strong>${completePct}%</strong><span>Petualangan</span></div>
          <div class="mini-stat"><strong>${history.length}</strong><span>Total ronde</span></div>
        </div>
      </section>

      <section class="adventure">
        <div class="dash-head">
          <div>
            <p class="kicker">Peta petualangan</p>
            <h3 class="dash-title">${focus === "all" ? "Semua pos belajar" : fc[1]}</h3>
          </div>
          <span class="seg-pill"><span>${bestIds.length}</span>/${totalGames} pos</span>
        </div>
        <div class="path-map">
          ${groups.map((f, idx) => renderPathNode(f, idx, enabledIn, history, bestIds)).join("")}
        </div>
      </section>

      <section class="card all-games-card">
        <div class="dash-head">
          <div>
            <p class="kicker">Pilih mini-game</p>
            <h3 class="dash-title">Latihan lengkap</h3>
          </div>
          <span class="count-badge">${groups.reduce((n, f) => n + enabledIn(f).length, 0)} game</span>
        </div>
        ${groups.map((f) => `
          <div class="sec-head compact">
            <p class="sec-title">${esc(f[1])}</p>
            <span class="count-badge">${enabledIn(f).length} game</span>
          </div>
          <div class="menugrid compact">${enabledIn(f).map(gameCard).join("")}</div>`).join("")}
      </section>

      ${renderCollection(history, bestIds)}
    ` : `<div class="card"><p class="qprompt" style="margin:0">Belum ada permainan yang aktif. Aktifkan lewat Panel Admin.</p></div>`;

    $("sumLevel").textContent = lv[1];
    $("sumFocus").textContent = fc[1];

    renderBoard();
    paintWizard();
  }

  // Hanya bagian milik langkah aktif yang tampil; sisanya disembunyikan.
  function paintWizard() {
    const done = step === 3;
    $("wizard").hidden = done;
    $("stepLevel").hidden = step !== 1;
    $("stepFocus").hidden = step !== 2;
    $("summary").hidden = !done;
    $("sections").hidden = !done;
    $("boardCard").hidden = !done;
    if (done) return;

    $("wizStep").textContent = `Langkah ${step} dari 2`;
    $("wizDots").innerHTML = [1, 2].map((i) => `<span class="wiz-dot${i === step ? " on" : ""}"></span>`).join("");
    // Di langkah 1 tak ada langkah sebelumnya — tombolnya jadi jalan keluar,
    // dan itu hanya masuk akal kalau sudah pernah ada pilihan tersimpan.
    const back = $("wizBack");
    back.hidden = step === 1 && !store.get("setup", false);
    back.textContent = step === 1 ? "✕ Batal" : "← Kembali";
  }

  function goStep(n) {
    step = n;
    paintWizard();
    const panel = step === 1 ? $("stepLevel") : step === 2 ? $("stepFocus") : $("sections");
    const first = panel.querySelector("button:not([disabled])");
    if (first) first.focus({ preventScroll: true });
    panel.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }

  function gameCard(id) {
    const game = GAMES.find((x) => x[0] === id);
    const b = bestByGame[id] || 0;
    const off = id === "listen" && !canSpeak;
    return `<button class="gcard" data-mode="${id}"${off ? ' disabled title="Peramban ini tidak punya suara Mandarin"' : ""}>
      ${b ? `<span class="best">${"★".repeat(b)}</span>` : ""}
      <span class="emoji" style="background:${game[4]};color:${game[5]}">${game[3]}</span>
      <span class="gname">${esc(game[1])}</span>
      <span class="gdesc">${esc(game[2])}</span>
    </button>`;
  }

  function renderBoard() {
    const rows = Object.values(board).sort((a, b) => b.stars - a.stars).slice(0, 10);
    if (!rows.length) {
      $("boardList").innerHTML = `<li class="board-empty">Belum ada bintang. Ayo main satu game dulu!</li>`;
      return;
    }
    const medal = ["🥇", "🥈", "🥉"];
    $("boardList").innerHTML = rows.map((r, i) => {
      const last = r.last
        ? `${esc(r.last.game)} · ${esc(r.last.level)} · ${r.last.correct}/${r.last.total} benar`
        : "Belum main";
      const me = player && r.name.toLowerCase() === player.toLowerCase();
      return `<li class="board-row${me ? " me" : ""}">
        <span class="board-rank" aria-hidden="true">${medal[i] || i + 1}</span>
        <span class="board-avatar" aria-hidden="true">${r.avatar || "🐼"}</span>
        <span>
          <span class="board-name">${esc(r.name)}</span>
          <span class="board-last" style="display:block">${last}</span>
        </span>
        <span class="board-stars"><span aria-hidden="true">⭐</span> ${r.stars}</span>
      </li>`;
    }).join("");
  }

  // ---------- Modal hasil ----------
  let lastModalFocus = null;
  function showModal(stats) {
    lastModalFocus = document.activeElement;
    $("modalStars").innerHTML = [0, 1, 2].map((i) => `<span class="${i < stats.rating ? "" : "star-off"}">★</span>`).join("");
    $("modalName").innerHTML = `<span aria-hidden="true">${avatar}</span> ${esc(player || "Pemain")}`;
    $("modalGrid").innerHTML = [
      ["Total bintang", myStars()],
      ["Game terakhir", stats.game],
      ["Level", stats.level],
      ["Fokus", stats.focus],
      [stats.countKey || "Benar", stats.countVal],
      ["Perolehan ronde", `+${stats.gain} bintang`],
      ["Rating", `${stats.rating} / 3`],
      ["Pesan", stats.msg]
    ].map(([k, v]) => `<div class="stat"><p class="stat-k">${esc(k)}</p><p class="stat-v">${esc(String(v))}</p></div>`).join("");
    $("modal").hidden = false;
    $("modal").querySelector(".modal-x").focus();
    if (stats.rating === 3) confetti();
  }
  function closeModal() {
    const wasOpen = !$("modal").hidden;
    $("modal").hidden = true;
    if (lastModalFocus && document.contains(lastModalFocus)) lastModalFocus.focus();
    // Baru selesai satu ronde — saat paling pas menawarkan pemasangan.
    if (wasOpen) maybeShowPwaModal(900);
  }

  // ---------- Alur permainan ----------
  function backHome() {
    if (timer) { clearInterval(timer); timer = null; }
    if (canSpeak) speechSynthesis.cancel();
    mode = null;
    show("home");
    renderHome();
  }

  function startGame(m) {
    if (!isEnabled(m)) return backHome(); // dinonaktifkan admin
    mode = m; score = 0; streak = 0; qi = 0; lock = false;
    closeModal();
    show("game");
    if (m === "memory") return startMemory();
    if (m === "speed") return startSpeed();
    if (m === "typing") { qs = series(vocabPool(), nQ()); return render(); }
    if (m === "sentence") { qs = series(sentPool(), nQ()); return render(); }
    qs = QUIZ[m].build();
    render();
  }

  const levelName = () => LEVELS.find((l) => l[0] === level)[1];

  function head() {
    const total = qs.length;
    return `<div class="ghead">
      <button class="btn-plain sm" data-act="home" aria-label="Kembali ke menu">← Menu</button>
      <span class="gtitle">${esc(TITLES[mode])}</span>
      <span class="gcount">Soal ${qi + 1} / ${total}</span>
      <span class="pill streak"${streak >= 2 ? "" : " hidden"}>🔥 ${streak}</span>
      <span class="pill">⭐ ${score}</span>
    </div>
    <div class="progress"><div style="width:${Math.round((qi / total) * 100)}%"></div></div>`;
  }

  function fb(ok, explain) {
    streak = ok ? streak + 1 : 0;
    if (ok) score++;
    beep(ok);
    const msg = ok
      ? "Benar! " + (streak >= 3 ? `Hebat, ${streak} berturut-turut!` : "Bagus sekali.")
      : "Belum tepat. " + explain;
    $("fb").innerHTML = `<div class="fb ${ok ? "ok" : "no"}">${esc(msg)}</div>
      <button class="btn-cta" data-act="next">Lanjut →</button>`;
    $("fb").querySelector('[data-act="next"]').focus();
  }

  function next() {
    qi++; lock = false;
    if (qi >= qs.length) finish(); else render();
  }

  function finish() {
    const total = qs.length, p = Math.round((score / total) * 100);
    const rating = p === 100 ? 3 : p >= 70 ? 2 : 1;
    const msg = p === 100 ? "Sempurna!" : p >= 70 ? "Hebat!" : "Terus berlatih!";
    saveBest(mode, rating);
    addStars(score, { game: TITLES[mode], level: levelName(), correct: score, total });
    const stats = {
      game: TITLES[mode], level: levelName(), focus: focusOf(focus)[1],
      countVal: `${score} / ${total}`, gain: score, rating, msg
    };
    backHome();
    showModal(stats);
  }

  function render() {
    if (mode === "sentence") return renderSentence();
    if (mode === "typing") return renderTyping();
    renderQuiz();
  }

  function renderQuiz() {
    spec = QUIZ[mode].make(qs[qi]);
    let body = `<p class="qprompt">${esc(spec.prompt)}</p>`;
    if (spec.bubble) {
      body += `<div class="bubble">
        <p style="font-size:22px">${esc(spec.bubble[0])}</p>
        <p style="font-size:13px;color:var(--text-secondary);margin-top:2px;font-style:italic">${esc(spec.bubble[1])}</p></div>`;
    } else if (spec.speaker) {
      body += `<button class="speaker" data-act="speak" aria-label="Putar suara">🔊</button>`;
    } else if (spec.big) {
      body += `<p class="qbig">${spec.rawBig ? spec.big : esc(spec.big)}</p>`;
      body += spec.sub ? `<p class="qsub">${esc(spec.sub)}</p>` : `<div class="qgap"></div>`;
    }
    body += `<div class="opts-${spec.layout}">` +
      spec.options.map((o, i) => `<button class="opt" data-k="${i}">${o.html}</button>`).join("") +
      `</div><div id="fb"></div>`;
    g.innerHTML = head() + body;
    if (spec.autoSpeak) speak(spec.speaker);
  }

  function grade(btn, ok) {
    if (lock) return;
    lock = true;
    g.querySelectorAll(".opt, .chip").forEach((b) => (b.disabled = true));
    btn.classList.add(ok ? "correct" : "wrong");
    if (!ok) {
      const right = g.querySelector(`.opt[data-k="${spec.options.findIndex((o) => o.correct)}"]`);
      if (right) right.classList.add("correct");
    } else {
      burstFrom(btn, ["⭐", "✨", "🌟"], 8);
    }
    fb(ok, spec.explain);
  }

  // ---------- Susun kalimat ----------
  function renderSentence() {
    const q = qs[qi];
    built = [];
    const chips = shuf(q[0].map((w, i) => [w, i]));
    g.innerHTML = head() +
      `<p class="qprompt">Susun kalimat: <strong style="color:var(--text-primary)">${esc(q[1])}</strong></p>
       <div id="slot" class="slot"></div>
       <div id="chips">${chips.map((c) => `<button class="chip" data-i="${c[1]}">${esc(c[0])}</button>`).join("")}</div>
       <div class="toolbar">
         <button class="btn-plain sm" data-act="undo">↶ Hapus terakhir</button>
         <button class="btn-plain sm" data-act="hear">🔊 Dengarkan</button>
       </div><div id="fb"></div>`;
  }

  function pickChip(btn) {
    if (lock) return;
    built.push(parseInt(btn.dataset.i, 10));
    btn.style.visibility = "hidden";
    const q = qs[qi];
    $("slot").textContent = built.map((i) => q[0][i]).join(" ");
    if (built.length === q[0].length) {
      lock = true;
      const ok = built.every((v, idx) => v === idx);
      $("slot").classList.add(ok ? "ok" : "no");
      if (ok) speak(q[0].join(""));
      fb(ok, `Urutan yang benar: ${q[0].join("")}.`);
    }
  }

  function undoChip() {
    if (lock || !built.length) return;
    const last = built.pop();
    const el = g.querySelector(`.chip[data-i="${last}"]`);
    if (el) el.style.visibility = "visible";
    const q = qs[qi];
    $("slot").textContent = built.map((i) => q[0][i]).join(" ");
  }

  // ---------- Ketik pinyin ----------
  function renderTyping() {
    const q = qs[qi];
    g.innerHTML = head() +
      `<p class="qprompt">Ketik cara membaca hanzi ini (boleh tanpa tanda nada):</p>
       <p class="qbig">${esc(q[0])}</p>
       <p class="qsub">artinya: ${esc(q[2])}</p>
       <input id="tin" class="tinput" autocomplete="off" autocapitalize="off" spellcheck="false"
              placeholder="contoh: ni hao" aria-label="Ketik pinyin">
       <div class="toolbar">
         <button class="btn-cta" data-act="check">Periksa</button>
         <button class="btn-plain sm" data-act="hear">🔊 Dengarkan</button>
       </div>
       <p class="hintrow">Tekan Enter untuk memeriksa.</p>
       <div id="fb"></div>`;
    $("tin").focus();
    $("tin").addEventListener("keydown", (e) => { if (e.key === "Enter") checkTyping(); });
  }

  function checkTyping() {
    if (lock) return;
    const q = qs[qi];
    const val = $("tin").value.trim();
    if (!val) return;
    lock = true;
    $("tin").disabled = true;
    const ok = plain(val) === plain(q[1]);
    $("tin").style.borderColor = ok ? "var(--teal)" : "var(--coral)";
    speak(q[0]);
    fb(ok, `Yang benar: ${q[1]}.`);
  }

  // ---------- Kartu memori ----------
  function startMemory() {
    const n = cfg().pairs;
    const pairs = pick(vocabPool(), n);
    const cards = [];
    pairs.forEach((p, k) => {
      cards.push({ k, t: p[0] + " " + p[1], hanzi: p[0], done: false });
      cards.push({ k, t: p[2], hanzi: p[0], done: false });
    });
    mem = { cards: shuf(cards), open: [], moves: 0, found: 0, busy: false, pairs: n };
    renderMem();
  }

  function renderMem() {
    g.innerHTML = `<div class="ghead">
        <button class="btn-plain sm" data-act="home" aria-label="Kembali ke menu">← Menu</button>
        <span class="gtitle">Kartu memori</span>
        <span class="gcount">Pasangan: ${mem.found} / ${mem.pairs}</span>
        <span class="pill">Langkah: ${mem.moves}</span>
      </div>
      <p class="qprompt">Buka dua kartu dan pasangkan hanzi dengan artinya.</p>
      <div class="memgrid">${mem.cards.map((c, i) => {
        if (c.done) return `<div class="mem done">${esc(c.t)}</div>`;
        if (mem.open.includes(i)) return `<div class="mem open">${esc(c.t)}</div>`;
        return `<button class="mem" data-flip="${i}" aria-label="Kartu tertutup">?</button>`;
      }).join("")}</div>`;
  }

  function flip(i) {
    if (mem.busy || mem.open.includes(i) || mem.cards[i].done) return;
    mem.open.push(i);
    renderMem();
    if (mem.open.length === 2) {
      mem.busy = true; mem.moves++;
      const a = mem.cards[mem.open[0]], b = mem.cards[mem.open[1]];
      if (a.k === b.k) {
        a.done = b.done = true; mem.found++; mem.open = []; mem.busy = false;
        beep(true); speak(a.hanzi);
        renderMem();
        if (mem.found === mem.pairs) memFinish();
      } else {
        beep(false);
        setTimeout(() => { mem.open = []; mem.busy = false; renderMem(); }, 800);
      }
    }
  }

  function memFinish() {
    const par = mem.pairs + 3;
    const rating = mem.moves <= par ? 3 : mem.moves <= par + 4 ? 2 : 1;
    const gain = mem.pairs;
    saveBest("memory", rating);
    addStars(gain, { game: "Kartu memori", level: levelName(), correct: mem.pairs, total: mem.pairs });
    const stats = {
      game: "Kartu memori", level: levelName(), focus: focusOf(focus)[1],
      countKey: "Langkah", countVal: mem.moves, gain, rating,
      msg: rating === 3 ? "Ingatanmu luar biasa!" : rating === 2 ? "Bagus!" : "Terus berlatih!"
    };
    backHome();
    showModal(stats);
  }

  // ---------- Lomba cepat ----------
  const SPEED_SECONDS = 60;

  function startSpeed() {
    speed = { left: SPEED_SECONDS, correct: 0, answered: 0 };
    lock = false;
    renderSpeed();
    timer = setInterval(() => {
      speed.left--;
      const el = $("clock");
      if (el) el.textContent = speed.left + "s";
      if (speed.left <= 0) speedFinish();
    }, 1000);
  }

  function renderSpeed() {
    const q = pick(vocabPool(), 1)[0];
    speed.q = q;
    const opts = shuf(distractors(q, nOpt() - 1).concat([q]));
    g.innerHTML = `<div class="ghead">
        <button class="btn-plain sm" data-act="home" aria-label="Kembali ke menu">← Menu</button>
        <span class="gtitle">Lomba cepat</span>
        <span class="gcount">Benar: ${speed.correct}</span>
        <span class="pill" id="clock">${speed.left}s</span>
      </div>
      <p class="qprompt">Apa arti kata ini? Jawab secepat mungkin!</p>
      <p class="qbig">${esc(q[0])}</p>
      <p class="qsub">${esc(q[1])}</p>
      <div class="opts-list">${opts.map((v) =>
        `<button class="opt" data-speed="${v[2] === q[2] ? 1 : 0}">${esc(v[2])}</button>`
      ).join("")}</div>`;
  }

  function speedAnswer(ok) {
    if (!speed || speed.left <= 0) return;
    speed.answered++;
    if (ok) speed.correct++;
    beep(ok);
    renderSpeed();
  }

  function speedFinish() {
    clearInterval(timer); timer = null;
    const c = speed.correct;
    const rating = c >= 18 ? 3 : c >= 10 ? 2 : 1;
    saveBest("speed", rating);
    addStars(c, { game: "Lomba cepat", level: levelName(), correct: c, total: speed.answered });
    const stats = {
      game: "Lomba cepat", level: levelName(), focus: focusOf(focus)[1],
      countVal: `${c} / ${speed.answered}`, gain: c, rating,
      msg: rating === 3 ? "Kecepatanmu luar biasa!" : rating === 2 ? "Bagus!" : "Terus berlatih!"
    };
    backHome();
    showModal(stats);
  }

  // ---------- Tema ----------
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    store.set("theme", t);
    $("themeBtn").textContent = t === "dark" ? "☀️" : "🌙";
  }

  // ---------- Install PWA ----------
  // Panduan pasang berbeda tiap browser: hanya keluarga Chromium yang punya
  // beforeinstallprompt, sisanya harus dituntun lewat menu masing-masing.
  const ua = navigator.userAgent;
  // "fullscreen" sengaja tak dihitung: layar penuh biasa (F11) juga cocok.
  const isStandalone = () =>
    ["standalone", "minimal-ui", "window-controls-overlay"]
      .some((m) => matchMedia(`(display-mode: ${m})`).matches) || navigator.standalone === true;
  // iPadOS 13+ menyamar sebagai Mac; dikenali dari layar sentuhnya.
  const isIOS = () => /(iphone|ipad|ipod)/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const isIOSSafari = () => isIOS() && !/(crios|fxios|edgios|opios)/i.test(ua);
  const isAndroid = () => /android/i.test(ua);
  // Browser bawaan aplikasi (Instagram, Facebook, TikTok, dll) tak bisa memasang PWA.
  const isInApp = () => /(FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|TikTok|Twitter)/i.test(ua);
  const isSamsung = () => /samsungbrowser/i.test(ua);
  const isFirefox = () => /firefox|fxios/i.test(ua);
  const isChromium = () => /(chrome|chromium|crios|edg\/|edgios|opr\/)/i.test(ua) && !isFirefox();
  const brandName = () => (getCfg().brand || {}).name || "Papa Bonski Mandarin";

  // Jeda sebelum popup boleh muncul lagi, per kali ditutup. Setelah daftar ini
  // habis, popup berhenti sendiri supaya tidak mengganggu.
  const PWA_SNOOZE_DAYS = [3, 10];
  let pwaTimer = null, lastPwaFocus = null, pwaAuto = false;

  const pwaDone = () => isStandalone() || store.get("pwaInstalled", false) || store.get("pwaNever", false);
  const pwaSnoozed = () => Date.now() < store.get("pwaSnoozeUntil", 0);

  function snoozePwa() {
    const n = store.get("pwaDismiss", 0) + 1;
    store.set("pwaDismiss", n);
    if (n > PWA_SNOOZE_DAYS.length) store.set("pwaNever", true);
    else store.set("pwaSnoozeUntil", Date.now() + PWA_SNOOZE_DAYS[n - 1] * 864e5);
  }

  // Tombol selalu tersedia sebagai pusat panduan pemasangan. Bila browser tidak
  // mendukung PWA, pengguna akan diarahkan ke browser yang tepat.
  const canInstall = () => !isStandalone();

  function pwaToast(msg) {
    const t = $("pwaToast");
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(pwaToast.t);
    pwaToast.t = setTimeout(() => { t.hidden = true; }, 4200);
  }

  // Isi popup sesuai browser: label, ajakan, langkah, teks tombol, catatan.
  function pwaGuide() {
    const app = brandName();
    if (installPrompt) return {
      tag: "Sekali ketuk",
      lead: `Pasang ${app} sebagai aplikasi supaya anak bisa langsung belajar dari ikon di layar utama.`,
      steps: [["1", `Ketuk tombol <b>Pasang sekarang</b> di bawah.`], ["2", "Pilih <b>Pasang</b> pada kotak konfirmasi browser."], ["3", `Buka ${esc(app)} dari ikon barunya.`]],
      cta: "Pasang sekarang"
    };
    if (isInApp()) return {
      tag: "Browser dalam aplikasi",
      lead: "Halaman ini dibuka di dalam aplikasi lain, jadi tombol pasang belum tersedia.",
      steps: [["⋮", "Ketuk menu titik tiga di pojok layar."], ["↗", "Pilih <b>Buka di browser</b> (Chrome atau Safari)."], ["⬇", "Ulangi pemasangan dari sana."]],
      cta: "Mengerti", note: "Cara ini juga membuat bintang anak tersimpan lebih aman."
    };
    if (isIOSSafari()) return {
      tag: "iPhone & iPad · Safari",
      lead: `Di Safari, ${app} dipasang lewat menu Bagikan. Setelah itu tampil seperti aplikasi biasa.`,
      steps: [["⬆", "Ketuk ikon <b>Bagikan</b> (kotak dengan panah ke atas) di bawah layar."], ["＋", "Geser ke bawah, pilih <b>Tambahkan ke Layar Utama</b>."], ["✓", "Ketuk <b>Tambah</b> di pojok kanan atas."]],
      cta: "Mengerti"
    };
    if (isIOS()) return {
      tag: "iPhone & iPad",
      lead: "Pemasangan di iPhone dan iPad hanya bisa lewat Safari.",
      steps: [["1", "Salin alamat halaman ini."], ["2", "Buka <b>Safari</b>, tempel alamatnya."], ["3", "Ketuk <b>Bagikan → Tambahkan ke Layar Utama</b>."]],
      cta: "Mengerti", note: "Chrome dan Firefox di iOS belum boleh memasang aplikasi web."
    };
    if (isSamsung()) return {
      tag: "Samsung Internet",
      lead: `Tambahkan ${app} ke layar utama supaya cepat dibuka anak.`,
      steps: [["☰", "Ketuk menu tiga garis di kanan bawah."], ["＋", "Pilih <b>Tambah halaman ke</b>."], ["🏠", "Pilih <b>Layar Utama</b>, lalu ketuk Tambah."]],
      cta: "Mengerti"
    };
    if (isFirefox() && isAndroid()) return {
      tag: "Firefox · Android",
      lead: `Firefox bisa menaruh ${app} di layar utama lewat menunya.`,
      steps: [["⋮", "Ketuk menu titik tiga di pojok kanan."], ["＋", "Pilih <b>Tambahkan ke Layar Utama</b>."], ["✓", "Konfirmasi, lalu buka dari ikon barunya."]],
      cta: "Mengerti"
    };
    if (isAndroid()) return {
      tag: "Android",
      lead: `Tombol pasang belum muncul, tapi ${app} tetap bisa dipasang dari menu browser.`,
      steps: [["⋮", "Ketuk menu titik tiga di pojok kanan atas."], ["⬇", "Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke Layar Utama</b>."], ["✓", "Konfirmasi, lalu buka dari ikon barunya."]],
      cta: "Mengerti"
    };
    if (isChromium()) return {
      tag: "Komputer",
      lead: `${app} bisa dipasang sebagai aplikasi jendela sendiri, tanpa tab browser.`,
      steps: [["⊕", "Klik ikon pasang di ujung kanan bilah alamat."], ["⋮", `Atau buka menu browser → <b>Instal ${esc(app)}</b>.`], ["✓", "Klik <b>Instal</b> pada konfirmasi."]],
      cta: "Mengerti"
    };
    return {
      tag: "Browser ini",
      lead: `Browser ini belum mendukung pemasangan aplikasi web, tapi ${app} tetap bisa dimainkan seperti biasa.`,
      steps: [["★", "Simpan halaman ini sebagai bookmark."], ["⬇", "Atau buka di <b>Chrome</b>, <b>Edge</b>, atau <b>Safari</b> untuk memasangnya."]],
      cta: "Mengerti", note: "Bintang dan kemajuan anak tetap tersimpan di perangkat ini."
    };
  }

  function renderPwaModal() {
    const gd = pwaGuide();
    $("pwaBrand").textContent = brandName();
    $("pwaTag").textContent = gd.tag;
    $("pwaLead").textContent = gd.lead;
    // Teks langkah ditulis sendiri di pwaGuide() (bukan masukan pengguna), jadi
    // <b> di dalamnya sengaja dibiarkan; nama merek tetap di-escape.
    $("pwaSteps").innerHTML = gd.steps
      .map(([icon, s]) => `<li><span class="pwa-step-icon" aria-hidden="true">${esc(icon)}</span><span>${s}</span></li>`)
      .join("");
    const note = $("pwaNote");
    note.textContent = gd.note || "";
    note.hidden = !gd.note;
    const cta = $("pwaInstallNow");
    cta.textContent = gd.cta;
    cta.disabled = false;
    cta.classList.toggle("pwa-cta-ready", !!installPrompt);
  }

  function showPwaModal(auto) {
    if (isStandalone()) return;
    if (auto && (pwaDone() || pwaSnoozed())) return;
    lastPwaFocus = document.activeElement;
    pwaAuto = !!auto;
    renderPwaModal();
    $("pwaNever").hidden = !auto; // dari tombol Install, popup memang diminta
    $("pwaModal").hidden = false;
    document.documentElement.classList.add("modal-lock");
    $("pwaInstallNow").focus();
  }

  // silent = ditutup karena berhasil dipasang / diminta berhenti, bukan "nanti".
  // Jeda hanya dihitung untuk popup yang muncul sendiri; kalau pengguna yang
  // membukanya lewat tombol Install, menutupnya bukan penolakan.
  function closePwaModal(silent) {
    const back = $("pwaModal");
    if (back.hidden) return;
    back.hidden = true;
    document.documentElement.classList.remove("modal-lock");
    if (!silent && pwaAuto) snoozePwa();
    if (lastPwaFocus && document.contains(lastPwaFocus)) lastPwaFocus.focus();
    lastPwaFocus = null;
  }

  // Popup baru ditawarkan di saat senggang: bukan saat anak sedang bermain,
  // bukan saat modal hasil terbuka, dan bukan di layar kenalan.
  function maybeShowPwaModal(delay = 1200) {
    if (pwaDone() || pwaSnoozed()) return;
    clearTimeout(pwaTimer);
    pwaTimer = setTimeout(() => {
      if (mode || !player || !$("modal").hidden || !$("pwaModal").hidden) return;
      showPwaModal(true);
    }, delay);
  }

  function updateInstallButton() {
    const btn = $("installBtn");
    if (!btn) return;
    btn.hidden = isStandalone() || store.get("pwaInstalled", false) || !canInstall();
    btn.classList.toggle("ready", !!installPrompt);
    btn.title = installPrompt ? `Pasang ${brandName()} di perangkat ini` : "Cara memasang aplikasi";
  }

  // ---------- Event ----------
  $("nameForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("nameInput").value.trim().replace(/\s+/g, " ");
    if (!v) { $("nameErr").textContent = "Tulis namamu dulu ya."; return; }
    $("nameErr").textContent = "";
    player = v;
    store.set("player", player);
    store.set("avatar", avatar);
    show("home");
    renderHome();
  });

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".gcard");
    if (card && !card.disabled) return startGame(card.dataset.mode);

    const av = e.target.closest(".avatar-opt");
    if (av) {
      avatar = av.dataset.avatar;
      if (player) store.set("avatar", avatar);
      renderAvatarPick();
      paintStars();
      return;
    }

    const p = e.target.closest(".pick");
    if (p) {
      const next = p.dataset.kind === "level" ? 2 : 3;
      if (p.dataset.kind === "level") { level = p.dataset.val; store.set("level", level); }
      else { focus = p.dataset.val; store.set("focus", focus); store.set("setup", true); }
      step = next;
      renderHome();
      return goStep(next);
    }

    const act = e.target.closest("[data-act]");
    if (act) {
      const a = act.dataset.act;
      if (a === "home") return backHome();
      if (a === "next") return next();
      if (a === "again") { closeModal(); return startGame(mode); }
      if (a === "undo") return undoChip();
      if (a === "check") return checkTyping();
      if (a === "speak") return speak(spec.speaker);
      if (a === "hear") return speak(mode === "sentence" ? qs[qi][0].join("") : qs[qi][0]);
      if (a === "close-modal") return closeModal();
      if (a === "wiz-edit") return goStep(1);
      if (a === "wiz-back") return goStep(step === 2 ? 1 : 3);
      if (a === "switch") {
        $("nameInput").value = player || "";
        renderAvatarPick();
        show("onboard");
        $("nameInput").focus();
        return;
      }
      if (a === "reset-board") {
        if (!confirm("Kosongkan papan bintang? Semua bintang akan hilang.")) return;
        board = {}; store.set("board", board);
        return renderHome();
      }
      if (a === "theme") {
        return applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
      }
      if (a === "sound") {
        soundOn = !soundOn; store.set("sound", soundOn);
        $("soundBtn").textContent = soundOn ? "🔔" : "🔕";
        if (!soundOn && canSpeak) speechSynthesis.cancel();
        return;
      }
      if (a === "install") {
        showPwaModal(false);
        return;
      }
      if (a === "close-pwa") return closePwaModal();
      if (a === "pwa-never") {
        store.set("pwaNever", true);
        closePwaModal(true);
        pwaToast("Oke, popup pemasangan tidak akan muncul lagi.");
        return;
      }
      if (a === "pwa-install-confirm") {
        // Tanpa tombol asli browser, CTA-nya cuma "Mengerti" setelah panduan dibaca.
        if (!installPrompt) return closePwaModal();
        // Event beforeinstallprompt hanya sah sekali pakai.
        const promptEvt = installPrompt;
        installPrompt = null;
        act.disabled = true;
        promptEvt.prompt();
        promptEvt.userChoice.then((res) => {
          if (res && res.outcome === "accepted") {
            store.set("pwaInstalled", true);
            closePwaModal(true); // appinstalled menuntaskan sisanya
          } else {
            // Batal: jangan tutup, ganti isi popup jadi panduan manual.
            renderPwaModal();
            pwaToast("Tidak jadi? Kamu tetap bisa memasangnya lewat menu browser.");
          }
        }).catch(() => renderPwaModal()).then(() => {
          act.disabled = false;
          updateInstallButton();
        });
        return;
      }
    }

    const sp = e.target.closest("[data-speed]");
    if (sp) return speedAnswer(sp.dataset.speed === "1");

    const o = e.target.closest(".opt[data-k]");
    if (o && !o.disabled) return grade(o, spec.options[parseInt(o.dataset.k, 10)].correct);

    const chip = e.target.closest(".chip[data-i]");
    if (chip && !chip.disabled) return pickChip(chip);

    const fl = e.target.closest("[data-flip]");
    if (fl) return flip(parseInt(fl.dataset.flip, 10));

    if (e.target === $("modal")) return closeModal();
    if (e.target === $("pwaModal")) return closePwaModal();
  });

  document.addEventListener("keydown", (e) => {
    // Popup install: kurung fokus di dalamnya selama terbuka.
    if (e.key === "Tab" && !$("pwaModal").hidden) {
      const f = [...$("pwaModal").querySelectorAll("button:not([disabled]):not([hidden])")];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      return;
    }
    if (e.key === "Escape") {
      if (!$("pwaModal").hidden) return closePwaModal();
      if (!$("modal").hidden) return closeModal();
      if (mode) backHome();
      return;
    }
    // Pintasan angka & Enter hanya berlaku saat bermain, modal tertutup, dan
    // fokus tidak sedang di kotak ketik.
    if (!mode || !$("modal").hidden) return;
    const ae = document.activeElement;
    if (ae && ae.tagName === "INPUT") return;

    if (/^[1-9]$/.test(e.key)) {
      const i = parseInt(e.key, 10) - 1;
      const opts = [...g.querySelectorAll(".opt[data-k]:not([disabled])")];
      const list = opts.length ? opts : [...g.querySelectorAll("[data-speed]")];
      if (list[i]) { e.preventDefault(); list[i].click(); }
      return;
    }
    if (e.key === "Enter") {
      // Tombol yang sedang fokus menangani Enter-nya sendiri.
      if (ae && ae.tagName === "BUTTON") return;
      const nx = g.querySelector('[data-act="next"]');
      if (nx) { e.preventDefault(); nx.click(); }
    }
  });

  // Merek berubah (admin di tab lain, atau config.json termuat).
  document.addEventListener("pbm:config", () => {
    applyBrandText();
    if (!homeEl.hidden) renderHome();
  });

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPrompt = e;
    // Browser hanya menawarkan ini kalau aplikasi belum terpasang — jadi kalau
    // pengguna sempat mencopotnya, tandanya dibersihkan lagi.
    store.set("pwaInstalled", false);
    updateInstallButton();
    if (!$("pwaModal").hidden) renderPwaModal(); // popup terbuka: naikkan ke tombol asli
    else if (sessions.length) maybeShowPwaModal(9000); // pemain lama, sudah pernah main
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    store.set("pwaInstalled", true);
    closePwaModal(true);
    updateInstallButton();
    pwaToast(`${brandName()} berhasil dipasang! 🎉 Buka dari ikon di layar utama.`);
  });
  // Dibuka dari ikon aplikasi: tombol dan popup tak lagi relevan.
  const smq = matchMedia("(display-mode: standalone)");
  const onDisplayMode = () => { closePwaModal(true); updateInstallButton(); };
  if (smq.addEventListener) smq.addEventListener("change", onDisplayMode);
  else if (smq.addListener) smq.addListener(onDisplayMode); // Safari lama

  // ---------- Init ----------
  applyTheme(store.get("theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("soundBtn").textContent = soundOn ? "🔔" : "🔕";
  // Versi lama hanya menyimpan "pernah dilihat". Dihitung sebagai satu kali
  // ditutup, jadi pemain lama masih dapat sisa tawaran dengan jeda baru.
  if (store.get("pwaPromptSeen", false) && !store.get("pwaDismiss", 0)) store.set("pwaDismiss", 1);
  updateInstallButton();
  // Chromium menunggu beforeinstallprompt; jalur manual (iOS dll) ditawarkan
  // di sini, tapi hanya pada pemain yang sudah pernah main.
  if (!isChromium() && canInstall() && sessions.length) maybeShowPwaModal(9000);
  applyBrandText();
  renderAvatarPick();
  if (player) {
    show("home");
    renderHome();
    const shortcutGame = new URLSearchParams(location.search).get("game");
    if (shortcutGame && QUIZ[shortcutGame] && isEnabled(shortcutGame)) startGame(shortcutGame);
  }
  else { show("onboard"); paintStars(); }
})();
