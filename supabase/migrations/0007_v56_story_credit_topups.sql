-- Papa Bonski Super Kids V5.6 — paid story credit top-ups
--
-- Base plan still includes 2 story credits.
-- Extra credits are granted by paid OrderHero top-up orders and never disappear
-- when a story is deleted. A top-up does not extend the subscription duration.

create table if not exists public.story_credit_grants (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  order_id uuid not null unique references public.orders(id) on delete cascade,
  credits integer not null check (credits > 0),
  product_sku text not null,
  source text not null default 'orderhero_topup',
  granted_at timestamptz not null default now()
);

create index if not exists story_credit_grants_customer_idx
  on public.story_credit_grants(customer_id, granted_at);

alter table public.story_credit_grants enable row level security;
-- Server/service-role only. No browser policy by design.

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
  -- Serialize reservations for the same customer to prevent double-spend.
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
    and (s.expires_at is null or s.expires_at > now())
    and p.active = true
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

  -- Idempotent retry for the same story ID.
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
  values (p_customer_id, p_user_id, p_story_id, 'credit');

  v_used := v_used + 1;

  return query
    select true, v_limit, v_used, greatest(v_limit - v_used, 0);
end;
$$;

revoke all on function public.reserve_story_credit(uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function public.reserve_story_credit(uuid, uuid, uuid) to service_role;
