---
date: 2026-03-27T11:30:00Z
session_name: network-consolidation
branch: main
status: active
---

# Work Stream: network-consolidation

## Ledger
**Updated:** 2026-03-27T11:30:00Z
**Goal:** Unified CRM + Production command center with Xero-verified financial data, strategic sales pipeline, and deal room for $5M compound opportunity.
**Branch:** main
**Test:** npm run dev (localhost:3000)

### Now
[->] Deployed. Next: Groote proposal document or REAL Fund follow-up or Rotary chase

### This Session
- [x] Xero invoice sweep — 13 new deals added, 5 fixed, 2 deleted across crm_deals
- [x] Added: Snow wages $110K, Snow beds $5.5K, Centrecorp 60 beds $37.6K, Red Dust $15.9K, Mala'la $5.4K, Julalikari $19.8K, Our Community Shed (washer $6.8K + 30 beds $13.5K), Defy $36.9K
- [x] Added: Rotary Eclub (Anyinginyi) $82,500 OVERDUE 11 months — INV-0222 200 Basket Beds
- [x] Added: Our Community Shed Plant Part 1 QU-0011 $163,900 (shredding, 12mo)
- [x] Added: Our Community Shed Plant Part 2 QU-0012 $93,498 (moulding, 6mo)
- [x] Added: Snow Foundation Round 4 INV-0321 $132K — moved to won (awaiting payment)
- [x] Fixed: PICC $36,000 → $36,300 (INV-0317 verified)
- [x] Fixed: Production facility deal was Centrecorp → actually Our Community Shed
- [x] Split: REAL Innovation Fund into 2 × $1.2M (Alice Springs + Townsville)
- [x] Split: QBE Foundation $10K received + $140K pending
- [x] Deleted: PFI QLD Treasury (not real), duplicate Snow Round 4
- [x] Updated: 5 funding deals marked PAID (Snow other, VFFF, FRRR, TFN, AMP)
- [x] Compendium: trade revenue $50K → $239K, receivables $126K → $513K
- [x] Compendium: fixed Homeland Schools, QIC descriptions, all dates → March 27
- [x] Economics: retail price $249 → $600
- [x] Impact model: annual revenue $50K → $239K
- [x] Grants page: fixed stale receivables text (was "Centrecorp $420K")
- [x] Dashboard: rebuilt as Command Center — 6 KPIs, urgent actions, top pipeline, deployments, production, funding
- [x] Strategy page: interactive deals table with filters (status/type/section), table/card view, dynamic totals
- [x] Growth page: 2 regions (Central NT + North QLD), communities + expansion targets + procurement channels + funding, plant economics, freight economics, grant keywords
- [x] Deal Room: $5M compound opportunity — REAL Fund + Groote, dark hero, 5-step pipeline, side-by-side deal cards, 4-year trajectory, community ownership endgame
- [x] Sidebar: added Strategy, Growth, Deal Room links
- [x] Data consistency audit: all admin pages verified clean
- [x] Committed and pushed to main (c32dec7)

### Next
- [ ] BUILD: Groote proposal document — PDF for WHSAC with freight comparison, pricing, community impact
- [ ] ACTION: Follow up with DEWR on REAL Fund EOI (25 days since submission)
- [ ] ACTION: Chase Rotary $82.5K overdue (INV-0222, 11 months)
- [ ] BUILD: Xero API OAuth2 integration for live invoice sync
- [ ] CLEANUP: Defy supplier quotes — consider supplier_quotes table
- [ ] BUILD: Make Deal Room next steps interactive (checkboxes that persist)

### Decisions
- Unified Network page replaces separate Deals page ✓
- Bed pricing: Stretch $560 institutional, Basket $370, Retail $600 (from Xero) ✓
- PICC price $750/bed (may include GST — unconfirmed) ✓
- Production facility quotes are from Our Community Shed (not Centrecorp) ✓
- REAL Fund is two separate $1.2M grants (one per site) ✓
- QBE has $10K received, $140K pending ✓
- PFI QLD Treasury deleted (not real) ✓
- Double the Grant section removed (was speculative) ✓
- Rotary Eclub = Anyinginyi community connection ✓
- Deal status derived from notes (PAID/OVERDUE/AUTHORISED) ✓

### Open Questions
- UNCONFIRMED: PICC bed price $750 vs $560 — is $750 inc GST?
- UNCONFIRMED: Groote/WHSAC — has Simone been contacted? What's the procurement pathway?
- UNCONFIRMED: REAL Fund EOI status — any response from DEWR?
- UNCONFIRMED: Alice Springs plant location + timeline
- UNCONFIRMED: Townsville plant — confirmed PICC-based?
- UNCONFIRMED: Rotary $82.5K — any payment plan or dispute?

### Workflow State
pattern: research-architect-build
phase: 4
total_phases: 5
retries: 0
max_retries: 3

#### Resolved
- goal: "Unified CRM + Production command center with Xero-verified financial data, strategic sales pipeline, and $5M deal room"
- resource_allocation: aggressive

#### Unknowns
- picc_bed_price_gst: UNKNOWN
- groote_contact_status: UNKNOWN
- real_fund_eoi_response: UNKNOWN
- rotary_payment_status: UNKNOWN

#### Last Failure
(none)

---

## Context

### Key Financial Summary (Xero-verified, March 27 2026)
- Trade revenue (PAID invoices): $239,273
- Outstanding receivables: $513,148
- Grants received: $455,685
- Grants pending: $3,265,000 (incl REAL $2.4M, SEFA $500K, QBE $140K, SEDG $75K, Snow R4 $200K)
- Active pipeline: ~$3.5M in deals

### Pages Built/Rebuilt This Session
- `/admin` — Command Center dashboard (live KPIs, urgent actions, pipeline, deployments, production, funding)
- `/admin/strategy` — Interactive deals table with filters + bed pricing + funding summary
- `/admin/growth` — Regional growth strategy (NT + QLD) with procurement channels, expansion targets, plant economics
- `/admin/deal-room` — $5M compound opportunity war room (REAL Fund + Groote)

### CRM Deals Added (13 new)
All tagged `xero-verified`. Key additions:
- Rotary Eclub (Anyinginyi) — $82,500 OVERDUE, 200 Basket Beds, INV-0222
- Our Community Shed Plant Part 1 — $163,900, QU-0011 (shredding, 12mo)
- Our Community Shed Plant Part 2 — $93,498, QU-0012 (moulding, 6mo)
- Snow Foundation wages — $110,000 PAID, INV-0268
- Snow Foundation Round 4 — $132,000 won (awaiting payment), INV-0321
- REAL Innovation Fund Alice Springs — $1,200,000, EOI submitted
- REAL Innovation Fund Townsville — $1,200,000, EOI submitted
- Defy Manufacturing — $36,947 PAID, INV-1602 (16 beds)
- Plus: Mala'la $5,434, Julalikari $19,800, Red Dust $15,950, Centrecorp 60 beds $37,620, Snow 10 beds $5,545, Our Community Shed 30 beds $13,500, Our Community Shed washer $6,765

### Key Files Changed
- `v2/src/app/admin/page.tsx` — Command Center dashboard
- `v2/src/app/admin/strategy/page.tsx` — Strategy page (new)
- `v2/src/app/admin/growth/page.tsx` — Growth page (new)
- `v2/src/app/admin/deal-room/page.tsx` — Deal Room (new)
- `v2/src/components/strategy/deals-table.tsx` — Interactive deals table (new)
- `v2/src/app/admin/admin-sidebar.tsx` — Strategy, Growth, Deal Room links
- `v2/src/lib/data/compendium.ts` — Full financial overhaul
- `v2/src/lib/data/impact-model.ts` — Revenue updated
- `v2/src/app/admin/economics/page.tsx` — Retail price fix
- `v2/src/app/admin/grants/page.tsx` — Receivables text fix
- `v2/src/app/admin/compendium/page.tsx` — Sync date fix
