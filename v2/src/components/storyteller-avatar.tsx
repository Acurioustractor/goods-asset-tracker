'use client';

import { useState } from 'react';

/**
 * Storyteller portrait with a bulletproof fallback. Routes the portrait through
 * the Goods /api/portrait proxy (which resolves EL's private-bucket signed URLs
 * server-side), and if the image still fails to load, shows the person's initials
 * instead of a broken square. Use everywhere a storyteller portrait renders so an
 * EL image hiccup never shows a broken image again.
 */
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

  // Route absolute EL/supabase urls through the proxy; leave local /images as-is.
  const proxied =
    src && /^https?:\/\//.test(src) ? `/api/portrait?src=${encodeURIComponent(src)}` : src || null;

  if (!proxied || failed) {
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
      src={proxied}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
