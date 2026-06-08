# Loop E — story + illustration coverage (runbook)

The fifth and final loop of the Goods Alignment Engine. Hand-authored; the detector's
generated report lives next to it at `story-coverage.md` (regenerated every run, do not
hand-edit). Companion runbook to Loop C's review docs.

## What Loop E is

Loops A/B/D keep **numbers and evidence** aligned. Loop E keeps the **story and
illustration surface** aligned and moving: it answers "which cleared voices still have no
weekly post, is the weekly cadence overdue, and which key explainer topics still have no
brand illustration?" and writes a ranked build queue.

Loop E does **not generate anything**. Generation is the two existing skills, run by a
human, drafts only, consent re-gated each time:

- `/ledger-story` — weekly post, monthly field note, quarterly funder cut.
- `/goods-illustrations` — brand line illustrations for processes/concepts.

The detector is the dispatcher; the skills are the hands. This keeps generation on the
night-shift/human-in-loop side of the Tier line (drafts only, never publish, never flip
consent) while the detector stays a hermetic, CI-safe read.

## The detector

`v2/scripts/check-story-coverage.mjs` (wired as `npm run check:story-coverage`, and into
both `check:drift` and the hermetic `check:drift:ci`, so it runs in CI with no secrets).

Reads, write-free:
- **Cleared-voice pool** = `curated-quotes.ts` keys ∪ `trip-stories.ts` VoiceCards with
  `consent: 'cleared'` (mirrors `ledger-story/CONSENT.md` sources 1-2; the EL live check is
  out of scope for a hermetic script). Unnamed role labels ("Elder", "Family member") are
  cleared but excluded from the weekly-post backlog (not draftable as one-face-one-voice).
- **Weekly coverage** = front-matter `storyteller:` across `wiki/outputs/ledger/*.md`.
  Cadence = days since the newest `YYYY-MM-DD-*.md`, target 7 days.
- **Illustration coverage** = `goods-ill-*.png` in `v2/public/images/brand` (promoted) vs
  draft sets in `generated-images/goods-illustrations/`, against an inline registry of key
  explainer topics.

Writes `wiki/canon/story-coverage.md`. **RED-safe:** emits only counts and already-public
cleared display_names; never quotes, transcripts, or recipient data.

Exit semantics (same shape as Loop D):
- **Hard fail (exit 1):** a ledger draft whose `storyteller:` is not in the cleared roster
  (a possible consent leak), or an unreadable registry. Integrity only.
- **Warn (exit 1 under `--strict`):** coverage/cadence gaps. Never blocks CI by default.

## Run it

```bash
cd v2 && npm run check:story-coverage     # warn-only (what CI runs via check:drift:ci)
cd v2 && node scripts/check-story-coverage.mjs --strict   # fail on gaps too
```

Then open `wiki/canon/story-coverage.md` and act on the top of the build queue.

## Generation runbook (human, drafts only)

1. **Weekly post.** Take the top unfeatured cleared voice from the queue →
   `/ledger-story` for that person. It re-runs the full consent gate (incl. EL + Ben),
   picks one photo + one verbatim quote, drafts to `wiki/outputs/ledger/YYYY-MM-DD-<slug>.md`.
   Validate: `node .claude/skills/ledger-story/scripts/check-story-draft.mjs <file>`.
2. **Illustration.** Take a `missing` topic → `/goods-illustrations` for it. Drafts land in
   `generated-images/goods-illustrations/<slug>/`. A `draft-only` topic just needs Ben to
   approve promotion into `v2/public/images/brand/goods-ill-<slug>.png`.
3. **Re-run the detector.** The new draft moves the voice/topic to covered; the queue shrinks.

Cadence target: one weekly post. Field notes monthly/per trip. Funder cut quarterly.

## Known caveat: the consent-tier mismatch

The pool (~32 named) and canon `cleared-voices` (6) differ **by design, not drift**. Canon
counts the narrow "cleared to publish/weave" community set; the pool counts everyone with a
public curated quote or a cleared trip VoiceCard (includes partners/board). This is the open
"3 deck / ~25 display / 6 canon" question. The detector reports both and never hard-fails on
the gap. The skill re-runs the full consent gate before any draft, so the pool is a coverage
queue, not a clearance list. Resolving the tier definition is a separate human decision.

## What Loop E deliberately does not do

- Generate, publish, or flip any `consent`/`published` flag (those are Ben's verbs).
- Decide consent — it only reads recorded cleared state.
- Push images into `v2/public/` or write story drafts (the skills do that, human-triggered).
- Reach Empathy Ledger, GHL, Notion, or any external system.

## Cadence for running Loop E

The detector runs free in CI on every PR (`check:drift:ci`). Act on its queue on the story
cadence: weekly for the post, monthly for the field note, quarterly for the funder cut. No
separate schedule needed; the generated `story-coverage.md` is the standing worklist.
