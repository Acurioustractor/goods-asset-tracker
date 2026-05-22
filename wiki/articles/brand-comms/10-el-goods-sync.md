# Empathy Ledger ↔ Goods on Country sync contract

How the two systems relate, what Goods reads from EL, and the canonical tag taxonomy. This is the single source of truth for "if I want X to appear on Goods, what do I write in EL?"

---

## The split

Two storytelling shapes live in different places. They're not in competition — they hold different kinds of content.

| Shape | Format | Source of truth | When to use |
|---|---|---|---|
| **Scrollytelling field notes** | 12+ block spine (masthead, immersive scenes, voices grid, etc.) | `v2/src/lib/data/trip-stories.ts` (TypeScript) | Trip recounts, immersive narrative, designed to scroll |
| **Prose story** | Free-text + media + metadata | EL `stories` table | One person's piece, an essay, a long quote with photo, anything an editor would call an "article" |

A single storyteller appears in BOTH. The `/storytellers/[slug]` page surfaces field-notes appearances and EL prose stories side-by-side.

---

## What Goods reads from EL today (verified)

| Page | Source | What it shows |
|---|---|---|
| `/stories` | `empathyLedger.getStorytellers()` + project insights | Storyteller grid for Goods project |
| `/stories/[id]` | `empathyLedger.getStoryById(id)` | Single prose story |
| `/storytellers/[slug]` | `getStorytellerBySlug()` + `getStoryteller(id)` + `getStories({ limit })` filtered to that storyteller + scan of `tripStories` for appearances | Profile + their prose stories + scrollytelling appearances |
| `/admin/photos` | `stories` table where `media_url` or `story_image_url` is set | Curator picker |
| `/admin/deck?funder=…` | `stories` table where `is_public=true` + tags match funder photoTags | Funder deck photos auto-slotted |
| `/admin/funders/[slug]/video-brief` | `stories` table where `tags @> {media-type:video}` | Per-funder video slot coverage |

---

## The canonical EL tag taxonomy

Every EL story (photo, video, prose) **should** carry these tags where they apply. Goods picks them up automatically.

### 1. Identity tags

| Tag pattern | Examples | Meaning |
|---|---|---|
| `community:<slug>` | `community:utopia-homelands`, `community:alice-springs`, `community:tennant-creek`, `community:palm-island` | Where the content is from |
| `participant:<slug>` | `participant:ray-nelson`, `participant:dianne-stokes` | Named person in the content (use sparingly; only if cleared) |
| `<bed-id>` | `gb0-156-96` | Auto-added by photo/video uploader if the QR was in frame |

### 2. Trip + project tags

| Tag pattern | Examples | Meaning |
|---|---|---|
| `trip:<slug>` | `trip:trip-may-2026`, `trip:trip-aug-2026` | Which on-country trip the content is from |
| `batch:<slug>` | `batch:batch-156` | Which production batch the beds are from |
| `day-<n>` | `day-1`, `day-2` | Day of multi-day trip (auto-derived from EXIF) |

### 3. Content + use tags

| Tag pattern | Examples | Meaning |
|---|---|---|
| `media-type:<kind>` | `media-type:video` | Distinguishes video stories from photo stories in queries |
| `product:<slug>` | `product:stretch-bed`, `product:washing-machine` | Which product the content shows |
| `use:<slot>` | `use:hero-overlay`, `use:testimonial`, `use:setup`, `use:behind`, `use:per-bed` | Intended deck slot. Drives video brief coverage |
| `theme:<key>` | `theme:family`, `theme:health`, `theme:gratitude`, `theme:plastic-diversion` | Thematic content tag |

### 4. Source + consent tags

| Tag pattern | Examples | Meaning |
|---|---|---|
| `goods-staff-capture` / `recipient-submitted` / `canon-r6` | as named | How the content was captured |
| `consent:public` / `consent:elder-pending` / `consent:internal` / `consent:family-only` | as named | Sharing scope. `is_public` field is the gate; this tag is the documentation. |
| `pending-elder-review` | as named | Awaiting cultural review |

### 5. Syndication signal (NEW — for prose stories)

| Tag | Meaning |
|---|---|
| `syndicate:goods-longform` | Mark a prose story as a featured Goods long-form. Will appear prominently on `/stories` index. |
| `syndicate:goods-feature` | Promote to a homepage / hero slot. |
| (no syndication tag) | Default — appears in `/stories` index if `is_public=true`. Subtle. |

### 6. Bed-page anchoring

| Tag | Meaning |
|---|---|
| `<bed-id>` (e.g. `gb0-156-96`) | When set, the content appears on `/bed/[id]` page automatically (via existing `compassion_content` linkage; mirrored for EL stories) |

---

## How to write a new prose story directly in EL

For when a story is best told as a piece of writing + a photo, not a scrollytelling spine.

### Required fields (per consent rules)

| Field | Value | Why |
|---|---|---|
| `project_id` | `6bd47c8a-e676-456f-aa25-ddcbb5a31047` (Goods) | Anchors to Goods project |
| `tenant_id` | Goods tenant UUID | Multi-tenant scoping |
| `storyteller_id` | The recipient/Elder/named person's EL ID | Who said it / whose story it is |
| `author_id` | Goods staff ID who recorded it | Audit trail |
| `title` | Sentence-case, no em dashes | Brand voice |
| `content` | The story (markdown OK) | The piece |
| `has_explicit_consent` | `true` only after CONSENT_PROCESS.md walkthrough | Hard gate |
| `consent_details` | `{ source, captured_at, scope, etc. }` | Audit trail |
| `is_public` | `false` until elder-reviewed + leadership-approved | Gate on the public route |
| `requires_elder_review` | `true` for any story with named recipients | Cultural safety |
| `cultural_permission_level` | `public` / `community` / `private` | Cultural scope |
| `tags` | All canonical tags that apply (see above) | Search + automatic routing |

### Optional but recommended

| Field | Value | Why |
|---|---|---|
| `excerpt` | First 200 chars hand-written | What shows in story grids |
| `story_image_url` | URL to a hero image (in EL story-images bucket) | What shows as the card image |
| `media_urls` | Array of related photo/video URLs | Inline media |
| `media_metadata` | `{ duration_seconds, photographer, etc. }` | Structured media data |
| `location_text` | "Utopia Homelands" | Geographic anchor |

### Two ways to write it

**Option A: directly in EL admin** (web UI) — fastest, no code touched.

**Option B: via the Goods upload scripts** (`v2/scripts/upload-trip-photos-to-el.mjs`, etc.) — when the story is a photo or video with an attached quote. Pre-tags everything per the convention.

A `/admin/el-stories/new` Goods-side composer is on the v3 roadmap. For now, prose stories are written in EL directly.

---

## How a story ends up on a Goods page

| If the story has… | …it appears at |
|---|---|
| `project_id=goods` AND `is_public=true` | `/stories` index + `/stories/[id]` |
| `storyteller_id` set + that storyteller has a `displayName` | `/storytellers/[slug]` (slug = slugified displayName) |
| `tags @> {syndicate:goods-longform}` | Promoted on `/stories` index (planned filter) |
| `tags @> {<bed-id>}` | `/bed/[id]` page (existing pattern for `compassion_content`; mirrored for EL stories — see future spec) |
| `tags @> {community:<slug>}` | `/communities/<slug>` page (when built) |
| `tags @> {use:hero-overlay, consent:public}` and matches funder's `photoTags` | Funder deck `[VIDEO_OVERLAY: ...]` |

---

## Updating a storyteller

EL is canonical. To update Ray Nelson's bio, do it in EL — Goods reads it on next request (cache TTL ~5min).

The Goods-side `slugify(displayName)` lookup means **changing a storyteller's displayName changes their URL**. Plan accordingly: rename once, set up a 301 if it's already been published.

---

## When EL is the wrong tool

| Don't use EL for | Use instead |
|---|---|
| Internal team notes | Notion / wiki/outputs |
| Trip-overhead receipts | Xero |
| Bed status / location data | Goods Supabase `assets` table |
| Scrollytelling spine blocks | `trip-stories.ts` |
| Anything before consent is captured | Hold it offline; CONSENT_PROCESS.md first |

---

## Related docs

- [`01-voice-and-tone.md`](./01-voice-and-tone.md) — voice rules every story obeys
- [`02-storyteller-voices.md`](./02-storyteller-voices.md) — verified storyteller library
- [`09-field-notes-authoring.md`](./09-field-notes-authoring.md) — scrollytelling authoring guide
- [`CONSENT_PROCESS.md`](./CONSENT_PROCESS.md) — capturing consent
- [`CONSENT_BACKLOG.md`](./CONSENT_BACKLOG.md) — what's waiting on consent
