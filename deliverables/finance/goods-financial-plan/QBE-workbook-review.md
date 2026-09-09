# Goods financial workbook: QBE review and recommended build

8 September 2026. Review of **GOC Bed Unit-Costing Model v2 — working original.xlsx**, the earlier **v2 (5)** workbook, the maintained **Goods-financial-plan.xlsx**, and the supplied final application form.

## Finding

Consolidate the calculation model before adding more summaries. The original contains useful work, but its 27 tabs contain several different planning models. A changed production assumption does not consistently reach the entity statements, phase cash flow and funding comparison. Correct individual formulas cannot resolve different definitions of the costs and activities being funded.

The latest original retains the financial assumptions in the previous upload: comparison of the 13 shared sheets found only one changed cell, NM Play A6, renamed from “HDPE plastic (legs)” to “Bed Kit - HDPE Parts”. The additional sheets therefore extend the model rather than replacing those assumptions. No stored Excel error cells were found. This was a structure, source and selected dependency review, not a recalculation audit of every formula or accounting certification. Neither uploaded workbook was changed.

## What needs correcting

| Issue | Evidence in the original | Required treatment |
|---|---|---|
| Different production rates | Making plan B39:B41 calculates 3 own-sheet HDPE sets/day; Sites H6:H8 assumes 4 beds/day; Inputs B42:B46 uses annual volumes and utilisation | One process-capacity calculation, then separate final assembly, quality, purchased-part and staffed-capacity limits. A set of HDPE parts is not a finished bed. |
| Different plastic quantities | Making plan requires two 20 kg sheets per own-sheet bed; Inputs C6 costs 20 kg of plastic per bed | Reconcile gross sheet consumption, usable yield, scrap and final product mass. Do not change the impact claim to 40 kg simply because the process consumes two sheets. |
| Labour and rent can be counted twice | Making plan B24 includes $700/day crew, consumables and rent; B26 includes $40 assembly; Inputs (1) carries annual site management, training and rent | Identify each role and cost once. Allocate it to product making, shared Goods work or community support. Document whether assembly is additional to the crew. |
| Unit costs mean different things | Inputs B13:D13: $684.79/$425.74/$420.74 with labour and freight. Inputs (1) B28:C28: $295.74/$190.74 before annual site costs. Making plan B53: approximately $535.74 own-sheet, before freight | Keep a component bridge. Never compare these as equivalent delivered costs or call the difference a saving. |
| Three facility budgets | Sites uses $113,000 replication or $207,450 turnkey per facility; the maintained plan uses Ben’s later $300,000 combined allowance for two new facilities | Keep the $300,000 current allowance with the quote alternatives underneath. Allocate the allowance to equipment, freight, installation, training and contingency once. |
| Smaller grant has no smaller programme | Overview A27:H30 changes grant amounts while cost, capital and beds remain identical | Add an explicit smaller delivery case with retained activities, deferred activities, dates and costs. Reducing a funding number alone answers affordability, not Q7. |
| Multiple demand scenarios | Making plan uses a 1,000-bed regional target, a separate 523-bed batch and alternative locality ideas; the funding plan uses 400 beds | Select one case and retain the others as alternatives. None becomes an order without an evidenced request. |
| Old funding mechanics remain | Inputs B48:B51 and Inputs (1) G32:G35 retain assumed matching capital | The supplied form asks for catalytic effect. Remove automatic matching from the active model. Record individual funder conditions. |
| Accounting placeholders look usable | Inputs (1) B6 has $50,000 opening cash, B7 has an old $82,500 receivable, B52 has a 25% company-tax assumption | Import reconciled opening balances for the correct entity. Confirm tax and recognition policy. Do not carry these placeholders into current available cash or solvency statements. |
| Open Items includes settled or superseded questions | Founder provision is already $151,200; row 33 still describes ACT Pty Ltd as the future trading home; row 13 refers to an older $300,000 Sefa scenario | Retain the founder provision, use the charity operating arrangement already confirmed, and link the current proposed $200,000 loan terms. Separate completed decisions from genuinely missing evidence. |

## What QBE needs from the model

| Form | Output to prepare | Calculation or evidence required |
|---|---|---|
| Q1–4, Q8 | Applicant, related entities, directors and delivery responsibilities | The Butterfly Movement Ltd trading as Goods on Country is the intended applicant and operating home. List actual transfer dates, assets, contracts and obligations separately. A model cannot establish that a transfer is complete. |
| Q5 | One request | Sum of selected QBE allocations to eligible cost lines. The current $250,000 working request remains a recommendation until approved. |
| Q6 | Specific use of funds | Activity, quantity, timing, responsible entity, total cost, QBE share, other funding and measurable delivery. The QBE allocation must reconcile exactly to Q5. |
| Q7 | Smaller amount and viable delivery | Use $150,000 as the current working smaller case. Specify what continues and what moves later. Do not assume grant size and output scale proportionally. |
| Q9–11 | Expected impact and achieved impact | Link forecast beds, programmes and paid work to the plan. Keep actual delivery, reported experience and measured material records separate. Health evidence explains the need; it is not a claimed Goods health result. |
| Q12–13 | Missing governance explanation and legal declaration | Document status and human responses, not spreadsheet inference. |
| Q14–18 | Funding table and catalytic explanation | Funder, recipient, instrument, amount, evidence stage, conditions, payment timing and QBE dependency. Preserve invitation, EOI, LOI, signed commitment and receipt as different states. Contacts and permission require human confirmation. |
| Q19 | Ability to deliver and absorb funding | Staffed capacity, site authority, procurement lead times, accountable owners, monthly cash need and reporting process. |
| Q20–21 | Applicant P&L, balance sheet and cash flow, with explanations of gaps | Historical management or annual accounts are accepted by the supplied form; an audit is not required. The project forecast supports the application but does not replace the requested financial statements. Keep historical ACT Goods trade and Butterfly accounts attributed to their actual entities. |
| Q22–23 | Governance documents, deck and model | A concise funder view generated from the same approved figures. Keep the private transaction detail outside the submission extract. |
| Q24–25 | Solvency and accuracy declarations | Human declarations following review of current accounts and obligations. Do not generate a declaration from a positive forecast. |

## Recommended workbook

Use **one maintained Excel workbook** with the following working tabs. Retain the originals unchanged as source files; archive superseded calculation tabs when migration is verified. This is a proposed consolidation, not another set of parallel live models.

| Tab | What people enter | What formulas produce |
|---|---|---|
| Start | Owner, version, forecast period and selected case | Main costs, cash need, delivery, QBE request and unresolved inputs |
| Assumptions | One copy of rates, quantities, units, source, source date and decision status | Shared rates used everywhere |
| Sites and delivery | Stable site/activity IDs, start dates, capacity, target allocations, delivery channel and responsible partner | Production, delivery, stock and undelivered targets by month |
| Costs | One row per cost: ID, cost centre, site, role/component, quantity, rate, timing and scope | Monthly operating costs, capital and programme totals |
| Funding | One row per funding tranche, recipient, instrument, evidence, conditions, receipt date and restrictions | Secured cash and separately selected possible receipts |
| Scenarios | Full, smaller, no QBE, delayed receipts and lower sales; only the inputs that differ | Comparable scope, costs, cash gaps and debt balances |
| Monthly forecast | Approved opening balances and clearly identified accounting assumptions | One monthly calculation schedule feeding cash, annual P&L and balance-sheet forecasts |
| Actuals | Reconciled monthly balances/imports, entity and source IDs | Actual-versus-budget results and historical statement summaries |
| QBE | Cost-line allocations, short activity descriptions and attachment references | Q5–8 funding tables and Q14–19 summaries linked to the model |
| Evidence and decisions | Missing input, owner, next action, evidence reference, decision and date | Filterable action list; actual impact evidence kept distinct from planned delivery |

Start with twelve monthly forecast periods and annual Years 2–3. Extend the horizon only where the programme or loan requires it. Use actual calendar dates once agreed, and retain relative month numbers for early planning. Do not default an unknown opening bank balance to zero.

## Formula connections

Use Excel Tables with stable IDs for expandable records. Use short formulas and helper columns instead of long nested formulas. The following is the calculation contract; it is not yet implemented in a consolidated workbook.

1. **Capacity:** press sheets/day ÷ sheets/bed; shared CNC days/bed = tab-sheet requirement ÷ tab cutting rate + leg-sheet requirement ÷ leg cutting rate. The lower process capacity then meets available staff, assembly, QA and purchased-part limits.
2. **Stock:** opening finished stock + accepted production − Goods buyer deliveries − grant/community deliveries = closing finished stock. Reject negative stock. Track material stock separately from finished beds.
3. **Cost:** known quantity × known unit rate. If either is unknown, leave the line total blank and identify the missing input. Priced subtotal and complete budget must be different outputs.
4. **Shared cost:** total payroll/lease cost is entered once, with allocations that reconcile to 100%. Avoid adding per-bed crew costs to the same annual payroll provision.
5. **Revenue and receipts:** Goods invoices follow Goods sales, and collections follow payment timing. Community resale proceeds remain outside Goods revenue and debt repayment capacity.
6. **Funding:** each tranche has one source ID and one receipt schedule. A signed conditional award with unmet release conditions must not appear as available cash. Possible funding is a separate scenario. Do not count the same grant in both columns when its status changes.
7. **Debt:** closing debt = opening debt + draws − principal repayments. Interest enters the P&L and cash flow; principal enters financing cash flow and reduces the liability. Fees and repayment dates require explicit inputs.
8. **Statements:** annual totals reference the monthly schedule. Capex enters asset and cash schedules, depreciation enters the P&L, and receivables/payables bridge accruals to cash. Opening assets, liabilities, restricted grants, tax and GST need confirmed treatments.
9. **QBE:** sum allocations by cost ID and scenario. Allocation must equal the requested grant and must not exceed the cost line or duplicate another funder’s allocation.
10. **Controls:** monthly cash roll-forward, debt roll-forward, stock roll-forward, balance-sheet balance, allocation totals, missing prices, duplicate IDs and dated receipts outside the forecast horizon.

## Research applied to sharing and maintenance

[ICAEW’s spreadsheet principles](https://www.icaew.com/technical/technology/excel-community/20-principles-for-good-spreadsheet-practice-2024-edition) support a clear inputs/calculations/outputs flow, entering each input once, reusing calculated results, simple formulas, built-in checks and version control. Those principles directly address the workbook’s parallel-model problem.

[Microsoft’s structured-reference documentation](https://support.microsoft.com/en-us/excel/using-structured-references-with-excel-tables) explains how table references adjust as rows are added or removed. Use this for costs, funding and delivery records so a new line reaches summaries without manually extending many formulas.

[Microsoft’s co-authoring guidance](https://support.microsoft.com/en-us/excel/get-started/collaborate-on-excel-workbooks-at-the-same-time-with-co-authoring) supports one workbook in OneDrive or SharePoint Online, with supported Excel clients, AutoSave and version history. This is the recommended sharing setup for an Excel master. Uploading and setting access have not been performed. If the team chooses Google Sheets instead, migrate once and test the formulas there before making it the master; avoid maintaining two editable masters.

Use blue editable inputs, visible source/status columns, frozen headers and filters. Protect calculated ranges against accidental editing. Give collaborators access appropriate to their role. Produce a dated QBE extract from the master for submission; the private workbook includes historical transaction detail that is unnecessary for ordinary shared planning.

## Build order and acceptance tests

1. Carry forward the already supplied founder, central-cost, capital and loan assumptions. Replace obsolete open questions with the current decision and evidence still required.
2. Resolve the cost-component crosswalk: production crew, assembly, rent, founder allocation, freight, plastic consumption/yield and accounting overlap. Keep uncertain lines explicit rather than inventing a reconciled number.
3. Consolidate sites, production and delivery. Preserve useful NM process calculations while removing independent capacity assumptions from downstream outputs.
4. Connect one cost and funding schedule to monthly cash, then connect annual forecast statements. Import actual opening balances separately.
5. Define a smaller viable programme and connect QBE allocations and evidence references. Keep proposed site authority and partners unconfirmed until evidenced.
6. Test representative edits: founder pay +$12,000; new site delayed three months; throughput reduced; one youth programme added; QBE reduced from $250,000 to $150,000; BMD condition unmet; receipts delayed beyond the horizon; sales below plan; loan draw delayed; funding changed from possible to signed. Check every affected cost, delivery, debt, cash and QBE output.
7. Compare historical/source sheets before and after migration. Check all new formula errors and visually inspect the working tabs. Only then designate the consolidated workbook as the shared master.

The immediate missing decisions are the component cost boundary, smaller delivery scope, youth programme count and accountable site arrangements. Reconciled opening balances, accounting policies and transfer evidence are needed for the financial statements. These are different workstreams: historical payroll reconciliation need not stop forward programme planning.


## Implementation completed — 8 September 2026

The consolidated Goods-financial-plan.xlsx now implements the review: one assumptions layer, an active NM Play process model, site-based production/material schedules, costs and capital, tranche funding, five cases, a 36-month forecast, linked statements/QBE views, community sales, actuals and evidence tracking. All 27 original tabs have an explicit Source map destination and preserved cell records. The preceding master is archived; four historical account tabs retain their values and formulas.

The full priced spending subtotal is now $1,374,546, with eight unpriced inputs and unresolved scope. This supersedes the earlier $1,323,546 scenario for this working calculation, not as an approved raise. Twenty-two behavioural recalculation checks and cash/debt/material reconciliations passed; formula inspection found no errors. See README.md for editing instructions and remaining limits.
