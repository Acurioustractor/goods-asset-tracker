# Brand & Comms HQ

Single source of truth for how Goods on Country sounds, looks, and shows up in writing. Use this any time you draft an email, a deck, a social post, a funder brief, or any product copy.

Canonical home: this folder (`wiki/articles/brand-comms/`). Mirrored to Notion under Goods. HQ. Linked from QBE Catalysing Impact HQ. The repo is authoritative. If Notion drifts, fix it from here.

## What's in here

| File | When to use |
|------|-------------|
| [01-voice-and-tone.md](01-voice-and-tone.md) | Before writing anything for Goods. Has the rules, banned phrases, before/after examples, and a one-page checklist. |
| [02-storyteller-voices.md](02-storyteller-voices.md) | When you need a quote, a name, or a story. Curated library of community voices with consent state, themes, and pull quotes. |
| [03-product-image-library.md](03-product-image-library.md) | When you need a photo. Shot list, photo direction, and an audit of what we have versus what we still need. |
| [04-email-templates.md](04-email-templates.md) | Funder, procurement, community, and media email templates with subject lines and signature blocks. |
| [05-pipelines-x-brand.md](05-pipelines-x-brand.md) | Maps every pipeline stage to the right template and the right goodsoncountry.com URL to send. |
| [06-asset-register.md](06-asset-register.md) | Where every canonical brand asset lives: code, photos, video, wiki, deck, Notion. |
| [07-slide-deck.md](07-slide-deck.md) | The one simple deck used for every live session. Ten slides. Speaker notes. Links to assets. |
| [08-agent-prompt-pack.md](08-agent-prompt-pack.md) | Reusable prompts for any LLM that drafts Goods copy. Drop these into ChatGPT, Claude, or any agent. |
| [CONSENT_PROCESS.md](CONSENT_PROCESS.md) | The six-step playbook for moving a storyteller from Pending review to Verified. EL leads, repo and Notion mirror. |
| [CONSENT_BACKLOG.md](CONSENT_BACKLOG.md) | The working list of who is blocked on what. Use when planning the next On-Country trip. |
| [EL_LED_ARCHITECTURE.md](EL_LED_ARCHITECTURE.md) | Why Empathy Ledger is the consent-bearing source of truth, and how the repo and Notion mirror it. |

## Working principle

Three layers, like a recipe:

1. **The rules** (voice-and-tone): the non-negotiables.
2. **The ingredients** (storyteller voices, images, templates, prompts): reusable parts.
3. **The dish** (any specific email, deck, post, page): assembled from the above.

Never invent voices, quotes, or numbers. Pull from the ingredients. If a piece of content needs something the library doesn't have, add it to the library first, then reuse.

## Source dependencies

- Product specs come from `v2/src/lib/data/products.ts`. Never hardcode them anywhere else.
- Community voices come from `v2/src/lib/data/content.ts` and the Empathy Ledger API (project `goods-on-country`). Never invent quotes.
- Photos come from `v2/public/images/`. Empathy Ledger is the live fallback.
- Pipeline targets come from Grantscope (`/Users/benknight/Code/grantscope/...goods-outreach-targets.ts`).

## Live versions

- Insiders site: [goodsoncountry.com/insiders](https://www.goodsoncountry.com/insiders) (password `goods2026`)
- Public site: [goodsoncountry.com](https://www.goodsoncountry.com)
- Notion mirror: under Goods. HQ → Brand & Comms HQ
- Repo: [github.com/Acurioustractor/goods-asset-tracker](https://github.com/Acurioustractor/goods-asset-tracker)

Last revised: 2026-05-08.
