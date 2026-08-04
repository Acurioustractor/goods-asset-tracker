/**
 * The NT Corrections one-pager: the narrow-scope proposal.
 *
 * WHY THIS REPLACED THE LONGER PACK
 * ---------------------------------
 * The first pack was built on the wrong constraint. It read "they cannot sell" as
 * the binding fact and proposed Corrections run the whole line through to finished
 * beds. The real risk runs the other way: NTCI has scale and government backing, and
 * a broad scope creates a producer that competes with the community enterprises Goods
 * exists to build. Defy's phrase for it was creating a beast that ends up eating us.
 *
 * So the scope here is deliberately narrow: TWO stations, washing and shredding, and
 * utility panel pressing. Both produce inputs rather than products. Neither produces
 * anything a community or a retailer buys. CNC is named as a possible downstream
 * service, not as part of the ask.
 *
 * THE UTILITY PANEL IS THE SAFE UNIT. It is structurally consistent, clean and free
 * of contaminants, with no aesthetic demand, and it is not a product available on the
 * open market. That means it cannot easily be diverted into retail, which is the
 * failure mode being designed against (the Bunnings scenario).
 *
 * WHY EXCLUSIVITY IS ASKABLE. Government avoids commercial exclusivity because of
 * corruption policy. But NTCI's own position, per the Commissioner in 2016, is that
 * it stops work it believes competes with local business. So the clause is not a
 * favour being requested, it is a limit they already claim to observe, written down
 * so that a local Aboriginal enterprise is protected by it.
 *
 * Every rate here is from a paid invoice. Nothing is modelled.
 *
 * Usage, from v2/:  npx tsx ../tools/build-corrections-onepager.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import scenarios from '../v2/src/lib/data/cost-model-scenarios.json';

const defy = scenarios.defy_verified_rates;
const capex = scenarios.capex_modules;
const physics = scenarios.physics;

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-AU');
const shredPerKg = defy.hdpe_shred_per_kg.amount; // 2.00, INV-1731
const panelEach = defy.pre_pressed_panel_each.amount; // 200, INV-1731
const shredPerBed = physics.hdpe_kg_per_bed * shredPerKg; // 40

const shredKit = capex.modules.find((m) => m.key === 'shredding')!;
const pressKit = capex.modules.find((m) => m.key === 'pressing_cnc')!;

const doc = `# A production partnership with NT Correctional Industries

**Goods on Country · Defy Manufacturing · NT Correctional Industries**
*Draft for discussion. Not a tender response. ${'Every rate below is from a paid invoice.'}*

---

## What we are proposing

Two stations inside a correctional facility, producing **inputs to a manufacturing process**,
sold exclusively back to Goods on Country and Defy Manufacturing.

**Station 1 · Washing and shredding.** Post-consumer HDPE is sorted, washed to remove
contaminants, and shredded to a consistent flake. Output: clean HDPE shred.

**Station 2 · Utility panel pressing.** Shred is heat-pressed into a flat panel. A utility panel
is structurally consistent, clean and free of contaminants, without the aesthetic demands of an
architectural surface. Output: a pressed utility panel, ${'1200 × 1200 × 19mm'}.

Optionally, and later, **CNC cutting** as a downstream service.

That is the whole scope. We are deliberately not proposing that the facility assemble or produce
finished goods, for reasons set out below.

---

## What it is worth

Goods and Defy buy both of these today. The rates are not estimates:

| Output | Current rate | Source |
|---|---|---|
| Clean HDPE shred | **$${shredPerKg.toFixed(2)} per kg** (${money(shredPerBed)} per bed's worth at ${physics.hdpe_kg_per_bed}kg) | Defy invoice INV-1731 |
| Pressed utility panel | **${money(panelEach)} each** | Defy invoice INV-1731, 20 panels bulk |

There is an existing, continuing demand for both. This is not a program hoping to find a customer.

---

## The commercial condition

**Panels and shred produced by the facility are sold exclusively to Goods on Country and Defy
Manufacturing, and are not sold to any other retailer or manufacturer.**

We ask for this openly and we think it serves NTCI as much as us.

NT Correctional Industries states that its partnerships exist to grow local capacity and compete
with **interstate and overseas** suppliers. That is precisely this case: the panel component of our
product is currently made in **Sydney**, 3,000km away. This partnership replaces an interstate
supplier, not a Territory one.

The exclusivity clause is what keeps it that way. Without it, a government-backed facility operating
at scale could displace the very community enterprises this program is meant to feed people into,
including Aboriginal-owned operations in Alice Springs. NTCI's own stated position is that it steps
back from work that competes with local business. This clause simply writes that commitment into
the arrangement so both parties can rely on it.

There is precedent in other jurisdictions for exactly this structure: NSW correctional industries
fabricating for Street Furniture Australia, and Queensland producing for Street Swags. In both,
exclusive supply back to a single partner funded the training and the facility.

---

## Why this scope, and not a wider one

The utility panel is chosen because it is **an input, not a product**. It is not sold in retail, it
has no consumer market, and it is not a thing anyone can put on a shelf. That makes the scope
self-limiting in a way a finished-goods scope would not be.

Goods exists to move manufacturing onto Country and into community ownership. If a correctional
facility became a major independent producer and seller, it would reverse that purpose rather than
serve it. We would rather say that plainly at the start than discover it later.

Assembly work is possible in principle, but only on a subcontract basis where the facility works to
the order of Goods or Defy rather than producing on its own account.

---

## What the facility gains

**Certified, transferable skills**, which is the point rather than a by-product:

- **Washing and shredding:** industrial machine operation, guarding and isolation, lockout and
  tagout, contamination control, routine maintenance, output quality checks.
- **Panel pressing:** heat press operation and temperature control, measurement and tolerance,
  material handling, finishing and inspection.

These map onto real jobs in recycling and resource recovery, plastics fabrication, machine
operation and plant maintenance. Major recyclers recognise this pathway, and someone leaving the
facility can say they have run a primary recycling and remanufacturing line.

**Environmental outcome:** ${physics.hdpe_kg_per_bed}kg of HDPE diverted from landfill for every
bed's worth of material processed, with the finished product going to remote communities.

---

## What Goods and Defy provide

Equipment specification, supply and commissioning. Operator training and written procedures.
Quality standards and inspection criteria. Maintenance pathway, spares and consumables. A standing
purchase arrangement for the output. All sales, freight and distribution.

Indicative equipment cost, subject to walking the space and to firm vendor quotes:

| Station | Equipment |
|---|---|
| Washing and shredding | ${money(shredKit.capex_low ?? 0)} |
| Pressing | within ${money(pressKit.capex_low ?? 0)} for press, CNC and finishing together |

A facility with an existing workshop, three-phase power and extraction needs materially less than a
greenfield site. We would want to see the space before putting a number on it.

---

## What we suggest first

**A pilot at Alice Springs.** Tight scope, one station or two, a fixed quantity, and a review before
anything expands. Alice is the natural place to start: two of the three material inputs for our
product, the steel and the canvas, are already bought there, and the communities we serve are close.

---

## What we need to know from you

1. The direct-purchase threshold before this must go to open tender.
2. Whether the Correctional Industries Advisory Council must approve a new venture of this kind, and
   what that process involves.
3. What participants are paid, and whether that can be funded from trade revenue.
4. Floor space, available power and existing extraction at Alice Springs and Darwin.
5. Whether an exclusive supply arrangement can be written into a contract, and in what form.
6. Whether any funding can follow a person into a community placement after release.

That last question is the one we care most about. Skills learned inside are worth most when there is
somewhere for them to go, and we have four community pathways under way in the NT and Queensland
that need exactly this capability.

---

*Prepared by Goods on Country with Defy Manufacturing. Rates from Defy invoices INV-1602, INV-1731
and INV-1732. Generated from the Goods cost model; regenerate with
\`npx tsx ../tools/build-corrections-onepager.ts\`.*
`;

const target = resolve(import.meta.dirname, '../deliverables/NT-Corrections-one-pager.md');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, doc);
console.log(`wrote ${target}`);
console.log(`  scope: 2 stations (wash+shred, panel press). Assembly and finished goods excluded on purpose.`);
console.log(`  rates: shred ${money(shredPerKg)}/kg, panel ${money(panelEach)} each, both INV-1731`);
