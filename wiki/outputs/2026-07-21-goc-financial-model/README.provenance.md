# GOC 3-Statement Model v1 — provenance

**File:** `GOC-3-statement-model-v1.xlsx` · built 2026-07-21 for Matt's ask (GOC-only model, split from ACT, single assumptions page, traceable sources). Balance check row = 0 in all years (verified via independent python mirror at build time).

## Structure
- **Assumptions** — the ONLY input page (yellow cells). Every row carries a claim label (Verified / Workpaper / Modelled / Target / PLACEHOLDER) and its source.
- **P&L, Cash Flow, Balance Sheet** — pure formulas off Assumptions. FY27-FY29 (July-June years).

## What v1 says (base inputs, before Matt's iteration)
| | FY27 | FY28 | FY29 |
|---|---|---|---|
| Beds | 200 | 338 | 500 |
| NPAT | ~+$346K | ~+$5K | ~+$10K |
| Closing cash | ~$771K | ~$659K | ~$567K |

The taper is visible in the statements: FY27 profit is **grant-carried** ($575K Target income; trading result before grants ≈ **-$229K**), FY28 stands at break-even with $50K philanthropy, FY29 is grant-free and self-standing. Gifts end, the loan amortises, trading carries the entity. This is the investible story in black and white.

## Verified anchors (do not change without source)
- Bed price $750 · marginal buy-kit $684.79 (engine-locked) · already-invested equipment $110,046 · opening AR $143,000 · FY26 revenue reference $713,827 (accountant-signed carve-out, noted on P&L).

## Known soft spots (labelled in-file)
1. **Opening cash = $50K PLACEHOLDER** — Ben to set from bank before any external send.
2. **$425.74 pressed cost = Modelled** — capability proven (Maningrida 40, INV-0303) but not measured at production rate; the funded measured run converts it.
3. **All FY27 funding rows = Target, $0 signed** (Snow/Centrecorp/QBE/SEFA). QBE requires ≥1:1 signed match by 31 Aug.
4. Debtor 60d / creditor 30d / inventory 30d, tax 25%, dep 10%, fixed-growth 3% = planning assumptions for Matt/Malcolm to test.
5. GST excluded; entity = GOC carve-out of ACT Pty Ltd (pre-Butterfly structure); washer revenue $0 (prototype, not for sale).

## Iterate
Regenerate: `python3 <scratchpad>/build_goc_model.py` (script also archived beside this file). Bed-costing model refinements from Malcolm plug into the two marginal-cost input rows.
