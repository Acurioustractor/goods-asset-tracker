import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { brand, story, partners } from '@/lib/data/content';
import { STRETCH_BED } from '@/lib/data/products';
import { getFeaturedVoices, getHeroQuotes, getJourneyNarratives } from '@/lib/empathy-ledger/featured-voices';

export const metadata = {
  title: 'Brand & Comms | Goods on Country',
  description:
    'Voice, photography, storyteller voices, slide deck, and asset library for Goods on Country. For media, funders, partners, and anyone telling our story.',
};

// Re-validate from Empathy Ledger every 5 minutes so consent state stays fresh.
export const revalidate = 300;

const ASSET_EMAIL = 'hi@act.place';

const voicePrinciples = [
  {
    title: 'Lead with impact, not charity',
    body: 'A washing machine is cardiac prevention. A bed is medical recovery. We are an enterprise, never a gift.',
  },
  {
    title: 'Centre community voices',
    body: 'Quote real people by name, with location, with consent. Their words carry the work. Ours frames it.',
  },
  {
    title: 'Be specific',
    body: 'Real numbers, real materials, real places. "26kg, 200kg load" beats "lightweight". "Tennant Creek" beats "remote Australia".',
  },
  {
    title: 'Plain, not polished',
    body: 'Short sentences. Concrete nouns. Active verbs. No corporate gloss.',
  },
  {
    title: 'Show the model',
    body: 'Manufacturing transfers to community ownership. Our job is to become unnecessary.',
  },
];

const bannedSamples = [
  'donate',
  'donation',
  'charity',
  'beneficiaries',
  'empower',
  'unlock',
  'leverage',
  'synergy',
  'ecosystem',
  'GTM',
  'disrupting',
  'innovative',
  'game-changer',
  'em dashes',
];

const imageCategories = [
  { name: 'Stretch Bed', count: 14, sample: '/images/product/stretch-bed-hero.jpg' },
  { name: 'Pakkimjalki Kari', count: 6, sample: '/images/media-pack/washing-machine-enclosure-sunset.jpg' },
  { name: 'Storyteller portraits', count: 8, sample: '/images/people/dianne-stokes.jpg' },
  { name: 'Process & manufacturing', count: 16, sample: '/images/process/04-build.jpg' },
  { name: 'Community context', count: 1, sample: '/images/community/tennant-creek.jpg' },
  { name: 'Brand & lifestyle', count: 9, sample: '/images/media-pack/goods-branding-golden-hour.jpg' },
];

export default async function BrandPage() {
  const [featuredStorytellers, heroQuotes, journeyNarratives] = await Promise.all([
    getFeaturedVoices(8),
    getHeroQuotes(),
    getJourneyNarratives(),
  ]);
  const liveCount = featuredStorytellers.filter((v) => v.liveFromEL).length;

  return (
    <main style={{ backgroundColor: '#FDF8F3', color: '#2E2E2E' }}>
      {/* Hero */}
      <section className="border-b" style={{ borderColor: '#E8DED4' }}>
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
          <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: '#8B9D77' }}>
            Brand & Comms
          </p>
          <h1
            className="text-4xl md:text-6xl font-light leading-tight mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {brand.taglineAlt}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8" style={{ color: '#5E5E5E' }}>
            Voice, storyteller voices, image library, and the deck used in every live session.
            For media, funders, partners, and anyone telling the Goods on Country story.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/decks/live-session-deck.html">Open the live deck</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={`mailto:${ASSET_EMAIL}?subject=Goods%20brand%20assets%20request`}>
                Request assets
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/stories">Storyteller library</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Voice */}
      <section className="border-b" style={{ borderColor: '#E8DED4' }}>
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
          <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#8B9D77' }}>
                01 / Voice
              </p>
              <h2
                className="text-2xl md:text-3xl font-light leading-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Five principles. Hard rules.
              </h2>
            </div>
            <div className="space-y-6">
              {voicePrinciples.map((p, i) => (
                <div key={p.title} className="grid grid-cols-[40px_1fr] gap-4">
                  <span
                    className="text-2xl font-light"
                    style={{ fontFamily: 'Georgia, serif', color: '#C45C3E' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-medium mb-1">{p.title}</h3>
                    <p className="text-sm" style={{ color: '#5E5E5E' }}>
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-6 mt-6 border-t" style={{ borderColor: '#E8DED4' }}>
                <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#8B9D77' }}>
                  Banned, no exceptions
                </p>
                <div className="flex flex-wrap gap-2">
                  {bannedSamples.map((w) => (
                    <span
                      key={w}
                      className="text-xs px-2.5 py-1 rounded"
                      style={{
                        backgroundColor: 'rgba(196, 92, 62, 0.08)',
                        color: '#C45C3E',
                        textDecoration: 'line-through',
                      }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ color: '#7A7A7A' }}>
                  Always capitalise: On-Country, Country, Elder, First Nations, Pakkimjalki Kari, Stretch Bed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storyteller voices */}
      <section className="border-b" style={{ borderColor: '#E8DED4' }}>
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
          <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#8B9D77' }}>
                02 / Voices
              </p>
              <h2
                className="text-2xl md:text-3xl font-light leading-tight mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Listen to the people we work with.
              </h2>
              <p className="text-sm mb-4" style={{ color: '#5E5E5E' }}>
                Every quote is verified. Consent is on file. Storytellers can update or remove anytime.
                Always credit by name and community.
              </p>
              {liveCount > 0 && (
                <p className="text-xs mb-4 flex items-center gap-2" style={{ color: '#8B9D77' }}>
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#8B9D77' }} />
                  {liveCount} of {featuredStorytellers.length} pulled live from Empathy Ledger (consent verified)
                </p>
              )}
              <Link
                href="/stories"
                className="text-sm underline underline-offset-4"
                style={{ color: '#C45C3E' }}
              >
                Full storyteller library →
              </Link>
            </div>
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {featuredStorytellers.map((s) => (
                  <div key={s.id} className="text-center">
                    <div className="aspect-square relative rounded overflow-hidden mb-2 bg-stone-100">
                      <Image
                        src={s.photo}
                        alt={s.photoAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                      {s.liveFromEL && (
                        <span
                          className="absolute top-1 right-1 w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#8B9D77' }}
                          aria-label="Live syndicated story in Empathy Ledger"
                          title="Live syndicated story in Empathy Ledger"
                        />
                      )}
                    </div>
                    <p className="text-xs font-medium leading-tight">{s.name}</p>
                    <p className="text-xs" style={{ color: '#8B9D77' }}>
                      {s.location}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-4 border-t" style={{ borderColor: '#E8DED4' }}>
                {heroQuotes.map((q, i) => (
                  <blockquote key={i} className="pl-4 border-l-2" style={{ borderColor: '#C45C3E' }}>
                    <p
                      className="text-base md:text-lg italic leading-relaxed mb-1"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      &ldquo;{q.text}&rdquo;
                    </p>
                    <footer className="text-xs" style={{ color: '#8B9D77' }}>
                      {q.author}, {q.context}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The product */}
      <section className="border-b" style={{ borderColor: '#E8DED4', backgroundColor: '#fff' }}>
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#8B9D77' }}>
                03 / The product
              </p>
              <h2
                className="text-2xl md:text-3xl font-light leading-tight mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {STRETCH_BED.name}
              </h2>
              <p className="text-sm mb-6" style={{ color: '#5E5E5E' }}>
                {STRETCH_BED.tagline}
              </p>
              <dl className="text-sm grid grid-cols-2 gap-x-6 gap-y-2">
                <dt style={{ color: '#7A7A7A' }}>Weight</dt>
                <dd>{STRETCH_BED.specs.weight}</dd>
                <dt style={{ color: '#7A7A7A' }}>Load capacity</dt>
                <dd>{STRETCH_BED.specs.loadCapacity}</dd>
                <dt style={{ color: '#7A7A7A' }}>Dimensions</dt>
                <dd>{STRETCH_BED.specs.dimensions}</dd>
                <dt style={{ color: '#7A7A7A' }}>Assembly</dt>
                <dd>{STRETCH_BED.specs.assemblyTime}</dd>
                <dt style={{ color: '#7A7A7A' }}>Plastic diverted</dt>
                <dd>{STRETCH_BED.specs.plasticDiverted}</dd>
                <dt style={{ color: '#7A7A7A' }}>Warranty</dt>
                <dd>{STRETCH_BED.specs.warranty}</dd>
                <dt style={{ color: '#7A7A7A' }}>Design life</dt>
                <dd>{STRETCH_BED.specs.designLifespan}</dd>
              </dl>
              <p className="text-xs mt-6" style={{ color: '#7A7A7A' }}>
                Recycled HDPE plastic legs. Galvanised steel poles ({STRETCH_BED.materials.frame.detail}, {STRETCH_BED.materials.frame.supplier}). Heavy-duty Australian canvas (Centre Canvas, Alice Springs).
              </p>
            </div>
            <div className="aspect-[4/5] relative rounded overflow-hidden bg-stone-100">
              <Image
                src="/images/product/stretch-bed-hero.jpg"
                alt="The Stretch Bed at golden hour"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Live session deck */}
      <section className="border-b" style={{ borderColor: '#E8DED4' }}>
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
          <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#8B9D77' }}>
                04 / Live deck
              </p>
              <h2
                className="text-2xl md:text-3xl font-light leading-tight mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Ten slides. Five minutes. The same deck for every live session.
              </h2>
              <p className="text-sm mb-6" style={{ color: '#5E5E5E' }}>
                Open the deck to present from a browser, share the URL with a funder, or print to PDF.
                Speaker notes built in, audience-specific asks for slide 10.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/decks/live-session-deck.html">Open deck</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href="/decks/live-session-deck.html#1" target="_blank" rel="noopener">
                    Open in new tab
                  </a>
                </Button>
              </div>
              <p className="text-xs mt-4" style={{ color: '#7A7A7A' }}>
                Keys inside the deck: ← → space to navigate, n speaker notes, o overview, p print to PDF.
              </p>
            </div>
            <div
              className="aspect-video relative rounded overflow-hidden border"
              style={{ borderColor: '#E8DED4' }}
            >
              <iframe
                src="/decks/live-session-deck.html"
                title="Goods on Country live session deck"
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Image library */}
      <section className="border-b" style={{ borderColor: '#E8DED4' }}>
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
          <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#8B9D77' }}>
                05 / Photography
              </p>
              <h2
                className="text-2xl md:text-3xl font-light leading-tight mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Real moments On-Country.
              </h2>
              <p className="text-sm mb-6" style={{ color: '#5E5E5E' }}>
                No stock. No staged sets. No imported lifestyle photography. Golden hour by default.
                Elders centred. Honest backgrounds.
              </p>
              <p className="text-sm mb-2" style={{ color: '#5E5E5E' }}>
                For specific photos with usage rights and credits, request from{' '}
                <a
                  href={`mailto:${ASSET_EMAIL}?subject=Goods%20photo%20request`}
                  className="underline underline-offset-4"
                  style={{ color: '#C45C3E' }}
                >
                  {ASSET_EMAIL}
                </a>
                .
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {imageCategories.map((c) => (
                <div key={c.name}>
                  <div className="aspect-[4/5] relative rounded overflow-hidden bg-stone-100 mb-2">
                    <Image
                      src={c.sample}
                      alt={c.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  </div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs" style={{ color: '#7A7A7A' }}>
                    {c.count} {c.count === 1 ? 'image' : 'images'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The story origin */}
      <section className="border-b" style={{ borderColor: '#E8DED4', backgroundColor: '#2E2E2E', color: '#FDF8F3' }}>
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
          <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#8B9D77' }}>
                06 / Origin
              </p>
              <h2
                className="text-2xl md:text-3xl font-light leading-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {brand.oneLiner}
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#FDF8F3', opacity: 0.85 }}>
              {story.origin.split('\n\n').map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
              <p className="pt-4 mt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <strong>{brand.philosophy}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured journey stories */}
      <section className="border-b" style={{ borderColor: '#E8DED4' }}>
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
          <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#8B9D77' }}>
            07 / Pre-written narratives
          </p>
          <h2
            className="text-2xl md:text-3xl font-light leading-tight mb-8 max-w-2xl"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Six narrative arcs ready to use.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeyNarratives.map((j) => (
              <div key={j.id} className="border rounded p-5 relative" style={{ borderColor: '#E8DED4' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase tracking-wider" style={{ color: '#8B9D77' }}>
                    {j.location}
                  </p>
                  {j.liveFromEL && (
                    <span
                      className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: 'rgba(139, 157, 119, 0.15)', color: '#8B9D77' }}
                      title="Live syndicated story in Empathy Ledger"
                    >
                      Live
                    </span>
                  )}
                </div>
                <h3 className="text-base font-medium mb-2">{j.title}</h3>
                <p
                  className="text-sm italic mb-3"
                  style={{ fontFamily: 'Georgia, serif', color: '#5E5E5E' }}
                >
                  &ldquo;{j.pullQuote}&rdquo;
                </p>
                <p className="text-xs" style={{ color: '#7A7A7A' }}>
                  {j.person}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-6" style={{ color: '#7A7A7A' }}>
            Full narratives at{' '}
            <Link href="/stories" className="underline underline-offset-4" style={{ color: '#C45C3E' }}>
              /stories
            </Link>
            . Pull from <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>v2/src/lib/data/content.ts</code> for code-level use.
          </p>
        </div>
      </section>

      {/* Asset register */}
      <section className="border-b" style={{ borderColor: '#E8DED4' }}>
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
          <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#8B9D77' }}>
                08 / Asset register
              </p>
              <h2
                className="text-2xl md:text-3xl font-light leading-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Everything, in one place.
              </h2>
            </div>
            <div className="space-y-3">
              <AssetRow
                label="Live session deck"
                detail="10 slides, HTML, keyboard nav, print-to-PDF"
                href="/decks/live-session-deck.html"
                cta="Open"
              />
              <AssetRow
                label="Storyteller library"
                detail="Quotes, profiles, photos, consent state"
                href="/stories"
                cta="Browse"
              />
              <AssetRow
                label="Product page (Stretch Bed)"
                detail="Specs, materials, pricing"
                href="/shop/stretch-bed-single"
                cta="View"
              />
              <AssetRow
                label="Process page"
                detail="The 6-step On-Country production model"
                href="/process"
                cta="View"
              />
              <AssetRow
                label="Communities"
                detail="Per-community deployment stories"
                href="/communities"
                cta="View"
              />
              <AssetRow
                label="Impact dashboard"
                detail="Live numbers, theory of change, partnerships"
                href="/impact"
                cta="View"
              />
              <AssetRow
                label="About"
                detail="Origin, philosophy, the team"
                href="/about"
                cta="View"
              />
              <AssetRow
                label="Insiders wiki (password gated)"
                detail="Full operational depth, capital, governance, QBE program. Password: goods2026"
                href="/insiders"
                cta="Enter"
              />
              <AssetRow
                label="Media pack (password gated)"
                detail="Logos, hi-res photos, fact sheet for journalists"
                href="/media"
                cta="Enter"
              />
              <AssetRow
                label="Brand voice guide (Notion)"
                detail="Voice rules, banned words, before/after examples"
                href="https://www.notion.so/359ebcf981cf810aa2afe9d8b3dcd375"
                cta="Open"
                external
              />
              <AssetRow
                label="Source code"
                detail="GitHub: Acurioustractor/goods-asset-tracker"
                href="https://github.com/Acurioustractor/goods-asset-tracker"
                cta="View"
                external
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#8B9D77' }}>
            Get in touch
          </p>
          <h2
            className="text-3xl md:text-4xl font-light leading-tight mb-6 max-w-2xl mx-auto"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Need an asset, a quote, an interview, or a partnership conversation?
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: '#5E5E5E' }}>
            We respond within 24 hours for media and procurement. Community partnership conversations
            move at community pace.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href={`mailto:${ASSET_EMAIL}`}>{ASSET_EMAIL}</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact form</Link>
            </Button>
          </div>
          <p className="text-xs mt-8" style={{ color: '#7A7A7A' }}>
            {partners.communityPartners.length}+ community partners · {featuredStorytellers.length} storytellers featured
            {liveCount > 0 ? ` (${liveCount} live from Empathy Ledger)` : ''} · 400+ beds delivered.
            Last revised May 2026.
          </p>
        </div>
      </section>
    </main>
  );
}

function AssetRow({
  label,
  detail,
  href,
  cta,
  external,
}: {
  label: string;
  detail: string;
  href: string;
  cta: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <div className="flex-1">
        <p className="font-medium mb-0.5">{label}</p>
        <p className="text-xs" style={{ color: '#7A7A7A' }}>
          {detail}
        </p>
      </div>
      <span className="text-sm shrink-0" style={{ color: '#C45C3E' }}>
        {cta} →
      </span>
    </>
  );

  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded border transition hover:shadow-sm"
      style={{ borderColor: '#E8DED4', backgroundColor: '#fff' }}
    >
      {inner}
    </a>
  ) : (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded border transition hover:shadow-sm"
      style={{ borderColor: '#E8DED4', backgroundColor: '#fff' }}
    >
      {inner}
    </Link>
  );
}
