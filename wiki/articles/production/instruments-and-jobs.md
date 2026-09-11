---
reviewed: 2026-09-12
ruling: Ben 8 Sep 2026 · a community's own resale proceeds repay nothing · with Ben 11 Sep 2026 · every dollar carries a job
canon: [plant.count, plant.allowance, plant.secondPress, year.beds, year.poolSize, year.facilitationEach, year.facilitation, year.running, year.breakEvenBeds, year.needs, year.asked, year.secured, year.gap, year.bedsUnfunded, year.bedsUnfundedAud, bed.price, bed.contribution, bed.costStatus]
sources: [v2/src/lib/data/capital-stack-flex.ts:24-265, v2/src/lib/data/the-year-and-the-raise.ts:20-110, v2/src/lib/data/community-loop.ts:104-135, v2/src/lib/data/production-scenarios.ts:28 and 76-99, v2/src/lib/data/defy-supply.ts:60-75, v2/src/lib/data/sheet-canon.ts:55-115]
---

# Instruments and jobs

> The money model already types the two halves of this question separately. `capital-stack-flex.ts`
> declares four jobs (plant · beds · facilitation · operating) and three instruments (grant · loan ·
> government), and every funder in the raise carries one of each. What nothing does yet is say which
> instrument may do which job. A grant buys gifted first stock and plant. A loan buys plant and
> stock a buyer has ordered. Retained margin carries the organisation. A community's own resale
> proceeds repay nobody, which Ben ruled on 8 September. Those four sentences are a rule, and until
> a guard holds them they are a habit. The $99,500 Tim Fairfax double count is what a wrong pairing
> costs, and the $22,500 second press is the job that does not exist.

## Four jobs, three instruments, no rule between them

The types are already in the code:

```ts
export type Job = 'plant' | 'beds' | 'facilitation' | 'operating';
export type Instrument = 'grant' | 'loan' | 'government';
```

Every `Source` in the raise carries a job, an instrument and a stage. QBE's $300,000 is a grant on
plant. Tim Fairfax's first $100,000 is a grant on operating. Brian M. Davis splits one $100,000
invitation across beds and facilitation on purpose. SEFA is a loan, and it is the only loan.

The two fields are independent and nothing checks the pair. A loan could be typed against
facilitation and the module would build, the guards would pass, and the number would print.

## The rule

**A grant buys gifted first stock and plant.** A bed that is given away returns no cash to anyone,
so there is nothing to repay it with. The year plans 400 beds of first stock in four pools of 100,
and a community decides how many of its pool it sells and how many it gives. Facilitation money
behaves the same way, at $10,000 a community and $40,000 across the four. Two plants at the
$150,000 allowance are the same case: a plant earns nothing until a community is trading, and no
community enterprise is trading yet.

**A loan buys plant and stock a buyer has ordered.** Debt carries a repayment test that a grant does
not carry, and Joel Bird put the test plainly on 21 August: does the capital drive enough growth to
repay it. Stock with a named buyer behind it passes that test. At the provisional $474 a bed hands
to the organisation, about 101 paid beds a year service $200,000 of debt, which is inside one
plant's output. The word provisional belongs in that sentence, because canon labels the current
route "Provisional: bought legs and tab production need costing" until the bought leg panel yield is
counted.

**Retained margin carries the organisation.** Running the organisation costs $297,550 a year. At the
provisional contribution, 628 paid beds a year cover it with no grant at all, so break-even is
provisional too. The year plans 400, which is why an operating grant is in the raise at all.

**A community's own resale proceeds repay nothing.** When a community sells beds from its own pool,
that money stays where it was earned and decides what comes next there: more beds, a module, a
shredder, a press. The loop in `community-loop.ts` says it in one line, that the return arrow stays
inside the community and never goes back to the funder. Any instrument whose repayment source is a
community's sales is the wrong instrument, whatever it is called.

## What a wrong pairing looks like

The funding schedule in the workbook had seven rows carrying an amount, a receipt month and a
stage. None of them said what the money was for. With no job on a dollar, Tim Fairfax's year-one
$100,000 was counted against beds and against operating at the same time, and $99,500 of the
published error came from that one line. Katie Norman's invitation names the resilience of
organisations, so that grant sits on the operating line alone.

The double count is what happens when a schedule has an instrument column and no job column, and
it is the reason the job is now typed.

## The press with no job

A second press costs $22,500. It is cross-guarded across three modules, it is quoted by nobody, and
it sits in no ask. The reason it has no home is structural: the four jobs are plant, beds,
facilitation and operating, and a press installed at a site that already exists is none of them.

Check it against each job in turn. The $150,000 allowance builds a new community plant, and this is
a machine at Witta. Stock money buys beds, and a press makes no bed on its own. Facilitation bills
at $10,000 a community for trips and build days. Running cost pays for a year, and a press lasts
years. So the press falls out of the model, and a $22,500 decision that moves dispatch from 96 kits
a month toward the router ceiling has sat in nobody's ask since the deck was built.

The fix is a fifth job for capital at an existing site. The instrument is already chosen: Ben ruled
on 10 September that the loan is sized to the press plus working capital, and SEFA's Backing the
Bold lends $50,000 to $200,000 into exactly that case. A press pays back through beds a buyer has
ordered. What is missing is the job, so the press appears in no total anybody is asked for. See
[[production/the-second-press]].

## Why the pairing question is live this month

Jay's steer on QBE 2026 is that corporate philanthropy is there to unlock debt or equity. The year
needs $747,950, the $600,000 asked across five lines is 100% philanthropy, $0 is secured, and the
gap is $147,950. One sent loan application changes the shape of that raise more than any wording
change to a grant application will.

The SEFA EOI is drafted and unsent, and the Queensland stream is open with rolling acceptance. It
asks for four years of EBITDA and the percentage of revenue that comes from trade, which forces the
entity question into the open: The Butterfly Movement Ltd is applicant and recipient under ruling
AA, its FY26 EBITDA is about negative $42,854, and the trading entity sits near positive $168,000.
Debt has to sit where the revenue is, and naming that is a board decision held by Ben, Nic and
Joel.

## Making it a rule

Three small pieces of code would hold the four sentences above:

1. A table of allowed pairings, job by instrument, with a reason on each refusal.
2. A guard that fails any `Source` whose instrument cannot do its job, the way the year module
   already guards the double count.
3. A fifth job, capital at an existing site, so the second press has somewhere to sit and shows up
   in a total that somebody is asked for.

The beds line is where this pays first. 187 of the 400 beds are unfunded, which is $140,250 of
stock at the $750 price, and it is the only ask with a product at the end of it. Whether that
$140,250 is grant money or borrowed money changes what has to be true about the buyer, and the
model should refuse to let anyone answer that by habit.

Related: [[production/order-to-slot]] · [[production/what-a-funder-sees]] ·
[[production/supply-and-defy]] · [[capital/the-money-model]] · [[capital/capital-stack]] ·
[[capital/capital-types]] · [[investors/tim-fairfax]]
