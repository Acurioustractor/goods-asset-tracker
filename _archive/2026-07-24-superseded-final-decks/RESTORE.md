# Superseded Final decks — archived 2026-07-24

## What these are
- `Goods_Final_Deck.pen`
- `Goods_Final_Deck_SHARE.pen`

Two earlier "FINAL" versions of the Goods funder deck, moved out of `design/`.

## Why archived
Superseded by **`design/Goods_Deck_SHIP.pen`** (saved 2026-07-22 18:07, ~20–35 min
after these two), which is now the single deck of record.

The trigger was a pre-sprint canon drift check: canon moved washing-machines-in-community
from 20 → **22** (Ben ruling 2026-07-21). `Goods_Deck_SHIP.pen` is correct (22×2, 20×0),
but both of these Final decks were left half-updated and internally inconsistent:
- `Goods_Final_Deck.pen` — 4× "20 wash…", 2× "22 wash…"
- `Goods_Final_Deck_SHARE.pen` — 5× "20 wash…", 1× "22 wash…"

Rather than hand-patch superseded `.pen` files (fragile — Pencil fill-by-path caching),
they were archived so no future session can reship the stale "20 washers".

## To restore
`git mv` either file back into `design/`. But before reusing, re-run the canon drift
check (`cd v2 && npm run check:canon` + grep the deck for stale figures) — these predate
the 22-washer ruling and may carry other stale numbers.

## Deck of record
`design/Goods_Deck_SHIP.pen`
