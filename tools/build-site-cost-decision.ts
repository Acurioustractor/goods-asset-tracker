/**
 * The site cost decision page: three questions, one sitting, one number settled.
 *
 * WHY THIS EXISTS
 * ---------------
 * The GOC cost model is three numbers: per bed, per site per year, and once for the
 * whole company. Two of the three are settled. The middle one has THREE different
 * live answers, and it moves the only question an investor asks from two sites to
 * five:
 *
 *   ~$15,000  Matt's projection, implied at scale   ->  2 sites
 *    $48,333  our MODEL (live) tab                  ->  3 sites
 *    $79,333  our per-module operating allocation   ->  5 sites
 *
 * That is why the modelling keeps feeling arbitrary. It is not the arithmetic. One
 * input was never settled, so every document was built on a different one.
 *
 * This page does not decide it. It puts the three sub-questions that make it up in
 * front of the two people who can answer them, with what each choice costs.
 *
 * Usage, from v2/:  npx tsx ../tools/build-site-cost-decision.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import scenarios from '../v2/src/lib/data/cost-model-scenarios.json';

const alloc = scenarios.capex_modules.operating_allocation;
const mods = scenarios.capex_modules.modules;

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-AU');
const money2 = (n: number) => '$' + n.toFixed(2);

// One site, factory path, at the locked planning rate.
const PRICE = 750;
const COST = 425.74;
const BEDS = 500;
const YIELD = 0.9;
const SALEABLE = BEDS * YIELD; // 450
const CONTRIB = SALEABLE * (PRICE - COST); // 145,917
const LEAKAGE = SALEABLE * PRICE * 0.05; // warranty 3% + bad debt 2%

/** Fixed cost that does NOT change with the number of sites. */
const NETWORK = 109_500;
const CENTRAL = 53_000;
const FOUNDER = 67_200;
const FIXED = NETWORK + CENTRAL + FOUNDER; // 229,700

const sitesNeeded = (siteCost: number) => FIXED / (CONTRIB - LEAKAGE - siteCost);

const SITE_FLOOR = alloc.site_floor.total; // 35,000
const MODULE_SUM = alloc.per_module.reduce((t, m) => t + m.total, 0); // 44,333
const DETAILED = SITE_FLOOR + MODULE_SUM; // 79,333
const HEADLINE = 48_333;
const ADMIN_AT_SITE = alloc.site_floor.lines.find((l) => /admin/i.test(l.line))!.amount; // 15,000
const ADMIN_IN_NETWORK = 14_700;

const mvfEquipment = mods
  .filter((m) => m.key !== 'sales_delivery')
  .reduce((t, m) => t + ((m.capex_low ?? 0) + (m.capex_high ?? 0)) / 2, 0);
const TURNKEY_EQUIPMENT = 167_000;

const doc = `# What does a site cost to run for a year?

**One number. Three answers. Half an hour to settle.**
*For Ben and Nic. Generated from the cost model. Nothing here is a recommendation you have to take,
but the middle column is what each choice does to the number we give investors.*

---

## Why this is the only thing blocking the model

The Goods on Country cost model is three numbers:

1. **Per bed: ${money2(COST)}.** Settled, and checked against the Maningrida invoice.
2. **Per site, per year: not agreed.** ← everything below
3. **Once, for the whole company: ${money(
  FIXED,
)}.** Network ${money(NETWORK)}, company overhead ${money(CENTRAL)}, founder non-production ${money(
  FOUNDER,
)}.

A site earns ${money(CONTRIB - LEAKAGE)} a year before its own running costs. So the number of sites
we need is ${money(FIXED)} divided by whatever is left after those running costs.

| If a site costs this to run | A site clears | Sites needed to break even |
|---|---|---|
| ${money(15_000)} (Matt's projection, at scale) | ${money(CONTRIB - LEAKAGE - 15_000)} | **${sitesNeeded(15_000).toFixed(1)}** |
| ${money(HEADLINE)} (our MODEL tab) | ${money(CONTRIB - LEAKAGE - HEADLINE)} | **${sitesNeeded(HEADLINE).toFixed(1)}** |
| ${money(64_333)} (detailed, less the double count) | ${money(CONTRIB - LEAKAGE - 64_333)} | **${sitesNeeded(64_333).toFixed(1)}** |
| ${money(DETAILED)} (our module allocation) | ${money(CONTRIB - LEAKAGE - DETAILED)} | **${sitesNeeded(DETAILED).toFixed(1)}** |

**Two sites or five sites**, on the same product, the same price and the same fixed costs. That is
the whole problem, and it is why the modelling has felt arbitrary. It is not the arithmetic. This
one input was never settled, so every document was built on a different one.

---

## Question 1. What is a site's rent?

**In circulation:** ${money(12_000)} in the detailed build-up, ${money(
  30_000,
)} in the headline model.

The ${money(30_000)} is half of the Kirmos facility on the Sunshine Coast. An on-Country site is not
Kirmos. It might be a shed a community already has, a yard, or a container on a pad.

| Option | Per site per year | Effect on sites needed |
|---|---|---|
| Community supplies the space | ${money(0)} | ${sitesNeeded(HEADLINE - 30_000).toFixed(1)} |
| A modest yard and shed | ${money(12_000)} | ${sitesNeeded(HEADLINE - 18_000).toFixed(1)} |
| Kirmos-equivalent | ${money(30_000)} | ${sitesNeeded(HEADLINE).toFixed(1)} |

**Worth knowing before you answer:** Tennant Creek already has a shed. If most on-Country sites come
with a space, carrying Kirmos rent on every one of them overstates the cost of the model we are
actually building.

**Decision:** ________________________

---

## Question 2. Where does site admin sit?

**This one is a straight double count.** Administration is charged twice:

- ${money(ADMIN_IN_NETWORK)} of admin sits in the ${money(NETWORK)} network block.
- ${money(
  ADMIN_AT_SITE,
)} of "administration, accounting and IT" sits in the site floor, on top.

Same function, counted in two places. It cannot be both.

| Option | Effect |
|---|---|
| Admin is central, done once for all sites | Remove ${money(ADMIN_AT_SITE)} from every site |
| Admin is per site | Remove ${money(ADMIN_IN_NETWORK)} from the network block |
| Some of each | Split it, and write down the split |

**My read:** invoicing, BAS and board reporting genuinely happen once, centrally. A site needs
someone to keep a production log, not a bookkeeper. But there is a real answer here that depends on
how you intend to run sites, and only you two know that.

**Decision:** ________________________

---

## Question 3. How is machine upkeep charged?

**In circulation:** ${money(
  18_333,
)} flat per site, or 5% of that site's equipment, which is what both Matt's model and the module tab
use.

5% works out very differently depending on the scope:

| Basis | Equipment value | 5% per year |
|---|---|---|
| Modules we already run (MVF) | ${money(mvfEquipment)} | ${money(mvfEquipment * 0.05)} |
| Turnkey fitted workshop | ${money(TURNKEY_EQUIPMENT)} | ${money(TURNKEY_EQUIPMENT * 0.05)} |
| Flat, as the headline model has it | n/a | ${money(18_333)} |

**Worth knowing:** a percentage scales with what the site actually has, which is the right shape for
a module model where communities take different things. A flat figure charges a shredder-only site
the same as a full line, which is exactly what makes Utopia look worse than it is.

**Decision:** ________________________

---

## What happens once these three are answered

**One number replaces three.** It goes into the model once, and the MODEL tab, the module
allocation, Matt's projection and the community pages all read from it.

**The investor sentence stops moving.** Right now it is "three sites" in one document and would be
"five sites" in another. After this it is one sentence, and it stays that sentence.

**The community modules become sayable in one line:**

> A community's module earns X a year and costs Y to run. If Y is bigger, that gap is grant funded,
> and here is the next module that closes it.

That only works when Y is a single number. Today it is not.

**And Utopia's answer settles.** The shredder-only pathway currently reads minus ${money(
  33_043,
)} a year. Part of that is a real gap and part of it is a flat machine-upkeep charge and a Kirmos
rent line that a homelands site would never carry. Which part is which depends entirely on the three
answers above, and Utopia deserves the right number before anyone talks to them about it.

---

*Generated from \`cost-model-scenarios.json\`. Regenerate with
\`npx tsx ../tools/build-site-cost-decision.ts\`.*
`;

const target = resolve(import.meta.dirname, '../deliverables/GOC-site-cost-decision.md');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, doc);
console.log(`wrote ${target}`);
console.log(`  site cost -> sites needed: 15k=${sitesNeeded(15_000).toFixed(1)}  48.3k=${sitesNeeded(HEADLINE).toFixed(1)}  64.3k=${sitesNeeded(64_333).toFixed(1)}  79.3k=${sitesNeeded(DETAILED).toFixed(1)}`);
console.log(`  admin double count: ${money(ADMIN_IN_NETWORK)} network + ${money(ADMIN_AT_SITE)} site`);
