/**
 * Guards for the model placemat. The sheet is a funder surface, so the rules
 * that bind every Goods surface are tested here rather than remembered:
 * the Goods on Country facility in Queensland, never Witta; buyers by type, never by organisation;
 * money never returns to Goods; households are not a station; no health
 * outcome; no em dashes; every photograph from the starred set.
 */

import { describe, it, expect } from 'vitest';
import { PLASTIC_KG_PER_BED } from '@/lib/data/products';
import { RAISE, SHEET, STATIONS, FLOWS, PANELS, everyPrintedString, aud, audRange, dollars } from './model-placemat';
import { LAYOUT, cellRect, flowPath, renderPlacematSvg, renderedText, layoutReport, rectsIntersect, rectInside, LABEL_CLEARANCE, CENTRE_CLEARANCE } from '@/lib/model/placemat-svg';

const strings = everyPrintedString();

describe('the SVG sheet', () => {
  const svg = renderPlacematSvg();
  const text = renderedText(svg);
  it('is one svg at the A3 sheet size', () => {
    expect(svg.match(/<svg /g)?.length).toBe(1);
    expect(svg).toContain('viewBox="0 0 1588 1123"');
  });
  it('prints every string on the sheet (photograph alt text is a <title> on the image, not printed)', () => {
    const alts = new Set(PANELS.map((p) => p.photo.alt));
    for (const s of strings.filter((x) => !alts.has(x))) {
      // Wrapping splits a string across tspans; compare with whitespace collapsed.
      expect(text).toContain(s.replace(/\s+/g, ' '));
    }
  });
  it('names no place on the facility station until Ben confirms the two sites', () => {
    expect(STATIONS.facility.line).not.toMatch(/Palm Island|Maningrida/);
  });
  it('places every station, panel and band inside the sheet, with no overlap between stations', () => {
    const ids = Object.keys(LAYOUT.cells) as (keyof typeof LAYOUT.cells)[];
    const rects = ids.map((id) => ({ id, r: cellRect(id) }));
    for (const { r } of rects) {
      expect(r.x).toBeGreaterThanOrEqual(0);
      expect(r.y).toBeGreaterThanOrEqual(0);
      expect(r.x + r.w).toBeLessThanOrEqual(1588);
      expect(r.y + r.h).toBeLessThanOrEqual(1123);
    }
    const boxes = rects.filter((x) => x.id !== 'centre' && x.id !== 'band' && x.id !== 'raise');
    for (const a of boxes) {
      for (const b of boxes) {
        if (a.id >= b.id) continue;
        const apart = a.r.x + a.r.w <= b.r.x || b.r.x + b.r.w <= a.r.x || a.r.y + a.r.h <= b.r.y || b.r.y + b.r.h <= a.r.y;
        expect(apart, `${a.id} overlaps ${b.id}`).toBe(true);
      }
    }
  });
  it('starts and ends every arrow on the edge of the cells it joins', () => {
    for (const fl of FLOWS) {
      const a = cellRect(fl.from);
      const b = cellRect(fl.to);
      const { p0, p3 } = flowPath(fl);
      const onEdge = (p: { x: number; y: number }, r: { x: number; y: number; w: number; h: number }) =>
        (Math.abs(p.x - r.x) < 0.01 || Math.abs(p.x - (r.x + r.w)) < 0.01 || Math.abs(p.y - r.y) < 0.01 || Math.abs(p.y - (r.y + r.h)) < 0.01) &&
        p.x >= r.x - 0.01 && p.x <= r.x + r.w + 0.01 && p.y >= r.y - 0.01 && p.y <= r.y + r.h + 0.01;
      expect(onEdge(p0, a), `${fl.from} to ${fl.to} leaves off the edge`).toBe(true);
      expect(onEdge(p3, b), `${fl.from} to ${fl.to} arrives off the edge`).toBe(true);
    }
  });
});

describe('the raise', () => {
  it('adds up: QBE plus three lots of 133 beds plus the SEFA loan is the total', () => {
    expect(RAISE.bedsAud).toBe(100_000 + 99_750 + 100_000);
    expect(RAISE.loanAud).toBe(150_000);
    expect(RAISE.qbeAud + RAISE.bedsAud + RAISE.loanAud).toBe(RAISE.totalAud);
    expect(RAISE.totalAud).toBe(749_750);
  });
  it('is asked, not signed', () => {
    expect(RAISE.signedAud).toBe(0);
    expect(SHEET.raiseNote).toBe('');
    expect(SHEET.footer).toBe('QBE Catalysing Impact');
  });
  it('is 400 beds across four organisations, 100 each, and two facilities', () => {
    expect(RAISE.communityOrganisations * RAISE.bedsEach).toBe(RAISE.bedsYearOne);
    expect(RAISE.facilities).toBe(2);
  });
  it('prints as Australian dollars, one figure, no range', () => {
    expect(aud(300_000)).toBe('A$300,000');
    expect(audRange(200_000, 300_000)).toBe('A$200,000 to 300,000');
    expect(dollars(599_750)).toBe('$599,750');
    expect(SHEET.raiseHeading).toBe('Asked $750,000');
    // The sheet rounds; the applications do not. Hold the rounding to $250.
    expect(Math.abs(RAISE.totalShownAud - RAISE.totalAud)).toBeLessThanOrEqual(250);
    expect(Math.abs(RAISE.bedsShownAud - RAISE.bedsAud)).toBeLessThanOrEqual(250);
    expect(RAISE.qbeAud + RAISE.bedsShownAud + RAISE.loanAud).toBe(RAISE.totalShownAud);
    for (const s of strings) expect(s).not.toMatch(/500,000 to 600,000|200,000 to 300,000/);
  });
});

describe('nothing on the sheet overlaps', () => {
  const placed = layoutReport({ photoHrefs: { employment: 'x', recycling: 'x', enterprise: 'x', health: 'x' } });
  const texts = placed.filter((p) => p.kind === 'text');
  const cards = placed.filter((p) => p.kind === 'card');
  const photos = placed.filter((p) => p.kind === 'photo');
  const owned = (a: { owner: string }, b: { owner: string }) => a.owner === b.owner || a.owner.startsWith(b.owner + ':') || b.owner.startsWith(a.owner + ':');
  it('no two texts intersect', () => {
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const a = texts[i], b = texts[j];
        expect(rectsIntersect(a.rect, b.rect), `"${a.label}" (${a.owner}) hits "${b.label}" (${b.owner})`).toBe(false);
      }
    }
  });
  it('no text sits on a card, photo or drawing it does not belong to', () => {
    for (const t of texts) {
      for (const c of [...cards, ...photos]) {
        if (owned(t, c)) continue;
        expect(rectsIntersect(t.rect, c.rect), `"${t.label}" (${t.owner}) sits on ${c.kind} ${c.owner}`).toBe(false);
      }
    }
  });
  it('every arrow label keeps clear air around it', () => {
    for (const t of texts.filter((x) => x.owner.startsWith('flow:'))) {
      for (const o of placed) {
        if (o === t) continue;
        // Lines: a label hugs its own line, so it needs only to stay off it; everything else keeps the full clearance.
        const margin = o.kind === 'line' ? 2 : LABEL_CLEARANCE - 0.01;
        expect(rectsIntersect(t.rect, o.rect, margin), `label "${t.label}" is within ${margin}px of ${o.kind} ${o.owner}`).toBe(false);
      }
    }
  });
  it('text inside a card stays inside it, and off its photograph', () => {
    for (const t of texts) {
      const card = cards.find((c) => c.owner === t.owner);
      if (!card) continue;
      expect(rectInside(t.rect, card.rect), `"${t.label}" leaves its card ${t.owner}`).toBe(true);
      const photo = photos.find((p) => p.owner === t.owner);
      if (photo && !t.label?.match(/^(Maningrida|Queensland facility|Empathy Ledger)$/)) {
        expect(rectsIntersect(t.rect, photo.rect), `"${t.label}" sits on the photograph in ${t.owner}`).toBe(false);
      }
    }
  });
  it('the centre words keep clear of the rim', () => {
    const circle = placed.find((p) => p.kind === 'circle')!;
    const words = texts.find((t) => t.owner === 'centre')!;
    const rad = circle.rect.w / 2;
    const cx = circle.rect.x + rad, cy = circle.rect.y + rad;
    const corner = Math.hypot(words.rect.w / 2, words.rect.h / 2);
    expect(corner).toBeLessThanOrEqual(rad - CENTRE_CLEARANCE + 0.01);
    expect(Math.abs(words.rect.x + words.rect.w / 2 - cx)).toBeLessThan(0.01);
    expect(Math.abs(words.rect.y + words.rect.h / 2 - cy)).toBeLessThan(0.01);
  });
  it('the left and right panels match in height, and the photographs fill their tops', () => {
    const r = (id: string) => cards.find((c) => c.owner === `panel:${id}`)!.rect;
    expect(r('employment').h).toBeCloseTo(r('enterprise').h, 3);
    expect(r('recycling').h).toBeCloseTo(r('health').h, 3);
    for (const p of photos.filter((x) => x.owner.startsWith('panel:'))) {
      const card = cards.find((c) => c.owner === p.owner)!;
      expect(p.rect.y).toBeCloseTo(card.rect.y, 3);
      expect(p.rect.w).toBeCloseTo(card.rect.w, 3);
      expect(p.rect.h).toBeGreaterThan(card.rect.h * 0.5);
    }
  });
});

describe('the words', () => {
  it('never say Witta: the maker is the Goods on Country facility in Queensland', () => {
    for (const s of strings) expect(s).not.toMatch(/witta/i);
    expect(STATIONS.harvest.title).toBe('Goods on Country facility');
  });
  it('carry no em dash and no co-design', () => {
    for (const s of strings) {
      expect(s).not.toContain('—');
      expect(s).not.toMatch(/co-design/i);
    }
  });
  it('name customers by type, never by organisation, and never say buyer', () => {
    const named = /NT Health|Centrecorp|Miwatj|Shepherdson|Ceduna|Coduna|Oonchiumpa|Utopia|PICC|Homeland School/i;
    expect(STATIONS.buyers.title).toBe('The customers');
    expect(STATIONS.buyers.line).not.toMatch(named);
    for (const type of ['people, businesses and service providers', 'health services', 'schools', 'housing providers']) {
      expect(STATIONS.buyers.line.toLowerCase()).toContain(type);
    }
    for (const s of strings) expect(s).not.toMatch(/\bbuyers?\b/i);
    expect(STATIONS.money.line).toBe('Customers pay the community organisation directly.');
  });
  it('keep support inside the bed, never as its own funded job', () => {
    expect(SHEET.support.title).toMatch(/inside the price of a bed/);
    // Ben, 15 Sep: the pill no longer repeats the price rule; the band carries it.
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
  it('carry one drawing only, the kit container at the Queensland facility', () => {
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
