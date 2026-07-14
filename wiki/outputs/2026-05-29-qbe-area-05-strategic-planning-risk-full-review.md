# QBE Area 05 - Strategic Planning & Risk: Full Review

Date: 2026-05-29
Status: internal working review - founder/advisory review required before external use
Diagnostic source: `/Users/benknight/Downloads/ACT_GOC Impact Investment Diagnostic V4 130526.pdf`
Primary Notion page: https://www.notion.so/36eebcf981cf8143a283efd1eb5260d7

## Meeting-ready read

The diagnostic reads Goods strategy as real and adaptive, not absent. That is the strength. The gap is that the strategy still lives too much in founder judgement, working pages, program actions and operating systems. For QBE, SEFA, advisors and new staff, it needs to become legible as a short strategic narrative, a board-grade risk register, and explicit scenario response rules.

The strongest current proof is that Goods has already built the pieces the diagnostic asked for: a four-state cash buffer policy, base/upside/downside scenarios, a working risk register, place-readiness thinking, admin pipeline views, production/inventory data, funder reporting infrastructure and the "do no harm" risk philosophy. The investor-readiness step is to formalise those into a maintained register with owners, triggers, review dates and mitigation status.

## Diagnostic summary

The diagnostic asks whether Goods has a clearly defined strategic planning process and whether strategic risks are proactively managed.

It recognised:

- Goods strategy is genuinely adaptive and responsive, which is important when working with remote community partners.
- The risk philosophy is well-considered: "do no harm" and avoid perpetuating the waste problem Goods is trying to solve.
- Parallel funding applications and community conversations create flexibility for the next plant location.

It flagged:

- Strategic documentation needs to become clearer for staff, advisors and investors.
- A short founder-authored 1-3 page strategic narrative would be high value.
- The risk register needs to include environmental risk: waste streams, contamination, plastic stockpiling and pollution.
- Scenario planning for the upcoming raise needs to be tied explicitly to operational decisions such as deferring plant build or compressing geographic scope.

## Current proof reviewed

### Existing strategy and risk sources

| Source | What it proves | Current read |
|---|---|---|
| `wiki/articles/enterprise/05-strategic-planning-risk.md` | Strong strategic frame: adaptive planning, place-readiness questions, planning rhythm, risk frame and scenario decisions. | Best current strategy narrative source. Needs founder voice and condensation. |
| `wiki/articles/governance/risk-register.md` | Working risk categories across product, environmental, trust, data, key people, production, cashflow, debt, governance and ownership. | Useful draft, not board-grade. Needs owners, triggers, residual risk, review cadence. |
| `wiki/outputs/2026-05-12-financial-model-day7-buffer-policy.md` | Four-state cashflow response policy: NEGATIVE, BELOW_FLOOR, BELOW_TARGET, OK. | Strong modelled operating-control artifact. Needs founder/advisory endorsement. |
| `wiki/outputs/2026-05-12-financial-model-day9-three-scenarios.md` | Base, upside and downside scenarios with operational triggers. | Strong scenario artifact. Needs refresh against current finance model and pipeline. |
| `wiki/outputs/2026-05-28-qbe-documentation-deep-dive.md` | Identifies formal risk register as V4 Opp #6 and Stage 2 governance need. | Current QBE map. |
| `wiki/outputs/2026-05-28-goods-master-register.md` | Shows risk/register as one of the next 12-week priority actions. | Good cross-enterprise source. |
| `v2/src/lib/data/content.ts` and `v2/src/lib/data/compendium.ts` | Existing risk language in public/internal data objects. | Useful but partly stale and not governance-grade. |

### Current operating signals

Fresh direct v2 Supabase query, 2026-05-29 local time.

| Signal | Current pull | Risk implication |
|---|---:|---|
| CRM deals | 43 rows | The pipeline is actively modelled in the system. |
| Active deals | 23 | Significant opportunity set, but needs cadence. |
| Active pipeline value | AUD 3,418,697.80 | High strategic upside; also concentration and conversion risk. |
| Weighted active value | AUD 604,040 | More realistic near-term pipeline signal. |
| Won deal value | AUD 898,863 | Validates that deals can close. |
| Active deal units | 41 | Current unit demand in active CRM is modest relative to ambition. |
| Won units | 491 | Significant historical deployment/order proof. |
| Active deals stale by `updated_at > 7 days` | 23 of 23 | Treat as pipeline hygiene risk, not definitive relationship inactivity. |
| Asset rows | 561 | Asset system exists. |
| Asset quantity | 674 | Product base large enough for field feedback. |
| Deployed quantity | 524 | Strong operating evidence. |
| Requested quantity | 108 | Demand signal still active. |
| Latest inventory snapshot | 2026-03-27 | Inventory data freshness risk. |
| Beds possible in latest snapshot | 4 | Supply risk if demand moves before inventory/production catches up. |
| Latest production shift | 2026-03-12 | Production-log freshness risk. |

## One-page strategy narrative draft

### Where Goods is now

Goods has proven the Stretch Bed as a practical remote-housing product, not a concept. The product is in the field, tracked through the asset register, tied to stories and feedback, and now has a corrected cost model. The strategy is to keep the Stretch Bed as the anchor product while building the operating system that can eventually support on-country production and community ownership.

The core strategic choice is sequencing. Goods should not choose the next plant site just because funding is available or a place sounds good in a pitch. The decision needs readiness: local demand, trusted partner, usable plastic, safe production, freight/delivery path, local value, governance and funding timing.

### The next 12 months

The next phase is not generic scale. It is disciplined conversion:

- Convert warm institutional and funder relationships into binding LOIs by 31 August 2026 for the QBE matched-funding pathway.
- Complete the Goods-only finance model, cost tool and investor-ready pack.
- Keep production focused on the Stretch Bed while washing machines remain prototype/register-interest.
- Choose the next production pathway through a place-readiness gate, not momentum.
- Build risk, governance, reporting and role clarity before accepting repayable capital.

### The decision rule

Goods scales only when the next step does not create avoidable harm. That means:

- Do not take debt without credible repayment evidence.
- Do not launch a plant without local readiness.
- Do not claim circular economy unless plastic streams, offcuts and end-of-life are handled.
- Do not publish community stories or images without consent discipline.
- Do not let funder timelines outrun community, production or governance readiness.

## Formal risk register v0.1

This is the first board/advisory-grade shape. Owners and review dates still need founder confirmation.

| # | Risk area | Risk statement | Current evidence | Likelihood | Impact | Trigger | Current control | Next artifact |
|---|---|---|---|---|---|---|---|---|
| 1 | Financial / cashflow | Costs land before grant, customer or capital payments. | Day 7 buffer policy; Day 9 troughs; Area 04 finance review. | High | High | Cash below 3 months runway or major receivable delayed. | Four-state buffer policy. | Cash buffer dashboard + monthly review record. |
| 2 | Demand / LOIs | Warm relationships do not become binding commitments in time for QBE Stage 2. | 23 active deals; active pipeline AUD 3.4M; all active deal updated_at values stale. | Medium | High | Fewer than 3 binding LOIs by 31 Aug 2026. | Deals admin; focus workstreams. | LOI tracker with owner, next action, legal status. |
| 3 | Production capacity | Demand spikes before inventory, material or production capacity is ready. | Latest inventory snapshot shows 4 beds possible as of 2026-03-27. | Medium | High | New order exceeds beds possible + committed production. | Production admin; cost model. | Production readiness gate and batch plan. |
| 4 | Supply / recycled plastic | Plastic stream is insufficient, contaminated or creates stockpiling/pollution. | Diagnostic environmental risk; content risk notes; Envirobank discussions. | Medium | High | Plastic quality/quantity fails pre-production threshold. | Multiple collection points; sorting intent. | Environmental risk note and plastic QA protocol. |
| 5 | Freight / delivery | Remote freight costs or logistics break the unit economics or delivery promise. | Trip P&L and finance model show freight/travel sensitivity. | High | Medium | Route freight exceeds model threshold or delivery partner unavailable. | Trip receipts admin; route cost workpapers. | Freight band table and delivery go/no-go gate. |
| 6 | Founder capacity | Ben/Nic remain bottlenecks across funders, production, sales and community work. | Diagnostic; Master Register; current admin/workflows still founder-heavy. | High | High | More than one P0 workstream lacks non-founder owner. | Advisory group; knowledge base. | Founder-dependency reduction plan and role map. |
| 7 | Governance | Governance, reporting and decision rights lag the risk of debt and scale. | QBE deep dive; governance/legal workstream. | Medium | High | Repayable capital offered before board/charter/reporting is ready. | Advisory group; ACT Pty Ltd; Butterfly pathway. | Board/advisory charter and decision-rights memo. |
| 8 | Legal / entity | ACT/Goods/Butterfly/community ownership pathway is unclear when capital lands. | Legal-structure workstream; Mint Ellison support noted. | Medium | High | Capital, IP or ownership decision requires signed structure. | ACT Pty Ltd; Butterfly transition in flight. | Entity option memo and ownership trigger map. |
| 9 | Data / consent | Story, image, product or household data is used beyond consent or cultural safety. | Empathy Ledger, ALMA, AI human-in-loop policy. | Medium | Very high | External pack uses story/photo/data without consent status. | Consent-led storytelling and human review. | Consent-safe evidence checklist. |
| 10 | Product / WHS safety | Product failure, repair failure or plant process harms a person. | Product specs, warranty, production/manual pages, support flow. | Low-medium | High | Safety flag, support ticket, incident, failed QA or unsafe production setup. | Product testing, warranty, support route, SOPs. | Incident process + QA checklist + WHS risk review. |
| 11 | Mission / community ownership | Scale centralises value in ACT while public narrative promises community ownership. | Diagnostic, strategy page, legal structure gap. | Medium | High | New plant or capital deal lacks local value/ownership pathway. | Community ownership intent. | Mission-protection note and benefit-share/IP memo. |
| 12 | Public claims / AI collateral | External documents overstate current proof or feel non-founder-authored. | V4 feedback; AI human-in-loop policy. | Medium | High | Any external pack lacks founder sign-off or claim labels. | Human-in-loop policy. | Pre-send claim audit and founder sign-off checklist. |

## Environmental and recycled-plastic risk note

This is the diagnostic's most specific Area 05 gap. The environmental risk should be explicit because Goods is not only selling furniture. It is claiming a circular-economy pathway.

Risks to register:

- Waste stream risk: communities may not generate enough usable HDPE or the collection process may be unreliable.
- Contamination risk: mixed, dirty or unsafe plastic could create poor-quality components or unsafe processing.
- Stockpiling risk: collected plastic could pile up if production is delayed.
- Processing waste risk: offcuts, failed sheets, fumes, dust, energy use or handling practices could create a new harm.
- End-of-life risk: broken beds or obsolete parts could end up in landfill unless repair/reuse/recycling is planned.
- Transport risk: long freight routes could weaken the environmental claim if not disclosed honestly.

Controls to build:

- Plastic acceptance criteria and rejection protocol.
- Offcut reuse/regrind process.
- End-of-life product return or local repair pathway.
- Plant WHS and contamination SOP.
- Environmental incident log.
- A claim rule: do not call a site circular until collection, production waste and end-of-life are all accounted for.

## Scenario response table

| Scenario | Trigger | Operating response | What to tell QBE/advisors |
|---|---|---|---|
| Capital delayed | QBE match, SEFA or anchor funding slips by one quarter. | Invoke BELOW_FLOOR posture, defer plant capex/hires, accelerate receivables and LOIs. | "We are slowing commitments to protect mission and solvency." |
| Partial match only | QBE match evidence below AUD 400K by 31 Aug 2026. | Compress scope to one production pathway, keep batch delivery going, avoid unsupported debt. | "Stage 2 ask scales to committed match, not ambition." |
| Capital lands early | QBE/SEFA/anchor funding lands ahead of base case. | Fund inventory, finance controls, local role readiness and production QA before expanding geography. | "We are using upside to de-risk execution first." |
| Demand exceeds supply | Large institutional order or LOI arrives before inventory and production are ready. | Waitlist transparently, stage delivery, protect quality and delivery truth. | "We will not sacrifice product safety or trust to chase volume." |
| Plant partner ready but cash late | Local partner is ready before capital closes. | Advance training, governance, material sourcing and site planning without irreversible capex. | "Place readiness can progress before machinery spend." |
| Environmental gate fails | Plastic stream, contamination or offcut handling is not ready. | Pause circular-economy claims and production at that site until controls exist. | "Environmental integrity is a go/no-go condition." |
| Consent unclear | Story/image/data source lacks consent status. | Use de-identified pattern evidence only; do not publish. | "Community control of story is part of impact quality." |

## Trigger table for the next 90 days

| Trigger | Review cadence | Source | Decision |
|---|---|---|---|
| Opening cash below 3 months runway | Weekly until stable | Finance model / Xero | Below-floor buffer posture. |
| Fewer than 3 binding LOIs by 31 Aug | Weekly | `/admin/deals`, LOI tracker | Reduce Stage 2 ask or intensify close plan. |
| Active pipeline stale > 7 days | Weekly | `/admin/deals` updated_at/activity | Assign owner and next contact. |
| Beds possible below committed delivery | Weekly during production | `/admin/production` | Stage orders, update buyer expectations. |
| Inventory snapshot older than 14 days | Fortnightly | `/admin/production` | Refresh inventory count. |
| New plant site proposed | Before commitment | Place-readiness checklist | Approve, defer, or reject site. |
| New public claim proposed | Before publishing | Claim map / source page | Label live/modelled/target/internal. |
| Story/photo requested for funder use | Before publishing | Empathy Ledger / consent review | Approve, redact, or hold. |
| Repayable capital offered | Before accepting | Board/advisory + finance model | Debt-service and mission risk gate. |

## Website and admin proof reviewed

| Surface | What it proves | Useful | Risk / caveat |
|---|---|---|---|
| `/admin/deals` | Kanban pipeline, focus workstreams, owner/action checklists. | Strong proof of strategy becoming operating cadence. | Active deal updates appear stale; needs owner discipline. |
| `/admin/production` | Inventory, capacity, cost-per-batch, production trend and supply-demand. | Strong risk signal for production/supply constraints. | Latest inventory and shift data are stale unless refreshed. |
| `/admin/reports` | Funder reports generated from live placeholders. | Good reporting-control proof. | Generated outputs need human/founder review. |
| `/admin/library` | Source hub for product, cost, media and missing content. | Good evidence operating system. | Internal; not board-grade governance. |
| `/pitch/document` | Includes a risks and mitigations section. | Shows risk disclosure exists in collateral. | Uses older investment-case data and should not be treated as current investor pack. |
| `/support` | Safety-risk flag and serviceability support pathway. | Useful proof for product incident/support control. | Needs integration into formal incident register. |

## Artifacts to build

### 1. Founder-authored one-page strategy narrative

Structure:

- Where Goods is now.
- What the next 12 months must prove.
- What Gates QBE Stage 2.
- What will make Goods pause, slow, or say no.

This should be founder-written. The draft above is scaffolding only.

### 2. Board/advisory risk register

Minimum columns:

- Risk area.
- Risk statement.
- Owner.
- Likelihood.
- Impact.
- Current control.
- Trigger.
- Action if triggered.
- Residual risk.
- Review cadence.
- Last reviewed.
- Next review.
- Evidence/source link.

### 3. Environmental risk note

One page focused only on recycled-plastic and circular-economy risk:

- Waste source and quality.
- Contamination threshold.
- Stockpiling risk.
- Offcuts/regrind.
- Product end-of-life.
- Transport/freight emissions honesty.
- Site-level go/no-go checklist.

### 4. Place-readiness checklist

Use for Palm Island, Alice Springs, Tennant Creek, Utopia/Central Australia or any future site:

- Demand.
- Partner readiness.
- Local governance.
- Labour/operator pathway.
- Plastic supply.
- Equipment/power/WHS.
- Funding and working capital.
- Delivery and repair pathway.
- Community value/ownership pathway.

### 5. Scenario response table

Formalise the table above into an advisory/board artifact:

- Capital delayed.
- Partial capital.
- Capital early.
- Demand faster than supply.
- Plant ready but cash late.
- Environmental gate fails.
- Consent unclear.

### 6. Admin risk-readiness dashboard

Potential admin build:

- Active deal stale count.
- LOI tracker status.
- Cash buffer state.
- Beds possible vs committed units.
- Inventory freshness.
- Open safety/support issues.
- Consent review queue.
- Environmental gate status by production site.

## Useful vs noise

Useful:

- Enterprise Area 05 page: it has the best strategy language.
- Working risk register: good seed categories.
- Day 7 buffer policy and Day 9 scenarios: the best strategic controls.
- `/admin/deals`: shows pipeline strategy and stale follow-up risk.
- `/admin/production`: shows production-readiness risk.
- `/support`: shows safety issue pathway.

Noise unless relabelled:

- Old pitch document as current investor strategy.
- Ambitious plant or 5,000-bed scenarios as forecasts.
- Community ownership as already implemented.
- Risk mitigations without owners or review dates.
- "Do no harm" as a slogan without go/no-go controls.
- Circular-economy claims without end-of-life and offcut handling.

## Meeting pages

1. Area 05 Notion page: https://www.notion.so/36eebcf981cf8143a283efd1eb5260d7
2. Risk Register working page: https://www.notion.so/348ebcf981cf81659d84d50425387043
3. QBE Documentation Readiness Deep Dive: https://www.notion.so/36debcf981cf818e968de440ad7b9203
4. Goods Master Register: https://www.notion.so/36debcf981cf8187a1a2ead1bccd2204
5. Local full review: `wiki/outputs/2026-05-29-qbe-area-05-strategic-planning-risk-full-review.md`
6. Local admin proof: `/admin/deals`, `/admin/production`, `/admin/reports`, `/admin/library`, `/pitch/document`, `/support`

## Exact meeting script

> The diagnostic did not say Goods lacks strategy. It said the strategy is too embedded in founder judgement and needs to be legible to staff, advisors and investors. Since V4, we have the pieces: a working risk register, a cash buffer policy, three scenarios, production/inventory surfaces, pipeline tools and reporting infrastructure. The next step is formalisation. We need a founder-authored one-page strategy narrative, a board/advisory risk register with environmental risk explicit, and scenario response rules that say exactly what changes if capital is late, partial, early, or if demand outruns supply.

## Do not overclaim

- Do not present the current risk register as board-approved.
- Do not call the next plant ready until place-readiness gates are satisfied.
- Do not present community ownership or circular production as complete.
- Do not treat pipeline value as committed revenue or QBE match evidence.
- Do not treat stale admin data as failure; treat it as a control issue to tighten.
- Do not send old pitch risk pages externally without refreshing price, cost, product and finance claims.

## Next build sequence

1. Convert this review into a board/advisory risk register with owners and review dates.
2. Founder-edit the one-page strategy narrative.
3. Create the environmental recycled-plastic risk note.
4. Build the place-readiness checklist.
5. Add LOI tracker and pipeline stale-count review to the weekly operating rhythm.
6. Refresh `/admin/production` inventory and production logs before using them externally.
7. Decide which risk items belong in a public investor pack versus internal governance only.

