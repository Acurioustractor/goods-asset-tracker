/**
 * The community side of the cost model.
 *
 * WHY THIS EXISTS
 * ---------------
 * Every other model in this repo answers "does the bed business wash its own face",
 * which is Goods' question. A community asking "what is in it for us" got a sentence,
 * not a number: one scenario row reading "margin stays in community", with no
 * arithmetic behind it. This file is that arithmetic.
 *
 * THE IDEA THAT MAKES IT WORK
 * ---------------------------
 * A partial module set does not make beds. Utopia's chosen pair (collection +
 * shredding) produces SHRED. Tennant Creek's produces LEG KITS. Only a set that
 * reaches assembly produces a $750 bed. So "what does a community earn" is decided
 * by how far down the chain they chose to go.
 *
 * We do not have to invent transfer prices for the rungs below a finished bed,
 * because Goods already BUYS every one of them from Defy today. What a community
 * produces is a thing Goods stops buying from a supplier in Sydney. That makes the
 * ladder evidenced rather than aspirational, and it makes the offer legible:
 * we pay this today, and we would rather pay you.
 *
 * WHAT THIS FILE DELIBERATELY DOES NOT DO
 * ---------------------------------------
 * It does not split the money that arrives at a community into "wages" and
 * "surplus". That split is the community's decision, not a modelling assumption,
 * and inventing one would be the same mistake as the missing model it replaces.
 * It reports what arrives and what it costs to run; who gets paid what out of it
 * is a conversation, and `openDecisions` says so out loud.
 *
 * NOTHING HERE GOES TO A COMMUNITY AS A PRICE. The standing rule holds: no
 * community sees a number for their own pathway before they have seen it in person.
 */
import scenarios from '../data/cost-model-scenarios.json';
import { priceModuleOperating, priceModuleSelection } from '../data/cost-model-scenarios';

const _defy = scenarios.defy_verified_rates;
const _physics = scenarios.physics;

/** Module keys in feed order. A module cannot run without the one before it. */
export const FEED_ORDER = [
  'collection_baling',
  'shredding',
  'pressing_cnc',
  'assembly',
  'sales_delivery',
] as const;

export type ProductionModuleKey = (typeof FEED_ORDER)[number];

export interface LadderRung {
  /** The module whose completion produces this output. */
  module: ProductionModuleKey;
  /** What the community physically has at the end of this step. */
  output: string;
  /**
   * What that output is worth per bed's worth of material, in AUD.
   * Null where Goods does not buy the thing today, so no price is evidenced.
   */
  perBedEquivalent: number | null;
  grade: 'verified' | 'open';
  source: string;
}

/**
 * The value ladder: what each step of the chain is worth per bed's worth of material.
 *
 * Every priced rung is what Goods ALREADY PAYS Defy, from a named invoice. The one
 * unpriced rung is real and must stay unpriced: Goods does not buy sorted feedstock
 * from anyone, because community-collected plastic enters the model at $0. A
 * community that only collects has no one to sell to yet, and saying that plainly is
 * worth more than a plausible number.
 */
export const VALUE_LADDER: LadderRung[] = [
  {
    module: 'collection_baling',
    output: 'Sorted, caged HDPE ready to shred',
    perBedEquivalent: null,
    grade: 'open',
    source: 'No purchase price exists. Feedstock enters the cost model at $0 (free, community-collected).',
  },
  {
    module: 'shredding',
    output: 'HDPE shred',
    perBedEquivalent: _physics.hdpe_kg_per_bed * _defy.hdpe_shred_per_kg.amount, // 20kg x $2.00 = $40.00
    grade: 'verified',
    source: `Defy INV-1731: $${_defy.hdpe_shred_per_kg.amount.toFixed(2)}/kg x ${_physics.hdpe_kg_per_bed}kg per bed`,
  },
  {
    module: 'pressing_cnc',
    output: 'Finished HDPE leg kit, cut and edged',
    perBedEquivalent: _defy.bed_kit_cut_finished.amount, // 344.05
    grade: 'verified',
    source: 'Defy INV-1602 (92 kits) + INV-1732 (50 kits)',
  },
  {
    module: 'assembly',
    output: 'A finished bed, ready to go out',
    perBedEquivalent: _defy.bed_kit_cut_finished.amount + _defy.assembly_labour.amount, // 400.00
    grade: 'verified',
    source: 'Defy kit $344.05 + assembly labour $55.95 (2026-03-19 line)',
  },
  {
    module: 'sales_delivery',
    output: 'Beds in homes, sold by the community',
    perBedEquivalent: 750,
    grade: 'verified',
    source: 'Stretch Bed shop price, canon',
  },
];

/**
 * The four steps that physically depend on each other. You cannot press what was never
 * shredded, so a run through these must be contiguous.
 *
 * `sales_delivery` is deliberately NOT one of them. Selling and delivering beds does not
 * require having made them, and treating it as the last link of a physical chain was a
 * modelling error that hid a real option: a community can supply beds to its own people
 * without pressing a single leg. The original rule quietly forbade the most interesting
 * thing Utopia could do.
 */
export const PHYSICAL_CHAIN = FEED_ORDER.filter((k) => k !== 'sales_delivery');

/**
 * What selling and delivering is worth per bed: the retail price less the cost of a
 * finished bed ready to go.
 *
 * GROSS, NOT PROFIT. Freight into remote communities comes out of this and is not
 * modelled anywhere, because we do not have the number. In Central Australia it is not
 * small. Treat the shape as right and the size as unproven.
 */
export const SALES_SPREAD_PER_BED =
  (VALUE_LADDER.find((r) => r.module === 'sales_delivery')!.perBedEquivalent ?? 0) -
  (VALUE_LADDER.find((r) => r.module === 'assembly')!.perBedEquivalent ?? 0);

/**
 * The furthest PHYSICAL rung a selection reaches - what the community actually makes.
 *
 * Returns null on a run with a hole in it (pressing without shredding), because such a
 * run produces nothing: the value of what you hold is set by the last step you can
 * complete, and you cannot complete a step whose input never arrives. Also null when a
 * community only sells, which is not a defect - they make nothing and earn on the spread.
 */
export function furthestPhysicalRung(keys: readonly string[]): LadderRung | null {
  const ordered = PHYSICAL_CHAIN.filter((k) => keys.includes(k));
  if (ordered.length === 0) return null;

  const first = PHYSICAL_CHAIN.indexOf(ordered[0]);
  const contiguous = ordered.every((k, i) => k === PHYSICAL_CHAIN[first + i]);
  if (!contiguous) return null;

  const last = ordered[ordered.length - 1];
  return VALUE_LADDER.find((r) => r.module === last) ?? null;
}

export interface CommunityEconomics {
  /** Modules the community selected, in feed order. */
  modules: readonly string[];
  /** The furthest thing they MAKE, and what it is worth. Null when they only sell. */
  rung: LadderRung | null;
  /** True when the selection includes selling and delivering. */
  sells: boolean;
  /** Per bed: what making earns, what selling earns. Either may be null. */
  makingPerBed: number | null;
  sellingPerBed: number | null;
  /** True when the selection has a hole in it, e.g. pressing with no shredding. */
  brokenChain: boolean;
  /**
   * True when the run is contiguous but starts partway down the chain, so its input
   * has to be bought in. Tennant Creek is the live case. Not a defect - but the
   * bought-in input is a real cost this model does not carry.
   */
  buysInputIn: boolean;

  setup: {
    capexLow: number;
    capexHigh: number;
    /** False when any selected module has no price. Do not quote a total. */
    priceable: boolean;
    unpriced: string[];
  };

  annual: {
    /** Beds' worth of material processed per year. */
    volume: number;
    /** What arrives at the community for what they produce. Null when the rung is unpriced. */
    grossEarnings: number | null;
    /** Cost of running the chosen modules: site floor plus each module's share. */
    operatingCost: number;
    /** grossEarnings less operatingCost. Null when unpriced. This is what the community has to pay people from. */
    netToCommunity: number | null;
  };

  /** Things a human must decide. Never silently defaulted. */
  openDecisions: string[];
}

/**
 * Model one community's chosen modules at a given annual volume.
 *
 * `volume` is beds' worth of material per year, NOT beds sold. A shredding-only site
 * processes material for beds that are finished somewhere else, and counting that as
 * bed sales is exactly the capacity-as-revenue error the main model is careful to avoid.
 */
export function modelCommunity(
  keys: readonly string[],
  volume: number,
  opts: { includeSiteBase?: boolean } = {},
): CommunityEconomics {
  const ordered = FEED_ORDER.filter((k) => keys.includes(k));
  const rung = furthestPhysicalRung(ordered);
  const sells = ordered.includes('sales_delivery');
  const makesFinishedBeds = rung?.module === 'assembly';

  // A run of modules must be CONTIGUOUS in feed order: you cannot press what was
  // never shredded. It need not START at collection, though - Tennant Creek is the
  // live case, buying shred in rather than collecting it - so that is a separate
  // fact reported below, not a broken chain.
  // Contiguity is judged over the PHYSICAL chain only. Sales is excluded because it
  // does not consume the step before it.
  const physical = PHYSICAL_CHAIN.filter((k) => keys.includes(k));
  const firstIndex = physical.length > 0 ? PHYSICAL_CHAIN.indexOf(physical[0]) : -1;
  const brokenChain = physical.some((k, i) => k !== PHYSICAL_CHAIN[firstIndex + i]);
  const buysInputIn = firstIndex > 0 && !brokenChain;

  // No production modules means no production site, so no site base either. This
  // mirrors priceModuleOperating, which returns zero for the same reason. Palm Island
  // is the live case: they asked to start with governance, and charging them for a
  // container they did not ask for is how a model turns a pathway into a sales pitch.
  const hasProduction = ordered.length > 0;
  const capex = hasProduction
    ? priceModuleSelection(ordered, opts)
    : { withBaseLow: 0, withBaseHigh: 0, priceable: true, unpriced: [] as string[], capexLow: 0, capexHigh: 0 };
  const operating = priceModuleOperating(ordered);

  // Two income lines that stack, because they are different work.
  //
  // MAKING earns the value of the furthest physical step completed. SELLING earns the
  // spread between a finished bed and a bed in a home, whether or not this community
  // made that bed - a community that sells beds pressed elsewhere is running a real
  // distribution business, and the earlier model refused to see it.
  //
  // The two are consistent at the top of the chain: assembly ($400) plus the sales
  // spread ($350) is the $750 retail price, which is exactly what the ladder says a
  // community holding a bed in a home has.
  const makingPerBed = rung?.perBedEquivalent ?? null;
  const sellingPerBed = sells ? SALES_SPREAD_PER_BED : null;

  const perUnit =
    makingPerBed === null && sellingPerBed === null
      ? null
      : (makingPerBed ?? 0) + (sellingPerBed ?? 0);

  const grossEarnings = perUnit === null ? null : perUnit * volume;
  const netToCommunity = grossEarnings === null ? null : grossEarnings - operating.total;

  const openDecisions: string[] = [];
  if (rung?.grade === 'open') {
    openDecisions.push(
      `No one buys ${rung.output.toLowerCase()} today, so this selection has no income line yet. ` +
        'Either the community goes one module further, or Goods agrees a feedstock price. That is a decision, not a calculation.',
    );
  }
  if (!capex.priceable) {
    openDecisions.push(
      `Not priceable: ${capex.unpriced.join(', ')} has no quote. Do not present a setup total until it does.`,
    );
  }
  if (brokenChain) {
    openDecisions.push(
      'Broken chain: a module is selected with nothing to feed it. This selection produces nothing, so it has no income line at all.',
    );
  }
  if (sells) {
    openDecisions.push(
      `Selling is counted at the gross spread of $${SALES_SPREAD_PER_BED} a bed, which is the retail price less ` +
        'the cost of a finished bed. Freight into community comes out of that and is NOT modelled anywhere. ' +
        'In Central Australia it is not small, so treat this line as the right shape and an unproven size.',
    );
  }
  if (sells && !makesFinishedBeds) {
    openDecisions.push(
      'This community would sell beds it did not build, buying them in finished. That is a real business and a ' +
        'different relationship from making them - worth putting to community as its own question, not as a ' +
        'smaller version of a factory.',
    );
  }
  if (buysInputIn) {
    openDecisions.push(
      `This run starts at ${ordered[0]}, so its input is bought in rather than collected on Country. ` +
        'That purchase is a real cost and it is NOT in these figures.',
    );
  }
  openDecisions.push(
    'How the money splits between wages and community surplus is the community\'s call, not a model output.',
  );
  openDecisions.push(
    'The network service fee is not agreed with any community. It falls as more sites join, which is why the third site improves the first community\'s deal.',
  );

  return {
    modules: ordered,
    rung,
    sells,
    makingPerBed,
    sellingPerBed,
    brokenChain,
    buysInputIn,
    setup: {
      capexLow: capex.withBaseLow,
      capexHigh: capex.withBaseHigh,
      priceable: capex.priceable,
      unpriced: capex.unpriced,
    },
    annual: {
      volume,
      grossEarnings,
      operatingCost: operating.total,
      netToCommunity,
    },
    openDecisions,
  };
}

/**
 * The network block a community's service fee would contribute to, per site,
 * at a given number of sites in the network.
 *
 * NOT AGREED WITH ANYONE. This is the arithmetic that shows why replication is in a
 * community's interest and not only in Goods': the shared cost is flat, so every new
 * site makes every existing site's share smaller.
 */
/**
 * The modules each live pathway has actually asked for, read from the single place
 * that records them. Ids are normalised because `community-pathways.ts` uses hyphens
 * and `cost-model-scenarios.json` uses underscores; restating the module lists here
 * to dodge that would create the second source of truth this file exists to avoid.
 */
export function pathwayModules(pathwayId: string): readonly string[] | null {
  const key = pathwayId.replace(/-/g, '_');
  const found = scenarios.capex_modules.live_pathways.find((p) => p.key === key);
  return found ? found.modules : null;
}

/** Model a named community pathway. Returns null for an id with no recorded selection. */
export function modelPathway(
  pathwayId: string,
  volume: number,
  opts: { includeSiteBase?: boolean } = {},
): CommunityEconomics | null {
  const modules = pathwayModules(pathwayId);
  return modules === null ? null : modelCommunity(modules, volume, opts);
}

export const NETWORK_BLOCK_PER_YEAR = 109_500;

export function networkFeePerSite(sites: number): number {
  if (sites < 1) throw new RangeError('sites must be at least 1');
  return NETWORK_BLOCK_PER_YEAR / sites;
}
