/**
 * Guards for the QBE story, the FAQ and the drawings.
 *
 * What these catch, each of which has shipped before somewhere in this repo:
 *  - a figure typed in prose that disagrees with the module it should have been read from;
 *  - repo vocabulary reaching prose a funder reads (Ben, 3 Sep 2026);
 *  - the cost of the beds read as sales or income;
 *  - a community named in the same sentence as a dollar figure (ruling S);
 *  - a retired phrase ("nine years", "co-design", "zero beds pressed") coming back;
 *  - a drawing whose figures drift from the modules;
 *  - an FAQ entry with no source, or an answered one with no answer.
 */
import { describe, expect, it } from 'vitest';
import { BED_PRICE_AUD, KIT_COST_AUD, POOL, PRESSED_COST_AUD, STAYS_PRESSED_AUD } from './community-loop';
import { PROGRAM, QBE_ASK, SIGNED_TOTAL_AUD, STACK, UNVERIFIED_LINE_IDS, bedsFunded } from './raise-stack';
import { SCALE_ROWS } from './bed-ratio';
import { FAQ, FAQ_OPEN_COUNT, faqFor } from './qbe-faq';
import {
  BUYERS,
  CALENDAR,
  CRUX,
  DECK_MAP,
  HONEST_RULES,
  HOW_WE_KNOW,
  MEASURED_RUN,
  OUTCOMES,
  PROBLEM_FIGURES,
  PROOF_RUNS,
  SNOWBALL,
  SNOWBALL_BEDS_PER_YEAR,
  SNOWBALL_MARGIN_PER_YEAR_AUD,
  SNOWBALL_STEPS,
  STORY_CHAPTERS,
  STORY_PARTS,
  THREE_DOORS,
  WHO_SELLS,
  BUYING_STORY,
  BUYING_STORY_LINE,
  LENDERS,
  LENDERS_LINE,
  OTHER_LENDER_OPTIONS,
  PLAN_B,
  SUPPORTERS_OF_THE_ASK,
  buyingStoryFor,
  chaptersFor,
  cruxFor,
} from './qbe-story';
import { DECK_APPENDICES, DECK_PLAN, FORM_NARRATIVE_QUESTIONS } from './deck-plan';
import { QBE_DIAGRAMS, diagramsFor } from '../diagrams/qbe-diagrams';

const aud = (n: number) => `$${n.toLocaleString('en-AU')}`;

/** Every string a reader sees, from all three modules. */
function allProse(): string[] {
  const out: string[] = [];
  out.push(...CRUX);
  out.push(...PROBLEM_FIGURES.map((f) => f.text));
  out.push(...PROOF_RUNS.flatMap((r) => [r.body, r.proves, r.alt]));
  out.push(...BUYERS.flatMap((b) => [b.what]));
  out.push(...THREE_DOORS.map((d) => d.does), WHO_SELLS);
  out.push(SNOWBALL.direction, SNOWBALL.honesty, ...SNOWBALL_STEPS.flatMap((s) => [s.title, s.body]));
  out.push(MEASURED_RUN.claim, MEASURED_RUN.test, MEASURED_RUN.open, ...MEASURED_RUN.counts);
  out.push(...OUTCOMES.flatMap((o) => [o.title, o.body]), ...HOW_WE_KNOW.flatMap((h) => [h.title, h.body]));
  out.push(...HONEST_RULES.map((r) => r.rule));
  out.push(...CALENDAR.map((c) => c.what));
  out.push(...DECK_MAP.flatMap((d) => [d.carries, d.source]));
  out.push(...STORY_CHAPTERS.flatMap((c) => [c.kicker, c.title]));
  out.push(...FAQ.flatMap((f) => [f.question, f.answer]));
  return out;
}

/** Repo vocabulary that is banned in prose unless Ben uses it himself (feedback, 3 Sep 2026). */
const REPO_VOCAB = [
  /\bproof block\b/i,
  /\bthe stack\b/i,
  /\bgoverned pool\b/i,
  /\bpool line\b/i,
  /\btraceability\b/i,
  /\baccounting repair\b/i,
  /\boperating home\b/i,
  /\brelease condition\b/i,
  /\bblock money\b/i,
  /\bcatalytic chain\b/i,
];

/** Retired phrases and figures, each with the ruling behind it. */
const RETIRED = [
  /\bnine years\b/i, // Ben, 3 Sep 2026: two years, max
  /\bco-design/i, // Ben, 2026-07-11
  /\bzero beds pressed\b/i, // forty were, for Maningrida
  /\b75\s*(to|-)\s*100 beds\b/i, // ruling I
  /\bgross sales value\b/i, // the deck's old phrasing
  /\bmatch(es|ing)? (the|any|other)\b/i, // ruling V
  /—/, // em dash
];

describe('the QBE story: figures read, never typed', () => {
  it('the crux carries the program cost, the pool, the ask and the smaller amount from the modules', () => {
    const crux = CRUX.join(' ');
    expect(crux).toContain(aud(PROGRAM.costAud));
    expect(crux).toContain(`${POOL.beds} beds each`);
    expect(crux).toContain(aud(POOL.costAud));
    expect(crux).toContain(`${aud(QBE_ASK.recommended.aud)}. That buys ${QBE_ASK.recommended.beds} beds`);
    expect(crux).toContain(`${aud(QBE_ASK.smaller.aud)} is ${QBE_ASK.smaller.beds} beds`);
    expect(crux).toContain(`about $${PRESSED_COST_AUD} to make against $${KIT_COST_AUD}`);
  });

  it('the program cost is only ever a cost', () => {
    const cost = aud(PROGRAM.costAud);
    for (const p of allProse()) {
      if (!p.includes(cost)) continue;
      const sentence = p.split(/(?<=[.!?])\s+/).find((s) => s.includes(cost)) ?? p;
      // A question may ask the wrong thing; the answer may not say it.
      if (sentence.trim().endsWith('?')) continue;
      expect(sentence, sentence).not.toMatch(/\b(income|revenue|sales|profit|earn)/i);
    }
  });

  it('nothing signed is derived and stated, never softened', () => {
    expect(SIGNED_TOTAL_AUD).toBe(0);
    expect(HONEST_RULES.some((r) => /nothing is signed today/i.test(r.rule))).toBe(true);
  });

  it('the snowball is the arithmetic Ben says out loud, and labelled target', () => {
    expect(SNOWBALL_BEDS_PER_YEAR).toBe(5000);
    expect(SNOWBALL_MARGIN_PER_YEAR_AUD).toBe(1_000_000);
    expect(SNOWBALL.label).toBe('target');
    expect(SNOWBALL.marginPerBedModelAud).toBe(STAYS_PRESSED_AUD);
    expect(SNOWBALL.direction).toMatch(/not promising|That is the direction/);
    expect(SNOWBALL.honesty).toMatch(/not promising ten-year numbers/);
  });

  it('the scale rows the story prints match bed-ratio', () => {
    expect(SCALE_ROWS.map((r) => r.amountAud)).toEqual([150_000, 250_000, 400_000, 750_000]);
    expect(SCALE_ROWS.find((r) => r.amountAud === QBE_ASK.recommended.aud)?.beds).toBe(QBE_ASK.recommended.beds);
  });

  it('every chapter belongs to a part and ids are unique', () => {
    const ids = STORY_CHAPTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    const parts = new Set(STORY_PARTS.map((p) => p.id));
    for (const c of STORY_CHAPTERS) expect(parts.has(c.part), c.id).toBe(true);
    expect(ids[0]).toBe('crux');
    expect(ids).toContain('buyers');
    expect(ids).toContain('faq');
  });

  it('the health claim stops where CONTEXT.md says it stops', () => {
    const prose = allProse().join(' ');
    expect(prose).toMatch(/never claimed as an outcome|do not claim health outcomes/i);
    expect(prose).not.toMatch(/\b(reduces?|prevents?|cuts?) (scabies|rheumatic|RHD)\b/i);
  });
});

describe('the QBE story: voice', () => {
  it('no repo vocabulary reaches prose', () => {
    for (const p of allProse()) {
      for (const re of REPO_VOCAB) expect(p, `${re} in: ${p.slice(0, 80)}`).not.toMatch(re);
    }
  });

  it('no retired phrase or figure comes back', () => {
    for (const p of allProse()) {
      for (const re of RETIRED) expect(p, `${re} in: ${p.slice(0, 80)}`).not.toMatch(re);
    }
  });

  it('no community is named in the same sentence as a dollar figure (ruling S)', () => {
    const communities = ['Oonchiumpa', 'Utopia', 'Urapuntja', 'Palm Island', 'Tennant Creek', 'Maningrida', 'Kalgoorlie', 'Ninga Mia', 'Homeland School Company'];
    for (const p of allProse()) {
      for (const sentence of p.split(/(?<=[.!?])\s+/)) {
        if (!/\$\s?\d/.test(sentence)) continue;
        for (const c of communities) expect(sentence, sentence).not.toContain(c);
      }
    }
  });

  it('the ownership claim is a pathway wherever it appears', () => {
    const prose = allProse().join(' ');
    expect(prose).not.toMatch(/\bcommunity[- ]owned\b/i);
    expect(prose).toMatch(/ownership is a pathway/i);
  });
});

describe('the FAQ', () => {
  it('every entry has a source, a role, a date and a chapter that exists', () => {
    const chapters = new Set(STORY_CHAPTERS.map((c) => c.id));
    for (const f of FAQ) {
      expect(f.source.length, f.id).toBeGreaterThan(8);
      expect(f.askedBy.length, f.id).toBeGreaterThan(3);
      expect(f.asked, f.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(chapters.has(f.chapter), f.id).toBe(true);
    }
  });

  it('an answered entry has an answer; ids are unique', () => {
    for (const f of FAQ) if (f.status === 'answered') expect(f.answer.length, f.id).toBeGreaterThan(40);
    expect(new Set(FAQ.map((f) => f.id)).size).toBe(FAQ.length);
    expect(FAQ_OPEN_COUNT).toBe(FAQ.filter((f) => f.status !== 'answered').length);
  });

  it('the question every room asks is first, and it names the buyers who have paid', () => {
    expect(FAQ[0].id).toBe('where-selling');
    expect(FAQ[0].answer).toContain('ALIVE');
    expect(FAQ[0].answer).toContain('Centrecorp');
  });

  it('nobody is named by name in askedBy', () => {
    for (const f of FAQ) expect(f.askedBy, f.id).not.toMatch(/\b(Jay|Katie|Miranda|Sally|Rachel)\b/);
  });
});

describe('the drawings', () => {
  it('every diagram renders to a 16:9 SVG with its title', () => {
    for (const d of QBE_DIAGRAMS) {
      const svg = d.svg('working');
      expect(svg.startsWith('<svg'), d.id).toBe(true);
      expect(svg, d.id).toContain('viewBox="0 0 1600 900"');
      expect(svg, d.id).toContain('</svg>');
      expect(svg.length, d.id).toBeGreaterThan(2000);
    }
  });

  it('every diagram belongs to a chapter that exists, and ids are unique', () => {
    const chapters = new Set(STORY_CHAPTERS.map((c) => c.id));
    for (const d of QBE_DIAGRAMS) expect(chapters.has(d.chapter), d.id).toBe(true);
    expect(new Set(QBE_DIAGRAMS.map((d) => d.id)).size).toBe(QBE_DIAGRAMS.length);
  });

  it('the unit drawing carries the ask row and the price from the modules', () => {
    const svg = QBE_DIAGRAMS.find((d) => d.id === 'the-unit')!.svg('working');
    expect(svg).toContain(`One bed, ${aud(BED_PRICE_AUD)}`);
    expect(svg).toContain(aud(QBE_ASK.recommended.aud));
    expect(svg).toContain(String(QBE_ASK.recommended.beds));
    expect(svg).toContain('the ask, Q5');
  });

  it('the three-jobs drawing sums the pool lines the way raise-stack does', () => {
    const svg = QBE_DIAGRAMS.find((d) => d.id === 'three-jobs')!.svg('working');
    const poolLines = STACK.filter((l) => (l.job === 'pool' || l.job === 'demand') && l.status !== 'excluded' && !UNVERIFIED_LINE_IDS.includes(l.id));
    const beds = poolLines.reduce((s, l) => s + bedsFunded(l), 0);
    expect(svg).toContain(`(${beds.toLocaleString('en-AU')})`);
    expect(svg).toContain(`${aud(SIGNED_TOTAL_AUD)} is signed today`);
    expect(svg).not.toMatch(/gross sales/i);
  });

  it('a drawing never says QBE doubles, triggers or guarantees', () => {
    for (const d of QBE_DIAGRAMS) {
      const svg = d.svg('working');
      expect(svg, d.id).not.toMatch(/QBE (doubles|triggers|guarantees)/i);
      expect(svg, d.id).not.toMatch(/dollar-for-dollar/i);
    }
  });

  it('the loop drawing keeps the return arrow inside the community', () => {
    const svg = QBE_DIAGRAMS.find((d) => d.id === 'the-loop')!.svg('working');
    expect(svg).toContain('never back to the funder');
    expect(svg.toLowerCase()).toContain('four gates');
  });
});

// ---------------------------------------------------------------------------
// The public surface: first person, no internal notes, no named foundation or lender

/** Names, files and process words that must never reach /pitch/model. */
const INTERNAL = [
  /\bBen\b/, /\bNic\b/, /\bJay\b/, /\bEloise\b/, /\bKatie\b/, /\bMiranda\b/, /\bSally\b/, /\bRachel\b/, /Matt Allen/,
  /Social Impact Hub/, /Notion/, /HighLevel/, /Pencil/, /Zoho/, /\bXero\b/,
  /\.ts\b/, /\.mjs\b/, /\bQ\d{1,2}\b/, /ruling [A-Z]\b/, /\bguards?\b/,
  /Tim Fairfax/, /Brian M\. Davis/, /Snow Foundation/, /\bSnow\b/, /Minderoo/, /Dusseldorp/, /\bSEFA\b/, /White Box/, /\bFRRR\b/, /EV Fleet/,
  /has not (yet )?ruled/i, /recommendation:/i, /subject to/i, /fallback/i, /cohort/i,
];

function publicProse(): string[] {
  const out: string[] = [];
  out.push(...cruxFor('public'));
  out.push(...chaptersFor('public').flatMap((c) => [c.kicker, c.title]));
  out.push(...faqFor('public').flatMap((f) => [f.question, f.answer]));
  out.push(...HONEST_RULES.map((r) => r.rule));
  out.push(...PROOF_RUNS.flatMap((r) => [r.body, r.proves]), ...BUYERS.map((b) => b.what), WHO_SELLS, ...THREE_DOORS.map((d) => d.does));
  out.push(MEASURED_RUN.claim, MEASURED_RUN.test, MEASURED_RUN.open, SNOWBALL.direction, SNOWBALL.honesty);
  out.push(...OUTCOMES.map((o) => o.body), ...HOW_WE_KNOW.map((h) => h.body));
  out.push(BUYING_STORY_LINE, ...buyingStoryFor('public').flatMap((b) => [b.who, b.what]), LENDERS_LINE, ...PLAN_B.lines);
  return out;
}

describe('the public surface', () => {
  it('carries no internal name, file, form question or named foundation', () => {
    for (const p of publicProse()) {
      for (const re of INTERNAL) expect(p, `${re} in: ${p.slice(0, 90)}`).not.toMatch(re);
    }
  });

  it('every public drawing is clean too', () => {
    for (const d of diagramsFor('public')) {
      const svg = d.svg('public');
      for (const re of INTERNAL) expect(svg, `${re} in drawing ${d.id}`).not.toMatch(re);
      expect(svg, d.id).toContain('viewBox="0 0 1600 900"');
    }
  });

  it('the calendar and the deck map exist only on the working copy', () => {
    expect(chaptersFor('public').map((c) => c.id)).not.toContain('calendar');
    expect(chaptersFor('public').map((c) => c.id)).not.toContain('deck');
    expect(chaptersFor('working').map((c) => c.id)).toContain('deck');
    expect(diagramsFor('public').map((d) => d.id)).not.toContain('the-calendar');
  });

  it('the public FAQ hides working entries and swaps in public answers', () => {
    const ids = faqFor('public').map((f) => f.id);
    expect(ids).not.toContain('which-entity');
    expect(ids).not.toContain('open-questions');
    expect(ids).not.toContain('what-qbe-buys');
    expect(ids).toContain('where-selling');
    expect(ids).toContain('what-money-buys');
    const cat = faqFor('public').find((f) => f.id === 'how-catalytic')!;
    expect(cat.answer).not.toMatch(/SEFA|White Box/);
  });

  it('the public crux still says the cost, the ratio and that nothing is signed', () => {
    const crux = cruxFor('public').join(' ');
    expect(crux).toContain(aud(PROGRAM.costAud));
    expect(crux).toContain('Nothing else is signed today');
    expect(crux).not.toMatch(/Tim Fairfax|Brian M\. Davis|Minderoo|Dusseldorp/);
    expect(crux).toContain('ALIVE');
  });

  it('speaks as we, never about Goods on Country in the third person doing the work', () => {
    for (const p of publicProse()) {
      expect(p, p.slice(0, 90)).not.toMatch(/Goods on Country (buys|agrees|runs|holds|repays|reports|makes)\b/);
      expect(p, p.slice(0, 90)).not.toMatch(/\bthe founders\b/i);
    }
  });
});

describe('the twelve-slide plan and the four overviews', () => {
  it('is twelve slides, numbered in order, each cut from a chapter that exists and carrying a real drawing or none', () => {
    expect(DECK_PLAN.length).toBe(12);
    DECK_PLAN.forEach((sl, i) => expect(sl.n).toBe(i + 1));
    const chapters = new Set(STORY_CHAPTERS.map((c) => c.id));
    const drawings = new Set(QBE_DIAGRAMS.map((d) => d.id));
    for (const sl of [...DECK_PLAN, ...DECK_APPENDICES]) {
      expect(chapters.has(sl.chapter), sl.title).toBe(true);
      if (sl.drawing) expect(drawings.has(sl.drawing), sl.title).toBe(true);
    }
  });

  it('answers every narrative question on the form at least once', () => {
    for (const q of FORM_NARRATIVE_QUESTIONS) expect(DECK_PLAN.some((sl) => sl.answers.includes(q)), q).toBe(true);
  });

  it('the ask sits on the last slide and the crux on the first', () => {
    expect(DECK_PLAN[0].title).toContain('The first money buys beds');
    expect(DECK_PLAN[11].says).toContain(aud(QBE_ASK.recommended.aud));
    expect(DECK_PLAN[11].says).toContain(String(QBE_ASK.recommended.beds));
  });

  it('the buying story rests on invoices, and the public copy hides the unnamed buyer', () => {
    for (const b of BUYING_STORY) expect(b.paper, b.who).toMatch(/^(INV|QU)-\d{4}/);
    expect(BUYING_STORY.some((b) => b.paper.startsWith('INV-0303'))).toBe(true);
    expect(BUYING_STORY.some((b) => b.paper.startsWith('INV-0342'))).toBe(true);
    expect(buyingStoryFor('public').some((b) => b.working)).toBe(false);
    expect(buyingStoryFor('working').length).toBe(BUYING_STORY.length);
  });

  it('who has said yes is derived from the stack, never typed, and never counts QBE or an unverified line', () => {
    const names = SUPPORTERS_OF_THE_ASK.map((f) => f.who);
    expect(names.some((n) => /QBE/.test(n))).toBe(false);
    expect(names.some((n) => /FRRR|EV Fleet/.test(n))).toBe(false);
    expect(names).toContain('Tim Fairfax Family Foundation');
    expect(SUPPORTERS_OF_THE_ASK.every((f) => f.status !== 'signed')).toBe(true);
  });

  it('the lenders come from the stack and the other options never claim an amount is offered', () => {
    expect(LENDERS.map((l) => l.who)).toEqual(['SEFA', 'White Box SELF']);
    for (const o of OTHER_LENDER_OPTIONS) expect(o.what).not.toMatch(/offered|committed|signed/i);
  });

  it('plan B is arithmetic from the stack: the count without QBE, and the paid floor', () => {
    const poolLines = STACK.filter((l) => (l.job === 'pool' || l.job === 'demand') && l.status !== 'excluded' && !UNVERIFIED_LINE_IDS.includes(l.id));
    const withQbe = poolLines.reduce((s, l) => s + bedsFunded(l), 0);
    expect(PLAN_B.bedsWithoutQbe).toBe(withQbe - QBE_ASK.recommended.beds);
    expect(PLAN_B.bedsPaidToday).toBe(100);
    expect(PLAN_B.label).toBe('target');
    expect(PLAN_B.lines.join(' ')).toMatch(/plants wait/i);
    expect(PLAN_B.lines.join(' ')).not.toMatch(/Tim Fairfax|Brian M\. Davis|Snow|Minderoo|Dusseldorp/);
  });
});
