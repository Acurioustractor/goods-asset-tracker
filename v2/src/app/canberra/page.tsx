import Image from 'next/image';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { FollowForm } from './follow-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Canberra Airport, Reconciliation Week 2026',
  description:
    'Made by community. Made for community. Beds, washing machines, and a manufacturing model that stays with the communities it serves.',
  openGraph: {
    title: 'Goods on Country at Canberra Airport',
    description:
      'Beds, washing machines, and a manufacturing model that stays with the communities it serves.',
  },
};

const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

export default async function CanberraPage() {
  const supabase = createServiceClient();

  const [bedsRes, sampleBedRes] = await Promise.all([
    supabase
      .from('assets')
      .select('unique_id', { count: 'exact', head: true })
      .in('product', ['Stretch Bed', 'Basket Bed']),
    supabase
      .from('assets')
      .select('unique_id, community')
      .eq('status', 'deployed')
      .eq('product', 'Stretch Bed')
      .not('community', 'is', null)
      .neq('community', 'Pending Delivery')
      .limit(50),
  ]);

  const bedCount = bedsRes.count ?? 0;
  // Confirmed-live washing machines per the 2026-05-14 roll-call reconciliation.
  // Source: wiki/outputs/2026-05-14-washing-machine-roll-call.md.
  // Update this when the roll-call is re-run after the next trip.
  const machineCount = 14;
  const sampleBeds = sampleBedRes.data || [];
  const sampleBed = sampleBeds[Math.floor(Math.random() * Math.max(sampleBeds.length, 1))] || null;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: CREAM, color: CHARCOAL }}
    >
      {/* Reconciliation Week marker */}
      <div
        className="w-full text-center text-[10px] sm:text-xs uppercase tracking-[0.2em] py-2.5"
        style={{ backgroundColor: CHARCOAL, color: CREAM }}
      >
        Canberra Airport · Reconciliation Week 2026
      </div>

      {/* Hero — photo + tagline */}
      <section className="px-5 sm:px-8 pt-8 sm:pt-14 pb-10 max-w-3xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-4"
          style={{ color: RUST }}
        >
          Goods on Country
        </p>
        <h1
          className="font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight mb-5"
          style={{ color: CHARCOAL }}
        >
          Made by community.<br />Made for community.
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed mb-8" style={{ color: `${CHARCOAL}cc` }}>
          Beds, washing machines, and a manufacturing model that stays with the communities it serves.
        </p>

        <div className="relative aspect-[4/5] sm:aspect-[3/2] w-full overflow-hidden rounded-3xl shadow-sm">
          <Image
            src="/images/product/washing-machine-hero.jpg"
            alt="Pakkimjalki Kari — washing machine on Country, named in Warumungu by Elder Dianne Stokes."
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        <p className="mt-3 text-sm" style={{ color: `${CHARCOAL}99` }}>
          Pakkimjalki Kari — named in Warumungu by Elder Dianne Stokes. Tennant Creek, 2025.
        </p>
      </section>

      {/* Stat strip */}
      <section className="px-5 sm:px-8 max-w-3xl mx-auto pb-12">
        <div
          className="rounded-3xl px-6 sm:px-8 py-7 sm:py-9 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
          style={{ backgroundColor: `${SAGE}1A`, border: `1px solid ${SAGE}33` }}
        >
          <Stat value={bedCount.toLocaleString()} label="beds across Australia" />
          <Stat value={machineCount.toLocaleString()} label="washing machines confirmed on Country" />
          <Stat value="8" label="communities" />
          <Stat value="20kg" label="of plastic diverted per bed" />
        </div>
      </section>

      {/* Story panel */}
      <section className="px-5 sm:px-8 max-w-2xl mx-auto pb-14">
        <h2 className="font-display text-2xl sm:text-3xl mb-4" style={{ color: CHARCOAL }}>
          The Stretch Bed.
        </h2>
        <p className="text-base sm:text-lg leading-relaxed mb-3" style={{ color: `${CHARCOAL}cc` }}>
          Recycled plastic, collected from communities, shredded and pressed into legs. Two galvanised
          steel poles. Heavy-duty Australian canvas. It clicks together in five minutes, with no tools,
          and holds 200kg. Designed to last more than ten years in remote Country, then to come apart
          for repair when it doesn&apos;t.
        </p>
        <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
          The bed you can sit on right now is one of more than 400 living in homes across Palm Island,
          Tennant Creek, Maningrida, Utopia Homelands, and beyond. Each has a QR code. Each has a story.
        </p>
      </section>

      {/* Follow a bed CTA */}
      {sampleBed && (
        <section className="px-5 sm:px-8 max-w-2xl mx-auto pb-14">
          <div
            className="rounded-3xl p-6 sm:p-8"
            style={{ backgroundColor: CHARCOAL, color: CREAM }}
          >
            <p
              className="text-xs uppercase tracking-[0.25em] mb-3"
              style={{ color: `${CREAM}99` }}
            >
              Follow one bed
            </p>
            <p className="font-display text-2xl sm:text-3xl mb-4 leading-tight">
              {sampleBed.unique_id} is living in {sampleBed.community}.
            </p>
            <p className="mb-6 text-base" style={{ color: `${CREAM}cc` }}>
              Open this bed&apos;s page to see where it came from, who it&apos;s with, and what comes next.
            </p>
            <Link
              href={`/bed/${sampleBed.unique_id}`}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-base font-semibold transition"
              style={{ backgroundColor: RUST, color: CREAM }}
            >
              Follow {sampleBed.unique_id} →
            </Link>
          </div>
        </section>
      )}

      {/* Capture form */}
      <section className="px-5 sm:px-8 max-w-2xl mx-auto pb-16">
        <h2 className="font-display text-2xl sm:text-3xl mb-2" style={{ color: CHARCOAL }}>
          Stay close to the story.
        </h2>
        <p className="text-sm sm:text-base mb-6" style={{ color: `${CHARCOAL}99` }}>
          Leave an email or a number. We&apos;ll share what happens next — new beds, new
          communities, new partnerships. No spam, ever.
        </p>
        <FollowForm />
      </section>

      {/* Communities served */}
      <section className="px-5 sm:px-8 max-w-3xl mx-auto pb-14">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-4"
          style={{ color: RUST }}
        >
          On-Country with
        </p>
        <p className="text-lg sm:text-xl leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
          Tennant Creek · Palm Island · Maningrida · Utopia Homelands · Mutitjulu · Alice Springs ·
          Darwin · Mount Isa · Kalgoorlie
        </p>
      </section>

      {/* Partner lockup */}
      <section
        className="px-5 sm:px-8 py-10 mt-6"
        style={{ backgroundColor: CHARCOAL, color: CREAM }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs uppercase tracking-[0.25em] mb-3"
            style={{ color: `${CREAM}99` }}
          >
            With thanks to
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Capital Airport Group · The Snow Foundation · A Curious Tractor · the families, Elders,
            and Ranger groups across the communities we work with.
          </p>
          <div
            className="mt-8 pt-6 text-xs flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            style={{ borderTop: `1px solid ${CREAM}22`, color: `${CREAM}88` }}
          >
            <p>Reconciliation Week · Canberra Airport · May 2026</p>
            <p>
              <a
                href="https://www.goodsoncountry.com"
                className="underline hover:no-underline"
                style={{ color: CREAM }}
              >
                goodsoncountry.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl sm:text-4xl leading-none" style={{ color: CHARCOAL }}>
        {value}
      </div>
      <div className="mt-2 text-xs sm:text-sm leading-snug" style={{ color: `${CHARCOAL}99` }}>
        {label}
      </div>
    </div>
  );
}
