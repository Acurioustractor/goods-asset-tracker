/**
 * /news — the newsletter, on the web.
 *
 * WRITING HOME (Ben, 2026-08-06): issues are WRITTEN IN EMPATHY LEDGER as stories with
 * story_type 'newsletter'. They reach this page through EL's canonical syndication gate
 * (stories_for_site), so storytellers in an issue sit under EL's consent machinery —
 * withdrawing consent in EL pulls them at the source and this page follows on the next
 * render. GHL sends the same content by email; this page is the single web home.
 *
 * Until the first EL-authored issue is published, the local issue in news.ts renders as
 * the fallback — the same pattern as FeaturedStories falling back to journeyStories.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NEWS_ISSUES } from '@/lib/data/news';
import { MoneyPointer } from '@/components/money-pointer';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { DOORS } from '@/lib/data/road-ending';
import { empathyLedger } from '@/lib/empathy-ledger/client';

export const metadata: Metadata = {
  title: 'News — Goods on Country',
  description:
    'The monthly letter: what happened in community, who is stepping up, and where the road to ownership is.',
};

export const revalidate = 300; // EL consent changes reach the page within five minutes.

export default async function NewsPage() {
  const elIssues = await empathyLedger.getNewsletterIssues();
  const el = elIssues[0];
  const issue = NEWS_ISSUES.find((i) => i.published);
  if (!el && !issue) return null;
  // TS narrowing: past the EL branch below, issue is defined.


  // An EL-authored issue takes over the whole letter body; the doors and signup stay.
  if (el) {
    return (
      <article className="mx-auto max-w-3xl px-6 py-14">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-goods-terracotta">
            The letter{el.publishedAt ? ` · ${new Date(el.publishedAt).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}` : ''}
          </p>
          <h1 className="goods-pitch-display mt-3 text-4xl leading-tight md:text-5xl">{el.title}</h1>
          {el.excerpt && <p className="mt-4 text-lg leading-8 text-[#6d675c]">{el.excerpt}</p>}
        </header>
        {el.isHtml ? (
          <div
            className="prose prose-stone mt-10 max-w-none"
            dangerouslySetInnerHTML={{ __html: el.content }}
          />
        ) : (
          <div className="mt-10 space-y-5">
            {el.content.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="text-base leading-7 text-goods-ink">{para}</p>
            ))}
          </div>
        )}
        {elIssues.length > 1 && (
          <section className="mt-12 border-t border-[#d9d1c3] pt-6">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-goods-sub">Earlier letters</h2>
            <ul className="mt-3 space-y-2">
              {elIssues.slice(1).map((prev) => (
                <li key={prev.id} className="text-sm text-[#6d675c]">{prev.title}</li>
              ))}
            </ul>
          </section>
        )}
        <section className="mt-12">
          <h2 className="border-b-2 border-goods-ink pb-2 font-mono text-[11px] uppercase tracking-[0.18em]">
            Three ways in
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {DOORS.map((door) => (
              <div key={door.verb} className="border-t-2 border-goods-terracotta pt-2">
                <p className="goods-pitch-display text-xl">{door.verb}</p>
                <p className="mt-1 text-sm leading-5 text-[#6d675c]">{door.entity}</p>
              </div>
            ))}
          </div>
          <div className="mt-5"><MoneyPointer /></div>
        </section>
        <footer className="mt-14 border-t border-[#d9d1c3] pt-8">
          <p className="text-sm leading-6 text-[#6d675c]">Get the letter by email:</p>
          <div className="mt-4"><NewsletterSignup /></div>
        </footer>
      </article>
    );
  }

  if (!issue) return null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-goods-terracotta">
          The letter · {issue.month}
        </p>
        <h1 className="goods-pitch-display mt-3 text-4xl leading-tight md:text-5xl">{issue.title}</h1>
        <p className="mt-4 text-lg leading-8 text-[#6d675c]">{issue.standfirst}</p>
      </header>

      <section className="mt-12">
        <h2 className="border-b-2 border-goods-ink pb-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          From community
        </h2>
        <ul className="mt-6 space-y-8">
          {issue.fromCommunity.map((item) => (
            <li key={item.href + item.title}>
              <Link href={item.href} className="group grid gap-4 sm:grid-cols-[1fr_180px]">
                <div>
                  <h3 className="goods-pitch-display text-2xl leading-tight group-hover:text-goods-terracotta">
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
        <h2 className="border-b-2 border-goods-ink pb-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          People stepping up
        </h2>
        <ul className="mt-6 space-y-6">
          {issue.people.map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="group">
                <h3 className="goods-pitch-display text-xl group-hover:text-goods-terracotta">{item.title}</h3>
                <p className="mt-1 text-base leading-7 text-[#6d675c]">{item.line}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="border-b-2 border-goods-ink pb-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          The road to ownership
        </h2>
        <ul className="mt-6 space-y-3">
          {issue.road.map((line) => (
            <li key={line} className="border-l-2 border-[#d9d1c3] pl-4 text-base leading-7 text-goods-ink">
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <MoneyPointer />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="border-b-2 border-goods-ink pb-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          Three ways in
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {DOORS.map((door) => (
            <div key={door.verb} className="border-t-2 border-goods-terracotta pt-2">
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
