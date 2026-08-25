"use client";

import { useActionState } from "react";
import { saveWhiteLabelSettings, type AdminSettingsState } from "@/app/admin/actions";
import { rgbToHex } from "../../../config/brand";
import type { WhiteLabelSettings } from "@/lib/white-label/settings";

const initialState: AdminSettingsState = { error: null, saved: false };

export default function AdminSettingsForm({ settings }: { settings: WhiteLabelSettings }) {
  const [state, formAction, pending] = useActionState(saveWhiteLabelSettings, initialState);
  const { brand, providers, limits, pricing, themeCatalog } = settings;

  return (
    <form action={formAction} className="mx-auto w-full max-w-5xl space-y-5 px-5 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-brand-primary">Admin White-Label</p>
          <h1 className="text-2xl font-extrabold text-ink">Dashboard reseller</h1>
        </div>
        <button disabled={pending} className="btn-primary min-w-36 disabled:opacity-60">
          {pending ? "Menyimpan..." : "Simpan Setting"}
        </button>
      </div>

      {state.error && (
        <div className="rounded-card bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-100">
          {state.error}
        </div>
      )}
      {state.saved && (
        <div className="rounded-card bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
          Setting tersimpan. Brand dan provider baru dipakai oleh request berikutnya.
        </div>
      )}

      <Section title="Akses Admin">
        <Field label="Admin Secret">
          <input name="adminSecret" type="password" className="field-input" placeholder="ADMIN_DASHBOARD_SECRET" />
        </Field>
      </Section>

      <Section title="Brand">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Nama Brand">
            <input name="brandName" defaultValue={brand.name} className="field-input" />
          </Field>
          <Field label="Logo Emoji">
            <input name="logoEmoji" defaultValue={brand.logoEmoji} className="field-input" />
          </Field>
          <Field label="Tagline">
            <input name="tagline" defaultValue={brand.tagline} className="field-input" />
          </Field>
          <Field label="Subtagline">
            <input name="subtagline" defaultValue={brand.subtagline} className="field-input" />
          </Field>
          <Field label="Logo Src">
            <input name="logoSrc" defaultValue={brand.logoSrc ?? ""} className="field-input" placeholder="/logo.png" />
          </Field>
          <Field label="Locale">
            <input name="defaultLocale" defaultValue={brand.defaultLocale} className="field-input" />
          </Field>
          <Field label="Website">
            <input name="website" defaultValue={brand.links?.website ?? ""} className="field-input" />
          </Field>
          <Field label="Support">
            <input name="support" defaultValue={brand.links?.support ?? ""} className="field-input" />
          </Field>
        </div>
      </Section>

      <Section title="Warna">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["primary", "Primary", brand.colors.primary],
            ["secondary", "Secondary", brand.colors.secondary],
            ["accent", "Accent", brand.colors.accent],
            ["surface", "Surface", brand.colors.surface],
            ["surfaceSoft", "Surface Soft", brand.colors.surfaceSoft],
            ["surfaceCard", "Surface Card", brand.colors.surfaceCard],
            ["ink", "Ink", brand.colors.ink],
            ["inkSoft", "Ink Soft", brand.colors.inkSoft],
            ["inkFaint", "Ink Faint", brand.colors.inkFaint],
          ].map(([name, label, value]) => (
            <Field key={name} label={label}>
              <input name={name} type="color" defaultValue={rgbToHex(value)} className="h-11 w-full rounded-card border border-black/10 bg-surface-card px-2" />
            </Field>
          ))}
        </div>
      </Section>

      <Section title="Provider AI">
        <div className="grid gap-3 md:grid-cols-3">
          <Select name="storyProvider" label="Story Provider" value={providers.story.provider} options={["gemini", "kie", "claude"]} />
          <Field label="Story Model"><input name="storyModel" defaultValue={providers.story.model} className="field-input" /></Field>
          <Select name="imageProvider" label="Image Provider" value={providers.image.provider} options={["gemini", "kie"]} />
          <Field label="Image Model"><input name="imageModel" defaultValue={providers.image.model} className="field-input" /></Field>
          <Field label="Aspect Ratio"><input name="imageAspectRatio" defaultValue={providers.image.aspectRatio} className="field-input" /></Field>
          <Field label="Resolution"><input name="imageResolution" defaultValue={providers.image.resolution} className="field-input" /></Field>
          <Select name="ttsProvider" label="TTS Provider" value={providers.tts.provider} options={["google", "elevenlabs", "webspeech"]} />
          <Field label="TTS Model"><input name="ttsModel" defaultValue={providers.tts.model} className="field-input" /></Field>
          <Field label="Voice"><input name="ttsVoice" defaultValue={providers.tts.voice} className="field-input" /></Field>
          <Field label="Language"><input name="ttsLanguageCode" defaultValue={providers.tts.languageCode} className="field-input" /></Field>
          <Field label="Speaking Rate"><input name="ttsSpeakingRate" type="number" step="0.05" defaultValue={providers.tts.speakingRate} className="field-input" /></Field>
          <Field label="Stability"><input name="ttsStability" type="number" step="0.05" defaultValue={providers.tts.stability} className="field-input" /></Field>
          <Field label="Similarity"><input name="ttsSimilarityBoost" type="number" step="0.05" defaultValue={providers.tts.similarityBoost} className="field-input" /></Field>
          <Field label="Style"><input name="ttsStyle" type="number" step="0.05" defaultValue={providers.tts.style} className="field-input" /></Field>
        </div>
      </Section>

      <Section title="Limit Cerita">
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Cerita / User / Bulan"><input name="storiesPerUserPerMonth" type="number" defaultValue={limits.storiesPerUserPerMonth} className="field-input" /></Field>
          <Field label="Profil Anak"><input name="maxChildProfiles" type="number" defaultValue={limits.maxChildProfiles} className="field-input" /></Field>
          <Field label="Scene Maksimum"><input name="maxScenesPerStory" type="number" defaultValue={limits.maxScenesPerStory} className="field-input" /></Field>
        </div>
      </Section>

      <Section title="Harga Paket">
        <textarea name="pricingJson" rows={8} defaultValue={JSON.stringify(pricing, null, 2)} className="field-input font-mono text-xs" />
      </Section>

      <Section title="Katalog Tema">
        <textarea name="themeCatalogJson" rows={12} defaultValue={JSON.stringify(themeCatalog, null, 2)} className="field-input font-mono text-xs" />
      </Section>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card bg-surface-card p-4 shadow-sm ring-1 ring-black/[0.05]">
      <h2 className="mb-3 text-sm font-extrabold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

function Select({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <Field label={label}>
      <select name={name} defaultValue={value} className="field-input">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}
