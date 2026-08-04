/**
 * Build the NT Corrective Services production pack.
 *
 * ⚠ SUPERSEDED AS THE THING WE SEND. 2026-08-04, after the call with Defy.
 * The EXTERNAL document is now tools/build-corrections-onepager.ts, which is
 * deliberately narrow: washing and shredding, and utility panel pressing, with an
 * exclusive sell-back clause. This pack proposes a scope that goes through to
 * assembled beds, which would make a government-backed facility a producer of the
 * finished product and compete with the community enterprises Goods exists to build.
 * Keep this as INTERNAL background for the equipment, process and safety detail.
 * Do not send it.
 *
 * WHAT THIS IS FOR
 * ----------------
 * Bodie asked to see three things: the products they could make, the equipment
 * needed, and the process. This generates that document from the same cost model
 * the rest of the business runs on, so nothing in a partner's hands is a figure
 * somebody typed once and forgot.
 *
 * THE FRAMING, WHICH IS DELIBERATE
 * --------------------------------
 * NT Corrections is buying a TRAINING CAPABILITY that happens to produce something
 * with a real customer, not a factory. Their unit is industry and training. So each
 * station is described by what it teaches and what it produces, and the commercial
 * section leads with the fact that Goods BUYS the output at the price it already
 * pays a manufacturer today.
 *
 * The pack never proposes taking product for free. A social enterprise selling beds
 * that were made for nothing by incarcerated people is not a partnership, and in the
 * Territory it is the story that would end the organisation. Paying a fair price
 * makes the industries program self-funding, which is what an industries unit needs.
 *
 * Usage, from v2/:  npx tsx ../tools/build-corrections-pack.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import scenarios from '../v2/src/lib/data/cost-model-scenarios.json';
import { VALUE_LADDER, SALES_SPREAD_PER_BED } from '../v2/src/lib/cost-model/community-model';

const capex = scenarios.capex_modules;
const alloc = capex.operating_allocation;
const defy = scenarios.defy_verified_rates;

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-AU');
const band = (lo: number | null, hi: number | null) =>
  lo === null || hi === null ? 'quote required' : lo === hi ? money(lo) : `${money(lo)} to ${money(hi)}`;

/** What each station teaches. Their unit buys competencies, not machines. */
const COMPETENCIES: Record<string, { teaches: string; roles: string }> = {
  collection_baling: {
    teaches: 'Material identification and sorting, contamination control, safe manual handling, stock records',
    roles: 'Recycling and waste operations, warehousing, logistics',
  },
  shredding: {
    teaches: 'Industrial machine operation, guarding and isolation, lockout and tagout, routine maintenance, output quality checks',
    roles: 'Machine operation, plant maintenance, recycling and resource recovery',
  },
  pressing_cnc: {
    teaches: 'Heat press operation and temperature control, CNC setup and toolpath basics, measurement and tolerance, finishing',
    roles: 'CNC machine operation, manufacturing, cabinetmaking and joinery, plastics fabrication',
  },
  assembly: {
    teaches: 'Reading assembly instructions, fastening and torque, quality inspection, packing for freight',
    roles: 'Production assembly, quality control, warehousing',
  },
  sales_delivery: {
    teaches: 'Not run inside. Kept with community and Goods.',
    roles: '-',
  },
};

/** Site requirements per station, asked in the language a facilities manager uses. */
const SITE_NEEDS: Record<string, string> = {
  collection_baling: 'Covered, ventilated storage. Cages rather than bales for rigid HDPE. Forklift or pallet access.',
  shredding: 'Three-phase power. Noise separation or hearing protection zone. Dust extraction. Guarded machine footprint.',
  pressing_cnc: 'Three-phase power. Fume extraction over the hot press. Dust extraction on the router. Fire separation and a heat-safe work zone.',
  assembly: 'Bench space, hand tools, packing area. No special services.',
  sales_delivery: 'Not applicable inside the facility.',
};

const rung = (key: string) => VALUE_LADDER.find((r) => r.module === key)!;
const mod = (key: string) => capex.modules.find((m) => m.key === key)!;
const op = (key: string) => alloc.per_module.find((m) => m.key === key)?.total ?? 0;

const INSIDE = ['collection_baling', 'shredding', 'pressing_cnc', 'assembly'] as const;

const doc = `# Goods on Country and NT Corrective Services

## A production and training capability: products, equipment and process

*INTERNAL BACKGROUND, not for sending. The external document is the one-pager. Generated from the Goods cost model, so every figure
traces to a source named in the last section. A working document for discussion, not a quotation.*

---

## 1. In one page

NT Corrective Services is building industry and training capacity at Darwin and Alice Springs, and
cannot sell what it produces. Goods designs and sells a product that is in demand across remote
Australia and is currently manufactured in Sydney.

The fit is straightforward. **Corrections runs the industrial middle of the process. Goods buys the
output at the price it already pays a manufacturer today, and takes it to market.** Neither
organisation can do the other's half, so this is a supply relationship rather than a competition.

Three things make it worth doing beyond the training value:

- **The customer already exists.** Goods buys these components every month. This is not a program
  hoping to find a market.
- **The materials are already local.** The steel and the canvas are both bought in Alice Springs
  today. Only the plastic component is made interstate, and that is the part this partnership moves.
- **The freight economics improve sharply.** Getting beds from Brisbane to a remote community
  currently costs about $5,900 a load. From Darwin or Alice Springs it is a fraction of that.

**What we would ask Corrections to do:** run collection, shredding, pressing and assembly.
**What Goods does:** design, materials specification, equipment supply and commissioning, training,
maintenance pathway, quality standards, and all sales and distribution.

---

## 2. The product

**The Stretch Bed.** A flat-packable, washable bed built for remote Australia. It is in market now,
it has been delivered to communities across the NT, Queensland and WA, and it sells for ${money(750)}.

| | |
|---|---|
| Weight | 26kg |
| Load capacity | 200kg |
| Dimensions | 188 × 92 × 25cm |
| Assembly | About 5 minutes, no tools |
| Design life | 10+ years (intent, not yet field-proven) |
| Plastic diverted | 20kg of HDPE per bed |

**How it is built.** Two galvanised steel poles thread through sleeves along the long edges of a
canvas sheet, and through the top holes of two crossed recycled-plastic X-trestle legs. Tensioning
pulls the poles into the leg holes. The canvas is structural: the bed does not stand without it.
There are no fixed joints and no tools.

**The three inputs, and who supplies them today:**

| Component | Detail | Currently from |
|---|---|---|
| Galvanised steel pipe | 26.9mm OD × 2.6mm wall, 1950mm | DNA Steel Direct, **Alice Springs** |
| Heavy-duty canvas | Australian, fully washable, quick-drying | Centre Canvas, **Alice Springs** |
| Recycled HDPE X-trestle legs | Pressed from collected plastic waste | Defy Design, **Sydney** |

The third row is the opportunity. Two of the three inputs are already sourced within the Territory.
The plastic component is the one made 3,000km away, and it is the one this partnership brings home.

**A note on the rest of the range, so nothing is over-promised.** Goods also has a washing machine
built for remote communities. It is at prototype stage, deployed in several communities, and is not
a production line we would propose starting with. Other products are ideas, not designs. The bed is
the one that is proven, sells, and has a customer waiting.

---

## 3. The process

Plastic waste goes in one end and a finished bed comes out the other, through four stations that
must run in order. Each one feeds the next.

**Collection and sorting → Shredding → Pressing, CNC and finishing → Assembly**

A fifth stage, sales and delivery, sits outside the facility and stays with Goods and community
partners.

Each station can be run on its own or added over time. A facility does not have to start with the
whole line, and there is a case for starting with pressing and CNC, because that is the step that
turns low-value material into the component Goods currently buys interstate.

${INSIDE.map((key, i) => {
  const m = mod(key);
  const r = rung(key);
  const c = COMPETENCIES[key];
  return `### Station ${i + 1}. ${m.label}

**Produces:** ${r.output}
**What it teaches:** ${c.teaches}
**Pathways it points at:** ${c.roles}
**Equipment cost:** ${band(m.capex_low, m.capex_high)}${m.grade === 'estimate' ? ' (estimate, firm quote required)' : ''}
**Running cost per year:** about ${money(op(key))}, excluding labour and the site itself
**Site requirements:** ${SITE_NEEDS[key]}
`;
}).join('\n')}

**Throughput.** One line running a single shift is planned at about 500 beds a year, which is
roughly 10 a week. Short bursts run considerably faster: our own facility has produced at about 30
beds a week over a two month deployment. We would model 500 for planning and treat anything above
it as upside, because a planning rate has to survive a bad week.

**A caution we would rather state than have you discover.** Our per-bed cost figure of $425.74 is
calculated, not measured. The process is proven, and 40 beds were pressed, cut and assembled in
house for a delivery to Maningrida in May 2026. What that run did not capture was operator hours,
diesel and yield. A measured week of production would settle it, and we would be glad to do that
jointly.

---

## 4. The equipment, and what a facility costs to stand up

Costs are shown as bands because they depend on what a site already has. Where Corrections supplies
the building, the power or the extraction, those lines come out.

### The site base, needed before any station runs

| Item | Cost |
|---|---|
${capex.site_base.lines.map((l: { item: string; low: number; high: number }) => `| ${l.item} | ${band(l.low, l.high)} |`).join('\n')}
| **Site base total** | **${band(capex.site_base.capex_low, capex.site_base.capex_high)}** |

Much of this is aimed at putting a line somewhere with no building and no power. An existing
workshop inside a correctional facility already has the shell, the slab and the electrical
infrastructure, so a realistic site base for Darwin or Alice Springs is materially lower than the
figures above. The lines that stay are extraction, the electrical connection to the machines, and
startup consumables.

### The production stations

| Station | Equipment cost | Running cost per year |
|---|---|---|
${INSIDE.map((k) => `| ${mod(k).label} | ${band(mod(k).capex_low, mod(k).capex_high)} | ${money(op(k))} |`).join('\n')}
| **All four stations** | **${band(
  INSIDE.reduce((t, k) => t + (mod(k).capex_low ?? 0), 0),
  INSIDE.reduce((t, k) => t + (mod(k).capex_high ?? 0), 0),
)}** | **${money(INSIDE.reduce((t, k) => t + op(k), 0))}** |

There is also a site floor of about ${money(alloc.site_floor.total)} a year that is incurred as soon
as anyone works on a site at all, covering administration, insurance and the yard. Inside an
existing correctional facility most of that is already carried, and it should be struck out rather
than passed on.

### Two ways to scope it

| Scope | Cost | What it is |
|---|---|---|
| Minimum viable line | about ${money(105000)} | A working line using the equipment set Goods already runs, second hand where sensible |
| Turnkey fitted workshop | ${money(207450)} | A fully fitted 40ft container workshop, everything new |

For a facility that already has a building, the real number sits below both, and we would want to
walk the space before putting a figure on it.

---

## 5. The commercial shape

This is the part we would want to be most explicit about, because it is where a partnership like
this usually goes wrong.

**Goods buys the output. It does not take it for free.**

Goods already pays a manufacturer for exactly these components, at rates that are on invoices we can
show you:

| What Corrections would produce | What Goods pays for it today |
|---|---|
| Shredded HDPE | ${money(rung('shredding').perBedEquivalent ?? 0)} per bed's worth (20kg at $${defy.hdpe_shred_per_kg.amount.toFixed(2)}/kg) |
| Finished, cut and edged leg kit | ${money(rung('pressing_cnc').perBedEquivalent ?? 0)} per bed |
| A bed assembled and ready to go | ${money(rung('assembly').perBedEquivalent ?? 0)} per bed |

So the proposition is simple: **we buy this every month and we would rather buy it from you.**

Three reasons we think buying beats donating, from your side as much as ours:

1. **An industries program with a paying customer survives a budget round.** One producing donations
   is a cost centre, and cost centres get cut.
2. **Trade revenue can pay participants properly**, rather than the program depending on a training
   budget to do it.
3. **It protects both organisations.** Product made for nothing and sold at full price is a story
   neither of us wants written, and paying a fair rate removes the question entirely.

**What Goods keeps:** sales, distribution, warranty and the customer relationship, which is the part
Corrections cannot do. **What Corrections keeps:** the training outcomes, the industry capability and
a revenue line for the unit.

---

## 6. What each side would provide

| Goods on Country | NT Corrective Services |
|---|---|
| Product design and specification | Facility, power and space |
| Equipment supply, installation and commissioning | Supervision and program staffing |
| Operator training and written procedures | Participant selection and support |
| Quality standards and inspection criteria | Day to day operation |
| Maintenance pathway, spares and consumables | Compliance, WHS and site induction |
| All sales, freight and distribution | Production to agreed specification |
| Purchase of output at agreed rates | |

---

## 7. Safety and compliance

The line involves a shredder, a heated press and a CNC router. In a correctional setting that carries
a compliance load beyond a normal workshop, and we would expect to work through it with you rather
than hand it over. The specific items:

- Machine guarding, isolation, and lockout and tagout procedures on the shredder and the router
- Fume extraction over the hot press, which runs at 180°C, and dust extraction on the router
- Hearing protection zoning around the shredder
- Tool control and accounting for the assembly station
- Written safe work method statements per station, which we would supply and you would adapt to
  your own requirements
- Operator competency sign-off before unsupervised running

---

## 8. Where this goes

Goods exists to move manufacturing onto Country and towards community ownership. We want to be
straight that a correctional facility is not the destination of that pathway, it is a bridge to it,
and we think that is what makes it worth doing rather than something to gloss over.

The version of this we would be proud of has two halves. Production and training capacity at Darwin
and Alice Springs, and a community facility waiting for people when they are released, so a skill
learned inside has somewhere to go. We already have four community pathways under way in the NT and
Queensland, and the thing they most lack is exactly the capability this would build.

If there is any budget that can follow a person out of the gate, that is the conversation we would
most like to have.

---

## 9. What we would need from you

1. The direct purchase threshold before this has to go to open tender, which decides the timeline.
2. What participants are paid for workshop labour, and whether that can be funded from trade revenue.
3. Floor space, available power and existing extraction at Darwin and Alice Springs.
4. Whether equipment installed in a facility can later be relocated, and who owns it.
5. What "competitive on selling products" means from your side, and what you are comparing against.
6. Whether any funding can follow a person into a community placement after release.

---

## 10. Sources

Equipment costs and running costs come from the Goods capital module model
(\`cost-model-scenarios.json\`, locked 2026-05-29), reconciled against supplier quotes and paid
invoices. The rates Goods pays for components today are from Defy Manufacturing invoices INV-1602,
INV-1731 and INV-1732. The bed price of ${money(750)} and the delivered examples are from the Goods
asset register. The Maningrida delivery of 40 Stretch Beds is invoice INV-0303, 18 May 2026.

Figures graded as estimates are marked. The equipment bands are planning figures and would be
replaced with firm vendor quotes before anything is committed.

*Generated from the Goods cost model. Regenerate with \`npx tsx ../tools/build-corrections-pack.ts\`.*
`;

const target = resolve(import.meta.dirname, '../deliverables/NT-Corrections-production-pack.md');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, doc);
console.log(`wrote ${target}`);
console.log(`  ${doc.split('\n').length} lines, ${INSIDE.length} stations`);
console.log(`  sales spread held out of the pack on purpose: $${SALES_SPREAD_PER_BED}/bed stays with Goods and community`);
