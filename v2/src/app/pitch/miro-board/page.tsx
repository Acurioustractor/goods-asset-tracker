import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  MessageSquareQuote,
  Route,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { deckPhotoSlots, storytellerReview } from '@/lib/data/pitch-photo-review';
import {
  deckRun,
  messageLenses,
  pitchSections,
  placePathways,
  themeThreads,
  workshopThesis,
} from '@/lib/data/pitch-workshop';
import type { PhotoCandidate } from '@/lib/data/pitch-photo-review';

export const metadata = {
  title: 'Miro-ready board | Goods on Country pitch',
  description:
    'A Miro-ready brand vision board for the Goods on Country pitch, with message, photos, quotes, places, and deck decisions.',
};

const featuredNames = new Set([
  'Dianne Stokes',
  'Mykel',
  'Fred Campbell',
  'Xavier',
  'Kristy Bloomfield',
  'Karen Liddle',
  'Katrina Bloomfield',
  'Ray Nelson',
  'Ivy',
  'Alfred Johnson',
  'Norman Frank',
  'Linda Turner',
]);

const decisionLanes = [
  {
    label: 'Use now',
    items: [
      'Oonchiumpa as proof pattern',
      'Mykel and Fred for young maker pathway',
      'Dianne for design and demand',
      'Container plant for how production moves',
    ],
  },
  {
    label: 'Needs better photo',
    items: [
      'Karen Liddle portrait if used by face',
      'Ray Nelson register story',
      'Plant operators working with machines',
      'Clean before and after pair',
    ],
  },
  {
    label: 'Needs EL check',
    items: [
      'Any identifiable young person image',
      'Utopia household delivery photos',
      'Xavier image with Fred as narrator',
      'Elder names and portraits',
    ],
  },
  {
    label: 'Hold for later',
    items: [
      'Detailed DGR structure until landed',
      'Measured clinical outcomes',
      'Community ownership as completed fact',
      'New locations without partner proof',
    ],
  },
];

const missionArc = [
  {
    step: 'Partner capital',
    line: 'Centrecorp pays for materials. The next partners close plant readiness, working stock, and place-based roles.',
    image: '/images/partners/centrecorp-foundation.jpg',
  },
  {
    step: 'Community partner',
    line: 'Oonchiumpa holds the young people, the relationships, the pickup each morning, and the doors to visit.',
    image: '/images/partners/oonchiumpa.png',
  },
  {
    step: 'Young people build',
    line: 'Young people make the beds they sleep on, then make more for the homelands.',
    image: '/images/stories/utopia/04-build.jpg',
  },
  {
    step: 'Homes receive',
    line: 'Local teams lead the truck house to house. Families ask for two or three, not one.',
    image: '/images/stories/utopia/06-delivery.jpg',
  },
  {
    step: 'Knowledge returns',
    line: 'Quotes, photos, QR records, repair notes, and household feedback shape the next build.',
    image: '/images/stories/utopia/08-beforeafter.jpg',
  },
  {
    step: 'Making moves closer',
    line: 'Plastic, plant, quality practice, and sales move toward a community-held production pathway.',
    image: '/images/process/container-factory.jpg',
  },
];

const centralMotifs = [
  {
    label: 'Lead motif',
    line: 'A bed off the ground is the first proof of a bigger transfer.',
    use: 'Best centre for the strategy deck because it joins health, product, young people, plant, and ownership.',
  },
  {
    label: 'Story line',
    line: 'The first thing is a bed. The bigger thing is where the making lands.',
    use: 'Strong as the voiceover line between the product slide and the operating model slide.',
  },
  {
    label: 'Deck close',
    line: 'Goods succeeds when communities hold the making and Goods is no longer needed in the middle.',
    use: 'Use at the end, after the capital ask and the place pathway.',
  },
];

const fieldNoteBeats = [
  {
    title: 'Build',
    place: 'Alice Springs',
    line: 'Two days with Oonchiumpa. Young people built beds they would sleep on.',
    image: '/images/stories/utopia/04-build.jpg',
  },
  {
    title: 'Road',
    place: 'Sandover',
    line: 'Oonchiumpa led the way. Goods followed onto Anmatyerr and Alyawarr Country.',
    image: '/images/stories/utopia/02-arrive.jpg',
  },
  {
    title: 'Doors',
    place: 'Arlparra',
    line: 'Local teams knew the houses. The truck mattered because relationships were already there.',
    image: '/images/stories/utopia/06-delivery.jpg',
  },
  {
    title: 'Home',
    place: 'Arawerr',
    line: 'People showed what they were sleeping on, then asked for beds for the next house too.',
    image: '/images/stories/utopia/08-beforeafter.jpg',
  },
  {
    title: 'Elders',
    place: 'Ampilatwatja',
    line: 'The yarning took longer than the assembly. That is the story the deck should honour.',
    image: '/images/stories/utopia/07-elders.jpg',
  },
  {
    title: 'Next',
    place: 'Central Australia',
    line: 'Mykel wanting to make beds every day points toward the plant, paid work, and local ownership.',
    image: '/images/stories/utopia/10-next.jpg',
  },
];

const fieldNoteQuotes = [
  {
    quote: 'Comfortable as. Smooth, tight, hard, fancy.',
    by: 'Mykel',
  },
  {
    quote: "Yeah, I'll be rocking up every day to make them.",
    by: 'Mykel',
  },
  {
    quote: 'Two for our place. Three for the other one.',
    by: 'Household member, Arawerr',
  },
  {
    quote: "Off the ground. That's the main thing.",
    by: 'Elder, Arlparra',
  },
  {
    quote: 'Most of our people in community are just on a blanket on the ground.',
    by: 'Katrina Bloomfield',
  },
  {
    quote: 'To see kids faces with joy after making a bed, it just really hits you.',
    by: 'Karen Liddle',
  },
];

const utopiaStoryPhotos: PhotoCandidate[] = [
  { src: '/images/stories/utopia/01-hero.jpg', label: 'Utopia road and arrival', source: 'local' },
  { src: '/images/stories/utopia/02-arrive.jpg', label: 'Arriving on the Sandover', source: 'local' },
  { src: '/images/stories/utopia/03-materials.jpg', label: 'Materials ready for build', source: 'local' },
  { src: '/images/stories/utopia/04-build.jpg', label: 'Alice build with young people', source: 'local' },
  { src: '/images/stories/utopia/05-waste.jpg', label: 'Plastic to bed legs', source: 'local' },
  { src: '/images/stories/utopia/06-delivery.jpg', label: 'Beds arriving at homes', source: 'local' },
  { src: '/images/stories/utopia/07-elders.jpg', label: 'Elders testing beds', source: 'local' },
  { src: '/images/stories/utopia/08-beforeafter.jpg', label: 'Before and after', source: 'local' },
  { src: '/images/stories/utopia/09-offground.jpg', label: 'Bed off the ground', source: 'local' },
  { src: '/images/stories/utopia/10-next.jpg', label: 'Next step in Utopia story', source: 'local' },
  { src: '/images/stories/utopia/11-close.jpg', label: 'Sandover close', source: 'local' },
  { src: '/images/stories/utopia/region-map.png', label: 'Utopia region map', source: 'local' },
];

const partnerProofPhotos: PhotoCandidate[] = [
  { src: '/images/partners/centrecorp/utopia/community-build.jpg', label: 'Community build', source: 'local' },
  { src: '/images/partners/centrecorp/utopia/delivery-court.jpg', label: 'Delivery court', source: 'local' },
  { src: '/images/partners/centrecorp/utopia/final-assembly.jpg', label: 'Final assembly', source: 'local' },
  { src: '/images/partners/centrecorp/utopia/home-setup.jpg', label: 'Home setup', source: 'local' },
  { src: '/images/partners/centrecorp/utopia/verandah-test.jpg', label: 'Verandah test', source: 'local' },
  { src: '/images/partners/centrecorp/utopia/elder-feedback.jpg', label: 'Elder feedback', source: 'local' },
  { src: '/images/partners/centrecorp/utopia/finished-bed-country.jpg', label: 'Finished bed on Country', source: 'local' },
  { src: '/images/partners/centrecorp/utopia/unpacking-parts.jpg', label: 'Unpacking parts', source: 'local' },
];

const mparntweReviewPhotos: PhotoCandidate[] = Array.from({ length: 16 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return {
    src: `/images/utopia/utopia-${number}.jpg`,
    label: `Mparntwe and Utopia review ${number}`,
    source: 'local' as const,
    note: 'Review consent and story role before deck use.',
  };
});

const messageBuildouts = [
  {
    label: 'One-line thesis',
    line: 'Community knowledge becomes health hardware, local work, and production that communities can own.',
  },
  {
    label: 'Field-note proof',
    line: 'In three days, young people built beds in Alice Springs and local teams led those beds into Utopia homes.',
  },
  {
    label: 'Partner logic',
    line: 'Partners should fund the transfer: product stock, plant readiness, roles, governance, and the first local production pathway.',
  },
  {
    label: 'Strategic ask',
    line: 'Back the next place-based run so the plant, training, sales, and repair model can move closer to community.',
  },
];

const deckDecisionPrompts = [
  'Which single image carries the whole deck: young people building, a bed in a home, or the plant?',
  'Where do we introduce Oonchiumpa: opening proof, middle model, or final ownership path?',
  'Do we lead with Mykel, Karen, Dianne, or the household delivery voices?',
  'Which phrase should become the deck spine: first proof of transfer, where the making lands, or Goods becomes unnecessary?',
  'What photos need a final EL consent check before they leave the strategy board?',
];

function BoardFrame({
  eyebrow,
  title,
  children,
  className = '',
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={['rounded-lg border border-[#d9cdb8] bg-[#fffdf8] p-5 shadow-sm', className].join(' ')}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9b6a45]">{eyebrow}</p>
      <h2
        className="mt-2 text-3xl font-light leading-tight text-[#2b2a26]"
        style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
      >
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function StrategySketch() {
  return (
    <div className="rounded-lg border border-[#d9cdb8] bg-[#fbf8f1] p-5">
      <div className="relative min-h-[330px] overflow-hidden rounded-lg border border-[#ded4c1] bg-[#fffdf8] p-5">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 920 330" aria-hidden="true">
          <path
            d="M112 162 C 230 74, 360 74, 463 162 S 696 250, 820 162"
            fill="none"
            stroke="#c45c3e"
            strokeDasharray="8 10"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M142 236 C 262 188, 362 214, 462 236 C 584 264, 690 212, 780 236"
            fill="none"
            stroke="#8b9d77"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
        <div className="relative grid gap-4 md:grid-cols-5">
          {[
            ['Ask', 'What does family need?'],
            ['Make', 'Who can build it?'],
            ['Use', 'Does it work at home?'],
            ['Learn', 'What did community say?'],
            ['Own', 'Where should making land?'],
          ].map(([label, line]) => (
            <div key={label} className="rounded-lg border border-[#ded4c1] bg-white/95 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9b6a45]">{label}</p>
              <p className="mt-3 text-lg font-semibold leading-tight text-[#2b2a26]">{line}</p>
            </div>
          ))}
        </div>
        <div className="relative mt-8 grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-lg border border-[#ded4c1] bg-[#2b2a26] p-5 text-[#fbf8f1]">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c45c3e]">Visible object</p>
            <p className="mt-3 text-2xl font-light leading-tight" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              A bed off the ground
            </p>
          </div>
          <ArrowRight className="hidden h-8 w-8 text-[#c45c3e] md:block" />
          <div className="rounded-lg border border-[#ded4c1] bg-[#8b9d77] p-5 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">Strategic transfer</p>
            <p className="mt-3 text-2xl font-light leading-tight" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              Making held closer to community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallPhoto({ photo }: { photo: PhotoCandidate }) {
  return (
    <figure className="overflow-hidden rounded-md border border-[#ded4c1] bg-white">
      <div className="relative aspect-[4/3] bg-[#f1ece4]">
        <Image src={photo.src} alt={photo.label} fill sizes="240px" className="object-cover" loading="eager" />
      </div>
      <figcaption className="p-2">
        <p className="text-xs font-semibold leading-snug text-[#2b2a26]">{photo.label}</p>
      </figcaption>
    </figure>
  );
}

function ArcCard({ item, index }: { item: (typeof missionArc)[number]; index: number }) {
  return (
    <article className="rounded-lg border border-[#ded4c1] bg-white p-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#f1ece4]">
        <Image src={item.image} alt={item.step} fill sizes="260px" className="object-cover" loading="eager" />
        <span className="absolute left-2 top-2 rounded bg-[#2b2a26]/85 px-2 py-1 text-[11px] font-semibold text-[#fbf8f1]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-[#2b2a26]">{item.step}</h3>
      <p className="mt-2 text-xs leading-relaxed text-[#7a7363]">{item.line}</p>
    </article>
  );
}

function PersonCard({ person }: { person: (typeof storytellerReview)[number] }) {
  return (
    <article className="rounded-md border border-[#ded4c1] bg-white p-3">
      <div className="flex gap-3">
        {person.photo ? (
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-[#f1ece4]">
            <Image src={person.photo} alt={person.name} fill sizes="56px" className="object-cover" loading="eager" />
          </div>
        ) : (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-[#d9cdb8] bg-[#f1ece4] text-[#7a7363]">
            <ImageIcon className="h-4 w-4" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-[#2b2a26]">{person.name}</h3>
          <p className="mt-1 text-[11px] leading-relaxed text-[#7a7363]">{person.location}</p>
        </div>
      </div>
      {person.quote && <p className="mt-3 text-xs leading-relaxed text-[#2b2a26]">&quot;{person.quote}&quot;</p>}
      <p className="mt-3 text-[11px] leading-relaxed text-[#7a7363]">{person.deckUse}</p>
    </article>
  );
}

export default function MiroReadyBoardPage() {
  const featuredStorytellers = storytellerReview.filter((person) => featuredNames.has(person.name));

  return (
    <main className="min-h-screen bg-[#ebe3d5] text-[#2b2a26]">
      <div className="sticky top-0 z-20 border-b border-[#d9cdb8] bg-[#fbf8f1]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/pitch/workshop"
              className="inline-flex items-center gap-2 rounded-md border border-[#d9cdb8] bg-white px-3 py-2 text-sm font-semibold text-[#2b2a26]"
            >
              <ArrowLeft className="h-4 w-4" />
              Workshop
            </Link>
            <Link
              href="/pitch/investor-lab"
              className="inline-flex items-center gap-2 rounded-md border border-[#d9cdb8] bg-white px-3 py-2 text-sm font-semibold text-[#2b2a26]"
            >
              Investor lab
              <Compass className="h-4 w-4" />
            </Link>
            <Link
              href="/pitch/community-narrative"
              className="inline-flex items-center gap-2 rounded-md border border-[#d9cdb8] bg-white px-3 py-2 text-sm font-semibold text-[#2b2a26]"
            >
              Community narrative
              <ExternalLink className="h-4 w-4" />
            </Link>
            <Link
              href="/pitch/photo-review"
              className="inline-flex items-center gap-2 rounded-md border border-[#d9cdb8] bg-white px-3 py-2 text-sm font-semibold text-[#2b2a26]"
            >
              Photo review
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#7a7363]">Miro-ready board</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] space-y-8 px-6 py-8">
        <section className="rounded-lg bg-[#2b2a26] p-8 text-[#fbf8f1]">
          <p className="text-sm uppercase tracking-[0.28em] text-[#c45c3e]">Goods on Country</p>
          <h1
            className="mt-5 max-w-5xl text-6xl font-light leading-[1.05]"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            {workshopThesis.line}
          </h1>
          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-[#fbf8f1]/70">{workshopThesis.reason}</p>
        </section>

        <BoardFrame eyebrow="01" title="Central story drawing">
          <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
            <StrategySketch />
            <div className="space-y-4">
              {centralMotifs.map((motif) => (
                <article key={motif.label} className="rounded-lg border border-[#ded4c1] bg-white p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#c45c3e]" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9b6a45]">
                        {motif.label}
                      </p>
                      <h3
                        className="mt-2 text-2xl font-light leading-tight text-[#2b2a26]"
                        style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                      >
                        {motif.line}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#7a7363]">{motif.use}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </BoardFrame>

        <BoardFrame eyebrow="02" title="Mission from start to finish">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {missionArc.map((item, index) => (
              <ArcCard key={item.step} item={item} index={index} />
            ))}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {messageBuildouts.map((message) => (
              <article key={message.label} className="rounded-lg border border-[#ded4c1] bg-[#fbf8f1] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9b6a45]">{message.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#2b2a26]">{message.line}</p>
              </article>
            ))}
          </div>
        </BoardFrame>

        <BoardFrame eyebrow="03" title="Utopia field note proof">
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-3 md:grid-cols-3">
              {fieldNoteBeats.map((beat) => (
                <article key={beat.title} className="overflow-hidden rounded-lg border border-[#ded4c1] bg-white">
                  <div className="relative aspect-[4/3] bg-[#f1ece4]">
                    <Image src={beat.image} alt={beat.title} fill sizes="320px" className="object-cover" loading="eager" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 text-[#9b6a45]">
                      <MapPin className="h-3.5 w-3.5" />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">{beat.place}</p>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-[#2b2a26]">{beat.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#7a7363]">{beat.line}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border border-[#ded4c1] bg-[#2b2a26] p-5 text-[#fbf8f1]">
                <div className="flex items-center gap-2 text-[#c45c3e]">
                  <Route className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">Deck spine from the field note</p>
                </div>
                <p className="mt-4 text-lg leading-relaxed text-[#fbf8f1]/80">
                  Alice Springs build, Utopia delivery, household demand, Elder testing, and the plant pathway are one story.
                  The strategy deck should not split them into separate ideas.
                </p>
                <Link
                  href="/field-notes/utopia-may-2026"
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#fbf8f1] px-3 py-2 text-sm font-semibold text-[#2b2a26]"
                >
                  Open field note
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                {fieldNoteQuotes.map((item) => (
                  <blockquote key={`${item.by}-${item.quote}`} className="rounded-lg border border-[#ded4c1] bg-white p-4">
                    <p className="text-sm leading-relaxed text-[#2b2a26]">&quot;{item.quote}&quot;</p>
                    <footer className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a7363]">
                      {item.by}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </BoardFrame>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <BoardFrame eyebrow="04" title="Pitch spine">
            <div className="grid grid-cols-6 gap-3">
              {pitchSections.map((section) => (
                <div key={section.id} className="rounded-lg border border-[#ded4c1] bg-[#fbf8f1] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b6a45]">
                    {section.navLabel}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-snug">{section.question}</p>
                </div>
              ))}
            </div>
          </BoardFrame>

          <BoardFrame eyebrow="05" title="Message options">
            <div className="grid gap-3 md:grid-cols-2">
              {messageLenses.map((lens) => (
                <article key={lens.id} className="rounded-lg border border-[#ded4c1] bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-[#c45c3e]">
                    <MessageSquareQuote className="h-4 w-4" />
                    <h3 className="text-sm font-semibold text-[#2b2a26]">{lens.label}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#2b2a26]">{lens.line}</p>
                  <p className="mt-3 text-[11px] leading-relaxed text-[#7a7363]">{lens.watchOut}</p>
                </article>
              ))}
            </div>
          </BoardFrame>
        </div>

        <BoardFrame eyebrow="06" title="Photo swap wall">
          <div className="grid gap-5 xl:grid-cols-3">
            {deckPhotoSlots.map((slot) => (
              <article key={slot.id} className="rounded-lg border border-[#ded4c1] bg-[#fbf8f1] p-4">
                <h3 className="text-base font-semibold">{slot.slide}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#7a7363]">{slot.job}</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <SmallPhoto photo={slot.preferred} />
                  {slot.alternates.slice(0, 2).map((photo) => (
                    <SmallPhoto key={photo.src} photo={photo} />
                  ))}
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-[#7a7363]">{slot.check}</p>
              </article>
            ))}
          </div>
        </BoardFrame>

        <BoardFrame eyebrow="07" title="Expanded photo bank">
          <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[#9b6a45]">
                <UsersRound className="h-4 w-4" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">Field note sequence</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-6">
                {utopiaStoryPhotos.map((photo) => (
                  <SmallPhoto key={photo.src} photo={photo} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2 text-[#9b6a45]">
                <ImageIcon className="h-4 w-4" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">Partner proof photos</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-4">
                {partnerProofPhotos.map((photo) => (
                  <SmallPhoto key={photo.src} photo={photo} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-[#ded4c1] bg-[#fbf8f1] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9b6a45]">
              Mparntwe and Utopia extras for review
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#7a7363]">
              Use this row as a sorting pool. Keep images here until the exact deck job, caption, and EL consent record are clear.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
              {mparntweReviewPhotos.map((photo) => (
                <SmallPhoto key={photo.src} photo={photo} />
              ))}
            </div>
          </div>
        </BoardFrame>

        <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
          <BoardFrame eyebrow="08" title="Storyteller wall">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {featuredStorytellers.map((person) => (
                <PersonCard key={person.name} person={person} />
              ))}
            </div>
          </BoardFrame>

          <BoardFrame eyebrow="09" title="Themes we are hearing">
            <div className="space-y-3">
              {themeThreads.map((thread) => (
                <article key={thread.id} className="rounded-lg border border-[#ded4c1] bg-white p-4">
                  <h3 className="text-base font-semibold">{thread.theme}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#7a7363]">{thread.whatCommunityIsSaying}</p>
                  <blockquote className="mt-3 rounded-md bg-[#f1ece4] p-3 text-sm leading-relaxed">
                    &quot;{thread.bestQuote}&quot;
                    <footer className="mt-2 text-[11px] font-semibold text-[#7a7363]">{thread.quoteBy}</footer>
                  </blockquote>
                </article>
              ))}
            </div>
          </BoardFrame>
        </div>

        <BoardFrame eyebrow="10" title="Place pathways">
          <div className="grid gap-4 xl:grid-cols-4">
            {placePathways.map((place) => (
              <article key={place.id} className="rounded-lg border border-[#ded4c1] bg-white p-4">
                <h3 className="text-lg font-semibold">{place.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#7a7363]">{place.role}</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {place.photos.slice(0, 3).map((photo) => (
                    <SmallPhoto key={photo.src} photo={photo} />
                  ))}
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#9b6a45]">Next move</p>
                <p className="mt-2 text-xs leading-relaxed text-[#2b2a26]">{place.nextMove}</p>
              </article>
            ))}
          </div>
        </BoardFrame>

        <BoardFrame eyebrow="11" title="Deck storyboard">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {deckRun.map((slide) => (
              <article key={slide.number} className="overflow-hidden rounded-lg border border-[#ded4c1] bg-white">
                <div className="relative aspect-video bg-[#f1ece4]">
                  <Image src={slide.photo.src} alt={slide.photo.label} fill sizes="300px" className="object-cover" loading="eager" />
                  <span className="absolute left-2 top-2 rounded bg-[#2b2a26]/85 px-2 py-1 text-[11px] font-semibold text-[#fbf8f1]">
                    {slide.number}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#9b6a45]">{slide.job}</p>
                  <h3 className="mt-1 text-sm font-semibold leading-snug">{slide.title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-[#7a7363]">{slide.message}</p>
                </div>
              </article>
            ))}
          </div>
        </BoardFrame>

        <BoardFrame eyebrow="12" title="Decision lanes">
          <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {decisionLanes.map((lane) => (
                <article key={lane.label} className="rounded-lg border border-[#ded4c1] bg-[#fbf8f1] p-4">
                  <h3 className="text-lg font-semibold">{lane.label}</h3>
                  <ul className="mt-4 space-y-3">
                    {lane.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-relaxed text-[#2b2a26]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8b9d77]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <article className="rounded-lg border border-[#ded4c1] bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9b6a45]">Questions for the deck room</p>
              <ul className="mt-4 space-y-3">
                {deckDecisionPrompts.map((prompt) => (
                  <li key={prompt} className="flex gap-2 text-sm leading-relaxed text-[#2b2a26]">
                    <MessageSquareQuote className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#c45c3e]" />
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </BoardFrame>
      </div>
    </main>
  );
}
