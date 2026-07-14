#!/usr/bin/env node
/**
 * READ-ONLY: broad funding opportunity sweep for Goods on Country.
 *
 * Runs lane-specific "agents" from v2/data/funding-sweep-sources.json:
 * government grants, Indigenous/business loans, impact finance, philanthropy,
 * buyer finance, equipment/circular-economy/clean-energy.
 *
 * Writes timestamped JSON, CSV and Markdown outputs under wiki/outputs/funding-sweep.
 * It does not write to Notion, GoHighLevel, Supabase, Gmail, or any external system.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const V2_DIR = path.dirname(SCRIPT_DIR);
const ROOT_DIR = path.dirname(V2_DIR);
const CONFIG_PATH = path.join(V2_DIR, 'data/funding-sweep-sources.json');

const args = parseArgs(process.argv.slice(2));
const maxResults = intArg('max-results', 120);
const maxPages = intArg('max-pages', 80);
const queryLimit = intArg('query-limit', 36);
const noWeb = Boolean(args['no-web']);
const outDir = path.resolve(ROOT_DIR, args['out-dir'] || 'wiki/outputs/funding-sweep');
const runDate = darwinDate();
const runStamp = new Date().toISOString();
const userAgent = 'GoodsFundingSweep/0.1 (+https://goods.place; benjamin@act.place)';

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const seenFetches = new Map();
const accessIssues = [];

function parseArgs(raw) {
  const parsed = {};
  for (const arg of raw) {
    if (!arg.startsWith('--')) continue;
    const body = arg.slice(2);
    const idx = body.indexOf('=');
    if (idx === -1) parsed[body] = true;
    else parsed[body.slice(0, idx)] = body.slice(idx + 1);
  }
  return parsed;
}

function intArg(name, fallback) {
  const value = Number(args[name]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function darwinDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Darwin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const byType = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanText(value) {
  return decodeHtml(String(value || ''))
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function hostOf(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function normalizeUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_|ref|source)/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString().replace(/\/$/, '');
  } catch {
    return String(rawUrl || '').trim();
  }
}

function absolutizeUrl(href, baseUrl) {
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return null;
  try {
    let raw = decodeHtml(href);
    if (raw.startsWith('//')) raw = `https:${raw}`;
    const resolved = new URL(raw, baseUrl);
    if (resolved.hostname.includes('duckduckgo.com') && resolved.pathname.startsWith('/l/')) {
      const uddg = resolved.searchParams.get('uddg');
      if (uddg) return normalizeUrl(uddg);
    }
    if (!/^https?:$/.test(resolved.protocol)) return null;
    return normalizeUrl(resolved.toString());
  } catch {
    return null;
  }
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? cleanText(match[1]).replace(/\s*[|-]\s*DuckDuckGo\s*$/i, '') : '';
}

function extractDescription(html) {
  const meta =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i) ||
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  return meta ? cleanText(meta[1]) : '';
}

function extractAnchors(html, baseUrl) {
  const anchors = [];
  const regex = /<a\b([^>]*?)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html))) {
    const hrefMatch = match[1].match(/\bhref=["']([^"']+)["']/i);
    const href = hrefMatch ? absolutizeUrl(hrefMatch[1], baseUrl) : null;
    const text = cleanText(match[2]);
    if (!href || !text || text.length < 3) continue;
    anchors.push({ title: text, url: href });
  }
  return anchors;
}

function bodySnippet(html) {
  const text = cleanText(html);
  return text.length > 520 ? `${text.slice(0, 520).trim()}...` : text;
}

function titleFromUrl(url) {
  try {
    const parsed = new URL(url);
    const last = parsed.pathname.split('/').filter(Boolean).pop() || parsed.hostname;
    return decodeURIComponent(last).replace(/[-_]+/g, ' ').trim();
  } catch {
    return url;
  }
}

function isLikelyFundingLink(candidate, lane) {
  const text = `${candidate.title} ${candidate.url} ${lane.label}`.toLowerCase();
  const keepers = [
    'grant',
    'funding',
    'finance',
    'loan',
    'investment',
    'program',
    'opportunity',
    'application',
    'apply',
    'tender',
    'procurement',
    'foundation',
    'philanthropy',
    'social enterprise',
    'indigenous',
    'first nations',
    'aboriginal',
    'remote',
    'manufacturing',
    'circular',
    'clean energy',
    'equipment',
  ];
  if (keepers.some((word) => text.includes(word))) return true;
  return false;
}

async function fetchPage(url) {
  const normalized = normalizeUrl(url);
  if (seenFetches.has(normalized)) return seenFetches.get(normalized);
  const promise = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 18000);
    try {
      const res = await fetch(normalized, {
        headers: {
          'User-Agent': userAgent,
          Accept: 'text/html,application/xhtml+xml,application/xml,text/plain,application/json;q=0.9,*/*;q=0.2',
        },
        redirect: 'follow',
        signal: controller.signal,
      });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok) {
        return { ok: false, url: normalized, status: res.status, reason: `HTTP ${res.status}` };
      }
      if (!/(text|html|xml|json)/i.test(contentType)) {
        return { ok: false, url: normalized, status: res.status, reason: `Skipped non-text content: ${contentType || 'unknown content type'}` };
      }
      const text = await res.text();
      return { ok: true, url: normalized, status: res.status, contentType, text: text.slice(0, 1_500_000) };
    } catch (error) {
      return { ok: false, url: normalized, status: 0, reason: error.name === 'AbortError' ? 'Request timed out' : error.message };
    } finally {
      clearTimeout(timer);
    }
  })();
  seenFetches.set(normalized, promise);
  return promise;
}

function candidateFromPage(url, html, lane, foundVia) {
  const title = extractTitle(html) || titleFromUrl(url);
  const description = extractDescription(html);
  return buildCandidate({
    title,
    url,
    snippet: description || bodySnippet(html),
    source: hostOf(url),
    lane,
    foundVia,
  });
}

function buildCandidate(input) {
  const amountHint = extractAmountHint(input);
  const dueDateHint = extractDueDateHint(input);
  const geographyHint = extractGeographyHint(input);
  const entityHint = extractEntityHint(input);
  const statusHint = extractStatusHint(input, dueDateHint);
  const score = scoreCandidate(input, input.lane, statusHint);
  const riskFlags = extractRiskFlags(input, { amountHint, dueDateHint, entityHint, statusHint });
  const whyGoods = score.matchedTerms.length
    ? `Matched: ${score.matchedTerms.slice(0, 8).join(', ')}`
    : 'Needs manual fit check.';

  return {
    title: cleanText(input.title) || titleFromUrl(input.url),
    url: normalizeUrl(input.url),
    source: input.source || hostOf(input.url),
    laneId: input.lane.id,
    lane: input.lane.label,
    score: score.score,
    scoreReasons: score.reasons,
    matchedTerms: score.matchedTerms,
    amountHint,
    dueDateHint,
    statusHint,
    geographyHint,
    entityHint,
    riskFlags,
    whyGoods,
    nextAction: input.lane.nextAction,
    foundVia: input.foundVia,
    snippet: cleanText(input.snippet).slice(0, 700),
    crmSuggestion: crmSuggestion(input.lane.id),
  };
}

function scoreCandidate(input, lane, statusHint) {
  const text = `${input.title} ${input.snippet} ${input.url}`.toLowerCase();
  const matchedTerms = [];
  const reasons = [];
  let score = lane.priority * 5;

  for (const term of config.missionProfile.strongSignals) {
    if (text.includes(term.toLowerCase())) {
      score += 6;
      matchedTerms.push(term);
    }
  }
  for (const term of config.missionProfile.fundingUses) {
    if (text.includes(term.toLowerCase())) {
      score += 4;
      matchedTerms.push(term);
    }
  }
  const laneTerms = lane.label.toLowerCase().split(/\W+/).filter((word) => word.length > 4);
  for (const term of laneTerms) {
    if (text.includes(term)) {
      score += 3;
      matchedTerms.push(term);
    }
  }
  if (/\$\s?[\d,.]+\s?(k|m|million|thousand)?/i.test(text)) {
    score += 4;
    reasons.push('amount mentioned');
  }
  if (/(close|closing|deadline|due|round|applications)/i.test(text)) {
    score += 4;
    reasons.push('date/application signal');
  }
  if (/\b(australia|australian|nt|qld|wa|sa|nsw|vic|tas|act)\b/i.test(text)) {
    score += 3;
    reasons.push('Australia signal');
  }
  const host = hostOf(input.url);
  if (host.endsWith('.gov.au') || host.endsWith('.org.au') || host.endsWith('.edu.au')) {
    score += 3;
    reasons.push('institutional source');
  }
  for (const term of config.missionProfile.negativeSignals) {
    if (text.includes(term.toLowerCase())) {
      score -= 14;
      reasons.push(`negative signal: ${term}`);
    }
  }
  if (/\/ga\/show\//i.test(input.url) || /\bgrant award\b|\baward view\b/i.test(text)) {
    score -= 22;
    reasons.push('award/result page, not a live opportunity');
  }
  if (/closed|past close date/i.test(statusHint)) {
    score -= 24;
    reasons.push(statusHint);
  } else if (/rolling|no set close/i.test(statusHint)) {
    score += 4;
    reasons.push(statusHint);
  }

  return {
    score: Math.max(0, score),
    matchedTerms: [...new Set(matchedTerms)],
    reasons,
  };
}

function extractAmountHint(candidate) {
  const text = `${candidate.title} ${candidate.snippet}`;
  const matches = [...text.matchAll(/\$\s?[\d,.]+(?:\s?(?:k|m|b|million|billion|thousand))?/gi)].map((m) => m[0]);
  return [...new Set(matches)].slice(0, 4).join('; ') || 'Unknown';
}

function extractDueDateHint(candidate) {
  const text = `${candidate.title}. ${candidate.snippet}`;
  if (/\b(?:no set closing date|no closing date|rolling|always open|open all year)\b/i.test(text)) {
    const rolling = text.match(/\b(?:no set closing date|no closing date|rolling|always open|open all year)[^.;\n]{0,80}/i);
    return cleanText(rolling?.[0] || 'Rolling / no set closing date');
  }
  if (/\b(?:applications closed|round closed|now closed|has closed|closed)\b/i.test(text)) return 'Closed';
  const explicit = text.match(
    /\b(?:closing date|deadline|due date|applications close|closes on|closes at|closes)\b[^.;\n]{0,100}(?:\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{2,4}|20\d{2})/i,
  );
  if (explicit) return cleanText(explicit[0]);
  const date = text.match(/\b(?:\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{2,4})\b/i);
  return date ? date[0] : 'Unknown';
}

function extractStatusHint(candidate, dueDateHint) {
  const text = `${candidate.title} ${candidate.snippet}`.toLowerCase();
  if (/\b(applications closed|round closed|now closed|has closed|closed)\b/i.test(text) || dueDateHint === 'Closed') {
    return 'Likely closed';
  }
  if (/\b(no set closing date|no closing date|rolling|always open|open all year)\b/i.test(dueDateHint)) {
    return 'Rolling / no set close';
  }
  if (dueDateHint !== 'Unknown') {
    const dueDate = parseLooseDate(dueDateHint);
    if (dueDate && dueDate.getTime() < new Date(`${runDate}T00:00:00+09:30`).getTime()) {
      return 'Likely past close date';
    }
    return 'Date found, verify live page';
  }
  return 'Unknown';
}

function parseLooseDate(text) {
  const value = String(text || '');
  const slash = value.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/);
  if (slash) {
    const year = slash[3].length === 2 ? `20${slash[3]}` : slash[3];
    return new Date(`${year}-${slash[2].padStart(2, '0')}-${slash[1].padStart(2, '0')}T00:00:00+09:30`);
  }
  const month = value.match(/\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+(20\d{2})\b/i);
  if (!month) return null;
  const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', sept: '09', oct: '10', nov: '11', dec: '12' };
  const mm = months[month[2].toLowerCase()];
  return new Date(`${month[3]}-${mm}-${month[1].padStart(2, '0')}T00:00:00+09:30`);
}

function extractGeographyHint(candidate) {
  const text = `${candidate.title} ${candidate.snippet}`.toLowerCase();
  const geographies = ['Northern Territory', 'Central Australia', 'Queensland', 'Western Australia', 'South Australia', 'remote', 'regional', 'national', 'Cape York', 'Arnhem Land', 'APY Lands', 'NPY Lands'];
  const matches = geographies.filter((geo) => text.includes(geo.toLowerCase()));
  return matches.length ? [...new Set(matches)].join('; ') : 'Unknown';
}

function extractEntityHint(candidate) {
  const text = `${candidate.title} ${candidate.snippet}`.toLowerCase();
  const hints = [];
  if (text.includes('not-for-profit') || text.includes('non-profit')) hints.push('NFP');
  if (text.includes('charity') || text.includes('charitable')) hints.push('Charity');
  if (text.includes('dgr')) hints.push('DGR');
  if (text.includes('aboriginal controlled') || text.includes('first nations-led') || text.includes('first nations led')) hints.push('First Nations-led/control');
  if (text.includes('business') || text.includes('company') || text.includes('enterprise')) hints.push('Business/social enterprise');
  return hints.length ? [...new Set(hints)].join('; ') : 'Unknown';
}

function extractRiskFlags(candidate, extracted) {
  const text = `${candidate.title} ${candidate.snippet}`.toLowerCase();
  const flags = [];
  for (const term of config.missionProfile.negativeSignals) {
    if (text.includes(term.toLowerCase())) flags.push(`Possible exclusion: ${term}`);
  }
  if (/closed|past close date/i.test(extracted.statusHint)) flags.push(extracted.statusHint);
  if (extracted.dueDateHint === 'Unknown') flags.push('Close date not found in sweep');
  if (extracted.entityHint === 'Unknown') flags.push('Eligibility entity not found in sweep');
  if (extracted.amountHint === 'Unknown') flags.push('Amount not found in sweep');
  return flags;
}

function crmSuggestion(laneId) {
  if (laneId === 'government_grants' || laneId === 'equipment_and_clean_energy') {
    return 'Notion Funder Pipeline + GHL Grants pipeline after manual eligibility check';
  }
  if (laneId === 'buyer_finance') return 'Notion Buyer/Demand register + GHL Buyer or Demand pipeline';
  return 'Notion Funder Pipeline + GHL Goods Supporter Journey, relationship-led';
}

async function searchDuckDuckGo(query, lane) {
  const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const page = await fetchPage(searchUrl);
  if (!page.ok) {
    accessIssues.push({ source: 'DuckDuckGo', lane: lane.id, url: searchUrl, issue: page.reason });
    return [];
  }
  const anchors = extractAnchors(page.text, searchUrl)
    .filter((a) => !hostOf(a.url).includes('duckduckgo.com'))
    .filter((a) => !/\b(images|videos|news|maps)\b/i.test(a.title))
    .slice(0, 12);
  return anchors.map((anchor) =>
    buildCandidate({
      title: anchor.title,
      url: anchor.url,
      snippet: '',
      source: hostOf(anchor.url),
      lane,
      foundVia: `search: ${query}`,
    }),
  );
}

function mergeCandidates(candidates) {
  const byKey = new Map();
  for (const candidate of candidates) {
    if (!candidate.url) continue;
    const key = normalizeUrl(candidate.url).toLowerCase() || candidate.title.toLowerCase();
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, { ...candidate, lanes: [candidate.lane], laneIds: [candidate.laneId] });
      continue;
    }
    existing.score = Math.max(existing.score, candidate.score);
    existing.matchedTerms = [...new Set([...existing.matchedTerms, ...candidate.matchedTerms])];
    existing.scoreReasons = [...new Set([...existing.scoreReasons, ...candidate.scoreReasons])];
    existing.riskFlags = [...new Set([...existing.riskFlags, ...candidate.riskFlags])];
    existing.lanes = [...new Set([...existing.lanes, candidate.lane])];
    existing.laneIds = [...new Set([...existing.laneIds, candidate.laneId])];
    if (existing.dueDateHint === 'Unknown' && candidate.dueDateHint !== 'Unknown') existing.dueDateHint = candidate.dueDateHint;
    if (existing.statusHint === 'Unknown' && candidate.statusHint !== 'Unknown') existing.statusHint = candidate.statusHint;
    if (existing.amountHint === 'Unknown' && candidate.amountHint !== 'Unknown') existing.amountHint = candidate.amountHint;
    if (existing.geographyHint === 'Unknown' && candidate.geographyHint !== 'Unknown') existing.geographyHint = candidate.geographyHint;
    if (existing.entityHint === 'Unknown' && candidate.entityHint !== 'Unknown') existing.entityHint = candidate.entityHint;
    if ((candidate.snippet || '').length > (existing.snippet || '').length) existing.snippet = candidate.snippet;
    existing.foundVia = [...new Set([existing.foundVia, candidate.foundVia].filter(Boolean).join(' | ').split(' | '))].join(' | ');
  }
  return [...byKey.values()].sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

async function scanSource(sourceUrl, lane) {
  const page = await fetchPage(sourceUrl);
  if (!page.ok) {
    accessIssues.push({ source: hostOf(sourceUrl), lane: lane.id, url: sourceUrl, issue: page.reason });
    return [];
  }
  const candidates = [candidateFromPage(page.url, page.text, lane, `source: ${sourceUrl}`)];
  for (const anchor of extractAnchors(page.text, page.url)) {
    if (!isLikelyFundingLink(anchor, lane)) continue;
    candidates.push(
      buildCandidate({
        title: anchor.title,
        url: anchor.url,
        snippet: '',
        source: hostOf(anchor.url),
        lane,
        foundVia: `source link: ${sourceUrl}`,
      }),
    );
  }
  return candidates;
}

async function enrichCandidates(candidates) {
  const enriched = [];
  let fetched = 0;
  for (const candidate of candidates) {
    if (fetched >= maxPages) {
      enriched.push(candidate);
      continue;
    }
    if (!/^https?:\/\//.test(candidate.url)) {
      enriched.push(candidate);
      continue;
    }
    fetched += 1;
    const lane = config.lanes.find((l) => l.id === candidate.laneIds?.[0] || l.id === candidate.laneId) || config.lanes[0];
    const page = await fetchPage(candidate.url);
    if (!page.ok) {
      if (!/Skipped non-text/.test(page.reason || '')) {
        accessIssues.push({ source: candidate.source, lane: candidate.laneId, url: candidate.url, issue: page.reason });
      }
      enriched.push(candidate);
      continue;
    }
    const pageCandidate = candidateFromPage(page.url, page.text, lane, candidate.foundVia);
    enriched.push({
      ...candidate,
      title: pageCandidate.title || candidate.title,
      source: pageCandidate.source || candidate.source,
      score: Math.max(candidate.score, pageCandidate.score),
      scoreReasons: [...new Set([...candidate.scoreReasons, ...pageCandidate.scoreReasons])],
      matchedTerms: [...new Set([...candidate.matchedTerms, ...pageCandidate.matchedTerms])],
      amountHint: pageCandidate.amountHint !== 'Unknown' ? pageCandidate.amountHint : candidate.amountHint,
      dueDateHint: pageCandidate.dueDateHint !== 'Unknown' ? pageCandidate.dueDateHint : candidate.dueDateHint,
      statusHint: pageCandidate.statusHint !== 'Unknown' ? pageCandidate.statusHint : candidate.statusHint,
      geographyHint: pageCandidate.geographyHint !== 'Unknown' ? pageCandidate.geographyHint : candidate.geographyHint,
      entityHint: pageCandidate.entityHint !== 'Unknown' ? pageCandidate.entityHint : candidate.entityHint,
      riskFlags: [...new Set([...candidate.riskFlags, ...pageCandidate.riskFlags])],
      whyGoods: pageCandidate.whyGoods,
      snippet: pageCandidate.snippet || candidate.snippet,
    });
    await sleep(250);
  }
  return mergeCandidates(enriched);
}

function toCsv(rows) {
  const headers = [
    'score',
    'lanes',
    'title',
    'url',
    'source',
    'amountHint',
    'dueDateHint',
    'statusHint',
    'geographyHint',
    'entityHint',
    'whyGoods',
    'nextAction',
    'crmSuggestion',
    'riskFlags',
    'foundVia',
  ];
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((header) => csvCell(Array.isArray(row[header]) ? row[header].join('; ') : row[header])).join(','));
  }
  return `${lines.join('\n')}\n`;
}

function csvCell(value) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function markdownReport(rows, stats) {
  const top = rows.slice(0, maxResults);
  const lines = [];
  lines.push(`# Goods Funding Sweep - ${runDate}`);
  lines.push('');
  lines.push('Status: best-effort public sweep. This finds and ranks likely opportunities; it is not a guarantee that every private, invitation-only, unindexed, or newly opened opportunity in Australia has been captured.');
  lines.push('');
  lines.push(`Generated: ${runStamp}`);
  lines.push(`Config: \`${path.relative(ROOT_DIR, CONFIG_PATH)}\``);
  lines.push(`Web mode: ${noWeb ? 'off' : 'on'}; source URLs scanned: ${stats.sourceUrlCount}; web queries attempted: ${stats.queryCount}; candidate pages enriched: up to ${maxPages}.`);
  lines.push('');
  lines.push('## Top Opportunities');
  lines.push('');
  lines.push('| Score | Lane | Opportunity | Amount | Due / close | Status | Why Goods | Next action |');
  lines.push('| ---: | --- | --- | --- | --- | --- | --- | --- |');
  for (const row of top.slice(0, 40)) {
    const lane = (row.lanes || [row.lane]).join('; ');
    const title = `[${escapeMd(row.title)}](${row.url})`;
    lines.push(
      `| ${row.score} | ${escapeMd(lane)} | ${title} | ${escapeMd(row.amountHint)} | ${escapeMd(row.dueDateHint)} | ${escapeMd(row.statusHint)} | ${escapeMd(row.whyGoods)} | ${escapeMd(row.nextAction)} |`,
    );
  }
  lines.push('');
  lines.push('## Review Queue By Lane');
  for (const lane of config.lanes) {
    const laneRows = top.filter((row) => (row.laneIds || [row.laneId]).includes(lane.id)).slice(0, 18);
    if (!laneRows.length) continue;
    lines.push('');
    lines.push(`### ${lane.label}`);
    for (const row of laneRows) {
      lines.push(`- ${row.score}: [${escapeMd(row.title)}](${row.url})`);
      lines.push(`  - Amount: ${escapeMd(row.amountHint)}; due: ${escapeMd(row.dueDateHint)}; status: ${escapeMd(row.statusHint)}; geography: ${escapeMd(row.geographyHint)}; entity: ${escapeMd(row.entityHint)}`);
      lines.push(`  - CRM: ${escapeMd(row.crmSuggestion)}`);
      if (row.riskFlags.length) lines.push(`  - Risks / gaps: ${escapeMd(row.riskFlags.join('; '))}`);
    }
  }
  lines.push('');
  lines.push('## Access Issues');
  if (!accessIssues.length) {
    lines.push('- None recorded.');
  } else {
    for (const issue of accessIssues.slice(0, 80)) {
      lines.push(`- ${escapeMd(issue.source || 'unknown')} (${escapeMd(issue.lane || 'unknown')}): ${escapeMd(issue.issue)} - ${issue.url}`);
    }
  }
  lines.push('');
  lines.push('## How To Use');
  lines.push('- Treat rows with unknown due dates or entity requirements as research leads, not ready opportunities.');
  lines.push('- Promote a row to Notion only after confirming the live opportunity page, eligibility, close date, and the right applicant entity.');
  lines.push('- Promote to GoHighLevel only after deciding the operating lane: Grants pipeline for formal applications, Goods Supporter Journey for relationship-led funders, Buyer/Demand pipeline for procurement finance.');
  lines.push('- Re-run weekly during active capital raise windows and compare CSV/JSON against the previous sweep.');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function escapeMd(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

async function main() {
  console.log(`Goods funding sweep (${noWeb ? 'offline/source-config only' : 'web enabled'})`);
  console.log(`Config: ${CONFIG_PATH}`);

  const candidates = [];
  let queryCount = 0;
  let sourceUrlCount = 0;

  for (const lane of config.lanes) {
    console.log(`\n[${lane.label}]`);
    for (const sourceUrl of lane.sourceUrls) {
      sourceUrlCount += 1;
      if (noWeb) {
        candidates.push(
          buildCandidate({
            title: titleFromUrl(sourceUrl),
            url: sourceUrl,
            snippet: lane.nextAction,
            source: hostOf(sourceUrl),
            lane,
            foundVia: 'configured source',
          }),
        );
        continue;
      }
      process.stdout.write(`  source ${sourceUrl}\n`);
      candidates.push(...(await scanSource(sourceUrl, lane)));
      await sleep(300);
    }
    for (const query of lane.queries) {
      if (queryCount >= queryLimit) break;
      queryCount += 1;
      if (noWeb) {
        candidates.push(
          buildCandidate({
            title: query,
            url: `search:${query}`,
            snippet: lane.nextAction,
            source: 'configured-query',
            lane,
            foundVia: 'configured query',
          }),
        );
        continue;
      }
      process.stdout.write(`  search ${query}\n`);
      candidates.push(...(await searchDuckDuckGo(query, lane)));
      await sleep(650);
    }
  }

  const merged = mergeCandidates(candidates);
  const enriched = noWeb ? merged : await enrichCandidates(merged.slice(0, Math.max(maxPages * 2, maxResults)));
  const results = enriched
    .filter((row) => row.score >= 20)
    .slice(0, maxResults)
    .map((row, index) => ({ rank: index + 1, ...row }));

  fs.mkdirSync(outDir, { recursive: true });
  const basename = `${runDate}-funding-sweep`;
  const jsonPath = path.join(outDir, `${basename}.json`);
  const csvPath = path.join(outDir, `${basename}.csv`);
  const mdPath = path.join(outDir, `${basename}.md`);

  const stats = {
    generatedAt: runStamp,
    runDate,
    sourceUrlCount,
    queryCount,
    rawCandidateCount: candidates.length,
    mergedCandidateCount: merged.length,
    resultCount: results.length,
    accessIssueCount: accessIssues.length,
  };

  fs.writeFileSync(
    jsonPath,
    `${JSON.stringify({ stats, missionProfile: config.missionProfile, lanes: config.lanes, accessIssues, opportunities: results }, null, 2)}\n`,
  );
  fs.writeFileSync(csvPath, toCsv(results));
  fs.writeFileSync(mdPath, markdownReport(results, stats));

  console.log('\nDone.');
  console.log(`  Results: ${results.length} ranked opportunities/leads`);
  console.log(`  Markdown: ${path.relative(ROOT_DIR, mdPath)}`);
  console.log(`  CSV: ${path.relative(ROOT_DIR, csvPath)}`);
  console.log(`  JSON: ${path.relative(ROOT_DIR, jsonPath)}`);
  if (accessIssues.length) console.log(`  Access issues: ${accessIssues.length} recorded in the Markdown/JSON output`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
