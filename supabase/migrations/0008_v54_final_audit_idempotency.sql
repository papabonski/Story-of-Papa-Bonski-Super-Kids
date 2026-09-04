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
    FROM public.activations
    WHERE order_id IS NOT NULL
    GROUP BY order_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Cannot add activations order idempotency: duplicate order_id rows exist';
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

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_source_order_id_unique
  ON public.subscriptions (source_order_id)
  WHERE source_order_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS activations_order_id_unique
  ON public.activations (order_id)
  WHERE order_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS attributions_order_id_unique
  ON public.attributions (order_id)
  WHERE order_id IS NOT NULL;
