'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { isPurchasableProductType } from '@/lib/data/products';

interface BuyNowFormProps {
  productId: string;
  productSlug: string;
  productName: string;
  productType: string;
  pricePerUnit: number;
  currency?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  image?: string;
}

export function BuyNowForm({
  productId,
  productSlug,
  productName,
  productType,
  pricePerUnit,
  currency = 'AUD',
  className,
  size = 'default',
  image,
}: BuyNowFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = quantity * pricePerUnit;
  const canCheckout = isPurchasableProductType(productType);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);

  const handleBuyNow = async () => {
    if (!canCheckout) {
      setError('Only the Stretch Bed is available for checkout.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const cartItem = {
        id: productId,
        slug: productSlug,
        name: productName,
        product_type: productType,
        price_cents: Math.round(pricePerUnit * 100),
        currency,
        quantity,
        ...(image ? { image } : {}),
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [cartItem] }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Could not start checkout');
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-3 rounded-lg border border-input bg-background px-3 py-2.5">
        <span className="text-sm font-medium text-foreground">Quantity</span>
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1 || isSubmitting}
          aria-label="Decrease quantity"
          className="h-8 w-8 rounded-md border border-input text-lg leading-none transition-colors hover:border-accent disabled:opacity-40"
        >
          −
        </button>
        <span className="w-8 text-center text-base font-semibold text-foreground" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity(quantity + 1)}
          disabled={isSubmitting}
          aria-label="Increase quantity"
          className="h-8 w-8 rounded-md border border-input text-lg leading-none transition-colors hover:border-accent disabled:opacity-40"
        >
          +
        </button>
        <span className="ml-auto text-base font-semibold text-foreground">
          {formatPrice(total)}
        </span>
      </div>

      <Button
        onClick={handleBuyNow}
        disabled={isSubmitting || !canCheckout}
        size={size}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Starting checkout…
          </>
        ) : (
          <>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {canCheckout ? `Buy Now · ${formatPrice(total)}` : 'Not available for checkout'}
          </>
        )}
      </Button>

      {error && (
        <p className="mt-2 text-sm text-red-700">{error}</p>
      )}

      <p className="mt-2 text-center text-xs text-muted-foreground">
        {canCheckout
          ? 'Secure checkout via Stripe. We deliver Australia-wide.'
          : 'Only the Stretch Bed is available for direct checkout.'}
      </p>
    </div>
  );
}
