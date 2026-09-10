/**
 * PLACE FRAMEWORK — the four things a place needs before a plant makes sense, and the one thing
 * to do next.
 *
 * This joins what the other modules already own. It introduces no fact of its own.
 *
 *   setting      `community-need.ts`        ABS overcrowding, which sizes the place
 *   denominator  `place-denominator.ts`     a bed number somebody there set, with their rule
 *   feedstock    `place-feedstock.ts`       who holds the plastic
 *   buyer        `expansion-targets.ts`     the body that runs housing procurement
 *   authority    `place-evidence.ts` rule   an authority artifact, which nowhere has yet
 *
 * ---------------------------------------------------------------------------
 * THERE IS NO SCORE, AND THAT IS THE DESIGN
 * ---------------------------------------------------------------------------
 * `GRANTSCOPE.md` says the output is "a decision read, not a readiness score, pipeline stage or
 * progress bar". Four of five axes green is exactly the number somebody sorts by, and sorting
 * places by it ranks them on how much paperwork we happen to hold, which is a fact about us.
 *
 * So this module returns axes and **one next thing**, never a count and never an order. The next
 * thing comes from the first axis that is not settled, walked in a fixed sequence, and the
 * sequence is a judgement written down rather than a calculation:
 *
 *   1. denominator, because a number nobody there set is not a need
 *   2. feedstock, because a plant with no stream runs out
 *   3. buyer, because somebody has to hold a budget
 *   4. authority, because none of it is ours to decide
 *
 * Setting is context and never a gate. A place with high overcrowding and no conversation is not
 * ahead of a place with a low count and an Elder who has asked.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT SAYS ON THE DAY IT WAS BUILT
 * ---------------------------------------------------------------------------
 * The buyer axis is empty for every community Goods actually serves. All sixteen rows in
 * `expansion-targets.ts` are places Goods does not work in, so the housing body that runs
 * procurement is recorded only for the next places and never for the current ones.
 */

import { COMMUNITY_NEED, COMMUNITY_NEED_GAPS } from './community-need';
import { expansionTargets } from './expansion-targets';
import { denominatorFor } from './place-denominator';
import { feedstockFor } from './place-feedstock';
import type { EvidenceState } from './place-decision';

export type AxisName = 'setting' | 'denominator' | 'feedstock' | 'buyer' | 'authority';

/** The kind of act that would move an axis. This is what the work actually is. */
export type ActionKind = 'a conversation' | 'a measurement' | 'a document';

export interface Axis {
  axis: AxisName;
  state: EvidenceState;
  detail: string;
}

export interface NextThing {
  axis: AxisName;
  kind: ActionKind;
  action: string;
}

export interface PlaceRead {
  communityId: string;
  axes: Axis[];
  /** Null only when every gated axis is settled, which is true nowhere today. */
  nextThing: NextThing | null;
}

/** The order the axes are walked. A judgement, written down, not a calculation. */
const GATED_ORDER: AxisName[] = ['denominator', 'feedstock', 'buyer', 'authority'];

function settingAxis(communityId: string): Axis {
  const need = COMMUNITY_NEED.find((n) => n.communityId === communityId);
  if (need) {
    return {
      axis: 'setting',
      state: 'stale',
      detail:
        `${need.need1plus} of ${need.occupiedDwellings} dwellings need an extra bedroom, ` +
        `about ${Math.round(need.occupiedDwellings * need.personsPerDwelling)} people. ` +
        'ABS Census 2021, and it counts bedrooms rather than beds.',
    };
  }
  const gap = COMMUNITY_NEED_GAPS.find((g) => g.communityId === communityId);
  return {
    axis: 'setting',
    state: 'unavailable',
    detail: gap ? gap.reason : 'Not in the ABS ILOC extract and no honest mapping has been made.',
  };
}

function denominatorAxis(communityId: string): Axis {
  const d = denominatorFor(communityId);
  if (!d) {
    return { axis: 'denominator', state: 'unavailable', detail: 'No bed number and no figure recorded.' };
  }
  if (d.kind === 'set') {
    return {
      axis: 'denominator',
      state: 'verified',
      detail: `${d.beds} beds. ${d.rule} Set by ${d.setBy}.`,
    };
  }
  return {
    axis: 'denominator',
    state: d.unattributedFigure === undefined ? 'unavailable' : 'awaiting-review',
    detail: d.reason,
  };
}

function feedstockAxis(communityId: string): Axis {
  const f = feedstockFor(communityId);
  if (!f) {
    return { axis: 'feedstock', state: 'unavailable', detail: 'Nobody recorded as holding a stream.' };
  }
  const state: EvidenceState =
    f.stage === 'unknown'
      ? 'unavailable'
      : f.kgPerYear !== null
        ? 'verified'
        : f.stage === 'offered'
          ? 'awaiting-review'
          : 'partial';
  const who = f.holder ? `${f.holder}. ` : '';
  return { axis: 'feedstock', state, detail: who + (f.notConvertible ?? f.statedAs ?? '') };
}

function buyerAxis(communityId: string): Axis {
  const t = expansionTargets.find((e) =>
    e.community.toLowerCase().includes(communityId.replace(/-/g, ' ')),
  );
  if (t) {
    return {
      axis: 'buyer',
      state: 'stale',
      detail: `${t.housingBody} runs housing procurement. Population about ${t.pop.toLocaleString()}. Research sweep, March 2026.`,
    };
  }
  return {
    axis: 'buyer',
    state: 'unavailable',
    detail:
      'No body recorded as running housing procurement here. The March 2026 sweep covered places ' +
      'Goods does not yet work in, so served communities have no entry.',
  };
}

function authorityAxis(): Axis {
  return {
    axis: 'authority',
    state: 'unavailable',
    detail: 'No authority artifact is on file. Absence stays absence.',
  };
}

const NEXT: Record<AxisName, { kind: ActionKind; action: (detail: string) => string }> = {
  denominator: {
    kind: 'a conversation',
    action: () => 'Ask who sets the bed number here, and what their rule is.',
  },
  feedstock: {
    kind: 'a measurement',
    action: () => 'Find who holds the plastic here, and get a volume with a unit behind it.',
  },
  buyer: {
    kind: 'a conversation',
    action: () => 'Find the body that runs housing procurement here.',
  },
  authority: {
    kind: 'a document',
    action: () => 'Get an authority artifact: who decides here, in writing.',
  },
  setting: { kind: 'a measurement', action: () => 'Size the setting.' },
};

export function placeRead(communityId: string): PlaceRead {
  const axes: Axis[] = [
    settingAxis(communityId),
    denominatorAxis(communityId),
    feedstockAxis(communityId),
    buyerAxis(communityId),
    authorityAxis(),
  ];
  const byName = new Map(axes.map((a) => [a.axis, a]));
  for (const name of GATED_ORDER) {
    const a = byName.get(name)!;
    if (a.state === 'verified') continue;
    return {
      communityId,
      axes,
      nextThing: { axis: name, kind: NEXT[name].kind, action: NEXT[name].action(a.detail) },
    };
  }
  return { communityId, axes, nextThing: null };
}

/**
 * Every place's next thing, grouped by the kind of act it is. Deliberately grouped rather than
 * ordered: a list of conversations is something a person can work through, a ranking of places is
 * the thing the contract forbids.
 */
export function workByKind(communityIds: readonly string[]): Record<ActionKind, string[]> {
  const out: Record<ActionKind, string[]> = {
    'a conversation': [],
    'a measurement': [],
    'a document': [],
  };
  for (const id of communityIds) {
    const r = placeRead(id);
    if (r.nextThing) out[r.nextThing.kind].push(`${id}: ${r.nextThing.action}`);
  }
  return out;
}
