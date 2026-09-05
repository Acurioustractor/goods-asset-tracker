/**
 * The lanes exist so that a number can never be built out of two things that are not the same
 * thing. These guards are the enforcement.
 */
import { describe, expect, it } from 'vitest';
import {
  BANNED_FOR_UNSIGNED,
  BEDS_SOLD,
  LANES,
  LANE_ORDER,
  MONEY_LINES,
  REPAYABLE_LINES,
  SIGNED_TODAY_AUD,
  linesIn,
  theHonestAnswer,
  total,
  type MoneyLane,
} from './money-lanes';
import { BUYING_STORY } from './qbe-story';
import { STACK } from './raise-stack';
import { verifiedFinancials } from './compendium';
import { fundingHistory } from './grant-content';

describe('the lanes', () => {
  it('every lane has a rule and every line sits in one', () => {
    expect(Object.keys(LANES).sort()).toEqual([...LANE_ORDER].sort());
    for (const l of MONEY_LINES) expect(LANES[l.lane], `${l.id} has lane ${l.lane}`).toBeDefined();
    for (const l of MONEY_LINES) expect(l.paper, `${l.id} must name a document or an email`).toBeTruthy();
  });

  it('earned is the only lane that is cash and the only lane that is revenue', () => {
    const cash = LANE_ORDER.filter((l) => LANES[l].isCash);
    const revenue = LANE_ORDER.filter((l) => LANES[l].isRevenue);
    expect(cash).toEqual(['earned']);
    expect(revenue).toEqual(['earned']);
  });

  // The mentor call, 4 September: two invitations were described out loud as commitments. This is
  // the arithmetic that would have made that true, and it must not be available.
  it('refuses to add money we have to money we have been invited to apply for', () => {
    expect(() => total(['earned', 'invited'])).toThrow(/may not be added/);
    expect(() => total(['earned', 'asked'])).toThrow(/may not be added/);
    expect(() => total(['earned', 'potential'])).toThrow(/may not be added/);
  });

  it('bad debt adds to nothing, including itself in a pipeline', () => {
    expect(LANES['bad-debt'].addsTo).toEqual([]);
    expect(() => total(['bad-debt', 'earned'])).toThrow(/may not be added/);
    expect(() => total(['bad-debt', 'invited'])).toThrow(/may not be added/);
    expect(() => total(['bad-debt', 'owed'])).toThrow(/may not be added/);
  });

  it('excluded money can never be swept into a total', () => {
    expect(LANES.excluded.addsTo).toEqual([]);
    expect(() => total(['excluded', 'invited'])).toThrow(/may not be added/);
  });

  it('the three pipeline lanes may be added to each other and to nothing else', () => {
    expect(() => total(['invited', 'asked', 'potential'])).not.toThrow();
    expect(total(['invited', 'asked', 'potential'])).toBeGreaterThan(0);
  });
});

describe('what is actually in each lane', () => {
  // Ben, 5 September 2026: Rotary is "just overdue and fucked".
  it('Rotary is bad debt, and it is not a buyer', () => {
    const rotary = linesIn('bad-debt').find((l) => /Rotary/.test(l.who));
    expect(rotary, 'Rotary must stay in the record as bad debt').toBeDefined();
    expect(rotary?.amountAud).toBe(82_500);
    expect(BUYING_STORY.some((b) => /Rotary/.test(b.who))).toBe(false);
    expect(linesIn('earned').some((l) => /Rotary/.test(l.who))).toBe(false);
  });

  // TFFF and Brian M. Davis both wrote naming an amount and a board date. Neither is money.
  it('the two invitations are invited, carry an amount and carry the date they decide', () => {
    const invited = linesIn('invited');
    const tfff = invited.find((l) => /Tim Fairfax/.test(l.who));
    const bmdf = invited.find((l) => /Brian M\. Davis/.test(l.who));
    expect(tfff?.amountAud).toBe(300_000);
    expect(bmdf?.amountAud).toBe(100_000);
    for (const l of [tfff, bmdf]) expect(l?.decisionDue, `${l?.who} must carry a decision date`).toMatch(/November 2026/);
    for (const l of invited) expect(LANES[l.lane].isCash).toBe(false);
  });

  it('beds sold is four organisations of paid invoices, and the bed money is the bed lines only', () => {
    expect(BEDS_SOLD.organisations).toBe(4);
    expect(BEDS_SOLD.beds).toBe(320);
    expect(BEDS_SOLD.bedRevenueExGstAud).toBe(197_060);
    // The whole-document figure is larger because it carries washers, workshops, freight and GST.
    expect(BEDS_SOLD.documentsIncGstAud).toBeGreaterThan(BEDS_SOLD.bedRevenueExGstAud);
    expect(BEDS_SOLD.asAt).toBe('5 September 2026');
  });

  it('nothing is signed, and nothing may be called committed until something is', () => {
    expect(SIGNED_TODAY_AUD).toBe(0);
    expect(STACK.every((l) => l.status !== 'signed' || Boolean(l.evidence))).toBe(true);
    const answer = theHonestAnswer();
    for (const banned of BANNED_FOR_UNSIGNED) expect(answer.toLowerCase()).not.toContain(banned);
    expect(answer).toContain('none of it is money');
  });

  it('the honest answer names every lane and never presents a single grand total', () => {
    const answer = theHonestAnswer();
    expect(answer).toContain('Beds sold and paid for');
    expect(answer).toContain('Invited to apply');
    expect(answer).toContain('Signed today: $0');
  });
});

describe('the lanes stay tied to their sources', () => {
  it('no funder line is duplicated between the stack and the invoice ledger', () => {
    const ids = MONEY_LINES.map((l) => l.id);
    expect(new Set(ids).size, `duplicate line ids: ${ids.join(', ')}`).toBe(ids.length);
  });

  it('every paid bed invoice reaches the earned lane, and quotes never do', () => {
    const paid = BUYING_STORY.filter((b) => b.status === 'paid');
    expect(linesIn('earned').filter((l) => l.id.startsWith('bed-'))).toHaveLength(paid.length);
    expect(MONEY_LINES.some((l) => /QU-/.test(l.paper))).toBe(false);
  });

  // Ben named "Bryan Foundation" as incoming on 5 Sep. It is a different organisation from Brian
  // M. Davis, and it is a May conversation with nothing in writing.
  it('the Bryan Foundation and Brian M. Davis are two organisations in two different lanes', () => {
    const bryan = MONEY_LINES.find((l) => l.who === 'The Bryan Foundation');
    const davis = MONEY_LINES.find((l) => /Brian M\. Davis/.test(l.who));
    expect(bryan?.lane).toBe('potential');
    expect(bryan?.amountAud).toBeNull();
    expect(davis?.lane).toBe('invited');
    expect(davis?.amountAud).toBe(100_000);
  });

  // Ben, 5 Sep: Homeland "has been paid", Regional Arts "is a different project and related to
  // the Harvest", Rotary bad debt "is fine for now".
  it('Goods has no collectable receivable, and the one that is left is bad debt', () => {
    expect(linesIn('owed')).toHaveLength(0);
    expect(total(['owed'])).toBe(0);
    expect(total(['bad-debt'])).toBe(82_500);
    expect(MONEY_LINES.some((l) => /Regional Arts/.test(l.who))).toBe(false);
    // Homeland is paid, so it belongs in earned and nowhere else.
    const homeland = MONEY_LINES.filter((l) => /Homeland/.test(l.who));
    expect(homeland).toHaveLength(1);
    expect(homeland[0].lane).toBe('earned');
  });

  // Ben, 5 Sep (second ruling): ALIVE and Julalikari "are sales which showcase how we can sell beds
  // and how communities can as well, and washing machines, same as the Centrecorp sales".
  it('a paid washers-only sale reaches the earned lane even though the beds ledger cannot carry it', () => {
    const julalikari = linesIn('earned').find((l) => /INV-0335/.test(l.paper));
    expect(julalikari, 'Julalikari INV-0335 must be in earned').toBeDefined();
    expect(julalikari?.amountAud).toBe(15_000);
    expect(julalikari?.instrument).toBe('purchase');
    expect(BUYING_STORY.some((b) => /Julalikari/.test(b.who)), 'the beds ledger stays beds').toBe(false);
    expect(total(['earned'])).toBe(BEDS_SOLD.documentsIncGstAud + 15_000);
  });

  it('canon, the compendium and the grant content agree on funding received, and the lines sum to it', () => {
    expect(verifiedFinancials.revenueReceived).toBe(901_311);
    expect(fundingHistory.totalReceived).toBe(verifiedFinancials.revenueReceived);
    expect(fundingHistory.received.reduce((t, r) => t + r.amount, 0)).toBe(fundingHistory.totalReceived);
    // The two receipts Ben ruled in on 5 Sep sit inside the "other" commercial and buyer line, and
    // Centrecorp's two paid bed invoices are a buyer row of their own (ruling Z, 5 Sep 2026).
    const other = fundingHistory.received.find((r) => /^Other commercial and buyer/.test(r.source));
    expect(other?.amount).toBe(221_649);
    const centrecorp = fundingHistory.received.find((r) => /^Centrecorp/.test(r.source));
    expect(centrecorp?.source, 'Centrecorp is a buyer in this composition').toMatch(/buyer/);
    expect((other?.amount ?? 0) + (centrecorp?.amount ?? 0), 'commercial and buyer receipts').toBe(344_981);
  });

  it('canon, the compendium and the grant content agree on what is receivable', () => {
    expect(verifiedFinancials.accountsReceivable).toBe(82_500);
    expect(fundingHistory.totalReceivables).toBe(verifiedFinancials.accountsReceivable);
    expect(fundingHistory.totalReceivables).toBe(total(['bad-debt']));
    expect(fundingHistory.receivables).toHaveLength(1);
    expect(fundingHistory.receivables[0].notes).toMatch(/BAD DEBT/);
  });

  it('repayable money is never read as philanthropy', () => {
    const repayable = REPAYABLE_LINES.map((l) => l.who);
    expect(repayable).toContain('SEFA');
    expect(repayable).toContain('White Box SELF');
    for (const l of REPAYABLE_LINES) expect(LANES[l.lane].isRevenue, l.who).toBe(false);
  });

  it('an invited line carries the amount the funder wrote, never one of ours', () => {
    for (const l of linesIn('invited')) {
      const stackLine = STACK.find((s) => s.id === l.id);
      expect(stackLine?.status, `${l.who}`).toBe('invited');
      expect(l.amountAud, `${l.who} must carry an amount`).not.toBeNull();
    }
  });
});
