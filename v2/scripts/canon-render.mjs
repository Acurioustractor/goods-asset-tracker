#!/usr/bin/env node
/**
 * CANON RENDER — bake the studio's picks into an artifact. This is the last link:
 * an artifact references canon images by SLOT (token `CANON:<slot-key>` inside any
 * src="" or url('')), and this rewrites each token to the winning asset from
 * design/canon-resolved.json. So finishing slots on /admin/canon renders straight
 * into the deck / one-pager — no hand-editing image paths ever again.
 *
 * Resolution per slot (canon-resolved precedence already applied: canon > EL > seed):
 *   - local/seed path -> path RELATIVE to the artifact (works via file://, the kit's
 *     http.server, and as a standalone file).
 *   - EL pick (CDN url) -> downloaded ONCE to design/.canon-cache/ and referenced
 *     locally, so the baked artifact never depends on the live EL endpoint (which
 *     headless Chrome loads unreliably, and which breaks offline / on export).
 *   - empty slot -> token left in place + a warning (so a gap is obvious, not silent).
 *   --inline base64-embeds every resolved image (self-contained Adobe/PDF export).
 *
 * Usage: node scripts/canon-render.mjs <artifact.html> [-o out.html] [--inline]
 * Default output: <artifact>.resolved.html next to the source.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const inFile = args.find((a) => !a.startsWith('-'));
if (!inFile) { console.error('Usage: canon-render.mjs <artifact.html> [-o out.html] [--inline]'); process.exit(1); }
const inline = args.includes('--inline');
const oi = args.indexOf('-o');
const abs = path.resolve(inFile);
const dir = path.dirname(abs);
const outAbs = oi >= 0 ? path.resolve(args[oi + 1]) : abs.replace(/\.html$/, '') + '.resolved.html';
const CACHE = path.join(REPO, 'design', '.canon-cache');

const resolvedPath = path.join(REPO, 'design', 'canon-resolved.json');
if (!fs.existsSync(resolvedPath)) { console.error('No design/canon-resolved.json — run canon-resolve.mjs or pin some slots.'); process.exit(1); }
const { resolved } = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

// Slot seeds (fallback if an EL pick can't be fetched and isn't cached).
const seeds = {};
try {
  for (const s of (JSON.parse(fs.readFileSync(path.join(REPO, 'design', 'canon-slots.json'), 'utf8')).slots || []))
    if (s.seed) seeds[s.key] = s.seed;
} catch { /* no seeds */ }

// The studio downloaded every EL thumbnail here; prefer it so baking survives EL downtime.
const EL_CACHE = path.join(REPO, 'design', 'brand', 'kit', '.el-cache');
const elCacheFor = (elId) => {
  if (!elId || !fs.existsSync(EL_CACHE)) return null;
  for (const pre of ['media', 'portrait', 'elvideo']) {
    for (const ext of ['jpg', 'png', 'webp']) {
      const fp = path.join(EL_CACHE, `${pre}-${elId}.${ext}`);
      if (fs.existsSync(fp)) return fp;
    }
  }
  return null;
};

// EL key (optional) for downloading picks; load from v2/.env.local if present.
const ENV = path.join(REPO, 'v2', '.env.local');
if (fs.existsSync(ENV)) for (const l of fs.readFileSync(ENV, 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const EL_KEY = process.env.EMPATHY_LEDGER_API_KEY || '';

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml' };
const relTo = (fp) => path.relative(dir, fp).split(path.sep).join('/');
const dataUri = (fp) => {
  if (!fs.existsSync(fp)) return relTo(fp);
  const ext = fp.split('.').pop().toLowerCase();
  return `data:${MIME[ext] || 'application/octet-stream'};base64,${fs.readFileSync(fp).toString('base64')}`;
};

// Download an EL pick once into design/.canon-cache, return the local file path.
const cacheEl = async (url) => {
  fs.mkdirSync(CACHE, { recursive: true });
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 12);
  const existing = fs.readdirSync(CACHE).find((f) => f.startsWith(hash + '.'));
  if (existing) return path.join(CACHE, existing);
  const r = await fetch(url, { redirect: 'follow', headers: EL_KEY ? { 'X-API-Key': EL_KEY } : {} });
  if (!r.ok) throw new Error(`EL download ${r.status}`);
  const ct = r.headers.get('content-type') || 'image/jpeg';
  const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
  const fp = path.join(CACHE, `${hash}.${ext}`);
  fs.writeFileSync(fp, Buffer.from(await r.arrayBuffer()));
  return fp;
};

const main = async () => {
  const html = fs.readFileSync(abs, 'utf8');
  const slots = [...new Set([...html.matchAll(/CANON:([a-z0-9-]+)/g)].map((m) => m[1]))];
  const srcBySlot = {};
  const missing = [];
  for (const slot of slots) {
    const r = resolved[slot];
    if (!r) { missing.push(`${slot} (no such slot)`); continue; }
    let fp = null;
    // 1. local / seed path that exists on disk
    if (r.path && fs.existsSync(path.join(REPO, r.path))) fp = path.join(REPO, r.path);
    // 2. EL pick: prefer the studio's local thumbnail cache (survives EL downtime), else download
    if (!fp && r.elId) fp = elCacheFor(r.elId);
    if (!fp && r.url) { try { fp = await cacheEl(r.url); } catch { /* EL down / 404 */ } }
    // 3. fall back to the slot seed if everything above failed
    if (!fp && seeds[slot] && fs.existsSync(path.join(REPO, seeds[slot]))) fp = path.join(REPO, seeds[slot]);
    if (!fp) { missing.push(`${slot} (unresolved)`); continue; }
    srcBySlot[slot] = inline ? dataUri(fp) : relTo(fp);
  }
  let replaced = 0;
  const out = html.replace(/CANON:([a-z0-9-]+)/g, (token, slot) => {
    if (srcBySlot[slot]) { replaced++; return srcBySlot[slot]; }
    return token;
  });
  fs.writeFileSync(outAbs, out);
  console.log(`canon-render: ${replaced} slot token(s) baked -> ${path.relative(process.cwd(), outAbs)}`);
  if (missing.length) console.log(`  ${missing.length} unresolved: ${missing.join(', ')}`);
};
main().catch((e) => { console.error('FAILED:', e instanceof Error ? e.message : e); process.exit(1); });
