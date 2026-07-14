# The Goods artifact base

> Generated 2026-07-03 by `v2/scripts/artifact-base-sync.mjs`. 46 artifacts, 0 dead location(s).

1. `canon.ts` holds the numbers; every figure in every artifact traces to a canon fact.
2. `artifact-register.json` is the single index of the artifact base.
3. `check-artifact-drift.mjs` (Loop B) guards citations when a canon fact moves.
4. This file is GENERATED. Edit the register, not this file.
5. The Notion data room front door mirrors this surface, and the two live databases (Funder Pipeline, QBE Opportunity Register) carry pipeline and commitments.

## PUBLIC (live-public routes)

- **Public pitch page + document (/pitch)**: public pitch page and document. `https://goodsoncountry.com/pitch` (live-public, last verified 2026-05-30, check 2026-07-03: HTTP 200)
- **Cost-story (/cost-story)**: public cost story. `https://goodsoncountry.com/cost-story` (live-public, last verified 2026-06-02, check 2026-07-03: HTTP 200)
- **Impact page (/impact)**: public impact page. `https://goodsoncountry.com/impact` (live-public, last verified 2026-06-03, check 2026-07-03: HTTP 200)
- **Asset register + bed records (/bed)**: QR bed records, public asset proof. `https://goodsoncountry.com/bed/GB0-156-40` (live-public, last verified 2026-06-06, check 2026-07-03: HTTP 200)
- **Communities + insights**: communities served and insights. `https://goodsoncountry.com/communities` (live-public, last verified 2026-05-30, check 2026-07-03: HTTP 200)
- **Community Stories + Empathy Ledger (/stories)**: community stories from the Empathy Ledger. `https://goodsoncountry.com/stories` (live-public, last verified 2026-06-17, check 2026-07-03: HTTP 200)
- **Utopia field note**: Utopia field note. `https://goodsoncountry.com/field-notes/utopia-may-2026` (live-public, last verified 2026-06-17, check 2026-07-03: HTTP 200)

## GATED REVIEWER (live-gated routes + evidence pack)

- **Pitch Page and Documents (Notion)**: Notion pitch page for reviewers. `https://app.notion.com/p/373ebcf981cf80748e1ef80e281b8fd6` (live, last verified 2026-06-02, check 2026-07-03: notion, not checked)
- **Cost Lab (/sites/cost-lab)**: interactive cost model for reviewers. `https://goodsoncountry.com/sites/cost-lab` (live-gated, last verified 2026-06-05, check 2026-07-03: HTTP 200 (password wall, auth not followed))
- **Investor cockpit (/investors)**: investor cockpit with live figures. `https://goodsoncountry.com/investors` (live-gated, last verified 2026-06-05, check 2026-07-03: HTTP 200 (password wall, auth not followed))
- **Machine Dashboard (Notion)**: weekly machine dashboard in Notion. `https://app.notion.com/p/390ebcf981cf8158ad49eb0461538324` (live, last verified 2026-07-02, check 2026-07-03: notion, not checked)

## SEND-READY (design files + funder briefs)

- **Pencil designed deck**: Pencil deck, predecessor of invest-deck-full. `design/goods-theory-of-change-v2.pen` (in-build, last verified 2026-06-02, check 2026-07-03: file present (in build))
- **SEFA Loan Fund application brief (DRAFT)**: SEFA loan application brief. `wiki/outputs/funder-reports/sefa/2026-06-27-sefa-loan-application-brief.pdf` (written, last verified 2026-06-27, check 2026-07-03: file present)
- **Snow Foundation first-mover brief (DRAFT)**: Snow first-mover brief. `wiki/outputs/funder-reports/snow/2026-06-27-snow-first-mover-brief.pdf` (written, last verified 2026-06-27, check 2026-07-03: file present)
- **Centrecorp next-round beds brief (DRAFT)**: Centrecorp next-round beds brief. `wiki/outputs/funder-reports/centrecorp/2026-06-27-centrecorp-nextround-brief.pdf` (written, last verified 2026-06-27, check 2026-07-03: file present)
- **Investment deck (16 slides, rendered)**: the 16-slide investment deck. `design/brand/claude-design/invest-deck-full.html` (built, last verified 2026-07-01, check 2026-07-03: file present)
- **Funder one-pager (rendered)**: funder one-pager. `design/brand/kit/funder-onepager.html` (built, last verified 2026-07-01, check 2026-07-03: file present)
- **Funder landscape one-pager (internal, SIH-facing)**: internal funder landscape one-pager. `design/brand/kit/funder-landscape-onepager.html` (built, last verified 2026-07-01, check 2026-07-03: file present)
- **Next-phase one-pager (rendered)**: next-phase one-pager, in build. `design/brand/kit/next-phase-onepager.html` (in-build, last verified 2026-07-02, check 2026-07-03: file present (in build))

## INTERNAL WORKING (repo docs, code, skills)

- **19-slide deck blueprint**: deck blueprint, predecessor of invest-deck-full. `wiki/outputs/2026-06-02-qbe-catalytic-pitch/00-MASTER-pitch-deck-blueprint.md` (written, last verified 2026-06-02, check 2026-07-03: file present)
- **Catalytic pitch bundle (7 docs)**: seven-doc catalytic pitch bundle. `wiki/outputs/2026-06-02-qbe-catalytic-pitch/` (written, last verified 2026-06-02, check 2026-07-03: file present)
- **Cost model v6 engine**: cost model v6 engine code. `v2/src/lib/cost-model/engine.ts` (built, last verified 2026-05-29, check 2026-07-03: file present)
- **Best-case scenario (seed fleet of 3)**: seed fleet of 3 scenario. `wiki/outputs/2026-06-05-goods-best-case-scenario.md` (modelled, last verified 2026-06-05, check 2026-07-03: file present)
- **Cost Lab playbook**: how to run the Cost Lab. `wiki/outputs/2026-06-05-cost-lab-playbook.md` (written, last verified 2026-06-05, check 2026-07-03: file present)
- **Canonical numbers sheet**: the canonical numbers in one sheet. `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md` (written, last verified 2026-05-29, check 2026-07-03: file present)
- **Centrecorp + Utopia impact reports**: Centrecorp and Utopia impact reports. `wiki/outputs/2026-05-18-centrecorp-utopia-impact-report.md` (written, last verified 2026-05-18, check 2026-07-03: file present)
- **Ledger-story pipeline**: skill that drafts ledger stories. `.claude/skills/ledger-story` (built, last verified 2026-06-17, check 2026-07-03: file present)
- **Storyteller triage**: storyteller consent triage. `wiki/outputs/2026-06-03-storyteller-triage.md` (written, last verified 2026-06-17, check 2026-07-03: file present)
- **Cleared-voice roster**: locked roster of cleared voices. `wiki/outputs/2026-06-02-qbe-catalytic-pitch/05-goods-voice-map.md` (locked, last verified 2026-06-17, check 2026-07-03: file present)
- **Impact measurement method (consent-cleared voices)**: impact measurement method. `wiki/outputs/2026-06-13-goods-strategic-pack/05-impact-measurement-method.md` (written, last verified 2026-06-17, check 2026-07-03: file present)
- **Scored risk register (14 risks)**: scored risk register. `wiki/articles/governance/risk-register.md` (written, last verified 2026-06-13, check 2026-07-03: file present)
- **Governance & data framework**: governance and data framework. `wiki/outputs/2026-06-13-goods-strategic-pack/18-governance-framework.md` (written, last verified 2026-06-16, check 2026-07-03: file present)
- **12-month role map & founder-dependency plan**: 12-month role map. `wiki/outputs/2026-06-13-goods-strategic-pack/07-role-map.md` (written, last verified 2026-06-17, check 2026-07-03: file present)
- **Entity wording block (legal structure)**: entity wording block. `wiki/outputs/2026-06-13-goods-strategic-pack/04-entity-wording-block.md` (written, last verified 2026-06-17, check 2026-07-03: file present)
- **Area 09 legal structure full review**: Area 09 legal structure review. `wiki/outputs/2026-05-29-qbe-area-09-legal-structure-full-review.md` (written, last verified 2026-06-17, check 2026-07-03: file present)
- **Legal structure (wiki article)**: legal structure wiki article. `wiki/articles/governance/legal-structure.md` (written, last verified 2026-06-17, check 2026-07-03: file present)
- **Investor Alignment Tool (SIH, populated, canonical)**: SIH investor alignment tool. `wiki/outputs/2026-06-16-qbe-opportunity-hub/02-investor-alignment.md` (written, last verified 2026-06-17, check 2026-07-03: file present)
- **Investor Alignment Tool (CASE, populated, intel)**: CASE investor alignment tool. `wiki/outputs/2026-06-13-goods-strategic-pack/12-investor-alignment.md` (written, last verified 2026-06-17, check 2026-07-03: file present)
- **Expanded funding-source audit (web + GrantScope, verified top tier)**: 215-source funding audit. `wiki/outputs/2026-06-27-funding-source-audit/` (written, last verified 2026-06-28, check 2026-07-03: file present)
- **Funding pipeline refresh: open-now shortlist with live-verified dates**: open-now funding shortlist. `wiki/outputs/2026-06-28-funding-refresh/` (written, last verified 2026-06-28, check 2026-07-03: file present)
- **Investment machine review (Notion + design surfaces)**: review of Notion and design surfaces. `wiki/outputs/2026-07-02-investment-machine/01-notion-and-design-review.md` (written, last verified 2026-07-02, check 2026-07-03: file present)
- **Investor targets shortlist (July 2026)**: July 2026 investor target shortlist. `wiki/outputs/2026-07-02-investment-machine/02-investor-targets.md` (written, last verified 2026-07-02, check 2026-07-03: file present)
- **Investment machine blueprint (GHL + Notion operating system)**: the investment machine operating blueprint. `wiki/outputs/2026-07-02-investment-machine/03-machine-blueprint.md` (written, last verified 2026-07-02, check 2026-07-03: file present)
- **Pipeline strategy and five-bucket reconciliation (July 2026)**: pipeline strategy 20260703. `wiki/outputs/2026-07-03-pipeline-strategy.md` (written, last verified 2026-07-03, check 2026-07-03: file present)
- **New outreach drafts (LendForGood, Metro, Tripple)**: drafts for LendForGood, Metro and Tripple. `wiki/outputs/2026-07-02-investment-machine/04-new-outreach-drafts.md` (written, last verified 2026-07-02, check 2026-07-03: file present)
- **Monday one-pager generator**: generates the Monday one-pager. `v2/scripts/monday-onepager.mjs` (built, last verified 2026-07-02, check 2026-07-03: file present)

