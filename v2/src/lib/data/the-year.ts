/**
 * The year to June 2027, as the applications state it. Figures from the finance model
 * (the-year-and-the-raise.ts RUNNING_AUD and three-year-plan.ts BREAK_EVEN_BEDS on the finance branch,
 * Ben's rulings of 15 September 2026) and the Tim Fairfax budget projection (6.3). The break-even is
 * computed there on the unrounded contribution ($287.59 a bed), which is why it reads 874 and not
 * the 873 that $288 would give. When the finance branch lands, import from it.
 */
import { ASSUMPTIONS } from './ten-year-scale';

export const RUNNING_COST_AUD = 251_224;
export const BREAK_EVEN_BEDS = ASSUMPTIONS.mainFacilityBedsAYear.value;
export const FACILITY_CAPACITY_BEDS = ASSUMPTIONS.mainFacilityCapacity.value;
export const PLAN_BEDS = { toJune2027: 400, toJune2028: 874, toJune2029: 900 } as const;
