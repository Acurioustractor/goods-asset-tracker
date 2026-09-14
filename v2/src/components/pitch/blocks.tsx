/**
 * The building blocks of the pitch: a section with a number and a title, a run of lines, a
 * photograph with its place, a status chip for words that are not yet Ben's. Server components;
 * words come from the data modules, never from here.
 */

import Image from 'next/image';
import type { StoryChapter, StoryPhoto } from '@/lib/data/story-spine';

export function Photo({ photo, sizes = '(min-width: 1024px) 50vw, 100vw', priority = false, aspect = 'aspect-[4/3]' }: { photo: StoryPhoto; sizes?: string; priority?: boolean; aspect?: string }) {
  return (
    <figure className="m-0">
      <div className={`relative ${aspect} overflow-hidden rounded-[18px] bg-goods-sand`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      <figcaption className="mt-2 text-sm text-[#7a7363]">{photo.place}</figcaption>
    </figure>
  );
}

export function Status({ c }: { c: StoryChapter }) {
  if (c.status === 'settled' && !c.open) return null;
  return (
    <p className="mt-8 max-w-2xl rounded-xl border border-dashed border-[#c18a7b] bg-[#fbf3ee] px-4 py-3 text-sm text-[#7a4a3c]">
      {c.status === 'draft' ? 'Draft words. ' : ''}
      {c.open}
    </p>
  );
}

export function SectionHead({ number, title, dark = false }: { number?: number | string; title: string; dark?: boolean }) {
  return (
    <div className="max-w-4xl">
      {number !== undefined && <p className={`font-display text-2xl ${dark ? 'text-goods-terracotta-light' : 'text-goods-terracotta'}`}>{number}</p>}
      <h2 className={`mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.01em] text-balance md:text-6xl ${dark ? 'text-goods-cream' : 'text-goods-ink'}`}>{title}</h2>
    </div>
  );
}

export function Lines({ lines, dark = false, className = '' }: { lines: readonly string[]; dark?: boolean; className?: string }) {
  return (
    <div className={`space-y-4 text-lg leading-relaxed md:text-xl ${dark ? 'text-goods-cream/85' : 'text-[#4a4741]'} ${className}`}>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

export function Section({ id, number, title, children, dark = false, tight = false }: { id: string; number?: number | string; title: string; children?: React.ReactNode; dark?: boolean; tight?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-28 border-t px-6 md:px-10 lg:px-14 ${tight ? 'py-14 md:py-20' : 'py-20 md:py-28'} ${dark ? 'border-transparent bg-goods-ink' : 'border-[#e6dfd1] bg-goods-cream'}`}>
      <div className="mx-auto max-w-6xl">
        <SectionHead number={number} title={title} dark={dark} />
        {children}
      </div>
    </section>
  );
}

export function Band({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`border-t px-6 py-10 md:px-10 lg:px-14 ${dark ? 'border-transparent bg-goods-ink text-goods-cream' : 'border-[#e6dfd1] bg-goods-cream-muted text-goods-ink'}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}
