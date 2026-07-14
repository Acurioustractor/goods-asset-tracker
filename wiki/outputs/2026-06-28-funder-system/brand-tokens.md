# Goods on Country — Brand Token Sheet

> Designer-facing extract for pixel-consistent output in Pencil OR Claude Design / HTML.
> Single source of truth in repo: `design/brand/tokens.css`. The web app
> (`v2/src/app/globals.css`) and the cost-story chart palette derive from it.
> Reconciled to canon 2026-06-19. Extracted 2026-06-28.

---

## Typography

| Role | Font stack | Use |
|---|---|---|
| **Display** | `Georgia, "Times New Roman", serif` | All editorial headings on public pages, card headings, cost-story `serif`. Warm, low-cost, on every machine. |
| **Body** | `system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif` | Body copy, captions, labels. |
| **Logo ONLY** | `"Poppins", "Helvetica Neue", Arial, sans-serif` — **Poppins Medium 500** | The wordmark only. Never body or headings. |

- Convention: **Georgia display vs system-sans body.** Logo is its own font (Poppins Medium 500), used nowhere else.
- Tracking: display headings `-0.01em` (`--goods-display-tracking`); all-caps eyebrows/labels `0.12em` (`--goods-eyebrow-tracking`).
- Logo type detail: `Goods.` letter-spacing -3 at display size (period rendered as a round dot); `ON COUNTRY` all-caps, letter-spacing +8.
- Drop the `Inter` / `Playfair Display` / `Geist` loads in `layout.tsx` — flagged unused. Keep Poppins (logo), Georgia (display), system-sans (body).

---

## Color palette (hex)

**Surfaces / ground**
| Token | Hex | Role |
|---|---|---|
| `--goods-cream` | `#FBF8F1` | Primary warm surface (cost-story card frame). The canonical cream. |
| `--goods-cream-logo` | `#FDF8F3` | Logo cream square variant; also the illustration background |
| `--goods-cream-muted` | `#F1ECE4` | Muted section surface (web `--muted`) |
| `--goods-sand` | `#E8DCC8` | Warm sand, subtle surfaces (web `--secondary`) |
| `--goods-card` | `#FFFFFF` | Pure-white card on cream |
| `--goods-grid` | `#E6DFD1` | Hairlines, chart gridlines, borders, dividers |

**Brand primary**
| Token | Hex | Role |
|---|---|---|
| `--goods-terracotta` | `#C45C3E` | **Brand primary** — logo keyline, rules, `--primary`, focus ring |
| `--goods-clay` | `#A8643F` | HDPE / plastic; the **chart anchor** (distinct role, not a competitor) |

**Secondary accents (connection to Country)**
| Token | Hex | Role |
|---|---|---|
| `--goods-sage` | `#8B9D77` | Secondary accent, "ON COUNTRY", connection (`--accent`) |
| `--goods-olive` | `#7E9A68` | Hardware / contribution / factory |
| `--goods-green` | `#5E7A4C` | Surplus / community / fixed block |
| `--goods-teal` | `#5C8A86` | Canvas / freight / buy-kit |
| `--goods-gold` | `#BBA255` | Steel / labour |
| `--goods-rose` | `#C18A7B` | "Defy" comparison panels |

**Ink / text**
| Token | Hex | Role |
|---|---|---|
| `--goods-ink` | `#2B2A26` | Body text (`--foreground`) |
| `--goods-ink-logo` | `#2E2E2E` | "Goods" wordmark ink |
| `--goods-charcoal` | `#0A0A0A` | Logo on light |
| `--goods-sub` | `#7A7363` | Captions, muted / sub-text |

- `--destructive` is a functional error red (`oklch(0.577 0.245 27.325)`), NOT a brand colour.
- Genuine choices flagged for Ben: terracotta `#C45C3E` (brand) vs clay `#A8643F` (chart) kept as separate roles; cream `#FBF8F1` (primary) vs `#FDF8F3` (logo variant) not yet unified.

---

## Spacing / scale / elevation

| Token | Value | Use |
|---|---|---|
| `--goods-radius` | `0.625rem` (10px) | Base radius; derives sm/md/lg/xl…4xl (+16px) |
| `--goods-radius-card` | `1.5rem` (`rounded-3xl`) | **The Goods card radius** |
| `--goods-shadow-card` | `0 1px 3px rgba(43,42,38,.08), 0 6px 18px rgba(43,42,38,.06)` | Card elevation (`shadow-sm`) |
| `--goods-pad-card` | `2rem` (`p-8`; `p-5` mobile) | Card padding |
| `--goods-gap` | `1rem` | Default gap |

- Card pattern: cream frame `#FBF8F1`, `rounded-3xl`, `border` = `--goods-grid`, `shadow-sm`, `p-5 md:p-8`, Georgia headings, terracotta/clay-led charts.

---

## Logos (asset paths)

Full SVG system: **`v2/public/brand/logos/`** (serves live at `/brand/logos/`). Wordmark = `Goods.` in Poppins Medium 500 with `ON COUNTRY` beside (inline) or below (stacked).

| File | Description |
|---|---|
| `goods-stacked-black.svg` / `-white` / `-on-light` / `-on-dark` | Stacked mark (`Goods` over `ON COUNTRY`) — **site header + footer use this** |
| `goods-inline-black.svg` / `-white` / `-on-light` / `-on-dark` | Inline mark (`Goods.` then `ON COUNTRY` beside) |
| `goods-chip-on-light.svg` / `-on-dark` | Chip / compact mark |
| `README.md`, `preview.html` | Logo system docs + preview |

PNG inline logos (deck use): `design/deck-assets/goods-inline-black.png`, `design/deck-assets/goods-inline-white.png`.
Legacy cream-square favicon `logo.svg` is NOT the wordmark.

---

## Chart palette (Recharts — `v2/src/app/cost-story/cost-charts.tsx`)

Const `C` object (matches infographic exports). Web `--chart-1..5` map: terracotta, sage, gold, clay, teal.

| Key | Hex | Meaning |
|---|---|---|
| `clay` | `#A8643F` | HDPE / plastic (chart anchor, reference lines) |
| `rose` | `#C18A7B` | Defy / freight panels |
| `teal` | `#5C8A86` | Canvas / freight / buy-kit |
| `gold` | `#BBA255` | Steel / labour |
| `olive` | `#7E9A68` | Hardware / contribution / factory |
| `green` | `#5E7A4C` | Fixed block / surplus / community |
| `ink` | `#2B2A26` | Axis labels, data labels |
| `sub` | `#7A7363` | Secondary axis text |
| `grid` | `#E6DFD1` | `CartesianGrid` / `stroke` |
| `card` | `#FBF8F1` | Chart card background |

Conventions: gridlines `stroke={C.grid}`; reference lines `strokeDasharray` (e.g. `"5 4"`); line `strokeWidth` 2.5–3, `dot={false}`, `isAnimationActive={false}`; bars `radius={[6,6,0,0]}` on the top series; axis `fontSize` 12–13.

**Rule:** quantitative diagrams (costs, break-even, sankeys) are ALWAYS code/Recharts driven from `computeModel()`. Illustrations never carry precise financial figures.

---

## Line-illustration palette (skill `goods-illustrations`)

For processes, how-to, concepts — never product photos or numeric charts.

- **Background:** cream `#FDF8F3` (not white, not grey, no texture/gradient/shadow).
- **Line art:** single-weight terracotta `#A8643F` (logo terracotta `#C45C3E` acceptable). Thin, slightly hand-drawn, consistent weight. **Never black.**
- **Accent:** sage `#8B9D77` ONLY — HDPE dots/pellets, material fills, Country/connection notes.
- **Composition:** subject fills 40-60%, ≥35% quiet space; one image = one idea.
- **Labels:** English, UPPERCASE, 1-5 words, max 5-7 per image, clean sans in terracotta, no em dashes.
- **Hands, not faces.** No identifiable people, no mascot. 16:9 default, 4:3 for how-to steps.
- Calibration assets: `v2/public/images/brand/goods-ill-{bed,leg,poles,canvas,washing-machine,plant,plastic-loop,assembly}.png`.

---

## Voice rules (hard brand contract)

- **ZERO em dashes and en dashes** (the #1 AI tell). Also no arrows-in-prose.
- **Straight quotes** only (no smart/curly).
- **"On Country" capitalised.** "The making belongs on Country."
- **Units, no space:** `20kg`, `26kg`, `200kg`.
- **"co-design" is BANNED.** Use "designed in community" / "designed with".
- Tone: warm, grounded, community-first. Lead with impact/agency, never charity.
- Real community language welcome ("deadly", "more better", "around the fire").
- **Voice + face + number on the same beat.** Never a stat alone, never a quote alone.
- **Claim ceiling:** scabies→rheumatic-heart-disease is the WHY only, never a claimed Goods health outcome (only with an attributed clinical partner).
- Cite the source inline for any number. Consent (FPIC, OCAP) gates every name/image/voice; use only the display-cleared set.
- Canon assets: **496 beds / 9 communities / 16 washers / 2,660kg HDPE**. Signed FY revenue **AU$713,827**. Bed price **$750**.

---

## Existing design files inventory

**Token / system sources (`design/brand/`)**
| File | Description |
|---|---|
| `tokens.css` | **THE single source of truth** — colour, type, radius, spacing (`--goods-*`) |
| `README.md` | Brand-system overview + sync process (repo → Claude Design) |
| `cards/colors.html` | Colour-foundation preview card (`@dsCard`) |
| `cards/typography.html` | Type-scale preview card |
| `cards/buttons.html` | Button component card |
| `cards/cards.html` | Card component card |
| `cards/callouts.html` | Callout component card |
| `cards/voice.html` | Voice / copy rules card |

**Claude Design mirror (`design/brand/claude-design/`)**
| File | Description |
|---|---|
| `colors_and_type.css` | Hex mirror of tokens for the Claude Design project |
| `preview/_base.css` | Project variable convention (`--background`, `--primary`, `--chart-*`, `--font-display`) |
| `preview/invest-onepager.html` | Funder one-pager (story, traction, ask, stack) |
| `preview/invest-capital-stack.html` | $425K match diagram (SEFA $250K + Snow $100K + Centrecorp $75K vs contingent $400K) |
| `preview/invest-match-progress.html` | Reusable $0-of-$400K signed-match meter |
| `preview/invest-funder-pipeline.html` | 15-prospect board (warm / FN-ownership-gated / park lanes) |
| `preview/invest-funder-card.html` | Reusable one-funder template (SEFA worked example) |
| `preview/invest-teaser-deck.html` | 7-slide investor teaser (16:9 frames) |
| `preview/invest-stat-band.html` | Reusable stat band ($713,827 / $750 / 496 beds / $400K) |

**Pencil decks (`design/`)**
| File | Description |
|---|---|
| `goods-theory-of-change-v2.pen` | Theory-of-change deck, v2 (current, 222KB, 26 Jun) |
| `goods-theory-of-change.pen` | Theory-of-change deck, v1 (legacy, 31KB, 29 May) |

**Brand guide doc (`wiki/outputs/2026-06-03-goods-brand-guide/`)**
`BRAND-GUIDE.md` (full narrative guide; tokens.css supersedes it on claim ceiling, 16 washers, "co-design" banned), `brand-board.html`, `IMAGE-PLAN.md`, `NOTION-CONTENT.md`, `photo-video-review.html`.

**Logos:** `v2/public/brand/logos/*.svg` (10 SVGs, see Logos section) + `design/deck-assets/goods-inline-{black,white}.png`.

**Line illustrations:** `v2/public/images/brand/goods-ill-{assembly,bed,canvas,leg,plant,plastic-loop,poles,washing-machine}.png` (8).

**Deck photography:** `design/deck-assets/` — product (`stretch-bed-in-use.jpg`, `stretch-bed-community.jpg`, `goods-bed-anatomy.jpg`, `goods-bed-assembly.jpg`), plant (`factory-panorama.jpg`, `container-factory.jpg`, `heat-press-full.jpg`, `shredder-granulator.jpg`, `pressed-sheets.jpg`, `shredded-plastic-tubs.jpg`), people (`mykel.jpg`, `linda-turner.jpg`, `norman-frank.jpg`, `alfred-johnson.jpg`, `nic-with-elder-on-verandah.jpg`), Utopia field (`utopia-02/06/09/16.jpg`, `community-testing-bed-golden-hour.jpg`), plus rendered chart PNGs (`goods-breakeven.png`, `goods-cost-curve.png`, `goods-sankey-money.png`, `goods-where-750-goes.png`, `goods-community-ownership-v2.png`).

**Claude Design project id:** `a24f62c8-2be7-4811-887d-f5f8a24f3cf9` ("Goods on Country Design System").
