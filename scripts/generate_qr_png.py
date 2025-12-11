#!/usr/bin/env python3
"""Convert SVG QR codes to high-resolution PNG for PDF embedding"""

import qrcode
from pathlib import Path
import csv

# Paths
BASE_DIR = Path('/Volumes/OS_FIELD_B/Code/Goods Asset Register')
CSV_PATH = BASE_DIR / 'data/new_beds/batch_153.csv'
PNG_OUTPUT_DIR = BASE_DIR / 'data/new_beds/qr_codes_png'

# Ensure output directory exists
PNG_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# QR settings for high-resolution printing
# At 300 DPI, 50mm = 1.97 inches = 591 pixels
# We'll generate at 600x600 to ensure crisp print quality
QR_SIZE_PX = 600

print("🔲 Generating high-resolution PNG QR codes...")
print(f"Output directory: {PNG_OUTPUT_DIR}")
print(f"Resolution: {QR_SIZE_PX}x{QR_SIZE_PX} pixels (300+ DPI at 50mm)")
print()

# Read CSV
with open(CSV_PATH, 'r') as f:
    reader = csv.DictReader(f)
    beds = list(reader)

# Generate PNG QR codes
for bed in beds:
    unique_id = bed['unique_id']
    qr_url = bed['qr_url']

    print(f"Generating {unique_id}...")

    # Create QR code with high error correction
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # 30% error tolerance
        box_size=20,  # Size of each box in pixels
        border=2,  # Minimum border (quiet zone)
    )

    qr.add_data(qr_url)
    qr.make(fit=True)

    # Create high-resolution image
    img = qr.make_image(fill_color="black", back_color="white")

    # Resize to exact dimensions for consistency
    img = img.resize((QR_SIZE_PX, QR_SIZE_PX))

    # Save as PNG
    output_path = PNG_OUTPUT_DIR / f"qr_{unique_id}.png"
    img.save(str(output_path))
    print(f"  ✓ Saved: {output_path.name}")

print()
print(f"✅ Generated {len(beds)} PNG QR codes")
print(f"Files saved to: {PNG_OUTPUT_DIR}")
