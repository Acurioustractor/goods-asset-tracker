/**
 * Every bed figure is scoped to a different population, and only one of them says so.
 *
 * Ben, 11 September 2026, on the demand record being the weakest thing we have: we do not really
 * have a system, we are taking what the community says, and it should be built from what locals
 * count. He is right, and the reason is not the one it first looks like.
 *
 * `place-denominator.ts` already rules out deriving a bed number from ABS overcrowding, and that
 * ruling stands: CNOS counts BEDROOMS and Goods supplies BEDS, so an empty three-bedroom house is
 * not overcrowded by that standard and is exactly the household we serve. Nothing here reopens it.
 *
 * ---------------------------------------------------------------------------
 * THE FIRST READING WAS WRONG, AND IT IS KEPT HERE ON PURPOSE
 * ---------------------------------------------------------------------------
 * Divide the four recorded figures by community population and they span a factor of 43. Divide
 * them by dwellings needing an extra bedroom and three of them land between 0.22 and 0.30, which
 * looks like a rate hiding under the noise.
 *
 * That is four numerators being divided by the wrong denominator, and no rate at all.
 *
 * Maningrida's 65 is "beds for kids in the Maningrida homelands". The homelands are outstations,
 * a small fraction of the 2,518 people the ABS counts in the Maningrida ILOC. Dividing 65 by 2,518
 * produces a number about a population the figure was never about. Utopia's 150 is "beds for every
 * child" across the Utopia homelands, which is much closer to the ABS area. So Utopia looks 16
 * times more demanding than Maningrida when the two rules are almost the same rule.
 *
 * The apparent cluster at 0.26 is an artefact. Anyone who builds on it will be wrong.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS ACTUALLY MISSING
 * ---------------------------------------------------------------------------
 * Three fields, and we hold at most two of them for any figure:
 *
 *   QUESTION   Is this what the community needs, or what it will order in a year. Different
 *              different objects. They are never summed.
 *   SCOPE      Which population it covers. The whole community, the homelands, the children,
 *              one household. Without this no figure can be compared to any other.
 *   OWNER      Who set it and by what rule, so a funder asking where it came from gets a person.
 *
 * Utopia has a question and a rule and no owner. Maningrida has a question, a rule and a scope
 * nobody wrote in a comparable form. Palm Island has none of the three. Tennant Creek has all
 * three and is twenty beds.
 *
 * So: no rate, no total, and the next real step is one community counting properly.
 */

export const READ_AT = '2026-09-11';

export const WHY =
  'Ben, 11 September 2026: we do not have a system for demand, we are taking what the community says, and it should be built from what locals count. Each figure on the record is scoped to a different population and only one of them says which.';

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

export type Scope =
  | 'whole-community' // everyone the ABS counts in that place
  | 'a-part-of-it' // outstations, homelands, one age group: smaller than the ABS area and unmeasured
  | 'one-household' // one person's own offer
  | 'not-stated'; // nobody wrote down who it covers

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
  /** Which population the figure covers. Without this it cannot be compared to any other figure. */
  readonly scope: Scope;
  readonly scopeNote: string;
  readonly rule: string | null;
  readonly setBy: string | null;
}

/** True only when all three of question, scope and owner are present. */
export function isComparable(f: PlaceFigure): boolean {
  return f.scope !== 'not-stated' && f.rule !== null && f.setBy !== null;
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
    scope: 'a-part-of-it',
    scopeNote: 'Children across the Utopia homelands. Close to the ABS area but not the same as it, and the child population has never been stated.',
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
    answers: 'need',
    scope: 'a-part-of-it',
    scopeNote: 'Children in the Maningrida homelands, which are outstations and a small fraction of the 2,518 people the ABS counts in the Maningrida area. This is why dividing 65 by 2,518 is meaningless.',
    rule: 'Beds for kids in the Maningrida homelands.',
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
    scope: 'not-stated',
    scopeNote: 'A figure from a partner update. Nobody recorded who it covers, what rule produced it or who said it.',
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
    scope: 'one-household',
    scopeNote: 'What one Elder offered to self-fund. It covers her own reach and was never a statement about Tennant Creek.',
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
export const COMPARABLE = FIGURES.filter(isComparable);
export const SCOPE_NOT_STATED = FIGURES.filter((f) => f.scope === 'not-stated');

function spread(xs: number[]): number {
  return Math.max(...xs) / Math.min(...xs);
}

/**
 * Kept so the artefact stays visible. Both of these divide figures about different populations by
 * the same ABS denominator, so neither is a rate and neither may be used to size anything.
 */
export const SPREAD_PER_HEAD = spread(FIGURES.map(peoplePerBed));
export const SPREAD_PER_CROWDED = spread(FIGURES.map(bedsPerCrowdedDwelling));

export const NO_RATE_EXISTS =
  'There is no beds-per-person rate to recover, and the near miss is instructive. Divided by dwellings needing an extra bedroom, three of the four figures land between 0.22 and 0.30 and look like a rate. They are not. Maningrida\'s 65 is about the homelands and is being divided by the whole 2,518-person ABS area, so it lands low for a reason that has nothing to do with demand. Fixing the denominator is not possible, because nobody recorded what the numerator covered.';

export const THE_FINDING =
  'Of four recorded figures, one states its scope well enough to compare, one is scoped to a part of a community nobody has measured, one is scoped to a part that is much smaller than the area it is filed under, and one states no scope at all. Only Tennant Creek carries a question, a scope and an owner together, and it is twenty beds offered by one person.';

export const THE_RATE_IS_NOT_A_FORMULA =
  'Nothing in this module may be used to generate a bed number for a community we have not spoken to. That is the move place-denominator.ts exists to prevent, and the apparent 0.26 rate is exactly the kind of thing that would be used to do it.';

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
    why: 'The one number we report as impact. A person off the floor is the only measure of ours that anybody counts.',
  },
  {
    field: 'first in line',
    ask: 'Who in this house would use a new bed first.',
    why: 'Turns a count into a delivery list, so the first beds go where the household says.',
  },
];

export const WHO_COUNTS =
  'A local person paid for the work. Never a visitor. The count is theirs, it stays with the community organisation, and Goods receives a total and a delivery list. The household register stays where it was made.';

export const COUNT_IS_THE_MISSING_PIECE =
  'No community has done this count. Every need figure we hold is somebody\'s impression, including the good ones. One community doing it properly is worth more than four more conversations.';

// ---------------------------------------------------------------------------
// What changes in how we write and decide
// ---------------------------------------------------------------------------

export const RULES: readonly string[] = [
  'Every recorded figure carries three fields: which question it answers, which population it covers, and who set it. Two out of three is not a demand record.',
  'Need and order are never summed. The 778 on the record today is such a sum.',
  'A figure is compared to another figure only when both state their scope. Today none of them can be.',
  'Siting stays on readiness: beds already there, the organisation has asked, somebody local wants to run it, people there have cleared quotes. Demand size sites nothing.',
  'An order figure needs a rule and a name before it enters a funding application. Four of the five figures on record still have neither.',
  'A need figure that nobody counted is an impression, and it is written as one.',
];

export const HOW_MANY_RULES = RULES.length;

export const WHAT_TO_DO_NEXT =
  'Two things, and neither is a spreadsheet. Ask Utopia and Maningrida who set their figure and how many children it covers, which turns two impressions into two scoped numbers. Then run the household count on Palm Island, where there are already 131 beds, seven cleared voices and three organisations that have asked, and where the recorded 40 has no rule, no scope and no name behind it.';
