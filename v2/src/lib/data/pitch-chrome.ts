/**
 * THE PITCH CHROME - the reading apparatus around `/pitch/road`.
 *
 * `/pitch/road` is the canonical deck (ruling R). Its content was never the problem. The problem
 * was that it is a DECK RENDERED AS A DOCUMENT: eighteen panels, each already built one-per-
 * viewport (`lg:h-[100svh]`), served as a single continuous scroll with no pagination, no map of
 * where you are, no print path, and no way to hand a shorter cut to a reader who is not a funder.
 *
 * So five pitch artifacts existed instead of one. `/pitch/document` re-told the same story in
 * prose because the deck could not be printed. A PowerPoint sat in `deliverables/` because the
 * deck could not be presented. Both drift. Neither is the source.
 *
 * This module holds the apparatus, not the content:
 *
 *   PANELS  - the reading order, with a human label for each, so a nav can name where you are.
 *   PACKS   - which panels a given audience gets, and in what order.
 *   OPENER  - the "if you read nothing else" block, five lines, at the top.
 *
 * ---------------------------------------------------------------------------
 * WHY THERE ARE THREE PACKS AND NOT SIX
 * ---------------------------------------------------------------------------
 * The obvious move is a pack per audience in `audience.ts`. It is wrong, and the model says so.
 * `buyer.frontDoor` is `/shop`, and `buyer.mustNeverSee` forbids the impact story ahead of the
 * spec, which is the whole first half of this page. `community.mustNeverSee` forbids arriving
 * with a proposal instead of a yarn, and this page is a proposal from panel one. `partner` reads
 * `/pathways`, which is a different artifact answering a different question.
 *
 * A deck cut for those audiences would be a worse version of a surface that already serves them.
 * So the packs here are only the audiences whose front door genuinely IS this page: the funder it
 * was written for, the supporter who wants the story without the ask, and the press who need the
 * photographs and a person to ring. Adding a fourth is not a feature; it is a `mustNeverSee`
 * violation waiting to ship. `pitch-chrome.guards.test.ts` asserts exactly that.
 *
 * ---------------------------------------------------------------------------
 * WHAT THE OPENER IS NOT ALLOWED TO SAY
 * ---------------------------------------------------------------------------
 * A five-line summary at the top of a funder deck is the single highest-risk block of prose in the
 * system, because it is the part that gets read, quoted and pasted. Three things are banned in it
 * and the guards enforce all three:
 *
 *   - A bed count used as a threshold, and a payback period used as a promise. Both are
 *     `funder.mustNeverSee`.
 *   - Any site count or break-even claim. What a site costs to run for a year has four live
 *     answers ($15,000 / $48,333 / $64,333 / $79,333) and break-even moves from two sites to five
 *     across them. Until that is settled with Nic, "three sites" is a number with no basis.
 *     See `deliverables/GOC-site-cost-decision.md`.
 *   - Anything that softens "$0 signed". `funder.needsToSee` puts it plainly and first, and the
 *     opener is the first thing there is.
 */

import { AUDIENCES, type AudienceId } from './audience';

// ---------------------------------------------------------------------------
// Panels
// ---------------------------------------------------------------------------

/** The chapters a reader is moved through. Used to group the nav, so eighteen panels read as five
 *  parts rather than a list of eighteen. */
export type PitchChapter = 'the-road' | 'the-places' | 'the-map' | 'the-money' | 'the-close';

export const PITCH_CHAPTERS: { id: PitchChapter; label: string }[] = [
  { id: 'the-road', label: 'The road' },
  { id: 'the-places', label: 'The places' },
  { id: 'the-map', label: 'The map' },
  { id: 'the-money', label: 'The money' },
  { id: 'the-close', label: 'The close' },
];

export interface PitchPanel {
  /** The DOM id already on the section in `page.tsx`. Not invented here; mirrored. */
  id: string;
  /** Short enough for a nav chip. Long labels defeat the purpose. */
  label: string;
  chapter: PitchChapter;
  /**
   * Which packs include this panel. `funder` is every panel by definition: it is the deck as
   * written. The other two are cuts.
   */
  packs: PitchPackId[];
}

export type PitchPackId = 'funder' | 'supporter' | 'press';

/**
 * Reading order, mirroring the DOM order produced by `page.tsx`. The stop panels come from
 * `deckSlides` and the guard test asserts this list still matches that source, so a slide added to
 * the deck fails the build here rather than silently vanishing from the nav and the slide mode.
 */
export const PITCH_PANELS: PitchPanel[] = [
  { id: 'cover', label: 'Cover', chapter: 'the-road', packs: ['funder', 'supporter', 'press'] },
  { id: 'road', label: 'The road', chapter: 'the-road', packs: ['funder', 'supporter', 'press'] },

  { id: 'stop-1-kalgoorlie', label: 'Ninga Mia', chapter: 'the-places', packs: ['funder', 'supporter', 'press'] },
  { id: 'stop-2-tennant-creek', label: 'Warumungu Country', chapter: 'the-places', packs: ['funder', 'supporter', 'press'] },
  { id: 'stop-3-the-machine-with-a-name', label: 'Name it', chapter: 'the-places', packs: ['funder', 'supporter', 'press'] },
  { id: 'stop-4-palm-island', label: 'Bwgcolman', chapter: 'the-places', packs: ['funder', 'supporter', 'press'] },
  { id: 'the-stretch-bed', label: 'The Stretch Bed', chapter: 'the-places', packs: ['funder', 'supporter', 'press'] },
  { id: 'stop-5-utopia', label: 'Urapuntja', chapter: 'the-places', packs: ['funder', 'supporter', 'press'] },
  { id: 'stop-6-maningrida-and-the-farm', label: 'Manayingkarírra', chapter: 'the-places', packs: ['funder', 'supporter', 'press'] },
  { id: 'stop-7-oonchiumpa', label: 'Mparntwe', chapter: 'the-places', packs: ['funder', 'supporter', 'press'] },

  { id: 'map', label: 'Where things went', chapter: 'the-map', packs: ['funder', 'supporter', 'press'] },

  // The money half. A supporter did not come for the unit economics and a press reader must never
  // be handed a funding ask as though it were a fact about the organisation.
  { id: 'model', label: 'The model', chapter: 'the-money', packs: ['funder'] },
  { id: 'one-bed', label: 'One bed', chapter: 'the-money', packs: ['funder'] },
  { id: 'the-stopwatch', label: 'The stopwatch', chapter: 'the-money', packs: ['funder'] },
  { id: 'the-chain', label: 'What it costs', chapter: 'the-money', packs: ['funder'] },
  { id: 'four-asks', label: 'The four asks', chapter: 'the-money', packs: ['funder'] },

  { id: 'the-letter', label: 'The letter', chapter: 'the-close', packs: ['funder', 'supporter'] },
  { id: 'closing', label: 'The promise', chapter: 'the-close', packs: ['funder', 'supporter', 'press'] },
];

// ---------------------------------------------------------------------------
// Packs
// ---------------------------------------------------------------------------

export interface PitchPack {
  id: PitchPackId;
  label: string;
  /** Which record in `audience.ts` this pack serves. The pack never restates that record. */
  audience: AudienceId;
  /** One line shown in the pack switcher, so a presenter picking a cut knows what it is. */
  blurb: string;
}

export const PITCH_PACKS: PitchPack[] = [
  {
    id: 'funder',
    label: 'Funder',
    audience: 'funder',
    blurb: 'The whole road, then the model as what the road produced. Every panel.',
  },
  {
    id: 'supporter',
    label: 'Supporter',
    audience: 'supporter',
    blurb: 'The road and the places, without the unit economics or the ask.',
  },
  {
    id: 'press',
    label: 'Press',
    audience: 'press',
    blurb: 'The story, the cleared photographs and the map. No funding ask.',
  },
];

export const DEFAULT_PACK: PitchPackId = 'funder';

/** Panels for a pack, in reading order. */
export function panelsForPack(pack: PitchPackId): PitchPanel[] {
  return PITCH_PANELS.filter((panel) => panel.packs.includes(pack));
}

/** Narrow an untrusted `?for=` query value. Anything unrecognised falls back to the funder deck,
 *  which is the surface as written and therefore always safe. */
export function resolvePack(raw: string | string[] | undefined): PitchPackId {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const match = PITCH_PACKS.find((pack) => pack.id === value);
  return match ? match.id : DEFAULT_PACK;
}

export function pitchPack(id: PitchPackId): PitchPack {
  const found = PITCH_PACKS.find((pack) => pack.id === id);
  if (!found) throw new Error(`Unknown pitch pack: ${id}`);
  return found;
}

/** The `audience.ts` record a pack serves. Kept as a lookup rather than a copied field so the
 *  constraints stay defined once. */
export function audienceForPack(id: PitchPackId) {
  const pack = pitchPack(id);
  const record = AUDIENCES.find((entry) => entry.id === pack.audience);
  if (!record) throw new Error(`Pack ${id} names an audience that does not exist: ${pack.audience}`);
  return record;
}

// ---------------------------------------------------------------------------
// The opener
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Appendices
// ---------------------------------------------------------------------------

/**
 * The three surviving supporting pitch surfaces. They are appendices to this deck, not
 * alternatives to it, and naming them here is what stops them drifting back into being parallel
 * front doors: each is reachable FROM the deck, in the contents, labelled with the question it
 * answers.
 *
 * Everything else under `/pitch/*` already redirects to `/pitch/road` in `next.config`.
 */
export interface PitchAppendix {
  href: string;
  label: string;
  /** The question the deck raises that this surface answers. If it does not answer one, it should
   *  not exist. */
  answers: string;
}

export const PITCH_APPENDICES: PitchAppendix[] = [
  {
    href: '/pitch/funder-pathways',
    label: 'Funder pathways',
    answers: 'How a community request becomes a visible, priced pathway.',
  },
  {
    href: '/pitch/community-narrative',
    label: 'Community narrative',
    answers: 'The storytellers, the themes, and what has been cleared to say.',
  },
  {
    href: '/pitch/document',
    label: 'Written document',
    answers: 'The long-form version, for a reader who wants prose over panels.',
  },
];

export const OPENER_HEADING = 'If you read nothing else';

/**
 * Five lines. Each one is a fact that already exists elsewhere in the system, restated in the
 * plainest available form. Nothing here is new, and nothing here is a projection.
 *
 * The order is `funder.needsToSee` applied literally: the road, then the separation of the two
 * pots, then the unmeasured thing named before they find it, then $0 signed.
 */
export const OPENER_LINES: string[] = [
  'Communities asked for beds that survive heat, dust, freight and a crowded house. The Stretch Bed is that bed, and it is in seven places.',
  'The goal is not a bigger Goods. It is a community that collects the plastic, makes the goods, and comes to own the making.',
  'Production is meant to pay for itself. The wraparound around it is grant funded on purpose, and keeping the two apart is the point, not a caveat.',
  'Freight is 35% of what a bed costs, more than plastic, diesel and labour together. That is the argument for making near community, and it is a cost argument rather than a values one.',
  'Nothing is signed. No order for the coming year is on paper, and the deck is the case for why it should be, not evidence that it already is.',
];

/**
 * Phrases the opener may never contain. Each is a real failure mode, not a style preference, and
 * each is asserted case-insensitively by the guards.
 *
 * `three sites` and `break even` are here for a live reason: the per-site annual running cost is
 * unresolved and the four candidate answers move break-even from two sites to five. Printing any
 * of them as settled is the thing this whole week established must not happen.
 */
export const OPENER_BANNED = [
  'break even',
  'break-even',
  'three sites',
  'payback',
  'guaranteed',
] as const;
// The "co-design" ban is deliberately NOT repeated here. It is a standing rule across all prose
// (Ben, 2026-07-11) and `check:voice` enforces it repo-wide. Restating it in this list duplicated a
// global rule and, because the literal itself is a retired phrase, tripped `check:retired-figures`.
