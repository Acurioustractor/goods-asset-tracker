#!/usr/bin/env python3
"""
Goods on Country — Cost-down: in-sourcing captures the value (SVG + PNG + PDF).

Four descending cost steps left -> right against a held AU$750 price line. As
Goods in-sources (assembly, then a press + CNC factory, then community labour +
free waste plastic), direct cost per bed falls and the captured margin widens.

EXACT figures (do not change):
  - Price line:        AU$750 (held flat)
  - Buy-Kit:           direct 535, margin 215 (29%)
  - In-source assembly: direct ~510 (intermediate step)
  - Factory:           direct 276, margin 474 (63%)  [highlight green]
  - Community:         direct 141, margin 609 (81%)  [highlight purple]
  Arrow labels between steps:
    "in-source assembly"
    "add 90-200K capex: press + CNC"
    "free waste plastic + community labour"

Style mirrors scripts/generate_goods_cost_model_diagram.py (same palette, fonts,
helpers, SVG -> PNG/PDF via rsvg-convert).
Output:     v2/public/goods-cost-down.{svg,png,pdf}
Regenerate: python3 scripts/generate_goods_cost_down.py
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
PURPLE = "#7A5C8E"   # community highlight, in warm-earth family

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
    out = []
    for i, ln in enumerate(lines):
        out.append(text(cx, y + i*lh, ln, size, color, **kw))
    return "".join(out)

def rrect(x, y, w, h, r, fill, stroke=None, sw=1.4, shadow=False):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    fil = ' filter="url(#sh)"' if shadow else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"{s}{fil}/>'

def arrow_right(x1, y, x2, color=HAIR, sw=2.4):
    return (f'<path d="M {x1} {y} L {x2-7} {y} M {x2-12} {y-5} L {x2-5} {y} L {x2-12} {y+5}" '
            f'fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')

# --------------------------------------------------------------------- canvas
W, H = 1680, 980
S = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{SANS}">']
S.append('''<defs><filter id="sh" x="-8%" y="-8%" width="116%" height="124%">
<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#5A4A38" flood-opacity="0.10"/></filter></defs>''')
S.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')

# ------------------------------------------------------------------- header
S.append(text(W/2, 74, "Cost-down: in-sourcing captures the value", 50, INK, family=SERIF, weight="700"))
S.append(text(W/2, 110, "Direct cost per bed falls at each in-sourcing step, against the held AU$750 price. The widening band is captured margin.",
              20, INK_MUTE, family=SERIF, italic=True))

# ------------------------------------------------------------------- chart frame
LX, RXn = 60, 1620
ch_x, ch_y = LX, 196
ch_w, ch_h = RXn - LX, 560
price = 750.0
y_top_val = 820.0            # axis ceiling so $750 line sits near the top

def yval(v):
    return ch_y + ch_h - (v / y_top_val) * ch_h

# baseline
S.append(f'<line x1="{ch_x}" y1="{ch_y+ch_h}" x2="{ch_x+ch_w}" y2="{ch_y+ch_h}" stroke="{HAIR}" stroke-width="1.6"/>')

# steps: label, sublabel, direct, margin, pct(or None), color, highlight
steps = [
    ("Buy-Kit",            "buy finished kits from supplier", 535, 215, 29,  TEAL,   False),
    ("In-source assembly", "train operators, assemble in-house", 510, 240, None, GOLD, False),
    ("Factory",            "press + CNC On-Country",          276, 474, 63,  SAGE,   True),
    ("Community",          "community-owned production",      141, 609, 81,  PURPLE, True),
]
arrow_labels = [
    "in-source assembly",
    "add 90-200K capex: press + CNC",
    "free waste plastic + community labour",
]

n = len(steps)
slot = ch_w / n
bw = 200

# shaded widening margin band (price line down to each step top) — drawn first
for i, (lab, sub, direct, margin, pct, color, hi) in enumerate(steps):
    cx = ch_x + slot*i + slot/2
    top = yval(price)
    bot = yval(direct)
    S.append(rrect(cx-bw/2, top, bw, bot-top, 6, tint(color, 0.16)))

# price line (dashed) on top of band
S.append(f'<line x1="{ch_x}" y1="{yval(price):.1f}" x2="{ch_x+ch_w}" y2="{yval(price):.1f}" '
         f'stroke="{TERRA}" stroke-width="2.0" stroke-dasharray="7 5"/>')
S.append(text(ch_x+6, yval(price)-12, "Price AU$750 (held flat)", 15, darken(TERRA), weight="700", anchor="start"))

# step cards (the descending direct-cost bars)
for i, (lab, sub, direct, margin, pct, color, hi) in enumerate(steps):
    cx = ch_x + slot*i + slot/2
    by = yval(direct)
    bh = (ch_y + ch_h) - by
    # direct-cost bar
    S.append(rrect(cx-bw/2, by, bw, bh, 12, color, stroke=darken(color), sw=1.4, shadow=True))
    if hi:
        S.append(rrect(cx-bw/2-3, by-3, bw+6, bh+6, 14, "none", stroke=darken(color), sw=2.4))
    # margin value sitting in the shaded band
    band_mid = (yval(price) + by) / 2
    pct_txt = f"  ({pct}%)" if pct is not None else ""
    S.append(text(cx, band_mid-4, f"margin AU${margin:,}{pct_txt}", 17, darken(color),
                  weight="700"))
    S.append(text(cx, band_mid+16, "captured value", 12, INK_MUTE, italic=True))
    # direct-cost cap label
    S.append(text(cx, by+30, f"direct AU${direct:,}", 16, "#FFFFFF", weight="700"))
    # step number chip
    S.append(f'<circle cx="{cx-bw/2+18}" cy="{by+20}" r="14" fill="{darken(color)}"/>')
    S.append(text(cx-bw/2+18, by+25, str(i+1), 14, "#FFFFFF", weight="700"))
    # step label below axis
    S.append(text(cx, ch_y+ch_h+30, lab, 19, INK, family=SERIF, weight="700"))
    sub_lines = wrap(sub, 24)
    S.append(mtext(cx, ch_y+ch_h+52, sub_lines, 12.5, INK_MUTE, 15, italic=True))
    # arrow + label to next step (between bar tops)
    if i < n-1:
        nx = ch_x + slot*(i+1) + slot/2
        ny = yval(steps[i+1][2])
        midy = (by + ny) / 2 - 30
        S.append(arrow_right(cx+bw/2+8, midy, nx-bw/2-8, color=darken(color), sw=2.6))
        lab_lines = wrap(arrow_labels[i], 22)
        S.append(mtext((cx+bw/2+nx-bw/2)/2, midy-12*len(lab_lines)-2, lab_lines, 12.5,
                       darken(color), 14, weight="700"))

# ------------------------------------------------------------------- footer
fy = ch_y + ch_h + 96
S.append(f'<line x1="{LX}" y1="{fy-22}" x2="{RXn}" y2="{fy-22}" stroke="{HAIR}" stroke-width="1"/>')
S.append(text(LX, fy,
   "Each step is gated by committed volume and a make-vs-buy decision. Margin = AU$750 price minus direct cost per bed.",
   14, INK, family=SERIF, anchor="start"))
S.append(text(LX, fy+24,
   "Source: Goods cost model (2026-05). Direct-cost figures are modelled on verified BOM inputs; AU$750 price verified. Capex and community-labour inputs are forward estimates.",
   11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))

S.append("</svg>")

# --------------------------------------------------------------- write + render
pub = Path(__file__).resolve().parent.parent / "v2" / "public"
svg_path = pub / "goods-cost-down.svg"
png_path = pub / "goods-cost-down.png"
pdf_path = pub / "goods-cost-down.pdf"
svg_path.write_text("\n".join(S))
print(f"wrote {svg_path} ({svg_path.stat().st_size} bytes)")
try:
    subprocess.run(["rsvg-convert", "-o", str(png_path), str(svg_path)], check=True)
    subprocess.run(["rsvg-convert", "-f", "pdf", "-o", str(pdf_path), str(svg_path)], check=True)
    print(f"wrote {png_path} ({png_path.stat().st_size} bytes)")
    print(f"wrote {pdf_path} ({pdf_path.stat().st_size} bytes)")
except (FileNotFoundError, subprocess.CalledProcessError) as e:
    print(f"WARNING: rsvg-convert failed ({e}); SVG written, PNG/PDF skipped.")
