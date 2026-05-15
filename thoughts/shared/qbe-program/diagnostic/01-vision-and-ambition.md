# 1. Clarity of Vision and Ambition

> Goods on Country is not trying to be a charity that distributes beds. It is building a different product system for remote communities: essential household goods that people actually want, can wash, can repair, can track, and can ultimately make and own on Country. The ambition is big, but it is grounded in specific proof: hundreds of tracked assets, named community voices, a working Stretch Bed product, a Pakkimjalki Kari washing-machine prototype, a two-container production facility, and live demand from communities, schools, health partners and funders.

## The Human Version

Goods started from a simple but uncomfortable observation: in remote Australia, the household goods people depend on for health and dignity are often the worst-designed things in the house.

Beds are hard to get, expensive to freight, hard to wash, and often break or become unusable. Washing machines fail under conditions they were never built for. Mattresses and white goods then end up in community dumps, where recycling is often not realistic. The result is not only waste. It is kids sleeping on floors, families unable to wash bedding, skin infections spreading, and preventable illness becoming normal.

The line that keeps the work honest is still the one in the public brand copy:

> "A good bed can prevent heart disease."

That line is not a marketing flourish. It points to the health pathway Goods keeps returning to: dirty bedding can contribute to scabies, scabies can lead to skin infections, skin infections can lead to rheumatic fever, and rheumatic fever can become rheumatic heart disease. The washing machine matters for the same reason. Clean bedding is not convenience. It is health hardware.

Goods on Country is the response: beds, washing machines and future fridge work designed with remote Indigenous communities, made from better materials, built for the actual conditions, and moving toward community-owned production.

## The Ambition In One Sentence

Make Goods beds, washers and future essential goods as normal in remote communities as a troop carrier: practical, trusted, repairable, wanted, and owned closer to the people who use them.

The longer version is more specific:

- Products are co-designed with communities, not dropped in from a city office.
- The Stretch Bed is a real product now, not only a prototype.
- Pakkimjalki Kari is still a prototype, but the direction is clear: a repairable washing machine for remote conditions, named in Warumungu language by Elder Dianne Stokes.
- The production system is not a metaphor. There is a two-container plastic re-production facility with a shredder, heat press, cooling press, CNC router, generator, jigs, safety procedures and operating notes.
- The long-term model is not to keep ACT at the centre forever. The stated philosophy is: "Our job is to become unnecessary."

## What Is Already Real

### Stretch Bed Product Proof

The canonical product is the Stretch Bed. The source of truth is `v2/src/lib/data/products.ts`.

Current verified product facts:

| Feature | Current claim |
|---|---|
| Product | The Stretch Bed |
| Status | Available |
| Materials | Recycled HDPE plastic legs, galvanised steel poles, heavy-duty Australian canvas |
| Weight | 26kg |
| Load capacity | 200kg |
| Dimensions | 188 x 92 x 25cm |
| Assembly | About 5 minutes, no tools |
| Design life | 10+ years |
| Warranty | 5 years |
| Plastic diverted | 20kg HDPE per bed in canonical product data |

The product is deliberately simple: two galvanised steel poles thread through canvas sleeves, and recycled plastic legs slot onto the poles. The point is not novelty for its own sake. The point is a bed that can be moved, washed, repaired, flat-packed and carried into places where standard beds and mattresses do not last.

### Washing Machine Product Proof

Pakkimjalki Kari is not yet a product for direct sale. It is a field prototype and should be described that way.

Current verified product facts:

| Feature | Current claim |
|---|---|
| Product | Pakkimjalki Kari |
| Status | Prototype |
| Base | Commercial-grade Speed Queen |
| Community language | Named in Warumungu language by Elder Dianne Stokes |
| Design direction | Repairable, durable, simplified controls, remote-condition housing |
| Commercial status | Register interest only, not direct sale |

The strongest way to describe the washing machine is Nicholas's analogy from the founder conversation: the team has taken a strong base machine and added the equivalent of bull bars and bash plates. That means the current prototype is expensive and not yet ready for resident ownership at scale. It also means the product problem is clear: keep the durability, reduce the price, and make repairs possible closer to community.

### On-Country Production Proof

The On-Country production system is not just a future claim. The repo contains a full operations guide at `v2/docs/PRODUCTION_FACILITY_GUIDE.md`, and Notion has a matching On Country Production HQ page with the same operating knowledge.

Current verified production facts:

| Area | Evidence |
|---|---|
| Facility | Two shipping containers plus diesel generator |
| Shredding | Zerma granulator in a 20ft container |
| Production | 40ft container with prep table, heat press, cooling press, CNC router, edge router and dust extraction |
| Process | Collect, sort, shred, weigh, fill tray, heat, press, cool, cut, edge, assemble |
| Plastic | HDPE and PP only. PVC is explicitly excluded for safety |
| Heat | 180C process temperature in the production guide |
| Pressure | 5,000 PSI target during pressing |
| Tracking | Shift logs, batch logs, photos, quality notes and handover notes |
| Status in guide | 9 sheets completed at the time of the February 2026 guide |

This matters because the ambition is not only "sell more beds". It is "local people collecting waste, pressing sheets, cutting parts, assembling beds, maintaining records, and eventually running the business."

There is one production detail that needs human review before being repeated externally: `v2/docs/PRODUCTION_FACILITY_GUIDE.md` says each sheet produces one bed, while the Notion StretchBed HQ page says "2 sheets per bed" and "3 beds per day." That difference should be reconciled by Nicholas, Defy Design or whoever owns the production bill of materials.

### Asset Register And QR Proof

Goods already has infrastructure for treating products as trackable assets rather than anonymous donated items.

Evidence in the repo:

- `data/qr_codes/png/` and `data/qr_codes/svg/` hold large batches of generated QR codes.
- `data/new_beds/` includes individual bed records, photos and QR codes for batch items such as `GB0-153-*`.
- `data/washing_machines/` includes stickers and QR codes for washing-machine assets such as `GB0-154-*`.
- `v2/docs/COMPENDIUM_MARCH_2026.md` records 389 tracked assets across 8+ communities.

This is a strategic point. The register is not only a back-office convenience. It is part of the investment story: every product can become a service record, repair record, location record, consented story record and evidence point for funders or community partners.

## The Community Evidence

The strongest material is not the strategy language. It is what people have said after seeing, using or helping shape the products.

### Palm Island

Ivy explains the need plainly:

> "Hardly anyone around the community has beds."

After receiving a bed, her feedback was practical:

> "It was easy to make. Yeah, it's nice."

Alfred Johnson gives the freight and access reality:

> "You can't just go down to the store and buy beds. It's a big muck-around."

He also gives the dignity point:

> "Having a bed is something you need; you feel more safe when you sleep in a bed."

Palm Island is not an abstract market. The repo records it as the largest deployment community in the March 2026 compendium, with 141 beds referenced there, and PICC appears as a live relationship in both the compendium and the grants archive.

### Tennant Creek

Dianne Stokes is central because she is not only a recipient. She is a co-designer and cultural authority in the work.

The current knowledge base records that Dianne:

- Named the washing machine Pakkimjalki Kari in Warumungu language.
- Helped refine designs around the fire with family.
- Received one bed and returned within two weeks requesting 20 more, offering to self-fund.

Dianne's line about "working both ways" is important because it describes more than a product consultation. It points to the governance and design question that Goods has to keep answering: how does the work move between white systems and Indigenous systems without losing community authority?

Norman Frank's contribution matters for the same reason. His recorded words are about the future, not only the bed:

> "I want to see a better future for our kids and better housing for our people."

### Alice Springs And Oonchiumpa

Oonchiumpa is a key relationship because it connects product design, youth pathways, Central Australian manufacturing and cultural consultation.

Fred Campbell's feedback makes the bed practical:

- Families were sleeping on the ground.
- Being off the ground matters for safety.
- The product needs to move with people, including during sorry business and family movement.
- A young person helping build beds showed pride and energy through the task.

Jacqueline's feedback connects the circular economy to the buyer reality:

> "From the waste, plastic. Perfect."

She also says the shop option is expensive and easy to break, while the recycled plastic bed looks like it will stand and not break. That is exactly the commercial gap Goods is trying to fill.

### Health Partners

The washing-machine case is clearest through Miwatj Health. Jessica Allardyce's recorded feedback is that essential goods are expensive to get out by barge, scabies is present, and washing machines are essential because clothing, bedding and towels need to be cleaned.

This is the bridge between a product story and a health story. Beds and washers are not side projects to health. They are one of the ways a home becomes able to support health.

## Demand Evidence And How To Read It

The pack should separate confirmed, requested, pipeline and aspirational demand. Mixing those categories makes the work sound inflated. Keeping them separate makes the work stronger.

### Deployment And Demand Snapshot

| Evidence type | What we can say | Source |
|---|---|---|
| Tracked assets | 389 assets tracked across 8+ communities in the March 2026 compendium | `v2/docs/COMPENDIUM_MARCH_2026.md` |
| Centre Corp / Utopia | 107 beds approved in structured data, linked to Utopia Homelands pathway | `v2/src/lib/data/compendium.ts` |
| Named requests | Dianne Stokes 20 beds, Norman Frank 3 beds, Homeland Schools Company 65 beds, Utopia beds for children, PICC 40 beds discussed | `v2/src/lib/data/compendium.ts` |
| Large exploratory request | Groote Archipelago request for 500 mattresses and 300 washing machines | `v2/src/lib/data/compendium.ts` |
| Funding journey | About $460K confirmed received across six funders, with a larger active pipeline | `wiki/raw/grants-archive/FUNDING-JOURNEY.md` |
| Notion opportunity board | $16,566,450 across 103 open opportunities | Goods HQ Notion page, internal opportunity data |

The Notion opportunity board is useful, but it should not be described as revenue. It is internal pipeline intelligence. It shows breadth of possible demand and relationship work, not signed contracts.

### What The Demand Is Telling Us

The pattern is consistent: people ask after they see the product, try the product, or know someone who has. That is a strong signal that awareness and supply are the constraints. It is not yet proof that direct resident purchase will carry the business. It does suggest that if the product is available, visible and locally supported, demand can grow quickly.

## The Ambition In Three Horizons

### Horizon 1: Make The Proof Legible

The immediate job is to make the real work easy to see:

- Put the Stretch Bed, washing-machine prototype, production facility, asset register and community voices into one proof-first pack.
- Stop relying on hidden links or inaccessible source trails.
- Make every claim carry its evidence type: product spec, asset record, quote, photo, video, Notion record, grant trail or founder transcript.
- Use human language from the field, not abstract program language.

### Horizon 2: Move From Funded Batches To Product Operations

Goods is still between program and product. A lot of current delivery happens when funding or an order lands, then a batch is built and deployed. The next maturity step is more operational:

- more reliable inventory,
- clearer wholesale and institutional pathways,
- better local delivery and servicing,
- product support through the QR register,
- production runs that do not rely on Ben and Nicholas being physically present for every step.

This is where the QBE work matters: not to invent a bigger dream, but to make the existing dream operational enough that others can back it.

### Horizon 3: Transfer Capability

The long-term vision is local plants and local ownership. The strongest version is not a franchise play where ACT stays in control forever. The strongest version is transfer:

- community partners collect and sort plastic,
- local teams shred and press sheets,
- local teams assemble and deliver beds,
- local organisations hold revenue and employment,
- ACT provides R&D, quality systems, funding support, design work, training and shared back office only where it is useful.

The exact legal model is not settled. The direction is.

## What Makes The Ambition Credible

1. **The product exists.** The Stretch Bed has canonical specs, photos, ecommerce status and field feedback.
2. **The problem is specific.** Beds, mattresses and washers are expensive, hard to repair, hard to freight and often wrong for the conditions.
3. **The voices are named.** Ivy, Alfred, Dianne, Norman, Fred, Jacqueline, Patricia, Jessica, Tracy, Chloe and others are not generic "beneficiary stories".
4. **The production system exists in detail.** There is an operations guide, equipment list, safety procedure, shift log template and image set.
5. **The relationships are real.** Oonchiumpa, Wilya Janta, PICC, Anyinginyi Health, Miwatj Health, Homeland Schools Company, Snow Foundation, FRRR/VFFF, TFN and others appear across docs and grant trails.
6. **The team knows the danger.** The internal notes explicitly flag overclaiming, placeholder figures, unresolved legal structure and count inconsistencies.

## Proof And Media Board

Use these assets when turning this topic into the human-reviewed Notion workshop pack.

| Proof | Local path or link | What it shows |
|---|---|---|
| Canonical Stretch Bed specs | `v2/src/lib/data/products.ts` | Product status, materials, dimensions, warranty and repairability claims |
| Brand and human voice | `v2/src/lib/data/content.ts` | Origin story, quotes, story cards and media pack captions |
| March 2026 compendium | `v2/docs/COMPENDIUM_MARCH_2026.md` | Deployment counts, partners, demand, funding, risks and media assets |
| Community voice source doc | `v2/docs/GOODS - Community Voices from the Ground.md` | Named community voices and themes |
| Production guide | `v2/docs/PRODUCTION_FACILITY_GUIDE.md` | Facility layout, equipment, process, safety and shift handover |
| Funding journey | `wiki/raw/grants-archive/FUNDING-JOURNEY.md` | Confirmed funders, active applications, misses and relationship map |
| Grant archive index | `wiki/raw/grants-archive/INDEX.md` | Source trail for funder documents and partner correspondence |
| Stretch Bed product images | `v2/public/images/product/stretch-bed-hero.jpg`, `stretch-bed-in-use.jpg`, `stretch-bed-assembly.jpg` | Product in use and assembly |
| Community images | `v2/public/images/media-pack/community-bed-assembly.jpg`, `nic-with-elder-on-verandah.jpg`, `woman-on-red-stretch-bed.jpg` | Human context and product testing |
| People images | `v2/public/images/people/dianne-stokes.jpg`, `ivy.jpg`, `alfred-johnson.jpg`, `norman-frank.jpg`, `patricia-frank.jpg` | Named storyteller and partner context |
| Production images | `v2/public/images/process/container-factory.jpg`, `shredded-plastic-tubs.jpg`, `pressed-sheets.jpg`, `cnc-cutter.jpg`, `hydraulic-press.jpg` | Plant and process proof |
| QR proof | `v2/public/images/pitch/bed-qr-code.jpg`, `data/qr_codes/` | Asset tracking and product lifecycle spine |
| Local videos | `v2/public/video/recycling-plant-desktop.mp4`, `stretch-bed-desktop.mp4`, `community-desktop.mp4`, `building-together-desktop.mp4`, `jaquilane-testimony.mp4` | Product, facility and community proof |
| Descript videos | `https://share.descript.com/view/haRZJbfJadJ`, `https://share.descript.com/view/YQwAcYfxzkn`, `https://share.descript.com/view/LAT0KNJMxmH`, `https://share.descript.com/view/Xtrc5ZYsym6` | Facility walkthrough, Fred, Alice Springs recipient and timelapse |
| Notion Goods HQ | `https://app.notion.com/p/177ebcf981cf805fb111f407079f9794` | Live operating hub, opportunity board and linked project pages |
| Notion production HQ | `https://app.notion.com/p/1faebcf981cf80c49e54f7e6b190c37c` | Production equipment, phases, operating notes and facility proof |
| Notion videos and photos | `https://app.notion.com/p/2faebcf981cf80eab263ca3a91659da1` | Public Descript and Google Photos links |

## What Not To Overclaim

These should stay out of external or partner-facing copy unless Ben and Nicholas have checked the source.

- Do not present the 103 Notion opportunities or $16.56M opportunity value as booked revenue.
- Do not say the plant economics are proven. The plant exists, but the operating model, site economics and ownership handover still need proof.
- Do not say the impact model is fully live. Some metrics are tracked now, while others are proposed or in pilot.
- Do not commit to a fixed 40 percent profit share as the final model. Older docs use it, but the March compendium flags it as a placeholder concept.
- Do not treat all bed counts as interchangeable. Sources reference 140+, 369, 389 and 400+ depending on whether they mean beds, all assets, historical prototypes or current tracked records.
- Do not call future HDPE products real products yet. Wall panels, shelving, tables, outdoor furniture and playground equipment are concepts.
- Do not use discontinued product language as the current offer. The Stretch Bed is the current bed. Basket Bed is archived and open source.

## What Still Needs Human Review

This is the review list for the Ben and Nicholas Notion deep dive.

1. Confirm the clean external number for assets, beds, washers and communities.
2. Confirm which quotes and photos are approved for this QBE pack, public web, investor packs and internal-only use.
3. Reconcile production assumptions: one sheet per bed versus two sheets per bed, beds per day, beds per week and real current bottleneck.
4. Confirm which demand items are paid, approved, requested, warm pipeline or purely exploratory.
5. Decide how to describe community ownership without locking in a legal structure before the legal work is complete.
6. Decide whether "as ubiquitous as a troop carrier or Akubra" should stay in external copy or only internal strategy.
7. Confirm the exact role of ACT shared services versus a future Goods entity.
8. Confirm which partners should be named in the pack and which should be anonymised or held for the live conversation.

## Working Position

Goods has a strong vision because it is not abstract. It is visible in the product, the people, the plant, the register and the demand. The next job is not to make the story bigger. The next job is to make the proof more visible, the claims more disciplined and the pathway to community-owned production easier for outsiders to understand.

## Sources

- Founder transcript and notes, May 2026, user-provided.
- Goods HQ Notion page, fetched 2026-05-02 from `https://www.notion.so/acurioustractor/Goods-HQ-177ebcf981cf805fb111f407079f9794`.
- StretchBed HQ Notion page, fetched 2026-05-02.
- On Country Goods Production HQ Notion page, fetched 2026-05-02.
- Goods Videos and Photos Notion page, fetched 2026-05-02.
- Full strategy: `v2/docs/GOODS_STRATEGY_PD.md`.
- March compendium: `v2/docs/COMPENDIUM_MARCH_2026.md`.
- Community voice source: `v2/docs/GOODS - Community Voices from the Ground.md`.
- Production guide: `v2/docs/PRODUCTION_FACILITY_GUIDE.md`.
- Canonical product data: `v2/src/lib/data/products.ts`.
- Brand and story data: `v2/src/lib/data/content.ts`.
- Structured compendium data: `v2/src/lib/data/compendium.ts`.
- Grants archive: `wiki/raw/grants-archive/FUNDING-JOURNEY.md` and `wiki/raw/grants-archive/INDEX.md`.
- Draft go-to-market analysis: `GO_TO_MARKET_THOUSANDS_2026.md` and `MARKET_INTELLIGENCE_2026.md`, to be treated as internal analysis until human-reviewed.
