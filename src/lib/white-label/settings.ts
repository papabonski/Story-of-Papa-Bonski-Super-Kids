import { brand as defaultBrand, type Brand } from "../../../config/brand";
import { providers as defaultProviders, type ProviderConfig } from "../../../config/providers";
import { themes, type Theme } from "../../../config/themes";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type WhiteLabelLimits = {
  storiesPerUserPerMonth: number;
  maxChildProfiles: number;
  maxScenesPerStory: number;
};

export type WhiteLabelPricing = {
  currency: string;
  packages: { id: string; name: string; price: number; storyCredits: number }[];
};

export type WhiteLabelSettings = {
  brand: Brand;
  providers: ProviderConfig;
  themeCatalog: Theme[];
  limits: WhiteLabelLimits;
  pricing: WhiteLabelPricing;
};

export const defaultWhiteLabelSettings: WhiteLabelSettings = {
  brand: defaultBrand,
  providers: defaultProviders,
  themeCatalog: themes,
  limits: {
    storiesPerUserPerMonth: 20,
    maxChildProfiles: 5,
    maxScenesPerStory: 8,
  },
  pricing: {
    currency: "IDR",
    packages: [
      { id: "starter", name: "Starter", price: 49000, storyCredits: 10 },
      { id: "pro", name: "Pro", price: 149000, storyCredits: 40 },
      { id: "school", name: "Sekolah", price: 499000, storyCredits: 200 },
    ],
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function mergeObject<T extends Record<string, unknown>>(fallback: T, value: unknown): T {
  return { ...fallback, ...(isObject(value) ? value : {}) } as T;
}

function mergeBrand(value: unknown): Brand {
  const raw = mergeObject(defaultBrand as unknown as Record<string, unknown>, value);
  const colors = mergeObject(defaultBrand.colors as unknown as Record<string, unknown>, raw.colors);
  const links = mergeObject((defaultBrand.links ?? {}) as Record<string, unknown>, raw.links);
  return {
    ...defaultBrand,
    ...raw,
    colors,
    links,
  } as Brand;
}

function mergeProviders(value: unknown): ProviderConfig {
  const raw = mergeObject(defaultProviders as unknown as Record<string, unknown>, value);
  return {
    story: mergeObject(defaultProviders.story, raw.story),
    image: mergeObject(defaultProviders.image, raw.image),
    tts: mergeObject(defaultProviders.tts, raw.tts),
  } as ProviderConfig;
}

function validThemeCatalog(value: unknown): Theme[] {
  if (!Array.isArray(value)) return themes;
  const valid = value.filter((item): item is Theme => {
    if (!isObject(item)) return false;
    return (
      typeof item.id === "string" &&
      typeof item.label === "string" &&
      Array.isArray(item.subThemes)
    );
  });
  return valid.length > 0 ? valid : themes;
}

export async function getWhiteLabelSettings(): Promise<WhiteLabelSettings> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("white_label_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();
    if (error || !data) return defaultWhiteLabelSettings;

    return {
      brand: mergeBrand(data.brand),
      providers: mergeProviders(data.providers),
      themeCatalog: validThemeCatalog(data.theme_catalog),
      limits: mergeObject(defaultWhiteLabelSettings.limits, data.limits),
      pricing: mergeObject(defaultWhiteLabelSettings.pricing, data.pricing),
    };
  } catch {
    return defaultWhiteLabelSettings;
  }
}

export async function getRuntimeBrand(): Promise<Brand> {
  return (await getWhiteLabelSettings()).brand;
}

export async function getRuntimeProviders(): Promise<ProviderConfig> {
  return (await getWhiteLabelSettings()).providers;
}
