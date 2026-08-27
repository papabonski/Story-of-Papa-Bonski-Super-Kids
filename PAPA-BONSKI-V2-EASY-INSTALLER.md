# Papa Bonski Super Kids — V2 Easy Installer

## Instalasi cepat
1. Pastikan Node.js 20+ sudah terpasang.
2. Jalankan `npm install`.
3. Jalankan `npm run setup`.
4. Isi Supabase Project URL, anon key, service_role key, Gemini API key, dan password admin.
5. Buka Supabase → Authentication → Providers → aktifkan Anonymous.
6. Buka Supabase SQL Editor → jalankan seluruh isi `supabase/migrations/0001_init.sql`.
7. Jalankan `npm run dev`.
8. Buka `http://localhost:3000/setup` dan pastikan semua status hijau.
9. Jika siap, jalankan `npm run build` sebelum deploy.

## Yang dibuat otomatis
- `.env.local`
- `STORY_WORKER_SECRET` acak yang kuat
- password admin sesuai input
- konfigurasi Gemini dan queue dasar
- fallback KIE bila key opsional diisi

## Setup Checker
Halaman `/setup` memeriksa keberadaan konfigurasi, koneksi schema Supabase, dan validitas koneksi Gemini tanpa menampilkan nilai secret.
