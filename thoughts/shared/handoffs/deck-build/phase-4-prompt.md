# Phase 4 — Build the pages that support the storyboard / newsletter / funder system

**Part of Ben's 5-part program (2026-07-23).** Parts 1-3 done: the storyboard page (`3a5ebcf981cf8165a3efcb35ccdb9dff`) has per-slide deep-links (9 Notion, 7 web), and the Newsletter Journey page (`3a5ebcf981cf81bbb720f65bbb58909b`) walks the 12 beats over time. **Phase 4 = build the pages the system needs but doesn't have yet.** Phase 5 (next) = Descript videos.

## Goal
Every slide/beat should have a real "dig deeper" destination, and the newsletter should have a content source per send. Fill the gaps with grounded-voice Notion pages, wired back into the storyboard. Real cleared assets only. **Audit before building — do not duplicate existing pages.**

## The confirmed gaps (per-slide pages that don't exist — from Part 1)
1. **Slide 02 — THE PROBLEM.** A "why beds don't survive" page: remote-housing failure, freight doubles the price, 60 years of furniture designed somewhere else dying in months, the ~$3M/yr of washing machines landfilled in the NT. Evidence: the Kalgoorlie dumped-mattress photos (`v2/public/images/community/kalgoorlie/mattress-*.jpg`, no consent gate). Claim ceiling: scabies→RHD is the WHY only, never a claimed outcome.
2. **Slide 05 — THE PLASTIC LOOP / PRODUCT.** A "how a bed is made" page: 20kg HDPE per bed, collect→shred→press→CNC→X-trestle tension design, the Stretch Bed spec (`v2/src/lib/data/products.ts` = source of truth: 26kg / 200kg / 188×92×25cm / ~5min no-tools / 180°C press / $750 / slug `stretch-bed`), 3,540kg diverted so far. NEVER "clip-on"/"woven cord"/"hardwood".
3. **Slide 06 — MANINGRIDA DELIVERY.** The INV-0303 story: 40 Stretch Beds + washers, Homeland School Company (= the Maningrida buyer), pressed at the farm, built in community with young people. Firsthand source = Shayne Bloomfield's EL transcript (per `wiki/investor/06-full-stories.md`). Cleared Maningrida photos (10, `design/starred-images/community--maningrida--*` + `design/deck-photos/maningrida-trip/`).

## Likely also needed (system pages — confirm via audit first)
4. **"Which door are you?" funder page** — the three doors (invest the plant / fund the program / back the proof) made navigable per funder type. May already partly exist (session-7 "which door are you" funder map / Pencil FUNDERMAP frames — check). If not on a clean Notion page, build it from the grounded ask (`wiki/outputs/2026-07-22-the-ask-grounded-voice.md`).
5. **Storyteller pages for the other cleared voices** — the newsletter needs a face/voice per send. Dianne has one (`392ebcf9…43cf`). Check EL / Notion for Shayne Bloomfield, Mykel, Alfred Johnson, Gloria, etc. Build/stub the ones missing. Use only cleared voices (`cleared-voices.ts`, 34 cleared).

## How to run it
1. **Audit first.** `notion-search` for each gap topic before building. Also check the Artifact Hub (`378ebcf981cf8192a5e5c66b93630725`) index. Don't duplicate.
2. **Build each genuine gap** as a Notion page in the grounded funder-simple voice (the storyboard/reflection dial — plain lines, real assets, no grant-speak, no em dashes, straight quotes). Parent = the reflection page (`3a5ebcf981cf817ca4b6ff3fb947cb23`) or the Artifact Hub.
3. **Wire each new page into the storyboard** — add its "→ Dig deeper (Notion)" line to slides 02/05/06 (MCP `update_content`, REAL newlines, anchor exact — see the working method in the ledger + `[[notion-local-image-upload]]` for images).
4. **Web pages:** where a gap also wants a live page (e.g. a `/product` or `/how-its-made`), FLAG it for the dev build — don't build web pages in this phase unless trivial.

## Guardrails
- Grounded voice, funder-simple dial (the 12-lines dial). Ben rejects crunchy layouts (boxes/grids/taxonomies).
- Real cleared assets only. If a gap has no real content/assets yet, build a **stub** page noting what's needed — do NOT fabricate.
- Canon: 540 beds / 22 washers / 11 communities / 3,540kg / $750 / $713,827 revenue. Verify against `canon.ts` / `check-asset-drift.mjs` before quoting.
- Consent is a hard rule: only cleared voices/photos (Dianne + all Oonchiumpa cleared 2026-07-22; Maningrida 10 cleared).

**Stop when:** the 3 slide gaps (02/05/06) have Notion pages wired into the storyboard, and the "which door" funder page exists (built or confirmed). Then report and hand to Phase 5 (Descript).

---

## DONE — 2026-07-23 (session 12)
Phase 4 complete. Canon verified green (`check-asset-drift.mjs`: 540/177/363/22/11/3540) before building.

**Built (parent = reflection page `3a5ebcf981cf817ca4b6ff3fb947cb23`, grounded funder-simple voice, real hosted goodsoncountry.com photos, no em dashes, straight quotes, scabies→RHD as WHY only):**
1. Slide 02 — **Why beds don't survive out here** `3a6ebcf981cf81229d45d83688720def` (freight doubles price, $3M/yr NT washers landfilled, Kalgoorlie dump photos, Gloria's camp; explicit claim boundary)
2. Slide 05 — **How a bed is made** `3a6ebcf981cf81668a8fc609a8f6d84f` (collect→shred→press 180°C→CNC→X-trestle tension; full Stretch Bed spec; real process/build photos; "canvas is structural")
3. Slide 06 — **Maningrida: we pressed their beds ourselves** `3a6ebcf981cf811b8341f16ed0c87b57` (INV-0303, 40 beds + 2 washers, Homeland School Company, pressed at farm, capability proven / next run = measured cost; Shayne Bloomfield EL firsthand)

**"Which door" funder page** — CONFIRMED already exists (`3a4ebcf981cf81488ae7d78618c1cfbc`, built 2026-07-21, content strong). Was NOT wired; now linked from slide 09 (the ask) + the Linked-Notion-pages list.

**Wired into storyboard** `3a5ebcf981cf8165a3efcb35ccdb9dff`: slides 02/05/06 now each have a `→ Dig deeper (Notion)` line; slide 09 gains the funder map. Verified by re-fetch — every slide 01-12 has a dig-deeper destination.

**Note for Phase 5 / later:** the 3 new pages reuse existing hosted goodsoncountry.com images (real, cleared). The starred Maningrida trip photos in `design/starred-images/community--maningrida--*` are NOT yet hosted — if a richer Maningrida page is wanted, upload via `ntn` (`[[notion-local-image-upload]]`).

---

## PHASE 5 DONE — 2026-07-23 (session 12): Descript videos → Notion

Built **Video Map** page `3a6ebcf981cf81b3a6cee03c36d24f92` (child of storyboard) — the single decision surface mapping every video to its beat with two flags per video: **canon** (current vs stale) and **consent** (cleared vs confirm). Linked into the storyboard linked-pages list.

**Video inventory (from Workbench `39debcf981cf8101bd57fba80c691906`):**
- 6 full-deck audience cuts (general/Snow/PICC/community-general/Oonchiumpa/TFN) = **STALE canon** (Feb 2026: 496/16/2660 vs current 540/22/3540). Flagged re-record, NOT wired live.
- 3 people Descript cuts: Fred+Xavier (`YQwAcYfxzkn`), Jaquilane (`LAT0KNJMxmH`), Stretch Bed timelapse (`Xtrc5ZYsym6`).
- 5 local-ready (`v2/public/video/`): Mykel 89s, Karen Liddle 40s, plant loop 34s, delivery road 12s, Jaquilane's mum 72s.

**Consent verified** against `cleared-voices.ts`: Mykel, Karen Liddle, Fred Campbell, Xavier ALL cleared (Xavier under narration rule — Fred narrates, no direct Xavier quotes). **Jaquilane is NOT in `cleared-voices.ts`** despite her video being live on the site — flagged confirm-before-new-wiring.

**Wired (safe = object-only, current, no gate):** Stretch Bed timelapse → storyboard **slide 05** (`→ Watch (Descript)` line) + newsletter **Send 5** Video slot. Video Map linked from newsletter system note.

**Video is settled (do not re-investigate):** Pencil cannot play video and `href` does not fire in .pen present mode → in the deck, video = poster frame + a Descript link Ben pastes by hand. In Notion, Descript links play fine.

**BEN'S CALLS (2026-07-23, resolved):** (1) ✅ Fred+Xavier `YQwAcYfxzkn` → **wired to slide 07**; (2) ⏸ Jaquilane **HELD** — not in `cleared-voices.ts`, Ben did not confirm consent, do NOT place until added to registry; (3) ✅ **main walkthrough = `haRZJbfJadJ`** (Nic production-facility walkthrough) → **wired to slide 01** as the main watch link (canon caveat noted: Feb-2026 cut, may say 496/16/2660 — fine as a facility tour, re-cut only if figures are spoken); Ben is adding a separate **Nic production facility walkthrough** (link pending, slot left on Video Map); (4) ❌ Maningrida cut — not doing ("don't have it"). **"→ web" (per-slide video on the live site) = dev build, flagged not built here.**
