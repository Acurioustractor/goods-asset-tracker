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

~~Figures are ex-GST (Xero income-by-contact / revenue basis). Cash received inc-GST is ~10% higher.~~

**CORRECTED 2026-09-16. That was backwards.** $493,129.79 is the sum of `amount_paid` across the ten
Snow invoices, so it is **inc-GST cash received**. The **ex-GST** figure is **$448,299.81**, and
$448,299.81 x 1.1 = $493,129.79 confirms it. Name the basis every time this figure is used.

## Reconciliation of the figures we have been citing

| Figure | What it actually is | Action |
|---|---|---|
| **$493,129.79** | True Xero 3-yr total, $0 outstanding | Use as the headline ("~$493K over three years") |
| $402,929.79 | 2025+2026 slice only; matches the Notion supporter record's "paid" + the Q2 draft's "$402,930 invoices raised" | Keep only where a 2025-26 framing is intended; label it |
| $395,000 ($434,500 inc-GST) | ex-GST commitment under grant `2024/OC0014` | A single grant's terms, not lifetime total |
| $275,000 paid / $120,000 to be paid (Q2 draft, 21 May) | Superseded — the 2025-26 slice is now fully paid ($0 outstanding) | Do NOT reuse the "to be paid" line |
| $193,785 ("2023-2025", wiki `investors/snow-foundation.md`) | Old cumulative snapshot | STALE — correct the wiki article (alignment-engine drift) |

**$493,129.79 − $402,929.79 = $90,200.00** = 2024 Snow revenue excluded from the 2025-26 slice. Confirms (and updates) the prior "Snow cutoff" reconcile.

## Residual checks — CLOSED 2026-09-16

Both were run against the live invoice list (Xero `get_invoices`, contact `The Snow Foundation`,
`9bbf72cc-5bef-47bd-9a29-a646ad22fb71`, no date filter, ten invoices returned, all PAID).

1. ~~Every `The Snow Foundation` invoice is Goods-coded, not another Marchesi project.~~
   **FAILS.** `INV-0092`, **$35,200 inc-GST / $32,000 ex-GST, 1 Oct 2023**, carries one line item:
   *"(Con)nected - Digital support for Drug Court participants"*. That is a different ACT project.
   Corroborated by a Knight Photography bill on the same date for *"(Con)nected - DASL Discovery
   Project Management"* ($27,500), recorded in the ACT wiki at
   `finance/sole-trader-pty-cutover-strategy.md`. The other nine invoices are Goods (bedding,
   washing machines, Tennant Creek and Palm Island travel, the plant, FY26 wages).
2. ~~Whether any Snow revenue predates 2023-06-09.~~
   **CLEARS.** The unfiltered pull returns nothing earlier than `INV-0092` (1 Oct 2023), so the
   3-year MCP window was not hiding earlier money and the lifetime total is not higher.

### What that leaves

| Figure | Basis | What it is |
|---|---|---|
| **$493,129.79** | inc-GST, cash | Everything Snow has paid this ledger, **including** the (Con)nected invoice |
| **$457,929.79** | inc-GST, cash | **Goods only**: the above less `INV-0092` |
| $448,299.81 | ex-GST | Everything Snow has paid, ex-GST |
| $416,299.81 | ex-GST | **Goods only**, ex-GST |

**The date matters as much as the money.** Snow's first *Goods* invoice is `INV-0166`,
**3 October 2024**, not October 2023. `grants-received.ts` records Snow at `since: '2023-10'`, and
`/pitch` chapter 15 sorts funders by that field, so the "Snow went first" argument currently rests
on the (Con)nected invoice. AMP Foundation sits at `since: '2024-07'`.

**Not actioned.** Restating the total and reordering the funders both change live public pages.
Ben's call. Recorded in `v2/src/lib/data/grants-received.ts` above `GRANTS_RECEIVED`.

## Downstream fixes this triggers

- `wiki/articles/investors/snow-foundation.md`: change "$193K received" → reconciled figure.
- `wiki/articles/capital/funder-register.md`: Snow row "$193,785 (2023-2025)" → reconciled figure.
- Notion: Snow Reporting page "At a glance" + Impact Reporting Register Snow FY26 acquittal record.
