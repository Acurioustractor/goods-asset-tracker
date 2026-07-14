#!/usr/bin/env node
/**
 * Low-risk HighLevel hygiene pass from the all-pipeline audit.
 *
 * DRY-RUN BY DEFAULT. Pass --commit to write.
 *
 * Scope:
 * - route four Goods-tagged Universal Inquiry rows into the Goods Buyer Pipeline;
 * - add explicit Goods tags to ten live Goods rows missing project/funder/buyer tags;
 * - mark the Centrecorp Buyer Pipeline / Supporter Journey split with tags + note.
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
const COMMIT = process.argv.includes('--commit');
const THROTTLE_MS = 650;

const PIPELINES = {
  universal: 'ggQw10DuH0XRji6keimS',
  buyer: 'FjMyJM3YzWQFmKqR9fur',
  supporter: 'JvBFYpVpyKsw899lkFgj',
};

const BUYER_STAGES = {
  outreachQueued: 'e5220eb2-be40-4e79-9571-6acae12285c7',
  inConversation: '8da22920-c295-4358-be58-c4c69f372890',
};

const ROUTE_UNIVERSAL_TO_BUYER = [
  {
    id: 'O975pKKQl7evuYSLxefF',
    expectedName: 'FueyJCXaBUvnatyct',
    targetStageId: BUYER_STAGES.outreachQueued,
    reason: 'Goods buyer inquiry from Universal Inquiry / New Inquiry.',
  },
  {
    id: '9r4ITsnAFBokzjcU5598',
    expectedName: 'KKVAWnbZzxrsrkQBpgLvr',
    targetStageId: BUYER_STAGES.outreachQueued,
    reason: 'Goods buyer inquiry from Universal Inquiry / New Inquiry.',
  },
  {
    id: 'TgiSKRRMXv0HPb9uPzQ7',
    expectedName: 'Laura McConnell Conti',
    targetStageId: BUYER_STAGES.inConversation,
    reason: 'Goods buyer inquiry already past first assessment.',
  },
  {
    id: 'vs8TDv3UI4ntGS3dBsga',
    expectedName: 'Wash Test',
    targetStageId: BUYER_STAGES.outreachQueued,
    reason: 'Goods washer/buyer inquiry from Universal Inquiry.',
  },
];

const TAG_ONLY_ROWS = [
  {
    id: 'PZImorD7OXC48iI7Zq47',
    expectedName: 'Australian Federal Police',
    tags: ['project:act-gd', 'role:buyer', 'goods-buyer-target', 'lane:mmr-retender'],
  },
  {
    id: 'M47WSU3ZE6vgbluYT3aR',
    expectedName: 'Australian Prudential Regulation Authority',
    tags: ['project:act-gd', 'role:buyer', 'goods-buyer-target', 'lane:mmr-retender'],
  },
  {
    id: 'wGM7VsV3iwJ206MJu3o4',
    expectedName: 'Department of Defence',
    tags: ['project:act-gd', 'role:buyer', 'goods-buyer-target', 'lane:mmr-retender'],
  },
  {
    id: 'StczmxFEQZz5o5SEnwxV',
    expectedName: 'Department of Industry',
    tags: ['project:act-gd', 'role:buyer', 'goods-buyer-target', 'lane:mmr-retender'],
  },
  {
    id: 'tHT2zQV8RkEHLLRvwY9H',
    expectedName: 'National Emergency Management Agency',
    tags: ['project:act-gd', 'role:buyer', 'goods-buyer-target', 'lane:mmr-retender'],
  },
  {
    id: 'VRFgg5hW9XtmKRXuC8Rw',
    expectedName: 'Regional Arts Australia',
    tags: ['project:act-gd', 'role:funder', 'goods-funder'],
  },
  {
    id: 'STxbWqSdhI6INozX5CVI',
    expectedName: 'Social Impact Hub Foundation',
    tags: ['project:act-gd', 'role:funder', 'goods-funder'],
  },
  {
    id: 'LmyVsecxIRAtQLkqu7S7',
    expectedName: 'Streetsmart Australia',
    tags: ['project:act-gd', 'role:funder', 'goods-funder'],
  },
  {
    id: 'fPj88zqC6RoVzsmdRfnt',
    expectedName: 'Brisbane Powerhouse Foundation',
    tags: ['project:act-gd', 'role:funder', 'goods-funder'],
  },
  {
    id: 'yOYoGXzFqNg9KRAjrSYt',
    expectedName: 'Westpac Scholars Trust',
    tags: ['project:act-gd', 'role:funder', 'goods-funder'],
  },
];

const CENTRECORP_SPLIT = {
  contactId: 'ehnCEv62bCaGNTd1QuGp',
  buyerOpportunityIds: ['TUpPBR3c76JeuksojRz1', 'j2PJ19Gn8KscsSCMZyYQ'],
  supporterOpportunityId: 'KZSUEe89wSm1vMLYMUr8',
  tags: ['split:buyer-funder', 'linked-supporter-journey', 'qbe-centrecorp-split'],
  note:
    'CRM hygiene 2026-06-30: Centrecorp is intentionally split across Buyer Pipeline and Supporter Journey. Buyer rows TUpPBR3c76JeuksojRz1 and j2PJ19Gn8KscsSCMZyYQ are commercial bed-order/delivery context. Supporter Journey row KZSUEe89wSm1vMLYMUr8 is the QBE-aligned grant/match ask ($75K, Ask made). Do not count Buyer Pipeline value toward QBE match.',
};

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function ghl(method, urlPath, body) {
  const res = await fetch(`${BASE}${urlPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${urlPath} -> ${res.status}: ${text.slice(0, 500)}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

async function fetchPipelineOpps(pipelineId) {
  const all = [];
  let startAfter = null;
  let startAfterId = null;
  for (let i = 0; i < 20; i += 1) {
    const qs = new URLSearchParams({ location_id: LOC, pipeline_id: pipelineId, limit: '100' });
    if (startAfter) qs.set('startAfter', startAfter);
    if (startAfterId) qs.set('startAfterId', startAfterId);
    const data = await ghl('GET', `/opportunities/search?${qs.toString()}`);
    const opps = data.opportunities || [];
    all.push(...opps);
    if (opps.length < 100 || !data.meta?.startAfterId) break;
    startAfter = data.meta.startAfter;
    startAfterId = data.meta.startAfterId;
    await sleep(THROTTLE_MS);
  }
  return all;
}

async function fetchScopedOpps() {
  const opps = [];
  for (const pipelineId of Object.values(PIPELINES)) {
    opps.push(...(await fetchPipelineOpps(pipelineId)));
    await sleep(THROTTLE_MS);
  }
  return opps;
}

function contactIdFor(opp) {
  return opp?.contactId || opp?.contact?.id || null;
}

function assertExpected(opp, expectedName) {
  if (!opp) return 'missing-opportunity';
  if (!normalize(opp.name).includes(normalize(expectedName))) {
    return `name-mismatch: expected "${expectedName}", got "${opp.name}"`;
  }
  return null;
}

async function addTags(contactId, tags) {
  await ghl('POST', `/contacts/${contactId}/tags`, { tags });
}

async function addNote(contactId, body) {
  await ghl('POST', `/contacts/${contactId}/notes`, { body });
}

async function addNoteIfMissing(contactId, body) {
  try {
    const data = await ghl('GET', `/contacts/${contactId}/notes`);
    const notes = Array.isArray(data) ? data : data.notes || data.contactNotes || [];
    if (Array.isArray(notes) && notes.some((note) => String(note.body || note.message || '').includes(body.slice(0, 90)))) {
      return false;
    }
  } catch {
    // Notes are additive audit context. If reading notes fails, writing the note is still useful.
  }
  await addNote(contactId, body);
  return true;
}

async function moveOpportunity(opp, targetStageId) {
  const payload = { pipelineId: PIPELINES.buyer, pipelineStageId: targetStageId, status: 'open' };
  try {
    await ghl('PUT', `/opportunities/${opp.id}`, payload);
  } catch (error) {
    await ghl('PUT', `/opportunities/${opp.id}`, {
      ...payload,
      name: opp.name,
      monetaryValue: Number(opp.monetaryValue || 0),
    });
  }
}

async function routeUniversalRows(opps, results) {
  for (const target of ROUTE_UNIVERSAL_TO_BUYER) {
    const opp = opps.find((row) => row.id === target.id);
    const issue = assertExpected(opp, target.expectedName);
    const contactId = contactIdFor(opp);
    const action = {
      type: 'route-universal-to-buyer',
      opportunityId: target.id,
      opportunityName: opp?.name || target.expectedName,
      contactId,
      fromPipelineId: opp?.pipelineId || PIPELINES.universal,
      toPipelineId: PIPELINES.buyer,
      toStageId: target.targetStageId,
      tags: ['project:act-gd', 'role:buyer', 'goods-buyer-target', 'routed-from-universal-inquiry', 'source:universal-inquiry'],
      reason: target.reason,
      status: issue ? 'skipped' : COMMIT ? 'written' : 'planned',
      issue,
    };

    if (!issue && !contactId) {
      action.status = 'skipped';
      action.issue = 'missing-contact';
    }

    console.log(`${COMMIT ? 'ROUTE' : 'would route'} ${action.opportunityName} -> Goods Buyer Pipeline`);
    if (COMMIT && action.status === 'written') {
      await moveOpportunity(opp, target.targetStageId);
      await sleep(THROTTLE_MS);
      await addTags(contactId, action.tags);
      await sleep(THROTTLE_MS);
      action.noteAdded = await addNoteIfMissing(
        contactId,
        `CRM hygiene 2026-06-30: Routed "${opp.name}" from Universal Inquiry into Goods Buyer Pipeline. Reason: ${target.reason}`
      );
      await sleep(THROTTLE_MS);
    }
    results.push(action);
  }
}

async function tagExplicitGoodsRows(opps, results) {
  for (const target of TAG_ONLY_ROWS) {
    const opp = opps.find((row) => row.id === target.id);
    const issue = assertExpected(opp, target.expectedName);
    const contactId = contactIdFor(opp);
    const action = {
      type: 'tag-explicit-goods-row',
      opportunityId: target.id,
      opportunityName: opp?.name || target.expectedName,
      contactId,
      pipelineId: opp?.pipelineId || '',
      tags: target.tags,
      status: issue ? 'skipped' : COMMIT ? 'written' : 'planned',
      issue,
    };

    if (!issue && !contactId) {
      action.status = 'skipped';
      action.issue = 'missing-contact';
    }

    console.log(`${COMMIT ? 'TAG' : 'would tag'} ${action.opportunityName} -> ${target.tags.join(', ')}`);
    if (COMMIT && action.status === 'written') {
      await addTags(contactId, target.tags);
      await sleep(THROTTLE_MS);
    }
    results.push(action);
  }
}

async function linkCentrecorpSplit(opps, results) {
  const buyerOpps = CENTRECORP_SPLIT.buyerOpportunityIds.map((id) => opps.find((row) => row.id === id));
  const supporterOpp = opps.find((row) => row.id === CENTRECORP_SPLIT.supporterOpportunityId);
  const missing = [
    ...CENTRECORP_SPLIT.buyerOpportunityIds.filter((id, index) => !buyerOpps[index]),
    !supporterOpp ? CENTRECORP_SPLIT.supporterOpportunityId : null,
  ].filter(Boolean);
  const action = {
    type: 'link-centrecorp-buyer-funder-split',
    contactId: CENTRECORP_SPLIT.contactId,
    buyerOpportunityIds: CENTRECORP_SPLIT.buyerOpportunityIds,
    supporterOpportunityId: CENTRECORP_SPLIT.supporterOpportunityId,
    tags: CENTRECORP_SPLIT.tags,
    note: CENTRECORP_SPLIT.note,
    status: missing.length ? 'skipped' : COMMIT ? 'written' : 'planned',
    issue: missing.length ? `missing-opportunities: ${missing.join(', ')}` : null,
  };

  console.log(`${COMMIT ? 'LINK' : 'would link'} Centrecorp Buyer Pipeline rows to Supporter Journey split`);
  if (COMMIT && action.status === 'written') {
    await addTags(CENTRECORP_SPLIT.contactId, CENTRECORP_SPLIT.tags);
    await sleep(THROTTLE_MS);
    action.noteAdded = await addNoteIfMissing(CENTRECORP_SPLIT.contactId, CENTRECORP_SPLIT.note);
    await sleep(THROTTLE_MS);
  }
  results.push(action);
}

async function main() {
  if (!TOKEN || !LOC) {
    console.error('Missing GHL_API_KEY / GHL_LOCATION_ID in v2/.env.local');
    process.exit(1);
  }

  console.log(`\n=== GHL low-risk hygiene pass — ${COMMIT ? 'COMMIT' : 'DRY-RUN'} ===\n`);
  const opps = await fetchScopedOpps();
  const results = [];

  await routeUniversalRows(opps, results);
  await tagExplicitGoodsRows(opps, results);
  await linkCentrecorpSplit(opps, results);

  const summary = {
    generated_at: new Date().toISOString(),
    mode: COMMIT ? 'commit' : 'dry-run',
    planned: results.filter((row) => row.status === 'planned').length,
    written: results.filter((row) => row.status === 'written').length,
    skipped: results.filter((row) => row.status === 'skipped').length,
    route_universal_to_buyer: results.filter((row) => row.type === 'route-universal-to-buyer').length,
    tag_explicit_goods_rows: results.filter((row) => row.type === 'tag-explicit-goods-row').length,
    link_centrecorp_split: results.filter((row) => row.type === 'link-centrecorp-buyer-funder-split').length,
  };

  fs.mkdirSync('tmp', { recursive: true });
  fs.writeFileSync('tmp/ghl-low-risk-hygiene-pass-results.json', JSON.stringify({ summary, results }, null, 2));
  console.log(`\n${JSON.stringify(summary, null, 2)}`);
  console.log(`Wrote tmp/ghl-low-risk-hygiene-pass-results.json`);
  console.log(`=== ${COMMIT ? 'DONE' : 'DRY-RUN complete - re-run with --commit to apply.'} ===\n`);
}

main().catch((error) => {
  console.error('FATAL:', error.message);
  process.exit(1);
});
