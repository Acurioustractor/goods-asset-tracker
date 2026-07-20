# Handoff to Codex: ultra session on the Goods pitch deck

**Date:** 2026-07-15 · **Author:** Claude (session: strategy-deck-alignment) · **Audience:** Codex running a deep strategy session on the deck.

**Paste-ready prompt for Codex:**

> Read `wiki/outputs/2026-07-15-codex-deck-ultra-handoff.md` top to bottom, then read `v2/src/lib/data/deck.ts` and `wiki/outputs/2026-07-15-strategy-deck-core-messaging.md` in full. Your job is defined in §0 and the deliverables in §14. Respect every gate in §4 as absolute. You have no Notion, Supabase, Empathy Ledger, GHL or Xero access; everything you need from those systems is inlined in this document. Plan and write first; any code edits stay local on a new branch, no pushes, no PRs. Every Ben-gated item in §15 is a named checkpoint in your output, never silently resolved.

---

## 0. The job

Ben's brief, in his words: think hard about how we build this deck into a very clear message with no guff, a human and impact story built from people, places, history and community-led ideas.

This is not a from-scratch design task. A signed 10-slide deck is LIVE at `/pitch/deck`, built on a Ben-signed narrative foundation, and a six-concept format exploration has already been run and decided (§9). The ultra session's job is to pressure-test and sharpen what exists:

1. **Message clarity.** Is the through-line one clean argument a stranger can repeat after one read? Where does it sag, repeat itself, or hedge? What gets cut?
2. **Human depth.** The deck's raw material is people (39 registry voices, 16 strong cleared quotes), places (9 communities, each with a distinct role in the story) and history (Kalgoorlie Oct 2024 to Utopia May 2026). Is that material carrying the argument, or decorating it? Propose concrete slide-level rewrites where a person, place or moment can replace an abstraction.
3. **Coherence across surfaces.** The deck does not live alone. `/pitch`, `/pitch/document`, the gated funder pages and the grant library all speak to the same funders. §12 lists the real contradictions found today. Reconcile them or name them for Ben.
4. **The deck's actual job.** It exists to convert match funders (SEFA first) into signed letters by 31 August 2026, then to face the QBE Steering Committee with those letters attached. Every proposed change should be tested against: does this help a specific person in a specific room say yes?

Ben's taste signals, verbatim from the record: "less guff, more feeling and real things" · "reads like us making the deck, not public-facing" (why the deck was split public/builder) · "means fucking nothing, fuck it off" (killing a branding device built from his own draft) · "ONE deck, story-first, ask nested". The SIH/QBE diagnostic twice flagged Goods material as reading AI-generated and overclaiming. The enemy is polish without provenance.

---

## 1. How to work here

- **Repo root:** `/Users/benknight/Code/Goods Asset Register` (path contains a space, quote it). Active codebase is `v2/` only (Next.js 16, React 19, App Router, Tailwind 4). Never touch `deploy/`.
- **Read `CLAUDE.md` at the repo root.** It is authoritative and not auto-loaded for you.
- **Branch state:** working line is `docs/snow-onepager-assets`, currently 12 ahead and 12 behind `origin/main` (squash-merge divergence is normal here). It also carries uncommitted work from OTHER sessions (ghl-people-pull, el-push-photos, alignment-engine files, `v2/sites/goods-voices`): leave all of it intact. For any code edits, create a fresh local branch off `origin/main`. Do not push, do not open PRs; shipping goes through a worktree cherry-pick ritual owned by Claude/Ben.
- **Green gate:** `cd v2 && npm run build` exit 0. If a sandbox breaks the full build, `npx tsc --noEmit` clean is the fallback gate (a stale `.git/*.lock` can also linger in sandboxes; safe to remove if no git process is running).
- **Guards you must keep green:** `npm run check:drift` (canon numbers), `npm run check:storytellers` (voice tiers, banned fragments, misspellings), `npm run lint:brand` (21 brand-lint rules).
- **No MCP access.** Notion, Supabase, Empathy Ledger, GHL, Xero are out of scope. §10 inlines what you need from Notion. Never attempt DB writes; starred/tag state for media lives in Supabase and is not in the repo.
- **Build, don't over-plan.** State the approach in a few bullets, then produce the deliverable. No multi-phase plan documents beyond what §14 asks for.

---

## 2. Current state (verified 2026-07-15)

- The deck is **live on production**: public narrated story page at `/pitch/deck` (no password, noindexed like all of `/pitch/*`), internal editor at `/admin/deck-builder`. Single source of truth for every word, voice and picture: `v2/src/lib/data/deck.ts` (`deckUpdated = '15 July 2026'`).
- Shipped this week, all squash-merged to main and verified live: #142 (deck.ts becomes the deck of record, control room retired), #143 (core-messaging alignment + public/builder split), #145 (maroon device purged), #146 (51-photo community sweep wired into deck gaps), #147 (media workbench + swap widget + story atlas), #148 (transcript-provenance model in code), #149 (Gary's consultation line verified against his transcript), #150 (the narrated story page: presenter scripts as visible first-person narration, place-and-time stamps, provenance whispers), #151 (missing gallery images), #152/#153 (picker thumbnail fixes).
- The deck-builder round trip: edits save to localStorage in the browser, "Export edits" produces a markdown diff which a human hands to Claude to commit into `deck.ts`. No API writes anywhere. The public page renders only the committed version.
- A PDF leave-behind exists at `design/deck-assets/goods-strategy-deck-2026-07-15.pdf` (local-only, gitignored, 11 pages). It predates the narrated-deck copy changes: maroon fix is in it, place stamps are not. Parity regen is a Ben decision.
- Companion surfaces live: `/pitch` (plain-language investor case), `/pitch/document` (printable A4, dated "Updated 8 July 2026"), `/register` (public claims register, "Every number, audited"), `/cost-story`, `/impact` (password gated), gated `/funders/<slug>` pages, `/field-notes/utopia-may-2026`, `/bed/GB0-156-40` (one bed's QR life).

---

## 3. The message system as it stands

### The governing rule (signed 15 July)

Two documents govern, at different altitudes: the **signed 6-turn narrative foundation** (`wiki/outputs/2026-07-11-narrative-foundation.md`) governs facts, figures, turn structure and the voice roster; **Ben's 14 July story-first draft and the "Sit down and ask us" essay** govern spoken voice, honesty discipline and claim hygiene. The integration ruling is `wiki/outputs/2026-07-15-strategy-deck-core-messaging.md`. Read both in full before proposing anything.

### The core message (Ben's line, 9 July workshop)

> "Goods turns community knowledge into health hardware, local work, and production that communities can own."

### The 10 slides (current live deck, deck.ts)

1. **Cover.** The core message line. Script opens: "Goods started with a bed, but the first thing we had to learn was how to sit down." and "They carry the relationships. We carry the components."
2. **The model.** "One loop, run twice. Two products, community-designed." Five stages: Listen · Design in community · Make on Country · Deliver and feed back · Transfer and support. Pakkimjalki Kari is the second proof, not a side product.
3. **Turn 1: the need is real, and people name it themselves.** "Sit on the dirt. Leave the pen alone. Listen long enough for the idea to change." Anonymous Arlparra lines: "We've been sleeping on a door." · "Off the ground. That's the main thing." Script: "Asking is easy. The hard part is staying quiet when the answer begins to undo your idea."
4. **Turn 2: "The supply that already exists fails these places."** Alfred Johnson's barge/freight line. Kalgoorlie dump-site photo series (the supply failure itself, no people).
5. **Turn 3: the products work because community designed them. Both of them.** Dianne Stokes leads (Pakkimjalki Kari naming). Spec chips from products.ts. Health carried by Patricia Frank plus Dr Boe Remenyi labelled practitioner, always the why, never an outcome.
6. **Turn 4: the making belongs in community hands.** Mykel leads: "Yeah, I'll be rocking up every day to make them." Fred Campbell narrates Xavier (never a direct Xavier quote). Video: Mykel building his bed at home, in his own voice.
7. **The hinge: the truck test.** "The product is proven. The transfer is not. What came in on the truck? What leaves on it? What stays?" Chips labelled delivered: 496 beds across 9 communities · 16 washing machines · 2,660kg plastic. Goods voice only, no community voice. Used ONCE in the whole deck, Ben's rule.
8. **Turn 5: the plant makes the pattern transferable. Ownership is the promise, and it is not true yet.** "Ownership is a pathway. What has to move: title, contracts, margin, knowledge, decisions." Demand chips labelled requested (Oonchiumpa plant interest, PICC facility ask, Dianne's 20-bed self-fund offer). Script: "we will not use the word ownership as decoration."
9. **Turn 6: the ask (headline: "What the capital does, once, near the end.").** "AU$400K through QBE Catalysing Impact, matched at least 1:1 by signed external commitments." Chips: Measured revenue AU$713,827 (accountant-signed carve-out) · Proposed ask · Gate: signed LOIs by 31 Aug 2026. Script: "We are not asking you to rescue a community or sponsor a delivery photograph." and "the return we are building is the transfer itself."
10. **Closing: the synthesis.** "We know what we need. Sit down and ask us, make it with us, and leave the making with us." NEVER in quotation marks, always labelled a Goods synthesis; no one person said this sentence. Script: "Community is the subject of the first beat and the last. Goods only appears in the middle, as the verb."

### How the public page tells it

Presenter scripts render as visible first-person narration (Georgia serif), "Narrated by Ben Knight, co-founder". Place-and-time stamps above each chapter. Lead voice renders as a large pull-quote with portrait; provenance whispers under quotes ("recorded April 2025" for transcript-backed, "in his own recorded words" for Ben-provided, "from trip notes, shared with permission"; silence for curated). Quote rendering is consent-safe by construction: only registry primary/approved quotes can surface. Present mode is fullscreen with keyboard nav; speaker notes (N key) exist in the builder only.

### Write-for-the-ear rules (adopted)

One job per slide · plain first person · keep the irregularity of speech · end with a decision · registry quotes stay verbatim · fragments and reported speech live in prose without quotation marks · an ask menu is not an ask (one ask per room, the other two deleted; per-audience routing is pre-meeting prep, never a slide).

---

## 4. Non-negotiable gates (absolute, no exceptions)

**Consent**
1. **Kununurra: nothing, anywhere.** A 2-slide opening variant exists on paper only. The Elder's words are reproduced nowhere digital and stay with Ben. Nothing enters `deck.ts`, any page, any script, any proposal text, until she clears her exact words, scene, audience and use herself AND has a storyteller-registry record. "Gated in the code" is not a real gate: the public page is click-to-editable. Two absolute sub-rules: the drinking-in-front-yards detail never appears in any form, and "Kununurra wants a facility" is never written or said. Until then the deck's only reference to Kununurra is nothing at all. Do not write Kununurra content in YOUR deliverable either, beyond naming the gate.
2. **The registry is ground truth.** `v2/src/lib/data/storyteller-registry.ts` wins over every other file. Tiers: external (32 voices, funder-safe) · website · funder · pending · hold · internal. Unknown names default to hold. On-screen quotes are registry verbatim, never paraphrased.
3. **Specific holds:** Walter (entirely) · Jessica Allardyce (her RHD/washing line is the strongest in the corpus and is NOT cleared; use Dr Boe Remenyi's line instead) · Dianne's totem line and 24-years line · Kylie Bloomfield · Cliff Plummer and Brian Russell carry medical-disclosure holds · Zelda Hogan website-only · Georgina Byron AM funder-tier only, never in the community voice set · pending tier (Frankie Holmes OAM, Donald Thompson OAM, Charley) stays off funder surfaces.
4. **Xavier is narrated by Fred Campbell, never quoted directly** (consent held and approved by Oonchiumpa). Mykel and Xavier get youth-care framing always. Practitioners (Dr Boe Remenyi, Chloe, Wayne Glenn, Cliff Plummer, Tracy McCartney) are always labelled practitioners, never presented as community recipients.
5. **Photos are consent objects too.** Who is pictured and who is speaking are separate facts, never conflated. No anonymous hardship imagery for emotional leverage (hardship-with-people photos are indexed but never surfaced). Basket-Bed-era photos are history only, never on Stretch Bed product surfaces. `build/` series contains children's faces: deck use only per Ben's clearances. Kununurra-dated photos are held local-only.

**Claims**
6. **The claim ceiling (absolute).** Scabies to rheumatic heart disease is the WHY. It is never a claimed outcome. No "prevented", no "interrupted", no government-savings figure, no justice outcome. A health outcome only leaves the future column when a partner clinical method (Miwatj or equivalent) produces it, attributed to that partner.
7. **Ownership is a pathway,** "moving closer to community ownership", never claimed complete. No Goods entity meets an Indigenous-ownership tier today. Locked by Ben 2026-07-10.
8. **An invitation is not a mandate.** Every demand signal (PICC's facility ask, Groote's 300 washers, NPY's 200 to 350 standing interest, Dianne's 20) is labelled requested, "evidence of direction, not a settled deal". Demand is never revenue. The dead line "PICC will buy the production facility" stays dead; Palm Island is "scoping conversations with the community council", nothing more, anywhere.
9. **Claims-status labels on every figure chip and demand claim:** observed · requested · agreed · delivered · measured · proposed.
10. **Revenue externally is ONLY AU$713,827** (accountant-signed Goods-only carve-out). The consolidated figure is a LOCKED claim (digit-free statement until the accountant signs one figure). Never the $403,901 "surplus" (the entity P&L is a net loss); never the ~$907,569 reconciliation number. The match stack (SEFA $300K, Snow $100K, Centrecorp $75K) is proposed, 0 letters signed today, never shown as committed. "Recoverable" is not promised (QBE prefers repayable but structure is unsettled). 31 Aug is the LOI gate, not the application date (September) or the outcome (November).
11. **The synthesis sentence is never in quotation marks** and never attributed to a person. The truck test is used once. Product language: X-trestle tension design, canvas is structural; never "clip-on", "woven cord", "hardwood frame". Weave Bed does not exist (avoid Jimmy Frank's Weave line). Only the Stretch Bed is for sale.

**Voice**
12. **Zero em dashes, anywhere,** including your deliverable, code strings and commit messages. Also no en dashes in prose, no decorative arrows in prose or bullets, straight quotes only, units closed up (26kg, 2,660kg, ~5min). "On Country", "Country", "Elder", "First Nations" capitalised.
13. **"Co-design" is banned** in every form. The framing is "designed in community / with community". The community leads, Goods supports.
14. **Banned words:** empower, beneficiaries, ecosystem, scalable solution, catalytic (except inside the program name "QBE Catalysing Impact"), transformational, journey, unlock, game-changing. Plus the brand-lint list: donate/donation/charity framing, leverage, synergy, GTM, disrupting, revolutionary, game-changer, helping them. No AI-tell patterns: "showcases", "underscores", "stands as a testament", "not just X but Y", forced triads, puffery, hedging filler.
15. **DGR wording, locked verbatim:** "charitable and tax-deductible (DGR) functions run through The Butterfly Movement, our charitable home from this financial year". Never call Goods itself a charity.
16. **Required credit line on all investor material:** "Catalysing Impact, powered by Social Impact Hub, in partnership with QBE Foundation". QBE logo use needs written consent.

---

## 5. The people

41 records in the registry. The 32 external-tier voices are the deck's palette. Provenance model: `v2/src/lib/data/transcript-provenance.ts` (26 of 41 tracked voices are transcript-backed; transcript existing does not mean release granted; transcript TEXT is sacred and never enters the repo).

### The strongest cleared lines (registry verbatim, external tier)

| Line | Person, place | Notes |
|---|---|---|
| "We've never been asked what sort of house we'd like to live in." | Linda Turner, Tennant Creek | Registry note: could open the whole deck. Recorded Apr 2025. |
| "It means something that really makes me happy. Every time I go away, it's like it's calling me. Come back home." | Dianne Stokes, Tennant Creek | On Pakkimjalki Kari, the machine she named. Strongest product quote in the corpus. |
| "Yeah, I'll be rocking up every day to make them." | Mykel, Utopia | Build day, May 2026. He was not talking about attending a program. Registry verbatim only, never paraphrased. |
| "Never would have thought it would have come out like that." | Mykel, Utopia | Same session. (Wording check "would've" vs "would have" is a Ben item.) |
| "He knew what he was doing. He had the pattern of how everything was all coming together. He loved it. We took him back to the family and he just was so proud showing them that he can build it." | Fred Campbell narrating Xavier, Alice Springs | Always Fred's voice. |
| "They truly wanna a washing machine to wash their blanket, to wash their clothes, and it's right there at home." | Patricia Frank, Tennant Creek | THE community washing/health line. Curated: she has NO transcript (priority gap). |
| "You have to bring them on the barge. You can't just take them on the boat. You have to pay for freight. It all adds up." | Alfred Johnson, Palm Island | The supply-failure line. Recorded Jan 2025. |
| "When it comes from an Aboriginal person, it works. That's what makes the difference." | Jason, Palm Island | |
| "Most of our people in community are just on a blanket on the ground. These beds will come in handy. Mainly for the old elders. Getting up and down off the ground is very hard." | Katrina Bloomfield, Alice Springs / Utopia | Voice-only by design, no portrait. |
| "To see kids' faces with joy after making a bed, it just really hits you." | Karen Liddle, Oonchiumpa | |
| "I had a yarn with the girls one day. Said you got to get out and start your own business. That's how we started Oonchiumpa." | Karen Liddle | Origin of the partner org, in her own words. |
| "I want to see a better future for our kids and better housing. Not only here but for the whole nation. We're all struggling today for housing." | Norman Frank, Warumungu Elder, Tennant Creek | |
| "We put together crates, tied them up with plastic, joined them together to make it look like a bed. Just to have something to sleep on." | Mark, Palm Island | Tier confirmation is an open Ben item. |
| "Education and awareness is great, but you need to match it with something that actually enables people to change. It's great to say you should wash your sheets every week. But if you don't have a washing machine, that's not going to work." | Dr Boe Remenyi, paediatric cardiologist | The cleared washing-to-RHD logic line. Practitioner label required. |
| "I've put up with clients going to hospital with pneumonia from sleeping on the ground because it's too cold. In summer they're scared to sleep because of snakes." | Chloe, support worker, Kalgoorlie | Practitioner label required. |
| "Sitting down on the grass, on the dirt, with the fire, that's our consultation, without the pen and paper, and just actually sit down and listen." | Gary, Mount Isa | Transcript-VERIFIED 2026-07-15 (5,264-word transcript, longest in corpus) but NOT yet registry-promoted: on-screen use is Ben's call. Currently narrated in the Turn 1 script without quote marks. |

Also usable: anonymous Arlparra household lines, unnamed only ("We've been sleeping on a door." · "Off the ground. That's the main thing." · "Bring one for next door too."). Ray Nelson's back-pains line is lived experience only, never a measured result; it is flagged as phrased exactly like a clinical claim, treat as radioactive.

### Gaps a strategist should know

- **Patricia Frank has no transcript anywhere** and carries the washing/health thread. Recording her is the top provenance gap (Ben item).
- Fred Campbell: 24-word clip only; narrative weight rests on his curated card. Kristy Bloomfield: partner lead records only, no transcript.
- Portrait gaps: Dr Boe Remenyi, Ray Nelson. Voice-only by design: Katrina, Shayne, Dorrie.
- Open identity items: "which Ivy" (before any print use) · Linda Turner vs Norman Frank attribution of the "My father was of this country" line · Warumungu spelling confirmations sit with Patricia/Norman (canonical spelling stays Pakkimjalki Kari) · Norman's and Patricia's role in the naming is unverified; Dianne as designer and namer of both products IS registry-supported.

---

## 6. The places and the history

The deck's claim to being a story "based on people, places, history and community-led ideas" stands on this material.

### Timeline (compendium.ts, verified)

2018 Nic hears Dr Boe Remenyi speak about RHD prevention · Oct 2022 A Curious Tractor founded · Nov 2022 Goods kicks off (advisory: Alison Page, Corey Tutt, Nina Fitzgerald) · 2024 active bed pilots · Oct 2024 Kalgoorlie first trip AND Snow Foundation relationship begins · Nov to Dec 2024 Palm Island, Mount Isa · Jan 2025 Darwin · May 2025 Tennant Creek · Sept 2025 The Funding Network pitch raises $130K · Jan 2026 Centrecorp approves 107 beds; Nic builds 5 washing machines with the Bloomfield family in Alice Springs and Tennant Creek · Mar 2026 REAL Innovation Fund EOI via Oonchiumpa · May 2026 Utopia trip, 87 beds delivered.

### Place roles (each place earns one job in the story)

- **Kalgoorlie / Ninga Mia (Oct 2024): the method was set here.** "Two people show up in Kalgoorlie with prototypes and no pitch. The communities set the method before a single bed lands." Ben's field note: "Being able to shut up and listen for long enough to get insight." Gloria, Oct 2024: "I hope to make better mattresses" (a recipient describing herself as a future maker). Jocelyn Cameron named the expansion map herself: Laverton, Leonora, Menzies, Mt Margaret, Cosmo. Also the supply-failure photo evidence (dump sites, dumped mattresses). 20 beds.
- **Palm Island (Nov to Dec 2024): the diagnosis.** Ivy and Alfred Johnson gave the first community feedback that shaped the bed design. Freight and access evidence. 131 beds, 4 washers. PICC = scoping conversations only.
- **Mount Isa: the consultation method in Gary's words.** Gary's fire-and-dirt line (verified). 2 beds, testing.
- **Tennant Creek: the birthplace and the reversal.** Dianne Stokes received the first bed and came back within two weeks asking for twenty, offering to self-fund. Norman Frank called asking for three beds after his daughter tried one. Pakkimjalki Kari named here in Warumungu by Dianne. Deepest design history, largest deployment: 159 beds, 5 washers. Partners: Wilya Janta, Anyinginyi Health. Plant siting language: "a live possibility", never "the locked next site".
- **Alice Springs / Oonchiumpa: where making moved into community hands.** Two years designing in community with the Bloomfield family, washing machines built together. Karen Liddle (chair), Kristy Bloomfield (cultural consultation lead), Fred Campbell (youth case worker). Xavier led a build; his story published under Oonchiumpa's name. 16 beds (Alice Homelands).
- **Utopia Homelands / Ampilatwatja (May 2026): the handover made real.** The deck's linked field note (`/field-notes/utopia-may-2026`): young people built beds in Alice with Oonchiumpa, every young person who built one kept one, local teams led deliveries to the homelands, Fred and Decon "lent us their relationships". Mykel built seven beds and slept on the one he built. Frankie Holmes OAM and Donald Thompson OAM (Alyawarr brothers) received four beds; the kept clip is Frankie testing the canvas and nodding to his brother. 147 beds. Materials funded by Centrecorp. Utopia = 87 delivered on the May trip; 107 is the Centrecorp grant approval; two different facts, never conflated.
- **Maningrida:** Homeland Schools Company, 18 beds deployed, 65 more requested for kids. **Darwin / East Arnhem:** practitioner layer (Red Dust, Miwatj pathway), 1 bed, 1 washer. **NPY Lands:** 200 to 350 beds standing interest, the largest single demand signal, "always looking for beds" (Angela Lynch). **Groote Archipelago:** 500 mattresses and 300 washers exploratory via WHSAC, opportunity evidence only. **Katherine:** thinnest voice coverage (Heather Mundo, curated only).

### History gaps (know before you write)

Per-relationship start dates mostly live in the timeline above, not the community wiki articles. How Oonchiumpa first met Goods is not documented anywhere in the repo (closest: "two years designing products in community", so roughly 2024). The credit rule for every proof point is a three-beat chain: they said, it changed, it returned.

---

## 7. The numbers (import, never hardcode)

Source of truth: `v2/src/lib/data/canon.ts` (apex registry) + `asset-canonical.ts` + `products.ts` + `claims-ledger.ts` (the external gate: a figure renders externally only if backed by a green canon fact; `assertLedgerSafe()` throws at module load).

**External-safe:**
- 496 beds deployed (363 Basket + 133 Stretch) · 9 communities served (10 touched; public copy says 9) · 16 washing machines in community · 2,660kg HDPE diverted (133 Stretch × 20kg, Stretch-only, modelled: the 20kg is design-spec, not weighbridge-verified)
- Stretch Bed: $750 · 26kg · 200kg capacity · 188 × 92 × 25cm · no tools, ~5 minutes · 10+ year design life · X-trestle tension design (5-year warranty is canonical per CLAUDE.md but is NOT a products.ts spec field; if you cite it, source it to CLAUDE.md)
- Revenue: AU$713,827 accountant-signed Goods-only carve-out, the ONLY external revenue figure. Note its canon dataClass is amber, not green (money is never auto-published; the deck's ask chip carries it by standing instruction, hardcoded at deck.ts:350)
- Unit economics (engine-locked): marginal cost $685 buy-kit today, $426 factory, $421 community (community path is MODELLED, label it) · $194/bed saved by pressing in-house ("8.6x markup on the recycled-plastic leg. This is the whole capital case.") · break-even ~338 beds/yr on the factory path (~120 beds/yr made today) · fixed block ~$109,500/yr · $110,046 capex already in the plant ("the only clean skin-in-the-game figure")
- Per-community beds (compendium, sum-guarded to 496): Tennant Creek 159 · Utopia 147 · Palm Island 131 · Kalgoorlie 20 · Maningrida 18 · Alice Homelands 16 · Mt Isa 2 · Canberra 2 · Darwin 1

**Banned / retired figures (never reintroduce):** 9,920kg or 10,400kg plastic (a 3.7x overclaim) · $403,901 surplus or "230% self-reliance" · ~$907,569 · any consolidated revenue figure · $436,612 opex · old bed counts 493/412/389/495 · 7 or 8 communities · 28 washers as the public figure · $550/bed fabricated stage costs · 25kg per bed · "29 storytellers" · "500+ minutes" (retired by the impact framework; note products.ts still carries it, see §12) · $537,595 · margin at $750 is roughly 20% today, never 80% · Weave Bed anything.

**The impact model:** every impact claim = a community voice + a canon number + an honest label (verified / modelled / future). Three shifts headline (material, economic, story), five domains carry evidence (rest and health as the why · dignity and safety · self-determination and community-led design · jobs and ownership · circular economy). Jobs and ownership are always labelled future or target.

---

## 8. The money story and the ask

**The program:** QBE Catalysing Impact Stage 2, up to $400K from a $1M shared cohort pool ($150K floor). Two bars, never conflated: at scoring stage, soft evidence counts (EOI, LOI, term sheet all enhance eligibility); at disbursement, clause 6.9(a) requires legally binding matched funding documented BEFORE allocation. Repayable finance is prioritised in the external raise. Copy rule verbatim: "up to $400,000, at least matched by signed external capital, not secured until awarded". Application September, assessment October, outcomes November. Internal gate: 31 Aug all paper in.

**The stack:** SEFA $300K repayable anchor + Snow $100K + Centrecorp $75K = $475K target against the 400. Signed today: $0 of 13 register rows match-eligible. The commitment register is the QBE Stage 2 exhibit and it is empty: **the deck's job is conversion, not discovery.** Hedge bench: White Box SELF $250K, LendForGood $100K, Metro Finance $60K, Minderoo ~$200K ask made. SEFA's credit assessment (2 to 4 months) is the tightest clock.

**What the capital buys (ask slide, live):** the 50-bed in-source run (modelled to measured), the first place-based ownership pathway with Oonchiumpa, the enterprise-support layer, plant capex.

**Audiences in order:** 1. SEFA (needs debt-serviceable unit economics, the carve-out figure, QBE-contingent framing; no ownership gate). 2. Jay Boolkin / SIH (program administrator). 3. Snow (warmest, $493,130 lifetime paid; the ask is being reframed from grant to signed multi-year LOI or repayable first-mover paper; Snow's own figure stays qualitative in copy, Ben's rule). 4. Centrecorp ($123,332 paid and acquitted trust base; grant vs order split to settle). 5. Hedge bench. 6. QBE/SIH Steering Committee (15-min pitch + 45-min interview; they have flagged AI-sounding overclaim twice; the diagnostic verdict to answer is "strong proof, weak paperwork").

**Entity truth (background, not deck copy):** trades today as Nic sole trader (ABN 21 591 780 066); go-forward A Curious Tractor Pty Ltd ACN 697 347 676 t/a Goods. IBA, First Australians Capital and NAB/IBA gate on 50%+ First Nations ownership, which no Goods entity meets today: hence the ownership-gate-free September spine led by SEFA. DGR only via The Butterfly Movement. A known entity-name mismatch in the signed QBE agreement has not yet been raised with SIH (Ben item, not yours).

**Structural insight to keep:** QBE match is an OUTPUT of the stack, not an input. The deck is presented to match funders first to create the evidence, then to QBE with the evidence attached. The buyer pipeline ($9.0M demand board) is never presented as match capital.

---

## 9. What has already been tried (do not re-explore)

### Deck-form research already run (2026-07-10, 30-agent workflow)

Six concepts designed, scored by 18 adversarial judges, none killed, three converged on "the register" as the core move. Ranking: The Register, a deck that audits itself (8.0) · The Working Deck (7.67) · Bed No. 497, the deck you can hold (7.67) · The Deal Room (7.67) · The Register assembles like the bed (7.67) · The Same Road, Twice (7.5). **Decision made: Register composite** (Bed-No.-497 physical opener + freight-meter cost chapter + Deal Room close as grafts). Substrate already shipped: `claims-ledger.ts` and the public `/register` page. Full docs: `wiki/outputs/2026-07-10-deck-innovation-research.md` and `wiki/outputs/2026-07-10-deck-innovation-handoff.md`. Formats already evaluated, do not re-research: claims-as-versioned-data chips, live-diff decks, mailed HDPE QR kits, drag-your-cheque term-sheet builders, provenance-thread decks, scrollytelling freight meters.

**Two judge findings that still bite and are UNRESOLVED in the live deck:**
1. **The committee gap.** "My decision runs through an investment committee that consumes papers, not gated URLs." The deck has no strong second life after the meeting (the PDF leave-behind is stale vs the narrated deck).
2. **The presenter gap.** "The community is a subject, never a presenter. A deck about handing a factory to community, pitched entirely without them, is a credibility hole every diligent funder will notice." (Any fix is consent-shaped: Mykel's video in his own voice is the current best answer; think about whether the deck can go further within the gates.)

### Iterations superseded (the graveyard, with lessons)

Old DS pitch deck (deleted: stale ask, Weave Beds, health-outcome spine) · admin deck preview May 2026 · Pencil one-stop deck (MOVEMENT/MODEL/ASK, Pencil as canonical surface: superseded by deck.ts) · `/pitch/workshop`, `/pitch/investor-lab`, `/pitch/photo-review`, `/pitch/miro-board` (still routable, noindexed, not the deck) · Notion Story Spine "Sit down and ask us" (5 movements; superseded on structure, kept for voice bank and consent locks; it drifted from the signed foundation and Ben caught it angrily: recency is not authority) · `/pitch/control-room` (retired, permanent redirect to `/pitch/deck`) · Google Slides deck parked, Canva a dead end · maroon colour-request device (banned; the factual record of Norman's three-bed request stays) · generic three-way ask slide (rejected; routing is pre-meeting prep) · AI photo-real product imagery (rejected twice; real photos for anything photographable, single-weight terracotta line illustration only for what a camera cannot see; quantitative charts always computed in code, never drawn).

### The lesson pattern

Hand-authored content objects outside the canon system silently drift (a stale $120K ask and a hardcoded $500K were found live on /pitch while the deck said $400K). Anything you propose should read from canon sources, not restate them.

---

## 10. Notion content you cannot reach, inlined

Fetched live 2026-07-15. Six pages exist; here is everything deck-relevant.

- **Strategy deck page** (`39debcf981cf810da4b1f2180b1f62fa`): a pointer page, explicitly not a source of truth ("Change [repo] first, then mirror here"). Carries the 10-slide table, the full presenter script mirror, photo/video picks per slide, and the Kununurra gate text with two unchecked clearance checkboxes. Nothing on it contradicts deck.ts today.
- **The Goods Workbench** (`39debcf981cf8101bd57fba80c691906`, Ben+Nic front door): 30-second brief (core message, the numbers to say, the ask); pipeline snapshot 15 July: SEFA docs ready and window open · Snow INV-0321 authorised $132K, R4/R5 cover note pending · Centrecorp grant-vs-order split to settle · PICC 40-bed order authorised $36.3K · Anyinginyi 5 washers in, quoted 4 more · Rotary $82.5K overdue 405 days. Also Descript video links (Notion-only, made Feb 2026, figures need re-checking before send): 6 audience cuts + Jaquilane + Stretch Bed timelapse + Fred and Xavier; two Google Photos raw pools.
- **Artifact Hub** (`378ebcf981cf8192a5e5c66b93630725`): the internal control tower. NOTE: its §0 one-liner is the OLDER June line ("The making belongs on Country...") and its ask framing ("recoverable grant that converts into community ownership") predates the 15 July message. A known Notion-side staleness, not a repo problem; flag, don't inherit.
- **Story Spine** (`fe111940fbfe4e24b38b5b14d96e4c31`): superseded banner on structure; still valuable for its voice bank (30 people, 65 quotes with tier notes), photo checklist, and the storyteller verification audit (Ray Nelson flag, Linda vs Norman attribution, Chloe's unsourced second quote). Notion-only assets it records: ~48 Little Rippers price-tag HEICs (confirms "$1,500 double bed base + mattress" from Stephanie at Little Rippers, Tennant Creek May 2025) and ~38 uncurated Dianne washing-machine HEICs, both only in a Notion visit-log page. Also the 16 illustration diagram prompts + style block (drafts exist gitignored; three flagged for bed-anatomy re-check).
- **Start Here** (`381ebcf981cf813bbbcef58c727fcc20`): the one-screen funder front door; matches the deck's message and numbers; sign-off "the next step is a conversation, not a form".
- **QBE operating plan** (`380ebcf981cf819cac62f51dd9532e84`): program mechanics ($150K floor, Stage 1 $10K flat, IP clause 7.3: SIH owns the tailored-advisory cost model IP with ACT licensed; clause 5.3: SIH 3-year co-invest right), runway gates (18 Jul warm money to paper · end Jul entity gate · 15 Aug first paper · 31 Aug match assembled), hackathon options (recommended: "The first night with a new bed"), warmest-first funder tiers.

---

## 11. The visual inventory (repo-resident, all committed paths)

283 images under `v2/public/images/` by area: `community/<place>/` 51 (kalgoorlie 11 incl. the dump/supply-failure set · palm-island 12, Basket era, delivery-day joy · alice-springs 7 incl. oonchiumpa-team-red-bed and stretch-bed-two-generations · darwin 1 · unplaced 18 incl. a complete 12-frame kids-build-a-bed essay, place unconfirmed) · `process/` 44 (the plant) · `people/` 28 portraits (consent-gated by the indexer) · `partners/` 41 · `utopia/` 16 · `media-pack/` 15 · `product/` 16 · `stories/utopia/` 12 · `build/` 16 (children's faces, deck use only) · `pitch/` 8 · `brand/` 13 line illustrations · `_drafts/story-spine/` 17 illustration drafts.

Video under `v2/public/video/`: mykel-building-the-bed.mp4 89s (cleared) · karen-liddle-on-beds.mp4 40s (cleared) · jaquilane-testimony.mp4 72s (sound on, never a background) · recycling-plant loop 34s · utopia-delivery-road.mp4 12s (hinge loop) · centrecorp Utopia clips (consent unverified) · assembly.mp4 4:52 (needs a 20 to 30s recut; a 27s loop is committed but unwired).

**Known visual gaps (real constraints on your proposals):** no real transfer/handover photo for Turn 5 (Bloomfield-family-at-the-plant is the strongest missing asset) · no photo of a family using Pakkimjalki Kari and no product-two footage at all ("the two-product loop is video-blind on product two") · place-attributed public media still zero for Tennant Creek (beyond 1 image), Maningrida, Mount Isa, Canberra · no footage for Kalgoorlie, Tennant Creek, Palm Island, Darwin · the "two price tags" diagram draft awaits Ben approval · ask-slide charts live only in gitignored staging · the one warm human hero shot (`community-testing-bed-golden-hour.jpg`) is blocked by consent, not quality. EL holds 456 assets (Utopia 172 public, Tennant Creek 64 public) but EL media needs its own consent path and is deliberately excluded from the picker; do not propose EL pulls.

Starred/tag state lives in Supabase `content_items`, not the repo; `v2/data/local-image-tags.json` is not the index. The picker API (`/api/admin/media-pick`) serves local committed media only, starred first.

---

## 12. Companion surfaces and the contradiction watch-list

`/pitch` and `/pitch/document` render a shared plain-language case from `content.ts` (`investmentCase`, `plainCase`, `problemPains`). Gated funder pages (`funder-pages.ts`: Minderoo, Paul Ramsay, Tim Fairfax) and the grant library (`grant-content.ts`) carry what has already been said to funders.

**Real contradictions found today (reconcile or hand to Ben as checkpoints):**
1. Ask frames: deck and /pitch say $400K; the funding lines beneath sum to $475K under a "$400,000" headline; funder pages pitch a ~$3M blended target with Minderoo options of $840K to $1.5M. One coherent frame is needed (the $475K stack vs $400K match is explainable; the $3M number needs an explicit relationship to the $400K story).
2. Plant capacity: ~30 beds/week (content.ts) vs ~20 beds/week (grant-content.ts) vs "1,500+ beds a year" (Minderoo page).
3. Plant capex: $110,046 (canonical) vs "~$100K invested" (products.ts and grant-content.ts).
4. products.ts still says "Designed with 500+ minutes of community feedback"; the impact framework retires "500+ minutes" on sight.
5. grant-content.ts problemStatement carries unattributed epidemiology and program stats ("60% reduction", "$6 saved per $1", "1 in 3 children") that sit close to the claim ceiling; the deck must not inherit them without attribution review.
6. Palm Island beds: 131 (canonical compendium) vs 141 (wiki overview.md). Maningrida: 18 (canonical) vs 24 (wiki article). Wiki community pages also carry stale snapshot numbers by their own admission.
7. grant-content.ts "$600 to 850 funds one Stretch Bed" vs the $750 price.
8. compendium's per-community washer rows sum to 10 vs the curated public 16.
9. /pitch/document is dated "Updated 8 July 2026", pre-alignment; and /pitch hero still links to the superseded workshop/investor-lab/photo-review surfaces.
10. The theory-of-change graphic renders a five-step cycle that is missing the fifth stage of the model (Transfer and support): the rendered cycle is Listen, Design, Make, Deliver, Learn/Improve. `design/goods-theory-of-change-v2.pen` is another session's uncommitted WIP, do not clobber; flag the copy fix.

**Lines already working (harvest, don't reinvent):** "This is not a concept deck. Beds are already in homes." · "The strongest signal is not a survey. It is people who used the bed, then asked for more." · "The competition is the broken default." · "We've shipped the beds. The proof is in the houses." · "A good bed is health hardware, not furniture." · "Our job is to become unnecessary." · "The product exists. The demand is named. The plant pathway is real."

---

## 13. Where the thinking is needed (the ultra questions)

Ranked by expected value:

1. **The one-read test.** Write the deck's argument as ten single sentences (one per slide). Where two slides share a job, propose the merge. Where a slide's job is not load-bearing for the SEFA or QBE room, propose the cut. Ben wants no guff: the current deck is honest but it is also dense; find what density is doing work and what is armour.
2. **People over abstractions.** Turn 2 (supply failure) and Turn 5 (the plant as operating system) are the least human slides. Within the gates, can a person carry them? (Alfred Johnson already leads Turn 2's script; the slide body is still system language. Turn 5 has Norman Frank as lead but the body is a list of nouns.) Propose registry-verbatim-safe rewrites.
3. **The hinge placement.** The truck test currently sits between Turn 4 and Turn 5 as slide 7 of 10, so the emotional peak (Mykel) is followed by an audit beat before the plant argument. Test alternatives on paper (hinge as opener? hinge fused with the ask?) while respecting "used once".
4. **The committee artifact.** The deck's second life is the weakest confirmed finding. Propose the shape of the forwardable paper (regenerated PDF? the /register printed? a two-pager?) that survives an investment committee without Ben in the room, with claims-status labels intact.
5. **The presenter gap.** The deck is narrated by Ben. Mykel's video is the one moment community presents itself. Within consent gates, what would move the deck from "about community" toward "with community"? (Paper-only thinking allowed; consent items become named checkpoints, not proposals to use uncleared material.)
6. **History as spine.** The place arcs in §6 (Kalgoorlie set the method, Palm Island the diagnosis, Tennant Creek the authorship and reversal, Alice/Utopia the handover) are currently distributed across slides as texture. Test whether making the chronology explicit strengthens or bloats the 10 slides.
7. **Surface reconciliation.** Produce the fix list for §12 items 1 to 10 with file-level targets, each item either a proposed edit (safe, canon-sourced) or a named Ben checkpoint.
8. **The ask's honesty as strength.** "Signed today: $0" is currently quiet. The radical-honesty research suggests the empty commitment register could be presented as the instrument itself ("come back on 30 September and diff this deck"). Decide whether the ask slide should own the zero louder, and draft it.

Constraints on all of it: the 6-turn foundation governs structure (changing turn ORDER or the model definition is a Ben decision, not yours to make unilaterally; propose with rationale). Registry verbatim for anything in quote marks. Every figure carries its status label. No new numbers.

---

## 14. Deliverables and definition of done

Write to `wiki/outputs/2026-07-16-codex-deck-ultra/` (create the dir):

1. `01-message-architecture.md`: the ten-sentence argument, sag/cut/merge analysis, and your recommended slide set with rationale per change.
2. `02-slide-rewrites.md`: for each changed slide, deck.ts-ready copy (headline, body, script, voices, chips with claims-status labels, media from §11 committed paths only), plus the current version quoted for diffing.
3. `03-surface-reconciliation.md`: the §12 fix list, file-level, each item marked SAFE-EDIT or BEN-GATE.
4. `04-committee-artifact.md`: the forwardable-paper proposal.
5. `05-checkpoints-for-ben.md`: every Ben-gated item your work touches (§15 plus any you discover), one line each: the decision, the options, your recommendation.

Code edits are optional and only for SAFE-EDIT items; local branch off origin/main, build green, guards green, no pushes.

**Done means:** every proposal maps to file-level changes with an owner (Codex vs Ben) · every gate in §4 is respected in the deliverable text itself (including zero em dashes and no banned words in YOUR prose) · no proposal can emit an uncleared voice, a co-design, an ownership-complete claim, a health outcome, a non-canon number, or any revenue figure other than $713,827 · nothing re-researches §9's settled ground · and a cold reader could hand `02-slide-rewrites.md` to Claude to commit without opening another document.

---

## 15. Ben-gated checkpoints (named, never silently resolved)

1. Kununurra Elder clearance (words, scene, audience, use + registry record): unlocks Variant A and 3 held photos. Until then: nothing.
2. Promoting Gary's verified fire-and-dirt line from narration to an on-screen registry quote.
3. "Two price tags" illustration approval (draft exists, arrow question open).
4. Mykel registry wording: transcript "would've" vs stored "would have".
5. Recording Patricia Frank (and Fred Campbell, Kristy Bloomfield); Ana-Bega registry entry.
6. Which Ivy · Linda vs Norman "my father was of this country" attribution · Mark's tier · Ampilatwatja OAM Elders full-name crediting · Warumungu spelling confirmations.
7. Turn ORDER / model-definition changes (the foundation is Ben-signed).
8. PDF leave-behind regeneration for narrated-deck parity.
9. The $3M-vs-$400K frame on funder pages; Minderoo/Paul Ramsay/Tim Fairfax page refresh.
10. Entity-name mismatch with SIH (flagged, not raised; absolutely not yours to action).
11. Jessica Allardyce consent elevation; jaquilane-testimony final clearance state; centrecorp Utopia clips consent verification.
12. On-Country hyphen style sweep (prefer no-hyphen, unconfirmed).

---

## Source map (fast orientation)

| What | Where |
|---|---|
| Deck content (words, voices, media, scripts, notes) | `v2/src/lib/data/deck.ts` |
| Public deck page | `v2/src/app/pitch/deck/deck-public.tsx` |
| Builder | `v2/src/app/admin/deck-builder/deck-builder-client.tsx` |
| Voice registry (ground truth) | `v2/src/lib/data/storyteller-registry.ts` |
| Transcript provenance | `v2/src/lib/data/transcript-provenance.ts` |
| Cleared voices gate | `v2/src/lib/data/cleared-voices.ts` |
| Canon numbers | `v2/src/lib/data/canon.ts`, `asset-canonical.ts`, `claims-ledger.ts` |
| Product truth | `v2/src/lib/data/products.ts` |
| Impact model | `v2/src/lib/data/impact-model.ts` |
| Deployments, timeline, demand | `v2/src/lib/data/compendium.ts` |
| Utopia field note (full narrative) | `v2/src/lib/data/trip-stories.ts` |
| Companion case | `v2/src/lib/data/content.ts` (investmentCase), `v2/src/app/pitch/page.tsx`, `v2/src/app/pitch/document/page.tsx` |
| Funder-facing history | `v2/src/lib/data/funder-pages.ts`, `funder-shared-content.ts`, `grant-content.ts` |
| The signed spec | `wiki/outputs/2026-07-15-strategy-deck-core-messaging.md` |
| The signed foundation | `wiki/outputs/2026-07-11-narrative-foundation.md` |
| Story-first draft export | `wiki/outputs/2026-07-14-goods-pitch-narrative-current.md` |
| Impact framework | `wiki/outputs/2026-06-18-goods-impact-framework.md` |
| Deck-form research (settled) | `wiki/outputs/2026-07-10-deck-innovation-research.md`, `wiki/outputs/2026-07-10-deck-innovation-handoff.md` |
| Prior Codex handoff template | `wiki/outputs/2026-07-11-codex-ultraplan-handoff.md` |
| Photo sweep + media state | `wiki/outputs/2026-07-15-photo-sweep.md` |
| Community articles | `wiki/articles/communities/*.md` (status snapshots; numbers may lag canon) |
| Money sign-off state | `wiki/canon/needs-signoff.md` |
