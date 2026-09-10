import { describe, expect, it } from 'vitest';
import { placeEvidence } from './place-evidence';
import { needsAPerson } from './place-decision';
import { COMMUNITY_BED_CANON } from './community-canonical';
import { COMMUNITY_NEED, COMMUNITY_NEED_GAPS } from './community-need';

const bare = { demandRows: 0, crmDealRows: 0, registerRows: 0 };
const rowFor = (rows: ReturnType<typeof placeEvidence>, fact: string) => {
  const r = rows.find((x) => x.fact === fact);
  if (!r) throw new Error(`no row for "${fact}"`);
  return r;
};

describe('a CRM stage never becomes a request', () => {
  it('leaves the authorised request unavailable however many deals are linked', () => {
    for (const deals of [0, 1, 7]) {
      const rows = placeEvidence({ ...bare, communityId: 'palm-island', crmDealRows: deals });
      expect(rowFor(rows, 'A current authorised request').state).toBe('unavailable');
    }
  });

  it('names the deals as the reason someone might think otherwise', () => {
    const rows = placeEvidence({ ...bare, communityId: 'maningrida', crmDealRows: 2 });
    const note = rowFor(rows, 'A current authorised request').note ?? '';
    expect(note).toMatch(/internal coordination/i);
    expect(note).toMatch(/does not establish a request/i);
    expect(note).toMatch(/2 CRM deals are linked/);
  });

  it('never emits a row whose fact asserts a request exists', () => {
    const rows = placeEvidence({ ...bare, communityId: 'utopia', crmDealRows: 3, demandRows: 4 });
    for (const r of rows) {
      if (r.state === 'verified') expect(r.fact).not.toMatch(/request|authority|consent|order/i);
    }
  });
});

describe('missing authority stays missing', () => {
  it('is unavailable for every community, and says what is absent', () => {
    for (const id of ['utopia', 'palm-island', 'nowhere-at-all']) {
      const row = rowFor(placeEvidence({ ...bare, communityId: id }), 'Who holds authority here');
      expect(row.state).toBe('unavailable');
      expect(row.note).toMatch(/Absence stays absence/i);
    }
  });

  it('gives every unavailable row a note, so absence is never a blank', () => {
    const rows = placeEvidence({ ...bare, communityId: 'nowhere-at-all' });
    for (const r of rows.filter((x) => x.state === 'unavailable')) {
      expect(r.note && r.note.length > 0).toBe(true);
    }
  });

  it('reports no beds as unavailable rather than zero', () => {
    const row = rowFor(
      placeEvidence({ ...bare, communityId: 'nowhere-at-all' }),
      'Beds delivered and recorded',
    );
    expect(row.state).toBe('unavailable');
    expect(row.note).not.toMatch(/\b0\b/);
  });
});

describe('freshness is kept apart from truth', () => {
  it('marks the Census figure stale, never partial, and dates it', () => {
    const withNeed = COMMUNITY_NEED[0];
    const row = rowFor(
      placeEvidence({ ...bare, communityId: withNeed.communityId }),
      'Overcrowding, the measure that sizes the setting',
    );
    expect(row.state).toBe('stale');
    expect(row.asAt).toBe('2021-08-10');
  });

  it('uses the recorded reason where the ABS pack cannot honestly cover a place', () => {
    const gap = COMMUNITY_NEED_GAPS[0];
    const row = rowFor(
      placeEvidence({ ...bare, communityId: gap.communityId }),
      'Overcrowding, the measure that sizes the setting',
    );
    expect(row.state).toBe('unavailable');
    expect(row.note).toBe(gap.reason);
  });
});

describe('a canonical bed count is verified and cites its ruling', () => {
  it('carries the ruling verbatim so a reader can chase it', () => {
    const canon = COMMUNITY_BED_CANON[0];
    const row = rowFor(
      placeEvidence({ ...bare, communityId: canon.id, registerRows: 12 }),
      'Beds delivered and recorded',
    );
    expect(row.state).toBe('verified');
    expect(row.source).toContain(canon.ruling);
  });

  it('leaves register rows unruled when no canonical count exists', () => {
    const row = rowFor(
      placeEvidence({ ...bare, communityId: 'nowhere-at-all', registerRows: 5 }),
      'Beds delivered and recorded',
    );
    expect(row.state).toBe('partial');
    expect(row.note).toMatch(/unruled/i);
  });
});

describe('a question never asked is not a filing failure', () => {
  it('tells a served community the sweep was never about it', () => {
    const served = COMMUNITY_BED_CANON[0];
    const row = rowFor(
      placeEvidence({ ...bare, communityId: served.id }),
      'Population and the body that runs housing procurement',
    );
    expect(row.state).toBe('unavailable');
    expect(row.note).toMatch(/never in its scope/i);
    expect(row.note).not.toMatch(/Not covered by the March 2026 research sweep/);
  });

  it('still says not covered for a place that was in scope and missed', () => {
    const row = rowFor(
      placeEvidence({ ...bare, communityId: 'nowhere-at-all' }),
      'Population and the body that runs housing procurement',
    );
    expect(row.note).toMatch(/Not covered by the March 2026 research sweep/);
  });
});

describe('recorded demand is an ask, never an order', () => {
  it('says so on the row', () => {
    const row = rowFor(placeEvidence({ ...bare, communityId: 'utopia', demandRows: 3 }), 'A recorded ask');
    expect(row.state).toBe('partial');
    expect(row.note).toMatch(/not an order/i);
  });
});

describe('conflicts are quarantined, not averaged away', () => {
  it('surfaces the three-way Utopia bed definition', () => {
    const rows = placeEvidence({ ...bare, communityId: 'utopia' });
    const c = rows.find((r) => r.state === 'conflicted');
    expect(c).toBeDefined();
    expect(c?.note).toMatch(/147/);
    expect(c?.note).toMatch(/107/);
    expect(c?.note).toMatch(/68/);
  });

  it('keeps the Tennant Creek quarantine and the Palm Island contradiction', () => {
    for (const id of ['tennant-creek', 'palm-island']) {
      const rows = placeEvidence({ ...bare, communityId: id });
      expect(rows.some((r) => r.state === 'conflicted')).toBe(true);
    }
  });

  it('dates every conflict, because each one is waiting to be ruled', () => {
    const rows = placeEvidence({ ...bare, communityId: 'utopia' });
    for (const r of rows.filter((x) => x.state === 'conflicted')) {
      expect(r.asAt).toBeTruthy();
      expect(r.source).toMatch(/GRANTSCOPE/);
    }
  });
});

describe('the read hands a person the rows that need them', () => {
  it('picks up conflicted, unavailable and awaiting-review together', () => {
    const rows = placeEvidence({ ...bare, communityId: 'utopia', demandRows: 2, crmDealRows: 1 });
    const forAPerson = needsAPerson(rows);
    expect(forAPerson.length).toBeGreaterThan(0);
    for (const r of forAPerson) {
      expect(['conflicted', 'unavailable', 'awaiting-review']).toContain(r.state);
    }
  });

  it('returns rows and offers no total to sort communities by', () => {
    const rows = placeEvidence({ ...bare, communityId: 'utopia' });
    expect(Array.isArray(needsAPerson(rows))).toBe(true);
  });
});
