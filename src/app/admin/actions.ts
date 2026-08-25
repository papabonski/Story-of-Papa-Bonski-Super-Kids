"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import {
  defaultWhiteLabelSettings,
  type WhiteLabelLimits,
  type WhiteLabelPricing,
} from "@/lib/white-label/settings";

export type AdminSettingsState = {
  error: string | null;
  saved: boolean;
};

function requireAdminSecret(formData: FormData) {
  const configured = process.env.ADMIN_DASHBOARD_SECRET ?? process.env.STORY_WORKER_SECRET;
  if (!configured) return;
  const submitted = String(formData.get("adminSecret") ?? "");
  if (submitted !== configured) {
    throw new Error("Secret admin salah.");
  }
}

function clean(value: FormDataEntryValue | null, fallback = ""): string {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function rgb(value: FormDataEntryValue | null, fallback: string): string {
  const hex = clean(value, "");
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match) return fallback;
  const raw = match[1];
  return [
    Number.parseInt(raw.slice(0, 2), 16),
    Number.parseInt(raw.slice(2, 4), 16),
    Number.parseInt(raw.slice(4, 6), 16),
  ].join(" ");
}

function num(value: FormDataEntryValue | null, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function jsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
  const text = clean(value, "");
  if (!text) return fallback;
  return JSON.parse(text) as T;
}

export async function saveWhiteLabelSettings(
  _prevState: AdminSettingsState,
  formData: FormData
): Promise<AdminSettingsState> {
  try {
    requireAdminSecret(formData);

    const fallback = defaultWhiteLabelSettings;
    const limits: WhiteLabelLimits = {
      storiesPerUserPerMonth: num(
        formData.get("storiesPerUserPerMonth"),
        fallback.limits.storiesPerUserPerMonth
      ),
      maxChildProfiles: num(formData.get("maxChildProfiles"), fallback.limits.maxChildProfiles),
      maxScenesPerStory: num(formData.get("maxScenesPerStory"), fallback.limits.maxScenesPerStory),
    };
    const pricing = jsonField<WhiteLabelPricing>(formData.get("pricingJson"), fallback.pricing);
    const themeCatalog = jsonField<unknown[]>(formData.get("themeCatalogJson"), fallback.themeCatalog);

    const brand = {
      name: clean(formData.get("brandName"), fallback.brand.name),
      tagline: clean(formData.get("tagline"), fallback.brand.tagline),
      subtagline: clean(formData.get("subtagline"), fallback.brand.subtagline),
      logoEmoji: clean(formData.get("logoEmoji"), fallback.brand.logoEmoji),
      logoSrc: clean(formData.get("logoSrc"), fallback.brand.logoSrc ?? ""),
      defaultLocale: clean(formData.get("defaultLocale"), fallback.brand.defaultLocale),
      colors: {
        primary: rgb(formData.get("primary"), fallback.brand.colors.primary),
        secondary: rgb(formData.get("secondary"), fallback.brand.colors.secondary),
        accent: rgb(formData.get("accent"), fallback.brand.colors.accent),
        surface: rgb(formData.get("surface"), fallback.brand.colors.surface),
        surfaceSoft: rgb(formData.get("surfaceSoft"), fallback.brand.colors.surfaceSoft),
        surfaceCard: rgb(formData.get("surfaceCard"), fallback.brand.colors.surfaceCard),
        ink: rgb(formData.get("ink"), fallback.brand.colors.ink),
        inkSoft: rgb(formData.get("inkSoft"), fallback.brand.colors.inkSoft),
        inkFaint: rgb(formData.get("inkFaint"), fallback.brand.colors.inkFaint),
      },
      links: {
        website: clean(formData.get("website"), ""),
        support: clean(formData.get("support"), ""),
      },
    };

    const providers = {
      story: {
        provider: clean(formData.get("storyProvider"), fallback.providers.story.provider),
        model: clean(formData.get("storyModel"), fallback.providers.story.model),
      },
      image: {
        provider: clean(formData.get("imageProvider"), fallback.providers.image.provider),
        model: clean(formData.get("imageModel"), fallback.providers.image.model),
        aspectRatio: clean(formData.get("imageAspectRatio"), fallback.providers.image.aspectRatio),
        resolution: clean(formData.get("imageResolution"), fallback.providers.image.resolution),
      },
      tts: {
        provider: clean(formData.get("ttsProvider"), fallback.providers.tts.provider),
        model: clean(formData.get("ttsModel"), fallback.providers.tts.model),
        voice: clean(formData.get("ttsVoice"), fallback.providers.tts.voice),
        languageCode: clean(formData.get("ttsLanguageCode"), fallback.providers.tts.languageCode),
        speakingRate: num(formData.get("ttsSpeakingRate"), fallback.providers.tts.speakingRate),
        stability: num(formData.get("ttsStability"), fallback.providers.tts.stability),
        similarityBoost: num(
          formData.get("ttsSimilarityBoost"),
          fallback.providers.tts.similarityBoost
        ),
        style: num(formData.get("ttsStyle"), fallback.providers.tts.style),
      },
    };

    const admin = createSupabaseAdminClient();
    const { error } = await admin.from("white_label_settings").upsert({
      id: "default",
      brand,
      providers,
      limits,
      pricing,
      theme_catalog: themeCatalog,
    });
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin");
    return { error: null, saved: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal menyimpan pengaturan.",
      saved: false,
    };
  }
}

export async function resetWhiteLabelSettings(formData: FormData) {
  requireAdminSecret(formData);
  const admin = createSupabaseAdminClient();
  await admin.from("white_label_settings").delete().eq("id", "default");
  await admin.from("white_label_settings").insert({ id: "default" });
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
