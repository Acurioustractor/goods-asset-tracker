import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Every /api/admin/* route must authenticate.
 *
 * On 17 September 2026, 21 of 38 admin route files had no auth check at all.
 * Fourteen of them accepted writes. The worst was
 * `PATCH /api/admin/assets/[unique_id]`: no check in 117 lines, using the
 * service-role client (so RLS does not apply), writing the asset register,
 * with `recipient_name` and `recipient_consent_at` among its editable fields.
 * Consent data, writable by anyone, in a public repo.
 *
 * Nothing failed, because nothing was checking. This test checks.
 *
 * It reads source rather than calling the routes on purpose: requireAdmin has a
 * localhost bypass for development, so a request-level test would pass in CI
 * whether or not the guard existed.
 */

const API_ADMIN = path.join(__dirname, '../../app/api/admin');

/**
 * Routes allowed to authenticate some other way. Each needs a reason, and the
 * reason has to be about how the caller proves who it is.
 */
const ALTERNATIVE_AUTH: Record<string, string> = {
  'gmail-sync/route.ts':
    'Bearer CRON_SECRET, so the same token works for the scheduled caller and for a person.',
};

function adminRouteFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) adminRouteFiles(full, acc);
    else if (entry.name === 'route.ts') acc.push(path.relative(API_ADMIN, full));
  }
  return acc;
}

const HANDLER = /export async function (GET|POST|PUT|DELETE|PATCH)\b/g;

describe('every /api/admin route authenticates', () => {
  const files = adminRouteFiles(API_ADMIN);

  it('finds the admin routes at all', () => {
    expect(files.length).toBeGreaterThan(20);
  });

  for (const rel of files) {
    it(rel, () => {
      const src = fs.readFileSync(path.join(API_ADMIN, rel), 'utf8');

      if (rel in ALTERNATIVE_AUTH) {
        // Still has to check something.
        const authenticates =
          src.includes('CRON_SECRET') ||
          src.includes('ADMIN_API_KEY') ||
          src.includes('requireAdmin');
        expect(authenticates, `${rel} is allowlisted but checks nothing`).toBe(true);
        return;
      }

      const handlers = src.match(HANDLER) ?? [];
      if (handlers.length === 0) return; // no exported handler, nothing to guard

      expect(
        src.includes('requireAdmin('),
        `${rel} exports ${handlers.length} handler(s) and never calls requireAdmin. ` +
          'Add `const guard = await requireAdmin(); if (guard) return guard;` at the top of each ' +
          'handler, or add an entry to ALTERNATIVE_AUTH with the reason.',
      ).toBe(true);

      // One guard per handler: a file with two handlers and one guard leaves a
      // hole, which is how the GET on linkedin-import stayed open.
      const guards = (src.match(/requireAdmin\(/g) ?? []).length;
      expect(
        guards,
        `${rel} has ${handlers.length} handler(s) but only ${guards} requireAdmin call(s)`,
      ).toBeGreaterThanOrEqual(handlers.length);
    });
  }
});
