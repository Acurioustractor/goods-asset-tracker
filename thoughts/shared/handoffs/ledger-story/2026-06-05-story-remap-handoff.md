# Handoff: remap the story parts onto the ledger spine

For: a separate Claude Code instance (Empathy Ledger repo or act-global-infrastructure).
From: Goods Asset Register session, 2026-06-05.
Status: ready to pick up. Read this whole file before acting.

## Context in three lines

1. DECISION (closed, 2026-06-05): the centering Goods story artifact is the LIVING LEDGER, an accumulating consent-governed feed surfaced from Empathy Ledger. Weekly post, monthly field note, quarterly funder cut, annual printed volume. Full report: `Goods Asset Register/wiki/outputs/2026-06-05-goods-story-artifact-decision.md`.
2. The Goods repo now has a `/ledger-story` skill (`.claude/skills/ledger-story/`) that drafts those units from consent-cleared material. It reads the spine; it never publishes and never flips consent.
3. Your job (this handoff): make the EL-side story parts line up with the spine so the skill's queries return clean, complete, attributable material.

## The spine (the shared vocabulary, do not invent new fields)

- Storyteller: EL `storytellers.id`, joined to Goods by exact `display_name`
- Place: EL `locations` + `storyteller_locations` + `media_locations` (+ lat/long on assets)
- Product: stretch-bed | washing-machine | basket-bed
- Theme: making, plastic-loop, in-use, community, assembly, health, ownership
- Kind: hero, product, detail, portrait, scene, process, plant, landscape

EL coordinates: Supabase `yvnuayzslukamizrlhwb.supabase.co`, Goods project id `6bd47c8a-…`, project code `goods-on-country`. Architecture doc with the full flow: `Goods Asset Register/wiki/outputs/2026-06-03-goods-el-content-architecture.md`.

## The remapping tasks, in order

1. **Quote-to-place join.** Every `storyteller_quotes` row should resolve to a community via `storyteller_locations`. List quotes that cannot resolve; do not guess places.
2. **Story parts onto the spine.** Transcript-derived parts (quotes, themes, analysis) should carry the spine vocabulary (product/theme tags) so a filter like "Utopia + in-use + cleared" returns complete sets. Map existing tags to the controlled vocab; flag unmappable ones rather than coining new terms.
3. **Consent-state audit (read-only).** Produce the current truth table: per storyteller, consent_verified / published / portrait present / profile present. The 2026-06-03 snapshot (46 storytellers, 6 cleared) lives at `Goods Asset Register/wiki/outputs/2026-06-03-storyteller-triage.md`; regenerate it from live data.
4. **Name reconciliation list.** Exact `display_name` mismatches between EL and the Goods side (`curated-quotes.ts` keys, trip-stories voice cards), including double-space keys and the Shane/Shayne Bloomfield case. OUTPUT A LIST FOR BEN; never normalise or fix a person's name yourself.
5. **Media linkage, with in-frame people tagging as the priority.** For Goods-tagged `media_assets`: confirm storyteller_id, location, and spine tags are populated; list gaps. CRITICAL: `media_storytellers` must list EVERYONE in frame, not just a primary storyteller. This gap already caused a real error (2026-06-05: a pitch mock paired Katrina Bloomfield's voice with a photo of the old men at Utopia because no photo carries who-is-in-frame data). Output the list of published/cleared photos with zero or uncertain people-tags so Ben can name faces on the next pass.

## Hard boundaries (same as the ledger-story skill)

- NEVER flip consent or publish flags; never write to GHL or social; no schema changes without explicit approval in that session.
- Reads are free; any EL write beyond tag backfill on YOUR OWN new rows is Tier 3: propose first, wait for an explicit verb.
- Names verbatim always. Uncertain = flagged, not fixed.

## Outputs

Write results to `thoughts/shared/handoffs/ledger-story/` in this repo (or your repo's equivalent + tell Ben the path):
- `el-spine-remap-report.md`: what maps cleanly, what is flagged, the consent truth table, the name reconciliation list
- A 1-2 line summary back to Ben, not a dump

## Paste-prompt for Ben (start the other instance with this)

> Read "/Users/benknight/Code/Goods Asset Register/thoughts/shared/handoffs/ledger-story/2026-06-05-story-remap-handoff.md" and do what it says. Read-only against Empathy Ledger unless I give an explicit verb. Report back as one file plus a two-line summary.
