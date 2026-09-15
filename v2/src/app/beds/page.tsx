import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EnquiryForm } from '@/components/contact/enquiry-form';
import { canonValue } from '@/lib/data/canon';
import { ORGANISATION } from '@/lib/data/organisation';
import { BUYERS } from '@/lib/data/pitch-chapters';
import { PLASTIC_KG_PER_BED, STRETCH_BED } from '@/lib/data/products';
import { SHOP_ANSWERS } from '@/lib/data/shop';
import { PAID_BEDS } from '@/lib/data/story-questions';

/**
 * Buying beds, for anyone who lands here: a household buying one, or an organisation buying for a
 * community. Two ways in (online by card, or an order the team quotes and invoices), how an
 * organisation order runs, who has already bought, the straight answers, and who you are buying
 * from. Ben, 15 September 2026: $750 a bed with freight quoted by destination; the page lives at
 * /beds and /shop stays the product list. Every figure comes from canon, products.ts or
 * pitch-chapters.ts BUYERS; every answer from shop.ts.
 */

export const metadata: Metadata = {
  title: 'Buy Stretch Beds',
  description: `The Stretch Bed, $${canonValue('stretch-price')} a bed. Buy one online, or order for your organisation: we quote freight, invoice, and plan delivery with you.`,
};

const PRICE = canonValue('stretch-price');

const PARTS = [
  { title: 'Recycled plastic legs', line: `Two crossed X-legs pressed from about ${PLASTIC_KG_PER_BED} kg of recycled HDPE.`, src: '/images/pitch/bed-frame-legs.jpg' },
  { title: 'Galvanised steel poles', line: 'Two poles thread through the canvas sleeves and the top holes of the legs.', src: '/images/pitch/bed-poles.jpg' },
  { title: 'Heavy-duty canvas', line: 'Pulled tight, the canvas is the structure. It washes, and it can be replaced.', src: '/images/pitch/bed-canvas.jpg' },
] as const;

const ORDER_STEPS = [
  { title: 'Tell us', line: 'How many beds, which community they are going to, and when you need them.' },
  { title: 'Get a quote', line: `$${PRICE} a bed, and freight to your community quoted by destination.` },
  { title: 'Invoice or purchase order', line: 'We invoice your organisation, or work from your purchase order.' },
  { title: 'Made in a batch', line: 'Beds are made in batches. We confirm your dispatch window when you order.' },
  { title: 'Delivered flat-packed', line: 'We plan delivery and assembly with you and the people who will sleep on the beds.' },
  { title: 'Looked after', line: 'Every bed carries a QR code. Scan it to report a problem and we arrange the repair.' },
] as const;

const ORDER_FIELDS = [
  { name: 'name', label: 'Your name', required: true, autoComplete: 'name', half: true },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', half: true },
  { name: 'organisation', label: 'Organisation', required: true, autoComplete: 'organization', half: true },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', half: true },
  { name: 'beds', label: 'How many beds', type: 'number', required: true, half: true },
  { name: 'community', label: 'Where they are going', required: true, hint: 'Community or town, and state.', half: true },
  { name: 'when', label: 'When you need them', type: 'select', options: ['As soon as we can', 'Within three months', 'Within six months', 'Later, we are planning'], half: true },
  { name: 'paying', label: 'How you will pay', type: 'select', options: ['Invoice', 'Purchase order', 'Grant-funded', 'Not sure yet'], half: true },
  { name: 'message', label: 'Anything we should know', type: 'textarea', hint: 'Delivery, assembly, the homes the beds are for.' },
] as const;

const PROOF = [
  { src: '/images/product/stretch-bed-community.jpg', alt: 'An Elder standing beside an assembled Stretch Bed on red dirt' },
  { src: '/images/community/maningrida/men-over-finished-bed.jpg', alt: 'Men standing over a finished Stretch Bed, Maningrida' },
  { src: '/images/stories/utopia/09-offground.jpg', alt: 'A Stretch Bed in use, up off the ground, Utopia Homelands' },
] as const;

export default function BedsPage() {
  return (
    <main className="bg-goods-cream text-goods-ink">
      {/* Hero */}
      <section className="px-6 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20 lg:px-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">The Stretch Bed · ${PRICE} a bed</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-[-0.01em] text-balance md:text-7xl">Beds off the floor, built to last.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#4a4741] md:text-xl">
              For a home, a community or a whole organisation. Flat-packed, built in {STRETCH_BED.specs.assemblyTime.replace('~', 'about ')} with no tools, and made with recycled plastic.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop/stretch-bed-single" className="inline-flex min-h-12 items-center rounded-full bg-goods-terracotta px-7 text-base font-semibold text-white transition-colors hover:bg-[#a94f35]">
                Buy online
              </Link>
              <a href="#order" className="inline-flex min-h-12 items-center rounded-full border border-goods-ink/25 px-7 text-base font-semibold transition-colors hover:border-goods-ink">
                Order for your organisation
              </a>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3">
            <div className="relative col-span-3 aspect-[4/5] overflow-hidden rounded-[22px] bg-goods-sand">
              <Image src="/images/product/stretch-bed-hero.jpg" alt="A Stretch Bed on Country in golden light" fill priority sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover" />
            </div>
            <div className="col-span-2 grid gap-3">
              <div className="relative overflow-hidden rounded-[22px] bg-goods-sand">
                <Image src="/images/pitch/bed-assembled.jpg" alt="A Stretch Bed assembled" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-[22px] bg-goods-sand">
                <Image src="/images/community/alice-springs/stretch-bed-kids-pile.jpg" alt="Young people with a Stretch Bed in Alice Springs" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        <dl className="mx-auto mt-14 grid max-w-6xl gap-6 border-t border-[#e6dfd1] pt-8 sm:grid-cols-3">
          <div>
            <dt className="font-display text-4xl font-semibold">{PAID_BEDS}</dt>
            <dd className="mt-1 text-sm text-[#5d574c]">beds bought and paid for by four organisations</dd>
          </div>
          <div>
            <dt className="font-display text-4xl font-semibold">{STRETCH_BED.specs.loadCapacity}</dt>
            <dd className="mt-1 text-sm text-[#5d574c]">load, on {STRETCH_BED.specs.weight} of bed</dd>
          </div>
          <div>
            <dt className="font-display text-4xl font-semibold">QR</dt>
            <dd className="mt-1 text-sm text-[#5d574c]">on every bed, to report a problem and get it fixed</dd>
          </div>
        </dl>
      </section>

      {/* The bed */}
      <section className="border-t border-[#e6dfd1] bg-[#FDF8F3] px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Three parts. No tools.</h2>
          <p className="mt-4 max-w-2xl text-lg text-[#4a4741]">{STRETCH_BED.specs.dimensions}. The canvas carries the load, so the bed only stands when it is pulled tight.</p>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {PARTS.map((p) => (
              <li key={p.title} className="overflow-hidden rounded-[22px] border border-[#e6dfd1] bg-white">
                <div className="relative aspect-[4/3] bg-goods-sand">
                  <Image src={p.src} alt={p.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="font-display text-xl font-semibold">{p.title}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#4a4741]">{p.line}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[#5d574c]">
            Want to see it go together? <Link href="/stretch-bed" className="underline underline-offset-2">Watch a bed built, step by step</Link>.
          </p>
        </div>
      </section>

      {/* Two ways to buy */}
      <section className="px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Two ways to buy.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="flex flex-col rounded-[24px] border border-[#e6dfd1] bg-white p-7 md:p-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">One to nine beds</p>
              <p className="mt-3 font-display text-3xl font-semibold">Buy online</p>
              <p className="mt-3 flex-1 text-[16px] leading-relaxed text-[#4a4741]">Pay by card and give the delivery address at checkout. ${PRICE} a bed; freight is quoted by destination. Good for a household, or a few beds for a family.</p>
              <Link href="/shop/stretch-bed-single" className="mt-6 inline-flex min-h-12 w-fit items-center rounded-full bg-goods-ink px-6 font-semibold text-goods-cream transition-colors hover:bg-goods-terracotta">
                Go to the shop
              </Link>
            </div>
            <div className="flex flex-col rounded-[24px] bg-goods-ink p-7 text-goods-cream md:p-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">Ten or more</p>
              <p className="mt-3 font-display text-3xl font-semibold">Order for your organisation</p>
              <p className="mt-3 flex-1 text-[16px] leading-relaxed text-goods-cream/85">For health services, schools, housing providers, councils and community organisations. We quote beds and freight, invoice your organisation, and plan delivery with you.</p>
              <a href="#order" className="mt-6 inline-flex min-h-12 w-fit items-center rounded-full bg-goods-terracotta px-6 font-semibold text-white transition-colors hover:bg-[#a94f35]">
                Start an order
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How an organisation order works */}
      <section className="border-t border-[#e6dfd1] bg-[#FDF8F3] px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">How an organisation order works.</h2>
          <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {ORDER_STEPS.map((s, i) => (
              <li key={s.title} className="border-t-2 border-goods-terracotta pt-4">
                <p className="font-display text-lg font-semibold text-goods-terracotta">0{i + 1}</p>
                <p className="mt-1 font-display text-2xl font-semibold">{s.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#4a4741]">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who has bought */}
      <section className="px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Who has bought.</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#4a4741]">{BUYERS.who.split('.')[0]}.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#5d574c]">
              A community organisation that wants beds to sell? <Link href="/sell-beds" className="font-semibold text-goods-ink underline underline-offset-2">100 beds for your community to sell</Link>.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {PROOF.map((p) => (
                <div key={p.src} className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-goods-sand">
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 15vw, 33vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <ul className="divide-y divide-[#e6dfd1] rounded-[24px] border border-[#e6dfd1] bg-white px-6">
            {BUYERS.rows.map((r) => (
              <li key={r.buyer} className="grid grid-cols-[1fr_auto] gap-4 py-5">
                <div>
                  <p className="font-display text-xl font-semibold leading-tight">{r.buyer}</p>
                  <p className="mt-1 text-sm leading-snug text-[#5d574c]">{r.line}</p>
                </div>
                <p className="font-display text-3xl font-semibold tabular-nums">{r.beds}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The straight answers */}
      <section className="border-t border-[#e6dfd1] bg-[#FDF8F3] px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">The straight answers.</h2>
          <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {SHOP_ANSWERS.map((a) => (
              <div key={a.question} className="border-t border-[#e6dfd1] pt-4">
                <dt className="font-display text-xl font-semibold">{a.question}</dt>
                <dd className="mt-2 text-[16px] leading-relaxed text-[#4a4741]">{a.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The order */}
      <section id="order" className="scroll-mt-24 bg-goods-ink px-6 py-16 text-goods-cream md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">Order for your organisation</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">Tell us what you need.</h2>
            <p className="mt-4 text-lg leading-relaxed text-goods-cream/85">We come back with a quote for the beds and freight to your community, and a dispatch window. Nothing is charged until you accept the quote.</p>
          </div>
          <EnquiryForm
            dark
            kind="beds"
            subject="Bulk Order Inquiry"
            fields={ORDER_FIELDS}
            submitLabel="Request a quote"
            sentTitle="Thank you."
            sentLine="Your order request is with the Goods on Country team. We will reply by email with a quote and a dispatch window."
          />
        </div>
      </section>

      {/* Who you are buying from */}
      <section className="px-6 py-16 md:px-10 md:py-20 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Who you are buying from</p>
            <p className="mt-3 font-display text-3xl font-semibold leading-tight">{ORGANISATION.boardLine}</p>
            <p className="mt-4 text-[16px] leading-relaxed text-[#4a4741]">
              {ORGANISATION.identityLine} ABN {ORGANISATION.abn}. {ORGANISATION.charityLine}
            </p>
            <Link href="/who-we-are" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-goods-ink/25 px-5 text-sm font-semibold transition-colors hover:border-goods-ink">
              Meet the board and the team
            </Link>
          </div>
          <div className="grid gap-4">
            <Link href="/facilities" className="group rounded-[22px] border border-[#e6dfd1] bg-white p-6 transition-colors hover:border-goods-terracotta">
              <p className="font-display text-2xl font-semibold">Want the beds made in your community?</p>
              <p className="mt-2 text-[15px] text-[#4a4741]">How a production facility comes to a community that asks for one.</p>
            </Link>
            <Link href="/sponsor" className="group rounded-[22px] border border-[#e6dfd1] bg-white p-6 transition-colors hover:border-goods-terracotta">
              <p className="font-display text-2xl font-semibold">Buying for someone else?</p>
              <p className="mt-2 text-[15px] text-[#4a4741]">Sponsor a bed for a family in a remote community.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
