# Matt's model inputs: the session pack

**Date:** 2026-07-25
**For:** the next working session with Matt Allen (Social Impact Hub) on the GOC-only 3-statement model
**Supersedes for these six items:** `2026-07-23-goc-financial-model-pack/assumptions-alignment.md` §7
**Read alongside:** `/DECISIONS.md` (rulings D, G, H, I are load-bearing here)

---

## What this is, and what it is not

**Estimates for scenario study. Not actuals, not a quote, not a promise.**

Every figure here is modelled or derived, and the few that come off an invoice are labelled as such.
The purpose is to understand the shape of the thing well enough to hold a real conversation about it.
It is not to produce a number to put in front of someone.

**The model does not lead.** It sits inside a relationship. With an investor it arrives near the end,
after the road, and its job is to show that we understand our own economics and know exactly where
the uncertainty sits. With a community it is not a spreadsheet to present, it is a set of questions
to work through together: how many beds would you want to make in a year, who would run the line,
whose shed, what would you want to own first, and when. The numbers below are what lets us hold up
our end of that conversation without guessing or overpromising.

**So nothing in here is cut-through.** No figure in this pack goes onto a slide, into an email or
into a community meeting as a headline. Ruling I is the standing rule: use estimated numbers to
understand it, do not make promises.

---

## Why this is not just six confirmations

Five of the six are confirmations. Item 5 is not, and it grew on 2026-07-25.

The finding: **there is no community-site operating block anywhere in the model.** The $24,000
everyone has been dividing into is `rentPerYear` at `cost-model-scenarios.ts:159`. It is one line
in a `LOCATIONS` lookup table. The 2026-07-22 note replaced it with the DEWR figures, bare facility
~$152K and staffed ~$342K, but most of that gap is wraparound, and two-pots says bed sales must
never carry wraparound. So the honest denominator, the number that says what bed sales alone should
carry at a community site, **has never been computed by anyone.** Section 5 computes it.

And a seventh item that ruling D created. The object is infrastructure, not a plant. `engine.ts` has
three build paths and every one of them assumes a whole site. Utopia wants a shredder. Tennant Creek
wants to work through an existing shed. Palm Island starts with governance. **The cost model cannot
price three of the four live pathways.** Section 7.

---

## 1 · HDPE per-bed mass and rate

> **CONFIRMED 2026-07-25 (ruling N).** Swept into code: `physics.hdpe_in_product_kg_per_bed`
> added alongside the costing field, `PLASTIC_KG_PER_BED` documented as in-product mass, and
> four guards in `products.guards.test.ts` lock the public diversion claim to the in-product
> field so a costing tweak can no longer restate it silently.

**Position: keep 20kg at $2.75/kg landed, $55/bed.** Invoice-traceable (Defy INV-1731, $2/kg shred
plus $0.75/kg delivery). The GoC Q&A's "25kg at $1-2/kg" is retired as a costing figure and kept
only as an aspirational floor for the free-feedstock community path, where the plastic cost is $0
anyway and the rate is moot.

**The reconciliation Matt asked for.** The two numbers were never measuring the same thing. 20kg is
the HDPE mass **in a finished bed**, which is what `canon.ts:105` derives the public diversion claim
from: 177 Stretch beds at 20kg is 3,540kg. If a 25kg purchase presses into a 20kg bed, the missing
5kg is offcut, and HDPE offcut goes back through the shredder rather than to landfill. So the
purchase quantity and the diverted quantity can legitimately differ, and the model needs both fields,
not one.

**Consequence if this moves.** The 3,540kg claim is derived, not stored. Move per-bed mass to 25kg
and it becomes 4,425kg on every surface automatically. Do not move it without meaning to.

**What Matt needs:** two separate assumption cells, `hdpe_purchased_kg_per_bed` and
`hdpe_in_product_kg_per_bed`, with the diversion claim driven off the second.

**Open for Ben:** is the press yield 1:1, or is there measurable offcut? Item 6 answers this from a
measured run.

---

## 2 · Site capex

> **RULED 2026-07-25 (ruling O), against this recommendation.** Ben: "$110,046 is the actual
> costs, then we want to get up to about $200,000, as this is a very rough estimate with a lot
> of variables." **$110,046 stands as the sunk figure**, regraded from `verified` to
> **`workpaper`** because only ~$43,700 is evidenced at bill level. The ~$75K below is a
> **bill-level subtotal, not a competing total**: treating a Xero pull's coverage as the
> boundary of what was spent confuses evidence with fact. Capex is a rough range that may reach
> about $200,000, which already sits inside the existing $112-222K gross band. The recommended
> retirements DID carry: $30,000-as-a-site-price and the $100-150K/site band are both gone. The
> original recommendation is preserved below as the reasoning the ruling overrode.

**Position (superseded): adopt sunk ~$75K and replication ~$105K (band $90,800 to $123,000). Retire $30,000 and
$100-150K.** Source: `2026-07-22-minimal-viable-facility-model.md`, built bill-and-bank-line level
off the connected sole-trader Xero.

**Why $30,000 is worse than wrong, it is a category error.** In `cost-model-scenarios.json` the
`capital_added` values are a **ladder on one site**, not four site configurations: state 2 $2,000,
state 3 plus $38,000, state 4 plus $160,000, state 5 plus $30,000, cumulative $230,000. The $30,000
means "having already built a $200,000 central factory, adding the community configuration costs
$30,000 more." It never meant "a community site costs $30,000." Anyone reading that field as a site
price is reading a different quantity. This is the same defect as item 7 and has the same fix.

**Three honesty flags that ride with the ~$75K** and must appear in the model's source tab, not just
here: the shredder ($19,800, Telford Smith) is physically confirmed but has **no record in the
connected Xero**; the 40ft container is unconfirmed (the only candidate bill is tagged to Mounty
Yarns and was flagged on-sold); the two generators ($3,300 each, Orange Sky, May 2025) are untagged
and possibly petrol against a facility described as running one diesel genset.

**Also unreconciled and it is not a rounding difference.** `cost-story.ts:248` still says **$110,046
already invested**; the MVF reconciliation says **~$75K**. The MVF note argues the gap closes via the
missing shredder invoice and a recently bought larger CNC. That argument is plausible and it is not
evidence. Until the two agree, one of them is on a live surface and wrong.

**What Matt needs:** plant at cost on the balance sheet opens at the evidenced figure, with the
unevidenced items as a separate disclosed line rather than folded into the total.

---

## 3 · Capital ask

> **CONFIRMED 2026-07-25 (ruling P).** Swept into code: `NET_CAPITAL_LOW` / `NET_CAPITAL_HIGH`
> deleted from `engine.ts` along with the three tests locking them, replaced by a guard that
> fails if any net capital export returns. The "Net remaining ask $2-112K" fact is gone from
> `cost-story.ts`, and the net framing is off the three investor-wiki surfaces that carried it.

**Position: quote gross $112,000 to $222,000. Present the sunk spend as evidence of skin in the
game, never netted off. Never quote "$90-200K", which appears nowhere in any model and is a
transcription artefact.**

Netting invites "so is it yours or not?", which is a bad question to invite while the handover of the
farm plant is still in progress and the ownership pathway is the pitch. Gross plus a sunk-cost line
answers it before it is asked.

**What Matt needs:** capital ask as gross capex drawn on a timing schedule, with sunk plant already
on the opening balance sheet. Two numbers, never one net number.

---

## 4 · Capital stack split and the QBE match ratio

**Rebuilt from the full pipeline, 2026-07-25.** All 67 Supporter Journey rows, not the first 50. Two
things the 50-row read got wrong are corrected below.

**Zero rows sit at Committed.** Canon's `signed-lois: 0` is correct, and it is the only hard fact
here. Every figure below is a CRM-entered estimate of an ask, not a commitment.

**At "Ask made" ($607,500, excluding the REAL bid):**

| Funder | Value | Note |
|---|---|---|
| Minderoo Foundation | $200,000 | The CRM record itself calls it a catalytic QBE-aligned grant |
| Tim Fairfax Family Foundation | $150,000 | Not in any strategy document |
| Snow Foundation | $100,000 | "First-mover funding pathway". Distinct from the $493,130 historical, which sits at Renewing, won |
| Rotary Eclub Outback Australia | $82,500 | Not in any strategy document |
| Centrecorp Foundation | $75,000 | The forward ask. **Correction:** the 50-row read said Centrecorp appeared only as the historical $123,332. Both rows exist |

Plus **REAL Innovation Fund (DEWR) $2,000,000**, also at Ask made. That is the Oonchiumpa-led bid,
stop 7 on the road. It is not a Goods capital-stack line and should not be added into the stack, but
it is the largest live ask in the system and it appears in no model.

**At "Cultivating", the repayable-finance column:**

| Source | Value | Note |
|---|---|---|
| QBE Foundation, Catalysing Impact Stage 2 | $400,000 | The thing being matched, not part of the match |
| SEFA | $300,000 | **Correction: SEFA is in the CRM.** The 50-row read said it was absent. It sits at Cultivating, which matches Ben's read that it is live but stalled |
| White Box SELF | $250,000 | Social enterprise loan pathway. In no strategy document |
| LendForGood | $100,000 | The CRM record itself labels it "crowd-lent repayable via SIH (match candidate)" |
| Metro Finance (Qualified) | $60,000 | MetroEco equipment finance. CRM labels it a match candidate |

And three carrying no value but structurally important, because the 51% ownership gate is the
standing blocker on most concessional capital: **Invest NT Business Investment Concessional Loans**,
**CEFC via NAB Green Equipment Finance**, and **First Nations Finance**, whose CRM record explicitly
reads "working capital / equipment (**no ownership gate**)".

**What this changes.** Matt's placeholder ($250K match-eligible plus $250K match plus $100K other)
and our published $475K stack both describe a smaller and older pipeline than the CRM holds. Against
QBE's "at least matched by signed external commitments" at $400,000:

- the repayable column alone carries **$710,000** of candidates
- the grant asks already at "Ask made" carry **$607,500**

Either column on its own clears the match, twice over. **So the match is not short of candidates. It
is short of paper**, which is exactly ruling M's point: QBE judges match on a letter naming amount,
instrument, funder legal name and a contact they can call. Nothing here is at that stage yet, and
zero rows at Committed says so plainly.

**Two corrections that change the shape of the ask, both from `/DECISIONS.md` M:**

1. The "at least three signed LOIs by 31 August" gate asserted at `canon.ts:233` and
   `claims-ledger.ts:208` **has no source.** The recorded program terms say only "at least matched by
   signed external commitments", with no count.
2. QBE judges match on signed, verifiable paper: amount, instrument, funder legal name, a contact
   they can call. **That is a letter, not a facility agreement.** A grant-led match is therefore
   faster to paper than a loan, which puts Minderoo and Tim Fairfax ahead of SEFA on timing even
   though SEFA is the larger number.

**What Matt needs:** the stack as a timed schedule of instruments (grant / loan / equity) with a
paper-readiness date against each, not a static pie. The two columns above are the two rows of that
schedule: grants paper faster than loans, so a grant-led match is the shorter path to 31 August even
though SEFA is the larger single number.

**Still open, and it is one question, not five:** what will SIH accept as match paper? Everything
else in this section is sequencing that follows from the answer. Ben to Jay, early August.

---

## 5 · The community-facility block, and the denominator nobody has computed

> **NOW IN THE MODEL (2026-07-25), and the arithmetic below independently verified.** The site
> production block is a first-class concept in the cost engine: `SITE_PRODUCTION_BLOCK` and the
> `site_supervisor` dial in `cost-model-scenarios.ts`, with `siteProductionBlock` and
> `breakevenSiteProduction` as engine outputs. Ten guards in `engine.test.ts` lock the numbers.
> **Every figure in this section was hand-computed and now re-derives from the engine:** the
> $339.26 contribution, the 234 / 381 / 529 band, the $269.26 not-containerised case, and the
> 71 that the retired $24,000 rent basis gave.
>
> **Added additively on purpose.** `fixedBlock` and every locked break-even are untouched,
> because they are published figures; the block is a separate pot rather than a re-cut of pot 1.
> Guards assert the supervisor dial moves neither marginal cost (no double count against the
> $130/bed fair wage) nor `fixedBlock` (no leak between pots).
>
> **The supervisor defaults to `none`.** That is a coding choice, not a ruling: it is the
> computed floor and the only option that assumes no undecided role. **Ben and Nic still decide
> it**, and it is the single biggest dial in the model.

### 5.1 What is actually in the model today

`LOCATIONS` in `cost-model-scenarios.ts:157-160` is the entire site cost model:

| Location | `rentPerYear` | `inboundFreightPerBed` |
|---|---|---|
| Sydney / Defy | $0 | $0 |
| Sunshine Coast (Kirmos) | $54,000 | $30 |
| On-Country | $24,000 | $60 |

That is it. No manager, no insurance, no admin, no maintenance, no WHS, no utilities. The $24,000 is
not a wrong estimate of a site's operating cost. It is a **correct rent figure that was read as an
operating cost**, and then divided into $329 to produce "75 to 100 beds a year", which ruling I has
now retired as a public claim.

### 5.2 Why $152K is not the replacement

The 2026-07-22 note pulled the real figures out of the Oonchiumpa REAL Innovation Fund Stage Two
application: bare facility ~$151,666/yr, fully staffed ~$341,666/yr, plus $300,000/yr of employment
brokerage. Dividing $329 into $151,666 gives 461 beds a year, and into $341,666 gives 1,038.

**Both of those are also wrong, in the opposite direction**, because they make bed sales carry the
program's share of the rent, the insurance and the admin. Two-pots (§4 of the assumptions pack)
forbids exactly that. The DEWR budget was written to fund a facility **and** a youth employment
program in one building, and nobody has separated them at the line level.

So the sequence is: $24,000 understated it by making bed sales carry only the rent, and $151,666
overstates it by making bed sales carry the program. The honest number is a third one.

### 5.3 The split, computed

DEWR budget lines, per year, with a production share and the anchor for each split. **The DEWR
figures are as written in the application. The splits are derived here and are the thing to argue
with.**

| DEWR line | Per year | Production share | Basis for the split |
|---|---|---|---|
| Machine upkeep, consumables, materials | $18,333 | **$18,333** (100%) | The plant exists to make product. No program use. |
| Lease, rent, building and related | $60,000 | **$30,000** (50%) | Anchored on the engine's own rent lines: a production shed On Country reads $24K to $30K. The balance is the office, training room and services the program needs. |
| Insurance | $40,000 | **$16,000** (40%) | Production carries plant, public liability, product liability and workers comp on the production crew. The program adds participant and volunteer cover, at a higher premium than a manufacturing crew. |
| Administration, accounting, IT | $33,333 | **$15,000** (45%) | Invoicing, BAS, inventory and board reporting are production. Grant acquittal, DEWR compliance reporting and participant data are program. |
| **Bare production block** | | **$79,333** | |

Then the line DEWR does not hold separately. **The $150,000 Project Manager is a REAL Innovation Fund
program role, not a production supervisor.** Production needs a working line supervisor: quality,
materials ordering, scheduling, WHS on the press. That role is not in either model.

| Configuration | Block/yr |
|---|---|
| Bare production block, nobody paid to run the line | **$79,333** |
| Plus a half-time line supervisor (~$50,000) | **$129,333** |
| Plus a full-time line supervisor (~$100,000) | **$179,333** |

**Do not double count.** The community path already carries **$130/bed fair-wage production labour**
inside the marginal cost. A supervisor sits on top of that, not inside it.

### 5.4 A correction to the contribution figure itself

Every break-even published so far divides into **$329.26**, which is the community path at the
**Sydney** location, where inbound freight is $0. That is the wrong location for a community site.
On Country carries $60/bed inbound freight, and long-haul depends on whether the plant is
containerised (the engine subtracts $70/bed when it is, on the logic that you ship the plant to the
feedstock once rather than shipping finished beds out N times).

| Community-path setting | Marginal/bed | Contribution/bed |
|---|---|---|
| On Country, containerised (the intended shape) | $410.74 | **$339.26** |
| As published on 2026-07-22 (Sydney location) | $420.74 | $329.26 |
| On Country, not containerised | $480.74 | **$269.26** |

The intended shape is slightly **better** than what has been published. The not-containerised case is
materially worse and is the one that breaks things.

### 5.5 The answer

Break-even beds per year, at the intended On Country containerised contribution of $339.26:

| Block | Beds/yr to cover it |
|---|---|
| $24,000 rent line (the retired basis) | 71 |
| **$79,333 bare production block** | **234** |
| **$129,333 with a half-time line supervisor** | **381** |
| **$179,333 with a full-time line supervisor** | **529** |
| $151,666 bare facility, pots not separated | 447 |
| $341,666 staffed facility, pots not separated | 1,007 |

**So the honest denominator is 234 to 529 beds a year, and where it lands inside that band is decided
by one unresolved question: who pays the person who runs the line.**

### 5.6 The sensitivity, which is the useful part

What follows is a scenario, not a forecast, and the reason to run it is not the surplus figure. It is
to see **how few dials it takes to change the answer completely**, which is what tells us which
conversations actually matter.

At Matt's deliberately conservative 500 beds/yr planning figure, against a ~$105,000 replication
plant:

| Configuration | Contribution | Less block | Surplus | Retires $105K in |
|---|---|---|---|---|
| Bare, nobody paid to run the line | $169,630 | $79,333 | $90,297 | 1.2 years |
| **Half-time line supervisor** | **$169,630** | **$129,333** | **$40,297** | **2.6 years** |
| Full-time line supervisor | $169,630 | $179,333 | -$9,703 | never |

And the same middle row across the volume question that item 6 exists to settle:

| Sustained rate | Surplus with a half-time supervisor | Retires $105K in |
|---|---|---|
| 250/yr (`volume_ramp_v6`, flagged an assumption) | -$44,518 | never |
| **500/yr (Matt's planning figure)** | **$40,297** | **2.6 years** |
| 1,250/yr (5 beds/day) | $294,742 | under a year |

**The useful part is the fragility, not the number.** Three dials, and each one on its own flips the
answer:

- Drop to 250/yr and the site cannot cover its own production block at all.
- Do not containerise and 2.6 years becomes 19.8 years.
- Make the supervisor full-time and it never retires the plant.

So the honest read is **not** "a community site pays off its plant in under three years". It is: on
our current estimates there is a plausible configuration where production alone retires the plant in
a few years, and three things we have not measured or decided each decide whether that is real. That
is a much smaller claim and it is the one we can stand behind.

**What it changes about how we talk.** The 2026-07-22 note put Route B (earn-in, lease to own) off
the table on the strength of the $24,000 arithmetic, and the $461/$1,038 figures effectively kept it
there. Separating the pots at site level means **Route B is no longer arithmetically dead**, so it
stops being a thing to rule out in a conversation and becomes a thing to explore in one. Nothing more
than that yet, and nobody should hear a number attached to it until item 6 is measured.

**What Matt needs:** three cost centres in the P&L, not two.

1. **Network block** (~$109,500/yr today: design, quality, training, back office, field travel).
   Amortises across sites. This is what Goods. is for after a handover. Note the DEWR budget already
   pays into this: the "ACT: community-owned machinery plus Trainer / WHS" line, $63,333/yr, is
   **revenue** to Goods., not a cost to it. No model currently shows that.
2. **Site production block** ($79,333 to $179,333). Carried by bed sales. The denominator above.
3. **Site wraparound block** ($300,000/yr brokerage plus the program share of rent, insurance and
   admin). Grant funded by design, and it never touches per-bed economics on paper.

**Open for Ben and Nic:** the supervisor question ("half-time at ~$50K" is an assumption made here,
not a costed role), and whether the trainer/WHS role is ACT's cost or the site's, which is currently
ambiguous in both models.

**One thing to raise with Oonchiumpa, carefully.** The DEWR application's own figures do not
reconcile: the budget table totals $1,995,000, the stated profile is "Year 1 $647K to Year 3 $525K",
and the stated scale is "~$578K/year average". $1,995,000 over three years is $665,000/yr, and a
declining profile cannot sum to it. If the application has not gone in, this is fixable. If it has,
expect the question.

---

## 6 · Maningrida run actuals

**Position: the process is proven. The rate is not. Never write "zero beds pressed in-house".**

Forty Stretch beds (Maningrida, INV-0303) were made end to end at the farm: legs shredded, hot
pressed, CNC routed, assembled. That is a stronger position than "unproven process" and the pack must
say so.

**What is not captured, and what it is worth.** Time per bed, diesel per bed, and plastic yield per
bed on that run. Capturing them converts **$425.74 from modelled to measured**, and every break-even
in section 5 divides into a number derived from it. It also answers item 1's press-yield question for
free.

Section 5.6 makes this the highest-value unresolved input in the whole model. The difference between
250/yr and 500/yr is the difference between a community site that cannot cover its own production
costs and one that owns its plant in under three years. **A short measured run with a stopwatch on it
settles it.** Nothing else does. Four sources currently disagree (250 flagged as an assumption, 500 as
Matt's planning figure, 1,250 from 5 beds/day, ~1,500 from the DEWR "~30 beds per week"), and the
disagreement is not resolvable from a desk.

> **PARKED 2026-07-25 (Ben).** Do not reopen this from a desk. The Xero mirror
> (`xero_invoices`, `xero_transactions`) is EMPTY, verified by curl with a key that reads 995
> rows from `project_knowledge` in the same project, so it is not a permissions problem. No run
> records exist in the repo. The four inputs needed (dates and working days, who worked and how
> long, diesel in the window, shred in versus beds out) exist only in Ben's head or in live Xero.
> **Do not publish a per-bed cost derived from guessing them:** it is what every break-even in
> §5 divides into.
>
> **One live contradiction found while looking, worth more than the search was**
> (`wiki/articles/enterprise/01-vision-and-ambition.md:154`): the production guide records **one
> sheet per bed** while Notion StretchBed HQ says **two sheets per bed** and **three beds per
> day**. One versus two sheets is a 2x difference in plastic per bed, larger than the 20kg
> versus 25kg gap item 1 worried about, and "3 beds per day" contradicts the model's
> `factory_beds_per_day: 5` that the 250/500/1,250 spread hangs off. That file already flags it
> for Nicholas or Defy. Settle it there, not here.

**ANSWERED 2026-07-25 (Ben).** No instrumented capture, no stopwatch on the run. But the 40-bed
run does have figures we can **estimate from**, so this is a desk job against existing records
rather than a wait for the next press run.

**What that changes.** The estimate lands at a lower claims grade than a measured run would:
call it **derived from the 40-bed run**, never "measured". It still beats the current position,
where $425.74 is modelled from first principles and four sources disagree on the rate (250
flagged as an assumption, 500 Matt's planning figure, 1,250 from 5 beds/day, ~1,500 from the
DEWR "~30 beds per week"). A derived estimate narrows that spread; only an instrumented run
closes it. Instrument the next run anyway.

**Next step for whoever picks this up:** pull the 40-bed run's records (INV-0303 line items,
materials drawn, diesel purchased in the window, days worked) and back out time, diesel and
plastic yield per bed. That also answers item 1's press-yield question, which is what decides
whether purchased and in-product HDPE mass separate.

---

## 7 · The structural one: the model cannot price three of the four live pathways

**Not on Matt's original list. Ruling D created it on 2026-07-25.**

The object is now **infrastructure**, not "a plant". `engine.ts` offers `kits`, `panels`, `factory`
and `community` as `build_method`, and `cost-model-scenarios.json` gives each a `capital_added` that
is an increment on the previous rung of one ladder ($2,000, then $38,000, then $160,000, then
$30,000, cumulative $230,000). **Every path assumes a whole site, built in that order.**

Against the four live pathways:

| Pathway | What they actually want | Can the model price it? |
|---|---|---|
| Oonchiumpa | a full facility | **Yes.** This is the only one the model was built for. |
| Utopia | a shredder | No. There is no configuration that is collection and shredding without pressing. |
| Tennant Creek | to work through an existing shed | No. Site capex and rent are assumed, not supplied by the partner. |
| Palm Island | to start with governance | No. There is no configuration with zero plant and a real cost. |

**The fix is a change of shape, not a new number.** Capex becomes a **basket of modules** a community
selects from, each with its own capex, its own contribution to the site production block, and its own
required feed. Roughly: collection and baling; shredding; pressing; CNC and finishing; assembly;
sales and delivery. A pathway is then a subset, and the model prices a subset instead of a rung.

This also fixes item 2's category error for free, because a module basket cannot be misread as a
ladder increment.

**What Matt needs:** the assumptions tab wants a module table (module, capex, annual operating
contribution, throughput constraint) with a site defined as a selection, not a `build_method` enum
value. Not urgent for the first 3-statement build if it models Oonchiumpa. Blocking the moment the
model has to price Utopia or Tennant Creek, which is the moment a real ask is written for either.

**BUILT 2026-07-25 (Ben: "do 7").** `capex_modules` in `cost-model-scenarios.json`, with
`CAPEX_MODULES` and `priceModuleSelection()` in `cost-model-scenarios.ts` and 12 guards in
`capex-modules.guards.test.ts`. The `build_states` ladder is untouched because its outputs are
published. **Three departures from the list proposed above, each for a reason:**

1. **Site base is not a module.** The honest structure is site base plus modules. Utopia wanting
   a shredder still needs power, a pad and somewhere to put it. Where a partner supplies the shed
   the base shrinks rather than vanishes, and by how much is that partner's call, not ours.
   Base band: $31,800 to $64,000.
2. **Pressing and CNC stay bundled at $32,780.** Circularity INV-0054 covers hot press, cold
   press and CNC as ONE bill, so they cannot be split from evidence, and splitting them on a
   guessed ratio would manufacture precision. No live pathway needs them separate: Utopia stops
   at shredding, Tennant Creek is a shed question, Palm Island has no plant. Split it when a
   vendor breakdown exists and a pathway actually requires it.
3. **Collection and baling came back genuinely unpriced**, not merely unlisted. It is absent from
   the MVF replication table entirely. `priceModuleSelection()` returns `priceable: false` rather
   than treating it as $0, because treating a missing quote as zero is how a pathway looks
   cheaper than it is.

**The reassembly is guarded as lossless:** modules plus base reconcile to the MVF's $90,800 to
$123,000 replication total, because this is an allocation of an evidenced figure rather than a
new estimate.

**What it changes about the four pathways.** Tennant Creek is now priceable at the module level
($58,967 low, base excluded) even though its base subtraction is unagreed. **Utopia is still not
priceable**, and the reason is now specific and fixable: the shredder itself is priced at
$19,800, and the gap is the collection upstream of it. **Palm Island returns $0**, which is
recorded as the wrong answer rather than a good one: governance work has a real cost that is not
plant, it is the most common first step, and it is the most consistently unfunded.

**Still not done on item 7:** the per-module split of the operating block. The $79,333 bare block
assumes the FULL module set, so a subset carries less and nobody has derived by how much. Until
that exists, do not quote an operating figure for a partial pathway. That plus a collection quote
are what make Utopia priceable.

**Not decided:** the module list is still proposed, not agreed. It is now in code so it can be
argued with concretely, which is not the same as blessed.

---

## What to bring to the session

| # | Item | State | Who decides |
|---|---|---|---|
| 1 | HDPE 20kg at $2.75, two fields not one | **CONFIRMED 2026-07-25 (ruling N).** Swept into code; the two fields now exist and are guarded | Ben |
| 2 | Sunk capex | **RULED 2026-07-25 (ruling O), and NOT as recommended. $110,046 is the actual sunk spend**, regraded workpaper because only ~$43,700 is bill-evidenced. The ~$75K is a bill-level subtotal, not a competing total. Capex is a rough range that may reach ~$200K. $30K-as-site-price and $100-150K/site retired | Ben |
| 3 | Gross $112-222K, sunk as evidence | **CONFIRMED 2026-07-25 (ruling P).** Net figure deleted from the engine and its surfaces | Ben |
| 4 | Capital stack | **Rebuilt off all 67 CRM rows** (§4). Two grants/loans columns, either of which clears the $400K match. Remaining open question is one: what does SIH accept as match paper | Ben to Jay, then Matt |
| 5 | Community site block | **Computed here: $79,333 bare, $129,333 with a half-time supervisor.** Three cost centres, not two | Ben and Nic on the supervisor; Matt builds |
| 6 | Maningrida actuals | **Highest value open item.** Everything in 5.6 divides into it | Ben |
| 7 | Modules, not build paths | Proposed here, not agreed | Ben, then Matt |

## Where the model sits in a conversation

None of the above is a talking point. The model is not the argument, it is what lets us stay honest
inside a conversation that is about something else.

**With an investor.** It arrives after the road, and what it is showing is not the surplus. It is
that we have separated what bed sales should carry from what a grant should carry, that we know the
answer swings on three things, and that we are going to measure one of them rather than assert it.
An investor who is shown that reads an organisation that audits itself. An investor who is shown a
payback period off unmeasured actuals reads a forecast, and will price it as one.

**With a community.** The numbers do not go in the room as numbers. They go in as the questions they
came from, and the answers belong to the community, not to us:

- How many beds would you want to be making in a year? (Our planning estimate is 500. We have never
  run a site, so this is a guess we are asking them to correct.)
- Who runs the line, and are they paid for it? (This is the single biggest dial in our estimates, and
  it is a decision about whose job it is, not a cost input.)
- Whose shed, whose land, whose insurance?
- What would you want to own first? (Utopia said a shredder. That answer is more useful than any
  figure in this pack, and our model currently cannot even price it. See section 7.)

**What we never say in either room:** a bed number as a threshold, a payback period as a promise, or
any figure here as though it came off a measured run. It did not. That is the whole point of item 6.

---

**Claims status. Everything in this pack is an estimate for scenario study, not an actual.** No
figure here has been measured at a sustained rate, and no figure here is a quote or a promise.

DEWR budget lines are **as written** in the REAL Innovation Fund Stage Two
application. The production/program splits in 5.3 are **derived here** and are assumptions, not
stated figures. The line-supervisor costs are **assumed**, not costed roles. Break-evens and payback
periods in 5.5 and 5.6 are **arithmetic** off those inputs and off a contribution figure that is
itself **modelled** from a run whose per-bed actuals were not captured. Capex figures are
**evidenced** from Xero at bill and bank-line level except the shredder (**physical only**), the 40ft
container (**unconfirmed**) and the fit-out lines (**estimates**). CRM figures are **read from GHL
2026-07-25**, all 67 Supporter Journey rows (this footer previously said "first 50 rows only,
not paginated beyond that", which was stale: §4 was rebuilt off the full set on 2026-07-25 and
that rebuild is what corrected the SEFA and Centrecorp readings). The module list in
section 7 is **proposed**, not agreed.

**Sources.** `wiki/outputs/2026-07-23-goc-financial-model-pack/assumptions-alignment.md` ·
`wiki/outputs/2026-07-22-community-facility-operating-model.md` ·
`wiki/outputs/2026-07-22-minimal-viable-facility-model.md` ·
`wiki/outputs/2026-07-22-how-a-community-comes-to-own-the-plant.md` ·
`v2/src/lib/cost-model/engine.ts` · `v2/src/lib/data/cost-model-scenarios.ts:157-160` ·
`v2/src/lib/data/cost-model-scenarios.json` · `v2/src/lib/data/canon.ts:105` ·
`v2/src/lib/data/cost-story.ts:248` · `/DECISIONS.md` rulings D, G, H, I, M ·
`Application Form - REAL Innovation Fund_Stage Two.docx` (Oonchiumpa lead, ACT consortium member).
