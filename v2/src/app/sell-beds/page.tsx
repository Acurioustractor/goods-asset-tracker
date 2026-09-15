import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EnquiryForm } from '@/components/contact/enquiry-form';
import { canonValue } from '@/lib/data/canon';
import { RAISE, SHEET, STATIONS } from '@/lib/data/model-placemat';
import { ORGANISATION } from '@/lib/data/organisation';

/**
 * For a community organisation that wants beds to sell. Ben, 16 September 2026: some beds are
 * bought outright by health services, schools and families (/beds); some go to community
 * organisations as stock, and that is this page, kept apart so a buyer is never told they are
 * reselling. The model is the placemat's (model-placemat.ts: RAISE.bedsFor, STATIONS.orgs, money,
 * decide) and the answers in story-questions.ts (who-gets-a-bed, sells-none, what-org-does-with-money,
 * what-goods-keeps, anything-signed), rewritten for the organisation reading it. Nothing is signed
 * (RAISE.signedAud) and the page says so before anyone fills in the form.
 */

const PRICE = canonValue('stretch-price');

export const metadata: Metadata = {
  title: 'Sell beds in your community',
  description: `${RAISE.bedsEach} Stretch Beds for a community organisation to sell or give out. Customers pay your organisation, and it keeps the whole $${PRICE} a bed.`,
};

const STEPS = [
  {
    title: 'The beds come to you',
    line: `Philanthropy pays for the stock. Goods on Country makes ${RAISE.bedsEach} Stretch Beds and gets them to your organisation, freight paid.`,
  },
  {
    title: 'You set the rules',
    line: 'Before any bed moves, your organisation agrees who gets beds, who sells them, who is paid and where the money goes.',
  },
  {
    title: 'Customers pay you',
    line: `Health services, schools, housing providers and families buy from your organisation. You invoice them and keep the whole $${PRICE}.`,
  },
  {
    title: 'You decide what comes next',
    line: `${STATIONS.decide.line.replace('making their own', 'making your own')}`,
  },
] as const;

const ANSWERS = [
  {
    q: 'Do we pay for the beds?',
    a: 'No. Philanthropy pays for the first stock. Your organisation holds the beds and the money they sell for.',
  },
  {
    q: 'Do we have to sell all of them?',
    a: 'No. Some beds go to families who need one tonight, and that mix is your call. We agree the rules first, so the choice is made on purpose and everyone knows what follows.',
  },
  {
    q: 'Does any money come back to Goods on Country?',
    a: 'No. The buyer pays your organisation. Goods on Country is paid for making the stock, and its running costs are raised separately.',
  },
  {
    q: 'Who owns the beds?',
    a: 'Your organisation holds its beds, its sales money and its decisions. Goods on Country holds the design and the making today. Moving the making into community is a pathway, and a production facility is the step after beds when a community asks.',
  },
  {
    q: 'Would our organisation have a say in Goods on Country?',
    a: `${ORGANISATION.membership.line} ${ORGANISATION.membership.why} ${ORGANISATION.membership.state}`,
  },
  {
    q: 'Is the money there now?',
    a: `We are raising it for the first ${RAISE.bedsYearOne} beds, ${RAISE.bedsEach} for each of ${RAISE.communityOrganisations} community organisations. Nothing is signed yet, so tell us early.`,
  },
] as const;

const INTEREST_FIELDS = [
  { name: 'name', label: 'Your name', required: true, autoComplete: 'name', half: true },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', half: true },
  { name: 'organisation', label: 'Organisation', required: true, autoComplete: 'organization', half: true },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', half: true },
  { name: 'community', label: 'Community or town', required: true, hint: 'And the state.', half: true },
  { name: 'beds', label: 'How many beds', type: 'select', required: true, options: [`${RAISE.bedsEach} beds`, 'Fewer to start', `More than ${RAISE.bedsEach}`, 'Not sure yet'], half: true },
  { name: 'buyers', label: 'Who would buy them', type: 'textarea', hint: 'The services, schools, housing providers or families near you who need beds.' },
  { name: 'message', label: 'Anything else we should know', type: 'textarea', hint: 'Who would hold the stock, who might sell, and what people are sleeping on now.' },
] as const;

export default function SellBedsPage() {
  return (
    <main className="bg-goods-cream text-goods-ink">
      {/* Hero */}
      <section className="px-6 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20 lg:px-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">For community organisations</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-[-0.01em] text-balance md:text-7xl">{RAISE.bedsEach} beds for your community to sell.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#4a4741] md:text-xl">
              Philanthropy pays for the beds. Your organisation holds them, sells them or gives them out under rules you set, and keeps the whole ${PRICE} for every bed it sells.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#ask" className="inline-flex min-h-12 items-center rounded-full bg-goods-terracotta px-7 text-base font-semibold text-white transition-colors hover:bg-[#a94f35]">
                Tell us you are interested
              </a>
              <a href="#how" className="inline-flex min-h-12 items-center rounded-full border border-goods-ink/25 px-7 text-base font-semibold transition-colors hover:border-goods-ink">
                How it works
              </a>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3">
            <div className="relative col-span-3 aspect-[4/5] overflow-hidden rounded-[22px] bg-goods-sand">
              <Image src="/images/community/alice-springs/oonchiumpa-team-red-bed.jpg" alt="The Oonchiumpa team with a red Stretch Bed in Alice Springs" fill priority sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover" />
            </div>
            <div className="col-span-2 grid gap-3">
              <div className="relative overflow-hidden rounded-[22px] bg-goods-sand">
                <Image src="/images/stories/utopia/08-beforeafter.jpg" alt="An Elder and a young man on a Stretch Bed, Utopia Homelands" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-[22px] bg-goods-sand">
                <Image src="/images/product/stretch-bed-community.jpg" alt="An Elder standing beside an assembled Stretch Bed on red dirt" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-6xl border-t border-[#e6dfd1] pt-6 text-[15px] leading-relaxed text-[#5d574c]">
          <span className="font-semibold text-goods-ink">Where this is up to.</span> We are raising the money for the first {RAISE.bedsYearOne} beds, {RAISE.bedsEach} for each of {RAISE.communityOrganisations} community organisations. Nothing is signed yet.
          {' '}Buying beds for your own service instead? <Link href="/beds" className="font-semibold text-goods-ink underline underline-offset-2">Buy beds</Link>.
        </p>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 border-t border-[#e6dfd1] bg-[#FDF8F3] px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">How it works.</h2>
          <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="border-t-2 border-goods-terracotta pt-4">
                <p className="font-display text-lg font-semibold text-goods-terracotta">0{i + 1}</p>
                <p className="mt-1 font-display text-2xl font-semibold leading-tight">{s.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#4a4741]">{s.line}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl text-[15px] leading-relaxed text-[#5d574c]">
            When a community is ready to make its own beds, a production facility can come to it. <Link href="/facilities" className="font-semibold text-goods-ink underline underline-offset-2">How a facility comes to a community</Link>.
          </p>
        </div>
      </section>

      {/* What Goods brings, and a community that has done it */}
      <section className="px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-goods-sand">
            <Image src="/images/community/alice-springs/stretch-bed-kids-pile.jpg" alt="Young people with a Stretch Bed in Alice Springs" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">What Goods on Country brings</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-balance md:text-5xl">You run the beds. We back you up.</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#4a4741]">
              {SHEET.support.items.slice(0, -1).join(', ').replace(/^./, (c) => c.toUpperCase())} and {SHEET.support.items[SHEET.support.items.length - 1]}. They come inside the price of the stock, so your organisation does not pay for them.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#4a4741]">
              Oonchiumpa has already made these calls in Mparntwe. They picked the young people, chose which households got beds, and decided who drove them out to the homelands.
            </p>
          </div>
        </div>
      </section>

      {/* Straight answers */}
      <section className="border-t border-[#e6dfd1] bg-[#FDF8F3] px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Straight answers.</h2>
          <div className="mt-8 divide-y divide-[#e6dfd1] rounded-[24px] border border-[#e6dfd1] bg-white px-6 md:px-8">
            {ANSWERS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold">
                  {item.q}
                  <span aria-hidden="true" className="text-2xl text-goods-terracotta transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[16px] leading-relaxed text-[#4a4741]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Ask */}
      <section id="ask" className="scroll-mt-20 px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Tell us you are interested</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">Start with a conversation.</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#4a4741]">Tell us about your organisation, your community and who needs beds. A person from the team will call or email to talk it through.</p>
            <p className="mt-6 text-[15px] leading-relaxed text-[#5d574c]">
              {ORGANISATION.identityLine} {ORGANISATION.boardLine} <Link href="/who-we-are" className="underline underline-offset-2">Who we are</Link>.
            </p>
          </div>
          <EnquiryForm
            kind="sell-beds"
            subject="Partnership Inquiry"
            fields={INTEREST_FIELDS}
            submitLabel="Send"
            sentTitle="Thank you."
            sentLine="Your message is with the Goods on Country team. A person will reply to set up a conversation."
          />
        </div>
      </section>
    </main>
  );
}
