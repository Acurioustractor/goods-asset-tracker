# Voice-analysis batches (deep transcript pass, 2026-07-20)

The durable output of the deep qualitative analysis of all substantive Goods EL
transcripts (29 transcripts, 26 voices). Full-transcript analysis authorised by
Ben for all storytellers, 2026-07-20.

- One JSON per batch; schema matches `v2/src/lib/data/voice-impact-model.ts`.
- These files are the SOURCE for `v2/src/lib/data/voice-impact-data.json`
  (rebuild: `cd v2 && node --env-file=.env.local scripts/build-voice-impact-data.mjs`).
- Edit by hand as quotes clear: flip `"cleared": true` on a quote after Ben's
  pass, then rebuild.
- Consent rules: quotes are transcript-verbatim; `cleared` is per line; held
  voices (Walter) never leave /admin; scabies to RHD stays the why only.
