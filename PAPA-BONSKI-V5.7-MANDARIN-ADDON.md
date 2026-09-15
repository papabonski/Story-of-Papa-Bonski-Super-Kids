# Papa Bonski V5.7 — Mandarin sebagai Add-on Super Kids

## Model akses dan harga

Papa Bonski Mandarin memakai akun, Email Penerima, login OTP, aktivasi OrderHero, dan infrastruktur pelanggan yang sama dengan Papa Bonski Super Kids. Hak membuka modul Mandarin tetap dicatat sebagai `mandarin_access`, supaya pembelian add-on dapat dibedakan dari akses Super Kids.

| Pelanggan | Produk OrderHero | Harga | Syarat | Hak yang diberikan |
|---|---|---:|---|---|
| Belum memiliki Super Kids | `PBM-MANDARIN` | Rp25.000 | Email Penerima valid | Mandarin seumur hidup |
| Memiliki Super Kids aktif | `PBM-MANDARIN-MEMBER` | Rp15.000 | Login OTP dan akses Super Kids aktif | Mandarin seumur hidup pada akun yang sama |

Harga member tidak ditentukan hanya dari email yang diketik. Pengguna harus masuk dengan OTP, lalu server mengambil Email Penerima dan akun pelanggan dari sesi yang terverifikasi.

## Alur pelanggan

1. Pelanggan membuka `/mandarin/checkout`.
2. Sistem memeriksa Email Penerima.
3. Jika Mandarin sudah aktif, pelanggan diarahkan untuk login dan membuka aplikasi.
4. Jika Super Kids aktif, pelanggan login OTP dan mendapat checkout add-on Rp15.000.
5. Jika Super Kids tidak aktif, pelanggan mendapat checkout Mandarin Rp25.000.
6. Webhook OrderHero memvalidasi produk dan intent checkout, lalu menambahkan `mandarin_access` seumur hidup ke akun yang benar.
7. Semua pelanggan masuk melalui portal Papa Bonski Super Kids. Modul yang dimiliki dapat dipilih; modul yang belum dimiliki tetap terlihat dalam keadaan terkunci.

## Konfigurasi deployment

- `ORDERHERO_MANDARIN_CHECKOUT_URL`: form publik produk Rp25.000.
- `ORDERHERO_MANDARIN_PRODUCT_ID`: ID produk OrderHero Rp25.000.
- `ORDERHERO_MANDARIN_MEMBER_CHECKOUT_URL`: form khusus member Rp15.000. Default resmi: `https://papabonski.orderhero.id/form/papa-bonski-mandarin-member-super-kids`.
- `ORDERHERO_MANDARIN_MEMBER_PRODUCT_ID`: ID produk OrderHero Rp15.000. Default resmi: `6aa8b81d733fa8f8f8eb8966`.

Migrasi `supabase/migrations/0009_v57_mandarin_product.sql` mendaftarkan kedua SKU ke plan `PBM-MANDARIN-1Y` dengan durasi tanpa batas dan menormalkan akses aktif lama agar `expires_at` menjadi `NULL`. Migrasi harus diterapkan dan diverifikasi sebelum preview dipromosikan ke produksi.

## Urutan peluncuran

1. Siapkan produk dan form OrderHero Rp25.000 dan Rp15.000.
2. Tambahkan empat konfigurasi OrderHero ke environment Preview Vercel.
3. Deploy Preview dan uji tiga keadaan: pelanggan baru, member Super Kids, dan pemilik Mandarin aktif.
4. Uji satu pembayaran per jalur dengan nominal uji yang disetujui pemilik.
5. Terapkan migrasi Supabase produksi.
6. Promosikan deployment yang sudah lulus UAT ke `www.papabonski.com`.
7. Arahkan iklan Meta ke `/mandarin/checkout`; pemilihan harga dilakukan oleh aplikasi, bukan oleh iklan.
