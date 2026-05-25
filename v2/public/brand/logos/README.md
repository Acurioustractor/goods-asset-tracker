# Goods on Country — Logo Pack

Canonical brand wordmark pack. Pure SVG so it scales to anything (billboards, favicons, embroidery files). Source: `Goods.` set in Poppins Medium, `ON COUNTRY` tracked +8 below or beside.

## Files

### Stacked (vertical — `Goods` over `ON COUNTRY`)
| File | Use case |
|---|---|
| `goods-stacked-white.svg` | White wordmark, transparent background. Drop on any dark photo or colour. |
| `goods-stacked-black.svg` | Charcoal wordmark, transparent background. Drop on any light photo or colour. |
| `goods-stacked-on-dark.svg` | White on charcoal (`#0A0A0A`). Self-contained block for headers, social cards. |
| `goods-stacked-on-light.svg` | Charcoal on cream (`#FDF8F3`). Self-contained block for letterheads, decks. |

### Inline (horizontal — `Goods.` then `ON COUNTRY` side by side)
| File | Use case |
|---|---|
| `goods-inline-white.svg` | Header/footer on dark surfaces. |
| `goods-inline-black.svg` | Header/footer on light surfaces. |
| `goods-inline-on-dark.svg` | Self-contained dark band. |
| `goods-inline-on-light.svg` | Self-contained cream band. |

### Chip (compact — matches the original screenshot at small sizes)
| File | Use case |
|---|---|
| `goods-chip-on-dark.svg` | App icons, badges, footer marks, watermarks. |
| `goods-chip-on-light.svg` | Same, light surface. |

## Preview

Open `preview.html` in a browser to see every variant on dark and light surfaces at once.

## Colours (do not improvise)

| Token | Hex | Where |
|---|---|---|
| Charcoal | `#0A0A0A` | Dark backgrounds, dark wordmark |
| Cream | `#FDF8F3` | Light backgrounds |
| White | `#FFFFFF` | White wordmark |

## Type

`Goods.` — **Poppins Medium 500**, letter-spacing `-3` at display size. Falls back to Helvetica Neue → Arial → system sans-serif.
`ON COUNTRY` — **Poppins Medium 500**, letter-spacing `+8`, all caps.

Poppins is loaded by the v2 app globally via `next/font/google`, so the SVGs render correctly in the browser without embedding the font. For print/export, outline the text in Illustrator first.

## Clear space

Minimum padding around the wordmark = the cap-height of the word `Goods`. Don't crop inside that.

## Don'ts

- Don't stretch, skew, recolour, drop-shadow, or outline the wordmark.
- Don't put it on busy photography without a tint layer.
- Don't recreate the wordmark from scratch in Canva — use these files.
- Don't add the `Goods Box` rule line from the legacy `/v2/public/logo.svg` to these — that's a different mark (the cream square favicon).

## Where this fits

- **Web header/footer:** `goods-inline-on-dark.svg` or `goods-inline-on-light.svg` depending on theme.
- **Social card / OG image:** `goods-chip-on-dark.svg` bottom-right.
- **Field-note PDF cover:** `goods-stacked-on-dark.svg` centred.
- **Favicon:** `/v2/public/logo.svg` (the cream square, kept for backwards compatibility).
