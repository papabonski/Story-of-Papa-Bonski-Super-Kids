import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateUserId } from "@/lib/supabase/auth";

export const runtime = "nodejs";
export const maxDuration = 30;

function shareUrl(req: Request, token: string): string {
  return new URL(`/share/${token}`, req.url).toString();
}

async function loadOwnedStory(id: string) {
  const supabase = await createSupabaseServerClient();
  const userId = await getOrCreateUserId();
  const { data: story, error } = await supabase
    .from("stories")
    .select("id, user_id, share_token")
    .eq("id", id)
    .maybeSingle();

  if (error) return { supabase, error: NextResponse.json({ error: error.message }, { status: 500 }) };
  if (!story) return { supabase, error: NextResponse.json({ error: "Cerita tidak ditemukan." }, { status: 404 }) };
  if (story.user_id !== userId) {
    return { supabase, error: NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 }) };
  }
  return { supabase, story };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const loaded = await loadOwnedStory(id);
  if ("error" in loaded) return loaded.error;

  return NextResponse.json({
    token: loaded.story.share_token,
    url: loaded.story.share_token ? shareUrl(req, loaded.story.share_token) : null,
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const loaded = await loadOwnedStory(id);
  if ("error" in loaded) return loaded.error;

  const token = loaded.story.share_token ?? randomBytes(24).toString("base64url");
  if (!loaded.story.share_token) {
    const { error } = await loaded.supabase
      .from("stories")
      .update({ share_token: token, share_created_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ token, url: shareUrl(req, token) });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const loaded = await loadOwnedStory(id);
  if ("error" in loaded) return loaded.error;

  const { error } = await loaded.supabase
    .from("stories")
    .update({ share_token: null, share_created_at: null })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
