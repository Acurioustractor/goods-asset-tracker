# Investor toolkit — what actually sells this (cut the guff)

**Date:** 2026-06-27 · **Cut:** INTERNAL, blunt.
**The problem this fixes:** the diagnostic says all 12 areas are "Built — needs review" and pastes *"reviewer evidence pack plus public routes"* into every row. That's a marketing surface describing itself. An investor doesn't buy from story pages — they buy from a **memo, a model, and a data room.** Below: for each area, the one question an investor actually asks, the single tool that answers it, whether that tool is **REAL / GUFF / MISSING**, and the number that wins the point.

**Status key:** ✅ REAL (a concrete tool exists) · ⚠️ THIN (exists but as story, not a deal artifact) · ❌ MISSING (no concrete tool).

| # | Investor asks | The one tool that answers it | Status | Kill-number / proof |
|---|---|---|---|---|
| 01 | "What is this, in one line, and why now?" | A **one-line thesis + traction headline** (top of the memo) | ⚠️ THIN | 496 beds, 9 communities, recycled-plastic beds made On-Country |
| 02 | "What changes — and can I believe it?" | **Claim-disciplined impact model** (verified / modelled / future) | ✅ REAL (`/impact`) | 496 beds · 9 communities · 2,660 kg HDPE (modelled) · WHY-only on health |
| 03 | "How does it make money, repeatably?" | **Unit economics + buyer pipeline** | ⚠️ THIN (pipeline not reconciled) | $750 price − $426 marginal = **$324 contribution/bed** |
| 04 | "Are the numbers real?" | **Financials summary + workbook + opening cash** | ⚠️ THIN (needs lock) | **$713,827 Goods-only, accountant-signed** (not audited) |
| 05 | "What kills this?" | **Scored risk register** (risk × likelihood × mitigation × owner) | 🟡 DRAFTED (`risk-register.md`) | top 10 scored, 5 reds |
| 06 | "Can they actually operate and scale?" | **Ops owner-map + transferable production SOP** | ⚠️ THIN | HighLevel API live; 3 pipelines sync 12h; SOP not documented |
| 07 | "Is this governed? Who signs off?" | **Governance + sign-off path + advisory map** | 🟡 DRAFTED (`team-governance.md`) | sign-off path defined |
| 08 | "Who's behind it — what if the founders leave?" | **Team + 12-month role map + founder-dependency plan** | 🟡 DRAFTED (`team-governance.md`) | role map + dependency plan |
| 09 | "What am I investing *in*, and what's my security?" | **Entity / cap / legal-structure summary** | ❌ MISSING (gated by Butterfly handover ~end July) | ACT Pty t/a Goods; DGR via Butterfly only; 51% path |
| 10 | "The ask, the terms, use of funds, my return?" | **Investment memo + use-of-funds + returns + capital stack + commitment register** | ❌ MOSTLY MISSING (cockpit shell only) | ~$425K raise; QBE match ≤$400K contingent; **$0 signed** |
| 11 | "Do the unit economics work at scale?" | **Cost-model cockpit** | ✅ REAL (`/cost-story`, engine verified 2026-06-27) | $426 marginal → $133.5K/yr fixed (On-Country) → **breakeven 399 beds/yr** |
| 12 | "Who else is in? How does the match work?" | **Capital stack + match mechanics + live commitment register** | ⚠️ THIN ($0 signed, no live register) | Stack target: SEFA $250K + Snow $100K + Centrecorp $75K |

## The brutal read *(updated 2026-06-27 — drafts now built)*
- **2 areas have a real deal-tool** (02 impact, 11 cost model).
- **5 are thin** — real pages, but story not deal artifact (01, 03, 04, 06, 12).
- **Now drafted this session** — the investment memo + data room (10), scored risk register (05), team & governance (07/08). These were the missing middle.
- **1 remains genuinely missing/gated:** 09 legal/cap structure (waiting on the post-Butterfly MinterEllison review).
- **Still to harden (founder/accountant calls):** financials lock (04), use-of-funds + match terms (10/11/12) — flagged `[CONFIRM]` in the memo.

You couldn't sell a $425K raise off a cost model and an impact page. The middle now exists in draft; it needs your sign-off and the `[CONFIRM]` decisions, not more building.

## The right tools to build (a data room, in priority order)

A data room is **one front door + a short, hard set of artifacts.** Build in this order — each unblocks the next:

1. **Investment memo** *(the spine — areas 01/02/03/04/10/11)* — thesis · traction · model · unit economics · ask · use of funds · risks. **✅ DONE** (`investment-memo.md` + Notion).
2. **Use of funds + capital stack** *(10/12)* — what $425K buys, the SEFA/Snow/Centrecorp/QBE structure. **✅ DRAFTED in memo §7-8** — returns/terms flagged `[CONFIRM]`.
3. **Data room index** *(the front door)* — one page, every artifact linked + status. **✅ DONE** (Notion front door).
4. **Scored risk register** *(05)* — top 10 risks, likelihood × impact × mitigation × owner, QBE-shareable decision. **✅ DONE** (`risk-register.md` + Notion).
5. **Team + governance one-pager** *(07/08)* — role map, founder-dependency plan, sign-off path, advisory (not board). **✅ DONE** (`team-governance.md` + Notion).
6. **Cap / legal structure summary** *(09)* — what you invest in, security, 51% path, DGR boundary. **⛔ GATED** — needs the post-Butterfly MinterEllison review (~end July).

## What's already a real tool (don't rebuild — point the memo at it)
- **Cost model** — `/cost-story` + `v2/src/lib/cost-model/engine.ts` (numbers verified 2026-06-27).
- **Impact model** — `/impact` (hold the claim ceiling).
- **Traction proof** — `/bed/[id]` per-bed records + the 496/9 canon.

## The rule for every tool (so it never reads as guff again)
Each tool answers ONE investor question, leads with the number, labels verified vs modelled vs target, and links to its source. If a tool can't state its kill-number in one line, it's still guff.
