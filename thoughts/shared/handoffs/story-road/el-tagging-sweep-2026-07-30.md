# Goods tagging sweep — machine pass done, human queue (2026-07-30)

**What ran:** the evidence-based tagging sweep over all 198 Goods-linked media rows. Every
write is reviewable by design: product tags landed as `source='ai_suggested'`,
`verified=false` with a confidence score; person tags use `consent_status='pending'`;
locations were written only where the filename itself names the place. Nothing was published,
nothing verified, nothing consented by machine.

## What was written

| Write | Count | Evidence used |
|---|---|---|
| Product/context tags seeded (`tags`) | 79 rows (10-slug vocabulary x 8 tenants holding Goods media) | vocabulary from the pipeline doc |
| Product tag suggestions (`media_tags`) | **74**, unverified, confidence 0.5-0.9 | alt-text/filename patterns: washing machine, press/CNC/granulator series, workshop/webbing builds, trailer/delivery, basket/stretch/weave mentions; the migrated `build__` series at 0.5 |
| Locations (`media_assets.location_name`) | **17**: Utopia Homelands 15, Tennant Creek 1, Atnarpa 1 | filename says the place (`partners__centrecorp__utopia__*`, `community__tennant-creek`, `atnarpa-portrait`) |
| Person tags (`media_storytellers`) | 0 new — all 52 derivable portrait links (31 owner portraits + 21 migrated `people__*` name-matches) **already existed** | the earlier tagging work covered them |

## Coverage after the sweep (198 rows)

- Person-tagged: **80** · product-tagged: **73** · located: **17**
- **20 images carry nothing at all** — the true nobody-has-looked pile.

## Your review queue, in order (all in /admin)

1. **Verify the 74 suggestions** (bulk-edit or media review; they are filtered by
   `source='ai_suggested', verified=false`). Flip verified or delete; both are one action.
2. **The 20 blank images** need eyes; several are the `20260702-1E5A00xx` series (Margaret
   Lloyd's July 2026 set, people visibly present in the two I rendered earlier) and a few
   `story-media` avatars with no alt text.
3. **Locations, the big one: ~180 rows still null.** The machine wrote only
   filename-explicit places. Two cluster confirmations from you unlock most of the rest in
   one bulk-edit each: the `20250812/13-IMG_*` series (which community was that run?) and the
   `20260329-1E5A28xx` production-facility series (the farm?). Say the place, any session
   writes the batch.
4. **Consent status:** all person links sit at `pending`/existing states; your review flips
   them per person, and the 20260702 series needs person tags added before it can ever be
   used publicly with people in frame.
5. Alt text: the `20260702` series has filenames as alt text — replace with real
   descriptions during review.

## Provenance

Executed 2026-07-30 against the app DB via the write connection. All queries derivable from
this doc; suggestions carry their confidence; no figure, tag or consent was invented. The
matching pipeline doc lives in both repos (`el-media-pipeline-2026-07-29.md` on the Goods
branch `docs/el-alignment-2026-07-29`).
