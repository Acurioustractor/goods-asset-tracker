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

const aud = (n: number) => `$${n.toLocaleString('en-AU')}`;

function funderQuote(moment: FunderMoment) {
  if (!moment.voice) return null;
  const person = getStorytellerBySlug(moment.voice.slug);
  if (!person || person.tier !== 'funder') return null;
  const quote = person.quotes.find(
    (q) => q.status === 'approved' && q.text.includes(moment.voice!.quoteContains),
  );
  return quote ? { person, quote } : null;
}

export function FunderMomentBlock({ moment }: { moment: FunderMoment }) {
  const grant = grantLineFor(moment);
  const voice = funderQuote(moment);

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

      {grant && (
        <p className="mt-7 border-t border-[#e6dfd1] pt-4 text-[13px] leading-snug text-[#5d574c]">
          <span className="font-semibold text-goods-ink">{aud(grant.amountAud)}</span> received,{' '}
          {grant.when.toLowerCase()}. {grant.source.charAt(0).toUpperCase() + grant.source.slice(1)}.
        </p>
      )}
    </aside>
  );
}
