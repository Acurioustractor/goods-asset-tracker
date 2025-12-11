# Professional Iron-On QR Code Design Guide
## For 15 New Beds (Batch GB0-153)

---

## 🎯 Overview

You have **15 QR codes** ready for professional DTF (Direct to Film) iron-on printing.

**Files Ready**: `/data/new_beds/qr_codes/` (15 SVG files: qr_GB0-153-1.svg through qr_GB0-153-15.svg)

**Goal**: Design one professional 58cm × 100cm gang sheet that includes:
- 15 QR codes with white backing (for dark fabric scanability)
- Asset ID numbers below each QR (e.g., "GB0-153-1")
- Goods logo as visual filler (brand recognition)
- Professional, clean layout suitable for iron-on application

**Cost Estimate**: Single gang sheet × $40 = **~$40 AUD** (or $10-15 if using vinyl stickers as alternative)

---

## 🎨 Professional Design Principles

### 1. **Color Palette** (Match Your Site's Professional Design)
- **QR Codes**: Black on white (#000000 on #FFFFFF)
- **Asset IDs**: Dark gray (#1a1a1a) or black
- **Goods Logo**: Black with optional white stroke for contrast
- **Background**: Transparent (for DTF printing)

### 2. **Typography**
- **Font**: Poppins (clean, modern, professional)
  - Asset IDs: Poppins Regular or Medium, 8-10pt
  - Goods Logo: Poppins SemiBold (600) or Bold (700), 48-72pt

### 3. **Spacing & Breathing Room**
- Minimum 10mm margins from sheet edges (print safety)
- 8-10mm gap between QR codes (prevents cutting errors)
- 3-5mm gap between QR and asset ID label
- 2mm border around white QR backing (ensures full white coverage)

### 4. **Hierarchy**
- **Primary Element**: QR code (50mm × 50mm)
- **Secondary Element**: Asset ID label (clear, readable)
- **Tertiary Element**: Goods logo (brand filler, not distracting)

---

## 📐 Figma Setup (Step-by-Step)

### Step 1: Create Master Frame (2 minutes)

1. **Open Figma** → New File → Name: `Goods_Beds_Batch153_IronOn`

2. **Create Gang Sheet Frame**:
   - Press `F` (Frame tool)
   - Right panel:
     - Width: `580mm`
     - Height: `1000mm`
   - Name: `Batch_153_GangSheet`
   - Fill: **None** (transparent background for DTF)

3. **Add Safety Guides**:
   - View → Rulers (on)
   - Drag guides: 10mm margin on all sides (creates safe print area)

---

### Step 2: Design Core Elements (10-15 minutes)

#### A. Import QR Codes

1. **Import All 15 QRs**:
   - File → Place Image (`Shift + Cmd/Ctrl + K`)
   - Navigate to: `data/new_beds/qr_codes/`
   - Select all 15 SVG files (qr_GB0-153-1.svg through qr_GB0-153-15.svg)
   - Click canvas to place

2. **Resize QRs** (Critical for scanability):
   - Select all 15 QR codes
   - Right panel → Lock aspect ratio ✓
   - Set: **50mm × 50mm** (optimal size for bed frames)
   - This size balances scanability with physical space on bed

3. **Add White Backing** (Essential for dark fabric):
   - Rectangle tool (`R`) → Create **52mm × 52mm** square
   - Fill: **White (#FFFFFF)**
   - Duplicate 15 times (`Cmd/Ctrl + D`)
   - Place one behind each QR code:
     - Select QR + white square
     - Right-click white square → **Send to Back**
     - Center-align: Select both → Right panel → Align center (both axes)

#### B. Add Asset ID Labels

1. **Text Labels**:
   - Text tool (`T`) → Type: `GB0-153-1`
   - Font: **Poppins Regular or Medium**
   - Size: **8pt** (9pt if you want more prominence)
   - Color: **#1a1a1a** (dark gray) or **#000000** (black)
   - Optional: Reduce opacity to 70% for subtlety

2. **Position Below Each QR**:
   - Place 3-5mm below white backing
   - Center-align with QR code
   - Duplicate and update text for each asset (GB0-153-2, GB0-153-3, etc.)

3. **Group Each QR Set**:
   - Select: White backing + QR code + label
   - `Cmd/Ctrl + G` → Name: `QR_GB0-153-1` (use actual ID)
   - Repeat for all 15 QRs

#### C. Create Goods Logo

**Option 1: Simple Wordmark** (Recommended - Clean & Professional)

1. Text tool (`T`) → Type: `GOODS`
2. Font: **Poppins SemiBold (600)**, Size: **60pt**
3. Color: **Black (#000000)**
4. Optional: Add white stroke for contrast on dark backgrounds
   - Effects → Stroke → 1mm white, Outside
   - Right-click → **Outline Stroke** (converts to vector)
5. Resize to: **70mm × 25mm** (adjust proportionally)
6. Duplicate 2-3 times for filler (scatter on sheet)

**Option 2: Logo with Tagline** (If you have existing brand assets)

1. Import your existing Goods logo (if SVG available)
2. Add tagline below: "Indigenous-Made Quality" (Poppins Light, 6pt)
3. Group together
4. Size: 70-80mm wide

---

### Step 3: Layout Gang Sheet (15-20 minutes)

**Goal**: Fit 15 QR sets + 2-3 logos on 580mm × 1000mm sheet with clean spacing

#### Recommended Grid Layout:

```
┌─────────────────────────────────────────────────────┐
│ [10mm safety margin]                                 │
│                                                      │
│  QR1   QR2   QR3   QR4      [Goods Logo]            │  ← Row 1 (0-200mm)
│  153-1 153-2 153-3 153-4                            │
│                                                      │
│  QR5   QR6   QR7   QR8                              │  ← Row 2 (200-400mm)
│  153-5 153-6 153-7 153-8    [Goods Logo]            │
│                                                      │
│  QR9   QR10  QR11  QR12                             │  ← Row 3 (400-600mm)
│  153-9 153-10 153-11 153-12                         │
│                                                      │
│  QR13  QR14  QR15           [Goods Logo]            │  ← Row 4 (600-800mm)
│  153-13 153-14 153-15                               │
│                                                      │
│ [Extra space / safety buffer]                       │  ← Bottom (800-1000mm)
└─────────────────────────────────────────────────────┘
```

#### Manual Layout Method:

1. **Enable Smart Guides**: View → Smart Guides (on) - helps with alignment

2. **Place Row 1** (4 QRs + 1 logo):
   - Drag first QR group to top-left (20mm from left, 20mm from top)
   - Place 3 more QRs horizontally with 10mm gaps
   - Add Goods logo to top-right corner

3. **Place Row 2** (4 QRs + 1 logo):
   - Start 150mm from top
   - Same 4-QR pattern
   - Logo on right side

4. **Place Row 3** (4 QRs):
   - Start 300mm from top
   - 4 QRs centered

5. **Place Row 4** (3 QRs + 1 logo):
   - Start 450mm from top
   - 3 QRs on left, logo on right

#### Alternative: Auto Layout (Faster)

1. Select all 15 QR groups
2. Right panel → **Auto Layout** (Shift + A)
3. Settings:
   - Direction: **Horizontal** wrapping
   - Horizontal padding: **10mm**
   - Vertical padding: **10mm**
   - Max width: **560mm** (580mm - 20mm margins)
4. Manually insert logos into gaps between rows

---

### Step 4: Final Checks (5 minutes)

**Quality Checklist**:
- [ ] All 15 QR codes have white backing (52mm × 52mm)
- [ ] All QR codes are exactly 50mm × 50mm
- [ ] Each QR has correct asset ID label below (GB0-153-1 through GB0-153-15)
- [ ] Labels are legible (8-10pt Poppins)
- [ ] All elements within 10mm safe margin (not touching edges)
- [ ] Logos evenly distributed (not crowding QRs)
- [ ] No overlapping elements
- [ ] Background transparent (no fill on main frame)

**Zoom Test**:
- Zoom to 100% → Verify all labels readable
- Zoom to 200% → Check QR code clarity (sharp edges)

---

### Step 5: Export for DTF Printing (5 minutes)

#### Export Settings:

1. **Select main frame** (`Batch_153_GangSheet`)

2. **Right panel → Export**:
   - Format: **PDF** (preferred) or **PNG**
   - Scale: **3x** (ensures 300 DPI print quality)
   - Background: **Transparent** (checked)
   - Compression: **None** (max quality)

3. **File Name**: `Goods_Batch153_IronOn_GangSheet.pdf`

4. **Click Export**

#### Alternative Export (if DTF vendor prefers PNG):

- Format: **PNG**
- Scale: **3x**
- Background: **Transparent**
- File name: `Goods_Batch153_IronOn_GangSheet.png`

---

## 🖨️ Printing Options

### Option 1: DTF Gang Sheet (Recommended for Durability)

**Provider**: DTF Direct Australia ([dtfdirect.com.au](https://dtfdirect.com.au))

**Product**: DTF Gang Sheet Transfer (58cm × 100cm)

**Settings**:
- Material: DTF Transfer Film
- **White Underbase**: **YES** (critical for QR scanability on dark beds)
- Finish: **Matte** (better adhesion than gloss)
- Quantity: 1 sheet

**Special Instructions** (add in order notes):
```
QR codes require high contrast (black on white).
White underbase essential for scanability on fabric.
15 individual labels for iron-on application to bed frames.
```

**Cost**: ~$40 AUD + shipping (~$10-20)

**Turnaround**:
- Standard: 5-7 business days
- Priority: 2-3 business days (+$10-15)

**Total**: **$40-70** depending on shipping speed

---

### Option 2: Vinyl Stickers (Budget Alternative)

**Provider**: Print shops (Officeworks, Vistaprint) or online (StickerMule, Sticker You)

**Product**: Vinyl stickers (waterproof, outdoor-rated)

**Pros**:
- Cheaper (~$10-15 for 15 stickers)
- Faster turnaround (1-3 days)
- Easy application (peel & stick)

**Cons**:
- Less durable on fabric (may peel after washing)
- Not as professional-looking as iron-on

**Settings**:
- Size: 60mm × 70mm (includes QR + label)
- Material: Vinyl (waterproof)
- Cut: Kiss-cut (individual stickers)

**Cost**: **$10-15** + shipping

---

### Option 3: DIY Iron-On Paper (Lowest Cost)

**Materials Needed**:
- Iron-on transfer paper (Avery, HP) - $10-15 for 10 sheets
- Inkjet or laser printer (check paper compatibility)
- Household iron or heat press

**Pros**:
- Immediate availability
- Very cheap (<$10 total)

**Cons**:
- QR codes may be lower quality (printer resolution limits)
- Less durable (may fade/crack after washing)
- Requires careful application (bubbles, alignment)

**Not recommended for long-term bed tracking** (consider for prototype/test only)

---

## 🧵 Iron-On Application Guide

### Materials Needed:
- DTF transfer sheets (cut into individual labels)
- Heat press or household iron
- Parchment paper or Teflon sheet
- Scissors (sharp, for clean cuts)

### Process:

#### 1. Cut Individual Labels
- Cut each QR + label from gang sheet
- Leave 2-3mm border around white backing
- Clean, straight cuts (no jagged edges)

#### 2. Position on Bed Frame
- **Best Location**: Inside corner of bed frame (top-right or bottom-left)
- **Alternative**: Headboard/footboard (if basket weave allows)
- **Clean surface**: Wipe with alcohol wipe, let dry completely

#### 3. Heat Press Settings
- **Temperature**: 165-175°C (330-350°F)
- **Pressure**: Medium-Heavy
- **Time**: 10-15 seconds
- **Peel**: Hot peel (check DTF Direct instructions - usually hot)

#### 4. Household Iron (if no press)
- **Setting**: Cotton (medium-high)
- **Pressure**: Firm, even pressure (no steam)
- **Time**: 15-20 seconds
- **Protection**: Use parchment paper over transfer

#### 5. Post-Application
- Let cool for 30 seconds
- Peel carrier film slowly at 45-degree angle
- Press with parchment paper for 5 more seconds (seal edges)
- **Cure time**: Wait 24 hours before heavy use or washing

---

## 📊 Import Beds to Database

After printing, you'll need to add these 15 beds to your live system so QR codes work when scanned.

### Quick Import Method:

```bash
# From project root
cd "/Volumes/OS_FIELD_B/Code/Goods Asset Register"

# Import using psql
psql "$(cat /tmp/conn_str.txt)" << 'EOF'
\copy assets(unique_id, id, name, product, community, place, gps, contact_household, paint, photo, number, notes, supply_date, last_checkin_date, created_time, qr_url) FROM 'data/new_beds/batch_153.csv' CSV HEADER;
EOF
```

**Verify Import**:
```sql
-- Check all 15 beds imported
SELECT COUNT(*) FROM assets WHERE id = 'GB0-153';
-- Should return: 15

-- View the new beds
SELECT unique_id, name, community, qr_url FROM assets WHERE id = 'GB0-153';
```

---

## 📝 Delivery Tracking Workflow

### When Beds Are Delivered:

1. **Before Delivery**:
   - Status: "Pending Delivery" (already set in CSV)
   - QR codes already ironed on bed frames

2. **During Delivery** (Update database):
   ```sql
   -- Update specific bed when delivered
   UPDATE assets
   SET
     name = 'John Smith',  -- Recipient name
     community = 'Alice Springs',  -- Actual delivery location
     place = '123 Main St, Alice Springs NT 0870',  -- Full address
     contact_household = '0412 345 678',  -- Contact number
     supply_date = NOW(),  -- Mark as delivered today
     notes = 'Delivered to household, placed in bedroom'
   WHERE unique_id = 'GB0-153-1';
   ```

3. **After Delivery** (Verify QR works):
   - Scan QR with phone → Should open support form
   - Form should show: GB0-153-1, recipient name, location
   - If working: Bed is tracked! ✅

---

## 💡 Professional Design Tips

### Do's:
✅ **Keep it simple** - QR code is the hero, everything else supports it
✅ **High contrast** - Black QR on pure white backing (no gray)
✅ **White backing essential** - Ensures scanability on dark fabric
✅ **Consistent spacing** - Makes sheet look professional, easier to cut
✅ **Test QR before printing** - Print one on paper, scan with phone
✅ **Readable labels** - 8-10pt minimum, dark gray or black
✅ **Brand consistency** - Use Poppins font (matches your website)

### Don'ts:
❌ **No gradients** - Solid colors only (DTF limitation)
❌ **No tiny text** - <6pt will be unreadable when ironed
❌ **No colored QR codes** - Black only (colored QRs scan poorly)
❌ **No busy backgrounds** - Transparent background, clean layout
❌ **No elements touching edges** - 10mm margin minimum
❌ **No oversized logos** - Logos are filler, not focal point

---

## 🎯 Expected Final Result

When done, your gang sheet should look like:

```
Professional, clean grid of 15 black-on-white QR codes
↓
Each QR: 50mm × 50mm on 52mm white square
↓
Asset ID below each QR in small, dark text
↓
Goods logos scattered as tasteful brand markers
↓
Plenty of breathing room between elements
↓
Looks like a professional product label sheet
```

**Visual Reference**:
- Similar to: Clothing care labels, electronics warranty stickers
- Style: Minimal, functional, professional
- Vibe: "Official product tracking system" not "DIY craft project"

---

## 📞 Next Steps

1. **Design in Figma** (15-30 mins):
   - Follow steps above
   - Import 15 QR SVGs from `data/new_beds/qr_codes/`
   - Add labels and logos
   - Export PDF at 3× scale

2. **Order Print** (5 mins):
   - Upload PDF to DTF Direct
   - Select 58cm × 100cm gang sheet
   - Enable white underbase
   - Checkout (~$40)

3. **Import Beds to Database** (2 mins):
   - Run psql import command
   - Verify 15 beds in system

4. **Apply to Beds** (During delivery):
   - Cut individual labels
   - Iron onto bed frames
   - Test QR scan

5. **Track Delivery**:
   - Update database with recipient info
   - Log first check-in

---

## 🔍 Testing Checklist

**Before ordering print**:
- [ ] All 15 QR codes imported to Figma
- [ ] All QRs have white backing (52mm × 52mm)
- [ ] All QRs sized correctly (50mm × 50mm)
- [ ] Asset IDs correctly labeled (GB0-153-1 through GB0-153-15)
- [ ] Logos placed tastefully (2-3 total)
- [ ] 10mm margins maintained
- [ ] PDF exported at 3× scale

**After receiving print**:
- [ ] Print one test label on paper → Scan QR → Verify URL opens
- [ ] Check white underbase (opaque, not translucent)
- [ ] Cut test label → Check clean edges

**After ironing on bed**:
- [ ] QR scans successfully from bed frame
- [ ] Form opens with correct asset ID
- [ ] Label adheres firmly (no peeling corners)

---

**Your 15 QR codes are ready to go!** 🚀

Files: `data/new_beds/qr_codes/qr_GB0-153-1.svg` through `qr_GB0-153-15.svg`

Next: Open Figma and start designing! Follow the steps above for a professional result.
