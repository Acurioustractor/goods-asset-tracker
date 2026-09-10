/**
 * PLACE FEEDSTOCK — who holds the plastic in a place, and how much a plant there would need.
 *
 * The demand side of a place has the housing body that runs procurement, recorded in
 * `expansion-targets.ts`. This is its mirror: who holds the waste stream. A plant needs both, and
 * a plant sited on demand alone runs out of material.
 *
 * ---------------------------------------------------------------------------
 * THE NUMBER THAT SWINGS BY 80%, AND WHY IT DECIDES WHERE A PLANT CAN GO
 * ---------------------------------------------------------------------------
 * A bed keeps 20 kg of HDPE and 36 kg goes through the press. The difference, 16 kg of melt-edge
 * and router offcut, is assumed to return to the shredder, which is why the model uses 20 kg of
 * NEW shred per bed. `Capacity` records that as "Loop balance assumption. Not material lost", and
 * records the shredder's throughput as still to measure.
 *
 * So the requirement depends on an assumption nobody has weighed:
 *
 *   200 beds with the loop running        4,000 kg
 *   200 beds with no loop                 7,200 kg
 *
 * An 80% swing. At the low figure a community stream might feed a plant; at the high one it might
 * not, and that decides siting. `plantFeedstockNeed` therefore returns both numbers and has no
 * mode that returns one, so no caller can quote the convenient figure alone.
 *
 * ---------------------------------------------------------------------------
 * SUPPLY IS RECORDED, NEVER ESTIMATED
 * ---------------------------------------------------------------------------
 * Same discipline as `place-denominator.ts`. A stated volume needs a unit, a basis and a source.
 * Where a stream is named but its volume is not convertible, the volume stays null and the reason
 * is written down. VTG Waste is the live example: six bales of milk-bottle HDPE a week is a real
 * offer from a named business, and a bale has no weight recorded anywhere, so it converts to
 * nothing. Six bales is not a number until somebody weighs one.
 */

/** kg of HDPE in a finished bed. Design mass. */
export const KG_IN_BED = 20;
/** kg of shred through the press for one bed: a 21 kg leg sheet and a 15 kg tab sheet. */
export const KG_PRESSED_PER_BED = 36;

export type StreamStage =
  /** A business or body holds the stream and has stated terms. */
  | 'offered'
  /** A conversation is happening, with no volume agreed. */
  | 'in-conversation'
  /** Bought from a commercial supplier, not a community stream. */
  | 'purchased'
  /** Nobody is recorded as holding the stream here. */
  | 'unknown';

export interface FeedstockHolder {
  communityId: string;
  /** Who holds it. Null only when the stage is unknown. */
  holder: string | null;
  stage: StreamStage;
  /** Stated volume, in kg per year, when it converts. Null when it does not, with the reason. */
  kgPerYear: number | null;
  /** The volume as it was actually stated, in the units it was stated in. */
  statedAs?: string;
  /** Why `kgPerYear` is null despite a stated volume. */
  notConvertible?: string;
  /** What has to happen to the material before it can be pressed. */
  condition?: string;
  source: string;
}

export const PLACE_FEEDSTOCK: readonly FeedstockHolder[] = [
  {
    communityId: 'darwin',
    holder: 'VTG Waste, Darwin',
    stage: 'offered',
    kgPerYear: null,
    statedAs: 'Six bales of milk-bottle HDPE and three of coloured a week',
    notConvertible:
      'No bale weight is recorded anywhere, so bales convert to no mass. Weigh one bale and this ' +
      'becomes the largest named stream on the list.',
    condition: 'Bales need cleaning, with caps and stickers off.',
    source: 'DEFY-ORDERS-2026-09-09.md, recorded as a supply line for Alice Springs',
  },
  {
    communityId: 'alice-springs',
    holder: null,
    stage: 'in-conversation',
    kgPerYear: null,
    notConvertible: 'Recycling centres are being engaged. No volume and no named holder recorded.',
    source: 'Ben, 10 September 2026',
  },
  {
    communityId: 'tennant-creek',
    holder: 'The Community Shed',
    stage: 'in-conversation',
    kgPerYear: null,
    notConvertible: 'Recorded as leaning into plastic recycling. No volume discussed.',
    source: 'Community record, Ben, 21 July 2026',
  },
  {
    communityId: 'utopia',
    holder: null,
    stage: 'in-conversation',
    kgPerYear: null,
    notConvertible:
      'Utopia has asked for the shredder to engage young people. That is an interest in ' +
      'processing rather than a stated stream.',
    source: 'Community record, Ben, 21 July 2026',
  },
  {
    communityId: 'witta',
    holder: 'Defy Design, Sydney',
    stage: 'purchased',
    kgPerYear: null,
    statedAs: '600 kg bulka bags at $1.80/kg, ordered as needed',
    notConvertible:
      'Bought to demand rather than supplied at a rate, so there is no annual volume. This is a ' +
      'commercial purchase and not a community stream.',
    source: 'DEFY-ORDERS-2026-09-09.md, invoices INV-1731, INV-1940',
  },
  {
    communityId: 'maningrida',
    holder: null,
    stage: 'unknown',
    kgPerYear: null,
    notConvertible: 'Nobody is recorded as holding a plastic stream at Maningrida.',
    source: '—',
  },
  {
    communityId: 'palm-island',
    holder: null,
    stage: 'unknown',
    kgPerYear: null,
    notConvertible: 'Nobody is recorded as holding a plastic stream at Palm Island.',
    source: '—',
  },
];

export interface FeedstockNeed {
  beds: number;
  /** New shred needed if the offcut loop runs as assumed. */
  withLoopKg: number;
  /** New shred needed if every bed takes fresh material. */
  withoutLoopKg: number;
  /** Always stated, because the gap between the two is an unmeasured assumption. */
  caveat: string;
}

/**
 * What a plant needs, both ways. There is deliberately no single-figure version: the loop has
 * never been measured and the shredder's throughput is unknown, so quoting one number hides the
 * assumption that decides whether a place can feed its own plant.
 */
export function plantFeedstockNeed(beds: number): FeedstockNeed {
  return {
    beds,
    withLoopKg: beds * KG_IN_BED,
    withoutLoopKg: beds * KG_PRESSED_PER_BED,
    caveat:
      'The lower figure assumes 16 kg of offcut per bed returns through the shredder. That loop ' +
      'is an assumption and the shredder throughput has never been measured.',
  };
}

export function feedstockFor(communityId: string): FeedstockHolder | undefined {
  return PLACE_FEEDSTOCK.find((f) => f.communityId === communityId);
}

/** Places where a stream is named but its volume converts to nothing. Each one is a measurement. */
export function needsAMeasurement(): FeedstockHolder[] {
  return PLACE_FEEDSTOCK.filter((f) => f.holder !== null && f.kgPerYear === null);
}

/**
 * Places with a proposed plant and no recorded holder. A plant sited here is sited on demand
 * alone.
 */
export function noStreamRecorded(): FeedstockHolder[] {
  return PLACE_FEEDSTOCK.filter((f) => f.stage === 'unknown');
}
