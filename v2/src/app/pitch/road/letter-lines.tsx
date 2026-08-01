'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { LETTER_LINES, LETTER_PLAIN_TEXT } from '@/lib/data/road-ending';

/**
 * The whole ask is a one-page letter with four things on it. The section this
 * replaced named the four things and gave the reader no way to produce one, so
 * a convinced program officer at 6pm had to reverse-engineer a letter from a web
 * page. This hands them the four lines to paste into their own draft.
 */
export function LetterLines() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(LETTER_PLAIN_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="border border-white/20 bg-[#22211e]">
      <ol className="divide-y divide-white/15">
        {LETTER_LINES.map((line) => (
          <li key={line.n} className="flex items-baseline gap-5 px-6 py-5 lg:px-8">
            <span className="goods-pitch-display text-2xl text-[#e88461]">{line.n}</span>
            <span>
              <span className="block text-base font-semibold">{line.label}</span>
              <span className="mt-1 block text-sm leading-5 text-white/60">{line.detail}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 px-6 py-4 lg:px-8">
        <p className="text-xs leading-5 text-white/55">
          It can stay subject to your board or your credit process.
        </p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:border-white"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {copied ? 'Copied' : 'Copy the four lines'}
        </button>
      </div>
    </div>
  );
}
