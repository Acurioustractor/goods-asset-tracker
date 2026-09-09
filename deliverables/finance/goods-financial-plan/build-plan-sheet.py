#!/usr/bin/env python3
"""Rebuild the 'Plan to July 2027' sheet in Goods-financial-plan.xlsx. Inputs (yellow) are reset to defaults; edit the defaults here, not the sheet, if they should persist."""
import openpyxl, datetime as dt, os
from openpyxl.workbook.properties import CalcProperties
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter as L
p=os.path.join(os.path.dirname(os.path.abspath(__file__)),"Goods-financial-plan.xlsx"); wb=openpyxl.load_workbook(p)
if "Plan to July 2027" in wb.sheetnames: del wb["Plan to July 2027"]
ws=wb.create_sheet("Plan to July 2027", index=wb.sheetnames.index("Bed calculator")+1)
B=Font(bold=True); H=Font(bold=True,size=13); Y=PatternFill("solid",fgColor="FFF2CC"); wrap=Alignment(wrap_text=True,vertical="top"); M="#,##0"
def put(r,a=None,b=None,c=None,inp=False,bold=False,head=False,fmt=None):
    if a is not None: ws.cell(r,1,a).font=H if head else (B if bold else Font())
    if b is not None:
        cell=ws.cell(r,2,b)
        if inp: cell.fill=Y
        if fmt: cell.number_format=fmt
        if bold: cell.font=B
    if c is not None: ws.cell(r,3,c).alignment=wrap
ws.column_dimensions["A"].width=60; ws.column_dimensions["B"].width=16; ws.column_dimensions["C"].width=62
for col in "DEFGHIJKLMNOP": ws.column_dimensions[col].width=13
put(1,"Plan to July 2027: every dollar in and out by month, the loan test, the asks, and the five and ten year view (Ben, 9 Sep 2026)",head=True)
put(2,"Yellow cells are inputs. Beds come from the Bed calculator; costs from Assumptions; funders from Funding and the ladder on Phase and raise. Price model: $750 a bed, $276 to make, $474 stays. Buyers who pay a community enterprise are not here by design: that money never reaches Goods.")
put(4,"A. Starting point and what can move",head=True)
put(5,"ALIVE bed money already in the bank, $ ex GST",75000,"INV-0342 paid 2 Jul 2026: 100 beds. The visits ($17,000) are separate. These beds come out of Witta stock in November; the $474 a bed is already Goods' to keep.",inp=True,fmt=M)
put(6,"Other Goods cash to start with, $",0,"Goods trades in Nic's ledger ($143,997 cash, all ACT). Enter the Goods share once the carve-out is split.",inp=True,fmt=M)
put(7,"Founder wages a year, $","=Assumptions!B23","Assumptions B23",fmt=M)
put(8,"Extra founder wages a year, $ (play)",0,"",inp=True,fmt=M)
put(9,"Field travel a year, $","=Assumptions!B26",fmt=M)
put(10,"Consulting and accounting a year, $","=Assumptions!B27",fmt=M)
put(11,"Marketing a year, $","=Assumptions!B25",fmt=M)
put(12,"Extra marketing a year, $ (play)",0,"",inp=True,fmt=M)
put(13,"Witta rent and upkeep a year, $","='Phase and raise'!B9",fmt=M)
put(14,"Running the business a month, $","=(B7+B8+B9+B10+B11+B12+B13)/12",fmt=M,bold=True)
put(15,"Freight to community a bed, $","='Bed calculator'!B45",fmt=M)
put(16,"Freight recovered from whoever pays for the bed, share",0,"0 = Goods carries freight; 1 = charged on top and recovered",inp=True,fmt="0%")
put(17,"Facilitation a community, $","=Assumptions!B44",fmt=M)
put(18,"Communities facilitated","=Sites!O6")
put(19,"Plant cost, each, $","=Assumptions!B37/2",fmt=M)
put(21,"When money lands (month) and how much",bold=True); ws.cell(21,2,"Month").font=B; ws.cell(21,3,"Amount, $").font=B; ws.cell(21,4,"Include").font=B; ws.cell(21,5,"Kind").font=B; ws.cell(21,6,"Basis").font=B
funds=[("QBE, two plants",dt.date(2026,12,1),"=Funding!F6",1,"grant","Conditional 23 Oct, pre-conditions 13 Nov"),
 ("Tim Fairfax, year one (operating support)",dt.date(2026,12,1),"=Funding!F7",1,"grant","Board late Nov"),
 ("Brian M. Davis, 80 beds",dt.date(2027,1,1),"='Phase and raise'!B114",1,"beds","Board 19 Nov; pays once project funding is confirmed"),
 ("Brian M. Davis, facilitation",dt.date(2027,1,1),"=Funding!F8-'Phase and raise'!B114",1,"grant","Same grant"),
 ("Snow, 133 beds",dt.date(2027,2,1),"='Phase and raise'!B115",1,"beds","Ask to make; catch-up booked with Sal"),
 ("Dusseldorp, 67 beds",dt.date(2027,3,1),"='Phase and raise'!B116",1,"beds","Our number"),
 ("Other philanthropy, beds",dt.date(2027,4,1),"='Phase and raise'!B117",1,"beds","Fay Fuller, Wyatt, FRRR, Minderoo if it revives"),
 ("Direct orders to Goods (ALIVE pattern)",dt.date(2027,2,1),"='Phase and raise'!B118",1,"buyer",""),
 ("Centrecorp, 130 beds on quote, paid to Goods",dt.date(2027,3,1),"=130*'Bed calculator'!B44",1,"buyer","QU-0014 (May 2026) is a quote from Goods; waiting on community feedback. Set Include 0 if the community enterprise sells them instead."),
 ("Sefa loan draw",dt.date(2027,1,1),"=Assumptions!B38",0,"loan","Repayable. Include 1 only to test it. See section C.")]
F0=22
for i,(n,d,a,inc,kind,basis) in enumerate(funds):
    r=F0+i; ws.cell(r,1,n); c=ws.cell(r,2,d); c.number_format="mmm yyyy"; c.fill=Y
    c=ws.cell(r,3,a); c.number_format=M; c=ws.cell(r,4,inc); c.fill=Y; ws.cell(r,5,kind); ws.cell(r,6,basis).alignment=wrap
F1=F0+len(funds)-1; LOAN=F1
put(F1+2,"Plants paid for in",bold=True)
P1=F1+3; put(P1,"Plant 1 build month",dt.date(2026,12,1),"Palm Island, working choice; first beds three months later",inp=True,fmt="mmm yyyy")
put(P1+1,"Plant 2 build month",dt.date(2027,3,1),"Maningrida, working choice",inp=True,fmt="mmm yyyy")
put(P1+2,"Facilitation paid across four months from",dt.date(2027,1,1),"",inp=True,fmt="mmm yyyy")
T0=P1+4
put(T0,"B. Month by month, October 2026 to July 2027",head=True)
hdr=["Month","Beds made","Grants and catalytic capital in","Buyers paying Goods in","Loan draw","Freight recovered","Make the beds","Freight out","Running the business","Facilitation","Plants","Loan service","Net for the month","Closing Goods cash","Contribution earned (beds × $474)"]
for j,h in enumerate(hdr,1):
    c=ws.cell(T0+1,j,h); c.font=B; c.alignment=Alignment(wrap_text=True,vertical="top")
r0=T0+2; rng=lambda col: f"${col}${F0}:${col}${F1-1}"
for i in range(10):
    r=r0+i; m=(10+i-1)%12+1; y=2026 if m>=10 else 2027
    ws.cell(r,1,dt.date(y,m,1)).number_format="mmm yyyy"
    ws.cell(r,2,f"='Bed calculator'!B{55+i}")
    ws.cell(r,3,f"=SUMPRODUCT(({rng('B')}=A{r})*({rng('E')}<>\"buyer\")*{rng('D')}*{rng('C')})")
    ws.cell(r,4,f"=SUMPRODUCT(({rng('B')}=A{r})*({rng('E')}=\"buyer\")*{rng('D')}*{rng('C')})")
    ws.cell(r,5,f"=IF(AND($D${LOAN}=1,$B${LOAN}=A{r}),$C${LOAN},0)")
    ws.cell(r,6,f"=B{r}*$B$15*$B$16")
    ws.cell(r,7,f"=-B{r}*'Bed calculator'!$B$43")
    ws.cell(r,8,f"=-B{r}*$B$15")
    ws.cell(r,9,f"=-$B$14")
    ws.cell(r,10,f"=-IF(AND(A{r}>=$B${P1+2},A{r}<EDATE($B${P1+2},4)),$B$17*$B$18/4,0)")
    ws.cell(r,11,f"=-IF(A{r}=$B${P1},$B$19,0)-IF(A{r}=$B${P1+1},$B$19,0)")
    ws.cell(r,12,f"=-IF(AND($D${LOAN}=1,A{r}>$B${LOAN}),PMT(Assumptions!$B$39/12,Assumptions!$B$40*12,-$C${LOAN}),0)")
    ws.cell(r,13,f"=SUM(C{r}:L{r})")
    ws.cell(r,14,(f"=$B$5+$B$6+M{r}" if i==0 else f"=N{r-1}+M{r}"))
    ws.cell(r,15,f"=B{r}*('Bed calculator'!$B$44-'Bed calculator'!$B$43)")
    for j in range(3,16): ws.cell(r,j).number_format=M
rT=r0+10; ws.cell(rT,1,"October to July").font=B
for j in list(range(2,14))+[15]:
    c=ws.cell(rT,j,f"=SUM({L(j)}{r0}:{L(j)}{rT-1})"); c.font=B; c.number_format=M
put(rT+1,"Lowest closing cash in the ten months, $",f"=MIN(N{r0}:N{rT-1})",fmt=M,bold=True)
put(rT+2,"Month it happens",f"=INDEX(A{r0}:A{rT-1},MATCH(B{rT+1},N{r0}:N{rT-1},0))",fmt="mmm yyyy")
put(rT+3,"Closing cash at July 2027, $",f"=N{rT-1}",fmt=M,bold=True)
put(rT+4,"Reads: beds made but not yet paid for by a funder or buyer are the catalytic gap. They sit here as cost out with no cash in until Snow, Dusseldorp or others land. Freight is carried by Goods unless B16 says it is recovered.")
rC=rT+6
put(rC,"C. Profit margin, and the loan test",head=True)
put(rC+1,"Beds made, October to July",f"=B{rT}",fmt=M)
put(rC+2,"Contribution on every bed made, $ (beds × $474)",f"=O{rT}",fmt=M)
put(rC+3,"Beds a funder or buyer pays Goods for in the period (ALIVE 100 already paid, plus money landing)",f"=100+ROUND(SUMPRODUCT((({rng('E')}=\"beds\")+({rng('E')}=\"buyer\"))*{rng('D')}*{rng('C')})/'Bed calculator'!B44,0)",fmt=M)
put(rC+4,"Contribution Goods actually banks on those beds, $",f"=B{rC+3}*('Bed calculator'!B44-'Bed calculator'!B43)",fmt=M,bold=True)
put(rC+5,"Gross margin on a bed","=('Bed calculator'!B44-'Bed calculator'!B43)/'Bed calculator'!B44",fmt="0%")
put(rC+6,"Running the business for the ten months, $",f"=-I{rT}",fmt=M)
put(rC+7,"Operating result before operating support, $",f"=B{rC+4}-B{rC+6}",fmt=M,bold=True)
put(rC+8,"Tim Fairfax operating support in the period, $",f"=SUMPRODUCT(({rng('A')}=\"Tim Fairfax, year one (operating support)\")*{rng('D')}*{rng('C')})",fmt=M)
put(rC+9,"Operating result after operating support, $",f"=B{rC+7}+B{rC+8}",fmt=M,bold=True)
put(rC+10,"Beds made for nobody yet (the catalytic gap), $ of make cost carried",f"=MAX(0,B{rC+1}-B{rC+3})*'Bed calculator'!B43",fmt=M)
put(rC+12,"The Sefa test",bold=True)
put(rC+13,"Loan, $","=Assumptions!B38",fmt=M)
put(rC+14,"Rate and term","=TEXT(Assumptions!B39,\"0%\")&\" over \"&Assumptions!B40&\" years\"")
put(rC+15,"Monthly service, $",f"=PMT(Assumptions!B39/12,Assumptions!B40*12,-B{rC+13})",fmt=M)
put(rC+16,"A year of service, $",f"=B{rC+15}*12",fmt=M)
put(rC+17,"Paid beds a year needed just to service it",f"=ROUNDUP(B{rC+16}/('Bed calculator'!B44-'Bed calculator'!B43),0)",fmt=M,bold=True)
put(rC+18,"A plant's contribution in year one, $ (200 beds × $474, if a buyer or funder pays for them)",f"=200*('Bed calculator'!B44-'Bed calculator'!B43)",fmt=M)
put(rC+19,"Verdict",f"=IF(B{rC+18}>B{rC+16},\"Serviceable from a plant's own paid beds from its first full year. Good for plant capital, or for stock a buyer has ordered. Never for gifted first stock: those beds bring Goods no cash to repay from.\",\"Not serviceable from one plant's first year; only with a signed buyer.\")")
rD=rC+21
put(rD,"D. The asks, and the four outcomes each one buys",head=True)
put(rD+1,"Per bed: plastic kept out of landfill, kg","='Phase and raise'!B150")
put(rD+2,"Per bed: factory labour, $",80,"Canon: press labour inside the $276")
put(rD+3,"Per bed: labour hours at an hourly rate of",40,"Input; $80 a bed ÷ rate",inp=True,fmt=M)
put(rD+4,"Per bed: money that stays in a community that sells it, $","='Bed calculator'!B44",fmt=M)
askh=["Funder","Ask, $","What it buys","Beds","Employment: labour hours","Community: communities served at 100","Economic: $ retained locally when sold","Recycling: kg diverted","Health: beds off the floor","Status"]
for j,h in enumerate(askh,1):
    c=ws.cell(rD+6,j,h); c.font=B; c.alignment=Alignment(wrap_text=True,vertical="top")
asks=[("Snow Foundation","='Phase and raise'!B115","First trading stock for one community enterprise","Ask to make; catch-up booked"),
 ("Dusseldorp Forum","='Phase and raise'!B116","First stock plus the story symposium","Our number; Rachel Fyfe in conversation"),
 ("Minderoo","=Funding!F12","First stock, if the conversation revives","Paused May 2026; not live"),
 ("Tim Fairfax Family Foundation","=Funding!F7","Operating support that lets beds be first stock","Invited; due 9 Oct"),
 ("Brian M. Davis Charitable Foundation","=Funding!F8","80 beds plus facilitation in four communities; youth employment, schools, Decor plastics","Invited; due 25 Sep"),
 ("QBE Foundation","=Funding!F6","Two community plants: the jobs move on country","Due 25 Sep"),
 ("Sefa (repayable)","=Assumptions!B38","Plant capital or stock a buyer has ordered","EOI not sent"),
 ("Other philanthropy (Fay Fuller, Wyatt, FRRR)","='Phase and raise'!B117","First stock","No ask yet")]
for i,(n,a,what,st) in enumerate(asks):
    r=rD+7+i; ws.cell(r,1,n); c=ws.cell(r,2,a); c.number_format=M; ws.cell(r,3,what).alignment=wrap
    ws.cell(r,4,f"=IF(OR(A{r}=\"QBE Foundation\",A{r}=\"Tim Fairfax Family Foundation\",A{r}=\"Sefa (repayable)\"),0,IF(A{r}=\"Brian M. Davis Charitable Foundation\",ROUND('Phase and raise'!B114/'Bed calculator'!$B$44,0),ROUND(B{r}/'Bed calculator'!$B$44,0)))")
    ws.cell(r,5,f"=IF(A{r}=\"QBE Foundation\",\"two plants' crews\",ROUND(D{r}*$B${rD+2}/$B${rD+3},0))")
    ws.cell(r,6,f"=IF(A{r}=\"Brian M. Davis Charitable Foundation\",Sites!$O$6,ROUNDDOWN(D{r}/100,0))")
    ws.cell(r,7,f"=D{r}*$B${rD+4}"); ws.cell(r,7).number_format=M
    ws.cell(r,8,f"=D{r}*$B${rD+1}"); ws.cell(r,8).number_format=M
    ws.cell(r,9,f"=D{r}"); ws.cell(r,10,st).alignment=wrap
rA=rD+7+len(asks); ws.cell(rA,1,"All asks").font=B
for j in (2,4,5,7,8,9):
    c=ws.cell(rA,j,f"=SUM({L(j)}{rD+7}:{L(j)}{rA-1})"); c.font=B; c.number_format=M
put(rA+1,"Read each row aloud as the ask: this much money buys these beds, these hours of paid making, this many communities with stock to sell, this much money kept locally, this much plastic out of landfill, this many people off the floor. Health is the reason, never a claimed outcome.")
rE=rA+3
put(rE,"E. Five and ten years, from the same three numbers",head=True)
put(rE+1,"Plants making beds in FY27",1,"Witta",inp=True)
put(rE+2,"Plants added each year from FY28",2,"Alice Springs, Palm Island, Maningrida in FY28; then Matt's trigger, 200 beds of need",inp=True)
put(rE+3,"Beds a plant makes a year once running",400,"Between Matt's 200 in year one and NM's 720 ceiling",inp=True)
put(rE+4,"Share of beds a funder or buyer pays Goods for",0.5,"The rest are sold by community enterprises and the money stays there",inp=True,fmt="0%")
put(rE+5,"Running the business grows each year by",0.1,"",inp=True,fmt="0%")
yh=["Year","Plants","Beds a year","Revenue to Goods, $","Stays in Goods, $","Running the business, $","Result, $","Kept in communities, $","Plastic diverted, kg","Labour hours","Communities at 100 beds"]
for j,h in enumerate(yh,1):
    c=ws.cell(rE+7,j,h); c.font=B; c.alignment=Alignment(wrap_text=True,vertical="top")
for i in range(10):
    r=rE+8+i; ws.cell(r,1,f"FY{27+i}")
    ws.cell(r,2,f"=$B${rE+1}" if i==0 else f"=B{r-1}+$B${rE+2}")
    ws.cell(r,3,f"='Bed calculator'!B91" if i==0 else f"=B{r}*$B${rE+3}")
    ws.cell(r,4,f"=C{r}*$B${rE+4}*'Bed calculator'!$B$44")
    ws.cell(r,5,f"=C{r}*$B${rE+4}*('Bed calculator'!$B$44-'Bed calculator'!$B$43)")
    ws.cell(r,6,f"='Phase and raise'!B92" if i==0 else f"=F{r-1}*(1+$B${rE+5})")
    ws.cell(r,7,f"=E{r}-F{r}")
    ws.cell(r,8,f"=C{r}*(1-$B${rE+4})*'Bed calculator'!$B$44")
    ws.cell(r,9,f"=C{r}*$B${rD+1}"); ws.cell(r,10,f"=C{r}*$B${rD+2}/$B${rD+3}"); ws.cell(r,11,f"=ROUNDDOWN(C{r}/100,0)")
    for j in range(3,11): ws.cell(r,j).number_format=M
put(rE+19,"Reads: the ten-year line is an ambition, not a forecast. It shows the shape: once plants are community-owned, most of the bed money stays where the beds are, and Goods lives on the share it is paid for plus what else it sells.")
ws.freeze_panes="A4"
wb.calculation=CalcProperties(fullCalcOnLoad=True); wb.save(p)
print("rows: funds",F0,F1,"table",r0,rT,"C",rC,"D",rD,"asks",rD+7,rA,"E",rE)
