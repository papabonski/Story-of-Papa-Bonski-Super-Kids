import { NextResponse } from "next/server";
import { hasSellerSession } from "@/lib/seller-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasSellerSession())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const status = body?.status === "approved" ? "approved" : body?.status === "rejected" ? "rejected" : null;
  if (!status) return NextResponse.json({ ok: false, error: "invalid_status" }, { status: 400 });

  const db = createSupabaseAdminClient();
  const { data: testimonial, error: readError } = await db.from("testimonials")
    .select("publication_consent")
    .eq("id", id)
    .maybeSingle();
  if (readError || !testimonial) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  if (status === "approved" && !testimonial.publication_consent) {
    return NextResponse.json({ ok: false, error: "publication_consent_required" }, { status: 409 });
  }

  const now = new Date().toISOString();
  const { error } = await db.from("testimonials").update({
    moderation_status: status,
    published_at: status === "approved" ? now : null,
    updated_at: now,
  }).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 });
  return NextResponse.json({ ok: true, status });
}
