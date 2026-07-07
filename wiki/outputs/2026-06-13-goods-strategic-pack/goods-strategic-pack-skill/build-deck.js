const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
p.author = "Goods on Country";
p.title = "Goods on Country — Catalytic Investment";

const EARTH="2B2118",TERRA="B0492E",OCHRE="D08C2E",SAGE="6E7F5B",CREAM="F4EEE5",WHITE="FFFFFF",INK="2B2118",MUTE="7A6A59",LINEC="E3D9CB";
const TAG={VERIFIED:"4F7A3F",WORKPAPER:"C07F1E",MODELLED:"55606E",TARGET:"B0492E"};
const HF="Georgia",BF="Calibri";
const W=13.333,H=7.5,MX=0.7;
const sh=()=>({type:"outer",color:"000000",blur:7,offset:3,angle:135,opacity:0.16});

function footer(s,n){
  s.addText("Goods on Country  ·  catalytic investment  ·  draft 2026-06-13  ·  figures per master alignment map",
    {x:MX,y:H-0.42,w:10.5,h:0.3,fontFace:BF,fontSize:8,color:MUTE,align:"left",margin:0});
  s.addText(String(n),{x:W-1.0,y:H-0.42,w:0.4,h:0.3,fontFace:BF,fontSize:9,color:MUTE,align:"right",margin:0});
}
function pill(s,x,y,label){
  const w=0.12*label.length+0.34;
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x,y,w,h:0.26,rectRadius:0.13,fill:{color:TAG[label]}});
  s.addText(label,{x,y,w,h:0.26,fontFace:BF,fontSize:8.5,bold:true,color:WHITE,align:"center",valign:"middle",margin:0,charSpacing:1});
  return w;
}
function kicker(s,txt,color){s.addText(txt.toUpperCase(),{x:MX,y:0.55,w:11.9,h:0.3,fontFace:BF,fontSize:12,bold:true,color:color||TERRA,charSpacing:3,margin:0});}
function title(s,txt,color){s.addText(txt,{x:MX,y:0.92,w:W-2*MX,h:1.0,fontFace:HF,fontSize:31,bold:true,color:color||INK,margin:0,lineSpacing:34});}

// 1 TITLE
let s=p.addSlide();s.background={color:EARTH};
s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:0.28,h:H,fill:{color:TERRA}});
s.addText("GOODS ON COUNTRY",{x:MX,y:1.7,w:11.5,h:0.5,fontFace:BF,fontSize:15,bold:true,color:OCHRE,charSpacing:5,margin:0});
s.addText("A good bed can\nprevent heart disease.",{x:MX,y:2.25,w:11.5,h:2.0,fontFace:HF,fontSize:46,bold:true,color:WHITE,lineSpacing:50,margin:0});
s.addText("Essential household goods, designed with remote communities, built for real conditions, and moving toward community ownership.",{x:MX,y:4.35,w:9.6,h:0.9,fontFace:BF,fontSize:16,color:CREAM,lineSpacing:23,margin:0});
s.addShape(p.shapes.LINE,{x:MX,y:5.55,w:11.9,h:0,line:{color:"5A4B3C",width:1}});
s.addText([{text:"496 ",options:{fontFace:HF,fontSize:24,bold:true,color:WHITE}},{text:"beds deployed",options:{fontFace:BF,fontSize:12,color:CREAM,breakLine:true}}],{x:MX,y:5.75,w:3.0,h:0.8,margin:0,valign:"top"});
s.addText([{text:"9 ",options:{fontFace:HF,fontSize:24,bold:true,color:WHITE}},{text:"communities",options:{fontFace:BF,fontSize:12,color:CREAM,breakLine:true}}],{x:3.8,y:5.75,w:3.0,h:0.8,margin:0,valign:"top"});
s.addText([{text:"AU$649,710 ",options:{fontFace:HF,fontSize:24,bold:true,color:WHITE}},{text:"received (Xero, unaudited)",options:{fontFace:BF,fontSize:12,color:CREAM,breakLine:true}}],{x:6.9,y:5.75,w:5.5,h:0.8,margin:0,valign:"top"});
s.addText("Scan or visit  goodsoncountry.com/admin/assets  — every bed is QR-tracked. Trust the register, not the pitch.",{x:MX,y:6.7,w:11.9,h:0.4,fontFace:BF,fontSize:11,italic:true,color:OCHRE,margin:0});

// 2 HUMAN
s=p.addSlide();s.background={color:WHITE};
s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:W*0.42,h:H,fill:{color:CREAM}});
s.addText("BED  GB0-156-96",{x:0.7,y:1.0,w:4.6,h:0.4,fontFace:BF,fontSize:12,bold:true,color:TERRA,charSpacing:2,margin:0});
s.addText("Ray Nelson's bed",{x:0.7,y:1.4,w:4.6,h:0.9,fontFace:HF,fontSize:30,bold:true,color:INK,margin:0});
s.addText([{text:"Recipient   ",options:{bold:true,color:MUTE}},{text:"Ray Nelson",options:{color:INK,breakLine:true}},{text:"Place   ",options:{bold:true,color:MUTE}},{text:"Plenty Highway, NT",options:{color:INK,breakLine:true}},{text:"GPS   ",options:{bold:true,color:MUTE}},{text:"-22.969, 133.836",options:{color:INK,breakLine:true}},{text:"Supplied   ",options:{bold:true,color:MUTE}},{text:"21 May 2026",options:{color:INK}}],{x:0.7,y:2.45,w:4.6,h:1.8,fontFace:BF,fontSize:14,lineSpacing:26,margin:0});
pill(s,0.7,4.3,"VERIFIED");
s.addText("approved community voice",{x:2.15,y:4.3,w:3.1,h:0.26,fontFace:BF,fontSize:10,italic:true,color:MUTE,valign:"middle",margin:0});
kicker(s,"The unit of impact we are scaling");
s.addText("“Since receiving their new beds,\nthey are no longer experiencing back pains.”",{x:6.0,y:2.6,w:6.6,h:1.8,fontFace:HF,fontSize:26,italic:true,color:INK,lineSpacing:36,margin:0});
s.addText("Every bed carries a name, a place, and a digital twin in the live register. Investor conversations start by scanning one — the proof is checkable before a word is spoken.",{x:6.0,y:4.6,w:6.6,h:1.3,fontFace:BF,fontSize:14,color:MUTE,lineSpacing:22,margin:0});
footer(s,2);

// 3 PROBLEM
s=p.addSlide();s.background={color:WHITE};
kicker(s,"The problem");
title(s,"The goods that protect health are the\nworst-designed things in the house");
const chain=["Unwashable bedding","Scabies & skin infection","Strep A / rheumatic fever","Rheumatic heart disease"];
let cx=MX;
chain.forEach((t,i)=>{
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:cx,y:2.55,w:2.62,h:1.05,rectRadius:0.08,fill:{color:i===3?TERRA:CREAM},line:{color:i===3?TERRA:LINEC,width:1},shadow:sh()});
  s.addText(t,{x:cx+0.12,y:2.55,w:2.46,h:1.05,fontFace:BF,fontSize:13.5,bold:true,color:i===3?WHITE:INK,align:"center",valign:"middle",margin:0,lineSpacing:17});
  if(i<3)s.addText("→",{x:cx+2.62,y:2.55,w:0.34,h:1.05,fontFace:HF,fontSize:20,bold:true,color:OCHRE,align:"center",valign:"middle",margin:0});
  cx+=2.96;
});
s.addText("A disease almost unheard of in wealthy Australia is endemic in remote communities. Beds and washing machines are environmental-health hardware — not charity, not convenience.",{x:MX,y:3.95,w:11.9,h:0.9,fontFace:BF,fontSize:15,color:INK,lineSpacing:23,margin:0});
s.addShape(p.shapes.RECTANGLE,{x:MX,y:5.1,w:5.8,h:1.55,fill:{color:CREAM}});
s.addShape(p.shapes.RECTANGLE,{x:MX,y:5.1,w:0.1,h:1.55,fill:{color:OCHRE}});
s.addText([{text:"~AU$3M / year\n",options:{fontFace:HF,fontSize:22,bold:true,color:INK}},{text:"of washing machines sold into remote communities by one Alice Springs supplier — most landfilled within months.",options:{fontFace:BF,fontSize:12,color:MUTE}}],{x:MX+0.32,y:5.25,w:5.3,h:1.3,lineSpacing:20,margin:0,valign:"top"});
s.addShape(p.shapes.RECTANGLE,{x:6.9,y:5.1,w:5.7,h:1.55,fill:{color:CREAM}});
s.addShape(p.shapes.RECTANGLE,{x:6.9,y:5.1,w:0.1,h:1.55,fill:{color:SAGE}});
s.addText([{text:"No comparable product exists\n",options:{fontFace:HF,fontSize:18,bold:true,color:INK}},{text:"No washable, repairable, flat-pack remote mattress; no repair-engineered remote washing machine on the market today.",options:{fontFace:BF,fontSize:12,color:MUTE}}],{x:7.22,y:5.25,w:5.2,h:1.3,lineSpacing:20,margin:0,valign:"top"});
footer(s,3);

// 4 SHIPPED
s=p.addSlide();s.background={color:WHITE};
kicker(s,"Proven delivery");
title(s,"Already delivered at scale — split honestly");
s.addChart(p.charts.BAR,[{name:"Beds deployed",labels:["Tennant Ck","Utopia","Palm Is.","Kalgoorlie","Maningrida","Alice","Mt Isa","Canberra","Darwin"],values:[159,147,131,20,18,16,2,2,1]}],{x:MX,y:2.4,w:7.4,h:4.4,barDir:"bar",chartColors:[TERRA],showValue:true,dataLabelPosition:"outEnd",dataLabelColor:INK,dataLabelFontFace:BF,dataLabelFontSize:10,catAxisLabelColor:INK,catAxisLabelFontFace:BF,catAxisLabelFontSize:11,valAxisHidden:true,valGridLine:{style:"none"},catGridLine:{style:"none"},showLegend:false,chartArea:{fill:{color:WHITE}}});
const stat=(y,big,small)=>{s.addText([{text:big+"\n",options:{fontFace:HF,fontSize:30,bold:true,color:TERRA}},{text:small,options:{fontFace:BF,fontSize:12.5,color:MUTE}}],{x:8.6,y,w:4.0,h:1.2,margin:0,lineSpacing:22,valign:"top"});};
stat(2.45,"496 beds","133 Stretch + 363 Basket (legacy, open-sourced)");
stat(3.75,"9 communities","across NT, QLD & WA");
stat(5.05,"2,660 kg","HDPE plastic diverted (Stretch beds)");
pill(s,8.6,6.35,"VERIFIED");
s.addText("asset register, 29 May 2026 — beds tracked, not “shipped”",{x:10.05,y:6.32,w:2.55,h:0.5,fontFace:BF,fontSize:9.5,italic:true,color:MUTE,valign:"middle",margin:0,lineSpacing:12});
footer(s,4);

// 5 HOW WE DELIVER
s=p.addSlide();s.background={color:EARTH};
kicker(s,"The method is the proof",OCHRE);
title(s,"Utopia Homelands, May 2026",WHITE);
const ucards=[["87 beds","delivered over two days"],["1.74 t","plastic diverted"],["36 households","direct recipients + 51 held by Council"],["2 partners","Oonchiumpa Consultancy + Utopia Council"]];
let ux=MX;
ucards.forEach(c=>{
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:ux,y:2.5,w:2.83,h:1.7,rectRadius:0.08,fill:{color:"3A2E22"},line:{color:"5A4B3C",width:1}});
  s.addText([{text:c[0]+"\n",options:{fontFace:HF,fontSize:24,bold:true,color:OCHRE}},{text:c[1],options:{fontFace:BF,fontSize:12,color:CREAM}}],{x:ux+0.2,y:2.7,w:2.43,h:1.3,margin:0,lineSpacing:18,valign:"top"});
  ux+=3.0;
});
s.addText("From waste plastic to a bed — made on country, delivered on country.",{x:MX,y:4.7,w:11.9,h:0.7,fontFace:HF,fontSize:26,italic:true,color:WHITE,margin:0});
s.addText("Plastic collected locally becomes the product delivered locally, with partners Oonchiumpa Consultancy and Utopia Council. The delivery model is the differentiator, not any single feature.",{x:MX,y:5.55,w:11.9,h:1.0,fontFace:BF,fontSize:14,color:CREAM,lineSpacing:22,margin:0});
footer(s,5);

// 6 PRODUCT
s=p.addSlide();s.background={color:WHITE};
s.addShape(p.shapes.RECTANGLE,{x:W-4.6,y:0,w:4.6,h:H,fill:{color:CREAM}});
kicker(s,"The product");
title(s,"The Stretch Bed");
s.addText("A flat-pack, washable bed where the canvas is structural. The galvanised steel poles thread through the canvas sleeves and the crossed-plank recycled-plastic legs; tensioning the assembly pulls it tight. No tools, about five minutes. It stands because of how it is built.",{x:MX,y:2.0,w:7.6,h:1.7,fontFace:BF,fontSize:15,color:INK,lineSpacing:24,margin:0});
const specs=[["26 kg","weight"],["200 kg","load capacity"],["~5 min","assembly, no tools"],["10+ yr","design life · 5-yr warranty"],["20 kg","plastic diverted / bed"],["AU$750","retail price"]];
specs.forEach((c,i)=>{const col=i%3,row=Math.floor(i/3);const X=MX+col*2.6,Y=3.95+row*1.35;s.addText([{text:c[0]+"\n",options:{fontFace:HF,fontSize:23,bold:true,color:TERRA}},{text:c[1],options:{fontFace:BF,fontSize:11.5,color:MUTE}}],{x:X,y:Y,w:2.5,h:1.2,margin:0,lineSpacing:18,valign:"top"});});
s.addText("MADE OF",{x:W-4.25,y:1.4,w:3.8,h:0.3,fontFace:BF,fontSize:12,bold:true,color:TERRA,charSpacing:2,margin:0});
s.addText([{text:"Recycled HDPE plastic\n",options:{bold:true,color:INK}},{text:"X-trestle legs, pressed on country\n\n",options:{color:MUTE}},{text:"Galvanised steel poles\n",options:{bold:true,color:INK}},{text:"26.9mm OD × 2.6mm wall\n\n",options:{color:MUTE}},{text:"Heavy-duty Australian canvas\n",options:{bold:true,color:INK}},{text:"the structural sleeping surface",options:{color:MUTE}}],{x:W-4.25,y:1.8,w:3.8,h:3.6,fontFace:BF,fontSize:14,lineSpacing:20,margin:0,valign:"top"});
s.addText("The only product for direct sale. A washing-machine prototype (Pakkimjalki Kari) and an on-country production plant follow.",{x:W-4.25,y:5.6,w:3.8,h:1.2,fontFace:BF,fontSize:11.5,italic:true,color:MUTE,lineSpacing:17,margin:0});
footer(s,6);

// 7 UNIT ECON TODAY
s=p.addSlide();s.background={color:WHITE};
kicker(s,"The honest commercial reality");
title(s,"At today's cost, the business can't stand alone");
const e=[["AU$750","sells for","VERIFIED",SAGE],["AU$684.79","costs to make","WORKPAPER",OCHRE],["~1,679 / yr","breakeven volume","MODELLED",INK]];
let ex=MX;
e.forEach(c=>{
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:ex,y:2.4,w:3.75,h:1.9,rectRadius:0.08,fill:{color:CREAM},line:{color:LINEC,width:1},shadow:sh()});
  s.addText([{text:c[0]+"\n",options:{fontFace:HF,fontSize:30,bold:true,color:c[3]}},{text:c[1],options:{fontFace:BF,fontSize:13,color:MUTE}}],{x:ex+0.2,y:2.7,w:3.35,h:1.0,margin:0,lineSpacing:24,valign:"top"});
  pill(s,ex+0.2,3.85,c[2]);
  ex+=4.0;
});
s.addText("We deploy about 130 beds a year. Breakeven at today's cost sits near 1,679 — out of reach, and we won't pretend otherwise.",{x:MX,y:4.65,w:11.9,h:0.8,fontFace:BF,fontSize:15,color:INK,lineSpacing:23,margin:0});
s.addShape(p.shapes.RECTANGLE,{x:MX,y:5.6,w:11.9,h:1.05,fill:{color:EARTH}});
s.addText([{text:"~89% grant-funded, by design.  ",options:{fontFace:HF,fontSize:16,bold:true,color:WHITE}},{text:"Direct commercial revenue is AU$90 (three orders). That is the point: communities want it and funders pay for it — we have not yet proven it can be made at a price that stands alone. That is what this round funds.",options:{fontFace:BF,fontSize:13,color:CREAM}}],{x:MX+0.3,y:5.72,w:11.3,h:0.85,lineSpacing:19,margin:0,valign:"middle"});
footer(s,7);

// 8 HYPOTHESIS
s=p.addSlide();s.background={color:WHITE};
kicker(s,"The hypothesis this capital tests");
title(s,"In-source the plastic");
const cd=[["AU$684.79","today — bought-in legs","WORKPAPER"],["AU$425.74","factory in-source","MODELLED"],["AU$270.74","community in-source","MODELLED"]];
let dx=MX;
cd.forEach((c,i)=>{
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:dx,y:2.45,w:3.5,h:1.7,rectRadius:0.08,fill:{color:i===0?CREAM:"EFE6D8"},line:{color:LINEC,width:1}});
  s.addText([{text:c[0]+"\n",options:{fontFace:HF,fontSize:26,bold:true,color:i===0?OCHRE:TERRA}},{text:c[1],options:{fontFace:BF,fontSize:12,color:MUTE}}],{x:dx+0.18,y:2.65,w:3.14,h:0.95,margin:0,lineSpacing:22,valign:"top"});
  pill(s,dx+0.18,3.7,c[2]);
  if(i<2)s.addText("→",{x:dx+3.5,y:2.45,w:0.4,h:1.7,fontFace:HF,fontSize:24,bold:true,color:OCHRE,align:"center",valign:"middle",margin:0});
  dx+=3.9;
});
s.addText([{text:"Verified input:  ",options:{bold:true,color:INK}},{text:"an 8.6× markup on the HDPE legs we currently buy. The cost-down is real arithmetic — but ",options:{color:INK}},{text:"0 beds have been assembled in-house yet. This number is a hypothesis, not a result.",options:{bold:true,color:TERRA}}],{x:MX,y:4.5,w:11.9,h:0.8,fontFace:BF,fontSize:14.5,lineSpacing:22,margin:0});
s.addShape(p.shapes.RECTANGLE,{x:MX,y:5.45,w:5.85,h:1.25,fill:{color:SAGE}});
s.addText([{text:"PASS\n",options:{fontFace:HF,fontSize:15,bold:true,color:WHITE}},{text:"50-bed in-source run confirms AU$425.74  →  scale the raise on proven economics.",options:{fontFace:BF,fontSize:12.5,color:WHITE}}],{x:MX+0.25,y:5.58,w:5.4,h:1.0,lineSpacing:18,margin:0,valign:"middle"});
s.addShape(p.shapes.RECTANGLE,{x:6.75,y:5.45,w:5.85,h:1.25,fill:{color:TERRA}});
s.addText([{text:"MISS\n",options:{fontFace:HF,fontSize:15,bold:true,color:WHITE}},{text:"re-base the raise honestly at AU$684.79 and adjust. Either way, the round is de-risked.",options:{fontFace:BF,fontSize:12.5,color:WHITE}}],{x:7.0,y:5.58,w:5.4,h:1.0,lineSpacing:18,margin:0,valign:"middle"});
footer(s,8);

// 9 FUNDING
s=p.addSlide();s.background={color:WHITE};
kicker(s,"Funding is multi-sourced — but it's grants, not yet revenue");
title(s,"Money in, told straight");
s.addChart(p.charts.BAR,[{name:"AU$ received",labels:["Snow Foundation","Centrecorp","VFFF","QIC"],values:[402930,123332,50000,12000]}],{x:MX,y:2.45,w:7.2,h:3.6,barDir:"bar",chartColors:[TERRA],showValue:true,dataLabelPosition:"outEnd",dataLabelColor:INK,dataLabelFontFace:BF,dataLabelFontSize:11,catAxisLabelColor:INK,catAxisLabelFontFace:BF,catAxisLabelFontSize:12,valAxisHidden:true,valGridLine:{style:"none"},catGridLine:{style:"none"},showLegend:false,chartArea:{fill:{color:WHITE}}});
s.addText([{text:"AU$649,710.79\n",options:{fontFace:HF,fontSize:26,bold:true,color:INK}},{text:"received across funders",options:{fontFace:BF,fontSize:12,color:MUTE}}],{x:8.55,y:2.5,w:4.1,h:1.0,margin:0,lineSpacing:22,valign:"top"});
pill(s,8.55,3.55,"WORKPAPER");
s.addText("Xero mirror, 29 May 2026 — unaudited. Never “audited Goods revenue.”  88.8% collected; AU$82,500 in-flight.",{x:8.55,y:3.9,w:4.1,h:1.0,fontFace:BF,fontSize:11.5,italic:true,color:MUTE,lineSpacing:16,margin:0});
s.addShape(p.shapes.RECTANGLE,{x:8.55,y:4.95,w:4.05,h:1.4,fill:{color:CREAM}});
s.addShape(p.shapes.RECTANGLE,{x:8.55,y:4.95,w:0.1,h:1.4,fill:{color:OCHRE}});
s.addText([{text:"AU$90\n",options:{fontFace:HF,fontSize:24,bold:true,color:TERRA}},{text:"direct commercial revenue (3 shop orders). Institutional LOIs in pipeline — none signed yet.",options:{fontFace:BF,fontSize:12,color:INK}}],{x:8.85,y:5.08,w:3.6,h:1.2,lineSpacing:18,margin:0,valign:"top"});
footer(s,9);

// 10 MODEL & GAP
s=p.addSlide();s.background={color:WHITE};
kicker(s,"The model is internally consistent — and the gap is the ask");
title(s,"Two curves, 36 months");
s.addChart(p.charts.LINE,[{name:"Without injection",labels:["M0","M6","M12","M18","M24","M30","M36"],values:[0,-120000,-240000,-360000,-487722,-487722,-487722]},{name:"With catalytic injection",labels:["M0","M6","M12","M18","M24","M30","M36"],values:[0,-90000,-177292,-60000,40000,140000,212278]}],{x:MX,y:2.4,w:8.0,h:4.2,lineSize:3,lineSmooth:true,chartColors:[MUTE,SAGE],catAxisLabelColor:INK,catAxisLabelFontFace:BF,catAxisLabelFontSize:11,valAxisLabelColor:MUTE,valAxisLabelFontFace:BF,valAxisLabelFontSize:10,valGridLine:{color:LINEC,size:0.5},catGridLine:{style:"none"},showLegend:true,legendPos:"b",legendColor:INK,legendFontFace:BF,legendFontSize:11,chartArea:{fill:{color:WHITE}}});
s.addText([{text:"−AU$487,722\n",options:{fontFace:HF,fontSize:22,bold:true,color:MUTE}},{text:"un-injected by month 36\n\n",options:{fontFace:BF,fontSize:12,color:MUTE,breakLine:true}},{text:"+AU$212,278\n",options:{fontFace:HF,fontSize:22,bold:true,color:SAGE}},{text:"injected, by month 36",options:{fontFace:BF,fontSize:12,color:MUTE}}],{x:9.1,y:2.6,w:3.6,h:2.4,margin:0,lineSpacing:20,valign:"top"});
pill(s,9.1,5.1,"MODELLED");
s.addText("Intra-period trough −AU$177,292. The injection stack is QBE + SEFA + philanthropy. We show the trough, not just the recovery.",{x:9.1,y:5.5,w:3.6,h:1.2,fontFace:BF,fontSize:11.5,italic:true,color:MUTE,lineSpacing:16,margin:0});
footer(s,10);

// 11 ASK
s=p.addSlide();s.background={color:EARTH};
kicker(s,"The precise, sequenced ask",OCHRE);
s.addText("AU$900K–1M, blended, non-equity",{x:MX,y:0.92,w:12,h:0.9,fontFace:HF,fontSize:31,bold:true,color:WHITE,margin:0});
s.addText("Close the first ~AU$400K of signed, match-eligible capital by 31 August 2026.   Signed LOIs today: 0 — a conversation problem, not a discovery problem.",{x:MX,y:1.85,w:12,h:0.6,fontFace:BF,fontSize:14,color:OCHRE,margin:0});
const rows=[["Grants — junior","Snow R4/R5 · Centrecorp · VFFF","~AU$500K",SAGE],["Catalytic top","QBE match — 1:1, repayable preferred","up to $400K",OCHRE],["Concessional debt — senior","SEFA working capital (gated on model + board)","AU$300K",TERRA]];
let ry=2.7;
rows.forEach(r=>{
  s.addShape(p.shapes.RECTANGLE,{x:MX,y:ry,w:7.6,h:0.92,fill:{color:"3A2E22"}});
  s.addShape(p.shapes.RECTANGLE,{x:MX,y:ry,w:0.12,h:0.92,fill:{color:r[3]}});
  s.addText([{text:r[0]+"   ",options:{fontFace:HF,fontSize:15,bold:true,color:WHITE}},{text:r[1],options:{fontFace:BF,fontSize:11.5,color:CREAM}}],{x:MX+0.32,y:ry,w:5.5,h:0.92,margin:0,valign:"middle",lineSpacing:15});
  s.addText(r[2],{x:MX+5.7,y:ry,w:1.8,h:0.92,fontFace:HF,fontSize:17,bold:true,color:r[3],align:"right",valign:"middle",margin:0});
  ry+=1.04;
});
s.addText("All amounts TARGET except the QBE invitation. No equity — the end-state is community-owned production.",{x:MX,y:5.9,w:7.6,h:0.6,fontFace:BF,fontSize:11.5,italic:true,color:CREAM,margin:0,lineSpacing:15});
s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:8.55,y:2.7,w:4.05,h:3.85,rectRadius:0.08,fill:{color:"3A2E22"},line:{color:"5A4B3C",width:1}});
s.addText("USE OF FUNDS",{x:8.8,y:2.85,w:3.6,h:0.35,fontFace:BF,fontSize:12,bold:true,color:OCHRE,charSpacing:2,margin:0});
s.addText([{text:"AU$60–80K   ",options:{fontFace:HF,fontSize:14,bold:true,color:WHITE}},{text:"50-bed in-source proof run\n",options:{fontFace:BF,fontSize:11.5,color:CREAM,breakLine:true}},{text:"$300–400K   ",options:{fontFace:HF,fontSize:14,bold:true,color:WHITE}},{text:"plant capex\n",options:{fontFace:BF,fontSize:11.5,color:CREAM,breakLine:true}},{text:"$150–200K   ",options:{fontFace:HF,fontSize:14,bold:true,color:WHITE}},{text:"working-capital buffer\n",options:{fontFace:BF,fontSize:11.5,color:CREAM,breakLine:true}},{text:"~$200K   ",options:{fontFace:HF,fontSize:14,bold:true,color:WHITE}},{text:"GM + Business Development hires",options:{fontFace:BF,fontSize:11.5,color:CREAM}}],{x:8.8,y:3.35,w:3.6,h:3.1,lineSpacing:30,margin:0,valign:"top"});
footer(s,11);

// 12 STRUCTURE
s=p.addSlide();s.background={color:WHITE};
kicker(s,"The structure protects the mission");
title(s,"Built to hand over, not to hold");
s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:MX,y:2.4,w:5.7,h:1.9,rectRadius:0.08,fill:{color:CREAM},line:{color:LINEC,width:1},shadow:sh()});
s.addText([{text:"A Curious Tractor Pty Ltd\n",options:{fontFace:HF,fontSize:18,bold:true,color:INK}},{text:"Trading company (t/a Goods on Country). All Goods activity migrating in this FY from sole-trader.",options:{fontFace:BF,fontSize:12.5,color:MUTE}}],{x:MX+0.25,y:2.6,w:5.2,h:1.5,margin:0,lineSpacing:18,valign:"top"});
s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:6.9,y:2.4,w:5.7,h:1.9,rectRadius:0.08,fill:{color:CREAM},line:{color:LINEC,width:1},shadow:sh()});
s.addText([{text:"The Butterfly Movement Ltd\n",options:{fontFace:HF,fontSize:18,bold:true,color:INK}},{text:"DGR home (ACNC, Item 1). Operational FY2026-27 — not live today; donors can't tax-receipt yet.",options:{fontFace:BF,fontSize:12.5,color:MUTE}}],{x:7.15,y:2.6,w:5.2,h:1.5,margin:0,lineSpacing:18,valign:"top"});
s.addText("MILESTONES",{x:MX,y:4.6,w:5.7,h:0.3,fontFace:BF,fontSize:12,bold:true,color:SAGE,charSpacing:2,margin:0});
s.addText([{text:"First community-employed production operator within 12 months",options:{fontFace:BF,fontSize:13,color:INK,bullet:true,breakLine:true}},{text:"First Aboriginal-controlled operating entity scoped by end FY2026-27",options:{fontFace:BF,fontSize:13,color:INK,bullet:true}}],{x:MX,y:4.95,w:5.7,h:1.6,lineSpacing:20,margin:0,valign:"top"});
s.addText("OPEN, AND SAID OUT LOUD",{x:6.9,y:4.6,w:5.7,h:0.3,fontFace:BF,fontSize:12,bold:true,color:TERRA,charSpacing:2,margin:0});
s.addText([{text:"Governance is advisory, not yet a fiduciary board",options:{fontFace:BF,fontSize:13,color:INK,bullet:true,breakLine:true}},{text:"Final operating form & mission-lock undecided (with MinterEllison)",options:{fontFace:BF,fontSize:13,color:INK,bullet:true,breakLine:true}},{text:"51% First Nations ownership gates 4 of 8 procurement channels",options:{fontFace:BF,fontSize:13,color:INK,bullet:true}}],{x:6.9,y:4.95,w:5.7,h:1.7,lineSpacing:20,margin:0,valign:"top"});
footer(s,12);

// 13 WHY NOW
s=p.addSlide();s.background={color:WHITE};
kicker(s,"Why now");
title(s,"Four clocks, one ~12-week window");
const clocks=[["QBE match gate","Time-boxed and binary. Stage 2 closes Sep 2026, assessed Oct, outcomes Nov."],["Freshest proof","Weeks after the May 2026 Utopia deployment — the strongest evidence we've ever had."],["Free program machinery","Skilled volunteering + 6-session PIN mentoring running now; ends August."],["Funders watching each other","Snow R4/R5, Centrecorp (~end-June board), SEFA advanced — all waiting for the first to move."]];
clocks.forEach((c,i)=>{const col=i%2,row=Math.floor(i/2);const X=MX+col*6.05,Y=2.5+row*2.0;
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:X,y:Y,w:5.75,h:1.75,rectRadius:0.08,fill:{color:CREAM},line:{color:LINEC,width:1},shadow:sh()});
  s.addShape(p.shapes.OVAL,{x:X+0.25,y:Y+0.28,w:0.55,h:0.55,fill:{color:TERRA}});
  s.addText(String(i+1),{x:X+0.25,y:Y+0.28,w:0.55,h:0.55,fontFace:HF,fontSize:18,bold:true,color:WHITE,align:"center",valign:"middle",margin:0});
  s.addText([{text:c[0]+"\n",options:{fontFace:HF,fontSize:16,bold:true,color:INK}},{text:c[1],options:{fontFace:BF,fontSize:12,color:MUTE}}],{x:X+1.0,y:Y+0.22,w:4.55,h:1.4,margin:0,lineSpacing:17,valign:"top"});
});
footer(s,13);

// 14 CLOSE
s=p.addSlide();s.background={color:EARTH};
s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:0.28,h:H,fill:{color:TERRA}});
s.addText("Be the first signed commitment.",{x:MX,y:2.0,w:12,h:1.6,fontFace:HF,fontSize:42,bold:true,color:WHITE,margin:0,lineSpacing:48});
s.addText("One catalytic dollar is structured to unlock several behind it. The match doubles it, concessional debt follows it, and a 50-bed run proves the economics that turn a funded program into a business that can belong to the communities it serves.",{x:MX,y:3.7,w:11.0,h:1.6,fontFace:BF,fontSize:16,color:CREAM,lineSpacing:25,margin:0});
s.addShape(p.shapes.LINE,{x:MX,y:5.7,w:11.9,h:0,line:{color:"5A4B3C",width:1}});
s.addText([{text:"Ben Knight   ",options:{fontFace:HF,fontSize:15,bold:true,color:WHITE}},{text:"·   Nicholas Marchesi   ·   goodsoncountry.com/admin/assets",options:{fontFace:BF,fontSize:13,color:CREAM}}],{x:MX,y:5.9,w:12,h:0.4,margin:0});
s.addText("Re-pull Xero figures immediately before sending. Use only consent-cleared community voices.",{x:MX,y:6.5,w:12,h:0.4,fontFace:BF,fontSize:10,italic:true,color:"C9B9A6",margin:0});

p.writeFile({fileName:"Goods-on-Country-Investor-Deck.pptx"}).then(f=>console.log("WROTE",f));
