# 3-Statement Model v0.2 — QA / pressure-test note

**Date:** 2026-05-30 · **For:** Ben/Nic before the model goes to Matt (the end-June deliverable)
**What this is:** an independent audit of `Goods-3-Statement-Model-v0.2.xlsx` (built 29 May 14:25) against the canonical numbers sheet (`2026-05-29-qbe-canonical-numbers-sheet.md`) and the 29 May call decisions. This is the "pressure-test assumptions and outputs" step the call/diagnostic named — done *before* Matt sees it, so he reviews a clean model.

## Verdict
**The model is in good shape and current.** Assumptions already reflect the 29 May founder locks ($560/day, 150 days/yr, 30/50/25/45 split — both marked DONE on the "Founder Inputs to Close" tab). Provenance discipline is strong (every figure VERIFIED/MODELLED/TARGET/TO-CONFIRM). The 9 open gates are all correctly flagged as accountant/"finance chat" items. **Four issues to fix or flag before it's send-ready as v0.3.**

> **Addendum (2026-05-30):** an independent ACT-infra live-Xero check found the finance basis has since drifted **+$1,200** — the live ACT-GD mirror now reads **$733,410.79 / $650,910.79 / $82,500** because **INV-0327 (The John Villiers Trust, $1,200)** is now ACT-GD + paid. v0.3 is **pinned to the 2026-05-29 basis** with this drift documented (`README!A39` + provenance). The trust is grant by nature → tagged grant the untagged bridge stays $47,300; untagged it is ~$48,500. **Re-pull Xero before any external share.** The biggest live risk is stale finance basis leaking into Matt/QBE materials — not the email.

## Findings (ranked)

| # | Sev | Issue | Where | Fix |
|---|-----|-------|-------|-----|
| 1 | **HIGH** | **Revenue total and the grant/commercial split don't reconcile.** Cumulative billed = **$732,211**, but grant ($611,462) + commercial ($73,449) = **$684,911** — a silent **$47,300** gap. The split is on the stale **May-12 $684,911 basis**, not the live $732,211. Worse, the "Revenue Mix" block is *also* on the $684,911 basis. | `P&L (monthly)` A6–A8 (FY rollup) + A32–A40 (revenue mix) | Add an explicit labelled bridge line so total = grant + commercial + **untagged/added-since-May-12**, and rebase the mix to $732,211. Don't invent the split — flag the delta `TO-CLASSIFY` (ties to close-item #10). |
| 2 | **MED** | **The $94,500 vs $47,300 "untagged" figures disagree.** Close-item #10 says **$94,500** of revenue is untagged grant-vs-commercial; the P&L arithmetic implies a **$47,300** gap. Two different "untagged" numbers. | `Founder Inputs to Close` #10 vs `P&L` A8 | Reconcile to one figure with the accountant; whichever is right, make the P&L total = the sum of its labelled parts. |
| 3 | **MED** | **Stale "378" breakeven** in a note — the sheet's own formula (F35) correctly computes **338**, and canonical is 338 (factory) / 333 (community). The note contradicts the cell next to it. | `Cost Ladder` A37 note | Change "≈ 378 beds/yr" → "≈ 338 beds/yr". (Safe, unambiguous — matches the formula + canonical.) |
| 4 | **LOW** | **QBE match modelled at $400K @ 90%** — but the cap is **$200K vs $400K, unconfirmed** and the match is contingent (consistent flag in the funder email just drafted). | `Cashflow 36mo` C47/D47 | Show $200K–$400K range or hold at $200K until QBE confirms; keep the "OUTPUT of the stack, not input" note (already there). |
| 5 | **LOW** | **Assembly cost shown two ways** — marginal-cost assembly = $40 (Cost Ladder C6) vs idiot-index "Defy assembly labour" = $55.95 (A20). Matt will ask. | `Cost Ladder` C6 vs C20 | Reconcile or add a one-line note on the difference (our-assembly vs Defy-charged). |

## The revenue reconciliation, spelled out
- **Live Xero (2026-05-29):** billed **$732,210.79**, received **$649,710.79**, due **$82,500** (Rotary). All VERIFIED-workpaper. ✅ these are right.
- **The split** (grant $611,462 / commercial $73,449) sums to **$684,911** — which canonical line 93 confirms is the *"May-12 Goods model baseline after excluding Ingkerreke invoices."* So the split was never rebased from $684,911 → $732,211.
- **Net:** the model's headline revenue is correct and current; its *classification* lags by one vintage. This is the one thing a sharp reader (or Matt) would catch, so it's worth closing or labelling before send.

## The 9 remaining gates = one accountant conversation
The "Founder Inputs to Close" tab already nails these (opening cash, ACT-ST→ACT-GD carve-out, opex/capex split, ACCPAY matching-gap cleanup, inventory/depreciation, GST/BAS, R&D timing, tag the untagged revenue, accountant sign-off). **They don't need more modelling — they need the finance chat booked.** That's the Area 4 human-decision gate, unchanged.

## Recommended v0.3 changes (offer to apply)
- **Safe now:** #3 (378→338).
- **Needs your nod (judgment / no fabrication):** #1 + #2 (add the labelled untagged-revenue bridge line; pick $94,500 or $47,300 once tagged), #4 (QBE $200–400K range).
- I'd apply these as a **v0.3** with a one-line changelog on the README tab + a refreshed `.provenance.md`. I held off editing the polished workbook programmatically to avoid degrading its formatting — say the word and I'll produce v0.3.

*Inputs: `Goods-3-Statement-Model-v0.2.xlsx`, `2026-05-29-qbe-canonical-numbers-sheet.md`, `matt-document-bundle/README.md` + close-tab, 29 May call decisions. No figures fabricated; the $47,300/$94,500 gap is surfaced, not resolved.*
