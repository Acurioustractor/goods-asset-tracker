# Goods: why, what, how, and who we are talking to

**Status: DRAFT for Ben's ruling, 2026-07-26.** Nothing here is blessed yet.

> **What this file is for.** `/STRATEGY.md` holds the picture and it is accurate, but it is
> organised around what was decided and when. This file is organised around what a person needs
> in order to understand us, in the order they need it. It is the layer the deck, the explainer
> and the business model are all cut from, so that the three of them stop drifting apart.
>
> **Authority is unchanged.** Figures live in `canon.ts` and are drift-checked. Judgements live
> in `/DECISIONS.md`. Language lives in `/CONTEXT.md`. Where this file states a number it is
> mirrored for shape, not for citation, and it is labelled. If this file and one of those
> disagree, they win.

---

## 1 · Why

**Start with the object, because the object is what people remember.**

A bed arrives in a remote community. Within a year it is gone. Not stolen, not neglected: it was
built for a house with one family in it, and it went into a house with fourteen. It broke, and
nobody within nine hundred kilometres had the part, the tool or the reason to fix it. So a truck
brought another one.

That is the loop. Someone else designs it, someone else makes it, someone else profits from it,
and the community holds the failure. One Alice Springs supplier turns over roughly three million
dollars a year selling washing machines into remote communities, and most of those machines are
in a dump within months. The money leaves, the waste stays.

**The why underneath the object:** children sleeping on floors get scabies, scabies untreated
becomes rheumatic heart disease, and Aboriginal and Torres Strait Islander children carry the
highest rate of it in the world. That is the reason the work exists. **It is never a claimed
outcome.** We do not say beds cured anything. We say this is why we started.

**But the thing we are actually fixing is not the bed.** It is who gets to make it.

> **North star.** The goal was never a bigger Goods. It is a community that can collect the
> plastic, make the goods, and come to own the making.
>
> Source: `NORTH_STAR` in `v2/src/lib/data/content.ts`. Imported, never retyped.

Three things that line commits us to, and one it refuses.

- **The object is infrastructure, not a plant.** Of four live pathways only one wants a whole
  facility. Infrastructure scales from a single shredder up.
- **Ownership sits with whoever runs the site**, not with the people sleeping on the beds. Those
  are different people and the difference is load-bearing.
- **"Come to own" carries the over-time.** Ownership is a pathway. Never claimed complete, on any
  surface, ever.
- **It refuses "our job is to become unnecessary."** Retired. After a handover Goods still has a
  job: design, quality, training, equipment, working capital, back office. Pretending otherwise
  was a way of avoiding saying what we are for.

---

## 2 · What

### 2.1 What we make

**The Stretch Bed.** Two galvanised steel poles thread through canvas long-edge sleeves and
through the top holes of two crossed-plank recycled-HDPE X-legs. Tensioning pulls the poles deep
into the leg holes. The canvas is structural: the bed will not stand without it. Sells for $750.
Diverts 20kg of HDPE per bed.

It is not clip-on legs, not woven cord, not a hardwood frame. Those descriptions are from earlier
prototypes and still circulate.

**Pakkimjalki Kari**, the washing machine, named in Warumungu by Elder Dianne Stokes. Speed Queen
base, prototype stage, in several communities. Register interest only, not for sale.

**The Basket Bed**, the first prototype, discontinued and being open-sourced.

Specs live in `v2/src/lib/data/products.ts`. Import them rather than retyping.

### 2.2 What we are actually selling to a funder

Not beds. **A production capability that a community comes to own**, and the evidence that the
production half of it pays for itself.

One ratio carries the whole investment case: **we pay 8.6 times the raw material cost to buy legs
finished.** The plastic in a bed is $40 to $55. Buying the legs finished from a supplier costs
$344.05. So the bed we make today costs about $685 and roughly $65 stays. Pressing the legs
ourselves the bed costs about $426 and roughly $324 stays. Five times more.

*(Modelled from verified part prices. The capability is proven, the per-bed cost at a sustained
production rate is not yet measured. See 2.4.)*

### 2.3 Two pots, and why the separation is the credibility

> **Production pays for itself. The wraparound never does, and should not.**

This is structural in the financial model, not a talking point. A funder told "this plant pays
for itself and also runs a youth program" will not believe it, and is right not to. A funder told
"production pays for itself, here is the evidence, and the youth program is grant-funded by
design, here is why that is the correct money for it" is being told something they can fund.

Three cost centres:

| | Block | Roughly | Who carries it |
|---|---|---|---|
| 1 | **Network** | $109,500/yr | Amortises across sites. This is what Goods. is for after a handover. Partly revenue, not cost: the DEWR machinery and Trainer/WHS line, $63,333/yr, pays into it |
| 2 | **Site production** | $79,333/yr bare | Bed sales |
| 3 | **Site wraparound** | $300,000/yr brokerage plus share of rent, insurance, admin | Grant funded by design. **Never touches per-bed economics on paper** |

### 2.4 What is honest and unfinished

**The process is proven.** Forty Stretch Beds for Maningrida, invoice INV-0303, were made end to
end at the farm: legs shredded, pressed, CNC-routed, assembled. Never write "zero beds pressed
in-house." It is wrong and it has regressed twice.

**What is not measured** is the per-bed cost and time at a sustained rate. The first thing an
investor's money buys is the measured run that settles it.

**The honest denominator.** Running Goods costs about $109,500/yr before a bed is made. At $324
that is about 338 beds to break even. A community site needs somewhere between **234 and 529 beds
a year** to cover its own production block, and where in that range it lands is decided by one
question: **who pays the person who runs the line.** The old "75 to 100 beds a year" claim is
retired. It divided into a rent line with no manager, insurance, admin or WHS in it.

**Three dials each flip the case alone.** At 500 beds a year against a roughly $105,000
replication plant with a half-time supervisor, a site clears about $40,297/yr and retires the
plant in 2.6 years. Drop to 250 a year and it cannot cover production at all. Ship
non-containerised and 2.6 years becomes 19.8. Make the supervisor full-time and it never retires
the plant.

**So the claim we are entitled to is small, and we make it small:** on current estimates there is
a plausible configuration where production alone retires the plant in a few years, and three
unmeasured or undecided things each decide whether that is real.

### 2.5 Who we are, legally

| | Who | What |
|---|---|---|
| **Goods.** | Inside A Curious Tractor Pty Ltd, ABN 36 697 347 676 | The **maker and seller** |
| **Goods on Country** | The Butterfly Movement Ltd, ABN 22 155 132 684 | The **charity**, business name registered 23 July 2026 |

Verified on ABN Lookup. Butterfly has been DGR-endorsed since 17 January 2012.

> **The distinction that must never blur.** Aboriginal directors on the charity is **not** 51%
> First Nations ownership of the entity that sells. Supply Nation, IPP, IBA and First Australians
> Capital all test the supplier, which is the company. If the charity's board ever reaches a
> funder document as though it satisfies the ownership test, it ends the relationship.

---

## 3 · How

### 3.1 Six stages

Yarn, Shape, Resource, Deliver, **Transfer**, Grow. Defined once in
`v2/src/lib/data/pathway-stages.ts`.

| Stage | In the room | What community holds at the end |
|---|---|---|
| **Yarn** | Community names what would be useful, and what is already strong | The agenda |
| **Shape** | Choose together only the modules the community actually wants | The design |
| **Resource** | Price every asset, service and running cost. Confirm roles, contracts and intended owner | The terms |
| **Deliver** | Install, train, make locally, solve what shows up | The making |
| **Transfer** | Customers, contracts, revenue, knowledge and decisions move to the agreed owner | The enterprise |
| **Grow** | Community-approved evidence and surplus strengthen what comes next | The story and the surplus |

**Communities can begin anywhere, move at their own pace, and choose how much support they want.**

Transfer was added on 2026-07-25 because the operating model had no transfer step at all. The
thing the entire pitch centres on was tracked nowhere.

> **Still open and it matters:** the GHL pipeline the team actually uses runs Delivery, Operating,
> Review and still has **no Transfer stage.** The fix reached the code and not the CRM.

### 3.2 Nine modules, not a plant

A community picks from a basket. `MODULES` in the same file.

Products · Equipment · Place · Skills · People · Systems · Enterprise · Money · Story and evidence

This replaced a costing model with three build paths that all assumed a whole site. That model
made "a community site costs $30K" a category error: it meant "having already built a $200K
factory, adding the community configuration costs $30K more."

Capex is now **site base plus the modules a community selects.** Operating splits the same way: a
**$35,000/yr site floor** that exists the moment anyone works there, plus what the chosen modules
run. Both reconcile losslessly to their sources, which is the guard that matters.

### 3.3 How we work, stated as rules rather than values

These are the ones that change what we do, not the ones that sound good.

1. **Never "co-design."** The products are designed **in community, led by community**. Co-design
   implies a facilitated joint process. That is not what happens.
2. **Consent is a code rule, not a policy.** `getPublicStorytellers()` gates at the data layer and
   `cleared-voices.ts` is a person-level allowlist of 34 people. That is 34 **voices**, people,
   not stories.
3. **Every public figure carries a status label**: verified, workpaper, modelled, target,
   conflict, retired. `verified: false` means stated but not evidenced. Never flipped without a
   source.
4. **A community's answer belongs to the community.** The cost model is never presented to a
   community as a spreadsheet. It is presented as the questions it came from: how many beds would
   you want to make in a year, who runs the line and are they paid, whose shed, what would you
   want to own first.
5. **Sources beat memory. Registers beat documents.** Three of the four corrections in the last
   alignment session were found by opening an external register or a set of board minutes, not a
   file in this repo.

---

## 4 · Who we are talking to

**This layer did not exist before this document.** There were no personas, no segment file, no
mapping of who lands where, and that is the reason surfaces have been built one at a time without
a shared idea of who they serve.

> **Now in code:** `v2/src/lib/data/audience.ts`, with `audience.guards.test.ts` (19 guards,
> passing). The three money doors are imported from `ENTITY_DOORS` in `ask-surface.ts` rather than
> restated, so an audience can point at a door but can never redefine one.

**The organising rule: every audience has one door and one next action.** Three doors, and they
are different legal entities. Donate goes to The Butterfly Movement Ltd. Buy or order goes to A
Curious Tractor Pty Ltd, selling as Goods. Invest, repayable, goes to ACT Pty Ltd. Equity is not
sold. Gifts never fund the company.

### 4.1 The six audiences

**A · Community**
*Deciding whether to work with us at all.*

- **Arrives believing:** another outside organisation with a program it has already designed.
- **Needs to see:** that other communities set the agenda and it stuck. That we will say what
  something costs without being asked twice. That there is a version of this that starts small.
- **Must never see:** a facility proposal before a yarn. A cost model as a spreadsheet. Their own
  photo used before they cleared it.
- **Next action:** a yarn, with nothing proposed.
- **Serves them:** the pathway pages, the field notes, a person they already know.

**B · Funders and concessional lenders**
*Deciding whether to put money in.*

- **Arrives believing:** either that this is charity with a business attached, or a business with
  charity attached. Usually looking for the seam.
- **Needs to see:** the road, then the model as what the road produced. The two pots separated.
  The unmeasured things named before they find them. $0 signed stated plainly.
- **Must never see:** a bed number as a threshold, a payback period as a promise, or any modelled
  figure dressed as measured.
- **Next action:** a letter naming amount, instrument, funder legal name and a callable contact.
  That is a fortnight's work, not a facility agreement.
- **Serves them:** the deck, then the business model, then diligence pages.

**C · Buyers and procurement**
*Health services, government, NGOs, community organisations buying beds.*

- **Arrives believing:** they are buying furniture.
- **Needs to see:** specification, price, lead time, freight, warranty, who fixes it. Then, and
  only then, that buying it here also builds the making.
- **Must never see:** the impact story ahead of the spec. A procurement buyer who cannot find the
  lead time does not stay for the mission.
- **Next action:** an order, or a quote.
- **Serves them:** the shop, the product pages, a spec sheet.
- **Open and unresolved:** the ownership gate blocks the procurement lane most of the time. The
  direction to test, not yet a decision, is that **the community production entity is the seller**
  with Goods. as its supplier. Under that reading 51% stops being a governance concession and
  becomes the handover executing.

**D · Supporters and donors**
*Individuals who want the work to continue.*

- **Arrives believing:** a small gift will not matter.
- **Needs to see:** one face, one voice, one place. A specific thing their money did.
- **Must never see:** aggregate impact language, or a deductibility claim we have not confirmed
  the mechanics of.
- **Next action:** donate, to Butterfly, or join the list.
- **Serves them:** the ledger posts, the story road.

**E · Delivery partners**
*Oonchiumpa, Our Community Shed, Councils, corporations, training providers.*

- **Arrives believing:** they are being asked to host something.
- **Needs to see:** exactly which of the nine modules is theirs, which is ours, and what happens
  at Transfer.
- **Next action:** agree scope and roles in writing.
- **Serves them:** the module basket, priced.

**F · Board and team**
*Internal, and the audience most often forgotten.*

- **Needs to see:** which file wins, what is open, what is blocked and on whom.
- **Serves them:** `/STRATEGY.md`, `/DECISIONS.md`, this file, the ledgers.

### 4.2 The one rule that governs all six

**Lead with the thing that audience came for, then earn the rest.** The community came for a
yarn, not a proposal. The funder came for the road, not the framework. The buyer came for the
spec, not the mission. Every dead artifact we have built inverted one of those.

---

## 5 · How we work with communities in the next phase

Four live pathways. **They are at four different stages on purpose**, and the honest thing about
the portfolio is that two of them price and two do not, and the two that do not are blocked on
people rather than on numbers. Estimating harder does not fix either.

Costs below come from the module cost engine. **All are modelled** unless labelled otherwise.

> **Now in code:** a `nextPhase` field on each pathway in `v2/src/lib/data/community-pathways.ts`,
> with `next-phase.guards.test.ts` (17 guards, passing). It is a **new field alongside**
> `caseStudy`, which stays retrospective and is what the five existing pathway pages render.
> Nothing was overwritten.
>
> The two fields that exist because of specific failures are `isNot`, which holds the line against
> every pathway being misread as a facility, and `cost.status`, which keeps `blocked-on-people` and
> `wrong-answer` distinct from "unknown". A guard stops a blocked pathway from ever acquiring
> figures, because filling that cell would look like progress and would destroy the finding.

### 5.1 Utopia Homelands, Urapuntja NT
**Stage: Shape.** Lead: Jane Wilson, Urapuntja Aboriginal Corporation.

**Where it is.** 147 Stretch Beds confirmed. The May 2026 delivery is verified: young people from
the Oonchiumpa network assembled beds in Alice Springs, then families received them across the
homelands. Jane has opened a conversation about practical opportunities for young people,
including what a shredder could make possible.

**The next phase is one machine, not a facility.** The requested module is a shredder with
training. Youth activity and plastic collection are being explored. A complete facility is marked
later, only if community chooses it.

**What it costs.** $24,800 to $39,300 capex, $16,043/yr operating. *Modelled.* This is the
pathway the old ladder could not cost at all, against $79,333/yr for a full facility. The width
of the capex band is almost entirely one unanswered question: **is a baler needed at all**, given
rigid HDPE is normally caged rather than baled. Collection is currently a $5,000 to $19,500
estimate, priced the same way the DEWR budget already treats its own unquoted lines.

**Who owns what.** Urapuntja owns the machine. Goods supplies training, maintenance pathway and
parts.

**Blocked on:** a real collection quote to narrow the band, and confirming the baler question.
Both are answerable this month.

**The ask.** Fund a community-confirmed shredder module, only after operator, site, feedstock,
safety and maintenance are agreed.

### 5.2 Oonchiumpa, Alice Springs NT
**Stage: Resource.** Lead: Oonchiumpa Consultancy and Services.

**Where it is.** The only pathway that wants a complete production facility, and the furthest
advanced. Requested modules are the facility and youth pathways. Oonchiumpa has approved the
overall framing. Kristy Bloomfield is already a Butterfly director.

**The next phase is the first transfer.** This is where the north star gets tested rather than
asserted.

**What it costs.** Prices in full through the module engine.

**Who owns what.** This is the live question and it is bigger than a budget line. The direction to
test is that **Oonchiumpa's production entity is the seller** in the procurement lane, with Goods.
as supplier and service provider. **Oonchiumpa has not been asked.** It goes to MinterEllison as a
legal question and to Kristy as a conversation, and a conflicts register is needed if Kristy
chairs Butterfly while directing Oonchiumpa.

**Also live and larger than the Goods stack:** the Oonchiumpa-led REAL Innovation Fund (DEWR) $2M
ask. It is not a Goods stack line and it is the largest live ask in the system.

**Blocked on:** reconciling the DEWR scope and budget, then agreeing the funder-ready version.

**The ask.** Agree the reconciled scope, and test the seller-of-record direction with the people
it affects before it appears in any document.

### 5.3 Tennant Creek, Warumungu Country NT
**Stage: Yarn, reconfirming.** Leads: Michelle Bates, Our Community Shed; the Youth Centre
coordinator.

**Where it is.** The deepest product history anywhere: 160 Stretch Beds, 9 Pakkimjalki Kari, and
the machine that carries a Warumungu name given by Dianne Stokes. A February proposal priced a
two-stage 12-month trial at $234,000 excluding GST. The Shed intended to resubmit its CBF
application in the 1 July to 31 August 2026 round.

**The next phase is deliberately small.** Not the facility. One operational pilot: a facilitated
build or repair activity with local young people, chosen by the Shed and the Youth Centre.

**What it costs.** Priceable at module level, but **not priced**, because the number depends on
what the partner supplies and that is their call to make, not ours to estimate.

**Blocked on:** people, not numbers. Whether the Shed still wants the same pathway, whether the
compliance issue from the first CBF decision is resolved, whether the Youth Centre wants a formal
role, and whether existing bed-building media can be reused. All five are currently assumptions,
recorded as assumptions.

**The ask.** Support one reconnection phase designed with community, then cost only the small test
they choose.

### 5.4 Palm Island, Manbarra Country QLD
**Stage: Yarn, not yet begun.** Route: Palm Island Aboriginal Shire Council.

**Where it is.** Earliest of the four and correctly so. No capability audit has been done. No
media is assigned to this pathway at all until place, people and permissions are verified.
Existing Goods relationships must not be treated as a request.

**The next phase is a listening conversation.** That is the only module marked requested.
Everything else, including beds, is marked not assessed.

**What it costs.** The engine returns **$0, and that is recorded as the wrong answer, not a good
one.** Governance and listening have a real cost that is not plant, and the model has no line for
it. That gap is the finding.

**Blocked on:** confirming the right people and the decision process.

**The ask.** Fund the listening, and build the governance cost line the model is missing. This is
the pathway that tells us whether the six stages are real, because it is the only one starting
from zero.

### 5.5 What the portfolio says, read as one thing

- **Four communities, four different starting points, one method.** That is the argument for the
  module basket and against the facility template.
- **The transfer has not happened yet anywhere.** Ownership is a pathway and this is the evidence
  that we mean it as a pathway.
- **The two blockages are honest ones.** Tennant Creek waits on a partner's decision. Palm Island
  needs a cost line we have not built. Neither is fixable by estimating harder, and saying so is
  worth more than a filled-in cell.

> **The test that would make this checkable** is the binary month-6 ownership test. It is not in
> code and not in the deck, but it is **not nowhere**: it survives in one May 2026 document.
> **Worked through in §5.6, where it does not survive the July rulings intact.**

### 5.6 The month-6 ownership test, worked through

**This is the mechanism that turns "ownership is a pathway" from a claim into something that can
fail.** Without it, the sentence is unfalsifiable, and an unfalsifiable claim at the centre of a
pitch is the thing a good funder finds.

#### What already exists, and where

It was reported as existing only in conversation. That is wrong, and the correction matters
because it has a source. It survives in
`wiki/outputs/2026-05-29-goods-theory-of-change-and-mel.md`, as **metric 11** of the MEL
shortlist and as a callout beneath it:

> At each production site we test four things at month 6, where partial counts as NO: (1) the
> community holds the keys to the factory; (2) a named community lead is on payroll; (3) a
> community-controlled entity invoices the buyer directly; (4) at least 50% of production is
> community-controlled.

Status in that table: **design target, not yet validated in the field.** Year 1 target: first site
passes one or more. Vision 2030: all four passed at multiple sites.

It is attributed to the JusticeHub handover checkpoints, at
`JusticeHub/output/goods-on-country/community-ownership-checkpoints.md` in the ACT infra repo.
**That file no longer exists at that path and no renamed copy was found.** So the MEL document is
the only surviving statement of the test, and it is a summary of a source we have lost.

#### What is right about it, and must be kept

**Binary, with partial counting as no.** This is the whole value. Every soft ownership metric
drifts toward a story about progress. A checkpoint that fails when it is nearly met is the only
kind that keeps an organisation honest about a handover it has not completed.

**Per site, not per organisation.** Ownership is local or it is nothing.

**A terminal outcome, not a value.** It sits in the outcomes table, not in a values statement.

#### Where it breaks against the July 2026 rulings

**1 · "The keys to the factory" contradicts ruling D.** The object is **infrastructure, not a
plant**, and of four live pathways only Oonchiumpa wants a whole facility. Utopia's next phase is
one shredder. Under checkpoint 1 as written, **Utopia can never pass, not because ownership
failed but because there is no factory.** The test would measure which module a community bought
from us rather than whether they own it. That is backwards.

**2 · Its stated purpose is a retired line.** The callout justifies the test as "the clearest
proof that our job is to become unnecessary is real." That line is retired, and not only for being
weak: after a handover Goods still has a job, which is design, quality, training, equipment,
working capital and back office. **The test needs a new rationale**, and the honest one is
narrower. It does not prove Goods disappears. It proves the pathway moves.

**3 · "Month 6" has no origin.** Six months from what. Delivery, first production, or entering
the Transfer stage. Undefined, the test cannot be failed, which defeats the point of making it
binary. Under the six-stage model the only defensible clock is **six months from the start of
Deliver at that site**, because that is the first moment there is anything to own.

**4 · Checkpoint 4 collides with the 51% question.** "At least 50% of production is
community-controlled" and "51% First Nations ownership of the supplier entity" are different
tests, at different levels, with near-identical numbers. **Two 50-percents in one system is
exactly how a wrong sentence reaches a funder document.** It is also the vaguest of the four:
50% of volume, of process steps, of hours. It cannot be scored as written.

**5 · Checkpoint 3 is not a measurement today, it is an unmade decision.** "A community-controlled
entity invoices the buyer directly" **is** the seller-of-record direction that is live and
untested at Oonchiumpa. That is a finding rather than a flaw: building the test forces the
structural question it contains, which is the strongest argument for building it now.

**6 · Nothing in it covers data and story sovereignty**, although the same MEL document names
sovereignty a core impact metric, and `/STRATEGY.md` §9 lists "data sovereignty as a gate things
pass through rather than a metric counted at the end" as separately homeless. **Two homeless
things that answer each other.**

#### The rebuild

Same discipline, four checkpoints, binary, partial counts as no. Each is rewritten so it scores
the same way whether a site holds one shredder or a complete facility.

| # | Checkpoint | Passes when | Changed from |
|---|---|---|---|
| 1 | **Keys** | The community controls physical access to the equipment and to the place it sits | "Factory" to "the equipment and the place", so a shredder in a shed is testable |
| 2 | **Payroll** | A named community person is paid to run it, and the payer is named | Adds who pays, which was the ambiguity |
| 3 | **Invoice** | A community-controlled entity invoices the buyer directly for what the site produces | Unchanged in substance. This is the seller-of-record question |
| 4 | **Decision** | The community decides what gets made, when, and who works on it, without needing Goods to agree | Replaces "50% of production", which collides with the 51% test and cannot be scored |

**The clock:** six months from the start of Deliver at that site.
**Eligibility:** a site can only be tested once it has entered Deliver.
**Scoring:** four of four is a pass. Anything else is a fail, recorded with which checkpoints
passed, because that record is the useful part.

#### What it says about us today, which is not what the old wording says

The MEL table records the test as "not yet met at any site." Applied properly with the eligibility
rule, the honest statement is different and stronger:

> **No site is yet eligible to be tested.** Tennant Creek and Palm Island are at Yarn, Utopia is
> at Shape, Oonchiumpa is at Resource. None has entered Deliver as a production site. The forty
> Maningrida beds were pressed at the farm, which is not a community site.

"Not yet met" sounds like four failures. "Not yet eligible" is the truth, and it is a truth that
also dates the claim: **Oonchiumpa is the first site that will be testable, and month 6 of its
Deliver is the first date this pitch can be checked against.** Naming that date is worth more to
a funder than any of the four checkpoints individually.

#### Ruled by Ben, 2026-07-26

1. **Checkpoint 4 is Decision**, not a percentage of production. The production share stays as a
   reported figure and is not a checkpoint.
2. **Sovereignty is the gate the test sits behind**, not a fifth checkpoint: "the community
   controls what is published about this site." This also settles the homeless sovereignty item
   in `/STRATEGY.md` §9.
3. **A production site produces for sale.** Assembly of delivered beds in community is not
   production for sale.

Logged as **ruling Q** in `/DECISIONS.md`.

#### Built

`v2/src/lib/data/ownership-test.ts`, beside `pathway-stages.ts`, with
`ownership-test.guards.test.ts` (23 guards, passing).

The public sentence is **derived, never written**: `ownershipClaimLine(asOf)` computes it from the
site records, so the claim and its evidence cannot drift apart. Today it returns *"No site is yet
eligible for the month-6 ownership test. Ownership is a pathway and no site has entered Deliver as
a production site."*

The guards enforce the things that would otherwise soften silently: partial and not-assessed both
score as fail, "factory" cannot return to checkpoint 1, checkpoint 4 cannot contain a percentage,
a site cannot be tested before it produces for sale, the verdict is withheld until month 6 rather
than reported as an early fail, every live pathway must have a record so a new community cannot be
invisible to the test, and the derived claim can never say ownership is complete.

---

## 6 · How the deck, the explainer and the business model come out of this

Three artifacts, three audiences, one source. They have drifted apart repeatedly because each was
written from scratch. **Each is a cut of sections 1 to 5, not a new document.**

### 6.1 The pitch deck
**Audience B.** Spine is **the road**: seven stops and the gap, voices leading each stop, the
model arriving near the end as what the road produced.

1 Kalgoorlie, Gloria Turner, the bed disappeared · 2 Tennant Creek, who gets asked · 3 the machine
with a name, Dianne Stokes · 4 Palm Island, Alfred Johnson, **money enters here** · 5 Utopia,
arrival is not the ending · 6 Maningrida and the farm, Fred Campbell on Xavier, **economics land
here** · 7 Oonchiumpa, the first transfer · 8 **the gap**: eleven communities, 540 beds, nine
years, nobody owns the making. Model and ask arrive here.

**Money never gets its own section again.** Every dead deck bolted money blocks onto story stops,
and those slides migrated every rebuild. A block with no home moves. A lesson taught by a place
cannot move.

**Why the road beats stating the model first:** leading with a framework invites a funder to
compare your framework to better ones. Walked down the road they cannot, because nobody else has
been on it.

*Lives in `v2/src/lib/data/deck.ts`. **Currently under edit by another session. Not touched.***

### 6.2 The explainer
**Audiences A, C and D.** Shorter, and it does the opposite of the deck: it leads with the object
and the method, not the road.

Section 1 (the object and the loop), then 2.1 (what we make), then 3.1 and 3.2 (six stages, nine
modules), then one case study from section 5 chosen for the reader. **No money model at all.** A
community or a buyer does not need the denominator.

### 6.3 The business model
**Audience B, at diligence depth, and the board.** This one is **model-first**, deliberately, and
that is not a contradiction: a diligence read has a different job from a first meeting.

Sections 2.2, 2.3, 2.4, 3.2, then section 5 as the portfolio, then the raise.

**The raise, stated once.** $0 signed, and that is always stated first. Grants at ask made total
$607,500. Repayable at cultivating totals $710,000. Either column alone clears the $400,000 QBE
match twice over, **so the match is short of paper, not short of candidates**, and grants paper
faster than loans. The QBE up-to-$400K is the match vehicle, not the ask. The "three signed LOIs
by 31 August" gate had no source and is struck.

**The first question, worth more than the rest of the sequencing put together:** what will SIH
actually accept as match paper.

---

## 7 · What this document does not yet settle

| Item | Why it is here |
|---|---|
| The binary month-6 ownership test | **Worked through in §5.6.** Rebuilt against the July rulings; three things need Ben's ruling before it goes in code |
| The governance cost line | Palm Island returns $0 because of it |
| Who pays the line supervisor | Moves the denominator from 234 to 529 beds/yr. The biggest dial in the model |
| The baler question | The entire width of the Utopia capex band |
| Transfer stage in GHL | The centre of the pitch, untracked in the CRM the team uses |
| Seller of record during migration | Beds sold by the company on a domain named for the charity |
| The seven proven community-transfer models, "one product four systems", data sovereignty as a gate | Load-bearing in conversation, in no code and no deck |
