# Papa Bonski V5.6 — Sales Launch Readiness

## Tujuan
V5.6 memindahkan fokus dari pembangunan fitur aplikasi ke kesiapan penjualan: conversion landing page, checkout yang mudah dipahami, attribution campaign, tracking Meta, dan dashboard operasional Seller Center.

## Audit Production — baseline sebelum V5.6

### Funnel yang sudah bekerja
- Landing produk: `/super-kids`
- Pre-checkout: `/super-kids/checkout`
- OrderHero live checkout untuk Paket Super Kids 1, +3 cerita, +8 cerita
- Buyer email dan Recipient email dipisahkan dengan aman
- OrderHero paid webhook mengaktifkan customer/subscription/top-up
- Member login memakai Email Penerima + OTP
- Seller Center memonitor customer, order, webhook, dan readiness

### Temuan conversion/tracking
1. Landing sudah menjelaskan fitur, tetapi value proposition masih terlalu feature-first. V5.6 mengubah hero menjadi problem/benefit-first dan memperjelas apa yang terjadi setelah bayar.
2. Attribution UTM/fbclid dapat hilang ketika visitor berpindah dari root brand page ke `/super-kids`, karena tracker sebelumnya menimpa localStorage dengan attribution kosong. V5.6 memperbaiki persistence ini.
3. `ViewContent` sebelumnya dikirim sebagai Meta custom event. V5.6 mengirim event standard Meta untuk event standard seperti `ViewContent`.
4. Internal database saat audit memiliki event funnel, tetapi belum ada order attribution UTM/fbclid. Ini konsisten dengan traffic test yang belum membawa UTM Meta.
5. Production HTML saat audit tidak memuat Meta Pixel script. Karena script hanya aktif jika `NEXT_PUBLIC_META_PIXEL_ID` tersedia, Pixel ID Production harus diverifikasi sebelum campaign conversion diluncurkan.
6. Purchase source of truth tetap OrderHero paid webhook / `orders.status='paid'`. Meta Purchase tidak boleh ditembak hanya dari halaman thank-you tanpa verifikasi pembayaran.

## Perubahan V5.6 Preview

### Landing page
- Headline benefit-first: “Bukan sekadar cerita. Cerita tentang anak Anda.”
- Problem examples: susah tidur, sayur, takut sekolah, gadget
- Offer lebih jelas: Rp50.000 = 2 cerita personal + akses 1 tahun
- Trust strip: OTP email, tanpa Play Store, akses 1 tahun
- Penjelasan Email Penerima vs Email Pembeli dibuat lebih sederhana
- CTA berulang dan sticky mobile CTA
- FAQ diperluas untuk mengurangi kebingungan setelah pembayaran
- Tidak menggunakan testimonial atau klaim sosial yang belum memiliki bukti nyata

### Checkout UX
- Judul diubah menjadi “Siapa yang akan memakai Papa Bonski?”
- Email Penerima dijelaskan sebagai email login/access, bukan istilah teknis lisensi
- Email Pembeli dijelaskan baru diisi pada langkah OrderHero
- Self purchase dan gift tetap mengikuti ownership rules V5.4

### Tracking
- UTM/fbclid dipertahankan antar halaman dan tidak lagi dihapus ketika query string kosong
- Meta `ViewContent` menjadi standard event
- `InitiateCheckout` mengirim value Rp50.000 / IDR
- First-party event collector tetap menyimpan event ke Supabase
- Seller Center mendapat halaman `/seller/sales`

### Seller Center — Sales Funnel
Menampilkan:
- BrandHomeView 7 hari
- ViewContent 7 hari
- InitiateCheckout 7 hari
- Paid orders dan revenue 7 hari
- Indicative conversion ratios
- Meta Pixel readiness
- Attribution source/campaign 30 hari
- UTM test link

## Offer launch

### Paket utama
**Papa Bonski Super Kids 1 — Rp50.000**
- Akses 1 tahun
- 2 cerita personal
- Ilustrasi personal
- Audio narasi
- Moral, doa, panduan orang tua
- Koleksi cerita
- Bonus English Learning

### Top-up member
- +3 cerita — Rp50.000
- +8 cerita — Rp120.000
- Tidak memperpanjang masa akses
- Ownership selalu ke akun member yang sedang login

## Meta Ads tracking contract
Gunakan landing langsung ke `/super-kids`, bukan root brand page.

Template URL:

`/super-kids?utm_source=meta&utm_medium=paid_social&utm_campaign=superkids_launch&utm_content=video_problem_01`

Naming minimum:
- `utm_source=meta`
- `utm_medium=paid_social`
- `utm_campaign=<campaign_name>`
- `utm_content=<creative_name>`

`fbclid` dibiarkan ditambahkan Meta otomatis.

## Launch gate
V5.6 baru boleh dipromosikan ke Production setelah:
1. Preview build READY.
2. Landing mobile + desktop tampil benar.
3. CTA masuk ke Recipient Email step dengan UTM tetap ada.
4. UTM test menghasilkan `ViewContent` dan `InitiateCheckout` di Sales Funnel.
5. Meta Pixel Production ID sudah dikonfigurasi dan `ViewContent` terlihat di Meta Events Manager/test flow.
6. Satu transaksi test dengan UTM menghasilkan order paid dan attribution row yang sesuai.
7. OrderHero webhook health tetap tanpa error baru.
8. Login member dan Seller Center tidak regresi.

## Hal yang sengaja ditunda
- `admin.papabonski.com`
- kosmetik Seller Center tambahan
- fitur aplikasi baru yang tidak meningkatkan conversion atau launch reliability

Fokus setelah V5.6: campaign launch, creative testing, dan optimasi berdasarkan data nyata.
