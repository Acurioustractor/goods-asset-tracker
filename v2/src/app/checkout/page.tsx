'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { state, subtotal, itemCount } = useCart();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canceled = searchParams.get('canceled') === 'true';

  const handleCheckout = async () => {
    if (state.items.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items,
          customerEmail: email || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <svg
            className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4"
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
          <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Add some items to your cart to proceed with checkout.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/shop">Browse Products</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="mt-2 text-muted-foreground">
            Review your order and proceed to payment
          </p>
        </div>

        {/* Canceled message */}
        {canceled && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
            <CardContent className="p-4">
              <p className="text-yellow-800 dark:text-yellow-200">
                Your payment was canceled. You can try again when you&apos;re ready.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary ({itemCount} items)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {state.items.map((item) => (
                    <li
                      key={`${item.id}-${item.is_sponsorship}-${item.sponsored_community}`}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
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
                        <p className="font-medium text-foreground">{item.name}</p>
                        {item.is_sponsorship && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Sponsorship{item.sponsored_community && `: ${item.sponsored_community}`}
                          </Badge>
                        )}
                        <p className="mt-1 text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {formatPrice(item.price_cents * item.quantity, item.currency)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price_cents, item.currency)} each
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <Link
                    href="/shop"
                    className="text-sm text-primary hover:underline"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Contact Information (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="email">Email for order updates</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can also enter your email during payment
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">Calculated at payment</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  You&apos;ll be redirected to Stripe for secure payment
                </p>

                {/* Trust badges */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-center gap-4 text-muted-foreground">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs">Secure checkout powered by Stripe</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Loading checkout...</div>
        </div>
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
