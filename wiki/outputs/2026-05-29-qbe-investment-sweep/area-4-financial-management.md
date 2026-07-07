# Area 4 — Financial Management

Date: 2026-05-29
Status: Built — needs founder/accountant review before external use
Diagnostic status: Priority gap (since SIH V4)
Notion record: https://www.notion.so/36eebcf981cf8167884fc3d5ecda0e32

## Summary

The diagnostic was right to keep Financial Management as a priority gap, and it still is — but not because no finance work exists. Since the V4 pre-read, Goods has built real workpapers: Xero-linked revenue and expense pulls, a v0.1 financial model (P&L actuals, founder-time sensitivity, revenue segments, unit economics, 36-month cashflow, capital stack, buffer policy, three scenarios), corrected Stretch Bed COGS, trip-level economics, and admin dashboards that make the operating data visible. The honest read for the meeting: we have the evidence and the model trail, but it is still split across ACT, Xero mirrors, wiki pages, Notion and admin screens. The one remaining investor-readiness gap is conversion into a single accountant-reviewed Goods-only financial pack. We will not overclaim audited profitability, self-sufficiency, or committed capital.

## Where we are (progress since the diagnostic)

The diagnostic flagged four things still needed before external use: a Goods-only 3-statement model, founder FTE costing, an accountant-reviewed summary, and a cost ladder.

- **Cost ladder — substantially done.** Direct materials Defy-kit path AU$469.79 (verified/modelled BOM); ~AU$534.79 with assembly + freight; AU$600 fully loaded at low volume (legacy/modelled); AU$275.74 factory-path direct. Website price AU$750 (verified). This is the strongest single deliverable in the area.
- **Revenue/receivables evidence — workpaper, not statements.** Fresh ACT-infra Xero pull (2026-05-29): ACT-GD active receivable invoices AU$732,210.79, of which AU$649,710.79 paid and AU$82,500 due. Top paid: Snow $402,929.79, Centrecorp $123,332, VFFF $50,000, Our Community Shed $20,265, Julalikari $19,800, Red Dust $15,950, QIC $12,000. These are Xero-mirror figures, NOT accountant-reviewed Goods statutory accounts.
- **3-statement model — partial.** v0.1 model trail (Day 2–10) exists; not yet a single Goods-only carve-out workbook with balance sheet / working capital and a signed assumptions tab.
- **Founder FTE costing — modelled, not locked.** AU$140k/year combined mid-case default produced an indicative deficit after founder time; Ben/Nic FTE % still need confirming.
- **Accountant-reviewed summary — not started.** Still the key external-trust gap: carve-out, opening cash, receivables/payables ageing, capex/inventory, R&D, GST, entity coding, and sign-off.

## Priorities (next builds — the gap is collateral and sign-off, not more narrative)

1. **Confirm the two locking inputs:** opening cash at 1 May 2026, and Ben/Nic founder FTE % by month. Without these the model can't close.
2. **Build the Goods-only 3-statement workbook** from the Day 2–10 outputs (P&L, balance sheet/working-capital schedule, 36-month cashflow, scenario tabs, provenance-labelled assumptions, exportable PDF). Reconcile the cost ladder into it: see the reconfigured cost model at `wiki/outputs/2026-05-29-qbe-investment-sweep/01-bed-cost-model-reconfigured.md` (to be authored).
3. **Get accountant/bookkeeper sign-off** on the ACT-GD carve-out, GST, R&D, entity coding, capex/inventory and founder time; produce a 2-page management-accounts summary with a clear "not audited" caveat.
4. **Stand up an operational receivables / use-of-funds tracker** so pipeline and the QBE ask map to real business needs and match evidence.

## Public-copy risk for this area

The Xero workpaper figure (AU$732,210.79 / $649,710.79 paid) must never be presented as audited Goods revenue. Quarantine stale finance claims until reconciled: the AU$778,162 grant-content boilerplate, the AU$445K "grant funding to date" copy, the AU$405,685 source-trail subtotal, and any margin claim built on materials-only COGS. v2 `orders` totals (AU$90 live) are not sales proof. CRM pipeline (AU$3.42M active / $604,040 weighted) is internal only — not committed capital or QBE match evidence.

## Proof links

- Area 04 Notion page: https://www.notion.so/36eebcf981cf8167884fc3d5ecda0e32
- QBE Documentation Readiness Deep Dive: https://www.notion.so/36debcf981cf818e968de440ad7b9203
- Goods Cost Register (Notion): https://www.notion.so/354ebcf981cf8156bebbf2851ecba5e6
- Goods Capital Stack (Notion): https://www.notion.so/355ebcf981cf8129ac06ff254b562a3f
- Full internal review: `wiki/outputs/2026-05-29-qbe-area-04-financial-management-full-review.md`
- Canonical numbers sheet: `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md`
- Bed COGS reconciliation: `wiki/outputs/2026-05-28-bed-cogs-xero-reconciliation.md`
- Financial model Day 2–10: `wiki/outputs/2026-05-12-financial-model-day*.md`
- Utopia trip cost workpaper: `wiki/outputs/2026-05-28-utopia-trip-cost-vs-centrecorp.md`
- Cost truth in code: `v2/src/lib/data/supplier-quotes.ts`
- Admin proof (local): `/admin/xero-reconciliation`, `/admin/cost-model`, `/admin/production`, `/admin/trip-receipts`, `/admin/reports`, `/admin/funders`
