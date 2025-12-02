#!/usr/bin/env python3
"""
Add New Assets Script
Quick script to add new assets to the system and generate QR codes.
"""

import pandas as pd
import json
import subprocess
from pathlib import Path
from datetime import datetime
import qrcode
from qrcode.image.svg import SvgPathImage

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
CSV_PATH = PROJECT_ROOT / 'data' / 'expanded_assets_final.csv'
QR_SVG_DIR = PROJECT_ROOT / 'data' / 'qr_codes' / 'svg'
QR_PNG_DIR = PROJECT_ROOT / 'data' / 'qr_codes' / 'png'
CONFIG_FILE = Path.home() / '.goods-tracker' / 'config.json'

def load_config():
    """Load CLI configuration."""
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)

def get_next_id(df, prefix='GB0-'):
    """Get the next available ID number."""
    # Get all IDs with the prefix
    ids = df[df['id'].str.startswith(prefix)]['id'].tolist()

    # Extract numbers
    numbers = []
    for id_str in ids:
        try:
            # Handle both GB0-200 and GB0-200-1 formats
            num_str = id_str.replace(prefix, '').split('-')[0]
            numbers.append(int(num_str))
        except:
            pass

    if not numbers:
        return f"{prefix}200"  # Start at 200 for new batch

    return f"{prefix}{max(numbers) + 1}"

def add_assets(assets_data):
    """
    Add new assets to the system.

    Args:
        assets_data: List of dicts with asset information
            Required keys: name, product, community, number
            Optional keys: place, contact_household, paint, notes

    Returns:
        List of created unique_ids
    """
    # Load existing CSV
    df = pd.read_csv(CSV_PATH)
    print(f"📊 Current assets: {len(df)}")

    # Get config for URL
    config = load_config()
    frontend_url = config.get('frontend_url', 'https://quiet-babka-e6d738.netlify.app')
    domain = frontend_url.replace('https://', '').replace('http://', '')

    new_rows = []
    created_ids = []

    for asset in assets_data:
        # Get next ID
        base_id = get_next_id(df)
        num_assets = asset.get('number', 1)

        # Create individual assets
        for i in range(num_assets):
            if num_assets == 1:
                unique_id = base_id
            else:
                unique_id = f"{base_id}-{i+1}"

            created_ids.append(unique_id)

            # Create new row
            now = datetime.now()
            row = {
                'unique_id': unique_id,
                'id': base_id,
                'name': asset.get('name', ''),
                'product': asset['product'],
                'community': asset['community'],
                'place': asset.get('place', f"{asset['community']}, Australia"),
                'gps': asset.get('gps', ''),
                'contact_household': asset.get('contact_household', ''),
                'paint': asset.get('paint', ''),
                'photo': asset.get('photo', ''),
                'number': num_assets,
                'notes': asset.get('notes', ''),
                'supply_date': now.strftime('%Y-%m-%d'),
                'last_checkin_date': now.strftime('%Y-%m-%d'),
                'created_time': now.strftime('%Y-%m-%d %H:%M:%S'),
                'qr_url': f'https://{domain}/?asset_id={unique_id}'
            }

            new_rows.append(row)
            print(f"✓ Created: {unique_id} - {asset['product']} - {asset['community']}")

        # Update df for next ID calculation
        df = pd.concat([df, pd.DataFrame(new_rows)], ignore_index=True)

    # Save updated CSV
    df.to_csv(CSV_PATH, index=False)
    print(f"\n✓ Updated CSV: {len(new_rows)} new assets added")
    print(f"✓ Total assets: {len(df)}")

    return created_ids

def generate_qr_codes(unique_ids, domain):
    """Generate QR codes for new assets."""
    print(f"\n📱 Generating QR codes for {len(unique_ids)} assets...")

    QR_SVG_DIR.mkdir(parents=True, exist_ok=True)
    QR_PNG_DIR.mkdir(parents=True, exist_ok=True)

    for unique_id in unique_ids:
        qr_url = f'https://{domain}/?asset_id={unique_id}'

        # Create QR with high error correction
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=2,
        )
        qr.add_data(qr_url)
        qr.make(fit=True)

        # Save as SVG
        svg_img = qr.make_image(image_factory=SvgPathImage)
        svg_img.save(str(QR_SVG_DIR / f"qr_{unique_id}.svg"))

        # Save as PNG
        png_img = qr.make_image(fill_color="black", back_color="white")
        png_img.save(str(QR_PNG_DIR / f"qr_{unique_id}.png"))

        print(f"✓ QR codes for {unique_id}")

    print(f"\n✓ Generated {len(unique_ids) * 2} QR code files (SVG + PNG)")

def deploy_to_database(unique_ids):
    """Add new assets to Supabase database."""
    print(f"\n📊 Deploying {len(unique_ids)} assets to database...")

    # Load config
    config = load_config()
    db_host = 'db.cwsyhpiuepvdjtxaozwf.supabase.co'
    conn_str = f"postgresql://postgres:{config['db_password']}@{db_host}:5432/postgres"

    # Load CSV for the new assets
    df = pd.read_csv(CSV_PATH)
    new_assets = df[df['unique_id'].isin(unique_ids)]

    # Build INSERT statements
    for _, row in new_assets.iterrows():
        def fmt(val):
            if pd.isna(val) or val == '' or str(val) == 'nan':
                return 'NULL'
            return f"'{str(val).replace(chr(39), chr(39)+chr(39))}'"

        # Handle photo array
        photo_val = 'NULL'
        if not pd.isna(row['photo']) and row['photo'] != '' and str(row['photo']) != 'nan':
            photos = str(row['photo']).split('|')
            photo_array = ','.join([f"'{p.strip()}'" for p in photos if p.strip()])
            if photo_array:
                photo_val = f"ARRAY[{photo_array}]::TEXT[]"

        sql = f"""
        INSERT INTO assets (
            unique_id, id, name, product, community, place, gps,
            contact_household, paint, photo, number, notes,
            supply_date, last_checkin_date, created_time, qr_url
        ) VALUES (
            {fmt(row['unique_id'])}, {fmt(row['id'])}, {fmt(row['name'])}, {fmt(row['product'])},
            {fmt(row['community'])}, {fmt(row['place'])}, {fmt(row['gps'])}, {fmt(row['contact_household'])},
            {fmt(row['paint'])}, {photo_val}, {fmt(row['number'])}, {fmt(row['notes'])},
            {fmt(row['supply_date'])}, {fmt(row['last_checkin_date'])}, {fmt(row['created_time'])}, {fmt(row['qr_url'])}
        );
        """

        result = subprocess.run(
            ['psql', conn_str, '-c', sql],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print(f"✓ Deployed: {row['unique_id']}")
        else:
            print(f"✗ Error: {row['unique_id']}")
            print(result.stderr[:200])

    # Verify
    result = subprocess.run(
        ['psql', conn_str, '-c', 'SELECT COUNT(*) FROM assets;'],
        capture_output=True,
        text=True
    )

    print(f"\n✓ Database deployment complete!")
    print(result.stdout)

def main():
    """Main execution."""
    print("=" * 60)
    print("Add New Assets to Goods Tracker")
    print("=" * 60)

    # Example: Add 15 new Weave Beds
    new_assets = []

    # Prompt for details
    print("\n📝 Enter details for new assets:")
    print("(Press Enter to use defaults shown in brackets)\n")

    product = input("Product type [Weave Bed]: ").strip() or "Weave Bed"
    community = input("Community [Palm Island]: ").strip() or "Palm Island"
    number = int(input("Number of assets [15]: ").strip() or "15")
    name = input("Name/Recipient (optional): ").strip() or ""
    contact = input("Contact/Household (optional): ").strip() or ""
    paint = input("Paint color (optional): ").strip() or ""
    notes = input("Notes (optional): ").strip() or ""

    new_assets.append({
        'product': product,
        'community': community,
        'number': number,
        'name': name,
        'contact_household': contact,
        'paint': paint,
        'notes': notes
    })

    print(f"\n{'='*60}")
    print(f"Creating {number} new {product}(s) in {community}")
    print(f"{'='*60}\n")

    # Confirm
    confirm = input("Proceed? [Y/n]: ").strip().lower()
    if confirm and confirm != 'y':
        print("Aborted.")
        return

    # Get domain
    config = load_config()
    frontend_url = config.get('frontend_url', 'https://quiet-babka-e6d738.netlify.app')
    domain = frontend_url.replace('https://', '').replace('http://', '')

    # Step 1: Add to CSV
    created_ids = add_assets(new_assets)

    # Step 2: Generate QR codes
    generate_qr_codes(created_ids, domain)

    # Step 3: Deploy to database
    deploy_to_database(created_ids)

    print(f"\n{'='*60}")
    print("✨ Success! New assets added to system")
    print(f"{'='*60}")
    print(f"\n📋 Created IDs: {', '.join(created_ids[:5])}")
    if len(created_ids) > 5:
        print(f"    ... and {len(created_ids) - 5} more")

    print(f"\n📁 QR codes saved to:")
    print(f"   SVG: {QR_SVG_DIR}")
    print(f"   PNG: {QR_PNG_DIR}")

    print(f"\n🧪 Test URLs:")
    for i, uid in enumerate(created_ids[:3]):
        print(f"   https://{domain}/?asset_id={uid}")

    print(f"\n💡 Next steps:")
    print(f"   1. Run: goods-tracker qr export")
    print(f"   2. Print new QR codes from data/qr_export_packages/")
    print(f"   3. Apply to new {product}s")

if __name__ == '__main__':
    main()
