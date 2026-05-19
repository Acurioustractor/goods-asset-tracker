# Financial model Day 2: P&L summary v0.1 (Xero-verified)

> **Date:** 2026-05-12. **Owner:** Ben. **Status:** v0.1 complete, ready to load into the workbook `P&L summary` tab. **Source:** ACT-infra Supabase `xero_invoices` + `xero_transactions` via `scripts/report-goods-financial-day1.mjs` + `report-goods-pnl-monthly.mjs`. **Output files:** `/Users/benknight/Code/act-global-infrastructure/data/goods/{pnl-monthly.csv, pnl-monthly.md, pnl-summary.json}`.

## What this is

The Xero-verified slice of the P&L summary: revenue by month split by `income_type`, plus ACCPAY-invoiced expenses by month, plus a net line. Period: 2025-01 to 2026-03 (15 months of activity; no measurable Goods activity before 2025-01).

## What this is NOT (explicit scope caveats)

This v0.1 P&L is **revenue-side complete and expense-side partial**. Specifically:

- **Founder time is not yet costed**. That is Day 3 work. Once costed at fair-market replacement rate, this will materially change the Net line. Without it, Net looks healthier than reality.
- **Capital movements not included**: plant capex, container deployment costs, and inventory build sit outside both revenue and ACCPAY-invoiced expense.
- **Bank-transaction-only expenses not included**: any SPEND on `xero_transactions` that did not flow through an ACCPAY invoice. From Day 1: total SPEND was $90,782 across 86 goods-tagged transactions; some of that may overlap with ACCPAY (already counted), some may be additional. Day 3 should reconcile.
- **R&D refund treatment**: Snow Foundation INV-0227 ($110K, May 2025) is classified as grant in Xero. If part of that is an R&D Tax Incentive offset rather than a grant, it may need separate treatment in the operating-expense vs revenue split.
- **Period boundary**: data through 2026-04-30 in the source. The monthly P&L truncates at 2026-03 because no Goods invoices appear in April 2026; that may itself be worth a sanity check.

The expense numbers ($350K total ACCPAY invoiced) represent supplier/contractor invoices, materials, freight, etc. that flowed through Xero. They are real but partial.

## Headline FY rollup (revenue side fully verified, expense side partial; revised 2026-05-12 to exclude Ingkerreke)

| FY | Total Revenue | Grant | Commercial | Expenses (ACCPAY only) | Net (incomplete) |
|---|---:|---:|---:|---:|---:|
| FY25 (Jul 2024 to Jun 2025) | $249,885 | $237,885 | $12,000 | $103,519 | $146,366 |
| FY26 YTD (Jul 2025 to Apr 2026) | $435,026 | $373,577 | $61,449 | $246,594 | $188,432 |
| **Cumulative** | **$684,911** | **$611,462** | **$73,449** | **$350,112** | **$334,799** |

## Headline narrative

1. **FY26 has grown revenue 1.74x over FY25** (from $250K to $435K), with 9 months still in the fiscal year.
2. **Commercial revenue scaled 5.1x year-on-year** (from $12K in FY25 to $61.4K in FY26). Real growth, but smaller than originally tallied. The 13.7x earlier figure relied on $103K of Ingkerreke invoices that turned out to be Oonchiumpa-linked, not Goods.
3. **Grant revenue scaled 1.57x year-on-year** (from $238K to $374K). Real, faster than typical philanthropic growth curves, driven primarily by Snow + Centrecorp + Vincent Fairfax.
4. **Expense ratio is currently 51% of revenue** ($350K / $685K), but this excludes founder time and capex. Once those land, the operating margin picture worsens.
5. **September 2025 was the biggest single month** for Goods revenue ($110K Snow Foundation R&D-style grant). October 2025 was lean ($25K). Lumpy revenue pattern, which is the main reason a cashflow buffer policy is essential (per SIH Rec #1 and the Day 7 step of the financial model build).

## Workbook ingestion

Three artefacts ready to load into the `P&L summary` and related tabs of the GOC Financial Model 2026 workbook:

| File | Purpose | Workbook tab |
|---|---|---|
| `data/goods/pnl-monthly.csv` | 15-month matrix, ready for direct paste into Google Sheets | `P&L summary` |
| `data/goods/pnl-summary.json` | Full structured data (by FY, by entity, by category, monthly) | `Raw Xero` (reference) |
| `data/goods/account-transactions.json` | Invoice-level and bank-transaction-level data | `Raw Xero` (reference) |
| `data/goods/top-contacts.json` | Top 25 customers / suppliers | `Revenue by segment` (Centrecorp, Snow, Ingkerreke contact-level evidence) |

## Things to do next (Day 3)

Per the [[2026-05-12-financial-model-week1-kickoff]] schedule:

1. **Cost founder time** at fair-market replacement rate. Recommendation in the kickoff doc was $140K/year as a defensible midpoint. Ben and Nic each need to declare their GOC FTE allocation (the rest splits across ACT, EL, etc.). Once those are in, the Net line gets re-stated.
2. **Reconcile bank-transaction SPEND** against ACCPAY-invoiced expense to avoid double-counting or missing transactions. The 86 goods-tagged transactions from Day 1 are in `account-transactions.json`.
3. **Categorise expenses** beyond the current bulk total. Useful categories: direct production cost (materials, contractor labour, freight), operating cost (marketing, IT, professional services), travel, insurance.

## Open variances flagged in Day 1 still open

1. **Centrecorp framing** (sense-check with Nic): Xero says `grant`, public site previously said "commercial". Reframe on /impact has been shipped 2026-05-12 to "Donor + institutional buyer at scale" with $208K granted across three tranches. compendium.ts comment also corrected.
2. **Back-tag Rotary (INV-0222) + QIC (INV-0232) in Xero**: 5-min job, still open.
3. **Accountant sense-check** on all revenue (commercial included) sitting under entity_code ACT-ST (Foundation): still open. Worth raising with Mint Ellison before Butterfly entity decisions finalise.

## Cross-references

- [[2026-05-12-xero-day1-reconciliation]] — Day 1 source-of-truth
- [[2026-05-12-financial-model-week1-kickoff]] — full Week 1-2 plan
- [[2026-05-12-financial-model-scope]] — 8-week build plan
- Source script: `/Users/benknight/Code/act-global-infrastructure/scripts/report-goods-pnl-monthly.mjs`
- Output CSV (ready for Google Sheets): `/Users/benknight/Code/act-global-infrastructure/data/goods/pnl-monthly.csv`
- [[../articles/governance/ai-human-in-loop-policy]] — review before any number from this doc is quoted externally
