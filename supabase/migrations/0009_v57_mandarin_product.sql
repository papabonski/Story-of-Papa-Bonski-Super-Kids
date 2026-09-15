-- Papa Bonski V5.7 — Papa Bonski Mandarin product and entitlement catalog.
-- OrderHero price model:
--   PBM-MANDARIN        = Rp25.000 (standalone/new customer)
--   PBM-MANDARIN-MEMBER = Rp15.000 (verified active Super Kids member)
-- Both SKUs grant the same Mandarin plan and entitlement in the shared account.
-- Safe to re-run: every seed uses an existing unique key.

insert into public.products (sku, name, product_type, active)
values ('PBM-MANDARIN', 'Papa Bonski Mandarin', 'subscription', true)
on conflict (sku) do update
set name = excluded.name,
    product_type = excluded.product_type,
    active = excluded.active;

insert into public.products (sku, name, product_type, active)
values ('PBM-MANDARIN-MEMBER', 'Papa Bonski Mandarin - Add-on Member', 'subscription', true)
on conflict (sku) do update
set name = excluded.name,
    product_type = excluded.product_type,
    active = excluded.active;

insert into public.plans (product_id, code, name, duration_days, metadata, active)
select
  id,
  'PBM-MANDARIN-1Y',
  'Papa Bonski Mandarin Seumur Hidup',
  null,
  '{"app_access":true,"entitlement_key":"mandarin_access","lifetime_access":true}'::jsonb,
  true
from public.products
where sku = 'PBM-MANDARIN'
on conflict (code) do update
set product_id = excluded.product_id,
    name = excluded.name,
    duration_days = excluded.duration_days,
    metadata = excluded.metadata,
    active = excluded.active;

insert into public.orderhero_product_mappings (
  match_type,
  match_value,
  product_sku,
  plan_code,
  active,
  notes
)
values (
  'sku',
  'PBM-MANDARIN',
  'PBM-MANDARIN',
  'PBM-MANDARIN-1Y',
  true,
  'Default Papa Bonski Mandarin mapping'
)
on conflict (match_type, match_value) do update
set product_sku = excluded.product_sku,
    plan_code = excluded.plan_code,
    active = excluded.active,
    notes = excluded.notes;

-- All Papa Bonski module access is lifetime. Keep the existing plan codes for
-- compatibility with paid orders and reports, but remove their time limit.
update public.plans
set duration_days = null,
    name = case
      when code = 'PBSK-PREMIUM-1Y' then 'Premium Seumur Hidup'
      when code = 'PBM-MANDARIN-1Y' then 'Papa Bonski Mandarin Seumur Hidup'
      else name
    end,
    metadata = metadata || '{"lifetime_access":true}'::jsonb
where code in ('PBSK-PREMIUM-1Y', 'PBM-MANDARIN-1Y');

-- Normalize currently active customers without reviving accounts that were
-- explicitly expired, cancelled, suspended, or marked past due.
update public.subscriptions s
set expires_at = null
from public.plans p
where s.plan_id = p.id
  and s.status = 'active'
  and p.code in ('PBSK-PREMIUM-1Y', 'PBM-MANDARIN-1Y');

update public.entitlements e
set expires_at = null
where e.key in ('super_kids_access', 'mandarin_access')
  and exists (
    select 1
    from public.subscriptions s
    join public.plans p on p.id = s.plan_id
    where s.customer_id = e.customer_id
      and s.status = 'active'
      and p.code in ('PBSK-PREMIUM-1Y', 'PBM-MANDARIN-1Y')
  );

-- In the modular portal, Mandarin subscriptions must never be mistaken for a
-- Super Kids story plan. Only the Super Kids plan contributes base credits.
create or replace function public.reserve_story_credit(
  p_customer_id uuid,
  p_user_id uuid,
  p_story_id uuid
)
returns table(
  ok boolean,
  story_limit integer,
  used integer,
  remaining integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base_limit integer := 0;
  v_extra_credits integer := 0;
  v_limit integer := 0;
  v_used integer := 0;
begin
  perform 1
  from public.customers
  where id = p_customer_id
  for update;

  if not found then
    return query select false, 0, 0, 0;
    return;
  end if;

  select coalesce(p.story_limit, 0)
  into v_base_limit
  from public.subscriptions s
  join public.plans p on p.id = s.plan_id
  where s.customer_id = p_customer_id
    and s.status = 'active'
    and p.active = true
    and p.code = 'PBSK-PREMIUM-1Y'
  order by s.created_at desc
  limit 1;

  v_base_limit := coalesce(v_base_limit, 0);

  select coalesce(sum(g.credits), 0)::integer
  into v_extra_credits
  from public.story_credit_grants g
  where g.customer_id = p_customer_id;

  v_limit := v_base_limit + v_extra_credits;

  select count(*)::integer
  into v_used
  from public.story_credit_usage u
  where u.customer_id = p_customer_id;

  if exists (
    select 1 from public.story_credit_usage u where u.story_id = p_story_id
  ) then
    return query
      select true, v_limit, v_used, greatest(v_limit - v_used, 0);
    return;
  end if;

  if v_limit <= 0 or v_used >= v_limit then
    return query
      select false, v_limit, v_used, greatest(v_limit - v_used, 0);
    return;
  end if;

  insert into public.story_credit_usage(customer_id, user_id, story_id, source)
  values (p_customer_id, p_user_id, p_story_id, 'included');

  v_used := v_used + 1;

  return query
    select true, v_limit, v_used, greatest(v_limit - v_used, 0);
end;
$$;

revoke all on function public.reserve_story_credit(uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function public.reserve_story_credit(uuid, uuid, uuid) to service_role;

insert into public.orderhero_product_mappings (
  match_type,
  match_value,
  product_sku,
  plan_code,
  active,
  notes
)
values (
  'sku',
  'PBM-MANDARIN-MEMBER',
  'PBM-MANDARIN-MEMBER',
  'PBM-MANDARIN-1Y',
  true,
  'Verified Super Kids member add-on mapping'
)
on conflict (match_type, match_value) do update
set product_sku = excluded.product_sku,
    plan_code = excluded.plan_code,
    active = excluded.active,
    notes = excluded.notes;
