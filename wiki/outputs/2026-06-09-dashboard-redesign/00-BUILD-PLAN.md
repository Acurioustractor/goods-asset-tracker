# Goods Dashboard Redesign — Corrected Build Plan (single source of truth)

Date: 2026-06-09. Supersedes the raw brief (`01-design-brief.md`) where they conflict; folds in the adversarial critique (`02-critique.md`). Research inputs: `03`–`06`.

## Direction (Ben, 2026-06-09)
- ONE long, navigable scrolling page. NO tabs.
- DROP backward funder-gratitude framing. Forward: where we're going, funding targets, building ongoing COMMUNITY-OWNED assets, growth through QBE.
- Reusable TEMPLATE for partners / supporters / funders.
- World-class UX/UI.

## The spine (forward order)
0. **Hero — "Where we're heading"** — thesis + 5 answers (COUNTED-only or qualitative; no modelled numbers in hero) + confidence legend + data-sovereignty line + "as at {date}".
1. **The goal** — the destination: a recycled-plastic production economy on country that transfers to community ownership. Number-free, editorial, one line illustration. Labelled *direction, not measurement*.
2. **The path (funding target + QBE)** — THE forward reframe. **Reuses existing `CAPITAL_STACK` + `QBE_PROGRAM` + `MATCH_TARGET` (do NOT re-key the numbers).** ~$3M target; QBE up-to-$400K *matched, not awarded*. Horizontal capital-stack bar with committed/matched-target/gap in visually distinct registers. Secured anchor = `verifiedFinancials.revenueReceived` (741,111) ONLY, provenance-cited, never a fresh sum.
3. **Community-owned assets (the heart)** — the on-country plant + First Nations jobs as community-as-owner. The ONE signature scrollytelling pin: build → operating → community-run → community-owned. Named stages only, NO invented ownership-percent.
4. **In service now (the honest proof, placed AFTER the forward story)** — beds/washers/plastic/communities, each with a community comparison + confidence chip + service-status pill. Name the dark machines ("14 of 28 reporting live"). Modelled figures (plastic ×20kg, reached ×2.5) live here with the assumption stated, NOT in the hero.
5. **Community voice (consented)** — EL themes + quotes (port existing `voicePanel`). Consent-and-sovereignty note, not a confidence grade.
6. **What's next** — roadmap kanban + timeline read as upcoming community-owned capacity; items tagged committed/in-progress/planned/contingent-on-funding; tied back to Section 2.
7. **Back the next stage** — audience-aware CTA (funder=the match ask / partner=next build / supporter=next unit). End on direction, never gratitude.

## Corrections from the critique (MUST honor)
- **P0-1 RESOLVED:** Section 2 is Phase 1 (reuse existing `CAPITAL_STACK`/`MATCH_TARGET`/`QBE_PROGRAM` from `funder-shared-content.ts` + `loi-pipeline.ts`), NOT a from-scratch build. Reference the single source; don't create a 4th copy of $400K / $3M.
- **P0-2:** Phase 0 (tabs→scroll) is a LAYOUT SPIKE only, gated, flagged "copy still backward, not funder-ready." The reframe (hero copy + kill the `contribution` tile) is part of the definition-of-done. Add a grep acceptance test: rendered page must contain zero of `your backing`, `come from`, `fully received`.
- **P0-3:** Non-extraction is structural. Extend gallery type to `{ src, alt, consent: 'documented'|'pending'|'none' }`; render only `documented`. The 3 identifiable-face images are removed by default until Ben confirms consent.
- **P0-4:** Secured/committed anchor = `verifiedFinancials.revenueReceived` only (mixed-ledger; never a client-side sum of `funding[]`).
- **P1-1:** Kill the per-funder `contribution` tile entirely. Any secured figure folds into Section 2's stack as "secured so far" inside the forward target.
- **P1-2:** Rail carries a per-section confidence dot (epistemic map, not just labels). ONE signature interaction (Section 3 pin); cut the view-timeline reveals. Design a real `@media print` path for funder PDF export.
- **P1-3:** No `get_fleet_kpis` "if present" in the spec (unverified RPC). Drop `pctToOwnership` from the type. Equity "community comparison" is prose-only until a cited ABS/AIHW figure exists.
- **P1-4 / P2-2:** Make `confidence` a REQUIRED field (build fails / loud dev marker on missing — no silent NOT-YET downgrade). Make the `<Section>` wrapper's trio slots required props (TS error if omitted) so the standard travels.

## Enforcement (make non-extraction impossible, not requested)
- Required `consent` on gallery items → render-gate.
- Required `confidence` on every graded metric → no default grade.
- Required trio props on `<Section>` → TS error if omitted.
- Grep acceptance test for backward copy in the Phase-1 DoD.

## Files
- Refactor: `v2/src/app/partners/[slug]/dashboard/page.tsx` (tabs → one scroll).
- Extend config: `v2/src/lib/data/partner-dashboards.ts` (`audience`, `thesisLine`, `goalStatement?`, `cta`, gallery `consent`, `ownershipMilestones?` named-stages-only; reference `CAPITAL_STACK` rather than re-keying).
- Reuse (verified to exist): `v2/src/lib/data/funder-shared-content.ts` (`CAPITAL_STACK`, `QBE_PROGRAM`), `v2/src/lib/data/loi-pipeline.ts` (`MATCH_TARGET`), `v2/src/lib/data/compendium.ts` (`verifiedFinancials`), `impact-model.ts` (`FINANCIAL_SUMMARY`, `ImpactMetric.confidence`), `impact-fetcher.ts` (`getAssetStats`).
- New components: `v2/src/components/dashboard/scrollspy-nav.tsx` (`'use client'`, the only new client leaf), `confidence-chip.tsx` (RSC), `section.tsx` (RSC wrapper: required id + scroll-mt + sticky header + required trio props), `capital-stack.tsx` (RSC, reads `CAPITAL_STACK`).
- Retire: `DashboardTabs` once unreferenced.

## Phasing
- **Phase 0 (layout spike, gated, NOT funder-ready):** tabs → scroll + rail + progress + sticky headers, existing panels in new order. Internal milestone only.
- **Phase 1 (ships, all live data):** forward hero + legend + data-sovereignty line; Section 4 with service pills + confidence chips; port voice; roadmap with status tags; the scrollspy spine; `@media print`; grep test green; `contribution` tile killed; gallery consent-gated.
- **Phase 1.5 (existing config):** Section 2 capital-stack from `CAPITAL_STACK`/`MATCH_TARGET`; Section 1 `goalStatement`; Section 7 `cta`; `audience` skin; Section 3 named ownership milestones + the pin.
- **Phase 2 (new data, later):** Supabase `facilities` table for live ownership; measured outcomes (consented; do NOT fake); live Vercel Analytics wire.

## Open decisions for Ben (recommended defaults in brackets)
1. **Raise public anchor / framing.** [Default: use the already-published "~$3M blended raise (target)" + `CAPITAL_STACK` as-is, with QBE up-to-$400K matched-not-awarded.]
2. **Photo consent.** [Default: remove the 3 identifiable-face gallery images; keep product/landscape. Add `consent` field.]
3. **Cost-per-bed visibility.** [Default: keep on the gated page behind a "see the numbers" disclosure, not in the forward flow.]
4. **Ownership milestone stages.** [Default: named stages from facilities + roadmap; no percent.]
5. **Supporter skin.** [Default: supporter sees a simplified Section 2 (no full stack detail).]
6. **Need denominators.** [Default: prose only until community-validated baselines.]
7. **Data-sovereignty line wording.** [Default: "Community holds the authority. We hold the count, and show our working." Flag for community sign-off.]
