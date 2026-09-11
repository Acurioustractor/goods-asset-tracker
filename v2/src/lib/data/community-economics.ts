/**
 * COMMUNITY ECONOMICS: what a community can do with plastic, and what each step is worth.
 *
 * Source: `GOC Bed Unit-Costing Model v2`, 4 August 2026, tab "Community Economics", read
 * 11 September 2026. Its figures are reproduced here so they stop living only in a spreadsheet
 * in a downloads folder, and so the guards below can hold the arithmetic still.
 *
 * ---------------------------------------------------------------------------
 * THE FINDING THIS MODULE EXISTS FOR
 * ---------------------------------------------------------------------------
 * Every pathway that includes selling makes money. The only one that loses money is
 * collect-and-shred, which the source labels "today's ask": it loses $33,043 a year, because the
 * site floor lands the moment anyone works there at all.
 *
 * Read the converse carefully, because it does not hold. Pressing without selling still pays,
 * at $83,741 a year. The case for selling is not that pressing fails. It is that selling returns
 * more, on less setup, with no extra capex.
 *
 * In the source's own words: "selling is worth MORE than pressing and needs NO extra capex,
 * because the site base is already there."
 *
 * The whole chain still earns the most, and roughly doubles the return for roughly double the
 * setup, so a plant earns its place. What a plant does not do is make the money. Selling does.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS MODULE MUST NEVER BE USED FOR
 * ---------------------------------------------------------------------------
 * The source carries a banner and it travels with these figures:
 *
 *   "NOTHING HERE HAS BEEN OFFERED TO ANY COMMUNITY. No community sees a price for their own
 *    pathway before they have been walked through it in person."
 *
 * It also refuses three things on purpose, and so does this module. It never splits money
 * arriving at a community into wages and surplus, because that is the community's decision and
 * a model that guesses it puts a number where a conversation belongs. It does not cost bought-in
 * feedstock for a pathway that starts partway down the chain. And it does not price a site base
 * for a community that asked for no production modules.
 */

export type LadderGrade = 'verified' | 'open';

/**
 * Everything in this module is Australian dollars, and one year is one year.
 *
 * THE 450 HAS NO DERIVATION. It appears once in the source, in a text label reading "at 450 beds'
 * worth of material a year", and every figure on that tab is typed by hand with no formula behind
 * it. Nothing else in the workbook produces 450: its own Inputs sheet says 500 beds a year per
 * factory and 500 per container, with a first-year utilisation of 0.4, which gives 200.
 *
 * It also matches nothing we use now. Witta runs 576 beds a year at three a day and 960 at five.
 * A plant is modelled at about 200 in its first year and 720 at steady state. So the pathway
 * table describes a volume that appears nowhere else, including elsewhere in the same file.
 *
 * The figures below are internally consistent at 450 and are kept because they are the source.
 * BREAK_EVEN_BEDS is the better way to read them: it needs no volume assumption at all.
 */
export const PATHWAY_SCALE_BEDS = 450;

export const PATHWAY_BANNER =
  'Nothing here has been offered to any community. No community sees a price for their own ' +
  'pathway before they have been walked through it in person.';

export interface LadderRung {
  step: string;
  /** What the community ends up holding after this step. */
  holds: string;
  /** Worth per bed's worth of material. Null where no purchase price exists. */
  worthPerBedAud: number | null;
  grade: LadderGrade;
  source: string;
}

/**
 * The value ladder. Every priced rung is what Goods already pays Defy today, from a named
 * invoice, which is what makes the offer checkable rather than aspirational.
 *
 * The source's line: "this money goes to Sydney now, and we would rather it went to the
 * community doing the work."
 */
export const VALUE_LADDER: readonly LadderRung[] = [
  {
    step: 'Collection and baling',
    holds: 'Sorted, caged HDPE ready to shred',
    worthPerBedAud: null,
    grade: 'open',
    source: 'No purchase price exists. Feedstock enters the cost model at $0, free and community-collected.',
  },
  {
    step: 'Shredding',
    holds: 'HDPE shred',
    worthPerBedAud: 40,
    grade: 'verified',
    source: 'Defy INV-1731: $2.00 a kilogram across 20 kg a bed.',
  },
  {
    step: 'Pressing and CNC',
    holds: 'Finished HDPE leg kit, cut and edged',
    worthPerBedAud: 344.05,
    grade: 'verified',
    source: 'Defy INV-1602, 92 kits, and INV-1732, 50 kits.',
  },
  {
    step: 'Assembly',
    holds: 'A finished bed, ready to go out',
    worthPerBedAud: 400,
    grade: 'verified',
    source: 'Defy kit $344.05 plus assembly labour $55.95.',
  },
  {
    step: 'Sales and delivery',
    holds: 'Beds in homes, sold by the community',
    worthPerBedAud: 750,
    grade: 'verified',
    source: 'Stretch Bed shop price, canon.',
  },
];

/** Shred to pressed kits is the biggest single jump on the ladder. Everything before it is preparation. */
export const SHRED_TO_KIT_MULTIPLE = 344.05 / 40;

export interface BuildPath {
  name: string;
  plasticAud: number;
  steelAud: number;
  canvasAud: number;
  hardwareAud: number;
  dieselAud: number;
  labourAud: number;
  freightAud: number;
  totalAud: number;
  note: string;
}

/**
 * Three ways a bed gets made, all costs per bed and all INCLUDING freight.
 *
 * Note the difference from the canon $275.74, which is the Factory path with freight taken out
 * and charged on top at cost. $425.74 minus $275.74 is exactly the $150 of freight, and every
 * other line is identical to the cent. The margin did not improve; freight became a pass-through.
 */
export const BUILD_PATHS: readonly BuildPath[] = [
  {
    name: 'Buy-Kit',
    plasticAud: 344.05, steelAud: 27, canvasAud: 93.5, hardwareAud: 5.24,
    dieselAud: 0, labourAud: 40, freightAud: 175, totalAud: 684.79,
    note: 'Cut kits bought finished from Defy. The Defy order record says not to buy these: they cost more than the whole make cost and take the labour out of the bed.',
  },
  {
    name: 'Factory',
    plasticAud: 55, steelAud: 27, canvasAud: 93.5, hardwareAud: 5.24,
    dieselAud: 15, labourAud: 80, freightAud: 150, totalAud: 425.74,
    note: 'Witta today. Pressing our own sheets from bought shred.',
  },
  {
    name: 'Community',
    plasticAud: 0, steelAud: 27, canvasAud: 93.5, hardwareAud: 5.24,
    dieselAud: 15, labourAud: 130, freightAud: 150, totalAud: 420.74,
    note: 'The cheapest of the three, because community-collected feedstock enters at $0. It pays $130 of labour against Witta’s $80 and still comes out ahead.',
  },
];

export const BED_PRICE_IN_SOURCE = 750;

export interface Pathway {
  option: string;
  setupLowAud: number;
  setupHighAud: number;
  earnsPerYearAud: number;
  runningPerYearAud: number;
  leftOverPerYearAud: number;
  /** Does this pathway include selling the bed? */
  includesSelling: boolean;
  note?: string;
}

/**
 * The five options open to a community, at 450 beds' worth of material a year.
 *
 * Read the `leftOverPerYearAud` column and then read `includesSelling`. They line up exactly.
 */
export const PATHWAYS: readonly Pathway[] = [
  {
    option: 'Collect and shred',
    setupLowAud: 56_600, setupHighAud: 103_300,
    earnsPerYearAud: 18_000, runningPerYearAud: 51_043, leftOverPerYearAud: -33_043,
    includesSelling: false,
    note: 'The source labels this "today’s ask". It does not pay for itself, because the site floor lands the moment anyone works there at all. A grant has to sit behind it until the chain reaches pressing or selling.',
  },
  {
    option: 'Collect, shred and sell',
    setupLowAud: 56_600, setupHighAud: 103_300,
    earnsPerYearAud: 175_500, runningPerYearAud: 52_843, leftOverPerYearAud: 122_657,
    includesSelling: true,
    note: 'Selling closes the gap without a press, on the same setup as collect-and-shred.',
  },
  {
    option: 'Collect, shred and press',
    setupLowAud: 89_380, setupHighAud: 136_080,
    earnsPerYearAud: 154_822.5, runningPerYearAud: 71_081, leftOverPerYearAud: 83_741.5,
    includesSelling: false,
    note: 'More setup than selling and less return. This is the pathway most people assume is the point.',
  },
  {
    option: 'Sell and deliver only, no plant',
    setupLowAud: 31_800, setupHighAud: 64_000,
    earnsPerYearAud: 157_500, runningPerYearAud: 36_800, leftOverPerYearAud: 120_700,
    includesSelling: true,
    note: 'The cheapest setup of the five and nearly the best return. The spread is $350 a bed, the retail price less the cost of a finished bed. Freight comes out of that and is not modelled: right shape, unproven size.',
  },
  {
    option: 'The whole chain',
    setupLowAud: 95_767, setupHighAud: 142_467,
    earnsPerYearAud: 337_500, runningPerYearAud: 79_333, leftOverPerYearAud: 258_167,
    includesSelling: true,
    note: 'Earns the most and roughly doubles the return for roughly double the setup of selling alone.',
  },
];

/** The spread a community keeps on a bed it sells but did not make. */
export const SELLING_SPREAD_AUD = 750 - 400;

/**
 * The shared team behind every site costs this whether there is one site or five, so every
 * community that joins makes every other community's share smaller.
 *
 * The source's heading: "why the third site is in the FIRST community's interest". Its own
 * caveat: "NOT AGREED WITH ANY COMMUNITY, this is the arithmetic, not an offer."
 *
 * Costed here at the 4 August overhead of $109,500. At the 9 September running cost of $297,550
 * every figure below roughly triples, which is a separate question about what the shared team is.
 */
export const NETWORK_SHARED_COST_AUD = 109_500;

export function networkFeePerSite(sites: number): number {
  return NETWORK_SHARED_COST_AUD / sites;
}

/** What this model refuses to say, kept as a constant so it cannot be quietly dropped. */
export const PATHWAY_REFUSALS: readonly string[] = [
  'It never splits money arriving at a community into wages and surplus. That is the community’s decision, and a model that guesses it puts a number where a conversation belongs.',
  'It does not cost bought-in feedstock for a pathway that starts partway down the chain.',
  'It does not price a site base for a community that asked for no production modules.',
];

/**
 * What each pathway earns per bed's worth of material, which is its yearly earnings divided by
 * the 450 the source assumes.
 */
export function earnsPerBed(p: Pathway): number {
  return p.earnsPerYearAud / PATHWAY_SCALE_BEDS;
}

/**
 * Beds a year of material each pathway needs before it covers its own running cost.
 *
 * This is the honest way to read the table, because it does not depend on the unsourced 450.
 * Selling breaks even at about 105 beds a year. Pressing needs twice that. Collect-and-shred
 * needs 1,276, which is above every plant volume anywhere in the model, so it does not pay for
 * itself at any output a community plant is expected to reach.
 */
export function breakEvenBeds(p: Pathway): number {
  return p.runningPerYearAud / earnsPerBed(p);
}

/** Pathways that pay for themselves. */
export function payingPathways(): readonly Pathway[] {
  return PATHWAYS.filter((p) => p.leftOverPerYearAud > 0);
}

/** Pathways that do not. */
export function losingPathways(): readonly Pathway[] {
  return PATHWAYS.filter((p) => p.leftOverPerYearAud <= 0);
}

/** The one sentence this module is for. */
export const PATHWAY_FINDING =
  'Every pathway that includes selling makes money, and the only one that loses money is ' +
  'collect-and-shred, which does not. Pressing pays too, at $83,741 a year, so the case for ' +
  'selling is not that pressing fails. It is that selling returns more on less setup and needs ' +
  'no extra capex, because the site base is already there.';
