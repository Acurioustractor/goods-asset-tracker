import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  PLACE_DENOMINATORS,
  askedTotal,
  denominatorFor,
  needsARule,
  settingSize,
  type Denominator,
} from './place-denominator';
import { COMMUNITY_NEED } from './community-need';

const SRC = readFileSync(join(__dirname, 'place-denominator.ts'), 'utf8');

describe('a bed number cannot exist without a rule and a person', () => {
  it('every set row carries beds, a rule and who set it', () => {
    for (const d of PLACE_DENOMINATORS) {
      if (d.kind !== 'set') continue;
      expect(d.beds).toBeGreaterThan(0);
      expect(d.rule.trim().length).toBeGreaterThan(10);
      expect(d.setBy.trim().length).toBeGreaterThan(2);
      expect(d.source.trim().length).toBeGreaterThan(5);
    }
  });

  it('every unset row says why, and never silently drops a figure it knows about', () => {
    for (const d of PLACE_DENOMINATORS) {
      if (d.kind !== 'unset') continue;
      expect(d.reason.trim().length).toBeGreaterThan(20);
    }
  });

  it('has no shape that allows beds without a rule', () => {
    // If DenominatorSet ever gains an optional rule, an unattributed number becomes representable
    // and the whole point of the module goes.
    expect(SRC).toMatch(/interface DenominatorSet \{[^}]*\brule: string;/);
    expect(SRC).toMatch(/interface DenominatorSet \{[^}]*\bsetBy: string;/);
    expect(SRC).not.toMatch(/interface DenominatorSet \{[^}]*rule\?: /);
    expect(SRC).not.toMatch(/interface DenominatorSet \{[^}]*setBy\?: /);
  });
});

describe('overcrowding is never turned into beds', () => {
  it('exports no function that takes need and returns a bed count', () => {
    const fns = (SRC.match(/^export function (\w+)/gm) ?? []).map((l) =>
      l.replace('export function ', ''),
    );
    expect(fns.sort()).toEqual(['askedTotal', 'denominatorFor', 'needsARule', 'settingSize'].sort());
    for (const f of fns) {
      expect(f).not.toMatch(/derive|estimate|project|forecast|implied|target/i);
    }
  });

  it('never multiplies overcrowding by anything', () => {
    // The only arithmetic allowed on the ABS extract is dwellings x persons, which yields a
    // population. Any product involving need1plus would be a derived bed number.
    expect(SRC).not.toMatch(/need1plus\s*\*/);
    expect(SRC).not.toMatch(/\*\s*need1plus/);
  });

  it('holds the line Utopia proves', () => {
    const utopia = COMMUNITY_NEED.find((n) => n.communityId === 'utopia');
    expect(utopia).toBeDefined();
    // 34 dwellings needing a bedroom against 147 beds already delivered. If a future edit ever
    // makes these look reconcilable, this test should be the thing that objects.
    expect(utopia!.need1plus).toBe(34);
    const size = settingSize('utopia', 147);
    expect(size.dwellingsNeedingBedrooms).toBe(34);
    expect(size.deliveredBeds).toBe(147);
    expect(size.deliveredBeds! / size.dwellingsNeedingBedrooms!).toBeGreaterThan(4);
  });
});

describe('the four measures sit beside each other', () => {
  it('returns population, overcrowding, asked and delivered without combining them', () => {
    const s = settingSize('tennant-creek', null);
    expect(s.peopleApprox).toBe(2549);
    expect(s.dwellingsNeedingBedrooms).toBe(90);
    expect(s.askedBeds).toBe(20);
    expect(s.deliveredBeds).toBeNull();
  });

  it('leaves asked null where no rule has been set, even when a figure is known', () => {
    const s = settingSize('utopia', 147);
    expect(s.askedBeds).toBeNull();
    const d = denominatorFor('utopia');
    expect(d?.kind).toBe('unset');
    expect(d?.kind === 'unset' && d.unattributedFigure).toBe(150);
  });

  it('returns nulls rather than zeros for a place with no ABS row', () => {
    const s = settingSize('nowhere-at-all', null);
    expect(s.peopleApprox).toBeNull();
    expect(s.dwellingsNeedingBedrooms).toBeNull();
  });
});

describe('the only total is what communities actually asked for', () => {
  it('sums set rows and nothing else', () => {
    const t = askedTotal();
    const set = PLACE_DENOMINATORS.filter((d) => d.kind === 'set');
    expect(t.places).toBe(set.length);
    expect(t.beds).toBe(set.reduce((a, d) => a + (d.kind === 'set' ? d.beds : 0), 0));
  });

  it('excludes every unattributed figure, however large', () => {
    const unattributed = PLACE_DENOMINATORS.reduce(
      (a, d) => a + (d.kind === 'unset' ? (d.unattributedFigure ?? 0) : 0),
      0,
    );
    expect(unattributed).toBeGreaterThan(0);
    expect(askedTotal().beds).toBeLessThan(unattributed);
  });

  it('as at 10 September 2026, one place has a rule and the number is 20', () => {
    // This will change, and it should change by someone bringing back a name, not by an edit here.
    expect(askedTotal()).toEqual({ beds: 20, places: 1 });
  });
});

describe('the work list is the conversations still to have', () => {
  it('lists every place carrying a figure nobody owns', () => {
    const list = needsARule().map((d) => d.communityId).sort();
    expect(list).toEqual(['groote-archipelago', 'maningrida', 'palm-island', 'utopia']);
  });

  it('keeps Groote out of any total and says why', () => {
    const groote = PLACE_DENOMINATORS.find(
      (d): d is Extract<Denominator, { kind: 'unset' }> =>
        d.communityId === 'groote-archipelago' && d.kind === 'unset',
    );
    expect(groote?.reason).toMatch(/enquiry/i);
    expect(groote?.unattributedFigure).toBe(500);
  });
});
