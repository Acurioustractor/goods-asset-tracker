#!/usr/bin/env node
/**
 * Keep the live workbook and the guarded modules saying the same thing.
 *
 * The arrangement: the modules are the core and the workbook is a view of them. This writes every
 * settled figure into a **Canon** tab, so other tabs can reference a cell instead of holding a
 * retyped number, and it can compare the two on demand.
 *
 *   node tools/sheet-canon.mjs show      print the canon, no network
 *   node tools/sheet-canon.mjs push      write or refresh the Canon tab
 *   node tools/sheet-canon.mjs check     read the Canon tab back and report drift
 *
 * `show` works today. `push` and `check` need the workbook shared with the service account named
 * in tools/sheets.mjs. Regenerate the canon with `npx vitest run src/lib/data/sheet-canon` in v2.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SHEET_ID, token } from './sheets.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const CANON_PATH = join(HERE, '..', 'deliverables', 'qbe-stage2', 'sheet-canon.json');
const TAB = 'Canon';

function canon() {
  const j = JSON.parse(readFileSync(CANON_PATH, 'utf8'));
  return j.cells;
}

function rows(cells) {
  const out = [
    ['Key', 'What it is', 'Value', 'Unit', 'Where it comes from'],
    ['', 'Written from v2/src/lib/data/sheet-canon.ts. Do not edit these cells by hand.', '', '', ''],
  ];
  for (const c of cells) out.push([c.key, c.label, c.value, c.unit, c.from]);
  return out;
}

async function api(path, { method = 'GET', body, accessToken } = {}) {
  const r = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}${path}`, {
    method,
    headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json();
  if (j.error) {
    if (j.error.code === 403) {
      const { email } = await token();
      throw new Error(
        `403 PERMISSION_DENIED. Credentials are fine and the API answered. Share the workbook with ${email} as Editor.`,
      );
    }
    throw new Error(`${j.error.code} ${j.error.status}: ${j.error.message}`);
  }
  return j;
}

async function ensureTab(accessToken) {
  const meta = await api('?fields=sheets.properties(sheetId,title)', { accessToken });
  const found = meta.sheets.find((s) => s.properties.title === TAB);
  if (found) return found.properties.sheetId;
  const res = await api(':batchUpdate', {
    method: 'POST',
    accessToken,
    body: { requests: [{ addSheet: { properties: { title: TAB } } }] },
  });
  return res.replies[0].addSheet.properties.sheetId;
}

async function push() {
  const cells = canon();
  const { accessToken } = await token();
  await ensureTab(accessToken);
  const values = rows(cells);
  await api(`/values/${encodeURIComponent(`'${TAB}'!A1:E${values.length + 50}`)}:clear`, {
    method: 'POST',
    accessToken,
    body: {},
  });
  await api(
    `/values/${encodeURIComponent(`'${TAB}'!A1`)}?valueInputOption=RAW`,
    { method: 'PUT', accessToken, body: { range: `'${TAB}'!A1`, majorDimension: 'ROWS', values } },
  );
  console.log(`Wrote ${cells.length} figures to the ${TAB} tab.`);
  console.log('Other tabs can now reference them, for example:');
  console.log(`  =VLOOKUP("bed.price",'${TAB}'!A:C,3,FALSE)`);
}

async function check() {
  const cells = canon();
  const { accessToken } = await token();
  const got = await api(`/values/${encodeURIComponent(`'${TAB}'!A:C`)}`, { accessToken });
  const have = new Map((got.values ?? []).slice(2).map((r) => [r[0], Number(r[2])]));
  let bad = 0;
  for (const c of cells) {
    if (!have.has(c.key)) {
      console.log(`MISSING  ${c.key}  (${c.label})`);
      bad++;
      continue;
    }
    const v = have.get(c.key);
    if (Math.abs(v - c.value) > 0.005) {
      console.log(`DRIFT    ${c.key}  sheet ${v}  canon ${c.value}  (${c.label})`);
      bad++;
    }
  }
  if (bad) {
    console.log(`\n${bad} of ${cells.length} out of step. Run push to fix the Canon tab.`);
    process.exit(1);
  }
  console.log(`All ${cells.length} figures agree.`);
}

function show() {
  const cells = canon();
  const w = Math.max(...cells.map((c) => c.key.length));
  for (const c of cells) {
    const v = typeof c.value === 'number' ? c.value.toLocaleString('en-AU') : c.value;
    console.log(`${c.key.padEnd(w)}  ${String(v).padStart(12)}  ${c.unit.padEnd(7)}  ${c.label}`);
  }
  const drift = cells.filter((c) => c.drift);
  if (drift.length) {
    console.log(`\nKnown drift in the workbook, ${drift.length} figures:`);
    for (const d of drift) console.log(`  ${d.key}: ${d.drift}`);
  }
}

const cmd = process.argv[2] ?? 'show';
try {
  if (cmd === 'show') show();
  else if (cmd === 'push') await push();
  else if (cmd === 'check') await check();
  else console.log('commands: show | push | check');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
