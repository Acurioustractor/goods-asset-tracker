# Utopia story — audience, funnel & repackaging plan

> **Date:** 2026-05-26
> **Trigger:** Benjamin Croft's review of `/field-notes/utopia-may-2026` (25 May 2026)
> **Status:** PLAN — awaiting Ben's decisions before any build
> **Related:** funnel work shipped 2026-05-26 (per-card CTAs + capture block on the field-notes page); handoff `wiki/outputs/2026-05-23-field-notes-utopia-session-handoff.md`

---

## The core reframe (what Benjamin is actually saying)

There are **two audience sets** with **two completely different jobs**, and right now the
field-notes page is trying to do both at once. Splitting them is the whole plan.

| | **Set 1 — the people in & behind the story** | **Set 2 — the outward audiences** |
|---|---|---|
| Who | Community (Karen, Kristy, Arlparra, Soapy Bore), Centrecorp, Oonchiumpa | Supporters / funders / sponsors **and** public / learners |
| Their job | *Use* this story for **their own** objectives | Get *warmed up* and eventually *act* or *follow* |
| What they need | The story in **the format they actually use**, packaged as **tools** | **Two separate funnels** (convert vs nurture), drip-fed |
| Our job | Consult on format (ties to consent) + repackage assets | Build microsites + funnels + email drip, warm toward a launch |

The beautiful long scrollytelling page is the **source artifact**. It is not the delivery
vehicle for either audience set. Set 1 gets *cuts* of it; Set 2 gets it *drip-fed* and *split*.

---

## Workstream A — First audiences: consult + repackage (Benjamin points 1 & 2)

**This is mostly relational + content work, not code. Ben/team-led, I support with build.**

### A1. Consult each on *how* they want to share it (point 1)
For community, Centrecorp, Oonchiumpa — ask how they'd actually move this around their world.
Options to put in front of them: textable photo gallery · short video · printable one-pager ·
board-ready slide deck · audio piece · printed book (like Nic's dad's). **Fold this into the
existing "consent pending" conversation** — what to share + how to share, one conversation,
respects their time.
→ *Ben action. I can prep a one-page "here's what we could make you" menu to take into those chats.*

### A2. Repackage trip assets into tools that serve *their* objectives (point 2)

| Audience | What they're trying to do | Asset to cut for them |
|---|---|---|
| **Oonchiumpa** | grant submissions, recruit young people, explain model to govt, board reporting | 90s "Fred calls Mykel grandson" clip; clean photo set for socials; the "program behind the door" framing as a grabbable block/PDF |
| **Centrecorp** | justify + grow the investment internally, bring other funders alongside | trustee one-pager, impact summary, board-meeting video, **co-brandable** asset |
| **Community** | photos back to families (already in process), something they own | community-facing version accessible **without the URL**; printed copies on the next trip; a book |

→ *Build I can do: an asset/kit hub (download page) per partner, the video cuts (FFmpeg tools in
`tools/`), the one-pager/deck generators. Needs Ben to confirm which assets + any co-branding with
Centrecorp.*

---

## Workstream B — Second audiences: two microsites + funnels + drip (Benjamin point 3 + follow-ups)

**This is the build-heavy stream. Benjamin offered to help with the funnel.**

### B1. Split into two surfaces — stop serving both from one page
- **Supporter / funder / sponsor microsite** (convert): sharp CTAs, clear ways in
  ($560 bed → `/sponsor`, containerised-plant gap → `/partner`, partner-in-your-community),
  lead capture, follow-the-journey subscribe, the "three ways to be part of it" block expanded
  into its **own funnel**.
- **Public / community / learning microsite** (nurture): softer entry, community leadership,
  the model, *how this is different from a charity drop-off*, subscribe / join-the-journey /
  get-involved hooks that **nurture not convert**.

> Decision needed: do we build two *new* microsite routes, or treat existing pages as the two
> surfaces — `/sponsor` + `/partner` (+ a combined hub) as the convert surface, and
> `/story` + `/communities` (+ a "follow the journey" page) as the nurture surface? My lean:
> **reuse + add two thin landing/funnel entry pages**, not a from-scratch microsite, so we don't
> fragment the codebase. (See decisions below.)

### B2. Drip-feed the story instead of one long page (final follow-up)
Benjamin: *significantly less content per touch; story fed strategically through sequenced comms*
(drip emails, maybe a podcast). People understand the mission better this way.
- The capture block I shipped (tag `goods-fieldnote-utopia`) is the **top of this funnel** — it
  already feeds GHL.
- Build a **drip sequence**: 4–6 emails, each one beat of the trip (the build → the drive out →
  the homes → the Elders → the hand-over → the ask). Infra exists: `src/lib/email/send.ts`,
  `api/admin/campaign/send-email`, `api/cron/campaign/pipeline-followup`, GHL Smart Router.
- **Two sequences** (one per Set-2 audience): converter track ends on an ask; nurture track ends
  on "join the journey / come to the launch".
- Podcast / audio = later, but the drip copy doubles as audio scripts.

### B3. Warm toward a launch
Benjamin: *get funnels flowing… warming them up maybe even for a launch.* The drip sequences are
the warming engine; the convert microsite is where warmed leads land. Sequence the launch as a
campaign milestone once the lists have been nurtured.

---

## Workstream C — Editorial & optimisation (the specific notes)

### C1. "Pull back so you can see her old bed" (photo note)
Benjamin is looking at a specific image and wants the framing pulled back to reveal the **old bed**
in shot — the before/after contrast is the point. We have a `before-after-split` block kind already.
→ *Need Ben to point to which image/section. Then it's a crop/swap (media-swap picker) or a
before-after block. Quick.*

### C2. Founders section — include Ben & Nic? (the "torn" question)
Benjamin's view: several target audiences would be **more likely to get involved if they knew Ben &
Nic were behind this** — and he thinks they certainly would. Ben's instinct: keep focus on community
activation. → **Ben's call.** Option that threads it: a *light* "who's behind it" beat on the
**convert microsite only** (funders want to back people), kept **off** the community-facing surfaces.

### C3. `/partner` form split-test (friction)
`partnership-form.tsx` currently makes **Q1 partner type, Q2 size, Q3 timeline all `required`**, plus
a required identity block. Benjamin flags Q2 ("roughly what size") as needless first-touch friction.
→ Options: (a) make Q2 + Q3 **optional**; (b) **two-stage** — capture name/email/segment first, ask
size/timeline on a stage-2 screen after submit; (c) A/B test long vs short. My lean: **(b) two-stage**,
which also feeds a cleaner lead into GHL faster. Measurable via submission rate.

### C4. Less content, fed strategically (the drip point, applied to the page itself)
The field-notes page stays as the **rich source / "read the whole thing" artifact**, but the
Set-2 entry points lead with *less* and drip the rest (B2). We do **not** shorten the source story;
we change what each audience is *handed first*.

---

## What I can build now vs what needs you / the team

**I can build without further input:**
- C3 two-stage `/partner` form (or whichever option you pick)
- B2 drip email sequences (copy + wiring; infra exists) once we pick the beats
- B1 two thin funnel entry pages (convert / nurture) reusing existing routes
- A2 asset/kit download hub + video cuts (once assets chosen)
- C1 photo pull-back (once you point to the image)

**Needs your decision (below) or team/relational work:**
- A1 consulting the three source audiences (relational — Ben)
- A2 *which* assets to produce + Centrecorp co-branding (Ben/Centrecorp)
- C2 founders section yes/no (Ben)
- B1 microsite architecture (decision below)

---

## Suggested sequencing

1. **Quick wins first** (this week): C3 form fix, C1 photo pull-back, finalise the capture→GHL
   Smart Router branch for `goods-fieldnote-utopia`. *Low effort, unblocks lead flow.*
2. **Funnel split** (next): B1 two entry surfaces + expanded "three ways" funnel.
3. **Drip engine** (next): B2 sequences, warming toward B3 launch.
4. **Repackaging** (parallel, Ben-paced): A1 consult → A2 produce the partner tools.

---

## Decisions I need from you

1. **Microsites** — two new microsite routes, or reuse existing pages + two thin funnel entry pages? *(my lean: reuse + thin entries)*
2. **Founders section** — include a light Ben & Nic beat (and if so, convert-surface only), or keep it out entirely? *(Benjamin: include)*
3. **`/partner` form** — two-stage it (lean), make Q2/Q3 optional, or A/B test? 
4. **First build** — which workstream do you want me to start on once decided? *(my lean: C quick wins)*

Also open: do you want a **drafted reply to Benjamin** capturing which of his points we're taking and how? He asked when he needs to give feedback by and offered to help with the funnel.

---

## DECISIONS LOCKED (2026-05-26)

1. **Microsites** → **Two new microsites** (not reuse). Build two dedicated routes.
2. **Founders** → **Yes, on the convert surface only** (light Ben & Nic beat; off the nurture surface).
3. **`/partner` form** → **Two-stage** (name/email/partner-type first; size + timeline on stage 2).
4. **First build** → **B1 funnel split** (the two microsites). Starting with the convert one.

## B1 build spec — the two microsites

### Microsite 1 — CONVERT (supporters / funders / sponsors) · proposed route `/get-involved`
Conversion-oriented. Sharp, outcome-led, real asks. Sections:
1. **Hero** — outcome-led headline + the trip as proof. Primary CTA "Sponsor a bed", secondary "Back the plant".
2. **Three ways, expanded into a funnel** — Sponsor a bed ($560 → `/sponsor`) · Back the plant (containerised-plant gap → `/partner`) · Build it in your community (→ `/partner`). Each its own card with a clear CTA and a one-line "what happens next".
3. **Proof strip** — 400+ beds, 107 this trip, communities reached. Sources: `story-atoms.ts` (`goodsBedStats`), `compendium.ts`, `impact-model.ts`.
4. **Founders beat (light)** — who's behind it: Ben & Nic. Convert surface ONLY (per decision 2).
5. **Follow-the-journey capture** — GHL tag `goods-getinvolved` (feeds the converter drip, B2).
6. **Footer CTA** — back to the field notes + talk to us.

### Microsite 2 — NURTURE (public / community / learning) · proposed route `/the-work`
Softer. Context + leadership, no hard sell. Sections:
1. **Soft hero** — community leadership front and centre, not an ask.
2. **The model** — build on Country, recycled plastic, community ownership.
3. **"Not a charity drop-off"** — the differentiator (community-led, design IN community, ownership).
4. **The journey so far** — light, story-led, links to the field notes.
5. **Soft hooks** — subscribe / join the journey (GHL tag `goods-thework`, feeds the nurture drip).

Both capture into GHL with **distinct tags** so the B2 drip sequences branch cleanly.
Route names are placeholders, trivial to rename.

## SHIPPED LOG

- **2026-05-26 · B1 microsites** — `/get-involved` (convert, tag `goods-getinvolved`, founders beat) + `/the-work` (nurture, tag `goods-thework`). Both 200, tsc clean, brand-voice clean. Also swept 2 pre-existing em dashes from the site header/footer aria-labels.
- **2026-05-26 · C3 two-stage `/partner` form** — `partnership-form.tsx` rewritten controlled: Stage 1 captures the lead (org/name/email required; partner-type + message optional, size/timeline GONE from first screen). Stage 2 (after submit) asks size + timeline as optional enrichment via a new `PATCH /api/partnership` that updates the SAME inquiry row by `inquiryId` (no duplicate). tsc clean, Stage 1 verified rendering without the size question. Not submit-tested (would create a live inquiry).

- **2026-05-26 · B2 drip sequences** — finished, ready-to-send copy. Converter track (6 emails, tags `goods-getinvolved` / `goods-fieldnote-utopia`) + nurture track (5 emails, tag `goods-thework`). GHL-workflow-ready (matches Smart Router architecture; no code). Doc: `wiki/outputs/2026-05-26-utopia-drip-sequences.md`.
- **2026-05-26 · A1 share-format menu** — consultation prompt sheet folding "how do you want to share this?" into the consent conversation, per audience. Doc: `wiki/outputs/2026-05-26-share-format-consultation-menu.md`.
- **2026-05-26 · A2 partner asset-kit hub** — `/kit` page (noindex) surfacing the Mykel clip, Oonchiumpa good-news PDF, Centrecorp outcomes one-pager, photo gallery + copy-paste framing per partner. (Build in progress.)
- **2026-05-26 · Reply to Benjamin** — drafted, addresses all points + takes up his funnel-help offer. Draft: `wiki/outputs/2026-05-26-reply-to-benjamin-draft.md`.

- **2026-05-26 · GHL drip runbook** — console click-through to build the two drip workflows (tag-triggered on `goods-src-*`), with the "Newsletter Signup" collision warning + test steps. Confirmed GHL live, fixed the doubled-prefix tag bug. Doc: `wiki/outputs/2026-05-26-ghl-drip-runbook.md`.
- **2026-05-26 · Before/after photo** — `before-after-split` block now supports per-side `aspect`; Utopia BEFORE set to `portrait` so the floor mattress stays in frame.
- **2026-05-26 · Comms intern playbook** — answers Benjamin's "mini-projects owned by interns + a training guide" point. Brand voice + objectives + strategy + medium-to-market + verify gate + a mini-project catalogue + brief template. Doc: `wiki/outputs/2026-05-26-comms-intern-playbook.md`.

## Delivery-medium reframe (Benjamin, 2026-05-26)

"Don't impose your medium on the community." The biggest strategic correction: build for where each audience ALREADY is, don't make them come to us.
- **Funders / institutional** → website + email drip is right (they live there). What we built stands.
- **Grassroots / public** → the email nurture track is likely the WEAKER medium. Re-cut the same N1–N5 beats for **WhatsApp broadcast and/or a Facebook group**. Content written once, delivered per channel. (Mini-project #4 / #6 in the playbook.)
- **Community / Oonchiumpa / Centrecorp** → their own channels (WhatsApp, print, their grant apps, board email), never a link to our site. Sharpens the A1 consultation: ask which MEDIUM, not just which format.

## STILL TO BUILD / OPEN

- **C1 photo pull-back** — needs Ben to point to which image (reveal the old bed for before/after). Benjamin: "see her old bed."
- **GHL Smart Router branches** — add branches + build the two drip workflows for tags `goods-fieldnote-utopia`, `goods-getinvolved`, `goods-thework` (GHL-side config, Tier 2; copy is ready in the drip doc).
- **A2 media production** — the actual 90s Mykel/Fred grant clip cut, the co-branded Centrecorp asset, printed copies / book (Ben + media, the kit hub is the scaffold).
- **A1 execution** — Ben runs the consult conversations.
