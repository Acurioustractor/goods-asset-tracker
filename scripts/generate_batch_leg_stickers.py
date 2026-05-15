#!/usr/bin/env python3
"""
A4 peel-off sticker sheet generator for HDPE bed-leg labels.

Produces multi-page A4 PDF. Each page has a grid of stickers
(4 cols × 6 rows = 24 per page by default), pink background,
Goods. wordmark, QR, asset ID. Print on adhesive label paper
or send to vinyl sticker printer.

Run:
  python3 scripts/generate_batch_leg_stickers.py
  python3 scripts/generate_batch_leg_stickers.py --batch 156 --count 107
  python3 scripts/generate_batch_leg_stickers.py --size 50  # 50mm stickers (fewer per page)
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

REPO = Path(__file__).resolve().parent.parent

COLOR_BLACK = (0, 0, 0)
COLOR_WHITE = (1, 1, 1)
COLOR_PINK = (1, 0.5, 0.7)  # Goods brand pink


def draw_sticker(pdf: canvas.Canvas, qr_path: Path, x_pt: float, y_top_pt: float,
                 sticker_mm: float, asset_id: str) -> None:
    """Draw one peel-off sticker — pink bg, Goods. wordmark, QR, asset ID."""
    sticker_pt = sticker_mm * mm
    # Layout within the sticker (proportional):
    logo_height = sticker_pt * 0.16   # 16% of sticker for the "Goods." wordmark
    label_height = sticker_pt * 0.13  # 13% for the asset id label
    padding = sticker_pt * 0.05       # 5% padding around
    qr_size = sticker_pt - logo_height - label_height - 3 * padding

    # Pink rounded background
    pdf.setFillColorRGB(*COLOR_PINK)
    pdf.setStrokeColorRGB(*COLOR_BLACK)
    pdf.setLineWidth(0.4)
    radius = sticker_pt * 0.06
    pdf.roundRect(x_pt, y_top_pt - sticker_pt, sticker_pt, sticker_pt, radius, fill=1, stroke=1)

    # Goods. wordmark (top centred)
    pdf.setFillColorRGB(*COLOR_BLACK)
    logo_font_size = logo_height * 0.85
    pdf.setFont("Helvetica-Bold", logo_font_size)
    logo_text = "Goods."
    logo_w = pdf.stringWidth(logo_text, "Helvetica-Bold", logo_font_size)
    logo_x = x_pt + (sticker_pt - logo_w) / 2
    logo_y = y_top_pt - padding - logo_font_size
    pdf.drawString(logo_x, logo_y, logo_text)

    # White backing for the QR
    backing_y = logo_y - padding - qr_size
    backing_x = x_pt + (sticker_pt - qr_size) / 2
    pdf.setFillColorRGB(*COLOR_WHITE)
    pdf.setLineWidth(0.4)
    pdf.rect(backing_x, backing_y, qr_size, qr_size, fill=1, stroke=1)

    # QR code centred on the white backing
    try:
        pdf.drawImage(str(qr_path), backing_x, backing_y,
                      width=qr_size, height=qr_size, preserveAspectRatio=True)
    except Exception:
        pdf.setFillColorRGB(*COLOR_BLACK)
        pdf.rect(backing_x, backing_y, qr_size, qr_size, fill=1)

    # Asset ID label (bottom centred)
    label_font_size = label_height * 0.72
    pdf.setFillColorRGB(*COLOR_BLACK)
    pdf.setFont("Helvetica-Bold", label_font_size)
    label_w = pdf.stringWidth(asset_id, "Helvetica-Bold", label_font_size)
    label_x = x_pt + (sticker_pt - label_w) / 2
    label_y = backing_y - padding - label_font_size
    pdf.drawString(label_x, label_y, asset_id)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", default="156")
    ap.add_argument("--count", type=int, default=107)
    ap.add_argument("--size", type=float, default=45.0,
                    help="Sticker edge length in mm (default 45)")
    args = ap.parse_args()

    batch = args.batch
    count = args.count
    sticker_mm = args.size

    qr_dir = REPO / "data" / "new_beds" / f"batch_{batch}" / "qr_png"
    out_pdf = REPO / "data" / "new_beds" / f"batch_{batch}" / f"Goods_Batch{batch}_LegStickers_A4.pdf"

    if not qr_dir.exists():
        sys.exit(f"ERROR: QR PNG dir not found: {qr_dir}")

    page_w, page_h = A4
    margin_mm = 8
    gap_mm = 4

    # Compute grid that fits A4
    cols = int((page_w / mm - 2 * margin_mm + gap_mm) / (sticker_mm + gap_mm))
    rows = int((page_h / mm - 2 * margin_mm + gap_mm) / (sticker_mm + gap_mm))
    per_page = cols * rows

    if per_page < 1:
        sys.exit(f"ERROR: sticker size {sticker_mm}mm too large for A4 with {margin_mm}mm margin")

    pages = -(-count // per_page)  # ceil

    print(f"Batch GB0-{batch}: {count} stickers, {sticker_mm}mm each")
    print(f"  Layout: {cols} cols × {rows} rows = {per_page} per A4 page")
    print(f"  Pages:  {pages}")
    print(f"  Output: {out_pdf.relative_to(REPO)}")

    pdf = canvas.Canvas(str(out_pdf), pagesize=A4)
    pdf.setTitle(f"Goods Batch {batch} — Bed-leg sticker sheet")
    pdf.setAuthor("Goods Asset Tracker")
    pdf.setSubject(f"Peel-off stickers for HDPE bed legs ({count} unique QR codes)")
    pdf.setKeywords(f"sticker, A4, peel-off, HDPE, GB0-{batch}")

    # Centre the grid on the page
    grid_w_pt = (cols * sticker_mm + (cols - 1) * gap_mm) * mm
    grid_h_pt = (rows * sticker_mm + (rows - 1) * gap_mm) * mm
    start_x_pt = (page_w - grid_w_pt) / 2
    start_y_top_pt = (page_h + grid_h_pt) / 2

    for i in range(count):
        page_idx = i // per_page
        slot = i % per_page
        if i > 0 and slot == 0:
            pdf.showPage()

        col = slot % cols
        row = slot // cols
        x_pt = start_x_pt + col * (sticker_mm + gap_mm) * mm
        y_top_pt = start_y_top_pt - row * (sticker_mm + gap_mm) * mm

        asset_id = f"GB0-{batch}-{i+1}"
        qr_path = qr_dir / f"qr_{asset_id}.png"
        if not qr_path.exists():
            print(f"  ! missing {qr_path.name}, skipping")
            continue
        draw_sticker(pdf, qr_path, x_pt, y_top_pt, sticker_mm, asset_id)

    pdf.save()
    print(f"  Done: {count} stickers across {pages} pages, {out_pdf.stat().st_size / 1024 / 1024:.1f} MB")
    print()
    print("Print options:")
    print("  - Avery L7159 / L7160 style adhesive label paper, full sheet")
    print("    (you'll cut along the printed sticker edges)")
    print("  - OR send to a local print shop, print on vinyl with adhesive backing")
    print("  - OR send to vistaprint/stickerapp.com.au as a 'sticker sheet' order")


if __name__ == "__main__":
    main()
