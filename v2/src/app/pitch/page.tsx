import Link from 'next/link';
import { communityPartnerships, investmentCase, quotes, oonchiumpaPartnership, partnershipJourney, advisoryGroup, goodsOrbit, storytellerProfiles, enterpriseVision } from '@/lib/data/content';
import { MediaSlot } from '@/components/ui/media-slot';
import { AssemblySequence } from '@/components/pitch/assembly-sequence';
import { CyclingImage } from '@/components/pitch/cycling-image';

export const metadata = {
  title: 'Pitch | Goods on Country',
  description: 'Community-designed beds from recycled plastic. Local jobs, community ownership, Indigenous enterprise.',
};

// Pick specific quotes for the pitch
const dignityQuote = quotes.find(q => q.author === 'Alfred Johnson');
const healthQuote = quotes.find(q => q.author === 'Jessica Allardyce');
const codesignQuote = quotes.find(q => q.author === 'Dianne Stokes');
const normanQuote = quotes.find(q => q.author === 'Norman Frank' && q.theme === 'community-need');

export default function PitchPage() {
  return (
    <main>

      {/* ================================================================
          1. THE HOOK
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
            What if communities owned the factory, ran the business, and built enterprise from their own waste?
          </h1>
          <p className="text-xl text-background/70 max-w-2xl mx-auto leading-relaxed">
            Thousands of people in remote Australia sleep on the floor tonight.
            We&rsquo;re building a model where communities manufacture health solutions, create local jobs,
            and own the whole thing.
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-background/20" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </section>

      {/* ================================================================
          2. THE STRETCH BED — 4 component boxes
          ================================================================ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              The Stretch Bed
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-foreground mb-4 leading-snug"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Three materials. No tools. Five minutes.
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
              26kg, supports 200kg, lasts 5+ years. Each bed diverts 20kg of plastic from landfill.
            </p>

            <div className="grid gap-12 lg:grid-cols-2 items-start">
              {/* Left: 4 component boxes */}
              <div className="grid gap-4 grid-cols-2">
                {/* Recycled plastic frame */}
                <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  <MediaSlot
                    src="/images/pitch/bed-frame-legs.jpg"
                    alt="Recycled HDPE plastic legs — pressed from community waste"
                    label="Recycled plastic legs"
                    aspect="4/3"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">Recycled Plastic Frame</h3>
                    <p className="text-xs text-muted-foreground">HDPE legs from community plastic. 20kg diverted per bed.</p>
                  </div>
                </div>

                {/* Steel poles */}
                <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  <MediaSlot
                    src="/images/pitch/bed-poles.jpg"
                    alt="Galvanised steel pole — 26.9mm OD"
                    label="Steel pole"
                    aspect="4/3"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">Galvanised Steel Poles</h3>
                    <p className="text-xs text-muted-foreground">Two 26.9mm poles thread through canvas sleeves.</p>
                  </div>
                </div>

                {/* Canvas */}
                <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  <MediaSlot
                    src="/images/pitch/bed-canvas.jpg"
                    alt="Heavy-duty Australian canvas with Goods. branding"
                    label="Canvas"
                    aspect="4/3"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">Heavy-Duty Canvas</h3>
                    <p className="text-xs text-muted-foreground">Washable, repairable, built for remote conditions.</p>
                  </div>
                </div>

                {/* QR Code Tracking */}
                <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  <MediaSlot
                    src="/images/media-pack/nic-with-elder-on-verandah.jpg"
                    alt="Nic sitting on a Stretch Bed with an elder on a verandah — ongoing support and connection"
                    label="Support system"
                    aspect="4/3"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">Support System</h3>
                    <p className="text-xs text-muted-foreground">Every bed tracked. Ask questions, stay connected, get support.</p>
                  </div>
                </div>
              </div>

              {/* Right: Assembly sequence animation */}
              <div>
                <AssemblySequence />
                <div className="grid grid-cols-3 gap-3 mt-8">
                  <div className="text-center p-3 rounded-xl border border-border">
                    <div className="text-xl font-bold text-primary">$350</div>
                    <div className="text-xs text-muted-foreground mt-0.5">to make</div>
                  </div>
                  <div className="text-center p-3 rounded-xl border border-border">
                    <div className="text-xl font-bold text-primary">$600</div>
                    <div className="text-xs text-muted-foreground mt-0.5">RRP</div>
                  </div>
                  <div className="text-center p-3 rounded-xl border border-border">
                    <div className="text-xl font-bold text-primary">$1,500</div>
                    <div className="text-xs text-muted-foreground mt-0.5">regular bed in community</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          3. HERO IMAGE — Large photo of finished bed in use
          ================================================================ */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-5xl mx-auto">
            <MediaSlot
              src="/images/media-pack/woman-on-red-stretch-bed.jpg"
              alt="A woman sitting on a Stretch Bed with red recycled plastic legs in Alice Springs"
              label="Stretch Bed in use — red legs, Alice Springs"
              aspect="16/9"
              className="rounded-2xl overflow-hidden"
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          4. ON-COUNTRY MANUFACTURING — Rubbish to bed
          ================================================================ */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-background/40 mb-4">
              On-Country Manufacturing
            </p>
            <h2
              className="text-3xl md:text-4xl font-light mb-4 leading-snug"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              From rubbish to bed
            </h2>
            <p className="text-background/60 mb-12 max-w-2xl">
              A containerised production plant that turns community plastic waste into bed components. Local people do the making.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
              {/* Step 1: Collect */}
              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <MediaSlot
                  src="/images/process/color-samples.jpg"
                  alt="Sorted recycled plastic from community waste"
                  label="Collect"
                  aspect="4/3"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <h3 className="text-lg font-semibold text-background">Collect</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">Local people gather plastic waste from around community. Sorted by colour, cleaned, ready for shredding.</p>
                </div>
              </div>

              {/* Step 2: Shred */}
              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <MediaSlot
                  src="/images/process/container-factory.jpg"
                  alt="Plastic shredder inside containerised production plant"
                  label="Shred"
                  aspect="4/3"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <h3 className="text-lg font-semibold text-background">Shred</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">Plastic goes into the shredder — a containerised unit that stays on site between production runs.</p>
                </div>
              </div>

              {/* Step 3: Press (cycling images) */}
              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <CyclingImage
                  images={[
                    { src: '/images/process/hydraulic-press.jpg', alt: 'Hydraulic press compressing recycled plastic into sheets' },
                    { src: '/images/process/pressed-sheets.jpg', alt: 'Stack of pressed recycled plastic legs in multiple colours' },
                  ]}
                  aspect="4/3"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <h3 className="text-lg font-semibold text-background">Press</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">Shredded plastic is heated and pressed into durable sheets. Each colour is unique — made from whatever plastic the community collected.</p>
                </div>
              </div>

              {/* Step 4: Cut */}
              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <MediaSlot
                  src="/images/process/cnc-cutter.jpg"
                  alt="CNC router cutting bed leg components from pressed plastic sheet"
                  label="Cut"
                  aspect="4/3"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <h3 className="text-lg font-semibold text-background">Cut</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">A CNC router cuts bed leg components from the pressed sheets. Precise, repeatable, minimal waste.</p>
                </div>
              </div>

              {/* Step 5: Assemble (cycling images) */}
              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <CyclingImage
                  images={[
                    { src: '/images/pitch/bed-seq-1-leg-pole.jpg', alt: 'First pole threads through canvas sleeve' },
                    { src: '/images/pitch/bed-seq-2-legs-pole.jpg', alt: 'Second pole through the other side' },
                    { src: '/images/pitch/bed-seq-3-all-parts.jpg', alt: 'Legs clip onto both poles' },
                    { src: '/images/pitch/bed-assembled.jpg', alt: 'Assembled Stretch Bed' },
                  ]}
                  aspect="4/3"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                    <h3 className="text-lg font-semibold text-background">Assemble</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">Thread one pole through each side of the canvas. Clip the legs on. Done in under 5 minutes, no tools.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-background/40 text-sm">~30 beds per week &middot; 20kg plastic diverted per bed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. THE PARTNERSHIP — Oonchiumpa, community ownership, sovereignty
          ================================================================ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              The Partnership
            </p>
            <h2
              className="text-3xl md:text-5xl font-light text-foreground mb-6 leading-snug"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Start to finish, owned and run by community
            </h2>
            <p className="text-lg text-muted-foreground mb-4 max-w-3xl">
              Through our partnership with {oonchiumpaPartnership.headline} — {oonchiumpaPartnership.subheadline} —
              we&rsquo;re building a model where the entire process is community-led.
              From collecting waste to delivering beds. Support enterprise, health outcomes, pride, and sovereignty.
            </p>

            <div className="grid gap-12 lg:grid-cols-2 items-start mt-12">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {oonchiumpaPartnership.description}
                </p>

                {/* What community ownership means */}
                <div className="space-y-4 mb-8">
                  {[
                    { title: 'Enterprise', desc: 'Community-owned manufacturing — local people making and selling products' },
                    { title: 'Health outcomes', desc: 'Beds preventing disease, washing machines breaking the scabies cycle' },
                    { title: 'Pride & sovereignty', desc: 'Indigenous intelligence guiding design, production, and business decisions' },
                    { title: 'New ideas', desc: 'A platform for other products and enterprises generated by and from community' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 items-start">
                      <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-foreground">{item.title}</span>
                        <span className="text-muted-foreground"> — {item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kristy Bloomfield quote */}
                <blockquote className="border-l-2 border-primary pl-6">
                  <p
                    className="text-xl text-foreground leading-relaxed mb-3"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    &ldquo;{oonchiumpaPartnership.kristyQuote.text}&rdquo;
                  </p>
                  <footer className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{oonchiumpaPartnership.kristyQuote.author}</span>
                    <span> &mdash; {oonchiumpaPartnership.kristyQuote.context}</span>
                  </footer>
                </blockquote>
              </div>

              {/* Fred's video testimonial */}
              <div>
                <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-4">
                  <iframe
                    src={oonchiumpaPartnership.fredVideo.embedUrl}
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {oonchiumpaPartnership.fredVideo.title}
                </p>
              </div>
            </div>

            {/* Partnership iteration journey */}
            <div className="mt-20">
              <h3
                className="text-2xl md:text-3xl font-light text-foreground mb-10"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                How we got here
              </h3>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border hidden md:block" />
                <div className="space-y-8">
                  {partnershipJourney.map((step) => (
                    <div key={step.step} className="flex gap-6 items-start">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0 relative z-10">
                        {step.step}
                      </div>
                      <div className="pt-1.5">
                        <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          6. IMPACT TO DATE
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

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              {[
                { value: '369+', label: 'beds delivered' },
                { value: '8+', label: 'communities' },
                { value: '2+', label: 'years with Bloomfield family' },
                { value: '20kg', label: 'plastic per bed' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-6 rounded-xl bg-background/5 border border-background/10">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-background/50">{stat.label}</div>
                </div>
              ))}
            </div>

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
          7. COMMUNITY VOICES
          ================================================================ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Community voices
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-8">
              {[dignityQuote, healthQuote, codesignQuote, normanQuote].filter(Boolean).map((q) => (
                <div key={q!.author + q!.theme} className="flex flex-col">
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
          8. ADVISORY BOARD
          ================================================================ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Advisory board
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-foreground mb-12 leading-snug"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Who guides this
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {advisoryGroup.map((person) => (
                <div key={person.name} className="rounded-xl bg-background border border-border p-5">
                  <h3 className="font-semibold text-foreground">{person.name}</h3>
                  <p className="text-sm text-primary font-medium">{person.title}</p>
                  {person.org && <p className="text-xs text-muted-foreground mt-1">{person.org}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          9. GOODS ORBIT — Community partners and people we engage with
          ================================================================ */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              The Goods orbit
            </p>
            <h2
              className="text-2xl md:text-3xl font-light text-foreground mb-3 leading-snug"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              People and partners we work with
            </h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              The community members, organisations, and allies who have been part of the journey — co-designing, testing, delivering, and advocating.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {goodsOrbit.map((person) => (
                <div key={person.name} className="rounded-xl border border-border p-4">
                  <h3 className="font-semibold text-foreground text-sm">{person.name}</h3>
                  <p className="text-xs text-primary font-medium">{person.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{person.org}</p>
                  <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          10. STORYTELLERS — Community voices, Empathy Ledger
          ================================================================ */}
      <section className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-background/40 mb-4">
              Storytellers
            </p>
            <h2
              className="text-2xl md:text-3xl font-light mb-3"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Listening to impact
            </h2>
            <p className="text-background/60 mb-10 max-w-2xl">
              Every product decision is refined by community feedback. Through our Empathy Ledger process,
              storytellers own their narratives — sharing on their terms, shaping what gets built next.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {storytellerProfiles.map((person) => (
                <div key={person.id} className="rounded-xl bg-background/5 border border-background/10 p-4">
                  <h3 className="font-semibold text-background text-sm">{person.name}</h3>
                  {person.role && <p className="text-xs text-primary">{person.role}</p>}
                  <p className="text-xs text-background/40 mt-0.5">{person.location}</p>
                  <p
                    className="text-xs text-background/50 mt-2 leading-relaxed italic"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    &ldquo;{person.keyQuote.length > 80 ? person.keyQuote.slice(0, 80) + '...' : person.keyQuote}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-background/30 mt-6 text-center">
              All stories shared with consent through Empathy Ledger &mdash; community members own their narratives.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          11. THE ASK — $500K scaling vision
          ================================================================ */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-background/40 mb-6">
              The ask
            </p>
            <h2
              className="text-4xl md:text-6xl font-light mb-6"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              $500,000
            </h2>
            <p className="text-xl text-background/60 mb-16 max-w-2xl mx-auto">
              To go hard now — support a model that brings enterprise ownership back to community,
              and design something that can be copied by every community across Australia.
            </p>

            <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto mb-16">
              <div className="rounded-2xl bg-background/5 border border-background/10 p-8 text-left">
                <div className="text-3xl font-bold text-primary mb-2">$150K</div>
                <h3 className="text-lg font-semibold text-background mb-3">Production at Scale</h3>
                <p className="text-sm text-background/50 leading-relaxed">
                  Complete and deploy the production plant. Capacity for 30+ beds per week across multiple communities.
                </p>
              </div>
              <div className="rounded-2xl bg-background/5 border border-background/10 p-8 text-left">
                <div className="text-3xl font-bold text-primary mb-2">$200K</div>
                <h3 className="text-lg font-semibold text-background mb-3">Beds to Community</h3>
                <p className="text-sm text-background/50 leading-relaxed">
                  300+ beds deployed through community partnerships. Health hardware reaching families who need it.
                </p>
              </div>
              <div className="rounded-2xl bg-background/5 border border-background/10 p-8 text-left">
                <div className="text-3xl font-bold text-primary mb-2">$150K</div>
                <h3 className="text-lg font-semibold text-background mb-3">Enterprise Model</h3>
                <p className="text-sm text-background/50 leading-relaxed">
                  Build the replicable model — training, documentation, and support for community-owned enterprises.
                </p>
              </div>
            </div>

            <div className="bg-background/5 border border-background/10 rounded-2xl p-8 md:p-10 max-w-2xl mx-auto mb-16 text-left">
              <h3
                className="text-xl font-light text-background mb-4"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                The story this tells
              </h3>
              <p className="text-background/60 leading-relaxed">
                Indigenous intelligence and ownership. A model designed by community, run by community,
                that tells the story of what&rsquo;s possible when enterprise grows through action —
                not just in Australia, but everywhere communities want to manufacture their own future.
              </p>
            </div>

            {/* Supported by */}
            <div>
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
          11. CLOSING
          ================================================================ */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-3xl md:text-5xl font-light text-foreground leading-snug mb-8"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              We&rsquo;re not building beds.<br />
              We&rsquo;re building local enterprise.
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
              Durable products from community waste. Local jobs. Community ownership.
              A model that can be copied everywhere.
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
