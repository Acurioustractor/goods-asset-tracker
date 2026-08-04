/**
 * The NT Corrections decision note: internal, for Ben, Nic and Defy.
 *
 * This is not the proposal. The proposal is the one-pager. This is the paper that
 * decides whether to send it, and it exists because the narrow scope changed what
 * the opportunity IS, and that change should be made deliberately rather than
 * absorbed quietly.
 *
 * THE CHANGE: in the two-station scope, NT Corrections is a SUPPLIER, not a
 * customer. The earlier framing had them answering the demand question, which is
 * the largest hole in the whole business model. They no longer do. This is a cost
 * and capability play and should be judged as one.
 *
 * THE PIVOT POINT: how many bed sets come out of one pressed panel. Every rate in
 * the comparison is invoiced, so the only unknown is yield, and it moves the answer
 * from a $23 saving to a $156 saving per bed. One question to Defy settles it, and
 * nothing else should move until it does.
 *
 * Usage, from v2/:  npx tsx ../tools/build-corrections-decision-note.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import scenarios from '../v2/src/lib/data/cost-model-scenarios.json';

const defy = scenarios.defy_verified_rates;
const capex = scenarios.capex_modules;
const physics = scenarios.physics;

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-AU');
const money2 = (n: number) => '$' + n.toFixed(2);

const KIT_TODAY = defy.bed_kit_cut_finished.amount; // 344.05, INV-1602 + INV-1732
const PANEL = defy.pre_pressed_panel_each.amount; // 200, INV-1731
const CUT_ONLY = defy.cut_and_finish_only.amount; // 121.00, INV-1602
const SHRED_KG = defy.hdpe_shred_per_kg.amount; // 2.00, INV-1731
const SHRED_BED = physics.hdpe_kg_per_bed * SHRED_KG; // 40

const shredKit = capex.modules.find((m) => m.key === 'shredding')!.capex_low ?? 0;
const pressKit = capex.modules.find((m) => m.key === 'pressing_cnc')!.capex_low ?? 0;
const stationSet = shredKit + pressKit;

/** Landed leg cost if we buy panels and pay to cut and finish, at a given yield. */
const landed = (bedsPerPanel: number) => PANEL / bedsPerPanel + CUT_ONLY;

const VOLUME = 500; // modelled planning rate, beds/yr/site

const doc = `# NT Corrections: decision note

**For: Ben, Nic, Defy. Internal. Not the proposal.**
*Prepared 2026-08-04, after the call with Bodie and the follow-up with Defy. Every rate is from a
paid Defy invoice. The one unknown is named in section 3 and it decides the rest.*

---

## 1. What is being decided

Whether to put a two-station production proposal to NT Correctional Industries, at what scope, on
whose paper, and where it sits against everything else competing for August. Five specific
decisions are listed in section 8.

---

## 2. What this opportunity actually is, now that the scope has narrowed

The first version of this idea had Corrections running the line through to finished beds, and
answering the demand question at the same time. The call with Defy narrowed it, correctly, to two
stations producing **inputs**: washing and shredding, and utility panel pressing.

**That change moves NT Corrections from the demand side to the supply side.**

It is worth being blunt about what that means. Goods is not short of ways to make a bed. Goods is
short of people who have agreed to buy one. This partnership does not touch that. It is a **cost and
capability play**, and judging it as a revenue play will lead to the wrong decision.

The separate question, whether NT Corrections might **buy** beds for its own facilities, is still
open and is worth its own conversation. Note they already list bedding manufacture among their
industries, which cuts both ways.

---

## 3. The number that decides everything: panel yield

Goods buys a cut and finished leg kit for **${money2(KIT_TODAY)}** per bed today. The alternative is
to buy a pressed panel from Corrections and pay to cut and finish it. Both halves of that are
invoiced rates, so the only unknown is **how many bed sets come out of one panel**.

| Bed sets per panel | Panel cost per bed | Plus cut and finish | Landed leg cost | Saving vs ${money2(KIT_TODAY)} | At ${VOLUME} beds/yr |
|---|---|---|---|---|---|
${[1, 2, 3]
  .map(
    (n) =>
      `| ${n} | ${money2(PANEL / n)} | ${money2(CUT_ONLY)} | **${money2(landed(n))}** | ${money2(
        KIT_TODAY - landed(n),
      )} | ${money((KIT_TODAY - landed(n)) * VOLUME)} |`,
  )
  .join('\n')}

**If one panel makes one bed set, this is not worth doing.** ${money2(
  KIT_TODAY - landed(1),
)} a bed does not justify a government procurement process, an advisory council, months of founder
time and a reputational exposure. If a panel makes two or more, it is a serious saving and worth
pursuing properly.

**This is one question to Defy and it should be answered before anything else moves.** A panel is
1200 × 1200 × 19mm, which is 1.44m². Two crossed X-trestles per bed is four planks. Whether that
nests at two sets a panel or one is a cutting-diagram question Defy can answer from experience.

*(The rough area estimate suggests two is plausible. That is an estimate from panel dimensions, not
a nesting diagram, and it is not good enough to decide on.)*

Shred, if that is all Corrections does, is worth **${money(SHRED_BED)} per bed's worth** at
${money2(SHRED_KG)}/kg. Real, but small.

---

## 4. The costs

**Equipment.** Shredder ${money(shredKit)}, pressing and CNC ${money(
  pressKit,
)}. About **${money(stationSet)} per station set**, and twice that if both Darwin and Alice. Goods
has $0 of signed capital today, so this is funded by Corrections, by Defy, or it waits for the raise.

**Founder time.** A proposal, an advisory council process, possibly an expression of interest,
training, specification and quality management. Months of attention. Ben's unpaid time is already the
$67,200 line that decides whether the business breaks even at two sites or three, so this is not free.

**Ongoing.** Quality control against specification, the relationship, and freight of shred or panels
to wherever the cutting happens.

---

## 5. The benefits

**Freight, which is the strongest one.** INV-0303 records ${money(
  5900,
)} to move beds Brisbane to Darwin to Maningrida. Producing the plastic component in Darwin or Alice
Springs largely removes that leg. Freight was the biggest unmodelled cost in the community model.

**A second supply route.** Today a single supplier in Sydney makes the only structural component
Goods cannot buy off a shelf. That is a single point of failure for the entire product.

**The skills pipeline**, which is the actual point rather than a benefit. Someone who has run a
primary recycling and remanufacturing line has exactly what a community production site needs.

**Local inputs.** Steel and canvas are already bought in Alice Springs. This brings the third input
home too.

**Credibility with government**, which matters for procurement generally.

---

## 6. The risks, ranked by what would actually hurt

**1. Reputational, and it is the one that could end the organisation.** The great majority of people
in NT prisons are Aboriginal. A social enterprise whose supply chain runs through that, selling at
$750, needs to be able to explain itself in one sentence to a journalist. Paying full cost helps, and
is now aligned with published policy, but it does not remove the need for that sentence.

**2. What community thinks, which nobody has asked.** Utopia, Oonchiumpa, Tennant Creek and Palm
Island may have family inside in Darwin or Alice Springs. That could be the most powerful part of
this, people making things for home, or it could be something communities want no part of. **Only
they can say. This should be treated as a gate, not a consultation.** Designing a community
ownership pathway and then routing production through a prison without asking would be a strange
inversion of the whole model.

**3. Scale and reach.** The beast risk. Reduced by the narrow scope, by choosing an input rather than
a product, and by the exclusivity clause. Worth knowing that published correctional industry policy
requires full cost recovery and forbids marginal costing, so the risk is capacity and reach rather
than being undercut on price.

**4. Supply dependency.** A lockdown, an incident or a policy change stops the line and stops Goods'
supply with it. This must never become the only route.

**5. Opportunity cost.** This is not on the QBE critical path. The raise turns on demand, the entity
migration and the COGS reclassification. If this consumes August, that is a real cost with a
deadline attached.

**6. Entity.** Goods trades through a sole trader. Government contracting wants an ABN, insurances
and WHS documentation. This is now a commercial blocker rather than an administrative one.

---

## 7. Watch-outs

- **Do not accept free product.** Their own policy language on not exploiting cheap labour supports
  paying properly. Free product is the version that looks generous and is actually dangerous.
- **Do not let scope creep to finished goods.** The panel is safe precisely because nobody can put it
  on a shelf.
- **Do not sign anything until the entity question is resolved.**
- **Do not promise the washing machine or anything beyond the bed.**
- **Have a fallback if exclusivity cannot be granted.** Government may be unable to give it. The
  fallback is a specification and quality bar only Goods and Defy can meet, plus a right of first
  refusal rather than exclusivity.

---

## 8. The decisions

| # | Decision | Options | Note |
|---|---|---|---|
| 1 | Counterparty | Goods, Defy, or joint | Defy prefers the panel comes through them as host of the scaled tech. That also puts the reputational exposure on their name, which cuts both ways. |
| 2 | Who funds equipment | Corrections, Defy, Goods, or wait for the raise | Goods has $0 signed capital. |
| 3 | Community consultation | Before sending, after sending, or not a gate | Recommendation: before, and treat it as a gate. |
| 4 | Pilot scope | Shred only, or shred plus panel | Shred only is safer and worth ${money(
  SHRED_BED,
)}/bed. Panel is where the money is, if the yield supports it. |
| 5 | Timing | Now, or after QBE closes 31 August | Depends on how much founder attention August can spare. |

---

## 9. Recommended sequence

1. **Ask Defy the yield question.** One question. It decides whether the rest is worth doing, and it
   costs nothing to ask.
2. **Ask one community what they think.** Oonchiumpa is the natural first, given the relationship and
   the Alice Springs proximity.
3. **Then send the one-pager**, if both answers are good.

**If the yield turns out to be one panel per bed set**, the recommendation flips: keep the
relationship warm, park the supply idea, and pursue NT Corrections as a **buyer** of beds instead,
which is where the actual gap in the business is.

---

*Rates: Defy invoices INV-1602, INV-1731, INV-1732. Freight: INV-0303. Equipment: Goods capital
module model. Policy: NT.GOV.AU "Correctional industries and private business"; NSW Corrective
Services Industries policy 6.1. Generated from the Goods cost model; regenerate with
\`npx tsx ../tools/build-corrections-decision-note.ts\`.*
`;

const target = resolve(import.meta.dirname, '../deliverables/NT-Corrections-decision-note.md');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, doc);
console.log(`wrote ${target}`);
console.log(`  pivot: panel yield. 1/panel saves ${money2(KIT_TODAY - landed(1))}/bed, 2/panel saves ${money2(KIT_TODAY - landed(2))}/bed`);
console.log(`  station set ${money(stationSet)}; shred alone ${money(SHRED_BED)}/bed`);
