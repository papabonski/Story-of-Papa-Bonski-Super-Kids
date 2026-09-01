-- Papa Bonski Super Kids V5.5 — permanent story quota per customer account
-- Included package: PBSK-PREMIUM-1Y = 2 lifetime story credits.
-- Usage is recorded permanently so deleting a story does not restore a credit.

update public.plans
set story_limit = 2
where code = 'PBSK-PREMIUM-1Y';

create table if not exists public.story_credit_usage (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  story_id uuid not null unique,
  source text not null default 'included',
  consumed_at timestamptz not null default now()
);

create index if not exists story_credit_usage_customer_idx
  on public.story_credit_usage(customer_id, consumed_at);

alter table public.story_credit_usage enable row level security;
-- Intentionally no browser policy. Quota consumption is server/service-role only.

-- Existing stories consume credits too. This keeps the quota fair when V5.5
-- is enabled on an account that already created stories during preview testing.
insert into public.story_credit_usage(customer_id, user_id, story_id, source, consumed_at)
select membership.customer_id, s.user_id, s.id, 'backfill', s.created_at
from public.stories s
join lateral (
  select cu.customer_id
  from public.customer_users cu
  join public.customers c on c.id = cu.customer_id
  where cu.user_id = s.user_id
  order by
    case when c.status = 'active' then 0 else 1 end,
    cu.created_at asc
  limit 1
) membership on true
on conflict(story_id) do nothing;

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
  into v_limit
  from public.subscriptions s
  join public.plans p on p.id = s.plan_id
  where s.customer_id = p_customer_id
    and s.status = 'active'
    and (s.expires_at is null or s.expires_at > now())
    and p.active = true
  order by s.created_at desc
  limit 1;

  v_limit := coalesce(v_limit, 0);

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
  values (p_customer_id, p_user_id, p_story_id, 'included');

  v_used := v_used + 1;

  return query
    select true, v_limit, v_used, greatest(v_limit - v_used, 0);
end;
$$;

create or replace function public.release_story_credit(
  p_customer_id uuid,
  p_story_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer := 0;
begin
  delete from public.story_credit_usage
  where customer_id = p_customer_id
    and story_id = p_story_id
    and source = 'included';

  get diagnostics v_deleted = row_count;
  return v_deleted > 0;
end;
$$;

revoke all on function public.reserve_story_credit(uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function public.reserve_story_credit(uuid, uuid, uuid) to service_role;
revoke all on function public.release_story_credit(uuid, uuid) from public, anon, authenticated;
grant execute on function public.release_story_credit(uuid, uuid) to service_role;
