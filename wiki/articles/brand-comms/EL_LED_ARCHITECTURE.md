# EL-led architecture

> 2026-05-08 direction call. Empathy Ledger leads. Notion mirrors EL. Repo is local fallback. Everything that can be EL-canonical, is.

## The principle

Three things matter for the brand & comms system:

1. **Consent** has to live in one place. The system that holds consent must be authoritative.
2. **Storyteller agency** has to be respected. They control their own records.
3. **Surface consistency** has to be automatic. Every place we publish a quote, photo, or story should read from the same source.

Empathy Ledger was built for exactly this. It is the consent-bearing system of record. So: **EL leads. Everything else mirrors.**

## What is canonical where

| Domain | Canonical source | Notion role | Repo role |
|--------|------------------|-------------|-----------|
| Storytellers (people, profiles, photos, consent) | **Empathy Ledger** | Mirrored, browsable view | Local fallback only |
| Stories (narratives, quotes, themes) | **Empathy Ledger** | Mirrored | Local fallback only |
| Media (photos with consent + cultural tags) | **Empathy Ledger** | Mirrored | Local fallback at `/v2/public/images/...` |
| Content placements (which photo on which page) | **Empathy Ledger** | (Not mirrored) | Local fallback in `media.ts` |
| Funders pipeline | **Repo** (`funder-url-map.ts`) | Mirrored | — |
| Banned terms / linter rules | **Repo** (`brand-lint.ts`) | Mirrored | — |
| Email templates | **Repo** (`04-email-templates.md`) | Mirrored | — |
| Slide deck spine | **Repo** (`07-slide-deck.md` + HTML) | Mirrored | — |
| Photo categories / gap list | **Repo** (manually curated brief) | Mirrored | — |

EL covers the storyteller/story/media domain. Repo covers Goods-specific business data EL doesn't model.

## The website reading path

```
Goods website (goodsoncountry.com)
        │
        ├─ Storyteller voices, quotes, photos
        │     └─ reads LIVE from Empathy Ledger via
        │           /api/stories?projectCode=goods-on-country (filtered for consent)
        │           with local content.ts as failover only
        │
        ├─ Funders, voice rules, templates, deck, photo categories
        │     └─ reads from repo (already deployed via Vercel build)
        │
        └─ Static images
              └─ /v2/public/images/{category}/...jpg with EL placement override via media.ts
```

## What this changes today

### Before this audit

- Notion Storyteller Voices DB had 16 rows, all marked **Consent = Verified**, sourced from `content.ts` `verified: true` flags.
- The `verified` flag was a hand-curated assertion, not a check against EL state.
- Website pulled from EL for /stories but the Voice gallery on /brand used a hardcoded `VOICE_DIRECTORY` in `featured-voices.ts`.

### After

- Notion Storyteller Voices DB now reflects **actual EL state**. After audit on 2026-05-08:
  - **Verified (3):** Dianne Stokes, Cliff Plummer, **Fred Campbell** (newly added — consent-clean stories in EL but missing from previous Notion mirror).
  - **Pending review (13):** every other row. EL has the storyteller record (most cases) but no consent-clean Goods stories yet, OR EL has no record at all (Zelda Hogan, Jessica Allardyce, Norman Frank Jupurrurla).
  - The "EL Story ID" column captures the actual EL state per row, including reconciliation notes (Alfred's location is "Brisbane" in EL but "Palm Island" in content.ts; Tracy's location is "Adelaide" in EL but "Mt Isa" in content.ts; Ivy has two EL records that need disambiguation).
- New row: **Fred Campbell** — discovered via EL audit, surfaces on Minderoo funder page closing video.
- The brand voice rules in `02-storyteller-voices.md` now read: external use of any voice REQUIRES the row's Consent = Verified in the Notion DB, which mirrors EL.

### What needs building next (in priority order)

1. **EL → Notion sync script** (`tools/sync-storytellers-from-el.mjs`). Runs the EL Supabase query, computes the diff vs current Notion DB rows (by Name + EL Storyteller ID), reports drift, and (with `NOTION_TOKEN` set) applies the diff. Today this was done by hand via MCP. The script means future sync is an automated cron rather than a manual exercise.
2. **Refactor `featured-voices.ts`** to derive featured storytellers from EL's `is_featured` flag + consent-clean story join, rather than the hardcoded `VOICE_DIRECTORY`. Local fallback should only kick in when EL is unreachable.
3. **Photo path resolution** to prefer EL's `profile_image_url` over our local `/images/people/*.jpg` when both exist. The local files become a fallback for EL outage / for storytellers without an EL record.
4. **Add consent-pending banner on /brand** when displayed storytellers' consent state is not Verified. If we can't show Verified, we should be transparent that this is content awaiting consent confirmation.

## Reconciliations the audit surfaced

These are real data quality gaps that should be addressed in EL (or in our content.ts where appropriate):

| Storyteller | Issue | Action |
|-------------|-------|--------|
| Norman Frank Jupurrurla | Not in EL by full name, only "Norman Frank" | Update EL record to include "Jupurrurla" or update content.ts to match EL |
| Zelda Hogan | Not in EL at all | Create EL storyteller record before any external use |
| Jessica Allardyce | Not in EL at all | Create EL storyteller record before any external use |
| Ivy | Two EL records: "Aunty Ivy" (Mount Isa) and "Ivy" (Palm Island) | Confirm which is the Goods-related record; consolidate or disambiguate |
| Alfred Johnson | EL said Brisbane, content.ts said Palm Island | Resolved 2026-05-08: Alfred is Palm Island. EL updated. |
| Tracy McCartney | EL said Adelaide, content.ts said Mt Isa | Resolved 2026-05-08: Tracy is Kalgoorlie. EL + content.ts + wiki updated. |

These were invisible until we connected the two systems. That's the value of EL leading.

## Decision log

- **Storyteller domain:** EL canonical. Final. Non-negotiable per the consent argument.
- **Goods-specific business data (funders, lint rules, etc.):** Repo canonical. EL doesn't model these and shouldn't be stretched to.
- **Notion role:** Mirror only. Edits made in Notion are not authoritative; if Notion drifts from EL/repo, fix the upstream and re-sync.
- **Frequency of sync:** Aim for daily until proven; on-demand thereafter. Cron can run from GitHub Actions or Vercel cron.
- **Source-of-truth visibility:** Every Notion row should carry a "From: [system]" field or a similar marker so editors know they're looking at a mirror.

## Last revised
2026-05-08, end of EL-led restructure session.
