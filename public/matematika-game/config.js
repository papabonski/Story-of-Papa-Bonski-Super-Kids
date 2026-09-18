/* ============================================================
   PAPA BONSKI MATEMATIKA — KONFIGURASI APLIKASI
   ============================================================
   File ini adalah pengaturan DEFAULT (permanen) aplikasi.
   Edit nilai di bawah, simpan, lalu deploy ulang — selesai.

   Catatan:
   - Pengaturan dari Panel Admin (admin.html) disimpan di
     localStorage browser dan MENIMPA nilai default di sini.
   - Untuk perubahan permanen bagi SEMUA pengunjung, edit file
     ini, bukan hanya lewat panel admin.
   ============================================================ */

window.APP_CONFIG = {
  /* ---------- BRANDING ---------- */
  appName: "Papa Bonski Matematika",
  tagline: "Belajar matematika jadi petualangan seru bersama Papa Bonski!",

  // Logo: pakai URL gambar (png/svg) ATAU kosongkan ("") agar
  // memakai logo huruf otomatis dari inisial appName.
  // Catatan: ikon aplikasi saat dipasang di HP diatur terpisah di
  // manifest.webmanifest (berkas di assets/icons/).
  logoUrl: "assets/icons/icon-192.png",

  /* ---------- WARNA TEMA ---------- */
  colorPrimary: "#E85D04",   // jingga utama Papa Bonski
  colorAccent:  "#FFB627",   // kuning aksen Papa Bonski
  colorSuccess: "#1D9E75",   // jawaban benar
  colorDanger:  "#E24B4A",   // jawaban salah

  /* ---------- FOOTER & KONTAK ---------- */
  footerText: "© 2026 Papa Bonski Matematika — Belajar Matematika Anak SD",
  contactWa: "",             // contoh: "6281234567890" (tanpa +). Kosongkan untuk sembunyikan tombol WA.
  contactLabel: "Hubungi Kami",

  /* ---------- PENGATURAN GAME ---------- */
  questionsPerRound: 10,        // jumlah soal per ronde (5-20)
  hearts: 3,                    // jumlah nyawa per ronde (ronde berakhir bila habis)
  enabledLevels: [1, 2, 3, 4],  // level yang aktif. contoh: [1,2] untuk sembunyikan level lain
  showLeaderboard: true,     // papan skor on/off
  soundEnabled: true,        // efek suara default on/off

  /* ---------- NAMA LEVEL (bisa diganti sesuai brand) ---------- */
  levelNames: {
    1: "Basic Math",
    2: "Daily Math",
    3: "Smart Math",
    4: "Master Math"
  },
  levelAges: {
    1: "Usia 6-7 tahun",
    2: "Usia 8-9 tahun",
    3: "Usia 10-12 tahun",
    4: "Tingkat lanjut"
  },

  /* ---------- ADMIN ---------- */
  // Password default panel admin. GANTI sebelum dijual/deploy!
  // Password juga bisa diganti dari dalam panel admin.
  adminPassword: "admin123"
};
