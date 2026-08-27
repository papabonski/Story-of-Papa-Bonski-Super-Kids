# Papa Bonski Super Kids V5.2 — Customer Login & Automatic Onboarding

## Tujuan
Customer tidak perlu menerima source code, npm, Supabase key, atau password admin. Customer cukup menggunakan email yang sama dengan checkout OrderHero.

## Alur customer
1. OrderHero mencatat pembayaran dan webhook V5.1 membuat/aktifkan customer + subscription.
2. Customer membuka `/login`.
3. Customer memasukkan email yang sama dengan transaksi.
4. Supabase Auth mengirim magic link.
5. Magic link kembali ke `/auth/callback` lalu `/onboarding`.
6. V5.2 mencocokkan email terverifikasi dengan `customers.email` dan membuat `customer_users` secara server-side.
7. Subscription + entitlement diperiksa.
8. Jika aktif, customer masuk `/app` dan dapat memasang PWA melalui `/install`.

## Setup yang diperlukan
- Jalankan migration `supabase/migrations/0003_v52_customer_onboarding.sql` setelah 0001 dan 0002.
- Supabase Authentication > URL Configuration harus mengizinkan domain production dan callback `https://DOMAIN/auth/callback`.
- Email Auth / OTP harus aktif di Supabase.
- Untuk production komersial set `REQUIRE_CUSTOMER_LOGIN=true`.

## URL utama
- `/login` — login tanpa password via email magic link.
- `/auth/callback` — callback Supabase.
- `/onboarding` — klaim customer otomatis berdasarkan email terverifikasi.
- `/app` — customer home.
- `/account/inactive` — subscription tidak aktif/expired.
- `/install` — PWA install guide.

## Catatan OrderHero
Webhook payload tetap menggunakan adapter V5.1. Pastikan `customers.email` menerima email buyer yang benar. Setelah field webhook OrderHero asli tersedia, mapping harus diverifikasi di `src/lib/commerce/orderhero.ts`.
