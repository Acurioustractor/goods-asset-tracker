# First weekly ledger batch — manifest (2026-06-08)

Drafted via the `/ledger-story` skill off the Loop E `wiki/canon/story-coverage.md` queue.
Drafts only: nothing published, no consent flag flipped. All 26 drafts validate exit 0
against `check-story-draft.mjs`. Files live in `wiki/outputs/ledger/2026-06-08-<slug>.md`.

The cleared-voice pool was 32 named voices. 26 drafted, 6 deliberately not drafted (below).

## Drafted (26)

### Verified portrait, local repo (8)
Alfred Johnson (Palm Island), Brian Russell (Tennant Creek), Cliff Plummer (Tennant Creek),
Dianne Stokes (Tennant Creek, Elder), Ivy (Palm Island), Linda Turner (Tennant Creek),
Norman Frank (Tennant Creek), Patricia Frank (Tennant Creek).

### Verified portrait, Empathy Ledger avatar (15)
Annie Morrison (Tennant Creek), Fred Campbell (Alice Springs), Melissa Jackson (Tennant Creek),
Jimmy Frank (Tennant Creek), Risilda Hogan (Tennant Creek), Heather Mundo (Katherine),
Daniel Patrick Noble (Palm Island), Jason (Palm Island), Gloria Turner (Kalgoorlie, Elder),
Chloe (Kalgoorlie, worker), Tracy McCartney (Kalgoorlie, worker), Wayne Glenn (Darwin, worker),
Carmelita & Colette (Palm Island, pair), Kristy Bloomfield (Alice Springs, Oonchiumpa),
Gary (Mount Isa).

### Voice byline, no portrait (3 — Utopia/Oonchiumpa, extra consent care)
Karen Liddle (Alice Springs), Katrina Bloomfield (Alice Springs), Shayne Bloomfield (Alice Springs).

## Not drafted (6) and why
- **Mark** — EL has no matching "Mark" (search fuzzy-matched a different person); no community recorded in the repo. Too unanchored to ground a post. Resolve identity/community first.
- **Walter** — his curated-quotes quote ("Good sleep. No sound, no people shouting. Just quiet.") is a verbatim duplicate of Fred Campbell's. Attribution is unclear; fix the data before drafting.
- **Kylie Bloomfield** — no verbatim quote in cleared sources (her curated-quotes entry is empty; the site falls back to the EL API). Pull a cleared quote from EL if you want her drafted.
- **Nicholas Marchesi** — co-founder; curated-quotes itself marks him internal. Not a community-voice weekly post.
- **Georgina Byron AM** — Snow Foundation funder. A funder/partner voice, not a community ledger post.
- **Dr Boe Remenyi** — clinician / RHD advocate. An expert/partner voice, not a community recipient.

(The last three could carry a different artifact type, a "partner voice", but not this weekly community ledger.)

## Cross-cutting flags for review
- **Elder status:** Annie Morrison recorded "Elder" in the repo but EL says elderStatus=false (draft drops the Elder claim, flagged). Gloria Turner and Kristy Bloomfield are EL elderStatus=true (named as Elders).
- **Place corrections via EL:** Gloria Turner is Kalgoorlie WA (Wongatha Country), not Tennant Creek as earlier triage implied. Tracy McCartney conflicts: EL Kalgoorlie vs repo Mt Isa (unresolved; draft uses EL, flagged).
- **Names:** Shayne vs Shane Bloomfield (do not normalise); double-space curated keys (Alfred Johnson, Daniel Patrick Noble, Carmelita & Colette); first-name-only display names (Ivy, Jason, Gary, Chloe).
- **Portraits:** 23 posts carry a verified portrait (8 local + 15 EL). Every EL portrait needs two human steps before publish: confirm consent to use it on the chosen surface, and decide hot-link EL vs commit a local copy to v2/public/images/people/. 3 posts (Karen, Katrina, Shayne) carry no face by design; do not pair them with an unverified photo (the Utopia photo-mismatch lesson).
- **Register:** Chloe, Tracy, Wayne Glenn are frontline worker voices; Kristy, Karen are leader/partner voices. Place them accordingly versus recipient voices.

## What this batch did NOT do
No publishing, no consent flips, no writes to EL/GHL/Notion/social, no images committed to v2/public/.
Promotion of any EL portrait into the repo, and all publishing, are Ben's verbs.
