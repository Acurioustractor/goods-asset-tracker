# Claude Design preview cards (pulled from the project)

These are preview cards mirrored from the live Claude Design project **Goods on
Country Design System** (`a24f62c8-2be7-4811-887d-f5f8a24f3cf9`). They link
`_base.css` (the project's variable convention: `--background`, `--primary`,
`--accent`, `--chart-*`, `--font-display`), which is a hex mirror of the
canonical `design/brand/tokens.css`. `tokens.css` stays the single source of
truth; `_base.css` here just lets these cards render standalone.

> Note the two card conventions in this repo: `design/brand/cards/` (the original
> 6-card seed, on `../tokens.css` with the `--goods-*` names) and this folder (on
> `_base.css`). They are not yet unified.

## Investment cards (group "Investment"), added 2026-06-26

Built from the QBE Catalysing Impact Stage 2 funder work
(`wiki/outputs/2026-06-20-qbe-funder-landscape/`). All figures are Scenario A
**target asks, not awarded**; QBE is **contingent**; **0 signed today**.

- `invest-onepager.html` — funder one-pager (health-hardware story, traction, the ask, the stack).
- `invest-capital-stack.html` — the $400K raise: SEFA $300K repayable + Snow $100K, with a discretionary QBE grant drawn detached, ON TOP (SEFA figure set at $300K by Ben, 2026-07-03; total confirmed $400K by Ben, 2026-08-05).
- `invest-match-progress.html` — reusable $0-of-$400K raise meter (card name: Raise progress meter).
- `invest-loi-ladder.html` — the LOI ladder: four rungs, three GHL pipelines with their stage
  counts, and what QBE money actually is. Mirrors `v2/src/lib/data/loi-pipeline.ts`. **Carries no
  funder names and no amounts**, by design: live state belongs at `/admin/loi-tracker`.
- ~~`invest-funder-pipeline.html`~~ — **DELETED from the Design project 2026-08-05** (Ben). The
  five-bucket board named fifteen funders with an amount and a stage against each, captioned "as at
  3 Jul 2026". Two reasons it went. It could not be rebuilt from `loi-pipeline.ts`, because that
  file holds the ladder config and the GHL pipeline ids and nothing else, so the names had been
  hand-copied and were already three weeks stale (it still showed Centrecorp as a $75K grant after
  Ben reclassified them as a buyer). And a named funder board with amounts and stages is the same
  content class as the `/pitch/deck` presenter-script leak fixed on 2026-08-02. Replaced by
  `invest-loi-ladder.html`. The local file is retained in this folder if it is ever needed back.
- `invest-funder-card.html` — reusable one-funder template (SEFA worked example).
- `invest-teaser-deck.html` — 7-slide investor teaser (16:9 frames).
- `invest-stat-band.html` — reusable investment stat band ($713,827 FY revenue workpaper / $750 per bed / 540 beds / $400K raise).

Canon held: zero em or en dashes, claim ceiling (the scabies to rheumatic heart
disease pathway is the why, never a claimed Goods outcome), FY revenue
AU$713,827 as a Goods-only carve-out WORKPAPER, 540 / 11 / 3,540kg.

## Ruling V and G/H sweep, 2026-08-05

Six Investment cards carried figures that three rulings had already moved past, and every one of
them was the kind a funder quotes back at you.

**Ruling V (2026-08-01), the QBE money.** The cards said the grant was matched "at least 1:1" and
drew an "AU$150,000 floor" as a tick on a progress track. Neither exists. The money is CATALYTIC
and discretionary, typically AU$150,000 to AU$400,000, from a pool of up to AU$1.1M shared across
TEN enterprises. Raising $400,000 creates no obligation on QBE at all. The published terms bind
the GRANT ("must be at least matched by signed external commitments"), which is a coverage test on
whatever QBE chooses to give, not a promise to match us. Struck everywhere; the meter now measures
OUR raise, which is the only thing we control.

**Ben, 2026-08-02, Centrecorp.** Removed from the capital stack. They are a BUYER and will not
give a grant, so carrying them as a $75K grant ask inflated the grant column by $75,000 and aimed
the relationship at the wrong conversation. The stack is $400K, not $475K.

**Ruling G/H (2026-07-25), the revenue label.** Three cards read "signed FY revenue (Goods-only,
accountant-signed)". There is no accountant-signed document. The carve-out is prepared WITH the
accountant, which makes it a workpaper. A green chip in front of a funder was the original leak,
and this was the same leak in a different font.

**Canon drift.** Beds 496 to 540, communities 9 to 11, HDPE 2,660kg to 3,540kg, from
`v2/src/lib/data/asset-canonical.ts`.

STILL STALE, not fixed here: `invest-funder-pipeline.html` is a dated snapshot ("as at 3 Jul
2026"). Its terms note and the Centrecorp misclassification were corrected, but the board itself
(Tim Fairfax "confirm path by 10 Jul", the bucket layout) needs a rebuild from
`v2/src/lib/data/loi-pipeline.ts` rather than hand-patching. Separate job.
