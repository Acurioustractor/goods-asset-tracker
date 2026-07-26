import { DeckRoadClient } from './deck-road-client';

/**
 * /pitch/road - the deck, on the road spine, built from current canon.
 *
 * Built 2026-07-26 to be THE deck. Three were live (`/deck`, `/pitch/deck`, `/pitch/simple`) on
 * three different spines, with two undated decisions disagreeing about which was canonical. This
 * one is built on the spine that was actually ruled (C and F).
 *
 * NOT YET INDEXED, and not yet declared canonical. Ben walks it first, then the other three become
 * redirects following the `/pitch/control-room` pattern. Do not flip robots or repoint
 * `pitch-surface-notice.tsx` until that decision is recorded in `/DECISIONS.md`.
 */
export const metadata = {
  title: 'The road | Goods',
  description:
    'Seven places, and what each one taught. The model arrives at the end, as what the road produced.',
  robots: { index: false, follow: false },
};

export default function PitchRoadPage() {
  return <DeckRoadClient />;
}
