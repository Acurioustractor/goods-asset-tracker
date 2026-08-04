# What does a site cost to run for a year?

**One number. Three answers. Half an hour to settle.**
*For Ben and Nic. Generated from the cost model. Nothing here is a recommendation you have to take,
but the middle column is what each choice does to the number we give investors.*

---

## Why this is the only thing blocking the model

The Goods on Country cost model is three numbers:

1. **Per bed: $425.74.** Settled, and checked against the Maningrida invoice.
2. **Per site, per year: not agreed.** ← everything below
3. **Once, for the whole company: $229,700.** Network $109,500, company overhead $53,000, founder non-production $67,200.

A site earns $129,042 a year before its own running costs. So the number of sites
we need is $229,700 divided by whatever is left after those running costs.

| If a site costs this to run | A site clears | Sites needed to break even |
|---|---|---|
| $15,000 (Matt's projection, at scale) | $114,042 | **2.0** |
| $48,333 (our MODEL tab) | $80,709 | **2.8** |
| $64,333 (detailed, less the double count) | $64,709 | **3.5** |
| $79,333 (our module allocation) | $49,709 | **4.6** |

**Two sites or five sites**, on the same product, the same price and the same fixed costs. That is
the whole problem, and it is why the modelling has felt arbitrary. It is not the arithmetic. This
one input was never settled, so every document was built on a different one.

---

## Question 1. What is a site's rent?

**In circulation:** $12,000 in the detailed build-up, $30,000 in the headline model.

The $30,000 is half of the Kirmos facility on the Sunshine Coast. An on-Country site is not
Kirmos. It might be a shed a community already has, a yard, or a container on a pad.

| Option | Per site per year | Effect on sites needed |
|---|---|---|
| Community supplies the space | $0 | 2.1 |
| A modest yard and shed | $12,000 | 2.3 |
| Kirmos-equivalent | $30,000 | 2.8 |

**Worth knowing before you answer:** Tennant Creek already has a shed. If most on-Country sites come
with a space, carrying Kirmos rent on every one of them overstates the cost of the model we are
actually building.

**Decision:** ________________________

---

## Question 2. Where does site admin sit?

**This one is a straight double count.** Administration is charged twice:

- $14,700 of admin sits in the $109,500 network block.
- $15,000 of "administration, accounting and IT" sits in the site floor, on top.

Same function, counted in two places. It cannot be both.

| Option | Effect |
|---|---|
| Admin is central, done once for all sites | Remove $15,000 from every site |
| Admin is per site | Remove $14,700 from the network block |
| Some of each | Split it, and write down the split |

**My read:** invoicing, BAS and board reporting genuinely happen once, centrally. A site needs
someone to keep a production log, not a bookkeeper. But there is a real answer here that depends on
how you intend to run sites, and only you two know that.

**Decision:** ________________________

---

## Question 3. How is machine upkeep charged?

**In circulation:** $18,333 flat per site, or 5% of that site's equipment, which is what both Matt's model and the module tab
use.

5% works out very differently depending on the scope:

| Basis | Equipment value | 5% per year |
|---|---|---|
| Modules we already run (MVF) | $71,217 | $3,561 |
| Turnkey fitted workshop | $167,000 | $8,350 |
| Flat, as the headline model has it | n/a | $18,333 |

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

**And Utopia's answer settles.** The shredder-only pathway currently reads minus $33,043 a year. Part of that is a real gap and part of it is a flat machine-upkeep charge and a Kirmos
rent line that a homelands site would never carry. Which part is which depends entirely on the three
answers above, and Utopia deserves the right number before anyone talks to them about it.

---

*Generated from `cost-model-scenarios.json`. Regenerate with
`npx tsx ../tools/build-site-cost-decision.ts`.*
