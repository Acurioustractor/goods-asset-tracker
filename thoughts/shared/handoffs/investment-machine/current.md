---
date: 2026-07-03T06:30:00+09:30
session_name: investment-machine
branch: docs/snow-onepager-assets
status: active
---

# Work Stream: investment-machine

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-07-03 (end of pipeline-strategy session, saved for /clear)
**Goal:** Signed match-eligible capital toward the $400K QBE match (due 31 Aug). Next phase (Ben's words): full review of current Claude Design assets, build ALL the PDFs and live pages needed for sharing, then review all photos and add more.
**Branch:** docs/snow-onepager-assets (everything PUSHED through `8e85184`)
**Test:** `cd v2 && npm run build && npm run check:drift`

### Now
[->] NEXT PHASE, three steps in order: (1) full audit of the Claude Design project "Goods on Country — Investor Materials" (`b333c5aa-2dfa-4043-ab5f-ef7460692623`) — what exists, what renders, what is stale vs the $475K/$300K figures, incl. the UNVERIFIED 52-file Colors/Components/Spacing/Type/UI-Kit-Web batch from 2026-07-01; (2) build every share-ready PDF + live page the artifact map needs (strategy doc section 6 = the ask-to-artifact map; render.sh bakes PDF+PNG; --live-stages works again); (3) review ALL photos (canon 16/40 slots set, 4 RED consent-gated; untracked new photos sit in `design/deck-assets/` and `design/_image-originals/`) and add more to the design project.

### This Session (2026-07-03 — pipeline strategy, reconciliation, decisions applied)
- [x] Five-bucket reconciliation of all 63 open Supporter Journey rows: `wiki/outputs/2026-07-03-pipeline-strategy.md` (strategy, artifact map, live-pull corrections in 3.5).
- [x] Notion APPLIED by Ben: Funder Pipeline DB = 33 rows (QBE priority 13 + Workbench 20), Bucket field live, 9 register mirrors + 5 qualify-ins created, dashboard block posted. Register containment restored.
- [x] GHL token fixed (fresh pit-2342 in v2/.env.local); machine scripts live; landscape one-pager re-rendered with 7 live stage pills.
- [x] DECISIONS APPLIED: SEFA = $300,000 everywhere (register, GHL, email + brief PDF re-rendered, all design surfaces; lead stack $475K). Minderoo ask confirmed real (Ask made everywhere, push to written LOI).
- [x] 5 preview cards pushed to Claude Design (funder-pipeline board, capital stack, onepager, teaser); strategy doc registered in artifact-register.json (46 artifacts, drift green).
- [x] All pushed: `98c22ed`..`8e85184`.

### Next
- [ ] Claude Design full asset review (step 1 above) — start with DesignSync list_files + the artifact map in strategy doc section 6; verify the 52-file 2026-07-01 batch renders before trusting it.
- [ ] Build the share set: PDFs via `design/brand/kit/render.sh` + live pages; every artifact carries the credit line + as-at date + canon figures ($475K stack, $300K SEFA, $713,827 revenue, 496/9/16/2,660kg).
- [ ] Photo pass: canon slots (24 empty, 4 RED consent-gated need Ben's picks), triage `design/deck-assets/` + `design/_image-originals/` (untracked), push keepers to the design project assets/.
- [ ] (Ben, gated) The 5 sends — SEFA first ($300K docs ready); Katie Norman confirm by 10 Jul; Notion trash decision.
- [ ] Machine build-next: bucket tags in `ghl-people-pull`, containment-check on Monday one-pager, Bucket-aware `funder-artifact-match` (strategy doc section 8).

### Decisions
- **2026-07-03 (Ben): SEFA = $300,000.** Applied to register, GHL, send docs (email + brief PDF re-rendered), all design surfaces. Lead stack now $475K (SEFA $300K + Snow $100K + Centrecorp $75K).
- **2026-07-03 (Ben): Minderoo ask is real.** Ask made stands everywhere; pipeline DB corrected; next push = written LOI so it counts as match.
- Quote $713,827 externally (accountant-signed carve-out) until Ben + accountant resolve the ~$907,569 reconciliation.
- Xero wins on conflicts (Snow corrected to $493,130).

### Open Questions
- UNCONFIRMED: which audiences the "share set" must cover beyond funders (SIH/Jay pack? QBE hackathon? buyers?) — confirm with Ben before building new pages.
- UNCONFIRMED: whether any of the 5 sends went out yet.
- UNCONFIRMED: whether the 52-file design-system batch (2026-07-01) renders in Claude Design — verify before the old project (`a24f62c8`) is deleted.
- Consent gate stands: only the 32 cleared voices in anything funder-facing; 4 RED canon slots need Ben to name picks.

---

## Context
<!-- Original handoff content follows -->

# Investment machine: review + blueprint (2026-07-02)

## What this is
Full ultracode review (32 agents) of the QBE Start Here Notion tree, the Claude Design setup, the web surfaces, and the live GHL pipeline, plus a verified scout sweep for new impact investors, synthesized into an operating blueprint for the GHL + Notion investment machine.

## Deliverables (all committed-ready, local)
- `wiki/outputs/2026-07-02-investment-machine/01-notion-and-design-review.md` — slice-by-slice review, canon contradiction table (8 rows), ranked gap list (10).
- `wiki/outputs/2026-07-02-investment-machine/02-investor-targets.md` — Tier A actives with next moves, Tier B four adversarially verified new candidates (LendForGood, Metro Finance, CommBank Green, Tripple) + 5 lighter-checked leads, Tier C 12 rejected with reasons. Every new claim carries its URL.
- `wiki/outputs/2026-07-02-investment-machine/03-machine-blueprint.md` — six-stage funnel on existing GHL stages, entry-point wiring, artifact-per-stage matrix, Monday-machine/Tuesday-Ben cadence, staged GHL/Notion writes checklist, 10 leading indicators, build-next list.

## Load-bearing findings
1. **Most of the Notion operating tree carries a deleted flag**: operating plan, populated alignment tool, Tier-1 letters, Strategic pack, cost-model page, Artifact Hub, Artifact Register DB. Content was readable from snapshots but live links are dead. Only the two databases (QBE Opportunity Register 11 rows, Funder Pipeline 15 rows) and Area pages like 02 are live. Possibly the 2026-05-08 cascade-archive bug or accidental trash; Ben must restore or declare the DBs + repo canonical.
2. **$0 signed against $400K due 31 Aug.** SEFA send is 12 days late against a 2-4 month credit clock. The 28 Jun planned sends never executed (SEFA still Cultivating, 6 stalled asks untouched, 22 Identified untriaged, Snow duplicated).
3. **Revenue contradiction**: $713,827 signed vs ~$907,569 recommended by the (deleted) revenue-reconciled note (TFN $144,558 + AMP Spark $21,900). Never adopted/rejected. Quote $713,827 externally until Ben + accountant decide.
4. **SEFA target mismatch**: $250K (register + deck) vs $300K (Funder Pipeline + qbe-readiness page). One figure before the send.
5. **Design kit is the strongest layer** (16-slide CANON-tokenized deck, fresh 1 Jul renders) but all dollar figures are hand-typed and the 3 live design artifacts are missing from artifact-register.json, so Loop B can't see them.
6. **No web surface captures into GHL**; commitment stage has no surface at all.

## New investors (verified, NOT yet in GHL — staged writes need Ben)
- LendForGood: crowd-lent repayable, $40-150K, SIH is a named intermediary, signable by 31 Aug. First move: one line to Jay asking if SIH will originate.
- Metro Finance MetroEco: broker asset finance $10K-1M, 2-6 weeks to paper, no gate.
- CommBank Green Equipment Finance: $20K+, 0.5% green discount, needs credit package + which-ABN answer.
- Tripple (Milgrom): direct impact loans, Ngutu College precedent, post-QBE, ask Snow for the intro.

## Staged writes: APPLIED 2026-07-02 with Ben's approval (commit `72507f1`; NO emails sent)
Applied via `v2/scripts/ghl-staged-writes-20260702.mjs` (dry-run shown first, then --commit):
- GHL: LendForGood (Cultivating $100K, contact `Nuan5jdJAbEH32SjOpvF`, opp `UNgZ0ZRcYcEk4uLXNBla`), Metro Finance (Qualified $60K, `b3n50TPZP2vrSJ1M6o2X`/`7fQ9ggCQZXXDgVO1NGJC`), CommBank (Identified), Tripple (Identified), Sea Swift + INPEX (partner rows). Snow historic row renamed "Snow Foundation — historical funding (Xero-reconciled)", moved to Renewing, value corrected $402,930 → $493,130 (Xero wins, review call #5). Centrecorp $123,332 historical row recreated at Renewing. 22 Identified triaged: needs-followup on Sally Knox, John Chambers, IMB, East Arnhem, NAACT; monitor on the rest. Tag-family gap report generated (report-only; most pre-existing rows missing Class/Type/Signal).
- Notion: 4 Funder Pipeline rows created; 2 QBE register rows (LendForGood `390ebcf981cf81a298e7f10e0979c529` Tier 1, Metro `390ebcf981cf81d5b100f018cc15dd77` Tier 2; both due 2026-07-18, Match Eligible TBC, full GHL ids); Owner=Ben set on FRRR/SEDI/Sisters/Clean Energy/ANZ rows (FRRR + SEDI have no published close dates so Due Date left empty); **Machine Dashboard page created in the data room: `390ebcf981cf8158ad49eb0461538324`** (under front door `38cebcf981cf8105a322dbc988a373dd`).
- Local: register-status seed list extended to 13 rows; Monday page regenerated post-writes.

## Still gated on Ben (send-dependent or a decision)
- The 5 sends (SEFA loan brief, Jay rules email incl. LendForGood question, White Box EOI, Snow repayable reframe + Tripple intro ask, Metro broker enquiry). NO emails have been sent.
- SEFA stage move (happens ON SEND) + the $250K vs $300K figure call (then sync GHL/Notion/readiness page together).
- Minderoo: verify whether a real ask went out; if not, move back to Cultivating (left untouched, cannot verify the negative).
- Six stalled asks: nudge-then-mark-lost starts with a send, so untouched.
- Values for rows with no sourced figure (First Nations Finance, CEFC/NAB, Invest NT, the five valueless Ask-made rows).
- The Notion trash decision (restore the operating-plan tree or declare the DBs + repo canonical).

## Tier 1 builds: DONE 2026-07-02 (commit `765d396`, local, not pushed)
All seven built, reviewer-audited (1 should-fix + 5 nits found and fixed), gates green (v2 `npm run build` + `npm run check:drift`):
1. `ghl-people-pull.mjs`: all 13 real pipelines (funder, grants, buyer, demand, tractor, empathy-ledger, harvest-inbox, harvest-members, donors, shop, inquiry, contained-adelaide, contained), `--pipeline all`, `--json`, exit 1 on unknown key or bad `--stale`. No "partner" pipeline exists in GHL; closest are demand + tractor. NOTE: `ghl-people-move.mjs` still has the old single-pipeline map (not touched).
2. `monday-onepager.mjs`: writes `wiki/outputs/monday/<date>-monday.md`; first page generated ("Signed $0 of $400,000, 8.6 weeks to 31 Aug 2026"). Indicators 5 and 9 have no machine source (honest "no data"); ages are updatedAt floors only.
3. `commitment-register-status.mjs`: GET-only Notion read of the QBE Opportunity Register; indicator 1. Caveats: token currently borrowed from `act-global-infrastructure/.env.local` (stderr note added; add NOTION_TOKEN to `v2/.env.local` to self-contain) and rows come from a fixed 11-page-id seed list as at 2026-07-02 because the Notion row-query endpoint is POST. New register rows need a seed-list update.
4. Number-token bake: `CANON:num:<id>` tokens in deck (18) + funder one-pager (5), resolved by `canon-render.mjs` from `design/canon-numbers.json`, generated/checked against canon.ts by `canon-numbers.mjs --check` (wired into render.sh). Acceptance test passed: bake is a byte-identical no-op on current figures. Non-canon figures ($400K ask, $425K stack legs, break-even, product specs) deliberately left hand-typed; they have no canon.ts ids yet.
5. `landscape-stages.mjs`: `render.sh --live-stages` bakes live GHL stage pills + as-at stamp into the landscape one-pager. Honest side effect: VFFF now shows Cultivating where the hand-typed pill said Qualified. Snow disambiguated by nameHint "first-mover".
6. `04-new-outreach-drafts.md`: LendForGood question to Jay, Metro broker enquiry ([broker name] placeholder, which-ABN call first), Tripple intro ask to Snow.
7. Register entries: deck + both one-pagers in `artifact-register.json` with citesCanon; Loop B green. render.sh now hard-fails on unresolved CANON:num:/GHL:stage: tokens.

## Workflow provenance
Run wf_8d66a7aa-d46 (task w57eo17br), 32 agents, ~2.1M subagent tokens, 2026-07-02. Script: session workflows dir, `goods-investment-machine-wf_8d66a7aa-d46.js`. Full raw output: session tasks dir `w57eo17br.output`. Note: `args.today` evaluated as undefined inside the workflow script, so the synthesis agent wrote to `undefined-investment-machine/`; directory renamed to `2026-07-02-investment-machine/` and contents verified clean (no stray "undefined", zero em dashes). Lesson for next workflow: hardcode the date into the script literal instead of relying on args passthrough.
