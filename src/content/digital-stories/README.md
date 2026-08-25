# Digital Stories Content

Setiap cerita digital dipisah ke file sendiri agar aman untuk 50+ cerita.

## Struktur

- `types.ts` - kontrak data `DigitalStory`, vocabulary, quiz, dan expression dialog.
- `helpers.ts` - helper Google Drive preview/view URL.
- `video1.ts`, `video2.ts`, dst. - konten lengkap per cerita.
- `placeholders.ts` - daftar cerita yang belum punya materi lengkap. Saat ini
  memuat Video 21-50 dari screenshot referensi sebagai halaman "Segera hadir".
- `index.ts` - registry final yang dipakai aplikasi.

## Cara tambah cerita baru

1. Jika ceritanya masih placeholder, tambahkan judulnya di `placeholders.ts`.
2. Jika materi lengkap sudah tersedia, buat file baru, misalnya `video21.ts`.
3. Export object `video21: DigitalStory`.
4. Hapus item video tersebut dari `placeholders.ts`.
5. Tambahkan import dan itemnya di `index.ts` pada posisi nomor yang sesuai.
6. Pastikan `id` mengikuti format `video21` agar route menjadi `/cerita/video/video21`.
