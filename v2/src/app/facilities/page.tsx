import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EnquiryForm } from '@/components/contact/enquiry-form';
import { CASE_STUDIES } from '@/lib/data/case-studies';
import { PANELS, STATIONS } from '@/lib/data/model-placemat';
import { ORGANISATION } from '@/lib/data/organisation';
import { GATES4, REQUEST_DETAIL } from '@/lib/data/pitch-chapters';
import { MAKE_STEPS } from '@/lib/data/story-spine';

/**
 * For a community, or an organisation working with one, deciding whether to make beds locally. What
 * a production facility is, what it brings, how it comes to a community (the four gates), what it
 * costs as a planning allowance, who decides, and a way to ask. Ben, 15 September 2026: the page
 * lives at /facilities. Words come from the placemat (model-placemat.ts), the gates and the request
 * detail (pitch-chapters.ts) and the make steps (story-spine.ts); nothing is signed and the page
 * says so. Ownership of the making is written as a pathway.
 */

export const metadata: Metadata = {
  title: 'Community production facilities',
  description: 'A production line that fits in shipping containers: local plastic in, beds out, paid local work. How a facility comes to a community that asks for one.',
};

const ALLOWANCE = REQUEST_DETAIL.scope.match(/A?\$[\d,]+/)?.[0]?.replace(/^A/, '') ?? '';

// The gate titles are the deck's; the details are written for any community that asks.
const FACILITY_GATES = [
  { title: GATES4[0].title, detail: 'The community organisation and Goods on Country agree who owns the beds, who is paid and who decides.' },
  { title: GATES4[1].title, detail: 'Site, power, shed and freight, costed in one quote. The community and the funder say yes before anything is bought.' },
  { title: GATES4[2].title, detail: 'Who buys the beds and who gets them is agreed before the line starts.' },
  { title: GATES4[3].title, detail: GATES4[3].detail },
] as const;

const BRINGS = (['employment', 'recycling', 'enterprise'] as const).map((id) => PANELS.find((p) => p.id === id)!);

const INTEREST_FIELDS = [
  { name: 'name', label: 'Your name', required: true, autoComplete: 'name', half: true },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', half: true },
  { name: 'organisation', label: 'Organisation', required: true, autoComplete: 'organization', half: true },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', half: true },
  { name: 'community', label: 'Community or town', required: true, hint: 'And the state.', half: true },
  { name: 'interest', label: 'What you are thinking about', type: 'select', required: true, options: ['Beds for our community first', 'A production facility', 'Both', 'Not sure yet'], half: true },
  { name: 'message', label: 'Tell us about the community', type: 'textarea', hint: 'Who is asking, what people are sleeping on now, and who might do the making.' },
] as const;

export default function FacilitiesPage() {
  const maningrida = CASE_STUDIES.find((c) => c.slug === 'maningrida');
  return (
    <main className="bg-goods-cream text-goods-ink">
      {/* Hero */}
      <section className="relative overflow-hidden bg-goods-ink text-goods-cream">
        <Image src="/images/process/factory-panorama.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-45" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-goods-ink via-goods-ink/60 to-goods-ink/20" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[78svh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:px-10 lg:px-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">Community production facilities</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-[-0.01em] text-balance md:text-7xl">Make the beds in your community.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-goods-cream/90 md:text-xl">A production line that fits in shipping containers. Local plastic goes in, beds come out, and the work is paid and local. A facility goes where a community is ready and asks.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#ask" className="inline-flex min-h-12 items-center rounded-full bg-goods-terracotta px-7 font-semibold text-white transition-colors hover:bg-[#a94f35]">
              Ask about a facility
            </a>
            <a href="#line" className="inline-flex min-h-12 items-center rounded-full border border-goods-cream/40 px-7 font-semibold text-goods-cream transition-colors hover:border-goods-cream">
              See the line
            </a>
          </div>
        </div>
      </section>

      {/* The line */}
      <section id="line" className="scroll-mt-20 px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">One line, four steps.</h2>
          <p className="mt-4 max-w-2xl text-lg text-[#4a4741]">The Goods on Country facility already runs this line and made the beds for the Maningrida run. A community facility is designed as the same line, run by local makers.</p>
          <div className="mt-10 flex justify-center rounded-[24px] border border-[#e6dfd1] bg-[#FDF8F3] px-6 py-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/model/kit/container-plant.svg" alt="Drawing of one container: shred, press, assemble" className="h-auto w-full max-w-3xl" />
          </div>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MAKE_STEPS.map((step, i) => (
              <li key={step.id}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
                  <Image src={step.photo.src} alt={step.photo.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                </div>
                <p className="mt-3 font-display text-lg font-semibold"><span className="mr-2 text-goods-terracotta">0{i + 1}</span>{step.title}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What it brings */}
      <section className="border-t border-[#e6dfd1] bg-[#FDF8F3] px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">What a facility brings.</h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {BRINGS.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-[22px] border border-[#e6dfd1] bg-white">
                <div className="relative aspect-[4/3] bg-goods-sand">
                  <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5E7A4C]">{p.title}</p>
                  <p className="mt-2 font-display text-xl font-semibold leading-snug">{p.line}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[#4a4741]">
            <span className="font-semibold text-goods-ink">{STATIONS.decide.title}</span> {STATIONS.decide.line}
          </p>
        </div>
      </section>

      {/* How it comes to a community */}
      <section className="px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">How a facility comes to a community.</h2>
          <p className="mt-4 max-w-2xl text-lg text-[#4a4741]">Four gates. Nothing moves until the one before it is settled.</p>
          <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {FACILITY_GATES.map((g, i) => (
              <li key={g.title} className="border-t-2 border-goods-terracotta pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Gate 0{i + 1}</p>
                <p className="mt-2 font-display text-2xl font-semibold leading-tight">{g.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#4a4741]">{g.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What it costs */}
      <section className="border-t border-[#e6dfd1] bg-goods-ink px-6 py-16 text-goods-cream md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">What it costs</p>
            <p className="mt-3 font-display text-6xl font-semibold leading-none md:text-7xl">{ALLOWANCE}</p>
            <p className="mt-3 text-goods-cream/80">a facility, as a planning allowance. No site has been quoted, and nothing is signed.</p>
          </div>
          <div className="space-y-5 text-[17px] leading-relaxed text-goods-cream/85">
            <p><span className="font-semibold text-goods-cream">{REQUEST_DETAIL.buys.title}.</span> {REQUEST_DETAIL.buys.line}</p>
            <p><span className="font-semibold text-goods-cream">Who pays.</span> The first two facilities are proposed for philanthropic funding, so the community would not carry the set-up cost. Sales money belongs to the community organisation that sells the bed.</p>
          </div>
        </div>
      </section>

      {/* Proof */}
      {maningrida && (
        <section className="px-6 py-16 md:px-10 md:py-24 lg:px-14">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-goods-sand">
              <Image src="/images/community/maningrida/men-over-finished-bed.jpg" alt="Men standing over a finished Stretch Bed, Maningrida" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Where it has worked</p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">{maningrida.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-[#4a4741]">{maningrida.standfirst}</p>
              <Link href={`/case-studies/${maningrida.slug}`} className="mt-6 inline-flex min-h-11 items-center rounded-full border border-goods-ink/25 px-5 text-sm font-semibold transition-colors hover:border-goods-ink">
                Read how the run worked
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Ask */}
      <section id="ask" className="scroll-mt-20 border-t border-[#e6dfd1] bg-[#FDF8F3] px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Ask about a facility</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">Start with a conversation.</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#4a4741]">A community can start with beds and decide later whether to make them locally. Tell us where you are and what people have asked for, and we will talk it through with you.</p>
            <p className="mt-6 text-[15px] leading-relaxed text-[#5d574c]">
              {ORGANISATION.identityLine} {ORGANISATION.boardLine} <Link href="/who-we-are" className="underline underline-offset-2">Who we are</Link>.
            </p>
          </div>
          <EnquiryForm
            kind="facilities"
            subject="Partnership Inquiry"
            fields={INTEREST_FIELDS}
            submitLabel="Send"
            sentTitle="Thank you."
            sentLine="Your message is with the Goods on Country team. A person will reply by email to set up a conversation."
          />
        </div>
      </section>
    </main>
  );
}
