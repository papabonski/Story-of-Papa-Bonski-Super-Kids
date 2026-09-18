/* Papa Bonski Matematika — pemasangan aplikasi (PWA)
   Tombol pemasangan selalu tersedia dan memberi petunjuk sesuai perangkat. */
(function () {
  "use strict";

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () { /* abaikan */ });
    });
  }

  var headerButton = document.getElementById("btn-install");
  var welcomeButton = document.getElementById("btn-install-welcome");
  var modal = document.getElementById("install-modal");
  var steps = document.getElementById("install-steps");
  var action = document.getElementById("install-action");
  var intro = document.getElementById("install-modal-intro");
  if (!headerButton || !modal || !steps || !action || !intro) return;

  var deferredPrompt = null;
  var ua = navigator.userAgent || "";
  var isIOS = /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  var isInApp = /FBAN|FBAV|Instagram|Line\/|TikTok/i.test(ua);
  var isStandalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    navigator.standalone === true;

  function setSteps(items) {
    steps.innerHTML = "";
    items.forEach(function (item, index) {
      var row = document.createElement("div");
      row.className = "install-step";
      row.innerHTML = '<span class="install-step-num">' + (index + 1) + '</span><span>' + item + '</span>';
      steps.appendChild(row);
    });
  }

  function prepareInstructions() {
    action.hidden = true;
    action.textContent = "Pasang sekarang";

    if (isStandalone) {
      intro.textContent = "Aplikasi sudah terpasang di perangkat ini.";
      setSteps(["Cari ikon Papa Bonski Matematika di layar utama.", "Ketuk ikonnya untuk mulai belajar."]);
      return;
    }

    if (deferredPrompt) {
      intro.textContent = "Perangkat ini siap memasang aplikasi.";
      setSteps(["Ketuk tombol Pasang sekarang.", "Konfirmasi Pasang pada layar browser.", "Buka dari ikon di layar utama."]);
      action.hidden = false;
      return;
    }

    if (isInApp) {
      intro.textContent = "Browser di dalam aplikasi tidak mendukung pemasangan langsung.";
      setSteps(["Buka menu ⋮ atau Bagikan pada browser ini.", "Pilih Buka di Chrome (Android) atau Buka di Safari (iPhone).", "Di browser tersebut, buka lagi menu lalu pilih Pasang atau Tambahkan ke Layar Utama."]);
      return;
    }

    if (isIOS) {
      intro.textContent = "Gunakan Safari agar aplikasi bisa dipasang di iPhone atau iPad.";
      setSteps(["Ketuk tombol Bagikan (kotak dengan panah ke atas).", "Geser lalu pilih Tambahkan ke Layar Utama.", "Ketuk Tambah."]);
      return;
    }

    if (isAndroid) {
      intro.textContent = "Pasang melalui menu browser Android.";
      setSteps(["Ketuk menu ⋮ di kanan atas.", "Pilih Pasang aplikasi atau Tambahkan ke layar utama.", "Ketuk Pasang."]);
      return;
    }

    intro.textContent = "Pasang melalui Chrome atau Edge di komputer.";
    setSteps(["Cari ikon pasang di ujung kanan kolom alamat.", "Klik Pasang.", "Aplikasi akan terbuka di jendela sendiri."]);
  }

  function openModal() {
    prepareInstructions();
    modal.hidden = false;
    document.body.classList.add("modal-open");
    var closeButton = modal.querySelector(".install-modal-close");
    if (closeButton) closeButton.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
  });

  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    isStandalone = true;
    closeModal();
    headerButton.style.display = "none";
    if (welcomeButton) welcomeButton.style.display = "none";
  });

  function requestInstall() {
    if (!deferredPrompt) {
      prepareInstructions();
      return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function () {
      deferredPrompt = null;
      prepareInstructions();
    });
  }

  headerButton.addEventListener("click", openModal);
  if (welcomeButton) welcomeButton.addEventListener("click", openModal);
  action.addEventListener("click", requestInstall);
  modal.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-install-close")) closeModal();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  if (isStandalone) {
    headerButton.style.display = "none";
    if (welcomeButton) welcomeButton.style.display = "none";
  }
})();
