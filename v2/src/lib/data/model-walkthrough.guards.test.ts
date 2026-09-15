import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { FLOWS } from './model-placemat';
import { LOOP_ARCS, LOOP_STATIONS, LOOP_STEPS } from './model-walkthrough';

const pub = (src: string) => path.join(process.cwd(), 'public', src);

describe('the model loop', () => {
  it('uses only kit drawings and photographs that are on disk', () => {
    for (const s of LOOP_STATIONS) if (s.piece) {
      expect(s.piece.src.startsWith('/images/model/kit/'), s.id).toBe(true);
      expect(existsSync(pub(s.piece.src)), s.piece.src).toBe(true);
    }
    for (const s of LOOP_STEPS) if (s.centre.kind === 'photo') expect(existsSync(pub(s.centre.src)), s.centre.src).toBe(true);
  });
  it('labels every arc with the placemat label for that flow', () => {
    for (const a of LOOP_ARCS) {
      const flow = FLOWS.find((f) => f.from === a.from && f.to === a.to);
      expect(flow?.label, `${a.from}>${a.to}`).toBe(a.label);
    }
  });
  it('adds every station and draws every arc exactly once, each arc after both its stations', () => {
    const added = LOOP_STEPS.flatMap((s) => s.adds);
    expect([...added].sort()).toEqual(LOOP_STATIONS.map((s) => s.id).sort());
    const drawn = LOOP_STEPS.flatMap((s) => s.arcs);
    expect([...drawn].sort()).toEqual(LOOP_ARCS.map((a) => `${a.from}>${a.to}`).sort());
    LOOP_STEPS.forEach((step, i) => {
      const seen = new Set(LOOP_STEPS.slice(0, i + 1).flatMap((s) => s.adds));
      for (const arc of step.arcs) for (const end of arc.split('>')) expect(seen.has(end as never), `${step.id}: ${arc}`).toBe(true);
    });
  });
  it('reads the raise from the placemat, loan inside the ask, and clips it to the right stations', () => {
    const raise = LOOP_STEPS[0];
    expect(raise.title).toBe('Asked $750,000.');
    expect(raise.money?.map((m) => `${m.label} ${m.amount}`)).toEqual(['QBE $300,000', 'Beds $300,000', 'Loan $150,000']);
    expect(LOOP_STATIONS.find((s) => s.id === 'harvest')?.tag).toBe('Beds $300,000 · Loan $150,000');
    expect(LOOP_STATIONS.find((s) => s.id === 'facility')?.tag).toBe('QBE $300,000');
  });
  it('carries no em dashes', () => {
    for (const s of LOOP_STEPS) expect([s.kicker, s.title, ...s.lines].join(' ')).not.toContain('—');
  });
});
