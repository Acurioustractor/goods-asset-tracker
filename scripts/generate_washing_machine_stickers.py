#!/usr/bin/env python3
"""Generate washing machine QR code stickers with white backgrounds"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import csv
import qrcode

# Paths
BASE_DIR = Path('/Volumes/OS_FIELD_B/Code/Goods Asset Register')
CSV_PATH = BASE_DIR / 'data/washing_machines/batch_154.csv'
QR_PNG_DIR = BASE_DIR / 'data/washing_machines/qr_codes_png'
OUTPUT_DIR = BASE_DIR / 'data/washing_machines/stickers'

# Create output directories
QR_PNG_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Settings (converted to pixels at 300 DPI)
MM_TO_PX = 11.811

# Sticker size: 60mm × 60mm square stickers
STICKER_SIZE_PX = int(60 * MM_TO_PX)  # 60mm = ~708px

# QR code size (smaller to leave room for label)
QR_SIZE_PX = int(45 * MM_TO_PX)  # 45mm QR code

# Colors
PINK = (255, 128, 178, 255)
WHITE = (255, 255, 255, 255)
BLACK = (0, 0, 0, 255)

# Font sizes
LOGO_SIZE = 50  # "Goods●" at top
NUMBER_SIZE = 36  # Asset ID at bottom

print(f"🎨 Generating washing machine QR stickers...")
print(f"Sticker size: {STICKER_SIZE_PX}px × {STICKER_SIZE_PX}px (60mm × 60mm)")
print(f"Output: {OUTPUT_DIR}")
print()

# Load washing machines data
with open(CSV_PATH, 'r') as f:
    reader = csv.DictReader(f)
    machines = list(reader)

# Try to load system fonts
try:
    logo_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", LOGO_SIZE, index=1)
    number_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", NUMBER_SIZE, index=1)
except:
    print("⚠️  Using default fonts")
    logo_font = ImageFont.load_default()
    number_font = ImageFont.load_default()

# Generate each sticker
for i, machine in enumerate(machines, 1):
    asset_id = machine['unique_id']
    qr_url = machine['qr_url']

    print(f"Creating sticker {i}/10: {asset_id}...")

    # 1. Generate QR code PNG
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=2,
    )
    qr.add_data(qr_url)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_img = qr_img.resize((QR_SIZE_PX, QR_SIZE_PX))

    # Save QR code PNG
    qr_png_path = QR_PNG_DIR / f"qr_{asset_id}.png"
    qr_img.save(str(qr_png_path))

    # 2. Create sticker with white background
    sticker = Image.new('RGBA', (STICKER_SIZE_PX, STICKER_SIZE_PX), WHITE)
    draw = ImageDraw.Draw(sticker)

    # Draw "Goods●" at top
    goods_text = "Goods"
    goods_bbox = draw.textbbox((0, 0), goods_text, font=logo_font)
    goods_width = goods_bbox[2] - goods_bbox[0]
    goods_height = goods_bbox[3] - goods_bbox[1]

    # Calculate circle for "●"
    circle_radius = LOGO_SIZE // 8
    total_width = goods_width + circle_radius * 2 + 5

    # Center at top
    start_x = (STICKER_SIZE_PX - total_width) // 2
    logo_y = 10

    # Draw "Goods" text in pink
    draw.text((start_x, logo_y), goods_text, fill=PINK, font=logo_font)

    # Draw circle
    circle_x = start_x + goods_width + circle_radius + 4
    circle_y = logo_y + goods_height - circle_radius
    draw.ellipse(
        [(circle_x - circle_radius, circle_y - circle_radius),
         (circle_x + circle_radius, circle_y + circle_radius)],
        fill=PINK
    )

    # Paste QR code in center
    qr_x = (STICKER_SIZE_PX - QR_SIZE_PX) // 2
    qr_y = logo_y + goods_height + 15
    sticker.paste(qr_img, (qr_x, qr_y))

    # Draw asset ID at bottom
    number_text = asset_id
    number_bbox = draw.textbbox((0, 0), number_text, font=number_font)
    number_width = number_bbox[2] - number_bbox[0]
    number_x = (STICKER_SIZE_PX - number_width) // 2
    number_y = STICKER_SIZE_PX - 50
    draw.text((number_x, number_y), number_text, fill=PINK, font=number_font)

    # Save sticker
    output_path = OUTPUT_DIR / f"{asset_id}_sticker.png"
    sticker.save(str(output_path), 'PNG')
    print(f"  ✓ Saved: {output_path.name}")

print()
print(f"✅ Generated 10 washing machine stickers!")
print(f"\n📁 Stickers saved to: {OUTPUT_DIR}")
print(f"📁 QR codes saved to: {QR_PNG_DIR}")
print(f"\nEach sticker:")
print(f"  - Size: 60mm × 60mm (708px × 708px)")
print(f"  - Pink 'Goods●' logo at top")
print(f"  - Black QR code in center")
print(f"  - Pink asset ID at bottom")
print(f"  - White background")
print(f"\nPerfect for waterproof vinyl stickers!")
