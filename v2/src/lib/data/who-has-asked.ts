/**
 * We do not have a demand number. We have a list of who has asked, and a separate list of who has
 * paid.
 *
 * Ben, 11 September 2026: the figures are semantic, there is no real way to know, so the question
 * is how to talk about demand and who has asked. He is right, and the consequence is larger than a
 * wording change.
 *
 * Every bed figure on the record is somebody's impression of a population nobody has counted. Two
 * attempts to find a rate underneath them both failed, and the second failure is instructive: per
 * dwelling needing an extra bedroom, three of four figures look like they agree, and they only
 * agree because one of them is being divided by a population it was never about. See
 * `bed-need-and-order.ts`.
 *
 * So stop presenting a quantity. Present the acts.
 *
 * An act is a thing a person or an organisation DID, which either happened or did not. Money
 * moved. A council wrote. An Elder said she would pay. Those are checkable by anyone, they do not
 * degrade when a funder pushes on them, and they are the only part of our demand record that is
 * evidence, where everything else is impression.
 *
 * Bed numbers below the paid rung are never printed: the ones once held here were withdrawn by Ben
 * on 15 September 2026 as unfounded. A total across rungs was the 778, which is not a quantity of anything.
 */

export const READ_AT = '2026-09-11';

export const THE_POSITION =
  'We do not have a demand measure and we do not claim one. Four organisations have paid us for 320 beds, and that paid trade is the only demand record we hold. Every other bed figure anyone has given us was an impression of a population nobody has counted, and on 15 September 2026 Ben withdrew them all.';

export const ASKS_WITHDRAWN =
  'Ben, 15 September 2026: the recorded bed-demand figures (Utopia 150, Maningrida 65, Palm Island 40, Tennant Creek 20 and 3, Groote 500) were withdrawn as unfounded. None is printed anywhere. The paid trade is the only demand record we hold.';

export const WHY_NOT_A_NUMBER =
  'A demand total would have to add figures scoped to different populations that nobody counted. The 778 that once sat on the record was such a sum; it is not a quantity of anything and it was never totalled on purpose. The figures under it were withdrawn on 15 September 2026.';

// ---------------------------------------------------------------------------
// The ladder. Each rung is an act, and each act has a test anyone can apply.
// ---------------------------------------------------------------------------

export type Rung = 'paid' | 'money-named' | 'organisation-asked' | 'person-asked' | 'raised';

export interface RungDef {
  readonly rung: Rung;
  readonly label: string;
  /** The question that settles whether something belongs on this rung. One question, one answer. */
  readonly test: string;
  readonly strength: string;
}

export const LADDER: readonly RungDef[] = [
  {
    rung: 'paid',
    label: 'Money has moved',
    test: 'Is there a settled invoice?',
    strength: 'The only rung that cannot be argued with. It is also the only one that proves the price.',
  },
  {
    rung: 'money-named',
    label: 'They said how they would pay',
    test: 'Did they name a source of money, without an invoice yet?',
    strength: 'One step from trade. The person has thought about the cost, which most askers have not.',
  },
  {
    rung: 'organisation-asked',
    label: 'A body with authority asked',
    test: 'Did an organisation that can decide for that place ask us, and can we name it?',
    strength: 'Real, and silent on quantity. A council asking is evidence about the relationship. It says nothing about how many beds.',
  },
  {
    rung: 'person-asked',
    label: 'A named person asked for themselves',
    test: 'Did an individual ask for a specific thing we could deliver tomorrow?',
    strength: 'Small and unusually solid. Somebody who has chosen a colour is further along than an enquiry about five hundred.',
  },
  {
    rung: 'raised',
    label: 'It came up in a meeting',
    test: 'Was it mentioned, with nothing following it?',
    strength: 'Weakest, and usually the largest number. Print the status beside it every time or do not print it.',
  },
];

export function rungRank(r: Rung): number {
  return LADDER.findIndex((x) => x.rung === r);
}

// ---------------------------------------------------------------------------
// The record, as acts
// ---------------------------------------------------------------------------

export interface Ask {
  readonly who: string;
  readonly capacity: string;
  readonly place: string;
  readonly rung: Rung;
  readonly beds: number;
  /** What the number covers, in their terms. Null when nobody recorded it. */
  readonly scope: string | null;
  readonly act: string;
  readonly when: string;
}

export const ASKS: readonly Ask[] = [
  {
    who: 'Centrecorp Foundation',
    capacity: 'Aboriginal charitable trust, Central Australia',
    place: 'Utopia Homelands',
    rung: 'paid',
    beds: 167,
    scope: 'Two invoices, 60 Basket and 107 Stretch.',
    act: 'Settled INV-0259 and INV-0291. 147 deployed, 20 made and waiting.',
    when: '2025-08 and 2025-11',
  },
  {
    who: 'ALIVE National Centre, University of Melbourne',
    capacity: 'Research centre with its own programme budget',
    place: 'Communities under Gathering the Parts',
    rung: 'paid',
    beds: 100,
    scope: 'A hundred beds plus four shared visits.',
    act: 'Paid $92,000 net up front on INV-0342, before a single bed was made.',
    when: '2026-07',
  },
  {
    who: 'Homeland School Company',
    capacity: 'Schools operator across the Maningrida homelands',
    place: 'Maningrida homelands',
    rung: 'paid',
    beds: 40,
    scope: 'The forty pressed at our own facility.',
    act: 'Bought the first full run off our press, assembled at Gamardi by local workers.',
    when: '2026-05',
  },
  {
    who: "Mala'la Health Service Aboriginal Corporation",
    capacity: 'Community-controlled health service',
    place: 'Maningrida',
    rung: 'paid',
    beds: 13,
    scope: 'Thirteen beds.',
    act: 'Settled INV-0283. The second Maningrida organisation to buy from us.',
    when: '2025-11',
  },
];

export function onRung(r: Rung): readonly Ask[] {
  return ASKS.filter((a) => a.rung === r);
}

/** The only total this file produces, because it is the only rung that is evidence. */
export const BEDS_PAID_FOR = onRung('paid').reduce((n, a) => n + a.beds, 0);
export const PAID_ORGANISATIONS = new Set(onRung('paid').map((a) => a.who)).size;

/** Zero since 15 September 2026. The asks were withdrawn; only the paid rung holds records. */
export const ORGANISATIONS_THAT_HAVE_ASKED = new Set(
  ASKS.filter((a) => a.rung !== 'paid').map((a) => a.who),
).size;

export const PLACES_THAT_HAVE_ASKED = new Set(ASKS.map((a) => a.place)).size;

export const ASKS_WITH_NO_SCOPE = ASKS.filter((a) => a.scope === null);

export const NO_TOTAL_ACROSS_RUNGS =
  'There is no function here that adds beds across rungs, on purpose. A figure an Elder offered to fund and a figure raised once in a meeting are not two measurements of one thing.';

// ---------------------------------------------------------------------------
// How to say it
// ---------------------------------------------------------------------------

export const HOW_TO_TALK: readonly string[] = [
  'Lead with what was paid. Four organisations, 320 beds, $273,966 settled. It is the only rung nobody can push back on, and it proves the price at the same time.',
  'Name the organisation and let the act follow it. A settled invoice is evidence. A bed count somebody once mentioned is an impression wearing a number, and we no longer print one.',
  'When a number is used, it stays attached to the act that produced it and to what it covers. A figure with no scope is printed with its scope missing.',
  'Never state a demand total. If asked for one, say we do not have a demand measure, say why, and offer the household count instead.',
  'Two organisations in Maningrida have bought from us. Repeat buyers in one place say more about demand than any count.',
  'If somebody offers a bed number from a meeting, write down who said it and what it covers, and do not print it until a local person has counted.',
];

export const WHEN_A_FUNDER_ASKS =
  'A funder asking about demand is asking whether anyone will take these beds. The answer is that four organisations have already paid for 320, including a research centre that paid for a hundred up front before one was made, and a schools operator in Maningrida that bought the first full run off our own press. What we cannot give them is a number for how many beds Australia needs, and we say so.';

export const WHAT_WOULD_CHANGE_IT =
  'One community counting properly. Four questions per household, done by a local person who is paid for it: how many sleep here, how many have a bed, how many are on the floor, who would use a new bed first. Until then every need figure we hold is an impression, including the good ones.';
