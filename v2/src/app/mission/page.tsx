import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/lib/data/content';
import { curatedQuotes } from '@/lib/data/curated-quotes';
import {
  deployments,
  getDeploymentTotals,
  communityVoices,
  problemStats,
  environmentalImpact,
  vision2030,
  timeline,
  videoTestimonials,
} from '@/lib/data/compendium';

export const metadata: Metadata = {
  title: 'Our Mission — Goods on Country',
  description:
    'The full story of Goods on Country: why we exist, how we work, and where we\'re going. Community-designed health hardware for remote Australia.',
  openGraph: {
    title: 'Our Mission — Goods on Country',
    description: 'A good bed can prevent heart disease. The full story of community-designed health hardware for remote Australia.',
  },
};

// Pick the strongest community voices for each narrative section
const ORIGIN_QUOTES = [
  {
    text: 'Education and awareness is great, but you need to match it with something that actually enables people to change.',
    name: 'Dr Boe Remenyi',
    context: '2018 NT Australian of the Year',
  },
  {
    text: 'We see entrenched primary health issues in communities — rheumatic heart disease, scabies, trachoma. Issues that don\'t exist anywhere else in the world.',
    name: 'Wayne Glenn',
    context: 'Health sector',
  },
];

const COMMUNITY_LED_QUOTES = [
  {
    text: 'We\'ve never been asked what sort of house we\'d like to live in.',
    name: 'Linda Turner',
    context: 'Tennant Creek',
  },
  {
    text: 'When it comes from an Aboriginal person, it works. That\'s what makes the difference.',
    name: 'Jason',
    context: 'Palm Island',
  },
  {
    text: 'We want to get bigger. We want to help other people, other language groups, other cultures.',
    name: 'Patricia Frank',
    context: 'Tennant Creek',
  },
];

const NEED_QUOTES = [
  {
    text: 'Hardly any people around the community have got beds. When they got family members over, there\'s not enough for everyone.',
    name: 'Ivy',
    context: 'Palm Island',
  },
  {
    text: 'I\'ve put up with clients going to hospital with pneumonia from sleeping on the ground because it\'s too cold. In summer they\'re scared to sleep because of snakes.',
    name: 'Chloe',
    context: 'Kalgoorlie',
  },
  {
    text: 'You have to bring them on the barge — you can\'t just take them on the boat. You have to pay for freight. It all adds up.',
    name: 'Alfred Johnson',
    context: 'Palm Island',
  },
];

const PRODUCT_QUOTES = [
  {
    text: 'It\'s a really simple idea to a really complex issue — one that can be taken and modified for individual families and communities.',
    name: 'Wayne Glenn',
    context: 'On the Stretch Bed',
  },
  {
    text: 'These two boys just picked it up straight away. The most important thing is it\'s actually comfortable.',
    name: 'Heather Mundo',
    context: 'Katherine',
  },
  {
    text: 'Good sleep. No sound, no people shouting. Just quiet.',
    name: 'Walter',
    context: 'On the Stretch Bed',
  },
];

const VISION_QUOTES = [
  {
    text: 'I want to see a better future for our kids and better housing — not only here but for the whole nation.',
    name: 'Norman Frank',
    context: 'Warumungu Law Man',
  },
  {
    text: 'This partnership could go a long way. I feel it\'s got a long, long path ahead.',
    name: 'Shayne Bloomfield',
    context: 'Oonchiumpa',
  },
  {
    text: 'To have healthy kids grow up to be healthy parents and uncles and aunties — that is the goal, isn\'t it?',
    name: 'Georgina Byron AM',
    context: 'Snow Foundation',
  },
];

const CASCADE_STEPS = [
  { step: '1', title: 'No washing machine', detail: 'Dirty bedding accumulates' },
  { step: '2', title: 'Scabies', detail: 'Skin infections spread' },
  { step: '3', title: 'Strep A', detail: 'Bacterial infection develops' },
  { step: '4', title: 'Rheumatic fever', detail: 'Immune system attacks the heart' },
  { step: '5', title: 'Rheumatic Heart Disease', detail: 'Preventable — yet still killing children' },
];

export default function MissionPage() {
  const totals = getDeploymentTotals();

  return (
    <main className="bg-[#FDF8F3]">
      {/* ── HERO ── */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />
        <div className="relative container mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-orange-400 mb-6">The Full Story</p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 max-w-4xl mx-auto leading-[1.1]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {brand.oneLiner}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            {brand.hero.about.subheadline}
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
            <Stat value={`${totals.beds}+`} label="beds deployed" />
            <Stat value={`${totals.communities}`} label="communities" />
            <Stat value="30+" label="storytellers" />
            <Stat value="9,225kg" label="plastic diverted" />
          </div>
        </div>
      </section>

      {/* ── THE WHY ── */}
      <NarrativeSection
        id="why"
        label="Why We Exist"
        heading="A disease that shouldn't exist."
        theme="light"
      >
        <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed text-[#3E3E3E]">
          <p>
            In 2018, Nicholas Marchesi attended a health conference where Dr Bo Remenyi — 2018 NT
            Australian of the Year — spoke about Rheumatic Heart Disease. Her message was simple and
            devastating: RHD is entirely preventable through good environmental health. Yet she was
            filling out death certificates for children.
          </p>
          <p>
            RHD doesn&rsquo;t exist because medicine failed. It exists because housing and &ldquo;health
            hardware&rdquo; failed. The cascade is brutally simple:
          </p>
        </div>

        {/* Health cascade */}
        <div className="max-w-3xl mx-auto mt-10">
          <div className="flex flex-col md:flex-row items-stretch gap-0">
            {CASCADE_STEPS.map((s, i) => (
              <div key={s.step} className="flex-1 flex flex-col items-center text-center relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                    i < 4 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {s.step}
                </div>
                <h4 className="text-sm font-semibold text-slate-800">{s.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{s.detail}</p>
                {i < CASCADE_STEPS.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-5 text-slate-300 text-lg">&rarr;</div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-orange-700 font-medium mt-6">
            A washing machine interrupts the cascade. Clean bedding breaks the scabies cycle.
          </p>
        </div>

        <QuoteGrid quotes={ORIGIN_QUOTES} className="mt-12" />

        {/* Problem stats */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
          {problemStats.slice(0, 6).map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-slate-800">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.claim}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.source}</p>
            </div>
          ))}
        </div>
      </NarrativeSection>

      {/* ── THE NEED ── */}
      <NarrativeSection
        id="need"
        label="The Need"
        heading="This is not a cultural choice."
        theme="dark"
      >
        <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed text-slate-300">
          <p>
            Thousands of people in remote Australia sleep on the floor or share beds. Essential
            appliances fail within months because they were never designed for remote conditions.
            The freight makes everything unaffordable. One Alice Springs provider sells $3 million
            a year of washing machines into remote communities — most end up in dumps within months.
          </p>
          <p>
            Community voices are unambiguous. The need is real, the gap is massive, and the existing
            supply chain is fundamentally broken.
          </p>
        </div>
        <QuoteGrid quotes={NEED_QUOTES} className="mt-12" dark />
      </NarrativeSection>

      {/* ── COMMUNITY-LED ── */}
      <NarrativeSection
        id="how"
        label="How We Work"
        heading="Built with communities, not for them."
        theme="light"
      >
        <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed text-[#3E3E3E]">
          <p>
            Every product starts with a conversation — &ldquo;around the fire&rdquo; with Elders and families.
            We don&rsquo;t license designs — we transfer capability. Communities receive full training,
            manufacturing equipment, and documentation. They keep 100% of what they make and sell.
          </p>
          <p className="text-xl font-light italic text-slate-700" style={{ fontFamily: 'Georgia, serif' }}>
            &ldquo;{brand.philosophy}&rdquo;
          </p>
          <p>
            The production facility is a containerised system — a shredding container that stays in
            community for ongoing plastic collection, and a production container with hydraulic press
            and CNC router that travels on a circuit between communities. Same facility makes beds,
            washing machine cases, and fridge components — different moulds.
          </p>
        </div>

        <QuoteGrid quotes={COMMUNITY_LED_QUOTES} className="mt-12" />

        {/* Design evolution */}
        <div className="max-w-3xl mx-auto mt-12 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Community feedback drove every design change</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { feedback: '"We want to move it around"', response: 'Lighter, more portable' },
              { feedback: '"We want it high off the ground"', response: 'Safety from snakes and floods' },
              { feedback: '"We don\'t want the foam"', response: 'Couldn\'t wash, broke down — now canvas' },
              { feedback: '"We want a MAD bed!"', response: 'More innovative design → Stretch Bed' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-white rounded-lg border border-slate-200">
                <p className="text-sm font-medium italic text-slate-700">{item.feedback}</p>
                <p className="text-sm text-slate-500 mt-1">&rarr; {item.response}</p>
              </div>
            ))}
          </div>
        </div>
      </NarrativeSection>

      {/* ── THE PRODUCT ── */}
      <NarrativeSection
        id="product"
        label="What We Build"
        heading="The Stretch Bed."
        theme="warm"
      >
        <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed text-[#3E3E3E]">
          <p>
            Recycled HDPE plastic legs. Galvanised steel poles. Heavy-duty Australian canvas.
            26 kilograms, flat-packs to nothing, assembles in five minutes with no tools.
            Every bed diverts 20kg of plastic from landfill. Designed to last 10+ years.
          </p>
        </div>

        {/* Specs grid */}
        <div className="max-w-3xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '26kg', label: 'Total weight' },
            { value: '200kg', label: 'Load capacity' },
            { value: '5 min', label: 'Assembly time' },
            { value: '10+ yr', label: 'Design lifespan' },
            { value: '20kg', label: 'Plastic diverted' },
            { value: '188cm', label: 'Length' },
            { value: '92cm', label: 'Width' },
            { value: '5 yr', label: 'Warranty' },
          ].map((spec) => (
            <div key={spec.label} className="text-center p-4 bg-white/70 rounded-lg">
              <p className="text-2xl font-bold text-slate-800">{spec.value}</p>
              <p className="text-xs text-slate-500 mt-1">{spec.label}</p>
            </div>
          ))}
        </div>

        <QuoteGrid quotes={PRODUCT_QUOTES} className="mt-12" />

        {/* Washing machine teaser */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Pakkimjalki Kari — The Washing Machine</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Named in Warumungu language by Elder Dianne Stokes. A Speed Queen commercial-grade
            machine wrapped in recycled plastic armour, reduced to one button, with built-in
            telemetry and a swappable language panel. Five deployed in Tennant Creek.
            &ldquo;What a bull bar is to a four-wheel drive.&rdquo;
          </p>
        </div>
      </NarrativeSection>

      {/* ── WHERE WE WORK ── */}
      <NarrativeSection
        id="where"
        label="Where We Work"
        heading={`${totals.communities} communities and growing.`}
        theme="light"
      >
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 text-left">
                <th className="pb-3 font-semibold text-slate-700">Community</th>
                <th className="pb-3 font-semibold text-slate-700">Traditional Name</th>
                <th className="pb-3 font-semibold text-slate-700">State</th>
                <th className="pb-3 font-semibold text-slate-700 text-right">Beds</th>
                <th className="pb-3 font-semibold text-slate-700 text-right">Washers</th>
              </tr>
            </thead>
            <tbody>
              {deployments.filter(d => d.beds > 0 || d.washers > 0).map((d) => (
                <tr key={d.id} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-slate-800">{d.community}</td>
                  <td className="py-3 text-slate-500 italic">{d.traditionalName || '—'}</td>
                  <td className="py-3 text-slate-600">{d.state}</td>
                  <td className="py-3 text-right font-mono text-slate-700">{d.beds || '—'}</td>
                  <td className="py-3 text-right font-mono text-slate-700">{d.washers || '—'}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-300 font-bold">
                <td className="py-3" colSpan={3}>Total</td>
                <td className="py-3 text-right font-mono">{totals.beds}</td>
                <td className="py-3 text-right font-mono">{totals.washers}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </NarrativeSection>

      {/* ── ENVIRONMENTAL ── */}
      <NarrativeSection
        id="environment"
        label="Environmental Impact"
        heading="Community waste becomes community beds."
        theme="dark"
      >
        <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed text-slate-300">
          <p>
            Every Stretch Bed diverts 20–25kg of HDPE plastic from landfill. Community members
            collect bottle lids and plastic waste. It&rsquo;s shredded, heated at 180&deg;C, pressed into
            sheets, and CNC-cut into bed components. The circular loop: community waste &rarr; beds
            &rarr; community ownership.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <DarkStat value={`${environmentalImpact.plasticPerBed.min}–${environmentalImpact.plasticPerBed.max}kg`} label="Plastic per bed" />
          <DarkStat value={`${(environmentalImpact.totalDivertedToDate / 1000).toFixed(1)}t`} label="Total diverted" />
          <DarkStat value={`${environmentalImpact.atScale.tonnes}t/yr`} label="At 5,000 units/yr" />
          <DarkStat value="10+ years" label="vs weeks for conventional" />
        </div>
      </NarrativeSection>

      {/* ── TIMELINE ── */}
      <NarrativeSection
        id="timeline"
        label="Our Journey"
        heading="From a conference to a movement."
        theme="light"
      >
        <div className="max-w-2xl mx-auto">
          <div className="relative pl-8 border-l-2 border-orange-200 space-y-8">
            {timeline.map((m, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[calc(2rem+5px)] w-3 h-3 rounded-full bg-orange-400 border-2 border-white" />
                <p className="text-xs font-mono text-orange-600 uppercase tracking-wider">{m.date}</p>
                <p className="text-sm text-slate-700 mt-1">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </NarrativeSection>

      {/* ── THE TEAM ── */}
      <NarrativeSection
        id="team"
        label="Who We Are"
        heading="A Curious Tractor."
        theme="warm"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="text-lg text-[#3E3E3E] leading-relaxed">
            The name comes from Nic&rsquo;s farm — a tractor&rsquo;s &ldquo;power take-off&rdquo; provides drive
            to other implements. ACT brings the drive; communities take the keys.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonCard
              name="Nicholas Marchesi OAM"
              role="Co-founder & Project Lead"
              bio="Co-founded Orange Sky (2014) — now 280+ shifts/week, 1.2M+ kg laundry. Stanford Executive Program, Young Australian of the Year (2016), Obama Foundation Leader."
              quote="Orange Sky taught me that dignity lives in the details. Clean clothes aren't just practical — they restore something essential."
            />
            <PersonCard
              name="Benjamin Knight"
              role="Co-founder & Technology"
              bio="20+ years in community-led innovation: youth refuges, QLD Corrective Services Gulf communities, Orange Sky, AIME. Built the Empathy Ledger and Asset Register."
              quote="We don't need better programs delivered to communities; we need better infrastructure owned by communities."
            />
          </div>

          <div className="p-5 bg-white/70 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Legal Structure</h3>
            <p className="text-sm text-slate-600">
              <strong>A Kind Tractor Ltd</strong> — Company Limited by Guarantee, ACNC registered charity, DGR status.
              <br />
              <strong>A Curious Tractor Pty Ltd</strong> — Mission-locked trading company.
            </p>
          </div>
        </div>
      </NarrativeSection>

      {/* ── THE VOICES ── */}
      <NarrativeSection
        id="voices"
        label="Community Voices"
        heading="In their own words."
        theme="light"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityVoices
              .filter((v) => v.quotes.length > 0)
              .slice(0, 12)
              .map((v) => (
                <div key={v.id} className="p-5 bg-white rounded-lg border border-slate-200">
                  <blockquote
                    className="text-sm text-slate-700 italic border-l-2 border-orange-300 pl-3 mb-3"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    &ldquo;{v.quotes[0]}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{v.name}</p>
                      {v.role && <p className="text-xs text-slate-500">{v.role}</p>}
                    </div>
                    <span className="text-xs text-slate-400">{v.community}, {v.state}</span>
                  </div>
                </div>
              ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/stories"
              className="text-sm text-orange-700 hover:text-orange-800 underline underline-offset-4"
            >
              See all community stories &rarr;
            </Link>
          </div>
        </div>
      </NarrativeSection>

      {/* ── VISION ── */}
      <section id="vision" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />
        <div className="relative container mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-orange-400 mb-6">Vision 2030</p>
          <blockquote
            className="text-xl md:text-2xl text-white font-light max-w-3xl mx-auto leading-relaxed mb-10"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            &ldquo;{vision2030.quote}&rdquo;
          </blockquote>

          <div className="max-w-2xl mx-auto text-left space-y-3 mb-12">
            {vision2030.metrics.map((m, i) => (
              <div key={i} className="flex gap-3 text-slate-300 text-sm">
                <span className="text-orange-400 font-bold shrink-0">{i + 1}.</span>
                <span>{m}</span>
              </div>
            ))}
          </div>

          <p className="text-lg text-orange-300 font-medium max-w-xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
            Ultimate success: &ldquo;{vision2030.ultimateSuccess}&rdquo;
          </p>

          <QuoteGrid quotes={VISION_QUOTES} className="mt-12" dark />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 bg-[#FDF8F3]">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-light text-slate-800 mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {brand.taglineAlt}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/shop/stretch-bed-single"
              className="inline-flex items-center justify-center rounded-md bg-orange-600 px-8 py-3 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
            >
              Buy a Stretch Bed
            </Link>
            <Link
              href="/sponsor"
              className="inline-flex items-center justify-center rounded-md border border-orange-600 px-8 py-3 text-sm font-medium text-orange-700 hover:bg-orange-50 transition-colors"
            >
              Sponsor a Bed
            </Link>
            <Link
              href="/stories"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-8 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Community Stories
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── HELPER COMPONENTS ── */

function NarrativeSection({
  id,
  label,
  heading,
  theme,
  children,
}: {
  id: string;
  label: string;
  heading: string;
  theme: 'light' | 'dark' | 'warm';
  children: React.ReactNode;
}) {
  const bg = theme === 'dark' ? 'bg-slate-900' : theme === 'warm' ? 'bg-[#F5EDE3]' : 'bg-[#FDF8F3]';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-slate-800';
  const labelColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-600';

  return (
    <section id={id} className={`py-20 md:py-28 ${bg}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className={`text-sm uppercase tracking-[0.25em] ${labelColor} mb-4`}>{label}</p>
          <h2
            className={`text-3xl md:text-4xl font-light ${headingColor} max-w-2xl mx-auto`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {heading}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function QuoteGrid({
  quotes,
  className = '',
  dark = false,
}: {
  quotes: { text: string; name: string; context: string }[];
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={`max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-${quotes.length > 2 ? '3' : '2'} gap-6 ${className}`}>
      {quotes.map((q, i) => (
        <blockquote
          key={i}
          className={`p-5 rounded-lg border ${
            dark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <p
            className={`text-sm italic leading-relaxed mb-3 ${dark ? 'text-slate-200' : 'text-slate-700'}`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            &ldquo;{q.text}&rdquo;
          </p>
          <footer className="flex items-center justify-between">
            <span className={`text-sm font-medium ${dark ? 'text-white' : 'text-slate-800'}`}>{q.name}</span>
            <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{q.context}</span>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
}

function DarkStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
}

function PersonCard({
  name,
  role,
  bio,
  quote,
}: {
  name: string;
  role: string;
  bio: string;
  quote: string;
}) {
  return (
    <div className="p-5 bg-white rounded-lg border border-slate-200 space-y-3">
      <div>
        <h3 className="text-base font-semibold text-slate-800">{name}</h3>
        <p className="text-xs text-orange-600">{role}</p>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{bio}</p>
      <blockquote
        className="text-sm italic text-slate-500 border-l-2 border-orange-300 pl-3"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>
    </div>
  );
}
