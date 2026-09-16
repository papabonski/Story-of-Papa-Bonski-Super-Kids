-- Papa Bonski Super Kids — one-story entry package with no quota expiry.
-- Existing active customers receive the same no-expiry treatment and keep
-- the two base credits included in their original purchase.

insert into public.story_credit_grants(customer_id, order_id, credits, product_sku, source)
select
  s.customer_id,
  s.source_order_id,
  1,
  'PBSK-LEGACY-BASE-CREDIT',
  'legacy_base_grandfather'
from public.subscriptions s
join public.plans p on p.id = s.plan_id
where p.code = 'PBSK-PREMIUM-1Y'
  and s.status = 'active'
  and s.source_order_id is not null
on conflict(order_id) do nothing;

update public.plans
set
  name = 'Paket Cobain',
  duration_days = null,
  story_limit = 1,
  metadata = coalesce(metadata, '{}'::jsonb) || '{"app_access":true,"quota_expires":false}'::jsonb
where code = 'PBSK-PREMIUM-1Y';

update public.subscriptions s
set expires_at = null
from public.plans p
where s.plan_id = p.id
  and p.code = 'PBSK-PREMIUM-1Y'
  and s.status = 'active';

update public.entitlements e
set expires_at = null
where e.key = 'super_kids_access'
  and exists (
    select 1
    from public.subscriptions s
    join public.plans p on p.id = s.plan_id
    where s.customer_id = e.customer_id
      and s.status = 'active'
      and p.code = 'PBSK-PREMIUM-1Y'
  );
