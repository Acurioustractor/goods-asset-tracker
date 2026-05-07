# Brand & Comms HQ: Build Status

> Snapshot at the end of the May 2026 build phase. Use this to orient the next phase of work.

## What is shipped

### Public surfaces (live when deployed)

| URL | What it is |
|-----|-----------|
| [goodsoncountry.com/brand](https://www.goodsoncountry.com/brand) | Public brand page. Voice rules, storyteller gallery (live from EL), Stretch Bed specs, embedded deck, photo library, origin story, six narrative arcs, asset register, contact. Linked from site footer. |
| [goodsoncountry.com/decks/live-session-deck.html](https://www.goodsoncountry.com/decks/live-session-deck.html) | 10-slide HTML deck for every live session. Keyboard nav, speaker notes (n), overview (o), print-to-PDF (p). |
| [goodsoncountry.com/tools/brand-lint](https://www.goodsoncountry.com/tools/brand-lint) | Voice-rule linter UI. Paste a draft, see violations highlighted with severity, line numbers, suggestions. |
| [goodsoncountry.com/tools/signature](https://www.goodsoncountry.com/tools/signature) | Email signature generator. Plain + HTML output, paste instructions for Gmail / Apple Mail / Outlook. |
| [goodsoncountry.com/api/press-kit](https://www.goodsoncountry.com/api/press-kit) | Structured JSON: brand, products, headline quotes, storytellers, partners, deck URL, voice rules, contact. CORS-permissive. ISR cached 5 min. |
| [goodsoncountry.com/api/brand-lint](https://www.goodsoncountry.com/api/brand-lint) | POST `{ "text": "..." }` returns voice violations. Same logic as the UI. |

### Notion (under Goods. HQ → Brand & Comms HQ, linked from QBE HQ)

Eight sub-pages: Voice & Tone, Storyteller Voices, Product Image Library, Email & Comms Templates, Pipelines × Brand, Asset Register, Live Session Slide Deck, Agent Prompt Pack. Mirror of the canonical wiki articles in this folder.

### Internal libraries

| File | Purpose |
|------|---------|
| `v2/src/lib/brand-lint.ts` | Pure-function linter, 21 rules. Inline-ignore + allowlist-near support. |
| `v2/src/lib/data/funder-url-map.ts` | Typed map of 21 named funders to recommended URLs and storyteller voices. |
| `v2/src/lib/empathy-ledger/featured-voices.ts` | Server helper for live storyteller pulls with consent filtering and local-photo fallback. |
| `tools/lint-docs.mjs` | Standalone Node script. `--fix-em-dashes` auto-fix flag. Runs in CI via `.github/workflows/brand-lint.yml`. |

### Linter rules (21 total)

Em dashes, banned terms (donate, beneficiaries, empower, unlock, leverage, synergy, ecosystem, GTM, disrupting, innovative, revolutionary, game-changer, best-in-class, helping them), capitalisation (On-Country, First Nations), generic identifiers (Indigenous people block, the outback / the bush, remote Australia).

Suppression mechanisms:
- Inline code spans and fenced code blocks auto-skipped
- `<!-- brand-lint-ignore-line -->` (per-line, optional rule-id)
- `<!-- brand-lint-disable -->` ... `<!-- brand-lint-enable -->` (block)
- `allowIfNear` rule field (legitimate compound terms within 40 chars)

## Voice audit final state

| Surface | Errors | Warnings |
|---------|-------:|---------:|
| wiki/articles/ | 0 | 14 |
| v2/docs/ | 0 | 9 |
| **Whole repo** | **0** | **23** |

Down from 1,511 errors at the start of the audit. Remaining warnings are advisory only, in contexts where existing phrasing is contextually defensible.

## How to use this in the next phase

### Drafting any external comms
1. Open [/brand](https://www.goodsoncountry.com/brand) for context.
2. Pull from the storyteller library on that page (or from `v2/src/lib/data/content.ts` directly in code).
3. Use a template from [04-email-templates.md](04-email-templates.md).
4. Pick the right URL for the recipient using [05-pipelines-x-brand.md](05-pipelines-x-brand.md) or `funder-url-map.ts`.
5. Paste the draft into [/tools/brand-lint](https://www.goodsoncountry.com/tools/brand-lint) before sending.

### Drafting with an LLM
Paste the system prompt from [08-agent-prompt-pack.md](08-agent-prompt-pack.md) before any task. Use the task-specific prompts (rewrite-in-voice, draft funder email, draft procurement, LinkedIn post, funder report, slide content, brand-violation audit).

### Live session
Open [/decks/live-session-deck.html](https://www.goodsoncountry.com/decks/live-session-deck.html). Press `o` for overview, `n` for speaker notes, `p` for PDF. The 10-slide spine is in [07-slide-deck.md](07-slide-deck.md) (markdown reference); customise slide 10 (the ask) per audience.

### Adding a new funder to the pipeline
1. Add a row to `v2/src/lib/data/funder-url-map.ts` with type, primary URL, recommended voice, rationale.
2. Mirror the entry into the table in [05-pipelines-x-brand.md](05-pipelines-x-brand.md).
3. The /brand page picks it up on next deploy.

### Adding a new storyteller
1. Get consent and update Empathy Ledger.
2. Add the photo to `v2/public/images/people/{firstname-lastname}.jpg`.
3. Add an entry to `VOICE_DIRECTORY` in `v2/src/lib/empathy-ledger/featured-voices.ts`.
4. Add a profile section to [02-storyteller-voices.md](02-storyteller-voices.md).

### Onboarding a new team member
Send them this folder + the [/brand](https://www.goodsoncountry.com/brand) page. Have them generate their signature at [/tools/signature](https://www.goodsoncountry.com/tools/signature).

## Known follow-ups for the next phase

### High value
- **Logo pack and brand mark files.** No proper logo assets in the repo yet. Currently only `media-pack/goods-branding-golden-hour.jpg`. Need vector logo (SVG), favicon update, social-share OG image, partner-use formats. Worth commissioning or a designer pass.
- **Photography gaps** flagged in [03-product-image-library.md](03-product-image-library.md): Maningrida (18 beds delivered, no community photos), Alice Springs landscape, Palm Island landscape, Ebony / Jahvan portraits, full production-plant operation shots, Pakkimjalki Kari in-use, Zelda Hogan portrait. Schedule a photographer for the next On-Country trip.
- **Notion ↔ repo sync.** Currently a one-shot snapshot. If we make heavy use of Notion as the live editing surface, build a sync (pull-only is fine) so repo stays canonical but Notion edits flow back. Today the repo is authoritative; if Notion drifts, fix from the repo.
- **Visual / photographic audit of public site.** /brand and product pages have grey image placeholders for some Empathy Ledger slots when EL is not configured locally. Verify production has all images resolving.

### Medium value
- **Live counts on /brand.** The "image library" section uses static counts (14 Stretch Bed images, etc). Could derive from `media.ts` so it auto-updates.
- **Per-funder branded landing pages** at `/p/[slug]`. The `funder-pages.ts` already exists. Wire in the new `funder-url-map.ts` so the right URL recommendation, hero photo, and storyteller quote auto-assemble per funder.
- **Slack / email digest** on lint regressions. CI already posts step summaries; a daily Slack ping for any new violations would close the loop.

### Lower value / parking
- **Block PRs on lint errors.** Currently advisory. Promote to blocking only after a quiet period to avoid noise on legacy unrelated changes.
- **Bulk fix the 23 advisory warnings.** Each needs a contextual rewrite. Worth a weekly 30-min pass per file.

## Maintenance

- When you add or change a funder URL recommendation: update both `funder-url-map.ts` and the table in `05-pipelines-x-brand.md`.
- When you add or change a storyteller: update `VOICE_DIRECTORY` in `featured-voices.ts` and the profile in `02-storyteller-voices.md`.
- When you tighten or loosen the linter rules: update both `v2/src/lib/brand-lint.ts` and `tools/lint-docs.mjs` (they share rule logic but are independent files).
- Notion is mirror-only. Do not edit Notion as the source. If Notion is wrong, fix the wiki and re-mirror.

## Last updated
2026-05-08, end of build phase.
