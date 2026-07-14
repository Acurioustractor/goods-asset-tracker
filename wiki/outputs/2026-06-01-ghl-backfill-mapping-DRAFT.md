# GHL Opportunity Backfill Mapping — DRAFT for sign-off

**Created:** 2026-06-01 · **Status:** DRAFT — no writes made yet. Mark up / approve, then I run it.
**Scope:** classify the 158 opps across the 3 Goods pipelines into the new fields
(Funding type · Match-eligible (QBE) · Capital status · Amount basis · Xero invoice #).
Xero contact ID + Actual paid (Xero) AUD are left for the Layer-B sync.

## Default cohort rules (apply unless overridden below)

| Pipeline / stage | Funding type | Match-eligible | Capital status |
|---|---|---|---|
| Supporter · Identified | Philanthropic | **TBC** | Signal |
| Supporter · Cultivating | Philanthropic | TBC | Signal |
| Supporter · Qualified | Philanthropic | TBC | Signal |
| Supporter · Ask made | Philanthropic | TBC | Ask made |
| Supporter · Stewarding/Reporting | Grant | **Yes** | **Paid** |
| Supporter · Renewing | Philanthropic | TBC | Paid |
| Supporter · Delivering | Commercial sale | No | Invoiced |
| Buyer · (all stages) | Commercial sale | No | Signal |
| Demand · Signal | Demand signal | No | Signal |
| Demand · Buyer Matched | Commercial sale | No | Signal |

Amount basis = **Estimate** for everything by default (the Layer-B sync flips paid/invoiced rows to Invoiced / Xero-actual).

## Named overrides & flags (where we know better than the stage)

### A. The "$201,900 phantom" — RESOLVED by direct Xero query (2026-06-01)
Queried ACT-infra `xero_invoices` across ALL project codes. The "phantom" framing was wrong:
| Opp | $ (claim) | Verified in Xero | Funding type | Match | Capital status | Note |
|---|---|---|---|---|---|---|
| FRRR | 50,000 | ✅ **= VFFF INV-0253 $50,000 PAID 2025-07-24 (ACCREC, ACT-GD)** | Grant | **Yes** | **Paid** | ⚑ **DO NOT double-count with VFFF** — same joint $50K "Backing the Future". FRRR administers, VFFF is the Xero contact. |
| The Funding Network (TFN) | ~130–144K | ✅ **RECEIVED, but MIS-BOOKED** (Ben confirms: TFN disbursed the Bupa pledge + grant to Goods). In Xero it shows ONLY as 2 Dext-imported **expense bills** ($89,361 + $55,197, acct 429 "Operations", ACT-CE, $0 paid) + a real $6,500 event fee. No income/ACCREC/bank-receipt entry exists. | **Grant** | **Yes** | **Paid** | ⚑ **Bookkeeper (live Xero):** void the 2 Dext bills, find the bank deposit, recode as **ACT-GD grant income**. Keep the $6,500 as TFN fee. |
| AMP Foundation | 21,900 | ❓ **not in mirror** (only Ampol fuel bills match) | Philanthropic | **TBC** | **Ask made** | ⚑ AMP SPARK "June 2024" may predate mirror / other entity — confirm vs 2024 record |

### B. Confirmed-paid grants in Stewarding → Match-eligible = Yes, Capital status = Paid
| Opp | $ (GHL) | Match | Note |
|---|---|---|---|
| Snow Foundation | 402,930 | Yes | Xero-confirmed (FY 264k / cum 402,930) |
| Centrecorp Foundation | 123,332 | Yes | ties exactly to Xero |
| Vincent Fairfax Family Foundation | 50,000 | Yes | paid (memory) |
| Red Dust | 15,950 | Yes | paid (memory) |
| QIC | 12,000 | Yes? | ⚑ confirm QIC counts toward match |

### ⚑ C. Mis-staged vs Xero (move on the money ladder)
| Opp | Stage now | Proposed Capital status | Funding type / Match | Xero |
|---|---|---|---|---|
| Rotary Eclub Outback Australia (82,500) | Ask made | **Invoiced** + Amount basis=Invoiced, Xero inv **INV-0222** | Philanthropic / TBC | ⚑ 402 days overdue — collect or write off |
| Homeland School Company (44,000) | Delivering | Invoiced + Amount basis=Invoiced, Xero inv **INV-0303** | Commercial sale / No | due 30 Jun |

### ⚑ D. Not actually grant capital — reclassify to Other/exclude
| Opp | Funding type | Match | Note |
|---|---|---|---|
| QBE Foundation (2,000,000) | Philanthropic | **No** | ⚑ QBE is the *matcher*, not match-eligible capital |
| REAL Innovation Fund (DEWR) (2,000,000) | Grant (govt) | **TBC** | ⚑ government — confirm if QBE match allows govt |
| Eloise Hall — Impact Investor | Other | No | impact *investment*, not a grant |
| Philanthropy Australia | Other | No | membership body, not a funder |
| Garma Festival — Beds Showcase | Other / Demand signal | No | event, not a funder |
| Centre Canvas (Buyer, abandoned) | Other | No | ⚑ a *supplier* misfiled in Buyer — leave abandoned/exclude |

### E. Tier-1 match candidates (warm) → Match-eligible = Yes (still Signal until asked)
Minderoo Foundation (200,000) · Paul Ramsay Foundation · Tim Fairfax Family Foundation · The Ian Potter Foundation · The Bryan Foundation · Dusseldorp Forum · The John Villiers Trust · Brian M Davis Charitable Foundation.
⚑ Dusseldorp ($16.5k) and John Villiers (INV-0327, +$1,200 drift) have Xero activity but sit at $0/Cultivating — reconcile.

### F. Community/Aboriginal-corp small payments (judgment)
| Opp | $ | Proposed | Note |
|---|---|---|---|
| Julalikari Council Aboriginal Corp | 19,800 | Community contribution / No / **Paid** | paid (memory) |
| Our Community Shed | 20,265 | Philanthropic / TBC / Paid | renewing — confirm |
| Mala'la Health Service Aboriginal Corp | 5,434 | Community contribution / No / Verbal yes | small |
| Anyinginyi / Miwatj / NPY / Ampilatwatja / WHSAC / NLC etc. (Buyer) | — | Commercial sale / No / Signal | community *buyers* |

## Post-backfill rollup preview (what the overview will then show)

- **Secured match-eligible (Paid + Match=Yes, philanthropic):** Snow 402,930 + Centrecorp 123,332 + VFFF 50,000 + Red Dust 15,950 (+ QIC 12,000 if counted) ≈ **$592–604k** — *not* the $16.4M face value.
- **Committed (Signed LOI/Contracted):** **$0** — the QBE gate, still open.
- **Phantom removed from "paid":** $201,900 (TFN/FRRR/AMP) reclassified to Ask made/TBC.
- **Aspirational (Ask/Signal), labelled:** QBE 2M + REAL 2M + WHSAC 1.7M + Demand signals 9M + … — clearly *not* secured.

## Open decisions for Ben (the ⚑ rows)
1. Phantom $201,900 — exclude from match? (proposing yes → TBC/Ask made)
2. QIC $12k — counts toward match?
3. REAL Innovation Fund (govt $2M) — does QBE match allow government grants?
4. Rotary $82,500 — collect or write off the 402-day invoice?
5. Reconcile Dusseldorp / John Villiers Xero activity vs their $0 GHL stage.
