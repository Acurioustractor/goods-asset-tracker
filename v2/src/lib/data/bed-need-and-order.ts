/**
 * Two questions, not one number.
 *
 * Ben, 11 September 2026, on the demand record being the weakest thing we have: we do not really
 * have a system, we are taking what the community says, and it should work from locals.
 *
 * He is right, and the reason is sharper than it looks. `place-denominator.ts` already rules out
 * deriving a bed number from ABS overcrowding, and that ruling stands: CNOS counts BEDROOMS and
 * Goods supplies BEDS, so an empty three-bedroom house is not overcrowded by that standard and is
 * exactly the household we serve. Nothing here reopens that.
 *
 * What this module adds is why the four recorded figures look like chaos. Measured per head they
 * span a factor of 43, from one bed per three people at Utopia to one per 128 at Tennant Creek.
 * Measured per dwelling that needs an extra bedroom, three of the four land between 0.22 and 0.30,
 * a spread of 1.3, and Utopia sits at 4.41.
 *
 * Three of them agree because they are answers to the same question. Utopia disagrees because it
 * answers a different one. Utopia's rule is "beds for every child", which is a statement of NEED.
 * The other three are statements of what a community will take in a year, which is an ORDER.
 *
 * Putting both in one column and calling it recorded demand is what let Q7 claim Palm Island had
 * the largest demand, which was false and would have been caught by any assessor who read the
 * register.
 *
 * So: ask both questions every time, record which is which, and never add them together.
 */

export const READ_AT = '2026-09-11';

export const WHY =
  'Ben, 11 September 2026: we do not have a system for demand, we are taking what the community says, and it should be built from what locals count. The four figures on the record answer two different questions and nobody wrote down which.';

// ---------------------------------------------------------------------------
// The two questions
// ---------------------------------------------------------------------------

export type Question = 'need' | 'order';

export const QUESTIONS: Record<Question, { ask: string; answeredBy: string; usedFor: string }> = {
  need: {
    ask: 'How many people here sleep without a bed of their own.',
    answeredBy: 'A local person counting, household by household, on the same form everywhere.',
    usedFor: 'Reporting impact against something real, and knowing when a community is done.',
  },
  order: {
    ask: 'How many beds can this community take in the next twelve months, and who pays.',
    answeredBy: 'The community organisation, with a rule it can state.',
    usedFor: 'Production planning, freight, and what goes in a funding application.',
  },
};

export const NEVER_ADD_THEM =
  'A need figure and an order figure are different objects and must never be summed into one demand total. The 778 beds on the record today is such a sum, and it is the number that has to be split.';

// ---------------------------------------------------------------------------
// The record as it stands, with each figure classified
// ---------------------------------------------------------------------------

export interface PlaceFigure {
  readonly communityId: string;
  readonly name: string;
  /** ABS Census 2021 via community-need.ts. Occupied dwellings times persons per dwelling. */
  readonly peopleApprox: number;
  readonly occupiedDwellings: number;
  /** Dwellings needing one or more extra bedrooms. A bedroom count. */
  readonly needOneOrMoreBedrooms: number;
  readonly beds: number;
  /** Which question this figure actually answers, on the evidence of its rule. */
  readonly answers: Question;
  readonly rule: string | null;
  readonly setBy: string | null;
}

export const FIGURES: readonly PlaceFigure[] = [
  {
    communityId: 'utopia',
    name: 'Utopia',
    peopleApprox: 444,
    occupiedDwellings: 82,
    needOneOrMoreBedrooms: 34,
    beds: 150,
    answers: 'need',
    rule: 'Beds for every child.',
    setBy: null,
  },
  {
    communityId: 'maningrida',
    name: 'Maningrida',
    peopleApprox: 2_518,
    occupiedDwellings: 394,
    needOneOrMoreBedrooms: 237,
    beds: 65,
    answers: 'order',
    rule: null,
    setBy: null,
  },
  {
    communityId: 'palm-island',
    name: 'Palm Island',
    peopleApprox: 2_097,
    occupiedDwellings: 491,
    needOneOrMoreBedrooms: 134,
    beds: 40,
    answers: 'order',
    rule: null,
    setBy: null,
  },
  {
    communityId: 'tennant-creek',
    name: 'Tennant Creek',
    peopleApprox: 2_549,
    occupiedDwellings: 864,
    needOneOrMoreBedrooms: 90,
    beds: 20,
    answers: 'order',
    rule: 'Dianne Stokes offered to self-fund twenty beds.',
    setBy: 'Dianne Stokes, Elder, Tennant Creek',
  },
];

export function peoplePerBed(f: PlaceFigure): number {
  return f.peopleApprox / f.beds;
}
export function bedsPerDwelling(f: PlaceFigure): number {
  return f.beds / f.occupiedDwellings;
}
export function bedsPerCrowdedDwelling(f: PlaceFigure): number {
  return f.beds / f.needOneOrMoreBedrooms;
}

export const ORDERS = FIGURES.filter((f) => f.answers === 'order');
export const NEEDS = FIGURES.filter((f) => f.answers === 'need');

function spread(xs: number[]): number {
  return Math.max(...xs) / Math.min(...xs);
}

/** All four, per head. Looks like nobody is measuring the same thing. */
export const SPREAD_PER_HEAD = spread(FIGURES.map(peoplePerBed));
/** All four, per crowded dwelling. Still wide, because two questions are mixed. */
export const SPREAD_PER_CROWDED = spread(FIGURES.map(bedsPerCrowdedDwelling));
/** The three order figures alone, per crowded dwelling. This is the finding. */
export const ORDER_SPREAD_PER_CROWDED = spread(ORDERS.map(bedsPerCrowdedDwelling));
export const ORDER_RATE_MEAN =
  ORDERS.reduce((n, f) => n + bedsPerCrowdedDwelling(f), 0) / ORDERS.length;

export const THE_FINDING =
  'Per head the four figures span a factor of 43 and look like noise. Per dwelling needing an extra bedroom, the three order figures land between 0.22 and 0.30, a spread of 1.3, while Utopia sits at 4.41. Three communities are answering the same question and one is answering a different one.';

export const THE_RATE_IS_NOT_A_FORMULA =
  'The 0.26 average is a sanity check on an order somebody has already given, never a way to generate one. Multiplying a community we have not spoken to by 0.26 produces a number nobody owns, which is the move place-denominator.ts exists to prevent.';

// ---------------------------------------------------------------------------
// The count a local person does, which is the part that does not exist yet
// ---------------------------------------------------------------------------

export interface CountField {
  readonly field: string;
  readonly ask: string;
  readonly why: string;
}

/** Four questions per household. Short enough to do on a phone, walking. */
export const HOUSEHOLD_COUNT_FORM: readonly CountField[] = [
  {
    field: 'sleeping here',
    ask: 'How many people sleep in this house most nights.',
    why: 'The Census counts who lives here. This counts who sleeps here, and in these communities they are different numbers.',
  },
  {
    field: 'have a bed',
    ask: 'How many of them have a bed of their own.',
    why: 'The measure Goods actually changes. Nothing in the Census carries it.',
  },
  {
    field: 'on the floor',
    ask: 'How many sleep on the floor, on a mattress on the floor, or outside.',
    why: 'The one number we report as impact. A person off the floor is the only measure of ours that is counted rather than modelled.',
  },
  {
    field: 'first in line',
    ask: 'Who in this house would use a new bed first.',
    why: 'Turns a count into a delivery list, and means the first beds go where the household says rather than where we guess.',
  },
];

export const WHO_COUNTS =
  'A local person paid for the work, not a visitor. The count is theirs, it stays with the community organisation, and Goods receives a total and a delivery list rather than a household register.';

export const COUNT_IS_THE_MISSING_PIECE =
  'No community has done this count. Every need figure we hold is somebody\'s impression, including the good ones. One community doing it properly is worth more than four more conversations.';

// ---------------------------------------------------------------------------
// What changes in how we write and decide
// ---------------------------------------------------------------------------

export const RULES: readonly string[] = [
  'Every recorded figure carries which question it answers. A figure with no question is not a demand record.',
  'Need and order are never summed. The 778 on the record today is such a sum.',
  'Siting stays on readiness: beds already there, the organisation has asked, somebody local wants to run it, people there have cleared quotes. Demand size sites nothing.',
  'An order figure needs a rule and a name before it enters a funding application. Four of the five figures on record still have neither.',
  'A need figure that nobody counted is an impression, and it is written as one.',
];

export const WHAT_TO_DO_NEXT =
  'Utopia has the rule and is missing the name, so one conversation converts it. Palm Island is where the first household count should run, because there are 131 beds there already, seven cleared voices and three organisations that have asked.';
