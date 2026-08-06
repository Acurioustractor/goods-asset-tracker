import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Download } from 'lucide-react';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Brand guide',
  description:
    'The canonical Goods and Goods on Country identity, logo downloads, colour, typography and usage rules.',
  alternates: { canonical: '/brand' },
};

const C = {
  ink: '#1C1A17',
  terracotta: '#C9613C',
  cream: '#FBF8F1',
  white: '#FFFFFF',
  sand: '#E8DCC8',
  sage: '#8B9D77',
  sub: '#6A6158',
  grid: '#E6DFD1',
};

const palette = [
  { name: 'Ink', value: C.ink, role: 'Wordmark, headings and body copy' },
  { name: 'Terracotta', value: C.terracotta, role: 'Full stop, ground rail and emphasis' },
  { name: 'Cream', value: C.cream, role: 'Primary warm background' },
  { name: 'White', value: C.white, role: 'Cards and reverse applications' },
  { name: 'Sand', value: C.sand, role: 'Secondary surface' },
  { name: 'Sage', value: C.sage, role: 'Connection and supporting information' },
  { name: 'Sub', value: C.sub, role: 'Captions and secondary copy' },
  { name: 'Grid', value: C.grid, role: 'Rules, dividers and chart structure' },
];

const logoFamilies = [
  {
    title: 'Goods.',
    description: 'The master wordmark. Use when the context already names Goods on Country.',
    preview: '/brand/goods/logos/svg/goods-primary.svg',
    files: [
      ['Primary SVG', '/brand/goods/logos/svg/goods-primary.svg'],
      ['Reverse SVG', '/brand/goods/logos/svg/goods-reverse.svg'],
      ['Ink SVG', '/brand/goods/logos/svg/goods-mono-ink.svg'],
      ['White SVG', '/brand/goods/logos/svg/goods-mono-white.svg'],
      ['Terracotta SVG', '/brand/goods/logos/svg/goods-mono-terracotta.svg'],
      ['Primary PNG · 2400px', '/brand/goods/logos/png/goods-primary-2400px.png'],
      ['Primary JPEG · 2400px', '/brand/goods/logos/jpg/goods-primary-2400px.jpg'],
    ],
  },
  {
    title: 'Goods on Country',
    description:
      'The approved grounded lockup. Use when introducing the organisation or presenting to partners and funders.',
    preview: '/brand/goods/logos/svg/goods-on-country-grounded-primary.svg',
    files: [
      ['Primary SVG', '/brand/goods/logos/svg/goods-on-country-grounded-primary.svg'],
      ['Reverse SVG', '/brand/goods/logos/svg/goods-on-country-grounded-reverse.svg'],
      ['Ink SVG', '/brand/goods/logos/svg/goods-on-country-grounded-mono-ink.svg'],
      ['White SVG', '/brand/goods/logos/svg/goods-on-country-grounded-mono-white.svg'],
      [
        'Terracotta SVG',
        '/brand/goods/logos/svg/goods-on-country-grounded-mono-terracotta.svg',
      ],
      [
        'Primary PNG · 2400px',
        '/brand/goods/logos/png/goods-on-country-grounded-primary-2400px.png',
      ],
      [
        'Primary JPEG · 2400px',
        '/brand/goods/logos/jpg/goods-on-country-grounded-primary-2400px.jpg',
      ],
    ],
  },
];

function DownloadLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      download
      className="inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white"
      style={{ borderColor: C.grid, color: C.ink }}
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      {children}
    </a>
  );
}

export default function BrandGuidePage() {
  return (
    <div style={{ background: C.cream, color: C.ink }}>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:px-8 sm:pt-24">
        <div className="max-w-4xl">
          <p
            className="mb-5 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: C.terracotta }}
          >
            Goods on Country identity
          </p>
          <h1 className="font-display text-5xl leading-[0.98] tracking-tight sm:text-7xl">
            The making belongs on Country.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed" style={{ color: C.sub }}>
            The canonical logo system, colour, typography and usage rules for Goods and
            Goods on Country. Use the supplied files. Do not rebuild the mark.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <DownloadLink href="/brand/goods/goods-on-country-brand-kit.zip">
              Download the complete brand kit
            </DownloadLink>
            <Link
              href="/brand/goods/brand-guide/GOODS-BRAND-GUIDE.md"
              className="inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold underline-offset-4 hover:underline"
              style={{ color: C.ink }}
            >
              Read the plain-text guide
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-8" aria-labelledby="logos">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold" style={{ color: C.terracotta }}>
              01
            </p>
            <h2 id="logos" className="mt-2 font-display text-4xl">
              Logo system
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm leading-relaxed sm:block" style={{ color: C.sub }}>
            Every SVG contains outlined Archivo glyphs. It will not change when opened
            on another computer.
          </p>
        </div>

        <div className="space-y-8">
          {logoFamilies.map((family) => (
            <article
              key={family.title}
              className="overflow-hidden rounded-3xl border bg-white"
              style={{ borderColor: C.grid }}
            >
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div
                  className="flex min-h-72 items-center justify-center p-10 sm:p-16"
                  style={{ background: '#F8F5EF' }}
                >
                  <Image
                    src={family.preview}
                    width={900}
                    height={420}
                    alt={`${family.title} primary logo`}
                    className="h-auto max-h-60 w-full object-contain"
                  />
                </div>
                <div className="p-7 sm:p-10">
                  <h3 className="font-display text-3xl">{family.title}</h3>
                  <p className="mt-3 leading-relaxed" style={{ color: C.sub }}>
                    {family.description}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {family.files.map(([label, href]) => (
                      <DownloadLink href={href} key={href}>
                        {label}
                      </DownloadLink>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div
            className="flex min-h-64 items-center justify-center rounded-3xl p-10"
            style={{ background: C.ink }}
          >
            <Image
              src="/brand/goods/logos/svg/goods-on-country-grounded-reverse.svg"
              width={900}
              height={420}
              alt="Reverse Goods on Country logo on an ink background"
              className="h-auto w-full object-contain"
            />
          </div>
          <div className="rounded-3xl border bg-white p-8" style={{ borderColor: C.grid }}>
            <h3 className="font-display text-2xl">Which file should I use?</h3>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-bold">SVG</dt>
                <dd className="mt-1" style={{ color: C.sub }}>
                  Print, signage, Canva, Figma, Illustrator and anything that may scale.
                </dd>
              </div>
              <div>
                <dt className="font-bold">PNG</dt>
                <dd className="mt-1" style={{ color: C.sub }}>
                  Miro, slides, web and documents. Transparent background.
                </dd>
              </div>
              <div>
                <dt className="font-bold">JPEG</dt>
                <dd className="mt-1" style={{ color: C.sub }}>
                  Email and systems that reject transparent files. Background is flattened.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section
        className="border-y py-20"
        style={{ borderColor: C.grid, background: C.white }}
        aria-labelledby="colour"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <p className="text-sm font-semibold" style={{ color: C.terracotta }}>
            02
          </p>
          <h2 id="colour" className="mt-2 font-display text-4xl">
            Colour
          </h2>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {palette.map((colour) => (
              <div key={colour.name} className="overflow-hidden rounded-2xl border" style={{ borderColor: C.grid }}>
                <div
                  className="h-28 border-b"
                  style={{ background: colour.value, borderColor: C.grid }}
                />
                <div className="bg-white p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold">{colour.name}</h3>
                    <code className="text-xs" style={{ color: C.sub }}>
                      {colour.value}
                    </code>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: C.sub }}>
                    {colour.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold" style={{ color: C.terracotta }}>
            03
          </p>
          <h2 className="mt-2 font-display text-4xl">Typography</h2>
          <div className="mt-8 space-y-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.sub }}>
                Logo
              </p>
              <p className="mt-2 text-3xl font-bold">Archivo Bold 700</p>
              <p className="mt-1" style={{ color: C.sub }}>
                Grounded descriptor: Archivo SemiBold 600. Outlined in the supplied
                artwork — never set live. Use the files, do not rebuild the mark.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.sub }}>
                Editorial display
              </p>
              <p className="mt-2 font-display text-4xl">Playfair Display</p>
              <p className="mt-1" style={{ color: C.sub }}>
                Georgia is the fallback, not the face.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.sub }}>
                Body and interface
              </p>
              <p className="mt-2 text-2xl font-semibold">System sans-serif</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold" style={{ color: C.terracotta }}>
            04
          </p>
          <h2 className="mt-2 font-display text-4xl">Usage</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6" style={{ borderColor: C.grid }}>
              <h3 className="font-bold">Do</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: C.sub }}>
                <li>Use primary on white or cream.</li>
                <li>Use reverse on ink or dark tinted photography.</li>
                <li>Give community partner marks equal or greater weight.</li>
                <li>Keep clear space equal to the lowercase “o”.</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-white p-6" style={{ borderColor: C.grid }}>
              <h3 className="font-bold">Never</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: C.sub }}>
                <li>Retype, stretch, skew or add effects.</li>
                <li>Use the retired tracked, all-caps lockup.</li>
                <li>Separate the terracotta full stop from Goods.</li>
                <li>Imitate Aboriginal artwork or visual motifs.</li>
              </ul>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border p-6" style={{ borderColor: C.grid }}>
            <h3 className="font-bold">Minimum size</h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: C.sub }}>
              Use the full grounded lockup above 160px digital or 42mm print. Below
              160px, remove the rail if necessary. Below 96px, use Goods. alone and
              provide “Goods on Country” as accessible text.
            </p>
          </div>
        </div>
      </section>

      {/* The system, live. Every swatch and specimen below renders from the SAME
          registered tokens the site uses (globals.css --goods-* via the Tailwind
          theme), so this board cannot drift from what actually ships. Reconciled
          2026-08-06: tokens.css, globals.css and the app now agree. */}
      <section id="system" className="border-t px-6 py-16 md:px-12" style={{ borderColor: C.grid }}>
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold" style={{ color: C.terracotta }}>
            04
          </p>
          <h2 className="mt-2 font-display text-4xl">The system, live</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: C.sub }}>
            Rendered from the site&apos;s own design tokens, not pasted values. If a colour or a
            face changes in code, this board changes with it.
          </p>

          <h3 className="mt-10 text-xs font-bold uppercase tracking-widest" style={{ color: C.sub }}>
            Colour
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { cls: 'bg-goods-terracotta', name: 'Terracotta', varName: '--goods-terracotta', hex: '#C45C3E', dark: true },
              { cls: 'bg-goods-clay', name: 'Clay', varName: '--goods-clay', hex: '#A8643F', dark: true },
              { cls: 'bg-goods-sage', name: 'Sage', varName: '--goods-sage', hex: '#8B9D77', dark: false },
              { cls: 'bg-goods-teal', name: 'Teal', varName: '--goods-teal', hex: '#5C8A86', dark: true },
              { cls: 'bg-goods-gold', name: 'Gold', varName: '--goods-gold', hex: '#BBA255', dark: false },
              { cls: 'bg-goods-ink', name: 'Ink', varName: '--goods-ink', hex: '#2B2A26', dark: true },
              { cls: 'bg-goods-sub', name: 'Sub', varName: '--goods-sub', hex: '#7A7363', dark: true },
              { cls: 'bg-goods-cream', name: 'Cream', varName: '--goods-cream', hex: '#FBF8F1', dark: false },
              { cls: 'bg-goods-cream-muted', name: 'Cream muted', varName: '--goods-cream-muted', hex: '#F1ECE4', dark: false },
              { cls: 'bg-goods-sand', name: 'Sand', varName: '--goods-sand', hex: '#E8DCC8', dark: false },
              { cls: 'bg-goods-grid', name: 'Grid', varName: '--goods-grid', hex: '#E6DFD1', dark: false },
              { cls: 'bg-goods-card', name: 'Card', varName: '--goods-card', hex: '#FFFFFF', dark: false },
            ].map((s) => (
              <div key={s.varName} className="overflow-hidden rounded-xl border" style={{ borderColor: C.grid }}>
                <div className={`flex h-20 items-end p-2 ${s.cls}`}>
                  <span className={`font-mono text-[10px] ${s.dark ? 'text-white/80' : 'text-goods-ink/60'}`}>{s.hex}</span>
                </div>
                <div className="bg-white p-2">
                  <p className="text-xs font-semibold">{s.name}</p>
                  <p className="font-mono text-[10px]" style={{ color: C.sub }}>{s.varName}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-12 text-xs font-bold uppercase tracking-widest" style={{ color: C.sub }}>
            Type, as loaded
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6" style={{ borderColor: C.grid }}>
              <p className="font-mono text-[10px]" style={{ color: C.sub }}>font-display · Playfair Display</p>
              <p className="mt-2 font-display text-3xl leading-snug">The making belongs on Country.</p>
            </div>
            <div className="rounded-2xl border bg-white p-6" style={{ borderColor: C.grid }}>
              <p className="font-mono text-[10px]" style={{ color: C.sub }}>font-sans · Inter</p>
              <p className="mt-2 text-lg leading-relaxed">
                A flat-packable, washable bed designed in community for remote Australia.
              </p>
            </div>
          </div>

          <h3 className="mt-12 text-xs font-bold uppercase tracking-widest" style={{ color: C.sub }}>
            Actions
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-6" style={{ borderColor: C.grid }}>
            <span className="rounded-md bg-goods-terracotta px-5 py-2.5 text-sm font-semibold text-white">Primary</span>
            <span className="rounded-md border border-goods-terracotta px-5 py-2.5 text-sm font-semibold text-goods-terracotta">Outline</span>
            <span className="rounded-md bg-goods-gold px-5 py-2.5 text-sm font-semibold text-goods-ink">Gold · ink text</span>
            <span className="rounded-md bg-goods-sage px-5 py-2.5 text-sm font-semibold text-goods-ink">Sage · ink text</span>
            <span className="rounded-md bg-goods-teal px-5 py-2.5 text-sm font-semibold text-white">Teal · white text</span>
            <p className="w-full text-xs leading-relaxed" style={{ color: C.sub }}>
              White text on terracotta and teal; ink text on gold and sage. Never white on
              gold or sage — it fails contrast.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
