#!/usr/bin/env node

/**
 * Goods storyteller provenance audit.
 *
 * READ-ONLY against Empathy Ledger. This script finds candidates by more than
 * the Goods project tag, separates source-backed transcripts from copies and
 * excerpts, checks current registry quotes against transcript text, and emits
 * JSON/CSV files that can be reviewed before any AI analysis is requested.
 *
 * Run from v2/:
 *   node --env-file=.env.local scripts/goods-storyteller-provenance-audit.mjs
 */

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

function loadTypeScriptModule(relativePath) {
  const source = fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const mod = { exports: {} };
  new Function('exports', 'module', 'require', output)(mod.exports, mod, require);
  return mod.exports;
}

const { STORYTELLER_REGISTRY } = loadTypeScriptModule('src/lib/data/storyteller-registry.ts');

const EL_URL = (process.env.EMPATHY_LEDGER_SUPABASE_URL || '').replace(/\/$/, '');
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const GOODS_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';

if (!EL_URL || !EL_KEY || !GOODS_PROJECT_ID) {
  console.error('Missing EMPATHY_LEDGER_SUPABASE_URL, EMPATHY_LEDGER_SUPABASE_KEY or EMPATHY_LEDGER_PROJECT_ID.');
  process.exit(1);
}

const LOCATION_TERMS = [
  'Kalgoorlie',
  'Palm Island',
  'Mount Isa',
  'Darwin',
  'Tennant Creek',
  'Alice Springs',
  'Utopia',
  'Maningrida',
  'Katherine',
  'Ampilatwatja',
  'Arawerr',
  'Barunga',
];

const GOODS_TERMS = [
  'Stretch Bed',
  'Pakkimjalki',
  'washing machine',
  'Oonchiumpa',
  'Wilya Janta',
];

const GOODS_CONTEXT_TERMS = [
  'bed',
  'beds',
  'bunk',
  'mattress',
  'sleeping on the ground',
  'off the ground',
  'flat pack',
  'recycled plastic',
  'freight',
  'washer',
  'washers',
];

const CURRENT_PITCH_VOICE_NAMES = [
  'Dianne Stokes',
  'Norman Frank',
  'Cliff Plummer',
  'Chloe',
  'Wayne Glenn',
  'Dr Boe Remenyi',
];

const TRIP_WINDOWS = [
  { label: 'October 2024', from: '2024-10-01', to: '2024-10-31' },
  { label: 'November to December 2024', from: '2024-11-01', to: '2024-12-31' },
  { label: 'January 2025', from: '2025-01-01', to: '2025-01-31' },
  { label: 'May 2025', from: '2025-05-01', to: '2025-05-31' },
  { label: 'May 2026', from: '2026-05-01', to: '2026-05-31' },
];

const OUTPUT_BASE = path.join(process.cwd(), 'output', 'goods-storyteller-provenance-2026-07-14');

function normalise(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐‑‒–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function normaliseName(value) {
  return normalise(value)
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9&' -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normaliseWords(value) {
  return normalise(value)
    .replace(/[^a-z0-9']+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function contentOf(transcript) {
  return [
    transcript.transcript_content,
    transcript.content,
    transcript.text,
    transcript.formatted_text,
  ].find((value) => typeof value === 'string' && value.trim()) || '';
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function matchesTerm(haystack, term) {
  return normalise(haystack).includes(normalise(term));
}

function findTerms(haystack, terms) {
  return terms.filter((term) => matchesTerm(haystack, term));
}

function tripWindowFor(dateValue) {
  if (!dateValue) return null;
  const date = String(dateValue).slice(0, 10);
  return TRIP_WINDOWS.find((window) => date >= window.from && date <= window.to)?.label || null;
}

function exactQuoteSupport(body, quote) {
  const source = normaliseWords(body);
  const target = normaliseWords(quote);
  if (!target) return false;
  if (source.includes(target)) return true;

  // Ellipses are editorial joins. They are useful for tracing provenance but
  // are not classified as one exact contiguous quote.
  return false;
}

function editedQuoteSupport(body, quote) {
  const source = normaliseWords(body);
  const parts = normalise(quote)
    .split(/\.{3}|…/)
    .map((part) => normaliseWords(part))
    .filter((part) => part.length >= 8);
  if (parts.length < 2) return false;

  let cursor = 0;
  for (const part of parts) {
    const index = source.indexOf(part, cursor);
    if (index === -1) return false;
    cursor = index + part.length;
  }
  return true;
}

function tokeniseWithOffsets(value) {
  const tokens = [];
  const matcher = /[a-z0-9']+/gi;
  let match;
  while ((match = matcher.exec(value)) !== null) {
    tokens.push({
      value: match[0].toLowerCase(),
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return tokens;
}

function closestQuoteMatch(body, quote) {
  const sourceTokens = tokeniseWithOffsets(body);
  const quoteTokens = tokeniseWithOffsets(quote).map((token) => token.value);
  if (!sourceTokens.length || !quoteTokens.length) return null;

  const quoteCounts = new Map();
  for (const token of quoteTokens) quoteCounts.set(token, (quoteCounts.get(token) || 0) + 1);

  const windowLength = Math.min(quoteTokens.length, sourceTokens.length);
  const windowCounts = new Map();
  let overlap = 0;
  let best = { overlap: -1, start: 0, end: windowLength - 1 };

  const add = (token) => {
    const previous = windowCounts.get(token) || 0;
    const allowed = quoteCounts.get(token) || 0;
    if (previous < allowed) overlap += 1;
    windowCounts.set(token, previous + 1);
  };
  const remove = (token) => {
    const previous = windowCounts.get(token) || 0;
    const allowed = quoteCounts.get(token) || 0;
    if (previous <= allowed) overlap -= 1;
    if (previous <= 1) windowCounts.delete(token);
    else windowCounts.set(token, previous - 1);
  };

  for (let index = 0; index < windowLength; index += 1) add(sourceTokens[index].value);
  best = { overlap, start: 0, end: windowLength - 1 };

  for (let start = 1; start + windowLength <= sourceTokens.length; start += 1) {
    remove(sourceTokens[start - 1].value);
    add(sourceTokens[start + windowLength - 1].value);
    if (overlap > best.overlap) {
      best = { overlap, start, end: start + windowLength - 1 };
    }
  }

  const startCharacter = sourceTokens[best.start].start;
  const endCharacter = sourceTokens[best.end].end;
  return {
    score: Number((best.overlap / Math.max(quoteTokens.length, windowLength)).toFixed(3)),
    sourceText: body.slice(startCharacter, endCharacter).replace(/\s+/g, ' ').trim(),
  };
}

function sourceReviewStatus(metadata) {
  const sourceReview = asObject(asObject(metadata).source_review);
  return ['pending', 'approved', 'changes_requested'].includes(sourceReview.status)
    ? sourceReview.status
    : null;
}

function isPrivatePersonSource(metadata) {
  return asObject(metadata).created_via === 'private_person_ledger';
}

function sourceFingerprint(transcript) {
  return sha256(JSON.stringify({
    transcript_content: transcript.transcript_content || transcript.content || '',
    source_video_url: transcript.source_video_url || null,
    audio_url: transcript.audio_url || null,
    media_asset_id: transcript.media_asset_id || null,
  }));
}

function sourceReviewReady(transcript) {
  if (!isPrivatePersonSource(transcript.metadata)) {
    return { ready: true, reason: 'not_private_person_source' };
  }

  const review = asObject(asObject(transcript.metadata).source_review);
  if (review.status !== 'approved' || review.source_fingerprint !== sourceFingerprint(transcript)) {
    return { ready: false, reason: 'source_review_required' };
  }
  if (transcript.requires_elder_review === true && !transcript.elder_reviewed_at) {
    return { ready: false, reason: 'authority_review_required' };
  }
  return { ready: true, reason: 'ready' };
}

function ownerConsentFor(storyteller, profileById) {
  if (!storyteller?.profile_id) {
    return { hasLinkedProfile: false, profileConsent: null };
  }
  const profile = profileById.get(storyteller.profile_id);
  if (!profile) {
    return { hasLinkedProfile: true, profileConsent: null, lookupMissing: true };
  }
  return {
    hasLinkedProfile: true,
    profileConsent: profile.ai_processing_consent,
  };
}

function hasAnalysisConsent(transcript, ownerConsent) {
  if (transcript.ai_processing_consent === false) return false;
  if (transcript.processing_consent === false) return false;
  if (transcript.ai_analysis_allowed === false) return false;
  if (ownerConsent.hasLinkedProfile) return ownerConsent.profileConsent === true;
  return transcript.ai_processing_consent === true;
}

function metadataSource(metadata) {
  const object = asObject(metadata);
  return normalise(object.source || object.import_source || object.source_system || '');
}

function sourceClass(transcript, sameBodyTranscripts) {
  const body = contentOf(transcript);
  const hasSourceMedia = Boolean(
    transcript.source_video_url ||
    transcript.audio_url ||
    transcript.video_url ||
    transcript.media_asset_id
  );
  const backup = metadataSource(transcript.metadata).includes('airtable-backup');
  const hasNonBackupTwin = sameBodyTranscripts.some((candidate) =>
    candidate.id !== transcript.id && !metadataSource(candidate.metadata).includes('airtable-backup')
  );

  if (!body.trim()) return 'empty_record';
  if (body.trim().length < 200) return 'excerpt_only';
  if (backup && hasNonBackupTwin) return 'copied_duplicate';
  if (backup) return 'imported_copy_unverified';
  if (hasSourceMedia) return 'source_media_linked';
  return 'text_record_only';
}

function transcriptSourceRank(classification) {
  return {
    source_media_linked: 5,
    text_record_only: 4,
    imported_copy_unverified: 3,
    excerpt_only: 2,
    copied_duplicate: 1,
    empty_record: 0,
  }[classification] ?? 0;
}

function extractMetadataName(metadata) {
  const object = asObject(metadata);
  const candidates = [
    object.storyteller_name,
    object.interviewee,
    object.speaker_name,
    object.person_name,
    object.name,
  ];
  return candidates.find((value) => typeof value === 'string' && value.trim()) || null;
}

function quoteText(value) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  return value.text || value.quote || value.content || value.verbatim || '';
}

function themeName(value) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  return value.name || value.theme || value.label || value.title || '';
}

async function elGet(table, query) {
  const response = await fetch(`${EL_URL}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      Prefer: 'count=exact',
      Range: '0-4999',
    },
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Empathy Ledger ${table} read failed: ${response.status} ${detail.slice(0, 300)}`);
  }
  return response.json();
}

function csvCell(value) {
  if (value === null || value === undefined) return '';
  const string = typeof value === 'string' ? value : JSON.stringify(value);
  return `"${string.replace(/"/g, '""')}"`;
}

function writeCsv(filePath, rows) {
  const columns = [
    'name',
    'community',
    'location',
    'date_recorded',
    'consent_tier',
    'goods_status',
    'transcript_id',
    'transcript_title',
    'project',
    'organization',
    'source_class',
    'ai_eligible',
    'ai_blockers',
    'themes',
    'quotes',
    'highlight',
    'conflicts',
  ];
  const output = [
    columns.map(csvCell).join(','),
    ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(',')),
  ].join('\n');
  fs.writeFileSync(filePath, `${output}\n`);
}

console.log('Pulling Empathy Ledger provenance data (read-only).');

const [
  storytellers,
  profiles,
  transcripts,
  projects,
  organizations,
  locations,
  projectStorytellers,
  analysisResults,
] = await Promise.all([
  elGet('storytellers', 'select=id,profile_id,display_name,cultural_background,location,tags,organization_id,is_active,content_status,deleted_at&limit=5000'),
  elGet('profiles', 'select=id,display_name,full_name,ai_processing_consent,allow_ai_analysis,requires_elder_review,traditional_country,language_group,location,geographic_connections&limit=5000'),
  elGet('transcripts', 'select=id,title,transcript_content,content,text,formatted_text,recording_date,created_at,updated_at,transcript_type,status,project_id,organization_id,story_id,location_id,storyteller_id,ai_processing_consent,processing_consent,ai_analysis_allowed,ai_processing_status,privacy_level,source_video_url,audio_url,video_url,media_asset_id,metadata,consent_withdrawn_at,requires_elder_review,elder_reviewed_at,deleted_at&deleted_at=is.null&limit=5000'),
  elGet('projects', 'select=id,name,slug,organization_id,location,start_date,end_date,status&limit=5000'),
  elGet('organizations', 'select=id,name,slug,location,traditional_country,language_groups&limit=5000'),
  elGet('locations', 'select=id,name,city,state,country&limit=5000'),
  elGet('project_storytellers', 'select=project_id,storyteller_id,status&limit=5000'),
  elGet('transcript_analysis_results', 'select=id,transcript_id,analyzer_version,themes,quotes,summary,metadata,requires_elder_review,cultural_sensitivity_level,quarantined_at,hidden_by_storyteller_at,created_at,updated_at&limit=5000'),
]);

const storytellerById = new Map(storytellers.map((row) => [row.id, row]));
const profileById = new Map(profiles.map((row) => [row.id, row]));
const projectById = new Map(projects.map((row) => [row.id, row]));
const organizationById = new Map(organizations.map((row) => [row.id, row]));
const locationById = new Map(locations.map((row) => [row.id, row]));
const goodsProject = projectById.get(GOODS_PROJECT_ID);
const goodsOrganizationId = goodsProject?.organization_id || null;
const goodsRosterIds = new Set(
  projectStorytellers
    .filter((row) => row.project_id === GOODS_PROJECT_ID && row.status !== 'inactive')
    .map((row) => row.storyteller_id)
);

const registryByNormalisedName = new Map();
for (const record of STORYTELLER_REGISTRY) {
  for (const name of [record.name, ...(record.aliases || [])]) {
    registryByNormalisedName.set(normaliseName(name), record);
  }
}

function registryForStoryteller(storyteller) {
  return registryByNormalisedName.get(normaliseName(storyteller?.display_name)) || null;
}

const transcriptBodies = new Map(transcripts.map((transcript) => [transcript.id, contentOf(transcript)]));
const transcriptsByHash = new Map();
for (const transcript of transcripts) {
  const body = transcriptBodies.get(transcript.id);
  if (!body) continue;
  const hash = sha256(normalise(body));
  const group = transcriptsByHash.get(hash) || [];
  group.push(transcript);
  transcriptsByHash.set(hash, group);
}

const latestAnalysisByTranscript = new Map();
for (const result of analysisResults) {
  const previous = latestAnalysisByTranscript.get(result.transcript_id);
  if (!previous || String(result.updated_at || result.created_at) > String(previous.updated_at || previous.created_at)) {
    latestAnalysisByTranscript.set(result.transcript_id, result);
  }
}

const transcriptAssessments = new Map();

for (const transcript of transcripts) {
  const body = transcriptBodies.get(transcript.id);
  const storyteller = storytellerById.get(transcript.storyteller_id) || null;
  const project = projectById.get(transcript.project_id) || null;
  const organization = organizationById.get(transcript.organization_id) || null;
  const location = locationById.get(transcript.location_id) || null;
  const registryRecord = registryForStoryteller(storyteller);
  const combinedLocationText = [
    body,
    transcript.title,
    storyteller?.location,
    project?.location,
    organization?.location,
    location?.name,
    location?.city,
  ].filter(Boolean).join('\n');
  const goodsTerms = findTerms(`${transcript.title || ''}\n${body}`, GOODS_TERMS);
  const goodsContextTerms = findTerms(`${transcript.title || ''}\n${body}`, GOODS_CONTEXT_TERMS);
  const locationTerms = findTerms(combinedLocationText, LOCATION_TERMS);
  const tripWindow = tripWindowFor(transcript.recording_date);
  const linkedToGoodsProject = transcript.project_id === GOODS_PROJECT_ID;
  const linkedToGoodsOrganization = Boolean(goodsOrganizationId && transcript.organization_id === goodsOrganizationId);
  const linkedToGoodsRoster = Boolean(transcript.storyteller_id && goodsRosterIds.has(transcript.storyteller_id));
  const bodyHash = body ? sha256(normalise(body)) : null;
  const sameBody = bodyHash ? transcriptsByHash.get(bodyHash) || [] : [];
  const classification = sourceClass(transcript, sameBody);
  const ownerConsent = ownerConsentFor(storyteller, profileById);
  const reviewGate = sourceReviewReady(transcript);
  const consentOk = hasAnalysisConsent(transcript, ownerConsent);
  const aiBlockers = [];
  if (transcript.consent_withdrawn_at) aiBlockers.push('consent_withdrawn');
  if (!consentOk) aiBlockers.push('analysis_consent_missing_or_refused');
  if (!reviewGate.ready) aiBlockers.push(reviewGate.reason);
  if (body.length < 100) aiBlockers.push('transcript_too_short');
  if (classification === 'copied_duplicate') aiBlockers.push('duplicate_copy');
  if (classification === 'imported_copy_unverified') aiBlockers.push('source_provenance_unverified');
  if (ownerConsent.lookupMissing) aiBlockers.push('linked_profile_missing');

  const registryQuoteChecks = (registryRecord?.quotes || []).map((quote) => ({
    text: quote.text,
    status: quote.status,
    exact: exactQuoteSupport(body, quote.text),
    editedJoin: !exactQuoteSupport(body, quote.text) && editedQuoteSupport(body, quote.text),
  }));
  const matchedRegistryQuotes = registryQuoteChecks.filter((quote) => quote.exact || quote.editedJoin);

  const candidateReasons = [];
  if (linkedToGoodsProject) candidateReasons.push('goods_project_link');
  if (linkedToGoodsOrganization) candidateReasons.push('goods_organization_link');
  if (linkedToGoodsRoster) candidateReasons.push('goods_roster_link');
  if (registryRecord) candidateReasons.push('current_goods_registry');
  for (const term of goodsTerms) candidateReasons.push(`full_text:${term}`);
  if (tripWindow && locationTerms.length) {
    candidateReasons.push(`trip_window:${tripWindow}`);
    for (const term of locationTerms) candidateReasons.push(`location:${term}`);
  }
  if (matchedRegistryQuotes.length) candidateReasons.push('current_pitch_quote_match');

  const latestAnalysis = latestAnalysisByTranscript.get(transcript.id) || null;
  const analysisQuotes = Array.isArray(latestAnalysis?.quotes) ? latestAnalysis.quotes : [];
  const supportedAnalysisQuotes = analysisQuotes
    .map((quote) => quoteText(quote))
    .filter(Boolean)
    .map((quote) => ({ text: quote, exact: exactQuoteSupport(body, quote) }));
  const supportedThemes = Array.isArray(latestAnalysis?.themes)
    ? latestAnalysis.themes.map(themeName).filter(Boolean)
    : [];

  let automatedGoodsStatus = 'not_a_candidate';
  if (candidateReasons.length) {
    const productEvidence = goodsTerms.length > 0 || goodsContextTerms.length > 0 || matchedRegistryQuotes.length > 0;
    if ((linkedToGoodsProject || linkedToGoodsOrganization) && productEvidence) {
      automatedGoodsStatus = 'strong_candidate';
    } else if (linkedToGoodsProject || linkedToGoodsOrganization || linkedToGoodsRoster || registryRecord) {
      automatedGoodsStatus = 'review_required';
    } else if (goodsTerms.length && organization && /orange sky/i.test(organization.name || '')) {
      automatedGoodsStatus = 'probable_mismatch';
    } else {
      automatedGoodsStatus = 'review_required';
    }
  }

  transcriptAssessments.set(transcript.id, {
    transcriptId: transcript.id,
    title: transcript.title || null,
    storytellerId: transcript.storyteller_id || null,
    storytellerName: storyteller?.display_name || extractMetadataName(transcript.metadata) || null,
    projectId: transcript.project_id || null,
    project: project?.name || null,
    organizationId: transcript.organization_id || null,
    organization: organization?.name || null,
    locationRecord: location ? unique([location.name, location.city]).join(', ') : null,
    recordingDate: transcript.recording_date || null,
    tripWindow,
    detectedLocations: locationTerms,
    detectedGoodsTerms: goodsTerms,
    detectedGoodsContextTerms: goodsContextTerms,
    candidateReasons: unique(candidateReasons),
    automatedGoodsStatus,
    sourceClass: classification,
    contentHash: bodyHash,
    characterCount: body.length,
    sourceMedia: {
      mediaAssetId: transcript.media_asset_id || null,
      hasAudio: Boolean(transcript.audio_url),
      hasVideo: Boolean(transcript.source_video_url || transcript.video_url),
    },
    copiedFromTranscriptIds: classification === 'copied_duplicate'
      ? sameBody.filter((candidate) => candidate.id !== transcript.id).map((candidate) => candidate.id)
      : [],
    ai: {
      eligible: aiBlockers.length === 0,
      blockers: aiBlockers,
      ownerProfileConsent: ownerConsent.profileConsent,
      sourceReviewStatus: sourceReviewStatus(transcript.metadata),
      processingStatus: transcript.ai_processing_status || null,
    },
    currentRegistryQuoteChecks: registryQuoteChecks,
    latestAnalysis: latestAnalysis ? {
      id: latestAnalysis.id,
      analyzerVersion: latestAnalysis.analyzer_version,
      createdAt: latestAnalysis.created_at,
      themes: supportedThemes,
      quotes: supportedAnalysisQuotes,
      allQuotesExact: supportedAnalysisQuotes.length > 0 && supportedAnalysisQuotes.every((quote) => quote.exact),
      quarantined: Boolean(latestAnalysis.quarantined_at),
      hiddenByStoryteller: Boolean(latestAnalysis.hidden_by_storyteller_at),
    } : null,
  });
}

const people = new Map();

function ensurePerson(key, seed) {
  if (!people.has(key)) {
    people.set(key, {
      key,
      storytellerId: seed.storytellerId || null,
      storytellerIds: seed.storytellerId ? [seed.storytellerId] : [],
      name: seed.name || null,
      registry: seed.registry || null,
      transcripts: [],
      mentionOnlyTranscriptIds: [],
    });
  } else if (seed.storytellerId) {
    const person = people.get(key);
    person.storytellerIds = unique([...person.storytellerIds, seed.storytellerId]);
    person.storytellerId ||= seed.storytellerId;
  }
  return people.get(key);
}

for (const assessment of transcriptAssessments.values()) {
  if (!assessment.candidateReasons.length) continue;
  const storyteller = storytellerById.get(assessment.storytellerId) || null;
  const registryRecord = registryForStoryteller(storyteller);
  const key = registryRecord
    ? `registry:${registryRecord.slug}`
    : assessment.storytellerId || `unresolved:${assessment.transcriptId}`;
  ensurePerson(key, {
    storytellerId: assessment.storytellerId,
    name: assessment.storytellerName || `Unresolved source ${assessment.transcriptId}`,
    registry: registryRecord,
  }).transcripts.push(assessment);
}

// A transcript can be linked to one person while explicitly naming another.
// Add those people as mention-only candidates so cross-project evidence is not
// lost behind the transcript's primary storyteller relation.
for (const transcript of transcripts) {
  const body = transcriptBodies.get(transcript.id);
  const assessment = transcriptAssessments.get(transcript.id);
  if (!assessment || assessment.automatedGoodsStatus === 'not_a_candidate') continue;

  for (const record of STORYTELLER_REGISTRY) {
    const names = [record.name, ...(record.aliases || [])];
    if (!names.some((name) => matchesTerm(body, name))) continue;

    const linkedStoryteller = storytellers.find((row) =>
      [row.display_name].some((name) => names.some((candidate) => normaliseName(name) === normaliseName(candidate)))
    );
    const key = `registry:${record.slug}`;
    const person = ensurePerson(key, {
      storytellerId: linkedStoryteller?.id || null,
      name: record.name,
      registry: record,
    });
    if (assessment.storytellerId !== linkedStoryteller?.id) {
      person.mentionOnlyTranscriptIds.push(transcript.id);
    }
  }
}

// Keep every current registry person visible, including missing-transcript gaps.
for (const record of STORYTELLER_REGISTRY) {
  const linkedStoryteller = storytellers.find((row) =>
    [record.name, ...(record.aliases || [])].some((name) => normaliseName(name) === normaliseName(row.display_name))
  );
  const key = `registry:${record.slug}`;
  ensurePerson(key, {
    storytellerId: linkedStoryteller?.id || null,
    name: record.name,
    registry: record,
  });
}

const personRecords = [];

for (const person of people.values()) {
  const registry = person.registry;
  const uniqueTranscripts = person.transcripts
    .filter((transcript, index, array) => array.findIndex((candidate) => candidate.transcriptId === transcript.transcriptId) === index)
    .sort((a, b) => {
      const rank = transcriptSourceRank(b.sourceClass) - transcriptSourceRank(a.sourceClass);
      if (rank !== 0) return rank;
      return String(a.recordingDate || '9999').localeCompare(String(b.recordingDate || '9999'));
    });
  const canonical = uniqueTranscripts.find((transcript) => transcript.sourceClass !== 'copied_duplicate') || uniqueTranscripts[0] || null;
  const linkedStoryteller = storytellerById.get(person.storytellerId) || null;
  const substantiveTranscripts = uniqueTranscripts.filter((transcript) =>
    transcript.sourceClass !== 'copied_duplicate' && transcript.sourceClass !== 'excerpt_only'
  );
  const transcriptLocations = unique(substantiveTranscripts.flatMap((transcript) => transcript.detectedLocations));
  const transcriptDates = unique(substantiveTranscripts.map((transcript) => transcript.recordingDate));
  const registryCommunity = registry?.community || null;
  const communitySupportedByTranscript = registryCommunity
    ? transcriptLocations.some((location) =>
        matchesTerm(registryCommunity, location) || matchesTerm(location, registryCommunity)
      )
    : false;
  const quoteChecks = uniqueTranscripts.flatMap((transcript) =>
    transcript.currentRegistryQuoteChecks.map((quote) => ({ ...quote, transcriptId: transcript.transcriptId }))
  );
  const registryQuotes = registry?.quotes || [];
  const quoteConflicts = registryQuotes
    .filter((quote) => quote.status !== 'hold')
    .filter((quote) => !quoteChecks.some((check) => check.text === quote.text && (check.exact || check.editedJoin)))
    .map((quote) => ({
      type: 'pitch_quote_not_found_in_matched_transcripts',
      quote: quote.text,
      status: quote.status,
    }));
  const conflicts = [...quoteConflicts];
  if (registryCommunity && uniqueTranscripts.length && !communitySupportedByTranscript) {
    conflicts.push({
      type: 'registry_community_not_confirmed_by_transcript',
      registryCommunity,
      detectedTranscriptLocations: transcriptLocations,
    });
  }
  if (registry?.tier === 'external' && uniqueTranscripts.some((transcript) =>
    transcript.ai.blockers.includes('analysis_consent_missing_or_refused')
  )) {
    conflicts.push({
      type: 'external_registry_tier_but_ai_analysis_not_authorised',
    });
  }
  if (transcriptDates.length > 1) {
    conflicts.push({
      type: 'multiple_recording_dates',
      dates: transcriptDates,
    });
  }

  const statuses = unique(uniqueTranscripts.map((transcript) => transcript.automatedGoodsStatus));
  let goodsStatus = 'missing_transcript';
  if (statuses.includes('strong_candidate')) goodsStatus = 'strong_candidate';
  else if (statuses.includes('review_required')) goodsStatus = 'review_required';
  else if (statuses.includes('probable_mismatch')) goodsStatus = 'probable_mismatch';

  const analysisTranscript = uniqueTranscripts.find((transcript) => transcript.ai.eligible) || null;
  const latestAnalysis = analysisTranscript?.latestAnalysis || canonical?.latestAnalysis || null;
  const exactAnalysisQuotes = (latestAnalysis?.quotes || []).filter((quote) => quote.exact).map((quote) => quote.text);

  personRecords.push({
    storytellerId: person.storytellerId,
    storytellerIds: person.storytellerIds,
    name: registry?.name || person.name,
    community: communitySupportedByTranscript
      ? transcriptLocations.find((location) =>
          matchesTerm(registryCommunity, location) || matchesTerm(location, registryCommunity)
        ) || null
      : null,
    location: canonical?.locationRecord || (canonical?.detectedLocations.length === 1 ? canonical.detectedLocations[0] : null),
    dateRecorded: canonical?.recordingDate || null,
    consentTier: registry?.tier || null,
    goodsStatus,
    canonicalTranscriptId: canonical?.transcriptId || null,
    canonicalTranscriptTitle: canonical?.title || null,
    canonicalSourceClass: canonical?.sourceClass || null,
    transcriptIds: uniqueTranscripts.map((transcript) => transcript.transcriptId),
    mentionOnlyTranscriptIds: unique(person.mentionOnlyTranscriptIds),
    candidateReasons: unique(uniqueTranscripts.flatMap((transcript) => transcript.candidateReasons)),
    transcriptLocations,
    recordingDates: transcriptDates,
    ai: {
      eligibleTranscriptId: analysisTranscript?.transcriptId || null,
      blockers: analysisTranscript ? [] : canonical?.ai.blockers || [],
      allTranscriptBlockers: unique(uniqueTranscripts.flatMap((transcript) => transcript.ai.blockers)),
      existingAnalyzerVersion: latestAnalysis?.analyzerVersion || null,
      existingAnalysisId: latestAnalysis?.id || null,
    },
    synthesis: latestAnalysis ? {
      status: 'existing_unapproved_model_output',
      themes: (latestAnalysis.themes || []).slice(0, 5),
      quotes: exactAnalysisQuotes,
      highlight: exactAnalysisQuotes[0] || null,
    } : {
      status: analysisTranscript ? 'eligible_not_run' : 'blocked',
      themes: [],
      quotes: [],
      highlight: null,
    },
    conflicts,
    transcripts: uniqueTranscripts,
  });
}

personRecords.sort((a, b) => String(a.name).localeCompare(String(b.name)));

const strongCandidates = personRecords.filter((person) => person.goodsStatus === 'strong_candidate');
const reviewQueue = personRecords.filter((person) => person.goodsStatus === 'review_required');
const probableMismatches = personRecords.filter((person) => person.goodsStatus === 'probable_mismatch');
const missingTranscripts = personRecords.filter((person) => person.goodsStatus === 'missing_transcript');
const aiEligible = personRecords.filter((person) => person.ai.eligibleTranscriptId);

const currentPitchAudit = CURRENT_PITCH_VOICE_NAMES.map((name) => {
  const person = personRecords.find((candidate) => normaliseName(candidate.name) === normaliseName(name));
  const registry = STORYTELLER_REGISTRY.find((candidate) => normaliseName(candidate.name) === normaliseName(name));
  const leadQuote = registry?.quotes.find((quote) => quote.status === 'primary')
    || registry?.quotes.find((quote) => quote.status === 'approved')
    || null;

  if (!person || !leadQuote) {
    return {
      name,
      status: 'missing_person_or_pitch_quote',
      conflict: true,
    };
  }

  const matches = person.transcripts.map((transcript) => {
    const body = transcriptBodies.get(transcript.transcriptId) || '';
    return {
      transcriptId: transcript.transcriptId,
      transcriptTitle: transcript.title,
      project: transcript.project,
      sourceClass: transcript.sourceClass,
      recordingDate: transcript.recordingDate,
      exact: exactQuoteSupport(body, leadQuote.text),
      editedJoin: editedQuoteSupport(body, leadQuote.text),
      closest: closestQuoteMatch(body, leadQuote.text),
    };
  }).sort((a, b) => {
    if (a.exact !== b.exact) return a.exact ? -1 : 1;
    if (a.editedJoin !== b.editedJoin) return a.editedJoin ? -1 : 1;
    return (b.closest?.score || 0) - (a.closest?.score || 0);
  });

  const best = matches[0] || null;
  const exact = Boolean(best?.exact);
  const quoteStatus = exact
    ? 'exact_verbatim'
    : best?.editedJoin
      ? 'edited_join'
      : best
        ? 'wording_differs'
        : 'no_transcript';
  const anyGoodsProjectTranscript = person.transcripts.some((transcript) => transcript.projectId === GOODS_PROJECT_ID);
  const projectMismatch = Boolean(best && best.project && best.project !== goodsProject?.name && !anyGoodsProjectTranscript);

  return {
    name,
    consentTier: person.consentTier,
    pitchQuote: leadQuote.text,
    quoteStatus,
    conflict: quoteStatus !== 'exact_verbatim' || projectMismatch,
    bestTranscriptMatch: best,
    hasSourceMediaLinkedTranscript: person.transcripts.some((transcript) => transcript.sourceClass === 'source_media_linked'),
    hasGoodsProjectTranscript: anyGoodsProjectTranscript,
    projectMismatch,
    canonicalFacts: {
      community: person.community,
      location: person.location,
      dateRecorded: best?.recordingDate || person.dateRecorded,
    },
  };
});

const currentPitchConflicts = currentPitchAudit.filter((voice) => voice.conflict);

const registryImport = personRecords
  .filter((person) => person.goodsStatus === 'strong_candidate')
  .map((person) => ({
    name: person.name,
    community: person.community,
    location: person.location,
    dateRecorded: person.dateRecorded,
    consentTier: person.consentTier,
    transcriptId: person.canonicalTranscriptId,
    themes: person.synthesis.themes,
    quotes: person.synthesis.quotes,
    highlight: person.synthesis.highlight,
    provenance: {
      sourceClass: person.canonicalSourceClass,
      goodsStatus: person.goodsStatus,
      humanReviewRequired: true,
      conflicts: person.conflicts,
    },
  }));

const artifact = {
  schemaVersion: 'goods-storyteller-provenance.v1',
  generatedAt: new Date().toISOString(),
  source: {
    system: 'Empathy Ledger',
    projectId: GOODS_PROJECT_ID,
    projectName: goodsProject?.name || null,
    readOnly: true,
  },
  policy: {
    projectTagTrustedAsCompleteRoster: false,
    transcriptRequiredForCanonicalFacts: true,
    aiOptInRequired: true,
    profileConsentOverridesTranscriptFlag: true,
    bulkAnalysisBypassesConsent: false,
    modelOutputIsApproval: false,
  },
  search: {
    locations: LOCATION_TERMS,
    tripWindows: TRIP_WINDOWS,
    fullTextTerms: GOODS_TERMS,
  },
  summary: {
    transcriptsRead: transcripts.length,
    storytellersRead: storytellers.length,
    currentRegistryPeople: STORYTELLER_REGISTRY.length,
    peopleInAudit: personRecords.length,
    strongCandidates: strongCandidates.length,
    reviewRequired: reviewQueue.length,
    probableMismatches: probableMismatches.length,
    missingTranscripts: missingTranscripts.length,
    aiEligiblePeople: aiEligible.length,
    currentPitchVoices: currentPitchAudit.length,
    currentPitchVoicesWithSourceMedia: currentPitchAudit.filter((voice) => voice.hasSourceMediaLinkedTranscript).length,
    currentPitchExactVerbatimQuotes: currentPitchAudit.filter((voice) => voice.quoteStatus === 'exact_verbatim').length,
    currentPitchConflicts: currentPitchConflicts.length,
    duplicateCopies: [...transcriptAssessments.values()].filter((row) => row.sourceClass === 'copied_duplicate').length,
    importedCopiesWithoutCanonicalTwin: [...transcriptAssessments.values()].filter((row) => row.sourceClass === 'imported_copy_unverified').length,
  },
  strongCandidates,
  reviewQueue,
  probableMismatches,
  missingTranscripts,
  currentPitchAudit,
  currentPitchConflicts,
  registryImport,
};

fs.mkdirSync(path.dirname(OUTPUT_BASE), { recursive: true });
fs.writeFileSync(`${OUTPUT_BASE}.json`, `${JSON.stringify(artifact, null, 2)}\n`);

const csvRows = personRecords.map((person) => ({
  name: person.name,
  community: person.community,
  location: person.location,
  date_recorded: person.dateRecorded,
  consent_tier: person.consentTier,
  goods_status: person.goodsStatus,
  transcript_id: person.canonicalTranscriptId,
  transcript_title: person.canonicalTranscriptTitle,
  project: person.transcripts.find((transcript) => transcript.transcriptId === person.canonicalTranscriptId)?.project || null,
  organization: person.transcripts.find((transcript) => transcript.transcriptId === person.canonicalTranscriptId)?.organization || null,
  source_class: person.canonicalSourceClass,
  ai_eligible: Boolean(person.ai.eligibleTranscriptId),
  ai_blockers: person.ai.blockers,
  themes: person.synthesis.themes,
  quotes: person.synthesis.quotes,
  highlight: person.synthesis.highlight,
  conflicts: person.conflicts,
}));
writeCsv(`${OUTPUT_BASE}.csv`, csvRows);

console.log(JSON.stringify({
  output: [`${OUTPUT_BASE}.json`, `${OUTPUT_BASE}.csv`],
  ...artifact.summary,
}, null, 2));
