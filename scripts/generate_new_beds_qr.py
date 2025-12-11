#!/usr/bin/env python3
"""Generate QR codes for 15 new beds (batch 153)"""

import qrcode
import qrcode.image.svg
from pathlib import Path
import csv

# Paths
base_dir = Path('/Volumes/OS_FIELD_B/Code/Goods Asset Register')
csv_path = base_dir / 'data/new_beds/batch_153.csv'
qr_output_dir = base_dir / 'data/new_beds/qr_codes'

# Ensure output directory exists
qr_output_dir.mkdir(parents=True, exist_ok=True)

print("Generating QR codes for 15 new beds...")
print(f"Output directory: {qr_output_dir}")

# Read the CSV file
with open(csv_path, 'r') as f:
    reader = csv.DictReader(f)
    beds = list(reader)

# Generate QR codes
for bed in beds:
    unique_id = bed['unique_id']
    qr_url = bed['qr_url']

    print(f"Generating QR for {unique_id}...")

    # Create QR code with high error correction (30% tolerance for fabric)
    factory = qrcode.image.svg.SvgPathImage
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # Highest error correction
        box_size=20,
        border=2,
        image_factory=factory
    )

    qr.add_data(qr_url)
    qr.make(fit=True)

    # Generate SVG image
    img = qr.make_image()

    # Save SVG file
    output_path = qr_output_dir / f"qr_{unique_id}.svg"
    img.save(str(output_path))
    print(f"  ✓ Saved: {output_path.name}")

print(f"\n✅ Successfully generated {len(beds)} QR codes!")
print(f"\nFiles saved to: {qr_output_dir}")
print("\nNext steps:")
print("1. Import these 15 beds to the database")
print("2. Design the iron-on layout in Figma")
print("3. Order DTF gang sheet print")
print("4. Iron onto beds when delivered")
