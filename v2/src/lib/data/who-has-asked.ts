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
 * evidence rather than impression.
 *
 * The bed numbers stay, attached to the act that produced them, and are never totalled across
 * acts. A total across rungs is the 778, and the 778 is not a quantity of anything.
 */

export const READ_AT = '2026-09-11';

export const THE_POSITION =
  'We do not have a demand measure and we do not claim one. Four organisations have paid us for 320 beds. Five communities have asked for more, and we can name who asked in every case. The bed numbers attached to those asks are impressions of populations nobody has counted, and we print them as impressions.';

export const WHY_NOT_A_NUMBER =
  'A demand total would have to add a figure scoped to one Elder\'s wallet to a figure scoped to the children of an outstation to a figure nobody wrote a scope for at all. Adding them produces 778, which is not a quantity of anything and cannot be defended by anybody who is asked a second question about it.';

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
    strength: 'Real, and silent on quantity. A council asking is evidence about the relationship, not about how many beds.',
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
  {
    who: 'Dianne Stokes',
    capacity: 'Warumungu Elder',
    place: 'Tennant Creek',
    rung: 'money-named',
    beds: 20,
    scope: 'What she offered to fund herself.',
    act: 'Offered to self-fund twenty beds. She also named the Pakkimjalki Kari washing machines in Warumungu, so this is a long relationship.',
    when: '2026-09',
  },
  {
    who: 'Utopia Homelands',
    capacity: 'Homelands organisation',
    place: 'Utopia',
    rung: 'organisation-asked',
    beds: 150,
    scope: 'Children across the homelands. The child population has never been stated.',
    act: 'Asked, with a rule: beds for every child. Nobody is recorded as having said it.',
    when: '2026',
  },
  {
    who: 'Homeland Schools Co.',
    capacity: 'Schools operator',
    place: 'Maningrida homelands',
    rung: 'organisation-asked',
    beds: 65,
    scope: 'Children in the homelands, which are outstations and a fraction of the Maningrida area.',
    act: 'Asked in a meeting, with a rule: beds for kids in the homelands. The same organisation has since paid for forty.',
    when: '2026',
  },
  {
    who: 'Palm Island Community Company',
    capacity: 'Community-controlled service company',
    place: 'Palm Island',
    rung: 'organisation-asked',
    beds: 40,
    scope: null,
    act: 'A figure arrived in a partner update. No rule, no scope and no name behind it.',
    when: '2026',
  },
  {
    who: 'Norman Frank',
    capacity: 'Community member',
    place: 'Tennant Creek',
    rung: 'person-asked',
    beds: 3,
    scope: 'Three beds for himself.',
    act: 'Asked for three beds in the maroon colourway.',
    when: '2026',
  },
  {
    who: 'Simone Grimmond, WHSAC',
    capacity: 'Procurement pathway',
    place: 'Groote Archipelago',
    rung: 'raised',
    beds: 500,
    scope: null,
    act: 'Came up in one meeting, alongside 300 washing machines. Logged as exploring. Nothing quoted, no order discussed.',
    when: '2026',
  },
];

export function onRung(r: Rung): readonly Ask[] {
  return ASKS.filter((a) => a.rung === r);
}

/** The only total this file produces, because it is the only rung that is evidence. */
export const BEDS_PAID_FOR = onRung('paid').reduce((n, a) => n + a.beds, 0);
export const PAID_ORGANISATIONS = new Set(onRung('paid').map((a) => a.who)).size;

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
  'Name the organisation, not the number. "Palm Island Community Company asked" is evidence. "Palm Island needs 40 beds" is an impression wearing a number.',
  'When a number is used, it stays attached to the act that produced it and to what it covers. A figure with no scope is printed with its scope missing.',
  'Never state a demand total. If asked for one, say we do not have a demand measure, say why, and offer the household count instead.',
  'Two organisations in Maningrida have bought from us and one of them asked for more. Repeat buyers in one place say more about demand than any count.',
  'The largest number on the record came up once in a meeting and is the weakest thing we hold. Print its status beside it or leave it out.',
];

export const WHEN_A_FUNDER_ASKS =
  'A funder asking about demand is asking whether anyone will take these beds. The answer is that four organisations have already paid for 320, including a research centre that paid for a hundred up front before one was made, and a schools operator in Maningrida that bought the first full run off our own press. Five more communities have asked and we can name who asked in each. What we cannot give them is a number for how many beds Australia needs, and we say so.';

export const WHAT_WOULD_CHANGE_IT =
  'One community counting properly. Four questions per household, done by a local person who is paid for it: how many sleep here, how many have a bed, how many are on the floor, who would use a new bed first. Until then every need figure we hold is an impression, including the good ones.';
