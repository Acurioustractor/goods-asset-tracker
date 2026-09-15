import { describe, expect, it } from 'vitest';
import { goodsBoard as DIRECTORS } from './goods-board';
import { ORGANISATION } from './organisation';
import { GOVERNANCE } from './pitch-chapters';

const TEAM = GOVERNANCE.staff;

describe('who Goods on Country is', () => {
  it('names one entity with a checkable ABN', () => {
    expect(ORGANISATION.legalName).toBe('Goods on Country Ltd');
    expect(ORGANISATION.identityLine).not.toMatch(/registered business name/i);
    expect(ORGANISATION.abn.replace(/\s/g, '')).toMatch(/^\d{11}$/);
    expect(ORGANISATION.abnLookupUrl).toContain(ORGANISATION.abn.replace(/\s/g, ''));
    expect(ORGANISATION.abn.replace(/\s/g, '').endsWith(ORGANISATION.acn.replace(/\s/g, ''))).toBe(true);
  });
  it('never names a Goods chair, and never presents Goods. as a separate seller', () => {
    // Directors may chair other bodies (Audrey chairs Ngak Min Health); nobody chairs this board yet.
    for (const d of DIRECTORS) expect(d.role, d.name).toBe('Director');
    expect(JSON.stringify(ORGANISATION)).not.toMatch(/\bchair\b(?! has been appointed)/i);
    expect(JSON.stringify({ ORGANISATION, TEAM })).not.toMatch(/Goods\. (makes|sells|is a)/);
  });
  it('keeps the founders as staff, never as directors', () => {
    const directors = DIRECTORS.map((d) => d.name);
    for (const s of TEAM) expect(directors).not.toContain(s.name);
  });
  it('prints the same board line as the pitch', () => {
    expect(ORGANISATION.boardLine).toBe(GOVERNANCE.line);
  });
  it('writes community membership of the charity as proposed until the constitution says otherwise', () => {
    const m = ORGANISATION.membership;
    expect(m.status).toBe('proposed');
    for (const s of [m.title, m.line, m.why, m.state, m.short]) {
      expect(s, s).not.toMatch(/\b(are|became|have become|is now a) members?\b/i);
    }
    expect(`${m.title} ${m.line} ${m.short}`).toMatch(/proposed|working on/i);
    expect(GOVERNANCE.members).toContain(m.line);
  });
  it('carries no em dashes', () => {
    expect(JSON.stringify(ORGANISATION)).not.toContain('—');
  });
});
