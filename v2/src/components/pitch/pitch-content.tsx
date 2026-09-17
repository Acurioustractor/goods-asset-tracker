import Image from 'next/image';
import Link from 'next/link';
import { unstable_rethrow } from 'next/navigation';
import { AssemblySequence } from '@/components/pitch/assembly-sequence';
import { BedExplorer, type BedPart } from '@/components/pitch/bed-explorer';
import { Band, Lines, Photo, Section, SectionHead } from '@/components/pitch/blocks';
import { ChapterRail } from '@/components/pitch/chapter-rail';
import { ClaimLabel, CountUp, TodayPlanBars } from '@/components/pitch/count-up';
import { LoopTile } from '@/components/pitch/loop-tile';
import { StaticMap } from '@/components/pitch/static-map';
import { StickyFilm } from '@/components/pitch/sticky-film';
import { TenYearSlider } from '@/components/pitch/ten-year-slider';
import { VideoModal } from '@/components/pitch/video-modal';
import { Voice, leadVoice } from '@/components/pitch/voice';
import { FunderMomentBlock } from '@/components/pitch/funder-moment';
import { FundersSoFar } from '@/components/pitch/funders-so-far';
import { SnowArc } from '@/components/pitch/snow-arc';
import { funderMomentFor } from '@/lib/data/funder-moments';
import { MadeWithCommunity } from '@/components/pitch/made-with-community';
import { contributionsConfirmed, listeningPlaces, listeningVoices } from '@/lib/data/community-contributions';
import { ProductVideo } from '@/components/shop/product-video';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { canonVideo } from '@/lib/data/canon-videos';
import { CASE_STUDIES } from '@/lib/data/case-studies';
import { deckSlides } from '@/lib/data/deck';
import { DESCRIPT_VIDEOS, descriptEmbedUrl } from '@/lib/data/descript-videos';
import { goodsBoard } from '@/lib/data/goods-board';
import { FUNDING_LINES } from '@/lib/data/grants';
import { HOME_FEATURE_COPY } from '@/lib/data/home';
import { videoUrl } from '@/lib/data/media';
import { BED, FLOWS, LOGOS, PANELS, RAISE, SHEET, SHEET_H, SHEET_W, STATIONS, aud } from '@/lib/data/model-placemat';
import { BED_SPLIT, BUYERS, CLOSE, GATES4, GATES_FOOTER, GATES_HEADLINE, GOVERNANCE, MEASURES, MEASURES_FOOTER, MEASURES_HEADLINE, ORIGIN, RAISE_BREAKDOWN, REQUEST_DETAIL, VOICES_BY_CHAPTER } from '@/lib/data/pitch-chapters';
import { BED_PIECES, ROAD_OVERRIDES } from '@/lib/data/pitch-road';
import { BASKET_BED, PLASTIC_KG_PER_BED, STRETCH_BED, WASHING_MACHINE } from '@/lib/data/products';
import { PAID_BEDS, QUESTIONS, QUESTIONS_OPEN_COUNT } from '@/lib/data/story-questions';
import { MAKE_STEPS, PROBLEM_FIGURES, STORY_UPDATED, chapter } from '@/lib/data/story-spine';
import { getStoryteller } from '@/lib/data/storyteller-registry';
import { renderPlacematSvg, type PanelId } from '@/lib/model/placemat-svg';
import { liveCommunityLocations } from '@/lib/field-notes/resolve-live-map';
import { AUSTRALIA_OUTLINE } from '@/lib/data/australia-outline';
import { HARVEST_CONTAINER_DRAWING } from '@/lib/model/harvest-container-drawing';
import { GatesTimeline } from '@/components/pitch/gates-timeline';
import { ModelLoopBuild } from '@/components/pitch/model-loop-build';
import { MoneyLanesView } from '@/components/pitch/money-lanes-view';
import { BED_WAYS, MONEY_LANES, MONEY_NEVER, MONEY_TOTAL } from '@/lib/data/money-lanes';
import { PhotoWall, type WallGroup } from '@/components/pitch/photo-wall';
import { ContactGoodsButton } from '@/components/contact/contact-goods-button';
import { MobileReadMore } from '@/components/pitch/mobile-read-more';
import { PitchMenu } from '@/components/pitch/pitch-menu';
import { PITCH_MENU_TILES } from '@/lib/data/pitch-menu';
import { LOOP_ARCS, LOOP_COUNTS, LOOP_STATIONS, LOOP_STEPS } from '@/lib/data/model-walkthrough';
import { UtopiaJourney, type JourneyScene } from '@/components/pitch/utopia-journey';
import { VoiceFilmCards, type VoiceCard } from '@/components/pitch/voice-film-cards';
import { getTripStory, type TripBlock } from '@/lib/data/trip-stories';
import { applyOverrides, getStoryOverrides } from '@/lib/field-notes/overrides';
import { resolveGalleryBlocks } from '@/lib/field-notes/resolve-gallery';

/**
 * Chapter 11 borrows from the Utopia field note (/field-notes/utopia-may-2026): its scenes carry
 * the six steps from purchase to the next program, Dorrie Jones's portrait goes on her voice
 * card, and its four photo galleries become the photo wall. Blocks are picked by act mark,
 * heading, title or text, and the note's swap-pill overrides (keyed by block index) are re-keyed
 * to the picked run, so the photographs chosen on the field note are the ones shown here.
 */
const UTOPIA_NOTE = 'utopia-may-2026';

const UTOPIA_STEPS = [
  { step: 'Buy', who: 'Centrecorp', what: 'purchases first stock' },
  { step: 'Place', who: 'Oonchiumpa', what: 'works out where they go' },
  { step: 'Build', who: 'Young people', what: 'build the flat-packs with support' },
  { step: 'Deliver', who: 'Oonchiumpa staff', what: 'lead the road into Utopia' },
  { step: 'Return', who: 'Urapuntja staff', what: 'deliver locally and keep feedback open' },
  { step: 'Next', who: 'Urapuntja', what: 'explores recycling, production and ongoing youth work' },
] as const;

type UtopiaPick = { key: string; step?: number; gallery?: string; portrait?: true };
const UTOPIA_PICKS: UtopiaPick[] = [
  { key: 'partner-credit', step: 0 },
  { key: 'Where we were', step: 1 },
  { key: 'The boys, building', step: 2 },
  { key: 'The girls, building', step: 2 },
  { key: 'Act two · the road', step: 3 },
  { key: 'Act three · Arlparra', step: 4 },
  { key: 'A bed, in the time it takes to drink a cup of tea', step: 4 },
  { key: 'Act four · Arawerr (Soapy Bore)', step: 4 },
  { key: 'Plastic collected on Country becomes the legs on these beds.', step: 5 },
  { key: 'Dorrie Jones', portrait: true },
  { key: 'The build, in pictures', gallery: 'Alice Springs' },
  { key: 'Arlparra, in pictures', gallery: 'Arlparra' },
  { key: 'Arawerr, in pictures', gallery: 'Arawerr' },
  { key: 'Ampilatwatja, in pictures', gallery: 'Ampilatwatja' },
];

const UTOPIA_FILMS: Record<string, VoiceCard['film']> = {
  Mykel: { src: '/video/partners/oonchiumpa/mykel-building-the-bed.mp4', poster: '/video/partners/oonchiumpa/mykel-building-the-bed-poster.jpg', title: 'Mykel builds the bed' },
  'Karen Liddle': { src: '/video/partners/oonchiumpa/karen-liddle-on-beds.mp4', poster: '/video/partners/oonchiumpa/karen-liddle-on-beds-poster.jpg', title: 'Karen Liddle on the beds' },
};

function blockKey(b: TripBlock): string {
  const pick = (field: string) => (field in b ? (b as unknown as Record<string, unknown>)[field] : undefined);
  const key = pick('actmark') ?? pick('heading') ?? pick('title') ?? pick('text');
  return typeof key === 'string' ? key : b.kind;
}

async function utopiaChapter(): Promise<{ scenes: JourneyScene[]; dorrie: string | null; groups: WallGroup[] } | null> {
  const story = getTripStory(UTOPIA_NOTE);
  if (!story) return null;
  const found = UTOPIA_PICKS.map((p) => ({ pick: p, at: story.blocks.findIndex((b) => blockKey(b) === p.key) })).filter((f) => f.at !== -1);
  const overrides = Object.fromEntries(
    Object.entries(getStoryOverrides(UTOPIA_NOTE)).flatMap(([k, v]) => {
      const [head, ...rest] = k.split('.');
      const n = found.findIndex((f) => f.at === Number(head));
      return n === -1 ? [] : [[[String(n), ...rest].join('.'), v]];
    }),
  );
  let run = applyOverrides({ ...story, blocks: found.map((f) => story.blocks[f.at]) }, overrides);
  try {
    run = await resolveGalleryBlocks(run, { internal: false });
  } catch (err) {
    // Let Next's own render signals through; only a real fetch failure falls back.
    unstable_rethrow(err);
    console.error('[pitch] Utopia chapter resolve failed:', err);
  }
  run = applyOverrides(run, overrides);

  const scenes: JourneyScene[] = [];
  const groups: WallGroup[] = [];
  const seen = new Set<string>();
  let dorrie: string | null = null;
  found.forEach(({ pick, at }, n) => {
    const block = run.blocks[n];
    if (pick.step !== undefined) scenes.push({ step: pick.step, story: { ...run, blocks: [block] } });
    if (pick.portrait && 'media' in block && block.media) {
      const source = story.blocks[at] as { media?: { image?: string } };
      if (block.media.image && block.media.image !== source.media?.image) dorrie = block.media.image;
    }
    if (pick.gallery && (block.kind === 'el-gallery' || block.kind === 'manual-gallery')) {
      const hidden = new Set(String((block as unknown as { _hiddenIds?: string })._hiddenIds ?? '').split(',').map((s) => s.trim()).filter(Boolean));
      const photos = (block.items ?? [])
        // Same rule as the field note: hand-picked photos show as picked; tag galleries arrive public-only from the resolver.
        .filter((item) => !hidden.has(item.id) && !seen.has(item.src))
        .map((item) => {
          seen.add(item.src);
          return { src: item.src, alt: item.alt ?? `Photograph from ${pick.gallery}, May 2026`, caption: item.caption };
        });
      if (photos.length > 0) groups.push({ label: pick.gallery, photos });
    }
  });
  return { scenes, dorrie, groups };
}

/**
 * THE PITCH, shared between two doors, in the order of the deck: problem, cost, where it
 * started, who holds it, the road, the products, the map, the facility, two proofs, who buys,
 * the whole model, what we measure, ten years, where each dollar goes, the sequence, the
 * request, the close. `variant: 'qbe'` adds the capital table and the request. `variant:
 * 'overview'` is the same story without the QBE-shaped ask. Never invert this: the overview
 * drops detail, it never adds a claim the QBE version does not make.
 *
 * The drawings are the deck's drawings: the placemat and the money-flow SVGs are rendered
 * here from the same modules the render scripts and the guards read, then made readable
 * by hand in the pitch components. Figures come from the data modules; nothing is typed here.
 */

const BED_PARTS: BedPart[] = [
  { name: STRETCH_BED.materials.sleepingSurface.name, detail: `${STRETCH_BED.materials.sleepingSurface.detail}. The canvas is structural: its tension holds the bed up.`, position: 'left-[60%] top-[34%]' },
  { name: STRETCH_BED.materials.frame.name, detail: `${STRETCH_BED.materials.frame.detail}. Two poles thread through the canvas sleeves and the top holes of the X-legs.`, position: 'left-[36%] top-[50%]' },
  { name: STRETCH_BED.materials.legs.name, detail: `${STRETCH_BED.materials.legs.detail}. About ${PLASTIC_KG_PER_BED} kg of recycled HDPE in every bed.`, position: 'left-[80%] top-[54%]' },
];

const FACILITY_PARTS: BedPart[] = [
  { name: 'Sort and shred', detail: 'Clean HDPE and PP plastic is sorted, then granulated into consistent flakes. The shredder and the chip bins sit in the first container.', position: 'left-[22%] top-[62%]' },
  { name: 'CNC cut and finish', detail: 'The cooled sheet is cut into flat-pack bed parts on the router and every edge is smoothed. Offcuts go back to the shredder.', position: 'left-[46%] top-[66%]' },
  { name: 'Heat, press and cool', detail: 'Flakes are spread evenly, melted into a sheet, pressed to thickness, then cooled under pressure. The red press is the heart of the line.', position: 'left-[66%] top-[64%]' },
  { name: 'Assemble, test and pack', detail: 'Parts meet steel poles and canvas, the bed is checked, then packed flat for the journey to community. Finished sheets and kits are stored in the last container.', position: 'left-[88%] top-[66%]' },
];

const roadStops = deckSlides.filter((slide) => slide.kind === 'stop');

const CHAPTERS_BASE = [
  { id: 'top', number: '01', label: 'Goods on Country' },
  { id: 'problem', number: '02', label: 'The broken system' },
  { id: 'cost', number: '03', label: 'The cost' },
  { id: 'origin', number: '04', label: 'Where it started' },
  { id: 'people', number: '05', label: 'Who holds it' },
  { id: 'road', number: '06', label: 'The road here' },
  { id: 'products', number: '07', label: 'Products' },
  { id: 'map', number: '08', label: 'Where the work has been' },
  { id: 'facility', number: '09', label: 'The facility' },
  { id: 'maningrida', number: '10', label: 'Maningrida' },
  { id: 'utopia', number: '11', label: 'Utopia' },
  { id: 'buyers', number: '12', label: 'Who buys' },
  { id: 'model', number: '13', label: 'The whole model' },
  { id: 'measure', number: '14', label: 'What we count' },
  { id: 'ten-years', number: '14b', label: 'Ten years' },
  { id: 'money', number: '15', label: 'Where each dollar goes' },
  { id: 'capital', number: '16', label: 'Capital status', qbe: true },
  { id: 'sequence', number: '17', label: 'The sequence' },
  { id: 'request', number: '18', label: 'The request', qbe: true },
  { id: 'close', number: '19', label: 'The close' },
  { id: 'questions', number: '20', label: 'Questions' },
] as const;

export type PitchVariant = 'qbe' | 'overview';

/** A cleared voice by name: the primary quote, else an approved one. External tier only. */
function voiceFor(name: string) {
  const person = getStoryteller(name);
  if (!person || person.tier !== 'external') return null;
  const quote = person.quotes.find((q) => q.status === 'primary') ?? person.quotes.find((q) => q.status === 'approved');
  return quote ? { person, quote } : null;
}


/** Two photographs, the floor and the bed. Used where the pitch first says beds get people off the floor, and again before the close. */
function OffTheFloor() {
  // The first photograph is portrait (3:4) and is shown whole; the second is landscape and
  // fills the rest of the row at the same height.
  return (
    <div className="grid gap-4 sm:grid-cols-[3fr_5fr] sm:items-start">
      <figure className="m-0">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-goods-sand">
          <Image src="/images/community/kalgoorlie/on-the-floor-dirty-mat.jpg" alt="A woman sitting on a worn mat on the ground" fill sizes="(min-width: 640px) 35vw, 100vw" className="object-cover" />
        </div>
      </figure>
      <figure className="m-0">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[18px] bg-goods-sand">
          <Image src="/images/community/kalgoorlie/up-off-the-ground.jpg" alt="Sitting on a Stretch Bed on a verandah" fill sizes="(min-width: 640px) 55vw, 100vw" className="object-cover" />
        </div>
      </figure>
    </div>
  );
}

function DescriptEmbed({ viewId, title }: { viewId: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#e6dfd1] bg-goods-ink" style={{ aspectRatio: '16 / 9' }}>
      <iframe src={descriptEmbedUrl(viewId)} title={title} loading="lazy" allow="fullscreen" className="h-full w-full" />
    </div>
  );
}

export async function PitchContent({ variant }: { variant: PitchVariant }) {
  const isQbe = variant === 'qbe';
  const problem = chapter('problem');
  const road = chapter('road');
  const make = chapter('make');
  const trade = chapter('trade');
  const questions = chapter('questions');
  const maningrida = CASE_STUDIES.find((c) => c.slug === 'maningrida');
  const film = canonVideo('video-maningrida-case-study');
  const hero = canonVideo('video-hero');
  const facilityWalk = DESCRIPT_VIDEOS.find((v) => v.viewId === 'j6PXvhBP62i' && v.cleared) ?? DESCRIPT_VIDEOS.find((v) => v.viewId === 'haRZJbfJadJ' && v.cleared);
  const timelapse = DESCRIPT_VIDEOS.find((v) => v.viewId === 'Xtrc5ZYsym6' && v.cleared);
  // Assets under public/ are served, never read from disk here: next.config.ts keeps public/ out of the
  // server bundle, so a read that works locally finds nothing on Vercel. The outline and the drawing are
  // code modules; the drone cut is committed at public/video/kalgoorlie/ (pitch-assets.guards.test.ts).
  const [locations, utopiaRun] = await Promise.all([liveCommunityLocations(), utopiaChapter()]);
  const drawing = HARVEST_CONTAINER_DRAWING;
  const outline = AUSTRALIA_OUTLINE;
  const droneFilm = { src: '/video/kalgoorlie/ninga-mia-drone.mp4', poster: '/video/kalgoorlie/ninga-mia-drone-poster.jpg' };

  const photoHrefs = Object.fromEntries(PANELS.map((p) => [p.id, p.photo.src])) as Partial<Record<PanelId, string>>;
  const placematSvg = renderPlacematSvg({ inlineDrawing: drawing, photoHrefs, logoHrefs: { goods: LOGOS.goods.src, qbe: LOGOS.qbe.src }, standalone: false });
  const placematItems = Object.values(STATIONS).map((s) => ({ id: s.id, title: s.title, line: s.line }));
  const placematArrows = FLOWS.map((f) => ({ from: f.from, to: f.to, label: f.label }));

  const kalgoorlieVoice = voiceFor('Gloria Turner');
  const productVoice = voiceFor(VOICES_BY_CHAPTER.products[0]);
  const maningridaVoice = voiceFor(VOICES_BY_CHAPTER.maningrida[0]);
  const utopiaCards: VoiceCard[] = VOICES_BY_CHAPTER.utopia.flatMap((name) => {
    const v = voiceFor(name);
    if (!v) return [];
    const portrait = (name === 'Dorrie Jones' ? utopiaRun?.dorrie : null) ?? v.person.portrait ?? undefined;
    return [{ key: v.person.slug, quote: v.quote.text, name: v.person.name, role: v.person.role, community: v.person.community, film: UTOPIA_FILMS[name], portrait }];
  });
  const utopiaPhotoCount = utopiaRun?.groups.reduce((n, g) => n + g.photos.length, 0) ?? 0;

  return (
    <main className="bg-goods-cream text-goods-ink">
      <ChapterRail chapters={CHAPTERS_BASE.filter((c) => !("qbe" in c && c.qbe) || isQbe).map(({ id, number, label }) => ({ id, number, label }))} />
      <PitchMenu
        extra={<ContactGoodsButton subject="Partnership Inquiry" label="Contact" />}
        title={isQbe ? 'The pitch, for QBE' : 'The pitch'}
        chapters={CHAPTERS_BASE.filter((c) => !("qbe" in c && c.qbe) || isQbe).map(({ id, number, label }) => ({ id, number, label, ...PITCH_MENU_TILES[id] }))}
      />

      {/* S01 · The cover */}
      <header id="top" className="relative scroll-mt-14 overflow-hidden bg-goods-ink text-goods-cream">
        {hero && (
          <video className="absolute inset-0 h-full w-full object-cover opacity-80 motion-reduce:hidden" autoPlay muted loop playsInline poster={hero.poster ?? '/video/hero-poster.jpg'} aria-hidden="true">
            {hero.mobileFile && <source media="(max-width: 767px)" src={videoUrl(hero.mobileFile)} type="video/mp4" />}
            <source src={videoUrl(hero.desktopFile)} type="video/mp4" />
          </video>
        )}
        <Image src={hero?.poster ?? '/video/hero-poster.jpg'} alt="" fill sizes="100vw" priority className={`object-cover opacity-80 ${hero ? 'hidden motion-reduce:block' : ''}`} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-goods-ink via-goods-ink/50 to-goods-ink/10" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-32 md:px-10 lg:px-14">
          <h1 className="max-w-4xl font-display text-[2.6rem] font-semibold leading-[1.0] tracking-[-0.01em] text-balance sm:text-5xl md:text-7xl">Growing community-led manufacturing and economic ownership.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-goods-cream/90 md:text-2xl">Using beds as the first proven product. Supporting community-owned enterprises.</p>
        </div>
      </header>

      <Band>
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {[
            { v: CANONICAL_ASSETS.bedsDeployed, l: 'beds in community' },
            { v: CANONICAL_ASSETS.communitiesServed, l: 'communities' },
            { v: CANONICAL_ASSETS.washersInCommunity, l: 'washing machines' },
            { v: PAID_BEDS, l: "beds bought and paid for" },
            { v: 0, l: 'community enterprises trading. That is what this year changes' },
          ].map((s) => (
            <div key={s.l}>
              <dt className="font-display text-4xl font-semibold leading-none">
                <CountUp value={s.v} />
              </dt>
              <dd className="mt-2 text-sm text-[#5d574c]">{s.l}</dd>
            </div>
          ))}
        </dl>
      </Band>

      {/* S02 · The broken system */}
      {droneFilm ? (
        <section id="problem" className="scroll-mt-0 border-t border-transparent">
          <StickyFilm
            src={droneFilm.src}
            poster={droneFilm.poster}
            alt="Ninga Mia, Kalgoorlie, from the air"
            credit="Ninga Mia, Kalgoorlie. Drone footage, 2024."
            steps={[
              {
                id: 'head',
                body: (
                  <>
                    <p className="font-display text-2xl text-goods-terracotta-light">2</p>
                    <h2 className="mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.01em] text-balance md:text-6xl">Remote communities import the goods and export the value.</h2>
                    <p className="mt-6 max-w-xl text-xl leading-snug text-goods-cream/90 md:text-2xl">Products travel farther, cost more, fail early and are difficult to repair locally.</p>
                  </>
                ),
                image: { src: '/images/community/kalgoorlie/town-dump-1.jpg', alt: 'Fridges, mattresses and a wrecked caravan at the Kalgoorlie town dump', place: 'Kalgoorlie town dump' },
              },
              {
                id: 'wash',
                body: <p key="wash" className="font-display text-3xl leading-snug md:text-5xl">A mattress cannot be washed.</p>,
                image: { src: '/images/community/kalgoorlie/mattress-decayed.jpg', alt: 'A decayed mattress on the ground at Ninga Mia', place: 'Ninga Mia, Kalgoorlie' },
              },
              {
                id: 'freight',
                body: <p key="freight" className="font-display text-3xl leading-snug md:text-5xl">Bulky replacements carry long-distance freight.</p>,
                image: { src: '/images/community/kalgoorlie/delivery-truck.jpg', alt: 'A delivery truck on the road into Kalgoorlie', place: 'Kalgoorlie, WA' },
              },
              {
                id: 'waste',
                body: <p key="waste" className="font-display text-3xl leading-snug md:text-5xl">When products fail, the waste stays.</p>,
                image: { src: '/images/community/kalgoorlie/town-dump-2.jpg', alt: 'A pile of broken washing machines, mattresses and whitegoods at the Kalgoorlie town dump', place: 'Kalgoorlie town dump' },
              },
              {
                id: 'began',
                body: (
                  <>
                    <p className="text-sm font-semibold uppercase tracking-wide text-goods-terracotta-light">Ninga Mia, Kalgoorlie</p>
                    <p className="mt-3 font-display text-3xl leading-snug md:text-5xl">This is where the Goods on Country story began.</p>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-goods-cream/90 md:text-xl">A mattress that cannot be washed ends up here, and so does everything that came a long way and broke. We came to listen, and left with the first question the beds had to answer.</p>
                  </>
                ),
                image: problem.photo ? { src: problem.photo.src, alt: problem.photo.alt, place: problem.photo.place } : undefined,
              },
              ...(kalgoorlieVoice
                ? [
                    {
                      id: 'gloria',
                      body: (
                        <>
                          <p className="font-display text-3xl leading-snug md:text-5xl">Where the road here started.</p>
                          <p className="mt-5 max-w-xl text-lg leading-relaxed text-goods-cream/90 md:text-xl">Gloria was the first person to sleep on a Goods bed. What she told us shaped what we make today, as the hundreds of stories since have shaped it, right across Australia.</p>
                        </>
                      ),
                      voice: { portrait: kalgoorlieVoice.person.portrait ?? undefined, name: kalgoorlieVoice.person.name, role: kalgoorlieVoice.person.role, community: kalgoorlieVoice.person.community, quote: kalgoorlieVoice.quote.text },
                      image: { src: '/images/community/kalgoorlie/camp-visit.jpg', alt: 'A camp visit at Ninga Mia', place: 'Ninga Mia, Kalgoorlie' },
                    },
                  ]
                : []),
            ]}
          />
        </section>
      ) : (
        <Section id="problem" number={2} title="Remote communities import the goods and export the value.">
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <Lines lines={['Products travel farther, cost more, fail early and are difficult to repair locally.']} />
              <ul className="mt-8 space-y-3 text-lg text-[#4a4741]" aria-label="Three things that follow">
                {['A mattress cannot be washed.', 'Bulky replacements carry long-distance freight.', 'When products fail, the waste stays.'].map((l) => (
                  <li key={l} className="flex gap-3">
                    <span className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full bg-goods-terracotta" aria-hidden="true" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
            {problem.photo && <Photo photo={problem.photo} priority />}
          </div>
        </Section>
      )}

      {/* S03 · The systemic cost */}
      <Section id="cost" number={3} title="One broken system. Four consequences.">
        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" aria-label="Four figures">
          {PROBLEM_FIGURES.map((f) => (
            <li key={f.id} className="border-t border-[#e6dfd1] pt-5">
              <p className="text-sm font-semibold text-goods-terracotta">{f.area}</p>
              <p className="mt-2 font-display text-5xl font-semibold leading-none">{f.value}</p>
              <p className="mt-3 text-[15px] leading-snug text-[#4a4741]">{f.what}</p>
              {f.note && <p className="mt-2 text-[13px] leading-snug text-[#5d574c]">{f.note}</p>}
              <p className="mt-3 text-[13px] leading-snug text-[#5d574c]">
                <a href={f.sourceUrl} className="underline decoration-[#c18a7b] underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta" target="_blank" rel="noreferrer">
                  {f.source}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* S04 · Where it started */}
      <section id="origin" className="scroll-mt-28 border-t border-transparent bg-goods-ink text-goods-cream">
        <div className="relative overflow-hidden">
          <LoopTile src={ORIGIN.headerLoop.src} poster={ORIGIN.headerLoop.poster} still={ORIGIN.headerLoop.poster} alt={ORIGIN.headerLoop.alt} className="absolute inset-0 opacity-50" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-goods-ink/40 via-goods-ink/60 to-goods-ink" />
          <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-24 md:px-10 md:pt-32 lg:px-14">
            <div className="flex items-center gap-4">
              <Image src={ORIGIN.logo.act} alt="A Curious Tractor" width={56} height={56} className="h-12 w-12 object-contain" />
              <p className="text-sm font-semibold uppercase tracking-wide text-goods-terracotta-light">{ORIGIN.kicker}</p>
            </div>
            <SectionHead number={4} title={ORIGIN.headline} dark />
            <p className="mt-6 max-w-3xl font-display text-2xl leading-snug text-goods-cream/95 md:text-3xl">{ORIGIN.studio}</p>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-goods-cream/85">{ORIGIN.body}</p>

          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 lg:px-14">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-goods-terracotta-light">The loop every project runs on</h3>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-goods-cream/85">{ORIGIN.loopIntro}</p>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Listen, curiosity, action, art">
            {ORIGIN.loop.map((step, i) => (
              <li key={step.title} className="relative border-t border-goods-cream/20 pt-5">
                <p className="font-display text-xl text-goods-terracotta-light">0{i + 1}</p>
                <p className="mt-1 font-display text-2xl font-semibold text-goods-cream">{step.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-goods-cream/80">{step.line}</p>
                {i < ORIGIN.loop.length - 1 && <span className="absolute -right-3 top-6 hidden text-goods-cream/40 lg:block" aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-goods-cream/75">{ORIGIN.promise}</p>

          <h3 className="mt-16 text-sm font-semibold uppercase tracking-wide text-goods-terracotta-light">The projects, and what each gave Goods on Country</h3>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ORIGIN.projects.map((p, i) => (
              <li key={p.slug} className="group overflow-hidden rounded-[18px] border border-goods-cream/15 bg-goods-cream/5">
                <LoopTile src={p.loop?.src} poster={p.loop?.poster} still={p.image.src} alt={p.image.alt} className="aspect-[4/3]" />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-goods-terracotta-light">0{i + 1}</p>
                  <p className="mt-1 font-display text-2xl font-semibold leading-tight text-goods-cream">{p.title}</p>
                  <p className="mt-1 font-display text-lg italic text-goods-cream/85">{p.tagline}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-goods-cream/80">{p.description}</p>
                  <p className="mt-4 border-t border-goods-cream/15 pt-3 text-sm text-goods-cream">
                    <span className="font-semibold text-goods-terracotta-light">To Goods: </span>
                    {p.gives}
                  </p>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm underline decoration-goods-terracotta-light underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-cream">
                      Visit {p.title}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>


          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 rounded-[22px] border border-goods-cream/20 bg-goods-cream/5 px-8 py-8">
            <div className="flex items-center gap-3">
              <Image src={ORIGIN.logo.act} alt="" width={64} height={64} className="h-14 w-14 object-contain" />
              <span className="font-display text-2xl font-semibold text-goods-cream">A Curious Tractor</span>
            </div>
            <span className="font-display text-3xl text-goods-terracotta-light" aria-hidden="true">→</span>
            <div className="flex items-center gap-3">
              <Image src={ORIGIN.logo.goods} alt="" width={120} height={57} className="h-12 w-auto object-contain" />
            </div>
            <p className="w-full text-center text-sm text-goods-cream/80 sm:w-auto">{ORIGIN.graduated}</p>
          </div>

        </div>

        {/* Full bleed, so it sits OUTSIDE the max-w wrapper above. The handover is stated in
            that band; this is who paid across the whole of it. */}
        <SnowArc />
      </section>

      {/* S05 · Governance and people */}
      <Section id="people" number={5} title={GOVERNANCE.headline}>
        <p className="mt-6 max-w-3xl font-display text-2xl leading-snug text-goods-ink md:text-3xl">{GOVERNANCE.line}</p>
        <h3 className="mt-12 text-sm font-semibold uppercase tracking-wide text-goods-terracotta">Board</h3>
        <ul className="mt-4 grid gap-8 sm:grid-cols-3">
          {goodsBoard.map((d) => (
            <li key={d.name}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand sm:aspect-square">                <Image src={d.photo} alt={`${d.name}, ${d.role}`} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-4 font-display text-2xl font-semibold leading-tight">{d.name}</p>
              <p className="text-sm text-[#5d574c]">{d.role} · {d.country}</p>
              <p className="mt-3 text-[15px] leading-snug text-[#4a4741]">{d.goods}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-[#4a4741]">{GOVERNANCE.boardNote}</p>
        <h3 className="mt-12 text-sm font-semibold uppercase tracking-wide text-goods-terracotta">Staff</h3>
        <div className="mt-4 grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start">
          <figure className="m-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
              <Image src="/images/people/nic-and-ben-warumungu.jpg" alt="Nic Marchesi and Ben Knight on Warumungu Country" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-2 text-sm text-[#5d574c]">Nic Marchesi and Ben Knight, Warumungu Country, Tennant Creek.</figcaption>
          </figure>
          <ul className="grid gap-6 sm:grid-cols-2">
            {GOVERNANCE.staff.map((s) => (
              <li key={s.name} className="border-t border-[#e6dfd1] pt-4">
                <p className="font-display text-xl font-semibold">{s.name}</p>
                <p className="text-sm text-[#5d574c]">{s.role}</p>
                <p className="mt-2 text-[15px] text-[#4a4741]">{s.line}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-[#4a4741]">{GOVERNANCE.communities}</p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#4a4741]">{GOVERNANCE.members}</p>
      </Section>

      {/* S06 · The road here */}
      <Section id="road" number={6} title="Six places taught us the model.">
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4741] md:text-xl">Each stop changed the product, the price, or who does the work.</p>
        <ol className="mt-14 space-y-14 md:space-y-20">
          {roadStops.map((stop, i) => {
            const v = leadVoice(stop);
            // The funder who paid for this stop, rendered inside it. See funder-moments.ts
            // for why this is not a logo row at the end of the page.
            const funder = funderMomentFor(stop.id);
            const o = ROAD_OVERRIDES[stop.id] ?? {};
            const photo = o.photo ?? { src: stop.photo, alt: stop.photoAlt };
            const gallery = o.gallery ?? stop.gallery ?? [];
            const stopFilm = o.film ?? (stop.inlineVideo?.mode === 'feature' ? { src: stop.inlineVideo.src, poster: stop.inlineVideo.poster, title: stop.inlineVideo.label ?? stop.headline } : undefined);
            return (
              <li key={stop.id} id={stop.id} className="grid gap-8 md:grid-cols-12 md:items-start">
                <div className="md:col-span-5">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" />
                  </div>
                  {gallery.length > 0 && (
                    <div className="mt-3 hidden grid-cols-3 gap-3 md:grid">
                      {gallery.map((g) => (
                        <div key={g.src} className="relative aspect-square overflow-hidden rounded-[12px] bg-goods-sand">
                          <Image src={g.src} alt={g.alt} fill sizes="14vw" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="-mt-3 md:col-span-7 md:mt-0">
                  <p className="font-display text-2xl text-goods-terracotta">0{i + 1}</p>
                  <h3 className="mt-1 font-display text-3xl font-semibold leading-tight text-balance md:text-4xl">{stop.headline}</h3>
                  <p className="mt-2 text-sm text-[#5d574c]">{stop.place}</p>
                  {/* Phones: photo, headline and place; the story, film and voice wait behind Read more. */}
                  <MobileReadMore>
                    <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#4a4741]">{stop.body}</p>
                    {(stopFilm || o.link) && (
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        {stopFilm && <VideoModal src={stopFilm.src} poster={stopFilm.poster} title={stopFilm.title} label="Watch" />}
                        {o.link && (
                          <Link href={o.link.href} className="inline-flex min-h-11 items-center rounded-full border border-goods-ink/30 px-4 text-sm font-semibold hover:border-goods-terracotta hover:text-goods-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta">
                            {o.link.label}
                          </Link>
                        )}
                      </div>
                    )}
                    {v && (
                      <div className="mt-8">
                        <Voice person={v.person} quote={v.quote} />
                      </div>
                    )}
                    {funder && <FunderMomentBlock moment={funder} />}
                  </MobileReadMore>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="-mx-6 mt-20 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&>*]:w-[82%] [&>*]:flex-none [&>*]:snap-center md:[&>*]:w-auto">
          <ProductVideo videoUrl="/video/partners/centrecorp/utopia-delivery-road.mp4" thumbnailUrl="/video/partners/centrecorp/utopia-delivery-road-poster.jpg" title="The delivery road to the Utopia homelands" />
          <ProductVideo videoUrl="/video/partners/centrecorp/utopia-bed-building.mp4" thumbnailUrl="/video/partners/centrecorp/utopia-bed-building-poster.jpg" title="Building beds at Utopia" />
          <ProductVideo videoUrl="/video/partners/centrecorp/utopia-community-setup.mp4" thumbnailUrl="/video/partners/centrecorp/utopia-community-setup-poster.jpg" title="Setting up in community" />
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {road.lines.slice(1).map((line) => (
            <p key={line} className="text-lg leading-relaxed text-[#4a4741]">{line}</p>
          ))}
        </div>
      </Section>

      {/* S07 · Products */}
      <Section id="products" number={7} title="What we make now and what comes next." dark>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-goods-cream/85 md:text-xl">{STRETCH_BED.tagline} Press a part.</p>
        <div className="mt-10">
          <BedExplorer dark src="/images/product/stretch-bed-hero.jpg" alt="A finished Stretch Bed on Country in golden light" parts={BED_PARTS} caption="Three parts. No tools. About five minutes." />
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { v: STRETCH_BED.specs.assemblyTime, l: 'to assemble, no tools' },
            { v: STRETCH_BED.specs.loadCapacity, l: 'load' },
            { v: STRETCH_BED.specs.weight, l: 'flat-packed' },
            { v: `${PLASTIC_KG_PER_BED} kg`, l: 'recycled plastic in every bed, modelled' },
          ].map((s) => (
            <div key={s.l}>
              <dt className="font-display text-3xl font-semibold text-goods-cream">{s.v}</dt>
              <dd className="mt-1 text-sm text-goods-cream/75">{s.l}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {BED_PIECES.map((p) => (
            <li key={p.src} className="overflow-hidden rounded-[18px] border border-goods-cream/15 bg-goods-cream/5">
              <div className="relative aspect-[4/3] bg-goods-sand">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <div className="p-4">
                <p className="font-display text-lg font-semibold text-goods-cream">{p.title}</p>
                <p className="mt-1 text-sm leading-snug text-goods-cream/75">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-14 grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <h3 className="font-display text-2xl font-semibold text-goods-cream">Assembled in community</h3>
            <p className="mt-2 max-w-2xl text-goods-cream/80">Two poles through the canvas sleeves and the top holes of the crossed legs. Tensioning pulls the poles deep into the legs and the canvas becomes the structure.</p>
            <div className="mt-6">
              <AssemblySequence />
            </div>
          </div>
          <div>
            {timelapse && <DescriptEmbed viewId={timelapse.viewId} title={timelapse.title} />}
          </div>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
              <Image src="/images/product/washing-machine-name.jpg" alt="Pakkimjalki Kari, the washing machine, with its name" fill sizes="33vw" className="object-cover" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-goods-terracotta-light">02 · Prototype</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-goods-cream">{WASHING_MACHINE.name}</h3>
            <p className="mt-2 text-goods-cream/80">A commercial-grade Speed Queen base with one-button operation, named in Warumungu by Elder Dianne Stokes. We are opening the design and build knowledge now so local makers can help bring the price down.</p>
          </div>
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
              <Image src="/images/product/basket-bed-hero.jpg" alt="The Basket Bed, the first prototype" fill sizes="33vw" className="object-cover" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-goods-terracotta-light">The first prototype</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-goods-cream">{BASKET_BED.name}</h3>
            <p className="mt-2 text-goods-cream/80">{BASKET_BED.tagline} Sales discontinued; the plans are free to download.</p>
          </div>
          <div className="rounded-[18px] border border-dashed border-goods-cream/30 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-goods-terracotta-light">03 · Possible</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-goods-cream">Refrigeration</h3>
            <p className="mt-2 text-goods-cream/80">Refrigeration for houses where the power is unreliable. An idea for the future; nothing is built.</p>
            <p className="mt-6 text-sm text-goods-cream/75">Whatever a community asks for next, the community chooses. A Curious Tractor does the research and development.</p>
          </div>
        </div>
        {productVoice && (
          <div className="mt-14 max-w-3xl">
            <Voice person={productVoice.person} quote={productVoice.quote} dark large />
          </div>
        )}
      </Section>

      {/* S08 · Where the work has travelled */}
      <Section id="map" number={8} title="The work has travelled a long way.">
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4741] md:text-xl">The next step is to move more of the making closer to Country.</p>
        <dl className="mt-8 grid grid-cols-2 gap-6 md:max-w-3xl md:grid-cols-4">
          {[
            { v: CANONICAL_ASSETS.bedsDeployed, l: `beds deployed, ${CANONICAL_ASSETS.stretchBedsDeployed} Stretch and ${CANONICAL_ASSETS.basketBedsDeployed} Basket` },
            { v: CANONICAL_ASSETS.washersInCommunity, l: 'washing machines in community' },
            { v: CANONICAL_ASSETS.communitiesServed, l: 'communities served' },
            { v: CANONICAL_ASSETS.plasticKg, l: `kg recycled HDPE, ${CANONICAL_ASSETS.stretchBedsDeployed} Stretch Beds at ${PLASTIC_KG_PER_BED} kg design mass` },
          ].map((s) => (
            <div key={s.l}>
              <dt className="font-display text-3xl font-semibold leading-none">
                <CountUp value={s.v} />
              </dt>
              <dd className="mt-1 text-sm text-[#5d574c]">{s.l}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10">
          <StaticMap outline={outline} locations={locations} />
        </div>
      </Section>

      {/* S09 · One facility, four clear steps */}
      <Section id="facility" number={9} title="Plastic becomes useful parts here.">
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4741] md:text-xl">Waste plastic becomes a durable bed through one compact, teachable production line. The Goods on Country facility in Queensland. Walk the line.</p>
        <div className="mt-10">
          <BedExplorer src="/images/process/factory-panorama.jpg" alt="The Goods on Country facility in Queensland: four containers, doors open, shredder, CNC router, heat press and store" parts={FACILITY_PARTS} caption="One line in four containers. Press a station." />
        </div>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MAKE_STEPS.map((step, i) => (
            <li key={step.id}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
                <Image src={step.photo.src} alt={step.photo.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <p className="mt-3 font-display text-lg font-semibold"><span className="mr-2 text-goods-terracotta">0{i + 1}</span>{step.title}</p>
            </li>
          ))}
        </ol>
        {facilityWalk && (
          <div className="mt-12 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <DescriptEmbed viewId={facilityWalk.viewId} title={facilityWalk.title} />
            <div>
              <h3 className="font-display text-2xl font-semibold">Walk through the facility with Nic</h3>
              <p className="mt-2 text-[#4a4741]">{facilityWalk.beat}</p>
              {!facilityWalk.canonFresh && <p className="mt-3 text-sm text-[#5d574c]">Filmed earlier in the year; the figures said aloud are older than the ones on this page.</p>}
            </div>
          </div>
        )}
        <p className="mt-8 max-w-3xl text-[#4a4741]">{make.lines[0]}</p>
      </Section>

      {/* S10 and S11 · Two proofs */}
      <div id="proof" className="scroll-mt-28" />
      {maningrida && (
        <Section id="maningrida" number={10} title="40 Stretch Beds. Made at The Factory. Assembled at Gamardi." dark>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-goods-cream/85 md:text-xl">{maningrida.standfirst}</p>
          {film && (
            <div className="mt-10">
              <VideoModal cover src={videoUrl(film.desktopFile)} poster={film.poster ?? '/video/maningrida-case-study-poster.jpg'} captions={film.captions} title={HOME_FEATURE_COPY.title} />
              <p className="mt-3 max-w-3xl text-sm text-goods-cream/75">{HOME_FEATURE_COPY.caption}</p>
            </div>
          )}
          <p className="mt-10 max-w-3xl text-lg leading-relaxed text-goods-cream/85">
            The Homeland School Company bought and paid for 40 Stretch Beds in May 2026. We pressed the tab sheets and cut the legs at our facility in Queensland, then sent the parts north flat packed. At Gamardi, young people assembled every bed with the school and handed them out across the homelands. Two washing machines went with them. Mala&apos;la Health Service had bought 13 beds the year before, so two organisations in one place now hold Goods stock.
          </p>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {maningrida.steps.map((step, i) => (
              <li key={step.title}>
                {step.photo && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
                    <Image src={step.photo.src} alt={step.photo.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                  </div>
                )}
                <p className="mt-4 font-display text-xl font-semibold leading-tight text-goods-cream"><span className="mr-2 text-goods-terracotta-light">0{i + 1}</span>{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-goods-cream/75">{step.body}</p>
              </li>
            ))}
          </ol>
          {maningridaVoice && (
            <div className="mt-12 max-w-3xl">
              <Voice person={maningridaVoice.person} quote={maningridaVoice.quote} dark large />
            </div>
          )}
          <p className="mt-10 text-sm text-goods-cream/75">
            With {maningrida.partner.nameCleared ? maningrida.partner.name : maningrida.partner.role}.{' '}
            <Link href={`/case-studies/${maningrida.slug}`} className="underline decoration-goods-terracotta-light underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-cream">The full case study</Link>.
          </p>
        </Section>
      )}

      <Section id="utopia" number={11} title="The work moved through local hands.">
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4741] md:text-xl">Oonchiumpa held the build and the relationships. Urapuntja staff led the final local delivery and the feedback that now shapes what comes next.</p>
      </Section>
      {utopiaRun && utopiaRun.scenes.length > 0 && <UtopiaJourney steps={UTOPIA_STEPS} scenes={utopiaRun.scenes} />}
      <div className="bg-goods-cream py-20 md:py-24">
        {utopiaCards.length > 0 && (
          <div className="px-6 md:px-10 lg:px-14">
            <div className="mx-auto max-w-6xl">
              <VoiceFilmCards cards={utopiaCards} />
            </div>
          </div>
        )}
        {utopiaRun && utopiaPhotoCount > 0 && (
          <div className="mt-24">
            <PhotoWall groups={utopiaRun.groups} title="The trip, in pictures" sub={`${utopiaPhotoCount} photographs, Alice Springs to Ampilatwatja, 20 to 22 May 2026.`} />
          </div>
        )}
        <div className="mt-12 px-6 md:px-10 lg:px-14">
          <p className="mx-auto max-w-6xl">
            <Link href={`/field-notes/${UTOPIA_NOTE}`} className="inline-flex min-h-11 items-center rounded-full border border-goods-ink/30 px-4 text-sm font-semibold hover:border-goods-terracotta hover:text-goods-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta">Read the Utopia field note</Link>
          </p>
        </div>
      </div>

      {/* S12 · Who buys */}
      <Section id="buyers" number={12} title={BUYERS.headline} dark>
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-goods-terracotta-light">Who buys from a community organisation</p>
            <p className="mt-3 text-lg leading-relaxed text-goods-cream/85">{BUYERS.who}</p>
            <p className="mt-6 text-goods-cream/80">{BUYERS.brings}</p>
          </div>
          <ul className="divide-y divide-goods-cream/15" aria-label="Buyers so far">
            {BUYERS.rows.map((r) => (
              <li key={r.buyer} className="grid grid-cols-[1fr_auto] gap-4 py-4">
                <div>
                  <p className="font-display text-xl font-semibold leading-tight text-goods-cream">{r.buyer}</p>
                  <p className="mt-1 text-sm leading-snug text-goods-cream/75">{r.line}</p>
                </div>
                <p className="font-display text-3xl font-semibold tabular-nums text-goods-cream">{r.beds}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* S13 · The whole model */}
      <section id="model" className="scroll-mt-28 border-t border-[#e6dfd1] bg-[#FDF8F3] py-20 md:py-28">
        <div className="px-6 md:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <SectionHead number={13} title={SHEET.title} />
            <div className="mt-6 max-w-3xl">
              <Lines lines={trade.lines} />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <ModelLoopBuild steps={LOOP_STEPS} stations={LOOP_STATIONS} arcs={LOOP_ARCS} counts={LOOP_COUNTS} sheetSvg={placematSvg} items={placematItems} arrows={placematArrows} />
        </div>
      </section>

      {/* S14 · What we measure */}
      <Section id="measure" number={14} title={MEASURES_HEADLINE}>
        <ul className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {MEASURES.map((m) => (
            <li key={m.id}>
              <p className="text-sm font-semibold uppercase tracking-wide text-goods-terracotta">{m.area}</p>
              <h3 className="mt-1 font-display text-2xl font-semibold leading-tight md:text-3xl">{m.title}</h3>
              <p className="mt-5 font-display text-5xl font-semibold leading-none">
                <CountUp value={m.today.value} unit={m.today.unit} label={m.today.label} />
              </p>
              <p className="mt-2 text-[15px] text-[#4a4741]">{m.today.line}</p>
              <div className="mt-5">
                <TodayPlanBars today={m.today.value} plan={m.plan.value} todayLabel={m.today.label} planLabel={m.plan.label} />
              </div>
              <p className="mt-2 text-[15px] text-[#4a4741]">
                Year one plan: {m.plan.line} <ClaimLabel label={m.plan.label} />
              </p>
              <p className="mt-3 text-sm text-[#5d574c]">{m.counted}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#5d574c]">
          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-8 rounded-full bg-goods-terracotta" />counted today</span>
          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-8 rounded-full border border-goods-terracotta/60 bg-goods-terracotta/25" />year one plan</span>
        </div>
        <p className="mt-6 max-w-3xl text-[#4a4741]">{MEASURES_FOOTER}</p>
      </Section>

      {/* S14b · Ten years */}
      <Section id="ten-years" number="14b" title="If two communities a year take a facility." dark>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-goods-cream/85 md:text-xl">Beds made each year, at the Goods on Country facility and at community facilities. Targets inside modelled capacity. Not forecasts. Push the number and watch the model recompute.</p>
        <div className="mt-10">
          <TenYearSlider dark />
        </div>
      </Section>

      {/* S15 · Where each dollar goes */}
      <Section id="money" number={15} title="Keep each dollar in its own lane.">
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4741] md:text-xl">Philanthropy buys the first beds. QBE builds the two facilities. A loan carries the first-year running cost and is repaid from the beds Goods sells. Customers pay the community organisation, and that money stays there.</p>
        <MoneyLanesView lanes={isQbe ? MONEY_LANES : MONEY_LANES.map((l) => ({ ...l, source: { ...l.source, named: "" } }))} never={MONEY_NEVER} total={MONEY_TOTAL} split={BED_SPLIT} price={BED.priceAud} ways={BED_WAYS} named={isQbe} />
        {/* Money RECEIVED, which unlike the lanes above carries no confidentiality
            problem, so it is named on both doors. See funders-so-far.tsx. */}
        <FundersSoFar />
      </Section>

      {/* S16 · Capital status, QBE door only */}
      {isQbe && (
        <Section id="capital" number={16} title="Each source has a job and a status." dark>
          <div className="mt-10 rounded-[22px] border border-goods-cream/15 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-goods-terracotta-light">Asked this year · nothing signed</p>
            <p className="mt-2 font-display text-5xl font-semibold leading-none text-goods-cream sm:text-6xl md:text-7xl">{aud(RAISE.totalShownAud)}</p>
            <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full" aria-hidden="true">
              {RAISE_BREAKDOWN.map((r) => (
                <span key={r.line} style={{ width: `${(r.aud / RAISE.totalAud) * 100}%` }} className={`${r.line === 'qbe' ? 'bg-[#8B9D77]' : r.line === 'sefa' ? 'bg-goods-cream/60' : 'bg-goods-terracotta'} border-r-2 border-goods-ink last:border-r-0`} />
              ))}
            </div>
            <table className="mt-6 w-full text-left text-[15px]">
              <caption className="sr-only">The ask by line, {aud(RAISE.totalAud)} exactly</caption>
              <tbody className="divide-y divide-goods-cream/10">
                {RAISE_BREAKDOWN.map((r) => {
                  const f = FUNDING_LINES.find((x) => x.id === r.line);
                  return (
                    <tr key={r.line}>
                      <th scope="row" className="py-3 pr-4 align-top font-semibold text-goods-cream">{f?.funder.split(",")[0]}<span className="mt-0.5 block text-[13px] font-normal text-goods-cream/70 md:hidden">{r.buys}</span></th>
                      <td className="hidden py-3 pr-4 text-goods-cream/75 md:table-cell">{r.buys}</td>
                      <td className="py-3 text-right align-top font-display text-lg tabular-nums text-goods-cream sm:text-xl">{aud(r.aud)}</td>
                    </tr>
                  );
                })}
                <tr>
                  <th scope="row" className="pt-4 pr-4 font-semibold text-goods-cream">In all</th>
                  <td className="hidden pt-4 pr-4 text-goods-cream/75 md:table-cell">Grants {aud(RAISE.qbeAud + RAISE.bedsAud)} and a loan {aud(RAISE.loanAud)}</td>
                  <td className="pt-4 text-right font-display text-xl tabular-nums text-goods-cream">{aud(RAISE.totalAud)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="mt-10 divide-y divide-goods-cream/15" aria-label="The raise by source">
            {FUNDING_LINES.filter((f) => f.instrument !== 'report').map((f) => (
              <li key={f.id} className="grid gap-2 py-5 md:grid-cols-[1.4fr_1fr_1fr] md:items-baseline md:gap-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-goods-terracotta-light">{f.status} · {f.instrument}</p>
                  <p className="mt-1 font-display text-xl font-semibold leading-tight text-goods-cream">{f.funder}</p>
                </div>
                <p className="font-display text-2xl tabular-nums text-goods-cream">{f.amount}</p>
                <p className="text-[15px] leading-snug text-goods-cream/80">{f.job}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-sm text-goods-cream/75">Nothing here is signed. Statuses are the conservative words the deck uses: proposed, invited, offered to a partner.</p>
        </Section>
      )}

      {/* S17 · The sequence */}
      <Section id="sequence" number={17} title={GATES_HEADLINE}>
        <GatesTimeline gates={GATES4} footer={GATES_FOOTER} />
      </Section>

      {/* S18 · The request, QBE door only */}
      {isQbe && (
        <Section id="request" number={18} title={REQUEST_DETAIL.headline} dark>
          <div className="mt-10 grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-start">
            <div>
              <p className="font-display text-6xl font-semibold leading-none text-goods-terracotta-light sm:text-7xl md:text-8xl">{aud(RAISE.qbeAud)}</p>
              <p className="mt-4 text-goods-cream/85">{REQUEST_DETAIL.status}</p>
              <p className="mt-6 font-display text-2xl font-semibold leading-snug text-goods-cream">{REQUEST_DETAIL.scope}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-goods-cream/80">{REQUEST_DETAIL.explainer}</p>
            </div>
            <dl className="divide-y divide-goods-cream/15">
              {[REQUEST_DETAIL.buys, REQUEST_DETAIL.notBuys, REQUEST_DETAIL.where].map((b) => (
                <div key={b.title} className="py-5">
                  <dt className="font-display text-2xl font-semibold text-goods-cream">{b.title}</dt>
                  <dd className="mt-2 text-[16px] leading-relaxed text-goods-cream/80">{b.line}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-10 max-w-4xl text-sm text-goods-cream/75">{REQUEST_DETAIL.footer}</p>
        </Section>
      )}

      <Band>
        <h3 className="font-display text-2xl font-semibold">What a bed changes, in one afternoon.</h3>
        <div className="mt-6">
          <OffTheFloor />
        </div>
      </Band>

      {/* S19 · The close */}
      <section id="close" className="relative scroll-mt-28 overflow-hidden bg-goods-ink text-goods-cream">
        <Image src={CLOSE.photo.src} alt="" fill sizes="100vw" className="object-cover opacity-60" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-goods-ink via-goods-ink/70 to-goods-ink/20" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-24 md:px-10 lg:px-14">
          <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] text-balance md:text-6xl">{CLOSE.headline}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-goods-cream/90 md:text-2xl">{CLOSE.invitation}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ContactGoodsButton variant="solid" label="Talk to us" subject="Partnership Inquiry" />
            <a href="#model" className="rounded-full border border-goods-cream/40 px-6 py-3 text-sm font-semibold text-goods-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-cream">Back to the model</a>
          </div>
          <p className="mt-10 text-xs text-goods-cream/70">{CLOSE.photo.place}</p>
        </div>
      </section>

      {/* Questions */}
      <Section id="questions" number={20} title={questions.title} tight>
        <div className="mt-6 max-w-3xl">
          <Lines lines={questions.lines} />
          <p className="mt-3 text-sm text-[#5d574c]">{QUESTIONS.length} questions, {QUESTIONS_OPEN_COUNT} still open or partly answered.</p>
        </div>
        <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="border-t border-[#e6dfd1] pt-5">
              <dt className="font-display text-2xl font-semibold leading-tight text-balance">{q.question}</dt>
              <dd className="mt-3 text-[16px] leading-relaxed text-[#4a4741]">
                {q.answer || <span className="text-goods-terracotta">Open. We do not yet have an answer we would say out loud.</span>}
                {q.status === 'partly' && <span className="ml-2 text-sm text-[#5d574c]">Partly answered.</span>}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-14 text-sm text-[#5d574c]">Words {STORY_UPDATED}. Figures from the register and canon. The drawings on this page are the deck&apos;s drawings, rendered from the same files.</p>
      </Section>

      {/* The listening map, the surprise at the very bottom, outside the chapter rail.
          Renders in production only once confirmed in data/community-contributions.json. */}
      {(contributionsConfirmed() || process.env.NODE_ENV !== 'production') && (() => {
        const voices = listeningVoices();
        return <MadeWithCommunity outline={outline} places={listeningPlaces(locations, voices)} voices={voices} draft={!contributionsConfirmed()} />;
      })()}

      {/* The last thing on the page: three doors rather than one button.
          A procurement officer, a philanthropist and someone from a community all
          pressed the same "Talk to us" and landed in the same undifferentiated
          inbox. Each door now carries its own subject, which becomes its own tag
          (lib/ghl/canonical-tags), its own board and its own reply. */}
      <section aria-label="Contact Goods on Country" className="bg-goods-ink px-6 py-14 text-goods-cream md:px-10 md:py-16 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">Goods on Country</p>
          <p className="mt-2 font-display text-3xl font-semibold leading-tight md:text-4xl">Three ways in.</p>
          <p className="mt-2 max-w-xl text-goods-cream/80">Tell us which one you are and the right person answers.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {([
              {
                title: 'Order beds',
                body: 'You have a budget and a community waiting. We quote the beds and the freight to your place in one figure.',
                label: 'Order beds',
                subject: 'Bulk Order Inquiry',
              },
              {
                title: 'Fund a facility',
                body: 'You want to put capital behind a plant a community comes to own. A grant, or something recoverable.',
                label: 'Fund a facility',
                subject: 'Facility Funding Inquiry',
              },
              {
                title: 'Bring this to my community',
                body: 'Your community wants a say in what gets made, who gets paid and what comes next. A person rings you.',
                label: 'Start a conversation',
                subject: 'Community Interest',
              },
            ] as const).map((door) => (
              <div
                key={door.subject}
                className="flex flex-col rounded-[22px] border border-goods-cream/20 bg-goods-cream/5 p-6"
              >
                <p className="font-display text-xl font-semibold">{door.title}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-goods-cream/75">{door.body}</p>
                <div className="mt-5">
                  <ContactGoodsButton variant="solid" label={door.label} subject={door.subject} />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-7 text-sm text-goods-cream/60">
            Something else? <ContactGoodsButton label="Send a message" subject="General Inquiry" />
          </p>
        </div>
      </section>
    </main>
  );
}
