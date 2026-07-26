import { DeckRoadClient } from './deck-road-client';

/**
 * /pitch/road - the deck, on the road spine, built from current canon.
 *
 * Built 2026-07-26 to be THE deck. Three were live (`/deck`, `/pitch/deck`, `/pitch/simple`) on
 * three different spines, with two undated decisions disagreeing about which was canonical. This
 * one is built on the spine that was actually ruled (C and F).
 *
 * CANONICAL DECK as of 2026-07-26, ruling R. This is the one a funder receives.
 *
 * `/pitch/simple` KEEPS its job: it is the PDF pipeline (slides-source.html to render-deck.mjs to
 * goods-simple-deck.pdf) and a funder attachment is a real need this route cannot serve. The two
 * are not rivals. `/deck` is retired to a redirect. `/pitch/deck` is under another session's edit
 * and is on ruling R's sweep list rather than changed here.
 *
 * `/pitch/funder-pathways` remains the canonical FUNDER SURFACE. That is a different role and
 * ruling R does not touch it.
 */
export const metadata = {
  title: 'The road | Goods',
  description:
    'Seven places, and what each one taught. The model arrives at the end, as what the road produced.',
};

export default function PitchRoadPage() {
  return <DeckRoadClient />;
}
