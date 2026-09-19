#!/usr/bin/env node
/**
 * Builds the application attachments marked "Claude builds" on the Notion page "Goods applications:
 * facts, attachments, pages and Q&As" (16 September 2026). Every figure is imported from the data
 * modules the website uses, so an attachment can never say something the site does not. Run from v2/:
 *
 *   node --env-file=.env.local --import ./scripts/lib/register-ts.mjs scripts/build-attachments.mjs
 *
 * Writes HTML, PDF (headless Chrome) and CSV to ../deliverables/application-attachments-2026-09/.
 * The asset register extract reads the live register (Supabase, service role, read only) and carries
 * no names, households, GPS or photographs.
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const V2 = resolve(here, '..');
const REPO = resolve(V2, '..');
const OUT = resolve(REPO, 'deliverables/application-attachments-2026-09');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DATE = '16 September 2026';

const { ORGANISATION } = await import('../src/lib/data/organisation.ts');
const { RAISE, BED, STATIONS, PANELS, SHEET, LOGOS } = await import('../src/lib/data/model-placemat.ts');
const { MONEY_LANES, MONEY_NEVER, BED_WAYS } = await import('../src/lib/data/money-lanes.ts');
const { BUYERS, GOVERNANCE, MEASURES } = await import('../src/lib/data/pitch-chapters.ts');
const { STORYTELLER_REGISTRY } = await import('../src/lib/data/storyteller-registry.ts');
const { CANONICAL_ASSETS } = await import('../src/lib/data/asset-canonical.ts');
const { PAID_BEDS } = await import('../src/lib/data/story-questions.ts');
const { PLASTIC_KG_PER_BED } = await import('../src/lib/data/products.ts');
const { FACILITY_MODULES, MODULES_LOW_AUD, MODULES_HIGH_AUD, FACILITY_ALLOWANCE_AUD, FACILITY_OUTPUT, MONTH_SIX_QUESTIONS } = await import('../src/lib/data/facility-modules.ts');
const { PAID_INVOICES, PAID_INVOICE_BEDS, PAID_INVOICE_NET_AUD, PAID_INVOICE_INCL_GST_AUD } = await import('../src/lib/data/paid-trade.ts');
const { GRANTS_RECEIVED, GRANTS_RECEIVED_TOTAL_AUD, GRANTS_RECEIVED_AS_AT, GRANT_BASIS_LABEL } = await import('../src/lib/data/grants-received.ts');
const { RUNNING_COST_AUD, BREAK_EVEN_BEDS, FACILITY_CAPACITY_BEDS, PLAN_BEDS } = await import('../src/lib/data/the-year.ts');
const { renderPlacematSvg } = await import('../src/lib/model/placemat-svg.ts');
const { renderMoneyFlowSvg } = await import('../src/lib/model/money-flow-svg.ts');

// ---------------------------------------------------------------------------------------------
// Shared page shell

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;
const num = (n) => Math.round(n).toLocaleString('en-AU');
const entityLine = `${ORGANISATION.legalName}, trading as ${ORGANISATION.tradingName}. ABN ${ORGANISATION.abn}. ${ORGANISATION.charityLine}`;

const CSS = `
@page { size: A4; margin: 16mm 15mm 18mm; }
@page landscape { size: A4 landscape; margin: 12mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, 'Helvetica Neue', Arial, sans-serif; font-size: 10.5pt; line-height: 1.5; color: #2B2A26; }
.landscape { page: landscape; }
header.doc { border-bottom: 2px solid #2B2A26; padding-bottom: 6pt; margin-bottom: 14pt; display: flex; justify-content: space-between; align-items: flex-end; gap: 12pt; }
header.doc .who { font-size: 8pt; letter-spacing: .14em; text-transform: uppercase; color: #C45C3E; font-weight: 600; }
header.doc .when { font-size: 8pt; color: #7A7363; text-align: right; }
h1 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 22pt; line-height: 1.1; margin: 0 0 6pt; }
h2 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 13.5pt; margin: 16pt 0 5pt; break-after: avoid; }
p { margin: 0 0 7pt; }
.lead { font-size: 11.5pt; color: #4A4741; margin-bottom: 10pt; }
.small { font-size: 8.5pt; color: #7A7363; }
.label { display: inline-block; font-size: 7pt; letter-spacing: .12em; text-transform: uppercase; color: #7A7363; border: 1px solid #E6DFD1; border-radius: 3pt; padding: 0 4pt; }
table { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt; font-size: 9.5pt; }
th { text-align: left; font-weight: 600; font-size: 8pt; letter-spacing: .06em; text-transform: uppercase; color: #7A7363; border-bottom: 1.5px solid #2B2A26; padding: 4pt 5pt; }
td { border-bottom: 1px solid #E6DFD1; padding: 4pt 5pt; vertical-align: top; }
td.n, th.n { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
tr.total td { font-weight: 600; border-top: 1.5px solid #2B2A26; border-bottom: none; }
tr { break-inside: avoid; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; }
.grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8pt; }
.box { border: 1px solid #E6DFD1; border-radius: 6pt; padding: 8pt 10pt; break-inside: avoid; }
.box.ink { background: #2B2A26; color: #FBF8F1; border-color: #2B2A26; }
.box.clay { background: #F3E4DA; border-color: #F3E4DA; }
.box.sage { background: #E9EDE3; border-color: #E9EDE3; }
.box.dashed { border-style: dashed; border-color: #A8643F; }
.box h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 11pt; margin: 0 0 3pt; }
.big { font-family: 'Playfair Display', Georgia, serif; font-size: 20pt; font-weight: 600; line-height: 1; }
.arrow { text-align: center; color: #A8643F; font-size: 12pt; margin: 2pt 0; }
ol, ul { margin: 0 0 8pt; padding-left: 16pt; }
li { margin-bottom: 2pt; }
svg { max-width: 100%; height: auto; }
footer.doc { margin-top: 14pt; border-top: 1px solid #E6DFD1; padding-top: 5pt; font-size: 7.5pt; color: #7A7363; }
.draft { color: #A33C22; font-weight: 600; }
`;

function page({ id, kicker, title, body, landscape = false, compact = false }) {
  // Ben, 15 September 2026: no A before the dollar sign on any sheet.
  body = body.replace(/A\$(?=\d)/g, '$');
  const extra = `${landscape ? '@page { size: A4 landscape; margin: 11mm; }' : ''}${compact ? '@page{margin:11mm 14mm 11mm} body{font-size:9.2pt;line-height:1.38} h1{font-size:18pt} h2{font-size:11.5pt;margin:8pt 0 3pt} .lead{font-size:10pt;margin-bottom:6pt} .box{padding:4pt 8pt} .box h3{font-size:9.8pt;margin:0 0 1pt} .box p{margin:0} .arrow{font-size:9pt;margin:0;line-height:1.1} table{font-size:8.4pt;margin:2pt 0 6pt} td,th{padding:2.5pt 4pt} .grid2{gap:6pt} header.doc{margin-bottom:8pt} footer.doc{margin-top:6pt}' : ''}`;
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet">
<style>${CSS}${extra}</style></head><body class="${landscape ? 'landscape' : ''}">
<header class="doc"><div><div class="who">${esc(kicker)}</div></div><div class="when">Goods on Country<br>${DATE}</div></header>
<h1>${esc(title)}</h1>
${body}
<footer class="doc">${esc(entityLine)} Attachment ${esc(id)}. Built from the same records as goodsoncountry.com.</footer>
</body></html>`;
}

const built = [];
async function emit(slug, html, extra = {}) {
  const htmlPath = resolve(OUT, `${slug}.html`);
  const pdfPath = resolve(OUT, `${slug}.pdf`);
  await writeFile(htmlPath, html, 'utf8');
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=6000', `--print-to-pdf=${pdfPath}`, `file://${htmlPath}`], { stdio: 'ignore' });
  if (!existsSync(pdfPath)) throw new Error(`No PDF written for ${slug}`);
  built.push({ slug, pdf: pdfPath, ...extra });
  console.log(`wrote ${slug}.pdf`);
}

await mkdir(OUT, { recursive: true });
if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);

// ---------------------------------------------------------------------------------------------
// 01 Asset register extract

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Run with --env-file=.env.local: the register extract reads the live register.');
const res = await fetch(`${url}/rest/v1/assets?select=unique_id,product,community,status,supply_date,quantity&status=eq.deployed&order=unique_id`, {
  headers: { apikey: key, Authorization: `Bearer ${key}`, Range: '0-4999' },
});
if (!res.ok) throw new Error(`Register read failed: ${res.status}`);
const rows = (await res.json()).filter((r) => /bed/i.test(r.product));
const qty = (r) => r.quantity ?? 1;
const beds = rows.reduce((n, r) => n + qty(r), 0);
const stretch = rows.filter((r) => /stretch/i.test(r.product)).reduce((n, r) => n + qty(r), 0);
const basket = rows.filter((r) => /basket/i.test(r.product)).reduce((n, r) => n + qty(r), 0);
if (beds !== CANONICAL_ASSETS.bedsDeployed || stretch !== CANONICAL_ASSETS.stretchBedsDeployed || basket !== CANONICAL_ASSETS.basketBedsDeployed) {
  throw new Error(`Register (${beds} beds, ${stretch} Stretch, ${basket} Basket) disagrees with canon (${CANONICAL_ASSETS.bedsDeployed}, ${CANONICAL_ASSETS.stretchBedsDeployed}, ${CANONICAL_ASSETS.basketBedsDeployed}). Reconcile before building.`);
}
const batchOf = (id) => id.split('-').slice(0, 2).join('-');
const csvCell = (v) => (/[",\n]/.test(String(v ?? '')) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? ''));
const csv = ['asset_id,batch,product,community,supply_date,status,quantity', ...rows.map((r) => [r.unique_id, batchOf(r.unique_id), r.product, r.community, (r.supply_date ?? '').slice(0, 10), r.status, qty(r)].map(csvCell).join(','))].join('\n');
await writeFile(resolve(OUT, '01-asset-register-extract.csv'), csv + '\n', 'utf8');

const byCommunity = new Map();
for (const r of rows) {
  const c = byCommunity.get(r.community) ?? { stretch: 0, basket: 0 };
  if (/stretch/i.test(r.product)) c.stretch += qty(r); else c.basket += qty(r);
  byCommunity.set(r.community, c);
}
const communityRows = [...byCommunity.entries()].sort((a, b) => (b[1].stretch + b[1].basket) - (a[1].stretch + a[1].basket));
const byBatch = new Map();
for (const r of rows) byBatch.set(batchOf(r.unique_id), (byBatch.get(batchOf(r.unique_id)) ?? 0) + qty(r));

await emit('01-asset-register-extract', page({
  id: '01', kicker: 'Asset register extract', title: `${CANONICAL_ASSETS.bedsDeployed} beds, one row per bed`,
  body: `
<p class="lead">Every bed recorded as deployed, read from the live asset register on ${DATE}. Each row carries an asset identifier, the batch it was made in, the product, the community and the supply date. The full list is in <strong>01-asset-register-extract.csv</strong> beside this file and runs from page 2.</p>
<div class="grid3">
  <div class="box"><div class="big">${num(beds)}</div>beds deployed</div>
  <div class="box"><div class="big">${num(stretch)}</div>Stretch Beds</div>
  <div class="box"><div class="big">${num(basket)}</div>Basket Beds, the first prototype</div>
</div>
<h2>By community</h2>
<table><tr><th>Community</th><th class="n">Stretch Beds</th><th class="n">Basket Beds</th><th class="n">Beds</th></tr>
${communityRows.map(([c, v]) => `<tr><td>${esc(c)}</td><td class="n">${v.stretch}</td><td class="n">${v.basket}</td><td class="n">${v.stretch + v.basket}</td></tr>`).join('')}
<tr class="total"><td>${CANONICAL_ASSETS.communitiesServed} communities</td><td class="n">${stretch}</td><td class="n">${basket}</td><td class="n">${beds}</td></tr></table>
${byCommunity.size !== CANONICAL_ASSETS.communitiesServed ? `<p class="small">The register names places as they were recorded; the community count of ${CANONICAL_ASSETS.communitiesServed} is the reconciled figure.</p>` : ''}
<h2>How to read it</h2>
<p>The register counts beds that reached a community, including prototypes, gifted beds and the Basket Beds that came before the current product. The paid invoice record counts beds someone paid for (${PAID_BEDS} beds). A bed can sit in one, the other or both. Beds made and waiting to go out are recorded as ready and are not in this extract. The register is also how a bed is found again when somebody reports a fault.</p>
<p class="small">Batches in this extract: ${[...byBatch.entries()].sort().map(([b, n]) => `${esc(b)} (${n})`).join(', ')}.</p>
<div style="break-before: page"></div>
<h2>Every deployed bed</h2>
<table style="font-size:7.5pt"><tr><th>Asset</th><th>Product</th><th>Community</th><th>Supplied</th></tr>
${rows.map((r) => `<tr><td>${esc(r.unique_id)}${qty(r) > 1 ? ` (×${qty(r)})` : ''}</td><td>${esc(r.product)}</td><td>${esc(r.community)}</td><td>${esc((r.supply_date ?? '').slice(0, 10))}</td></tr>`).join('')}
</table>`,
}), { csv: resolve(OUT, '01-asset-register-extract.csv') });

// ---------------------------------------------------------------------------------------------
// 02 Consented story registry

const cleared = STORYTELLER_REGISTRY.filter((s) => s.tier === 'external').sort((a, b) => a.community.localeCompare(b.community) || a.name.localeCompare(b.name));
const usable = (s) => s.quotes.filter((q) => q.status === 'primary' || q.status === 'approved').length;
await emit('02-consented-story-registry', page({
  id: '02', kicker: 'Consented story registry', title: `${cleared.length} voices cleared to be quoted`,
  body: `
<p class="lead">The record that governs what Goods on Country may print. A person appears here only when they have agreed to be quoted on the open web and in funder material. Every quote in our applications comes from it, word for word. ${cleared.length} voices hold ${cleared.reduce((n, s) => n + usable(s), 0)} approved quotes between them. Carmelita and Colette share one card.</p>
<table><tr><th>Name</th><th>Role</th><th>Community</th><th class="n">Approved quotes</th></tr>
${cleared.map((s) => `<tr><td>${esc(s.name)}</td><td>${esc(s.role)}</td><td>${esc(s.community)}</td><td class="n">${usable(s)}</td></tr>`).join('')}
</table>
<h2>How consent is held</h2>
<p>Consent is recorded per person and per quote in Empathy Ledger, the consent-based storytelling platform Goods on Country uses. A quote is printed exactly as said and never paraphrased. People who have not cleared a tier are not quoted, and quotes on hold are not used. The full consent summary is attachment 10.</p>`,
}));

// ---------------------------------------------------------------------------------------------
// 03 Production log, blank template

const LOG_COLUMNS = ['Date', 'Bed or kit IDs', 'Step (press, cut, assemble, deliver)', 'Person', 'Paid hours', 'Rate ($/hour)', 'Beds completed', 'Plastic in (kg)', 'Scrap (kg)', 'Signed off by'];
await writeFile(resolve(OUT, '03-production-log-template.csv'), LOG_COLUMNS.map(csvCell).join(',') + '\n', 'utf8');
await emit('03-production-log-template', page({
  id: '03', kicker: 'Production log · blank template', title: 'Production log', landscape: true,
  body: `
<p class="lead"><span class="draft">Blank template. Opened September 2026, no entries yet.</span> One row for each block of paid work: who did it, how long, what it made and what it used. It is how the modelled ${FACILITY_OUTPUT.hoursPerBed} hours and ${PLASTIC_KG_PER_BED} kg a bed become measured numbers.</p>
<p>Site: ______________________ &nbsp; Week starting: ____________ &nbsp; Supervisor: ______________________</p>
<table style="font-size:8.5pt"><tr>${LOG_COLUMNS.map((c) => `<th>${esc(c)}</th>`).join('')}</tr>
${Array.from({ length: 14 }, () => `<tr>${LOG_COLUMNS.map(() => '<td style="height:19pt"></td>').join('')}</tr>`).join('')}
</table>
<p class="small">A spreadsheet copy with the same columns is 03-production-log-template.csv. Weigh plastic in and scrap on the same scale each day.</p>`,
}));

// ---------------------------------------------------------------------------------------------
// 04 Theory of change (rebuilt 18 Sep 2026 for Brian M. Davis: standard shape, this grant only)

const T = await import('../src/lib/data/theory-of-change.ts');
const tag = (x) => `<span class="label">${esc(x.label)}</span>`;
await emit('04-theory-of-change', page({
  id: '04', kicker: 'Theory of change', title: 'Beds made by young people, for their own community', landscape: true, compact: true,
  body: `
<style>body{zoom:.8} .toc td{font-size:7.9pt} .toc th{font-size:7pt} .frame{display:grid;grid-template-columns:repeat(4,1fr);gap:5pt;margin-bottom:6pt} .frame .box p{font-size:8pt} .frame .box h3{font-size:8.4pt;color:#C45C3E;font-family:Inter,sans-serif;letter-spacing:.04em}</style>
<div class="frame">${T.TOC_FRAME.map((f) => `<div class="box"><h3>${esc(f.theirs)}</h3><p>${esc(f.ours)}</p></div>`).join('')}</div>
<div class="grid3">
  <div class="box"><h3>The problem</h3><p>${esc(T.TOC_PROBLEM)}</p></div>
  <div class="box clay"><h3>What goes in</h3><p>${T.TOC_INPUTS.map(esc).join(' ')}</p></div>
  <div class="box sage"><h3>Where we start</h3><p>${T.TOC_TODAY.map(esc).join(' ')} <span class="label">verified</span></p></div>
</div>
<table class="toc"><tr><th style="width:12%">Impact</th><th style="width:20%">What we do</th><th>What it produces</th><th>What changes in 12 months</th><th>What it leads to</th><th style="width:15%">How we count it</th></tr>
${T.TOC_STREAMS.map((r) => `<tr><td><b>${esc(r.impact)}</b></td><td>${esc(r.activity)}</td><td>${esc(r.output.line)} ${tag(r.output)}</td><td>${esc(r.outcome.line)} ${tag(r.outcome)}</td><td>${esc(r.longer.line)} ${tag(r.longer)}</td><td>${esc(r.counted)}</td></tr>`).join('')}
</table>
<div class="grid2">
  <div class="box ink"><h3 style="color:#FBF8F1">The change we are working toward</h3><p>${esc(T.TOC_IMPACT)}</p></div>
  <div class="box"><h3>What has to be true</h3><p>${T.TOC_ASSUMPTIONS.map(esc).join(' ')}</p></div>
</div>
<p class="small">Labels: verified is on a record today; modelled is calculated from the build; target is what this grant sets out to do; pathway depends on more than this grant. This page covers the ${T.TOC_GRANT.beds} beds this grant buys and nothing else.</p>`,
}));

// ---------------------------------------------------------------------------------------------
// 05 Organisation structure and staffing chart

const team = GOVERNANCE.staff;
const nic = team.find((s) => /Marchesi/.test(s.name));
const ben = team.find((s) => /Knight/.test(s.name));
await emit('05-structure-and-staffing', page({
  id: '05', kicker: 'Organisation structure and staffing', title: 'Who governs, who works, who sits outside',
  body: `
<p class="lead">${esc(ORGANISATION.boardLine)} Two people are employed. Nobody else is paid centrally in this plan.</p>
<div class="box dashed"><h3>Members</h3><p>${esc(ORGANISATION.membership.line)} ${esc(ORGANISATION.membership.state)}</p></div>
<div class="arrow">↓ elect</div>
<div class="box ink"><h3 style="color:#FBF8F1">The board of ${esc(ORGANISATION.legalName)}</h3>
<p>At submission: Kristy Bloomfield, Audrey Deemal, Sonia Mascolo (transitional director).<br>Elected at the AGM on 12 October 2026: Kristy Bloomfield, Audrey Deemal, Jeremy Donovan.<br>${esc(ORGANISATION.boardNote)}</p></div>
<div class="arrow">↓ employs</div>
<div class="grid2">
  <div class="box clay"><h3>${esc(nic?.name ?? 'Nicholas Marchesi')}</h3><p>${esc(nic?.role ?? '')}. Runs production, supply and the facility builds.</p></div>
  <div class="box clay"><h3>${esc(ben?.name ?? 'Benjamin Knight')}</h3><p>${esc(ben?.role ?? '')}. Runs the model, the money and the funder relationships.</p></div>
</div>
<p class="small">Neither employee is a director. Making is paid work in community, costed inside the price of each bed.</p>
<h2>Outside the organisation</h2>
<div class="grid3">
  <div class="box"><h3>Community organisations</h3><p>${esc(ORGANISATION.partners)}</p></div>
  <div class="box"><h3>A Curious Tractor Pty Ltd</h3><p>Owned by the two employees. Does research and development. ${esc(ORGANISATION.seller)}</p></div>
  <div class="box"><h3>Standard Ledger</h3><p>Accountants. Documenting the carve-out of the earlier Goods trading history into the FY26 accounts.</p></div>
</div>`,
}));

// ---------------------------------------------------------------------------------------------
// 06 Strategic plan, draft for the board

await emit('06-strategic-plan-draft', page({
  id: '06', kicker: 'Strategic plan · two years · draft', title: 'Strategic plan, July 2026 to June 2028',
  body: `
<p class="lead"><span class="draft">Draft for the board to adopt. Not yet adopted.</span> ${esc(SHEET.subtitle)}</p>
<h2>What we are doing</h2>
<p>Create local jobs and income from the goods communities need. We start with beds made from recycled plastic: people get a suitable place to sleep, community organisations earn from selling them, and communities build their own production where they are ready.</p>
<h2>Year one, to June 2027</h2>
<ol>
  <li>Make and deliver ${PLAN_BEDS.toJune2027} beds of first stock, ${RAISE.bedsEach} to each of ${RAISE.communityOrganisations} community organisations, with the rules for each agreed before any bed moves.</li>
  <li>Build two community production facilities where communities have asked, at a ${money(FACILITY_ALLOWANCE_AUD)} planning allowance each.</li>
  <li>Measure the cost of a bed made locally: paid hours, weighed plastic, scrap and freight, on the first fifty beds from each site.</li>
  <li>Settle governance: the full constitution, audited accounts at the AGM, the member register, and the proposal that community organisations become members.</li>
</ol>
<h2>Year two, to June 2028</h2>
<ol>
  <li>Sell ${PLAN_BEDS.toJune2028} beds, the number at which beds carry the ${money(RUNNING_COST_AUD)} running cost with no grant.</li>
  <li>Bring both community facilities to pace, from ${FACILITY_OUTPUT.bedsFirstYear} beds in a first year toward ${FACILITY_OUTPUT.bedsAtPace}.</li>
  <li>Begin repaying the first-year loan from the beds Goods on Country sells.</li>
  <li>Answer the month-six questions at each site and report them whichever way they fall.</li>
</ol>
<h2>Measures</h2>
<table><tr><th>Measure</th><th class="n">Year one</th><th class="n">Year two</th><th>Label</th></tr>
<tr><td>Beds sold or placed</td><td class="n">${PLAN_BEDS.toJune2027}</td><td class="n">${PLAN_BEDS.toJune2028}</td><td>target</td></tr>
<tr><td>Community organisations holding stock</td><td class="n">${RAISE.communityOrganisations}</td><td class="n">${RAISE.communityOrganisations} or more</td><td>target</td></tr>
<tr><td>Community production facilities standing</td><td class="n">${RAISE.facilities}</td><td class="n">${RAISE.facilities}</td><td>target</td></tr>
<tr><td>Paid hours of making, at ${FACILITY_OUTPUT.hoursPerBed} hours a bed</td><td class="n">${num(PLAN_BEDS.toJune2027 * FACILITY_OUTPUT.hoursPerBed)}</td><td class="n">${num(PLAN_BEDS.toJune2028 * FACILITY_OUTPUT.hoursPerBed)}</td><td>modelled</td></tr>
<tr><td>Recycled plastic in beds, at ${PLASTIC_KG_PER_BED} kg a bed</td><td class="n">${num(PLAN_BEDS.toJune2027 * PLASTIC_KG_PER_BED)} kg</td><td class="n">${num(PLAN_BEDS.toJune2028 * PLASTIC_KG_PER_BED)} kg</td><td>modelled</td></tr>
<tr><td>Beds followed up at delivery, six weeks and three months</td><td class="n">50</td><td class="n">to set</td><td>target</td></tr>
<tr><td>Share of running cost carried by beds</td><td class="n">about ${Math.round((PLAN_BEDS.toJune2027 * BED.contributionAud) / RUNNING_COST_AUD * 100)}%</td><td class="n">100%</td><td>modelled</td></tr>
</table>
<h2>Risks the board watches</h2>
<ul>
  <li>The make cost of about ${money(BED.makeAud)} is provisional until the bought leg-panel yield is confirmed.</li>
  <li>Nothing in the raise is signed. The year's beds depend on three grants, one not yet sent.</li>
  <li>A community may decline a facility. It then goes to another community that passes the same tests.</li>
  <li>The loan is repaid from beds sold; slower sales stretch it.</li>
</ul>`,
}));

// ---------------------------------------------------------------------------------------------
// 07 Paid bed trade schedule

await emit('07-paid-bed-trade-schedule', page({
  id: '07', kicker: 'Paid bed trade', title: `${PAID_INVOICE_BEDS} beds bought and paid for`,
  body: `
<p class="lead">Five invoices, four buyers, every line taken from the invoice. ${money(PAID_INVOICE_NET_AUD)} net of GST, ${money(PAID_INVOICE_INCL_GST_AUD)} received including GST.</p>
<table><tr><th>Invoice</th><th>Buyer</th><th>For</th><th class="n">Beds</th><th class="n">Bed price</th><th class="n">Net of GST</th><th class="n">Paid incl GST</th><th>Paid on</th></tr>
${PAID_INVOICES.map((i) => `<tr><td>${esc(i.invoiceNumber)}</td><td>${esc(i.buyer)}</td><td>${esc(i.forPlace)}</td><td class="n">${i.beds}</td><td class="n">${money(i.bedUnitPriceAud)}</td><td class="n">${money(i.totalNetAud)}</td><td class="n">${money(i.totalPaidInclGstAud)}</td><td>${esc(i.fullyPaidOn)}</td></tr>`).join('')}
<tr class="total"><td colspan="3">Total</td><td class="n">${PAID_INVOICE_BEDS}</td><td></td><td class="n">${money(PAID_INVOICE_NET_AUD)}</td><td class="n">${money(PAID_INVOICE_INCL_GST_AUD)}</td><td></td></tr></table>
<h2>What sits on each invoice besides beds</h2>
<table><tr><th>Invoice</th><th>Product as invoiced</th><th class="n">Community work</th><th class="n">Freight</th><th class="n">Other</th><th class="n">Written off</th></tr>
${PAID_INVOICES.map((i) => `<tr><td>${esc(i.invoiceNumber)}</td><td>${esc(i.productAsInvoiced)}</td><td class="n">${money(i.facilitationNetAud)}</td><td class="n">${money(i.freightChargedNetAud)}</td><td class="n">${i.otherNetAud ? `${money(i.otherNetAud)}<br><span class="small">${esc(i.otherDetail ?? '')}</span>` : '$0'}</td><td class="n">${money(i.writtenOffNetAud)}</td></tr>`).join('')}
</table>
<p class="small">The two earliest invoices are Basket Beds, the first prototype, at prices that no longer apply. INV-0291 names the line "Weave Bed v2.3"; those beds are Stretch Beds, and the name is kept the same across that buyer's paperwork. The bed price is now ${money(BED.priceAud)} with freight and community work inside it.</p>`,
}));

// ---------------------------------------------------------------------------------------------
// 08 Grants received

await emit('08-grants-received', page({
  id: '08', kicker: 'Grants received', title: 'Who has funded the work',
  body: `
<p class="lead">${money(GRANTS_RECEIVED_TOTAL_AUD)} in grants received for the Goods work, line by line, each checked against the books on ${GRANTS_RECEIVED_AS_AT}.</p>
<table><tr><th>Funder</th><th>When</th><th class="n">Amount</th><th>Where it is recorded</th></tr>
${GRANTS_RECEIVED.map((g) => `<tr><td>${esc(g.funder)}</td><td>${esc(g.when)}</td><td class="n">${money(g.amountAud)}</td><td>${esc(GRANT_BASIS_LABEL[g.basis])}: ${esc(g.source)}</td></tr>`).join('')}
<tr><th>Total</th><th></th><th class="n">${money(GRANTS_RECEIVED_TOTAL_AUD)}</th><th></th></tr>
</table>
<p class="small">Before the charity took the work on, Goods traded through Nicholas Marchesi's sole-trader Xero file, so six of the seven grants are recorded there; the QBE Stage 1 grant is in the charity's own accounts. FRRR and the Vincent Fairfax Family Foundation made one joint grant, listed once. The Funding Network line is the cash banked. Bed sales are trade, not grants, and sit in attachment 07; the Centrecorp Foundation bought beds and is listed there as a buyer.</p>`,
}));

// ---------------------------------------------------------------------------------------------
// 09 Price model

await emit('09-price-model', page({
  id: '09', kicker: 'Price model', title: `Where the ${money(BED.priceAud)} goes`,
  body: `
<p class="lead">A Stretch Bed sells for ${money(BED.priceAud)} and nothing is added to it. The same price applies to every buyer.</p>
<table><tr><th>Part of the price</th><th class="n">Per bed</th><th>Label</th></tr>
<tr><td>Making the bed: recycled plastic, poles, canvas, hardware, power and paid labour</td><td class="n">about ${money(BED.makeAud)}</td><td>provisional</td></tr>
<tr><td>Freight to community, absorbed by Goods on Country</td><td class="n">${money(BED.freightAud)}</td><td>modelled</td></tr>
<tr><td>Community work around the bed: visits, build days, training, absorbed by Goods on Country</td><td class="n">${money(BED.facilitationAud)}</td><td>modelled</td></tr>
<tr class="total"><td>Reaches Goods on Country to run the organisation</td><td class="n">${money(BED.contributionAud)}</td><td>modelled</td></tr></table>
<div class="grid2">
  <div class="box sage"><h3>${esc(BED_WAYS.org.label)}</h3><p>${esc(BED_WAYS.org.line)}</p></div>
  <div class="box clay"><h3>${esc(BED_WAYS.goods.label)}</h3><p>${esc(BED_WAYS.goods.line)}</p></div>
</div>
<h2>What that means for the organisation</h2>
<p>Running Goods on Country costs ${money(RUNNING_COST_AUD)} a year. At about ${money(BED.contributionAud)} a bed, ${BREAK_EVEN_BEDS} beds a year carries it with no grant. This year makes ${PLAN_BEDS.toJune2027}, which bring about ${money(PLAN_BEDS.toJune2027 * BED.contributionAud)}; the ${money(RAISE.loanAud)} loan carries the rest while sales grow, and beds beyond ${BREAK_EVEN_BEDS} a year repay it. The Queensland facility can make ${num(FACILITY_CAPACITY_BEDS)} beds a year.</p>
<p class="small">The make cost stays provisional until the yield off a bought leg panel is confirmed. If it comes in higher, this page and every figure built on it changes.</p>`,
}));

// ---------------------------------------------------------------------------------------------
// 10 Empathy Ledger consent summary

const tierCount = (t) => STORYTELLER_REGISTRY.filter((s) => s.tier === t).length;
await emit('10-empathy-ledger-consent-summary', page({
  id: '10', kicker: 'Consent summary', title: 'How storyteller consent is recorded, used and withdrawn',
  body: `
<p class="lead">Goods on Country records the voices of the people who make and receive its beds in Empathy Ledger, a consent-based storytelling platform. Consent is held per person and per quote.</p>
<h2>What a storyteller controls</h2>
<p>Under the Empathy Ledger privacy policy a storyteller can see their information, correct it, ask for it to be deleted, choose who can see each story, and withdraw consent at any time. Anyone under 18 needs a parent's consent, and stories involving young people need further approval.</p>
<h2>How Goods on Country uses a voice</h2>
<table><tr><th>Tier</th><th>What it allows</th><th class="n">People</th></tr>
<tr><td>External</td><td>Cleared for the open web and funder material</td><td class="n">${tierCount('external')}</td></tr>
<tr><td>Website</td><td>Website only, never in funder material</td><td class="n">${tierCount('website')}</td></tr>
<tr><td>Funder</td><td>Funder material only</td><td class="n">${tierCount('funder')}</td></tr>
<tr><td>Hold</td><td>Not used outside the team</td><td class="n">${tierCount('hold')}</td></tr>
<tr><td>Pending</td><td>Not used until the tier is confirmed</td><td class="n">${tierCount('pending')}</td></tr>
</table>
<ul>
  <li>A quote is printed exactly as said. Nobody's words are paraphrased into a quote.</li>
  <li>A quote on hold or retired is never used, and a withdrawn consent takes the quote off every surface.</li>
  <li>A community's own records, such as a count of who sleeps where, stay with the community organisation. Goods on Country receives a total and a delivery list.</li>
</ul>
<p class="small">The people cleared at the external tier are listed in attachment 02.</p>`,
}));

// ---------------------------------------------------------------------------------------------
// 11 The model

const drawingFile = await readFile(resolve(V2, 'public/images/model/harvest-container.svg'), 'utf8');
const inlineDrawing = drawingFile.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1];
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const photoHrefs = {};
for (const p of PANELS) {
  const file = resolve(V2, 'public', p.photo.src.replace(/^\//, ''));
  photoHrefs[p.id] = `data:${MIME[file.slice(file.lastIndexOf('.')).toLowerCase()]};base64,${(await readFile(file)).toString('base64')}`;
}
const logoHrefs = {};
for (const [k, l] of Object.entries(LOGOS)) logoHrefs[k] = `data:image/svg+xml;base64,${(await readFile(resolve(V2, 'public', l.src.replace(/^\//, '')))).toString('base64')}`;
const placemat = renderPlacematSvg({ inlineDrawing, photoHrefs, logoHrefs, standalone: true });

await emit('11-goods-on-country-the-model', page({
  id: '11', kicker: 'The model', title: 'Goods on Country: the model',
  body: `
<p class="lead">${esc(SHEET.subtitle)}</p>
<div class="box" style="padding:4pt">${placemat}</div>
<div style="break-before: page"></div>
<h2>The loop</h2>
<ol>
${['harvest', 'orgs', 'buyers', 'money', 'decide', 'facility', 'next'].map((id) => `<li><strong>${esc(STATIONS[id].title.replace(/\.$/, ''))}.</strong> ${esc(STATIONS[id].line.charAt(0).toUpperCase() + STATIONS[id].line.slice(1))}${STATIONS[id].state === 'proposed' ? ' <span class="label">proposed</span>' : ''}</li>`).join('')}
</ol>
<h2>The money, in three parts</h2>
<table><tr><th>Source</th><th class="n">Amount</th><th>Buys or carries</th><th>Ends up</th></tr>
${MONEY_LANES.map((l) => `<tr><td>${esc(l.id === 'beds' ? 'Philanthropy, three grants' : l.source.kicker)}</td><td class="n">${money(l.source.amount)}</td><td>${esc(l.buys.title)}. ${esc(l.buys.line)}</td><td>${esc(l.endsUp.title)}. ${esc(l.endsUp.line)}</td></tr>`).join('')}
<tr class="total"><td>Asked</td><td class="n">${money(RAISE.totalShownAud)}</td><td colspan="2">Signed: ${money(RAISE.signedAud)}</td></tr></table>
<p><strong>No money goes back to Goods on Country from a community sale.</strong> ${esc(MONEY_NEVER.line)}</p>
<h2>What is already real</h2>
<ul>
  <li>${CANONICAL_ASSETS.bedsDeployed} beds recorded in ${CANONICAL_ASSETS.communitiesServed} communities.</li>
  <li>${PAID_BEDS} beds bought and paid for by four organisations, ${money(PAID_INVOICE_NET_AUD)} net of GST (attachment 07).</li>
  <li>40 beds pressed at the Goods on Country facility in Queensland and assembled at Gamardi by young people with Homeland School Company.</li>
  <li>${CANONICAL_ASSETS.washersInCommunity} washing machines in community.</li>
  <li>Last financial year, the charity's unaudited FY26 statements show income of $77,080 against expenses of $119,934.</li>
</ul>
<h2>What is proposed</h2>
<ul>
  <li>Two community production facilities, where a community has asked and somebody local wants to run it. Neither site has agreed.</li>
  <li>${esc(ORGANISATION.membership.line)} ${esc(ORGANISATION.membership.state)}</li>
</ul>
<h2>What we count</h2>
<table><tr><th>Measure</th><th>Today</th><th>This year</th></tr>
${MEASURES.map((m) => `<tr><td>${esc(m.title)}</td><td>${esc(m.today.line)} <span class="label">${esc(m.today.label)}</span></td><td>${esc(m.plan.line)} <span class="label">${esc(m.plan.label)}</span></td></tr>`).join('')}
</table>
<p class="small">No health outcome is claimed. Ownership of the making is a pathway.</p>`,
}));

// ---------------------------------------------------------------------------------------------
// 12 The money map

const moneyFlow = renderMoneyFlowSvg({ standalone: true });
await emit('12-goods-on-country-money-map', page({
  id: '12', kicker: 'The money map', title: 'Goods on Country: the money, drawn',
  body: `
<p class="lead">Where each dollar comes from, what it buys, and where it ends up. Asked ${money(RAISE.totalShownAud)}; signed ${money(RAISE.signedAud)}.</p>
<div class="box" style="padding:4pt">${moneyFlow}</div>
<h2>One bed</h2>
<p>${money(BED.priceAud)}: about ${money(BED.makeAud)} makes it, ${money(BED.freightAud)} freight and ${money(BED.facilitationAud)} community work are absorbed, and ${money(BED.contributionAud)} reaches Goods on Country. When a community organisation sells a bed, the whole ${money(BED.priceAud)} is theirs.</p>
<h2>The year to June 2027</h2>
<table><tr><th>Line</th><th class="n">Amount</th><th>Paid for by</th></tr>
<tr><td>Two community production facilities</td><td class="n">${money(RAISE.qbeAud)}</td><td>QBE Foundation, if awarded</td></tr>
<tr><td>${PLAN_BEDS.toJune2027} beds of first stock, ${RAISE.bedsEach} for each of ${RAISE.communityOrganisations} community organisations</td><td class="n">${money(RAISE.bedsShownAud)}</td><td>Three grants, 133 beds each</td></tr>
<tr><td>Running the organisation</td><td class="n">${money(RUNNING_COST_AUD)}</td><td>About ${money(PLAN_BEDS.toJune2027 * BED.contributionAud)} from the ${PLAN_BEDS.toJune2027} beds; the ${money(RAISE.loanAud)} loan carries the rest</td></tr>
</table>
<h2>What a facility costs, module by module</h2>
<table><tr><th>Module</th><th class="n">Low</th><th class="n">High</th><th>Where the price comes from</th></tr>
${FACILITY_MODULES.map((m) => `<tr><td>${esc(m.name)}</td><td class="n">${money(m.lowAud)}</td><td class="n">${money(m.highAud)}</td><td>${esc(m.priceSource)}</td></tr>`).join('')}
<tr class="total"><td>All modules and the site base</td><td class="n">${money(MODULES_LOW_AUD)}</td><td class="n">${money(MODULES_HIGH_AUD)}</td><td>A planning allowance of ${money(FACILITY_ALLOWANCE_AUD)} a facility; no site is quoted yet</td></tr></table>`,
}));

// ---------------------------------------------------------------------------------------------
// 13 What $300,000 produces (QBE Q9)

const year1Beds = RAISE.facilities * FACILITY_OUTPUT.bedsFirstYear;
await emit('13-what-300000-produces', page({
  id: '13', kicker: 'QBE Foundation Stage 2 · question 9', title: `What ${money(RAISE.qbeAud)} produces`,
  body: `
<p class="lead">The impact of the funds requested. The organisation, the model and the evidence behind every figure are in the materials at question 23.</p>
<h2>What the money builds</h2>
<p>Two community production facilities, one each in a community that has asked for one, at an allowance of ${money(FACILITY_ALLOWANCE_AUD)} a facility. A facility is a site base and four modules: collection and sorting, shredding, pressing with CNC and finishing, and assembly. All modules and the site base come to ${money(MODULES_LOW_AUD)} to ${money(MODULES_HIGH_AUD)}; the allowance sits above that so a harder pad or a longer power run does not stop a build. It takes about ${FACILITY_OUTPUT.monthsToFirstBed} months from money to first bed. A facility starts at ${FACILITY_OUTPUT.bedsFirstYear} beds a year on one press and reaches ${FACILITY_OUTPUT.bedsAtPace} on the same equipment as the local crew builds speed.</p>
<p>Palm Island and Maningrida are the working choices. Neither has agreed, and neither is named to a funder as agreed before it has. Alice Springs is a third facility under Oonchiumpa's own Commonwealth offer, outside this request.</p>
<h2>What each bed does, with the unit it is counted in</h2>
<table><tr><th>Outcome</th><th>Unit</th><th class="n">Per bed</th><th>Label</th></tr>
<tr><td>Paid making</td><td>hours</td><td class="n">${FACILITY_OUTPUT.hoursPerBed}</td><td>modelled</td></tr>
<tr><td>Recycled plastic kept in use</td><td>kilograms</td><td class="n">${PLASTIC_KG_PER_BED}</td><td>modelled</td></tr>
<tr><td>Money kept in the community when it sells the bed</td><td>dollars</td><td class="n">${money(BED.priceAud)}</td><td>settled rule</td></tr>
<tr><td>A person off the floor</td><td>beds</td><td class="n">1</td><td>counted</td></tr></table>
<p>Health is why the hardware exists and is not a row. Scabies and rheumatic heart disease are why a bed is washable and off the ground. That is where the claim stops.</p>
<h2>What two facilities produce in their first year of running</h2>
<table><tr><th>Both facilities, first year</th><th class="n">Amount</th><th>Label</th></tr>
<tr><td>Beds made in community</td><td class="n">${year1Beds}</td><td>modelled</td></tr>
<tr><td>Paid hours of making</td><td class="n">${num(year1Beds * FACILITY_OUTPUT.hoursPerBed)}</td><td>modelled</td></tr>
<tr><td>Recycled plastic in beds</td><td class="n">${num((year1Beds * PLASTIC_KG_PER_BED) / 1000)} tonnes</td><td>modelled</td></tr>
<tr><td>Money kept in community, if every bed is sold</td><td class="n">up to ${money(year1Beds * BED.priceAud)}</td><td>modelled</td></tr></table>
<p>How many beds a community sells and how many it places is the community organisation's decision, and no community's numbers go in a document before it has seen them. The facilities do not make this year's first stock; that is made at the Goods on Country facility in Queensland.</p>
<h2>How each row is counted</h2>
<p>Beds are units in a live register, counted per community, and the register is the source of every count we publish (attachment 01). Every figure carries a label: verified, workpaper, modelled or target. Hours and kilograms are modelled today; the first fifty beds from each facility are timed and weighed on site, which replaces both with measured numbers (attachment 03). Voices are held in Empathy Ledger with consent per person and per quote (attachment 10).</p>
<h2>The test at month six</h2>
<ol>${MONTH_SIX_QUESTIONS.map((q) => `<li>${esc(q)}</li>`).join('')}</ol>
<p>We report the answers whichever way they fall. A facility that answers no to three of them is a finding, and more useful than one reported as a success.</p>
<h2>What this grant does not pay for</h2>
<p>${esc(`Beds. Philanthropy buys the first ${RAISE.bedsYearOne}, so a community's facility and its stock never compete for the same dollar, and no community sale repays QBE.`)} It does not pay the running cost of the organisation, which the ${money(RAISE.loanAud)} loan carries in the first year, and it does not pay for the work around each bed, which sits inside the ${money(BED.priceAud)} price.</p>
<h2>What happens after the two facilities</h2>
<p>Nobody lends against a community-made bed today, because nobody knows what one costs to make in a community. These two facilities produce that number in their first year, along with the cost of running a site a long way from a city. Grant capital builds facilities one and two. A measured cost is what lets repayable capital build the next ones.</p>`,
}));

// ---------------------------------------------------------------------------------------------
// 15 The year so far (two pages; Brian M. Davis asked for an annual report the charity has not yet published)

const Y = await import('../src/lib/data/year-so-far.ts');
await emit('15-the-year-so-far', page({
  id: '15', kicker: `The year so far · ${Y.YSF_AS_AT}`, title: 'Goods on Country, the year so far', compact: true,
  body: `
<style>body{zoom:.9}</style><p class="lead">${esc(ORGANISATION.boardLine)} We make the Stretch Bed from recycled plastic, with communities, and put the making and the selling in community hands. Every figure on these two pages is on a record today.</p>
<p class="small" style="border-left:3px solid #C45C3E;padding-left:6pt">${esc(Y.YSF_NOT_ANNUAL_REPORT)}</p>
<h2>The record</h2>
<table>${Y.YSF_RECORD.map((r) => `<tr><td style="width:30%"><b>${esc(r.what)}</b></td><td class="n big" style="font-size:15pt;width:14%">${esc(r.value)}</td><td>${esc(r.note)} <span class="label">${esc(r.label)}</span></td></tr>`).join('')}</table>
<h2>Who bought beds</h2>
<table><tr><th>Buyer</th><th class="n">Beds</th><th>What happened</th></tr>
${Y.YSF_BUYERS.map((b) => `<tr><td>${esc(b.buyer)}</td><td class="n">${b.beds}</td><td>${esc(b.line)}</td></tr>`).join('')}</table>
<h2>What changed this year</h2>
<ul>${Y.YSF_MOMENTS.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
<div style="break-before:page"></div>
<h2>Grants received, in order of arrival</h2>
<table><tr><th>Funder</th><th>When</th><th>What it bought</th></tr>
${[...GRANTS_RECEIVED].sort((a, b) => a.since.localeCompare(b.since)).map((g) => `<tr><td>${esc(g.funder)}</td><td>${esc(g.when)}</td><td>${esc(g.bought)}</td></tr>`).join('')}</table>
<p class="small">Total received ${money(GRANTS_RECEIVED_TOTAL_AUD)}, checked against the books on ${esc(GRANTS_RECEIVED_AS_AT)}. $35,200 of the Snow Foundation line is a Drug Court invoice raised on the same ledger, not Goods.</p>
<h2>In their words</h2>
<div class="grid2">${Y.YSF_VOICES.map((v) => `<div class="box sage"><p style="font-family:'Playfair Display',Georgia,serif;font-size:11.5pt">\u201c${esc(v.quote)}\u201d</p><p class="small">${esc(v.who)}</p></div>`).join('')}</div>
<h2>What we do not claim</h2>
<ul>${Y.YSF_NOT_CLAIMED.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
<h2>More, live</h2>
<table>${Y.YSF_LINKS.map((l) => `<tr><td>${esc(l.label)}</td><td><a href="${l.url}" style="color:#C45C3E">${esc(l.url.replace('https://www.', ''))}</a></td></tr>`).join('')}</table>`,
}));

console.log(`\n${built.length} attachments in ${OUT}`);
await writeFile(resolve(OUT, 'README.md'), `# Application attachments, ${DATE}\n\nBuilt by \`v2/scripts/build-attachments.mjs\` from the site's data modules. Rebuild after any figure changes:\n\n    cd v2 && node --env-file=.env.local --import ./scripts/lib/register-ts.mjs scripts/build-attachments.mjs\n\n${built.map((b) => `- ${b.slug}.pdf${b.csv ? ' (+ CSV)' : ''}`).join('\n')}\n\nThe production log (03) and strategic plan (06) are marked blank and draft on their face. The grants received list (08) prints no total because its lines sit on two different bases.\n`, 'utf8');
