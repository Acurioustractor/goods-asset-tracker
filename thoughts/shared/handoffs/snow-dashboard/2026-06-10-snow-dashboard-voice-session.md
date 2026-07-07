# Snow Dashboard — Community Voice + Polish Session
**Date:** 2026-06-10  
**Status:** All changes in working tree — uncommitted

---

## STATE AT /clear

All changes are local (not committed). Run `git diff --stat` to see them. Primary file: `v2/src/lib/data/partner-dashboards.ts`.

### Resume steps
1. `cd v2 && npm run dev` — dev server should hot-reload immediately
2. Visit `localhost:3000/partners/snow/dashboard` (password: `snow2026`)
3. Scroll to "Community voice" section to verify three cards
4. If happy: `git add -p` → commit → push → Vercel deploys

---

## What changed this session (continuing from previous session's PR #110)

### Community voice cards (featuredVoices)
All three cards now render correctly. Changes from main:

**Dianne Stokes**
- Quote changed to the lighter ledger quote: *"It means something that really makes me happy. Every time I go away, it's like it's calling me. Come back home."*
- Context: `On what the Pakkimjalki Kari means at home`
- Role: `Warumungu and Warlmanpa Elder, Tennant Creek. The first to have a Goods bed and a Pakkimjalki Kari washing machine in her home.`

**Kristy Bloomfield**
- Quote changed to: *"We want to create a safe space for our young people. There's a lack of housing, which leads to a lack of sleep, which leads to low school attendance."*
- Context: `Commission the on-Country production plant`
- Role: `Traditional Owner, Mparntwe. Leads Oonchiumpa, the community partnership behind the Alice Springs production facility.`

**Mykel** — unchanged

### "Country" capitalisation fixes
- `On-country recycling and press plant` → `On-Country recycling and press plant`
- `Commission the on-country production plant` → `Commission the on-Country production plant`
- `on country` → `on Country` throughout the intro copy

### Also changed earlier in this session (from previous context window's work)
Captured in full in the previous session summary but all still uncommitted:
- `TimelineItem.image` added to interface — 6 moments now all have photos
- Washing machine prices: $4,300 current / $2,000–$2,500 target (was $4,500-$5,000 / $1,000-$2,000)
- washerLine simplified to "14 machines in community"
- Breakdown heading: "What catalytic backing actually funds" (was FY25 grant breakdown)
- Breakdown items reordered: community visits / founder wages / bed R&D / washer V1
- `quotes: []` — Snow quote block emptied
- thankYou image removed from "Your part in this" section
- Dianne naming card added to washing machine section (January 2026)

---

## Pending — for Ben to decide
- **Dianne's shelter quote** ("24 years without shelter / only thing I had was my car") — the ledger flags it as heavier/totem content needing Elder courtesy review before new public surfaces. The current lighter quote is in its place. If Ben gets Dianne's sign-off, the heavier quote could go back.
- **Commit + deploy** — nothing has been pushed. All changes are working-tree only.
- **Homelands trip photos** — user mentioned 3 photos (kids making beds, team in front of bed, delivering beds) to add to the Homelands section. Files were not dropped in this session; still to do.
