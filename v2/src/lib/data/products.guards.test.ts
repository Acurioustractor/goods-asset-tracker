/**
 * Tests for the purchasable-product guard in src/lib/data/products.ts.
 *
 * These are canon invariants — they lock the contract that the rest of the
 * purchase path (cart context, checkout API) depends on. Behaviour derived
 * directly from the source:
 *
 *   - PURCHASABLE_PRODUCT_TYPES = [STRETCH_BED.productType]
 *   - isPurchasableProductType(x) === (x === STRETCH_BED.productType)
 *
 * Expectations are written against the exported constants — if a new
 * purchasable product is ever added, the "exactly one purchasable type"
 * invariant and the "equals STRETCH_BED.productType" invariant will both
 * fail loudly, which is the point.
 */
import { describe, it, expect } from 'vitest';
import {
  isPurchasableProductType,
  PURCHASABLE_PRODUCT_TYPES,
  STRETCH_BED,
  WASHING_MACHINE,
  BASKET_BED,
} from './products';

describe('isPurchasableProductType', () => {
  describe('accepts the Stretch Bed product type', () => {
    it('returns true for STRETCH_BED.productType', () => {
      expect(isPurchasableProductType(STRETCH_BED.productType)).toBe(true);
    });

    it('returns true for the raw "stretch_bed" string', () => {
      expect(isPurchasableProductType('stretch_bed')).toBe(true);
    });
  });

  describe('rejects non-purchasable product types', () => {
    it('rejects washing_machine', () => {
      expect(isPurchasableProductType(WASHING_MACHINE.productType)).toBe(false);
      expect(isPurchasableProductType('washing_machine')).toBe(false);
    });

    it('rejects basket_bed', () => {
      expect(isPurchasableProductType(BASKET_BED.productType)).toBe(false);
      expect(isPurchasableProductType('basket_bed')).toBe(false);
    });

    it('rejects the discontinued weave_bed slug', () => {
      // The Weave Bed is discontinued (see CLAUDE.md). Both the camelCase
      // and snake_case variants must be rejected — anything that looks like
      // a stretch-bed variant but uses an old slug should fail closed.
      expect(isPurchasableProductType('weave_bed')).toBe(false);
      expect(isPurchasableProductType('weave-bed')).toBe(false);
    });
  });

  describe('rejects arbitrary / non-string inputs', () => {
    it.each([
      ['empty string', ''],
      ['uppercase STRETCH_BED', 'STRETCH_BED'],
      ['mixed-case Stretch_Bed', 'Stretch_Bed'],
      ['whitespace-padded stretch_bed', ' stretch_bed'],
      ['whitespace-padded (trailing)', 'stretch_bed '],
      ['looks-similar "stretchbed"', 'stretchbed'],
      ['looks-similar "stretch-bed"', 'stretch-bed'],
      ['unknown product', 'rocket_ship'],
      ['sql injection-y', "stretch_bed' OR '1'='1"],
      ['numeric string', '1'],
    ])('rejects %s', (_label, value) => {
      expect(isPurchasableProductType(value)).toBe(false);
    });
  });

  describe('rejects null and undefined (the whole point of the guard)', () => {
    it('rejects null', () => {
      expect(isPurchasableProductType(null)).toBe(false);
    });

    it('rejects undefined', () => {
      expect(isPurchasableProductType(undefined)).toBe(false);
    });
  });

  describe('type-narrowing behaviour', () => {
    it('acts as a type predicate: true branch narrows to PurchasableProductType', () => {
      // This is a compile-time check — we exercise it at runtime by feeding
      // the result back through a function that requires PurchasableProductType.
      const value: string | null = STRETCH_BED.productType;
      if (isPurchasableProductType(value)) {
        // value is now PurchasableProductType ('stretch_bed')
        expect(value).toBe('stretch_bed');
      } else {
        throw new Error('expected the type predicate to be true for stretch_bed');
      }
    });
  });
});

describe('PURCHASABLE_PRODUCT_TYPES (canon invariant)', () => {
  it('contains exactly one product type', () => {
    expect(PURCHASABLE_PRODUCT_TYPES).toHaveLength(1);
  });

  it('the only purchasable product type is stretch_bed', () => {
    expect(PURCHASABLE_PRODUCT_TYPES[0]).toBe('stretch_bed');
  });

  it('exactly matches STRETCH_BED.productType', () => {
    // This is the stronger invariant: the const array and the const object
    // must agree. If someone changes STRETCH_BED.productType without updating
    // the array (or vice versa), this test catches the drift.
    expect(PURCHASABLE_PRODUCT_TYPES).toEqual([STRETCH_BED.productType]);
  });

  it('isPurchasableProductType is consistent with the array', () => {
    for (const t of PURCHASABLE_PRODUCT_TYPES) {
      expect(isPurchasableProductType(t)).toBe(true);
    }
  });

  it('isPurchasableProductType rejects every other known product type', () => {
    const others = [WASHING_MACHINE.productType, BASKET_BED.productType, 'weave_bed'];
    for (const t of others) {
      expect(isPurchasableProductType(t)).toBe(false);
    }
  });
});
