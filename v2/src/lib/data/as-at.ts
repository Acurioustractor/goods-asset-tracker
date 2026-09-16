/**
 * ONE DATE CONTRACT. When was this read, where from, and who has to re-read it.
 *
 * Ben, 17 September 2026, after the admin sweep. What the sweep counted:
 *
 *   Nine field names for "when" in lib/data alone: `date` 150 uses, `when` 148, `asOf` 86,
 *   `since` 82, then readAt, lastUpdated, generatedAt, updatedAt and confirmedAt.
 *
 *   At least eight stored value shapes: 2026-09-17, 2026-09, 2026, 2026-2027, "May 2026",
 *   "Sept 2026", "2026-09 to 11", and free prose ("after a sustained production run").
 *
 *   Eight distinct `toLocaleDateString('en-AU', {...}) option shapes across 52 files, plus 17
 *   bare calls with no options. No shared formatter existed anywhere in the repo.
 *
 *   Five of ninety-seven admin pages showed any freshness stamp, and four of those five were
 *   hardcoded strings that cannot move when the data does.
 *
 * THE CONTRACT IS BORROWED. `canon.ts` has carried the right shape per fact since
 * July: `source` (where the truth lives), `asAt` (ISO date last confirmed against it), `check`
 * ('auto' means a script can re-derive it, 'manual' means a human must re-pull), and `owner`.
 * This file makes that shape available to a whole surface instead of a single number, and gives
 * it one formatter so two pages cannot disagree about what a date looks like.
 *
 * A DATE IS A DATE AND A LABEL IS A LABEL. `asAt` accepts a day, a month or a year, and nothing
 * else. "May 2026" and "after a sustained production run" are labels, and a label belongs beside
 * beside the date. `procurement-openings.ts` already does this correctly with
 * `when: '2026-09'` next to `whenLabel: 'September to November 2026'`, and it is the pattern to
 * copy. A field that is sometimes sortable and sometimes prose is neither.
 */

/** 'auto' = a drift script can re-derive from a live source. 'manual' = a human must re-pull. */
export type CheckMode = 'auto' | 'manual';

export type AsAtPrecision = 'day' | 'month' | 'year';

export interface AsAt {
  /** YYYY-MM-DD, YYYY-MM or YYYY. Nothing else, and never prose. */
  asAt: string;
  /** Where the truth actually lives: a table, a file, a workbook, a system. */
  source: string;
  check: CheckMode;
  /** Who re-reads it when it goes stale. Omit when it is nobody's job yet, which is worth seeing. */
  owner?: string;
  /** Days after which this should be re-read. Omit when the source does not move. */
  staleAfterDays?: number;
}

const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH = /^(\d{4})-(\d{2})$/;
const YEAR = /^(\d{4})$/;

export interface ParsedAsAt {
  date: Date;
  precision: AsAtPrecision;
}

/**
 * Parse a stamp, or return null. Null means the string is not a date, which is the answer for
 * every label that used to be stored in a date field.
 */
export function parseAsAt(value: string | null | undefined): ParsedAsAt | null {
  if (!value) return null;
  const v = value.trim();
  const day = DAY.exec(v);
  if (day) {
    const d = new Date(Date.UTC(+day[1], +day[2] - 1, +day[3]));
    // Rejects 2026-02-31 and friends, which round forward silently otherwise.
    if (d.getUTCMonth() !== +day[2] - 1 || d.getUTCDate() !== +day[3]) return null;
    return { date: d, precision: 'day' };
  }
  const month = MONTH.exec(v);
  if (month) {
    if (+month[2] < 1 || +month[2] > 12) return null;
    return { date: new Date(Date.UTC(+month[1], +month[2] - 1, 1)), precision: 'month' };
  }
  const year = YEAR.exec(v);
  if (year) return { date: new Date(Date.UTC(+year[1], 0, 1)), precision: 'year' };
  return null;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The one date format in this repo: "17 Sep 2026", "Sep 2026", "2026". Short enough for a table
 * cell, unambiguous between Australian and American readers, and identical on the server and in
 * the browser, which `toLocaleDateString` is not.
 */
export function formatAsAt(value: string | null | undefined): string {
  const p = parseAsAt(value);
  if (!p) return 'date not held';
  const m = MONTHS[p.date.getUTCMonth()];
  const y = p.date.getUTCFullYear();
  if (p.precision === 'year') return String(y);
  if (p.precision === 'month') return `${m} ${y}`;
  return `${p.date.getUTCDate()} ${m} ${y}`;
}

/** Whole days between the stamp and now. Null when the stamp is not a date. */
export function ageInDays(value: string | null | undefined, now: Date = new Date()): number | null {
  const p = parseAsAt(value);
  if (!p) return null;
  return Math.floor((now.getTime() - p.date.getTime()) / 86_400_000);
}

/**
 * A stamp is stale when it is older than its own `staleAfterDays`. A stamp with no
 * `staleAfterDays` is never stale, because nobody has said how fast its source moves. That is a
 * gap worth seeing, and a default would only hide it.
 */
export function isStale(stamp: AsAt, now: Date = new Date()): boolean {
  if (!stamp.staleAfterDays) return false;
  const age = ageInDays(stamp.asAt, now);
  return age !== null && age > stamp.staleAfterDays;
}

/** "Read 17 Sep 2026" and, once it is over a fortnight old, how long ago that was. */
export function describeAsAt(stamp: AsAt, now: Date = new Date()): string {
  const age = ageInDays(stamp.asAt, now);
  const base = `Read ${formatAsAt(stamp.asAt)}`;
  if (age === null || age < 14) return base;
  if (age < 60) return `${base}, ${Math.round(age / 7)} weeks ago`;
  return `${base}, ${Math.round(age / 30)} months ago`;
}
