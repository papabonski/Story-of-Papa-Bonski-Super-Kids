-- Papa Bonski Matematika: shared-account product catalog and launch offer.
-- Standard/new customer: Rp25.000. Existing PBMan/PBSK member: Rp15.000.

insert into public.products (sku, name, product_type, active)
values
  ('PBMAT-MATEMATIKA', 'Papa Bonski Matematika', 'subscription', true),
  ('PBMAT-MATEMATIKA-MEMBER', 'Papa Bonski Matematika - Add-on Member', 'subscription', true)
on conflict (sku) do update
set name = excluded.name,
    product_type = excluded.product_type,
    active = excluded.active;

insert into public.plans (product_id, code, name, duration_days, metadata, active)
select
  id,
  'PBMAT-MATEMATIKA-LIFETIME',
  'Papa Bonski Matematika Seumur Hidup',
  null,
  '{"app_access":true,"entitlement_key":"matematika_access","lifetime_access":true}'::jsonb,
  true
from public.products
where sku = 'PBMAT-MATEMATIKA'
on conflict (code) do update
set product_id = excluded.product_id,
    name = excluded.name,
    duration_days = excluded.duration_days,
    metadata = excluded.metadata,
    active = excluded.active;

insert into public.orderhero_product_mappings (
  match_type, match_value, product_sku, plan_code, active, notes
)
values
  ('sku', 'PBMAT-MATEMATIKA', 'PBMAT-MATEMATIKA', 'PBMAT-MATEMATIKA-LIFETIME', true, 'Papa Bonski Matematika standard checkout'),
  ('sku', 'PBMAT-MATEMATIKA-MEMBER', 'PBMAT-MATEMATIKA-MEMBER', 'PBMAT-MATEMATIKA-LIFETIME', true, 'Papa Bonski Matematika verified member add-on')
on conflict (match_type, match_value) do update
set product_sku = excluded.product_sku,
    plan_code = excluded.plan_code,
    active = excluded.active,
    notes = excluded.notes;

insert into public.promotions (
  key, name, product_sku, coupon_code, quota, reservation_minutes, active, exclusive_group
)
values (
  'matematika-launch-50',
  '50 Pengguna Awal Papa Bonski Matematika',
  'PBMAT-MATEMATIKA',
  'MATEMATIKA50GRATIS',
  50,
  30,
  false,
  'papa-bonski-first-free-module'
)
on conflict (key) do update
set name = excluded.name,
    product_sku = excluded.product_sku,
    coupon_code = excluded.coupon_code,
    quota = excluded.quota,
    reservation_minutes = excluded.reservation_minutes,
    active = excluded.active,
    exclusive_group = excluded.exclusive_group,
    updated_at = now();

-- Keep all three Rp0 launch offers mutually exclusive per recipient email.
update public.promotions
set exclusive_group = 'papa-bonski-first-free-module',
    updated_at = now()
where key in ('super-kids-launch-50', 'mandarin-launch-50', 'matematika-launch-50');
