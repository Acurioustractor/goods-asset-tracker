# Goods on Country — Documentation Inventory (wiki + v2/docs)

> Generated 2026-05-28 for the master artifact register. Scope: `wiki/articles/`, `wiki/outputs/`, `v2/docs/` only. Method: listed all files; read INDEX.md, folder READMEs, and the first ~6 lines of each output/doc. Article one-liners are sourced from `wiki/articles/INDEX.md` (the authoritative wiki map). Status is inferred from filename dates + frontmatter/header status flags.

Totals: ~135 markdown docs + 2 HTML features + 1 image media set.
- `wiki/articles/`: 119 articles across 11 topic folders + 4 top-level files
- `wiki/outputs/`: 74 dated docs + 2 funder reports + 2 HTML + 12-image utopia-media set
- `v2/docs/`: 28 docs

---

## Product / Manufacturing

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/articles/products/stretch-bed.md | Flagship Stretch Bed spec page (real current specs) | Live | — |
| wiki/articles/products/washing-machine.md | Pakkimjalki Kari washer, prototype spec page | Live | — |
| wiki/articles/products/basket-bed-legacy.md | Discontinued/open-sourced basket bed | Live (legacy) | — |
| wiki/articles/products/plant-design.md | Containerised on-country production facility | Live | — |
| wiki/articles/products/README.md | Products folder index | Live | — |
| wiki/articles/sources/canonical-product-data.md | Source page for canonical product data | Live | — |
| v2/docs/PRODUCTION_FACILITY_GUIDE.md | Stretch Bed plant ops guide ("become unnecessary") v1.0 | Solid-draft | Feb 2026 |
| wiki/articles/sources/production-facility-guide.md | Source mirror of the facility guide | Live | — |
| v2/docs/DESIGN_SPRINT_PREP.md | Design-sprint content-gathering prep for ecommerce | Stale/needs-refresh | — |

**Most authoritative:** `wiki/articles/products/stretch-bed.md` (canonical specs live in code `v2/src/lib/data/products.ts`).

---

## Cost / Unit-economics

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/outputs/2026-05-28-bed-cogs-xero-reconciliation.md | Canonical BOM vs live Xero actuals COGS reconciliation | Solid-draft | 2026-05-28 |
| wiki/outputs/2026-05-28-utopia-trip-cost-vs-centrecorp.md | Real trip cost vs Centrecorp 107-bed invoice (live bank synced) | Solid-draft | 2026-05-28 |
| wiki/outputs/2026-05-12-financial-model-day4-unit-economics.md | Stretch Bed unit economics v0.1 (modelled) | Solid-draft (v0.1) | 2026-05-12 |
| wiki/articles/capital/cost-register.md | Xero-linked actual costs, estimates, review queue | Live | — |
| wiki/articles/sources/impact-model-data.md | Source page for impact-model data | Live | — |

**Most authoritative:** `2026-05-28-bed-cogs-xero-reconciliation.md` (newest, Xero-actuals based).

---

## Financial-model

> The 2026-05-12 "Day 1–10" series is the v0.1 GOC carve-out financial model (SIH Rec #1). All marked v0.1; baseline figures partly superseded by the 2026-05-27 live Xero pull (see MEMORY note re: voided Centrecorp invoices).

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/outputs/2026-05-12-financial-model-scope.md | 8-week build plan / scope for GOC-only model | Solid-draft | 2026-05-12 |
| wiki/outputs/2026-05-12-financial-model-week1-kickoff.md | Day 1–10 operational checklist | Solid-draft | 2026-05-12 |
| wiki/outputs/2026-05-12-xero-day1-reconciliation.md | Day 1: Xero extraction + anchor reconciliation | Solid-draft | 2026-05-12 |
| wiki/outputs/2026-05-12-financial-model-day2-pnl.md | Day 2: P&L summary v0.1 (Xero-verified) | Solid-draft | 2026-05-12 |
| wiki/outputs/2026-05-12-financial-model-day3-expenses-and-founder-time.md | Day 3: expense reconciliation + founder-time sensitivity | Solid-draft (gated on FTE %) | 2026-05-12 |
| wiki/outputs/2026-05-12-financial-model-day5-revenue-segments.md | Day 5: revenue model by 7 segments v0.1 | Solid-draft | 2026-05-12 |
| wiki/outputs/2026-05-12-financial-model-day6-cashflow-36mo.md | Day 6: 36-month cashflow shell v0.1 | Solid-draft | 2026-05-12 |
| wiki/outputs/2026-05-12-financial-model-day7-buffer-policy.md | Day 7: cashflow buffer policy (4-state) | Solid-draft | 2026-05-12 |
| wiki/outputs/2026-05-12-financial-model-day8-capital-stack.md | Day 8: capital stack v0.1, 12 instruments | Solid-draft | 2026-05-12 |
| wiki/outputs/2026-05-12-financial-model-day9-three-scenarios.md | Day 9: Base/Upside/Downside scenarios | Solid-draft | 2026-05-12 |
| wiki/outputs/2026-05-12-financial-model-day10-butterfly-impact.md | Day 10: Butterfly DGR impact tab (closes v0.1 build) | Solid-draft | 2026-05-12 |
| wiki/articles/enterprise/04-financial-management.md | Durable financial-management operating snapshot | Live | — |

**Most authoritative:** `2026-05-12-financial-model-day9-three-scenarios.md` + Day 10 (build-closing docs); baselines now partly stale vs 2026-05-27 Xero pull.

---

## Funders / Capital

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/articles/capital/ (10 files) | Capital instruments, blended finance, catalytic capital, funder-register, cost-register, capital-stack, PAF/PUAF/DGR, AU case studies, big-questions, README | Live | — |
| wiki/articles/investors/ (21 files) | Per-investor profiles (QBE Found./Ventures, SEFA, Snow, IBA, PFI, Minderoo, FAC, Tim Fairfax, Dusseldorp, TFN, FRRR, VFFF, AMP, Beck Parkinson) + categories, knockout-criteria, CASE alignment-tool, pipeline, needs, README | Live | — |
| wiki/outputs/funder-reports/centrecorp/2026-Q2.md | Centrecorp Q2 2026 funder report (photo-slotted) | Solid-draft | 2026 Q2 |
| wiki/outputs/funder-reports/snow/2026-Q2.md | Snow Foundation Q2 2026 progress report | Solid-draft | 2026 Q2 |
| wiki/outputs/2026-05-12-centrecorp-narrative-fixes.md | Centrecorp narrative corrections across funder docs | Shipped | 2026-05-12 |
| wiki/outputs/2026-05-18-centrecorp-utopia-impact-report.md | Centrecorp/Utopia impact report | Solid-draft | 2026-05-18 |
| wiki/outputs/2026-05-18-centrecorp-utopia-outcomes-one-pager.md | Utopia bed-delivery outcomes one-pager for Centrecorp | Solid-draft | 2026-05-18 |
| wiki/outputs/2026-05-22-centrecorp-impact-deck.md | Centrecorp impact deck (HTML-commented), May Utopia trip | Solid-draft | 2026-05-22 |
| wiki/articles/sources/funding-journey.md | Funding history + reconciliation questions | Live | — |
| wiki/articles/sources/grants-archive-index.md | Map of grant apps, reports, partner letters | Live | — |
| wiki/articles/sources/snow-pitch-feedback-reflections.md | Source page: Snow pitch feedback | Live | — |
| v2/docs/Final Snow pitch with Snow feedback and reflections.md | Raw Snow pitch + Snow's feedback email | Stale (raw source) | — |

**Most authoritative:** `wiki/articles/capital/funder-register.md` (relationship+money single view); funder-reports/* are the live outbound Q2 reports.

---

## Impact / MEL

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/articles/impact/metrics-tracked.md | Current evidence vs possible future metrics | Live | — |
| wiki/articles/impact/alma-framework.md | Australian Living Map of Alternatives review lens | Live | — |
| wiki/articles/impact/theory-of-change.md | Plain theory of change | Live | — |
| wiki/articles/impact/empathy-ledger-impact.md | Consented story practice + technical reference | Live | — |
| wiki/articles/impact/impact-measurement-report.md | Stage-2-required impact measurement report | Solid-draft | — |
| wiki/articles/impact/README.md | Impact folder index | Live | — |
| wiki/outputs/2026-05-12-impact-page-audit.md | /impact aspirational-as-active metric fixes | Shipped | 2026-05-12 |
| wiki/outputs/2026-05-12-impact-page-qa-walkthrough.md | Human-eyes funder-defence checklist for /impact | Shipped | 2026-05-12 |

**Most authoritative:** `wiki/articles/impact/impact-measurement-report.md` (Stage-2 deliverable); audit docs are shipped/closed.

---

## Governance / Legal

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/articles/governance/ (8 files) | board-structure, risk-register, legal-structure, policies-register, compliance, data-sovereignty, ai-human-in-loop-policy, README | Live | — |
| wiki/articles/support-network/mint-ellison-legal.md | Mint Ellison / Keith Rovers legal support | Live | — |
| wiki/outputs/2026-05-19-butterfly-movement-transition-proposal.md | Butterfly Movement Ltd DGR transition proposal | Solid-draft | 2026-05-19 |
| wiki/outputs/2026-05-19-butterfly-taboo-handover-meeting.md | Butterfly/TABOO handover meeting notes | Notes | 2026-05-19 |
| wiki/outputs/2026-05-26-board-prep-butterfly-transition-review.md | Board-prep review for 1 June board meeting | Solid-draft | 2026-05-26 |
| wiki/outputs/2026-05-12-eloise-outreach-draft.md | Eloise Hall founding-director outreach + consent register | Rough-draft (DRAFT) | 2026-05-12 |

**Most authoritative:** `wiki/articles/governance/ai-human-in-loop-policy.md` (active policy) + `2026-05-26-board-prep-butterfly-transition-review.md` (newest governance state).

---

## QBE / SIH

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/articles/program/ (17 files) | QBE program structure, stages, dates, diagnostic-pack, evidence map, document/source readiness, implementation sequence, human-verification sprint, grantscope-capital loop, weekly actions, stage-2-funding | Live | — |
| wiki/articles/qbe-catalysing-impact-2026.md + program/qbe-catalysing-impact-2026.md | Program overview (top-level + folder) | Live | — |
| wiki/articles/qbe-review.md | QBE review article | Live | — |
| wiki/articles/sources/catalysing-impact-application-draft.md | Source: QBE application draft | Live | — |
| wiki/articles/sources/qbe-actions-dashboard.md | Source: QBE actions dashboard | Live | — |
| wiki/outputs/2026-04-25-qbe-diagnostic-readiness-ledger.md | QBE diagnostic readiness ledger (solid vs needs-work) | Solid-draft | 2026-04-25 |
| wiki/outputs/2026-04-25-qbe-ecosystem-inventory.md | QBE mentor pack, ecosystem-aware revision | Solid-draft | 2026-04-25 |
| wiki/outputs/2026-04-25-qbe-mentor-prep-ceo-review.md | QBE mentor interview 1 CEO review + pack plan | Notes | 2026-04-25 |
| wiki/outputs/2026-04-27-qbe-prep-session-handoff.md | QBE prep handoff (paused at 20 actions) | Superseded | 2026-04-27 |
| wiki/outputs/2026-05-12-qbe-prep-resume.md | QBE prep resume, reframed vs SIH + Butterfly | Solid-draft | 2026-05-12 |
| wiki/outputs/2026-05-12-sih-advisory-acceptance-draft.md | SIH Priority Advisory acceptance email | Rough-draft (DRAFT) | 2026-05-12 |
| wiki/outputs/2026-05-19-sih-diagnostic-v4-signoff.md | SIH diagnostic V4 sign-off + corrections memo | Solid-draft | 2026-05-19 |
| wiki/outputs/2026-05-19-diagnostic-areas-showcase.md | SIH diagnostic areas showcase + Butterfly overlay | Solid-draft | 2026-05-19 |
| wiki/outputs/2026-05-28-qbe-documentation-deep-dive.md | QBE documentation readiness deep dive (on SIH V4) | Solid-draft | 2026-05-28 |
| wiki/articles/program/wiki-evidence-rebuild-audit.md | Rebuild checklist for proof-rich topics | Live | — |

**Most authoritative:** `2026-05-28-qbe-documentation-deep-dive.md` (newest) + `2026-05-19-sih-diagnostic-v4-signoff.md` (V4 sign-off).

---

## CRM / GHL

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/outputs/2026-05-18-stripe-ghl-launch-day.md | Stripe go-live + GHL unification handover | Shipped | 2026-05-18 |
| wiki/outputs/2026-05-18-ghl-workflow-alignment.md | GHL Smart Router workflow alignment playbook (Option B refactor) | Shipped | 2026-05-18 |
| wiki/outputs/2026-05-18-ghl-tag-cleanup.md | GHL tag/workflow cleanup companion | Shipped | 2026-05-18 |
| wiki/outputs/2026-05-23-ghl-smart-router-walkthrough-resume.md | Smart Router walkthrough resume (paused A1) | Rough-draft (paused) | 2026-05-23 |
| wiki/outputs/2026-05-26-goods-tracking-and-ghl-setup.md | Analytics + GHL + supporter setup (tight version) | Solid-draft | 2026-05-26 |
| wiki/outputs/2026-05-26-ghl-drip-runbook.md | GHL drip runbook for Utopia funnels | Solid-draft | 2026-05-26 |
| wiki/outputs/2026-05-26-ghl-inquiries-clickthrough.md | ACT Inquiries pipeline + form notifications click-by-click | Solid-draft | 2026-05-26 |
| wiki/outputs/2026-05-26-website-forms-ghl-email-map.md | Where website forms go → GHL + email (code-verified) | Solid-draft | 2026-05-26 |
| wiki/outputs/2026-05-27-contact-flow-build-and-test.md | Contact form GHL build + end-to-end test | Solid-draft | 2026-05-27 |
| wiki/outputs/2026-05-27-ghl-forms-architecture-reference.md | One-page forms→GHL mental model (reference) | Live (reference) | 2026-05-27 |
| wiki/outputs/2026-05-27-goods-crm-build-handoff.md | Goods CRM/GrantScope buyer build session handoff | Solid-draft | 2026-05-27 |
| wiki/outputs/2026-05-27-goods-crm-pipeline-operating-model.md | Canonical "how Goods pipelines work" reference | Live (canonical) | 2026-05-27 |
| wiki/outputs/2026-05-27-goods-ghl-tag-audit.md | Goods GHL tag audit + clean taxonomy (code+GHL verified) | Solid-draft | 2026-05-27 |
| wiki/outputs/2026-05-27-goods-tag-scheme-and-pipelines.md | Clean tag scheme + pipeline design convention | Solid-draft | 2026-05-27 |
| wiki/outputs/2026-05-27-universal-inquiry-stages-and-ack-email.md | Universal Inquiry stage copy + auto-ack email | Solid-draft (paste-ready) | 2026-05-27 |
| v2/docs/linkedin-comments-crm.md | LinkedIn warm-leads CRM analysis (87 commenters) | Stale (scrape 2026-03-26) | 2026-03-26 |
| wiki/articles/program/grantscope-capital-procurement-loop.md | Grants→evidence→CRM matching process | Live | — |

**Most authoritative:** `2026-05-27-goods-crm-pipeline-operating-model.md` (canonical) + `2026-05-27-ghl-forms-architecture-reference.md`.

---

## Website / v2 + Content systems

| Path | What it is | Status | Date |
|---|---|---|---|
| v2/docs/EMPATHY_LEDGER_INTEGRATION.md | EL integration architecture for v2 | Live | — |
| v2/docs/empathy-ledger-operations.md | EL story/photo/storyteller ops guide | Live | — |
| v2/docs/GOODS_CONTENT_QUICKSTART.md | Easiest ways to add photos/videos/stories | Live | — |
| v2/docs/content-pipeline.md | Discover/tag/gather EL stories pipeline | Live | — |
| v2/docs/story-templates.md | Content templates for EL | Live | — |
| v2/docs/HOMEPAGE_DESIGN_EXPLORATION.md | 10 homepage design concepts | Idea-only | — |
| v2/docs/LONG_FORM_LANDING_PAGE.md | "Goods That Heal" long-form /story page spec | Solid-draft | — |
| v2/docs/PARTNER_GUIDE.md | Partner program guide | Solid-draft | — |
| wiki/outputs/2026-05-15-goods-site-audit.md | 13-lens site audit sweep | Shipped | 2026-05-15 |

**Most authoritative:** `v2/docs/EMPATHY_LEDGER_INTEGRATION.md` for arch; `2026-05-15-goods-site-audit.md` for site state.

---

## Asset-register / Field-ops

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/outputs/2026-05-14-asset-register-trip-readiness.md | Asset register readiness for Alice+Utopia trip | Shipped | 2026-05-14 |
| wiki/outputs/2026-05-15-asset-management-handover.md | Asset-register/fleet/brand workstream handover | Solid-draft (resume) | 2026-05-15 |
| wiki/outputs/2026-05-20-field-install-admin-guide.md | Field guide: onboarding admins for bed drops | Live | 2026-05-20 |
| wiki/articles/sources/qr-code-data.md | Source page: QR-code data | Live | — |
| wiki/articles/sources/community-essential-goods-tracking-model.md | Source: essential-goods tracking model | Live | — |
| v2/docs/COMMUNITY_ESSENTIAL_GOODS_TRACKING_MODEL.md | Tracking model for goods moving through community | Solid-draft | — |

**Most authoritative:** `2026-05-15-asset-management-handover.md` (resume entry) + `2026-05-20-field-install-admin-guide.md` (live field guide).

---

## Brand / Comms

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/articles/brand-comms/ (20 files) | Voice/tone, storyteller voices, image library, email templates, pipelines×brand, asset register, slide deck, agent prompt pack, field-notes authoring, EL sync, EL video taxonomy, press-pack EL workflow, consent backlog/process, EL-led architecture, photography brief, production audit, reusable pack POC, STATUS, README | Live (STATUS: 0 voice errors) | May 2026 |
| wiki/outputs/2026-05-26-comms-intern-playbook.md | Comms volunteer/intern playbook | Solid-draft | 2026-05-26 |
| wiki/outputs/2026-05-26-share-format-consultation-menu.md | "How would you like to share this?" menu | Solid-draft | 2026-05-26 |
| wiki/outputs/2026-05-26-reply-to-benjamin-draft.md | Draft reply to Benjamin (Ben's voice) | Rough-draft | 2026-05-26 |
| v2/docs/GOODS_CONTENT_QUICKSTART.md | (also Website) content add quickstart | Live | — |

**Most authoritative:** `wiki/articles/brand-comms/STATUS.md` + the numbered brand-comms system (01–12).

---

## Media / Storytelling (Utopia)

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/outputs/utopia-story-spine-2026-05.md | Working story spine for May Utopia trip feature | Solid-draft | 2026-05 |
| wiki/outputs/utopia-story.html | Built scrollytelling feature (HTML) | Shipped/Live | — |
| wiki/outputs/utopia-feature.html | Utopia feature page (HTML) | Shipped/Live | — |
| wiki/outputs/utopia-media/ (12 jpg + MANIFEST.txt) | Hero/arrive/materials/build/waste/delivery/elders/before-after/offground/next/close imagery | Asset set | — |
| wiki/outputs/2026-05-22-utopia-trip-report.md | Utopia + Alice Springs trip report | Solid-draft | 2026-05-22 |
| wiki/outputs/2026-05-25-utopia-trip-blog-post-ben.md | "Three days in Utopia" blog post | Solid-draft | 2026-05-25 |
| wiki/outputs/2026-05-26-utopia-audience-funnel-plan.md | Utopia story audience/funnel/repackaging plan | Solid-draft | 2026-05-26 |
| wiki/outputs/2026-05-26-utopia-drip-sequences.md | Utopia drip-sequence ready-to-send copy (B2) | Solid-draft | 2026-05-26 |
| wiki/outputs/2026-05-23-field-notes-utopia-session-handoff.md | Field-notes/Utopia story session handoff | Solid-draft (resume) | 2026-05-23 |
| wiki/outputs/2026-05-23-empathy-ledger-prompt-goods-upload-flow.md | EL upload flow + Mykel storyteller prompt | Reference/prompt | 2026-05-23 |
| wiki/outputs/CLAUDE-CODE-HANDOFF-field-notes.md | Field Notes scrollytelling system handoff prompt | Reference/prompt | — |
| wiki/articles/sources/community-voices-from-the-ground.md | Source: community voices | Live | — |
| v2/docs/GOODS - Community Voices from the Ground.md | Community voices long-form doc | Solid-draft | — |
| v2/docs/linkedin-posts-goods.md | Collected Goods LinkedIn posts | Stale (2026-03-26) | 2026-03-26 |

**Most authoritative:** `utopia-story-spine-2026-05.md` (the spine) + `2026-05-26-utopia-audience-funnel-plan.md`.

---

## Fleet / Washing-machines

| Path | What it is | Status | Date |
|---|---|---|---|
| v2/docs/fleet-connectivity-audit-may-2026.md | Connectivity audit — who's dark, why dashboard lied | Solid-draft | 2026-05-05 |
| v2/docs/fleet-alignment-may-2026.md | Assets vs telemetry gap analysis | Solid-draft | 2026-05-05 |
| v2/docs/fleet-machine-history-may-2026.md | Per-machine telemetry life stories (1,861 events) | Solid-draft | 2026-05-05 |
| v2/docs/fleet-pipeline-history-may-2026.md | How data flowed since Aug 2025 (forensics) | Solid-draft | 2026-05-05 |
| v2/docs/fleet-revival-blockers-may-2026.md | Why records stopped + what to try | Solid-draft | 2026-05-05 |
| v2/docs/wash_report_week10_2026_extraction.md | Openfields weekly wash report extraction (ISO wk10) | Data extract | 2026-03 |
| wiki/outputs/2026-05-14-washing-machine-master-listing.md | Every detail per machine (MASTER LISTING) | Solid-draft | 2026-05-14 |
| wiki/outputs/2026-05-14-washing-machine-master-ledger.md | Bought/built/distributed/tracked ledger | Solid-draft | 2026-05-14 |
| wiki/outputs/2026-05-14-washing-machine-full-history.md | Bought/promised/delivered/where-they-are | Solid-draft | 2026-05-14 |
| wiki/outputs/2026-05-14-washing-machine-final-reconciliation.md | "Magic numbers, locked" final reconciliation | Solid-draft | 2026-05-14 |
| wiki/outputs/2026-05-14-washing-machine-reconciliation.md | Asset↔telemetry reconciliation | Solid-draft | 2026-05-14 |
| wiki/outputs/2026-05-14-washing-machine-roll-call.md | One row per machine pre-trip sense-check | Solid-draft | 2026-05-14 |
| wiki/outputs/2026-05-14-washing-machine-talk-to-nic.md | One-page WM audit briefing for Nic | Solid-draft | 2026-05-14 |

**Most authoritative:** `2026-05-14-washing-machine-final-reconciliation.md` ("locked") + `fleet-connectivity-audit-may-2026.md` for tech. Note: this is a large near-duplicate cluster (7 WM ledgers + 5 fleet docs) — strong consolidation candidate for the register.

---

## Communities

| Path | What it is | Status | Date |
|---|---|---|---|
| wiki/articles/communities/ (10 files) | overview + per-community pages (Alice/Oonchiumpa, Palm Island/PICC, Tennant Creek, Maningrida, Ninga Mia/Kalgoorlie, Mt Isa, Darwin, NPY Council) + README | Live | — |
| wiki/outputs/2026-04-27-borroloola-ngardara-strategic-implications.md | Borroloola/Ngardara microgrid strategic implications | Notes | 2026-04-27 |

**Most authoritative:** `wiki/articles/communities/overview.md` (deployment counts + partners).

---

## Operations / Knowledge (compendiums, strategy, ops)

| Path | What it is | Status | Date |
|---|---|---|---|
| v2/docs/COMPENDIUM_MARCH_2026.md | Master compendium — communities, funding, partners, quotes | Live (authoritative) | Mar 2026 |
| v2/docs/COMPENDIUM_JANUARY_2026.md | Prior compendium version | Superseded | Jan 2026 |
| v2/docs/GOODS_COMPENDIUM.md | Content compendium (story/origin) | Stale (likely superseded) | — |
| v2/docs/GOODS_KNOWLEDGE_COMPENDIUM.md | Knowledge compendium v2.0 "Living Document" | Stale/needs-refresh | Jan 2026 |
| v2/docs/GOODS_STRATEGY_PD.md | Strategy product document v1.0 | Solid-draft | Jan 2026 |
| v2/docs/OPERATIONS_HANDBOOK.md | Ecommerce + content ops handbook | Live | — |
| v2/docs/procurement-strategy.md | Procurement strategy (Tim Cook playbook) | Solid-draft | 2026-03-27 |
| wiki/articles/enterprise/ (11 files) | Durable 10 QBE topics: vision, social-objective, business-model, financial-mgmt, strategic-planning/risk, process/tech, governance/data, people/org, legal-structure, investors/capital + README | Live | — |
| wiki/articles/sources/ (21 files) | Source shelf: strategy-PD, march compendium, community voices, facility guide, ops handbook, tracking model, procurement, application draft, snow feedback, funding journey, grants index, go-to-market, market-intel, canonical product data, impact-model data, CASE tool, QBE dashboard, QR data + README | Live | — |
| wiki/articles/support-network/ (6 files) | SIH, PIN, Mint Ellison, advisory-group, cohort-peers + README | Live | — |
| wiki/articles/sources/go-to-market-thousands-2026.md | Go-to-market (scale to thousands) source | Live | — |
| wiki/articles/sources/market-intelligence-2026.md | Market intelligence 2026 source | Live | — |
| wiki/articles/sources/may-2026-founder-working-conversation.md | May 2026 founder working-conversation notes | Notes | 2026-05 |
| wiki/articles/INDEX.md | Master wiki map (authoritative navigation) | Live | Apr 2026 |
| wiki/articles/linked-wikis.md | Cross-wiki ties (ACT Tractorpedia, EL, codebase) | Live | — |
| wiki/outputs/2026-04-16-wiki-restructure-summary.md | April 2026 wiki restructure summary | Reference | 2026-04-16 |
| wiki/outputs/2026-05-12-goods-cockpit.md | Goods Cockpit (Notion-mirror source of truth) | Live (canonical) | 2026-05-12 |
| wiki/outputs/2026-05-12-notion-sync-workflow.md | Notion sync workflow for the cockpit | Live | 2026-05-12 |
| wiki/outputs/2026-05-15-canberra-airport-design-brief.md | Canberra Airport Reconciliation Week install brief | Solid-draft | 2026-05-15 |

**Most authoritative:** `v2/docs/COMPENDIUM_MARCH_2026.md` (master compendium) + `wiki/articles/INDEX.md` (wiki map) + `2026-05-12-goods-cockpit.md` (cockpit source of truth). Note: 4 compendium files in v2/docs (Jan + March + GOODS_ + KNOWLEDGE_) overlap heavily — March 2026 supersedes the rest.

---

## Cross-theme notes for the register

- **Authoritative anchors:** `wiki/articles/INDEX.md` (wiki map), `v2/docs/COMPENDIUM_MARCH_2026.md` (facts), `2026-05-12-goods-cockpit.md` (live cockpit), `2026-05-27-goods-crm-pipeline-operating-model.md` (CRM), `wiki/articles/brand-comms/STATUS.md` (brand).
- **Known-stale clusters:** the 7 washing-machine ledgers (2026-05-14) + 5 fleet docs (2026-05-05) are near-duplicates; the 4 v2/docs compendiums overlap; LinkedIn scrapes (2026-03-26) are dated. Financial-model Day 1–10 baselines partly superseded by the 2026-05-27 live Xero pull (voided Centrecorp invoices).
- **Draft/consent-gated:** Eloise outreach + SIH advisory acceptance are explicit DRAFTs under the AI-human-in-loop policy.
