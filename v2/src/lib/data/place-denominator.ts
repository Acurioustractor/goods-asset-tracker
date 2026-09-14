/**
 * PLACE DENOMINATOR — how many beds a community needs, and whose rule says so.
 *
 * This module exists to make one thing unbuildable: a bed number derived from ABS overcrowding.
 *
 * ---------------------------------------------------------------------------
 * WHY THE DERIVATION IS WRONG, WITH THE LINE THAT PROVES IT
 * ---------------------------------------------------------------------------
 * `community-need.ts` carries ABS Census 2021 overcrowding by ILOC, and it is the obvious
 * candidate for a denominator. It cannot be one.
 *
 * Utopia has **34 dwellings** requiring one or more extra bedrooms. Goods has delivered
 * **147 beds** there. Any multiplier from overcrowding to beds would report Utopia as four times
 * over-supplied, which is false.
 *
 * The reason is that the two measures are about different objects. CNOS counts BEDROOMS. Goods
 * supplies BEDS. A three-bedroom house with no furniture in it is not overcrowded by that
 * standard and is exactly the household Goods serves. Margaret Lloyd, Utopia homelands: "I sleep
 * in the tent but look, there's my house or the rubbish house. No mattress." The house is not the
 * problem.
 *
 * The recorded asks confirm there is no hidden rate to recover. Per head of population they run
 * from one bed per three people at Utopia to one per 111 at Tennant Creek, a factor of
 * thirty-five. Those are not four estimates of one quantity. They are four conversations.
 *
 * ---------------------------------------------------------------------------
 * SO THE DENOMINATOR IS SET, NOT DERIVED
 * ---------------------------------------------------------------------------
 * A bed number is defensible when a person in that community set it and their rule can be stated.
 * Utopia's 150 has a rule behind it, "beds for every child", and the rule is theirs. When a funder
 * asks where a number came from, the answer is a person, not a spreadsheet.
 *
 * The type enforces it. A `Denominator` is either SET, carrying beds AND a rule AND who set it,
 * or UNSET, carrying the reason nobody has one. There is no third shape and no partial row, so a
 * bed number cannot exist in this module without an attributable rule beside it.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS MEANS FOR TOTALS
 * ---------------------------------------------------------------------------
 * There is no total addressable need across the communities on the record, and there must not be
 * one. Most places have no number, and inventing one is the move this file rules out. What can be
 * summed is what communities have actually asked for. `askedTotal()` sums SET rows only and
 * counts nothing else.
 */

import { COMMUNITY_NEED } from './community-need';

/** Four measures of one place. They sit beside each other and are never multiplied together. */
export interface SettingSize {
  communityId: string;
  /** Dwellings × persons per dwelling, from the ABS extract. Approximate, and it is a population. */
  peopleApprox: number | null;
  /** Dwellings needing one or more extra bedrooms. A bedroom count, not a bed count. */
  dwellingsNeedingBedrooms: number | null;
  /** What the community asked for, when a SET denominator exists. */
  askedBeds: number | null;
  /** What has actually been delivered and recorded. */
  deliveredBeds: number | null;
}

export interface DenominatorSet {
  kind: 'set';
  communityId: string;
  beds: number;
  /** The rule in the words it was given in. Not a paraphrase and not a formula. */
  rule: string;
  /** Who set it. A number without a name is a number nobody in that community owns. */
  setBy: string;
  /** Where the attribution comes from, so it can be chased. */
  source: string;
  /** ISO date or month, when known. */
  setOn?: string;
}

export interface DenominatorUnset {
  kind: 'unset';
  communityId: string;
  /** Why there is no number. Absence stays absence. */
  reason: string;
  /** A figure sitting in a demand record with no rule or person behind it, when one exists. */
  unattributedFigure?: number;
}

export type Denominator = DenominatorSet | DenominatorUnset;

/**
 * Recorded denominators. A row moves from unset to set when somebody brings back a rule and a
 * name, never when a number alone turns up.
 *
 * As at 15 September 2026 no row is SET: Ben withdrew every recorded figure as unfounded.
 */
export const PLACE_DENOMINATORS: readonly Denominator[] = [
  {
    kind: 'unset',
    communityId: 'tennant-creek',
    reason: 'The twenty beds once recorded here were withdrawn by Ben on 15 September 2026 as unfounded. No figure is held until a local person counts.',
  },
  {
    kind: 'unset',
    communityId: 'utopia',
    reason: 'The 150 once recorded here was withdrawn by Ben on 15 September 2026 as unfounded. No figure is held until a local person counts.',
  },
  {
    kind: 'unset',
    communityId: 'maningrida',
    reason: 'The 65 once recorded here was withdrawn by Ben on 15 September 2026 as unfounded. No figure is held until a local person counts.',
  },
  {
    kind: 'unset',
    communityId: 'palm-island',
    reason: 'The 40 once recorded here was withdrawn by Ben on 15 September 2026 as unfounded. No figure is held until a local person counts.',
  },
  {
    kind: 'unset',
    communityId: 'groote-archipelago',
    reason: 'The 500 once recorded here was withdrawn by Ben on 15 September 2026 as unfounded. No figure is held until a local person counts.',
  },
];

export const DENOMINATORS_WITHDRAWN =
  'Ben, 15 September 2026: every recorded bed figure was withdrawn as unfounded. No row is SET and no row carries an unattributed figure. The next SET row comes from a household count done by a paid local person.';

export function denominatorFor(communityId: string): Denominator | undefined {
  return PLACE_DENOMINATORS.find((d) => d.communityId === communityId);
}

/**
 * The only total this module will produce: beds communities have actually asked for, through a
 * rule somebody set. Unattributed figures are excluded by design, however real they look.
 */
export function askedTotal(): { beds: number; places: number } {
  const set = PLACE_DENOMINATORS.filter((d): d is DenominatorSet => d.kind === 'set');
  return { beds: set.reduce((a, d) => a + d.beds, 0), places: set.length };
}

/**
 * Places carrying a figure nobody owns. This is the work list: each one is a conversation, and
 * each conversation turns a number into a denominator.
 */
export function needsARule(): DenominatorUnset[] {
  return PLACE_DENOMINATORS.filter(
    (d): d is DenominatorUnset => d.kind === 'unset' && d.unattributedFigure !== undefined,
  );
}

/**
 * The four measures side by side. Deliberately takes delivered and asked counts as arguments
 * rather than reaching for them, so this file cannot become the place where they get combined.
 */
export function settingSize(
  communityId: string,
  deliveredBeds: number | null,
): SettingSize {
  const need = COMMUNITY_NEED.find((n) => n.communityId === communityId);
  const den = denominatorFor(communityId);
  return {
    communityId,
    peopleApprox: need ? Math.round(need.occupiedDwellings * need.personsPerDwelling) : null,
    dwellingsNeedingBedrooms: need ? need.need1plus : null,
    askedBeds: den?.kind === 'set' ? den.beds : null,
    deliveredBeds,
  };
}
