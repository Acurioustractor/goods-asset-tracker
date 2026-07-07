#!/usr/bin/env node
/**
 * SYNC PENCIL PHOTOS — bridge the canon / Empathy Ledger photo system into Pencil.
 *
 * The HTML deck consumes canon slots via `CANON:<slot>` tokens baked at render time
 * (canon-render.mjs). Pencil `.pen` files are encrypted and can only reference image
 * files by a path relative to the .pen — they cannot consume CANON tokens. So this
 * script materialises every resolved canon slot as a STABLE file the .pen points at:
 *
 *     design/canon-resolved.json  --(this script)-->  design/deck-photos/<slot>.<ext>
 *
 * The Pencil deck's image fills reference `deck-photos/<slot>.jpg`; re-running this
 * after a pick changes in /admin/canon (then canon-resolve.mjs) refreshes the file in
 * place, so /admin/canon stays the single control for photos across the HTML deck,
 * the Pencil deck, and any other purpose that reads design/deck-photos/.
 *
 * Resolution mirrors canon-render.mjs precedence: local path -> EL thumbnail cache ->
 * download EL url -> slot seed. Videos are skipped (Pencil has no video node).
 *
 * Usage: node v2/scripts/sync-pencil-photos.mjs [--slots a,b,c] [--dry]
 * Writes design/deck-photos/<slot>.<ext> + design/deck-photos/_manifest.json
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const only = (() => { const i = args.indexOf('--slots'); return i >= 0 ? new Set(args[i + 1].split(',')) : null; })();

const OUT = path.join(REPO, 'design', 'deck-photos');
const CACHE = path.join(REPO, 'design', '.canon-cache');
const EL_CACHE = path.join(REPO, 'design', 'brand', 'kit', '.el-cache');

const { resolved } = JSON.parse(fs.readFileSync(path.join(REPO, 'design', 'canon-resolved.json'), 'utf8'));
let seeds = {};
try {
  for (const s of (JSON.parse(fs.readFileSync(path.join(REPO, 'design', 'canon-slots.json'), 'utf8')).slots || []))
    if (s.seed) seeds[s.key] = s.seed;
} catch { /* no seeds */ }

// EL key for downloads, from v2/.env.local
const ENV = path.join(REPO, 'v2', '.env.local');
if (fs.existsSync(ENV)) for (const l of fs.readFileSync(ENV, 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const EL_KEY = process.env.EMPATHY_LEDGER_API_KEY || '';

const elCacheFor = (elId) => {
  if (!elId || !fs.existsSync(EL_CACHE)) return null;
  for (const pre of ['media', 'portrait', 'elvideo'])
    for (const ext of ['jpg', 'png', 'webp'])
      { const fp = path.join(EL_CACHE, `${pre}-${elId}.${ext}`); if (fs.existsSync(fp)) return fp; }
  return null;
};
const cacheEl = async (url) => {
  fs.mkdirSync(CACHE, { recursive: true });
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 12);
  const existing = fs.existsSync(CACHE) && fs.readdirSync(CACHE).find((f) => f.startsWith(hash + '.'));
  if (existing) return path.join(CACHE, existing);
  const r = await fetch(url, { redirect: 'follow', headers: EL_KEY ? { 'X-API-Key': EL_KEY } : {} });
  if (!r.ok) throw new Error(`EL ${r.status}`);
  const ct = r.headers.get('content-type') || 'image/jpeg';
  const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
  const fp = path.join(CACHE, `${hash}.${ext}`);
  fs.writeFileSync(fp, Buffer.from(await r.arrayBuffer()));
  return fp;
};

const resolveSlot = async (slot, r) => {
  if (r.path && fs.existsSync(path.join(REPO, r.path))) return path.join(REPO, r.path);
  if (r.elId) { const fp = elCacheFor(r.elId); if (fp) return fp; }
  if (r.url) { try { return await cacheEl(r.url); } catch { /* EL down */ } }
  if (seeds[slot] && fs.existsSync(path.join(REPO, seeds[slot]))) return path.join(REPO, seeds[slot]);
  return null;
};

const main = async () => {
  if (!dry) fs.mkdirSync(OUT, { recursive: true });
  const manifest = {};
  const rows = [];
  for (const [slot, r] of Object.entries(resolved)) {
    if (only && !only.has(slot)) continue;
    if (r.type === 'video' || (r.kind === 'video')) continue; // Pencil has no video node
    const fp = await resolveSlot(slot, r);
    if (!fp) { rows.push([slot, 'UNRESOLVED', r.consent || '', r.dataClass || '']); continue; }
    const ext = fp.split('.').pop().toLowerCase().replace('jpeg', 'jpg');
    const outFile = `${slot}.${ext}`;
    const outPath = path.join(OUT, outFile);
    if (!dry) {
      // clear any stale same-slot file with a different extension
      for (const e of ['jpg', 'png', 'webp', 'gif']) { const p = path.join(OUT, `${slot}.${e}`); if (e !== ext && fs.existsSync(p)) fs.rmSync(p); }
      fs.copyFileSync(fp, outPath);
    }
    manifest[slot] = { file: `deck-photos/${outFile}`, label: r.label || slot, consent: r.consent || 'unknown', dataClass: r.dataClass || '', source: r.source || '', from: path.relative(REPO, fp) };
    rows.push([slot, outFile, r.consent || '', r.dataClass || '']);
  }
  if (!dry) fs.writeFileSync(path.join(OUT, '_manifest.json'), JSON.stringify({ generated: 'run-time', note: 'Generated by sync-pencil-photos.mjs from design/canon-resolved.json. Pencil image fills reference deck-photos/<slot>.<ext>.', slots: manifest }, null, 2));
  const red = rows.filter((x) => x[3] === 'red');
  console.log(`${dry ? '[dry] ' : ''}deck-photos: ${rows.filter((x) => x[1] !== 'UNRESOLVED').length} slot(s) materialised, ${rows.filter((x) => x[1] === 'UNRESOLVED').length} unresolved`);
  for (const [slot, file, consent, dc] of rows) console.log(`  ${dc === 'red' ? 'RED ' : '    '}${slot.padEnd(26)} ${file.padEnd(40)} ${consent}`);
  if (red.length) console.log(`\n  ⚠ ${red.length} RED (consent-gated) slot(s) — confirm clearance before any external use.`);
};
main().catch((e) => { console.error('FAILED:', e instanceof Error ? e.message : e); process.exit(1); });
