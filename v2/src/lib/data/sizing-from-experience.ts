/**
 * How many beds a community is likely to take, from what has happened in the ones we know.
 *
 * Ben, 11 September 2026: we need a way to acknowledge the need for beds, based on the
 * conversations we have had, the experience we have had in other communities, and the number of
 * people in the community.
 *
 * Two earlier attempts to size demand failed and both are worth remembering. Deriving beds from
 * ABS overcrowding fails because CNOS counts bedrooms and we supply beds
 * (`place-denominator.ts`). Finding a rate under the recorded asks fails because each ask is
 * scoped to a different population (`bed-need-and-order.ts`).
 *
 * This works because it uses a different input. Not what anyone estimated, but what communities
 * actually took once beds were available, measured against how many people live there.
 *
 * ---------------------------------------------------------------------------
 * THE OBSERVATION
 * ---------------------------------------------------------------------------
 * Two town-sized communities, worked properly and independently, landed in almost exactly the
 * same place:
 *
 *   Palm Island     2,097 people   131 beds   one bed per 16.0 people
 *   Tennant Creek   2,549 people   160 beds   one bed per 15.9 people
 *
 * Neither of them stopped there. Palm Island has asked for 40 more and Tennant Creek for 23, so
 * one per 16 is where we got to with the money available, not where the community stopped wanting.
 *
 * Add what each has asked for next and the three town-sized communities land between one bed per
 * 12 and one per 21, a spread of 1.7. That is a planning range, and it is the tightest honest
 * relationship between population and beds that this record supports.
 *
 * Utopia is held out. At one bed per three people it is four times denser than anywhere else,
 * because it is a dispersed homelands population rather than a town and because we went deep
 * there. A homelands community is a different shape of job and is sized on its own.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IS NOT
 * ---------------------------------------------------------------------------
 * It is not a measure of need. It is a record of what communities took when beds were on offer,
 * bounded by what we could afford to make. Every one of them has since asked for more, so the
 * range is a floor and not a ceiling. Say that whenever the number is used.
 */

export const READ_AT = '2026-09-11';

export const WHY =
  'Ben, 11 September 2026: a way to acknowledge the need for beds, from the conversations we have had, the experience in other communities, and the number of people in the community.';

// ---------------------------------------------------------------------------
// The comparators
// ---------------------------------------------------------------------------

export type Shape = 'town' | 'homelands';

export interface Comparator {
  readonly place: string;
  /** ABS Census 2021 via community-need.ts, occupied dwellings times persons per dwelling. */
  readonly people: number;
  /** Beds recorded as deployed, from the asset register. */
  readonly delivered: number;
  /** Beds that community has since asked for, on the record. */
  readonly askedNext: number;
  readonly shape: Shape;
  readonly note: string;
}

export const COMPARATORS: readonly Comparator[] = [
  {
    place: 'Palm Island',
    people: 2_097,
    delivered: 131,
    askedNext: 40,
    shape: 'town',
    note: 'All Basket Beds. Three organisations have since asked for a plant, and a further 40 beds sit on the record with no rule behind them.',
  },
  {
    place: 'Tennant Creek',
    people: 2_549,
    delivered: 160,
    askedNext: 23,
    shape: 'town',
    note: 'The longest relationship we have. Dianne Stokes offered to self-fund 20 more and Norman Frank asked for 3 in maroon.',
  },
  {
    place: 'Maningrida',
    people: 2_518,
    delivered: 58,
    askedNext: 65,
    shape: 'town',
    note: 'The least far along of the three, and the only one where two separate organisations have paid us. Delivered plus asked is still under what the other two have already taken.',
  },
  {
    place: 'Utopia',
    people: 444,
    delivered: 147,
    askedNext: 150,
    shape: 'homelands',
    note: 'Dispersed homelands rather than a town, and the place we have gone deepest. Four times denser than anywhere else, so it sizes nothing but itself.',
  },
];

export const TOWNS = COMPARATORS.filter((c) => c.shape === 'town');
export const HOMELANDS = COMPARATORS.filter((c) => c.shape === 'homelands');

export function peoplePerBedDelivered(c: Comparator): number {
  return c.people / c.delivered;
}
export function peoplePerBedWithAsk(c: Comparator): number {
  return c.people / (c.delivered + c.askedNext);
}

/** Where the two furthest-along towns each landed, independently. */
export const WORKED_THROUGH_RATE_LOW = 15.9;
export const WORKED_THROUGH_RATE_HIGH = 16.0;

export const THE_COINCIDENCE =
  'Palm Island reached one bed per 16.0 people and Tennant Creek one per 15.9, with no coordination between them and different products. That is the closest thing to a repeatable number this record holds.';

/** Delivered plus asked, across the three towns. The planning range. */
export const PLANNING_LOW = Math.min(...TOWNS.map(peoplePerBedWithAsk));
export const PLANNING_HIGH = Math.max(...TOWNS.map(peoplePerBedWithAsk));

// ---------------------------------------------------------------------------
// Using it
// ---------------------------------------------------------------------------

export interface Sizing {
  readonly people: number;
  /** Beds at the tightest end of the observed range. */
  readonly high: number;
  /** Beds at the widest end. */
  readonly low: number;
  /** What the two furthest-along towns each reached. */
  readonly workedThrough: number;
  readonly basis: string;
}

/**
 * A planning range for a town-sized community. Never a need figure, and never for a homelands
 * population, which sizes on its own.
 */
export function sizeTown(people: number): Sizing {
  return {
    people,
    high: Math.round(people / PLANNING_LOW),
    low: Math.round(people / PLANNING_HIGH),
    workedThrough: Math.round(people / WORKED_THROUGH_RATE_HIGH),
    basis:
      'From what Palm Island, Tennant Creek and Maningrida have taken and asked for next, against Census population. It is a floor: all three have asked for more.',
  };
}

export const NOBODY_HAS_SAID_ENOUGH =
  'Beds have gone to eleven communities. Not one has come back and told us they have enough. That is the plainest thing we can say about need and it needs no model behind it.';

export const THE_CEILING =
  'This is a record of what communities took when beds were on offer, bounded by what we could afford to make. It is not a measure of need, it is a floor rather than a ceiling, and one community doing a proper household count would replace it.';

export const HOW_TO_SAY_IT: readonly string[] = [
  'Lead with the two that agree. Palm Island and Tennant Creek independently reached about one bed per 16 people, and both have asked for more since.',
  'Give a range, never a point. One bed per 12 to one per 21 people, from three communities.',
  'Say what bounded it. Every number here is limited by what we could afford to make, so it describes our funding as much as their need.',
  'Hold homelands separate. Utopia sits at one bed per three people and sizes nothing but itself.',
  'Close with the count. Eleven communities have beds and none has said it has enough, and one household count would turn all of this into a measurement.',
];
