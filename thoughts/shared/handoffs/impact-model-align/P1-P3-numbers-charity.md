# P1 (numbers to canon) + P3 (charity framing) sweep

*2026-06-18. Agent A executed the edits then died on a terminal API error (certificate) before writing this handoff or verifying the build. This file was reconstructed by the main session from the actual git diff, which was reviewed line by line. Build re-verified green by the main session. Nothing committed or pushed.*

## P1: stale numbers repointed to canon (`asset-canonical.ts`)

- `v2/src/app/communities/page.tsx` — imports `CANONICAL_ASSETS`; headline now `bedsDeployed` (496) "beds" across `communitiesServed` (9) "communities" (was a computed 493 / "7 places").
- `v2/src/app/gallery/page.tsx` — "8 prototype units deployed" -> `${washersInCommunity} washing machines in community` (16).
- `v2/src/app/community/page.tsx` — metadata "Meet the 29 storytellers" -> "Meet the storytellers" (removed the hardcoded stale count).
- `v2/src/app/stories/page.tsx` — removed the "500+ Minutes of community feedback" stat (no canon source); stat grid 4-col -> 3-col.
- `v2/src/lib/data/content.ts` — `impact.stats`: "520+ Assets tracked" -> `bedsDeployed` "Beds deployed"; "9 Communities served" -> `communitiesServed`. Kept "107 Stretch Beds on order" and "$3M/yr" (not stale-canon items).
- `v2/src/lib/funders/configs/snow.ts` — 25kg -> 20kg per bed in all 4 places (canon plastic-per-bed). Funder-specific figures ("15-20 beds deployed", budgets) left untouched for a Snow reconciliation.
- `wiki/articles/impact/metrics-tracked.md` — 389 -> 496 beds; 8 -> 9 communities; 9,225kg -> 2,660kg; the $537,595 revenue figure removed (replaced with "accountant-gated, do not state a revenue impact figure until signed off").
- `wiki/articles/communities/overview.md` — reframed: canonical headline 496 / 9 / 16 stated up top; the 412-bed / 7-row March compendium snapshot kept as a source-typed sub-view (its row sum is narrower than 496, by design).

## P3: charity framing removed (scoped to the 3 audit files)

- `v2/src/app/community/page.tsx` — "When you purchase or sponsor a bed, you become part of this community." -> "Buy a bed or back one for a community, and you back community-led production."
- `v2/src/app/stories/page.tsx` — "When you purchase or sponsor a bed, you become part of this community. You'll receive updates..." -> "Back a bed and you back community-led production. You'll get updates as it reaches the family who asked for it."

## Build

`cd v2 && npm run build` -> green (Next.js full route table emitted). Verified by the main session on top of the green post-P0 build.

## Flags (for Ben / later phases)

1. **PNG re-export (from P0):** `v2/public/theory-of-change.png` is binary; its source text was de-claimed but the image still shows old framing/numbers (495/132/2,640). Needs design re-export.
2. **"Sponsor a Bed" is a REAL flow, not just framing.** There is a `/sponsor` route; "Sponsor a Bed" CTAs appear on shop, get-involved, contact, stretch-bed, canberra, and the /design/* mockups. Left untouched (preserving the flow). The genuinely charity-framed copy at `v2/src/app/shop/page.tsx` ("Sponsor a bed for a family in need. 100% of your sponsorship goes directly") is a Ben product/wording decision, not a silent rewrite. Decide: keep "sponsor" as an agency-first gifting offer (and reword "family in need"), or rename the flow.
3. **Snow funder-specific numbers** ("15-20 beds deployed", and any $/bed) left for a Snow reconciliation, not a canon repoint.
4. **Brand-debt: pre-existing em dashes in LIVE copy.** `snow.ts` (renders on the Snow dashboard) and other page copy still contain em dashes from before this pass. The #1 brand rule is violated on live funder surfaces. Needs a separate brand-voice sweep (out of scope for the impact-model alignment).
5. **Per-community bed sum gap:** the community data rows do not sum to 496 (the canon headline is correct; the per-place breakdown is narrower). Resolve the breakdown later.
