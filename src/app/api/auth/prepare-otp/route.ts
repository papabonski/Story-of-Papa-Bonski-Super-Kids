import { NextRequest, NextResponse } from "next/server";
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

  throw new Error("Daftar user terlalu besar untuk dipindai saat menyiapkan OTP.");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = normalizeEmail(body?.email);

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email Penerima wajib diisi." },
        { status: 400 },
      );
    }

    const admin = createSupabaseAdminClient();

    const { data: customer, error: customerError } = await admin
      .from("customers")
      .select("id,status")
      .ilike("email", email)
      .eq("status", "active")
      .maybeSingle();

    if (customerError) throw customerError;

    if (!customer) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Email Penerima belum memiliki akses Papa Bonski yang aktif. Pastikan email sama dengan yang didaftarkan sebelum checkout.",
        },
        { status: 404 },
      );
    }

    const [{ data: entitlement, error: entitlementError }, { data: subscription, error: subscriptionError }] =
      await Promise.all([
        admin
          .from("entitlements")
          .select("expires_at")
          .eq("customer_id", customer.id)
          .eq("key", "super_kids_access")
          .maybeSingle(),
        admin
          .from("subscriptions")
          .select("status,expires_at")
          .eq("customer_id", customer.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

    if (entitlementError) throw entitlementError;
    if (subscriptionError) throw subscriptionError;

    const now = Date.now();
    const entitlementActive =
      Boolean(entitlement) &&
      (!entitlement?.expires_at || new Date(entitlement.expires_at).getTime() > now);
    const subscriptionActive =
      subscription?.status === "active" &&
      (!subscription?.expires_at || new Date(subscription.expires_at).getTime() > now);

    if (!entitlementActive || !subscriptionActive) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Akses untuk Email Penerima ini belum aktif. Jika pembayaran baru selesai, tunggu sebentar lalu coba lagi.",
        },
        { status: 403 },
      );
    }

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

    return NextResponse.json({
      ok: true,
      ready: Boolean(authUser?.id),
    });
  } catch (error: any) {
    console.error("prepare-otp failed", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Belum bisa menyiapkan login OTP. Silakan coba lagi sebentar.",
      },
      { status: 500 },
    );
  }
}
