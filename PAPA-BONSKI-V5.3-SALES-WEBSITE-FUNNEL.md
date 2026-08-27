# Papa Bonski Super Kids V5.3 — Sales Website & Funnel Tracking

V5.3 mengubah root `/` menjadi website brand Papa Bonski dan menambahkan `/super-kids` sebagai sales page khusus aplikasi. Area customer tetap berada di `/login` dan `/app`.

## Route baru
- `/` — website brand Papa Bonski
- `/super-kids` — landing page penjualan Papa Bonski Super Kids
- `/thank-you` — halaman setelah transaksi/akses
- `/api/funnel/track` — first-party event collector

## Funnel
Meta Ads → `papabonski.com/super-kids` → OrderHero checkout → payment/webhook → customer + subscription → `/login` → `/app` → install PWA.

Lynk.id tetap digunakan sebagai product hub/link-in-bio. Produk PDF/low-ticket dapat tetap dijual melalui OrderHero dan diarahkan ke Super Kids sebagai upsell/retargeting.

## Environment V5.3
```env
NEXT_PUBLIC_SITE_URL="https://papabonski.com"
NEXT_PUBLIC_SUPER_KIDS_CHECKOUT_URL="https://...orderhero..."
NEXT_PUBLIC_META_PIXEL_ID=""
```

`NEXT_PUBLIC_SUPER_KIDS_CHECKOUT_URL` sengaja tidak di-hard-code karena URL checkout Super Kids perlu dibuat/ditetapkan di akun OrderHero Papa Bonski.

## Tracking
Landing menyimpan UTM/fbclid secara lokal dan meneruskannya ke checkout URL apabila memungkinkan. Event first-party disimpan ke `funnel_events` melalui endpoint server. Meta Pixel bersifat optional melalui `NEXT_PUBLIC_META_PIXEL_ID`.

Event awal V5.3:
- `BrandHomeView`
- `ViewContent` (Super Kids)
- `InitiateCheckout`
- `PostPurchaseLanding`

Untuk data database jalankan migration setelah V5.2:
`supabase/migrations/0004_v53_funnel_tracking.sql`

## Catatan OrderHero
V5.3 belum mengarang URL checkout Super Kids, payload webhook, atau signature OrderHero. Setelah checkout Super Kids dibuat, isi URL di env dan lakukan tes transaksi nyata/sandbox sesuai fitur akun OrderHero. Adapter webhook V5.1 tetap menjadi titik integrasi payment → activation.

## Meta Ads
Gunakan URL campaign dengan UTM konsisten, misalnya:
`https://papabonski.com/super-kids?utm_source=meta&utm_medium=paid&utm_campaign=superkids_launch&utm_content=video_bunda_01`

Pastikan event Purchase memiliki sumber kebenaran yang jelas di OrderHero/Meta dan gunakan deduplication bila Browser Pixel dan CAPI sama-sama mengirim Purchase.
