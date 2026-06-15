# QBE Thursday + branch work: STATE AT /clear (2026-06-16)

Resume anchor for a fresh session. Cross-ref: memory `goods-qbe-opportunity-hub.md`, `goods-deploy-vercel-netlify.md`, `tfn-xero-misbooking.md`.

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-06-16T23:35:00+10:00
**Goal:** Land ONE accountant-signed Goods revenue figure for QBE Stage 2 and close out the QBE opportunity hub. The reconciliation analysis is DONE; remaining steps are human (sign-off, send letters, deck-to-Drive, hackathon pick, two clauses).
**Branch:** `docs/snow-onepager-assets` at `4a2b020` — 1 commit AHEAD of origin (UNPUSHED). PR #124 open, NOT merged, prod untouched.
**Test:** `cd v2 && npm run build` · `npm run check:drift:ci`

### Now
[->] Hand the corrected reconciliation to the accountant — recommended figure ~$907,569; the one genuinely open verification is the TFN bank dedup.

### This Session (2026-06-16 PM — reconcile pass)
- [x] Corrected the "$201,900 bucket": it adds **+$166,458, not $201,900**. TFN **+$144,558** (mis-booked as 2 ACCPAY bills → void+rebook + Nov-deposit dedup) · FRRR **+$0** (it IS the VFFF $50K already in the $741,111 canon — double-count) · AMP **+$21,900** (untagged 2024 income, fold in). Recommended figure **~$907,569** (or ~$893,011 at TFN's $130K headline).
- [x] Rewrote `wiki/outputs/2026-06-16-qbe-opportunity-hub/03-revenue-reconciliation.md` (traced bucket table + recommended-figure block + entity precision + provenance).
- [x] Committed `4a2b020` (03 doc + this handoff's Flag A). NOT pushed.
- [x] Corrected MEMORY.md + `goods-qbe-opportunity-hub` memory; cross-linked the already-correct `tfn-xero-misbooking` memory.
- [x] Re-ported + re-fetched-to-verify the Notion "Revenue reconciled" page `380ebcf981cf81908ec1f245bdd10a39`.

### Next
- [ ] (Optional, Tier 2) `git push` → updates PR #124 with `4a2b020`.
- [ ] (Human) Accountant signs ONE figure: verify the +$166,458 swing; do the TFN void+rebook (`wiki/outputs/2026-06-01-tfn-xero-fix-note.md`) + dedup vs the Nov-2025 "Nic Marchesi" deposit cluster; decide carve-out scope ($741,111 all-sources vs $713,827 Goods-only).
- [ ] (Human) Ben personalises + sends the 5 Tier-1 funder letters (`wiki/outputs/2026-06-16-qbe-opportunity-hub/04-funder-letters.md`).
- [ ] (Human) Ben drags the investor deck into Drive bundle `1QEzivSw0jydwByAM8PA3VH8-wMlUG1iX`; then add a direct Notion link on the Strategic-pack page.
- [ ] (Human) Pick the hackathon challenge; raise the two clauses (cl 7.3 IP, cl 5.3 co-invest) with Jay/legal; cost model to Matt by end June.

### Decisions
- The "$201,900 bucket" does NOT add $201,900 — FRRR is the VFFF money already counted (do not add); TFN's cash figure is $144,558, not the $130,000 headline.
- Recommended sign-off figure: **~$907,569** (cash, Goods-attributable), pending the 3 clearances.

### Open Questions
- UNCONFIRMED: has the TFN void+rebook been actioned in Xero since 2026-06-03? If yes, TFN is already in the ACCREC set — do not double-add. (Needs a live Xero check via the act-infra token method; the read-only MCP can't isolate ACT-GD.)
- UNCONFIRMED: which Xero org holds the ACT-GD ACCREC set the $741,111 was built from — Nic Marchesi sole-trader `786af1ed` (where the TFN bills sit) vs A Curious Tractor Pty Ltd?

---

## Resume prompt (paste into a fresh session)
"Resume the Goods QBE work. Read `thoughts/shared/handoffs/qbe-thursday/current.md` (Ledger first) + memory `goods-qbe-opportunity-hub` + `tfn-xero-misbooking`. The investor-outreach engine, the SIH alignment-tool population, the 5 funder-letter drafts, the full Notion alignment, AND the revenue reconciliation (including the CORRECTED $201,900-bucket trace, 2026-06-16) are all DONE. Branch `docs/snow-onepager-assets` at `4a2b020` — 1 commit ahead of origin (UNPUSHED), PR #124 open, NOT merged, prod untouched. Open items are human-side: (1) accountant signs ONE revenue figure — recommend ~$907,569; first do the TFN void+rebook + bank dedup and decide the carve-out scope; the bucket adds +$166,458 not $201,900, and FRRR must NOT be added (it is the VFFF $50K already counted); (2) Ben sends the 5 Tier-1 funder letters; (3) Ben drags the investor deck into the Drive bundle then add a Notion link; (4) pick the hackathon challenge; (5) raise the two clauses (cl 7.3 IP, cl 5.3 co-invest) with Jay/legal, cost model to Matt by end June. Optional Tier-2: push 4a2b020 to update PR #124."

## Git / deploy state
- Branch `docs/snow-onepager-assets`, HEAD `4a2b020` (= `c780f6d` + the 2026-06-16 reconcile-correction commit). **1 commit AHEAD of origin — UNPUSHED.** **NOT merged to main. Prod untouched.** PR #124 open.
- 6 commits on the branch: `9249350` (gated `/sites/qbe-readiness`) · `c54e360` (Netlify archive) · `139ebce` (simplify qbe-readiness) · `77fd337` (investor engine: GHL pull + populated alignment tool + Area 12) · `c780f6d` (engine follow-through: SIH tool canonical + populated xlsx + revenue reconciliation + 5 funder-letter drafts) · `4a2b020` (reconcile correction: $201,900 bucket → +$166,458, recommended ~$907,569).
- **🚩 Material finance finding — CORRECTED 2026-06-16 (was wrong, now traced):** the "$201,900 bucket" does NOT add $201,900. Traced against live Xero (2026-06-01 fix-note + grant-content.ts:149): **TFN = +$144,558** (not $130K; net of TFN's 10% fee; mis-booked as 2 ACCPAY bills → needs void+rebook + bank dedup) · **FRRR = +$0** (it IS the VFFF $50,000 already in the canon — same "Backing the Future" grant, double-count) · **AMP = +$21,900** (already booked 2024 income, just untagged ACT-GD; fold in). **Corrected swing = +$166,458 → ~$907,569** (or ~$893,011 if TFN at its $130K headline). FRRR must NOT be added. Full corrected trace + recommended figure in `wiki/outputs/2026-06-16-qbe-opportunity-hub/03-revenue-reconciliation.md` (rewritten). ⚠️ Notion "Revenue reconciled" page `380ebcf981cf81908ec1f245bdd10a39` still carries the OLD framing — re-port before any external share.
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
