import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "../database.types";

const PROTECTED_PREFIXES = ["/app", "/create", "/collection", "/story", "/cerita/video", "/install"];
const AUTH_PATHS = ["/login", "/auth/callback", "/onboarding", "/account/inactive"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const requireLogin = process.env.REQUIRE_CUSTOMER_LOGIN === "true";
  const protectedPath = PROTECTED_PREFIXES.some(prefix => path === prefix || path.startsWith(prefix + "/"));
  const authPath = AUTH_PATHS.some(prefix => path === prefix || path.startsWith(prefix + "/"));

  if (requireLogin && protectedPath) {
    if (!user || user.is_anonymous) {
      const login = request.nextUrl.clone();
      login.pathname = "/login";
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }

    // RLS-safe access check: authenticated customer must be linked to a tenant
    // and hold a non-expired Super Kids entitlement. This prevents direct URL
    // access to /create, /collection, story APIs/pages, etc.
    const { data: membership } = await supabase
      .from("customer_users")
      .select("customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!membership) {
      const onboarding = request.nextUrl.clone();
      onboarding.pathname = "/onboarding";
      onboarding.search = "";
      return NextResponse.redirect(onboarding);
    }
    const { data: entitlement } = await supabase
      .from("entitlements")
      .select("expires_at")
      .eq("customer_id", membership.customer_id)
      .eq("key", "super_kids_access")
      .maybeSingle();
    const expired = entitlement?.expires_at ? new Date(entitlement.expires_at).getTime() <= Date.now() : false;
    if (!entitlement || expired) {
      const inactive = request.nextUrl.clone();
      inactive.pathname = "/account/inactive";
      inactive.search = "";
      return NextResponse.redirect(inactive);
    }
  }

  // Keep old device-scoped anonymous mode only for legacy/dev installations.
  if (!requireLogin && !user && !authPath) await supabase.auth.signInAnonymously();
  return response;
}
