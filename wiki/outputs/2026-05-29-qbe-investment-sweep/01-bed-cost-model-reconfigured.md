# Goods Stretch Bed — Cost Model Reconfigured (v6)

**Date:** 2026-05-29
**Author:** Claude (QBE investment sweep), first-principles cost engineering pass
**Reconfigures:** `v2/src/lib/data/cost-model-scenarios.json` (v5, 2026-05-28). This does NOT rebuild from scratch — it keeps v5's verified-from-invoice BOM and re-frames the parts the founder flagged as distorted (the "$1,912/bed" fully-loaded number, the all-founder-time-on-COGS allocation).
**Spreadsheet companion:** `01-cost-model-idiot-index.json` (same folder).

**Claim labels used throughout:** `verified` (OCR'd from a named invoice or read from a primary record) · `modelled` (derived/calculated, not directly observed) · `target` (a goal volume/cost, not a commitment) · `future` (a state we have not yet reached) · `internal only` (working figure, not for external quoting).

---

## 0. The founder's complaint, stated plainly

The v5 model produces a headline "fully-loaded **$1,912/bed**" at today's ~100 beds/yr. That number is **arithmetically correct but economically misleading**, and the founder is right to push back. It is a *fixed-cost-absorption* artefact: it takes a year's worth of founder time, facility rent, and field-travel and divides it by an artificially small denominator (100 beds). Run a factory at 2% utilisation and *any* product looks like it costs a fortune per unit. That is not the marginal cost of the next bed, and it is not the cost the bed will carry at scale.

This reconfiguration does four things:

1. **Idiot-index** every element so the cost-down levers are obvious (the HDPE kit is the whole game).
2. **Make the three Defy paths comparable per bed** so "buy kit vs buy panel vs buy shred" is a clean decision.
3. **Split the "$1,912" into honest pieces**: a true *marginal* cost per bed + an *annual fixed block* recovered across volume AND philanthropy + a *breakeven volume*.
4. **Re-allocate founder time** so only the production share touches unit cost; fundraising and commercialisation days are treated as cost-of-capital and customer-acquisition, with an explicit map of which cost *elements* philanthropy funds vs which are recovered commercially.

---

## 1. Idiot Index — element by element

**Principle (Musk):** `idiot_index = current_paid ÷ raw_material_floor`. A high index is not waste — it is the value-add (and supplier margin) you could capture by in-sourcing. It tells you *where the capital case lives*.

| Element | Raw floor $/bed | Currently paid $/bed | Idiot index | Biggest lever? | What the markup buys / how it comes down |
|---|--:|--:|--:|:--:|---|
| **HDPE kit (Defy, cut+finished)** | 40.00 `verified` (20kg × $2.00/kg shred floor, INV-1731) — or **16.00** `modelled` (20kg × $0.80/kg raw-polymer, Envirobank) | 344.05 `verified` (INV-1602/1732) | **~8.6×** vs shred floor; **~21.5×** vs raw polymer | **YES** | Shred + hot-press + CNC + finishing + Defy margin. In-sourcing press+CNC moves **~$289/bed** (to factory-path $55 plastic + $95 process). This is the headline capital case. |
| HDPE *panel* path (alt) | 40.00 `verified` | 400.00 `verified` (2 × $200, INV-1731) | **~10.0×** | no (avoid) | Hot-press + Defy margin only. **Worst value of the three Defy paths** — you pay press margin but still CNC + assemble yourself. Only use if our press is down. |
| Steel poles (DNA Steel, finished) | 10.34–15.00 `modelled` (1.88 m × $5.50/m, Brisbane Steel rate) | 27.00 `verified` (DNA Steel, Notion BOM) | ~1.8–2.6× | no | Cut-to-length + drill + Alice Springs delivery. Already reasonable; local-procurement value (NT preference) worth the premium. |
| Canvas (Centre Canvas, finished) | 32.00–45.00 `modelled` (2.1 m × $15–20/m raw 12oz) | 93.50 `verified` (3 invoices, 270 covers) | ~2.1–2.9× | secondary | Cut + hem + grommet + sew + sewist labour. Competitive vs raw-self-sew ($130/bed at $62/m retail). Lever only opens with an in-house sewing line at volume. |
| End caps | 0.50–0.80 `modelled` | 0.80 `verified` (4 × $0.80) | 1.0–1.6× | no | Near cost. Bulk-supplier direct. |
| Screws | 0.05–0.07 `verified` (Coastal Fasteners) | 0.065 `verified` (16 × $0.065) | ~1.0× | no | At raw rate already. |
| Bolts | 0.30 `modelled` | 0.50 `inferred` (2 × $0.50 est) | ~1.7× | no | Rate estimated, pending line-item OCR. Trivial $ impact. |
| Defy assembly labour | 40–80 `modelled` (in-house equiv) | 55.95 `verified` (Defy line, 2026-03-19) | ~0.7–1.4× | no | Already competitive with in-house ($40–80). In-sourcing assembly is a *jobs/mission* move, not a *cost* move. |

**Read:** one element — the HDPE kit at ~8.6× (vs the $2/kg Defy shred floor), or ~21.5× against a $0.80/kg Envirobank raw-polymer floor — accounts for essentially the entire in-sourcing prize. Everything else is within 1–3× of raw and not worth capex. **The capital ask is a plastic-processing capital ask, full stop.**

First-principles floor (v5's own number, retained): **$128.99/bed** `modelled` if every input were bought raw and assembled at industry-low labour. Current Defy-kit direct = **$469.79** `verified`. Gap = **$340.80/bed** of supply-chain markup, of which ~$289 is the HDPE kit alone.

---

## 2. Defy — three paths, compared per bed

Defy will sell us the plastic legs in three forms. Per-bed, apples-to-apples, what each buys:

| Path | What Defy does | What WE do | Plastic cost/bed | Idiot index | Verdict |
|---|---|---|--:|--:|---|
| **(a) Finished kit** | Shred → press → CNC → finish | Assemble only | **$344.05** `verified` | 8.6× | **Best bought-in path today.** Fastest ramp, no capex. Pay full markup. |
| **(b) Pre-pressed panels** | Shred → press | CNC + assemble | **$400.00** `verified` (2 × $200) | 10.0× | **Worst value.** You pay press margin AND still own the CNC + assembly. Never the right choice unless our press is broken. |
| **(c) Raw shred** | Supply bagged shred | Shred?/press + CNC + assemble | **$55.00** `verified` ($2/kg + $0.75/kg delivery, 20kg) | ~1.4× (on plastic input) | **Target.** Requires our press + CNC. This is the factory path. |

**The Defy margin, made explicit:** kit $344.05 − raw shred $55 = **$289.05/bed** is the value-add + margin Defy captures between "bag of shred" and "finished legs." That $289/bed × volume is the prize the capex chases. At 500 beds/yr `target` that is **~$144,500/yr** of value currently leaving the building — which is why the $112–222K gross capex pays back inside ~1–2 years at target volume (see §3).

Supporting Defy rates (all `verified` from invoices): cut-and-finish only (we supply sheets) = **$121.00**; assembly labour = **$55.95**; shred = **$2.00/kg**; delivery = **$0.75/kg**.

---

## 3. Shredding / Factory economics + capex payback

The in-house "Factory" path (state_4): **raw shred → hot-press → CNC → assemble**.

### Per-bed factory cost build-up (`verified` rates, `modelled` allocation)

| Line | $/bed | Basis |
|---|--:|---|
| HDPE shred (20kg @ $2.75/kg incl. delivery) | 55.00 | `verified` INV-1731 |
| Diesel (25 L/day ÷ 5 beds, press + CNC) | 15.00 | `modelled` |
| Operator labour ($400/day ÷ 5 beds) | 80.00 | `modelled`, rate `verified` |
| Steel poles (DNA Steel) | 27.00 | `verified` |
| Canvas (Centre Canvas) | 93.50 | `verified` |
| Caps + screws + bolts | 5.24 | `verified`/`inferred` |
| **Factory direct total** | **275.74** | `modelled` total |

vs **Defy-kit direct $469.79** → factory saves **$194.05/bed at the materials/process line**, plus it brings the $289 plastic markup in-house.

### The in-house *legs* comparison (the actual decision)

- Bought-in legs (Defy kit): **$344.05/bed**
- In-house legs (factory): plastic $55 + diesel $15 + labour $80 = **$150/bed** `modelled`
- **Saving per bed on legs alone: ~$194/bed**

### Capex required to reach the Factory state

| Item | Low | High | Source |
|---|--:|--:|---|
| Shredder | 15,000 | 30,000 | `modelled` (v5) |
| Hot-press line | 80,000 | 150,000 | `modelled` (v5) |
| CNC router | 15,000 | 40,000 | `modelled` (v5) |
| Workbench/tools | 2,000 | 2,000 | `modelled` |
| **Total capex (GROSS ask)** | **112,000** | **222,000** | the QBE/philanthropy ask |
| less already invested (facility $100K + Carbatec $10,046) | | | `verified` (spend records) |
| **Net capital ask** (after $110,046 invested) | **~2,000** | **~112,000** | alternative framing |

### Payback (on the ~$194/bed in-house-legs saving)

| Volume | Annual saving (@ $194/bed) | Payback on $112K gross | Payback on $222K gross |
|---|--:|--:|--:|
| 100 beds/yr `verified` today-ish | $19,400 | ~5.8 yr | ~11.4 yr |
| 500 beds/yr `target` | $97,000 | **~1.2 yr** | ~2.3 yr |
| 1,000 beds/yr `future` | $194,000 | ~0.6 yr | ~1.1 yr |

**Read:** capex only makes sense *above* ~300 beds/yr. At today's 100/yr the payback is too slow — which is exactly why the honest sequence is **buy Defy kits now, in-source when committed volume crosses ~300/yr** (see §6). The capex is a *scale* investment, not a *today* investment. (Capex payback ignores the founder-fundraising days needed to raise it — those are accounted as cost-of-capital in §5, not loaded onto the bed.)

---

## 4. THE FIX — naive "$1,912/bed" vs honest marginal + fixed block

### What v5 does (the distortion)

v5's `overhead_per_volume` at 100 beds/yr loads onto every bed:

| Overhead line (v5, per bed @ 100/yr) | $/bed | What it really is |
|---|--:|---|
| Kirmos facility | 270 | **Fixed** annual cost ($2,250/mo × 12 = $27,000) |
| Founder production time | 168 | **Fixed** annual (30 days × $560 = $16,800) |
| Admin | 147 | **Fixed** annual (~$14,700) |
| Field travel | 510 | **Fixed** annual (~$51,000) — community-relationship cost, not per-bed |
| Long-haul freight | 150 | **Variable** — belongs in marginal cost, misclassified as overhead |
| **v5 overhead total** | **1,245** | (v5-as-printed was $1,377 at the old $1,000/day founder rate; $1,245 reflects the LOCKED $560/day) |

Added to Defy-kit direct $534.79 → **~$1,780/bed** at the locked $560/day founder rate (v5 printed **$1,912/bed** using the old $1,000/day rate — that headline is still quoted below as the figure being debunked). The problem: four of those five lines are a *fixed annual block* that does not grow with the next bed. Dividing it by 100 is the entire distortion.

### The honest structure

Separate the three things that v5 fuses:

**(a) Marginal / variable cost per bed** — what the next bed actually costs (Defy-kit path today):

| Line | $/bed |
|---|--:|
| Direct materials (BOM) | 469.79 `verified` |
| In-house assembly labour | 40.00 `modelled` |
| Local freight on Defy material | 25.00 `modelled` |
| Long-haul freight to community | 150.00 `modelled` (reclassified out of overhead) |
| **Marginal cost per bed (Defy-kit, today)** | **~684.79** `modelled` |

Factory-path marginal (when in-sourced): **$275.74 + $150 long-haul = ~$425.74/bed** `future`.

**(b) Annual fixed block** — recovered across volume + philanthropy, NOT per-bed:

| Fixed line | Annual $ | Basis |
|---|--:|---|
| Kirmos facility (50% to beds) | 27,000 | `verified` ($2,250/mo) |
| Founder *production* time (30 days @ $560) | 16,800 | `modelled`, rate LOCKED 2026-05-29 |
| Admin | 14,700 | `modelled` |
| Field travel (community relationships) | 51,000 | `modelled` |
| **Annual fixed block** | **~109,500/yr** | the number to recover, not divide naively |

(Founder *fundraising* $50K and *commercialisation* $25K are deliberately NOT here — see §5.)

**(c) Breakeven volume** — at the $750 price `verified`, factory-path marginal $425.74, contribution = **$324.26/bed**. Fixed block $109,500 ÷ $324.26 = **~338 beds/yr** to cover the fixed block from margin alone (before any philanthropy). On the Defy-kit path (contribution $750 − $684.79 = $65.21) breakeven is ~1,679 beds/yr — i.e. **you cannot cover fixed costs on the bought-in path; in-sourcing is what makes the unit economics close.**

### Side-by-side so the distortion is obvious

| Framing | Today (100/yr) | Target (500/yr) | What it means |
|---|--:|--:|---|
| **Naive v5 "fully-loaded"** | **$1,912/bed** | $878/bed | Fixed block ÷ tiny denominator. Misleading. |
| **Honest marginal cost** | **~$685/bed** (Defy-kit) | ~$426/bed (factory) `future` | What the next bed costs. |
| **+ Honest fixed block** | **+$109,500/yr** (recovered by margin + grants) | +$109,500/yr | A block to fund, not a per-bed tax. |
| Fixed-block ÷ volume (for reference only) | $1,095/bed | $219/bed | Shows the absorption effect shrinking with scale. |

**The one-liner for QBE:** *"The next Stretch Bed costs ~$685 to make today and ~$426 once we in-source plastic processing. Separately, the enterprise carries a ~$109.5K/yr fixed block (facility, founder production time, community field travel) that philanthropy funds today and bed margin covers at ~340+ beds/yr. The '$1,912' figure is fixed-cost absorption at pilot volume, not a marginal cost."*

---

## 5. Founder time — reallocation + fundraising linkage

**Principle:** founder time is not one cost. Split it by *what it produces*, and only the production share is allowed to touch unit cost. v5 already does the right split in `founder_time_allocation` — this section makes the *funding linkage* explicit (which v5 leaves implicit).

`rate_per_day = $560`, `total = 150 days/yr` — **rate LOCKED 2026-05-29** to the Day 3 fair-market basis ($140K/yr at 250 days = $560/day). (Days/yr still FOUNDER-CONFIRM — not time-tracked.)

| Activity | Days/yr | Annual $ | Treatment | Touches unit cost? |
|---|--:|--:|---|:--:|
| Production / ops | 30 | 16,800 | In the **annual fixed block** (§4b); amortizes toward $0 with volume | Yes (shrinking) |
| Fundraising / philanthropy | 50 | 28,000 | **Cost of capital** — these days RAISE the philanthropic dollars that fund the capex + fixed block | No |
| Commercialisation / buyer-dev | 25 | 14,000 | **Customer acquisition** — recovered through price/margin across an order | No (recovered in margin) |
| Governance / strategy / brand | 45 | 25,200 | **ACT-wide overhead** — not a Goods unit cost at all | No |
| **Total** | **150** | **84,000** | (at $560/day) | |

### per_bed_wrong vs per_bed_right

- **per_bed_wrong** = all 150 founder days ÷ 100 beds = $84,000 ÷ 100 = **$840/bed**. (The absurd number — treats fundraising and governance as if they were assembly labour.)
- **per_bed_right** = production share only, amortized = $16,800 ÷ 100 = **$168/bed today**, → $33.60 at 500/yr → $16.80 at 1,000/yr. (And even this sits in the fixed block, recovered by margin + grants, not stamped on the sticker.)

### The funding linkage (which elements are funded how)

| Cost element | Funded by | Why |
|---|---|---|
| Plant / capex ($112–222K gross; ~$2–112K net after $110,046 invested) | **Philanthropy** (QBE match + 2nd funder) | One-off capability build; the 50 founder fundraising-days exist to raise exactly this |
| Training (Defy $6K/session, operator upskilling) | **Philanthropy / employment grants** | Workforce development, mission cost |
| R&D (Defy design, Samuel Hafer $19.5K `verified`) | **Philanthropy / R&D Tax Incentive** | Pre-commercial |
| Annual fixed block (~$109.5K/yr) | **Philanthropy today → bed margin at scale** | Bridges to commercial sustainability |
| Per-bed variable (materials, assembly, freight) | **Commercial** (bed price $750) | The bit a buyer pays for |
| Founder commercialisation (25 days) | **Recovered in margin** across the orders those days land | Customer-acquisition cost |

**The investor sentence:** *"Founder fundraising days are not a bed cost — they are how we raise the philanthropic capital that funds the plant. Founder commercialisation days are recovered in the margin of the orders they win. Only the 30 production days touch the bed, and that line falls from $168/bed at 100/yr toward $17/bed at 1,000/yr."*

`fundraising_offset` (v5, `internal only`): 50 philanthropy days × ~$5,000/day raised `modelled` = ~$250K/yr raised; commercial benchmark $801/bed `verified` (Centrecorp INV-0291, 107 beds @ $85,712). These validate that fundraising days *fund the block* and commercial days *recover in margin* — they are not unit costs.

---

## 6. Cost-down trajectory — explicit, volume + in-sourcing milestones

Each step ties to BOTH a volume AND an in-sourcing milestone, so it is defensible rather than magic.

| Stage | Trigger (volume + milestone) | Plastic legs $/bed | Direct total $/bed | Marginal $/bed (incl. freight) | Label |
|---|---|--:|--:|--:|---|
| **0. Defy kits** | Today, ~100/yr, no in-house plant | 344.05 | 469.79 | ~685 | `verified` |
| **1. In-source assembly** | ~150–300/yr, $2K bench + trained operators | 344.05 | 469.79 (legs still bought) | ~660 (assembly saved) | `target` |
| **2. In-source pressing+CNC (Factory)** | **~300–500/yr committed**, $112–222K gross capex deployed | ~150 | 275.74 | ~426 | `target`/`future` |
| **3. Community + free waste plastic** | Vision, ~1,000/yr, CDP/volunteer labour + council-paid feedstock | ~27 (steel only dominates) | 140.74 | ~291 | `future` |

**Fixed block per bed (absorption, reference only):** $1,095 (100/yr) → $219 (500/yr) → $110 (1,000/yr). The honest claim is not "the bed gets to $140" — it is "**marginal cost falls to ~$426 once we in-source plastic, and the fixed block stops dominating once volume crosses ~340/yr.**"

**Explicit assumptions (defensible, not magic):**
- 250 working days/yr; factory throughput 4–5 beds/day = ~1,000 beds/yr capacity per facility `modelled`.
- In-sourcing capex deployed only when *committed* (not hoped) volume ≥ ~300/yr — below that, Defy kits are cheaper all-in once payback is counted.
- $750 price held flat `verified` (current shop price). No price increase assumed in the cost-down story.
- Community/free-plastic stage assumes council waste-offset revenue and CDP/employment-grant labour — both `future`, not yet contracted.

---

## 7. Critical review — every number, sourced

Confidence: `verified` (OCR/primary record) · `inferred` (derived, one source) · `unverified` (taken on faith) · `wrong` (incorrect, fix needed).

| Item | Value | Source | Confidence | Issue | Recommended fix |
|---|--:|---|---|---|---|
| HDPE kit (Defy) | $344.05 | INV-1602 (92) + INV-1732 (50) | verified | — | Get volume quote at 500/1,000/5,000 — this is the swing number |
| Steel poles | $27.00 | DNA Steel, Notion BOM | verified | Invoices in Notion, NOT in ACT-GD Xero mirror | Pull Notion invoices to confirm $27 + get volume |
| Canvas | $93.50 | Centre Canvas, 3 invoices 270 covers | verified | Tagged ACT-IN in Xero; $10,285 duplicate to reconcile | Retag ACT-IN→ACT-GD ($14,915); reconcile duplicate |
| End caps | $3.20 (4×$0.80) | Hardware supplier | verified | — | — |
| Screws | $1.04 (16×$0.065) | Coastal Fasteners RB20247673190 | verified | Tagged ACT-FM, shared with facility | Split-tag to ACT-GD |
| Bolts | $1.00 (2×$0.50) | estimate | inferred | Rate estimated | Confirm on next Coastal invoice line-item OCR |
| Defy-kit direct total | $469.79 | sum of BOM | verified | — | — |
| Defy panel each | $200.00 | INV-1731 (20 panels) | verified | — | — |
| Defy cut+finish only | $121.00 | INV-1602 (16 beds, pre-paid sheets) | verified | — | — |
| Defy assembly labour | $55.95 | Defy line 2026-03-19 | verified | — | — |
| HDPE shred rate | $2.00/kg | INV-1731 (1200kg bag) | verified | — | — |
| Delivery rate | $0.75/kg | INV-1731 ($900/1200kg) | verified | — | — |
| Raw HDPE/bed (no delivery) | $40.00 | 20kg × $2/kg | verified | — | — |
| Raw HDPE/bed (with delivery) | $55.00 | 20kg × $2.75/kg | verified | — | — |
| HDPE kg/bed | 20 kg | Ben confirmed | verified | — | — |
| Factory direct total | $275.74 | modelled build-up | modelled | Diesel + labour allocation are estimates | Validate via SIH advisory cost tool |
| Diesel/bed (factory) | $15.00 | 25L/day ÷ 5 beds | modelled | Allocation estimate | Meter actual fuel at facility |
| Operator labour/bed (factory) | $80.00 | $400/day ÷ 5 beds | modelled | Throughput 5/day unproven at facility | Time-study a real run |
| Production operator/day | $400 | v5 labour_rates | inferred | Rate not invoice-tied | Confirm against payroll/contractor rate |
| Kirmos facility/mo (50% to beds) | $2,250 | $4,500/mo invoice × 50% | verified (invoice); inferred (50% split) | 50% allocation is an estimate | Confirm beds-vs-other split with Nic |
| First-principles floor | $128.99/bed | v5 modelled | modelled | Benchmark, not achievable today | Keep as aspirational floor only |
| Steel raw rate | $5.50/m | Brisbane Steel Xero | verified (rate) | Applied to floor calc only | — |
| Canvas raw 12oz | $15–20/m | wholesale benchmark | unverified | No quote obtained | Get a raw-canvas quote to firm the index |
| Founder rate/day | $560 | Day 3 $140K/yr at 250 days | **LOCKED 2026-05-29** | — | — |
| Founder days/yr on Goods | 150 | v5 assumption | **unverified — FOUNDER-CONFIRM** | Not time-tracked | Ben/Nic confirm FTE % |
| Founder split 30/50/25/45 | days | v5 assumption | **unverified — FOUNDER-CONFIRM** | Allocation not evidenced | Ben/Nic confirm activity split |
| Founder production/bed @100 | $168 | $16,800 ÷ 100 | modelled | Production share at $560/day | — |
| Field travel/bed @100 | $510 ($51K/yr) | v5 | modelled | Community-relationship cost, lumpy | Treat as fixed block, not per-bed |
| Admin/bed @100 | $147 ($14.7K/yr) | v5 | modelled | Source not itemised | Tie to actual admin spend |
| Long-haul freight/bed | $150 | v5 overhead line | **wrong (classification)** | Listed as overhead; it is **variable** per bed | Move into marginal cost (done in §4) |
| Local freight/bed | $25.00 | v5 estimate | modelled | — | Confirm vs Loadshift/Peak Up actuals |
| Annual fixed block | ~$109,500/yr | §4 recompute (founder production @ $560/day) | modelled | Built from above modelled lines | Lock after founder-confirm |
| Marginal cost (Defy-kit, today) | ~$684.79/bed | §4 recompute | modelled | — | — |
| Marginal cost (factory) | ~$425.74/bed | §4 recompute | future/modelled | Assumes in-house plant live | — |
| Breakeven volume (factory) | ~338 beds/yr | $109.5K ÷ $324.26 | modelled | Sensitive to fixed block + price | Re-run after founder-confirm |
| Naive fully-loaded @100 | $1,912/bed | v5 fully_loaded_grid | verified (arithmetic) | **Misleading framing** | Always pair with marginal + fixed (§4) |
| Capex to state_4 | $112K–$222K | v5 modelled | modelled | Equipment not yet quoted firm | Get firm shredder/press/CNC quotes |
| Capital ask (gross) | $112K–$222K | full capex (pre-credit) | modelled | — | — |
| Capital ask (net) | ~$2K–$112K | capex − $110,046 invested | modelled | — | — |
| Defy margin/bed (kit − shred) | $289.05 | $344.05 − $55 | modelled | — | The in-sourcing prize |
| Payback @500/yr on $112K gross | ~1.2 yr | $112K ÷ $97K | modelled | Depends on hitting 500/yr | Tie capex draw to committed volume |
| $750 price | $750 | shop (stretch-bed-single) | verified | — | — |
| Commercial benchmark | $801/bed | Centrecorp INV-0291 | verified | Grant-funded, not open-market | Don't quote as market price |
| Counterfactual steel-frame bed | $1,500–$2,000 | AU 2026 market scan | inferred | No firm quotes | Get 2–3 retail quotes to firm |
| Philanthropy $/founder-day | ~$5,000 | v5 estimate | unverified | Not evidenced | Back-test against actual raises |
| Xero per-bed proxy | $991.49/bed | act-infra last-50 window | modelled | Dominated by non-production cost | **Do NOT quote as actual** (per act-infra audit) |
| Fully-loaded $600 (codebase) | $600/bed | FRRR + Day 4 | modelled | Low-volume planning figure | Keep as planning anchor; not marginal |

**Gaps / missing sources:** all five scoped READ-FIRST files were present and read. The `tmp/qbe-sweep/digests/diagnostic-v4.md` and `act-infra-scan.md` were both present and incorporated (they confirmed the v3→v5 lineage, the $991.49/bed proxy caveat, and the $120K mistag list). No figure in this doc was invented; every number traces to v5, supplier-quotes.ts, the COGS reconciliation, the Day 3/Day 4 docs, or the digests.

---

## 8. Key changes from v5

1. Reframed the misleading **"$1,912/bed fully-loaded"** into **marginal (~$685 today / ~$426 factory) + annual fixed block (~$109.5K/yr) + breakeven (~338 beds/yr)**.
2. **Reclassified long-haul freight ($150/bed)** out of "overhead" and into marginal cost — it is variable, not fixed (flagged `wrong` in v5).
3. Made the **Defy three-path comparison** an explicit per-bed decision table and named the **$289/bed Defy margin** as the in-sourcing prize.
4. Computed **capex payback by volume** (only sensible above ~300/yr) and tied capex draw to *committed* volume.
5. Made the **founder-time funding linkage explicit**: per_bed_wrong ($1,500) vs per_bed_right ($300→$30), with a map of which elements philanthropy funds vs which are recovered commercially.
6. **Locked the founder day-rate at $560** (Day 3 $140K/yr ÷ 250 days, LOCKED 2026-05-29); the 150-days/yr total and 30/50/25/45 split remain FOUNDER-CONFIRM (not time-tracked).
7. Tagged **every claim** verified/modelled/target/future/internal-only and gave every number a source + confidence + fix in the critical-review table.
