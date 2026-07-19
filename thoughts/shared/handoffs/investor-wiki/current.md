# Investor Wiki + Goods Atlas — Handoff

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-07-19T12:30:00Z
**Goal:** Investor wiki (8 areas, one careful pass each) + admin restructure into a wiki dashboard + the Goods Atlas (map of everything: communities, people, products, stories, media).
**Branch:** claude/investment-deck-alignment-y3qc43
**Test:** `cd v2 && npm run build` (exit 0) + `node --env-file=.env.local scripts/check-asset-drift.mjs` (green)

### Now
[->] All shipped locally + pushed. Morning: Ben reviews /admin (wiki dashboard), /admin/atlas, /admin/facility, /admin/communities; then next wiki areas (3 people, 4 QBE/Notion, 5 diagrams, 6 stories, 7 media, 8 deck review).

### This Session (2026-07-19)
- [x] Investor wiki scaffolded: `wiki/investor/00-INDEX.md` + Area 1 (storytellers: 40 voices, 70 quotes, domain coverage; circular economy = 2-quote gap) + Area 2 (financial model; label conflicts flagged) + Area 9 (admin IA, all 57 routes dispositioned) + Area 10 (community counts) + Area 11 (Goods Atlas model).
- [x] Admin restructured: `/admin` = wiki dashboard (canon strip live from CANONICAL_ASSETS); old ops home preserved verbatim at `/admin/today`; `/admin/voices` hub built; two-wing sidebar (Investor wiki / Operations), nothing removed.
- [x] `/admin/facility` = production facility overview (8-step process w/ real photos, 3 videos, cost case, shifts, gaps panel). Pencil mocks for dashboard + Voices + Atlas in `design/goods-theory-of-change-v2.pen`.
- [x] CANON MOVED (Ben rulings): **540 beds / 177 Stretch / 363 Basket / 20 washers in community / 11 communities / 3,540kg HDPE**. Register writes: Kununurra +2 (Aunty Jean O'Reera, GB0-158), Katherine +1 (Nic, GB0-159), Tennant youth centre +1 (GB0-160), Julalikari +2 washers (GB0-WM-TC-JUL). Utopia = 147 confirmed. Maningrida washers = 8 correct. ~30 surfaces swept (incl. stale impact-fetcher at 16 washers); drift GREEN.
- [x] Notion swept: Community OS counts table + Artifact Hub spine now match register/canon.
- [x] `communities` table migration applied (Ben ran it): facility_interest/notes, key_people, procurement_contacts, notion_url; seeded 9/9; communities page + [id] page + Atlas read live.
- [x] `/admin/atlas` built: full-screen SVG-Australia map, markers sized by beds, washer badges, facility rings, live signals 30d, search (communities+people), drill panel → per-community dashboards.
- [x] `crm_contacts` hub seeded: 84 people from 21 Goods sources (idempotent `scripts/seed-crm-contacts.ts`) + Gmail sweep (33 last_contact_dates) + 19 discovery candidates added on Ben's approval → ~135 contacts.

### Next
- [ ] Wiki areas 3-8 (people doc, QBE Notion review, diagrams, full stories, media, deck slide review — deck HTML/.pen still carry OLD numbers 496/536; fix in Area 8).
- [ ] Wire `/admin/people` to read crm_contacts (replace runtime aggregation).
- [ ] `media_links` table migration + backfill (image tags, EL media_storytellers junction, video paths).
- [ ] Notion Community OS ↔ Supabase ↔ GHL sync jobs (end name-matching).
- [ ] Cleanups: Tony Miles ↔ "Tony (Anyinginyi)" merge; org-as-contact rows (Oranges & Sardines, Our Shed, foundations) → ORG layer; washer register status cleanup (~12 rows) to make 20 query-derivable.
- [ ] Ben: Margaret (Utopia) registry record/spelling; Julalikari washer recipients; youth-centre follow-up; claim-label ruling ($426 verified vs modelled vs deck "measured"); delete stale SUPABASE_ACCESS_TOKEN line in ~/.zshrc.

### Decisions
- Nothing deleted in admin restructure; absorb-by-navigation (hubs + tabs), old routes intact.
- Facility page gated at /admin until copy approved for public.
- Counts: register = truth; washers-in-community stays curated (20) until status cleanup.
- Atlas map = SVG silhouette (no tiles); Leaflet/Mapbox later if wanted.
- crm_contacts = the person hub; storyteller registry remains the voice/consent authority.

### Open Questions
- Utopia OS said 169; Ben ruled 147 — if a later trip proves more, register rows first.
- Include individual donors in Atlas or GHL-only? (11-goods-atlas.md open question.)
