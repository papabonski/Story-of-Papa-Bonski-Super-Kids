"use server";

import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateUserId } from "@/lib/supabase/auth";
import { BUCKET_CHILD_PHOTOS, childPhotoPath } from "@/lib/storage";
import { enqueueStoryJob } from "@/lib/jobs/story-queue";
import { getWhiteLabelSettings } from "@/lib/white-label/settings";
import {
  getStoryQuotaForUser,
  reserveStoryCreditForUser,
  releaseStoryCredit,
} from "@/lib/story-quota";
import {
  illustrationStylePresets,
  storyLanguageLevels,
} from "../../../config/themes";
import type { Gender } from "@/lib/database.types";

export type CreateStoryState = {
  error: string | null;
  /** Set on success — the client navigates here (see CreateWizard). */
  storyId: string | null;
};

/**
 * Creates the child + story records from the wizard's FormData, uploads the
 * child's photo to the private bucket, then returns the new story id so the
 * CLIENT can navigate to the story page where generation kicks off.
 *
 * We deliberately do NOT redirect() from inside the action: a server-side
 * redirect makes Next re-render the destination within this same POST, so any
 * error there comes back as an opaque 500 that the error boundary can't show.
 * Navigating client-side lets /story/[id] surface its own errors normally.
 */
export async function createStory(
  _prevState: CreateStoryState,
  formData: FormData
): Promise<CreateStoryState> {
  const name = String(formData.get("name") ?? "").trim();
  const ageRaw = String(formData.get("age") ?? "").trim();
  const gender = String(formData.get("gender") ?? "male") as Gender;
  const childId = String(formData.get("childId") ?? "").trim();
  const themeId = String(formData.get("themeId") ?? "").trim();
  const subThemeId = String(formData.get("subThemeId") ?? "").trim();
  const lengthId = String(formData.get("lengthId") ?? "auto").trim();
  const rawLanguageLevelId = String(formData.get("languageLevelId") ?? "auto").trim();
  const languageLevelId = storyLanguageLevels.some((level) => level.id === rawLanguageLevelId)
    ? rawLanguageLevelId
    : "auto";
  const rawIllustrationStyleId = String(
    formData.get("illustrationStyleId") ?? illustrationStylePresets[0]?.id ?? "pastel-storybook"
  ).trim();
  const illustrationStyleId = illustrationStylePresets.some(
    (style) => style.id === rawIllustrationStyleId
  )
    ? rawIllustrationStyleId
    : illustrationStylePresets[0]?.id ?? "pastel-storybook";
  const situation = String(formData.get("situation") ?? "").trim();
  const photo = formData.get("photo");

  if (!childId && !name) return { error: "Nama anak wajib diisi.", storyId: null };
  if (!themeId || !subThemeId)
    return { error: "Tema dan sub tema wajib dipilih.", storyId: null };

  const age = ageRaw ? Number(ageRaw) : null;
  if (!childId && age !== null && (!Number.isFinite(age) || age < 0 || age > 17)) {
    return { error: "Usia anak harus antara 0 sampai 17 tahun.", storyId: null };
  }

  let storyId: string;
  let quotaAdmin: ReturnType<typeof createSupabaseAdminClient> | null = null;
  let quotaReservation: { customerId: string; storyId: string } | null = null;

  async function releaseQuotaReservation() {
    if (!quotaAdmin || !quotaReservation) return;
    try {
      await (quotaAdmin as any).rpc("release_story_credit", {
        p_customer_id: quotaReservation.customerId,
        p_story_id: quotaReservation.storyId,
      });
    } catch {
      // Best effort only. The reservation remains auditable if cleanup fails.
    }
    quotaReservation = null;
  }

  try {
    const userId = await getOrCreateUserId();
    const supabase = await createSupabaseServerClient();
    const settings = await getWhiteLabelSettings();

    // Commercial customers use a permanent per-account credit ledger.
    // Deleting a story does not restore a consumed credit.
    const accountQuota = await getStoryQuotaForUser(userId);
    if (accountQuota) {
      if (accountQuota.limit <= 0) {
        return {
          error: "Paket akun ini belum memiliki kuota cerita aktif.",
          storyId: null,
        };
      }
      if (accountQuota.remaining <= 0) {
        return {
          error: `Kuota ${accountQuota.limit} cerita untuk akun ini sudah habis (${accountQuota.used}/${accountQuota.limit} terpakai). Cerita tambahan perlu dibeli.`,
          storyId: null,
        };
      }
    } else {
      // Legacy/non-customer installs keep the existing monthly white-label limit.
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const { count: monthlyStoryCount, error: monthlyErr } = await supabase
        .from("stories")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", monthStart.toISOString());
      if (monthlyErr) throw new Error(monthlyErr.message);
      if (
        settings.limits.storiesPerUserPerMonth > 0 &&
        (monthlyStoryCount ?? 0) >= settings.limits.storiesPerUserPerMonth
      ) {
        return {
          error: `Limit ${settings.limits.storiesPerUserPerMonth} cerita bulan ini sudah tercapai.`,
          storyId: null,
        };
      }
    }

    // 1) Reuse an existing child profile, or create a new reusable profile.
    let child: { id: string };
    if (childId) {
      const { data: existingChild, error: childErr } = await supabase
        .from("children")
        .select("id, user_id")
        .eq("id", childId)
        .maybeSingle();
      if (childErr || !existingChild) {
        return {
          error: "Profil anak tidak ditemukan: " + (childErr?.message ?? ""),
          storyId: null,
        };
      }
      if (existingChild.user_id !== userId) {
        return { error: "Profil anak tidak diizinkan.", storyId: null };
      }
      child = { id: existingChild.id };
    } else {
      const { count: childCount, error: childCountErr } = await supabase
        .from("children")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      if (childCountErr) throw new Error(childCountErr.message);
      if (
        settings.limits.maxChildProfiles > 0 &&
        (childCount ?? 0) >= settings.limits.maxChildProfiles
      ) {
        return {
          error: `Limit ${settings.limits.maxChildProfiles} profil anak sudah tercapai.`,
          storyId: null,
        };
      }
      const { data: newChild, error: childErr } = await supabase
        .from("children")
        .insert({ user_id: userId, name, age, gender })
        .select("id")
        .single();
      if (childErr || !newChild) {
        return {
          error: "Gagal menyimpan profil anak: " + (childErr?.message ?? ""),
          storyId: null,
        };
      }
      child = { id: newChild.id };
    }

    // 2) Upload the photo for newly created profiles to the PRIVATE child-photos bucket.
    if (!childId && photo instanceof File && photo.size > 0) {
      const ext = (photo.name.split(".").pop() || "jpg").toLowerCase();
      const path = childPhotoPath(userId, child.id, ext);
      const bytes = new Uint8Array(await photo.arrayBuffer());
      const { error: upErr } = await supabase.storage
        .from(BUCKET_CHILD_PHOTOS)
        .upload(path, bytes, { contentType: photo.type || "image/jpeg", upsert: true });
      if (!upErr) {
        await supabase.from("children").update({ photo_path: path }).eq("id", child.id);
      }
      // A failed upload is non-fatal — the story can still be generated without a
      // reference photo (illustration falls back to a described character).
    }

    // 3) Reserve one permanent story credit BEFORE creating/enqueuing the story.
    // If the account is already at its limit, we stop here so Gemini is never called.
    storyId = crypto.randomUUID();

    if (requireCustomerQuota && quotaAdmin && quotaCustomerId) {
      const { data: quotaRows, error: quotaErr } = await (quotaAdmin as any).rpc(
        "reserve_story_credit",
        {
          p_customer_id: quotaCustomerId,
          p_user_id: userId,
          p_story_id: storyId,
        }
      );

      if (quotaErr) {
        throw new Error(`Gagal memeriksa kuota cerita: ${quotaErr.message}`);
      }

      const quota = Array.isArray(quotaRows) ? quotaRows[0] : quotaRows;
      if (!quota?.ok) {
        const limit = Number(quota?.story_limit) || 2;
        const used = Number(quota?.used) || limit;
        return {
          error: `Kuota cerita akun ini sudah habis (${used}/${limit}). Beli kredit cerita tambahan untuk membuat cerita baru.`,
          storyId: null,
        };
      }

      quotaReservation = { customerId: quotaCustomerId, storyId };
    }

    // 4) Insert the story (status = pending; generation happens on the story page).
    const theme = settings.themeCatalog.find((item) => item.id === themeId);
    const sub = theme?.subThemes.find((item) => item.id === subThemeId);
    const { data: story, error: storyErr } = await supabase
      .from("stories")
      .insert({
        id: storyId,
        user_id: userId,
        child_id: child.id,
        theme_id: themeId,
        theme_label: theme?.label ?? null,
        subtheme_id: subThemeId,
        subtheme_label: sub?.label ?? null,
        situation: situation || null,
        length_id: lengthId,
        language_level: languageLevelId,
        illustration_style: illustrationStyleId,
        language: settings.brand.defaultLocale,
        status: "pending",
      })
      .select("id")
      .single();
    if (storyErr || !story) {
      return { error: "Gagal membuat cerita: " + (storyErr?.message ?? ""), storyId: null };
    }
    storyId = story.id;

    // Reserve the account credit BEFORE any AI generation is enqueued.
    // The database function serializes reservations per customer, so two
    // simultaneous taps cannot spend more credits than the plan allows.
    let reservation;
    try {
      reservation = await reserveStoryCreditForUser(userId, storyId);
    } catch (quotaError) {
      await supabase.from("stories").delete().eq("id", storyId);
      throw quotaError;
    }

    if (reservation.managed && !reservation.ok) {
      await supabase.from("stories").delete().eq("id", storyId);
      return {
        error: `Kuota ${reservation.limit} cerita untuk akun ini sudah habis (${reservation.used}/${reservation.limit} terpakai). Cerita tambahan perlu dibeli.`,
        storyId: null,
      };
    }

    try {
      await enqueueStoryJob(supabase, {
        storyId,
        userId,
        phase: "text",
        metadata: { source: "create_story" },
      });
    } catch (queueError) {
      // Do not charge a story credit when generation never entered the queue.
      if (reservation.managed && reservation.customerId) {
        try {
          await releaseStoryCredit(reservation.customerId, storyId);
        } catch {
          // Best effort cleanup; preserve the original queue error below.
        }
      }
      await supabase.from("stories").delete().eq("id", storyId);
      throw queueError;
    }
  } catch (error) {
    await releaseQuotaReservation();
    const message = error instanceof Error ? error.message : "Gagal membuat cerita.";
    return { error: message, storyId: null };
  }

  // Success — the client (CreateWizard) navigates to the story page.
  return { error: null, storyId };
}
