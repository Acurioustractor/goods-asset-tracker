'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MediaSwapZone } from '@/components/admin/media-swap-picker';
import { communityLocations } from '@/lib/data/content';
import type { TripStory as TripStoryData, TripBlock, MediaRef, NavLink } from '@/lib/data/trip-stories';
import { tripStories } from '@/lib/data/trip-stories';
import {
  goodsBedStats, goodsBedStatsLead,
  healthFramings,
  problemStatement,
  productionPlantFacts,
} from '@/lib/data/story-atoms';

// Leaflet touches `window` at import time, so the map must be client-only.
const CommunityMap = dynamic(
  () => import('@/components/community-map').then((m) => m.CommunityMap),
  {
    ssr: false,
    loading: () => (
      <div className="ts-map-loading">Loading map…</div>
    ),
  }
);

interface Props {
  story: TripStoryData;
  /** internal = admin/preview: show consent-pending voices. Public hides them. */
  internal?: boolean;
}

function Bg({ media }: { media: MediaRef }) {
  // Always render the still image as a base layer. Video, if present and
  // loadable, sits above it. If the video fails to load, the still stays
  // visible — no jarring black flash, no spinner. This is the right
  // pattern for hero sections that prefer motion but never DEPEND on it.
  return (
    <div className="ts-bg">
      <Image
        src={media.image}
        alt=""
        fill
        sizes="100vw"
        className="ts-bg-img"
        priority
      />
      {media.videoDesktop && (
        <video
          className="ts-bg ts-bg-video"
          autoPlay
          muted
          loop
          playsInline
          poster={media.image}
        >
          <source src={media.videoDesktop} media="(min-width: 768px)" type="video/mp4" />
          {media.videoMobile && <source src={media.videoMobile} type="video/mp4" />}
        </video>
      )}
    </div>
  );
}

export function TripStory({ story, internal = false }: Props) {
  useEffect(() => {
    const els = document.querySelectorAll('.ts-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    const sections = document.querySelectorAll('.ts-immersive,.ts-bleedquote');
    const bio = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.1 }
    );
    sections.forEach((s) => bio.observe(s));
    return () => {
      io.disconnect();
      bio.disconnect();
    };
  }, []);

  return (
    <div className="ts-root">
      <style>{CSS}</style>
      {!story.published && (
        <div className="ts-banner">Internal preview · consent pending · not for publishing</div>
      )}

      {story.blocks.map((block, i) => (
        <BlockView key={i} block={block} blockIndex={i} internal={internal} currentSlug={story.slug} />
      ))}

      <footer className="ts-footer">
        <p>
          <strong>Goods on Country.</strong> {story.dateline}. Photos are from the trip; voices and faces
          marked consent pending are for internal use only until consent is captured per the Goods consent
          process, with family and Oonchiumpa facilitating for young people. Quotes are verbatim. Stats are
          verified against products.ts and the March 2026 compendium.
        </p>
      </footer>
    </div>
  );
}

/**
 * Renders a small list of "branch out" links beneath a block, when the
 * block has `links` set. Voice cards, stats, maps, etc. can all carry up
 * to ~2 contextual links so readers can branch without losing the read.
 */
function LinkGutter({ links }: { links?: NavLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="ts-links ts-reveal d2">
      {links.map((l, i) => {
        const external = /^https?:/.test(l.href);
        return external ? (
          <a key={i} href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label} <span aria-hidden>↗</span>
          </a>
        ) : (
          <Link key={i} href={l.href}>
            {l.label} <span aria-hidden>→</span>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Wraps a block's rendered output and tacks on a LinkGutter if the block
 * declared `links`. Centralised so every case branch doesn't have to repeat
 * the conditional.
 */
function withLinks(node: React.ReactNode, block: TripBlock): React.ReactNode {
  if (block.kind === 'portal') return node;
  const links = 'links' in block ? block.links : undefined;
  if (!links || links.length === 0) return node;
  return (
    <>
      {node}
      <LinkGutter links={links} />
    </>
  );
}

interface GalleryItem {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
  isPublic: boolean;
}

// Gallery grid with click-to-open lightbox carousel. Keyboard nav: ESC
// closes, ← → step, scroll-lock while open. Lives inside trip-story.tsx
// (which is already 'use client') to avoid an extra component file.
function GalleryWithLightbox({
  heading,
  sub,
  items,
}: {
  heading?: string;
  sub?: string;
  items: GalleryItem[];
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const close = useCallback(() => setOpenAt(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenAt((cur) => {
        if (cur === null) return cur;
        const next = (cur + dir + items.length) % items.length;
        return next;
      });
    },
    [items.length]
  );

  useEffect(() => {
    if (openAt === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openAt, close, step]);

  const active = openAt !== null ? items[openAt] : null;
  return (
    <section className="ts-gallery">
      {heading && <h2 className="ts-vh ts-reveal">{heading}</h2>}
      {sub && <p className="ts-vsub ts-reveal d1">{sub}</p>}
      <div className="ts-ggrid">
        {items.map((it, i) => (
          <button
            type="button"
            key={it.id}
            onClick={() => setOpenAt(i)}
            className="ts-gimg ts-reveal ts-gimg-btn"
            aria-label={`Open photo ${i + 1} of ${items.length}`}
          >
            <Image
              src={it.src}
              alt={it.alt || ''}
              width={800}
              height={533}
              sizes="(max-width: 720px) 100vw, 33vw"
              className="ts-gimg-img"
            />
            {it.caption && <figcaption>{it.caption}</figcaption>}
          </button>
        ))}
      </div>

      {active && (
        <div className="ts-lb" role="dialog" aria-modal="true" onClick={close}>
          <button
            type="button"
            className="ts-lb-close"
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="Close"
          >
            ×
          </button>
          <button
            type="button"
            className="ts-lb-prev"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            className="ts-lb-next"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label="Next"
          >
            ›
          </button>
          <figure className="ts-lb-fig" onClick={(e) => e.stopPropagation()}>
            <Image
              src={active.src}
              alt={active.alt || ''}
              width={2000}
              height={1333}
              sizes="100vw"
              className="ts-lb-img"
              priority
            />
            <figcaption className="ts-lb-cap">
              {active.caption || active.alt}
              <span className="ts-lb-count">
                {(openAt ?? 0) + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

function BlockView({
  block,
  blockIndex,
  internal,
  currentSlug,
}: {
  block: TripBlock;
  blockIndex: number;
  internal: boolean;
  currentSlug: string;
}) {
  const rendered = renderBlock(block, blockIndex, internal, currentSlug);
  return <>{withLinks(rendered, block)}</>;
}

function renderBlock(block: TripBlock, blockIndex: number, internal: boolean, currentSlug: string) {
  switch (block.kind) {
    case 'masthead':
      return (
        <section className="ts-immersive">
          <Bg media={block.media} />
          <div className="ts-scrim" />
          {internal && (
            <MediaSwapZone
              slug={currentSlug}
              overrideKey={`${blockIndex}.media.image`}
              currentUrl={block.media.image}
              tagQuery={['trip:may-2026']}
              kind="any"
              label="hero photo"
              position="top-right"
            />
          )}
          <div className="ts-inner">
            <div className="ts-kicker ts-reveal">{block.kicker}</div>
            <h1 className="ts-h1 ts-reveal d1">{block.title}</h1>
            <p className="ts-standfirst ts-reveal d2">{block.standfirst}</p>
            <div className="ts-dateline ts-reveal d3">{block.dateline}</div>
          </div>
        </section>
      );
    case 'immersive':
      return (
        <section className="ts-immersive">
          <Bg media={block.media} />
          <div className="ts-scrim" />
          {internal && (
            <MediaSwapZone
              slug={currentSlug}
              overrideKey={`${blockIndex}.media.image`}
              currentUrl={block.media.image}
              tagQuery={['trip:may-2026']}
              kind="photo"
              label="photo"
              position="top-right"
            />
          )}
          <div className="ts-inner">
            {block.actmark && <div className="ts-actmark ts-reveal">{block.actmark}</div>}
            <h2 className="ts-imm-title ts-reveal d1">{block.title}</h2>
            {block.standfirst && <p className="ts-standfirst ts-reveal d2">{block.standfirst}</p>}
          </div>
        </section>
      );
    case 'read':
      return (
        <section className="ts-read">
          {block.tag && <div className="ts-tag ts-reveal">{block.tag}</div>}
          {block.heading && <h2 className="ts-read-h ts-reveal d1">{block.heading}</h2>}
          {block.paragraphs.map((p, i) => (
            <p key={i} className="ts-p ts-reveal d1">
              {p}
            </p>
          ))}
          {block.pulls?.map((q, i) => (
            <blockquote key={i} className="ts-pull ts-reveal d2">
              {q.quote}
              <span className="ts-src">{q.src}</span>
            </blockquote>
          ))}
        </section>
      );
    case 'bleedquote':
      return (
        <section className="ts-bleedquote">
          <Bg media={block.media} />
          <div className="ts-scrim" />
          {internal && (
            <MediaSwapZone
              slug={currentSlug}
              overrideKey={`${blockIndex}.media.image`}
              currentUrl={block.media.image}
              tagQuery={['trip:may-2026']}
              kind="photo"
              label="photo"
              position="top-right"
            />
          )}
          <div className="ts-inner">
            <p className="ts-bleed-p ts-reveal">{block.text}</p>
          </div>
        </section>
      );
    case 'stats':
      return (
        <section className="ts-stats">
          <div className="ts-stats-lead ts-reveal">{block.lead}</div>
          <div className="ts-stats-grid">
            {block.items.map((s, i) => (
              <div key={i} className="ts-stat ts-reveal">
                <div className="ts-stat-v">{s.value}</div>
                <div className="ts-stat-l">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      );
    case 'voices': {
      const cards = internal ? block.cards : block.cards.filter((c) => c.consent === 'cleared');
      if (cards.length === 0) return null;
      return (
        <section className="ts-voices">
          <h2 className="ts-vh ts-reveal">{block.heading}</h2>
          {block.sub && <p className="ts-vsub ts-reveal d1">{block.sub}</p>}
          <div className="ts-qgrid">
            {cards.map((c, i) => {
              const linkable = c.consent === 'cleared' && c.storytellerSlug;
              const inner = (
                <>
                  <div className="ts-q">{c.quote}</div>
                  <div className="ts-a">
                    {c.who}
                    {c.community && (
                      <>
                        {' · '}
                        <b>{c.community}</b>
                      </>
                    )}
                    {linkable && <span className="ts-qcard-arrow" aria-hidden> →</span>}
                  </div>
                  <span className={`ts-tagpill ${c.consent}`}>
                    {c.consent === 'cleared' ? 'cleared voice' : 'consent pending'}
                  </span>
                </>
              );
              return linkable ? (
                <Link key={i} href={`/storytellers/${c.storytellerSlug}`} className="ts-qcard ts-qcard-link ts-reveal">
                  {inner}
                </Link>
              ) : (
                <div key={i} className="ts-qcard ts-reveal">
                  {inner}
                </div>
              );
            })}
          </div>
        </section>
      );
    }
    case 'videos': {
      // People speaking on camera: internal-only until consent is captured.
      if (!internal) return null;
      // Single video → cinematic full-bleed (90vh, video fills, text below).
      // Multiple videos → tiled grid (current behaviour, but larger tiles).
      if (block.items.length === 1) {
        const v = block.items[0];
        return (
          <section className="ts-videos ts-videos--cinema" style={{ position: 'relative' }}>
            <h2 className="ts-vh ts-reveal">{block.heading}</h2>
            {block.sub && <p className="ts-vsub ts-reveal d1">{block.sub}</p>}
            {internal && (
              <MediaSwapZone
                slug={currentSlug}
                overrideKey={`${blockIndex}.items.0.src`}
                currentUrl={v.src}
                tagQuery={['trip:may-2026']}
                kind="video"
                label="swap video"
                position="top-right"
              />
            )}
            <figure className="ts-vid ts-vid--cinema ts-reveal d2">
              <video controls preload="metadata" playsInline poster={v.poster}>
                <source src={v.src} type="video/mp4" />
              </video>
              <figcaption>
                <b>{v.title}</b>
                {v.caption}
              </figcaption>
            </figure>
          </section>
        );
      }
      return (
        <section className="ts-videos">
          <h2 className="ts-vh ts-reveal">{block.heading}</h2>
          {block.sub && <p className="ts-vsub ts-reveal d1">{block.sub}</p>}
          <div className="ts-vgrid">
            {block.items.map((v, i) => (
              <figure key={i} className="ts-vid ts-reveal">
                <video controls preload="none" playsInline poster={v.poster}>
                  <source src={v.src} type="video/mp4" />
                </video>
                <figcaption>
                  <b>{v.title}</b>
                  {v.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      );
    }
    case 'pullquote':
      // Quiet beat between sections — giant serif, centred, no media chrome.
      return (
        <section className="ts-pullquote">
          {block.kicker && <p className="ts-pq-kicker ts-reveal">{block.kicker}</p>}
          <blockquote className="ts-pq-quote ts-reveal d1">{block.quote}</blockquote>
          {block.attribution && <p className="ts-pq-attr ts-reveal d2">{block.attribution}</p>}
        </section>
      );
    case 'el-video-gallery': {
      // Video gallery sourced from EL by tag, populated by the server
      // resolver. Internal preview shows every match; public shows only
      // is_public=true. Single hit → cinematic; multiple → tiled grid.
      const items = block.items || [];
      if (items.length === 0) return null;
      if (!internal) {
        const anyPublic = items.some((it) => it.isPublic);
        if (!anyPublic) return null;
      }
      if (items.length === 1) {
        const v = items[0];
        const isPortrait = v.orientation === 'portrait';
        return (
          <section className="ts-videos ts-videos--cinema">
            {block.heading && <h2 className="ts-vh ts-reveal">{block.heading}</h2>}
            {block.sub && <p className="ts-vsub ts-reveal d1">{block.sub}</p>}
            <figure className={`ts-vid ts-vid--cinema ts-reveal d2 ${isPortrait ? 'ts-vid--portrait' : ''}`}>
              <video controls preload="metadata" playsInline poster={v.poster}>
                <source src={v.src} type="video/mp4" />
              </video>
              <figcaption>
                <b>{v.title}</b>
                {v.caption}
              </figcaption>
            </figure>
          </section>
        );
      }
      return (
        <section className="ts-videos">
          {block.heading && <h2 className="ts-vh ts-reveal">{block.heading}</h2>}
          {block.sub && <p className="ts-vsub ts-reveal d1">{block.sub}</p>}
          <div className="ts-vgrid">
            {items.map((v) => (
              <figure key={v.id} className="ts-vid ts-reveal">
                <video controls preload="none" playsInline poster={v.poster}>
                  <source src={v.src} type="video/mp4" />
                </video>
                <figcaption>
                  <b>{v.title}</b>
                  {v.caption}
                  {internal && !v.isPublic && (
                    <span className="ts-gpending" style={{ position: 'relative', marginLeft: '.5rem' }}>
                      pending consent
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      );
    }
    case 'el-gallery': {
      // Items are populated by the server resolver in resolve-gallery.ts.
      const items = block.items || [];
      if (items.length === 0) return null;
      return (
        <GalleryWithLightbox
          heading={block.heading}
          sub={block.sub}
          items={items}
        />
      );
    }
    case 'map':
      return (
        <section className="ts-mapwrap">
          <div className="ts-map-head">
            <h2 className="ts-vh ts-reveal">{block.heading}</h2>
            <p className="ts-reveal d1">{block.intro}</p>
          </div>
          <div className="ts-map ts-reveal d1">
            <CommunityMap locations={communityLocations} storytellers={[]} />
          </div>
          <p className="ts-legend ts-reveal d2">{block.caveat}</p>
        </section>
      );
    case 'pathways':
      return (
        <section className="ts-pathways">
          <h2 className="ts-vh ts-reveal">{block.heading}</h2>
          {block.sub && <p className="ts-vsub ts-reveal d1">{block.sub}</p>}
          <div className="ts-pgrid">
            {block.cards.map((c, i) => (
              <div key={i} className="ts-pcard ts-reveal">
                <div className="ts-pwho">{c.who}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
          {block.link && (
            <p className="ts-plink ts-reveal d2">
              <a href={block.link.href} target="_blank" rel="noopener noreferrer">
                {block.link.label}
              </a>
            </p>
          )}
        </section>
      );
    case 'close':
      return (
        <section className="ts-immersive ts-center">
          <Bg media={block.media} />
          <div className="ts-scrim" />
          {internal && (
            <MediaSwapZone
              slug={currentSlug}
              overrideKey={`${blockIndex}.media.image`}
              currentUrl={block.media.image}
              tagQuery={['trip:may-2026']}
              kind="photo"
              label="close photo"
              position="top-right"
            />
          )}
          <div className="ts-inner">
            <h2 className="ts-imm-title ts-reveal" style={{ margin: '0 auto', maxWidth: '24ch' }}>
              {block.title}
            </h2>
          </div>
        </section>
      );
    // ─── Atom blocks ─────────────────────────────────────────────────
    // Each one shares the same visual shape as an existing block kind
    // (stats, read, map) but sources its content from story-atoms.ts so
    // every field-notes story stays in sync without copy duplication.
    case 'goods-facts':
      return (
        <section className="ts-stats">
          <div className="ts-stats-lead ts-reveal">{block.lead || goodsBedStatsLead}</div>
          <div className="ts-stats-grid">
            {goodsBedStats.map((s, i) => (
              <div key={i} className="ts-stat ts-reveal">
                <div className="ts-stat-v">{s.value}</div>
                <div className="ts-stat-l">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      );
    case 'health-facts': {
      const framing = healthFramings[block.focus];
      if (!framing) return (
        <section className="ts-read">
          <p className="ts-p ts-reveal">[ATOM ERROR: health framing &quot;{block.focus}&quot; not found]</p>
        </section>
      );
      return (
        <section className="ts-read">
          <div className="ts-tag ts-reveal">Off the ground</div>
          <h2 className="ts-read-h ts-reveal d1">{framing.heading}</h2>
          {framing.paragraphs.map((p, i) => (
            <p key={i} className="ts-p ts-reveal d1">{p}</p>
          ))}
          {framing.pull && (
            <blockquote className="ts-pull ts-reveal d2">
              {framing.pull.quote}
              <span className="ts-src">{framing.pull.src}</span>
            </blockquote>
          )}
        </section>
      );
    }
    case 'problem-statement':
      return (
        <section className="ts-read">
          <div className="ts-tag ts-reveal">The problem we work on</div>
          <h2 className="ts-read-h ts-reveal d1">{problemStatement.heading}</h2>
          {problemStatement.paragraphs.map((p, i) => (
            <p key={i} className="ts-p ts-reveal d1">{p}</p>
          ))}
        </section>
      );
    case 'production-plant-facts':
      return (
        <section className="ts-read">
          <div className="ts-tag ts-reveal">The plant</div>
          <h2 className="ts-read-h ts-reveal d1">{productionPlantFacts.heading}</h2>
          {productionPlantFacts.paragraphs.map((p, i) => (
            <p key={i} className="ts-p ts-reveal d1">{p}</p>
          ))}
          <div className="ts-stats-grid" style={{ marginTop: '2.4rem' }}>
            {productionPlantFacts.highlights.map((h, i) => (
              <div key={i} className="ts-stat ts-reveal d2">
                <div className="ts-stat-v">{h.value}</div>
                <div className="ts-stat-l">{h.label}</div>
              </div>
            ))}
          </div>
        </section>
      );
    case 'live-map': {
      // Scope to a community if requested. communityLocations is the
      // canonical, manually-curated source today; phase 2 swaps for a
      // server-fetched count from the assets register.
      const scoped = block.scope?.community
        ? communityLocations.filter((c) => c.name === block.scope!.community)
        : communityLocations;
      const total = scoped.reduce((s, c) => s + (c.bedsDelivered || 0), 0);
      const heading = block.heading || (block.scope?.community
        ? `Beds at ${block.scope.community}`
        : 'Where the beds have gone');
      const intro = block.intro || (block.scope?.community
        ? `Live count for ${block.scope.community}: ${total} beds delivered.`
        : `Live count across all Goods deployments: ${total} beds.`);
      return (
        <section className="ts-mapwrap">
          <div className="ts-map-head">
            <h2 className="ts-vh ts-reveal">{heading}</h2>
            <p className="ts-reveal d1">{intro}</p>
          </div>
          <div className="ts-map ts-reveal d1">
            <CommunityMap locations={scoped} storytellers={[]} />
          </div>
          {block.caveat && <p className="ts-legend ts-reveal d2">{block.caveat}</p>}
        </section>
      );
    }
    case 'portal': {
      // "This is Goods" — self-aware portal at the foot of every field-notes
      // story. Lists other field notes (excludes the current story) plus
      // anchor links into the rest of the site. Internal-only stories don't
      // appear in the cross-story list when rendering publicly.
      const others = tripStories.filter((s) => s.slug !== currentSlug && (internal || s.published));
      return (
        <section className="ts-portal">
          <h2 className="ts-vh ts-reveal">{block.heading || 'This story is one piece of the project'}</h2>
          {block.sub && <p className="ts-vsub ts-reveal d1">{block.sub}</p>}

          {others.length > 0 && (
            <div className="ts-portal-group ts-reveal d1">
              <div className="ts-portal-eyebrow">Other field notes</div>
              <ul className="ts-portal-list">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/field-notes/${s.slug}`}>
                      <span className="ts-portal-title">{s.title}</span>
                      <span className="ts-portal-meta">{s.dateline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="ts-portal-group ts-reveal d2">
            <div className="ts-portal-eyebrow">Across the project</div>
            <ul className="ts-portal-list">
              {block.anchors.map((a) => {
                const external = /^https?:/.test(a.href);
                return (
                  <li key={a.href}>
                    {external ? (
                      <a href={a.href} target="_blank" rel="noopener noreferrer">
                        <span className="ts-portal-title">{a.label} <span aria-hidden>↗</span></span>
                      </a>
                    ) : (
                      <Link href={a.href}>
                        <span className="ts-portal-title">{a.label} <span aria-hidden>→</span></span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      );
    }
    default:
      return null;
  }
}

const CSS = `
.ts-root{--bone:#f4ede1;--bone-dim:#c9bba4;--muted:#9c8d76;--ochre:#c8702e;--ochre-soft:#e6ad6a;--char:#0e0b07;--panel:#15110c;--line:rgba(244,237,225,.14);--serif:Georgia,'Times New Roman',serif;--sans:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:var(--char);color:var(--bone);font-family:var(--sans);line-height:1.65}
.ts-root *{box-sizing:border-box}
.ts-banner{position:sticky;top:0;z-index:40;text-align:center;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--bone-dim);background:rgba(14,11,7,.85);backdrop-filter:blur(6px);padding:8px 14px;border-bottom:1px solid var(--line)}
.ts-immersive{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;padding:9vh 7vw}
.ts-immersive.ts-center{justify-content:center;text-align:center}
.ts-bg{position:absolute;inset:0;z-index:0;width:100%;height:100%;object-fit:cover;transform:scale(1.08);transition:transform 8s ease-out}
.ts-immersive.in .ts-bg,.ts-bleedquote.in .ts-bg{transform:scale(1)}
.ts-bg-img{object-fit:cover;filter:brightness(.85) saturate(1)}
/* Video sits above the still image. If sources fail to load it stays invisible (no spinner / no black flash) and the image underneath shows. */
.ts-bg-video{z-index:0;background:transparent}
.ts-bg-video:empty{display:none}
video.ts-bg{filter:brightness(.6) saturate(.97)}
/* Scrim sits above the image, darkens the bottom enough for text legibility
   while letting most of the image show through. Adjusted softer than the
   original to stop sunset/dark hero shots reading as solid black. */
.ts-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(0deg,rgba(8,6,4,.78) 0%,rgba(8,6,4,.1) 50%,rgba(8,6,4,.35) 100%)}
.ts-inner{position:relative;z-index:3;max-width:1100px;margin:0 auto;width:100%}
.ts-kicker{font-size:12px;letter-spacing:.34em;text-transform:uppercase;color:var(--ochre-soft);margin-bottom:1.3rem}
.ts-actmark{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--ochre-soft);margin-bottom:1rem}
.ts-h1{font-family:var(--serif);font-weight:400;font-size:clamp(2.4rem,6.4vw,5.2rem);line-height:1.03;letter-spacing:-.015em;max-width:18ch;text-shadow:0 2px 40px rgba(0,0,0,.5)}
.ts-imm-title{font-family:var(--serif);font-weight:400;font-size:clamp(2rem,5.2vw,3.6rem);line-height:1.08;text-shadow:0 2px 40px rgba(0,0,0,.5)}
.ts-standfirst{font-family:var(--serif);font-size:clamp(1.2rem,2.3vw,1.7rem);color:var(--bone);max-width:42ch;margin-top:1.6rem;line-height:1.4}
.ts-dateline{font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--bone-dim);margin-top:1.8rem}
.ts-read{max-width:720px;margin:0 auto;padding:8vh 7vw}
.ts-tag{font-size:11.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--ochre-soft);margin-bottom:1.2rem}
.ts-read-h{font-family:var(--serif);font-weight:400;font-size:clamp(1.8rem,4vw,2.7rem);line-height:1.12;margin-bottom:1.4rem;letter-spacing:-.01em}
.ts-p{font-size:1.15rem;line-height:1.75;color:#e7dcc9;margin-bottom:1.25rem;max-width:65ch}
.ts-pull{font-family:var(--serif);font-size:clamp(1.5rem,3.2vw,2.2rem);line-height:1.28;color:var(--bone);border-left:2px solid var(--ochre);padding-left:1.4rem;margin:2.4rem 0;font-style:italic}
.ts-src{display:block;font-style:normal;font-family:var(--sans);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--bone-dim);margin-top:1rem}
.ts-bleedquote{position:relative;min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;padding:10vh 7vw}
.ts-bleed-p{position:relative;z-index:3;font-family:var(--serif);font-size:clamp(2rem,5.6vw,3.8rem);line-height:1.14;color:var(--bone);max-width:22ch;margin:0 auto;text-shadow:0 2px 40px rgba(0,0,0,.7)}
.ts-stats{background:var(--panel);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:7vh 6vw}
.ts-stats-lead{font-size:11.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--ochre-soft);margin-bottom:2.4rem;text-align:center}
.ts-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:2.6rem 2rem;max-width:1240px;margin:0 auto;align-items:start}
.ts-stat{text-align:center}
.ts-stat-v{font-family:var(--serif);font-size:clamp(1.8rem,3.8vw,2.7rem);color:var(--ochre-soft);line-height:1.05;white-space:nowrap;text-wrap:balance}
.ts-stat-l{font-size:12.5px;line-height:1.4;color:var(--bone-dim);margin-top:.7rem}
.ts-voices,.ts-videos,.ts-pathways{max-width:1180px;margin:0 auto;padding:9vh 6vw}
.ts-vh{font-family:var(--serif);font-weight:400;font-size:clamp(1.8rem,4vw,2.6rem);text-align:center;margin-bottom:.6rem}
.ts-vsub{text-align:center;color:var(--bone-dim);font-size:.98rem;max-width:54ch;margin:0 auto 3rem}
.ts-qgrid,.ts-vgrid,.ts-pgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}
.ts-qcard,.ts-pcard{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:2rem 1.8rem;display:flex;flex-direction:column}
.ts-q{font-family:var(--serif);font-size:1.4rem;line-height:1.32;color:var(--bone)}
.ts-a{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--bone-dim);margin-top:1.4rem}
.ts-a b{color:var(--ochre-soft)}
.ts-tagpill{display:inline-block;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;margin-top:.9rem;padding:.25rem .6rem;border-radius:999px;border:1px solid var(--line);color:var(--muted);align-self:flex-start}
.ts-tagpill.cleared{color:#9cc59c;border-color:rgba(156,197,156,.35)}
.ts-tagpill.pending{color:var(--ochre-soft);border-color:rgba(230,173,106,.35)}
.ts-vid{margin:0;background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.ts-vid video{display:block;width:100%;height:240px;object-fit:cover;background:#000}
.ts-vid figcaption{padding:1.1rem 1.3rem;font-size:13.5px;line-height:1.5;color:var(--bone-dim)}
.ts-vid figcaption b{color:var(--bone);display:block;font-size:14.5px;margin-bottom:.25rem;font-family:var(--serif)}
.ts-videos--cinema{padding:6vh 0 8vh;max-width:none;position:relative}
.ts-videos--cinema .ts-vh{text-align:center;padding:0 6vw;font-size:clamp(2rem,5vw,3.4rem);margin-bottom:.6rem}
.ts-videos--cinema .ts-vsub{text-align:center;max-width:62ch;margin:0 auto 2.6rem;padding:0 6vw;color:var(--bone-dim);font-size:1.04rem}
.ts-vid--cinema{margin:0;border:none;border-radius:0;background:#000;overflow:hidden}
.ts-vid--cinema video{display:block;width:100vw;height:min(82vh,860px);object-fit:cover;background:#000}
.ts-vid--portrait{background:#000;padding:4vh 0}
.ts-vid--portrait video{width:auto;max-width:min(56vh,100vw);height:min(90vh,1000px);object-fit:contain;margin:0 auto}
.ts-vid--cinema figcaption{padding:1.4rem 6vw 0;font-size:15.5px;line-height:1.6;color:var(--bone-dim);max-width:1100px;margin:0 auto}
.ts-vid--cinema figcaption b{font-size:18px;margin-bottom:.4rem}
.ts-pullquote{padding:18vh 6vw;min-height:72vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;max-width:1100px;margin:0 auto;border-bottom:1px solid rgba(255,255,255,.04)}
.ts-pq-kicker{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--ochre-soft);margin-bottom:2rem}
.ts-pq-quote{font-family:var(--serif);font-weight:300;font-style:italic;font-size:clamp(1.8rem,4.5vw,3.6rem);line-height:1.25;color:var(--bone);margin:0;max-width:22ch}
.ts-pq-attr{margin-top:2rem;font-size:13px;letter-spacing:.05em;color:var(--bone-dim)}
.ts-gimg-btn{padding:0;border:1px solid var(--line);background:var(--panel);cursor:pointer;display:block;width:100%;text-align:left}
.ts-gimg-btn:hover{border-color:var(--ochre-soft)}
.ts-lb{position:fixed;inset:0;z-index:9999;background:rgba(8,7,5,.96);display:flex;align-items:center;justify-content:center;padding:4vh 6vw;animation:tsLbIn .18s ease}
@keyframes tsLbIn{from{opacity:0}to{opacity:1}}
.ts-lb-fig{margin:0;max-width:min(1600px,92vw);max-height:88vh;display:flex;flex-direction:column;align-items:center;gap:1rem}
.ts-lb-img{max-width:100%;max-height:80vh;height:auto;width:auto;object-fit:contain;border-radius:6px}
.ts-lb-cap{font-size:13px;color:var(--bone-dim);text-align:center;display:flex;gap:1.5rem;justify-content:center;align-items:baseline}
.ts-lb-count{font-size:11px;letter-spacing:.15em;text-transform:uppercase;opacity:.7}
.ts-lb-close,.ts-lb-prev,.ts-lb-next{position:absolute;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:var(--bone);cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .15s ease}
.ts-lb-close:hover,.ts-lb-prev:hover,.ts-lb-next:hover{background:rgba(255,255,255,.18)}
.ts-lb-close{top:2vh;right:2vw;width:44px;height:44px;font-size:24px;line-height:1}
.ts-lb-prev,.ts-lb-next{top:50%;transform:translateY(-50%);width:56px;height:56px;font-size:36px;line-height:1}
.ts-lb-prev{left:2vw}
.ts-lb-next{right:2vw}
.ts-gallery{padding:7vh 6vw;max-width:1280px;margin:0 auto}
.ts-gallery .ts-vh{margin-bottom:.8rem}
.ts-gallery .ts-vsub{color:var(--bone-dim);font-size:.98rem;max-width:60ch;margin-bottom:2rem}
.ts-ggrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:.9rem}
.ts-gimg{position:relative;margin:0;background:var(--panel);border:1px solid var(--line);border-radius:10px;overflow:hidden;aspect-ratio:3/2}
.ts-gimg-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
.ts-gimg:hover .ts-gimg-img{transform:scale(1.03)}
.ts-gpending{position:absolute;top:.5rem;left:.5rem;background:rgba(220,140,40,.92);color:#fff;font-size:10px;letter-spacing:.1em;text-transform:uppercase;padding:.25rem .5rem;border-radius:4px;z-index:1}
.ts-gimg figcaption{position:absolute;bottom:0;left:0;right:0;padding:.7rem .9rem;font-size:12px;line-height:1.4;color:#fff;background:linear-gradient(180deg,transparent,rgba(0,0,0,.7));opacity:0;transition:opacity .25s ease}
.ts-gimg:hover figcaption{opacity:1}
.ts-mapwrap{padding:9vh 6vw;background:var(--panel);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.ts-map-head{max-width:760px;margin:0 auto 2.4rem;text-align:center}
.ts-map-head h2{margin-bottom:1rem}
.ts-map-head p{color:var(--bone-dim);font-size:1.02rem;max-width:60ch;margin:0 auto}
.ts-map{max-width:1180px;height:64vh;min-height:440px;margin:0 auto;border-radius:18px;border:1px solid var(--line);overflow:hidden;background:#0c0a07}
.ts-map-loading{height:100%;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:14px}
.ts-legend{max-width:1180px;margin:1.4rem auto 0;font-size:12px;color:var(--muted);text-align:center;line-height:1.7}
.ts-pcard .ts-pwho{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ochre-soft);margin-bottom:.8rem}
.ts-pcard h3{font-family:var(--serif);font-weight:400;font-size:1.5rem;margin-bottom:.7rem;color:var(--bone)}
.ts-pcard p{font-size:.98rem;color:var(--bone-dim);line-height:1.6}
.ts-qcard-link{text-decoration:none;color:inherit;display:flex;flex-direction:column;transition:transform .25s ease,border-color .25s ease}
.ts-qcard-link:hover{transform:translateY(-2px);border-color:var(--ochre-soft)}
.ts-qcard-arrow{color:var(--ochre-soft);margin-left:.4rem;opacity:.7;transition:opacity .2s ease,transform .2s ease}
.ts-qcard-link:hover .ts-qcard-arrow{opacity:1;transform:translateX(2px)}
.ts-plink{text-align:center;margin-top:2.6rem}
.ts-plink a{color:var(--ochre-soft);text-decoration:none;border-bottom:1px solid rgba(230,173,106,.4);font-family:var(--serif);font-size:1.2rem}

/* Contextual gutter links - appear under any block that sets links. Small,
   not greedy; readers branch out if they want, otherwise keep reading. */
.ts-links{max-width:720px;margin:-2vh auto 6vh;padding:0 7vw;display:flex;flex-wrap:wrap;gap:1rem 2rem;font-size:13px;letter-spacing:.04em}
.ts-links a{color:var(--ochre-soft);text-decoration:none;border-bottom:1px solid rgba(230,173,106,.35);padding-bottom:1px}
.ts-links a:hover{color:var(--bone);border-bottom-color:var(--bone)}
.ts-mapwrap + .ts-links,.ts-stats + .ts-links,.ts-voices + .ts-links{max-width:1180px}

/* "This is Goods" portal — quiet, generous, two columns of links. Other field
   notes on the left (kept-current-out), site anchors on the right. */
.ts-portal{max-width:1100px;margin:0 auto;padding:11vh 7vw 8vh;border-top:1px solid var(--line)}
.ts-portal .ts-vh{text-align:left}
.ts-portal-group{margin-top:3.2rem}
.ts-portal-eyebrow{font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem}
.ts-portal-list{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:.4rem 2rem}
.ts-portal-list li{border-bottom:1px solid var(--line)}
.ts-portal-list a{display:flex;flex-direction:column;gap:.15rem;padding:1rem 0;color:var(--bone);text-decoration:none;transition:color .2s ease}
.ts-portal-list a:hover{color:var(--ochre-soft)}
.ts-portal-title{font-family:var(--serif);font-size:1.2rem;line-height:1.3}
.ts-portal-meta{font-size:12px;letter-spacing:.06em;color:var(--bone-dim)}

.ts-footer{max-width:760px;margin:0 auto;padding:9vh 7vw 14vh;font-size:13px;line-height:1.75;color:var(--muted);border-top:1px solid var(--line)}
.ts-footer strong{color:var(--bone)}
.ts-reveal{opacity:0;transform:translateY(20px);transition:opacity 1s ease,transform 1s ease}
.ts-reveal.in{opacity:1;transform:none}
.ts-reveal.d1{transition-delay:.1s}.ts-reveal.d2{transition-delay:.2s}.ts-reveal.d3{transition-delay:.3s}
@media (prefers-reduced-motion:reduce){.ts-reveal{opacity:1;transform:none;transition:none}.ts-bg{transform:none;transition:none}}
`;
