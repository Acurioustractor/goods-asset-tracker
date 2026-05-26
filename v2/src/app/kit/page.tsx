import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Palette mirrors /get-involved + /contact so the cross-page flow reads as one site.
const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

// Partner-facing tool, not a public marketing page: keep it out of search indexes.
export const metadata: Metadata = {
  title: 'Partner asset kit | Goods on Country',
  description:
    'A hub where Oonchiumpa, Centrecorp, and community can grab the assets they need from the May 2026 Utopia trip: videos, one-pagers, photos, and copy-paste framing.',
  robots: { index: false, follow: false },
};

const MYKEL_VIDEO =
  'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/3aa9a02a-c16a-4f50-b3e0-84ae42f99f73/1779516342701_Mykel.mp4';

type AssetKind = 'watch' | 'read' | 'view' | 'fieldnotes' | 'coming';

type Asset = {
  kind: AssetKind;
  title: string;
  blurb: string;
  href?: string;
  cta?: string;
  external?: boolean;
};

type CopyBlock = {
  title: string;
  body: string;
};

type PartnerSection = {
  id: string;
  partner: string;
  forWhat: string;
  assets: Asset[];
  copy?: CopyBlock;
  accent: string;
};

const KIND_LABEL: Record<AssetKind, string> = {
  watch: 'Watch / share',
  read: 'Read / download',
  view: 'View',
  fieldnotes: 'Full field notes',
  coming: 'Coming soon',
};

const SECTIONS: PartnerSection[] = [
  {
    id: 'oonchiumpa',
    partner: 'Oonchiumpa',
    forWhat:
      'For grant submissions, recruiting young people, explaining the model, and socials.',
    accent: RUST,
    assets: [
      {
        kind: 'watch',
        title: 'Mykel, in his own voice',
        blurb:
          'An 89-second clip of Mykel talking about the build, in his own words. Strong for socials and for showing funders the program from the inside.',
        href: MYKEL_VIDEO,
        cta: 'Watch the clip',
        external: true,
      },
      {
        kind: 'read',
        title: 'Oonchiumpa good news story (PDF)',
        blurb:
          'A short written story you can drop straight into a grant application or a board pack.',
        href: '/docs/partners/centrecorp/oochiumpa-good-news-story.pdf',
        cta: 'Download the PDF',
        external: true,
      },
      {
        kind: 'fieldnotes',
        title: 'The full Utopia field notes',
        blurb:
          'The whole trip, bed by bed, with photos and voices from the homelands. Grab any piece you need.',
        href: '/field-notes/utopia-may-2026',
        cta: 'Open the field notes',
      },
    ],
    copy: {
      title: 'The program behind the door',
      body:
        'Young people in Alice built these beds alongside Oonchiumpa. Every builder kept one bed for their own home, and the rest went out to the homelands. Oonchiumpa held the program from start to finish and chose where the beds went, so the people who know Country decided who slept better.',
    },
  },
  {
    id: 'centrecorp',
    partner: 'Centrecorp Foundation',
    forWhat:
      'To justify and grow the investment internally, and to bring other funders alongside.',
    accent: SAGE,
    assets: [
      {
        kind: 'read',
        title: 'Utopia outcomes one-pager (PDF)',
        blurb:
          'A single page you can hand to a board or attach to an internal note: what the trip delivered, at a glance.',
        href: '/docs/partners/centrecorp/utopia-outcomes-one-pager.pdf',
        cta: 'Download the one-pager',
        external: true,
      },
      {
        kind: 'fieldnotes',
        title: 'The full Utopia field notes',
        blurb:
          'The evidence behind the one-pager: the full trip with photos and community voices.',
        href: '/field-notes/utopia-may-2026',
        cta: 'Open the field notes',
      },
    ],
    copy: {
      title: 'Impact summary you can lift',
      body:
        'Centrecorp Foundation funded the materials for this trip. On this run, 107 beds were delivered into homes in the Utopia Homelands. Centrecorp Foundation is an Aboriginal Trust based in the Northern Territory, backing the people of this Country directly.',
    },
  },
  {
    id: 'community',
    partner: 'Community',
    forWhat:
      'For Karen, Kristy, the Arlparra team, and the Soapy Bore mob: photos back to families, something you can hold.',
    accent: RUST,
    assets: [
      {
        kind: 'view',
        title: 'The build photo gallery',
        blurb:
          '121 build photos live in the story gallery. Faces, families, and beds going into homes across the homelands.',
        href: '/field-notes/utopia-may-2026',
        cta: 'View the gallery',
      },
      {
        kind: 'coming',
        title: 'Printed copies + a community version',
        blurb:
          'Printed copies go back On Country on the next trip, so families have something to hold. A community-facing version of all this is in the works.',
      },
    ],
  },
];

function KindTag({ kind, accent }: { kind: AssetKind; accent: string }) {
  return (
    <span
      className="inline-block text-[10px] uppercase tracking-[0.18em] mb-3"
      style={{ color: accent }}
    >
      {KIND_LABEL[kind]}
    </span>
  );
}

export default function KitPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      {/* 1. INTRO */}
      <section className="px-5 sm:px-8 pt-16 sm:pt-24 pb-10 max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: RUST }}>
          Partner asset kit
        </p>
        <h1
          className="font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight mb-6"
          style={{ color: CHARCOAL }}
        >
          Grab what you need.<br />Tell the story your way.
        </h1>
        <p
          className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
          style={{ color: `${CHARCOAL}cc` }}
        >
          The May 2026 Utopia trip, repackaged into tools you can use for your own work: grant
          applications, board meetings, socials, and photos back to families. Pick a section, grab
          the asset, and put it to work.
        </p>
      </section>

      {/* 2. PARTNER SECTIONS */}
      {SECTIONS.map((section, idx) => (
        <section
          key={section.id}
          id={section.id}
          className="px-5 sm:px-8 py-12 sm:py-16"
          style={{ backgroundColor: idx % 2 === 0 ? 'white' : CREAM }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <p
                className="text-[11px] uppercase tracking-[0.2em] mb-3"
                style={{ color: section.accent }}
              >
                For {section.partner}
              </p>
              <h2
                className="font-display text-3xl sm:text-4xl leading-tight mb-3"
                style={{ color: CHARCOAL }}
              >
                {section.partner}
              </h2>
              <p className="text-base leading-relaxed max-w-2xl" style={{ color: `${CHARCOAL}cc` }}>
                {section.forWhat}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {section.assets.map((asset) => (
                <div
                  key={asset.title}
                  className="flex flex-col rounded-3xl p-6"
                  style={{ backgroundColor: idx % 2 === 0 ? CREAM : 'white', border: `1px solid ${CHARCOAL}14` }}
                >
                  <KindTag kind={asset.kind} accent={section.accent} />
                  <h3 className="font-display text-xl leading-tight mb-2" style={{ color: CHARCOAL }}>
                    {asset.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: `${CHARCOAL}cc` }}>
                    {asset.blurb}
                  </p>
                  {asset.href ? (
                    <div className="mt-auto">
                      {asset.external ? (
                        <Button className="w-full text-white" style={{ backgroundColor: CHARCOAL }} asChild>
                          <a href={asset.href} target="_blank" rel="noopener noreferrer">
                            {asset.cta}
                          </a>
                        </Button>
                      ) : (
                        <Button className="w-full text-white" style={{ backgroundColor: CHARCOAL }} asChild>
                          <Link href={asset.href}>{asset.cta}</Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p
                      className="mt-auto text-xs uppercase tracking-[0.15em] py-3 text-center rounded-xl"
                      style={{ color: `${CHARCOAL}80`, border: `1px dashed ${CHARCOAL}33` }}
                    >
                      In the works
                    </p>
                  )}
                </div>
              ))}
            </div>

            {section.copy && (
              <div
                className="mt-6 rounded-3xl p-6 sm:p-7"
                style={{ backgroundColor: `${section.accent}14`, border: `1px solid ${section.accent}33` }}
              >
                <p className="text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: section.accent }}>
                  Copy and paste
                </p>
                <h3 className="font-display text-xl leading-tight mb-3" style={{ color: CHARCOAL }}>
                  {section.copy.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: `${CHARCOAL}dd` }}>
                  {section.copy.body}
                </p>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* 3. FOOTER NOTE */}
      <section className="px-5 sm:px-8 py-14 sm:py-20 text-center" style={{ backgroundColor: CHARCOAL, color: CREAM }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-4">
            Need something that is not here?
          </h2>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: `${CREAM}99` }}>
            This kit grows as the work does. If you need a different cut, a specific photo, or a
            tailored version for your audience, tell us and we will pull it together.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition"
            style={{ backgroundColor: RUST, color: CREAM }}
          >
            Ask for an asset
          </Link>
        </div>
      </section>
    </main>
  );
}
