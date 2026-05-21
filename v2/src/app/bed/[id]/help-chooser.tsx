'use client';

import { useEffect } from 'react';
import Link from 'next/link';

type Props = {
  open: boolean;
  onClose: () => void;
  uniqueId: string;
  productNoun: string;
};

// Goods support number — routes to GoHighLevel for SMS + WhatsApp inbound.
const SUPPORT_PHONE_RAW = (process.env.NEXT_PUBLIC_GOODS_SUPPORT_PHONE || '+61468052660').replace(/\s+/g, '');
const SUPPORT_PHONE_INTL = SUPPORT_PHONE_RAW.replace(/^\+/, '');

function whatsappHref(uniqueId: string): string {
  return `https://wa.me/${SUPPORT_PHONE_INTL}?text=${encodeURIComponent(`Hi Goods, scanning ${uniqueId} — `)}`;
}
function smsHref(uniqueId: string): string {
  return `sms:${SUPPORT_PHONE_RAW}?&body=${encodeURIComponent(`Hi Goods, scanning ${uniqueId} — `)}`;
}

/**
 * Bottom-sheet chooser. Tapped from "Get help" — recipient picks how to message
 * Goods. WhatsApp is the primary path because it's free, async-friendly, and
 * routes to GHL where the team can reply on their own schedule. SMS is the
 * fallback for anyone without WhatsApp. AI chat is for instant answers. No
 * phone-call option: we can't commit to live pickup — all responses come back
 * via text or WhatsApp.
 */
export function HelpChooser({ open, onClose, uniqueId, productNoun }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  const lowerNoun = productNoun.toLowerCase();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Choose how to get help with this ${lowerNoun}`}
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-card w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-5 pb-7 sm:pb-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-bold">Message us</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              We&apos;ll reply by text or WhatsApp — usually same day, sometimes the next.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-3 text-muted-foreground hover:text-foreground text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          <a
            href={whatsappHref(uniqueId)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="block rounded-xl border-2 border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 p-4 flex items-center gap-3 transition-colors"
          >
            <span className="text-2xl" aria-hidden>💚</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">
                WhatsApp Goods
                <span className="ml-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">· fastest reply</span>
              </p>
              <p className="text-xs text-muted-foreground">Free, works offline-and-on. {uniqueId} pre-filled.</p>
            </div>
          </a>

          <a
            href={smsHref(uniqueId)}
            onClick={onClose}
            className="block rounded-xl border bg-card hover:bg-amber-50 dark:hover:bg-amber-950/30 p-4 flex items-center gap-3 transition-colors"
          >
            <span className="text-2xl" aria-hidden>📱</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Text us (SMS)</p>
              <p className="text-xs text-muted-foreground">No WhatsApp? Standard text works on every phone.</p>
            </div>
          </a>

          <Link
            href={`/portal/ask-goods?asset_id=${uniqueId}`}
            onClick={onClose}
            className="block rounded-xl border bg-card hover:bg-amber-50 dark:hover:bg-amber-950/30 p-4 flex items-center gap-3 transition-colors"
          >
            <span className="text-2xl" aria-hidden>💡</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Type or talk to AI</p>
              <p className="text-xs text-muted-foreground">Instant answer for setup, washing, parts. Hands you off to a human if needed.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
