/**
 * One money surface (Ben, 2026-08-06).
 *
 * Investor money — cost models, unit economics, the raise, revenue — is spoken in full in
 * exactly one place: the money half of /pitch/road (fed by ask-surface.ts / road-ending.ts).
 * Every other public page uses <MoneyPointer /> (one sentence + a link) or a price a buyer
 * can act on. This guard fails the build when a dollar figure appears in page code outside
 * the allowed surfaces, because that is exactly how /partner asked for "$3M" while the deck
 * asked for $400K, and how a wiki page sold the bed at $600 against a $750 canon price.
 *
 * The unit is the FILE: allowed files may carry dollars, everything else may not. Data
 * modules are not scanned; they only reach a reader through a page, and the page is scanned.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..', 'src', 'app');
const componentsRoot = path.resolve(__dirname, '..', 'src', 'components');

// Path prefixes (relative to src/app) where money is allowed in full.
const ALLOWED_APP_PREFIXES = [
  'pitch/', // the money surface and the funder pitch family
  'register', // provenance: every figure with its grade
  'sites/', // standalone funder working surfaces (cost lab, qbe-readiness)
  'admin/',
  'export/',
  'funders/',
  'insiders/',
  'investors/',
  'partners/', // gated per-funder dashboards
  'dashboard', // ops revenue dashboard (flagged separately for gating, not prose drift)
  'api/',
  // Commerce: a price a buyer or donor acts on is not investor prose.
  'shop/',
  'sponsor',
  'checkout',
  'cart',
  'bed/',
  'get-involved',
  'canberra', // one action price + one sourced story fact
  'wiki/community/partner-guide', // donor tiers are an action, like sponsor tiers
  'wiki/community/tracking-model', // one sourced story fact ($3M/yr of washers into dumps)
  'partner', // the public capital page: its ask renders from ask-surface.ts (import-locked),
  //           and its QBE lines state the program terms per ruling V
  'invest', // the structural how-to-back-Goods page: renders ENTITY_DOORS from ask-surface.ts
  //          (import-locked, carries the $750 list price); all other money is <MoneyPointer />
  'wiki/products/washing-machine', // the sourced "$3M/yr of washers" story fact
  'pathways/', // consent-shaped per-community numbers; its own rules live in that module
  'field-notes/', // trip stories quote real invoices with consent-cleared context
];

// Component files allowed to carry dollars (rendered only by allowed pages, or commerce).
const ALLOWED_COMPONENT_PREFIXES = [
  'cart/',
  'dashboard/',
  'production/',
  'maps/',
  'partnership-form.tsx', // ask bands a funder picks from — an action, not prose
  'washer-interest-form.tsx',
  'money-pointer.tsx',
  'strategy/', // internal working surface; formats ledger cents, not investor prose
];

const MONEY = /\$\s?\d/;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(tsx|ts)$/.test(entry.name)) yield full;
  }
}

const violations = [];
for (const [root, allowed] of [
  [appRoot, ALLOWED_APP_PREFIXES],
  [componentsRoot, ALLOWED_COMPONENT_PREFIXES],
]) {
  for await (const file of walk(root)) {
    const rel = path.relative(root, file).replaceAll(path.sep, '/');
    if (allowed.some((p) => rel === p || rel.startsWith(p))) continue;
    const lines = (await readFile(file, 'utf8')).split('\n');
    lines.forEach((line, i) => {
      if (MONEY.test(line)) violations.push({ file: rel, line: i + 1, text: line.trim().slice(0, 120) });
    });
  }
}

if (violations.length) {
  console.error('Money prose outside the money surface (one-money-surface rule, 2026-08-06):\n');
  for (const v of violations) console.error(`  ${v.file}:${v.line}  ${v.text}`);
  console.error(
    '\nSay it with <MoneyPointer /> and keep the figures on /pitch/road — or, if this file is genuinely commerce or a funder surface, add it to the allowlist in scripts/check-money-prose.mjs with a reason.',
  );
  process.exit(1);
}
console.log('OK — no investor-money prose outside the money surface.');
