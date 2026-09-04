import { NextResponse } from "next/server";
import {
  createSellerSession,
  sellerAdminEmailAllowed,
  sellerOtpConfigured,
} from "@/lib/seller-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeEmail(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

export async function POST() {
  try {
    if (!sellerOtpConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Login OTP Seller Center belum dikonfigurasi." },
        { status: 503 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    const email = normalizeEmail(user?.email);
    if (error || !user || !email || !sellerAdminEmailAllowed(email)) {
      await supabase.auth.signOut().catch(() => undefined);
      return NextResponse.json(
        { ok: false, error: "Akun ini tidak diizinkan mengakses Seller Center." },
        { status: 403 },
      );
    }

    await createSellerSession();
    await supabase.auth.signOut();

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("seller session failed", error);
    return NextResponse.json(
      { ok: false, error: "Belum bisa membuat sesi Seller Center. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
