---
date: 2026-06-26T00:00:00+10:00
session_name: centrecorp-utopia-page
branch: docs/snow-onepager-assets
status: complete
---

# Work Stream: Centrecorp partner page + Utopia story + branch sync

## Ledger
<!-- Extracted by SessionStart hook for quick resume -->
**Updated:** 2026-06-26
**Goal (this session):** Make `/partners/centrecorp` a great, impact-led funder page with the real Utopia storytelling, photos and the second (May 2026) trip. Then sync the long-drifted branch.
**Branch:** `docs/snow-onepager-assets` @ `b47bbaf` — **0 behind origin/main, pushed, remote in sync**. 13 pre-existing cross-session WIP files left intact (alignment-engine, empathy-ledger, qbe, proxy, etc.).
**Result:** Done + LIVE on prod. Nothing pending from this session.

### What shipped (all LIVE on www.goodsoncountry.com)
1. **`/partners/centrecorp` rebuilt as an immersive dark editorial field story** — was a flat cream card page covering only the Oct 2025 trip; now a full two-round story modelled on `wiki/outputs/utopia-feature.html` (Georgia serif, ochre, grain, scroll-progress, full-bleed documentary photos, reveal-on-scroll). Server `page.tsx` keeps SEO + JSON-LD and renders `'use client'` `centrecorp-story.tsx`. **PR #137 → main `b65cf2e`.**
   - Narrative: Not-a-giveaway → Mykel's seven beds (verbatim) → one-bed-in-numbers → the road → the homes → why-a-bed-is-health-hardware → the Ampilatwatja Elders → a-door-is-a-door-again → Oonchiumpa Good News Story + video → the model → where-the-beds-have-gone → close.
   - **Right photos** = the curated `wiki/outputs/utopia-media/` frames (01-hero..11-close), copied to `v2/public/images/partners/centrecorp/story/`. NOT the `design/deck-assets/` ones (my first attempt used those — Ben: "wrong photos, looks shit"; the rebuild fixed it).
   - Canon-correct: X-trestle bed (fixed the feature's "legs click onto the poles"); 496 beds / 9 communities / 87 this round / 1,740kg; health framing kept to the *why* (scabies→RHD mechanism), no claimed outcome.
2. **Cross-linked the two Utopia surfaces — PR #138 → main `1cce5c0`:** centrecorp page → `/field-notes/utopia-may-2026` ("Read the full field story"); field note's Centrecorp back-CTA updated from "first Utopia delivery, October 2025" to "See the Centrecorp Foundation partnership story".
3. **Consent docs reconciled — committed `843e99b`** (branch-only, not deployed): `wiki/articles/brand-comms/02-storyteller-voices.md` + `CONSENT_BACKLOG.md` flipped Mykel/Xavier from "consent pending / internal only" to CLEARED (2026-06-26, Oonchiumpa-facilitated). Kept the youth-consent *process* note as forward guidance; kept the 2026-05-22 historical log line with a dated 2026-06-26 entry below it.
4. **Branch synced** — `docs/snow-onepager-assets` was 72 ahead / 11 behind origin/main. **Rebase is a conflict swamp** (all branch code already on main via squash-PRs, so replaying the un-squashed originals fights main's shipped versions — impact-model.ts, impact/page.tsx, etc.). `merge-tree` confirmed the END states agree → **synced via a CLEAN MERGE** (`b47bbaf`, conflict-free), now 0 behind, pushed. WIP stashed/restored cleanly around it; redundant `page.tsx`/`trip-stories.ts` WIP discarded (main's #137/#138 own them).

### KEY FACTS (carry forward)
- **The longer Utopia story is ALREADY LIVE at `/field-notes/utopia-may-2026`** (`v2/src/lib/data/trip-stories.ts`, slug `utopia-may-2026`, `published: true`, rendered by `/field-notes/[slug]`). I wrongly thought it was "on hold pending video" — it is NOT. Don't re-make it. Video files for the May trip are not in the repo yet (placeholders); the live field note handles media via EL tag queries.
- **Ben cleared ALL May 2026 Utopia trip voices + people for funder/external use on 2026-06-26** — Mykel, Xavier (arc told in Fred Campbell's voice), Fred, the Oonchiumpa Good News Story. Mirrors canon `cleared-voices.ts` + `canon.ts:154`. Use only verbatim quotes that exist in the data; never recombine.
- **The right Utopia photos** = `wiki/outputs/utopia-media/` curated frames (01-hero carrying the bed down the red road, 07-elders the two senior men + dog, 08-beforeafter Elder woman + boy on the bed, 11-close footy at golden hour). `design/deck-assets/` are weaker — don't use for the funder page.
- **Branch-sync rule for `docs/snow-onepager-assets`:** all its code is on main; a rebase is a dedup swamp → **use `git merge origin/main`** (merge-tree is clean), not rebase. Or retire the branch (Ben chose merge this time).
- **Dev-server-during-merge corrupts the Turbopack manifest** (error: `next/dist/client/app-dir/link.js#` not in Client Manifest). Fix = kill dev, `rm -rf v2/.next`, restart. Not a code bug; prod was always fine.

### Open / not done (none block; from earlier sessions)
- 13 cross-session WIP files still uncommitted in the tree (alignment-engine, empathy-ledger client/press-pack, qbe-readiness, cost-charts, canon.ts, proxy.ts, qbe-areas.json, 3 wiki/canon generated reports) — NOT this session's; left intact.
- Ampilatwatja OAM Elders are cleared for use but their individual full names are still to confirm before crediting by name.
- May-trip video files (Mykel build / Elders / drone) not in repo — when they land, they slot into the field note + could enrich the centrecorp page.
- QBE funder outreach (the 06-20 workstream) still the standing human/day-shift priority — send the 8 drafted emails (SEFA + Jay first). Unchanged by this session.

### Commits / PRs
- main: `b65cf2e` (#137 immersive page), `1cce5c0` (#138 cross-link) — both LIVE, curl-verified.
- branch `docs/snow-onepager-assets`: `843e99b` (consent docs) + merge `b47bbaf`; pushed, 0 behind main.
