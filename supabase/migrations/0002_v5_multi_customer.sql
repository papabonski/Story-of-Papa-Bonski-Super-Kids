-- Papa Bonski Super Kids V5.1 — multi-customer commerce layer
create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_code text unique not null default ('PBSK-C-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  name text not null,
  email text,
  whatsapp text,
  status text not null default 'active' check (status in ('lead','active','suspended','expired')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index if not exists customers_email_unique on public.customers(lower(email)) where email is not null;

create table if not exists public.customer_users (
  customer_id uuid not null references public.customers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  primary key(customer_id,user_id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), sku text unique not null, name text not null,
  product_type text not null default 'subscription', active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  code text unique not null, name text not null, duration_days integer, story_limit integer,
  metadata jsonb not null default '{}'::jsonb, active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), provider text not null default 'orderhero',
  external_order_id text, customer_id uuid references public.customers(id) on delete set null,
  product_sku text, amount numeric(14,2), currency text not null default 'IDR',
  status text not null default 'pending', buyer_email text, buyer_phone text,
  raw_payload jsonb not null default '{}'::jsonb, paid_at timestamptz, created_at timestamptz not null default now()
);
create unique index if not exists orders_provider_external_unique on public.orders(provider, external_order_id) where external_order_id is not null;
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null, source_order_id uuid references public.orders(id) on delete set null,
  status text not null default 'active' check(status in ('active','past_due','suspended','expired','cancelled')),
  starts_at timestamptz not null default now(), expires_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id) on delete cascade,
  key text not null, value jsonb not null default 'true'::jsonb, expires_at timestamptz,
  created_at timestamptz not null default now(), unique(customer_id,key)
);
create table if not exists public.attributions (
  id uuid primary key default gen_random_uuid(), customer_id uuid references public.customers(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  fbclid text, landing_path text, created_at timestamptz not null default now()
);
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(), provider text not null, event_key text,
  status text not null default 'received', payload jsonb not null, error text,
  received_at timestamptz not null default now(), processed_at timestamptz
);
create unique index if not exists webhook_events_provider_key_unique on public.webhook_events(provider,event_key) where event_key is not null;
create table if not exists public.activations (
  id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null, status text not null default 'active',
  activated_at timestamptz not null default now(), metadata jsonb not null default '{}'::jsonb
);

insert into public.products(sku,name,product_type) values ('PBSK-SUPER-KIDS','Papa Bonski Super Kids','subscription') on conflict(sku) do nothing;
insert into public.plans(product_id,code,name,duration_days,metadata)
select id,'PBSK-PREMIUM-1Y','Premium 1 Tahun',365,'{"app_access":true}'::jsonb from public.products where sku='PBSK-SUPER-KIDS'
on conflict(code) do nothing;

alter table public.customers enable row level security;
alter table public.customer_users enable row level security;
alter table public.orders enable row level security;
alter table public.subscriptions enable row level security;
alter table public.entitlements enable row level security;
alter table public.attributions enable row level security;
alter table public.activations enable row level security;
alter table public.webhook_events enable row level security;

-- Customer-facing read policies. Seller/server operations use service role.
drop policy if exists customers_member_read on public.customers;
create policy customers_member_read on public.customers for select using (exists(select 1 from public.customer_users cu where cu.customer_id=customers.id and cu.user_id=auth.uid()));
drop policy if exists customer_users_self_read on public.customer_users;
create policy customer_users_self_read on public.customer_users for select using(user_id=auth.uid());
drop policy if exists subscriptions_member_read on public.subscriptions;
create policy subscriptions_member_read on public.subscriptions for select using(exists(select 1 from public.customer_users cu where cu.customer_id=subscriptions.customer_id and cu.user_id=auth.uid()));
drop policy if exists entitlements_member_read on public.entitlements;
create policy entitlements_member_read on public.entitlements for select using(exists(select 1 from public.customer_users cu where cu.customer_id=entitlements.customer_id and cu.user_id=auth.uid()));
