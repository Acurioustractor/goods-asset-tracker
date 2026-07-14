# Goods on Country — cost per bed, made simple

**Date:** 2026-06-02 · **Companion:** `Goods-Cost-Per-Bed-SIMPLE-v1.xlsx` (the playable model)
**Sources reconciled:** Notion "11 Cost Model v6 reconfigured" + "04 Financial Management"; act-global-infrastructure verified BOM (`thoughts/shared/analysis/2026-05-28-goods-bed-cost-model-v3.json`); v2 site cost-model engine + skins. All four accessed and reconciled 2026-06-02.

---

## The one idea

There are **two different questions** hiding inside "what does a bed cost?"

1. **What does it cost to make one more bed?** → the honest number. Call it **marginal**.
2. **What does it cost to run the whole operation, ÷ how few beds we make this year?** → this is where the scary **"$1,900 a bed"** comes from. It is just fixed costs ÷ too few beds.

**Lead with the marginal number.** Treat the fixed running costs as a yearly block to fund, not a per-bed tax.

---

## The simple table

### Layer 1 — Parts (what the bed is made of)
| Line | $/bed | Confidence |
|---|--:|---|
| Recycled-plastic legs — **bought finished from Defy** | **$344.05** | verified (INV-1602/1732) |
| Recycled-plastic legs — **pressed in-house** (alt) | **~$150** | modelled (shred $55 + diesel $15 + operator $80) |
| Galvanised steel poles (×2) | $27.00 | verified |
| Canvas sleeping surface | $93.50 | verified |
| Hardware (caps/screws/bolts) | $5.24 | verified |
| **Parts subtotal (buy-kit path)** | **$469.79** | first-principles raw floor is $128.99 — the gap is supply-chain markup, ~$289 of it the plastic kit alone |

### Layer 2 — Making it
| Line | $/bed | Confidence |
|---|--:|---|
| Assembly (buy-kit path, Defy) | ~$65 | verified |
| Press + assemble in-house (factory) | included in the $150 legs | modelled |

### Layer 3 — Running the business, **per bed at a stated volume**
| Line | @100/yr | @500/yr | @1,000/yr |
|---|--:|--:|--:|
| Founder **production** time only (30 of ~150 days × $560) | $168 | $34 | $17 |
| Workshop rent (Goods share) | $270 | $54 | $27 |
| Field travel to communities | $510 | $102 | $51 |
| Admin / back-office | $147 | $29 | $15 |
| Long-haul freight to community (variable) | $150 | $100 | $80 |

### Layer 4 — Easy-to-forget (real, mostly un-quoted)
Warranty/replacement reserve (~$15–35) · replacement freight ($150–300/event) · payment fees (~$13–20) · insurance · audit/accounting · machine maintenance once in-house · community plastic collect/wash/sort ($28–100).

---

## The numbers to quote

| Number | Value | Say this |
|---|--:|---|
| **Marginal — one more bed TODAY** (buy Defy kit) | **$684.79** | "What one more bed costs us right now." **Lead with this.** |
| **Marginal — one more bed IN-SOURCED** | **~$426** | "Press our own legs → save ~$194/bed. That saving is the whole capital case." |
| Direct cost (parts + making, no overhead/freight) | $534.79 buy / $275.74 factory / $270.74 community | "The bed itself." |
| **Fully-loaded @100/yr** | ~$1,780 | **Reference only.** Never quote without the marginal beside it — it's fixed costs ÷ 100 beds. |
| Fully-loaded @500/yr | ~$595 (in-sourced) | "Same fixed block over 5× the beds. Cost-per-bed is a *volume* story." |
| Contribution / bed | $329.26 (community @ $750) / $179 (@ $600) | "What each bed throws off toward fixed costs." |
| **Breakeven** | **333–338 beds/yr @ $750** · ~611 @ $600 | "Beds/yr before sales alone cover the $109,500 fixed block. Philanthropy bridges until then." |

> **Price trap:** $600 (gift) vs $750 (shop) vs $801 (one verified Centrecorp sale) change breakeven a lot (333 → 611). Pick **one** price to quote externally.

---

## The narration (read aloud to a funder)

> Each bed costs about **$685** to make today — most of that ($470) is just parts, and the single biggest part is recycled-plastic legs at **$344** that we currently *buy* but could *make* ourselves for ~$150. The "$1,900 a bed" figure isn't what a bed costs — it's a year of fixed running costs (~**$109,500**: rent, founder production time, travel) divided by the ~100 beds we make now. Make 500 and that spreads to ~$219/bed; make 1,000 and it's ~$110. **Cost-per-bed is a volume problem, not a product problem.** Only ~30 of the founder's ~150 days actually build beds — the rest is fundraising and winning orders, so it's wrong to stamp it on a bed. Each bed throws off **$180–330** toward fixed costs; we need **~333–600 beds/yr** before sales cover the block, and philanthropy bridges the gap. The capital we ask for buys the plastic-processing kit that turns a thin margin into a real one.

**Honest caveats:** warranty reserve, replacement freight, payment/insurance/audit fees, and machine maintenance aren't in the model yet; the parent entity runs at a loss and invests ahead of revenue; ~$120K of unrelated spend is mis-tagged against Goods, inflating the raw "all-in" figure. The **marginal** numbers ($685 today / $426 in-sourced) are solid; anything "fully-loaded" needs the volume + clean-up stated next to it.

---

## Open items to firm up (the "things we haven't thought about")
1. **Warranty/replacement reserve** — pick a % (suggest 4%) → ~$15–35/bed. None carried today.
2. **Replacement freight** — a remote warranty swap pays freight again ($150–300).
3. **Payment/insurance/audit/SaaS fees** — none itemised for Goods; likely $20–50K/yr combined.
4. **Machine maintenance + capital recovery** — the in-house $150 legs ignore upkeep & payback (only sensible above ~300 beds/yr).
5. **Founder day-split** (30/50/25/45 of 150) is FOUNDER-CONFIRM, not time-tracked.
6. **$120K mis-tagged Xero spend** + **$82,500 Rotary receivable** (>1yr overdue) — clean up the denominator.
7. **Pick ONE external price** ($600 vs $750).
8. Data bugs to fix: production card says "v5" (data is v6); "$481/bed" copy vs $465 table; community pay-tier header says 40kg (should be 20kg); `SHEET_URL='#'` in `engine.ts` → point at this workbook.
