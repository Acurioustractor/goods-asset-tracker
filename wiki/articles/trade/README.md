---
reviewed: 2026-09-12
ruling: Ben, 11 Sep 2026, present acts on a ladder and never state a demand total; Ben, 2 Aug 2026, the Centrecorp line name is held steady on purpose; Ben, 9 Sep 2026, the money is a price model and never cost-plus
canon: [trade.bedsPaid, trade.paidNet, bed.price, bed.freight, trade.paidInclGst]
sources: [v2/src/lib/data/demand-and-buyers.ts, v2/src/lib/data/who-has-asked.ts, v2/src/lib/data/bed-need-and-order.ts, v2/src/lib/data/community-economics.ts, v2/src/lib/data/shop.ts, wiki/articles/trade/what-has-been-bought.md, wiki/articles/trade/price-and-freight.md, wiki/articles/trade/facilitation-as-a-line.md, wiki/articles/trade/the-four-doors.md, wiki/articles/trade/the-shop.md, wiki/articles/trade/enquiry-to-delivered-bed.md, wiki/articles/trade/a-community-sells-its-own-beds.md]
---

# Trade

> Four organisations have bought and paid for 320 beds across five settled invoices, $247,770 net, and those seven articles are the record of it. Three rules govern every one of them. Invoices are not the asset register. Beds invoiced and beds deployed count two different things and are never added. There is no demand total and none may be stated.

## The claim ceiling that governs this folder

**Invoices are not the asset register.** An invoice records that somebody paid. The register
records that a bed exists and where it went. They are separate systems answering separate
questions, and the join between them is one nullable field that is empty on the only real outside
customer order we hold. [[../production/order-to-slot]] holds that gap.

**Beds invoiced and beds deployed are never added.** 320 beds are bought and paid for. 540 beds
are deployed across eleven communities. The two figures overlap in ways nobody has reconciled line
by line, so adding them invents a number. Print each with the thing it counts beside it.

**No demand total is ever stated.** The old 778 added figures scoped to different populations, so
it is retired. Present acts on a ladder instead, strongest first: money moved, money named, an
organisation asked, a person asked, raised in a meeting. Each figure keeps the act that produced it
attached to it. The full ladder and its rulings sit in [[../capital/what-may-be-claimed]].

Two more that bite in this folder. Centrecorp's beds are delivered and are never counted as
demand. INV-0291 and QU-0014 read "Goods Weave Bed v2.3" and those are Stretch Beds, held steady
across their paper trail on purpose for their finance team, so they are never corrected.

## Articles in this folder

- [[what-has-been-bought]]: the five settled invoices, who paid, what they bought, and the basis under both the $273,966 including GST and the $247,770 net.
- [[price-and-freight]]: why $750 is a price and never a cost build-up, the five realised prices with no rule behind them, and the $150 of freight resting on three Maningrida data points.
- [[facilitation-as-a-line]]: the ten community visits buyers have already paid for at $3,000, $6,000 and $8,000, which is the evidence under the facilitation line in the raise.
- [[the-four-doors]]: four kinds of buyer behind five invoices, the question that qualifies each one, the proof invoice, and the organisation already asking at that door.
- [[the-shop]]: the one live retail channel, what it can and cannot do, and the single outside customer order still unshipped.
- [[enquiry-to-delivered-bed]]: nine steps from an enquiry to a bed in a house, four of them on software and five on a person's memory.
- [[a-community-sells-its-own-beds]]: the trade underneath money kept in community, the value ladder from shred to a sold bed, and why the two money loops are never drawn as one circle.

## Related

- [[../capital/the-money-model]]: how the price does two jobs, and why both halves are provisional today
- [[../production/the-flat-pack-route]]: what a bought bed now costs to make and dispatch
- [[../capital/what-may-be-claimed]]: the claim ceiling in full, with the ruling under each rule
- [[../program/the-raise]]: where this trade record is used in the four applications
