# Cluster 2 (financial restatement) — live Xero reconciliation

**Date:** 2026-06-03
**Purpose:** Reconcile the held Cluster 2 figures (branch `wip/qbe-financial-restatement-HOLD`, commit `9ae80e1`) against a live Xero pull before shipping as PR #2.
**Original verdict (00:39Z): DO NOT SHIP — three material discrepancies required finance reconciliation first.**

---

## RESOLUTION — 2026-06-03 PM (Ben's decisions)

Ben adjudicated the four blockers. Three are now applied to `wip/qbe-financial-restatement-HOLD`; one (sub-threshold line-items) remains gated on a Ben Xero-UI confirm before the branch ships as PR #2.

| # | Blocker | Ben's call | Applied to branch | Net effect |
|---|---|---|---|---|
| 1 | **PICC $436,700** | **Exclude** — ACT / Palm Island, not Goods | No code change (branch already excluded) | totalReceived unaffected |
| 2 | **Snow cutoff** | **Full 3-year $493,130** (incl. the ~$90,200 of 2023H2–2024 receipts) | Snow line `402_930 → 493_130`, `when` `2023-2026`; `outreach-targets` Snow signal updated | +$90,200 to received |
| 3 | **Receivables** | **$126,500** = Rotary $82,500 + Homeland $44,000 | Re-added the Homeland INV-0303 receivable; `totalReceivables 82_500 → 126_500` | +$44,000 receivable |
| 4 | **VFFF / QIC / Villiers / commercial** | **Ben confirms from Xero UI** | NOT yet applied — values held as-is, `totalReceived` flagged PROVISIONAL | gates final headline |

### Figures now on the branch (PROVISIONAL pending #4)
- `totalReceived: 741_111` = Snow 493,130 + Centrecorp 123,332 + VFFF 50,000 + QIC 12,000 + Villiers 1,200 + commercial 61,449.
- `totalReceivables: 126_500` = Rotary 82,500 + Homeland 44,000.
- `whatAreYourFinancials`: ~$741.1K paid (~$679.7K grant/philanthropic + ~$61.4K commercial); ~$126.5K outstanding.
- `funder-shared-content` TRACTION_STATS "Verified receipts to date": **$741.1K** / $126.5K still due.

### Ben's remaining Xero-UI checklist (unblocks PR #2)
Confirm these four against the full Xero customer list (they sit below the MCP top-5 cutoff, so cannot be auto-verified):
1. **VFFF $50,000** — paid? (expected: yes, 2025)
2. **QIC $12,000** — paid? (expected: yes, 2026)
3. **John Villiers Trust $1,200** — paid? (= INV-0327, 2026)
4. **Commercial/buyer $61,449** — does this capture all Goods buyer receipts? In particular, are any of **Sonas Properties $118,580**, **Richard Cassidy $104,500**, or **Just Reinvest $27,500** actually Goods buyer revenue (vs other-project / non-Goods)? If yes, the $61,449 commercial line is understated.

If all four confirm as-is, `totalReceived` $741,111 is final and the branch ships as PR #2 with this doc as the `.provenance.md`. If any change, it is a one-line edit to the relevant `received[]` entry + the derived totals.

### Known follow-up (NOT a PR #2 blocker)
`compendium.ts → verifiedFinancials.revenueReceived` ($649,710.79) is a **separate impact-denominator model** (feeds `impact-model.ts` beds-per-dollar) on a 2026-05-29 basis. It now uses a *different* Snow cutoff than the funder "received" figure ($493,130 vs the inception-basis number) and still lists the stale "Rotary is the only open receivable" note + a conflicting Homeland INV-0303 ($4,950 washing machine vs live $44,000). This needs its own reconcile in the finance chat; left untouched here to avoid silently moving the public impact ratio.

---

## Basis
- **Connected Xero org:** `Nicholas Marchesi` (`786af1ed-e3ce-42fc-9ea9-ddf3447d79d0`) — confirmed the right current Goods sole-trader, BUT it is a **mixed multi-project entity** (holds Goods + SMART Recovery + Palm Island + commercial revenue in one ledger).
- **Live pulls (read-only):** `get_contacts_and_receivables` (generated 2026-06-03T00:39Z) + `get_top_customers_by_revenue` 2023-06-04 → 2026-06-03 (refreshed 2026-06-02T17:05Z).
- **Branch basis claim:** "Xero ACT-GD ACCREC paid as of 2026-05-30, management data, not audited."

## Received — branch total $650,911

| Source | Branch "received" (paid) | Xero 3yr invoiced revenue | Tie? |
|---|---|---|---|
| Snow Foundation | $402,930 | **$493,129.79** | ⚠️ ~$90,200 gap, NOT explained by open receivables |
| Centrecorp Foundation | $123,332 | $123,332.00 | ✅ exact |
| VFFF | $50,000 | (below top-5, unconfirmed) | ❓ |
| QIC | $12,000 | (below top-5, unconfirmed) | ❓ |
| John Villiers Trust | $1,200 | (below top-5, unconfirmed) | ❓ |
| Commercial/buyer | $61,449 | (aggregate, unconfirmed) | ❓ |
| **PICC (Palm Island CC)** | **excluded** | **$436,700.00** | 🛑 unresolved Goods-vs-ACT-PI classification |
| SMART Recovery | excluded | $197,200 | ✓ correctly excluded (other project) |
| HipCamp | excluded | $121,530.24 | ✓ correctly excluded (commercial) |

**Issue 1 — Snow $90K is a DATE-CUTOFF, now explained (downgraded from drift).** Time-sliced revenue: Snow 2025 = $270,929.79, Snow 2026-YTD = $132,000.00 → 2025+2026 = **$402,929.79 = the branch's $402,930 exactly**. The 3-year total ($493,129.79) is higher only because it also captures **$90,200 of 2023H2–2024 Snow revenue** that the branch's "2025-2026" window excludes. So this is a scope/cutoff choice, not an error — **but finance should confirm the cutoff is intentional** (excluding $90K of earlier Snow Goods money from "received to date").

**Issue 2 — PICC $436,700 entirely excluded.** This is a real receipt in the connected org. Whether it is Goods revenue or A Curious Tractor / Palm Island project revenue is the long-standing open classification (see memory: "PICC Goods-vs-ACT-PI"). If any of it is Goods, totalReceived is materially understated. **Ben decision required.**

## Receivables — branch total $82,500 (claimed: Rotary is the ONLY open receivable)

Live Xero: **awaiting_total $170,367.88 across 19 invoices** (overdue $109,867.88 / 17). Named open invoices:

| Invoice | Contact | Amount due | Due / status | In branch? |
|---|---|---|---|---|
| INV-0222 | Rotary eClub Outback | $82,500.00 | 405 days overdue | ✅ included |
| INV-0303 | Homeland School Company | $44,000.00 | due 2026-06-30 | 🛑 **removed by branch — but live & authorised** |
| INV-0302 | Regional Arts Australia | $16,500.00 | due 2026-06-30 | 🛑 **omitted** |
| (16 others) | — | ~$27,367.88 | awaiting | omitted |

**Issue 3 — receivables understated by ~$88K.** Branch claims $82,500 (Rotary only); live Xero shows $170,367.88. Homeland $44K and Regional Arts $16,500 are live authorised invoices the branch dropped. (Caveat: INV-0302/0303 are due 2026-06-30 — possible they were raised after the 2026-05-30 basis date; even so, the "only open receivable" claim is false against live Xero today.)

## What DID tie (safe)
- Centrecorp $123,332 — exact (entirely 2025).
- Snow $402,930 — ties to Snow 2025+2026 (see Issue 1; the only open question is the 2024 cutoff).
- Asset counts: 496 beds / 9 communities (grant-content `communitiesCount` table sums to 496; matches `asset-canonical.ts` CANONICAL_ASSETS). ✅ These are NOT a blocker.

## #4 — VFFF / QIC / Villiers / commercial (time-sliced top-5 probes)
The Xero MCP set only exposes **top-5 by revenue per window** (no full-list or per-contact endpoint). Probed all-time, 2025, and 2026-YTD windows:
- **VFFF $50,000** (2025): below the 2025 top-5 cutoff ($104,500) — not surfaced, not disproven.
- **QIC $12,000 / Villiers $1,200** (2026): below the 2026-YTD cutoff ($27,500) — not surfaced. (Villiers $1,200 = INV-0327, documented in prior workpaper; QIC $12K previously verified-paid.)
- **Commercial/buyer $61,449**: cannot confirm via top-5. NOTE — the windows surfaced several large NON-grant names in this mixed ledger that are NOT in the branch's Goods figures and presumably should stay excluded, but confirm: **Richard Cassidy $104,500** (2025), **Sonas Properties Pty Ltd $118,580** (2026), **HipCamp $121,530** (3yr), **Just Reinvest $27,500** (2026). If any are Goods buyer receipts, the $61,449 commercial line is wrong.
- **Homeland $44,000** confirmed as a 2026 invoice (appears in 2026 revenue) that is unpaid (open receivable due 2026-06-30) — reinforces Issue 3: the branch should NOT have dropped it.
- Verifying the sub-$100K funders + the commercial split needs a **direct Xero invoice search (UI/report)** or a per-contact tool the current MCP set lacks.

## Not yet verified (non-Xero; separate sources)
- Cost-model figures `$684.79` marginal, `$1,780` fully-loaded — BOM/`supplier-quotes.ts` derived, not Xero. Need a separate BOM check.
- `partner/page.tsx` ~$3M target — capital-raise target (labelled "raising, not committed"), not an actual.
- `admin/page` capex $112–222K gross — basis unverified.

## Recommendation
Hold Cluster 2 on `wip/qbe-financial-restatement-HOLD`. Do not publish to funder-facing pages until:
1. **PICC $436,700 classified** (Goods vs ACT-Palm-Island) — Ben.
2. **Snow paid-vs-invoiced $90K gap explained** — finance / Standard Ledger.
3. **Receivables restated** to the live Xero open set (or the scope of "Goods receivable" explicitly defined and labelled) — finance.
4. VFFF / QIC / Villiers / commercial line-items confirmed against the full Xero customer list.

This is the "finance chat" the master register keeps flagging as the keystone. Once those four resolve, the corrected figures + this provenance doc ship as PR #2.
