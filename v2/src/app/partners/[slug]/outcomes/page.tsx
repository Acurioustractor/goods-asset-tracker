import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import { PrintButton } from './print-button';
import {
  allPartnerSlugs,
  computePartnerOutcomes,
  getPartner,
  PARTNER_ACCENTS,
  type CommunityRollupRow,
  type Partner,
  type PartnerOutcomes,
} from '@/lib/data/partners';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return allPartnerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) return { title: 'Partner outcomes snapshot' };
  const title = `${partner.name} outcomes snapshot`;
  const description = partner.hero.summary;
  return {
    title,
    description,
    alternates: { canonical: `https://www.goodsoncountry.com/partners/${slug}/outcomes` },
    openGraph: {
      title,
      description,
      url: `https://www.goodsoncountry.com/partners/${slug}/outcomes`,
      type: 'article',
      images: [
        {
          url: `https://www.goodsoncountry.com${partner.hero.imageSrc}`,
          alt: partner.hero.imageAlt,
        },
      ],
    },
    robots: { index: true, follow: true },
  };
}

async function loadRollup(communityIds: string[]): Promise<CommunityRollupRow[]> {
  if (communityIds.length === 0) return [];
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('community_rollup')
      .select(
        'id,name,deployed_beds,ready_beds,allocated_beds,requested_beds,household_reach,households_with_consent,open_demand_qty',
      )
      .in('id', communityIds);
    if (error) {
      console.warn('[partner/outcomes] community_rollup query failed:', error.message);
      return [];
    }
    return (data || []) as CommunityRollupRow[];
  } catch (err) {
    console.warn('[partner/outcomes] supabase unavailable:', err instanceof Error ? err.message : err);
    return [];
  }
}

export default async function PartnerOutcomesPage({ params }: PageProps) {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) notFound();

  const rollup = await loadRollup(partner.communityIds);
  const outcomes = computePartnerOutcomes(partner, rollup);

  return (
    <main className="bg-[#fbf7f1] text-[#282828] min-h-screen print:bg-white">
      <PrintStyles />

      {/* Toolbar — hidden in print, lets the user print to PDF */}
      <div className="print:hidden border-b border-[#e5d9cd] bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-5 py-3 text-xs">
          <Link href={`/partners/${partner.slug}`} className="text-[#68635d] hover:text-[#282828]">
            ← Back to {partner.shortName ?? partner.name}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[#68635d]">
              Source:{' '}
              {outcomes.bedsDeliveredSource === 'live' ? 'live community register' : 'committed numbers'}
            </span>
            <PrintButton />
          </div>
        </div>
      </div>

      <div className="mx-auto print:m-0 print:p-0 print:max-w-none max-w-[1400px] p-7 print:break-inside-avoid">
        <article
          className="snapshot mx-auto bg-[#fffdf9] border border-[#e5d9cd] overflow-hidden print:border-0 print:shadow-none shadow-sm"
          style={{ width: 1344 }}
        >
          {/* Accent ribbon */}
          <div className="flex h-1.5 w-full">
            <span className="flex-1" style={{ backgroundColor: PARTNER_ACCENTS.rust }} />
            <span className="flex-1" style={{ backgroundColor: PARTNER_ACCENTS.green }} />
            <span className="flex-1" style={{ backgroundColor: PARTNER_ACCENTS.blue }} />
            <span className="flex-1" style={{ backgroundColor: PARTNER_ACCENTS.ochreDeep }} />
          </div>

          {/* Topbar */}
          <header className="flex items-center justify-between gap-6 border-b border-[#e5d9cd] bg-white px-7 py-4">
            <Link href="/" className="leading-none">
              <span className="block font-display text-[26px]" style={{ color: '#282828' }}>
                Goods
              </span>
              <span className="block text-[9px] uppercase tracking-[0.24em] text-[#68635d] mt-1 font-semibold">
                On Country
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-[9px] uppercase tracking-[0.24em] text-[#68635d] font-semibold">
                Supported by
              </span>
              <div className="rounded-md bg-white px-3 py-1 border border-[#e5d9cd]">
                <Image
                  src={partner.logoSrc}
                  alt={partner.name}
                  width={400}
                  height={130}
                  className="h-9 w-auto object-contain"
                  priority
                />
              </div>
            </div>
          </header>

          {/* Main row: left feature + right content */}
          <div className="grid grid-cols-1 lg:grid-cols-[488px_minmax(0,1fr)] print:grid-cols-[488px_minmax(0,1fr)]">
            <LeftFeature partner={partner} />
            <RightContent partner={partner} outcomes={outcomes} />
          </div>
        </article>

        <FooterNote partner={partner} outcomes={outcomes} />
      </div>
    </main>
  );
}

function LeftFeature({ partner }: { partner: Partner }) {
  return (
    <aside className="bg-[#fffdf9] flex flex-col">
      <div className="relative w-full" style={{ aspectRatio: '488 / 560' }}>
        <Image
          src={partner.hero.imageSrc}
          alt={partner.hero.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 488px"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
        <p className="absolute bottom-3 left-4 right-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 leading-snug">
          {partner.hero.imageAlt}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5 border-t border-b border-[#e5d9cd] bg-[#f9f3ed] p-3.5">
        {partner.evidencePhotos.map((photo) => (
          <div key={photo.src} className="relative overflow-hidden border border-[#e5d9cd]" style={{ aspectRatio: '4 / 3' }}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 33vw, 145px"
            />
          </div>
        ))}
      </div>

      {partner.quote && (
        <figure
          className="flex-1 bg-[#fff8f0] border-l-[6px] px-6 py-7"
          style={{ borderLeftColor: partner.accent || PARTNER_ACCENTS.rust }}
        >
          <blockquote className="font-display text-[17px] leading-snug text-[#282828]">
            “{partner.quote.text}”
          </blockquote>
          <figcaption className="mt-3 text-[10px] leading-relaxed text-[#68635d]">
            {partner.quote.cite}
          </figcaption>
        </figure>
      )}
    </aside>
  );
}

function RightContent({ partner, outcomes }: { partner: Partner; outcomes: PartnerOutcomes }) {
  const accent = partner.accent || PARTNER_ACCENTS.rust;
  return (
    <section className="border-l border-[#e5d9cd] bg-white px-7 py-7 flex flex-col gap-3.5">
      <p
        className="text-[10px] font-bold uppercase tracking-[0.24em]"
        style={{ color: accent }}
      >
        {partner.hero.eyebrow}
      </p>
      <h1 className="font-display text-[44px] leading-[1.04] text-[#282828] whitespace-pre-line">
        {partner.hero.title}
      </h1>
      <p className="text-[13px] leading-[1.5] text-[#68635d]">
        {partner.hero.summary}
      </p>

      <KpiStrip outcomes={outcomes} />

      <VoiceThemes partner={partner} />

      <Measurement partner={partner} />

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-[#e5d9cd] pt-3 text-[9px] text-[#68635d]">
        <span>
          goodsoncountry.com/partners/{partner.slug} · goodsoncountry.com/contact
        </span>
        <span className="font-bold text-[#282828]">
          {partner.acknowledgement}
        </span>
      </div>
    </section>
  );
}

function KpiStrip({ outcomes }: { outcomes: PartnerOutcomes }) {
  const cells = [
    {
      value: String(outcomes.bedsDelivered),
      label: 'Beds delivered',
      body:
        outcomes.bedsDeliveredSource === 'live'
          ? 'Verified from the live community register.'
          : 'First Utopia Homelands delivery, October 2025.',
      color: PARTNER_ACCENTS.rust,
    },
    {
      value: outcomes.directPeople.display,
      label: 'Direct people supported',
      body: outcomes.directPeople.floor
        ? 'Conservative floor of one person per bed. Household reach to reconcile.'
        : 'Sum of household_size recorded by the field team at install.',
      color: PARTNER_ACCENTS.green,
    },
    {
      value: String(outcomes.nextRound),
      label: 'Next Stretch Beds',
      body:
        outcomes.nextRoundSource === 'live'
          ? 'Allocated and ready in the register, awaiting delivery.'
          : 'Next round measures household reach, product use and local production roles.',
      color: PARTNER_ACCENTS.blue,
    },
    {
      value: outcomes.setupTime,
      label: 'No-tools setup',
      body: 'Stretch Bed setup tracked via assembly feedback, missing parts and repair notes.',
      color: PARTNER_ACCENTS.ochreDeep,
    },
  ];

  return (
    <div className="grid grid-cols-4 bg-[#f6efe7] border border-[#e5d9cd]">
      {cells.map((cell, idx) => (
        <div
          key={cell.label}
          className={`flex flex-col gap-1.5 p-3.5 ${idx > 0 ? 'border-l border-[#e5d9cd]' : ''}`}
        >
          <span className="font-display text-[36px] leading-none" style={{ color: cell.color }}>
            {cell.value}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#282828]">
            {cell.label}
          </span>
          <p className="text-[9.5px] leading-[1.45] text-[#68635d]">{cell.body}</p>
        </div>
      ))}
    </div>
  );
}

function VoiceThemes({ partner }: { partner: Partner }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#282828] mb-2.5">
        Voice themes emerging
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {partner.themes.map((theme) => (
          <div
            key={theme.id}
            className="flex flex-col gap-1.5 border border-[#e5d9cd] bg-[#fbf7f1] px-3.5 py-3"
          >
            <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#282828]">
              {theme.label}
            </span>
            <p className="text-[10px] leading-[1.45] text-[#68635d]">{theme.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Measurement({ partner }: { partner: Partner }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#282828] mb-2">
        What we measure next
      </p>
      <ul className="list-none p-0 m-0">
        {partner.measurement.map((row, idx) => (
          <li
            key={row.label}
            className={`grid grid-cols-[148px_minmax(0,1fr)] gap-3.5 py-2 ${idx === 0 ? 'border-t' : ''} border-b border-[#e5d9cd]`}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#282828] leading-[1.4]">
              {row.label}
            </span>
            <span className="text-[10px] leading-[1.45] text-[#68635d]">{row.body}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterNote({ partner, outcomes }: { partner: Partner; outcomes: PartnerOutcomes }) {
  return (
    <p className="print:hidden mx-auto mt-6 max-w-[1344px] text-[11px] text-[#68635d]">
      <strong className="text-[#282828]">Live data:</strong> KPIs pull from {partner.communityIds.length}{' '}
      mapped community ID{partner.communityIds.length === 1 ? '' : 's'}{' '}
      ({outcomes.matchedCommunities.length} matched in the register). When the live count is zero, the
      partner&apos;s committed figures are used as a floor. Update the registry at{' '}
      <code className="text-[#282828]">v2/src/lib/data/partners.ts</code> to add a new funder.
    </p>
  );
}

function PrintStyles() {
  return (
    <style
      // eslint-disable-next-line react/no-unknown-property
      dangerouslySetInnerHTML={{
        __html: `
          @page { size: A4 landscape; margin: 8mm; }
          @media print {
            html, body { background: #ffffff !important; }
            .snapshot { width: 280mm !important; max-width: none !important; }
          }
        `,
      }}
    />
  );
}
