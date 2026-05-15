#!/usr/bin/env python3
"""
Parameterised DTF gang-sheet generator.

Defaults to batch GB0-156 (107 stretch beds) — one continuous 58cm-wide DTF sheet
with 5 columns × ~22 rows of "Goods. + QR + ID" units on a pink background, ready
to upload to dtfdirect.com.au or similar.

Run:
  python3 scripts/generate_batch_dtf_gangsheet.py
  python3 scripts/generate_batch_dtf_gangsheet.py --batch 157 --cols 6
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

REPO = Path(__file__).resolve().parent.parent

# ---- Sheet dimensions (DTF roll) ----------------------------------------
SHEET_WIDTH_MM = 580  # 58cm — standard DTF roll width

# ---- Unit (per-bed sticker) dimensions ---------------------------------
QR_SIZE_MM = 60                  # 60mm × 60mm QR code
WHITE_BACKING_MM = 62            # white square underneath the QR
LABEL_FONT_SIZE = 16             # asset id label (e.g. GB0-156-42)
LOGO_FONT_SIZE = 24              # "Goods." wordmark
LOGO_Y_OFFSET_MM = 8             # gap between logo and white backing
LABEL_Y_OFFSET_MM = 8            # gap between white backing and label
BG_PADDING_MM = 5                # pink background extra padding around unit
COLUMN_GAP_MM = 12               # horizontal gap between units
ROW_GAP_MM = 12                  # vertical gap between rows
PAGE_MARGIN_MM = 12              # margin inside the gang sheet

COLOR_BLACK = (0, 0, 0)
COLOR_WHITE = (1, 1, 1)
COLOR_PINK = (1, 0.5, 0.7)        # Goods brand pink — pops on dark fabric


def compute_unit_height_pt() -> float:
    """Total per-unit height in points (logo + QR backing + label + bg padding)."""
    return (
        (LOGO_FONT_SIZE * 1.5)
        + (LOGO_Y_OFFSET_MM * mm)
        + (WHITE_BACKING_MM * mm)
        + (LABEL_Y_OFFSET_MM * mm)
        + (LABEL_FONT_SIZE * 2)
        + (BG_PADDING_MM * 2 * mm)
    )


def compute_unit_width_pt() -> float:
    return (WHITE_BACKING_MM + 2 * BG_PADDING_MM) * mm


def draw_unit(pdf: canvas.Canvas, qr_path: Path, x_pt: float, y_top_pt: float, asset_id: str) -> None:
    """Draw a single bed sticker — pink bg, Goods. wordmark, QR, asset ID."""
    unit_w = compute_unit_width_pt()
    unit_h = compute_unit_height_pt()

    # Pink background rectangle
    pdf.setFillColorRGB(*COLOR_PINK)
    pdf.setStrokeColorRGB(*COLOR_BLACK)
    pdf.setLineWidth(0.5)
    pdf.rect(x_pt, y_top_pt - unit_h, unit_w, unit_h, fill=1, stroke=1)

    inner_x = x_pt + BG_PADDING_MM * mm

    # Goods. logo
    pdf.setFillColorRGB(*COLOR_BLACK)
    pdf.setFont("Helvetica-Bold", LOGO_FONT_SIZE)
    logo_text = "Goods."
    logo_w = pdf.stringWidth(logo_text, "Helvetica-Bold", LOGO_FONT_SIZE)
    logo_x = inner_x + (WHITE_BACKING_MM * mm - logo_w) / 2
    logo_y = y_top_pt - BG_PADDING_MM * mm - LOGO_FONT_SIZE
    pdf.drawString(logo_x, logo_y, logo_text)

    # White backing for QR
    backing_y = logo_y - LOGO_Y_OFFSET_MM * mm - WHITE_BACKING_MM * mm
    pdf.setFillColorRGB(*COLOR_WHITE)
    pdf.setLineWidth(1)
    pdf.rect(inner_x, backing_y, WHITE_BACKING_MM * mm, WHITE_BACKING_MM * mm, fill=1, stroke=1)

    # QR code (centred on white backing)
    qr_offset = (WHITE_BACKING_MM - QR_SIZE_MM) / 2 * mm
    qr_x = inner_x + qr_offset
    qr_y = backing_y + qr_offset
    try:
        pdf.drawImage(
            str(qr_path),
            qr_x,
            qr_y,
            width=QR_SIZE_MM * mm,
            height=QR_SIZE_MM * mm,
            preserveAspectRatio=True,
        )
    except Exception:
        pdf.setFillColorRGB(*COLOR_BLACK)
        pdf.rect(qr_x, qr_y, QR_SIZE_MM * mm, QR_SIZE_MM * mm, fill=1)

    # Asset ID label
    pdf.setFillColorRGB(*COLOR_BLACK)
    pdf.setFont("Helvetica-Bold", LABEL_FONT_SIZE)
    label_w = pdf.stringWidth(asset_id, "Helvetica-Bold", LABEL_FONT_SIZE)
    label_x = inner_x + (WHITE_BACKING_MM * mm - label_w) / 2
    label_y = backing_y - LABEL_Y_OFFSET_MM * mm - LABEL_FONT_SIZE
    pdf.drawString(label_x, label_y, asset_id)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", default="156", help="Batch number (e.g. 156)")
    ap.add_argument("--count", type=int, default=107, help="Number of beds in this batch")
    ap.add_argument("--cols", type=int, default=5, help="Columns across the sheet")
    args = ap.parse_args()

    batch = args.batch
    count = args.count
    cols = args.cols

    qr_dir = REPO / "data" / "new_beds" / f"batch_{batch}" / "qr_png"
    out_pdf = REPO / "data" / "new_beds" / f"batch_{batch}" / f"Goods_Batch{batch}_DTF_GangSheet.pdf"

    if not qr_dir.exists():
        sys.exit(f"ERROR: QR PNG dir not found: {qr_dir}\nRun scripts/generate_batch_{batch}.py first.")

    # Verify all QR files exist
    missing = [n for n in range(1, count + 1) if not (qr_dir / f"qr_GB0-{batch}-{n}.png").exists()]
    if missing:
        sys.exit(f"ERROR: missing QR PNGs for indices {missing[:5]}{'...' if len(missing) > 5 else ''}")

    # Layout maths
    unit_w_pt = compute_unit_width_pt()
    unit_h_pt = compute_unit_height_pt()

    rows = -(-count // cols)  # ceil

    sheet_w_pt = SHEET_WIDTH_MM * mm
    used_w_pt = cols * unit_w_pt + (cols - 1) * COLUMN_GAP_MM * mm
    if used_w_pt + 2 * PAGE_MARGIN_MM * mm > sheet_w_pt:
        sys.exit(f"ERROR: cols={cols} units don't fit in {SHEET_WIDTH_MM}mm width. Reduce cols.")

    sheet_h_pt = rows * unit_h_pt + (rows - 1) * ROW_GAP_MM * mm + 2 * PAGE_MARGIN_MM * mm

    print(f"Batch GB0-{batch}: {count} units, {cols} cols × {rows} rows")
    print(f"  Sheet:  {SHEET_WIDTH_MM}mm wide × {sheet_h_pt/mm:.0f}mm tall ({sheet_h_pt/mm/10:.1f}cm)")
    print(f"  Output: {out_pdf.relative_to(REPO)}")

    # Build PDF
    pdf = canvas.Canvas(str(out_pdf), pagesize=(sheet_w_pt, sheet_h_pt))
    pdf.setTitle(f"Goods Batch {batch} - DTF Gang Sheet")
    pdf.setAuthor("Goods Asset Tracker")
    pdf.setSubject(f"DTF/iron-on QR codes for {count} stretch beds")
    pdf.setKeywords(f"DTF, iron-on, QR codes, gang sheet, GB0-{batch}, 300 DPI")
    pdf.setCreator("scripts/generate_batch_dtf_gangsheet.py")

    start_x_pt = (sheet_w_pt - used_w_pt) / 2
    start_y_top_pt = sheet_h_pt - PAGE_MARGIN_MM * mm

    for i in range(count):
        row = i // cols
        col = i % cols
        x_pt = start_x_pt + col * (unit_w_pt + COLUMN_GAP_MM * mm)
        y_top_pt = start_y_top_pt - row * (unit_h_pt + ROW_GAP_MM * mm)
        asset_id = f"GB0-{batch}-{i+1}"
        qr_path = qr_dir / f"qr_{asset_id}.png"
        draw_unit(pdf, qr_path, x_pt, y_top_pt, asset_id)

    pdf.save()
    print(f"  Done: {count} units written, {out_pdf.stat().st_size / 1024 / 1024:.1f} MB")
    print()
    print("Next steps:")
    print("  1. Open PDF, eye-check the layout")
    print(f"  2. Upload to DTF Direct (dtfdirect.com.au) — order: {SHEET_WIDTH_MM/10:.0f}cm × {sheet_h_pt/mm/10:.0f}cm")
    print("     white underbase, matte finish, iron-on / heat-press transfer")
    print(f"  3. Cost estimate (~AUD): width 58cm × height {sheet_h_pt/mm/100:.1f}m = ~${(sheet_h_pt/mm/100) * 40:.0f}")


if __name__ == "__main__":
    main()
