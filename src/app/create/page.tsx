import Link from "next/link";
import CreateWizard from "@/components/create/CreateWizard";
import AppHeader from "@/components/ui/AppHeader";
import { t } from "@/lib/i18n";
import { getOrCreateUserId } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BUCKET_CHILD_PHOTOS } from "@/lib/storage";
import { getWhiteLabelSettings } from "@/lib/white-label/settings";
import { getStoryQuotaForUser } from "@/lib/story-quota";

export const dynamic = "force-dynamic";

const STORY_TOPUP_3_URL = "/api/retail/member-topup?sku=PBSK-STORY-CREDIT-3";
const STORY_TOPUP_8_URL = "/api/retail/member-topup?sku=PBSK-STORY-CREDIT-8";

export default async function CreatePage() {
  const [profiles, settings, quota] = await Promise.all([
    loadChildProfiles(),
    getWhiteLabelSettings(),
    loadStoryQuota(),
  ]);

  const quotaIsEmpty = Boolean(quota && quota.remaining <= 0);

  return (
    <main className="min-h-[100dvh] bg-surface">
      <AppHeader backHref="/app" title={t("header.createTitle")} />
      {quotaIsEmpty && quota ? (
        <QuotaTopupPanel quota={quota} />
      ) : (
        <CreateWizard profiles={profiles} themes={settings.themeCatalog} quota={quota} />
      )}
    </main>
  );
}

function QuotaTopupPanel({ quota }: { quota: { limit: number; used: number; remaining: number } }) {
  return (
    <section className="mx-auto w-full max-w-md px-5 py-8">
      <div className="rounded-[2rem] bg-surface-card p-6 shadow-lg ring-1 ring-black/[0.05]">
        <div className="rounded-card bg-red-50 px-4 py-4 text-red-700 ring-1 ring-red-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide opacity-75">Kuota Cerita</p>
              <p className="mt-1 text-base font-extrabold">
                {quota.used}/{quota.limit} terpakai · Sisa {quota.remaining}
              </p>
            </div>
            <span className="text-2xl" aria-hidden="true">🔒</span>
          </div>
        </div>

        <div className="mt-5">
          <h1 className="text-xl font-extrabold text-ink">Kuota cerita sudah habis</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Tambah kuota untuk membuat cerita baru. Koleksi cerita yang sudah dibuat tetap dapat dibaca tanpa top-up.
          </p>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-faint">Tambah kuota cerita</p>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={STORY_TOPUP_3_URL}
              className="rounded-2xl bg-white px-3 py-4 text-center ring-1 ring-black/[0.08] transition active:scale-95"
            >
              <span className="block text-base font-extrabold text-brand-primary">+3 Cerita</span>
              <span className="mt-1 block text-xs font-bold text-ink-soft">Rp50.000</span>
            </a>
            <a
              href={STORY_TOPUP_8_URL}
              className="rounded-2xl bg-brand-primary px-3 py-4 text-center text-white shadow-sm transition active:scale-95"
            >
              <span className="block text-base font-extrabold">+8 Cerita</span>
              <span className="mt-1 block text-xs font-bold text-white/90">Rp120.000 · Lebih hemat</span>
            </a>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink-faint">
          Top-up otomatis masuk ke akun member yang sedang login. Email dari OrderHero tidak menentukan pemilik kuota.
        </p>

        <Link href="/collection" className="btn-secondary mt-5 w-full">
          📚 Lihat Koleksi Cerita
        </Link>
      </div>
    </section>
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
