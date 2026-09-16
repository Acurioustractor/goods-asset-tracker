/**
 * An idea, a program, a project, and now a 100% Indigenous not-for-profit, walked through over
 * the Tennant Creek drone. Plus the funder who was there for all four.
 *
 * Ben, 16 September 2026: run the drone FULL SCREEN with a scrolling system for the moments,
 * show the movement from an idea and a program to a project to the not-for-profit, name the
 * different ways philanthropy supports us, and do not embed the recording. A quote and an image.
 * So this is StickyFilm, the same pattern chapter 2 uses: the film pins to the viewport and the
 * moments scroll over it. It has to sit OUTSIDE the chapter's max-w wrapper to go edge to edge.
 *
 * The film is Tingkkarli / Lake Mary Ann, five kilometres north of Tennant Creek, cut from the
 * 3 April 2025 trip. Country with nobody in frame, and a publicly promoted recreation lake, so
 * it raises no consent question of its own.
 *
 * NO DOLLAR FIGURES, same ruling as the rest of the funder surfaces. The argument is that Snow
 * went first and then stayed. The size of the cheque is a different subject.
 *
 * Names and words come out of the registry. Nothing here is typed by hand:
 * check-storyteller-registry.mjs fails the build on a non-external name appearing literally in
 * a rendered surface, which caught two drafts of this component, once in a quote and once in a
 * photo caption. Entity facts come from ORGANISATION so this cannot disagree with the footer.
 */

import Image from 'next/image';
import { ORGANISATION } from '@/lib/data/organisation';
import { StickyFilm, type FilmStep } from '@/components/pitch/sticky-film';
import { getStorytellerBySlug, type VoiceTier } from '@/lib/data/storyteller-registry';

function registryQuote(slug: string, tier: VoiceTier, contains: string) {
  const person = getStorytellerBySlug(slug);
  if (!person || person.tier !== tier) return null;
  const quote = person.quotes.find((q) => q.status === 'approved' && q.text.includes(contains));
  return quote ? { person, quote } : null;
}

const Beat = ({ n, when, title, children }: { n: string; when: string; title: string; children: React.ReactNode }) => (
  <>
    <p className="font-display text-sm text-goods-terracotta-light">
      {n} · {when}
    </p>
    <h3 className="mt-2 font-display text-4xl font-semibold leading-[1.04] text-balance text-goods-cream md:text-5xl">{title}</h3>
    <div className="mt-5 max-w-xl text-lg leading-relaxed text-goods-cream/90 md:text-xl">{children}</div>
  </>
);

const WAYS = [
  ['Catalytic capital', 'First money in, before there was anything to point at. Going first is the part that lets the next funder say yes, and almost nobody does it.'],
  ['Relationships', 'The bed on the stage at Parliament House beside NACCHO and the Rheumatic Heart Disease Alliance. A door that money on its own cannot open.'],
  ['Philanthropy', 'Paid for the learning: the travel, the prototypes that failed, the evidence systems. None of that is a cost a community buyer should be asked to carry.'],
] as const;

export function SnowArc() {
  const funder = registryQuote('georgina-byron', 'funder', 'we can catalyse change');
  const founder = registryQuote('nicholas-marchesi', 'internal', 'passionate leadership and generosity');
  const georginaName = getStorytellerBySlug('georgina-byron')?.name ?? 'The Snow Foundation';
  // Norman Frank Jupurrurla founded Wilya Janta, the community-designed housing movement at
  // Tennant Creek that Snow backs alongside Goods. Georgina describes that house in her own
  // recording, which is where the claim comes from.
  const wilyaJanta = registryQuote('norman-frank', 'external', 'better future for our kids');
  // Dianne Stokes designed and named both products. Pakkimjalki Kari is her Warumungu name for
  // the washing machine, and the machine is the clearest thing Snow's money turned into.
  // The two Elders in the photograph with Georgina and Sally, named by Ben on 16 September:
  // Annie Morrison is the one wearing glasses, Patricia Frank is the other.
  const patricia = registryQuote('patricia-frank', 'external', 'wash their blanket');
  const annie = registryQuote('annie-morrison', 'external', 'important for the old people');
  const patriciaName = getStorytellerBySlug('patricia-frank')?.name ?? '';
  const annieName = getStorytellerBySlug('annie-morrison')?.name ?? '';

  const steps: FilmStep[] = [
    {
      id: 'snow-idea',
      body: (
        <>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Image src="/images/partners/snow-foundation-white.png" alt="Snow Foundation" width={2194} height={1056} className="h-8 w-auto" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">Who backed the experiment</p>
          </div>
          <div className="mt-8">
            <Beat n="01" when="2016 to 2023" title="An idea">
              <p>
                It starts at the back of a room in 2016, hearing Dr Boe Remenyi explain that a washing machine and
                reliable hot water are health hardware. Seven years later the question had become a bed, and Snow paid
                the first invoice with nothing to show them but that question.
              </p>
            </Beat>
          </div>
        </>
      ),
      image: {
        src: '/images/media-pack/goods-early-2023-community.jpg',
        alt: 'Two Elders sitting at a camp beside a tent with bedding on the ground, and Nic Marchesi standing, listening',
        place: 'Listening at camp, 2023. No product, no register, no charity.',
      },
    },
    {
      id: 'snow-program',
      body: (
        <Beat n="02" when="2024" title="A program">
          <p>
            A place in AMP&rsquo;s Tomorrow Makers Spark, and Snow invoices arriving through the years the bed went from
            its first version to its fourth. Ten invoices in all, the most recent in May 2026.
          </p>
        </Beat>
      ),
    },
    {
      id: 'snow-on-country',
      body: (
        <>
          <Beat n="03" when="April 2025" title="On Country">
            <p>
              Snow came to Tennant Creek and spent the days where the beds go. Not a site visit with a
              schedule, days of sitting down with the people whose houses these are.
            </p>
          </Beat>
          {annie && (
            <figure className="m-0 mt-6 border-l-2 border-goods-terracotta pl-5">
              <blockquote className="text-[17px] leading-relaxed text-goods-cream/90">
                &ldquo;{annie.quote.text}&rdquo;
              </blockquote>
              <figcaption className="mt-2 text-sm text-goods-cream/65">
                {annie.person.name} · {annie.person.community}
              </figcaption>
            </figure>
          )}
        </>
      ),
      ...(patricia
        ? {
            voice: {
              portrait: patricia.person.portrait ?? undefined,
              name: patricia.person.name,
              role: patricia.person.role,
              community: patricia.person.community,
              quote: patricia.quote.text,
            },
          }
        : {}),
      image: {
        src: '/images/media-pack/sally-georgina-tennant-creek-jul-2025.jpg',
        alt: `${georginaName}, Sally Grimsley-Ballard, ${patriciaName} and ${annieName} standing together on red dirt at Tennant Creek`,
        place: `${georginaName} and Sally Grimsley-Ballard with ${patriciaName} and ${annieName}, Warumungu Country.`,
      },
    },
    {
      id: 'snow-wilya-janta',
      body: (
        <Beat n="04" when="Tennant Creek" title="Wilya Janta">
          <p>
            Snow backs Wilya Janta as well, the community-designed housing movement at Tennant Creek,
            including a solar-powered house drawn by the people who will live in it. The same funder,
            the same place, a different part of the same problem.
          </p>
        </Beat>
      ),
      ...(wilyaJanta
        ? {
            voice: {
              portrait: wilyaJanta.person.portrait ?? undefined,
              name: wilyaJanta.person.name,
              role: wilyaJanta.person.role,
              community: wilyaJanta.person.community,
              quote: wilyaJanta.quote.text,
            },
          }
        : {}),
    },
    {
      id: 'snow-factory',
      body: (
        <Beat n="05" when="September 2025" title="A factory">
          <p>
            A room at The Funding Network&rsquo;s Healthy People Healthy Planet event paid for the
            on-Country production plant. The money came from the people in that room on one night,
            with Bupa matching what they gave, which is why it arrived in two payments.
          </p>
        </Beat>
      ),
      image: {
        src: '/images/process/factory-panorama.jpg',
        alt: 'The containerised on-Country production plant, with the press and router inside',
        place: 'The plant the room paid for.',
      },
    },
    {
      id: 'snow-project',
      body: (
        <Beat n="06" when="2025" title="A project">
          <p>
            Beds and washing machines in houses at Tennant Creek, Palm Island, Maningrida and Utopia. Vincent Fairfax
            with FRRR funded the Palm Island youth pilot and acquitted it in March 2026.
          </p>
        </Beat>
      ),
      image: {
        src: '/images/media-pack/parliament-house-event-mar-2025.jpg',
        alt: 'A panel on stage at Parliament House with Snow Foundation, NACCHO and RHD Alliance logos behind them, and a Goods Stretch Bed on the stage',
        place: 'Parliament House. The bed is on the stage, bottom right.',
      },
    },
    {
      id: 'snow-charity',
      body: (
        <Beat n="07" when="2026" title="A 100% Indigenous not-for-profit">
          <p>
            The products, the making and the sales moved into the charity under an Indigenous board. A Curious Tractor
            keeps the research and development.
          </p>
          <p className="mt-5 text-[15px] leading-snug text-goods-cream/75">
            {ORGANISATION.legalName}. {ORGANISATION.identityLine} {ORGANISATION.charityLine}
          </p>
          <p className="mt-2 text-[15px] font-semibold leading-snug text-goods-terracotta-light">{ORGANISATION.boardLine}</p>
        </Beat>
      ),
    },
    ...(funder
      ? [
          {
            id: 'snow-voice',
            body: (
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">
                The funder, in her own words
              </p>
            ),
            voice: {
              name: funder.person.name,
              role: funder.person.role,
              community: funder.person.community,
              quote: funder.quote.text,
            },
            image: {
              src: '/images/media-pack/sally-georgina-tennant-creek-jul-2025.jpg',
              alt: `${georginaName} and Sally Grimsley-Ballard of the Snow Foundation standing on red dirt with two Elders at Tennant Creek`,
              place: `${georginaName} and Sally Grimsley-Ballard on Warumungu Country.`,
            },
          } satisfies FilmStep,
        ]
      : []),
    {
      id: 'snow-ways',
      body: (
        <>
          {founder && (
            <figure className="m-0 mb-10">
              <blockquote className="font-display text-2xl leading-snug text-balance text-goods-cream md:text-3xl">
                &ldquo;{founder.quote.text}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-sm text-goods-cream/70">
                {founder.person.name} · {founder.person.role}
              </figcaption>
            </figure>
          )}
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">
            The three things philanthropy gave that a customer could not
          </p>
          <dl className="mt-5 space-y-5">
            {WAYS.map(([title, body]) => (
              <div key={title}>
                <dt className="font-display text-xl font-semibold text-goods-cream">{title}</dt>
                <dd className="mt-1 text-[16px] leading-relaxed text-goods-cream/85">{body}</dd>
              </div>
            ))}
          </dl>
        </>
      ),
    },
  ];

  return (
    <StickyFilm
      src="/video/tennant-creek/tingkkarli-drone.mp4"
      poster="/video/tennant-creek/tingkkarli-drone-poster.jpg"
      alt="Tingkkarli, Lake Mary Ann, north of Tennant Creek, at sunset from the air"
      credit="Tingkkarli / Lake Mary Ann, Tennant Creek. 3 April 2025."
      steps={steps}
      scrim="heavy"
    />
  );
}
