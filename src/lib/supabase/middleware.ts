import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "../database.types";

const PORTAL_PREFIXES = ["/app", "/install"];
const SUPER_KIDS_PREFIXES = ["/create", "/collection", "/story", "/cerita/video"];
const MODULE_ENTITLEMENTS = ["super_kids_access", "mandarin_access", "matematika_access"];
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
  const isPortalPath = PORTAL_PREFIXES.some(prefix => path === prefix || path.startsWith(prefix + "/"));
  const isSuperKidsPath = SUPER_KIDS_PREFIXES.some(prefix => path === prefix || path.startsWith(prefix + "/"));
  const isMandarinPath = path === "/mandarin" || path === "/mandarin-game" || path.startsWith("/mandarin-game/");
  const isMatematikaPath = path === "/matematika" || path === "/matematika-game" || path.startsWith("/matematika-game/");
  const protectedPath = isPortalPath || isSuperKidsPath || isMandarinPath || isMatematikaPath;
  const authPath = AUTH_PATHS.some(prefix => path === prefix || path.startsWith(prefix + "/"));

  if (requireLogin && protectedPath) {
    if (!user || user.is_anonymous) {
      const login = request.nextUrl.clone();
      login.pathname = "/login";
      // Customer OTP login always lands on the shared module menu. The module
      // route itself still enforces its dedicated entitlement when selected.
      login.searchParams.set("next", "/app");
      return NextResponse.redirect(login);
    }

    // The portal is shared by every Papa Bonski module. Feature routes still
    // require their own entitlement, while /app and /install accept any active
    // module entitlement.
    const { data: membership } = await supabase
      .from("customer_users")
      .select("customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!membership) {
      const onboarding = request.nextUrl.clone();
      onboarding.pathname = "/onboarding";
      onboarding.search = "";
      onboarding.searchParams.set("next", "/app");
      return NextResponse.redirect(onboarding);
    }
    let entitlementQuery = supabase
      .from("entitlements")
      .select("key")
      .eq("customer_id", membership.customer_id);
    entitlementQuery = isPortalPath
      ? entitlementQuery.in("key", MODULE_ENTITLEMENTS).limit(1)
      : entitlementQuery.eq("key", isMandarinPath ? "mandarin_access" : isMatematikaPath ? "matematika_access" : "super_kids_access");
    const { data: entitlements } = await entitlementQuery;
    if (!entitlements?.length) {
      const inactive = request.nextUrl.clone();
      inactive.pathname = "/account/inactive";
      inactive.search = "";
      inactive.searchParams.set("product", isPortalPath ? "portal" : isMandarinPath ? "mandarin" : isMatematikaPath ? "matematika" : "super-kids");
      return NextResponse.redirect(inactive);
    }
  }

  // Keep old device-scoped anonymous mode only for legacy/dev installations.
  if (!requireLogin && !user && !authPath) await supabase.auth.signInAnonymously();
  return response;
}
