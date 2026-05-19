# Goods on Country financial model: scope and build plan

> **Date:** 2026-05-12. **Owner:** Ben (with external accounting/finance support). **Trigger:** SIH Diagnostic Report May 2026, Priority Rec #1 (High, 0–2 months). **Goal:** A defensible, investor-ready, GOC-only financial model carved out from ACT, with explicit unit economics, three-year forecast, scenario planning, and entity-clean books across the emerging Goods Pty Ltd / Butterfly charity / community-led production structure.

## Why this model now

SIH's single most explicit ask:

> "Set up a GOC-only financial model carved out from the wider A Curious Tractor accounts; build a financial model with unit economics, scenarios and a 3-year forecast; cost founder time at fair-market replacement rate within the model."

And the framing line:

> "Founder-authored, concise and accurate documentation supported by a financial model, projections and measurement framework, is the most critical investor-readiness gap."

Without this model:

- We cannot answer SEFA, IBA, or QBE investment-readiness due diligence.
- We cannot run the production-cost sensitivity analysis SIH has offered to support.
- We cannot price the Butterfly charity's role in subsidising community access vs. commercial sales.
- We cannot make rational decisions about plant timing, hiring, or geographic scope.

## The entity picture this model has to represent

The model must work across the structure as it stands today **and** the structure as it transitions through 2026:

| Entity | Role | Books status |
|---|---|---|
| **A Curious Tractor Pty Ltd** | Current trading vehicle (incorporated week of 28 April 2026) | Goods activity inside ACT books under cost code |
| **ACT Foundation (CLG, DGR)** | Historical grant/donor receiver, R&D | Some Goods grants here |
| **Goods on Country Pty Ltd** (proposed) | Future mission-led trading and operating company | Not yet incorporated |
| **The Butterfly Movement Ltd** (proposed) | DGR charity, charitable home for Goods | Existing entity, transition under negotiation |
| **Community-led production entities** | Aboriginal-owned production on Country | Future, hub-and-spoke |

The model is built on a **GOC business unit basis** independent of which legal entity currently houses the activity. It must:

1. Show GOC's unit economics, P&L, cashflow, and balance sheet movements as if it were a standalone enterprise.
2. Map every line to which legal entity it sits in (today vs. target state).
3. Support a "what if we move X into the charity" or "what if community entity Y takes over plant" toggle.

## What the model must contain

### 1. Unit economics (the heart)

Per-product (Stretch Bed first, then washing machine, then fridge concept):

- Bill of materials, by stage (steel, canvas, HDPE feedstock, plastic legs, freight-in)
- Labour by stage (`PRODUCTION_COST_BREAKDOWN` is the starting point but needs validation against actual production runs)
- Overheads allocated per unit at three production volumes (current ~15/month, target 125/month Year 1, scale 417/month Year 3)
- Per-unit margin by customer segment (institutional, council, B2C, lease-to-own washing machine, charity-subsidised access)
- Sensitivity: ±20% labour cost, ±20% materials cost, ±50% production volume

This is also the input to the SIH-supplied Priority Advisory Project on production cost sensitivity at different scales.

### 2. Revenue model by segment

From `v2/src/lib/data/impact-model.ts` REVENUE_SEGMENTS, but tightened to **2–3 core channels with formalised unit economics** (SIH ask, p.7):

| Segment | Customer type | Sales effort | Unit volume | Avg price | Margin | Notes |
|---|---|---|---|---|---|---|
| Institutional | Community-controlled health orgs, ACCHOs, councils, government | High touch, long cycle | 50–200/order | $560 | TBD | 109-bed Centrecorp transaction is the anchor |
| Disaster recovery / NDIS / aged care | Procurement-led | Medium touch | 10–100/order | $560–600 | TBD | NDIS pricing pending |
| Direct retail (B2C / camping / cyclone) | E-commerce, businesses-for-staff | Low touch | 1–5/order | $600 | TBD | Standing inventory required |
| **Charity-subsidised access** (new) | Households via Butterfly Movement Ltd | Donor-funded, recipient pays $0 | Variable | $560 cost | DGR-funded | New line enabled by Butterfly transition |
| Adjacent (agribusiness, refugee, humanitarian) | Optional | TBD | TBD | TBD | TBD | Top-down sized via QBE market scan |

### 3. Cost structure

- Direct cost of production (unit economics × volume)
- **Founder time at fair-market replacement rate** (SIH explicit: even if not actually drawn)
  - Ben: founder/CEO rate, allocate % FTE to GOC vs ACT vs Empathy Ledger
  - Nic: founder/COO rate, same allocation logic
- Future hires per SIH rec on People (p.9):
  - General Manager
  - Business Development / sales operations lead
- Plant capex (containerised production unit cost, lifecycle, depreciation)
- Inventory holding cost (standing inventory is part of the transition plan SIH recommended)
- Marketing, brand, web, freight-out, warranty reserve
- Compliance, insurance, audit, legal (especially Butterfly transition costs)
- R&D (with R&D Tax Incentive offset)

### 4. Cashflow + working capital

Monthly cashflow for 36 months, with:

- **Cashflow buffer policy** (SIH explicit, p.7): minimum N months operating cost in reserve. Recommend 3 months minimum at current burn, 6 months target post-raise.
- Funder timing volatility built in (the report calls this "recent volatility in funder timing" as a real risk)
- Inventory build cycle (cash out before revenue in)
- Plant deployment cashflow (containerised facility timing)

### 5. Capital stack

Aligned with `wiki/articles/capital/capital-stack.md`:

- Grants (philanthropic, government, R&D Tax Incentive)
- **DGR donations via The Butterfly Movement Ltd** (new revenue line enabled by transition)
- Patient / concessional debt (SEFA, IBA, foundation impact loans)
- Catalytic capital (QBE Catalysing Impact $400K match)
- Equity (founder position: not appropriate at this stage except future community equity)

For each instrument:
- Instrument
- Target amount
- Status (committed, in conversation, prospective)
- Use of funds
- Pricing / covenants / mission lock implications

### 6. Three scenarios

SIH wanted "scenario planning for the upcoming raise, tied to operational decisions" (p.7). Three scenarios:

**Base case**: $400K QBE match + 1 SEFA loan + Butterfly donor pipeline activated. Plant 2 deploys Q4 2026. Two priority hires made by Q1 2027.

**Upside**: Above + major philanthropic anchor ($1M+) + government procurement contract signed. Plant 2 + plant 3 deploy. Three priority hires + sales ops infrastructure.

**Downside**: QBE match partially achieved + Butterfly transition delayed. Defer plant 2. Compress geography to current sites only. Hire GM only.

Each scenario must show: cashflow, unit deployment, communities reached, headcount, and the explicit trigger to switch scenarios (e.g. "if cash on hand < $X by month Y, move to downside").

### 7. Three-year forecast

Months 1–36, by entity:
- P&L
- Cashflow
- Balance sheet movement
- Capital stack drawdown schedule
- Key impact metrics tied to financials (beds delivered, machines deployed, communities served)

### 8. The "what is the charity for" page

A clean tab/sheet that answers, in numbers, the question SIH did not yet have: **what does Butterfly Movement Ltd specifically enable financially that A Curious Tractor Pty Ltd cannot?**

- DGR donations (deductible at the donor)
- PAF/PuAF eligibility (see `wiki/articles/capital/paf-puaf-dgr.md`)
- Subsidised-access program (donor pays, recipient pays nothing, charity records the transfer)
- Capability and evidence funding (training, MEL, community readiness)
- Mission-protection guardrails on the trading entity

## What the model is **not**

- Not an accounting system (Xero stays primary).
- Not a community impact register (that lives in `v2/src/lib/data/impact-model.ts`).
- Not a fixed document (it must be live, version-controlled, and updatable).

## Build plan (0–8 weeks)

### Weeks 1–2: Foundation

- Pull historical GOC transactions from Xero (filter by ACT-GD cost code) into a clean P&L
- Stand up a separate workbook (recommend Google Sheets with versioning + named ranges + locked input cells)
- Build the unit economics tab with current production data as the starting reference
- Cost founder time at fair-market replacement rate (Ben + Nic both)

### Weeks 3–4: Forward model

- Revenue model by segment with explicit volume × price × margin
- Cost structure including future hires
- Plant capex schedule
- Cashflow projection (36 months)
- Cashflow buffer policy applied

### Weeks 5–6: Scenarios + capital stack

- Build the three scenarios with toggles
- Capital stack with status of each instrument
- Tie Butterfly transition timing to the model (when does DGR-donation revenue line activate?)
- Sensitivity analysis (the SIH advisory project plugs in here)

### Weeks 7–8: Validation + investor presentation

- External review (PIN advisor, SIH advisor, or independent accountant)
- Tighten one-page model summary for investor pack
- Connect to Theory of Change document (Rec #5 from diagnostic)
- Sign off under [[ai-human-in-loop-policy]]: this model must be defensible in live Q&A by Ben or Nic

## External support needed

- Bookkeeping / accounting carve-out from ACT books (existing ACT-GD cost code is the starting point but needs cleaner separation)
- One financial-modelling advisor: SIH has indicated their Priority Advisory Project can supply this for the production cost piece. Separately, consider engaging a financial-modelling specialist for the broader 3-year forecast.
- Legal review of any model assumptions that depend on the Butterfly transition (Mint Ellison or equivalent)

## Acceptance criteria

This model is complete when:

- [ ] All historical GOC transactions reconciled out of ACT books into a GOC P&L
- [ ] Unit economics validated against actual production runs (not modelled from a meeting note)
- [ ] Founder time costed at fair-market rate, by % FTE allocation per entity
- [ ] Three scenarios with explicit operational triggers
- [ ] 36-month cashflow with cashflow buffer policy applied
- [ ] Capital stack mapped to specific funder conversations
- [ ] Butterfly-enabled revenue and cost lines explicitly modelled
- [ ] Reviewed by external party (SIH advisor + one independent)
- [ ] Ben and Nic can both walk through it in 30 minutes from cold

## Links

- [[../articles/governance/legal-structure]] — current and target entity structure
- [[../articles/capital/capital-stack]] — capital instruments and stack design
- [[../articles/capital/paf-puaf-dgr]] — DGR vehicles for the Butterfly charitable home
- [[../articles/governance/ai-human-in-loop-policy]] — review standard before this model is shared externally
- 2026-05-12-impact-page-audit.md — sibling deliverable, same SIH-driven remediation cycle
- Diagnostic Report May 2026, Section 2 Rec #1 (High, 0–2 months) and Section 4 (Financial Management)
