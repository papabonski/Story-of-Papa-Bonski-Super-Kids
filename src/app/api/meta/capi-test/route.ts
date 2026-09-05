import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_PIXEL_ID = "1717292549605992";

export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ ok: false, error: "preview_only" }, { status: 404 });
  }

  const accessToken = String(process.env.META_CONVERSIONS_API_TOKEN || "").trim();
  const pixelId = String(
    process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_PIXEL_ID
  ).trim();

  if (!accessToken || !pixelId) {
    return NextResponse.json({
      ok: false,
      configured: false,
      tokenConfigured: Boolean(accessToken),
      pixelConfigured: Boolean(pixelId),
    }, { status: 503 });
  }

  const version = String(process.env.META_GRAPH_API_VERSION || "v21.0").trim();
  const endpoint = `https://graph.facebook.com/${version}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;
  const eventId = `pb-capi-preview-${Date.now()}`;

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
          user_data: {},
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
