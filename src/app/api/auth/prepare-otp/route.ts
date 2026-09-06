import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const AUTH_PAGE_SIZE = 1000;
const MAX_AUTH_PAGES = 50;
const GENERIC_PROFILE_NAME = "member papa bonski";

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeProfileName(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
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
    const displayName = normalizeProfileName(body?.displayName);

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email Penerima wajib diisi." },
        { status: 400 },
      );
    }

    if (displayName && (displayName.length < 2 || displayName.length > 60)) {
      return NextResponse.json(
        { ok: false, error: "Nama Penerima harus terdiri dari 2–60 karakter." },
        { status: 400 },
      );
    }

    const admin = createSupabaseAdminClient();

    const { data: customer, error: customerError } = await admin
      .from("customers")
      .select("id,status,name")
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

    const currentName = normalizeProfileName(customer.name).toLowerCase();
    const profileNameRequired = !currentName || currentName === GENERIC_PROFILE_NAME;

    // The name is deliberately NOT written here because this endpoint is
    // unauthenticated. It is only committed after the OTP has been verified.
    if (profileNameRequired && !displayName) {
      return NextResponse.json(
        {
          ok: false,
          code: "profile_name_required",
          error:
            "Nama Penerima wajib diisi pada login pertama. Nama ini akan tampil di Papa Bonski dan terpisah dari nama pembeli di OrderHero.",
        },
        { status: 400 },
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
      profileNameRequired,
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
