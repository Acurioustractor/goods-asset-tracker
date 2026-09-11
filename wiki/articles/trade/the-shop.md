---
reviewed: 2026-09-12
ruling: Ben, 26 July 2026, ruling S. The shop leads with spec, price, lead time, freight, warranty and who fixes it, before any brand prose.
canon: [bed.price, bed.freight]
sources: [v2/src/app/shop/page.tsx, v2/src/lib/data/shop.ts, v2/src/app/shop/stretch-bed-single/page.tsx, v2/src/components/shop/buy-now-form.tsx, v2/src/app/api/checkout/route.ts, v2/src/app/api/webhooks/stripe/route.ts, v2/src/lib/data/products.ts, v2/src/app/contact/page.tsx, v2/src/app/api/contact/route.ts, v2/src/app/shop/washing-machine/page.tsx, v2/src/app/basket-bed-plans/page.tsx, v2/src/app/admin/orders/launch-checklist/page.tsx]
---

# The shop

> The shop is live, it takes real cards, and it sells one thing: the Stretch Bed at $750. The price comes from the database at checkout time, so a tampered browser cannot change it. The `orders` table holds 31 rows and exactly one of them came from a real outside customer: `GOC-20260908-1455`, $750 paid on 8 September 2026, still unshipped with every fulfilment field empty. The bulk-order path is a radio button on the contact form that captures name, email, phone, subject, message and organisation, so a 400-bed enquiry arrives shaped like a newsletter signup. Washing machines are Register Interest only. The Basket Bed plans are an email list for plans that have not been released. A buyer who wants ten beds can either press a plus button nine times and pay $7,500 with no freight charged and no delivery date, or send a message and wait for a person.

## What the shop sells

One product is active in the `products` table: `stretch-bed-single`, `product_type` `stretch_bed`, `price_cents` 75000. Everything else is inactive, including the double Stretch Bed, both Basket Beds, the Pakkimjalki Kari washing machine and the hidden `smoke-test` SKU.

The narrowing is enforced twice. `isPurchasableProductType` in `v2/src/lib/data/products.ts` returns true only for the Stretch Bed's product type, and `POST /api/checkout` rejects any cart item whose database row fails that test with the message "Only the Stretch Bed is available for checkout." The Buy button on a non-purchasable product reads "Not available for checkout" and is disabled.

## The straight answers come first

`/shop` leads with six answers from `v2/src/lib/data/shop.ts`, before any brand prose: the spec, the price, lead time, freight, how long the bed lasts and who fixes it. Two of them tell a buyer the truth about a thing we have not measured.

> Beds are made in batches, not warehoused. We confirm your dispatch window when you order rather than promise a number we have not measured.

> Designed to last 10+ years in remote conditions. That is the design intent, not yet a field-proven number, and we will say so until it is.

The freight answer sends bulk buyers to the contact form for a quote before they buy. Nothing downstream honours that instruction, which is the subject of the next two sections.

## The price is re-read on the server

`POST /api/checkout` takes the cart from the browser, pulls the product ids out of it, and queries Supabase for `price_cents`, `currency`, `product_type` and `is_active`. It builds the Stripe line items from the database row and never from the number the browser sent. The comment in the route says so: "Use database price for security (don't trust client-sent price)."

The Stripe session collects a billing address, a phone number and an Australian shipping address. It configures no shipping rates. Freight is $150 a bed all up and the shop charges $0 of it, so `shipping_cents` is zero on every order in the table.

## The one real order

`GOC-20260908-1455` is the only order from a real outside customer. One Stretch Bed, $750, paid 8 September 2026 at 13:02 UTC, shipping to a Darwin address in the Northern Territory. It came through the sponsorship path, so `is_sponsorship` is true and it carries a short dedication from the buyer. `sponsored_community` is null, so no community is named against it.

Four days later every fulfilment field on that row is empty:

| Field | Value |
|---|---|
| `status` | `paid` |
| `tracking_number` | null |
| `shipped_at` | null |
| `delivered_at` | null |
| `internal_notes` | null |
| `order_items.asset_id` | null |

The admin surface for all of those exists and works. The bed has not been picked, packed or posted, and the buyer has not been told anything since the Stripe receipt. The other 30 rows are card checks and archived pre-launch test data raised by Ben or by Stripe's test persona, and the archived ones carry an internal note saying they were created against test keys and are not real revenue.

A single unshipped order is a small operational fact and a large evidence fact. When a funder asks whether the shop works, the honest answer today is that the money side works and the fulfilment side has never been run once end to end. See [[trade/enquiry-to-delivered-bed]] for the six steps that run on a person's memory.

## The bulk-order path

`/contact` has four choices. One of them reads "Bulk Order" with the description "Order 10+ beds for an organization". Choosing it does exactly two things: it reveals an optional Organization text field, and it sets the subject line to "Bulk Order Inquiry".

Everything else about the form is identical to a general enquiry. The payload sent to `POST /api/contact` is name, email, phone, organisation, subject and message. There is no quantity field. No delivery place. No date needed by. No budget. No indication of whether the beds are for houses, a school or a health service.

So a health service asking for 400 beds and a person asking a general question submit the same six fields, and both arrive in the shared inbox `hi@act.place` and as a tagged GHL contact with the message threaded into Conversations. The tag differs by one word. Nothing creates an opportunity on the Buyer Pipeline board and nothing produces a quote.

## What a buyer of ten beds can actually do today

Two paths, and both of them are worse than they look.

**Path one: buy them.** The quantity stepper on `/shop/stretch-bed-single` has a minimum of one and no maximum. Press the plus button nine times and the button reads "Buy Now · $7,500". Stripe takes the card. The buyer pays no freight, receives no delivery date, gets no bulk price and gets no confirmation that ten beds exist. On the making side the current route presses 6 kits a day, so ten beds is under two days of dispatch capacity at Witta. Nothing tells the buyer that and nothing tells production the order happened.

**Path two: ask.** Submit the bulk-order form and wait. The enquiry is durable and will reach a human. What happens next depends on Nic and Ben reading the thread, deciding a price with no price rule behind it, and typing a quote by hand.

Neither path produces a written quote, a lead time or a freight figure, and those are the three things a procurement officer needs before they can raise a purchase order.

## Washing machines and the Basket Bed

**Pakkimjalki Kari**, named in Warumungu by Elder Dianne Stokes, is a prototype and is not for sale. The product row is inactive and the launch checklist treats an active washing-machine SKU as a hard failure. The page's calls to action are Register Interest, which links to `/partner?type=washer-interest`, and Get in Touch.

**The Basket Bed** was the first prototype and sales are discontinued. `/basket-bed-plans` is headed "Download the Plans" and there is nothing to download. The page says the plans are being prepared for public release and the card underneath it is a newsletter signup tagged `basket-bed-plans` whose success message is "We'll notify you when plans are ready to download." Anyone who reads the shop card, clicks "Download Plans" and lands there joins an email list.

**The Weave Bed** is discontinued as a product line and appears nowhere on any public surface. The one deliberate exception lives in Centrecorp's paper trail and is explained in [[trade/what-has-been-bought]].

## Before the shop can carry real volume

1. Freight on the order. $150 a bed is a known figure and Stripe is charging none of it.
2. A quantity that reaches somebody. Ten beds bought with a plus button should not look the same as one.
3. A bulk enquiry that captures quantity, place and date, so the first reply can be a quote instead of a question.
4. One order taken all the way from paid to delivered, so the fulfilment path has been walked once before a buyer tests it for us.

## Related

[[trade/enquiry-to-delivered-bed]] · [[trade/price-and-freight]] · [[trade/what-has-been-bought]] · [[trade/a-community-sells-its-own-beds]] · [[products/stretch-bed]] · [[products/washing-machine]] · [[products/basket-bed-legacy]]

## Sources

- `v2/src/app/shop/page.tsx`, the three product cards and the bulk-order link to `/contact`.
- `v2/src/lib/data/shop.ts`, the six answers ruled by ruling S.
- `v2/src/components/shop/buy-now-form.tsx` lines 84 to 110, the unbounded quantity stepper.
- `v2/src/app/api/checkout/route.ts` lines 23 to 55 and 77 to 82, the product validation and the server-side price read.
- `v2/src/app/api/webhooks/stripe/route.ts` lines 165 to 199, the order insert and the zero shipping cost.
- `v2/src/lib/data/products.ts` lines 81 to 85, `isPurchasableProductType`.
- `v2/src/app/contact/page.tsx` lines 12 to 51 and 189 to 204, the four enquiry types and the fields the bulk path adds.
- `v2/src/app/basket-bed-plans/page.tsx` lines 174 to 191, the plans that are an email list.
- `v2/src/app/admin/orders/launch-checklist/page.tsx`, the live-key and active-product gates.
- Supabase project `cwsyhpiuepvdjtxaozwf`, tables `products`, `orders` and `order_items`, read 12 September 2026.
