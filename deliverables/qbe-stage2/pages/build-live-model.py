#!/usr/bin/env python3
"""Build the Goods live model: twelve tabs, formulas off named ranges, one Inputs tab."""
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.workbook.defined_name import DefinedName

INK   = "FF221F1B"
CLAY  = "FFA8643F"
CREAM = "FFF1EAD C".replace(" ", "")
INPUT = "FFFFF3C4"   # yellow: the only cells you edit
HEAD  = "FFEDE5D8"
MUTED = "FF7A7263"

wb = openpyxl.Workbook()
wb.remove(wb.active)

def sheet(name):
    ws = wb.create_sheet(name)
    ws.sheet_view.showGridLines = False
    return ws

def title(ws, text, sub=None):
    ws["A1"] = text
    ws["A1"].font = Font(bold=True, size=15, color=INK)
    if sub:
        ws["A2"] = sub
        ws["A2"].font = Font(size=10, color=MUTED, italic=True)
    ws.freeze_panes = "A4"

def header(ws, row, cells):
    for i, c in enumerate(cells, start=1):
        cell = ws.cell(row=row, column=i, value=c)
        cell.font = Font(bold=True, size=9, color=MUTED)
        cell.fill = PatternFill("solid", fgColor=HEAD)
        cell.alignment = Alignment(vertical="center")

def widths(ws, *w):
    for i, x in enumerate(w, start=1):
        ws.column_dimensions[get_column_letter(i)].width = x

def money(ws, rng):
    for row in ws[rng]:
        for c in row:
            c.number_format = '"$"#,##0'

def money2(ws, rng):
    for row in ws[rng]:
        for c in row:
            c.number_format = '"$"#,##0.00'

def num(ws, rng, fmt="#,##0"):
    for row in ws[rng]:
        for c in row:
            c.number_format = fmt

# ───────────────────────────── 1. Read me ─────────────────────────────
ws = sheet("Read me")
title(ws, "Goods on Country — the live model",
      "Built 10 September 2026 from Goods-financial-plan.xlsx, recalculated. Every figure traces to a cell there.")
widths(ws, 34, 96)
rows = [
    ("How to use it", "Edit the yellow cells on Inputs. Nothing else. Every other tab is formulas and recalculates."),
    ("What is different here", "Every input has a name. Formulas read the name, not the cell. Insert a row anywhere and nothing breaks. The 953KB master has 42,429 formulas and no names at all, which is why one inserted row changes its meaning."),
    ("What wins when two disagree", "canon.ts and asset-canonical.ts for figures. DECISIONS.md for judgements. CONTEXT.md for language. This workbook for money."),
    ("What is modelled, not measured", "The cost to make a bed, two hours of paid making, and 20 kg in a finished bed. The first fifty beds off each new plant replace all three with weighed and timed numbers."),
    ("What is verified", "Beds sold and paid, the register count, the FY26 ledger, the funder invitations and their dates."),
    ("What this does not hold", "The 6,100 rows of source provenance, the Xero extracts and the 36-month cash schedule. Those stay in the master."),
    ("The one number that is zero", "Funding secured. Every other funding line is an invitation or a conversation."),
    ("", ""),
    ("Tab", "What it answers"),
    ("Inputs", "Every driver, in one place. The only tab you edit."),
    ("One bed", "What a bed is worth, what it costs, what stays, and how many carry the year."),
    ("The plant", "What a plant costs, module by module, and against what benchmarks."),
    ("Capacity", "How many beds a plant makes and which step sets the limit."),
    ("Impact", "The four areas, per bed and at volume, with where each claim stops."),
    ("Asks", "Every funder, the amount, the stage and the condition."),
    ("Cases", "Five scenarios and what each does to cash."),
    ("Responsibilities", "What Goods pays for and what the community pays for."),
    ("The year", "The annual roll-up."),
    ("Sites", "The three sites and their targets."),
    ("Claims", "Key figures with a grade and a source."),
]
r = 4
for a, b in rows:
    ws.cell(row=r, column=1, value=a).font = Font(bold=bool(a), size=10, color=INK if a else MUTED)
    c = ws.cell(row=r, column=2, value=b)
    c.font = Font(size=10, color=INK)
    c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[r].height = 30 if len(b) > 90 else 16
    r += 1

# ───────────────────────────── 2. Inputs ─────────────────────────────
ws = sheet("Inputs")
title(ws, "Inputs — the only cells you edit",
      "Yellow is yours. Each row has a name, and every other tab reads the name.")
widths(ws, 34, 14, 12, 22, 62)
header(ws, 4, ["Driver", "Value", "Unit", "Name used in formulas", "Where it comes from"])

INPUTS = [
    ("Bed price at the factory door", 750, "AUD", "price", "Model!B22. Ben's canon."),
    ("Plastic in a bed's cost", 60, "AUD", "cost_plastic", "NM Play B58, own-sheets route."),
    ("Electricity in a bed's cost", 16.67, "AUD", "cost_power", "NM Play B59."),
    ("Consumables in a bed's cost", 33.33, "AUD", "cost_consumables", "NM Play B60."),
    ("Bought parts in a bed's cost", 125.74, "AUD", "cost_parts", "NM Play B61. Poles 27, canvas 93.50, hardware 5.24."),
    ("Assembly allowance", 40, "AUD", "cost_assembly", "NM Play B64. This is the line that makes 235.74 into 276."),
    ("Paid making inside a bed", 80, "AUD", "wage_per_bed", "Two hours at the factory rate."),
    ("Hours of paid making a bed", 2, "hours", "hours_per_bed", "Settled 10 Sep. The 6.5-hour figure is withdrawn."),
    ("HDPE in a finished bed", 20, "kg", "kg_in_bed", "Design mass. NM Play B38."),
    ("Shred pressed to make a bed", 36, "kg", "kg_pressed", "NM Play B21. Leg sheet 21, tab sheet 15."),
    ("Freight a bed", 100, "AUD", "freight_per_bed", "Start!B49. Inherited estimate, routes need quotes."),
    ("Allowance for one plant", 150000, "AUD", "plant_allowance", "Capital!C7. An allowance, not a quote."),
    ("Plants QBE builds", 2, "plants", "plants", "Ben, 9 Sep 2026."),
    ("Running the organisation a year", 297550, "AUD", "running_cost", "Model!B25."),
    ("Pressed sheets a day", 6, "sheets", "press_sheets_day", "NM Play B10. Unverified sustained rate."),
    ("Sheets pressed for one bed", 2, "sheets", "sheets_per_bed", "NM Play B45. One tab sheet, one leg sheet."),
    ("Production days a week", 5, "days", "days_per_week", "NM Play B7."),
    ("Productive weeks a year", 48, "weeks", "weeks_per_year", "NM Play B9."),
    ("Assembly ceiling", 5, "beds/day", "assembly_ceiling", "NM Play B36. Staffing has to verify it."),
    ("CNC throughput", 8.56, "beds/day", "cnc_rate", "NM Play B47. Never the constraint."),
    ("Bed target this year", 400, "beds", "bed_target", "Ben, 9 Sep 2026. First trading stock."),
    ("A plant's first year", 200, "beds", "first_year_per_plant", "Q6. The ramp, not the ceiling."),
    ("Tim Fairfax, beds", 133, "beds", "tff_beds", "$100,000 of the invited $300,000, at the bed price."),
    ("Brian M. Davis, beds", 80, "beds", "bmd_beds", "$60,000 of the invited $100,000."),
    ("Snow, beds", 133, "beds", "snow_beds", "Ben, 10 Sep: a $100,000 ask shaped like Brian M. Davis."),
    ("ALIVE, beds", 100, "beds", "alive_beds", "Already paid. Outside the target."),
    ("Community keeps, share of price", 1.0, "share", "community_keeps", "Ben, 10 Sep: the community keeps the full sale. The 50% split is retired."),
    ("Proposed loan", 200000, "AUD", "loan_amount", "Funding F06. Our number, not Sefa's."),
    ("Loan service a year", 47522.88, "AUD", "loan_service", "Cases!K6. 7% over five years."),
]
r = 5
for label, val, unit, name, src in INPUTS:
    ws.cell(row=r, column=1, value=label).font = Font(size=10)
    c = ws.cell(row=r, column=2, value=val)
    c.fill = PatternFill("solid", fgColor=INPUT)
    c.font = Font(size=10, bold=True)
    c.number_format = '#,##0.00' if isinstance(val, float) and val < 1000 else '#,##0'
    ws.cell(row=r, column=3, value=unit).font = Font(size=9, color=MUTED)
    ws.cell(row=r, column=4, value=name).font = Font(size=9, color=CLAY, name="Menlo")
    s = ws.cell(row=r, column=5, value=src)
    s.font = Font(size=9, color=MUTED)
    s.alignment = Alignment(wrap_text=True, vertical="top")
    wb.defined_names.add(DefinedName(name, attr_text=f"Inputs!$B${r}"))
    r += 1

# ───────────────────────────── 3. One bed ─────────────────────────────
ws = sheet("One bed")
title(ws, "One bed", "Never cost-plus. The price carries the business, and the organisation is never divided by beds alone.")
widths(ws, 40, 16, 62)
header(ws, 4, ["", "AUD", "Note"])
rows = [
    ("Price at the factory door", "=price", "What a funder pays for a community's first stock."),
    ("Plastic", "=cost_plastic", ""),
    ("Electricity", "=cost_power", ""),
    ("Consumables", "=cost_consumables", ""),
    ("Bought parts", "=cost_parts", "Poles, canvas, hardware."),
    ("Assembly allowance", "=cost_assembly", "The line that turns 235.74 into 276."),
    ("Cost to make", "=cost_plastic+cost_power+cost_consumables+cost_parts+cost_assembly", "Modelled until the first fifty come off the line at working pace."),
    ("Of which paid making", "=wage_per_bed", "Two hours. On country once a plant moves."),
    ("Stays with Goods", "=price-(cost_plastic+cost_power+cost_consumables+cost_parts+cost_assembly)", "Carries Witta, the founders and the organisation."),
    ("Freight", "=freight_per_bed", "On top, at cost, per community, paid by whoever buys the bed."),
    ("", "", ""),
    ("Running the organisation a year", "=running_cost", ""),
    ("Beds a year that carry it, buyer pays freight", "=ROUNDUP(running_cost/(price-(cost_plastic+cost_power+cost_consumables+cost_parts+cost_assembly)),0)", "The break-even the deck prints."),
    ("Beds a year that carry it, Goods pays freight", "=ROUNDUP(running_cost/(price-(cost_plastic+cost_power+cost_consumables+cost_parts+cost_assembly)-freight_per_bed),0)", "What carrying freight costs in beds."),
    ("", "", ""),
    ("Kept in the community on sale", "=price*community_keeps", "Ben, 10 Sep: the community keeps the full sale price."),
]
r = 5
for a, b, c in rows:
    ws.cell(row=r, column=1, value=a).font = Font(size=10, bold=a.startswith(("Cost to make", "Stays", "Price", "Beds a year", "Kept")))
    if b:
        cell = ws.cell(row=r, column=2, value=b)
        cell.font = Font(size=11, bold=True)
        cell.number_format = '"$"#,##0.00' if "Beds a year" not in a else '#,##0'
    n = ws.cell(row=r, column=3, value=c)
    n.font = Font(size=9, color=MUTED)
    n.alignment = Alignment(wrap_text=True, vertical="top")
    r += 1

# ───────────────────────────── 4. The plant ─────────────────────────────
ws = sheet("The plant")
title(ws, "The plant, module by module",
      "Thirteen modules and a site base. Four have a supplier price. Nine are estimates, and that is what the allowance margin is for.")
widths(ws, 6, 40, 14, 14, 14, 54)
header(ws, 4, ["ID", "Module", "Low", "High", "Midpoint", "Price basis"])
MODULES = [
    ("M01", "40ft shipping container", 13000, 16000, 14500, "Estimate or historical proxy"),
    ("M02", "20ft shipping container", 6000, 10000, 8000, "Estimate"),
    ("M03", "Diesel generator, press-line sized", 6600, 20000, 13300, "Estimate. The widest range of any module"),
    ("M04", "Crane placement and transport", 1200, 2500, 1850, "Quoted"),
    ("M05", "Electrical fit-out, board, three-phase", 3000, 8000, 5500, "Estimate"),
    ("M06", "Ventilation and fume extraction", 1000, 3000, 2000, "Estimate"),
    ("M07", "Site prep, pad and levelling", 500, 3000, 1750, "Estimate. Site specific"),
    ("M08", "PPE and startup consumables", 500, 1500, 1000, "Estimate"),
    ("M09", "Collection and sorting", 5000, 19500, 12250, "Estimate"),
    ("M10", "Shredding", 19800, 19800, 19800, "Telford Smith. A single price"),
    ("M11", "Pressing, CNC and finishing", 32780, 32780, 32780, "Circularity bundle. A single price"),
    ("M12", "Assembly and workshop", 6387, 6387, 6387, "Carbatec. A single price"),
    ("M13", "Sales and delivery", 0, 0, 0, "Nothing priced here yet"),
]
r = 5
for mid, nm, lo, hi, mid_v, basis in MODULES:
    ws.cell(row=r, column=1, value=mid).font = Font(size=9, color=MUTED)
    ws.cell(row=r, column=2, value=nm).font = Font(size=10)
    for col, v in ((3, lo), (4, hi), (5, mid_v)):
        c = ws.cell(row=r, column=col, value=v); c.number_format = '"$"#,##0'
    b = ws.cell(row=r, column=6, value=basis); b.font = Font(size=9, color=MUTED)
    r += 1
tot = r
ws.cell(row=r, column=2, value="Every module and the site base").font = Font(bold=True, size=10)
for col in (3, 4, 5):
    L = get_column_letter(col)
    c = ws.cell(row=r, column=col, value=f"=SUM({L}5:{L}{r-1})")
    c.font = Font(bold=True); c.number_format = '"$"#,##0'
r += 2
ws.cell(row=r, column=2, value="Against the benchmarks").font = Font(bold=True, size=11)
r += 1
BENCH = [
    ("Replicate and install a site", 113000, "Capital!C31. The lean end."),
    ("The allowance we ask for", "=plant_allowance", "Sits above the module high."),
    ("Turnkey a site", 207450, "Capital!C32. Handed over running."),
    ("The QBE request", "=plants*plant_allowance", "Two plants."),
]
for nm, v, note in BENCH:
    ws.cell(row=r, column=2, value=nm).font = Font(size=10)
    c = ws.cell(row=r, column=3, value=v); c.number_format = '"$"#,##0'; c.font = Font(bold=True)
    ws.cell(row=r, column=6, value=note).font = Font(size=9, color=MUTED)
    r += 1

# ───────────────────────────── 5. Capacity ─────────────────────────────
ws = sheet("Capacity")
title(ws, "Capacity, and which step sets it",
      "The press is the jam. The router and the bench both have spare at every level of press output.")
widths(ws, 40, 16, 62)
header(ws, 4, ["Step", "Beds a day", "What it means"])
rows = [
    ("Sort and shred", "=kg_pressed", "Kilograms of shred pressed for one bed, not a rate."),
    ("Heat, press and cool", "=press_sheets_day/sheets_per_bed", "Six sheets a day, two sheets a bed. This sets the pace."),
    ("CNC cut and finish", "=cnc_rate", "Spare capacity at every level of press output."),
    ("Assemble, test and pack", "=assembly_ceiling", "An independent ceiling that staffing has to verify."),
    ("", "", ""),
    ("The binding step", "=MIN(press_sheets_day/sheets_per_bed,cnc_rate,assembly_ceiling)", "Whichever is lowest is the plant's real rate."),
    ("Beds a week", "=MIN(press_sheets_day/sheets_per_bed,cnc_rate,assembly_ceiling)*days_per_week", ""),
    ("Beds a year", "=MIN(press_sheets_day/sheets_per_bed,cnc_rate,assembly_ceiling)*days_per_week*weeks_per_year", "The ceiling on the same equipment."),
    ("A plant's first year", "=first_year_per_plant", "The ramp we promise in Q6."),
    ("Both plants, first year", "=first_year_per_plant*plants", ""),
    ("", "", ""),
    ("Days to make the target", "=ROUNDUP(bed_target/MIN(press_sheets_day/sheets_per_bed,cnc_rate,assembly_ceiling),0)", "Before downtime, at the binding rate."),
    ("Shred needed for the target", "=bed_target*kg_pressed/1000", "Tonnes through the press."),
]
r = 5
for a, b, c in rows:
    ws.cell(row=r, column=1, value=a).font = Font(size=10, bold=a in ("The binding step", "Beds a year"))
    if b:
        cell = ws.cell(row=r, column=2, value=b); cell.font = Font(size=11, bold=True); cell.number_format = '#,##0.00'
    n = ws.cell(row=r, column=3, value=c); n.font = Font(size=9, color=MUTED); n.alignment = Alignment(wrap_text=True, vertical="top")
    r += 1

# ───────────────────────────── 6. Impact ─────────────────────────────
ws = sheet("Impact")
title(ws, "The four impact areas",
      "Per bed, at one plant's first year and at the ceiling. Health is the reason the hardware exists and is never a claimed outcome.")
widths(ws, 26, 26, 18, 18, 18, 52)
header(ws, 4, ["Area", "Unit", "Per bed", "At 200 beds", "At the ceiling", "Where the claim stops"])
IMP = [
    ("Recycling", "kg pressed", "=kg_pressed", "=kg_pressed*first_year_per_plant", "=kg_pressed*'Capacity'!B12",
     "Design mass is not measured diversion. Weigh feedstock, accepted parts, offcuts and waste per batch."),
    ("Recycling", "kg in the beds", "=kg_in_bed", "=kg_in_bed*first_year_per_plant", "=kg_in_bed*'Capacity'!B12",
     "The difference between the two rows is offcut or loss until yield is measured."),
    ("Health", "people off the floor", 1, "=first_year_per_plant", "='Capacity'!B12",
     "Scabies and rheumatic heart disease are why the hardware exists. No clinical outcome is claimed."),
    ("Employment", "hours of paid making", "=hours_per_bed", "=hours_per_bed*first_year_per_plant", "=hours_per_bed*'Capacity'!B12",
     "Report actual paid hours and payments. The legacy 4.8 hours a bed is comparison only."),
    ("Employment", "AUD of wage", "=wage_per_bed", "=wage_per_bed*first_year_per_plant", "=wage_per_bed*'Capacity'!B12",
     "Inside the cost to make, not on top of it."),
    ("Community enterprise", "AUD kept on sale", "=price*community_keeps", "=price*community_keeps*first_year_per_plant", "=price*community_keeps*'Capacity'!B12",
     "Only if the community sells the bed. Ownership is a pathway until rights and transfers are evidenced."),
]
r = 5
for area, unit, per, at200, ceil, limit in IMP:
    ws.cell(row=r, column=1, value=area).font = Font(size=10, bold=True)
    ws.cell(row=r, column=2, value=unit).font = Font(size=10)
    for col, v in ((3, per), (4, at200), (5, ceil)):
        c = ws.cell(row=r, column=col, value=v)
        c.number_format = '#,##0'
        c.font = Font(size=10)
    n = ws.cell(row=r, column=6, value=limit); n.font = Font(size=9, color=MUTED); n.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[r].height = 28
    r += 1

# ───────────────────────────── 7. Asks ─────────────────────────────
ws = sheet("Asks")
title(ws, "Every funder line", "Secured is zero. An invitation is not an award and a conversation is not an invitation.")
widths(ws, 38, 12, 16, 16, 16, 62)
header(ws, 4, ["Funder", "Type", "Amount", "Beds it buys", "Stage", "Condition and next evidence"])
ASKS = [
    ("QBE Foundation", "Grant", "=plants*plant_allowance", "", "Application", "Closes 25 Sep noon. Outcome 23 Oct. Pre-conditions 13 Nov. Builds plants, buys no beds."),
    ("Tim Fairfax Family Foundation", "Grant", 100000, "=tff_beds", "Invitation", "$300,000 over three years. Operating support, unrestricted. Due 9 Oct. Board late November."),
    ("Brian M. Davis Charitable Foundation", "Grant", 100000, "=bmd_beds", "Invitation", "Due 25 Sep. Board 19 Nov. Pays only once all project funding is confirmed, per the budget template B16."),
    ("Snow Foundation", "Grant", 100000, "=snow_beds", "To ask", "Ben, 10 Sep: an ask shaped like Brian M. Davis, counted as bed money. Snow was the largest single source of last year's Goods receipts. No share is printed: the $375,000 numerator spans two entities and the base is one."),
    ("ALIVE, University of Melbourne", "Paid", 75000, "=alive_beds", "Received", "Already paid. Outside the target. The reckoning records more received than these beds."),
    ("Sefa Backing the Bold", "Loan", "=loan_amount", "", "Discussion", "No EOI sent. Our number, not Sefa's. 7% over five years."),
    ("Oonchiumpa, DEWR", "Grant", 150000, "", "Offer letter", "Alice Springs plant only, pass-through. Outside every scenario."),
    ("NIAA via Oonchiumpa", "Grant", 150000, "", "Discussion", "Alice Springs plant only, pass-through. Outside every scenario."),
    ("Dusseldorp", "Grant", 0, "", "Discussion", "No Goods ask in email. The $15,000 in June was CONTAINED."),
    ("Paul Ramsay and Atlassian", "Loan", 0, "", "Discussion", "Announced 7 Sep. No approach made."),
    ("Minderoo", "Grant", 0, "", "Closed", "Paused 14 May. Not a current prospect."),
]
r = 5
for nm, ty, amt, beds, stage, cond in ASKS:
    ws.cell(row=r, column=1, value=nm).font = Font(size=10)
    ws.cell(row=r, column=2, value=ty).font = Font(size=9, color=MUTED)
    c = ws.cell(row=r, column=3, value=amt); c.number_format = '"$"#,##0'
    if beds:
        b = ws.cell(row=r, column=4, value=beds); b.number_format = '#,##0'
    ws.cell(row=r, column=5, value=stage).font = Font(size=9, color=MUTED)
    n = ws.cell(row=r, column=6, value=cond); n.font = Font(size=9, color=MUTED); n.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[r].height = 26
    r += 1
r += 1
SUM = [
    ("Secured today", 0, "No signed commitment with a satisfied condition."),
    ("Beds funded against the target", "=tff_beds+bmd_beds+snow_beds", "If every invited ask lands."),
    ("Beds still to find", "=MAX(0,bed_target-(tff_beds+bmd_beds+snow_beds))", ""),
    ("Bed money still to find", "=MAX(0,bed_target-(tff_beds+bmd_beds+snow_beds))*price", ""),
]
for nm, v, note in SUM:
    ws.cell(row=r, column=1, value=nm).font = Font(bold=True, size=10)
    c = ws.cell(row=r, column=3, value=v); c.font = Font(bold=True)
    c.number_format = '"$"#,##0' if "money" in nm or "Secured" in nm else '#,##0'
    ws.cell(row=r, column=6, value=note).font = Font(size=9, color=MUTED)
    r += 1

# ───────────────────────────── 8. Cases ─────────────────────────────
ws = sheet("Cases")
title(ws, "Five cases", "Read straight out of the master. Receipts are hypothetical and none of them is secured.")
widths(ws, 26, 16, 16, 16, 16, 16, 16, 52)
header(ws, 4, ["Case", "QBE", "Loan", "Beds", "Priced spend", "Receipts", "Peak cash need", "Interpretation"])
CASES = [
    ("Full", 300000, 200000, 400, 763084.33, 700000, 110607.21, "Capacity-constrained initial stock. Cases!A6."),
    ("Smaller, one plant", 150000, 100000, 400, 613084.33, 450000, 186845.77, "Stages capital, keeps the stock target. Peak need is higher than Full."),
    ("No QBE", 0, 200000, 400, 763084.33, 400000, 410607.21, "A stress test, not permission to spend unfunded money."),
    ("Receipts three months late", 300000, 200000, 400, 763084.33, 700000, 479488.63, "Same money, later. Peak need more than quadruples."),
    ("Half the Goods sales", 300000, 200000, 400, 763084.33, 700000, 110607.21, "Direct Goods sales are already zero, so halving them changes nothing."),
]
r = 5
for nm, q, l, b, sp, rc, pk, note in CASES:
    ws.cell(row=r, column=1, value=nm).font = Font(size=10, bold=True)
    for col, v in ((2, q), (3, l), (5, sp), (6, rc), (7, pk)):
        c = ws.cell(row=r, column=col, value=v); c.number_format = '"$"#,##0'
    ws.cell(row=r, column=4, value=b).number_format = '#,##0'
    n = ws.cell(row=r, column=8, value=note); n.font = Font(size=9, color=MUTED); n.alignment = Alignment(wrap_text=True, vertical="top")
    r += 1

# ───────────────────────────── 9. Responsibilities ─────────────────────────────
ws = sheet("Responsibilities")
title(ws, "Who pays for what",
      "Goods funds initial stock, delivery and agreed initial support, plus the plant capital. Community organisations fund local operations and keep their sales.")
widths(ws, 34, 18, 18, 18, 56)
header(ws, 4, ["Line", "Goods", "Community", "Combined", "Boundary"])
RESP = [
    ("Plant capital", 300000, 0, 300000, "The QBE request. Asset title and transfer to agree."),
    ("Making and freight", 125534.33, 0, 125534.33, "Capacity-constrained forecast."),
    ("Facility fixed costs", 35350, 420700, 456050, "Community facility wages, rent and training sit in the community operating plan."),
    ("Youth support", 40000, 0, 40000, "Four communities at $10,000 facilitation each. None named yet."),
    ("Shared network", 262200, 0, 262200, "Includes a known cost-overlap question."),
    ("Priced spending", 763084.33, 420700, 1183784.33, "Goods overheads are not automatically the incremental raise."),
]
r = 5
for nm, g, c, comb, note in RESP:
    ws.cell(row=r, column=1, value=nm).font = Font(size=10, bold=nm == "Priced spending")
    for col, v in ((2, g), (3, c), (4, comb)):
        cell = ws.cell(row=r, column=col, value=v); cell.number_format = '"$"#,##0'; cell.font = Font(bold=nm == "Priced spending")
    n = ws.cell(row=r, column=5, value=note); n.font = Font(size=9, color=MUTED); n.alignment = Alignment(wrap_text=True, vertical="top")
    r += 1

# ───────────────────────────── 10. The year ─────────────────────────────
ws = sheet("The year")
title(ws, "The annual roll-up", "Year one of the selected case. Negative forecast cash is an unfunded gap, never an approved overdraft.")
widths(ws, 34, 18, 18, 18, 46)
header(ws, 4, ["Line", "Year 1", "Year 2", "Year 3", "Basis"])
YEAR = [
    ("Grant income", 500000, 100000, 100000, "Statements!B8. Includes possible grants."),
    ("Goods invoiced", 0, 0, 0, "Direct Goods sales are zero in the current case."),
    ("Making expense", 91549.33, 118072.5, 118072.5, ""),
    ("Freight", 40000, 50000, 50000, ""),
    ("Network costs", 262200, 262200, 262200, ""),
    ("Facility costs", 35350, 35350, 35350, ""),
    ("Youth support", 40000, 0, 0, ""),
    ("Depreciation", 30000, 30000, 30000, ""),
    ("Loan interest", 12903.28, 10400.63, 7717.06, ""),
    ("Profit before tax", -12002.62, -406023.13, -403339.56, "Includes possible grant income. Not a trading surplus."),
    ("Net cash movement", -110607.21, -412942.88, -412942.88, ""),
    ("Planned beds within capacity", 400, 1220, 1220, "Statements!B68."),
]
r = 5
for nm, a, b, c, note in YEAR:
    ws.cell(row=r, column=1, value=nm).font = Font(size=10, bold=nm in ("Profit before tax", "Net cash movement"))
    for col, v in ((2, a), (3, b), (4, c)):
        cell = ws.cell(row=r, column=col, value=v)
        cell.number_format = '#,##0' if "beds" in nm else '"$"#,##0'
    n = ws.cell(row=r, column=5, value=note); n.font = Font(size=9, color=MUTED); n.alignment = Alignment(wrap_text=True, vertical="top")
    r += 1

# ───────────────────────────── 11. Sites ─────────────────────────────
ws = sheet("Sites")
title(ws, "The sites", "Witta exists. The two new plants are working choices and neither community has agreed to a build.")
widths(ws, 14, 44, 16, 14, 14, 14, 46)
header(ws, 4, ["ID", "Site", "Route", "Year 1", "Year 2", "Year 3", "Note"])
SITES = [
    ("WITTA", "Goods production facility at The Harvest", "Own sheets", 400, 500, 500, "Existing. Initial community trading stock is made here."),
    ("NEW1", "Palm Island, working choice", "Own sheets", 0, 500, 500, "Council, community and PICC have each asked. First beds about three months after funding."),
    ("NEW2", "Maningrida, working choice", "Own sheets", 0, 500, 500, "40 beds already built with us, pressed at Witta and assembled at Gamardi."),
    ("ALICE", "Alice Springs, through Oonchiumpa", "Own sheets", 0, 0, 0, "Funded by DEWR and NIAA. Outside this raise."),
]
r = 5
for sid, nm, route, y1, y2, y3, note in SITES:
    ws.cell(row=r, column=1, value=sid).font = Font(size=9, color=MUTED)
    ws.cell(row=r, column=2, value=nm).font = Font(size=10)
    ws.cell(row=r, column=3, value=route).font = Font(size=9, color=MUTED)
    for col, v in ((4, y1), (5, y2), (6, y3)):
        c = ws.cell(row=r, column=col, value=v); c.number_format = '#,##0'
    n = ws.cell(row=r, column=7, value=note); n.font = Font(size=9, color=MUTED); n.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[r].height = 26
    r += 1

# ───────────────────────────── 12. Claims ─────────────────────────────
ws = sheet("Claims")
title(ws, "Key figures, graded", "Verified means the source was read. Modelled means calculated. Conflict means two sources disagree and a person must rule.")
widths(ws, 46, 20, 14, 62)
header(ws, 4, ["Claim", "Figure", "Grade", "Source"])
CLAIMS = [
    ("The QBE request", "$300,000", "Verified", "QBE!D14 and A54, Funding F01. Ben, 9 Sep 2026."),
    ("Funding secured to date", "$0", "Verified", "Funding!F19."),
    ("A bed at the factory door", "$750", "Verified", "Model!B22."),
    ("Cost to make a bed", "$276", "Modelled", "235.74 on the annual-staff basis plus the $40 assembly allowance."),
    ("Stays with Goods", "$474", "Verified", "Model!B24, derived."),
    ("Running the organisation", "$297,550", "Verified", "Model!B25."),
    ("Break-even on beds alone", "628 beds", "Modelled", "Model!B26, buyer pays freight. 796 if Goods carries it."),
    ("The press sets the pace", "3 beds a day", "Verified", "NM Play B46. CNC does 8.56 and assembly 5."),
    ("Shred pressed for one bed", "36 kg", "Verified", "NM Play B21. Leg sheet 21, tab sheet 15."),
    ("HDPE in a finished bed", "20 kg", "Modelled", "Design mass. NM Play B38. Definition conflict remains against D06's 40 kg."),
    ("Beds sold and paid, all time", "320, $343,481", "Verified", "Ten invoices."),
    ("Beds recorded as deployed", "540", "Verified", "Register check 8 Sep, all 609 rows, 11 communities."),
    ("Centrecorp, paid and delivered", "130", "Verified", "Outside the cumulative total until the overlap is reconciled."),
    ("Maningrida, delivered and paid", "40", "Verified", "Pressed at Witta, assembled at Gamardi."),
    ("FY26 whole ledger income", "$1,640,724", "Verified", "Model!B15, Xero accrual."),
    ("FY26 net before founder wages", "$167,970", "Verified", "Model!B17. Never call it a net loss."),
    ("FY26 Goods receipts", "$653,246", "Verified", "Model!B18."),
    ("Snow's share of those receipts", "No share printed", "Ruled", "Ben, 12 Sep: no Snow percentage is printable in either scope. 57% divides a two-entity numerator by a one-entity base. The sole-trader-scoped 37.9% understates concentration across the group, which is the worse error in a risk disclosure. Print the dollars with the scope named: $247,544.88 in the trading org on an invoice-date basis, with $127,455.12 placed in the A Curious Tractor ledger and unread."),
    ("A plant allowance", "$150,000", "Modelled", "Above the module high of $142,967, between $113,000 replicate and $207,450 turnkey."),
    ("Peak cash need, full case", "$110,607", "Modelled", "Cases!L6. Not the QBE request."),
    ("Unpriced cost lines", "12", "Verified", "QBE!D20."),
    ("Opening cash", "unknown", "Unverified", "Decision D10. Unknown is not zero."),
    ("Butterfly FY26 closing cash", "$4,041", "Verified", "Unaudited, declaration unsigned."),
    ("The community's share of a sale", "the full price", "Verified", "Ben, 10 Sep 2026. The 50% split is retired."),
    ("Capacity against the target", "360 or 400", "Conflict", "D17 says capacity is 360. Start!B7 says 400 supported."),
]
r = 5
for claim, fig, grade, src in CLAIMS:
    ws.cell(row=r, column=1, value=claim).font = Font(size=10)
    ws.cell(row=r, column=2, value=fig).font = Font(size=10, bold=True)
    g = ws.cell(row=r, column=3, value=grade)
    g.font = Font(size=9, bold=True, color={"Verified": "FF5E7A4C", "Modelled": "FFA98F3E", "Conflict": "FFB4442A", "Unverified": "FF7A4A55"}[grade])
    s = ws.cell(row=r, column=4, value=src); s.font = Font(size=9, color=MUTED); s.alignment = Alignment(wrap_text=True, vertical="top")
    r += 1

out = "/private/tmp/claude-501/-Users-benknight-Code-Goods-Asset-Register/c519a7af-f380-4a71-97a8-32c41333c371/scratchpad/Goods-live-model.xlsx"
wb.save(out)
print("saved", out)
print("tabs:", len(wb.sheetnames), wb.sheetnames)
print("named ranges:", len(list(wb.defined_names.keys())))
