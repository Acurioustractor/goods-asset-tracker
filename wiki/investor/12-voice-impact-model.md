# Area 12 — The Voice-Led Impact Model

> The synthesis of the 2026-07-20 deep transcript pass: 29 voices, 41 transcripts, ~78,000 words,
> 191 coded verbatim quotes. This doc is the definitive statement of how Goods measures impact
> through voices, how that aligns with the canonical numeric model and the QBE diagnostic areas,
> how the system runs ongoingly, and how it hands narrative ownership to community.
> Companion research: `voice-analysis/RESEARCH-impact-model-alignment.md`. Flagship story:
> `wiki/outputs/2026-07-20-the-voices-are-the-evidence.md`.

## 1. The claim structure

Goods runs a twin-spine impact model:

- **The numeric spine** (canon.ts, register-verified): 540 beds, 177 Stretch, 20 washers in
  community, 11 communities, 3,540kg HDPE. Numbers prove SCALE. Labels: delivered / measured /
  modelled, never conflated.
- **The voice spine** (this model): every substantive Empathy Ledger transcript, deep-analysed,
  theme-coded, per-quote consented. Voices prove MEANING. Labels: verbatim only, cleared or not,
  sensitivity flagged.

The rule that joins them: **no number without a voice, no voice reduced to a number.** A deck
slide carries the stat AND the person (slide 07 now: 540 beds + Margaret Lloyd's "sleeping on
floor, turn around, turn around" + Dianne's milk-crate line). This is the model.

## 2. What the transcripts actually say (saturation evidence)

Theme coverage across 29 independent voices (quote mentions / distinct voices):

| Theme | Quotes | Voices | Reads as |
|---|---|---|---|
| Rest, sleep & health | 51 | 22 | The core product truth: sleep off the ground changes days |
| The broken supply chain | 47 | 23 | The most saturated theme in the corpus: freight, price, products that fail |
| Family & kids | 41 | 20 | Impact is always narrated through family, never the individual consumer |
| Country & culture | 39 | 22 | Products land inside cultural life or not at all |
| Ownership pathway | 32 | 11 | Concentrated in the leadership voices (Kristy, Tanya, Dianne, Norman) |
| Dignity & safety | 30 | 15 | "A bed you can get out of yourself" |
| Designed in community | 28 | 17 | The design authority claim, in their words |
| Product durability | 28 | 15 | "Definitely not gonna break" vs the dump cycle |
| Reciprocity & partnership | 27 | 17 | How to enter: two-way need, allies not drivers |
| Washing & clean bedding | 21 | 16 | The washer half of the loop |
| Elders & protocol | 19 | 14 | Elders first, government second, every time |
| Making & jobs | 15 | 8 | Young makers, wages, skills staying |
| Never been asked | 13 | 10 | The 60-year default Goods inverts |

Two saturation findings matter for funders: (a) **system-failure is the most widely shared
experience** (23 of 29 voices independently describe the broken supply chain) — the problem
statement is community-authored, not Goods-authored; (b) **the ownership pathway is voiced by
the leaders** (Kristy: "We wanna be able to create generational wealth, economic development on
our own land... Why can't we?"), which is exactly where a credible ownership claim must come
from. Goods never claims it; they ask for it.

## 3. Alignment with the canonical impact model (5 domains)

| Domain (impact-model.ts) | Voice evidence | Numeric evidence | Gap |
|---|---|---|---|
| Rest & health | 61 quotes; Margaret, Dianne, Brian, Cliff, Melissa, Jimmy | 540 beds, 20 washers | Health lines stay testimony; scabies→RHD remains the WHY |
| Dignity & safety | 42 quotes; Alfred, Gloria, Tracy, Carmelita & Colette | communities served | none |
| Self-determination & community-led design | 63 quotes (largest); Dianne, Linda, Norman, Gary, Tanya, Shayne | storyteller count, production days | The model's strongest voice domain |
| Jobs, On Country work & ownership | 15 quotes; Kristy, Mykel (registry), Dianne, Gary | employment hours, FTE | Thinnest quote base: grow with production; next trip should record makers |
| Circular & local economy | 10 quotes; Daniel, Shayne, Nic (staff) | 3,540kg HDPE, lifespan | Thinnest overall; Area 1 flagged the same 2-quote gap — confirmed at depth |

The two through-lines (cultural authority, Indigenous sovereignty) are not thin: country-culture
(39 quotes) and elders-protocol (19) carry them; they run across domains exactly as the model
intends.

## 4. Alignment with the QBE diagnostic areas

The Stage 2 application is judged on the diagnostic's 10 areas. The voice model directly
services the priority areas (V4 priorities: 2 Impact, 3 Business Model, 4 Financial, 5
Strategy/Risk, 7 Governance):

- **Area 02 Impact** (the keystone): this IS the impact-measurement framework Jay's list asks
  for ("impact evidence: measurement report / theory of change"). The twin-spine claim
  structure + per-quote consent provenance is the measurement report.
- **Area 03 Business Model**: demand evidence in community words (Daniel's poverty-premium
  arithmetic; Jimmy's 5-10-washes-a-day duty cycle; Carmelita & Colette's freight testimony).
  Willingness-to-use is voiced by users, not asserted by the enterprise.
- **Area 05 Strategy/Risk**: the truck test is community-authored (Shayne on orgs that
  "promise the world and nothing come out of it"); transfer risk is named by the people who
  carry it.
- **Area 07 Governance**: Elders-protocol theme (Dianne's "go and talk to the elders" is
  operating doctrine, quoted); Oonchiumpa-leads structure in Tanya's allies frame.
- **Area 10 Investors**: Georgina Byron's funder-witness transcripts show a funder testing the
  claim in community and finding it held ("it was an overwhelming, yes... It's not a for, it's
  a with").
- Areas 04/09/11 (financial, legal, cost model) stay numeric; the voice model deliberately does
  not reach into them.

## 5. How the system runs (the ongoing method)

1. **Record** on Country, with consent, into Empathy Ledger. The transcript is the
   storyteller's asset (EL philosophy: storyteller sovereignty).
2. **Ingest**: transcripts land in EL; the Goods pipeline pulls the project set plus an explicit
   include-list for out-of-project filings (`EXTRA_TRANSCRIPT_IDS`). New storyteller = new EL
   record; spelling variants resolved via `NAME_FIX` with Ben confirmation.
3. **Analyse** (Ben-authorised, 2026-07-20 blanket): deep read, top-5 verbatim quotes,
   13-theme coding, domain mapping, sensitivity flags. Output = durable batch JSONs in
   `wiki/investor/voice-analysis/`.
4. **Clear**: Ben passes each quote (CLEAR / HOLD / EDIT) in `QUOTE-REVIEW.md`; `cleared: true`
   flips in the batch JSON; rebuild via `build-voice-impact-data.mjs`. External use requires
   cleared; held voices never leave /admin.
5. **Place**: cleared quotes promote to the storyteller registry (the consent authority), then
   to surfaces (deck, site, blogs) with claims-status labels.
6. **Link**: media_links ties every photo/video to its person, community and asset; the Atlas
   and community pages read the same spine.

Adding a new storyteller costs one recording + one analysis pass; the system compounds.

## 6. Community ownership of the narrative (the point)

The destination is not a better funder deck. It is that **communities own the knowledge asset**:
- The transcript stays the storyteller's (EL: consent is ongoing, withdrawable; syndication
  revenue flows to storytellers as EL matures).
- The theme model makes the community's OWN analysis visible: Tennant Creek's voices define what
  impact means there; the enterprise aligns to it, not the reverse.
- The ownership pathway applies to the story system exactly as to the plant: analysis authority,
  clearing authority and eventually the surfaces themselves move to community hands. Same truck
  test: if the transcripts stay but the interpretive authority leaves with us, we preserved the
  old arrangement.

## 7. Case studies (each = one enterprise-usable pattern)

1. **Pakkimjalki Kari (Dianne Stokes)**: design authority in community. She named it, refined
   it, and her cleared quotes carry both the joy ("my heart is hopping and skipping") and the
   doctrine ("go and talk to the elders"). Pattern: product legitimacy flows from named Elder
   authorship, on the record, consented.
2. **Margaret Lloyd's delivery (Utopia)**: the 292-word proof. Before (tent, no mattress,
   "turn around, turn around") and verdict ("Our bed is right") recorded at the moment of
   delivery. Pattern: capture the before/after in the person's own words AT delivery; 292 words
   outweigh a dashboard.
3. **The Maningrida account (Shayne Bloomfield)**: a community member narrates the whole
   delivery chain (drive, laundromat refurb, 20 beds with young people, washers) and hands back
   the operating principle ("we need what they've got"). Pattern: the delivery team's own
   community members are the most credible witnesses.
4. **The Oonchiumpa corpus (Kristy, Tanya)**: 43k words of leadership voice that situates Goods
   inside a larger self-determination project ("generational wealth on our own land"). Pattern:
   the ownership claim is only real when the community leader says it unprompted, about their
   own agenda, with the enterprise as one instrument.
5. **The funder witness (Georgina Byron)**: the funder tests the claim in community and records
   the verdict ("an overwhelming yes... a with, not a for"). Pattern: bring funders on Country
   and let their own words become evidence; nothing Goods writes matches it.

These five patterns are the replication offer to other enterprises: any org with products,
communities and consent discipline can run this loop; Empathy Ledger is the infrastructure and
Goods is the working proof.

## 8. Against traditional impact models (summary; full research doc alongside)

Traditional frameworks (ToC, SROI, IMP) optimise for attribution and comparability and pay for
it with proxy metrics, extractive data collection and enterprise-owned narratives. Participatory
methods (Most Significant Change) restore voice but get attacked on rigour. The Goods model's
answer is triangulated rigour: (1) verbatim traceability (every quote resolves to a transcript
ID and timestamp), (2) consent provenance per line, (3) saturation across independent voices
(23/29 on system-failure), (4) hard separation of testimony from claims (health lines never
become outcome claims), and (5) numeric cross-checks from the register. It is auditable in a way
narrative evaluation usually is not, and consented in a way dashboards never are. It also meets
Indigenous data-sovereignty expectations that mainstream models ignore. Full comparison +
sources: `voice-analysis/RESEARCH-impact-model-alignment.md`.

## 9. Build state + next

- LIVE: /admin/voice-impact (portrait wall, domain/theme charts, per-voice drill-down, consent
  flags), voice-impact-data.json (29 voices / 191 quotes / 10 cleared), media_links (106 rows).
- NEXT: link every voice to its community page; grow photo/video links per person; makers'
  voices at the next production run (jobs-ownership is the thin domain); move Oonchiumpa/null
  filings into the Goods EL project; community clearing sessions (step toward interpretive
  ownership); the case-studies pack as standalone one-pagers.
