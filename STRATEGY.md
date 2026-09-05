# Goods: the alignment and strategy document

**One document. Everything else is a source it points at.**

> **Status:** current as at 2026-07-25. Written after the master strategy alignment session,
> which found five competing narrative spines live at once and a north star whose object
> contradicted the operating model.
>
> **This document does not hold figures or judgements.** It holds the picture. Figures live in
> code and are drift-checked. Judgements live in `/DECISIONS.md` and are dated. If this document
> and one of those disagree, they win, and this document is stale and should be fixed.

---

## 0 · Which file wins

The reason six decks got built on a moving model is that nobody could say which document was
authoritative. So this is the order, and it is not negotiable.

| Rank | Source | Holds | Enforced by |
|---|---|---|---|
| 1 | `v2/src/lib/data/canon.ts` + `asset-canonical.ts` | **Every public figure** | `npm run check:drift` |
| 2 | `/DECISIONS.md` | **Every judgement a human made**, dated, with reasoning and a sweep list | Append-only, newest first |
| 3 | `/CONTEXT.md` | The **language**: glossary, locked phrasings, what a term means | Read before writing copy |
| 4 | **This file** | The **picture**: what we are doing, why, in what order | Nothing. Keep it honest by hand |
| 5 | `wiki/`, `thoughts/` | Working notes and dated records | Historical, may be superseded |

**Four things that used to be prose and are now code**, because a paragraph drifts and a guarded
module cannot: the six stages and nine modules (`pathway-stages.ts`), who we are talking to
(`audience.ts`), the month-6 ownership test and the ownership sentence it derives
(`ownership-test.ts`), and what the next phase is at each community (`nextPhase` in
`community-pathways.ts`). Read those rather than restating them here.

**Two rules that follow from the table.** A number typed by hand instead of read from canon is a
bug even when it is correct today. And a document dated later does not automatically win: rulings
win, and a ruling carries its date.

---

## 1 · The north star

> **The goal was never a bigger Goods. It is a community that can collect the plastic, make the
> goods, and come to own the making.**

One source: `NORTH_STAR` in `v2/src/lib/data/content.ts`. Imported, never retyped. The line it
replaced ("a plant that belongs to the people sleeping on the beds") lived in four places at once,
which is exactly how it survived being retired.

**What it commits us to, and what it refuses.**

- The object is **infrastructure**, not "a plant". Of four live pathways only Oonchiumpa wants a
  whole facility. Infrastructure scales from a shredder up. (Ruling D.)
- Ownership sits with **whichever community runs the site**, not with the people sleeping on the
  beds. Those are different people and the difference matters.
- **"Come to own" carries the over-time.** Ownership is a **pathway**, always. Never claimed
  complete, on any surface, ever.

Retired and not to be revived: "Our job is to become unnecessary" (weak), "co-design" (the design
happens **in community, led by community**), the 40 percent community profit share (a placeholder
that was never a structure).

---

## 2 · The road

**The spine is the road. The model arrives near the end, as what the road produced.** Voices lead
each stop, because each stop is a person saying something. (Rulings C and F.)

| | Stop | What it taught |
|---|---|---|
| 1 | **Kalgoorlie** (Gloria Turner) | The bed disappeared |
| 2 | **Tennant Creek** | Who gets asked |
| 3 | **The machine with a name** (Dianne Stokes) | Pakkimjalki Kari, named in Warumungu |
| 4 | **Palm Island** (Alfred Johnson) | **Money enters here** |
| 5 | **Utopia** | Arrival is not the ending |
| 6 | **Maningrida and the farm** (Fred Campbell on Xavier) | **Economics land here** |
| 7 | **Oonchiumpa** (Karen Liddle, Kristy Bloomfield) | The first transfer |
| 8 | **The gap** | Eleven communities, 540 beds, two years, **nobody owns the making**. The model and the ask arrive here |

**Money never gets its own section again.** Every dead deck bolted money blocks onto story stops,
and the money slides migrated every time (8-9-11 in one version, the middle in another, the end in
a third). A block with no home moves. A lesson taught by a place cannot move.

Tennant Creek carries two stops because it taught two different things and it is where the deepest
relationship is.

**Why the road beats stating the model first.** Every failed deck led with the framework and hung
proof off it, which invites a funder to compare your framework to better frameworks. Walked down
the road they cannot, because nobody else has been on it. The six stages are the **residue** of the
road, not a frame imposed on it. The model is earned, not asserted.

*The Notion business plan stays model-first. A diligence read has a different job.*

---

## 3 · The model the road produced

### 3.1 The six public stages

Yarn, Shape, Resource, Deliver, **Transfer**, Grow. Defined once in
`v2/src/lib/data/pathway-stages.ts`; any surface showing stages imports from there.

Transfer is stage 5 of 6 publicly, and operating step 7 in the longer internal list. Both are
correct and they are different lists. It was added on 2026-07-25 because the operating model had
**no transfer step at all**, which meant the thing the whole pitch centres on was tracked nowhere.

> **Still open:** the GHL `Goods — Community Pathways` pipeline runs Delivery, Operating, Review
> and has **no Transfer stage**. The fix reached the code and never reached the CRM the team
> actually uses.

### 3.2 Modules, not a plant

A community picks from a basket: products, equipment, place, skills, people, systems, enterprise,
money, story. `PATHWAY_MODULES` in the same file.

> **The structural gap.** `v2/src/lib/cost-model/engine.ts` has three build paths and **all three
> assume a whole site**. `capital_added` in `cost-model-scenarios.json` is a **ladder on one site**
> ($2K, then +$38K, then +$160K, then +$30K, cumulative $230K), so "a community site costs $30K"
> was always a category error: it means "having already built a $200K factory, adding the community
> configuration costs $30K more."
>
> **FIXED 2026-07-25. The module basket is built** (`capex_modules` in
> `cost-model-scenarios.json`, `priceModuleSelection()` and `priceModuleOperating()`, 23 guards).
> Capex is now **site base plus modules** a community selects from, and operating splits the same
> way: a **$35,000/yr site floor** that exists the moment anyone works there, plus what the chosen
> modules run. Both reconcile losslessly to their sources, which is the guard that matters.
>
> **Two of four pathways now price.** Utopia, which the old ladder could not cost at all, comes to
> **$24,800-39,300 capex and $16,043/yr**, against the $79,333 a full facility carries. Oonchiumpa
> prices in full. **The two that do not are blocked on people, not numbers:** Tennant Creek waits on
> what the partner supplies, which is their call, and Palm Island needs a governance cost line that
> is not plant. Neither is fixable by estimating harder, and Palm Island returning $0 is recorded as
> the wrong answer rather than a good one.
>
> **Still open:** a real collection quote to narrow the estimate, and whether a baler is needed at
> all (rigid HDPE is normally caged, not baled) — that single question is the whole width of the
> band. The module list itself is in code so it can be argued with concretely, which is not the same
> as blessed.

### 3.3 Two pots, and the third cost centre nobody had

> **Production pays for itself. The wraparound never does, and should not.**

This is structural in the financial model, not a talking point. A funder told "this plant pays for
itself AND runs a youth program" will not believe it and should not. A funder told "production pays
for itself, here is the evidence, and the youth program is grant-funded by design, here is why that
is the right money for it" is being told a truth they can fund. **The separation is the
credibility.**

Three cost centres, not two:

1. **Network block** (~$109,500/yr today). Design, quality, training, back office, field travel.
   Amortises across sites. This is what Goods. is for after a handover. The DEWR budget already
   pays into it: the "ACT: machinery plus Trainer/WHS" line, $63,333/yr, is **revenue** to Goods.,
   not a cost. No model shows that yet.
2. **Site production block.** Carried by bed sales. See §4.
3. **Site wraparound block.** The $300,000/yr employment brokerage plus the program's share of
   rent, insurance and admin. Grant funded by design. **Never touches per-bed economics on paper.**

---

## 4 · The economics

*Every figure below is modelled or workpaper unless labelled otherwise. Read `cost-story.ts` and
`canon.ts` for the live values; these are here for shape, not for citation.*

### 4.1 The per-bed story

A bed sells for **$750**. Made the current way, buying legs finished from Defy, the next bed costs
about **$685** and roughly **$65** stays. Press the legs ourselves and the next bed costs about
**$426** and roughly **$324** stays. Five times more.

The one hard fact underneath: **we pay 8.6 times the raw material cost to buy legs finished.** The
plastic itself is $40 to $55. That is the whole investment case in one ratio.

Running Goods costs about **$109,500/yr** before a single bed is made. At $324/bed that is about
**338 beds/yr** to break even. At $65/bed it is about 1,679, which is exactly why we in-source.

**The honesty that is the pitch, not a weakness:** the process is **proven**. Forty Stretch Beds
(Maningrida, INV-0303) were made end to end at the farm, legs shredded, pressed, CNC-routed and
assembled. What is **not** measured is the per-bed cost and time at a sustained rate. Never write
"zero beds pressed in-house"; it is wrong and it has regressed twice.

### 4.2 The community-site denominator

The number the whole transfer case rests on, computed for the first time on 2026-07-25.

The model carried a "$24,000/yr site bill" that is `LOCATIONS.on_country.rentPerYear`, a rent line
with no manager, insurance, admin, maintenance or WHS in it. Dividing $329 into it produced "75 to
100 beds a year", now **retired as a public claim** (ruling I).

The 2026-07-22 replacement figures are also wrong, in the opposite direction, because they make bed
sales carry the program's share. Splitting the DEWR lines production versus program:

| Block | Per year | Beds/yr to cover it |
|---|---|---|
| The retired rent line | $24,000 | 71 |
| **Bare production block** | **$79,333** | **234** |
| **Plus a half-time line supervisor** | **$129,333** | **381** |
| Plus a full-time line supervisor | $179,333 | 529 |
| Bare facility, pots not separated | $151,666 | 447 |
| Staffed facility, pots not separated | $341,666 | 1,007 |

**So the honest denominator is 234 to 529 beds a year, and where it lands is decided by one
question: who pays the person who runs the line.**

Also corrected: every published break-even divided into **$329.26**, which is the community path at
the **Sydney** location where inbound freight is $0. On Country containerised is **$339.26**; On
Country not containerised is **$269.26**.

### 4.3 The sensitivity, which is the point

At 500 beds/yr against a ~$105,000 replication plant, with a half-time supervisor: clears about
**$40,297/yr** and retires the plant in **2.6 years**. Three dials each flip that alone:

- **250/yr** and the site cannot cover its own production block at all.
- **Not containerised** and 2.6 years becomes 19.8.
- **Full-time supervisor** and it never retires the plant.

**The honest claim is small:** on current estimates there is a plausible configuration where
production alone retires the plant in a few years, and three unmeasured or undecided things each
decide whether that is real. **Route B (earn-in) is therefore no longer arithmetically dead**, which
makes it a thing to explore rather than rule out. Nothing more than that, and no bed number goes in
front of anyone until the measured run happens.

### 4.4 Where the model sits

**It does not lead.** With an investor it arrives after the road, and its job is to show we
understand our own economics and know where the uncertainty is. With a community it is not a
spreadsheet to present, it is the questions it came from: how many beds would you want to make in a
year, who runs the line and are they paid, whose shed, what would you want to own first. **The
answers belong to the community.**

Never said in either room: a bed number as a threshold, a payback period as a promise, or any of
this as though it came off a measured run.

---

## 5 · The money coming in

**$0 signed.** Zero rows sit at Committed in the CRM. That is the standing fact and it is always
stated. Everything below is an ask, not a commitment.

Rebuilt 2026-07-25 from all 67 Supporter Journey rows.

| | Total | Who |
|---|---|---|
| **Grants at "Ask made"** | **$607,500** | Minderoo $200K (the CRM record itself calls it a catalytic QBE-aligned grant), Tim Fairfax $150K, Snow $100K first-mover, Rotary Eclub $82.5K, Centrecorp $75K forward |
| **Repayable at "Cultivating"** | **$710,000** | SEFA $300K, White Box SELF $250K, LendForGood $100K, Metro Finance $60K |

**Either column alone clears the $400,000 QBE match twice over. So the match is short of paper, not
short of candidates.** QBE judges match on a letter naming amount, instrument, funder legal name and
a contact they can call. That is a fortnight's work, not a facility agreement, and grants paper
faster than loans.

The **"at least three signed LOIs by 31 August" gate had no source** and is struck. The recorded
terms state a dollar test with no count.

Also live and in no strategy document: the Oonchiumpa-led **REAL Innovation Fund (DEWR) $2M**, the
largest live ask in the system and not a Goods stack line; and **First Nations Finance**, whose CRM
record reads "no ownership gate", which matters because the ownership gate blocks most concessional
capital.

**First question, worth more than the rest of the sequencing put together:** what will SIH actually
accept as match paper? Ben to Jay, early August.

---

## 6 · The entity

| Who | Legal home | What it holds |
|---|---|---|
| **Goods on Country** | The Butterfly Movement Ltd, ABN 22 155 132 684 | The products, IP, assets, contracts, making, sales, delivery, capital, governance and evidence |

**Ruling X, Ben 2026-08-28:** Goods on Country is the single operating and public identity. The
separate **Goods.** maker-and-seller layer is retired. Historic records may retain the old name,
but current decks, pages and funder stories must not recreate the split.

Verified on ABN Lookup: Goods on Country is a registered business name of The Butterfly Movement
Ltd from 23 July 2026.

Butterfly has been **DGR-endorsed since 17 January 2012** and ACNC-registered since 3 December 2012.
It was never pending. The open question is the receipting mechanics and whose name is on the
receipt, which is a much smaller question.

**The transition is executing, not blocking.** Kristy Bloomfield and Audrey Deemal are already
directors, accepted and registered. AGM tentatively **14 September 2026**. Chair will be an
Aboriginal director.

### The distinction that must never blur

> **One operating home does not make every eligibility claim true.** Supply Nation, IPP, IBA and
> First Australians Capital claims must be checked against Goods on Country's actual legal and
> control position. Board composition alone is not proof.

**51% is decoupled from the AGM.** It never depended on it. That sequencing was an assumption, and
it cost roughly seven weeks and the 1 July Supply Nation threshold.

Goods on Country owns and runs the whole model. Community partners decide how beds are used, who is
paid and what is made next. Any later transfer of ownership stays a pathway that a community must
choose; it is never claimed complete in advance.

---

## 7 · What may be said

- **Ownership is a pathway.** Never complete, present tense, on any surface.
- **scabies to RHD is the WHY, never a claimed health outcome.** No claimed health or justice
  outcomes at all.
- **Revenue: $713,827** Goods-only FY26 carve-out. **Workpaper, prepared with the accountant, NOT
  accountant-signed.** No signed document exists; getting one is an open action. Never the $403,901
  "surplus". The sole trader's FY26 P&L closed on a net profit of about $168K before any founder wages,
  which are not in the books: say that, never "net loss" (the loss was the 31 May position), and
  claim no surplus for Goods. Those books are Goods' history; everything Goods is moving into The
  Butterfly Movement Ltd (ruling X; Ben, 5 Sep 2026). $901,311 is valid only when the basis is named
  (all-sources cash since inception, restated 5 Sep 2026: Homeland, ALIVE and Julalikari receipts added).
- **Never "co-design".** Designed **in community, with community**.
- **Voice:** zero em dashes, no arrows in prose, straight quotes, "On Country" capitalised, units
  with no space (20kg). Banned: empower, beneficiaries, ecosystem, scalable solution,
  transformational, unlock, journey, game-changing. `npm run check:voice` enforces the
  high-confidence half.
- **Consent is a code rule, not a policy.** `getPublicStorytellers()` gates at the data layer;
  `cleared-voices.ts` (34 people) is the person-level allowlist. EL has no per-storyteller consent
  column, so the allowlist is the only gate. **34 is cleared voices, people, not stories.**
- **Every figure carries a status label**: verified, workpaper, modelled, target, conflict, retired.
  A `verified: false` flag means stated but not evidenced. Never flip one without a source.

---

## 8 · The three artifacts, and what they are cut from

**Three artifacts, three audiences, one source. Each is a CUT of sections 1 to 7, never a new
document.** They have drifted apart repeatedly for one reason: each was written from scratch.

**Who is reading is now in code**, not prose: `v2/src/lib/data/audience.ts` holds the six
audiences, what each arrives believing, what each must never see, and the one door each reaches.
The rule it encodes is the whole of this section: **lead with the thing that audience came for,
then earn the rest.** Every dead artifact inverted that for its reader.

### 8.1 The pitch deck
**Funders.** Spine is **the road** (§2): seven stops and the gap, voices leading each stop, the
model arriving near the end as what the road produced.

**Money never gets its own section again.** Every dead deck bolted money blocks onto story stops,
and those slides migrated every rebuild. A block with no home moves. A lesson taught by a place
cannot move. Leading with a framework invites a funder to compare your framework to better ones;
walked down the road they cannot, because nobody else has been on it.

Lives in `v2/src/lib/data/deck.ts`.

### 8.2 The explainer
**Communities, buyers and supporters.** Shorter, and it does the opposite of the deck: it leads
with the object and the method, not the road.

§1 (the object and the loop), then what we make, then the six stages and nine modules (§3.1, 3.2),
then one pathway from §5 chosen for the reader. **No money model at all.** A community or a buyer
does not need the denominator. A procurement buyer who cannot find the lead time does not stay for
the mission.

### 8.3 The business model
**Funders at diligence depth, and the board.** This one is **model-first**, deliberately. That is
not a contradiction: a diligence read has a different job from a first meeting, which is why the
Notion business plan stays model-first while the deck does not.

§3.3 (the two pots), §4 (the economics), §3.2 (modules), then the pathway portfolio, then §5 (the
money coming in). **$0 signed is stated first, always.**

### 8.4 The pathway portfolio, in code
What working with each community looks like from here is a `nextPhase` record on each pathway in
`v2/src/lib/data/community-pathways.ts`, distinct from the retrospective `caseStudy` the public
pages render. It carries what the next phase is, **what it is not**, the modules, the cost with a
status, who ends up owning what, what is blocked and on whom, and the ask.

**Two of four price. The two that do not are blocked on people, not numbers**, and the record says
so rather than filling the cell: Tennant Creek waits on the partner's decision, and Palm Island
returns $0 because the model has no governance line, recorded as the wrong answer. Guards prevent
a blocked pathway from ever quietly acquiring figures.

---

## 9 · What is open

| Item | Owner | By |
|---|---|---|
| Ask Jay what SIH accepts as match paper | Ben | Early Aug, before the sends |
| SEFA: ask for intent on letterhead, not a facility agreement | Ben + Nic | 31 Aug |
| Who signs the accountant letter, what artifact | Ben | Before match paper moves |
| Maningrida run actuals (time, diesel, plastic yield). **Highest-value open input**: 250 vs 500 beds/yr is the difference between a site that cannot cover production and one that owns its plant. **PARKED 2026-07-25.** Not derivable from a desk: the Xero mirror is verified empty and no run records exist in the repo. Needs Ben's own numbers or a live Xero pull. Instrument the next run. **Related and cheaper, and now narrowed to one question.** `01-vision-and-ambition.md:154` records one sheet per bed against Notion's two. **Arithmetic settles half of it (2026-07-25):** a 1200x600x18mm HDPE sheet at 0.96 g/cm3 is **12.44kg**, and a bed holds 20kg, so **one sheet per bed is impossible at that size**; two sheets is 24.88kg and implies ~20% offcut, which would move the costing basis from $55 to ~$68/bed. **Unconfirmed premise:** the legs may be *pressed in moulds* rather than cut from sheet, and that same 1200x600x18mm is also the wall-panel spec. **Ask Nicholas or Defy exactly this: moulded to shape, or cut from sheet? If moulded, what shot weight?** Either answer settles yield without a measured run | Ben / Nicholas / Defy | One question, not parked |
| Who pays the line supervisor, and is trainer/WHS ACT's cost or the site's. **The block itself is now in the cost engine (2026-07-25) with the supervisor as a dial defaulting to `none`, so this is the one number still to decide, and it is the biggest dial in the model: it moves the denominator from 234 to 529 beds/yr** | Ben + Nic | Before the 3-statement model |
| Test the 51% direction with MinterEllison and with Kristy | Ben + Nic | Same fortnight as the chair talk |
| Chair and Secretary; conflicts register if Kristy chairs | Ben + Nic | 3 Aug board meeting |
| Notice of meeting if the company name changes at the AGM | Zandra / board | ~24 Aug |
| ~~Modules, not build paths, in the cost engine~~ **BUILT 2026-07-25** (`capex_modules` + `priceModuleSelection()`, 12 guards; the ladder is untouched). Tennant Creek is now priceable at module level. **Utopia still is not, and the reason is now specific: collection and baling is genuinely unpriced and sits upstream of the shredder.** Palm Island returns $0, recorded as the wrong answer, since governance has a real cost that is not plant. **The per-module operating split is now done too**, so a partial pathway is priceable: site floor $35,000/yr plus what the modules run. Utopia carries $51,043/yr, not the full $79,333. **Collection is now priced as an estimate ($5,000-19,500), matching how the MVF already treats its own unquoted lines, so UTOPIA IS PRICEABLE: $24,800-39,300 capex, $16,043/yr operating. Two of four pathways now price; Tennant Creek and Palm Island are blocked on people, not numbers. Remaining: a real collection quote to narrow the band, and confirm whether a baler is needed at all (rigid HDPE is usually caged, not baled), which is the whole width of that band** | Ben, then Matt | Before an ask is written for Utopia or Palm Island |
| ~~Reconcile $110,046 against the MVF's ~$75K~~ **RESOLVED 2026-07-25 (ruling O):** $110,046 is actual sunk spend and is the figure to quote, regraded workpaper because only ~$43,700 is bill-evidenced. The ~$75K is a bill-level subtotal, not a competing total. Residual: locate the shredder invoice and the larger CNC | Ben | Paperwork, not a blocker |
| **The governance cost line the model does not have.** Palm Island prices at $0 for a listening-only pathway, and $0 is recorded as the wrong answer rather than a good one: listening, governance and the time of the people doing it have a real cost that is not plant. Until it exists, the earliest-stage pathways cannot be costed at all, which is the stage most communities start at | Ben, then Matt | Before an ask is written for Palm Island |
| Add a Transfer stage to the GHL pipeline | Ben | Standing |
| EL syndication API 404s. **DIAGNOSED 2026-07-25, and it is NOT our config.** The project id in our env is right: EL's own database returns it as "Goods on Country" (slug `goods`), verified by direct Supabase read. Auth-checking routes return 401 "Authentication required" while the project route returns 404 "Project not found", so **our API key is not valid for this site** and the API cannot resolve the project within its scope. Tried three site slugs, all identical. **Ask: a syndication key scoped to this site. Do not change the ids.** Verify with the curl in `empathy-ledger/client.ts`. Fallback is working, so this is degraded, not broken | EL side | Storyteller pages on fallback data |
| Kununurra Elder clearance | Ben | Standing |
| What the 1 July Supply Nation threshold cost | Ben | Unrecorded anywhere |

---

## 10 · The four things with no home: two now have one

1. ~~**The binary month-6 ownership test.**~~ **HOUSED 2026-07-26, ruling Q.**
   `v2/src/lib/data/ownership-test.ts`, rebuilt so it scores a shredder the same way it scores a
   facility. Binary kept, partial still counts as NO, and the clock is now defined as six months
   from the start of Deliver. **The public sentence is derived, never written**:
   `ownershipClaimLine()` computes it from the site records, so the claim and its evidence cannot
   drift apart. It reads *"no site is yet eligible"*, which is both truer and better than the old
   "not yet met at any site": no site has entered Deliver as a production site, and the Maningrida
   run was pressed at the farm. **Oonchiumpa is the first site that will be testable, and month 6
   of its Deliver is the first date this pitch can be checked against.**
2. **The seven proven community-transfer models** (Notion §3). Still homeless.
3. **"One product, four systems."** Still homeless.
4. ~~**Data sovereignty as a gate.**~~ **HOUSED 2026-07-26, ruling Q2.** It is the gate the
   ownership test sits behind rather than a fifth checkpoint: *the community controls what is
   published about this site.*

---

## 11 · The method that produced this

Every claim in the 2026-07-25 session was traced to a path, a line number, a register lookup or a
set of minutes. **Memory was wrong three times and was caught each time by reading the source:** the
twelve "blessed" deck lines were never blessed (the file's own heading says "Ben to bless"), the
revenue ruling had been reversed, and the Butterfly date had slipped seven weeks with no document
recording it. A fourth was caught the same day: a CRM read of the first 50 rows reported SEFA
missing when it was there.

**Three of the four corrections that session were found by opening an external register or a set of
board minutes, not a file in this repo.**

Sources beat memory. Registers beat documents. A guard that hardcodes the value it guards will rot.
And the banned-word list governs our voice, never anybody else's words.
