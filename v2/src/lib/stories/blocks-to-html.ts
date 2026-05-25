// Serialize a story block array to clean semantic HTML for the EL
// `content` field. Goods admin and the media-swap endpoint call this on
// every save so EL's native editor stays a viable read-only mirror of
// what Goods is rendering. EL's edit UI shows `content`; Goods's article
// layout reads `media_metadata.blocks`. Blocks are canonical; content is
// the auto-generated mirror.
//
// Inline markdown supported: [text](url) → <a>, **bold** → <strong>,
// *em* → <em>. Same conventions as the article inline renderer.

import type { TripBlock } from '@/lib/data/trip-stories';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return out;
}

export function blocksToHtml(blocks: TripBlock[]): string {
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.kind) {
      case 'masthead':
      case 'immersive': {
        if (block.kind === 'immersive' && block.actmark) {
          parts.push(`<p class="actmark">${escapeHtml(block.actmark)}</p>`);
        }
        if (block.kind === 'masthead' && block.kicker) {
          parts.push(`<p class="kicker">${escapeHtml(block.kicker)}</p>`);
        }
        if (block.title) parts.push(`<h2>${escapeHtml(block.title)}</h2>`);
        if (block.standfirst) parts.push(`<p class="standfirst">${escapeHtml(block.standfirst)}</p>`);
        const img = block.media?.image;
        if (img) {
          parts.push(`<figure><img src="${escapeHtml(img)}" alt="" /></figure>`);
        }
        break;
      }
      case 'read': {
        if (block.tag) parts.push(`<p class="tag">${escapeHtml(block.tag)}</p>`);
        if (block.heading) parts.push(`<h2>${escapeHtml(block.heading)}</h2>`);
        for (const p of block.paragraphs) {
          parts.push(`<p>${renderInline(p)}</p>`);
        }
        break;
      }
      case 'pullquote': {
        if (block.kicker) parts.push(`<p class="kicker">${escapeHtml(block.kicker)}</p>`);
        parts.push(`<blockquote><p>${renderInline(block.quote)}</p></blockquote>`);
        if (block.attribution) parts.push(`<p class="attr">${escapeHtml(block.attribution)}</p>`);
        break;
      }
      case 'bleedquote': {
        parts.push(`<blockquote><p>${escapeHtml(block.text)}</p></blockquote>`);
        const img = block.media?.image;
        if (img) parts.push(`<figure><img src="${escapeHtml(img)}" alt="" /></figure>`);
        break;
      }
      case 'figure': {
        if (block.heading) parts.push(`<h2>${escapeHtml(block.heading)}</h2>`);
        if (block.intro) parts.push(`<p>${escapeHtml(block.intro)}</p>`);
        const cap = block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : '';
        parts.push(
          `<figure><img src="${escapeHtml(block.image)}" alt="${escapeHtml(block.alt || '')}" />${cap}</figure>`,
        );
        if (block.credit) parts.push(`<p class="credit">${escapeHtml(block.credit)}</p>`);
        break;
      }
      case 'hero-photo': {
        const img = block.media?.image || '';
        if (img) parts.push(`<figure><img src="${escapeHtml(img)}" alt="${escapeHtml(block.title || '')}" /></figure>`);
        if (block.title) parts.push(`<h2>${escapeHtml(block.title)}</h2>`);
        if (block.sub) parts.push(`<p>${escapeHtml(block.sub)}</p>`);
        if (block.quote) parts.push(`<blockquote><p>${escapeHtml(block.quote)}</p></blockquote>`);
        if (block.attribution) parts.push(`<p class="attr">${escapeHtml(block.attribution)}</p>`);
        break;
      }
      case 'manual-gallery':
      case 'el-gallery': {
        if (block.heading) parts.push(`<h2>${escapeHtml(block.heading)}</h2>`);
        if (block.sub) parts.push(`<p>${escapeHtml(block.sub)}</p>`);
        const items = (block.items || []) as { src: string; alt?: string }[];
        if (items.length > 0) {
          parts.push('<div class="gallery">');
          for (const it of items) {
            parts.push(
              `  <img src="${escapeHtml(it.src)}" alt="${escapeHtml(it.alt || '')}" />`,
            );
          }
          parts.push('</div>');
        }
        break;
      }
      case 'el-video-gallery': {
        if (block.heading) parts.push(`<h2>${escapeHtml(block.heading)}</h2>`);
        if (block.sub) parts.push(`<p>${escapeHtml(block.sub)}</p>`);
        for (const v of block.items || []) {
          const poster = v.poster ? ` poster="${escapeHtml(v.poster)}"` : '';
          const title = v.title ? `<figcaption>${escapeHtml(v.title)}</figcaption>` : '';
          parts.push(
            `<figure><video src="${escapeHtml(v.src)}" controls preload="metadata"${poster}></video>${title}</figure>`,
          );
        }
        break;
      }
      case 'before-after-split': {
        if (block.heading) parts.push(`<h2>${escapeHtml(block.heading)}</h2>`);
        if (block.intro) parts.push(`<p>${escapeHtml(block.intro)}</p>`);
        parts.push('<div class="before-after">');
        parts.push(
          `  <figure><span class="label">${escapeHtml(block.before.label)}</span><img src="${escapeHtml(block.before.image)}" alt="${escapeHtml(block.before.alt)}" />${block.before.caption ? `<figcaption>${escapeHtml(block.before.caption)}</figcaption>` : ''}</figure>`,
        );
        parts.push(
          `  <figure><span class="label">${escapeHtml(block.after.label)}</span><img src="${escapeHtml(block.after.image)}" alt="${escapeHtml(block.after.alt)}" />${block.after.caption ? `<figcaption>${escapeHtml(block.after.caption)}</figcaption>` : ''}</figure>`,
        );
        parts.push('</div>');
        if (block.credit) parts.push(`<p class="credit">${escapeHtml(block.credit)}</p>`);
        break;
      }
      case 'close': {
        const img = block.media?.image;
        if (img) parts.push(`<figure><img src="${escapeHtml(img)}" alt="" /></figure>`);
        if (block.title) parts.push(`<p class="close-title">${escapeHtml(block.title)}</p>`);
        break;
      }
      // Rich-only / atom blocks: no meaningful HTML representation.
      // Skipping them keeps `content` focused on the article body that
      // EL's editor can actually read and edit.
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
        break;
    }
  }

  return parts.join('\n');
}
