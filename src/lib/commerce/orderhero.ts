import crypto from "node:crypto";

export type NormalizedOrderHeroOrder = {
  eventKey?: string;
  eventName?: string;
  externalOrderId?: string;
  status?: string;
  name?: string;
  email?: string;
  phone?: string;
  productSku?: string;
  externalProductId?: string;
  productName?: string;
  amount?: number;
  currency?: string;
  paidAt?: string;
  utm?: { source?: string; medium?: string; campaign?: string; content?: string; term?: string; fbclid?: string; landingPath?: string };
};

type AnyRecord = Record<string, any>;
const first = (...xs:any[]) => xs.find(v => v !== undefined && v !== null && v !== "");
const lower = (v:any) => v == null ? undefined : String(v).trim().toLowerCase();
const obj = (v:any):AnyRecord => v && typeof v === "object" ? v : {};

/**
 * Defensive OrderHero adapter.
 * Supports the official OrderHero webhook body plus earlier/common shapes.
 * Raw payload is still preserved by the receiver for diagnostics/mapping.
 */
export function normalizeOrderHeroPayload(input: Record<string, unknown>): NormalizedOrderHeroOrder {
  const root:any = input;
  const data = obj(first(root.data, root.payload, root.order, root));
  const order = obj(first(data.order, root.order, data));
  const customer = obj(first(order.customer, order.buyer, data.customer, data.buyer, root.customer, root.buyer));
  const product = obj(first(order.product, data.product, root.product, order.items?.[0], data.items?.[0], root.items?.[0]));
  const payment = obj(first(order.payment, data.payment, root.payment));
  const meta = obj(first(order.metadata, data.metadata, root.metadata, order.meta, data.meta, root.meta));
  const attribution = obj(first(order.attribution, data.attribution, root.attribution, meta.attribution));

  const amountRaw = first(
    order.grand_total, order.total_amount, order.total, order.amount,
    payment.amount,
    data.grand_total, data.total_amount, data.total, data.amount,
    root.total_amount, root.amount
  );
  const amount = Number(String(amountRaw ?? "").replace(/[^0-9.-]/g,""));
  const status = lower(first(order.payment_status, payment.status, order.status, data.payment_status, data.status, root.payment_status, root.status, root.event));

  return {
    eventKey: String(first(root.delivery_id, root.event_id, root.idempotency_key, data.delivery_id, data.event_id, data.idempotency_key, order.uuid, order.id, order.order_id, "") || "") || undefined,
    eventName: first(root.event, root.type, root.event_name, data.event, data.type),
    externalOrderId: String(first(order.order_id, order.order_number, order.invoice_number, order.invoice, order.id, data.order_id, root.order_id, root.id) || "") || undefined,
    status,
    name: first(customer.name, customer.full_name, order.customer_name, order.buyer_name, data.customer_name, root.customer_name),
    email: lower(first(customer.email, order.customer_email, order.buyer_email, data.customer_email, root.customer_email)),
    phone: first(customer.phone, customer.whatsapp, customer.phone_number, order.customer_phone, order.buyer_phone, data.customer_phone, root.customer_phone),
    productSku: first(product.sku, product.code, product.variant_id, order.product_sku, data.product_sku, root.product_sku),
    externalProductId: String(first(product.id, product.product_id, order.product_id, data.product_id, root.product_id) || "") || undefined,
    productName: first(product.name, product.title, product.product_name, order.product_name, data.product_name, root.product_name),
    amount: Number.isFinite(amount) && amount > 0 ? amount : undefined,
    currency: String(first(order.currency, payment.currency, data.currency, root.currency, "IDR")),
    paidAt: first(order.paid_at, payment.paid_at, data.paid_at, root.paid_at),
    utm: {
      source:first(attribution.utm_source, meta.utm_source, order.utm_source, data.utm_source, root.utm_source),
      medium:first(attribution.utm_medium, meta.utm_medium, order.utm_medium, data.utm_medium, root.utm_medium),
      campaign:first(attribution.utm_campaign, meta.utm_campaign, order.utm_campaign, data.utm_campaign, root.utm_campaign),
      content:first(attribution.utm_content, meta.utm_content, order.utm_content, data.utm_content, root.utm_content),
      term:first(attribution.utm_term, meta.utm_term, order.utm_term, data.utm_term, root.utm_term),
      fbclid:first(attribution.fbclid, meta.fbclid, order.fbclid, data.fbclid, root.fbclid),
      landingPath:first(attribution.landing_path, meta.landing_path, order.landing_path, data.landing_path, root.landing_path),
    }
  };
}

export function webhookAuthMode() {
  if (process.env.ORDERHERO_WEBHOOK_SECRET) return "hmac";
  if (process.env.ORDERHERO_WEBHOOK_TOKEN) return "token";
  return process.env.NODE_ENV === "production" ? "missing" : "development-open";
}

function secureEqualHex(received:string, expected:string) {
  if (!/^[0-9a-f]+$/i.test(received) || received.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(received.toLowerCase()), Buffer.from(expected.toLowerCase()));
}

export function verifyWebhook(rawBody: string, req: Request) {
  const hmacSecret = process.env.ORDERHERO_WEBHOOK_SECRET;
  if (hmacSecret) {
    const signatureHeader = req.headers.get("x-webhook-signature") ?? req.headers.get("x-orderhero-signature") ?? req.headers.get("x-signature");
    const timestampHeader = req.headers.get("x-webhook-timestamp");
    if (!signatureHeader || !timestampHeader) return false;

    // Official OrderHero format: X-Webhook-Signature: t=<ts>,v1=<hex>
    // Signature input: `${ts}.${rawBody}` using HMAC-SHA256 with the webhook whsec_ secret.
    const parts = Object.fromEntries(
      signatureHeader.split(",").map(part => part.trim().split("=", 2)).filter(([k,v]) => k && v)
    );
    const signedTimestamp = parts.t || timestampHeader;
    const received = parts.v1 || signatureHeader.replace(/^sha256=/i, "");
    if (signedTimestamp !== timestampHeader) return false;

    const expected = crypto
      .createHmac("sha256", hmacSecret)
      .update(`${signedTimestamp}.${rawBody}`)
      .digest("hex");
    return secureEqualHex(received, expected);
  }

  // Fallback for webhook providers that cannot sign requests but allow a secret URL/header.
  const token = process.env.ORDERHERO_WEBHOOK_TOKEN;
  if (token) {
    const url = new URL(req.url);
    const received = first(
      req.headers.get("authorization")?.replace(/^Bearer\s+/i,""),
      req.headers.get("x-webhook-token"),
      req.headers.get("x-orderhero-token"),
      url.searchParams.get("token")
    );
    if (!received || String(received).length !== token.length) return false;
    return crypto.timingSafeEqual(Buffer.from(String(received)), Buffer.from(token));
  }
  return process.env.NODE_ENV !== "production";
}

export function isPaid(status?: string) {
  const s=(status??"").toLowerCase();
  return ["paid","success","completed","settled","payment_success","payment.success","lunas"].includes(s) || s.includes("paid") || s.includes("lunas");
}

export function payloadReadiness(n: NormalizedOrderHeroOrder) {
  const missing:string[]=[];
  if(!n.externalOrderId) missing.push("order_id");
  if(!n.email) missing.push("customer_email");
  if(!n.status) missing.push("payment_status");
  return { ready: missing.length===0, missing };
}
