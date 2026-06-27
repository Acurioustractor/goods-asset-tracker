---
wide: true
---

# Grantscope Capital And Procurement Loop

> This is the operating process for turning the Goods wiki and Notion review pack into a live capital, grants, philanthropy, procurement and relationship pipeline. The rule is simple: Grantscope/CivicGraph finds and scores the outside opportunity landscape, the Goods wiki holds the evidence and source truth, Notion is where we review judgement calls, Supabase holds operational truth, and HighLevel/GHL only receives approved follow-up actions.

## What This Process Is For

Goods needs one joined-up way to answer:

- Which grants, procurement pathways, philanthropic funders and capital partners are genuinely worth pursuing?
- Which Goods evidence, photos, stories, pitch decks, budgets, governance notes and product proofs support each opportunity?
- Which opportunities should become procurement conversations, funder conversations, partner conversations or no-go decisions?
- Which claims are ready, which need founder review, and which need consent or governance work before being shared?
- Which approved next actions should move into HighLevel/GHL so follow-up actually happens?

This is not a grant-hunting side project. It is the way Goods turns evidence into the right kind of capital, procurement and partner conversations without losing the community-owned direction of the work.

## System Roles

| System | Job | What it must not do |
|---|---|---|
| Goods wiki | Canonical source-controlled knowledge, source pages, evidence maps, program pack, product truth and claim status | Become a dead index of local files |
| Notion | Human review, workshop notes, decisions, opportunity triage, evidence gaps and founder judgement | Become the only source of product or operational truth |
| Drive | Original PDFs, decks, spreadsheets, photos, signed documents and permissioned attachments | Hide the actual answer behind inaccessible files |
| Goods Supabase | Live operational truth: products, orders, assets, bed journeys, stories, CRM/deals where verified | Store speculative grant/funder research as if it is delivery truth |
| Grantscope/CivicGraph | Opportunity, entity, funding, procurement, foundation, relationship and place intelligence | Override Goods evidence or push actions without review |
| HighLevel/GHL | Follow-up engine for approved buyers, funders, partners and procurement targets | Become the knowledge base or receive raw sensitive story/asset data |

## The Loop

| Step | Action | Primary system | Output |
|---|---|---|---|
| 1 | Maintain Goods evidence | Goods wiki | Source pages, topic pages, claim status and review URLs |
| 2 | Mirror review-ready items | Notion | Review queue, workshop decisions and evidence gaps |
| 3 | Pull live Goods truth | Goods Supabase | Product, order, asset, story, bed journey and deal facts |
| 4 | Scan outside opportunities | Grantscope/CivicGraph | Grants, foundations, procurement buyers, capital holders and partner routes |
| 5 | Match opportunity to Goods evidence | Grantscope plus wiki | Fit score, evidence pack, missing proof and recommended role |
| 6 | Human review | Notion | Go / no-go / monitor / partner-path / apply-path decision |
| 7 | Create artifacts | Wiki, Drive, decks and proposal pages | Pitch deck, one-pager, funder proof page, budget, governance appendix |
| 8 | Push approved follow-up | HighLevel/GHL | Contact, pipeline stage, tags, next action and owner |
| 9 | Write back decisions | Goods wiki and source register | Updated source notes, claim status and opportunity history |

## Notion Workflow

Notion is the human judgement layer. It should hold the messy review work, but the final source truth needs to be written back into the wiki.

Notion mirror for this process: [Grantscope Capital And Procurement Loop](https://app.notion.com/p/353ebcf981cf81548f97ca5c50136733).

### Pages To Use

- [QBE Working Pack - Connected Wiki](https://app.notion.com/p/353ebcf981cf81d5a925d7d452aa1a88)
- [Source Register](https://app.notion.com/p/353ebcf981cf81f3a7f5f730491c4173)
- [Document Review Queue](https://app.notion.com/p/353ebcf981cf8167ad3ac634ac0ba343)
- [Workshop Decisions](https://app.notion.com/p/353ebcf981cf81d6aacbc0debe510ec1)
- [Evidence Gaps](https://app.notion.com/p/353ebcf981cf815b850ef6f29412d80b)
- [CRM / Procurement Follow-up](https://app.notion.com/p/353ebcf981cf816faf51d9717f06579a)

### Add A New Opportunity To Notion

Every grant, funder, procurement lead or partner route should enter Notion as a review card with:

- opportunity name,
- source system: Grantscope, CivicGraph, Goods, referral, funder, procurement portal or mentor,
- opportunity type: grant, foundation, philanthropy, procurement, capital, buyer, partner or governance,
- status: discovered, reviewing, qualified, briefing, pursuing, submitted, won, lost, monitor or no-go,
- recommended role: lead, partner, contractor or monitor,
- fit score and short reasons,
- deadline and likely amount,
- relationship owner,
- related Goods source pages,
- required artifacts,
- evidence gaps,
- governance or consent risks,
- next action,
- whether this can be pushed to GHL.

### Notion Decision Rules

- Do not send to GHL until founder or the nominated owner approves the follow-up.
- Do not attach raw story, household, QR, asset or contact data unless consent and sharing scope are explicit.
- Do not treat a Grantscope match as a decision. It is a signal.
- Do not treat a funding opportunity as good just because it has money. It must fit the Goods theory: community-owned production, repairable/washable goods, remote household health, circular economy, resident ownership or procurement-backed scale.
- If an opportunity would bend the work away from community ownership, mark it as monitor or no-go.

## Supabase Interaction

Goods Supabase is the operational truth layer. For v2, use the project named in repo instructions: `cwsyhpiuepvdjtxaozwf`. Do not use the Supabase MCP for v2 database operations because it is connected to the wrong project.

### Goods Data That Can Support Opportunities

| Goods evidence | Operational or review source | Use in opportunities |
|---|---|---|
| Products and specs | Supabase product records plus [[../sources/canonical-product-data]] | Product sheets, procurement specs, funder proof |
| Orders and delivery | Supabase order records and redacted delivery summaries | Revenue, demand, delivery proof and buyer history |
| Asset lifecycle | Supabase asset and bed-journey records where live, translated through [[../sources/community-essential-goods-tracking-model]] | Durability, repair, replacement and avoided waste evidence |
| Stories and media | Consent-cleared story records and [[../sources/community-voices-from-the-ground]] | Human proof and consent-led evidence |
| CRM/deals | Supabase CRM/deal records and approved GHL follow-up history | Existing relationship and pipeline context |
| Production | Production shift, inventory and journal records where live, translated through [[../sources/production-facility-guide]] | Manufacturing readiness and plant-scale proof |

### What Supabase Should Send To Grantscope

Only send aggregated or approved operational facts:

- community-level delivery counts,
- product mix by place,
- demand signals,
- repair or replacement rates when not household-identifying,
- approved story/evidence references,
- current buyer or partner status,
- deal status where appropriate,
- source URLs back to wiki pages.

Do not send raw household data, raw QR code logs, private story material, contact details or sensitive community data until consent and data-sharing rules are explicit.

### What Grantscope Should Send Back To Goods

Grantscope should return opportunity intelligence, not operational truth:

- matched grant opportunities,
- foundation or philanthropy targets,
- procurement buyer routes,
- community and place intelligence,
- relevant entity profiles,
- relationship pathways,
- deadlines,
- amount signals,
- likely evidence needs,
- recommended next action,
- suggested GHL tags or pipeline stage.

Those returned signals should land first in Notion or a review queue, not straight into the CRM.

## Grantscope / CivicGraph Integration

The Goods side already has a clear shape for what Grantscope/CivicGraph should return. The important point for the working pack is not the implementation detail. It is the judgement process: what signals come back, how they are checked, and what is allowed to become a real action.

The current expected sections are:

| Section | Goods use |
|---|---|
| `summary` | Overall opportunity thesis and headline moves |
| `buyers` | Procurement buyer targets and channel leads |
| `capital` | Grants, foundations, philanthropic and patient-capital targets |
| `communities` | Community proof, need signals, demand and buyer context |
| `all` | Combined view for admin review |

The client model already expects:

- buyer targets with relationship status, procurement path, next action, order signal and buyer score,
- capital targets with source kind, instrument type, deadline, amount signal and capital-fit score,
- community proof with assets, demand, proof line, story, partners and known buyer.

That means the immediate build path is to use the existing expected shape as the read interface, then create a governed write-back path only after review.

## Grantscope Data To Use

From the Grantscope repo, the relevant datasets and systems are:

| Grantscope source | What it contributes to Goods |
|---|---|
| Grant opportunities | Government and philanthropic opportunities, deadlines, fit fields, eligibility, assessment criteria and URLs |
| Foundation power profiles | Philanthropic philosophy, capital-holder type, source of wealth, giving focus and gatekeeping signals |
| Saved pipeline flows | Current and future opportunity pipeline state |
| Goods communities | Place-based Goods community intelligence |
| Goods procurement entities | Buyer and partner candidates linked to communities |
| Goods procurement signals | Procurement, buyer, capital or partner signals generated from Goods/place evidence |
| Goods asset lifecycle | Aggregated lifecycle mirror of Goods assets where sharing is governed |
| Goods governance readiness | Governance, applicant, contracting, data and IP readiness issues |
| Entity graph and relationships | ABN-linked entity truth across charities, foundations, contracts, donations and procurement |
| AusTender contracts | Procurement history, buyer names, categories and method |
| ACNC/foundation data | Philanthropy context, giving history, foundation programs and potential fit |

## Opportunity Matching Method

Every opportunity should be scored against Goods using a simple reviewable rubric:

| Dimension | Question | Evidence source |
|---|---|---|
| Mission fit | Does it fund remote household health, repairable goods, circular economy, First Nations enterprise, manufacturing, resilience or procurement reform? | Goods strategy, social objective, product pages |
| Community fit | Does it support a place or partner where Goods has proof, invitation or demand? | Community pages, source pages, Supabase aggregates |
| Product fit | Is the opportunity for beds, washing machines, production, waste, data, story, health or operations? | Product source pages |
| Capital fit | Is it grant, philanthropy, debt, procurement revenue, repayable grant or patient capital? | Capital stack and funding journey |
| Readiness | Do we have the budget, governance, applicant, evidence and delivery capacity? | Source register, governance readiness, document readiness |
| Relationship | Is there a warm path, existing contact or credible intro? | Notion, GHL, Grantscope entity graph |
| Evidence gap | What must be created before applying or pitching? | Evidence gaps and document review queue |
| Risk | Could it compromise community ownership, data sovereignty or product truth? | Governance/data pages |

## Pipeline Statuses

Use the same language across Notion, Grantscope and GHL wherever possible:

| Status | Meaning | System action |
|---|---|---|
| Discovered | Signal found by Grantscope, referral, mentor or manual search | Add to Notion review queue |
| Reviewing | Someone is checking fit and evidence | Link source pages and gaps |
| Qualified | Worth serious work | Create artifact checklist |
| Briefing | Building one-pager, deck, budget, governance appendix or partner brief | Use wiki + Drive artifacts |
| Pursuing | Active contact or application underway | Create approved GHL task/deal |
| Submitted | Application or proposal sent | Track in Notion and GHL |
| Won | Money, contract or commitment secured | Write back to funding journey and source register |
| Lost | Not successful | Capture learning and next route |
| Monitor | Real but not now | Keep in Grantscope/Notion, no GHL urgency |
| No-go | Poor fit or wrong incentive | Record why and stop |

## Artifact Pack For Each Opportunity

Every serious opportunity needs an artifact pack, not just a note.

| Artifact | Where it lives | Why it matters |
|---|---|---|
| Opportunity brief | Notion and wiki source note | Makes the decision reviewable |
| Evidence map | Wiki page links | Shows proof, not just claims |
| Pitch deck | Drive, linked from Notion | External funder/procurement conversation |
| One-page summary | Drive or wiki export | Fast sharing |
| Budget or unit economics | Drive/Sheets, summary in wiki | Due diligence |
| Governance appendix | Wiki + Drive if formal | Applicant, ownership, data, IP and risk readiness |
| Product sheet | Wiki/product page or PDF | Procurement and buyer clarity |
| Community proof page | Wiki/Notion, consent checked | Human evidence |
| CRM action | GHL only after approval | Makes follow-up happen |

## Procurement Pathways

Goods should keep the procurement categories already used in the working pack:

| Pathway | Typical buyer | Goods angle | CRM tag after approval |
|---|---|---|---|
| `procurement_buyer` | Housing, councils, stores, construction, logistics, accommodation providers | Durable goods, local supply, lifecycle value | `goods-buyer-target` |
| `health_buyer` | Aboriginal health services, clinics, RHD/environmental health programs | Washing, bedding, scabies/RHD prevention pathway | `goods-buyer-target` |
| `community_partner` | Community-controlled organisations, homelands, local enterprises | Production, delivery, repair and governance | `goods-partner-target` |
| `impact_finance` | SEFA, PFI, QBE, foundations, patient capital | Working capital, inventory, production plant, matched funding | `goods-capital-target` |
| `aboriginal_trust` | Aboriginal trusts, royalty bodies, regional funds | Place-based ownership and local benefit | `goods-strategic-target` |

For each pathway, the working row should show:

- buyer or funder,
- relationship status,
- evidence,
- next action,
- likely product,
- order signal,
- finance implication,
- GHL status.

## Governance Rules

- Community story, photos, household data and asset-level data require consent and data-sovereignty review before sharing outside the core team.
- Procurement should not become the whole business model. It must support the resident-ownership and community-ownership direction.
- Grantscope can find opportunities, but Goods decides whether the opportunity is right.
- Supabase facts should be translated into readable evidence before mentors, funders or procurement buyers see them.
- GHL receives tasks and pipeline records only after human approval.
- The evidence register must be updated whenever an opportunity creates a new artifact, new decision or new claim.

## First Implementation Pass

### Now

- Follow [[implementation-sequence]] as the ordered build process.
- Use this page as the operating process.
- Add serious Grantscope matches into the Notion review queue.
- Keep source pages linked to the opportunity cards.
- Use the CRM / Procurement Follow-up page as the approval gate before any GHL push.
- Keep Drive links for original decks, budgets and attachments.

### Next

- Add an `Opportunity Register` page or data source in Notion with the fields in this page.
- Add a small Goods admin view that reads `getGrantscopeBuyers`, `getGrantscopeCapital` and `getGrantscopeCommunities`.
- Add a manual "send to Notion review" action from the admin view.
- Add a second manual "send approved follow-up to GHL" action after review.
- Add evidence-register backlinks from each opportunity to its pitch deck, one-pager, budget and governance appendix.

### Later

- Sync approved opportunity outcomes back into the Goods evidence register.
- Build a weekly opportunity health report: new matches, deadlines, evidence gaps, actions waiting for approval, GHL tasks created and decisions made.
- Use Grantscope to compare Goods targets against current philanthropy philosophy, future philanthropy partner fit, procurement timing and relationship warmth.

## Ongoing Operation: the funding-pipeline skill

The operational implementation of this loop is the `funding-pipeline` skill (`.claude/skills/funding-pipeline/`, local). It exists because the loop recorded opportunities but never re-checked their dates: a June 2026 audit carried "NT RMF Round 2, live" when that round had closed in February 2023. The skill makes the date check non-skippable.

Each run: pull GHL (read-only) and Grantscope leads, **verify every open/close date on the live source page** (a syndicated or DB row is a lead, not a deadline), score for Goods fit, and write a dated shortlist to `wiki/outputs/<date>-funding-refresh/` plus a Notion review page. It writes nothing to GHL or Notion-as-action on its own.

The alignment rule is **one writer per layer**:

| Layer | Owns | Written by |
|---|---|---|
| Repo (`wiki/outputs/*-funding-refresh/`, `artifact-register.json`) | Verified evidence + audit trail | The skill, every run |
| Notion (review page) | Human decisions: add / retire / owner / go-no-go | Skill writes the page; founder ticks decisions |
| GHL (Grants + Supporter Journey) | Live pipeline state + action | Only `v2/scripts/ghl-grants-sync.mjs`, dry-run then `--commit` |

Shared stage language across all three (Identified to In Progress to Submitted to Awarded/Declined). Retire dead grants to "Grant Declined" + status lost, never delete. The refresh and the Notion review page are Tier 1-2 and can run on a weekly cron; the GHL write is Tier 3 (day-shift, founder's explicit approval, never AFK-queued). First run: 2026-06-28, `wiki/outputs/2026-06-28-funding-refresh/` (all 10 GHL Grants rows verified dead; SEDI + NT Advanced Manufacturing added as the live fits).

## Related

- [[source-register]]
- [[source-library]]
- [[document-readiness]]
- [[../sources/procurement-strategy]]
- [[../capital/capital-stack]]
- [[../investors/investor-pipeline]]
- [[../governance/data-sovereignty]]
- [[../enterprise/10-investors-capital-raising]]
