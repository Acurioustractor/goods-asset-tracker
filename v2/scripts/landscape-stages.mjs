#!/usr/bin/env node
/**
 * READ-ONLY: bake live GHL stages into the internal funder-landscape one-pager.
 *
 * The artifact keeps tokens (`GHL:stage:<funder-key>` in each status pill and
 * one `GHL:stages-asat` stamp line) instead of hand-typed stage words. This
 * script resolves those tokens:
 *
 *   --live   runs ghl-people-pull.mjs --pipeline funder --json (GET only,
 *            writes nothing to GHL), matches each one-pager funder to its
 *            opportunity by org name via the explicit FUNDERS alias map,
 *            maps the GHL stage to display text via the explicit STAGE_DISPLAY
 *            map (an unknown stage shows the raw GHL stage, never a guess),
 *            saves the result to design/brand/kit/landscape-stages.json
 *            (no GHL contact ids, safe to commit), then resolves the HTML.
 *   (none)   resolves from the last saved pull, stamped with ITS date; if no
 *            saved pull exists every pill reads STALE. Never a silent lie.
 *
 * A funder in the HTML but not found in GHL renders "not in GHL" honestly.
 *
 * Usage: node scripts/landscape-stages.mjs <artifact.html> [-o out.html] [--live]
 * Default output: <artifact>.resolved.html next to the source (same convention
 * as canon-render.mjs; render.sh chains the two passes on the same file).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const V2 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(V2, '..');
const CACHE_PATH = path.join(REPO, 'design', 'brand', 'kit', 'landscape-stages.json');
const PULL_SCRIPT = path.join(V2, 'scripts', 'ghl-people-pull.mjs');

// One-pager funder rows -> GHL match rules. Org aliases are exact (case-blind)
// org names as they appear in GHL; nameHint disambiguates when one org holds
// several opportunities (e.g. Snow's first-mover ask vs its stewarding grant).
const FUNDERS = {
  sefa: { label: 'SEFA', orgs: ['sefa', 'sefa partnerships'] },
  snow: { label: 'Snow Foundation', orgs: ['the snow foundation', 'snow foundation'], nameHint: 'first-mover' },
  centrecorp: { label: 'Centrecorp Foundation', orgs: ['centrecorp', 'centrecorp foundation'] },
  'white-box': { label: 'White Box SELF', orgs: ['white box enterprises', 'white box'], nameHint: 'SELF' },
  minderoo: { label: 'Minderoo Foundation', orgs: ['minderoo foundation'] },
  vfff: { label: 'Vincent Fairfax Family Foundation', orgs: ['vincent fairfax family foundation', 'vfff'] },
  qbe: { label: 'QBE Foundation', orgs: ['qbe foundation', 'qbe'] },
};

// GHL stage name -> pill display text. Explicit and boring on purpose: GHL is
// the system of record for stage, so the pill says what GHL says. Only
// "Stewarding / Reporting" is shortened to fit the pill. Any stage not in this
// map renders as its raw GHL name.
const STAGE_DISPLAY = {
  Identified: 'Identified',
  Qualified: 'Qualified',
  Cultivating: 'Cultivating',
  'Ask made': 'Ask made',
  Delivering: 'Delivering',
  'Stewarding / Reporting': 'Stewarding',
  Renewing: 'Renewing',
};

const args = process.argv.slice(2);
const live = args.includes('--live');
const oi = args.indexOf('-o');
const inFile = args.find((a, i) => !a.startsWith('-') && (oi < 0 || i !== oi + 1));
if (!inFile) { console.error('Usage: landscape-stages.mjs <artifact.html> [-o out.html] [--live]'); process.exit(1); }
const abs = path.resolve(inFile);
const outAbs = oi >= 0 ? path.resolve(args[oi + 1]) : abs.replace(/\.html$/, '') + '.resolved.html';

const pullLive = () => {
  // Run from v2/ so the pull script's .env.local load resolves (its contract).
  const stdout = execFileSync(process.execPath, [PULL_SCRIPT, '--pipeline', 'funder', '--json'], {
    cwd: V2, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  const pull = JSON.parse(stdout);
  const funder = (pull.pipelines || []).find((p) => p.key === 'funder');
  if (!funder) throw new Error('pull JSON has no funder pipeline');

  const stages = {};
  for (const [key, spec] of Object.entries(FUNDERS)) {
    let matches = (funder.opportunities || []).filter((o) => {
      const org = (o.org || '').trim().toLowerCase();
      if (spec.orgs.includes(org)) return true;
      // Fallback for org-less rows: the opportunity name carries the org.
      return !org && spec.orgs.some((a) => (o.name || '').toLowerCase().includes(a));
    });
    if (matches.length > 1 && spec.nameHint) {
      const hinted = matches.filter((o) => (o.name || '').toLowerCase().includes(spec.nameHint.toLowerCase()));
      if (hinted.length) matches = hinted;
    }
    if (matches.length > 1) {
      console.error(`  WARN ${key}: ${matches.length} GHL matches (${matches.map((m) => `"${m.name}" ${m.stage}`).join('; ')}), using the first`);
    }
    const hit = matches[0];
    stages[key] = hit
      ? { ghlStage: hit.stage, display: STAGE_DISPLAY[hit.stage] || hit.stage, org: hit.org, opportunity: hit.name }
      : { ghlStage: null, display: 'not in GHL', org: null, opportunity: null };
    if (hit && !STAGE_DISPLAY[hit.stage]) console.error(`  WARN ${key}: GHL stage "${hit.stage}" not in STAGE_DISPLAY, showing it raw`);
  }
  const cache = {
    _comment: 'Last resolved GHL stages for the funder-landscape one-pager. Generated by v2/scripts/landscape-stages.mjs --live (read-only GHL pull). No contact ids, safe to commit. Do not hand-edit; re-pull instead.',
    pulledAt: pull.pulledAt,
    stages,
  };
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');
  console.error(`landscape-stages: live pull ok (${pull.pulledAt}), saved ${path.relative(REPO, CACHE_PATH)}`);
  return cache;
};

const main = () => {
  let cache = null;
  if (live) {
    cache = pullLive();
  } else if (fs.existsSync(CACHE_PATH)) {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  }

  let html = fs.readFileSync(abs, 'utf8');
  const missing = [];
  let baked = 0;

  html = html.replace(/GHL:stage:([a-z0-9-]+)/g, (token, key) => {
    if (!FUNDERS[key]) { missing.push(`${key} (no such funder key)`); return token; }
    if (!cache) return 'STALE';
    const s = cache.stages[key];
    if (!s) return 'STALE';
    baked++;
    return s.display;
  });

  // Stamp the pull date in the render machine's local timezone (en-CA gives
  // YYYY-MM-DD); the UTC date part can read a day early in Australia.
  const pulledDate = cache ? new Date(cache.pulledAt) : null;
  const asAtDate = !cache ? null
    : Number.isNaN(pulledDate.getTime()) ? String(cache.pulledAt).slice(0, 10)
    : pulledDate.toLocaleDateString('en-CA');
  const stamp = !cache
    ? 'STALE: stages not yet pulled from GHL. Render with --live-stages.'
    : live
      ? `Stages as at ${asAtDate}, live from the GHL Goods Supporter Journey.`
      : `Stages as at ${asAtDate} (last saved GHL pull; re-render with --live-stages to refresh).`;
  html = html.replace(/GHL:stages-asat/g, stamp);

  fs.writeFileSync(outAbs, html);
  console.error(`landscape-stages: ${baked} stage pill(s) baked (${live ? 'live' : cache ? 'saved pull' : 'NO PULL, all STALE'}) -> ${path.relative(process.cwd(), outAbs)}`);
  if (missing.length) console.error(`  ${missing.length} unresolved: ${missing.join(', ')}`);
};
try { main(); } catch (e) { console.error('FAILED:', e instanceof Error ? e.message : e); process.exit(1); }
