/**
 * A funder inside the road, at the stop their money paid for.
 *
 * Deliberately NOT the community `Voice` component. That one gates on tier `external` and
 * prints "name · role · community", which would file a funder among the people Goods serves.
 * Georgina Byron's registry record says never to do that. This path gates on tier `funder`
 * and labels the organisation, so the two can never be confused by a reader or by a future
 * edit.
 *
 * Default-deny in the same shape as Voice: an unknown slug, a wrong tier, or a quote that is
 * not `approved` renders nothing. There is no fallback to something publishable.
 */

import Image from 'next/image';
import { getStorytellerBySlug } from '@/lib/data/storyteller-registry';
import { grantLineFor, type FunderMoment } from '@/lib/data/funder-moments';
import { Voice } from '@/components/pitch/voice';

function funderQuote(moment: FunderMoment) {
  if (!moment.voice) return null;
  const person = getStorytellerBySlug(moment.voice.slug);
  if (!person || person.tier !== 'funder') return null;
  const quote = person.quotes.find(
    (q) => q.status === 'approved' && q.text.includes(moment.voice!.quoteContains),
  );
  return quote ? { person, quote } : null;
}

/**
 * The community voice a grant produced. Tier `external` only, the mirror of the funder
 * check above, so the two paths can never be crossed in either direction. A `primary`
 * quote counts here as well as an `approved` one, matching leadVoice().
 */
function producedVoice(moment: FunderMoment) {
  if (!moment.producedVoice) return null;
  const person = getStorytellerBySlug(moment.producedVoice.slug);
  if (!person || person.tier !== 'external') return null;
  const quote = person.quotes.find(
    (q) => (q.status === 'primary' || q.status === 'approved') && q.text.includes(moment.producedVoice!.quoteContains),
  );
  return quote ? { person, quote } : null;
}

export function FunderMomentBlock({ moment }: { moment: FunderMoment }) {
  // The grant line is read only for what it BOUGHT. Ben, 2026-09-16: no dollar
  // figures on the funder surfaces. An amount invites a new funder to anchor on
  // it, and it turns a record of trust into a league table.
  const grant = grantLineFor(moment);
  const voice = funderQuote(moment);
  const produced = producedVoice(moment);

  return (
    <aside
      aria-label={`${moment.label} at ${moment.place}`}
      className="mt-10 rounded-[18px] border border-[#e6dfd1] bg-goods-sand/40 p-6 md:p-8"
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Image
          src={moment.logo.src}
          alt={moment.label}
          width={moment.logo.width}
          height={moment.logo.height}
          className="h-9 w-auto"
        />
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">
          {moment.when} · {moment.place}
        </p>
      </div>

      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#4a4741]">{moment.line}</p>

      {moment.photo && (
        <figure className="m-0 mt-6">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[14px] bg-goods-sand">
            <Image
              src={moment.photo.src}
              alt={moment.photo.alt}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-2 text-[13px] leading-snug text-[#5d574c]">
            {moment.photo.caption}
          </figcaption>
        </figure>
      )}

      {voice && (
        <figure className="m-0 mt-7 border-l-2 border-goods-terracotta pl-5">
          <blockquote className="font-display text-xl leading-snug text-balance text-goods-ink md:text-2xl">
            &ldquo;{voice.quote.text}&rdquo;
          </blockquote>
          <figcaption className="mt-3 text-sm text-[#7a7363]">
            {voice.person.name} · {voice.person.role}
          </figcaption>
        </figure>
      )}

      {produced && (
        <div className="mt-7 border-t border-[#e6dfd1] pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">
            And the person it produced
          </p>
          <div className="mt-4">
            <Voice person={produced.person} quote={produced.quote} />
          </div>
        </div>
      )}

      {grant?.bought && (
        <p className="mt-7 border-t border-[#e6dfd1] pt-4 text-[13px] leading-snug text-[#5d574c]">
          <span className="font-semibold text-goods-ink">What it paid for.</span> {grant.bought}
        </p>
      )}

      {moment.link && (
        <p className="mt-4 text-[13px] leading-snug">
          <a
            href={moment.link.href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-goods-terracotta underline-offset-2 hover:text-goods-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta"
          >
            {moment.link.label}
          </a>
        </p>
      )}
    </aside>
  );
}
