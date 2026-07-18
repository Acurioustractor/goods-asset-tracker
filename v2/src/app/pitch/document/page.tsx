'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Image from 'next/image';
import { advisoryGroup, communityPartnerships, investmentCase, story } from '@/lib/data/content';
import { media } from '@/lib/data/media';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { PLASTIC_KG_PER_BED, STRETCH_BED, WASHING_MACHINE } from '@/lib/data/products';
import { getStoryteller, type StorytellerRecord } from '@/lib/data/storyteller-registry';

const plainCase = [
  'People are asking for beds that work in heat, dust, freight, and crowded houses.',
  `The Stretch Bed exists: ${STRETCH_BED.specs.weight}, ${STRETCH_BED.specs.loadCapacity} load, no tools, recycled HDPE legs, steel poles, canvas.`,
  'Demand has names attached: Dianne Stokes, Utopia Homelands, Homeland Schools, Maningrida.',
  'The plant is the path from Goods-run production to community-owned making.',
];

const problemPains = [
  'Families are sleeping on the floor because ordinary beds are hard to freight, clean, and keep.',
  'Essential goods fail fast because most products are not designed for remote use, repair, or shared households.',
  'Value leaves community when plastic goes to landfill, freight absorbs budgets, and production work sits elsewhere.',
];

const businessRows = [
  {
    buyer: 'Procurement and health buyers',
    buys: 'Stretch Bed batches for communities, schools, housing programs, and health partners.',
  },
  {
    buyer: 'Sponsors and funders',
    buys: 'Beds, production capability, and the capital bridge into On-Country manufacturing.',
  },
  {
    buyer: 'Direct customers',
    buys: 'The Stretch Bed through ecommerce. Pakkimjalki Kari remains register-interest only.',
  },
];

const whyNow = [
  'Health, housing, and school partners are looking for practical goods that keep homes washable, usable, and safe.',
  'The press, shredder, CNC, and container workflow are now real enough to move from proof to production discipline.',
  'QBE Catalysing Impact, SEFA, Snow, Centrecorp, and White Box SELF are the next conversations.',
];

const competition = [
  {
    alternative: 'Standard beds and mattresses',
    breaks: 'Bulky freight, hard to wash, limited repair fit, no ownership pathway.',
    win: 'Flat-packable, washable, repairable, QR-tracked support, remote-first design.',
  },
  {
    alternative: 'Camping or emergency beds',
    breaks: 'Cheap, but not long-life household infrastructure.',
    win: `Designed as health hardware with ${STRETCH_BED.specs.designLifespan.replace(/s$/, '')} design life and local manufacturing pathway.`,
  },
  {
    alternative: 'Do nothing',
    breaks: 'Families keep using broken workarounds and waste keeps moving through the same loop.',
    win: 'Goods turns named demand into beds now and production work over time.',
  },
];

// Kept in sync with the same list on /pitch (source of truth: storyteller-registry.ts).
const REAL_VOICE_NAMES = ['Dianne Stokes', 'Norman Frank', 'Cliff Plummer', 'Chloe', 'Wayne Glenn', 'Dr Boe Remenyi'];

function leadQuote(record: StorytellerRecord) {
  return record.quotes.find((q) => q.status === 'primary') ?? record.quotes.find((q) => q.status === 'approved') ?? null;
}

const realVoices = REAL_VOICE_NAMES.map((name) => getStoryteller(name))
  .filter((record): record is StorytellerRecord => record !== undefined && record.tier === 'external')
  .map((record) => ({ record, quote: leadQuote(record) }))
  .filter((entry): entry is { record: StorytellerRecord; quote: NonNullable<ReturnType<typeof leadQuote>> } => Boolean(entry.quote));

export default function PitchDocumentPage() {
  useEffect(() => {
    document.body.classList.add('pitch-document-mode');
    return () => document.body.classList.remove('pitch-document-mode');
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .pitch-document-mode header,
            .pitch-document-mode footer,
            .pitch-document-mode [data-impact-banner],
            .pitch-document-mode .flex.min-h-screen.flex-col > div:first-child,
            .pitch-document-mode .flex.min-h-screen.flex-col > :not(main) {
              display: none !important;
            }
            .pitch-document-mode main {
              flex: unset !important;
            }
            .pitch-document-mode .flex.min-h-screen.flex-col {
              min-height: unset !important;
              display: block !important;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none !important; }
              .page-break { page-break-before: always; }
              .avoid-break { page-break-inside: avoid; }
              @page { margin: 1.5cm 2cm; size: A4; }
            }
          `,
        }}
      />

      <div className="no-print sticky top-0 z-50 bg-neutral-900 text-white">
        <div className="mx-auto flex max-w-[210mm] items-center justify-between px-8 py-3">
          <div className="flex items-center gap-3">
            <Link href="/pitch" className="text-sm text-white/60 transition-colors hover:text-white">
              &larr; Back to pitch
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-sm text-white/40">Shareable document &middot; Save as PDF via print</span>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Save as PDF
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-[210mm] bg-white text-black" style={{ fontFamily: 'var(--font-inter, system-ui, sans-serif)' }}>
        <section className="flex min-h-[90vh] flex-col justify-between px-12 pb-16 pt-20 print:min-h-[270mm]">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-neutral-400">Goods on Country</p>
            <p className="mb-2 text-xs text-neutral-400">Investment pitch &middot; Updated 8 July 2026</p>
            <p className="mb-16 text-xs text-neutral-400">
              Catalysing Impact, powered by Social Impact Hub, in partnership with QBE Foundation
            </p>

            <h1
              className="mb-8 max-w-xl text-4xl font-light leading-tight text-black md:text-5xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Beds off the ground, plastic out of landfill, manufacturing moving On Country.
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-relaxed text-neutral-600">
              The Stretch Bed is {STRETCH_BED.specs.weight}, washable, and built from recycled HDPE, galvanised steel, and canvas.
              The bigger work is the plant: turning local plastic into local production.
            </p>

            <div className="mb-10 border-l-4 border-black pl-4">
              <p className="text-sm font-medium text-black">Total investment sought</p>
              <p className="text-3xl font-bold text-black">{investmentCase.totalAsk}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {plainCase.map((item, index) => (
                <div key={item} className="avoid-break rounded-lg border border-neutral-200 p-4">
                  <p className="mb-2 text-xs font-bold text-neutral-400">0{index + 1}</p>
                  <p className="text-sm leading-relaxed text-neutral-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto border-t border-neutral-200 pt-6">
            <div className="grid grid-cols-2 gap-8 text-xs text-neutral-500">
              <div>
                <p className="mb-1 font-medium text-black">A Curious Tractor Pty Ltd t/a Goods</p>
                <p>Nicholas Marchesi, Founder</p>
                <p>hi@act.place</p>
              </div>
              <div>
                <p className="mb-1 font-medium text-black">Current proof base</p>
                <p>{CANONICAL_ASSETS.bedsDeployed} tracked bed units &middot; {CANONICAL_ASSETS.communitiesServed} communities</p>
                <p>{PLASTIC_KG_PER_BED}kg HDPE diverted per current Stretch Bed design</p>
              </div>
            </div>
          </div>
        </section>

        <section className="page-break px-12 py-16">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-neutral-400">01 &middot; Problem</p>
          <h2
            className="mb-4 text-3xl font-light text-black"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            This shows up in homes, freight bills, and community dumps.
          </h2>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-neutral-600">
            The old system ships in whatever is available, then asks families and community organisations to carry the cost
            when it breaks, cannot be washed, or never arrives.
          </p>

          <div className="mb-10 grid grid-cols-3 gap-4">
            {problemPains.map((pain) => (
              <div key={pain} className="avoid-break rounded-lg border border-neutral-200 p-4">
                <p className="text-sm leading-relaxed text-neutral-700">{pain}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {story.problem.stats.map((stat) => (
              <div key={stat.label} className="avoid-break border-l-2 border-neutral-200 py-2 pl-4">
                <p className="text-2xl font-bold text-black">{stat.value}</p>
                <p className="text-sm text-neutral-600">{stat.label}</p>
                {stat.source && <p className="mt-0.5 text-xs text-neutral-400">{stat.source}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="page-break px-12 py-16">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-neutral-400">02 &middot; Traction</p>
          <h2
            className="mb-4 text-3xl font-light text-black"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            This is not a concept deck.
          </h2>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-neutral-600">
            Beds are already in homes. The strongest demand signal is people who used the bed, then asked for more.
          </p>

          <div className="mb-10 grid grid-cols-4 gap-4">
            {[
              { value: String(CANONICAL_ASSETS.bedsDeployed), label: 'tracked bed units' },
              { value: String(CANONICAL_ASSETS.communitiesServed), label: 'communities served' },
              { value: '107', label: 'more beds on order/requested' },
              { value: `${PLASTIC_KG_PER_BED}kg`, label: 'HDPE per Stretch Bed' },
            ].map((stat) => (
              <div key={stat.label} className="avoid-break rounded-lg border border-neutral-200 p-4">
                <p className="text-2xl font-bold text-black">{stat.value}</p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            {investmentCase.demand.slice(0, 5).map((item, index) => (
              <div key={item.text} className="avoid-break flex gap-4">
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-black">{item.text}</p>
                  <p className="mt-1 text-xs text-neutral-400">{item.person}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="page-break px-12 py-16">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-neutral-400">03 &middot; Product</p>
          <h2
            className="mb-4 text-3xl font-light text-black"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            {STRETCH_BED.name}
          </h2>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-neutral-600">
            {STRETCH_BED.tagline} The Stretch Bed is the first product: available now, assembled in minutes,
            washable, repairable, and designed for remote conditions.
          </p>

          <div className="mb-10 grid grid-cols-2 gap-x-8 gap-y-3">
            {[
              STRETCH_BED.specs.weight,
              `${STRETCH_BED.specs.loadCapacity} load capacity`,
              `${STRETCH_BED.specs.assemblyTime} assembly`,
              STRETCH_BED.specs.toolsRequired === 'None' ? 'No tools required' : STRETCH_BED.specs.toolsRequired,
              STRETCH_BED.specs.plasticDiverted,
              `${STRETCH_BED.specs.designLifespan} design life`,
            ].map((feature) => (
              <div key={feature} className="avoid-break flex items-start gap-2 text-sm text-black">
                <span className="mt-0.5 text-neutral-400">&#10003;</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {media.product.stretchBedHero ? (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image src={media.product.stretchBedHero} alt="The Stretch Bed" fill className="object-cover" sizes="600px" />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100">
              <p className="text-xs text-neutral-400">[ Product photo ]</p>
            </div>
          )}
        </section>

        <section className="page-break px-12 py-16">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-neutral-400">04 &middot; Model</p>
          <h2
            className="mb-4 text-3xl font-light text-black"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Product revenue now. Community-owned production over time.
          </h2>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-neutral-600">
            The simple model: sell durable goods, use patient capital to build production, then move more of the making
            and margin to community-controlled partners.
          </p>

          <div className="mb-8 rounded-lg border border-neutral-200 p-5">
            <p className="mb-2 text-xs uppercase tracking-wider text-neutral-400">Money flow</p>
            <p className="text-lg font-semibold text-black">
              Bed orders + sponsored deployments + patient capital = inventory, plant capability, and local production runs.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-3 gap-4">
            {businessRows.map((row) => (
              <div key={row.buyer} className="avoid-break rounded-lg border border-neutral-200 p-4">
                <h3 className="mb-2 text-sm font-semibold text-black">{row.buyer}</h3>
                <p className="text-xs leading-relaxed text-neutral-600">{row.buys}</p>
              </div>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-neutral-600">
            Product boundary: the Stretch Bed is the only direct-sale product. {WASHING_MACHINE.name} is a prototype
            and register-interest pathway, not a checkout product.
          </p>
        </section>

        <section className="page-break px-12 py-16">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-neutral-400">05 &middot; Why now and first channels</p>
          <h2
            className="mb-4 text-3xl font-light text-black"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            The first buyers and partners are not theoretical.
          </h2>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-neutral-600">
            Goods is moving from evidence and requests into repeatable buyer, funder, and community-production channels.
          </p>

          <h3 className="mb-4 text-base font-semibold text-black">Why now</h3>
          <div className="mb-10 grid grid-cols-3 gap-4">
            {whyNow.map((item) => (
              <div key={item} className="avoid-break rounded-lg border border-neutral-200 p-4">
                <p className="text-xs leading-relaxed text-neutral-600">{item}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-4 text-base font-semibold text-black">First wedges</h3>
          <div className="space-y-4">
            {[
              'Convert named demand: Utopia, Homeland Schools, NPY Women\'s Council, health coordinators, and repeat community requests.',
              'Use health hardware buyers: ACCHOs, environmental health teams, schools, housing partners, and procurement leads.',
              'Move from bed batches to hosted or owned production runs with Oonchiumpa, Palm Island Community Company, and future community-controlled partners.',
            ].map((item) => (
              <p key={item} className="avoid-break border-l-2 border-neutral-200 pl-4 text-sm leading-relaxed text-neutral-700">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="page-break px-12 py-16">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-neutral-400">06 &middot; Competition and risk</p>
          <h2
            className="mb-4 text-3xl font-light text-black"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            The competition is the broken default.
          </h2>
          <div className="mb-10 space-y-4">
            {competition.map((row) => (
              <div key={row.alternative} className="avoid-break rounded-lg border border-neutral-200 p-4">
                <h3 className="mb-1 text-sm font-semibold text-black">{row.alternative}</h3>
                <p className="text-xs text-neutral-500">What breaks: {row.breaks}</p>
                <p className="mt-2 text-xs leading-relaxed text-neutral-700">Why Goods wins: {row.win}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-4 text-base font-semibold text-black">Key risks being managed</h3>
          <div className="grid grid-cols-2 gap-4">
            {investmentCase.risks.slice(0, 4).map((risk) => (
              <div key={risk.risk} className="avoid-break rounded-lg border border-neutral-200 p-4">
                <h4 className="mb-1 text-sm font-semibold text-black">{risk.risk}</h4>
                <p className="mb-2 text-xs text-neutral-500">{risk.detail}</p>
                <p className="text-xs leading-relaxed text-neutral-700">{risk.mitigation}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="page-break px-12 py-16">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-neutral-400">07 &middot; People and proof</p>
          <h2
            className="mb-4 text-3xl font-light text-black"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            The proof has names, places, and people around it.
          </h2>

          <div className="mb-8 grid grid-cols-2 gap-4">
            {communityPartnerships.filter((p) => p.bedsDelivered > 0).slice(0, 6).map((p) => (
              <div key={p.id} className="avoid-break rounded-lg border border-neutral-200 p-4">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-black">{p.name}</h3>
                    <p className="text-xs text-neutral-400">{p.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-black">{p.bedsDelivered}</p>
                    <p className="text-xs text-neutral-400">beds</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-neutral-600">{p.headline}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-4 text-base font-semibold text-black">Real voices</h3>
          <div className="mb-8 grid grid-cols-3 gap-4">
            {realVoices.map(({ record, quote }) => (
              <div key={record.slug} className="avoid-break rounded-lg border border-neutral-200 p-4">
                <div className="mb-2 flex items-center gap-2">
                  {record.portrait ? (
                    <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-neutral-100">
                      <Image src={record.portrait} alt={record.name} fill className="object-cover" sizes="32px" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-500">
                      {record.name
                        .split(' ')
                        .filter((part) => part && part[0] === part[0].toUpperCase())
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-black">{record.name}</p>
                    <p className="text-[10px] text-neutral-400">{record.role}</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-neutral-700">&quot;{quote.text}&quot;</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="avoid-break rounded-lg border border-neutral-200 p-5">
              <h3 className="mb-4 text-sm font-semibold text-black">Named demand</h3>
              {investmentCase.demand.slice(0, 4).map((item) => (
                <div key={item.text} className="mb-4 border-l border-neutral-200 pl-4 last:mb-0">
                  <p className="text-xs leading-relaxed text-black">{item.text}</p>
                  <p className="mt-1 text-xs text-neutral-500">{item.person}</p>
                </div>
              ))}
            </div>
            <div className="avoid-break rounded-lg border border-neutral-200 p-5">
              <h3 className="mb-4 text-sm font-semibold text-black">Advisory group</h3>
              <div className="space-y-3">
                {advisoryGroup.map((person) => (
                  <div key={person.name}>
                    <p className="text-sm font-medium text-black">{person.name}</p>
                    <p className="text-xs text-neutral-500">
                      {person.title}{person.org ? `, ${person.org}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-break px-12 py-16">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-neutral-400">08 &middot; Ask</p>
          <h2
            className="mb-8 text-3xl font-light text-black"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            {investmentCase.totalAsk} to move from batches to steady production.
          </h2>

          <div className="mb-10 grid grid-cols-3 gap-4">
            {investmentCase.fundingLines.map((line) => (
              <div key={line.id} className="avoid-break rounded-lg border border-neutral-200 p-5">
                <p className="mb-1 text-2xl font-bold text-black">{line.amount}</p>
                <h3 className="mb-2 text-sm font-semibold text-black">{line.title}</h3>
                <p className="text-xs leading-relaxed text-neutral-600">{line.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center">
            <p
              className="mb-3 text-xl font-light text-black"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Why invest now
            </p>
            <p className="mx-auto mb-5 max-w-lg text-sm leading-relaxed text-neutral-600">
              The product exists. The demand is named. The plant pathway is real. The next step is to make production
              less founder-led and easier for community partners to own.
            </p>
            <p className="text-sm font-medium text-black">hi@act.place</p>
          </div>
        </section>
      </article>
    </>
  );
}
