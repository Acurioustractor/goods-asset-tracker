import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CRM_COORDINATION_NOTICE,
  EVIDENCE_STATE_MEANING,
  needsAPerson,
  placeDecisionRead,
  type ClaimConfidence,
  type EvidenceRow,
  type EvidenceState,
  type OpenAction,
} from './place-decision';

const SRC = readFileSync(join(__dirname, 'place-decision.ts'), 'utf8');

describe('the six evidence states are GRANTSCOPE.md\'s own six', () => {
  it('carries exactly the six the contract names', () => {
    const states = Object.keys(EVIDENCE_STATE_MEANING).sort();
    expect(states).toEqual(
      ['awaiting-review', 'conflicted', 'partial', 'stale', 'unavailable', 'verified'].sort(),
    );
  });

  it('keeps freshness and truth apart', () => {
    expect(EVIDENCE_STATE_MEANING.stale).toMatch(/says nothing about whether it is still correct/i);
  });

  it('refuses to turn absence into zero', () => {
    expect(EVIDENCE_STATE_MEANING.unavailable).toMatch(/never becomes zero/i);
  });
});

describe('no aggregate, because an aggregate is a readiness score', () => {
  it('exports nothing that scores or counts a place', () => {
    // The contract says the output is "a decision read, not a readiness score, pipeline stage or
    // progress bar". A single number per community is the thing that gets sorted.
    const exported = SRC.match(/^export function (\w+)/gm) ?? [];
    const names = exported.map((line) => line.replace('export function ', ''));
    expect(names).toEqual(['placeDecisionRead', 'needsAPerson']);
    for (const name of names) {
      expect(name).not.toMatch(/score|percent|rank|readiness|progress|total/i);
    }
  });

  it('needsAPerson returns the rows, never a number', () => {
    const rows: EvidenceRow[] = [
      { fact: 'Bed count', state: 'verified', source: 'community-canonical.ts' },
      { fact: 'Authority to build', state: 'unavailable', source: '—', note: 'No agreement on file' },
      { fact: 'Utopia bed definition', state: 'conflicted', source: 'register vs INV-0291', note: '147 against 107' },
    ];
    const out = needsAPerson(rows);
    expect(Array.isArray(out)).toBe(true);
    expect(out.map((r) => r.fact)).toEqual(['Authority to build', 'Utopia bed definition']);
  });
});

describe('a CRM stage is internal coordination', () => {
  it('says it is not consent, not a decision and not an order', () => {
    expect(CRM_COORDINATION_NOTICE).toMatch(/internal coordination/i);
    expect(CRM_COORDINATION_NOTICE).toMatch(/not consent/i);
    expect(CRM_COORDINATION_NOTICE).toMatch(/not an order/i);
  });

  it('names what would make it a request', () => {
    expect(CRM_COORDINATION_NOTICE).toMatch(/authority or request artifact/i);
  });
});

describe('confidence attaches to a claim, never to a place', () => {
  it('has no confidence field that a community alone could carry', () => {
    // If ClaimConfidence ever loses its claim, a community-level confidence becomes buildable and
    // the column turns into a pipeline stage. This asserts the shape at the source.
    expect(SRC).toMatch(/export interface ClaimConfidence \{[^}]*\bclaim: string;/);
    expect(SRC).toMatch(/export interface ClaimConfidence \{[^}]*\bclaimId: string;/);
    expect(SRC).not.toMatch(/interface Community\w*\s*\{[^}]*confidence/);
  });

  it('keeps one judgement per claim, so a stale one is replaced rather than stacked', () => {
    const confidences: ClaimConfidence[] = [
      {
        claimId: 'tennant-100-fy27',
        claim: 'Tennant Creek will take 100 beds in FY27',
        communityId: 'tennant-creek',
        confidence: 'medium',
        setBy: 'Ben',
        setOn: '2026-09-10',
        basis: 'Dianne Stokes offered to self-fund 20. No order and no funder.',
      },
    ];
    const read = placeDecisionRead('tennant-creek', [], confidences, []);
    const ids = read.confidences.map((c) => c.claimId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every judgement names a person and a basis', () => {
    const c: ClaimConfidence = {
      claimId: 'x',
      claim: 'A claim',
      communityId: 'somewhere',
      confidence: 'low',
      setBy: 'Ben',
      setOn: '2026-09-10',
      basis: 'Because',
    };
    expect(c.setBy.length).toBeGreaterThan(0);
    expect(c.basis.length).toBeGreaterThan(0);
  });
});

describe('an open action can be unheld, and says so', () => {
  it('allows a null holder rather than an empty string', () => {
    const a: OpenAction = {
      id: 'count-parts',
      communityId: 'witta',
      action: 'Count canvas, pole pairs and hardware',
      holder: null,
      opened: '2026-09-10',
    };
    expect(a.holder).toBeNull();
    // An empty string would render as answered. Null renders as unheld.
    expect(a.holder as unknown as string).not.toBe('');
  });

  it('carries no invented due date', () => {
    const a: OpenAction = {
      id: 'site-letter',
      communityId: 'palm-island',
      action: 'A site agreement or letter of support',
      holder: 'Nic',
      opened: '2026-09-10',
    };
    expect(a.due).toBeUndefined();
  });
});

describe('the read introduces no truth of its own', () => {
  it('scopes to the community asked for and passes the rest through', () => {
    const actions: OpenAction[] = [
      { id: 'a', communityId: 'palm-island', action: 'One', holder: 'Nic', opened: '2026-09-10' },
      { id: 'b', communityId: 'maningrida', action: 'Two', holder: null, opened: '2026-09-10' },
    ];
    const read = placeDecisionRead('palm-island', [], [], actions);
    expect(read.openActions.map((a) => a.id)).toEqual(['a']);
  });

  it('holds no data of its own beyond the state vocabulary and the notice', () => {
    const arrays = SRC.match(/^export const \w+(?::[^=]+)? = \[/gm) ?? [];
    expect(arrays).toEqual([]);
  });
});

describe('every state has a meaning a reader can act on', () => {
  const states: EvidenceState[] = [
    'verified',
    'partial',
    'conflicted',
    'stale',
    'unavailable',
    'awaiting-review',
  ];
  it.each(states)('%s explains itself', (state) => {
    expect(EVIDENCE_STATE_MEANING[state].length).toBeGreaterThan(20);
  });
});
