---
reviewed: 2026-09-12
ruling: Ben 12 Sep 2026 the flat-pack route; ruling V 1 Aug 2026 the catalytic reading; ruling X 28 Aug 2026 one operating home
canon: [bed.price, bed.make, bed.contribution, bed.contribution.goodsFreight, bed.freight, bed.pressedKg, line.pressPerDay, line.runDaysPerMonth, line.bedsPerMonth, line.bedsPerMonthLifted, line.wittaPerYear, line.pressedSheetsPerKit, year.needs, year.running, year.asked, year.secured, year.gap, year.beds, year.bedsUnfunded, year.bedsUnfundedAud, year.breakEvenBeds, plant.count, plant.allowance, trade.bedsPaid, trade.paidNet]
sources: [v2/src/lib/data/the-year-and-the-raise.ts:98, v2/src/lib/data/production-route.ts:1-24, v2/src/lib/data/production-scenarios.ts:88-96, v2/src/lib/data/demand-and-buyers.ts:381-402, v2/src/lib/data/demand-and-buyers.ts:459-466, v2/src/lib/data/demand-and-buyers.ts:552-557, v2/src/lib/data/who-has-asked.ts:23-32, v2/src/lib/data/bed-need-and-order.ts:182-195, v2/src/lib/data/impact-model.ts:183-218, v2/src/lib/data/sheet-canon.ts:62, v2/src/lib/data/loi-pipeline.ts:110, v2/src/lib/data/community-canonical.ts:153-156, v2/src/lib/data/defy-supply.ts:20-63, DECISIONS.md:22-30, DECISIONS.md:34-50, DECISIONS.md:149-227, deliverables/qbe-stage2/backwards-pass-2026-09-11.md:44, deliverables/qbe-stage2/deck-alignment-2026-09-11.md:37-136, deliverables/qbe-stage2/chatgpt-session-review-2026-09-11.md:20-46]
supersedes: []
---

# What we no longer say

> Nine articles in this wiki still told funders that QBE matches our raise dollar for dollar, months after ruling V retired that on 1 August 2026. Nothing anywhere could tell you which ones, because retiring a figure was an argument in a session and never a step in the work. This page is the step. Every row below holds one thing we have stopped saying, where it still appears today, what replaced it and the ruling that did it. Rule 14 in `wiki/AGENTS.md` makes an entry here part of the edit: when a ruling retires a figure or a phrase, change the article and add the row here the same day.

## How a row gets added

1. A ruling retires something. Write the row here first, while the reasoning is still in front of you.
2. Grep for the retired thing across `v2/src`, `wiki/articles`, `CONTEXT.md`, `STRATEGY.md` and the deck. Put what you find in the second column with file and line.
3. Fix the guarded module, then the public surfaces, then the wiki.
4. Leave the retired figure visible in the module that records the correction. A deleted figure comes back. A figure with a note on it does not.

If you cannot find the ruling behind a retirement, write "ruling not located" in that row. An invented ruling is worse than an honest gap.

## The money

| We no longer say | Where it still appears | What we say now | Ruling and date |
|---|---|---|---|
| The year needs $937,550 | Held at `the-year-and-the-raise.ts:98` as the record of the correction. No deck slide carried a year total or a gap, so nothing else had to move. | The year needs $747,950. $600,000 is asked across five lines, $0 is secured, and the gap is $147,950. 187 beds are unfunded, being $140,250. | Price model, Ben, 9 September 2026. Corrected 11 September 2026. The $937,550 added 400 beds at $750 on top of the full $297,550 of running cost. A bed at $750 pays its own $276 of making and hands $474 back, so running cost was charged twice and the overlap of $189,600 was counted in both places. |
| Tim Fairfax pays for beds and for the organisation | Fixed on three deck frames on 11 September, `TiKvy` S15, `F93w1o` S16 and `tVcLc` S18. The funding schedule in the live workbook still has no job column, which is how it happened. | Tim Fairfax sits on the operating line alone. QBE buys plants, Brian M. Davis buys beds and facilitation, SEFA lends. A funder appears twice only when the split is deliberate. | Corrected 11 September 2026. Katie Norman's invitation names the resilience of organisations. The double count overstated the year by $99,500. |
| Break-even is 796 beds when Goods carries freight | 796 is a workbook figure and was computed on the $100 factory leg of freight alone. | 918 beds, because freight is $150 all up and the contribution with Goods carrying it is $324. The printed break-even stays 628 beds, because under the price model the buyer pays freight at cost on its own line. Both figures derive from the provisional $474, so both are provisional. | Freight ruling, `demand-and-buyers.ts:552-557`, on the price model Ben set 9 September 2026. |
| QBE matches the raise dollar for dollar, and we are raising $400,000 | `CONTEXT.md:60` still carries the locked 21 July 2026 raise answer word for word. Five wiki articles still describe up to $400,000 as match-contingent: `investors/qbe-foundation.md:15`, `:25` and `:42`, `capital/funder-register.md:41`, `enterprise/10-investors-capital-raising.md:27`, `program/qbe-catalysing-impact-2026.md:14` and `:58`, `program/program-structure.md:26`. `capital/capital-stack.md` was rewritten on 12 September and now retires it by name at its own "What this replaces". The corrected reading is guarded at `loi-pipeline.ts:110`. | The grant is catalytic and discretionary. One pool of up to $1.1 million is shared across ten enterprises. We ask $300,000 for two community plants at $150,000 each, closing Friday 25 September 2026 at noon. The grant must be at least matched by signed external commitments, which is a coverage test on whatever QBE decides to give. Raising money creates no obligation on QBE. | Ruling V, Ben, 1 August 2026. |

## The trade

| We no longer say | Where it still appears | What we say now | Ruling and date |
|---|---|---|---|
| ALIVE paid $75,000 for 100 beds | Deck node `TiKvy` on S15 was changed on 11 September. Five files under `deliverables/finance/goods-financial-plan/` still open the year on ALIVE's $75,000, including `goods-money-map.html:200`, `goods-model.html:346`, `goods-qbe-review.html:77` and `WORKED-OUT-2026-09-09.md:108`. | ALIVE National Centre at the University of Melbourne paid $101,200 including GST, $92,000 net, on INV-0342, settled 20 August 2026: 100 Stretch Beds at $800 plus four half-share workshops at $3,000. The $75,000 was never on an invoice. ALIVE is a paid institutional buyer. INV-0341, $66,000 including GST for a storytelling programme, is authorised and unpaid, due 30 July 2026. | Read against Xero 11 September 2026, `deck-alignment-2026-09-11.md:37-41`. Ruling not located for a separate director sign-off. |
| Centrecorp bought 130 beds, paid and delivered | S11 printed it five times and S12 once. All six were changed on 11 September. `CENTRECORP_QUOTED_UNPAID = 130` is kept at `demand-and-buyers.ts:462` so the quote stays visible as a quote. | Centrecorp bought and paid for 167 beds: INV-0259 for 60 Basket Beds and INV-0291 for 107 Stretch Beds. 147 are deployed and 20 are made and waiting at Alice Springs. Quote QU-0014 for 130 beds, May 2026, was never paid. Centrecorp's beds are delivered and they are never counted as demand. | Ben, 11 September 2026. |
| Suncorp is one of our institutional buyers | It came out of the 11 September pitch-session transcript and is almost certainly Centrecorp, misheard by the voice model. It never reached a slide. | Four organisations have paid: Centrecorp, ALIVE National Centre at the University of Melbourne, Homeland School Company and Mala'la Health Service. 320 beds across five settled invoices, $273,966 including GST and $247,770 net. Always name the basis. Facilitation is a second thing buyers already pay for, $50,000 net across ten visits at $3,000, $6,000 and $8,000. | Caught 11 September 2026, `chatgpt-session-review-2026-09-11.md:23-29`. Naming a listed company as a buyer would have been a fabricated claim. |

The $75,000 that survives is a different object. A hundred beds at $750 is $75,000 of local capital for a community enterprise, and that is the pool figure, unrelated to what ALIVE paid.

## Demand

| We no longer say | Where it still appears | What we say now | Ruling and date |
|---|---|---|---|
| 778 beds of demand | Named as retired at `who-has-asked.ts:23` and `:32` and at `bed-need-and-order.ts:72`. The header comment at `demand-and-buyers.ts:11-12` still prints it as beds recorded as wanted. | There is no demand total and none may be stated. The 778 adds one Elder's wallet to an outstation's children to a figure nobody wrote a scope for. Present acts on a ladder, strongest first: money moved, 320 beds paid by four organisations; money named, Dianne Stokes, 20; an organisation asked, Utopia 150, Homeland Schools 65, PICC 40; a person asked, Norman Frank, 3; raised in a meeting, Groote 500, the largest figure and the weakest rung. | Ben, 11 September 2026. |
| 0.26 beds per dwelling needing an extra bedroom | Kept visible at `bed-need-and-order.ts:182-195` so nobody rediscovers it and builds on it. | The rate is an artefact. Maningrida's 65 is about the homelands and was divided by the whole 2,518-person ABS area, so three of four figures only look like they agree. Palm Island reached one bed per 16.0 people and Tennant Creek one per 15.9, both measured on beds delivered, which is an observation and never a planning rate. The fix is one community doing a four-question household count, paid local. | Ben, 11 September 2026. |

## The production route

Ben ruled the current route on 12 September 2026: press the tab sheets only at Witta, buy the leg sheets, dispatch flat-packed kits to community, and run a programme where young people and others assemble and distribute them. Factory capacity ends at dispatch. Everything in this table is what that replaced.

| We no longer say | Where it still appears | What we say now | Ruling and date |
|---|---|---|---|
| Legs are pressed here and beds are assembled here | The old route is in git history at `production-scenarios.ts` before 12 September. | Tabs are pressed here, leg sheets are bought, and assembly happens in community. | Ben, 12 September 2026. |
| 48 kits a month and 576 a year | `model-language.ts:100` and `community-economics.ts:50` still carry 576 as the yearly figure. | 6 kits a day, 16 run days a month at 80% availability, 96 kits a month and 1,152 a year. The router ceiling is 136 kits a month. | Ben, 12 September 2026. |
| Two pressed sheets per bed | The two-sheet assumption is what put pressing at 3 beds a day. | 1 pressed tab sheet per dispatched kit. The leg sheets are bought, and a bought panel is never another finished kit. | Ben, 12 September 2026. |
| An assembly ceiling of 80 beds a month | The ceiling was 5 beds a day over 16 run days. | Assembly is in community and puts no limit on factory dispatch. `FACTORY_ASSEMBLY_LIMIT` is null at `production-route.ts:20`, which means no constraint and never zero output. | Ben, 12 September 2026. |
| 36 kg pressed a bed, and the 40 kg that decision D06 still records | `place-feedstock.ts:11` still says 36 kg goes through the press. D06 in the live workbook still records 40 kg, and the drift is named at `sheet-canon.ts:62`. | 15 kg of tab shred per dispatched kit, because the factory presses tabs only. The 15 kg is a planning input from Capacity B39 and still has to be weighed. | Ben, 12 September 2026. The 36 kg was Ben's 9 September figure for the old route and included the leg sheet at 21 kg. |
| $276 to make a bed and $474 back to the organisation, as settled figures | Both are still printed across the modules and the deck, which is correct as long as the word travels with them. | Provisional. Canon labels $276 a legacy making allowance and $474 a provisional contribution, because the yield from a bought leg panel is unknown. Nic owns that yield, from the cutting evidence on the 25 sheets already invoiced on INV-2021. Break-even at 628 beds derives from the provisional $474, so it is provisional too and must be written that way. | Ben, 12 September 2026. |
| 6.5 paid hours a bed | `v2/src/app/wiki/manufacturing/throughput/page.tsx` still prints it at lines 49, 127 and 128. | Two hours, from $80 of paid making a bed at $400 a day over five beds. Modelled, and what replaces it is measurement: paid hours against completed beds from the production log. | Ben, 10 September 2026. The seven stages are kept at `impact-model.ts:198` as `WITHDRAWN_LABOUR_STAGES` so nothing sums them back in. |

## The language

| We no longer say | Where it still appears | What we say now | Ruling and date |
|---|---|---|---|
| Nine years on the road | Live and unswept on public surfaces: `deck.ts:169`, `:426` and `:441`, `deck-road.ts:156`, `road-spine.ts:117`, `CONTEXT.md:54` and `STRATEGY.md:78`. | Two years, maximum. | Ben, 3 September 2026. |
| Co-design, co-designed | The data keys `theme: 'co-design'` at `content.ts:179`, `:186` and `:214` and the filters that read them are pending a separate migration. Do not add new ones. | Designed in community, led by community. Co-design implies a facilitated joint process; the truth is that design happens in community and community leads it. The rule is stated at `audience.ts:152` and the story editor warns about it at `admin/el-stories/[id]/edit/page.tsx:193`. | Ben, 11 July 2026. |
| Goods. as a separate maker or seller | `CONTEXT.md` records it as retired at lines 50, 71, 75 and 79. Historic invoices and archived material keep the old name, and they are records of what happened. | Goods on Country is the single operating and public identity, a registered business name of The Butterfly Movement Ltd. The products, IP, assets, contracts, making, sales, delivery, capital, governance and evidence run through it. | Ruling X, Ben, 28 August 2026. |
| Community ownership as a thing already done | Any surface that reads as a completed transfer. | Community ownership is a pathway. Community partners make the local decisions today: how beds are used, who is paid and what is made next. Zero community enterprises are trading yet, and that is what this year changes. | Ruling X, Ben, 28 August 2026. |
| The Weave Bed as a product line | One deliberate exception, and it stays. Centrecorp's INV-0291 and quote QU-0014 read "Goods Weave Bed v2.3" and those beds are Stretch Beds. The line name is held steady across the Centrecorp paper trail on purpose, so their finance team sees the same description invoice to invoice. Never correct those documents. | The Weave Bed is discontinued and the design is out of the current range. Supabase rows carrying `product_type: weave_bed` or `weave-bed-*` slugs are wrong and should read `stretch_bed`. The register guard is at `community-canonical.ts:153-156`. | Ruling not located. Stated in `CLAUDE.md` and guarded in code. |
| Health as a dial, a score or a fourth scorecard | Proposed in the 11 September pitch session and refused the same day. | Scabies to rheumatic heart disease is the reason the work exists. It carries no number and is never a claimed outcome. On a drawing it reads as the reason we started. | Standing rule, restated 11 September 2026, `chatgpt-session-review-2026-09-11.md:36-40`. |

## What looks retired and is not

Four figures in this register are still live in another sense, and deleting them would lose real information.

- **$75,000** is a hundred-bed pool of local capital at $750 a bed. It is not what ALIVE paid.
- **130** is the quantity on Centrecorp's unpaid quote QU-0014 from May 2026. It is a quote, and it is kept as one.
- **628 beds** is still the printed break-even, provisional, because the buyer pays freight at cost on its own line. A provisional 918 is the case where Goods carries freight, and it is a sensitivity.
- **"Goods Weave Bed v2.3"** stays on INV-0291 and QU-0014 forever. Randle Walker calls them Stretch beds in correspondence, which is the right name everywhere else.

## What is true and checkable today

540 beds are deployed across eleven communities. 40 of them were made entirely at our own facility, pressed at Witta and assembled at Gamardi. Five communities have asked for a plant. Utopia is 147 confirmed and never 169. Maningrida has 8 washing machines. 320 beds are bought and paid for.

## Related

[[capital-stack]] · [[funder-register]] · [[cost-register]] · [[investors/qbe-foundation]] · [[investors/tim-fairfax]] · [[investors/sefa]] · [[products/stretch-bed]] · [[program/qbe-catalysing-impact-2026]] · [[communities/overview]]
