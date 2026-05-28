#!/usr/bin/env python3
"""
QR sticker sheets aligned to standard Avery A4 label templates.

Print on pre-cut adhesive sticker sheets from any normal office printer.
Each sticker has the QR code + asset ID below it. No cutting required.

Default template: Avery L7160 (21 labels per A4 sheet, 63.5 x 38.1mm).
Officeworks stocks this in inkjet + laser. 6 sheets cover all 107 GB0-156 beds.

Run:
  python3 scripts/generate_qr_sticker_avery.py
  python3 scripts/generate_qr_sticker_avery.py --template L7159
  python3 scripts/generate_qr_sticker_avery.py --batch 156 --count 107
  python3 scripts/generate_qr_sticker_avery.py --start 4   # skip first 3 used labels
  python3 scripts/generate_qr_sticker_avery.py --calibration  # alignment test, no QRs

Supported templates (all A4):
  L7160  Avery die-cut, 21 per sheet (3x7),  63.5 x 38.1mm    <- DEFAULT for Avery
  L7159  Avery die-cut, 24 per sheet (3x8),  63.5 x 33.9mm
  L7165  Avery die-cut,  8 per sheet (2x4),  99.1 x 67.7mm    large, scans from distance
  L7651  Avery die-cut, 65 per sheet (5x13), 38.1 x 21.2mm    asset ID only, no QR
  VINYL45 Full-sheet vinyl, 24 per sheet (4x6), 45 x 45mm sq  cut by hand, cut lines printed
  VINYL40 Full-sheet vinyl, 30 per sheet (5x6), 40 x 40mm sq  smaller, more per sheet
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

REPO = Path(__file__).resolve().parent.parent

COLOR_BLACK = (0, 0, 0)
COLOR_GREY = (0.55, 0.55, 0.55)
COLOR_GUIDE = (0.85, 0.85, 0.85)


@dataclass(frozen=True)
class AveryTemplate:
    """Sheet label layout (mm). Used for both Avery die-cut and full-sheet vinyl."""
    code: str
    cols: int
    rows: int
    label_w: float
    label_h: float
    margin_top: float      # from page top to top edge of first label row
    margin_left: float     # from page left to left edge of first label col
    gap_x: float           # horizontal gap between columns
    gap_y: float           # vertical gap between rows
    cut_lines: bool = False  # True for full-sheet vinyl (you cut by hand)

    @property
    def per_sheet(self) -> int:
        return self.cols * self.rows


# Avery specs from Avery AU published templates.
# VINYL* are free-form layouts for Kmart-style full-sheet printable vinyl paper.
TEMPLATES = {
    "L7160": AveryTemplate("L7160", cols=3, rows=7,
                           label_w=63.5, label_h=38.1,
                           margin_top=15.15, margin_left=7.21,
                           gap_x=2.54, gap_y=0.0),
    "L7159": AveryTemplate("L7159", cols=3, rows=8,
                           label_w=63.5, label_h=33.9,
                           margin_top=13.55, margin_left=7.21,
                           gap_x=2.54, gap_y=0.0),
    "L7165": AveryTemplate("L7165", cols=2, rows=4,
                           label_w=99.1, label_h=67.7,
                           margin_top=13.55, margin_left=4.65,
                           gap_x=2.5, gap_y=0.0),
    "L7651": AveryTemplate("L7651", cols=5, rows=13,
                           label_w=38.1, label_h=21.2,
                           margin_top=10.7, margin_left=4.75,
                           gap_x=2.54, gap_y=0.0),
    # 4 cols x 6 rows on A4: usable 194 x 281mm with 8mm margins, 45mm sq + 4mm gaps
    "VINYL45": AveryTemplate("VINYL45", cols=4, rows=6,
                             label_w=45.0, label_h=45.0,
                             margin_top=8.5, margin_left=8.5,
                             gap_x=4.0, gap_y=2.0,
                             cut_lines=True),
    # 5 cols x 6 rows: 40mm sq, tighter packing for more per sheet
    "VINYL40": AveryTemplate("VINYL40", cols=5, rows=6,
                             label_w=40.0, label_h=40.0,
                             margin_top=15.0, margin_left=8.5,
                             gap_x=2.0, gap_y=4.0,
                             cut_lines=True),
}


def label_origin_pt(tpl: AveryTemplate, col: int, row: int) -> tuple[float, float]:
    """Bottom-left point (in PDF points) of the label at (col, row) on the A4 page."""
    page_h = A4[1]
    x_mm = tpl.margin_left + col * (tpl.label_w + tpl.gap_x)
    # Avery measures from top; convert to PDF's bottom-up coords
    y_top_mm = tpl.margin_top + row * (tpl.label_h + tpl.gap_y)
    y_bot_mm = (page_h / mm) - y_top_mm - tpl.label_h
    return x_mm * mm, y_bot_mm * mm


def draw_grid_cuts(pdf: canvas.Canvas, tpl: AveryTemplate) -> None:
    """Draw full-page horizontal + vertical guillotine lines.

    Each line runs through the midpoint of the gap between rows/columns, plus
    outer trim lines at the page margins so every sticker comes out uniform.
    Print, then guillotine straight across each line — much faster than
    cutting around individual stickers.
    """
    page_w, page_h = A4
    pdf.setStrokeColorRGB(*COLOR_GREY)
    pdf.setLineWidth(0.35)

    # Vertical cuts: at left margin, between each col, at right margin.
    x_positions_mm: list[float] = [tpl.margin_left]
    for c in range(tpl.cols - 1):
        right_edge = tpl.margin_left + (c + 1) * tpl.label_w + c * tpl.gap_x
        x_positions_mm.append(right_edge + tpl.gap_x / 2)
    x_positions_mm.append(tpl.margin_left + tpl.cols * tpl.label_w
                          + (tpl.cols - 1) * tpl.gap_x)

    for x_mm in x_positions_mm:
        x_pt = x_mm * mm
        pdf.line(x_pt, 0, x_pt, page_h)

    # Horizontal cuts: at top margin, between each row, at bottom of last row.
    y_positions_top_mm: list[float] = [tpl.margin_top]
    for r in range(tpl.rows - 1):
        bottom_edge = tpl.margin_top + (r + 1) * tpl.label_h + r * tpl.gap_y
        y_positions_top_mm.append(bottom_edge + tpl.gap_y / 2)
    y_positions_top_mm.append(tpl.margin_top + tpl.rows * tpl.label_h
                              + (tpl.rows - 1) * tpl.gap_y)

    for y_top_mm in y_positions_top_mm:
        y_pt = page_h - y_top_mm * mm
        pdf.line(0, y_pt, page_w, y_pt)


def draw_label(pdf: canvas.Canvas, tpl: AveryTemplate, col: int, row: int,
               qr_path: Path, asset_id: str, draw_guides: bool,
               draw_box: bool) -> None:
    """Place one QR + asset id inside the label cell at (col, row)."""
    x0, y0 = label_origin_pt(tpl, col, row)
    w_pt = tpl.label_w * mm
    h_pt = tpl.label_h * mm

    if draw_box:
        pdf.setStrokeColorRGB(*COLOR_BLACK)
        pdf.setLineWidth(0.3)
        pdf.setDash(2, 2)
        pdf.rect(x0, y0, w_pt, h_pt, fill=0, stroke=1)
        pdf.setDash()
    elif draw_guides:
        pdf.setStrokeColorRGB(*COLOR_GUIDE)
        pdf.setLineWidth(0.2)
        pdf.rect(x0, y0, w_pt, h_pt, fill=0, stroke=1)

    inner_pad = min(w_pt, h_pt) * 0.06
    is_square = abs(w_pt - h_pt) < 5 * mm  # square-ish labels get vertical stack layout

    if is_square:
        # Vertical layout: Goods. on top, QR centre, asset ID + domain bottom
        wordmark_size = min(h_pt * 0.10, 9)
        asset_size = min(h_pt * 0.13, 11)
        footer_size = max(5.5, min(h_pt * 0.075, 6.5))

        text_top_band = wordmark_size + inner_pad
        text_bot_band = asset_size + footer_size + inner_pad * 1.5
        qr_size = h_pt - text_top_band - text_bot_band - inner_pad * 2
        qr_size = min(qr_size, w_pt - 2 * inner_pad)

        pdf.setFillColorRGB(*COLOR_BLACK)
        pdf.setFont("Helvetica-Bold", wordmark_size)
        wordmark = "Goods."
        wm_w = pdf.stringWidth(wordmark, "Helvetica-Bold", wordmark_size)
        wm_x = x0 + (w_pt - wm_w) / 2
        wm_y = y0 + h_pt - inner_pad - wordmark_size
        pdf.drawString(wm_x, wm_y, wordmark)

        qr_x = x0 + (w_pt - qr_size) / 2
        qr_y = wm_y - inner_pad - qr_size
        try:
            pdf.drawImage(str(qr_path), qr_x, qr_y, width=qr_size, height=qr_size,
                          preserveAspectRatio=True, mask='auto')
        except Exception:
            pdf.setFillColorRGB(*COLOR_BLACK)
            pdf.rect(qr_x, qr_y, qr_size, qr_size, fill=1, stroke=0)

        pdf.setFillColorRGB(*COLOR_BLACK)
        pdf.setFont("Helvetica-Bold", asset_size)
        while pdf.stringWidth(asset_id, "Helvetica-Bold", asset_size) > w_pt - 2 * inner_pad \
                and asset_size > 5:
            asset_size -= 0.5
            pdf.setFont("Helvetica-Bold", asset_size)
        aid_w = pdf.stringWidth(asset_id, "Helvetica-Bold", asset_size)
        aid_x = x0 + (w_pt - aid_w) / 2
        aid_y = qr_y - inner_pad - asset_size
        pdf.drawString(aid_x, aid_y, asset_id)

        pdf.setFillColorRGB(*COLOR_GREY)
        pdf.setFont("Helvetica", footer_size)
        footer = "goodsoncountry.com"
        f_w = pdf.stringWidth(footer, "Helvetica", footer_size)
        f_x = x0 + (w_pt - f_w) / 2
        f_y = y0 + inner_pad
        pdf.drawString(f_x, f_y, footer)
        return

    # Horizontal layout (Avery rectangular labels): QR left, text right
    qr_size = h_pt - 2 * inner_pad
    qr_can_fit = qr_size > 8 * mm and w_pt > qr_size + 12 * mm

    if qr_can_fit:
        qr_x = x0 + inner_pad
        qr_y = y0 + (h_pt - qr_size) / 2
        try:
            pdf.drawImage(str(qr_path), qr_x, qr_y, width=qr_size, height=qr_size,
                          preserveAspectRatio=True, mask='auto')
        except Exception:
            pdf.setFillColorRGB(*COLOR_BLACK)
            pdf.rect(qr_x, qr_y, qr_size, qr_size, fill=1, stroke=0)

        text_x = qr_x + qr_size + inner_pad
        text_w = (x0 + w_pt) - text_x - inner_pad
    else:
        text_x = x0 + inner_pad
        text_w = w_pt - 2 * inner_pad

    wordmark_size = min(h_pt * 0.22, 11)
    asset_size = min(h_pt * 0.28, 13)

    pdf.setFillColorRGB(*COLOR_BLACK)
    pdf.setFont("Helvetica-Bold", wordmark_size)
    wordmark = "Goods."
    wm_w = pdf.stringWidth(wordmark, "Helvetica-Bold", wordmark_size)
    wm_x = text_x + max(0, (text_w - wm_w) / 2)
    wm_y = y0 + h_pt - inner_pad - wordmark_size
    pdf.drawString(wm_x, wm_y, wordmark)

    pdf.setFont("Helvetica-Bold", asset_size)
    while pdf.stringWidth(asset_id, "Helvetica-Bold", asset_size) > text_w and asset_size > 5:
        asset_size -= 0.5
        pdf.setFont("Helvetica-Bold", asset_size)
    aid_w = pdf.stringWidth(asset_id, "Helvetica-Bold", asset_size)
    aid_x = text_x + max(0, (text_w - aid_w) / 2)
    aid_y = wm_y - inner_pad - asset_size
    pdf.drawString(aid_x, aid_y, asset_id)

    footer_size = max(5.5, min(h_pt * 0.14, 7.5))
    pdf.setFillColorRGB(*COLOR_GREY)
    pdf.setFont("Helvetica", footer_size)
    footer = "goodsoncountry.com"
    f_w = pdf.stringWidth(footer, "Helvetica", footer_size)
    f_x = text_x + max(0, (text_w - f_w) / 2)
    f_y = y0 + inner_pad
    pdf.drawString(f_x, f_y, footer)


def draw_calibration_page(pdf: canvas.Canvas, tpl: AveryTemplate) -> None:
    """Outline every label position with a thin grey rectangle + slot number.
    Print one page on plain paper, hold up to the light against a real Avery
    sheet to verify alignment before printing on stickers."""
    pdf.setStrokeColorRGB(*COLOR_GREY)
    pdf.setLineWidth(0.4)
    for row in range(tpl.rows):
        for col in range(tpl.cols):
            x0, y0 = label_origin_pt(tpl, col, row)
            w_pt = tpl.label_w * mm
            h_pt = tpl.label_h * mm
            pdf.rect(x0, y0, w_pt, h_pt, fill=0, stroke=1)
            slot = row * tpl.cols + col + 1
            pdf.setFillColorRGB(*COLOR_GREY)
            pdf.setFont("Helvetica", 9)
            pdf.drawString(x0 + 4, y0 + 4, f"slot {slot}")

    pdf.setFillColorRGB(*COLOR_BLACK)
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(15 * mm, 15 * mm,
                   f"Avery {tpl.code} calibration  -  print on plain A4, "
                   f"hold against label sheet to verify alignment")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", default="156")
    ap.add_argument("--count", type=int, default=107)
    ap.add_argument("--start", type=int, default=1,
                    help="Asset number to start at (skip first N-1 used labels). Default 1.")
    ap.add_argument("--skip-slots", type=int, default=0,
                    help="Skip first N label slots on page 1 (resume a partially-used sheet).")
    ap.add_argument("--template", default="L7160", choices=sorted(TEMPLATES.keys()))
    ap.add_argument("--calibration", action="store_true",
                    help="Output a single-page alignment test only (no QR codes).")
    ap.add_argument("--guides", action="store_true",
                    help="Draw thin grey label outlines (useful for plain-paper proof print).")
    ap.add_argument("--cuts", choices=["box", "grid", "none"], default=None,
                    help="Cut marks: 'box' (dashed line around each sticker), "
                         "'grid' (full-page lines for guillotining straight across), "
                         "'none' (no marks). Default: grid for vinyl, none for Avery.")
    ap.add_argument("--out", default=None, help="Override output path.")
    args = ap.parse_args()

    tpl = TEMPLATES[args.template]
    batch = args.batch
    cuts_mode = args.cuts or ("grid" if tpl.cut_lines else "none")

    qr_dir = REPO / "data" / "new_beds" / f"batch_{batch}" / "qr_png"
    out_dir = REPO / "data" / "new_beds" / f"batch_{batch}"

    if args.calibration:
        out_pdf = Path(args.out) if args.out else \
            out_dir / f"Goods_Batch{batch}_QR_Avery{tpl.code}_CALIBRATION.pdf"
        pdf = canvas.Canvas(str(out_pdf), pagesize=A4)
        pdf.setTitle(f"Avery {tpl.code} calibration")
        draw_calibration_page(pdf, tpl)
        pdf.save()
        print(f"Calibration sheet -> {out_pdf}")
        print(f"  1. Print on plain A4 (100% scale, no shrink-to-fit)")
        print(f"  2. Hold against an Avery {tpl.code} sheet up to a window")
        print(f"  3. Boxes should align with the die-cut labels")
        return

    if not qr_dir.exists():
        sys.exit(f"ERROR: QR PNG dir not found: {qr_dir}")

    suffix = f"_{cuts_mode.upper()}" if cuts_mode != "none" else ""
    out_pdf = Path(args.out) if args.out else \
        out_dir / f"Goods_Batch{batch}_QR_Avery{tpl.code}{suffix}.pdf"

    start_id = max(1, args.start)
    end_id = start_id + args.count - 1
    skip_slots = max(0, args.skip_slots)
    total_labels = args.count + skip_slots
    pages = -(-total_labels // tpl.per_sheet)

    print(f"Avery {tpl.code}: {tpl.cols}x{tpl.rows} = {tpl.per_sheet} labels per A4 sheet")
    print(f"  Label size: {tpl.label_w} x {tpl.label_h}mm")
    print(f"  Cuts mode: {cuts_mode}")
    print(f"  Batch GB0-{batch}: asset IDs {start_id}..{end_id}  ({args.count} labels)")
    if skip_slots:
        print(f"  Skip first {skip_slots} slot(s) on page 1 (partial sheet resume)")
    print(f"  Output: {pages} page(s) -> {out_pdf.relative_to(REPO)}")

    pdf = canvas.Canvas(str(out_pdf), pagesize=A4)
    pdf.setTitle(f"Goods Batch {batch} - QR stickers (Avery {tpl.code})")
    pdf.setAuthor("Goods Asset Tracker")
    pdf.setSubject(f"107 QR stickers on Avery {tpl.code} A4 label sheets")

    if cuts_mode == "grid":
        draw_grid_cuts(pdf, tpl)

    placed = 0
    missing = []
    for i in range(args.count):
        slot_index = i + skip_slots
        slot_on_page = slot_index % tpl.per_sheet
        if slot_on_page == 0 and (i + skip_slots) > 0:
            pdf.showPage()
            if cuts_mode == "grid":
                draw_grid_cuts(pdf, tpl)

        row = slot_on_page // tpl.cols
        col = slot_on_page % tpl.cols
        asset_id = f"GB0-{batch}-{start_id + i}"
        qr_path = qr_dir / f"qr_{asset_id}.png"
        if not qr_path.exists():
            missing.append(asset_id)
            continue
        draw_label(pdf, tpl, col, row, qr_path, asset_id,
                   draw_guides=args.guides, draw_box=(cuts_mode == "box"))
        placed += 1

    pdf.save()

    print(f"  Placed: {placed} stickers")
    if missing:
        print(f"  Missing QR PNGs ({len(missing)}): {', '.join(missing[:5])}"
              + ("..." if len(missing) > 5 else ""))
    print(f"  File size: {out_pdf.stat().st_size / 1024 / 1024:.2f} MB")
    print()
    print("PRINTING:")
    if tpl.cut_lines:
        print(f"  Designed for FULL-SHEET printable vinyl paper (e.g. Kmart 8-pack:")
        print(f"  https://www.kmart.com.au/product/8-pack-printable-vinyl-sticker-paper-43572571/)")
        print(f"  1. Feed one A4 vinyl sheet into your printer at a time.")
        print(f"  2. Print at 100% scale (turn OFF 'fit to page' / 'shrink to fit').")
        print(f"  3. Let the ink dry 5 minutes before cutting (especially inkjet).")
        if cuts_mode == "grid":
            cols = tpl.cols
            rows = tpl.rows
            print(f"  4. GUILLOTINE in straight runs along the printed lines:")
            print(f"     - {cols + 1} vertical cuts (full page height)")
            print(f"     - {rows + 1} horizontal cuts (full page width)")
            print(f"     Result: {cols * rows} identical {tpl.label_w:g} x {tpl.label_h:g}mm stickers per sheet.")
        else:
            print(f"  4. Cut along the dashed lines around each sticker with scissors or")
            print(f"     a paper trimmer. Trimmer is much faster for the straight runs.")
        print(f"  5. Peel + stick on bed legs. Vinyl is water + scratch resistant.")
    else:
        print(f"  1. Buy Avery {tpl.code} A4 label sheets (Officeworks stocks both inkjet + laser).")
        print(f"  2. FIRST: print the calibration page on plain paper to verify alignment:")
        print(f"       python3 scripts/generate_qr_sticker_avery.py --template {tpl.code} --calibration")
        print(f"  3. Open the PDF, print at 100% scale (NO 'fit to page' / 'shrink to fit').")
        print(f"  4. Feed Avery sheets one at a time. Monitor the first sheet end-to-end before")
        print(f"     committing the rest, just in case your printer over/under-drives the paper.")


if __name__ == "__main__":
    main()
