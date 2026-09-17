/**
 * THE CAPTION A PHOTOGRAPH CARRIES, EDITED IN THE MEDIA ROOM RATHER THAN IN CODE.
 *
 * Ben, 17 September 2026, looking at an archive where every tile printed the wrong place: give
 * me a simple way to fix this. The reason he could not was that a photograph's description lived
 * in code, in the `alt` typed by hand into WALLS, so correcting one label meant an edit, a build
 * and a deploy.
 *
 * It did not need a new store. `content_items.notes` already exists, is already written by the
 * Notes box on every indexed image at /admin/media-library, and was being read by nothing. This
 * module reads it and hands it to the page.
 *
 * WHAT WINS: a note beats the alt typed in code, and an image with no note keeps whatever the
 * code gave it. So nothing moves until somebody fixes something, and when they do it is fixed
 * everywhere the photograph appears rather than on one page.
 *
 * WHY NOT local-image-tags.json: that file is seed-only now. The Media Room writes tags to
 * content_items, and a second store would be the same mistake in a new place.
 */

import { createServiceClient } from '@/lib/supabase/server';

/** One fetch per server instance per TTL; every surface that shows a photo shares it. */
const TTL_MS = 5 * 60 * 1000;
let cache: { at: number; byUrl: Map<string, string> } | null = null;

async function fetchNotes(): Promise<Map<string, string>> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.byUrl;
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('content_items')
      .select('url,notes')
      .not('notes', 'is', null)
      .is('archived_at', null);
    if (error) return cache?.byUrl ?? new Map();
    const byUrl = new Map<string, string>();
    for (const row of (data ?? []) as { url: string | null; notes: string | null }[]) {
      const note = row.notes?.trim();
      if (row.url && note) byUrl.set(row.url, note);
    }
    cache = { at: Date.now(), byUrl };
    return byUrl;
  } catch {
    return cache?.byUrl ?? new Map();
  }
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * THE WORDS A PHOTOGRAPH GETS WHEN NOBODY HAS WRITTEN IT A CAPTION YET.
 *
 * A filename is only worth reading out loud when a person typed it. A photograph dragged in from
 * Google Photos is called ap1gczpi7zvhs3tvca5-keoi-9h9xlkriqq, and printing that as the alt text
 * puts a hash on a funder's page. So machine noise is dropped, and what is left is the date, which
 * the file carries and which is always true.
 */
export function altFromUrl(url: string): string {
  const stem = (url.split('/').pop() ?? '').replace(/\.[a-z]+$/i, '');
  const date = stem.match(/^(\d{4})-(\d{2})-(\d{2})-?/);
  const when = date ? `${Number(date[3])} ${MONTHS[Number(date[2]) - 1]} ${date[1]}` : '';
  const tokens = stem
    .slice(date?.[0].length ?? 0)
    .split(/[-_]+/)
    .filter(Boolean)
    // A bare number is a year or a counter. It neither proves nor disproves a human name.
    .filter((w) => !/^\d+$/.test(w));
  // ONE junk token condemns the whole name. Half a hash is still a hash, and "keoi attteh" read
  // no better on the page than the string it was cut from.
  const readable = tokens.length > 0 && tokens.every((w) => w.length >= 3 && /[aeiou]/i.test(w) && !/\d/.test(w));
  if (!readable) return when ? `Goods on Country, ${when}` : 'Goods on Country';
  const said = tokens.join(' ');
  return `${said[0].toUpperCase()}${said.slice(1)}`;
}

export interface Captionable {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Overlay the Media Room notes onto a set of photographs. Server-side only. Any failure returns
 * the photographs untouched, so a database hiccup never blanks an archive.
 */
export async function withCaptions<T extends Captionable>(photos: readonly T[]): Promise<T[]> {
  const notes = await fetchNotes();
  if (notes.size === 0) return [...photos];
  return photos.map((p) => {
    const note = notes.get(p.src);
    return note ? { ...p, alt: note, caption: p.caption ?? note } : p;
  });
}

/** The same overlay for a set of groups, which is the shape the archive wall takes. */
export async function withGroupCaptions<T extends Captionable>(
  groups: readonly { label: string; photos: T[] }[],
): Promise<{ label: string; photos: T[] }[]> {
  const notes = await fetchNotes();
  if (notes.size === 0) return groups.map((g) => ({ ...g }));
  return groups.map((g) => ({
    ...g,
    photos: g.photos.map((p) => {
      const note = notes.get(p.src);
      return note ? { ...p, alt: note, caption: p.caption ?? note } : p;
    }),
  }));
}

/**
 * PHOTOGRAPHS CARRYING A TAG, FROM THE DATABASE RATHER THAN THE SEED FILE.
 *
 * The gap this closes: the Media Room writes tags to content_items, but the Snow picks were
 * reading them from local-image-tags.json, which has been seed-only since tags moved to the
 * database. So Ben tagged a photograph use:snow, watched it save, and it did not appear on the
 * page. It does now.
 */
export async function taggedPhotos(tag: string): Promise<{ src: string; alt: string; caption?: string }[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('content_items')
      .select('url,notes,tags')
      .eq('media_type', 'image')
      .is('archived_at', null)
      .contains('tags', [tag]);
    if (error) return [];
    return ((data ?? []) as { url: string | null; notes: string | null; tags: string[] | null }[])
      .filter((r) => r.url && !r.tags?.includes(`${tag}-hide`))
      .map((r) => {
        const note = r.notes?.trim();
        return { src: r.url as string, alt: note || altFromUrl(r.url ?? ''), caption: note ?? undefined };
      });
  } catch {
    return [];
  }
}
