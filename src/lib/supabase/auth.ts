import { createSupabaseServerClient } from "./server";

/**
 * Returns the current user's id.
 * In V5.2 commercial mode (REQUIRE_CUSTOMER_LOGIN=true), anonymous sessions are
 * rejected so customer-only story actions cannot be used without login.
 * Legacy/dev mode can still create an anonymous session when the flag is false.
 */
export async function getOrCreateUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const requireLogin = process.env.REQUIRE_CUSTOMER_LOGIN === "true";

  if (user && (!requireLogin || !user.is_anonymous)) return user.id;
  if (requireLogin) throw new Error("CUSTOMER_LOGIN_REQUIRED");

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) throw new Error("Gagal membuat sesi anonim. Pastikan Anonymous sign-ins aktif di Supabase. " + (error?.message ?? ""));
  return data.user.id;
}
