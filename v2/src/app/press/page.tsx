import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { brand, mediaPack, impactStories } from '@/lib/data/content';
import { communityPartners, funding } from '@/lib/data/compendium';
import { pressReads, pressCoverage } from '@/lib/data/press-reads';
import { getApprovedPhotos, getApprovedVideos } from '@/lib/empathy-ledger/press-pack';
import type { PressPhoto, PressVideo } from '@/lib/empathy-ledger/press-pack';
import { CopyButton } from './_components/copy-button';
import { PressContactForm } from './_components/press-contact-form';

// Revalidate every 5 min so newly-approved EL uploads surface quickly.
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Press & Brand · Goods on Country',
  description:
    'Wordmark, colours, voice, photos, videos, partners, and links. Everything funders, partners, and media need to write about the work.',
  openGraph: {
    title: 'Press & Brand · Goods on Country',
    description:
      'Wordmark, colours, voice, photos, videos, partners, and links. Everything funders, partners, and media need to write about the work.',
    images: ['/brand/logos/goods-stacked-on-dark.svg'],
  },
};

const LAST_UPDATED = '25 May 2026';

const logoVariants = [
  { file: 'goods-stacked-white.svg', label: 'Stacked, white', surface: 'dark' },
  { file: 'goods-stacked-black.svg', label: 'Stacked, black', surface: 'light' },
  { file: 'goods-stacked-on-dark.svg', label: 'Stacked, on charcoal', surface: 'checker' },
  { file: 'goods-stacked-on-light.svg', label: 'Stacked, on cream', surface: 'checker' },
  { file: 'goods-inline-white.svg', label: 'Inline, white', surface: 'dark' },
  { file: 'goods-inline-black.svg', label: 'Inline, black', surface: 'light' },
  { file: 'goods-inline-on-dark.svg', label: 'Inline, on charcoal', surface: 'checker' },
  { file: 'goods-inline-on-light.svg', label: 'Inline, on cream', surface: 'checker' },
  { file: 'goods-chip-on-dark.svg', label: 'Chip, on charcoal', surface: 'checker' },
  { file: 'goods-chip-on-light.svg', label: 'Chip, on cream', surface: 'checker' },
] as const;

const keyFacts = [
  { value: '400+', label: 'Stretch Beds delivered', verified: true },
  { value: '8+', label: 'Communities', verified: true },
  { value: '20kg', label: 'HDPE diverted per bed', verified: true },
  { value: '200kg', label: 'Load capacity', verified: true },
  { value: '5 min', label: 'Assembly time, no tools', verified: true },
  { value: '5 yr', label: 'Warranty, 10+ yr design life', verified: true },
];

const colourSwatches = [
  { name: 'Charcoal', hex: '#0A0A0A', text: '#FFFFFF', role: 'Primary text, dark surfaces' },
  { name: 'Cream', hex: '#FDF8F3', text: '#0A0A0A', role: 'Primary background, light surfaces' },
  { name: 'Sage', hex: '#8B9D77', text: '#FFFFFF', role: 'Secondary accent for community contexts' },
  { name: 'Rust', hex: '#C45C3E', text: '#FFFFFF', role: 'Highlight accent, used sparingly' },
];

// Voice rules from wiki/articles/brand-comms/01-voice-and-tone.md
const voiceRules = [
  'Lead with impact, not charity. A washing machine is cardiac prevention. A bed is medical recovery.',
  'Centre community voices. Quote people by name, with location, with consent.',
  'Be specific. Real numbers, real materials, real places. "Tennant Creek" beats "remote Australia".',
  'Plain, not polished. Write the way Nic talks at the kitchen table. Short sentences. Concrete nouns.',
  'Show the model. We design in community, with community, for community. Our job is to become unnecessary.',
];

const bannedWords = [
  'donations / charity',
  'co-design',
  'beneficiaries',
  'empower',
  'unlock / leverage / synergy',
  'em dashes',
  'help them',
];

// Pre-built shareable assets — copy / download in one tap.
const shareableSnippets = [
  {
    title: 'Tweet / LinkedIn (280 chars)',
    body:
      'Goods on Country: First Nations communities designing the goods they need. Stretch Bed: recycled plastic, galvanised steel, Australian canvas. 400+ delivered across 8+ communities. Designed On-Country, made On-Country. goodsoncountry.com',
  },
  {
    title: 'Email signature blurb (60 words)',
    body:
      'Goods on Country is a social enterprise delivering health hardware to First Nations communities. The flagship Stretch Bed is designed On-Country with the families who use it: recycled HDPE plastic, galvanised steel, heavy-duty canvas. 400+ beds delivered. Long-term goal: transfer manufacturing to community-owned enterprises. goodsoncountry.com',
  },
  {
    title: 'One-line for intros',
    body:
      'Goods on Country: community-designed health hardware, made On-Country, with the long-term goal of transferring manufacturing to community ownership.',
  },
];

// Three voices, hand-picked from impactStories. Featured photo + quote.
const featuredVoices = impactStories.slice(0, 3);

// Group community partners by category for the partners section.
const corePartners = communityPartners.filter((p) => p.category === 'core');
const fundingPartners = funding.filter((f) => f.status === 'received').slice(0, 8);

const checkerStyle: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, 10px 0',
};

export default async function PressPage() {
  const [photos, videos] = await Promise.all([
    getApprovedPhotos(36),
    getApprovedVideos(24),
  ]);
  const featuredPhotos = photos.filter((p) => p.featured);
  const otherPhotos = photos.filter((p) => !p.featured);
  const landscapeVideos = videos.filter((v) => v.orientation !== 'portrait');
  const verticalVideos = videos.filter((v) => v.orientation === 'portrait');

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="bg-[#0A0A0A] py-24 text-white">
        <div className="container mx-auto max-w-4xl px-6">
          <Image
            src="/brand/logos/goods-stacked-white.svg"
            alt="Goods on Country"
            width={460}
            height={307}
            priority
            className="h-auto w-full max-w-[340px]"
          />
          <p className="mt-12 text-xs font-medium uppercase tracking-[0.3em] text-white/60">
            Press &amp; Brand
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            Wordmark, voice, photos, voices, and links. Everything you need to write about the work.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">
            {brand.oneLiner}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a href="#boilerplate" className="rounded-md bg-white px-4 py-2 font-medium text-[#0A0A0A] hover:bg-white/90">
              Boilerplate
            </a>
            <a href="#brand-system" className="rounded-md border border-white/30 px-4 py-2 font-medium hover:bg-white/10">
              Brand
            </a>
            <a href="#photos" className="rounded-md border border-white/30 px-4 py-2 font-medium hover:bg-white/10">
              Photos
            </a>
            <a href="#voices" className="rounded-md border border-white/30 px-4 py-2 font-medium hover:bg-white/10">
              Voices
            </a>
            <a href="#videos" className="rounded-md border border-white/30 px-4 py-2 font-medium hover:bg-white/10">
              Videos
            </a>
            <a href="#partners" className="rounded-md border border-white/30 px-4 py-2 font-medium hover:bg-white/10">
              Partners
            </a>
            <a href="#sharing" className="rounded-md border border-white/30 px-4 py-2 font-medium hover:bg-white/10">
              Sharing
            </a>
          </div>
          <p className="mt-10 text-xs text-white/50">
            Updated {LAST_UPDATED}. Press contact:{' '}
            <a href="mailto:press@goodsoncountry.com" className="underline">press@goodsoncountry.com</a>
          </p>
        </div>
      </section>

      {/* Boilerplate + key facts */}
      <section id="boilerplate" className="border-b py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <SectionLabel>What we are</SectionLabel>
          <h2 className="mt-2 text-3xl font-medium tracking-tight">Boilerplate and key facts</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Three lengths, ready to paste. Every number on this page is verifiable against production records.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <BoilerplateCard length="One line" text={brand.oneLiner} />
            <BoilerplateCard length="One paragraph" text={mediaPack.pressBoilerplate} />
            <BoilerplateCard
              length="The model"
              text={`Goods on Country is an enterprise designed to transfer manufacturing capability to community-owned production. We design in community, with community, for community. We support communities to realise what they design. The plant moves to community ownership. Our job is to become unnecessary.`}
            />
          </div>

          <div className="mt-14">
            <h3 className="text-lg font-medium">Key facts</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Verified against production records, {LAST_UPDATED}.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-3 lg:grid-cols-6">
              {keyFacts.map((f) => (
                <div key={f.label} className="bg-card p-5">
                  <p className="text-2xl font-semibold tracking-tight">{f.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{f.label}</p>
                  {f.verified && (
                    <span className="mt-3 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-800">
                      Verified
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              More numbers, financials, and provenance on request. <a href="#contact" className="underline">Ask us</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Brand system */}
      <section id="brand-system" className="border-b bg-[#FDF8F3] py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <SectionLabel>Brand system</SectionLabel>
          <h2 className="mt-2 text-3xl font-medium tracking-tight">Wordmark, colours, type, voice</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Use the SVGs as supplied. Don&apos;t recolour, stretch, or recreate the wordmark in Canva.
          </p>

          {/* Logo grid */}
          <h3 className="mt-12 text-lg font-medium">Wordmark pack</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {logoVariants.map((v) => (
              <figure key={v.file} className="overflow-hidden rounded-xl border bg-white">
                <div
                  className="flex items-center justify-center px-6 py-12"
                  style={
                    v.surface === 'dark'
                      ? { backgroundColor: '#0A0A0A' }
                      : v.surface === 'light'
                        ? { backgroundColor: '#FDF8F3' }
                        : checkerStyle
                  }
                >
                  <Image
                    src={`/brand/logos/${v.file}`}
                    alt={v.label}
                    width={600}
                    height={300}
                    className="h-auto w-full max-w-[260px]"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-3 border-t bg-white px-4 py-3 text-xs">
                  <div>
                    <p className="font-medium">{v.label}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{v.file}</p>
                  </div>
                  <a href={`/brand/logos/${v.file}`} download className="rounded-md border px-2.5 py-1 font-medium hover:bg-muted">
                    SVG
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Colours */}
          <h3 className="mt-16 text-lg font-medium">Colours</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colourSwatches.map((c) => (
              <div key={c.name} className="overflow-hidden rounded-xl border">
                <div className="flex h-32 items-end p-4 text-sm font-medium" style={{ backgroundColor: c.hex, color: c.text }}>
                  {c.name}
                </div>
                <div className="bg-white p-4">
                  <p className="font-mono text-xs">{c.hex}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{c.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Type + voice */}
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-lg font-medium">Typography</h3>
              <dl className="mt-4 grid gap-4 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Wordmark</dt>
                  <dd className="mt-1">Poppins Medium 500</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Body</dt>
                  <dd className="mt-1">Inter, system sans-serif fallback</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Editorial display</dt>
                  <dd className="mt-1">Playfair Display</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-lg font-medium">Voice</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {voiceRules.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Never write</p>
              <p className="mt-2 text-xs text-muted-foreground">{bannedWords.join(' · ')}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Full rules: <a href="https://github.com/Acurioustractor/Goods-Asset-Register/blob/main/wiki/articles/brand-comms/01-voice-and-tone.md" className="underline" target="_blank" rel="noopener">wiki/brand-comms/01-voice-and-tone</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photos */}
      <section id="photos" className="border-b py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <SectionLabel>Photos</SectionLabel>
          <h2 className="mt-2 text-3xl font-medium tracking-tight">Photos from On-Country</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Live from the Empathy Ledger. Only consent-cleared, public-visibility photos appear here.
            Free to use in editorial coverage. Credit: <strong>Goods on Country</strong>.
          </p>

          {featuredPhotos.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-medium">Featured</h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featuredPhotos.map((p) => (
                  <PhotoCard key={p.id} photo={p} highlighted />
                ))}
              </div>
            </div>
          )}

          {otherPhotos.length === 0 && featuredPhotos.length === 0 ? (
            <EmptyState label="No approved photos yet. Add via Empathy Ledger admin." />
          ) : otherPhotos.length > 0 ? (
            <div className="mt-12">
              {featuredPhotos.length > 0 && <h3 className="text-lg font-medium">Recent</h3>}
              <div className={`${featuredPhotos.length > 0 ? 'mt-5' : 'mt-10'} grid gap-5 sm:grid-cols-2 lg:grid-cols-3`}>
                {otherPhotos.map((p) => (
                  <PhotoCard key={p.id} photo={p} />
                ))}
              </div>
            </div>
          ) : null}

          <p className="mt-6 text-xs text-muted-foreground">
            Showing the {photos.length} most recent. Refreshed every 5 minutes from the Empathy Ledger.
            Tag photos with <code className="rounded bg-muted px-1.5 py-0.5">press-featured</code> in EL admin to surface them first.
          </p>
        </div>
      </section>

      {/* Voices */}
      <section id="voices" className="border-b bg-[#FDF8F3] py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <SectionLabel>Voices</SectionLabel>
          <h2 className="mt-2 text-3xl font-medium tracking-tight">Quote from community, not about</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Always lead with the person and their place. The work is theirs.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredVoices.map((v) => (
              <article key={v.id} className="rounded-xl border bg-white p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{v.title}</p>
                <blockquote className="mt-3 text-lg leading-snug">
                  &ldquo;{v.quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-sm font-medium">{v.person}</p>
                <p className="text-xs text-muted-foreground">{v.location}</p>
                <p className="mt-3 text-sm text-muted-foreground">{v.summary}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm">
            <Link href="/stories" className="underline">Browse all stories</Link>
          </p>
        </div>
      </section>

      {/* Videos */}
      <section id="videos" className="border-b py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <SectionLabel>Videos</SectionLabel>
          <h2 className="mt-2 text-3xl font-medium tracking-tight">Videos from On-Country</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Live from the Empathy Ledger. Landscape for press and editorial. Vertical for social.
            Tag a video <code className="rounded bg-muted px-1.5 py-0.5">press-vertical</code> in EL admin to mark it for the vertical bucket.
          </p>

          {videos.length === 0 ? (
            <EmptyState label="No approved videos yet. Upload to Empathy Ledger with visibility=public." />
          ) : (
            <>
              {landscapeVideos.length > 0 && (
                <VideoBucket title="Landscape" subtitle="For press and editorial cuts" videos={landscapeVideos} />
              )}
              {verticalVideos.length > 0 && (
                <VideoBucket title="Vertical" subtitle="Ready for social, Instagram, TikTok" videos={verticalVideos} />
              )}
            </>
          )}
          <p className="mt-6 text-xs text-muted-foreground">
            Showing the {videos.length} most recent. Refreshed every 5 minutes.
          </p>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="border-b bg-[#FDF8F3] py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <SectionLabel>Partners</SectionLabel>
          <h2 className="mt-2 text-3xl font-medium tracking-tight">Who we work with</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Community partners lead the design. Funding partners back the build. The model works because of both.
          </p>

          <h3 className="mt-12 text-lg font-medium">Community partners</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {corePartners.map((p) => (
              <article key={p.id} className="rounded-xl border bg-white p-5">
                <p className="text-base font-medium">{p.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{p.location}</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">{p.description}</p>
              </article>
            ))}
          </div>

          <h3 className="mt-14 text-lg font-medium">Backed by</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {fundingPartners.map((f) => (
              <li key={f.id} className="rounded-lg border bg-white p-4">
                <p className="text-sm font-medium">{f.source}</p>
                {f.when && <p className="mt-0.5 text-xs text-muted-foreground">{f.when}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sharing */}
      <section id="sharing" className="border-b py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <SectionLabel>For sharing</SectionLabel>
          <h2 className="mt-2 text-3xl font-medium tracking-tight">Send this to one person today</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Pre-built snippets, recommended reads, and press coverage. Designed to be shared without re-writing.
          </p>

          <h3 className="mt-12 text-lg font-medium">Snippets you can paste</h3>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {shareableSnippets.map((s) => (
              <article key={s.title} className="flex flex-col rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium">{s.title}</h4>
                  <CopyButton text={s.body} />
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <p className="mt-4 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {s.body.length} characters
                </p>
              </article>
            ))}
          </div>

          <h3 className="mt-14 text-lg font-medium">Recommended reads</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Background reading for journalists, funders, and researchers. Grouped by topic.
            If a link reads &ldquo;Coming&rdquo;, it&apos;s being verified, ask us.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pressReads.map((r) => (
              <article key={r.id} className="rounded-lg border bg-card p-4">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {r.topic.replace(/-/g, ' ')}
                </p>
                <p className="mt-1.5 text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.source}</p>
                <p className="mt-2 text-xs leading-relaxed text-foreground/80">{r.summary}</p>
                {r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener"
                    className="mt-3 inline-flex text-xs font-medium underline"
                  >
                    Open
                  </a>
                ) : (
                  <p className="mt-3 text-[10px] uppercase tracking-wide text-amber-700">
                    Link being verified
                  </p>
                )}
              </article>
            ))}
          </div>

          <h3 className="mt-14 text-lg font-medium">Press coverage</h3>
          {pressCoverage.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed bg-muted/30 p-8 text-sm">
              <p className="font-medium">No coverage listed yet.</p>
              <p className="mt-2 text-muted-foreground">
                Add to <code className="rounded bg-muted px-1.5 py-0.5">v2/src/lib/data/press-reads.ts</code> as items come in.
                Each needs outlet, title, date, URL, format.
              </p>
            </div>
          ) : (
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {pressCoverage.map((c) => (
                <li key={c.id} className="rounded-lg border bg-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.format}</p>
                  <p className="mt-1 text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.outlet} · {c.date}</p>
                  <a href={c.url} target="_blank" rel="noopener" className="mt-2 inline-flex text-xs font-medium underline">
                    Open
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20">
        <div className="container mx-auto max-w-3xl px-6">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="mt-2 text-3xl font-medium tracking-tight">Need something specific?</h2>
          <p className="mt-4 text-muted-foreground">
            High-res photos, additional numbers, interview time, a tailored brief, a link added to this page.
            We reply within two business days.
          </p>
          <div className="mt-10">
            <PressContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Section primitives ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
      {children}
    </p>
  );
}

function BoilerplateCard({ length, text }: { length: string; text: string }) {
  return (
    <article className="flex flex-col rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium">{length}</h3>
        <CopyButton text={text} />
      </div>
      <p className="mt-4 flex-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
      <p className="mt-4 text-[10px] uppercase tracking-wide text-muted-foreground">
        {text.length} characters
      </p>
    </article>
  );
}

function PhotoCard({ photo, highlighted = false }: { photo: PressPhoto; highlighted?: boolean }) {
  const aspect =
    photo.orientation === 'portrait'
      ? 'aspect-[3/4]'
      : photo.orientation === 'square'
        ? 'aspect-square'
        : 'aspect-[4/3]';
  return (
    <figure className={`overflow-hidden rounded-xl border bg-card ${highlighted ? 'ring-2 ring-foreground/10' : ''}`}>
      <div className={`relative ${aspect} bg-muted`}>
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        {highlighted && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-background">
            Featured
          </span>
        )}
      </div>
      <figcaption className="flex items-start justify-between gap-3 border-t p-4 text-xs">
        <span className="text-muted-foreground">{photo.caption}</span>
        <a
          href={photo.src}
          download
          target="_blank"
          rel="noopener"
          className="flex-shrink-0 rounded-md border px-2.5 py-1 font-medium hover:bg-muted"
        >
          Download
        </a>
      </figcaption>
    </figure>
  );
}

function VideoBucket({ title, subtitle, videos }: { title: string; subtitle?: string; videos: PressVideo[] }) {
  return (
    <div className="mt-12">
      <h3 className="text-lg font-medium">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {videos.map((v) => (
          <article key={v.id} className="overflow-hidden rounded-xl border bg-card">
            <div className={v.orientation === 'portrait' ? 'aspect-[9/16] bg-black' : 'aspect-video bg-black'}>
              <video
                src={v.src}
                poster={v.poster || undefined}
                controls
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-medium">{v.title}</p>
              {v.description && (
                <p className="mt-1 text-xs text-muted-foreground">{v.description}</p>
              )}
              <a
                href={v.src}
                download
                target="_blank"
                rel="noopener"
                className="mt-3 inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted"
              >
                Download MP4
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="mt-10 rounded-xl border border-dashed bg-muted/30 p-10 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
