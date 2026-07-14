# Area 8 — People & Organisation

Date: 2026-05-29
Diagnostic status: Partial (capability strength + serious capacity constraint)
Build status: Built - needs review
Priority: P1
Owner: Ben

## Summary

People and Organisation is a genuine strength story with one honest constraint: capacity. Goods has two highly capable, complementary cofounders and a real partner network (Oonchiumpa, Palm Island Community Company, Wilya Janta), and it has shown early production transfer away from the founders. The constraint the diagnostic named is real — Ben and Nic are effectively the only workers, holding relationships, product judgement, procurement, production, reporting and sales follow-up at once. The clean line for QBE is that we proved the model with a very lean team, and the next phase moves repeatable operating work off the founders into a GM/ops role, a BD/sales-ops/procurement role, production leadership and community-held production capacity — not a heavy head office. We are not claiming a staffed organisation; the live `team_members` table has 0 rows and production logs show 18 of 19 shifts run by Ben.

## Where we are vs the diagnostic

The diagnostic (V4) flagged three things still needed before external use: GM/BD role approval, founder FTE allocation, and a hiring/capacity plan. Since then we have built the analytical scaffolding internally: a now/next org chart, two v0.1 role briefs (GM/Operations Lead and BD/Sales-Ops/Procurement Lead), a founder-capacity risk note backed by live data, and a founder FTE costing-sheet structure that hands the dollar work to Area 04. What is still missing is the founder-authored decision layer: Ben and Nic approving the two role briefs, agreeing fair-market FTE rates with the accountant, and turning the briefs into an explicit 90-day delegation plan. The artifact is built and needs founder review — it is not yet a signed capacity plan.

## Priorities (next builds)

1. Founder sign-off on the GM/ops and BD/sales-ops/procurement role briefs (founder decision, not more narrative).
2. Set fair-market founder FTE rates with the accountant and feed them into the Area 04 Goods-only model so margin/runway are honest.
3. Make `/admin/team` a real capacity register — separate current founders, contractors, advisors, support network, community partners and planned roles (each with status, scope, owner, evidence link).
4. Write a 90-day founder delegation plan naming which tasks move off Ben/Nic before QBE Stage 2.

## Proof links

- Full internal review: `wiki/outputs/2026-05-29-qbe-area-08-people-organisation-full-review.md`
- Canonical numbers (only safe figures): `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md`
- Cross-area context: `wiki/outputs/2026-05-29-qbe-cross-area-alignment-review.md`
- Founder FTE costing belongs in the reconfigured cost model: `wiki/outputs/2026-05-29-qbe-investment-sweep/01-bed-cost-model-reconfigured.md`
- QBE Area 08 Notion record: https://www.notion.so/36eebcf981cf813cbfbbca1709600971
- Older Notion mirror "8. People and Organisation": https://www.notion.so/348ebcf981cf8102ae24e6ea56b1c1ec
- Goods x Oonchiumpa Notion page: https://www.notion.so/36bebcf981cf8020a79de853483e605e
- Code/data evidence: `v2/src/lib/data/team.ts`, `v2/src/lib/data/compendium.ts`, `v2/src/app/admin/team/page.tsx`, `v2/src/app/partners/oonchiumpa/page.tsx`
- Website/admin screenshots: `output/playwright/qbe-area08/` (admin-team, about-team, partners-oonchiumpa, admin-production, admin-deals, admin-communities)

## Claim discipline for this area

- verified: founder-led by Ben/Nic; strong partner network; live team table has 0 rows; production logs are founder-heavy with early transfer evidence.
- target: intent to hire/contract GM/ops and BD/sales-ops/procurement; build production-lead and community-coordinator roles as the pathway matures.
- future / internal only: any claim founders are fully replaced in production; any claim community ownership or local plant operation is structurally complete; any individual compensation detail; any claim partners are legally bound to operate production.

## Public copy risk

Do not present partners (Oonchiumpa, PICC, Wilya Janta) as Goods staff, do not treat the 13 compendium advisory/support rows as a formal board, and do not present community-owned production or an on-Country plant as already complete — say "pathway"/"target". Keep `v2/src/lib/data/grant-content.ts` out of external people/governance proof until reviewed.
