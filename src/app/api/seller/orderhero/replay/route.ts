import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { hasSellerSession } from "@/lib/seller-auth";
import { submitOrderHeroPayloadInternally } from "@/lib/seller-orderhero-console";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await hasSellerSession())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const eventId = String(body?.eventId ?? "").trim();
    if (!eventId) {
      return NextResponse.json({ ok: false, error: "event_id_required" }, { status: 400 });
    }

    const db = createSupabaseAdminClient();
    const { data: event, error } = await db
      .from("webhook_events")
      .select("id,status,payload,normalized,event_key,external_order_id")
      .eq("id", eventId)
      .eq("provider", "orderhero")
      .maybeSingle();

    if (error) throw error;
    if (!event) {
      return NextResponse.json({ ok: false, error: "event_not_found" }, { status: 404 });
    }

    if (!["error", "needs_mapping"].includes(String(event.status))) {
      return NextResponse.json(
        { ok: false, error: "replay_not_needed", status: event.status },
        { status: 409 },
      );
    }

    if (!event.payload || typeof event.payload !== "object") {
      return NextResponse.json({ ok: false, error: "payload_missing" }, { status: 409 });
    }

    const eventName = String(event.normalized?.eventName ?? "").trim() || undefined;
    const replay = await submitOrderHeroPayloadInternally(event.payload, eventName);

    return NextResponse.json(
      {
        ok: replay.ok,
        replayOf: event.id,
        externalOrderId: event.external_order_id,
        receiverStatus: replay.status,
        receiverResult: replay.result,
      },
      { status: replay.ok ? 200 : 502 },
    );
  } catch (error) {
    console.error("seller webhook replay failed", error);
    return NextResponse.json(
      { ok: false, error: "replay_failed", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
