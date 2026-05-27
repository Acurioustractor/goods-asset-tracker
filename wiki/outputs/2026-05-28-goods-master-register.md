---
title: Goods on Country — Master Register (themes · artifacts · health · target · actions)
date: 2026-05-28
status: living source-of-truth — review before external use
purpose: One current-state map across the whole enterprise to work towards. Built from a full survey of wiki (135 docs), codebase (130+ routes, 22 data files, ~70 scripts), git history (422 commits since Dec 2025), this session's cost work, and MEMORY.
inventories: thoughts/shared/handoffs/2026-05-28-inventory-wiki.md · 2026-05-28-inventory-codebase.md · 2026-05-28-history-survey.md
---

# Goods on Country — Master Register

Health legend: 🟢 Operating/Live · 🟡 Built, needs hardening · 🟠 In draft / active build · 🔴 Gap / critical · ⚫ Stale / consolidate

## Health dashboard (15 workstreams)

| # | Workstream | Health | The one thing to move it forward |
|---|---|:--:|---|
| 1 | Product & Manufacturing | 🟢 | Prove on-Country production at ~30/wk; document fridge concept |
| 2 | Cost & Unit Economics | 🟡→🟢 | Build the SIH Excel cost tool off the new real costs |
| 3 | Financial Model & Forecasts | 🟡 | 3-statement integration + founder-FTE gate + accountant sign-off |
| 4 | Funders & Capital | 🟡 | **≥3 binding LOIs by 31 Aug (the QBE match)** |
| 5 | Impact & MEL | 🟡 | Explicit ToC logic chain + priority-metric shortlist |
| 6 | Governance & Legal | 🟡 | Recruit 1–2 commercial/scale-up advisors; board charter |
| 7 | QBE / SIH Program | 🟠 | Execute the Stage-2 sequence (see deep-dive) |
| 8 | CRM & Pipeline (GHL) | 🟢 | Finish Smart Router walkthrough; populate buyer pipeline |
| 9 | Website / v2 | 🟢 | Standing-inventory + product-sales model (SIH) |
| 10 | Asset Register & Field Ops | 🟢 | Reconcile washers (28 vs 14) + Alice 20 "ready" beds |
| 11 | Brand & Comms | 🟢 | Hold the line; founder-authored discipline on funder collateral |
| 12 | Media & Storytelling | 🟢 | Repackage Utopia across funnels; clear consent backlog |
| 13 | Fleet / Washing Machines | 🔴⚫ | Resolve connectivity (1 of 38) or commit to honest "14 working"; consolidate 12 docs |
| 14 | Team & People | 🟡 | Hire GM + Business-Development/sales-ops (SIH priority hires) |
| 15 | Operations & Knowledge | 🟡⚫ | Consolidate 4 compendiums → 1; fix broken cockpit sync |

The QBE Stage-2 submission set is the cross-cutting spine — see `2026-05-28-qbe-documentation-deep-dive.md`. Themes 2–6 ARE the six V4 priority areas.

---

## 1. Product & Manufacturing — 🟢
**Have:** Stretch Bed (live, canonical specs in `v2/src/lib/data/products.ts`), washing machine (Pakkimjalki Kari, prototype), Basket Bed (archived/open-source), fridge (concept). Facility: `PRODUCTION_FACILITY_GUIDE.md`, `wiki/articles/products/plant-design.md`. Public `/wiki/manufacturing/*` (facility-manual, machine-specs, plastic-processing, safety, throughput).
**Where we're at:** Product truth is clean and consistent. Containerised on-Country facility (Sunshine Coast/Witta) is real and documented; on-Country production transferred to a "low-skilled operator" model (a genuine strength per V4).
**Target:** On-Country production proven at scale (~30 beds/wk per FRRR); fridge to prototype; facility replicable to community ownership.
**Actions:** confirm current facility equipment status; write the fridge concept brief; reconcile bed-per-sheet assumptions in the facility guide.

## 2. Cost & Unit Economics — 🟡→🟢 (materially advanced this session)
**Have:** Real per-bed cost from actual invoices — HDPE kit $344.05 (Defy INV-1602/1732), canvas $93.50, steel $27, caps $3.20, **assembly $55.95 → $523.70 direct, ~$600 fully-loaded**. Volume curve $550→$479→$351→$270. Notion tables (Trip Costs, **Defy Invoices core records**, **Bed Inputs & Facility Costs**). Docs: `2026-05-28-bed-cogs-xero-reconciliation.md`, `2026-05-28-utopia-trip-cost-vs-centrecorp.md`. Code: `supplier-quotes.ts`, `supplier-cost-actuals.ts`, `/admin/xero-reconciliation`, `/admin/trip-receipts`.
**Where we're at:** This was the biggest single advance this session — moved from "some calculations" (V4) to verified, invoice-backed unit cost. Directly de-risks Opp #2 + feeds the financial model.
**Target:** The SIH-deliverable **Excel cost-calculation tool** with user-editable assumptions + scale/production-mix sensitivity (on-Country vs centralised).
**Actions:** build the Excel tool; pull canvas/steel **actual invoices from Notion** (off the Xero mirror); resolve **Zinus $28,691** (bed input?); add per-bed freight; validate per-unit-at-scale decreases.

## 3. Financial Model & Forecasts — 🟡  (V4 Opp #1, High 0–2mo)
**Have:** v0.1 "Day 1–10" build (12 May): Xero P&L, expense reconciliation, 7-segment revenue, 36-month cashflow, 4-state buffer policy, 12-instrument capital stack, Base/Upside/Downside scenarios, Butterfly impact tab. `wiki/articles/enterprise/04-financial-management.md`.
**Where we're at:** Strong v0.1 cashflow model, but baselines partly **superseded by the 27 May live Xero pull** (voided Centrecorp invoices); not yet 3-statement; founder time uncosted; not carved cleanly from ACT.
**Target:** Integrated 3-statement GOC-only model, founder time at fair-market rate, accountant-endorsed — investor-underwriteable.
**Actions:** **founder FTE % gate (Ben+Nic)**; build balance-sheet + integrate; refresh baselines to live Xero; clean ACT carve-out (Nic-personal-account issue); accountant review.

## 4. Funders & Capital — 🟡  (V4 area 10)
**Have:** 21 investor profiles (`wiki/articles/investors/`), 10 capital articles (capital-stack 12 instruments, funder-register, catalytic capital, DGR/PAF). Funder pages live (`/funders/[slug]`, `/partners/[slug]/outcomes`). Q2 reports (Centrecorp, Snow). Centrecorp reconciled ($123,332 paid, May invoices voided/→Snow). CASE alignment tool.
**Where we're at:** Relationships + collateral strong; the binding-commitment layer is the gap. Equity ruled out (until communities can hold it); patient/concessional debt preferred.
**Target:** **≥3 binding LOIs by 31 Aug 2026** (SEFA / IBA / Minderoo / PFI / Snow R4) = the QBE match. Founder-authored investor pack (the #1 V4 gap).
**Actions:** run the LOI-conversion hackathon playbook; refresh funder figures to live Xero; founder-author the investor narrative.

## 5. Impact & MEL — 🟡  (V4 Opp #5, Med 6–12mo)
**Have:** `/impact` live (20 metrics tagged live/modelled/estimated), EL consent-led storytelling (a V4 strength), asset register = demographics (523 deployed, 8 communities), `impact-model.ts` (5-dimension), `theory-of-change.md` (plain), `alma-framework.md`, `impact-measurement-report.md` (draft). QR bed tracking + washer telemetry.
**Where we're at:** Good live dashboard + storytelling; lacks an explicit results chain and a disciplined metric shortlist.
**Target:** Explicit logic chain (inputs→activities→outputs→outcomes→impact), priority-metric shortlist, **3 tailored reporting products** (community / funders / founders), consolidated impact report separating live vs modelled.
**Actions:** ToC v0.1 diagram (fast win); shortlist metrics; build the impact report.

## 6. Governance & Legal — 🟡  (V4 Opp #4 High 0–6mo + area 9)
**Have:** ACT Pty Ltd (trading vehicle), Butterfly Movement Ltd DGR transition in flight (founding directors confirming; board prep 1 June), GOC Advisory Committee (Aboriginal leaders, Zinus MD, Defy, philanthropic), governance articles (board-structure, risk-register, policies, compliance, data-sovereignty), **ai-human-in-loop policy (live)**, Mint Ellison legal support.
**Where we're at:** Advisory exists but has a named **commercial/scale-up skills gap**; Pty Ltd governance structure not yet formalised; reporting is ad-hoc per-grant.
**Target:** 1–2 commercial/scale-up advisors/directors; board charter + accountability/reporting cycle; community-ownership legal model + trigger points; mission-protection (B Corp / social-purpose clauses).
**Actions:** recruit advisors (the program is the pathway); draft board charter; Mint Ellison on ownership structure; decide GOC-vs-ACT separation timed to raise.

## 7. QBE / SIH Program — 🟠
**Have:** `2026-05-28-qbe-documentation-deep-dive.md` (newest), V4 sign-off + corrections memo, 17 program articles (stages, dates, diagnostic pack, evidence map, document-readiness), thoughts/ 10-topic diagnostic pack (topics 1–3 built, 4–10 draft).
**Where we're at:** Diagnostic done + signed off; 5 of 6 priority areas have v0.1 work; market research is the accepted open project.
**Target:** Stage-2 submission ready by ~Sept (apply Sept / assess Oct / outcomes Nov; ≤$400k, match-required).
**Actions:** execute the deep-dive sequence; run the QBE market-research project; assemble founder-authored pack.

## 8. CRM & Pipeline (GHL) — 🟢
**Have:** Smart Router (identify-and-tag, ONE workflow branching on `goods-*`), universal inquiry → opportunity + ack email, all website forms wired (`/contact`, `/partner`, feedback, washer, newsletter), clean tag taxonomy + pipeline design, drip runbook, campaign crons (engagement scoring, pipeline followup, SMS, weekly digest), outreach-targets + reach-out composer, Gmail/LinkedIn import. Canonical: `2026-05-27-goods-crm-pipeline-operating-model.md`.
**Where we're at:** Architecture clean and operating; some campaign crons partial; Smart Router walkthrough paused mid-step.
**Target:** Fully populated buyer/supporter pipelines feeding the LOI push; campaign automation hardened.
**Actions:** finish Smart Router walkthrough; populate the supporter journey pipeline; verify campaign crons.

## 9. Website / v2 — 🟢
**Have:** ~88 public pages — homepage, shop + **Stripe buy-now** (Stretch Bed only, $750), `/sponsor`, audience funnels (`/get-involved`, `/the-work`, `/kit`, `/partner`), `/impact`, `/pitch`, gated `/funders/*` + `/insiders/*`, `/field-notes`, `/stories`, `/storytellers`, public `/wiki` (13 subpages), community portal. 75 API routes + 9 crons + 3 webhooks.
**Where we're at:** Mature, audited (13-lens sweep), 0 brand-voice errors. Still order-tied delivery, **no standing inventory** (V4).
**Target:** Product-sales model with standing inventory + e-commerce maturity (V4 business-model recommendation).
**Actions:** confirm `/mission` (route exists vs memory's redirect note); standing-inventory plan; conversion optimisation on funnels.

## 10. Asset Register & Field Ops — 🟢
**Have:** `/admin/assets` register, `/bed/[id]` install flow + offline queue, batch generators (`generate_batch_156.py` template), QR/sticker pipeline (Avery + vinyl + ePrint + DTF), bulk install from photos, field-install admin guide. **523 deployed** (495 beds + 28 washers) across 9 communities.
**Where we're at:** Operating well; the active hot workstream (76 commits). Two open reconciliations.
**Target:** Clean live register; resolved washer + Alice-ready counts.
**Actions:** reconcile washers (28 deployed vs honest 14 working); confirm Alice Springs 20 "ready" beds (builders kept?); keep static counts synced to register.

## 11. Brand & Comms — 🟢
**Have:** Full system — 20 brand-comms articles (voice/tone, image library, email templates, EL video taxonomy, consent process, photography brief), lint tooling (**0 voice errors**), `/brand` page, press kit (`/press` + API), signature generator, deck, comms-intern playbook, `team.ts`, `press-reads.ts`. STATUS doc.
**Where we're at:** Built and stabilised (May-8 burst). Strong.
**Target:** Maintain; ensure all funder/investor collateral is founder-authored (V4 discipline).
**Actions:** hold the line; apply the human-in-loop checklist to outbound funder docs.

## 12. Media & Storytelling — 🟢
**Have:** EL integration (`empathy-ledger/*`, daily sync, two-table video resolver), field-notes scrollytelling (`trip-stories.ts` + `/field-notes/[slug]`), Utopia trip feature (story spine, HTML features, 12-image set, blog→EL pipeline), drip sequences, audience-funnel plan, Mykel storyteller. EL: 240 storytellers, 12 Goods stories syndicated.
**Where we're at:** Rich and active (57 commits). Consent backlog + some A2 media cuts outstanding.
**Target:** Utopia story repackaged across all funnels; consent backlog cleared; EL as canonical media source.
**Actions:** A2 media cuts; clear consent backlog; keep EL-first discipline.

## 13. Fleet / Washing Machines — 🔴 / ⚫
**Have:** Particle + OpenFields webhooks, fleet-rollup cron, `/admin/fleet`, telemetry forensics (5 fleet docs, 7 WM ledgers, master listing script). 38 deployed.
**Where we're at:** **Only 1 of 38 reporting** (F25). Intense 5 May diagnostic sprint, then silence since 18 May — connectivity unsolved. 12 near-duplicate docs.
**Target:** Connectivity resolved OR a committed honest framing ("14 working"); one consolidated fleet record.
**Actions:** decide connectivity fix vs accept; **consolidate the 12 fleet/WM docs into one**; reconcile 28-deployed vs 14-working; talk to Nic (briefing doc exists).

## 14. Team & People — 🟡  (V4 area 8)
**Have:** 2 founders (Ben, Nic) — complementary, capable; Oonchiumpa Consultancy (Alice Springs, 100% Aboriginal-staffed) partner; production cohort (Ebony, Jahvan); comms intern playbook; Fred Campbell (Oonchiumpa cultural lead).
**Where we're at:** Founders are the only paid workers — the most significant capacity constraint (V4). Sales-ops/procurement is an identified skills gap. Founder comp ad-hoc.
**Target:** Hire **General Manager** + **Business Development / sales-ops lead** (V4 priority hires); procurement capability for scaled institutional sales.
**Actions:** define + recruit GM and BD; model founder comp at fair-market rate (links to Theme 3).

## 15. Operations & Knowledge — 🟡 / ⚫
**Have:** Wiki (135 docs, `INDEX.md` map), `COMPENDIUM_MARCH_2026.md` (authoritative facts), Goods Cockpit (Notion mirror), Ops Handbook, Notion sync workflow, source shelf (21 sources), enterprise 10-topic articles.
**Where we're at:** Rich but carrying consolidation debt: **4 overlapping compendiums** (Jan, March, GOODS_, KNOWLEDGE_), 12 fleet/WM docs, stale LinkedIn scrapes (Mar). **Notion cockpit sync is broken** (missing `2026-05-12-goods-cockpit.md` dependency, per memory).
**Target:** One authoritative compendium; consolidated clusters; working cockpit sync; operating SOPs reducing founder dependency (V4 process recommendation).
**Actions:** consolidate 4 compendiums → March; consolidate fleet/WM docs; fix cockpit sync; archive stale scrapes.

---

## Cross-cutting: the QBE Stage-2 submission spine
Every theme above feeds the Stage-2 pack. The 12 required artefacts + their status are in `2026-05-28-qbe-documentation-deep-dive.md`. The **#1 gap is a founder-authored, concise, accurate investor pack backed by the financial model** — themes 2/3/4/5 are its inputs.

## Cross-cutting: consolidation & data-integrity debt
- **Consolidate:** 4 compendiums → March; 7 WM ledgers + 5 fleet docs → one; archive Mar-2026 LinkedIn scrapes.
- **Refresh:** financial-model v0.1 baselines vs the 27 May live Xero pull (voided Centrecorp invoices).
- **Fix:** Notion cockpit sync (broken); confirm `/mission` route vs redirect.
- **Memory stale:** `funder-url-map.ts` moved to `v2/src/lib/funders/` — update the memory "Key File Locations" entry.
- **Recurring:** funder figures (Centrecorp/Snow) need a single live source — provenance has been corrected repeatedly Apr–May.

## Cross-cutting: the discipline rule (V4, non-negotiable)
All external collateral must be **founder-authored, human-audited, accurate-not-aspirational**, every figure tagged live/modelled/target, defensible in live Q&A. Policy: `wiki/articles/governance/ai-human-in-loop-policy.md`.

## Consolidated priority actions (next ~12 weeks, sequenced)
1. **Founder FTE % + fair-market rate** → unlocks financial model (Theme 3) + founder comp (14).
2. **SIH Excel cost tool** off the new real costs + resolve canvas/steel/Zinus/freight (Theme 2).
3. **3-statement GOC model**, baselines refreshed, accountant-endorsed (Theme 3).
4. **QBE market-demand research** project — ≤4 segments, top-down sizing (Theme 7).
5. **ToC v0.1 diagram + metric shortlist** (Theme 5) — fast win.
6. **Recruit 1–2 commercial advisors + board charter** (Theme 6).
7. **≥3 binding LOIs by 31 Aug** = the match (Theme 4) — the gating item for Stage 2.
8. **Formal risk register** (environmental explicit) before the next pilot (Theme 6).
9. **Founder-authored investor pack + impact report** for Sept submission (Themes 4/5/7).
10. **Consolidation pass** — compendiums, fleet/WM docs, cockpit sync (Theme 15).

## Open decisions for Ben/Nic
Founder FTE % · the ≤4 market segments · which 3 funders for LOIs · Zinus $28,691 purpose · GOC-vs-ACT separation timing · fleet connectivity fix-vs-accept · who fills GM + BD roles.
