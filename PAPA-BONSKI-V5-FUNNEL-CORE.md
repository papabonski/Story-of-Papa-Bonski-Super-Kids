# Papa Bonski Super Kids V5.1 — Funnel Core

## Tujuan
Satu platform Papa Bonski melayani banyak customer. Meta Ads/Lynk mengirim traffic, papabonski.com menjadi sales/app surface, OrderHero tetap checkout/payment, lalu webhook pembayaran mengaktifkan customer secara server-side.

## Instalasi upgrade dari V4
1. Jalankan SQL lama `supabase/migrations/0001_init.sql` bila project masih baru.
2. Jalankan `supabase/migrations/0002_v5_multi_customer.sql` di Supabase SQL Editor.
3. Isi environment V4 seperti biasa.
4. Konfigurasi `ORDERHERO_WEBHOOK_SECRET` setelah format/auth webhook di akun OrderHero sudah diketahui.
5. Endpoint penerima: `https://DOMAIN/api/orderhero/webhook`.

## Yang sudah dibangun
- commerce tables: customers, customer_users, products, plans, orders, subscriptions, entitlements, attributions, webhook_events, activations.
- RLS customer-facing untuk membership/subscription/entitlement.
- idempotent webhook event storage.
- OrderHero adapter terisolasi agar mapping payload dapat diubah tanpa merombak bisnis logic.
- payment-success provisioning: customer → order → subscription → entitlement → attribution → activation.
- Seller Center V5 dan daftar customer.

## Penting sebelum live
Schema payload dan signature webhook OrderHero belum boleh diasumsikan. Adapter `src/lib/commerce/orderhero.ts` sengaja diberi mapping konservatif dan harus disesuaikan dengan sample webhook nyata dari akun OrderHero sebelum production.

## Fase berikut
- seller authentication/authorization yang kuat.
- customer email/magic-link onboarding dan customer_users binding.
- sales page `/super-kids`, `/login`, `/app` entitlement gate.
- UTM handoff landing → OrderHero dan Meta Pixel/CAPI deduplication.
- webhook replay/test console di Seller Center.
