import CreateWizard from "@/components/create/CreateWizard";
import AppHeader from "@/components/ui/AppHeader";
import { t } from "@/lib/i18n";
import { getOrCreateUserId } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BUCKET_CHILD_PHOTOS } from "@/lib/storage";
import { getWhiteLabelSettings } from "@/lib/white-label/settings";
import { getStoryQuotaForUser } from "@/lib/story-quota";

export const dynamic = "force-dynamic";

export default async function CreatePage() {
  const [profiles, settings, quota] = await Promise.all([
    loadChildProfiles(),
    getWhiteLabelSettings(),
    loadStoryQuota(),
  ]);

  return (
    <main className="min-h-[100dvh] bg-surface">
      <AppHeader backHref="/" title={t("header.createTitle")} />
      <CreateWizard profiles={profiles} themes={settings.themeCatalog} quota={quota} />
    </main>
  );
}

async function loadChildProfiles() {
  try {
    const supabase = await createSupabaseServerClient();
    const userId = await getOrCreateUserId();

    const { data: children } = await supabase
      .from("children")
      .select("id, name, age, gender, photo_path, character_description, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    return Promise.all(
      (children ?? []).map(async (child) => {
        let photoUrl: string | null = null;
        if (child.photo_path) {
          const { data } = await supabase.storage
            .from(BUCKET_CHILD_PHOTOS)
            .createSignedUrl(child.photo_path, 60 * 60);
          photoUrl = data?.signedUrl ?? null;
        }

        return {
          id: child.id,
          name: child.name,
          age: child.age,
          gender: child.gender,
          photoUrl,
          hasCharacterDescription: Boolean(child.character_description),
        };
      })
    );
  } catch {
    return [];
  }
}


async function loadStoryQuota() {
  try {
    const userId = await getOrCreateUserId();
    return await getStoryQuotaForUser(userId);
  } catch {
    return null;
  }
}
