# QBE Diagnostic Final Sweep And Handoff Prompt

Date: 2026-05-29
Status: Final internal sweep before handoff

## Final high-level sweep

The 10-area diagnostic build is complete as an internal review set. All ten QBE diagnostic areas now have local full-review artifacts, Area 10 is built in Notion, the cross-area review has been updated, and a canonical numbers sheet exists to stop conflicting claims from leaking into the meeting.

The story is strong but must be handled with discipline:

- Goods has real product proof, asset tracking, buyer/funder pipeline, cost modelling, admin/reporting tooling, legal/governance work, and a QBE Stage 2 pathway.
- The investor-readiness gap is not more story. It is founder-authored external collateral, signed/eligible LOIs, QBE matched-funding evidence, a use-of-funds budget, and cleanup of public/funder copy.
- Anything shared externally must separate verified, modelled, target, future and internal-only claims.

## What is complete

| Area | Internal artifact status | Still needed before external use |
|---|---|---|
| 01 Vision & Ambition | Full review built | Founder-authored 1-3 page narrative and operating model diagram. |
| 02 Social Objective & Impact | Full review built | Impact provenance labels on `/impact`, Theory of Change graphic, public/internal claim split. |
| 03 Business Model | Full review built | Buyer sheet, route pricing, clean LOI tracker, market sizing. |
| 04 Financial Management | Full review built | Goods-only 3-statement model, founder FTE costing, accountant-reviewed summary. |
| 05 Strategic Planning & Risk | Full review built | Board-grade risk register with owners, review cadence, trigger table. |
| 06 Process & Technology | Full review built | SOP ownership, stale-data checklist, founder-dependency reduction plan. |
| 07 Governance, Data & Reporting | Full review built | Formal board/advisory terms, delegations, conflicts, reporting calendar. |
| 08 People & Organisation | Full review built | GM/BD role approval, founder FTE allocation, hiring/capacity plan. |
| 09 Legal Structure | Full review built | Legal review, IP register, contracting-party checklist, mission protection memo. |
| 10 Investors & Capital Raising | Full review built | Founder-authored investor pack, signed LOIs, confirmed QBE terms, cleaned funder copy. |

## Key source artifacts

- `wiki/outputs/2026-05-28-qbe-area-01-vision-full-review.md`
- `wiki/outputs/2026-05-28-qbe-area-02-impact-full-review.md`
- `wiki/outputs/2026-05-28-qbe-area-03-business-model-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-04-financial-management-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-05-strategic-planning-risk-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-06-process-technology-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-07-governance-data-reporting-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-08-people-organisation-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-09-legal-structure-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-10-investors-capital-raising-full-review.md`
- `wiki/outputs/2026-05-29-qbe-cross-area-alignment-review.md`
- `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md`

Notion:

- Area 10: https://www.notion.so/36eebcf981cf81329a11e33e2d121bf9
- Canonical numbers child page: https://www.notion.so/36febcf981cf81788bfdf0833c553844
- Goods HQ: https://www.notion.so/177ebcf981cf805fb111f407079f9794

Screenshots:

- `output/playwright/qbe-area10/`

## Canonical meeting numbers

Use these only with their definitions:

- 496 deployed bed units tracked in the register, including current Stretch Beds and legacy Basket Beds.
- 520 bed asset rows, meaning row count, not delivered quantity.
- 633 bed units recorded across all bed statuses, including deployed, ready, allocated, requested and demo.
- 674 total product quantity recorded across beds and washing machines.
- 27 community records in admin; 10 communities represented in asset records.
- AU$750 current active Stretch Bed shop price for `stretch-bed-single`.
- AU$732,210.79 ACT-GD active receivable invoices in the ACT infra Xero mirror; this is a workpaper figure, not audited Goods revenue.
- AU$3,418,698 active CRM pipeline and AU$604,040 weighted active pipeline; internal only, not committed capital or QBE match evidence.

## Unsafe claims still present in website/admin code

These are the highest-risk items found in the final sweep:

- `v2/src/lib/data/funder-shared-content.ts`: `600+` beds shipped, `$445K` grant funding, `~$3M` capital stack target, committed buyer pipeline wording.
- `v2/src/lib/data/funder-pages.ts`: Minderoo page says `DGR1 status`, `fully unlocks the QBE match`, `de-risks SEFA`, permanent community-owned asset language, and strong On-Country manufacturing claims.
- `v2/src/lib/data/grant-content.ts`: `$778,162 in grant funding received`, ownership transfer language, local production claims, and outdated deployed bed/machine figures.
- Public pages still use 369+, 400+, 520+ and other stale/ambiguous numbers.
- Several pages say or imply made/manufactured On-Country rather than designed for or moving toward On-Country production.
- Advisory/support network language can read as formal board/governance.

Do not share funder pages or grant composer output externally until these are cleaned or clearly caveated.

## Next build sequence

1. Build the LOI tracker in Notion/admin.
2. Build the QBE matched-funding evidence checklist beside it.
3. Confirm QBE Stage 2 cap, eligible match rules, accepted instruments and evidence format with SIH/QBE.
4. Clean `funder-shared-content.ts`, `funder-pages.ts` and `grant-content.ts`.
5. Add canonical count/provenance language to public pages and funder pages.
6. Build founder-authored investor pack from the Area 10 skeleton.
7. Refresh production and inventory data before any live admin demo.
8. Build the contracting-party checklist from Area 09.

## Handoff prompt

Paste this into the next session:

```text
You are working in /Users/benknight/Code/Goods Asset Register. Follow AGENTS.md: active codebase is v2/, do not modify deploy/, and never use Supabase MCP for v2 because it points at the wrong project. Use direct env/curl/psql/supabase-js for v2 project cwsyhpiuepvdjtxaozwf.

Context: We completed a full QBE/SIH diagnostic artifact build across all 10 areas for Goods on Country. The internal review set is complete, but external investor/funder material is not safe yet. Read these first:
- wiki/outputs/2026-05-29-qbe-cross-area-alignment-review.md
- wiki/outputs/2026-05-29-qbe-area-10-investors-capital-raising-full-review.md
- wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md
- wiki/outputs/2026-05-29-qbe-final-sweep-and-handoff-prompt.md
- Area 10 Notion page: https://www.notion.so/36eebcf981cf81329a11e33e2d121bf9
- Canonical numbers Notion page: https://www.notion.so/36febcf981cf81788bfdf0833c553844

The immediate next job is to build the LOI tracker and QBE matched-funding evidence checklist. Do not start by writing more narrative. The status ladder is: target, research-only, warm, active conversation, draft proposal, verbal support, draft LOI, signed LOI, contract, cash received. Required LOI tracker columns: target organisation, type, evidence source, ask amount, units/order basis, QBE match eligibility, status, contracting entity, blocker, next action, owner, due date, external wording.

Canonical meeting numbers: 496 deployed bed units tracked; 520 bed asset rows; 633 bed units across all bed statuses; 674 total product units including machines; 27 community records; 10 communities in asset records; AU$750 active Stretch Bed shop price; AU$732,210.79 ACT-GD active receivable invoices in Xero mirror, workpaper only; AU$3.42M active CRM pipeline, not committed capital.

Public/funder copy risks to clean before sharing: v2/src/lib/data/funder-shared-content.ts has 600+ beds, $445K funding, ~$3M stack and committed buyer pipeline language; v2/src/lib/data/funder-pages.ts has DGR1 status, fully unlocks QBE, de-risks SEFA and overstrong community ownership language; v2/src/lib/data/grant-content.ts has $778,162 grant funding and stale DGR/ownership/local production claims. Public pages still use 369+, 400+, 520+ and On-Country wording too strongly.

Build outputs next:
1. A Notion/admin LOI tracker with the status ladder and proof links.
2. A QBE matched-funding evidence checklist with eligible match rules, evidence status and owner.
3. A code cleanup pass for funder-shared-content.ts, funder-pages.ts and grant-content.ts using the canonical numbers sheet.
4. A founder-authored investor pack skeleton only after LOI/evidence structure is in place.

Verification expectation: say verified with evidence, or unverified and what was not checked. If querying Supabase, state that direct v2 project cwsyhpiuepvdjtxaozwf was used and Supabase MCP was not used.
```

## Verification status

Verified:

- All 10 local area artifacts exist.
- Cross-area review says all 10 areas are complete as an internal review set.
- Area 10 Notion page is built and links to the canonical numbers page.
- Canonical numbers page exists in Notion and the detailed local sheet exists.
- Final code/source sweep found the unsafe claims listed above.

Unverified:

- I did not run a production build because this pass made documentation/handoff files only.
- I did not confirm QBE Stage 2 cap/rules with QBE/SIH directly.
- I did not repair website copy in this pass; I only identified the risky files and claims.
