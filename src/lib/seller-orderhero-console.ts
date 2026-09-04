import "server-only";

import { createHmac, randomUUID } from "node:crypto";
import { POST as orderHeroWebhookPost } from "@/app/api/orderhero/webhook/route";
import { webhookAuthMode } from "@/lib/commerce/orderhero";

function authenticatedHeaders(raw: string, eventName?: string) {
  const headers = new Headers({
    "content-type": "application/json",
    "x-webhook-delivery": `seller-console-${randomUUID()}`,
    "x-request-id": `seller-console-${randomUUID()}`,
  });
  if (eventName) headers.set("x-webhook-event", eventName);

  const mode = webhookAuthMode();
  if (mode === "hmac") {
    const secret = process.env.ORDERHERO_WEBHOOK_SECRET;
    if (!secret) throw new Error("ORDERHERO_WEBHOOK_SECRET tidak tersedia.");
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = createHmac("sha256", secret)
      .update(`${timestamp}.${raw}`)
      .digest("hex");
    headers.set("x-webhook-timestamp", timestamp);
    headers.set("x-webhook-signature", `t=${timestamp},v1=${signature}`);
  } else if (mode === "token") {
    const token = process.env.ORDERHERO_WEBHOOK_TOKEN;
    if (!token) throw new Error("ORDERHERO_WEBHOOK_TOKEN tidak tersedia.");
    headers.set("x-webhook-token", token);
  } else if (mode === "missing") {
    throw new Error("Webhook OrderHero belum memiliki autentikasi.");
  }

  return headers;
}

export async function submitOrderHeroPayloadInternally(
  payload: Record<string, unknown>,
  eventName?: string,
) {
  const raw = JSON.stringify(payload);
  const request = new Request("https://seller-console.internal/api/orderhero/webhook", {
    method: "POST",
    headers: authenticatedHeaders(raw, eventName),
    body: raw,
  });
  const response = await orderHeroWebhookPost(request);
  const result = await response.json().catch(() => null);
  return { status: response.status, ok: response.ok, result };
}
