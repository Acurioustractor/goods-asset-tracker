import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  BED_PRICE_IN_SOURCE,
  BUILD_PATHS,
  NETWORK_SHARED_COST_AUD,
  PATHWAYS,
  PATHWAY_BANNER,
  PATHWAY_FINDING,
  PATHWAY_REFUSALS,
  PATHWAY_SCALE_BEDS,
  SELLING_SPREAD_AUD,
  SHRED_TO_KIT_MULTIPLE,
  VALUE_LADDER,
  losingPathways,
  networkFeePerSite,
  payingPathways,
  earnsPerBed,
  breakEvenBeds,
} from './community-economics';
import { BED_PRICE_AUD } from './bed-ratio';

const SRC = readFileSync(join(__dirname, 'community-economics.ts'), 'utf8');
const near = (a: number, b: number, tol = 0.01) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe('the value ladder climbs, and every priced rung has an invoice behind it', () => {
  it('is priced in order and never goes down', () => {
    const priced = VALUE_LADDER.filter((r) => r.worthPerBedAud !== null).map((r) => r.worthPerBedAud!);
    expect([...priced].sort((a, b) => a - b)).toEqual(priced);
  });

  it('tops out at the bed price, so the ladder and canon agree', () => {
    expect(VALUE_LADDER[VALUE_LADDER.length - 1].worthPerBedAud).toBe(BED_PRICE_IN_SOURCE);
    expect(BED_PRICE_IN_SOURCE).toBe(BED_PRICE_AUD);
  });

  it('names a source for every rung, and an invoice for every priced one', () => {
    for (const r of VALUE_LADDER) {
      expect(r.source.length).toBeGreaterThan(25);
      if (r.worthPerBedAud !== null) expect(r.grade).toBe('verified');
    }
    expect(VALUE_LADDER.filter((r) => /INV-/.test(r.source)).length).toBeGreaterThanOrEqual(2);
  });

  it('keeps collection unpriced, because no purchase price exists', () => {
    const first = VALUE_LADDER[0];
    expect(first.worthPerBedAud).toBeNull();
    expect(first.grade).toBe('open');
    expect(first.source).toMatch(/\$0/);
  });

  it('assembly is the kit plus assembly labour, to the cent', () => {
    const kit = VALUE_LADDER.find((r) => r.step === 'Pressing and CNC')!.worthPerBedAud!;
    const assembled = VALUE_LADDER.find((r) => r.step === 'Assembly')!.worthPerBedAud!;
    near(assembled - kit, 55.95);
  });

  it('shred to pressed kits multiplies a bed’s worth by 8.6', () => {
    near(SHRED_TO_KIT_MULTIPLE, 8.6, 0.01);
  });
});

describe('the three build paths add up, and the community one is cheapest', () => {
  it('every path sums its own components', () => {
    for (const p of BUILD_PATHS) {
      const built = p.plasticAud + p.steelAud + p.canvasAud + p.hardwareAud + p.dieselAud + p.labourAud + p.freightAud;
      near(built, p.totalAud);
    }
  });

  it('community plastic is free, which is why it wins', () => {
    const c = BUILD_PATHS.find((p) => p.name === 'Community')!;
    const f = BUILD_PATHS.find((p) => p.name === 'Factory')!;
    expect(c.plasticAud).toBe(0);
    expect(c.labourAud).toBeGreaterThan(f.labourAud);
    expect(c.totalAud).toBeLessThan(f.totalAud);
    expect(c.totalAud).toBe(Math.min(...BUILD_PATHS.map((p) => p.totalAud)));
  });

  it('freight is $150 on both the paths Goods runs, which is where canon’s figure comes from', () => {
    for (const name of ['Factory', 'Community']) {
      expect(BUILD_PATHS.find((p) => p.name === name)!.freightAud).toBe(150);
    }
  });

  it('the Factory path less freight is the canon make cost', () => {
    const f = BUILD_PATHS.find((p) => p.name === 'Factory')!;
    near(f.totalAud - f.freightAud, 275.74);
    expect(SRC).toMatch(/became a pass-through/);
  });

  it('says not to buy cut kits', () => {
    expect(BUILD_PATHS.find((p) => p.name === 'Buy-Kit')!.note).toMatch(/not to buy these/);
  });
});

describe('the finding: selling pays and pressing alone does not', () => {
  it('every pathway does its own arithmetic', () => {
    for (const p of PATHWAYS) {
      near(p.earnsPerYearAud - p.runningPerYearAud, p.leftOverPerYearAud);
      expect(p.setupHighAud).toBeGreaterThan(p.setupLowAud);
    }
  });

  it('every pathway that sells, pays', () => {
    for (const p of PATHWAYS.filter((x) => x.includesSelling)) {
      expect(p.leftOverPerYearAud).toBeGreaterThan(0);
    }
  });

  it('the losing pathway does not sell, and pressing pays without selling too', () => {
    // The converse does not hold and must not be implied: pressing is positive at $83,741.50
    // without selling a bed. It is the setup and the return that make selling the better move.
    for (const p of losingPathways()) expect(p.includesSelling).toBe(false);
    const press = PATHWAYS.find((p) => p.option === 'Collect, shred and press')!;
    expect(press.includesSelling).toBe(false);
    expect(press.leftOverPerYearAud).toBeGreaterThan(0);
  });

  it('exactly one pathway loses money, and it is the one the source calls today’s ask', () => {
    expect(losingPathways()).toHaveLength(1);
    const lose = losingPathways()[0];
    expect(lose.option).toBe('Collect and shred');
    expect(lose.leftOverPerYearAud).toBe(-33_043);
    expect(lose.note).toMatch(/today’s ask/);
  });

  it('selling beats pressing on return and on setup', () => {
    const sell = PATHWAYS.find((p) => p.option === 'Collect, shred and sell')!;
    const press = PATHWAYS.find((p) => p.option === 'Collect, shred and press')!;
    expect(sell.leftOverPerYearAud).toBeGreaterThan(press.leftOverPerYearAud);
    expect(sell.setupLowAud).toBeLessThan(press.setupLowAud);
    expect(sell.setupHighAud).toBeLessThan(press.setupHighAud);
  });

  it('the cheapest setup of all five is the one with no plant', () => {
    const noPlant = PATHWAYS.find((p) => p.option === 'Sell and deliver only, no plant')!;
    expect(noPlant.setupLowAud).toBe(Math.min(...PATHWAYS.map((p) => p.setupLowAud)));
    expect(noPlant.leftOverPerYearAud).toBeGreaterThan(100_000);
  });

  it('the whole chain still earns the most, so a plant is not argued away', () => {
    const whole = PATHWAYS.find((p) => p.option === 'The whole chain')!;
    expect(whole.leftOverPerYearAud).toBe(Math.max(...PATHWAYS.map((p) => p.leftOverPerYearAud)));
  });
});

describe('the pathway figures derive from 450 beds and the ladder', () => {
  const at = (step: string) => VALUE_LADDER.find((r) => r.step === step)!.worthPerBedAud!;

  it('collect and shred earns the shred rung across the year', () => {
    near(PATHWAY_SCALE_BEDS * at('Shredding'), PATHWAYS[0].earnsPerYearAud);
  });

  it('pressing earns the kit rung across the year', () => {
    const press = PATHWAYS.find((p) => p.option === 'Collect, shred and press')!;
    near(PATHWAY_SCALE_BEDS * at('Pressing and CNC'), press.earnsPerYearAud);
  });

  it('the whole chain earns the bed price across the year', () => {
    const whole = PATHWAYS.find((p) => p.option === 'The whole chain')!;
    near(PATHWAY_SCALE_BEDS * at('Sales and delivery'), whole.earnsPerYearAud);
  });

  it('selling only earns the spread, which is the price less a finished bed', () => {
    expect(SELLING_SPREAD_AUD).toBe(350);
    near(SELLING_SPREAD_AUD, at('Sales and delivery') - at('Assembly'));
    const noPlant = PATHWAYS.find((p) => p.option === 'Sell and deliver only, no plant')!;
    near(PATHWAY_SCALE_BEDS * SELLING_SPREAD_AUD, noPlant.earnsPerYearAud);
  });

  it('collect, shred and sell is the shred plus the spread', () => {
    const sell = PATHWAYS.find((p) => p.option === 'Collect, shred and sell')!;
    near(PATHWAY_SCALE_BEDS * (at('Shredding') + SELLING_SPREAD_AUD), sell.earnsPerYearAud);
  });
});

describe('the network fee halves, thirds and quarters', () => {
  it('divides the shared cost by the sites', () => {
    expect(NETWORK_SHARED_COST_AUD).toBe(109_500);
    near(networkFeePerSite(1), 109_500);
    near(networkFeePerSite(2), 54_750);
    near(networkFeePerSite(3), 36_500);
    near(networkFeePerSite(4), 27_375);
  });

  it('says it is arithmetic and not an offer', () => {
    expect(SRC).toMatch(/this is the arithmetic, not an offer/);
    expect(SRC).toMatch(/roughly triples/);
  });
});

describe('the refusals travel with the figures', () => {
  it('carries the banner about nothing being offered', () => {
    expect(PATHWAY_BANNER).toMatch(/Nothing here has been offered to any community/);
    expect(PATHWAY_BANNER).toMatch(/walked through it in person/);
  });

  it('keeps all three refusals', () => {
    expect(PATHWAY_REFUSALS).toHaveLength(3);
    expect(PATHWAY_REFUSALS[0]).toMatch(/wages and surplus/);
    expect(PATHWAY_REFUSALS[0]).toMatch(/a conversation belongs/);
  });

  it('says freight is unmodelled inside the selling spread', () => {
    const noPlant = PATHWAYS.find((p) => p.option === 'Sell and deliver only, no plant')!;
    expect(noPlant.note).toMatch(/not modelled/);
    expect(noPlant.note).toMatch(/unproven size/);
  });

  it('states the finding in one sentence', () => {
    expect(PATHWAY_FINDING).toMatch(/Every pathway that includes selling makes money/);
    expect(PATHWAY_FINDING).toMatch(/no extra capex/);
  });

  it('has no em dashes', () => {
    expect(SRC).not.toMatch(/—/);
  });
});

describe('break-even in beds, which needs no volume assumption', () => {
  const of = (name: string) => PATHWAYS.find((p) => p.option === name)!;

  it('says plainly that the 450 has no derivation', () => {
    expect(SRC).toMatch(/THE 450 HAS NO DERIVATION/);
    expect(SRC).toMatch(/appears nowhere else/);
  });

  it('selling breaks even around a hundred beds a year', () => {
    expect(Math.round(breakEvenBeds(of('Sell and deliver only, no plant')))).toBe(105);
    expect(Math.round(breakEvenBeds(of('The whole chain')))).toBe(106);
  });

  it('pressing needs about twice what selling needs', () => {
    const press = breakEvenBeds(of('Collect, shred and press'));
    const sell = breakEvenBeds(of('Sell and deliver only, no plant'));
    expect(Math.round(press)).toBe(207);
    expect(press / sell).toBeGreaterThan(1.9);
  });

  it('collect and shred needs more beds than any plant volume in the model', () => {
    const be = breakEvenBeds(of('Collect and shred'));
    expect(Math.round(be)).toBe(1276);
    // A plant is modelled at 200 in year one and 720 at steady state. Witta tops out at 960.
    expect(be).toBeGreaterThan(960);
  });

  it('earns per bed reconstructs the ladder', () => {
    expect(earnsPerBed(of('Collect and shred'))).toBeCloseTo(40, 2);
    expect(earnsPerBed(of('The whole chain'))).toBeCloseTo(750, 2);
    expect(earnsPerBed(of('Sell and deliver only, no plant'))).toBeCloseTo(350, 2);
  });
});
