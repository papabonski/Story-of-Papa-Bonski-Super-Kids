# Papa Bonski Super Kids V5.5 — Seller Security & Operations

V5.5 dimulai setelah V5.4 Production Live dan fokus pada pengamanan area operasional internal sebelum volume transaksi dinaikkan.

## Tujuan

- Seller Center tidak boleh lagi dapat dibuka tanpa autentikasi.
- Data customer, webhook, mapping produk, dan URL webhook hanya terlihat setelah sesi admin tervalidasi.
- Menggunakan secret admin server-side yang sudah ada (`ADMIN_DASHBOARD_SECRET`, fallback `STORY_WORKER_SECRET`) sehingga tidak perlu secret baru untuk tahap awal.
- Sesi Seller Center disimpan sebagai cookie HttpOnly yang ditandatangani HMAC dan kedaluwarsa maksimal 12 jam.
- Menambahkan petunjuk login pertama untuk customer yang masih harus mengonfirmasi email sebelum OTP dapat dipakai.

## Route

- `/seller/login` — login internal Seller Center.
- `/seller` — dashboard seller, wajib sesi admin.
- `/seller/customers` — data customer, wajib sesi admin.
- `/seller/orderhero` — diagnostics webhook dan mapping, wajib sesi admin.
- `/seller/deploy` — deployment/integrasi seller, wajib sesi admin.

## Acceptance Criteria Slice A

1. Membuka `/seller`, `/seller/customers`, `/seller/orderhero`, atau `/seller/deploy` tanpa sesi harus diarahkan ke `/seller/login`.
2. Secret yang salah tidak membuat sesi.
3. Secret yang benar membuka Seller Center.
4. Logout menghapus sesi.
5. Cookie sesi HttpOnly, SameSite=Lax, Secure di production, dan maksimum 12 jam.
6. Customer login normal tetap bekerja dan menampilkan petunjuk konfirmasi email untuk login pertama.

## Fase berikut setelah Slice A PASS

- Webhook replay/test console di Seller Center.
- Health dashboard untuk `processed`, `ignored`, `needs_mapping`, dan error webhook.
- Audit Meta Pixel/CAPI + Purchase deduplication agar tracking iklan mempunyai satu sumber kebenaran.
