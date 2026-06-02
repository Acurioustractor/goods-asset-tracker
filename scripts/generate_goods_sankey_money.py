#!/usr/bin/env python3
"""
Goods on Country — money-flow Sankey (income-statement style) for 500 beds/yr
in-house (factory) production. SVG + PNG + PDF.

House style mirrors generate_goods_cost_explainers.py / generate_goods_cost_down.py
verbatim (same palette, fonts, helpers, SVG -> PNG/PDF via rsvg-convert).

The idea: an income statement is best read as a Sankey — band thickness is
proportional to dollars, so the reader literally sees where the money goes.

LOCKED v6 cost model, 500 beds/yr @ AU$750 (do not change — all derivable from v6):
  Revenue              500 x $750            = $375,000
   -> COGS                                   = $137,870
        Plastic (raw shred)   500 x $55      =  $27,500
        Diesel                500 x $15      =   $7,500
        Process labour        500 x $80      =  $40,000
        Steel + canvas + hardware
                              500 x $125.74  =  $62,870
   -> Freight             500 x $150         =  $75,000
   -> Contribution                           = $162,130
        Fixed block (1 yr)                   = $109,500
        Operating surplus                    =  $52,630

  Check: 137,870 + 75,000 + 162,130 = 375,000  ✓
         27,500 + 7,500 + 40,000 + 62,870 = 137,870  ✓
         109,500 + 52,630 = 162,130  ✓

Regenerate: python3 scripts/generate_goods_sankey_money.py
Output:     v2/public/goods-sankey-money.{svg,png,pdf}
"""

import subprocess
from pathlib import Path

# ------------------------------------------------------------------- palette
BG       = "#FBFAF5"
INK      = "#2A241E"
INK_MUTE = "#6F6155"
HAIR     = "#C9BCA8"
SAND     = "#EFE8DA"

TERRA  = "#BD6A3C"
SAGE   = "#6F9C68"
GOLD   = "#C2A55E"
CLAY   = "#8A5A45"
TEAL   = "#4C9B97"
PURPLE = "#7A5C8E"
SLATE  = "#2B2D2A"

def darken(hex_color, f=0.74):
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    return "#%02X%02X%02X" % (int(r*f), int(g*f), int(b*f))

def tint(hex_color, a=0.12):
    return hex_color + "%02X" % int(a*255)

SERIF = "Georgia, 'Times New Roman', serif"
SANS  = "'Helvetica Neue', Helvetica, Arial, sans-serif"

# --------------------------------------------------------------------- utils
def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def wrap(text_in, max_chars):
    words, lines, cur = text_in.split(), [], ""
    for w in words:
        if cur and len(cur) + 1 + len(w) > max_chars:
            lines.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur:
        lines.append(cur)
    return lines

def text(x, y, s, size, color, family=SANS, weight="400", anchor="middle",
         italic=False, spacing=None):
    st = ' font-style="italic"' if italic else ""
    sp = f' letter-spacing="{spacing}"' if spacing else ""
    return (f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{family}" '
            f'font-size="{size}" font-weight="{weight}" fill="{color}"{st}{sp}>{esc(s)}</text>')

def mtext(cx, y, lines, size, color, lh, **kw):
    return "".join(text(cx, y + i*lh, ln, size, color, **kw) for i, ln in enumerate(lines))

def rrect(x, y, w, h, r, fill, stroke=None, sw=1.4, shadow=False):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    fil = ' filter="url(#sh)"' if shadow else ""
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{r}" fill="{fill}"{s}{fil}/>'

def line(x1, y1, x2, y2, color, sw=1.6, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{color}" stroke-width="{sw}"{d}/>'

def dot(cx, cy, r, fill, stroke="#FFFFFF", sw=2):
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'

def tab(x, y, label, fill=SLATE):
    w = 14 + len(label) * 8.6
    out = rrect(x, y, w, 27, 6, fill)
    out += text(x + w/2, y + 18.5, label, 13, "#FFFFFF", weight="700", spacing="1.5")
    return out, w

def svg_open(W, H):
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{SANS}">']
    s.append('<defs><filter id="sh" x="-8%" y="-8%" width="116%" height="124%">'
             '<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#5A4A38" flood-opacity="0.10"/></filter></defs>')
    s.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')
    return s

def render(name, S):
    if not S or S[-1] != "</svg>":
        S.append("</svg>")
    pub = Path(__file__).resolve().parent.parent / "v2" / "public"
    svg_path = pub / f"{name}.svg"
    png_path = pub / f"{name}.png"
    pdf_path = pub / f"{name}.pdf"
    svg_path.write_text("\n".join(S))
    subprocess.run(["rsvg-convert", "-o", str(png_path), str(svg_path)], check=True)
    subprocess.run(["rsvg-convert", "-f", "pdf", "-o", str(pdf_path), str(svg_path)], check=True)
    print(f"wrote {name}.svg / .png ({png_path.stat().st_size} b) / .pdf")


# --------------------------------------------------------------- ribbon path
def ribbon(x0, y0a, y0b, x1, y1a, y1b, fill, opacity=0.82):
    """A horizontal Sankey ribbon from left edge (x0, top y0a / bottom y0b)
    to right edge (x1, top y1a / bottom y1b), with smooth cubic-bezier sides.
    Thickness at each end = |yb - ya|, proportional to dollars by construction."""
    mx = (x0 + x1) / 2.0
    d = (
        f"M {x0:.2f} {y0a:.2f} "
        f"C {mx:.2f} {y0a:.2f} {mx:.2f} {y1a:.2f} {x1:.2f} {y1a:.2f} "   # top edge L->R
        f"L {x1:.2f} {y1b:.2f} "                                          # down right end
        f"C {mx:.2f} {y1b:.2f} {mx:.2f} {y0b:.2f} {x0:.2f} {y0b:.2f} "    # bottom edge R->L
        "Z"
    )
    return f'<path d="{d}" fill="{fill}" fill-opacity="{opacity}" stroke="{darken(fill)}" stroke-width="1" stroke-opacity="0.55"/>'


# =====================================================================
# Money-flow Sankey
# =====================================================================
def chart_sankey():
    W, H = 1680, 980
    S = svg_open(W, H)
    S.append(text(W/2, 70, "Where the money goes", 50, INK, family=SERIF, weight="700"))
    S.append(text(W/2, 106,
                  "500 beds a year, in-house (factory) production — an income statement read as a flow. Band thickness = dollars.",
                  20, INK_MUTE, family=SERIF, italic=True))
    S.append(tab(60, 128, "FOLLOW THE MONEY")[0])

    # ----- geometry / scale -------------------------------------------------
    REVENUE = 375000.0
    top, bottom = 168.0, 812.0           # vertical band region
    avail = bottom - top                 # 644 px for the full $375,000 column
    SCALE = avail / REVENUE              # $-per-pixel so revenue fills most of canvas
    def h(v): return v * SCALE           # dollars -> pixels of band thickness

    # three columns of nodes
    NODE_W = 30.0
    x_rev_r  = 250.0                      # right edge of revenue node
    x_mid_l  = 760.0                      # left edge of mid nodes (COGS / Freight / Contribution)
    x_mid_r  = x_mid_l + NODE_W
    x_leaf_l = 1300.0                     # left edge of leaf nodes
    x_leaf_r = x_leaf_l + NODE_W
    x_rev_l  = x_rev_r - NODE_W

    GAP = 26.0                            # vertical gap between stacked nodes

    # ---- node definitions (value, color) ----
    # First-level flows out of Revenue (top -> bottom), order per spec.
    COGS, FREIGHT, CONTRIB = 137870.0, 75000.0, 162130.0
    # COGS children
    PLASTIC, DIESEL, LABOUR, SCH = 27500.0, 7500.0, 40000.0, 62870.0
    # Contribution children
    FIXED, SURPLUS = 109500.0, 52630.0

    # Colours: cost flows in TERRA/GOLD/CLAY/TEAL family; contribution/surplus in SAGE.
    c_cogs    = CLAY
    c_freight = TEAL
    c_contrib = SAGE
    c_plastic = TERRA
    c_diesel  = GOLD
    c_labour  = CLAY
    c_sch     = TEAL
    c_fixed   = darken(SAGE, 0.82)        # fixed block — muted sage (still "kept", but committed)
    c_surplus = SAGE                      # true operating surplus — full sage

    # ----- revenue node (left) ---------------------------------------------
    rev_top = top
    rev_bot = top + h(REVENUE)
    S.append(rrect(x_rev_l, rev_top, NODE_W, rev_bot-rev_top, 5, INK, stroke=darken(INK, 0.6), sw=1, shadow=True))
    # revenue label
    S.append(text(x_rev_l-16, rev_top + (rev_bot-rev_top)/2 - 12, "Revenue", 26, INK, family=SERIF, weight="700", anchor="end"))
    S.append(text(x_rev_l-16, rev_top + (rev_bot-rev_top)/2 + 16, "500 beds x $750", 15, INK_MUTE, italic=True, anchor="end"))
    S.append(text(x_rev_l-16, rev_top + (rev_bot-rev_top)/2 + 42, "$375,000", 24, darken(INK, 0.6), weight="700", anchor="end"))

    # ----- mid column: COGS / Freight / Contribution -----------------------
    mid = [("Cost of goods sold", COGS, c_cogs),
           ("Freight to community", FREIGHT, c_freight),
           ("Contribution", CONTRIB, c_contrib)]
    mid_y = []     # (top, bottom) per mid node, in stacked order
    y = top
    for (_lab, val, _col) in mid:
        mid_y.append((y, y + h(val)))
        y += h(val) + GAP

    # ribbons: revenue -> mid (stack source on the revenue node face in same order)
    src_y = rev_top
    for i, (lab, val, col) in enumerate(mid):
        s0, s1 = src_y, src_y + h(val)
        d0, d1 = mid_y[i]
        S.append(ribbon(x_rev_r, s0, s1, x_mid_l, d0, d1, col))
        src_y = s1   # no gap on the revenue face — it is one solid column

    # draw mid nodes + labels
    for i, (lab, val, col) in enumerate(mid):
        ny0, ny1 = mid_y[i]
        S.append(rrect(x_mid_l, ny0, NODE_W, ny1-ny0, 5, col, stroke=darken(col), sw=1, shadow=True))
        cy = (ny0+ny1)/2
        # label to the right of the node, except Contribution which feeds leaves on its right
        S.append(text(x_mid_r+14, cy-6, lab, 21, darken(col), family=SERIF, weight="700", anchor="start"))
        S.append(text(x_mid_r+14, cy+18, f"${val:,.0f}", 18, INK, weight="700", anchor="start"))

    # ----- leaf column ------------------------------------------------------
    # COGS children stack opposite the COGS node; Contribution children opposite Contribution node.
    cogs_kids = [("Plastic (raw shred)", PLASTIC, c_plastic),
                 ("Diesel", DIESEL, c_diesel),
                 ("Process labour", LABOUR, c_labour),
                 ("Steel + canvas + hardware", SCH, c_sch)]
    contrib_kids = [("Fixed block (running costs / yr)", FIXED, c_fixed),
                    ("Operating surplus", SURPLUS, c_surplus)]

    # COGS leaf positions: align top of leaf stack with top of COGS node
    cogs_top = mid_y[0][0]
    leaf_y = {}
    y = cogs_top
    for (lab, val, col) in cogs_kids:
        leaf_y[lab] = (y, y + h(val))
        y += h(val) + GAP
    # gap between COGS leaves and Contribution leaves
    contrib_start = max(y + GAP, mid_y[2][0])
    y = contrib_start
    for (lab, val, col) in contrib_kids:
        leaf_y[lab] = (y, y + h(val))
        y += h(val) + GAP

    # ribbons: COGS node -> its kids (source stacked on COGS node face)
    src_y = mid_y[0][0]
    for (lab, val, col) in cogs_kids:
        s0, s1 = src_y, src_y + h(val)
        d0, d1 = leaf_y[lab]
        S.append(ribbon(x_mid_r, s0, s1, x_leaf_l, d0, d1, col))
        src_y = s1

    # ribbons: Contribution node -> its kids
    src_y = mid_y[2][0]
    for (lab, val, col) in contrib_kids:
        s0, s1 = src_y, src_y + h(val)
        d0, d1 = leaf_y[lab]
        S.append(ribbon(x_mid_r, s0, s1, x_leaf_l, d0, d1, col))
        src_y = s1

    # draw leaf nodes + labels
    for (lab, val, col) in cogs_kids + contrib_kids:
        ny0, ny1 = leaf_y[lab]
        S.append(rrect(x_leaf_l, ny0, NODE_W, ny1-ny0, 5, col, stroke=darken(col), sw=1, shadow=True))
        cy = (ny0+ny1)/2
        # thin nodes: stack the two label lines; keep on one line for tall nodes
        if (ny1-ny0) >= 34:
            S.append(text(x_leaf_r+14, cy-5, lab, 18, darken(col), weight="700", anchor="start"))
            S.append(text(x_leaf_r+14, cy+18, f"${val:,.0f}", 17, INK, weight="700", anchor="start"))
        else:
            S.append(text(x_leaf_r+14, cy+5, f"{lab} — ${val:,.0f}", 16, darken(col), weight="700", anchor="start"))

    # column headers
    S.append(text(x_rev_l + NODE_W/2, top-26, "INCOME", 13, INK_MUTE, weight="700", spacing="2", anchor="start"))
    S.append(text(x_mid_l + NODE_W/2, top-26, "WHERE IT SPLITS", 13, INK_MUTE, weight="700", spacing="2", anchor="middle"))
    S.append(text(x_leaf_l + NODE_W/2, top-26, "LINE ITEMS", 13, INK_MUTE, weight="700", spacing="2", anchor="middle"))

    # ----- footer -----------------------------------------------------------
    fy = 884
    S.append(line(60, fy-22, W-60, fy-22, HAIR, 1))
    S.append(text(60, fy,
                  "Read left to right: every dollar of revenue is either a cost (cost of goods + freight) or contribution. "
                  "Contribution first pays the $109,500/yr fixed block; what is left is operating surplus.",
                  14, INK, family=SERIF, anchor="start"))
    S.append(text(60, fy+24,
                  "Source: Goods cost model v6 (2026-06), in-house (factory) path at 500 beds/yr. BOM + $750 price verified; "
                  "in-house plastic, labour, freight and volume modelled. Band thickness is proportional to dollars.",
                  11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))
    render("goods-sankey-money", S)


if __name__ == "__main__":
    chart_sankey()
