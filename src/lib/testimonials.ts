import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type TestimonialProduct = "super-kids" | "mandarin" | "matematika";

export const TESTIMONIAL_PRODUCTS: Record<TestimonialProduct, {
  name: string;
  promotionKey: string;
  formPath: string;
}> = {
  "super-kids": {
    name: "Papa Bonski Super Kids",
    promotionKey: "super-kids-launch-50",
    formPath: "/super-kids/testimoni",
  },
  mandarin: {
    name: "Papa Bonski Mandarin",
    promotionKey: "mandarin-launch-50",
    formPath: "/mandarin/testimoni",
  },
  matematika: {
    name: "Papa Bonski Matematika",
    promotionKey: "matematika-launch-50",
    formPath: "/matematika/testimoni",
  },
};

export type PublicTestimonial = {
  id: string;
  rating: number;
  review: string;
  displayName: string;
};

export async function getApprovedTestimonials(product: TestimonialProduct, limit = 6): Promise<PublicTestimonial[]> {
  const db = createSupabaseAdminClient();
  const config = TESTIMONIAL_PRODUCTS[product];
  const { data: claims, error: claimsError } = await db
    .from("promo_claims")
    .select("id")
    .eq("promotion_key", config.promotionKey)
    .eq("status", "activated");
  if (claimsError || !claims?.length) return [];

  const { data, error } = await db
    .from("testimonials")
    .select("id,rating,review,display_name")
    .in("promo_claim_id", claims.map((claim) => claim.id))
    .eq("publication_consent", true)
    .eq("moderation_status", "approved")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(Math.max(1, Math.min(limit, 12)));
  if (error) return [];

  return (data || []).map((item) => ({
    id: String(item.id),
    rating: Number(item.rating),
    review: String(item.review),
    displayName: String(item.display_name),
  }));
}
