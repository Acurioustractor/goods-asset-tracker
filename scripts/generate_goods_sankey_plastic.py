#!/usr/bin/env python3
"""
Goods on Country — circular plastic / material-flow diagram (SVG + PNG + PDF).

A house-style companion to the cost explainers (generate_goods_cost_explainers.py /
generate_goods_cost_down.py — same palette, fonts, helpers, SVG -> PNG/PDF via
rsvg-convert). This one tells the impact + circular-economy story, NOT dollars.

Chart: "The circular life of 20kg of plastic" — a left-to-right process chain at
500 beds/yr (= 10 tonnes recycled HDPE/yr), with arrow ribbons between stages and a
big curved RETURN LOOP closing the circle (waste becomes beds, beds stay in
community, more waste re-enters).

Stage chain:
  Community waste plastic (10,000 kg/yr) -> Shred -> Hot-press + CNC (recycled-plastic
  legs) -> Assemble 500 Stretch Beds -> Delivered into community  -> (loop back)

Locked v6 cost-model figures used here (do not change):
  20 kg recycled HDPE diverted from landfill per bed; 500 beds/yr = 10 tonnes/yr.
  Idiot index on the legs: $344.05 finished kit vs ~$40 raw shred floor = 8.6x.
  (Materials + $750 price verified; in-house legs/labour/freight/volumes modelled.)

Regenerate: python3 scripts/generate_goods_sankey_plastic.py
Output:     v2/public/goods-sankey-plastic.{svg,png,pdf}
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

def darken(hex_color, f=0.74):
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    return "#%02X%02X%02X" % (int(r*f), int(g*f), int(b*f))

def tint(hex_color, a=0.12):
    return hex_color + "%02X" % int(a*255)

SERIF = "Georgia, 'Times New Roman', serif"
SANS  = "'Helvetica Neue', Helvetica, Arial, sans-serif"

# ---- shared section-tab motif (from generate_goods_anatomy_bed.py) ----
SLATE = "#2B2D2A"

def tab(x, y, label, fill=SLATE):
    w = 14 + len(label) * 8.6
    out = rrect(x, y, w, 27, 6, fill)
    out += text(x + w/2, y + 18.5, label, 13, "#FFFFFF", weight="700", spacing="1.5")
    return out, w

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

def svg_open(W, H):
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{SANS}">']
    s.append('<defs><filter id="sh" x="-8%" y="-8%" width="116%" height="124%">'
             '<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#5A4A38" flood-opacity="0.10"/></filter>'
             # arrowheads for the forward ribbons and the return loop
             '<marker id="arrSAGE" markerWidth="9" markerHeight="9" refX="6.2" refY="3.2" orient="auto">'
             f'<path d="M0,0 L7,3.2 L0,6.4 Z" fill="{darken(SAGE)}"/></marker>'
             '<marker id="arrTEAL" markerWidth="13" markerHeight="13" refX="7.5" refY="4.4" orient="auto">'
             f'<path d="M0,0 L9.5,4.4 L0,8.8 Z" fill="{darken(TEAL)}"/></marker>'
             '</defs>')
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


# =====================================================================
# CHART — The circular life of 20kg of plastic
# =====================================================================
def chart_plastic_loop():
    W, H = 1680, 980
    S = svg_open(W, H)

    S.append(text(W/2, 74, "The circular life of 20 kg of plastic", 50, INK, family=SERIF, weight="700"))
    S.append(text(W/2, 110, "Community waste becomes a bed, the bed stays in community, and more waste re-enters the loop — at 500 beds a year that is 10 tonnes of HDPE kept out of landfill.",
                  20, INK_MUTE, family=SERIF, italic=True))
    S.append(tab(60, 128, "THE PLASTIC LOOP")[0])

    # ---- stage geometry ------------------------------------------------
    # five stage cards left-to-right on a band; ribbons between; return loop below.
    row_cy = 330          # vertical centre of the stage band
    card_h = 168
    card_y = row_cy - card_h/2

    L, R = 70, W - 70
    band_w = R - L
    n = 5
    gap = 56              # ribbon gap between cards
    card_w = (band_w - gap*(n-1)) / n

    # stage: (title_lines, sub, value_line, fill, accent)  — SAGE/TEAL recycling flow, TERRA accents
    stages = [
        (["Community", "waste plastic"], "soft-drink crates, drums, offcuts",
         "10,000 kg / yr", SAGE, darken(SAGE)),
        (["Shred"], "washed + granulated on country",
         "10 tonnes feedstock", TEAL, darken(TEAL)),
        (["Hot-press + CNC"], "pressed into recycled-plastic legs",
         "in-house press", TEAL, darken(TEAL)),
        (["Assemble"], "legs + steel poles + canvas",
         "500 Stretch Beds", GOLD, darken(GOLD)),
        (["Delivered into", "community"], "washable, flat-pack, 200 kg rated",
         "20 kg HDPE / bed", TERRA, darken(TERRA)),
    ]

    centres = []
    for i, (titles, sub, valline, fill, accent) in enumerate(stages):
        x = L + i*(card_w + gap)
        cx = x + card_w/2
        centres.append((x, cx, card_w))
        # card
        S.append(rrect(x, card_y, card_w, card_h, 16, tint(fill, 0.14),
                       stroke=accent, sw=1.8, shadow=True))
        # numbered chip
        S.append(dot(x + 26, card_y + 26, 15, accent, stroke=BG, sw=2))
        S.append(text(x + 26, card_y + 31, str(i+1), 16, "#FFFFFF", weight="700"))
        # title (serif)
        ty = card_y + 64 if len(titles) > 1 else card_y + 74
        S.append(mtext(cx, ty, titles, 24, INK, lh=27, family=SERIF, weight="700"))
        # sub
        sub_lines = wrap(sub, 26)
        sy = card_y + (96 if len(titles) > 1 else 104)
        S.append(mtext(cx, sy, sub_lines, 13.5, INK_MUTE, lh=17, italic=True))
        # value chip near bottom
        vy = card_y + card_h - 20
        S.append(rrect(cx - 86, vy - 22, 172, 30, 15, accent, shadow=False))
        S.append(text(cx, vy - 1, valline, 14.5, "#FFFFFF", weight="700"))

    # ---- forward ribbons between cards (SAGE/TEAL positive flow) -------
    for i in range(n - 1):
        x0 = centres[i][0] + centres[i][2]      # right edge of card i
        x1 = centres[i+1][0]                    # left edge of card i+1
        ry = row_cy
        rib_h = 30
        # tapered ribbon body
        col = darken(SAGE) if i < 3 else darken(GOLD)
        body_fill = tint(SAGE, 0.30) if i < 3 else tint(GOLD, 0.30)
        x1a = x1 - 16  # leave room for arrowhead
        S.append(f'<path d="M{x0:.1f},{ry-rib_h/2:.1f} '
                 f'L{x1a-2:.1f},{ry-rib_h/2:.1f} L{x1a-2:.1f},{ry+rib_h/2:.1f} '
                 f'L{x0:.1f},{ry+rib_h/2:.1f} Z" fill="{body_fill}" />')
        S.append(f'<line x1="{x0:.1f}" y1="{ry:.1f}" x2="{x1-4:.1f}" y2="{ry:.1f}" '
                 f'stroke="{col}" stroke-width="3.4" marker-end="url(#arrSAGE)"/>')

    # ---- BIG RETURN LOOP (closing the circle) -------------------------
    # from "Delivered into community" (card 5) bottom, sweep down and all the way
    # back to "Community waste plastic" (card 1) bottom — teal, the loop closing.
    x_start, _, w_start = centres[-1]
    cx_last = x_start + w_start/2
    x_first, _, w_first = centres[0]
    cx_first = x_first + w_first/2

    loop_top = card_y + card_h           # leave cards from their bottoms
    loop_bottom = 700                     # how far the loop dips
    # cubic path: down from last card, big arc across, up into first card
    p = (f'M{cx_last:.1f},{loop_top:.1f} '
         f'C{cx_last:.1f},{loop_bottom+30:.1f} '
         f'{cx_first:.1f},{loop_bottom+30:.1f} '
         f'{cx_first:.1f},{loop_top+8:.1f}')
    S.append(f'<path d="{p}" fill="none" stroke="{darken(TEAL)}" stroke-width="4.6" '
             f'stroke-linecap="round" marker-end="url(#arrTEAL)"/>')
    # faint shadow ribbon under it for weight
    S.append(f'<path d="{p}" fill="none" stroke="{tint(TEAL,0.22)}" stroke-width="16" '
             f'stroke-linecap="round"/>')
    # re-stroke crisp line on top of the wide faint ribbon
    S.append(f'<path d="{p}" fill="none" stroke="{darken(TEAL)}" stroke-width="4.6" '
             f'stroke-linecap="round" marker-end="url(#arrTEAL)"/>')

    # loop label, centred on the dip
    loop_cx = (cx_last + cx_first) / 2
    loop_ly = loop_bottom + 14
    S.append(rrect(loop_cx - 250, loop_ly - 30, 500, 58, 16, BG, stroke=darken(TEAL), sw=1.8, shadow=True))
    S.append(text(loop_cx, loop_ly - 6, "The loop closes", 18, darken(TEAL), family=SERIF, weight="700"))
    S.append(text(loop_cx, loop_ly + 16, "beds stay in community · the plant can move to community ownership",
                  13.5, INK_MUTE, italic=True))

    # ---- headline annotation cards (above the loop, flanking) ----------
    ann = [
        ("20 kg", "of HDPE diverted from landfill, every bed", SAGE),
        ("10 tonnes", "kept out of landfill each year at 500 beds", TEAL),
        ("8.6×", "idiot index — $344 finished leg kit vs ~$40 raw shred: the legs are the whole capital case", TERRA),
    ]
    ay = 770
    aw, ah = 500, 116
    ag = 40
    total = aw*3 + ag*2
    ax0 = (W - total) / 2
    for i, (big, body, color) in enumerate(ann):
        ax = ax0 + i*(aw + ag)
        S.append(rrect(ax, ay, aw, ah, 16, "#FFFFFF", stroke=HAIR, sw=1.2, shadow=True))
        S.append(rrect(ax, ay, 8, ah, 4, color))
        S.append(text(ax + 30, ay + 56, big, 42, darken(color), family=SERIF, weight="700", anchor="start"))
        body_lines = wrap(body, 30)
        by = ay + (40 if len(body_lines) > 2 else 50)
        S.append(mtext(ax + 168, by, body_lines, 14.5, INK, lh=19, anchor="start"))

    # ---- footer -------------------------------------------------------
    fy = H - 36
    S.append(line(60, fy - 20, W - 60, fy - 20, HAIR, 1))
    S.append(text(60, fy, "Source: Goods cost model v6 (2026-06). 20 kg recycled HDPE per bed and $750 price verified; per-bed leg economics, in-house press throughput and 500-bed annual volume are modelled targets, not commitments.",
                  11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))

    render("goods-sankey-plastic", S)


if __name__ == "__main__":
    chart_plastic_loop()
