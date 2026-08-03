/**
 * Lockstep between the two canon layers.
 *
 * asset-canonical.ts holds the headline totals; community-canonical.ts holds
 * the per-community rulings. If either is edited without the other, the
 * per-community lines could sum to something other than the headline the site
 * and funder documents state — the Utopia-169 class of error, one level up.
 * These tests make that state unrepresentable in a green build.
 */
import { describe, it, expect } from 'vitest';
import {
  COMMUNITY_INVOICE_PROVENANCE,
  COMMUNITY_BED_CANON,
  WASHER_STALE_DEPLOYED_ROWS,
  communityCanonTotals,
} from './community-canonical';
import { CANONICAL_ASSETS, WASHERS_IN_COMMUNITY_BY_COMMUNITY } from './asset-canonical';

describe('community canon sums to headline canon', () => {
  const totals = communityCanonTotals();

  it('beds tie to CANONICAL_ASSETS', () => {
    expect(totals.basketBeds).toBe(CANONICAL_ASSETS.basketBedsDeployed);
    expect(totals.stretchBeds).toBe(CANONICAL_ASSETS.stretchBedsDeployed);
    expect(totals.beds).toBe(CANONICAL_ASSETS.bedsDeployed);
  });

  it('washers tie to the 2026-07-21 ruling of 22', () => {
    expect(totals.washersInCommunity).toBe(CANONICAL_ASSETS.washersInCommunity);
  });

  it('communities served ties to canon', () => {
    expect(totals.communitiesServed).toBe(CANONICAL_ASSETS.communitiesServed);
  });

  it('community ids are unique and slugged', () => {
    const ids = COMMUNITY_BED_CANON.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('every entry carries a non-empty ruling citation', () => {
    for (const c of COMMUNITY_BED_CANON) expect(c.ruling.length).toBeGreaterThan(10);
  });

  it('Utopia is 147, never Community OS’s 169', () => {
    const utopia = COMMUNITY_BED_CANON.find((c) => c.id === 'utopia')!;
    expect(utopia.basketBeds + utopia.stretchBeds).toBe(147);
  });

  it('washer stale rows only name communities that have a washer ruling', () => {
    for (const id of Object.keys(WASHER_STALE_DEPLOYED_ROWS)) {
      expect(WASHERS_IN_COMMUNITY_BY_COMMUNITY).toHaveProperty(id);
    }
  });
});

describe('invoice provenance', () => {
  const maningrida = { invoices: COMMUNITY_INVOICE_PROVENANCE.maningrida };

  it('traces the 40 Stretch Beds to a real, PAID invoice', () => {
    // "How many Maningrida beds" kept coming back different. It has three answers
    // because there are two invoices for two products. This pins the flagship one.
    const line = maningrida.invoices!.find((i) => i.invoice === 'INV-0303')!;
    expect(line.quantity).toBe(40);
    expect(line.unitAmount).toBe(750);
    expect(line.status).toBe('PAID');
    expect(line.date).toBe('2026-05-18');
    expect(line.description).toMatch(/Stretch Bed/);
  });

  it('records the OTHER Maningrida invoice, which is the source of the confusion', () => {
    const line = maningrida.invoices!.find((i) => i.invoice === 'INV-0283')!;
    expect(line.quantity).toBe(13);
    expect(line.description).toMatch(/Basket Bed/);
    // The contact is Mala'la, not Maningrida. Searching Xero for the community
    // name returns nothing, which is exactly how this stayed unresolved.
    expect(line.contact).not.toMatch(/Maningrida/i);
  });

  it('never lets an invoiced quantity exceed the register count for that product', () => {
    // The register counts assets in community; an invoice records a sale. The
    // register is always the larger number. If it ever is not, either a sale was
    // not delivered or the register is missing rows, and both need a human.
    for (const c of COMMUNITY_BED_CANON) {
      const invoices = COMMUNITY_INVOICE_PROVENANCE[c.id];
      if (!invoices) continue;
      const sold = (re: RegExp) =>
        invoices
          .filter((i) => (i.status === 'PAID' || i.status === 'AUTHORISED') && re.test(i.description))
          .reduce((t, i) => t + i.quantity, 0);
      expect(sold(/Stretch Bed/), `${c.id} stretch`).toBeLessThanOrEqual(c.stretchBeds);
      expect(sold(/Basket Bed/), `${c.id} basket`).toBeLessThanOrEqual(c.basketBeds);
    }
  });

  it('gives every traced invoice line a number, a date and a status', () => {
    for (const lines of Object.values(COMMUNITY_INVOICE_PROVENANCE)) {
      for (const i of lines) {
        expect(i.invoice).toMatch(/^INV-\d+$/);
        expect(i.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(['PAID', 'AUTHORISED', 'VOIDED', 'DELETED']).toContain(i.status);
      }
    }
  });
});
