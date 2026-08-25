# White-Label Rebranding Guide

This app is designed so a buyer can rebrand and resell it without touching core
code. The easiest path is the `/admin` dashboard; config files remain available
as developer defaults.

## 0. Admin dashboard — `/admin`

Set these env vars first:

```env
STORY_WORKER_SECRET="replace-with-a-long-random-secret"
# Optional separate admin password. If omitted, STORY_WORKER_SECRET is used.
ADMIN_DASHBOARD_SECRET="replace-with-a-different-admin-secret"
```

Then open `/admin` after deployment. The dashboard stores runtime settings in
`white_label_settings`:

- Brand name, tagline, logo, and colors.
- Story theme catalog, quick problem templates, and default story limits.
- AI provider/model choices for story, image, and TTS.
- TTS voice, language code, speaking rate, and image style defaults.
- Package/pricing copy for white-label sales pages.

Run `supabase/migrations/0001_init.sql` first so the table exists.

## 1. Brand identity fallback — `config/brand.ts`

| Field | What it controls |
|---|---|
| `name` | App name (header, landing hero, tab title, PWA name) |
| `tagline` / `subtagline` | Landing hero subtitle |
| `logoEmoji` | Logo mark **and** the browser-tab favicon |
| `logoSrc` | Set to an image path in `/public` (e.g. `"/logo.png"`) to use a real logo instead of the emoji |
| `colors` | The full palette (RGB channels as `"R G B"`). Flows into CSS variables → Tailwind → every screen, plus the PWA theme color |
| `defaultLocale` | UI + content language (default `id`) |
| `links.website` / `links.support` | Optional footer links on the landing page |

Changing `colors.primary`, `colors.accent`, and `colors.surface` alone
re-skins the entire app.

## 2. Story themes fallback — `config/themes.ts`

Add, remove, or rename **Tema Utama**, **Sub Tema**, quick problem templates,
language level labels, illustration style presets, and story-length options.
`id` values are stored in the database, so keep them stable once live.

## 3. AI providers — `config/providers.ts` + `.env.local`

Defaults use Google AI Studio: Gemini Flash for story/vision, Gemini image for
illustrations, and Gemini TTS for narration. Override per part via `/admin` or
env vars — see `.env.example`:

- `STORY_PROVIDER` / `STORY_MODEL`
- `IMAGE_PROVIDER` / `IMAGE_MODEL` / `IMAGE_ASPECT_RATIO`
- `TTS_PROVIDER` / `TTS_MODEL` / `TTS_VOICE` / `TTS_LANGUAGE_CODE` / `TTS_SPEAKING_RATE`

Change the narration voice, for example, by setting `TTS_VOICE=Sulafat`.

## 4. UI copy — `messages/id.json`

Every visible string lives here. To add another language, drop
`messages/<locale>.json`, register it in `src/lib/i18n.ts` (`catalogs`), and set
`brand.defaultLocale`.

## 5. Keys and worker secrets — `.env.local`

Each buyer supplies **their own** keys (Supabase and Google AI Studio). See
`.env.example` and `DEPLOY.md`.

Required for production queue/admin flows:

- `SUPABASE_SERVICE_ROLE_KEY`
- `STORY_WORKER_SECRET`
- `ADMIN_DASHBOARD_SECRET` (optional but recommended)

---

### Rebrand checklist

- [ ] Run `supabase/migrations/0001_init.sql`
- [ ] Set `STORY_WORKER_SECRET` and optional `ADMIN_DASHBOARD_SECRET`
- [ ] Configure `/admin` (name, tagline, logo, colors, provider, limits, pricing)
- [ ] (Optional) drop a logo image in `/public` and set `brand.logoSrc`
- [ ] Review `config/themes.ts` for your audience
- [ ] Adjust `messages/id.json` copy / voice/tone
- [ ] Set all keys in `.env.local`
- [ ] Test story queue, private share, PDF/ZIP export, progress, and PWA install
- [ ] `npm run build` to confirm it compiles
- [ ] Deploy per `DEPLOY.md`
