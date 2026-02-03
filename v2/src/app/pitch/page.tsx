import Link from 'next/link';
import { story, impact, communityPartnerships, investmentCase, quotes, journeyStories, videoTestimonials } from '@/lib/data/content';
import { media } from '@/lib/data/media';
import { MediaSlot } from '@/components/ui/media-slot';

export const metadata = {
  title: 'Pitch | Goods on Country',
  description: 'A good bed can prevent heart disease. Goods on Country is scaling on-country production of beds and essential goods for remote Australian Indigenous communities.',
};

// Pick specific quotes for the pitch
const heroQuote = quotes.find(q => q.author === 'Linda Turner');
const healthQuote = quotes.find(q => q.author === 'Jessica Allardyce');
const dignityQuote = quotes.find(q => q.author === 'Alfred Johnson');
const codesignQuote = quotes.find(q => q.author === 'Dianne Stokes');

export default function PitchPage() {
  return (
    <main>

      {/* ================================================================
          1. THE HOOK — One line that stops you
          ================================================================ */}
      <section className="min-h-[85vh] flex items-center justify-center bg-foreground text-background relative overflow-hidden">
        <div className="container mx-auto px-4 text-center py-20 relative z-10">
          <p className="text-sm uppercase tracking-widest text-primary mb-12">
            A good bed can prevent heart disease.
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-light max-w-4xl mx-auto mb-10 leading-[1.1]"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Thousands of people in remote Australia sleep on the floor tonight.
          </h1>
          <p className="text-xl text-background/50 max-w-2xl mx-auto">
            Not because they choose to. Because no one has built products that survive remote conditions — until now.
          </p>
        </div>
        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-background/20" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </section>

      {/* ================================================================
          2. THE NUMBERS — Quick, visceral
          ================================================================ */}
      <section className="py-6 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap text-center">
            {story.problem.stats.map((stat) => (
              <div key={stat.label}>
                <span className="text-2xl md:text-3xl font-bold">{stat.value}</span>
                <span className="text-primary-foreground/60 text-sm ml-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          3. THE VOICE — Let a community member speak
          ================================================================ */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote>
              <p
                className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-snug mb-8"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                &ldquo;{heroQuote?.text}&rdquo;
              </p>
              <footer className="text-muted-foreground">
                <span className="font-medium text-foreground">{heroQuote?.author}</span>
                <span className="text-muted-foreground/60"> &mdash; {heroQuote?.context}</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. WHAT WE BUILD — Product hero, not specs
          ================================================================ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              {/* Product image — /public/images/product/stretch-bed-hero.jpg */}
              <MediaSlot
                src={media.product.stretchBedHero}
                alt="The Stretch Bed — recycled plastic, steel and canvas by Goods on Country"
                label="Stretch Bed hero photo"
                aspect="4/3"
                className="order-2 lg:order-1"
              />

              <div className="order-1 lg:order-2">
                <p className="text-sm uppercase tracking-widest text-accent mb-3">
                  The Stretch Bed
                </p>
                <h2
                  className="text-3xl md:text-4xl font-light text-foreground mb-6 leading-snug"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  12kg. Supports 200kg.<br />
                  Lasts 5+ years.
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Recycled HDPE plastic legs, galvanised steel poles, heavy-duty canvas. No tools. 5-minute assembly.
                  Works inside and outside. Each bed diverts 21kg of plastic from landfill.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 rounded-xl bg-background border border-border">
                    <div className="text-2xl font-bold text-primary">$600</div>
                    <div className="text-xs text-muted-foreground mt-1">to make</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-background border border-border">
                    <div className="text-2xl font-bold text-primary">$850</div>
                    <div className="text-xs text-muted-foreground mt-1">sponsored</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-background border border-border">
                    <div className="text-2xl font-bold text-primary">$1,200</div>
                    <div className="text-xs text-muted-foreground mt-1">retail</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. WHAT'S ALREADY HAPPENED — Proof, not promises
          ================================================================ */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-background/40 mb-4">
              Impact to date
            </p>
            <h2
              className="text-3xl md:text-4xl font-light mb-12"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              This isn&rsquo;t a concept. It&rsquo;s working.
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-16">
              {[
                { value: '369+', label: 'beds delivered' },
                { value: '8+', label: 'communities' },
                { value: '40%', label: 'back to community' },
                { value: '21kg', label: 'plastic per bed' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-6 rounded-xl bg-background/5 border border-background/10">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-background/50">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Community partnerships — compact */}
            <div className="grid gap-4 sm:grid-cols-2">
              {communityPartnerships.filter(p => p.bedsDelivered > 0).map((p) => (
                <div key={p.id} className="rounded-xl bg-background/5 border border-background/10 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-background">{p.name}</h3>
                      <p className="text-xs text-background/40">{p.region}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{p.bedsDelivered}</div>
                      <div className="text-xs text-background/40">beds</div>
                    </div>
                  </div>
                  <p className="text-sm text-background/60">{p.headline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          6. COMMUNITY VOICES — Three quotes, emotional punch
          ================================================================ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              {[dignityQuote, healthQuote, codesignQuote].filter(Boolean).map((q) => (
                <div key={q!.author} className="flex flex-col">
                  <blockquote className="flex-1">
                    <p
                      className="text-lg text-foreground leading-relaxed mb-4"
                      style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                    >
                      &ldquo;{q!.text}&rdquo;
                    </p>
                  </blockquote>
                  <footer className="text-sm">
                    <span className="font-medium text-foreground">{q!.author}</span>
                    <span className="text-muted-foreground"> &mdash; {q!.context}</span>
                  </footer>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          7. THE MODEL — Simple, memorable
          ================================================================ */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-accent-foreground/50 mb-4">
              The Model
            </p>
            <h2
              className="text-3xl md:text-5xl font-light text-accent-foreground mb-4"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Commerce, not charity
            </h2>
            <p className="text-lg text-accent-foreground/70 mb-12 max-w-xl mx-auto">
              Products that are Aboriginal owned and controlled, sold commercially.
              Our job is to become unnecessary.
            </p>

            <div className="grid gap-4 md:grid-cols-3 mb-12">
              <div className="bg-accent-foreground/10 rounded-2xl p-8">
                <div className="text-5xl font-bold text-accent-foreground mb-2">40%</div>
                <div className="text-accent-foreground/70">
                  of every sale goes directly back to communities
                </div>
              </div>
              <div className="bg-accent-foreground/10 rounded-2xl p-8">
                <div className="text-5xl font-bold text-accent-foreground mb-2">100%</div>
                <div className="text-accent-foreground/70">
                  community ownership is the end goal
                </div>
              </div>
              <div className="bg-accent-foreground/10 rounded-2xl p-8">
                <div className="text-5xl font-bold text-accent-foreground mb-2">$0</div>
                <div className="text-accent-foreground/70">
                  licensing fees &mdash; they keep everything they make
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          8. THE OPPORTUNITY — Market size, demand
          ================================================================ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              The Opportunity
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-foreground mb-4"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              200&ndash;350 beds already requested
            </h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Organic demand from communities and health organisations. Not manufactured need &mdash; real people asking for real products.
            </p>

            <div className="grid gap-6 md:grid-cols-2 mb-12">
              {investmentCase.demand.slice(0, 4).map((item, i) => (
                <div key={i} className="flex gap-4 items-start p-5 rounded-xl border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">{item.person}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* The $3M stat */}
            <div className="bg-foreground text-background rounded-2xl p-8 md:p-10 text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-3">$3M / year</p>
              <p className="text-background/60 max-w-xl mx-auto">
                One Alice Springs provider sells $3 million of washing machines annually into communities &mdash;
                most ending up in dumps within 12 months. These communities deserve products built for their conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          9. VIDEO — Let them see it
          ================================================================ */}
      {videoTestimonials[0] && (
        <section className="py-20 bg-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="text-sm uppercase tracking-widest text-background/40 mb-4">
                Hear from community
              </p>
              <h2
                className="text-2xl md:text-3xl font-light text-background"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                {videoTestimonials[0].title}
              </h2>
              <p className="text-background/50 mt-2">{videoTestimonials[0].person} &middot; {videoTestimonials[0].location}</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="aspect-video rounded-xl overflow-hidden bg-background/5">
                <iframe
                  src={videoTestimonials[0].embedUrl}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          10. PRODUCTION — The asset, not the cost
          ================================================================ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <p className="text-sm uppercase tracking-widest text-accent mb-3">
                  On-Country Production
                </p>
                <h2
                  className="text-3xl md:text-4xl font-light text-foreground mb-6 leading-snug"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  A portable factory that creates jobs where they&rsquo;re needed most
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  A containerised production plant that travels to communities. Local people shred plastic waste,
                  press it into sheets, and cut bed components. ~30 beds per week. Local jobs. Local waste into local products.
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Two-container model:</span> {investmentCase.productionPlant.model}
                </p>
              </div>
              {/* Production plant — /public/images/pitch/production-plant.jpg */}
              <MediaSlot
                src={media.pitch.productionPlant}
                alt="Containerised production plant — shredding plastic waste into bed components"
                label="Production plant photo"
                aspect="4/3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          11. THE ASK — Clear, direct
          ================================================================ */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-background/40 mb-6">
              What we need
            </p>
            <h2
              className="text-4xl md:text-6xl font-light mb-4"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              {investmentCase.totalAsk}
            </h2>
            <p className="text-xl text-background/50 mb-16 max-w-xl mx-auto">
              To prove the model at scale and build the infrastructure for community ownership.
            </p>

            <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto mb-16">
              {investmentCase.fundingLines.map((line) => (
                <div key={line.id} className="rounded-2xl bg-background/5 border border-background/10 p-8 text-left">
                  <div className="text-3xl font-bold text-primary mb-2">{line.amount}</div>
                  <h3 className="text-lg font-semibold text-background mb-3">{line.title}</h3>
                  <p className="text-sm text-background/50 leading-relaxed">{line.description}</p>
                </div>
              ))}
            </div>

            {/* Supported by */}
            <div className="mb-16">
              <p className="text-xs uppercase tracking-widest text-background/30 mb-4">Supported by</p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {investmentCase.funders.map((f) => (
                  <span key={f.name} className="text-background/60 text-sm font-medium">
                    {f.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          12. CLOSING — Emotional, memorable
          ================================================================ */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-3xl md:text-5xl font-light text-foreground leading-snug mb-8"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              We&rsquo;re not building beds.<br />
              We&rsquo;re building a model where communities manufacture their own future.
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
              Durable products from community waste. Local jobs. Community ownership.
              The disposable furniture cycle ends here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/partner"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Partner With Us
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-border text-foreground rounded-xl text-lg font-medium hover:bg-muted transition-colors"
              >
                Get in Touch
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <Link
                href="/pitch/document"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Download as PDF
              </Link>
              <span className="text-muted-foreground/30">|</span>
              <span>hi@act.place</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
