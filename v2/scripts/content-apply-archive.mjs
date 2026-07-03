#!/usr/bin/env node
/**
 * CONTENT APPLY ARCHIVE — Phase 0 cleanup, Step B.
 *
 * In the gallery, archiving an image sets content_items.archived_at instantly (a
 * DB write, works in prod). It does NOT move the file. This script reads those
 * archived rows and applies the file move on disk: git mv into
 * _archive/<date>/ with a RESTORE.md manifest, then records archive_path on the
 * row. Fully reversible (a plain git revert of the batch commit). NEVER git rm.
 *
 * Design: wiki/outputs/2026-07-03-content-system-design.md
 *
 * Run from the REPO ROOT:
 *   node v2/scripts/content-apply-archive.mjs            # DRY RUN (default) — prints what would move
 *   node v2/scripts/content-apply-archive.mjs --apply    # actually move the files
 *   node v2/scripts/content-apply-archive.mjs --apply --force   # also move guarded items (dangerous)
 *
 * Guards (skipped unless --force): an item is NOT moved if it is a canon pick
 * (canon_slot set), consent-red, or referenced by a live page (used_where).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');

function loadEnv(file) {
  const env = {};
  try {
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      env[m[1]] = v;
    }
  } catch { /* fall through */ }
  return env;
}
const env = loadEnv('v2/.env.local');
const SB_URL = (env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const SB_KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!SB_URL || !SB_KEY) { console.error('Missing Supabase env in v2/.env.local'); process.exit(1); }
if (!SB_URL.includes('cwsyhpiuepvdjtxaozwf')) { console.error('Not the Goods project; refusing.'); process.exit(1); }
const REST = `${SB_URL}/rest/v1`;
const H = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' };

const date = new Date().toISOString().slice(0, 10);
const ARCHIVE_DIR = path.join('_archive', date, 'public-images');

const res = await fetch(
  `${REST}/content_items?source=eq.local&archived_at=not.is.null&archive_path=is.null&select=id,url,ref,area,canon_slot,consent_tier,used_where`,
  { headers: H },
);
if (!res.ok) { console.error(`fetch archived rows failed: ${res.status} ${await res.text()}`); process.exit(1); }
const rows = await res.json();

const moves = [];
const blocked = [];
for (const r of rows) {
  const reasons = [];
  if (r.canon_slot) reasons.push(`canon:${r.canon_slot}`);
  if (r.consent_tier === 'red') reasons.push('consent:red');
  if (Array.isArray(r.used_where) && r.used_where.length) reasons.push(`used(${r.used_where.length})`);
  if (reasons.length && !FORCE) { blocked.push({ ...r, reasons }); continue; }
  const rel = r.url.replace(/^\/images\//, '');            // e.g. product/foo.jpg
  const from = path.join('v2', 'public', 'images', rel);
  const to = path.join(ARCHIVE_DIR, rel);
  if (!fs.existsSync(from)) { blocked.push({ ...r, reasons: ['file-missing'] }); continue; }
  moves.push({ id: r.id, from, to, url: r.url });
}

console.log(`content-apply-archive (${APPLY ? 'APPLY' : 'DRY RUN'}${FORCE ? ' --force' : ''})`);
console.log(`  ${rows.length} archived rows pending file move`);
console.log(`  ${moves.length} to move -> ${ARCHIVE_DIR}/`);
console.log(`  ${blocked.length} blocked${blocked.length ? ' (guard):' : ''}`);
for (const b of blocked) console.log(`    SKIP ${b.url}  [${b.reasons.join(', ')}]`);
for (const m of moves) console.log(`    MOVE ${m.from}  ->  ${m.to}`);

if (!APPLY) {
  console.log('\nDry run only. Re-run with --apply to move the files.');
  process.exit(0);
}
if (moves.length === 0) { console.log('\nNothing to move.'); process.exit(0); }

// Apply: git mv each file, then write RESTORE.md and stamp archive_path.
fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
const manifest = [`# Archive ${date}`, '', 'Moved by content-apply-archive.mjs. Reverse with `git revert <batch commit>` or move each back.', ''];
for (const m of moves) {
  fs.mkdirSync(path.dirname(m.to), { recursive: true });
  execSync(`git mv "${m.from}" "${m.to}"`, { stdio: 'pipe' });
  manifest.push(`- ${m.to}  (was ${m.from})`);
  const patch = await fetch(`${REST}/content_items?id=eq.${m.id}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' },
    body: JSON.stringify({ archive_path: '/' + m.to.split(path.sep).join('/'), ref: '/' + m.to.split(path.sep).join('/') }),
  });
  if (!patch.ok) console.error(`  WARN: row ${m.id} moved on disk but PATCH failed: ${patch.status}`);
}
fs.writeFileSync(path.join(path.dirname(ARCHIVE_DIR), 'RESTORE.md'), manifest.join('\n') + '\n');

console.log(`\nMoved ${moves.length} files into ${ARCHIVE_DIR}/ and stamped archive_path.`);
console.log('Review with `git status`, then commit the batch (one commit = one revertable unit).');
