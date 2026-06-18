#!/usr/bin/env python3
"""
Goods on Country — Theory of Change as a results-chain logic model (SVG).

Conforms to the canonical impact model (wiki/outputs/2026-06-18-goods-impact-
framework.md) and answers the SIH Diagnostic V4 / QBE Catalysing Impact feedback:
  - explicit logic chain: inputs -> activities -> outputs -> outcomes -> impact
  - OUTCOMES = the five canonical domains (rest & health; dignity & safety;
    self-determination; jobs & ownership; circular & local economy)
  - IMPACT = the three shifts (material, economic, story)
  - claim ceiling stated on the image: scabies->RHD is the why, never claimed
  - numbers are canon (v2/src/lib/data/asset-canonical.ts): 496 / 9 / 16 / 2,660kg
  - honest status flags: tracked / partial / modelled / design-target
  - the community-led operating cycle kept as the "Activities" band

Companion doc: wiki/outputs/2026-06-18-goods-impact-framework.md
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

# =================================================================== OUTCOMES (five domains)
ocy, och = oy+oh+26, 300
S.append(rail(ocy, och, "OUTCOMES", GOLD))
S.append(text(CX0, ocy+4, "FIVE OUTCOME DOMAINS  ·  each carried by cleared voices, anchored to a canon number",
              13, darken(GOLD), weight="700", anchor="start", spacing="0.6"))

def dom_card(x, y, w, h, name, color, claim, anchor):
    out = [rrect(x, y, w, h, 13, "#FFFFFF", stroke=color, sw=1.5, shadow=True)]
    out.append(rrect(x, y, w, 30, 13, color))
    out.append(rrect(x, y+16, w, 14, 0, color))  # square off header bottom
    out.append(text(x+w/2, y+20, name, 13.5, "#FFFFFF", weight="700"))
    lines = wrap(claim, int((w-26)/6.2))
    out.append(mtext(x+w/2, y+52, lines, 12.5, INK, 16))
    ay = y + h - 34
    out.append(f'<line x1="{x+12}" y1="{ay-15}" x2="{x+w-12}" y2="{ay-15}" stroke="{color}" stroke-width="1" opacity="0.45"/>')
    aln = wrap(anchor, int((w-22)/5.8))
    out.append(mtext(x+w/2, ay, aln, 12, darken(color), 14, weight="700"))
    return "".join(out)

domains = [
    ("Rest & health", CLAY,
     "Off-the-ground, washable sleep: why a bed and a washer are health hardware, not furniture.",
     "496 beds · 9 communities"),
    ("Dignity & safety", TERRA,
     "A bed is safety and belonging. The freight tax is why a basic good is out of reach. A need, not charity.",
     "9 communities served"),
    ("Self-determination", TEAL,
     "Designed in community, owned by them. 'Never been asked' becomes 'named it, tested it, built what they asked for'.",
     "Pakkimjalki Kari, named in Warumungu"),
    ("Jobs & ownership", GOLD,
     "The making moves On Country. Young people build the product and, in time, hold the work and the ownership.",
     "16 washers in community · 50-bed run (target)"),
    ("Circular & local economy", SAGE,
     "Plastic becomes beds On Country. Value and capability stay local, toward an enterprise that funds itself.",
     "2,660kg diverted (20kg/bed, modelled)"),
]
dgap = 16
dcw = (CXW - dgap*4) / 5
dy = ocy + 16
dh = och - 52
for i, (name, color, claim, anchor) in enumerate(domains):
    x = CX0 + i*(dcw+dgap)
    S.append(dom_card(x, dy, dcw, dh, name, color, claim, anchor))
# the claim ceiling, stated on the image
S.append(text(CX0, ocy+och-8,
   "Claim ceiling: the scabies to rheumatic heart disease pathway is our why, never a claimed outcome. A health outcome is claimed only when a partner clinical method (Miwatj) produces it, attributed to them.",
   12, INK_MUTE, italic=True, anchor="start", family=SERIF))
S.append(arrow_down(midx, ocy+och, ocy+och+26))

# ===================================================================== IMPACT (the three shifts)
imy, imh = ocy+och+26, 134
S.append(rail(imy, imh, "THE 3 SHIFTS", TERRA))
shifts = [
    ("Material shift", SAGE,
     "Waste plastic becomes a durable, washable, repairable good, made On Country."),
    ("Economic shift", GOLD,
     "Built to beat the true remote cost, not the sticker price. Value, jobs and the making stay local, moving from grant-funded toward community ownership."),
    ("Story shift", TEAL,
     "Communities name it, design it, and own the record of it, on their terms. Indigenous self-determination."),
]
sgap = 18
scw = (CXW - sgap*2) / 3
sh = 86
sy = imy + 12
for i, (name, color, body) in enumerate(shifts):
    x = CX0 + i*(scw+sgap)
    S.append(rrect(x, sy, scw, sh, 13, tint(color, 0.12), stroke=color, sw=1.5, shadow=True))
    S.append(text(x+16, sy+25, name, 15, darken(color), weight="700", anchor="start"))
    blines = wrap(body, int((scw-32)/6.4))
    S.append(mtext(x+scw/2, sy+46, blines, 12.5, INK, 15))
S.append(text(midx, imy+imh-10,
   "Healthier, more self-determining communities, with locally-owned production and a circular economy that keeps value on Country.",
   15, darken(TERRA), weight="600", family=SERIF, italic=True))

# ------------------------------------------------------------- metrics + key
my = imy + imh + 30
S.append(text(40, my, "PRIORITY METRICS", 13, INK_MUTE, weight="700", anchor="start", spacing="1.2"))
S.append(text(40, my+22, "Status:  ● tracked (live)    ◐ partial / data thin    ○ modelled (proxy, not measured)    □ design target",
              13, INK_MUTE, anchor="start"))
metrics = [
    ("Beds delivered", "496 → 1,500 (Yr1)", "●", TEAL),
    ("Plastic diverted", "2,660 kg → 30 t", "○", SAGE),
    ("Communities reached", "9 → 12", "●", CLAY),
    ("Washers in community", "16", "●", GOLD),
    ("Community-owned production", "0/4 → 4/4 at month 6", "□", TERRA),
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
S.append(text(W/2, fy+28, "Sources: canonical impact model (2026-06-18) · asset-canonical.ts (496 beds / 9 communities / 16 washers / 2,660kg) · SIH Diagnostic V4 · QBE Catalysing Impact. Labels mark what is verified, modelled, or future.",
              12, INK_MUTE, italic=True, family=SERIF))

S.append("</svg>")

out = Path(__file__).resolve().parent.parent / "v2" / "public" / "theory-of-change.svg"
out.write_text("\n".join(S))
print(f"wrote {out} ({out.stat().st_size} bytes)")
