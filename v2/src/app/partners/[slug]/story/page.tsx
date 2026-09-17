import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getPartnerDashboard } from '@/lib/data/partner-dashboards';
import { getStorytellerBySlug } from '@/lib/data/storyteller-registry';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { ORGANISATION } from '@/lib/data/organisation';
import { goodsBoard } from '@/lib/data/goods-board';
import {
  ALIGNMENT, BECAUSE_OF, BUYER_TOTALS, BUYERS, DEMAND_GAPS, FILMS, heroFrames, MAP_PLACES,
  COMMUNITY_MODEL, MONEY_EVENTS, MONTHS_BEFORE_FIRST_SALE, NOT_FINISHED, OONCHIUMPA_NEXT,
  OWNERSHIP_VOICES, PROGRESS_BRIDGE, THEMES, THE_NEXT_TEN, TRADE_BY_YEAR,
  PLACE_BEATS, PRICE_LADDER,
  NORM_MONTHS, SNOW_MONEY, THE_ARC, THE_LETTER, TOGETHER, WASHER_FLEET,
  WALLS, WHY_FLEXIBLE,
  WASHER_NEXT, WASHER_PLACES, WASHER_TELEMETRY,
} from '@/lib/data/snow-partnership';
import { snowHeroFrames, snowTaggedGroup } from '@/lib/data/snow-photos';
import { ChapterRail } from '@/components/pitch/chapter-rail';
import { CountUp } from '@/components/pitch/count-up';
import { TogetherTimeline } from '@/components/partners/together-timeline';
import { AlignmentTable } from '@/components/partners/alignment-table';
import { FilmGallery, type GalleryFilm } from '@/components/partners/film-gallery';
import { StoryHero } from '@/components/partners/story-hero';
import { PlaceFilms, type PlaceBeat } from '@/components/partners/place-films';
import { MoneyLedger } from '@/components/partners/money-ledger';
import { PAID_INVOICES } from '@/lib/data/paid-trade';
import { ModelLoopBuild } from '@/components/pitch/model-loop-build';
import { TenYearSlider } from '@/components/pitch/ten-year-slider';
import { LOOP_ARCS, LOOP_COUNTS, LOOP_STATIONS, LOOP_STEPS } from '@/lib/data/model-walkthrough';
import { FLOWS, LOGOS, PANELS, STATIONS } from '@/lib/data/model-placemat';
import { renderPlacematSvg, type PanelId } from '@/lib/model/placemat-svg';
import { HARVEST_CONTAINER_DRAWING } from '@/lib/model/harvest-container-drawing';
import { PhotoWall } from '@/components/pitch/photo-wall';

/**
 * THE SNOW PARTNERSHIP REPORT. Password gated in proxy.ts alongside the dashboard.
 *
 * Ben, 16 September 2026: an interactive report in the shape of /pitch, about the partnership
 * about the partnership itself. What we have done together, what Goods is because of it, and
 * how the two organisations keep working at rheumatic heart disease through Indigenous
 * leadership.
 *
 * DO NOT REFER TO A CHAPTER BY ITS NUMBER IN READER COPY. The numbers come from the CHAPTERS
 * list and move whenever Ben reorders, which he did on 17 September; a sentence that said
 * "chapter six" was left pointing at the films. Name the thing instead.
 *
 * Sally Grimsley-Ballard's instruction of 20 May 2026 still governs the opening: "A cold
 * audience needs that chain explained immediately and plainly, before the product, before the
 * manufacturing story." The rheumatic heart disease explainer itself was cut on Ben's 16
 * September note, because Snow wrote the strategy and does not need it read back to them.
 *
 * Every Snow intention on this page is a dated quote or it is absent. Every community and
 * funder voice resolves from the registry by slug, default-deny, so a wrong tier or an
 * unapproved quote renders nothing at all.
 */

const CREAM = '#FDF8F3';
const CHARCOAL = '#2E2E2E';
const RUST = '#C45C3E';
const SAGE = '#8B9D77';
/**
 * THE PAGE'S PALETTE, AND THE ONLY PLACE A COLOUR IS CHOSEN.
 *
 * Ben, 17 September 2026, sweeping the page: think about the brand and whether anything can
 * align better. It had twenty six distinct hexes on it, most of them one-offs a card away from
 * their sibling. These are twelve, named for the job they do rather than the shade they are,
 * and every near duplicate is collapsed onto the nearest one.
 *
 * SAGE MEANS PLASTIC AND MONEY AND NOTHING ELSE, per the Goods visual system, which is why the
 * sage tokens are only used on machines, recycled material and the community share.
 */
const PANEL = '#FFFFFF';
const SUNK = '#F6F0E6';
const RULE = '#E8DED4';
const RULE_SOFT = '#F0E7DC';
const RULE_DASH = '#C2B6AA';
const MUTED = '#A2958A';
const MUTED_DEEP = '#6A5E54';
const RUST_INK = '#9A4023';
const RUST_WASH = '#F6E4DE';
const SAGE_INK = '#5E7A4C';
const SAGE_WASH = '#EEF1E9';

export const metadata: Metadata = {
  title: { absolute: 'Snow and Goods | Goods on Country' },
  description: 'What we have built together since 2024 and what comes next.',
  robots: { index: false, follow: false },
};

const CHAPTERS = [
  { id: 'ch-making', label: 'What we made' },
  { id: 'ch-first', label: 'Snow went first' },
  { id: 'ch-board', label: 'Who holds it' },
  { id: 'ch-alice', label: 'Alice Springs' },
  { id: 'ch-buyers', label: 'Who is buying' },
  { id: 'ch-washers', label: 'The machines' },
  { id: 'ch-films', label: 'In their own words' },
  { id: 'ch-archive', label: 'The archive' },
  { id: 'ch-together', label: 'What we have done' },
  { id: 'ch-because', label: 'What Goods is now' },
  { id: 'ch-themes', label: 'What this is, and what it is not' },
  { id: 'ch-next', label: 'What we are asking' },
] as const;

/**
 * A chapter's number and label come from CHAPTERS by id, never from the call site. They used to
 * be typed at both ends, so moving a chapter meant renumbering twelve JSX blocks by hand and
 * the rail could disagree with the page. Ben moved "Who holds it" to three on 17 September and
 * this is what made that a one-line change.
 */
const CH = new Map<string, { number: string; label: string }>(
  CHAPTERS.map((c, i) => [c.id as string, { number: String(i + 1).padStart(2, '0'), label: c.label as string }]),
);
const chapterNumber = (id: string) => CH.get(id)?.number ?? '';
const chapterLabel = (id: string) => CH.get(id)?.label ?? '';

/** Default-deny, same shape as funder-moments: wrong tier or unapproved renders nothing. */
function quote(slug: string, tier: 'funder' | 'external', contains: string) {
  const person = getStorytellerBySlug(slug);
  if (!person || person.tier !== tier) return null;
  const q = person.quotes.find(
    (x) => (x.status === 'primary' || x.status === 'approved') && x.text.includes(contains),
  );
  return q ? { person, quote: q } : null;
}

function Pull({ v, note, flush = false }: { v: NonNullable<ReturnType<typeof quote>>; note?: string; flush?: boolean }) {
  return (
    <figure className={`m-0 flex max-w-[52ch] items-start gap-5 ${flush ? '' : 'mt-12'}`}>
      {v.person.portrait && (
        <Image src={v.person.portrait} alt={v.person.name} width={160} height={160} className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-20 sm:w-20" />
      )}
      <div>
        <blockquote className="font-display text-xl leading-[1.35] sm:text-2xl" style={{ color: CHARCOAL }}>
          &ldquo;{v.quote.text}&rdquo;
        </blockquote>
        <figcaption className="mt-3 text-[11px] uppercase tracking-[0.14em]" style={{ color: SAGE }}>
          {v.person.name}
          {v.person.role ? `, ${v.person.role}` : ''}
        </figcaption>
        {note && <p className="mt-2 text-xs leading-relaxed" style={{ color: MUTED }}>{note}</p>}
      </div>
    </figure>
  );
}

/** The arc's state chips. Sage is in community, rust is live, grey is retired or not yet. */
function chipStyle(state: (typeof THE_ARC)[number]['state']): React.CSSProperties {
  if (state === 'in-community') return { backgroundColor: SAGE_WASH, color: SAGE_INK };
  if (state === 'now') return { backgroundColor: RUST_WASH, color: RUST_INK };
  if (state === 'commissioning') return { backgroundColor: RUST_WASH, color: RUST_INK };
  if (state === 'next') return { border: '1px dashed #C2B6AA', color: MUTED_DEEP };
  return { backgroundColor: RULE_SOFT, color: MUTED_DEEP };
}

function Chapter({ id, title, lead, children }: {
  id: string; title: string; lead?: string; children: React.ReactNode;
}) {
  const number = chapterNumber(id);
  const label = chapterLabel(id);
  return (
    <section id={id} className="scroll-mt-24 px-5 sm:px-8">
      <div className="mx-auto max-w-4xl border-t py-12 sm:py-16" style={{ borderColor: RULE }}>
        <header className="flex items-baseline justify-between gap-4">
          <span className="font-display text-base leading-none" style={{ color: RUST }}>{number}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>{label}</span>
        </header>
        <h2 className="mt-7 max-w-3xl font-display text-[2rem] leading-[1.14] sm:text-[2.6rem]" style={{ color: CHARCOAL }}>{title}</h2>
        {lead && (
          <p className="mt-5 max-w-[58ch] text-[1.0625rem] leading-[1.75] sm:text-lg" style={{ color: `${CHARCOAL}b8` }}>{lead}</p>
        )}
        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}

const money = (n: number) => `$${n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default async function PartnerStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Only Snow has a story written. Another partner slug gets a 404; a half-empty page would
  // be worse than nothing.
  if (slug !== 'snow') notFound();
  const partner = getPartnerDashboard(slug);
  if (!partner) notFound();

  const catalyse = quote('georgina-byron', 'funder', 'we can catalyse others to do their bit');
  const backing = quote('georgina-byron', 'funder', "It's also about backing really great people");
  const withNotFor = quote('georgina-byron', 'funder', "It's not a for, it's a with");
  const healthyHomes = quote('georgina-byron', 'funder', 'Healthy homes is the start of everything');
  const smallStart = quote('georgina-byron', 'funder', 'you start small and then you realize');
  const vicki = quote('vicki-wade', 'external', 'Community leadership, community ownership');
  const karen = quote('karen-liddle', 'external', 'start your own business');
  /** Cleared 17 September. Each sits where it is about something. */
  const proud = quote('dianne-stokes', 'external', 'It makes me feel proud');
  const recycled = quote('dianne-stokes', 'external', 'coming out of recycled');
  const blessings = quote('dianne-stokes', 'external', 'shared their blessings with us');
  const documenting = quote('norman-frank', 'external', 'document everything now while we can');
  /**
   * The cleared voices who talk about the machine itself. Norman Frank has no quote about his
   * washing machine in the registry and no photograph with it, so he is not here. What is on the
   * page from Norm is his house doing 951 washes.
   */
  const washerVoices = [
    { slug: 'jimmy-frank', contains: 'easier to fix, I would say for a washing machine' },
    { slug: 'patricia-frank', contains: 'right there at home' },
  ]
    .map((v) => quote(v.slug, 'external', v.contains))
    .filter((v): v is NonNullable<typeof v> => v !== null);
  /**
   * One rung per invoice, cheapest first. Ben, 17 September, looking at Centrecorp's 107 beds at
   * $560: "thought this was more per bed?" He was right and the page was underselling itself.
   * $560 is the BED LINE on INV-0291; that invoice also carried $18,000 of facilitation, so the
   * beds worked out at $728 each. The earlier invoices billed facilitation as its own line and
   * the $750 price has it inside (Ben, 15 September), so the bed line alone is not comparable
   * across the five. What a buyer actually paid for beds is, and that is what the rungs are.
   *
   * Homeland's invoice also carried two washing machines at $4,500, which are not beds, so the
   * machines come out before the division.
   */
  const priceRungs = PAID_INVOICES
    .map((i) => ({
      invoice: i.invoiceNumber,
      line: i.bedUnitPriceAud,
      perBed: Math.round((i.totalNetAud - i.otherNetAud) / i.beds),
      beds: i.beds,
      who: i.buyer.split(' ')[0].replace(/'s$/, ''),
    }))
    .sort((a, b) => a.perBed - b.perBed);
  /**
   * The three under the board. Default-deny, first three that resolve, so an unlisted person is
   * simply absent rather than a hole or a name without words.
   */
  const ownershipVoices = OWNERSHIP_VOICES
    .map((v) => quote(v.slug, 'external', v.contains))
    .filter((v): v is NonNullable<typeof v> => v !== null)
    .slice(0, 3);
  const mykel = quote('mykel', 'external', 'rocking up every day');
  /** The same cleared film the gallery carries, put where the line is said. */
  const mykelFilm = FILMS.find((f) => f.voice?.slug === 'mykel') ?? null;

  // Films carry their voice resolved here, so the client component never decides what may
  // be published. A film whose voice does not clear simply arrives without one.
  const films: GalleryFilm[] = FILMS.map((f) => {
    const v = f.voice ? quote(f.voice.slug, 'external', f.voice.contains) : null;
    return {
      src: f.src, poster: f.poster, title: f.title, why: f.why, story: f.story, place: f.place,
      voice: v ? { name: v.person.name, role: v.person.role, text: v.quote.text } : null,
    };
  });

  // The curated walls, plus anything Ben has tagged use:snow in the Media Room, which is the
  // one-step way to put a new photograph on this page without touching code.
  const wallGroups = [
    ...WALLS.map((w) => ({
      label: w.label,
      photos: w.files.map((f) => ({ src: w.dir + f.file, alt: f.alt, caption: f.caption })),
    })),
    ...(snowTaggedGroup() ? [snowTaggedGroup()!] : []),
  ];
  const norman = quote('norman-frank', 'external', "we've got our own ways");

  // The arc, as places. Each beat carries its own aerial and its own voice, resolved here so
  // the client component never decides what may be published.
  const beats: PlaceBeat[] = PLACE_BEATS.map((b) => ({
    id: b.id, place: b.place, when: b.when, title: b.title, body: b.body, film: b.film,
    // Default-deny per voice: one that does not resolve at the external tier drops out and the
    // rest of the stop still runs. Nothing is typed in here, so a consent change takes effect.
    voices: (b.voices ?? [])
      .map((x) => quote(x.slug, 'external', x.contains))
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .map((v) => ({
        name: v.person.name, role: v.person.role, community: v.person.community,
        text: v.quote.text, portrait: v.person.portrait,
      })),
    photos: b.photos ?? [],
    showMap: b.showMap,
  }));

  // The deck's own placemat, rendered here exactly as /pitch renders it. Every input is a code
  // module, so nothing is read off disk and this works on Vercel where public/ is not bundled.
  const photoHrefs = Object.fromEntries(PANELS.map((pn) => [pn.id, pn.photo.src])) as Partial<Record<PanelId, string>>;
  const placematSvg = renderPlacematSvg({
    inlineDrawing: HARVEST_CONTAINER_DRAWING,
    photoHrefs,
    logoHrefs: { goods: LOGOS.goods.src, qbe: LOGOS.qbe.src },
    standalone: false,
  });
  const placematItems = Object.values(STATIONS).map((s) => ({ id: s.id, title: s.title, line: s.line }));
  const placematArrows = FLOWS.map((fl) => ({ from: fl.from, to: fl.to, label: fl.label }));

  // The same outline the /pitch map draws, read on the server and passed in as a path string.
  const outline = await readFile(join(process.cwd(), 'public/images/maps/australia-outline.svg'), 'utf8')
    .then((x) => x.replace(/<\/?svg[^>]*>/g, '').trim())
    .catch(() => '');

  return (
    <main style={{ backgroundColor: CREAM }}>
      <ChapterRail chapters={CHAPTERS.map((c) => ({ ...c, number: chapterNumber(c.id) }))} />

      <StoryHero
        frames={snowHeroFrames()}
        film={{
          src: '/video/maningrida/gamardi-drone.mp4',
          poster: '/video/maningrida/gamardi-drone-poster.jpg',
          alt: 'Gamardi, Maningrida, Arnhem Land, from the air',
          caption: 'Gamardi, Maningrida. Forty Stretch Beds for Maningrida were pressed in our own facility before they were built here.',
        }}
      >
        {/*
          * The co-brand lockup, Ben 17 September 2026. The Goods mark is the grounded Goods on
          * Country lockup, which is the approved one; the retired "Goods." wordmark is never the
          * identity here. Snow's own white artwork is 4 percent padded inside its canvas, so it
          * is set about a seventh taller than the Goods mark to land on the same optical height.
          */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Image
            src="/brand/goods/logos/svg/goods-on-country-grounded-mono-white.svg"
            alt="Goods on Country" width={741} height={350} priority
            className="h-10 w-auto sm:h-12"
          />
          <span aria-hidden className="font-display text-2xl font-light text-goods-cream/45 sm:text-3xl">&times;</span>
          <Image
            src="/images/partners/snow-foundation-white.png"
            alt="Snow Foundation" width={2194} height={1056} priority
            className="h-11 w-auto sm:h-[3.4rem]"
          />
        </div>
        <h1 className="mt-8 max-w-3xl font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
          You went first and then you stayed.
        </h1>
        <p className="mt-6 max-w-[46ch] text-lg leading-[1.65] text-goods-cream/85">
          Money that came early, untied and on trust. Snow backed this before there was a product, a charity, a
          board or a customer. That is why there is anything here to report. Two years on, this is what it bought,
          told as what we did together.
        </p>
        {catalyse && (
          <figure className="m-0 mt-8 flex max-w-[52ch] items-start gap-5">
            {catalyse.person.portrait && (
              <Image
                src={catalyse.person.portrait} alt={catalyse.person.name} width={200} height={200}
                className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-goods-cream/30 sm:h-20 sm:w-20"
              />
            )}
            <div>
              <blockquote className="font-display text-xl leading-[1.4] text-goods-cream sm:text-2xl">
                &ldquo;{catalyse.quote.text}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-[11px] uppercase tracking-[0.14em] text-goods-cream/60">
                {catalyse.person.name}{catalyse.person.role ? `, ${catalyse.person.role}` : ''}
              </figcaption>
            </div>
          </figure>
        )}
        <dl className="mt-8 flex flex-wrap gap-8">
          {[
            { k: 'Invoices', v: String(SNOW_MONEY.goodsInvoices) },
            { k: 'Of all philanthropy', v: `${SNOW_MONEY.shareOfAllPhilanthropyPct}%` },
            { k: 'Most recent', v: 'May 2026' },
          ].map((x) => (
            <div key={x.k}>
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-goods-cream/60">{x.k}</dt>
              <dd className="mt-1 font-display text-3xl leading-none text-goods-cream">{x.v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-xs text-goods-cream/55">
          Password protected. Prepared {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}.
          {' '}
          <Link href={`/partners/${slug}/dashboard`} className="underline text-goods-cream/80">The live dashboard is here.</Link>
        </p>
      </StoryHero>

      <Chapter
        id="ch-making"
        title="A basket, a machine, a bed, a plant and the next machine"
        lead="Five things in the order they were made, because the order is the argument. Each one taught the next and two of them we have stopped selling."
      >
        <ol className="m-0 list-none p-0">
          {THE_ARC.map((s) => (
            <li key={s.id} className="border-t py-8 first:border-t-0 first:pt-0 sm:py-10" style={{ borderColor: RULE }}>
              <div className="grid gap-4 sm:grid-cols-[14rem_1fr] sm:gap-10">
                <div>
                  <p className="font-display text-xl leading-[1.2]" style={{ color: CHARCOAL }}>{s.what}</p>
                  <p className="mt-2 text-[13px] leading-snug" style={{ color: MUTED }}>{s.when}</p>
                  {s.stateLabel && (
                    <p
                      className="mt-3 inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
                      style={chipStyle(s.state)}
                    >
                      {s.stateLabel}
                    </p>
                  )}
                  {s.photo && (
                    <Image
                      src={s.photo.src} alt={s.photo.alt} width={640} height={480}
                      className="mt-5 aspect-[4/3] w-full rounded-lg object-cover"
                      sizes="(min-width: 640px) 14rem, 100vw"
                    />
                  )}
                </div>
                <div>
                  <p className="text-[0.9375rem] leading-[1.75]" style={{ color: `${CHARCOAL}cc` }}>{s.body}</p>
                  {s.figure && (
                    <p className="mt-4 flex items-baseline gap-2.5">
                      <span className="font-display text-3xl leading-none" style={{ color: RUST }}>{s.figure.value}</span>
                      <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>{s.figure.label}</span>
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-[64ch] border-l-2 pl-5 text-base leading-[1.75]" style={{ borderColor: RUST, color: `${CHARCOAL}cc` }}>
          {WHY_FLEXIBLE}
        </p>
        {mykel && <Pull v={mykel} />}
        {mykelFilm && (
          <figure className="m-0 mt-6 max-w-xl sm:ml-[6.25rem]">
            <video
              controls preload="metadata" playsInline poster={mykelFilm.poster}
              className="w-full rounded-lg" style={{ backgroundColor: CHARCOAL }}
            >
              <source src={mykelFilm.src} type="video/mp4" />
            </video>
            <figcaption className="mt-2.5 text-xs" style={{ color: MUTED }}>{mykelFilm.title}</figcaption>
          </figure>
        )}
      </Chapter>

      <div id="ch-first" className="scroll-mt-24">
        <div className="px-5 sm:px-8">
          {/*
            * This header is hand-rolled rather than a <Chapter> because the films underneath it
            * are full bleed and pin themselves. It matches the Chapter treatment by hand, and it
            * carries real bottom padding: with none, the first film butted straight into the last
            * line of the lead and the two read as one broken thing (Ben, 17 September).
            */}
          <div className="mx-auto max-w-4xl border-t pb-16 pt-12 sm:pb-24 sm:pt-16" style={{ borderColor: RULE }}>
            <header className="flex items-baseline justify-between gap-4">
              <span className="font-display text-base leading-none" style={{ color: RUST }}>{chapterNumber('ch-first')}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>{chapterLabel('ch-first')}</span>
            </header>
            <h2 className="mt-7 max-w-3xl font-display text-[2rem] leading-[1.14] sm:text-[2.6rem]" style={{ color: CHARCOAL }}>
              Four places and the order they came in
            </h2>
            <p className="mt-5 max-w-[58ch] text-[1.0625rem] leading-[1.75] sm:text-lg" style={{ color: `${CHARCOAL}b8` }}>
              Kalgoorlie is where the mattresses end up. Tennant Creek is where your money landed first. Maningrida
              is where the making moved onto Country. The people who live in these places say what the work is for
              better than we can, so below they say it.
            </p>
          </div>
        </div>

        <PlaceFilms
          beats={beats}
          mapOutline={outline}
          mapDots={MAP_PLACES.map((p) => ({ id: p.id, name: p.name, lat: p.lat, lng: p.lng, beds: p.beds, washers: p.washers }))}
        />

        <div className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: RUST }}>Every payment, in order</p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
              Eleven payments put beds in houses. Five of them were given before anybody had bought
              anything. Read down: the order is the progress, and it is what the rest of this report
              is built on.
            </p>
            <div className="mt-8">
              <MoneyLedger events={MONEY_EVENTS} monthsBefore={MONTHS_BEFORE_FIRST_SALE} />
            </div>

            <div className="mt-10 rounded-lg p-6 sm:p-8" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
              <p className="font-display text-xl leading-snug sm:text-2xl" style={{ color: CHARCOAL }}>{THE_NEXT_TEN.heading}</p>
              <div className="mt-7 space-y-5">
                {TRADE_BY_YEAR.map((y) => {
                  const top = Math.max(...TRADE_BY_YEAR.map((z) => z.aud));
                  return (
                    <div key={y.year}>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-display text-lg tabular-nums" style={{ color: CHARCOAL }}>{y.year}</span>
                        <span className="text-xs" style={{ color: MUTED }}>
                          {y.beds} beds across {y.invoices} {y.invoices === 1 ? 'invoice' : 'invoices'}
                        </span>
                        <span className="ml-auto font-display text-xl tabular-nums" style={{ color: RUST }}>
                          ${y.aud.toLocaleString('en-AU')}
                        </span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full" style={{ backgroundColor: RULE_SOFT }}>
                        <span className="block h-full rounded-full" style={{ width: `${(y.aud / top) * 100}%`, backgroundColor: RUST }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs" style={{ color: MUTED }}>What buyers paid, by the year the money landed.</p>
              <p className="mt-7 max-w-[62ch] text-base leading-[1.75]" style={{ color: `${CHARCOAL}cc` }}>{THE_NEXT_TEN.body}</p>
              <p className="mt-3 max-w-[62ch] text-base leading-[1.75]" style={{ color: `${CHARCOAL}cc` }}>{THE_NEXT_TEN.holder}</p>
              <p className="mt-3 max-w-[62ch] text-base leading-[1.75]" style={{ color: `${CHARCOAL}cc` }}>{THE_NEXT_TEN.forward}</p>

              {/*
                * The deck's own ten-year model, pushable. Ben, 17 September: show where this can
                * go as communities add facilities locally, how many beds get made in community,
                * and give it a slider. It recomputes from ten-year-scale.ts, the module the deck
                * slide prints from, and it carries its own claim ceiling, which is why the line
                * above hands over to it rather than saying there is no ten-year number.
                */}
              <div className="mt-8 border-t pt-8" style={{ borderColor: RULE }}>
                <TenYearSlider showCeiling={false} />
              </div>
            </div>
            

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg p-6" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
                <p className="font-display text-2xl" style={{ color: CHARCOAL }}>{money(SNOW_MONEY.goodsOnlyIncGstAud)}</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>
                  Given to Goods across {SNOW_MONEY.goodsInvoices} invoices, including GST. Nothing outstanding.
                </p>
              </div>
              <div className="rounded-lg p-6" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
                <p className="font-display text-2xl" style={{ color: CHARCOAL }}>{SNOW_MONEY.shareOfAllPhilanthropyPct}%</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>
                  Of every philanthropic dollar Goods has ever received.
                </p>
              </div>
              <div className="rounded-lg p-6" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
                <p className="font-display text-2xl" style={{ color: CHARCOAL }}>May 2026</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>
                  The most recent invoice. This partnership is still running.
                </p>
              </div>
            </div>


            {/*
              * THE HINGE INTO CHAPTER THREE. Ben, 17 September: think about progress, then the
              * way we are finding more buyers, and let that lead into the charity, its Indigenous
              * governance and what that governance is for.
              */}
            <div className="mt-12 rounded-lg p-6 sm:p-8" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4', borderLeft: `4px solid ${RUST}` }}>
              <p className="font-display text-xl leading-snug sm:text-2xl" style={{ color: CHARCOAL }}>{PROGRESS_BRIDGE.heading}</p>
              <p className="mt-4 max-w-[62ch] text-base leading-[1.75]" style={{ color: `${CHARCOAL}cc` }}>{PROGRESS_BRIDGE.progress}</p>
              <p className="mt-3 max-w-[62ch] text-base leading-[1.75]" style={{ color: `${CHARCOAL}cc` }}>{PROGRESS_BRIDGE.buyers}</p>
              <p className="mt-3 max-w-[62ch] text-base leading-[1.75]" style={{ color: `${CHARCOAL}cc` }}>{PROGRESS_BRIDGE.price}</p>
              <p className="mt-6 max-w-[62ch] border-t pt-5 text-base leading-[1.75]" style={{ borderColor: RULE, color: `${CHARCOAL}cc` }}>
                {PROGRESS_BRIDGE.charity}
              </p>
              <p className="mt-3 text-sm" style={{ color: MUTED }}>{PROGRESS_BRIDGE.forward}</p>
            </div>

            {/* catalyse now opens the report in the hero, so the money chapter does not repeat it. */}
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {backing && <Pull v={backing} flush />}
              {blessings && (
                <Pull
                  v={blessings}
                  flush
                  note="Dianne is talking about Ben and Nic, on the day the washing machine she named arrived."
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Chapter
        id="ch-board"
        title={ORGANISATION.boardLine}
        lead="Snow said in November 2025 that all future grants would require First Nations leadership and that every partner would be reviewed. This is our answer and it was underway before the question."
      >
        <div className="grid gap-5 sm:grid-cols-3">
          {goodsBoard.map((d) => (
            <div key={d.name} className="overflow-hidden rounded-lg" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
              <Image
                src={d.photo} alt={d.name} width={640} height={640}
                sizes="(min-width: 640px) 18rem, 100vw"
                className="aspect-[5/4] w-full object-cover object-top"
              />
              <div className="p-6">
              <p className="font-display text-lg leading-snug" style={{ color: CHARCOAL }}>{d.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: SAGE }}>{d.country}</p>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{d.bio}</p>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{d.goods}</p>
              <p className="mt-3 text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>{d.photoCredit}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg p-5" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
          <p className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            {ORGANISATION.legalName}, ABN {ORGANISATION.abn}. A registered charity with deductible gift recipient
            status. The board handover is still in progress and no chair has been appointed, which we would rather
            say here than have you find later.
          </p>
        </div>
        {ownershipVoices.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {ownershipVoices.map((v) => (
              <figure key={`${v.person.name}-${v.quote.text.slice(0, 24)}`} className="m-0 rounded-lg p-6" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
                {v.person.portrait && (
                  <Image src={v.person.portrait} alt={v.person.name} width={160} height={160} className="h-14 w-14 rounded-full object-cover" />
                )}
                <blockquote className="mt-4 font-display text-lg leading-[1.35]" style={{ color: CHARCOAL }}>
                  &ldquo;{v.quote.text}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-[11px] uppercase tracking-[0.12em]" style={{ color: SAGE }}>
                  {v.person.name}{v.person.role ? `, ${v.person.role}` : ''}
                </figcaption>
                {/*
                  * The context, because not every one of these was said about beds. Jeremy's was
                  * recorded on Country with young people at Kununurra, under Basecamps, and a
                  * funder reading it deserves to know that rather than assume it is about Goods.
                  */}
                {v.quote.context && (
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: MUTED }}>{v.quote.context}</p>
                )}
              </figure>
            ))}
          </div>
        )}

        <div className="mt-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: RUST }}>The model, in plain words</p>
          <p className="mt-3 max-w-[58ch] text-base leading-[1.75]" style={{ color: `${CHARCOAL}b8` }}>
            Community-led is a word that gets used loosely, so here is ours as four things that
            either happen or do not. Three of them happen today. The fourth has never happened
            anywhere and it says so.
          </p>
          <ol className="m-0 mt-7 grid list-none gap-5 p-0 sm:grid-cols-2">
            {COMMUNITY_MODEL.map((s) => (
              <li
                key={s.step}
                className="rounded-lg p-6"
                style={{
                  backgroundColor: PANEL,
                  border: s.state === 'future' ? '1px dashed #C2B6AA' : '1px solid #E8DED4',
                }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-sm" style={{ color: RUST }}>{s.step}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: s.state === 'future' ? MUTED_DEEP : SAGE }}>
                    {s.state === 'future' ? 'Not yet, anywhere' : 'Happens today'}
                  </span>
                </div>
                <p className="mt-3 font-display text-lg leading-[1.25]" style={{ color: CHARCOAL }}>{s.title}</p>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.7]" style={{ color: `${CHARCOAL}b8` }}>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: RUST }}>Who we are already working with</p>
          <p className="mt-3 max-w-[58ch] text-base leading-[1.75]" style={{ color: `${CHARCOAL}b8` }}>
            These are the places the register counts beds against, by name, with a community and a
            date behind every one. Across all {CANONICAL_ASSETS.communitiesServed} communities it
            holds {CANONICAL_ASSETS.bedsDeployed} beds and {CANONICAL_ASSETS.washersInCommunity} machines.
          </p>
          <ul className="m-0 mt-6 grid list-none gap-px overflow-hidden rounded-lg p-0" style={{ backgroundColor: RULE }}>
            {MAP_PLACES.map((pl) => (
              <li key={pl.id} className="grid gap-2 p-5 sm:grid-cols-[13rem_1fr] sm:gap-6" style={{ backgroundColor: PANEL }}>
                <div>
                  <p className="font-display text-base leading-snug" style={{ color: CHARCOAL }}>{pl.name}</p>
                  <p className="mt-1 text-xs" style={{ color: MUTED }}>
                    {pl.beds} beds
                    {pl.washers > 0 ? ` · ${pl.washers} machines` : ''}
                  </p>
                </div>
                <p className="text-[0.9375rem] leading-[1.65]" style={{ color: `${CHARCOAL}b8` }}>{pl.note}</p>
              </li>
            ))}
          </ul>
        </div>

        {norman && (
          <Pull
            v={norman}
            note="Norman is talking about Wilya Janta, the Warumungu housing organisation he founded in Tennant Creek, not about Goods."
          />
        )}
      </Chapter>

      {/*
        * Full bleed, outside the chapter column. ModelLoopBuild pins its own stage to the
        * viewport and scales the ring to min(width, height) of its box, so a max-width column
        * with the component's own lg:pr-48 rail clearance inside it left the ring at a fifth of
        * its size (Ben, 17 September: "why is it so tiny?").
        */}
      <ModelLoopBuild
        steps={LOOP_STEPS} stations={LOOP_STATIONS} arcs={LOOP_ARCS} counts={LOOP_COUNTS}
        sheetSvg={placematSvg} items={placematItems} arrows={placematArrows}
      />

      <Chapter
        id="ch-alice"
        title="Oonchiumpa operate it, employ young people and keep leading that place"
        lead="The Indigenous ownership story with a date attached. It is also the thing Snow is being invited into."
      >
        <div className="rounded-lg p-6 sm:p-8" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>
            {OONCHIUMPA_NEXT.partner} &middot; {OONCHIUMPA_NEXT.place}
          </p>
          <p className="mt-2 font-display text-xl leading-snug sm:text-2xl" style={{ color: CHARCOAL }}>{OONCHIUMPA_NEXT.what}</p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-4">
            {OONCHIUMPA_NEXT.steps.map((st, i) => (
              <li key={st.title} className="rounded-lg p-4" style={{ backgroundColor: CREAM, borderTop: `3px solid ${st.state === 'future' ? RULE_DASH : RUST}` }}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide" style={{ backgroundColor: st.state === 'future' ? RULE_SOFT : RUST_WASH, color: st.state === 'future' ? MUTED_DEEP : RUST_INK }}>
                    {st.state === 'future' ? 'not yet' : 'proposed'}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>{st.title}</p>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{st.detail}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>{OONCHIUMPA_NEXT.status}</p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{OONCHIUMPA_NEXT.connection}</p>
        </div>
        {karen && <Pull v={karen} />}
      </Chapter>

      <Chapter
        id="ch-buyers"
        title="Four buyers, five invoices, 320 beds and the price went up"
      >
        <div className="rounded-lg p-6 sm:p-8" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: RUST }}>What a buyer paid, per bed, in order</p>
            <p className="text-sm" style={{ color: MUTED }}>
              <span className="font-display text-2xl leading-none" style={{ color: RUST }}>
                +{Math.round(((priceRungs[priceRungs.length - 1].perBed - priceRungs[0].perBed) / priceRungs[0].perBed) * 100)}%
              </span>{' '}
              from the cheapest bed to the dearest
            </p>
          </div>
          {/* Each rung is an invoice, labelled with who paid it, so the rise is a list of people
              rather than a chart of a trend. */}
          <ol className="m-0 mt-7 grid list-none grid-cols-5 items-end gap-1.5 p-0 sm:gap-4" style={{ minHeight: 170 }}>
            {priceRungs.map((r, i) => {
              const last = i === priceRungs.length - 1;
              return (
                <li key={r.invoice} className="flex h-full flex-col justify-end">
                  <p className="mb-2 text-center font-display text-[13px] leading-none sm:text-xl" style={{ color: last ? RUST : CHARCOAL }}>${r.perBed}</p>
                  <div
                    className="w-full rounded-t-md"
                    style={{ height: `${Math.round((r.perBed / 920) * 132)}px`, backgroundColor: last ? RUST : RULE_DASH }}
                  />
                  <p className="mt-2 text-center text-[9px] leading-tight sm:text-[10px]" style={{ color: MUTED }}>{r.who}</p>
                  <p className="text-center text-[9px] leading-tight sm:text-[10px]" style={{ color: MUTED }}>{r.beds} beds</p>
                  <p className="hidden text-center text-[10px] leading-tight sm:block" style={{ color: RULE_DASH }}>bed line ${r.line}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {BUYERS.map((b) => (
            <div key={b.id} className="flex flex-col rounded-lg p-6" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4', borderTop: `2px solid ${RUST}` }}>
              <p className="inline-block self-start rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ backgroundColor: RUST_WASH, color: RUST_INK }}>{b.route}</p>
              <p className="mt-4 font-display text-xl leading-[1.2]" style={{ color: CHARCOAL }}>{b.buyer}</p>
              <p className="mt-1 text-xs" style={{ color: MUTED }}>{b.forPlace} &middot; {b.invoices}</p>
              <div className="mt-3 flex gap-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>Beds</p>
                  <p className="font-display text-xl leading-none" style={{ color: CHARCOAL }}>{b.beds}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>Bed line</p>
                  <p className="font-display text-xl leading-none" style={{ color: CHARCOAL }}>
                    {b.firstPrice === b.latestPrice ? `$${b.latestPrice}` : `$${b.firstPrice} then $${b.latestPrice}`}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{b.what}</p>
            </div>
          ))}
        </div>

      </Chapter>

      <Chapter
        id="ch-washers"
        title="Six machines are sending us readings"
      >
        <div className="grid gap-4 sm:grid-cols-4">
          {WASHER_PLACES.map((w) => (
            <div key={w.place} className="rounded-lg p-5" style={{ backgroundColor: PANEL, border: `1px solid ${RULE}` }}>
              <p className="font-display text-3xl leading-none" style={{ color: CHARCOAL }}>{w.inCommunity}</p>
              <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>{w.place}</p>
            </div>
          ))}
        </div>

        {/* Norm's machine, given the room it earns. The bars are real months, not a shape. */}
        <div className="mt-8 overflow-hidden rounded-lg" style={{ backgroundColor: PANEL, border: `1px solid ${RULE}` }}>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: RUST }}>
                Norm&rsquo;s house, Tennant Creek
              </p>
              {/*
                * Ben supplied this on 17 September. Norman Frank with the machine, 28 June 2025,
                * the day before Snow bought one. The name is pressed into the recycled plastic on
                * the front of it, which is the whole argument in one photograph.
                */}
              <figure className="m-0 mt-4">
                <Image
                  src="/images/community/tennant-creek/norman-frank-pakkimjalki-kari.jpg"
                  alt="Norman Frank beside Pakkimjalki Kari, the washing machine, its recycled plastic enclosure carrying the name"
                  width={2000} height={1333}
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="w-full rounded-lg object-cover"
                />
                <figcaption className="mt-2 text-xs" style={{ color: MUTED }}>
                  Norman Frank with Pakkimjalki Kari, 28 June 2025. The name is pressed into the plastic.
                </figcaption>
              </figure>
              <p className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-6xl leading-none" style={{ color: CHARCOAL }}>952</span>
                <span className="text-sm" style={{ color: MUTED }}>washes, and 48 short of a thousand</span>
              </p>

              <div className="mt-8 flex h-40 items-end gap-1.5 sm:gap-2.5">
                {NORM_MONTHS.map((m, i) => {
                  const top = Math.max(...NORM_MONTHS.map((x) => x.washes));
                  const part = i === NORM_MONTHS.length - 1;
                  return (
                    <div key={m.month} className="flex min-w-0 flex-1 flex-col items-center justify-end">
                      <span className="mb-1.5 text-[10px] tabular-nums" style={{ color: MUTED }}>{m.washes}</span>
                      <span
                        className="w-full rounded-t"
                        style={{
                          height: `${Math.max(4, (m.washes / top) * 116)}px`,
                          backgroundColor: RUST,
                          opacity: part ? 0.45 : 1,
                        }}
                      />
                      <span className="mt-1.5 text-[10px]" style={{ color: MUTED }}>{m.label}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs" style={{ color: MUTED }}>
                Washes a month. September is part of a month, to the sixteenth.
              </p>
            </div>

            <div className="border-t p-6 sm:p-8 lg:border-l lg:border-t-0" style={{ borderColor: RULE, backgroundColor: SUNK }}>
              <div className="space-y-5">
                {[
                  { v: '2,613', k: 'kilowatt hours' },
                  { v: '2.7', k: 'kWh a wash' },
                  { v: '11', k: 'months without a gap' },
                  { v: '3 a day', k: 'in one house' },
                ].map((s) => (
                  <div key={s.k}>
                    <p className="font-display text-2xl leading-none" style={{ color: CHARCOAL }}>{s.v}</p>
                    <p className="mt-1 text-xs" style={{ color: MUTED }}>{s.k}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 border-t pt-4 text-xs leading-relaxed" style={{ borderColor: RULE, color: `${CHARCOAL}b8` }}>
                Still reporting on 16 September. Nobody models three washes a day in one house. This machine
                measured it.
              </p>
            </div>
          </div>
        </div>

        <dl className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { v: WASHER_TELEMETRY.totalCycles.toLocaleString('en-AU'), k: 'washes' },
            { v: WASHER_TELEMETRY.totalKwh.toLocaleString('en-AU'), k: 'kilowatt hours' },
            { v: `${WASHER_TELEMETRY.reporting} of ${CANONICAL_ASSETS.washersInCommunity}`, k: 'with a controller' },
          ].map((s) => (
            <div key={s.k}>
              <dd className="font-display text-4xl leading-none" style={{ color: CHARCOAL }}>{s.v}</dd>
              <dt className="mt-2 text-xs uppercase tracking-wide" style={{ color: MUTED }}>{s.k}</dt>
            </div>
          ))}
        </dl>

        {/* Machines that have recorded washes. Simple. */}
        <div className="mt-8 overflow-hidden rounded-lg" style={{ border: `1px solid ${RULE}`, backgroundColor: PANEL }}>
          {WASHER_FLEET.filter((r) => r.cycles >= 10).map((r, i) => {
            const top = Math.max(...WASHER_FLEET.map((x) => x.cycles));
            return (
              <div
                key={r.assetId}
                className="grid items-center gap-2 px-5 py-4 sm:grid-cols-[1fr_9rem] sm:gap-6 sm:px-7"
                style={{ borderTop: i === 0 ? undefined : `1px solid ${RULE_SOFT}` }}
              >
                <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>{r.where}</p>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl tabular-nums" style={{ color: CHARCOAL }}>{r.cycles}</span>
                  <span className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: RULE_SOFT }}>
                    <span className="block h-full rounded-full" style={{ width: `${(r.cycles / top) * 100}%`, backgroundColor: RUST }} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {proud && (
          <figure className="m-0 mx-auto mt-12 flex max-w-[44ch] flex-col items-center text-center">
            {proud.person.portrait && (
              <Image src={proud.person.portrait} alt={proud.person.name} width={200} height={200} className="h-20 w-20 rounded-full object-cover" />
            )}
            <blockquote className="mt-5 font-display text-2xl leading-[1.3] sm:text-3xl" style={{ color: CHARCOAL }}>
              &ldquo;{proud.quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-xs" style={{ color: MUTED }}>
              {proud.person.name}, asked how it feels to have a washing machine named in Warumungu
            </figcaption>
          </figure>
        )}

        {washerVoices.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {washerVoices.map((v) => (
              <figure key={v.person.name} className="m-0">
                {v.person.portrait && (
                  <Image src={v.person.portrait} alt={v.person.name} width={160} height={160} className="h-14 w-14 rounded-full object-cover" />
                )}
                <blockquote className="mt-3 font-display text-base leading-[1.4]" style={{ color: CHARCOAL }}>&ldquo;{v.quote.text}&rdquo;</blockquote>
                <figcaption className="mt-2 text-[11px] uppercase tracking-[0.12em]" style={{ color: SAGE }}>{v.person.name}</figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {WASHER_NEXT.map((n) => (
            <div key={n.title} className="rounded-lg p-6" style={{ backgroundColor: PANEL, border: `1px dashed ${RULE_DASH}` }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: MUTED_DEEP }}>Next</p>
              <p className="mt-2 font-display text-base leading-snug" style={{ color: CHARCOAL }}>{n.title}</p>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{n.detail}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter
        id="ch-films"
        title="The films"
        lead="Three. Each plays where it sits and only one at a time."
      >
        <FilmGallery films={films} />
      </Chapter>

      <div id="ch-archive" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: RUST }}>07 &middot; The archive</p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl" style={{ color: CHARCOAL }}>The photographs</h2>
        </div>
        <div className="mt-8">
          <PhotoWall
            groups={wallGroups}
            title="Two years, in frames"
            sub=""
          />
        </div>
      </div>

      <Chapter
        id="ch-together"
        title="Two years and the money is the smallest part of it"
        lead="Trips, rooms, introductions and the times Snow told this story in its own voice. Filter the money out and see what is left."
      >
        <TogetherTimeline moments={TOGETHER} />
        {smallStart && <Pull v={smallStart} />}
      </Chapter>

      <Chapter
        id="ch-because"
        title="What the money turned into"
        lead="Counts where we have counts and labels where we do not. The last number on this list is zero and it is the one we print against ourselves."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BECAUSE_OF.map((b) => (
            <div key={b.id} className="rounded-lg p-6" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
              {/* MeasureLabel has no `future` and inventing one here would put a word on a
                  chip that the rest of the site does not use. A future row gets its own chip. */}
              {b.status === 'future' ? (
                <>
                  <p className="font-display text-4xl leading-none" style={{ color: CHARCOAL }}>{b.value}</p>
                  <span className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ backgroundColor: RULE_SOFT, color: MUTED_DEEP }}>
                    not yet
                  </span>
                </>
              ) : (
                <CountUp value={b.value} unit={b.unit} label={b.status} />
              )}
              <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>{b.headline}</p>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{b.detail}</p>
            </div>
          ))}
        </div>
        {withNotFor && <Pull v={withNotFor} />}
      </Chapter>

      <Chapter
        id="ch-themes"
        title="Five things this is, and the limit on each one"
        lead="Health, the plastic, paid work, enterprise and Indigenous ownership. Each card carries what we can show and what we cannot, in the same card, because a limit printed somewhere else reads as a disclaimer."
      >
        {recycled && <Pull v={recycled} />}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {THEMES.map((th) => (
            <div key={th.id} className="flex flex-col rounded-lg p-6" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
              <p className="font-display text-xl leading-[1.2]" style={{ color: CHARCOAL }}>{th.title}</p>
              <p className="mt-3 text-[0.9375rem] leading-[1.7]" style={{ color: `${CHARCOAL}cc` }}>{th.body}</p>
              <p className="mt-5 rounded-md px-4 py-3 text-[0.9375rem] leading-[1.6]" style={{ backgroundColor: SAGE_WASH, color: SAGE_INK }}>
                <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: SAGE_INK }}>Shown</span>
                {th.proof}
              </p>
              <p className="mt-3 rounded-md border px-4 py-3 text-[0.9375rem] leading-[1.6]" style={{ borderColor: RULE_DASH, color: `${CHARCOAL}b3` }}>
                <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: RUST }}>Not shown</span>
                {th.limit}
              </p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter
        id="ch-next"
        title="A letter this month and 133 beds behind it"
        lead="Two asks. The first one is not money and it has a date on it. The second is the same ask we have put to our other bed funders, so nobody is being asked for something shaped specially for them."
      >
        <div className="rounded-lg p-6 sm:p-8" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4', borderLeft: `4px solid ${RUST}` }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>First and it is not money</p>
          <p className="mt-2 font-display text-2xl leading-snug sm:text-3xl" style={{ color: CHARCOAL }}>
            A letter of intent, by {THE_LETTER.by}
          </p>
          <p className="mt-4 text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            Goods on Country is one of ten enterprises in {THE_LETTER.programme}. That application closes{' '}
            {THE_LETTER.closes} and it asks QBE for ${THE_LETTER.qbeAskAud.toLocaleString('en-AU')} for{' '}
            {THE_LETTER.qbeFor.toLowerCase()}. {THE_LETTER.cohort}
          </p>
          <p className="mt-3 text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            What the programme counts from a funder is engagement and it counts several shapes of it.{' '}
            {THE_LETTER.forms}
          </p>
          <figure className="m-0 mt-5 border-l-2 pl-4" style={{ borderColor: SAGE }}>
            <blockquote className="font-display text-lg leading-snug" style={{ color: CHARCOAL }}>
              &ldquo;{THE_LETTER.sihQuote}&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-xs" style={{ color: SAGE }}>{THE_LETTER.sihSource}</figcaption>
          </figure>
          <p className="mt-5 text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>{THE_LETTER.enough}</p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>
            {THE_LETTER.verify}{' '}
            <Link href={THE_LETTER.sihLetterHref} className="underline" style={{ color: RUST }}>
              The Hub&rsquo;s letter is here.
            </Link>
          </p>
        </div>

        <div className="mt-6 rounded-lg p-6 sm:p-8" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>Then, the ask itself</p>
          <p className="mt-2 font-display text-3xl sm:text-4xl" style={{ color: CHARCOAL }}>$99,750</p>
          <p className="mt-2 text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            133 Stretch Beds at $750 each, for a community organisation to sell or give out. The money reaches the
            community organisation, not us: customers pay them directly and after costs they decide whether it
            becomes more beds, paid local work, or making their own.
          </p>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            {[
              { k: 'Where it goes', v: 'To a community organisation, as stock they own.' },
              { k: 'Who decides next', v: 'They do. More beds, paid work, or their own making.' },
              { k: 'What we keep', v: 'What is left after making, freight and facilitation, which carries the organisation.' },
            ].map((x) => (
              <div key={x.k}>
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>{x.k}</p>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>{x.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-lg p-6 sm:p-8" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>The longer conversation</p>
          <p className="mt-2 text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            Beyond this, we would like to talk with you about whether some of what comes after could be recoverable
            capital: money that returns to Snow over time and goes back to work. That is a conversation we are
            opening. There is no proposal on the table. The amount, the conditions it would carry and the impact it would
            be held to are all things to work out together and it sits alongside the partnership we already have.
          </p>
        </div>

        <div className="mt-6 rounded-lg p-6 sm:p-8" style={{ backgroundColor: PANEL, border: '1px solid #E8DED4' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>What we would do together</p>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            <li>Keep the beds travelling with the heart screening, where the Trek has already shown it works.</li>
            <li>Build the training the paid work card says we do not yet have, so capacity is a count rather than an intention.</li>
            <li>Carry the first transfer of a production site into community hands and report on it whether or not it goes smoothly.</li>
            <li>Keep the story in the hands of the people telling it. Thirty-nine people have agreed by name and nobody else appears.</li>
          </ul>
        </div>
      </Chapter>

      {/*
        * THE LAST WORD IS NORM'S. Ben chose it on 17 September: a Warumungu Elder on why any of
        * this gets written down, which is the argument for the consent register, the asset
        * register and this report itself, made by one of the people the registers are about. It
        * sits outside the ask chapter because it is not part of the ask.
        */}
      {documenting && (
        <div className="px-5 pb-4 sm:px-8">
          <div className="mx-auto max-w-4xl border-t pt-12" style={{ borderColor: RULE }}>
            <figure className="m-0 flex max-w-[52ch] items-start gap-5">
              {documenting.person.portrait && (
                <Image
                  src={documenting.person.portrait} alt={documenting.person.name} width={200} height={200}
                  className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-20 sm:w-20"
                />
              )}
              <div>
                <blockquote className="font-display text-xl leading-[1.35] sm:text-2xl" style={{ color: CHARCOAL }}>
                  &ldquo;{documenting.quote.text}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-[11px] uppercase tracking-[0.14em]" style={{ color: SAGE }}>
                  {documenting.person.name}, {documenting.person.role}
                </figcaption>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: MUTED }}>
                  Recorded 6 April 2025, talking about Wilya Janta, the Warumungu housing organisation he founded.
                </p>
              </div>
            </figure>
          </div>
        </div>
      )}

      <footer className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-4xl border-t pt-8" style={{ borderColor: RULE }}>
          <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
            Every figure here traces to the live books, the register or the consent record and every Snow quote
            carries a date. Where a number is modelled or a target, it says so on the number
            itself. Prepared by {ORGANISATION.legalName} for the Snow Foundation.
          </p>
        </div>
      </footer>
    </main>
  );
}
