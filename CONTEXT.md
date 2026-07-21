# Goods on Country — Domain Context

> **VOICE RULE (Ben, 2026-07-21, standing):** no formal/static grant language anywhere. Write like `Jeremy_Donovan_The_Fire_and_the_Road.docx` and `ACT_The_Field_Between_Us.docx` (both in ~/Downloads): open with a person/place/object, never a claim; numbers arrive inside sentences that carry a scene; plain verbs; self-implicating honesty; with-not-for. Tables can be tables; the prose around them must talk like a person. Memory: [[goods-grounded-voice-references]].

> Canonical language for the money model and the raise. Started 2026-07-21 during the money-alignment grill.
> Code sources of truth: `v2/src/lib/data/cost-story.ts` (cost narrative), `canon.ts` (canon facts), `ask-surface.ts` (/admin/ask).

## Glossary

**The bed (per-unit money)** — everything that scales with one more bed: materials $469.79, freight ~$150, assembly $55.95. Never mix with per-year money.

**The block (per-year money)** — ~$109,500/yr to run Goods before any bed is made (facility $27K, founder production days $16.8K, admin $14.7K, field travel $51K). Never divide the block by beds made and call it "cost per bed" (that produces the misleading ~$1,780).

**Stays per bed** — sell price $750 minus the bed's marginal cost. Today (buy-kit path): ~$65. In-house (pressed path): ~$324. The single most important derived number; break-even = the block ÷ stays.

**Buy-kit path** — making a bed with legs bought finished from Defy at $344.05. Marginal cost $685. The cost model's "today" default.

**Pressed path** — making a bed with legs pressed at our own facility (~$50 of plastic + our pressing). Marginal cost ~$426, Modelled: capability proven, cost at production rate not yet measured.

**The pressed run (resolved 2026-07-21)** — the Maningrida Stretch run: **40 Stretch Beds, invoice INV-0303 (Xero-verified 2026-07-13)**, legs pressed at our facility at the farm, assembled in community. Supersedes the earlier "0 beds pressed in-house" note (stale Area 11 key point). NOT 58: the register's Maningrida total of 58 includes 18 Basket Beds, which have no pressed legs. Ben ruling + invoice.

**The measured run** — the funded 50-bed run whose purpose is to press at production rate and measure per-bed cost with receipts. It converts $426 from Modelled toward Measured. (Renamed from "proof run" — capability is already proven by the pressed run.)

**The ask** — the SUM of use-of-funds blocks (equipment net + measured run + ramp cover + working capital + reserve), never a slogan number. QBE's up-to-$400K is the **match vehicle** (doubles signed external dollars), not the ask.

**The opening line (locked 2026-07-21, Ben — his pick from the drawn cards)** — the money story opens everywhere with: *"The goal was never a bigger Goods. It is a plant that belongs to the people sleeping on the beds."* Then the mechanism ($65 → $324, 338) follows as the second beat. Never open with a dollar figure.

**Brand naming direction (Ben, 2026-07-21)** — the master brand is **"Goods."** (the wordmark with the full stop); "Goods on Country" is the charity-arm name. Ben dislikes the current Goods-on-Country logo treatment; a rebuild is on the table. Cropped wordmarks now at `design/deck-photos/logo-goods-{white,black}.png` (cut from the full lockup). NOTE this is BRAND naming, not legal structure: the charity entity remains The Butterfly Movement Ltd; the company remains A Curious Tractor Pty Ltd t/a Goods. Reconcile brand names with the entity doors before external print.

**The deck's centre (Ben, 2026-07-21, emphatic)** — the ENTIRE deck story centres on the handover line. Every beat leans toward it: the plant that belongs to the people sleeping on the beds. Beats reorder to serve that arc; the money frames (08/09/11 drawn) are the middle, the handover is both opener and destination.

**The 338 defence (locked 2026-07-21, Ben)** — when challenged that self-funding rests on the unmeasured $426: own it as the point. *"$426 is modelled from verified part prices; the first thing your money buys is the measured run that proves it."* Never soften "funds itself"; never claim $426 is measured before the run.

**The raise answer (locked 2026-07-21, Ben)** — when asked "how much are you raising?": *"$400K in signed commitments by 31 August; QBE matches it dollar for dollar — an $800K program that takes Goods to the point it funds itself."* Above $400K the match stops (extra brings the first on-Country site forward; absorbable ceiling ~$550K). Floor: $150K matched. The $475K stack is the internal who-signs-it plan with headroom over the $400K. Source: `ask-surface.ts` `ASK_HEADLINE`.

**The stack** — the target set of signable external commitments that unlock the QBE match: SEFA $300K repayable + Snow $100K grant + Centrecorp $75K grant = $475K. Status is always stated ($0 signed as of 2026-07-21).

**The three doors (entity)** — Donate → The Butterfly Movement Ltd (DGR pathway) · Buy/Order → A Curious Tractor Pty Ltd t/a Goods · Invest (repayable) → ACT Pty Ltd. Equity is not sold; gifts never fund the company.

**Donate door (resolved 2026-07-21, Ben)** — The Butterfly Movement can ALREADY receipt tax-deductible gifts under an interim arrangement; full endorsement FY2026-27. ⚠ Before printing "tax-deductible today" on public/donor-facing surfaces, confirm the receipting mechanics with the Butterfly side (a wrong deductibility claim is an ATO problem, not a copy problem).

**Inter-entity agreement (status 2026-07-21)** — Butterfly ↔ ACT relationship documentation is aligned; completion meeting 2026-07-22; not yet signed. Until signed, all surfaces say "being formalised, completion in progress", never "documents" (present tense). Ben.

**Field travel $51K (resolved 2026-07-21, Ben)** — mostly fixed relationship/being-in-community time, independent of bed volume; stays in the block. Delivery freight is separately in the ~$150/bed line. Do not double-count travel into per-bed cost.

**Facility demand queue (Ben, 2026-07-21; in communities.facility_interest)** — communities that want the production facility: Palm Island (council + community + PICC) · Alice Springs (Oonchiumpa, close to starting their own with DEWR, part of their youth support program) · Utopia (wants the shredder, engage young people) · Tennant Creek (The Community Shed, plastic recycling for social enterprise) · "among many more". Status = interest, NOT signed agreements; claim as demand signal only.

**The handover number (locked 2026-07-21, Ben; Modelled)** — a community-owned site stands on its own at roughly 75-100 beds a year: site bill ~$24K/yr ÷ ~$329/bed contribution (community path, fair wages at $130/bed already inside) ≈ 73. Always "roughly", always labelled Modelled, until validated. This makes the handover concrete: communities already order at this scale.

**Honesty labels (Solidity)** — verified (invoice/signed doc) · workpaper (our math, checkable) · modelled (built from verified inputs, not demonstrated) · target (future state) · conflict (two figures coexist) · retired (do not use). Defined in `cost-story.ts:17`.

**Kit vs pressed split (resolved 2026-07-21)** — of 177 deployed Stretch Beds, only Maningrida's 40 were farm-pressed; the other ~137 used Defy kits. So "buy-kit = today's default method" is honest, and Maningrida is the proof story. Ben ruling.

**Dianne Stokes consent (Ben ruling 2026-07-21)** — Dianne has consent for all her material; she is a major supporter and adviser. The beat-12 consent gate and D8-blessing hold are LIFTED. (Registry statuses may still carry old holds; treat this ruling as overriding for deck use.)

**Maningrida trip photos consent (Ben ruling 2026-07-21)** — the 10 Maningrida/Gamardi trip photos (`design/starred-images/community--maningrida--*.jpg`, originals at `design/deck-photos/maningrida-trip/`) are **consent obtained and evidenced**. Ben confirmed it is sorted and proved; the earlier "consent not recorded" flag on those rows is LIFTED and every `_manifest.csv` row now carries the ruling. Cleared for external use including the children, the Elder and the identifiable faces. ⚠ The evidence itself is not yet pointed at from the repo: when Ben names where it lives (registry entry, EL consent record, or signed form), add the reference to the manifest rows so a future session can verify rather than trust.

**Georgina misfiling (fixed 2026-07-21)** — two quotes filed under Georgina Byron belonged to Kylie Bloomfield ("my mum gets the phone call…") and Katherine of the Deadly Heart Trek ("family jump on that bed…"); moved to their own registry entries (tier=hold, Ben to call external use). A third Georgina quote ("We've waited so long for this house…") put on hold pending speaker confirmation.

**Brian M. Davis Foundation (prospect, 2026-07-21, from Nic's BMDxGood.pdf)** — children/young-people foundation, strategy axes Good Design / Authentic Giving / Bigger Picture, priority #1 youth employment: the strongest single-funder fit on paper. No amount named yet. Match-eligible if signed by 31 Aug. New assets from the doc: bed-as-wages story (Alice young people chose a bed as payment) · $91/day vs $3,852/day detention benchmark (DO NOT use externally until derivation traced) · NIAA ~$15K/young-person brokerage · charity-membership model (Aboriginal-owned enterprises become MEMBERS of the Goods on Country charity). Capture: `wiki/investor/18-bmd-partnership.md`. Trip photos: `design/deck-photos/maningrida-trip/` (10, incl. the hand-sprayed GOODS. wall + kids carrying the orange bed).

**REAL Innovation Fund (LOCKED, Ben 2026-07-21)** — status = **APPLIED at ~$2 million over 3 years** (with Oonchiumpa, Alice Springs production facility, 16-20 near-full-time young people). NOT secured; the word "secured" comes out of any doc that carries it. Supersedes both the old "$2.4M across two sites" framing and the BMD doc's "$1.73M secured". Excluded from QBE match (separate vehicle); belongs in the story as the youth-employment engine.

**QBE submission date (LOCKED, Ben 2026-07-21)** — submission due **14 September 2026**. Supersedes "late September". Match paper still 31 August; outcomes November.

**Detention benchmark (verified 2026-07-21)** — youth detention costs ~$1.3M per child per year, more than $3,600 a day (Productivity Commission Report on Government Services, early 2026; NT detains 95% First Nations children). Goods/REAL pathway side ≈ $100/day at the locked $2M/3yr/16-20 young people. External wording: "about $100 a day, next to more than $3,600 a day for detention". Never print $91 or $3,852 without their exact source lines.

**Numbers ruling (Ben 2026-07-21)** — our canon figures stand (540/177/363/20/11/3,540, Utopia 147, requests-not-orders). Nic's BMD doc gets corrected TO canon before it travels again, not the other way.

## Open questions (grill queue)
1. Working-capital block size (120→338 ramp) — the $426 sense-check session.
3. Maningrida washers: register carries 8; `10-community-counts.md:53` says "INV-0303 + Ben ruling = 2 FINAL" but the later ruling says 8 = 6 existing + 2 new. Wiki line 53 looks stale — confirm and fix.
