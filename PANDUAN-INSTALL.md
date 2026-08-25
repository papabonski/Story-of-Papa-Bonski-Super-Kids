# Panduan Instalasi Lengkap — Vercel + Supabase

Panduan langkah demi langkah untuk menjalankan aplikasi **Genius Kids** dari nol
hingga online di Vercel. Aplikasi ini sekarang bukan hanya pembuat cerita AI,
tetapi juga platform storybook anak yang mendukung profil anak reusable, review
teks sebelum generate gambar/audio, share link privat, export PDF/ZIP, progress
baca, PWA, cerita anak digital English, job queue server-side, dan dashboard
admin white-label.

Aplikasi ini memakai **Next.js 15 + React 19**, database **Supabase**, dan AI dari
**Google AI Studio (Gemini)** untuk cerita, gambar, dan suara. Gambar juga bisa
memakai **KIE Nano Banana** yang gratis untuk pemula.

### Fitur utama versi terbaru

- **Profil anak reusable**: orang tua dapat menyimpan beberapa profil anak
  berisi nama, usia, gender, foto, dan deskripsi karakter.
- **Template masalah anak hari ini**: pilihan cepat seperti susah tidur,
  tidak mau makan sayur, sering marah, takut sekolah, dan terlalu banyak gadget.
- **Editor cerita sebelum aset**: teks cerita direview dulu; gambar/audio baru
  dibuat setelah disetujui untuk menghemat biaya AI.
- **Quality check AI**: cerita divalidasi ringan agar aman, konsisten, dan nilai
  Islami tidak terasa menggurui.
- **Job queue server-side**: proses generate tetap bisa dilanjutkan oleh worker
  walau browser ditutup, lengkap dengan tombol cek worker dan diagnostik autokick.
- **Share link privat**: keluarga/guru bisa membaca satu cerita via token tanpa
  login dan tanpa melihat koleksi lain.
- **Export premium**: PDF storybook dan ZIP lengkap berisi gambar, audio, teks,
  dan cover.
- **Reading progress**: badge belum dibaca/sedang dibaca/selesai, favorit, dan
  waktu baca.
- **Level bahasa dan gaya ilustrasi**: Balita/TK/SD awal/SD besar serta preset
  watercolor, 3D cartoon, pastel storybook, anime soft, dan paper cutout.
- **PWA**: bisa di-install di HP/tablet dan punya halaman offline.
- **Cerita Anak Digital (English)**: katalog video English dengan PDF,
  ringkasan, vocabulary IPA+TTS, dan latihan soal.
- **Admin white-label**: ubah brand, warna, provider AI, suara TTS, limit, tema,
  dan harga paket dari dashboard admin.

---

## Daftar Isi

1. [Yang perlu disiapkan](#1-yang-perlu-disiapkan)
2. [Ambil kode proyek](#2-ambil-kode-proyek)
3. [Siapkan Supabase (database)](#3-siapkan-supabase-database)
4. [Ambil kunci AI (Gemini & KIE)](#4-ambil-kunci-ai-gemini--kie)
5. [Konfigurasi environment variables](#5-konfigurasi-environment-variables)
6. [Coba jalankan di komputer (opsional tapi disarankan)](#6-coba-jalankan-di-komputer-opsional-tapi-disarankan)
7. [Deploy ke Vercel](#7-deploy-ke-vercel)
8. [Uji end-to-end](#8-uji-end-to-end)
9. [Kustomisasi merek & admin white-label](#9-kustomisasi-merek-branding-dan-admin-white-label)
10. [Hemat biaya & kuota](#10-hemat-biaya--kuota)
11. [Mengatasi masalah umum](#11-mengatasi-masalah-umum)
12. [Checklist sebelum go-live](#12-checklist-sebelum-go-live)

---

## 1. Yang perlu disiapkan

**Akun (semua ada versi gratis):**
- [GitHub](https://github.com) — untuk menyimpan kode
- [Supabase](https://supabase.com) — database, penyimpanan foto/gambar, login anonim
- [Google AI Studio](https://aistudio.google.com/app/apikey) — kunci Gemini (cerita, gambar, suara)
- [Vercel](https://vercel.com) — hosting aplikasi
- (Opsional) [KIE.ai](https://kie.ai/api-key) — gambar Nano Banana gratis untuk pemula

**Alat di komputer (hanya jika ingin coba lokal / langkah 6):**
- [Node.js 20 LTS](https://nodejs.org) (minimal 18.18+)
- [Git](https://git-scm.com)

> Jika tidak mau ribet, Anda bisa langsung deploy ke Vercel tanpa menjalankan di
> komputer. Tapi mencoba lokal dulu sangat membantu memastikan semuanya benar.

---

## 2. Ambil kode proyek

**Pilihan A — Fork ke GitHub Anda (disarankan untuk deploy Vercel):**
1. Buka repositori proyek di GitHub.
2. Klik **Fork** (kanan atas) agar tersalin ke akun GitHub Anda.

**Pilihan B — Clone ke komputer:**
```bash
git clone https://github.com/<akun-anda>/hellokids.git
cd hellokids
npm install
```

---

## 3. Siapkan Supabase (database)

### 3.1 Buat project
1. Masuk ke https://supabase.com → **New project**.
2. Isi nama, **Database Password** (simpan baik-baik), dan pilih **Region**
   terdekat (mis. *Southeast Asia (Singapore)*).
3. Tunggu beberapa menit sampai project selesai dibuat.

### 3.2 Aktifkan login anonim
Aplikasi ini tidak punya halaman login — setiap perangkat otomatis mendapat
identitas sendiri lewat **Anonymous sign-in**.

1. Menu kiri → **Authentication** → **Providers** (atau **Sign In / Providers**).
2. Cari **Anonymous** → **Enable** → **Save**.

### 3.3 Jalankan skema database (WAJIB)
1. Menu kiri → **SQL Editor** → **New query**.
2. Buka file **`supabase/migrations/0001_init.sql`** dari proyek, salin **seluruh
   isinya**, tempel ke editor, lalu klik **Run**.
3. File ini adalah **satu SQL gabungan** untuk semua fitur terbaru. Sekali jalan
   ia membuat tabel `children`, `stories`, `scenes`, `story_jobs`, dan
   `white_label_settings`; kolom review teks, share token, progress baca,
   language level, illustration style, audio timings; semua aturan keamanan
   **RLS**; dan dua **storage bucket**:
   - `child-photos` → **privat** (foto wajah anak, akses lewat signed URL)
   - `story-assets` → **publik** (ilustrasi & audio hasil generate)
4. File ini **idempotent** — aman dijalankan ulang kalau perlu. Untuk project
   lama, menjalankan ulang file ini juga menambahkan kolom/tabel fitur baru yang
   belum ada.

> **Penting:** kalau langkah ini dilewati, pembuatan cerita akan error karena
> tabel/kolom belum ada.

### 3.4 Ambil kunci API Supabase
Menu kiri → **Project Settings** → **API**, lalu catat:

| Nilai di Supabase | Dipakai sebagai env |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| Project API keys → **anon** **public** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Project API keys → **service_role** (RAHASIA) | `SUPABASE_SERVICE_ROLE_KEY` |

> `service_role` bisa melewati semua keamanan RLS. **Jangan pernah** ditaruh di
> kode klien atau di variabel berawalan `NEXT_PUBLIC_`. Cukup di server/Vercel.

---

## 4. Ambil kunci AI (Gemini & KIE)

### 4.1 Google AI Studio (WAJIB — cerita, gambar, suara)
1. Buka https://aistudio.google.com/app/apikey.
2. **Create API key** → salin nilainya → jadi `GEMINI_API_KEY`.

Kuota gratis Gemini terbatas, terutama untuk **gambar**. Agar lebih lancar Anda
boleh menyiapkan beberapa kunci (dari project Google yang sah milik Anda) dan
mengisi `GEMINI_API_KEYS` (dipisah koma). Aplikasi akan bergilir antar-kunci dan
otomatis pindah kunci saat kena limit.

> Jika `GEMINI_API_KEYS` berisi 3+ kunci dan tidak ada pool khusus per-peran,
> kunci dibagi otomatis: kunci 1/4/7 untuk **gambar**, 2/5/8 untuk **cerita**,
> 3/6/9 untuk **audio**. Untuk kendali penuh, isi `GEMINI_IMAGE_API_KEYS`,
> `GEMINI_STORY_API_KEYS`, dan `GEMINI_AUDIO_API_KEYS`.

### 4.2 KIE Nano Banana (OPSIONAL — gambar gratis / cadangan)
Kalau kuota gambar Gemini habis, aplikasi bisa otomatis memakai **KIE Nano
Banana** sebagai cadangan gratis (akun baru dapat kredit gratis).

1. Buka https://kie.ai/api-key → salin token → jadi `KIE_API_KEY`.
2. Cukup isi `KIE_API_KEY`; cadangan otomatis aktif saat Gemini kena limit.
3. Ingin Nano Banana jadi mesin gambar **utama**? Set:
   `IMAGE_PROVIDER="kie"` dan `IMAGE_MODEL="google/nano-banana"`.

---

## 5. Konfigurasi environment variables

Semua kunci di atas dimasukkan sebagai *environment variables*. Untuk uji lokal,
buat file **`.env.local`** di root proyek (jangan di-commit). Untuk produksi,
nilai yang sama dimasukkan di **Vercel** (langkah 7).

Template minimal `.env.local` (isi dengan nilai Anda):

```env
# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="kunci-anon-public"
SUPABASE_SERVICE_ROLE_KEY="kunci-service-role-RAHASIA"
STORY_WORKER_SECRET="rahasia-worker-panjang"
STORY_WORKER_AUTOKICK="true"
# STORY_WORKER_AUTOKICK_LIMIT="5"
# CRON_SECRET="rahasia-cron-panjang-opsional"
# ADMIN_DASHBOARD_SECRET="rahasia-admin-opsional"

# --- AI (Gemini wajib) ---
GEMINI_API_KEY="kunci-google-ai-studio"
# Opsional: kumpulan kunci
# GEMINI_API_KEYS="kunci1,kunci2,kunci3"

# --- Gambar hemat & gratis (opsional) ---
IMAGE_RESOLUTION="1K"        # 1K (~1080px) paling murah; 2K/4K lebih mahal
# KIE_API_KEY="token-kie"    # cadangan gratis Nano Banana saat Gemini limit
```

**Referensi variabel penting:**

| Variabel | Wajib? | Fungsi |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Kunci publik Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Kunci server (rahasia) untuk generate aset |
| `STORY_WORKER_SECRET` | ✅ | Secret server-side untuk job queue/background worker |
| `STORY_WORKER_AUTOKICK` | – | Isi `true` agar worker langsung dipicu saat job dibuat; isi `false` hanya jika memakai worker/cron terpisah |
| `CRON_SECRET` | – | Secret untuk endpoint cron `/api/jobs/cron`; wajib jika ingin menjalankan cron aman |
| `ADMIN_DASHBOARD_SECRET` | – | Password dashboard admin; jika kosong memakai `STORY_WORKER_SECRET` |
| `GEMINI_API_KEY` | ✅ | Kunci Gemini (cerita/gambar/suara) |
| `GEMINI_API_KEYS` | – | Beberapa kunci Gemini (dipisah koma) |
| `GEMINI_IMAGE_API_KEYS` / `_STORY_` / `_AUDIO_` | – | Pool kunci per-peran |
| `IMAGE_RESOLUTION` | – | `1K` (default, termurah), `2K`, atau `4K` |
| `KIE_API_KEY` | – | Cadangan gambar Nano Banana (gratis) |
| `IMAGE_PROVIDER` / `IMAGE_MODEL` | – | Ganti mesin gambar (mis. `kie` / `google/nano-banana`) |
| `STORY_MODEL` / `TTS_MODEL` / `TTS_VOICE` | – | Override model cerita/suara |
| `NEXT_PUBLIC_STORY_QUEUE_POLL_MS` / `MAX_POLLS` | – | Interval polling progress job queue di browser |

> Daftar lengkap beserta penjelasan ada di file **`.env.example`**.

Tambahan env yang sering dipakai untuk worker:

- `STORY_WORKER_AUTOKICK_LIMIT`: jumlah job yang diproses saat autokick. Default
  `5`, maksimum `20`.
- `NEXT_PUBLIC_STORY_QUEUE_NUDGE_EVERY_POLLS`: seberapa sering browser menekan
  ulang endpoint job untuk memicu worker. Default `4` polling.

**Cara mengisi secret worker dan cron**

- `STORY_WORKER_SECRET`: isi dengan teks acak panjang, bukan API key Supabase/Gemini.
  Secret ini dipakai server untuk memanggil `/api/jobs/process`.
- `STORY_WORKER_AUTOKICK`: isi `true` untuk mayoritas deploy Vercel. Jika `false`,
  cerita bisa stuck di "Antrean teks" kecuali ada cron/worker eksternal yang jalan.
- `STORY_WORKER_AUTOKICK_LIMIT`: opsional. Default `5`, artinya sekali autokick
  worker mengambil sampai 5 job antrean. Untuk produksi kecil-menengah, nilai ini
  sudah cukup.
- `CRON_SECRET`: isi dengan teks acak panjang lain jika memakai cron ke
  `/api/jobs/cron`. Secret ini dikirim sebagai header `Authorization: Bearer <CRON_SECRET>`.

Buat secret acak dari terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Contoh nilai aman:

```env
STORY_WORKER_SECRET="9f4b0e2f8c1a4a0e9b2d7c6f5a1e3d8c9b0a7f6e5d4c3b2a1f0e9d8c7b6a5f4"
STORY_WORKER_AUTOKICK="true"
CRON_SECRET="7a3c9e0f1d2b4a6c8e9f0123456789abcdef0123456789abcdef0123456789"
```

Gunakan nilai yang Anda generate sendiri, jangan memakai contoh di atas.

**Penting setelah mengisi env di Vercel**

1. Pastikan env diterapkan ke environment **Production**.
2. Klik **Redeploy**. Env baru tidak aktif pada deployment lama.
3. Setelah live, buat 1 cerita uji. Jika loading antrean lebih dari 90 detik,
   klik tombol **Cek worker sekarang** di layar loading.
4. Jika tombol menampilkan error seperti `HTTP 401`, cek apakah
   `STORY_WORKER_SECRET` di Vercel sudah sama dan tidak ada spasi tambahan.

---

## 6. Coba jalankan di komputer (opsional tapi disarankan)

```bash
npm install          # sekali saja
npm run dev          # buka http://localhost:3000
```

Uji cepat koneksi AI (mengetes kunci Gemini untuk cerita, gambar, dan audio):
```bash
npm run test:live
```

Cek build produksi berjalan tanpa error:
```bash
npm run build
```

Kalau `npm run dev` sudah bisa membuat 1 cerita utuh, berarti konfigurasi Anda
benar dan siap di-deploy.

---

## 7. Deploy ke Vercel

1. Push kode ke GitHub (kalau belum): `git push`.
2. Buka https://vercel.com → **Add New… → Project** → **Import** repositori Anda.
3. Framework akan terdeteksi otomatis sebagai **Next.js** (biarkan default).
4. Buka **Environment Variables**, lalu masukkan **semua** variabel dari
   `.env.local` (langkah 5) satu per satu:
   - Ketik **Name** (mis. `GEMINI_API_KEY`) dan **Value**.
   - Terapkan ke environment **Production** (dan Preview/Development bila mau).
   - Untuk worker, minimal isi `STORY_WORKER_SECRET` dan `STORY_WORKER_AUTOKICK=true`.
5. Klik **Deploy** dan tunggu sampai selesai.
6. Buka domain `*.vercel.app` yang diberikan.

> **Catatan lisensi:** paket **Hobby** Vercel gratis untuk non-komersial. Untuk
> pemakaian komersial (white-label dijual), gunakan paket **Pro**.

**Setiap update kode:** cukup `git push` ke GitHub — Vercel otomatis deploy ulang.

**Setiap update env:** buka Deployments → pilih deployment terbaru → **Redeploy**.

---

## 8. Uji end-to-end

Di aplikasi yang sudah online:
1. **Buat / pilih profil anak**: simpan nama, usia, gender, foto, dan deskripsi
   karakter agar cerita berikutnya lebih cepat dan konsisten.
2. Pilih **Masalah Anak Hari Ini** atau tema/subtema manual, lalu pilih level
   bahasa dan gaya ilustrasi.
3. Generate **teks cerita dulu**. Baca preview judul, opener, scene, moral, doa,
   dan panduan orang tua.
4. Jika perlu, klik **Regenerate scene ini**, **buat lebih lucu**, **lebih
   Islami**, atau edit manual.
5. Setelah teks disetujui, lanjutkan generate gambar/audio. Job queue akan
   menyimpan status proses di server.
6. Jika layar loading menampilkan **Antrean belum diambil server**, klik
   **Cek worker sekarang**. Pesan baru akan memberi tahu apakah autokick gagal,
   secret belum ada, atau worker perlu dicek di log Vercel.
7. Buka **flipbook**: gambar tampil, narasi tersorot per kata, audio berjalan.
8. Coba fitur lanjutan: **share link privat**, **export PDF**, **download ZIP**,
   favorit, dan lanjutkan baca dari halaman terakhir.
9. Buka menu **Cerita Anak Digital (English)**, cek video, PDF, ringkasan,
   vocabulary IPA+TTS, expression dialog, dan latihan soal.

Kalau ilustrasi masih berupa gambar placeholder polos, artinya kuota gambar
sedang habis — lihat bagian [Hemat biaya & kuota](#10-hemat-biaya--kuota) dan
[Mengatasi masalah](#11-mengatasi-masalah-umum).

---

## 9. Kustomisasi merek (branding) dan admin white-label

Ada dua cara mengubah brand:

**A. Lewat dashboard admin (disarankan untuk buyer/reseller)**
1. Buka `/admin`.
2. Masukkan `ADMIN_DASHBOARD_SECRET` (atau `STORY_WORKER_SECRET` jika secret admin
   tidak diisi).
3. Ubah brand, warna, provider AI, model gambar, suara TTS, katalog tema, limit
   cerita/profil anak, dan harga paket.
4. Simpan. Data tersimpan di tabel `white_label_settings`.

**B. Lewat file konfigurasi**
- **`config/brand.ts`** — `name`, `tagline`, `subtagline`, `logoEmoji` (atau
  `logoSrc` ke gambar di `/public`), dan `colors` (palet warna).
- **`config/themes.ts`** — katalog tema & sub-tema cerita.
- **`config/providers.ts`** — model/suara default (atau lewat env di Vercel).

Detail lengkap ada di **`WHITELABEL.md`**.

---

## 10. Hemat biaya & kuota

- **Tetap di `IMAGE_RESOLUTION="1K"`** (~1080px) — paling murah dan ramah kuota
  gratis. 2K/4K ditagih lebih mahal per gambar.
- **Manfaatkan review teks dulu**. Gambar/audio baru dibuat setelah cerita
  disetujui, sehingga biaya AI tidak terbuang untuk draft yang akan diedit.
- **Isi `KIE_API_KEY`** agar ada cadangan gambar Nano Banana gratis saat Gemini
  kena limit — cerita tetap dapat ilustrasi asli, bukan placeholder.
- **Beri kunci khusus gambar** lewat `GEMINI_IMAGE_API_KEYS="k1,k2,k3"` supaya
  generate gambar tidak berebut kuota dengan cerita/audio.
- Perkiraan panggilan per buku: cerita 1–2×, ilustrasi sesuai jumlah scene,
  narasi opener + setiap scene. Kuota gratis Google bisa berubah menurut model & region
  — pantau di AI Studio / Google Cloud.

---

## 11. Mengatasi masalah umum

**Gambar tampil sebagai figur polos (placeholder), bukan ilustrasi asli**
→ Kuota gambar Gemini habis. Isi `KIE_API_KEY` (cadangan gratis), tambah kunci
gambar (`GEMINI_IMAGE_API_KEYS`), atau aktifkan billing di Google. Placeholder
akan otomatis diganti gambar asli saat Anda buka ulang ceritanya dari beranda.

**Error saat membuat cerita / "kolom tidak ditemukan"**
→ Skema belum dijalankan atau belum lengkap. Ulangi [langkah 3.3](#33-jalankan-skema-database-wajib)
(jalankan `0001_init.sql`). File-nya aman dijalankan ulang.

**Audio "masih antre" / lama**
→ Normal saat kuota TTS sibuk; aplikasi menunggu lalu mencoba lagi otomatis.
Menyiapkan beberapa kunci audio (`GEMINI_AUDIO_API_KEYS`) mempercepat.

**"API key Gemini belum di-set"**
→ `GEMINI_API_KEY` (atau `GEMINI_API_KEYS`) belum terisi di `.env.local`/Vercel.
Setelah menambah env di Vercel, lakukan **Redeploy**.

**Foto anak tidak muncul / gagal upload**
→ Pastikan bucket `child-photos` & `story-assets` ada (dibuat oleh `0001_init.sql`)
dan login **Anonymous** sudah **Enable** di Supabase.

**Cerita macet di "menyiapkan gambar/audio"**
→ Ini berarti row job sudah tersimpan, tetapi worker belum berhasil mengambilnya.
Lakukan urutan berikut:

1. Pastikan `STORY_WORKER_SECRET` ada di Vercel **Production**.
2. Pastikan `STORY_WORKER_AUTOKICK=true`.
3. Setelah menambah/mengubah env, lakukan **Redeploy**.
4. Buka lagi halaman cerita dan klik **Cek worker sekarang**.
5. Jika muncul `Autokick worker gagal HTTP 401`, secret salah/tidak terbaca.
6. Jika muncul `Worker sudah dipanggil, tetapi antrean belum berubah status`,
   buka Vercel → Logs → cari request `/api/jobs/process`.
7. Cek tabel `story_jobs`: job `queued` lama berarti worker tidak berjalan;
   job `failed` berarti ada error AI/database di `last_error`.

Tes cron manual:

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" https://domain-anda.vercel.app/api/jobs/cron
```

Tes worker langsung:

```bash
curl -X POST https://domain-anda.vercel.app/api/jobs/process \
  -H "Content-Type: application/json" \
  -H "x-story-worker-secret: <STORY_WORKER_SECRET>" \
  -d "{\"limit\":1,\"workerId\":\"manual-test\"}"
```

**Dashboard admin tidak bisa menyimpan**
→ Pastikan `SUPABASE_SERVICE_ROLE_KEY` dan `ADMIN_DASHBOARD_SECRET` benar, lalu jalankan
ulang `0001_init.sql` agar tabel `white_label_settings` tersedia.

**Tombol install PWA tidak muncul di HP/tablet**
→ PWA butuh domain HTTPS, manifest, dan service worker. Di Vercel sudah HTTPS otomatis;
setelah deploy, buka ulang dari Chrome/Edge/Safari mobile lalu pilih **Add to Home Screen**.

**Vocabulary TTS di Cerita Anak Digital tidak bersuara**
→ Browser harus mengizinkan audio. Klik dulu tombol speak pada satu kata; jika suara masih
tidak ada, cek volume perangkat dan dukungan Web Speech API browser.

**Sudah ubah env di Vercel tapi tidak berpengaruh**
→ Env baru butuh **Redeploy**. Buka Deployments → **Redeploy**.

---

## 12. Checklist sebelum go-live

- [ ] `config/brand.ts` sudah di-rebrand (lihat `WHITELABEL.md`)
- [ ] Project Supabase dibuat; **Anonymous auth aktif**
- [ ] Skema satu file dijalankan (`0001_init.sql`) — tabel + RLS + bucket ada
- [ ] Semua env di Vercel Production terisi (Supabase + `GEMINI_API_KEY`/`GEMINI_API_KEYS` + `STORY_WORKER_SECRET` + `STORY_WORKER_AUTOKICK=true`)
- [ ] Setelah mengubah env, deployment sudah di-**Redeploy**
- [ ] `IMAGE_RESOLUTION=1K` (dan `KIE_API_KEY` bila ingin cadangan gratis)
- [ ] Dashboard `/admin` bisa login dan menyimpan pengaturan brand/limit/provider
- [ ] PWA berhasil di-install di HP/tablet dari domain produksi
- [ ] `npm run build` lolos tanpa error
- [ ] Uji end-to-end 1× (profil anak → review teks → gambar/audio job queue → flipbook → penutup)
- [ ] Uji fitur premium: share link privat, export PDF, download ZIP, favorit/progress baca
- [ ] Uji menu **Cerita Anak Digital (English)**: video, PDF, vocabulary IPA+TTS, expression dialog, latihan soal
- [ ] Paket Vercel sesuai (Pro untuk komersial)
- [ ] Konten doa/cerita ditinjau kualitasnya untuk audiens Anda

---

## Catatan privasi (penting)

Foto anak diunggah ke bucket Supabase **privat** dan hanya dipakai untuk menjaga
konsistensi wajah pada ilustrasi. Menghapus cerita **tidak** otomatis menghapus
foto anak — tambahkan langkah pembersihan atau fitur "hapus data saya" bila
wilayah hukum Anda mewajibkannya (mis. COPPA/GDPR). **Minta persetujuan orang
tua** sebelum mengumpulkan foto anak.
