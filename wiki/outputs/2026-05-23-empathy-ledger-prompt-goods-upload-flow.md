# Empathy Ledger — Goods upload flow + Mykel storyteller

> **Paste this into your Claude Code session in the `empathy-ledger-v2` repo.**

## Context

Goods on Country has just declared Empathy Ledger as the canonical system of record
for all Goods media (photos, videos, voice clips, storytellers). Goods reads from EL
by tag — see [reader code](https://github.com/Acurioustractor/goods-asset-tracker/blob/main/v2/src/lib/field-notes/resolve-gallery.ts).
Goods's own upload routes have been archived (`_archive/2026-05-23-goods-uploads/`).
EL is now the only place media gets created or tagged.

This means EL needs:

1. **A streamlined Goods upload flow** that matches Goods's canonical tag taxonomy.
2. **A storyteller-create flow** that works without manually wiring an auth profile
   (current EL trigger `"Storyteller must have a valid profile"` blocks REST-only
   creation with the service role key — Goods's `/admin/el-storytellers/new` server
   action keeps hitting this).
3. **Default project + organisation pre-fill** so Goods staff don't have to remember
   IDs every time they upload.
4. **A specific outcome from this prompt**: create Mykel as a storyteller, scoped
   to Goods, with the right cultural consent flow.

## Goods canonical IDs (verified)

| Thing | ID |
|---|---|
| Organisation (Goods on Country) | `db0de7bd-eb10-446b-99e9-0f3b7c199b8a` |
| Project (Goods on Country) | `6bd47c8a-e676-456f-aa25-ddcbb5a31047` |
| Tenant | `5f1314c1-ffe9-4d8f-944b-6cdf02d4b943` |

## Goods canonical tag taxonomy

Every Goods asset (story, photo, video) carries tags across these axes. EL's upload
UI should make this easy — either checkbox sets per axis, or a "Goods preset" that
applies sensible defaults.

### Axis 1 — `format:` (1 value, automatic from mime)
- `format:photo`
- `format:video`

### Axis 2 — `media-type:` (1 value, paired with format)
- `media-type:video` (always paired with `format:video`)

### Axis 3 — `use:` for VIDEOS only (1 of 5)
- `use:atmosphere` — silent loop, mood background, 8–20s
- `use:voice` — someone speaking, audio is the point, 15–90s
- `use:process` — how something works (assembly, plant), 30–120s
- `use:moment` — captured event (unloading, the nod), 5–45s
- `use:establishing` — wide shot, place + scale, 5–30s

### Axis 4 — `placement:` for VIDEOS only (any combo of 3)
- `placement:overlay-fullscreen` — can be hero/atmosphere background
- `placement:under-text` — sits below text in a section
- `placement:standalone-card` — own tile in a video gallery

Defaults per use (apply when filename/UI doesn't specify):
- `atmosphere` + `establishing` → also add `overlay-fullscreen`
- `voice` + `moment` → also add `under-text`
- All videos → always add `standalone-card`

### Axis 5 — Context (required)
- `community:<slug>` — e.g. `community:alice-springs`, `community:utopia-homelands`, `community:ampilatwatja`
- `trip:<slug>` — e.g. `trip:may-2026`
- `event:<slug>` — e.g. `event:alice-build`, `event:delivery-utopia`, `event:elders-yarn`
- `participant:<slug>` — ONLY when one named person is the subject and they've consented. e.g. `participant:mykel`
- `theme:<slug>` — optional, multiple OK. e.g. `theme:family`, `theme:health`, `theme:gratitude`
- `product:<slug>` — optional. e.g. `product:stretch-bed`, `product:washing-machine`

### Axis 6 — Consent + provenance
- `consent:public` OR `consent:elder-pending` (default)
- `goods-staff-capture` OR `community-submitted`

## What Goods needs from EL upload UX

### 1. "Goods preset" entry point
- A single button or URL like `/admin/upload?preset=goods` that pre-applies:
  - `project_id = 6bd47c8a-eb676-456f-aa25-ddcbb5a31047`
  - `organization_id = db0de7bd-eb10-446b-99e9-0f3b7c199b8a`
  - `tenant_id = 5f1314c1-ffe9-4d8f-944b-6cdf02d4b943`
- Saves Goods staff from picking these every time.

### 2. Tag axis pickers
- Use axis: 5-option radio (atmosphere/voice/process/moment/establishing) for videos
- Placement axis: 3 checkboxes for videos
- Community: dropdown of Goods's communities (or free text)
- Trip: free text, default `trip:may-2026`
- Event: free text
- Participant: search-and-link against Goods storytellers; "Create new storyteller" inline if not found
- Themes: tag-list input
- Consent: explicit checkbox "I have public-use consent" — default OFF (assigns `consent:elder-pending`)

### 3. Auto-generated fields
- For videos: poster at 1s via ffmpeg, H.264 1080p re-encode, ffprobe width + height (store in `media_metadata.width/height/orientation`)
- For photos: resize to 2400px max width via sharp, JPEG quality 85
- `story_type` should be:
  - Photos: `gallery-photo`
  - Videos: the `use:*` axis value (so the type field reflects the role)

### 4. Required record fields
For all Goods media, the EL story record must have:

```json
{
  "tenant_id": "5f1314c1-ffe9-4d8f-944b-6cdf02d4b943",
  "project_id": "6bd47c8a-e676-456f-aa25-ddcbb5a31047",
  "storyteller_id": "<pick or create>",
  "author_id": "<the Goods staff member uploading>",
  "story_image_url": "<poster or photo URL>",
  "media_url": "<video URL OR photo URL>",
  "media_urls": ["<video>", "<poster>"],
  "media_metadata": {
    "duration_seconds": 42,
    "width": 1920,
    "height": 1080,
    "orientation": "landscape",
    "encoded_at": "2026-05-23T..."
  },
  "tags": ["..."],
  "is_public": false,
  "requires_elder_review": true,
  "elder_reviewed": false,
  "has_explicit_consent": false,
  "cultural_permission_level": "community",
  "story_type": "gallery-photo | voice | atmosphere | ...",
  "language": "en"
}
```

## Critical blocker: storyteller creation trigger

Goods's `/admin/el-storytellers/new` server action POSTs to `/rest/v1/storytellers`
with the service role key. EL responds:

```json
{
  "code": "P0001",
  "message": "Storyteller must have a valid profile"
}
```

There's a trigger or check constraint that requires `storyteller_id == profile_id`
(i.e. an existing row in the `profiles` table). The service role key can't create a
profile because profiles are auth-bound.

**What to fix in EL:**

Option A — relax the trigger when a `goods_staff_creation: true` flag is passed
(allow `profile_id = null` for storytellers that don't yet have an EL auth account).

Option B — auto-create a placeholder profile inside the same transaction when a
storyteller is created without one.

Option C — provide a server-side helper API (`POST /api/admin/storytellers/goods-create`)
that does the profile-then-storyteller dance atomically.

Pick whichever matches EL's design philosophy. Option C is the cleanest for Goods
since we can replace our broken server action with a single fetch.

## Specific deliverable from this prompt

**Create Mykel as a Goods storyteller**, with these properties:

```json
{
  "organization_id": "db0de7bd-eb10-446b-99e9-0f3b7c199b8a",
  "display_name": "Mykel",
  "bio": "Young builder, Alice Springs. Mykel built his own Stretch Bed and six others during the Oonchiumpa-supported May 2026 workshop, then asked whether he could keep building if the making moved closer to home. Held pending guardian + Oonchiumpa consent confirmation before public attribution.",
  "location": "Alice Springs, Northern Territory, Australia",
  "cultural_background": null,
  "is_elder": false,
  "is_featured": false,
  "is_active": false,
  "content_status": "draft",
  "is_ancestor": false
}
```

Important:
- Mykel is a young person. Consent must flow through **Oonchiumpa Consultancy**
  (the cultural facilitation partner on the trip). Capture this in whatever EL field
  records consent source — for Goods stories we use the tag `consent:elder-pending`
  pending Oonchiumpa sign-off, and `consent_details.source: "oonchiumpa"` in any
  JSON consent column.
- After creating Mykel, the storyteller_id should be reported back. Goods will use
  it as `storyteller_id` when uploading `Mykel.mp4` (a voice clip from the May trip)
  and any future Mykel content.
- Goods already references the slug `mykel` on voice cards in
  `v2/src/lib/data/trip-stories.ts` — once Mykel exists with display_name "Mykel",
  Goods's `/storytellers/mykel` page will auto-resolve via the existing
  `lib/storytellers.ts` slugify pattern.

## After Mykel exists

Goods will upload `Mykel.mp4` to EL with these tags:

```
format:video, media-type:video, use:voice,
trip:may-2026, community:alice-springs,
event:alice-build, participant:mykel,
placement:under-text, placement:standalone-card,
consent:elder-pending, goods-staff-capture
```

And storyteller_id pointing to Mykel's new row.

The "Hear it from them" cinema block in Goods's Utopia field-note already has:

```ts
{
  kind: 'el-video-gallery',
  heading: 'Hear it from them',
  tagQuery: { all: ['use:voice', 'participant:mykel'] },
  limit: 1,
}
```

So the moment Mykel's video is in EL with those tags + `is_public=true`, it auto-
appears full-bleed in Goods's published field-note. No further Goods code change.

## Reciprocal asks

If EL needs reciprocal hooks from Goods (e.g. webhook on `is_public` flip, link
back to Goods field-note URL when a Goods-tagged story lands), let me know and I'll
wire them on the Goods side.
