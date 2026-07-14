#!/usr/bin/env node
/**
 * READ-ONLY: create a dry-run reconciliation table across:
 * - live GHL funder/grant opportunities
 * - current Notion Funder Pipeline snapshot
 * - current Notion QBE Opportunity Register snapshot
 *
 * Writes local decision-surface files only:
 * - tmp/qbe-reconciliation-dry-run.json
 * - tmp/qbe-reconciliation-dry-run.csv
 * - tmp/qbe-reconciliation-dry-run.md
 */
import fs from 'node:fs';
import path from 'node:path';

const ENV_PATH = path.join(process.cwd(), '.env.local');
if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const TOKEN = process.env.GHL_API_KEY;
const LOC = process.env.GHL_LOCATION_ID;
const BASE = 'https://services.leadconnectorhq.com';
const headers = { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const PIPELINES = {
  'Goods Supporter Journey': 'JvBFYpVpyKsw899lkFgj',
  Grants: 'scom3L0kNwA1W0zPIzMe',
};

const OPPORTUNITY_FIELDS = {
  fundingType: 'UCFe9cyjk3sVKwtInfSG',
  matchEligible: '6tSoVICqtrTGQAzpPHn1',
  capitalStatus: 'QbfHdeNpz2JiMe5iRESS',
  amountBasis: 'LM1U3fVHJNB4KwvuK9ZF',
  evidencePackStatus: 'P9g0CpLcu8SzHpeSTfGV',
  storyConsentStatus: 'q7FXLNPdnIdIaTwUHPHf',
  notionReportPageUrl: 'nPFdTTIjb72O7MnTStii',
  nextReportingAction: 'YaSYTXhXiqTXo18WfPDI',
};

// Snapshots queried from Notion on 2026-06-30 ACST.
// Keep these embedded so this dry-run is reproducible without writing to Notion.
const NOTION_FUNDER_ROWS = [
  { url: 'https://app.notion.com/38debcf981cf81918700c087ef801a63', Funder: 'REAL Innovation Fund (DEWR)', Stage: 'Ask made', Type: 'catalytic', Action: 'awaiting-reply', Amount: 2000000, 'Next action': 'Confirm EOI / application status (two-site, $2.4M)', 'Send next': '(awaiting their response)' },
  { url: 'https://app.notion.com/38debcf981cf81febd0cd43e67d31656', Funder: 'QBE Foundation', Stage: 'Cultivating', Type: 'catalytic', Action: 'cultivate', Amount: 400000, 'Next action': 'Stage 2 prep (applies Sept-Nov); build matched-capital evidence', 'Send next': 'Catalytic pitch bundle + Cost Lab' },
  { url: 'https://app.notion.com/38debcf981cf8105bdddc3af3e00e243', Funder: 'SEFA - Impact Investment Loan', Stage: 'Cultivating', Type: 'repayable', Action: 'ready-to-send', Amount: 300000, 'Next action': 'Send the SEFA brief + intro email; move to Ask made on send', 'Send next': 'SEFA loan brief + impact page + canonical numbers' },
  { url: 'https://app.notion.com/38debcf981cf81c7a9e1e4d5013b797d', Funder: 'Minderoo Foundation', Stage: 'Cultivating', Type: 'catalytic', Action: 'cultivate', Amount: 200000, 'Next action': 'No formal ask yet; cultivate the relationship', 'Send next': 'Impact page + deck' },
  { url: 'https://app.notion.com/38debcf981cf81ae906dde50db12f8f9', Funder: 'Rotary Eclub Outback Australia', Stage: 'Ask made', Type: 'philanthropic', Action: 'needs-followup', Amount: 82500, 'Next action': 'Follow-up (washers/beds; offer to present to the club)', 'Send next': 'Follow-up' },
  { url: 'https://app.notion.com/38debcf981cf81e78a73da10ef9e5d36', Funder: 'The Ian Potter Foundation', Stage: 'Ask made', Type: 'philanthropic', Action: 'needs-followup', Amount: 0, 'Next action': 'Follow-up nudge (refreshed one-pager)', 'Send next': 'Follow-up' },
  { url: 'https://app.notion.com/38debcf981cf81ba87c7d9f5cfd6e4d0', Funder: 'Invest NT Concessional Loans', Stage: 'Cultivating', Type: 'repayable', Action: 'ready-to-send', Amount: 0, 'Next action': 'Send enquiry #3 (NT plant, needs private co-contribution)', 'Send next': 'Outreach draft #3 + cost-story' },
  { url: 'https://app.notion.com/38debcf981cf81b9aca1d6606b5ebf6d', Funder: 'The Bryan Foundation', Stage: 'Ask made', Type: 'philanthropic', Action: 'needs-followup', Amount: 0, 'Next action': 'Follow-up nudge', 'Send next': 'Follow-up' },
  { url: 'https://app.notion.com/38debcf981cf8197b105f5d87439d9a9', Funder: 'CEFC via NAB Green Equipment Finance', Stage: 'Cultivating', Type: 'repayable', Action: 'ready-to-send', Amount: 0, 'Next action': 'Send enquiry #2 (finances the recycling plant)', 'Send next': 'Outreach draft #2 + cost-story' },
  { url: 'https://app.notion.com/38debcf981cf8154bf5ff56c6ea852b1', Funder: 'Tim Fairfax Family Foundation', Stage: 'Ask made', Type: 'philanthropic', Action: 'needs-followup', Amount: 0, 'Next action': 'Follow-up nudge (lead with Palm Island)', 'Send next': 'Follow-up #1' },
  { url: 'https://app.notion.com/38debcf981cf81348839d76b212435c4', Funder: 'Philanthropy Australia', Stage: 'Cultivating', Type: 'philanthropic', Action: 'cultivate', Amount: 0, 'Next action': 'Network, not a direct funder; use for warm intros', 'Send next': 'Public pitch page' },
  { url: 'https://app.notion.com/38debcf981cf8133943cc492ca3a6ef2', Funder: 'Brian M Davis Charitable Foundation', Stage: 'Ask made', Type: 'philanthropic', Action: 'needs-followup', Amount: 0, 'Next action': 'Follow-up nudge', 'Send next': 'Follow-up' },
  { url: 'https://app.notion.com/38debcf981cf81269068d9b03fa2aa1f', Funder: 'Rotary Global Grant (washers/beds)', Stage: 'Ask made', Type: 'philanthropic', Action: 'needs-followup', Amount: 0, 'Next action': 'Confirm where it sits + the next step', 'Send next': 'Follow-up' },
  { url: 'https://app.notion.com/38debcf981cf81218699ff1c5f04fbf1', Funder: 'First Nations Finance', Stage: 'Cultivating', Type: 'repayable', Action: 'ready-to-send', Amount: 0, 'Next action': 'Send enquiry #1 (no ownership gate); move to Ask made on send', 'Send next': 'Outreach draft #1 + impact + numbers' },
  { url: 'https://app.notion.com/38debcf981cf8100ba61fc1359ab518a', Funder: 'Eloise Hall - Impact Investor', Stage: 'Cultivating', Type: 'catalytic', Action: 'cultivate', Amount: 0, 'Next action': 'Gauge interest in the ask', 'Send next': 'Impact page + numbers + Utopia field note' },
];

const NOTION_QBE_ROWS = [
  { url: 'https://app.notion.com/38eebcf981cf8157b5d4d13ff7e1d92a', Opportunity: 'White Box SELF - social enterprise loan pathway', Status: 'Reviewing', Priority: 'Tier 1', 'Opportunity Type': 'Impact finance', Instrument: 'Repayable finance', 'Target AUD': 250000, 'Match Eligible': 'TBC', 'Capital Status': 'Signal', 'Evidence Pack': 'Missing', 'GHL Approval': 'Pushed', 'GHL Contact ID': 'CfOSzsfRsaS50uGBxMFI', 'GHL Opportunity ID': '6qJmhAM3a01JJcI6Krg9', 'Next Action': 'Lodge SELF EOI and resolve PBI/DGR or Supply Nation eligibility on first call.', Blocker: 'Eligibility pathway via PBI/DGR or Supply Nation is unresolved.' },
  { url: 'https://app.notion.com/38eebcf981cf8110a7c9e2b8d7cb6567', Opportunity: 'SEFA - repayable finance anchor', Status: 'Briefing', Priority: 'Tier 1', 'Opportunity Type': 'Impact finance', Instrument: 'Repayable finance', 'Target AUD': 250000, 'Match Eligible': 'TBC', 'Capital Status': 'Signal', 'Evidence Pack': 'Partial', 'GHL Approval': 'Pushed', 'GHL Contact ID': 'IINOCdlanw4e1ah01Wun', 'GHL Opportunity ID': 'hBRVkCMhT93215aqTRRr', 'Next Action': 'Call SEFA and lodge Access impact finance form; confirm loan size, timeline, security and QBE match evidence rules.', Blocker: 'SEFA facts/live timeline, security position, and QBE/SIH match rules need confirmation in writing.' },
  { url: 'https://app.notion.com/38eebcf981cf8184a8b1cb2253a16eb1', Opportunity: 'Minderoo Foundation - catalytic QBE-aligned grant', Status: 'Pursuing', Priority: 'Tier 1', 'Opportunity Type': 'Philanthropy', Instrument: 'Grant', 'Target AUD': 200000, 'Match Eligible': 'TBC', 'Capital Status': 'Ask made', 'Evidence Pack': 'Partial', 'GHL Approval': 'Pushed', 'GHL Contact ID': 'bkZQ6vDNekvTtUVV1TpI', 'GHL Opportunity ID': 'zQZWXJyILdvzwm8OACPr', 'Next Action': 'Press for decision date and align the ask to the QBE match stack.', Blocker: 'Decision date and QBE match treatment still need confirmation.' },
  { url: 'https://app.notion.com/38eebcf981cf8152a350ea9979852bc8', Opportunity: 'Snow Foundation - first-mover QBE commitment', Status: 'Pursuing', Priority: 'Tier 1', 'Opportunity Type': 'Philanthropy', Instrument: 'Multi-year LOI', 'Target AUD': 100000, 'Match Eligible': 'TBC', 'Capital Status': 'Ask made', 'Evidence Pack': 'Partial', 'GHL Approval': 'Pushed', 'GHL Contact ID': 'EIKlZPlgR9Rjpo7Z0uQu', 'GHL Opportunity ID': 'ZzPJCLAq3nkAo0bG7ot3', 'Next Action': 'Reframe R4/R5 ask as signed multi-year LOI or repayable first-mover paper before 31 Aug.', Blocker: 'Needs signed match-eligible paper, not just warm verbal support.' },
  { url: 'https://app.notion.com/38eebcf981cf81199c5cd027c117ec26', Opportunity: 'Centrecorp Foundation - Central Australia grant / bed-order split', Status: 'Pursuing', Priority: 'Tier 1', 'Opportunity Type': 'Aboriginal trust', Instrument: 'Buyer + grant split', 'Target AUD': 75000, 'Match Eligible': 'TBC', 'Capital Status': 'Ask made', 'Evidence Pack': 'Partial', 'GHL Approval': 'Pushed', 'GHL Contact ID': 'dZkcBCGiaEWdi3nJdeoG', 'GHL Opportunity ID': 'KZSUEe89wSm1vMLYMUr8', 'Next Action': 'Confirm next-round bed count and amount; separate grant match from bed-order revenue; seek July board decision.', Blocker: 'Confirm final amount and quote/story consent before external use.' },
  { url: 'https://app.notion.com/38eebcf981cf819cb36add0ddf4131ba', Opportunity: 'Vincent Fairfax Family Foundation - repeat-funder grant tail', Status: 'Qualified', Priority: 'Tier 1', 'Opportunity Type': 'Philanthropy', Instrument: 'Grant', 'Target AUD': 50000, 'Match Eligible': 'TBC', 'Capital Status': 'Signal', 'Evidence Pack': 'Partial', 'GHL Approval': 'Pushed', 'GHL Contact ID': 'g6bKdaov3S82DXgdkEvQ', 'GHL Opportunity ID': 'DhnO6BxwW2q0Yfb2cqVG', 'Next Action': 'Position as aggregated round tail and seek signed commitment/LOI timing.', Blocker: 'Needs signed commitment or LOI timing before it can count toward QBE match.' },
];

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function canonicalKey(value) {
  const n = normalize(value);
  const cases = [
    ['white box', 'white box'],
    ['sefa', 'sefa'],
    ['minderoo', 'minderoo'],
    ['snow', 'snow foundation'],
    ['centrecorp', 'centrecorp'],
    ['vincent fairfax', 'vfff'],
    ['vfff', 'vfff'],
    ['real innovation', 'real innovation fund'],
    ['qbe foundation', 'qbe foundation'],
    ['rotary eclub', 'rotary eclub'],
    ['ian potter', 'ian potter'],
    ['invest nt', 'invest nt'],
    ['bryan foundation', 'bryan foundation'],
    ['cefc', 'cefc nab'],
    ['nab green', 'cefc nab'],
    ['tim fairfax', 'tim fairfax'],
    ['philanthropy australia', 'philanthropy australia'],
    ['brian m davis', 'brian m davis'],
    ['rotary global', 'rotary global'],
    ['first nations finance', 'first nations finance'],
    ['eloise hall', 'eloise hall'],
    ['redi e', 'redi e'],
    ['dusseldorp', 'dusseldorp'],
    ['paul ramsay', 'paul ramsay'],
    ['alive national', 'alive national'],
  ];
  const hit = cases.find(([needle]) => n.includes(needle));
  if (hit) return hit[1];
  return n.replace(/\b(the|foundation|charitable|pty|ltd|grant|program|qbe|target|impact|finance|loan|pathway)\b/g, '').replace(/\s+/g, ' ').trim();
}

function customFieldMap(opp) {
  const byId = Object.fromEntries(Object.entries(OPPORTUNITY_FIELDS).map(([key, id]) => [id, key]));
  const out = {};
  for (const field of opp.customFields || []) {
    const key = byId[field.id];
    if (!key) continue;
    out[key] = field.fieldValueString ?? field.fieldValueNumber ?? field.fieldValue ?? '';
  }
  return out;
}

async function ghl(method, urlPath) {
  const res = await fetch(`${BASE}${urlPath}`, { method, headers });
  if (!res.ok) throw new Error(`${method} ${urlPath} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

async function getPipelineMeta() {
  const data = await ghl('GET', `/opportunities/pipelines?locationId=${LOC}`);
  return Object.fromEntries((data.pipelines || []).map((pipeline) => [pipeline.id, pipeline]));
}

async function fetchOpps(pipelineId) {
  const all = [];
  let startAfter = null;
  let startAfterId = null;
  while (true) {
    const q = new URLSearchParams({ location_id: LOC, pipeline_id: pipelineId, limit: '100' });
    if (startAfter) q.set('startAfter', startAfter);
    if (startAfterId) q.set('startAfterId', startAfterId);
    const data = await ghl('GET', `/opportunities/search?${q.toString()}`);
    const opps = data.opportunities || [];
    all.push(...opps);
    const meta = data.meta || {};
    if (opps.length < 100 || !meta.startAfter) break;
    startAfter = meta.startAfter;
    startAfterId = meta.startAfterId;
    await sleep(600);
  }
  return all;
}

function stageName(meta, opp) {
  const pipeline = meta[opp.pipelineId];
  return (pipeline?.stages || []).find((stage) => stage.id === opp.pipelineStageId)?.name || opp.pipelineStageId || '';
}

function isOpen(opp) {
  return opp.status === 'open';
}

function inferSharedStatus({ pipeline, stage, status, qbeRow, funderRow }) {
  if (status === 'lost') return pipeline === 'Grants' ? 'Lost' : 'Lost';
  if (qbeRow?.Status) return qbeRow.Status;
  if (pipeline === 'Grants') {
    if (/submitted/i.test(stage)) return 'Submitted';
    if (/awarded|report/i.test(stage)) return 'Won';
    if (/declined/i.test(stage)) return 'Lost';
    if (/progress/i.test(stage)) return 'Pursuing';
    return 'Reviewing';
  }
  if (/identified/i.test(stage)) return 'Discovered';
  if (/qualified/i.test(stage)) return 'Qualified';
  if (/cultivating/i.test(stage)) {
    if (funderRow?.Action === 'ready-to-send') return 'Briefing';
    return 'Qualified';
  }
  if (/ask made/i.test(stage)) return 'Pursuing';
  if (/delivering|stewarding/i.test(stage)) return 'Won';
  if (/renewing/i.test(stage)) return 'Pursuing';
  return 'Reviewing';
}

function inferOpportunityType(name, pipeline, fields, tags) {
  const n = normalize(name);
  const tagText = normalize(tags.join(' '));
  if (pipeline === 'Grants') return 'Government grant';
  if (/(sefa|white box|first nations finance|cefc|invest nt)/.test(n) || /repayable/.test(tagText)) return 'Impact finance';
  if (/centrecorp/.test(n)) return 'Aboriginal trust';
  if (/philanthropy australia/.test(n)) return 'Corporate support';
  if (fields.fundingType === 'Grant') return 'Philanthropy';
  if (fields.fundingType === 'Philanthropic') return 'Philanthropy';
  return 'Philanthropy';
}

function inferInstrument(name, pipeline, fields, tags) {
  const n = normalize(name);
  const tagText = normalize(tags.join(' '));
  if (pipeline === 'Grants') return 'Grant';
  if (/(sefa|white box|first nations finance|cefc|invest nt)/.test(n) || /repayable/.test(tagText)) return 'Repayable finance';
  if (/centrecorp/.test(n)) return 'Buyer + grant split';
  if (/snow/.test(n)) return 'Multi-year LOI';
  if (/recoverable/.test(tagText)) return 'Recoverable grant';
  if (fields.fundingType === 'Grant' || fields.fundingType === 'Philanthropic') return 'Grant';
  return 'TBC';
}

function inferCapitalStatus(stage, status, fields) {
  if (fields.capitalStatus) return fields.capitalStatus;
  if (status === 'lost') return '';
  if (/ask made/i.test(stage)) return 'Ask made';
  if (/delivering|stewarding|reporting/i.test(stage)) return 'Paid/TBC';
  return 'Signal';
}

function inferMatchEligible(name, pipeline, status, fields, opportunityType) {
  if (fields.matchEligible) return fields.matchEligible;
  if (status === 'lost') return 'No';
  if (/qbe foundation/i.test(name)) return 'No';
  if (opportunityType === 'Corporate support') return 'No';
  if (pipeline === 'Grants') return 'TBC';
  return 'TBC';
}

function inferAmountBasis(status, fields) {
  if (fields.amountBasis) return fields.amountBasis;
  return status === 'lost' ? '' : 'Estimate';
}

function inferEvidencePack(status, fields) {
  if (fields.evidencePackStatus) return fields.evidencePackStatus;
  return status === 'lost' ? '' : 'Missing';
}

function inferPriority(name, value, status, qbeRow, pipeline) {
  if (qbeRow?.Priority) return qbeRow.Priority;
  if (status === 'lost') return 'Archive';
  if (/qbe foundation/i.test(name)) return 'Monitor';
  if (pipeline === 'Grants') return value >= 120000 ? 'Tier 2' : 'Tier 3';
  if (value >= 250000 || /(sefa|white box|snow|minderoo|centrecorp|vfff|vincent fairfax)/i.test(name)) return 'Tier 1';
  if (value >= 75000) return 'Tier 2';
  return 'Tier 3';
}

function inferNextAction({ stage, status, pipeline, fields, qbeRow, funderRow }) {
  if (qbeRow?.['Next Action']) return qbeRow['Next Action'];
  if (fields.nextReportingAction) return fields.nextReportingAction;
  if (funderRow?.['Next action']) return funderRow['Next action'];
  if (status === 'lost') return 'No active action; keep as archive unless reopened.';
  if (pipeline === 'Grants') return 'Review eligibility, match treatment, and pursue/no-go decision.';
  if (/identified/i.test(stage)) return 'Review fit and either qualify, monitor, or no-go.';
  if (/qualified|cultivating/i.test(stage)) return 'Confirm route, amount, evidence pack, and next founder-authored send.';
  if (/ask made/i.test(stage)) return 'Confirm decision date and next follow-up.';
  if (/delivering|stewarding|renewing/i.test(stage)) return 'Confirm Xero/signed-paper status and decide renewal or archive treatment.';
  return 'Review current state and assign next action.';
}

function buildGhlProposal({ status, pipeline, stage, fields, proposedType, proposedInstrument, proposedMatch, proposedCapitalStatus, proposedEvidencePack, amountBasis }) {
  if (status === 'lost') return 'No GHL write proposed; archived/lost row only.';
  const missing = [];
  if (!fields.fundingType) missing.push(`Funding type=${proposedType}`);
  if (!fields.matchEligible) missing.push(`Match Eligible=${proposedMatch}`);
  if (!fields.capitalStatus) missing.push(`Capital Status=${proposedCapitalStatus}`);
  if (!fields.amountBasis) missing.push(`Amount Basis=${amountBasis}`);
  if (!fields.evidencePackStatus) missing.push(`Evidence Pack=${proposedEvidencePack}`);
  if (!missing.length) return 'No GHL field change proposed; QBE custom fields already populated.';
  return `Would backfill GHL custom fields: ${missing.join('; ')}. No write performed.`;
}

function buildNotionProposal({ qbeRow, funderRow, status, proposedStatus, proposedPriority, proposedType, proposedInstrument, proposedMatch, proposedCapitalStatus, value, opp }) {
  if (status === 'lost') {
    return qbeRow
      ? `Would set unified register Status=${proposedStatus} or move to archive view; no active pursuit.`
      : `Would not add to active register; optionally add archive row Status=${proposedStatus}.`;
  }
  if (qbeRow) {
    const diffs = [];
    if (qbeRow.Status !== proposedStatus) diffs.push(`Status ${qbeRow.Status}->${proposedStatus}`);
    if (Number(qbeRow['Target AUD'] || 0) !== Number(value || 0)) diffs.push(`Target AUD ${qbeRow['Target AUD'] || 0}->${value || 0}`);
    if (qbeRow['Match Eligible'] !== proposedMatch) diffs.push(`Match Eligible ${qbeRow['Match Eligible'] || '(blank)'}->${proposedMatch}`);
    if (qbeRow['Capital Status'] !== proposedCapitalStatus && proposedCapitalStatus !== 'Paid/TBC') diffs.push(`Capital Status ${qbeRow['Capital Status'] || '(blank)'}->${proposedCapitalStatus}`);
    return diffs.length ? `Would review/update QBE register: ${diffs.join('; ')}.` : 'No Notion QBE register change proposed.';
  }
  if (funderRow) {
    return `Would migrate/merge older Funder Pipeline row into unified register with GHL Opportunity ID=${opp.id}, Status=${proposedStatus}, Priority=${proposedPriority}, Type=${proposedType}, Instrument=${proposedInstrument}, Match Eligible=${proposedMatch}.`;
  }
  return `Would add unified register row with GHL Opportunity ID=${opp.id}, Status=${proposedStatus}, Priority=${proposedPriority}, Type=${proposedType}, Instrument=${proposedInstrument}, Target AUD=${value || 0}, Match Eligible=${proposedMatch}, Capital Status=${proposedCapitalStatus}.`;
}

function csvEscape(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function daysSince(iso) {
  if (!iso) return null;
  const delta = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(delta / 86400000));
}

async function main() {
  if (!TOKEN || !LOC) {
    console.error('Missing GHL_API_KEY / GHL_LOCATION_ID in v2/.env.local');
    process.exit(1);
  }

  const meta = await getPipelineMeta();
  const qbeByOppId = new Map(NOTION_QBE_ROWS.filter((row) => row['GHL Opportunity ID']).map((row) => [row['GHL Opportunity ID'], row]));
  // Prefer ID-only QBE matches. These rows are control records, and loose name
  // matching can collapse separate opportunities under one funder.
  const qbeByKey = new Map(NOTION_QBE_ROWS.filter((row) => !row['GHL Opportunity ID']).map((row) => [canonicalKey(row.Opportunity), row]));
  const funderByKey = new Map(NOTION_FUNDER_ROWS.map((row) => [canonicalKey(row.Funder), row]));

  const rows = [];
  for (const [pipelineName, pipelineId] of Object.entries(PIPELINES)) {
    const opps = await fetchOpps(pipelineId);
    for (const opp of opps) {
      const stage = stageName(meta, opp);
      const relation = opp.relations?.find((r) => r.primary) || {};
      const contactName = opp.contact?.companyName || opp.contact?.name || relation.companyName || relation.fullName || '';
      const tags = [...(opp.contact?.tags || []), ...(relation.tags || [])];
      const fields = customFieldMap(opp);
      const key = canonicalKey(`${opp.name} ${contactName}`);
      const qbeRow = qbeByOppId.get(opp.id) || qbeByKey.get(key);
      const funderRow = funderByKey.get(key);
      const proposedStatus = inferSharedStatus({ pipeline: pipelineName, stage, status: opp.status, qbeRow, funderRow });
      const proposedType = qbeRow?.['Opportunity Type'] || inferOpportunityType(opp.name, pipelineName, fields, tags);
      const proposedInstrument = qbeRow?.Instrument || inferInstrument(opp.name, pipelineName, fields, tags);
      const proposedCapitalStatus = inferCapitalStatus(stage, opp.status, fields);
      const proposedMatch = qbeRow?.['Match Eligible'] || inferMatchEligible(opp.name, pipelineName, opp.status, fields, proposedType);
      const amountBasis = inferAmountBasis(opp.status, fields);
      const proposedEvidencePack = inferEvidencePack(opp.status, fields);
      const proposedPriority = inferPriority(opp.name, Number(opp.monetaryValue || 0), opp.status, qbeRow, pipelineName);
      const currentNotionStatus = [
        qbeRow ? `QBE: ${qbeRow.Status}` : '',
        funderRow ? `Funder Pipeline: ${funderRow.Stage}${funderRow.Action ? ` / ${funderRow.Action}` : ''}` : '',
      ].filter(Boolean).join(' | ') || 'Missing from current Notion registers';
      const active = isOpen(opp) ? 'active' : 'archive';
      const staleDays = daysSince(opp.updatedAt);
      const issueFlags = [
        !qbeRow && isOpen(opp) ? 'missing-unified-register' : '',
        qbeRow && funderRow && qbeRow.Status !== inferSharedStatus({ pipeline: pipelineName, stage: funderRow.Stage, status: opp.status, qbeRow: null, funderRow }) ? 'notion-register-drift' : '',
        isOpen(opp) && !fields.matchEligible ? 'missing-ghl-match-field' : '',
        isOpen(opp) && !fields.capitalStatus ? 'missing-ghl-capital-status' : '',
        isOpen(opp) && staleDays !== null && staleDays >= 25 ? 'stale-25d' : '',
      ].filter(Boolean).join('; ');

      rows.push({
        row_scope: active,
        pipeline: pipelineName,
        ghl_opportunity_id: opp.id,
        ghl_contact_id: opp.contactId || opp.contact?.id || relation.recordId || '',
        opportunity: opp.name || contactName,
        contact: contactName,
        ghl_stage: stage,
        ghl_status: opp.status || '',
        target_aud: Number(opp.monetaryValue || 0),
        ghl_updated_at: opp.updatedAt || '',
        days_since_update: staleDays ?? '',
        current_notion_status: currentNotionStatus,
        proposed_shared_status: proposedStatus,
        qbe_eligibility: proposedMatch,
        proposed_priority: proposedPriority,
        proposed_type: proposedType,
        proposed_instrument: proposedInstrument,
        proposed_capital_status: proposedCapitalStatus,
        proposed_amount_basis: amountBasis,
        proposed_evidence_pack: proposedEvidencePack,
        next_action: inferNextAction({ stage, status: opp.status, pipeline: pipelineName, fields, qbeRow, funderRow }),
        exact_ghl_dry_run_change: buildGhlProposal({ status: opp.status, pipeline: pipelineName, stage, fields, proposedType, proposedInstrument, proposedMatch, proposedCapitalStatus, proposedEvidencePack, amountBasis }),
        exact_notion_dry_run_change: buildNotionProposal({ qbeRow, funderRow, status: opp.status, proposedStatus, proposedPriority, proposedType, proposedInstrument, proposedMatch, proposedCapitalStatus, value: Number(opp.monetaryValue || 0), opp }),
        matched_qbe_register_url: qbeRow?.url || '',
        matched_funder_pipeline_url: funderRow?.url || '',
        issue_flags: issueFlags,
      });
    }
    await sleep(600);
  }

  rows.sort((a, b) => {
    if (a.row_scope !== b.row_scope) return a.row_scope === 'active' ? -1 : 1;
    return (b.target_aud || 0) - (a.target_aud || 0) || a.opportunity.localeCompare(b.opportunity);
  });

  const summary = {
    generated_at: new Date().toISOString(),
    source_scope: 'Live GHL Goods Supporter Journey + Grants; Notion Funder Pipeline and QBE Register snapshots queried 2026-06-30 ACST.',
    total_rows: rows.length,
    active_rows: rows.filter((row) => row.row_scope === 'active').length,
    archive_rows: rows.filter((row) => row.row_scope === 'archive').length,
    active_value_aud: rows.filter((row) => row.row_scope === 'active').reduce((sum, row) => sum + row.target_aud, 0),
    qbe_register_matched_active: rows.filter((row) => row.row_scope === 'active' && row.matched_qbe_register_url).length,
    funder_pipeline_matched_active: rows.filter((row) => row.row_scope === 'active' && row.matched_funder_pipeline_url).length,
    missing_unified_register_active: rows.filter((row) => row.row_scope === 'active' && row.issue_flags.includes('missing-unified-register')).length,
    missing_ghl_match_field_active: rows.filter((row) => row.row_scope === 'active' && row.issue_flags.includes('missing-ghl-match-field')).length,
    stale_25d_active: rows.filter((row) => row.row_scope === 'active' && row.issue_flags.includes('stale-25d')).length,
  };

  fs.mkdirSync('tmp', { recursive: true });
  fs.writeFileSync('tmp/qbe-reconciliation-dry-run.json', JSON.stringify({ summary, rows }, null, 2));

  const columns = Object.keys(rows[0] || {});
  const csv = [columns.join(','), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(','))].join('\n');
  fs.writeFileSync('tmp/qbe-reconciliation-dry-run.csv', csv);

  const topRows = rows
    .filter((row) => row.row_scope === 'active')
    .slice(0, 25)
    .map((row) => `| ${row.opportunity.replace(/\|/g, '/')} | ${row.pipeline} | ${row.ghl_stage} | ${row.current_notion_status.replace(/\|/g, '/')} | ${row.proposed_shared_status} | ${row.qbe_eligibility} | ${row.issue_flags || 'none'} |`);

  const md = [
    `# QBE/GHL/Notion reconciliation dry-run - ${summary.generated_at}`,
    '',
    'No CRM or Notion writes were performed.',
    '',
    '## Summary',
    '',
    `- Total GHL funder/grant rows reviewed: ${summary.total_rows}`,
    `- Active rows: ${summary.active_rows}`,
    `- Archive/lost rows: ${summary.archive_rows}`,
    `- Active live GHL value: $${summary.active_value_aud.toLocaleString()}`,
    `- Active rows already in QBE register: ${summary.qbe_register_matched_active}`,
    `- Active rows matched to old Notion Funder Pipeline: ${summary.funder_pipeline_matched_active}`,
    `- Active rows missing from unified register: ${summary.missing_unified_register_active}`,
    `- Active rows missing GHL match-eligible field: ${summary.missing_ghl_match_field_active}`,
    `- Active rows stale by >=25 days: ${summary.stale_25d_active}`,
    '',
    '## Top Active Rows',
    '',
    '| Opportunity | Pipeline | GHL stage | Current Notion status | Proposed shared status | QBE eligibility | Flags |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...topRows,
    '',
    '## Files',
    '',
    '- Full CSV: `tmp/qbe-reconciliation-dry-run.csv`',
    '- Full JSON: `tmp/qbe-reconciliation-dry-run.json`',
  ].join('\n');
  fs.writeFileSync('tmp/qbe-reconciliation-dry-run.md', md);

  console.log(JSON.stringify(summary, null, 2));
  console.log('Wrote tmp/qbe-reconciliation-dry-run.{json,csv,md}');
}

main().catch((error) => {
  console.error('FATAL:', error.message);
  process.exit(1);
});
