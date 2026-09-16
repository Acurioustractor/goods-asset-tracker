/**
 * READ-ONLY drift guard for the admin route directory.
 *
 * src/lib/data/admin-routes.ts was written on 19 July 2026 and is accurate about everything it
 * covers. By 17 September, fifteen routes had been built and none of them were in it, including
 * /admin/procurement, which was built the day before. The directory did not fail. It had no gate.
 *
 * route-audience.ts has a drift guard and it caught a missing entry the day before this was
 * written. This is the same guard for the same class of problem.
 *
 * Three things it checks:
 *   1. Every non-dynamic route under app/admin has an entry in the directory.
 *   2. Every href in the directory is a route that exists.
 *   3. Every /admin href in the sidebar is a route that exists, and is declared.
 *
 * It also prints the count of routes marked `orphan`, which works and is linked from nothing.
 * That number is meant to go down, and seeing it is the first step.
 *
 *   node scripts/check-admin-routes.mjs   (run from v2/)
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dirSrc = readFileSync(join(root, 'src/lib/data/admin-routes.ts'), 'utf8');
const sidebarSrc = readFileSync(join(root, 'src/app/admin/admin-sidebar.tsx'), 'utf8');

const declared = new Map();
for (const m of dirSrc.matchAll(/\{ href: '([^']+)', name: '([^']+)', status: '([^']+)'([^}]*)\}/g)) {
  const note = /note: '((?:[^'\\]|\\.)*)'/.exec(m[4]);
  declared.set(m[1], { name: m[2], status: m[3], note: note ? note[1].replace(/\\'/g, "'") : '' });
}

const walk = (dir, prefix = '') => {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...walk(join(dir, e.name), `${prefix}/${e.name}`));
    else if (e.name === 'page.tsx') out.push(prefix || '');
  }
  return out;
};
// Dynamic segments describe a route shape. Nobody links to one.
const real = new Set(walk(join(root, 'src/app/admin')).filter((r) => !r.includes('[')).map((r) => `/admin${r}`));

const sidebar = [...sidebarSrc.matchAll(/href: '(\/admin[^']*)'/g)].map((m) => m[1]);

const problems = [];
for (const r of [...real].sort()) {
  if (!declared.has(r)) problems.push(`route ${r} exists and is not in the directory`);
}
for (const [href] of declared) {
  if (!real.has(href)) problems.push(`directory lists ${href} and no such route exists`);
}
for (const href of new Set(sidebar)) {
  if (!real.has(href)) problems.push(`the sidebar links ${href} and no such route exists`);
  else if (!declared.has(href)) problems.push(`the sidebar links ${href} and the directory does not declare it`);
}

const byStatus = {};
for (const [, v] of declared) byStatus[v.status] = (byStatus[v.status] ?? 0) + 1;
const orphans = [...declared].filter(([, v]) => v.status === 'orphan');

console.log(`Admin routes: ${real.size} real, ${declared.size} declared, ${new Set(sidebar).size} linked from the sidebar.`);
console.log(`  ${Object.entries(byStatus).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(', ')}`);
if (orphans.length) {
  console.log(`  ${orphans.length} unreachable, which works and is linked from nothing:`);
  for (const [href, v] of orphans) console.log(`    ${href}  ${v.note ?? ''}`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('\nAdd the route to ADMIN_ROUTE_DIRECTORY with the status it actually has, or delete it.');
  process.exit(1);
}
console.log('\nEvery route is declared and every link goes somewhere.');
