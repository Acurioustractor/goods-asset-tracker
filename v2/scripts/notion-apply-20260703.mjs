// Apply the approved 2026-07-03 reconciliation writes to the Notion Funder Pipeline DB.
// DRY=1 prints every intended write and touches nothing.
import fs from 'fs';
import path from 'path';
function loadEnv(p){ if(!fs.existsSync(p))return; for(const line of fs.readFileSync(p,'utf8').split('\n')){ const m=line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/); if(m&&!process.env[m[1]]) process.env[m[1]]=m[2].replace(/^["']|["']$/g,''); } }
loadEnv(path.resolve('.env.local'));
loadEnv(path.resolve('../../act-global-infrastructure/.env.local'));
const TOKEN = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;
if(!TOKEN){ console.error('no notion token'); process.exit(1); }
const DRY = process.env.DRY === '1';
const DB = 'c296ebc96ecd47899a9f805e8dd0d1cd';
const DASHBOARD = '390ebcf981cf8158ad49eb0461538324';
const H = { Authorization:`Bearer ${TOKEN}`, 'Notion-Version':'2022-06-28', 'Content-Type':'application/json' };
async function api(method, url, body){
  if(DRY && method!=='GET' && method!=='QUERY'){ console.log(`DRY ${method} ${url}\n  ${JSON.stringify(body).slice(0,300)}`); return {dry:true}; }
  const res = await fetch(`https://api.notion.com/v1${url}`, { method: method==='QUERY'?'POST':method, headers:H, body: body?JSON.stringify(body):undefined });
  if(!res.ok){ console.error(`FAIL ${method} ${url}: ${res.status} ${await res.text()}`); process.exit(1); }
  return res.json();
}
const rt = s => ({ rich_text:[{ text:{ content:s } }] });
const sel = s => ({ select:{ name:s } });

// 1. schema: title prop name + does Bucket exist
const db = await api('GET', `/databases/${DB}`);
const titleProp = Object.entries(db.properties).find(([,v])=>v.type==='title')[0];
const hasBucket = Boolean(db.properties['Bucket']);
console.log(`title prop: "${titleProp}", Bucket exists: ${hasBucket}`);

// 2. add Bucket select property
if(!hasBucket){
  await api('PATCH', `/databases/${DB}`, { properties: { Bucket: { select: { options: [
    {name:'QBE priority',color:'red'},{name:'Workbench',color:'blue'},{name:'Stewarding',color:'green'},
    {name:'Buyer-demand',color:'yellow'},{name:'Parked',color:'gray'} ] } } } });
  console.log('Bucket property added');
}

// 3. bucket existing rows by name match
const BUCKET_MAP = [
  ['Metro Finance','QBE priority'], ['LendForGood','QBE priority'], ['SEFA','QBE priority'], ['Minderoo','QBE priority'],
  ['CommBank','Workbench'], ['Tripple','Workbench'], ['Eloise Hall','Workbench'], ['First Nations Finance','Workbench'],
  ['Rotary Global Grant','Workbench'], ['Brian M Davis','Workbench'], ['Philanthropy Australia','Workbench'],
  ['Tim Fairfax','Workbench'], ['REAL Innovation Fund','Workbench'], ['CEFC','Workbench'], ['Rotary Eclub','Workbench'],
  ['Bryan Foundation','Workbench'], ['Invest NT','Workbench'], ['Ian Potter','Workbench'], ['QBE Foundation','Workbench'],
];
let cursor, rows=[];
do { const r = await api('QUERY', `/databases/${DB}/query`, cursor?{start_cursor:cursor}:{}); rows.push(...r.results); cursor=r.has_more?r.next_cursor:null; } while(cursor);
const nameOf = pg => pg.properties[titleProp].title.map(t=>t.plain_text).join('');
const existingNames = rows.map(nameOf);
console.log(`${rows.length} existing rows`);
for(const pg of rows){
  const n = nameOf(pg);
  const hit = BUCKET_MAP.find(([k])=>n.toLowerCase().includes(k.toLowerCase()));
  const cur = pg.properties['Bucket']?.select?.name;
  if(hit && cur!==hit[1]){ await api('PATCH', `/pages/${pg.id}`, { properties:{ Bucket: sel(hit[1]) } }); console.log(`bucket: ${n} -> ${hit[1]}`); }
  else if(!hit) console.log(`NO MATCH (left unbucketed): ${n}`);
}

// 4. new rows: 9 register mirrors (QBE priority) + 8 workbench qualify-ins
const NEW_ROWS = [
  // name, amount, stage, type, action, bucket, next, send
  ['White Box SELF', 250000, 'Cultivating','repayable','ready-to-send','QBE priority','Lodge the SELF EOI; ask the PBI/DGR or Supply Nation eligibility question in the EOI instead of self-screening out.','SELF EOI + entity wording block + cost model v6'],
  ['Snow Foundation — first-mover QBE commitment', 100000,'Ask made','philanthropic','needs-followup','QBE priority','Confirm the Round 4 email to Sally went out; book the call; push toward a repayable LOI so it counts as match.','Snow first-mover brief + repayable reframe draft'],
  ['Centrecorp Foundation — next-round grant', 75000,'Ask made','philanthropic','needs-followup','QBE priority','Time the ask to the July board. Keep the grant (match) separate from the bed order (revenue).','Centrecorp next-round brief + Utopia 87-bed proof'],
  ['Vincent Fairfax Family Foundation (VFFF)', 50000,'Cultivating','philanthropic','ready-to-send','QBE priority','Send a short renewal note tied to the raise. Never double-count with FRRR Backing the Future (same $50K).','Renewal note + impact report'],
  ['SEDI Capability Building Grants', 120000,'Qualified','philanthropic','cultivate','QBE priority','Prepare and lodge. No ownership gate, verified open.','Canonical numbers sheet + impact framework'],
  ['FRRR Strengthening Rural Communities', 50000,'Qualified','philanthropic','cultivate','QBE priority','Lodge the remote-bedding and plastic-circularity application. Register due 2026-09-17.','Canonical numbers sheet + impact framework'],
  ['First Nations Clean Energy Advice Grants', 80000,'Identified','philanthropic','cultivate','QBE priority','Qualify for the plant energy scope, move to Qualified. Closes 3 Sep.','Canonical numbers sheet + cost-story'],
  ['ANZ Seeds of Renewal', 15000,'Qualified','philanthropic','cultivate','QBE priority','Lodge before 30 Jul.','Canonical numbers sheet + impact framework'],
  ['Sisters of Charity Community Grants', 20000,'Identified','philanthropic','cultivate','QBE priority','Qualify the DGR Item 1 partner-led route or park.','Canonical numbers sheet + impact framework'],
  ['NAACT (Northern Australian Aboriginal Charitable Trust)', 0,'Identified','philanthropic','cultivate','Workbench','28 Jun work-five. NT footprint fit. Qualify with the SIH knockouts, then cultivate or park.','Public pitch link'],
  ['Yeperenye Charitable Trust', 0,'Identified','philanthropic','cultivate','Workbench','Alice Springs base, Central Australia orbit alongside Centrecorp and Oonchiumpa. Qualify.','Public pitch link'],
  ['StreetSmart Australia', 0,'Identified','philanthropic','cultivate','Workbench','Homelessness-adjacent bedding fit, small grants. Qualify small.','Public pitch link'],
  ['INPEX Community Investment', 0,'Identified','philanthropic','cultivate','Workbench','Rolling, NT, priorities map near one to one. Cost-offset partner, never match.','Public pitch link'],
  ['Australian Communities Foundation', 0,'Identified','philanthropic','cultivate','Workbench','Giving-circle and DAF pathway to individual philanthropists. Light touch.','Public pitch link'],
];
for(const [name, amount, stage, type, action, bucket, next, send] of NEW_ROWS){
  const dupe = existingNames.find(n => n.toLowerCase().includes(name.toLowerCase().slice(0,22)) || name.toLowerCase().includes(n.toLowerCase().slice(0,22)));
  if(dupe){ console.log(`SKIP duplicate: "${name}" matches existing "${dupe}"`); continue; }
  const props = {
    [titleProp]: { title:[{ text:{ content:name } }] },
    Amount: { number: amount },
    Stage: sel(stage), Type: sel(type), Action: sel(action), Bucket: sel(bucket),
    'Next action': rt(next), 'Send next': rt(send),
  };
  await api('POST', '/pages', { parent:{ database_id: DB }, properties: props });
  console.log(`created: ${name} [${bucket}]`);
}

// 5. Machine Dashboard: append the strategy block
await api('PATCH', `/blocks/${DASHBOARD}/children`, { children: [
  { heading_2: { rich_text:[{ text:{ content:'Pipeline strategy applied, 2026-07-03' } }] } },
  { paragraph: { rich_text:[{ text:{ content:'Signed $0 of $400,000, 8.4 weeks to 31 Aug. Every open Supporter Journey record bucketed (QBE priority / Workbench / Stewarding / Buyer-demand / Parked); the Bucket field now lives on the Funder Pipeline DB. Nine register mirror rows and five workbench qualify-ins added. Full strategy: wiki/outputs/2026-07-03-pipeline-strategy.md. Share board: Claude Design, Investor Materials, invest-funder-pipeline.' } }] } },
  { paragraph: { rich_text:[{ text:{ content:'Decisions applied 2026-07-03: SEFA set to $300,000 (register, GHL, send docs, design surfaces; lead stack now $475K). Minderoo ask confirmed real, Ask made everywhere, push toward a written LOI. GHL machine token fixed (fresh private integration). Still open: Tim Fairfax promotes to the register only on Katie Norman written confirmation; Bryan Foundation stays workbench, nudge first; the five sends.' } }] } },
] });
console.log('Machine Dashboard block appended');
console.log(DRY ? 'DRY RUN complete, nothing written' : 'APPLY complete');
