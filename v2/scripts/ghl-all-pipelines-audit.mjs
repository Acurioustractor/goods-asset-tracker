#!/usr/bin/env node
/**
 * READ-ONLY: audit every HighLevel opportunity pipeline in the ACT location.
 *
 * Purpose:
 * - distinguish canonical Goods pipelines from grants, front-door, legacy, and
 *   other ACT project boards;
 * - identify Goods/grant/funder records sitting outside the intended process;
 * - write a local review surface before any CRM writes.
 *
 * Outputs:
 * - tmp/ghl-all-pipelines-audit.json
 * - tmp/ghl-all-pipelines-audit.csv
 * - tmp/ghl-all-pipelines-audit.md
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

const CANONICAL_GOODS_PIPELINES = {
  UQsrmuqzxMSdCTklxEcG: {
    role: 'Goods canonical',
    process: 'Demand Register',
    recommendation: 'Keep as upstream demand signal board. Graduate by moving, not copying, only when there is a named human contact and a reason to talk.',
  },
  FjMyJM3YzWQFmKqR9fur: {
    role: 'Goods canonical',
    process: 'Buyer Pipeline',
    recommendation: 'Keep commercial-only. Grant-funded deliveries and funder asks should not sit here.',
  },
  JvBFYpVpyKsw899lkFgj: {
    role: 'Goods canonical',
    process: 'Supporter Journey',
    recommendation: 'Keep as the main funder/capital/grant relationship pipeline. Use tags and QBE custom fields for match tracking.',
  },
};

const KNOWN_GOODS_ADJACENT = {
  scom3L0kNwA1W0zPIzMe: {
    role: 'Goods adjacent',
    process: 'Grants intake/watch',
    recommendation: 'Use only as screened grant-program intake/watch board. Worked funder relationships should be moved or linked into Supporter Journey.',
  },
  QiK57emft8v05hxylmwA: {
    role: 'Goods legacy',
    process: 'Supporters & Donors',
    recommendation: 'Superseded by Goods Supporter Journey. Keep empty or archive after confirming no workflows depend on it.',
  },
};

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function csvEscape(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function ghl(method, urlPath) {
  const res = await fetch(`${BASE}${urlPath}`, { method, headers });
  if (!res.ok) throw new Error(`${method} ${urlPath} -> ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

async function fetchPipelines() {
  const data = await ghl('GET', `/opportunities/pipelines?locationId=${LOC}`);
  return data.pipelines || [];
}

async function fetchOpps(pipelineId) {
  const all = [];
  let startAfter = null;
  let startAfterId = null;
  while (true) {
    const qs = new URLSearchParams({ location_id: LOC, pipeline_id: pipelineId, limit: '100' });
    if (startAfter) qs.set('startAfter', startAfter);
    if (startAfterId) qs.set('startAfterId', startAfterId);
    const data = await ghl('GET', `/opportunities/search?${qs.toString()}`);
    const opps = data.opportunities || [];
    all.push(...opps);
    if (opps.length < 100 || !data.meta?.startAfter) break;
    startAfter = data.meta.startAfter;
    startAfterId = data.meta.startAfterId;
    await sleep(650);
  }
  return all;
}

function stageName(pipeline, stageId) {
  return (pipeline.stages || []).find((stage) => stage.id === stageId)?.name || stageId || '';
}

function allTags(opp) {
  const relationTags = (opp.relations || []).flatMap((relation) => relation.tags || []);
  return [...(opp.contact?.tags || []), ...relationTags];
}

function opportunityText(opp) {
  return normalize([
    opp.name,
    opp.source,
    opp.contact?.companyName,
    opp.contact?.name,
  ].join(' '));
}

function tagText(opp) {
  return normalize(allTags(opp).join(' '));
}

function hasLinkedBuyerFunderSplit(opp) {
  return /split buyer funder|linked supporter journey|qbe centrecorp split/.test(tagText(opp));
}

function hasGoodsSignal(opp) {
  const tags = tagText(opp);
  const text = opportunityText(opp);
  return /project act gd|project goods|goods (capital|buyer|grant|funder|supporter|customer|partner|state|hot|warm|cold|cooling|steady|newsletter|inquiry|impact|report|tier)|goods on country|goodsoncountry|stretch bed|weave bed|pakkimjalki|washer/.test(`${tags} ${text}`);
}

function hasGrantOrCapitalSignal(opp) {
  const tags = tagText(opp);
  const text = opportunityText(opp);
  return /role funder|goods capital target|goods grant program|goods funder|qbe tier|qbe match target|repayable lender|instrument grant|instrument repayable finance|philanthropic|catalytic/.test(tags) ||
    /qbe foundation|sefa|snow foundation|centrecorp foundation|minderoo foundation|vincent fairfax|vfff|white box|frrr|funding network|amp foundation|paul ramsay foundation|dusseldorp forum|real innovation fund|manufacturing ecosystem fund|capability building grants|impact investor|concessional loan|repayable finance/.test(text);
}

function classifyPipeline(pipeline) {
  if (CANONICAL_GOODS_PIPELINES[pipeline.id]) return CANONICAL_GOODS_PIPELINES[pipeline.id];
  if (KNOWN_GOODS_ADJACENT[pipeline.id]) return KNOWN_GOODS_ADJACENT[pipeline.id];

  const name = normalize(pipeline.name);
  if (/universal inquiry/.test(name)) {
    return {
      role: 'Shared front door',
      process: 'Universal Inquiry',
      recommendation: 'Keep as ACT-wide triage only. Route Goods items out via project-goods; do not run sales, grants, or delivery inside this board.',
    };
  }
  if (/harvest/.test(name)) {
    return {
      role: 'Other ACT project',
      process: 'Harvest',
      recommendation: 'Keep outside Goods. Check only for accidental Goods/grant records.',
    };
  }
  if (/contained|justice|shop|curious tractor|empathy|act/.test(name)) {
    return {
      role: 'Other ACT project',
      process: pipeline.name,
      recommendation: 'Keep outside Goods. Check only for accidental Goods/grant records.',
    };
  }
  return {
    role: 'Unknown / review',
    process: pipeline.name,
    recommendation: 'Review owner and trigger. If it is inactive or duplicated, archive or document before changing workflows.',
  };
}

function proposedActionForPipeline({ classification, openCount, openGoodsSignalCount, openGrantSignalCount }) {
  if (classification.role === 'Goods canonical') return 'KEEP';
  if (classification.process === 'Grants intake/watch') return openCount ? 'KEEP AS WATCH BOARD' : 'ARCHIVE WHEN SAFE';
  if (classification.role === 'Goods legacy') return openCount ? 'REVIEW LEGACY RECORDS' : 'ARCHIVE WHEN SAFE';
  if (classification.role === 'Shared front door') return openGoodsSignalCount ? 'ROUTE GOODS ITEMS OUT' : 'KEEP AS FRONT DOOR';
  if (openGoodsSignalCount) return 'REVIEW CROSS-PROJECT GOODS RECORDS';
  if (openGrantSignalCount) return 'REVIEW SHARED FUNDER OVERLAP';
  if (!openCount) return 'ARCHIVE WHEN SAFE';
  return 'LEAVE OUTSIDE GOODS';
}

function proposedActionForOpportunity({ opp, pipeline, classification, stage, goodsSignal, grantSignal, linkedSplit }) {
  if (opp.status !== 'open') return 'No active action; keep as closed/archive context.';
  if (classification.role === 'Goods canonical') {
    if (classification.process === 'Buyer Pipeline' && linkedSplit) return 'Linked split: keep as commercial buyer row; Supporter Journey owns the QBE/funder ask.';
    if (classification.process === 'Buyer Pipeline' && grantSignal) return 'Review: possible grant/funder record in commercial pipeline.';
    if (classification.process === 'Demand Register' && /converted/i.test(stage)) return 'Check whether it has graduated cleanly to Buyer Pipeline.';
    return 'Keep in current Goods process; manage by stage/tag hygiene.';
  }
  if (classification.process === 'Grants intake/watch') {
    return 'Keep only if it is a live grant program; move/relate active relationship work to Supporter Journey.';
  }
  if (classification.role === 'Shared front door' && goodsSignal) {
    return 'Route to the relevant Goods pipeline, then close/reroute the inquiry card.';
  }
  if (goodsSignal && grantSignal) {
    return 'Review cross-project Goods/funder contact; move only if this opportunity is actually a Goods ask.';
  }
  if (goodsSignal) {
    return 'Review cross-project Goods tag/contact; leave here if the opportunity belongs to this project.';
  }
  if (grantSignal) {
    return 'Review shared funder/capital overlap; relate or tag only if relevant to Goods.';
  }
  return 'Outside Goods scope.';
}

function stageSummary(pipeline, opps) {
  const counts = new Map();
  for (const opp of opps) {
    const key = stageName(pipeline, opp.pipelineStageId);
    const current = counts.get(key) || { total: 0, open: 0, won: 0, lost: 0, value: 0 };
    current.total += 1;
    current[opp.status] = (current[opp.status] || 0) + 1;
    current.value += Number(opp.monetaryValue || 0);
    counts.set(key, current);
  }
  return [...counts.entries()].map(([stage, count]) => ({ stage, ...count }));
}

async function main() {
  if (!TOKEN || !LOC) {
    console.error('Missing GHL_API_KEY / GHL_LOCATION_ID in v2/.env.local');
    process.exit(1);
  }

  const pipelines = await fetchPipelines();
  const pipelineRows = [];
  const opportunityRows = [];

  for (const pipeline of pipelines) {
    const opps = await fetchOpps(pipeline.id);
    const classification = classifyPipeline(pipeline);
    let goodsSignalCount = 0;
    let grantSignalCount = 0;
    let openGoodsSignalCount = 0;
    let openGrantSignalCount = 0;
    let openLinkedSplitCount = 0;
    let openCount = 0;
    let wonCount = 0;
    let lostCount = 0;
    let totalValue = 0;
    let openValue = 0;
    let latestUpdate = '';

    for (const opp of opps) {
      const stage = stageName(pipeline, opp.pipelineStageId);
      const goodsSignal = hasGoodsSignal(opp);
      const grantSignal = hasGrantOrCapitalSignal(opp);
      const linkedSplit = hasLinkedBuyerFunderSplit(opp);
      if (goodsSignal) goodsSignalCount += 1;
      if (grantSignal) grantSignalCount += 1;
      if (opp.status === 'open') {
        openCount += 1;
        if (goodsSignal) openGoodsSignalCount += 1;
        if (grantSignal) openGrantSignalCount += 1;
        if (linkedSplit) openLinkedSplitCount += 1;
      }
      if (opp.status === 'won') wonCount += 1;
      if (opp.status === 'lost') lostCount += 1;
      const value = Number(opp.monetaryValue || 0);
      totalValue += value;
      if (opp.status === 'open') openValue += value;
      if (!latestUpdate || new Date(opp.updatedAt || 0) > new Date(latestUpdate || 0)) latestUpdate = opp.updatedAt || '';

      opportunityRows.push({
        pipeline_id: pipeline.id,
        pipeline_name: pipeline.name,
        pipeline_role: classification.role,
        process: classification.process,
        opportunity_id: opp.id,
        opportunity_name: opp.name || '',
        stage,
        status: opp.status || '',
        value,
        updated_at: opp.updatedAt || '',
        contact_id: opp.contactId || opp.contact?.id || '',
        contact_name: opp.contact?.name || '',
        company_name: opp.contact?.companyName || '',
        goods_signal: goodsSignal ? 'yes' : 'no',
        grant_or_capital_signal: grantSignal ? 'yes' : 'no',
        linked_buyer_funder_split: linkedSplit ? 'yes' : 'no',
        tags: [...new Set(allTags(opp))].join('; '),
        proposed_action: proposedActionForOpportunity({ opp, pipeline, classification, stage, goodsSignal, grantSignal, linkedSplit }),
      });
    }

    const proposedAction = proposedActionForPipeline({ classification, openCount, openGoodsSignalCount, openGrantSignalCount });
    pipelineRows.push({
      pipeline_id: pipeline.id,
      pipeline_name: pipeline.name,
      pipeline_role: classification.role,
      process: classification.process,
      total_opportunities: opps.length,
      open_opportunities: openCount,
      won_opportunities: wonCount,
      lost_opportunities: lostCount,
      total_value: totalValue,
      open_value: openValue,
      goods_signal_count: goodsSignalCount,
      grant_or_capital_signal_count: grantSignalCount,
      open_goods_signal_count: openGoodsSignalCount,
      open_grant_or_capital_signal_count: openGrantSignalCount,
      open_linked_buyer_funder_split_count: openLinkedSplitCount,
      stages: (pipeline.stages || []).map((stage) => stage.name).join(' -> '),
      stage_summary: stageSummary(pipeline, opps),
      latest_update: latestUpdate,
      proposed_action: proposedAction,
      recommendation: classification.recommendation,
    });
    await sleep(650);
  }

  pipelineRows.sort((a, b) => {
    const rank = {
      'Goods canonical': 0,
      'Goods adjacent': 1,
      'Goods legacy': 2,
      'Shared front door': 3,
      'Unknown / review': 4,
      'Other ACT project': 5,
    };
    return (rank[a.pipeline_role] ?? 9) - (rank[b.pipeline_role] ?? 9) || b.open_opportunities - a.open_opportunities || a.pipeline_name.localeCompare(b.pipeline_name);
  });
  opportunityRows.sort((a, b) => b.value - a.value || a.pipeline_name.localeCompare(b.pipeline_name) || a.opportunity_name.localeCompare(b.opportunity_name));

  const summary = {
    generated_at: new Date().toISOString(),
    highlevel_location_id: LOC,
    pipeline_count: pipelineRows.length,
    total_opportunities: opportunityRows.length,
    open_opportunities: opportunityRows.filter((row) => row.status === 'open').length,
    total_open_value: opportunityRows.filter((row) => row.status === 'open').reduce((sum, row) => sum + row.value, 0),
    canonical_goods_open: pipelineRows.filter((row) => row.pipeline_role === 'Goods canonical').reduce((sum, row) => sum + row.open_opportunities, 0),
    canonical_goods_open_value: pipelineRows.filter((row) => row.pipeline_role === 'Goods canonical').reduce((sum, row) => sum + row.open_value, 0),
    grants_open: pipelineRows.filter((row) => row.process === 'Grants intake/watch').reduce((sum, row) => sum + row.open_opportunities, 0),
    front_door_goods_open: opportunityRows.filter((row) => row.status === 'open' && row.pipeline_role === 'Shared front door' && row.goods_signal === 'yes').length,
    cross_project_goods_open: opportunityRows.filter((row) => row.status === 'open' && row.pipeline_role !== 'Goods canonical' && row.pipeline_role !== 'Goods adjacent' && row.pipeline_role !== 'Shared front door' && row.goods_signal === 'yes').length,
    cross_project_funder_overlap_open: opportunityRows.filter((row) => row.status === 'open' && row.pipeline_role !== 'Goods canonical' && row.pipeline_role !== 'Goods adjacent' && row.pipeline_role !== 'Shared front door' && row.grant_or_capital_signal === 'yes').length,
  };

  fs.mkdirSync('tmp', { recursive: true });
  fs.writeFileSync('tmp/ghl-all-pipelines-audit.json', JSON.stringify({ summary, pipelines: pipelineRows, opportunities: opportunityRows }, null, 2));

  const pipelineColumns = [
    'pipeline_role',
    'process',
    'pipeline_name',
    'pipeline_id',
    'total_opportunities',
    'open_opportunities',
    'won_opportunities',
    'lost_opportunities',
    'open_value',
    'goods_signal_count',
    'grant_or_capital_signal_count',
    'open_goods_signal_count',
    'open_grant_or_capital_signal_count',
    'open_linked_buyer_funder_split_count',
    'latest_update',
    'proposed_action',
    'recommendation',
  ];
  const pipelineCsv = [
    pipelineColumns.join(','),
    ...pipelineRows.map((row) => pipelineColumns.map((column) => csvEscape(row[column])).join(',')),
  ].join('\n');
  fs.writeFileSync('tmp/ghl-all-pipelines-audit.csv', pipelineCsv);

  const reviewRows = opportunityRows.filter((row) =>
    row.status === 'open' &&
    row.pipeline_role !== 'Goods canonical' &&
    row.pipeline_role !== 'Goods adjacent' &&
    (row.goods_signal === 'yes' || row.grant_or_capital_signal === 'yes')
  );

  const pipelineTable = pipelineRows.map((row) => (
    `| ${row.pipeline_role} | ${row.process.replace(/\|/g, '/')} | ${row.pipeline_name.replace(/\|/g, '/')} | ${row.open_opportunities} | $${row.open_value.toLocaleString()} | ${row.open_goods_signal_count} | ${row.open_grant_or_capital_signal_count} | ${row.open_linked_buyer_funder_split_count} | ${row.proposed_action} |`
  ));
  const reviewTable = reviewRows.slice(0, 40).map((row) => (
    `| ${row.pipeline_name.replace(/\|/g, '/')} | ${row.opportunity_name.replace(/\|/g, '/')} | ${row.stage.replace(/\|/g, '/')} | ${row.value ? `$${row.value.toLocaleString()}` : '$0'} | ${row.goods_signal} | ${row.grant_or_capital_signal} | ${row.proposed_action.replace(/\|/g, '/')} |`
  ));

  const md = [
    `# HighLevel all-pipeline audit - ${summary.generated_at}`,
    '',
    'No HighLevel writes were performed.',
    '',
    '## Summary',
    '',
    `- Pipelines reviewed: ${summary.pipeline_count}`,
    `- Opportunities reviewed: ${summary.total_opportunities}`,
    `- Open opportunities: ${summary.open_opportunities}`,
    `- Total open value: $${summary.total_open_value.toLocaleString()}`,
    `- Canonical Goods open opportunities: ${summary.canonical_goods_open}`,
    `- Canonical Goods open value: $${summary.canonical_goods_open_value.toLocaleString()}`,
    `- Open Grants intake/watch rows: ${summary.grants_open}`,
    `- Open Goods rows still in Universal Inquiry/front door: ${summary.front_door_goods_open}`,
    `- Open cross-project Goods-tagged rows outside Goods pipelines: ${summary.cross_project_goods_open}`,
    `- Open shared funder/capital overlaps outside Goods pipelines: ${summary.cross_project_funder_overlap_open}`,
    '',
    '## Pipeline Decision Surface',
    '',
    '| Role | Process | Pipeline | Open opps | Open value | Open Goods flags | Open funder flags | Linked buyer/funder splits | Proposed action |',
    '| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |',
    ...pipelineTable,
    '',
    '## Front-Door / Cross-Project Review Rows',
    '',
    reviewRows.length
      ? '| Pipeline | Opportunity | Stage | Value | Goods flag | Funder flag | Proposed action |\n| --- | --- | --- | ---: | --- | --- | --- |\n' + reviewTable.join('\n')
      : 'No open Goods/grant/capital review rows found outside the Goods canonical or Grants watch pipelines.',
    '',
    '## Files',
    '',
    '- Full pipeline CSV: `tmp/ghl-all-pipelines-audit.csv`',
    '- Full JSON with stage summaries and opportunity rows: `tmp/ghl-all-pipelines-audit.json`',
  ].join('\n');
  fs.writeFileSync('tmp/ghl-all-pipelines-audit.md', md);

  console.log(JSON.stringify(summary, null, 2));
  console.log('Wrote tmp/ghl-all-pipelines-audit.{json,csv,md}');
}

main().catch((error) => {
  console.error('FATAL:', error.message);
  process.exit(1);
});
