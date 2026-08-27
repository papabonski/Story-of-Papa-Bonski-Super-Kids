-- Papa Bonski Super Kids V5.4 — OrderHero live integration
create table if not exists public.orderhero_product_mappings (
  id uuid primary key default gen_random_uuid(),
  match_type text not null check (match_type in ('sku','product_id','product_name')),
  match_value text not null,
  product_sku text not null default 'PBSK-SUPER-KIDS',
  plan_code text not null default 'PBSK-PREMIUM-1Y',
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  unique(match_type, match_value)
);

alter table public.orderhero_product_mappings enable row level security;
-- No browser policy: seller/server access uses service role only.

alter table public.webhook_events add column if not exists external_order_id text;
alter table public.webhook_events add column if not exists normalized jsonb;
alter table public.webhook_events add column if not exists http_headers jsonb;

create index if not exists webhook_events_received_at_idx on public.webhook_events(received_at desc);
create index if not exists webhook_events_external_order_idx on public.webhook_events(external_order_id);
create index if not exists orders_buyer_email_idx on public.orders(lower(buyer_email));

-- Optional seed. Replace/add mapping after seeing the real OrderHero product identifier.
insert into public.orderhero_product_mappings(match_type,match_value,product_sku,plan_code,notes)
values ('sku','PBSK-SUPER-KIDS','PBSK-SUPER-KIDS','PBSK-PREMIUM-1Y','Default Papa Bonski Super Kids mapping')
on conflict(match_type,match_value) do nothing;
