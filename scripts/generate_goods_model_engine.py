#!/usr/bin/env python3
"""
Goods on Country — Turn the dials (SVG + PNG + PDF).

Inputs -> engine -> outputs. Four input "dial" cards feed a central financial
model engine, which produces three outputs.

EXACT structure (do not change):
  Inputs (left, vertical stack of 4): Volume, Method, Founder time, Opening cash
  Centre engine card:                 Financial model
  Outputs (right, 3 cards):           Unit cost, P&L, Cashflow

Style mirrors scripts/generate_goods_operating_model.py (same palette, fonts,
helpers, SVG -> PNG/PDF via rsvg-convert).
Output:     v2/public/goods-model-engine.{svg,png,pdf}
Regenerate: python3 scripts/generate_goods_model_engine.py
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

TERRA = "#BD6A3C"
SAGE  = "#6F9C68"
GOLD  = "#C2A55E"
CLAY  = "#8A5A45"
TEAL  = "#4C9B97"

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

def connector(x1, y1, x2, y2, color, sw=2.6, dash=False):
    ang = math.atan2(y2 - y1, x2 - x1)
    hl = 11
    ax1 = x2 - hl*math.cos(ang - 0.42)
    ay1 = y2 - hl*math.sin(ang - 0.42)
    ax2 = x2 - hl*math.cos(ang + 0.42)
    ay2 = y2 - hl*math.sin(ang + 0.42)
    da = ' stroke-dasharray="2 7"' if dash else ""
    return (f'<path d="M {x1:.1f} {y1:.1f} L {x2:.1f} {y2:.1f}" fill="none" stroke="{color}" '
            f'stroke-width="{sw}" stroke-linecap="round"{da}/>'
            f'<path d="M {ax1:.1f} {ay1:.1f} L {x2:.1f} {y2:.1f} L {ax2:.1f} {ay2:.1f}" '
            f'fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')

def cog(cx, cy, r, color, teeth=12):
    """A simple gear/cog glyph."""
    out = []
    inner = r * 0.72
    tooth = r * 1.16
    pts = []
    for k in range(teeth*2):
        ang = (math.pi / teeth) * k
        rr = tooth if k % 2 == 0 else r
        pts.append((cx + rr*math.cos(ang), cy + rr*math.sin(ang)))
    d = "M " + " L ".join(f"{px:.1f} {py:.1f}" for px, py in pts) + " Z"
    out.append(f'<path d="{d}" fill="{color}" stroke="{darken(color)}" stroke-width="1.4"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{inner:.1f}" fill="{BG}" stroke="{darken(color)}" stroke-width="1.4"/>')
    return "".join(out)

# --------------------------------------------------------------------- canvas
W, H = 1680, 940
S = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{SANS}">']
S.append('''<defs><filter id="sh" x="-8%" y="-8%" width="116%" height="124%">
<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#5A4A38" flood-opacity="0.10"/></filter></defs>''')
S.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')

# ------------------------------------------------------------------- header
S.append(text(W/2, 74, "Turn the dials", 50, INK, family=SERIF, weight="700"))
S.append(text(W/2, 110, "Change the four inputs and the financial model recomputes unit cost, P&L and cashflow. One engine, four levers, three answers.",
              20, INK_MUTE, family=SERIF, italic=True))

# ------------------------------------------------------------------- columns
# Left: 4 dial cards. Centre: engine. Right: 3 output cards.
LX = 80
LW = 320
in_h = 116
in_gap = 38
in_y0 = 210
dials = [
    ("Volume",       "beds per year",                GOLD),
    ("Method",       "Buy-Kit / Factory / Community", TEAL),
    ("Founder time", "FTE % + fair-market rate",     CLAY),
    ("Opening cash", "starting bank balance",        SAGE),
]

def dial_card(x, y, w, h, title, sub, color):
    out = [rrect(x, y, w, h, 16, "#FFFFFF", stroke=color, sw=1.8, shadow=True)]
    out.append(rrect(x, y, 10, h, 16, color))
    out.append(rrect(x+5, y, 6, h, 0, color))
    # little dial glyph
    gx, gy = x + 50, y + h/2
    out.append(f'<circle cx="{gx}" cy="{gy}" r="22" fill="{tint(color,0.18)}" stroke="{color}" stroke-width="2"/>')
    # pointer
    out.append(f'<line x1="{gx}" y1="{gy}" x2="{gx+13}" y2="{gy-13}" stroke="{darken(color)}" stroke-width="3" stroke-linecap="round"/>')
    out.append(f'<circle cx="{gx}" cy="{gy}" r="3.5" fill="{darken(color)}"/>')
    out.append(text(x+92, y+h/2-6, title, 22, INK, family=SERIF, weight="700", anchor="start"))
    out.append(text(x+92, y+h/2+18, sub, 13, INK_MUTE, italic=True, anchor="start"))
    return "".join(out)

in_centres = []
for i, (t, sub, c) in enumerate(dials):
    y = in_y0 + i*(in_h + in_gap)
    S.append(dial_card(LX, y, LW, in_h, t, sub, c))
    in_centres.append((LX+LW, y + in_h/2, c))

# Centre engine
eng_w, eng_h = 360, 300
eng_x = W/2 - eng_w/2
eng_y = H/2 - eng_h/2 + 30
S.append(rrect(eng_x, eng_y, eng_w, eng_h, 22, "#FFFFFF", stroke=TERRA, sw=2.4, shadow=True))
S.append(rrect(eng_x, eng_y, eng_w, 10, 22, TERRA))
S.append(rrect(eng_x+5, eng_y, eng_w-10, 6, 0, TERRA))
# cog stack
ecx, ecy = eng_x + eng_w/2, eng_y + 130
S.append(cog(ecx-34, ecy, 52, GOLD, teeth=12))
S.append(cog(ecx+44, ecy+30, 38, TEAL, teeth=10))
S.append(text(ecx, eng_y + eng_h - 64, "Financial model", 26, INK, family=SERIF, weight="700"))
S.append(text(ecx, eng_y + eng_h - 38, "one engine, recomputed live", 13.5, INK_MUTE, italic=True))

# Right: 3 output cards
RX = W - 80 - 320
RW = 320
out_h = 130
out_gap = 56
out_y0 = 250
outputs = [
    ("Unit cost", "AU$ per bed by method + volume", SAGE),
    ("P&L",       "operating result by scenario",   GOLD),
    ("Cashflow",  "36-month runway + trough",       TEAL),
]
out_centres = []
def out_card(x, y, w, h, title, sub, color):
    out = [rrect(x, y, w, h, 16, "#FFFFFF", stroke=color, sw=1.8, shadow=True)]
    out.append(rrect(x, y, w, 10, 16, color))
    out.append(rrect(x, y+5, w, 6, 0, color))
    out.append(text(x+w/2, y+h/2-4, title, 24, INK, family=SERIF, weight="700"))
    out.append(text(x+w/2, y+h/2+22, sub, 13, INK_MUTE, italic=True))
    return "".join(out)

for i, (t, sub, c) in enumerate(outputs):
    y = out_y0 + i*(out_h + out_gap)
    S.append(out_card(RX, y, RW, out_h, t, sub, c))
    out_centres.append((RX, y + out_h/2, c))

# ------------------------------------------------------------------- flows
# inputs -> engine (subtle, into the left face of the engine)
eng_left = eng_x
for k, (sx, sy, c) in enumerate(in_centres):
    ty = eng_y + 50 + k*((eng_h-100)/(len(in_centres)-1))
    S.append(connector(sx+8, sy, eng_left-4, ty, c, sw=2.2))
# bold combined arrow label near engine entry
S.append(rrect((LX+LW+eng_left)/2 - 70, eng_y - 6, 140, 26, 13, BG, stroke=TERRA, sw=1.3))
S.append(text((LX+LW+eng_left)/2, eng_y + 12, "INPUTS", 13, darken(TERRA), weight="700", spacing="1.6"))

# engine -> outputs
eng_right = eng_x + eng_w
for k, (tx, ty, c) in enumerate(out_centres):
    sy = eng_y + 50 + k*((eng_h-100)/(len(out_centres)-1))
    S.append(connector(eng_right+4, sy, tx-8, ty, c, sw=2.6))
S.append(rrect((eng_right+RX)/2 - 78, eng_y - 6, 156, 26, 13, BG, stroke=SAGE, sw=1.3))
S.append(text((eng_right+RX)/2, eng_y + 12, "OUTPUTS", 13, darken(SAGE), weight="700", spacing="1.6"))

# ------------------------------------------------------------------- footer
fy = H - 70
S.append(f'<line x1="{LX}" y1="{fy-22}" x2="{W-80}" y2="{fy-22}" stroke="{HAIR}" stroke-width="1"/>')
S.append(text(LX, fy,
   "The model is scenario-aware: turn a dial (volume, method, founder time, opening cash) and unit cost, P&L and cashflow all update together.",
   14, INK, family=SERIF, anchor="start"))
S.append(text(LX, fy+24,
   "Source: Goods financial model (2026-05). Founder-rate and FTE inputs and opening cash are pending confirmation.",
   11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))

S.append("</svg>")

# --------------------------------------------------------------- write + render
pub = Path(__file__).resolve().parent.parent / "v2" / "public"
svg_path = pub / "goods-model-engine.svg"
png_path = pub / "goods-model-engine.png"
pdf_path = pub / "goods-model-engine.pdf"
svg_path.write_text("\n".join(S))
print(f"wrote {svg_path} ({svg_path.stat().st_size} bytes)")
try:
    subprocess.run(["rsvg-convert", "-o", str(png_path), str(svg_path)], check=True)
    subprocess.run(["rsvg-convert", "-f", "pdf", "-o", str(pdf_path), str(svg_path)], check=True)
    print(f"wrote {png_path} ({png_path.stat().st_size} bytes)")
    print(f"wrote {pdf_path} ({pdf_path.stat().st_size} bytes)")
except (FileNotFoundError, subprocess.CalledProcessError) as e:
    print(f"WARNING: rsvg-convert failed ({e}); SVG written, PNG/PDF skipped.")
