/**
 * READ-ONLY money/canon drift loop (Loop A, money domain) for the Goods
 * Alignment Engine. Companion to check-asset-drift.mjs (assets) and
 * check-qbe-guardrails.mjs (retired copy). Run from v2/:
 *
 *   node scripts/check-canon-drift.mjs            (warn-only on staleness)
 *   node scripts/check-canon-drift.mjs --strict   (also fail on staleness)
 *
 * What it enforces (all verifiable by reading the .ts files as text — no Xero
 * call needed, so it is safe to run headless on the M3 pool or a cron):
 *   1. LOCKSTEP: verifiedFinancials.revenueReceived (compendium.ts) ===
 *      fundingHistory.totalReceived (grant-content.ts) === canon registry.
 *      Same for accounts receivable. The code says "Must match" but nothing
 *      enforced it until now — that gap is the recurring revenue drift.
 *   2. LINE ITEMS SUM TO TOTAL: the received[] / receivables[] breakdowns in
 *      grant-content.ts add up to their totals. Catches a bad single edit.
 *   3. STALENESS: each money fact carries an asAt; flag any older than
 *      STALE_DAYS so nobody ships a months-old figure to a funder.
 *   4. RECONCILIATION SURFACE: prints the three coexisting revenue cuts and
 *      the standing P0 (one accountant-reviewed Goods-only figure).
 *
 * It NEVER writes a money figure. Drift and the reconciliation gap go to the
 * human sign-off queue at wiki/canon/needs-signoff.md. Hard inconsistency
 * (lockstep break or bad sum) exits 1; staleness warns (exits 1 under --strict).
 *
 * Keep MONEY_CANON below in lockstep with the money facts in
 * src/lib/data/canon.ts — that lockstep is what this guard exists to protect.
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..'); // v2/
const dataDir = path.join(projectRoot, 'src', 'lib', 'data');
const canonDir = path.resolve(projectRoot, '..', 'wiki', 'canon');
const STRICT = process.argv.includes('--strict');
const STALE_DAYS = 45;
const today = new Date();

// Mirror of the money facts in src/lib/data/canon.ts (the registry of record).
const MONEY_CANON = {
  revenueReceived: { value: 741_111, asAt: '2026-06-03' },
  accountsReceivable: { value: 143_000, asAt: '2026-06-03' },
  xeroPaid: { value: 650_910.79, asAt: '2026-06-01', label: 'ACT-GD receivables paid (Xero cut)' },
  carveOut: { value: 713_827, asAt: '2026-06-02', label: 'Goods revenue carve-out' },
};

const num = (s) => parseFloat(String(s).replace(/_/g, ''));
const scalar = (text, key) => {
  const m = text.match(new RegExp(`\\b${key}:\\s*([\\d_]+(?:\\.\\d+)?)`));
  return m ? num(m[1]) : null;
};
const arrayAmounts = (text, key) => {
  const m = text.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return null;
  return [...m[1].matchAll(/amount:\s*([\d_]+(?:\.\d+)?)/g)].map((x) => num(x[1]));
};
const ageDays = (iso) => Math.floor((today - new Date(iso)) / 86_400_000);
const fmt = (n) => (n == null ? 'MISSING' : `$${n.toLocaleString('en-AU')}`);

const compendium = await readFile(path.join(dataDir, 'compendium.ts'), 'utf8');
const grant = await readFile(path.join(dataDir, 'grant-content.ts'), 'utf8');

const live = {
  compRevenueReceived: scalar(compendium, 'revenueReceived'),
  compAccountsReceivable: scalar(compendium, 'accountsReceivable'),
  compRevenueBilled: scalar(compendium, 'revenueBilled'),
  grantTotalReceived: scalar(grant, 'totalReceived'),
  grantTotalReceivables: scalar(grant, 'totalReceivables'),
  receivedItems: arrayAmounts(grant, 'received'),
  receivableItems: arrayAmounts(grant, 'receivables'),
};

const hardFails = [];
const warnings = [];

// 1. Lockstep: compendium === grant-content === canon registry.
const recCheck = [
  ['canon.revenueReceived', MONEY_CANON.revenueReceived.value],
  ['compendium.revenueReceived', live.compRevenueReceived],
  ['grant-content.totalReceived', live.grantTotalReceived],
];
if (new Set(recCheck.map(([, v]) => v)).size !== 1) {
  hardFails.push(`Revenue received is NOT in lockstep:\n      ${recCheck.map(([k, v]) => `${k} = ${fmt(v)}`).join('\n      ')}`);
}
const arCheck = [
  ['canon.accountsReceivable', MONEY_CANON.accountsReceivable.value],
  ['compendium.accountsReceivable', live.compAccountsReceivable],
  ['grant-content.totalReceivables', live.grantTotalReceivables],
];
if (new Set(arCheck.map(([, v]) => v)).size !== 1) {
  hardFails.push(`Accounts receivable is NOT in lockstep:\n      ${arCheck.map(([k, v]) => `${k} = ${fmt(v)}`).join('\n      ')}`);
}

// 2. Line items sum to totals.
const sum = (a) => (a || []).reduce((s, n) => s + n, 0);
if (live.receivedItems && Math.round(sum(live.receivedItems)) !== Math.round(live.grantTotalReceived)) {
  hardFails.push(`received[] sums to ${fmt(sum(live.receivedItems))} but totalReceived = ${fmt(live.grantTotalReceived)}`);
}
if (live.receivableItems && Math.round(sum(live.receivableItems)) !== Math.round(live.grantTotalReceivables)) {
  hardFails.push(`receivables[] sums to ${fmt(sum(live.receivableItems))} but totalReceivables = ${fmt(live.grantTotalReceivables)}`);
}

// 3. Staleness.
for (const [k, f] of Object.entries(MONEY_CANON)) {
  const age = ageDays(f.asAt);
  if (age > STALE_DAYS) warnings.push(`${k} (${f.label || k}) is ${age} days old (asAt ${f.asAt}). Re-pull Xero and reconcile before any external share.`);
}

// 4. Reconciliation surface (the standing P0).
const cuts = [
  ['Site figure (received)', MONEY_CANON.revenueReceived.value, MONEY_CANON.revenueReceived.asAt],
  ['Xero ACT-GD paid', MONEY_CANON.xeroPaid.value, MONEY_CANON.xeroPaid.asAt],
  ['Goods carve-out', MONEY_CANON.carveOut.value, MONEY_CANON.carveOut.asAt],
];
const reconciled = new Set(cuts.map(([, v]) => v)).size === 1;

// ── Console output ──
console.log('Goods money/canon drift loop\n');
console.log(`Revenue received: canon ${fmt(MONEY_CANON.revenueReceived.value)} | compendium ${fmt(live.compRevenueReceived)} | grant-content ${fmt(live.grantTotalReceived)}`);
console.log(`Receivables:      canon ${fmt(MONEY_CANON.accountsReceivable.value)} | compendium ${fmt(live.compAccountsReceivable)} | grant-content ${fmt(live.grantTotalReceivables)}`);
console.log(`received[] sum ${fmt(sum(live.receivedItems))} (${(live.receivedItems || []).length} items) | receivables[] sum ${fmt(sum(live.receivableItems))} (${(live.receivableItems || []).length} items)`);
console.log(`revenueBilled (different scope, do not compare): ${fmt(live.compRevenueBilled)}\n`);
console.log('Revenue cuts (reconciliation, P0 = one accountant-reviewed Goods-only figure):');
for (const [label, v, asAt] of cuts) console.log(`  ${label.padEnd(26)} ${fmt(v)}  (asAt ${asAt})`);
console.log(`  reconciled: ${reconciled ? 'YES' : 'NO — three cuts still differ'}`);
console.log('  (assets are checked by check-asset-drift.mjs; retired copy by check-qbe-guardrails.mjs)\n');

// ── Sign-off queue + report ──
const stamp = today.toISOString().slice(0, 10);
const signoff = [
  `# Canon money sign-off queue (as of ${stamp})`,
  '',
  'Generated by scripts/check-canon-drift.mjs. Money is never auto-written; clear these by hand (day shift, Tier 3).',
  '',
  '## Standing P0 — revenue reconciliation',
  'Land ONE accountant-reviewed, Goods-only figure to collapse these cuts:',
  ...cuts.map(([label, v, asAt]) => `- ${label}: ${fmt(v)} (asAt ${asAt})`),
  '',
  hardFails.length ? '## Hard drift (fix before any share)' : '## Hard drift\nNone. Money figures are in lockstep across canon.ts, compendium.ts, grant-content.ts.',
  ...hardFails.map((f) => `- ${f.replace(/\n\s+/g, ' ')}`),
  '',
  warnings.length ? '## Staleness warnings' : '## Staleness warnings\nNone within the 45-day window.',
  ...warnings.map((w) => `- ${w}`),
  '',
].join('\n');

await mkdir(canonDir, { recursive: true });
await writeFile(path.join(canonDir, 'needs-signoff.md'), signoff);

if (hardFails.length) {
  console.error('DRIFT DETECTED — money figures are not in lockstep:');
  for (const f of hardFails) console.error(`  - ${f}`);
  console.error(`\nFix the .ts files so canon.ts, compendium.ts and grant-content.ts agree. Queue: wiki/canon/needs-signoff.md`);
  process.exit(1);
}
if (warnings.length) {
  console.warn('STALE money figures:');
  for (const w of warnings) console.warn(`  - ${w}`);
  console.warn(`\nQueued to wiki/canon/needs-signoff.md.`);
  if (STRICT) process.exit(1);
}
console.log(`OK — money figures in lockstep. Sign-off queue: wiki/canon/needs-signoff.md`);
