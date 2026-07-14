# QBE Area 9 — Legal Structure

Status: Built — needs founder and legal review
Diagnostic status: Partial (high-priority)
Priority: P1 (shapes what can be said externally; does not block the meeting itself)
Claim labels in play: verified · target · future · internal only

## Summary (say this in the meeting)

Goods has a working trading base, a clear community-ownership ambition, and a confirmed charitable-vehicle pathway, but the structure is mid-migration, so we are precise about what is settled and what is not. The entities themselves are confirmed: Goods trades today through Nicholas Marchesi as sole trader (ABN 21 591 780 066); the go-forward trading/operating company is A Curious Tractor Pty Ltd (ACN 697 347 676, t/a Goods on Country), which the whole operation migrates to this financial year (FY2026-27); and The Butterfly Movement Ltd is the confirmed charity/DGR home from FY2026-27 (~1 July 2026), gifted from TABOO Foundation. A Kind Tractor Ltd is dormant and not used. The Butterfly Movement Ltd is a verified active ACNC charity, PBI and Item 1 DGR (ABN Lookup, extracted 6 May 2026); DGR is only ever via Butterfly, never via Goods / A Curious Tractor / A Kind Tractor directly. Community-controlled production entities are the destination, not a current fact. The honest line: "We know the structure has to carry three jobs: trading and product risk, charitable funding, and future community-controlled production. The entities are confirmed and the migration is underway; the next phase is to paper the entity map, IP logic, benefit-share and trigger points so community ownership is real, not rhetorical."

## Where we are vs the diagnostic

The diagnostic flagged that the incorporated entity is new, that specialist legal advice is needed to map community-ownership options and trigger points, that the Goods-vs-ACT separation decision should be informed by legal/funding/timing advice, and that mission-protection mechanisms should be considered as Goods matures.

Progress since V4: the entity structure is now confirmed (sole trader today → A Curious Tractor Pty Ltd as the go-forward trading company this FY → The Butterfly Movement Ltd as the DGR home from FY2026-27), there is a live Butterfly handover plan (board meeting ~1 June, handover target 26 June, audited statements 1 October), and A Kind Tractor Ltd is confirmed dormant and not used (not the trading entity, not the charity, not DGR). The full review also produced v0.1 of every artifact the diagnostic asked for: a current legal-reality one-pager, entity-option memo, ownership-trigger map, IP/licence/benefit-share memo, mission-protection note and contracting-party checklist.

What is still missing is the part only a founder and lawyer can finish: confirming A Curious Tractor Pty Ltd's ABN (only the ACN is captured) and the final trading-name form, settling the applicant/contracting entity per grant during the migration, a populated IP register, a contracting-party checklist wired into the public site/buyer sheets, and a mission-protection memo confirmed by advisors. The gap is migration paperwork and cleaned copy, not more narrative.

## Priorities (next builds)

1. Commission the legal review (Standard Ledger / Mint Ellison) to confirm A Curious Tractor Pty Ltd's ABN (ACN 697 347 676 already captured), directors and GST, set the migration plan from the sole trader to the company this FY, and confirm seller-of-record for Stripe and institutional contracts.
2. Populate the one-page IP register (Stretch Bed, Basket Bed, washing machine, plant design, brand, data, stories, cultural names) with columns for current owner, evidence, community contribution, intended future owner, licence/benefit-share model and external-use status.
3. Quarantine the stale legal/DGR claims in live code and funder pages: `grant-content.ts` (A Kind Tractor identity + ABN + DGR true; A Kind Tractor is dormant and not used, trading entity is A Curious Tractor Pty Ltd), `content.ts` ("We don't license. We transfer"), `funder-pages.ts` Minderoo "DGR1 status". Add a legal source-of-truth so the grant composer cannot emit unsourced eligibility claims (DGR is via The Butterfly Movement Ltd only, from FY2026-27).
4. Wire the contracting-party checklist into `/terms` and `/privacy` (legal entity, ABN/ACN, GST, seller of record, warranty provider) once the migration to A Curious Tractor Pty Ltd is confirmed.

## Public-copy risk (this area)

Specific unsafe claims for Area 09: "DGR1 status" as a Goods claim (DGR is via The Butterfly Movement Ltd only, from FY2026-27, never via Goods / A Curious Tractor / A Kind Tractor directly); A Kind Tractor Ltd shown as the Goods entity / DGR-true in `grant-content.ts` (A Kind Tractor is dormant and not used; the trading entity is A Curious Tractor Pty Ltd, ACN 697 347 676); stale grant-funding boilerplate in the same file (canonical is ~$576K + $202K grant funding); "We don't license. We transfer" and "40% community share" as if committed; any claim that Goods has its own DGR, that community ownership / local production entities are legally complete, or that the Butterfly DGR vehicle is live before the FY2026-27 handover. Adjacent sweep risks to keep off external pages: bed counts other than 496 deployed across 10 communities, price other than $750, ~$3M stack, On-Country "made" wording.

## Proof links

- Full review: `wiki/outputs/2026-05-29-qbe-area-09-legal-structure-full-review.md`
- Canonical numbers: `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md`
- Cross-area alignment: `wiki/outputs/2026-05-29-qbe-cross-area-alignment-review.md`
- Board-prep Butterfly review: `wiki/outputs/2026-05-26-board-prep-butterfly-transition-review.md`
- Butterfly transition proposal: `wiki/outputs/2026-05-19-butterfly-movement-transition-proposal.md`
- QBE Area 09 Notion record: https://www.notion.so/36eebcf981cf8106b398d52438170718
- Butterfly Movement Transition Plan (Notion): https://www.notion.so/1d97e1380abf4e7aa0b79e001e5fe2bd
- ABN Lookup — A Kind Tractor Ltd (active ACNC, NOT DGR): https://abr.business.gov.au/ABN/View/73669029341
- ABN Lookup — The Butterfly Movement Ltd (active, ACNC, PBI, Item 1 DGR): https://abr.business.gov.au/ABN/View/22155132684
- Screenshots: `output/playwright/qbe-area09/{terms,privacy,about,admin-funders,admin-library,funders-minderoo}.png`
