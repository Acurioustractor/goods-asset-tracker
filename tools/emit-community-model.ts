/**
 * Emit the community side of the cost model as JSON, for the workbook generator.
 *
 * WHY THIS EXISTS
 * ---------------
 * The workbook generator is Python and the model is TypeScript, and the wrong fix for
 * that is retyping the figures into the Python file. Every number retyped is a number
 * that can drift, and this repo has already paid for that twice today: Utopia's stored
 * operating cost sat $35,000 under the engine for months, and the plain-words document
 * told a funder the FY26 expense split was unsolved a day after it was solved.
 *
 * So the model stays the single source and this writes down what it says. If this file
 * has not been run, the workbook generator fails loudly rather than falling back to a
 * stale copy - a generator whose output depends on what happens to be on disk is worse
 * than no generator.
 *
 * Usage, from v2/:  npx tsx ../tools/emit-community-model.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import {
  VALUE_LADDER,
  modelPathway,
  networkFeePerSite,
  NETWORK_BLOCK_PER_YEAR,
} from '../v2/src/lib/cost-model/community-model';
import { COMMUNITY_PATHWAYS } from '../v2/src/lib/data/community-pathways';

/** Beds' worth of material a year at one shift. A planning rate, never a forecast. */
const PLANNING_VOLUME = 450;

const out = {
  _what_this_is:
    'Generated from v2/src/lib/cost-model/community-model.ts. Do not hand-edit: rerun the emitter.',
  _generated_from: 'tools/emit-community-model.ts',
  planning_volume: PLANNING_VOLUME,
  network_block_per_year: NETWORK_BLOCK_PER_YEAR,
  network_fee_by_sites: [1, 2, 3, 4].map((sites) => ({
    sites,
    fee_per_site: networkFeePerSite(sites),
  })),
  value_ladder: VALUE_LADDER.map((r) => ({
    module: r.module,
    output: r.output,
    per_bed_equivalent: r.perBedEquivalent,
    grade: r.grade,
    source: r.source,
  })),
  pathways: COMMUNITY_PATHWAYS.map((p) => {
    const m = modelPathway(p.id, PLANNING_VOLUME);
    if (!m) return { id: p.id, name: p.name, modelled: false };
    return {
      id: p.id,
      name: p.name,
      region: p.region,
      modelled: true,
      modules: m.modules,
      produces: m.rung?.output ?? null,
      per_bed_equivalent: m.rung?.perBedEquivalent ?? null,
      buys_input_in: m.buysInputIn,
      setup_low: m.setup.capexLow,
      setup_high: m.setup.capexHigh,
      gross_earnings: m.annual.grossEarnings,
      operating_cost: m.annual.operatingCost,
      net_to_community: m.annual.netToCommunity,
      open_decisions: m.openDecisions,
    };
  }),
};

const target = resolve(import.meta.dirname, '../deliverables/community-model.json');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify(out, null, 2) + '\n');
console.log(`wrote ${target}`);
console.log(`  ${out.pathways.filter((p) => p.modelled).length} pathways modelled at ${PLANNING_VOLUME} beds/yr`);
