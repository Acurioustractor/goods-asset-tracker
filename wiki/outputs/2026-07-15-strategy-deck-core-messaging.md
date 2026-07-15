# Strategy deck core messaging, aligned

*2026-07-15. This is the single aligned message architecture for the Goods strategy deck, produced
from four sources: the signed narrative foundation (`wiki/outputs/2026-07-11-narrative-foundation.md`),
the live deck (`v2/src/lib/data/deck.ts`, goodsoncountry.com/pitch/deck), Ben's 14 July
"story-first relationship deck v2" draft, and Ben's "Sit down and ask us" essay. An adversarial
consent-and-claims verification pass ran over the first draft of this alignment; its eight
confirmed defects are corrected here.*

**Governing rule:** the signed foundation governs facts, figures, turn structure and the voice
roster. The 14 July draft and the essay govern spoken voice, honesty discipline and claim hygiene.
Where the new material is genuinely better, the foundation absorbs it, named explicitly below.

---

## 1. The verdict

The two documents are the same argument at different altitudes. The six signed belief turns
survive intact inside the 14 July draft. The draft adds three things the spine lacked (a live
opening, the truck-test hinge, an operating-system reframe of Turn 5) and subtracts three things
it must not (the second product, the consent-tiered voice roster, the specific QBE ask). The
integrated deck keeps the signed turn order and reinstates the subtractions.

**The deck is 10 slides.** Cover, model, Turns 1 to 4, the truck-test hinge, Turn 5, the ask,
closing. A consent-gated 2-slide Kununurra opening (Variant A) exists on paper only, in this
document and its Notion mirror. It does not enter `deck.ts`, the live site, the PDF or any
external surface until the gate in §5 clears.

## 2. What the 14 July draft and the essay add

| # | Element | Decision | Why |
|---|---|---|---|
| 1 | Kununurra opening (NAIDOC scene, two trial beds, her yes) | **HOLD, paper variant only** | Strongest possible opening, zero consent coverage. Her words, the scene description, audience and use all need her explicit clearance, and she needs a storyteller-registry record first. Never enters production code before then; the live /pitch/deck is public and click-to-editable, so "gated in the code" is not a real gate. |
| 2 | Invitation-is-not-a-mandate | **ADOPT as a standing principle** | Protects every demand claim in the corpus: PICC's facility ask, Groote's 300 washers, NPY's standing demand, Dianne's 20, and Kununurra alike. A request is evidence of direction, not a settled deal. |
| 3 | The truck test (what came in on it, what leaves on it, what stays) | **ADOPT as the hinge slide** | Goods-authored, physical, no consent exposure. Does in three questions what the transfer stage does in a paragraph. Used once, per Ben's own rule. |
| 4 | Claims-status labels (observed / requested / agreed / delivered / measured / proposed) | **ADOPT deck-wide** | Direct extension of the register honesty layer. Every figure chip and demand claim carries its status. |
| 5 | The "what not to do" list | **ADOPT as deck governance** | Lives in deck.ts note fields and presenter notes, never on screen. |
| 6 | Plant-as-operating-system (orders, wages, safety, maintenance, working capital, quality, governance; the dead-machine risk) | **ADOPT, merged into Turn 5** | Converts Turn 5 from aspiration into an investable operating problem, which is exactly what the Turn 6 capital buys. |
| 7 | Three-way partner ask (procurement / philanthropic / finance) | **ADAPT as pre-meeting routing, never a slide** | An ask menu is not an ask. Know the room, name one ask with amount, timing, decision and community partner, delete the other two. For the QBE deck the one ask is chosen. |
| 8 | Banned-words list (empower, beneficiaries, ecosystem, scalable solution, catalytic, transformational, journey, unlock, game-changing) | **ADOPT into brand voice standing rules** | "Catalytic" survives only inside the program name "QBE Catalysing Impact". |
| 9 | Write-for-the-ear rules (one job per slide, plain first person, keep the irregularity of speech, end with a decision) | **ADOPT** | The presenter script in §4 is built on them. |
| 10 | Essay claim: Warumungu names for BOTH products, with Norman and Patricia helping | **PARTIAL HOLD** | The registry supports Dianne having designed and named both products' story. What is NOT verified is Norman's and Patricia's role in the naming; that specific claim stays out until checked against transcripts. The essay's language-care line ("language offered through a relationship cannot quietly become company property") is safe and kept as a spoken line. |

## 3. The integrated deck

Quote rule: anything on screen in quotation marks renders registry-verbatim through
`storyteller-registry.ts`. Fragments and reported speech live in prose, without quotation marks.

| # | Slide | On screen | Voices (tier) | Claims-status | Photo | Video |
|---|---|---|---|---|---|---|
| 1 | **Cover** | Goods turns community knowledge into health hardware, local work, and production that communities can own. | Goods (Ben) | proposed (the model) | product/stretch-bed-community.jpg | hero loop optional |
| 2 | **The model** | One loop, run twice. Two products, designed in community. Steps: Listen · Design in community · Make on Country · Deliver and feed back · Transfer and support | Dianne Stokes named as designer and namer (external) | delivered (both products shipped through the loop) | process/factory-panorama.jpg | recycling-plant loop |
| 3 | **Turn 1: the need is real, and people name it themselves** | Sit on the dirt. Leave the pen alone. Listen long enough for the idea to change. | Anonymous Arlparra lines (usable unnamed) · Ivy (external) · Katrina Bloomfield (external, voice-only) · alternates Linda Turner, Gary (narrated only, E4 flag) | observed | media-pack/nic-with-elder-on-verandah.jpg | community b-roll |
| 4 | **Turn 2: the existing supply fails these places** | "You have to bring them on the barge. You can't just take them on the boat. You have to pay for freight. It all adds up." Alfred Johnson, Palm Island | Alfred Johnson (external) · Daniel Patrick Noble (external) | observed | media-pack/deadly-heart-trek-aug-2025.jpg (weakest fit, see gaps) | stretch-bed montage |
| 5 | **Turn 3: the products work because community designed them. Both of them.** | Washable canvas. Replaceable parts. A height older people could get out of. | Dianne Stokes (external, Pakkimjalki Kari line) · Dorrie Jones (external) · Melissa Jackson (external) · Patricia Frank (external, washing and health) · Dr Boe Remenyi (external, labelled practitioner) | delivered; health stated as the why only | product/stretch-bed-hero.jpg + pitch/bed-seq strip + product/washing-machine-name.jpg | jaquilane overlay where testimony referenced |
| 6 | **Turn 4: the making belongs in community hands** | "Yeah, I'll be rocking up every day to make them." Mykel, Utopia | Mykel (external, youth-care framing) · Fred Campbell narrating Xavier (external, never Xavier direct) · Karen Liddle (external) · Kristy Bloomfield (external) · Bloomfield family build narrated as fact | delivered (paid builds happened) | build/build-001.jpg | mykel-building-the-bed.mp4, already wired |
| 7 | **Hinge: the truck test** | The product is proven. The transfer is not. What came in on the truck? What leaves on it? What stays? Chips: 496 beds across 9 communities (delivered) · 16 washing machines in community (delivered) · 2,660kg plastic diverted (delivered, Stretch-only) | Goods (Ben), no community voice | delivered (chips), proposed (the transfer) | utopia/utopia-09.jpg (place-attributable delivery) | utopia-delivery-road.mp4 |
| 8 | **Turn 5: the plant makes the pattern transferable; ownership is the promise, and it is not true yet** | Ownership is a pathway. What has to move: title, contracts, margin, knowledge, decisions. | Norman Frank (external) · Shayne Bloomfield (external) · alternates Karen Liddle, Dianne Stokes | proposed (transfer plan), requested (Oonchiumpa plant interest, PICC facility ask, Dianne's 20, Anyinginyi reorder) | process/heat-press-full.jpg + community-ownership diagram inset | recycling-plant loop |
| 9 | **Turn 6: the ask, once, near the end** | AU$400K through QBE Catalysing Impact, matched at least 1:1 by signed external commitments. Signed letters by 31 August 2026. | Shayne Bloomfield carries the ask · Dianne carries scale (both external) | proposed (ask and match stack, 0 LOIs signed today), measured (revenue AU$713,827 carve-out, the only external revenue figure) | qbe/communities-screen.png + where-750 chart | none (text slide is fine) |
| 10 | **Closing: the synthesis** | We know what we need. Sit down and ask us, make it with us, and leave the making with us. Rendered WITHOUT quotation marks, margin label: a Goods synthesis; no one person said this sentence. | Goods synthesis | proposed (the standard Goods is held to) | media-pack/lying-on-stretch-bed.jpg | none |

**Variant A (paper only until §5 clears): Kununurra opening, 2 slides in front.**
Slide A1 "Kununurra, now": an Elder has agreed to try two beds and is asking how local production
could work. Her words are not reproduced anywhere in this document or its mirrors; they stay with
Ben until she clears exact words, context, audience and use. Slide A2 "An invitation is not a
mandate": two trial beds, a question about local making, the wider decision belongs to a local
process that has not happened yet. A2's principle is already adopted ungated as deck governance.

## 4. Presenter script

Ben's first person, built from his 14 July spoken text and the essay. Registry quotes stay
verbatim. The default run has no Kununurra content.

**1. Cover.** Goods turns community knowledge into health hardware, local work, and production
that communities can own. Goods started with a bed, but the first thing we had to learn was how
to sit down. From a distance it can look like Goods is a couple of people driving around
Australia taking products into communities. The photographs tend to show the truck, the bed and
the handover. They do not show the part that makes any of it possible. Before we arrive, someone
has taken the call, spoken with families, worked out where we should go and decided to let us in.
They carry the relationships. We carry the components.

**2. The model.** Goods is one loop, run twice. Listen. Design in community. Make on Country.
Deliver and feed back. Transfer and support. The Stretch Bed came through that loop, and so did
Pakkimjalki Kari, the washing machine Dianne Stokes designed and named in Warumungu. Two
products, different community hands each time: Elders designing around the fire, a family
building the current machines with Nic, young people building beds through Oonchiumpa. Every
product into a home feeds back into the next design. And the plant itself is built to be handed
over, place by place, with Goods staying on as support rather than owner.

**3. Turn 1.** We came with prototypes and more certainty than we should have had. Gary in Mount
Isa described consultation as sitting on the grass or dirt, around the fire, without the pen and
paper, and listening. His words exposed something uncomfortable. Asking is easy. The hard part is
staying quiet when the answer begins to undo your idea. People spoke about family coming to stay
and too few beds in the house. Freight. Mattresses on floors. Snakes. Sore knees. In Arlparra, a
household told us they had been sleeping on a door. People already understood all of this. They
did not need us to diagnose their lives. We were the ones catching up.

**4. Turn 2.** A product made for a quiet suburban bedroom does not always survive a large
family, constant movement, heat and dust. And most products never get there at all. Alfred
Johnson on Palm Island put it plainly: you have to bring them on the barge, you have to pay for
freight, and it all adds up. Daniel Patrick Noble told us what that arithmetic means: sometimes
people would rather go without. Freight, cost and distance break the ordinary supply chain long
before it reaches the community. Remote families pay too much for goods that fail too quickly.
They can be made better.

**5. Turn 3.** People showed us what the last bed got wrong, and the next one changed. Washable
canvas. Replaceable parts. A flat pack for the road. No toolbox needed. A height that gave older
knees a fair chance. The Stretch Bed is made from those corrections. Every version carries the
fingerprints of people who told us the last one was not good enough. The washing machine followed
the bed; one without the other left the job half done. Dianne Stokes designed it and named it
Pakkimjalki Kari. She says that every time she goes away, it is like it is calling her: come
back home. (Word purged 15 July on Ben's call: the colour-request opener read as branding, not
meaning. The factual demand record, three beds requested after his daughter tried one, stays in
the compendium register.)

**6. Turn 4.** The work with Oonchiumpa in Alice Springs pushed the question to the front. Young
people built beds outside the office before the Utopia trip. Mykel said, "Yeah, I'll be rocking
up every day to make them." He was not talking about attending a program. He was talking about
making something his community needed. Fred, his case worker, tells the story of Xavier going
back to family, so proud showing them that he can build it. And the Bloomfield family built the
current washing machines with Nic. Different hands, the same loop. Mykel made us look at the
supply chain from the other end: why did the making, the wage and the machinery keep beginning
somewhere else?

**7. The truck test.** The beds are real. The deliveries are real. 496 beds across nine
communities. Sixteen washing machines in community. 2,660kg of plastic diverted. People have
assembled them, used them and asked for more. But a delivery count does not tell us where the
work, tools, contracts, margin or decisions sit. The truck is a useful test for this whole
project. What came in on it? What leaves on it? What stays? If the beds stay but the jobs, tools,
knowledge and decisions leave with us, then we have delivered a product and preserved the old
arrangement.

**8. Turn 5.** Dropping machinery in a community would be the easy part. Keeping it operating is
another matter. People need wages and enough orders to support them. There is safety training,
maintenance, quality control and the gap between buying materials and being paid. A facility
handed over without that support can become another dead machine sitting at the edge of town.
Goods is not yet a community-owned production system, and we will not use the word ownership as
decoration. Oonchiumpa has asked about owning a plant. PICC has asked to buy a production
facility. These are requests, not settled deals. We are moving closer to community ownership, and
we have to be explicit about what Goods holds today, what can move, on what timetable, and what
support remains after it does.

**9. The ask.** We are not asking you to rescue a community or sponsor a delivery photograph. The
funding buys the bridge: the first 50-bed production run in our own plant, taking the cost model
from modelled to measured; the first place-based ownership pathway with Oonchiumpa; the
enterprise-support layer; and plant capital. AU$400K through QBE Catalysing Impact, matched at
least one to one by signed external commitments. We need those signed letters by 31 August.
Ordinary capital will not fund this stage, because the return we are building is the transfer
itself: assets, jobs and authority moving to community hands. We ask partners to accept that
trust moves more slowly than a grant deadline.

**10. Closing.** We have been using one sentence to hold all of this. We know what we need. Sit
down and ask us, make it with us, and leave the making with us. No one person said that whole
sentence. We assembled it from what people have told us and from the direction they have pushed
the work. Each part makes a demand on us: whether we believe the knowledge already in community,
whether we can listen long enough to have our plans changed, who is being paid, and what stays
after we leave. Community is the subject of the first beat and the last. Goods only appears in
the middle, as the verb.

*Variant A additions (paper only): an opening scene set in Kununurra and a closing pair of
sentences returning to it. Both stay out of every surface until §5 clears. Her exact words are
not reproduced here.*

## 5. The Kununurra gate

Before Variant A exists anywhere beyond this document and its Notion mirror:

1. The Elder clears her exact words, the scene description, the intended audience and the
   specific use, herself.
2. She receives a storyteller-registry record with tier set by her decision, and the deck reads
   her material through the registry like every other voice.
3. The drinking-in-front-yards detail never appears in any deck, script or artifact, in any form.
   The 14 July draft itself bans it.
4. "Kununurra wants a facility" is never written or said. One Elder's yes opens a conversation;
   the wider decision belongs to a local process that has not happened yet.
5. Until all of the above: the deck's only reference to Kununurra is nothing at all.

## 6. Media, reviewed with use cases

Full inventories: `scratchpad/out-photos.md` and `out-videos.md` (session files, tables mirrored
on the Notion page). Committed and web-served unless noted.

**Photo picks by slide (from the 150+ file sweep):**
cover product/stretch-bed-community.jpg · model process/factory-panorama.jpg · T1
media-pack/nic-with-elder-on-verandah.jpg · T2 media-pack/deadly-heart-trek-aug-2025.jpg
(placeholder, see gaps) · T3 product/stretch-bed-hero.jpg + pitch/bed-seq-1..3 strip +
product/washing-machine-name.jpg (the loop-run-twice proof) · T4 build/build-001.jpg · hinge
utopia/utopia-09.jpg (place-attributable) · T5 process/heat-press-full.jpg · ask
qbe/communities-screen.png · closing media-pack/lying-on-stretch-bed.jpg. Spares:
media-pack/community-testing-bed-golden-hour.jpg, media-pack/washing-machine-enclosure-sunset.jpg.

**Video picks:** T4 partners/oonchiumpa/mykel-building-the-bed.mp4 (89s, cleared, already wired
into the deck) · funder-meeting cutaway jaquilane-testimony.mp4 (72s, sound on, never a
background) · T5 recycling-plant-desktop.mp4 (34s loop) · hinge/delivery
partners/centrecorp/utopia-delivery-road.mp4 (12s loop) · partner authority
partners/oonchiumpa/karen-liddle-on-beds.mp4 (40s).

**Gaps that matter (build list, not blockers):**
1. Turn 2 has no photo of the actual supply failure; the "two price tags" diagram is the fix.
2. Turn 5 has no real transfer photo; a Bloomfield-family-at-the-plant image is the strongest
   missing asset.
3. 7 of 9 communities have no place-attributed public media; the "9 communities" claim leans on
   the map. No Kalgoorlie, Palm Island or Darwin imagery despite transcript-backed trips.
4. No Pakkimjalki Kari in-use footage; the two-product loop is video-blind on product two.
5. Ask-slide charts (cost-curve, breakeven, where-750) exist only in gitignored staging; nothing
   committed. May-trip Utopia files (alice-youth, ampilatwatja-elders, beds-being-made,
   delivery-drone) still not in the repo.

## 7. Formats

| Format | What | Where | Use |
|---|---|---|---|
| Website deck | /pitch/deck edit view + fullscreen Present, now with presenter notes | live, goodsoncountry.com/pitch/deck | the room: present from the browser |
| PDF | 10-slide print cut with the spoken script under each slide | design/deck-assets/goods-strategy-deck-2026-07-15.pdf (local-only, media stays out of git) | email-ahead, leave-behind |
| Notion | "Goods strategy deck: core messaging + artifact library" under the Artifact Hub | Notion, internal | alignment surface; links, never duplicates |
| Photos/videos | use-case tables above | repo + Notion mirror | per-slide backgrounds, cutaways, social |

Per-audience routing (pre-meeting, never a slide): procurement rooms get orders language,
philanthropic rooms get training-governance-repair language, finance rooms get
machinery-and-working-capital language. One ask per room, the other two deleted.

## 8. Flags register (corrected after verification)

1. CONSENT, CRITICAL: the Kununurra Elder's words and scene are uncleared; §5 governs. No
   registry record exists yet.
2. CONSENT, CRITICAL: the drinking-in-front-yards detail never surfaces anywhere.
3. FIGURE, HIGH: match stack (SEFA $300K, Snow $100K, Centrecorp $75K) is proposed, 0 signed
   LOIs today; never shown as committed. Fixed in deck.ts this session.
4. RESOLVED 2026-07-15: Gary's fire-and-dirt line verified against his 5,264-word transcript,
   near-verbatim ("sitting down on the grass, on the dirt, with the fire, that's our
   consultation, without the pen and paper, and just actually sit down and listen"), in an
   interview substantially about Goods (15 bed mentions); the "Beyond Shadows" tag was a Notion
   mis-filing, EL files it under Goods. Narration in the script is faithful; on-screen verbatim
   use awaits Ben promoting the line into the registry.
5. FIGURE-CLAIM, MEDIUM: Norman's and Patricia's role in Warumungu naming is unverified; Dianne
   as designer and namer of both products' story is registry-supported and usable.
6. BRAND, MEDIUM: deck.ts carried em dashes, spaced units and lowercase on-Country; fixed this
   session.
7. FIGURE, MEDIUM: 31 Aug is the signed-LOI gate, not the application date (Sept) or outcome
   (Nov); the ask chip now says "signed LOIs by 31 Aug 2026". QBE prefers repayable structures;
   the structure is not settled, so "recoverable" is not promised in copy.
8. CONSENT-QUOTE, LOW: Mykel on screen is always the registry verbatim "Yeah, I'll be rocking up
   every day to make them.", never a paraphrase.
9. BRAND, LOW: banned words apply to all deck copy; "catalytic" only inside the QBE program name.
10. CLAIM-CEILING, LOW: health carried by Patricia Frank plus Dr Boe Remenyi labelled
    practitioner; never Jessica Allardyce's held line; always the why, never an outcome.
11. CLAIMS-STATUS, LOW: 2,660kg is Stretch-only provenance (internal note); Ray Nelson's
    back-pains line, if ever used, is lived experience, never a measured result.
12. CONSENT, LOW: pending-tier voices (Frankie Holmes OAM, Donald Thompson OAM, Charley) and
    website-tier Zelda Hogan stay out of funder surfaces; "which Ivy" is still open before print.
13. SYNTHESIS RULE, LOW: the synthesis sentence appears without quotation marks on every surface,
    labelled as a Goods synthesis (this document renders it in italics when mentioning it).

## 9. What changed on the live deck (this session)

- New hinge slide (the truck test) between Turn 4 and Turn 5; delivery chips moved there from
  the ask slide with claims-status labels.
- Presenter script added to every slide; Present mode gained a notes toggle (N key).
- Ask slide: match stack relabelled proposed; "recoverable" removed; LOI-gate chip corrected;
  em dash removed from the headline.
- Turn 5: operating-system framing merged in; requests labelled as requests; em dash removed.
- Closing: the synthesis sentence is the headline, unquoted, with the Goods-synthesis label.
- Chips: units closed up (26kg, 200kg, 2,660kg, 5min).
- No Kununurra content anywhere in the code.
