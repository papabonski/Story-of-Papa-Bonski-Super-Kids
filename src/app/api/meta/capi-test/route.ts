import crypto from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_DATASET_ID = "1039294515626493";

export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ ok: false, error: "preview_only" }, { status: 404 });
  }

  const accessToken = String(process.env.META_CONVERSIONS_API_TOKEN || "").trim();
  const datasetId = String(
    process.env.META_CAPI_DATASET_ID || process.env.META_DATASET_ID || DEFAULT_DATASET_ID
  ).trim();

  if (!accessToken || !datasetId) {
    return NextResponse.json({
      ok: false,
      configured: false,
      tokenConfigured: Boolean(accessToken),
      datasetConfigured: Boolean(datasetId),
    }, { status: 503 });
  }

  const version = String(process.env.META_GRAPH_API_VERSION || "v21.0").trim();
  const endpoint = `https://graph.facebook.com/${version}/${encodeURIComponent(datasetId)}/events?access_token=${encodeURIComponent(accessToken)}`;
  const eventId = `pb-capi-preview-${Date.now()}`;
  const externalId = crypto.createHash("sha256").update("pb-capi-preview-connectivity").digest("hex");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        data: [{
          event_name: "CapiConnectionTest",
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: "website",
          event_source_url: "https://papabonski.com/super-kids",
          user_data: { external_id: [externalId] },
          custom_data: { source: "v5.6_preview_connectivity_check" },
        }],
      }),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);
    return NextResponse.json({
      ok: response.ok,
      configured: true,
      status: response.status,
      eventId,
      meta: payload,
    }, { status: response.ok ? 200 : 502 });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      configured: true,
      error: String(error?.message || "Meta CAPI request failed"),
    }, { status: 502 });
  }
}
