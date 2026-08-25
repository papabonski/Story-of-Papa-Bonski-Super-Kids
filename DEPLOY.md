# Deployment Guide — Vercel + Supabase

This is the setup a white-label buyer follows to go live with their own
branding, admin settings, story queue, PWA install, and their own API keys.
No core code changes required.

## 1. Rebrand (optional but recommended)

Recommended: deploy first, then open `/admin` and configure brand, colors,
AI provider, TTS voice, user limits, and package pricing from the white-label
dashboard.

File fallback:
- `config/brand.ts` — app name, tagline, logo, palette
- `config/themes.ts` — story themes/subthemes and quick problem templates
- `config/providers.ts` — default AI models/voices

## 2. Create a Supabase project

1. Go to https://supabase.com and create a new project.
2. In **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret)
3. **Enable anonymous auth:** Authentication → Providers → **Anonymous** →
   Enable. (Each device gets a stable identity that owns its stories — no
   login screen.)
4. **Run the schema:** open the **SQL Editor** and run
   `supabase/migrations/0001_init.sql`. This single, idempotent file creates all
   current tables (`children`, `stories`, `scenes`, `story_jobs`,
   `white_label_settings`), review/share/progress/language/style columns, Row
   Level Security policies, and the two storage buckets (`child-photos` =
   private, `story-assets` = public). Safe to re-run on an existing database.

## 3. Get AI provider keys

- **Google AI Studio** (Gemini story/vision, Gemini image, Gemini TTS):
  https://aistudio.google.com/app/apikey → `GEMINI_API_KEY`

For smoother generation, you may set `GEMINI_API_KEYS` to a comma-separated
pool of legitimate Google AI Studio keys/projects that you own or are allowed
to use. The app starts each request on the next key and automatically tries the
next key if Google returns quota/rate-limit errors. Keep `GEMINI_API_KEY` for a
single-key setup.

If `GEMINI_API_KEYS` contains 3+ keys and no role-specific key pool is set, the
app splits them by role: key 1/4/7 for image, key 2/5/8 for story, and key
3/6/9 for audio. For explicit control, set `GEMINI_IMAGE_API_KEYS`,
`GEMINI_STORY_API_KEYS`, and `GEMINI_AUDIO_API_KEYS`.

If Vercel's env UI is easier one key per row, numbered variables work too:
`GEMINI_IMAGE_API_KEY_1`, `GEMINI_IMAGE_API_KEY_2`,
`GEMINI_STORY_API_KEY_1`, and `GEMINI_AUDIO_API_KEY_1`. The helper also accepts
JSON arrays in the `*_API_KEYS` variables.

The Google helper also paces requests and cools down keys after quota/rate-limit
responses. Tune these only if needed: `GOOGLE_AI_IMAGE_MIN_INTERVAL_MS`,
`GOOGLE_AI_STORY_MIN_INTERVAL_MS`, `GOOGLE_AI_AUDIO_MIN_INTERVAL_MS`,
`GOOGLE_AI_RATE_LIMIT_COOLDOWN_MS`, `GOOGLE_AI_MAX_KEY_WAIT_MS`, and
`GOOGLE_AI_BACKOFF_JITTER`.

For audio on Vercel, the app fails fast on temporary Gemini timeout/cooldown and
returns `202` to the browser, then the browser waits and retries the same audio
task. Useful knobs: `GOOGLE_AI_AUDIO_HTTP_TIMEOUT_MS`,
`GOOGLE_AI_AUDIO_MAX_KEY_WAIT_MS`, `NEXT_PUBLIC_GENERATE_AUDIO_RETRY_LIMIT`, and
`NEXT_PUBLIC_GENERATE_AUDIO_RETRY_DELAY_MS`.

```env
STORY_WORKER_SECRET="replace-with-a-long-random-secret"
# Optional separate /admin password. If omitted, STORY_WORKER_SECRET is used.
# ADMIN_DASHBOARD_SECRET="replace-with-a-different-admin-secret"

GOOGLE_AI_AUDIO_HTTP_TIMEOUT_MS=28000
GOOGLE_AI_AUDIO_MAX_KEY_WAIT_MS=8000
GOOGLE_AI_AUDIO_FAIL_FAST_ON_COOLDOWN=true
GOOGLE_AI_AUDIO_FAIL_FAST_ON_TRANSIENT=true
NEXT_PUBLIC_GENERATE_AUDIO_RETRY_LIMIT=10
NEXT_PUBLIC_GENERATE_AUDIO_RETRY_DELAY_MS=8000
NEXT_PUBLIC_STORY_QUEUE_POLL_MS=2500
NEXT_PUBLIC_STORY_QUEUE_MAX_POLLS=240
STORY_WORKER_AUTOKICK=true

# Illustrations: cheapest 1K (~1080px) resolution, plus free KIE Nano Banana overflow
IMAGE_RESOLUTION=1K
KIE_API_KEY=
# Optional: make KIE Nano Banana the primary illustrator
IMAGE_PROVIDER="kie"
IMAGE_MODEL="google/nano-banana"

# Give images their own dedicated key pool (best), or stop splitting so all keys
# can serve images, or enable billing on the Gemini keys (free-tier image quota is low)
GEMINI_IMAGE_API_KEYS="key1,key2,key3"
GEMINI_API_KEYS_SPLIT_BY_PURPOSE="false"
```

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **New Project** → import the repo.
3. Add all environment variables from `.env.example` under
   **Settings → Environment Variables**.
4. Deploy.

> **Note:** Vercel's free *Hobby* plan is for non-commercial use. For a
> commercial white-label deployment, use a **Pro** plan.

## 5. Background worker

Story generation is queued server-side in `story_jobs`, so image/audio creation
can continue even if the user closes the browser.

For most small deployments, keep `STORY_WORKER_AUTOKICK=true`; the app triggers
the worker right after a job is created. Autokick processes up to
`STORY_WORKER_AUTOKICK_LIMIT` jobs per request (default `5`).

For production traffic, add `CRON_SECRET` in Vercel and schedule a cron that
calls:

```http
GET https://your-domain.com/api/jobs/cron
Authorization: Bearer <CRON_SECRET>
```

That endpoint securely forwards to:

```http
POST https://your-domain.com/api/jobs/process
x-story-worker-secret: <STORY_WORKER_SECRET>
```

Run it every 1-5 minutes when your hosting plan supports frequent cron. If not,
keep autokick enabled and run `npm run worker:stories` on a small always-on
server for busy production usage.

## 6. Cost notes

Roughly per storybook (at each provider's own rates):

| Step | Calls | Provider |
|---|---|---|
| Story text + quality check | 1–2 | Google AI Studio Gemini |
| Illustrations | per approved scene | Google AI Studio Gemini image / KIE fallback |
| Narration | opener + each approved scene | Google AI Studio Gemini TTS |

Google AI Studio has free-tier quotas that can change by model and region.
Monitor usage in AI Studio / Google Cloud and adjust models or voices via
`config/providers.ts` or Vercel environment variables.

The review screen intentionally generates text first. Images/audio are only
created after the parent approves the text, which reduces wasted AI cost.

## 7. Go-live checklist

- [ ] Rebranded in `/admin` or `config/brand.ts` (see `WHITELABEL.md`)
- [ ] Supabase project created; **Anonymous auth enabled**
- [ ] Single schema run (`0001_init.sql`) — latest tables + RLS + buckets exist
- [ ] All env vars set in Vercel (Supabase + Gemini keys + `STORY_WORKER_SECRET`)
- [ ] `/admin` can save brand/provider/limit/package settings
- [ ] Queue tested: create story, approve text, image/audio job completes
- [ ] Premium flows tested: private share link, PDF export, ZIP download
- [ ] Reading progress/favorite badges update from story collection
- [ ] PWA install tested on phone/tablet from the production domain
- [ ] English digital story catalog/video/PDF/vocabulary/quiz tested
- [ ] `npm run build` passes locally
- [ ] Vercel plan appropriate for commercial use (Pro, not Hobby)
- [ ] Reviewed generated doa/content quality for your audience

## Privacy note

Children's photos are uploaded to a **private** Supabase bucket and used only to
keep illustrations consistent. Deleting a story does not remove the child photo;
add a cleanup step or a "delete my data" flow if your jurisdiction requires it
(e.g. COPPA/GDPR). Obtain parental consent before collecting a child's photo.
