# P0 claim-ceiling sweep — change log

Date: 2026-06-18. Scope: remove every CLAIMED health/justice OUTCOME, keep the scabies-to-RHD pathway as the *why*. Rule source: `wiki/outputs/2026-06-18-goods-impact-framework.md` section 4 (the claim ceiling).

Working tree only. No commit, push or deploy. Brand voice applied (no em dashes, straight quotes, On Country capitalised, units no-space).

Build after all edits: `cd v2 && npm run build` => EXIT 0, "Compiled successfully in 21.6s". (EL 401 enrich warnings are pre-existing runtime noise from missing EL creds in this build env, not build errors.)

---

## 1. v2/src/app/impact/page.tsx — `HealthCascadeSection`

- L297 header (was `RHD Is Entirely Preventable`) -> `The pathway a bed and a washer sit in`, eyebrow `The Health Cascade` -> `Why this is health hardware`, subhead (was "the chain we're breaking, and where our products intervene") -> pathway-as-why prose that explicitly says "We do not claim a bed prevents heart disease: that needs a partner clinical method."
- L319-377 step rendering: removed `const isInterrupted = step.interrupted` and all interrupted-state branching (green check icon, green status dot, `text-white` vs `text-white/70`, and the `INTERRUPTED` pill badge). Replaced with a neutral numbered-step indicator (`{i + 1}`). Connector line is now a single colour (no green "interrupted" colour).
- L381-396 summary stats labels: "Beds interrupting floor sleeping" -> "Beds delivered"; "Wash cycles breaking scabies chain" -> "Wash cycles completed". ("Machines online now" kept.)
- Added a CLAIM CEILING header comment documenting what was removed and why.

## 2a. v2/src/lib/data/impact-model.ts

- L80-91 `HealthCascadeData` interface: removed `sleepNightsProvided` field and the per-step `interrupted: boolean` field (the badge driver). Added claim-ceiling comment.
- L233-238 health dimension: `description` (was "...interrupting the scabies -> Strep A -> RHD cascade") -> pathway-as-why ("Why a bed and a washing machine are health hardware: ...supports the conditions needed to interrupt..."). `primaryMetricId: 'sleep-nights'` -> `'beds-delivered'` (a verified count, no health-outcome claim).
- L254 `beds-delivered.proxyFor`: "Households with proper sleeping infrastructure" -> "Households with off-the-ground, washable sleeping infrastructure".
- L259-270 removed the entire `sleep-nights` metric object (was a modelled health proxy `proxyFor: 'Improved health outcomes from proper rest'`). Replaced with a claim-ceiling comment.
- L280 `wash-cycles.proxyFor`: "Scabies/RHD prevention through clean bedding" -> "Washable bedding kept clean (the conditions the scabies pathway depends on)".
- L421-432 removed the entire `govt-savings` metric object (Government Health Savings, modelled $ from "cases prevented"). Replaced with a claim-ceiling comment.

## 2b. v2/src/lib/data/impact-fetcher.ts

- L27-41 removed constants `NIGHTS_PER_YEAR`, `RHD_SURGICAL_ADMISSION_COST_AUD`, `BEDS_PER_RHD_CASE_PREVENTED`, `WASH_CYCLES_PER_RHD_CASE_PREVENTED`. Replaced with a claim-ceiling comment. (`AVG_HOUSEHOLD_SIZE` kept; still used for `livesImpacted`.)
- L197-225 removed functions `computeSleepNights` and `computeGovtSavings`. Replaced with a claim-ceiling comment.
- L231-275 `buildHealthCascade`: removed `sleepNightsProvided: computeSleepNights(beds)`; removed the `interrupted:` flag from every step; reworded step labels/descriptions to the why (e.g. final step "Heart failure & death / RHD is entirely preventable, yet children are dying from it" -> dropped, now ends at "Rheumatic fever and rheumatic heart disease / Repeated Strep A infections *can* trigger autoimmune heart damage"). Wash-cycles step kept as counted activity (`liveMetric`).
- L329-338 `populateDimensions` liveValues map: removed `'sleep-nights'` and `'govt-savings'` entries.
- Grep confirms no live code references any removed identifier (only my own comments remain). API routes `/api/impact` and `/api/impact-summary` do not reference any removed field.

## 3. v2/src/lib/funders/configs/snow.ts

- `additionalContext` "RHD + Healthy Homes connection" bullet 1: "...especially relevant to **Rheumatic Heart Disease prevention** through housing quality and sleep health" -> pathway-as-why ("...support the conditions needed to interrupt the scabies to rheumatic heart disease pathway. We do not claim a bed prevents heart disease; that would need a partner clinical method."). Last bullet "RHD-relevant interventions" -> "health hardware".
- Touched ONLY health-claim wording. Stale numbers (25kg, $600/bed, 15-20 beds, etc.) LEFT for a later phase (P1) per scope.

## 4. wiki/outputs/2026-05-29-goods-theory-of-change-and-mel.md

- L89: the "strongest under-used OUTCOME is the health-to-education-to-justice link... keeps children in school and away from the pathways that lead to the justice system" bed-to-courtroom claim -> reworded to a why/hypothesis: explicitly "a why, not a claimed outcome", "We do not claim Goods keeps children in school or out of the justice system", "pitched as a hypothesis, not as evidence", and a justice/health outcome only leaves the future column when a partner evaluation method produces it, attributed.

## 5. wiki/articles/enterprise/02-social-objective-impact.md

- L33-37: the public Goods line `"A good bed can prevent heart disease."` -> replaced with the pathway-as-why line `"Off-the-ground, washable sleep supports the conditions needed to interrupt the scabies to rheumatic heart disease pathway."` plus an explicit "This is a why, not a claimed outcome... we do not say a bed prevents heart disease... a health outcome only leaves the future column when a partner clinical method (Miwatj and equivalent ACCHOs) produces it, attributed."
- NOTE: the article already had strong "What We Should Not Claim Yet" guardrails (L259-266) which are consistent with the claim ceiling; left intact.

---

## Flagged / left for later phases (NOT done this pass, per scope)

- **PNG re-export needed.** `v2/public/theory-of-change.png` is a binary image (cannot edit here). If it depicts the "bed to courtroom" justice outcome or any prevented-health-outcome chain, it needs re-export after this text change. FLAG for design.
- **P1 stale numbers (left intentionally):** `snow.ts` still carries 25kg/bed, $600/bed planning anchor, "15-20 beds", and the eight "alignment principles" repeat 25kg and "$3M/year washing machine dumping". The `02-social-objective-impact.md` article still carries 412/389/9,225kg figures and a 7-place deployment table. `impact-model.ts` health-dimension targets (e.g. beds year1 1500) untouched.
- **P3 charity framing (left intentionally):** `impact/page.tsx` CTA still has "Sponsor a Bed" + "Every bed purchased or sponsored adds to these numbers and changes a family's life." Out of scope for P0.
- **P4 competing axes (left intentionally):** the page still renders "Five Dimensions", "The Loss Function", and the health cascade as a section; `snow.ts` still has eight alignment principles. Collapsing these to the five domains is P4.
- **Possible follow-up:** the health dimension now has 3 metrics (beds-delivered, wash-cycles, product-survival-rate) after removing sleep-nights; `product-survival-rate.proxyFor` is still "Long-term health benefit durability" (a mild health-benefit framing, not a prevented-outcome claim, so left as-is, but noting it for a future altitude pass). The economic dimension lost govt-savings, leaving 4 metrics; section still renders cleanly (no empty section). No redesign was guessed.
