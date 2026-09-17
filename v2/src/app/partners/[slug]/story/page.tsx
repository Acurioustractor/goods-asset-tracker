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
  MONEY_EVENTS, MONTHS_BEFORE_FIRST_SALE, NOT_FINISHED, OONCHIUMPA_NEXT, PLACE_BEATS, PRICE_LADDER,
  SNOW_MONEY, THE_ARC, THE_LETTER, TOGETHER,
  WALLS, WHY_FLEXIBLE,
  WASHER_NEXT, WASHER_PLACES, WASHER_TELEMETRY,
} from '@/lib/data/snow-partnership';
import { snowHeroFrames } from '@/lib/data/snow-photos';
import { ChapterRail } from '@/components/pitch/chapter-rail';
import { CountUp } from '@/components/pitch/count-up';
import { TogetherTimeline } from '@/components/partners/together-timeline';
import { AlignmentTable } from '@/components/partners/alignment-table';
import { FilmGallery, type GalleryFilm } from '@/components/partners/film-gallery';
import { StoryHero } from '@/components/partners/story-hero';
import { PlaceFilms, type PlaceBeat } from '@/components/partners/place-films';
import { GrowthStory } from '@/components/partners/growth-story';
import { PAID_INVOICE_BEDS } from '@/lib/data/paid-trade';
import { PhotoWall } from '@/components/pitch/photo-wall';

/**
 * THE SNOW PARTNERSHIP REPORT. Password gated in proxy.ts alongside the dashboard.
 *
 * Ben, 16 September 2026: an interactive report in the shape of /pitch, about the partnership
 * about the partnership itself. What we have done together, what Goods is because of it, and
 * how the two organisations keep working at rheumatic heart disease through Indigenous
 * leadership.
 *
 * CHAPTER ONE IS THE HEALTH CHAIN and the product comes after it. That is Sally
 * Grimsley-Ballard's own
 * instruction from 20 May 2026, reviewing our Canberra page: "A cold audience needs that chain
 * explained immediately and plainly, before the product, before the manufacturing story." The
 * sentence in chapter one is close to the one she wrote for us.
 *
 * Every Snow intention on this page is a dated quote or it is absent. Every community and
 * funder voice resolves from the registry by slug, default-deny, so a wrong tier or an
 * unapproved quote renders nothing at all.
 */

const CREAM = '#FDF8F3';
const CHARCOAL = '#2E2E2E';
const RUST = '#C45C3E';
const SAGE = '#8B9D77';
/** One hairline and one muted label colour, so the page has a single quiet register. */
const RULE = '#EBE2D8';
const MUTED = '#A2958A';

export const metadata: Metadata = {
  title: { absolute: 'Snow and Goods | Goods on Country' },
  description: 'What we have built together since 2024 and what comes next.',
  robots: { index: false, follow: false },
};

const CHAPTERS = [
  { id: 'ch-making', number: '01', label: 'What we made' },
  { id: 'ch-first', number: '02', label: 'Snow went first' },
  { id: 'ch-alice', number: '03', label: 'Alice Springs' },
  { id: 'ch-buyers', number: '04', label: 'Who is buying' },
  { id: 'ch-washers', number: '05', label: 'The machines' },
  { id: 'ch-films', number: '06', label: 'In their own words' },
  { id: 'ch-archive', number: '07', label: 'The archive' },
  { id: 'ch-together', number: '08', label: 'What we have done' },
  { id: 'ch-because', number: '09', label: 'What Goods is now' },
  { id: 'ch-board', number: '10', label: 'Who holds it' },
  { id: 'ch-align', number: '11', label: 'Your strategy, our evidence' },
  { id: 'ch-unfinished', number: '12', label: 'What is not finished' },
  { id: 'ch-next', number: '13', label: 'What we are asking' },
] as const;

/** Default-deny, same shape as funder-moments: wrong tier or unapproved renders nothing. */
function quote(slug: string, tier: 'funder' | 'external', contains: string) {
  const person = getStorytellerBySlug(slug);
  if (!person || person.tier !== tier) return null;
  const q = person.quotes.find(
    (x) => (x.status === 'primary' || x.status === 'approved') && x.text.includes(contains),
  );
  return q ? { person, quote: q } : null;
}

function Pull({ v }: { v: NonNullable<ReturnType<typeof quote>> }) {
  return (
    <figure className="m-0 mt-12 flex max-w-[52ch] items-start gap-5">
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
      </div>
    </figure>
  );
}

/** The arc's state chips. Sage is in community, rust is live, grey is retired or not yet. */
function chipStyle(state: (typeof THE_ARC)[number]['state']): React.CSSProperties {
  if (state === 'in-community') return { backgroundColor: '#EEF1E9', color: '#556945' };
  if (state === 'now') return { backgroundColor: '#F6E4DE', color: '#9A4023' };
  if (state === 'commissioning') return { backgroundColor: '#F7EDE4', color: '#8A5A34' };
  if (state === 'next') return { border: '1px dashed #C2B6AA', color: '#6A5E54' };
  return { backgroundColor: '#EEE9E3', color: '#6A5E54' };
}

function Chapter({ id, number, label, title, lead, children }: {
  id: string; number: string; label: string; title: string; lead?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 px-5 sm:px-8">
      <div className="mx-auto max-w-4xl border-t py-12 sm:py-16" style={{ borderColor: RULE }}>
        <header className="flex items-baseline gap-4">
          <span className="font-display text-base leading-none" style={{ color: RUST }}>{number}</span>
          <span className="h-px flex-1" style={{ backgroundColor: RULE }} />
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

  const wallGroups = WALLS.map((w) => ({
    label: w.label,
    photos: w.files.map((f) => ({ src: w.dir + f.file, alt: f.alt, caption: f.caption })),
  }));
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

  // The same outline the /pitch map draws, read on the server and passed in as a path string.
  const outline = await readFile(join(process.cwd(), 'public/images/maps/australia-outline.svg'), 'utf8')
    .then((x) => x.replace(/<\/?svg[^>]*>/g, '').trim())
    .catch(() => '');

  return (
    <main style={{ backgroundColor: CREAM }}>
      <ChapterRail chapters={CHAPTERS} />

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
        id="ch-making" number="01" label="What we made"
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
            <header className="flex items-baseline gap-4">
              <span className="font-display text-base leading-none" style={{ color: RUST }}>02</span>
              <span className="h-px flex-1" style={{ backgroundColor: RULE }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Snow went first</span>
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
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: RUST }}>The map, as it filled in</p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
              Watch it grow, or scrub the years yourself. Snow&rsquo;s money was there before most of these dots
              existed.
            </p>
            <div className="mt-8">
              <GrowthStory
                places={MAP_PLACES}
                events={MONEY_EVENTS}
                totalBeds={CANONICAL_ASSETS.bedsDeployed}
                totalWashers={CANONICAL_ASSETS.washersInCommunity}
                communities={CANONICAL_ASSETS.communitiesServed}
                bedsBought={PAID_INVOICE_BEDS}
                monthsBefore={MONTHS_BEFORE_FIRST_SALE}
              />
            </div>
            {/*
              * The map carries six places and the register carries eleven communities, so the
              * bed count under the scrub is smaller than the canonical one. Said out loud here,
              * because a funder who adds the dots up deserves to find the answer rather than a
              * discrepancy.
              */}
            <p className="mt-3 text-xs leading-relaxed" style={{ color: MUTED }}>
              Six places, which are the ones where the register holds a bed count against a
              community and a date. Across all eleven communities the register holds{' '}
              {CANONICAL_ASSETS.bedsDeployed} beds and {CANONICAL_ASSETS.washersInCommunity} machines.
              The sage ring marks a place with machines in it.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="font-display text-2xl" style={{ color: CHARCOAL }}>{money(SNOW_MONEY.goodsOnlyIncGstAud)}</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>
                  Given to Goods across {SNOW_MONEY.goodsInvoices} invoices, including GST. Nothing outstanding.
                </p>
              </div>
              <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="font-display text-2xl" style={{ color: CHARCOAL }}>{SNOW_MONEY.shareOfAllPhilanthropyPct}%</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>
                  Of every philanthropic dollar Goods has ever received.
                </p>
              </div>
              <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="font-display text-2xl" style={{ color: CHARCOAL }}>May 2026</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>
                  The most recent invoice. This partnership is still running.
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed" style={{ color: '#A99C8F' }}>{SNOW_MONEY.basisNote}</p>

            {/* catalyse now opens the report in the hero, so the money chapter does not repeat it. */}
            {backing && <Pull v={backing} />}
          </div>
        </div>
      </div>

      <Chapter
        id="ch-alice" number="03" label="Alice Springs"
        title="Oonchiumpa operate it, employ young people and keep leading that place"
        lead="The Indigenous ownership story with a date attached. It is also the thing Snow is being invited into."
      >
        <div className="rounded-lg p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>
            {OONCHIUMPA_NEXT.partner} &middot; {OONCHIUMPA_NEXT.place}
          </p>
          <p className="mt-2 font-display text-xl leading-snug sm:text-2xl" style={{ color: CHARCOAL }}>{OONCHIUMPA_NEXT.what}</p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-4">
            {OONCHIUMPA_NEXT.steps.map((st, i) => (
              <li key={st.title} className="rounded-lg p-4" style={{ backgroundColor: CREAM, borderTop: `3px solid ${st.state === 'future' ? '#B8AEA4' : RUST}` }}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#A99C8F' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide" style={{ backgroundColor: st.state === 'future' ? '#EEE9E3' : '#F6E4DE', color: st.state === 'future' ? '#6A5E54' : '#9A4023' }}>
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
        id="ch-buyers" number="04" label="Who is buying"
        title="Four buyers, five invoices, 320 beds and the price went up"
        lead="This is the thing Sally asked for most and it is the deliverable the QBE volunteer team is working on. Everything here is an invoice that was issued and paid. Nothing here is a forecast."
      >
        <div className="rounded-lg p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>What a bed has sold for, in order</p>
          <div className="mt-5 flex flex-wrap items-end gap-2 sm:gap-3">
            {PRICE_LADDER.map((p, i) => (
              <div key={p} className="flex flex-col items-center">
                <div
                  className="w-14 rounded-t sm:w-20"
                  style={{ height: `${Math.round((p / 800) * 120)}px`, backgroundColor: i === PRICE_LADDER.length - 1 ? RUST : '#D8CFC4' }}
                />
                <span className="mt-2 text-xs font-semibold" style={{ color: CHARCOAL }}>${p}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            The unit price has more than doubled across four buyers and they kept buying. Centrecorp came back at a
            higher price for nearly twice the volume. That is the only demand signal in this document that means
            anything, because somebody paid it.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {BUYERS.map((b) => (
            <div key={b.id} className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', borderTop: `2px solid ${RUST}` }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>{b.route}</p>
              <p className="mt-3 font-display text-lg leading-[1.25]" style={{ color: CHARCOAL }}>{b.buyer}</p>
              <p className="mt-1 text-xs" style={{ color: '#A99C8F' }}>{b.forPlace} &middot; {b.invoices}</p>
              <div className="mt-3 flex gap-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#A99C8F' }}>Beds</p>
                  <p className="font-display text-xl leading-none" style={{ color: CHARCOAL }}>{b.beds}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#A99C8F' }}>Paid per bed</p>
                  <p className="font-display text-xl leading-none" style={{ color: CHARCOAL }}>
                    {b.firstPrice === b.latestPrice ? `$${b.latestPrice}` : `$${b.firstPrice} then $${b.latestPrice}`}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{b.what}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            <strong>{BUYER_TOTALS.beds} beds, {BUYER_TOTALS.buyers} buyers, {BUYER_TOTALS.invoices} invoices.</strong>{' '}
            {money(BUYER_TOTALS.netOfGstAud)} net of GST, {money(BUYER_TOTALS.inclGstAud)} including it. {BUYER_TOTALS.basis}
          </p>
        </div>

        <div className="mt-6 rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', borderLeft: `3px solid ${SAGE}` }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: SAGE }}>What we do not know about demand</p>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            {DEMAND_GAPS.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </div>
      </Chapter>

      <Chapter
        id="ch-washers" number="05" label="The machines"
        title="How the fleet got to twenty three and what it reports"
        lead="Snow bought one of these outright. They are the only part of the work that tells us how it is going without anyone having to visit."
      >
        <div className="grid gap-4 sm:grid-cols-4">
          {WASHER_PLACES.map((w) => (
            <div key={w.place} className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
              <p className="font-display text-3xl leading-none" style={{ color: CHARCOAL }}>{w.inCommunity}</p>
              <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>{w.place}</p>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{w.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>
            What the machines reported, read {WASHER_TELEMETRY.readAt}
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="font-display text-4xl leading-none" style={{ color: CHARCOAL }}>{WASHER_TELEMETRY.totalCycles.toLocaleString('en-AU')}</p>
              <p className="mt-2 text-xs" style={{ color: `${CHARCOAL}b8` }}>Wash cycles recorded</p>
            </div>
            <div>
              <p className="font-display text-4xl leading-none" style={{ color: CHARCOAL }}>{WASHER_TELEMETRY.totalKwh.toLocaleString('en-AU')}</p>
              <p className="mt-2 text-xs" style={{ color: `${CHARCOAL}b8` }}>Kilowatt hours drawn</p>
            </div>
            <div>
              <p className="font-display text-4xl leading-none" style={{ color: CHARCOAL }}>{WASHER_TELEMETRY.reporting}</p>
              <p className="mt-2 text-xs" style={{ color: `${CHARCOAL}b8` }}>Machines that report at all</p>
            </div>
          </div>
          <div className="mt-6 rounded-lg p-5" style={{ backgroundColor: CREAM }}>
            <p className="font-display text-xl leading-snug" style={{ color: CHARCOAL }}>
              {WASHER_TELEMETRY.flagship.cycles} washes in one house.
            </p>
            <p className="mt-2.5 text-[0.9375rem] leading-[1.65]" style={{ color: `${CHARCOAL}cc` }}>
              {WASHER_TELEMETRY.flagship.assetId}, at {WASHER_TELEMETRY.flagship.where}, has drawn{' '}
              {WASHER_TELEMETRY.flagship.kwh.toLocaleString('en-AU')} kilowatt hours between{' '}
              {WASHER_TELEMETRY.flagship.from} and {WASHER_TELEMETRY.flagship.to}. It was still reporting on the day
              this was written.
            </p>
          </div>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>
            {WASHER_TELEMETRY.honest.map((h) => <li key={h}>{h}</li>)}
          </ul>
          <p className="mt-4 text-xs" style={{ color: '#A99C8F' }}>Source: {WASHER_TELEMETRY.source}.</p>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {WASHER_NEXT.map((n) => (
            <div key={n.title} className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', borderTop: '2px solid #B8AEA4' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6A5E54' }}>Where it goes next</p>
              <p className="mt-2 font-display text-base leading-snug" style={{ color: CHARCOAL }}>{n.title}</p>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{n.detail}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter
        id="ch-films" number="06" label="In their own words"
        title="The films"
        lead="Five, including one Snow have not been shown. Each plays where it sits and only one at a time."
      >
        <FilmGallery films={films} />
      </Chapter>

      <div id="ch-archive" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: RUST }}>07 &middot; The archive</p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl" style={{ color: CHARCOAL }}>The photographs</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: `${CHARCOAL}cc` }}>
            Five sets. The first one is the thinnest and it is the one about us and you.
          </p>
        </div>
        <div className="mt-8">
          <PhotoWall
            groups={wallGroups}
            title="Two years, in frames"
            sub="Everything here is already published. Where a set is short, it is short because that is what the archive holds."
          />
        </div>
      </div>

      <Chapter
        id="ch-together" number="08" label="What we have done"
        title="Two years and the money is the smallest part of it"
        lead="Trips, rooms, introductions and the times Snow told this story in its own voice. Filter the money out and see what is left."
      >
        <TogetherTimeline moments={TOGETHER} />
        {smallStart && <Pull v={smallStart} />}
      </Chapter>

      <Chapter
        id="ch-because" number="09" label="What Goods is now"
        title="What the money turned into"
        lead="Counts where we have counts and labels where we do not. The last number on this list is zero and it is the one we print against ourselves."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BECAUSE_OF.map((b) => (
            <div key={b.id} className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
              {/* MeasureLabel has no `future` and inventing one here would put a word on a
                  chip that the rest of the site does not use. A future row gets its own chip. */}
              {b.status === 'future' ? (
                <>
                  <p className="font-display text-4xl leading-none" style={{ color: CHARCOAL }}>{b.value}</p>
                  <span className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ backgroundColor: '#EEE9E3', color: '#6A5E54' }}>
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
        id="ch-board" number="10" label="Who holds it"
        title={ORGANISATION.boardLine}
        lead="Snow said in November 2025 that all future grants would require First Nations leadership and that every partner would be reviewed. This is our answer and it was underway before the question."
      >
        <div className="grid gap-5 sm:grid-cols-3">
          {goodsBoard.map((d) => (
            <div key={d.name} className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
              <p className="font-display text-lg leading-snug" style={{ color: CHARCOAL }}>{d.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: SAGE }}>{d.country}</p>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{d.bio}</p>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b8` }}>{d.goods}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            {ORGANISATION.legalName}, ABN {ORGANISATION.abn}. A registered charity with deductible gift recipient
            status. The board handover is still in progress and no chair has been appointed, which we would rather
            say here than have you find later.
          </p>
        </div>
        {vicki && <Pull v={vicki} />}
        {norman && <Pull v={norman} />}
      </Chapter>

      <Chapter
        id="ch-align" number="11" label="Your strategy, our evidence"
        title="Read your own words back, with the gaps marked"
        lead="Six things Snow has published about what it funds and what Goods can actually put against each one. Two of these are weak and one is a thing we are not asking you to fund."
      >
        <AlignmentTable rows={ALIGNMENT} />
      </Chapter>

      <Chapter
        id="ch-unfinished" number="12" label="What is not finished"
        title="The parts we would rather you heard from us"
        lead="A funder who asks for evidence-based and culturally safe programs should be told what the evidence does not cover."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {NOT_FINISHED.map((n) => (
            <div key={n.title} className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: `1px solid #E8DED4`, borderLeft: `3px solid ${RUST}` }}>
              <p className="font-display text-base leading-snug" style={{ color: CHARCOAL }}>{n.title}</p>
              <p className="mt-2.5 text-[0.9375rem] leading-[1.65]" style={{ color: `${CHARCOAL}b8` }}>{n.detail}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter
        id="ch-next" number="13" label="What we are asking"
        title="A letter this month and 133 beds behind it"
        lead="Two asks. The first one is not money and it has a date on it. The second is the same ask we have put to our other bed funders, so nobody is being asked for something shaped specially for them."
      >
        <div className="rounded-lg p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', borderLeft: `4px solid ${RUST}` }}>
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

        <div className="mt-6 rounded-lg p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
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

        <div className="mt-6 rounded-lg p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>The longer conversation</p>
          <p className="mt-2 text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            Beyond this, we would like to talk with you about whether some of what comes after could be recoverable
            capital: money that returns to Snow over time and goes back to work. That is a conversation we are
            opening. There is no proposal on the table. The amount, the conditions it would carry and the impact it would
            be held to are all things to work out together and it sits alongside the partnership we already have.
          </p>
        </div>

        <div className="mt-6 rounded-lg p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>What we would do together</p>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            <li>Keep the beds travelling with the heart screening, where the Trek has already shown it works.</li>
            <li>Build the training that chapter six says we do not yet have, so capacity is a count and not an intention.</li>
            <li>Carry the first transfer of a production site into community hands and report on it whether or not it goes smoothly.</li>
            <li>Keep the story in the hands of the people telling it. Thirty-eight people have agreed by name and nobody else appears.</li>
          </ul>
        </div>
      </Chapter>

      <footer className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-4xl border-t pt-8" style={{ borderColor: '#E8DED4' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#A99C8F' }}>
            Every figure here traces to the live books, the register or the consent record and every Snow quote
            carries a date. Where a number is modelled or a target, it says so on the number
            itself. Prepared by {ORGANISATION.legalName} for the Snow Foundation.
          </p>
        </div>
      </footer>
    </main>
  );
}
