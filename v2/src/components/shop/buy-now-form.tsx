'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BuyNowFormProps {
  productName: string;
  pricePerUnit: number;
  currency?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function BuyNowForm({
  productName,
  pricePerUnit,
  currency = 'AUD',
  className,
  size = 'default',
}: BuyNowFormProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = quantity * pricePerUnit;

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      subject: 'Bed Order',
      message: `Order request: ${quantity}x ${productName} (${formatPrice(total)})

Delivery address / community: ${formData.get('address') || 'Not provided'}

Additional notes: ${formData.get('notes') || 'None'}`,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send order');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset on close
      setTimeout(() => {
        setIsSubmitted(false);
        setError(null);
        setQuantity(1);
      }, 300);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button className={className} size={size}>
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Buy Now &mdash; {formatPrice(pricePerUnit)}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] max-h-[90vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#8B9D77' }}
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <Dialog.Title className="text-2xl font-light mb-2" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                Order Received
              </Dialog.Title>
              <Dialog.Description className="text-sm mb-6" style={{ color: '#5E5E5E' }}>
                We&apos;ve received your order for {quantity}x {productName}.
                We&apos;ll be in touch within 1-2 business days to confirm details and arrange payment.
              </Dialog.Description>
              <Dialog.Close asChild>
                <Button style={{ backgroundColor: '#C45C3E' }}>Done</Button>
              </Dialog.Close>
            </div>
          ) : (
            <>
              <Dialog.Title className="text-2xl font-light mb-1" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                Order {productName}
              </Dialog.Title>
              <Dialog.Description className="text-sm mb-6" style={{ color: '#5E5E5E' }}>
                Fill in your details and we&apos;ll get back to you to arrange payment and delivery.
              </Dialog.Description>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Quantity */}
                <div>
                  <Label htmlFor="quantity" className="mb-2 block text-sm font-medium" style={{ color: '#2E2E2E' }}>
                    How many beds?
                  </Label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-[#E8DED4] flex items-center justify-center text-lg font-medium hover:border-[#C45C3E] transition-colors"
                    >
                      &minus;
                    </button>
                    <span className="text-2xl font-bold w-12 text-center" style={{ color: '#2E2E2E' }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border-2 border-[#E8DED4] flex items-center justify-center text-lg font-medium hover:border-[#C45C3E] transition-colors"
                    >
                      +
                    </button>
                    <span className="ml-auto text-lg font-bold" style={{ color: '#C45C3E' }}>
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="mb-1 block text-sm" style={{ color: '#5E5E5E' }}>
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Your name"
                      className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="mb-1 block text-sm" style={{ color: '#5E5E5E' }}>
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="mb-1 block text-sm" style={{ color: '#5E5E5E' }}>
                    Phone (optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+61 4XX XXX XXX"
                    className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                  />
                </div>

                {/* Address / Community */}
                <div>
                  <Label htmlFor="address" className="mb-1 block text-sm" style={{ color: '#5E5E5E' }}>
                    Delivery address or community
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Where should we deliver?"
                    className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="mb-1 block text-sm" style={{ color: '#5E5E5E' }}>
                    Anything else? (optional)
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder="Colour preference, organisation name, questions..."
                    className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-white"
                  style={{ backgroundColor: '#C45C3E' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>Send Order &mdash; {formatPrice(total)}</>
                  )}
                </Button>

                <p className="text-xs text-center" style={{ color: '#999' }}>
                  We&apos;ll confirm your order and send payment details by email.
                  No payment is taken now.
                </p>
              </form>
            </>
          )}

          {/* Close button */}
          <Dialog.Close className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
