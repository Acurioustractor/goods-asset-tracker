import Link from 'next/link';
import { ArrowRight, Compass, FileText, Images, MessageSquareQuote, Presentation } from 'lucide-react';
import {
  advisoryGroup,
  communityPartnerships,
  investmentCase,
  oonchiumpaPartnership,
} from '@/lib/data/content';
import Image from 'next/image';
import { MediaSlot } from '@/components/ui/media-slot';
import { AssemblySequence } from '@/components/pitch/assembly-sequence';
import { CyclingImage } from '@/components/pitch/cycling-image';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { PLASTIC_KG_PER_BED, STRETCH_BED, WASHING_MACHINE } from '@/lib/data/products';
import { getStoryteller, type StorytellerRecord } from '@/lib/data/storyteller-registry';

export const metadata = {
  title: 'Pitch | Goods on Country',
  description:
    'Goods on Country works with First Nations communities to build beds, washing machines, and the production plant that can move into community ownership.',
};

const plainCase = [
  'People are asking for beds that work in heat, dust, freight, and crowded houses.',
  `The Stretch Bed exists: ${STRETCH_BED.specs.weight}, ${STRETCH_BED.specs.loadCapacity} load, no tools, recycled HDPE legs, steel poles, canvas.`,
  'Demand has names attached: Dianne Stokes, Utopia Homelands, Homeland Schools, Maningrida.',
  'The plant is the path from Goods-run production to community-owned making.',
];

const problemPains = [
  {
    title: 'Beds do not arrive easily',
    proof: 'Freight turns a basic bed into a hard purchase. In places like Palm Island and Maningrida, the cost and timing change the decision.',
  },
  {
    title: 'Goods break before they should',
    proof: 'Household products are usually made for metro houses, not heat, dust, shared use, repairs, and long distances.',
  },
  {
    title: 'Waste and work leave Country',
    proof: 'Plastic goes to landfill. Finished goods come back on trucks, barges, and grant budgets. The making happens somewhere else.',
  },
];

const workaroundRows = [
  {
    today: 'Buy cheap goods, pay heavy freight, replace them when they fail.',
    goods: 'Use a washable product designed for remote use, repair, movement, and long life.',
  },
  {
    today: 'Run short project batches that stop when the funding ends.',
    goods: 'Sell beds, supply funded batches, and keep the production work moving toward community ownership.',
  },
  {
    today: 'Ship waste out, ship furniture in, keep jobs elsewhere.',
    goods: 'Collect plastic locally, press it into bed components, and train local operators over time.',
  },
];

const tractionStats = [
  {
    value: String(CANONICAL_ASSETS.bedsDeployed),
    label: 'tracked bed units deployed across current and earlier designs',
  },
  {
    value: String(CANONICAL_ASSETS.communitiesServed),
    label: 'communities served through the asset register',
  },
  {
    value: '107',
    label: 'additional beds on order or requested in current demand signals',
  },
  {
    value: `${PLASTIC_KG_PER_BED}kg`,
    label: 'HDPE diverted per current Stretch Bed design',
  },
];

const whyNow = [
  {
    force: 'The demand is named',
    detail:
      'Dianne Stokes asked for 20 more beds after receiving one. Utopia Homelands, Homeland Schools, health coordinators, and NPY Women\'s Council are live signals.',
  },
  {
    force: 'The plant is no longer theory',
    detail:
      'The press, shredder, CNC, and container workflow are built enough to move from proof to regular production practice.',
  },
  {
    force: 'The next funding step has a date',
    detail:
      'QBE Catalysing Impact, SEFA, Snow, Centrecorp, and White Box SELF are the next conversations. The question is how much can be signed before the next QBE stage.',
  },
];

const businessModel = [
  {
    buyer: 'Procurement and health buyers',
    buys: 'Stretch Bed batches for communities, schools, housing programs, and health partners.',
    reason: 'They get a bed with specs, support, tracking, and real use in community.',
  },
  {
    buyer: 'Sponsors and funders',
    buys: 'Beds, production capability, and the capital bridge into On-Country manufacturing.',
    reason: 'Their money turns into beds, equipment, local training, and a clearer ownership path.',
  },
  {
    buyer: 'Direct customers',
    buys: 'The Stretch Bed through ecommerce. Pakkimjalki Kari remains register-interest only.',
    reason: 'Direct sales prove people will buy the bed and keep stock moving.',
  },
];

const firstChannels = [
  {
    wedge: 'Convert live demand',
    action:
      'Close the named bed requests already in motion: Utopia, Homeland Schools, NPY Women\'s Council, health coordinators, and repeat community requests.',
  },
  {
    wedge: 'Health hardware channel',
    action:
      'Use ACCHOs, environmental health teams, schools, and housing partners as the buyers who already see the bedding, washing, scabies, and overcrowding problem.',
  },
  {
    wedge: 'Community production partners',
    action:
      'Move from bed batches to hosted or owned production runs with Oonchiumpa, Palm Island Community Company, and future community-controlled partners.',
  },
];

const competition = [
  {
    alternative: 'Standard beds and mattresses',
    appeal: 'Known products, existing suppliers, familiar procurement.',
    breaks: 'Bulky freight, hard to wash, poor remote repair fit, limited ownership pathway.',
    win: 'Flat-packable, washable, repairable parts, QR-tracked support, remote-first design.',
  },
  {
    alternative: 'Camping or emergency beds',
    appeal: 'Cheap, light, easy to buy in small batches.',
    breaks: 'Not built as long-life household infrastructure or community production assets.',
    win: `Designed as health hardware with a ${STRETCH_BED.specs.designLifespan.replace(/s$/, '')} design life and local manufacturing pathway.`,
  },
  {
    alternative: 'Do nothing / wait for the next funded program',
    appeal: 'No new procurement risk today.',
    breaks: 'Families keep using the broken workaround and waste keeps moving through the same loop.',
    win: 'Goods turns named demand into beds now and production capability over time.',
  },
];

// The strongest cleared, quoted, photo-backed voices for the investor story:
// community members alongside the practitioners who see the problem daily.
// Source of truth is storyteller-registry.ts (tier 'external' only, never 'hold').
const REAL_VOICE_NAMES = ['Dianne Stokes', 'Norman Frank', 'Cliff Plummer', 'Chloe', 'Wayne Glenn', 'Dr Boe Remenyi'];

function leadQuote(record: StorytellerRecord) {
  return record.quotes.find((q) => q.status === 'primary') ?? record.quotes.find((q) => q.status === 'approved') ?? null;
}

const realVoices = REAL_VOICE_NAMES.map((name) => getStoryteller(name))
  .filter((record): record is StorytellerRecord => record !== undefined && record.tier === 'external')
  .map((record) => ({ record, quote: leadQuote(record) }))
  .filter((entry): entry is { record: StorytellerRecord; quote: NonNullable<ReturnType<typeof leadQuote>> } => Boolean(entry.quote));

export default function PitchPage() {
  const featuredPartnerships = communityPartnerships.filter((p) => p.bedsDelivered > 0).slice(0, 6);
  const topRisks = investmentCase.risks.slice(0, 4);

  return (
    <main>
      <section className="min-h-[86vh] bg-foreground text-background">
        <div className="container mx-auto grid min-h-[86vh] items-center gap-12 px-4 py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-6 text-sm uppercase tracking-widest text-primary">Goods on Country</p>
            <h1
              className="mb-8 max-w-4xl text-4xl font-light leading-[1.08] md:text-6xl lg:text-7xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Beds off the ground, plastic out of landfill, manufacturing moving On Country.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-background/70 md:text-xl">
              The Stretch Bed is {STRETCH_BED.specs.weight}, washable, and built from recycled HDPE, galvanised steel, and canvas.
              The bigger work is the plant: turning local plastic into local production.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pitch/deck"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Open the deck <Presentation className="h-4 w-4" />
              </Link>
              <Link
                href="#ask"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-background/25 px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/10"
              >
                See the ask <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pitch/document"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-background/25 px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/10"
              >
                PDF version <FileText className="h-4 w-4" />
              </Link>
              <Link
                href="/pitch/workshop"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-background/25 px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/10"
              >
                Workshop <MessageSquareQuote className="h-4 w-4" />
              </Link>
              <Link
                href="/pitch/investor-lab"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-background/25 px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/10"
              >
                Investor lab <Compass className="h-4 w-4" />
              </Link>
              <Link
                href="/pitch/photo-review"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-background/25 px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/10"
              >
                Photo review <Images className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-background/10 bg-background/5 p-5">
            <p className="mb-4 text-xs uppercase tracking-widest text-background/40">
              The case in plain words
            </p>
            <div className="space-y-4">
              {plainCase.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-background/75">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20" id="problem">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-accent">01 - Problem</p>
            <h2
              className="mb-5 max-w-3xl text-3xl font-light leading-tight text-foreground md:text-5xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              This shows up in homes, freight bills, and community dumps.
            </h2>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              The old system ships in whatever is available, then asks families and community organisations
              to carry the cost when it breaks, cannot be washed, or never arrives.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              {problemPains.map((pain) => (
                <div key={pain.title} className="rounded-lg border border-border bg-muted/20 p-6">
                  <h3 className="mb-3 text-lg font-semibold text-foreground">{pain.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{pain.proof}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <MediaSlot
              src="/images/media-pack/woman-on-red-stretch-bed.jpg"
              alt="A woman sitting on a red Stretch Bed in Alice Springs"
              label="Stretch Bed in use"
              aspect="4/3"
              className="overflow-hidden rounded-lg"
            />
            <div>
              <p className="mb-4 text-sm uppercase tracking-widest text-accent">02 - Current workaround</p>
              <h2
                className="mb-8 text-3xl font-light leading-tight text-foreground md:text-4xl"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                People already solve this problem. The market gives them bad options.
              </h2>
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="grid grid-cols-2 border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <div className="p-4">Today</div>
                  <div className="border-l border-border p-4">With Goods</div>
                </div>
                {workaroundRows.map((row) => (
                  <div key={row.today} className="grid grid-cols-2 border-b border-border last:border-b-0">
                    <p className="p-4 text-sm leading-relaxed text-muted-foreground">{row.today}</p>
                    <p className="border-l border-border p-4 text-sm leading-relaxed text-foreground">{row.goods}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20" id="product">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-accent">03 - Product</p>
            <div className="mb-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <h2
                  className="mb-5 text-3xl font-light leading-tight text-foreground md:text-5xl"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  {STRETCH_BED.name}: thread the poles, tension the legs, sleep off the ground.
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  {STRETCH_BED.tagline} It is the product proof for the model:
                  practical enough to sell now, simple enough to assemble in minutes, and built
                  for future On-Country production.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    STRETCH_BED.specs.weight,
                    `${STRETCH_BED.specs.loadCapacity} load capacity`,
                    `${STRETCH_BED.specs.assemblyTime} assembly`,
                    `${STRETCH_BED.specs.designLifespan} design life`,
                    STRETCH_BED.specs.plasticDiverted,
                    STRETCH_BED.specs.toolsRequired === 'None' ? 'No tools required' : STRETCH_BED.specs.toolsRequired,
                  ].map((feature) => (
                    <div key={feature} className="rounded-lg border border-border bg-muted/20 p-4 text-sm font-medium text-foreground">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <AssemblySequence />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/20">
                <MediaSlot
                  src="/images/pitch/bed-frame-legs.jpg"
                  alt="Recycled HDPE plastic legs pressed from community waste"
                  label="Recycled HDPE legs"
                  aspect="4/3"
                />
                <div className="p-4">
                  <h3 className="mb-1 text-sm font-semibold text-foreground">Recycled HDPE legs</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Two X-trestle legs pressed from HDPE plastic waste.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20">
                <MediaSlot
                  src="/images/pitch/bed-poles.jpg"
                  alt="Galvanised steel poles for the Stretch Bed"
                  label="Galvanised steel"
                  aspect="4/3"
                />
                <div className="p-4">
                  <h3 className="mb-1 text-sm font-semibold text-foreground">Galvanised steel poles</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Two poles thread through the canvas sleeves and legs.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20">
                <MediaSlot
                  src="/images/pitch/bed-canvas.jpg"
                  alt="Heavy-duty Australian canvas sleeping surface"
                  label="Heavy-duty canvas"
                  aspect="4/3"
                />
                <div className="p-4">
                  <h3 className="mb-1 text-sm font-semibold text-foreground">Washable canvas</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    A cleanable, repairable sleeping surface built for remote use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-foreground py-20 text-background" id="traction">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-background/40">04 - Traction</p>
            <h2
              className="mb-5 max-w-3xl text-3xl font-light leading-tight md:text-5xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              This is not a concept deck. Beds are already in homes.
            </h2>
            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-background/65">
              The strongest signal is not a survey. It is people who used the bed, then asked for more.
            </p>

            <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tractionStats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-background/10 bg-background/5 p-6">
                  <p className="mb-2 text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
                  <p className="text-sm leading-relaxed text-background/55">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {investmentCase.demand.slice(0, 4).map((item) => (
                <div key={item.text} className="rounded-lg border border-background/10 bg-background/5 p-5">
                  <p className="mb-3 text-sm leading-relaxed text-background/75">{item.text}</p>
                  <p className="text-xs uppercase tracking-widest text-background/35">{item.person}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20" id="why-now">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-accent">05 - Why now</p>
            <h2
              className="mb-10 max-w-3xl text-3xl font-light leading-tight text-foreground md:text-5xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Three things have changed.
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {whyNow.map((item) => (
                <div key={item.force} className="rounded-lg border border-border p-6">
                  <h3 className="mb-3 text-lg font-semibold text-foreground">{item.force}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20" id="model">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-accent">06 - Business model</p>
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <h2
                  className="mb-5 text-3xl font-light leading-tight text-foreground md:text-5xl"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  Product revenue now. Community-owned production over time.
                </h2>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  The simple model: sell durable goods, use patient capital to build production,
                  then move more of the making and margin to community-controlled partners.
                </p>
                <div className="rounded-lg border border-border bg-background p-5">
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Money flow</p>
                  <p className="text-lg font-semibold text-foreground">
                    Bed orders + sponsored deployments + patient capital = inventory, plant capability, and local production runs.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {businessModel.map((row) => (
                  <div key={row.buyer} className="rounded-lg border border-border bg-background p-5">
                    <h3 className="mb-2 text-base font-semibold text-foreground">{row.buyer}</h3>
                    <p className="mb-2 text-sm leading-relaxed text-muted-foreground">{row.buys}</p>
                    <p className="text-sm leading-relaxed text-foreground">{row.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Product boundary</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The Stretch Bed is the commercial anchor and the only direct-sale product. {WASHING_MACHINE.name}
                {' '}is a prototype and register-interest pathway, not a checkout product.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20" id="first-channels">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-accent">07 - First channels</p>
            <h2
              className="mb-10 max-w-3xl text-3xl font-light leading-tight text-foreground md:text-5xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              The first buyers and partners are not theoretical.
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {firstChannels.map((item) => (
                <div key={item.wedge} className="rounded-lg border border-border p-6">
                  <h3 className="mb-3 text-lg font-semibold text-foreground">{item.wedge}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="mb-4 text-sm uppercase tracking-widest text-accent">08 - Manufacturing advantage</p>
              <h2
                className="mb-5 text-3xl font-light leading-tight text-foreground md:text-5xl"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                The plant is the bridge from product sales to community ownership.
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                Through {oonchiumpaPartnership.headline}, Goods is building a practical model:
                collect plastic, shred it, press it, cut bed parts, assemble beds, train local operators.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  investmentCase.productionPlant.capacity,
                  investmentCase.productionPlant.investment,
                  `${PLASTIC_KG_PER_BED}kg HDPE per bed`,
                ].map((item) => (
                  <div key={item} className="rounded-lg border border-border bg-background p-4 text-sm font-semibold text-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-5">
              <CyclingImage
                images={[
                  { src: '/images/process/hydraulic-press.jpg', alt: 'Hydraulic press compressing recycled plastic into sheets' },
                  { src: '/images/process/pressed-sheets.jpg', alt: 'Stack of pressed recycled plastic sheets' },
                  { src: '/images/process/cnc-cutter.jpg', alt: 'CNC router cutting bed components from pressed plastic' },
                ]}
                aspect="4/3"
              />
              <div className="mt-5 space-y-3">
                {investmentCase.productionPlant.capabilities.map((capability) => (
                  <p key={capability} className="text-sm leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">{capability}.</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-foreground py-20 text-background" id="competition">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-background/40">09 - Competition</p>
            <h2
              className="mb-8 max-w-3xl text-3xl font-light leading-tight md:text-5xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              The competition is the broken default.
            </h2>
            <div className="overflow-hidden rounded-lg border border-background/10">
              <div className="hidden grid-cols-[0.8fr_1fr_1fr_1fr] bg-background/10 text-xs font-semibold uppercase tracking-widest text-background/45 md:grid">
                <div className="p-4">Alternative</div>
                <div className="border-l border-background/10 p-4">What buyers like</div>
                <div className="border-l border-background/10 p-4">What breaks</div>
                <div className="border-l border-background/10 p-4">Why Goods wins</div>
              </div>
              {competition.map((row) => (
                <div key={row.alternative} className="grid gap-0 border-t border-background/10 md:grid-cols-[0.8fr_1fr_1fr_1fr]">
                  <h3 className="p-4 text-sm font-semibold text-background">{row.alternative}</h3>
                  <p className="border-t border-background/10 p-4 text-sm leading-relaxed text-background/55 md:border-l md:border-t-0">{row.appeal}</p>
                  <p className="border-t border-background/10 p-4 text-sm leading-relaxed text-background/55 md:border-l md:border-t-0">{row.breaks}</p>
                  <p className="border-t border-background/10 p-4 text-sm leading-relaxed text-background/75 md:border-l md:border-t-0">{row.win}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20" id="risks">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-accent">10 - Risks and mitigations</p>
            <h2
              className="mb-5 max-w-3xl text-3xl font-light leading-tight text-foreground md:text-5xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              The risks are real. The work now is to make them governable.
            </h2>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              The next stage needs clear roles, careful debt, clean governance, story consent, and cashflow that does not outrun orders.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {topRisks.map((risk) => (
                <div key={risk.risk} className="rounded-lg border border-border p-6">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{risk.risk}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{risk.detail}</p>
                  <p className="text-sm leading-relaxed text-foreground">{risk.mitigation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-accent">11 - People and proof</p>
            <h2
              className="mb-10 max-w-3xl text-3xl font-light leading-tight text-foreground md:text-5xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              The proof has names, places, and people around it.
            </h2>

            <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPartnerships.map((p) => (
                <div key={p.id} className="rounded-lg border border-border bg-background p-5">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.region}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">{p.bedsDelivered}</p>
                      <p className="text-xs text-muted-foreground">beds</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.headline}</p>
                </div>
              ))}
            </div>

            <div className="mb-12">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Real voices</h3>
              <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Community members and the practitioners who see the problem every day, quoted directly and named with consent.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {realVoices.map(({ record, quote }) => (
                  <div key={record.slug} className="rounded-lg border border-border bg-background p-5">
                    <div className="mb-4 flex items-center gap-3">
                      {record.portrait ? (
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                          <Image src={record.portrait} alt={record.name} fill className="object-cover" sizes="48px" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                          {record.name
                            .split(' ')
                            .filter((part) => part && part[0] === part[0].toUpperCase())
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-foreground">{record.name}</p>
                        <p className="text-xs text-muted-foreground">{record.role}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">&quot;{quote.text}&quot;</p>
                    <p className="mt-2 text-xs text-muted-foreground">{quote.context} &middot; {record.community}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-lg border border-border bg-background p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Named demand</h3>
                <div className="space-y-4">
                  {investmentCase.demand.slice(0, 4).map((item) => (
                    <div key={item.text} className="border-l border-border pl-4">
                      <p className="text-sm leading-relaxed text-foreground">{item.text}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.person}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Advisory group</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {advisoryGroup.map((person) => (
                    <div key={person.name} className="border-l border-border pl-4">
                      <p className="text-sm font-semibold text-foreground">{person.name}</p>
                      <p className="text-xs font-medium text-primary">{person.title}</p>
                      {person.org && <p className="mt-1 text-xs text-muted-foreground">{person.org}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-foreground py-24 text-background" id="ask">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-center text-sm uppercase tracking-widest text-background/40">12 - Ask</p>
            <h2
              className="mb-5 text-center text-4xl font-light leading-tight md:text-6xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              {investmentCase.totalAsk} to move from batches to steady production.
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-background/65">
              The immediate job is to close signed, match-eligible capital for stock, production roles,
              partner work, and the plant pathway.
            </p>

            <div className="mb-12 grid gap-4 md:grid-cols-3">
              {investmentCase.fundingLines.map((line) => (
                <div key={line.id} className="rounded-lg border border-background/10 bg-background/5 p-6">
                  <p className="mb-2 text-3xl font-bold text-primary">{line.amount}</p>
                  <h3 className="mb-3 text-lg font-semibold text-background">{line.title}</h3>
                  <p className="text-sm leading-relaxed text-background/55">{line.description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-background/10 bg-background/5 p-8 text-center">
              <p
                className="mb-4 text-2xl font-light leading-tight text-background md:text-3xl"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                Why invest now
              </p>
              <p className="mx-auto max-w-3xl text-background/65">
                The product exists. The demand is named. The plant pathway is real. The next step is to make production
                less founder-led and easier for community partners to own.
              </p>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/partner"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Partner with Goods <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-background/25 px-8 py-4 text-sm font-semibold text-background transition-colors hover:bg-background/10"
              >
                Contact the team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
