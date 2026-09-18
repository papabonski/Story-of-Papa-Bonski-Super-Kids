-- Papa Bonski V5.9 — first 50 Paket Cobain customers receive the base
-- Super Kids package for Rp0 in exchange for an honest testimonial request.
-- The promotion uses the same atomic reservation and follow-up tables as the
-- Mandarin launch promo, but has its own quota and OrderHero coupon.

insert into public.promotions (
  key, name, product_sku, coupon_code, quota, reservation_minutes, active
)
values (
  'super-kids-launch-50',
  '50 Pengguna Awal Papa Bonski Super Kids',
  'PBSK-SUPER-KIDS',
  'SUPERKIDS50GRATIS',
  50,
  30,
  false
)
on conflict (key) do update
set name = excluded.name,
    product_sku = excluded.product_sku,
    coupon_code = excluded.coupon_code,
    quota = excluded.quota,
    reservation_minutes = excluded.reservation_minutes,
    updated_at = now();
