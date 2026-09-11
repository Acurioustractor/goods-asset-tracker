import { describe, expect, it } from 'vitest';
import { SCENARIOS, bedsADay, bedsAMonth, monthsFor, limitedBy, boughtBedsAMonth, pressedBedsAMonth, shredKgAMonth, shredKgOverRun, boughtBedsOverRun, bagsOverRun, capitalAud, knownSpendOverRun, boughtPlasticAMonthAud, breakEvenShredPriceKg, PRESSED_KG_PER_BED, ASSEMBLY_BEDS_A_DAY } from './production-scenarios';
import { factoryKitsADay } from './production-route';
const S = (id: string) => SCENARIOS.find(s => s.id === id)!;
describe('the current dispatch route', () => {
  it('one tab sheet per kit supports six per day and 96 per month', () => {
    expect(bedsADay(S('A'))).toBe(6);
    expect(bedsAMonth(S('A'))).toBe(96);
    expect(monthsFor(S('A'), 400)).toBeCloseTo(4.16666667);
    expect(limitedBy(S('A'))).toBe('Tab press');
  });
  it('purchased leg stock does not create extra kits above tab capacity', () => {
    expect(bedsADay(S('B'))).toBe(bedsADay(S('A')));
    expect(bedsADay(S('E'))).toBe(bedsADay(S('A')));
  });
  it('two presses reach the router, without a factory assembly cap', () => {
    expect(ASSEMBLY_BEDS_A_DAY).toBeNull();
    expect(bedsADay(S('C'))).toBe(8.56);
    expect(bedsAMonth(S('C'))).toBe(136);
    expect(limitedBy(S('C'))).toBe('The router');
    expect(bedsADay(S('D'))).toBe(bedsADay(S('C')));
  });
  it('zero press capacity stays zero and invalid capacity is rejected', () => {
    expect(factoryKitsADay(0)).toBe(0);
    expect(() => factoryKitsADay(-1)).toThrow();
    expect(() => factoryKitsADay(NaN)).toThrow();
  });
  it('bought legs and pressed tabs belong to the same kits', () => {
    for (const s of SCENARIOS) {
      expect(boughtBedsAMonth(s)).toBe(bedsAMonth(s));
      expect(pressedBedsAMonth(s)).toBe(bedsAMonth(s));
      expect(boughtBedsOverRun(s, 400)).toBe(400);
    }
  });
  it('only tab mass enters factory shred demand, with no recovery credit', () => {
    expect(PRESSED_KG_PER_BED).toBe(15);
    expect(shredKgAMonth(S('A'))).toBe(1440);
    expect(shredKgOverRun(S('A'), 400)).toBe(6000);
    expect(bagsOverRun(S('A'), 400)).toBe(6);
  });
  it('changing press count changes time, not material per kit', () => {
    expect(shredKgOverRun(S('A'), 400)).toBe(shredKgOverRun(S('C'), 400));
    expect(monthsFor(S('C'), 400)).toBeLessThan(monthsFor(S('A'), 400));
  });
  it('unknown purchased-leg costs propagate instead of becoming zero', () => {
    expect(knownSpendOverRun(S('A'), 400)).toBeNull();
    expect(knownSpendOverRun(S('C'), 400)).toBeNull();
    expect(boughtPlasticAMonthAud(S('B'))).toBeNull();
    expect(capitalAud(S('C'))).toBe(22500);
    expect(knownSpendOverRun(S('E'), 400)).toBeCloseTo(400 * 344.05);
  });
  it('the superseded press-versus-leg-panel break-even stays withdrawn', () => {
    expect(breakEvenShredPriceKg(400)).toBeNull();
    expect(breakEvenShredPriceKg(800)).toBeNull();
  });
});
