# Empathy Ledger voice-layer alignment for /story/road (2026-07-29)

**From the EL session of 2026-07-29.** Everything below is Verified against the EL app DB
(`yvnuayzslukamizrlhwb`) through the full public consent gates, dated today. Companion docs in
the EL repo: `docs/12-design/goods-triangulation-2026-07-29.md` (voice · register · research
triangulation) and `docs/12-design/braid-across-the-ecosystem-2026-07-29.md` (the braid
contract, `src/lib/braid/contract.ts` — the format for feeding EL voice data to this page
without EL's gates ever being bypassed).

## Per-stop verification: the road's voices in EL

| Stop | Voice | EL public? | Transcripts | Public photos | Videos |
|---|---|---|---|---|---|
| 1 Kalgoorlie | Gloria Turner | YES (Wongatha Country) | 2 | 1 | 0 |
| 3 the machine with a name | Dianne Stokes | YES (Tennant Creek) | 7 | 1 (1 more private) | 0 |
| 4 Palm Island | Alfred Johnson | YES | 2 | 1 | 0 |
| 6 Maningrida / the farm | Fred Campbell | YES (Alice Springs) | 2 | 1 | 0 |
| 7 Oonchiumpa | Kristy Bloomfield | YES | 10 | 1 (1 more private) | 0 |
| 7 Oonchiumpa | Karen Liddle | **NO — `is_public=false`** | 1 | 0 public | 0 |

**Governance:** Karen Liddle's EL record is not public. The road page naming her is a Goods
editorial decision already made in the Notion source; EL cannot supply her material until her
consent step. Quote supply generally: EL holds **61 verified quotes from the Goods cohort, 0
with public display consent** — the /me quote-consent flow (spec in EL, cultural review first)
is what unlocks per-stop pull quotes served from EL rather than pasted from Notion.

## The Goods cohort in EL, aggregate (all gates applied)

43 on the project roster · **33 public** (Tennant Creek 11, Palm Island 5, Alice Springs 5,
Kalgoorlie 3, Katherine 2) · 23 gated analyses where **housing_sovereignty appears 15 times**
(2x the platform's intensity), tone dominantly hopeful · innovations already surfaced by
analysis: the Stretch Bed program, crate-based construction, portable bedding (AI-organised,
human review before public use).

## The media gap list (Ben's photo/video hunt, stop by stop)

EL public media for the whole Goods roster: **44 photos, 1 video, and the photos cluster on
Palm Island July 2026.** Each named road voice has exactly one public photo (their portrait)
and zero video. So the page's imagery hunger, in priority order:

1. **Stop 1 Kalgoorlie (Oct 2024 origin):** the register holds photo paths for the first beds
   (`Screenshot_2024-10-04_*` rows: Gloria's double, Boulder camp). Ben's library: Kalgoorlie
   delivery photos, Gloria at the tent/church. Nothing public in EL.
2. **Stop 2/3 Tennant Creek:** the biggest run (146 assets, Aug 2025) and the deepest
   relationship, Dianne Stokes has 7 transcripts and one public photo. Ben's library: the
   August 2025 run, the machine, Dianne working.
3. **Stop 4 Palm Island:** best covered (the July 2026 series is public in EL) but nothing of
   the 2024 summer surge (60 assets Nov-Dec 2024).
4. **Stop 5 Utopia:** 68 assets, zero public EL media tied to the homelands run.
5. **Stop 6 Maningrida:** solved on the Goods side (7 of 10 consent-cleared photos now in
   `v2/public/images/community/maningrida/`); EL holds none — decide whether they ALSO enter EL
   as media records (then the consent evidence reference lands once, serves both).
6. **Stop 7 Oonchiumpa:** Kristy public with 10 transcripts; imagery thin; Karen not public.
7. **Video:** one public video across the entire Goods cohort in EL. The road page's Descript
   cuts live on the Goods side; descriptive per-stop clips (30-60s, person + place + build) are
   the single biggest missing asset class for both surfaces.

## How EL feeds this page without bypassing gates (the braid contract)

- Today, already live: `GET /api/stories/by-entity/{abn}` (CivicGraph-agreed shape).
- Proposed v1: `GET /api/braid/goods-on-country.json` returning the `BraidArticle` shape
  (contract file: EL `src/lib/braid/contract.ts`; copy it into this repo when adopted). Voices
  appear in the feed ONLY chain-complete; withdrawal removes them from every renderer at once.
  The road page could then swap pasted quotes for fed ones stop by stop as consents arrive,
  with the consent meter ("61 waiting, N consented") as an honest on-page element.
- EL prototypes for reference (dev-only): `/prototype/braid/goods` (the braid instance),
  `/prototype/pulse-map`, `/prototype/glyphs` (a Goods place-glyph is derivable the same way).

## Number reconciliations noticed from the EL side (defer to canon, flagged only)

- Canon public figures follow the register: **540 / 177 / 3,540kg**; the
  `data/expanded_assets_final.csv` snapshot in this repo parses to **404 rows (363 Basket, 21
  Weave, 20 washers)** with supply dates Oct 2024 → Dec 2025. If the CSV is a stale snapshot of
  the live register, nothing to do; if it IS the register, the 540 needs its provenance row.
- Canon says **22 washing machines** (Ben 2026-07-21); the CSV holds 20.
- EL's own docs updated to defer to canon on all of the above.
