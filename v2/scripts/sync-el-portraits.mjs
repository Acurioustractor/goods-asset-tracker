/**
 * Sync consent-cleared storyteller portraits from Empathy Ledger into the repo.
 *
 * EL is the source of truth for storyteller portraits. This mirrors the avatar of
 * each CLEARED storyteller into v2/public/images/people/<slug>.<ext> so the site can
 * serve a fast, version-controlled, consent-checked copy. It removes the accidental
 * split where 8 storytellers had a committed local portrait and 15 only existed in EL.
 *
 * Run from v2/ (needs EL creds):
 *   node --env-file=.env.local scripts/sync-el-portraits.mjs           # download missing only (keeps existing local files)
 *   node --env-file=.env.local scripts/sync-el-portraits.mjs --force   # also overwrite existing local files from EL
 *   node --env-file=.env.local scripts/sync-el-portraits.mjs --dry     # show what would happen, write nothing
 *
 * SAFETY: the allowlist below is the explicit set of consent-cleared storytellers
 * (the /ledger-story cleared pool). It NEVER iterates the full EL roster. Faces are
 * only mirrored for people already cleared for the public stories surface.
 * It does not commit or push; review the files, then commit deliberately.
 */
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..'); // v2/
const peopleDir = path.join(projectRoot, 'public', 'images', 'people');

const API = process.env.EMPATHY_LEDGER_API_URL;
const AKEY = process.env.EMPATHY_LEDGER_API_KEY || '';
if (!API) {
  console.error('Missing EMPATHY_LEDGER_API_URL. Run with: node --env-file=.env.local scripts/sync-el-portraits.mjs');
  process.exit(1);
}
const FORCE = process.argv.includes('--force');
const DRY = process.argv.includes('--dry');

// Consent-cleared storyteller slugs (the /ledger-story cleared pool, 2026-06-08).
// Add a slug here only when that person is cleared for the public stories surface.
const CLEARED_SLUGS = [
  // already had a local portrait (8)
  'alfred-johnson', 'brian-russell', 'cliff-plummer', 'dianne-stokes',
  'ivy', 'linda-turner', 'norman-frank', 'patricia-frank',
  // EL-only until now (15)
  'annie-morrison', 'fred-campbell', 'melissa-jackson', 'jimmy-frank',
  'risilda-hogan', 'heather-mundo', 'daniel-patrick-noble', 'jason',
  'gloria-turner', 'chloe', 'tracy-mccartney', 'wayne-glenn',
  'carmelita-colette', 'kristy-bloomfield', 'gary',
];

const extFromType = (ct) =>
  /png/i.test(ct) ? 'png' : /webp/i.test(ct) ? 'webp' : /jpe?g/i.test(ct) ? 'jpg' : 'jpg';

async function elAvatarUrl(slug) {
  const r = await fetch(`${API}/api/v1/content-hub/storytellers/${slug}`, { headers: { 'X-API-Key': AKEY } });
  if (!r.ok) return { error: `EL HTTP ${r.status}` };
  const j = await r.json();
  const o = j.storyteller || j;
  return { avatarUrl: o.avatarUrl || null, displayName: o.displayName || slug };
}

await mkdir(peopleDir, { recursive: true });
const existing = new Set((await readdir(peopleDir).catch(() => [])));
const localFor = (slug) => [...existing].find((f) => f.replace(/\.[^.]+$/, '') === slug) || null;

const rows = [];
for (const slug of CLEARED_SLUGS) {
  const had = localFor(slug);
  if (had && !FORCE) { rows.push({ slug, action: 'kept', file: had, note: 'local exists (use --force to refresh)' }); continue; }
  const meta = await elAvatarUrl(slug);
  if (meta.error) { rows.push({ slug, action: 'error', note: meta.error }); continue; }
  if (!meta.avatarUrl) { rows.push({ slug, action: 'no-avatar', note: 'EL record has no avatar' }); continue; }
  try {
    const res = await fetch(meta.avatarUrl);
    if (!res.ok) { rows.push({ slug, action: 'error', note: `download HTTP ${res.status}` }); continue; }
    const ct = res.headers.get('content-type') || '';
    const ext = extFromType(ct);
    const file = `${slug}.${ext}`;
    const bytes = Buffer.from(await res.arrayBuffer());
    if (!DRY) await writeFile(path.join(peopleDir, file), bytes);
    rows.push({ slug, action: had ? 'overwrote' : 'downloaded', file, kb: Math.round(bytes.length / 1024), note: had ? 'refreshed from EL' : '' });
  } catch (e) { rows.push({ slug, action: 'error', note: e.message }); }
}

// ── Report ──
const w = (s, n) => String(s).padEnd(n);
console.log(`EL portrait sync ${DRY ? '(dry run) ' : ''}-> v2/public/images/people/  [${FORCE ? 'force' : 'missing-only'}]\n`);
for (const r of rows) console.log(`  ${w(r.action, 11)} ${w(r.slug, 22)} ${w(r.file || '', 26)} ${r.kb ? r.kb + 'KB ' : ''}${r.note || ''}`);
const tally = rows.reduce((m, r) => ((m[r.action] = (m[r.action] || 0) + 1), m), {});
console.log(`\n${CLEARED_SLUGS.length} cleared storytellers. ` + Object.entries(tally).map(([k, v]) => `${v} ${k}`).join(', ') + '.');
const errs = rows.filter((r) => r.action === 'error' || r.action === 'no-avatar');
if (errs.length) { console.log(`\n${errs.length} need attention:`); for (const e of errs) console.log(`  - ${e.slug}: ${e.note}`); }
process.exit(0);
