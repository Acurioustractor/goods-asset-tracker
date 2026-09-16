import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPartnerDashboard } from '@/lib/data/partner-dashboards';
import { getStorytellerBySlug } from '@/lib/data/storyteller-registry';
import { ORGANISATION } from '@/lib/data/organisation';
import { goodsBoard } from '@/lib/data/goods-board';
import {
  ALIGNMENT, BECAUSE_OF, NOT_FINISHED, SNOW_MONEY, TOGETHER,
} from '@/lib/data/snow-partnership';
import { StickyFilm, type FilmStep } from '@/components/pitch/sticky-film';
import { ChapterRail } from '@/components/pitch/chapter-rail';
import { CountUp } from '@/components/pitch/count-up';
import { TogetherTimeline } from '@/components/partners/together-timeline';
import { AlignmentTable } from '@/components/partners/alignment-table';

/**
 * THE SNOW PARTNERSHIP REPORT. Password gated in proxy.ts alongside the dashboard.
 *
 * Ben, 16 September 2026: an interactive report in the shape of /pitch, about the partnership
 * about the partnership itself. What we have done together, what Goods is because of it, and
 * how the two organisations keep working at rheumatic heart disease through Indigenous
 * leadership.
 *
 * CHAPTER ONE IS THE HEALTH CHAIN, and the product comes after it. That is Sally
 * Grimsley-Ballard's own
 * instruction from 20 May 2026, reviewing our Canberra page: "A cold audience needs that chain
 * explained immediately and plainly, before the product, before the manufacturing story." The
 * sentence in chapter one is close to the one she wrote for us.
 *
 * Every Snow intention on this page is a dated quote or it is absent. Every community and
 * funder voice resolves from the registry by slug, default-deny, so a wrong tier or an
 * unapproved quote renders nothing at all.
 */

const CREAM = '#FDF8F3';
const CHARCOAL = '#2E2E2E';
const RUST = '#C45C3E';
const SAGE = '#8B9D77';

export const metadata: Metadata = {
  title: { absolute: 'Snow and Goods | Goods on Country' },
  description: 'What we have built together since 2024, and what comes next.',
  robots: { index: false, follow: false },
};

const CHAPTERS = [
  { id: 'ch-stakes', number: '01', label: 'What is at stake' },
  { id: 'ch-first', number: '02', label: 'Snow went first' },
  { id: 'ch-together', number: '03', label: 'What we have done' },
  { id: 'ch-because', number: '04', label: 'What Goods is now' },
  { id: 'ch-board', number: '05', label: 'Who holds it' },
  { id: 'ch-align', number: '06', label: 'Your strategy, our evidence' },
  { id: 'ch-unfinished', number: '07', label: 'What is not finished' },
  { id: 'ch-next', number: '08', label: 'What we are asking' },
] as const;

/** Default-deny, same shape as funder-moments: wrong tier or unapproved renders nothing. */
function quote(slug: string, tier: 'funder' | 'external', contains: string) {
  const person = getStorytellerBySlug(slug);
  if (!person || person.tier !== tier) return null;
  const q = person.quotes.find(
    (x) => (x.status === 'primary' || x.status === 'approved') && x.text.includes(contains),
  );
  return q ? { person, quote: q } : null;
}

function Pull({ v }: { v: NonNullable<ReturnType<typeof quote>> }) {
  return (
    <figure className="m-0 mt-8 flex max-w-2xl gap-4">
      {v.person.portrait && (
        <Image src={v.person.portrait} alt={v.person.name} width={160} height={160} className="h-14 w-14 shrink-0 rounded-full object-cover" />
      )}
      <div>
        <blockquote className="font-display text-lg leading-snug sm:text-xl" style={{ color: CHARCOAL }}>
          &ldquo;{v.quote.text}&rdquo;
        </blockquote>
        <figcaption className="mt-2 text-xs uppercase tracking-wide" style={{ color: SAGE }}>
          {v.person.name}
          {v.person.role ? `, ${v.person.role}` : ''}
        </figcaption>
      </div>
    </figure>
  );
}

function Chapter({ id, number, label, title, lead, children }: {
  id: string; number: string; label: string; title: string; lead?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: RUST }}>
          {number} &middot; {label}
        </p>
        <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl" style={{ color: CHARCOAL }}>{title}</h2>
        {lead && <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: `${CHARCOAL}cc` }}>{lead}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

const money = (n: number) => `$${n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default async function PartnerStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Only Snow has a story written. Another partner slug gets a 404; a half-empty page would
  // be worse than nothing.
  if (slug !== 'snow') notFound();
  const partner = getPartnerDashboard(slug);
  if (!partner) notFound();

  const catalyse = quote('georgina-byron', 'funder', 'we can catalyse others to do their bit');
  const backing = quote('georgina-byron', 'funder', "It's also about backing really great people");
  const withNotFor = quote('georgina-byron', 'funder', "It's not a for, it's a with");
  const healthyHomes = quote('georgina-byron', 'funder', 'Healthy homes is the start of everything');
  const smallStart = quote('georgina-byron', 'funder', 'you start small and then you realize');
  const vicki = quote('vicki-wade', 'external', 'Community leadership, community ownership');
  const norman = quote('norman-frank', 'external', "we've got our own ways");

  // The arc over the drone: an idea, then a project, then a charity with its own board.
  const steps: FilmStep[] = [
    {
      id: 'arc-2024',
      body: (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-goods-cream/70">October 2024</p>
          <p className="mt-3 font-display text-2xl leading-snug text-goods-cream sm:text-3xl">
            Snow commits $25,000, and another $25,000 to follow.
          </p>
          <p className="mt-4 max-w-md text-goods-cream/85">
            There is no product, no register, no charity, no board and no customer. Georgina writes the condition
            herself: &ldquo;assuming all going well, I won&rsquo;t define &lsquo;going well&rsquo;, trust you to know that!&rdquo;
          </p>
        </>
      ),
    },
    {
      id: 'arc-trip',
      body: (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-goods-cream/70">November 2024</p>
          <p className="mt-3 font-display text-2xl leading-snug text-goods-cream sm:text-3xl">
            The funder comes to Tennant Creek.
          </p>
          <p className="mt-4 max-w-md text-goods-cream/85">
            Six weeks after the first invoice, Georgina and Sally are at the Healthy Homes forum at Anyinginyi
            Health Corporation. Not a site visit at the end. The beginning.
          </p>
        </>
      ),
    },
    {
      id: 'arc-trek',
      body: (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-goods-cream/70">2025</p>
          <p className="mt-3 font-display text-2xl leading-snug text-goods-cream sm:text-3xl">
            Beds start travelling with the heart screening.
          </p>
          <p className="mt-4 max-w-md text-goods-cream/85">
            The Deadly Heart Trek, twice. Over 800 children screened at Katherine and Big Rivers, fifteen new
            diagnoses, and a Basket Bed is what the children lie on to watch the film about the disease.
          </p>
        </>
      ),
    },
    {
      id: 'arc-charity',
      body: (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-goods-cream/70">2026</p>
          <p className="mt-3 font-display text-2xl leading-snug text-goods-cream sm:text-3xl">
            {ORGANISATION.boardLine}
          </p>
          <p className="mt-4 max-w-md text-goods-cream/85">
            An idea became a project, and the project became a charity that Indigenous directors hold. Snow&rsquo;s
            money was in every one of those stages, and Snow&rsquo;s tenth invoice was paid in May 2026.
          </p>
        </>
      ),
    },
  ];

  return (
    <main style={{ backgroundColor: CREAM }}>
      <ChapterRail chapters={CHAPTERS} />

      <header className="px-5 pb-10 pt-20 sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: RUST }}>
            A report for the Snow Foundation
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] sm:text-6xl" style={{ color: CHARCOAL }}>
            You went first, and then you stayed.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            Two years of work, told as what we did together. It is written for the people
            who have been on Country with us, so it carries the numbers, the parts that are not finished, and the
            things we will not claim.
          </p>
          <p className="mt-6 text-xs" style={{ color: '#A99C8F' }}>
            Password protected and not indexed. Prepared {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}.
            {' '}
            <Link href={`/partners/${slug}/dashboard`} className="underline">The live dashboard is here.</Link>
          </p>
        </div>
      </header>

      <Chapter
        id="ch-stakes" number="01" label="What is at stake"
        title="Rheumatic heart disease, before anything else"
        lead="Sally told us in May that a cold reader needs the chain explained plainly, before the product and before the manufacturing story. She was right, so it goes here."
      >
        <div className="rounded-lg p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="font-display text-xl leading-snug sm:text-2xl" style={{ color: CHARCOAL }}>
            Rheumatic heart disease is a preventable condition that damages the heart valves of children and young
            people. It is almost eradicated everywhere in the world except in remote Aboriginal and Torres Strait
            Islander communities in Australia.
          </p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-5">
            {['Sleeping on the floor', 'Scabies', 'Strep A', 'Rheumatic fever', 'Rheumatic heart disease'].map((s, i) => (
              <li key={s} className="rounded-lg p-4" style={{ backgroundColor: CREAM, borderTop: `3px solid ${i < 2 ? RUST : '#B8AEA4'}` }}>
                <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#A99C8F' }}>{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-1 text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>{s}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            A bed off the floor and bedding that can be washed act on the first two links, which are the two that a
            product can reach. That is the whole of our claim, and chapter seven says what we will not add to it.
          </p>
        </div>
        {healthyHomes && <Pull v={healthyHomes} />}
      </Chapter>

      <div id="ch-first" className="scroll-mt-24">
        <div className="px-5 pt-16 sm:px-8 sm:pt-24">
          <div className="mx-auto max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: RUST }}>02 &middot; Snow went first</p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl" style={{ color: CHARCOAL }}>
              An idea, a project, and now a charity with its own board
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: `${CHARCOAL}cc` }}>
              Snow&rsquo;s money was in all three stages. This is Tingkkarli, five kilometres north of Tennant Creek,
              filmed on the April 2025 trip.
            </p>
          </div>
        </div>
        <StickyFilm
          src="/video/tennant-creek/tingkkarli-drone.mp4"
          poster="/video/tennant-creek/tingkkarli-drone-poster.jpg"
          alt="Tingkkarli, Lake Mary Ann, north of Tennant Creek"
          credit="Tingkkarli / Lake Mary Ann, Warumungu Country, April 2025"
          steps={steps}
          scrim="heavy"
        />
        <div className="px-5 pb-4 sm:px-8">
          <div className="mx-auto max-w-4xl">
            {catalyse && <Pull v={catalyse} />}
            {backing && <Pull v={backing} />}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="font-display text-2xl" style={{ color: CHARCOAL }}>{money(SNOW_MONEY.goodsOnlyIncGstAud)}</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>
                  Given to Goods across {SNOW_MONEY.goodsInvoices} invoices, including GST. Nothing outstanding.
                </p>
              </div>
              <div className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="font-display text-2xl" style={{ color: CHARCOAL }}>{SNOW_MONEY.shareOfAllPhilanthropyPct}%</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>
                  Of every philanthropic dollar Goods has ever received.
                </p>
              </div>
              <div className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="font-display text-2xl" style={{ color: CHARCOAL }}>May 2026</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>
                  The most recent invoice. This partnership is still running.
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed" style={{ color: '#A99C8F' }}>
              {SNOW_MONEY.basisNote}
            </p>
          </div>
        </div>
      </div>

      <Chapter
        id="ch-together" number="03" label="What we have done"
        title="Two years, and the money is the smallest part of it"
        lead="Trips, rooms, introductions and the times Snow told this story in its own voice. Filter the money out and see what is left."
      >
        <TogetherTimeline moments={TOGETHER} />
        {smallStart && <Pull v={smallStart} />}
      </Chapter>

      <Chapter
        id="ch-because" number="04" label="What Goods is now"
        title="What the money turned into"
        lead="Counts where we have counts, and labels where we do not. The last number on this list is zero, and it is the one we print against ourselves."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BECAUSE_OF.map((b) => (
            <div key={b.id} className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
              {/* MeasureLabel has no `future`, and inventing one here would put a word on a
                  chip that the rest of the site does not use. A future row gets its own chip. */}
              {b.status === 'future' ? (
                <>
                  <p className="font-display text-4xl leading-none" style={{ color: CHARCOAL }}>{b.value}</p>
                  <span className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ backgroundColor: '#EEE9E3', color: '#6A5E54' }}>
                    not yet
                  </span>
                </>
              ) : (
                <CountUp value={b.value} unit={b.unit} label={b.status} />
              )}
              <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>{b.headline}</p>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{b.detail}</p>
            </div>
          ))}
        </div>
        {withNotFor && <Pull v={withNotFor} />}
      </Chapter>

      <Chapter
        id="ch-board" number="05" label="Who holds it"
        title={ORGANISATION.boardLine}
        lead="Snow said in November 2025 that all future grants would require First Nations leadership, and that every partner would be reviewed. This is our answer, and it was underway before the question."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {goodsBoard.map((d) => (
            <div key={d.name} className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
              <p className="font-display text-lg leading-snug" style={{ color: CHARCOAL }}>{d.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: SAGE }}>{d.country}</p>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{d.bio}</p>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{d.goods}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            {ORGANISATION.legalName}, ABN {ORGANISATION.abn}. A registered charity with deductible gift recipient
            status. The board handover is still in progress and no chair has been appointed, which we would rather
            say here than have you find later.
          </p>
        </div>
        {vicki && <Pull v={vicki} />}
        {norman && <Pull v={norman} />}
      </Chapter>

      <Chapter
        id="ch-align" number="06" label="Your strategy, our evidence"
        title="Read your own words back, with the gaps marked"
        lead="Six things Snow has published about what it funds, and what Goods can actually put against each one. Two of these are weak and one is a thing we are not asking you to fund."
      >
        <AlignmentTable rows={ALIGNMENT} />
      </Chapter>

      <Chapter
        id="ch-unfinished" number="07" label="What is not finished"
        title="The parts we would rather you heard from us"
        lead="A funder who asks for evidence-based and culturally safe programs should be told what the evidence does not cover."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {NOT_FINISHED.map((n) => (
            <div key={n.title} className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: `1px solid #E8DED4`, borderLeft: `3px solid ${RUST}` }}>
              <p className="font-display text-base leading-snug" style={{ color: CHARCOAL }}>{n.title}</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{n.detail}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter
        id="ch-next" number="08" label="What we are asking"
        title="133 beds, and a longer conversation"
        lead="The same ask we have put to our other bed funders, so nobody is being asked for something shaped specially for them."
      >
        <div className="rounded-lg p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="font-display text-3xl sm:text-4xl" style={{ color: CHARCOAL }}>$99,750</p>
          <p className="mt-2 text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            133 Stretch Beds at $750 each, for a community organisation to sell or give out. The money reaches the
            community organisation, not us: customers pay them directly, and after costs they decide whether it
            becomes more beds, paid local work, or making their own.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { k: 'Where it goes', v: 'To a community organisation, as stock they own.' },
              { k: 'Who decides next', v: 'They do. More beds, paid work, or their own making.' },
              { k: 'What we keep', v: 'What is left after making, freight and facilitation, which carries the organisation.' },
            ].map((x) => (
              <div key={x.k}>
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>{x.k}</p>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>{x.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-lg p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>The longer conversation</p>
          <p className="mt-2 text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            Beyond this, we would like to talk with you about whether some of what comes after could be recoverable
            capital: money that returns to Snow over time and goes back to work. That is a conversation we are
            opening. There is no proposal on the table. The amount, the conditions it would carry and the impact it would
            be held to are all things to work out together, and it sits alongside the partnership we already have.
          </p>
        </div>

        <div className="mt-6 rounded-lg p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>What we would do together</p>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            <li>Keep the beds travelling with the heart screening, where the Trek has already shown it works.</li>
            <li>Build the training that chapter six says we do not yet have, so capacity is a count and not an intention.</li>
            <li>Carry the first transfer of a production site into community hands, and report on it whether or not it goes smoothly.</li>
            <li>Keep the story in the hands of the people telling it. Thirty-eight people have agreed by name, and nobody else appears.</li>
          </ul>
        </div>
      </Chapter>

      <footer className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-4xl border-t pt-8" style={{ borderColor: '#E8DED4' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#A99C8F' }}>
            Every figure here traces to the live books, the register or the consent record, and every Snow quote
            carries a date. Where a number is modelled or a target, it says so on the number
            itself. Prepared by {ORGANISATION.legalName} for the Snow Foundation.
          </p>
        </div>
      </footer>
    </main>
  );
}
