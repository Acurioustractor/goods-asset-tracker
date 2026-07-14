#!/usr/bin/env node
/**
 * Backfill QBE Tier 1 capital targets into HighLevel.
 *
 * DRY-RUN BY DEFAULT. Pass --commit to write.
 *
 * The HighLevel connector available in Codex is read-only, so this script uses
 * the same LeadConnector API credentials and conservative write patterns as the
 * existing GHL maintenance scripts:
 * - search before create
 * - add tags through the additive tag endpoint
 * - append contact notes
 * - update opportunities without touching unrelated CRM records
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
const SUPPORTER_PIPELINE = 'JvBFYpVpyKsw899lkFgj';
const THROTTLE_MS = 650;

const STAGES = {
  cultivating: '524aca71-287d-4eeb-a53a-66ff3a7aede5',
  askMade: 'a23b26b4-ace3-4199-8a14-b65ed888aa52',
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

const SHARED_TAGS = [
  'goods-capital-target',
  'qbe-tier-1',
  'qbe-match-target',
  'project:act-gd',
  'role:funder',
  'source:qbe-opportunity-register',
];

const TARGETS = [
  {
    key: 'sefa',
    contact: { firstName: 'SEFA', lastName: 'Impact Finance', companyName: 'SEFA' },
    opportunityName: 'SEFA — repayable finance anchor',
    monetaryValue: 250000,
    stageId: STAGES.cultivating,
    tags: ['repayable-lender', 'instrument:repayable-finance'],
    fields: {
      fundingType: 'Other',
      matchEligible: 'TBC',
      capitalStatus: 'Signal',
      amountBasis: 'Estimate',
      evidencePackStatus: 'Partial',
      storyConsentStatus: 'Not needed',
      notionReportPageUrl: 'https://app.notion.com/p/38cebcf981cf817eaf07d29ea584dd71',
      nextReportingAction: 'Call SEFA and lodge Access impact finance form; confirm loan size, timeline, security and QBE match evidence rules.',
    },
    note:
      'QBE Tier 1 target. Ask: $250K repayable facility as anchor of ~$425K blended stack. Current status: briefing/cultivating; no signed commitment yet. Blockers: confirm SEFA live terms, security/timeline, and QBE/SIH match rules in writing.',
  },
  {
    key: 'snow',
    contact: { firstName: 'Snow Foundation', lastName: 'QBE Target', companyName: 'The Snow Foundation' },
    opportunityName: 'Snow Foundation — first-mover QBE commitment',
    monetaryValue: 100000,
    stageId: STAGES.askMade,
    tags: ['goods-funder', 'instrument:multi-year-loi'],
    fields: {
      fundingType: 'Philanthropic',
      matchEligible: 'TBC',
      capitalStatus: 'Ask made',
      amountBasis: 'Estimate',
      evidencePackStatus: 'Partial',
      storyConsentStatus: 'Not needed',
      notionReportPageUrl: 'https://app.notion.com/p/348ebcf981cf813e955fd76ba624f260',
      nextReportingAction: 'Reframe R4/R5 ask as signed multi-year LOI or repayable first-mover paper before 31 Aug.',
    },
    note:
      'QBE Tier 1 target. Warmest first-mover relationship. Use to secure signed match-eligible paper before 31 Aug 2026; current GHL capital status: ask made, not signed.',
  },
  {
    key: 'centrecorp',
    contact: { firstName: 'Centrecorp', lastName: 'Foundation', companyName: 'Centrecorp Foundation' },
    opportunityName: 'Centrecorp Foundation — Central Australia grant / bed-order split',
    monetaryValue: 75000,
    stageId: STAGES.askMade,
    tags: ['goods-funder', 'instrument:buyer-grant-split'],
    fields: {
      fundingType: 'Grant',
      matchEligible: 'TBC',
      capitalStatus: 'Ask made',
      amountBasis: 'Estimate',
      evidencePackStatus: 'Partial',
      storyConsentStatus: 'Check before publishing',
      notionReportPageUrl: 'https://app.notion.com/p/38cebcf981cf81ac99b3c6caa2af0d05',
      nextReportingAction: 'Confirm next-round bed count and amount; separate grant match from bed-order revenue; seek July board decision.',
    },
    note:
      'QBE Tier 1 target. Central Australia board package in motion. Keep grant/match component separate from direct bed-order revenue. Confirm Utopia quote/story consent before sending externally.',
  },
  {
    key: 'white box',
    contact: { firstName: 'White Box', lastName: 'SELF', companyName: 'White Box Enterprises' },
    opportunityName: 'White Box SELF — social enterprise loan pathway',
    monetaryValue: 250000,
    stageId: STAGES.cultivating,
    tags: ['repayable-lender', 'instrument:repayable-finance'],
    fields: {
      fundingType: 'Other',
      matchEligible: 'TBC',
      capitalStatus: 'Signal',
      amountBasis: 'Estimate',
      evidencePackStatus: 'Missing',
      storyConsentStatus: 'Not needed',
      notionReportPageUrl: 'https://app.notion.com/p/385ebcf981cf81448ec0cba5e2e1a4e4',
      nextReportingAction: 'Lodge SELF EOI and resolve PBI/DGR or Supply Nation eligibility on first call.',
    },
    note:
      'QBE Tier 1 target. Repayable-finance candidate. Main blocker: eligibility pathway via PBI/DGR or Supply Nation; keep in cultivating until eligibility is confirmed.',
  },
  {
    key: 'minderoo',
    contact: { firstName: 'Minderoo', lastName: 'Foundation', companyName: 'Minderoo Foundation' },
    opportunityName: 'Minderoo Foundation — catalytic QBE-aligned grant',
    monetaryValue: 200000,
    stageId: STAGES.askMade,
    tags: ['goods-funder', 'instrument:grant'],
    fields: {
      fundingType: 'Philanthropic',
      matchEligible: 'TBC',
      capitalStatus: 'Ask made',
      amountBasis: 'Estimate',
      evidencePackStatus: 'Partial',
      storyConsentStatus: 'Not needed',
      notionReportPageUrl: 'https://app.notion.com/p/380ebcf981cf814ca724c12a01016467',
      nextReportingAction: 'Press for decision date and align the ask to the QBE match stack.',
    },
    note:
      'QBE Tier 1 target. Warm catalytic grant prospect around remote Australia thesis. Current capital status: ask made; decision date needed.',
  },
  {
    key: 'vfff',
    contact: { firstName: 'VFFF', lastName: 'QBE Target', companyName: 'Vincent Fairfax Family Foundation' },
    opportunityName: 'Vincent Fairfax Family Foundation — repeat-funder grant tail',
    monetaryValue: 50000,
    stageId: STAGES.cultivating,
    tags: ['goods-funder', 'instrument:grant'],
    fields: {
      fundingType: 'Grant',
      matchEligible: 'TBC',
      capitalStatus: 'Signal',
      amountBasis: 'Estimate',
      evidencePackStatus: 'Partial',
      storyConsentStatus: 'Not needed',
      notionReportPageUrl: 'https://app.notion.com/p/385ebcf981cf81448ec0cba5e2e1a4e4',
      nextReportingAction: 'Position as aggregated round tail and seek signed commitment/LOI timing.',
    },
    note:
      'QBE Tier 1 target. Repeat-funder grant tail; smaller cheque but high fit. Needs signed commitment or LOI timing before it can count toward QBE match.',
  },
];

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function includesAllWords(haystack, needle) {
  const h = normalize(haystack);
  return normalize(needle)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => h.includes(word));
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

async function fetchSupporterOpportunities() {
  const all = [];
  let startAfter = null;
  let startAfterId = null;
  for (let i = 0; i < 20; i += 1) {
    const qs = new URLSearchParams({
      location_id: LOC,
      pipeline_id: SUPPORTER_PIPELINE,
      limit: '100',
    });
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

async function searchContacts(query) {
  const data = await ghl('POST', '/contacts/search', {
    locationId: LOC,
    pageLimit: 25,
    query,
  });
  return data.contacts || [];
}

async function findContact(target) {
  const query = target.contact.companyName || target.contact.firstName;
  const contacts = await searchContacts(query);
  const candidates = contacts.map((contact) => ({
    id: contact.id,
    label: [
      contact.companyName,
      contact.businessName,
      contact.contactName,
      contact.name,
      contact.firstName,
      contact.lastName,
      contact.email,
    ]
      .filter(Boolean)
      .join(' '),
    raw: contact,
  }));
  const exact = candidates.find((candidate) => includesAllWords(candidate.label, target.contact.companyName));
  return exact?.raw || null;
}

function findOpportunity(target, opportunities, contactId) {
  return opportunities.find((opp) => {
    const contactMatches = contactId && (opp.contactId === contactId || opp.contact?.id === contactId);
    const nameMatches =
      includesAllWords(opp.name, target.opportunityName) ||
      includesAllWords(opp.name, target.contact.companyName) ||
      includesAllWords(opp.contact?.companyName, target.contact.companyName);
    return contactMatches || nameMatches;
  });
}

function customFieldsFor(target) {
  return Object.entries(target.fields).map(([key, value]) => ({
    id: OPPORTUNITY_FIELDS[key],
    field_value: value,
  }));
}

async function createContact(target) {
  const payload = {
    locationId: LOC,
    ...target.contact,
    tags: [...SHARED_TAGS, ...target.tags],
    source: 'QBE Opportunity Register',
  };
  const data = await ghl('POST', '/contacts/', payload);
  return data.contact || data;
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
    const notes = data.notes || data.contactNotes || data || [];
    if (Array.isArray(notes) && notes.some((note) => String(note.body || note.message || '').includes(body.slice(0, 80)))) {
      return false;
    }
  } catch {
    // If notes are not readable in this GHL account/version, still add the note.
  }
  await addNote(contactId, body);
  return true;
}

async function writeOpportunity(target, contactId, existing) {
  const payload = {
    pipelineId: SUPPORTER_PIPELINE,
    pipelineStageId: target.stageId,
    name: target.opportunityName,
    monetaryValue: target.monetaryValue,
    status: 'open',
    customFields: customFieldsFor(target),
  };
  if (!existing) {
    payload.locationId = LOC;
    payload.contactId = contactId;
  }

  const method = existing ? 'PUT' : 'POST';
  const urlPath = existing ? `/opportunities/${existing.id}` : '/opportunities/';
  try {
    const data = await ghl(method, urlPath, payload);
    return { opportunity: data.opportunity || data, customFieldsWritten: true };
  } catch (error) {
    if (!String(error.message).includes('customFields')) throw error;
    const fallback = { ...payload };
    delete fallback.customFields;
    const data = await ghl(method, urlPath, fallback);
    return {
      opportunity: data.opportunity || data,
      customFieldsWritten: false,
      warning: `Opportunity custom fields were rejected by GHL: ${error.message}`,
    };
  }
}

async function main() {
  if (!TOKEN || !LOC) {
    console.error('Missing GHL_API_KEY / GHL_LOCATION_ID in v2/.env.local');
    process.exit(1);
  }

  console.log(`\n=== QBE Tier 1 HighLevel backfill — ${COMMIT ? 'COMMIT' : 'DRY-RUN'} ===\n`);
  const opportunities = await fetchSupporterOpportunities();
  const results = [];

  for (const target of TARGETS) {
    await sleep(THROTTLE_MS);
    const existingContact = await findContact(target);
    const plannedContactId = existingContact?.id || '(new contact)';
    const existingOpportunity = findOpportunity(target, opportunities, existingContact?.id);
    console.log(
      `${COMMIT ? 'UPSERT' : 'would upsert'} ${target.contact.companyName}: contact ${plannedContactId}; ` +
        `opportunity ${existingOpportunity?.id || '(new opportunity)'}; ` +
        `stage ${target.stageId}; $${target.monetaryValue.toLocaleString()}`
    );

    if (!COMMIT) {
      results.push({
        target: target.contact.companyName,
        contactId: existingContact?.id || null,
        opportunityId: existingOpportunity?.id || null,
        customFieldsWritten: null,
      });
      continue;
    }

    const contact = existingContact || (await createContact(target));
    const contactId = contact.id;
    await sleep(THROTTLE_MS);
    await addTags(contactId, [...SHARED_TAGS, ...target.tags]);
    await sleep(THROTTLE_MS);
    const { opportunity, customFieldsWritten, warning } = await writeOpportunity(target, contactId, existingOpportunity);
    await sleep(THROTTLE_MS);
    const noteAdded = await addNoteIfMissing(contactId, target.note);
    const opportunityId = opportunity.id || opportunity._id || existingOpportunity?.id || null;
    console.log(
      `  ok contact ${contactId}; opportunity ${opportunityId}; customFields=${customFieldsWritten ? 'yes' : 'no'}; note=${noteAdded ? 'added' : 'already present'}`
    );
    if (warning) console.warn(`  warning: ${warning}`);
    results.push({
      target: target.contact.companyName,
      contactId,
      opportunityId,
      customFieldsWritten,
      warning: warning || null,
    });
  }

  fs.mkdirSync('tmp', { recursive: true });
  fs.writeFileSync('tmp/qbe-tier1-ghl-backfill-results.json', JSON.stringify(results, null, 2));
  console.log(`\nWrote tmp/qbe-tier1-ghl-backfill-results.json`);
  console.log(`=== ${COMMIT ? 'DONE' : 'DRY-RUN complete — re-run with --commit to apply.'} ===\n`);
}

main().catch((error) => {
  console.error('FATAL:', error.message);
  process.exit(1);
});
