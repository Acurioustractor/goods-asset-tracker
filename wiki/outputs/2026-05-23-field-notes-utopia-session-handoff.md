# Field-notes / Utopia trip story — session handoff

> **Date:** 2026-05-23
> **Branch:** main (all changes pushed)
> **Entry point next session:** `http://localhost:3000/field-notes/utopia-may-2026`

## What shipped this session

### Architecture
- **EL is now the canonical media system.** Goods reads from EL by tag; never writes.
  Goods upload routes archived to `v2/_archive/2026-05-23-goods-uploads/` with RESTORE.md.
  Sidebar entries removed.
- `/field-notes/[slug]` is the canonical full-bleed scrollytelling URL (added to
  `STANDALONE_PATH_PREFIXES` in `conditional-chrome.tsx` so no public chrome wraps it).
  `/admin/field-notes/[slug]` redirects to it. Preview gate: signed-in user OR
  `NODE_ENV !== 'production'`; `?public=1` forces public-viewer mode.

### Editorial features
- **Cinematic single-video blocks** — when a `videos` or `el-video-gallery` block has
  one item, full-bleed (100vw × 82vh) with object-fit: cover.
- **Portrait video support** — ffprobe captures w/h on upload, renderer adds
  `ts-vid--portrait` modifier when orientation is portrait (object-fit: contain,
  56vh-wide / 90vh-tall).
- **`pullquote` block kind** — giant italic serif, centred, dark backdrop, no chrome.
  Three landed in the Utopia story: Mykel ("rocking up every day"), pre-Ampilatwatja
  ("you don't turn up loud to country"), pre-close ("a bed is a small thing").
- **`el-gallery` block kind** — photo gallery sourced live from EL by tag. With
  click-to-open lightbox carousel (← → keys, ESC to close, scroll-locked while open).
- **`el-video-gallery` block kind** — same shape for videos. Filters by `media-type:video`
  tag because upload scripts write `use:*` into `story_type`.
- **In-place media swap picker** — orange "⇄ swap" overlay button on every section
  with media (admin only). Click → modal with EL thumbnails by tag. Click thumb →
  swap. Overrides written to `v2/data/field-note-overrides.json` (committed to git).
  See `src/components/admin/media-swap-picker.tsx` + `src/lib/field-notes/overrides.ts`.

### Mykel
- **Mykel storyteller** created in EL: id `3aa9a02a-c16a-4f50-b3e0-84ae42f99f73`,
  `display_name: 'Mykel'`, location Alice Springs.
- **Mykel.mp4** uploaded to EL: story id `680eb68d-e318-4433-8de2-16960329e6f4`,
  89s, h264 1920×1080, all 11 canonical tags applied,
  `is_public: true`, `status: published`, `elder_reviewed: true`.
- **Cinema block placement**: directly after Mykel's read block in the trip story
  (not in the end-of-story "Hear it from them" slot — that's now reserved for the
  Ampilatwatja Elders' clip, hidden until an Elder video lands with
  `use:voice + community:ampilatwatja`).
- Public URL of the video: `https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/3aa9a02a-c16a-4f50-b3e0-84ae42f99f73/1779516342701_Mykel.mp4`

### Photos
- **121 of 121 Alice build photos** in EL with `story_type: 'gallery-photo'` and
  canonical tags (`format:photo`, `trip:may-2026`, `community:alice-springs`,
  `event:alice-build`, `participant:oonchiumpa-young-people`, `consent:public`).
  All flipped `is_public: true` via `scripts/approve-alice-build-photos.mjs`.
- Gallery renders 24 (limit) of them in the build section. Lightbox shows the lot.

### Admin tooling
- **`/admin/el-storytellers/new`** — form stays open after submit (community + consent
  source persist), shows a "trip voices not yet in EL" chip card at the top with
  one-click prefill links for every voice mentioned in `trip-stories.ts` that
  doesn't have a matching storyteller.
- **`/admin/el-stories/new`** — prose story composer with canonical tag taxonomy.
- **`/admin/el-stories`** + `/admin/el-storytellers`** — list views.
- **`/admin/photos`** — quick-filter chips for trip events.

## Trip story state (Utopia · 21–22 May 2026)

Block-by-block, in order:

1. masthead "The young people built the beds. One of them wanted to keep building." — `fromTag` hero auto-pulls overlay-fullscreen video from EL if one exists
2. bleedquote "Come down and make your apmere." — welcome speaker UNNAMED
3. read "Not a giveaway. A build." — Centrecorp + Oonchiumpa named
4. videos "Building in Alice Springs" — legacy stub (alice-youth-desktop.mp4, no file)
5. el-gallery — 24 of 121 Alice build photos, lightbox
6. read "Never would've thought it would've come out like that" — Mykel (consent pending tagged in pulls)
7. **🆕 el-video-gallery "Mykel, in his own voice"** — Mykel.mp4 cinema, public live
8. goods-facts atom
9. pullquote "Yeah, I'll be rocking up every day to make them." — Mykel
10. immersive "From town to the homelands"
11. immersive "The beds go to the homes"
12. health-facts atom (rhd-prevention)
13. bleedquote "Waste into rest. A morning into a trade."
14. voices "What people told us" — Johnny (consent pending, no slug); Ampilatwatja Elder placeholder
15. immersive "Sitting with the old fellas" (Ampilatwatja)
16. pullquote "You don't turn up loud to country. You turn up listening."
17. read "Four beds, two Elders, one quiet morning" — both Elders UNNAMED
18. el-video-gallery "Hear it from them" — RESERVED for Ampilatwatja Elders, currently hidden
19. read "The point is to hand it over"
20. live-map atom
21. pullquote "A bed is a small thing. Asking what the home needs is the larger one."
22. close "This is the first thing he built. It is not the last we will build together."
23. pathways
24. portal

## What's still open

Editorial:
- **Masthead title** still unresolved. Four options on the table:
  - "Beds for homes on country. Built by young people who want to keep building."
  - "Beds to the homelands. The next mob already building."
  - "Forty-eight beds to country. Built in Alice by the young mob, delivered to Utopia."
  - "Beds for Utopia and Ampilatwatja. The young people did the building."
- **Arrernte welcome speaker** needs naming + consent (Block 2)
- **Johnny** needs EL storyteller + slug (Block 14 voice card)
- **Two Ampilatwatja Elders** — names + consent + EL records (Blocks 14, 17, 18)
- **Block 4** legacy stub "Building in Alice Springs" videos block — should be converted
  to el-video-gallery with `event:alice-build` tag, or removed
- **Block 7 video orientation note** — Mykel landed as `landscape`. Cinema block plays
  fine in cover mode. If you want portrait clips elsewhere they'll auto-detect.

Bigger:
- **EL storyteller trigger fix** — EL has a "Storyteller must have a valid profile"
  trigger that blocks Goods's `/admin/el-storytellers/new` server action via REST.
  Mykel was created on the EL side. See
  `wiki/outputs/2026-05-23-empathy-ledger-prompt-goods-upload-flow.md` for the brief
  + three fix options for EL's codebase.
- **Other trip-may-2026 videos** — atmosphere/establishing clips for the hero
  background, process clip for assembly, voice clips for Johnny + welcome speaker
  + Elders. Upload via EL admin with the canonical taxonomy and they auto-appear
  in their respective slots.

## Key file locations

| Thing | Path |
|---|---|
| Utopia trip story data | `v2/src/lib/data/trip-stories.ts` |
| Scrollytelling renderer + CSS | `v2/src/components/stories/trip-story.tsx` |
| Public field-notes route | `v2/src/app/field-notes/[slug]/page.tsx` |
| EL gallery resolver | `v2/src/lib/field-notes/resolve-gallery.ts` |
| Media swap picker + modal | `v2/src/components/admin/media-swap-picker.tsx` |
| Swap override store | `v2/src/lib/field-notes/overrides.ts` + `v2/data/field-note-overrides.json` |
| Override API routes | `v2/src/app/api/admin/field-note-override/` |
| Story-atoms (shared content) | `v2/src/lib/data/story-atoms.ts` |
| EL prompt brief | `wiki/outputs/2026-05-23-empathy-ledger-prompt-goods-upload-flow.md` |
| This handoff | `wiki/outputs/2026-05-23-field-notes-utopia-session-handoff.md` |

## EL canonical IDs (paste into env or scripts)

- Goods organisation: `db0de7bd-eb10-446b-99e9-0f3b7c199b8a`
- Goods project: `6bd47c8a-e676-456f-aa25-ddcbb5a31047`
- Goods tenant: `5f1314c1-ffe9-4d8f-944b-6cdf02d4b943`
- Mykel storyteller: `3aa9a02a-c16a-4f50-b3e0-84ae42f99f73`
- Mykel.mp4 story: `680eb68d-e318-4433-8de2-16960329e6f4`
