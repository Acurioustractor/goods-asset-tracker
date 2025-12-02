#!/usr/bin/env python3
"""
QR Code Export Package Organizer
Organizes QR codes by community and product type for easy printing
"""

import pandas as pd
import shutil
from pathlib import Path
from tqdm import tqdm

def safe_filename(name):
    """Convert string to safe filename"""
    return name.replace(' ', '_').replace('/', '-')

def export_qr_packages(csv_file, qr_codes_dir, export_dir):
    """
    Organize QR codes into packages by community and product type

    Args:
        csv_file: Path to expanded assets CSV
        qr_codes_dir: Directory containing generated QR codes
        export_dir: Output directory for organized packages
    """
    # Read CSV
    print(f"Reading {csv_file}...")
    df = pd.read_csv(csv_file)

    # Create export directory
    export_dir.mkdir(exist_ok=True)

    print(f"\nOrganizing {len(df)} QR codes...")

    # Package 1: By Community
    print("\n📦 Creating packages by community...")
    by_community_dir = export_dir / 'by_community'
    by_community_dir.mkdir(exist_ok=True)

    communities = df['community'].unique()
    for community in tqdm(communities, desc="Communities"):
        # Create community directory
        comm_dir = by_community_dir / safe_filename(str(community))
        comm_dir.mkdir(exist_ok=True)

        # Get assets for this community
        assets = df[df['community'] == community]

        # Copy QR codes
        for _, row in assets.iterrows():
            unique_id = row['unique_id']
            safe_id = unique_id.replace('/', '-')

            # Copy SVG
            src_svg = qr_codes_dir / 'svg' / f"qr_{safe_id}.svg"
            if src_svg.exists():
                shutil.copy(src_svg, comm_dir)

        # Save manifest for this community
        manifest = assets[['unique_id', 'name', 'product', 'contact_household', 'qr_url']].copy()
        manifest.to_csv(comm_dir / f"{safe_filename(str(community))}_manifest.csv", index=False)

        print(f"  ✓ {community}: {len(assets)} assets")

    # Package 2: By Product Type
    print("\n📦 Creating packages by product type...")
    by_product_dir = export_dir / 'by_product'
    by_product_dir.mkdir(exist_ok=True)

    products = df['product'].unique()
    for product in tqdm(products, desc="Products"):
        # Create product directory
        prod_dir = by_product_dir / safe_filename(product)
        prod_dir.mkdir(exist_ok=True)

        # Get assets for this product
        assets = df[df['product'] == product]

        # Copy QR codes
        for _, row in assets.iterrows():
            unique_id = row['unique_id']
            safe_id = unique_id.replace('/', '-')

            # Copy SVG
            src_svg = qr_codes_dir / 'svg' / f"qr_{safe_id}.svg"
            if src_svg.exists():
                shutil.copy(src_svg, comm_dir)

        # Save manifest for this product
        manifest = assets[['unique_id', 'name', 'community', 'contact_household', 'qr_url']].copy()
        manifest.to_csv(prod_dir / f"{safe_filename(product)}_manifest.csv", index=False)

        print(f"  ✓ {product}: {len(assets)} assets")

    # Package 3: Summary README
    readme_path = export_dir / 'README.md'
    with open(readme_path, 'w') as f:
        f.write("# QR Code Export Packages\n\n")
        f.write(f"Generated on: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write(f"## Summary\n\n")
        f.write(f"- Total Assets: {len(df)}\n")
        f.write(f"- Total QR Codes: {len(df)}\n\n")

        f.write("## By Community\n\n")
        community_counts = df['community'].value_counts()
        for community, count in community_counts.items():
            f.write(f"- **{community}**: {count} assets\n")

        f.write("\n## By Product Type\n\n")
        product_counts = df['product'].value_counts()
        for product, count in product_counts.items():
            f.write(f"- **{product}**: {count} assets\n")

        f.write("\n## Folder Structure\n\n")
        f.write("```\n")
        f.write("qr_export_packages/\n")
        f.write("├── by_community/\n")
        for community in communities:
            f.write(f"│   ├── {safe_filename(str(community))}/\n")
            f.write(f"│   │   ├── qr_*.svg (SVG files)\n")
            f.write(f"│   │   └── {safe_filename(str(community))}_manifest.csv\n")
        f.write("├── by_product/\n")
        for product in products:
            f.write(f"│   ├── {safe_filename(product)}/\n")
            f.write(f"│   │   ├── qr_*.svg (SVG files)\n")
            f.write(f"│   │   └── {safe_filename(product)}_manifest.csv\n")
        f.write("└── README.md (this file)\n")
        f.write("```\n\n")

        f.write("## How to Use\n\n")
        f.write("1. **By Community**: Send each community folder to your local printer/coordinator\n")
        f.write("2. **By Product**: Useful if you want to print all beds or all washers together\n")
        f.write("3. **Manifest Files**: CSV files list all assets in each package for reference\n\n")

        f.write("## Printing Recommendations\n\n")
        f.write("- **Format**: SVG files are scalable - recommended for best quality\n")
        f.write("- **Size**: Print QR codes at least 50mm x 50mm for easy scanning\n")
        f.write("- **Material**: Use weatherproof/UV-resistant materials for outdoor assets\n")
        f.write("- **Testing**: Print a few test QR codes first and scan with phone to verify\n\n")

    print(f"\n✅ Export packages created!")
    print(f"\n📁 Organized packages saved to: {export_dir}")
    print(f"📄 README with instructions: {readme_path}")

    print(f"\n📊 Package Summary:")
    print(f"  - {len(communities)} community packages")
    print(f"  - {len(products)} product type packages")
    print(f"  - Total QR codes: {len(df)}")

if __name__ == '__main__':
    # File paths
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent

    csv_file = project_dir / 'data' / 'expanded_assets_final.csv'
    qr_codes_dir = project_dir / 'data' / 'qr_codes'
    export_dir = project_dir / 'data' / 'qr_export_packages'

    if not csv_file.exists():
        print(f"❌ Error: File not found: {csv_file}")
    elif not qr_codes_dir.exists():
        print(f"❌ Error: QR codes directory not found: {qr_codes_dir}")
        print(f"   Run generate_qrs.py first!")
    else:
        # Export organized packages
        export_qr_packages(csv_file, qr_codes_dir, export_dir)

        print(f"\n✅ All done! QR codes are organized and ready for printing.")
        print(f"\nNext steps:")
        print(f"1. Review {export_dir}/README.md for printing instructions")
        print(f"2. Send community/product folders to your printer")
        print(f"3. Continue with database setup (Phase 2)")
