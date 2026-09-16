'use client';

/**
 * Everything Snow and Goods have done together, filterable by what kind of thing it was.
 *
 * The filter carries an argument. A funder relationship reads as a row
 * of cheques unless you can see that the money is the smallest part of it: the trips, the
 * rooms, the introductions and the times Snow told this story in their own voice all sit on
 * the same line. Turning "Money" off on its own is the fastest way to see that.
 *
 * Keyboard reachable, honest about an empty state, and reduced motion removes the transitions
 * and nothing else.
 */

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { TOGETHER_KINDS, type TogetherKind, type TogetherMoment } from '@/lib/data/snow-partnership';

const ALL = Object.keys(TOGETHER_KINDS) as TogetherKind[];

export function TogetherTimeline({ moments }: { moments: readonly TogetherMoment[] }) {
  const [on, setOn] = useState<TogetherKind[]>(ALL);
  const [open, setOpen] = useState<string | null>(null);

  const shown = useMemo(
    () => moments.filter((m) => on.includes(m.kind)).slice().sort((a, b) => a.when.localeCompare(b.when)),
    [moments, on],
  );

  const counts = useMemo(() => {
    const out = {} as Record<TogetherKind, number>;
    for (const k of ALL) out[k] = moments.filter((m) => m.kind === k).length;
    return out;
  }, [moments]);

  function toggle(k: TogetherKind) {
    setOn((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter what kind of thing">
        {ALL.map((k) => {
          const active = on.includes(k);
          const meta = TOGETHER_KINDS[k];
          return (
            <button
              key={k}
              type="button"
              onClick={() => toggle(k)}
              aria-pressed={active}
              className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors motion-reduce:transition-none"
              style={{
                borderColor: active ? meta.colour : '#D8CFC4',
                backgroundColor: active ? meta.colour : 'transparent',
                color: active ? '#FFFFFF' : '#6A5E54',
              }}
            >
              {meta.label}
              <span className="ml-1.5 opacity-70">{counts[k]}</span>
            </button>
          );
        })}
        {on.length !== ALL.length && (
          <button
            type="button"
            onClick={() => setOn(ALL)}
            className="rounded-full px-3 py-1.5 text-xs font-semibold underline"
            style={{ color: '#6A5E54' }}
          >
            Show everything
          </button>
        )}
      </div>

      <p className="mt-3 text-xs" style={{ color: '#6A5E54' }}>
        {on.length === ALL.length
          ? `${shown.length} moments, August 2024 to today. Every one has a date and a source.`
          : `${shown.length} of ${moments.length} shown.`}
      </p>

      {shown.length === 0 ? (
        <p className="mt-10 text-sm" style={{ color: '#6A5E54' }}>Nothing selected. Turn a filter back on above.</p>
      ) : (
        <ol className="mt-8 border-l" style={{ borderColor: '#E8DED4' }}>
          {shown.map((m) => {
            const meta = TOGETHER_KINDS[m.kind];
            const key = m.when + m.title;
            const isOpen = open === key;
            return (
              <li key={key} className="relative pb-8 pl-6 sm:pl-8">
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                  style={{ backgroundColor: meta.colour }}
                />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: meta.colour }}>{m.label}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#A99C8F' }}>{meta.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : key)}
                  aria-expanded={isOpen}
                  className="mt-1 block text-left font-display text-lg leading-snug hover:underline sm:text-xl"
                  style={{ color: '#2E2E2E' }}
                >
                  {m.title}
                </button>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#2E2E2Ecc' }}>{m.detail}</p>
                {m.image && (
                  <Image
                    src={m.image.src}
                    alt={m.image.alt}
                    width={1200}
                    height={800}
                    className="mt-4 h-48 w-full max-w-2xl rounded-lg object-cover sm:h-64"
                  />
                )}
                {isOpen && (
                  <dl className="mt-3 max-w-2xl space-y-1 rounded-lg p-4 text-xs" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                    {m.who && (
                      <div className="flex gap-2">
                        <dt className="shrink-0 font-semibold" style={{ color: '#6A5E54' }}>Who</dt>
                        <dd style={{ color: '#2E2E2Ecc' }}>{m.who}</dd>
                      </div>
                    )}
                    {m.place && (
                      <div className="flex gap-2">
                        <dt className="shrink-0 font-semibold" style={{ color: '#6A5E54' }}>Where</dt>
                        <dd style={{ color: '#2E2E2Ecc' }}>{m.place}</dd>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold" style={{ color: '#6A5E54' }}>Source</dt>
                      <dd style={{ color: '#2E2E2Ecc' }}>{m.source}</dd>
                    </div>
                  </dl>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
