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

## Staged for Ben's approval (NONE executed)
- GHL: 4 new contacts/opps, Minderoo stage correction, Snow dedupe, values on 8 valueless rows, 6 stalled-ask nudges, 22-Identified triage. Apply via `ghl-people-move.mjs` dry-run first.
- Notion: 4 Funder Pipeline rows, 2 register rows, fill null Owners/Due Dates, one Machine Dashboard page, resolve the trash state.
- Sends (founder voice, one sitting): SEFA loan brief, Jay rules email, White Box SELF EOI, Snow repayable reframe, LendForGood question.

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
