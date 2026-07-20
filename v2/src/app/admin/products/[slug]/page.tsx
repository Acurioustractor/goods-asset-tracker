import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductWiki } from '@/lib/data/product-wiki';
import { createServiceClient } from '@/lib/supabase/server';
import { getMediaLinksFor } from '@/lib/data/media-links';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_TONE: Record<string, string> = {
  flagship: 'bg-primary text-primary-foreground',
  prototype: 'bg-[#4E8F88] text-white',
  'open-source': 'bg-amber-200 text-amber-900',
  plant: 'bg-[#5C7048] text-white',
};

export default async function ProductWikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProductWiki(slug);
  if (!p) notFound();

  // Live media tagged to this product in the Media Room, merged with the
  // authored media (deduped by src). Tag a photo/video to this product in the
  // Media Room and it appears here.
  const supabase = createServiceClient();
  const tagged = await getMediaLinksFor(supabase, 'product', slug);
  const authoredSrcs = new Set(p.media.map((m) => m.src));
  const taggedMedia = tagged
    .filter((t) => !authoredSrcs.has(t.src))
    .map((t) => ({ type: t.type, src: t.src, poster: t.poster, caption: t.caption }));
  const allMedia = [...p.media, ...taggedMedia];

  return (
    <div className="max-w-[1100px] mx-auto pb-16">
      {/* Back + status */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Products &amp; Plant
        </Link>
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${STATUS_TONE[p.status]}`}>{p.statusLabel}</span>
      </div>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden border mb-6" style={{ aspectRatio: '16 / 7' }}>
        {p.hero.video ? (
          <video autoPlay muted loop playsInline poster={p.hero.poster} className="absolute inset-0 h-full w-full object-cover">
            <source src={p.hero.video} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.hero.image} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,17,12,0.9) 0%, rgba(20,17,12,0.25) 45%, rgba(20,17,12,0) 70%)' }} />
        <div className="absolute bottom-0 left-0 p-7">
          <p className="text-[13px] font-semibold text-white/70 mb-1">{p.eyebrow}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>{p.name}</h1>
          <p className="mt-2 max-w-2xl text-white/85 text-[15px] leading-snug">{p.tagline}</p>
        </div>
      </div>

      {/* Jump bar */}
      <div className="sticky top-0 z-20 -mx-2 mb-6 flex flex-wrap gap-2 bg-background/90 backdrop-blur px-2 py-2 rounded-xl">
        {p.jumpSections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40">{s.label}</a>
        ))}
      </div>

      {/* Intro */}
      <div className="max-w-3xl space-y-3 mb-10">
        {p.intro.map((para, i) => (
          <p key={i} className={i === 0 ? 'text-lg leading-relaxed text-foreground' : 'text-[15px] leading-relaxed text-muted-foreground'}>{para}</p>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-14">
        {p.sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className={s.image || s.video ? '' : 'md:col-span-2 max-w-3xl'}>
              <h2 className="font-display text-2xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>{s.title}</h2>
              <div className="space-y-3">
                {s.body.map((para, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">{para}</p>
                ))}
              </div>
              {s.pullQuote && (
                <blockquote className="mt-5 border-l-2 border-primary pl-4">
                  <p className="font-display text-xl italic leading-snug" style={{ fontFamily: 'Georgia, serif' }}>&ldquo;{s.pullQuote.text}&rdquo;</p>
                  <cite className="mt-1 block text-xs not-italic text-muted-foreground">{s.pullQuote.who}</cite>
                </blockquote>
              )}
            </div>
            {(s.image || s.video) && (
              <div className="relative rounded-2xl overflow-hidden border" style={{ aspectRatio: '4 / 3' }}>
                {s.video ? (
                  <VideoTile src={s.video} poster={s.videoPoster} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
                )}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Specs */}
      {p.specs && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>Specs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {p.specs.map((sp) => (
              <div key={sp.label} className="rounded-xl border bg-card px-4 py-3">
                <div className="font-display text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{sp.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{sp.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Materials */}
      {p.materials && (
        <section id="materials" className="mt-14 scroll-mt-16">
          <h2 className="font-display text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>Materials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {p.materials.map((m) => (
              <div key={m.name} className="flex gap-4 rounded-2xl border bg-card p-4">
                {m.image && (
                  <div className="relative shrink-0 rounded-lg overflow-hidden" style={{ width: 88, height: 88 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.image} alt={m.name} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-muted-foreground leading-snug mt-0.5">{m.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Media */}
      <section id="media" className="mt-14 scroll-mt-16">
        <h2 className="font-display text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>Media</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allMedia.map((m, i) => (
            <figure key={m.src + i} className="relative rounded-xl overflow-hidden border" style={{ aspectRatio: '4 / 3' }}>
              {m.type === 'video' ? (
                <VideoTile src={m.src} poster={m.poster} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.src} alt={m.caption} className="absolute inset-0 h-full w-full object-cover" />
              )}
              <figcaption className="absolute bottom-0 left-0 right-0 px-2.5 py-1.5 text-[11px] text-white bg-gradient-to-t from-black/70 to-transparent">{m.caption}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {taggedMedia.length > 0
            ? `${taggedMedia.length} item${taggedMedia.length === 1 ? '' : 's'} tagged to this product in the Media Room, shown alongside the curated set.`
            : 'Media flows from the Media Room. Tag a photo or video to this product there and it appears here.'}
        </p>
      </section>

      {/* Voices */}
      {p.voices && (
        <section id="voices" className="mt-14 scroll-mt-16">
          <h2 className="font-display text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>Voices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {p.voices.map((v) => (
              <div key={v.name} className="rounded-2xl border bg-card p-4">
                <div className="font-semibold">{v.name}</div>
                <div className="text-xs text-muted-foreground">{v.role}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-snug">{v.note}</p>
              </div>
            ))}
          </div>
          <Link href="/admin/voice-impact" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Cleared quotes render from the Voice Impact model <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      )}

      {/* Costs */}
      {p.cost && (
        <section id="costs" className="mt-14 scroll-mt-16 rounded-2xl border bg-card p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Costs</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">{p.cost.line}</p>
          </div>
          <Link href={p.cost.href} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Open the Cost Story</Link>
        </section>
      )}

      {/* Knowledge sources */}
      <section className="mt-12 rounded-2xl bg-muted/50 p-5">
        <div className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mb-2">This page draws from</div>
        <div className="flex flex-wrap gap-2">
          {p.knowledgeSources.map((k) => (
            <span key={k} className="rounded-lg border bg-card px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{k}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

function VideoTile({ src, poster }: { src: string; poster?: string }) {
  return (
    <div className="group absolute inset-0">
      <video muted loop playsInline poster={poster} controls className="absolute inset-0 h-full w-full object-cover">
        <source src={src} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60">
        <Play className="h-3.5 w-3.5 text-white" />
      </div>
    </div>
  );
}
