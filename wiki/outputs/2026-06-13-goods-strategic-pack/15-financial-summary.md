---
title: Goods on Country — Financial Summary
subtitle: A Goods-only read of the money, the unit economics, and the capital ask — readable without opening the model
date: 2026-06-13
status: DRAFT for founder and accountant review
areas: QBE Diagnostic Area 4 (Financial Management, 4→7, Priority) & Area 11 (Cost Model)
complements: Goods Playable Model (Control Panel tab) — this summarises and points to it; it does not rebuild it
evidence_discipline: every figure carries a label — [VERIFIED] independently checkable · [WORKPAPER] Xero mirror, unaudited · [MODELLED] planning assumption, no production actual · [TARGET] sought, not signed
source_of_truth: 00-master-alignment-map.md (§2 unit economics & money-in, §3 ask, §4 the 36-month model)
---

# Goods on Country — Financial Summary

> **What this is.** A plain-language financial summary for Goods on Country (GOC) that a reader can understand without opening the spreadsheet. It closes the documentation half of QBE Diagnostic **Area 4 (Financial Management)** and **Area 11 (Cost Model)**. It complements the live **Goods Playable Model** — it summarises that model's headline numbers and points to it; it does not reproduce the model.
>
> **What it is not.** It is not an audited account. The money-in figures are an unaudited Xero workpaper, the cost-down and forecast figures are modelled with zero beds yet assembled in-house, and the headline capital figures are targets, not signed commitments. Every number below is labelled so the reader can see exactly which is which. The single most important caveat: **there is not yet one accountant-endorsed, Goods-only revenue figure** — producing it is the work, and it is now a hard QBE Stage-2 gate.

---

## 1. Money in (where the funding has come from)

Goods has been almost entirely grant-funded to date, by design. This is a de-risking round, not a growth round, and the financials reflect that.

| Figure | Value | Label | Note |
|---|---|---|---|
| Received to date | **AU$649,710.79** | [WORKPAPER — Xero mirror, 29 May 2026, unaudited] | across funders |
| Billed to date | AU$732,210.79 | [WORKPAPER] | includes ~AU$82,500 in-flight (Rotary) |
| Collection rate | 88.8% | [WORKPAPER] | billed → received |
| Commercial revenue (shop) | **AU$90** | [WORKPAPER] | 3 orders — proof of pipe, not of market |
| Grant-funded share | **~89%** | by design | the financials of a de-risking round |

**The Snow Foundation context.** Snow is the #1 contact by revenue, with **AU$493,129.79 invoiced over the trailing three years** [WORKPAPER — accrual, read-only Xero MCP, last refreshed 2026-06-12, unaudited]. This is the current trailing-3yr invoiced total; it reconciles two narrower earlier views (AU$193,785 "received 2023–25" cash snapshot, and AU$402,930 deck "anchor" subset). It is invoiced, not necessarily cash-received.

**Why this is not yet a Goods-only figure — read this before quoting any number above.** All the money-in figures sit inside the org that trades Goods today (Nicholas Marchesi, sole trader). That same org also holds **non-Goods income** — confirmed in the same Xero pull, which surfaces top contacts such as SMART Recovery (AU$197,200) and HipCamp (AU$120,205) that are not Goods. So AU$649,710.79 is a live billing view of the whole sole-trader org, **not an audited carve-out of Goods revenue.** Two frames coexist and measure different things: the **Xero workpaper** (AU$649,710.79 received, the live billing view) and the separate **reconciled funder trail** (~AU$405,685, the grants-received view). The standing priority is to turn these into **one accountant-reviewed, Goods-only revenue figure** — it does not exist yet. The carve-out is the work (see §6).

---

## 2. Unit economics (the per-bed picture today)

These are the economics of the flagship Stretch Bed as it is built **today** — buying components in, before any in-sourcing. They show why the business cannot yet stand on its own, and set up the cost-model case in §3.

| Line | Value | Label |
|---|---|---|
| Sale price | **AU$750** | [VERIFIED — v2/src/lib/data/products.ts] |
| Bill of materials, today | AU$469.79 | [WORKPAPER] |
| Marginal cost, today | **AU$684.79** | [WORKPAPER] |
| Fixed cost block | ~AU$109,500/yr | [MODELLED] |
| Breakeven, today's cost | **~1,679 beds/yr** | [MODELLED] |
| Current deployment run-rate | ~130 beds/yr | actual |

**What this says plainly.** At today's cost, the bed sells for AU$750 against a marginal cost of AU$684.79 — a contribution of about AU$65 per bed toward a fixed block near AU$109,500 a year. On those numbers, breakeven is around 1,679 beds a year while the business currently deploys about 130. That is out of reach at today's cost, and the summary does not pretend otherwise. The cost model in §3 is the lever that closes the gap.

---

## 3. The cost model — the three build options (Area 11)

The cost model is the heart of the catalytic case. It asks one question: **what does in-sourcing the plastic do to the unit cost, and therefore to breakeven?** The Playable Model carries this as a four-method toggle; the three points that matter to a reader are below.

| Build method | Marginal cost/bed | Label | What changes |
|---|---|---|---|
| **Buy-Kit (today)** | AU$684.79 | [WORKPAPER] | all components bought in |
| **Factory in-source** | AU$425.74 | [MODELLED] | shred, press, cut, assemble in a containerised factory configuration |
| **Community in-source** | AU$421 | [MODELLED] | same plant moved toward community ownership/operation |

**The effect on breakeven.** Moving off Buy-Kit drops breakeven from ~1,679 beds/yr to **333–338 beds/yr** [MODELLED] — within sight of demand rather than out of reach.

**The lever, and the one piece of hard evidence.** The cost-down is driven by removing an **8.6× markup ("idiot index") on the HDPE legs** currently bought from an external supplier (Defy) [VERIFIED]. That markup is the single verified data point underneath the whole cost model.

**The honest status — this is a hypothesis, not a result.** Both in-source costs are [MODELLED] with **zero beds assembled in-house so far**, against a stale inventory snapshot (2026-03-27). The cost model is a credible projection, not a measured outcome. The experiment that converts it is a **50-bed in-source production run (~AU$60–80K)**: a pass confirms AU$425.74 and the raise scales on proven economics; a miss re-bases the raise honestly at AU$684.79. A catalytic investor is being asked to fund this experiment, not a finished economic engine.

---

## 4. The 36-month shape (the forecast)

The model runs a 36-month forecast under two scenarios. All figures here are [MODELLED] — they come from the financial model, not from actuals.

| At month 36 | Position | Label |
|---|---|---|
| Without the capital injection | **−AU$487,722** | [MODELLED] |
| With the injection stack (QBE + SEFA + philanthropy) | **+AU$212,278** | [MODELLED] |
| Worst point along the injected path (intra-period trough) | **−AU$177,292** | [MODELLED] |

**Read the trough, not just the recovery.** The injected scenario does not climb in a straight line — it dips to −AU$177,292 before recovering to +AU$212,278. The summary shows the trough deliberately, because that dip is what the working-capital buffer in the ask (§5) is sized to cover.

**The highest-leverage input is a flagged placeholder.** Opening cash in the model is **AU$50,000, marked "TO CONFIRM"** — a placeholder, not a confirmed figure. It is the single most sensitive number in the forecast: it moves both the month-36 position and the depth of the trough. Locking the real opening-cash figure is the highest-leverage action available before this model is investor-ready (see §6).

---

## 5. The capital ask — basis and components

**Headline:** AU$900K–AU$1M in **blended, non-equity** capital, with the immediate task being to close the first **~AU$400K of signed, match-eligible commitments by 31 August 2026**. Signed, match-eligible commitments today: **0** [VERIFIED — "a conversation problem, not a discovery problem"].

| Layer (junior → senior) | Instrument | Amount | Label / status |
|---|---|---|---|
| Grants (junior) | Philanthropy (Snow R4/R5, Centrecorp next round, VFFF, Minderoo) | ~AU$500K | [TARGET] |
| Catalytic top | **QBE match** | up to AU$400K | ≥1:1 vs secured external capital; repayable preferred; legally-binding evidence verified at Sept 2026 application |
| Concessional debt (senior) | SEFA working-capital line | AU$300K | [TARGET] — ~70% modelled; gated on the financial model + independent-majority board + revenue covenant |
| Upside only | Butterfly/DGR | ~AU$200K | [TARGET] — FY2026-27, DGR not live today |

**The basis for the ask, line by line:**

- **First ~AU$400K is the live target** — the first tranche being assembled now; the signed/eligible commitment register is live (CivicGraph "Match Campaign" tab).
- **The QBE match is an output, not an input.** QBE Catalysing Impact offers up to AU$400K from a $1M pool, on **at least 1:1 matching** to secured external investment (more raised unlocks more, to the AU$400K ceiling). The program **prioritises repayable finance over grants.** Match must be **legally binding** (signed letters of commitment, loan or investment agreements) and is **verified by the program at the September 2026 Stage 2 application**; conditional grants are possible if the match is not fully locked. The first signed external dollar is what unlocks the match.
- **Gross plant capex is AU$112K–AU$222K** (midpoint ~AU$167K) [MODELLED] — a **firm quote is still pending**. (The Playable Model's solid press-capex line is AU$110,046; the AU$112–222K is the wider gross-capex range carried in the model.)
- **Founder time is costed** at **AU$560/day × 150 days/yr** — i.e. founder labour is in the model at a fair-market rate, not treated as free. This directly answers the diagnostic's Area 4 requirement to cost founder time.
- **Non-equity, on purpose.** The end-state is community-owned production; equity that needs an exit would contradict the thing being built. Equity is revisited only inside a future model where communities themselves are the owners.

---

## 6. Readiness status — what makes this investor-ready

The model itself is built and genuinely good: it is the GOC-only model Area 4 asked for, it carries unit economics, a scenario engine, the 36-month forecast, and costed founder time, and its headline numbers match this pack exactly. What stands between "built" and "investor-ready" is four specific, mostly human, actions:

1. **Accountant-endorsed, Goods-only carve-out.** Turn the two coexisting revenue frames (the AU$649,710.79 Xero workpaper and the ~AU$405,685 funder trail) into **one accountant-reviewed, Goods-only figure**, with non-Goods income (SMART Recovery, HipCamp, etc.) stripped out. This is now a **hard QBE Stage-2 gate** — audited or accountant-endorsed financials are required at the September 2026 application — not optional polish.
2. **Lock the opening cash.** Replace the AU$50K "TO CONFIRM" placeholder with the real figure — the highest-leverage input in the forecast (§4).
3. **Attach a firm capex quote.** Replace the AU$112–222K modelled range with a firm supplier quote (§5).
4. **Supply the full workbook.** Only the **Control Panel tab** of the Playable Model has been shared so far; the complete .xlsx needs to go to the reviewer/accountant so the model can be checked end-to-end.

Underneath all four: the **50-bed in-source run** is what converts the cost model (§3) from modelled to measured. Until then, the central economic claim remains a credible hypothesis, clearly labelled as such.

---

*Source of truth: 00-master-alignment-map.md (2026-06-13). Complements the Goods Playable Model (Control Panel tab) — summarise and point to it, do not rebuild. Re-pull Xero immediately before any external send; the received/billed figures move as invoices clear (a 1 Jun 2026 check read ~AU$1,200 higher on both). Nothing in this summary is audited or final — it is a DRAFT for founder and accountant review.*
