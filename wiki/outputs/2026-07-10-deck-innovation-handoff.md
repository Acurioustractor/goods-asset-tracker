# Investor deck — session handoff (2026-07-10)

*Handoff from the Claude Code web session that built the `/deck` route, the Claude Design
artifact, and ran the 30-agent deck-innovation workflow. Written so ANY future Claude
session (Cowork desktop, web, CLI) can resume without the original conversation.*

**Resume prompt (paste into a new Claude session in this repo):**
> Read `wiki/outputs/2026-07-10-deck-innovation-handoff.md` and continue the investor-deck
> work from where it left off. Respect the honesty gates in that doc and in CLAUDE.md.

---

## 0. Session log — resumed 2026-07-11 (Cowork desktop)

Ben's calls this session: build on the **current** working branch (`docs/snow-onepager-assets`,
focused commits, cherry-pickable); scope = the "Now" items; `/deck` stays public + noindex;
**Claude Design is the design source of truth** (not Canva, and the Google Slides deck is
parked — see below).

**Done (build order §4 "Now" row is complete):**
- `/deck` + `design/deck/claude-design-artifact.html` + this wiki pack ported off the
  handoff branch into the working tree; `'/deck'` added to `conditional-chrome.tsx`.
- **Leak fixed:** the withheld AU$741k figure no longer ships in `/deck` client JS or the
  design source (the risk row states the hold without naming the number). It still exists
  in older tracked files (`canon.ts` [amber, by design], `impact-model.ts`, `grant-content.ts`,
  QBE/sites surfaces, `design/brand/claude-design/*`) — sweep separately if those are public.
- **`v2/src/lib/data/claims-ledger.ts`** — default-deny external-claims gate over `canon.ts`
  (the canon `dataClass` green/amber/red does the heavy lifting): statement, status
  (verified/modelled/interest/future/**locked**), ceiling, evidence, flip date.
  `assertLedgerSafe()` throws at module load if a locked claim carries a figure/digits or a
  figure dereferences a non-green fact — the structural regression test for the leak class.
- **`/register`** — the public Claims Register page (anti-claims cold open, grouped claim
  rows, dated changelog, the 30 Sept diff appointment). Deck closing + risks slides link to it.
- **Claude Design workflow:** committed source stays image-light (repo paths); derived,
  NOT committed: `goods-investor-deck-publish.html` (photos base64-embedded per §1 spec —
  paste/publish to the claude.ai artifact URL in §1 from a claude.ai session) and a live
  **Cowork artifact `goods-investor-deck`** for in-app preview/iteration (update via
  Cowork's update_artifact with the same id).

**Parked:** the Google Slides deck image repair
(`thoughts/shared/handoffs/general/2026-07-11_07-07_google-slides-image-repair.yaml`).
No Slides connector in the Cowork session; the Drive connector cannot see the file; the
Chrome extension content-script pipeline was wedged. Ben said concentrate on Claude Design.
The yaml's PPTX-rebuild fallback stands if the Slides copy is ever needed again.

**Next (per §4):** ClaimChips/EvidenceDrawer into `/deck` reading `claims-ledger.ts`;
The Experiment (50-bed pre-registration) page; PDF snapshot export of the register.

**Later on 2026-07-11 the work moved narrative-first (Ben's call):** see
`wiki/outputs/2026-07-11-narrative-foundation.md` (model definition + all voices/communities —
Ben-gated) and `wiki/outputs/2026-07-11-codex-ultraplan-handoff.md` (the plan run for stories,
tone, theory of change). Deck spine work resumes only after the model definition is signed.

---

## 1. Where everything lives

| Thing | Location |
|---|---|
| Branch (all work pushed) | `claude/investor-deck-structure-4xm6bh` (commits `48cd1e3`, `2db7bce`, + this handoff) |
| The 14-slide deck route | `v2/src/app/deck/page.tsx` + `layout.tsx` (chrome-free via `conditional-chrome.tsx`; noindex) |
| Claude Design artifact (live) | **https://claude.ai/code/artifact/ac9651e1-97e7-4451-a07b-8687bab8de84** — a future session updates the SAME url by passing `url:` to the Artifact tool (or finds it via the Artifact tool's `action: "list"`). Titled "Goods on Country · Investor Deck", favicon 🛏️. |
| Artifact design source | `design/deck/claude-design-artifact.html` — same HTML as the artifact but images point at `/images/media-pack/*.jpg` repo paths. To re-publish: re-embed the 4 photos as base64 data URIs (compress with `sharp`, widths 1600/1200/1200/1200, quality ~76–78), then publish via the Artifact tool with the `url` above. |
| Innovation research (readable) | `wiki/outputs/2026-07-10-deck-innovation-research.md` — 6 concepts, judge verdicts, critique |
| Innovation research (raw) | `wiki/outputs/2026-07-10-deck-innovation-research.json` — full verdict texts + the 5-auditor digest |
| Canon numbers | `v2/src/lib/data/asset-canonical.ts` (496 beds / 9 communities / 16 washers / 2,660kg) |
| Consent allowlist | `v2/src/lib/data/cleared-voices.ts` (default-deny; only these voices externally) |
| Canonical photos used | `v2/public/images/media-pack/`: `lying-on-stretch-bed.jpg` (cover), `thumbs-up-stretch-bed.jpg` (product), `community-testing-bed-golden-hour.jpg` (traction), `nic-with-elder-on-verandah.jpg` (team) |

Deliverables already sent to Ben (regenerable, not committed): a standalone single-file
HTML deck (base64 images embedded) and a 14-page 16:9 PDF for Canva import (render
`design/deck/claude-design-artifact.html` slides at 1600×900 via Playwright + `page.pdf`).

## 2. What the deck is now (the baseline)

14 slides implementing the classic discipline (Airbnb one-line cover, LinkedIn thesis
open/close, Uber why-now, Buffer traction-forward, Hoffman risks, Mint money-flow), with:
canon numbers only, verified/modelled/interest/future label pills, cleared voices only
(Alfred Johnson ×2, Ivy, Dianne Stokes, Norman Frank), 4 media-pack photos, keyboard +
click-zone nav, Goods brand (cream `#FBF8F1`, terracotta `#C45C3E`, Georgia serif).

## 3. The decision from the innovation workflow

**Winner: "The Register — a deck that audits itself" (avg 8.0/10)**, composited with the
best grafts from the runners-up:

1. **Spine — The Register:** every external number becomes a claim object in a new
   `claims-ledger.ts` (default-deny, modelled on `cleared-voices.ts`): statement, status
   (verified/modelled/interest/future/**locked**), evidence refs, promised flip date.
   Deck renders numbers as ClaimChips; clicking opens an EvidenceDrawer (live canon
   rollup + drift-check, invoice OCR lines, consent records). Anti-claims cold open
   (what Goods does NOT claim). The 50-bed run pre-registered as a falsifiable
   experiment with publish-either-way pledge. Dated changelog + "come back 30 September
   and diff this deck."
2. **Opener graft — Bed №497 (physical kit):** pressed-HDPE offcut + canvas swatch + QR
   resolving to a reserved serial in the real asset register, honestly labelled FUTURE;
   a funder's signed commitment writes an event on that bed's timeline.
3. **Cost chapter graft — the freight meter:** the road travelled twice; verified $685
   out, modelled $421 back; the delta is the ask.
4. **Close graft — The Deal Room:** funder drags their cheque into the live capital
   stack (QBE 1:1 match meter, trough coverage, ownership-transfer date respond), deck
   ends rendering a DRAFT–NON-BINDING term-sheet skeleton with their name.

**Two blind spots the completeness critic found — must be fixed in whatever ships:**
- Community as presenter, not just subject: an Elder-delivered segment + a visible
  "the future owners reviewed this pitch" consent artifact.
- A second life after the meeting: signed, dated ledger-snapshot **PDF export** for
  investment committees (champions forward PDFs, not gated URLs).

## 4. Build order (against real deadlines)

| When | What |
|---|---|
| **Now (<1 week)** | Public **Claims Register page**: every headline number as a row tagged measured/modelled/aspiration + source link + flip date. The substrate five of six concepts presuppose; raises conviction even if the deck stays a PDF. Also fix: `/deck` currently ships the withheld AU$741,111 in client JS on an ungated route (judge finding) — remove or gate it. |
| By end July | `claims-ledger.ts` + ClaimChips/EvidenceDrawer into the /deck chassis; The Experiment (50-bed pre-registration) page; PDF snapshot export. |
| By mid-Aug | Deal Room close (`/deal/[slug]` capital-stack builder + term sheet skeleton, per-funder via `funder-pages.ts`); Bed №497 physical kits (founder afternoon at factory). |
| 31 Aug | First signed match-eligible commitment (the deck's own "future" claim flips). |
| 30 Sept | The diff appointment — lands right on QBE Stage 2. |

**Engineering cautions from the judges:** cached last-known-good fallbacks for every live
number (a failed drift-check on viewing day is disproportionately damaging); LOI ladder
aggregate-only (never other funders' identities/stages); bed embeds need a stripped
no-PII variant of `/bed/[id]`; changelog snapshots generated from the rendered ledger
only (guard-test against the LOCKED revenue figure leaking, as it does today).

## 5. Non-negotiable gates (recap; full rules in CLAUDE.md + investor-pack outline)

- **Consent:** only `cleared-voices.ts` names; only media-pack/cleared imagery.
- **Claim ceiling:** scabies→RHD = the why, never an outcome; 200–350 requests =
  interest, not revenue; $685→$421 cost-down = MODELLED until the 50-bed run measures it;
  revenue held at AU$741,111 publicly until the accountant signs one Goods-only figure.
- **Canon numbers only**, from `asset-canonical.ts` — never hardcode.
- **The ask:** AU$400K recoverable grant converting to community ownership, ≥1:1
  match-eligible. Credit line: "Catalysing Impact, powered by Social Impact Hub, in
  partnership with QBE Foundation."

## 6. Open questions for Ben

1. Gate `/deck` behind a password like `/investors`? (It is public-but-noindexed today.)
2. Open a PR to deploy the branch → real shareable `/deck` URL?
3. Canva vs code as the design source of truth (a 16:9 PDF was exported for Canva import
   on 2026-07-10 — if Canva edits happen, the code deck and Canva copy will drift).
4. Accountant sign-off timing (unlocks the revenue claim before mid-Aug?).
