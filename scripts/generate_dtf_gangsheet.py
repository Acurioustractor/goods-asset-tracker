#!/usr/bin/env python3
"""
Automated DTF Gang Sheet Generator for 15 New Beds
Creates a 58cm × 100cm print-ready PDF with QR codes, labels, and logos
"""

from reportlab.lib.pagesizes import mm
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pathlib import Path
import csv

# ============================================================================
# CONFIGURATION
# ============================================================================

BASE_DIR = Path('/Volumes/OS_FIELD_B/Code/Goods Asset Register')
QR_DIR = BASE_DIR / 'data/new_beds/qr_codes_png'  # Use PNG instead of SVG
CSV_PATH = BASE_DIR / 'data/new_beds/batch_153.csv'
OUTPUT_PDF = BASE_DIR / 'data/new_beds/Goods_Batch153_DTF_GangSheet.pdf'

# Gang sheet dimensions (58cm × 100cm)
SHEET_WIDTH = 580 * mm
SHEET_HEIGHT = 1000 * mm

# QR Unit settings (logo + QR + number all together)
QR_SIZE = 60 * mm  # 60mm × 60mm QR codes (bigger)
WHITE_BACKING_SIZE = 62 * mm  # 62mm × 62mm white background
LABEL_FONT_SIZE = 16  # Asset ID label size in points (much bigger)
LABEL_Y_OFFSET = 8 * mm  # Distance below QR code
LOGO_FONT_SIZE = 24  # "Goods." at top of each unit
LOGO_Y_OFFSET = 8 * mm  # Distance above QR code

# Layout settings
MARGIN = 12 * mm  # Safety margin from edges
QR_SPACING_X = 12 * mm  # Horizontal spacing between units
QR_SPACING_Y = 12 * mm  # Vertical spacing between rows

# Total unit height calculation (logo + QR + label)
UNIT_HEIGHT = (LOGO_FONT_SIZE * 1.5) + LOGO_Y_OFFSET + WHITE_BACKING_SIZE + LABEL_Y_OFFSET + (LABEL_FONT_SIZE * 2)

# Background for visibility on dark fabric
UNIT_BACKGROUND_COLOR = (1, 0.5, 0.7)  # Bright pink background - stands out on dark green/khaki
UNIT_BACKGROUND_PADDING = 5 * mm  # Extra padding around unit

# Colors
COLOR_BLACK = (0, 0, 0)
COLOR_WHITE = (1, 1, 1)
COLOR_BRIGHT_YELLOW = (1, 0.9, 0)  # Alternative if white isn't enough contrast
COLOR_DARK_GRAY = (0.1, 0.1, 0.1)  # #1a1a1a

# ============================================================================
# LAYOUT CALCULATION
# ============================================================================

def calculate_layout():
    """Calculate positions for 15 integrated QR units (logo + QR + number)"""
    positions = []

    # Available width and height
    available_width = SHEET_WIDTH - (2 * MARGIN)
    available_height = SHEET_HEIGHT - (2 * MARGIN)

    # Calculate unit dimensions with spacing
    unit_width = WHITE_BACKING_SIZE
    unit_with_spacing_x = unit_width + QR_SPACING_X
    unit_with_spacing_y = UNIT_HEIGHT + QR_SPACING_Y

    # Calculate how many units fit per row (try for 3 across)
    qrs_per_row = 3

    # Start positions (centered on page)
    total_width = (qrs_per_row * unit_width) + ((qrs_per_row - 1) * QR_SPACING_X)
    start_x = (SHEET_WIDTH - total_width) / 2

    start_y = SHEET_HEIGHT - MARGIN - LOGO_Y_OFFSET  # Start from top

    # Generate grid positions for 15 QR codes (3-3-3-3-3 layout = 5 rows)
    qr_index = 0
    row = 0
    col = 0

    for i in range(15):
        x_pos = start_x + (col * (unit_width + QR_SPACING_X))
        y_pos = start_y - (row * unit_with_spacing_y)

        positions.append({
            'x': x_pos,
            'y': y_pos,
            'type': 'qr',
            'index': qr_index
        })

        qr_index += 1
        col += 1

        if col >= qrs_per_row:
            col = 0
            row += 1

    return positions

# ============================================================================
# PDF GENERATION
# ============================================================================

def draw_qr_unit(pdf, qr_path, x, y, asset_id):
    """Draw complete QR unit: Goods. logo + QR code + asset ID number

    With bright pink background for visibility on dark green/khaki fabric
    """

    # Y position is at the top of the unit
    unit_top_y = y

    # Calculate unit dimensions
    unit_width = WHITE_BACKING_SIZE + (2 * UNIT_BACKGROUND_PADDING)
    unit_height = UNIT_HEIGHT + UNIT_BACKGROUND_PADDING

    # 0. Draw pink background rectangle (for dark fabric visibility)
    bg_x = x - UNIT_BACKGROUND_PADDING
    bg_y = unit_top_y - unit_height
    pdf.setFillColorRGB(*UNIT_BACKGROUND_COLOR)
    pdf.setStrokeColorRGB(*COLOR_BLACK)
    pdf.setLineWidth(0.5)
    pdf.rect(bg_x, bg_y, unit_width, unit_height, fill=1, stroke=1)

    # 1. Draw "Goods." logo at top (with proper spacing)
    pdf.setFillColorRGB(*COLOR_BLACK)
    pdf.setFont("Helvetica-Bold", LOGO_FONT_SIZE)
    logo_text = "Goods."
    logo_width = pdf.stringWidth(logo_text, "Helvetica-Bold", LOGO_FONT_SIZE)
    logo_x = x + (WHITE_BACKING_SIZE / 2) - (logo_width / 2)  # Center logo
    logo_y = unit_top_y - LOGO_FONT_SIZE - UNIT_BACKGROUND_PADDING
    pdf.drawString(logo_x, logo_y, logo_text)

    # 2. Draw white backing square for QR (on top of white background)
    backing_y = logo_y - LOGO_Y_OFFSET - WHITE_BACKING_SIZE
    backing_x = x
    pdf.setFillColorRGB(*COLOR_WHITE)
    pdf.setStrokeColorRGB(*COLOR_BLACK)
    pdf.setLineWidth(1)
    pdf.rect(backing_x, backing_y, WHITE_BACKING_SIZE, WHITE_BACKING_SIZE, fill=1, stroke=1)

    # 3. Draw QR code (centered on white backing)
    qr_offset = (WHITE_BACKING_SIZE - QR_SIZE) / 2
    qr_x = backing_x + qr_offset
    qr_y = backing_y + qr_offset

    try:
        pdf.drawImage(
            str(qr_path),
            qr_x,
            qr_y,
            width=QR_SIZE,
            height=QR_SIZE,
            preserveAspectRatio=True
        )
    except Exception as e:
        print(f"Warning: Could not embed PNG: {e}")
        pdf.setFillColorRGB(*COLOR_BLACK)
        pdf.rect(qr_x, qr_y, QR_SIZE, QR_SIZE, fill=1)

    # 4. Draw asset ID label below QR (bigger and bolder)
    pdf.setFillColorRGB(*COLOR_BLACK)
    pdf.setFont("Helvetica-Bold", LABEL_FONT_SIZE)
    label_text = asset_id
    label_width = pdf.stringWidth(label_text, "Helvetica-Bold", LABEL_FONT_SIZE)
    label_x = backing_x + (WHITE_BACKING_SIZE / 2) - (label_width / 2)
    label_y = backing_y - LABEL_Y_OFFSET - LABEL_FONT_SIZE
    pdf.drawString(label_x, label_y, label_text)

def generate_gangsheet():
    """Main function to generate the DTF gang sheet PDF"""

    print("🎨 Generating DTF Gang Sheet PDF...")
    print(f"Output: {OUTPUT_PDF}")
    print()

    # Create PDF canvas
    pdf = canvas.Canvas(
        str(OUTPUT_PDF),
        pagesize=(SHEET_WIDTH, SHEET_HEIGHT)
    )

    # Set metadata
    pdf.setTitle("Goods Batch 153 - DTF Gang Sheet")
    pdf.setAuthor("Goods Asset Tracker")
    pdf.setSubject("Iron-on QR Codes for 15 Beds")

    # Transparent background (no fill)
    pdf.setFillColorRGB(1, 1, 1)

    # Read bed data from CSV
    print("📖 Reading bed data from CSV...")
    beds = []
    with open(CSV_PATH, 'r') as f:
        reader = csv.DictReader(f)
        beds = list(reader)

    print(f"   Found {len(beds)} beds")
    print()

    # Calculate layout positions
    print("📐 Calculating layout...")
    positions = calculate_layout()

    print(f"   {len(positions)} QR units (each with logo + QR + number)")
    print()

    # Draw QR units
    print("🔲 Drawing integrated QR units...")
    for pos in positions:
        bed = beds[pos['index']]
        asset_id = bed['unique_id']
        qr_path = QR_DIR / f"qr_{asset_id}.png"

        if not qr_path.exists():
            print(f"   ⚠️  Warning: QR code not found: {qr_path.name}")
            continue

        draw_qr_unit(pdf, qr_path, pos['x'], pos['y'], asset_id)
        print(f"   ✓ {asset_id} (Goods. + QR + {asset_id})")

    print()

    # Add print instructions as metadata (hidden in PDF)
    pdf.setCreator("Goods Asset Tracker - Automated Generator")
    pdf.setKeywords("DTF, iron-on, QR codes, gang sheet, 58cm x 100cm, 300 DPI")

    # Save PDF
    print("💾 Saving PDF...")
    pdf.save()

    print()
    print("✅ SUCCESS! Gang sheet generated")
    print()
    print(f"📄 Output file: {OUTPUT_PDF.name}")
    print(f"📏 Size: 580mm × 1000mm (22.8\" × 39.4\")")
    print(f"📦 Units: 15 integrated labels (3 columns × 5 rows)")
    print(f"   Each unit: Goods. logo + 60mm QR code + large ID number")
    print(f"🔲 QR Size: 60mm × 60mm (bigger for bed corners)")
    print(f"🏷️  ID Numbers: 16pt Helvetica Bold (very readable)")
    print(f"💗 Bright pink background on each unit (pops on dark green/khaki fabric)")
    print()
    print("Next steps:")
    print("1. Open the PDF to verify layout")
    print("2. Upload to DTF Direct (dtfdirect.com.au)")
    print("3. Order: 58cm × 100cm gang sheet, white underbase, matte finish")
    print("4. Cost: ~$40 AUD + shipping")
    print()

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    try:
        # Check if QR codes exist
        if not QR_DIR.exists():
            print(f"❌ Error: QR code directory not found: {QR_DIR}")
            exit(1)

        qr_files = list(QR_DIR.glob("qr_GB0-153-*.png"))
        if len(qr_files) != 15:
            print(f"❌ Error: Expected 15 QR codes, found {len(qr_files)}")
            exit(1)

        # Generate gang sheet
        generate_gangsheet()

        print("🚀 Ready to print!")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
