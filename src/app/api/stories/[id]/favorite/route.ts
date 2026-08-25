import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateUserId } from "@/lib/supabase/auth";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { favorite?: unknown };
  const favorite = body.favorite === true;

  const supabase = await createSupabaseServerClient();
  const userId = await getOrCreateUserId();

  const { data: story, error: storyErr } = await supabase
    .from("stories")
    .select("id, user_id")
    .eq("id", id)
    .maybeSingle();
  if (storyErr) return NextResponse.json({ error: storyErr.message }, { status: 500 });
  if (!story) return NextResponse.json({ error: "Cerita tidak ditemukan." }, { status: 404 });
  if (story.user_id !== userId)
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  const { error } = await supabase.from("stories").update({ is_favorite: favorite }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, favorite });
}
