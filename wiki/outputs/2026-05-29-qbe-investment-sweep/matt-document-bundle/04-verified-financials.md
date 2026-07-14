# 04 — Verified Financials (actuals base)

**As-of:** 2026-05-29 (fresh ACT-infra Xero cross-check)
**Source:** `wiki/outputs/2026-05-29-qbe-area-04-financial-management-full-review.md` (direct query, ACT-infra Supabase `xero_invoices`, `project_code = ACT-GD`, VOIDED/DELETED excluded, queried 2026-05-29 local time); capex from `01-cost-model-idiot-index.json` (v6); entity facts from the legal-structure review.

> **Status — read first.** These are **Xero-mirror workpaper figures, NOT accountant-reviewed Goods statutory accounts.** They are honest and conservative but **not audited**. The operation is ~89% grant-funded. Several of the figures circulated in earlier passes have been superseded by this same-day pull — where that is the case it is flagged below. Use with the open-items caveat in §5.

---

## 1. Revenue & receivables (verified workpaper, 2026-05-29)

ACCREC = customer/grant invoices to Goods. Filtered to active ACT-GD rows.

| Metric | Amount (AUD) | Status |
|---|--:|---|
| ACCREC revenue invoice rows | 18 | verified data pull |
| **ACCREC total (billed)** | **732,210.79** | mixed — invoice basis, not statutory revenue |
| **ACCREC paid (received)** | **649,710.79** | verified cash-received signal |
| **ACCREC due (AR)** | **82,500.00** | verified receivable — Rotary, real, still due |

**Top paid revenue contacts:**

| Contact | Paid (AUD) |
|---|--:|
| The Snow Foundation | 402,929.79 |
| Centrecorp Foundation | 123,332 |
| Vincent Fairfax Family Foundation | 50,000 |
| Our Community Shed Incorporated | 20,265 |
| Julalikari Council Aboriginal Corporation | 19,800 |
| Red Dust Role Models Limited | 15,950 |
| QIC Limited | 12,000 |
| Mala'la Health Service Aboriginal Corporation | 5,434 |

**Revenue mix (Day-5 model on the May-12 baseline of $684,911):** donor-funded institutional distribution $611,461 (**89.3%**); direct institutional commercial $45,499 (6.6%); remainder across corporate RAP / community / government / retail. **~89% grant-funded** — this is a grant-funded social enterprise building toward commercial sustainability, not a profitable trading company today.

---

## 2. Expenses & payables (verified workpaper, 2026-05-29)

ACCPAY = supplier bills. **This is a bill-basis pull, not a deduplicated cash cost** — do not read the totals as clean cash expense.

| Metric | Amount (AUD) | Status |
|---|--:|---|
| ACCPAY supplier bill rows | 253 | data pull |
| ACCPAY total (billed) | 423,129.21 | bill basis, not deduplicated |
| ACCPAY paid (matched in Xero) | 296,251.43 | verified paid signal |
| ACCPAY "due" (raw mirror) | 126,877.78 | **a matching-gap artifact, NOT a real liability — see below** |

> **AP is genuinely ≈ $0 owed — verified 2026-05-29 by a two-sided cross-check.** The raw $126,877.78 "due" is a Xero **payment-matching gap**, not debt. Both sides were checked: (a) all 39 outstanding bills are status AUTHORISED with $0 applied; (b) bank SPEND by account confirmed every payment went out from **ACT's own business accounts** (NAB Visa ACT $177,633 + ACT Everyday $145,473 = $323,106), **$0 from any personal account**. So the bills were paid; the payment was simply never *matched* to the bill in Xero. **No real payable, no director loan, no working-capital squeeze.** Bookkeeper action: apply the existing ACT-account payments (do NOT re-pay), void a duplicate (Carla $11,180), retag 1300 Washer ($13,980 → ACT-FM).

**Expenses on a single cash basis** — the honest figure (this *replaces* the earlier "$436,612 true opex", which double-counted bills + bank spend by ~$100K+): **$323,106** total ACT-GD bank spend (~**$309,126** Goods after the 1300-Washer ACT-FM reclass). The opex/capex split inside that (~$110K is capex) is an accountant item (§6).

---

## 3. Founder time (LOCKED 2026-05-29)

| Basis | Value | Status |
|---|--:|---|
| Fair-market replacement rate (full-time, both founders) | ~$140,000/yr (≈ $560/day) | basis |
| Goods-allocated founder time | 150 days/yr — 30 production / 50 fundraising / 25 commercialisation / 45 governance | **LOCKED 2026-05-29 (Ben)** |
| **Goods founder cost** | **$84,000/yr** (150 × $560) | LOCKED |
| Production share (in the bed fixed block) | $16,800/yr (30 × $560) | LOCKED |

> **Locked, and the model includes it.** Founder time was confirmed in-session 2026-05-29: rate **$560/day** (the Day-3 fair-market $140K/yr basis; supersedes the v5 $1,000/day), FTE **150 days/yr** on Goods. The 30 production days ($16,800) sit in the bed fixed block; the other 120 days ($67,200 — fundraising/commercialisation/governance) are cost-of-capital + customer-acquisition + ACT-wide, **not** unit cost. Critically, the model does **not** only stack up because founders aren't paid: operating surplus **before** founder time is **~$340,585** (re-derives exactly: $649,710.79 received − $309,126 Goods expenses). Founder time sits on top as a **sensitivity** ($84,000/yr; ~$21K-$84K at 25-100% FTE), not a single after-founder headline — a multi-year cumulative surplus less an annual founder cost has no clean endpoint (a 1-year founder basis nets ~$256,585). FTE split remains adjustable as a model input.

---

## 4. Capex & capital position (v6 cost model)

| Item | Amount (AUD) | Confidence |
|---|--:|---|
| **Already invested** (facility $100,000 + Carbatec tooling $10,046) | **110,046** | verified |
| Gross capex to reach factory state (low–high) | 112,000 – 222,000 | modelled (equipment not firm-quoted) |
| Net capital ask as stated in cost model | 90,000 – 200,000 | modelled — **see flag** |

> **Discrepancy flag (flagged in the master sweep itself).** The stated **net** capital ask of $90K–$200K is internally inconsistent: $112K–$222K gross capex *less* the $110,046 already invested = **~$2K–$112K**, not $90K–$200K. Resolve before quoting any capital number to QBE — either quote **$112K–$222K gross** (and drop "less already invested"), or quote the net **~$2K–$112K**. This is also a different quantity from the QBE match cap. *Owner: Ben.*

**Cashflow context** (modelled, Day 6/7/9): base-case opening cash placeholder $50,000 (most important open input); base trough ~−$94,483 (Aug 2026); downside ~−$171,000 (Nov 2026); upside ~−$15,000 (Aug 2026). Base capital stack assumes QBE $400K (Sep 2026) + SEFA $300K (Nov 2026) + anchor philanthropy $500K (Jan 2027).

**GST:** ~**$29,657 net payable** per the 2026-05-29 Xero `total_tax` query (output GST $62,019 − input GST $32,362) — a **rough signal only** (grants may be GST-free, so the BAS net will differ). Accountant confirms the actual BAS position (§6).

---

## 5. Entity & legal basis

| Fact | Status |
|---|---|
| Trades today through Nicholas Marchesi as sole trader | ABN 21 591 780 066 (verified) |
| Go-forward trading/operating company | **A Curious Tractor Pty Ltd — ABN 36 697 347 676, ACN 697 347 676**, t/a Goods on Country. Verified via ASIC/ABN check 2026-05-29: active Australian private company, registered 21 Apr 2026, registered office Witta QLD 4552. Migrates this FY (FY2026-27). |
| Charity / DGR home (from FY2026-27, ~1 July 2026) | **The Butterfly Movement Ltd** — verified active ACNC charity, PBI, Item 1 DGR (ABN 22 155 132 684; ABN Lookup 6 May 2026). DGR is **only ever via Butterfly**, never via Goods / A Curious Tractor directly. |
| A Kind Tractor Ltd | dormant, not used (not the trading entity, not the charity, not DGR) |

---

## 6. Open accountant items (the investor-readiness gap)

The remaining gap is not "no finance work exists" — it is conversion into a single **accountant-reviewed Goods-only financial pack**. Outstanding items the accountant/bookkeeper must sign off before any of the above is presented as audited:

1. **ACT-ST → ACT-GD carve-out** — Goods sits inside ACT's books; produce a clean Goods-only carve-out. (All revenue historically tagged ACT-ST/Foundation; ~$120K of mistags identified for retag, incl. Centre Canvas $14,915 ACT-IN→ACT-GD.)
2. **Opex / capex split** — which spend is operating vs capitalised plant/inventory.
3. **GST / BAS treatment** — confirm the net GST position (the ~$29,657 is a rough Xero `total_tax` signal, not a filed BAS).
4. **R&D treatment** — Defy design + Samuel Hafer $19.5K and similar pre-commercial spend (R&D Tax Incentive scope).
5. **Payables reconciliation** — apply the existing ACT-account payments to the AUTHORISED bills in Xero so the ledger matches reality. (Resolved 2026-05-29: the $126,877.78 is a matching gap, not debt; also void the Carla $11,180 duplicate and retag 1300 Washer → ACT-FM.)
6. **~$94.5K untagged revenue** — reconcile invoices not yet attributed.
7. **Bookkeeper reconciliation** — bank-feed vs ledger, de-duplication, single-cash-basis expense.
8. **Founder FTE / rate** — RESOLVED 2026-05-29: $560/day, 150 days/yr (30/50/25/45) locked = $84K/yr Goods founder cost. (Accountant may still refine the fair-market rate; FTE split stays adjustable.)
9. **Net-vs-gross capital ask** ($90K–$200K vs ~$2K–$112K — see §4).

**What we will NOT overclaim:** audited profitability, financial self-sufficiency, committed capital, or any margin built on materials-only COGS. CRM pipeline figures (~$3.42M active / $604K weighted) are **internal only** — not committed capital and not QBE-match evidence. v2 `orders` totals (~$90 live) are not sales proof. The honest line for the meeting: real evidence and a full model trail exist; the one remaining investor-readiness gap is a single accountant-reviewed Goods-only pack with a clear "not audited" caveat.
