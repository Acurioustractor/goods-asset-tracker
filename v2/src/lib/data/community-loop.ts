/**
 * ONE COMMUNITY LOOP: the per-pool economics behind the 1,000-bed program, in one place.
 *
 * Nic's version of the model, from the Dusseldorp call on 2 Sep 2026: a community partner
 * receives 200 beds, sells them at $750, keeps the $150,000, and puts it toward a production
 * facility so the next bed carries a local margin. Ben's 2 Sep meeting summary carries the
 * same loop with larger numbers behind it (5,000 beds a year, $1M profit).
 *
 * This module holds the loop with every figure derived from canon and labelled, so the deck
 * drawing (slide 08C) and the strategy note carry one set of numbers and the guards catch the
 * three ways the loop overstates itself:
 *  - gross sales read as community income (they are gross, and only sold beds create them);
 *  - the facility read as affordable from one pool (one pool sold in full reaches the BOTTOM of
 *    the $150,000 to $220,000 band, before the site floor, an operator or working stock);
 *  - the local margin read as measured (about $324 a bed is modelled; the measured run proves it).
 *
 * Sources: canon.ts (price, kit and pressed cost), offers.ts (the facility band), road-ending.ts
 * (the site floor already public on /pitch/road), deliverables/goods-deck-diagram-system-2026-08-26.md.
 */
import { canonValue } from './canon';
import type { Solidity } from './cost-story';
import { OFFERS } from './offers';
import { SITE_OPERATING } from './road-ending';

// ---------------------------------------------------------------------------
// Figures, read not typed

export const BED_PRICE_AUD = Number(canonValue('stretch-price'));
/** Landed cost of a kit-path bed today. Workpaper. */
export const KIT_COST_AUD = Number(canonValue('marginal-buykit'));
/** Cost of a bed with legs pressed locally. Modelled, unmeasured until the run. */
export const PRESSED_COST_AUD = Number(canonValue('marginal-factory'));
/** What stays on a bed under each path. Derived. */
export const STAYS_KIT_AUD = BED_PRICE_AUD - KIT_COST_AUD;
export const STAYS_PRESSED_AUD = BED_PRICE_AUD - PRESSED_COST_AUD;

export const POOL = {
  beds: 200,
  /** The cost of the beds in one pool. A cost, never income. */
  costAud: 200 * BED_PRICE_AUD,
  label: 'proposed' as Solidity,
} as const;

export const FACILITY_BAND = {
  lowAud: OFFERS.completeFacility.lowAud,
  highAud: OFFERS.completeFacility.highAud,
  publicPrice: OFFERS.completeFacility.publicPrice,
  label: 'modelled' as Solidity,
} as const;

/** The site floor that starts the day anyone works on a site. Already public; reused, not retyped. */
export const SITE_FLOOR = {
  amount: SITE_OPERATING.floorAmount,
  sentence: SITE_OPERATING.floorSentence,
  label: SITE_OPERATING.label_status,
} as const;

// ---------------------------------------------------------------------------
// One pool, by how much of it is sold

export interface PoolScenario {
  /** Share of the pool sold, 0 to 1. The rest is given. */
  soldShare: number;
  sold: number;
  given: number;
  /** Gross sales at the public price. Not income: nothing has been deducted. */
  grossSalesAud: number;
  /** How far gross sales reach into the facility band, against its bottom and top. */
  facilityLowCoverage: number;
  facilityHighCoverage: number;
}

export function poolScenario(soldShare: number): PoolScenario {
  if (soldShare < 0 || soldShare > 1) throw new Error('soldShare must be between 0 and 1');
  const sold = Math.round(POOL.beds * soldShare);
  const grossSalesAud = sold * BED_PRICE_AUD;
  return {
    soldShare,
    sold,
    given: POOL.beds - sold,
    grossSalesAud,
    facilityLowCoverage: grossSalesAud / FACILITY_BAND.lowAud,
    facilityHighCoverage: grossSalesAud / FACILITY_BAND.highAud,
  };
}

/** The four mixes worth showing a funder. All sold is the ceiling, not the plan. */
export const POOL_SCENARIOS: readonly PoolScenario[] = [1, 0.75, 0.5, 0.25].map(poolScenario);

/** The sentence the drawing carries on the sales panel. */
export const SALES_SENTENCE =
  'Up to $150,000 if all 200 sell at $750. Less when beds are given. A design number until the rules are agreed.';

/** The sentence the drawing carries on the facility panel. */
export const FACILITY_SENTENCE =
  'More beds, a shredder or a press, the washer. A full facility is $150,000 to $220,000, so one pool sold in full reaches the bottom of that band and no further.';

/** The sentence the drawing carries on the margin panel. */
export const MARGIN_SENTENCE =
  'About $324 stays on a bed pressed locally against about $65 on a kit. Modelled, not yet measured; the measured run is what proves it.';

// ---------------------------------------------------------------------------
// The loop and its gates, as drawn on slide 08C

export interface LoopStep {
  n: number;
  title: string;
  body: string;
  label: Solidity;
}

export const LOOP_STEPS: readonly LoopStep[] = [
  { n: 1, title: '200 beds arrive', body: 'Cost $150,000. Useful stock that lasts, held locally.', label: 'proposed' },
  { n: 2, title: 'The community sets the mix', body: 'Give some to meet immediate need. Sell some to pay local work.', label: 'proposed' },
  { n: 3, title: 'Sales money stays local', body: SALES_SENTENCE, label: 'proposed' },
  { n: 4, title: 'The community decides what comes next', body: FACILITY_SENTENCE, label: 'modelled' },
  { n: 5, title: 'Making moves closer', body: MARGIN_SENTENCE, label: 'modelled' },
];

export const LOOP_RETURN = {
  title: 'Then the community decides again',
  body: 'The next pool, the next product, the next decision. The return arrow stays inside the community, never back to the funder.',
} as const;

export interface LoopGate {
  title: string;
  body: string;
}

/** Nothing in the loop is real until these four are true at a named site. */
export const LOOP_GATES: readonly LoopGate[] = [
  { title: 'Buyers', body: 'Who is buying the sold beds, named.' },
  { title: 'Rules', body: 'Allocation, sales money, resale and stock, agreed and signed.' },
  { title: 'An operator and a place', body: 'Who runs the line, where, and who pays them.' },
  { title: 'A measured cost', body: 'Fifty beds pressed at production rate, timed and costed.' },
];

// ---------------------------------------------------------------------------
// Nic's timeline, as targets

export const TIMELINE_TARGETS = {
  label: 'target' as Solidity,
  steps: [
    'Raise the pool money between now and the end of 2026.',
    'Build and deliver the 1,000 beds into five pools. Kits from the current supplier for most; the first fifty pressed at the farm and measured.',
    'Communities sell or allocate their pools in the first quarter of 2027.',
    'Each community decides what its sales money builds: more beds, a module, or a facility.',
  ],
  honesty:
    'One thousand beds in a quarter is about eight times the largest run to date (40 beds). The kit path can move that fast only if the supplier can; the pressed path cannot yet, and saying so is the point of the measured run.',
} as const;
