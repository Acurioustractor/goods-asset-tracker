// CLI runner: generate a funder report from the same engine the admin
// route uses, without needing the dev server. Usage:
//   node scripts/generate-funder-report.mjs <funder-slug> <period-slug>
//
// Examples:
//   node scripts/generate-funder-report.mjs centrecorp 2026-Q2
//   node scripts/generate-funder-report.mjs snow 2026-Q2

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const [, , funderSlug, periodSlug] = process.argv;
if (!funderSlug || !periodSlug) {
  console.error('Usage: node generate-funder-report.mjs <funder-slug> <period-slug>');
  process.exit(1);
}

// Replicate the QUARTERS map (avoids importing the TS module).
const QUARTERS = {
  '2026-Q1': { start: '2026-01-01', end: '2026-03-31', label: 'Q1 2026' },
  '2026-Q2': { start: '2026-04-01', end: '2026-06-30', label: 'Q2 2026' },
  '2026-Q3': { start: '2026-07-01', end: '2026-09-30', label: 'Q3 2026' },
  '2026-Q4': { start: '2026-10-01', end: '2026-12-31', label: 'Q4 2026' },
};

const q = QUARTERS[periodSlug];
if (!q) { console.error(`Unknown period: ${periodSlug}`); process.exit(1); }

// Inline funder configs (subset matching the TS configs — keeps the script
// independent of the v2 build). For a long-running need we'd add a TS
// transpile step, but for the MVP verification this is enough.
const FUNDER_CONFIGS = {
  centrecorp: {
    slug: 'centrecorp',
    displayName: 'Centrecorp Foundation',
    contactName: 'Centrecorp Foundation',
    xeroProjectCode: 'ACT-GD',
    photoTags: ['trip-may-2026'],
    sections: ['cover','headline','map','hero-photo','photo-grid','voices','why-it-works','how-we-track','impact-numbers','commitment-progress','whats-next','country-acknowledgement'],
    commitment: { totalAud: 292700, totalUnits: 109, unitLabel: 'beds', paidToDateAud: 208000, toBePaidAud: 84700, grantReference: 'Aboriginal Trust (NT)' },
  },
  snow: {
    slug: 'snow',
    displayName: 'Snow Foundation',
    contactName: 'The Snow Foundation',
    xeroProjectCode: 'ACT-GD',
    photoTags: ['snow-funded', 'trip-may-2026'],
    sections: ['cover','financials-at-a-glance','headline-achievements','investment-priorities','alignment-principles','safeguarding-risks','commitment-progress','upcoming-commitments','voices','photo-grid','country-acknowledgement'],
    commitment: {
      totalAud: 395000, paidToDateAud: 275000, toBePaidAud: 120000,
      invoicesRaisedAud: 434500, reportsSubmitted: '3 of 3 due so far ✓',
      nextReportDue: '31/07/2026 (FY26 Operational acquittal)',
      finalReportDue: '15/05/2027 (FY26 Scale-Up)', grantReference: '2024/OC0014',
    },
    funderContact: { name: 'Sally Grimsley-Ballard', email: 's.grimsley-ballard@snowfoundation.org.au', phone: '0417 851 341' },
    reportTitle: (p) => `Snow Foundation — Goods on Country progress report (${p.label})`,
  },
};

const funder = FUNDER_CONFIGS[funderSlug];
if (!funder) { console.error(`Unknown funder: ${funderSlug}`); process.exit(1); }

// Default report title fallback
if (!funder.reportTitle) {
  funder.reportTitle = (p) => `Goods on Country × ${funder.displayName} — ${p.label} report`;
}

const period = { slug: periodSlug, label: q.label, start: q.start, end: q.end };

// Load the Snow config's extra data (principles, risks, etc.) if relevant.
// For Snow we need to import the actual TS config since it's substantial.
// Quick hack: read it as a string and eval the values we need. Not pretty
// but avoids a TS build step for this verification.
if (funderSlug === 'snow') {
  // Load static-from-config fields from the TS file as JSON-equivalent
  const snowTs = await readFile(join(__dirname, '..', 'src', 'lib', 'funders', 'configs', 'snow.ts'), 'utf-8');
  // Read principles
  const principlesMatch = snowTs.match(/principles:\s*\[([\s\S]*?)\n  \],/);
  // To keep this simple, just import the actual fields from the registry via tsx.
  // Fallback: read raw blocks from the TS — not robust. We need a real loader.
}

// Real approach: shell out to a tsx-eval. We use `tsx` (already a project dep) to
// dynamically import the registry.
import { spawn } from 'node:child_process';
function tsxEval(code) {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['-y', 'tsx', '-e', code], { cwd: join(__dirname, '..'), stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    proc.stdout.on('data', (b) => out += b);
    proc.stderr.on('data', (b) => err += b);
    proc.on('close', (code) => code === 0 ? resolve(out) : reject(new Error(err)));
  });
}

const configJson = JSON.parse(await tsxEval(`
import { getFunder } from './src/lib/funders/registry';
(async () => {
const f = await getFunder(${JSON.stringify(funderSlug)});
if (!f) { console.error('not found'); process.exit(1); }
process.stdout.write(JSON.stringify({
  slug: f.slug,
  displayName: f.displayName,
  contactName: f.contactName,
  xeroProjectCode: f.xeroProjectCode,
  preparedBy: f.preparedBy,
  funderContact: f.funderContact,
  commitment: f.commitment,
  photoTags: f.photoTags,
  sections: f.sections,
  tone: f.tone,
  principles: f.principles,
  risks: f.risks,
  upcomingCommitments: f.upcomingCommitments,
  investmentTiers: f.investmentTiers,
  headlineAchievements: f.headlineAchievements,
  additionalContext: f.additionalContext,
  stageOfGrowth: f.stageOfGrowth,
  focusAreas: f.focusAreas,
  ignition: f.ignition,
}));
})();
`));

// Hydrate runtime methods
configJson.reportTitle = funder.reportTitle;
const realFunder = configJson;

// ─── Metric resolvers (re-implemented in JS for the CLI) ───
const ACT_URL = process.env.ACT_INFRA_SUPABASE_URL;
const ACT_KEY = process.env.ACT_INFRA_SUPABASE_KEY;
const GOODS_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const GOODS_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const goods = createClient(GOODS_URL, GOODS_KEY, { auth: { persistSession: false } });

async function fetchXero(qs) {
  const res = await fetch(`${ACT_URL}/rest/v1/xero_invoices?${qs}`, {
    headers: { apikey: ACT_KEY, Authorization: `Bearer ${ACT_KEY}` },
  });
  if (!res.ok) throw new Error(`xero ${res.status}: ${await res.text()}`);
  return res.json();
}

const RESOLVERS = {
  // NOTE: bed resolvers filter product ILIKE %bed% so washers/other assets are
  // NOT counted as beds (matches the canonical impact-fetcher.ts logic).
  'beds-deployed-this-period': async () => {
    const res = await goods.from('assets').select('unique_id', { count: 'exact', head: true })
      .ilike('product', '%bed%').gte('supply_date', period.start).lte('supply_date', period.end).eq('status', 'deployed');
    return String(res.count ?? 0);
  },
  'beds-allocated-this-period': async () => {
    const res = await goods.from('assets').select('unique_id', { count: 'exact', head: true })
      .ilike('product', '%bed%').gte('supply_date', period.start).lte('supply_date', period.end).eq('status', 'allocated');
    return String(res.count ?? 0);
  },
  'beds-total-this-period': async () => {
    const res = await goods.from('assets').select('unique_id', { count: 'exact', head: true })
      .ilike('product', '%bed%').gte('supply_date', period.start).lte('supply_date', period.end).in('status', ['deployed', 'allocated']);
    return String(res.count ?? 0);
  },
  // Washing machines delivered this period (product = "Washing Machine").
  'washers-total-this-period': async () => {
    const res = await goods.from('assets').select('unique_id', { count: 'exact', head: true })
      .ilike('product', '%wash%').gte('supply_date', period.start).lte('supply_date', period.end).in('status', ['deployed', 'allocated']);
    return String(res.count ?? 0);
  },
  // Washing machines in community — canonical curated figure (Ben, 2026-06-11).
  'washers-in-community': async () => '16 washing machines in community',
  // Plastic = STRETCH beds only (recycled HDPE). Basket beds are not a plastic product.
  'plastic-kg-transferred': async () => {
    const res = await goods.from('assets').select('unique_id', { count: 'exact', head: true })
      .ilike('product', '%stretch%').gte('supply_date', period.start).lte('supply_date', period.end).in('status', ['deployed', 'allocated']);
    const beds = res.count ?? 0;
    const kg = beds * 20;
    return `**${kg.toLocaleString()} kg** (${(kg/1000).toFixed(2)} tonnes) — ${beds} Stretch beds × 20 kg HDPE`;
  },
  'communities-served': async () => {
    const { data } = await goods.from('assets').select('community')
      .gte('supply_date', period.start).lte('supply_date', period.end).in('status', ['deployed', 'allocated']);
    const distinct = new Set((data || []).map((r) => r.community).filter(Boolean));
    return `${distinct.size} (${[...distinct].join(', ')})`;
  },
  'commitment-progress-bar': async () => {
    const c = realFunder.commitment;
    if (!c.totalUnits) {
      const total = c.totalAud, paid = c.paidToDateAud ?? 0;
      const pct = total > 0 ? Math.round((paid/total)*100) : 0;
      const filled = Math.round(pct/5);
      const bar = '▓'.repeat(filled) + '░'.repeat(20-filled);
      return '```\nCommitment:  $' + total.toLocaleString('en-AU') + '\nPaid:        ' + bar + ' ' + pct + '%  ($' + paid.toLocaleString('en-AU') + ')\n```';
    }
    const periodRes = await goods.from('assets').select('unique_id', { count: 'exact', head: true })
      .ilike('product', '%bed%').gte('supply_date', period.start).lte('supply_date', period.end).in('status', ['deployed', 'allocated']);
    const periodCount = periodRes.count ?? 0;
    const total = c.totalUnits;
    const pct = total > 0 ? Math.round((periodCount/total)*100) : 0;
    const filled = Math.round(pct/5);
    const bar = '▓'.repeat(filled) + '░'.repeat(20-filled);
    return '```\n' + (c.unitLabel ?? 'units') + ' commitment:  ' + total + ' ' + (c.unitLabel ?? '') + '\nDelivered this period: ' + bar + ' ' + pct + '%  (' + periodCount + ' ' + (c.unitLabel ?? '') + ')\n```';
  },
  'xero-drawn-aud': async () => {
    const c = realFunder.commitment;
    const qs = `select=total,amount_paid,invoice_number,date,status&type=eq.ACCREC&project_code=eq.${realFunder.xeroProjectCode}&contact_name=eq.${encodeURIComponent(realFunder.contactName)}`;
    const rows = await fetchXero(qs);
    const totalRaised = rows.reduce((s, r) => s + (r.total || 0), 0);
    const totalPaid = rows.reduce((s, r) => s + (r.amount_paid || 0), 0);
    const cl = c.totalAud ? `Commitment: **$${c.totalAud.toLocaleString('en-AU')}** ex-GST` : '';
    return [cl, `Xero ACCREC invoices raised (${rows.length}): **$${totalRaised.toLocaleString('en-AU', { maximumFractionDigits: 0 })}**`, `Amount paid against those invoices: **$${totalPaid.toLocaleString('en-AU', { maximumFractionDigits: 0 })}**`].filter(Boolean).join('  \n');
  },
  'xero-trip-overhead': async () => {
    const qs = `select=total,contact_name,date&type=eq.ACCPAY&project_code=eq.${realFunder.xeroProjectCode}&date=gte.${period.start}&date=lte.${period.end}`;
    const rows = await fetchXero(qs);
    const total = rows.reduce((s, r) => s + (r.total || 0), 0);
    if (rows.length === 0) return '**$0** — no ACCPAY invoices entered in Xero for this period yet (receipts often paid through personal accounts; reconciliation pending).';
    return `**$${total.toLocaleString('en-AU', { maximumFractionDigits: 0 })}** across ${rows.length} ACCPAY invoice${rows.length === 1 ? '' : 's'}.`;
  },
  'risks-table': async () => {
    const r = realFunder.risks;
    if (!r?.length) return '_(no risks configured)_';
    return '| Risk | Status | Mitigation in flight |\n|---|---|---|\n' + r.map(x => `| ${x.risk} | ${x.status} | ${x.mitigation} |`).join('\n');
  },
  'principles-alignment': async () => {
    const p = realFunder.principles;
    if (!p?.length) return '_(no principles configured)_';
    return p.map(x => `### ${x.id}. ${x.name}\n\n${x.evidence}`).join('\n\n');
  },
  'upcoming-commitments-table': async () => {
    const u = realFunder.upcomingCommitments;
    if (!u?.length) return '_(no upcoming commitments configured)_';
    return '| Activity | Timeline | Status |\n|---|---|---|\n' + u.map(x => `| ${x.activity} | ${x.timeline} | ${x.status} |`).join('\n');
  },
  'investment-tiers': async () => {
    const t = realFunder.investmentTiers;
    if (!t?.length) return '_(no investment tiers configured)_';
    return t.map(x => `### Priority ${x.priority} — ${x.name} (~$${x.budgetAud.toLocaleString('en-AU')})\n\n${x.description}\n\n**Outcomes:** ${x.outcomes}`).join('\n\n');
  },
  'headline-achievements': async () => realFunder.headlineAchievements || '_(no headline achievements configured)_',
  'additional-context': async () => realFunder.additionalContext || '',
  'stage-of-growth': async () => {
    const s = realFunder.stageOfGrowth;
    if (!s?.dial?.length) return '_(stage of growth not configured)_';
    const dial = s.dial.map((d, i) => (i === s.currentIndex ? `**${d}**` : d)).join(' · ');
    return `**Stage: ${s.dial[s.currentIndex]}**\n\n${dial}\n\n${s.stepChange}`;
  },
  'focus-area': async () => {
    const f = realFunder.focusAreas;
    if (!f?.length) return '_(focus areas not configured)_';
    return f.map((x, i) => `**${i + 1}. ${x.title}**\n\n${x.body}`).join('\n\n');
  },
  'ignition': async () => {
    const ig = realFunder.ignition;
    if (!ig) return '_(ignition not configured)_';
    const chain = (ig.chain || []).map((c, i) => `${i + 1}. ${c}`).join('\n');
    return `${ig.narrative}\n\n${chain}`;
  },
  'financials-at-a-glance': async () => {
    const c = realFunder.commitment;
    const rows = ['| Item | Value |','|---|---|'];
    rows.push(`| **Total commitment** | $${c.totalAud.toLocaleString('en-AU')} ex-GST |`);
    if (c.paidToDateAud !== undefined) rows.push(`| **Paid to date** | $${c.paidToDateAud.toLocaleString('en-AU')} |`);
    if (c.toBePaidAud !== undefined) rows.push(`| **To be paid** | $${c.toBePaidAud.toLocaleString('en-AU')} |`);
    if (c.invoicesRaisedAud !== undefined) rows.push(`| **Xero invoices raised** | $${c.invoicesRaisedAud.toLocaleString('en-AU')} inc-GST |`);
    if (c.reportsSubmitted) rows.push(`| **Reports submitted** | ${c.reportsSubmitted} |`);
    if (c.nextReportDue) rows.push(`| **Next report due** | ${c.nextReportDue} |`);
    if (c.finalReportDue) rows.push(`| **Final report due** | ${c.finalReportDue} |`);
    if (c.grantReference) rows.push(`| **Grant reference** | ${c.grantReference} |`);
    return rows.join('\n');
  },
  'period-label': async () => period.label,
  'period-start': async () => period.start,
  'period-end': async () => period.end,
  'funder-display-name': async () => realFunder.displayName,
  'funder-contact-block': async () => {
    const f = realFunder.funderContact;
    if (!f) return '';
    return `**Funder contact:** ${f.name}${f.email ? ` ([${f.email}](mailto:${f.email}))` : ''}${f.phone ? ` · ${f.phone}` : ''}`;
  },
  'report-title': async () => realFunder.reportTitle(period),
};

async function resolveMetric(key) {
  const r = RESOLVERS[key];
  if (!r) return `[METRIC ERROR: ${key} — no resolver]`;
  try { return await r(); } catch (e) { return `[METRIC ERROR: ${key} — ${e.message}]`; }
}

const SECTION_FILES = {
  'cover': '00-cover.md','headline': '01-headline.md','map': '02-map.md','hero-photo': '03-hero-photo.md',
  'photo-grid': '04-photo-grid.md','voices': '05-voices.md','why-it-works': '06-why-it-works.md',
  'how-we-track': '07-how-we-track.md','impact-numbers': '08-impact-numbers.md',
  'financials-at-a-glance': '09-financials-at-a-glance.md','headline-achievements': '10-headline-achievements.md',
  'investment-priorities': '11-investment-priorities.md','alignment-principles': '12-alignment-principles.md',
  'safeguarding-risks': '13-safeguarding-risks.md','commitment-progress': '14-commitment-progress.md',
  'upcoming-commitments': '15-upcoming-commitments.md','whats-next': '16-whats-next.md',
  'country-acknowledgement': '17-country-acknowledgement.md',
  'stage-of-growth': '18-stage-of-growth.md','focus-area': '19-focus-area.md','ignition': '20-ignition.md',
};

const sectionsDir = join(__dirname, '..', '..', 'wiki', 'templates', 'funder-report', 'sections');

async function resolveSection(key) {
  const file = SECTION_FILES[key];
  const path = join(sectionsDir, file);
  const md = await readFile(path, 'utf-8').catch(() => `<!-- missing: ${file} -->`);
  const re = /\[METRIC:\s*([a-z0-9-]+)\s*\]/gi;
  const matches = [...md.matchAll(re)];
  const unique = [...new Set(matches.map((m) => m[1]))];
  const resolved = new Map();
  for (const k of unique) resolved.set(k, await resolveMetric(k));
  return md.replace(re, (_, k) => resolved.get(k) ?? `[METRIC ERROR: ${k}]`);
}

const parts = [];
for (const key of realFunder.sections) {
  process.stderr.write(`  section: ${key}... `);
  const r = await resolveSection(key);
  parts.push(r);
  process.stderr.write('ok\n');
}

const out = parts.join('\n\n');
const outPath = join(__dirname, '..', '..', 'wiki', 'outputs', 'funder-reports', realFunder.slug, `${period.slug}.md`);
await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, out, 'utf-8');
console.log(`\n✓ ${realFunder.displayName} ${period.label}`);
console.log(`  ${realFunder.sections.length} sections, ${Buffer.byteLength(out)} bytes`);
console.log(`  → ${outPath}`);
