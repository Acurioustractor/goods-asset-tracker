'use client';

import { useState } from 'react';
import { useCart, type CartItem } from '@/lib/cart';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price_cents: number;
    currency: string;
    featured_image?: string | null;
    product_type: string;
  };
  quantity?: number;
  isSponsorship?: boolean;
  sponsoredCommunity?: string;
  dedicationMessage?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  isSponsorship = false,
  sponsoredCommunity,
  dedicationMessage,
  className,
  size = 'default',
  showIcon = true,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);

    const cartItem: Omit<CartItem, 'quantity'> = {
      id: isSponsorship ? `${product.id}-sponsor-${sponsoredCommunity || 'any'}` : product.id,
      slug: product.slug,
      name: product.name,
      price_cents: product.price_cents,
      currency: product.currency,
      image: product.featured_image || undefined,
      product_type: product.product_type,
      is_sponsorship: isSponsorship,
      sponsored_community: sponsoredCommunity,
      dedication_message: dedicationMessage,
    };

    addItem(cartItem, quantity);

    // Brief visual feedback then open cart
    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 300);
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={className}
      size={size}
    >
      {isAdding ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Adding...
        </>
      ) : (
        <>
          {showIcon && (
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          )}
          {isSponsorship ? 'Sponsor This Bed' : 'Add to Cart'}
        </>
      )}
    </Button>
  );
}
