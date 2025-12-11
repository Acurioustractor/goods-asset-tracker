#!/usr/bin/env python3
"""Generate individual PNG files for each QR unit with pink background"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import csv

# Paths
BASE_DIR = Path('/Volumes/OS_FIELD_B/Code/Goods Asset Register')
QR_PNG_DIR = BASE_DIR / 'data/new_beds/qr_codes_png'
CSV_PATH = BASE_DIR / 'data/new_beds/batch_153.csv'
OUTPUT_DIR = BASE_DIR / 'data/new_beds/individual_units'

# Create output directory
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Settings (converted to pixels at 300 DPI)
# 1 mm = 11.811 pixels at 300 DPI
MM_TO_PX = 11.811

QR_SIZE_PX = int(75 * MM_TO_PX)  # 75mm = ~886px (25% bigger)
WHITE_BACKING_PX = int(78 * MM_TO_PX)  # 78mm = ~921px (25% bigger)
PADDING_PX = int(20 * MM_TO_PX)  # 20mm padding = ~236px (lots of breathing room)

# Colors
PINK = (255, 128, 178, 255)  # RGBA - everything pink
WHITE = (255, 255, 255, 255)
TRANSPARENT = (255, 255, 255, 0)  # Transparent background

# Font sizes (25% bigger)
LOGO_SIZE = 138  # pixels (110 * 1.25)
NUMBER_SIZE = 88  # pixels (70 * 1.25)

# Calculate content dimensions (25% bigger)
LOGO_HEIGHT = 188  # More space for logo (150 * 1.25)
QR_SECTION = WHITE_BACKING_PX
NUMBER_HEIGHT = 150  # More space for number (120 * 1.25)

# Content dimensions (logo + QR + number)
CONTENT_WIDTH = WHITE_BACKING_PX
CONTENT_HEIGHT = LOGO_HEIGHT + QR_SECTION + NUMBER_HEIGHT

# Unit dimensions with padding on ALL SIDES (top, bottom, left, right)
UNIT_WIDTH = CONTENT_WIDTH + (2 * PADDING_PX)
UNIT_HEIGHT = CONTENT_HEIGHT + (2 * PADDING_PX)

print(f"🎨 Generating individual PNG units...")
print(f"Unit size: {UNIT_WIDTH}px × {UNIT_HEIGHT}px")
print(f"Output: {OUTPUT_DIR}")
print()

# Load beds data
with open(CSV_PATH, 'r') as f:
    reader = csv.DictReader(f)
    beds = list(reader)

# Try to load system fonts (bold versions)
try:
    # Try Helvetica Bold first
    logo_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", LOGO_SIZE, index=1)  # Bold variant
    number_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", NUMBER_SIZE, index=1)
except:
    try:
        # Fallback to SF fonts
        logo_font = ImageFont.truetype("/System/Library/Fonts/SFNSDisplay-Bold.otf", LOGO_SIZE)
        number_font = ImageFont.truetype("/System/Library/Fonts/SFNSDisplay-Bold.otf", NUMBER_SIZE)
    except:
        print("⚠️  Using default fonts (system fonts not found)")
        logo_font = ImageFont.load_default()
        number_font = ImageFont.load_default()

# Generate each unit
for i, bed in enumerate(beds, 1):
    asset_id = bed['unique_id']
    qr_path = QR_PNG_DIR / f"qr_{asset_id}.png"

    if not qr_path.exists():
        print(f"⚠️  Skipping {asset_id} - QR code not found")
        continue

    print(f"Creating unit {i}/15: {asset_id}...")

    # Create canvas with TRANSPARENT background
    img = Image.new('RGBA', (UNIT_WIDTH, UNIT_HEIGHT), TRANSPARENT)
    draw = ImageDraw.Draw(img)

    # 1. Draw "Goods" with circle instead of period (PINK text, bold)
    # Draw "Goods" text
    goods_text = "Goods"
    goods_bbox = draw.textbbox((0, 0), goods_text, font=logo_font)
    goods_width = goods_bbox[2] - goods_bbox[0]
    goods_height = goods_bbox[3] - goods_bbox[1]

    # Calculate circle size and position
    circle_radius = LOGO_SIZE // 8  # Circle size based on font
    total_width = goods_width + circle_radius * 2 + 10  # Text + space + circle

    # Center the whole "Goods●" combo
    start_x = (UNIT_WIDTH - total_width) // 2
    logo_y = PADDING_PX + 10  # Add top padding

    # Draw "Goods" text
    draw.text((start_x, logo_y), goods_text, fill=PINK, font=logo_font)

    # Draw circle instead of period (sitting at proper baseline like a real period)
    circle_x = start_x + goods_width + circle_radius + 8
    # Position circle at baseline (where a period would sit)
    circle_y = logo_y + goods_height - circle_radius
    draw.ellipse(
        [(circle_x - circle_radius, circle_y - circle_radius),
         (circle_x + circle_radius, circle_y + circle_radius)],
        fill=PINK
    )

    # 2. Load and convert QR code to PINK on TRANSPARENT
    qr_img = Image.open(qr_path).convert('RGBA')
    qr_img = qr_img.resize((QR_SIZE_PX, QR_SIZE_PX), Image.Resampling.LANCZOS)

    # Convert QR: black → pink, white → transparent
    qr_data = qr_img.getdata()
    new_qr_data = []
    for pixel in qr_data:
        # If pixel is dark (black in QR code), make it pink
        if pixel[0] < 128:  # Black pixels
            new_qr_data.append(PINK)
        else:  # White pixels
            new_qr_data.append(TRANSPARENT)

    qr_img.putdata(new_qr_data)

    # 3. Paste pink QR code (no white backing, just transparent)
    qr_backing_y = PADDING_PX + LOGO_HEIGHT  # Add top padding
    qr_backing_x = PADDING_PX
    img.paste(qr_img, (qr_backing_x, qr_backing_y), qr_img)

    # 4. Draw asset ID number below QR (PINK text, bold)
    number_text = asset_id
    number_bbox = draw.textbbox((0, 0), number_text, font=number_font)
    number_width = number_bbox[2] - number_bbox[0]
    number_x = (UNIT_WIDTH - number_width) // 2
    number_y = qr_backing_y + WHITE_BACKING_PX + 25
    draw.text((number_x, number_y), number_text, fill=PINK, font=number_font)

    # Save PNG
    output_path = OUTPUT_DIR / f"{asset_id}_unit.png"
    img.save(str(output_path), 'PNG')
    print(f"  ✓ Saved: {output_path.name}")

print()
print(f"✅ Generated {len(beds)} individual unit PNGs!")
print(f"\n📁 All files saved to: {OUTPUT_DIR}")
print(f"\nEach file is {UNIT_WIDTH}px × {UNIT_HEIGHT}px")
print(f"💗 EVERYTHING in BRIGHT PINK:")
print(f"   - 'Goods' text + ● circle (not square period)")
print(f"   - QR code itself (pink pixels)")
print(f"   - Asset ID numbers")
print(f"🔲 Background: COMPLETELY TRANSPARENT")
print(f"✏️  Font: Helvetica Bold (larger and bolder)")
print(f"\nPerfect for dark green/khaki fabric - pink will pop!")
print(f"\nYou can now upload these one at a time to your printing service!")
