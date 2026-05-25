#!/usr/bin/env node
// One-shot: regenerate the EL `content` field for Ben's Utopia article
// from the canonical media_metadata.blocks. Makes EL's native editor a
// useful read-only mirror of what Goods is rendering. Run once after the
// blocks-to-html serializer ships.
//
// Mirrors the runtime behaviour now baked into:
//   - /admin/el-stories/[id]/edit (save form)
//   - /api/admin/el-story-media-swap/[id] (media swap)

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const STORY_ID = '55897065-526b-4c56-8fb7-8a2c3ace4993';

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(text) {
  let out = esc(text);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return out;
}

function blocksToHtml(blocks) {
  const parts = [];
  for (const b of blocks) {
    switch (b.kind) {
      case 'masthead':
      case 'immersive':
        if (b.kind === 'immersive' && b.actmark) parts.push(`<p class="actmark">${esc(b.actmark)}</p>`);
        if (b.kind === 'masthead' && b.kicker) parts.push(`<p class="kicker">${esc(b.kicker)}</p>`);
        if (b.title) parts.push(`<h2>${esc(b.title)}</h2>`);
        if (b.standfirst) parts.push(`<p class="standfirst">${esc(b.standfirst)}</p>`);
        if (b.media?.image) parts.push(`<figure><img src="${esc(b.media.image)}" alt="" /></figure>`);
        break;
      case 'read':
        if (b.tag) parts.push(`<p class="tag">${esc(b.tag)}</p>`);
        if (b.heading) parts.push(`<h2>${esc(b.heading)}</h2>`);
        for (const p of b.paragraphs || []) parts.push(`<p>${inline(p)}</p>`);
        break;
      case 'pullquote':
        if (b.kicker) parts.push(`<p class="kicker">${esc(b.kicker)}</p>`);
        parts.push(`<blockquote><p>${inline(b.quote)}</p></blockquote>`);
        if (b.attribution) parts.push(`<p class="attr">${esc(b.attribution)}</p>`);
        break;
      case 'bleedquote':
        parts.push(`<blockquote><p>${esc(b.text)}</p></blockquote>`);
        if (b.media?.image) parts.push(`<figure><img src="${esc(b.media.image)}" alt="" /></figure>`);
        break;
      case 'figure':
        if (b.heading) parts.push(`<h2>${esc(b.heading)}</h2>`);
        if (b.intro) parts.push(`<p>${esc(b.intro)}</p>`);
        parts.push(
          `<figure><img src="${esc(b.image)}" alt="${esc(b.alt || '')}" />${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`,
        );
        if (b.credit) parts.push(`<p class="credit">${esc(b.credit)}</p>`);
        break;
      case 'hero-photo':
        if (b.media?.image) parts.push(`<figure><img src="${esc(b.media.image)}" alt="${esc(b.title || '')}" /></figure>`);
        if (b.title) parts.push(`<h2>${esc(b.title)}</h2>`);
        if (b.sub) parts.push(`<p>${esc(b.sub)}</p>`);
        if (b.quote) parts.push(`<blockquote><p>${esc(b.quote)}</p></blockquote>`);
        if (b.attribution) parts.push(`<p class="attr">${esc(b.attribution)}</p>`);
        break;
      case 'manual-gallery':
      case 'el-gallery': {
        if (b.heading) parts.push(`<h2>${esc(b.heading)}</h2>`);
        if (b.sub) parts.push(`<p>${esc(b.sub)}</p>`);
        const items = b.items || [];
        if (items.length > 0) {
          parts.push('<div class="gallery">');
          for (const it of items) parts.push(`  <img src="${esc(it.src)}" alt="${esc(it.alt || '')}" />`);
          parts.push('</div>');
        }
        break;
      }
      case 'el-video-gallery':
        if (b.heading) parts.push(`<h2>${esc(b.heading)}</h2>`);
        if (b.sub) parts.push(`<p>${esc(b.sub)}</p>`);
        for (const v of b.items || []) {
          parts.push(
            `<figure><video src="${esc(v.src)}" controls preload="metadata"${v.poster ? ` poster="${esc(v.poster)}"` : ''}></video>${v.title ? `<figcaption>${esc(v.title)}</figcaption>` : ''}</figure>`,
          );
        }
        break;
      case 'before-after-split':
        if (b.heading) parts.push(`<h2>${esc(b.heading)}</h2>`);
        if (b.intro) parts.push(`<p>${esc(b.intro)}</p>`);
        parts.push('<div class="before-after">');
        parts.push(`  <figure><span class="label">${esc(b.before.label)}</span><img src="${esc(b.before.image)}" alt="${esc(b.before.alt)}" /></figure>`);
        parts.push(`  <figure><span class="label">${esc(b.after.label)}</span><img src="${esc(b.after.image)}" alt="${esc(b.after.alt)}" /></figure>`);
        parts.push('</div>');
        if (b.credit) parts.push(`<p class="credit">${esc(b.credit)}</p>`);
        break;
      case 'close':
        if (b.media?.image) parts.push(`<figure><img src="${esc(b.media.image)}" alt="" /></figure>`);
        if (b.title) parts.push(`<p class="close-title">${esc(b.title)}</p>`);
        break;
      default:
        break;
    }
  }
  return parts.join('\n');
}

async function main() {
  const getRes = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${STORY_ID}&select=media_metadata`, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
  });
  if (!getRes.ok) throw new Error('GET failed');
  const rows = await getRes.json();
  const blocks = rows[0]?.media_metadata?.blocks || [];
  const content = blocksToHtml(blocks);
  console.log(`Generated ${content.length} chars of HTML from ${blocks.length} blocks`);

  const patchRes = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${STORY_ID}`, {
    method: 'PATCH',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ content }),
  });
  if (!patchRes.ok) throw new Error(`PATCH failed: ${patchRes.status} ${await patchRes.text()}`);
  console.log('OK. EL editor will now show the rich body.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
