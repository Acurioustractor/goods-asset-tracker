#!/usr/bin/env python3
"""
Goods on Country — What a bed actually costs (SVG + PNG + PDF).

Two bars side by side. Left: the misleading "AU$1,912/bed at 100/yr" headline,
struck through in red. Right: the SAME total split honestly into marginal (the
next bed) + fixed (spread over volume).

EXACT figures (do not change):
  - Headline:  AU$1,780 (struck through)  caption "looks like the cost (at 100/yr)"
  - Split:     685 marginal (the next bed) + 1,095 fixed (spread over volume)
               caption "same total, split honestly"
               (685 + 1,095 = 1,780; fixed = AU$109,500 annual block / 100 beds)
  - Footer:    "Marginal drops 685 to 426 once in-sourced.
                Breakeven: Factory ~338/yr vs Buy-Kit ~1,679/yr."

Style mirrors scripts/generate_goods_cost_model_diagram.py (same palette, fonts,
helpers, SVG -> PNG/PDF via rsvg-convert).
Output:     v2/public/goods-marginal-vs-fixed.{svg,png,pdf}
Regenerate: python3 scripts/generate_goods_marginal_vs_fixed.py
"""

import subprocess
from pathlib import Path

# ------------------------------------------------------------------- palette
BG       = "#FBFAF5"
INK      = "#2A241E"
INK_MUTE = "#6F6155"
HAIR     = "#C9BCA8"
SAND     = "#EFE8DA"

TERRA = "#BD6A3C"
SAGE  = "#6F9C68"
GOLD  = "#C2A55E"
CLAY  = "#8A5A45"
TEAL  = "#4C9B97"
RUST  = "#A8442E"

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

def text(x, y, s, size, color, family=SANS, weight="400", anchor="middle",
         italic=False, spacing=None):
    st = ' font-style="italic"' if italic else ""
    sp = f' letter-spacing="{spacing}"' if spacing else ""
    return (f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{family}" '
            f'font-size="{size}" font-weight="{weight}" fill="{color}"{st}{sp}>{esc(s)}</text>')

def rrect(x, y, w, h, r, fill, stroke=None, sw=1.4, shadow=False):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    fil = ' filter="url(#sh)"' if shadow else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"{s}{fil}/>'

def arrow_right(x1, y, x2, color=HAIR, sw=2.4):
    return (f'<path d="M {x1} {y} L {x2-9} {y} M {x2-16} {y-7} L {x2-6} {y} L {x2-16} {y+7}" '
            f'fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')

# --------------------------------------------------------------------- canvas
W, H = 1680, 980
S = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{SANS}">']
S.append('''<defs><filter id="sh" x="-8%" y="-8%" width="116%" height="124%">
<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#5A4A38" flood-opacity="0.10"/></filter></defs>''')
S.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')

# ------------------------------------------------------------------- header
S.append(text(W/2, 74, "What a bed actually costs", 50, INK, family=SERIF, weight="700"))
S.append(text(W/2, 110, "The same total, two ways. The headline divides a fixed annual block over a tiny denominator. Split honestly, the next bed costs far less.",
              20, INK_MUTE, family=SERIF, italic=True))

# ------------------------------------------------------------------- chart geometry
LX, RXn = 60, 1620
base_y = 720                 # common baseline for both bars
top_pad_y = 200              # top of plotting area
plot_h = base_y - top_pad_y  # vertical px available
total = 1780.0
scale = plot_h / total       # px per dollar (so the total fills the column)

bar_w = 230
left_cx = 470                # left bar centre
right_cx = 1130              # right bar centre

# common baseline
S.append(f'<line x1="{LX+40}" y1="{base_y}" x2="{RXn-40}" y2="{base_y}" stroke="{HAIR}" stroke-width="1.6"/>')

# ---- LEFT bar: the misleading headline (single solid, struck through)
lh_px = total * scale
ly = base_y - lh_px
S.append(rrect(left_cx-bar_w/2, ly, bar_w, lh_px, 12, tint(RUST, 0.5), stroke=RUST, sw=1.8, shadow=True))
# red strike-through across the value
S.append(f'<line x1="{left_cx-bar_w/2-26}" y1="{ly+lh_px*0.34}" x2="{left_cx+bar_w/2+26}" y2="{ly+lh_px*0.30}" '
         f'stroke="{RUST}" stroke-width="5" stroke-linecap="round"/>')
S.append(text(left_cx, ly-20, "AU$1,780", 40, RUST, family=SERIF, weight="700"))
S.append(text(left_cx, base_y+34, "looks like the cost (at 100/yr)", 16, INK_MUTE, italic=True))
S.append(text(left_cx, base_y+58, "fixed block divided over only 100 beds", 13, INK_MUTE))

# ---- arrow between
S.append(arrow_right(left_cx+bar_w/2+40, (top_pad_y+base_y)/2, right_cx-bar_w/2-40, color=INK_MUTE, sw=3.0))
S.append(text((left_cx+right_cx)/2, (top_pad_y+base_y)/2 - 18, "split", 14, INK_MUTE, weight="700"))
S.append(text((left_cx+right_cx)/2, (top_pad_y+base_y)/2 - 2, "honestly", 14, INK_MUTE, weight="700"))

# ---- RIGHT bar: the honest split (stacked: marginal bottom + fixed top)
marginal = 685.0
fixed = 1095.0
mh = marginal * scale
fh = fixed * scale
# marginal (bottom, darker teal = the real next-bed cost)
my = base_y - mh
S.append(rrect(right_cx-bar_w/2, my, bar_w, mh, 12, TEAL, stroke=darken(TEAL), sw=1.6, shadow=True))
S.append(rrect(right_cx-bar_w/2, my, bar_w, 14, 12, TEAL))  # square off the top corner join
# fixed (top, lighter)
fy_ = my - fh
S.append(rrect(right_cx-bar_w/2, fy_, bar_w, fh, 12, tint(CLAY, 0.55), stroke=CLAY, sw=1.6, shadow=True))
S.append(rrect(right_cx-bar_w/2, my-14, bar_w, 14, 0, tint(CLAY, 0.55)))  # join cover

# segment labels
S.append(text(right_cx, my + mh/2 - 6, "AU$685", 26, "#FFFFFF", family=SERIF, weight="700"))
S.append(text(right_cx, my + mh/2 + 16, "marginal (the next bed)", 13.5, "#FFFFFF", weight="600"))
S.append(text(right_cx, fy_ + fh/2 - 6, "AU$1,095", 26, darken(CLAY), family=SERIF, weight="700"))
S.append(text(right_cx, fy_ + fh/2 + 16, "fixed (spread over volume)", 13.5, darken(CLAY), weight="600"))

S.append(text(right_cx, fy_-20, "AU$1,780 total", 22, INK, family=SERIF, weight="700"))
S.append(text(right_cx, base_y+34, "same total, split honestly", 16, darken(SAGE), weight="700", italic=True))
S.append(text(right_cx, base_y+58, "marginal scales per bed; fixed is annual", 13, INK_MUTE))

# right-side bracket labels
br_x = right_cx + bar_w/2 + 26
S.append(f'<path d="M {br_x} {my} L {br_x+12} {my} L {br_x+12} {base_y} L {br_x} {base_y}" fill="none" stroke="{darken(TEAL)}" stroke-width="1.6"/>')
S.append(text(br_x+22, (my+base_y)/2+5, "scales with each bed", 12.5, darken(TEAL), weight="600", anchor="start"))
S.append(f'<path d="M {br_x} {fy_} L {br_x+12} {fy_} L {br_x+12} {my} L {br_x} {my}" fill="none" stroke="{darken(CLAY)}" stroke-width="1.6"/>')
S.append(text(br_x+22, (fy_+my)/2+5, "does not scale per bed", 12.5, darken(CLAY), weight="600", anchor="start"))

# ------------------------------------------------------------------- footer band
fb_y = base_y + 92
S.append(rrect(LX, fb_y, RXn-LX, 86, 16, tint(SAGE), stroke=SAGE, sw=1.8, shadow=True))
S.append(text(LX+28, fb_y+34, "THE TWO LEVERS", 14, darken(SAGE), weight="700", anchor="start", spacing="1.4"))
S.append(text(LX+28, fb_y+62,
   "Marginal drops AU$685 to AU$426 once in-sourced.  Breakeven: Factory ~338/yr vs Buy-Kit ~1,679/yr.",
   21, INK, family=SERIF, weight="700", anchor="start"))

# ------------------------------------------------------------------- footer source
fy = fb_y + 86 + 34
S.append(text(LX, fy,
   "Source: Goods cost model (2026-05). AU$1,780 = marginal + AU$109,500 annual fixed block absorbed over a 100-bed denominator; split and breakevens modelled on verified BOM inputs (AU$750 price).",
   11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))

S.append("</svg>")

# --------------------------------------------------------------- write + render
pub = Path(__file__).resolve().parent.parent / "v2" / "public"
svg_path = pub / "goods-marginal-vs-fixed.svg"
png_path = pub / "goods-marginal-vs-fixed.png"
pdf_path = pub / "goods-marginal-vs-fixed.pdf"
svg_path.write_text("\n".join(S))
print(f"wrote {svg_path} ({svg_path.stat().st_size} bytes)")
try:
    subprocess.run(["rsvg-convert", "-o", str(png_path), str(svg_path)], check=True)
    subprocess.run(["rsvg-convert", "-f", "pdf", "-o", str(pdf_path), str(svg_path)], check=True)
    print(f"wrote {png_path} ({png_path.stat().st_size} bytes)")
    print(f"wrote {pdf_path} ({pdf_path.stat().st_size} bytes)")
except (FileNotFoundError, subprocess.CalledProcessError) as e:
    print(f"WARNING: rsvg-convert failed ({e}); SVG written, PNG/PDF skipped.")
