-- Papa Bonski Super Kids V5.2 — customer login & automatic onboarding
-- Adds lightweight lifecycle metadata. Login itself uses Supabase Auth magic links.

alter table public.customers add column if not exists onboarded_at timestamptz;
alter table public.customers add column if not exists last_login_at timestamptz;
alter table public.customers add column if not exists onboarding_source text;

create index if not exists customer_users_user_id_idx on public.customer_users(user_id);
create index if not exists subscriptions_customer_status_idx on public.subscriptions(customer_id,status);
create index if not exists entitlements_customer_key_idx on public.entitlements(customer_id,key);

-- A verified authenticated user may read only their own customer membership.
-- Writes stay server-side through the service role claim flow.
drop policy if exists customer_users_self_read on public.customer_users;
create policy customer_users_self_read on public.customer_users
  for select using(user_id = auth.uid());
