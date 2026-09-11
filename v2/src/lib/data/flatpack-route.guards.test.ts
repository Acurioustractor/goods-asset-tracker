import { describe, expect, it } from 'vitest';
import { SCENARIOS, bedsADay, bedsAMonth, monthsFor, shredKgOverRun, boughtBedsOverRun, BREAK_EVEN_ON_THE_400 } from './production-scenarios';
import { CANON } from './sheet-canon';

const scenario = (id: string) => SCENARIOS.find(s => s.id === id)!;
describe('Ben 12 September: tabs pressed, legs bought, assembly in community', () => {
  it('dispatches six kits per productive day without a five-bed assembly cap', () => {
    expect(bedsADay(scenario('A'))).toBe(6);
    expect(bedsAMonth(scenario('A'))).toBe(96);
    expect(monthsFor(scenario('A'), 400)).toBeCloseTo(400 / 96, 8);
  });
  it('a second press reaches the router rather than an assembly limit', () => {
    expect(bedsADay(scenario('C'))).toBe(8.56);
  });
  it('every kit still needs bought legs and only its tab sheet uses factory shred', () => {
    expect(boughtBedsOverRun(scenario('A'), 400)).toBe(400);
    expect(shredKgOverRun(scenario('A'), 400)).toBe(6000);
  });
  it('does not retain the old economic recommendation for a different route', () => {
    expect(BREAK_EVEN_ON_THE_400).toBeNull();
  });
  it('the workbook export follows the corrected route', () => {
    expect(CANON.find(c => c.key === 'line.bedsPerMonth')!.value).toBe(96);
    expect(CANON.find(c => c.key === 'bed.pressedKg')!.value).toBe(15);
  });
});
