# Handoff — six front doors + homepage design (2026-07-26)

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume. Keep it short. -->
**Updated:** 2026-07-27 (afternoon). **main = `4a13850`.**

**▶ 0x. 2026-07-27 AFTERNOON SESSION (graph-methodology build + the merge/revert):**
FOUR PRs MERGED and LIVE: #167 `check:register` per-community judge (community-canonical.ts,
every count ruling in code w/ citations, in check:drift), #168 admin route-directory guard +
register scoreboard on /admin/assets, #169 `check:content-gate` (consent→claims→voice, rules
parsed from sources, JSON report panel on /admin/consent), #170 gate refinements ("20kg" ≠
retired 20-washers; `voices:`/`consent:` frontmatter; file-true line numbers).
**SIX-FRONT-DOORS: merged as PR #171 then REVERTED same hour (PR #173) — Ben did NOT want
the new site on production.** OLD SITE IS LIVE. The branch survives on
`origin/feat/six-front-doors` (14 commits, rebased onto the guard PRs, all gates green at
merge time); re-land = review localhost:3105 → one PR (revert-of-revert `4a13850` or fresh).
Consequences of the revert: Jahvan's clearance is OFF main → Aug drafts back to **5/7**
through the content gate (his post + newsletter blocked, correctly); PR #172 (7/7 report)
CLOSED as stale — reopen/refresh after re-land. Aug frontmatter fixes (voices/consent_source,
incl Jahvan honestly named in the newsletter) are IN Ben's uncommitted wiki/outputs/ledger
files. Film consent "merge as-is" call was made but is MOOT post-revert; the three film
gates stand. LESSON (recorded in memory): a merge that flips a user-facing surface needs
"have you actually seen it?" in front of it, even with an explicit merge verb.

Branch state below (0y onward) predates the push/merge/revert; read it as history.
Old worktree `/private/tmp/claude-501/goods-six-doors` still exists (branch now pushed).

**▶ 0y. 2026-07-27 MORNING SESSION (workbench/Miro/story, no app-code changes):**
Notion workbench playground pages live (LOI scoreboard w/ embedded pipeline view, five
blockers tracked, Maningrida film gates). Miro = NEW PAID ACCOUNT, board "Goods Pitch
Vision Board" `https://miro.com/app/board/uXjVH9LHVaI=/` — 6 frames built (00 corrections,
WHY/PROOF/MONEY-playground/OWNERSHIP/LOOP); Ben edits it live, layout_read before update.
Asset folder `media/miro-playground/` (1.2GB, gitignored). **Brand images were JPEG
mislabelled .png → renamed .jpg** in `v2/public/images/brand/` + `generated/` — STAGED
UNCOMMITTED on `feat/story-road` in the MAIN tree (safe: only pitch-cockpit listPng reads
them, accepts jpg; starred-images untouched for .pen paths). Margaret Lloyd LinkedIn draft
at `wiki/outputs/ledger/2026-07-27-margaret-linkedin-draft.md` — open checks: image consent
if Margaret in frame; "Wenitong" spelling unverified (Wutunugurra/Epenarra is a DIFFERENT
community, never equate). Full detail: memory `goods-funding-workbench-miro-2026-07-27`.

**▶ 0z. NEW THIS SESSION (2026-07-26 evening), all committed on the branch:**
Maningrida = 5th canonical pathway (`community-pathways.ts`, stage learn, no caseStudy until a
Maningrida voice clears) + not-eligible ownership-test record. **Jahvan Oui = 35th cleared
voice** (canon 34→35 lockstep; quotes verbatim from Descript `6hVl3CzxdqR`, Speaker 24
confirmed by Ben; portrait `v2/public/images/people/jahvan-oui.jpg`; Ebony NOT cleared).
Palm Island caseStudy built from its SIX cleared voices (was wrongly treated as empty; EL holds
51 Palm storytellers, mostly historical archive - check project scope). **History layer**:
`history: {date,event,source}[]` required + guarded on every pathway, backfilled x5.
**AUG CONTENT MONTH drafted** in `wiki/outputs/ledger/2026-08-*.md` (MAIN tree, uncommitted):
Dianne→Mykel→Dorrie→Jahvan weekly posts, newsletter Aug 26, 12 socials; Alfred post = reserve;
all pass check-story-draft.mjs. **GATE: merge this branch before Aug 24** (Jahvan portrait).
**Strategy-board fixes for Ben's frame:** stage 1 = Yarn not Listen; modules = NINE (Money
was missing); Oonchiumpa next decision = "reconcile DEWR scope" not "confirm funding";
Palm Island header = listening-first. Preview: http://localhost:3105
(prod server; restart: kill listener on 3105, then `PORT=3105 npm start` in the worktree v2/).

**▶ 0a. MANINGRIDA FEATURE FILM — REFERENCE CUT ONLY, awaiting master + consent (Ben ruling:
"just a reference to consider until we get the main version").** Source "goods edit v1"
(640x360 PROXY, 3:53) master-parked at `media/maningrida/goods-edit-v1.mp4` (outside git);
14MB web cut + poster committed at `v2/public/video/maningrida/build-feature.mp4` (`89d2019`),
rendered click-to-play on `/` after the compact story. Transcript: `media/maningrida/audio.srt`
(whisper mishears: Garmody=Gamardi, Woodson Country=Goods on Country, "Namalaya" @3:35
unresolved). Claims verified vs canon (40 beds = register; "hundreds" < 540).
**GATES BEFORE PUBLIC: (1) full-res master swaps in at the same path, (2) Ben confirms
production consent for kids/unnamed adults on camera, (3) caption name fixes.**
Integration plan agreed in session: homepage = proof moment (+ possible 15-20s muted hero
loop cut from master); /story/road stop 6 = permanent home; /pitch/road = poster-frame link
only; segment cuts (why 0:30-0:58, how 1:43-2:07, kids building, washing machine at school)
for pathways/product/sponsor pages. Tag trip media into EL `community:maningrida` so the
picker folder fills.

**▶ 0b. Other this-session state:** EL swap picker restored on every homepage slot
(hero photo-or-video, overrides slug 'home'; picker is Goods-project-scoped — 149 public
assets / 22 videos; cross-project hunting only via /admin/photos-browser). EL APIs verified
working. Font lock ALIGNED: tokens.css + .pen vars = Playfair Display / Inter (`9bd4365`).
Homepage voices all registry tier external. DEFERRED by Ben to a proper session: third-door
target (/pitch/road vs investors) + "centre the whole story on the Maningrida trip".

**▶ 0. HOMEPAGE A IS BUILT IN CODE** (commit `07b687b` on `feat/six-front-doors`, still LOCAL,
NOT pushed). `/` renders entirely from `v2/src/lib/data/home.ts` (guarded by
`home.guards.test.ts`: consent, canon figures, six-stage model, road-spine lessons, photos must
exist under `public/` and never be starred-images paths). Photos are the git-tracked Maningrida
set + people portraits. Voices rail = Gloria Turner / Dianne Stokes / Fred Campbell, quotes
resolved verbatim from `curated-quotes.ts` at render. `/shop` rebuilt spec-first (ruling S sweep
item done): `shop.ts` SHOP_ANSWERS leads the page — spec, price ($750 from canon), lead time and
freight stated honestly (no measured figures exist, so no numbers invented), QR repair path.
Gates GREEN: tsc, 378 tests, drift, voice, build. Prod server rebuilt + restarted on
http://localhost:3105 (home + /shop verified 200 and content spot-checked).

**▶ 1. SITE CONSOLIDATION BUILT, LOCAL ONLY, NOT PUSHED.** Worktree
`/private/tmp/claude-501/goods-six-doors`, branch `feat/six-front-doors` off `origin/main`,
2 commits (`e2aec16`, `07d564d`). ~21 duplicate routes retired as permanentRedirects
(control-room pattern), ruling S written in `/DECISIONS.md` with sweep list, nav updated,
`audience.ts` servedBy updated. Gates GREEN: tsc, 369 tests, drift, voice, build.
All redirects curl-verified on http://localhost:3105 (prod server, may still be running,
task in that worktree). `/community` redirect lives in next.config (proxy intercepts it
otherwise). **Ben has NOT approved push/PR yet — review on localhost:3105 first.**
Review record: `thoughts/shared/reviews/2026-07-26-public-site-review.md`.
Notion page: https://app.notion.com/p/3a9ebcf981cf810b9537dc7e3aa19266

**Sweep-list still open (ruling S):** delete dead `/media/page.tsx`; `/impact` orphaned login;
server gates for `/production/*` + `/partners/[slug]/dashboard`; spec-first `/shop` rebuild;
plain mission explanation as guarded data.

**▶ 2. HOMEPAGE MOCKS IN PENCIL.** `design/goods-theory-of-change-v2.pen` (MAIN working tree,
uncommitted, Pencil autosaves): three 1440px frames — A "The Bed on Country" (Ben's pick,
restructured to his order: hero → compact story+link → full Stretch Bed section+buy →
production facility+6 stage chips+links → voices rail → road band (stops = LESSONS not place
names) → three doors), B "Elder-Led" (hero quote is an EXPLICIT PLACEHOLDER — a real EL quote
must be dropped in; NEVER invent a quote, one was caught and removed), C "Factory Ledger"
(claim-label stats: verified=gold, unevidenced=grey tag — Ben liked the honesty device).
All photos are REAL from `design/starred-images/` (relative `./starred-images/...` fills).
Fonts used: Playfair Display + Inter (what the app actually loads); tokens.css says
Georgia/Archivo and the pen variables say Newsreader/Funnel Sans — three-way drift, needs a
ruling. Inspiration synthesis (CTG provenance badge, Winya artist attribution, WGAC arithmetic
give, Precious Plastic map, claim-label ledger) in the review record session notes.

**Next:** Ben walks localhost:3105 + the Pencil frames → approves push/PR of
`feat/six-front-doors` → then build Homepage A for real in code (spec-first /shop is part of it).
