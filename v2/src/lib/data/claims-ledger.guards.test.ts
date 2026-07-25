/**
 * The claims ledger's leak-prevention, tested.
 *
 * `assertLedgerSafe()` is the rule that stopped the withheld consolidated
 * revenue figure reaching the open web. It had already leaked once: /deck
 * shipped it in a risk row until 2026-07-11. The assertion runs at module load,
 * so until now a regression would only show up as an import-time crash
 * somewhere downstream, and only if a bad claim happened to exist. Nothing
 * exercised the rule itself.
 *
 * Three things it must enforce:
 *   1. A locked claim carries no figure.
 *   2. A locked claim's statement is digit-free, so the number cannot leak in
 *      prose next to the lock.
 *   3. Any claim rendering a figure must source it from a green (public-safe)
 *      canon fact. Amber and red facts never ship a figure externally.
 *
 * `locked` is not the same as canon's `internal-only`. A locked claim IS
 * published, deliberately, as a visible withholding with a ceiling and a promised
 * flip date. See the vocabulary note on ClaimLabel in canon.ts.
 */

import { describe, it, expect } from 'vitest';
import { assertLedgerSafe, EXTERNAL_CLAIMS, type Claim } from '@/lib/data/claims-ledger';
import { CANON, type CanonFact } from '@/lib/data/canon';

const base = (over: Partial<Claim>): Claim => ({
  id: 'test-claim',
  headline: 'Test',
  statement: 'A statement with no digits in it.',
  status: 'verified',
  evidence: [],
  asOf: '2026-07-25',
  ...over,
});

const factWith = (pred: (f: CanonFact) => boolean) => CANON.find(pred);

describe('assertLedgerSafe: locked claims', () => {
  it('rejects a locked claim carrying a figure', () => {
    expect(() =>
      assertLedgerSafe([base({ status: 'locked', figure: '$741,111' })]),
    ).toThrow(/must not carry a figure/);
  });

  it('rejects digits in a locked claim statement, so the number cannot leak in prose', () => {
    expect(() =>
      assertLedgerSafe([
        base({ status: 'locked', statement: 'Revenue since inception is $741,111, held from publication.' }),
      ]),
    ).toThrow(/figure-free/);
  });

  it('accepts a locked claim that is genuinely figure-free', () => {
    expect(() =>
      assertLedgerSafe([
        base({
          status: 'locked',
          statement: 'The consolidated figure is held until the accountant signs it.',
        }),
      ]),
    ).not.toThrow();
  });
});

describe('assertLedgerSafe: figures must come from green facts', () => {
  it('rejects a figure sourced from a non-green canon fact', () => {
    const nonGreen = factWith((f) => f.dataClass !== 'green');
    expect(nonGreen, 'expected at least one amber/red fact to make this test meaningful').toBeDefined();

    expect(() =>
      assertLedgerSafe([base({ figure: '32', factId: nonGreen!.id })]),
    ).toThrow(/non-green fact/);
  });

  it('accepts a figure sourced from a green fact', () => {
    const green = factWith((f) => f.dataClass === 'green');
    expect(green).toBeDefined();

    expect(() => assertLedgerSafe([base({ figure: '540', factId: green!.id })])).not.toThrow();
  });

  it('rejects a figure pointing at a canon fact that does not exist', () => {
    expect(() =>
      assertLedgerSafe([base({ figure: '1', factId: 'no-such-fact-id' })]),
    ).toThrow();
  });
});

describe('the live ledger', () => {
  it('passes its own assertion', () => {
    expect(() => assertLedgerSafe(EXTERNAL_CLAIMS)).not.toThrow();
  });

  it('has no locked claim carrying a digit anywhere in its statement', () => {
    const offenders = EXTERNAL_CLAIMS.filter(
      (c) => c.status === 'locked' && /\d/.test(c.statement),
    ).map((c) => c.id);

    expect(offenders).toEqual([]);
  });
});
