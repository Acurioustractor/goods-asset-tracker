/**
 * Guards for the story spine. The page is a funder surface: every figure carries a source and a
 * date, every deck slide is fed by exactly one chapter, the trade reveals every station, the
 * words obey the rulings that bind every Goods surface, and the board prints no chair.
 */

import { describe, it, expect } from 'vitest';
import { STATIONS, type StationId } from './model-placemat';
import { goodsBoard } from './goods-board';
import { CHAPTERS, GATES, MAKE_STEPS, MODEL_STEPS, MONEY_LANES, PROBLEM_FIGURES, REQUEST } from './story-spine';
import { QUESTIONS } from './story-questions';

function everyStoryString(): string[] {
  const out: string[] = [];
  for (const c of CHAPTERS) out.push(c.title, ...c.lines, c.open ?? '', c.photo?.alt ?? '', c.photo?.place ?? '');
  for (const f of PROBLEM_FIGURES) out.push(f.area, f.value, f.what, f.note ?? '', f.source);
  for (const s of MODEL_STEPS) out.push(s.title, s.line ?? '');
  for (const s of MAKE_STEPS) out.push(s.title, s.photo.alt);
  for (const l of MONEY_LANES) out.push(l.title, l.line);
  out.push(REQUEST.headline, REQUEST.note, ...GATES);
  for (const d of goodsBoard) out.push(d.name, d.bio, d.goods ?? '', d.background, d.country, d.location);
  return out.filter(Boolean);
}

describe('the chapters', () => {
  it('run 1 to 10 in the deck’s order, the questions last', () => {
    expect(CHAPTERS.map((c) => c.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(CHAPTERS[CHAPTERS.length - 1].id).toBe('questions');
  });
  it('feed every deck slide S01 to S19 exactly once', () => {
    const slides = CHAPTERS.flatMap((c) => c.slides).sort();
    const expected = Array.from({ length: 19 }, (_, i) => `S${String(i + 1).padStart(2, '0')}`);
    expect(slides).toEqual(expected);
  });
  it('say what is still owed on every draft chapter', () => {
    for (const c of CHAPTERS.filter((x) => x.status === 'draft')) expect(c.open, c.id).toBeTruthy();
  });
  it('take photographs from the starred set or the live road pitch, with a place and an alt', () => {
    for (const c of CHAPTERS) {
      if (!c.photo) continue;
      expect(c.photo.src.startsWith('/images/')).toBe(true);
      expect(c.photo.alt.length).toBeGreaterThan(10);
      expect(c.photo.place.length).toBeGreaterThan(2);
      if (c.photo.source === 'starred') expect(c.photo.starred).toBeGreaterThan(0);
    }
  });
});

describe('the four figures', () => {
  it('are health, enterprise, employment and waste, each verified with a source, a link and a date', () => {
    expect(PROBLEM_FIGURES.map((f) => f.id)).toEqual(['health', 'enterprise', 'employment', 'waste']);
    for (const f of PROBLEM_FIGURES) {
      expect(f.grade).toBe('verified');
      expect(f.sourceUrl).toMatch(/^https:\/\//);
      expect(f.asAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(f.source.length).toBeGreaterThan(10);
    }
  });
  it('read health and waste from supply-context rather than retyping them', () => {
    const health = PROBLEM_FIGURES.find((f) => f.id === 'health');
    const waste = PROBLEM_FIGURES.find((f) => f.id === 'waste');
    expect(health?.sourceUrl).toContain('abs.gov.au');
    expect(waste?.sourceUrl).toContain('dtbar.nt.gov.au');
  });
  it('claim no outcome and keep crowding as the reason', () => {
    for (const f of PROBLEM_FIGURES) {
      expect(f.what).not.toMatch(/Goods (has|have|created|prevented|reduced)/i);
      expect(`${f.what} ${f.note ?? ''}`).not.toMatch(/prevent(s|ed)? (scabies|rhd)|cure/i);
    }
  });
});

describe('the trade, scrolled', () => {
  it('reveals every station by the end', () => {
    const revealed = new Set<StationId>(MODEL_STEPS.flatMap((s) => s.reveal));
    for (const id of Object.keys(STATIONS) as StationId[]) expect(revealed.has(id), id).toBe(true);
  });
  it('ends on the raise with nothing signed', () => {
    const last = MODEL_STEPS[MODEL_STEPS.length - 1];
    expect(last.id).toBe('raise');
    expect(last.line).toMatch(/nothing is signed/i);
    expect(last.line).toContain('A$300,000');
  });
});

describe('the words on the page', () => {
  it('never say Witta, co-design, nine years or carry an em dash', () => {
    for (const s of everyStoryString()) {
      expect(s, s).not.toMatch(/witta/i);
      expect(s, s).not.toMatch(/co-design/i);
      expect(s, s).not.toMatch(/nine years/i);
      expect(s, s).not.toContain('—');
    }
  });
  it('keep the request at two facilities and a planning allowance, not a quote', () => {
    expect(REQUEST.headline).toContain('two proposed production facilities');
    expect(REQUEST.note).toMatch(/planning allowance and no site has been quoted/);
  });
  it('keep buyer receipts with the community organisation and never with Goods', () => {
    const receipts = MONEY_LANES.find((l) => l.id === 'receipts');
    expect(receipts?.line).toMatch(/community organisation/);
    expect(receipts?.line).not.toMatch(/Goods/);
  });
});

describe('the questions', () => {
  const chapterIds = new Set(CHAPTERS.map((c) => c.id));
  it('each end in a question mark, name who asks, when, and where the answer comes from', () => {
    for (const q of QUESTIONS) {
      expect(q.question.trim().endsWith('?'), q.id).toBe(true);
      expect(q.askedBy.length, q.id).toBeGreaterThan(5);
      expect(q.asked, q.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(q.source.length, q.id).toBeGreaterThan(5);
      expect(chapterIds.has(q.chapter), q.id).toBe(true);
    }
  });
  it('carry an answer unless they are open', () => {
    for (const q of QUESTIONS) {
      if (q.status === 'open') continue;
      expect(q.answer.length, q.id).toBeGreaterThan(40);
    }
  });
  it('never carry the retired model or a name the public page may not print', () => {
    // $750,000 left this list on 15 September 2026: with the loan inside the ask it is the ruled total again.
    const retired = /witta|thousand beds|1,000 beds|five communities|pool of 200|200 beds per|on quote|nine years|co-design/i;
    const names = /Tim Fairfax|Snow Foundation|Minderoo|Dusseldorp|Brian M\. Davis|SEFA|White Box|Katie Norman|Jay Boolkin/i;
    for (const q of QUESTIONS) {
      expect(`${q.question} ${q.answer}`, q.id).not.toMatch(retired);
      expect(`${q.question} ${q.answer}`, q.id).not.toMatch(names);
      expect(`${q.question} ${q.answer}`, q.id).not.toContain('—');
    }
  });
  it('name buyers by type in the selling answer, never by organisation', () => {
    const selling = QUESTIONS.find((q) => q.id === 'where-selling');
    expect(selling?.answer).not.toMatch(/Centrecorp|ALIVE|Mala'la|Homeland School|NT Health|Miwatj/);
    for (const type of ['health services', 'schools', 'housing providers']) expect(selling?.answer).toContain(type);
  });
  it('claim no health outcome and send no money back to Goods', () => {
    for (const q of QUESTIONS) {
      expect(q.answer, q.id).not.toMatch(/prevent(s|ed)? (scabies|rhd)|reduc(e|es|ed) (scabies|rhd)/i);
    }
    const back = QUESTIONS.find((q) => q.id === 'money-back');
    expect(back?.answer).toMatch(/never out of a community organisation/);
  });
});

describe('the board', () => {
  it('prints three directors, each with a portrait, a credit and a source, and no chair', () => {
    expect(goodsBoard).toHaveLength(3);
    for (const d of goodsBoard) {
      expect(d.role).toBe('Director');
      expect(d.photo.startsWith('/images/people/')).toBe(true);
      expect(d.source).toMatch(/^https:\/\//);
      expect(d.goods).not.toMatch(/chair/i);
    }
  });
});
