#!/usr/bin/env python3
"""
Goods on Country — operating model + entity structure (SVG).

The confirmed trading/charity/community structure that the QBE and SIH packs
need to show plainly:
  - A Curious Tractor Pty Ltd, trading as Goods on Country = the trading and
    operating company (design, manufacturing systems, training, logistics,
    sales, back-office). Sole-trader Nicholas Marchesi is the current operating
    entity during migration.
  - The Butterfly Movement Ltd (ACNC, Item 1 DGR) = the charity / DGR home,
    operational from FY2026-27, stewards philanthropic capital.
  - Community-led production entities = Aboriginal-owned local production
    On-Country (jobs, repair, ownership).
  - Funders / philanthropy flow into Butterfly; institutional buyers flow into
    the trading company.

Style mirrors scripts/generate_theory_of_change.py (same palette, fonts,
helpers, SVG -> PNG/PDF via rsvg-convert).
Output:     v2/public/operating-model.svg  (+ png/pdf via rsvg-convert)
Regenerate: python3 scripts/generate_goods_operating_model.py
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

# directional connector with an arrowhead at (x2,y2)
def connector(x1, y1, x2, y2, color, sw=2.6, dash=False):
    import math
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

def flow_label(x, y, s, color, anchor="middle"):
    pad = 7
    w = len(s) * 6.6 + pad*2
    out = [f'<rect x="{x - (w/2 if anchor=="middle" else 0):.1f}" y="{y-12}" width="{w:.1f}" height="20" rx="10" fill="{BG}" stroke="{color}" stroke-width="1.1"/>']
    lx = x if anchor == "middle" else x + w/2
    out.append(text(lx, y+3, s, 11.5, darken(color), weight="600"))
    return "".join(out)

# --------------------------------------------------------------------- canvas
W, H = 1680, 1180
S = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{SANS}">']
S.append(f'''<defs><filter id="sh" x="-8%" y="-8%" width="116%" height="124%">
<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#5A4A38" flood-opacity="0.10"/></filter></defs>''')
S.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')

# ------------------------------------------------------------------- header
S.append(text(W/2, 70, "Goods on Country: operating model", 50, INK, family=SERIF, weight="700"))
S.append(text(W/2, 106, "How philanthropy, product revenue and community ownership move through the confirmed entity structure.",
              20, INK_MUTE, family=SERIF, italic=True))

# legend strip (flow types)
lx, ly, lw, lh = 40, 138, 1600, 50
S.append(rrect(lx, ly, lw, lh, 14, tint(SAND, 0.5), stroke=HAIR, sw=1.3))
S.append(text(lx+26, ly+lh/2+5, "TWO CAPITAL STREAMS", 14, INK_MUTE, weight="700", anchor="start", spacing="1.2"))
# philanthropy swatch
S.append(f'<line x1="{lx+330}" y1="{ly+lh/2}" x2="{lx+372}" y2="{ly+lh/2}" stroke="{GOLD}" stroke-width="3" stroke-linecap="round"/>')
S.append(text(lx+382, ly+lh/2+5, "Philanthropic capital  ->  Butterfly DGR  ->  funds the fixed block", 14, INK, anchor="start"))
# commercial swatch
S.append(f'<line x1="{lx+1010}" y1="{ly+lh/2}" x2="{lx+1052}" y2="{ly+lh/2}" stroke="{TEAL}" stroke-width="3" stroke-linecap="round"/>')
S.append(text(lx+1062, ly+lh/2+5, "Product revenue  ->  trading company  ->  pays the per-bed cost", 14, INK, anchor="start"))

# ============================================================= node geometry
# Three columns: SOURCES (left) | ENTITIES (centre) | OUTCOME (right)
# Sources stacked left, entities stacked centre, community + ownership right.

def card(x, y, w, h, color, title, subtitle, body_lines, tag=None, fill="#FFFFFF",
         title_size=20, accent_top=True):
    out = []
    out.append(rrect(x, y, w, h, 16, fill, stroke=color, sw=1.8, shadow=True))
    if accent_top:
        out.append(rrect(x, y, w, 8, 16, color))
        out.append(rrect(x, y+4, w, 6, 0, color))
    ty = y + (34 if accent_top else 30)
    out.append(text(x+w/2, ty, title, title_size, INK, family=SERIF, weight="700"))
    if subtitle:
        out.append(text(x+w/2, ty+20, subtitle, 12.5, INK_MUTE, italic=True))
        ty += 20
    by = ty + 24
    for bl in body_lines:
        lines = wrap(bl, int((w-30)/6.5))
        out.append(mtext(x+w/2, by, lines, 13, INK, 16))
        by += 16*len(lines) + 6
    if tag:
        out.append(rrect(x+w/2-tag[1]/2, y+h-30, tag[1], 21, 10, tint(color, 0.16), stroke=color, sw=1.1))
        out.append(text(x+w/2, y+h-15, tag[0], 11.5, darken(color), weight="700"))
    return "".join(out)

# --- column anchors
LX = 60          # sources column left
LW = 360         # sources width
CXc = 690        # centre column left
CWc = 470        # centre width
RX = 1280        # right column left
RW = 340         # right width

# ----------------------------------------------------- SOURCES (left column)
# Funders / philanthropy
fund_y, fund_h = 250, 150
S.append(card(LX, fund_y, LW, fund_h, GOLD,
    "Funders & philanthropy", "Foundations, donors, catalytic capital",
    ["QBE Catalysing Impact match, grants, gifts, and patient capital seeking a clean DGR pathway.",
     "Needs a deductible, accountable home."]))

# Institutional buyers
buy_y, buy_h = 250 + fund_h + 60, 150
S.append(card(LX, buy_y, LW, buy_h, TEAL,
    "Institutional buyers", "Councils, health, community orgs, corporates",
    ["Purchase Stretch Beds and washing machines at the shop price (AU$750/bed).",
     "Some buyers are donor-funded; the order still flows as product revenue."]))

# ----------------------------------------------------- ENTITIES (centre)
# Butterfly (top centre)
but_y, but_h = 238, 196
S.append(card(CXc, but_y, CWc, but_h, GOLD,
    "The Butterfly Movement Ltd", "Charity / DGR home  ·  operational from FY2026-27",
    ["ACNC-registered charity with Item 1 DGR status.",
     "Receives and stewards philanthropic capital; funds the on-Country plant, training, and the annual fixed block.",
     "Closes the SIH-flagged DGR and scale-up-advisor gap."],
    tag=("ACNC  ·  Item 1 DGR", 170)))

# Trading company (mid centre)
trade_y, trade_h = but_y + but_h + 64, 230
S.append(card(CXc, trade_y, CWc, trade_h, TERRA,
    "A Curious Tractor Pty Ltd", "trading as Goods on Country  ·  the trading & operating company",
    ["ABN 36 697 347 676  ·  ACN 697 347 676.",
     "Holds product design, manufacturing systems, training, logistics, sales, and back-office.",
     "Takes product revenue from buyers; provides systems, training, and tooling to community production.",
     "Migration note: Nicholas Marchesi sole trader (ABN 21 591 780 066) is the current operating entity during the move."],
    tag=("Trading / operating co", 180)))

# ----------------------------------------------------- COMMUNITY (right)
comm_y, comm_h = 300, 196
S.append(card(RX, comm_y, RW, comm_h, SAGE,
    "Community-led production", "Aboriginal-owned, On-Country",
    ["Local entities run collection, pressing, assembly, and repair.",
     "Receive systems, training, and tooling from the trading company.",
     "Build jobs, capability, and ownership where the beds are used."]))

# Ownership outcome (right, below community)
own_y, own_h = comm_y + comm_h + 64, 150
S.append(card(RX, own_y, RW, own_h, CLAY,
    "Ownership & jobs On-Country", "the destination",
    ["Production capability and value stay in community.",
     "The long-term aim: community-owned plants, with Goods stepping back."],
    title_size=18))

# ===================================================================== flows
# 1. Philanthropy -> Butterfly  (gold)
S.append(connector(LX+LW, fund_y+fund_h/2, CXc, but_y+but_h*0.42, GOLD))
S.append(flow_label((LX+LW+CXc)/2, fund_y+fund_h/2-14, "gives", GOLD))

# 2. Buyers -> Trading co (teal)
S.append(connector(LX+LW, buy_y+buy_h/2, CXc, trade_y+trade_h*0.45, TEAL))
S.append(flow_label((LX+LW+CXc)/2 - 10, buy_y+buy_h/2+24, "product revenue (AU$750/bed)", TEAL))

# 3. Butterfly -> Trading co : funds plant / training / fixed block (gold, dashed grant)
bx = CXc + CWc/2
S.append(connector(bx, but_y+but_h, bx, trade_y, GOLD, sw=2.4, dash=True))
S.append(flow_label(bx, (but_y+but_h+trade_y)/2 + 2, "funds plant, training & fixed block", GOLD))

# 4. Trading co -> Community : systems / training / tooling (terra)
S.append(connector(CXc+CWc, trade_y+trade_h*0.35, RX, comm_y+comm_h*0.55, TERRA))
S.append(flow_label((CXc+CWc+RX)/2 + 6, trade_y+trade_h*0.35 - 30, "systems, training, tooling", TERRA))

# 5. Community -> Ownership/jobs (sage, downward within right column)
cx = RX + RW/2
S.append(connector(cx, comm_y+comm_h, cx, own_y, SAGE, sw=2.4))
S.append(flow_label(cx, (comm_y+comm_h+own_y)/2 + 2, "ownership & jobs", SAGE))

# 6. Community -> Trading co : finished product / register (return loop, sage dashed up-left)
S.append(connector(RX, comm_y+comm_h*0.30, CXc+CWc, trade_y+trade_h*0.12, SAGE, sw=2.0, dash=True))
S.append(flow_label((CXc+CWc+RX)/2 + 6, trade_y+trade_h*0.12 - 16, "finished beds + tracked register", SAGE))

# ------------------------------------------------------- mission-lock band
mly = own_y + own_h + 46
S.append(rrect(60, mly, 1560, 58, 14, tint(CLAY), stroke=CLAY, sw=1.5))
S.append(text(86, mly+25, "THE MODEL", 14, darken(CLAY), weight="700", anchor="start", spacing="1.4"))
S.append(text(86, mly+44, "Community leads the design. Goods supports the building. Production transfers to community ownership.",
              15, INK, anchor="start"))
S.append(text(1594, mly+34, "Two streams, one purpose.", 14, darken(CLAY), italic=True, family=SERIF, anchor="end"))

# ------------------------------------------------------------------- footer
fy = mly + 58 + 40
S.append(f'<line x1="60" y1="{fy-20}" x2="1620" y2="{fy-20}" stroke="{HAIR}" stroke-width="1"/>')
S.append(text(60, fy,
   "A Kind Tractor Ltd is dormant and not used as the Goods vehicle. The Goods-specific entity boundary is still being settled with legal advice.",
   12.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))
S.append(text(60, fy+22,
   "Sources: wiki/articles/enterprise/09-legal-structure.md  ·  Butterfly Movement transition (May 2026)  ·  ACT core facts. Structure shown is the confirmed direction; the Goods carve-out is in progress.",
   12, INK_MUTE, italic=True, family=SERIF, anchor="start"))

S.append("</svg>")

out = Path(__file__).resolve().parent.parent / "v2" / "public" / "operating-model.svg"
out.write_text("\n".join(S))
print(f"wrote {out} ({out.stat().st_size} bytes)")
