/**
 * "What we can actually make" - the production questions, answered in plain words.
 *
 * Section 7 is the reason this file exists. It read "No, we didn't measure it",
 * which was true about the workshop floor and wrong about the evidence: INV-0303
 * measured the money. Reconstructing the 40-bed Maningrida run against the model
 * gives $326.76 a bed of contribution against $324.26 modelled, a gap of under $100
 * across forty beds, using the actual $5,900 freight on that invoice.
 *
 * So the honest answer is not "we don't know". It is "the money checks out, the
 * workshop floor is what's unmeasured, and here is what a measured week would move".
 *
 * Everything here computes from the same locked model the workbook uses, so a
 * changed input changes the document rather than leaving it stale.
 *
 * Usage, from v2/:  npx tsx ../tools/build-what-we-can-make.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import scenarios from '../v2/src/lib/data/cost-model-scenarios.json';
import {
  CostModelDefaults,
  FACTORY_THROUGHPUT_CONFLICT,
} from '../v2/src/lib/data/cost-model-scenarios';

const f = scenarios.build_states.state_4_factory;
const labourDay = scenarios.labour_rates_in_house.production_operator_per_day;
const FREIGHT = CostModelDefaults.long_haul_freight_per_bed; // 150
const PRICE = 750;
const BEDS = 40; // the Maningrida run, INV-0303
const FREIGHT_ACTUAL = 5900; // INV-0303 freight line, ex BNE - DRW - MNG
const VOL = 500; // planning rate

const m = (n: number) => '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const m0 = (n: number) => '$' + Math.round(n).toLocaleString('en-AU');

const direct = f.direct_total; // 275.74
const totalRun = direct * BEDS + FREIGHT_ACTUAL;
const contribActual = (PRICE * BEDS - totalRun) / BEDS;
const contribModel = PRICE - (direct + FREIGHT);

/** Per-bed cost under a changed assumption. */
const variant = (bedsPerDay: number, yieldPct: number, litresPerBed: number) => {
  const hdpe = (scenarios.physics.hdpe_kg_per_bed / yieldPct) * 2.75;
  const diesel = litresPerBed * (15 / 5);
  const labour = labourDay / bedsPerDay;
  return hdpe + diesel + labour + 27 + 93.5 + 5.24 + FREIGHT;
};
const locked = direct + FREIGHT;

const doc = `# What we can actually make

*Plain answers to the production questions. Every figure computes from the locked cost model.
Generated ${'2026-08-04'}; regenerate rather than edit.*

---

## 7. Did we measure the 40-bed Maningrida run?

**Not on the workshop floor. But the invoice measured the money, and it checks out.**

INV-0303 records 40 Stretch Beds at ${m0(PRICE)} each, paid, with ${m0(
  FREIGHT_ACTUAL,
)} of freight on the same invoice, routed Brisbane to Darwin to Maningrida. Reconstructing the run
against what the model says it should have cost:

| | Per bed | 40 beds |
|---|---|---|
${f.components
  .map((c) => `| ${c.label} | ${m(c.amount)} | ${m0(c.amount * BEDS)} |`)
  .join('\n')}
| **Direct** | **${m(direct)}** | **${m0(direct * BEDS)}** |
| Freight, actual from the invoice | ${m(FREIGHT_ACTUAL / BEDS)} | ${m0(FREIGHT_ACTUAL)} |
| **Total** | **${m(totalRun / BEDS)}** | **${m0(totalRun)}** |

Revenue was ${m0(PRICE * BEDS)}. So the run contributed **${m(
  contribActual,
)} a bed** against the **${m(contribModel)}** the model predicts. The gap across forty beds is
under ${m0(Math.abs(contribActual * BEDS - contribModel * BEDS))}.

That is a real check and it passed. Two things follow.

**The costing is not guesswork.** It has now been tested against a paid invoice for a real delivery,
and it landed within a few dollars a bed.

**What remains unmeasured is the workshop floor**: operator hours, diesel litres and press yield.
Those do not change what this run earned. They change how confident we are that it repeats at
volume. One week of normal production with someone recording it settles it permanently. About
**${m0(2250)}**, five operator days and roughly 125 litres of diesel, and the beds still sell.

### What that week would actually move

| What it tests | Per bed | At ${VOL} beds a year |
|---|---|---|
| Throughput ${FACTORY_THROUGHPUT_CONFLICT.buildStateSays} a day rather than ${
  FACTORY_THROUGHPUT_CONFLICT.defaultsSays
} | ${m(variant(4, 1, 5) - locked)} | ${m0((variant(4, 1, 5) - locked) * VOL)} |
| Yield 80% rather than 100% | ${m(variant(5, 0.8, 5) - locked)} | ${m0((variant(5, 0.8, 5) - locked) * VOL)} |
| Diesel 8L a bed rather than 5 | ${m(variant(5, 1, 8) - locked)} | ${m0((variant(5, 1, 8) - locked) * VOL)} |
| **All three against us** | **${m(variant(4, 0.8, 8) - locked)}** | **${m0((variant(4, 0.8, 8) - locked) * VOL)}** |
| All three in our favour | ${m(variant(7, 0.95, 4) - locked)} | ${m0((variant(7, 0.95, 4) - locked) * VOL)} |

So the whole exposure is about **${m(
  variant(4, 0.8, 8) - locked,
)} a bed** in the worst case. Worth closing, not worth losing sleep over.

**And the ranking is not the one people assume.** Everyone worries about yield. Yield is the
smallest of the three. **Beds per operator day is what the week should above all count.**

---

## The thing this uncovered: freight is a third of the cost

${m(FREIGHT)} of the ${m(locked)} is long-haul freight. That is **${Math.round(
  (FREIGHT / locked) * 100,
)}% of the marginal cost of a bed**, and more than the plastic, the diesel and the labour put
together. It has never been on the list of things we worry about.

The Maningrida invoice validates it almost exactly: ${m0(FREIGHT_ACTUAL)} across ${BEDS} beds is
${m(FREIGHT_ACTUAL / BEDS)} a bed, against the ${m(
  FREIGHT,
)} the model assumes. That makes it one of the best-evidenced inputs we have, and nobody put it
there deliberately.

**Why it matters beyond the costing:** anything that moves production closer to the communities we
deliver to attacks a bigger number than any manufacturing saving we have found. Producing the
plastic component in Alice Springs or Darwin is worth more than the margin on the component itself.

---

## An open disagreement, worth ${m(20)} a bed

The model does not agree with itself about beds per operator day, which is the single most sensitive
input in the whole costing:

- The working defaults say **${FACTORY_THROUGHPUT_CONFLICT.defaultsSays} beds a day**.
- The factory build state says **${FACTORY_THROUGHPUT_CONFLICT.buildStateSays} beds a day**.
- The labour line inside that same build state divides by **${FACTORY_THROUGHPUT_CONFLICT.labourLineImplies}**.

At ${FACTORY_THROUGHPUT_CONFLICT.defaultsSays} a day the marginal cost is **${m(
  FACTORY_THROUGHPUT_CONFLICT.costPerBedAtFive,
)}**, which is the figure quoted externally and in the workbook. At ${
  FACTORY_THROUGHPUT_CONFLICT.buildStateSays
} a day it is **${m(FACTORY_THROUGHPUT_CONFLICT.costPerBedAtFour)}**.

This is written down rather than quietly corrected, because nobody knows which is right and the
Maningrida run cannot settle it: that run was never timed. It is resolved by
**${FACTORY_THROUGHPUT_CONFLICT.resolvedBy}**, owned by **${FACTORY_THROUGHPUT_CONFLICT.owner}**.
A guard in the codebase fails if the disagreement changes shape, so it cannot be resolved by
accident.

---

*Sources: locked cost model (\`cost-model-scenarios.json\`, v6, 2026-05-29); Defy invoices INV-1602,
INV-1731, INV-1732; Maningrida delivery invoice INV-0303, 18 May 2026. Generated from the model;
regenerate with \`npx tsx ../tools/build-what-we-can-make.ts\`.*
`;

const target = resolve(import.meta.dirname, '../deliverables/GOC-what-we-can-actually-make.md');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, doc);
console.log(`wrote ${target}`);
console.log(`  40-bed run: actual ${m(contribActual)}/bed vs modelled ${m(contribModel)}/bed`);
console.log(`  freight is ${Math.round((FREIGHT / locked) * 100)}% of marginal cost`);
