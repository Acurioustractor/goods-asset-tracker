# Adding 15 New Beds - Complete Workflow

## 🎯 Goal
Add 15 new beds to the system, print QR codes, track delivery to Utopia Homelands/Alice Springs/Tennant Creek

---

## 📋 Step 1: Add Beds to Database (5 minutes)

### Option A: Add via Dashboard (Easiest - Coming Soon)
*You'll eventually have an "Add Asset" form on the dashboard*

### Option B: Add via CSV Import (Current Method)

1. **Create new beds CSV**:

```bash
cd "/Volumes/OS_FIELD_B/Code/Goods Asset Register"
python3 << 'EOF'
import csv
from datetime import datetime

# New bed details
new_beds = []
for i in range(1, 16):
    bed = {
        'unique_id': f'GB0-153-{i}',
        'id': 'GB0-153',
        'name': f'New Bed {i}',  # Update with actual recipient names during delivery
        'product': 'Basket Bed',  # or 'Weave Bed'
        'community': 'TBD',  # Will update during delivery
        'place': '',
        'gps': '',
        'contact_household': '',
        'paint': '',
        'photo': '',
        'number': 1,
        'notes': 'Pending delivery to Utopia/Alice/Tennant Creek',
        'supply_date': datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
        'last_checkin_date': '',
        'created_time': datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
        'qr_url': f'https://goodsoncountry.netlify.app/?asset_id=GB0-153-{i}'
    }
    new_beds.append(bed)

# Write to CSV
with open('data/new_beds_batch_153.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=new_beds[0].keys())
    writer.writeheader()
    writer.writerows(new_beds)

print("✓ Created data/new_beds_batch_153.csv with 15 beds")
EOF
```

2. **Import to database**:

```bash
python3 << 'EOF'
import json
import subprocess
import csv
from pathlib import Path

config = json.load(open(Path.home() / '.goods-tracker' / 'config.json'))
db_host = 'db.cwsyhpiuepvdjtxaozwf.supabase.co'
conn_str = f"postgresql://postgres:{config['db_password']}@{db_host}:5432/postgres"

# Read new beds
with open('data/new_beds_batch_153.csv', 'r') as f:
    beds = list(csv.DictReader(f))

# Insert each bed
for bed in beds:
    insert_sql = f"""
    INSERT INTO assets (unique_id, id, name, product, community, place, notes, supply_date, created_time, qr_url)
    VALUES (
        '{bed['unique_id']}',
        '{bed['id']}',
        '{bed['name']}',
        '{bed['product']}',
        'TBD',
        '',
        '{bed['notes']}',
        '{bed['supply_date']}',
        '{bed['created_time']}',
        '{bed['qr_url']}'
    );
    """

    result = subprocess.run(
        ['psql', conn_str, '-c', insert_sql],
        capture_output=True,
        text=True
    )

    if result.returncode == 0:
        print(f"✓ Added {bed['unique_id']}")
    else:
        print(f"✗ Error adding {bed['unique_id']}: {result.stderr}")

print("\n✓ All 15 beds added to database")
EOF
```

---

## 🎨 Step 2: Generate QR Codes (2 minutes)

```bash
python3 << 'EOF'
import qrcode
import qrcode.image.svg
from pathlib import Path

# Create directory
qr_dir = Path('data/new_beds_qr_codes')
qr_dir.mkdir(exist_ok=True)

# Generate 15 QR codes
for i in range(1, 16):
    unique_id = f'GB0-153-{i}'
    qr_url = f'https://goodsoncountry.netlify.app/?asset_id={unique_id}'

    # High error correction for fabric
    factory = qrcode.image.svg.SvgPathImage
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # 30% tolerance
        box_size=20,
        border=2,
        image_factory=factory
    )

    qr.add_data(qr_url)
    qr.make(fit=True)
    img = qr.make_image()

    # Save SVG
    img.save(str(qr_dir / f'qr_{unique_id}.svg'))

    print(f"✓ Generated qr_{unique_id}.svg")

print(f"\n✓ All 15 QR codes saved to: {qr_dir}")
print("\n📏 Size for printing: 50mm x 50mm each")
print("💡 Add 52mm white square backing for scannability")
EOF
```

---

## 🖨️ Step 3: Print QR Codes (2 options)

### Option A: Single DTF Gang Sheet (Best for Iron-On)

**Cost**: ~$40-50 for one 58cm x 100cm sheet

1. **Open Figma**:
   - Create frame: 580mm x 1000mm
   - Import all 15 SVG files from `data/new_beds_qr_codes/`

2. **Layout** (simple grid):
   ```
   Row 1: 5 QRs (50mm each + 10mm gaps)
   Row 2: 5 QRs
   Row 3: 5 QRs
   + Add "Goods" wordmarks as fillers
   ```

3. **Export**:
   - PDF, 3× scale (300 DPI)
   - Transparent background
   - Name: `Goods_NewBeds_Batch153.pdf`

4. **Order**:
   - [dtfdirect.com.au](https://dtfdirect.com.au)
   - DTF Gang Sheet: 58cm x 100cm
   - Quantity: 1 (or 2 for backup)
   - White underbase: YES
   - ~3-5 day turnaround

### Option B: Print Shop Labels (Cheaper, Faster)

**Cost**: ~$15-20 for 15 weatherproof stickers

1. **Export QRs as PNG**:
```bash
# Convert SVG to PNG (requires inkscape)
brew install inkscape

for i in {1..15}; do
    inkscape data/new_beds_qr_codes/qr_GB0-153-$i.svg \
        --export-filename=data/new_beds_qr_codes/qr_GB0-153-$i.png \
        --export-width=600 \
        --export-height=600
done
```

2. **Order from Sticker Mule / Avery**:
   - 50mm x 50mm weatherproof vinyl stickers
   - Upload 15 PNG files
   - Quantity: 1 each (15 total)
   - Finish: Matte (outdoor rated)

**Pros**: Cheaper, faster, peel & stick (no iron)
**Cons**: Less durable than DTF iron-on for fabric beds

---

## 📦 Step 4: Delivery Tracking Form (Simple Process)

### Create Delivery Checklist

When delivering beds, use this form to update the system:

```markdown
# Bed Delivery Checklist - Batch GB0-153

Delivery Date: ___________
Delivered By: ___________

| Asset ID | Recipient Name | Community | Address/Place | Contact | QR Applied? | Notes |
|----------|---------------|-----------|---------------|---------|-------------|-------|
| GB0-153-1 | | Utopia Homelands | | | ☐ | |
| GB0-153-2 | | Alice Springs | | | ☐ | |
| GB0-153-3 | | Tennant Creek | | | ☐ | |
| GB0-153-4 | | | | | ☐ | |
| GB0-153-5 | | | | | ☐ | |
| GB0-153-6 | | | | | ☐ | |
| GB0-153-7 | | | | | ☐ | |
| GB0-153-8 | | | | | ☐ | |
| GB0-153-9 | | | | | ☐ | |
| GB0-153-10 | | | | | ☐ | |
| GB0-153-11 | | | | | ☐ | |
| GB0-153-12 | | | | | ☐ | |
| GB0-153-13 | | | | | ☐ | |
| GB0-153-14 | | | | | ☐ | |
| GB0-153-15 | | | | | ☐ | |
```

### After Delivery: Update Database

```bash
# Example: Update bed GB0-153-1 delivered to Jane Smith in Utopia
python3 << 'EOF'
import json
import subprocess
from pathlib import Path

config = json.load(open(Path.home() / '.goods-tracker' / 'config.json'))
db_host = 'db.cwsyhpiuepvdjtxaozwf.supabase.co'
conn_str = f"postgresql://postgres:{config['db_password']}@{db_host}:5432/postgres"

updates = [
    {
        'id': 'GB0-153-1',
        'name': 'Jane Smith',
        'community': 'Utopia Homelands',
        'place': '12 Outstation Road, Utopia',
        'contact': '0412 345 678'
    },
    # Add more as delivered...
]

for bed in updates:
    update_sql = f"""
    UPDATE assets SET
        name = '{bed['name']}',
        community = '{bed['community']}',
        place = '{bed['place']}',
        contact_household = '{bed['contact']}',
        last_checkin_date = NOW(),
        notes = 'Delivered and QR applied'
    WHERE unique_id = '{bed['id']}';
    """

    result = subprocess.run(
        ['psql', conn_str, '-c', update_sql],
        capture_output=True,
        text=True
    )

    if result.returncode == 0:
        print(f"✓ Updated {bed['id']} - {bed['name']}")

print("\n✓ Delivery details updated in database")
EOF
```

---

## 🔍 Step 5: Verify Everything Works

1. **Test QR Code**:
   - Open `data/new_beds_qr_codes/qr_GB0-153-1.svg` in browser
   - Print on paper
   - Scan with phone → Should open:
     `https://goodsoncountry.netlify.app/?asset_id=GB0-153-1`
   - Form should show "Enter Asset ID" (since bed not yet in database as delivered)

2. **After adding to database**:
   - Scan again → Should show asset details + support form

3. **Dashboard Check**:
   - Visit dashboard → Filter by "TBD" community
   - Should see all 15 new beds listed
   - After delivery updates → Filter by "Utopia Homelands" etc.

---

## 💰 Cost Breakdown (For 15 Beds)

### Option 1: DTF Iron-On (Most Durable)
- **1 gang sheet**: $40-50
- **Shipping**: $10-15
- **Total**: **~$50-65**
- **Time**: 3-5 days
- **Durability**: ★★★★★ (survives washes, very durable)

### Option 2: Weatherproof Stickers (Quickest)
- **15 stickers**: $15-25
- **Shipping**: $5-10
- **Total**: **~$20-35**
- **Time**: 2-3 days (or instant at local print shop like Officeworks)
- **Durability**: ★★★☆☆ (good, but can peel over time)

### Option 3: DIY Paper Labels (Budget)
- **Print at home**: Free (ink + A4 labels)
- **Laminate pouches**: $5 (protect from water)
- **Total**: **~$5**
- **Time**: Immediate
- **Durability**: ★★☆☆☆ (needs replacement after ~6 months)

---

## 🎯 Recommended Workflow (Simplest)

For just 15 beds, I recommend:

1. **Quick Add**: Run the scripts above to add beds to database (5 mins)
2. **Print Locally**:
   - Export QRs as PNG
   - Print on weatherproof sticker paper at Officeworks ($10-15)
   - Cut into 50mm squares
3. **Deliver**: Use checklist, take photos, apply QR stickers
4. **Update**: Batch update database after delivery with recipient details

**Total time**: 30 minutes prep + delivery
**Total cost**: $10-15

---

## 📱 Quick Commands Cheat Sheet

```bash
# 1. Add 15 beds to database
cd "/Volumes/OS_FIELD_B/Code/Goods Asset Register"
# [Run Add Beds script from Step 1]

# 2. Generate QR codes
# [Run QR Generation script from Step 2]

# 3. Convert to PNG for printing
for i in {1..15}; do
    # Open in browser and screenshot, OR:
    # Use online converter: https://cloudconvert.com/svg-to-png
    echo "Convert qr_GB0-153-$i.svg to PNG"
done

# 4. After delivery - update one bed
# [Modify and run Update script from Step 4]
```

---

## ❓ Questions / Next Steps

**Want me to**:
1. Run the scripts now to add the 15 beds?
2. Generate the QR code files?
3. Create a Figma template for the gang sheet?
4. Set up an easier web form for delivery tracking?

Just let me know what you'd like to do first! 🚀
