/**
 * The route directory calls itself "the complete admin route directory", but
 * until now nothing failed when a new admin page shipped unregistered — six
 * routes drifted in within a week of the 2026-07-19 review (/admin/pipeline,
 * /admin/ask, the three /admin/maps views, /admin/route-review). Same disease
 * the register judge cures for counts: a registry that only a human sweep
 * keeps honest isn't a registry.
 *
 * Rule: every page.tsx under src/app/admin must be covered by a directory
 * entry — its own href, or a registered ancestor (children like
 * /admin/assets/[unique_id] or /admin/el-stories/new ride on their parent) —
 * or be on the explicit infrastructure exemption list. And the reverse: every
 * directory href must still exist on disk, so retired screens leave the
 * directory when they leave the tree.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ADMIN_ROUTE_DIRECTORY } from './admin-routes';

const ADMIN_DIR = join(__dirname, '../../app/admin');

/** Auth plumbing, not screens — never belongs in the directory. */
const EXEMPT = new Set(['/admin/login', '/admin/unauthorized']);

function collectPages(dir: string, href: string, out: string[]): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) collectPages(join(dir, entry.name), `${href}/${entry.name}`, out);
    else if (entry.name === 'page.tsx') out.push(href || '/admin');
  }
  return out;
}

const pages = collectPages(ADMIN_DIR, '/admin', []);
const registered = new Set(
  ADMIN_ROUTE_DIRECTORY.flatMap((g) => g.routes.map((r) => r.href)),
);

function covered(href: string): boolean {
  if (EXEMPT.has(href)) return true;
  // walk up: /admin/assets/batch/[batch] is covered by /admin/assets
  for (let h = href; h.length >= '/admin'.length; h = h.slice(0, h.lastIndexOf('/'))) {
    if (registered.has(h)) return true;
  }
  return false;
}

describe('admin route directory is complete', () => {
  it('every admin page on disk is registered (or covered by a registered ancestor)', () => {
    const orphans = pages.filter((p) => !covered(p));
    expect(orphans, `unregistered admin routes: ${orphans.join(', ')} — add them to ADMIN_ROUTE_DIRECTORY with an honest status`).toEqual([]);
  });

  it('every directory href still exists on disk', () => {
    const ghosts = [...registered].filter((href) => {
      const dir = join(ADMIN_DIR, href.replace(/^\/admin\/?/, ''));
      return !existsSync(join(dir, 'page.tsx'));
    });
    expect(ghosts, `directory entries with no page on disk: ${ghosts.join(', ')} — remove them or restore the page`).toEqual([]);
  });

  it('hrefs are unique across groups', () => {
    const all = ADMIN_ROUTE_DIRECTORY.flatMap((g) => g.routes.map((r) => r.href));
    expect(new Set(all).size).toBe(all.length);
  });
});
