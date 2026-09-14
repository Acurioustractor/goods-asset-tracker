/**
 * Guards for the model placemat. The sheet is a funder surface, so the rules
 * that bind every Goods surface are tested here rather than remembered:
 * The Harvest Plant, never Witta; buyers by type, never by organisation;
 * money never returns to Goods; households are not a station; no health
 * outcome; no em dashes; every photograph from the starred set.
 */

import { describe, it, expect } from 'vitest';
import { PLASTIC_KG_PER_BED } from '@/lib/data/products';
import { RAISE, SHEET, STATIONS, FLOWS, PANELS, everyPrintedString, aud, audRange } from './model-placemat';

const strings = everyPrintedString();

describe('the raise', () => {
  it('adds up: QBE plus other philanthropy is the total, low and high', () => {
    expect(RAISE.qbeAud + RAISE.otherLowAud).toBe(RAISE.totalLowAud);
    expect(RAISE.qbeAud + RAISE.otherHighAud).toBe(RAISE.totalHighAud);
  });
  it('is asked, not signed', () => {
    expect(RAISE.signedAud).toBe(0);
    expect(SHEET.raiseNote).toMatch(/nothing signed/);
  });
  it('is 400 beds across four organisations, 100 each, and two facilities', () => {
    expect(RAISE.communityOrganisations * RAISE.bedsEach).toBe(RAISE.bedsYearOne);
    expect(RAISE.facilities).toBe(2);
  });
  it('prints as Australian dollars with a range', () => {
    expect(aud(300_000)).toBe('A$300,000');
    expect(audRange(200_000, 300_000)).toBe('A$200,000 to 300,000');
    expect(SHEET.raiseHeading).toContain('A$500,000 to 600,000');
  });
});

describe('the words', () => {
  it('never say Witta: the maker is The Harvest Plant', () => {
    for (const s of strings) expect(s).not.toMatch(/witta/i);
    expect(STATIONS.harvest.title).toBe('The Harvest Plant');
  });
  it('carry no em dash and no co-design', () => {
    for (const s of strings) {
      expect(s).not.toContain('—');
      expect(s).not.toMatch(/co-design/i);
    }
  });
  it('name buyers by type, never by organisation', () => {
    const named = /NT Health|Centrecorp|Miwatj|Shepherdson|Ceduna|Coduna|Oonchiumpa|Utopia|PICC|Homeland School/i;
    expect(STATIONS.buyers.title).not.toMatch(named);
    expect(STATIONS.buyers.line).not.toMatch(named);
    for (const type of ['health services', 'schools', 'housing providers']) {
      expect(STATIONS.buyers.line.toLowerCase()).toContain(type);
    }
  });
  it('claim no health outcome', () => {
    for (const s of strings) expect(s).not.toMatch(/prevent|cure|reduc(e|es|ed|ing) (scabies|rhd|infection)|fewer (cases|infections)/i);
  });
  it('never say nine years', () => {
    for (const s of strings) expect(s).not.toMatch(/nine years|9 years/i);
  });
  it('give the community three choices after costs', () => {
    for (const choice of ['more beds', 'paid local work', 'making their own']) {
      expect(STATIONS.decide.line).toContain(choice);
    }
  });
  it('carry the plastic figure from products.ts, not a retyped number', () => {
    const recycling = PANELS.find((p) => p.id === 'recycling');
    expect(recycling?.line).toContain(`${PLASTIC_KG_PER_BED} kilograms`);
  });
});

describe('the stations and lines', () => {
  it('have no household station: give-out lives in supporting copy', () => {
    for (const s of Object.values(STATIONS)) {
      expect(s.id).not.toMatch(/household/i);
      expect(s.title).not.toMatch(/household/i);
    }
  });
  it('connect only stations that exist', () => {
    for (const f of FLOWS) {
      expect(STATIONS[f.from]).toBeDefined();
      expect(STATIONS[f.to]).toBeDefined();
    }
  });
  it('never send money back to Goods: money lines end in community or at the decision', () => {
    for (const f of FLOWS.filter((x) => x.kind === 'money')) {
      expect(['money', 'decide', 'orgs']).toContain(f.to);
      expect(f.to).not.toBe('harvest');
      expect(f.to).not.toBe('act');
    }
  });
  it('draw the two facilities and the next product dashed, the trade solid', () => {
    expect(STATIONS.facility.state).toBe('proposed');
    expect(STATIONS.next.state).toBe('proposed');
    for (const id of ['harvest', 'orgs', 'buyers', 'money', 'decide'] as const) {
      expect(STATIONS[id].state).toBe('now');
    }
    for (const f of FLOWS.filter((x) => x.to === 'facility' || x.to === 'next')) {
      expect(['future', 'support']).toContain(f.kind);
    }
  });
  it('carry one drawing only, the kit container on The Harvest', () => {
    const drawn = Object.values(STATIONS).filter((s) => s.drawing);
    expect(drawn.map((s) => s.id)).toEqual(['harvest']);
    expect(STATIONS.harvest.drawing?.src).toBe('/images/model/harvest-container.svg');
  });
});

describe('the four panels', () => {
  it('are employment, recycling, enterprise and health, each with a starred photograph', () => {
    expect(PANELS.map((p) => p.id)).toEqual(['employment', 'recycling', 'enterprise', 'health']);
    for (const p of PANELS) {
      expect(p.photo.src.startsWith('/images/')).toBe(true);
      expect(p.photo.starred).toBeGreaterThan(0);
      expect(p.photo.alt.length).toBeGreaterThan(10);
    }
  });
  it('use the three use:placemat picks for arriving, making and sleeping', () => {
    const picks = PANELS.filter((p) => p.photo.placematPick).map((p) => p.photo.starred).sort();
    expect(picks).toEqual([15, 35, 42]);
  });
});
