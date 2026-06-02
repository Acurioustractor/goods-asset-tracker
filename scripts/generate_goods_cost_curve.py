#!/usr/bin/env python3
"""
Goods on Country — Wright's-law / experience-curve cost-down chart (SVG + PNG + PDF).

House style mirrors generate_goods_cost_explainers.py / generate_goods_cost_down.py
(same palette, fonts, helpers, SVG -> PNG/PDF via rsvg-convert).

Chart: goods-cost-curve — "Goods' cost-down path (an experience curve)".
A descending curve of MARGINAL COST per bed as Goods matures in production. Same
shape investors know from solar PV and EV batteries. Solid points are the three
real/modelled v6 paths; the dashed tail is an illustrative projection.

Locked v6 inputs (AUD — do not change):
  price 750.
  Buy-Kit marginal 684.79 (today; buy finished legs from Defy; ~500 beds made) [verified/modelled].
  Factory marginal 425.74 (press our own legs, in-house) [modelled target].
  Community marginal 420.74 (free feedstock + fair-wage labour) [modelled].
  Illustrative projection: ~$390 @ 5,000 cumulative, ~$360 @ 10,000 cumulative.
  Confidence: BOM + $750 verified; in-house legs/labour/freight/volumes modelled.

Regenerate: python3 scripts/generate_goods_cost_curve.py
Output:     v2/public/goods-cost-curve.{svg,png,pdf}
"""

import math
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


# =====================================================================
# CHART — Goods' cost-down path (an experience curve)
# =====================================================================
def chart_cost_curve():
    W, H = 1680, 980
    S = svg_open(W, H)
    S.append(text(W/2, 74, "Goods’ cost-down path (an experience curve)", 50, INK, family=SERIF, weight="700"))
    S.append(text(W/2, 110, "Marginal cost per bed falls as we mature in production — the same shape as solar panels and EV batteries.",
                  20, INK_MUTE, family=SERIF, italic=True))
    S.append(tab(60, 128, "THE COST-DOWN")[0])

    # ---- plot frame ----
    ch_x, ch_y = 150, 210
    ch_w, ch_h = W - 150 - 90, 520
    baseline = ch_y + ch_h

    # ---- x axis: cumulative beds produced, evenly-spaced (log-ish) ----
    # anchor positions at the four real/illustrative cumulative volumes.
    # Use log scale so 500 -> 10,000 reads like a learning curve.
    xmin_log = math.log10(300.0)
    xmax_log = math.log10(13000.0)
    def xv(cum):
        return ch_x + (math.log10(cum) - xmin_log) / (xmax_log - xmin_log) * ch_w

    # ---- y axis: marginal cost AUD ----
    ymin, ymax = 320.0, 760.0
    def yv(v):
        return baseline - (v - ymin) / (ymax - ymin) * ch_h

    # ---- y gridlines ----
    for gv in (350, 450, 550, 650, 750):
        S.append(line(ch_x, yv(gv), ch_x+ch_w, yv(gv), HAIR, 1, dash="3 6"))
        S.append(text(ch_x-14, yv(gv)+5, f"${gv:,}", 13, INK_MUTE, anchor="end"))
    S.append(text(ch_x-14, yv(ymax)+5, "", 13, INK_MUTE, anchor="end"))
    S.append(line(ch_x, baseline, ch_x+ch_w, baseline, HAIR, 1.6))
    S.append(line(ch_x, ch_y, ch_x, baseline, HAIR, 1.6))
    # y axis title (rotated)
    S.append(f'<text x="{52}" y="{ch_y+ch_h/2}" text-anchor="middle" font-family="{SANS}" '
             f'font-size="15" font-weight="400" fill="{INK}" font-style="italic" '
             f'transform="rotate(-90 52 {ch_y+ch_h/2})">marginal cost per bed (AU$)</text>')

    # ---- x ticks at cumulative-bed milestones ----
    for gb, glab in ((500, "500"), (1000, "1,000"), (2000, "2,000"),
                     (5000, "5,000"), (10000, "10,000")):
        S.append(line(xv(gb), baseline, xv(gb), baseline+6, HAIR, 1.4))
        S.append(text(xv(gb), baseline+26, glab, 13, INK_MUTE))
    S.append(text(ch_x+ch_w/2, baseline+56, "cumulative beds produced  →  production maturity",
                  15, INK, italic=True))

    # ---- $750 price reference line (faint) ----
    S.append(line(ch_x, yv(750), ch_x+ch_w, yv(750), TERRA, 1.6, dash="2 6"))
    S.append(text(ch_x+ch_w-6, yv(750)-10, "Sells for AU$750 — marginal cost sits well below price",
                  13.5, darken(TERRA), weight="700", anchor="end"))

    # ---- data points (cumulative, marginal, label, sub, color, confidence) ----
    pts_solid = [
        (500,  684.79, "Buy-Kit", "buy finished legs from Defy", TEAL,   "verified + modelled"),
        (1000, 425.74, "Factory", "press our own legs, in-house", SAGE,  "modelled target"),
        (2000, 420.74, "Community", "free feedstock + fair-wage labour", PURPLE, "modelled"),
    ]
    pts_dashed = [
        (5000,  390.0),
        (10000, 360.0),
    ]

    # ---- solid curve through the three real points (smooth descent) ----
    # Build a polyline with light smoothing between the anchor points.
    anchor = [(xv(c), yv(m)) for (c, m, *_ ) in pts_solid]
    # add a leading point at the chart's left edge slightly above buy-kit to imply the rising-left of the curve
    lead = (xv(330), yv(710))
    solid_path_pts = [lead] + anchor
    d = f"M {solid_path_pts[0][0]:.1f} {solid_path_pts[0][1]:.1f} "
    for i in range(1, len(solid_path_pts)):
        x0, y0 = solid_path_pts[i-1]
        x1, y1 = solid_path_pts[i]
        cx = (x0 + x1) / 2
        d += f"C {cx:.1f} {y0:.1f} {cx:.1f} {y1:.1f} {x1:.1f} {y1:.1f} "
    S.append(f'<path d="{d}" fill="none" stroke="{darken(SAGE,0.92)}" stroke-width="4" '
             f'stroke-linecap="round"/>')

    # ---- dashed illustrative projection from Community point onward ----
    proj_pts = [anchor[-1]] + [(xv(c), yv(m)) for (c, m) in pts_dashed]
    dd = f"M {proj_pts[0][0]:.1f} {proj_pts[0][1]:.1f} "
    for i in range(1, len(proj_pts)):
        x0, y0 = proj_pts[i-1]
        x1, y1 = proj_pts[i]
        cx = (x0 + x1) / 2
        dd += f"C {cx:.1f} {y0:.1f} {cx:.1f} {y1:.1f} {x1:.1f} {y1:.1f} "
    S.append(f'<path d="{dd}" fill="none" stroke="{PURPLE}" stroke-width="3.4" '
             f'stroke-dasharray="9 7" stroke-linecap="round"/>')

    # ---- dashed projection points ----
    for (c, m) in pts_dashed:
        S.append(dot(xv(c), yv(m), 7, "#FFFFFF", stroke=PURPLE, sw=2.6))
        S.append(text(xv(c), yv(m)-16, f"~${m:,.0f}", 15, darken(PURPLE), weight="700"))
        S.append(text(xv(c), yv(m)+28, f"@ {c:,} cumulative", 12, INK_MUTE))

    # ---- solid points + labels (drawn last, on top) ----
    for (c, m, lab, sub, color, conf) in pts_solid:
        px, py = xv(c), yv(m)
        S.append(dot(px, py, 9, color, sw=2.6))
        # label card above the point
        if lab == "Buy-Kit":
            ly = py - 96
        elif lab == "Factory":
            ly = py - 150
        else:
            ly = py - 120
        S.append(text(px, ly,      lab, 21, darken(color), family=SERIF, weight="700"))
        S.append(text(px, ly+24,   f"${m:,.2f}", 18, INK, weight="700"))
        S.append(text(px, ly+45,   sub, 13, INK_MUTE, italic=True))
        S.append(text(px, ly+64,   conf, 11.5, color, weight="700"))
        # connector tick from card to dot
        S.append(line(px, ly+72, px, py-12, HAIR, 1.2, dash="2 4"))

    # ---- "today" marker on Buy-Kit ----
    bx = xv(500)
    S.append(text(bx, baseline-10, "we are here today", 12.5, darken(TEAL), italic=True))

    # ---- illustrative-region label ----
    rx = (xv(2000) + xv(13000)) / 2
    S.append(text(rx, ch_y+22, "illustrative projection", 15, darken(PURPLE), italic=True, weight="700"))
    proj_note = wrap("shape follows known learning curves; actual rate pending Defy volume quotes", 36)
    S.append(mtext(rx, ch_y+44, proj_note, 12, INK_MUTE, 16, italic=True))

    # ---- learning-curve framing pill ----
    pill_w, pill_h = 360, 56
    px0 = ch_x + 18
    py0 = ch_y + 10
    S.append(rrect(px0, py0, pill_w, pill_h, 12, tint(GOLD, 0.16), stroke=GOLD, sw=1.4))
    S.append(text(px0+18, py0+24, "Same shape as solar & batteries:", 14.5, darken(GOLD), weight="700", anchor="start"))
    S.append(text(px0+18, py0+44, "every doubling of volume bends the cost down.", 13.5, INK, anchor="start"))

    # ---- footer ----
    fy = baseline + 96
    S.append(line(60, fy-20, W-60, fy-20, HAIR, 1))
    S.append(text(60, fy, "Marginal cost = what one more bed costs to make and freight, before the ~$109,500/yr fixed block. Owning the plastic press (Buy-Kit → Factory) is the big step down; community feedstock + fair-wage labour holds it there.",
                  14, INK, family=SERIF, anchor="start"))
    S.append(text(60, fy+24, "Source: Goods cost model v6 (2026-06). BOM + $750 price verified; in-house legs, labour, freight and volumes modelled. Solid points are real/target paths; the dashed tail is illustrative — actual learning rate pending Defy volume quotes.",
                  11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))
    render("goods-cost-curve", S)


if __name__ == "__main__":
    chart_cost_curve()
