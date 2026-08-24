/**
 * HOMEPAGE A — "The Bed on Country". The single source for every word on `/`.
 *
 * Built 2026-07-26 from Ben's picked Pencil mock (design/goods-theory-of-change-v2.pen,
 * frame "Homepage A"), merged as #171 and reverted unseen (#173). Revived 2026-08-06 for
 * the wayfinding review, adapted to the audience model: hero → provenance → compact story →
 * feature film (canon slot) → Stretch Bed with buy → facility with the six stages →
 * voices → road-as-lessons → FOUR doors, one per audience next-action.
 *
 * Rules this module enforces by construction (asserted in home.guards.test.ts):
 *   - Every named voice is on the external clearance list (cleared-voices.ts).
 *   - Every quote is verbatim from curated-quotes.ts. No quote is ever written here.
 *   - The stage chips are PUBLIC_STAGES (pathway-stages.ts), never a local list.
 *   - The road band is ROAD_STOPS lessons (road-spine.ts), never place names alone.
 *   - Numbers come from canon / products, never inline.
 *   - Photo paths are git-tracked files under public/, never design/starred-images.
 *   - The feature film renders from the 'video-maningrida-case-study' canon slot, so the
 *     section appears when the cleared cut lands and no 13MB file ever enters git.
 */
import { canonValue } from './canon';
import { canonVideo, type CanonVideoEntry } from './canon-videos';
import { PLASTIC_KG_PER_BED } from './products';
import { PUBLIC_STAGES } from './pathway-stages';
import { ROAD_STOPS, THE_GAP } from './road-spine';
import { getCuratedQuotes } from './curated-quotes';

export const HOME_HERO = {
  headline: 'A bed made on Country, from the plastic that was already here.',
  image: '/images/community/maningrida/whole-run-at-sunset.jpg',
  imageAlt:
    'The whole run of finished Stretch Beds at Maningrida at sunset, people sitting on them after build day',
  primaryCta: { label: 'Buy the Stretch Bed', href: '/shop/stretch-bed-single' },
  secondaryCta: { label: 'Walk the road', href: '/story' },
} as const;

/** The strip under the hero. Short claims, each one already true elsewhere in code. */
export const HOME_PROVENANCE = [
  '40 beds pressed end to end',
  `${PLASTIC_KG_PER_BED}kg of HDPE per bed`,
  'Designed in community, led by community',
  'Ownership is a pathway',
] as const;

export const HOME_STORY_COMPACT = {
  eyebrow: 'About Goods',
  line: 'Beds donated to remote communities kept disappearing. So communities started making their own: quality furniture, pressed from the plastic already on Country, on a road to owning the making itself.',
  link: { label: 'Read the full story', href: '/story' },
} as const;

/**
 * The Maningrida feature film. Resolves from the 'video-maningrida-case-study' canon
 * slot (the film slot the case study also reads). While the slot is empty — the cut is
 * still being cleared — this returns null and the homepage section does not render.
 * A produced edit with sound renders click-to-play with controls, never autoplay.
 */
export function homeFeatureVideo(): (CanonVideoEntry & { copy: typeof HOME_FEATURE_COPY }) | null {
  const v = canonVideo('video-maningrida-case-study');
  if (!v) return null;
  return { ...v, copy: HOME_FEATURE_COPY };
}

export const HOME_FEATURE_COPY = {
  eyebrow: 'Maningrida, July 2026',
  title: 'Our biggest build, in one community.',
  caption:
    'Forty beds and the school washing machine, built with the Gamardi community and Homeland School Company. Four minutes, worth the sound on.',
  link: { label: 'The whole road that led here', href: '/story' },
} as const;

export const HOME_BED_SECTION = {
  eyebrow: 'The Stretch Bed',
  title: 'A bed built to stay.',
  body: `Two steel poles thread through the canvas and the crossed recycled-plastic legs; tensioning locks it all together. ${PLASTIC_KG_PER_BED}kg of HDPE diverted per bed. Flat-packs, assembles anywhere, and the canvas is the structure.`,
  image: '/images/community/maningrida/men-over-finished-bed.jpg',
  imageAlt: 'Men looking over a finished Stretch Bed, the X-trestle tension design visible',
  price: canonValue('stretch-price') as number,
  buyCta: { label: `Buy the bed · $${canonValue('stretch-price')}`, href: '/shop/stretch-bed-single' },
  moreLink: { label: 'More about the bed', href: '/shop' },
} as const;

export const HOME_FACILITY_SECTION = {
  eyebrow: 'The production facility',
  title: 'A factory that can move to community ownership.',
  body: 'A containerised plant that shreds the plastic, presses the sheets and cuts the legs. Forty beds pressed end to end prove the process. Each community picks the pieces it wants to run, and the pathway is walked together.',
  image: '/images/process/factory-panorama.jpg',
  imageAlt: 'Panorama of the on-country production facility',
  /** The six public stages, from the locked model. Render label only; line on hover/detail. */
  stages: PUBLIC_STAGES,
  links: [
    { label: 'About the facility', href: '/process' },
    { label: 'The pathways to ownership', href: '/pathways' },
  ],
} as const;

export interface HomeVoiceCard {
  /** Must be cleared for external use (cleared-voices.ts). */
  name: string;
  /** Where they speak from, for the byline. */
  place: string;
  /** Index into their curated quotes. The text is looked up, never copied. */
  quoteIndex: number;
  image: string;
  imageAlt: string;
}

export const HOME_VOICES = {
  eyebrow: 'Voices lead the road',
  title: 'Every stop on the road is a person saying something.',
  link: { label: 'All storytellers', href: '/storytellers' },
  cards: [
    {
      name: 'Gloria Turner',
      place: 'Kalgoorlie',
      quoteIndex: 0,
      image: '/images/people/gloria-turner.jpg',
      imageAlt: 'Gloria Turner',
    },
    {
      name: 'Dianne Stokes',
      place: 'Tennant Creek',
      quoteIndex: 0,
      image: '/images/people/dianne-stokes.jpg',
      imageAlt: 'Dianne Stokes',
    },
    {
      name: 'Fred Campbell',
      place: 'Alice Springs',
      quoteIndex: 0,
      image: '/images/people/fred-campbell.png',
      imageAlt: 'Fred Campbell',
    },
  ] satisfies HomeVoiceCard[],
} as const;

/** Resolve a card's quote from the curated store. Throws if the voice has no quote there. */
export function homeVoiceQuote(card: HomeVoiceCard): string {
  const quotes = getCuratedQuotes(card.name);
  const quote = quotes?.[card.quoteIndex];
  if (!quote) throw new Error(`No curated quote for homepage voice "${card.name}".`);
  return quote.text;
}

export const HOME_ROAD = {
  eyebrow: 'The road to ownership',
  title:
    'The goal was never a bigger Goods. It is a community that can collect the plastic, make the goods, and come to own the making.',
  /** The stops render as LESSONS (taught), never place names alone. */
  stops: ROAD_STOPS,
  gapLine: THE_GAP.line,
  cta: { label: 'Walk all seven stops', href: '/story' },
} as const;

/**
 * FOUR doors, one per audience next-action (audience.ts, applied 2026-08-06):
 * buyer → shop, supporter → sponsor, community → a yarn with nothing proposed,
 * funder → the road. The community door carries no prices and proposes nothing;
 * the funder door carries no figures (one-money-surface rule).
 */
export const HOME_DOORS = [
  {
    title: 'Buy a bed',
    body: `$${canonValue('stretch-price')}. Spec, freight and lead time up front.`,
    cta: { label: 'Shop', href: '/shop/stretch-bed-single' },
    tone: 'terracotta' as const,
  },
  {
    title: 'Sponsor a bed',
    body: 'One bed, one community, one receipt.',
    cta: { label: 'Sponsor', href: '/sponsor' },
    tone: 'gold' as const,
  },
  {
    title: 'Want this where you are?',
    body: 'Start with a yarn about what would be useful where you are. Nothing proposed.',
    cta: { label: 'Talk to Goods', href: '/contact' },
    tone: 'sage' as const,
  },
  {
    title: 'Back the making',
    body: 'Repayable capital for the plant that communities come to own. The whole road, with evidence.',
    cta: { label: 'See the pitch', href: '/pitch/road' },
    tone: 'teal' as const,
  },
] as const;
