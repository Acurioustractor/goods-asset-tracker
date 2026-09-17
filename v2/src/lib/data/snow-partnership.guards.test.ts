/**
 * The Snow report is a claim about a relationship, a consent decision and a money figure all
 * on one page, so all three are tested.
 *
 * The rule that earns its keep here is the last one. This page is allowed to carry dollar
 * figures BECAUSE it is password gated in proxy.ts. If someone later un-gates /partners/<slug>/story,
 * a page written for one funder about their own money becomes public. The gate is therefore
 * part of the contract and is asserted against the actual proxy source, not assumed.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  ALIGNMENT, BECAUSE_OF, BUYER_TOTALS, BUYERS, FILMS, MAP_PLACES, NOT_FINISHED, PLACE_BEATS,
  PRICE_LADDER, SNOW_MONEY, THE_ARC, THEMES, TOGETHER, TOGETHER_KINDS, WALLS, WASHER_FLEET,
  WASHER_PLACES,
  WASHER_TELEMETRY,
} from '@/lib/data/snow-partnership';
import { PAID_INVOICES, PAID_INVOICE_BEDS } from '@/lib/data/paid-trade';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { GRANTS_RECEIVED } from '@/lib/data/grants-received';
import { getStorytellerBySlug } from '@/lib/data/storyteller-registry';

const PAGE = join(process.cwd(), 'src/app/partners/[slug]/story/page.tsx');

describe('snow partnership report', () => {
  it('the page is behind the partner password gate', () => {
    // Not "is there a gate somewhere" but "does the gate's own regex match this route".
    const proxy = readFileSync(join(process.cwd(), 'src/proxy.ts'), 'utf8');
    const line = proxy.split('\n').find((l) => l.includes('partnerDashMatch') && l.includes('match('));
    expect(line, 'the partner gate regex has moved or been renamed').toBeTruthy();
    const src = line!.slice(line!.indexOf('/^'), line!.lastIndexOf('/'));
    const re = new RegExp(src.slice(1));
    expect(re.test('/partners/snow/story'), 'the Snow report route is NOT gated').toBe(true);
    expect(re.test('/partners/snow/dashboard'), 'the dashboard gate was broken').toBe(true);
    expect(re.test('/partners/centrecorp'), 'the public partner page must stay open').toBe(false);
  });

  it('the marketing nav is suppressed on the report', () => {
    // It shipped with "Buy a bed" and a cart above a private funder report. The rule already
    // existed for the dashboard; this route was simply missed, so assert the pattern itself.
    const chrome = readFileSync(join(process.cwd(), 'src/components/layout/conditional-chrome.tsx'), 'utf8');
    const line = chrome.split('\n').find((l) => l.includes('STANDALONE_PATH_PATTERNS') && l.includes('['));
    expect(line, 'the standalone pattern list has moved or been renamed').toBeTruthy();
    const src = line!.slice(line!.indexOf('/^'), line!.lastIndexOf('/'));
    const re = new RegExp(src.slice(1));
    expect(re.test('/partners/snow/story'), 'the report still carries the marketing nav').toBe(true);
    expect(re.test('/partners/snow/dashboard'), 'the dashboard rule was broken').toBe(true);
    expect(re.test('/partners/centrecorp'), 'public partner pages must keep the chrome').toBe(false);
  });

  it('the pinned films use a layout that actually pins', () => {
    // -mt-screen is not a Tailwind class. It silently did nothing, the steps fell below the
    // film instead of over it, and -z-10 put the film behind the page background, so the
    // whole chapter rendered as cream text on cream. Assert the working pattern from
    // sticky-film.tsx instead of trusting the next edit.
    const raw = readFileSync(join(process.cwd(), 'src/components/partners/place-films.tsx'), 'utf8');
    // Strip comments first: the file explains this bug in prose, and a guard that matches its
    // own explanation is a guard that can never be satisfied.
    const film = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(film).toContain('-mt-[100svh]');
    expect(film).toContain('sticky top-0');
    expect(film, 'a negative z-index hides the film behind the page background').not.toContain('-z-10');
    expect(film, '-mt-screen is not a Tailwind class').not.toContain('-mt-screen');
  });

  it('the buyers reconcile to the paid invoices, bed for bed', () => {
    // BUYERS is written by hand because "what route to market is this an example of" is a
    // judgement. The numbers are not, so they are held to the invoice record.
    expect(BUYER_TOTALS.beds).toBe(PAID_INVOICE_BEDS);
    expect(BUYER_TOTALS.invoices).toBe(PAID_INVOICES.length);
    const byBuyer = new Map<string, number>();
    for (const i of PAID_INVOICES) byBuyer.set(i.buyer, (byBuyer.get(i.buyer) ?? 0) + i.beds);
    expect(BUYERS.length).toBe(byBuyer.size);
    for (const b of BUYERS) {
      expect(byBuyer.get(b.buyer), `${b.buyer} is not a buyer in the invoice record`).toBe(b.beds);
    }
    const prices = [...new Set(PAID_INVOICES.map((i) => i.bedUnitPriceAud))].sort((a, b) => a - b);
    expect([...PRICE_LADDER]).toEqual(prices);
  });

  it('prints no withdrawn demand figure', () => {
    // Ben, 15 September: the "who has asked" numbers are made up and withdrawn. They must
    // never appear, and this page is the most likely place for them to creep back in.
    // Comments stripped: both files name the withdrawn figures in order to forbid them, and a
    // guard that matches its own prohibition can never pass.
    const strip = (t: string) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    const page = strip(readFileSync(PAGE, 'utf8'));
    const data = strip(readFileSync(join(process.cwd(), 'src/lib/data/snow-partnership.ts'), 'utf8'));
    const withdrawn = /\b(150|65|500)\s+beds|200\s*(to|-|–)\s*350|\bGroote\b/i;
    for (const [what, text] of [['page', page], ['data', data]] as const) {
      expect(withdrawn.test(text), `a withdrawn demand figure is back in the ${what}`).toBe(false);
    }
  });

  it('the map machines tie to canon and to the per-place washer list', () => {
    // Two lists now carry machines per place: WASHER_PLACES in the machines chapter and
    // MAP_PLACES under the scrub. They must agree with each other and with canon, or the page
    // shows a funder two different fleets.
    const onMap = MAP_PLACES.reduce((n, p) => n + p.washers, 0);
    expect(onMap).toBe(CANONICAL_ASSETS.washersInCommunity);
    expect(onMap).toBe(WASHER_PLACES.reduce((n, w) => n + w.inCommunity, 0));
  });

  it('the washer count matches canon and the telemetry is internally consistent', () => {
    const summed = WASHER_PLACES.reduce((n, w) => n + w.inCommunity, 0);
    expect(summed, 'the per-place washers do not add to the canonical figure').toBe(CANONICAL_ASSETS.washersInCommunity);
    // Only ten machines report, which is fewer than are in community. If that ever inverts,
    // somebody has counted a controller as a machine.
    expect(WASHER_TELEMETRY.reporting).toBeLessThanOrEqual(summed);
    expect(WASHER_TELEMETRY.flagship.cycles).toBeLessThanOrEqual(WASHER_TELEMETRY.totalCycles);
    expect(WASHER_TELEMETRY.flagship.kwh).toBeLessThanOrEqual(WASHER_TELEMETRY.totalKwh);
    expect(WASHER_TELEMETRY.readAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('the fleet table adds up to the fleet summary', () => {
    // Two readings of the same day on one page. If the rows and the headline ever disagree, a
    // funder who adds the column up finds the gap before we do.
    expect(WASHER_FLEET.reduce((n, r) => n + r.cycles, 0)).toBe(WASHER_TELEMETRY.totalCycles);
    expect(WASHER_FLEET.some((r) => r.state === 'unmatched'), 'the unmatched controllers were dropped, which makes the fleet look tidier than it is').toBe(true);
    for (const r of WASHER_FLEET) {
      expect(r.from <= r.to, `${r.assetId ?? r.where} reports backwards`).toBe(true);
      expect(r.to <= WASHER_TELEMETRY.readAt, `${r.assetId ?? r.where} reports after the read date`).toBe(true);
    }
  });

  it('every moment is dated, sourced and sortable', () => {
    for (const m of TOGETHER) {
      expect(m.when, `${m.title} has no date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(m.source.length, `${m.title} has no source`).toBeGreaterThan(8);
      expect(Object.keys(TOGETHER_KINDS)).toContain(m.kind);
    }
  });

  it('the moments are in order and nothing is dated in the future', () => {
    const sorted = TOGETHER.map((m) => m.when).slice().sort();
    expect(TOGETHER.map((m) => m.when)).toEqual(sorted);
    const today = new Date().toISOString().slice(0, 10);
    for (const m of TOGETHER) expect(m.when <= today, `${m.title} is dated in the future`).toBe(true);
  });

  it('every photo on the timeline exists', () => {
    for (const m of TOGETHER) {
      if (!m.image) continue;
      expect(existsSync(join(process.cwd(), 'public', m.image.src)), `missing: ${m.image.src}`).toBe(true);
    }
  });

  it('the Goods-only figure and the all-paid figure differ by exactly INV-0092', () => {
    // $35,200 is the (Con)nected Drug Court invoice. If either figure is edited without the
    // other, this catches it before a funder sees two numbers that do not reconcile.
    expect(SNOW_MONEY.allPaidIncGstAud - SNOW_MONEY.goodsOnlyIncGstAud).toBeCloseTo(35_200, 2);
    // Both are inc-GST, so the ex-GST pair must sit at the same 1.1 ratio.
    expect(SNOW_MONEY.goodsOnlyIncGstAud / SNOW_MONEY.goodsOnlyExGstAud).toBeCloseTo(1.1, 3);
  });

  it('the Snow share of philanthropy is derived from the same basis on both sides', () => {
    const total = GRANTS_RECEIVED.reduce((n, g) => n + g.amountAud, 0);
    // Take the same $35,200 off the denominator, or the share is computed against a total
    // that still counts an invoice we have excluded from the numerator.
    const share = (SNOW_MONEY.goodsOnlyIncGstAud / (total - 35_200)) * 100;
    expect(Math.round(share)).toBe(SNOW_MONEY.shareOfAllPhilanthropyPct);
  });

  it('every quote on the page resolves from the registry and is approved', () => {
    const page = readFileSync(PAGE, 'utf8');
    const calls = [...page.matchAll(/quote\('([a-z-]+)',\s*'(funder|external)',\s*(['"])(.+?)\3\)/g)];
    expect(calls.length, 'no registry quote calls found; did the resolver change shape?').toBeGreaterThan(4);
    for (const [, slug, tier, , contains] of calls) {
      const person = getStorytellerBySlug(slug);
      expect(person, `unknown slug: ${slug}`).toBeTruthy();
      expect(person!.tier, `${slug} is tier ${person!.tier}, the page asks for ${tier}`).toBe(tier);
      const matches = person!.quotes.filter((q) => q.text.includes(contains));
      expect(matches.length, `no quote of ${person!.name} contains "${contains}"`).toBe(1);
      expect(['primary', 'approved'], `${person!.name}'s matched quote is ${matches[0].status}`).toContain(matches[0].status);
    }
  });

  it('does not put words in Snow\'s mouth', () => {
    // No Snow person has ever put the loan or impact-investment pathway in writing. Every
    // Snow intention on this page is a dated quote or it is absent.
    const page = readFileSync(PAGE, 'utf8');
    const banned = /Snow has (opened|asked|offered|committed to|indicated)|Snow wants|Snow is ready to/i;
    expect(banned.test(page), 'the page asserts a Snow intention rather than quoting one').toBe(false);
  });

  it('does not pitch the thing Snow excludes', () => {
    // Snow's published exclusions name "Environmental causes", so the plastic is on this page as
    // local economics and it has to say out loud that we are not asking them to fund it. The
    // alignment table this used to test was cut on 17 September; the rule outlived it.
    const plastic = THEMES.find((x) => x.id === 'plastic');
    expect(plastic, 'the plastic theme was removed; Snow still excludes environmental causes').toBeTruthy();
    expect(/not asking you to/i.test(plastic!.limit), 'the plastic card no longer disclaims the environmental ask').toBe(true);
  });

  it('every theme carries its own limit, and ownership still prints zero', () => {
    // A page of only strong claims is a pitch. The limits used to live in one box near the end,
    // which read as a disclaimer; they are in the cards now, so the guard follows them there.
    expect(THEMES.length).toBeGreaterThanOrEqual(5);
    for (const th of THEMES) {
      expect(th.proof.length, `${th.id} has no evidence line`).toBeGreaterThan(20);
      expect(th.limit.length, `${th.id} has no limit line`).toBeGreaterThan(40);
    }
    const health = THEMES.find((x) => x.id === 'health')!;
    expect(/cannot show a prevented case/i.test(health.limit), 'the health card stopped refusing the clinical claim').toBe(true);
    const owned = THEMES.find((x) => x.id === 'ownership')!;
    expect(/zero community-owned/i.test(owned.limit), 'the zero sites number is the one we print against ourselves').toBe(true);
    expect(BECAUSE_OF.some((b) => b.status === 'future' && b.value === 0)).toBe(true);
  });

  it('claims no health outcome', () => {
    const page = readFileSync(PAGE, 'utf8');
    const banned = /prevent(s|ed|ing)? (rheumatic|heart disease|RHD)|cardiac prevention|cases prevented|reduc(es|ed) (rheumatic|RHD)/i;
    expect(banned.test(page), 'the report claims a health outcome').toBe(false);
  });

  it('every film, aerial and photograph on the page exists', () => {
    const paths: string[] = [];
    for (const f of FILMS) paths.push(f.src, f.poster);
    for (const b of PLACE_BEATS) paths.push(b.film.src, b.film.poster);
    for (const w of WALLS) for (const f of w.files) paths.push(w.dir + f.file);
    for (const rel of paths) {
      expect(existsSync(join(process.cwd(), 'public', rel)), `missing asset: ${rel}`).toBe(true);
    }
  });

  it('the arc is in the order it happened and every photograph of it exists', () => {
    // Ben, 17 September: the order IS the argument, so a reordered arc is a broken argument.
    expect(THE_ARC.map((s) => s.id)).toEqual([
      'basket-bed', 'washing-machine', 'stretch-bed', 'facility', 'next-machine',
    ]);
    for (const s of THE_ARC) {
      if (!s.photo) continue;
      expect(existsSync(join(process.cwd(), 'public', s.photo.src)), `missing: ${s.photo.src}`).toBe(true);
    }
    // The thing that does not exist yet must not borrow a photograph of the thing that does.
    expect(THE_ARC.find((s) => s.id === 'next-machine')!.photo, 'the unbuilt machine has a photo').toBeUndefined();
  });

  it('a place beat names the place its own footage was shot in', () => {
    // The bug this exists for: the first cut ran one aerial behind four beats, so the words
    // said Tennant Creek while the credit said Maningrida. A beat's film path and its `place`
    // string must agree on the location, which is the only part a human can get wrong.
    const WHERE: Record<string, string> = {
      'tennant-creek': 'tennant creek',
      maningrida: 'maningrida',
      kalgoorlie: 'kalgoorlie',
    };
    for (const b of PLACE_BEATS) {
      const dir = b.film.src.split('/')[2];
      const needle = WHERE[dir];
      expect(needle, `no known place for footage directory "${dir}"`).toBeTruthy();
      expect(
        b.place.toLowerCase().includes(needle),
        `beat "${b.id}" runs ${dir} footage but its place reads "${b.place}"`,
      ).toBe(true);
    }
  });

  it('a place beat only quotes people the registry places there', () => {
    // The bug this exists for: the Maningrida beat carried Gary, whose registry community is
    // Mount Isa, so an Arnhem Land aerial ran under a Queensland voice. Match on the first part
    // of the person's community, because a beat names a site and the registry names a town.
    for (const b of PLACE_BEATS) {
      for (const ref of b.voices ?? []) {
        const person = getStorytellerBySlug(ref.slug);
        expect(person, `unknown slug: ${ref.slug}`).toBeTruthy();
        const town = (person!.community ?? '').split(/[,(/]/)[0].trim().toLowerCase();
        expect(town, `${person!.name} has no community, so no beat can claim them`).not.toBe('');
        expect(
          b.place.toLowerCase().includes(town),
          `beat "${b.id}" (${b.place}) quotes ${person!.name}, whose community is ${person!.community}`,
        ).toBe(true);
      }
    }
  });

  it('every photograph on a place beat exists', () => {
    for (const b of PLACE_BEATS) {
      for (const ph of b.photos ?? []) {
        expect(existsSync(join(process.cwd(), 'public', ph.src)), `missing: ${ph.src}`).toBe(true);
      }
    }
  });

  it('every voice in the films and the arc is cleared and approved', () => {
    const refs = [
      ...FILMS.flatMap((f) => (f.voice ? [f.voice] : [])),
      ...PLACE_BEATS.flatMap((b) => b.voices ?? []),
    ];
    expect(refs.length, 'no registry-resolved voices left on the page').toBeGreaterThan(3);
    for (const r of refs) {
      const person = getStorytellerBySlug(r.slug);
      expect(person, `unknown slug: ${r.slug}`).toBeTruthy();
      expect(person!.tier, `${r.slug} must be an external community voice here`).toBe('external');
      const matches = person!.quotes.filter((q) => q.text.includes(r.contains));
      expect(matches.length, `no quote of ${person!.name} contains "${r.contains}"`).toBe(1);
      expect(['primary', 'approved']).toContain(matches[0].status);
    }
  });

  it('the map grows in time order and every place is on the register', () => {
    const sorted = MAP_PLACES.map((p) => p.since).slice().sort();
    expect(MAP_PLACES.map((p) => p.since)).toEqual(sorted);
    for (const p of MAP_PLACES) {
      expect(p.since, `${p.name} has no month`).toMatch(/^\d{4}-\d{2}$/);
      expect(p.beds, `${p.name} has no beds`).toBeGreaterThan(0);
      expect(Math.abs(p.lat), `${p.name} latitude looks wrong`).toBeGreaterThan(9);
    }
  });
});
