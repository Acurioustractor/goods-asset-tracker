# Live finance sheet, 10 September 2026

Working surface: https://docs.google.com/spreadsheets/d/1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y/edit#gid=100

Ben confirmed the purpose: team working sheet plus funder cheat sheet.

The existing Google Sheet now has fifteen populated tabs. Its original empty Sheet1 is hidden.
The Google Drive batch_update_spreadsheet connector worked. No service-account key or new sharing permission was needed.

## What responds to edits

- Inputs drives One bed, Capacity, Impact, the conditional bed allocation in Asks and the Cheat sheet.
- Monthly cash contains 36 months from the recalculated master's Full case, beginning December 2026. Yellow cash amounts can be edited. Totals and Cash by year recalculate.
- Actual receipts and payments are entered by month. Actual net and variance remain blank until both amounts are supplied.
- Opening cash remains blank. Closing cash stays blank until an opening balance is entered.
- Cases, Responsibilities, The year and Sites retain dated master snapshots and are explicitly labelled as such.

This is a working review sheet. It is not yet a fully integrated production, stock, grant-tranche and accounting model. Production inputs do not alter the monthly cash amounts. Loan amounts and loan service in Monthly cash are independent inputs; changing a loan requires updating both against an agreed schedule. There is no automatic Xero import or page synchronisation.

## Verification

Recalculated a temporary copy of Goods-financial-plan.xlsx with LibreOffice. Preserved the original.
Native Sheets annual cash totals match the recalculated master: Year 1 receipts $700,000, payments $810,607.21 and movement negative $110,607.21. These include possible funding.
No formula errors were returned across the populated ranges.
Changing price from $750 to $800 changed contribution from $474.26 to $524.26.
Reducing the first possible grant receipt by $1,000 reduced annual cash movement by $1,000.
Both temporary changes were restored and the cash baseline re-read.
The prose checker returned zero errors and four warnings, all ordinary lists.
Google browser access required sign-in. Native visual layout is unverified; connector formatting was inspected.

## Findings that need attention before finalisation

1. The handoff's citation of NM Play B21 for 36kg is wrong. The recalculated master has 10 there, on a net-per-sheet basis. The recorded gross production input is 36kg: 21kg leg sheet plus 15kg tab sheet. These definitions must stay distinct.
2. The NM itemised calculation gives $275.74 after adding a $40 assembly line. The handoff also describes $80 of wages inside making. Similar totals do not establish the same wage treatment. Reconcile against canon before linking this calculation to production cash.
3. The conditional remaining target is 54 whole beds. At $750 that is $40,500. The two 133-bed allocations each leave $250 from $100,000, so a pooled cash-gap reading is $40,000 if those balances can be used. The sheet preserves whole-bed allocations and states the rounding.
4. Opening balances, site-specific quotes and the funding timing remain unresolved. Historical receipts do not establish future funding.

## Next work

Reconcile the unit-cost and wage basis, then connect stock consumption and production purchases to the cash forecast. Connect named funder tranches and dates to monthly receipts. Add source-referenced actuals with a bank reconciliation and agreed GST treatment. Sweep current pages and master decision conflicts after the basis is settled. The published Claude pages were not updated in this session.

The adjacent JSON is an initial content snapshot for audit. Do not upload it over later user edits. Re-read the live sheet before making further changes.
No commits or pushes were made.
