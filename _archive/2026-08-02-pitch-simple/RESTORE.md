# /pitch/simple, archived 2026-08-02

Retired by ruling W. `/pitch/simple` now 308-redirects to `/pitch/road`.

## What is in here

- `route/` — the Next route: `page.tsx` and `simple-deck-client.tsx`
- `deck-slides/` — 35 stale PNGs, `slides-source.html`, and `goods-simple-deck.pdf`

## Why it went

Ruling R (2026-07-26) made `/pitch/road` THE deck and kept `/pitch/simple` for exactly one
reason: **it was the PDF pipeline**, and a funder attachment is a real need that a scrolling page
cannot serve. That reason expired.

**The pipeline was broken.** `simple-deck-client.tsx` told anyone who looked to "Run:
node scripts/render-deck.mjs". That script does not exist anywhere in the repo. Nothing has
regenerated since 25 July 2026 and nothing could.

**Three deck generations were layered on top of each other.** 35 PNGs across 12 slide numbers.
`page.tsx` read the whole directory and sorted, so the route served each slide two or three times
from three different eras. That was live on an open URL.

**Slide 1 carried the retired north star.** `slides-source.html` said *"It is a plant that
belongs to the people sleeping on the beds."* Rulings D and E retired that: the object is
**infrastructure, not a plant**, and ownership sits with whichever community runs the site, not
with the people sleeping on the beds. Canon has read *"a community that can collect the plastic,
make the goods, and come to own the making"* since 2026-07-25.

**The ask slide carried the retired QBE mechanic**, swept everywhere else by ruling V on
2026-08-01. The HTML was corrected in that sweep; the PNGs and PDF never could be.

**The HTML and the PNGs had also drifted apart.** The HTML puts the ask at slide 11; the PNGs
name slide 09 "ask". They came from different deck plans.

## What replaced it

`/pitch/road` is the deck (rulings R and U). For the funder-attachment need, Jay Boolkin at
Social Impact Hub answered it directly on 14 July 2026: *"Pitch materials, simply whatever you've
already used to secure external capital, so no need to create anything new."*

## To restore

```
git mv _archive/2026-08-02-pitch-simple/route v2/src/app/pitch/simple
git mv _archive/2026-08-02-pitch-simple/deck-slides v2/public/deck-slides
```

Then remove the `/pitch/simple` redirect from `v2/next.config.ts`.

**Do not restore without fixing all four faults first**, or you re-publish a triplicated deck
whose first slide contradicts canon: write `scripts/render-deck.mjs`, correct
`slides-source.html` against canon, delete the stale PNG generations, and regenerate.
