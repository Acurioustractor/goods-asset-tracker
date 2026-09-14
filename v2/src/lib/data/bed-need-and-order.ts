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
  'A need figure and an order figure are different objects and must never be summed into one demand total. The 778 beds that once sat on the record was such a sum; the figures under it were withdrawn on 15 September 2026.';

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

/**
 * WITHDRAWN. Ben, 15 September 2026: the four recorded figures (Utopia 150, Maningrida 65, Palm
 * Island 40, Tennant Creek 20) were made up and are withdrawn. The list is empty on purpose. The
 * classification above stays so that the next real figure, from a local count, is recorded with all
 * three fields.
 */
export const FIGURES: readonly PlaceFigure[] = [];

export const FIGURES_WITHDRAWN =
  'Ben, 15 September 2026: the recorded bed-demand figures (Utopia 150, Maningrida 65, Palm Island 40, Tennant Creek 20 and 3, Groote 500) were withdrawn as unfounded. None is printed anywhere. The paid trade is the only demand record we hold.';

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
  return xs.length ? Math.max(...xs) / Math.min(...xs) : 0;
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
  'The four figures once recorded here failed every test in this module: none stated its scope well enough to compare, and on 15 September 2026 Ben withdrew them as unfounded. No community has been counted. The record is empty until one is.';

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
  'Need and order are never summed. The 778 that once sat on the record was such a sum.',
  'A figure is compared to another figure only when both state their scope. Today none of them can be.',
  'Siting stays on readiness: beds already there, the organisation has asked, somebody local wants to run it, people there have cleared quotes. Demand size sites nothing.',
  'An order figure needs a rule and a name before it enters a funding application. None on record today has either, because the record is empty.',
  'A need figure that nobody counted is an impression, and it is written as one.',
];

export const HOW_MANY_RULES = RULES.length;

export const WHAT_TO_DO_NEXT =
  'One thing, and it is not a spreadsheet. Run the household count on Palm Island, where there are already 131 beds, seven cleared voices and three organisations that have asked for a facility. A local person, paid, four questions a house. That count is the first demand figure Goods will ever print.';
