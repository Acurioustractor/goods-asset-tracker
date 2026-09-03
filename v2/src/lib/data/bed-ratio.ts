/**
 * THE UNIT: one bed, four things, any amount.
 *
 * Ben, 2 Sep 2026 (evening): the ask does not have to be $750,000. Make the unit one bed, show
 * what one bed does, and let any grant scale in a straight line: $150,000, $250,000, $400,000,
 * $750,000 all read the same way. This module is that ratio, with every input read from the
 * modules that already hold it, so the deck's slide 10C and the strategy note never type a
 * figure the guards cannot check.
 *
 * What one bed does, and the label each carries:
 *  - a bed off the ground, washable and repairable (verified product);
 *  - 20kg of recycled HDPE, so fifty beds is one tonne (workpaper, ruling T; measured per batch
 *    once the traceability schema runs);
 *  - about 6.5 hours of local work when made locally (modelled in impact-model.ts, not yet
 *    time-studied; 3.5 of those hours are CNC and the measured run decides);
 *  - about $130 of fair-wage labour in the community cost state (modelled, cost-model v6);
 *  - up to $750 that stays local if the community sells the bed (target; only sold beds create
 *    sales money, and none of it is income until the rules are agreed).
 *
 * Ratios scale in a straight line; real sites do not. The straight line is the funder's way in,
 * not a forecast.
 */
import { canonValue } from './canon';
import { CANONICAL_ASSETS } from './asset-canonical';
import { MODELLED_LABOUR_HOURS_PER_BED } from './impact-model';
import scenarios from './cost-model-scenarios.json';
import type { Solidity } from './cost-story';

// ---------------------------------------------------------------------------
// Inputs, read not typed

export const BED_PRICE_AUD = Number(canonValue('stretch-price'));

/** Canon derives plastic-kg as Stretch beds deployed times 20kg; this reads the ratio back out. */
export const HDPE_KG_PER_BED = CANONICAL_ASSETS.plasticKg / CANONICAL_ASSETS.stretchBedsDeployed;
export const BEDS_PER_TONNE = 1000 / HDPE_KG_PER_BED;

/** Modelled labour hours per bed across the seven production stages. Not yet time-studied. */
export const LOCAL_HOURS_PER_BED = MODELLED_LABOUR_HOURS_PER_BED;

/** Deep search so the value comes from the cost model, wherever the key sits. */
function findNumber(value: unknown, key: string): number | undefined {
  if (!value || typeof value !== 'object') return undefined;
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (k === key && typeof v === 'number') return v;
    const found = findNumber(v, key);
    if (found !== undefined) return found;
  }
  return undefined;
}

/** Fair-wage community labour per bed in the community cost state (band $100 to $160). */
export const FAIR_WAGE_PER_BED_AUD = findNumber(scenarios, 'community_labour_per_bed') ?? Number.NaN;

export const POOL_BEDS = 200;

// ---------------------------------------------------------------------------
// One bed, four things

export interface BedUnitLine {
  title: string;
  body: string;
  label: Solidity;
}

export const BED_UNIT: readonly BedUnitLine[] = [
  {
    title: 'A bed off the ground',
    body: 'Washable, repairable, about five minutes to assemble. Verified product.',
    label: 'verified',
  },
  {
    title: '20kg of recycled plastic',
    body: 'Fifty beds is one tonne of HDPE kept in use. Workpaper; weighed batch by batch in the measured run.',
    label: 'workpaper',
  },
  {
    title: 'About 6.5 hours of local work',
    body: 'Collect, shred, press, cut, assemble, deliver. Modelled, not yet timed; 3.5 of those hours are CNC and the stopwatch decides.',
    label: 'modelled',
  },
  {
    title: 'Up to $750 that stays local',
    body: "If the community sells the bed at $750. Given beds meet need instead. The mix is the community's call.",
    label: 'target',
  },
];

// ---------------------------------------------------------------------------
// Any amount, the same ratio

export interface ScaleRow {
  amountAud: number;
  beds: number;
  pools: number;
  hdpeTonnes: number;
  localHours: number;
  fairWageAud: number;
  /** Gross sales if every bed is sold at the price. Never income. */
  staysLocalIfAllSoldAud: number;
}

export function scale(amountAud: number): ScaleRow {
  if (amountAud < 0) throw new Error('amount must be positive');
  const beds = Math.floor(amountAud / BED_PRICE_AUD);
  return {
    amountAud,
    beds,
    pools: beds / POOL_BEDS,
    hdpeTonnes: (beds * HDPE_KG_PER_BED) / 1000,
    localHours: beds * LOCAL_HOURS_PER_BED,
    fairWageAud: beds * FAIR_WAGE_PER_BED_AUD,
    staysLocalIfAllSoldAud: beds * BED_PRICE_AUD,
  };
}

/** The four amounts the deck shows. The ask sits at $250,000; $400,000 is the ceiling. */
export const SCALE_AMOUNTS = [150_000, 250_000, 400_000, 750_000] as const;
export const SCALE_ROWS: readonly ScaleRow[] = SCALE_AMOUNTS.map(scale);

export const RATIO_NOTE =
  'Beds at $750 each. Plastic at 20kg a bed. Local work at about 6.5 modelled hours a bed when made locally, about $130 of fair-wage labour a bed in the community cost state. Money that stays local is gross sales at $750 and only for beds the community chooses to sell. None of it is community income until the rules are agreed.';

/** What QBE's beds going first start. */
export const UNLOCK = {
  title: 'What going first does',
  body: "QBE's beds go in first, into the first community. That community sells what it decides to sell and keeps the money. The first fifty go through our own press and get costed, so the lenders have a measured number. Every other funder's beds follow at the same ratio.",
} as const;

export const RATIO_GUARDRAIL =
  'Working proposal. Ratios are per bed and scale in a straight line; real sites do not. The measured run replaces the modelled hours and the design plastic figure with measured ones.';
