# 06. Asset Register

Where every canonical brand and product asset lives. Use this when you need to find the source of truth, link to it, or update it.

## Code (canonical)

| Asset | Path | What's in it |
|-------|------|--------------|
| Product specs | [v2/src/lib/data/products.ts](../../v2/src/lib/data/products.ts) | Stretch Bed, Pakkimjalki Kari, Basket Bed, production facility, HDPE catalogue. Single source of truth. |
| Brand copy | [v2/src/lib/data/content.ts](../../v2/src/lib/data/content.ts) | Brand name, taglines, hero copy, philosophy, story, problem, solution, impact, journey stories, video testimonials, partnerships, process, investment case |
| Verified quotes | [content.ts:121](../../v2/src/lib/data/content.ts:121) | 22 community quotes with consent flags |
| Journey stories | [content.ts:320](../../v2/src/lib/data/content.ts:320) | 6 narrative arcs (Zelda, Brian, Ivy, Dianne, Linda, Patricia) |
| Impact stories | [content.ts:403](../../v2/src/lib/data/content.ts:403) | 6 short quote cards |
| Video testimonials | [content.ts:455](../../v2/src/lib/data/content.ts:455) | Cliff (live), Dianne (placeholder) |
| Communities | [content.ts:479](../../v2/src/lib/data/content.ts:479) | Tennant Creek, Alice Springs, Palm Island, Townsville, Utopia, Maningrida |
| Investment case | [content.ts:591](../../v2/src/lib/data/content.ts:591) | $120K ask, demand list, plant detail, risks, timeline |
| Compendium (typed) | [v2/src/lib/data/compendium.ts](../../v2/src/lib/data/compendium.ts) | Funding, partners, voices, deployments |
| Impact model | [v2/src/lib/data/impact-model.ts](../../v2/src/lib/data/impact-model.ts) | Theory of change, impact tiers |
| Media resolver | [v2/src/lib/data/media.ts](../../v2/src/lib/data/media.ts) | Image slot keys with EL fallback |
| Database types | [v2/src/lib/types/database.ts](../../v2/src/lib/types/database.ts) | TS types for Supabase tables |

## Identity (legacy and reference)

| Asset | Path | Status |
|-------|------|--------|
| Identity doc | [compendium/identity.md](../../compendium/identity.md) | Older, voice section is thin. Brand & Comms HQ supersedes the brand voice section. Identity doc remains for ACT framework alignment. |
| Master compendium | [v2/docs/COMPENDIUM_MARCH_2026.md](../../v2/docs/COMPENDIUM_MARCH_2026.md) | Long-form reference. Source for content.ts data. |
| January compendium | [v2/docs/COMPENDIUM_JANUARY_2026.md](../../v2/docs/COMPENDIUM_JANUARY_2026.md) | Older version. |
| Knowledge compendium | [v2/docs/GOODS_KNOWLEDGE_COMPENDIUM.md](../../v2/docs/GOODS_KNOWLEDGE_COMPENDIUM.md) | Operational knowledge base. |
| Strategy doc | [v2/docs/GOODS_STRATEGY_PD.md](../../v2/docs/GOODS_STRATEGY_PD.md) | Strategy and product direction. |
| Operations handbook | [v2/docs/OPERATIONS_HANDBOOK.md](../../v2/docs/OPERATIONS_HANDBOOK.md) | How we run. |
| Partner guide (legacy) | [v2/docs/PARTNER_GUIDE.md](../../v2/docs/PARTNER_GUIDE.md) | Older partnership doc. Email templates supersede. |
| Story templates | [v2/docs/story-templates.md](../../v2/docs/story-templates.md) | Empathy Ledger story formats. |

## Photo and video library

| Asset | Path |
|-------|------|
| Product photos | [v2/public/images/product/](../../v2/public/images/product/) |
| People portraits | [v2/public/images/people/](../../v2/public/images/people/) |
| Community landscapes | [v2/public/images/community/](../../v2/public/images/community/) |
| Process series | [v2/public/images/process/](../../v2/public/images/process/) |
| Manufacturing detail | [v2/public/images/process/](../../v2/public/images/process/) (CNC, press, container shots) |
| Pitch hero shots | [v2/public/images/pitch/](../../v2/public/images/pitch/) |
| Media pack | [v2/public/images/media-pack/](../../v2/public/images/media-pack/) |
| Hero videos | `v2/public/video/` (hero, stretch-bed, community sets, desktop and mobile variants) |

Image map and Empathy Ledger fallback: [v2/src/lib/data/media.ts](../../v2/src/lib/data/media.ts).

## Empathy Ledger

| Property | Value |
|----------|-------|
| Project ID | `6bd47c8a-e676-456f-aa25-ddcbb5a31047` |
| Project slug | `goods` |
| Project code (aggregator) | `goods-on-country` (returns ~18 stories including PICC, BG Fit) |
| Goods-only stories | 12 syndicated |
| API base | `https://empathy-ledger-v2.vercel.app` |
| Plain stories endpoint | `https://www.goodsoncountry.com/api/stories?projectCode=goods-on-country` |
| Auto-sync | `/api/cron/el-sync` daily |
| Client code | [v2/src/lib/empathy-ledger/client.ts](../../v2/src/lib/empathy-ledger/client.ts) |
| Types | [v2/src/lib/empathy-ledger/types.ts](../../v2/src/lib/empathy-ledger/types.ts) |
| Operations doc | [v2/docs/empathy-ledger-operations.md](../../v2/docs/empathy-ledger-operations.md) |
| Integration doc | [v2/docs/EMPATHY_LEDGER_INTEGRATION.md](../../v2/docs/EMPATHY_LEDGER_INTEGRATION.md) |

Required filters when querying: `syndication_enabled = true`, `consent_withdrawn_at IS NULL`, `is_archived = false`.

## Live surfaces

| Surface | URL | Auth |
|---------|-----|------|
| Public site | [goodsoncountry.com](https://www.goodsoncountry.com) | None |
| Insiders wiki | [goodsoncountry.com/insiders](https://www.goodsoncountry.com/insiders) | Password `goods2026` |
| QBE program admin | `/admin/qbe-program` | Admin auth |
| QBE actions admin | `/admin/qbe-actions` | Admin auth |
| Fleet admin | `/admin/fleet` | Admin auth |

## Notion mirrors

| Surface | URL |
|---------|-----|
| Goods. HQ (root) | [notion.so/177ebcf981cf805fb111f407079f9794](https://www.notion.so/177ebcf981cf805fb111f407079f9794) |
| QBE Catalysing Impact HQ | [notion.so/33febcf981cf804198f1ee881fa515b2](https://www.notion.so/33febcf981cf804198f1ee881fa515b2) |
| Goods Wiki (mirror) | [notion.so/348ebcf981cf81348e5dd32c05898345](https://www.notion.so/348ebcf981cf81348e5dd32c05898345) |
| Brand & Comms HQ | (created from this guide, see top of QBE HQ index) |

## Repos and infra

| System | URL |
|--------|-----|
| Goods code | [github.com/Acurioustractor/goods-asset-tracker](https://github.com/Acurioustractor/goods-asset-tracker) |
| Grantscope | `/Users/benknight/Code/grantscope` (local) |
| Empathy Ledger | [github.com/Acurioustractor/empathy-ledger-v2](https://github.com/Acurioustractor) |
| Supabase project (v2) | `cwsyhpiuepvdjtxaozwf` |
| Vercel project | Goods on Country |
| ACT infra Supabase (Xero, etc.) | `bhwyqqbovcjoefezgfnq` |

## Email infrastructure

| Address | Purpose |
|---------|---------|
| hi@act.place | Default Goods inbox (current) |
| hello@goodsoncountry.org.au | Legacy from PARTNER_GUIDE.md, may be aspirational |
| partnerships@goodsoncountry.org.au | Legacy |
| media@goodsoncountry.org.au | Legacy |

If we activate goodsoncountry.com email addresses, update [04-email-templates.md](04-email-templates.md) signature block.

## Domain truth

- Primary: `www.goodsoncountry.com`
- Not: `goodsoncountry.com.au` (we don't own this), not `goodsoncountry.au` (alt domain, public site lives on .com)

## Updating this register

If you add a new canonical asset:
1. Add it to the right table above with the file path or URL.
2. Mark it as canonical (single source of truth) or reference (older / informational).
3. Cross-reference from any guide page that uses it.
4. If it replaces a legacy asset, mark the legacy as superseded.
