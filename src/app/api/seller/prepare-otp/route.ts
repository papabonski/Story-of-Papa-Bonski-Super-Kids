import { NextRequest, NextResponse } from "next/server";
import { sellerAdminEmailAllowed, sellerOtpConfigured } from "@/lib/seller-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const AUTH_PAGE_SIZE = 1000;
const MAX_AUTH_PAGES = 50;

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

async function findAuthUserByEmail(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  email: string,
) {
  for (let page = 1; page <= MAX_AUTH_PAGES; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: AUTH_PAGE_SIZE,
    });
    if (error) throw error;

    const user = data.users.find(
      (candidate) => candidate.email?.trim().toLowerCase() === email,
    );
    if (user) return user;
    if (data.users.length < AUTH_PAGE_SIZE) return null;
  }

  throw new Error("Daftar user terlalu besar untuk dipindai saat menyiapkan OTP admin.");
}

export async function POST(request: NextRequest) {
  try {
    if (!sellerOtpConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Login OTP Seller Center belum dikonfigurasi." },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => null);
    const email = normalizeEmail(body?.email);

    if (!email || !sellerAdminEmailAllowed(email)) {
      return NextResponse.json(
        { ok: false, error: "Email ini tidak terdaftar sebagai administrator Seller Center." },
        { status: 403 },
      );
    }

    const admin = createSupabaseAdminClient();
    let authUser = await findAuthUserByEmail(admin, email);

    if (!authUser) {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
      });
      if (error) throw error;
      authUser = data.user;
    } else if (!authUser.email_confirmed_at) {
      const { data, error } = await admin.auth.admin.updateUserById(authUser.id, {
        email_confirm: true,
      });
      if (error) throw error;
      authUser = data.user;
    }

    return NextResponse.json(
      { ok: true, ready: Boolean(authUser?.id) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("seller prepare-otp failed", error);
    return NextResponse.json(
      { ok: false, error: "Belum bisa menyiapkan OTP administrator. Silakan coba lagi sebentar." },
      { status: 500 },
    );
  }
}
