import crypto from "node:crypto";

const DEFAULT_PIXEL_ID = "1717292549605992";

type Attribution = {
  fbclid?: string | null;
  landing_path?: string | null;
  landingPath?: string | null;
};

type MetaPurchaseInput = {
  externalOrderId: string;
  buyerEmail?: string | null;
  amount?: number | null;
  currency?: string | null;
  productSku?: string | null;
  paidAt?: string | null;
  attribution?: Attribution | null;
};

type MetaPurchaseResult = {
  configured: boolean;
  ok: boolean;
  status?: number;
  error?: string;
};

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

function unixSeconds(value?: string | null) {
  const parsed = value ? Date.parse(value) : NaN;
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : Math.floor(Date.now() / 1000);
}

function eventSourceUrl(attribution?: Attribution | null) {
  const explicit = String(process.env.META_EVENT_SOURCE_URL || "").trim();
  if (explicit) return explicit;

  const host = String(process.env.VERCEL_PROJECT_PRODUCTION_URL || "").trim();
  if (!host) return undefined;

  const rawPath = attribution?.landing_path ?? attribution?.landingPath ?? "/super-kids";
  const path = String(rawPath || "/super-kids").startsWith("/")
    ? String(rawPath || "/super-kids")
    : `/${String(rawPath)}`;
  return `https://${host}${path}`;
}

/**
 * Sends a real paid OrderHero order to Meta Conversions API.
 *
 * Commerce processing must never depend on Meta availability, so callers should
 * treat failures as telemetry warnings rather than payment/activation failures.
 * The stable event_id lets Meta deduplicate webhook retries safely.
 */
export async function sendMetaPurchase(input: MetaPurchaseInput): Promise<MetaPurchaseResult> {
  const accessToken = String(process.env.META_CONVERSIONS_API_TOKEN || "").trim();
  const pixelId = String(
    process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_PIXEL_ID
  ).trim();

  if (!accessToken || !pixelId) return { configured: false, ok: false };

  const email = normalizeEmail(input.buyerEmail);
  const eventTime = unixSeconds(input.paidAt);
  const fbclid = String(input.attribution?.fbclid || "").trim();
  const value = Number(input.amount || 0);
  const currency = String(input.currency || "IDR").trim().toUpperCase() || "IDR";

  const userData: Record<string, unknown> = {};
  if (email) userData.em = [sha256(email)];
  if (fbclid) userData.fbc = `fb.1.${eventTime * 1000}.${fbclid}`;

  const data: Record<string, unknown> = {
    event_name: "Purchase",
    event_time: eventTime,
    event_id: `orderhero:${input.externalOrderId}`,
    action_source: "website",
    user_data: userData,
    custom_data: {
      currency,
      value: Number.isFinite(value) ? value : 0,
      content_ids: input.productSku ? [String(input.productSku)] : undefined,
      content_type: "product",
      num_items: 1,
    },
  };

  const sourceUrl = eventSourceUrl(input.attribution);
  if (sourceUrl) data.event_source_url = sourceUrl;

  const body: Record<string, unknown> = { data: [data] };
  const testCode = String(process.env.META_CONVERSIONS_API_TEST_CODE || "").trim();
  if (testCode) body.test_event_code = testCode;

  const version = String(process.env.META_GRAPH_API_VERSION || "v21.0").trim();
  const endpoint = `https://graph.facebook.com/${version}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null) as any;
      const error = String(payload?.error?.message || `Meta CAPI HTTP ${response.status}`);
      return { configured: true, ok: false, status: response.status, error };
    }

    return { configured: true, ok: true, status: response.status };
  } catch (error: any) {
    return {
      configured: true,
      ok: false,
      error: String(error?.message || "Meta CAPI request failed"),
    };
  }
}
