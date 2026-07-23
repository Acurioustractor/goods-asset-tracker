#!/usr/bin/env python3
"""Shadow calculation of the GOC 3-statement model. Locks the target numbers
and ASSERTS the balance sheet balances every year, before the xlsx formulas
are written to mirror this exact logic. All AUD ex-GST."""

# ---- Assumptions (defaults = recommended, override-able) ----
price = 750.0
cost = {'kit': 684.79, 'factory': 425.74, 'community': 420.74}
factories = 1
beds_per_factory = 500
beds_per_container = 500
kit_max = 100
util = 0.40                      # first-year utilisation
new_containers = {1:1, 2:0, 3:0, 4:1, 5:2}
fixed_block = 109500.0           # central Pot-1 overhead
equip_subtotal = 167000.0
maint_pct = 0.05
facility_build = 207450.0        # per new container (incl. its equipment)
opening_plant = 75000.0          # sunk MVF hardware (evidenced)
life = 10
debtor_days = 30; creditor_days = 30; inventory_days = 45
opening_cash = 50000.0
tax_rate = 0.25
int_rate = 0.06
# capital stack draws
debt_draw = {1:300000.0, 2:400000.0, 3:0.0, 4:0.0, 5:0.0}   # SEFA Y1, QBE Y2
equity_draw = {1:500000.0, 2:0.0, 3:0.0, 4:0.0, 5:0.0}      # anchor philanthropy Y1
# Pot 2 (community rollout) - zeroed in base case
active_sites = {y:0 for y in range(1,6)}
bare_site = 151666.0; staff_uplift = 190000.0; program = 300000.0
grant_income = {y:0.0 for y in range(1,6)}

YEARS = [1,2,3,4,5]

# ---- Production ----
cont_oper = {}; run = 0
fac_beds={}; com_beds={}; kit_beds={}; tot={}; rev={}; cogs={}; maint={}; capex={}
for y in YEARS:
    run += new_containers[y]; cont_oper[y]=run
    fac_beds[y] = factories*beds_per_factory*(util if y==1 else 1)
    com_beds[y] = (cont_oper[y]-new_containers[y])*beds_per_container + new_containers[y]*beds_per_container*util
    inhouse = fac_beds[y]+com_beds[y]
    kit_beds[y] = 0 if inhouse>=kit_max else kit_max
    tot[y]=fac_beds[y]+com_beds[y]+kit_beds[y]
    rev[y]=tot[y]*price
    cogs[y]=kit_beds[y]*cost['kit']+fac_beds[y]*cost['factory']+com_beds[y]*cost['community']
    maint[y]=maint_pct*equip_subtotal*(factories+cont_oper[y])
    capex[y]=new_containers[y]*facility_build

# ---- PP&E / debt / equity roll-forwards ----
gross={}; accum={}; netppe={}; deprec={}; cumcapex=0; accprev=0
debt_close={}; debt_open={}; interest={}; dprev=0
contrib={}; cprev=opening_plant+opening_cash   # opening capital = sunk plant + opening cash
for y in YEARS:
    cumcapex+=capex[y]; gross[y]=opening_plant+cumcapex
    deprec[y]=gross[y]/life; accum[y]=accprev+deprec[y]; accprev=accum[y]
    netppe[y]=gross[y]-accum[y]
    debt_open[y]=dprev; debt_close[y]=dprev+debt_draw[y]; dprev=debt_close[y]
    interest[y]=debt_open[y]*int_rate
    contrib[y]=cprev+equity_draw[y]; cprev=contrib[y]

# ---- P&L ----
prod_ebitda={}; ebitda={}; ebit={}; npbt={}; tax={}; npat={}
pot2_net={}
loss_pool=0
re_prev=0; retained={}
for y in YEARS:
    prod_ebitda[y]=rev[y]-cogs[y]-fixed_block-maint[y]
    pot2_net[y]=grant_income[y]-(active_sites[y]*bare_site)-(active_sites[y]*staff_uplift+program*min(active_sites[y],1) if active_sites[y]>0 else 0)
    ebitda[y]=prod_ebitda[y]+pot2_net[y]
    ebit[y]=ebitda[y]-deprec[y]
    npbt[y]=ebit[y]-interest[y]
    # loss carryforward
    if npbt[y]>0:
        used=min(loss_pool,npbt[y]); taxable=npbt[y]-used; loss_pool-=used; tax[y]=taxable*tax_rate
    else:
        tax[y]=0.0; loss_pool+= -npbt[y]
    npat[y]=npbt[y]-tax[y]
    retained[y]=re_prev+npat[y]; re_prev=retained[y]

# ---- Working capital ----
AR={}; INV={}; AP={}
for y in YEARS:
    AR[y]=debtor_days/365*rev[y]
    INV[y]=inventory_days/365*cogs[y]
    AP[y]=creditor_days/365*(cogs[y]+fixed_block+maint[y])

# ---- Cash flow ----
cash={}; cfo={}; cfi={}; cff={}
ar_prev=0; inv_prev=0; ap_prev=0; cash_prev=opening_cash
for y in YEARS:
    cfo[y]=npat[y]+deprec[y]-(AR[y]-ar_prev)-(INV[y]-inv_prev)+(AP[y]-ap_prev)
    cfi[y]=-capex[y]
    cff[y]=debt_draw[y]+equity_draw[y]
    cash[y]=cash_prev+cfo[y]+cfi[y]+cff[y]
    ar_prev=AR[y]; inv_prev=INV[y]; ap_prev=AP[y]; cash_prev=cash[y]

# ---- Balance sheet + CHECK ----
print(f"{'':32}", *[f'Y{y:>10}' for y in YEARS])
def row(lbl, d): print(f"{lbl:32}", *[f'{d[y]:>11,.0f}' for y in YEARS])
row("Total beds", tot); row("Product revenue", rev); row("Bed COGS", cogs)
row("Production EBITDA", prod_ebitda); row("Depreciation", deprec)
row("Interest", interest); row("NPBT", npbt); row("Tax", tax); row("NPAT", npat)
print("-"*90)
row("Cash", cash); row("Accounts receivable", AR); row("Inventory", INV); row("Net PP&E", netppe)
assets={y:cash[y]+AR[y]+INV[y]+netppe[y] for y in YEARS}
row("TOTAL ASSETS", assets)
row("Accounts payable", AP); row("Borrowings", debt_close)
row("Contributed capital", contrib); row("Retained earnings", retained)
le={y:AP[y]+debt_close[y]+contrib[y]+retained[y] for y in YEARS}
row("TOTAL LIAB + EQUITY", le)
check={y:assets[y]-le[y] for y in YEARS}
row("BALANCE CHECK (must be 0)", check)
assert all(abs(check[y])<0.01 for y in YEARS), "BALANCE SHEET DOES NOT BALANCE"
print("\nOK: balance sheet balances all years.")
print(f"Opening capital (sunk plant {opening_plant:,.0f} + opening cash {opening_cash:,.0f}) = {opening_plant+opening_cash:,.0f}")
