import { describe, expect, it } from 'vitest';
import { BED, RAISE } from './model-placemat';
import { BED_WAYS, MONEY_LANES, MONEY_NEVER, MONEY_TOTAL } from './money-lanes';
import { BED_SPLIT } from './pitch-chapters';

describe('the money lanes', () => {
  it('add to the ask, loan inside', () => {
    expect(MONEY_LANES.reduce((n, l) => n + l.source.amount, 0)).toBe(RAISE.totalShownAud);
    expect(MONEY_TOTAL.parts.reduce((n, p) => n + p.amount, 0)).toBe(MONEY_TOTAL.amount);
    expect(MONEY_TOTAL.amount).toBe(750_000);
  });
  it('every line carries its label from the money-flow sheet', () => {
    for (const l of MONEY_LANES) {
      expect(l.first, `${l.id} first`).not.toBe('');
      expect(l.second, `${l.id} second`).not.toBe('');
    }
    expect(MONEY_NEVER.title).toBe('no money back to Goods');
  });
  it('splits a bed into exactly its price', () => {
    expect(BED_SPLIT.reduce((n, s) => n + s.aud, 0)).toBe(BED.priceAud);
    expect(BED_WAYS.goods.line).toContain(`$${BED.contributionAud}`);
  });
  it('carries no em dashes', () => {
    const words = MONEY_LANES.flatMap((l) => [l.source.kicker, l.source.named, l.buys.title, l.buys.line, l.endsUp.title, l.endsUp.line, l.first, l.second]);
    expect(words.join(' ')).not.toContain('—');
  });
});
