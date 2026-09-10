# Production tracker, 10 September 2026

Live sheet: https://docs.google.com/spreadsheets/d/1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y/edit#gid=140

Home (140), Calculator (142) and Charts (141) are now the first tabs. Home provides site and month controls, stock and production cards, a stock chart and links to entry tables. The former The plant tab is preserved as Production detail (130). Its site and month follow Home C7 and G7. Plant budget and Capacity basis retain the previous module and throughput calculations.

Stock counts, Production log and Cost log use native Sheets tables, typed columns and filter menus. Supporting notes are collapsed behind column groups. Capacity has its advanced conversion assumptions grouped. Blank counts and absent records remain explicit unknown states.

Calculator is an independent scenario page with editable batch size, process rates, availability, costs and a second-press checkbox. It calculates throughput, batch time, labour, shred and costs without changing the actual site capacity. Charts shows counted stock, process capacity, recorded production against capacity, and recorded Goods production payments. Recorded zero can mean no entries; it is not proof of no activity or expense.

Redesign verification: 16 assertions passed in a separate copy, subsequently deleted. Checks covered September/October boundaries, Goods versus Community payer, production versus capital cost, Paid versus Committed, second-press capacity, availability, cost sensitivity and unknown site data. Live formulas had no errors in the checked ranges and source stock cells matched their pre-edit values. Home, Calculator, chart rendering and native entry tables were visually checked. Original workbooks remain unchanged.

## Update routine

1. Add a dated 15-item block in Stock counts. Copy the previous block, change its date and replace each quantity. Leave unknown quantities blank. The plant reads the latest count date for the selected site up to the selected month's end. It never carries a missing component forward from an older count.
2. Add one row per day and site to Production log, including zero-output days. Record completed, quality-checked beds, run days, paid person-hours and dispatches.
3. Add actual payments, estimates and commitments to Cost log. Change a committed row to Paid once. Separate Goods and Community payers. Negative values support refunds.
4. Select the site and starting month on Home. The charts show twelve months from that month. Chart zero means no amount recorded. Main totals remain blank when records are absent.
5. Use Capacity for local rosters, availability, equipment rates, capital spending, running budgets, partner authority and establishment evidence.

Stock is a dated physical snapshot. Dispatches and later production are logged separately; reconcile them before allocating stock. The tracker does not silently estimate current stock from incomplete movement records.

## Count and physical basis

Sources: DEFY-ORDERS-2026-09-09.md and Goods-financial-plan.xlsx, Bed calculator, Sites and Phase and raise. The original workbook is unchanged.

The 9 September count carries 650 provisional leg pieces, 812 provisional tab pieces, 59 uncut tab sheets, 145 kg weighed shred, 27 vacuum buckets, 30 press offcut sheets and 32 CNC skeletons. Finished beds, reserved beds, remaining bulka shred, canvas, poles and hardware remain unknown. The workbook's zero placeholders for uncounted items were not imported as actual zero counts.

The source conversions give 81 cut plastic bed sets, 87 potential plastic sets using weighed shred, and 143 with estimated recoverable material. The 143 calculation includes estimated weights of 18 kg per bucket, 16 kg per offcut sheet and 6 kg per skeleton. Treat each as an alternative total. Canvas, poles and hardware constrain complete kits separately.

145 / 21 gives six full extra leg sheets on a first pass. The original narrative's seven is approximate. Offcuts return to the shredder. Gross press input is 36 kg per bed; net new input with the loop running is 20 kg. Tab mass and shredder throughput still need measurement.

The next three-bag scenario is 1,800 kg at $1.80 = $3,240 ex GST or $3,564 incl GST, before freight and fees. The order remains a planning recommendation.

## Costs and new facilities

Production spend includes recorded Goods payments for materials, labour, energy and consumables. Spend per completed bed is a cash ratio, not cost of goods sold or margin. Purchasing timing affects it. Site running, delivery, capital and Community payments remain distinct.

These logs do not post into Monthly cash. Reconcile invoice and payment records there once to avoid double counting. No Xero connection or historical payment import was added.

HARVEST is the current facility; NEW1 and NEW2 are proposals. Their shared starting rates can be overridden locally. Availability, opening dates, local budgets and readiness evidence remain blank. The 400-bed first-stock target remains distinct from the inherited 200-bed new-facility ramp scenarios.

A second-press scenario doubles press sheets to 12/day. With CNC at 8.56 and assembly at 5, the modelled limit becomes 5 beds/day, or 100/month at 20 days and full availability. Staffing, power, cooling and recycling still need verification.

## Verification

Native formulas reproduce 81 / 87 / 143 from the source count. No errors appeared in the changed live ranges or the sampled One bed and Monthly cash dependencies.

Automatic approval review rejected temporary fixtures in the live sheet because they could distort live financial totals. No fixture entered the live model. Tests instead ran in a separate explicitly named verification copy, which was deleted after verification.

Sixteen checks passed for count selection, complete kits, 80% availability, month boundaries, production spending, cash ratio, capital paid and committed, and payer separation. Adding 600 kg to the copied stock count changed weighed-material potential to 116 and the recovery scenario to 160, constrained by tabs. A duplicate production date and incomplete cost record blanked affected totals and displayed the entry issue counts.

The live production and cost logs remain blank. The current count is the 9 September source count. No commits or pushes were made.



## Management preview and leg sheets

An interactive Overview mockup is saved at /Users/benknight/.codex/visualizations/2026/09/09/01a08887-70c2-7333-b9a2-0cc7940a885e/goods-management-overview.html. It is a snapshot preview, not a live application. It shows proposed actions with owner and date unassigned, explicit unknowns, and links to the existing workbook.

Ben confirmed zero uncut leg sheets on 10 September. This is a separately dated addition to the 9 September stock snapshot. Include uncut leg sheets in future full counts.


## Live management Home

The management Overview is now implemented directly in Home (gid 140). C7 and G7 remain the site and month controls. Linked KPI summaries and four record-dependent action statuses sit above production plan comparisons and the stock chart. F20:G23 holds editable action owners and due dates; these are workbook-wide action assignments, not per-site records. Existing stock and production tables are preserved. Uncut leg sheets remains confirmed zero.

The production log currently contains a partial HARVEST entry without its date or quantities. Home correctly displays Check entries; no user-entered record was removed or completed by inference.


## Workbook alignment

All 30 visible tabs now share formatting and navigation. Money and Stock plan provide linked reading views; Read me links to every tab. Four additional native tables and three new charts were added. Fourteen behavioural tests passed in a separate copy and all primary tab views were checked in native Sheets. See ../workbook-alignment-2026-09-10/README.md for verification and the preserved backup. Production logs still do not post into Monthly cash.
