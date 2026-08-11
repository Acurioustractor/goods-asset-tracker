/**
 * The one-pager shelf (/onepagers) — every printable single page, in one place.
 *
 * Exists so a person heading to a meeting can find the right sheet and print it. The
 * investor one-pager lives at /pitch/onepager (the money surface family) and is linked,
 * not duplicated, from here.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'One-pagers',
  description: 'The printable single pages: how Goods works, the Stretch Bed, and the production facility.',
  robots: { index: false, follow: false },
};

const SHEETS = [
  {
    href: '/onepagers/goods',
    title: 'How Goods works',
    line: 'The whole model on one page: plastic in, beds out, ownership moving. The one to hand to anyone.',
  },
  {
    href: '/onepagers/stretch-bed',
    title: 'The Stretch Bed',
    line: 'The product sheet: specs, materials, and how the X-trestle tension design goes together.',
  },
  {
    href: '/onepagers/facility',
    title: 'The production facility',
    line: 'The containerised plant and the three ways a community can work with it.',
  },
  {
    href: '/pitch/onepager',
    title: 'The investor one-pager',
    line: 'The numbers, the facility costs, the three ways in. Lives with the deck on the money surface.',
  },
];

export default function OnePagersIndexPage() {
  return (
    <article className="mx-auto max-w-[820px] px-8 py-14 text-[#2b2a26]">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a7363]">Print and go</p>
      <h1 className="goods-pitch-display mt-2 text-3xl">One-pagers</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#6d675c]">
        Each of these lands on a single A4 page from your browser&apos;s print dialog (Cmd+P).
        Pick the one for the meeting you are walking into.
      </p>
      <ul className="mt-8 space-y-4">
        {SHEETS.map((sheet) => (
          <li key={sheet.href} className="border-t-2 border-[#c45c3e] pt-3">
            <Link href={sheet.href} className="goods-pitch-display text-xl underline-offset-4 hover:underline">
              {sheet.title}
            </Link>
            <p className="mt-1 max-w-xl text-[13px] leading-5 text-[#6d675c]">{sheet.line}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
