'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

export function FeedbackWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const message = (formData.get('message') as string).trim();
    const email = (formData.get('email') as string)?.trim() || undefined;

    if (!message) {
      setError('Please describe what needs changing.');
      setIsSubmitting(false);
      return;
    }

    if (message.length > 2000) {
      setError('Message must be 2000 characters or less.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pathname, message, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      // Reset state when closing
      setTimeout(() => {
        setIsSubmitted(false);
        setError(null);
      }, 300);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        Feedback
      </button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="left" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Site Feedback
            </SheetTitle>
            <SheetDescription>
              Spotted something wrong or have a suggestion? Let us know and we&apos;ll review it.
            </SheetDescription>
          </SheetHeader>

          {isSubmitted ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: '#8B9D77' }}
              >
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium" style={{ color: '#2E2E2E' }}>
                Thanks for your feedback!
              </h3>
              <p className="text-center text-sm" style={{ color: '#5E5E5E' }}>
                We&apos;ll review your feedback and make updates if needed.
              </p>
              <Button
                onClick={() => handleOpenChange(false)}
                className="mt-2 text-white"
                style={{ backgroundColor: '#8B9D77' }}
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 p-4">
              {/* Page (read-only) */}
              <div>
                <Label className="mb-2 block text-sm" style={{ color: '#5E5E5E' }}>
                  Page
                </Label>
                <div
                  className="rounded-md border px-3 py-2 text-sm"
                  style={{ backgroundColor: '#FDF8F3', borderColor: '#E8DED4', color: '#5E5E5E' }}
                >
                  {pathname}
                </div>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="feedback-message" className="mb-2 block text-sm" style={{ color: '#5E5E5E' }}>
                  What needs changing? *
                </Label>
                <Textarea
                  id="feedback-message"
                  name="message"
                  required
                  rows={5}
                  maxLength={2000}
                  placeholder="e.g. The weight says 12kg but it should be 20kg..."
                  className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                />
              </div>

              {/* Email (optional) */}
              <div>
                <Label htmlFor="feedback-email" className="mb-2 block text-sm" style={{ color: '#5E5E5E' }}>
                  Your email (optional, for follow-up)
                </Label>
                <Input
                  id="feedback-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="mt-auto w-full text-white"
                style={{ backgroundColor: '#C45C3E' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
