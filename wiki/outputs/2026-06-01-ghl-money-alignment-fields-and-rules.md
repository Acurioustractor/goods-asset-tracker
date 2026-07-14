# GHL → Money Alignment — Opportunity Fields & Entry Rules

**Created:** 2026-06-01 · **Location:** `agzsSZWgovjwgpcoASWG` (A Curious Tractor)
**Why:** GHL `monetaryValue` is a hand-typed estimate with no meaning per stage, no
grant-vs-commercial classification, and no link to Xero — so pipeline sums are
unreliable ("GHL $ unreliable; Xero is truth"). These fields + rules make GHL carry the
*classification + reconciliation key*, while Xero stays the money truth and the app does the join.

This is **Layer A** of a 3-layer plan:
- **Layer A (DONE):** classification + Xero-link fields on opportunities (below).
- **Layer B (next):** one-way Xero→GHL sync stamps `Actual paid (Xero) AUD` + `Amount basis = Xero-actual` onto matching opps.
- **Layer C (next):** extend `/admin/loi-tracker` into a reconciled cockpit (GHL pipeline ∥ Xero actuals ∥ variance ∥ trustworthy rollups). Build as the Goods slice of the planned Xero↔ACT-infra↔GHL reconciler (keystone: Standard Ledger sign-off).

## Field registry (live, opportunity model)

| Field | fieldKey | Type | ID | Options |
|---|---|---|---|---|
| Funding type | `opportunity.funding_type` | SINGLE_OPTIONS | `UCFe9cyjk3sVKwtInfSG` | Grant · Philanthropic · Commercial sale · Community contribution · Demand signal · Other |
| Match-eligible (QBE) | `opportunity.matcheligible_qbe` | SINGLE_OPTIONS | `6tSoVICqtrTGQAzpPHn1` | Yes · No · TBC |
| Capital status | `opportunity.capital_status` | SINGLE_OPTIONS | `QbfHdeNpz2JiMe5iRESS` | Signal · Ask made · Verbal yes · Signed LOI · Contracted · Invoiced · Paid |
| Amount basis | `opportunity.amount_basis` | SINGLE_OPTIONS | `LM1U3fVHJNB4KwvuK9ZF` | Estimate · Quote · Invoiced · Xero-actual |
| Xero contact ID | `opportunity.xero_contact_id` | TEXT | `e1GTAmBc3HLwxNiRVZjS` | — |
| Xero invoice # | `opportunity.xero_invoice_` | TEXT | `YFy6JM5tGjl4J4B5cHSV` | — |
| Actual paid (Xero) AUD | `opportunity.actual_paid_xero_aud` | NUMERICAL | `R4QAmlXhi6gRRPrfuuz5` | — |

Pre-existing opp fields (kept): Submission Link, Submission date, Date of Festival,
Goods: Beds, Goods: Washing machines, Invoice (file upload).

## Entry rules (keep the numbers trustworthy)

1. **`monetaryValue` = the ASK / forward number, always.** Never overwrite it with "what we got."
2. **Real money lives ONLY in `Actual paid (Xero) AUD`** — written by the Layer-B sync, not typed by hand.
3. **Every opp gets a Funding type + Match-eligible at creation** (no blanks). Demand signals → Funding type = `Demand signal`, Match-eligible = `No`.
4. **Capital status is the money-certainty ladder, independent of the relationship stage.** An opp counts as "committed" only when Capital status ≥ `Signed LOI`. **≥3 at `Signed LOI` = the QBE match gate** (today: 0 — gate open).
5. **Amount basis declares how much to trust `monetaryValue`:** Estimate (default) → Quote → Invoiced → Xero-actual.
6. When invoiced: paste the **Xero invoice #** and set Amount basis = `Invoiced`. When paid: the sync sets Actual paid + Amount basis = `Xero-actual`.

## Rollups these enable (the trustworthy overview)

- **Secured match-eligible** = Σ `Actual paid (Xero) AUD` where Funding type ∈ {Grant, Philanthropic} AND Match-eligible = Yes
- **Committed pipeline** = count / Σ where Capital status ∈ {Signed LOI, Contracted}
- **Aspirational** = the rest (Ask / Signal) — labelled, never summed into "secured"

## Reconciliation snapshot at creation (2026-05-31)

- GHL pipelines, all open, **0 at Committed/Signed LOI**: Supporter Journey 43 ($5.18M est.), Buyer 10 ($1.84M est.), Demand Register 105 ($9.38M est.).
- Xero money-in FY25-26 (top 5): PICC $365,200 · Snow $264,145 · Centrecorp $123,332 (ties exactly) · Sonas Properties $118,580 (classify) · Ingkerreke $103,100 (classify).
- Receivables $170,368 awaiting; Rotary Eclub Outback INV-0222 $82,500 is **402 days overdue** (collect or write off).

## Next steps

1. **Backfill existing ~158 opps** with Funding type + Match-eligible + Capital status (Tier-2 writes; can seed from Xero top-customers + current stage).
2. **Layer B sync** (Xero→GHL) using the field IDs above + `opportunities_update-opportunity`.
3. **Layer C cockpit** in `/admin/loi-tracker`.

**Tooling note:** the GHL MCP has no create-custom-field tool; these were created via
`POST https://services.leadconnectorhq.com/locations/{loc}/customFields` with `GHL_API_KEY`
(`Version: 2021-07-28`). Script: `/tmp/ghl_create_field.mjs` (regenerate if needed).
Values can be set via `mcp__ghl__opportunities_update-opportunity` (`customFields` array).
