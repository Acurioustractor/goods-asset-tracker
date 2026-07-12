# Codex ultra-plan handoff — stories, tone, theory of change (2026-07-11)

*Written by the 2026-07-11 Cowork session for a Codex planning run. The repo is the handoff:
all work is committed on `docs/snow-onepager-assets` (5 commits today, listed below). Codex's
job is to produce THE PLAN that finishes and reviews all stories, tone, and theory of change —
then execute only what is not Ben-gated.*

**Prompt for the Codex session:**
> Read `wiki/outputs/2026-07-11-codex-ultraplan-handoff.md`. Produce a complete, file-level
> plan to (1) finish + review every story surface, (2) enforce tone/voice, (3) reconcile the
> theory of change with the model definition. Respect every gate in §2. Plan first; touch
> nothing Ben-gated.

---

## 1. State as of this handoff

**Today's commits (this branch, on top of origin):**
- `f944623` /deck ported + Claude Design source; withheld-revenue figure removed from client JS
- `aa8b4a9` claims-ledger.ts (default-deny over canon.ts dataClass) + public /register
- `94316af` deck-innovation research pack + session log; Google Slides repair PARKED
- `751c3fa` **narrative foundation** — `wiki/outputs/2026-07-11-narrative-foundation.md` (all voices, all communities, all current action, model draft, 10 Ben decisions)
- `3206b40` voice rule: never "co-design" → designed in community; CLAUDE.md gates added

**Working order Ben set:** narrative sign-off → deck spine → photo pass → model development
(diagrams). The narrative foundation §1 (model definition) is **awaiting Ben's sign-off** —
the spine does not start before it. Ben's model emphasis: very clear model definition, then
diagrams that explain it, then stories of people with specific quotes, aligned on community
ownership; the why = best products designed in community + ongoing enterprise support,
reducing RHD and ongoing health issues.

**Design source of truth:** Claude Design — `design/deck/claude-design-artifact.html`
(committed, image-light) kept in lockstep with `v2/src/app/deck/page.tsx`. Cowork artifact
`goods-investor-deck` renders it live; publish embed is regenerable (4 media-pack photos,
widths 1600/1200/1200/1200, JPEG q77). Google Slides deck: parked (see
`thoughts/shared/handoffs/general/2026-07-11_07-07_google-slides-image-repair.yaml`).
Canva: dead end, do not revive.

## 2. Gates — non-negotiable in any plan Codex writes

1. **Consent:** only `v2/src/lib/data/cleared-voices.ts` names externally (32, default-deny).
   Practitioners labelled as practitioners. Holds: Walter, Jessica Allardyce, Zelda Hogan
   (website-only), Kylie Bloomfield, Georgina Byron (funder-only). Xavier = Fred narrates,
   never direct. Mykel/Xavier = young people, youth-care framing, Oonchiumpa guardianship.
2. **Voice/tone (CLAUDE.md Brand Voice):** NEVER "co-design" — *designed in community /
   designed with community*. Ownership = pathway, never complete. scabies→RHD = the why,
   never a claimed outcome. Demand (200–350 requests) = interest, never revenue.
3. **Numbers:** canon only (`asset-canonical.ts` via `canon.ts`); external figures only from
   dataClass-green facts via `claims-ledger.ts`. Consolidated revenue is LOCKED (no figure,
   anywhere external) until the accountant signs one Goods-only number.
4. **Ben-gated (plan around, do not execute):** model-definition sign-off; the 10 decisions in
   narrative-foundation §6 (Utopia 107-vs-87, washers 16-vs-10, NPY 200–350 promotion,
   Jessica consent, Homeland invoice figure, etc.); anything touching money copy.

## 3. The ultra-plan scope

### A. Finish + review ALL stories
Surfaces: `v2/src/app/{stories,storytellers,story,field-notes}` · data:
`curated-quotes.ts, trip-stories.ts, community-stories.ts, story-atoms.ts,
community-narrative.ts (9 Jul — freshest quote picks), content.ts journeyStories (fallback
while EL has 0 published), supplier-quotes.ts` · indices:
`wiki/outputs/2026-06-18-goods-storyteller-library-index.md` (roster),
`2026-06-17-storyteller-quote-decision-sheet.md`, `2026-07-11-narrative-foundation.md` §3
(turn assignments). The plan should cover: every cleared voice has a correct, current quote +
tier on every surface it appears; known conflicts resolved or queued (which Ivy; Gloria Turner
place; Tracy McCartney place; Annie Morrison Elder claim; Dianne totem line = hold for her
say-so); portrait gaps (Ray Nelson, Dr Boe Remenyi); Zelda in journeyStories never flows to
funder exports; Jimmy Frank's Weave Bed line never used (product discontinued); anonymous
Arlparra/Arawerr lines used only as marked; EL privacy migration means counts are unstable —
site consent gates are the safeguard, consume the EL consent flag when it lands.

### B. Tone pass
The co-design sweep: 16 files still carry it (display strings vs `theme: 'co-design'` DATA
KEYS in content.ts — keys need a migration plan, don't just sed). Then a voice audit of story
surfaces + /impact + partner pages against CLAUDE.md Brand Voice (warm, grounded,
community-first; centre Indigenous agency; no AI-corporate diction). Flag every "co-design",
"empower", "beneficiary", charity-frame phrase for rewrite in community-led language.

### C. Theory of change
Assets: `design/goods-theory-of-change-v2.pen` (**modified, uncommitted in the working tree —
pre-existing WIP, do not clobber; needs the Pencil MCP to read**), `goods-theory-of-change.pen`
(v1), `v2/src/components/marketing/theory-of-change.tsx` (renders on /impact; also
insiders page + impact-summary API). The plan should reconcile the ToC with the model
definition in narrative-foundation §1: five-stage loop (listen/be asked → designed in
community → made on Country in community hands → deliver + feedback → transfer + ongoing
enterprise support), two products through the loop (Stretch Bed, Pakkimjalki Kari), many hands
(Elders/families/young people/local orgs), outcomes stated as pathway + why (never claimed
health outcomes). ToC copy, /impact metrics tiers, and the deck's model slides should all read
as ONE model.

### D. Then (sequenced after Ben's sign-off)
Deck spine per foundation §2 (six belief turns; model first, diagrams, ask last) → photo pass
(`design/deck-photos/` 31 files + `pitch-photo-review.ts` + media-pack; 7 of 9 communities
have NO usable place-attributed public media — plan honestly around that) → model diagrams
(the five-stage loop, plant-transfer stages, place circuit) in the Claude Design language.

## 4. Source map (fast orientation)

Narrative: `wiki/outputs/2026-07-11-narrative-foundation.md` (START HERE) ·
deck: `v2/src/app/deck/` + `design/deck/claude-design-artifact.html` ·
register: `v2/src/app/register/` + `v2/src/lib/data/claims-ledger.ts` ·
canon: `asset-canonical.ts` → `canon.ts` (dataClass green/amber/red) ·
consent: `cleared-voices.ts` ·
communities/action inventory + 12 contradictions: foundation §4–6 (sources:
`compendium.ts` deployments = canonical per-community cut; wiki community articles are STALE —
March numbers) · pipeline: `wiki/outputs/2026-07-03-pipeline-strategy.md` (QBE: 0 signed LOIs,
≥3 by 31 Aug, $400K cap, Stage 2 Sept) · prior deck research:
`wiki/outputs/2026-07-10-deck-innovation-handoff.md` (§0 = current state) ·
environment quirks for local agents: git ops leave stale `.git/*.lock` on this mount
(rm between ops); dev server :3001 usually off; tsc works, build doesn't (sandbox).

## 5. Definition of done for the plan run

A plan is complete when: every §3 item maps to file-level tasks with owners (Codex vs Ben),
every Ben gate is a named decision checkpoint (not silently resolved), story/tone/ToC work is
sequenced against the narrative sign-off, and nothing in the plan can emit an uncleared voice,
a co-design, an ownership-complete claim, a health-outcome claim, or the locked revenue figure.
