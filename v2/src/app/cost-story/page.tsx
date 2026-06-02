import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CostPlayground } from './play';

export const metadata: Metadata = {
  title: 'What a Bed Really Costs',
  description:
    'The cost-per-bed story for the Stretch Bed. One more bed costs about $685 today and ~$426 once we press our own plastic legs. The scary $1,780 is just fixed costs divided by too few beds. Cost model v6.',
};

const displayFont = { fontFamily: 'var(--font-display, Georgia, serif)' } as const;

// ─── Reusable diagram frame ─────────────────────────────────────────────────
// PNGs live in v2/public and are served at the site root (e.g. /goods-idiot-index.png).
// Plain <img> by design: these are wide infographic exports, not photographs, and
// we don't want next/image to constrain or re-encode them.
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
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-foreground py-28 text-background md:py-40">
        <div className="container mx-auto px-4">
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
              One more bed costs about <strong className="font-semibold text-background">$685</strong>{' '}
              today and <strong className="font-semibold text-background">~$426</strong> once we press
              our own plastic legs. The scary{' '}
              <strong className="font-semibold text-background">$1,780</strong> is just fixed costs
              divided by too few beds.
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

      {/* ── BEAT 1: What a bed is made of ── */}
      <Beat kicker="The bill of materials" heading="What a bed is made of">
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          A Stretch Bed is three honest materials: recycled HDPE plastic legs, two galvanised steel
          poles, and a sheet of heavy-duty Australian canvas, plus the hardware that holds it
          together.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
          Add it up the way we buy it today and the parts come to{' '}
          <strong className="text-foreground">$534.79</strong> a bed. The single biggest line is the
          plastic. That&rsquo;s not a detail; it&rsquo;s the whole story.
        </p>
        <Diagram
          src="/goods-anatomy-bed.png"
          alt="Exploded diagram of a Stretch Bed showing recycled plastic legs, galvanised steel poles, canvas and hardware with the cost of each part"
          caption="Recycled plastic legs, steel poles, canvas, hardware — direct cost $534.79 on the buy-kit path."
        />
      </Beat>

      {/* ── BEAT 2: The plastic is the whole game ── */}
      <Beat kicker="The idiot index" heading="The plastic is the whole game" tone="dark">
        <p className="text-lg leading-relaxed text-background/70 md:text-xl">
          The &ldquo;idiot index&rdquo; asks: how much do we pay for a part versus what the raw
          material in it actually costs? For the plastic leg kit we pay{' '}
          <strong className="text-background">$344.05</strong> against a{' '}
          <strong className="text-background">$40</strong> shred floor &mdash; an index of{' '}
          <strong className="text-background">8.6&times;</strong> (and{' '}
          <strong className="text-background">21.5&times;</strong> against raw polymer).
        </p>
        <p className="mt-4 text-lg leading-relaxed text-background/70 md:text-xl">
          Steel sits at 2.1&times;, canvas 2.4&times;, hardware roughly 1.0&times;. Everything else is
          basically fair. The opportunity is the plastic, and we&rsquo;re already diverting{' '}
          <strong className="text-background">20kg of recycled HDPE</strong> from landfill per bed to
          feed it.
        </p>
        <div className="overflow-hidden rounded-3xl border border-background/15 bg-background/5 p-3 shadow-sm md:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/goods-idiot-index.png"
            alt="Idiot index chart: paid price versus raw-material floor for each bed component, with the plastic kit at 8.6 times"
            className="mx-auto h-auto w-full"
            loading="lazy"
          />
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-background/50">
          Plastic kit 8.6&times; the shred floor. Press it ourselves and the index collapses.
        </p>
        <Diagram
          src="/goods-sankey-plastic.png"
          alt="Sankey flow of plastic from collected community waste through shred and press into bed legs"
          caption="From community waste to bed leg: every kilogram pressed on-Country is a kilogram we stop buying."
        />
      </Beat>

      {/* ── BEAT 3: Two questions hide in "what does a bed cost" ── */}
      <Beat
        kicker="Marginal vs fixed"
        heading="Two questions hide in &ldquo;what does a bed cost&rdquo;"
      >
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          There are really two questions. <strong className="text-foreground">What does one more
          bed cost?</strong> &mdash; that&rsquo;s the marginal cost: about{' '}
          <strong className="text-foreground">$685</strong> today (parts + freight), or{' '}
          <strong className="text-foreground">~$426</strong> once we press our own legs.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
          The second question is <strong className="text-foreground">what does it cost to keep the
          whole operation running?</strong> That&rsquo;s a fixed block of{' '}
          <strong className="text-foreground">$109,500 a year</strong> &mdash; founder production
          time, workshop rent, field travel and admin &mdash; that exists whether we make 10 beds or
          1,000.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
          The infamous <strong className="text-foreground">$1,780-a-bed</strong> figure is a myth of
          arithmetic: it&rsquo;s the fixed block divided by too few beds. Spread the same fixed cost
          over more beds and the &ldquo;fully-loaded&rdquo; number falls fast toward the marginal
          floor.
        </p>
        <Diagram
          src="/goods-fully-loaded-volume.png"
          alt="Curve showing fully-loaded cost per bed falling toward the marginal cost as annual volume rises, debunking the $1,780 figure"
          caption="Fully-loaded cost per bed = marginal cost + fixed block ÷ beds made. Volume is the lever."
        />
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
          Press our own legs and the picture transforms: marginal cost drops to{' '}
          <strong className="text-background">$425.74</strong> and contribution jumps to{' '}
          <strong className="text-background">$324.26</strong> a bed. With free community-collected
          plastic and fair-wage local labour, the community path lands at{' '}
          <strong className="text-background">$420.74</strong> marginal /{' '}
          <strong className="text-background">$329.26</strong> contribution.
        </p>
        <div className="overflow-hidden rounded-3xl border border-background/15 bg-background/5 p-3 shadow-sm md:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/goods-where-750-goes.png"
            alt="Breakdown of the $750 sell price into materials, freight and contribution across the buy-kit and in-house paths"
            className="mx-auto h-auto w-full"
            loading="lazy"
          />
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-background/50">
          $750 in. Materials, freight, then contribution &mdash; the slice that keeps the lights on
          grows when we make instead of buy.
        </p>
        <Diagram
          src="/goods-sankey-money.png"
          alt="Sankey flow of the $750 sell price splitting into materials, freight and contribution toward fixed costs"
          caption="The same $750, followed dollar by dollar from sale to surplus."
        />
      </Beat>

      {/* ── BEAT 5: The cost-down path + breakeven ── */}
      <Beat kicker="The path to scale" heading="The cost-down path, and how many beds break even">
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          Bringing leg production in-house saves about <strong className="text-foreground">$194 a
          bed</strong>. It takes capex of <strong className="text-foreground">$112K&ndash;$222K</strong> gross
          to stand up the press, of which <strong className="text-foreground">$110,046</strong> is
          already invested.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
          That cost-down moves the break-even point dramatically. At $750 a bed, the buy-kit path
          needs <strong className="text-foreground">1,679 beds a year</strong> to cover the fixed
          block. Press our own legs and break-even drops to{' '}
          <strong className="text-foreground">338 beds</strong> &mdash; or{' '}
          <strong className="text-foreground">333</strong> on the community path. Same fixed costs;
          five times fewer beds to clear them.
        </p>
        <Diagram
          src="/goods-cost-curve.png"
          alt="Cost-down curve showing marginal cost per bed falling from the buy-kit path to the in-house and community paths"
          caption="The cost-down: buy-kit $684.79 → in-house $425.74 → community $420.74 marginal cost per bed."
        />
        <Diagram
          src="/goods-breakeven.png"
          alt="Break-even chart comparing 1,679 beds for the buy-kit path against 338 in-house and 333 community beds per year at $750"
          caption="Break-even beds per year at $750: buy-kit 1,679, in-house 338, community 333."
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
            Philanthropic and patient capital closes the gap between the buy-kit price and the
            community floor. That&rsquo;s the whole investment case.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-accent-foreground text-accent hover:bg-accent-foreground/90"
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
    </>
  );
}
