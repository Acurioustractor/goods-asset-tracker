import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CostPlayground } from './play';
import { CostModelProvider } from './cost-model-context';
import {
  BreakevenChart,
  CostBreakdown,
  CostCurveChart,
  CostDock,
  FullyLoadedChart,
  IdiotIndexChart,
  MoneySankey,
  Where750Chart,
} from './cost-charts';

export const metadata: Metadata = {
  title: 'What a Bed Really Costs',
  description:
    'The cost-per-bed story for the Stretch Bed. One more bed costs about $685 today and about $426 once we press our own plastic legs. The $1,780 figure is a year of fixed costs divided across too few beds. Cost model v6.',
};

const displayFont = { fontFamily: 'var(--font-display, Georgia, serif)' } as const;

// ─── Reusable diagram frame ─────────────────────────────────────────────────
// Used only for the ILLUSTRATIVE figures (bed anatomy, assembly, plastic journey,
// community-ownership) served from v2/public as wide exports. Plain <img> by design:
// these are infographics, not photographs, and we don't want next/image to constrain
// or re-encode them. The QUANTITATIVE charts are now live Recharts components
// (see cost-charts.tsx), driven by the cost-model engine — not static images.
function Diagram({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm md:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="mx-auto h-auto w-full" loading="lazy" />
      </div>
      {caption ? (
        <figcaption className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

// ─── Voice: a real community quote to break up the numbers ──────────────────
// Only quotes already cleared for public use belong here. Linda Turner's is used
// across the public site. Mykel's / Fred's are consent-pending (see the staged
// blog) — add them once consent lands.
function PullQuote({
  quote,
  name,
  place,
  photo,
  tone = 'light',
}: {
  quote: string;
  name: string;
  place: string;
  photo?: string;
  tone?: 'light' | 'dark';
}) {
  const sub = tone === 'dark' ? 'text-background/60' : 'text-muted-foreground';
  return (
    <figure className="my-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={name} className="h-20 w-20 flex-shrink-0 rounded-full object-cover sm:h-24 sm:w-24" />
        ) : null}
        <div>
          <blockquote className="text-2xl font-light italic leading-snug md:text-3xl" style={displayFont}>
            &ldquo;{quote}&rdquo;
          </blockquote>
          <figcaption className={`mt-3 text-sm ${sub}`}>
            <span className="font-medium">{name}</span> &middot; {place}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}

function Beat({
  kicker,
  heading,
  children,
  tone = 'light',
}: {
  kicker: string;
  heading: string;
  children: React.ReactNode;
  tone?: 'light' | 'dark';
}) {
  const sectionClass =
    tone === 'dark' ? 'bg-foreground text-background' : 'bg-background text-foreground';
  const kickerClass = tone === 'dark' ? 'text-background/50' : 'text-accent';
  return (
    <section className={`py-20 md:py-28 ${sectionClass}`}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <p className={`mb-4 text-sm uppercase tracking-[0.25em] ${kickerClass}`}>{kicker}</p>
          <h2
            className="mb-6 text-3xl font-light leading-tight md:text-5xl"
            style={displayFont}
          >
            {heading}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}

export default function CostStoryPage() {
  return (
    <CostModelProvider>
      <CostDock />
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-foreground py-28 text-background md:py-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/product/stretch-bed-in-use.jpg"
          alt="A man resting on a Stretch Bed in a remote community yard, the recycled-plastic X-trestle legs on red earth"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/40" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <p className="mb-5 text-sm uppercase tracking-[0.3em] text-background/50">
              Cost model v6 &middot; 2026
            </p>
            <h1
              className="mb-8 text-5xl font-light leading-[1.05] md:text-7xl"
              style={displayFont}
            >
              What a bed really costs
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed text-background/80 md:text-2xl">
              People looked at our books and said we lose a thousand dollars on every bed. That&rsquo;s
              not quite right. Making one more bed costs about{' '}
              <strong className="font-semibold text-background">$685</strong> today, or about{' '}
              <strong className="font-semibold text-background">$426</strong> once we press our own
              plastic legs. The <strong className="font-semibold text-background">$1,780</strong> they
              saw is a full year of running costs divided across the few hundred beds we make today.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
                <Link href="#play">Play with the model</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-background/40 bg-transparent text-background hover:bg-background/10 hover:text-background"
                asChild
              >
                <Link href="/shop/stretch-bed-single">Shop the Stretch Bed</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── VOICE: why we count every dollar ── */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Diagram
            src="/images/product/stretch-bed-community.jpg"
            alt="A Stretch Bed set up in a remote community home"
            caption="A Stretch Bed where it belongs, in a remote community home. This is what every number on this page is really about."
          />
          <PullQuote
            quote="We've never been asked at what sort of house we'd like to live in."
            name="Linda Turner"
            place="Tennant Creek, NT"
            photo="/images/people/linda-turner.jpg"
          />
          <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
            That&rsquo;s why we count every dollar. This was never about charity. It&rsquo;s furniture
            communities asked for, built at a price that keeps the work, and the money, on Country.
          </p>
        </div>
      </section>

      {/* ── BEAT 1: What a bed is made of ── */}
      <Beat kicker="The bill of materials" heading="What a bed is made of">
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          A Stretch Bed is three materials: recycled HDPE plastic legs, two galvanised steel poles,
          and a sheet of heavy-duty Australian canvas, plus the hardware that holds it together.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
          Add it up the way we buy it today and the parts come to{' '}
          <strong className="text-foreground">$534.79</strong> a bed. Most of that is the plastic.
          Keep an eye on it; it drives everything that follows.
        </p>
        <Diagram
          src="/images/pitch/bed-seq-3-all-parts.jpg"
          alt="The three parts of a Stretch Bed laid out together: two recycled-HDPE X-trestle legs, two galvanised steel poles, and folded canvas"
          caption="Recycled-plastic X-trestle legs, steel poles, canvas, hardware. Direct cost $534.79 on the buy-kit path."
        />
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
          It&rsquo;s an X-trestle <em>tension</em> design. The poles thread through the canvas sleeves
          and the top holes of the X-legs, so the canvas itself braces the frame. No tools, about five
          minutes.
        </p>
        <Diagram
          src="/images/pitch/bed-assembled.jpg"
          alt="The finished Stretch Bed, tensioned and standing on its X-trestle legs"
          caption="Three parts, no tools. Tension turns the canvas into the structure."
        />
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
          So what does each part actually cost? Here&rsquo;s the bill, line by line.
        </p>
        <CostBreakdown />
      </Beat>

      {/* ── BEAT 2: The plastic is the whole game ── */}
      <Beat kicker="The idiot index" heading="The plastic is the whole game" tone="dark">
        <p className="text-lg leading-relaxed text-background/70 md:text-xl">
          The &ldquo;idiot index&rdquo; asks a simple question: how much do we pay for a part versus
          what the raw material in it costs? For the plastic leg kit we pay{' '}
          <strong className="text-background">$344.05</strong> against a{' '}
          <strong className="text-background">$40</strong> shred floor. That&rsquo;s{' '}
          <strong className="text-background">8.6&times;</strong> the raw material, and{' '}
          <strong className="text-background">21.5&times;</strong> against raw polymer.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-background/70 md:text-xl">
          Steel and canvas each sit under 3&times;, and hardware is about 1.0&times;. Everything else
          is basically fair. The opportunity is the plastic, and we&rsquo;re already diverting{' '}
          <strong className="text-background">20kg of recycled HDPE</strong> from landfill per bed to
          feed it.
        </p>
        <IdiotIndexChart />
        <Diagram
          src="/images/process/shredded-plastic-tubs.jpg"
          alt="Tubs of shredded recycled HDPE plastic ready to be pressed into bed legs"
          caption="This is the plastic that goes into a bed: about $40 of shredded HDPE. We pay $344 for a city factory to press it into legs. That gap is the opportunity."
        />
        <Diagram
          src="/goods-plastic-journey.jpg"
          alt="The circular life of the plastic: collected waste, shredded, pressed into sheets, cut into X-trestle legs, assembled into a bed, into community, and back"
          caption="The circular life of the plastic. 20kg diverted from landfill per bed, and the loop closes on Country."
        />
      </Beat>

      {/* ── BEAT 3: Two questions hide in "what does a bed cost" ── */}
      <Beat
        kicker="Marginal vs fixed"
        heading="Two questions hide in &ldquo;what does a bed cost&rdquo;"
      >
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          There are really two questions. The first: <strong className="text-foreground">what does
          one more bed cost?</strong> That&rsquo;s the marginal cost, about{' '}
          <strong className="text-foreground">$685</strong> today (parts and freight), or{' '}
          <strong className="text-foreground">$426</strong> once we press our own legs.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
          The second: <strong className="text-foreground">what does it cost to keep the operation
          running at all?</strong> That&rsquo;s a fixed block of{' '}
          <strong className="text-foreground">$109,500 a year</strong>. Founder production time,
          workshop rent, field travel, admin. It&rsquo;s there whether we make 10 beds or 1,000.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
          The <strong className="text-foreground">$1,780-a-bed</strong> figure mixes the two up.
          It&rsquo;s the fixed block divided by too few beds. Spread that same cost over more beds and
          the &ldquo;fully-loaded&rdquo; number drops toward the marginal floor.
        </p>
        <FullyLoadedChart />
      </Beat>

      {/* ── BEAT 4: Where each $750 goes ── */}
      <Beat kicker="The unit economics" heading="Where each $750 goes" tone="dark">
        <p className="text-lg leading-relaxed text-background/70 md:text-xl">
          We sell the Stretch Bed for <strong className="text-background">$750</strong>. On the
          buy-kit path that leaves a contribution of{' '}
          <strong className="text-background">$65.21</strong> per bed after the{' '}
          <strong className="text-background">$684.79</strong> marginal cost.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-background/70 md:text-xl">
          Press our own legs and that changes. Marginal cost drops to{' '}
          <strong className="text-background">$425.74</strong> and contribution rises to{' '}
          <strong className="text-background">$324.26</strong> a bed. With community-collected plastic
          and fair-wage local labour, the community path lands at{' '}
          <strong className="text-background">$420.74</strong> marginal and{' '}
          <strong className="text-background">$329.26</strong> contribution.
        </p>
        <Where750Chart />
        <PullQuote
          quote="You have to bring them on the barge. You can't just take them on the boat. You have to pay for freight. It all adds up."
          name="Alfred Johnson"
          place="Palm Island, QLD"
          photo="/images/people/alfred-johnson.jpg"
          tone="dark"
        />
        <MoneySankey />
      </Beat>

      {/* ── BEAT 5: The cost-down path + breakeven ── */}
      <Beat kicker="The path to scale" heading="The cost-down path, and how many beds break even">
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          Bringing leg production in-house saves about <strong className="text-foreground">$194 a
          bed</strong>. Standing up the press takes{' '}
          <strong className="text-foreground">$112K to $222K</strong> of capex, and{' '}
          <strong className="text-foreground">$110,046</strong> of that is already spent.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
          That changes the break-even point. At $750 a bed, the buy-kit path needs{' '}
          <strong className="text-foreground">1,679 beds a year</strong> to cover the fixed block.
          Press our own legs and break-even drops to{' '}
          <strong className="text-foreground">338 beds</strong>, or{' '}
          <strong className="text-foreground">333</strong> on the community path. Same fixed costs, a
          fifth of the beds to clear them.
        </p>
        <Diagram
          src="/goods-container-plant.png"
          alt="Inside one shipping container: a shredder turns plastic to chip, a heat press presses it into sheet, and an X-trestle leg is assembled at a bench"
          caption="Shred, press, assemble. One container holds every step from plastic to leg."
        />
        <Diagram
          src="/images/process/container-factory.jpg"
          alt="The real on-Country plant: a shipping container with a plastic shredder inside, on red dirt"
          caption="The real thing, not a render: our container plant with the plastic shredder inside. Bringing the press home is what turns $344 legs into ~$150 legs."
        />
        <CostCurveChart />
        <BreakevenChart />
        <PullQuote
          quote="Now we've got our own ways, we can collaborate with our own people. Not only here. It'll be everywhere."
          name="Norman Frank"
          place="Tennant Creek, NT"
          photo="/images/people/norman-frank.jpg"
        />
      </Beat>

      {/* ── BEAT 6: The path to community ownership ── */}
      <Beat kicker="The mission" heading="The path to community ownership" tone="dark">
        <p className="text-lg leading-relaxed text-background/70 md:text-xl">
          Cheaper beds aren&rsquo;t the goal. They pay for the real one. Today we buy finished legs
          from a city supplier. Next, an On-Country plant presses them locally. After that, the plant,
          the jobs and the margin move into community hands.
        </p>
        <p className="mt-4 text-xl leading-relaxed text-background md:text-2xl" style={displayFont}>
          Our goal is to become unnecessary.
        </p>
        {/* Ownership-pathway drawing removed pending checkpoint 25 (Ben,
            2026-07-17). Restore from /api/admin/held-asset once approved. */}
        <PullQuote
          quote="I'll be rocking up every day to make them."
          name="Mykel"
          place="who helped build the beds in Alice Springs"
          tone="dark"
        />
      </Beat>

      {/* ── INTERACTIVE WIDGET ── */}
      <section id="play" className="bg-muted/30 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-accent">Try it yourself</p>
              <h2 className="text-3xl font-light leading-tight text-foreground md:text-4xl" style={displayFont}>
                Don&rsquo;t take our word for it. Run the numbers.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Set the beds per year, the sell price, and whether we buy kits or press our own legs.
                The contribution, break-even and annual surplus update live.
              </p>
            </div>
            <CostPlayground />
            <p className="mt-6 text-sm text-muted-foreground">
              Confidence: the bill of materials and the $750 sell price are verified. In-house leg
              costs, labour, freight and volumes are modelled. Cost model v6, June 2026.
            </p>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="bg-accent py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-accent-foreground md:text-4xl" style={displayFont}>
            The maths works once the making moves to Country.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-foreground/85">
            Philanthropic and patient capital bridges the gap between today&rsquo;s buy-kit price and
            the community floor. That&rsquo;s the case we&rsquo;re making.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
              asChild
            >
              <Link href="/partner">Explore the capital stack</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent-foreground/40 bg-transparent text-accent-foreground hover:bg-accent-foreground/10"
              asChild
            >
              <Link href="/shop/stretch-bed-single">Shop the Stretch Bed</Link>
            </Button>
          </div>
        </div>
      </section>

      <p className="py-6 text-center text-xs text-muted-foreground/60">
        Catalysing Impact, powered by Social Impact Hub, in partnership with QBE Foundation.
      </p>
    </CostModelProvider>
  );
}
