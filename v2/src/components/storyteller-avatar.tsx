'use client';

import { useState } from 'react';

/**
 * Storyteller portrait with a bulletproof fallback. Resolves the portrait the
 * cheapest way that will actually load in a browser:
 *   - local /images path            -> render directly
 *   - PUBLIC supabase object url     -> render directly (no proxy hop; e.g. Jimmy Frank)
 *   - any other remote url (EL proxy / private story-media bucket) -> route through
 *     /api/portrait, which resolves EL's private-bucket signed URLs server-side.
 * If the image still fails to load, show the person's initials instead of a broken
 * square. Use everywhere a storyteller portrait renders so an EL hiccup never shows
 * a broken image again.
 */

/**
 * A url the browser can load directly, with no proxy: a local path, a data url, or
 * a PUBLIC supabase object url (public buckets serve without auth or a redirect
 * chain). Everything else (empathyledger.com/api/media proxy urls, private
 * story-media bucket urls) needs /api/portrait to resolve server-side with the EL key.
 */
export function isDirectlyLoadable(src: string): boolean {
  if (!/^https?:\/\//.test(src)) return true; // local /images path or relative
  return /\/storage\/v1\/object\/public\//.test(src); // public supabase bucket
}

export function resolvePortraitSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  if (isDirectlyLoadable(src)) return src;
  return `/api/portrait?src=${encodeURIComponent(src)}`;
}

export function StorytellerAvatar({
  name,
  src,
  className = '',
  size = 56,
}: {
  name: string;
  src: string | null | undefined;
  className?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  const initials = (name || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  const resolved = resolvePortraitSrc(src);

  if (!resolved || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.34 }}
        aria-label={name}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={name}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
