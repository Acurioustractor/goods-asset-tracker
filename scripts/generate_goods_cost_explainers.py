#!/usr/bin/env python3
"""
Goods on Country — three external-reader cost explainers (SVG + PNG + PDF).

Complements the existing public diagrams (goods-cost-down, goods-marginal-vs-fixed,
goods-idiot-index, goods-scenarios). House style mirrors generate_goods_cost_down.py
(same palette, fonts, helpers, SVG -> PNG/PDF via rsvg-convert).

Charts (all figures verified/modelled from the locked v6 cost model — do not change):
  1. goods-where-750-goes   — where each AU$750 goes: Buy-Kit (today) vs Factory (in-house),
     stacked to $750, showing the contribution slice balloon from $65 to $324.
  2. goods-fully-loaded-volume — "the $1,780 is a volume artefact": fully-loaded $/bed at
     100/500/1,000 beds/yr collapsing toward the marginal floor.
  3. goods-breakeven        — cumulative contribution vs the $109,500 fixed block;
     breakeven 333/338 (factory/community) vs 1,679 (buy-kit).

Locked inputs:
  price 750; buy-kit marginal 684.79 (materials 469.79 + assembly 65 + freight 150),
  factory marginal 425.74 (legs 70 + labour 80 + other-materials 125.74 + freight 150),
  community marginal 420.74; contribution 65.21 / 324.26 / 329.26; fixed block 109,500;
  breakeven 1,679 / 338 / 333; fully-loaded grid 100/500/1000:
  buy 1780/854/724, factory 1521/595/465, community 1516/590/460.

Regenerate: python3 scripts/generate_goods_cost_explainers.py
Output:     v2/public/goods-where-750-goes.{svg,png,pdf}
            v2/public/goods-fully-loaded-volume.{svg,png,pdf}
            v2/public/goods-breakeven.{svg,png,pdf}
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


# =====================================================================
# CHART 1 — Where each AU$750 goes
# =====================================================================
def chart_where_750():
    W, H = 1680, 980
    S = svg_open(W, H)
    S.append(text(W/2, 74, "Where each AU$750 goes", 50, INK, family=SERIF, weight="700"))
    S.append(text(W/2, 110, "The same bed, two ways to make it. Owning the plastic processing turns a $65 sliver into a $324 contribution.",
                  20, INK_MUTE, family=SERIF, italic=True))

    ch_y, ch_h = 200, 560
    baseline = ch_y + ch_h
    ceil = 820.0
    def yv(v): return baseline - (v/ceil)*ch_h

    # segments: (label, value, color)  bottom -> top; contribution last (green)
    cols = [
        ("Buy-Kit (today)", "buy finished plastic legs from Defy", [
            ("Recycled-plastic legs", 344.05, TERRA),
            ("Assembly labour", 65.00, GOLD),
            ("Steel + canvas + hardware", 125.74, CLAY),
            ("Freight to community", 150.00, TEAL),
            ("Contribution (left over)", 65.21, SAGE),
        ]),
        ("Factory (in-house)", "press our own plastic legs", [
            ("Plastic (raw shred + diesel)", 70.00, TERRA),
            ("Process labour", 80.00, GOLD),
            ("Steel + canvas + hardware", 125.74, CLAY),
            ("Freight to community", 150.00, TEAL),
            ("Contribution (left over)", 324.26, SAGE),
        ]),
    ]
    bw = 280
    slot = (W - 200) / len(cols)
    for ci, (title, sub, segs) in enumerate(cols):
        cx = 100 + slot*ci + slot/2
        # price cap line
        S.append(line(cx-bw/2-16, yv(750), cx+bw/2+16, yv(750), TERRA, 2.0, dash="7 5"))
        cum = 0.0
        for (lab, val, color) in segs:
            y0 = yv(cum); y1 = yv(cum+val)
            hi = lab.startswith("Contribution")
            S.append(rrect(cx-bw/2, y1, bw, y0-y1, 8, color if not hi else color,
                           stroke=darken(color), sw=1.4, shadow=hi))
            if hi:
                S.append(rrect(cx-bw/2-3, y1-3, bw+6, y0-y1+6, 10, "none", stroke=darken(color), sw=2.6))
            # in-segment label if tall enough
            if (y0 - y1) > 30:
                mid = (y0+y1)/2
                S.append(text(cx-bw/2+14, mid-2, lab, 14.5, "#FFFFFF" if not hi else darken(color),
                              weight="700" if hi else "600", anchor="start"))
                S.append(text(cx+bw/2-14, mid-2, f"${val:,.0f}", 14.5, "#FFFFFF" if not hi else darken(color),
                              weight="700", anchor="end"))
            else:
                mid = (y0+y1)/2
                S.append(text(cx+bw/2+12, mid+4, f"{lab} — ${val:,.0f}", 13, darken(color), weight="600", anchor="start"))
            cum += val
        # price label at top
        S.append(text(cx, yv(750)-14, "Sells for AU$750", 16, darken(TERRA), weight="700"))
        # column title below
        S.append(text(cx, baseline+34, title, 22, INK, family=SERIF, weight="700"))
        S.append(text(cx, baseline+58, sub, 14, INK_MUTE, italic=True))
        S.append(text(cx, baseline+82, f"marginal cost ${(750-segs[-1][1]):,.0f}  ·  keeps ${segs[-1][1]:,.0f}",
                      14.5, darken(SAGE), weight="700"))

    fy = baseline + 122
    S.append(line(60, fy-20, W-60, fy-20, HAIR, 1))
    S.append(text(60, fy, "Contribution is what each bed leaves toward the ~$109,500/yr of fixed running costs. Buy-Kit leaves almost nothing; in-house production leaves five times more.",
                  14, INK, family=SERIF, anchor="start"))
    S.append(text(60, fy+24, "Source: Goods cost model v6 (2026-06). BOM + $750 price verified; in-house legs, labour and freight modelled. Freight shown at the ~100/yr rate ($150/bed).",
                  11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))
    render("goods-where-750-goes", S)


# =====================================================================
# CHART 2 — Fully-loaded is a volume artefact
# =====================================================================
def chart_fully_loaded():
    W, H = 1680, 980
    S = svg_open(W, H)
    S.append(text(W/2, 74, "Why “$1,780 a bed” is misleading", 50, INK, family=SERIF, weight="700"))
    S.append(text(W/2, 110, "Fully-loaded cost is fixed running costs divided by how many beds we make. Make more beds and it collapses toward the real marginal cost.",
                  20, INK_MUTE, family=SERIF, italic=True))

    ch_x, ch_y = 130, 200
    ch_w, ch_h = W-130-60, 540
    baseline = ch_y + ch_h
    ymax = 1900.0
    def yv(v): return baseline - (v/ymax)*ch_h

    # y gridlines
    for gv in (0, 500, 1000, 1500):
        S.append(line(ch_x, yv(gv), ch_x+ch_w, yv(gv), HAIR, 1, dash="3 6" if gv else None))
        S.append(text(ch_x-12, yv(gv)+5, f"${gv:,}", 13, INK_MUTE, anchor="end"))
    S.append(line(ch_x, baseline, ch_x+ch_w, baseline, HAIR, 1.6))

    # data: per volume, (buy-kit fully-loaded, factory fully-loaded)
    vols = [("100 / yr", 1780, 1521), ("500 / yr", 854, 595), ("1,000 / yr", 724, 465)]
    marg_buy, marg_fac = 684.79, 425.74
    n = len(vols)
    slot = ch_w / n
    pair_w = 150
    gap = 26
    for i, (vlab, buy, fac) in enumerate(vols):
        gx = ch_x + slot*i + slot/2
        bx = gx - (pair_w + gap)/2
        fx = gx + (pair_w + gap)/2
        for (xc, val, color, lab) in ((bx, buy, TEAL, "Buy-Kit"), (fx, fac, SAGE, "Factory")):
            y1 = yv(val)
            S.append(rrect(xc-pair_w/2, y1, pair_w, baseline-y1, 8, color, stroke=darken(color), sw=1.4, shadow=True))
            S.append(text(xc, y1-12, f"${val:,}", 17, darken(color), weight="700"))
            S.append(text(xc, baseline+26, lab, 14, INK, weight="600"))
        S.append(text(gx, baseline+54, vlab, 18, INK, family=SERIF, weight="700"))

    # marginal floors (dashed)
    S.append(line(ch_x, yv(marg_buy), ch_x+ch_w, yv(marg_buy), darken(TEAL), 2.0, dash="8 5"))
    S.append(text(ch_x+ch_w-6, yv(marg_buy)-9, f"Buy-Kit marginal floor ${marg_buy:,.0f}", 13.5, darken(TEAL), weight="700", anchor="end"))
    S.append(line(ch_x, yv(marg_fac), ch_x+ch_w, yv(marg_fac), darken(SAGE), 2.0, dash="8 5"))
    S.append(text(ch_x+ch_w-6, yv(marg_fac)+18, f"Factory marginal floor ${marg_fac:,.0f}", 13.5, darken(SAGE), weight="700", anchor="end"))

    # callout on the $1,780 bar
    S.append(text(ch_x+ch_w*0.06, yv(1780)-44, "the scary number", 13.5, darken(TERRA), italic=True, anchor="start"))
    S.append(text(ch_x+ch_w*0.06, yv(1780)-26, "= fixed costs ÷ only 100 beds", 13.5, darken(TERRA), weight="700", anchor="start"))

    fy = baseline + 96
    S.append(line(60, fy-20, W-60, fy-20, HAIR, 1))
    S.append(text(60, fy, "Fully-loaded = marginal cost + ($109,500 fixed block ÷ beds per year). The bed doesn’t get cheaper to make — we just stop dividing a year of fixed costs by a tiny number.",
                  14, INK, family=SERIF, anchor="start"))
    S.append(text(60, fy+24, "Source: Goods cost model v6 (2026-06), fully-loaded grid. Freight falls with volume ($150→$80/bed) as pallets fill. Modelled; volumes are targets, not commitments.",
                  11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))
    render("goods-fully-loaded-volume", S)


# =====================================================================
# CHART 3 — Breakeven
# =====================================================================
def chart_breakeven():
    W, H = 1680, 980
    S = svg_open(W, H)
    S.append(text(W/2, 74, "How many beds to break even", 50, INK, family=SERIF, weight="700"))
    S.append(text(W/2, 110, "Each bed’s contribution stacks up toward the $109,500/yr fixed block. In-house production crosses it at ~335 beds; buying kits needs ~1,679.",
                  20, INK_MUTE, family=SERIF, italic=True))

    ch_x, ch_y = 130, 200
    ch_w, ch_h = W-130-60, 560
    baseline = ch_y + ch_h
    xmax = 1800.0
    ymax = 250000.0
    fixed = 109500.0
    def xv(b): return ch_x + (b/xmax)*ch_w
    def yv(v): return baseline - (v/ymax)*ch_h

    # grid
    for gv in (0, 50000, 100000, 150000, 200000, 250000):
        S.append(line(ch_x, yv(gv), ch_x+ch_w, yv(gv), HAIR, 1, dash="3 6" if gv else None))
        S.append(text(ch_x-12, yv(gv)+5, f"${gv/1000:,.0f}k", 13, INK_MUTE, anchor="end"))
    for gb in (0, 300, 600, 900, 1200, 1500, 1800):
        S.append(line(xv(gb), baseline, xv(gb), baseline+6, HAIR, 1.4))
        S.append(text(xv(gb), baseline+26, f"{gb:,}", 13, INK_MUTE))
    S.append(text(ch_x+ch_w/2, baseline+58, "beds sold per year", 15, INK, italic=True))
    S.append(line(ch_x, baseline, ch_x+ch_w, baseline, HAIR, 1.6))

    # fixed block line
    S.append(line(ch_x, yv(fixed), ch_x+ch_w, yv(fixed), CLAY, 2.4, dash="9 5"))
    S.append(text(ch_x+8, yv(fixed)-12, "Fixed block to cover: AU$109,500 / yr", 15, darken(CLAY), weight="700", anchor="start"))

    # contribution rays from origin, clipped to box
    rays = [
        ("Buy-Kit", 65.21, 1679, TEAL),
        ("Factory", 324.26, 338, SAGE),
        ("Community (fair wage)", 329.26, 333, PURPLE),
    ]
    o_x, o_y = xv(0), yv(0)
    for (lab, slope, be, color) in rays:
        # value at xmax
        v_end = slope * xmax
        if v_end <= ymax:
            ex, ey = xv(xmax), yv(v_end)
        else:
            b_at_top = ymax / slope
            ex, ey = xv(b_at_top), yv(ymax)
        S.append(line(o_x, o_y, ex, ey, color, 3.2))
        # label near the end of the visible ray (Factory & Community share a line — label once)
        if lab == "Buy-Kit":
            S.append(text(ex-4, ey-10, "Buy-Kit", 15, darken(color), weight="700", anchor="end"))
        elif lab == "Factory":
            S.append(text(ex-6, ey+4, "Factory & Community", 15, darken(color), weight="700", anchor="end"))
        # Community: unlabelled — sits on the Factory line (~parity)

    # breakeven markers on the fixed line
    for (lab, slope, be, color) in rays:
        if be <= xmax:
            S.append(line(xv(be), baseline, xv(be), yv(fixed), color, 1.4, dash="4 5"))
            S.append(dot(xv(be), yv(fixed), 8, color))
    # annotate factory/community cluster (~335) and buy-kit (1679)
    S.append(text(xv(335)+10, yv(fixed)+40, "~333–338 beds/yr", 15, darken(SAGE), weight="700", anchor="start"))
    S.append(text(xv(335)+10, yv(fixed)+60, "in-house breakeven", 12.5, INK_MUTE, italic=True, anchor="start"))
    S.append(text(xv(1679)-10, yv(fixed)-16, "~1,679 beds/yr", 15, darken(TEAL), weight="700", anchor="end"))
    S.append(text(xv(1679)-10, yv(fixed)-34, "buy-kit can’t realistically break even", 12.5, INK_MUTE, italic=True, anchor="end"))

    fy = baseline + 96
    S.append(line(60, fy-20, W-60, fy-20, HAIR, 1))
    S.append(text(60, fy, "Breakeven = $109,500 ÷ contribution per bed, at the AU$750 price. The flatter the line, the more beds needed — which is why in-sourcing the plastic (steeper line) is the whole capital case.",
                  14, INK, family=SERIF, anchor="start"))
    S.append(text(60, fy+24, "Source: Goods cost model v6 (2026-06). Contribution at $750 price, $150/bed freight basis. Philanthropy bridges the gap below breakeven. Modelled.",
                  11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))
    render("goods-breakeven", S)


if __name__ == "__main__":
    chart_where_750()
    chart_fully_loaded()
    chart_breakeven()
