# GOC financial assumptions: alignment with Matt's model

**Date:** 2026-07-23
**For:** Thursday meeting with Matt Allen (Social Impact Hub)
**Purpose:** Reconcile every assumption in Matt's `GOC Bed Unit-Costing Model v2.xlsx` against our canonical data, resolve the open items he flagged, and set the investor-ready way to explain each one. This is the input pack for the GOC-only 3-statement model Matt asked for.
**Companion file:** `goc-data-and-figures-pack.csv` (116 sourced rows, the full figure set).

---

## 1. What Matt built, and what he is asking for next

**Built (this file):** a bed unit-costing model with three production paths (Buy-Kit / Factory / Community) running in parallel, a 10-year projection with a self-funding container-build trigger, and a researched 40ft-container capex sheet with per-line sources and confidence labels. It reconciles cleanly to our v6 cost model. His three improvements over our own artefacts are real: traceable formulas, all levers on one page, and an investor-standard format.

**Asking for next (his email, 21 + 23 Jul):** a **GOC-only, 3-statement financial model in Excel**, split off from ACT, with a single input/assumptions page and traceable sources. The bed model is the main input; the financial model is the wrapper investors will actually underwrite. His words: "the real investible entity is GOC, and investors are going to want to see that entity's financials in black and white."

**The gap he is naming is correct.** We have a strong unit-cost model and a strong actuals base. We do not yet have them assembled into a single GOC-only 3-statement pack (P&L, balance sheet, cash flow) driven off one assumptions tab. That is the next build. This document locks the assumptions so that build starts from agreed numbers.

---

## 2. Where his model matches our canon (no action)

These are aligned and can be treated as settled inputs:

| Assumption | Matt's value | Our canon | Status |
|---|---|---|---|
| Selling price | $750/bed | $750 (shop, held flat) | Verified, aligned |
| Steel poles | $27/bed | $27 (DNA Steel) | Verified, aligned |
| Canvas | $93.50/bed | $93.50 (Centre Canvas, 270 covers) | Verified, aligned |
| Hardware | $5.24/bed | $5.24 | Verified, aligned |
| Buy-Kit HDPE | $344.05/bed | $344.05 (Defy INV-1602/1732) | Verified, aligned |
| Fixed block | $109,500/yr | $109,500 (GoC Q&A Q1 confirms line by line) | Verified, aligned |
| Founder production time | $16,800/yr (30d x $560) | Locked 2026-05-29 | Aligned |
| Path marginal costs | $684.79 / $425.74 / $420.74 | v6 sec C | Aligned |
| Genset in capex | $12,000 ex GST | Confirmed in-scope 2026-07-22 | Aligned |

His per-path contribution ($65.21 / $324.26 / $329.26) and the read that follows ("in-sourcing the legs is what closes the economics, breakeven drops from ~1,679 to ~338 beds/yr") are our read too. Good.

---

## 3. The open items Matt flagged, resolved or with a decision owner

Matt's Notes tab lists open items honestly. Here is our position on each, so Thursday is a confirmation not a discovery.

### 3.1 HDPE shred quantity and rate (Matt's Notes item 3) — DECISION NEEDED (Ben)
Matt kept Factory HDPE at **$55/bed** (20kg x $2.75 verified ex Defy INV-1731) but flags that our GoC Q&A Q10 says "we buy shredded HDPE at $1-2/kg, 25kg per bed." That is inconsistent on **both** quantity (20 vs 25kg) and rate ($2.75 vs $1-2/kg).
- **Recommendation:** keep the invoice-verified **$55/bed (20kg @ $2.75 landed)** as the model figure, because it traces to an actual Defy invoice. Treat the $1-2/kg as an aspirational floor for the community/free-feedstock path, not the factory cost. Ben to confirm the real per-bed HDPE mass (product spec says 20kg diverted; if we press 25kg and 5kg is offcut/waste, say so).
- **Why it matters:** at 25kg x $2/kg = $50 it barely moves; at 25kg x $1/kg = $25 it drops factory cost ~$30/bed. Not a swing number, but investors will check it against the "20kg diverted" claim, so the two need to agree.

### 3.2 Site capex: $30,000 vs $100-150K (Matt's exclusions; our full-cost sec 6) — DECISION NEEDED
Two figures in our own data for a community site: `state_5_community.capital_added` = **$30,000** (reads as an increment on an existing central factory) and `standalone_site_capex` = **$100-150K** (reads as a site from scratch).
- **Recommendation:** retire both in favour of the **MVF reconciliation (2026-07-22)**: sunk ~**$75K** (what Nic actually spent, used deals) and replication ~**$90-123K, mid ~$105K** (what a fresh community site pays at market). Matt's container-capex sheet ($40,450 for the container fit-out lines) is a component of the replication figure, not a competing number. Use **~$105K replication** for the funder ask.

### 3.3 Per-site capacity: 250 vs 1,250 vs 1,500 beds/yr — a measured run confirms the sustained rate
Three sources disagree on the sustained per-site rate. Matt's model uses 500/yr per facility (a middle assumption). Our docs carry 250 (flagged assumption), 1,250 (5 beds/day x 250) and 1,500 (DEWR "~30 beds/week").
- **Position:** the Factory process is **already proven** at a real 40-bed in-house run (the Maningrida Stretch beds, INV-0303, made end-to-end at the farm: legs shredded, hot-pressed, CNC-routed, then assembled). What is not yet locked is the **sustained per-site rate** and the **measured per-bed actuals** (time, diesel, plastic yield). Keep 500/yr as a deliberately conservative planning figure; a measured production run confirms the rate and converts the $425.74 factory cost from modelled to measured. This is a much stronger position than "unproven process," and the pack and pitch must say so.

### 3.4 The community-facility operating block — MISSING FROM BOTH MODELS
Neither Matt's model nor our engine has a real community-site fixed block. The engine's "$24,000/yr site bill" is the **rent line only** and understates the real cost by ~15x. From the Oonchiumpa DEWR application we now have honest figures: **bare facility ~$152K/yr**, **fully staffed ~$342K/yr**, plus **$300K/yr employment program (grant-funded, never carried by bed sales)**.
- **Action:** this belongs in the GOC-only financial model as a separate cost centre, not inside the per-bed cost. It is the difference between "a plant that pays for itself" and "a plant plus a youth program," which must be two pots. See section 4.

### 3.5 Capital ask net vs gross ($112-222K gross vs ~$2-112K net) — DECISION NEEDED (Ben)
Our own sweep flagged this as internally inconsistent. **Never quote "$90-200K."**
- **Recommendation:** quote **gross capex $112-222K** and present the ~$75K already sunk as evidence of skin in the game, rather than netting it off (netting invites "so is it yours or not?" given the ownership-handover flag). Cleaner story, and it sidesteps 3.6.

### 3.6 Ownership of the sunk facility (GoC Q&A Q12) — TIMING GATE
The "$110,046 already invested" plant is not yet GoC-owned (funded $80K TFN + $20K ACT; handover targeted end-Aug 2026). Matt's model never re-charges it, which is correct. But the net-capital-ask framing weakens until handover completes. Present as gross capex (3.5) and note the handover as in-progress.

### 3.7 Capital stack split — DECISION NEEDED (Ben + QBE)
Matt's $600K stack (QBE match-eligible $250K + match $250K + other $100K) is a placeholder. Our base case is QBE up to $400K + SEFA $300K + philanthropy $500K. **Signed match-eligible capital today = $0** (0 open Goods-eligible grants; 51% First Nations ownership is the biggest unlock). Confirm the real split and the QBE match ratio before the stack goes in front of anyone.

---

## 4. The one framing that has to survive into the 3-statement model: two pots

This is the load-bearing investor explanation, and it must be structural in the financial model, not a talking point bolted on.

> **Production pays for itself. The wraparound never does, and should not.**

- **Pot 1 — Production (the investment case).** A bed contributes $324 to $329 at volume. Product revenue carries materials, labour and machine upkeep. This is what an investor underwrites: a plant that pays back. Containerising the legs is the whole prize ($194/bed saved, breakeven from ~1,679 down to ~338 beds/yr).
- **Pot 2 — The wraparound (jobs-are-the-dividend).** The manager, trainer, WHS officer and above all the $300K/yr youth-employment brokerage are grant and government funded by design. Handing a community a plant without the operating money attached is handing them a ~$340K/yr liability. ACT holds the machinery, the consortium spreads the fixed block, ownership is a pathway.

**Why this is a stronger pitch, not a weaker one:** a funder handed "this plant pays for itself AND runs a youth program" will not believe it and should not. A funder handed "the plant pays for itself, here is the evidence, and the youth program is grant-funded by design, here is why that is the right money for it" is being told the truth they can fund with confidence. The separation is the credibility. In the model this means **two cost centres and two funding sources that never cross-subsidise on paper.**

---

## 5. The honest caveats we will not overclaim (carry into the model's cover note)

- These are **Xero-mirror workpaper figures, not accountant-reviewed statutory accounts.** ~89% grant-funded.
- The **Factory path is proven**, not modelled from zero: 40 Stretch beds (Maningrida, INV-0303) were made in-house end-to-end at the farm (legs pressed + CNC'd + assembled). What stays modelled is the **measured per-bed cost/time actuals** from that run, and the separate **on-country community-owned path**, which has not been run yet. Do not repeat "zero beds pressed in-house" anywhere; it is wrong.
- Container and equipment capex are **desktop estimates and modelled midpoints, not firm quotes.** Firm quotes required before any figure goes to QBE.
- CRM pipeline (~$3.42M active) is **internal only**, not committed capital and not QBE-match evidence.
- The only externally-quotable revenue figure is the **accountant-signed Goods-only carve-out $713,827.** Never the $403,901 "surplus" (the entity P&L is a net loss).

---

## 6. Recommended shape of the GOC-only 3-statement model (the next build)

To answer Matt's actual ask. One workbook, driven off a single assumptions tab, with these sheets:

1. **Assumptions** (one page): volumes and path mix by year, price, the per-path unit costs (linked from the bed model), the fixed block, the community-facility block (bare/staffed), capital stack and timing, working-capital terms (debtor/creditor days), GST treatment. Blue = input, every number sourced to the CSV pack.
2. **P&L** (accrual): revenue by stream (product vs grant, kept separate = two pots), COGS by path, gross margin, operating costs, the wraparound as a clearly separate block funded by grant, EBITDA, founder time as a sensitivity line.
3. **Balance sheet:** plant at cost (sunk ~$75K + new capex as drawn), inventory, receivables/payables, capital contributions, retained position.
4. **Cash flow:** operating, investing (container builds on the self-fund trigger), financing (capital stack draws by month). Opening cash is the most important single input (base placeholder was $50K).
5. **Sources tab:** the CSV pack, one row per number, status-labelled.

Two-pots discipline is enforced by keeping product revenue/COGS and grant-income/program-cost as separate blocks that sum to the entity result but never net against each other.

---

## 7. Decisions to get from Ben on Thursday (the short list)

1. HDPE per-bed mass and rate: confirm 20kg @ $2.75 as the model figure, reconcile the "20kg diverted" claim (3.1).
2. Site capex: adopt sunk ~$75K / replication ~$105K, retire $30K and $100-150K (3.2).
3. Capital ask: quote gross $112-222K, sunk as evidence not a net-off (3.5).
4. Capital stack: confirm the real split and QBE match ratio (3.7).
5. Community-facility block: agree bare ~$152K / staffed ~$342K / program $300K as the three-cost-centre structure (3.4, 4).
6. Confirm whether the 40-bed Maningrida run's actuals (time, diesel, plastic yield per bed) were captured; if not, a short measured run locks the $425.74 factory cost as measured and confirms the sustained rate (3.3). The process itself is already proven.
