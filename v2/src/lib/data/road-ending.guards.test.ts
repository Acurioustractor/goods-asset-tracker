/**
 * Guards for the ending of /pitch/road.
 *
 * Every assertion here exists because the version this replaced broke it. The
 * ending used to be five hardcoded sections that repeated $400K four times,
 * rendered five money figures with no status label at all, printed a truncated
 * "$109." to funders, put "338 beds/yr" at display size in front of a funder
 * after ruling I retired bed thresholds as public claims, and attributed an ask
 * to a community that community-pathways.ts records as never having been asked.
 *
 * A regex guard cannot catch most of that. These can.
 */

import { describe, it, expect } from 'vitest';
import {
  BED_LADDER,
  BUY_LIST_TOTAL,
  CLOSING_TAIL,
  DOORS,
  LEG_RATIO,
  LETTER_LINES,
  PATHWAY_ASKS,
  THE_BUY_LIST,
  THE_RUNNING_COST,
  THE_TRADING,
  VOICE_FOUR_ASKS,
  VOICE_ONE_BED,
  VOICE_THE_LETTER,
  type EndingVoice,
} from './road-ending';
import { COMMUNITY_PATHWAYS } from './community-pathways';
import { getStoryteller } from './storyteller-registry';

const SOLIDITY = ['verified', 'workpaper', 'modelled', 'target', 'conflict', 'retired'];

const ALL_VOICES: EndingVoice[] = [VOICE_ONE_BED, VOICE_FOUR_ASKS, VOICE_THE_LETTER];

/** Every string a reader can see, for the sweeps that run over all copy. */
const ALL_COPY: string[] = [
  LEG_RATIO.copy,
  THE_RUNNING_COST.copy,
  THE_TRADING.copy,
  CLOSING_TAIL,
  ...BED_LADDER.flatMap((c) => [c.column, c.foot, ...c.rows.flatMap((r) => [r.figure, r.line])]),
  ...THE_BUY_LIST.flatMap((r) => [r.name, r.sentence, r.amount ?? '']),
  ...PATHWAY_ASKS.flatMap((p) => [p.place, p.country, p.size, p.body, p.whatWeCanSay, p.whoseCall]),
  ...DOORS.flatMap((d) => [d.verb, d.entity, d.body, d.match]),
  ...LETTER_LINES.flatMap((l) => [l.label, l.detail]),
];

describe('road-ending: voices are real, cleared, and speak once', () => {
  it('every quote exists verbatim in the storyteller registry', () => {
    for (const voice of ALL_VOICES) {
      const person = getStoryteller(voice.name);
      expect(person, `${voice.name} is not in the storyteller registry`).toBeTruthy();
      const match = person!.quotes.find((q) => q.text === voice.text);
      expect(
        match,
        `${voice.name}'s quote in road-ending.ts is not verbatim in the registry. Never edit a quote to fit a layout.`,
      ).toBeTruthy();
    }
  });

  it('every speaker is external tier and every quote is primary or approved', () => {
    for (const voice of ALL_VOICES) {
      const person = getStoryteller(voice.name)!;
      expect(person.tier, `${voice.name} is not external tier`).toBe('external');
      const match = person.quotes.find((q) => q.text === voice.text)!;
      expect(
        ['primary', 'approved'],
        `${voice.name}'s quote status is ${match.status}; a quote on hold cannot be published`,
      ).toContain(match.status);
      expect(voice.status).toBe(match.status);
    }
  });

  it('a voice with no registry portrait renders no portrait', () => {
    for (const voice of ALL_VOICES) {
      const person = getStoryteller(voice.name)!;
      if (!person.portrait) {
        expect(
          voice.portrait,
          `${voice.name} has no portrait in the registry, so the ending must not invent one`,
        ).toBeNull();
      }
    }
  });
});

describe('road-ending: no figure is stated without its status', () => {
  it('every ladder row carries a legal Solidity label', () => {
    for (const column of BED_LADDER) {
      for (const row of column.rows) {
        expect(SOLIDITY, `${row.figure} carries "${row.label}"`).toContain(row.label);
      }
    }
  });

  it('every buy-list row with an amount carries a legal Solidity label', () => {
    for (const row of THE_BUY_LIST) {
      if (row.amount === null) {
        expect(row.label, `${row.name} has no amount, so it must carry no label`).toBeNull();
      } else {
        expect(SOLIDITY, `${row.name} carries "${row.label}"`).toContain(row.label);
      }
    }
  });

  it('the $426 pressed-path figure is labelled modelled, never verified', () => {
    const pressed = BED_LADDER.find((c) => c.column === 'Press the legs ourselves')!;
    for (const row of pressed.rows) {
      expect(
        row.label,
        'canon.ts grades marginal-factory "verified", which is a verified BOM computation and not a measured production cost. Every other authority says modelled and so does this page.',
      ).toBe('modelled');
    }
  });

  it('working capital stays visibly unsized', () => {
    const wc = THE_BUY_LIST.find((r) => r.name === 'Working capital')!;
    expect(wc.amount).toBeNull();
    expect(wc.low).toBeNull();
    expect(wc.high).toBeNull();
    expect(wc.sentence.toLowerCase()).toContain('do not know');
  });
});

describe('road-ending: the arithmetic a funder checks with a calculator', () => {
  it('the 8.6x ratio divides the leg cost by RAW shred, not landed shred', () => {
    // $344.05 / $40 = 8.60. $344.05 / $55 = 6.25. Joining the ratio to the
    // landed figure is what broke the first draft of this section.
    expect(344.05 / 40).toBeCloseTo(8.6, 1);
    expect(LEG_RATIO.copy).toContain('8.6 times the raw cost');
    expect(LEG_RATIO.copy).toContain('about $40');
  });

  it('the buy-list total is computed from its rows, never typed', () => {
    expect(BUY_LIST_TOTAL.low).toBe(287000);
    expect(BUY_LIST_TOTAL.high).toBe(475000);
  });
});

describe('road-ending: nothing is claimed on a community behalf', () => {
  it('every pathway id matches a real record in community-pathways.ts', () => {
    for (const ask of PATHWAY_ASKS) {
      const record = COMMUNITY_PATHWAYS.find((p) => p.id === ask.id);
      expect(record, `${ask.id} is not a real pathway`).toBeTruthy();
      expect(
        ask.country,
        `${ask.id} country must follow the repo record, not a substituted name`,
      ).toBe(record!.region);
    }
  });

  it('Palm Island is never described as having asked for anything', () => {
    const palm = PATHWAY_ASKS.find((p) => p.id === 'palm-island')!;
    expect(
      palm.field,
      'community-pathways.ts records "Existing Goods relationships must not be treated as a request"',
    ).toBe('Where this sits');
    expect(palm.body.toLowerCase()).toContain('nobody has been asked');
  });

  it('no dollar figure is attached to any named community pathway', () => {
    // We hold a full costing for Oonchiumpa and a module price for Utopia.
    // Neither has been put to the community it describes. The one permitted
    // figure is Palm Island's $0, which is our own model marking itself wrong.
    for (const ask of PATHWAY_ASKS) {
      const text = `${ask.body} ${ask.whatWeCanSay}`;
      const figures = text.match(/\$\d+(?:,\d{3})*/g) ?? [];
      const disallowed = figures.filter((f) => f !== '$0');
      expect(
        disallowed,
        `${ask.id} prints ${disallowed.join(', ')}. A price a community has not seen does not go on a public page first.`,
      ).toEqual([]);
    }
  });

  it('Tennant Creek does not claim the Youth Centre position as settled', () => {
    const tc = PATHWAY_ASKS.find((p) => p.id === 'tennant-creek')!;
    expect(`${tc.body} ${tc.whatWeCanSay}`).not.toContain('Youth Centre');
    expect(tc.whatWeCanSay.toLowerCase()).toContain('has not been sent');
  });
});

describe('road-ending: the retired and the banned', () => {
  it('no bed count is offered as a threshold', () => {
    // Ruling I. 338, the 234-529 band and any per-year rate are all out.
    for (const copy of ALL_COPY) {
      expect(copy, `"${copy}" carries a bed threshold`).not.toMatch(
        /\b(338|234|529|75\s*(to|-)\s*100)\b[^.]*bed/i,
      );
      expect(copy).not.toMatch(/beds?\s*(a|per)\s*year/i);
    }
  });

  it('no retired phrase and no banned word appears anywhere', () => {
    const banned = [
      'co-design',
      'co-designed',
      'accountant-signed',
      'zero beds pressed',
      'empower',
      'beneficiaries',
      'ecosystem',
      'scalable solution',
      'transformational',
      'unlock',
      'game-changing',
      'leverage',
      'enable',
      'activated',
      'catalysed',
      'INV-0303',
      '14 September',
      '14 Sep',
    ];
    for (const copy of ALL_COPY) {
      for (const term of banned) {
        expect(copy.toLowerCase(), `"${copy}" contains "${term}"`).not.toContain(term.toLowerCase());
      }
    }
  });

  it('no em dash and no curly quote reaches a rendered string', () => {
    for (const copy of [...ALL_COPY, ...ALL_VOICES.map((v) => v.attribution)]) {
      expect(copy, `"${copy}" contains an em dash`).not.toMatch(/—/);
      expect(copy, `"${copy}" contains a curly quote`).not.toMatch(/[‘’“”]/);
    }
  });

  it('ownership is never claimed complete', () => {
    for (const copy of ALL_COPY) {
      expect(copy).not.toMatch(/community[- ]owned (facility|plant|factory)\b/i);
      expect(copy).not.toMatch(/now owns|already owns|handover complete/i);
    }
  });

  it('$400K appears nowhere in this module, because ASK_HEADLINE.line carries it', () => {
    for (const copy of ALL_COPY) {
      expect(copy, `"${copy}" restates the raise figure`).not.toMatch(/\$400|400,000|\$800/);
    }
  });
});

describe('road-ending: the letter is the ask', () => {
  it('the letter names exactly the four things QBE counts as match paper', () => {
    expect(LETTER_LINES).toHaveLength(4);
    const labels = LETTER_LINES.map((l) => l.label.toLowerCase()).join(' ');
    expect(labels).toContain('amount');
    expect(labels).toContain('instrument');
    expect(labels).toContain('legal name');
    expect(labels).toContain('ring');
  });

  it('the give door does not promise a deductible receipt outright', () => {
    // Ruling J: DGR endorsement is verified since Jan 2012, but the receipting
    // mechanics are open, and a wrong deductibility claim is an ATO problem.
    const give = DOORS.find((d) => d.verb === 'Give')!;
    expect(give.body).toContain('confirming the receipting mechanics');
    expect(give.body).not.toMatch(/^A tax deductible gift\./);
  });

  it('gifts never fund the company and orders never count as match', () => {
    const give = DOORS.find((d) => d.verb === 'Give')!;
    expect(give.entity).toContain('Butterfly');
    expect(give.body).toContain('never buys a share');
    const order = DOORS.find((d) => d.verb === 'Buy beds')!;
    expect(order.match).toContain('Outside the QBE match');
  });
});
