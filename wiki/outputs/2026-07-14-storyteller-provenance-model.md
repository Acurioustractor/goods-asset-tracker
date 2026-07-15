# Storyteller provenance model — where every quote actually comes from

> **SUPERSEDED IN PART, 2026-07-15.** This doc queried the two Notion sources and concluded only
> 12 people have real transcripts and Tennant Creek has none. The Empathy Ledger DATABASE export
> of the same day (empathy-ledger-v2/output/goods-evidence/) shows that conclusion was an
> artifact of where we looked: EL's Supabase holds real transcripts for ~27 named storytellers,
> INCLUDING the full Tennant Creek roster this table marks "curated, unknown origin" (Dianne
> Stokes has five; Norman, Linda, Jimmy, Melissa, Annie, Brian, Risilda, Cliff all have one),
> and Gary's transcript is filed under the GOODS project in EL, not Beyond Shadows. The Notion
> Storytellers table was the incomplete mirror, not the system of record.
> The "full model going forward" proposed in the final section NOW EXISTS in code:
> `v2/src/lib/data/transcript-provenance.ts` (metadata only, keyed by registry name, with EL
> release states), rendered live on /admin/story-atlas. Still true from this doc: Patricia Frank
> has no transcript anywhere (priority gap), Fred Campbell has only a 24-word clip, Kristy has
> lead records but no transcript, and transcripts EXISTING is not the same as external release
> being granted (every EL transcript sits behind a release gate).

*Built 2026-07-14 by querying the real systems directly (SQL against both Notion data sources), not sampling. This supersedes the 2026-07-13 verification audit's framing of "transcript vs curated card" — that audit checked quote *wording* against whatever source existed; this maps whether a *primary transcript exists at all*, for every person currently carrying the pitch narrative.*

## The honest headline

**Two real data sources exist, and they don't overlap the way the pitch assumes:**

1. **The EL "Storytellers table"** (Empathy Ledger, `Project = "Goods."`) — actual recorded interviews with a transcript in the page body. **Only 12 people, all from the October 2024 – January 2025 research trip: Kalgoorlie, Palm Island, Darwin.** Nobody from Tennant Creek. Nobody from Utopia/Alice Springs/Oonchiumpa.
2. **The "Goods Storyteller Library"** (34 curated cards) — the thing every quote in the pitch actually gets pulled from. Each card has a `Notes` field that says where it came from. Most say "curated," which turns out to mean very different things person to person.

Cross-referencing the two: **only 10 of the 34 people in active use have a real transcript backing their card.** The rest trace to raw field-trip notes (3 people), a funder pack (1 person), the website's own code with no EL link at all (2 people), or nothing recorded in Notion at all (18 people) — including some of the most load-bearing names in the whole story.

## Full table — every active voice, its real source

| Voice | Community (as used) | Real EL transcript? | Actual source (per Notion's own Notes field) | Flag |
|---|---|---|---|---|
| Alfred Johnson | Palm Island | ✅ Yes (2024-12-08) | EL transcript | — |
| Carmelita & Colette | Palm Island | ✅ Yes (2024-12-12) | EL transcript | — |
| Chloe | Kalgoorlie | ✅ Yes (2024-10-13) | EL transcript | — |
| Daniel Patrick Noble | Palm Island | ✅ Yes (2024-12-11) | EL transcript | — |
| Gloria Turner | Kalgoorlie | ✅ Yes (2024-10-13, as "Gloria") | EL transcript | Card lists her at Kalgoorlie, matches EL — no conflict here |
| Ivy | Palm Island | ✅ Yes (2024-12-17) | EL transcript | Card itself flags "confirm which Ivy" — unresolved |
| Jason | Palm Island | ✅ Yes (2024-11-14) | EL transcript | — |
| Mark | Mount Isa | ✅ Yes (2024-11-03) | EL transcript | Tier is website-only despite having a real transcript |
| Walter | Kalgoorlie | ✅ Yes (2024-10-13) | EL transcript | `hold` tier — real transcript exists but not cleared, correctly excluded from the spine |
| Wayne Glenn | Darwin | ✅ Yes (2025-01-20) | EL transcript | — |
| **Gary** | Mount Isa | ⚠️ **Exists, but tagged `Project: "Beyond Shadows"`, not Goods** (2024-11-12, Men's Group) | An interview recorded for a *different ACT program* | **Real flag.** One of the most-used quotes in the spine (Movement 1's anchor) comes from an interview never tagged as being about Goods at all. Need to confirm the actual interview content is genuinely about Goods before trusting the quote further. |
| Katrina Bloomfield | Alice Springs / Utopia | ❌ No | "trip (cleared)" — raw field-trip note, not a formal transcript | Genuine firsthand documentation, just not in the EL transcript system |
| Dorrie Jones | Arlparra | ❌ No | "trip; Ben-cleared 2026-06-17" | Same — real trip note, no formal transcript |
| Karen Liddle | Oonchiumpa (Utopia) | ❌ No | "trip (cleared)" | Same |
| Ray Nelson | Plenty Highway | ❌ No | "pack; bed GB0-156-96" — from a funder pack document | Traceable to a specific bed's QR record at least |
| Jessica Allardyce | Miwatj Health | ❌ No | "content.ts" — hardcoded directly in the website's code | **Bypasses the Empathy Ledger consent pipeline entirely.** `hold` tier, not currently used — correctly so. |
| Zelda Hogan | Tennant Creek | ❌ No | "content.ts" | Same bypass. `website` tier, not currently used in this spine. |
| Xavier | Alice Springs | ❌ No (by design) | No own quote — narrated by Fred Campbell, consent via Oonchiumpa | Deliberate, documented, not a gap |
| Kristy Bloomfield | Alice Springs / Utopia | ❌ No | "curated" — no further source given | Unknown ultimate origin |
| Dr Boe Remenyi | practitioner | ❌ No | "curated" | Unknown ultimate origin |
| Shayne Bloomfield | Oonchiumpa family | ❌ No | "curated" | Unknown ultimate origin |
| Fred Campbell | Oonchiumpa, Alice Springs | ❌ No | "curated; carries Xavier's story" | Unknown ultimate origin — carries a lot of narrative weight (Movement 3, 5) for an unsourced quote |
| Annie Morrison | Tennant Creek | ❌ No | "curated" | Unknown ultimate origin |
| Brian Russell | Tennant Creek | ❌ No | "curated" | Unknown ultimate origin |
| **Dianne Stokes** | Tennant Creek | ❌ No | "curated; named Pakkimjalki Kari" | **Unknown ultimate origin, despite being the emotional anchor of Movement 4.** Her totem line is separately marked hold — that's a different, already-handled flag. This is about the *primary* quote having no traceable transcript at all. |
| Jimmy Frank | Tennant Creek | ❌ No | "curated" | Unknown ultimate origin |
| Linda Turner | Tennant Creek | ❌ No | "curated" | Unknown ultimate origin — carries Movement 2's opening line |
| Melissa Jackson | Tennant Creek | ❌ No | "curated" | Unknown ultimate origin |
| Norman Frank | Tennant Creek | ❌ No | "curated" | Unknown ultimate origin |
| Patricia Frank | Tennant Creek | ❌ No | "curated" | Unknown ultimate origin |
| Risilda Hogan | Tennant Creek | ❌ No | "curated" | Unknown ultimate origin |
| Cliff Plummer | Tennant Creek | ❌ No | "curated; label practitioner" | Unknown ultimate origin |
| **Mykel** | Utopia Homelands | ❌ No | "Ben-cleared 2026-06-18 (canon + Snow dashboard)" | Cleared by you directly, not via a transcript — that's a real clearance, just not a transcript-backed one. Notes field itself flags "voices.md pending flag is stale, needs updating." |
| Heather Mundo | Katherine | ❌ No | "curated" | Unknown ultimate origin |

## What this actually means

**Not "these quotes are fake."** Most of the "curated" entries are very likely real things people said — someone was in the room, wrote it down or remembered it, and typed it in. The gap is **traceability**, not necessarily truth: if a funder or a community member asked "show me the source," 24 of these 34 people currently in the story have nothing in Notion to point to except a hand-typed card.

**Tennant Creek is the starkest gap.** It carries Movements 3, 4, and 5 of the current spine — the naming, the reversal, most of the emotional weight — and literally zero of its 10 voices have a transcript anywhere in the system. The May 2025 visit-log page (a separate "Actions" database entry, checked 2026-07-13) doesn't contain the quotes either; it's logistics notes and an uncaptioned photo dump.

**Utopia/Oonchiumpa is thin but has *some* real documentation** — Katrina, Dorrie, and Karen have genuine trip notes (not full transcripts, but real firsthand records, dated and cleared). Mykel's clearance is a direct, dated decision from you, which is a real form of provenance even without a transcript. Fred, Kristy, Shayne, and Xavier's narration are the softest points here.

**Gary is the one that needs an actual look, not a shrug.** His transcript exists and is real — it's just tagged to a different program. Two honest possibilities: either the interview genuinely touched on Goods and someone forgot to tag it correctly (fixable, low-stakes), or the interview was actually about the other program and the "fire and dirt" line is being used out of its real context (a real problem, since it's currently the lead quote of Movement 1). Worth reading the actual transcript before deciding which.

## What a "full model" going forward should look like

Right now provenance lives in three disconnected places: the EL Storytellers table (transcripts, Goods-tagged only), the Storyteller Library (curated cards, the thing actually used), and `storyteller-registry.ts` in the repo (the code-side mirror, which doesn't currently carry a "has real transcript: yes/no" field at all). None of the three point at each other.

The concrete fix, if you want it: add a `transcriptSource` field to every entry in `storyteller-registry.ts` — `el-transcript` / `trip-notes` / `funder-pack` / `content-hardcoded` / `curated-unknown` / `narrated` — populated from this table, so the distinction this document just took an hour to reconstruct is visible at a glance from now on, in code, next to every quote. Not built yet — flagging it as the actual "full model" you're asking for, rather than another one-off document like this one.
