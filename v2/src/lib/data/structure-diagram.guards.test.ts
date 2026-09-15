/**
 * Guards for the QBE Q3 structure and funding-flow diagram. The sheet must name
 * every entity the Q1 table names, carry the applicant's identifiers exactly,
 * print no place-level bed demand figure, and draw with nothing overlapping.
 */
import { describe, it, expect } from 'vitest';
import { APPLICANT, ENTITIES, LINKS, SHEET, everyPrintedString } from './structure-diagram';
import { LABEL_CLEARANCE, layoutReport, rectInside, rectsIntersect, renderStructureSvg, renderedText } from '@/lib/model/structure-svg';

const strings = everyPrintedString();
const svg = renderStructureSvg();
const text = renderedText(svg);

describe('who is on the sheet', () => {
  it('names every entity in the QBE Q1 table', () => {
    for (const name of ['The Butterfly Movement Ltd', 'Goods on Country', 'A Curious Tractor Pty Ltd', 'Nicholas Marchesi, sole trader', 'A Kind Tractor Ltd']) {
      expect(text).toContain(name);
    }
  });
  it('names the parties outside the line', () => {
    for (const name of ['Oonchiumpa', 'Department of Employment and Workplace Relations', 'Community organisations', 'Customers', 'QBE Foundation']) {
      expect(text).toContain(name);
    }
  });
  it("carries the applicant's ABN and ACN as Q1 states them", () => {
    expect(APPLICANT.abn).toBe('22 155 132 684');
    expect(APPLICANT.acn).toBe('155 132 684');
    expect(text).toContain(`ABN ${APPLICANT.abn}`);
    expect(text).toContain(`ACN ${APPLICANT.acn}`);
    expect(text).toContain('21 591 780 066');
  });
  it('names the board at submission and the incoming board, and the founders as employees', () => {
    expect(text).toContain('Kristy Bloomfield, Audrey Deemal, Sonia Mascolo');
    expect(text).toContain('Jeremy Donovan');
    expect(text).toMatch(/employees/);
    expect(text).toMatch(/Neither is a director/);
  });
  it('says the REAL money is an unsigned offer and the $150,000 comes only once executed', () => {
    expect(text).toContain('$1,695,000');
    expect(text).toMatch(/not executed/);
    expect(text).toMatch(/once executed/);
  });
  it('has a dashed boundary and every arrow label', () => {
    expect(svg).toContain('data-boundary="true"');
    for (const l of LINKS) expect(text).toContain(l.label.split(' ').slice(0, 3).join(' '));
  });
});

describe('the words', () => {
  it('print no bed demand figure for a place', () => {
    for (const s of strings) {
      expect(s).not.toMatch(/(Utopia|Groote|Maningrida|Palm Island|Tennant Creek|NPY)[^.]{0,20}\b\d{2,3}\b/);
      expect(s).not.toMatch(/\b(150|500|200 to 350)\s+beds\b/);
    }
  });
  it('never say match, guarantee or double', () => {
    for (const s of strings) expect(s).not.toMatch(/\b(match|matched|matching|guarantee|guarantees|guaranteed|double|doubles|doubled)\b/i);
  });
  it('claim no health outcome and use no em dash', () => {
    for (const s of strings) {
      expect(s).not.toMatch(/health outcome/i);
      expect(s).not.toContain('—');
    }
  });
  it('keep the founders off the board on every card', () => {
    expect(ENTITIES.centre.lines.join(' ')).toMatch(/Neither is a director/);
    expect(SHEET.footer).toMatch(/Q3/);
  });
});

describe('nothing on the sheet overlaps', () => {
  const placed = layoutReport();
  const texts = placed.filter((p) => p.kind === 'text');
  const cards = placed.filter((p) => p.kind === 'card');
  const owned = (a: { owner: string }, b: { owner: string }) => a.owner === b.owner || a.owner.startsWith(b.owner + ':') || b.owner.startsWith(a.owner + ':');
  it('no two texts intersect', () => {
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const a = texts[i], b = texts[j];
        expect(rectsIntersect(a.rect, b.rect), `"${a.label}" (${a.owner}) hits "${b.label}" (${b.owner})`).toBe(false);
      }
    }
  });
  it('no text sits on a card it does not belong to', () => {
    for (const t of texts) {
      for (const c of cards) {
        if (owned(t, c)) continue;
        expect(rectsIntersect(t.rect, c.rect), `"${t.label}" (${t.owner}) sits on card ${c.owner}`).toBe(false);
      }
    }
  });
  it('every arrow label keeps clear air around it', () => {
    for (const t of texts.filter((x) => x.owner.startsWith('link:'))) {
      for (const o of placed) {
        if (o === t) continue;
        const margin = o.kind === 'line' ? 2 : LABEL_CLEARANCE - 0.01;
        expect(rectsIntersect(t.rect, o.rect, margin), `label "${t.label}" is within ${margin}px of ${o.kind} ${o.owner}`).toBe(false);
      }
    }
  });
  it('text inside a card stays inside it', () => {
    for (const t of texts) {
      const card = cards.find((c) => c.owner === t.owner);
      if (!card) continue;
      expect(rectInside(t.rect, card.rect), `"${t.label}" leaves its card ${t.owner}`).toBe(true);
    }
  });
  it('every text stays inside the sheet margin', () => {
    for (const t of texts) {
      expect(rectInside(t.rect, { x: 32, y: 32, w: 1123 - 64, h: 794 - 64 }), `"${t.label}" (${t.owner}) leaves the sheet`).toBe(true);
    }
  });
  it('no two cards intersect', () => {
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        expect(rectsIntersect(cards[i].rect, cards[j].rect), `${cards[i].owner} hits ${cards[j].owner}`).toBe(false);
      }
    }
  });
});
