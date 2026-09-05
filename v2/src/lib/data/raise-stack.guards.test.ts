/**
 * Guards for the September 2026 raise.
 *
 * Each assertion exists because a surface got it wrong before: $750K printed as sales on the
 * deck, a funder line carried as signed with nothing behind it, TFFF written down at a third of
 * its invitation, QBE described as doubling the raise, and a place name sat next to a price.
 */
import { describe, it, expect } from 'vitest';
import {
  BED_PRICE_AUD,
  BEN_STACK_AS_WRITTEN,
  ENTITY_ROUTE,
  EXTERNAL_LINES,
  JAY_QUESTIONS,
  POOL_BEDS_IF_ALL_LAND,
  POOL_LINES,
  POOL_SHORTFALL_BEDS,
  PROGRAM,
  QBE_ASK,
  SIGNED_TOTAL_AUD,
  STACK,
  THE_BLOCK,
  UNVERIFIED_LINE_IDS,
  bedsFunded,
  lineById,
} from './raise-stack';
import { canonValue } from './canon';

const COMMUNITY_NAMES = [
  'Utopia',
  'Urapuntja',
  'Oonchiumpa',
  'Alice Springs',
  'Mparntwe',
  'Tennant Creek',
  'Palm Island',
  'Maningrida',
  'Gamardi',
  'Kalgoorlie',
  'Kununurra',
  'Katherine',
];

const BANNED_WORDS = /\b(empower\w*|beneficiar\w*|ecosystem|scalable solution|transformational|unlock\w*|journey|game-changing|co-design\w*)\b/i;

/** Every string reachable from a value. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
  return out;
}

const ALL_STRINGS = strings({ STACK, PROGRAM, QBE_ASK, ENTITY_ROUTE, THE_BLOCK, JAY_QUESTIONS });

describe('the program', () => {
  it('costs the price times the beds, read from canon', () => {
    expect(BED_PRICE_AUD).toBe(Number(canonValue('stretch-price')));
    expect(PROGRAM.costAud).toBe(PROGRAM.beds * BED_PRICE_AUD);
    expect(PROGRAM.pools * PROGRAM.bedsPerPool).toBe(PROGRAM.beds);
  });

  it('is the sum of the stack Ben wrote, which is the coincidence the raise rests on', () => {
    const benTotal = BEN_STACK_AS_WRITTEN.reduce((s, l) => s + l.amountAud, 0);
    expect(benTotal).toBe(PROGRAM.costAud);
  });

  it('never describes the cost as sales or income', () => {
    for (const s of strings(PROGRAM)) {
      expect(s).not.toMatch(/gross sales|sales activity|community income/i);
    }
    expect(PROGRAM.honesty).toContain('design, not a promise');
  });
});

describe('the stack', () => {
  it('has $0 signed today, derived and not typed', () => {
    expect(SIGNED_TOTAL_AUD).toBe(0);
  });

  it('never calls a line signed without the letter', () => {
    for (const l of STACK) {
      if (l.status === 'signed') expect(l.evidence, `${l.id} needs evidence`).toBeTruthy();
    }
  });

  it('carries TFFF at the invited $300,000 and points it at the block', () => {
    const tfff = lineById('tfff');
    expect(tfff.amountAud).toBe(300_000);
    expect(tfff.status).toBe('invited');
    expect(tfff.job).toBe('block');
    expect(THE_BLOCK.recommendedFunder).toBe('tfff');
  });

  it('carries BMDF at the invited $100,000 into the charity', () => {
    const bmdf = lineById('bmdf');
    expect(bmdf.amountAud).toBe(100_000);
    expect(bmdf.status).toBe('invited');
    expect(bmdf.legalHome).toContain('Butterfly');
  });

  it('keeps every QBE split summing to its amount', () => {
    for (const l of STACK) {
      if (l.split) expect(l.split.poolAud + l.split.proofsAud).toBe(l.amountAud);
    }
  });

  it('excludes QBE, purchases and REAL from external commitments', () => {
    const ids = EXTERNAL_LINES.map((l) => l.id);
    expect(ids).not.toContain('qbe');
    expect(ids).not.toContain('alive');
    expect(ids).not.toContain('real');
  });

  it('keeps the unverified lines out of the pool arithmetic', () => {
    for (const id of UNVERIFIED_LINE_IDS) {
      expect(POOL_LINES.map((l) => l.id)).not.toContain(id);
      expect(lineById(id).note).toMatch(/unverified/i);
    }
  });

  it('derives beds from the price and covers the thousand with everything in', () => {
    for (const l of POOL_LINES) {
      const poolAud = l.split ? l.split.poolAud : (l.amountAud ?? 0);
      expect(bedsFunded(l)).toBe(Math.floor(poolAud / BED_PRICE_AUD));
    }
    expect(bedsFunded(lineById('alive'))).toBe(100);
    expect(POOL_BEDS_IF_ALL_LAND).toBeGreaterThanOrEqual(PROGRAM.beds);
    expect(POOL_SHORTFALL_BEDS).toBe(0);
    // 533 (QBE) + 133 + 133 + 133 + 66 + 100. Dusseldorp's $50,000 rounds down to 66 beds.
    expect(POOL_BEDS_IF_ALL_LAND).toBe(1098);
  });

  it('puts no community name next to a pool line', () => {
    for (const l of STACK.filter((x) => x.job === 'pool')) {
      for (const s of strings(l)) {
        for (const name of COMMUNITY_NAMES) {
          expect(s, `${l.id} names ${name}`).not.toContain(name);
        }
      }
    }
  });
});

describe('the QBE ask', () => {
  it('has three tiers whose beds follow from the price, with $400,000 as the ask', () => {
    expect(QBE_ASK.recommended.aud).toBe(400_000);
    expect(QBE_ASK.full.aud).toBe(400_000);
    expect(QBE_ASK.smaller.aud).toBe(250_000);
    for (const t of [QBE_ASK.recommended, QBE_ASK.full, QBE_ASK.smaller]) {
      expect(t.poolAud + t.proofsAud).toBe(t.aud);
      expect(t.beds).toBe(Math.floor(t.poolAud / BED_PRICE_AUD));
      expect(Number.isInteger(t.beds)).toBe(true);
      expect(t.proofsAud).toBe(0); // the money buys beds (Ben, 3 Sep 2026)
    }
    expect(QBE_ASK.recommended.beds).toBe(533);
    expect(QBE_ASK.full.beds).toBe(533);
    expect(QBE_ASK.smaller.beds).toBe(333);
    expect(QBE_ASK.full.buys).toMatch(/smaller amount/);
  });

  it('carries the recommended ask as the QBE line in the stack', () => {
    const qbe = lineById('qbe');
    expect(qbe.amountAud).toBe(QBE_ASK.recommended.aud);
    expect(qbe.split).toBeUndefined();
  });

  it('never describes QBE as doubling, triggering or guaranteeing anything', () => {
    const qbeStrings = strings({ qbe: lineById('qbe'), ask: QBE_ASK });
    for (const s of qbeStrings) {
      expect(s).not.toMatch(/\bmatch(es|ed|ing)?\b/i);
      expect(s).not.toMatch(/dollar for dollar|doubles|double it|guarantee/i);
    }
    expect(QBE_ASK.framing).toContain('$0 is signed today');
  });
});

describe('the entity route', () => {
  it('recommends the charity and names the fallback as weaker', () => {
    expect(ENTITY_ROUTE.recommended.applicant).toContain('Butterfly');
    expect(ENTITY_ROUTE.recommended.abn).toBe('22 155 132 684');
    expect(ENTITY_ROUTE.fallback.why).toMatch(/unsigned/);
    expect(ENTITY_ROUTE.fallback.why).toMatch(/Weaker/);
  });

  it('asks Jay the entity question first', () => {
    expect(JAY_QUESTIONS[0]).toMatch(/applicant/);
    expect(JAY_QUESTIONS.length).toBe(5);
  });
});

describe('voice', () => {
  it('uses no em dashes, arrows or banned words anywhere', () => {
    for (const s of ALL_STRINGS) {
      expect(s, s).not.toMatch(/[—→]/);
      expect(s, s).not.toMatch(BANNED_WORDS);
    }
  });

  it('never presents Goods. as a current operating layer (ruling X)', () => {
    for (const s of ALL_STRINGS) {
      expect(s).not.toMatch(/\bGoods\.\s/);
    }
  });
});
