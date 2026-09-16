/**
 * An idea, a program, a project, and now a 100% Indigenous not-for-profit. Plus the kinds of
 * support that moved it along, and the funder who was there for all four.
 *
 * Ben, 16 September 2026: run the Tennant Creek drone full bleed, show the movement from an
 * idea and a program to a project to the not-for-profit, name the different ways philanthropy
 * supports us, and do NOT embed the full recording here. A quote and an image.
 *
 * The film behind it is Tingkkarli / Lake Mary Ann, five kilometres north of Tennant Creek, cut
 * from the 3 April 2025 trip. Country with nobody in frame, and a publicly promoted recreation
 * lake, so it carries no consent question of its own.
 *
 * NO DOLLAR FIGURES, same ruling as the rest of the funder surfaces. The argument is that Snow
 * went first and then stayed. The size of the cheque is a different subject.
 *
 * Entity facts come from ORGANISATION so this can never disagree with the footer, /who-we-are
 * or /terms. The photograph is `public` in content_items, checked 16 September 2026, and its
 * caption names Georgina on the left and Sally on the right, which is the order Ben confirmed
 * from a face crop the same day.
 */

import Image from 'next/image';
import { ORGANISATION } from '@/lib/data/organisation';
import { LoopTile } from '@/components/pitch/loop-tile';
import { getStorytellerBySlug, type VoiceTier } from '@/lib/data/storyteller-registry';

/**
 * Names and words come out of the registry. Nothing here is typed by hand.
 * check-storyteller-registry.mjs fails the build on a non-external name appearing
 * literally in a rendered surface, which is how the first draft of this component
 * was caught. Reading by slug keeps the consent record as the only source, so
 * retiring a quote there retires it here.
 */
function registryQuote(slug: string, tier: VoiceTier, contains: string) {
  const person = getStorytellerBySlug(slug);
  if (!person || person.tier !== tier) return null;
  const quote = person.quotes.find((q) => q.status === 'approved' && q.text.includes(contains));
  return quote ? { person, quote } : null;
}

const MOVEMENT = [
  {
    n: '01',
    when: '2016 to 2023',
    title: 'An idea',
    body: 'It starts at the back of a room in 2016, hearing Dr Boe Remenyi explain that a washing machine and reliable hot water are health hardware. Seven years later the question had become a bed, and Snow paid the first invoice with nothing to show them but that question.',
  },
  {
    n: '02',
    when: '2024',
    title: 'A program',
    body: 'A place in AMP’s Tomorrow Makers Spark, and Snow invoices arriving through the years the bed went from its first version to its fourth.',
  },
  {
    n: '03',
    when: '2025',
    title: 'A project',
    body: 'Beds and washing machines in houses at Tennant Creek, Palm Island, Maningrida and Utopia. Vincent Fairfax with FRRR funded the Palm Island youth pilot and acquitted it in March 2026.',
  },
  {
    n: '04',
    when: '2026',
    title: 'A 100% Indigenous not-for-profit',
    body: 'The products, the making and the sales moved into the charity under an Indigenous board. A Curious Tractor keeps the research and development.',
  },
] as const;

const WAYS = [
  {
    title: 'Catalytic capital',
    body: 'First money in, before there was anything to point at. Going first is the part that lets the next funder say yes, and it is the part almost nobody does.',
  },
  {
    title: 'Relationships',
    body: 'The bed on the stage at Parliament House beside NACCHO and the Rheumatic Heart Disease Alliance. A door that money on its own cannot open.',
  },
  {
    title: 'Philanthropy',
    body: 'Paid for the learning: the travel, the prototypes that failed, the evidence systems. None of that is a cost a community buyer should be asked to carry.',
  },
] as const;

export function SnowArc() {
  // The funder's account of her own job, and the co-founder's account of what it did.
  const funder = registryQuote('georgina-byron', 'funder', 'we can catalyse change');
  // Her name for the photograph comes from the registry too, so the caption cannot outlive
  // the record. Sally is not a registry voice, so no tier gate applies to her.
  const georginaName = getStorytellerBySlug('georgina-byron')?.name ?? 'The Snow Foundation';
  const founder = registryQuote('nicholas-marchesi', 'internal', 'passionate leadership and generosity');

  return (
    <div className="relative mt-16 overflow-hidden rounded-[22px]">
      <LoopTile
        src="/video/tennant-creek/tingkkarli-drone.mp4"
        poster="/video/tennant-creek/tingkkarli-drone-poster.jpg"
        still="/video/tennant-creek/tingkkarli-drone-poster.jpg"
        alt="Tingkkarli, Lake Mary Ann, north of Tennant Creek, at sunset from the air"
        className="absolute inset-0 opacity-45"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-goods-ink/85 via-goods-ink/75 to-goods-ink/90" />

      <div className="relative px-6 py-14 md:px-10 md:py-16">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Image
            src="/images/partners/snow-foundation-white.png"
            alt="Snow Foundation"
            width={2194}
            height={1056}
            className="h-8 w-auto"
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">
            Who backed the experiment
          </p>
        </div>

        <h3 className="mt-5 max-w-3xl font-display text-3xl font-semibold leading-tight text-balance text-goods-cream md:text-4xl">
          Snow paid the first invoice in October 2023, and the tenth in May 2026.
        </h3>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-goods-cream/85">
          Ten invoices across three years, through the part where there was nothing to show. They
          were there for the studio, and they are here for the charity.
        </p>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {MOVEMENT.map((m, i) => (
            <li key={m.n} className="relative border-t border-goods-cream/25 pt-5">
              <p className="font-display text-sm text-goods-terracotta-light">
                {m.n} · {m.when}
              </p>
              <p className="mt-1 font-display text-xl font-semibold leading-tight text-goods-cream">{m.title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-goods-cream/80">{m.body}</p>
              {i === MOVEMENT.length - 1 && (
                <p className="mt-3 text-[13px] leading-snug text-goods-terracotta-light">
                  {ORGANISATION.legalName}. {ORGANISATION.boardLine}
                </p>
              )}
              {i < MOVEMENT.length - 1 && (
                <span className="absolute -right-4 top-4 hidden text-goods-cream/40 lg:block" aria-hidden="true">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-8 md:grid-cols-12 md:items-center">
          <figure className="m-0 md:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-goods-cream/10">
              <Image
                src="/images/media-pack/sally-georgina-tennant-creek-jul-2025.jpg"
                alt={`${georginaName} and Sally Grimsley-Ballard of the Snow Foundation standing on red dirt with two Elders at Tennant Creek`}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-[12px] leading-snug text-goods-cream/60">
              {georginaName} and Sally Grimsley-Ballard on Warumungu Country, Tennant Creek.
            </figcaption>
          </figure>
          <div className="md:col-span-7">
            {funder && (
              <figure className="m-0">
                <blockquote className="font-display text-2xl leading-snug text-balance text-goods-cream md:text-3xl">
                  &ldquo;{funder.quote.text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-goods-cream/60">
                  {funder.person.name} · {funder.person.role}
                </figcaption>
              </figure>
            )}
            {founder && (
              <figure className="m-0 mt-8 border-t border-goods-cream/20 pt-6">
                <blockquote className="text-[17px] leading-relaxed text-goods-cream/85">
                  &ldquo;{founder.quote.text}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-sm text-goods-cream/60">
                  {founder.person.name} · {founder.person.role}
                </figcaption>
              </figure>
            )}
          </div>
        </div>

        <div className="mt-14 border-t border-goods-cream/25 pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">
            The three things philanthropy gave that a customer could not
          </p>
          <dl className="mt-6 grid gap-8 md:grid-cols-3">
            {WAYS.map((w) => (
              <div key={w.title}>
                <dt className="font-display text-xl font-semibold text-goods-cream">{w.title}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-goods-cream/80">{w.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
