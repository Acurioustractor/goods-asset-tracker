# Utopia + Alice Springs trip — real cost vs Centrecorp 107-bed invoice

**Date:** 2026-05-28 (bank data synced live this session)
**Trip:** Central Australia (Alice Springs + Utopia Homelands), ~17–22 May 2026. 107 Stretch Beds (batch GB0-156).
**Cost basis:** Direct materials ($168.70/bed) per Ben — production treated as already sunk; this P&L is the trip/delivery economics.

## Confidence key
**[V]** verified, Goods-tagged (ACT-GD) · **[D]** directional (tagged ACT-IN/untagged, may include non-Goods travel) · **[E]** estimate · **[M]** missing

## Method
Costs are taken from **bank transactions (actual money out)** in `xero_transactions`, synced live from Xero this session (`sync-xero-to-supabase.mjs transactions --days=90`, 575 txns). The $10,720 Qantas **ACCPAY bill** (Dext/Gmail-imported) is **excluded** — it duplicates card-paid flights already in the bank feed. Window: 8–26 May 2026.

## REVENUE — Centrecorp, 107 beds
- **$85,712** — INV-0291, PAID 2025-11-26 (= **$801/bed**). [V] Matches FRRR ("107 beds, Centrecorp, $85,712 paid").
- ⚠ May re-invoices (INV-0314/0329/0330/0331) all VOIDED/DELETED — re-attributed to Snow. $85,712 is the realised revenue.

## COSTS (bank SPEND, trip window)

| Category | Amount | Conf | Detail |
|---|--:|:--:|---|
| Flights | **$22,249** | D | Qantas $21,501 + Virgin $748 (tagged ACT-IN; likely the team but may include other ACT travel in window) |
| Accommodation | **$3,303** | D | Qantas Group Accom $3,006 + Lasseters (Alice) $267 + Grand Chancellor Townsville $30 |
| Car hire | **$923** | D | Thrifty (untagged) |
| Fuel | **$587** | V | Caltex Glasshouse $375 + United $125 + EG Fuelco $87 |
| Meals / community stores | **$789** | V | Arlparra $240 + Aherrenge $214 (Utopia stores) + Hanuman $111 + Woolworths $94 + News Travels $97 + Snowdon&Rowden $33 |
| Uber | **$358** | D | ACT-IN |
| Supplies (Bunnings) | **$272** | V | ACT-GD |
| **Travel + ground subtotal** | **~$28,481** | | matches the Xero P&L "Travel-National $28,015" for the period |
| **Defy bed kits — INV-1602 "107 Beds"** | **$36,947** | V | 92 kits @ $344.05 + 16 @ $121 (pre-paid sheets). PLASTIC ONLY — excl. assembly, hardware, freight. Verified ex actual Defy invoice |
| Canvas, 107 × $93.50 | $10,005 | E | Centre Canvas (Alice Springs) — invoiced in Notion, not Xero mirror |
| Steel, 107 × $27 | $2,889 | E | DNA Steel Direct (Alice Springs) — Notion |
| Assembly (107 × $55.95 if Defy) / hardware | ~$5,987+ | M | on-country assembly may be facility labour instead |
| Oonchiumpa trip invoice | **TBD** | M | not raised/synced — only $46–372 ACT-OO card spend in window |
| Bed freight Sydney→Utopia (Sea Swift/backload) | **TBD** | M | INV-1602 freight was "TBC"; not found in window |

## Trip P&L (actual Defy-invoice basis for beds — per Ben)

| | Amount |
|---|--:|
| Revenue (Centrecorp 107 beds) | **$85,712** |
| Travel + ground | −$28,481 |
| Defy bed kits (INV-1602) | −$36,947 |
| **Identified cost** | **−$65,428** |
| **Apparent surplus** | **≈ +$20,284** |
| + canvas $10,005 + steel $2,889 | → **≈ +$7,390** |
| + assembly + hardware + freight + Oonchiumpa | → **≈ break-even / slight loss** |

**Key correction:** using the *real* Defy invoice ($36,947, ref "107 Beds") instead of the $18,051 BOM estimate roughly **halves the apparent margin** — the trip lands near break-even once canvas, steel and the missing freight/Oonchiumpa are added. The BOM had badly understated the plastic kit ($45 → actual **$344.05/bed**; the canonical BOM in `supplier-quotes.ts` is now corrected → direct materials $467.75/bed).

## Honest caveats
1. **Flights are the swing factor.** $22,249 is tagged ACT-IN (Infrastructure), not Goods, and may include non-trip ACT travel in the window. The Xero P&L *incremental* travel vs the prior month is **$18,283** — a lower, possibly truer trip-travel figure. Real surplus is therefore likely **$39k (gross travel) up to ~$49k (incremental travel)**.
2. **Materials basis (Ben's choice) excludes** facility, labour (Joseph Kirmos $4,500/mo), HDPE production and development — so this is delivery economics, not full-cost. On a fully-loaded basis ($600/bed) the trip roughly breaks even.
3. **Tagging:** the trip's flights/accommodation are mostly ACT-IN/untagged. Re-tagging them ACT-GD would make Goods trip costs queryable directly next time.

## Open / asks
- **Raise/locate the Oonchiumpa trip invoice** + bed freight cost to complete the P&L.
- **Re-tag** May Qantas/accommodation ACT-IN → ACT-GD in Xero.
- Confirm flight headcount so the $22k can be split Goods-trip vs other ACT travel.

## Sources
- `xero_transactions` (synced live this session), `xero_invoices` (Centrecorp INV-0291) — ACT-infra Supabase `tednluwflfhxyucgwigh`.
- Live Xero P&L (org "Nicholas Marchesi", refreshed 2026-05-27): Travel-National $28,015 cross-check.
- BOM: [[bed-cogs-reconciliation]], `v2/src/lib/data/supplier-quotes.ts`.
