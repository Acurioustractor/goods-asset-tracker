/**
 * OWNERSHIP PROBLEM DATA — why who owns the business changes who gets the work.
 *
 * The fourth problem area, and the only one where the number is about a mechanism rather than a
 * deficit. The other three describe what is wrong. This one describes what changes it.
 *
 * ---------------------------------------------------------------------------
 * THE NUMBER
 * ---------------------------------------------------------------------------
 * Across 3,327 Indigenous businesses registered and certified with Supply Nation, **68.4% of
 * employees are Indigenous**. The brief sets that against "the 3-5% targets aspired to and being
 * adopted by some non-Indigenous businesses".
 *
 * That is the argument for community ownership stated as evidence rather than as principle. The
 * employment problem is 35% of First Nations people aged 25 to 64 in work in very remote Australia
 * (`employment-problem.ts`). Ownership is the lever that moves it, and this is the measurement.
 *
 * The rate falls as businesses grow: 97.2% in single-employee businesses, 58.2% at two to nineteen
 * employees, 38.3% above twenty. Worth carrying, because it says a plant that grows without
 * transferring ownership drifts back toward the average.
 *
 * ---------------------------------------------------------------------------
 * THE DEFINITION THAT KEEPS RECURRING
 * ---------------------------------------------------------------------------
 * An Indigenous business is one with **at least 50% Aboriginal and Torres Strait Islander
 * ownership**. That is the same threshold IBA applies, where it reads as "ownership or membership",
 * and the same question sitting unanswered in The Butterfly Movement's constitution.
 *
 * So this figure is not only the impact argument. It is the eligibility test for a class of First
 * Nations finance, and both turn on the same unread document.
 *
 * ---------------------------------------------------------------------------
 * THE CEILING
 * ---------------------------------------------------------------------------
 * Goods does not yet own any of this. No plant has transferred, the ownership test at month six
 * has never been run, and the community share of a sale was settled only on 10 September. These
 * figures describe what the sector achieves, never what Goods has achieved.
 */

export type OwnershipGrade = 'verified' | 'unverified';

export interface OwnershipFigure {
  value: string;
  what: string;
  asAt: string;
  sourceUrl: string;
  grade: OwnershipGrade;
  note?: string;
}

const SN_BRIEF =
  'https://supplynation.org.au/wp-content/uploads/2022/06/Supply-Nation-Research-Policy-Brief-No.3-250322-94.pdf';
const SN = 'https://supplynation.org.au/';

export const OWNERSHIP_CLAIM_CEILING =
  'These figures describe what Indigenous-owned businesses achieve as a sector. Goods has ' +
  'transferred no plant, has never run its month-six ownership test, and settled the community ' +
  'share of a sale on 10 September 2026. Nothing here is a Goods result, and no sector rate may ' +
  'be applied to a Goods community or multiplied by a bed count.';

/** Read from the Supply Nation research brief itself, not from a summary of it. */
export const INDIGENOUS_EMPLOYMENT_IN_INDIGENOUS_BUSINESS: readonly OwnershipFigure[] = [
  {
    value: '68.4%',
    what: 'of employees are Indigenous, averaged across 3,327 Indigenous businesses registered and certified with Supply Nation',
    asAt: '2022',
    sourceUrl: SN_BRIEF,
    grade: 'verified',
  },
  {
    value: '3 to 5%',
    what: 'the Indigenous employment targets the brief says some non-Indigenous businesses aspire to and are adopting',
    asAt: '2022',
    sourceUrl: SN_BRIEF,
    grade: 'verified',
  },
  {
    value: '97.2%, 58.2%, 38.3%',
    what: 'the same rate in single-employee businesses, those with two to nineteen employees, and those above twenty',
    asAt: '2022',
    sourceUrl: SN_BRIEF,
    grade: 'verified',
    note: 'The rate falls as a business grows, so scale without transferred ownership drifts toward the average.',
  },
  {
    value: '71.8%',
    what: 'the rate in not-for-profit Indigenous organisations and Aboriginal corporations, above the for-profit 68.1%',
    asAt: '2022',
    sourceUrl: SN_BRIEF,
    grade: 'verified',
  },
  {
    value: '40 to 100 times',
    what: 'how much more likely an Indigenous business is to employ Indigenous people than a non-Indigenous business, as the brief states it',
    asAt: '2022',
    sourceUrl: SN_BRIEF,
    grade: 'unverified',
    note: 'The brief cites this to a further source which was not opened. The 68.4% against 3 to 5% above is the same point, read directly, and is the safer line to use.',
  },
];

/** The sector, for scale. Read from secondary reporting, so graded accordingly. */
export const SECTOR_SCALE: readonly OwnershipFigure[] = [
  {
    value: 'over $16 billion revenue, $4.2 billion in wages, about 120,000 people employed',
    what: 'the Indigenous business sector in Australia',
    asAt: '2024',
    sourceUrl: SN,
    grade: 'unverified',
    note: 'Attributed to Dilin Duwa Centre for Indigenous Business Leadership via secondary reporting. The primary has not been opened.',
  },
];

/**
 * The 50% threshold, which is simultaneously the statistical definition of an Indigenous business
 * and the eligibility gate on First Nations finance.
 */
export const OWNERSHIP_THRESHOLD = {
  definition:
    "In Australia, an 'Indigenous business' is understood for statistical purposes as a business " +
    'that has at least 50% Aboriginal and / or Torres Strait Islander ownership.',
  sourceUrl: SN_BRIEF,
  alsoGates:
    'The same 50% threshold gates Indigenous Business Australia finance, where it reads as ' +
    'ownership or membership. For a company limited by guarantee the test is membership, which ' +
    "sits in The Butterfly Movement's constitution and has not been read.",
} as const;

export function allOwnershipFigures(): OwnershipFigure[] {
  return [...INDIGENOUS_EMPLOYMENT_IN_INDIGENOUS_BUSINESS, ...SECTOR_SCALE];
}

export function needsPrimarySource(): OwnershipFigure[] {
  return allOwnershipFigures().filter((f) => f.grade === 'unverified');
}
