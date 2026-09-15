/* Panel Admin — mengelola whitelabel & setelan lewat BrandKit (config.js). */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const B = window.BrandKit;

  // Metadata tampilan (cermin dari GAMES/FOCUS di app.js). [id, nama, emoji]
  const GAMES = [
    ["vocab", "Tebak kata", "🎴"], ["pinyin", "Tebak pinyin", "🔤"],
    ["reverse", "Arti ke hanzi", "🀄"], ["memory", "Kartu memori", "🧠"],
    ["tone", "Tebak nada", "🎵"], ["listen", "Dengar & tebak", "🔊"],
    ["typing", "Ketik pinyin", "⌨️"], ["number", "Cocokkan angka", "🔢"],
    ["math", "Matematika", "➕"], ["days", "Hari & waktu", "📅"],
    ["time", "Jam berapa", "🕘"], ["measure", "Kata ukur", "📏"],
    ["opposite", "Lawan kata", "↔️"], ["sentence", "Susun kalimat", "🧩"],
    ["greeting", "Salam sopan", "🙋"], ["dialog", "Lengkapi dialog", "💬"],
    ["speed", "Lomba cepat", "⚡"], ["mixed", "Kuis campuran", "🏆"]
  ];
  const FOCUS = [
    ["all", "Semua"], ["kosakata", "Kosakata"], ["dengar", "Dengar & Ucap"],
    ["angka", "Angka & Waktu"], ["tatabahasa", "Tata Bahasa"],
    ["percakapan", "Percakapan"], ["tantangan", "Tantangan"]
  ];
  const PRESETS = [
    ["Teal", "#2BB3A3", "#F4695F"],
    ["Biru", "#2E7CE4", "#F0A500"],
    ["Ungu", "#7A5AF0", "#F26FB2"],
    ["Rose", "#E5568C", "#00A6A6"],
    ["Hijau", "#3AA655", "#F0762B"],
    ["Oranye", "#E8722C", "#3E8EC0"]
  ];

  // ---------- Tema ----------
  const readTheme = () => {
    try { return JSON.parse(localStorage.getItem("pbm.theme")) || "light"; }
    catch { return "light"; }
  };
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("pbm.theme", JSON.stringify(t)); } catch { /* abaikan */ }
    $("themeBtn").textContent = t === "dark" ? "☀️" : "🌙";
  }

  // ---------- Simpan-cepat ----------
  let noteTimer = null;
  function saved() {
    $("savedNote").textContent = "Tersimpan ✓";
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => { $("savedNote").textContent = ""; }, 1400);
  }
  const save = (partial) => { B.save(partial); saved(); };

  // ---------- Gerbang PIN ----------
  function unlocked() { return sessionStorage.getItem("pbm.admin") === "1"; }
  function openAdmin() {
    $("gate").hidden = true;
    $("adminMain").hidden = false;
    renderAll();
  }
  $("gateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const pin = String(B.get().admin.pin ?? "");
    if ($("pinInput").value === pin) {
      sessionStorage.setItem("pbm.admin", "1");
      $("gateErr").textContent = "";
      openAdmin();
    } else {
      $("gateErr").textContent = "PIN salah. Coba lagi.";
      $("pinInput").select();
    }
  });

  // ---------- Render ----------
  function renderPresets() {
    $("presets").innerHTML = PRESETS.map((p) =>
      `<button type="button" class="preset" data-p="${p[1]}" data-s="${p[2]}">
        <span class="dot" style="background:${p[1]}"></span><span class="dot2" style="background:${p[2]}"></span>
        ${p[0]}</button>`).join("");
  }

  function renderGames() {
    const disabled = (B.get().games.disabled) || [];
    $("gameToggles").innerHTML = GAMES.map((g) => {
      const on = !disabled.includes(g[0]);
      return `<label class="toggle${on ? "" : " off"}">
        <input type="checkbox" data-game="${g[0]}" ${on ? "checked" : ""}>
        <span class="tg-emoji" aria-hidden="true">${g[2]}</span>
        <span class="tg-name">${g[1]}</span>
      </label>`;
    }).join("");
  }

  function renderFocusOptions() {
    $("fFocus").innerHTML = FOCUS.map((f) => `<option value="${f[0]}">${f[1]}</option>`).join("");
  }

  function fillFields() {
    const c = B.get();
    $("fName").value = c.brand.name || "";
    $("fTag").value = c.brand.tagline || "";
    $("fLogo").value = c.brand.logo || "";
    $("fPrimary").value = c.brand.primary || "#2BB3A3";
    $("fPrimaryHex").value = (c.brand.primary || "").toUpperCase();
    $("fSecondary").value = c.brand.secondary || "#F4695F";
    $("fSecondaryHex").value = (c.brand.secondary || "").toUpperCase();
    $("fLevel").value = c.defaults.level || "beginner";
    $("fFocus").value = c.defaults.focus || "all";
    $("fQuestions").value = c.defaults.questions ?? 30;
    $("fPin").value = c.admin.pin ?? "";
    updateQNote();
    $("adminSubtitle").textContent = c.brand.name || "Kelola tampilan & permainan";
    updatePreview();
  }

  function updateQNote() {
    const n = parseInt($("fQuestions").value, 10) || 30;
    $("qNote").textContent =
      `Setiap ronde berisi ${n} soal. Materi yang jumlahnya memang terbatas ` +
      `(mis. angka 1–10, lawan kata, dialog) akan diulang dengan jarak — ` +
      `pengulangan justru membantu anak menghafal.`;
  }

  function updatePreview() {
    const c = B.get();
    $("pvName").textContent = c.brand.name || "Papa Bonski Mandarin";
    const logo = $("pvLogo");
    logo.replaceChildren();
    if (c.brand.logoImage) {
      const img = document.createElement("img");
      img.src = c.brand.logoImage;
      img.alt = "";
      img.className = "pv-logo-img";
      logo.appendChild(img);
    } else logo.textContent = c.brand.logo || "🐻";
    $("contrastNote").textContent =
      "Warna judul & tombol otomatis disesuaikan agar teks tetap lolos WCAG AA (kontras ≥ 4.5) di tema terang maupun gelap.";
  }

  function renderAll() {
    renderPresets();
    renderGames();
    renderFocusOptions();
    fillFields();
    $("themeBtn").textContent = document.documentElement.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
  }

  // ---------- Validasi warna ----------
  const isHex = (v) => /^#?[0-9a-fA-F]{6}$/.test(v);
  const norm = (v) => (v[0] === "#" ? v : "#" + v).toLowerCase();

  // ---------- Ikatan input ----------
  $("fName").addEventListener("input", (e) => { save({ brand: { name: e.target.value } }); updatePreview(); $("adminSubtitle").textContent = e.target.value || "Kelola tampilan & permainan"; });
  $("fTag").addEventListener("input", (e) => save({ brand: { tagline: e.target.value } }));
  $("fLogo").addEventListener("input", (e) => { save({ brand: { logo: e.target.value } }); updatePreview(); });

  const bindColor = (picker, hex, key) => {
    $(picker).addEventListener("input", (e) => {
      const v = e.target.value;
      $(hex).value = v.toUpperCase();
      save({ brand: { [key]: v } }); updatePreview();
    });
    $(hex).addEventListener("input", (e) => {
      const v = e.target.value.trim();
      if (!isHex(v)) return;
      $(picker).value = norm(v);
      save({ brand: { [key]: norm(v) } }); updatePreview();
    });
  };
  bindColor("fPrimary", "fPrimaryHex", "primary");
  bindColor("fSecondary", "fSecondaryHex", "secondary");

  $("fLevel").addEventListener("change", (e) => save({ defaults: { level: e.target.value } }));
  $("fFocus").addEventListener("change", (e) => save({ defaults: { focus: e.target.value } }));
  $("fQuestions").addEventListener("input", (e) => {
    const n = parseInt(e.target.value, 10);
    if (!Number.isFinite(n) || n < 5 || n > 50) return; // biarkan sampai valid
    save({ defaults: { questions: n } });
    updateQNote();
  });
  $("fPin").addEventListener("input", (e) => save({ admin: { pin: e.target.value } }));

  // Delegasi klik: preset & toggle game.
  document.addEventListener("click", (e) => {
    const pr = e.target.closest(".preset");
    if (pr) {
      save({ brand: { primary: pr.dataset.p, secondary: pr.dataset.s } });
      fillFields();
      return;
    }
    if (e.target === $("themeBtn")) {
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    }
  });

  $("gameToggles").addEventListener("change", (e) => {
    const cb = e.target.closest("input[data-game]");
    if (!cb) return;
    const disabled = new Set((B.get().games.disabled) || []);
    if (cb.checked) disabled.delete(cb.dataset.game);
    else disabled.add(cb.dataset.game);
    save({ games: { disabled: [...disabled] } });
    cb.closest(".toggle").classList.toggle("off", !cb.checked);
  });

  // ---------- Data ----------
  $("exportBtn").addEventListener("click", () => {
    const data = JSON.stringify(B.exportable(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "config.json"; a.click();
    URL.revokeObjectURL(url);
    saved();
  });

  $("importFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        B.save(json);
        renderAll();
        saved();
      } catch {
        $("savedNote").style.color = "var(--text-danger)";
        $("savedNote").textContent = "File config.json tidak valid.";
        setTimeout(() => { $("savedNote").style.color = ""; $("savedNote").textContent = ""; }, 2500);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  });

  $("resetBtn").addEventListener("click", () => {
    if (!confirm("Kembalikan semua pengaturan ke bawaan? Perubahan lokal akan hilang.")) return;
    B.resetLocal();
    renderAll();
    saved();
  });

  $("clearBoardBtn").addEventListener("click", () => {
    if (!confirm("Kosongkan papan bintang untuk perangkat ini?")) return;
    try { localStorage.removeItem("pbm.board"); } catch { /* abaikan */ }
    saved();
  });

  // ---------- Init ----------
  applyTheme(readTheme());
  if (unlocked()) openAdmin();
  else $("pinInput").focus();
})();
