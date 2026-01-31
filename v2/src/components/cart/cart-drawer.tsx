'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

function formatPrice(cents: number, currency: string = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  return (
    <Sheet open={state.isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Shopping Cart
            {itemCount > 0 && (
              <Badge variant="secondary">{itemCount} items</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <svg
              className="h-16 w-16 text-muted-foreground/40 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-lg font-medium text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add some items to get started
            </p>
            <Button className="mt-6" onClick={closeCart} asChild>
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-4">
                {state.items.map((item) => (
                  <li key={`${item.id}-${item.is_sponsorship}-${item.sponsored_community}`} className="flex gap-4">
                    {/* Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <svg
                            className="h-8 w-8 text-muted-foreground/40"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="font-medium text-foreground hover:text-primary line-clamp-1"
                        onClick={closeCart}
                      >
                        {item.name}
                      </Link>

                      {item.is_sponsorship && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Sponsorship{item.sponsored_community && `: ${item.sponsored_community}`}
                        </Badge>
                      )}

                      <p className="mt-1 text-sm font-medium text-foreground">
                        {formatPrice(item.price_cents, item.currency)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 rounded border border-input flex items-center justify-center hover:bg-muted"
                          aria-label="Decrease quantity"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 rounded border border-input flex items-center justify-center hover:bg-muted"
                          aria-label="Increase quantity"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Footer */}
            <SheetFooter className="flex-col gap-4 pt-4 sm:flex-col">
              {/* Subtotal */}
              <div className="flex items-center justify-between w-full">
                <span className="text-base font-medium text-muted-foreground">Subtotal</span>
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Shipping calculated at checkout
              </p>

              {/* Checkout Button */}
              <Button size="lg" className="w-full" asChild>
                <Link href="/checkout" onClick={closeCart}>
                  Proceed to Checkout
                </Link>
              </Button>

              <Button variant="outline" className="w-full" onClick={closeCart}>
                Continue Shopping
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
