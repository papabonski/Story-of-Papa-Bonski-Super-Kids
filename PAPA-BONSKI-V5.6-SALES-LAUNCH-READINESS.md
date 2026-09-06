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
- Everyday-routine examples: rutinitas tidur, makan sayur, persiapan sekolah, waktu layar
- Offer lebih jelas: Rp50.000 = 2 cerita personal + akses 1 tahun
- Trust strip: OTP email, tanpa Play Store, akses 1 tahun
- Penjelasan Email Penerima vs Email Pembeli dibuat lebih sederhana
- CTA berulang dan sticky mobile CTA
- FAQ diperluas untuk mengurangi kebingungan setelah pembayaran
- Tidak menggunakan testimonial atau klaim sosial yang belum memiliki bukti nyata
- Copy tidak memosisikan produk sebagai diagnosis, terapi, atau solusi kondisi kesehatan/perilaku; framing memakai momen, rutinitas, tema, dan pengalaman membaca

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
- Meta CAPI Preview sudah terhubung ke Dataset Papa Bonski dan connectivity test diterima Meta (`events_received=1`)
- Real `Purchase` dikirim server-side hanya dari OrderHero paid webhook
- CAPI `event_id` stabil per OrderHero order untuk retry safety
- Email buyer dinormalisasi dan di-hash SHA-256 sebelum dikirim sebagai matching signal
- CAPI timeout dibatasi 5 detik dan kegagalan Meta tidak boleh menggagalkan aktivasi customer/order
- Endpoint connectivity test sementara sudah dihapus setelah verifikasi berhasil

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

`/super-kids?utm_source=meta&utm_medium=paid_social&utm_campaign=superkids_launch&utm_content=routine_bedtime_01`

Naming minimum:
- `utm_source=meta`
- `utm_medium=paid_social`
- `utm_campaign=<campaign_name>`
- `utm_content=<creative_name>`

`fbclid` dibiarkan ditambahkan Meta otomatis.

## Meta Data Sharing Restrictions
Meta Events Manager pernah menampilkan peringatan `Data sharing restrictions applied`. Ini harus diperlakukan sebagai kebijakan/platform classification issue, bukan alasan untuk mencoba mengakali restriction.

Tindakan V5.6:
- browser event hanya membawa parameter commerce generik seperti product SKU, value, dan currency;
- copy landing dan launch creative menggunakan framing momen/rutinitas, bukan klaim kesehatan atau terapi;
- kategori yang Meta tetapkan harus diperiksa di `Events Manager → Data Source → Settings → Manage Data Source Categories`;
- jika kategori sensitif tidak menggambarkan Papa Bonski secara akurat, gunakan mekanisme review resmi Meta;
- status final restriction harus diketahui sebelum campaign Sales Production dinaikkan.

## Custom domain readiness
`papabonski.com` sudah dimiliki tetapi belum dihubungkan ke project Vercel. Cutover domain sengaja ditunda sampai V5.6 lolos launch gate agar domain publik tidak menunjuk ke build yang belum dipromosikan.

Rencana cutover:
1. Promote V5.6 yang sudah lulus UAT ke Production.
2. Tambahkan `papabonski.com` dan `www.papabonski.com` ke Vercel project.
3. Ikuti DNS record persis yang diberikan Vercel di Hostinger DNS Zone.
4. Pilih satu canonical host dan redirect host lainnya.
5. Set `META_EVENT_SOURCE_URL` Production ke canonical `/super-kids` bila diperlukan agar CAPI menggunakan public brand domain.
6. Verifikasi SSL, root page, `/super-kids`, checkout, OTP, dan webhook setelah DNS aktif.

## Launch gate
V5.6 baru boleh dipromosikan ke Production setelah:
1. ✅ Preview build READY.
2. ✅ Landing server-render dan checkout server-render tampil tanpa runtime error; visual mobile + desktop tetap perlu smoke check manusia sebelum promote.
3. ✅ Kode CTA mempertahankan UTM/fbclid sampai Recipient Email step; UTM test dashboard tetap perlu satu smoke check.
4. ⏳ UTM test menghasilkan `ViewContent` dan `InitiateCheckout` di Sales Funnel.
5. ✅ Meta Pixel Preview aktif dan CAPI connectivity sudah diterima Meta; status Data Source Category/Restrictions masih perlu review.
6. ⏳ Satu transaksi test dengan UTM menghasilkan order paid, attribution row, dan real CAPI Purchase.
7. ✅ OrderHero webhook integration tetap non-blocking terhadap Meta dan build/runtime sehat; final paid smoke test masih diperlukan.
8. ⏳ Login member dan Seller Center final regression smoke test.
9. ⏳ Setelah gate 1–8 PASS, promote Production lalu lakukan cutover `papabonski.com`.

## Hal yang sengaja ditunda
- `admin.papabonski.com`
- kosmetik Seller Center tambahan
- fitur aplikasi baru yang tidak meningkatkan conversion atau launch reliability

Fokus setelah V5.6: campaign launch, creative testing, dan optimasi berdasarkan data nyata.
