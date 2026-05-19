# Financial model Week 1-2 kickoff: operational checklist

> **Date:** 2026-05-12. **Owner:** Ben. **Supports:** [[2026-05-12-financial-model-scope]] (the full 8-week build plan). **Goal:** Concrete checklist for the first 14 days so the SIH Priority Rec #1 (HIGH, 0-2mo) is in motion this week, not next month.

## Pre-flight checklist (do these first, 30 minutes)

- [ ] Open a fresh Google Sheets workbook: **"GOC Financial Model 2026"** in a Goods on Country shared drive
- [ ] Set sharing: Ben + Nic + (when engaged) external accountant + SIH advisor + PIN advisor. View-only for everyone else.
- [ ] Version control: enable version history; rename current version "v0.1 kickoff"
- [ ] Create tabs in this order (empty for now): `README`, `Assumptions`, `Founder time`, `Unit econ - Bed`, `Unit econ - Washer`, `Revenue by segment`, `Cost structure`, `Capex schedule`, `Cashflow 36mo`, `Capital stack`, `Scenarios`, `Butterfly impact`, `P&L summary`, `Glossary`
- [ ] On `README` tab: paste the scope link `wiki/outputs/2026-05-12-financial-model-scope.md` and the AI-in-loop policy link. Add the rule: "No external sharing of this workbook without Ben sign-off per AI-in-loop policy."

## Week 1: Foundation (5 working days)

### Day 1: Xero extraction

- [ ] Log into Xero. Locate the **ACT-GD cost code** (Goods on Country project tag inside A Curious Tractor books). Per memory: this is where Goods activity has been tracked inside ACT.
- [ ] Export FY24, FY25, FY26 YTD transactions tagged ACT-GD as CSV. Three files: income, expenses, capital movements.
- [ ] Cross-check totals against the two known anchors:
  - Cumulative GOC revenue $537,595 (SIH diagnostic, p.1, "to date")
  - Annual trade revenue $239,273 (March 2026 Xero snapshot, from `v2/src/lib/data/impact-model.ts` revenue metric)
- [ ] If totals do not match: investigate before proceeding. Likely sources of mismatch: grant income vs trade income classification, R&D Tax Incentive offsets, R&D refunds, contractor distributions paid out, ACT cross-subsidies.
- [ ] Document the reconciliation in a Loom or short note on the `README` tab. This becomes the audit trail.

### Day 2: P&L summary v0.1

- [ ] On `P&L summary` tab, lay out monthly columns for the last 12 months (May 2025 to April 2026) and quarterly columns for Q1 2026 and forward placeholders for Q2-Q4 2026.
- [ ] Rows:
  - Revenue: grant income (philanthropic), grant income (government), trade revenue (B2B), trade revenue (B2C), R&D refund, other
  - Direct costs: materials, freight, plant operating, contractor production labour
  - Gross margin (computed)
  - Operating costs: founder time (cost basis, see Day 3), other staff, professional services (legal, accounting, audit), marketing/brand, IT/web, travel, insurance, other
  - EBIT (computed)
  - Capital movements: plant capex, inventory build, R&D investment
  - Net cashflow (computed)
- [ ] Populate from Xero export. Empty rows stay empty for now, don't fabricate.

### Day 3: Founder time costing

This is the SIH explicit ask. Without this the model is not investor-ready.

- [ ] On `Founder time` tab:
  - Row 1: Ben Knight. FTE allocation: GOC ___%, ACT (other) ___%, Empathy Ledger ___%, total = 100%. Fair-market replacement rate: $___ /year for an equivalent founder-CEO at this stage.
  - Row 2: Nick Marchesi. FTE allocation: GOC ___%, ACT (other) ___%, total = 100%. Fair-market replacement rate: $___ /year.
- [ ] Sources for replacement rate:
  - For-profit equivalent: tech founder-CEO at seed stage, AU market: ~$120-180K base
  - Social enterprise equivalent: senior Australian charity ED, AU: ~$120-160K base
  - **Recommend $140K/year as a defensible midpoint** but cite the source.
- [ ] Compute monthly cost for each founder = (replacement rate / 12) × GOC FTE %. Feed this number into the `P&L summary` operating-cost row for founder time.
- [ ] Flag clearly that this is a notional cost, not a cash drawing, until Ben actually draws salary. The model represents the "what would this cost a third party to run" view.

### Day 4: Unit economics for Stretch Bed v0.1

- [ ] On `Unit econ - Bed` tab, start from the existing model in `v2/src/lib/data/impact-model.ts` PRODUCTION_COST_BREAKDOWN. Reference it, do not just copy it.
- [ ] Lay out the 8 stages as rows (Plastic collection, Shred/pelletise, Sheet press, CNC, Canvas/steel prep, Assembly/QC, Materials, Freight). Columns: hours, hourly rate, labour cost, materials cost, total cost per unit.
- [ ] Add three volume scenarios as columns:
  - **Current** (~15 beds/month, campaign-based): use current numbers
  - **Year 1 target** (~125 beds/month, 1500/year)
  - **Year 3 target** (~417 beds/month, 5000/year)
- [ ] At each scenario, sensitivity: ±20% labour cost, ±20% materials cost. (8 cells per stage × 3 scenarios = workable manually for v0.1.)
- [ ] **Flag everything as MODELLED** in the tab header. Same provenance discipline as the /impact page rewrite.
- [ ] Park the sensitivity-at-scale deep-dive: that is the SIH Priority Advisory Project deliverable.

### Day 5: Revenue model v0.1

- [ ] On `Revenue by segment` tab, lay out the segments from [[2026-05-12-financial-model-scope]]:
  - Institutional (community-controlled health, ACCHOs, councils, government)
  - Disaster recovery / NDIS / aged care
  - Direct retail (B2C / camping / cyclone / sponsored)
  - Charity-subsidised access (via Butterfly)
  - Adjacent markets (placeholder, to be filled by QBE volunteer market scan)
- [ ] Per segment, columns: unit volume Year 1 / Year 3 / Vision 2030, average price, gross margin %, sales effort (high/medium/low), evidence base (current LOIs, prior transactions, prospect conversations).
- [ ] Anchor the Year 1 institutional column on the **Centrecorp 109-bed transaction** as the verified data point.
- [ ] Everything else is a forecast: label appropriately.

## Week 2: Forward model (5 working days)

### Day 6: 36-month cashflow shell

- [ ] On `Cashflow 36mo` tab, lay out 36 monthly columns (May 2026 through April 2029).
- [ ] Rows: opening cash, cash inflows (by source: trade revenue, grant inflow, DGR donation inflow via Butterfly, R&D refund, loan drawdown), cash outflows (by category from the P&L), closing cash.
- [ ] Pull projected revenue from `Revenue by segment` and projected costs from `Cost structure` and `Capex schedule`.

### Day 7: Cashflow buffer policy

- [ ] On `Assumptions` tab, document the cashflow buffer policy:
  - Minimum: 3 months operating cost in reserve (current burn rate)
  - Target: 6 months operating cost in reserve (post-raise)
  - Action triggers: if cash falls below minimum, defer plant build / pause hiring / accelerate revenue conversations
- [ ] On `Cashflow 36mo`, add a row computing months-of-runway at each point. Conditional formatting: red below 3 months, amber 3-6 months, green above 6.

### Day 8: Capital stack v0.1

- [ ] On `Capital stack` tab, list every funder conversation by instrument:
  - Grants (philanthropic, government): per-funder name, amount, status (committed/in convo/prospective), expected date, use of funds
  - R&D Tax Incentive: forecast refund amount and timing
  - **Butterfly DGR donations** (new line): prospect funders, expected timing dependent on Butterfly transition completion
  - Patient/concessional debt: SEFA, IBA, foundation impact loans (with names, status)
  - Catalytic capital: QBE Catalysing Impact $400K match
  - Equity: not appropriate this stage (per founder position)
- [ ] Cross-reference against [[../articles/capital/capital-stack]].

### Day 9: Three scenarios

- [ ] On `Scenarios` tab, lay out three columns: **Base**, **Upside**, **Downside**.
- [ ] Per scenario, document:
  - QBE match achievement ($400K full / $200K partial / $0)
  - Butterfly transition completion (Q3 2026 / Q4 2026 / not in window)
  - Plant 2 deployment (Q4 2026 / Q1 2027 / deferred)
  - Hires made (GM + BD / GM only / no new hires)
  - Geographic scope (current sites + 2 new / current + 1 / current only)
  - Revenue forecast (% of base case)
- [ ] Define the **trigger condition** for moving between scenarios (e.g. "if QBE match closes below $200K by 31 August, move to downside scenario").

### Day 10: Butterfly impact tab

This is the new analytical work the SIH diagnostic did not yet have.

- [ ] On `Butterfly impact` tab, model what changes financially with the Butterfly transition vs without it.
- [ ] **Revenue lines enabled:**
  - DGR donations (deductible at donor; PAF/PuAF eligible)
  - Subsidised-access program (donor pays, recipient pays $0)
  - Capability funding (training, MEL, community readiness funded from charity)
- [ ] **Cost lines shifted:**
  - Some compliance and governance costs sit in Butterfly, not Pty Ltd
  - Training, MEL, evidence work moves to Butterfly
- [ ] **Net effect:** Show two side-by-side P&L summaries (Goods Pty Ltd standalone vs Goods Pty Ltd + Butterfly combined) so the question "what does the charity unlock" has a number, not a story.

## Acceptance criteria for Week 1-2

By end of Week 2 (Friday 2026-05-23):

- [ ] Workbook stood up with all 14 tabs
- [ ] Xero extraction reconciled against the $537,595 cumulative + $239,273 trade revenue anchors
- [ ] P&L summary v0.1 populated from Xero, last 12 months actuals
- [ ] Founder time costed at fair-market rate for both Ben and Nick
- [ ] Unit economics v0.1 with current/Y1/Y3 scenarios
- [ ] Revenue model v0.1 with five segments scoped
- [ ] 36-month cashflow shell, cashflow buffer policy applied
- [ ] Capital stack with named conversations and statuses
- [ ] Three scenarios with explicit triggers
- [ ] Butterfly impact tab with side-by-side comparison
- [ ] Ben has walked through the workbook end-to-end and can defend each number's provenance

This makes the SIH advisory project (Weeks 5-6 in the full scope) able to plug into a real foundation, rather than starting from scratch.

## Risks / things that will stall this if not handled early

1. **Xero export gaps.** If transactions are not consistently tagged ACT-GD, reconciliation will fail. Mitigation: do Day 1 first; if the gap is too large, engage bookkeeper for retroactive tagging before continuing.
2. **Founder time becoming an argument.** Two co-founders, two opinions on FTE %. Mitigation: agree the principle (fair-market replacement, not a wage drawing) before the number; the principle ends the argument.
3. **Unit economics changing under us.** The SIH advisory project will validate at scale, which may show our current numbers are off. Mitigation: tag everything MODELLED, treat the SIH project output as v0.2 inputs, not a v0.1 blocker.
4. **Butterfly transition timing uncertainty.** Charity transition may take 30-90 days through ACNC/ASIC due diligence. Mitigation: build the Butterfly tab with both "transition complete Q3" and "transition complete Q4" scenarios.

## Who can help (engage this week, optional)

- **External bookkeeper / accountant**: ACT-GD cost code clean-up and Xero export. Engage if Day 1 reconciliation fails.
- **SIH Priority Advisory Project**: production cost sensitivity (Weeks 5-6 input). Accept formally this week.
- **PIN volunteer modeller**: if SIH or another channel can supply one, plug into Days 6-10. Otherwise Ben does it.
- **Mint Ellison**: scope Butterfly transition due diligence in parallel; outputs feed the Capital stack and Butterfly impact tabs.

## Cross-references

- [[2026-05-12-financial-model-scope]] — the full 8-week build plan
- [[2026-05-12-impact-page-audit]] — the provenance discipline that applies here too
- [[../articles/governance/ai-human-in-loop-policy]] — review standard before any external sharing
- [[../articles/capital/capital-stack]] — capital instruments catalogue
- [[2026-05-12-qbe-prep-resume]] — this is action #23 in the QBE action stack
- `v2/src/lib/data/impact-model.ts` — current unit-economics starting point (now tagged MODELLED)
- `v2/src/lib/data/compendium.ts` — funding records starting point
