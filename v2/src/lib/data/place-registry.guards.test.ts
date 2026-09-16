import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  PLACES, NOT_A_PLACE, placeKey, resolvePlace, resolveCommunity, isNotAPlace, placeById,
} from './place-registry';
import { makeCommunityMatcher } from './community-match';

/**
 * The registry is only worth having if a new pull cannot quietly invent a place. These guards are
 * what make it compulsory: the last one reads the live data files and fails on any place string
 * that neither resolves nor is declared a non-place on purpose.
 */

/** The 31 ids in the Supabase `communities` table, read 17 September 2026. */
const IN_LIVE_TABLE = [
  'alice-springs', 'aurukun', 'borroloola', 'canberra', 'ceduna', 'cherbourg', 'darwin', 'doomadgee',
  'galiwinku', 'groote-archipelago', 'gunbalanya', 'kalgoorlie', 'katherine', 'kowanyama', 'kununurra',
  'lajamanu', 'maningrida', 'mt-isa', 'mutitjulu', 'ngukurr', 'palm-island', 'pending-delivery',
  'port-augusta', 'ramingining', 'tennant-creek', 'torres-strait', 'utopia', 'wadeye', 'woorabinda',
  'yarrabah', 'yuendumu',
];

describe('place registry shape', () => {
  it('every id is unique and kebab-case', () => {
    const ids = PLACES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id, id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('no spelling resolves to two different places', () => {
    const owner = new Map<string, string>();
    const clashes: string[] = [];
    for (const p of PLACES) {
      for (const spelling of [p.id, p.name, ...(p.aliases ?? [])]) {
        if (!spelling) continue;
        const k = placeKey(spelling);
        const held = owner.get(k);
        if (held && held !== p.id) clashes.push(`"${spelling}" claimed by ${held} and ${p.id}`);
        owner.set(k, p.id);
      }
    }
    expect(clashes).toEqual([]);
  });

  it('every spelling resolves back to its own place', () => {
    for (const p of PLACES) {
      for (const spelling of [p.id, p.name, ...(p.aliases ?? [])]) {
        if (!spelling) continue;
        expect(resolvePlace(spelling)?.id, spelling).toBe(p.id);
      }
    }
  });

  it('a traditional name is never used as a resolution key', () => {
    // Warlpiri is Lajamanu and Yuendumu both. Indexing the column made one resolve to the other.
    const shared = PLACES.filter((p) => p.traditionalName === 'Warlpiri').map((p) => p.id);
    expect(shared.length).toBeGreaterThan(1);
    expect(resolvePlace('Warlpiri')).toBeNull();
  });

  it('every `within` points at a real place', () => {
    for (const p of PLACES) {
      if (p.within) expect(placeById(p.within), `${p.id} -> ${p.within}`).toBeDefined();
    }
  });

  it('inRegister marks exactly the rows in the live communities table', () => {
    const marked = PLACES.filter((p) => p.inRegister).map((p) => p.id).sort();
    expect(marked).toEqual([...IN_LIVE_TABLE].sort());
  });
});

describe('the resolver refuses what it should refuse', () => {
  it('a region is never an answer to "which community"', () => {
    for (const name of ['Barkly Region', 'East Arnhem', 'Big Rivers', 'Top End', 'APY Lands']) {
      expect(resolvePlace(name), name).not.toBeNull();
      expect(resolveCommunity(name), name).toBeNull();
    }
  });

  it('a jurisdiction, a building and the sentinel are not communities either', () => {
    for (const name of ['Territory wide', 'Royal Darwin Hospital', 'Pending Delivery']) {
      expect(resolveCommunity(name), name).toBeNull();
    }
  });

  it('every declared non-place resolves to null and is reported as a non-place', () => {
    for (const s of NOT_A_PLACE) {
      expect(resolvePlace(s), s).toBeNull();
      expect(isNotAPlace(s), s).toBe(true);
    }
  });

  it('a place is never also listed as a non-place', () => {
    const placeKeys = new Set(PLACES.flatMap((p) => [p.id, p.name, ...(p.aliases ?? [])]).map(placeKey));
    for (const s of NOT_A_PLACE) expect(placeKeys.has(placeKey(s)), s).toBe(false);
  });

  it('shrugs at empty input instead of throwing', () => {
    for (const v of [null, undefined, '', '   ']) expect(resolvePlace(v)).toBeNull();
  });
});

/**
 * THE GUARD THAT MAKES IT COMPULSORY. Every place string in every data file either resolves or is
 * declared a non-place. A pull that introduces a new place fails here until somebody decides which
 * it is, which is the whole point of the registry.
 */
describe('every place string in the data resolves', () => {
  const read = (rel: string) => JSON.parse(readFileSync(join(process.cwd(), rel), 'utf8'));

  const strings = (): { value: string; where: string }[] => {
    const out: { value: string; where: string }[] = [];
    const push = (v: unknown, where: string) => {
      if (typeof v === 'string' && v.trim()) out.push({ value: v.trim(), where });
    };
    for (const r of read('data/community-intel.json').communities) push(r.community, 'community-intel');
    for (const r of read('data/organisations.json').organisations) push(r.place, 'organisations');
    for (const r of read('data/procurement-buyers.json').communities) push(r.community, 'procurement-buyers');
    const nt = read('data/nt-housing-contractors.json');
    for (const r of nt.places ?? []) push(r.place, 'nt-places');
    for (const r of nt.contractors ?? []) for (const p of r.topPlaces ?? []) push(p, 'nt-contractors');
    return out;
  };

  it('resolves or is declared, with nothing in between', () => {
    const unknown = new Map<string, string>();
    for (const { value, where } of strings()) {
      if (resolvePlace(value) || isNotAPlace(value)) continue;
      if (!unknown.has(value)) unknown.set(value, where);
    }
    expect(
      [...unknown].map(([v, w]) => `${w}: "${v}"`),
      'Add each of these to PLACES, or to NOT_A_PLACE if it was never a place',
    ).toEqual([]);
  });
});

/**
 * The matcher used to carry its own alias map. These are the cases that map covered, asserted
 * against the registry so folding the two lists together cannot silently change what a media
 * title or an Empathy Ledger location resolves to.
 */
describe('community-match still resolves everything its own alias map used to', () => {
  const LIVE_COMMUNITIES = IN_LIVE_TABLE.map((id) => ({
    id,
    name: placeById(id)?.name ?? id,
    traditional_name: placeById(id)?.traditionalName ?? null,
  }));

  const cases: [string, string][] = [
    ['Mparntwe', 'alice-springs'],
    ['Oonchiumpa Consultancy', 'alice-springs'],
    ['Wumpurrarni', 'tennant-creek'],
    ['Bwgcolman', 'palm-island'],
    ['Ninga Mia', 'kalgoorlie'],
    ['Wongatha', 'kalgoorlie'],
    ['Mount Isa', 'mt-isa'],
    ['Elcho Island', 'galiwinku'],
    ['Galiwinku', 'galiwinku'],
    ['Groote Eylandt', 'groote-archipelago'],
    ['Utopia', 'utopia'],
    ['Arlparra', 'utopia'],
    ['Thursday Island', 'torres-strait'],
  ];

  it.each(cases)('%s resolves to %s', (text, id) => {
    expect(makeCommunityMatcher(LIVE_COMMUNITIES).matchText(text)).toBe(id);
  });

  /**
   * Ben, 17 September 2026: media follows the registry. The matcher used to fold these three into
   * a parent so the media had somewhere to land. Now it names the real place, and a caller keyed
   * on the live community rows finds nothing, which is the honest answer.
   */
  it.each([
    ['Ampilatwatja', 'ampilatwatja'],
    ['Angurugu', 'angurugu'],
    ['Umbakumba', 'umbakumba'],
  ])('%s resolves to itself, not to a parent', (text, id) => {
    expect(makeCommunityMatcher(LIVE_COMMUNITIES).matchText(text)).toBe(id);
    expect(resolvePlace(text)?.id).toBe(id);
  });

  it('a place with no community row still resolves, and a caller keyed on rows finds nothing', () => {
    const byId = new Map(LIVE_COMMUNITIES.map((c) => [c.id, c]));
    const id = makeCommunityMatcher(LIVE_COMMUNITIES).matchText('Ampilatwatja');
    expect(id).toBe('ampilatwatja');
    expect(byId.get(id as string)).toBeUndefined();
  });

  it('reads a full Empathy Ledger location string', () => {
    const m = makeCommunityMatcher(LIVE_COMMUNITIES);
    expect(m.matchLocation('Tennant Creek, Northern Territory, Australia')).toBe('tennant-creek');
    expect(m.matchLocation('Northern Territory, Australia')).toBeNull();
    expect(m.matchLocation('Australia')).toBeNull();
  });
});
