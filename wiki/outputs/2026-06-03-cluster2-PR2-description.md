# restate(finance): Cluster 2 — tie funder-facing figures to live Xero

> **PR body — all four decisions confirmed (Ben, 2026-06-03 PM). Ready to ship.**
> Branch: `wip/qbe-financial-restatement-HOLD` → `main`. Open with the `gh` command at the bottom.

## Summary

Restates the funder-facing financial figures across the site so they tie to a live Xero pull (2026-06-03), and rewrites the partner/investor page to match. This is "Cluster 2" of the codex-branch triage: the financial restatement that was held back from PR #72 (#72 shipped the checkout-hardening + overclaim-softening; this ships the numbers themselves once finance-confirmed).

All four reconciliation blockers are resolved (see provenance doc):

| # | Blocker | Decision (Ben, 2026-06-03) |
|---|---|---|
| 1 | PICC $436,700 | **Exclude** — ACT / Palm Island project, not Goods |
| 2 | Snow cutoff | **$493,130** — full 3-year Xero total (incl. 2024 receipts) |
| 3 | Receivables | **$143,000** — Rotary $82.5K + Homeland $44K + Regional Arts $16.5K (all live authorised) |
| 4 | Mixed-ledger contact classification | **All non-Goods — excluded.** SMART Recovery $197.2K, Sonas/Harvest $118.6K, Cassidy/tiny-home $104.5K, HipCamp $121.5K, Just Reinvest/JusticeHub $27.5K are all other Marchesi contract projects. Goods commercial line $61,449 confirmed NOT understated; `totalReceived` unchanged. Regional Arts $16.5K added to receivables. (Ben, live-Xero confirmed) |

## Figures changed

| Field | Before | After |
|---|---|---|
| `fundingHistory.totalReceived` | $650,911 | **$741,111** |
| Snow Foundation line | $402,930 (2024–2026) | **$493,130 (2023–2026)** |
| `fundingHistory.totalReceivables` | $82,500 (Rotary only) | **$143,000** (Rotary + Homeland + Regional Arts) |
| `whatAreYourFinancials` | ~$650.9K paid / ~$82.5K due | **~$741.1K paid / ~$143K due** |
| `TRACTION_STATS` "Verified receipts to date" | $650.9K / $82.5K due | **$741.1K / $143K due** |
| Snow outreach signal | $402,930 | **$493,130** |

Composition of $741,111: Snow $493,130 + Centrecorp $123,332 + VFFF $50,000 + QIC $12,000 + Villiers $1,200 + commercial/buyer $61,449.

## What's in this PR (30 files)

**Funder-facing financial data**
- `v2/src/lib/data/grant-content.ts` — restated `fundingHistory` totals, Snow line, re-added Homeland + Regional Arts receivables, `whatAreYourFinancials`.
- `v2/src/lib/data/funder-shared-content.ts` — `TRACTION_STATS`, buyer pipeline, capital-stack framing.
- `v2/src/lib/data/outreach-targets.ts` — Snow received signal.
- `v2/src/lib/data/content.ts`, `v2/src/lib/funders/configs/snow.ts` — aligned copy.

**Partner / investor page rewrite** (largest part of the diff — flag for focused review)
- `v2/src/app/partner/page.tsx` (~640 lines) — removes overclaims ("$420K committed", "109 beds locked for Utopia", "$450K+", Homeland "active conversation" specifics), aligns the capital-stack and figures to the restated numbers and to committed-vs-in-discussion language.
- `v2/src/app/pitch/page.tsx`, `community/page.tsx`, `story/page.tsx`, `admin/page.tsx`, `admin/library/page.tsx` — figure/copy alignment.

**Cost model**
- `v2/src/lib/cost-model/engine.ts`, `cost-model-scenarios.{ts,json}`, `supplier-quotes.ts` — marginal/fully-loaded cost figures.
- 13 regenerated diagram assets in `v2/public/` (cost-model-diagram, goods-cost-down, goods-marginal-vs-fixed, operating-model, theory-of-change — svg/png/pdf).

**Provenance & ledger**
- `wiki/outputs/2026-06-03-cluster2-xero-reconciliation.md` — the `.provenance.md` for these figures: live Xero basis, the four decisions, the math, and the known follow-up.
- `thoughts/shared/handoffs/network-consolidation/current.md` — session ledger (can be dropped from this PR if a cleaner diff is wanted).

## Verification & provenance

- **Basis:** live Xero org `Nicholas Marchesi` (`786af1ed`), pulled 2026-06-03. This is a mixed multi-project ledger; figures are Goods-scoped management data, not audited.
- **Reconciliation:** every figure is traced in `wiki/outputs/2026-06-03-cluster2-xero-reconciliation.md`. Snow $493,130 = full 3yr Xero total; receivables = the three named, authorised open invoices (Rotary INV-0222 + Homeland INV-0303 + Regional Arts INV-0302); PICC and the other-project contacts (SMART Recovery, Sonas/Harvest, Cassidy, HipCamp, Just Reinvest) excluded by classification decision.
- **`npx tsc --noEmit`:** clean on the branch.

## Known follow-up (NOT a blocker for this PR)

`compendium.ts → verifiedFinancials.revenueReceived` ($649,710.79) is a separate impact-denominator model feeding the public beds-per-dollar ratio (`impact-model.ts`). It is intentionally left untouched here — moving it would silently shift the impact ratio, and it now uses a different Snow cutoff than the funder "received" figure. It also still carries a stale "Rotary is the only open receivable" note and a conflicting Homeland INV-0303 amount ($4,950 vs live $44,000). This needs its own reconcile in the finance chat.

## Merge safety

- The 30 files in this changeset are **disjoint** from the files changed in merged PRs #72/#73, so this merges cleanly and preserves their checkout-hardening and curated-quote fixes. No rebase required (verified via `comm -12` on the changed-file lists).
- Live site is unaffected until this merges; `main` currently shows the conservative pre-restatement figures, which is the correct held state.

---

### Ship sequence (run after #4 is confirmed and the `[FILL]` line above is completed)

```bash
git push -u origin wip/qbe-financial-restatement-HOLD
gh pr create --base main --head wip/qbe-financial-restatement-HOLD \
  --title "restate(finance): Cluster 2 — tie funder-facing figures to live Xero" \
  --body-file "wiki/outputs/2026-06-03-cluster2-PR2-description.md"
```

If VFFF/QIC/Villiers/commercial change on confirmation, edit the relevant `received[]` entry in `grant-content.ts` + the derived `totalReceived` and the two copy strings, re-run `tsc`, then push.
