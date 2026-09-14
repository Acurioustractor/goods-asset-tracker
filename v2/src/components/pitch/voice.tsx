/**
 * A cleared voice, resolved through the storyteller registry at render time. Only `external`
 * tier prints; a primary quote is preferred, then an approved one. Quotes render verbatim, never
 * trimmed. A portrait appears only when the registry holds one; a voice-only storyteller gets
 * the rule instead of an invented face. Same discipline as /pitch/road.
 */

import Image from 'next/image';
import type { DeckSlide } from '@/lib/data/deck';
import { getStoryteller, type RegistryQuote, type StorytellerRecord } from '@/lib/data/storyteller-registry';

export function leadVoice(slide: Pick<DeckSlide, 'voiceNames' | 'voiceQuoteContext'>): { person: StorytellerRecord; quote: RegistryQuote } | null {
  for (const name of slide.voiceNames ?? []) {
    const person = getStoryteller(name);
    if (!person || person.tier !== 'external') continue;
    const quote =
      (slide.voiceQuoteContext
        ? person.quotes.find((q) => q.context === slide.voiceQuoteContext && (q.status === 'primary' || q.status === 'approved'))
        : undefined) ??
      person.quotes.find((q) => q.status === 'primary') ??
      person.quotes.find((q) => q.status === 'approved');
    if (quote) return { person, quote };
  }
  return null;
}

export function Voice({ person, quote, dark = false, large = false }: { person: StorytellerRecord; quote: RegistryQuote; dark?: boolean; large?: boolean }) {
  return (
    <figure className={`grid gap-5 ${person.portrait ? 'sm:grid-cols-[auto_1fr] sm:items-center' : ''}`}>
      {person.portrait && (
        <Image src={person.portrait} alt={person.name} width={240} height={240} className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24" />
      )}
      <div className={person.portrait ? '' : 'border-l-2 border-goods-terracotta pl-5'}>
        <blockquote className={`font-display leading-snug text-balance ${large ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} ${dark ? 'text-goods-cream' : 'text-goods-ink'}`}>
          “{quote.text}”
        </blockquote>
        <figcaption className={`mt-3 text-sm ${dark ? 'text-goods-cream/60' : 'text-[#7a7363]'}`}>
          {person.name} · {person.role} · {person.community}
        </figcaption>
      </div>
    </figure>
  );
}
