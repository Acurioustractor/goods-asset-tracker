/**
 * Guards for the portal → module mapping.
 *
 * The four /portal routes were `rewrite` verdicts because they never named a module
 * (partner.leadWith). These hold the fix in place: the mapping cannot name a module that does
 * not exist, cannot drift out of the nine, and a new portal screen cannot ship unnamed.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { MODULES } from './pathway-stages';
import { PORTAL_MODULE_FOCUS, TRANSFER_NOTE, moduleDetail, moduleFocusFor } from './portal-modules';
import { ROUTE_AUDIENCES } from './route-audience';

const PORTAL_DIR = join(process.cwd(), 'src/app/portal');

describe('portal module focus', () => {
  it('every focus names one of the nine modules', () => {
    const ids = MODULES.map((m) => m.id);
    for (const f of PORTAL_MODULE_FOCUS) {
      expect(ids).toContain(f.module);
    }
  });

  it('no two portal screens claim the same module', () => {
    const used = PORTAL_MODULE_FOCUS.map((f) => f.module);
    expect(new Set(used).size).toBe(used.length);
  });

  it('every focus route is a real route in the audience map', () => {
    const routes = ROUTE_AUDIENCES.map((r) => r.route);
    for (const f of PORTAL_MODULE_FOCUS) {
      expect(routes).toContain(f.route);
    }
  });

  it('every /portal route in the audience map is named, except the portal home which names all nine', () => {
    const portalRoutes = ROUTE_AUDIENCES
      .map((r) => r.route)
      .filter((r) => r.startsWith('/portal') && r !== '/portal');
    for (const route of portalRoutes) {
      expect(moduleFocusFor(route), `${route} names no module`).toBeDefined();
    }
  });

  it('every portal page on disk has a focus, so a new screen cannot ship unnamed', () => {
    const dirs = readdirSync(PORTAL_DIR).filter((d) =>
      statSync(join(PORTAL_DIR, d)).isDirectory(),
    );
    for (const d of dirs) {
      expect(moduleFocusFor(`/portal/${d}`), `/portal/${d} names no module`).toBeDefined();
    }
  });

  it('moduleDetail reports a 1-of-9 position, not a zero index', () => {
    const detail = moduleDetail('story');
    expect(detail.total).toBe(MODULES.length);
    expect(detail.position).toBeGreaterThanOrEqual(1);
    expect(detail.position).toBeLessThanOrEqual(detail.total);
    expect(detail.label).toBe('Story + evidence');
  });

  it('Transfer is defined, because partner.mustNeverSee is a scope that leaves it undefined', () => {
    expect(TRANSFER_NOTE.length).toBeGreaterThan(0);
    expect(TRANSFER_NOTE.toLowerCase()).toContain('decisions');
  });

  it('no focus asserts whose module it is — that is agreed per community, not published', () => {
    for (const f of PORTAL_MODULE_FOCUS) {
      expect(f.does.toLowerCase()).not.toMatch(/\b(we own|you own|goods owns|community-owned)\b/);
    }
  });
});
