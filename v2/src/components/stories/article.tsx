// Article renderer — the "middle tier" between plain prose and the full
// field-notes TripStory scrollytelling. For director notes, considered
// reflections, blog posts. Magazine-column layout:
//   - Boxed hero image (not full-bleed), title + standfirst + byline below
//   - Centered prose column (~720px)
//   - Inline figures, pullquotes, galleries
//   - Cream theme (light)
//
// Uses the same block vocabulary as the field-notes TripStory so a story
// can move between layouts by flipping `media_metadata.layout` only.
// Subset supported: read, pullquote, figure, manual-gallery, el-gallery,
// el-video-gallery, hero-photo, close. Other block kinds render as a
// graceful skip (no crash if a rich-only block sneaks in).

import Image from 'next/image';
import Link from 'next/link';
import type { TripBlock, MediaRef } from '@/lib/data/trip-stories';
import { InsertBetweenBlocks } from './inline-insert';

interface ArticleStory {
  id: string;
  title: string;
  standfirst?: string | null;
  authorName: string;
  publishedDate: string;
  themes?: string[];
  /** Hero image — uses the story-level featured image. */
  heroImage?: string | null;
  /** Optional hero looping background video, mute+loop, plays under scrim. */
  heroVideo?: string | null;
  blocks: TripBlock[];
  /**
   * Optional parallel array of original block indices in the EL story's
   * media_metadata.blocks. When present, the inline insert buttons use
   * these indices so a new block lands at the right place in EL even
   * after blocks have been filtered (e.g. masthead pulled out for hero).
   */
  blockIndices?: number[];
}

interface Props {
  story: ArticleStory;
  /**
   * Optional admin edit deep-link. When provided, an "Edit this story"
   * affordance shows in the article footer and a sticky pill in the
   * bottom-right. Only the parent route should populate this — it gates
   * on the user's admin status.
   */
  editHref?: string;
  /**
   * Optional deep-link into Empathy Ledger's native editor. EL is the
   * canonical store; the Goods admin is a convenience. When provided,
   * a secondary affordance points there for editors who prefer EL's
   * native UI.
   */
  elEditHref?: string;
}

function renderInline(text: string): React.ReactNode {
  // Minimal markdown: [text](url) → <a>, *text* → <em>, **text** → <strong>.
  // Same conventions as the field-notes read blocks so authors don't have
  // to relearn anything.
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > cursor) parts.push(text.slice(cursor, m.index));
    if (m[1] && m[2]) {
      parts.push(
        <Link key={m.index} href={m[2]} className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
          {m[1]}
        </Link>,
      );
    } else if (m[3]) {
      parts.push(<strong key={m.index}>{m[3]}</strong>);
    } else if (m[4]) {
      parts.push(<em key={m.index}>{m[4]}</em>);
    }
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts.length === 1 ? parts[0] : parts;
}

function Figure({ src, alt, caption, credit }: { src: string; alt?: string; caption?: string; credit?: string }) {
  return (
    <figure className="my-12 -mx-4 md:mx-0">
      <div className="relative w-full aspect-[3/2] bg-stone-100 rounded-lg overflow-hidden">
        <Image src={src} alt={alt || ''} fill className="object-cover" sizes="(min-width: 1024px) 800px, 100vw" />
      </div>
      {(caption || credit) && (
        <figcaption className="mt-3 px-4 md:px-0 text-sm text-stone-600 leading-relaxed">
          {caption}
          {credit && <span className="block text-xs uppercase tracking-wider text-stone-500 mt-1">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}

function HeroPhoto({ image, alt, quote, attribution }: { image: string; alt?: string; quote?: string; attribution?: string }) {
  return (
    <figure className="my-14 -mx-4 md:mx-0">
      <div className="relative w-full aspect-[16/10] bg-stone-100 rounded-lg overflow-hidden">
        <Image src={image} alt={alt || ''} fill className="object-cover" sizes="(min-width: 1024px) 920px, 100vw" />
        {quote && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <blockquote className="px-6 pb-7 md:px-10 md:pb-10 max-w-2xl font-serif italic text-white text-xl md:text-2xl leading-snug">
              {quote}
              {attribution && (
                <footer className="mt-3 text-xs not-italic tracking-wider uppercase text-white/80">{attribution}</footer>
              )}
            </blockquote>
          </div>
        )}
      </div>
    </figure>
  );
}

function PullQuote({ kicker, quote, attribution }: { kicker?: string; quote: string; attribution?: string }) {
  return (
    <aside className="my-12 border-l-2 border-primary pl-6 md:pl-8">
      {kicker && <p className="text-xs uppercase tracking-wider text-stone-500 mb-3">{kicker}</p>}
      <blockquote className="font-serif italic text-2xl md:text-3xl text-foreground leading-snug">
        {renderInline(quote)}
      </blockquote>
      {attribution && (
        <footer className="mt-4 text-sm text-stone-600">{attribution}</footer>
      )}
    </aside>
  );
}

function Gallery({ items }: { items: { src: string; alt?: string; caption?: string }[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="my-12 -mx-4 md:mx-0 grid grid-cols-2 gap-2 md:gap-3">
      {items.map((it, i) => (
        <div key={i} className="relative aspect-square bg-stone-100 rounded-md overflow-hidden">
          <Image src={it.src} alt={it.alt || ''} fill className="object-cover" sizes="(min-width: 1024px) 460px, 50vw" />
        </div>
      ))}
    </div>
  );
}

function VideoBlock({ src, poster, caption, title }: { src: string; poster?: string; caption?: string; title?: string }) {
  return (
    <figure className="my-12 -mx-4 md:mx-0">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video controls preload="metadata" playsInline poster={poster} className="w-full h-full object-contain">
          <source src={src} type="video/mp4" />
        </video>
      </div>
      {(title || caption) && (
        <figcaption className="mt-3 px-4 md:px-0 text-sm text-stone-600 leading-relaxed">
          {title && <span className="block font-medium text-foreground">{title}</span>}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Bg({ image, video }: { image?: string | null; video?: string | null }) {
  if (!image && !video) return null;
  return (
    <div className="absolute inset-0">
      {image && (
        <Image src={image} alt="" fill className="object-cover" sizes="100vw" priority />
      )}
      {video && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          poster={image || undefined}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

function renderArticleBlock(block: TripBlock, i: number): React.ReactNode {
  switch (block.kind) {
    case 'read':
      return (
        <div key={i} className="mt-10">
          {block.tag && <p className="text-xs uppercase tracking-widest text-primary mb-3">{block.tag}</p>}
          {block.heading && (
            <h2 className="font-serif text-3xl md:text-4xl font-light leading-tight text-foreground mb-6 mt-4">
              {block.heading}
            </h2>
          )}
          {block.paragraphs.map((p, pi) => (
            <p key={pi} className="font-serif text-lg md:text-xl leading-relaxed text-stone-800 mb-5">
              {renderInline(p)}
            </p>
          ))}
        </div>
      );
    case 'pullquote':
      return <PullQuote key={i} kicker={block.kicker} quote={block.quote} attribution={block.attribution} />;
    case 'figure':
      return <Figure key={i} src={block.image} alt={block.alt} caption={block.caption} credit={block.credit} />;
    case 'hero-photo': {
      const img = (block.media as MediaRef)?.image;
      if (!img) return null;
      return <HeroPhoto key={i} image={img} alt={block.title} quote={block.quote} attribution={block.attribution} />;
    }
    case 'manual-gallery':
    case 'el-gallery': {
      const items = (block.items || []) as { src: string; alt?: string; caption?: string }[];
      return (
        <div key={i} className="mt-10">
          {block.heading && <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-2">{block.heading}</h2>}
          {block.sub && <p className="text-sm text-stone-600 mb-5">{block.sub}</p>}
          <Gallery items={items} />
        </div>
      );
    }
    case 'el-video-gallery': {
      const items = block.items || [];
      if (items.length === 0) return null;
      const v = items[0];
      // Overlay mode: full-bleed background video with title overlay.
      if ((block as { as?: string }).as === 'overlay') {
        return (
          <div key={i} className="mt-12 -mx-4 md:mx-0">
            <div className="relative w-full aspect-[16/9] bg-stone-900 rounded-lg overflow-hidden">
              <Bg image={v.poster} video={v.src} />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div className="px-6 pb-7 md:px-10 md:pb-10">
                  {block.heading && <h2 className="font-serif italic text-white text-2xl md:text-3xl">{block.heading}</h2>}
                  {block.sub && <p className="mt-1 text-white/80 text-sm">{block.sub}</p>}
                </div>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div key={i} className="mt-10">
          {block.heading && <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-2">{block.heading}</h2>}
          {block.sub && <p className="text-sm text-stone-600 mb-5">{block.sub}</p>}
          <VideoBlock src={v.src} poster={v.poster} caption={v.caption} title={v.title} />
        </div>
      );
    }
    case 'before-after-split':
      return (
        <div key={i} className="mt-10 -mx-4 md:mx-0">
          {block.heading && <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-2 px-4 md:px-0">{block.heading}</h2>}
          {block.intro && <p className="text-stone-700 mb-5 px-4 md:px-0">{block.intro}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[block.before, block.after].map((side, si) => (
              <figure key={si} className="relative">
                <div className="relative aspect-[4/3] bg-stone-100 rounded-md overflow-hidden">
                  <Image src={side.image} alt={side.alt} fill className="object-cover" sizes="(min-width: 1024px) 460px, 100vw" />
                  <span className="absolute top-3 left-3 text-xs uppercase tracking-wider bg-black/70 text-white px-2 py-1 rounded-full">
                    {side.label}
                  </span>
                </div>
              </figure>
            ))}
          </div>
          {block.credit && <p className="text-center text-xs uppercase tracking-wider text-stone-500 mt-4">{block.credit}</p>}
        </div>
      );
    case 'close':
      return (
        <div key={i} className="mt-16 -mx-4 md:mx-0">
          <div className="relative w-full aspect-[16/9] bg-stone-900 rounded-lg overflow-hidden">
            <Bg image={(block.media as MediaRef).image} video={(block.media as MediaRef).videoDesktop} />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent">
              <h2 className="px-6 pb-7 md:px-10 md:pb-10 font-serif italic text-white text-2xl md:text-3xl">{block.title}</h2>
            </div>
          </div>
        </div>
      );
    case 'immersive': {
      // Article layout treats an immersive block as a full-bleed cinema
      // card: image (and looping video if present) fills a 16:9 frame,
      // act-mark + title + standfirst overlay on a bottom-up scrim. The
      // text never floats on black padding because the scrim handles
      // contrast on whatever frame the image/video has. mobileLayout:
      // 'stacked' (used for wide-subject shots like Frankie + Donald)
      // drops the scrim and stacks text below the image.
      const media = (block.media as MediaRef) || {};
      const stacked = (block as { mobileLayout?: string }).mobileLayout === 'stacked';
      if (stacked) {
        return (
          <div key={i} className="mt-16 -mx-4 md:mx-0">
            {media.image && (
              <div className="relative w-full aspect-[3/2] bg-stone-100 overflow-hidden md:rounded-lg">
                <Image src={media.image} alt={block.title || ''} fill className="object-cover" sizes="(min-width: 1024px) 920px, 100vw" />
              </div>
            )}
            <div className="px-4 md:px-6 pt-6 md:pt-8">
              {block.actmark && <p className="text-xs uppercase tracking-widest text-primary mb-3">{block.actmark}</p>}
              <h2 className="font-serif text-3xl md:text-4xl font-light leading-tight text-foreground mb-4">{block.title}</h2>
              {block.standfirst && (
                <p className="font-serif text-lg md:text-xl leading-relaxed text-stone-700">{block.standfirst}</p>
              )}
            </div>
          </div>
        );
      }
      return (
        <div key={i} className="mt-16 -mx-4 md:mx-0">
          <div className="relative w-full aspect-[16/9] bg-stone-900 overflow-hidden md:rounded-lg">
            <Bg image={media.image} video={media.videoDesktop} />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent px-6 pb-7 md:px-10 md:pb-10">
              {block.actmark && <p className="text-xs uppercase tracking-widest text-white/70 mb-3">{block.actmark}</p>}
              <h2 className="font-serif text-2xl md:text-4xl font-light leading-tight text-white max-w-2xl">{block.title}</h2>
              {block.standfirst && (
                <p className="mt-3 font-serif text-base md:text-lg leading-relaxed text-white/85 max-w-2xl">{block.standfirst}</p>
              )}
            </div>
          </div>
        </div>
      );
    }
    case 'masthead':
    case 'bleedquote':
    case 'live-map':
    case 'stats':
    case 'voices':
    case 'videos':
    case 'map':
    case 'pathways':
    case 'portal':
    case 'partner-credit':
    case 'goods-facts':
    case 'health-facts':
    case 'problem-statement':
    case 'production-plant-facts':
      return null;
    default:
      return null;
  }
}

export function ArticleRenderer({ story, editHref, elEditHref }: Props) {
  return (
    <main className="bg-[#FDF8F3] text-foreground">
      {/* Admin-only floating edit affordance. Two pills, stacked bottom-right.
          Goods admin (✎) and EL editor (↗) — EL is canonical; Goods is the
          convenience. Hidden from public viewers. */}
      {(editHref || elEditHref) && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {elEditHref && (
            <a
              href={elEditHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-lg hover:bg-emerald-700"
              aria-label="Edit in Empathy Ledger"
            >
              <span aria-hidden>↗</span>
              <span>Edit in Empathy Ledger</span>
            </a>
          )}
          {editHref && (
            <Link
              href={editHref}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-white shadow-lg hover:bg-foreground/90"
              aria-label="Edit in Goods admin"
            >
              <span aria-hidden>✎</span>
              <span>Edit in Goods admin</span>
            </Link>
          )}
        </div>
      )}
      {/* Hero — boxed, not full-bleed. Title and standfirst sit BELOW the
          image (not overlaid on padding). Works well for landscape photos
          with wide-spread subjects. */}
      <section className="relative">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[70vh] bg-stone-900 overflow-hidden">
          <Bg image={story.heroImage} video={story.heroVideo} />
        </div>
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-2">
          {story.themes && story.themes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {story.themes.slice(0, 4).map((theme) => (
                <span key={theme} className="text-xs uppercase tracking-wider text-stone-600 border border-stone-300 rounded-full px-3 py-1">
                  {theme}
                </span>
              ))}
            </div>
          )}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-foreground mb-5">
            {story.title}
          </h1>
          {story.standfirst && (
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700 mb-6">
              {story.standfirst}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-stone-600 pb-6 border-b border-stone-200">
            <span className="font-medium text-foreground">{story.authorName}</span>
            <span>·</span>
            <time>{story.publishedDate}</time>
          </div>
        </div>
      </section>

      {/* Body — centered column, magazine prose. Each block renders inline.
          When the parent provided editHref (admin signed in), thin inline
          "+ Add media here" buttons appear between blocks so the editor
          can drop a photo or video at the cursor without leaving the page. */}
      <article className="max-w-3xl mx-auto px-4 md:px-6 pb-20">
        {editHref && story.blockIndices && story.blockIndices.length > 0 && (
          <InsertBetweenBlocks
            storyId={story.id}
            afterIndex={Math.max(0, story.blockIndices[0] - 1)}
          />
        )}
        {story.blocks.map((block, i) => {
          const originalIndex = story.blockIndices?.[i] ?? i;
          const node = renderArticleBlock(block, i);
          return (
            <div key={`b-${i}`}>
              {node}
              {editHref && (
                <InsertBetweenBlocks
                  storyId={story.id}
                  afterIndex={originalIndex}
                />
              )}
            </div>
          );
        })}

        <footer className="mt-16 pt-8 border-t border-stone-200 text-sm text-stone-600">
          <p>
            Written by <span className="font-medium text-foreground">{story.authorName}</span>.{' '}
            This story lives in the Empathy Ledger and is shared with the storyteller&apos;s consent.
          </p>
          {(editHref || elEditHref) && (
            <p className="mt-4 text-xs text-stone-500">
              <span className="font-medium text-stone-700">Editor:</span>{' '}
              {elEditHref && (
                <>
                  <a href={elEditHref} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                    Open in Empathy Ledger
                  </a>
                  {' '}(canonical){editHref ? ' · ' : '. '}
                </>
              )}
              {editHref && (
                <>
                  <Link href={editHref} className="underline hover:text-foreground">
                    Edit in Goods admin
                  </Link>
                  {' '}(convenience).
                </>
              )}
              {' '}EL is the source of truth; Goods picks up edits on next page load.
            </p>
          )}
        </footer>
      </article>
    </main>
  );
}
