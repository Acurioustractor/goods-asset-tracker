# Goods on Country — Project History Survey

**Generated:** 2026-05-28
**Method:** read-only git log (422 commits, all branches) + thoughts/ inventory. Worked from commit subjects, sampled by month + per-theme `--grep`. Did not open commit diffs.
**Source caveat:** Theme arcs are *inferred* from commit subjects, not from reading code. Commit counts are *verified* via `git log --grep`. Dates are *verified* commit dates.

---

## 1. Macro timeline (verified — commits per month, all branches)

| Month | Commits | Phase |
|---|---|---|
| 2025-12 | 67 | **Phase 0 — static HTML Asset Tracker** (the `deploy/` legacy site): dashboard, QR delivery tracking, map, support forms |
| 2026-01 | 1 | dormant |
| 2026-02 | 78 | **Phase 1 — v2 launch** (Next.js): Empathy Ledger stories/gallery, shop + Stripe, GHL contact wiring, media pack, pitch page |
| 2026-03 | 57 | **Phase 2 — admin/ops platform + CRM**: fleet telemetry, 5-dimension impact model, admin overhaul (12 sections), Grantscope, unified CRM, Parliament House event |
| 2026-04 | 15 | **Phase 3 — funder/QBE collateral** (low code volume): password-gated funder pages, insiders wiki, QBE intake, grants archive |
| 2026-05 | 204 | **Phase 4 — consolidation sprint** (peak activity): financial model, brand/comms system, asset register, field-notes, funder reconciliation, GHL forms architecture, sponsor flow |

Project is **~6 months old** (first commit 2025-12-02 "Initial commit: Goods Asset Tracker"). May 2026 is by far the most active month (204 commits, ~half the project's lifetime total).

---

## 2. Workstream themes (commit counts verified via --grep; arcs inferred from subjects)

### Asset Register (76 commits, last 2026-05-27) — MOST ACTIVE / FOUNDING WORKSTREAM
The project's origin. Started Dec 2025 as a standalone static QR/delivery tracker. Reborn in v2 May 2026 as `/admin/assets` filterable register with communities-as-FK, per-batch cost, bulk batch→community allocation, batch generator scripts, QR/Avery sticker print PDFs, and a bulk install logger with photo EXIF/QR/HEIC. Latest (05-27): outcome capture (household size, theme tag, consent). Continuously active across the whole project.

### CRM / GHL (72 commits, last 2026-05-27) — HIGHLY ACTIVE
GoHighLevel is the CRM spine. Feb: order/contact sync + SMS notifications. Mar: standardised `goods-` tags, smart-router pattern, live People page, campaign engine. May: full forms→GHL architecture (universal `act-inquiry` workflow), threading inquiries into GHL Conversations, distinct sources per form, live impact resync → GHL rollups (05-27, "one source of truth"). Tightly coupled with funder/impact work.

### Media (57 commits, last 2026-05-27) — HIGHLY ACTIVE
Media pack pages (Feb), video tooling (FFmpeg in `tools/`), then May explosion: EL-canonical media, self-serve media swap on production-flow steps + home + story editor, cross-project EL photo browser, partner media (Centrecorp/Snow). Overlaps heavily with field-notes and brand.

### Brand / Comms (55 commits, last 2026-05-27) — ACTIVE, BUILT MAY THEN STABILISED
Concentrated burst 2026-05-08: public `/brand` page, brand-voice linter (lib+API+UI+CI), press-kit JSON, email signature generator, em-dash global sweep, 6 Notion POC databases (Voices/Funders/Banned Terms/Templates/Deck/Photos), EL-led featured voices, consent gating. Reached "0 voice errors" repo-wide. Largely complete; touched again 05-27 for knowledge-base refresh.

### Impact / MEL (52 commits, last 2026-05-27) — ACTIVE
5-dimension impact model with live data + WISE employment tracking (Mar). Major /impact rewrite May (20/20 metrics tagged verified/modelled/estimated). 05-27: live impact resync feeding GHL rollups. Cross-references financial baseline and asset register counts.

### Field-notes (39 commits, last 2026-05-27) — RECENTLY ACTIVE
Built late May: `/field-notes/[slug]` full-bleed public route, EL-canonical media (union of stories+media_assets tables), block-kind layout rules, mobile immersive/stacked layouts, Utopia May-2026 trip article with 22 video thumbnails. Tightly tied to the stories/article-layout work (05-25 cluster).

### Funders / Capital (funder 38, grant 32, capital 17, last 2026-05-25/27) — ACTIVE
Apr: password-gated funder due-diligence landing pages. May: capital stack, funder URL map, repeated grant/funder figure reconciliation to live Xero (Centrecorp/Snow corrections), funder outcomes snapshot (05-27). Note: figures repeatedly corrected → data-accuracy is an ongoing concern, not a closed item.

### Fleet / Washing machines (fleet 25, washer 14, last fleet 2026-05-18 / washer 2026-05-27) — STALE-ISH (fleet), washer touched recently via forms
Heavy build Mar (Particle.io webhooks, telemetry dashboard) + intense diagnostic sprint 2026-05-05 (silence timelines, pipeline health, forensics on Palm Island/Maningrida). **Fleet code untouched since 2026-05-18** — connectivity is a known unsolved problem (only F25 reporting per memory). "washer" commits after that are form-wiring, not telemetry. **Looks stalled / unresolved.**

### Stripe / Sponsor (stripe 23, sponsor 11, last 2026-05-27) — ACTIVE
Stripe checkout from Feb, went LIVE mid-May, webhook live/test signature handling fixed 05-25. Sponsor flow redesigned with dedication messages 05-27, dedications surfaced to fulfilment. Healthy.

### QBE / SIH (qbe 22, sih 3, last qbe 2026-05-25 / sih 2026-05-19) — SLOWING
QBE Catalysing Impact program collateral: intake workflow (Apr), working pack rebuild (05-02), 10-topic diagnostic pack (in thoughts/). SIH diagnostic V4 sign-off 05-19. Code commits tapering; now mostly a docs/thoughts workstream.

### Financial-model / Cost (financial 7, cost 14, last 2026-05-25/26) — DOCS-HEAVY, OUTSIDE THIS REPO
The 10-day financial-model v0.1 build (per MEMORY.md) lives largely in `act-global-infrastructure` + `wiki/outputs/`, not as code here. In-repo cost work = per-batch cost in asset register + $750 price unification (05-26). Model itself is v0.1-closed, awaiting external inputs (SIH advisor, Ben/Nic FTE %).

### Governance / Legal (govern 2, legal 0) — LEAST ACTIVE IN CODE
Almost no code footprint. Butterfly Movement DGR charity transition + entity carve-out are live workstreams but live in MEMORY.md / wiki / external docs, not this repo. Expected — governance isn't a code concern.

### Website / v2 (the substrate, not a grep theme) — CONTINUOUS
Next.js 16 + React 19 app under `v2/`. Continuous since Feb. Routing canonicalisation (communities, story/mission), SEO/OG, press hub, analytics (GA4 + Vercel + Search Console). The platform everything else ships on.

---

## 3. thoughts/ inventory (verified — full listing)

```
thoughts/shared/
├── handoffs/
│   ├── general/2026-05-18_21-15-centrecorp-pencil-report.yaml   (5.3K — Centrecorp report handoff)
│   ├── knowledge-base-expansion/current.md                       (18K — active KB expansion handoff)
│   └── network-consolidation/
│       ├── 2026-03-27.md                                         (5.1K — dated)
│       └── current.md                                            (5.1K — CRM/network consolidation)
└── qbe-program/
    ├── diagnostic/                                               (10-topic QBE diagnostic pack, May 2026 refresh)
    │   ├── 00-INDEX.md + cover-letter.md
    │   ├── 01-vision-and-ambition.md (21K)
    │   ├── 02-social-objective-impact.md (21K)
    │   ├── 03-business-model.md (18K)
    │   └── 04..10 (financial-mgmt, strategic-planning-risk, process-tech,
    │       governance-data-reporting, people-org, legal-structure,
    │       investors-capital-raising) — 3-4K each
    ├── pfi-application-summary.md
    ├── session-1-learnings.md (11K)
    ├── submission-strategy.md
    └── weekly-action-plan.md (9.5K)
```

**By theme:** QBE/SIH dominates thoughts/ (the diagnostic pack is the bulk). Two CRM/network-consolidation handoffs (one dated Mar, one "current"). One knowledge-base-expansion handoff (active). One Centrecorp funder report. Topics 1-3 of the diagnostic are fully built to the "rebuilt standard"; 4-10 are thinner (3-4K, likely still draft).

---

## 4. Branch state (verified)

- **Current branch:** `feat/site-media-tooling-and-funder-outcomes` (this session's work; tracks origin, has 2 uncommitted modifieds: `admin/library/page.tsx`, `admin/production/page.tsx`)
- **main** — default/PR target
- Other live branches: `claude/kind-beaver-2a3e38`, `codex/goods-qbe-signoff`, `field-notes-utopia`, `vercel/vercel-web-analytics-integrati-9s9qvz`
- Last 7 days (2026-05-25 → 27): ~60 commits — a large multi-theme sprint (stories/field-notes, GHL forms/Conversations, Stripe webhook fixes, sponsor redesign, funder reconciliation, Oonchiumpa partner page, bulk install logger, impact→GHL resync).

---

## 5. Read on activity & staleness

- **Most active (still hot):** Asset Register, CRM/GHL, Media, Impact/MEL, Field-notes — all touched 2026-05-27.
- **Built then stabilised:** Brand/Comms (May 8 burst, now ~complete at 0 voice errors).
- **Slowing → docs-mode:** QBE/SIH, Financial-model (code work done; now external-input-gated).
- **Stale / likely abandoned-in-place:** **Fleet telemetry** — intense May-5 diagnostic sprint then silence since 05-18; connectivity unsolved (only 1 of 38 machines reporting per memory). The early **static `deploy/` Asset Tracker** is legacy-frozen by design.
- **Least code footprint (by nature):** Governance/Legal — real work but lives outside this repo.
- **Recurring smell:** Funder/grant figures corrected repeatedly across Apr–May (Centrecorp/Snow) — financial provenance is an ongoing reconciliation burden, not a closed line.
