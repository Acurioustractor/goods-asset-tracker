import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { STRETCH_BED } from '@/lib/data/products';

const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';
const PAGE_TITLE = 'Goods on Country and Centrecorp Foundation Partnership';
const PAGE_DESCRIPTION =
  'Goods on Country recognises Centrecorp Foundation support for A Curious Tractor, Oonchiumpa and Utopia Homelands bed delivery work in Central Australia.';
const PAGE_URL = 'https://www.goodsoncountry.com/partners/centrecorp';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'Goods on Country Centrecorp',
    'Centrecorp Foundation Goods on Country',
    'A Curious Tractor Centrecorp',
    'Utopia Homelands beds',
    'Oonchiumpa Good News Story',
    'Central Australia bed delivery',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: 'article',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const stats = [
  {
    value: '60',
    label: 'First Utopia beds',
    detail: 'Delivered successfully on 7, 8 and 9 October 2025 with community partners.',
  },
  {
    value: '107',
    label: 'Next round',
    detail: 'Upcoming Stretch Bed delivery round, with photos and stories to come after the trip.',
  },
  {
    value: 'Oonchiumpa',
    label: 'Community partner',
    detail: 'Local partner pathway for cultural guidance, delivery support and community feedback.',
  },
  {
    value: STRETCH_BED.specs.assemblyTime,
    label: 'Stretch Bed setup',
    detail: 'The next round uses the current no-tools Stretch Bed model.',
    imageSrc: '/images/partners/centrecorp/stretch-bed-stat.jpg',
    imageAlt: 'A person sitting on a finished Stretch Bed outdoors',
  },
];

const voices = [
  {
    quote:
      'That is something Central Australia need.',
    name: 'Fred Campbell',
    context: 'Youth Case Worker, Oonchiumpa',
  },
  {
    quote:
      'From the waste, plastic. Perfect. That is really a perfect idea.',
    name: 'Jacqueline',
    context: 'Central Australia product feedback',
  },
];

const photos = [
  {
    src: '/images/partners/centrecorp/utopia/delivery-court.jpg',
    alt: 'Boxes, bed parts and a finished mattress staged under a shaded court at Utopia Homelands',
  },
  {
    src: '/images/partners/centrecorp/utopia/unpacking-parts.jpg',
    alt: 'Community members unpacking black recycled plastic bed parts on red dirt',
  },
  {
    src: '/images/partners/centrecorp/utopia/community-build.jpg',
    alt: 'People assembling a bed base under trees in Utopia Homelands',
  },
  {
    src: '/images/partners/centrecorp/utopia/verandah-test.jpg',
    alt: 'A family testing a newly delivered bed on a verandah',
  },
  {
    src: '/images/partners/centrecorp/utopia/home-setup.jpg',
    alt: 'A bed set up outside a home at Utopia Homelands',
  },
  {
    src: '/images/partners/centrecorp/utopia/finished-bed-country.jpg',
    alt: 'A finished bed on Country beside a remote home',
  },
];

const videoBreaks = {
  delivery: {
    src: '/video/partners/centrecorp/utopia-bed-building.mp4',
    poster: '/video/partners/centrecorp/utopia-bed-building-poster.jpg',
  },
  setup: {
    src: '/video/partners/centrecorp/utopia-community-setup.mp4',
    poster: '/video/partners/centrecorp/utopia-community-setup-poster.jpg',
  },
} as const;

const goodNewsStory = [
  'A Curious Tractor, in partnership with Oonchiumpa Consultancy & Services, is proud to support our remote communities by building and delivering Goods Beds to community members in Alparra and Ampilatwatja who are less fortunate.',
  'We are honoured to share that respected Elders Frank and Casey Holmes from Antarrengeny since contacted and have expressed they are very grateful. They told us that since receiving their new beds, they are no longer experiencing back pains. Their words remind us why this work matters.',
  'We look forward to continuing this strong partnership and remain committed to improving comfort, dignity, and wellbeing across our remote communities.',
];

function StatCard({ value, label, detail, imageSrc, imageAlt }: (typeof stats)[number]) {
  return (
    <div className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
      <p className="font-display text-3xl sm:text-4xl leading-none mb-2" style={{ color: RUST }}>
        {value}
      </p>
      <p className="text-sm font-semibold uppercase mb-2" style={{ color: CHARCOAL }}>
        {label}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}b3` }}>
        {detail}
      </p>
      {imageSrc ? (
        <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-md">
          <Image
            src={imageSrc}
            alt={imageAlt ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 240px"
          />
        </div>
      ) : null}
    </div>
  );
}

function QuoteCard({ quote, name, context }: (typeof voices)[number]) {
  return (
    <figure className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
      <blockquote className="font-display text-xl leading-snug mb-5" style={{ color: CHARCOAL }}>
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption>
        <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>
          {name}
        </p>
        <p className="text-xs uppercase mt-1" style={{ color: SAGE }}>
          {context}
        </p>
      </figcaption>
    </figure>
  );
}

function PhotoCard({ src, alt }: (typeof photos)[number]) {
  return (
    <figure
      className="overflow-hidden rounded-lg bg-white"
      style={{ border: '1px solid #E8DED4' }}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"
        />
      </div>
    </figure>
  );
}

function VideoBreak({ src, poster }: (typeof videoBreaks)[keyof typeof videoBreaks]) {
  return (
    <section className="relative isolate min-h-[360px] overflow-hidden sm:min-h-[430px]">
      <video
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
    </section>
  );
}

export default function CentrecorpPartnershipPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      <section className="px-5 sm:px-8 pt-12 sm:pt-16 pb-12 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <Link href="/" className="inline-flex flex-col leading-none">
            <span className="font-display text-3xl sm:text-4xl" style={{ color: CHARCOAL }}>
              Goods
            </span>
            <span className="text-[10px] sm:text-xs uppercase mt-1" style={{ color: `${CHARCOAL}99` }}>
              On Country
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase" style={{ color: `${CHARCOAL}80` }}>
              Supported by
            </span>
            <div className="rounded-lg bg-white px-4 py-3 shadow-sm" style={{ border: '1px solid #E8DED4' }}>
              <Image
                src="/images/partners/centrecorp-foundation.jpg"
                alt="Centrecorp Foundation"
                width={400}
                height={250}
                priority
                className="h-12 w-auto"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_0.82fr] gap-8 lg:gap-12 items-center">
          <div>
            <p className="text-xs uppercase mb-4" style={{ color: RUST }}>
              Central Australia partnership
            </p>
            <h1 className="font-display text-4xl sm:text-6xl leading-[1.04] mb-6" style={{ color: CHARCOAL }}>
              Beds for Utopia Homelands.
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-6" style={{ color: `${CHARCOAL}cc` }}>
              Centrecorp Foundation support helped the first Utopia Homelands bed delivery take shape
              with community partners, and now supports the next Stretch Bed round.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: `${CHARCOAL}b3` }}>
              The work aligns with Centrecorp Foundation&apos;s focus on practical, ongoing benefit for
              Aboriginal people in Central Australia: practical household infrastructure, delivered with
              local guidance, community feedback and follow-up.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop/stretch-bed-single"
                className="inline-flex rounded-lg px-5 py-3 text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: CHARCOAL, color: CREAM }}
              >
                The Stretch Bed
              </Link>
              <Link
                href="/contact"
                className="inline-flex rounded-lg px-5 py-3 text-sm font-semibold transition hover:opacity-90"
                style={{ color: CHARCOAL, border: `1px solid ${CHARCOAL}33` }}
              >
                Contact Goods
              </Link>
            </div>
          </div>

          <figure className="overflow-hidden rounded-lg shadow-sm" style={{ border: '1px solid #E8DED4' }}>
            <div className="relative aspect-[4/5] sm:aspect-[3/4]">
              <Image
                src="/images/partners/centrecorp/utopia/hero-elder-bed.jpg"
                alt="Two people sitting on a bed during the Utopia Homelands delivery"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-14 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <VideoBreak {...videoBreaks.delivery} />

      <section className="px-5 sm:px-8 py-14 max-w-5xl mx-auto">
        <div className="max-w-2xl mb-8">
          <p className="text-xs uppercase mb-4" style={{ color: RUST }}>
            Photo record
          </p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-4" style={{ color: CHARCOAL }}>
            Utopia Homelands, October 2025.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <PhotoCard key={photo.src} {...photo} />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-14" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase mb-4" style={{ color: RUST }}>
            Oonchiumpa Good News Story
          </p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-6" style={{ color: CHARCOAL }}>
            Good News Story from Oonchiumpa
          </h2>
          <div className="grid gap-4 text-base leading-relaxed" style={{ color: `${CHARCOAL}bf` }}>
            {goodNewsStory.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-14 max-w-5xl mx-auto">
        <div className="max-w-2xl mb-8">
          <p className="text-xs uppercase mb-4" style={{ color: RUST }}>
            Source video
          </p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight" style={{ color: CHARCOAL }}>
            Oonchiumpa Good News Story video.
          </h2>
        </div>
        <div className="overflow-hidden rounded-lg bg-black shadow-sm" style={{ border: '1px solid #E8DED4' }}>
          <video
            controls
            playsInline
            preload="metadata"
            poster="/video/partners/centrecorp/utopia-good-news-full-poster.jpg"
            className="aspect-video w-full bg-black"
          >
            <source src="/video/partners/centrecorp/utopia-good-news-full.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <VideoBreak {...videoBreaks.setup} />

      <section className="px-5 sm:px-8 py-14 max-w-5xl mx-auto" style={{ backgroundColor: CREAM }}>
        <div className="max-w-2xl mb-8">
          <p className="text-xs uppercase mb-4" style={{ color: RUST }}>
            Community voices
          </p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-4" style={{ color: CHARCOAL }}>
            The feedback is simple: beds change daily life.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: `${CHARCOAL}bf` }}>
            These voices come from the Central Australia and Oonchiumpa pathway connected to the
            Utopia Homelands work.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {voices.map((voice) => (
            <QuoteCard key={voice.name} {...voice} />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-14 max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase mb-4" style={{ color: RUST }}>
          Recognition
        </p>
        <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-5" style={{ color: CHARCOAL }}>
          Thank you to Centrecorp Foundation.
        </h2>
        <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: `${CHARCOAL}bf` }}>
          Goods on Country and A Curious Tractor acknowledge Centrecorp Foundation&apos;s support for
          practical bed infrastructure in Central Australia.
        </p>
        <a
          href="https://www.centrecorpfoundation.com.au/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-lg px-5 py-3 text-sm font-semibold transition hover:opacity-90"
          style={{ color: CHARCOAL, border: `1px solid ${CHARCOAL}33` }}
        >
          Visit Centrecorp Foundation
        </a>
      </section>
    </main>
  );
}
