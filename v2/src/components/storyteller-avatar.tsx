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
  if (EL_RELATIVE.test(src)) return false; // EL's own relative media path, not ours
  if (!/^https?:\/\//.test(src)) return true; // local /images path or relative
  return /\/storage\/v1\/object\/public\//.test(src); // public supabase bucket
}

/**
 * EL records a portrait as `/api/media/<uuid>/file`, a path on ITS origin. Rendered here it
 * resolves against ours, so Margaret Lloyd's portrait was a 404 on goodsoncountry.com for as long
 * as it has been in the data: a real photo, a real id, pointed at a route we do not have. Give it
 * EL's host back and let /api/portrait resolve the id.
 */
const EL_RELATIVE = /^\/api\/media\/[0-9a-fA-F-]{36}\/file/;

export function resolvePortraitSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  const absolute = EL_RELATIVE.test(src) ? `https://www.empathyledger.com${src}` : src;
  if (isDirectlyLoadable(absolute)) return absolute;
  return `/api/portrait?src=${encodeURIComponent(absolute)}`;
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
  // A direct url that fails gets one more try through /api/portrait, which can find a moved file
  // by name. Shayne Bloomfield's portrait is the case: recorded against a public bucket that no
  // longer answers, while the file itself sits in the private one under the same name. Only then
  // do we give up and show initials.
  const [stage, setStage] = useState<'direct' | 'proxy' | 'initials'>('direct');

  const initials = (name || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  const resolved = resolvePortraitSrc(src);
  const proxied = resolved && resolved.startsWith('/api/portrait');
  const shown = stage === 'proxy' && resolved && !proxied
    ? `/api/portrait?src=${encodeURIComponent(resolved)}`
    : resolved;

  if (!shown || stage === 'initials') {
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
      key={shown}
      src={shown}
      alt={name}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setStage(stage === 'direct' && !proxied ? 'proxy' : 'initials')}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
