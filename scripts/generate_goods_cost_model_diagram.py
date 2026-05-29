#!/usr/bin/env python3
"""
Goods on Country — Stretch Bed cost model v6 (SVG).

Three honest cost stories on one canvas, for the QBE / SIH investment pack:
  1. Idiot Index per component (current paid / raw-material floor). A high
     index is not waste; it is the value-add we could in-source. The HDPE kit
     (8.6x, ~AU$289/bed of Defy margin) is the whole capital case.
  2. Marginal vs fixed reframe. Marginal ~AU$685/bed today (Defy-kit) ->
     ~AU$426/bed (factory, in-sourced), PLUS an annual fixed block
     ~AU$110-123K/yr. The old "AU$1,912/bed at 100/yr" is marginal + fixed
     absorbed over a tiny denominator, not a real unit cost. Breakeven ~378
     beds/yr on the factory path.
  3. Cost-down trajectory tied to volume / in-sourcing milestones, against the
     held AU$750 price line.

Every figure traces to wiki/outputs/2026-05-29-qbe-investment-sweep/
01-cost-model-idiot-index.json (v6). No figure invented.

Style mirrors scripts/generate_theory_of_change.py (same palette, fonts,
helpers, SVG -> PNG/PDF via rsvg-convert).
Output:     v2/public/cost-model-diagram.svg  (+ png/pdf via rsvg-convert)
Regenerate: python3 scripts/generate_goods_cost_model_diagram.py
"""

from pathlib import Path

# ------------------------------------------------------------------- palette
BG       = "#FBFAF5"
INK      = "#2A241E"
INK_MUTE = "#6F6155"
HAIR     = "#C9BCA8"
SAND     = "#EFE8DA"
SAND_HI  = "#E4DAC6"

TERRA = "#BD6A3C"
SAGE  = "#6F9C68"
GOLD  = "#C2A55E"
CLAY  = "#8A5A45"
TEAL  = "#4C9B97"
RUST  = "#A8442E"   # "avoid" red-ish, in-palette

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

def panel_title(x, y, kicker, title, color):
    out = [text(x, y, kicker, 13, darken(color), weight="700", anchor="start", spacing="1.2")]
    out.append(text(x, y+24, title, 22, INK, family=SERIF, weight="700", anchor="start"))
    return "".join(out)

# --------------------------------------------------------------------- canvas
W, H = 1680, 1500
S = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{SANS}">']
S.append(f'''<defs><filter id="sh" x="-8%" y="-8%" width="116%" height="124%">
<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#5A4A38" flood-opacity="0.10"/></filter></defs>''')
S.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')

# ------------------------------------------------------------------- header
S.append(text(W/2, 70, "Goods on Country: the cost story (v6)", 50, INK, family=SERIF, weight="700"))
S.append(text(W/2, 106, "Where the cost lives, how the headline number misleads, and how the bed gets cheaper as volume and in-sourcing grow.",
              20, INK_MUTE, family=SERIF, italic=True))

LX, RXn = 60, 1620   # working margins

# ================================================================= PANEL 1
# Idiot Index bars
p1y = 152
S.append(S.pop() if False else "")  # noop keep numbering tidy
S.append(panel_title(LX, p1y, "1 · IDIOT INDEX", "Where the cost lives, per component", TERRA))
S.append(text(LX, p1y+46, "Index = what we pay now ÷ raw-material floor. A high bar is not waste; it is the value-add (and supplier margin) we could capture by in-sourcing.",
              13.5, INK_MUTE, anchor="start"))

# data straight from 01-cost-model-idiot-index.json
idiot = [
    # label, index, current_paid, raw_floor, color, lever?, note
    ("HDPE kit (Defy cut + finished)", 8.6, 344.05, 40.00, TERRA, True,
     "Headline lever: ~AU$289/bed of Defy margin = the in-sourcing prize"),
    ("Defy pre-pressed panels (alt)", 10.0, 400.00, 40.00, RUST, False,
     "Avoid: pay the press margin and still CNC + assemble"),
    ("Canvas (Centre Canvas)", 2.4, 93.50, 38.50, TEAL, False,
     "In-house sewing only at volume; competitive vs AU$130 self-sew"),
    ("Steel poles (DNA Steel)", 2.1, 27.00, 12.67, GOLD, False,
     "Already reasonable; local NT procurement premium worth keeping"),
    ("Bolts", 1.7, 1.00, 0.60, SAGE, False, "Trivial dollar impact"),
    ("End caps", 1.2, 3.20, 2.60, SAGE, False, "Near cost; buy bulk direct"),
    ("Hardware: screws", 1.0, 1.04, 1.04, SAGE, False, "Already at raw rate"),
    ("Defy assembly labour", 0.9, 55.95, 60.00, SAGE, False,
     "Competitive; in-sourcing here is a jobs / mission move, not a cost move"),
]

bar_x = LX + 280              # bars start
bar_max_w = 980               # width for index = 10
idx_max = 10.0
row_h = 42
b0y = p1y + 78
for i, (lab, idx, paid, floor, color, lever, note) in enumerate(idiot):
    cy = b0y + i*row_h
    # label
    S.append(text(LX, cy+row_h/2-1, lab, 14, INK, weight="700" if lever else "600", anchor="start"))
    # track
    S.append(rrect(bar_x, cy+8, bar_max_w, row_h-18, 6, tint(SAND, 0.55)))
    # bar
    bw = bar_max_w * (idx/idx_max)
    S.append(rrect(bar_x, cy+8, bw, row_h-18, 6, color, stroke=darken(color), sw=1.0,
                   shadow=lever))
    # index value at bar end
    S.append(text(bar_x+bw+10, cy+row_h/2-1, f"{idx:g}x", 14, darken(color), weight="700", anchor="start"))
    # paid vs floor + note (right of value)
    note_x = bar_x + bw + 64
    if note_x > 1300:
        note_x = 1300
    S.append(text(note_x, cy+row_h/2-6, f"AU${paid:,.0f} paid · AU${floor:,.0f} floor",
                  11.5, INK_MUTE, anchor="start"))
    S.append(text(note_x, cy+row_h/2+10, note, 11, INK_MUTE, anchor="start", italic=True))
    if lever:
        S.append(rrect(bar_x-2, cy+5, bw+4, row_h-12, 8, "none", stroke=darken(TERRA), sw=1.6))

# callout: the prize
cy_end = b0y + len(idiot)*row_h
S.append(rrect(LX, cy_end+8, RXn-LX, 46, 12, tint(TERRA), stroke=TERRA, sw=1.5))
S.append(text(LX+22, cy_end+36,
   "The capital case is a plastic-processing ask, full stop: in-source HDPE shred + press + CNC and capture ~AU$289/bed of Defy margin (~AU$144K/yr at 500 beds).",
   14, darken(TERRA), weight="600", anchor="start"))

# ================================================================= PANEL 2
# Marginal vs fixed reframe
p2y = cy_end + 96
S.append(panel_title(LX, p2y, "2 · MARGINAL vs FIXED", "Why \"AU$1,912/bed\" is the wrong number", CLAY))

col_w = (RXn - LX - 40) / 2
left_x = LX
right_x = LX + col_w + 40
card_y = p2y + 28
card_h = 232

# -- left card: the honest split
S.append(rrect(left_x, card_y, col_w, card_h, 16, "#FFFFFF", stroke=TEAL, sw=1.8, shadow=True))
S.append(rrect(left_x, card_y, col_w, 8, 16, TEAL)); S.append(rrect(left_x, card_y+4, col_w, 6, 0, TEAL))
S.append(text(left_x+24, card_y+38, "The honest split", 18, INK, family=SERIF, weight="700", anchor="start"))

# marginal pair (today vs factory)
mx = left_x + 24
S.append(text(mx, card_y+70, "MARGINAL  (per bed, scales with each bed)", 12, darken(TEAL), weight="700", anchor="start", spacing="0.6"))
# today bar
mtrack_x = mx + 0
mtrack_w = col_w - 48
mscale = mtrack_w / 750.0    # px per dollar, full = $750 price
S.append(rrect(mx, card_y+82, mtrack_w*(684.79/750.0), 24, 7, TEAL, stroke=darken(TEAL), sw=1.0))
S.append(text(mx+10, card_y+99, "Defy-kit today  AU$685", 13, "#FFFFFF", weight="700", anchor="start"))
# factory bar
S.append(rrect(mx, card_y+112, mtrack_w*(425.74/750.0), 24, 7, SAGE, stroke=darken(SAGE), sw=1.0))
S.append(text(mx+10, card_y+129, "Factory (in-sourced)  AU$426", 13, "#FFFFFF", weight="700", anchor="start"))
# fixed block
S.append(text(mx, card_y+164, "PLUS ANNUAL FIXED BLOCK  (does not scale per bed)", 12, darken(CLAY), weight="700", anchor="start", spacing="0.4"))
S.append(text(mx, card_y+186, "~AU$110-123K / yr", 22, INK, family=SERIF, weight="700", anchor="start"))
S.append(text(mx+232, card_y+186, "facility + production time + admin + field travel", 12, INK_MUTE, anchor="start", italic=True))
S.append(text(mx, card_y+212, "Funded by philanthropy today; absorbed by bed margin at scale.", 12.5, INK_MUTE, anchor="start"))

# -- right card: the distortion
S.append(rrect(right_x, card_y, col_w, card_h, 16, "#FFFFFF", stroke=RUST, sw=1.8, shadow=True))
S.append(rrect(right_x, card_y, col_w, 8, 16, RUST)); S.append(rrect(right_x, card_y+4, col_w, 6, 0, RUST))
S.append(text(right_x+24, card_y+38, "The distortion to retire", 18, INK, family=SERIF, weight="700", anchor="start"))
rx = right_x + 24
S.append(text(rx, card_y+72, "AU$1,912 / bed  (the \"fully-loaded at 100/yr\" figure)", 15, darken(RUST), weight="700", anchor="start"))
# stacked composition bar
comp_y = card_y + 86
comp_w = col_w - 48
total = 1912.0
seg = [("Marginal ~AU$535", 534.79, TEAL), ("Fixed block absorbed over only 100 beds ~AU$1,377", 1377.0, RUST)]
xacc = rx
for slab, val, col in seg:
    sw_ = comp_w * (val/total)
    S.append(rrect(xacc, comp_y, sw_, 30, 6, col, stroke=darken(col), sw=1.0))
    xacc += sw_
S.append(text(rx, comp_y+58, "It divides a fixed annual block over an artificially small", 13, INK, anchor="start"))
S.append(text(rx, comp_y+76, "100-bed denominator, and miscounts long-haul freight as", 13, INK, anchor="start"))
S.append(text(rx, comp_y+94, "overhead. It is arithmetic, not a real unit cost.", 13, INK, anchor="start"))
S.append(rrect(rx, comp_y+108, comp_w, 38, 10, tint(SAGE), stroke=SAGE, sw=1.4))
S.append(text(rx+14, comp_y+132, "Breakeven on the factory path: ~378 beds / yr  (AU$750 price, AU$426 marginal).",
              13, darken(SAGE), weight="700", anchor="start"))

# ================================================================= PANEL 3
# Cost-down trajectory
p3y = card_y + card_h + 72
S.append(panel_title(LX, p3y, "3 · COST-DOWN TRAJECTORY", "The bed gets cheaper as volume and in-sourcing grow", SAGE))
S.append(text(LX, p3y+46, "Direct cost per bed at each stage, against the held AU$750 shop price. Each step is gated by committed volume and a make-vs-buy decision.",
              13.5, INK_MUTE, anchor="start"))

# chart frame
ch_x, ch_y = LX, p3y + 70
ch_w, ch_h = RXn - LX, 300
price = 750.0
y_top_val = 800.0           # axis ceiling so $750 line sits near top
def yval(v):
    return ch_y + ch_h - (v / y_top_val) * ch_h

# baseline + price line
S.append(f'<line x1="{ch_x}" y1="{ch_y+ch_h}" x2="{ch_x+ch_w}" y2="{ch_y+ch_h}" stroke="{HAIR}" stroke-width="1.4"/>')
S.append(f'<line x1="{ch_x}" y1="{yval(price):.1f}" x2="{ch_x+ch_w}" y2="{yval(price):.1f}" stroke="{TERRA}" stroke-width="1.8" stroke-dasharray="6 5"/>')
S.append(text(ch_x+ch_w, yval(price)-8, "PRICE  AU$750 (held flat)", 13, darken(TERRA), weight="700", anchor="end"))

stages = [
    # label, trigger, direct_total, color
    ("Defy kits", "today, ~100/yr, no plant", 469.79, TEAL),
    ("In-source assembly", "~150-300/yr, trained operators", 469.79, GOLD),
    ("Factory (press + CNC)", "~300-500/yr committed, AU$90-200K capex", 275.74, SAGE),
    ("Community + free waste plastic", "~1,000/yr, council feedstock + CDP labour", 140.74, CLAY),
]
n = len(stages)
slot = ch_w / n
bw = 132
pts = []
for i, (lab, trig, val, color) in enumerate(stages):
    cx = ch_x + slot*i + slot/2
    by = yval(val)
    bh = (ch_y + ch_h) - by
    # bar
    S.append(rrect(cx-bw/2, by, bw, bh, 10, color, stroke=darken(color), sw=1.2, shadow=True))
    # value cap
    S.append(text(cx, by-12, f"AU${val:,.2f}", 16, darken(color), family=SERIF, weight="700"))
    # margin gap annotation inside or above
    S.append(text(cx, by+26, f"AU${price-val:,.0f}", 12.5, "#FFFFFF", weight="700"))
    S.append(text(cx, by+42, "margin", 10.5, "#FFFFFF"))
    # stage label below axis
    llines = wrap(lab, 18)
    S.append(mtext(cx, ch_y+ch_h+24, llines, 14, INK, 16, weight="700"))
    ty2 = ch_y+ch_h+24 + 16*len(llines) + 2
    tlines = wrap(trig, 26)
    S.append(mtext(cx, ty2, tlines, 11, INK_MUTE, 13, italic=True))
    # stage number chip
    S.append(f'<circle cx="{cx-bw/2+16}" cy="{by+18}" r="13" fill="{darken(color)}"/>')
    S.append(text(cx-bw/2+16, by+22, str(i), 13, "#FFFFFF", weight="700"))
    pts.append((cx, by))
    if i < n-1:
        nx = ch_x + slot*(i+1) + slot/2
        S.append(arrow_right(cx+bw/2+6, (by + yval(stages[i+1][2]))/2, nx-bw/2-6, color=HAIR, sw=2.2))

# trend line connecting bar tops
path_d = "M " + " L ".join(f"{px:.1f} {py:.1f}" for px, py in pts)
S.append(f'<path d="{path_d}" fill="none" stroke="{INK_MUTE}" stroke-width="1.4" stroke-dasharray="2 6" opacity="0.6"/>')

# ------------------------------------------------------------------- footer
fy = ch_y + ch_h + 118
S.append(f'<line x1="{LX}" y1="{fy-20}" x2="{RXn}" y2="{fy-20}" stroke="{HAIR}" stroke-width="1"/>')
S.append(text(LX, fy,
   "The honest sequence: buy Defy kits now; in-source when committed volume crosses ~300 beds/yr. Below that, the plant capex does not pay back.",
   14, INK, family=SERIF, anchor="start"))
S.append(text(LX, fy+24,
   "Source: cost model v6 (01-cost-model-idiot-index.json, 2026-05-29). Marginal, fixed-block, factory and community figures are modelled on verified BOM inputs; price AU$750 verified. Founder-rate and FTE inputs are pending confirmation.",
   11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))

S.append("</svg>")

out = Path(__file__).resolve().parent.parent / "v2" / "public" / "cost-model-diagram.svg"
out.write_text("\n".join(S))
print(f"wrote {out} ({out.stat().st_size} bytes)")
