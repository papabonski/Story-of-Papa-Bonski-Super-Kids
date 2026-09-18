-- One account may use only one Rp0 launch offer. The group column keeps the
-- rule reusable for future module promotions without coupling it to SKU names.
alter table public.promotions
  add column if not exists exclusive_group text;

update public.promotions
set exclusive_group = 'papa-bonski-first-free-module',
    updated_at = now()
where key in ('super-kids-launch-50', 'mandarin-launch-50');

create index if not exists promo_claims_recipient_status_idx
  on public.promo_claims (recipient_email, status);

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
  -- Serialize by recipient before promotion. This prevents two simultaneous
  -- checkouts from reserving the Super Kids and Mandarin free offers together.
  perform pg_advisory_xact_lock(hashtext('promo-recipient:' || v_email));
  perform pg_advisory_xact_lock(hashtext('promo-key:' || p_promotion_key));

  select p.* into v_promo
  from public.promotions p
  where p.key = p_promotion_key
  for update;

  if not found or not v_promo.active
     or (v_promo.starts_at is not null and now() < v_promo.starts_at)
     or (v_promo.ends_at is not null and now() >= v_promo.ends_at) then
    return query select false, null::integer, 0, null::text, null::timestamptz;
    return;
  end if;

  update public.promo_claims c
  set status = 'expired', updated_at = now()
  from public.promotions p
  where p.key = c.promotion_key
    and c.recipient_email = v_email
    and c.status = 'reserved'
    and c.reservation_expires_at <= now()
    and (v_promo.exclusive_group is null or p.exclusive_group = v_promo.exclusive_group);

  -- A live reservation or activation in another promotion from the same
  -- exclusive group makes this account ineligible for another Rp0 offer.
  if v_promo.exclusive_group is not null and exists (
    select 1
    from public.promo_claims c
    join public.promotions p on p.key = c.promotion_key
    where c.recipient_email = v_email
      and c.promotion_key <> p_promotion_key
      and p.exclusive_group = v_promo.exclusive_group
      and c.status in ('reserved', 'activated')
  ) then
    return query select false, null::integer, 0, null::text, null::timestamptz;
    return;
  end if;

  update public.promo_claims c
  set status = 'expired', updated_at = now()
  where c.promotion_key = p_promotion_key
    and c.status = 'reserved'
    and c.reservation_expires_at <= now();

  select c.* into v_claim
  from public.promo_claims c
  where c.promotion_key = p_promotion_key and c.recipient_email = v_email
  for update;
  v_has_claim := found;

  select count(*)::integer into v_used
  from public.promo_claims c
  where c.promotion_key = p_promotion_key
    and c.status in ('reserved','activated');

  if v_has_claim and v_claim.status = 'activated' then
    return query select false, v_claim.slot_number, greatest(v_promo.quota - v_used, 0), null::text, null::timestamptz;
    return;
  end if;

  if v_has_claim and v_claim.status = 'reserved' and v_claim.reservation_expires_at > now() then
    update public.promo_claims c
    set checkout_intent_key = p_checkout_intent_key, updated_at = now()
    where c.id = v_claim.id;
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
