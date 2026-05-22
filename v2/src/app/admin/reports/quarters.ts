/**
 * Hardcoded calendar quarters that the report generator supports. Trip
 * reports usually align to quarters, so this is the unit users pick from
 * the admin UI.
 */
export const QUARTERS: Record<string, { start: string; end: string; label: string }> = {
  '2026-Q1': { start: '2026-01-01', end: '2026-03-31', label: 'Q1 2026' },
  '2026-Q2': { start: '2026-04-01', end: '2026-06-30', label: 'Q2 2026' },
  '2026-Q3': { start: '2026-07-01', end: '2026-09-30', label: 'Q3 2026' },
  '2026-Q4': { start: '2026-10-01', end: '2026-12-31', label: 'Q4 2026' },
};
