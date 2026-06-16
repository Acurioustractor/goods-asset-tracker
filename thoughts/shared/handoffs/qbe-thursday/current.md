# QBE Thursday + branch work: STATE AT /clear (2026-06-16)

Resume anchor for a fresh session. Cross-ref: memory `goods-qbe-opportunity-hub.md`, `goods-deploy-vercel-netlify.md`, `tfn-xero-misbooking.md`.

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-06-17 (NEWEST — QBE AREA WALKTHROUGH **COMPLETE** (all 12, drift-aligned to canon). Area 09 coverage corrected (1->3 artifacts, 🟢) + founder sequencing captured (charity ~end July). **NEXT TASK = a Notion-page-by-page REVIEW pass** (read each of the 12 QBE Diagnostic pages one at a time as a reviewer would, now that the underlying data is aligned). The QBE-PACK-BUILD detail far below is an earlier session, archived.)
**Goal:** Area-data walkthrough DONE. NEXT: review each of the 12 QBE Diagnostic **Notion pages** one-by-one (reviewer-facing QA, not data alignment — that's done).
**Branch:** `docs/snow-onepager-assets` at `09704e0`, pushed (in sync with origin). `check:drift:ci` GREEN.
**Test:** `cd v2 && npm run build` · `npm run check:drift:ci`

### ▶ NEXT TASK — NOTION-PAGE-BY-PAGE REVIEW (one at a time, in order)
[->] The data walkthrough is done (every area aligned to canon, drift fixed, artifacts registered). This next pass READS each of the 12 QBE Diagnostic Artifact DB pages **as a reviewer would**, one at a time, present a short card, get Ben's reaction, fix anything he flags, move to the next. **DB:** "QBE Diagnostic Artifact Database" `cb3794d427914d72bf1036106d8116f5` (data source `collection://2cd9505f-2a50-496e-aa86-f03ada2cf95e`). **Page IDs in order:**
- 01 Vision & Ambition — `36eebcf9-81cf-8187-b43c-db663f3dcbf9`
- 02 Social Objective & Impact — `36eebcf9-81cf-8100-bff8-f866fa0b8820`
- 03 Business Model — `36eebcf9-81cf-81fb-8aa8-de54f38bdeb4`
- 04 Financial Management — `36eebcf9-81cf-8167-884f-c3d5ecda0e32`
- 05 Strategic Planning & Risk — `36eebcf9-81cf-8143-a283-efd1eb5260d7`
- 06 Process & Technology — `36eebcf9-81cf-8165-9f6a-fab915672b57`
- 07 Governance, Data & Reporting — `36eebcf9-81cf-813e-9b6f-c95d4e5a703a`
- 08 People & Organisation — `36eebcf9-81cf-813c-bfbb-ca1709600971`
- 09 Legal Structure (keystone) — `36eebcf9-81cf-8106-b398-d52438170718`
- 10 Investors & Capital Raising — `36eebcf9-81cf-8132-9a11-e33e2d121bf9`
- 11 Cost Model v6 — `36febcf9-81cf-8146-a55d-e05050e956e9`
- 12 Investor Alignment Tool — `36febcf9-81cf-81f5-ad6d-ee375364d032`
**Per-page review checklist:** (a) does it read clearly for a cold QBE/SIH reviewer; (b) every number still matches canon (`v2/src/lib/data/canon.ts`) — data was aligned this session, so this is a re-confirm; (c) claim labels honest (verified vs modelled vs target/future), no overclaim; (d) the `OnCountry-E1C4AC` password is correct (swept 07/08/09/10/12; **01-06 NOT yet checked for the dead `goods2026`** — verify each); (e) reviewer routes/links work; (f) anything Ben wants reworded. Fix-on-Notion as you go; only touch repo/canon if a number is actually wrong.
**⚠️ Carry into the review:** (i) Areas **01-06 were NOT in the password sweep** — check each for dead `goods2026` and swap to `OnCountry-E1C4AC` if present; (ii) `/impact` gate = a 3rd unknown password (Ben to supply or drop /impact); (iii) Notion 12 still describes the CASE 6/10 tool while SIH 8/14 is canonical — Ben's call whether to rebuild that page; (iv) password is correct but still plaintext in Notion (hygiene, Ben's call).

### ▶ STANDING HUMAN-GATED (carried, runs in parallel to the review)
(1) accountant signs ONE Goods-only money-in figure (~$907,569 rec.) — the P0 behind Areas 04/10; (2) Ben sends the first match-eligible LOI ask (Area 10/12 conversion — 0 signed); (3) legal (MinterEllison) entity sign-off + entity/ownership path + Supply Nation 51% (Area 09 keystone) — **sequenced AFTER the Butterfly charity lands (~end July 2026)**, flexible approach, most of the 15-item legal checklist NOT yet decided (the correct posture, see Area 09 gap); (4) 3 vendor quotes for facility capex (Area 11).

### Final scorecard (after this session)
All 12 areas have >=1 registered artifact (no 🔴-none). **All 12 🟢 ok** after the Area 09 coverage fix (1->3 artifacts); 09 stays #1 in the build queue (keystone + P0 + blocker) because green = evidence-pack-complete, NOT decision-made. The 07-12 pattern: the genuine "Full artifact" the Notion page cited was unregistered, so the area looked thin/none until registered.

### This Session (2026-06-17 — AREA WALKTHROUGH, Areas 07-12 + password sweep)
- **07 Governance** (`36eebcf9…813e`): on-canon (496/9/2,660kg, entity language, 11-member committee, SEFA $300K all verify). Registered `18-governance-framework.md` (was the cited-but-unregistered Full artifact) -> 4 artifacts. Gap = documented-not-done; NOT stale (R7 profiles but doesn't close it). Commit `4fe909b`.
- **08 People** (`36eebcf9…813c`): on-canon (founder $560/day + fixed block $109,500 verify vs LOCKED cost engine). Registered `07-role-map.md` -> 0->1. Gap = documented-not-done (0 hires). Commit `c09ba46`.
- **09 Legal Structure KEYSTONE** (`36eebcf9…8106`): ALL entity numbers on canon (sole-trader ABN 21 591 780 066, ACT Pty Ltd ACN 697 347 676, Butterfly, A Kind Tractor dormant; retired wrong ABN avoided). Registered `04-entity-wording-block.md` (commit `da7e3e2`, 0->1, 🔴->🟡). FIXED a stale line IN that artifact (claimed grant-content.ts still had wrong ABN 50 001 350 152 + DGR-true; verified clean since 2026-05-29). **Then (commit `88c9ed8`) registered the 2 missing real proofs — `legal-structure-full-review.md` (the 27.5KB canon SOURCE for the entity facts, was untracked, now committed) + `legal-structure.md` article -> 1->3 artifacts -> 🟡 thin -> 🟢 ok.** Thin was understated coverage, NOT a real gap; 09 STILL #1 in queue (green = evidence complete, decision still open). **Founder sequencing (commit `09704e0`):** Butterfly charity ~end July (slipped from 26-Jun); 15-item legal checklist worked through after, flexibly; most undecided = correct posture. Drafted the full 15-item MinterEllison checklist for Ben in-chat (A entity form/B migration mechanics/C reg numbers/D charity-DGR/E mission-lock+IP/F public copy).
- **10 Investors** (`36eebcf9…8132`): revenue on canon (650,910.79 paid). De-staled the 1-June body (predated 13-June reconciliation): GHL 401->verified 10 Jun; QBE cap unconfirmed->$400K confirmed; capital ask misframed as $112-222K facility capex -> reconciled $900K-$1M blended. Gap rewritten. Commit `c2bb871`.
- **11 Cost Model** (`36febcf9…8146`): VERIFY-ONLY, CLEAN. All cost numbers match canon (684.79/425.74/420.74 = 685/426/421; saving 194; fixed 109,500; capex 110,046/112-222K). QBE framing already correct. No changes.
- **12 Investor Alignment** (`36febcf9…81f5`): registered BOTH populated tools — SIH canonical (8/14, GHL-pulled 16 Jun) + CASE intel (6/10) -> 0->2 🟢. De-staled like Area 10 (GHL, QBE cap, password). Gap rewritten. Commit `0a4d70b`.
- **🔑 PASSWORD SWEEP (curl-verified):** `/investors` password `goods2026` is DEAD (401); live is `OnCountry-E1C4AC` (200, rotated 2026-06-05). Areas 07/08/09/10/12 all carried the dead one -> swept all 5 (Real Links property + body) to OnCountry-E1C4AC. `/impact` gate = a THIRD password (both test values 401) — UNKNOWN, left untouched, flagged for Ben.
- **OPEN FLAGS for Ben:** (a) `/impact` live password unknown — give it or drop /impact from reviewer routes; (b) password now correct but still plaintext in Notion (hygiene); (c) SIH tool shows Snow ~$402,930 (CRM-stage hist.) vs canon ~$493,130 Xero lifetime — reconcile or relabel; (d) Notion 12 page describes the CASE 6/10 tool while SIH 8/14 is canonical — rebuild page to SIH or keep CASE as the diagnostic view (Ben's call, NOT auto-changed).

### This Session (2026-06-16 — AREA WALKTHROUGH, Areas 01-06)
- **01 Vision:** Notion "Pitch Page and Documents" (`373ebcf981cf80748e1ef80e281b8fd6`) consent line split (cleared storyteller voices = canon 6, vs named partners Dianne/Kristy/Boe). `/pitch` edits DEFERRED (Ben: after walkthrough). Vision one-pager BUILT (.pen frame `unN8M`, photo-led); PNG/PDF export BLOCKED (Pencil export tool glitched all session; render via `/pencil-queue`).
- **02 Impact:** re-exported the Snow impact one-pager with 16 washers -> `wiki/outputs/funder-reports/snow/2026-06-16-snow-impact-one-pager.{png,pdf}`; stale 2026-06-10 removed; send-overview repointed.
- **03 Business Model** (Notion "14 Business model" `380ebcf981cf81298affc19a14e14684`): community DIRECT $270.74 was mislabeled as marginal next to factory $425.74 -> fixed to $421 (marginal), contribution ~$479->~$329.
- **04 Financial** ("15 Financial summary" `380ebcf981cf81d4939df9a3abbe23b7`): same $270.74->$421 in §3. Money-in figures LEFT to accountant (standing P0); page handles them honestly.
- **PACK-WIDE $270.74->$421 SWEEP (Ben decided: marginal-consistent).** community MARGINAL = direct $270.74 + ~$150 long-haul freight = ~$421 = canon `marginal-community`. Fixed 9 Notion pack pages (Business Model, Financial summary, 00 master-alignment, 05 impact-method, Strategic Pack overview, 04 Financial Mgmt, 01 strategy memo, 02 one-pager) + repo `wiki/outputs/2026-06-13-goods-strategic-pack/*.md`. Cost Model v6 page kept its precise $420.74 (same number). KEPT $270.74 where it is correctly the DIRECT cost (historical docs + impact-model.ts).
- **05 Strategy & Risk** ("16 Strategic plan" `380ebcf981cf8185b1e6fe34a630a25d`): on-canon. The 14-risk scored register EXISTS (`wiki/articles/governance/risk-register.md`) but was never registered -> tagged to `artifact-register.json` qbeAreas [05,07]; rewrote the stale gap. Scorecard: Area 05 thin->ok, Governance 07 -> 3 artifacts.
- **06 Process & Tech** ("06 - Process & Technology" `36eebcf981cf81659f6afab915672b57`): body said GHL unverified (401, 1 Jun) but properties + reality show GHL verified 10 Jun (16-Jun outreach engine pulled 82 contacts) -> fixed the stale body; narrowed canon gap (GHL resolved; remaining = Drive external-account test + transferable production SOP).

### Side-builds this session (all committed + pushed)
- **/admin/media-library** — ALL 212 local website images + full Empathy Ledger library in one grid; filter by source+subject, search, preview/copy/download (`b6dff72`).
- **Local image subject tagging** (`namespace:value`, EL-consistent) -> `v2/data/local-image-tags.json` + tag editor in the modal.
- **Content-hash dedup** — `scripts/image-dedup.mjs` -> `v2/data/image-dedup.json`; one card per unique image (212->207), NOTHING deleted.
- **`design/image-canon.json`** — REFERENCE-ONLY image index (best image per subject -> QBE areas; never copies). Deleted the 26 `design/canon-images/` copies I had made (the duplication Ben flagged).
- **Vision one-pager** (`unN8M`) committed inside `design/goods-theory-of-change-v2.pen` (.pen now tracked).
- **5 QBE gap illustrations DRAFTED** (areas 05/07/08/09/12) in `generated-images/goods-illustrations/qbe-*` — QA'd clean, NOT promoted to v2/public (await Ben cull). Map: `wiki/outputs/2026-06-16-qbe-gap-illustrations-map.md`.

### Open / Held (this session)
- **EL upload** ("add local photos into EL") HELD — external write to a consent-managed Indigenous storyteller DB; most local images don't belong there; community photos need per-image consent. Ben points at specific photos + confirms consent, then upload.
- **impact-model.ts** carries a stale v5 `$140.74` community figure on live `/impact` (2026-05-30 quarantine doc) — older drift, separate follow-up.
- **Vision one-pager PNG/PDF** export pending (Pencil glitch) — `/pencil-queue`.
- **5 gap illustrations** await Ben's cull + promotion to `v2/public/images/brand/` (then move each from image-canon `gaps` to `images`).
- **`/pitch` page** edits deferred (Area 01).

### Commits this session (all pushed; origin @ 574f635)
- `b6dff72` media-library + subject tagging + content-hash dedup + reference image-canon
- `7035feb` Vision one-pager (.pen) + swap stale snow export for 16-washer 2026-06-16
- `9c7be38` QBE gap-illustration drafts recorded + shot-list
- `4dda752` pack sweep: community cost 270.74 (direct) -> 421 (marginal)
- `9b0e3b1` Area 05 — registered the scored risk register; gap was stale
- `574f635` Area 06 — GHL reauth resolved (verified 10 Jun); narrowed the gap

### Cost nuance to reload (the sweep)
Community DIRECT $270.74 (parity w/ factory direct $275.74) vs community MARGINAL $421 (= +~$150 freight, parity w/ factory marginal $425.74, = canon `marginal-community`). Use MARGINAL ($421) in cost-down ladders; DIRECT ($270.74) only where explicitly labeled direct.

---

## ⌂ PREVIOUS SESSION DETAIL — QBE PACK BUILD (2026-06-16, archived; still-open human-gated items carried forward)
> Carried-forward open items from this previous session (still human-gated): choose canonical washer PRICE (A $4,300/$2-2.5K vs B $4.5-5K/$1-2K); the 5 proofs; accountant signs ONE Goods-only revenue figure (~$907,569 recommended — verify the +$166,458 swing + carve-out scope $741,111 vs $713,827; TFN void+rebook + bank dedup); send the 5 Tier-1 funder letters; drag the deck into Drive; PR #124 NOT merged. Prod is at `560e7d9` (16 washers + Centrecorp 107 LIVE).

### Now
[->] QBE pack is assembled, current, durable; 2 canon fixes (16 washers, Centrecorp 107) are LIVE on prod. Nothing autonomous left — all remaining items are human-gated decisions (see Next + `wiki/outputs/2026-06-16-qbe-pack-decisions-for-ben.md`). On resume, ask Ben what's next. The QBE-readiness one-pager PNG/PDF + the deck's new one-pager frame (`JZAso`) are saved on disk but UNTRACKED.

### This Session (2026-06-16 — QBE PACK BUILD)
- [x] Reviewed Artifact Hub (`378e…0725`) + Opportunity Hub (`380e…d84`) + the 12 diagnostic areas via a 3-agent read-only sweep (handoffs in `thoughts/shared/handoffs/qbe-pack/`, committed). Wrote the build plan `wiki/outputs/2026-06-16-qbe-pack-build-plan.md`.
- [x] **Decisions taken** (Ben, via AskUserQuestion): apply 16 washers now / HOLD revenue at $741,111 publicly / Artifact Hub = the single master / truth pass first.
- [x] TRUTH PASS:
  - **16 washers LIVE on prod** — the fix only ever lived on the unmerged branch `fix/washing-machines-16-in-community` (`2efb178`); cherry-picked it onto the docs branch (`6d5e777`), then merged the standalone **PR #123 → main (`3d74dc5`)**, deploy READY. Verified live: `/about` + `/api/impact-summary` show 16. That branch was merged + deleted. (⚠️ docs branch now carries a duplicate of that diff via `6d5e777`; rebase to drop it when convenient.)
  - **Centrecorp 109→107 LIVE on prod** — fixed on /impact (`b9a296f` on docs branch), then shipped SURGICALLY via a fresh worktree off main → **PR #125 → main (`560e7d9`)**, deploy READY. Did NOT merge the docs branch (keeps PR #124's reconciliation out of prod). `fix/impact-centrecorp-107` merged + deleted, worktree removed.
  - **Notion refreshed:** Artifact Hub spine (washers→16; a revenue-reconciliation-pending note for ~$907,569; a new "Per-area evidence" section mapping all 12 areas to the strategic-pack drafts). Opportunity Hub Flag A corrected ($201,900/$870-943K → ~$907,569/+$166,458).
- [x] Committed the **28-file 2026-06-13 strategic pack** (`855f69a`) — was untracked, would've vanished on a clone. HELD OUT (uncommitted): `19/20` GHL files (real funder emails), binaries (pptx/docx/pdf/xlsx), a `.tmp`, `ghl-investor-import.csv`.
- [x] Refreshed `/sites/qbe-readiness`: fixed community bed cost **$271→$421** (canon.ts:133 marginal-community); verified the rest current (Centrecorp already 107) — `a37516f`, pushed to the docs preview.
- [x] Wrote the decisions-for-Ben brief (`e7116b7`): `wiki/outputs/2026-06-16-qbe-pack-decisions-for-ben.md` (washer price A-vs-B, the 5 proofs, smaller open items).
- [x] PENCIL deck `design/goods-theory-of-change-v2.pen`: found it CONTENT-COMPLETE (18 slides + 3 one-pagers, not the "in build" my notes implied). Aligned facts to canon — Slide 05 washers 28→16, Impact one-pager 14/28→16; both Snow one-pagers already current (16, 107).
- [x] **Built a NEW QBE Readiness One-Pager in Pencil** (frame `JZAso`, below the Snow one-pagers): header + goal band + metrics (496/9/16/$741,111) + 5 proofs + timeline (1 Jul→31 Aug→Sep→Nov) + 12-area scoreboard + footer w/ workpaper caveat. Verified full-res via the PNG. Exported to `wiki/outputs/funder-reports/2026-06-16-qbe-readiness-one-pager.{png,pdf}` (UNTRACKED). 🔑 Pencil **blank-Insert bug persists** — build by COPY; the scoreboard rebuilt from copied text nodes after Insert rendered blank.
- Pre-existing uncommitted working-tree edits (NOT this session's, do not sweep into a commit): `thoughts/shared/handoffs/alignment-engine/current.md`, `v2/.wiki-content/capital/cost-register.md`, `v2/.wiki-content/products/washing-machine.md`, `wiki/canon/*.md`, plus untracked dirs.

### This Session (2026-06-16 late — TFN/Xero verification + Notion enrichment)
- [x] Live read-only Xero check via the act-infra token (`cd ~/Code/act-global-infrastructure && node scripts/refresh-xero-token.mjs`, then GET `/connections` + `Invoices/<id>` with `Xero-Tenant-Id: 786af1ed`). NO write made — OAuth refresh only.
- [x] Resolved both open Xero questions (see Open Questions): void+rebook NOT done → +$144,558 still additive; ACT-GD lives in the Nic Marchesi org `786af1ed`; the ~$84k Nov deposit cluster predates the 28 Nov TFN letter so is probably NOT the TFN cash.
- [x] Added a "Live re-verification (2026-06-16)" section to `03-revenue-reconciliation.md`; committed + pushed `e690ecd`.
- [x] Verified the Notion "Revenue reconciled" page `380ebcf981cf81908ec1f245bdd10a39` is CURRENT (the "still OLD" warnings were stale); cleared them in this handoff + MEMORY.md, bumped HEAD refs. Committed + pushed `76bb3cd`.
- [x] Enriched the Notion page with a "✅ Live re-verification" block (resolves clearances 2 & 3 inline for the accountant).
- [x] Wrote the `tfn-xero-misbooking` memory file (was a dangling link) with the live state + the re-check command.

### Recent work — reconcile pass (2026-06-16 PM)
- [x] Corrected the "$201,900 bucket": it adds **+$166,458, not $201,900**. TFN **+$144,558** (mis-booked as 2 ACCPAY bills → void+rebook + Nov-deposit dedup) · FRRR **+$0** (it IS the VFFF $50K already in the $741,111 canon — double-count) · AMP **+$21,900** (untagged 2024 income, fold in). Recommended figure **~$907,569** (or ~$893,011 at TFN's $130K headline).
- [x] Rewrote `wiki/outputs/2026-06-16-qbe-opportunity-hub/03-revenue-reconciliation.md` (traced bucket table + recommended-figure block + entity precision + provenance).
- [x] Committed `4a2b020` (03 doc + this handoff's Flag A). NOT pushed.
- [x] Corrected MEMORY.md + `goods-qbe-opportunity-hub` memory; cross-linked the already-correct `tfn-xero-misbooking` memory.
- [x] Re-ported + re-fetched-to-verify the Notion "Revenue reconciled" page `380ebcf981cf81908ec1f245bdd10a39`.

### Next (all human-gated unless noted)
- [ ] (Human) Choose the canonical WASHER PRICE: Framing A ($4,300 / $2,000-2,500, committed washing-machine.md, PR #118) vs B ($4,500-5,000 / $1,000-2,000, the LIVE Snow dashboard + an uncommitted edit). Then Claude unifies every surface. Detail: decisions brief §1.
- [ ] (Human) The 5 real-world proofs (each gates the QBE match): signed LOI · approved entity-wording block (keystone, Supply Nation 1 Jul) · 50-bed in-source run · consent-cleared stories · independent-majority board + 12-month role map. Detail: decisions brief §2.
- [ ] (Human/Claude) PR #124 merge decision — the docs branch carries the QBE reconciliation + the refreshed qbe-readiness page + the strategic pack + the Centrecorp/washer duplicate commits; merging ships all of it to prod. (16 washers + Centrecorp 107 are ALREADY live via #123/#125.)
- [ ] (Decision) Commit the one-pager exports (`wiki/outputs/funder-reports/2026-06-16-qbe-readiness-one-pager.{png,pdf}`) + maybe `design/`? Repo tracks funder-report exports; both untracked now.
- [ ] (Optional, Claude on request) Export the full 18-slide deck to PDF/PNG; full visual QA; differentiate the one-pager timeline row from the metrics row.
- [x] Reconcile + live-verification committed & pushed — PR #124 at `76bb3cd` then `e7116b7` (2026-06-16). No further autonomous code/doc task; the rest is human-gated.
- [ ] (Human) Accountant signs ONE figure: verify the +$166,458 swing; do the TFN void+rebook (`wiki/outputs/2026-06-01-tfn-xero-fix-note.md`) + dedup vs the Nov-2025 "Nic Marchesi" deposit cluster; decide carve-out scope ($741,111 all-sources vs $713,827 Goods-only).
- [ ] (Human) Ben personalises + sends the 5 Tier-1 funder letters (`wiki/outputs/2026-06-16-qbe-opportunity-hub/04-funder-letters.md`).
- [ ] (Human) Ben drags the investor deck into Drive bundle `1QEzivSw0jydwByAM8PA3VH8-wMlUG1iX`; then add a direct Notion link on the Strategic-pack page.
- [ ] (Human) Pick the hackathon challenge; raise the two clauses (cl 7.3 IP, cl 5.3 co-invest) with Jay/legal; cost model to Matt by end June.

### Decisions
- The "$201,900 bucket" does NOT add $201,900 — FRRR is the VFFF money already counted (do not add); TFN's cash figure is $144,558, not the $130,000 headline.
- Recommended sign-off figure: **~$907,569** (cash, Goods-attributable), pending the 3 clearances.

### Open Questions
- ✅ RESOLVED (2026-06-16, live read-only Xero via act-infra token): TFN void+rebook **NOT actioned** — both bills still ACCPAY/AUTHORISED ($89,361 `a23c77b7…` + $55,197 `0115a78d…`, tracked "Business Divisions=A Curious Tractor", not ACT-GD), and **no ACCREC income invoice to TFN exists**. ⇒ the +$144,558 add is still genuinely additional; no double-add risk from a prior rebook.
- ✅ RESOLVED (2026-06-16): the ACT-GD ACCREC set lives in the **Nicholas Marchesi sole-trader org** (`786af1ed`) — the only org on this connection. "ACT-GD — Goods" is an ACTIVE "Project Tracking" option there; "A Curious Tractor" is a *Business Divisions* tracking option in the SAME org, not a separate Xero. (A wholly separate ACT Pty Ltd Xero on another login can't be ruled out via this token, but it does not hold ACT-GD.)
- ⏳ STILL OPEN (bank-rec UI only): locate the TFN cash deposit. No $89,361/$55,197/$144,558 deposit is visible via API Nov–Dec 2025; the ~$84k generic-contact cluster the fix-note flagged is **17–24 Nov** ($83,796) and **predates the 28 Nov TFN letter**, so on timing it's probably NOT the TFN money. Find the deposit before recognising +$144,558. Detail: `03-revenue-reconciliation.md` "Live re-verification (2026-06-16)".

---

## Resume prompt (paste into a fresh session)
"Resume the Goods QBE work. Read `thoughts/shared/handoffs/qbe-thursday/current.md` (Ledger first) + memory `goods-qbe-opportunity-hub` + `tfn-xero-misbooking`. The investor-outreach engine, the SIH alignment-tool population, the 5 funder-letter drafts, the full Notion alignment, AND the revenue reconciliation (including the CORRECTED $201,900-bucket trace, 2026-06-16) are all DONE. Branch `docs/snow-onepager-assets` at `e7116b7`, pushed (PR #124 still open, NOT merged). **NEW since: a full QBE PACK BUILD — 16 washers (PR #123 `3d74dc5`) + Centrecorp 107 (PR #125 `560e7d9`) MERGED to main + LIVE on prod; the 2026-06-13 strategic pack committed; `/sites/qbe-readiness` $271→$421 fixed; a QBE readiness one-pager built in Pencil (`JZAso`) + exported to `wiki/outputs/funder-reports/2026-06-16-qbe-readiness-one-pager.{png,pdf}` (untracked); decisions brief `wiki/outputs/2026-06-16-qbe-pack-decisions-for-ben.md`. The pack is assembled/current/durable; remaining = human-gated (washer-price choice, the 5 proofs, accountant figure, PR #124 merge).** The two TFN/Xero open questions were live-verified 2026-06-16 (void+rebook NOT done so +$144,558 is still additive; ACT-GD lives in the Nic Marchesi org `786af1ed`); the Notion 'Revenue reconciled' page is current AND carries those resolutions. Open items are now human-side: (1) accountant signs ONE revenue figure — recommend ~$907,569; first do the TFN void+rebook + bank dedup and decide the carve-out scope; the bucket adds +$166,458 not $201,900, and FRRR must NOT be added (it is the VFFF $50K already counted); (2) Ben sends the 5 Tier-1 funder letters; (3) Ben drags the investor deck into the Drive bundle then add a Notion link; (4) pick the hackathon challenge; (5) raise the two clauses (cl 7.3 IP, cl 5.3 co-invest) with Jay/legal, cost model to Matt by end June."

## Git / deploy state
- Branch `docs/snow-onepager-assets`, HEAD `e7116b7` pushed, **in sync with origin**. New this session (on top of the reconcile commits): `6d5e777` (16-washer cherry-pick) · `b9a296f` (Centrecorp 107) · `855f69a` (strategic pack, durable) · `a37516f` (qbe-readiness $271→$421) · `e7116b7` (decisions brief). **PR #124 still open, NOT merged.**
- **main MOVED to `560e7d9`** — two surgical PRs shipped LIVE to prod this session: **PR #123 `3d74dc5`** (16 washers, branch `fix/washing-machines-16-in-community` merged+deleted) and **PR #125 `560e7d9`** (Centrecorp 109→107, via a throwaway worktree off main; branch merged+deleted). Both deploys READY + verified (`/about`+API show 16; main source shows 107). The docs branch's `6d5e777` is now a duplicate of #123's diff (rebase to drop when convenient).
- **UNTRACKED on disk (survive /clear, lost on a fresh clone):** the one-pager exports `wiki/outputs/funder-reports/2026-06-16-qbe-readiness-one-pager.{png,pdf}`; `design/` (the .pen with the new `JZAso` frame, saved by Pencil); the held-out strategic-pack files (`19/20` GHL, binaries, `.tmp`, csv); plus the pre-existing "not mine" edits noted below.
- 8 commits on the branch: `9249350` (gated `/sites/qbe-readiness`) · `c54e360` (Netlify archive) · `139ebce` (simplify qbe-readiness) · `77fd337` (investor engine: GHL pull + populated alignment tool + Area 12) · `c780f6d` (engine follow-through: SIH tool canonical + populated xlsx + revenue reconciliation + 5 funder-letter drafts) · `089fb33` (reconcile correction: $201,900 bucket → +$166,458, recommended ~$907,569) · `e690ecd` (live-verify the TFN/Xero open questions: void+rebook NOT done, ACT-GD in Nic Marchesi org, dedup cluster predates TFN letter) · `76bb3cd` (handoff bookkeeping: clear stale Notion warning, bump HEAD refs).
- **🚩 Material finance finding — CORRECTED 2026-06-16 (was wrong, now traced):** the "$201,900 bucket" does NOT add $201,900. Traced against live Xero (2026-06-01 fix-note + grant-content.ts:149): **TFN = +$144,558** (not $130K; net of TFN's 10% fee; mis-booked as 2 ACCPAY bills → needs void+rebook + bank dedup) · **FRRR = +$0** (it IS the VFFF $50,000 already in the canon — same "Backing the Future" grant, double-count) · **AMP = +$21,900** (already booked 2024 income, just untagged ACT-GD; fold in). **Corrected swing = +$166,458 → ~$907,569** (or ~$893,011 if TFN at its $130K headline). FRRR must NOT be added. Full corrected trace + recommended figure in `wiki/outputs/2026-06-16-qbe-opportunity-hub/03-revenue-reconciliation.md` (rewritten, now incl. a "Live re-verification (2026-06-16)" section). ✅ Notion "Revenue reconciled" page `380ebcf981cf81908ec1f245bdd10a39` VERIFIED CURRENT 2026-06-16 (re-fetched; carries the corrected +$166,458 / ~$907,569 framing — earlier "still OLD" warnings were stale). Notion now ALSO carries a "✅ Live re-verification (2026-06-16)" block (void+rebook not done; ACT-GD in Nic Marchesi org; dedup cluster predates the TFN letter) — done, no further Notion edit needed.
- Populated SIH xlsx: `~/Downloads/Investor Alignment Tool (2026) - Goods POPULATED.xlsx`. Funder letter drafts: `04-funder-letters.md` (Ben personalises + sends, Tier 3).
- Vercel preview (branch alias, SSO + then `/investors/login` pw `OnCountry-E1C4AC`): `https://goods-on-country-git-docs-snow-7e5e3a-benjamin-knights-projects.vercel.app/sites/qbe-readiness`
- **Vercel is the sole host now.** Netlify disconnected (Ben unlinked the repo; confirmed no Netlify build on `c54e360`). Legacy config archived to `_archive/2026-06-16-netlify-legacy/`. Note: Vercel webhook can lag ~10 min to START a build; check `get_project.latestDeployment`.

## QBE opportunity work (DONE this session)
- **Notion: QBE Opportunity Hub** `380ebcf981cf819cac62f51dd9532e84` (child of Artifact Hub `378ebcf981cf8192a5e5c66b93630725`): opportunity overview, documents, key dates, what we're working on, artifacts, investor-outreach engine, Thursday short-list.
- **Notion: Cost model access page (for Matt)** `380ebcf981cf81ccb3f7c757bea10144` (child of the Hub): all Drive links + tested artifacts.
- **Notion now FULLY SELF-CONTAINED (2026-06-16):** stripped every dead `wiki/outputs/*.md` and `v2/src/...` path from the Hub + cost-model page; ported all deliverables into readable Notion pages. New child pages of the Hub: **Investor alignment populated** `380ebcf981cf814ca724c12a01016467` · **Revenue reconciled** `380ebcf981cf81908ec1f245bdd10a39` · **Funder letters (drafts)** `380ebcf981cf81cfa9d1e21327880348` · **Strategic pack (2026-06-13)** `380ebcf981cf819297d2ed205f0ea84a` + its **20 underlying docs (00–20) as child pages** (ported by 3 parallel agents, 0 failures). Gated live-tool links now carry the password inline (`OnCountry-E1C4AC`, login `/investors/login`). Hub Flag A now carries the TFN/$201,900 finding; §5 Tier 3 marks QLD PFI closed. ⚠️ risk-register + entity-wording child pages hold internal-only material; strip before any external share.
- **Drive: deck NOT yet uploaded** — Ben dragging `Goods-on-Country-Investor-Deck.pptx` (repo `wiki/outputs/2026-06-13-goods-strategic-pack/`) into bundle `1QEzivSw0jydwByAM8PA3VH8-wMlUG1iX` manually (MCP base64 upload too token-heavy: ~430K tokens for the 1.3MB PDF). Combined PDF redundant (content now in Notion child pages). After the drag, add a direct Notion link to the deck on the Strategic pack page.
- **Repo working files (UNTRACKED):** `wiki/outputs/2026-06-16-qbe-opportunity-hub/00-aligned-overview.md` + `01-cost-model-access.md`; grounding extracts `thoughts/shared/handoffs/qbe-thursday/01-program-extract.md`, `02-diagnostic-investor-extract.md`, `03-hackathon-extract.md`.

## Key facts surfaced (grounded from the 7 source docs)
- Cap **$400K / floor $150K**, $1M pool / 10 orgs, at least matched, repayable preferred, not secured until awarded. Apply Sept, outcomes Nov 2026.
- Advisory = **Production Cost Estimates Excel** (Matt leads, Mal QA). Model to Matt **end June**, workshop mid-July, done late July/Aug. **Already provided to Matt; feedback pending.**
- Cost model lives in Drive folder **"Goods - Financial Model & QBE Bundle (2026-05)"** `1QEzivSw0jydwByAM8PA3VH8-wMlUG1iX` (shared anyone-with-link, so Matt has access). Playable sheet `1-w6aJabegE7v3jxq0vGoQxAIlX70S2w182XY-HjRQiQ`. Engine+tests in `v2/src/lib/cost-model/`.
- 🚩 Two Enterprise-Agreement clauses to clear before signing: **cl 7.3** (SIH owns IP in the advisory cost-model) and **cl 5.3** (SIH 3-year co-invest right). Raise with Jay/legal.
- Investor Alignment Tool = **blank SIH template** (8 knockout / 14 fit, no weights). We populate it.
- Money: reconcile to ONE accountant figure. Closest Goods-only = **~$713,827 carve-out** (Artifact Hub canon). Other cuts: $537,595 / $649,710.79 / $650,910.79 / $741,111.
- Hackathon (Aug, ~15 staff): recommend **"The first night with a new bed."**
- Diagnostic V4 weakest: Financial Mgmt (4), Business Model (4); priority areas 2,3,4,5,7.

## OPEN / NEXT (in priority order)
1. ✅ **DONE — Investor-outreach engine (commit `77fd337`):** GHL pull (2 read-only scripts in `v2/scripts/`; 82 funder contacts + 49 funder-pipeline relationships w/ stage; raw in `v2/tmp/*.json` gitignored) + ACT-ecosystem repayable-prospect search → populated SIH tool warmest-first in `wiki/outputs/2026-06-16-qbe-opportunity-hub/02-investor-alignment.md`. Notion Hub §5 + qbe-readiness Area 12 updated. **Warmest-first lead set: Snow, SEFA (repayable, highest match value), Centrecorp, Minderoo, VFFF.**
2. ✅ **DONE — qbe-readiness:** the "6 knockout + 10 weighted" text was ALREADY gone (removed in 139ebce); the handoff misread it. Enriched Area 12 to "Populated / 8 knockout, 14 fit". ⚠️ **Note:** `v2/.wiki-content/investors/` is a DIFFERENT, older tool (CASE Smart Impact Capital, 6 knockout/10 weighted, Beck Parkinson's, already scored) — not the SIH 2026 tool. Left it alone. Ben to decide: maintain both or retire one.
3. **Before Thursday (human):** pick the hackathon challenge; agree the cost-model-timeline line; flag the two clauses to Jay/legal; accountant on the one revenue figure.
4. ✅ **DONE this turn (commit `c780f6d` + Notion port):** SIH xlsx populated (`~/Downloads/...POPULATED.xlsx`, 12 investors, Tier-1 Snow/SEFA/Centrecorp pass 7/7 14/14; FAC+IBA fail knockout on TIMING only); QLD PFI confirmed CLOSED for 2026; 5 Tier-1 funder-letter drafts written; CASE-vs-SIH decided (SIH canonical, CASE cards kept as intel). **Remaining engine work (human):** Ben personalises + sends the 5 letters (Tier 3); re-run the read-only GHL scripts monthly; optionally populate xlsx Tab 2 (CRM log).
5. Optional: tighten Drive bundle sharing from "anyone with link" to named people. Also: after Ben drags the deck into Drive, add a direct Notion link to it on the Strategic pack page (`380ebcf981cf819297d2ed205f0ea84a`).

## Decisions still Ben's (do not auto-change)
- Money figure on the qbe-readiness page: kept conservative ~$650K workpaper vs canon $741,111 vs carve-out $713,827. Ben to decide which basis.
- Whether the QBE Opportunity Hub / cost-model page should also be tightened for sharing.
