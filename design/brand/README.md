# Goods on Country — brand system

One canonical place the Goods brand is defined, so it stops drifting across the
six places it currently lives (web theme, the ToC generator, the deck, the brand
guide, the cost-story charts, the illustrations skill).

## Files

- `tokens.css` — **the single source of truth**: colour, type, radius, spacing.
  Every surface should derive from this.
- `cards/` — the Claude Design preview cards (foundations + core components).
  Each card's first line is a `<!-- @dsCard group="..." -->` marker so the Design
  System pane indexes it. They are the source for the Claude Design project.

## How it syncs (the process we are wiring in)

1. **Repo is the source.** `tokens.css` + `cards/` define the system here.
2. **Seed Claude Design** from this folder with the `DesignSync` tool
   (`create_project` then push `tokens.css` + `cards/**`). Edit on the canvas.
3. **Two-way sync going forward** with `/design-sync`: pull the system into the
   repo to build against real components, or push canvas edits back.
4. **Surfaces consume the tokens** instead of re-encoding the palette:
   - `v2/src/app/globals.css` (currently OKLCH) derives from these hex values.
   - `scripts/generate_theory_of_change.py` (hard-coded hex) reads them.
   - `design/*.pen` deck variables match them.

## Genuine choices flagged for Ben (change one variable, all surfaces follow)

- **Primary terracotta.** Resolved by role: logo terracotta `#C45C3E` is the
  brand primary; clay `#A8643F` is the chart / HDPE anchor. If you want clay as
  the primary instead, change `--goods-terracotta` only.
- **Cream.** `#FBF8F1` (cost-story card) is the primary surface; `#FDF8F3` (logo
  cream) is kept as a variant. Pick one if you want them unified.

## What changed from the 2026-06-03 brand guide (brought to current canon)

The brand guide is excellent but predates three canon decisions, so this system
supersedes it on:

1. **Claim ceiling.** "A good bed can prevent heart disease" is retired as a
   claim. The scabies-to-rheumatic-heart-disease pathway is the **why**, never a
   claimed outcome (a health outcome only with a clinical partner, attributed).
2. **Washers.** "28 washers (14 working)" is retired. The canon figure is
   **16 in community**. Canon assets: 496 beds / 9 communities / 16 washers /
   2,660kg.
3. **"co-design"** is now **banned** in the lexicon (it was listed under USE in
   the 2026-06-03 guide). Use "designed in community", "designed with".

Everything else in the brand guide (logo system, photography, cultural protocol,
the rest of the voice) still holds; this system is the machine-readable core of it.
