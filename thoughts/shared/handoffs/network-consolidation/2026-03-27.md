---
date: 2026-03-27T18:00:00Z
session_name: network-consolidation
branch: main
status: active
---

# Work Stream: network-consolidation

## Ledger
**Updated:** 2026-03-27T18:00:00Z
**Goal:** Unified CRM + Production command center with Xero-verified financial data, strategic sales pipeline, procurement strategy, and deal room for $5M compound opportunity.
**Branch:** main
**Test:** npm run dev (localhost:3001)

### Now
[->] Capability statement one-pager, Groote outreach email, mobile responsiveness fixes

### This Session
- [x] Supply Nation certification page (/admin/supply-nation) — July 1 deadline tracker, 5-step checklist, competitive landscape, Oonchiumpa profile
- [x] AusTender registration guide (/admin/austender) — UNSPSC codes, priority panels, search terms, $125K threshold
- [x] Backloading logistics calculator (/admin/logistics) — 5 routes, interactive bed qty/route selector, freight vs traditional comparison
- [x] HDPE product catalog (/admin/hdpe-catalog) — 5 expansion products (wall panels, shelving, tables, outdoor furniture, playground)
- [x] HDPE catalog data in products.ts — HDPE_CATALOG array with specs, market fit, price estimates
- [x] Supplier quotes data (supplier-quotes.ts) — BOM, COGS $149/bed, 73% margin, all 4 suppliers structured
- [x] NIAA Alice Springs meeting prep (/admin/niaa-prep) — 30min talking points, deployment evidence, objection handling, leave-behinds
- [x] Groote proposal PDF export — PrintButton component, browser print with existing print styles
- [x] Procurement page unicode fix — literal \u2013 → actual en-dash in revenue estimates
- [x] 3 LinkedIn warm leads → CRM deals (Tara Castle QCF, Nick Miller Fortitude $330M, Bradley Clair)
- [x] Community deployment map (/admin/deployment-map) — Leaflet map, 7 communities, 412+ beds, pipeline communities
- [x] Xero reconciliation dashboard (/admin/xero-reconciliation) — overdue/awaiting/paid, amount mismatches, invoice-linked vs unlinked
- [x] IBA Business Loan prep (/admin/iba-loan) — $5M structure (30% grant), use of funds, 4-year projections, checklist
- [x] Sidebar updated: Supply Nation, AusTender, HDPE Catalog, Logistics, IBA Loan, Deployment Map, Xero Recon
- [x] Gmail drafts confirmed ready: DEWR follow-up + Rotary $82.5K chase
- [x] 3 commits pushed to main (a75bb0f, f32c4ff)
- [x] All deployed to Vercel

### Previous Sessions
- [x] Groote proposal page, Deal Room checklists, Procurement strategy dashboard
- [x] Building supply chain section, 10 pipeline entries, procurement strategy doc
- [x] Gmail drafts (DEWR + Rotary), local dev auth bypass
- [x] Xero invoice sweep, Command Center dashboard, Strategy + Growth + Deal Room pages
- [x] Sidebar consolidated 7→3 groups, economics/compendium updates

### Next
- [ ] BUILD: Capability statement one-pager (PDF for NIAA, AusTender, grant apps)
- [ ] BUILD: Groote outreach email draft to Simone Grimmond (WHSAC)
- [ ] FIX: Mobile responsiveness — Groote pricing table, Deal Room CRM table, Procurement pipeline tables
- [ ] ACTION: Send Gmail drafts (DEWR follow-up + Rotary chase) — drafts ready, user needs to hit send
- [ ] ACTION: Register on austender.gov.au (guide built at /admin/austender)
- [ ] ACTION: Start Supply Nation application via Oonchiumpa (checklist at /admin/supply-nation)
- [ ] BUILD: Contact Simone Grimmond — draft intro email with Groote proposal link
- [ ] BUILD: Groote proposal → improve print CSS for cleaner PDF output
- [ ] BUILD: Standing Offer Arrangement template for NT Dept of Housing

### Decisions
- Unified Network page replaces separate Deals page ✓
- Xero OAuth2 NOT needed here — already exists in separate codebase ✓
- Tim Cook supply chain model as procurement strategy framework ✓
- Stacking advantage: 6 preferential procurement categories simultaneously ✓
- Building supply chain = the bigger play (bed is wedge, housing fitout is market) ✓
- Local dev bypasses auth on localhost (middleware + layout) ✓
- 200 beds @ $560 = $112K — under $125K Commonwealth threshold (no tender needed) ✓
- Supply Nation Certification is FREE and gives 3x more contracts ✓
- IBA Business Loan up to $5M with 30% grant component ✓
- NT Remote Housing Program = $4B over 10yr, 2,700 homes need beds ✓
- COGS per Stretch Bed = $149.20 (Defy $45 + Steel $36 + Canvas $65 + Caps $3.20) ✓
- Margin at institutional price ($560) = 73% ✓
- Leaflet map reused from existing community-map.tsx component ✓

### Open Questions
- UNCONFIRMED: PICC bed price $750 vs $560 — is $750 inc GST?
- UNCONFIRMED: Groote/WHSAC — has Simone been contacted? What's the procurement pathway?
- UNCONFIRMED: REAL Fund EOI status — any response from DEWR?
- UNCONFIRMED: Rotary $82.5K — any payment plan or dispute?
- UNCONFIRMED: Oonchiumpa ownership structure — does it meet 51% threshold for July 1 IPP change?
- UNCONFIRMED: Is Goods/ACT registered on AusTender?
- UNCONFIRMED: Supply Nation application started?

### Workflow State
pattern: research-architect-build
phase: 5
total_phases: 5
retries: 0
max_retries: 3

#### Resolved
- goal: "Unified CRM + Production command center + procurement strategy with Cook supply chain model"
- resource_allocation: aggressive

#### Unknowns
- picc_bed_price_gst: UNKNOWN
- groote_contact_status: UNKNOWN
- real_fund_eoi_response: UNKNOWN
- rotary_payment_status: UNKNOWN
- oonchiumpa_ownership_51pct: UNKNOWN
- austender_registration: UNKNOWN
- supply_nation_status: UNKNOWN

#### Last Failure
(none)
