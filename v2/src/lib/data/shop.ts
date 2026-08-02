/**
 * SHOP COPY — the spec-first answers ruling S asked for.
 *
 * "Rebuild /shop to lead with spec, price, lead time, freight, warranty, who fixes it."
 * (DECISIONS.md ruling S sweep list, 2026-07-26.)
 *
 * Sourcing rule: every answer is either a spec from products.ts, a figure from canon,
 * or an honest statement of process. Where no sourced figure exists (lead time has no
 * measured number; there is no formal warranty document), the answer says what actually
 * happens instead of inventing a number. The 10+ year design life is stated as design
 * intent, matching its verified: false claim flag elsewhere.
 */
import { canonValue } from './canon';
import { STRETCH_BED, PLASTIC_KG_PER_BED } from './products';

export interface ShopAnswer {
  question: string;
  answer: string;
}

/** The straight answers a buyer needs before the buy button, in the order ruled. */
export const SHOP_ANSWERS: ShopAnswer[] = [
  {
    question: 'The spec',
    answer: `${STRETCH_BED.specs.dimensions}, ${STRETCH_BED.specs.weight}, supports ${STRETCH_BED.specs.loadCapacity}. Recycled HDPE X-trestle legs, two galvanised steel poles (${STRETCH_BED.materials.frame.detail}), heavy-duty Australian canvas. Assembles in ${STRETCH_BED.specs.assemblyTime} with no tools; the canvas is the structure.`,
  },
  {
    question: 'The price',
    answer: `$${canonValue('stretch-price')} for a single Stretch Bed. Each bed diverts ${PLASTIC_KG_PER_BED}kg of plastic from landfill.`,
  },
  {
    question: 'Lead time',
    answer: 'Beds are made in batches, not warehoused. We confirm your dispatch window when you order rather than promise a number we have not measured.',
  },
  {
    question: 'Freight',
    answer: 'Freight is quoted by destination. Remote deliveries carry real freight costs and we say so up front; for bulk or community orders, contact us for a quote before you buy.',
  },
  {
    question: 'How long it lasts',
    answer: `Designed to last ${STRETCH_BED.specs.designLifespan} in remote conditions. That is the design intent, not yet a field-proven number, and we will say so until it is.`,
  },
  {
    question: 'Who fixes it',
    answer: 'We do. Every bed carries a QR code: scan it to report an issue, and we arrange the repair or replacement and stay reachable by SMS. The canvas is washable and replaceable.',
  },
];
