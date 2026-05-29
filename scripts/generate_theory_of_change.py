#!/usr/bin/env python3
"""
Goods on Country — Theory of Change as a results-chain logic model (SVG).

Built to take on the SIH Impact Investment Readiness Diagnostic V4 and QBE
Catalysing Impact feedback:
  - explicit logic chain: inputs -> activities -> outputs -> outcomes -> impact
  - outcomes grouped by the two QBE Foundation priorities (Inclusion + Climate
    Resilience) and the 5 impact dimensions in v2/src/lib/data/impact-model.ts
  - honest status flags: tracked / partial / modelled / design-target
  - the community-led operating cycle kept as the "Activities" band

Companion doc: wiki/outputs/2026-05-29-goods-theory-of-change-and-mel.md
Output:        v2/public/theory-of-change.svg  (+ png/pdf via rsvg-convert)
Regenerate:    python3 scripts/generate_theory_of_change.py
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

def wrap(text, max_chars):
    words, lines, cur = text.split(), [], ""
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

def arrow_down(cx, y1, y2, color=HAIR):
    return (f'<path d="M {cx} {y1} L {cx} {y2-7} M {cx-5} {y2-12} L {cx} {y2-5} L {cx+5} {y2-12}" '
            f'fill="none" stroke="{color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>')

# --------------------------------------------------------------------- canvas
W, H = 1680, 1320
S = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{SANS}">']
S.append(f'''<defs><filter id="sh" x="-8%" y="-8%" width="116%" height="124%">
<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#5A4A38" flood-opacity="0.10"/></filter></defs>''')
S.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')

# ------------------------------------------------------------------- header
S.append(text(W/2, 70, "Goods on Country: theory of change", 50, INK, family=SERIF, weight="700"))
S.append(text(W/2, 106, "From community-led design to community-owned production: how our activities create measured outcomes on Country.",
              20, INK_MUTE, family=SERIF, italic=True))

# ------------------------------------------------------------------- problem strip
px, py, pw, ph = 40, 138, 1600, 60
S.append(rrect(px, py, pw, ph, 14, tint(CLAY), stroke=CLAY, sw=1.5))
S.append(text(px+26, py+ph/2+5, "PROBLEM", 15, darken(CLAY), weight="700", anchor="start", spacing="1.5"))
S.append(text(px+160, py+ph/2+5,
   "Remote homes face costly, short-lived goods. Floor sleeping and dirty bedding feed skin infections linked to rheumatic heart disease; FRRR (2022): 59% of remote homes have no washing machine.",
   14, INK, anchor="start"))

# ------------------------------------------------------------------- band geometry
RAIL_X, RAIL_W = 40, 116
CX0, CX1 = 172, 1640          # content area
CXW = CX1 - CX0
midx = (CX0 + CX1) / 2

def rail(y, h, label, color):
    out = [rrect(RAIL_X, y, RAIL_W, h, 12, tint(color, 0.16), stroke=color, sw=1.3)]
    out.append(text(RAIL_X+RAIL_W/2, y+h/2+5, label, 14, darken(color), weight="700", spacing="0.5"))
    return "".join(out)

def chip_row(items, y, h, color):
    """items: list of (label, status_glyph or '')."""
    n = len(items)
    gap = 14
    cw = (CXW - gap*(n-1)) / n
    out = []
    for i, (lab, glyph) in enumerate(items):
        x = CX0 + i*(cw+gap)
        out.append(rrect(x, y, cw, h, 11, tint(color, 0.10), stroke=color, sw=1.3))
        lines = wrap(lab, int(cw/8.0))
        ty = y + h/2 - (len(lines)-1)*8 + 5
        out.append(mtext(x+cw/2, ty, lines, 13.5, INK, 16, weight="600"))
        if glyph:
            out.append(text(x+cw-12, y+15, glyph, 13, darken(color), anchor="end"))
    return "".join(out)

# ===================================================================== INPUTS
iy, ih = 224, 70
S.append(rail(iy, ih, "INPUTS", CLAY))
S.append(chip_row([
    ("Community leadership", ""), ("Recycled HDPE", ""), ("Steel + canvas", ""),
    ("On-Country plant", ""), ("Capital: grants + catalytic", ""), ("Health + delivery partners", ""),
], iy, ih, CLAY))
S.append(arrow_down(midx, iy+ih, iy+ih+26))

# ================================================================= ACTIVITIES
ay, ah = iy+ih+26, 150
S.append(rail(ay, ah, "ACTIVITIES", SAGE))
cycle = [("Listen", SAGE), ("Design", SAGE), ("Make", SAGE),
         ("Deliver", TEAL), ("Learn", TEAL), ("Improve", SAGE)]
n = len(cycle); gap = 16
cw = (CXW - gap*(n-1)) / n
card_h = 96
cyc_y = ay + 14
for i, (lab, color) in enumerate(cycle):
    x = CX0 + i*(cw+gap)
    S.append(rrect(x, cyc_y, cw, card_h, 14, tint(color), stroke=color, sw=1.5, shadow=True))
    S.append(text(x+cw/2, cyc_y+34, str(i+1), 15, "#FFFFFF", weight="700"))
    S.append(f'<circle cx="{x+cw/2}" cy="{cyc_y+29}" r="14" fill="{color}"/>')
    S.append(text(x+cw/2, cyc_y+34, str(i+1), 14, "#FFFFFF", weight="700"))
    S.append(text(x+cw/2, cyc_y+70, lab, 18, darken(color), weight="700"))
    if i < n-1:
        ax0 = x+cw+2
        S.append(f'<path d="M {ax0} {cyc_y+card_h/2} L {ax0+gap-4} {cyc_y+card_h/2} '
                 f'M {ax0+gap-9} {cyc_y+card_h/2-4} L {ax0+gap-4} {cyc_y+card_h/2} L {ax0+gap-9} {cyc_y+card_h/2+4}" '
                 f'fill="none" stroke="{HAIR}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>')
S.append(text(CX0, cyc_y+card_h+26, "↺  Community-led, and it repeats: what we learn returns to the design with every delivery.",
              14, INK_MUTE, family=SERIF, italic=True, anchor="start"))
S.append(arrow_down(midx, ay+ah, ay+ah+26))

# ==================================================================== OUTPUTS
oy, oh = ay+ah+26, 70
S.append(rail(oy, oh, "OUTPUTS", TEAL))
S.append(chip_row([
    ("Beds delivered", "●"), ("Plastic diverted", "◐"), ("Wash cycles run", "◐"),
    ("Employment hours", "○"), ("Consent-led stories", "●"), ("QR-tracked register", "●"),
], oy, oh, TEAL))
S.append(arrow_down(midx, oy+oh, oy+oh+26))

# =================================================================== OUTCOMES
ocy, och = oy+oh+26, 322
S.append(rail(ocy, och, "OUTCOMES", GOLD))

def dim_card(x, y, w, h, name, color, rows):
    out = [rrect(x, y, w, h, 13, "#FFFFFF", stroke=color, sw=1.5, shadow=True)]
    out.append(rrect(x, y, w, 30, 13, color))
    out.append(rrect(x, y+16, w, 14, 0, color))  # square off bottom of header
    out.append(text(x+w/2, y+20, name, 14.5, "#FFFFFF", weight="700"))
    labels = ["Short", "Medium", "Long"]
    ry = y + 46
    for j, txt in enumerate(rows):
        out.append(text(x+12, ry, labels[j], 11, darken(color), weight="700", anchor="start", spacing="0.4"))
        lines = wrap(txt, int((w-24)/6.6))
        out.append(mtext(x+w/2, ry+16, lines, 12.5, INK, 15))
        ry += 16 + 15*len(lines) + 8
    return "".join(out)

# two QBE-priority panels
pgap = 22
incl_w = CXW*0.70 - pgap/2
clim_w = CXW*0.30 - pgap/2
incl_x = CX0
clim_x = CX0 + incl_w + pgap

# priority headers
S.append(text(incl_x, ocy+4, "INCLUSION  ·  QBE Foundation priority", 13, darken(TERRA), weight="700", anchor="start", spacing="0.8"))
S.append(text(clim_x, ocy+4, "CLIMATE RESILIENCE  ·  QBE", 13, darken(SAGE), weight="700", anchor="start", spacing="0.8"))

dy = ocy + 14
dh = och - 14
# Inclusion: 3 dimension cards
dim_gap = 16
dcw = (incl_w - dim_gap*2) / 3
S.append(dim_card(incl_x, dy, dcw, dh, "Health & wellbeing", CLAY, [
    "Off-floor sleeping; a clean-bedding pathway in the home.",
    "Less scabies and Strep A exposure; assets still in use at 12 months.",
    "Reduced rheumatic heart disease burden (with health-evidence partners).",
]))
S.append(dim_card(incl_x+dcw+dim_gap, dy, dcw, dh, "Economic inclusion", GOLD, [
    "Household income retained; first local paid work.",
    "Members trained and employed; institutional orders convert.",
    "Sustainable local livelihoods (WISE employment).",
]))
S.append(dim_card(incl_x+2*(dcw+dim_gap), dy, dcw, dh, "Community ownership", TEAL, [
    "Community co-leads design and production.",
    "Named lead on payroll; community entity invoices the buyer.",
    "Community-owned production on Country. We become unnecessary.",
]))
# Climate: 1 dimension card
S.append(dim_card(clim_x, dy, clim_w, dh, "Environmental", SAGE, [
    "Community plastic captured and re-used; less landfill.",
    "A working circular loop; replacement cycles lengthen.",
    "A measurable environmental-health evidence base.",
]))
S.append(arrow_down(midx, ocy+och, ocy+och+26))

# ===================================================================== IMPACT
imy, imh = ocy+och+26, 64
S.append(rail(imy, imh, "IMPACT", TERRA))
S.append(rrect(CX0, imy, CXW, imh, 14, tint(TERRA), stroke=TERRA, sw=1.5))
S.append(text((CX0+CX1)/2, imy+imh/2+5,
   "Healthier, more self-determining remote communities: locally-owned manufacturing and a circular economy that keeps value on Country.",
   16, darken(TERRA), weight="600"))

# ------------------------------------------------------------- metrics + key
my = imy + imh + 30
S.append(text(40, my, "PRIORITY METRICS", 13, INK_MUTE, weight="700", anchor="start", spacing="1.2"))
S.append(text(40, my+22, "Status:  ● tracked (live)    ◐ partial / data thin    ○ modelled (proxy, not measured)    □ design target",
              13, INK_MUTE, anchor="start"))
metrics = [
    ("Beds delivered", "495 → 1,500 (Yr1)", "●", TEAL),
    ("Plastic diverted", "~2,640 kg → 30 t", "◐", SAGE),
    ("Communities reached", "9 → 12", "●", CLAY),
    ("Consent-led stories", "12 → 50", "●", GOLD),
    ("Community-ownership test", "0/4 → 4/4 at month 6", "□", TERRA),
]
mgap = 14
mw = (1600 - mgap*(len(metrics)-1)) / len(metrics)
mrow_y = my + 38
for i, (lab, val, glyph, color) in enumerate(metrics):
    x = 40 + i*(mw+mgap)
    S.append(rrect(x, mrow_y, mw, 58, 12, tint(color, 0.10), stroke=color, sw=1.3))
    S.append(text(x+14, mrow_y+23, lab, 12.5, darken(color), weight="700", anchor="start"))
    S.append(text(x+mw-12, mrow_y+23, glyph, 13, darken(color), anchor="end"))
    S.append(text(x+14, mrow_y+44, val, 14.5, INK, weight="600", anchor="start"))

# ------------------------------------------------------------------- footer
fy = mrow_y + 58 + 36
S.append(f'<line x1="40" y1="{fy-18}" x2="1640" y2="{fy-18}" stroke="{HAIR}" stroke-width="1"/>')
S.append(text(W/2, fy+4,
   "The model: community leads the design. Goods supports the building. Production transfers to community ownership.",
   17, INK, family=SERIF))
S.append(text(W/2, fy+28, "Sources: SIH Diagnostic V4 · QBE Catalysing Impact · impact-model.ts · asset register (2026-05-26). Outcomes shown are intended; see the MEL doc for what is tracked vs modelled.",
              12, INK_MUTE, italic=True, family=SERIF))

S.append("</svg>")

out = Path(__file__).resolve().parent.parent / "v2" / "public" / "theory-of-change.svg"
out.write_text("\n".join(S))
print(f"wrote {out} ({out.stat().st_size} bytes)")
