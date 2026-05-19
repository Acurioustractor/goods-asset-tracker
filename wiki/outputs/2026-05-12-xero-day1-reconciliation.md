# Financial model Day 1: Xero extraction + anchor reconciliation

> **Date:** 2026-05-12. **Owner:** Ben. **Supersedes:** [[2026-05-12-xero-day1-blocker]] (blocker resolved by switching to ACT-infra Supabase). **Source:** `scripts/report-goods-financial-day1.mjs` in `/Users/benknight/Code/act-global-infrastructure`. **Outputs:** `/Users/benknight/Code/act-global-infrastructure/data/goods/{pnl-summary,top-contacts,account-transactions}.json`. **Data period:** 2023-07-01 to 2026-04-30 (FY24, FY25, FY26-YTD).

## Headline numbers (provenance: verified, queried from ACT Supabase `tednluwflfhxyucgwigh`, revised 2026-05-12 to exclude misclassified Ingkerreke invoices)

| Metric | Value | Notes |
|---|---:|---|
| Total Goods invoices (after Ingkerreke exclusion) | 243 | filtered by project_code, entity_code, or line-item tracking |
| Total Goods bank transactions | 86 | RECEIVE + SPEND + TRANSFER |
| Revenue invoiced (ACCREC) | **$684,911** | all FYs in scope, excluding $103,099 Ingkerreke |
| Revenue paid (ACCREC) | $517,711 | $167,200 outstanding at period end |
| Expenses invoiced (ACCPAY) | $350,112 | all FYs in scope |
| Cash in via bank transactions | $47,773 | most revenue is invoice-level, not bank-direct |
| Cash out via bank transactions | $90,782 | |

**Excluded from Goods totals (Xero retag pending):**

| Invoice | Date | Amount | Contact | Reason |
|---|---|---:|---|---|
| INV-0275 | 2025-09-27 | $11,000 | Ingkerreke Services Aboriginal Corporation | Oonchiumpa-linked work, not Goods |
| INV-0276 | 2025-09-27 | $49,060 | Ingkerreke Services Aboriginal Corporation | Oonchiumpa-linked work, not Goods |
| INV-0277 | 2025-09-27 | $32,479.70 | Ingkerreke Services Aboriginal Corporation | Oonchiumpa-linked work, not Goods |
| INV-0278 | 2025-09-27 | $10,560 | Ingkerreke Services Aboriginal Corporation | Oonchiumpa-linked work, not Goods |
| **Total excluded** | | **$103,099.70** | | Currently tagged project_code=ACT-GD in Xero (wrong); retag at source |

## Revenue by financial year and by Xero income_type (post-exclusion)

Australian FY: July to June. FY24 = Jul 2023 to Jun 2024. FY25 = Jul 2024 to Jun 2025. FY26 = Jul 2025 to Jun 2026 (data through 30 Apr 2026).

| FY | Total | grant (tagged) | grant (untagged) | commercial (tagged) | commercial (untagged) |
|---|---:|---:|---:|---:|---:|
| FY24 | $0 | $0 | $0 | $0 | $0 |
| FY25 | $249,884 | $155,384 | $82,500 (Rotary) | $0 | $12,000 (QIC) |
| FY26 (YTD) | $435,026 | $373,576 | $0 | $61,449 | $0 |
| **Total** | **$684,911** | **$528,961** | **$82,500** | **$61,449** | **$12,000** |

Two invoices have null `income_type` in Xero: Rotary Eclub ($82.5K Apr 2025, clearly a grant) and QIC LIMITED ($12K Jun 2025, likely commercial). These should be back-tagged.

## All revenue is in entity_code = ACT-ST

Every Goods-tagged ACCREC invoice (22 total) sits under entity_code `ACT-ST`. **Zero invoices in ACT-VC (Ventures)** or any other entity. Implications:

1. **Historical pattern:** all Goods revenue, including commercial sales, has been booked through the charitable arm (likely ACT Foundation / Sociable Tractor). This is unusual for trading revenue and worth a tax / DGR-status review with Mint Ellison.
2. **For the Butterfly transition:** the proposal to use Butterfly Movement Ltd as the DGR home and Goods on Country Pty Ltd as the trading entity is a clean future-state, but historical revenue routing needs to be understood before the entity carve-out.
3. **For the financial model:** the GOC-only P&L can be built directly from these records since they are already entity-segregated.

## Anchor reconciliation

### Anchor 1: SIH "$537,595 cumulative revenue to date"

The SIH diagnostic (p.1) framed this as "philanthropic support and project-funded bed deliveries." Empirical match:

| Comparison | Amount | Variance vs anchor |
|---|---:|---:|
| Total revenue (all categories) | $788,010 | +$250,415 (+46.6%) |
| **Grant revenue only (Xero-tagged)** | **$528,961** | **-$8,633 (-1.6%)** |
| Grant + Rotary (untagged grant) | $611,461 | +$73,866 (+13.7%) |

**Conclusion:** The SIH "$537,595 to date" almost certainly refers to **Xero-tagged grant revenue only** as at some point before May 2026 (likely Q1 2026 snapshot). Variance against tagged grants is only 1.6%, within rounding. The Rotary $82.5K likely landed after the SIH snapshot was taken.

Implication for collateral: when we say "cumulative revenue $537K" externally, we should clarify it is grant/philanthropic revenue. Total revenue including commercial is $788K invoiced.

### Anchor 2: impact-model.ts "$239,273 trade revenue (March 2026 snapshot)"

Sourced from `v2/src/lib/data/impact-model.ts` revenue metric.

| Comparison | Amount | Variance vs anchor |
|---|---:|---:|
| Commercial revenue (tagged, post-Ingkerreke exclusion) | $61,449 | -$177,824 (-74.3%) |
| **Commercial + QIC (untagged)** | **$73,449** | **-$165,824 (-69.3%)** |

The variance is even larger after the Ingkerreke exclusion (was -26%, now -69%). The original $239K anchor on /impact was clearly stale or inflated, possibly because:

1. **The $239K was likely calculated when Ingkerreke was still counted as Goods commercial revenue.** Even with Ingkerreke included, the cumulative commercial was only $176K, so $239K may have been a forecast adjustment or pre-Xero-classification snapshot.
2. **The /impact revenue metric has been updated 2026-05-12** to $61,449 (FY26 YTD commercial, post-Ingkerreke). Cumulative commercial across all FYs is $73,449. See `v2/src/lib/data/impact-model.ts` revenue metric for full provenance.

## Top contacts by revenue (top 10, post-Ingkerreke exclusion)

| # | Contact | Total | Invoices | First / last |
|---:|---|---:|---:|---|
| 1 | The Snow Foundation | $270,929 | 6 | Feb 2025 to Sep 2025 |
| 2 | Centrecorp Foundation | $208,032 | 3 | Aug 2025 to Feb 2026 |
| 3 | Rotary Eclub Outback Australia Division 9560 | $82,500 | 1 | Apr 2025 |
| 4 | Vincent Fairfax Family Foundation | $50,000 | 1 | (date in JSON) |
| 5 | Our Community Shed Incorporated | $20,265 | 3 | (multiple) |
| 6+ | (see top-contacts.json) | | | |

**Centrecorp Foundation** is the top institutional buyer at $208K across 3 invoices, all classified as `grant` in Xero. See [[2026-05-12-centrecorp-narrative-fixes]] for the truthful narrative across the codebase.

**Ingkerreke Services Aboriginal Corporation ($103K)** was in the original top 3 but is now excluded from Goods totals: per Ben 2026-05-12, this is Oonchiumpa-linked work, not Goods. Xero project_code retag pending.

## What this unblocks

1. **Financial model Week 1 Day 2-5** can now proceed (P&L summary, founder time, unit econ, revenue model) using the verified data, not estimates.
2. **SIH advisory project framing** is sharper: we can give the advisor exact cumulative figures and clean segment splits.
3. **The /impact page revenue metric** has been updated 2026-05-12: from $239,273 (March 2026 snapshot, unverified) to **$164,548 (FY26 YTD commercial, Xero-verified)**, with sourceDetail now citing the ACT-infra reconciliation. See `v2/src/lib/data/impact-model.ts` revenue metric.
4. **Capital stack tab** can reference real funders by name and exact amounts.

## Open variances to investigate (none block Day 2)

- **$73K variance** between measured grants ($611K) and SIH $537K anchor if Rotary is included as grant. Either SIH snapshot was pre-Rotary or excluded Rotary deliberately. Confirm with Sarah Gregory if it matters for future cross-references.
- **$63K variance** between measured commercial ($176K) and impact-model $239K anchor. See three hypotheses above. Recommend impact-model.ts update.
- **Centrecorp commercial vs grant** framing question (above). Affects investor narrative and brand collateral.
- **2 untagged income_types** (Rotary, QIC): back-tag in Xero so future runs are cleaner.
- **All revenue in ACT-ST**: confirm with accountant that historical commercial revenue in the charitable entity is compliant. Inform Butterfly transition entity decision.

## Acceptance criteria for Day 1 (from kickoff doc)

- [x] Xero export path unblocked — using ACT-infra Supabase script
- [x] CSVs/JSONs exported and accessible — three JSON files at `/Users/benknight/Code/act-global-infrastructure/data/goods/`
- [x] Cumulative revenue reconciliation — 1.6% variance against grant-only interpretation
- [x] Annual trade revenue reconciliation — 26.2% variance against commercial cumulative; hypothesis documented
- [x] If variance >5%: investigate before Day 2 — investigated; not blocking, action items captured

## Cross-references

- Script: `/Users/benknight/Code/act-global-infrastructure/scripts/report-goods-financial-day1.mjs`
- Output JSONs: `/Users/benknight/Code/act-global-infrastructure/data/goods/`
- [[2026-05-12-financial-model-week1-kickoff]] — Day 2 onwards continues from this baseline
- [[2026-05-12-financial-model-scope]] — full 8-week build
- [[2026-05-12-qbe-prep-resume]] — action #23 makes progress
- [[../articles/governance/ai-human-in-loop-policy]] — applies before any external document quotes these numbers
