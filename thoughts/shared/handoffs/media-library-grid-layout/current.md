# Handoff — Media library: EL photo alignment + migration + grid layout

_Updated 2026-07-08. Branch `docs/snow-onepager-assets`. Dev server on **:3100** (`cd v2 && PORT=3100 npm run dev`; :3000 is The Harvest Website/Vite, NOT us)._

## ✅ DONE (this session, all working, uncommitted)

1. **EL photo↔people alignment, folded into `/admin/media-library`.** Open an EL photo → "People in this photo" picker writes to EL `media_storytellers` (verified shape: `relationship:'appears_in'`, `consent_status:'pending'`, `source:'batch'`, OMIT tenant_id/added_by, on_conflict triple). "Needs people" toggle + "Person" filter + violet tile badge. Roster = `project_storytellers` (26 offered). See [[goods-el-photo-alignment]] for the full contract + gotchas.
2. **Website→EL migration.** 52 person/community photos uploaded into EL (private `story-media` bucket, gated `privacy_level:community` + `visibility:private` + `requires_consent:true`). 11 mis-bucketed logos/map removed via `el-migrate.mjs unmigrate`. Library EL pool = 428 images.

## 🔴 IN FLIGHT — the media library THUMBNAIL GRID LAYOUT (the frustrating one)

**File:** `v2/src/app/admin/media-library/library-client.tsx`. Ben has rejected FIVE layouts in a row; he is frustrated. The hard constraint: **show every photo WHOLE (no crop), at natural shape, in a clean even grid (no black bars, no chaotic staggering).**

What he's rejected, and why:
- square `aspect-square` + `object-cover` → "zoomed in too much" (crops)
- square + `object-contain` → black-bar strips ("weird")
- CSS-columns masonry (`columns-N`) → website-first ordering dumped shorts in col 1 + re-balanced on load ("fucks out")
- flex-column masonry (round-robin distribution) → tall EL photos ran unbounded ("still fucked with long images")
- justified-rows + `object-cover` → still cropped ("don't fuck crop the image")

**Current code (last change, AWAITING Ben's hard-refresh verdict — he said "save to clear" before confirming):**
Justified-rows layout (`rows` useMemo) driven by per-image aspect ratios measured client-side. Key pieces in `library-client.tsx`:
- state `aspects` (id→w/h), `gridWidth` (ResizeObserver on `gridRef`).
- `rows` useMemo: `ROW_H=220, GAP=12, MIN_A=0.45, MAX_A=2.6, DEF_A=1.4`; greedy fill, stretch each full row to `gridWidth`, last row natural.
- tile `<img>` now `object-contain` (CANNOT crop) + `ref` measures cached imgs + `onLoad` measures fresh; box `style={{width,height}}` from the row calc.

**Why this SHOULD be right:** `object-contain` makes cropping physically impossible; box sized to measured aspect ⇒ no bars once loaded. If bars appear, the aspect measurement is lagging → make it more robust (that's the next lever), do NOT go back to cover/crop.

**If Ben still hates it:** the tension is real — whole-image + uniform-grid + no-bars is only satisfiable by justified rows (current) or accepting one of bars/crop. Consider: (a) reduce ROW_H so rows are shorter/denser; (b) if measurement is the problem, add width/height server-side (EL `media_assets.width/height` are NULL — could backfill via a sharp pass in the el-image proxy, or a one-time dims script). Don't re-propose square/masonry — already rejected.

## Files touched (all uncommitted, branch `docs/snow-onepager-assets`)
- NEW: `v2/src/lib/empathy-ledger/align.ts`, `v2/src/app/api/admin/el-align/route.ts`, `v2/scripts/el-align.mjs`, `v2/scripts/el-migrate.mjs`
- MOD: `v2/src/app/admin/media-library/{curation.ts,library-client.tsx}`, `v2/src/app/api/admin/el-media/route.ts`
- `v2/src/app/admin/photo-align/page.tsx` → now a redirect to media-library; `align-client.tsx` = the old standalone UI, preserved but unused
- Scope/analysis in scratchpad: `website-el-scope.mjs/.json`, `el-migration-manifest.json`

## Tier notes
- EL writes (align tags, migration uploads) are Tier-3 / human-in-loop — Ben runs them; the auto-mode classifier blocks background EL writes (correct). Layout/UI work is Tier-1.
