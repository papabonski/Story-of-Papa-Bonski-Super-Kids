# Papa Bonski Super Kids V5.5 — Seller Security & Operations

V5.5 dimulai setelah V5.4 Production Live dan fokus pada pengamanan serta operasional internal sebelum volume transaksi dinaikkan.

## Arsitektur Administrator

Seller Center diperlakukan sebagai sub-aplikasi administrator di codebase Papa Bonski yang sama.

- `/seller/login` — login administrator via Email + OTP.
- `/seller` — dashboard Seller Center.
- `/seller/customers` — customer dan status akses.
- `/seller/orderhero` — OrderHero health, mapping, webhook history, safe test, dan safe replay.
- `/seller/system` — system readiness.
- `/seller/deploy` — integrasi/deployment.
- `/admin`, `/setup`, dan legacy `/owner` hanya dapat dibuka setelah sesi Seller Center valid.

Link Seller Center tidak ditampilkan di aplikasi member atau checkout customer.

## Security Model

1. Administrator login menggunakan email allowlist + OTP Supabase.
2. Setelah OTP valid, server membuat sesi Seller Center khusus.
3. Sesi disimpan dalam cookie HttpOnly, SameSite=Lax, Secure di production, maksimum 12 jam.
4. Secret server (`ADMIN_DASHBOARD_SECRET`, fallback `STORY_WORKER_SECRET`) hanya digunakan di belakang layar untuk menandatangani sesi dan tidak perlu diketik administrator.
5. Logout menghapus sesi Seller Center.
6. Route internal dan endpoint replay/test memerlukan sesi Seller Center yang valid.

## Slice A — Secure Seller Center — PASS

UAT Preview telah membuktikan:

- `/seller` tanpa sesi kembali ke login OTP.
- OTP administrator berhasil dikirim dan diverifikasi.
- Dashboard Seller Center dapat dibuka.
- Customers dapat dibuka.
- OrderHero Live dapat dibuka.
- Logout menghapus sesi dan login ulang diperlukan.
- Login member normal tetap terpisah dari login administrator.

## Slice B — Webhook Health + Replay/Test Console — READY FOR UAT

Fitur:

- Ringkasan health webhook 24 jam: processed, ignored, needs_mapping, error.
- Histori webhook OrderHero dengan detail normalized/error.
- **Test Receiver Aman**: menguji receiver tanpa membuat order, subscription, atau story credit.
- **Replay Aman**: hanya tersedia untuk event `error` atau `needs_mapping` dan diproses sebagai delivery baru dengan proteksi idempotency yang sama dengan webhook normal.
- Mapping produk OrderHero tetap terlihat dalam Seller Center.

Acceptance criteria Slice B:

1. Health cards tampil dan angkanya konsisten dengan histori webhook.
2. Test Receiver Aman mengembalikan hasil sukses tanpa menambah order/customer/quota.
3. Replay hanya tersedia pada event yang memang memerlukan recovery.
4. Replay event lama tidak menggandakan subscription atau story credit.
5. Route replay/test tidak dapat digunakan tanpa sesi administrator.

## Slice C — Admin Surface Consolidation — READY FOR UAT

- System Readiness sekarang berada di `/seller/system`.
- Legacy `/owner` diarahkan ke Seller Center.
- `/admin` dan `/setup` dilindungi oleh sesi Seller Center.
- Internal readiness/configuration tidak lagi dapat dibuka sebagai halaman publik.

## Go to Production

V5.5 dapat dipromosikan ke `main` setelah Slice B dan Slice C lulus UAT Preview. Production V5.4 tidak diubah sebelum itu.

## Setelah V5.5

Audit Meta Pixel/CAPI dan Purchase deduplication akan dijadikan tahap marketing/measurement berikutnya agar tracking iklan mempunyai satu sumber kebenaran tanpa memperbesar scope keamanan V5.5.
