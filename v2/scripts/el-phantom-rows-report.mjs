// EL phantom-row report — READ ONLY. Scans the Goods-project media_assets in
// Empathy Ledger and flags "phantom" rows: a DB row whose storage object is
// missing (no bytes). This reproduces the alignment doc's finding
// (wiki/canon/el-goods-alignment.md: "6 phantom EL rows") as a review-ready
// artifact. It NEVER writes or deletes — the fix (delete row / re-upload / mark
// broken) is the EL owner's call.
//
//   node --env-file=v2/.env.local v2/scripts/el-phantom-rows-report.mjs
//
// Writes wiki/outputs/2026-07-21-el-phantom-rows-report.json and prints a summary.

import { writeFileSync } from 'node:fs';

const URL_BASE = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const PROJECT = process.env.EMPATHY_LEDGER_PROJECT_ID;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

if (!URL_BASE || !KEY || !PROJECT) {
  console.error('Missing EMPATHY_LEDGER_SUPABASE_URL / _KEY / _PROJECT_ID. Run with --env-file=v2/.env.local');
  process.exit(1);
}

/**
 * Definitive existence check for a storage object. HEAD first; if that throws or
 * is rejected (some storage endpoints don't allow HEAD), fall back to a ranged
 * GET of the first byte so a "0" never masquerades as a phantom. Returns status.
 */
async function head(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', headers: H, signal: AbortSignal.timeout(12000) });
    if (r.status && r.status !== 405) return r.status;
  } catch {
    /* fall through to ranged GET */
  }
  try {
    const r = await fetch(url, { headers: { ...H, Range: 'bytes=0-0' }, signal: AbortSignal.timeout(15000) });
    return r.status;
  } catch {
    return 0; // genuinely unreachable (timeout/network) after both attempts
  }
}

/** Resolve the storage object URL we should test for a media row. */
function objectUrl(m) {
  if (m.storage_bucket && m.storage_path) {
    return `${URL_BASE}/storage/v1/object/${m.storage_bucket}/${m.storage_path}`;
  }
  // Fall back to any absolute url the row carries.
  const abs = [m.url, m.cdn_url, m.large_url, m.medium_url].find((u) => u && /^https?:\/\//.test(u));
  return abs || null;
}

async function main() {
  const scope = `project_id=eq.${PROJECT}`;
  const cols = 'id,display_name,original_filename,filename,media_type,storage_bucket,storage_path,url,cdn_url,large_url,medium_url,storyteller_id';
  const rows = await (await fetch(`${URL_BASE}/rest/v1/media_assets?${scope}&select=${cols}`, { headers: H })).json();
  if (!Array.isArray(rows)) {
    console.error('Query failed:', JSON.stringify(rows));
    process.exit(1);
  }
  console.log(`Scanning ${rows.length} Goods-project media rows (project ${PROJECT})...`);

  const phantoms = [];
  const noRef = [];
  const BATCH = 8;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (m) => {
        const url = objectUrl(m);
        if (!url) {
          noRef.push({ id: m.id, name: m.display_name || m.original_filename || m.filename || '(unnamed)' });
          return;
        }
        const status = await head(url);
        if (status !== 200) {
          phantoms.push({
            id: m.id,
            name: m.display_name || m.original_filename || m.filename || '(unnamed)',
            media_type: m.media_type || null,
            is_portrait_of: m.storyteller_id || null,
            tested_url: url,
            status,
          });
        }
      }),
    );
    process.stdout.write(`  ${Math.min(i + BATCH, rows.length)}/${rows.length}\r`);
  }

  const report = {
    generated_for: 'EL owner review — NOT applied',
    scanned_at_note: 'timestamp omitted (stamp when reviewed)',
    project_id: PROJECT,
    scanned: rows.length,
    phantom_count: phantoms.length,
    no_storage_reference_count: noRef.length,
    phantoms: phantoms.sort((a, b) => (a.status || 0) - (b.status || 0)),
    no_storage_reference: noRef,
    note: 'phantom = DB row present, storage object missing (status != 200). Fix = re-upload the file, delete the row, or mark broken. EL owner decides per row.',
  };

  const out = 'wiki/outputs/2026-07-21-el-phantom-rows-report.json';
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(`\n\nScanned ${rows.length} · phantoms ${phantoms.length} · no-storage-ref ${noRef.length}`);
  for (const p of report.phantoms) {
    console.log(`  [${p.status}] ${p.name}${p.is_portrait_of ? ' (portrait)' : ''}`);
  }
  console.log(`\nWrote ${out}`);
}

main();
