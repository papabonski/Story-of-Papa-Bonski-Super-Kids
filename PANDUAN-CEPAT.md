# Panduan Cepat — Install Mykarakids (Tanpa Coding)

Versi ini dibuat supaya **pembeli bisa install sendiri** tanpa bantuan teknis,
tanpa install Node.js, tanpa buka SQL Editor, dan tanpa push kode ke GitHub
manual. Total waktu: **~10 menit**.

Ada 4 langkah. Ikuti urut dari atas ke bawah.

---

## Langkah 1 — Buat Project Supabase (2 menit)

1. Buka **[supabase.com](https://supabase.com)** → Sign up / Login → **New Project**.
2. Tunggu sampai project selesai dibuat (±1 menit).
3. Di menu kiri, buka **Project Settings → API**. Catat 3 hal ini (akan dipakai
   di Langkah 2):
   - **Project URL**
   - **anon public key**
   - **service_role key** (klik "Reveal" untuk melihatnya)
4. Masih di **Project Settings → Database**, catat juga **Database Password**
   (password yang kamu buat saat pertama kali membuat project). Kalau lupa,
   klik **Reset Database Password** untuk buat yang baru.

> Jangan bagikan `service_role key` dan `Database Password` ke siapa pun —
> keduanya punya akses penuh ke database kamu.

## Langkah 2 — Ambil API Key Gemini (1 menit)

1. Buka **[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**.
2. Login dengan akun Google, klik **Create API Key**.
3. Catat key-nya.

## Langkah 3 — Klik Deploy, Isi Key (3 menit)

1. Klik tombol di bawah ini (ganti dulu link-nya kalau kamu reseller — lihat
   catatan di `README.md`):

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=GANTI_DENGAN_URL_GITHUB_REPO_KAMU&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,GEMINI_API_KEY,STORY_WORKER_SECRET&envDescription=Cara%20dapatkan%20semua%20key%20ini%20ada%20di%20PANDUAN-CEPAT.md&project-name=mykarakids&repository-name=mykarakids)

2. Login/daftar ke Vercel (bisa pakai akun GitHub/Google, gratis).
3. Vercel akan minta kamu isi 5 kolom. Isi begini:

   | Kolom di Vercel | Isi dengan |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL dari Langkah 1 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key dari Langkah 1 |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key dari Langkah 1 |
   | `GEMINI_API_KEY` | key dari Langkah 2 |
   | `STORY_WORKER_SECRET` | bebas, ketik teks acak apa saja (min. 20 karakter) — ini juga jadi password `/setup` dan `/admin` kamu |

4. Klik **Deploy**. Tunggu 1-2 menit sampai selesai.
5. Klik **Visit** untuk membuka aplikasi kamu yang sudah online.

## Langkah 4 — Selesaikan Setup di Dalam App (2 menit)

1. Di aplikasi yang baru online, buka halaman **`/setup`**
   (contoh: `https://nama-app-kamu.vercel.app/setup`).
2. **Setup Database Otomatis** — tempel Database Password dari Langkah 1 dan
   Worker Secret dari Langkah 3, klik **Jalankan Setup Database**. Semua
   tabel & storage dibuat otomatis, tidak perlu SQL manual.
3. **Aktifkan Anonymous Auth** — klik link yang muncul, nyalakan toggle
   **Anonymous** di dashboard Supabase, balik ke `/setup`, klik **Cek Status**.
   Ini satu-satunya langkah yang harus diklik manual di Supabase (aturan dari
   Supabase sendiri, tidak bisa dinyalakan dari luar dashboard mereka).
4. **Tes Gemini API Key** — klik **Tes Sekarang** untuk memastikan key valid.
5. Kalau ketiga langkah sudah ✓ hijau semua — aplikasi siap dipakai. Buka
   halaman utama dan coba buat 1 cerita untuk memastikan semuanya jalan.

---

## Setelah itu

- **Ganti nama, warna, logo:** buka `/admin` di aplikasi kamu (password =
  `STORY_WORKER_SECRET` yang kamu isi di Langkah 3).
- **Mau custom lebih dalam (kode, harga paket, tema cerita):** lihat
  `WHITELABEL.md`.
- **Setup manual/advanced** (kalau deploy button tidak cocok untuk kasusmu,
  misalnya mau self-host di server sendiri): lihat `DEPLOY.md` dan
  `PANDUAN-INSTALL.md`.

## Kalau reseller: siapkan sekali, buyer tinggal klik

Tombol "Deploy with Vercel" di atas butuh 1 kali setup dari kamu sebagai
penjual:

1. Push folder project ini ke **repo GitHub Public** milik kamu sendiri
   (sekali saja).
2. Ganti `GANTI_DENGAN_URL_GITHUB_REPO_KAMU` di tombol atas dengan URL repo
   kamu, contoh: `https://github.com/username-kamu/mykarakids`.
3. Setelah itu, **setiap pembeli** cukup klik tombol yang sama — Vercel
   otomatis meng-clone repo kamu ke akun GitHub pembeli masing-masing (bukan
   akun kamu), lalu deploy ke Vercel milik mereka sendiri. Kamu tidak perlu
   push manual atau deploy-kan satu-satu per pembeli.
