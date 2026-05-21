'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StoryModal } from './story-modal';
import { HelpChooser } from './help-chooser';

type Props = {
  uniqueId: string;
  productLabel: string;
  productNoun: string;
  community: string | null;
  communityId: string | null;
  place: string | null;
  status: string | null;
  isAuthed: boolean;
  isClaimed: boolean;
  recipientName: string | null;
  supplyDate: string | null;
};

const PENDING_STATUSES = new Set(['ready', 'in_production', 'created', 'quality_check']);
type Pulse = 'good' | 'bad';

/**
 * Single-card recipient surface — collapses the prior 3 cards (RecipientPanel
 * 4-door grid + PulseCheck + ContactRow) into one. Three primary actions only:
 *   1. How's it going? (good / not great)
 *   2. Get help (opens channel chooser sheet: WhatsApp / SMS / Call / AI)
 *   3. Share a photo
 * Account / claim flow demoted to a passive footer link.
 */
export function RecipientCard(props: Props) {
  const {
    uniqueId, productLabel, productNoun, community, communityId, place,
    status, isAuthed, isClaimed, recipientName, supplyDate,
  } = props;

  const [storyOpen, setStoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [pulsePending, setPulsePending] = useState<Pulse | null>(null);

  const isPending = PENDING_STATUSES.has((status || '').toLowerCase());
  const lowerNoun = productNoun.toLowerCase();
  const where = place ? `${place} (${community || 'a community'})` : community || null;
  const firstName = recipientName ? recipientName.trim().split(/\s+/)[0] : null;
  const daysSinceDelivery = supplyDate
    ? Math.floor((Date.now() - new Date(supplyDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isFreshlyDelivered = daysSinceDelivery !== null && daysSinceDelivery >= 0 && daysSinceDelivery <= 7;

  let headline: string;
  let subline: string;
  if (isPending) {
    headline = `Your ${lowerNoun} is on its way`;
    subline = `${uniqueId} is ready and waiting for delivery. Come back here once it's with you.`;
  } else {
    headline = firstName
      ? `Hi ${firstName} — this is your ${lowerNoun}`
      : where
        ? `Your ${lowerNoun} lives at ${where}`
        : `Your ${lowerNoun}`;

    if (isFreshlyDelivered) {
      subline = where
        ? `${where} — welcome. If anything's missing or not right, tell us today.`
        : `Welcome. If anything's missing or not right, tell us today — it's easiest to fix in the first week.`;
    } else if (isClaimed) {
      subline = where
        ? `${where} — connected to your account. Photos, questions, blanket requests, repairs — we're here.`
        : `Connected to your account. Stay close any time.`;
    } else if (where) {
      subline = `${where}. Tap below to add this ${lowerNoun} to your account.`;
    } else {
      subline = `Stay connected. Ask questions any time, share your story, or let us know how it's going.`;
    }
  }

  const submitPulse = async (value: Pulse) => {
    setPulsePending(value);
    try {
      const res = await fetch(`/api/bed/${encodeURIComponent(uniqueId)}/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal_type: 'pulse', signal_value: value }),
      });
      if (res.ok) setPulse(value);
    } finally {
      setPulsePending(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mt-6">
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        {/* Header — greeting + location */}
        <div className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-amber-950/30 dark:to-stone-950/30 px-5 py-4 border-b">
          <p className="font-display text-lg font-bold text-foreground">{headline}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{subline}</p>
        </div>

        {/* Pulse — hidden while bed is in transit (no meaningful signal yet) */}
        {!isPending && (
          <div className="px-5 py-4 border-b">
            {pulse ? (
              <p className="text-sm text-center text-emerald-700 dark:text-emerald-300 py-1">
                🙏 Thanks. {pulse === 'bad' ? "We'll be in touch." : "Good to hear."}
              </p>
            ) : (
              <>
                <p className="text-sm font-semibold mb-3">How&apos;s the {lowerNoun} going?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => submitPulse('good')}
                    disabled={!!pulsePending}
                    className="rounded-xl border bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors py-4 flex flex-col items-center gap-1 disabled:opacity-50"
                  >
                    <span className="text-3xl" aria-hidden>👍</span>
                    <span className="text-sm font-medium">Going well</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => submitPulse('bad')}
                    disabled={!!pulsePending}
                    className="rounded-xl border bg-card hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors py-4 flex flex-col items-center gap-1 disabled:opacity-50"
                  >
                    <span className="text-3xl" aria-hidden>😕</span>
                    <span className="text-sm font-medium">Not great</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Get help + Share photo */}
        <div className="px-5 py-4 border-b">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="rounded-xl border bg-card hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors py-4 flex flex-col items-center gap-1"
            >
              <span className="text-3xl" aria-hidden>💬</span>
              <span className="text-sm font-medium">Get help</span>
            </button>
            <button
              type="button"
              onClick={() => setStoryOpen(true)}
              className="rounded-xl border bg-card hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors py-4 flex flex-col items-center gap-1"
            >
              <span className="text-3xl" aria-hidden>📸</span>
              <span className="text-sm font-medium">Share photo</span>
            </button>
          </div>
        </div>

        {/* Footer — passive sign-in link, bed ID */}
        <div className="px-5 py-3 bg-muted/40 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {productLabel} <span className="font-mono">{uniqueId}</span> · scan any time, no account needed
          </span>
          {isAuthed ? (
            <Link href="/my-items" className="underline hover:text-foreground">
              My Items
            </Link>
          ) : isClaimed ? (
            <span className="text-emerald-700 dark:text-emerald-300">✓ Connected</span>
          ) : (
            <Link href={`/claim/${uniqueId}`} className="underline hover:text-foreground">
              Sign in for more
            </Link>
          )}
        </div>
      </div>

      <StoryModal
        open={storyOpen}
        onClose={() => setStoryOpen(false)}
        uniqueId={uniqueId}
        productLabel={productLabel}
        community={community}
        communityId={communityId}
        place={place}
      />

      <HelpChooser
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        uniqueId={uniqueId}
        productNoun={productNoun}
      />

      {/* Floating help button — useful when the recipient has scrolled past the card */}
      <button
        type="button"
        onClick={() => setHelpOpen(true)}
        className="fixed bottom-5 right-5 z-30 rounded-full bg-amber-700 hover:bg-amber-800 text-white px-4 py-3 shadow-lg flex items-center gap-2 text-sm font-semibold"
        aria-label={`Get help with this ${lowerNoun}`}
      >
        <span aria-hidden>💬</span>
        <span>Get help</span>
      </button>
    </div>
  );
}
