/**
 * How Goods went from a studio experiment to a charity, and who paid for the middle.
 *
 * Chapter 4 already says the arc in prose: began as an experiment, now a DGR1 charity with
 * a 100% Indigenous board. This shows it, and names the funder who was there for the whole
 * of it. Ben, 16 September 2026: make the Snow section better, align photo and video after
 * the ACT part, show how we went from ACT to the charity.
 *
 * NO DOLLAR FIGURES, same ruling as the rest of the funder surfaces. The argument is that
 * Snow went first and then stayed. The size of the cheque is a different subject.
 *
 * Entity facts come from ORGANISATION so this can never disagree with the footer, /who-we-are
 * or /terms. Photos are `public` in content_items, checked 16 September 2026. The film renders
 * only while its registry entry is `cleared`, so pulling consent in descript-videos.ts pulls it
 * off the page too.
 */

import Image from 'next/image';
import { ORGANISATION } from '@/lib/data/organisation';
import { DESCRIPT_VIDEOS, descriptEmbedUrl } from '@/lib/data/descript-videos';

const GEORGINA_FILM = 'QOpJepwNzo9';

const STEPS = [
  {
    n: '01',
    when: '2023',
    title: 'A project inside the studio',
    body: 'Goods was a question A Curious Tractor was asking on other people’s country: what would a bed have to survive here. Snow paid the first invoice in October, with nothing to show them but the question.',
    photo: {
      src: '/images/media-pack/goods-early-2023-community.jpg',
      alt: 'Two Elders sitting at a camp beside a tent with bedding on the ground, and Nic Marchesi standing, listening',
      caption: 'Listening at camp, 2023. No product, no register, no charity.',
    },
  },
  {
    n: '02',
    when: '2025',
    title: 'In the room where the policy is',
    body: 'Snow put the bed on the stage at Parliament House alongside NACCHO and the Rheumatic Heart Disease Alliance, and framed it as health hardware. A funder can open a door that money cannot.',
    photo: {
      src: '/images/media-pack/parliament-house-event-mar-2025.jpg',
      alt: 'A panel on stage at Parliament House with Snow Foundation, NACCHO and RHD Alliance logos behind them, and a Goods Stretch Bed on the stage',
      caption: 'Parliament House. The bed is on the stage, bottom right.',
    },
  },
  {
    n: '03',
    when: '2026',
    title: 'Into the charity',
    body: 'The products, the making and the sales moved into the charity under an Indigenous board. A Curious Tractor keeps the research and development. The bet Snow made on a studio now sits with an organisation that outlasts it.',
    photo: null,
  },
] as const;

export function SnowArc() {
  const film = DESCRIPT_VIDEOS.find((v) => v.viewId === GEORGINA_FILM && v.cleared);

  return (
    <div className="mt-16 border-t border-goods-cream/20 pt-12">
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
        Ten invoices across three years, through the part where there was nothing to show. They were
        there for the studio, and they are here for the charity.
      </p>

      <ol className="mt-10 grid gap-8 md:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.n} className="flex flex-col">
            {s.photo ? (
              <figure className="m-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-goods-cream/10">
                  <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="mt-2 text-[12px] leading-snug text-goods-cream/60">{s.photo.caption}</figcaption>
              </figure>
            ) : (
              <div className="rounded-[14px] border border-goods-cream/20 bg-goods-cream/5 p-5 aspect-[4/3] flex flex-col justify-center">
                <p className="font-display text-xl font-semibold leading-tight text-goods-cream">{ORGANISATION.legalName}</p>
                <p className="mt-2 text-[13px] leading-snug text-goods-cream/70">{ORGANISATION.identityLine}</p>
                <p className="mt-3 text-[13px] leading-snug text-goods-cream/70">{ORGANISATION.charityLine}</p>
                <p className="mt-3 text-[13px] font-semibold leading-snug text-goods-terracotta-light">{ORGANISATION.boardLine}</p>
              </div>
            )}
            <p className="mt-4 font-display text-sm text-goods-terracotta-light">
              {s.n} · {s.when}
            </p>
            <p className="mt-1 font-display text-xl font-semibold leading-tight text-goods-cream">{s.title}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-goods-cream/80">{s.body}</p>
          </li>
        ))}
      </ol>

      {film && (
        <div className="mt-12 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <div className="relative overflow-hidden rounded-[14px] bg-goods-cream/10" style={{ aspectRatio: '16 / 9' }}>
              <iframe
                src={descriptEmbedUrl(film.viewId)}
                title={film.title}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                loading="lazy"
              />
            </div>
          </div>
          <div className="md:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">
              The funder, in her own words
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-goods-cream/85">
              Georgina Byron AM runs the Snow Foundation. This was recorded on Warumungu Country at
              Tennant Creek, after she had spent the days seeing where the beds go.
            </p>
            <blockquote className="mt-5 border-l-2 border-goods-terracotta pl-5 font-display text-xl leading-snug text-balance text-goods-cream">
              &ldquo;I think that&rsquo;s our bit, we can catalyse change. We are not government. We are never
              gonna be into housing, but we can do our little bit and share that.&rdquo;
            </blockquote>
          </div>
        </div>
      )}
    </div>
  );
}
