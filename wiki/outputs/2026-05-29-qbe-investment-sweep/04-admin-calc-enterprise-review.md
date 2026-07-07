# Goods Admin Calculation Integration: Enterprise-Readiness Review + Fix Plan (2026-05-29)

Scope: financial and operational calculation surfaces across the Goods on Country admin site (Next.js 16 / React 19 / TypeScript) plus the lib/data and lib/funders modules they consume. Findings below were verified by reading the cited files directly and re-deriving the load-bearing numbers, not by trusting the phase-1 reviews alone. Where I re-checked a claim and it differs from the phase-1 text, I say so.

---

## 1. VERDICT

The admin calculation integration is NOT enterprise-ready. The math inside each individual model is mostly correct (the cost-model engine reconciles to the cent against the locked canonical numbers, and within-component arithmetic is sound), but there is no single source of truth for any shared financial or operational number. The same metric resolves to different values on different pages, two of those values render 3.2x apart on one screen, a funder-facing resolver overstates money raised by 6.75x using live data I queried, and a reachable RangeError can print a crash marker into a funder document.

### Scorecard

| Surface | Readiness (1-5) | Top gap |
|---|---|---|
| Cost-model explorer (`/admin/cost-model`) | 3 | Imports nothing from the data layer; ~30 DEFAULTS + every constant inline-duplicated from the JSON. Two breakeven cells can render negative. |
| Production COGS + KPIs (`/admin/production`) | 2 | Two cost models on one page disagree 3.2x ($600/20% card directly above the $1,653-$1,912 canonical grid). Batch COGS uses inline `750` and is applied to Basket beds. |
| Xero reconciliation (`/admin/xero-reconciliation`) | 1 | Titled "Xero reconciliation" but never reads Xero. Reconstructs status/amount by regex-scraping CRM `notes`. Renders notes-tagged items as collectable "Overdue" debt (forbidden overclaim). |
| Trip-receipts economics (`/admin/trip-receipts`) | 2 | Asserts the retired "$86k personal accounts / never made ACCPAY" claim as fact; overlapping windows double-count invoices; no per-bed cost. |
| Funder report generation (`/admin/reports` + `lib/funders/*`) | 2 | `xeroDrawnAud` omits the void filter every other script applies → 6.75x overstatement live-verified for Centrecorp. Static config "paid" conflicts with live block in the same document. Progress-bar RangeError. |
| Impact model + `/impact` (public) | 2 | A second divergent cost model ($550/bed) rendered publicly; broken single-quote string interpolation ships `${...}` text to users; govt-savings uses a $250K figure the same file declares wrong. |

### Honest bottom line

The plumbing is good (live reads, error isolation via inline `[METRIC ERROR]` markers, mostly-graceful empty states, strong provenance labelling in `supplier-quotes.ts` and the cost-model explorer) but the financial output is not trustworthy in front of an accountant or investor, because the same number is computed in up to four places from four substrates and they disagree. The single highest-severity issue is live-confirmed: generating a Centrecorp funder report today prints "$832,832 raised" because the Xero resolver sums voided/deleted invoices, when the correct figure is $123,332. Fix the single-source-of-truth root cause (collapse to one canonical lib per metric + status-filter Xero + guard the pure functions) and the rest of the P0s collapse with it.

---

## 2. SINGLE-SOURCE-OF-TRUTH MAP

This is the highest-leverage section. Every row is a metric computed in more than one place, the values found, and the ONE home it should use.

### Cost per bed / COGS (computed FOUR incompatible ways)

| Where | Value(s) | Verified |
|---|---|---|
| `impact-model.ts:138-157` `PRODUCTION_COST_BREAKDOWN` → `TOTAL_COST_PER_BED` | **$550** (CNC 120 + materials 180 + freight 75 + ...) | `TOTAL_COST_PER_BED` feeds metric `current` (`:326`) and `FINANCIAL_SUMMARY.currentCostPerUnit` (`:487`); rendered on public `/impact` |
| `supplier-quotes.ts:247` `fullyLoadedCostPerBed` | **$600** (admits at `cost-model-scenarios.ts:124-127` it maps to no build state) | Confirmed |
| `cost-model-scenarios.json` `margin_grid_at_750_retail` | direct Buy-Kit **534.79** / Panels 584.07 / Factory **275.74** / Community 140.74 | Confirmed, reconciles to locked numbers |
| `cost-model-scenarios.json:156` `fully_loaded_grid` (today/100-yr) | fully-loaded Factory **$1,653** / Buy-Kit **$1,912** | Confirmed |

These do not agree, and the $600 (production page) and $1,653-$1,912 (scenarios card) render on the same scrollable `/admin/production` page. **Canonical home:** `cost-model-scenarios.json` (via `cost-model-scenarios.ts` helpers) for build-path direct + fully-loaded grid; `supplier-quotes.ts` for the materials BOM ($469.79). Delete `PRODUCTION_COST_BREAKDOWN`/`TOTAL_COST_PER_BED`. Reconcile `fullyLoadedCostPerBed=$600` to a named build-state/volume tier or retire it.

### Website / institutional price

| Where | Value |
|---|---|
| `supplier-quotes.ts:181` `WEBSITE_PRICE` (the canonical export) | 750 |
| `production/page.tsx:184` | inline literal `750` |
| `cost-per-batch-card.tsx:6` | local re-declared `const WEBSITE_PRICE = 750` |

**Canonical home:** import `WEBSITE_PRICE` from `supplier-quotes.ts` everywhere; delete the inline `750` and the local re-declaration.

### Deployed-bed count (THREE static values, none matching locked ~496 or the live count)

| Where | Sum |
|---|---|
| `compendium.ts:333-348` `deployments` (`getDeploymentTotals`) | 493 |
| `content.ts` `communityPartnerships` | 471 |
| `content.ts` `communityLocations` (re-summed in `communities/page.tsx:13`) | 419 |
| Locked canonical / live Supabase register | ~496 |

**Canonical home:** one typed deployment array reconciled to ~496, with `communityPartnerships`/`communityLocations` deriving their bed counts from it (or all three calling one `getDeploymentTotals()`); the live `/impact` register stays authoritative and these are the labelled static fallback. Add a build-time assertion that the three sums match.

### Revenue / financial snapshot

| Where | Value | Locked |
|---|---|---|
| `compendium.ts:309` `financialSnapshot.tradeRevenue` | 239,273 | received 649,710.79 |
| `compendium.ts:312` `outstandingReceivables` | 513,148 | AR 82,500 |
| `compendium.ts:289-294` `getFundingSummary().received` → `FINANCIAL_SUMMARY.totalInvestment` → denominator of public `impactPerDollar` | ~445,685 | n/a |
| `impact-model.ts:335-343` `revenue` metric `current` | 61,449 (commercial only) vs target `year1` 1,100,000 — inline comment says "CONFIRM BASIS" | basis mismatch |

**Canonical home:** a single `verifiedFinancials` constant carrying billed 732,210.79 / received 649,710.79 / AR 82,500 / expenses 309,126 / capex 110,046 / surplus-before-founder 340,585, with a `verified — not audited` provenance flag and `lastUpdated`. Point `FINANCIAL_SUMMARY`, `impactPerDollar`, and the revenue metric at it; pick ONE revenue basis to match the $1.1M target.

### Centrecorp "paid" (can print THREE values, two in one document)

| Where | Value |
|---|---|
| `configs/centrecorp.ts:19` `paidToDateAud` (static, → financials-at-a-glance) | 208,000 |
| `metrics.ts:100-119` `xeroDrawnAud` (live, today, void bug) | 832,832 raised / 123,332 paid |
| Correct excluding-voided (live-verified) | 123,332 raised / 123,332 paid |

The static $208,000 and the live block render in the SAME report. **Canonical home:** one status-filtered Xero resolver drives both; static config figures become labelled fallback only, updated to 123,332 / 0. Snow has the same class of issue (`configs/snow.ts:25-27`, hardcoded 275,000 / 434,500 with a self-incriminating "(2 missing)" comment).

### Capital ask

| Where | Value |
|---|---|
| Explorer DEFAULTS + JSON `total_low/high` (`:187-188`) | 112,000 / 222,000 GROSS |
| JSON `_capital_ask_low/high` (`:191-192`) + `qbe_pitch_inputs.capital_ask_*` (`:196-197`) | 90,000 / 200,000 — the figures the explorer's own comment calls "was forbidden" |

**Canonical home:** the JSON GROSS 112,000 / 222,000 (net ~1,954 / ~111,954 after the 110,046 already invested). Update `qbe_pitch_inputs` and remove/correct `_capital_ask_*`.

### Plastic per bed

| Where | Value |
|---|---|
| `products.ts` / `CLAUDE.md` (canonical) | 20 kg HDPE |
| `metrics.ts:58` `plasticKgTransferred` | inline `beds * 20` |
| `impact-fetcher.ts:145` | inline `× 20` |
| `compendium.ts:568` `environmentalImpact.totalDivertedToDate` | 9,225 kg (vs ~496 × 20 = ~9,920) |
| `configs/snow.ts:63,93,105,201` narrative | "25 kg per bed" |

**Canonical home:** one `PLASTIC_KG_PER_BED` constant from `products.ts`, imported by metrics, fetcher, and reconciled in the Snow narrative; plastic-diverted computed once as `deployedBeds × PLASTIC_KG_PER_BED`.

### RHD cost constant (govt-savings)

| Where | Value |
|---|---|
| `impact-fetcher.ts:159,164` `computeGovtSavings` | inline `250_000` (×2) |
| `impact-model.ts:351` the metric's own `sourceDetail` | "~$70K per surgical RHD admission (END RHD 2018; NOT $250K)" |

**Canonical home:** one named, sourced constant (~$70K) the calc and the displayed caveat both read.

### "Overdue" definition + invoice-match helpers

| Where | Definition |
|---|---|
| `xero-reconciliation/page.tsx:70` | regex `extractStatus(notes)==='overdue'` |
| `admin/page.tsx:147` | SQL `.ilike('notes','%OVERDUE%')` |

Two definitions, no shared source, can produce different totals. **Canonical home:** one shared lib helper sourced from Xero `status` + `due_date`, imported by both.

### Capex / production plant investment

| Where | Value |
|---|---|
| `compendium.ts:310` `productionPlantInvestment` + `:531` `productionFacility.investment` | 100,000 |
| Locked | 110,046 |

**Canonical home:** the `verifiedFinancials` capex constant (110,046).

---

## 3. PRIORITISED FIX PLAN

Ordered so the loop runs build-verified without conflicts. Fixes touching the same file are grouped. Run `cd v2 && npm run build` after each numbered block.

Note: there is a pre-existing unrelated TypeScript error at `dashboard/product-performance-chart.tsx:88` (Recharts formatter) recorded in memory; do not let it block these.

### P0 — wrong / dishonest numbers reaching a human

**P0-1. Funder Xero resolver sums voided/deleted invoices (6.75x overstatement, live-verified).**
File: `v2/src/lib/funders/metrics.ts:100-119` (`xeroDrawnAud`).
Issue: the query has no status filter. I ran the exact resolver query against live ACT-infra Xero for Centrecorp: 12 rows (mostly VOIDED/DELETED) sum to $832,832 raised; correct excluding-voided is $123,332. Every canonical ACT-infra script filters `.neq('status','VOIDED')`; this is the lone divergent path. It prints under a heading literally titled "Xero reconciliation" in a funder document.
Change: add `&status=not.in.(VOIDED,DELETED)` to the query string (or `rows.filter(r => r.status !== 'VOIDED' && r.status !== 'DELETED')` before reducing). Confirm GST basis: if `total` is inc-GST for ACCREC, relabel the raised/paid lines as inc-GST (do not call it ex-GST next to the ex-GST commitment line at `:112`). When `rows.length === 0` emit a visible "no Xero invoices matched contact_name=X" warning instead of silent `$0/$0` (a `contact_name` spelling drift currently masquerades as a real zero).

**P0-2. Progress-bar RangeError crash in funder reports.**
File: `v2/src/lib/funders/metrics.ts:78-98` (`commitmentProgressBar`).
Issue: `filled = Math.round(pct/5)` then `'░'.repeat(20 - filled)`. The period delivery count is not bounded by the commitment, so for Centrecorp (`totalUnits: 109`, confirmed `configs/centrecorp.ts:17`) with the all-Goods register ~496, `pct = 455`, `filled = 91`, `repeat(-71)` throws. The try/catch converts it to a `[METRIC ERROR]` line printed in the deck. Re-verified the math.
Change: `const filled = Math.max(0, Math.min(20, Math.round(pct/5)));` and clamp `pct` to 0-100 for display. Decide whether the bar is cumulative-to-date or this-period and make the label match the math. (Same file as P0-1 — apply together.)

**P0-3. "Xero reconciliation" page never reads Xero + presents CRM notes as debt.**
File: `v2/src/app/admin/xero-reconciliation/page.tsx`.
Issue (verified by reading the whole file): it queries `crm_deals` and reconstructs invoice number, payment status, and amount by regex-scraping the free-text `notes` column (`extractInvoice` `:20`, `extractStatus` `:27`, `extractNotesAmount` `:38`), then sums into tiles including one literally labelled "Paid (Xero)" (`:90`). `PAID` is tested before `AUTHORISED`; any note without a keyword silently becomes `unknown` and drops out of every total. The red "Overdue Invoices — requires follow-up" section (`:111-143`) presents notes-tagged items as collectable debt, contradicting the canonical position that AP is ~$0 and authorised-but-unpaid bills are a payment-matching gap, not debt — the exact overclaim the guardrails forbid. `crm_deals` has zero references in `database.ts` (confirmed), so the path is untyped.
Change (the page touches one file, so do it as one coherent rewrite):
1. Fetch real invoices from `xero_invoices` (reuse the `fetchXero` header/`cache:'no-store'` pattern from `lib/funders/metrics.ts` / `trip-receipts/page.tsx`): `type=eq.ACCREC` for AR, `project_code=eq.ACT-GD`, select `date,contact_name,total,amount_paid,amount_due,status,invoice_number,income_type`, and `status=not.in.(VOIDED,DELETED)`.
2. Reconcile by joining Xero `invoice_number` to the invoice extracted from each `crm_deal`; surface three buckets: matched (totals agree), CRM-only, Xero-only.
3. Derive paid/authorised/overdue from Xero `status` + `due_date < today`, never from notes. Separate AR (ACCREC) from AP (ACCPAY); only ACCREC past due is "overdue". Label any ACCPAY authorised-but-unpaid as "payment-matching gap (not debt)" with copy stating AP is ~$0.
4. `currency()` (`:15-17`): use `minimumFractionDigits: 2, maximumFractionDigits: 2` so locked cents (732,210.79) render exactly.
5. Mismatch detector (`:60-67`): drop the flat 10% band; compare ex-GST to ex-GST or test the difference against the exact 1/11 GST factor within a small absolute epsilon; flag remaining gaps on a named `MISMATCH_EPSILON_CENTS`. Take the invoice amount from Xero `total`, not `extractNotesAmount`.
6. Add a `crm_deals` Row type to `database.ts` (or local typed interface) with `amount_cents: number|null` and string-union enums for `deal_type`/`pipeline_stage`; type the select. Handle `{ data, error }` with an error banner; render an empty state; show "data as at max(updated_at)".
7. If staying CRM-only is genuinely intended, rename route + heading to "CRM invoice coverage" and remove the "(Xero)" tile labels and the reconciliation framing. (The relabel is the cheap fallback if the Xero rewire is deferred; do not ship the current honesty failure either way.)
8. Extract the logic into a pure `lib/finance/xero-reconciliation.ts` (`reconcile(crmDeals, xeroInvoices)`) so it is unit-testable; share the "overdue" helper with `admin/page.tsx:147`.

**P0-4. Public `/impact` renders a divergent $550 cost model + broken string interpolation.**
File: `v2/src/lib/data/impact-model.ts` (+ consumed at `v2/src/app/impact/page.tsx:457-489`).
Issue: `PRODUCTION_COST_BREAKDOWN` (`:138-157`) sums to `$550` (verified it feeds `current` `:326` and `currentCostPerUnit` `:487`), contradicting all canonical sources, rendered publicly as a per-stage table. Separately, `:506` uses a SINGLE-quoted string `'Each bed sale creates ${TOTAL_LABOUR_HOURS_PER_BED.toFixed(1)} hours...'` — confirmed single quotes, so the literal text `${...}` ships to the UI (line `:507` correctly uses backticks, proving the bug). `:515` repeats the "109 beds sold to Centrecorp" commercial framing that the locked facts classify as a grant.
Change (group these into one impact-model.ts pass):
1. Delete `PRODUCTION_COST_BREAKDOWN` / `TOTAL_COST_PER_BED` / `TOTAL_LABOUR_HOURS_PER_BED` as cost sources; point `currentCostPerUnit` and the `cost-per-unit` metric at the canonical libs (`fully_loaded_grid` at the current tier for the headline, build-path table for the breakdown). Replace the `/impact` per-stage table (`page.tsx:457-489`) with the canonical build-path table.
2. Fix `:506` to a backtick template literal (or precompute).
3. Reword Centrecorp evidence at `:515` and `DEFAULT_OPPORTUNITIES` to "granted / institutional buyer", matching the corrected `/impact` PartnersSection framing already applied elsewhere.
4. Reconcile `REVENUE_SEGMENTS` (`:96-125`, 4 segments) to the canonical 7-segment model, or import it.

**P0-5. Stale financial snapshot feeds the public impact-per-dollar denominator + three bed counts.**
File: `v2/src/lib/data/compendium.ts` (+ `content.ts`).
Issue: `financialSnapshot` (`:301-314`) `tradeRevenue 239,273` / `outstandingReceivables 513,148` (lastUpdated 2026-03-27) contradict the locked numbers and feed `impactPerDollar` via `getFundingSummary().received`. Three divergent bed counts (493 / 471 / 419), none ~496.
Change (group all compendium.ts edits):
1. Replace `financialSnapshot` with the single `verifiedFinancials` constant (billed 732,210.79 / received 649,710.79 / AR 82,500 / expenses 309,126 / capex 110,046 / surplus-before-founder 340,585) + `verified — not audited` flag + `lastUpdated`. Point `FINANCIAL_SUMMARY` and `impactPerDollar` at it.
2. `productionPlantInvestment` (`:310`) and `productionFacility.investment` (`:531`): 110,046, sourced from the same constant.
3. Designate one canonical deployment array; derive `communityPartnerships`/`communityLocations` counts from it (`content.ts`); add a build-time assertion the three sums match ~496.

### P1 — divergent constants, robustness holes, type-unsafe calc paths

**P1-1. Cost-model explorer imports nothing from the data layer (SSOT) + two breakeven bugs + no divide-by-zero guard.**
File: `v2/src/app/admin/cost-model/cost-model-explorer.tsx`.
Issues (verified): imports are only react + ui (`:22-24`), so ~30 DEFAULTS + every constant (`LEGS_SAVING_PER_BED 194.05`, `SHRED_FLOOR 40`, `POLYMER_FLOOR 16`, canvas 93.50, idiot divisors 10.34/35, LOCATIONS, capital 112K/222K) are inline literals duplicating `cost-model-scenarios.json` + `supplier-quotes.ts`, while the sibling `cost-model-scenarios-card.tsx` computes the same numbers FROM the JSON. Breakeven cells at `:599` and `:611` guard on `model.contributionSelected > 0` (the SELECTED method's contribution) but divide by a DIFFERENT path's contribution → renders a negative breakeven at slider extremes (verified the logic). `computeModel` divides by `beds_per_year`, throughput dials, and `contribution` with no internal guard; safe only because sliders clamp, but `Inputs` arrive as `Partial` via presets.
Change (one file, apply together):
1. Export a typed `CostModelDefaults` from `cost-model-scenarios.ts` mapping the JSON into the `Inputs` shape; import it as `DEFAULTS`. Derive `LOCATIONS`, floor constants, and idiot divisors (10.34/35 → named `STEEL_RAW_FLOOR_PER_BED` / `CANVAS_RAW_FLOOR_PER_BED`, `:287-288,672-673`) from JSON fields.
2. Compute `breakevenPanel`/`breakevenCommunity` inside `computeModel` using each path's OWN contribution with the `contribution > 0 ? round(...) : Infinity` pattern; render via `breakevenLabel(model.breakevenPanel)`; delete the inline JSX recompute at `:599,611`.
3. Add `safeDiv(num, den, fallback=0)` and clamp `beds`/throughput to a positive minimum at the top of `computeModel`; make `fmt()`/`fmtPct()` return `'—'` for non-finite inputs.
4. Format the Advanced slider readout (`:539-541`) through `fmt()` for `$` dials.

**P1-2. JSON capital-ask divergence (provenance).**
File: `v2/src/lib/data/cost-model-scenarios.json:191-192,196-197`.
Change: set `qbe_pitch_inputs.capital_ask_low/high` and `_capital_ask_low/high` to GROSS 112,000 / 222,000; add a one-line note that the ask is gross capex, net ~1,954 / ~111,954 after the 110,046 invested. (Edit alongside P1-1 since the explorer reads the same constants.)

**P1-3. Production page: dual cost model, inline price, wrong product cost.**
Files: `v2/src/app/admin/production/page.tsx`, `v2/src/components/production/cost-per-batch-card.tsx`, `v2/src/components/production/cost-model-scenarios-card.tsx`.
Issues (verified): `page.tsx:183-184` computes `cogs = bedCount * fullyLoadedCostPerBed` and margin with inline `750`; the `/bed/i` match at `:100` catches Basket beds too (the "only Stretch Beds" comment is wrong), so Basket batches are costed at the Stretch unit cost. `cost-model-scenarios-card.tsx:62-63` hardcodes stale v4 prose ($95 canvas, $344.05 kit, $278.70 factory) contradicting the v5 JSON table below it. `cost-per-batch-card.tsx:45-46,153-155` shows a red/green variance % built from three incomparable bases (Defy+steel-only spend / all beds / $600 benchmark).
Change (group by file):
- `page.tsx`: import `WEBSITE_PRICE`; move cogs/margin into a pure `batchEconomics(bedCount)` helper in the data lib; restrict the COGS rollup to the canonical Stretch Bed (not `/bed/i`), and label the card "Stretch-Bed COGS"; coerce Supabase numerics defensively (`Number(d.amount_cents) || 0`, `:52-65,252`).
- `cost-per-batch-card.tsx`: delete local `WEBSITE_PRICE` (`:6`); drive the headline + batch COGS from the chosen canonical fully-loaded figure (P0-4 decision); either drop the variance % or compare materials-only-to-materials-only over a Stretch-only denominator.
- `cost-model-scenarios-card.tsx`: replace the hardcoded prose literals with values read from the data, or delete the specific figures.
- Add `fullyLoadedCostPerBed` to `reconcileAgainstCanonicalBOM()` so a desync fires the drift banner.

**P1-4. Funder config static "paid" vs live block; GST-basis mixing; plastic narrative.**
Files: `v2/src/lib/funders/configs/centrecorp.ts:19`, `configs/snow.ts:25-27,63,93,105,201`, `metrics.ts:55-60,184-198`.
Change: drive financials-at-a-glance paid/raised from the live status-filtered resolver (P0-1), or update Centrecorp static to 123,332 paid / 0 to-be-paid with an as-at date and treat static as labelled fallback. Fix the GST-basis label mixing in financials-at-a-glance (`metrics.ts:189-192`). Replace inline `* 20` in `plasticKgTransferred` with `PLASTIC_KG_PER_BED` from `products.ts`; reconcile Snow's "25 kg" prose to the same constant. `xeroTripOverhead` (`:121-138`): render "— not yet reconciled in Xero" for `rows.length === 0` instead of a bolded `$0`.

**P1-5. Govt-savings $250K vs declared-correct $70K.**
File: `v2/src/lib/data/impact-fetcher.ts:152-167`.
Change: replace both inline `250_000` with a named constant sourced to END RHD 2018 (~$70K surgical admission), reconciled to the `sourceDetail` at `impact-model.ts:351`; keep the MODELLED label. Also replace inline canonical literals (`2.5` household, `20` kg, `365` nights) with named sourced constants (`AVG_HOUSEHOLD_SIZE`, `PLASTIC_KG_PER_BED`, `NIGHTS_PER_YEAR`); label or remove the undocumented `impactScore` weights (`:315-319`).

**P1-6. Trip-receipts honesty + double-count + missing per-bed.**
File: `v2/src/app/admin/trip-receipts/page.tsx:89,104,116,130,180`.
Change: remove the "$86k never made it into ACCPAY" and "paid through personal accounts" wording (contradicts the 2026-05-29 Xero cross-check: nil from personal accounts, no director loan); reframe any gap as a Xero payment-matching gap sourced from a canonical labelled value. Label `total` an upper-bound proxy or de-duplicate overlapping windows to the nearest trip; add per-bed cost = `total / bedCount` guarded for `bedCount > 0` and labelled a partial proxy. (Update the same wording in `metrics.ts:124` comment.)

### P2 — hardening and consistency

- **`reconcileAgainstCanonicalBOM` float equality** (`cost-model-scenarios.ts:141`): replace `===` with `Math.abs(a - b) < 0.01`; also assert `direct_total` equals the sum of its components within tolerance; include `legacyFullyLoaded` in the check if it stays mapped.
- **Funder quarters too narrow** (`reports/quarters.ts`): generate quarters programmatically across FY25-FY27 (configs already reference FY27 deadlines); flag out-of-range periods instead of silent dead-ends.
- **`fetchXero` untyped / numeric validation** (`metrics.ts:10-21,62-76`): `Number(r.total)` with `Number.isFinite` guard before reduce; type the select rows.
- **`Math.min` over mapped array** (`inventory-position-card.tsx:57`): guard empty array.
- **Stale `pendingQuotes`** (`production/page.tsx:259-280`): QU-0380/0381 expired 2026-04-23 shown as current; compute days-to-expiry and flag/exclude expired, or move to the canonical quotes list.
- **Plastic-diverted literal** (`compendium.ts:568`, `grant-content.ts:93`, `outreach-targets.ts:202`): compute once from beds × `PLASTIC_KG_PER_BED`; delete the 9,225 literal.
- **Version labelling** (`cost-model-explorer.tsx:126,736` + JSON `meta.version`): reconcile v5/v6 across header, JSON meta, footer; wire or relocate `SHEET_URL='#'`.

---

## 4. DEFINITION OF DONE

Enterprise-ready calculation integration is reached when ALL of the following hold:

1. **Correctness reconciles.** Cost-model defaults reproduce the locked canonical numbers to the cent (direct Buy-Kit 534.79 / Buy-Panels 584.07 / Factory 275.74 / Community 140.74; marginal Buy-Kit 684.79 / Factory 425.74; fixed block 109,500; breakeven Factory 338 / Buy-Kit 1,679; idiot 8.6x / 21.5x). Funder Xero figures, with the void filter applied, reconcile to Centrecorp $123,332 raised / $123,332 paid. Verified-financials surfaces show received 649,710.79 / AR 82,500 / AP ~0 / surplus-before-founder 340,585. A reconciliation test asserts these against fixtures.

2. **One source of truth per metric.** Cost per bed, COGS, margin, website price, deployed-bed count, revenue/AR/surplus, capital ask, plastic-per-bed, and RHD cost are each computed in exactly one place from one canonical lib and imported everywhere. The SSOT map in section 2 shows a single home per row. A grep for inline `750`, `20` (plastic), `250_000`, `550`, and duplicated bed-count sums returns only the canonical definitions. `reconcileAgainstCanonicalBOM`-style drift assertions (with cents tolerance) cover the cost model, the bed counts, and `fullyLoadedCostPerBed`.

3. **No NaN / Infinity / crash on any input or empty state.** Every per-bed/per-day/contribution division goes through `safeDiv`; `beds_per_year` and throughput clamp to a positive minimum inside `computeModel`; `fmt()`/`fmtPct()` return `'—'` for non-finite; the progress bar `repeat` count is clamped 0-20 (no RangeError); `Math.min` over arrays is empty-guarded; Supabase numerics are `Number(...) || 0` coerced. Every financial page renders a distinct empty/error state (not a silent `$0`) and a data-freshness line.

4. **Provenance labelled, honesty preserved.** No surface labels a figure "Xero" or "Paid" unless it came from a status-filtered Xero query. The "Overdue" section distinguishes AR (collectable) from AP (labelled "payment-matching gap, not debt", AP ~$0). The retired "$86k personal accounts / director loan" framing is gone. Modelled figures (govt-savings, counterfactual) keep their MODELLED caveat and never read as audited or actual. The `verified — not audited` flag is present on the financial constant. No template-literal placeholder text reaches the UI (the `${...}` string bug is fixed).

5. **Type-safe + correctly formatted.** No `any` in calc paths: `crm_deals` and Xero select rows are typed; status/colour maps keyed by string unions. Currency on reconciliation surfaces shows 2 dp (cents preserved); percentages and rounding are consistent. Calc logic lives in pure, importable functions (`batchEconomics`, `reconcile`, the shared overdue helper), not inline in JSX, and is unit-testable.

6. **Build clean.** `cd v2 && npm run build` passes with no new TypeScript errors introduced by these changes (the pre-existing unrelated `product-performance-chart.tsx:88` Recharts error is tracked separately and is not a blocker for this work).

The loop stops when a reviewer can open `/admin/production`, `/admin/cost-model`, `/admin/xero-reconciliation`, `/impact`, and a generated Centrecorp report, and every shared number (COGS, $/bed, margin, revenue, beds deployed, paid-to-date) reads identically and traces to one labelled source, with no `$NaN`, no `[METRIC ERROR]`, and no figure an accountant could call overclaimed.

---

Key files: `/Users/benknight/Code/Goods Asset Register/v2/src/lib/funders/metrics.ts`, `/Users/benknight/Code/Goods Asset Register/v2/src/app/admin/xero-reconciliation/page.tsx`, `/Users/benknight/Code/Goods Asset Register/v2/src/app/admin/cost-model/cost-model-explorer.tsx`, `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/cost-model-scenarios.json`, `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/cost-model-scenarios.ts`, `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/supplier-quotes.ts`, `/Users/benknight/Code/Goods Asset Register/v2/src/app/admin/production/page.tsx`, `/Users/benknight/Code/Goods Asset Register/v2/src/components/production/cost-per-batch-card.tsx`, `/Users/benknight/Code/Goods Asset Register/v2/src/components/production/cost-model-scenarios-card.tsx`, `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/impact-model.ts`, `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/impact-fetcher.ts`, `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/compendium.ts`, `/Users/benknight/Code/Goods Asset Register/v2/src/lib/funders/configs/centrecorp.ts`, `/Users/benknight/Code/Goods Asset Register/v2/src/lib/funders/configs/snow.ts`, `/Users/benknight/Code/Goods Asset Register/v2/src/app/admin/trip-receipts/page.tsx`, `/Users/benknight/Code/Goods Asset Register/v2/src/app/admin/reports/quarters.ts`.