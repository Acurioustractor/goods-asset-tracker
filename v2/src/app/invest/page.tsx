/**
 * /invest — how to put money into Goods, explained structurally (Ben, 2026-08-06).
 *
 * The page /partner never was: not the capital ask (that lives on /partner and, with
 * figures, on /pitch/road) but the STRUCTURE — the three entities, which door fits which
 * giver, and the levels of community life the work supports. Written for a philanthropic
 * family, a corporate, or an individual asking "where would my money actually go, and
 * where does it do the most?"
 *
 * The three doors render from ENTITY_DOORS in ask-surface.ts (import-locked; the doors
 * are never restated), the same source the deck and the audience model read. The route is
 * allowlisted in check-money-prose.mjs for exactly that reason, like /partner. Entity
 * naming is exact (ruling K): Goods sells through A Curious Tractor Pty Ltd; Goods on
 * Country is a business name of The Butterfly Movement Ltd, the DGR charity. Ownership is
 * a pathway, never claimed complete.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ENTITY_DOORS, ENTITY_NOTES } from '@/lib/data/ask-surface';
import { MoneyPointer } from '@/components/money-pointer';

export const metadata: Metadata = {
  title: 'Invest in Goods — the three doors',
  description:
    'How a philanthropic family, a corporate or an individual can back Goods: tax-deductible gifts to the charity, orders and repayable capital to the trading company, and the pathway to community ownership.',
};

const DISPLAY_FONT = { fontFamily: 'var(--font-display, Georgia, serif)' } as const;

/**
 * The levels the work supports. Each line is grounded in something that happened and is
 * already public on this site; nothing here is a measured-outcome claim. The bed is the
 * entry point, never the whole point.
 */
const LEVELS = [
  {
    title: 'Health',
    line: 'A washable bed off the ground is health hardware. Crowded, bedless houses sit at the start of the scabies-to-rheumatic-heart-disease chain; that chain is why the work exists.',
    link: { label: 'The story', href: '/story' },
  },
  {
    title: 'Enterprise',
    line: 'Beds are made, sold and freighted as a real business. The plant is containerised so the making itself can move to community, with jobs and a pathway to community ownership.',
    link: { label: 'How it is made', href: '/process' },
  },
  {
    title: 'Young people',
    line: 'Build days put young people on the tools: the Alice Springs build with Oonchiumpa, the forty-bed Maningrida run. One young builder wanted to keep building.',
    link: { label: 'The Maningrida run', href: '/case-studies/maningrida' },
  },
  {
    title: 'Learning',
    line: 'The work runs through schools and community organisations: the school washing machine at Maningrida, plans open-sourced, the making taught rather than kept.',
    link: { label: 'The communities', href: '/communities' },
  },
] as const;

const GIVERS = [
  {
    who: 'A philanthropic family or foundation',
    fit: 'Tax-deductible gifts through the charity door. Gifts fund the community work and the block, never company equity, so the philanthropy is structurally separated from the trading.',
    doorVerb: 'Donate',
  },
  {
    who: 'A corporate',
    fit: 'Buy beds for the communities you work with, sponsor a run, or bring repayable capital to the bridge. Procurement is revenue, not philanthropy, and it is the most direct help there is.',
    doorVerb: 'Buy / Order',
  },
  {
    who: 'An impact investor or lender',
    fit: 'Repayable finance sits in the trading company, priced for what the money proves: a facility standing up, a production run measured, a community site running.',
    doorVerb: 'Invest (repayable)',
  },
] as const;

export default function InvestPage() {
  return (
    <>
      {/* Lead: the model, not the ask */}
      <section className="relative isolate flex min-h-[52vh] items-end overflow-hidden bg-foreground">
        <Image
          src="/images/community/maningrida/kids-carrying-orange-bed.jpg"
          alt="Kids carrying an orange Stretch Bed in Maningrida"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/30 to-black/75" />
        <div className="relative container mx-auto px-4 pb-14 md:pb-16">
          <p className="mb-3 text-sm uppercase tracking-widest text-white/70">Back the work</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl" style={DISPLAY_FONT}>
            Support communities where they are at. The bed is the entry point, never the whole point.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            One piece of work touches health, enterprise, young people and learning at once. Here is
            the structure your money moves through, so you can pick the door that does the most with it.
          </p>
        </div>
      </section>

      {/* The levels */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LEVELS.map((level) => (
              <div key={level.title} className="rounded-2xl border border-border bg-muted/20 p-7">
                <h2 className="mb-2 text-xl font-semibold text-foreground" style={DISPLAY_FONT}>
                  {level.title}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{level.line}</p>
                <Link href={level.link.href} className="text-sm font-semibold text-[#C45C3E]">
                  {level.link.label} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The three entities, from the locked doors */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <p className="mb-3 text-sm uppercase tracking-widest text-[#C45C3E]">The three doors</p>
          <h2 className="mb-4 max-w-3xl text-3xl font-semibold text-foreground md:text-4xl" style={DISPLAY_FONT}>
            Three doors, three legal entities. They are not interchangeable, and that is the point.
          </h2>
          <p className="mb-10 max-w-2xl text-base text-muted-foreground">
            Australian law separates gifts from trade, and Goods keeps that separation visible so no
            one has to take it on faith. Goods sells through A Curious Tractor Pty Ltd; Goods on
            Country is a registered business name of The Butterfly Movement Ltd, the charity.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {ENTITY_DOORS.map((door) => (
              <div key={door.verb} className="flex flex-col rounded-2xl border-t-4 border-[#C45C3E] bg-background p-7 shadow-sm">
                <h3 className="text-2xl font-semibold text-foreground" style={DISPLAY_FONT}>
                  {door.verb}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#6F7F5C]">{door.entity}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{door.what}</p>
              </div>
            ))}
          </div>
          <ul className="mt-8 max-w-3xl space-y-2">
            {ENTITY_NOTES.map((note) => (
              <li key={note.slice(0, 40)} className="text-xs leading-relaxed text-muted-foreground">
                · {note}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Which giver, which door */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 max-w-3xl text-3xl font-semibold text-foreground md:text-4xl" style={DISPLAY_FONT}>
            Where you can make the most impact
          </h2>
          <div className="space-y-6">
            {GIVERS.map((giver) => {
              const door = ENTITY_DOORS.find((d) => d.verb === giver.doorVerb);
              return (
                <div key={giver.who} className="grid gap-4 rounded-2xl border border-border p-7 md:grid-cols-[1fr_2fr_auto] md:items-center">
                  <h3 className="text-lg font-semibold text-foreground" style={DISPLAY_FONT}>
                    {giver.who}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{giver.fit}</p>
                  <p className="text-sm font-semibold text-[#C45C3E]">{door?.verb}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 max-w-2xl">
            <MoneyPointer />
          </div>
        </div>
      </section>

      {/* One action */}
      <section className="bg-foreground py-14 md:py-16">
        <div className="container mx-auto flex flex-col items-start gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-xl text-background" style={DISPLAY_FONT}>
            Tell us who you are and what you can bring. We will tell you plainly which door fits and
            what it does.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="bg-[#C45C3E] text-white hover:opacity-90" asChild>
              <Link href="/partner#start">Start the conversation</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10" asChild>
              <Link href="/pitch/road">Read the whole road</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
