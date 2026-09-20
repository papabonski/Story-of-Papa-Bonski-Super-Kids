-- Map the immutable OrderHero product IDs so webhook payloads that omit SKU
-- are still classified as Papa Bonski Matematika.

insert into public.orderhero_product_mappings (
  match_type,
  match_value,
  product_sku,
  plan_code,
  active,
  notes
)
values
  (
    'product_id',
    '6aad0ea160beee3e96830b4b',
    'PBMAT-MATEMATIKA',
    'PBMAT-MATEMATIKA-LIFETIME',
    true,
    'OrderHero Papa Bonski Matematika standard product ID'
  ),
  (
    'product_id',
    '6aad0fb660beee3e96830c96',
    'PBMAT-MATEMATIKA-MEMBER',
    'PBMAT-MATEMATIKA-LIFETIME',
    true,
    'OrderHero Papa Bonski Matematika member add-on product ID'
  )
on conflict (match_type, match_value) do update
set product_sku = excluded.product_sku,
    plan_code = excluded.plan_code,
    active = excluded.active,
    notes = excluded.notes;
