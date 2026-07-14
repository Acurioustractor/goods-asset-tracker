# Area 7 — Governance, Data & Reporting

Status: Built — needs founder review · Priority: P0 · Diagnostic: Priority gap
Owner: Ben · Last built: 2026-05-29

## Summary (founder can say this in the meeting)

Governance, data and reporting is the priority gap we should own plainly — we are not pretending advisory support is a board. We do have real foundations: founder accountability with Ben and Nic, a named advisory group that meets monthly, First Nations and technical partners (Oonchiumpa, Kristy Bloomfield, Dianne Stokes, Zinus, Defy Design), genuine data-sovereignty practice through Empathy Ledger consent and story review, an AI human-in-loop policy for external materials, and a live admin reporting backbone for funders, communities, assets and stories. The next phase is to formalise the system: who advises, who decides, who reviews data, and what gets reported monthly, quarterly and annually. The honest line is that this is meaningful foundations, not yet a mature governance system for the new trading entity — and the work to close it is founder-authored and signed paperwork, not more narrative.

## Where we are (progress since the V4 diagnostic)

The diagnostic flagged three gaps: no formal governance/accountability structure for the new Pty Ltd, missing commercial/social-enterprise scale-up experience on the advisory committee, and reporting driven by individual grant requirements rather than a consolidated annual cycle. It said what is still needed before external use is formal board/advisory terms, delegations, conflicts and a reporting calendar.

Since V4 we have built the analysis and v0.1 drafts for all of those: a governance current-state memo, a board/advisory skills matrix (which names the commercial scale gap explicitly), a reporting calendar with cadences and owners, and a data-sovereignty and consent one-pager. These are drafted in the review and ready to lift into Notion. The verified evidence behind them is real — `/admin/reports` generates per-funder reports from live data, `/admin/communities` joins a 27-record community register to live rollups, and Empathy Ledger holds 376 Goods stories with 376 marked explicit consent and 221 still pending elder review (verified 2026-05-28). What is still missing is the founder-signed version of each artifact, plus a one-page governance map and a board-ready conflicts register and risk register.

## Priorities (next builds — signed collateral, not more story)

1. Convert the governance current-state memo into a one-page founder-reviewed note with a governance map (ACT / Goods / Butterfly / community entities / advisory / accountability) — and write advisory group terms of reference that state plainly "advisory, not fiduciary board".
2. Founder-review and publish the board/advisory skills matrix and reporting calendar to Notion, assigning an owner and due date to each reporting cadence.
3. Draft the delegations / decision-rights matrix and a conflict-of-interest register with related-party safeguards (needed before Butterfly, ACT/Goods and community operators transact).
4. Clean `/admin/team` so advisory members are separated from support-network members (it currently renders Adeem and Dr Simon Quilty as advisory board), add an "advisory, not legal board" badge, and add a founder-review status to generated funder reports.

## Public-copy risk for this area

Do not present the advisory group as a formal board, treat monthly check-ins as board governance, or imply the new Pty Ltd has a settled independent governance structure. Do not call the Butterfly transition complete (or Butterfly the Goods charitable home) before director changes, ACNC/ASIC updates and audit are done. Do not say all stories are public-shareable — 221 EL stories are pending elder review. Do not expose raw community, household, contact, story or support records, or present generated funder reports as final without founder review. Adjacent areas carry the harder copy risks (600+ beds, $445K, $778,162, ~$3M stack, DGR1, On-Country "made" wording); for Area 7 specifically the DGR1 / Butterfly-complete framing is the one to watch.

## Proof links

- Area 07 Notion page (P0): https://www.notion.so/36eebcf981cf813e9b6fc95d4e5a703a
- Data Sovereignty Notion page: https://www.notion.so/348ebcf981cf81bbaf25c78d20cdfe2e
- AI Human-in-Loop Policy Notion page: https://www.notion.so/36debcf981cf81f7a004db874035770c
- Butterfly Movement Transition Plan: https://www.notion.so/1d97e1380abf4e7aa0b79e001e5fe2bd
- Full review: `wiki/outputs/2026-05-29-qbe-area-07-governance-data-reporting-full-review.md`
- Canonical numbers: `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md`
- Wiki sources: `wiki/articles/enterprise/07-governance-data-reporting.md`, `wiki/articles/governance/board-structure.md`, `wiki/articles/governance/data-sovereignty.md`, `wiki/articles/governance/policies-register.md`, `wiki/articles/support-network/advisory-group.md`
- Admin proof: `/admin/reports`, `/admin/funders`, `/admin/team`, `/admin/communities`, `/admin/el-stories`; screenshots in `output/playwright/qbe-area07/`
- Report metrics resolver: `v2/src/lib/funders/metrics.ts`; advisory data source: `v2/src/lib/data/compendium.ts`
