#!/usr/bin/env python3
"""
QR Code Generation Script for Goods Asset Register
Generates SVG and PNG QR codes for all 389 assets
"""

import qrcode
import qrcode.image.svg
import pandas as pd
from pathlib import Path
from tqdm import tqdm

def generate_qr_codes(csv_file, output_dir):
    """
    Generate QR codes for all assets in the CSV

    Args:
        csv_file: Path to expanded assets CSV
        output_dir: Base directory for QR code output
    """
    # Read CSV
    print(f"Reading {csv_file}...")
    df = pd.read_csv(csv_file)

    # Create output directories
    svg_dir = output_dir / 'svg'
    png_dir = output_dir / 'png'
    svg_dir.mkdir(parents=True, exist_ok=True)
    png_dir.mkdir(parents=True, exist_ok=True)

    print(f"\nGenerating QR codes for {len(df)} assets...")
    print(f"SVG output: {svg_dir}")
    print(f"PNG output: {png_dir}")

    # Track generated files
    generated_svgs = []
    generated_pngs = []

    # Generate QR codes
    for _, row in tqdm(df.iterrows(), total=len(df), desc="Generating QR codes"):
        unique_id = row['unique_id']
        qr_url = row['qr_url']

        # Sanitize filename (replace / with -)
        safe_id = unique_id.replace('/', '-')

        # Create QR code with high error correction
        qr = qrcode.QRCode(
            version=1,  # Auto-size
            error_correction=qrcode.constants.ERROR_CORRECT_H,  # 30% error correction
            box_size=10,
            border=2,
        )
        qr.add_data(qr_url)
        qr.make(fit=True)

        # Save as SVG (scalable for any print size)
        try:
            svg_img = qr.make_image(
                image_factory=qrcode.image.svg.SvgPathImage,
                fill_color="black",
                back_color="white"
            )
            svg_path = svg_dir / f"qr_{safe_id}.svg"
            svg_img.save(str(svg_path))
            generated_svgs.append(svg_path.name)
        except Exception as e:
            print(f"\n⚠️  Error generating SVG for {unique_id}: {e}")

        # Save as high-res PNG (300 DPI equivalent)
        try:
            png_img = qr.make_image(fill_color="black", back_color="white")
            png_path = png_dir / f"qr_{safe_id}.png"
            png_img.save(str(png_path))
            generated_pngs.append(png_path.name)
        except Exception as e:
            print(f"\n⚠️  Error generating PNG for {unique_id}: {e}")

    print(f"\n✅ QR Code Generation Complete!")
    print(f"Generated {len(generated_svgs)} SVG files")
    print(f"Generated {len(generated_pngs)} PNG files")

    # Generate manifest CSV
    manifest_df = df[['unique_id', 'name', 'product', 'community', 'qr_url']].copy()
    manifest_df['svg_path'] = manifest_df['unique_id'].apply(
        lambda x: f"svg/qr_{x.replace('/', '-')}.svg"
    )
    manifest_df['png_path'] = manifest_df['unique_id'].apply(
        lambda x: f"png/qr_{x.replace('/', '-')}.png"
    )

    manifest_path = output_dir / 'qr_manifest.csv'
    manifest_df.to_csv(manifest_path, index=False)
    print(f"\n📋 QR manifest saved: {manifest_path}")

    return manifest_df

if __name__ == '__main__':
    # File paths
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent

    csv_file = project_dir / 'data' / 'expanded_assets_final.csv'
    output_dir = project_dir / 'data' / 'qr_codes'

    if not csv_file.exists():
        print(f"❌ Error: File not found: {csv_file}")
        print(f"   Run expand_csv.py first!")
    else:
        # Generate QR codes
        manifest_df = generate_qr_codes(csv_file, output_dir)

        print(f"\n📁 QR codes saved to: {output_dir}")
        print(f"\nNext steps:")
        print(f"1. Organize QR codes: python scripts/export_qr_packages.py")
        print(f"2. Review sample QR codes in {output_dir}/svg/")
        print(f"3. Send organized packages to your printer")
