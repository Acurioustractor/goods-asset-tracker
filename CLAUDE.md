# Goods

**Goods.** is the maker and seller, a social enterprise delivering quality furniture to remote
Indigenous communities across Australia. The flagship product is the **Stretch Bed**.
**Goods on Country** is the charity, a registered business name of The Butterfly Movement Ltd.
They are two different things and conflating them reaches funder documents (ruling K, verified on
ABN Lookup 2026-07-25).

**▶ Read `/STRATEGY.md` first for the whole picture.** It carries the north star, the road, the
model, the economics, the raise and what is open, and it names which file wins when two disagree:
figures in `canon.ts`, judgements in `/DECISIONS.md`, language in `/CONTEXT.md`.

**▶ Before touching the raise, the QBE application or any money surface, read
`thoughts/shared/handoffs/2026-08-01-qbe-stage2-reality-and-the-raise.md`.** It carries two
findings that contradict older documents and older Notion pages. QBE is **one pool of up to
$1.1M shared across ten enterprises**, and the grant is **catalytic, not a dollar-for-dollar
match** (ruling V), so $400K is the top of a range rather than a plan. And the FY26 books show
**$0 cost of goods sold** with **83.6% of income unclassified**, so Goods has no financial
identity separate from the sole trader it trades through. Both change what can honestly be said
to a funder.

**▶ Also read `/GRANTSCOPE.md` for any funder, investor, pathway, community, relationship,
impact, cost-model or narrative surface.** It is the cross-system evidence-and-decision contract:
how to connect people, place, authority, trade, evidence and next actions without turning Goods
into another transactional dashboard. It never overrides canon, dated rulings, language or
strategy; it makes conflicts visible so a human can resolve them.

## The one that will bite you: Supabase project targeting

The org has 9 Supabase projects and the Supabase MCP can reach all of them. It takes an
explicit `project_id`, so a stray or wrong id silently queries someone else's database — the
one easiest to hit by mistake is `bhwyqqbovcjoefezgfnq` ("ACT Farmhand").

**Never use the Supabase MCP for v2 data.** Use `curl` with the service role key from
`.env.local`, or `psql` with the connection string. The v2 project is Goods,
`cwsyhpiuepvdjtxaozwf`. DDL (CREATE/ALTER/DROP) needs `psql` — the `exec_sql` RPC doesn't
support it. Full project map: `wiki/canon/SOURCES.md`.

## Where to work

`v2/` is the active Next.js app. `deploy/` is the old static site — never modify it.
`wiki/` is an LLM knowledge base on the Karpathy pattern; its rules live in `wiki/AGENTS.md`.
For ACT ecosystem knowledge, cross-reference the Tractorpedia at
`/Users/benknight/Code/act-global-infrastructure/wiki/` (124 articles) rather than duplicating it.

Fonts are worth stating because they are NOT what the code implies: `design/brand/tokens.css`
says Georgia is the display face, but the app actually loads Playfair Display, and
`--goods-font-logo` names Archivo, which is never loaded at all.

## Products — the corrections that matter

`v2/src/lib/data/products.ts` is the single source of truth for specs; import from it rather
than hardcoding. What that file won't tell you:

**Stretch Bed** — flagship, and the only product for direct sale (Stripe). Canonical slug
`stretch-bed`; the shop URL is still `/shop/stretch-bed-single`. It is an **X-trestle tension
design**: two galvanised steel poles thread through the canvas long-edge sleeves *and* the top
holes of two crossed-plank recycled-HDPE X-legs. Tensioning pulls the poles deep into the leg
holes and the canvas is **structural** — the bed won't stand without it. It is not "clip-on
legs", not "woven cord", not a "hardwood frame"; those are earlier descriptions still floating
around in old copy. 20kg of HDPE diverted per bed. Manufacturing is an on-country plant that
can move to community ownership.

**Washing machines** — Pakkimjalki Kari, named in Warumungu by Elder Dianne Stokes. Speed
Queen base, prototype stage, deployed in several communities. Register Interest form only, not
for sale. Context for why it matters: one Alice Springs provider sells $3M/yr of machines into
remote communities, most of which are in dumps within months.

**Basket Bed** — the first prototype. Sales discontinued, design being open-sourced. Download
Plans link only.

**Weave Bed** — discontinued as a product line. Remove references when found on PUBLIC surfaces.

⚠ **One deliberate exception, confirmed by Ben 2026-08-02: Centrecorp invoices and quotes.**
`INV-0291` (107 beds, Nov 2025) and `QU-0014` (130 beds, May 2026) both read "Goods Weave Bed
v2.3". **Those are Stretch Beds.** The line name was kept consistent across the Centrecorp
paper trail on purpose, so their finance team sees the same description invoice to invoice.
Do NOT "correct" those documents, and do not treat them as evidence the Weave Bed was produced
at scale. Randle Walker calls them Stretch beds in correspondence, which is the right name
everywhere else.

Supabase
rows carrying `product_type: weave_bed` or `weave-bed-*` slugs are wrong; they should be
`stretch_bed` / `stretch-bed-*`.

## Brand voice

Warm, grounded, community-first. Lead with impact, not charity. Use real community language
("deadly" = excellent). Always centre Indigenous voices and agency.

- NEVER "co-design" / "co-designed" — the products are **designed in community / designed with
  community** (Ben, 2026-07-11). Co-design implies a facilitated joint process; the truth is
  that the design happens in community, led by community. Existing data keys like
  `theme: 'co-design'` in content.ts are pending a separate migration — don't add new ones.
- Ownership is a **pathway** — "moving closer to community ownership", never claimed complete.
- scabies→RHD is the **why**, never a claimed health outcome.

## Gotchas

- Empathy Ledger (`https://empathy-ledger-v2.vercel.app`, project code `goods-on-country`) has
  240 storytellers but **0 published stories**, so `FeaturedStories` falls back to the local
  `journeyStories` in `content.ts`. Published EL stories take over automatically.
- Public-facing stats carry a `verified: true | false` flag (press, impact, deck, leave-behind,
  pathways — 26 uses). `false` means the claim is stated but not yet evidenced, e.g. the 10+ year
  design life is intent, not field-proven. Never flip a flag to `true` without a source.
- Large videos go in `public/video/`, not Supabase Storage — too big for the API.
- Background video conventions, the Hero `videoSrc` contract and the FFmpeg tools live in the
  `video-pipeline` skill, which loads on demand.
- `npm run build` must be clean before the work is done.
- When the user says "open" or "show me", they want to see the running app — open a URL or
  start the dev server rather than continuing a code walkthrough.
