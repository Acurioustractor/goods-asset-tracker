# What it actually costs a community to run a facility

**Date:** 2026-07-22
**Status:** Working model. Assumptions are explicit and meant to be argued with.
**Why:** The cost model carries a $24,000/yr "site bill" that is the rent line and nothing else. The Oonchiumpa REAL Innovation Fund Stage Two application already contains a real, costed community facility. This reconciles the two.

**Sources:** `Application Form - REAL Innovation Fund_Stage Two.docx` (Oonchiumpa lead, ACT consortium member, 1/07/2026 to 30/06/2029) · `v2/src/lib/data/cost-model-scenarios.json` · `cost-model/engine.ts`.

---

## 1 · What the DEWR application actually budgets

Total **$1,995,000** over three years.

| Budget item | 3yr total | Per year |
|---|---|---|
| Salary and wages incl. super and leave loading, Project Manager | $450,000 | $150,000 |
| Brokerage for incentives and wages for REAL jobs | $900,000 | $300,000 |
| Lease / rent, building and related | $180,000 | $60,000 |
| ACT: community-owned machinery + Trainer / WHS | $190,000 | $63,333 |
| Machine upkeep, consumables and materials | $55,000 | $18,333 |
| Insurance | $120,000 | $40,000 |
| Administration: accounting, IT, other | $100,000 | $33,333 |
| **Total** | **$1,995,000** | **$665,000** |

This is a real operating model for a community manufacturing facility, built with Oonchiumpa, with cultural governance, WHS, insurance, a trainer, and staff. It is the thing the cost model does not have.

---

## 2 · The gap

| | Per year |
|---|---|
| Cost model "site bill" (`ask-surface.ts`, = on-country rent line) | **$24,000** |
| DEWR facility, everything except participant wage brokerage | **~$365,000** |
| DEWR facility, everything | **$665,000** |

**The cost model is out by a factor of about fifteen** on what a community facility costs to run.

The $24,000 is `LOCATIONS.on_country.rentPerYear`. It has no manager, no trainer, no insurance, no admin, no maintenance, no WHS, no utilities. The DEWR application prices all of those because a real facility needs all of those.

---

## 3 · The four layers, separated

The DEWR budget mixes facility costs with program costs. For the ownership question they have to be pulled apart, because they are carried by different money.

### Layer 1 — The machines (one-off capital)

| Source | Amount |
|---|---|
| Cost model, central factory gross | $112,000 to $222,000 |
| Cost model, `standalone_site_capex` per site | $100,000 to $150,000 |
| Cost model, `state_5_community.capital_added` | $30,000 |
| DEWR, ACT machinery + Trainer/WHS over 3yr | $190,000 (blended, includes labour) |

Machine list: shredder $15-30K · hot press line $80-150K · CNC router $15-40K · workbench and tools $2K.

**Unresolved:** $30,000 versus $100-150K. The $30,000 reads as an increment on an existing central factory. The $100-150K reads as a site from scratch. A community starting fresh needs the second number.

### Layer 2 — Keeping the doors open (the real fixed block)

This is what was missing. Built from the DEWR lines, stripped of the employment program:

| Line | Per year | Basis |
|---|---|---|
| Lease, rent, utilities, site costs | $60,000 | DEWR $180K ÷ 3 |
| Insurance | $40,000 | DEWR $120K ÷ 3 |
| Administration, accounting, IT | $33,333 | DEWR $100K ÷ 3 |
| Machine upkeep, consumables | $18,333 | DEWR $55K ÷ 3 |
| **Bare facility subtotal** | **$151,666** | |
| Site manager / coordinator | $150,000 | DEWR Project Manager incl. super |
| Trainer / WHS officer | ~$40,000 | portion of the ACT $190K line |
| **Fully staffed facility** | **~$341,666** | |

**Assumption flags:** the $150,000 manager is a full-time senior role as DEWR priced it. A smaller site might run a $90,000 coordinator. The trainer split out of the ACT line is my estimate, not a stated figure. Both need Nic's view.

### Layer 3 — Production labour

Already inside the per-bed cost. The community path carries **$130/bed fair-wage labour** (band $100 to $160). Do not double count it in the fixed block.

### Layer 4 — The employment program

**$300,000/yr of brokerage**, incentives and wage subsidies to move justice-involved young people into work. This is grant money. It should never be carried by bed sales, and the ownership model must not assume it is.

---

## 4 · Break-even, rebuilt

Contribution per bed on the community path: **$329.26** ($750 price less $420.74 marginal cost).

| Yearly facility bill | Beds/yr to break even |
|---|---|
| $24,000 (the old rent-only figure) | **73** |
| $60,000 (rent + utilities only) | 182 |
| $151,666 (bare facility, no staff) | **461** |
| $341,666 (facility + manager + trainer) | **1,038** |

**This changes the ownership answer completely.**

"75 to 100 beds a year and a site stands on its own" is only true if a site has no manager, no insurance, no admin and no maintenance. A properly staffed community facility needs somewhere between **460 and 1,040 beds a year** to cover itself from bed sales alone.

---

## 5 · Can a site even build that many?

Three different capacity figures are in play and they do not agree:

| Source | Capacity |
|---|---|
| `volume_ramp_v6.per_site_capacity_per_year` | **250/yr** (explicitly flagged an assumption) |
| Cost model community throughput, 5 beds/day × 250 days | **1,250/yr** |
| DEWR application, "around 30 beds per week at full capacity" | **~1,500/yr** |

At 250/yr a site cannot cover even the bare facility. At 1,250 to 1,500/yr it can cover a fully staffed one, with room.

**This is the second thing that has to be settled,** and it matters as much as the cost side. The whole ownership case turns on which of these is real. The process is proven (40 beds made in-house at the farm), but the sustained rate is not; the way to settle it is a measured run with a stopwatch on it.

---

## 6 · What this means for community ownership

The earlier note said a site could pay its bills but not buy itself. With the real cost base, that was optimistic.

**Honest position now:**

- A community facility that runs properly, with a manager, insurance and WHS, **costs roughly $340,000 a year** and needs about **1,000 beds a year** to carry itself on bed sales alone.
- That is achievable at the DEWR capacity figure of 30 beds a week. It is impossible at the cost model's 250/yr assumption.
- **The employment program on top is grant-funded and always will be.** That is not a weakness. Oonchiumpa Goods is explicitly designed that way, and DEWR is the right money for it. But it means "the site stands on its own" needs to be said carefully: the *production* can stand on its own at volume. The *youth employment program* is philanthropically and government funded, by design.
- Selling or leasing a plant to a community without the operating money attached would be handing over a $340,000/yr liability. The Oonchiumpa structure is the right shape: grant money carries the program, product revenue carries production, ACT holds the machinery until the community is ready.

---

## 7 · One problem in the application itself

The numbers in the DEWR document do not reconcile:

- Budget table total: **$1,995,000**
- Stated profile: "Year 1 $647K → Year 3 $525K"
- Stated scale: "the ~$578K/year average scale"

$1,995,000 over three years is **$665,000/yr**, not $578,000. And a declining profile from $647K to $525K cannot sum to $1,995,000 unless Year 2 is $823K, which is not a decline.

Three figures, three different implied totals. If this has not been submitted yet, fix it. If it has, expect the question.

---

## 8 · What to settle next

1. **Site manager: full-time $150,000 or a $90,000 coordinator?** Moves break-even by roughly 180 beds.
2. **Per-site capacity: 250, 1,250 or 1,500 a year?** Decides whether community ownership is viable at all. The process is proven at 40 beds; a measured run confirms the sustained rate.
3. **Site capex: $30,000 or $100-150K?** Decides whether a community can realistically buy in.
4. **Is the trainer/WHS role ACT's cost or the site's?** Currently ambiguous in both models.
5. **Update `ask-surface.ts:205`.** The $24,000 site bill and the 75-100 bed claim are on a live surface and understate the real cost by more than ten times.

---

**Claims status:** DEWR budget lines are **as written in the application**. The layer split in section 3 is **derived here**, and the trainer portion and manager scaling are **my assumptions**, not stated figures. Break-evens in section 4 are **arithmetic** off the $329.26 contribution, which is itself **modelled** from zero in-house beds. The capacity conflict in section 5 is **quoted from three sources that disagree**.
