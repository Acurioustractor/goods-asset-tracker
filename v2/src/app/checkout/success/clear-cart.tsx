'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cart';

export function ClearCartOnSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart after successful checkout
    clearCart();
  }, [clearCart]);

  return null;
}
