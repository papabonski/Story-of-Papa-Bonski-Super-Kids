# Papa Bonski Super Kids V5.4 — OrderHero Live Integration

V5.4 menyambungkan pembayaran OrderHero ke aktivasi Papa Bonski Super Kids secara server-side.

## Yang sudah dibangun

- Receiver `POST /api/orderhero/webhook`.
- Penyimpanan raw payload + hasil normalisasi untuk debugging aman.
- Deduplication webhook/order.
- Customer otomatis dibuat/dicocokkan berdasarkan email pembelian.
- Order berstatus paid dibuat/update.
- Mapping produk OrderHero ke plan Papa Bonski melalui tabel `orderhero_product_mappings`.
- Subscription + entitlement `super_kids_access` otomatis aktif.
- Attribution UTM/fbclid dipertahankan bila dikirim payload.
- Seller diagnostics di `/seller/orderhero`.
- Test command `npm run orderhero:test`.

## Migration

Jalankan setelah migration V5.3:

`supabase/migrations/0005_v54_orderhero_live_integration.sql`

## Keamanan webhook

Dokumentasi publik OrderHero mengonfirmasi plugin Webhook tersedia, tetapi tidak mempublikasikan schema payload/signature secara lengkap. Karena itu V5.4 mendukung dua mode:

1. `ORDERHERO_WEBHOOK_SECRET` — HMAC SHA-256 bila konfigurasi OrderHero Anda memang menyediakan signature header.
2. `ORDERHERO_WEBHOOK_TOKEN` — secret token URL/header sebagai fallback bila webhook tidak menyediakan signature.

Production tidak menerima webhook tanpa salah satu mekanisme tersebut.

## Setup live

1. Deploy V5.4 ke staging/production.
2. Isi `NEXT_PUBLIC_APP_URL=https://papabonski.com` dan secret webhook.
3. Buka `/seller/orderhero`.
4. Copy Webhook URL yang ditampilkan.
5. Di OrderHero: Plugin & Integrasi → Webhook → pasang URL tersebut untuk event order/payment yang relevan.
6. Lakukan satu order test.
7. Buka kembali `/seller/orderhero` dan lihat normalized payload.
8. Bila product SKU/ID/name berbeda, tambahkan mapping pada `orderhero_product_mappings`.
9. Pastikan event berakhir `processed`, lalu login customer menggunakan email order.

## Catatan penting

V5.4 sengaja tidak mengarang field payload OrderHero. Event live pertama disimpan agar field yang benar dari akun seller dapat dipetakan. Ini lebih aman daripada hard-code schema yang belum dikonfirmasi.
