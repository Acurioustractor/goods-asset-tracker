# Provenance — SEFA Loan Fund Application Brief (2026-06-27)

> Sidecar for `2026-06-27-sefa-loan-application-brief.html` / `.pdf`.
> Status: **DRAFT, founder sign-off required.** Management data, not audited. Every figure below carries a confidence level: **Verified** (queried the canonical source), **Inferred** (derived from an internal grounded doc, not re-checked live), **Unverified** (single source, taken on faith / to confirm with the counterparty).

## What this asset is
A 3-page, lender-grade brief for **SEFA (Social Enterprise Finance Australia)** — the AU$250K anchor of the ~AU$425K QBE match stack. Built from today's `2026-06-27-qbe-diagnostic-review/` pack (investment memo, money one-pager, risk register, team/governance, financials-lock checklist) and the SEFA analysis in `2026-06-20-qbe-funder-landscape/02-repayable-finance-shortlist.md`. No new figures were introduced beyond those two grounded sources.

## Figure-by-figure

| Claim in the brief | Value | Confidence | Source |
|---|---|---|---|
| Beds deployed | 496 | **Verified (canon)** | `v2/src/lib/data/asset-canonical.ts`; memory `goods-data-alignment` |
| Communities served | 9 | **Verified (canon)** | same |
| Stretch Bed price | AU$750 | **Verified (canon)** | `v2/src/lib/data/products.ts` |
| HDPE per bed | 20kg | **Inferred (design spec, modelled, NOT weighbridge-verified)** | products.ts spec; labelled "modelled" in-brief |
| Revenue | AU$713,827 Goods-only | **Inferred (management, accountant-signed carve-out, not audited)** | QBE Diagnostic area 04; memory `marchesi-xero-fy26-net-loss`. Distinct from $741,111 all-sources. Labelled in-brief. |
| Receivables | ~AU$143,000 | **Inferred (management, stated separately from revenue)** | financials-lock-checklist; memory |
| Marginal cost/bed | $684.79 buy-kit / $425.74 factory / $415.74 On Country | **Inferred (cost-model v6, computed 2026-06-27)** | `v2/src/lib/cost-model/engine.ts`; investment-memo §6 |
| Contribution/bed | $65 / $324 / $334 vs $750 | **Inferred (modelled)** | derived = $750 − marginal; investment-memo §6 |
| Annual fixed block | $109,500 today / $133,500 On Country / up to $163,500 | **Inferred (modelled)** | cost-model v6; investment-memo §6 |
| Breakeven | 1,679 / 338 / 399 beds per year | **Inferred (modelled)** | cost-model v6; investment-memo §6 |
| Cost-down headline | ~$260/bed ($684.79 → $425.74 = $259.05) | **Inferred (modelled, computed here from the above)** | arithmetic on cost-model v6 |
| Use-of-funds split | majority facility / ~$21K 50-bed run / ~$133.5K-yr runway / contingency | **Unverified (illustrative, `[CONFIRM]` vs 3 vendor quotes + accountant)** | investment-memo §7; labelled illustrative in-brief |

## SEFA program facts — **Inferred from the 2026-06-20 research, NOT re-verified live this session**
These come from `02-repayable-finance-shortlist.md` (which cites sefa.com.au + the AI Group blog). They are presented in the brief as the case for SEFA fit, and the brief itself frames them as **things to confirm with SEFA on the call** — treat as to-confirm, not asserted fact:
- Named impact streams "Aboriginal Community Enterprises" + "Community Environment Enterprises" — **Inferred**
- No First Nations ownership gate — **Inferred** (this is the load-bearing reason SEFA is the anchor; worth a live confirm)
- NSW Aboriginal Land Council is SEFA's majority shareholder — **Inferred**
- Loan band AU$200K-$5M (AU$200K floor) — **Inferred**
- Contact: (02) 8199 3360 / sefa.com.au/access-impact-finance — **Inferred** (verify the number before dialling)
- 2-4 month credit assessment for a first-time borrower — **Inferred** (research estimate, not a SEFA quote)

## Claim discipline honoured (do not strip without re-checking)
- **QBE match:** described as a **contingent** philanthropic catalytic match, terms being confirmed in writing. The cap is **NOT** quoted (risk register R4: founder-only until confirmed in writing).
- **Entity / DGR:** the borrowing entity and 51% First Nations pathway are stated as "in a legal review concluding ~end July 2026." No entity is named; no DGR is implied (QBE Diagnostic area 09, gated).
- **Capital stack:** shown as **target, $0 signed** — no committed-capital claim.
- **No clinical / health-outcome claims** — impact is the *why*, not a measured result (claim ceiling: scabies→RHD is WHY-only).
- **Revenue** labelled management / not audited / Goods-only; **capex** labelled modelled pending quotes.
- **Voice:** zero em dashes, straight quotes, "On Country" capitalised, units no-space (20kg, 200kg) — per standing brand rules.

## Before this is sent (founder gate)
1. Ben + Nic sign off the draft.
2. Lock the area-04 financials (see `financials-lock-checklist.md`): the $713,827 carve-out method, dated opening cash, Goods-only P&L, AP clean-up incl. the TFN mis-booking, workbook reconciled to cost-model v6.
3. Confirm the SEFA program facts live (band, ownership gate, contact, timeline).
4. Resolve / soften the entity wording once the MinterEllison review lands, OR keep the "in legal review" framing if sending before end July.
5. Confirm the QBE match ratio/eligibility/cap with Jay/SIH in writing before relying on it.

## Render
`2026-06-27-sefa-loan-application-brief.html` → headless Chrome `--print-to-pdf` → `.pdf` (3 pages, A4). House funder-report style (Lora + Inter; cream / terracotta / sage / teal / gold).
