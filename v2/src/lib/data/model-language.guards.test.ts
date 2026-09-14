import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NEED_AUD } from './the-year-and-the-raise';
import {
  KEPT,
  LINES,
  RETIRED,
  THE_TEST,
  THE_THESIS,
  WHY_RETIRED_LINES_ARE_KEPT,
  forSurface,
} from './model-language';

const SRC = readFileSync(join(__dirname, 'model-language.ts'), 'utf8');

describe('every line is judged', () => {
  it('carries a verdict, a surface and a reason', () => {
    for (const l of LINES) {
      expect(l.said.length).toBeGreaterThan(10);
      expect(l.why.length).toBeGreaterThan(60);
      expect(['keep', 'sharpen', 'retire']).toContain(l.verdict);
    }
  });

  it('a retired line has no usable version and a kept line always does', () => {
    for (const l of LINES) {
      if (l.verdict === 'retire') expect(l.use).toBeNull();
      else expect(l.use).toBeTruthy();
    }
  });

  it('four are retired and each says why', () => {
    expect(RETIRED).toHaveLength(4);
    for (const l of RETIRED) expect(l.why.length).toBeGreaterThan(80);
  });
});

describe('the retirements are the ones that matter', () => {
  it('Suncorp is retired as a fabricated buyer', () => {
    const s = RETIRED.find((l) => l.said.includes('Suncorp'))!;
    expect(s.why).toContain('Centrecorp');
    expect(s.why).toContain('fabricated claim');
  });

  it('the health dial is retired against the standing rule', () => {
    const h = RETIRED.find((l) => l.said.includes('Simple dials'))!;
    expect(h.why).toContain('never a claimed outcome');
    expect(h.why).toContain('carries no number');
  });

  it('the single loop is retired against ruling 9', () => {
    const o = RETIRED.find((l) => l.said.includes('back around'))!;
    expect(o.why).toContain('two kinds of money that never meet');
    expect(o.why).toContain('$750 stays');
  });

  it('the understated raise is retired with the real figures', () => {
    const r = RETIRED.find((l) => l.said.includes('500 and 600,000'))!;
    expect(r.why).toContain('$600,000');
    expect(r.why).toContain(`$${Math.round(NEED_AUD).toLocaleString('en-AU')}`);
    expect(r.why).not.toContain('$747,950');
  });
});

describe('the thesis', () => {
  it('there is exactly one and it is short enough to say out loud', () => {
    expect(forSurface('thesis')).toHaveLength(1);
    expect(THE_THESIS.split(/\s+/).length).toBeLessThan(20);
    expect(THE_THESIS).toContain('already wants');
  });

  it('is not the version with the doublet in it', () => {
    expect(THE_THESIS).not.toContain('want and need');
    expect(THE_THESIS).not.toContain('seed capital');
  });
});

describe('house style', () => {
  it('no kept line carries an em dash', () => {
    for (const l of KEPT) expect(l.use).not.toContain('—');
    expect(SRC).not.toContain('—');
  });

  it('no kept line uses the banned pitch vocabulary', () => {
    const banned = /\b(empower|co-?design|leverage|unlock potential|holistic)\b/i;
    for (const l of KEPT) expect(banned.test(l.use!)).toBe(false);
  });

  it('explains why retired lines are kept on the record', () => {
    expect(WHY_RETIRED_LINES_ARE_KEPT).toContain('comes back');
    expect(THE_TEST).toContain('guarded modules');
  });

  it('every kept line is filed to a surface, so it gets used once', () => {
    const surfaces = new Set(KEPT.map((l) => l.surface));
    expect(surfaces.size).toBeGreaterThanOrEqual(4);
  });
});
