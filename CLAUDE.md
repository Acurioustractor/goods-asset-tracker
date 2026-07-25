# Goods on Country

A social enterprise delivering quality furniture to remote Indigenous communities across
Australia. The flagship product is the **Stretch Bed**.

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

**Weave Bed** — discontinued, never produced at scale. Remove references when found. Supabase
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
