#!/usr/bin/env python3
"""
ePrint Online variable-data sticker pack.

Produces a 107-page PDF (one 50mm × 50mm sticker per page, with 3mm bleed)
ready to upload to eprintonline.com.au under:
  QR Code Table Stickers (Vinyl) — Polymeric Vinyl, 8-colour UV inks,
  Kiss Cut, Kiss-Cut Individually (Easy Peel), Variations = 107.

Also writes a CSV manifest with row_number, asset_id, qr_url
in case ePrint prefer the dataset-upload variable-data path.

Run:
  python3 scripts/generate_batch_eprint_variable.py
  python3 scripts/generate_batch_eprint_variable.py --style cream
  python3 scripts/generate_batch_eprint_variable.py --style charcoal
  python3 scripts/generate_batch_eprint_variable.py --style pink
  python3 scripts/generate_batch_eprint_variable.py --batch 156 --count 107 --size 50
"""

from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path

from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

REPO = Path(__file__).resolve().parent.parent

# Goods brand palette (from v2/src/lib/data/content.ts mediaPack.brandColors)
HEX_CREAM = "#FDF8F3"
HEX_SAGE = "#8B9D77"
HEX_RUST = "#C45C3E"
HEX_CHARCOAL = "#2E2E2E"


def hx(h: str) -> tuple[float, float, float]:
    h = h.lstrip("#")
    return (int(h[0:2], 16) / 255, int(h[2:4], 16) / 255, int(h[4:6], 16) / 255)


CREAM = hx(HEX_CREAM)
SAGE = hx(HEX_SAGE)
RUST = hx(HEX_RUST)
CHARCOAL = hx(HEX_CHARCOAL)
BLACK = (0, 0, 0)
WHITE = (1, 1, 1)
PINK = (1, 0.5, 0.7)  # legacy placeholder, kept for --style pink

SITE = "https://www.goodsoncountry.com"

BLEED_MM = 3
SAFE_INSET_MM = 3

# Use a serif for the wordmark (matches Georgia on the website)
WORDMARK_FONT = "Times-Bold"
LABEL_FONT = "Helvetica-Bold"
FOOTER_FONT = "Helvetica"


def style_palette(style: str) -> dict:
    if style == "charcoal":
        return dict(bg=CHARCOAL, accent=RUST, wordmark=CREAM, label=CREAM, footer=CREAM,
                    qr_backing=WHITE, qr_module=BLACK)
    if style == "pink":
        return dict(bg=PINK, accent=CHARCOAL, wordmark=CHARCOAL, label=CHARCOAL, footer=CHARCOAL,
                    qr_backing=WHITE, qr_module=BLACK)
    # default: cream
    return dict(bg=CREAM, accent=RUST, wordmark=CHARCOAL, label=CHARCOAL, footer=CHARCOAL,
                qr_backing=WHITE, qr_module=BLACK)


def draw_sticker_page(pdf: canvas.Canvas, qr_path: Path, asset_id: str,
                      trim_mm: float, bleed_mm: float, safe_mm: float,
                      pal: dict) -> None:
    """One full-bleed sticker page.

    Layout (inside the safe zone):
      - thin Rust accent rule across the top
      - 'Goods.' serif wordmark beneath it
      - white-backed QR (centred, dominant element)
      - asset ID (tracked caps)
      - tiny goodsoncountry.com footer
    """
    page_mm = trim_mm + 2 * bleed_mm
    page_pt = page_mm * mm

    # Full-bleed background
    pdf.setFillColorRGB(*pal["bg"])
    pdf.rect(0, 0, page_pt, page_pt, fill=1, stroke=0)

    safe_origin = (bleed_mm + safe_mm) * mm
    safe_size = (trim_mm - 2 * safe_mm) * mm

    pad = safe_size * 0.025

    # Top accent rule
    rule_h = safe_size * 0.012
    rule_y = safe_origin + safe_size - rule_h
    pdf.setFillColorRGB(*pal["accent"])
    pdf.rect(safe_origin, rule_y, safe_size, rule_h, fill=1, stroke=0)

    # Wordmark
    wordmark_h = safe_size * 0.16
    wordmark_font = wordmark_h * 0.95
    pdf.setFillColorRGB(*pal["wordmark"])
    pdf.setFont(WORDMARK_FONT, wordmark_font)
    wm_text = "Goods."
    wm_w = pdf.stringWidth(wm_text, WORDMARK_FONT, wordmark_font)
    wm_x = safe_origin + (safe_size - wm_w) / 2
    wm_y = rule_y - pad - wordmark_font
    pdf.drawString(wm_x, wm_y, wm_text)

    # Footer (small goodsoncountry.com line, reserved at bottom)
    footer_h = safe_size * 0.06
    footer_font = footer_h * 0.55
    label_h = safe_size * 0.11

    # QR area fills the remaining vertical space
    available_top = wm_y
    available_bottom = safe_origin + footer_h + pad + label_h + pad
    qr_size = min(safe_size * 0.78, available_top - available_bottom - 2 * pad)

    # White QR backing
    backing_x = safe_origin + (safe_size - qr_size) / 2
    backing_y = available_top - pad - qr_size
    pdf.setFillColorRGB(*pal["qr_backing"])
    pdf.setStrokeColorRGB(*pal["qr_backing"])
    pdf.setLineWidth(0)
    pdf.rect(backing_x, backing_y, qr_size, qr_size, fill=1, stroke=0)
    try:
        pdf.drawImage(str(qr_path), backing_x, backing_y,
                      width=qr_size, height=qr_size, preserveAspectRatio=True)
    except Exception:
        pdf.setFillColorRGB(*BLACK)
        pdf.rect(backing_x, backing_y, qr_size, qr_size, fill=1)

    # Asset ID (tracked uppercase)
    label_font = label_h * 0.72
    pdf.setFillColorRGB(*pal["label"])
    pdf.setFont(LABEL_FONT, label_font)
    label_text = asset_id.upper()
    # manual tracking: render char by char with extra spacing
    track_em = 0.08
    char_widths = [pdf.stringWidth(c, LABEL_FONT, label_font) for c in label_text]
    extra = label_font * track_em
    total_w = sum(char_widths) + extra * (len(label_text) - 1)
    cx = safe_origin + (safe_size - total_w) / 2
    label_y = backing_y - pad - label_font
    for c, w in zip(label_text, char_widths):
        pdf.drawString(cx, label_y, c)
        cx += w + extra

    # Footer
    pdf.setFillColorRGB(*pal["footer"])
    pdf.setFont(FOOTER_FONT, footer_font)
    foot_text = "goodsoncountry.com"
    foot_w = pdf.stringWidth(foot_text, FOOTER_FONT, footer_font)
    foot_x = safe_origin + (safe_size - foot_w) / 2
    foot_y = safe_origin + footer_h * 0.4
    pdf.drawString(foot_x, foot_y, foot_text)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", default="156")
    ap.add_argument("--count", type=int, default=107)
    ap.add_argument("--size", type=float, default=50.0, help="Sticker trim size in mm (default 50)")
    ap.add_argument("--bleed", type=float, default=BLEED_MM, help="Bleed in mm (default 3)")
    ap.add_argument("--style", default="cream", choices=["cream", "charcoal", "pink"],
                    help="Visual style. cream=brand default (cream bg, rust accent, charcoal type). "
                         "charcoal=dark high-contrast. pink=legacy placeholder.")
    args = ap.parse_args()

    batch = args.batch
    count = args.count
    trim_mm = args.size
    bleed_mm = args.bleed
    style = args.style
    pal = style_palette(style)

    qr_dir = REPO / "data" / "new_beds" / f"batch_{batch}" / "qr_png"
    out_dir = REPO / "data" / "new_beds" / f"batch_{batch}"
    suffix = "" if style == "cream" else f"_{style}"
    out_pdf = out_dir / f"Goods_Batch{batch}_ePrint_VariableData{suffix}.pdf"
    out_csv = out_dir / f"Goods_Batch{batch}_ePrint_dataset.csv"
    out_spec = out_dir / f"Goods_Batch{batch}_ePrint_print_brief.txt"

    if not qr_dir.exists():
        sys.exit(f"ERROR: QR PNG dir not found: {qr_dir}")

    page_mm = trim_mm + 2 * bleed_mm
    page_pt = page_mm * mm

    pdf = canvas.Canvas(str(out_pdf), pagesize=(page_pt, page_pt))
    pdf.setTitle(f"Goods Batch {batch} — ePrint variable-data sticker pack ({style})")
    pdf.setAuthor("Goods Asset Tracker")
    pdf.setSubject(f"{count} unique 50mm vinyl kiss-cut stickers, one per page ({style} style)")
    pdf.setKeywords("vinyl, kiss-cut, QR, variable data, eprint, 50mm")

    rows = []
    for i in range(count):
        n = i + 1
        asset_id = f"GB0-{batch}-{n}"
        qr_url = f"{SITE}/bed/{asset_id}"
        qr_path = qr_dir / f"qr_{asset_id}.png"
        if not qr_path.exists():
            print(f"  ! missing {qr_path.name}, skipping")
            continue
        if i > 0:
            pdf.showPage()
        draw_sticker_page(pdf, qr_path, asset_id, trim_mm, bleed_mm, SAFE_INSET_MM, pal)
        rows.append({"row_number": n, "asset_id": asset_id, "qr_url": qr_url})

    pdf.save()

    with out_csv.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["row_number", "asset_id", "qr_url"])
        w.writeheader()
        for r in rows:
            w.writerow(r)

    brief = f"""ePrint Online — order brief for batch GB0-{batch}

Product:        QR Code Table Stickers (Vinyl)  (under: Signage & Banners > QR Code Printing)
Size:           {trim_mm:.0f}mm × {trim_mm:.0f}mm
Quantity:       {count} stickers
Variations:     {count}   (set this to {count} — each sticker is a unique design)
Stock:          Polymeric Vinyl - Standard
Print Process:  8 COLOUR UV INKS
Laminating:     No
Shape:          Rectangle
Cut & Supply:   Kiss Cut, Kiss-Cut Individually (Easy Peel)
Weeding:        No
File correct?:  Yes — supplied print-ready with 3mm bleed

File to upload: {out_pdf.name}
  - {count}-page PDF, each page is {page_mm:.0f}mm × {page_mm:.0f}mm
  - {trim_mm:.0f}mm × {trim_mm:.0f}mm trim + {bleed_mm:.0f}mm bleed all sides
  - Style: {style}
  - Brand palette from v2/src/lib/data/content.ts (Cream/Sage/Rust/Charcoal)

Variable data fallback:
  If ePrint prefer a dataset + template path instead of the multi-page PDF,
  send the same PDF as the visual template AND attach the CSV:
    {out_csv.name}
  Columns: row_number, asset_id, qr_url

What it's for:
  Peel-and-stick vinyl QR labels for the HDPE legs of Stretch Beds in the
  GB0-{batch} batch. Each QR resolves to https://www.goodsoncountry.com/bed/GB0-{batch}-N
  which renders a product-aware Stretch Bed landing page (journey, story,
  support link). Asset records are live in our Supabase asset register.
"""
    out_spec.write_text(brief)

    print(f"Batch GB0-{batch} ({style}): {len(rows)} stickers written")
    print(f"  PDF:    {out_pdf.relative_to(REPO)}  ({out_pdf.stat().st_size / 1024 / 1024:.1f} MB)")
    print(f"  CSV:    {out_csv.relative_to(REPO)}")
    print(f"  Brief:  {out_spec.relative_to(REPO)}")


if __name__ == "__main__":
    main()
