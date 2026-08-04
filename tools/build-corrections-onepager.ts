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
 * WHY EXCLUSIVITY IS ASKABLE. Confirmed from primary sources 2026-08-04, after an
 * earlier pass that had to rely on search summaries because every NT government
 * domain 403s. The NT page was recovered from the Wayback Machine (snapshot
 * 2025-04-07) and the NSW policy PDF was extracted with pdftotext.
 *
 * NT.GOV.AU, verbatim: "NT Correctional Industries is looking for opportunities to
 * partner with local private businesses. This includes opportunities to grow local
 * capacity and compete with interstate and overseas suppliers." And: "The
 * Correctional Industries Advisory Council monitors the development and operation of
 * Correctional Industries projects to ensure that they function prudently and
 * sensitively in parallel with private sector businesses."
 *
 * So the non-competition principle is not something we are asking them to adopt. It
 * is the Advisory Council's stated job, and the Council includes peak employer
 * bodies, Unions NT, training organisations and the Chamber of Commerce.
 *
 * NSW CSI POLICY 6.1 gives the vocabulary and, unexpectedly, answers the undercutting
 * fear directly: "Corrective Services Industries will avoid marginal costing" and
 * "Corrective Services Industries is not exploiting 'cheap labour'... will only be
 * accepted if CSI both recovers its full cost." A correctional industry that must
 * recover full cost is not structurally able to undercut on price. It also names the
 * five levels of private sector involvement, and requires an INDUSTRY IMPACT
 * STATEMENT endorsed by its consultative council. This proposal is Level 3,
 * subcontract work on a continuing basis, and offers the impact statement up front.
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
including Aboriginal-owned operations in Alice Springs.

We understand this sits alongside an existing safeguard rather than replacing it. The Correctional
Industries Advisory Council already exists, in NT.GOV.AU's words, to ensure Correctional Industries
projects "function prudently and sensitively in parallel with private sector businesses". The clause
we are proposing is that principle written into a single arrangement, so both parties can rely on it
without returning to the Council every time the question arises.

There is precedent in other jurisdictions for exactly this structure: NSW correctional industries
fabricating for Street Furniture Australia, and Queensland producing for Street Swags. In both,
exclusive supply back to a single partner funded the training and the facility.

---

## How we think this fits the framework

We have looked at how correctional industries structure private sector work, and we would put this
proposal in the most conventional category rather than asking for something unusual.

**This is subcontract work on a continuing basis.** In the NSW policy that is a Level 3 arrangement,
the middle of five levels, well short of a private operator managing a business unit. Goods and Defy
supply the specification, the equipment and the offtake. The facility runs the work. We are not
seeking to manage or staff anything, and we are not seeking access to public assets below commercial
terms.

**We expect to pay full cost, and we would rather you did not discount.** We understand correctional
industries are required to recover full cost and to avoid marginal costing. That suits us: a rate
that reflects the real cost of the work is what makes the arrangement durable, and it is what keeps
the program from being read as cheap labour by anyone looking at it later. We would rather pay
properly and have this survive scrutiny than pay less and have it questioned.

**We will provide an industry impact statement.** We understand a proposal of this kind is expected
to set out its likely effect on other Australian businesses. We would rather write that early and
honestly than have it requested. Our short version: the component in question is currently made
interstate, no Territory business currently supplies it, and the exclusivity clause is designed
specifically to protect emerging Aboriginal-owned enterprises in Central Australia from being
displaced.

**Term.** We would suggest a pilot, then a two year term with a two year option, which we understand
is the usual shape.

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

1. Whether an unsolicited proposal is the right pathway here, or whether this needs to go through an
   expression of interest process.
2. What the Correctional Industries Advisory Council requires from us, and whether an industry impact
   statement should be prepared for it before anything else proceeds.
3. What participants are paid, and whether that can be funded from trade revenue.
4. Floor space, available power and existing extraction at Alice Springs and Darwin.
5. Whether an exclusive supply arrangement can be written into a contract, and in what form.
6. NTCI already lists bedding manufacture among its industries. We would want to understand what that
   covers before proposing anything adjacent to it.
7. Whether any funding can follow a person into a community placement after release.

That last question is the one we care most about. Skills learned inside are worth most when there is
somewhere for them to go, and we have four community pathways under way in the NT and Queensland
that need exactly this capability.

---

*Prepared by Goods on Country with Defy Manufacturing. Rates from Defy invoices INV-1602, INV-1731
and INV-1732. Policy references: NT.GOV.AU, "Correctional industries and private business"; NSW
Corrective Services Industries policy 6.1, "Private Sector Correctional Industry Programs".
Generated from the Goods cost model; regenerate with
\`npx tsx ../tools/build-corrections-onepager.ts\`.*
`;

const target = resolve(import.meta.dirname, '../deliverables/NT-Corrections-one-pager.md');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, doc);
console.log(`wrote ${target}`);
console.log(`  scope: 2 stations (wash+shred, panel press). Assembly and finished goods excluded on purpose.`);
console.log(`  rates: shred ${money(shredPerKg)}/kg, panel ${money(panelEach)} each, both INV-1731`);
