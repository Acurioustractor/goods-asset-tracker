# The four applications, and how they fit together

Built 11 September 2026. Five Notion pages under Goods. HQ.

| Page | Notion |
|---|---|
| QBE Stage 2, the submission pack | `3d8ebcf981cf8152a7d9fb114e39e2ef` |
| Brian M. Davis, the application | `3d8ebcf981cf81dbb2defb430458ea50` |
| Tim Fairfax, the three-year application | `3d8ebcf981cf81c9ada9c61eabed022a` |
| SEFA Backing the Bold, the loan | `3d8ebcf981cf8147aef9c629e6107483` |
| The capital stack, and how it flexes | `3d8ebcf981cf81adab03e68bc9ed29d3` |

## The correction that changes the work

**Backing the Bold is SEFA's and it is debt.** It has been referred to as a CIFA grant. From the
21 August meeting with Joel Bird: $50,000 to $200,000 of debt capital for impact-led organisations
with traction, Queensland focused. SEFA also runs a CFA Loan Fund at $200,000 to $2M, and CFA is
probably what came through as CIFA.

A grant asks what the money achieves. Debt asks whether the money generates enough to repay itself.
Writing it as a grant application would not answer the question SEFA is asking.

**The loan can now be sized.** The 10 September ruling was to size it to the press and working
capital and wait, because the press was unpriced. It is now $22,500, and working capital is $276 a
bed. A first ask of $50,000 to $100,000 sits inside the programme band, and 101 paid beds a year
services $200,000 at the $474 a bed.

## Why they are not interchangeable

QBE buys plants. Tim Fairfax buys the organisation. Brian M. Davis buys beds and facilitation.
SEFA lends. Treating them as one pool is what produced the $99,500 double count on Tim Fairfax.

A grant funder will not buy a press. A lender will, because a press produces the cash that repays
it. That is the cleanest division of labour across the four.

## The arithmetic that was hiding

The operating line is $197,550 short and the gap is $147,950. The $49,600 difference is not an
error and is now stated on the stack page.

**Beds are bought at $750 and cost $276 to make.** $160,000 of bed money over-covers the $110,400
making line by $49,600, and that surplus carries the organisation. It is the $474 doing its job,
seen from the other end. `capital-stack-flex.ts` computes it rather than asserting it, and a guard
fails if the two ends stop agreeing.

## Plant money behaves differently

A plant costs $150,000 and a plant grant brings $150,000, so plant money never leaves a hole and
never fills one. The gap only moves when new plant money lands on a plant somebody else was already
funding.

That is exactly the second Commonwealth $150,000. On Palm Island or Maningrida it closes the gap
and must be declared at Q14 and Q15. On a third site the application is untouched.

## The ladder, for a funder we have not met

$750 one bed · $7,500 ten beds · $10,000 facilitation in one community · $22,500 the second press ·
$75,000 a hundred-bed pool · $150,000 one plant · $300,000 two plants.

Every rung is a real unit with a real price. Nothing is a share of a total, and a guard enforces
that.

## What is not built

The deck rebuild. Three plates are drawn and none is in Pencil. Slides get built one at a time.
