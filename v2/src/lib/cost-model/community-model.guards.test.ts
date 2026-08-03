/**
 * Guards for the community side of the cost model.
 *
 * The point of these is not arithmetic coverage. It is that the community-facing
 * figures cannot quietly drift, and that the two honest silences in the model - the
 * unpriced collection rung, and the wages/surplus split - stay silent. A future edit
 * that fabricates either one should fail here.
 */
import { describe, expect, it } from 'vitest';

import {
  FEED_ORDER,
  NETWORK_BLOCK_PER_YEAR,
  VALUE_LADDER,
  furthestRung,
  modelCommunity,
  modelPathway,
  networkFeePerSite,
  pathwayModules,
} from './community-model';

describe('the value ladder', () => {
  it('is in feed order and covers every production module', () => {
    expect(VALUE_LADDER.map((r) => r.module)).toEqual([...FEED_ORDER]);
  });

  it('prices each rung above the one before it', () => {
    const priced = VALUE_LADDER.filter((r) => r.perBedEquivalent !== null).map((r) => r.perBedEquivalent!);
    const ascending = [...priced].sort((a, b) => a - b);
    expect(priced).toEqual(ascending);
  });

  it('holds the verified Defy rates that make the ladder evidenced, not invented', () => {
    const by = (m: string) => VALUE_LADDER.find((r) => r.module === m)!;
    expect(by('shredding').perBedEquivalent).toBe(40); // 20kg x $2.00, INV-1731
    expect(by('pressing_cnc').perBedEquivalent).toBe(344.05); // INV-1602 + INV-1732
    expect(by('assembly').perBedEquivalent).toBe(400); // 344.05 + 55.95 assembly labour
    expect(by('sales_delivery').perBedEquivalent).toBe(750); // shop price
  });

  it('leaves collection unpriced, because Goods buys sorted feedstock from nobody', () => {
    const collection = VALUE_LADDER.find((r) => r.module === 'collection_baling')!;
    expect(collection.perBedEquivalent).toBeNull();
    expect(collection.grade).toBe('open');
  });

  it('grades every priced rung as verified, with a named source', () => {
    for (const rung of VALUE_LADDER) {
      if (rung.perBedEquivalent === null) continue;
      expect(rung.grade).toBe('verified');
      expect(rung.source.length).toBeGreaterThan(10);
    }
  });
});

describe('furthestRung', () => {
  it('reads the last completable step, not the most valuable one selected', () => {
    expect(furthestRung(['collection_baling', 'shredding'])!.module).toBe('shredding');
  });

  it('allows a run that starts partway down and buys its input in', () => {
    expect(furthestRung(['shredding', 'pressing_cnc'])!.module).toBe('pressing_cnc');
  });

  it('returns null for a run with a hole in it', () => {
    // Pressing with no shredding: the press has nothing to press.
    expect(furthestRung(['collection_baling', 'pressing_cnc'])).toBeNull();
  });

  it('returns null for an empty selection', () => {
    expect(furthestRung([])).toBeNull();
  });
});

describe('Utopia: collection and shredding, the live case', () => {
  const utopia = modelCommunity(['collection_baling', 'shredding'], 450);

  it('earns from shred, at the rate Goods pays Defy today', () => {
    expect(utopia.rung!.module).toBe('shredding');
    expect(utopia.annual.grossEarnings).toBe(40 * 450); // $18,000
  });

  it('is priceable, but on a collection band so wide it is nearly 4x end to end', () => {
    // Collection carries $5,000-$19,500 graded `estimate`. That is a real quote gap:
    // priceable is not the same as firm, and the setup range Utopia would be shown
    // spans tens of thousands. A firm collection quote is the cheapest way to
    // narrow it, and until then this band goes to nobody as a price.
    expect(utopia.setup.priceable).toBe(true);
    expect(utopia.setup.capexHigh - utopia.setup.capexLow).toBeGreaterThan(40_000);
  });

  it('shows shred alone does not cover the cost of running the site', () => {
    // $18,000 of shred against the site floor plus two modules' operating share.
    // This is the finding that matters: the earliest module is the one a community
    // most wants and the one that pays least. Never soften it.
    expect(utopia.annual.netToCommunity!).toBeLessThan(0);
  });
});

describe('a full chain community', () => {
  const full = modelCommunity([...FEED_ORDER], 450);

  it('earns the full bed price', () => {
    expect(full.annual.grossEarnings).toBe(750 * 450);
  });

  it('clears its operating cost with room to pay people', () => {
    expect(full.annual.netToCommunity!).toBeGreaterThan(0);
  });

  it('does not buy its input in', () => {
    expect(full.buysInputIn).toBe(false);
    expect(full.brokenChain).toBe(false);
  });
});

describe('Tennant Creek: a run that starts partway down', () => {
  const tc = modelCommunity(['shredding', 'pressing_cnc', 'assembly'], 450);

  it('is coherent, not broken', () => {
    expect(tc.brokenChain).toBe(false);
    expect(tc.buysInputIn).toBe(true);
  });

  it('says out loud that the bought-in input is a cost this model does not carry', () => {
    expect(tc.openDecisions.some((d) => d.includes('NOT in these figures'))).toBe(true);
  });
});

describe('the silences the model must keep', () => {
  const any = modelCommunity([...FEED_ORDER], 450);

  it('never splits the money into wages and surplus', () => {
    expect(any.openDecisions.some((d) => d.includes("community's call"))).toBe(true);
    expect(any.annual).not.toHaveProperty('wages');
  });

  it('flags the network fee as not agreed with anyone', () => {
    expect(any.openDecisions.some((d) => d.includes('not agreed'))).toBe(true);
  });
});

describe('the network fee falls as sites join', () => {
  it('is the whole network block at one site', () => {
    expect(networkFeePerSite(1)).toBe(NETWORK_BLOCK_PER_YEAR);
  });

  it('halves at two sites and thirds at three', () => {
    expect(networkFeePerSite(2)).toBe(54_750);
    expect(networkFeePerSite(3)).toBe(36_500);
  });

  it('refuses a nonsense site count rather than returning Infinity', () => {
    expect(() => networkFeePerSite(0)).toThrow(RangeError);
  });
});

describe('Palm Island: governance first, no production modules', () => {
  const pi = modelCommunity([], 450);

  it('costs nothing to set up, because no site was asked for', () => {
    // A model that charges a community for a container they did not ask for has
    // turned a pathway into a sales pitch.
    expect(pi.setup.capexLow).toBe(0);
    expect(pi.setup.capexHigh).toBe(0);
    expect(pi.annual.operatingCost).toBe(0);
  });

  it('has no income line, and says so rather than showing zero', () => {
    expect(pi.rung).toBeNull();
    expect(pi.annual.grossEarnings).toBeNull();
    expect(pi.annual.netToCommunity).toBeNull();
  });
});

describe('live pathways read from the recorded module selections', () => {
  it('resolves hyphenated pathway ids to the underscored keys in the JSON', () => {
    expect(pathwayModules('tennant-creek')).toEqual([
      'shredding',
      'pressing_cnc',
      'assembly',
      'sales_delivery',
    ]);
    expect(pathwayModules('palm-island')).toEqual([]);
  });

  it('returns null for an unknown pathway rather than an empty selection', () => {
    // An empty selection is a real answer (Palm Island). An unknown id is not, and
    // conflating them would silently price a community that has never been asked.
    expect(pathwayModules('not-a-community')).toBeNull();
    expect(modelPathway('not-a-community', 450)).toBeNull();
  });

  it('models Utopia from its recorded shredder-first selection', () => {
    const utopia = modelPathway('utopia', 450)!;
    expect(utopia.rung!.module).toBe('shredding');
    expect(utopia.annual.netToCommunity!).toBeLessThan(0);
  });
});
