# Goods decision log

> **Append-only. Newest first. One entry per ruling.**
>
> This file exists because eleven rulings from the 2026-07-25 master-strategy session
> would otherwise have lived only in a chat window, which is exactly how six decks got
> built on a moving model.
>
> **What goes here:** judgements. Things a human decided that no script can re-derive.
> **What does NOT go here:** figures. Those live in `v2/src/lib/data/canon.ts` and
> `asset-canonical.ts` and are drift-checked by `npm run check:drift`. If a number is in
> this file it is because a human ruled on how it may be *used*, not on what it *is*.
>
> **Format:** every ruling carries a date, the reasoning, what it supersedes, and the
> sweep it implies. A ruling with no sweep list is a ruling that will silently rot.
>
> Glossary and money-model language: `CONTEXT.md`. **The whole picture in one place:
> `/STRATEGY.md`**, which points at this file for every judgement rather than restating them.

---

## 2026-07-25 (later) — Matt's model inputs, items 1 to 3

Three rulings against the recommended positions in
`wiki/outputs/2026-07-25-matt-model-inputs-session-pack.md`. Decided simultaneously, so they are
lettered in item order rather than newest-first. Ben ruling throughout.

### N. HDPE is 20kg at $2.75/kg landed. Two fields, not one.

**Confirmed:** 20kg at $2.75/kg landed, $55/bed. Invoice-traceable to Defy INV-1731 ($2/kg shred
plus $0.75/kg delivery). The GoC Q&A's "25kg at $1-2/kg" is retired as a costing figure and kept
only as an aspirational floor for the free-feedstock community path, where plastic costs $0 and
the rate is moot anyway.

**What was actually wrong, and it was not the number.** The two figures were never measuring the
same thing. 20kg is the mass in a **finished bed**, which is what the public diversion claim is
derived from. A purchase quantity and a diverted quantity can legitimately differ, because HDPE
offcut goes back through the shredder rather than to landfill. The model needs both fields.

**The hazard this closes.** The costing mass and the public-claim mass already lived in two
separate constants (`physics.hdpe_kg_per_bed` and `PLASTIC_KG_PER_BED`) with nothing stating that
they are different quantities or stopping anyone collapsing them. A costing tweak could have
silently restated a public impact claim on twenty-odd surfaces. They are equal today **only**
because press yield has never been measured, which is what ruling item 6 exists to settle.

**Sweep (done 2026-07-25):** `physics.hdpe_in_product_kg_per_bed` added to
`cost-model-scenarios.json` with a note naming both quantities and Matt's cell names ·
`PLASTIC_KG_PER_BED` doc comment in `products.ts` now says IN-PRODUCT, not purchase quantity ·
four guards in `products.guards.test.ts` lock the public claim to the in-product field, assert
purchased is never below in-product, and re-derive $55/bed from the Defy rates.

### O. $110,000 is the actual sunk spend. Capex is rough and may reach about $200K.

**Ben ruling, overriding the pack's recommendation.** The pack proposed adopting the
2026-07-22 minimal-viable-facility figure of ~$75K as sunk. Ben: "$110,000 is the actual costs,
then we want to get up to about $200,000, as this is a very rough estimate with a lot of
variables."

**Why the ~$75K was not the better number.** It is a bill-level subtotal, not a competing total.
The MVF's own tiers are ~$43,700 cleanly evidenced and tagged, ~$12,500 evidenced but
ambiguous, and $19,800 for a shredder that is physically running with no Xero record. Treating a
Xero pull's coverage as the boundary of what was spent confuses evidence with fact. Ben spent it
and is the primary source. This also matches what `2026-07-22-the-money-story-grounded-voice.md`
already said in prose: about $110,000 has gone in, mostly second hand, and the rest is gear we
own whose paperwork is catching up. A filing job, not a fiction.

**What did change: the adjective, not the figure.** $110,046 carried `solidity: 'verified'`,
which is not defensible when only ~$43,700 is bill-evidenced. Regraded **workpaper**. This is
the same correction shape as ruling H on revenue: keep the number, fix the word.

**Treat capex as a range, not a point.** Gross $112,000 to $222,000, rough, plenty of variables,
plausibly reaching about $200,000. Ben's figure already sits inside the existing band, so no
competing number was invented.

**Retired:** the $30,000 community rung as a site price (it is a ladder **increment** on top of
an already-built ~$200,000 factory, never a site cost, and reading it as one is a category error
rather than a rounding difference) · the separate "$100-150K per site on-Country" band.

**Still open:** the shredder invoice and the larger CNC are the outstanding paperwork. Note the
gap is wider than the pack assumed: $84,000 is described elsewhere as "cleanly in the connected
books" against the MVF's $43,700 clean tier, and those two cannot both be right about "clean".

**Sweep (done 2026-07-25):** `cost-story.ts` capital fact regraded to workpaper with the evidence
split and a do-not-net watch-out · `ALREADY_INVESTED` docstring in `cost-model-scenarios.ts` ·
`_capital_added_note` in `cost-model-scenarios.json` explaining the ladder · `qbe-areas.json`
gap text · engine test asserting the figure stands alone rather than as a deduction.

### P. The capital ask is quoted gross only. The net figure is retired.

**Confirmed:** quote gross $112,000 to $222,000, present sunk spend beside it as evidence of
skin in the game, never netted off. Never quote "$90-200K", which appears in no model and is a
transcription artefact.

**Why.** Netting invites "so is it yours or not?", which is the wrong question to invite while
the handover of the farm plant is in progress and the ownership pathway is the pitch itself.
Gross plus a sunk-spend line answers it before it is asked. Two numbers, never one net number.

**Sweep (done 2026-07-25):** `NET_CAPITAL_LOW` / `NET_CAPITAL_HIGH` deleted from `engine.ts`
(they were exported constants, ~$1,954 and ~$111,954, with three tests locking them) · a
replacement guard fails if any `NET_CAPITAL*` export is reintroduced · the "Net remaining ask
$2-112K" fact removed from `cost-story.ts` and its chapter lede rewritten · `CAPITAL_GROSS_*`
docstring corrected, since it previously described itself as "net of the $110,046".

**Prose swept the same day:** `wiki/investor/02-financial-model.md` (3 places) ·
`wiki/investor/15-money-alignment-audit.md` (4) · `wiki/investor/16-ask-surface-design.md` ·
`ask-surface.ts`, whose live "Equipment, net remaining / $2K-112K" block is now gross.
`wiki/canon/qbe-readiness.md` regenerated from `qbe-areas.json` by `check:qbe-readiness`.
Dated `wiki/outputs/` artifacts are historical record and are deliberately left alone.

---

## 2026-07-25 — Master strategy alignment session

Twelve rulings. Sources read first, memory distrusted, every claim traced to a path or a
register lookup. Ben ruling throughout.

### DIRECTION (not a ruling). The 51% answer to test: the community entity sells.

Rather than restructuring A Curious Tractor's share register, test whether **the community
production entity is the seller in the procurement lane, with Goods. as its supplier and
service provider.**

**Why it is worth testing.** Supply Nation, IPP, IBA and First Australians Capital all test the
entity that *sells*. The business plan §7 already names "local production and ownership
(community entities)" as the fourth revenue lane, and §9 says community production entities
become members of the charity, not clients. Oonchiumpa is already Aboriginal-owned, already
lead applicant on the ~$2M REAL bid, is stop 7 on the road, and its director is about to chair
the charity. Under this reading, 51% stops being a governance concession and becomes the
handover executing. It also explains what Goods. is *for* after the handover: design, quality,
training, equipment, working capital, back office, which is what `The Work That Stays` already
says at stage 5.

**Why it is not a ruling.** It involves another organisation's balance sheet and appetite, and
Oonchiumpa has not been asked. It also moves revenue off A Curious Tractor's P&L, which changes
what Matt's model shows and what an investor underwrites. Goes to MinterEllison as a specific
question, and to Kristy as a conversation, in the same fortnight as the chair discussion.

### M. SEFA is live but stalled. Jay first. Strike the "three LOIs".

Ben: "SEFA live but nothing has really happened yet." Sequence: **catch up with Jay first**,
then find the right named people inside each organisation for email and phone calls.

**Correction approved:** `canon.ts:233` and `claims-ledger.ts:208` both assert the QBE match
gate needs "at least three signed LOIs by 31 August". The recorded program terms
(`04-qbe-pipeline.md:9-14`) say only "at least matched by signed external commitments", with no
count, and Ben's own locked answer (`CONTEXT.md:34`) is a dollar figure. **No source exists for
the number three.** Both files to state what the terms say.

**SWEPT 2026-07-25.** `canon.ts` and `claims-ledger.ts` now state the terms: the gate is a
DOLLAR test with no count, judged on signed verifiable paper (amount, instrument, funder legal
name, a contact SIH can call). A second overstatement surfaced during the sweep and was fixed
with it: both files, and the deck's Gate chip, presented **31 August as the program deadline**.
It is not. The recorded terms put the application at **14 September 2026** with outcomes in
November; **31 August is our OWN internal all-paper-in gate**. Presenting an internal target as
a funder's deadline manufactures urgency we would then have to explain. `deck.ts` Gate chip now
reads "Signed match paper in by 31 Aug · app 14 Sep".

**The reframe that changes the sequence.** QBE judges match on "signed, verifiable paper:
amount, instrument, funder legal name, a contact SIH can call". That is a **letter, not a
facility agreement**. Thirty-seven days from a standing start to executed SEFA facility docs is
not realistic; a letter of intent to lend $300K subject to credit approval satisfies all four
tests and is a fortnight's work. So the August ask to SEFA is intent on letterhead, with credit
run through September and October alongside the QBE assessment. Same logic makes the grant-led
rebuild viable: **Minderoo $200K + Tim Fairfax $150K = $350K already at Ask made**, both faster
to paper than a loan, neither in any strategy document.

**First question for Jay, worth more than the other five sessions combined:** what will SIH
actually accept as match paper? Answering that in early August prevents five weeks spent
producing the wrong artifact.

### L. The SIH message goes from Ben and Nic jointly, first half of August

One message, not three. Leads with the governance news (two Aboriginal directors appointed
and registered, Aboriginal chair, dated AGM, registered business name, DGR live since 2012),
then states two corrections plainly (revenue not yet signed; entity identifier wrong in the
signed agreement), then raises the two open contract flags: **cl 7.3** (SIH owns cost-model
IP, confirm our licence) and **cl 5.3** (three-year, 45-day co-invest right on future raises).

**Reasoning.** QBE judges match evidence on "signed, verifiable paper". Two paper problems
found by them reads as a pattern; the same two volunteered reads as an organisation that
audits itself, which is the thing being pitched. Timing matters: if raising the entity
mismatch means re-executing the agreement, that is a six-week problem in August and a fatal
one in September. Ben: "yes we can raise anything we need to."

**Sweep.** `wiki/investor/04-qbe-pipeline.md:25` records the mismatch as "still NOT raised";
update when sent.

### K. "Goods on Country" is the charity. "Goods." is the maker.

Goods on Country = The Butterfly Movement Ltd. Goods. = the maker and seller, inside
A Curious Tractor Pty Ltd. ACT stewards. Gifts land at the charity.

**Reasoning.** Verified on the public register: business name **"Goods on Country" is
registered to The Butterfly Movement Ltd, ABN 22 155 132 684, from 23 July 2026**, alongside
"TABOO Foundation" (2024) and "THE BUTTERFLY MOVEMENT" (2012). **A Curious Tractor Pty Ltd,
ABN 36 697 347 676, holds no registered business names at all.** The Notion business plan
already had this right; canon and the public website had it backwards. The approved brand kit
already carries both marks (the `Goods.` wordmark and the grounded `on Country` lockup), so
the identity system anticipated the structure before the register caught up.

**Supersedes** `canon.ts:210` ("A Curious Tractor Pty Ltd ... t/a Goods on Country") and the
four public pages asserting the company operates the name.

**Sweep.**
- `canon.ts:210` — strip the `t/a`; the definition line "Goods on Country is its trading name,
  not a separate company" is wrong in both halves
- `v2/src/app/terms/page.tsx:32` · `about/page.tsx:207,245` ·
  `partner/page.tsx:137,239,399-400` · `insiders/login/page.tsx:82`
- The shop's seller of record: beds are sold by the company on a domain named for the charity
- `CLAUDE.md` opening line describes Goods on Country as the social enterprise delivering
  furniture, which is now the maker's job
- Goes to MinterEllison with the entity-wording block, and onto the 3 August agenda. This is
  the "contracting party / seller-of-record during migration" question that
  `wiki/canon/qbe-readiness.md:36` already had open, now with a date on it.

**PARTLY SWEPT 2026-07-25, and it had not been swept at all.** Found by the full ruling audit.
Data layer and the one flat misstatement are now corrected:

- `canon.ts` `entity-trading-goforward` value dropped the `t/a Goods on Country` and now reads
  `t/a Goods.`; its definition said *"Goods on Country is its trading name, not a separate
  company"*, which ruling K calls wrong in both halves, and now says what the register says.
- `grant-content.ts` (the orgIdentity comment and the funder-facing trading-entity line) ·
  `pitch-cockpit.ts` · `partner/page.tsx:239`, which asserted "A Curious Tractor Pty Ltd is the
  trading company behind Goods on Country".

**DELIBERATELY NOT SWEPT, and this needs Ben.** Four public surfaces state that A Curious
Tractor *operates* or *runs* the Goods on Country name:
`terms/page.tsx:32` ("a social enterprise operated by A Curious Tractor") ·
`about/page.tsx:207,245` ("a project of A Curious Tractor") ·
`partner/page.tsx:137` ("Goods on Country trades through A Curious Tractor Pty Ltd") ·
`insiders/login/page.tsx:82`.

These are backwards under ruling K, but rewriting a **Terms** page's operator-and-seller
statement is the same question ruling K already sent to MinterEllison ("beds are sold by the
company on a domain named for the charity"). Guessing new wording here could create a worse
problem than the one it fixes, so they are left intact and flagged rather than edited. They
should move with the legal advice, not ahead of it.

### J. The Butterfly transition is executing, not blocking. 51% is decoupled from the AGM.

Verified from primary source: TABOO Foundation board minutes, 20 July 2026.

- **AGM tentatively 14 September 2026**, 21 days notice required under the constitution,
  gated on audited financials (financials 31 Jul, audited 3 Aug).
- **Kristy Bloomfield and Audrey Deemal are already directors** of The Butterfly Movement.
  Written acceptance: completed. ASIC/ACNC registration: completed.
- Ben and Nic are already board members. Bank signatories move to Nicholas Marchesi and
  Briony Marshall by 3 August; Eloise Hall removed.
- **Chair will be an Aboriginal director. Ben's read: Kristy Bloomfield.**

**Reasoning.** Every repo document sequenced the entity and 51% work behind the charity
landing "~end July". The charity is not landing end July, and the transfer of control has
already substantially happened regardless: the AGM formalises casual-director elections and
outgoing resignations. **Aboriginal directors on the charity is NOT 51% First Nations
ownership of the selling entity** — Supply Nation, IPP, IBA and First Australians Capital all
test the supplier, which is the company. Conflating the two in a funder document would be a
relationship-ending claim. The 51% question never depended on the AGM; it was sequenced behind
it by assumption, and that assumption cost roughly seven weeks and the 1 July Supply Nation
gate.

**Condition on the chair.** Kristy directs Oonchiumpa, which is stop 7 on the road, the first
transfer pathway, and the applicant on the ~$2M REAL bid. That is a stronger story than an
independent chair (the person leading the first transfer chairs the vehicle that makes
transfers possible) *only if* it is got to first: conflicts register, standing aside from
Oonchiumpa-related decisions, relationship stated in funder material rather than found in an
ASIC search.

**Sweep.** `CONTEXT.md`, `wiki/canon/qbe-readiness.md:36`, `wiki/investor/04-qbe-pipeline.md:25`
all still say "~end July". Wrong as of 20 July. Also `canon.ts:219` describes DGR as
"operational from FY2026-27"; the register says **DGR endorsed since 17 Jan 2012**. The open
question was never whether the entity is DGR, it is the receipting process and whose name is
on the receipt. Much smaller question.

**Date nobody had written down:** if the company name is to change by special resolution at the
AGM, notice of meeting including the resolution must go out by **~24 August** (ASIC Form 205
after the resolution, then notify ACNC via the Charity Portal).

### I. "75 to 100 beds a year" is retired as a public claim

Kept as an internal estimate on an illustrative community so the economics are understood.
Never stated to a funder as a threshold or a promise.

**Reasoning.** The number is $329/bed divided into a $24,000/yr site bill, and
`cost-model-scenarios.ts:159` shows that bill is `rentPerYear` — a rent line, not an operating
block. `assumptions-alignment.md:58` (2026-07-23) says so in writing: the engine's figure
"understates the real cost by ~15x", against Oonchiumpa DEWR figures of bare facility
~$152K/yr and fully staffed ~$342K/yr. At $152K the same arithmetic gives ~462 beds/yr, nearly
four times total current production (~120/yr). But $152K is not the right denominator either,
because most of the gap is wraparound, which two-pots says bed sales must never carry. The
honest number is a third one nobody has computed. Ben: use estimated numbers to understand it,
do not make promises.

**Supersedes** the ruling at `CONTEXT.md:48` (locked 2026-07-21).

**Sweep.** Notion business plan §5 · canonical map §4 · `CONTEXT.md:48`. Replace with the
finding already written at `wiki/outputs/2026-07-22-how-a-community-comes-to-own-the-plant.md`:
a site at that volume pays its bills and pays the people working in it, and does not throw off
enough to buy itself. The real block gets built as its own cost centre in Matt's 3-statement
model.

**Consequence not yet resolved:** with the object now infrastructure rather than a plant
(ruling D), `engine.ts`'s three build paths (buy-kit / factory / community) all assume a full
site, so the cost model cannot price three of the four live pathways (Utopia wants a shredder,
Tennant Creek wants to work through an existing shed, Palm Island starts with governance).

### H. Keep $713,827. Correct the word.

The figure stays. "Accountant-signed" comes off every surface and is replaced with what is
true. The green **Verified** chip on deck slide 5 drops to a workpaper label.

**Reasoning.** Falling back to $741,111 was rejected: it is a *different basis* (all-sources
cash since inception vs Goods-only FY26), so swapping would re-cut every downstream artifact
seven weeks before submission and leave anyone who saw both asking which was meant. Correcting
an adjective is a one-word sweep. Withholding entirely was rejected because it is already
published everywhere; retracting a number funders have seen is a bigger event than relabelling
it.

**SUPERSEDES A BEN RULING FROM THE DAY BEFORE.** `thoughts/shared/handoffs/investor-wiki/current.md`
records: *"REVENUE RULING (Ben 2026-07-24): $713,827 carve-out is NOT yet signed → cite $741,111
externally; do NOT cite $713,827."* Ruling H is the later call, made with the full picture
(eight surfaces already carrying it, the basis difference between the two figures, and seven
weeks to submission), and it **replaces** the 2026-07-24 ruling. Both are Ben rulings; if a
future session finds them pointing opposite ways, H wins on date. The practical difference: the
old ruling changed the *figure*, this one changes the *adjective*.

**Sweep.** `canon.ts:138` · `cost-story.ts:59,327` · `slides-source.html:168` (and the V chip) ·
`v2/src/app/sites/qbe-readiness/page.tsx:85,135,172,250` · `ask-surface.ts:23` ·
`pitch-control-room.ts:145` · `deck.ts:354` · `qbe-areas.json` ·
`wiki/investor/04-qbe-pipeline.md:23` (must-win marked DONE) · Notion business plan §1.
Also retire or rewrite `claims-ledger.ts:233` (the `consolidated-revenue` locked row) and
`ANTI_CLAIMS:257`, which describe a discipline not actually followed since June.

**SWEPT 2026-07-25, and the sweep had NOT happened.** A ruling-audit run after ruling M turned
out to be unswept found "accountant-signed" still live in **nine places**, including six on the
funder-facing `/sites/qbe-readiness` page and three in `cost-story.ts`, all of them on H's own
sweep list. Only `ask-surface.ts` had been done. Now corrected:

- `qbe-readiness/page.tsx` ×6, including the metric card's green **Verified** pill, dropped to
  **Workpaper**. The card previously read "Accountant-signed carve-out" in front of funders.
- `cost-story.ts` ×3, including a `solidity: 'verified'` row whose `source` cited an
  **"Accountant letter"** that does not exist.
- `canon.ts:138` regraded `verified` to **`workpaper`**, and its definition no longer says
  "Citable accountant-signed". This required adding `workpaper` to the `ClaimLabel` union,
  which had no honest slot for a figure that is actual but unsigned: `verified` overclaims and
  `modelled` is simply wrong for real cash. `Solidity` in cost-story.ts has had the grade for
  longer; the two vocabularies now agree.
- The two items above that H flagged as "a discipline not actually followed" were both **false
  statements**, not merely stale. `ANTI_CLAIMS` asserted *"We do not publish an unsigned revenue
  figure"* while $713,827 rendered on eight surfaces, and the `consolidated-revenue` row claimed
  the figure was `status: 'locked'` and withheld. An integrity commitment contradicted by
  practice is worse than no commitment. Both now state what is actually done.
- Caught in passing: `ANTI_CLAIMS` cited **"the 32 consent-cleared voices"**, which was stale
  (canon is 34) *and* the wrong tier (32 is the display-storyteller pool, a coverage queue, not
  a clearance list). Now reads from `canonFact('cleared-voices')` so it cannot drift again.

**Ruling A swept in the same pass.** "Become unnecessary" was still live twice on
`qbe-readiness/page.tsx`. The scoreboard line now imports `NORTH_STAR.line` rather than
retyping a slogan, per ruling E.

**The lesson, which is bigger than these files.** Two rulings in a row (M, then G/H/A) were
logged with a correct sweep list and never executed. A ruling with a sweep list is not swept
until something checks. Treat the sweep list as a to-do that needs verifying, not a record of
work done, and re-run a grep for retired language before trusting any "swept" note including
this one.

### G. There is no signed accountant document

The $713,827 Goods-only carve-out is **not accountant-signed**. Getting it signed is the next
action. Until then, "accountant-signed" is an overclaim live on eight surfaces including a
green Verified badge in front of funders and a QBE must-win marked DONE.

**Still open, needs Ben:** who signs, what artifact exactly, by when. The claims ledger already
promised "before mid-August 2026".

**Note.** `revenue-carveout` is `dataClass: 'amber'`. The claims ledger's own rule 1 forbids a
figure rendering externally unless backed by a **green** fact. `assertLedgerSafe()` never fires
only because no ledger claim references it and the deck bypasses the ledger entirely. The guard
built for this exact leak class does not cover the surface the leak is on.

### F. The road is seven stops and the gap. Money enters through place.

1 Kalgoorlie (Gloria Turner), the bed disappeared · 2 Tennant Creek, who gets asked ·
3 the machine with a name (Dianne Stokes) · 4 Palm Island (Alfred Johnson), **money enters** ·
5 Utopia, arrival is not the ending · 6 Maningrida and the farm (Fred Campbell on Xavier),
**economics land** · 7 Oonchiumpa (Karen Liddle, Kristy Bloomfield) · 8 **the gap**: eleven
communities, 540 beds, nine years, nobody owns the making. Model and ask arrive here.

**Reasoning.** The money never gets its own section again. `The Work That Stays` keeps four
separate money blocks bolted onto twelve story stops, and every dead deck did the same, which
is why the money slides kept migrating (8-9-11 in one version, the middle in another, the end
in a third). **A block with no home moves. A lesson taught by a place cannot move.** Tennant
Creek carries two stops because it taught two different things and it is where the deepest
relationship is.

Every named voice is on the cleared 34. Gloria Turner (`cleared-voices.ts:35`) and Kalgoorlie
(20 beds, WA) both verified directly.

### E. The north star line

> **"The goal was never a bigger Goods. It is a community that can collect the plastic, make
> the goods, and come to own the making."**

**Reasoning.** "Come to own" carries the over-time without saying it, which keeps the line
inside the ownership-is-a-pathway ceiling. "The making" is language the corpus had already
chosen three separate times without anyone planning it (stage 4 holds the making, deck slide 8
is the making, the close is leave the making with us), which is usually the sign the language
has found itself.

**Sweep.** `CONTEXT.md:26` · `slides-source.html` slide 1 · `wiki/investor/19-the-whole-picture.md:47` ·
canonical map §1 · Notion business plan §1 · `ask-surface.ts`.

### D. The object is infrastructure, not "a plant"

Ben: "doesn't need to be a plant, it is the infrastructure to help them collect plastic and
make products and be supported to own it over time."

**Reasoning.** "A plant", singular, contradicted the modular model: of four live pathways only
Oonchiumpa wants a plant. It also put ownership with the people sleeping on the beds while the
model puts it with whichever community runs the site, and "belongs" is present tense against a
standing rule that ownership is a pathway, never claimed complete. Infrastructure scales from a
shredder to a full facility, which is the modular point.

### C. The spine is the road. The model is what the road produces.

The model arrives near the end, not at the start. Voices lead each stop, because each stop is a
person saying something. **Supersedes all prior narrative spines as the narrative master.** The
Notion business plan stays model-first because a diligence read has a different job.

**Reasoning.** Five spines were live at once: the six belief turns (`2026-07-15-strategy-deck-core-messaging.md:33`,
10 slides), the canonical narrative spine (`14-playout-plan.md:25-36`, 12 beats), the final
words (`19-the-whole-picture.md:47-58`, 12 lines), the model-led rebuild
(`2026-07-25-goods-pitch-canonical-map.md:54-65`, 12 slides), and the Notion business plan.
Spines 3 and 4 are both twelve beats and are **not the same twelve**.

Every failed deck stated the model first and hung proof off it, which invites a funder to
compare your framework to better frameworks. Walked down the road, they cannot, because nobody
else has been on it. Each place on `The Work That Stays` taught something that forced a change,
so the six stages are the *residue* of the road rather than a frame imposed on it. The model is
earned, not asserted.

**Also corrected today:** `19-the-whole-picture.md:36` heads its twelve lines "the writing
spine, **v1, Ben to bless per slide**", and §5 lists "Ben blesses the 12 lines above" as
outstanding. They were never blessed. A note carried in memory said they were blessed verbatim
and must not be rewritten; the source says otherwise. Sources beat memory.

**Verified defect in the current deck:** `slides-source.html` contains **three named people and
one quote across twelve slides**. Spine 1 carried named voices with consent tiers on seven of
ten. Spine 2 (`14-playout-plan.md:12`) would not let a beat ship without all four of stat,
voice, face and proof-media. The newest artifact uses the least of the most expensive asset
built here: 34 cleared voices, a consent-tiered registry, an Empathy Ledger integration and a
default-deny gate.

### B. North star confirmed, second half reworked

"The goal was never a bigger Goods" survives unchanged. Second half reworked into ruling E.
"Nobody funds Goods forever" demoted from north star to a possible mechanism line.

### A. "Our job is to become unnecessary" is retired

**Reasoning.** Weak (Ben).

**Sweep.** `wiki/outputs/2026-05-29-goods-theory-of-change-and-mel.md:31`, and
`wiki/articles/enterprise/01-vision-and-ambition.md` where it is quoted as "the stated
philosophy".

---

## Open, carried forward

| Item | Owner | By |
|---|---|---|
| Catch up with Jay. Ask what SIH accepts as match paper. | Ben | early Aug, before the sends |
| SEFA: ask for intent on letterhead, not a facility agreement | Ben + Nic | by 31 Aug |
| Rebuild the stack from live CRM rows, not the May version | Ben | before the sends |
| Test the 51% direction with MinterEllison and with Kristy | Ben + Nic | same fortnight as the chair talk |
| Who signs the accountant letter, what artifact, by when | Ben | before match paper moves |
| Chair and Secretary confirmed | Ben + Nic | 3 Aug board meeting |
| Butterfly conflicts register + Kristy standing aside on Oonchiumpa decisions | Board | before AGM |
| Notice of meeting if the company name changes at the AGM | Zandra / board | ~24 Aug |
| 51% ownership structure of the *selling* entity: decided-and-dated | Ben + Nic + MinterEllison | by 14 Sep |
| What happened at the 1 July Supply Nation threshold, and what it cost | Ben | unrecorded anywhere |
| Community-site operating block: **computed 2026-07-25**, $79,333/yr bare production block, $129,333 with a half-time line supervisor (`2026-07-25-matt-model-inputs-session-pack.md` §5). Open part is who pays the line supervisor, and whether trainer/WHS is ACT's cost or the site's | Ben + Nic | before the 3-statement build |
| Matt's six inputs: 1, 2, 3 carry a recommended position ready to confirm; 4 blocked on the CRM rebuild and on Jay; 5 computed; 6 needs a measured run | Ben | pack written 2026-07-25 |
| Maningrida 40-bed run actuals (time, diesel, plastic yield). Highest-value open input in the model: 250 vs 500 beds/yr is the difference between a site that cannot cover its own production block and one that retires its plant in under three years | Ben | next press run |
| Modules, not build paths. `engine.ts` cannot price Utopia (shredder only), Tennant Creek (existing shed) or Palm Island (governance first) | Ben, then Matt | before an ask is written for any of the three |
| Which of the 803-file branch ships publicly, and when | Ben | not yet grilled |
| Maningrida consent evidence: name where it lives | Ben | unresolved since 2026-07-21 |
| Kununurra Elder clearance (gates the Variant A opening) | Ben | standing |

## Findings logged but not yet ruled on

- **The Empathy Ledger syndication API is calling routes this deployment does not serve, and the
  storyteller pages have been silently building on fallback data.** Found 2026-07-25 while running
  the build gate. `npm run build` logs **18 soft failures every run** (12 individual storytellers,
  4 list fetches, 2 project insights). They fail soft by design, so the build stays green and
  nobody noticed. **EL is source of truth for portraits, so this quietly degrades a public
  surface.**
  - The client calls `/api/v1/sites/goods-asset-register/projects/{projectId}/storytellers`.
    That path **404s**. So does the matching `/projects/{projectId}/insights`.
  - The flat `/api/v1/sites/goods-asset-register/storytellers` returns **200 but `total: 0`**,
    under every scoping form tried (`projectId`, `project_id`, `projectCode`, `project`). So it is
    not a drop-in replacement; the syndication API appears unprovisioned for this site slug.
  - The **other** API in the same client works and has the data:
    `/api/v1/content-hub/storytellers` returns 200 storytellers (consistent with the known ~240).
  - Host, site slug, project id and API key all verified correct;
    `.env.local` and `.env.production.local` are identical, and Next prefers the latter on build.
    Without auth the endpoints return 401, not 404, so this is a route-shape problem, not a
    credentials one.
  - **Not ruled on, because the fix is a choice:** repoint the syndication calls at content-hub,
    or have the EL side provision the `/sites/{slug}/projects/{id}/*` routes. Worth checking
    whether `projectId` actually filters content-hub before repointing (limit=200 returned 200
    rows with and without it), though the `cleared-voices` allowlist is the person-level gate
    regardless.
  - **Fixed meanwhile:** `SyndicationFetchError` now names the URL and whether a key was present.
    The old message was bare "Upstream 404 Not Found", which cost an hour of testing the wrong
    endpoint by hand. No secret is exposed; the key travels in a header.

- **GHL has no Transfer stage.** The `Goods — Community Pathways` pipeline (created 2026-07-24)
  runs Invitation → Listening → Brief returned → Community confirmed → Modules selected → Ready
  to cost → Funding pathway → Agreement → Delivery → **Operating** → Review and adapt → Paused.
  `pathway-stages.ts` closed exactly this gap on 2026-07-25 by adding Transfer as operating step
  7, and the fix never reached the system where pathways are actually tracked. Sixth stage model,
  live, in the tool the team uses.
- **`canon.ts:232` cites a GHL stage that does not exist.** The `signed-lois` source names
  "Supporter-Journey pipeline (Committed / Signed-LOI stage)". The pipeline's stages are
  Identified, Qualified, Cultivating, Ask made, Committed, Delivering, Stewarding/Reporting,
  Renewing, Lapsed, Declined/Parked. No Signed-LOI stage. The fact cannot be re-derived from
  where it says it lives. The value (0) is nonetheless correct: 0 rows at Committed.
- **The live asks do not match the published stack.** **Rebuilt 2026-07-25 (later, same day) from
  all 67 Supporter Journey rows**, which corrects two errors in the first-50 read recorded earlier:
  **SEFA IS in the CRM** ($300K, Cultivating, "repayable finance anchor"; the earlier note said it
  was absent), and **Centrecorp's forward $75K ask exists** at Ask made alongside the historical
  $123,332 at Renewing (the earlier note said only the historical row existed). Standing: **0 rows
  at Committed**, so canon's `signed-lois: 0` holds. At Ask made, excluding the Oonchiumpa-led
  **REAL Innovation Fund $2M**: Minderoo $200K (the CRM calls it a catalytic QBE-aligned grant),
  Tim Fairfax $150K, Snow $100K first-mover, Rotary Eclub $82.5K, Centrecorp $75K, total **$607.5K**.
  Repayable column at Cultivating: SEFA $300K, White Box SELF $250K, LendForGood $100K (CRM labels
  it "match candidate"), Metro Finance $60K, total **$710K**. Either column alone clears the $400K
  QBE match twice over, so **the match is short of paper, not of candidates**. Also live and
  unrecorded anywhere: **First Nations Finance, whose CRM record reads "no ownership gate"**, which
  is the standing blocker on most concessional capital. Full read:
  `wiki/outputs/2026-07-25-matt-model-inputs-session-pack.md` §4. Not ruled on.
- **Two canon facts assert a QBE gate the program terms do not state.** `canon.ts:233` and
  `claims-ledger.ts:208` both say the match gate needs "at least three signed LOIs by 31 August".
  The recorded program terms (`04-qbe-pipeline.md:9-14`) say only "at least matched by signed
  external commitments", with no count. Ben's own locked answer (`CONTEXT.md:34`) is a dollar
  figure. No source found for the number three.
- ~~**`check-community-copy.mjs` guards a superseded invariant.**~~ **FIXED 2026-07-25.** It hunted
  for "10 communities" and told you to write 9, while canon was 11: a two-generations-stale guard.
  Now **derives** the stale set from `CANONICAL_ASSETS.communitiesServed`, so it advances by itself
  when canon next moves. On first run it caught **7, of which 3 were real rendered defects**, all
  now reading from canon: `wiki/community/partner-guide/page.tsx:40` (a badged "9 Communities
  served", the same defect class as the press page found by hand), `deck.ts:115` ("Nine communities
  across Australia", in a file that already imported canon correctly 170 lines later), and
  `partner-dashboards.ts:341`. Two were comments (now skipped) and two are allowlisted with reasons.
  **Flagged, not fixed:** the illustration asset `16-nine-communities` is itself stale and needs
  regenerating; renaming is a separate asset pass.
- ~~**The banned-word list is enforced nowhere.**~~ **FIXED 2026-07-25** by `check-voice.mjs`, now in
  `check:drift` and `check:drift:ci`. This closes the session's own diagnosis, that prose had no
  drift check. **The rule it encodes: the banned list governs OUR voice, never other people's
  words.** Verbatim storyteller quotes, funder programme language (Snow's own principle is named
  "First Nations leadership and empowerment") and registered org names are exempt by path, each with
  a reason, because rewording someone else's words to fit our style guide is a worse error than the
  violation. **Two tiers on purpose:** FAIL on seven high-confidence bans, WARN with counts on
  `unlock` (9), `journey` (16), `catalytic` (13) and **em dashes (251)**, which are ambiguous or have
  a back-catalogue too large to fail on today without either an unrequested cleanup or an instant
  mute. **Ben's call to promote any WARN to FAIL.** The one live FAIL, `community-pathways.ts:236`
  "co-design", is fixed to "designed with community".
- **The Notion business plan §9 says "34 stories cleared for external use".** 34 is cleared
  *voices*, people, not stories. EL holds 2 published and public. Conflating a person-level
  allowlist with a story count, in a governance section.
- **Four things in the meaning layer have no representation in code or the deck:** the binary
  month-6 ownership test (four checkpoints, partial counts as NO, currently "not yet met at any
  site"); the seven proven community-transfer models (Notion §3); "one product, four systems"
  (`19-the-whole-picture.md:39`); and data sovereignty counted as an impact metric in its own
  right rather than as a gate things pass through.
