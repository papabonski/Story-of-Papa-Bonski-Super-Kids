import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type StoryQuotaStatus = {
  customerId: string;
  limit: number;
  used: number;
  remaining: number;
};

export type StoryQuotaReservation = StoryQuotaStatus & {
  managed: boolean;
  ok: boolean;
};

export async function getStoryQuotaForUser(userId: string): Promise<StoryQuotaStatus | null> {
  const admin = createSupabaseAdminClient();

  const { data: membership, error: membershipError } = await admin
    .from("customer_users")
    .select("customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipError) throw new Error(membershipError.message);
  if (!membership?.customer_id) return null;

  const { data: subscription, error: subscriptionError } = await admin
    .from("subscriptions")
    .select("plan_id,status,expires_at,created_at")
    .eq("customer_id", membership.customer_id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subscriptionError) throw new Error(subscriptionError.message);

  let baseLimit = 0;
  if (subscription?.plan_id) {
    const { data: plan, error: planError } = await admin
      .from("plans")
      .select("story_limit")
      .eq("id", subscription.plan_id)
      .eq("active", true)
      .maybeSingle();
    if (planError) throw new Error(planError.message);
    baseLimit = Number(plan?.story_limit) || 0;
  }

  const { data: grants, error: grantsError } = await admin
    .from("story_credit_grants")
    .select("credits")
    .eq("customer_id", membership.customer_id);
  if (grantsError) throw new Error(grantsError.message);
  const extraCredits = (grants ?? []).reduce(
    (sum: number, row: { credits?: number | null }) => sum + (Number(row.credits) || 0),
    0,
  );
  const limit = baseLimit + extraCredits;

  const { count, error: countError } = await admin
    .from("story_credit_usage")
    .select("id", { count: "exact", head: true })
    .eq("customer_id", membership.customer_id);

  if (countError) throw new Error(countError.message);

  const used = count ?? 0;
  return {
    customerId: membership.customer_id,
    limit,
    used,
    remaining: Math.max(limit - used, 0),
  };
}

export async function reserveStoryCreditForUser(
  userId: string,
  storyId: string,
): Promise<StoryQuotaReservation> {
  const quota = await getStoryQuotaForUser(userId);
  if (!quota) {
    return {
      managed: false,
      ok: true,
      customerId: "",
      limit: 0,
      used: 0,
      remaining: 0,
    };
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.rpc("reserve_story_credit", {
    p_customer_id: quota.customerId,
    p_user_id: userId,
    p_story_id: storyId,
  });

  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : null;
  if (!row) throw new Error("Quota cerita tidak dapat diverifikasi.");

  return {
    managed: true,
    ok: row.ok === true,
    customerId: quota.customerId,
    limit: Number(row.story_limit) || 0,
    used: Number(row.used) || 0,
    remaining: Number(row.remaining) || 0,
  };
}

export async function releaseStoryCredit(customerId: string, storyId: string) {
  if (!customerId) return;
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("release_story_credit", {
    p_customer_id: customerId,
    p_story_id: storyId,
  });
  if (error) throw new Error(error.message);
}
