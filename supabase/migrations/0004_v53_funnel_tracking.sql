-- Papa Bonski Super Kids V5.3 — first-party funnel tracking
create table if not exists public.funnel_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  product_sku text,
  value numeric(14,2),
  path text,
  referrer text,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  fbclid text,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists funnel_events_created_at_idx on public.funnel_events(created_at desc);
create index if not exists funnel_events_campaign_idx on public.funnel_events(utm_campaign, event_name);
alter table public.funnel_events enable row level security;
-- No public policies: events are written through server/service-role endpoint only.
