import Image from 'next/image';
import Link from 'next/link';
import { CREAM, RUST, CHARCOAL, SAGE } from './palette';
import SponsorForm from './SponsorForm';
import NewsletterCapture from './NewsletterCapture';

// Server component: the narrative shell (hero, journey, gallery, CTA) renders
// server-side so the page is never empty for crawlers or before hydration.
// Pricing and the cart live in SponsorForm — prices come only from
// Stripe/Supabase via /api/products, never hardcoded here.

// Real photos from Country (local assets — relative paths so next/image serves
// them from the same origin without a remotePatterns entry). Hero anchors the
// page with a real person; the gallery walks the journey: made -> delivered -> used.
const HERO_IMAGE = {
  src: '/images/product/stretch-bed-community.jpg',
  alt: 'An Elder standing beside her Stretch Bed on Country',
};
const GALLERY = [
  {
    src: '/images/product/stretch-bed-kids-building.jpg',
    alt: 'Kids assembling a Stretch Bed from recycled-plastic legs',
    caption: 'Built on Country, from recycled plastic.',
  },
  {
    src: '/images/product/stretch-bed-assembly.jpg',
    alt: 'Stretching the canvas over the steel-and-plastic frame',
    caption: 'Up in about five minutes. No tools.',
  },
  {
    src: '/images/product/stretch-bed-in-use.jpg',
    alt: 'Resting on a Stretch Bed, up off the ground',
    caption: 'A washable bed, up off the ground.',
  },
];

export default function SponsorPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      {/* Hero */}
      <section className="px-5 sm:px-8 pt-12 sm:pt-16 pb-8 max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: RUST }}>
          Buy a bed for community
        </p>
        <h1
          className="font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight mb-5"
          style={{ color: CHARCOAL }}
        >
          Sponsor a bed.
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: `${CHARCOAL}cc` }}>
          One Stretch Bed, into one home that needs it, in a community you can choose.
          We deliver. We log the bed under a QR code. You can follow exactly where it lands.
        </p>
      </section>

      {/* Hero image — anchors the page in a real bed, in a real community */}
      <section className="px-5 sm:px-8 max-w-4xl mx-auto pb-10">
        <figure className="relative aspect-[3/2] sm:aspect-[16/9] rounded-3xl overflow-hidden" style={{ backgroundColor: `${CHARCOAL}10` }}>
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </figure>
      </section>

      {/* Product card + community/quantity/dedication form + summary (client) */}
      <SponsorForm />

      {/* How it works */}
      <section className="px-5 sm:px-8 py-14 sm:py-16" style={{ backgroundColor: `${SAGE}1A`, borderTop: `1px solid ${SAGE}33`, borderBottom: `1px solid ${SAGE}33` }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: RUST }}>
              The journey
            </p>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight" style={{ color: CHARCOAL }}>
              How sponsorship works.
            </h2>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {[
              {
                num: '1',
                title: 'You sponsor',
                description: 'Choose how many beds and which community. Pay through Stripe.',
              },
              {
                num: '2',
                title: 'We allocate',
                description: 'A bed from the next production run gets tagged for your community and your name.',
              },
              {
                num: '3',
                title: 'It lands on Country',
                description: "When the bed reaches the home, we send you the QR-code link so you can see exactly where it went.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 font-display text-2xl"
                  style={{ backgroundColor: CHARCOAL, color: CREAM }}
                >
                  {step.num}
                </div>
                <h3 className="font-display text-xl mb-2" style={{ color: CHARCOAL }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where beds land — real photos from Country */}
      <section className="px-5 sm:px-8 py-14 sm:py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: RUST }}>
            On Country
          </p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight" style={{ color: CHARCOAL }}>
            This is where your bed lands.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {GALLERY.map((img) => (
            <figure key={img.src} className="space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden" style={{ backgroundColor: `${CHARCOAL}10` }}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <figcaption className="text-sm text-center sm:text-left" style={{ color: `${CHARCOAL}99` }}>
                {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-5 sm:px-8 py-14 sm:py-20 text-center" style={{ backgroundColor: CHARCOAL, color: CREAM }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-4">
            Every bed has a story.<br />Be part of the next one.
          </h2>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: `${CREAM}99` }}>
            When you sponsor, you&apos;ll get updates and photos as the bed reaches its new home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/stories"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition"
              style={{ border: `1px solid ${CREAM}66`, color: CREAM }}
            >
              Read community stories
            </Link>
            <Link
              href="/shop/stretch-bed-single"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition"
              style={{ border: `1px solid ${CREAM}66`, color: CREAM }}
            >
              Or buy one for yourself
            </Link>
          </div>
        </div>
      </section>

      {/* Not ready today? — newsletter funnel for non-converters (client) */}
      <NewsletterCapture />
    </main>
  );
}
