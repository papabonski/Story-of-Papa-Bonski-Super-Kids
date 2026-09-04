-- V5.4 final audit hardening
-- Make one paid OrderHero order produce at most one subscription, activation,
-- and attribution row even when OrderHero retries order_paid concurrently.

DO $$
BEGIN
  IF EXISTS (
    SELECT source_order_id
    FROM public.subscriptions
    WHERE source_order_id IS NOT NULL
    GROUP BY source_order_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Cannot add subscriptions order idempotency: duplicate source_order_id rows exist';
  END IF;

  IF EXISTS (
    SELECT order_id
    FROM public.attributions
    WHERE order_id IS NOT NULL
    GROUP BY order_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Cannot add attributions order idempotency: duplicate order_id rows exist';
  END IF;
END $$;

-- Historical UAT exposed one duplicate activation created by concurrent
-- order_paid deliveries. Keep the earliest activation for each order and remove
-- only later duplicates before enforcing the invariant.
WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY order_id
      ORDER BY activated_at ASC, id ASC
    ) AS rn
  FROM public.activations
  WHERE order_id IS NOT NULL
)
DELETE FROM public.activations a
USING ranked r
WHERE a.id = r.id
  AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_source_order_id_unique
  ON public.subscriptions (source_order_id)
  WHERE source_order_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS activations_order_id_unique
  ON public.activations (order_id)
  WHERE order_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS attributions_order_id_unique
  ON public.attributions (order_id)
  WHERE order_id IS NOT NULL;
