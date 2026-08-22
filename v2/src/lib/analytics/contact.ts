'use client';

import { track } from '@vercel/analytics';

// Deliberately aggregate-only: no names, email addresses, messages, phones,
// organisations, or any other personal information reaches Web Analytics.
export function trackContactEvent(
  event: 'contact_form_viewed' | 'contact_form_submitted' | 'contact_form_failed',
  surface: 'contact' | 'partnership' | 'washer_interest' | 'press',
  inquiryType?: string,
) {
  track(event, { surface, ...(inquiryType ? { inquiry_type: inquiryType } : {}) });
}
