---
name: QBE Review Index
description: One-page landing that gathers every QBE Catalysing Impact artefact for your review - wiki articles, diagnostic pack, admin dashboards, raw sources.
---

# QBE Catalysing Impact 2026 — Review Index

> Everything QBE in one place. Browse the wiki articles via wikilinks, hit the live dashboards on the dev server, or open raw sources from disk. Password for `/insiders`: `goods2026` (env: `INSIDERS_PASSWORD`).

## 📁 Raw documents (Google Drive)

**[Goods on Country — Grants Archive](https://drive.google.com/drive/folders/1HhLJ0k66oc8tQ9-yugN7JD4MX_JE2y1v)** — single Drive folder with subfolders for every funder. Drop downloaded PDFs in here and they're shareable with the crew.

Inside:
- **[FUNDING-JOURNEY](https://drive.google.com/file/d/1yLRSBBp-KOqAuuUNUksolfgMHko-8YzEcHyqnlszIC8)** — one-page narrative summary (read first)
- **[INDEX](https://drive.google.com/file/d/1bdI31ySk1XShRpuN1eeZHjCSB1aX6mVyZL1JiB9gjWU)** — full source-by-source treasure map
- 19 funder/partner subfolders (FRRR+VFFF, Snow, TFN, AMP Spark, Dusseldorp, QBE, REAL Innovation, Rotary, Minderoo, PRF, TFFF, Bryan Foundation, partner-letters, Anyinginyi, Our Community Shed, Bunnings, Civeo, Zinus, PICC)

Local mirror in repo: `wiki/raw/grants-archive/`.

## 1. Program

- [[program/qbe-catalysing-impact-2026]] — program overview
- [[program/program-structure]] — Stage 1 + Stage 2
- [[program/program-expectations]] — cohort obligations
- [[program/key-dates]] — every program date
- [[program/stage-2-funding]] — Sep 2026 submission
- [[program/weekly-actions]] — cross-ref to live dashboard
- [[program/diagnostic-pack]] — pointer to the 10 topics
- [[program/cover-letter]] — diagnostic cover letter

## 2. Diagnostic pack (10 topics, durable)

- [[enterprise/01-vision-and-ambition]]
- [[enterprise/02-social-objective-impact]]
- [[enterprise/03-business-model]]
- [[enterprise/04-financial-management]]
- [[enterprise/05-strategic-planning-risk]]
- [[enterprise/06-process-and-technology]]
- [[enterprise/07-governance-data-reporting]]
- [[enterprise/08-people-and-organisation]]
- [[enterprise/09-legal-structure]]
- [[enterprise/10-investors-capital-raising]]

Working drafts (time-boxed for the session) at `thoughts/shared/qbe-program/diagnostic/`.

## 3. Capital, investors, governance, impact

- [[capital/README|Capital]] — instruments, blended finance, catalytic capital, our stack
- [[investors/README|Investors]] — profiles, alignment tool, pipeline
- [[governance/README|Governance]] — board, risk, legal, compliance
- [[impact/README|Impact]] — ALMA, theory of change, Empathy Ledger
- [[support-network/README|Support network]] — SIH, PIN, Mint Ellison, advisory, cohort peers
- [[products/README|Products]] — Stretch Bed, washing machines
- [[communities/README|Communities]] — deployment partners

## 4. Live admin dashboards (v2)

Dev server: `cd v2 && npm run dev` → http://localhost:3000 (or next free port).

- `/admin/qbe-program` — capital command centre, investor matches, timeline
- `/admin/qbe-actions` — 10-week checklist
- `/admin/loi-tracker` · `/admin/finance-model` · `/admin/foundation-matcher` · `/admin/strategy` · `/admin/growth`

## 5. April 2026 mentor prep outputs

These are the meatiest mentor-prep artefacts. Read in order when resuming:

- `wiki/outputs/2026-04-25-qbe-mentor-prep-ceo-review.md` — Mentor pack design, top 5 questions, 7-day sprint
- `wiki/outputs/2026-04-25-qbe-ecosystem-inventory.md` — Three-repo asset map (Goods v2, Grantscope, ACT), revised pack design (live walkthrough + 4-page PDF + 1-page ACT credibility), meta-review revisions
- `wiki/outputs/2026-04-25-qbe-diagnostic-readiness-ledger.md` — 10-domain Solid vs Needs Work audit. Working tool for the 3-hour PIN diagnostic. 18-action stack
- `wiki/outputs/2026-04-27-borroloola-ngardara-strategic-implications.md` — ARENA-backed Ngardara microgrid; adopt as pattern, explore as thread, push back on scope creep
- `wiki/outputs/2026-04-27-qbe-prep-session-handoff.md` — Single resume entry point, top 5 critical actions, diagnostic scoreboard

## 6. Thoughts (working drafts)

- `thoughts/shared/qbe-program/submission-strategy.md`
- `thoughts/shared/qbe-program/session-1-learnings.md`
- `thoughts/shared/qbe-program/weekly-action-plan.md`
- `thoughts/shared/qbe-program/pfi-application-summary.md`
- `thoughts/shared/qbe-program/diagnostic/` — 10 topic drafts + INDEX + cover letter

## 7. Supplementary docs (outside the wiki)

Other grant materials and reference docs the mentor may want. Not published to `/insiders` — share as PDF or repo link on request.

| Doc | Path | Why useful |
|---|---|---|
| Snow Foundation pitch + funder feedback | `v2/docs/Final Snow pitch with Snow feedback and reflections.md` | Demonstrates reflexivity: shows how a successful funder critiqued us and what we changed |
| Snow submission self-review (Feb 2026) | `SNOW_SUBMISSION_REVIEW_FEBRUARY_2026.md` | Self-critique of our own pitch quality |
| PFI application summary | `thoughts/shared/qbe-program/pfi-application-summary.md` | $640K repayable grant in pipeline |
| Catalysing Impact application draft | `Catalysing_Impact_Application_DRAFT.md` | The actual EOI we submitted |
| Goods Compendium March 2026 | `v2/docs/COMPENDIUM_MARCH_2026.md` | Single doc with all community data, funding, partners |
| Go-to-market — Thousands | `GO_TO_MARKET_THOUSANDS_2026.md` | Path from 389 deployed to thousands |
| Market intelligence 2026 | `MARKET_INTELLIGENCE_2026.md` | Competitor + remote procurement landscape |
| Operations handbook | `v2/docs/OPERATIONS_HANDBOOK.md` | Production run-book; addresses key-person risk |
| Production facility guide | `v2/docs/PRODUCTION_FACILITY_GUIDE.md` | Plant manual; supports community-ownership-as-end-state |
| Community partner guide | `v2/docs/PARTNER_GUIDE.md` | How communities engage; legitimises PICC handover plan |
| Procurement strategy | `v2/docs/procurement-strategy.md` | IPP, Indigenous procurement, 8 channels |
| Strategy PD | `v2/docs/GOODS_STRATEGY_PD.md` | Position description / strategy summary |
| ACT 5-year cashflow model | `act-global-infrastructure/wiki/finance/five-year-cashflow-model.md` | Until Goods-only 3-statement v0.1 lands, this is the closest thing |
| R&DTI claim strategy | `act-global-infrastructure/wiki/finance/rdti-claim-strategy.md` | Backs the R&D refund line in capital stack |
| **Grants archive index** | `wiki/raw/grants-archive/INDEX.md` | Treasure-map of every Goods grant application/report/letter (FRRR, Snow, REAL Innovation, Rotary, TFN, VFFF, AMP, PFI, Minderoo, Centrecorp). Drop downloaded PDFs into matching subfolder. |

## 8. Raw sources (disk only — not published)

All in `wiki/raw/`:

| File | What |
|---|---|
| `2026-02-qbe-expression-of-interest.pdf` | EOI submission |
| `2026-03-31-qbe-induction-slides.pdf` | Full induction deck |
| `2026-03-31-qbe-induction-slides-fulltext.md` | Text-only capture |
| `2026-03-31-qbe-induction-slides-summary.md` | Pre-existing summary |
| `2026-03-31-qbe-enterprise-agreement-signed.pdf` | Signed program agreement |
| `2026-03-31-qbe-funder-letter-act.pdf` | QBE letter to funders (ACT version) |
| `2026-03-31-qbe-letter-to-funders.pdf` | Template funder letter |
| `2026-03-31-investor-alignment-tool-case.xlsx` | CASE Smart Impact Capital tool |
| `2026-04-02-email-jay-boolkin-qbe-induction-recap.md` | Post-induction recap |

## 9. Publish guidance

See [PUBLISH.md](../PUBLISH.md) for Obsidian Publish setup and what to share externally vs keep internal.

## 10. Related

- [[linked-wikis]] — ACT Tractorpedia, Empathy Ledger, codebase
- [[INDEX]] — full wiki map
