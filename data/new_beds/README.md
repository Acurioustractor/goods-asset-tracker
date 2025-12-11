# Batch 153 - 15 New Beds - Print Package

## ✅ What's Ready

Your **automated print-ready gang sheet** has been generated!

### Files Created:

1. **[Goods_Batch153_DTF_GangSheet.pdf](Goods_Batch153_DTF_GangSheet.pdf)** (302 KB)
   - 58cm × 100cm gang sheet
   - 15 QR codes with white backing
   - Asset ID labels (GB0-153-1 through GB0-153-15)
   - 3 "GOODS" wordmark logos
   - **Ready to upload to printer**

2. **[batch_153.csv](batch_153.csv)**
   - 15 bed records
   - Ready to import to database

3. **qr_codes_png/** folder
   - 15 high-resolution PNG QR codes (600x600px)
   - Used in the PDF generation

4. **qr_codes/** folder
   - 15 scalable SVG QR codes
   - Backup for future use

---

## 🖨️ Printing Instructions

### Option 1: DTF Direct (Recommended - Most Durable)

1. **Go to**: [dtfdirect.com.au](https://dtfdirect.com.au)

2. **Product**: DTF Gang Sheet Transfers

3. **Upload**: [Goods_Batch153_DTF_GangSheet.pdf](Goods_Batch153_DTF_GangSheet.pdf)

4. **Settings**:
   - Size: **58cm × 100cm**
   - Material: **DTF Transfer Film**
   - White Underbase: **YES** ← Critical for scanability
   - Finish: **Matte** (better adhesion than gloss)
   - Quantity: **1 sheet**

5. **Special Instructions** (add in order notes):
   ```
   QR codes require high contrast (black on white).
   White underbase essential for scanability on fabric.
   15 individual labels for iron-on application to bed frames.
   ```

6. **Cost**: ~$40 AUD + shipping (~$10-20)

7. **Turnaround**:
   - Standard: 5-7 business days
   - Priority: 2-3 business days (+$10-15)

---

### Option 2: Vinyl Stickers (Budget Alternative)

**Provider**: Officeworks, Vistaprint, StickerMule, Sticker You

**Product**: Waterproof vinyl stickers

**File**: Use individual PNG files from `qr_codes_png/` folder

**Size**: 60mm × 70mm per sticker (includes QR + label)

**Cost**: ~$10-15 for 15 stickers

**Pros**: Cheaper, faster (1-3 days)
**Cons**: Less durable on fabric, may peel after washing

---

## 🧵 Iron-On Application

### Materials:
- DTF transfer sheets (cut into individual labels)
- Heat press or household iron
- Parchment paper or Teflon sheet
- Scissors

### Process:

1. **Cut Individual Labels**
   - Cut each QR + label from gang sheet
   - Leave 2-3mm border
   - Clean, straight cuts

2. **Position on Bed**
   - **Best location**: Inside corner of bed frame
   - Clean surface with alcohol wipe
   - Let dry completely

3. **Heat Settings**:
   - **Temperature**: 165-175°C (330-350°F)
   - **Pressure**: Medium-Heavy
   - **Time**: 10-15 seconds
   - **Peel**: Hot peel (check DTF Direct instructions)

4. **Household Iron** (if no press):
   - Cotton setting (medium-high)
   - Firm, even pressure
   - 15-20 seconds
   - Use parchment paper protection

5. **Post-Application**:
   - Wait 24 hours before heavy use or washing
   - Test QR scan immediately after cooling

---

## 💾 Database Import

Before delivery, import these 15 beds to your database so QR codes work when scanned.

### Quick Import:

```bash
cd "/Volumes/OS_FIELD_B/Code/Goods Asset Register"

# Import to database
psql "$(cat /tmp/conn_str.txt)" -c "\copy assets(unique_id, id, name, product, community, place, gps, contact_household, paint, photo, number, notes, supply_date, last_checkin_date, created_time, qr_url) FROM 'data/new_beds/batch_153.csv' CSV HEADER;"
```

### Verify Import:

```sql
-- Check all 15 beds imported
SELECT COUNT(*) FROM assets WHERE id = 'GB0-153';
-- Should return: 15

-- View the new beds
SELECT unique_id, name, community, qr_url
FROM assets
WHERE id = 'GB0-153'
ORDER BY unique_id;
```

---

## 📋 Delivery Workflow

### When Beds Are Delivered:

For each bed delivered, update the database:

```sql
UPDATE assets
SET
  name = 'John Smith',  -- Recipient name
  community = 'Alice Springs',  -- Actual location
  place = '123 Main St, Alice Springs NT 0870',  -- Address
  contact_household = '0412 345 678',  -- Contact
  supply_date = NOW(),  -- Mark as delivered today
  notes = 'Delivered, placed in bedroom'
WHERE unique_id = 'GB0-153-1';
```

### Test QR:
- Scan QR with phone
- Should open: `https://goodsoncountry.netlify.app/?asset_id=GB0-153-1`
- Form should show correct asset details
- ✅ If working: Bed is tracked!

---

## 🔄 Regeneration (If Needed)

If you need to regenerate the gang sheet (e.g., to change layout):

```bash
cd "/Volumes/OS_FIELD_B/Code/Goods Asset Register"

# Regenerate PNGs (if needed)
python3 scripts/generate_qr_png.py

# Regenerate PDF
python3 scripts/generate_dtf_gangsheet.py
```

New PDF will be created at: `data/new_beds/Goods_Batch153_DTF_GangSheet.pdf`

---

## 📞 Need Help?

- **PDF Issues**: Check that file is 302 KB and opens correctly
- **QR Not Scanning**: Ensure white underbase is enabled in print settings
- **Layout Changes**: Edit `scripts/generate_dtf_gangsheet.py` configuration section
- **Different Quantity**: Update CSV and regenerate

---

## ✅ Checklist

**Before Ordering Print**:
- [ ] PDF opens correctly (580mm × 1000mm)
- [ ] All 15 QR codes visible
- [ ] All asset IDs labeled (GB0-153-1 through 153-15)
- [ ] White backing around each QR
- [ ] 3 GOODS logos visible

**After Receiving Print**:
- [ ] Scan 3 random QR codes → URLs open correctly
- [ ] White underbase is opaque (not translucent)
- [ ] Cut edges are clean

**After Iron-On Application**:
- [ ] QR scans successfully from bed
- [ ] Form opens with correct asset ID
- [ ] Label adheres firmly (no peeling)

---

**Your print file is ready to go!** 🚀

Upload [Goods_Batch153_DTF_GangSheet.pdf](Goods_Batch153_DTF_GangSheet.pdf) to DTF Direct and you'll have professional iron-on QR codes in 5-7 days.
