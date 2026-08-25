# Mykarakids — White-Label Personalized Kids' Storybook Generator

Generate a **personalized flipbook storybook** where the child is the hero:
AI illustrations (consistent character from the child's photo), narration text
with **karaoke word-highlighting**, audio, and an ending with a moral, a doa,
and a parent guide. Built to be **rebranded and resold** (white-label) and
deployed to **Vercel + Supabase**. The latest version adds reusable child
profiles, text review before image/audio generation, private share links,
PDF/ZIP export, reading progress, PWA install, English digital stories, a
server-side job queue, and an admin white-label dashboard.

## Install cepat (tanpa coding, untuk dijual)

Pembeli non-teknis bisa install sendiri dalam ~10 menit — tidak perlu
Node.js, SQL Editor, atau push GitHub manual. Deploy otomatis lewat Vercel,
lalu selesaikan sisanya di halaman `/setup` bawaan aplikasi (setup database
1 klik, cek anonymous auth, tes API key).

👉 Lihat **[`PANDUAN-CEPAT.md`](./PANDUAN-CEPAT.md)** untuk langkah lengkapnya,
termasuk cara menyiapkan tombol "Deploy with Vercel" kalau kamu jual ulang
produk ini.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=GANTI_DENGAN_URL_GITHUB_REPO_KAMU&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,GEMINI_API_KEY,STORY_WORKER_SECRET&envDescription=Cara%20dapatkan%20semua%20key%20ini%20ada%20di%20PANDUAN-CEPAT.md&project-name=mykarakids&repository-name=mykarakids)

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS (theme via CSS variables) |
| DB / Auth / Storage | Supabase |
| Story text | Google AI Studio Gemini Flash |
| Illustrations | Google AI Studio Gemini image |
| Narration + karaoke timing | Google AI Studio Gemini TTS |
| Hosting | Vercel |

## White-label: what a buyer edits

| Area | Purpose |
|---|---|
| `/admin` | Runtime brand, colors, AI provider, TTS voice, limits, package pricing |
| `config/brand.ts` | App name, tagline, logo, **color palette** |
| `config/themes.ts` | Story themes, sub-themes, and quick problem templates |
| `config/providers.ts` | Which AI providers power each step |
| `messages/id.json` | All UI copy (i18n-ready) |
| `.env.local` | API keys and secrets (Supabase, Google AI Studio, story worker) |

No core code changes are needed to rebrand. See [`WHITELABEL.md`](./WHITELABEL.md)
for the full rebranding guide and checklist.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

Open http://localhost:3000.

### Verify your AI keys (no Supabase needed)

After filling `.env.local`, run the live smoke test — it calls Gemini text,
Gemini image, and Gemini TTS with your Google AI Studio key and saves samples to
`scripts/out/`:

```bash
npm run test:live
```

Use `GEMINI_API_KEY` for one key, or `GEMINI_API_KEYS` for a legitimate
comma-separated key pool. Green `[ok]` on all three means the AI pipeline works
end-to-end.

With 3+ keys in `GEMINI_API_KEYS`, the app splits them by role by default:
key 1 for image, key 2 for story, key 3 for audio, then repeats that pattern.
You can also set explicit `GEMINI_IMAGE_API_KEYS`, `GEMINI_STORY_API_KEYS`, and
`GEMINI_AUDIO_API_KEYS`, or numbered env vars like `GEMINI_IMAGE_API_KEY_1` and
`GEMINI_IMAGE_API_KEY_2`.

## Deploy

See [`DEPLOY.md`](./DEPLOY.md) for the Vercel + Supabase setup.

## Current feature set

- Reusable child profiles with name, age, gender, photo, and character notes.
- Story wizard with quick "today's child problem" templates, language levels,
  and illustration style presets.
- Text-first review flow: parent can edit/regenerate scenes before image/audio
  costs are spent.
- AI quality check for scene count, child-safe language, doa relevance, name
  consistency, and gentle Islamic values.
- Server-side generation queue via `story_jobs`, plus worker endpoint
  `/api/jobs/process`.
- Flipbook player with narration audio, word highlighting, moral, doa, and
  parent guide.
- Private share links, PDF storybook export, full ZIP download, favorites, and
  reading progress badges.
- PWA install support for phones/tablets.
- English digital story catalog with video, PDF, Indonesian summary,
  IPA+TTS vocabulary, and quizzes.

Supabase setup is consolidated in one idempotent migration:
`supabase/migrations/0001_init.sql`.
