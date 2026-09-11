---
reviewed: 2026-09-12
ruling: Ben, 12 September 2026, the flat-pack route. Witta presses tab sheets, legs are bought, kits go out flat-packed and factory capacity ends at dispatch.
canon: [trade.bedsPaid, trade.paidNet, bed.price, bed.freight]
sources: [v2/src/app/contact/page.tsx, v2/src/app/api/contact/route.ts, v2/src/lib/contact-delivery/index.ts, v2/src/lib/ghl/smart-lists.ts, v2/src/lib/ghl/index.ts, v2/src/app/api/checkout/route.ts, v2/src/app/api/webhooks/stripe/route.ts, v2/src/app/admin/orders/page.tsx, v2/src/app/admin/quotes/page.tsx, v2/src/lib/data/demand-and-buyers.ts]
---

# From an enquiry to a delivered bed

> Nine steps stand between somebody asking for beds and a bed arriving in a house. Three of them run end to end on software today: the contact form, the Xero invoice and the payment. The other six run on a person's memory or on a surface that exists and nothing feeds. Nothing in the public site or the admin tree produces a quote, so every one of the 320 beds bought and paid for was quoted and invoiced by hand in Xero. An order row holds no link to a production run. The one field that could tie a paid order to a made bed is `order_items.asset_id`, an admin fills it from a dropdown, and on the only real outside customer order we hold it is null. This article walks each step, names the surface that holds it and the person who owns it, and says plainly whether the step exists.

## The nine steps at a glance

| # | Step | Surface | Owner | Does it exist? |
|---|---|---|---|---|
| 1 | Enquiry | `/contact` form, `POST /api/contact` | The shared inbox `hi@act.place`, plus GHL Conversations. No individual is recorded | Yes |
| 2 | Opportunity | GHL Buyer Pipeline, id `FjMyJM3YzWQFmKqR9fur` | No owner recorded | The board exists. Nothing puts an enquiry on it |
| 3 | Quote | None | Nic, by hand | No. There is no quote surface anywhere |
| 4 | Xero invoice | Xero, Nicholas Marchesi sole trader, ABN 21 591 780 066 | Nic | Yes, outside the app |
| 5 | Payment | Xero for invoices, Stripe for the shop | Nic | Yes, in two places that do not talk |
| 6 | Production slot | `/admin/production` and the asset register | Nic at Witta | Partly. It is not joined to an order |
| 7 | Freight | Booked by phone and email | Nic | No surface at all |
| 8 | Delivery | The asset register, when somebody updates it | Nic and the community partner | Partly |
| 9 | Confirmation | `/admin/orders/[id]` status field, or a text message | Whoever remembers | Partly |

## Step 1. The enquiry

`/contact` sends name, email, phone, subject, message and organisation to `POST /api/contact`. The route writes a durable receipt first, then creates or updates a GHL contact, tags it `act-inquiry` and `project-goods` plus a subject tag, and threads the message into that contact's GHL Conversations inbox as an inbound email. A second copy goes to `CONTACT_INBOX_EMAIL`, which defaults to `hi@act.place`. If either destination is down a cron job retries.

Two things are true about this step and both matter. It is durable: a failed integration cannot silently swallow an enquiry. And it is flat: a person asking for 400 beds and a person asking for a media pack arrive in the same inbox, in the same shape, with no quantity, no place and no date. See [[trade/the-shop]] for what that costs on the bulk-order path.

No individual owns the shared inbox, and no individual is recorded as owning the Buyer Pipeline board either. That is a finding worth stating plainly: the two steps with the highest chance of turning an enquiry into a first sale have no name against them.

## Step 2. The opportunity

GHL holds a canonical board recorded as the Buyer Pipeline, id `FjMyJM3YzWQFmKqR9fur`, with four rungs: target, signed, contract, cash. The audit script that classifies our pipelines says to keep it commercial only, so grant-funded deliveries and funder asks stay on the Supporter Journey board.

The board is real. The path onto it is not. `POST /api/contact` creates a contact and tags it. It never creates an opportunity. The only code in the repo that upserts a GHL opportunity is `createStrategicOpportunity` in `v2/src/lib/ghl/index.ts`, and it is reached from the GrantScope target flow with the source string "GrantScope Goods Workspace". A bulk-order enquiry from the website reaches GHL as a tagged contact with an email in its Conversations thread. Somebody has to read that thread and make the opportunity by hand, or the enquiry stays a contact forever.

## Step 3. The quote

There is no quote surface. This is the largest gap on the path.

`/admin/quotes` sounds like the place and is not. It reads the `quotes` table, which holds community voices sourced from Empathy Ledger and the curated set, one record per quote, each with a consent tier and a storyteller. It is a curation view for stories. `v2/src/lib/data/supplier-quotes.ts` holds quotes pointed the other way: what suppliers quote us for HDPE, steel and canvas.

So every price a buyer has ever seen was typed by a person. Quote `QU-0014`, 130 beds for Centrecorp in May 2026, exists only as a fact recorded in `v2/src/lib/data/demand-and-buyers.ts`. It was never paid. Nothing in the app produced it and nothing in the app knows it was sent.

Five realised bed prices sit behind the trade record: $370, $380, $560, $750 and $800. There is no price rule behind them. A quote surface would have to hold one, which is why building it is a pricing decision before it is a software task.

## Step 4. The Xero invoice

Invoices are raised in Xero under Nicholas Marchesi, sole trader, ABN 21 591 780 066. Five settled invoices carry the whole paid trade record: INV-0259, INV-0283, INV-0291, INV-0303 and INV-0342. Together they are 320 beds across four organisations, $273,966 including GST and $247,770 net. Always name the basis when printing either figure.

The app plays no part. `/admin/xero-reconciliation` reads the live Xero mirror and lines invoices up against CRM deals after the fact, which is a reconciliation and not a raising surface.

## Step 5. Payment

Payment happens in two places that do not talk to each other.

A Xero invoice is marked paid in Xero. A shop order is paid through Stripe, and `POST /api/webhooks/stripe` writes an `orders` row with `status: 'paid'` and a `paid_at` timestamp. The two records live in different systems with no shared key, so "has this buyer paid" is answered by opening whichever one applies and knowing in advance which one that is.

## Step 6. The production slot

This step does not connect to an order.

Production runs at Witta and is tracked through `/admin/production` and the asset register, where each made unit has a row. Under the 12 September route ruling, Witta presses the tab sheets, the leg sheets are bought, and kits leave flat-packed for assembly in community. Factory capacity ends at dispatch.

Nothing in the `orders` table reserves a slot, and no production record points back to a buyer. The only join anywhere is `order_items.asset_id`, filled from a dropdown on `/admin/orders/[id]` that lists assets with `status = 'ready'`. Setting it flips the asset to `allocated`, stamps the shipping city onto the asset as its community and tags the buyer's GHL contact. It is a good mechanism. It is also entirely manual, and it points at a bed that already exists. There is no way to say "this order is why we are making these beds".

## Step 7. Freight

Freight has no surface anywhere in either tree.

Canon carries $150 as the all-up freight cost of a bed. The shop charges $0: `POST /api/checkout` collects an Australian shipping address and configures no Stripe shipping rates, so `shipping_cents` on every order is zero. On invoices, freight has been handled three different ways across the five: charged as its own line once, on INV-0303 at $5,900; quoted at $3,200 and discounted in full on INV-0283, which is why freight became its own line at cost; and left off entirely on the other three. Booking a truck is a phone call Nic makes.

## Step 8. Delivery

Delivery is recorded in the asset register when somebody updates it. There is no delivery confirmation flow, no proof of delivery capture and no field a driver or a community partner can fill in.

The register holds 540 beds deployed across eleven communities. The invoice record holds 320 beds paid for. These count two different things and are never added together. Centrecorp's beds are delivered and are never counted as demand.

## Step 9. Confirmation

`/admin/orders/[id]` has a status field with `shipped` and `delivered`, a tracking-number input and an internal-notes box. Setting the status to `shipped` with a tracking number stamps `shipped_at`; setting it to `delivered` stamps `delivered_at`.

On the only real outside customer order in the table, `GOC-20260908-1455`, paid $750 on 8 September 2026, `tracking_number`, `shipped_at`, `delivered_at` and `internal_notes` are all null. The fields work. Nobody has filled them in.

## What is real and what is a person's memory

Real, in software, checkable by anyone: the contact receipt, the GHL contact and its Conversations thread, the Stripe payment, the `orders` and `order_items` rows, the asset register, the status fields on the order page.

A person's memory: that a quote was sent and at what price, that an invoice followed the quote, that a production run was started because of a specific order, that a truck was booked, that beds arrived, and that the buyer was told. Six of the nine steps depend on Nic or Ben holding the thread in their head.

## The four gaps worth closing first

1. **A quote surface.** It is the missing link between an enquiry and an invoice, and it forces the price rule the five realised prices do not have.
2. **An enquiry that becomes an opportunity.** A bulk-order submission should land on the Buyer Pipeline board carrying a quantity and a place, instead of sitting in an inbox alone.
3. **An order that reserves production.** Until an order can point forward at beds to be made, the register and the ledger stay two separate stories about the same beds.
4. **Freight on the order.** $150 a bed is known. The shop charges nothing and the five invoices have handled it three ways.

## Related

[[trade/the-shop]] · [[trade/what-has-been-bought]] · [[trade/price-and-freight]] · [[trade/the-four-doors]] · [[trade/facilitation-as-a-line]] · [[trade/a-community-sells-its-own-beds]] · [[products/stretch-bed]]

## Sources

- `v2/src/app/contact/page.tsx` lines 12 to 51, the four enquiry types and the payload the form sends.
- `v2/src/app/api/contact/route.ts`, the durable receipt, the GHL contact, the tags and the inbox copy.
- `v2/src/lib/contact-delivery/index.ts` line 81, the `hi@act.place` default.
- `v2/src/lib/ghl/smart-lists.ts` lines 196 to 206, the Buyer Pipeline rungs.
- `v2/src/lib/ghl/index.ts` lines 777 to 847, `createStrategicOpportunity` and its GrantScope source string.
- `v2/src/app/api/checkout/route.ts`, the server-side price read and the absent shipping rates.
- `v2/src/app/api/webhooks/stripe/route.ts` lines 172 to 199, the `orders` insert.
- `v2/src/app/admin/orders/[id]/page.tsx`, the status, tracking and asset-allocation server actions.
- `v2/src/app/admin/quotes/page.tsx`, which is community voices and not prices.
- `v2/src/lib/data/demand-and-buyers.ts` lines 95 to 209, the five settled invoices; lines 315 to 331, the totals.
- Supabase project `cwsyhpiuepvdjtxaozwf`, tables `orders` and `order_items`, read 12 September 2026.
