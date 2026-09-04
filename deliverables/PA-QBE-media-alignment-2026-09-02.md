# One message, three rooms

**September 2026. The Philanthropy Australia conference, the QBE Stage 2 application, and the
Palm Island media story, aligned before anything gets built in Pencil.**

Working brief, 2 September 2026. Every fact below was read from code, a dated ruling, a sourced
email or a live page on the day. Where two sources disagree the disagreement is listed in §7 and
not quietly resolved. Confidence labels: **verified** (invoice, register, email from the source),
**workpaper** (our arithmetic), **modelled**, **proposed** (a design, not yet agreed).

---

## 0. The calendar

| When | Room | What is happening |
|---|---|---|
| Wed 2 Sep (today) | Media, video | Red Films want the text slides locked. Pia Akerman (The Shape Agency, for Philanthropy Australia) starts pitching the Palm Island story this week. |
| **Thu 3 Sep, 2 to 3pm Sydney** | QBE | Final cohort check-in on Zoom. The last cheap chance to ask Jay Boolkin the entity and match-paper questions in §5. |
| **Mon 7 to Fri 11 Sep** | PA conference | Brisbane Convention and Exhibition Centre, Turrbal and Yuggera Country. Core days Tue 8 to Thu 10, Masterclass Monday, Field Trip Friday. Theme "Mobilising Generosity, Shaping the Future". Six-film suite "Inspiring stories of Queensland giving" plays; the Goods film is one of six. Snow's Georgie, Sally and Marie will be there. Margot from Dusseldorp will come to CONTAINED. |
| **Thu 10 to Sat 12 Sep** | CONTAINED x Goods at The Harvest | 9 Gumland Dr, Witta. Beds pressed and built live, visitors make one. Overlaps the last conference day and Field Trip Friday. |
| Pia's window | Media | A 600-word print piece or a two-minute TV package. ABC or SBS, or News Corp via the Townsville Bulletin syndicated nationally. |
| **Fri 25 Sep, 12pm AEST** | QBE | Stage 2 application closes (Zoho form). Sourced: Jay to the cohort, 24 Aug. This replaces "late September" everywhere. |
| **Fri 25 Sep** | Brian M. Davis Charitable Foundation | Application closes, same day as QBE. Miranda Campbell invited Goods On Country on 1 Sep to apply for up to $100,000 over 12 months. Board 19 Nov. She wants youth employment, school and community engagement for children and young people, and recycling including Décor plastics. She is at the conference and wants to see a bed. |
| **Fri 9 Oct, 5pm AEST** | Tim Fairfax Family Foundation | SmartyGrants closes. Katie Norman invited The Butterfly Movement on 31 Aug to apply for $300,000 over three years in three equal payments, "to support the Goods on Country initiative". Board late November. |
| **Wed 7 Oct, 9:45 to 10:15 Sydney** | QBE | Application review meeting, booked. Thirty minutes, on the materials already submitted. |
| Fri 23 Oct · Fri 13 Nov · 10 or 12 Nov | QBE | Conditional outcomes · pre-condition deadline · final event hold. |

Three rooms, three weeks, and the same twelve facts have to hold in all of them. That is the
whole job of this brief.

---

## 1. The one sentence

Open with the north star, never with a dollar. `NORTH_STAR` in `content.ts`, imported, not retyped:

> The goal was never a bigger Goods. It is a community that can collect the plastic, make the
> goods, and come to own the making.

Then the proposition for September, which is the $750,000 raise in one line:

> **Goods on Country is raising $750,000 to put 1,000 beds into five communities, with each
> community deciding what is given, what is sold, who is paid and what comes next.**

And the sentence that travels with it every time, in every room, until the rules are agreed:

> The rules for sales money, resale and who holds the beds are being agreed with each community.
> Until they are, the numbers are a design, not a promise.

**What the $750,000 is.** One thousand Stretch Beds at the public price of $750 (verified against
the live products table). The 26 August deck brief frames it as one catalytic investor funding
1,000 beds, governed by the Goods on Country board, split as five community pools of 200. The
25 August research frames the same total as 500 community-bought beds plus 500 donor-matched. Both
arrive at $750,000. The deck version is later and is the one Ben is building, so this brief
assumes it. §7 carries what that assumption leaves open.

**What the $750,000 is not.** It is not community income, it is not a facility, and it is not the
running cost of Goods. On today's kit path a delivered bed costs about $685 (workpaper), so
$750,000 buys 1,000 beds delivered with roughly $65 a bed left over, and nothing for the
$109,500-a-year network block or the wraparound. The two pots rule still holds: bed money makes
beds, philanthropy buys the block. So this raise sits beside the network ask on `/pitch/road`, it
does not replace it, and the deck has to say which one it is asking for in which room (§7.1).

---

## 2. Three rooms, one cut each

The audience model in `audience.ts` has one rule: lead with the thing that reader came for, then
earn the rest. Each room below is a cut of the same twelve facts, never a new document.

| | **PA conference** | **Media (Pia)** | **QBE Stage 2** |
|---|---|---|---|
| Who is reading | A thousand funders and sector people, in a hall, between sessions | A journalist with 600 words or two minutes, and a reader who has never heard of Goods | Jay, then the Steering Committee, at diligence depth |
| Lead with | The road. Palm Island is stop four, "money enters here". Alfred Johnson's barge line, then the bed | One person and one object on Palm Island. The barge, the floor, the bed | The model first, and "$0 signed" stated before anything else |
| The proof | 540 beds, 11 communities, nine years. Forty beds pressed at the farm and built at Gamardi | Three verified facts (§4) and two cleared voices | Matt's financial model (done, Jay closed the loop 1 Sep), the 40-bed run, the receivables truth, the entity diagram |
| The ask | Arrives late and once: the 1,000 beds. Door is donate, DGR through The Butterfly Movement Ltd trading as Goods on Country | None. No dollar figure at all | The enterprise ask by legal home, with the 1,000-bed program as the demand-led use a catalytic grant de-risks. QBE is never the matcher |
| Must never see | The cost model as a spreadsheet · a bed number as a threshold · "co-design" · "QBE matches it" | "manufacturing on Palm Island" · "creating employment" · a health outcome · Ben and Nic as the heroes · any unverified count | "QBE will match" · "$400,000" as a plan · modelled figures read as measured · the charity board offered as proof of 51% |
| Artifact | The suite film (theirs) · a one-page leave-behind with a QR to `/pitch/road` and the Gamardi film · a Snow line | A one-page media note: boilerplate under ruling X, three facts, two quotes, cleared photos, contacts · the corrected video text | The Zoho form answers · the Pencil deck · the model · entity diagram · signed letters · accountant's letter |

The media column is the one most likely to leak. A journalist will lift a line from the film's
text slide, and the current second slide overclaims (§4). Fix that today and the media column
mostly takes care of itself.

---

## 3. The Gamardi film and what it is allowed to say

The file is `GOODS IN GAMARDI - HSC FINAL 210826`, four minutes, on Frame.io. It is live on the
site as the Maningrida case study (Descript embed) and on the homepage. Nic has already sent it to
the QBE volunteer team, to Jay ("so f'ing cool, will share with the SIH team") and to Pia.

**What it proves, in one line for every room:**

> Forty beds proved the whole process. Legs shredded, pressed and cut at the farm, packed flat,
> sent north, and built at Gamardi by young people and Elders with Homeland School Company. The
> beds stayed. Eight washing machines are now recorded in Maningrida.

The caption already in code (`home.ts`) is the one to reuse: *"Forty beds and the school washing
machine, built with the Gamardi community and Homeland School Company."*

**What it must not be made to say.** That Gamardi owns the making (the ownership test reads "no
site is yet eligible", derived, not written). That the per-bed cost is measured (it is modelled;
the measured run is what the money buys). That Gamardi was a production site (kits were
assembled there, and assembly is recorded as assembly). Never "zero beds pressed in-house"; that
line has regressed three times and is code-guarded.

**Where it sits.** QBE: the traction slide, already in their hands. PA: it is not the suite film,
so it plays at CONTAINED and behind the QR on the leave-behind. Media: Pia has asked for Palm
Island only, so the Gamardi film is offered as context and not pushed.

If "video message" meant a new piece to camera from Gamardi rather than this film, that is a
field job, not a desk one, and there is no Maningrida voice in the registry cleared for it
(confirmed by Ben 25 July).

---

## 4. Palm Island, and the ceiling on what can be said

**Where it sits, verified from code and the register.**

- 131 beds on Palm Island, all Basket Beds, the legacy design. Zero Stretch Beds. Four washing
  machines in community, three retired. (`community-canonical.ts`, `asset-canonical.ts`.)
- Pathway stage: Listen, "Begin with Council". Lead organisation Palm Island Aboriginal Shire
  Council. No capability audit. No media assigned to the pathway until place, people and
  permissions are verified. The cost engine returns $0, recorded as the wrong answer because
  governance has a real cost the model cannot yet price. (`community-pathways.ts`.)
- Jahvan Oui and Ebony Oui are training with Defy for on-Country production. Jahvan is a
  cleared voice. Ebony is not yet cleared as her own voice. (`storyteller-registry.ts`.)
- The November 2025 trip built ten beds with community. The blog on act.place also planned a
  hundred beds for the Christmas Cup; that never became a register row, so do not reuse it.
- The refuse-facility redesign is the opportunity, and it is Council's call. (`road-ending.ts`.)

**The claim ceiling**, already locked on `/pitch/road` under ruling S:

> We are working toward making recycled-plastic production part of the wider refuse-facility
> redevelopment. The scope has not been agreed and no funding is secured yet.

Ruling S cleared Palm Island to be **named**. It did not turn the listening step into a request,
and Palm Island's field still reads "Where this sits", never "Asked for". Nobody on Palm Island
has been asked for 200 beds.

**The live defect.** Jodie's proposed second text slide reads: *"Goods on Country is working with
the Palm Island community to turn recycled plastic into portable, washable beds, creating
sustainable enterprise, skills and local employment opportunities."* Nic replied "Perfect thanks"
on 1 September. Ben's reply only covered the super. The 1 September guidance
(`research/jodie-davis-video-title-text-guidance-2026-09-01.md`) says the line makes local
production and employment sound achieved when the pathway is at Listen and 131 beds on the island
are all legacy Basket Beds. Send Jodie this instead, today:

> **Goods on Country has delivered beds to Palm Island and begun building local manufacturing
> skills. Recycled-plastic production is a future pathway being explored with Council and
> community.**

The rest of the slide text is fine as Nic answered it. Map labels: *Palm Island (Bwgcolman)* and
*Townsville, on Gurambilbarra and Thul Garrie Waja Country*. First slide: *Health hardware
designed in community. Made by community. Made for community.* End card: the full grounded
lockup, written name "Goods on Country", goodsoncountry.com. Super: Benjamin Knight, Goods on
Country, which Ben already sent.

**Voices cleared for external use, Palm Island** (`cleared-voices.ts`, registry tier external):
Alfred Johnson, Jahvan Oui, Ivy (which Ivy is still Ben's to confirm), Carmelita and Colette as a
joint card only, Daniel Patrick Noble, Jason, Mark (tier to confirm). The two strongest for a
journalist:

> "You have to bring them on the barge. You can't just take them on the boat. You have to pay
> for freight. It all adds up." Alfred Johnson

> "There's gotta be a break in the cycle somewhere. Soon as you break the cycle, all this stuff
> stop." Jahvan Oui, said during the washing-machine delivery

**Uncle Alan and Narelle**, the two people in Red Films' interview, are not in our registry. Their
consent for the film sits with Philanthropy Australia and Red Films. Reuse in a newspaper is a
different use, so Pia's proposal to contact them directly is the right one, and Council should
hear about the story before a journalist does. The data-sovereignty gate in `STRATEGY.md` §10 is
exactly this: the community controls what is published about this site.

**Photos.** Pia pasted three or four. The pathway record says Palm Island media is not assessed,
so each photo needs a person-level check against the cleared list before it goes to a newsroom.
No identifiable person who is not on that list.

**Which funder paid for Palm Island.** Pia wants Maree to give the philanthropy lines. If a funder
is to be named against Palm Island specifically, that needs a Xero or GHL source first.
`GRANTSCOPE.md` warns to separate paid travel and video work from product trade on Palm Island
and to preserve the voided-bed invoice contradiction. Unverified until Ben says otherwise.

---

## 5. QBE, in the order the form asks

The form asks for entity structure, amount sought, use of funds, impact, other capital raised or
sought, readiness to deploy, and supporting documents. Jay's instruction: substance over length,
and if the enterprise has related entities, say which one applies and how funds flow.

**The amount.** SIH's typical range is $150,000 to $400,000 from a pool of up to $1.1 million
across ten enterprises, catalytic, never matching. The bottom-up need by legal home was sized on
1 August at $367,000 to $620,000: repayable $192,000 to $367,000 into the trading entity
(equipment, working capital) and grant $175,000 to $253,000 into the charity (measured 50-bed run,
running cover, scoping). Ask QBE for a figure inside their range, tie it to those blocks, and
present the 1,000-bed program as the demand-led use the grant de-risks. Bed-matching philanthropy
and SEFA are the external commitments a grant is measured against. Three mechanisms, kept visibly apart.

**The stack as Ben has it, and where it bends.** A parallel session read Ben's Notion "QBE final
application" page: QBE $400,000 for beds, Brian M. Davis $100,000 for beds, Tim Fairfax $100,000
for beds, Dusseldorp $50,000, Snow $100,000, which sums to $750,000. Two of those five now have a
written invitation naming amount, entity and a callable contact (Katie Norman, 31 Aug; Miranda
Campbell, 1 Sep), which is the shape of match paper Jay described, though an invitation to apply
is not yet a commitment. Three things bend. The stack only reaches $750,000 if QBE gives the top of
its range, and ruling V says never present $400,000 as a plan; at the 2025 average of about
$102,000 the stack is $452,000. Tim Fairfax's invitation is $300,000 over three years to The
Butterfly Movement, so $100,000 is year one, and the other $200,000 is not bed money for this
program unless Ben decides it is. Katie's own words are that TFFF invests in "the resilience of
organisations doing good work in rural Queensland and the NT", which is block language, and the
block is the thing §1 found unfunded. The parallel session's plan recommends TFFF funds the network
block and leaves the $750,000 bed pool alone. Ben's call. Dusseldorp's only sourced money is $15,000 released in June for
CONTAINED, so $50,000 is an ask, and Snow's $100,000 sits at "Ask made" with a catch-up booked. So
the honest sentence for QBE is that two invitations and three live asks sit behind the raise, and
$0 is signed.

**The entity, which ruling X reopened.** The cohort entrant is A Curious Tractor. Ruling X
(28 August) moves the whole model into Goods on Country, a business name of The Butterfly Movement
Ltd, and retires the separate Goods. layer. The 25 August research line "Name Goods. as the
enterprise" is dead three days after it was written. The form's "which entity is applying" now has
to be answered under ruling X, and it is the first thing to ask Jay tomorrow. The two invitations
sharpen it: Tim Fairfax invited The Butterfly Movement, Brian M. Davis invited Goods On Country,
and the QBE entrant is A Curious Tractor. One operating home, three names on three funders' paper,
and the entity diagram has to show all three without contradiction.

**For Jay on Thursday**, updated from the 1 August handoff:

1. Which entity applies, given the operating home is now Goods on Country under Butterfly, and
   whether a grant can land in the charity while the external commitments sit with the company.
2. Does a letter of intent subject to board or credit approval count as a commitment.
3. Does bed-matching philanthropy for the 1,000-bed program count as an external commitment.
4. What the accountant's letter must cover: the entity, the carve-out, or both. It is still a
   submission blocker; COGS is $0 and 83.6% of income is unclassified in the sole-trader books.
5. Whether the Oonchiumpa-led REAL Innovation Fund application is a commitment or a conflict to
   disclose.
6. Timing. Brian M. Davis decides on 19 November and Tim Fairfax in late November, both after
   QBE's 13 November pre-condition deadline. Can an invitation to apply, or a conditional board
   outcome, stand as a commitment on 13 November, or does the match have to be signed by then.

**Already in hand.** Matt's financial model is final (Jay, 1 September; Ben confirmed). The
40-bed run, the case study and the film. Interview booked for 7 October. The QBE skilled
volunteer team kicked off on 2 September and has the film and the Utopia field note.

---

## 6. Artifacts: what exists, what Pencil builds, in what order

| Artifact | Room | State | Source it is cut from |
|---|---|---|---|
| Suite film, Goods segment | PA | Red Films recutting. Second text slide needs Ben's correction today | §4 |
| Gamardi film | All | Exists. Frame.io and Descript on the site | §3 |
| `/pitch/road` | PA, QBE | Live. Ask sentence is the network plus facility version; relation to the 1,000 beds undecided (§7.1) | `ask-surface.ts`, `road-ending.ts` |
| Pencil deck | QBE, PA | In progress. The live file is `v2/public/strategy/Goods Final Deck.pen` (saved 31 Aug 15:16, 571KB, open in Pencil), with the 28 Aug PPTX export beside it. **That path is gitignored** (`.gitignore:219`), so the deck cannot reach main from where it sits. Slide list as reported by the parallel session, not yet read by me: 02 The imported supply system · 03 Delivery was the easy part · 04 Start with a useful thing · 05 The making already works · 06 The product became local work · 07 Governance before capital · 08 First capital becomes local choice | `deliverables/goods-deck-diagram-system-2026-08-26.md` |
| **Media note, one page** | Media | **Build first.** Pia is pitching this week | §4 |
| **Leave-behind, A5 or postcard** | PA, CONTAINED | **Build second.** QR to `/pitch/road` and the film | The why-how-what postcards in `design/brand/kit/` (untracked) |
| Palm Island photo set with consent state | Media, PA | Build. Person-level check against `cleared-voices.ts` | EL and local tags |
| Snow paragraph | PA | Cut from the Q2 partner update | Notion, Impact Reporting Register |
| Zoho form answers | QBE | Build, after Thursday's answers | §5, `wiki/investor/19-` |
| Entity diagram | QBE | Build, after Thursday's answers | `STRATEGY.md` §6, ruling X |
| Accountant's letter | QBE | Blocked on the books | 1 August handoff §3 |

**Pencil order.** Media note. Leave-behind. Then the deck in the 26 August order: slide 08 (one
catalyst, five local loops), slide 07 (governance and decision rights, now under ruling X), slide
09 (one community, two uses). Then the QBE appendix pages. Nothing on the deck's money slides
until §7.1 and §7.4 are settled, because a slide built on a moving model gets rebuilt.

---

## 7. What has to be settled before the Pencil build

Each one is a real conflict found today, with a recommendation. None of them is a style note.

**7.1 Two asks are live on two surfaces.** `/pitch/road` asks for roughly $300,000 a year of
network support with the facility raised separately at $150,000 to $220,000. The deck asks for
$750,000 for 1,000 beds. Both are honest. Together, unexplained, they are the six-decks problem
again. Recommendation: the 1,000-bed raise is the philanthropy ask for September, the network and
facility lines stay as the enterprise ask for QBE and lenders, and one sentence on every money
surface says so. The one-money-surface rule in code should carry that sentence.

**7.2 The $750,000 is doing two jobs.** In the 26 August brief it is both the cost to fund 1,000
beds and "up to $750,000 maximum combined gross sales activity if all beds are sold". Use only the
first. Never print a resale total; it invites "so communities get $750,000", which the brief
itself says is false.

**7.3 The per-bed arithmetic leaves the block unfunded.** Worked in §1. Say it plainly in the deck. A
funder will find it otherwise.

**7.4 Five communities times 200 beds has no yes behind it.** Ruling S cleared four communities to
be named with what each asked for. Nobody has asked for 200 beds, and Palm Island has not been
asked for anything. Recommendation: name the mechanism and the five pools, and name a community
only once it has said yes to its pool. Palm Island stays at "where this sits" until Council has
seen it.

**7.5 The entity under ruling X versus the QBE entrant.** §5. Ask Jay tomorrow; nothing in the
application can be written until it is answered.

**7.6 The video's second text slide overclaims, and it has been approved in writing.** §4. One
email from Ben fixes it.

**7.7 Uncle Alan and Narelle, and Council.** Their film consent does not cover a newspaper. Pia
contacts them; Council hears first.

**7.8 The rulings and briefs this work depends on are not in git.** Ruling X, the 25 August QBE
research, the 26 August deck brief, the 1 September video guidance, the ALIVE model and the
1,000-bed diagrams all exist only as uncommitted files in this working tree, on a branch that is
26 commits behind main and is carrying another session's 280 modified files. Main has ruling T
(20kg per bed, 24 August); this tree does not. Recommendation: one branch off `origin/main`
carrying ruling X, those five documents and this brief, landed before the Pencil build starts, so
the build has a source that survives a laptop. The 1 August handoff named this exact pattern:
work reaches done and never reaches git. The Pencil deck itself sits under a gitignored path, so
it needs a home outside `v2/public/strategy/` or an explicit un-ignore before it counts as saved.

**7.10 The stack reaches $750,000 only at QBE's top of range.** §5. Ben's hand stack carries QBE at
$400,000, which is 53% of the raise resting on the one line ruling V says never to present as a
plan. Recommendation: show the raise as two invitations plus three asks with QBE as a range, and
let the 1,000 beds flex with what lands rather than promise the count.

**7.11 Brian M. Davis and QBE close on the same Friday.** 25 September, both. Two applications,
two portals, one week after the conference. Tim Fairfax follows on 9 October. The three
applications should be cut from one set of answers, which is what §2 is for.

**7.9 The public About page still says "a project of A Curious Tractor".** The film's end card
sends a thousand people to goodsoncountry.com during the conference. Fix the About page under
ruling X before Monday.

---

## 8. Today and tomorrow

**Today, Ben.** Send Jodie the corrected second slide (§4, one line). Reply to Pia. A draft:

> Hi Pia, yes, Palm Island only, agreed. Simple and impactful is right. Two things from our side
> so the story holds. First, Palm Island Aboriginal Shire Council should hear about it before a
> journalist does; I can make that call this week if you send me the one-paragraph pitch. Second,
> Uncle Alan and Narelle gave their yes to the film, and a newspaper is a different use, so your
> plan to ask them directly is the right one. The words on the record: Goods on Country has
> delivered beds to Palm Island and begun building local manufacturing skills, and recycled-plastic
> production is a future pathway being explored with Council and community. Nothing is made on
> Palm Island yet, and we would rather the story say that than have it corrected later. Photos: I
> will send a set where everyone in frame has cleared their image, by Thursday. I am on the
> Sunshine Coast 7 to 12 September and can do local media any day. Ben

**Tomorrow, 2pm Sydney.** The five questions in §5, in that order. Entity first.

**By Friday.** Media note and leave-behind built in Pencil. The photo set checked. The About page
fixed. The branch in §7.8 landed.

**Week of 7 September.** Conference, CONTAINED, Snow in the room. The ask is said once, late, and
carries its honesty sentence.

**By 25 September.** The QBE Zoho form and the Brian M. Davis application, cut from the same
answers. The entity diagram, the deck, the signed letters that exist. The accountant's letter is a
separate fight and is not won by a deck.

**By 9 October.** The Tim Fairfax SmartyGrants application, in The Butterfly Movement's name.

**A parallel session** is drafting the funding-stack strategy and the slide-by-slide QBE deck
narrative on top of this brief, in plan mode, and will hand its plan to Ben before any build. It is
not editing the deck, the About page or a branch, and neither is this one.
