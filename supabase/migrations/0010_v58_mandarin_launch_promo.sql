-- Papa Bonski V5.8 — launch promo for the first 50 new Mandarin customers.
-- OrderHero remains the checkout/coupon authority. This table provides an
-- atomic reservation, a public-safe remaining count, and testimonial follow-up.

create table if not exists public.promotions (
  key text primary key,
  name text not null,
  product_sku text not null references public.products(sku),
  coupon_code text not null,
  quota integer not null check (quota > 0),
  reservation_minutes integer not null default 30 check (reservation_minutes between 5 and 240),
  active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promo_claims (
  id uuid primary key default gen_random_uuid(),
  promotion_key text not null references public.promotions(key) on delete restrict,
  recipient_email text not null,
  slot_number integer not null check (slot_number > 0),
  checkout_intent_key text,
  customer_id uuid references public.customers(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  status text not null default 'reserved' check (status in ('reserved','activated','expired','released')),
  reserved_at timestamptz not null default now(),
  reservation_expires_at timestamptz not null,
  activated_at timestamptz,
  feedback_due_at timestamptz,
  feedback_submitted_at timestamptz,
  last_reminded_at timestamptz,
  reminder_count integer not null default 0 check (reminder_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (promotion_key, recipient_email),
  unique (checkout_intent_key),
  unique (order_id)
);

create unique index if not exists promo_claims_active_slot_unique
  on public.promo_claims (promotion_key, slot_number)
  where status in ('reserved','activated');

create index if not exists promo_claims_followup_idx
  on public.promo_claims (feedback_due_at)
  where status = 'activated' and feedback_submitted_at is null;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  promo_claim_id uuid not null unique references public.promo_claims(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  rating smallint not null check (rating between 1 and 5),
  review text not null check (char_length(review) between 20 and 2000),
  publication_consent boolean not null default false,
  display_name text not null check (char_length(display_name) between 1 and 80),
  moderation_status text not null default 'submitted' check (moderation_status in ('submitted','approved','rejected')),
  submitted_at timestamptz not null default now(),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.promotions enable row level security;
alter table public.promo_claims enable row level security;
alter table public.testimonials enable row level security;

revoke all on public.promotions, public.promo_claims, public.testimonials from public, anon, authenticated;
grant select, insert, update, delete on public.promotions, public.promo_claims, public.testimonials to service_role;

insert into public.promotions (
  key, name, product_sku, coupon_code, quota, reservation_minutes, active
)
values (
  'mandarin-launch-50',
  '50 Pengguna Awal Papa Bonski Mandarin',
  'PBM-MANDARIN',
  'MANDARIN50GRATIS',
  50,
  30,
  false
)
on conflict (key) do update
set name = excluded.name,
    product_sku = excluded.product_sku,
    coupon_code = excluded.coupon_code,
    quota = excluded.quota,
    reservation_minutes = excluded.reservation_minutes,
    updated_at = now();

create or replace function public.reserve_promo_claim(
  p_promotion_key text,
  p_recipient_email text,
  p_checkout_intent_key text
)
returns table(
  reserved boolean,
  slot_number integer,
  remaining integer,
  coupon_code text,
  reservation_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_promo public.promotions%rowtype;
  v_email text := lower(trim(p_recipient_email));
  v_claim public.promo_claims%rowtype;
  v_has_claim boolean := false;
  v_used integer := 0;
  v_slot integer;
  v_expiry timestamptz;
begin
  -- Serialize all claims for one promotion so two buyers cannot receive slot 50.
  perform pg_advisory_xact_lock(hashtext(p_promotion_key));

  select * into v_promo
  from public.promotions
  where key = p_promotion_key
  for update;

  if not found or not v_promo.active
     or (v_promo.starts_at is not null and now() < v_promo.starts_at)
     or (v_promo.ends_at is not null and now() >= v_promo.ends_at) then
    return query select false, null::integer, 0, null::text, null::timestamptz;
    return;
  end if;

  update public.promo_claims
  set status = 'expired', updated_at = now()
  where promotion_key = p_promotion_key
    and status = 'reserved'
    and reservation_expires_at <= now();

  select * into v_claim
  from public.promo_claims
  where promotion_key = p_promotion_key and recipient_email = v_email
  for update;
  v_has_claim := found;

  select count(*)::integer into v_used
  from public.promo_claims
  where promotion_key = p_promotion_key
    and status in ('reserved','activated');

  if v_has_claim and v_claim.status = 'activated' then
    return query select false, v_claim.slot_number, greatest(v_promo.quota - v_used, 0), null::text, null::timestamptz;
    return;
  end if;

  if v_has_claim and v_claim.status = 'reserved' and v_claim.reservation_expires_at > now() then
    update public.promo_claims
    set checkout_intent_key = p_checkout_intent_key, updated_at = now()
    where id = v_claim.id;
    return query select true, v_claim.slot_number, greatest(v_promo.quota - v_used, 0), v_promo.coupon_code, v_claim.reservation_expires_at;
    return;
  end if;

  if v_used >= v_promo.quota then
    return query select false, null::integer, 0, null::text, null::timestamptz;
    return;
  end if;

  select s into v_slot
  from generate_series(1, v_promo.quota) s
  where not exists (
    select 1 from public.promo_claims c
    where c.promotion_key = p_promotion_key
      and c.slot_number = s
      and c.status in ('reserved','activated')
  )
  order by s
  limit 1;

  v_expiry := now() + make_interval(mins => v_promo.reservation_minutes);

  insert into public.promo_claims (
    promotion_key, recipient_email, slot_number, checkout_intent_key,
    status, reserved_at, reservation_expires_at, updated_at
  ) values (
    p_promotion_key, v_email, v_slot, p_checkout_intent_key,
    'reserved', now(), v_expiry, now()
  )
  on conflict (promotion_key, recipient_email) do update
  set slot_number = excluded.slot_number,
      checkout_intent_key = excluded.checkout_intent_key,
      status = 'reserved',
      reserved_at = now(),
      reservation_expires_at = excluded.reservation_expires_at,
      customer_id = null,
      order_id = null,
      activated_at = null,
      feedback_due_at = null,
      feedback_submitted_at = null,
      updated_at = now();

  return query select true, v_slot, greatest(v_promo.quota - v_used - 1, 0), v_promo.coupon_code, v_expiry;
end;
$$;

revoke all on function public.reserve_promo_claim(text, text, text) from public, anon, authenticated;
grant execute on function public.reserve_promo_claim(text, text, text) to service_role;
