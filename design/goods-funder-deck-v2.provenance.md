# Provenance — Goods funder deck v2 (12-beat spine)

**Artifact:** `design/goods-funder-deck-v2.html` (13 slides: cover + 12 beats)
**Spine:** `wiki/investor/14-playout-plan.md` (the 12-beat assembly plan)
**Built:** 2026-07-21, branch `claude/investment-deck-alignment-y3qc43`
**Rule:** every figure carries a claims-status label; every quote is registry-verbatim and consent-cleared (Ben pass 2026-07-20). No fabricated figures.

## Alignment gates at build time (all green)
- `node --env-file=.env.local scripts/check-asset-drift.mjs` -> all canonical asset figures match the live register (project cwsyhpiuepvdjtxaozwf).
- `npm run audit:model` -> 0 FAIL (2 coverage warnings only: 6 bed-communities + basket-bed with no linked media; not figure drift).
- Admin/lib code copy stale-figure sweep -> clean (the only 496/2,660 hits are deliberate "Notion is stale, canon = 540/11" guard comments).

## Figures (with source + claim label)

| Beat | Figure | Value | Label | Source |
|---|---|---|---|---|
| 4 | Beds delivered | 540 (177 Stretch, 363 Basket) | Delivered / register-verified | `asset-canonical.ts` CANONICAL_ASSETS; live register |
| 4 | Washing machines in community | 20 | Delivered / curated | `asset-canonical.ts` (Ben-confirmed curated count) |
| 4 | Communities served | 11 | Delivered | `asset-canonical.ts`; live register |
| 4 | Recycled HDPE diverted | 3,540kg | Delivered | `asset-canonical.ts` (177 Stretch x 20kg) |
| 3 | Plastic per bed | 20kg | Spec | `products.ts` |
| 3 | Heat-press temp | 180C | Spec | canon (Ben 2026-07-17; 190 was wrong) |
| 3 | Weight / capacity / assembly | 26kg / 200kg / ~5 min | Spec | `products.ts` |
| 6 | Maningrida | 58 beds (18 Basket + 40 Stretch) + 8 washers | Delivered / register-verified | live register query 2026-07-21 (this session) |
| 8 | Sale price | $750 | Fixed | `cost-story.ts` |
| 8 | Cost per bed today | $685 (~$65 stays) | Verified (workpaper; parts invoice-verified, freight ~$150 modelled) | `cost-story.ts` |
| 8 | Cost pressing own legs | $426 (~$324 stays) | Modelled (capability proven — Maningrida Stretch run of 40 pressed at our facility; cost at production rate not yet measured) | `cost-story.ts` |
| 8 | Fixed cost | ~$109,500/yr | Modelled | `cost-story.ts` |
| 8 | Break-even | ~338 beds/yr | Modelled | `cost-story.ts` (range 333-338; curve crosses ~335) |
| 10 | Snow Foundation delivered | ~$493K | Delivered | memory snow-foundation-thread (~$493,130) |
| 11 | QBE Stage 2 ask | up to $400K, matched >=1:1 | Proposed / not yet awarded | `cost-story.ts` (QBE Stage 2 brief); LOIs due 31 Aug, closes late Sept |
| 11 | Signed match-eligible capital today | $0 | Observed | playout plan; QBE standing item |
| 11 | Accountant-signed revenue | $713,827 | Verified (accountant-signed; amber — always name the carve-out basis) | `cost-story.ts` (Goods-only carve-out) |
| 11 | Named demand | 1,000+ beds (+300 washers) | Requested / LOIs not orders | `cost-story.ts` |

Charts on beat 8 (cost-curve.png, breakeven.png) and the other deck-photos verified matching canon in `wiki/investor/05-diagrams.md` (labels printed on-image).

## Quotes (verbatim, cleared, registry-traced)

Every quote copied character-for-character from `v2/src/lib/data/storyteller-registry.ts` unless noted. Full extraction sheet: `beat-quote-sheet.md` (this session).

| Beat | Speaker | Consent tier | Registry source | Cleared |
|---|---|---|---|---|
| 1 | Alfred Johnson (Palm Island) | external | storyteller-registry.ts:724 | YES |
| 2 | Linda Turner (Tennant Creek) | external | storyteller-registry.ts:209 | YES |
| 3 | Dianne Stokes (Warumungu/Warlmanpa Elder) | external | storyteller-registry.ts:109 (D3) | YES |
| 4 | Margaret Lloyd (Utopia homelands) | external | storyteller-registry.ts:168 | YES |
| 5 | Shayne Bloomfield (Oonchiumpa) | external | storyteller-registry.ts:664 | YES |
| 6 | Shayne Bloomfield (Oonchiumpa) | external | storyteller-registry.ts:649 | YES |
| 7 | Mykel (young maker, Utopia) | external / youth-care framing | storyteller-registry.ts:435 | YES |
| 8 | Dianne Stokes (D4) | external | storyteller-registry.ts:114 | YES |
| 9 | Kristy Bloomfield (Oonchiumpa co-founder, TO) | external | storyteller-registry.ts:598 | YES |
| 10 | Georgina Byron AM (CEO, Snow Foundation) | funder | storyteller-registry.ts:1256 | YES |
| 12 | Dianne Stokes (D8 blessing) | external | flagship 2026-07-20-the-voices-are-the-evidence.md:94 | YES (see flag) |

Editorial note: quotes 3, 5, 9, 10 use an ellipsis to mark an omitted span; every displayed word is verbatim from the source. "aboriginal" -> "Aboriginal" is the only orthographic normalization (respectful capitalization, brand style).

## Flags for Ben (do before external send)
1. **Beat 12 blessing quote** is cleared in the flagship prose but is NOT yet in `storyteller-registry.ts`. Add it to Dianne's registry record so it is registry-locked like every other beat quote.
2. **Georgina "empowering communities" line is status `hold`** (banned word) and was deliberately NOT used. Two quotes physically filed under her registry record are actually other speakers (Kylie, Katherine) - do not attribute to Georgina.
3. **Margaret Lloyd portrait gap** - no cleared portrait file exists; beat 4 runs as a stat slide with her voice, no face. Same for Shayne (beats 5-6), Kristy (beat 9), Georgina (beat 10).
4. **Snow ~$493K** is from memory (snow-foundation-thread), not a code source. Confirm the exact figure before external use.
5. **Kununurra Elder clearance** still gates any Variant A opening (not used in this deck).

## Explicitly excluded (claim hygiene)
- No claimed health outcome. scabies->RHD is the why only, never asserted as delivered.
- Community ownership stated as a pathway ("moving closer"), never as complete.
- Named demand labelled as requests / LOIs, never as signed orders.
- Banned pitch words swept (empower, journey, unlock, ecosystem, transformational, beneficiaries, scalable solution, game-changing). Zero em dashes. "co-design" absent.
