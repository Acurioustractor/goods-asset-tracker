#!/usr/bin/env python3
"""Generate the Pencil batch_design ops string for the Goods theory-of-change
logic model. Emits one operation per line to /tmp/pencil_lm.js for a single
batch_design call on a fresh .pen document (avoids the multi-batch +50 bug)."""

ops = []
_n = [0]
def b():
    _n[0] += 1
    return f"n{_n[0]}"

def I(parent, props, bind=False):
    name = b() if bind else None
    lead = f"{name}=" if name else ""
    ops.append(f"{lead}I({parent},{props})")
    return name

def txt(content):
    return content.replace('"', '\\"')

# board
board = I("document", '{type:"frame",name:"TOC logic model",layout:"none",width:1680,height:1020,fill:"$bg"}', bind=True)

# title + subtitle
I(board, '{type:"text",content:"Goods on Country: theory of change",x:0,y:26,width:1680,textGrowth:"fixed-width",textAlign:"center",fontFamily:"Newsreader",fontSize:44,fontWeight:"700",fill:"$ink"}')
I(board, '{type:"text",content:"From community-led design to community-owned production: how our activities create measured outcomes on Country.",x:0,y:80,width:1680,textGrowth:"fixed-width",textAlign:"center",fontFamily:"Newsreader",fontStyle:"italic",fontSize:18,fill:"$ink-muted"}')

# problem band
pb = I(board, '{type:"frame",name:"Problem",x:40,y:114,width:1600,height:50,cornerRadius:13,fill:"$clay-tint",stroke:{thickness:1.5,fill:"$clay",align:"inside"},layout:"horizontal",alignItems:"center",gap:18,padding:[24,0]}', bind=True)
I(pb, '{type:"text",content:"PROBLEM",fontFamily:"Geist",fontSize:14,fontWeight:"700",letterSpacing:1.5,fill:"$clay-ink"}')
I(pb, '{type:"text",content:"Remote homes face costly, short-lived goods. Floor sleeping and dirty bedding feed skin infections in the recognised pathway toward rheumatic heart disease; FRRR (2022): 59% of remote community homes have no washing machine.",fontFamily:"Geist",fontSize:13.5,fill:"$ink",textGrowth:"fixed-width",width:1380}')

CX, CW = 164, 1476
midx = CX + CW/2

def rail(y, label, color):
    I(board, f'{{type:"text",content:"{label}",x:36,y:{y},width:120,textGrowth:"fixed-width",textAlign:"start",fontFamily:"Geist",fontSize:13,fontWeight:"700",letterSpacing:0.5,fill:"$​"}}'.replace("$​", color))

def arrow(y):
    I(board, f'{{type:"path",x:{midx-6},y:{y},width:12,height:20,viewBox:[0,0,12,20],geometry:"M6 0 L6 13 M2 9 L6 14 L10 9",stroke:{{thickness:2.4,fill:"$hair",align:"center",cap:"round",join:"round"}}}}')

def chip_row(y, h, items, colorvar):
    row = I(board, f'{{type:"frame",x:{CX},y:{y},width:{CW},height:{h},layout:"horizontal",gap:13}}', bind=True)
    for label in items:
        chip = I(row, f'{{type:"frame",width:"fill_container",height:{h},cornerRadius:11,fill:"${colorvar}-tint",stroke:{{thickness:1.3,fill:"${colorvar}",align:"inside"}},layout:"vertical",justifyContent:"center",alignItems:"center",padding:[10,8]}}', bind=True)
        I(chip, f'{{type:"text",content:"{txt(label)}",fontFamily:"Geist",fontSize:13,fontWeight:"600",fill:"$ink",textGrowth:"fixed-width",width:"fill_container",textAlign:"center",lineHeight:1.15}}')

# INPUTS
rail(218, "INPUTS", "$clay-ink")
chip_row(196, 60, ["Community leadership","Recycled HDPE","Steel + canvas","On-Country plant","Capital: grants + catalytic","Health + delivery partners"], "clay")
arrow(262)

# ACTIVITIES (cycle)
rail(322, "ACTIVITIES", "$sage-ink")
act = I(board, f'{{type:"frame",x:{CX},y:284,width:{CW},height:92,layout:"horizontal",gap:14}}', bind=True)
cycle = [("Listen","sage"),("Design","sage"),("Make","sage"),("Deliver","teal"),("Learn","teal"),("Improve","sage")]
for i,(lab,c) in enumerate(cycle):
    card = I(act, f'{{type:"frame",width:"fill_container",height:92,cornerRadius:13,fill:"${c}-tint",stroke:{{thickness:1.5,fill:"${c}",align:"inside"}},layout:"vertical",justifyContent:"center",alignItems:"center",gap:6}}', bind=True)
    I(card, f'{{type:"text",content:"{i+1}",fontFamily:"Geist",fontSize:12,fontWeight:"700",fill:"${c}-ink"}}')
    I(card, f'{{type:"text",content:"{lab}",fontFamily:"Geist",fontSize:17,fontWeight:"700",fill:"${c}-ink"}}')
I(board, '{type:"text",content:"Community-led, and it repeats: what we learn returns to the design with every delivery.",x:164,y:382,width:1476,textGrowth:"fixed-width",textAlign:"start",fontFamily:"Newsreader",fontStyle:"italic",fontSize:13,fill:"$ink-muted"}')
arrow(404)

# OUTPUTS
rail(430, "OUTPUTS", "$teal-ink")
chip_row(404, 56, ["Beds delivered  ●","Plastic diverted  ◐","Wash cycles  ◐","Employment hours  ○","Consent-led stories  ●","QR-tracked register  ●"], "teal")
arrow(466)

# OUTCOMES
rail(630, "OUTCOMES", "$gold-ink")
I(board, '{type:"text",content:"INCLUSION  ·  QBE Foundation priority",x:164,y:494,width:1000,textGrowth:"fixed-width",textAlign:"start",fontFamily:"Geist",fontSize:12.5,fontWeight:"700",letterSpacing:0.8,fill:"$terracotta-ink"}')
I(board, '{type:"text",content:"CLIMATE RESILIENCE  ·  QBE",x:1196,y:494,width:444,textGrowth:"fixed-width",textAlign:"start",fontFamily:"Geist",fontSize:12.5,fontWeight:"700",letterSpacing:0.8,fill:"$sage-ink"}')

def dim_card(parent, name, colorvar, rows):
    card = I(parent, f'{{type:"frame",width:"fill_container",height:268,cornerRadius:12,fill:"#FFFFFF",stroke:{{thickness:1.5,fill:"${colorvar}",align:"inside"}},layout:"vertical",padding:14,gap:9}}', bind=True)
    I(card, f'{{type:"text",content:"{txt(name)}",fontFamily:"Geist",fontSize:15,fontWeight:"700",fill:"${colorvar}-ink",textGrowth:"fixed-width",width:"fill_container"}}')
    for horizon,body in rows:
        I(card, f'{{type:"text",content:"{horizon}: {txt(body)}",fontFamily:"Geist",fontSize:12.5,fill:"$ink",textGrowth:"fixed-width",width:"fill_container",lineHeight:1.3}}')

incl = I(board, f'{{type:"frame",x:164,y:512,width:1012,height:268,layout:"horizontal",gap:16}}', bind=True)
dim_card(incl, "Health & wellbeing", "clay", [
    ("Short","off-floor sleeping; a clean-bedding pathway"),
    ("Medium","less scabies and Strep A; assets last 12 months+"),
    ("Long","reduced rheumatic heart disease (with health partners)")])
dim_card(incl, "Economic inclusion", "gold", [
    ("Short","household income retained; first local paid work"),
    ("Medium","members trained and employed; orders convert"),
    ("Long","sustainable local livelihoods (WISE)")])
dim_card(incl, "Community ownership", "teal", [
    ("Short","community co-leads design and production"),
    ("Medium","named lead on payroll; entity invoices buyer"),
    ("Long","community-owned production. We become unnecessary")])
clim = I(board, f'{{type:"frame",x:1196,y:512,width:444,height:268,layout:"horizontal",gap:16}}', bind=True)
dim_card(clim, "Environmental", "sage", [
    ("Short","community plastic captured and re-used; less landfill"),
    ("Medium","a working circular loop; replacement cycles lengthen"),
    ("Long","a measurable environmental-health evidence base")])
arrow(786)

# IMPACT
rail(838, "IMPACT", "$terracotta-ink")
imp = I(board, f'{{type:"frame",x:164,y:812,width:1476,height:54,cornerRadius:13,fill:"$terracotta-tint",stroke:{{thickness:1.5,fill:"$terracotta",align:"inside"}},layout:"horizontal",justifyContent:"center",alignItems:"center",padding:[24,0]}}', bind=True)
I(imp, '{type:"text",content:"Healthier, more self-determining remote communities: locally-owned manufacturing and a circular economy that keeps value on Country.",fontFamily:"Geist",fontSize:15,fontWeight:"600",fill:"$terracotta-ink"}')

# metrics + footer
I(board, '{type:"text",content:"PRIORITY METRICS   ·   ● tracked   ◐ partial   ○ modelled   □ design target",x:40,y:896,width:1600,textGrowth:"fixed-width",textAlign:"start",fontFamily:"Geist",fontSize:12.5,fontWeight:"700",fill:"$ink-muted"}')
I(board, '{type:"text",content:"Beds 495 → 1,500 (Yr1) ●      Plastic ~2,640 kg → 30 t ◐      Communities 9 → 12 ●      Consent-led stories 12 → 50 ●      Community-ownership test 0/4 → 4/4 at month 6 □",x:40,y:920,width:1600,textGrowth:"fixed-width",textAlign:"start",fontFamily:"Geist",fontSize:13,fill:"$ink"}')
I(board, '{type:"text",content:"The model: community leads the design. Goods supports the building. Production transfers to community ownership.",x:0,y:968,width:1680,textGrowth:"fixed-width",textAlign:"center",fontFamily:"Newsreader",fontSize:16,fill:"$ink"}')

import pathlib
pathlib.Path("/tmp/pencil_lm.js").write_text("\n".join(ops))
print(f"{len(ops)} ops written to /tmp/pencil_lm.js")
