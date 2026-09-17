/**
 * WHICH PHOTOGRAPHS THE SNOW REPORT SHOWS and how Ben changes the set without touching code.
 *
 * Ben, 17 September 2026, looking at the hero strip: "photos are great but I need a way to
 * easily select the Snow ones and add more as needed."
 *
 * HOW IT WORKS. The base set is WALLS in snow-partnership.ts: the curated archive, each frame
 * with a hand-written caption. On top of that, any image under public/images tagged `use:snow`
 * in the Media Room joins the strip and any frame tagged `use:snow-hide` leaves it. Both tags
 * are typed into the free-text tag box at /admin/media-library, which writes them to
 * data/local-image-tags.json, the same store the rest of the site reads. No new admin screen,
 * no deploy edit and the tags are committed to git like every other curation decision.
 *
 * WHY A HIDE TAG AND NOT JUST A PICK LIST. If the set were "only what is tagged", the first
 * image Ben tagged would collapse a forty-frame wall to one. Additive plus an explicit subtract
 * means both directions work and the page is never accidentally emptied.
 *
 * CAPTIONS ARE COMPULSORY. The hero names what you are pointing at, because an uncaptioned
 * photograph of a community is not something to put at the top of a funder report. A tagged
 * image has no hand-written caption, so it takes the best line its tags can give: the community
 * it is from, or failing that the part of the archive it lives in. A frame that can produce
 * neither does not join the strip.
 */

import { getLocalImages, type LocalImage } from './local-images';
import { heroFrames } from './snow-partnership';

export const SNOW_PICK_TAG = 'use:snow';
export const SNOW_HIDE_TAG = 'use:snow-hide';

export interface SnowFrame {
  src: string;
  alt: string;
  caption: string;
}

/** `community:tennant-creek` becomes `Tennant Creek`. Hyphens out, words up. */
function titleCase(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** `kids-carrying-orange-bed.jpg` becomes `Kids carrying orange bed`. */
function altFromFilename(filename: string): string {
  const stem = filename.replace(/\.(jpe?g|png|webp)$/i, '').replace(/[-_]+/g, ' ').trim();
  if (!stem) return '';
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}

/**
 * The caption for a tagged frame. A community tag wins, because the place is the thing a
 * funder wants named. Otherwise the archive area carries it. Null means it does not go up.
 */
function captionFor(image: LocalImage): string | null {
  const community = image.tags.find((t) => t.startsWith('community:'));
  if (community) return `${titleCase(community.slice('community:'.length))}.`;
  const place = image.tags.find((t) => t.startsWith('place:'));
  if (place) return `${titleCase(place.slice('place:'.length))}.`;
  if (image.area && image.area !== 'root') return `${titleCase(image.area)}.`;
  return null;
}

/**
 * The hero strip: the curated wall, less anything hidden, plus anything picked.
 *
 * Reads the filesystem, so it is server-only and is called from the page's server component.
 * Any failure falls back to the curated wall rather than an empty hero.
 */
export function snowHeroFrames(): SnowFrame[] {
  const base = heroFrames();
  let images: LocalImage[] = [];
  try {
    images = getLocalImages();
  } catch {
    return base;
  }

  const hidden = new Set(
    images.filter((i) => i.tags.includes(SNOW_HIDE_TAG)).flatMap((i) => [i.url, ...(i.aliases ?? [])]),
  );
  const kept = base.filter((f) => !hidden.has(f.src));
  const already = new Set(kept.map((f) => f.src));

  const added: SnowFrame[] = [];
  for (const image of images) {
    if (!image.tags.includes(SNOW_PICK_TAG)) continue;
    if (already.has(image.url)) continue;
    if (hidden.has(image.url)) continue;
    const caption = captionFor(image);
    if (!caption) continue;
    const alt = altFromFilename(image.filename) || caption.replace(/\.$/, '');
    added.push({ src: image.url, alt, caption: `${alt}. ${caption}` });
    already.add(image.url);
  }

  return [...kept, ...added];
}
