# Papa Bonski Super Kids V5.4.1b — OTP Login Fix

## Tujuan
Mengganti customer login berbasis magic link menjadi email OTP 6 digit agar lebih tahan terhadap email-security prefetch (terutama Outlook/Hotmail Safe Links) dan tidak bergantung pada redirect localhost.

## Flow
1. Customer membuka `/akses`.
2. Customer memasukkan email yang sama dengan checkout OrderHero.
3. Supabase Auth mengirim OTP 6 digit.
4. Customer memasukkan kode di halaman login.
5. Aplikasi memanggil `verifyOtp(..., type: "email")`.
6. Setelah session aktif, customer diarahkan ke `/onboarding`.
7. Onboarding menghubungkan user dengan customer berdasarkan email terverifikasi.
8. `super_kids_access` dan subscription diverifikasi sebelum `/app` dibuka.

## Supabase Email Template yang wajib
Di Supabase Dashboard → Authentication → Email Templates → Magic Link, template harus menggunakan `{{ .Token }}` dan tidak mengandalkan `{{ .ConfirmationURL }}`.

Contoh:

```html
<h2>Kode Masuk Papa Bonski Super Kids</h2>
<p>Gunakan kode OTP berikut:</p>
<p style="font-size:32px;font-weight:700;letter-spacing:8px">{{ .Token }}</p>
<p>Kode ini bersifat rahasia dan hanya dapat digunakan dalam waktu terbatas.</p>
```

## URL Configuration
Untuk kompatibilitas dan fallback, Site URL sebaiknya menunjuk ke deployment aktif, bukan localhost. Preview V5.4 saat pengujian:

`https://story-of-papa-bonski-super-kids-git-v54-orde-005e78-papa-bonski.vercel.app`

Production tetap tidak diubah sampai go-live disetujui.
