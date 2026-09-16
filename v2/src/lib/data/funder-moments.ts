/**
 * Where a funder enters the road, and what their money did there.
 *
 * Ben, 16 September 2026: the people who backed Goods from the start were nowhere in the
 * story. The live /pitch carried 114 mentions of Oonchiumpa, 37 of QBE, 34 of Centrecorp
 * (a buyer) and ZERO of Snow Foundation, who have paid 64 per cent of every philanthropic
 * dollar Goods has ever received and whose most recent invoice was four months ago.
 *
 * The rule this file encodes: a funder appears where their money appears in the world, not
 * in a gratitude section at the end. So a moment is keyed by the ROAD STOP it belongs to,
 * and renders inside that stop. A logo row is not shareable. A page where a funder can point
 * at the thing they caused is.
 *
 * Framing ruling (Ben, same day): catalytic capital and backing the founder, NEVER a
 * graduation story. Do not write that grants were the right capital "then" and the model
 * stands alone now. Snow is current, not historical, and there is an open raise on the page.
 * The argument is the ORDER funders arrived in. Amounts come second.
 *
 * Voice: the quote is resolved from storyteller-registry.ts at render time and must be tier
 * `funder` with status `approved`. The community `Voice` component gates on tier `external`
 * and must never be used for a funder; the registry says so on Georgina's record. Matching is
 * on a fragment of the quote TEXT, never its context label, so an editorial tweak to a
 * context string can never silently swap which words get published.
 */

import { GRANTS_RECEIVED } from './grants-received';

export interface FunderMoment {
  /** The `story-road.ts` stop id this moment belongs inside. */
  stopId: string;
  /** Must match a `funder` string in grants-received.ts, so the money line is derived. */
  grantFunder: string;
  /** Display name, where the legal funder string is too long for a caption. */
  label: string;
  logo: { src: string; width: number; height: number };
  /** When they were physically there. Ben confirmed 3 April 2025 for Tennant Creek. */
  when: string;
  place: string;
  /** One factual sentence. No adjectives that the books cannot support. */
  line: string;
  photo: { src: string; alt: string; caption: string } | null;
  /** Registry slug + a distinctive fragment of the approved quote to print. */
  voice: { slug: string; quoteContains: string } | null;
}

export const FUNDER_MOMENTS: readonly FunderMoment[] = [
  {
    stopId: 'stop-2-tennant-creek',
    grantFunder: 'Snow Foundation',
    label: 'Snow Foundation',
    logo: { src: '/images/partners/snow-foundation-mono.png', width: 2194, height: 1056 },
    when: '3 April 2025',
    place: 'Tennant Creek',
    line:
      'Snow paid the first invoice in October 2023, before there was a product, a register, a charity, a board or a customer. Georgina Byron and Sally Grimsley-Ballard came to Tennant Creek and stood in the problem themselves.',
    photo: {
      src: '/images/media-pack/snow-tennant-creek-april-2025.jpg',
      alt: 'Six people talking outside a house in Tennant Creek, a dumped mattress on the ground and a sheet strung up for shade',
      caption: 'Tennant Creek, 3 April 2025. No cheque, no stage: the funder outside the house, being shown what a bed has to answer.',
    },
    voice: {
      slug: 'georgina-byron',
      // "It's not a for, it's a with". A funder stating the design-in-community principle,
      // which is worth more than Goods asserting it.
      quoteContains: "It's not a for, it's a with",
    },
  },
  {
    stopId: 'stop-4-palm-island',
    grantFunder: 'Vincent Fairfax Family Foundation with FRRR, Backing the Future',
    label: 'Vincent Fairfax Family Foundation with FRRR',
    logo: { src: '/images/partners/frrr.png', width: 1024, height: 491 },
    when: 'August to November 2025',
    place: 'Palm Island',
    line:
      "Backing the Future is FRRR's youth program, co-funded by the Vincent Fairfax Family Foundation. It paid for the Palm Island pilot: 25 beds built on the island, three community sessions, and 30 young people on the build. Jahvan Oui and Ebony Oui were hosted at the Sydney factory in September 2025 to learn the production side. The work cost $73,000 against a $50,000 grant and A Curious Tractor carried the difference. Acquitted in March 2026, the only grant here that is finished, reported and closed.",
    photo: {
      src: '/images/community/palm-island/crate-build-shed.jpg',
      alt: 'People of all ages laying out black collapsible crates in rows inside a shed on Palm Island, building Basket Beds',
      caption: 'Palm Island, 2025. Laying the crates out in the shed. The youngest person in the photograph is carrying one.',
    },
    // No quote. FRRR and VFFF have never given us words of their own. Jahvan Oui is
    // tier `external`, a community voice, so he belongs in the stop's Voice slot with
    // his own label and never inside a funder's block. The guard enforces it.
    voice: null,
  },
];

/** The reconciled money line for a moment, as it stands in the books. */
export function grantLineFor(moment: FunderMoment) {
  return GRANTS_RECEIVED.find((g) => g.funder === moment.grantFunder);
}

export function funderMomentFor(stopId: string): FunderMoment | undefined {
  return FUNDER_MOMENTS.find((m) => m.stopId === stopId);
}
