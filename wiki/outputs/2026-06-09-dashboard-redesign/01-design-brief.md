I have everything I need. The current build uses tabs (`DashboardTabs`), single hardcoded `snow` partner, live `getAssetStats`, `FINANCIAL_SUMMARY`, EL insights, and `getRoadmap`. There is no confidence-chip component in `src/components` yet (only `/impact` renders per-metric badges inline), no `raise`/funding-target structure, and no community-asset-ownership milestone structure. The brief below is grounded in these exact facts.

---

# Goods on Country — Forward-Looking Impact Dashboard: Build-Ready Design Brief

The current `/partners/[slug]/dashboard/page.tsx` is a tabbed layout (`DashboardTabs`) with one hardcoded `snow` partner and a backward "what your backing made possible" hero. This brief replaces it with one long, scroll-spy-navigated, forward-looking page that is a reusable three-audience template. Every data citation below is verified against the live code (Input C, cross-checked in the actual files).

---

## 1. THESIS

**Page promise (the one line, used as the meta description and the spoken thesis):**

> We are building productive assets that communities come to own, and the goods are already in service. Here is where we are heading, what it takes to get there, and how you can back the next handover.

**The five questions the hero answers (and ONLY these — fewer numbers, more context):**

1. **What are we building?** A recycled-plastic production economy on country that transfers to community ownership. *(direction, not a metric)*
2. **What goods have already moved?** Beds and washing machines into homes, across communities. *(COUNTED — live asset register)*
3. **Are they still in service?** Washers reporting live vs deployed; beds in community. *(COUNTED where pinged, named honestly where not)*
4. **What is changing for people?** Carried by consented community voice, not a fabricated outcome number. *(qualitative)*
5. **How sure are we?** A confidence legend (COUNTED / MODELLED / NOT-YET-MEASURED) introduced here and worn as a badge on every headline metric below.

The hero leads with **direction and ownership transfer**, names **goods in service** as live proof (not a thank-you), and frames the reader as someone who **backs the next stage**. One "as at {date}" stamp. One data-sovereignty line: "Community holds the story. We hold the count."

**Hard rule applied throughout:** no em dashes anywhere (use commas, full stops, or restructure). No gratitude framing. No "beneficiaries/recipients." Committed/targeted figures live in a visually distinct register from delivered ones.

---

## 2. SECTION SPINE

One long scroll. Eight sections (hero + 7). Each measurement section carries the mandatory trio: a community comparison, an equity note, a confidence note. Scrollspy labels are the short left-rail words; H2s are the on-page headings.

### Hero — `#heading` · scrollspy "Where we're heading"
- **H2 / subhead:** *On country, owned on country* · the thesis line, audience-swapped first line.
- **Question:** In one breath, what is this and where is it going?
- **Content blocks:**
  - Thesis sentence (audience variant, see §4).
  - Five hero answers as a restrained row, each with a confidence chip (not a metric wall — borrow Rosling's "one framing, not twenty tiles").
  - "As at {date}" stamp + one-line data-sovereignty statement.
  - The confidence legend defined once in plain words.
- **Live data (Input C):** `getAssetStats()` → `totalBeds`, `stretchBedsDeployed`, `washersWorking`/`washersDeployed`, `communitiesServed` (all **live, force-dynamic**). `FINANCIAL_SUMMARY.totalInvestment` ($741,111). Date stamp from `verifiedFinancials.lastUpdated`.
- **Visual:** Tight 4-to-5 answer row (reuse the existing `MiniStat`, add a chip slot). No big tile grid. Cream background, Georgia display numerals in rust.
- **Confidence:** Counts COUNTED; plastic-per-bed MODELLED; the "what's changing" answer is qualitative. *What + Risk* (Impact Frontiers): name evidence risk up front.

### Section 1 — `#goal` · "The goal"
- **H2 / subhead:** *Where we are heading* · the destination in community terms.
- **Question:** What future are we building toward, and why does it matter more than any single number?
- **Content blocks:**
  - One forward statement: a recycled-plastic production economy that runs on country and transfers to community ownership.
  - Output-vs-outcome framing device for the whole page: goods moved is the output; what changes for people, and who owns the means of making it, is the outcome.
  - Equity note: the asset is designed to leave our hands.
- **Live data:** None required (this is intent). Pull the narrative from `content.ts` brand copy. **[PROPOSED: add a `goalStatement` string per audience to `partner-dashboards.ts`]** so the three skins can vary the framing.
- **Visual:** Editorial full-bleed text band with one line illustration (the existing `goods-plastic-loop` / ownership-handover line art in `public/images/brand/`). No chart. This is the one section that is deliberately number-free.
- **Confidence:** Labelled **direction, not measurement**. Honesty rail: a goal is never dressed as an achievement.

### Section 2 — `#path` · "The path" (THE FORWARD REFRAME — this is the #1 gap to fill)
- **H2 / subhead:** *What it takes, and how the money is built*
- **Question:** What are we raising, in what shape, and what does each dollar unlock?
- **Content blocks:**
  - The raise stated **as a target**: target / committed / matched / gap, with a deadline and instrument type (repayable vs grant).
  - The QBE Catalysing Impact path: up to ~A$400K catalytic capital that **must be at least matched by signed external commitments** (matched, not secured, not awarded until awarded).
  - The capital stack as a forward structure (repayable prioritised, grants where they fit, match requirement visible).
  - "What one match / one container unlocks" line tying money to a unit of community-owned capacity.
  - Per-tranche status (committed / in conversation / target).
- **Live data:** **[PROPOSED — this does NOT exist in code today.** Input C confirms there is no `raise`/`MATCH_TARGET` structure; QBE ~$400K lives only in kanban prose + memory.] **Smallest path: add a curated `raise` object to `partner-dashboards.ts`** — `{ target, committed, matchedTarget, gap, deadline, instrument, qbeCap: 400_000, tranches: [{label, amount, status}] }`. The "committed" figure can aggregate from the existing `funding[]` rows in `compendium.ts` (`getFundingSummary()` already sums received/pending). Pull `verifiedFinancials.revenueReceived` as the "secured to date" anchor.
- **Visual:** A horizontal **capital-stack bar** (committed segment solid rust, matched-target segment a distinct hatched/outline sage, gap as an empty outline) so committed never reads as delivered. This is the Stripe/Frontier "committed vs delivered, strictly separate registers" move. NOT a pie. One scrollytelling pin candidate (Pattern 5) where the stack annotates itself as match steps reveal.
- **Confidence:** Every figure tagged **secured / matched-target / aspiration**. QBE is explicitly matched-and-not-yet-awarded. No figure reads as money in the bank unless it is. *Contribution + intentionality* (Impact Frontiers / GIIN).

### Section 3 — `#assets` · "Community-owned assets" (THE HEART)
- **H2 / subhead:** *The assets that stay*
- **Question:** What productive, lasting thing does the community come to own, and what is the handover path?
- **Content blocks:**
  - The on-country containerised plant (collect → shred → melt → press) as a productive asset on a path to community ownership.
  - The First Nations jobs pathway (Oonchiumpa / Alice Springs, justice-involved youth) framed as community as **employer and owner**, not recipient of jobs.
  - What "owned" means concretely: control of the plant, the income, the maintenance, the decision rights.
  - Equity note: who holds title, who holds the income, who decides.
- **Live data:** Partial. `partner.facilities` ("1 + 1", curated string) exists today. The roadmap kanban (`getRoadmap()`, **live** Supabase `roadmap_items`) carries interim milestones now. **[PROPOSED: add `ownershipMilestones[]` to `partner-dashboards.ts`** — `{ facility, hostCommunity, stage: 'built'|'operating'|'community-run'|'community-owned', pctToOwnership, targetDate }`. Later: a Supabase `facilities` table parallel to `assets` to make it live.] Do NOT invent an ownership-percent that isn't real.
- **Visual:** **The scrollytelling pin (Pattern 5, primary use).** One pinned diagram of the containerised plant that progresses build → deploy → community-run → community-owned as text steps scroll past (The Pudding sticky pattern). On mobile/reduced-motion it degrades to a plain stacked sequence (each stage's graphic inline above its text). Use the existing `goods-ownership-handover` line illustration as the base art.
- **Confidence:** Separate **what exists today** (COUNTED — plant components, communities engaged) from **the ownership transfer** (NOT-YET-MEASURED / in design — name the milestones, don't claim them done). *Who* (community as agent and owner) + CARE / Maiam nayri Wingara.

### Section 4 — `#in-service` · "In service now" (the honest proof, placed AFTER the forward story)
- **H2 / subhead:** *What is already on country, and still working*
- **Question:** Is the model real today, and how do we know?
- **Content blocks:**
  - Beds delivered and in service; washers live/deployed; plastic diverted; communities reached.
  - Each headline metric gets a community comparison ("what this means for a household / a community") and an output-vs-outcome note (a bed delivered is an output; a bed still in service after N months is closer to the outcome).
  - Service-status flag per asset class, charity:water style: live / deployed / unknown. **Name the dark machines** (28 deployed, 14 reporting live = 14 unconfirmed) rather than rounding them into the win.
- **Live data (all from `getAssetStats()`, live):** `totalBeds`, `stretchBedsDeployed`, `basketBedsDeployed`, `washersDeployed` (28), `washersWorking` (14, the admin-set `WASHERS_WORKING` constant — COUNTED but hand-confirmed), `communitiesServed` (9), `communityBreakdown[]`. Plastic = `stretchBedsDeployed × 20kg` (MODELLED). People reached = `totalBeds × 2.5` (MODELLED). Wash cycles / machines-online from `get_fleet_kpis` RPC if present.
- **Visual:** This is the most-graded section. A small set of metric cards, each with: the number, a one-line community comparison, a service-status pill (live/deployed/unknown), and a confidence chip. The washers card explicitly shows "14 reporting live of 28 deployed" with the 14 unconfirmed named. **[PROPOSED: add `needBenchmarks` config** for the "X of an estimated Y" denominators (overcrowding rate, beds-needed estimate) — public ABS/AIHW figures, a citation exercise not a pipeline. Until then, the equity note is prose, not a denominator.]
- **Confidence:** Delivery counts COUNTED; plastic-per-bed MODELLED (state the 20kg assumption); still-in-service COUNTED where pinged, NOT-YET-MEASURED where we have no eyes. *How Much* (duration = still-in-service) + *Risk*.

### Section 5 — `#voice` · "Community voice" (consented)
- **H2 / subhead:** *In their words*
- **Question:** What do the people closest to this say is changing, in their own words?
- **Content blocks:**
  - Consented Empathy Ledger themes (as chips with storyteller counts) and top quotes only.
  - Storyteller framed as knowledge-holder, attributed exactly as consent allows.
  - A plain statement: absence of a voice means consent not yet given, not no story.
- **Live data:** `empathyLedger.getProjectInsights()` → `themes[]` (name, storytellerCount), `topQuotes[]` (text, context). **Live**, 5-min cache, consent-gated by EL's `stories_for_site`. Local fallback = `journeyStories` in `content.ts` (EL currently has 0 published, so fallback is in play). This section already works in the current build (`voicePanel`) — port it as-is.
- **Visual:** Theme chips row + 3 quote cards in Georgia display (existing treatment is good, keep it). No photos unless documented consent (see §5).
- **Confidence:** A **consent-and-sovereignty note**, not a confidence grade. CARE (Authority to control, Ethics) + AIATSIS. The non-extractive backbone.

### Section 6 — `#whats-next` · "What's next"
- **H2 / subhead:** *The next handovers*
- **Question:** Where does this go from here, on what timeline, and what has to be true?
- **Content blocks:**
  - The Supabase roadmap (kanban + timeline) read as **upcoming community-owned capacity**: next communities, next plant, next handover, next jobs.
  - Milestones as commitments with conditions ("this happens when the match is signed"), tied back to Section 2's funding target so money → capacity → ownership reads as one chain.
  - Compounding logic stated honestly (a funded unit helps fund the next), without overstating certainty.
- **Live data:** `getRoadmap()` → `kanban` (up-next / in-progress / done) + `timeline`, **live** from Supabase `roadmap_items`, falls back to `partner.kanban`/`partner.history`. Already wired in the current build.
- **Visual:** Three-column kanban (existing treatment) + the vertical timeline (existing). Add a status tag per item: committed / in progress / planned / **contingent on funding** (contingent items visibly contingent).
- **Confidence:** Items tagged by status. No planned milestone reads as done. *How Much* (forward scale) + *Risk*.

### Section 7 — `#back-it` · "Back the next stage" (the only heavily audience-varying section)
- **H2 / subhead:** *Back the next handover*
- **Question:** What exactly can this reader do, and what will it move?
- **Content blocks (audience-aware, see §4):**
  - **Funders:** the matched-capital ask, what one match unlocks.
  - **Partners:** the next build and the next decision.
  - **Supporters:** the concrete next unit they can move.
  - Always "back the next handover / the next community-owned asset," never "give to help these people."
  - The "go deeper" link set + data-sovereignty + contact close. End on direction, not gratitude.
- **Live data:** `partner.links[]` (existing). **[PROPOSED: per-audience `cta` block in config]** (headline + one action + one supporting line).
- **Visual:** A single strong CTA band (rust) + the existing "go deeper" link grid. The Acknowledgement-of-Country footer stays.
- **Confidence:** Asks tied to the secured-vs-target state from Section 2 (filling a gap / providing the match / extending the runway). No inflated ask, no false urgency. *Contribution + intentionality*.

---

## 3. NAVIGATION + UX

**Spine:** a two-rail layout. Left sticky scrollspy rail ("On this page") + single scrolling content column. Thin top scroll-progress bar. Sticky section headers carrying each section's confidence badge. Sparse, opt-in reveal animations. Mobile collapses the rail to a sticky "On this page" disclosure / chip row. Borrows from Stripe docs + Linear changelog (the rail), Acton Circle / Tides report microsite (one-story linear scroll + progressive disclosure), The Pudding (the one sticky-graphic moment in Section 3), Apple/editorial (the progress bar).

**Why long-scroll, not tabs:** this dashboard is an argument with a direction (where we are → where we are going → what stays → how QBE compounds it → how sure we are). Momentum dies at a tab boundary. The current `DashboardTabs` fragments that, resets reading context on each switch, and breaks print/PDF and deep-linking for funders. One page = one URL, one print target, hash-addressable sections. The patterns below restore tab-grade orientation without the fragmentation.

**Concrete implementation (Next.js 16 App Router, React 19, Tailwind 4):**
- **RSC boundary:** the page and all data sections stay Server Components. Only the scrollspy rail, the mobile disclosure, and any count-up animator are `'use client'` leaves. Keeps the data-heavy page fast while live Supabase/EL data hydrates.
- **Scrollspy:** one `useScrollSpy(ids[])` client hook using a single `IntersectionObserver` with `rootMargin: '-45% 0px -50% 0px'`, tracking the last intersecting `<section id>` in document order (avoids the "two active at once" and "short last section never activates" bugs better than `threshold`). Active id sets `aria-current="true"` on the rail link. New file: `src/components/dashboard/scrollspy-nav.tsx`.
- **Layout container:** `grid lg:grid-cols-[220px_minmax(0,1fr)] gap-12`; rail is `sticky top-24 self-start` (the `self-start` is the easy-to-miss requirement, without it the sticky child stretches the row and never sticks).
- **Hash links + offset:** native anchor jumps (`href="#assets"`); every `<section>` gets `scroll-mt-24` so the sticky header never covers the heading. `scroll-behavior: smooth` gated behind `motion-safe`.
- **Top progress bar:** zero-JS CSS scroll-driven animation (`animation-timeline: scroll(root)` scaling a fixed 3px rust bar), wrapped in `@media (prefers-reduced-motion: no-preference)`; degrades to absent on Firefox/unsupported.
- **Sticky section headers:** each `<h2>` + its confidence badge is `sticky top-16 z-10 bg-[#FDF8F3]/95 backdrop-blur`. No ancestor may have `overflow: hidden` (silently kills sticky). Sections must be direct children of the scrolling column.
- **Reveals:** prefer CSS `animation-timeline: view()` behind `@supports` + `prefers-reduced-motion: no-preference`; author the default state fully visible so reduced-motion / no-JS / unsupported all read fine.
- **One scrollytelling pin (Section 3):** tall outer section as the scroll runway; a `sticky top-0 h-[100svh]` graphic + a sibling column of `.step`s; an `IntersectionObserver` with a centre trip-line (`rootMargin: '-50% 0px -50% 0px'`) sets the active step. On `< lg` or reduced-motion, collapse to plain stacked content (each step's graphic inline above its text).
- **a11y / focus:** the rail is `<nav aria-label="On this page">` with a real `<ul>` of links. Scrollspy updates the *visual* highlight only — never steals focus on scroll. Move focus only on explicit anchor click (`tabIndex={-1}` + `.focus()` on the target heading). Touch targets ≥44px. All sticky offsets reference one `--topbar` Tailwind theme token so mobile (taller header) offsets are correct.
- **Mobile:** rail does not exist below `lg`; replace with a sticky "On this page ▾" disclosure (a real `<button aria-expanded>`) or a horizontal chip row under the hero, sharing the same scrollspy active state.

---

## 4. MULTI-AUDIENCE TEMPLATING

One spine, three skins, driven entirely off the per-slug `partner-dashboards.ts` config. The current `PartnerDashboard` interface already has `slug`, `heroLine`, `intro`, `kanban`, `history`, `links`, `contribution`, `facilities`. Extend it minimally:

**Add to the `PartnerDashboard` interface:**
- `audience: 'partner' | 'supporter' | 'funder'` — selects the skin.
- `thesisLine: string` — the audience-specific hero first line (the three variants from Input D).
- `goalStatement?: string` — Section 1 framing per audience.
- `raise?: { target; committed; matchedTarget; gap; deadline; instrument; qbeCap; tranches[] }` — Section 2 (funders/partners show it; supporters may hide it).
- `ownershipMilestones?: OwnershipMilestone[]` — Section 3.
- `cta: { headline; action; supporting; href }` — Section 7.
- `sections?: SectionId[]` — optional ordered allow-list so an audience can omit a section (e.g. a supporter skin may drop the capital-stack detail).

**What varies per audience (everything else is identical):**
| | Funder | Partner | Supporter |
|---|---|---|---|
| Hero thesis line | "matched-capital path to scale it" | "what we're building together next" | "beds and machines already in service" |
| Section 2 (the path) | full capital stack + match | full stack | optional / simplified |
| Section 7 (back it) | the match ask | next build + decision | next unit they can move |
| Confidence legend, sections 0–6 order, per-section trio | identical | identical | identical |

**Rule:** the confidence legend, the section order, and the mandatory per-section trio (community comparison + equity note + confidence note) are a shared, fixed scaffold so the standard travels and a new partner page cannot ship without them. The page reads `audience` and renders the right skin; adding a partner = adding one config object + sharing `/partners/<slug>/dashboard` + password (gated in `src/proxy.ts`, unchanged).

---

## 5. CONFIDENCE + PRIVACY SYSTEM

**Confidence chip (the reusable trust primitive — does NOT exist yet; `/impact` renders badges inline but there is no shared component).**
- New file: `src/components/dashboard/confidence-chip.tsx` (Server Component, pure presentational).
- Three grades, mapped from the code's existing `ImpactMetric.confidence` field (`verified`/`modelled`/`estimate`/`target`):
  - **COUNTED** ← `verified` — administrative / audited (asset register, Xero). Sage dot.
  - **MODELLED** ← `modelled` / `estimate` — proxy / stated assumption. Amber/ochre dot.
  - **NOT-YET-MEASURED** ← `target` or absent — named honestly. Outline/grey dot.
- Each chip is one word + a dot + a `title`/tooltip carrying the one-sentence "largest source of uncertainty / what would change our mind" (the GiveWell move). Defined once in the hero legend, reused on every metric and in every sticky header.
- This is pure UI over data that already exists on every `ImpactMetric` — Phase 1 work, no new data.

**Non-extractive rules applied here (structural, not editorial):**
- **No identifiable detail without documented consent:** no full names, GPS, contact details, raw issue text, or identifiable photos. Section 5 renders only EL content that carries `stories_for_site` clearance. The gallery (`partner.gallery`) must be consent-audited before it ships in the new design — flag any photo that shows an identifiable face without a recorded consent flag (open question for Ben).
- **Consent-gating is code, not copy:** quotes/themes render only what EL clears; a new audience skin inherits non-extraction by default because it pulls the same gated source.
- **Data-sovereignty panel as a first-class designed element**, not fine print: a short "How we handle community data" block (who controls it, what's aggregated vs withheld, that community holds authority), citing CARE + AIATSIS. Appears once near the hero and is referenced in the footer. This is a credibility asset for a First-Nations-facing enterprise, not a compliance chore.
- **Committed never reads as delivered:** the Section 2 capital stack uses a visually distinct register (outline/hatch) for matched-target and gap segments. QBE ~$400K is always "matched, not yet awarded."

---

## 6. BUILD PLAN

**Smallest first slice (Phase 0 — proves the spine on today's data, ~one PR):**
Convert the existing page from tabs to one scroll with the scrollspy rail, reusing the four existing panels (`trajectoryPanel`, `stewardshipPanel`, `roadmapPanel`, `voicePanel`) as `<section id>`s in the new forward order. Add the rail + progress bar + sticky headers. No new data. This alone delivers Ben's "no tabs, one navigable page" and is shippable immediately because every data source is already wired.

- **Add:** `src/components/dashboard/scrollspy-nav.tsx` (`'use client'`, the only new client component), `src/components/dashboard/confidence-chip.tsx` (RSC), `src/components/dashboard/section.tsx` (RSC wrapper enforcing `id` + `scroll-mt-24` + sticky header + the per-section trio slots).
- **Edit:** `src/app/partners/[slug]/dashboard/page.tsx` — remove `DashboardTabs`, lay out sections in the forward order, mount the rail.
- **Keep:** all existing data calls (`getAssetStats`, `getRoadmap`, `empathyLedger.getProjectInsights`, `FINANCIAL_SUMMARY`, `verifiedFinancials`).
- **Retire:** `DashboardTabs` once no longer referenced.

**Phase 1 — ships with TODAY's data:**
- Forward-reframed hero (5 answers + legend + data-sovereignty line) — all live.
- Section 4 (In service now) with service-status pills + confidence chips + the honest "14 of 28 reporting live" — all live.
- Section 5 (Community voice) — port `voicePanel` as-is.
- Section 6 (What's next) — port roadmap, add status tags.
- The scrollspy spine, progress bar, sticky headers, reveals, mobile disclosure, a11y.

**Phase 2 — needs new curated config (no new data system, just config in `partner-dashboards.ts`):**
- Section 2 `raise` object (target / committed / matched / gap / QBE cap / tranches) + the capital-stack bar. **This is the headline forward-reframe and the #1 gap.** Committed aggregates from existing `funding[]`.
- Section 3 `ownershipMilestones[]` + the scrollytelling pin.
- Section 1 `goalStatement`, Section 7 `cta`, `audience` skin field, `needBenchmarks` denominators.

**Phase 3 — needs new data collection (later, on the roadmap):**
- A Supabase `facilities` table to make ownership milestones live (parallel to `assets`).
- Measured beneficiary outcomes (consented follow-up + health-evidence partner). Do NOT curate a fake outcome figure in the meantime; lean on EL qualitative.
- Live Vercel Analytics wire for the traffic snapshot (hand-transcribed is fine for now).

**Constraints honored:** Server Components for all data; one small `'use client'` scrollspy leaf; brand palette (cream `#FDF8F3` / rust `#C45C3E` / sage `#8B9D77` / charcoal, Georgia display); no em dashes in any copy; `npm run build` clean before done.

---

## 7. OPEN QUESTIONS FOR BEN

1. **The raise numbers (Section 2).** What exact figures go in the `raise` object: total target, amount already committed, the matched-target line, the deadline? QBE cap is ~$400K matched, but is there a public total-raise number, or do we show only "QBE up-to-$400K matched, plus committed-to-date $X from the pipeline"? This is the single biggest content decision and blocks the forward-reframe.
2. **Cost-per-bed in public.** The current stewardship panel shows "$534.79 direct / $684.79 fully loaded." Keep that visible on a funder/partner-gated page, or move cost detail behind a "see the numbers" link? (Input C notes the app deliberately shows cost-per-output only.)
3. **Photo consent for the gallery (Section 4/3).** The current `partner.gallery` shows identifiable community members (e.g. "Nic with an Elder on a verandah," "a family testing a bed"). Which of these have documented consent to appear on a shared partner/funder page? Anything without a recorded consent flag should be pulled or de-identified before the new design ships.
4. **Ownership milestones (Section 3).** What are the real, claimable stages for the containerised plant and the Oonchiumpa facility (built / operating / community-run / community-owned), and is there an honest percent-to-ownership, or should we show named-but-unquantified milestones only?
5. **Which sections does each audience see?** Confirm the supporter skin: does it show the full capital stack (Section 2), or a simplified "back the next unit" version with the detailed funding structure hidden?
6. **Need denominators (equity notes).** Are you comfortable citing public ABS/AIHW overcrowding + RHD-incidence figures as the "X of an estimated Y" denominators, or keep equity notes as prose until we have community-validated baselines?

---

**Files for the implementing agent (all absolute):**
- `/Users/benknight/Code/Goods Asset Register/v2/src/app/partners/[slug]/dashboard/page.tsx` — the page to refactor from tabs to one scroll.
- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/partner-dashboards.ts` — config to extend with `audience`, `thesisLine`, `raise`, `ownershipMilestones`, `cta`.
- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/compendium.ts` — `verifiedFinancials`, `funding[]`, `getFundingSummary()` for Section 2's committed aggregate.
- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/impact-model.ts` — `FINANCIAL_SUMMARY`, `ImpactMetric.confidence`/`targets` to drive the confidence chip.
- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/impact-fetcher.ts` — `getAssetStats()` (the live counts + `WASHERS_WORKING`).
- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/content.ts` — brand copy + `journeyStories` EL fallback for Section 5.
- New: `src/components/dashboard/scrollspy-nav.tsx`, `confidence-chip.tsx`, `section.tsx`.