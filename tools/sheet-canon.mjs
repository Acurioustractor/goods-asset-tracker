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
 *   node tools/sheet-canon.mjs prompt    emit a Codex brief for doing it by hand
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

function num(v) {
  return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
}

function prompt() {
  const cells = canon();
  const drift = cells.filter((c) => c.drift);
  const L = [];
  const w = (x = '') => L.push(x);

  w('# Brief: make the Goods workbook read from one place');
  w('');
  w('Workbook: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit');
  w('');
  w('You are editing a live workbook with 42,429 formulas that people use daily. **Never replace the');
  w('file or rebuild a tab from scratch.** Edit cells in place, and if a change would break a formula,');
  w('stop and say so instead of working around it.');
  w('');
  w('## What we are doing and why');
  w('');
  w('Settled figures are currently retyped into cells all over the workbook, and seven of them have');
  w('drifted from the source. The fix is structural: put every settled figure on one **Canon** tab,');
  w('then point the other tabs at it, so a figure can only be wrong in one place.');
  w('');
  w('**What stays exactly as it is:** scenarios, the bed calculator inputs, yellow input cells, and');
  w('anything somebody types into. Only settled figures move to Canon.');
  w('');
  w('## Step 1. Create the Canon tab');
  w('');
  w('Add a tab named exactly `Canon`. Put this in A1 and fill down. Values are authoritative; do not');
  w('round, reformat or recalculate them.');
  w('');
  w('| Key | What it is | Value | Unit | Where it comes from |');
  w('| --- | --- | --- | --- | --- |');
  for (const c of cells) w('| `' + c.key + '` | ' + c.label + ' | ' + num(c.value) + ' | ' + c.unit + ' | ' + c.from + ' |');
  w('');
  w('Freeze row 1. Grey the whole tab or add a note in B2: **written from the repo, do not edit by hand**.');
  w('');
  w('## Step 2. Fix the seven figures that have drifted');
  w('');
  w('Each one: find the cell, replace the number with a reference to Canon, and check what depends on it.');
  w('');
  w('The lookup pattern is:');
  w('');
  w('```');
  w('=VLOOKUP("bed.price",Canon!A:C,3,FALSE)');
  w('```');
  w('');
  for (const [i, c] of drift.entries()) {
    const absent = /not in the workbook|No tab carries/i.test(c.drift);
    w('### ' + (i + 1) + '. `' + c.key + '`, ' + num(c.value) + ' ' + c.unit);
    w('');
    w('**In the workbook now:** ' + c.drift);
    w('');
    if (absent) {
      w('**Add it** where it belongs, as `=VLOOKUP("' + c.key + '",Canon!A:C,3,FALSE)`. Say where you put it.');
    } else {
      w('**Replace the number with** `=VLOOKUP("' + c.key + '",Canon!A:C,3,FALSE)`');
    }
    w('');
  }
  w('## Step 3. The one that drives three others');
  w('');
  w('Do `line.runDaysPerMonth` first. The Calculator availability cell reads 100% and Ben set 80% on');
  w('10 September. That one cell should drive:');
  w('');
  w('- **Beds / month** from 60 to **48**');
  w('- **Months needed** for a 400-bed batch from 7 to about **8.3**');
  w('- The Home tab **Equipment ceiling**, which should show 60 as the ceiling at 100% and **48** as');
  w('  the operating rate. The Facility plan tab already has an empty row called');
  w('  **Beds / month after downtime**, which is where 48 belongs.');
  w('');
  w('**If changing availability does not move beds per month, stop.** That means the cell is not wired');
  w('into the throughput formula, which is a worse bug than the wrong number. Tell us which it is.');
  w('');
  w('Be careful not to discount the month twice: 20 planning days at 80% is 16 run days. Apply the');
  w('80% or change 20 to 16. Doing both lands on 38 beds a month, which is wrong.');
  w('');
  w('## Step 4. Three things the workbook is missing');
  w('');
  w('**A supply-path choice on the Calculator.** The Plastic cell reads $55 a bed, which is one of');
  w('three real options. Add a dropdown above it and drive the cell from it:');
  w('');
  w('| Choice | Per bed |');
  w('| --- | --- |');
  w('| Pressed here from our own shred | 55 |');
  w('| Panels from Defy, routed here | ' + num(cells.find((c) => c.key === 'plastic.panelPerBed').value) + ' |');
  w('| Finished kit from Defy | ' + num(cells.find((c) => c.key === 'plastic.kitPerBed').value) + ' |');
  w('');
  w('**The year, on the Money tab, above the funding schedule.** Four rows, referencing Canon:');
  w('`year.needs`, `year.asked`, `year.secured`, `year.gap`.');
  w('');
  w('**A Job column on the funding schedule**, with four values: plant, beds, facilitation, operating.');
  w('');
  w('| Funder | Amount | Job |');
  w('| --- | --- | --- |');
  w('| QBE | 300000 | plant |');
  w('| Tim Fairfax year 1 | 100000 | operating |');
  w('| Brian M. Davis | 60000 | beds |');
  w('| Brian M. Davis | 40000 | facilitation |');
  w('| Snow | 100000 | beds |');
  w('');
  w('Brian M. Davis splits into two rows deliberately. Add a check that flags any funder appearing');
  w('twice with the same job: that is the error that overstated the year by $99,500, when Tim Fairfax');
  w('was counted against beds and against operating at once.');
  w('');
  w('Also move the **Sefa** line below a subtotal. Label the subtotal **Asks** and the line under it');
  w('**Proposed borrowing**. Sefa is a loan we have not applied for and its $200,000 is our number,');
  w('so December asks should read $500,000 with Snow untimed.');
  w('');
  w('## Step 5. Tell us what you found');
  w('');
  w('Report back with: which cells you changed, anything that did not behave as described, and any');
  w('formula that broke. Do not fix a broken formula by hardcoding a number.');
  w('');
  w('## How to verify');
  w('');
  w('Once the workbook is shared with the service account we run `node tools/sheet-canon.mjs check`,');
  w('which reads the Canon tab back and fails on anything out of step. Until then, spot-check three:');
  w('beds per month should read 48, the Plastic cell should follow the dropdown, and the Money tab');
  w('should show a gap of ' + num(cells.find((c) => c.key === 'year.gap').value) + '.');

  console.log(L.join('\n'));
}

const cmd = process.argv[2] ?? 'show';
try {
  if (cmd === 'show') show();
  else if (cmd === 'push') await push();
  else if (cmd === 'check') await check();
  else if (cmd === 'prompt') prompt();
  else console.log('commands: show | push | check | prompt');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
