// Read-only export. Run with Node 22.18+ from any directory.
// Emits module-derived CellData for The problem; does not contact Google Sheets.
import * as rhd from '../../../v2/src/lib/data/rhd-problem.ts';
import * as recycling from '../../../v2/src/lib/data/recycling-problem.ts';
import * as employment from '../../../v2/src/lib/data/employment-problem.ts';
import * as ownership from '../../../v2/src/lib/data/ownership-problem.ts';

export function buildProblemSheet(modules, sheetId=153, index=14) {
 const rows=[], merges=[], heights={}, tables=[], refs=[], headings=[], ceilings=[], callouts=[];
 const clean=s=>String(s).replace(/\u2014/g,',');
 const cell=(s,note,url)=>({userEnteredValue:{stringValue:clean(s)},...(note?{note}:{}),...(url?{textFormatRuns:[{startIndex:0,format:{link:{uri:url}}}]}:{})});
 const line=(s,kind='plain',h=42,note)=>{let i=rows.length;rows.push({values:[cell(s,note),{},{},{},{}]});merges.push(i);heights[i]=h;if(kind==='heading')headings.push(i);if(kind==='ceiling')ceilings.push(i);if(kind==='callout')callouts.push(i);return i;};
 const blank=()=>line('','plain',18);
 const title=line('The problem','heading',46);
 line('Source view | Health, environment, employment and ownership | Refreshed 11 September 2026','plain',40);
 rows.push({values:[cell('Home',null,'#gid=140'),cell('Plant budget',null,'#gid=104'),cell('Guide',null,'#gid=101'),{},{}]});heights[2]=30;
 line('Read from the four typed modules. Change a module first, then refresh this view. These are evidence figures, not calculation inputs. No figure may be multiplied by a bed count.','plain',62);
 line('Grades follow the source review: verified = primary source read; unverified = primary not opened. Reasons remain beside the affected rows.','plain',48);
 const sourceName=url=>url.includes('aihw')?'AIHW':url.includes('dcceew')?'DCCEEW':url.includes('nepc')?'NEPC':url.includes('rdant')?'RDA NT':url.includes('pc.gov')?'Productivity Commission':url.includes('dewr')?'DEWR':url.includes('niaa')?'NIAA':'Supply Nation';
 const table=(name,figures)=>{
   const start=rows.length;
   rows.push({values:['Figure','What it counts','As at','Grade','Source'].map(x=>cell(x))});heights[start]=34;
   for(const f of figures){
     const row=rows.length;
     const grade=f.doNotUse?'unverified; DO NOT USE':f.grade;
     rows.push({values:[cell(f.value,f.ref),cell(f.what+(f.grade==='unverified'&&f.note?'\nWhy unverified: '+f.note:''),f.note),cell(f.asAt),cell(grade),cell(sourceName(f.sourceUrl),f.sourceUrl+'\n'+f.ref,f.sourceUrl)]});
     refs.push({row:row+1,...f});
     const lengths=[f.value.length/23,(f.what+(f.grade==='unverified'?f.note||'':'')).length/43,f.asAt.length/12,grade.length/13];
     heights[row]=Math.max(66,Math.ceil(Math.max(...lengths))*17+24);
   }
   tables.push({name,start,end:rows.length});
 };
 const group=(key,exportName,indices)=>{
   const arr=modules[key][exportName];
   return (indices||arr.map((_,i)=>i)).map(i=>({...arr[i],grade:arr[i].grade||'verified',ref:key+'-problem.ts::'+exportName+'['+i+']'}));
 };
 const H=modules.rhd,R=modules.recycling,E=modules.employment,O=modules.ownership;
 line('Health','heading',38);
 line('Overcrowding is the named risk factor','callout',38);
 line(H.CROWDING_RISK.aihwOnCrowding+' AIHW and the ABS community extract use the same Canadian National Occupancy Standard (CNOS). The community overcrowding figures measure that risk factor; they are not disease rates.','plain',86,'rhd-problem.ts::CROWDING_RISK; community-need.ts');
 const selected=H.CROWDING_BY_REGION.filter(r=>[70,49,15].includes(r.pct));
 line(selected.map(r=>r.region+': '+r.pct+'%').join('  |  '),'callout',64,'rhd-problem.ts::CROWDING_BY_REGION; '+H.CROWDING_BY_REGION_SOURCE.asAt);
 line(H.CROWDING_RISK.cnosDefinition+' Regional figures below are from '+H.CROWDING_BY_REGION_SOURCE.asAt+'. Regions and individual community figures are different geographic measures.','plain',80);
 blank();
 table('ProblemCrowding',H.CROWDING_BY_REGION.map((r,i)=>({...r,i})).filter(r=>r.region!=='Top End and Tiwi Islands').map(r=>({value:r.pct+'%',what:r.region+(r.note?'. '+r.note:''),asAt:H.CROWDING_BY_REGION_SOURCE.asAt,grade:'verified',sourceUrl:H.CROWDING_BY_REGION_SOURCE.url,ref:'rhd-problem.ts::CROWDING_BY_REGION['+r.i+']'})));
 blank();
 line('Disease burden and new diagnoses','heading',38);blank();
 table('ProblemHealth',[...group('rhd','RHD_BURDEN',[0,1,2,3,4]),...group('rhd','ARF_INCIDENCE',[0,1,2,3])]);
 line('Claim ceiling: '+H.RHD_CLAIM_CEILING,'ceiling',104,'rhd-problem.ts::RHD_CLAIM_CEILING');
 blank();
 line('Environment','heading',38);blank();
 table('ProblemEnvironment',[...group('recycling','NATIONAL_PLASTIC'),...group('recycling','REMOTE_SERVICE',[1,0])]);
 line('Claim ceiling: '+R.RECYCLING_CLAIM_CEILING,'ceiling',114,'recycling-problem.ts::RECYCLING_CLAIM_CEILING');
 line(R.REMOTE_BARRIERS.join(' '),'plain',78,'recycling-problem.ts::REMOTE_BARRIERS');blank();
 line('Employment','heading',38);blank();
 table('ProblemEmployment',[...group('employment','TARGET_8'),...group('employment','BY_REMOTENESS'),...group('employment','REMOTE_PROGRAMS')]);
 line('Claim ceiling: '+E.EMPLOYMENT_CLAIM_CEILING,'ceiling',114,'employment-problem.ts::EMPLOYMENT_CLAIM_CEILING');blank();
 line('Ownership','heading',38);
 line('Use the primary comparison: '+O.INDIGENOUS_EMPLOYMENT_IN_INDIGENOUS_BUSINESS[0].value+' of employees, against '+O.INDIGENOUS_EMPLOYMENT_IN_INDIGENOUS_BUSINESS[1].value+' targets. The targets are not an observed national employment rate.','callout',68);
 blank();
 table('ProblemOwnership',[...group('ownership','INDIGENOUS_EMPLOYMENT_IN_INDIGENOUS_BUSINESS').map(f=>({...f,doNotUse:f.value==='40 to 100 times'})),...group('ownership','SECTOR_SCALE')]);
 line(O.OWNERSHIP_THRESHOLD.definition+' '+O.OWNERSHIP_THRESHOLD.alsoGates,'plain',116,'ownership-problem.ts::OWNERSHIP_THRESHOLD\n'+O.OWNERSHIP_THRESHOLD.sourceUrl);
 line('Claim ceiling: '+O.OWNERSHIP_CLAIM_CEILING,'ceiling',114,'ownership-problem.ts::OWNERSHIP_CLAIM_CEILING');blank();
 line('Refresh from rhd-problem.ts, recycling-problem.ts, employment-problem.ts and ownership-problem.ts. Source links and module row references are retained in cell notes. This tab has no calculation formulas.','plain',70);
 const rgb=(r,g,b)=>({red:r/255,green:g/255,blue:b/255}), green=rgb(40,62,50),cream=rgb(245,245,240),pale=rgb(233,239,230),white=rgb(255,255,255);
 const range=(start,end,c=0,d=5)=>({sheetId,startRowIndex:start,endRowIndex:end,startColumnIndex:c,endColumnIndex:d});
 const format=(start,end,fmt,c=0,d=5)=>({repeatCell:{range:range(start,end,c,d),cell:{userEnteredFormat:fmt},fields:'userEnteredFormat'}});
 const requests=[
 {addSheet:{properties:{sheetId,title:'The problem',index,gridProperties:{rowCount:rows.length+5,columnCount:5,frozenRowCount:2,hideGridlines:true},tabColorStyle:{rgbColor:green}}}},
 {updateCells:{range:range(0,rows.length),rows,fields:'userEnteredValue,note,textFormatRuns'}},
 format(0,rows.length,{backgroundColor:white,textFormat:{fontFamily:'Arial',fontSize:11,foregroundColor:green},wrapStrategy:'WRAP',verticalAlignment:'MIDDLE',numberFormat:{type:'TEXT'}}),
 ...merges.map(i=>({mergeCells:{range:range(i,i+1),mergeType:'MERGE_ALL'}})),
 ...headings.map(i=>format(i,i+1,{backgroundColor:i===0?white:green,textFormat:{fontFamily:'Arial',fontSize:i===0?24:17,bold:true,foregroundColor:i===0?green:white},verticalAlignment:'MIDDLE',wrapStrategy:'WRAP'})),
 ...[...callouts,...ceilings].map(i=>format(i,i+1,{backgroundColor:pale,textFormat:{fontFamily:'Arial',fontSize:11,bold:callouts.includes(i),foregroundColor:green},wrapStrategy:'WRAP',verticalAlignment:'MIDDLE'})),
 ...tables.map(t=>({addTable:{table:{name:t.name,range:range(t.start,t.end)}}})),
 ...[150,290,85,90,110].map((pixelSize,i)=>({updateDimensionProperties:{range:{sheetId,dimension:'COLUMNS',startIndex:i,endIndex:i+1},properties:{pixelSize},fields:'pixelSize'}})),
 ...Object.entries(heights).map(([i,pixelSize])=>({updateDimensionProperties:{range:{sheetId,dimension:'ROWS',startIndex:+i,endIndex:+i+1},properties:{pixelSize},fields:'pixelSize'}})),
 {addConditionalFormatRule:{index:0,rule:{ranges:tables.map(t=>range(t.start+1,t.end,3,4)),booleanRule:{condition:{type:'TEXT_CONTAINS',values:[{userEnteredValue:'unverified'}]},format:{backgroundColor:rgb(255,237,216),textFormat:{bold:true,foregroundColor:rgb(126,66,16)}}}}}},
 {addConditionalFormatRule:{index:0,rule:{ranges:tables.map(t=>range(t.start+1,t.end)),booleanRule:{condition:{type:'TEXT_CONTAINS',values:[{userEnteredValue:'DO NOT USE'}]},format:{backgroundColor:rgb(251,223,217),textFormat:{bold:true,foregroundColor:rgb(142,40,30)}}}}}}
 ];
 if(refs.length!==33||refs.filter(f=>f.grade==='unverified').length!==5)throw Error('Unexpected module row count');
 if(rows.some(r=>r.values.some(c=>c.userEnteredValue?.formulaValue)))throw Error('Calculation found');
 return {requests,rows,tables,refs,ceilings,headings,heights};
}

const result=buildProblemSheet({rhd,recycling,employment,ownership});
console.log(JSON.stringify({sheet:'The problem',sheetId:153,rows:result.rows,refs:result.refs,ceilings:result.ceilings,tables:result.tables},null,2));

