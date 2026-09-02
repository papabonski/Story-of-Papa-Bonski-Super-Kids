"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createStory, type CreateStoryState } from "@/app/actions/createStory";
import {
  childIssuePresets,
  themes as defaultThemes,
  storyLengths,
  storyLanguageLevels,
  illustrationStylePresets,
  type Theme,
} from "../../../config/themes";
import { downscaleImage, isHeic, setInputFile } from "@/lib/image-utils";
import { t } from "@/lib/i18n";
import type { Gender } from "@/lib/database.types";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB
const STORY_TOPUP_3_URL = "/super-kids/checkout";
const STORY_TOPUP_8_URL = "/super-kids/checkout";
const initialCreateStoryState: CreateStoryState = {
  error: null,
  storyId: null,
};

export type ChildProfile = {
  id: string;
  name: string;
  age: number | null;
  gender: Gender | null;
  photoUrl: string | null;
  hasCharacterDescription: boolean;
};

export default function CreateWizard({
  profiles = [],
  themes = defaultThemes,
  quota = null,
}: {
  profiles?: ChildProfile[];
  themes?: Theme[];
  quota?: { limit: number; used: number; remaining: number } | null;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createStory, initialCreateStoryState);

  // On success the action returns the new story id; navigate there client-side
  // so the story page can surface its own errors (instead of a server-action
  // redirect that turns any downstream error into an opaque 500 on /create).
  useEffect(() => {
    if (state.storyId) router.push(`/story/${state.storyId}`);
  }, [state.storyId, router]);

  // Step 1 state
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id ?? "new");
  const selectedProfile = profiles.find((profile) => profile.id === selectedProfileId) ?? null;
  const creatingNewProfile = selectedProfileId === "new";
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const ageInputRef = useRef<HTMLInputElement>(null);

  // Step 2 state
  const [themeId, setThemeId] = useState(themes[0]?.id ?? "");
  const subThemes = useMemo(
    () => themes.find((theme) => theme.id === themeId)?.subThemes ?? [],
    [themeId, themes]
  );
  const [subThemeId, setSubThemeId] = useState(subThemes[0]?.id ?? "");
  const [lengthId, setLengthId] = useState(storyLengths[0]?.id ?? "auto");
  const [languageLevelId, setLanguageLevelId] = useState(storyLanguageLevels[0]?.id ?? "auto");
  const [illustrationStyleId, setIllustrationStyleId] = useState(
    illustrationStylePresets[0]?.id ?? "pastel-storybook"
  );
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [situation, setSituation] = useState("");

  // Per-field errors (inline) instead of one opaque banner.
  const [errors, setErrors] = useState<{ name?: string; age?: string; photo?: string }>({});
  const activeChildName = creatingNewProfile ? name : selectedProfile?.name ?? "";
  const activePhotoUrl = creatingNewProfile ? photoUrl : selectedProfile?.photoUrl ?? null;
  const quotaExhausted = Boolean(state.error?.includes("Cerita tambahan perlu dibeli"));

  function selectProfile(id: string) {
    setSelectedProfileId(id);
    setErrors({});
  }

  async function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    setErrors((p) => ({ ...p, photo: undefined }));

    // HEIC files often arrive with an empty MIME type, so accept them by
    // extension too — downscaleImage() transcodes them to JPEG.
    if (!file.type.startsWith("image/") && !isHeic(file)) {
      setErrors((p) => ({ ...p, photo: t("wizard.errPhotoType") }));
      setInputFile(input, null);
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setErrors((p) => ({ ...p, photo: t("wizard.errPhotoSize") }));
      setInputFile(input, null);
      return;
    }

    setPhotoBusy(true);
    try {
      // Shrink in the browser so we upload ~100KB instead of several MB.
      const optimized = await downscaleImage(file);
      setInputFile(input, optimized);
      setPhotoUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(optimized);
      });
    } finally {
      setPhotoBusy(false);
    }
  }

  function removePhoto() {
    if (fileInputRef.current) setInputFile(fileInputRef.current, null);
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setErrors((p) => ({ ...p, photo: undefined }));
  }

  function goNext() {
    const next: typeof errors = {};
    if (creatingNewProfile && !name.trim()) next.name = t("wizard.errNameRequired");
    if (creatingNewProfile && age !== "" && (Number(age) < 0 || Number(age) > 17)) {
      next.age = t("wizard.errAgeInvalid");
    }
    setErrors((p) => ({ ...p, ...next, name: next.name, age: next.age }));

    if (next.name) return nameInputRef.current?.focus();
    if (next.age) return ageInputRef.current?.focus();
    setStep(2);
  }

  function onThemeChange(id: string) {
    setThemeId(id);
    setSubThemeId(themes.find((theme) => theme.id === id)?.subThemes[0]?.id ?? "");
    setSelectedIssueId(null);
  }

  function applyIssuePreset(id: string) {
    const preset = childIssuePresets.find((item) => item.id === id);
    if (!preset) return;
    setSelectedIssueId(id);
    setThemeId(preset.themeId);
    setSubThemeId(preset.subThemeId);
    setSituation(preset.situation);
  }

  return (
    <form action={formAction} className="relative mx-auto w-full max-w-md px-5 py-6">
      <SubmitOverlay pending={pending || !!state.storyId} />
      <input
        type="hidden"
        name="childId"
        value={creatingNewProfile ? "" : selectedProfileId}
      />

      {/* Step navigation / progress (the app header handles going Home). */}
      <div className="mb-6 flex items-center justify-between text-sm">
        {step === 2 ? (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="font-semibold text-ink-soft transition hover:text-ink"
          >
            {t("wizard.back")}
          </button>
        ) : (
          <span />
        )}
        <span className="font-semibold text-ink-faint">
          {t("wizard.step", { current: step, total: 2 })}
        </span>
      </div>
      <div
        className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-surface-soft"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={2}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-accent via-brand-secondary to-brand-primary transition-all duration-500"
          style={{ width: step === 1 ? "50%" : "100%" }}
        />
      </div>

      {quota && (
        <div
          className={`mb-5 rounded-card px-4 py-3 ring-1 ${
            quota.remaining > 0
              ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
              : "bg-red-50 text-red-700 ring-red-100"
          }`}
          aria-label="Status kuota cerita"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide opacity-75">Kuota Cerita</p>
              <p className="mt-0.5 text-sm font-extrabold">
                {quota.used}/{quota.limit} terpakai · Sisa {quota.remaining}
              </p>
            </div>
            <div className="text-2xl" aria-hidden="true">
              {quota.remaining > 0 ? "📚" : "🔒"}
            </div>
          </div>
          {quota.remaining > 0 && quota.limit > 2 && (
            <p className="mt-2 text-xs font-semibold opacity-80">
              Kuota tambahan sudah aktif dan siap digunakan.
            </p>
          )}
        </div>
      )}

      {state.error && (
        <div
          role="alert"
          className="anim-fade-up mb-5 rounded-card bg-red-50 px-4 py-3 text-sm font-semibold leading-relaxed text-red-700 ring-1 ring-red-100"
        >
          <p>{state.error}</p>
          {quotaExhausted && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-700/80">
                Tambah kuota cerita
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={STORY_TOPUP_3_URL}
                  className="rounded-card bg-white px-3 py-3 text-center ring-1 ring-red-200 transition active:scale-95"
                >
                  <span className="block text-sm font-extrabold text-brand-primary">+3 Cerita</span>
                  <span className="block text-xs font-bold text-ink-soft">Rp50.000</span>
                </a>
                <a
                  href={STORY_TOPUP_8_URL}
                  className="rounded-card bg-brand-primary px-3 py-3 text-center text-white transition active:scale-95"
                >
                  <span className="block text-sm font-extrabold">+8 Cerita</span>
                  <span className="block text-xs font-bold text-white/90">Rp120.000 · Lebih hemat</span>
                </a>
              </div>
              <p className="mt-3 text-xs font-medium text-red-700/80">
                Tambahan cerita harus menggunakan Email Penerima / email login Papa Bonski yang akan menerima kuota. Setelah pembayaran berhasil, kembali ke aplikasi lalu muat ulang halaman ini.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* STEP 1 — Tokoh Utama                                              */}
      {/* Kept mounted (hidden on step 2) so all inputs submit with the form */}
      {/* ----------------------------------------------------------------- */}
      <section className={step === 1 ? "block anim-fade-up" : "hidden"}>
        <h1 className="text-2xl font-extrabold text-ink">
          <span className="inline-block bounce-soft">⭐</span> {t("wizard.characterTitle")}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{t("wizard.characterSubtitle")}</p>

        <div className="mt-6 space-y-4">
          {profiles.length > 0 && (
            <ProfilePicker
              profiles={profiles}
              selectedId={selectedProfileId}
              onSelect={selectProfile}
            />
          )}

          {!creatingNewProfile && selectedProfile && (
            <SelectedProfileCard profile={selectedProfile} />
          )}

          <div className={creatingNewProfile ? "" : "hidden"}>
            <label htmlFor="child-name" className="field-label">
              {t("wizard.nameLabel")}
            </label>
            <input
              id="child-name"
              ref={nameInputRef}
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder={t("wizard.namePlaceholder")}
              className={`field-input ${errors.name ? "field-error" : ""}`}
              autoComplete="off"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "child-name-err" : undefined}
            />
            {errors.name && (
              <p id="child-name-err" className="mt-1 text-xs font-medium text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div className={creatingNewProfile ? "grid grid-cols-2 gap-3" : "hidden"}>
            <div>
              <label htmlFor="child-age" className="field-label">
                {t("wizard.ageLabel")}
              </label>
              <input
                id="child-age"
                ref={ageInputRef}
                name="age"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value.replace(/[^0-9]/g, "").slice(0, 2));
                  if (errors.age) setErrors((p) => ({ ...p, age: undefined }));
                }}
                inputMode="numeric"
                placeholder={t("wizard.agePlaceholder")}
                className={`field-input ${errors.age ? "field-error" : ""}`}
                aria-invalid={!!errors.age}
              />
              {errors.age && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.age}</p>
              )}
            </div>
            <div>
              <label htmlFor="child-gender" className="field-label">
                {t("wizard.genderLabel")}
              </label>
              <select
                id="child-gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="field-input"
              >
                <option value="male">{t("wizard.genderMale")}</option>
                <option value="female">{t("wizard.genderFemale")}</option>
              </select>
            </div>
          </div>

          <div className={creatingNewProfile ? "" : "hidden"}>
            <span className="field-label">
              {t("wizard.photoLabel")}{" "}
              <span className="font-normal text-ink-faint">({t("wizard.photoHint")})</span>
            </span>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoBusy}
              aria-label={photoUrl ? t("wizard.changePhoto") : t("wizard.photoUpload")}
              className={`relative mx-auto flex h-40 w-40 flex-col items-center justify-center gap-1 overflow-hidden rounded-full border-2 border-dashed border-brand-primary/40 bg-brand-primary/5 text-center transition hover:scale-105 hover:bg-brand-primary/10 ${
                photoUrl || photoBusy ? "" : "breathe"
              }`}
            >
              {photoBusy ? (
                <span className="text-xs font-semibold text-brand-primary">
                  {t("wizard.compressing")}
                </span>
              ) : photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="Foto anak" className="h-full w-full object-cover" />
              ) : (
                <>
                  <span className="text-3xl">📷</span>
                  <span className="text-sm font-semibold text-brand-primary">
                    {t("wizard.photoUpload")}
                  </span>
                  <span className="text-xs text-ink-faint">{t("wizard.photoUploadSub")}</span>
                </>
              )}
            </button>

            <input
              ref={fileInputRef}
              name="photo"
              type="file"
              accept="image/*,.heic,.heif"
              onChange={onPhotoChange}
              className="hidden"
            />

            {photoUrl && !photoBusy && (
              <div className="mt-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-ink-soft transition active:scale-95"
                >
                  🔄 {t("wizard.changePhoto")}
                </button>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 transition active:scale-95"
                >
                  🗑 {t("wizard.removePhoto")}
                </button>
              </div>
            )}

            {errors.photo ? (
              <p className="mt-2 text-center text-xs font-medium text-red-600">{errors.photo}</p>
            ) : (
              <p className="mt-2 text-center text-xs text-ink-faint">{t("wizard.photoNote")}</p>
            )}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={photoBusy}
            className="btn-primary mt-2 w-full"
          >
            {t("wizard.next")}
          </button>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* STEP 2 — Tema Cerita                                              */}
      {/* ----------------------------------------------------------------- */}
      <section className={step === 2 ? "block anim-fade-up" : "hidden"}>
        <div className="anim-pop mb-5 flex items-center gap-3 rounded-card bg-brand-primary/5 p-4 ring-1 ring-brand-primary/10">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface-card ring-2 ring-brand-accent">
            {activePhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activePhotoUrl} alt={activeChildName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl">🧒</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-ink">🎉 {t("wizard.characterReady")}</p>
            <p className="text-sm text-ink-soft">
              {t("wizard.characterReadyHint", { name: activeChildName || "anak" })}{" "}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-semibold text-brand-primary underline"
              >
                {t("wizard.regenerate")}
              </button>
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-ink">📚 {t("wizard.themeTitle")}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t("wizard.themeSubtitle")}</p>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="theme" className="field-label">
                {t("wizard.mainThemeLabel")}
              </label>
              <select
                id="theme"
                name="themeId"
                value={themeId}
                onChange={(e) => onThemeChange(e.target.value)}
                className="field-input"
              >
                {themes.map((th) => (
                  <option key={th.id} value={th.id}>
                    {th.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subtheme" className="field-label">
                {t("wizard.subThemeLabel")}
              </label>
              <select
                id="subtheme"
                name="subThemeId"
                value={subThemeId}
                onChange={(e) => {
                  setSubThemeId(e.target.value);
                  setSelectedIssueId(null);
                }}
                className="field-input"
              >
                {subThemes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="field-label mb-0">Masalah Anak Hari Ini</p>
              {selectedIssueId && (
                <button
                  type="button"
                  onClick={() => setSelectedIssueId(null)}
                  className="text-[11px] font-bold text-brand-primary"
                >
                  Custom
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {childIssuePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyIssuePreset(preset.id)}
                  aria-pressed={selectedIssueId === preset.id}
                  className={`rounded-card px-3 py-2.5 text-left text-sm font-bold ring-1 transition active:scale-95 ${
                    selectedIssueId === preset.id
                      ? "bg-brand-primary text-white ring-brand-primary"
                      : "bg-surface-card text-ink-soft ring-black/[0.06] hover:bg-surface-soft"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="length" className="field-label">
              {t("wizard.lengthLabel")}{" "}
              <span className="font-normal text-ink-faint">({t("wizard.lengthHint")})</span>
            </label>
            <select
              id="length"
              name="lengthId"
              value={lengthId}
              onChange={(e) => setLengthId(e.target.value)}
              className="field-input"
            >
              {storyLengths.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="language-level" className="field-label">
              Level Bahasa
            </label>
            <select
              id="language-level"
              name="languageLevelId"
              value={languageLevelId}
              onChange={(e) => setLanguageLevelId(e.target.value as typeof languageLevelId)}
              className="field-input"
            >
              {storyLanguageLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.label} - {level.hint}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="field-label">Gaya Ilustrasi</p>
            <input type="hidden" name="illustrationStyleId" value={illustrationStyleId} />
            <div className="grid grid-cols-2 gap-2">
              {illustrationStylePresets.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setIllustrationStyleId(style.id)}
                  aria-pressed={illustrationStyleId === style.id}
                  className={`rounded-card px-3 py-2.5 text-left ring-1 transition active:scale-95 ${
                    illustrationStyleId === style.id
                      ? "bg-brand-primary text-white ring-brand-primary"
                      : "bg-surface-card text-ink-soft ring-black/[0.06] hover:bg-surface-soft"
                  }`}
                >
                  <span className="block text-sm font-bold">{style.label}</span>
                  <span
                    className={`block text-xs ${
                      illustrationStyleId === style.id ? "text-white/80" : "text-ink-faint"
                    }`}
                  >
                    {style.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="situation" className="field-label">
              {t("wizard.situationLabel")}
            </label>
            <textarea
              id="situation"
              name="situation"
              rows={3}
              value={situation}
              onChange={(e) => {
                setSituation(e.target.value);
                setSelectedIssueId(null);
              }}
              placeholder={t("wizard.situationPlaceholder")}
              className="field-input resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
              {t("wizard.back")}
            </button>
            <SubmitButton pending={pending} />
          </div>
        </div>
      </section>
    </form>
  );
}

function ProfilePicker({
  profiles,
  selectedId,
  onSelect,
}: {
  profiles: ChildProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="field-label mb-0">Profil Anak</p>
        <span className="text-[11px] font-semibold text-ink-faint">
          {profiles.length} tersimpan
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            type="button"
            onClick={() => onSelect(profile.id)}
            aria-pressed={selectedId === profile.id}
            className={`min-w-0 rounded-card p-3 text-left ring-1 transition active:scale-95 ${
              selectedId === profile.id
                ? "bg-brand-primary/10 ring-brand-primary"
                : "bg-surface-card ring-black/[0.06] hover:bg-surface-soft"
            }`}
          >
            <div className="flex items-center gap-2">
              <ProfileAvatar profile={profile} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-ink">{profile.name}</p>
                <p className="truncate text-[11px] text-ink-faint">
                  {profile.age != null ? `${profile.age} tahun` : "Usia belum diisi"}
                </p>
              </div>
            </div>
          </button>
        ))}
        <button
          type="button"
          onClick={() => onSelect("new")}
          aria-pressed={selectedId === "new"}
          className={`flex min-h-[4.25rem] items-center justify-center rounded-card border border-dashed px-3 text-center text-sm font-extrabold transition active:scale-95 ${
            selectedId === "new"
              ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
              : "border-black/15 bg-surface-card text-ink-soft hover:bg-surface-soft"
          }`}
        >
          + Profil Baru
        </button>
      </div>
    </section>
  );
}

function SelectedProfileCard({ profile }: { profile: ChildProfile }) {
  const gender =
    profile.gender === "female"
      ? t("wizard.genderFemale")
      : profile.gender === "male"
        ? t("wizard.genderMale")
        : "Belum diisi";

  return (
    <div className="rounded-card bg-brand-primary/5 p-4 ring-1 ring-brand-primary/10">
      <div className="flex items-center gap-3">
        <ProfileAvatar profile={profile} size="lg" />
        <div className="min-w-0">
          <p className="text-base font-extrabold text-ink">{profile.name}</p>
          <p className="text-sm text-ink-soft">
            {profile.age != null ? `${profile.age} tahun` : "Usia belum diisi"} · {gender}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <ProfileBadge active={Boolean(profile.photoUrl)} label={profile.photoUrl ? "Foto siap" : "Tanpa foto"} />
            <ProfileBadge
              active={profile.hasCharacterDescription}
              label={profile.hasCharacterDescription ? "Karakter tersimpan" : "Karakter akan dibuat"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold ${
        active ? "bg-emerald-100 text-emerald-700" : "bg-surface-soft text-ink-faint"
      }`}
    >
      {label}
    </span>
  );
}

function ProfileAvatar({ profile, size }: { profile: ChildProfile; size: "sm" | "lg" }) {
  const className =
    size === "lg"
      ? "h-16 w-16 text-2xl"
      : "h-10 w-10 text-base";

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-card font-extrabold text-brand-primary ring-2 ring-brand-accent/70 ${className}`}
    >
      {profile.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.photoUrl} alt={profile.name} className="h-full w-full object-cover" />
      ) : (
        profile.name.slice(0, 1).toUpperCase()
      )}
    </div>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button type="submit" disabled={pending} className="btn-primary flex-1">
      {pending ? "Membuat…" : `✨ ${t("wizard.create")}`}
    </button>
  );
}

/** Full-screen feedback while the server action saves + redirects. */
function SubmitOverlay({ pending }: { pending: boolean }) {
  if (!pending) return null;
  return (
    <div className="anim-fade-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-surface/90 backdrop-blur-sm">
      <div className="float text-5xl">✨</div>
      <p className="text-lg font-extrabold text-ink">{t("wizard.creatingTitle")}</p>
      <p className="max-w-xs text-center text-sm text-ink-soft">{t("wizard.creatingBody")}</p>
      <div className="mt-1 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-primary"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
