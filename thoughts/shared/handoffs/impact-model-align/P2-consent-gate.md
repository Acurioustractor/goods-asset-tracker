# P2: consent gate enforced in code (default-deny)

*2026-06-18. Build green (EXIT=0). Nothing committed or pushed.*

## What was wrong

The three open-web pages showed more than the consent-cleared set:
- `/community` rendered the raw EL roster with no consent filter (only `isRealPerson`, a team/system-account heuristic).
- `/gallery` mapped the EL roster with no consent/internal filter.
- `/stories` filtered only by `isPublicStoryteller` = "not an internal staff name AND has a quote" (a blocklist + falls back to RAW EL quotes), not a clearance allowlist.

## The gate

New module `v2/src/lib/data/cleared-voices.ts` exports `isClearedForExternal(name)`:
- Allowlist = the 32 names in the `cleared-voices` canon fact (`canon.ts`), the OCAP-strict set Ben cleared 2026-06-17 for funder/public-web/QBE use. The broader `display-storyteller-pool` is deliberately NOT used (canon.ts calls it "a coverage queue, not a clearance list").
- DEFAULT-DENY: a voice renders externally only if its normalised name matches. Matching is tolerant (case, whitespace, parentheticals like "(Jupurrurla)", punctuation, "&"/"and"); known alias spellings included (Ivy / Ivy Johnson, Dr Boe Remenyi / Boe Remenyi, Carmelita & Colette / and).

## Wiring

- `stories/page.tsx`: `isPublicStoryteller` now also requires `isClearedForExternal(p.name)`; the local fallback path now also `.filter(isPublicStoryteller)`.
- `community/page.tsx`: `getProjectData` now `.filter(isRealPerson).filter((s) => isClearedForExternal(s.name))` (gates both the StatsBar count and the grid).
- `gallery/page.tsx`: the resolved `storytellers` array (EL or fallback) is `.filter((s) => isClearedForExternal(s.name))` before photos are built.

EL exposes no per-storyteller consent flag to the syndication client, so the canon name-list is the available gate.

## MUST verify post-deploy (cannot test here)

This build env has no EL creds (EL returns 401 -> empty), so the build exercises the LOCAL fallback, not the live EL roster. In production the filter runs against live EL names I could not observe.
- After deploy, open `/stories`, `/community`, `/gallery` and confirm: (a) only cleared voices appear, and (b) no CLEARED person is wrongly hidden by a name-spelling mismatch. If someone is missing, add their EL spelling to `CLEARED_VOICES_EXTERNAL` in `cleared-voices.ts` (default-deny is the safe direction).
- `/community` has no fallback: if the live EL roster name-matching is too strict it could render sparse. Watch the count.

## Note / future

- Practitioner voices (Dr Boe Remenyi, Chloe, Wayne Glenn) are in the allowlist but must still be LABELLED as practitioners in the UI (a P4 / content concern, not gated here).
- The allowlist duplicates the 32 names from the `cleared-voices` definition string in canon.ts. A later refactor could make canon.ts import the array from this module so there is one literal source.
