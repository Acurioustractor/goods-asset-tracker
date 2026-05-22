'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { communityLocations } from '@/lib/data/content';
import type { TripStory as TripStoryData, TripBlock, MediaRef, NavLink } from '@/lib/data/trip-stories';
import { tripStories } from '@/lib/data/trip-stories';

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
  if (media.videoDesktop) {
    return (
      <video className="ts-bg" autoPlay muted loop playsInline poster={media.image}>
        <source src={media.videoDesktop} media="(min-width: 768px)" type="video/mp4" />
        {media.videoMobile && <source src={media.videoMobile} type="video/mp4" />}
      </video>
    );
  }
  return (
    <div className="ts-bg">
      <Image src={media.image} alt="" fill sizes="100vw" className="ts-bg-img" />
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
        <BlockView key={i} block={block} internal={internal} currentSlug={story.slug} />
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

function BlockView({ block, internal, currentSlug }: { block: TripBlock; internal: boolean; currentSlug: string }) {
  const rendered = renderBlock(block, internal, currentSlug);
  return <>{withLinks(rendered, block)}</>;
}

function renderBlock(block: TripBlock, internal: boolean, currentSlug: string) {
  switch (block.kind) {
    case 'masthead':
      return (
        <section className="ts-immersive">
          <Bg media={block.media} />
          <div className="ts-scrim" />
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
            {cards.map((c, i) => (
              <div key={i} className="ts-qcard ts-reveal">
                <div className="ts-q">{c.quote}</div>
                <div className="ts-a">
                  {c.who}
                  {c.community && (
                    <>
                      {' · '}
                      <b>{c.community}</b>
                    </>
                  )}
                </div>
                <span className={`ts-tagpill ${c.consent}`}>
                  {c.consent === 'cleared' ? 'cleared voice' : 'consent pending'}
                </span>
              </div>
            ))}
          </div>
        </section>
      );
    }
    case 'videos':
      // People speaking on camera: internal-only until consent is captured.
      if (!internal) return null;
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
          <div className="ts-inner">
            <h2 className="ts-imm-title ts-reveal" style={{ margin: '0 auto', maxWidth: '24ch' }}>
              {block.title}
            </h2>
          </div>
        </section>
      );
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
.ts-bg-img{object-fit:cover;filter:brightness(.6) saturate(.97)}
video.ts-bg{filter:brightness(.6) saturate(.97)}
.ts-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(0deg,rgba(8,6,4,.88),rgba(8,6,4,.25) 55%,rgba(8,6,4,.5))}
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
.ts-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:2.2rem 1.4rem;max-width:1100px;margin:0 auto}
.ts-stat{text-align:center}
.ts-stat-v{font-family:var(--serif);font-size:clamp(2rem,4.4vw,3rem);color:var(--ochre-soft);line-height:1}
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
