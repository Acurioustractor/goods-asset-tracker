# Goods-Playable-Model-v2.1.xlsx — provenance

**Built:** 2026-05-30 · **From:** `Goods-Playable-Model-v2.xlsx` (30 May 00:38)
**Purpose:** THE model file for Matt Allen (SIH production-cost advisory, due END JUNE). Companion workpaper: `Goods-3-Statement-Model-v0.3.xlsx` (audited trust layer + finance-chat agenda).
**Nature:** v2 → v2.1 adds capital-injection wiring + currency/label ports. No verified actual was changed; no figure fabricated.

## Changes in v2.1 (cell-level)
| # | Sheet!cell | Change | Why |
|---|-----------|--------|-----|
| 1 | `Investment & Financing`!A31:D36 | **New "Capital injection schedule"** — QBE $200K (draw M5/Sep-26), Anchor philanthropy $500K (draw M9/Jan-27), each with amount/month/toggle dials | v2 modelled only SEFA debt in the cash line; the $500K philanthropy + QBE match never flowed, so the headline trough read −$487,722 (looked insolvent) |
| 2 | `Cashflow 36-month`!B11:AK11 | Financing row extended: preserves SEFA draw/repay **+** adds each injection in its draw month | wires the grants into the monthly cash line |
| 3 | `Balance Sheet & WC`!B17:AK17 | Capital injections row (was hardcoded `0`) → **cumulative grants/equity injected through month m** | grant = cash↑ (asset) + capital injection↑ (equity); keeps the BS balanced, no P&L effect |
| 4 | `Investment & Financing`!B19/C19/C20 | QBE amount cell was the text "match cap" → now `=B33` ($200K); narrative table single-sourced to the schedule; QBE label → "contingent cap $200K–$400K (modelled $200K)" | removes the un-numbered QBE; one source per figure |
| 5 | `Control Panel`!A34:A35 + `Assumptions & Provenance` (appended) | **Finance basis + known drift note**: pinned 2026-05-29 ACT-GD Xero mirror; +$1,200 (INV-0327 John Villiers Trust, grant, now paid) → billed 733,411 / received 650,911; re-pull before external share | the model is pinned; the drift is documented not silently applied |
| 6 | new tab `Founder Inputs to Close` | Copied verbatim from v0.3 (11-gate list, 2 DONE / 9 remaining) | the model carries its own finance-chat agenda |

## Verification (independently recomputed, not asserted)
Recalculated with the `formulas` 1.3.4 pure-Python Excel engine (LibreOffice/Excel not available this session):
- **Balance sheet balances every month:** row-20 check (TA − TL − TE) = 0 across M1–M36, max abs deviation **2.3e-10** (floating-point dust).
- **Cash trough now honest:** **−$177,292** (pre-Sep bridge window) recovering to **+$212,278** at M36. Ties exactly: v2's −487,722 + 200K (QBE M5) + 500K (philanthropy M9) = +212,278.
- **Actuals anchor ties:** operating surplus before founder **$340,584.79** / after founder **$256,584.79** — match the documented figures.
- **Dials re-flow:** Factory@500 / location-1 → surplus **+$69,430** before founder / **−$14,570** after — exactly the documented build-note figures (a location-2 test read +$15,430, the $54,000 delta being Kirmos rent — fully explained).

## What is verified vs open
- **VERIFIED (live Xero mirror, 2026-05-29):** revenue billed $732,210.79 / received $649,710.79 / due $82,500 (Rotary); cash-out $309,126; capex $110,046; AP ≈ $0.
- **LOCKED (29 May call):** founder $560/day, 150 days/yr (30/50/25/45 split).
- **MODELLED:** cost ladder ($684.79 today / $425.74 factory), breakevens, 36-mo cashflow, scenarios, capital injections (QBE $200K / SEFA $300K / philanthropy $500K).
- **OPEN (gates — see `Founder Inputs to Close` tab):** opening cash carve-out ($50K placeholder, gate #1, Ben), + 8 accountant items for the finance chat (ACT-ST→ACT-GD revenue carve-out, opex/capex split, ACCPAY matching-gap, inventory/depreciation, GST/BAS, R&D timing, tag the untagged revenue, accountant sign-off).

## Do-not-fabricate statement
QBE is modelled at the **conservative $200K** end of the contingent $200K–$400K cap (dial `Investment & Financing`!B33 to flex). Capital injections are **modelled, contingent** — not committed. The +$1,200 drift is **documented, not applied** — re-pull the ACT-GD Xero mirror before any external share, and restate *"Xero workpaper, not audited Goods revenue."* v2 is retained unedited for history.
