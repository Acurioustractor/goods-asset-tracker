/**
 * /news — the newsletter, on the web. Issues are assemblies of already-cleared, already-
 * public artifacts (see news.ts). The email version is this page, sent; there is exactly
 * one source for both, so the newsletter can never say something the site does not.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NEWS_ISSUES } from '@/lib/data/news';
import { MoneyPointer } from '@/components/money-pointer';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { DOORS } from '@/lib/data/road-ending';

export const metadata: Metadata = {
  title: 'News — Goods on Country',
  description:
    'The monthly letter: what happened in community, who is stepping up, and where the road to ownership is.',
};

export default function NewsPage() {
  const issue = NEWS_ISSUES.find((i) => i.published);
  if (!issue) return null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
          The letter · {issue.month}
        </p>
        <h1 className="goods-pitch-display mt-3 text-4xl leading-tight md:text-5xl">{issue.title}</h1>
        <p className="mt-4 text-lg leading-8 text-[#6d675c]">{issue.standfirst}</p>
      </header>

      <section className="mt-12">
        <h2 className="border-b-2 border-[#2b2a26] pb-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          From community
        </h2>
        <ul className="mt-6 space-y-8">
          {issue.fromCommunity.map((item) => (
            <li key={item.href + item.title}>
              <Link href={item.href} className="group grid gap-4 sm:grid-cols-[1fr_180px]">
                <div>
                  <h3 className="goods-pitch-display text-2xl leading-tight group-hover:text-[#c45c3e]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-[#6d675c]">{item.line}</p>
                </div>
                {item.photo && (
                  <div className="relative aspect-[4/3] overflow-hidden max-sm:order-first">
                    <Image src={item.photo.src} alt={item.photo.alt} fill sizes="(max-width: 640px) 100vw, 180px" className="object-cover" />
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="border-b-2 border-[#2b2a26] pb-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          People stepping up
        </h2>
        <ul className="mt-6 space-y-6">
          {issue.people.map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="group">
                <h3 className="goods-pitch-display text-xl group-hover:text-[#c45c3e]">{item.title}</h3>
                <p className="mt-1 text-base leading-7 text-[#6d675c]">{item.line}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="border-b-2 border-[#2b2a26] pb-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          The road to ownership
        </h2>
        <ul className="mt-6 space-y-3">
          {issue.road.map((line) => (
            <li key={line} className="border-l-2 border-[#d9d1c3] pl-4 text-base leading-7 text-[#2b2a26]">
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <MoneyPointer />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="border-b-2 border-[#2b2a26] pb-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          Three ways in
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {DOORS.map((door) => (
            <div key={door.verb} className="border-t-2 border-[#c45c3e] pt-2">
              <p className="goods-pitch-display text-xl">{door.verb}</p>
              <p className="mt-1 text-sm leading-5 text-[#6d675c]">{door.entity}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-14 border-t border-[#d9d1c3] pt-8">
        <p className="text-sm leading-6 text-[#6d675c]">Get the letter by email, once a month:</p>
        <div className="mt-4">
          <NewsletterSignup />
        </div>
      </footer>
    </article>
  );
}
