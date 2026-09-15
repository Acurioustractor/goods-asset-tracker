# Public site audit, 15 September 2026

Read against the live site (goodsoncountry.com, main at 891bbfd) on 15 September 2026: the 121 routes in `route-audience.ts` that are not internal, and the 56 open ones fetched, with their title, first heading, word count, calls to action and trust signals. The question was Ben's: can someone who stumbles onto the site, or a community, decide to buy beds or ask for a facility, and trust who they are dealing with?

## What was broken, and is fixed

| Where | What a visitor saw | Fixed in |
|---|---|---|
| /pitch chapter 2 | No drone film or photographs on any device: the server checked for the video on disk, and Vercel keeps `public/` out of the function | #263 |
| /pitch chapter 8 | Map dots on a blank page: the Australia outline was read from `public/` | #263 |
| Community pages | Every storyteller portrait lookup failed the same way | #263, and a guard so no public page reads `public/` again |
| /pitch contact | A floating Contact pill; the form looked rough on phones | #263 (menu and page foot) and this branch (the form) |
| Footer | "The Goods on Country giving pathway through Butterfly is being formalised for FY2026-27", which contradicts ruling X | this branch |
| /contact FAQ | "Goods on Country is a social enterprise", ducking the tax question | this branch |
| Community film heading | A raw Empathy Ledger filename, "1779658776018 Charley Utpoia" | this branch: a filename falls back to "Film from {community}" |
| Home page | An em dash in the Oonchiumpa section | this branch |

## What was missing, and is built on this branch

- **/beds**, the buying page. Two ways to buy: online by card for one to nine beds, and a quote, invoice or purchase order for organisations. It covers how an organisation order runs, who has bought (the four buyers, 320 beds), the straight answers from `shop.ts`, and an order form that goes to /api/contact as a Bulk Order Inquiry. It ends with who you are buying from. Freight is quoted by destination (Ben, 15 September).
- **/facilities**, for a community weighing up local making. It covers the line (the kit drawing and the four make steps), what a facility brings, the four gates written for any community, the $150,000 planning allowance with "nothing signed", Maningrida as proof, and an enquiry form.
- **/who-we-are**, the legitimacy page. It shows the entity as a register would print it (trading name, legal name, ABN linked to ABN Lookup, charity status), the three directors with sources and photo credits, the board handover note with no chair, the team, community partners as independent organisations, and links to the register, the data, the model and the case studies.
- **Wiring:**
  - The header "Buy a bed" goes to /beds, and the nav gains Facilities and Who we are.
  - The footer gains Buy beds, Community facilities and Who we are, and its charity box now reads from `organisation.ts`.
  - The home page opens with three doors (buy beds, make beds in your community, back the work) and the board line.

## Still open, for Ben

1. **Board membership on the public page.** `goods-board.ts` lists Kristy Bloomfield, Audrey Deemal and Jeremy Donovan. The 15 September evidence check noted that Jeremy stands at the AGM on 12 October and that Sonia Mascolo is on the board. Confirm the three names before /who-we-are merges, or say who to add.
2. **Two pitches.** /pitch/road (the 16-slide road deck, ruling R) and /pitch (the scrolling pitch rebuilt on 15 September) are both live funder front doors. Deciding whether /pitch/road redirects to /pitch is Ben's call.

**Correction (same day).** The first draft said /about, /mission, /the-work and /story/road serve duplicate copies of /story, that /deck, /pitch/deck and /pitch/control-room duplicate /pitch/road, and that /media and /invest duplicate /press and /get-involved. The crawler had followed redirects. Every one of them already redirects: 307 from `next.config.ts` (route sweep, 2 August 2026), with /media on 308 and /invest a redirect page. What was genuinely wrong was internal links still pointing at the old addresses: the contact page's Our Story link, the claims ledger's evidence links (read by /register), `deck.ts`, the surface registry, the enterprise "Learn more" (an /about#enterprise anchor that no longer exists), and three admin and QBE workspace links. They now point at /story, /pitch/road or /facilities. The redirects stay at 307, following the config's own rule to promote only once held.
3. **Thin or empty pages.** /sponsor and /support render client-side with no heading in the page source. /field-notes is 65 words and /onepagers is 106.
4. **Community storytellers.** Community pages show no storytellers. The Empathy Ledger storyteller API returned 404s during the build, which is separate from the portrait fix.
5. **/shop and /beds overlap.** /shop stays the product list and /beds is the buying page. /shop's "Not buying for yourself?" block could point to /beds#order.
6. **ABN on invoices and checkout.** The ABN is now in the footer and on /who-we-are. Stripe checkout and invoices were not checked.
7. **A real test message** from the /beds and /facilities forms, confirming it arrives in GHL (tag `goods-bulk-order-inquiry` or `goods-partnership-inquiry`) and at hi@act.place.
