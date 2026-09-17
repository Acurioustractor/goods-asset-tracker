import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseAsAt, formatAsAt, ageInDays, isStale, describeAsAt } from './as-at';

const NOW = new Date(Date.UTC(2026, 8, 17)); // 17 September 2026

describe('a date is a date', () => {
  it('reads a day, a month and a year, and says which', () => {
    expect(parseAsAt('2026-09-17')?.precision).toBe('day');
    expect(parseAsAt('2026-09')?.precision).toBe('month');
    expect(parseAsAt('2026')?.precision).toBe('year');
  });

  it('refuses every shape that used to be stored in a date field', () => {
    for (const v of [
      'May 2026', 'Sept 2026', '2026-2027', '2026-09 to 11', '11 November',
      'after a sustained production run', 'Last 30 days, to 4 June 2026 (Vercel Analytics)',
      'Today, any council', '', '   ', null, undefined,
    ]) {
      expect(parseAsAt(v as string), String(v)).toBeNull();
    }
  });

  it('refuses a day that does not exist instead of rounding it forward', () => {
    expect(parseAsAt('2026-02-31')).toBeNull();
    expect(parseAsAt('2026-13-01')).toBeNull();
    expect(parseAsAt('2026-00')).toBeNull();
  });

  it('formats one way, and identically on a server and in a browser', () => {
    expect(formatAsAt('2026-09-17')).toBe('17 Sep 2026');
    expect(formatAsAt('2026-09')).toBe('Sep 2026');
    expect(formatAsAt('2026')).toBe('2026');
    expect(formatAsAt('May 2026')).toBe('date not held');
  });
});

describe('age and staleness', () => {
  it('counts whole days', () => {
    expect(ageInDays('2026-09-17', NOW)).toBe(0);
    expect(ageInDays('2026-09-10', NOW)).toBe(7);
    expect(ageInDays('not a date', NOW)).toBeNull();
  });

  it('a stamp with no staleAfterDays is never stale, because nobody has said how fast it moves', () => {
    expect(isStale({ asAt: '2020-01-01', source: 's', check: 'manual' }, NOW)).toBe(false);
  });

  it('a stamp goes stale only once it is past its own window', () => {
    const s = { asAt: '2026-08-17', source: 's', check: 'auto', staleAfterDays: 60 } as const;
    expect(isStale(s, NOW)).toBe(false);
    expect(isStale({ ...s, staleAfterDays: 7 }, NOW)).toBe(true);
  });

  it('says how long ago only once that is worth saying', () => {
    const s = (asAt: string) => describeAsAt({ asAt, source: 's', check: 'auto' }, NOW);
    expect(s('2026-09-17')).toBe('Read 17 Sep 2026');
    expect(s('2026-09-10')).toBe('Read 10 Sep 2026');
    expect(s('2026-08-01')).toBe('Read 1 Aug 2026, 7 weeks ago');
    expect(s('2026-03-01')).toBe('Read 1 Mar 2026, 7 months ago');
  });
});

/**
 * The ratchet. `toLocaleDateString` is how eight different date formats got into the repo, so the
 * count of files using it may fall and never rise. Format through `formatAsAt` instead.
 */
describe('nobody adds a ninth date format', () => {
  const BASELINE = 52;

  const walk = (dir: string): string[] => {
    const out: string[] = [];
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) out.push(...walk(full));
      else if (/\.tsx?$/.test(e.name)) out.push(full);
    }
    return out;
  };

  it(`at most ${BASELINE} files format a date by hand, and the number only goes down`, () => {
    const root = join(process.cwd(), 'src');
    const users = walk(root).filter((f) => /toLocaleDateString|Intl\.DateTimeFormat/.test(readFileSync(f, 'utf8')));
    expect(
      users.length,
      `Was ${BASELINE}. Use formatAsAt from lib/data/as-at.ts, then lower BASELINE to ${users.length}.`,
    ).toBeLessThanOrEqual(BASELINE);
  });
});

/**
 * The other half of the ratchet. Five of ninety-seven admin pages carried a freshness stamp when
 * the sweep counted them, and four of those five were hardcoded strings. This counts pages on the
 * real contract, and the number may only go up.
 */
describe('freshness stamps spread', () => {
  const FLOOR = 2;

  const walk = (dir: string): string[] => {
    const out: string[] = [];
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) out.push(...walk(full));
      else if (/\.tsx?$/.test(e.name)) out.push(full);
    }
    return out;
  };

  it(`at least ${FLOOR} admin surface carries a real stamp, and the number only goes up`, () => {
    const files = walk(join(process.cwd(), 'src', 'app', 'admin'));
    const stamped = files.filter((f) => /from '@\/lib\/data\/as-at'|from '@\/components\/ui\/as-at'/.test(readFileSync(f, 'utf8')));
    expect(
      stamped.length,
      `Was ${FLOOR}. Put a stamp on another surface, then raise FLOOR to ${stamped.length}.`,
    ).toBeGreaterThanOrEqual(FLOOR);
  });
});
