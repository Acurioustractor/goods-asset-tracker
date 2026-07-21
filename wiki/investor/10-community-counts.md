# Area 10 — Community counts reconciliation

> SUPERSEDED NOTE (2026-07-20): the tables below capture the pre-ruling state (536/173/18/3,460). Ben's 2026-07-19 rulings resolved them: FINAL CANON = 540 beds / 177 Stretch / 363 Basket / 20 washers in community / 11 communities / 3,540kg; Utopia 147, Tennant Creek 160, Maningrida 58 beds + 8 washers, Kununurra 2 (GB0-158), Katherine 1 (GB0-159), youth centre 1 (GB0-160), Julalikari +2 washers. Read the tables as history of the reconciliation, not as canon.
>
> Corrected to final canon 2026-07-21 (540/177/363/20/11/3,540kg per Ben rulings).

> Purpose: one ruling per line so 536/173/18/3,460 (or corrected figures) land identically in
> the live register, repo canon, Community OS (Notion), and the Artifact Hub spine (Notion).
> READ-ONLY pass: no Notion or database writes until Ben rules.
>
> Sources:
> - REGISTER = live Supabase `assets` (project cwsyhpiuepvdjtxaozwf), status=deployed,
>   summed by quantity, queried 2026-07-19 via REST (Verified)
> - CANON = `v2/src/lib/data/asset-canonical.ts` (`ec2edad`, 2026-07-19)
> - OS = Notion "Goods Community OS" counts-control table, as at 16 Jul 2026
> - HUB = Notion "Goods Artifact Hub" spine, refreshed 2026-06-16 (stale)

## Headline totals

| Figure | REGISTER | CANON | OS | HUB | Status |
|---|---|---|---|---|---|
| Total beds deployed | **536** (363 Basket + 173 Stretch) | 536 | 562 | 496 | REGISTER = CANON ✓. OS +26 ahead. HUB stale. |
| Stretch beds | **173** | 173 | 170 known (+ splits missing) | 133 | REGISTER = CANON ✓ |
| Basket beds | **363** | 363 | 60 known (splits missing) | 363 | ✓ where filled |
| Washers | **30 deployed** in register | 18 "in community" (curated) | 11 | 16 | FOUR different numbers — needs a ruling (see below) |
| HDPE diverted | 173 × 20kg = 3,460kg | 3,460 | — | 2,660 | Follows Stretch count ✓ |

## Per-community: beds

| Community | REGISTER (B+S=total) | OS total | Delta | Ruling needed |
|---|---|---|---|---|
| Utopia / Urapuntja | 60+87 = **147** | 169 (60+109) | OS +22 Stretch | Where do OS's extra 22 Stretch come from? Register says 87 (matches the long-standing "87 delivered"). If a July round delivered more, it needs register rows; otherwise OS corrects to 147. |
| Tennant Creek | 130+29 = **159** | 160 | OS +1 | OS logs "+1 (total only)" latest round. Either add the register row or correct OS to 159. |
| Palm Island | 131+0 = **131** | 131 | ✓ | none — also fill OS split (131 Basket) |
| Maningrida | 18+40 = **58** | 58 | ✓ total | Totals agree, but OS says split is 0 Basket / 58 Stretch — register says 18 Basket / 40 Stretch. Register matches the INV-0303 ruling (40 Stretch FINAL). Fix the OS split. |
| Kalgoorlie | 20+0 = **20** | 20 | ✓ | fill OS split (20 Basket) |
| Alice Springs / Oonchiumpa | 1+15 = **16** | 16 | ✓ | fill OS split (1B/15S) |
| Canberra | 0+2 = **2** | 2 | ✓ | fill OS split |
| Mount Isa | 2+0 = **2** | 2 | ✓ | fill OS split |
| Darwin | 1+0 = **1** | 1 | ✓ | fill OS split |
| Kununurra | **absent from register** | 2 (2 Stretch) | OS +2 | If 2 Stretch were genuinely delivered, the register needs 2 rows (delivery counting is separate from the story consent hold). Else OS corrects to 0. |
| Katherine | **absent from register** | 1 (1 Stretch) | OS +1 | Same: add register row or correct OS. |

If Kununurra 2 + Katherine 1 + Tennant +1 + Utopia +22 are all real deliveries, the true total
is 562 and CANON must move. If they are not register-backed, OS corrects to 536. **This is the
core ruling.** (OS itself says: "Fill from the asset register before external claims.")

## Washers — the messiest line

| Community | REGISTER deployed | OS | Notes |
|---|---|---|---|
| Tennant Creek | 14 | 5 | register includes early/failed units? |
| Maningrida | 8 | 2 | INV-0303 + Ben ruling says **2** FINAL. Register carries 8 — likely the pre-correction rows; the staged Maningrida correction script covered beds; washers may need the same treatment. |
| Palm Island | 4 | 4 | ✓ |
| Alice Springs | 3 | 0 | |
| Darwin | 1 | 0 | |
| **Totals** | **30** | **11** | CANON says **18 in community** (curated, Ben 2026-06-11); HUB says 16. |

Ruling needed: define "in community" once (deployed-and-working? deployed-and-not-retired?),
then either mark register rows (retired/failed) so a query can reproduce 18, or restate the
canonical washer figure. Today the 18 is curated and NOT register-derivable, which fails the
"explainable numbers" bar.

## Stale surfaces to sweep after rulings (Tier 2 — Ben approves each)
1. Notion Artifact Hub spine: 496 → 540, 133 → 177, 16 → 20, 2,660 → 3,540, revenue note to $713,827-only.
2. Community OS counts table: apply per-line rulings above, fill Basket/Stretch splits from register (7 communities ready now).
3. Community OS washer column to the ruled definition.
4. Then re-run `check-asset-drift.mjs` and confirm green.

## Rulings applied 2026-07-19 (Ben, this session)
- [x] **Utopia = 147** confirmed. OS's 169 is wrong; correct OS to 147 (pending Notion sweep).
- [x] **Kununurra +2 Stretch** — real delivery to an Aunty (name to be added by Ben). Register rows GB0-158-1/2 inserted; `kununurra` community created (Miriwoong country). Story content remains consent-held; counting is separate.
- [x] **Katherine +1 Stretch** — delivered by Nic. Register row GB0-159-1; `katherine` community created (Jawoyn country).
- [x] **Tennant Creek +1 Stretch** — given to the youth centre (Ben to follow up). Register row GB0-160-1.
- [x] **Maningrida washers = 8 is CORRECT** (6 existing + 2 new). The "2" in earlier notes was the latest delivery, not the total. OS corrects 2 → 8.
- [x] New canon: **540 beds / 177 Stretch / 363 Basket / 3,540kg HDPE / 11 communities served (12 touched)**. Register, `asset-canonical.ts`, `canon.ts`, drift script and ~25 code/copy surfaces swept; `check-asset-drift.mjs` GREEN; build passes.

## Washer resolution (2026-07-19, Ben)
- Canonical in-community = **20** (16 base 2026-06-11 + 2 Maningrida GB0-WM-MANI + 2 Julalikari Tennant Creek GB0-WM-TC-JUL). Swept across code (incl. impact-fetcher which was stale at 16); build green.
- Purchase provenance = the locked huge-session ledger `wiki/outputs/2026-05-14-washing-machine-final-reconciliation.md`: **18 bought (Xero, 1300 Washer/Speed Queen) + 4 BHAC re-skins**, 6-machine gap already documented there with candidate explanations (Nic to confirm). Do NOT re-reconcile from scratch.
- Register now holds 32 deployed rows; the ~12-row status cleanup from the May doc remains the path to making 20 query-derivable.
- Aunty Jean O'Reera recorded as recipient on both Kununurra beds.

## Still open
- [ ] Notion sweeps (Tier 2, per-write approval): Community OS counts table (Utopia 147, Maningrida washers 8, add Kununurra/Katherine/Tennant lines, fill Basket/Stretch splits) + Artifact Hub spine (496→540 etc.).
- [ ] Ben to add: the Kununurra Aunty's name; Margaret's video + details (in system, needs updating); youth-centre follow-up.
- [ ] Community-names review (Ben): align all community/recipient names so everyone can be added properly.
- [ ] `basket-bed-plans` page says "9 communities" (Basket-specific) — confirm whether it should stay.
- [ ] `compendium.ts` deployments array: Maningrida washers still listed as 2 vs confirmed 8 — align when washer definition lands.
