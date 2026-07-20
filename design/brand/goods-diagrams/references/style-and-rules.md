# Goods diagrams — the locked style and the standing rules

Everything here derives from `design/brand/tokens.css` (the single source of
truth) and the existing `v2/public/images/brand/goods-ill-*` illustration set (the
visual anchor). When a value here and `tokens.css` ever disagree, `tokens.css`
wins; fix this file.

## Palette (pull the tokens, do not retype hex)

| Role | Token | Hex |
|------|-------|-----|
| Ground / paper | `--goods-cream` | `#FBF8F1` |
| Hairline / divider | `--goods-grid` | `#E6DFD1` |
| Line (the drawing line) | `--goods-clay` | `#A8643F` |
| Label ink | `--goods-ink` | `#2B2A26` |
| Caption / sub | `--goods-sub` | `#7A7363` |
| Brand keyline / eyebrow | `--goods-terracotta` | `#C45C3E` |

## The material → colour map (colour carries meaning)

Never colour an element off this map. It is how a Goods diagram stays legible
without labels: a viewer learns that clay is plastic, gold is steel, and reads the
picture.

| Material / concept | Token | Hex |
|--------------------|-------|-----|
| Recycled HDPE plastic | `--goods-clay` | `#A8643F` |
| Steel (poles, frame) | `--goods-gold` | `#BBA255` |
| Canvas | `--goods-teal` | `#5C8A86` |
| On Country / place / connection | `--goods-sage` | `#8B9D77` |
| Surplus / community / fixed block | `--goods-green` | `#5E7A4C` |
| Factory / contribution / hardware | `--goods-olive` | `#7E9A68` |
| Freight / buy-kit | `--goods-teal` | `#5C8A86` |
| Labour | `--goods-gold` | `#BBA255` |

## Line

- One medium weight (about 3px on a 1600-wide canvas), rounded caps and joins.
- A single confident pass. Not a sketchy double line, not variable-width
  calligraphy. The `goods-ill-*` set is the reference: an even, warm clay line.
- Objects are drawn as outlines on cream (open, airy), not filled silhouettes.

## Speckle (the recycled-plastic signature)

Any pressed recycled-plastic surface (a leg, a sheet, a flake pile) carries a few
small sage `#8B9D77` flecks. This terrazzo speckle is how the material reads as
*recycled* rather than new. It is the one decorative flourish; use it only on
plastic.

## Type

- **Labels:** uppercase, mono (`ui-monospace`), ink `#2B2A26`, letter-spacing
  ~0.12em. Short: a noun or a two-word phrase.
- **Eyebrow / title:** uppercase mono, terracotta `#C45C3E`, wider tracking.
- **Display (rare, for a hero title over a diagram):** Georgia, per the brand.
- Text is added in the assembly template, never generated inside an illustration.
  Generated text is unreliable (Midjourney is ~30-40% accurate), uneditable, and
  cannot be canon-checked. Keeping labels in the template keeps them exact.

## The standing rules, and why each exists

1. **One idea, one image.** A diagram that carries two ideas carries neither. If
   the caption needs an "and", split it. This is what keeps the set readable at a
   glance on a slide or a phone.
2. **Hands, not faces. No identifiable people, ever.** Goods centres community
   agency, and a face is a consent question that a diagram cannot answer. Show
   authorship and work through hands. (Real, consent-cleared *photographs* of
   named people are a separate system; this is the illustration layer.)
3. **At most one canon number, never a dollar figure.** An illustration carries a
   fact of the `20KG PER BED` / `NO TOOLS` / `5 MINUTES` class, pulled from canon.
   Money lives in charts and the kit's number tokens, where it is precise and
   caveated; a dollar figure floating in a drawing reads as a claim.
4. **No text baked into a generated motif.** See Type above.
5. **No em dashes.** House rule across all Goods surfaces. Use colons, periods,
   parentheses.
6. **The claim ceiling.** The scabies → rheumatic-heart-disease pathway is the
   *why* a bed and a washer matter, never a claimed outcome. Draw the health chain
   abstractly: chain links, a bed breaking a link. Never draw a sick person, a
   child, or a body. A health outcome is only ever claimed by a clinical partner,
   attributed to them.
7. **X-trestle drawn true.** Two crossed-plank recycled-plastic legs; two steel
   poles thread through the canvas long-edge sleeves and into the top holes of the
   legs; the canvas is structural and pulled taut. Never clip-on legs, never woven
   cord or rope, never a timber frame, never a sagging hammock. Getting this wrong
   misrepresents the product.
8. **No cultural cliché.** Place, Country and ownership motifs stay neutral: a
   house cradled in two hands, a simple horizon-and-sun line. No dot-painting, no
   flags, no boomerangs or spears, no faces, no sacred symbols. Respect is drawn
   as restraint.
9. **Ownership is a pathway.** When a diagram shows the making moving to community
   (hands, a key, a handover), it shows a direction, never a completed transfer.
   Goods' goal is to become unnecessary; the drawing says "moving toward", not
   "done".
