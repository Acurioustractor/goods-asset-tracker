#!/usr/bin/env python3
"""
Goods on Country — Grant-funded today; in-sourcing makes it viable (SVG+PNG+PDF).

Horizontal bar chart, zero line in the middle. Four operating-result bars; the
only negative one is Buy-Kit. Each bar carries its figure + its breakeven.

EXACT figures (do not change):
  - Actuals (grant-funded)   +340,585  [green]  (before founder time)
  - Buy-Kit @ 500/yr          -60,095  [red, below zero]  breakeven 1,679/yr
  - Factory @ 500/yr          +69,430  [green]            breakeven 338/yr
  - Community @ 1,000/yr     +366,560  [green]            breakeven 238/yr
  All bars on a consistent BEFORE-founder-time basis.
  Caption: "The capital case = moving from Buy-Kit to in-house production."

Style mirrors scripts/generate_goods_cost_model_diagram.py (same palette, fonts,
helpers, SVG -> PNG/PDF via rsvg-convert).
Output:     v2/public/goods-scenarios.{svg,png,pdf}
Regenerate: python3 scripts/generate_goods_scenarios.py
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

# --------------------------------------------------------------------- canvas
W, H = 1680, 960
S = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{SANS}">']
S.append('''<defs><filter id="sh" x="-8%" y="-8%" width="116%" height="124%">
<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#5A4A38" flood-opacity="0.10"/></filter></defs>''')
S.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')

# ------------------------------------------------------------------- header
S.append(text(W/2, 74, "Grant-funded today; in-sourcing makes it viable", 46, INK, family=SERIF, weight="700"))
S.append(text(W/2, 110, "Annual operating result by scenario, before founder time. Buy-Kit at scale loses money; in-house production turns it positive.",
              20, INK_MUTE, family=SERIF, italic=True))

# ------------------------------------------------------------------- chart geometry
LX, RXn = 60, 1620
label_w = 340                 # left gutter for scenario labels
value_w = 210                 # right gutter reserved for the value labels
chart_x = LX + label_w        # plotting area left
chart_w = RXn - chart_x - value_w  # plotting area width (room for value labels)
top_y = 200
row_h = 132
n = 4

# value scale: spans from min(-60,095) to max(+366,560)
vmin, vmax = -60095.0, 366560.0
span = vmax - vmin
# zero-line x position within the plotting area
zero_x = chart_x + chart_w * ((0 - vmin) / span)
px_per = chart_w / span

bars = [
    ("Actuals (grant-funded)", "before founder time",       340585,  None,   SAGE),
    ("Buy-Kit @ 500/yr",       "buy finished kits",         -60095,  "1,679/yr", RUST),
    ("Factory @ 500/yr",       "press + CNC On-Country",     69430,  "338/yr",   SAGE),
    ("Community @ 1,000/yr",   "community-owned production", 366560, "238/yr",   SAGE),
]

bar_h = 56
chart_bottom = top_y + n*row_h

# zero line (full height)
S.append(f'<line x1="{zero_x:.1f}" y1="{top_y-10}" x2="{zero_x:.1f}" y2="{chart_bottom-30}" '
         f'stroke="{INK}" stroke-width="2"/>')
S.append(text(zero_x, top_y-18, "break even (AU$0)", 13, INK_MUTE, weight="700"))

for i, (lab, sub, val, be, color) in enumerate(bars):
    cy = top_y + i*row_h + (row_h-bar_h)/2
    # scenario label (left gutter)
    S.append(text(LX, cy + bar_h/2 - 4, lab, 20, INK, family=SERIF, weight="700", anchor="start"))
    S.append(text(LX, cy + bar_h/2 + 20, sub, 13, INK_MUTE, italic=True, anchor="start"))
    # bar from zero to value
    bx = chart_x + chart_w * ((val - vmin) / span)
    if val >= 0:
        x0, w = zero_x, bx - zero_x
    else:
        x0, w = bx, zero_x - bx
    S.append(rrect(x0, cy, w, bar_h, 10, color, stroke=darken(color), sw=1.4, shadow=True))
    # value label at the far end of the bar
    sign = "+" if val >= 0 else "-"
    vtxt = f"{sign}AU${abs(val):,.0f}"
    if val >= 0:
        S.append(text(x0 + w + 14, cy + bar_h/2 + 7, vtxt, 24, darken(color),
                      family=SERIF, weight="700", anchor="start"))
    else:
        S.append(text(x0 - 14, cy + bar_h/2 + 7, vtxt, 24, darken(color),
                      family=SERIF, weight="700", anchor="end"))
    # breakeven chip inside/near bar
    if be:
        be_txt = f"breakeven {be}"
        chip_w = len(be_txt)*7.4 + 24
        # place chip just inside the bar from zero
        if val >= 0:
            cxr = x0 + 12
        else:
            cxr = x0 + w - chip_w - 12
        # only place inside if there's room, else below the value
        if w > chip_w + 24:
            S.append(rrect(cxr, cy + bar_h/2 - 14, chip_w, 27, 13, "#FFFFFF", stroke=darken(color), sw=1.2))
            S.append(text(cxr + chip_w/2, cy + bar_h/2 + 5, be_txt, 13, darken(color), weight="700"))
        else:
            S.append(text(x0 - 14, cy + bar_h/2 + 28, be_txt, 13, darken(color), weight="700", anchor="end"))

# ------------------------------------------------------------------- caption band
cb_y = chart_bottom + 6
S.append(rrect(LX, cb_y, RXn-LX, 78, 16, tint(TERRA), stroke=TERRA, sw=1.8, shadow=True))
S.append(text(LX+28, cb_y+32, "THE CAPITAL CASE", 14, darken(TERRA), weight="700", anchor="start", spacing="1.4"))
S.append(text(LX+28, cb_y+60,
   "The capital case = moving from Buy-Kit to in-house production.",
   23, INK, family=SERIF, weight="700", anchor="start"))

# ------------------------------------------------------------------- footer
fy = cb_y + 78 + 34
S.append(text(LX, fy,
   "Founder time AU$84K/yr (or AU$21–84K at 25–100% FTE) applies on top. After full founder time: Factory @500 → −AU$14,570; Community @1,000 → +AU$282,560.",
   12.5, INK, weight="700", family=SERIF, anchor="start"))
S.append(text(LX, fy + 24,
   "Source: Goods financial model (2026-05), before founder time. Operating results and breakevens are modelled on verified BOM inputs (AU$750 price); founder-rate and FTE inputs pending confirmation.",
   11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))

S.append("</svg>")

# --------------------------------------------------------------- write + render
pub = Path(__file__).resolve().parent.parent / "v2" / "public"
svg_path = pub / "goods-scenarios.svg"
png_path = pub / "goods-scenarios.png"
pdf_path = pub / "goods-scenarios.pdf"
svg_path.write_text("\n".join(S))
print(f"wrote {svg_path} ({svg_path.stat().st_size} bytes)")
try:
    subprocess.run(["rsvg-convert", "-o", str(png_path), str(svg_path)], check=True)
    subprocess.run(["rsvg-convert", "-f", "pdf", "-o", str(pdf_path), str(svg_path)], check=True)
    print(f"wrote {png_path} ({png_path.stat().st_size} bytes)")
    print(f"wrote {pdf_path} ({pdf_path.stat().st_size} bytes)")
except (FileNotFoundError, subprocess.CalledProcessError) as e:
    print(f"WARNING: rsvg-convert failed ({e}); SVG written, PNG/PDF skipped.")
