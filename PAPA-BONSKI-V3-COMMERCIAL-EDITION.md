# Papa Bonski Super Kids — V3 Commercial Edition

Versi ini disiapkan untuk proses jual, setup customer, pengecekan sebelum serah-terima, dan install PWA yang lebih mudah.

## Yang baru di V3

- `/owner` — Owner Center dengan commercial readiness meter.
- `/install` — halaman install PWA khusus customer, termasuk petunjuk Android dan iPhone/iPad.
- `npm run commercial:check` — memeriksa kelengkapan struktur paket sebelum build/deploy.
- `INSTALL-PAPA-BONSKI-WINDOWS.bat` — installer launcher untuk pengguna Windows.
- `RUN-PAPA-BONSKI-WINDOWS.bat` — menjalankan aplikasi lokal dan membuka Owner Center.
- `install-papa-bonski-mac-linux.sh` — launcher setup untuk macOS/Linux.
- Easy Setup ditingkatkan untuk mencatat nama customer, installation ID, dan production URL.

## Alur seller yang disarankan

1. Ekstrak ZIP.
2. Windows: klik `INSTALL-PAPA-BONSKI-WINDOWS.bat`. Mac/Linux: jalankan `./install-papa-bonski-mac-linux.sh`.
3. Isi wizard Easy Setup.
4. Aktifkan Anonymous Auth di Supabase.
5. Jalankan `supabase/migrations/0001_init.sql` di SQL Editor Supabase.
6. Jalankan aplikasi dan buka `/owner`.
7. Pastikan readiness 100%.
8. Tes alur cerita lengkap, gambar, audio, PDF, ZIP, share link, dan PWA.
9. Deploy ke domain produksi.
10. Berikan customer link `/install` agar pemasangan di HP mudah.

## Catatan lisensi

V3 belum memasang DRM/licensing server eksternal. Untuk produk yang source code-nya diberikan kepada pembeli, proteksi lisensi di dalam source tidak dapat dianggap anti-tamper. Jika model bisnis membutuhkan aktivasi lisensi yang kuat, buat service lisensi terpisah yang Anda kontrol dan jangan sertakan private signing key di source customer.

## Validasi sebelum release

```bash
npm run commercial:check
npm run typecheck
npm run build
```
