# Snow Foundation — figure reconciliation (provenance)

**Date:** 2026-06-09
**Purpose:** Resolve the conflicting Snow Foundation contribution figures before any number goes into a partner update, the Bhanvi intro, or the FY26 acquittal.
**Method:** Live Xero pull (read-only) via MCP, org `Nicholas Marchesi` (786af1ed), contact-level (clean for Snow even though the org is a mixed multi-project ledger).

## Verified figure

| Field | Value | Source | Confidence |
|---|---|---|---|
| Snow revenue, last 3 years (2023-06-09 → 2026-06-09) | **$493,129.79** | Xero `get_top_customers_by_revenue`, contact "The Snow Foundation" (ranked #1) | Verified |
| Snow outstanding receivable | **~$0** (not in the 19 awaiting invoices) | Xero `get_contacts_and_receivables` 2026-06-09 | Verified |
| Implied: paid to date | **= $493,129.79** (revenue with $0 outstanding) | Derived | Inferred |

Figures are ex-GST (Xero income-by-contact / revenue basis). Cash received inc-GST is ~10% higher.

## Reconciliation of the figures we have been citing

| Figure | What it actually is | Action |
|---|---|---|
| **$493,129.79** | True Xero 3-yr total, $0 outstanding | Use as the headline ("~$493K over three years") |
| $402,929.79 | 2025+2026 slice only; matches the Notion supporter record's "paid" + the Q2 draft's "$402,930 invoices raised" | Keep only where a 2025-26 framing is intended; label it |
| $395,000 ($434,500 inc-GST) | ex-GST commitment under grant `2024/OC0014` | A single grant's terms, not lifetime total |
| $275,000 paid / $120,000 to be paid (Q2 draft, 21 May) | Superseded — the 2025-26 slice is now fully paid ($0 outstanding) | Do NOT reuse the "to be paid" line |
| $193,785 ("2023-2025", wiki `investors/snow-foundation.md`) | Old cumulative snapshot | STALE — correct the wiki article (alignment-engine drift) |

**$493,129.79 − $402,929.79 = $90,200.00** = 2024 Snow revenue excluded from the 2025-26 slice. Confirms (and updates) the prior "Snow cutoff" reconcile.

## Residual checks (cannot see from MCP — confirm in Xero UI)

1. Every `The Snow Foundation` invoice is Goods-coded, not another Marchesi project. (Snow grant `2024/OC0014` is to Goods, so likely clean, but confirm.)
2. Whether any Snow revenue predates 2023-06-09 (Xero MCP only supports a 3-year window). If yes, the lifetime total is higher than $493,129.79.

If both clear: headline = **"Snow has invested ~$493K over three years, fully received."**

## Downstream fixes this triggers

- `wiki/articles/investors/snow-foundation.md`: change "$193K received" → reconciled figure.
- `wiki/articles/capital/funder-register.md`: Snow row "$193,785 (2023-2025)" → reconciled figure.
- Notion: Snow Reporting page "At a glance" + Impact Reporting Register Snow FY26 acquittal record.
