# Provenance: GOC data & figures pack

**Assembled:** 2026-07-23. All AUD ex-GST unless noted.

## Primary sources

| Source | Used for |
|---|---|
| Live assets register, Supabase project `cwsyhpiuepvdjtxaozwf`, status=deployed, queried 2026-07-19 | Section A (all deployment counts), reconciled by Ben rulings 2026-07-19/21 |
| `v2/src/lib/data/asset-canonical.ts` (`CANONICAL_ASSETS`) | Section A totals; washer per-community map |
| `wiki/investor/10-community-counts.md` | Section A per-community breakdown |
| `matt-document-bundle/01-bill-of-materials.md` (as-of 2026-05-28, invoice OCR) | Section B (BOM) |
| `matt-document-bundle/03-cost-model-and-build-paths.md` (v6, 2026-05-30) | Sections C, D, E central capex |
| `matt-document-bundle/04-verified-financials.md` (Xero cross-check 2026-05-29) | Section H, I, J |
| `wiki/outputs/2026-07-22-full-cost-figures-for-modelling.md` | Sections C, D, F, G cross-check |
| `wiki/outputs/2026-07-22-minimal-viable-facility-model.md` (connected sole-trader Xero, bill-level 2026-07-22) | Section E1 (sunk ~$75K / replication ~$90-123K) |
| `wiki/outputs/2026-07-22-community-facility-operating-model.md` (Oonchiumpa DEWR app) | Section G |
| `GOC Bed Unit-Costing Model v2.xlsx` (Matt, 2026-07-22) | Section E2 (container capex research) |
| Funding pipeline refresh 2026-07-23; `memory/MEMORY.md` current canon | Section H revenue ($741,111 / $713,827 / $143K AR), Section I signed capital = $0 |

## Known caveats carried into the pack

1. **Revenue figures evolved.** The 04-doc (2026-05-29) showed $732,210.79 billed / $649,710.79 received. Current canon is the accountant-signed Goods-only carve-out **$713,827** plus $143K AR. Section H uses the current canon for the externally-quotable figure and the 2026-05-29 pull for the cash-received and expense signals. Both are labelled.
2. **The Factory path is proven, not modelled from zero.** 40 Stretch beds (Maningrida, INV-0303) were made in-house end-to-end at the farm production facility (legs shredded, hot-pressed, CNC-routed, assembled), per Ben ruling 2026-07-23. The per-bed cost stays "modelled" only until the run's measured actuals (time/diesel/plastic yield) are captured. The on-country community-owned path (remote, community labour, free feedstock) is genuinely future. The earlier "zero beds pressed in-house" claim in the session-8 finance docs was wrong and contradicted the minimal-viable-facility doc's own "it presses beds today"; corrected across this pack and the upstream docs.
3. **Capex is modelled midpoints / desktop estimates, not firm quotes.** Container-capex lines carry Matt's per-line confidence labels (web-sourced / derived / allowance / user input).
4. **The shredder ($19,800) and 40ft container have no record in the connected Xero.** Physically confirmed, invoice to locate. Flagged in Section E1 and Section K.
5. **Community-facility block (Section G) is derived** from DEWR application budget lines; the manager-scaling and trainer-split are stated assumptions, not quoted figures.
6. **The BOM doc (2026-05-28) still describes legs as "click onto the poles."** Current product truth is the X-trestle tension design (canvas structural), per CLAUDE.md. Does not change any cost figure; noted so the description is corrected before investor copy.
7. **Washers:** 22 is Ben's 2026-07-21 per-community ruling. The live register still returns 32 deployed rows (10 stale awaiting restatus to retired), so 22 is not yet query-reproducible and is reported as a known gap by `check-asset-drift.mjs`.
