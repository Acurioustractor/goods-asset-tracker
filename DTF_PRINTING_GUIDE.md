# Goods Asset Tracker - DTF Iron-On QR Code Printing Guide

## 🎯 Overview

You have **404 assets** ready for DTF (Direct to Film) iron-on QR codes:
- **384 Beds** → 26 gang sheets (15 QRs per sheet)
- **20 Washers** → 2 gang sheets

**Total**: 28 sheets × $40/sheet = **~$1,120 AUD**

All QR codes point to: `https://goodsoncountry.netlify.app/?asset_id=GB0-###`

---

## 📁 Your Files Are Ready

All generated in: `/Volumes/OS_FIELD_B/Code/Goods Asset Register/data/qr_codes_dtf/`

```
qr_codes_dtf/
├── beds/                    # 384 bed QR code SVGs
├── washers/                 # 20 washer QR code SVGs
├── all_svg/                 # All 404 QR codes in one folder
└── batch_manifests/         # CSV files for each batch
    ├── beds_batch_01.csv    # IDs for sheet 1 (15 beds)
    ├── beds_batch_02.csv    # IDs for sheet 2
    ├── ...
    ├── beds_batch_26.csv    # Final beds sheet (9 beds)
    ├── washers_batch_01.csv # Sheet 27 (15 washers)
    └── washers_batch_02.csv # Sheet 28 (5 washers)
```

---

## 🎨 FIGMA WORKFLOW (Streamlined)

### Step 1: Set Up Figma File (5 minutes)

1. **Open Figma** → New File → Name: `Goods_DTF_GangSheets`

2. **Create Master Template Frame**:
   - Press `F` (Frame tool)
   - Right panel: Width: `580mm`, Height: `1000mm`
   - Name: `TEMPLATE_GangSheet`
   - Fill: None (transparent background)

3. **Add Guides**:
   - View → Rulers (on)
   - Drag guides: 10mm margin on all sides
   - Grid: View → Layout Grids → Grid (10mm spacing, optional)

4. **Install Fonts** (if not already):
   - Text tool (`T`) → Font dropdown → "Get more fonts"
   - Search: "Poppins" → Add to Figma

---

### Step 2: Design Core Elements (15 minutes)

#### A. "Goods" Wordmark

1. Text tool (`T`) → Type: `GOODS`
2. Font: **Poppins SemiBold (600)**, Size: **72pt**
3. Color: **Black (#000000)**
4. Optional: Add **white stroke** (Effects → Stroke → 0.5mm white, Outside)
5. Right-click → **Outline Stroke** (converts to vector)
6. Resize to: **80mm × 30mm**
7. Duplicate (`Cmd/Ctrl + D`) 6 times for filler logos
8. Group (`Cmd/Ctrl + G`) → Name: `Goods_Wordmark`

#### B. Care Instruction Stickers (For Washers)

1. Rectangle tool (`R`): **60mm × 40mm**, corner radius: **2mm**
2. Add washing icons (Plugins → Iconify → search "wash" / "iron" / "dryer")
3. Add text: Poppins Regular 8pt, e.g.:
   - "Wash Cold 30°C"
   - "No Bleach"
   - "Iron Low Heat"
4. Add small "Goods" logo (20mm)
5. Group → Name: `Sticker_WashCare`
6. Duplicate for variants (3-4 stickers total)

---

### Step 3: Import QR Codes (Batch by Batch)

#### For Batch 1 (Beds):

1. **Open manifest**: `data/qr_codes_dtf/batch_manifests/beds_batch_01.csv`
   - Note the 15 `unique_id` values (e.g., GB0-1, GB0-2, etc.)

2. **In Figma**:
   - File → Place Image (`Shift + Cmd/Ctrl + K`)
   - Navigate to: `data/qr_codes_dtf/beds/`
   - Select the 15 SVG files listed in batch_01 manifest
   - Click canvas to place all at once

3. **Resize QRs**:
   - Select all 15 → Right panel → Lock aspect ratio
   - Width: **50mm**, Height: **50mm**

4. **Add White Backing** (critical for scanability on dark fabric):
   - Rectangle (`R`) → **52mm × 52mm**
   - Fill: **White (#FFFFFF)**
   - Duplicate 15 times
   - Place one behind each QR (Right-click → Send to Back)

5. **Add Labels**:
   - Text (`T`) → Below each QR
   - Type the `unique_id` (e.g., "GB0-1")
   - Font: Poppins 6pt, Color: Black (50% opacity)

6. **Group Each QR**:
   - Select: QR + white backing + label
   - `Cmd/Ctrl + G` → Name: `QR_GB0-1` (use actual ID)

---

### Step 4: Layout Gang Sheet (10 minutes per sheet)

**Goal**: Fit 15 QRs + 3-4 logos/stickers per 580mm × 1000mm sheet

#### Efficient Grid Layout:

```
┌─────────────────────────────────────────┐
│ Top (0-250mm):                          │
│   4 QRs in row (50mm each + 10mm gap)  │
│   1 Goods logo (80mm) top-right        │
├─────────────────────────────────────────┤
│ Middle 1 (250-500mm):                   │
│   4 QRs in row                          │
│   1 Care sticker (60mm) mid-left       │
├─────────────────────────────────────────┤
│ Middle 2 (500-750mm):                   │
│   4 QRs in row                          │
│   1 Goods logo variant (80mm)          │
├─────────────────────────────────────────┤
│ Bottom (750-1000mm):                    │
│   3 QRs + 1 logo + 1 sticker            │
│   Extra buffer space (safety margin)   │
└─────────────────────────────────────────┘
```

#### Use Auto Layout (Fast):

1. Select all 15 QR groups
2. Right panel → Auto Layout
3. Settings:
   - Direction: **Horizontal** wrapping
   - Horizontal padding: **10mm**
   - Vertical padding: **10mm**
   - Alignment: Top-left

4. Manually adjust: Drag logos/stickers into gaps between QR rows

5. **Enable Smart Guides**: View → Smart Guides (snaps to edges)

6. **Final Check**:
   - Zoom to 100% → Verify all elements within 580×1000mm frame
   - No overlaps
   - 10mm minimum clearance from edges

---

### Step 5: Duplicate for All Batches

1. **Template is done!**
   - Right-click frame → Duplicate (`Cmd/Ctrl + D`)
   - Rename: `Beds_Batch_01`

2. **For Batch 2**:
   - Duplicate template again → Rename: `Beds_Batch_02`
   - Delete old QRs
   - Import new 15 QRs from `beds_batch_02.csv` manifest
   - Re-layout (takes 5 mins if using same grid)

3. **Repeat for all 28 batches**:
   - 26 bed sheets
   - 2 washer sheets (add extra care stickers!)

**Time estimate**: 10 mins first sheet + 5 mins per subsequent = **~3 hours total**

---

### Step 6: Export for DTF Direct

1. **Select all frames** (all 28 gang sheets)

2. **Export Settings** (Right panel → Export):
   - Format: **PDF**
   - Scale: **3x** (ensures 300 DPI for print)
   - Background: **Transparent** (checked)
   - Compression: **None** (max quality)

3. **Export**:
   - Click **Export** → Save as: `Goods_DTF_GangSheets_ALL.pdf`
   - This creates a multi-page PDF (28 pages, one per sheet)

4. **Alternative** (if DTF Direct prefers separate files):
   - Export each frame individually
   - Name: `Goods_Bed_Batch_01.pdf`, `Goods_Bed_Batch_02.pdf`, etc.

---

## 🖨️ DTF DIRECT ORDER PROCESS

### Upload & Order:

1. **Go to**: [dtfdirect.com.au](https://dtfdirect.com.au)

2. **Product**: DTF Gang Sheet Transfers

3. **Size**: 58cm × 100cm (matches your 580mm × 1000mm Figma frames)

4. **Upload**: Your exported PDFs

5. **Settings**:
   - **Material**: DTF Transfer Film
   - **White Underbase**: YES (critical for QR scannability on dark fabrics)
   - **Finish**: Matte (better for fabric adhesion than gloss)
   - **Quantity**: 1 per sheet (28 total)
     - Optional: Order 2× per sheet for backups = 56 total

6. **Special Instructions** (add in notes):
   ```
   - QR codes require high contrast (black on white)
   - White underbase essential
   - Match previous Goods order if applicable
   - Priority shipping if available
   ```

7. **Cost Estimate**:
   - 28 sheets × $40/sheet = **$1,120**
   - Priority (+$10-20/sheet) = **+$280-560**
   - Shipping: **~$20-50**
   - **Total**: **$1,140 - $1,750**

8. **Turnaround**:
   - Standard: 5-7 business days
   - Priority: 2-3 business days

---

## 🧵 IRON-ON APPLICATION (After Printing)

### Materials Needed:
- Heat press or household iron
- Parchment/Teflon sheet
- Scissors (for cutting individual QRs)

### Process:

1. **Cut QR Codes**:
   - Cut individual QRs from gang sheet (leave 2-3mm border around white backing)
   - Cut logos/stickers as desired

2. **Position on Bed/Washer**:
   - **Beds**: Inside corner of frame (top right or bottom left)
   - **Washers**: Top panel or side (avoid high-friction areas)
   - Clean surface with alcohol wipe (remove dust)

3. **Heat Press Settings**:
   - Temperature: **165-175°C (330-350°F)**
   - Pressure: **Medium-Heavy**
   - Time: **10-15 seconds**
   - **Peel**: Hot or cold (check DTF Direct instructions - usually hot peel)

4. **Household Iron** (if no press):
   - Cotton setting (medium-high)
   - Firm, even pressure
   - 15-20 seconds
   - Use parchment paper protection

5. **Cure Time**: Wait 24 hours before washing/heavy use

---

## 📊 Quality Checks

### Before Ordering Print:

- [ ] All QR codes have white backing (52mm squares)
- [ ] Each QR has label with `unique_id`
- [ ] Logos/stickers evenly distributed
- [ ] No elements within 10mm of sheet edges
- [ ] Export at 3× scale (300 DPI equivalent)
- [ ] Transparent background confirmed

### After Receiving Prints:

- [ ] Scan 5 random QR codes with phone → Correct URL loads
- [ ] Check white underbase coverage (opaque)
- [ ] Cut test: Clean edges, no fraying
- [ ] Apply test iron-on to scrap fabric → Scan again

### After Application:

- [ ] QR scans successfully on bed/washer
- [ ] Adhesion strong (no peeling corners)
- [ ] Wash test (if possible): Survives 1-2 gentle washes

---

## 🔧 Troubleshooting

### QR Won't Scan After Iron-On:

**Possible causes**:
1. **Low contrast**: Ensure white underbase printed
2. **Fabric texture**: Try scanning from 15-20cm distance
3. **Iron heat**: If overheated, QR may distort → Re-apply at lower temp
4. **Damage**: Corner peeling exposes fabric → Re-press with parchment

**Solutions**:
- Use phone camera app (not QR scanner) - better focus
- Add extra white margin in Figma (54mm backing instead of 52mm)
- Test on fabric swatch before full production

### Logos Look Pixelated:

- **Check**: Did you export at 3× scale?
- **Fix**: Re-export as PDF with 3× or 4× multiplier
- **Figma fonts**: Ensure "Outline Stroke" applied (vectorized, not raster)

### Budget Exceeded:

**Cost-saving options**:
1. Reduce batches: Combine into fewer, denser sheets (20 QRs/sheet instead of 15)
   - Saves ~7 sheets → **-$280**
2. Skip logos/stickers initially → Print QRs only
   - Saves design time, focus on core function
3. DIY vinyl cutting: Buy QR vinyl stickers instead of DTF
   - **Cheaper** (~$0.50/QR) but **more labor** (manual application)

---

## 📞 Next Steps

1. **Review Figma Template** (I can create first sheet for you if helpful)
2. **Test QR Scan**: Open one SVG → Print on paper → Scan with phone
3. **Start Batch 1**: Design first gang sheet in Figma (15 beds)
4. **Get Quote**: Contact DTF Direct with 1-sheet sample export
5. **Full Production**: Once approved, complete all 28 sheets

Need help with:
- Figma template setup
- Batch import automation
- Design review before ordering

Just ask! 🚀
