import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function normalizeProfileName(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const displayName = normalizeProfileName(body?.displayName);

    if (displayName.length < 2 || displayName.length > 60) {
      return NextResponse.json(
        { ok: false, error: "Nama Penerima harus terdiri dari 2–60 karakter." },
        { status: 400 },
      );
    }

    const admin = createSupabaseAdminClient();
    const authorization = request.headers.get("authorization") || "";
    const bearerToken = authorization.toLowerCase().startsWith("bearer ")
      ? authorization.slice(7).trim()
      : "";

    let user: any = null;

    if (bearerToken) {
      const { data, error } = await admin.auth.getUser(bearerToken);
      if (error) {
        return NextResponse.json({ ok: false, error: "Sesi login tidak valid." }, { status: 401 });
      }
      user = data.user;
    } else {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        return NextResponse.json({ ok: false, error: "Sesi login tidak valid." }, { status: 401 });
      }
      user = data.user;
    }

    const email = normalizeEmail(user?.email);
    if (!user?.id || !email) {
      return NextResponse.json({ ok: false, error: "Login diperlukan." }, { status: 401 });
    }

    const { data: customer, error: customerError } = await admin
      .from("customers")
      .update({ name: displayName })
      .ilike("email", email)
      .eq("status", "active")
      .select("id,name")
      .maybeSingle();

    if (customerError) throw customerError;
    if (!customer) {
      return NextResponse.json(
        { ok: false, error: "Profil penerima aktif tidak ditemukan." },
        { status: 404 },
      );
    }

    // Keep auth metadata aligned for future profile-oriented UI without making
    // it the source of truth for entitlement ownership.
    const { error: authUpdateError } = await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...(user.user_metadata || {}),
        display_name: displayName,
      },
    });
    if (authUpdateError) throw authUpdateError;

    return NextResponse.json({ ok: true, name: customer.name });
  } catch (error) {
    console.error("profile update failed", error);
    return NextResponse.json(
      { ok: false, error: "Nama profil belum bisa disimpan. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
