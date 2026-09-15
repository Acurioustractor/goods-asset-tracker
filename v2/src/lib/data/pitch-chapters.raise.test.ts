import { describe, expect, it } from 'vitest';
import { FUNDING_LINES } from './grants';
import { RAISE } from './model-placemat';
import { RAISE_BREAKDOWN } from './pitch-chapters';

describe('the raise, line by line', () => {
  it('adds to the ask, loan inside', () => {
    expect(RAISE_BREAKDOWN.reduce((n, r) => n + r.aud, 0)).toBe(RAISE.totalAud);
    expect(RAISE_BREAKDOWN.filter((r) => r.buys.startsWith('133 beds')).reduce((n, r) => n + r.aud, 0)).toBe(RAISE.bedsAud);
  });
  it('names only funding lines that exist', () => {
    for (const r of RAISE_BREAKDOWN) expect(FUNDING_LINES.some((f) => f.id === r.line), r.line).toBe(true);
  });
});
