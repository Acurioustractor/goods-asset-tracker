#!/usr/bin/env python3
"""
Goods on Country — Idiot index: where the cost-down is (SVG + PNG + PDF).

Horizontal bars, length proportional to the idiot index (paid / raw floor) per
component. The HDPE legs bar is highlighted as the capital lever; Defy panels
are muted and labelled "avoid".

EXACT figures (do not change):
  - HDPE legs   8.6x vs Defy shred floor (raw 40, paid 344) [HIGHLIGHT — the lever]
                ~21.5x vs raw-polymer floor (16 = 20kg x AU$0.80/kg recycled HDPE)
  - Defy panels 10x   (raw 40,    paid 400)   [muted — "avoid"]
  - Canvas      2.4x  (raw 38.50, paid 93.50)
  - Steel       2.1x  (raw 12.67, paid 27)
  - Hardware    ~1x
  Callout: "HDPE legs = the capital case: in-sourcing the legs captures
            ~289/bed of supplier margin (in-house legs ~150/bed)".

Style mirrors scripts/generate_goods_cost_model_diagram.py (same palette, fonts,
helpers, SVG -> PNG/PDF via rsvg-convert).
Output:     v2/public/goods-idiot-index.{svg,png,pdf}
Regenerate: python3 scripts/generate_goods_idiot_index.py
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
RUST  = "#A8442E"   # "avoid", in-palette

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

def rrect(x, y, w, h, r, fill, stroke=None, sw=1.4, shadow=False):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    fil = ' filter="url(#sh)"' if shadow else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"{s}{fil}/>'

# --------------------------------------------------------------------- canvas
W, H = 1680, 980
S = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{SANS}">']
S.append('''<defs><filter id="sh" x="-8%" y="-8%" width="116%" height="124%">
<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#5A4A38" flood-opacity="0.10"/></filter></defs>''')
S.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')

# ------------------------------------------------------------------- header
S.append(text(W/2, 74, "Idiot index: where the cost-down is", 50, INK, family=SERIF, weight="700"))
S.append(text(W/2, 110, "Index = what we pay now / raw-material floor. A high bar is not waste; it is supplier margin we could capture by in-sourcing.",
              20, INK_MUTE, family=SERIF, italic=True))

# ------------------------------------------------------------------- bars
LX, RXn = 60, 1620
# label, index, raw, paid, color, highlight, tag
rows = [
    ("HDPE legs",   8.6, 40.00,  344.00, TERRA, True,  "THE LEVER"),
    ("Defy panels", 10.0, 40.00, 400.00, RUST,  False, "avoid"),
    ("Canvas",      2.4, 38.50,  93.50,  TEAL,  False, None),
    ("Steel",       2.1, 12.67,  27.00,  GOLD,  False, None),
    ("Hardware",    1.0, None,   None,   SAGE,  False, None),
]

bar_x = LX + 230            # bars start (after label gutter)
bar_max_w = 1000            # width for index = 10
idx_max = 10.0
row_h = 86
b0y = 180

for i, (lab, idx, raw, paid, color, hi, tag) in enumerate(rows):
    cy = b0y + i*row_h
    bar_h = 50
    by = cy + (row_h - bar_h)/2 - 8
    # component label (left gutter)
    S.append(text(LX, by + bar_h/2 + 6, lab, 19, INK, family=SERIF,
                  weight="700" if hi else "600", anchor="start"))
    # track
    S.append(rrect(bar_x, by, bar_max_w, bar_h, 9, tint(SAND, 0.6)))
    # bar
    bw = bar_max_w * (idx/idx_max)
    use_color = color if (hi or color != RUST) else RUST
    opacity_wrap_open = ''
    opacity_wrap_close = ''
    if color == RUST and not hi:
        # muted "avoid" bar
        opacity_wrap_open = '<g opacity="0.55">'
        opacity_wrap_close = '</g>'
    S.append(opacity_wrap_open)
    S.append(rrect(bar_x, by, bw, bar_h, 9, use_color, stroke=darken(use_color), sw=1.2,
                   shadow=hi))
    S.append(opacity_wrap_close)
    # highlight ring on the lever
    if hi:
        S.append(rrect(bar_x-3, by-3, bw+6, bar_h+6, 11, "none", stroke=darken(TERRA), sw=2.6))
    # index value at bar end
    S.append(text(bar_x+bw+14, by + bar_h/2 + 7, f"{idx:g}x", 22, darken(use_color),
                  family=SERIF, weight="700", anchor="start"))
    # HDPE legs: show BOTH floors — shred price (this bar) and the raw-polymer floor
    if hi:
        S.append(text(bar_x+bw+14, by + bar_h/2 - 14, "vs shred price", 12, INK_MUTE,
                      weight="600", anchor="start"))
        S.append(text(bar_x+bw+14, by + bar_h/2 + 26, "~21.5x vs raw polymer (AU$16 floor)",
                      12.5, darken(TERRA), weight="700", anchor="start"))
    # raw -> paid annotation
    if raw is not None:
        ann = f"raw AU${raw:,.2f} to paid AU${paid:,.2f}".replace(".00", "")
    else:
        ann = "near raw rate"
    S.append(text(bar_x+12, by + bar_h/2 + 6, ann, 13.5, "#FFFFFF" if bw > 200 else INK_MUTE,
                  weight="600", anchor="start"))
    # tag chip (LEVER / avoid)
    if tag:
        chip_color = TERRA if hi else RUST
        chip_w = 96 if hi else 70
        cxr = bar_x + bw + 70
        S.append(rrect(cxr, by + bar_h/2 - 13, chip_w, 26, 13, tint(chip_color, 0.18),
                       stroke=chip_color, sw=1.3))
        S.append(text(cxr + chip_w/2, by + bar_h/2 + 5, tag, 12.5, darken(chip_color),
                      weight="700", spacing="0.8"))

# ------------------------------------------------------------------- callout box
co_y = b0y + len(rows)*row_h + 14
co_h = 96
S.append(rrect(LX, co_y, RXn-LX, co_h, 16, tint(TERRA), stroke=TERRA, sw=1.8, shadow=True))
S.append(text(LX+28, co_y+34, "THE CAPITAL CASE", 14, darken(TERRA), weight="700",
              anchor="start", spacing="1.4"))
S.append(text(LX+28, co_y+64,
   "HDPE legs = the capital case: 8.6x vs the shred price, ~21.5x vs raw polymer — ~AU$289/bed of supplier margin to capture",
   20, INK, family=SERIF, weight="700", anchor="start"))
S.append(text(LX+28, co_y+86,
   "(in-house legs ~AU$150/bed). Defy panels at 10x are the trap: you pay the press margin and still CNC and assemble.",
   14.5, INK_MUTE, anchor="start"))

# ------------------------------------------------------------------- footer
fy = co_y + co_h + 46
S.append(f'<line x1="{LX}" y1="{fy-22}" x2="{RXn}" y2="{fy-22}" stroke="{HAIR}" stroke-width="1"/>')
S.append(text(LX, fy,
   "Source: Goods cost model (2026-05). Index = paid / floor per component; HDPE legs shown vs two floors — Defy shred price (AU$40) and raw recycled-HDPE polymer (20kg x AU$0.80/kg = AU$16, Envirobank). Modelled on verified BOM inputs.",
   11.5, INK_MUTE, italic=True, family=SERIF, anchor="start"))

S.append("</svg>")

# --------------------------------------------------------------- write + render
pub = Path(__file__).resolve().parent.parent / "v2" / "public"
svg_path = pub / "goods-idiot-index.svg"
png_path = pub / "goods-idiot-index.png"
pdf_path = pub / "goods-idiot-index.pdf"
svg_path.write_text("\n".join(S))
print(f"wrote {svg_path} ({svg_path.stat().st_size} bytes)")
try:
    subprocess.run(["rsvg-convert", "-o", str(png_path), str(svg_path)], check=True)
    subprocess.run(["rsvg-convert", "-f", "pdf", "-o", str(pdf_path), str(svg_path)], check=True)
    print(f"wrote {png_path} ({png_path.stat().st_size} bytes)")
    print(f"wrote {pdf_path} ({pdf_path.stat().st_size} bytes)")
except (FileNotFoundError, subprocess.CalledProcessError) as e:
    print(f"WARNING: rsvg-convert failed ({e}); SVG written, PNG/PDF skipped.")
