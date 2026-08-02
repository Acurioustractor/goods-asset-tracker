#!/usr/bin/env node
/**
 * check:audience - every route is for someone, and leads with what they came for.
 *
 * The failure this exists to prevent is not a bad record. It is a NEW ROUTE SHIPPED WITHOUT ANYONE
 * ASKING WHO IT IS FOR. A guard that only validates records already written would never catch that,
 * which is why coverage is checked in both directions and is the first thing here.
 *
 * Every assertion was decided in the wayfinding map, issue #177, and cites the rule it fails on -
 * `check-content-gate.mjs` and `check-register-integrity.mjs` established that a guard which only
 * says "failed" is a guard people learn to route around.
 *
 * Reads the filesystem only, so unlike check:register it needs no .env.local and runs in CI. It is
 * chained into both check:drift and check:drift:ci.
 */

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const failures = [];
const fail = (what, rule) => failures.push({ what, rule });

const src = (p) => readFileSync(p, 'utf8');
const files = execSync('git ls-files src', { encoding: 'utf8' }).split('\n').filter(Boolean);

// ── The data, read as text so this guard needs no TS toolchain ───────────────
const raRaw = src('src/lib/data/route-audience.ts');
const audRaw = src('src/lib/data/audience.ts');
const proxyRaw = src('src/proxy.ts');
const nextConfig = src('next.config.ts');

const records = [...raRaw.matchAll(/\{\s*\n\s*route: '((?:[^'\\]|\\.)*)',([\s\S]*?)\n  \},/g)].map(
  ([, route, body]) => ({
    route,
    audience: (body.match(/\n    audience: (?:'([a-z]+)'|null)/) || [])[1] ?? null,
    access: (body.match(/\n    access: '([a-z]+)'/) || [])[1],
    verdict: (body.match(/\n    verdict: '([a-z]+)'/) || [])[1],
    target: (body.match(/\n    target: '((?:[^'\\]|\\.)*)'/) || [])[1],
    why: (body.match(/\n    why: '((?:[^'\\]|\\.)*)'/) || [])[1],
    leadsWithNow: !/\n    leadsWithNow: null/.test(body),
    whyUnread: (body.match(/\n    whyUnread: '((?:[^'\\]|\\.)*)'/) || [])[1],
  }),
);

const AUDIENCE_IDS = [...audRaw.matchAll(/^  \| '([a-z]+)'/gm)].map((m) => m[1]);
const FRONT_DOORS = [...audRaw.matchAll(/id: '([a-z]+)',[\s\S]*?frontDoor: (?:'([^']+)'|null)/g)].map(
  ([, id, door]) => ({ id, door: door ?? null }),
);

// ── Routes on disk ──────────────────────────────────────────────────────────
const onDisk = new Set(
  files
    .filter((f) => /(^|\/)page\.tsx$/.test(f) && f.startsWith('src/app'))
    .map((f) => f.slice('src/app'.length).replace(/\/page\.tsx$/, '') || '/'),
);
const byRoute = new Map(records.map((r) => [r.route, r]));

// ── 7. plumbing is pattern-bound, not a place awkward routes go to die ──────
const PLUMBING_PATTERNS = [
  /^\/login$/,
  /^\/auth\//,
  /^\/unauthorized$/,
  /\/login$/,
  /^\/checkout$/,
  /^\/checkout\/success$/,
  /^\/export\/map\//,
  /^\/privacy$/,
  /^\/terms$/,
];

// ── Access is DERIVED from the proxy, never trusted ─────────────────────────
const gatedPrefixes = [
  ...new Set([
    // The proxy declares gating two ways and BOTH must be read. An earlier version of this parser
    // saw only the `pathname === '...'` comparisons and missed `protectedUserRoutes`, which is how
    // /community, /my-items and /production looked ungated when they are not.
    ...[...proxyRaw.matchAll(/pathname === '(\/[a-z0-9/-]+)'/g)].map((m) => m[1]),
    ...[...proxyRaw.matchAll(/^const \w*[Rr]outes = \[([^\]]*)\]/gm)].flatMap((m) =>
      [...m[1].matchAll(/'(\/[a-z0-9/-]+)'/g)].map((x) => x[1]),
    ),
  ]),
];
function expectedAccess(route) {
  if (route.startsWith('/admin')) return 'admin';
  if (gatedPrefixes.some((g) => route === g || route.startsWith(`${g}/`))) return 'gated';
  return 'open';
}

// ── 1 + 2. Coverage, both directions. The anti-rot core. ────────────────────
for (const route of onDisk) {
  if (!byRoute.has(route)) {
    fail(
      `${route} has a page.tsx and no record in route-audience.ts`,
      'Every route is for someone. A route shipped without an audience is the failure this guard exists to prevent (map #177).',
    );
  }
}
for (const r of records) {
  const shouldBeGone = r.verdict === 'redirect' || r.verdict === 'retire';
  if (!onDisk.has(r.route) && !shouldBeGone) {
    fail(
      `${r.route} has a record but no page.tsx`,
      'A record pointing at a route that does not exist is how servedBy came to claim /products and /export, neither of which was ever a route.',
    );
  }
}

for (const r of records) {
  // ── 3. audience === null IFF verdict === 'plumbing', checked both ways ────
  const isPlumbing = r.verdict === 'plumbing';
  if (isPlumbing !== (r.audience === null)) {
    fail(
      `${r.route}: audience=${r.audience ?? 'null'} with verdict='${r.verdict}'`,
      "Exactly one audience per route. Null is legal ONLY for 'plumbing', which is the single exemption (ticket #178).",
    );
  }
  // ── 6. the audience exists ────────────────────────────────────────────────
  if (r.audience && !AUDIENCE_IDS.includes(r.audience)) {
    fail(`${r.route}: unknown audience '${r.audience}'`, 'AudienceId is defined in audience.ts.');
  }
  // ── 4. target IFF redirect ────────────────────────────────────────────────
  if ((r.verdict === 'redirect') !== Boolean(r.target)) {
    fail(
      `${r.route}: verdict='${r.verdict}' with ${r.target ? 'a' : 'no'} target`,
      "A 'redirect' must say where to; nothing else may carry a target.",
    );
  }
  // ── 5. why required for plumbing and retire ───────────────────────────────
  if ((isPlumbing || r.verdict === 'retire' || r.verdict === 'rewrite') && !r.why) {
    fail(
      `${r.route}: verdict='${r.verdict}' with no why`,
      "'retire' must be EARNED, 'plumbing' must be justified, and a 'rewrite' must say WHICH rule the lead breaks. An unexplained rewrite is an opinion (tickets #178, #184).",
    );
  }
  // ── 7. plumbing allowlist ─────────────────────────────────────────────────
  if (isPlumbing && !PLUMBING_PATTERNS.some((p) => p.test(r.route))) {
    fail(
      `${r.route}: claims 'plumbing' but matches no PLUMBING_PATTERNS entry`,
      'Plumbing is the only escape from one-audience-per-route. Adding a pattern is a deliberate reviewable act; claiming the verdict without one is not (ticket #181).',
    );
  }
  // ── 17. access is derived from the proxy, not typed ───────────────────────
  const want = expectedAccess(r.route);
  if (r.access !== want) {
    fail(
      `${r.route}: access='${r.access}' but src/proxy.ts implies '${want}'`,
      'A route someone believes is gated that the proxy does not cover is the failure worth catching. /sites/qbe is gated only because it is named explicitly.',
    );
  }
  // ── 18. whyUnread required when the lead could not be read ────────────────
  if (!r.leadsWithNow && !r.whyUnread && !isPlumbing) {
    fail(
      `${r.route}: leadsWithNow is null with no whyUnread`,
      'An unread route must say why, so it is never silently scored as keep (ticket #186).',
    );
  }
  // ── 13 + 14. redirect targets resolve, and retired pages are actually gone ─
  if (r.verdict === 'redirect') {
    const t = byRoute.get(r.target);
    if (!t) {
      fail(`${r.route} -> ${r.target}, which has no record`, 'A redirect must point at a real route.');
    } else if (t.verdict === 'redirect' || t.verdict === 'retire') {
      fail(
        `${r.route} -> ${r.target}, which is itself '${t.verdict}'`,
        'A redirect chain leaves a reader somewhere nobody chose.',
      );
    }
    if (onDisk.has(r.route)) {
      fail(
        `${r.route} is verdict='redirect' but still has a page.tsx`,
        'Every retirement redirect lives in next.config.ts, in one auditable list. Labelling something retired while it still renders is how a "retired, do not use" chip printed the retired sentence to funders (ticket #184).',
      );
    }
  }
  if (r.verdict === 'retire' && onDisk.has(r.route)) {
    fail(
      `${r.route} is verdict='retire' but still has a page.tsx`,
      "'retire' means the file is gone. /media had a config redirect AND a live page.tsx, shadowed and unreachable, for weeks (ticket #184).",
    );
  }
}

// ── 8-11. Front doors ───────────────────────────────────────────────────────
const seenDoors = new Map();
for (const { id, door } of FRONT_DOORS) {
  if (door === null) continue;
  const rec = byRoute.get(door);
  if (!rec) {
    fail(`${id}.frontDoor = ${door}, which has no record`, 'A front door must be a real route.');
    continue;
  }
  if (rec.audience !== id) {
    fail(
      `${id}.frontDoor = ${door}, but that route's audience is '${rec.audience}'`,
      'A front door serves the audience that claims it.',
    );
  }
  if (['retire', 'redirect', 'plumbing'].includes(rec.verdict)) {
    fail(
      `${id}.frontDoor = ${door}, whose verdict is '${rec.verdict}'`,
      'Sending an audience to a page you have decided to remove is the failure that produced four false servedBy entries.',
    );
  }
  const page = `src/app${door === '/' ? '' : door}/page.tsx`;
  if (files.includes(page) && /index:\s*false/.test(src(page))) {
    fail(
      `${id}.frontDoor = ${door}, which carries robots index:false`,
      "An audience's front door must be findable. /pathways is noindexed for a consent reason and therefore cannot be one (ticket #181).",
    );
  }
  if (seenDoors.has(door)) {
    fail(`${door} is the front door for both ${seenDoors.get(door)} and ${id}`, 'One door, one audience.');
  }
  seenDoors.set(door, id);
}

// ── 16. every next.config retirement carries a dated comment ────────────────
const redirectBlock = (nextConfig.match(/async redirects\(\)[\s\S]*?\n  \},/) || [''])[0];
for (const m of redirectBlock.matchAll(/\{ source: '([^']+)'/g)) {
  const idx = redirectBlock.indexOf(m[0]);
  const before = redirectBlock.slice(Math.max(0, idx - 600), idx);
  if (!/\/\/[^\n]*\d{4}-\d{2}-\d{2}|\/\/[^\n]*ruling/i.test(before)) {
    fail(
      `next.config.ts redirect for ${m[1]} has no dated comment naming its ruling`,
      'A ruling with no sweep list is a ruling that will rot. 18-bmd-partnership.md said "canon updated everywhere" while contradicting canon.',
    );
  }
}

// ── Reports. These never fail. ──────────────────────────────────────────────
const rewrites = records.filter((r) => r.verdict === 'rewrite');
const unread = records.filter((r) => !r.leadsWithNow && r.verdict !== 'plumbing');
const noDoor = FRONT_DOORS.filter((f) => f.door === null).map((f) => f.id);
const noindexed = records.filter((r) => {
  if (r.audience === null || r.audience === 'internal') return false;
  const page = `src/app${r.route === '/' ? '' : r.route}/page.tsx`;
  return files.includes(page) && /index:\s*false/.test(src(page));
});

console.log('Route audience\n');
console.log(`  ${records.length} routes classified`);
console.log(`  ${rewrites.length} rewrite  (right reader, wrong lead — the finding)`);
rewrites.forEach((r) => console.log(`      ${r.route}`));
console.log(`  ${unread.length} unread   (lead could not be read; exempt from keep-vs-rewrite)`);
console.log(`  ${noDoor.length} audience(s) with no front door${noDoor.length ? `: ${noDoor.join(', ')}` : ''}`);
console.log(`  ${noindexed.length} noindexed with a non-internal audience (a contradiction, not a failure)`);
noindexed.forEach((r) => console.log(`      ${r.route}  (${r.audience})`));

if (failures.length) {
  console.error(`\nROUTE AUDIENCE: ${failures.length} FAILURE(S)\n`);
  failures.forEach((f, i) => {
    console.error(`  ${i + 1}. ${f.what}`);
    console.error(`     ${f.rule}\n`);
  });
  process.exit(1);
}
console.log('\nOK — every route is for someone, and every front door is real.');
