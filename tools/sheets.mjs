/**
 * Cell-level read and write on the live Goods workbook, through the Google Sheets API.
 *
 * Why this exists: the Drive connector can only replace a whole file, and this workbook carries
 * 42,429 formulas, so a whole-file write would flatten it. The Sheets API edits single cells and
 * ranges and leaves everything else alone.
 *
 * The only blocker is a share. The service account below authenticates fine and the API answers,
 * it just has no access to the file yet:
 *
 *     subscription-scanner@act-subscription-tracker.iam.gserviceaccount.com
 *
 * Share the workbook with that address as Editor and every command here starts working.
 *
 * Usage
 *   node tools/sheets.mjs tabs
 *   node tools/sheets.mjs read 'Calculator!A1:H40'
 *   node tools/sheets.mjs find 'Availability'
 *   node tools/sheets.mjs write 'Calculator!D14' '80%'      # asks nothing, so read first
 */

import { readFileSync } from 'node:fs';
import crypto from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const SHEET_ID = '1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

function serviceAccount() {
  const env = readFileSync(join(HERE, '..', 'v2', '.env.local'), 'utf8');
  const m = env.match(/^GOOGLE_SERVICE_ACCOUNT_KEY=(.*)$/m);
  if (!m) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not in v2/.env.local');
  let raw = m[1].trim();
  if (/^['"]/.test(raw) && /['"]$/.test(raw)) raw = raw.slice(1, -1);
  let key;
  try {
    key = JSON.parse(raw);
  } catch {
    key = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  }
  // The stored key uses backslash line continuations, which openssl will not decode.
  key.private_key = key.private_key.replace(/\\\r?\n/g, '\n').replace(/\\n/g, '\n');
  return key;
}

export async function token() {
  const key = serviceAccount();
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned =
    b64({ alg: 'RS256', typ: 'JWT' }) +
    '.' +
    b64({ iss: key.client_email, scope: SCOPE, aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now });
  const sig = crypto.sign('RSA-SHA256', Buffer.from(unsigned), key.private_key).toString('base64url');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${sig}`,
    }),
  });
  const t = await r.json();
  if (!t.access_token) throw new Error('token failed: ' + JSON.stringify(t).slice(0, 300));
  return { accessToken: t.access_token, email: key.client_email };
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
        `403 PERMISSION_DENIED. The credentials are fine and the API answered. Share the workbook with ${email} as Editor.`,
      );
    }
    throw new Error(`${j.error.code} ${j.error.status}: ${j.error.message}`);
  }
  return j;
}

export async function tabs() {
  const { accessToken } = await token();
  const j = await api('?fields=properties.title,sheets.properties(sheetId,title,gridProperties)', { accessToken });
  return { title: j.properties.title, tabs: j.sheets.map((s) => s.properties) };
}

export async function read(range) {
  const { accessToken } = await token();
  const j = await api(`/values/${encodeURIComponent(range)}`, { accessToken });
  return j.values ?? [];
}

export async function write(range, value) {
  const { accessToken } = await token();
  return api(`/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    accessToken,
    body: { range, majorDimension: 'ROWS', values: [[value]] },
  });
}

/** Every cell on every tab whose text contains `needle`, with its A1 address. */
export async function find(needle) {
  const { tabs: ts } = await tabs();
  const hits = [];
  for (const t of ts) {
    const rows = await read(`'${t.title}'!A1:ZZ`);
    rows.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (String(cell).toLowerCase().includes(needle.toLowerCase())) {
          hits.push({ tab: t.title, a1: `${colName(c)}${r + 1}`, value: cell });
        }
      });
    });
  }
  return hits;
}

function colName(i) {
  let s = '';
  for (let n = i + 1; n > 0; ) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [cmd, a, b] = process.argv.slice(2);
  try {
    if (cmd === 'tabs') {
      const { title, tabs: ts } = await tabs();
      console.log(title);
      for (const t of ts) console.log(' ', String(t.sheetId).padStart(11), t.title);
    } else if (cmd === 'read') {
      console.log((await read(a)).map((r) => r.join(' | ')).join('\n'));
    } else if (cmd === 'find') {
      for (const h of await find(a)) console.log(`${h.tab}!${h.a1}`, '=', String(h.value).slice(0, 80));
    } else if (cmd === 'write') {
      console.log(JSON.stringify(await write(a, b)));
    } else {
      console.log('commands: tabs | read <range> | find <text> | write <range> <value>');
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
