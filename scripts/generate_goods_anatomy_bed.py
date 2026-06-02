#!/usr/bin/env python3
"""
Goods on Country — "Anatomy of a $750 bed" component-cost teardown (SVG+PNG+PDF).

Rebuilt 2026-06-02 to match the CANONICAL product: the X-TRESTLE TENSION design
(two crossed-plank recycled-HDPE X-legs; poles thread through the canvas long-edge
sleeves AND the top holes of the X-legs; the canvas is structural). NOT clip-on legs.

Introduces the SHARED visual system pulled from the Stretch Bed product infographic:
the material palette — olive canvas, speckled recycled-HDPE, steel — plus a slate
section-label tab motif, layered on the warm-editorial house base for a unified pack.

Figures (locked v6, do not change):
  legs $344.05 (8.6x idiot index) · steel $27.00 (2.1x) · canvas $93.50 (2.4x) ·
  hardware $5.24 (~1x) · assembly $65.00 · freight $150.00 ·
  parts subtotal $469.79 · marginal today $684.79 · price $750.

Regenerate: python3 scripts/generate_goods_anatomy_bed.py
Output:     v2/public/goods-anatomy-bed.{svg,png,pdf}
"""

import random
import subprocess
from pathlib import Path

random.seed(7)

# ---- house base palette ----
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

# ---- shared MATERIAL palette (pulled from the product infographic) ----
SLATE      = "#2B2D2A"
CANVAS_OL  = "#6E7355"
CANVAS_OLD = "#565B41"
HDPE       = "#C8B79A"
HDPE_DK    = "#9C8868"
SPECK      = "#6E5E44"
STEEL      = "#AEB4B8"
STEEL_HI   = "#D6DADD"
STEEL_DK   = "#7E858A"

SERIF = "Georgia, 'Times New Roman', serif"
SANS  = "'Helvetica Neue', Helvetica, Arial, sans-serif"

def darken(hex_color, f=0.74):
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    return "#%02X%02X%02X" % (int(r*f), int(g*f), int(b*f))

def tint(hex_color, a=0.12):
    return hex_color + "%02X" % int(a*255)

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def wrap(t, n):
    words, lines, cur = t.split(), [], ""
    for w in words:
        if cur and len(cur)+1+len(w) > n:
            lines.append(cur); cur = w
        else:
            cur = (cur+" "+w).strip()
    if cur: lines.append(cur)
    return lines

def text(x, y, s, size, color, family=SANS, weight="400", anchor="middle", italic=False, spacing=None):
    st = ' font-style="italic"' if italic else ""
    sp = f' letter-spacing="{spacing}"' if spacing else ""
    return (f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{family}" '
            f'font-size="{size}" font-weight="{weight}" fill="{color}"{st}{sp}>{esc(s)}</text>')

def mtext(cx, y, lines, size, color, lh, **kw):
    return "".join(text(cx, y+i*lh, ln, size, color, **kw) for i, ln in enumerate(lines))

def rrect(x, y, w, h, r, fill, stroke=None, sw=1.4, shadow=False):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    fil = ' filter="url(#sh)"' if shadow else ""
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{r}" fill="{fill}"{s}{fil}/>'

def line(x1, y1, x2, y2, color, sw=1.6, dash=None, cap="round"):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{color}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'

def dot(cx, cy, r, fill, stroke=None, sw=1.5):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" fill="{fill}"{s}/>'

def tab(x, y, label, fill=SLATE):
    w = 14 + len(label) * 8.6
    out = rrect(x, y, w, 27, 6, fill)
    out += text(x + w/2, y + 18.5, label, 13, "#FFFFFF", weight="700", spacing="1.5")
    return out, w

def plank(cx, cy, length, width, angle_deg):
    x = cx - length/2
    y = cy - width/2
    parts = [f'<g transform="rotate({angle_deg} {cx} {cy})">']
    parts.append(rrect(x, y, length, width, width/2, HDPE, stroke=HDPE_DK, sw=1.6, shadow=True))
    pad = width*0.34
    for _ in range(int(length/9)):
        sx = random.uniform(x+pad, x+length-pad)
        sy = random.uniform(y+pad, y+width-pad)
        parts.append(dot(sx, sy, random.uniform(1.0, 2.2), SPECK))
    parts.append('</g>')
    return "".join(parts)

W, H = 1680, 980
S = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{SANS}">']
S.append('<defs>'
         '<filter id="sh" x="-8%" y="-8%" width="116%" height="124%"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#5A4A38" flood-opacity="0.12"/></filter>'
         f'<linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{STEEL_HI}"/><stop offset="0.45" stop-color="{STEEL}"/><stop offset="1" stop-color="{STEEL_DK}"/></linearGradient>'
         '</defs>')
S.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')

# header
S.append(text(W/2, 76, "Anatomy of a $750 bed", 50, INK, family=SERIF, weight="700"))
S.append(text(W/2, 112, "Every part of the Stretch Bed, priced. One component is most of the parts bill — and the whole capital case.",
              20, INK_MUTE, family=SERIF, italic=True))
tb, w1 = tab(70, 138, "WHAT EACH PART COSTS")
S.append(tb)
tb2, _ = tab(70 + w1 + 14, 138, "X-TRESTLE TENSION DESIGN", fill=darken(CANVAS_OL))
S.append(tb2)

# ============================ the bed (X-trestle, side-on length view) ============================
BX0, BX1 = 612, 1068
POLE_BACK_Y, POLE_FRONT_Y = 452, 486
LEG_TOP_Y, LEG_FOOT_Y = 458, 624
legL, legR = 690, 990
PLANK_L, PLANK_W = 196, 24

# canvas (olive) draped between the X-legs, over the poles
S.append(rrect(legL-6, POLE_BACK_Y-16, (legR-legL)+12, 30, 7, CANVAS_OL, stroke=CANVAS_OLD, sw=1.6, shadow=True))
for i in range(1, 9):
    xx = (legL-6) + (legR-legL+12) * i/9
    S.append(line(xx, POLE_BACK_Y-14, xx, POLE_BACK_Y+12, CANVAS_OLD, 0.8))

# two steel poles running the length, through sleeves + leg holes
for py in (POLE_BACK_Y, POLE_FRONT_Y):
    S.append(rrect(BX0, py-7, BX1-BX0, 14, 7, "url(#steel)", stroke=STEEL_DK, sw=1.0, shadow=True))

# X-trestle legs (crossed speckled-HDPE planks) + top holes
for legx in (legL, legR):
    cy = (LEG_TOP_Y+LEG_FOOT_Y)/2
    S.append(plank(legx, cy, PLANK_L, PLANK_W, 19))
    S.append(plank(legx, cy, PLANK_L, PLANK_W, -19))
    S.append(dot(legx-5, POLE_BACK_Y, 7, SLATE)); S.append(dot(legx-5, POLE_BACK_Y, 4.2, HDPE_DK))
    S.append(dot(legx+5, POLE_FRONT_Y, 7, SLATE)); S.append(dot(legx+5, POLE_FRONT_Y, 4.2, HDPE_DK))

# tension arrows
S.append(line(BX0-2, POLE_FRONT_Y, BX0-30, POLE_FRONT_Y, darken(TEAL), 2.4))
S.append(f'<path d="M {BX0-30} {POLE_FRONT_Y-5} L {BX0-37} {POLE_FRONT_Y} L {BX0-30} {POLE_FRONT_Y+5}" fill="none" stroke="{darken(TEAL)}" stroke-width="2.4"/>')
S.append(line(BX1+2, POLE_FRONT_Y, BX1+30, POLE_FRONT_Y, darken(TEAL), 2.4))
S.append(f'<path d="M {BX1+30} {POLE_FRONT_Y-5} L {BX1+37} {POLE_FRONT_Y} L {BX1+30} {POLE_FRONT_Y+5}" fill="none" stroke="{darken(TEAL)}" stroke-width="2.4"/>')
S.append(text((BX0+BX1)/2, LEG_FOOT_Y+34, "Tension pulls the poles into the leg holes — the canvas is structural and braces the frame. No tools.",
              13.5, INK_MUTE, italic=True))

# ============================ callout cards ============================
def card(x, y, w, h, title, amount, conf, idiot, color, big=False, note=None):
    out = rrect(x, y, w, h, 12, "#FFFFFF", stroke=color, sw=2.2 if big else 1.6, shadow=True)
    out += rrect(x, y, 8, h, 6, color)
    out += text(x+24, y+30, title, 16.5 if big else 14.5, INK, weight="700", anchor="start")
    out += text(x+24, y+(62 if big else 56), amount, 30 if big else 24, darken(color), weight="700", anchor="start")
    cb = SAGE if conf == "verified" else PURPLE
    out += rrect(x+w-106, y+14, 92, 20, 10, tint(cb, 0.18), stroke=cb, sw=1.1)
    out += text(x+w-60, y+28, conf, 11, darken(cb), weight="700")
    ic = TERRA if idiot >= 5 else (GOLD if idiot >= 2 else SAGE)
    out += rrect(x+w-106, y+38, 92, 20, 10, tint(ic, 0.18), stroke=ic, sw=1.1)
    out += text(x+w-60, y+52, f"idiot {idiot}x", 11, darken(ic), weight="700")
    if note:
        out += mtext(x+24, y+(88 if big else 80), wrap(note, 40 if big else 30), 12, INK_MUTE, 15, anchor="start", italic=True)
    return out

S.append(card(70, 248, 372, 138, "Recycled-HDPE X-trestle legs (×2)", "$344.05", "verified", 8.6, TERRA, big=True,
              note="THE whole capital case. Press our own ⟶ ~$70/bed; raw floor ~$40. 8.6× markup today."))
S.append(line(442, 318, legL-30, 472, darken(TERRA), 1.8)); S.append(dot(legL-30, 472, 4, darken(TERRA)))

S.append(card(1238, 248, 372, 98, "Galvanised steel poles (×2)", "$27.00", "verified", 2.1, CLAY,
              note="DNA Steel, Alice Springs. Already near raw — local NT supply."))
S.append(line(1238, 298, BX1-8, POLE_BACK_Y, darken(CLAY), 1.8)); S.append(dot(BX1-8, POLE_BACK_Y, 4, darken(CLAY)))

S.append(card(1238, 372, 372, 98, "Canvas sleeping surface", "$93.50", "verified", 2.4, darken(CANVAS_OL),
              note="Centre Canvas, Alice Springs. Structural + washable; cut/hem/sew labour."))
S.append(line(1238, 422, (legL+legR)/2+70, POLE_BACK_Y-6, CANVAS_OLD, 1.8)); S.append(dot((legL+legR)/2+70, POLE_BACK_Y-6, 4, CANVAS_OLD))

S.append(card(70, 474, 372, 92, "Hardware — 4 caps · 16 screws · 2 bolts", "$5.24", "verified", 1.0, TEAL,
              note="Generic + Coastal Fasteners. At raw rate already."))
S.append(line(442, 516, legR+10, POLE_FRONT_Y, darken(TEAL), 1.8)); S.append(dot(legR+10, POLE_FRONT_Y, 4, darken(TEAL)))

# process chips (not parts)
S.append(text(1610, 598, "process (not a part):", 12.5, INK_MUTE, italic=True, anchor="end"))
S.append(rrect(1238, 608, 372, 30, 8, SAND, stroke=HAIR, sw=1))
S.append(text(1258, 628, "Assembly / handling labour", 13, INK, anchor="start"))
S.append(text(1592, 628, "$65.00", 14, darken(GOLD), weight="700", anchor="end"))
S.append(rrect(1238, 644, 372, 30, 8, SAND, stroke=HAIR, sw=1))
S.append(text(1258, 664, "Long-haul freight to community", 13, INK, anchor="start"))
S.append(text(1592, 664, "$150.00", 14, darken(TEAL), weight="700", anchor="end"))

# ============================ footer math strip ============================
fy = 742
S.append(rrect(70, fy, W-140, 58, 12, tint(SAGE, 0.12), stroke=SAGE, sw=1.4))
S.append(text(96, fy+36,
   "Parts subtotal  $469.79      +  assembly $65  +  freight $150   =   marginal cost today  $684.79      ·      sells for  $750",
   19, INK, family=SERIF, weight="700", anchor="start"))

S.append(line(70, fy+88, W-70, fy+88, HAIR, 1))
S.append(text(70, fy+108,
   "20kg of recycled HDPE diverted from landfill per bed. The legs are two crossed-plank X-trestles; the poles thread through the canvas sleeves and the leg top-holes.",
   13, INK, family=SERIF, anchor="start"))
S.append(text(70, fy+128,
   "Source: Goods cost model v6 (2026-06). BOM + $750 verified; in-house legs, labour, freight modelled. Idiot index = price paid ÷ raw-material floor.",
   11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))

S.append("</svg>")

pub = Path(__file__).resolve().parent.parent / "v2" / "public"
svg_path = pub / "goods-anatomy-bed.svg"
png_path = pub / "goods-anatomy-bed.png"
pdf_path = pub / "goods-anatomy-bed.pdf"
svg_path.write_text("\n".join(S))
subprocess.run(["rsvg-convert", "-o", str(png_path), str(svg_path)], check=True)
subprocess.run(["rsvg-convert", "-f", "pdf", "-o", str(pdf_path), str(svg_path)], check=True)
print(f"wrote goods-anatomy-bed.svg / .png ({png_path.stat().st_size} b) / .pdf")
