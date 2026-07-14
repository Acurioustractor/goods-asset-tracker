# Goods-3-Statement-Model-v0.3.xlsx — provenance

**Built:** 2026-05-30 · **From:** `Goods-3-Statement-Model-v0.2.xlsx` (29 May 14:25)
**Audited against:** `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md` + the 29 May call locks (founder $560/day, 150 days, 30/50/25/45).
**Audit note:** `wiki/outputs/2026-05-30-3-statement-model-v0.2-audit.md`.
**Nature:** v0.2 → v0.3 applies **mechanical + label fixes only**. No VERIFIED actual was changed; no figure was fabricated.

## Changes in v0.3 (cell-level)
| # | Sheet!cell | Change | Why | Label |
|---|-----------|--------|-----|-------|
| 1 | `P&L (monthly)`!A9 (was empty) | Added reconciliation line: $732,211 = Grant $611,462 + Commercial $73,449 + **Untagged $47,300** | The split was on the retired May-12 $684,911 basis and left a silent $47,300 gap to the live $732,211 total | surfaced, not resolved — TO-CLASSIFY |
| 1b | `P&L (monthly)`!A32 | "Revenue Mix … $684,911 basis" → added "REBASE to $732,211 once #10 tagged" | Same vintage mismatch on the mix block | flag |
| 2 | `Cost Ladder`!A37 | breakeven note **378 → 338** and **1,882 → 1,679** | Both were computed off the retired **$122,700** block; current block is **$109,500**, and the sheet's own formulas (F35/F36) already compute 338/1,679 | corrected to match formula + canonical |
| 3 | `Cashflow 36mo`!E47 + G12 | QBE match relabelled **$200K–$400K UNCONFIRMED upper bound** | Cap is $200K vs $400K, contingent — consistent with the funder email + canonical. **Numbers unchanged** (C12/C47 still $400K) to avoid silently re-cutting the trough; relabel only | label |
| 4 | `Cost Ladder`!A38 (was empty) | Note: assembly $40 (C6) vs $55.95 (C20) | Two assembly figures; Matt will ask | flag for advisor |
| 5 | `Founder Inputs to Close`!F14 | Appended: reconcile $94,500 (close-list) vs $47,300 (P&L gap) to one figure | The two "untagged" figures disagree | flag |
| — | `README & Assumptions`!A1 + A11 | Title → v0.3; added changelog | versioning | — |

## What is verified vs open (unchanged from v0.2)
- **VERIFIED (live Xero mirror, 2026-05-29):** revenue billed $732,210.79 / received $649,710.79 / due $82,500 (Rotary); cash-out $309,126; capex $110,046; AP genuinely owed ≈ $0.
- **LOCKED (29 May call):** founder $560/day, 150 days/yr, 30/50/25/45 split → fixed block $109,500.
- **MODELLED:** cost ladder ($684.79 today / $425.74 factory), breakevens (338 / 1,679), 36-mo cashflow, scenarios, R&D ~$80K, capital injections.
- **OPEN (9 gates, accountant / "finance chat"):** opening cash carve-out, ACT-ST→ACT-GD revenue carve-out, opex/capex split, ACCPAY matching-gap cleanup, inventory/depreciation, GST/BAS, R&D timing, **tag the untagged revenue (#10)**, accountant sign-off. All named on the model's "Founder Inputs to Close" tab.

## Do-not-fabricate statement
The $47,300/$94,500 untagged-revenue gap is **surfaced, not resolved** — the actual grant-vs-commercial allocation is an accountant item (#10). QBE injection figures were **relabelled, not changed**. v0.2 is retained unedited for history.

## Finance basis & known drift (added 2026-05-30)
- **Basis date:** 2026-05-29 ACT-GD Xero snapshot — **$732,210.79 billed / $649,710.79 paid / $82,500 due**. The model is **pinned** to this date.
- **Known drift (2026-05-30, independent ACT-infra live Xero check):** mirror now reads **$733,410.79 billed / $650,910.79 paid / $82,500 due** — **INV-0327 (The John Villiers Trust, $1,200)** is now tagged ACT-GD + paid (+$1,200).
- **Effect on the untagged bridge:** the John Villiers Trust is grant by nature, so **tagged grant** it leaves the bridge at **$47,300** (grant $612,662 + commercial $73,449 + untagged $47,300 = $733,411); **left untagged** the bridge is **~$48,500**.
- **Rule:** re-pull Xero before any external share, and restate *"Xero workpaper, not audited Goods revenue."* Drift figure sourced from the 2026-05-30 ACT-infra live Xero check — **not independently re-pulled in the Goods session.** Documented in the workbook at `README & Assumptions!A39` + `P&L!A9`.
