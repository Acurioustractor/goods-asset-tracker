/**
 * /case-studies — the index the [slug] route never had.
 *
 * Until now `/case-studies/[slug]` existed with no parent, so the packs were
 * reachable only from a handful of inline links and the sitemap. With a second
 * proven run published (Alice Springs alongside Maningrida) an index earns
 * itself: the two answer the same question for different readers, and the
 * comparison IS the argument — Maningrida proves the making, Alice proves the
 * work.
 *
 * Same two readers as the packs themselves: a community or organisation asking
 * "how would this work for us", and a funder asking "has this actually
 * happened". Counts derive from the register via COMMUNITY_BED_CANON, never
 * typed here. No dollar figures (one-money-surface rule).
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CASE_STUDIES } from '@/lib/data/case-studies';
import { COMMUNITY_BED_CANON } from '@/lib/data/community-canonical';

export const metadata: Metadata = {
  title: 'Case studies — Goods on Country',
  description:
    'How the proven runs actually worked, told so another community can follow them. Delivered, reconciled and consent-cleared.',
};

export default function CaseStudiesIndex() {
  const studies = CASE_STUDIES.filter((c) => c.published);

  return (
    <main className="bg-goods-cream text-goods-ink">
      <header className="border-b border-goods-sand px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-goods-terracotta">
            Case studies
          </p>
          <h1 className="goods-pitch-display mt-4 max-w-3xl text-4xl leading-[1.05] md:text-6xl">
            How the runs actually worked
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-goods-sub">
            One pack per proven run. A case study exists here only for work that is delivered,
            reconciled and consent-cleared, so every count comes from the register and every quote
            from someone who agreed to be quoted.
          </p>
        </div>
      </header>

      <section className="px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-2">
          {studies.map((study) => {
            const canon = COMMUNITY_BED_CANON.find((c) => c.id === study.communityId);
            const beds = canon ? canon.basketBeds + canon.stretchBeds : 0;
            return (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-goods-terracotta"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-goods-ink">
                  <Image
                    src={study.hero.src}
                    alt={study.hero.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  />
                </div>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">
                  {study.place} · {study.country}
                </p>
                <h2 className="goods-pitch-display mt-2 text-2xl leading-tight md:text-3xl">
                  {study.title}
                </h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-goods-sub">{study.standfirst}</p>
                {beds > 0 && (
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">
                    {beds} beds in homes
                    {study.partner.nameCleared ? ` · with ${study.partner.name}` : ''}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-goods-sand px-6 py-12 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <p className="max-w-2xl text-base leading-7 text-goods-sub">
            Every run starts with a community&rsquo;s own ask, not a pitch. If you are wondering what
            this would look like where you are, that is the conversation.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/partner"
              className="bg-goods-terracotta px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white"
            >
              Start a conversation
            </Link>
            <Link
              href="/story#impact"
              className="border border-goods-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em]"
            >
              Impact and reach
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
