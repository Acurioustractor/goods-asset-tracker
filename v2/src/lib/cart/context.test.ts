// @vitest-environment jsdom
//
// Tests for the cart context in src/lib/cart/context.tsx.
//
// NOTE on filename: the task spec asked for context.test.tsx, but the
// locked vitest config (vitest.config.ts) only picks up files matching
// the .test.ts glob. We ship as .test.ts and use React.createElement
// instead of JSX so the file is actually runnable under the locked
// include glob. (Also noted in CALIBRATION-NOTES.md.)
//
// Behaviour derived from the source:
//   - addItem: rejects non-purchasable product types (returns state unchanged).
//   - addItem: if (id, is_sponsorship, sponsored_community) all match an
//     existing item, merges by summing quantities; otherwise appends.
//   - updateQuantity: <= 0 removes the item; > 0 sets the new quantity.
//   - removeItem: filters by id.
//   - clearCart: empties items.
//   - itemCount = sum(quantity). subtotal = sum(price_cents * quantity).
//   - localStorage persistence: write-through on every items change;
//     on mount, loads + filters out non-purchasable product types.
//
// The provider uses two effects (one for load, one for save). Tests wait
// for these to settle with act() and a microtask flush.
import { createElement, type ReactNode } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { CartProvider, useCart, type CartItem } from './context';
import { STRETCH_BED, WASHING_MACHINE, BASKET_BED } from '@/lib/data/products';

const CART_STORAGE_KEY = 'goods-cart';

const baseItem = (
  overrides: Partial<Omit<CartItem, 'quantity'>> = {}
): Omit<CartItem, 'quantity'> => ({
  id: 'stretch-bed-uuid-1',
  slug: STRETCH_BED.slug,
  name: STRETCH_BED.name,
  price_cents: 75000, // $750.00
  currency: 'AUD',
  product_type: STRETCH_BED.productType,
  ...overrides,
});

// Wrap the provider so renderHook can use it as a wrapper.
// Using createElement (no JSX) so the file is valid `.ts` and matches the
// locked vitest include glob of `*.test.ts`.
function wrapper({ children }: { children: ReactNode }) {
  return createElement(CartProvider, null, children);
}

const setup = () => renderHook(() => useCart(), { wrapper });

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CartProvider — initial state', () => {
  it('starts with empty items and a closed cart UI', () => {
    const { result } = setup();
    expect(result.current.state.items).toEqual([]);
    expect(result.current.state.isOpen).toBe(false);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });
});

describe('addItem', () => {
  it('appends a purchasable item (stretch_bed) to the cart', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem());
    });
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].quantity).toBe(1);
    expect(result.current.itemCount).toBe(1);
    expect(result.current.subtotal).toBe(75000);
  });

  it('uses the provided quantity when adding a new item', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem(), 3);
    });
    expect(result.current.state.items[0].quantity).toBe(3);
    expect(result.current.itemCount).toBe(3);
    expect(result.current.subtotal).toBe(75000 * 3);
  });

  it('rejects washing_machine and leaves the cart unchanged', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(
        baseItem({
          id: 'wm-1',
          product_type: WASHING_MACHINE.productType,
          name: WASHING_MACHINE.name,
        })
      );
    });
    expect(result.current.state.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
  });

  it('rejects basket_bed and leaves the cart unchanged', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(
        baseItem({
          id: 'bb-1',
          product_type: BASKET_BED.productType,
          name: BASKET_BED.name,
        })
      );
    });
    expect(result.current.state.items).toEqual([]);
  });

  it('rejects weave_bed (discontinued) and leaves the cart unchanged', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem({ product_type: 'weave_bed' }));
    });
    expect(result.current.state.items).toEqual([]);
  });

  it('merges quantity when the same id + sponsorship + community is added again', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem(), 2);
    });
    act(() => {
      result.current.addItem(baseItem(), 3); // same id, default is_sponsorship=undefined
    });
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].quantity).toBe(5);
    expect(result.current.itemCount).toBe(5);
  });

  it('does NOT merge when sponsored_community differs (sponsorship per community)', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(
        baseItem({ is_sponsorship: true, sponsored_community: 'Utopia' }),
        1
      );
    });
    act(() => {
      result.current.addItem(
        baseItem({ is_sponsorship: true, sponsored_community: 'Ali Curung' }),
        1
      );
    });
    expect(result.current.state.items).toHaveLength(2);
  });

  it('does NOT merge when is_sponsorship flips', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem(), 1); // regular purchase
    });
    act(() => {
      result.current.addItem(
        baseItem({ is_sponsorship: true, sponsored_community: 'Utopia' }),
        1
      );
    });
    expect(result.current.state.items).toHaveLength(2);
  });

  it('appends a separate line when id differs', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem({ id: 'a' }), 1);
    });
    act(() => {
      result.current.addItem(baseItem({ id: 'b' }), 1);
    });
    expect(result.current.state.items).toHaveLength(2);
  });
});

describe('updateQuantity', () => {
  it('sets the new quantity for the matching id', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem(), 1);
    });
    act(() => {
      result.current.updateQuantity(result.current.state.items[0].id, 4);
    });
    expect(result.current.state.items[0].quantity).toBe(4);
    expect(result.current.subtotal).toBe(75000 * 4);
  });

  it('removes the item when quantity is set to 0', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem(), 1);
    });
    act(() => {
      result.current.updateQuantity(result.current.state.items[0].id, 0);
    });
    expect(result.current.state.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('removes the item when quantity is negative', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem(), 1);
    });
    act(() => {
      result.current.updateQuantity(result.current.state.items[0].id, -1);
    });
    expect(result.current.state.items).toEqual([]);
  });

  it('only updates the matching id, leaves other items alone', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem({ id: 'a' }), 1);
    });
    act(() => {
      result.current.addItem(baseItem({ id: 'b' }), 2);
    });
    act(() => {
      result.current.updateQuantity('a', 5);
    });
    const a = result.current.state.items.find((i) => i.id === 'a')!;
    const b = result.current.state.items.find((i) => i.id === 'b')!;
    expect(a.quantity).toBe(5);
    expect(b.quantity).toBe(2);
  });
});

describe('removeItem', () => {
  it('removes the item with the given id', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem({ id: 'a' }), 1);
    });
    act(() => {
      result.current.addItem(baseItem({ id: 'b' }), 1);
    });
    act(() => {
      result.current.removeItem('a');
    });
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].id).toBe('b');
  });

  it('is a no-op when the id is not present', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem(), 1);
    });
    act(() => {
      result.current.removeItem('nonexistent');
    });
    expect(result.current.state.items).toHaveLength(1);
  });
});

describe('clearCart', () => {
  it('empties all items but keeps the cart UI closed-state intact', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem(), 1);
    });
    act(() => {
      result.current.addItem(baseItem({ id: 'b' }), 1);
    });
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.state.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });
});

describe('cart UI (open/close/toggle)', () => {
  it('toggleCart flips isOpen', () => {
    const { result } = setup();
    expect(result.current.state.isOpen).toBe(false);
    act(() => result.current.toggleCart());
    expect(result.current.state.isOpen).toBe(true);
    act(() => result.current.toggleCart());
    expect(result.current.state.isOpen).toBe(false);
  });

  it('openCart / closeCart are idempotent', () => {
    const { result } = setup();
    act(() => result.current.openCart());
    act(() => result.current.openCart());
    expect(result.current.state.isOpen).toBe(true);
    act(() => result.current.closeCart());
    act(() => result.current.closeCart());
    expect(result.current.state.isOpen).toBe(false);
  });
});

describe('derived totals', () => {
  it('subtotal = sum(price_cents * quantity) across items', () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem({ id: 'a', price_cents: 1000 }), 2);
    });
    act(() => {
      result.current.addItem(baseItem({ id: 'b', price_cents: 2500 }), 3);
    });
    expect(result.current.subtotal).toBe(1000 * 2 + 2500 * 3);
    expect(result.current.itemCount).toBe(5);
  });
});

describe('useCart', () => {
  it('throws when used outside a CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow(
      /useCart must be used within a CartProvider/
    );
  });
});

describe('localStorage persistence', () => {
  it('writes the cart to localStorage as JSON on every change', async () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem(), 2);
    });
    // The save effect runs in a useEffect — wait a microtask for it to fire.
    await act(async () => {
      await Promise.resolve();
    });
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].quantity).toBe(2);
    expect(stored[0].product_type).toBe(STRETCH_BED.productType);
  });

  it('clears localStorage when the cart is cleared', async () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(baseItem(), 1);
    });
    act(() => {
      result.current.clearCart();
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')).toEqual([]);
  });

  it('loads a valid persisted cart on mount', () => {
    const persisted = [
      {
        id: 'persisted-1',
        slug: STRETCH_BED.slug,
        name: STRETCH_BED.name,
        price_cents: 50000,
        currency: 'AUD',
        quantity: 2,
        product_type: STRETCH_BED.productType,
      },
    ];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persisted));
    const { result } = setup();
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].id).toBe('persisted-1');
    expect(result.current.state.items[0].quantity).toBe(2);
    expect(result.current.subtotal).toBe(50000 * 2);
  });

  it('filters out non-purchasable product types on load', () => {
    const persisted = [
      {
        id: 'good-1',
        slug: STRETCH_BED.slug,
        name: STRETCH_BED.name,
        price_cents: 75000,
        currency: 'AUD',
        quantity: 1,
        product_type: STRETCH_BED.productType,
      },
      {
        id: 'bad-1',
        slug: WASHING_MACHINE.slug,
        name: WASHING_MACHINE.name,
        price_cents: 999,
        currency: 'AUD',
        quantity: 1,
        product_type: WASHING_MACHINE.productType,
      },
      {
        id: 'bad-2',
        slug: BASKET_BED.slug,
        name: BASKET_BED.name,
        price_cents: 999,
        currency: 'AUD',
        quantity: 1,
        product_type: BASKET_BED.productType,
      },
    ];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persisted));
    const { result } = setup();
    // Only the stretch_bed item survives the filter.
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].id).toBe('good-1');
  });

  it('swallows malformed JSON in localStorage and starts empty', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'this is not json{{{');
    const { result } = setup();
    expect(result.current.state.items).toEqual([]);
    // The provider calls console.error on the catch — verify it didn't crash.
    expect(result.current.subtotal).toBe(0);
  });

  it('treats an absent stored value as an empty cart', () => {
    // No key set at all — same as an empty array.
    const { result } = setup();
    expect(result.current.state.items).toEqual([]);
  });
});
