'use client';

/**
 * Snow's own published priorities, with what Goods can actually evidence against each one,
 * and how strong that evidence is.
 *
 * Built to be read by someone who wrote the left-hand column. Two rows are deliberately weak
 * and one says outright that we are not pitching a thing Snow excludes. A page that only
 * showed the strong rows would be a pitch; this is a reckoning, and it is the reason the
 * strong rows are worth believing.
 */

import { useState } from 'react';
import { type Alignment } from '@/lib/data/snow-partnership';

const STRENGTH: Record<Alignment['strength'], { label: string; fg: string; bg: string }> = {
  strong: { label: 'Evidenced', fg: '#4F6138', bg: '#E6EDDD' },
  partial: { label: 'Partly, and labelled', fg: '#8A6A2F', bg: '#F5EBD8' },
  'not-yet': { label: 'Not our claim to make', fg: '#6A5E54', bg: '#EEE9E3' },
};

export function AlignmentTable({ rows }: { rows: readonly Alignment[] }) {
  const [open, setOpen] = useState<string | null>(rows[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const isOpen = open === r.id;
        const s = STRENGTH[r.strength];
        return (
          <div key={r.id} className="rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : r.id)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-4 p-5 text-left"
            >
              <span className="font-display text-base leading-snug sm:text-lg" style={{ color: '#2E2E2E' }}>
                &ldquo;{r.snowSays}&rdquo;
              </span>
              <span
                className="mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                style={{ backgroundColor: s.bg, color: s.fg }}
              >
                {s.label}
              </span>
            </button>
            <p className="px-5 pb-3 text-[11px] uppercase tracking-wide" style={{ color: '#A99C8F' }}>
              Snow Foundation &middot; {r.snowSource}
            </p>
            {isOpen && (
              <div className="border-t px-5 py-4" style={{ borderColor: '#E8DED4' }}>
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#C45C3E' }}>
                  What Goods can show
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#2E2E2Ecc' }}>{r.goodsHas}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
