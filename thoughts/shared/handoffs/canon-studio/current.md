# Canon Studio — resume ledger

_Last updated 2026-06-30. Branch `docs/snow-onepager-assets`. All work COMMITTED + PUSHED._

## What this is
A live, repeatable system to pick the single best photo/video per investment **purpose**, and
have those picks render straight into the deck + one-pager. Built across this session.

## Status: DONE + shipped (commits `2211fef`, `7ff2207` pushed)
- **`/admin/canon` = Canon Studio** (guided, one slot at a time). Default tab; "By QBE area" kept as reference.
  - Whole pool ranked best-first per slot: EL photos/videos/faces (content-hub + syndication API) + every repo image (`getLocalImages`). One click pins + auto-advances.
  - **Upload to slot** (slot-aware `canon-upload`) and **+ New purpose** (`canon-slot-add`) from the UI. Repo picks → `canon-slot-set`. EL picks → `canon-el-pick`.
  - EL thumbnails proxied/cached via `/api/admin/el-image` (SSRF-locked to EL hosts).
- **40-slot taxonomy** = `design/canon-slots.json`. Picks persist to `image-canon.json` (slot-tagged) + `data/canon-el-picks.json`; every change auto-regenerates `design/canon-resolved.json` (flat slot→winner map).
- **Loop closed to artifacts:** artifacts use `CANON:<slot-key>` tokens; `v2/scripts/canon-render.mjs` bakes the winner (auto-run by `design/brand/kit/render.sh`). Resolution: local canon > EL pick (prefers local `.el-cache`, survives EL outage) > seed. `--inline` for export.
  - Wired: `design/brand/claude-design/invest-deck-full.html` (8 tokens) + `design/brand/kit/funder-onepager.html` (new, 5 tokens).

## Current state
- **16/40 slots set** by Ben (first pass). `canon-resolved.json` reflects this.
- EL API was DOWN during the last build ("deployment not found on Vercel") — baking still worked via `.el-cache`. Re-run `cd v2 && node scripts/el-photo-review.mjs` to refresh the cache when EL is back.

## How to use (next session)
- Pick: open `/admin/canon` (Studio tab), fill remaining slots. Dev server: `cd v2 && npm run dev`.
- Render an artifact with current picks: `design/brand/kit/render.sh design/brand/kit/funder-onepager.html` (PDF + preview next to it).
- New artifact: reference images as `CANON:<slot>` in src/url; render.sh bakes them.

## ▶ NEXT
1. Finish the remaining ~24 slots in the Studio.
2. (Optional) Batch-fix the 11 other admin surfaces still on the dead `EMPATHY_LEDGER_SUPABASE_*` keys (el-stories, photos, deck, dashboard-images, funders/video-brief, reports, photo-review/raw) — same one-line content-hub swap as `/admin/canon`.
3. (Optional) More canon-driven artifacts (data-room cover, funder-specific cuts) using the `CANON:` token pattern.

## Key files
- Studio: `v2/src/app/admin/canon/{page,canon-client,canon-studio}.tsx`
- Routes: `v2/src/app/api/admin/{el-image,canon-slot-set,canon-slot-add,canon-upload,canon-el-pick}/route.ts`
- Resolve: `v2/src/lib/data/canon-el-picks.ts` (`writeCanonResolved`) + `v2/scripts/canon-resolve.mjs`
- Bake: `v2/scripts/canon-render.mjs`, `design/brand/kit/render.sh`
- Data: `design/canon-slots.json`, `design/image-canon.json`, `v2/data/canon-el-picks.json`, `design/canon-resolved.json`
- Scripts: `v2/scripts/{el-photo-review,canon-build,canon-assign,canon-resolve,canon-render}.mjs`
- Memory: `[[goods-canon-photo-video-system]]`
