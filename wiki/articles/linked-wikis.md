# Linked Wikis

> This wiki is intentionally lightweight. Deeper context lives elsewhere. This article maps
> where to find what, so agents don't duplicate knowledge that already exists.

## The ACT Tractorpedia
**Path:** `/Users/benknight/Code/act-global-infrastructure/wiki/`
**Size:** 124 articles (as of 2026-04-07)
**Domains:** projects, concepts, communities, people, stories, art, finance, technical, decisions, research

Tractorpedia is the Karpathy-pattern LLM knowledge base for the whole A Curious Tractor
ecosystem. It's the "big brain." Goods is one of several projects inside it.

### Goods content in Tractorpedia
- `projects/goods-on-country.md` — 293-line project article covering the Goods story, products, partners
- `raw/` — includes many cross-project articles that touch Goods (storytelling, community context)
- `people/benjamin-knight.md`, `people/nicholas-marchesi.md` — co-founder context
- `communities/` — Palm Island, Mount Isa, Tennant Creek community context

### When to read from Tractorpedia
- Anything about ACT identity, LCAA method, Beautiful Obsolescence, Third Reality methodology
- Cross-project concepts (Empathy Ledger, JusticeHub, CivicGraph, The Harvest)
- People bios, community histories, research papers
- The broader philosophy Goods sits inside

### When to write to this wiki instead
- Goods-specific operational knowledge — production, deployments, fleet telemetry
- QBE program updates — deadlines, session notes, cohort contacts
- Xero invoice and bed pricing history
- Community procurement conversations
- Funder-specific intel (SEFA, Snow, Mindaroo, IBA, PFI)

## Codebase Data (Canonical)
**Path:** `v2/src/lib/data/`
Treat these files as the single source of truth:
- `products.ts` — Stretch Bed, washing machine, basket bed specs
- `content.ts` — brand copy, voice
- `compendium.ts` — community partnerships, funding, voices, deployments
- `impact-model.ts` — impact calculations
- `media.ts` — image/video URLs
- `v2/docs/COMPENDIUM_MARCH_2026.md` — narrative compendium

**Rule:** if a fact lives in one of these files, link to the file from this wiki — don't duplicate.

## Memory Notes
**Path:** `~/.claude/projects/-Users-benknight-Code-Goods-Asset-Register/memory/`
Fast-access facts the Claude agent loads every session. Short-form. For enduring context
(not articles). See `MEMORY.md` for the index.

## External Systems (Query, Don't Duplicate)
- **Supabase** `cwsyhpiuepvdjtxaozwf` — orders, fleet telemetry, stories, deployments
- **Xero** — invoices, bed pricing, cash flow
- **Empathy Ledger** — 12 Goods-project stories, syndicated
- **Grantscope** — `/Users/benknight/Code/grantscope/` — outreach targets, grant matching

## Sources
Scaffolded from: `raw/2026-04-02-email-jay-boolkin-qbe-induction-recap.md` (bootstrap session 2026-04-09).
