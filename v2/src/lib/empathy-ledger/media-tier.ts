// The media privacy model for Empathy Ledger content shown on Goods surfaces.
//
// Every EL media item (story image, storyteller portrait, gallery photo) passes
// through this gate before it can render. There are three tiers:
//
//   never   — no consent, consent withdrawn, archived, not public, OR elder
//             review required but not yet done. Elder-review-pending = never.
//   gated   — consent + public + (no elder requirement OR elder-reviewed).
//             Allowed on partner-password pages only (e.g. a funder dashboard).
//   public  — gated AND also in the public-cleared set (getGoodsStories).
//             Allowed anywhere, including the open web.
//
// On top of the tier, a hard BUCKET GUARD: EL's public images live in the
// `story-images` bucket and load without auth; the `media` bucket is private
// and 404s publicly. safeImageUrl() only ever returns a URL we know renders, so
// a private-bucket photo can never surface even if a consent flag is wrong.

export type MediaTier = 'never' | 'gated' | 'public';
export type Surface = 'public' | 'gated';

export interface ConsentFlags {
  hasConsent: boolean;
  isPublic: boolean;
  requiresElderReview: boolean;
  elderReviewed: boolean;
  consentWithdrawn?: boolean;
  isArchived?: boolean;
}

/** Classify an EL item's consent tier. `inPublicClearedSet` = it is also in getGoodsStories. */
export function mediaTier(f: ConsentFlags, opts: { inPublicClearedSet?: boolean } = {}): MediaTier {
  if (!f.hasConsent || f.consentWithdrawn || f.isArchived || !f.isPublic) return 'never';
  if (f.requiresElderReview && !f.elderReviewed) return 'never';
  return opts.inPublicClearedSet ? 'public' : 'gated';
}

/** Can this tier render on the given surface? */
export function canShow(tier: MediaTier, surface: Surface): boolean {
  if (tier === 'never') return false;
  return surface === 'gated' ? true : tier === 'public';
}

/**
 * The bucket guard. Returns the URL only if it is safe to render:
 *  - local /images/... assets pass through
 *  - EL `story-images` (and other non-`media`) public-bucket URLs pass through
 *  - EL private `media` bucket URLs (which 404 publicly) are dropped to null
 * Never returns a private-bucket URL, so a private photo cannot leak by accident.
 */
export function safeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('/')) return url;
  if (url.includes('/storage/v1/object/public/media/')) return null;
  return url;
}
