/**
 * THEORY OF CHANGE for the Brian M. Davis application (attachment 04).
 *
 * Rebuilt 18 September 2026 on Ben's ask: one page in the shape every reviewer recognises
 * (problem, inputs, activities, outputs, outcomes, impact, assumptions), scoped to THIS grant
 * (133 beds, $99,750), with the Foundation's own frame across the top. Sources for the frame:
 * Miranda Campbell's invitation of 1 September 2026 (youth employment now and future;
 * school and community engagement; sustainability including Décor plastics) and the
 * Foundation's Grant Strategy 2025 to 2030 (brianmdavis.org.au/grants/strategy).
 *
 * Every figure carries a label. Nothing here claims a health outcome, a Decor partnership,
 * or community ownership as complete.
 */
import { CANONICAL_ASSETS } from './asset-canonical';
import { PLASTIC_KG_PER_BED } from './products';
import { PAID_BEDS } from './story-questions';

export type TocLabel = 'verified' | 'modelled' | 'target' | 'pathway';

export const TOC_GRANT = { beds: 133, priceAud: 750, communities: 4, youngPeople: 100 } as const;
export const TOC_GRANT_AUD = TOC_GRANT.beds * TOC_GRANT.priceAud;
export const TOC_PLASTIC_KG = TOC_GRANT.beds * PLASTIC_KG_PER_BED;

/** The Foundation's frame, in its own words, and where Goods sits under each. */
export const TOC_FRAME = [
  { theirs: 'Youth employment', ours: 'Community organisations are encouraged to pay a local crew, and build days open the work to any young person.' },
  { theirs: 'Good Design', ours: 'The bed was designed in community. First Peoples\' knowledge sets how it is made and used.' },
  { theirs: 'Authentic Giving', ours: 'The community organisation decides who works, what they are paid and where beds go.' },
  { theirs: 'Seeing the Bigger Picture', ours: 'Floors, no local work and plastic with nowhere to go are one problem, answered with one product.' },
] as const;

export const TOC_PROBLEM =
  'In remote Aboriginal communities young people leave because there is no work where they live. Families sleep on floors because a bed cannot be bought locally and freight costs more than the bed. Plastic sits outside any kerbside collection and goes to landfill.';

export const TOC_INPUTS = [
  `$${TOC_GRANT_AUD.toLocaleString('en-AU')} buys ${TOC_GRANT.beds} Stretch Beds at $${TOC_GRANT.priceAud}. Making, freight and community work sit inside the price.`,
  'The design, the press and the build method from Goods on Country.',
  `Young people, and the decisions, from ${TOC_GRANT.communities} community organisations.`,
] as const;

export interface TocStream {
  id: string;
  impact: string;
  activity: string;
  output: { line: string; label: TocLabel };
  outcome: { line: string; label: TocLabel };
  longer: { line: string; label: TocLabel };
  counted: string;
}

/** One row per impact Goods already counts, in the Foundation's order of interest. */
export const TOC_STREAMS: readonly TocStream[] = [
  {
    id: 'engagement',
    impact: 'Young people, build days',
    activity: 'Open build days in each community, with the community organisation and, in Maningrida, Homeland School Company. Any young person can come, learn the build and take home their own family\'s bed.',
    output: { line: `About ${TOC_GRANT.youngPeople} young people take part across ${TOC_GRANT.communities} communities.`, label: 'target' },
    outcome: { line: 'Young people build the bed their own family sleeps on, and learn a build from start to finish.', label: 'target' },
    longer: { line: 'Build days become a regular local program the organisation runs itself.', label: 'pathway' },
    counted: 'Build days logged by date, place and who took part, with recorded consent.',
  },
  {
    id: 'youth-work',
    impact: 'Youth employment',
    activity: 'We recommend and encourage each community organisation to employ a small local crew to run the build days and deliver the beds, paid from the community work inside each bed\'s price. The organisation decides.',
    output: { line: 'Paid local crews, where each organisation chooses to employ one.', label: 'target' },
    outcome: { line: 'Crew members earn, and hold a record of paid work and a trade they can teach.', label: 'target' },
    longer: { line: 'Making roles at a community production facility, where one is funded separately.', label: 'pathway' },
    counted: 'The production log: crew paid, hours against completed beds.',
  },
  {
    id: 'households',
    impact: 'Households off the floor',
    activity: 'Beds go to households the community organisation chooses.',
    output: { line: `${TOC_GRANT.beds} beds placed, each recorded against a community and a date.`, label: 'target' },
    outcome: { line: 'People sleep off the floor on a bed they can wash and repair.', label: 'target' },
    longer: { line: 'Beds still in use at three months. We claim no health outcome.', label: 'target' },
    counted: 'The asset register, and follow-ups at delivery, six weeks and three months.',
  },
  {
    id: 'plastic',
    impact: 'Plastic recycled',
    activity: 'Waste plastic is shredded and pressed into bed legs.',
    output: { line: `About ${(TOC_PLASTIC_KG / 1000).toLocaleString('en-AU')} tonnes of plastic in ${TOC_GRANT.beds} beds.`, label: 'modelled' },
    outcome: { line: 'Plastic that had nowhere to go becomes a product that stays in use.', label: 'target' },
    longer: { line: 'Local plastic feeds a local press. We would welcome testing whether Décor plastics can feed it too; that is not yet tested.', label: 'pathway' },
    counted: 'Shred weighed in and parts weighed out, every batch.',
  },
  {
    id: 'enterprise',
    impact: 'Community enterprise',
    activity: 'The beds become the organisation\'s first trading stock, about 33 each, sold to buyers who hold health and housing budgets.',
    output: { line: `${TOC_GRANT.communities} organisations holding stock.`, label: 'target' },
    outcome: { line: 'Each makes a first sale and keeps the full price.', label: 'target' },
    longer: { line: 'Sales pay for the next lot, and the making moves toward community ownership.', label: 'pathway' },
    counted: 'Sales reported by each organisation. Nothing returns to Goods on Country.',
  },
];

export const TOC_IMPACT =
  'Young people have work where they live, families sleep off the floor, and the making, the work and the money stay in community.';

/** What is already true, so a reader can see the starting point. Verified records only. */
export const TOC_TODAY = [
  `${CANONICAL_ASSETS.bedsDeployed} beds in homes across ${CANONICAL_ASSETS.communitiesServed} communities.`,
  `${PAID_BEDS} bought and paid for by four organisations.`,
  'Forty pressed at our own facility and assembled in Maningrida by local young workers.',
] as const;

export const TOC_ASSUMPTIONS = [
  'The community organisation wants the work and sets the terms. If it does not, beds move to another community where a partner is in place.',
  'Buyers keep paying $750, as 320 beds on invoice already show.',
  'Young people choose to take part and can stop at any time, under the child safe practice in the application.',
  'Ownership of the making is a pathway. We do not claim it has moved until the community holds the keys, runs the payroll and invoices the buyer.',
] as const;
