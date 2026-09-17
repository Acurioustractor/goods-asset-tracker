---
date: 2026-09-17T21:05:00+10:00
session_name: admin-ia-and-grantscope
branch: design/admin-ia
status: paused-for-snow
---

# Work Stream: admin-ia-and-grantscope

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-17T21:05:00+10:00
**Goal:** Make the admin navigable and connect grantscope. SHIPPED to `origin/design/admin-ia` (7 commits, `6c43ee5`), no PR opened.
**Branch:** `design/admin-ia` in `../goods-ia-wt`, pushed to BOTH `origin` and `mirror`, 0 behind `origin/main` (`3dda083`).
**Test:** `cd v2 && npx tsc --noEmit && npx vitest run && npm run build` — all green at push (1252 tests, 79 files).

### Now
[->] PAUSED DELIBERATELY. The Snow branch is the urgent one and another agent is live in it. Come back to open the PR for `design/admin-ia`.

### This Session
- [x] **Swept 19 routes off the admin rail**, kept in the registry (`rail: false`). A guard fails the build when a page exists and nothing declares it, so removing entries entirely would break it. Stories went 14 children → 1.
- [x] **One media wall** — photos/videos was a *mode* (opened on Photos, could not see a clip and its stills together). Now opens on Everything.
- [x] **Held photos stop looking broken** — `safeImageUrl` nulls every Empathy Ledger bucket URL, so ~550 consent-held photos rendered the same grey "No preview" as a real failure. They now say "Awaiting Elder review" / "Not cleared to show". **Ruling: held photos stay hidden; the fix was presentation, not the gate.**
- [x] **`/admin/products` restored** — a `next.config.ts` redirect (added 2026-07-20) sent it to `/admin`, so no page there could ever load. Redirect deleted. Live register counts per product; every status prints (an earlier cut hid 9 retired + 3 under-investigation washers so 33 ≠ 45).
- [x] **media_links: 30 dead → 0.** 33 storyteller portraits pointed at `empathyledger.com/api/media/<id>/file`, which 403s for anyone not signed in to EL. Repointed to the `story-media` bucket (serves anonymously). +1 wrong-bucket URL. **APPLIED TO THE DATABASE — live now.**
- [x] **Procurement deduped.** `goods_procurement_entities` is an entity×community CROSS-JOIN: 4,562 rows, 1,049 orgs, Northern Land Council present 338 times. Raw total $17.07bn vs deduped $1.87bn. Generated `procurement-register.ts` (144 entities) + 6 guards.
- [x] **Grantscope CONNECTED** via direct Supabase read. `/admin/grantscope` live.
- [x] **32 `crm_contacts` linked to grantscope** (was 0 of 135). **APPLIED TO THE DATABASE — live now.**
- [x] **Centrecorp settled against Xero.** See Decisions.
- [x] Designed in Pencil: `Admin IA · the nine doors`, `Reconciled · one rail, page tabs`, `The data model`; added Next-move buttons to `Readiness View`.
- [x] Created backup ref `backup/snow-page-and-letter-20260917-2100` in `../goods-ledger-wt` pinning that session's 57 unpushed commits.

### Next
- [ ] **Open the PR**: `https://github.com/Acurioustractor/goods-asset-tracker/pull/new/design/admin-ia` (needs Ben's explicit verb).
- [ ] **Rebase `fix/snow-page-and-letter` onto `origin/main`** once that agent is idle. It is 8 commits behind and conflicts with **main** (not with me) on 5 Snow files: `snow-partnership.ts`, `snow-partnership.guards.test.ts`, `snow-photos.ts`, `place-films.tsx`, `partners/[slug]/story/page.tsx`. Backup ref exists.
- [ ] Resolve the 20 ambiguous org→grantscope matches by eye (Ben, ~5 min), then re-run `link-contacts-to-grantscope.mjs --write`.
- [ ] Tell grantscope that **Goods on Country is filed under ABN `36697347676`, which is A Curious Tractor's**. The charity is `22155132684`. Grantscope currently cannot see the charity at all.
- [ ] Consider unsetting `GRANTSCOPE_API_URL` (points at a 404 host; code default is better, though still bot-challenged).

### Decisions
- **Centrecorp is 167 beds AND 107 beds — never in conflict.** Xero, both PAID: INV-0259 (11 Aug 2025) = 60 × Basket Bed v1.3 @ $370 + 2 workshops; INV-0291 (26 Nov 2025) = 107 × Weave Bed v2.3 (Utopia) @ $560 + 3 workshops. **167 = every bed. 107 = second invoice only. 109 appears in NO invoice** (legacy trip deck only) — retire it. The 107 are Stretch Beds under the naming exception; the 60 are Basket Beds. **Never say "167 Stretch Beds."** $123,332 inc GST total, of which $30,000 is facilitation.
- **Held EL photos stay hidden from admins.** Chose presentation fix over widening `safeImageUrl`, because the consent leak of 16 Sep makes surfacing Elder-review-pending photos the worse risk.
- **Procurement reads a generated file, not the table.** A cross-join cannot be queried safely; any raw total is ~9× inflated.
- **Grantscope is read via direct Supabase, not the HTTP API.** `GRANTSCOPE_API_URL` → civicgraph.vercel.app 404s; civicgraph.app sits behind Vercel Security Checkpoint and bot-challenges server calls. Neither is fixable from this repo.
- **Contact matching refuses to guess.** "The Trustee For <name>" is stripped (a fact about AU registration). "ACT", "Rotary", "SEFA", "UWA" are skipped — a wrong `grantscope_id` would attribute another org's contracts to our contact.
- **Do not rebase a branch another agent is actively committing to.** That session committed 49s before I checked, every 3–6 min, with 57 commits on no remote.

### Open Questions
- UNCONFIRMED: whether the other session's "The 121 Alice Springs build photos get their bucket back" overlaps my `story-media` repair — both touch buckets from different ends.
- UNCONFIRMED: the 1 remaining `media_links` row I could not fix earlier was fixed by bucket correction; re-run `check-media-links.mjs` to confirm still 0 dead.
- UNCONFIRMED: whether grantscope's 2.99M `gs_relationships` / 291k GrantConnect awards are worth surfacing — untouched.

### Merge state (verified by `git merge-tree`, not guessed)
- `design/admin-ia` vs `fix/snow-page-and-letter`: **ONE conflict hunk — two adjacent import lines** in `library-client.tsx` (`Lock` vs `useRouter`). Resolution: keep both. Both feature sets survive the merge (verified).
- The 5 Snow-file conflicts are **theirs against `main`**, not against me.

### Workflow State
pattern: ship-then-pause
phase: 7
total_phases: 7
retries: 0
max_retries: 3

#### Resolved
- goal: "make the admin usable, connect grantscope, close off cleanly"
- resource_allocation: aggressive

#### Unknowns
- snow_branch_rebase: BLOCKED on the other agent being idle

#### Last Failure
Push to `mirror` was my error (I read `git remote -v | head -2` and missed `origin`). Corrected; branch is now on both.

---

## Context

### Live database changes (NOT in git, already in the world)
Two writes were applied to the Goods project (`cwsyhpiuepvdjtxaozwf`) and are live regardless of whether this branch merges:

1. **34 `media_links` rows** repointed from dead EL app URLs to `story-media` storage URLs, `media_source` corrected `external` → `el_media`. Rollback at `v2/scripts/.media-links-rollback.json` (gitignored). Reproduce with `node scripts/repair-media-links.mjs --write`.
2. **32 `crm_contacts`** given a `grantscope_id`. Reproduce with `node scripts/link-contacts-to-grantscope.mjs --write`.

A `media_source` check constraint allows only `local | el_media | external` — an earlier attempt wrote `el-storage` and all 33 PATCHes failed with 23514. Nothing was half-written.

### What grantscope actually holds (ACT infra, `tednluwflfhxyucgwigh`)
- `gs_entities` 609,631 · `gs_relationships` 2,986,463 · `grantconnect_awards` 291,264 · `grant_opportunities` 26,809 (**26,785 already carry `goods_relevance_score`**) · `v_acnc_grant_makers` 128,249 · `foundation_grantees` 5,695
- **The join is the ABN**: `gs_id` = `AU-ABN-<abn>`, already on every procurement register row. No mapping table needed.
- Top scored + open: **"Whitegoods and Household Goods"** (Western Cape Communities Trust, score 100, $6,000) — literally washing machines; ABA $1M ongoing; IBA Start-Up $150k; SEDI Capability $120k to Jun 2027.

### Files added this session
- `v2/src/lib/data/procurement-register.ts` (generated) + `.guards.test.ts`
- `v2/src/lib/grantscope/direct.ts` (read-only, server-only; `client.ts` left untouched)
- `v2/src/app/admin/grantscope/page.tsx`, `v2/src/app/admin/products/page.tsx`
- `v2/scripts/`: `check-media-links.mjs`, `repair-media-links.mjs`, `generate-procurement-register.mjs`, `link-contacts-to-grantscope.mjs`

### Corrections I had to make to my own claims this session
Recorded because they cost Ben time:
- Called `assets`/`media_links` schema "risky" on shape alone; both were spotless when checked. The one place I did **not** check (the external-labelled links) was the broken one.
- Waved past 37 links because `media_source: external` sounded intentional; 29 were dead.
- Warned twice about a branch "collision" without running `git merge-tree`; it was two import lines.
- Told Ben to push to `mirror` after reading only the first two lines of `git remote -v`.
- Asked Ben to eyeball a Pencil frame when `TakeScreenshot` returned blank, instead of simply re-exporting. **Export a PNG and Read the file — screenshots lag one call behind on fresh content.**
