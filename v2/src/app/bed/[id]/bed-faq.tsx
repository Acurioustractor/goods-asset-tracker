'use client';

import { useState } from 'react';
import Link from 'next/link';

type Props = {
  uniqueId: string;
  productNoun: string;
  isMachine: boolean;
};

type Entry = {
  q: string;
  a: React.ReactNode;
};

function bedEntries(uniqueId: string): Entry[] {
  return [
    {
      q: 'How do I set this up?',
      a: (
        <>
          Two steel poles slide through the canvas sleeves and the holes at the top of the two
          plastic X-legs. Tension holds it together. No tools, about 5 minutes. If a pole
          won&apos;t go through, push from the end of the pole, not the side.
        </>
      ),
    },
    {
      q: 'How do I wash the canvas?',
      a: (
        <>
          Slide the poles out so you can wash the canvas on its own. Cold or warm water, mild soap,
          line dry. The canvas is designed for repeated washing. Don&apos;t put the poles or legs in
          the machine.
        </>
      ),
    },
    {
      q: 'Can I get a blanket or pillow?',
      a: (
        <>
          Sometimes yes. Tap{' '}
          <Link href={`/support?asset_id=${uniqueId}&category=replacement`} className="underline">
            Need help
          </Link>{' '}
          and tell us what you need. We don&apos;t always have stock but we&apos;ll let you know
          what we can do.
        </>
      ),
    },
    {
      q: 'How do I claim this bed to my phone?',
      a: (
        <>
          Tap <Link href={`/claim/${uniqueId}`} className="underline">Stay in touch</Link>. Phone
          number only. Once it&apos;s connected we can send you photos, replies, and you can ask
          for things like a blanket without retyping who you are.
        </>
      ),
    },
    {
      q: 'Where was this bed made?',
      a: (
        <>
          The plastic and the canvas are pressed and sewn at the Alice Springs production plant. The
          steel poles are cut at a local supplier. We&apos;re working towards every part of this
          being made on Country.
        </>
      ),
    },
    {
      q: 'Something is wrong with it — what do I do?',
      a: (
        <>
          Tap{' '}
          <Link href={`/support?asset_id=${uniqueId}`} className="underline">
            Need help
          </Link>
          . Tell us what&apos;s up. If it&apos;s a safety issue (sharp edge, broken weld), tick the
          safety box and we&apos;ll prioritise it.
        </>
      ),
    },
  ];
}

function machineEntries(uniqueId: string): Entry[] {
  return [
    {
      q: 'How do I run a wash?',
      a: (
        <>
          One-button operation. Cold or warm, the machine handles the rest. There&apos;s a
          quick-reference card under the lid.
        </>
      ),
    },
    {
      q: 'How much water does it use per load?',
      a: <>It&apos;s a low-water design, tuned for remote conditions. The exact litres per cycle are on the spec card.</>,
    },
    {
      q: 'It&apos;s acting up — who do I tell?',
      a: (
        <>
          Tap{' '}
          <Link href={`/support?asset_id=${uniqueId}`} className="underline">
            Need help
          </Link>{' '}
          and we&apos;ll get someone to check on it. If it&apos;s leaking or sparking, tick the
          safety box.
        </>
      ),
    },
    {
      q: 'Where was this machine made?',
      a: (
        <>
          Commercial-grade Speed Queen base, wrapped in a recycled-plastic housing pressed at the
          Alice Springs plant. The name &ldquo;Pakkimjalki Kari&rdquo; is Warumungu, given by Elder
          Dianne Stokes.
        </>
      ),
    },
  ];
}

export function BedFaq({ uniqueId, productNoun, isMachine }: Props) {
  const entries = isMachine ? machineEntries(uniqueId) : bedEntries(uniqueId);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b">
        <p className="font-display text-lg font-bold">Quick answers</p>
        <p className="text-xs text-muted-foreground">
          The most common questions. Still stuck? Tap &ldquo;Get help&rdquo; for a live chat or
          message us directly.
        </p>
      </div>
      <ul className="divide-y">
        {entries.map((entry, idx) => {
          const isOpen = openIdx === idx;
          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-sm">{entry.q}</span>
                <span className={`text-stone-400 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden>
                  ▾
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 -mt-1 text-sm text-muted-foreground leading-relaxed">
                  {entry.a}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
