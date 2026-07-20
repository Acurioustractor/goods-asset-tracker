---
wide: true
---

# Source Library

> This page is the source control sheet for the QBE working pack. It says where each real document lives, where it can be reviewed in the web wiki, where it should be edited, and which sources still need to move into Notion or Drive for human review.

## Why This Exists

The working pack should not ask a reader to trust a hidden source. We still need a clear review trail, so this page separates the public review material from originals, internal working documents and data sources.

Use this page with [[document-readiness]] and [[workshop-evidence-map]].

## Where Things Should Live

| Place | Best use | Editing rule |
|---|---|---|
| This web wiki | Review pack, mentor pre-read, source notes, topic pages | Edit the markdown in `wiki/articles/`, then sync into the app. |
| Notion Goods HQ | Human workshop, founder review, comments, decisions, messy synthesis | Best place for collaborative editing once a page is worth discussing with humans. |
| Google Drive | Original PDFs, signed agreements, decks, spreadsheets, images and documents that need sharing permissions | Best place for canonical attachments and external-access control. |
| Local repo docs | Working markdown drafts that drive the app and source library | Good for agent editing and version control, not good as the only reviewer destination. |
| Code/data files | Product truth, dashboard logic, impact-model data, QR/asset infrastructure | Do not ask mentors to read these. Translate the facts into wiki or Notion first. |

Recommendation: keep the web wiki as the structured working pack, move the high-value source documents into Notion pages for founder review, and use Drive for original files that need permissioned sharing. Notion is the best review/workshop layer. It should not be the only source of truth for product specs or code-backed data.

## Connected Review Workspace

The connected Notion layer is [QBE Working Pack - Connected Wiki](https://app.notion.com/p/353ebcf981cf81d5a925d7d452aa1a88). It contains:

- [Source Register](https://app.notion.com/p/353ebcf981cf81f3a7f5f730491c4173)
- [Document Review Queue](https://app.notion.com/p/353ebcf981cf8167ad3ac634ac0ba343)
- [Workshop Decisions](https://app.notion.com/p/353ebcf981cf81d6aacbc0debe510ec1)
- [Evidence Gaps](https://app.notion.com/p/353ebcf981cf815b850ef6f29412d80b)
- [CRM / Procurement Follow-up](https://app.notion.com/p/353ebcf981cf816faf51d9717f06579a)
- [Implementation Sequence](https://app.notion.com/p/353ebcf981cf81b8b4d0e995526b285a)
- [Human Verification Sprint](https://app.notion.com/p/354ebcf981cf815b8c0edac5bd2ab0dc)

Nothing should be pushed from the wiki into HighLevel/GHL automatically. The Notion follow-up page is the human approval layer before buyer, funder, partner or procurement actions are created in the CRM.

Use [[grantscope-capital-procurement-loop]] for the full process connecting Grantscope/CivicGraph, Goods Supabase evidence, Notion review, Drive artifacts, governance checks and approved GHL follow-up.

Source status language:

| Status | Meaning |
|---|---|
| Reviewable now | A reader can review the source note in this web wiki. |
| Editable locally | The source is a real local markdown/code/data file and can be edited in the repo. |
| Move to Notion | The source should become a Notion page for human review and workshop comments. |
| Move to Drive | The source is an original file or attachment that should be permissioned in Drive. |
| Do not share raw | The underlying data/code is sensitive or too technical and needs translation first. |

## How To Edit

- Working pack pages: edit the matching wiki article, then sync the wiki into the app.
- Source markdown docs: edit the local file named in the register below, then update the relevant source note and topic page.
- Structured product/data facts: update the underlying source only when the product or data truth changes, then translate the facts into the wiki. Do not make a reviewer inspect internal systems.
- Notion review: once the source note is worth human discussion, create or update the matching page under [Goods HQ Notion](https://www.notion.so/acurioustractor/Goods-HQ-177ebcf981cf805fb111f407079f9794?source=copy_link) and paste the wiki source note there for comments.
- Drive sharing: upload original PDFs, decks, spreadsheets and signed documents to the controlled Goods Drive folder before external sharing.

## Source Access Register

| Source | Review it here | Internal edit location | Best shared home | Current status |
|---|---|---|---|---|
| ACT Core Facts | [[../sources/act-core-facts]] | [ACT Tractorpedia public viewer](https://act-global-infrastructure.vercel.app/tractorpedia.html) | Wiki source note, then legal/governance topic pages | Use as entity naming truth. Needs legal/accounting confirmation before external legal claims. |
| Goods Strategy PD | [[../sources/goods-strategy-pd]] | Internal strategy/product document | Notion page under Goods HQ, then wiki topic pages | Move to Notion for founder review. |
| March 2026 Compendium | [[../sources/march-2026-compendium]] | Internal March 2026 compendium | Notion source page plus wiki extracts | Too large to leave as hidden source material. |
| Community Voices From The Ground | [[../sources/community-voices-from-the-ground]] | Internal community voices document | Notion with consent review; redacted wiki extracts | Do not share raw without consent review. |
| Production Facility Guide | [[../sources/production-facility-guide]] | Internal production facility guide | Wiki page plus image/process assets in Drive | Needs diagrams/photos attached. |
| Operations Handbook | [[../sources/operations-handbook]] | Internal operations handbook | Notion operating manual and wiki summary | Needs current process check. |
| Community Essential Goods Tracking Model | [[../sources/community-essential-goods-tracking-model]] | Internal tracking model document | Notion review page and governance/data wiki page | Needs privacy/data-sovereignty review. |
| Canonical Product Data | [[../sources/canonical-product-data]] | Internal product data source | Product wiki pages and product sheets | Code is canonical. Do not make mentors read it. |
| Impact Model Data | [[../sources/impact-model-data]] | Internal impact model data source | Impact wiki pages and Notion workshop page | Translate before sharing. |
| Catalysing Impact Application Draft | [[../sources/catalysing-impact-application-draft]] | Internal application draft | Notion page with submitted/draft status | Needs status label and cleanup. |
| Snow Pitch With Feedback And Reflections | [[../sources/snow-pitch-feedback-reflections]] | Internal Snow pitch/reflection document | Drive original plus Notion reflection note | Needs sensitivity review. |
| Funding Journey | [[../sources/funding-journey]] | Internal funding journey record | Finance/capital wiki page and Notion workshop page | Needs finance summary. |
| Grants Archive Index | [[../sources/grants-archive-index]] | Goods Grants Archive index | [Goods Grants Archive on Drive](https://drive.google.com/drive/folders/1HhLJ0k66oc8tQ9-yugN7JD4MX_JE2y1v) plus wiki source notes | Reviewable in wiki. Drive is best for originals. |
| Go-To-Market Thousands 2026 | [[../sources/go-to-market-thousands-2026]] | Internal go-to-market scenario document | Notion scenario page | Needs assumption review. |
| Market Intelligence 2026 | [[../sources/market-intelligence-2026]] | Internal market intelligence document | Notion research page | Needs source-quality review. |
| Procurement Strategy | [[../sources/procurement-strategy]] | Internal procurement strategy document | Business model wiki page and Notion channel-review page | Needs buyer evidence. |
| CASE Investor Alignment Tool | [[../sources/case-investor-alignment-tool]] | Drive-controlled CASE investor alignment spreadsheet | Drive spreadsheet plus [[../investors/alignment-tool]] | Spreadsheet should stay in Drive; wiki holds readable logic. |
| QBE Actions Dashboard | [[../sources/qbe-actions-dashboard]] | Internal QBE action tracker | [[weekly-actions]] export for mentors | Live app is internal. Export summaries, not code. |
| QR Code Data | [[../sources/qr-code-data]] | Internal QR/asset register data | Redacted samples in Notion or wiki | Do not share raw. Needs privacy rules first. |
| Goods HQ Notion | [Goods HQ Notion](https://www.notion.so/acurioustractor/Goods-HQ-177ebcf981cf805fb111f407079f9794?source=copy_link) | Notion workspace | Best workshop and comment layer | Use for human review, not as the only product/data source of truth. |

## Notion Packaging Queue

These should become editable Notion pages before the deep-dive workshop:

- Goods Strategy PD.
- March 2026 Compendium.
- Community Voices From The Ground (consent-reviewed version only).
- Production Facility Guide with photos and process diagrams.
- Operations Handbook.
- Community Essential Goods Tracking Model.
- Catalysing Impact Application Draft with submitted/draft status.
- Go-To-Market Thousands 2026.
- Market Intelligence 2026.
- Procurement Strategy.

These should stay primarily in Drive, with wiki/Notion summaries:

- signed agreements,
- PDFs,
- original pitch decks,
- spreadsheets,
- image folders,
- funder letters,
- consent-sensitive story assets.

## Goods Strategy PD

This is the strategy/product document behind the Goods vision and product thesis. The original maintainer file is local, so this source note is the accessible review version.

What is inside:

- Goods described as a circular economy social enterprise designing essential household goods in community with remote First Nations communities.
- The link between washable beds, repairable washing machines, waste, health hardware and local enterprise.
- The ambition that Goods beds become a product of first choice in remote communities, not a charity substitute.
- The ownership pathway: production and profits moving toward First Nations communities through local resource use.
- Early evidence of demand, impact logic and community production potential.

What to review:

- January 2026 numbers should be reconciled against current sales, delivery and funding data.
- Any older product language should be checked against the current Stretch Bed truth.
- The legal and ownership structure should be updated to reflect A Curious Tractor Pty Ltd and the still-emerging community-ownership model.

## March 2026 Compendium

This is the broadest single Goods operating snapshot. It should be treated as a strong source document, not as a final public pitch.

What is inside:

- Brand story, origin story and voice guidance.
- our team backgrounds.
- Community deployment context and demand evidence.
- Product system: Stretch Bed, washing machine prototype and future fridge thinking.
- Impact language linking beds, washing, scabies, rheumatic heart disease and household dignity.
- Funders, partners, advisory context and program history.

What to review:

- Counts, dates and delivery figures need a final source-of-truth pass.
- Legal structure language may lag the current ACT Pty Ltd position.
- The strongest content should be pulled into topic pages rather than left as a giant reference.

## Community Voices From The Ground

This is the human source material behind the social problem. It should be handled as consent-led story evidence, not as extractive testimonial material.

What is inside:

- Voices from 15 storytellers across 6 communities.
- Descriptions of bed scarcity, freight barriers, overcrowded houses, dignity and shame dynamics.
- Place-based comments from Palm Island, Tennant Creek, Kalgoorlie, Mount Isa, Darwin and East Arnhem pathways.
- Practical design validation: portability, washability, repairability and fit-for-purpose household goods.

What to review:

- Confirm consent for every named person, quote, image and story before external sharing.
- Decide which stories can be used in mentor material and which should stay internal.
- Keep community interpretation visible. Do not turn voices into anonymous evidence points.

## Production Facility Guide

This is the source for the On-Country production process. It shows that the manufacturing pathway has been thought through beyond a pitch line.

What is inside:

- Containerised production facility concept.
- Plastic collection, shredding, melting and pressing flow.
- Equipment, layout, safety and power constraints.
- Quality checks, handover thinking and process transfer requirements.
- The operational question of how production can move toward community ownership.

What to review:

- Confirm current equipment status and any changes to bed-per-sheet assumptions.
- Reconcile process details with the current bill of materials.
- Add photos, diagrams and a plain process map for mentor review.

## Operations Handbook

This source shows that operating knowledge is being pulled out of founder heads and into repeatable practice.

What is inside:

- Practical routines and process instructions.
- Evidence that production, delivery and support can become teachable.
- Early founder-dependency reduction work.

What to review:

- Check whether it reflects the current Stretch Bed process.
- Confirm current roles and responsibilities.
- Turn the strongest routines into a clean operating-readiness section in the pack.

## Community Essential Goods Tracking Model

This source supports the asset-register and lifecycle-support model.

What is inside:

- Product IDs, QR codes and tracking logic.
- Feedback and repair pathways.
- The idea that products should not disappear after delivery.
- A measurement spine attached to real products, not bolted on after the fact.

What to review:

- Privacy, consent and Indigenous data-sovereignty language.
- Who can see product data, who can edit it and who can withdraw story or household-level information.
- How the tracking model supports care and repair rather than surveillance.

## Canonical Product Data

This is the structured product truth used by the website. The code file itself is local, so this source note records the reviewable facts.

What is inside:

- Stretch Bed status as the flagship product for sale.
- Materials: recycled HDPE plastic panels, galvanised steel poles and heavy-duty Australian canvas.
- Specs such as weight, capacity, dimensions, assembly time, design lifespan and warranty.
- Product status boundaries: Stretch Bed for sale, washing machines as prototype/register interest, Basket Bed archived, Weave Bed removed.

What to review:

- Convert these facts into human-readable product sheets.
- Keep any source pages aligned to the product data so old product descriptions do not drift back in.

## Impact Model Data

This source shows the impact model under construction. It is useful, but it must not be presented as a finished measurement system.

What is inside:

- Candidate dimensions across health, environment, economics and community ownership.
- Possible indicators and proxy measures.
- Dashboard-style thinking about what Goods could track over time.

What to review:

- Separate live metrics from possible future metrics.
- Tie each metric back to the theory of change.
- Keep qualitative story evidence alongside quantitative data.

## Catalysing Impact Application Draft

This source shows how Goods entered the QBE Catalysing Impact process.

What is inside:

- Enterprise description and eligibility framing.
- Beneficiary and impact language.
- Climate resilience, social inclusion and repayable-finance framing.
- Early capital-readiness story.

What to review:

- Remove placeholders.
- Mark what was submitted, what was draft and what has changed since submission.
- Reconcile numbers before reuse.

## Snow Pitch With Feedback And Reflections

This source matters because it shows funder learning, not just pitch polish.

What is inside:

- Pitch language used with Snow Foundation.
- Feedback and reflection from the process.
- Evidence of what resonated and what needed improvement.

What to review:

- Decide which feedback is appropriate to share outside the team.
- Check funder sensitivity before quoting directly.
- Use it to show learning discipline rather than a perfect-funder narrative.

## Funding Journey

This source is the finance and funder-history narrative.

What is inside:

- Grant applications, wins, misses and live pipeline.
- Relationship history across funders.
- How Goods has moved from philanthropy toward investment-readiness questions.

What to review:

- Reconcile totals with finance records.
- Add a Goods-specific financial summary.
- Separate capital pathway from general fundraising activity.

## Grants Archive Index

**Accessible source:** [[../sources/grants-archive-index]]

This source is the map of grant applications, reports and letters.

What is inside:

- Funder folders and source trail.
- Existing applications and reports.
- Evidence that the archive exists.

What to review:

- Convert the strongest grant documents into clean wiki source notes.
- Link to live Drive or Notion locations where access can be controlled.
- Do not expect mentors to navigate raw archive paths.

## Go-To-Market Thousands 2026

This source is scale scenario work. It should not be treated as locked strategy.

What is inside:

- Thinking about moving from hundreds of beds toward thousands.
- Channel and distribution assumptions.
- Sales discipline and where scale could break.
- Early buyer segmentation.

What to review:

- Validate assumptions and unit economics.
- Separate ambition from forecast.
- Decide what belongs in the QBE pack and what stays internal.

## Market Intelligence 2026

This source supports market and procurement context.

What is inside:

- Remote procurement context.
- Competitors and alternatives.
- Buyer pathways and market gaps.
- The argument that cheap products can become expensive when they fail quickly.

What to review:

- Check source quality.
- Remove overconfident or unsourced claims.
- Tie market claims to direct Goods evidence where possible.

## Procurement Strategy

This source translates the Goods model into buyer pathways.

What is inside:

- Procurement channels.
- Government and institutional buyer logic.
- Indigenous procurement pathways.
- Early sales discipline thinking.

What to review:

- Make sure procurement does not overpower resident ownership and community ownership.
- Check current buyer priorities.
- Add specific evidence from current partners and live opportunities.

## CASE Investor Alignment Tool

This source helps Goods choose fit-for-purpose capital rather than chasing whoever has money.

What is inside:

- Investor-fit criteria.
- Capital type alignment.
- Readiness questions.
- Trade-offs between grants, debt, concessional finance and other instruments.

What to review:

- Translate spreadsheet logic into a plain investor-readiness note.
- Use it to filter investors, not to perform a fake-precise score.
- Add Goods-specific examples for why patient capital matters.

## QBE Actions Dashboard

This source is the live operating view of QBE follow-through. It is useful internally but should be exported before sharing.

What is inside:

- Current actions.
- Follow-up discipline.
- Open gaps across the 10 working areas.

What to review:

- Decide whether mentors need a weekly action export.
- Keep the source note focused on program discipline, not internal task mechanics.

## QR Code Data

This source is raw asset infrastructure evidence.

What is inside:

- Product IDs.
- QR infrastructure.
- Asset tracking intent.
- Repair and follow-up pathways.

What to review:

- Do not expose raw household, location or product data until privacy rules are explicit.
- Use sample or redacted examples for mentor review.
- Make the purpose clear: care, feedback and repair.

## Related

- [[document-readiness]]
- [[workshop-evidence-map]]
- [[../products/stretch-bed]]
- [[../impact/metrics-tracked]]
- [[../governance/data-sovereignty]]
