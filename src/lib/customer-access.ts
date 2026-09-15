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

export const CUSTOMER_ENTITLEMENTS = {
  superKids: "super_kids_access",
  mandarin: "mandarin_access",
} as const;

export type CustomerEntitlement = typeof CUSTOMER_ENTITLEMENTS[keyof typeof CUSTOMER_ENTITLEMENTS];

export const CUSTOMER_MODULES: Record<CustomerEntitlement, { planCode: string }> = {
  [CUSTOMER_ENTITLEMENTS.superKids]: { planCode: "PBSK-PREMIUM-1Y" },
  [CUSTOMER_ENTITLEMENTS.mandarin]: { planCode: "PBM-MANDARIN-1Y" },
};

export type CustomerPortalAccess = {
  userId: string;
  email: string;
  customerId: string;
  customerCode: string;
  customerName: string;
  role: string;
  hasAccess: boolean;
  modules: Record<CustomerEntitlement, boolean>;
};

export async function getCustomerAccess(
  entitlementKey: CustomerEntitlement = CUSTOMER_ENTITLEMENTS.superKids,
): Promise<CustomerAccess | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.is_anonymous || !user.email) return null;

  const admin = createSupabaseAdminClient();
  const planCode = CUSTOMER_MODULES[entitlementKey].planCode;
  const { data: membership } = await admin
    .from("customer_users")
    .select("customer_id,role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) return null;

  const [{ data: customer }, { data: entitlement }, { data: subscription }] = await Promise.all([
    admin.from("customers").select("id,customer_code,name,status").eq("id", membership.customer_id).maybeSingle(),
    admin.from("entitlements").select("expires_at").eq("customer_id", membership.customer_id).eq("key", entitlementKey).maybeSingle(),
    admin.from("subscriptions")
      .select("status,expires_at,plan_id,plans!inner(code)")
      .eq("customer_id", membership.customer_id)
      .eq("plans.code", planCode)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (!customer) return null;

  let planName: string | null = null;
  if (subscription?.plan_id) {
    const { data: plan } = await admin.from("plans").select("name").eq("id", subscription.plan_id).maybeSingle();
    planName = plan?.name ?? null;
  }

  const hasActiveSubscription = subscription?.status === "active";
  // Product access is lifetime. Expiry fields are retained only for backward
  // compatibility while old rows are normalized to NULL by migration.
  const hasAccess = customer.status === "active" && Boolean(entitlement) && hasActiveSubscription;

  return {
    userId: user.id,
    email: user.email,
    customerId: customer.id,
    customerCode: customer.customer_code,
    customerName: customer.name,
    role: membership.role,
    planName,
    subscriptionStatus: subscription?.status ?? null,
    expiresAt: null,
    hasAccess,
  };
}

export async function getCustomerPortalAccess(): Promise<CustomerPortalAccess | null> {
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

  const entitlementKeys = Object.keys(CUSTOMER_MODULES) as CustomerEntitlement[];
  const planCodes = Object.values(CUSTOMER_MODULES).map((module) => module.planCode);
  const [{ data: customer }, { data: entitlements }, { data: subscriptions }] = await Promise.all([
    admin.from("customers").select("id,customer_code,name,status").eq("id", membership.customer_id).maybeSingle(),
    admin.from("entitlements").select("key").eq("customer_id", membership.customer_id).in("key", entitlementKeys),
    admin.from("subscriptions")
      .select("status,plans!inner(code)")
      .eq("customer_id", membership.customer_id)
      .eq("status", "active")
      .in("plans.code", planCodes),
  ]);
  if (!customer) return null;

  const entitlementSet = new Set((entitlements || []).map((item) => item.key));
  const activePlanSet = new Set(
    (subscriptions || []).flatMap((item: any) => {
      const plan = Array.isArray(item.plans) ? item.plans[0] : item.plans;
      return plan?.code ? [plan.code] : [];
    }),
  );
  const modules = Object.fromEntries(
    entitlementKeys.map((key) => [
      key,
      customer.status === "active" && entitlementSet.has(key) && activePlanSet.has(CUSTOMER_MODULES[key].planCode),
    ]),
  ) as Record<CustomerEntitlement, boolean>;

  return {
    userId: user.id,
    email: user.email,
    customerId: customer.id,
    customerCode: customer.customer_code,
    customerName: customer.name,
    role: membership.role,
    hasAccess: Object.values(modules).some(Boolean),
    modules,
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

export async function requireCustomerAccess(
  entitlementKey: CustomerEntitlement = CUSTOMER_ENTITLEMENTS.superKids,
  nextPath = "/app",
) {
  const access = await getCustomerAccess(entitlementKey);
  if (!access) redirect(`/onboarding?next=${encodeURIComponent(nextPath)}`);
  if (!access.hasAccess) redirect(`/account/inactive?product=${entitlementKey === CUSTOMER_ENTITLEMENTS.mandarin ? "mandarin" : "super-kids"}`);
  return access;
}

export async function requireCustomerPortalAccess(nextPath = "/app") {
  const access = await getCustomerPortalAccess();
  if (!access) redirect(`/onboarding?next=${encodeURIComponent(nextPath)}`);
  if (!access.hasAccess) redirect("/account/inactive?product=portal");
  return access;
}
