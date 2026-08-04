# What we can actually make

*Plain answers to the production questions. Every figure computes from the locked cost model.
Generated 2026-08-04; regenerate rather than edit.*

---

## 7. Did we measure the 40-bed Maningrida run?

**Not on the workshop floor. But the invoice measured the money, and it checks out.**

INV-0303 records 40 Stretch Beds at $750 each, paid, with $5,900 of freight on the same invoice, routed Brisbane to Darwin to Maningrida. Reconstructing the run
against what the model says it should have cost:

| | Per bed | 40 beds |
|---|---|---|
| HDPE shred 20kg @ $2.75/kg (incl delivery) | $55.00 | $2,200 |
| Diesel (25L/day ÷ 5 beds press + CNC) | $15.00 | $600 |
| Labour ($400/day ÷ 5 beds) | $80.00 | $3,200 |
| Steel poles | $27.00 | $1,080 |
| Canvas | $93.50 | $3,740 |
| End caps + screws + bolts | $5.24 | $210 |
| **Direct** | **$275.74** | **$11,030** |
| Freight, actual from the invoice | $147.50 | $5,900 |
| **Total** | **$423.24** | **$16,930** |

Revenue was $30,000. So the run contributed **$326.76 a bed** against the **$324.26** the model predicts. The gap across forty beds is
under $100.

That is a real check and it passed. Two things follow.

**The costing is not guesswork.** It has now been tested against a paid invoice for a real delivery,
and it landed within a few dollars a bed.

**What remains unmeasured is the workshop floor**: operator hours, diesel litres and press yield.
Those do not change what this run earned. They change how confident we are that it repeats at
volume. One week of normal production with someone recording it settles it permanently. About
**$2,250**, five operator days and roughly 125 litres of diesel, and the beds still sell.

### What that week would actually move

| What it tests | Per bed | At 500 beds a year |
|---|---|---|
| Throughput 4 a day rather than 5 | $20.00 | $10,000 |
| Yield 80% rather than 100% | $13.75 | $6,875 |
| Diesel 8L a bed rather than 5 | $9.00 | $4,500 |
| **All three against us** | **$42.75** | **$21,375** |
| All three in our favour | $-22.96 | $-11,481 |

So the whole exposure is about **$42.75 a bed** in the worst case. Worth closing, not worth losing sleep over.

**And the ranking is not the one people assume.** Everyone worries about yield. Yield is the
smallest of the three. **Beds per operator day is what the week should above all count.**

---

## The thing this uncovered: freight is a third of the cost

$150.00 of the $425.74 is long-haul freight. That is **35% of the marginal cost of a bed**, and more than the plastic, the diesel and the labour put
together. It has never been on the list of things we worry about.

The Maningrida invoice validates it almost exactly: $5,900 across 40 beds is
$147.50 a bed, against the $150.00 the model assumes. That makes it one of the best-evidenced inputs we have, and nobody put it
there deliberately.

**Why it matters beyond the costing:** anything that moves production closer to the communities we
deliver to attacks a bigger number than any manufacturing saving we have found. Producing the
plastic component in Alice Springs or Darwin is worth more than the margin on the component itself.

---

## An open disagreement, worth $20.00 a bed

The model does not agree with itself about beds per operator day, which is the single most sensitive
input in the whole costing:

- The working defaults say **5 beds a day**.
- The factory build state says **4 beds a day**.
- The labour line inside that same build state divides by **5**.

At 5 a day the marginal cost is **$425.74**, which is the figure quoted externally and in the workbook. At 4 a day it is **$445.74**.

This is written down rather than quietly corrected, because nobody knows which is right and the
Maningrida run cannot settle it: that run was never timed. It is resolved by
**the measured production week**, owned by **Ben + production lead**.
A guard in the codebase fails if the disagreement changes shape, so it cannot be resolved by
accident.

---

*Sources: locked cost model (`cost-model-scenarios.json`, v6, 2026-05-29); Defy invoices INV-1602,
INV-1731, INV-1732; Maningrida delivery invoice INV-0303, 18 May 2026. Generated from the model;
regenerate with `npx tsx ../tools/build-what-we-can-make.ts`.*
