# GOC financial model pack (for Matt, 2026-07-23)

This folder packages everything we have pulled on Goods On Country, with notes and sources, so Matt can see the working behind the numbers and plug it into the GOC-only 3-statement financial model.

## What is here

| File | What it is |
|---|---|
| **`GOC-Entity-Model-Inputs.xlsx`** | **SEND THIS TO MATT.** The simple figures sheet, mirroring the format of his `GOC Bed Unit-Costing Model v2.xlsx` (single Inputs page, numbered blocks, blue = input, per-line status + source, All AUD ex-GST, plus a Notes tab). It hands Matt the ENTITY-level figures his bed model doesn't already have (historical actuals, opening position, working capital, tax, financing split, the grant-funded Pot 2) so he can build the GOC-only 3-statement model. We give him the inputs in his format; he builds the statements. |
| `goc-data-and-figures-pack.csv` | The full figure set behind the Inputs sheet. 117 rows, every one tagged Section / Metric / Value / Unit / Status / Source / Notes. The traceable data pathway. |
| `GOC-3-Statement-Model.xlsx` | Optional worked reference (not the thing to send). A live-formula 5-year 3-statement build (Assumptions -> Production -> P&L -> Balance Sheet -> Cash Flow), balances all 5 years, in case it is useful to see the figures articulated. Matt builds the real one; this just shows the shape. |
| `assumptions-alignment.md` | The reconciliation of Matt's `GOC Bed Unit-Costing Model v2.xlsx` against our canon: what matches, the open items resolved, the two-pots investor framing, and the recommended shape of the 3-statement model. |
| `goc-data-and-figures-pack.provenance.md` | Where every number came from and how confident we are. |

## How the CSV maps to Matt's model

- Sections **B, C, D** (BOM, cost per path, marginal/contribution) are the inputs to Matt's **Inputs block 1**. They reconcile exactly.
- Section **E** (capex) maps to Matt's **Capex Estimates** sheet and **Inputs block 2**, and adds the sunk-vs-replication reconciliation (~$75K sunk / ~$105K replication) that supersedes the old "$110,046" note.
- Section **F** (fixed block) = Matt's **Inputs block 3**.
- Section **G** (community facility operating model) is the block **neither model has yet**: the real ~$152K bare / ~$342K staffed / $300K program figures from the Oonchiumpa DEWR application. It belongs in the entity model as a separate cost centre.
- Section **H** (historical financials) is the actuals base for the 3-statement model.
- Sections **I, J, K** are the capital stack, entity/legal, and the open decisions.

## Status vocabulary (column E)

- **verified** — traced to an invoice, register query, or ASIC/ABN check.
- **evidenced** — pulled from Xero at bill/bank-line level.
- **modelled** — calculated from verified inputs. The Factory *process* is proven (40 beds made in-house at the farm, Maningrida INV-0303); the per-bed cost stays "modelled" only until the run's measured actuals (time/diesel/yield) are captured. The on-country community-owned path is a future path.
- **derived** — arithmetic done here from cited inputs.
- **inferred** — reasoned from available data, not directly confirmed.
- **unverified / placeholder** — no second source or an explicit placeholder pending a decision.

## The headline honesty line

Real evidence and a full model trail exist. The one remaining investor-readiness gap is a single accountant-reviewed Goods-only pack with a clear "not audited" caveat. The Factory path is proven: 40 Stretch beds were made in-house end-to-end at the farm (Maningrida, INV-0303). What stays modelled is the measured per-bed cost/time, plus the separate on-country community-owned path. Two pots: production pays for itself; the youth-employment wraparound is grant-funded by design.
