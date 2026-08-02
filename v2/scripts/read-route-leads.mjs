#!/usr/bin/env node
/**
 * Reads what every route ACTUALLY leads with, from production.
 *
 * Wayfinder ticket #186 settled the method, after testing that the alternatives do not work.
 * These pages compose data modules (content.ts, home.ts, road-spine.ts) and the RENDERED order is
 * not the source order, so reading the source answers a different question. The deployed HTML is
 * the only place the real answer exists, and it costs no build, no install and no browser.
 *
 * The extraction is heading-first, NOT DOM-first. An earlier version took the first h1|h2|p inside
 * <main> and returned "Community pathway workspace" for /pathways, which is a <p> eyebrow sitting
 * above the <h1>. That produced a false finding. The eyebrow is kept as its own field, because it
 * is the first text a reader's eye meets and therefore part of what a page leads with; it is just
 * not the heading.
 *
 * CAVEAT, and it must travel with the output: this reads PRODUCTION. It is only true of `main`
 * when production is current with `main`. It measures what readers see, which is the right thing
 * to measure, but it is not static analysis of the branch under test.
 *
 * Routes that cannot be read record `leadsWithNow: null` with a `whyUnread`, and check:audience
 * skips the keep-versus-rewrite comparison for them and reports the count. An unread route is
 * never silently scored as `keep`.
 *
 *   node scripts/read-route-leads.mjs [--out <path>]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const ORIGIN = 'https://www.goodsoncountry.com';
const OUT =
  process.argv.includes('--out')
    ? process.argv[process.argv.indexOf('--out') + 1]
    : 'scripts/.route-leads.json';

/** Routes the proxy gates. Mirrors src/proxy.ts; the guard asserts the two agree. */
const GATED = [
  '/my-items',
  '/community',
  '/production',
  '/impact',
  '/insiders',
  '/investors',
  '/sites/qbe',
  '/sites/qbe-readiness',
  '/sites/cost-lab',
];

/**
 * A dynamic route is read through a representative instance. Where no instance can be named the
 * route is recorded unread rather than guessed — /communities/utopia was guessed once and produced
 * a false 404 finding.
 */
const INSTANCES = {
  '/communities/[slug]': '/communities/maningrida',
  '/shop/[slug]': null, // resolves nothing: queries Supabase while products.ts is canon
  '/stories/[id]': null,
  '/storytellers/[slug]': null,
  '/field-notes/[slug]': null,
  '/pathways/[id]': null,
  '/bed/[id]': null,
  '/claim/[asset_id]': null,
  '/funders/[slug]': null,
  '/partners/[slug]/dashboard': null,
  '/partners/[slug]/login': null,
  '/partners/[slug]/outcomes': null,
  '/funders/[slug]/communities': null,
  '/funders/[slug]/login': null,
  '/insiders/[...slug]': null,
};

function routes() {
  const files = execSync('git ls-files src/app', { encoding: 'utf8' }).split('\n');
  return files
    .filter((f) => /(^|\/)page\.tsx$/.test(f))
    .map((f) => f.slice('src/app'.length).replace(/\/page\.tsx$/, '') || '/')
    .sort();
}

function isGated(route) {
  return GATED.some((g) => route === g || route.startsWith(`${g}/`));
}

/** Heading first, then the eyebrow above it, then the first substantial paragraph below it. */
function extract(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/);
  const scope = main ? main[1] : html;

  let heading = null;
  let level = null;
  const h1 = scope.match(/<h1\b[^>]*>\s*([^<]{3,})/);
  if (h1) {
    heading = h1[1];
    level = 'h1';
  } else {
    const h2 = scope.match(/<h2\b[^>]*>\s*([^<]{3,})/);
    if (h2) {
      heading = h2[1];
      level = 'h2';
    }
  }
  if (!heading) return null;

  const at = scope.indexOf(heading);
  const before = scope.slice(0, at);
  const after = scope.slice(at + heading.length);

  const eyebrows = [...before.matchAll(/<p\b[^>]*>\s*([^<]{3,})/g)];
  const eyebrow = eyebrows.length ? eyebrows[eyebrows.length - 1][1] : undefined;
  const bodyMatch = after.match(/<p\b[^>]*>\s*([^<]{25,})/);

  const clean = (s) =>
    s &&
    s
      .replace(/&#x27;|&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&#x2F;/g, '/')
      .trim();

  return {
    heading: clean(heading),
    level,
    ...(eyebrow ? { eyebrow: clean(eyebrow) } : {}),
    ...(bodyMatch ? { body: clean(bodyMatch[1]) } : {}),
  };
}

async function read(url) {
  const res = await fetch(url, { redirect: 'follow' });
  return { status: res.status, html: await res.text() };
}

const out = [];
for (const route of routes()) {
  const rec = { route };

  if (route.startsWith('/admin')) {
    rec.leadsWithNow = null;
    rec.whyUnread = 'admin surface, client-rendered behind the admin gate';
    out.push(rec);
    continue;
  }
  if (isGated(route)) {
    rec.leadsWithNow = null;
    rec.whyUnread = 'proxy-gated, the public response is the login page';
    out.push(rec);
    continue;
  }

  let target = route;
  if (route.includes('[')) {
    const instance = INSTANCES[route];
    if (!instance) {
      rec.leadsWithNow = null;
      rec.whyUnread = 'dynamic route with no nameable representative instance';
      out.push(rec);
      continue;
    }
    target = instance;
    rec.readVia = instance;
  }

  try {
    const { status, html } = await read(`${ORIGIN}${target}`);
    rec.status = status;
    const lead = extract(html);
    if (!lead) {
      rec.leadsWithNow = null;
      rec.whyUnread =
        status >= 400
          ? `production returned ${status}`
          : 'no server-rendered heading inside <main> (client-rendered)';
    } else {
      rec.leadsWithNow = lead;
    }
  } catch (err) {
    rec.leadsWithNow = null;
    rec.whyUnread = `fetch failed: ${err.message}`;
  }
  out.push(rec);
  process.stderr.write('.');
}

process.stderr.write('\n');
writeFileSync(OUT, `${JSON.stringify({ readAt: null, origin: ORIGIN, routes: out }, null, 2)}\n`);

const read_ = out.filter((r) => r.leadsWithNow).length;
const unread = out.length - read_;
console.log(`${out.length} routes · ${read_} read · ${unread} unread`);
console.log(`written to ${OUT}`);
