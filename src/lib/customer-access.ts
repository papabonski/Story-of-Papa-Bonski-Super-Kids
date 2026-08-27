import { redirect } from "next/navigation";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export type CustomerAccess = {
  userId: string;
  email: string;
  customerId: string;
  customerCode: string;
  customerName: string;
  role: string;
  planName: string | null;
  subscriptionStatus: string | null;
  expiresAt: string | null;
  hasAccess: boolean;
};

export async function getCustomerAccess(): Promise<CustomerAccess | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.is_anonymous || !user.email) return null;

  const admin = createSupabaseAdminClient();
  const { data: membership } = await admin
    .from("customer_users")
    .select("customer_id,role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) return null;

  const [{ data: customer }, { data: entitlement }, { data: subscription }] = await Promise.all([
    admin.from("customers").select("id,customer_code,name,status").eq("id", membership.customer_id).maybeSingle(),
    admin.from("entitlements").select("expires_at").eq("customer_id", membership.customer_id).eq("key", "super_kids_access").maybeSingle(),
    admin.from("subscriptions").select("status,expires_at,plan_id").eq("customer_id", membership.customer_id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  if (!customer) return null;

  let planName: string | null = null;
  if (subscription?.plan_id) {
    const { data: plan } = await admin.from("plans").select("name").eq("id", subscription.plan_id).maybeSingle();
    planName = plan?.name ?? null;
  }

  const expiresAt = entitlement?.expires_at ?? subscription?.expires_at ?? null;
  const notExpired = !expiresAt || new Date(expiresAt).getTime() > Date.now();
  const hasAccess = customer.status === "active" && subscription?.status === "active" && Boolean(entitlement) && notExpired;

  return {
    userId: user.id,
    email: user.email,
    customerId: customer.id,
    customerCode: customer.customer_code,
    customerName: customer.name,
    role: membership.role,
    planName,
    subscriptionStatus: subscription?.status ?? null,
    expiresAt,
    hasAccess,
  };
}

export async function claimCustomerByVerifiedEmail() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.is_anonymous || !user.email) return { ok: false as const, reason: "not_authenticated" };

  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin.from("customer_users").select("customer_id").eq("user_id", user.id).maybeSingle();
  if (existing) return { ok: true as const, customerId: existing.customer_id, alreadyLinked: true };

  const { data: customer } = await admin.from("customers").select("id").ilike("email", user.email).eq("status", "active").maybeSingle();
  if (!customer) return { ok: false as const, reason: "purchase_not_found" };

  const { error } = await admin.from("customer_users").upsert({ customer_id: customer.id, user_id: user.id, role: "owner" }, { onConflict: "customer_id,user_id" });
  if (error) return { ok: false as const, reason: "link_failed" };

  await admin.from("customers").update({ updated_at: new Date().toISOString() }).eq("id", customer.id);
  return { ok: true as const, customerId: customer.id, alreadyLinked: false };
}

export async function requireCustomerAccess() {
  const access = await getCustomerAccess();
  if (!access) redirect("/onboarding");
  if (!access.hasAccess) redirect("/account/inactive");
  return access;
}
