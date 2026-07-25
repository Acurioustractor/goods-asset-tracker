#!/usr/bin/env python3
"""Build the GOC On Country Data & Figures Pack CSV for Matt's review.
Every row is (Section, Metric, Value, Unit, Status, Source, Notes).
Status vocab: verified | modelled | inferred | unverified | derived | placeholder.
All AUD ex-GST unless noted. Assembled 2026-07-23 from the sources cited per row."""
import csv, os

OUT = "/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-07-23-goc-financial-model-pack/goc-data-and-figures-pack.csv"

rows = []
def R(sec, metric, value, unit, status, source, notes):
    rows.append([sec, metric, value, unit, status, source, notes])

# ---------------------------------------------------------------------------
# A. ON COUNTRY DEPLOYMENT EVIDENCE (what is actually in community today)
# ---------------------------------------------------------------------------
S = "A. Deployment evidence (On Country, actuals)"
R(S,"Total beds deployed","540","beds","verified","assets register (Supabase cwsyhpiuepvdjtxaozwf), Ben rulings 2026-07-19","Live register = canon. 363 Basket + 177 Stretch.")
R(S,"Stretch beds deployed","177","beds","verified","assets register; asset-canonical.ts","Flagship product. Each diverts 20kg HDPE.")
R(S,"Basket beds deployed","363","beds","verified","assets register; asset-canonical.ts","First-gen product, now open-sourced. Not a plastic product.")
R(S,"Washing machines in community","22","units","verified","Ben ruling 2026-07-21; per-community map in asset-canonical.ts","Maningrida 8, Tennant Creek 9, Palm Island 4, Alice Springs 1, Darwin 0. Register holds 32 deployed rows (10 stale awaiting retire).")
R(S,"HDPE plastic diverted","3540","kg","derived","177 Stretch x 20kg (asset-canonical.ts)","Stretch beds only. Basket beds excluded (not plastic).")
R(S,"Beds MADE IN-HOUSE at farm production facility","40","Stretch beds","verified","Maningrida INV-0303; Ben ruling 2026-07-23","FACTORY PATH PROVEN, not modelled from zero: HDPE legs shredded + hot-pressed + CNC-routed on our own plant, then assembled, end-to-end at the farm. Deployed to Maningrida.")
R(S,"Communities served (with a deployed bed)","11","communities","verified","assets register","12 distinct communities touched.")
R(S,"Distinct communities touched","12","communities","verified","asset-canonical.ts","Served-with-a-bed = 11.")
# per community beds
S = "A1. Beds by community (Basket + Stretch)"
R(S,"Utopia / Urapuntja","147 (60 Basket + 87 Stretch)","beds","verified","register; 10-community-counts.md","Utopia confirmed 147 (Community OS 169 was wrong).")
R(S,"Tennant Creek","160 (130 Basket + 30 Stretch)","beds","verified","register; GB0-160 youth centre +1 Stretch","Incl. youth-centre bed GB0-160.")
R(S,"Palm Island","131 (131 Basket + 0 Stretch)","beds","verified","register","")
R(S,"Maningrida","58 (18 Basket + 40 Stretch)","beds","verified","register; INV-0303 (40 Stretch final)","")
R(S,"Kalgoorlie","20 (20 Basket + 0 Stretch)","beds","verified","register","")
R(S,"Alice Springs / Oonchiumpa","16 (1 Basket + 15 Stretch)","beds","verified","register","")
R(S,"Canberra","2 (0 Basket + 2 Stretch)","beds","verified","register","")
R(S,"Mount Isa","2 (2 Basket + 0 Stretch)","beds","verified","register","")
R(S,"Darwin","1 (1 Basket + 0 Stretch)","beds","verified","register","")
R(S,"Kununurra","2 (0 Basket + 2 Stretch)","beds","verified","register GB0-158; Ben ruling 2026-07-19","Recipient Aunty Jean O'Reera. Story consent held; counting separate.")
R(S,"Katherine","1 (0 Basket + 1 Stretch)","beds","verified","register GB0-159; delivered by Nic","")

# ---------------------------------------------------------------------------
# B. BILL OF MATERIALS (per Stretch bed) - verified from invoices
# ---------------------------------------------------------------------------
S = "B. Bill of materials, per bed (Buy-Kit path)"
R(S,"HDPE plastic kit (legs, cut & finished)","344.05","AUD/bed","verified","Defy INV-1602 (92 kits) + INV-1732 (50 kits)","THE swing number. Sydney-priced finished part. Raw floor ~$40-55.")
R(S,"Steel poles x2 (galv, 26.9mm OD)","27.00","AUD/bed","verified","DNA Steel Direct, Alice Springs; Notion BOM StretchBed v2","Quote valid to 31 Dec 2026. Invoices in Notion, not Xero mirror.")
R(S,"Canvas sleeping surface (cut+hemmed+sewn)","93.50","AUD/bed","verified","Centre Canvas, Alice Springs; 3 invoices 2026, 270 covers","Valid to 31 Dec 2026. $14,915 retag ACT-IN->ACT-GD pending; doesn't change rate.")
R(S,"End caps (4 x $0.80)","3.20","AUD/bed","verified","Hardware supplier","")
R(S,"Frame screws (16 x $0.065)","1.04","AUD/bed","verified","Coastal Fasteners Xero RB20247673190","")
R(S,"Frame bolts (2 x ~$0.50 M8)","1.00","AUD/bed","inferred","Coastal Fasteners; rate estimated","Only inferred BOM line; pending line-item OCR.")
R(S,"Direct materials total (Buy-Kit)","469.79","AUD/bed","verified","sum of BOM rows (1 line inferred)","Materials only. NOT a margin figure - add labour+freight.")
R(S,"Hardware subtotal (caps+screws+bolts)","5.24","AUD/bed","verified","01-bill-of-materials.md","")
# raw inputs
S = "B1. Raw inputs (if pressing in-house)"
R(S,"HDPE shred, 20kg @ $2.75/kg landed","55.00","AUD/bed","verified","Defy INV-1731 ($2.00/kg shred + $0.75/kg delivery)","OPEN: GoC Q&A Q10 says $1-2/kg x 25kg - reconcile qty AND rate before investor use.")
R(S,"Defy pre-pressed panel (each, x2)","200.00","AUD/bed-panel","verified","Defy INV-1731, 20 panels bulk","Panels path = $400/bed plastic. Worst value - avoid.")

# ---------------------------------------------------------------------------
# C. COST PER BED BY BUILD PATH (the primary lever)
# ---------------------------------------------------------------------------
S = "C. Cost per bed by build path (direct)"
R(S,"Buy-Kit (today) - direct total","534.79","AUD/bed","modelled","03-cost-model; full-cost-figures","Plastic $344.05 + steel $27 + canvas $93.50 + hw $5.24 + labour $40 + local freight $25. (Matt Inputs uses $684.79 marginal.)")
R(S,"Buy-Panels - direct total","584.07","AUD/bed","modelled","03-cost-model","Avoid - pay press margin, still finish.")
R(S,"Factory in-house - direct total","275.74","AUD/bed","modelled (process proven)","03-cost-model; Maningrida INV-0303","Plastic $55 + steel $27 + canvas $93.50 + hw $5.24 + diesel $15 + labour $80. PROCESS PROVEN via the 40-bed Maningrida in-house run; per-bed cost still modelled pending measured run actuals (time/diesel/yield).")
R(S,"Community-owned - direct total","270.74","AUD/bed","modelled (future path)","03-cost-model","Free plastic $0 + $130 fair-wage labour. ~parity with Factory (NOT cheaper). ON-COUNTRY community production not yet done (farm run proves in-house pressing, not remote community production).")
R(S,"Community labour band","100-160 (default 130)","AUD/bed","modelled","full-cost-figures","At band edges community direct = $240.74-$300.74.")

# ---------------------------------------------------------------------------
# D. MARGINAL COST & CONTRIBUTION (Matt Inputs sheet block 1)
# ---------------------------------------------------------------------------
S = "D. Marginal cost & contribution at $750"
R(S,"Selling price per bed","750","AUD/bed","verified","shop stretch-bed-single; held flat in model","Same price across all paths.")
R(S,"Buy-Kit marginal (incl. long-haul freight)","684.79","AUD/bed","modelled","03-cost-model sec C","Direct $534.79 + $150 long-haul.")
R(S,"Factory marginal","425.74","AUD/bed","modelled","03-cost-model sec C","$275.74 + $150 freight.")
R(S,"Community marginal","420.74","AUD/bed","modelled","03-cost-model sec C","$270.74 + $150 freight.")
R(S,"Contribution/bed - Buy-Kit","65.21","AUD/bed","modelled","derived $750-$684.79","Too thin to cover fixed block at realistic volume.")
R(S,"Contribution/bed - Factory","324.26","AUD/bed","modelled","derived","")
R(S,"Contribution/bed - Community","329.26","AUD/bed","modelled","derived","")
R(S,"Break-even - Buy-Kit","1679","beds/yr","derived","109500 / 65.21","")
R(S,"Break-even - Factory","338","beds/yr","derived","109500 / 324.26","")
R(S,"Break-even - Community","333","beds/yr","derived","109500 / 329.26","")
# idiot index
S = "D1. Idiot index (markup capture)"
R(S,"First-principles bed floor (raw rates)","128.99","AUD/bed","modelled","03-cost-model sec B","Aspirational only, not achievable today.")
R(S,"Supply-chain markup in Buy-Kit direct","340.80","AUD/bed","modelled","$469.79 - $128.99","$289.05 of it sits in the HDPE kit alone.")
R(S,"HDPE idiot index (kit vs shred floor)","8.6x","ratio","modelled","$344.05 / $40","In-house legs saving $194.05/bed. The whole capital case.")
R(S,"In-house legs saving per bed","194.05","AUD/bed","modelled","kit $344.05 - in-house $150","The containerisation prize (materials level).")

# ---------------------------------------------------------------------------
# E. FACILITY CAPEX
# ---------------------------------------------------------------------------
S = "E. Central factory capex (to reach Factory path)"
R(S,"Shredder","15000-30000","AUD","modelled","03-cost-model sec D; equipment not firm-quoted","Matt Inputs default midpoint $22,500.")
R(S,"Hot press line","80000-150000","AUD","modelled","03-cost-model sec D","Matt default $115,000.")
R(S,"CNC router","15000-40000","AUD","modelled","03-cost-model sec D","Matt default $27,500.")
R(S,"Benches & tooling","2000","AUD","modelled","03-cost-model sec D","")
R(S,"Central factory capex GROSS (low-high)","112000-222000","AUD","modelled","03-cost-model sec D","Equipment midpoints; NOT firm-quoted.")
S = "E1. Sunk vs replication (MVF reconciliation, 2026-07-22)"
R(S,"Evidenced sunk hardware (Nic, used deals)","~75000","AUD","evidenced","connected sole-trader Xero, bill-level, 2026-07-22","Cleanly tagged ~$43.7K + ambiguous ~$12.5K + shredder $19.8K (physical only).")
R(S,"New community-site replication (market rates)","90800-123000 (mid ~105000)","AUD","mixed","MVF model 2026-07-22","Higher than sunk: Nic bought used. Use this for the funder ask.")
R(S,"SUPERSEDED: '$110,046 invested' working note","110046","AUD","superseded","earlier cost model","Ben's total-sunk-spend shorthand, NOT an evidenced building. Do not quote forward. Replaced by ~$75K sunk / ~$105K replication.")
R(S,"Shredder (Telford Smith)","19800","AUD","physical only","no Xero record found","Physically confirmed by Ben; invoice to locate. 'Owned, invoice to locate.'")
R(S,"Press+cold press+CNC (Circularity INV-0054)","32780","AUD inc GST","evidenced","Xero INV-0054 2025-12-17 ACT-GD","")
R(S,"Bigger CNC router (recent)","to confirm","AUD","open","MVF sec 4b; recently bought","Entity (sole trader or Pty Ltd?) + amount to confirm. Only ~$5,135 install booked.")
# container capex research (Matt Capex Estimates sheet)
S = "E2. 40ft container workshop capex (Matt desktop research 2026-07-22)"
R(S,"Container shell & fit-out (Subtotal A)","13950","AUD","web-sourced/allowance","Matt Capex Estimates sheet","New one-trip 40ft $6,800 + roller door $5,650 + vent/misc $1,500 (allowance).")
R(S,"Electrical & safety (Subtotal B)","18500","AUD","web-sourced/allowance","Matt Capex Estimates sheet","3-phase $5,500 + safety $1,000 + 30kVA genset $12,000 (INCLUDED per Ben 2026-07-22).")
R(S,"Freight to site, 2500km (Subtotal C)","5000","AUD","derived/allowance","Matt Capex Estimates sheet","Linehaul $3,600 + remote final leg $1,400 (allowance).")
R(S,"Installation & training per site (Subtotal D)","3000","AUD","user input","Matt, 2026-07-22","In-house. External Defy benchmark $6,000/session not used.")
R(S,"Matt 4-line container estimate total","40450","AUD","modelled","Matt Capex Estimates sheet","Desktop estimates, NOT quotes. Firm quotes required before QBE/investor use.")
R(S,"Matt total facility build cost (Inputs B27)","207450","AUD","modelled","Matt Inputs sheet","Equipment midpoints $167K + container fit-out $40,450. Charged in full in build year.")

# ---------------------------------------------------------------------------
# F. FIXED OPERATING BLOCK
# ---------------------------------------------------------------------------
S = "F. Fixed annual operating block"
R(S,"Founder production time (30 days x $560)","16800","AUD/yr","locked","Ben 2026-05-29","Only production days touch unit cost.")
R(S,"Kirmos facility (Sunshine Coast, 50% to beds)","27000","AUD/yr","verified","full-cost-figures; GoC Q&A Q1 confirms","$2,250/mo at 50%.")
R(S,"Admin","14700","AUD/yr","verified","v6 fixed block; GoC Q&A Q1 confirms","")
R(S,"Field travel","51000","AUD/yr","verified","v6 fixed block; GoC Q&A Q1 confirms","")
R(S,"Total fixed block (Sydney, rent $0)","109500","AUD/yr","verified","GoC Q&A Q1 confirms breakdown exactly","")
R(S,"Equipment maintenance (5% of equip subtotal)","8350","AUD/facility/yr","placeholder","GoC Q&A Q9; Matt selected 5% 2026-07-22","3-5% pending vendor quotes. Scales per facility in projection.")
S = "F1. Rent by location (alternative)"
R(S,"Sydney / Defy","0","AUD/yr","modelled","full-cost-figures","Inbound freight $0/bed.")
R(S,"Sunshine Coast (Kirmos)","54000","AUD/yr","modelled","full-cost-figures","Inbound freight $30/bed.")
R(S,"On Country","24000","AUD/yr","modelled","engine LOCATIONS.on_country.rentPerYear","RENT ONLY - not a full site fixed block. See section G.")
S = "F2. Founder time (full basis)"
R(S,"Founder day rate","560","AUD/day","locked","Ben 2026-05-29","Fair-market $140K/yr basis. Supersedes old $1,000/day.")
R(S,"Goods founder cost (150 days)","84000","AUD/yr","locked","Ben 2026-05-29","30 prod / 50 fundraising / 25 commercialisation / 45 governance. Only 30d ($16.8K) in unit cost.")
R(S,"Non-production founder time (excluded from unit cost)","67200","AUD/yr","locked","Ben 2026-05-29","Cost-of-capital + customer acquisition, not unit cost. Sensitivity, not headline.")

# ---------------------------------------------------------------------------
# G. COMMUNITY FACILITY OPERATING MODEL (DEWR-derived) - THE MISSING BLOCK
# ---------------------------------------------------------------------------
S = "G. Community facility operating model (from Oonchiumpa DEWR app)"
R(S,"DEWR total over 3 years","1995000","AUD/3yr","as-written","Oonchiumpa REAL Innovation Fund Stage Two app","Real costed community facility. NOTE: app's own totals don't reconcile (see open items).")
R(S,"Bare facility subtotal (no staff)","151666","AUD/yr","derived","DEWR lines: rent $60K + insurance $40K + admin $33.3K + upkeep $18.3K","The real fixed block the cost model was missing.")
R(S,"Fully staffed facility","341666","AUD/yr","derived","bare + manager $150K + trainer/WHS ~$40K","Manager could be $90K coordinator (assumption).")
R(S,"Employment program (brokerage/wages)","300000","AUD/yr","as-written","DEWR app","GRANT money. Never carried by bed sales. Jobs-are-the-dividend.")
R(S,"Cost model 'site bill' (rent only)","24000","AUD/yr","flagged","ask-surface.ts:205","OUT BY ~15x vs real facility cost. Needs correcting on live surface.")
S = "G1. Community-path break-even by facility bill"
R(S,"@ $24,000 (old rent-only)","73","beds/yr","derived","contribution $329.26","Misleadingly low.")
R(S,"@ $60,000 (rent+utilities)","182","beds/yr","derived","","")
R(S,"@ $151,666 (bare facility)","461","beds/yr","derived","","")
R(S,"@ $341,666 (staffed facility)","1038","beds/yr","derived","","Achievable only at ~30 beds/week capacity.")
S = "G2. Per-site capacity (THREE sources disagree - unresolved)"
R(S,"volume_ramp_v6 per_site_capacity","250","beds/yr","inferred","cost-model-scenarios.json (flagged assumption)","At 250/yr a site can't cover even bare facility.")
R(S,"Cost model throughput (5 beds/day x 250)","1250","beds/yr","modelled","03-cost-model","")
R(S,"DEWR app '~30 beds/week'","~1500","beds/yr","as-written","Oonchiumpa DEWR app","The 40-bed Maningrida run is a real throughput reference; a measured run confirms the sustained per-site rate.")

# ---------------------------------------------------------------------------
# H. HISTORICAL FINANCIALS (actuals base)
# ---------------------------------------------------------------------------
S = "H. Historical financials (Goods carve-out, workpaper)"
R(S,"Revenue - site figure","741111","AUD","workpaper","current canon (memory/MEMORY.md)","Superseded 04-doc's $732,210.79 billed.")
R(S,"Revenue - accountant-signed Goods-only carve-out","713827","AUD","accountant-signed","current canon","The ONLY externally-quotable revenue figure. Never quote the $403,901 'surplus' (entity P&L is a net loss).")
R(S,"Accounts receivable (AR)","143000","AUD","workpaper","current canon","(04-doc earlier showed $82,500 Rotary; updated figure $143K.)")
R(S,"ACCREC paid (received)","649710.79","AUD","verified","ACT-infra Xero, ACT-GD, 2026-05-29","Cash-received signal.")
R(S,"Goods expenses (single cash basis)","309126","AUD","verified","ACT-GD bank spend less 1300-Washer reclass, 2026-05-29","AP genuinely ~$0 owed (matching gap, not debt).")
R(S,"Operating surplus before founder time","340585","AUD","derived","$649,710.79 - $309,126","Model does NOT only work because founders unpaid.")
R(S,"Grant-funded share of revenue","~89%","%","verified","Day-5 revenue mix","Grant-funded social enterprise building toward commercial sustainability.")
R(S,"Top revenue - The Snow Foundation","402929.79","AUD","verified","Xero paid contacts","")
R(S,"Top revenue - Centrecorp Foundation","123332","AUD","verified","Xero paid contacts","")
R(S,"Top revenue - Vincent Fairfax Family Foundation","50000","AUD","verified","Xero paid contacts","")
R(S,"GST net payable (rough signal)","~29657","AUD","unverified","Xero total_tax 2026-05-29","Rough only; grants may be GST-free. Accountant confirms BAS.")

# ---------------------------------------------------------------------------
# I. CAPITAL STACK (placeholders - need confirming)
# ---------------------------------------------------------------------------
S = "I. Capital stack (base case - PLACEHOLDERS)"
R(S,"QBE program","up to 400000","AUD","placeholder","04-verified-financials; QBE Stage 2 terms","At-least-matched by signed external capital; repayable preferred. App Sept->Nov 2026.")
R(S,"SEFA","300000","AUD","placeholder","04-verified-financials","First lender target; ownership-gate-free.")
R(S,"Anchor philanthropy","500000","AUD","placeholder","04-verified-financials","")
R(S,"Matt model capital stack (illustrative)","600000","AUD","placeholder","Matt Inputs block 5","QBE match-eligible $250K + match $250K + other $100K. Split needs confirming with Ben/QBE.")
R(S,"Signed match-eligible capital to date","0","AUD","verified","funding pipeline 2026-07-23","0 open Goods-eligible grants; 51% First Nations ownership is the biggest unlock.")

# ---------------------------------------------------------------------------
# J. ENTITY & LEGAL
# ---------------------------------------------------------------------------
S = "J. Entity & legal"
R(S,"Trades today (sole trader)","Nicholas Marchesi ABN 21 591 780 066","-","verified","ASIC/ABN 2026-05-29","All historical Goods activity in the connected sole trader.")
R(S,"Go-forward operating company","A Curious Tractor Pty Ltd ACN 697 347 676 t/a Goods","-","verified","ASIC 2026-05-29","Migrates FY2026-27. Pty Ltd Xero not yet connected/populated.")
R(S,"Charity / DGR home","The Butterfly Movement Ltd ABN 22 155 132 684","-","verified","ABN Lookup 2026-05-06","DGR ONLY via Butterfly. From FY2026-27.")

# ---------------------------------------------------------------------------
# K. OPEN ITEMS / DECISIONS NEEDED (for Matt + Ben)
# ---------------------------------------------------------------------------
S = "K. Open items requiring a decision"
R(S,"HDPE shred qty & rate","$55 (20kg@$2.75) vs Q&A $1-2/kg x 25kg","-","open","GoC Q&A Q10","Inconsistent qty AND rate. Reconcile before investor use. Swings Factory/Community cost.")
R(S,"Site capex figure","$30,000 vs $100-150K","-","open","cost model conflict","$30K = increment on central factory; $100-150K = site from scratch. Decides if a community can buy in.")
R(S,"Per-site capacity","250 vs 1,250 vs 1,500 beds/yr","-","open","3 sources disagree","Decides whether community ownership is viable at all. A real 40-bed in-house run exists (Maningrida); a measured run confirms the sustained per-site rate.")
R(S,"Site manager cost","$150,000 vs $90,000 coordinator","-","open","community-facility-operating-model","Moves break-even ~180 beds.")
R(S,"Capital ask net vs gross","$112-222K gross vs ~$2-112K net","-","open","04-verified-financials sec 4","Never quote '$90-200K'. Pick gross or net.")
R(S,"Capital stack split","eligible/match/other unconfirmed","-","open","Matt Inputs block 5","Confirm with Ben + QBE program terms.")
R(S,"Measured cost/time run","40 beds ALREADY made in-house","-","open","Maningrida INV-0303","NOT 'zero beds': the Factory process is proven (40 beds pressed+assembled at the farm). Residual = capture per-bed actuals (time/diesel/yield) to lock $425.74 as MEASURED not modelled. Separate: on-country community production still to be done.")
R(S,"Shredder & 40ft container invoices","physical, not in connected Xero","-","open","MVF sec 5","Locate or note formally as 'owned, invoice to locate'.")
R(S,"Ownership handover","'$110,046 invested' not GoC-owned","-","open","GoC Q&A Q12","Funded $80K TFN + $20K ACT; handover targeted end-Aug 2026.")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["Section","Metric","Value","Unit","Status","Source","Notes"])
    w.writerows(rows)
print(f"Wrote {len(rows)} rows to {OUT}")
