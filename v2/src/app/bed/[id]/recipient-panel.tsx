'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StoryModal } from './story-modal';

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
};

const PENDING_STATUSES = new Set(['ready', 'in_production', 'created', 'quality_check']);

export function RecipientPanel({
  uniqueId,
  productLabel,
  productNoun,
  community,
  communityId,
  place,
  status,
  isAuthed,
  isClaimed,
}: Props) {
  const [storyOpen, setStoryOpen] = useState(false);

  const isPending = PENDING_STATUSES.has((status || '').toLowerCase());
  const lowerNoun = productNoun.toLowerCase();
  const where = place ? `${place} (${community || 'a community'})` : community || null;

  return (
    <div className="max-w-3xl mx-auto px-4 mt-6">
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-amber-950/30 dark:to-stone-950/30 px-5 py-4 border-b">
          <p className="font-display text-lg font-bold text-foreground">
            {isPending
              ? `Your ${lowerNoun} is on its way`
              : where
                ? `Your ${lowerNoun} lives at ${where}`
                : `Your ${lowerNoun}`}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isPending
              ? `${uniqueId} is ready and waiting for delivery. Come back here once it's with you.`
              : `Stay connected. Ask questions any time, share your story, or let us know how it's going.`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
          {/* Door 1: Claim / Connect (optional — everything else works without an account) */}
          {!isClaimed && (
            <Link
              href={`/claim/${uniqueId}`}
              className="bg-card hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors p-5 group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0" aria-hidden>🔗</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-amber-900 dark:group-hover:text-amber-200">
                    {isAuthed
                      ? `Add this ${lowerNoun} to your account`
                      : `Stay in touch about this ${lowerNoun}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isAuthed
                      ? `Link ${uniqueId} to get messages, photos, and request blankets or pillows.`
                      : 'Optional. Phone number only. Unlocks messages, photos, and easy support requests.'}
                  </p>
                </div>
              </div>
            </Link>
          )}
          {isClaimed && (
            <Link
              href="/my-items"
              className="bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors p-5 group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0" aria-hidden>✅</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-emerald-900 dark:group-hover:text-emerald-200">
                    Connected to your account
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Open My Items to see messages and requests.
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Door 2: Help with this bed */}
          <Link
            href={`/portal/ask-goods?asset_id=${uniqueId}`}
            className="bg-card hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors p-5 group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0" aria-hidden>💡</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground group-hover:text-amber-900 dark:group-hover:text-amber-200">
                  Help with this {lowerNoun}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Setup, washing, where to get a blanket, how to claim it. Type or talk.
                </p>
              </div>
            </div>
          </Link>

          {/* Door 3: Share a photo or story */}
          <button
            type="button"
            onClick={() => setStoryOpen(true)}
            className="bg-card hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors p-5 group text-left"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0" aria-hidden>📸</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground group-hover:text-amber-900 dark:group-hover:text-amber-200">
                  Share a photo or story
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add a photo of the {lowerNoun} in use. With your consent we can share it on the Empathy Ledger.
                </p>
              </div>
            </div>
          </button>

          {/* Door 4: Need help */}
          <Link
            href={`/support?asset_id=${uniqueId}`}
            className="bg-card hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors p-5 group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0" aria-hidden>🛠️</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground group-hover:text-amber-900 dark:group-hover:text-amber-200">
                  Something's not right
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Damaged, missing, needs a repair, or you need a blanket or pillow.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="px-5 py-3 bg-muted/40 border-t flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {productLabel} <span className="font-mono">{uniqueId}</span> · scan any time, no account needed
          </span>
          {isAuthed ? (
            <Link href="/my-items" className="underline hover:text-foreground">
              My Items
            </Link>
          ) : (
            <Link href="/auth/phone-login" className="underline hover:text-foreground">
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

      {/* Floating "Help" button — available on every scroll position */}
      <Link
        href={`/portal/ask-goods?asset_id=${uniqueId}`}
        className="fixed bottom-5 right-5 z-30 rounded-full bg-amber-700 hover:bg-amber-800 text-white px-4 py-3 shadow-lg flex items-center gap-2 text-sm font-semibold"
        aria-label={`Get help with this ${lowerNoun}`}
      >
        <span aria-hidden>💡</span>
        <span>Get help</span>
      </Link>
    </div>
  );
}
