# The Minimal Viable Facility

**Date:** 2026-07-22
**Status:** Canonical. Two numbers, both honest, kept separate on purpose.
**Why:** The cost model carried a "$110,046 invested / $100,000 facility" line. That was Ben's working note for total sunk spend on the farm production facility, a shorthand to show what has already gone in, not a claim about a single building. This document refines that note into evidenced figures, and reconciles what was actually spent against what a new community site would pay to stand up the same thing.

**Sources:** connected sole-trader Xero (Nicholas Marchesi, ABN 21 591 780 066) via the Codex capex workbook `~/Code/act-global-infrastructure/outputs/goods-capex-review-workbook-2026-07-22/` (bill, transaction and bank-line level, pulled 2026-07-22) · Ben's market rates for containers · `v2/src/lib/data/cost-model-scenarios.json`.

> **Read section 5 first if you only read one part.** The shredder, the single biggest plant item, has no record in the connected Xero. It is physically confirmed but not in the books.

---

## 1 · What the minimal viable facility actually is

Not a building. A deliberately small, movable setup at the farm:

- one 40ft shipping container
- one 20ft shipping container (the shredder lives in one of these)
- a diesel generator
- the plant inside: shredder, hot and cold press, CNC router, workshop tools

It presses beds today. It is the smallest working version on purpose, so no single shape is locked in before a partner's capacity, shipping and site are known. It scales up (a proper shed, three-phase mains, more moulds) or stays lean, depending on the partner.

---

## 2 · Two numbers, and why they differ

| Question | Number | Use it for |
|---|---|---|
| What did Nic actually spend to stand up **this** facility? | **~$75,000** hardware, mostly used/second-hand deals | the sunk-cost / "already invested" story |
| What would a **new community site** pay to replicate it at market rates? | **~$90,800 to $123,000**, mid ~$105,000 | the funder ask / "what a site costs" story |

They differ because Nic bought used and got lucky on price (a 20ft container booked at $3,320 against a $6,000 to $10,000 market rate). A partner cannot be promised the same bargains, so the replication number is honestly higher.

---

## 3 · What was actually spent (evidenced from Xero)

Pulled bill, transaction and bank-line level from the connected sole trader.

| Item | Inc GST | Date | Supplier | Xero project tag | Grade |
|---|---|---|---|---|---|
| Press + cold press + CNC (INV-0054) | $32,780 | 2025-12-17 | Circularity Group | ACT-GD Goods | **evidenced** |
| Workshop tools ($4,575.65 + $1,811.70) | $6,387 | 2026-01 | Carbatec Brisbane | ACT-HV Harvest | **evidenced**, tagged Harvest |
| 20ft container "Monument Grey" | $3,320 | 2026-04-29 | Bionic Self Storage | ACT-FM The Farm, capitalised | **evidenced** |
| Crane placement (2x 20T Franna) | $1,041 | 2026-06-29 | GM Crane Hire | ACT-CN Contained | **evidenced** |
| Container transport (after-hours) | $193 | 2026-06-24 | Rapid Container | ACT-CN Contained | **evidenced** |
| 2x generators at $3,300 each | $6,600 | 2025-05-22 | Orange Sky Australia | *no project tag* | **ambiguous** |
| Container (the larger one) | $5,904 | 2025-12-09 | Container Options | ACT-MY Mounty Yarns | **flagged on-sold** |
| Shredder | $19,800 | | Telford Smith | *no record found* | **physical only** |

**Confidence tiers:**

| Tier | Contents | Total |
|---|---|---|
| Cleanly evidenced and tagged | Circularity, Carbatec, 20ft container, crane, transport | **~$43,700** |
| Evidenced but ambiguous | 2x generators, $5,904 container | ~$12,500 |
| Physical only, no Xero record | shredder | $19,800 |
| Not yet seen in any bill | electrical fit-out, ventilation, pad, PPE | estimated (section 4) |

The clean-plus-ambiguous-plus-shredder hardware sits around **$76,000** before fit-out. Round to ~$75,000 sunk.

---

## 4 · What a new community site would pay (replication)

Market rates. Container figures are Ben's; plant figures are the evidenced purchase costs; fit-out is estimated.

| Component | Low | High | Basis |
|---|---|---|---|
| 40ft shipping container | $13,000 | $16,000 | Ben, "and up" |
| 20ft shipping container | $6,000 | $10,000 | Ben |
| Diesel generator (press-line sized) | $6,600 | $20,000 | Orange Sky units to a proper diesel |
| Shredder | $19,800 | $19,800 | evidenced |
| Press + cold press + CNC | $32,780 | $32,780 | evidenced INV-0054 |
| Workshop tools | $6,387 | $6,387 | evidenced |
| Crane placement + transport | $1,200 | $2,500 | evidenced |
| Electrical fit-out (board, three-phase) | $3,000 | $8,000 | estimate |
| Ventilation / fume extraction | $1,000 | $3,000 | estimate |
| Site prep (pad, levelling) | $500 | $3,000 | estimate |
| PPE + startup consumables | $500 | $1,500 | estimate |
| **New-site minimal viable facility** | **~$90,800** | **~$123,000** | mixed |

**Mid-point: roughly $105,000.**

The "$110,046 invested" working note was directionally right as a sunk-spend figure, and it also lands about right as a fresh-site replication cost. The evidenced sunk figure comes in lower (~$75K) because Nic bought used; the gap to the note is closed by the shredder invoice still to locate and the recently-bought bigger CNC (section 4b). The number was never wrong in spirit, just ahead of the paperwork.

### 4b · New capex: the bigger CNC

A larger CNC router was purchased recently, after the original Circularity bundle. It is a genuine addition to the plant, not part of the original sunk figures above. Add it as a new capex line:

| Item | Amount | Date | Entity | Status |
|---|---|---|---|---|
| Bigger CNC router | *to confirm* | *recent* | *sole trader or Pty Ltd?* | new buy, to add |

Once the figure and entity are confirmed it rolls into both the sunk total (section 3) and the replication table (section 4, replacing or sitting alongside the original CNC depending on whether a new site would buy the larger unit).

---

## 5 · The honesty flags

Three things not to paper over.

1. **The shredder is not in the connected Xero.** Every bill, transaction and bank line was searched. Telford Smith and "shredder" return nothing. The $19,800 is physically confirmed by Ben but has no record in this tenant. It is the deleted-block ghost from the earlier session. Treat it as "owned, invoice to locate."

2. **The 40ft container is unconfirmed.** The only container bill near the right size is the $5,904 Container Options one, but it is tagged to Mounty Yarns, not Goods or Farm, and was earlier flagged as on-sold. It cannot honestly be called "the Goods 40ft" until confirmed. If the farm 40ft is a different container, its bill is not in these books.

3. **The generators are two, untagged, and possibly petrol.** Orange Sky, $3,300 each, May 2025, no project tag. The facility is described as running on "a diesel generator", singular. Whether both are at the farm, whether either is the diesel unit meant, or whether there is a separate diesel buy, is unresolved.

---

## 6 · The honest line for a funder

> "What we've got today is a minimal setup at the farm. Two shipping containers, a generator, and the plant we've already put in. It presses beds. It's deliberately small so we're not locked into one shape before we know yours. About $44K of it is clean in the books, another chunk is gear we own but the paperwork is split across projects or a supplier we bought the shredder off, and there's a bit of fit-out on top. To stand up a fresh site at proper market rates is somewhere around $90K to $123K, most of it the plant itself. We'd rather show you what's real and figure the rest out together than hand you a plan that pretends we've got it all worked out."

No false certainty. It does not oversell the bookkeeping. It gives her a real range and an honest invitation.

---

## 7 · What to settle next

1. **The 40ft container:** is the $5,904 Container Options one the farm 40ft, or a different (on-sold) one?
2. **The generators:** are both at the facility, and is one the diesel genset, or is there a separate diesel buy not in these books?
3. **The shredder invoice:** locate the Telford Smith record (email, the Pty Ltd tenant, a receipt) or note it formally as "owned, invoice to locate".
4. **Generator sizing for the model:** Orange Sky units (~$3,300) or a proper diesel ($10K to $20K)? This is the widest band in section 4 and tightens the replication figure most.
5. **Sweep the corrected numbers** into `cost-model-scenarios.json` and `ask-surface.ts`: kill the "$100,000 facility + $10,046 Carbatec = $110,046 invested" line, replace with the sunk ~$75K and the replication ~$90K to $123K.

---

**Claims status:** Circularity, Carbatec, the 20ft container, crane and transport figures are **evidenced** from Xero bills at line level. The 2x generators and the $5,904 container are **evidenced but ambiguously tagged**. The shredder is **physically confirmed only, no Xero record**. Container market rates are **Ben's figures**. Fit-out lines are **estimates** at Australian market rates. The two headline totals are **arithmetic** off those inputs. The reconciliation to the phantom "$100,000 facility" is **derived here**.
