// Per-community media map for the public /communities pages.
//
// PROVENANCE RULE: an image or video is mapped to a community ONLY when we
// know it was shot there. A generic product/landscape shot must never imply
// place. Communities without verified local media simply render without a
// hero photo (the page falls back to a text header + map) — that is the safe
// direction. Add entries here as verified media lands; the pages pick them up
// with no layout changes.
//
// Videos: per-community video is wired but deliberately empty until a clip
// with known provenance + clearance exists for that community. The generic
// cross-community film (public/video/community-*.mp4) belongs on the
// /communities INDEX, where "across communities" framing is honest — not on a
// single community's page.

export interface CommunityImage {
  src: string;
  alt: string;
}

export interface CommunityMedia {
  /** Hero image for the community detail page + thumbnail on the index. */
  hero?: CommunityImage;
  /** Photo grid on the detail page. */
  gallery?: CommunityImage[];
  /** Optional community-specific film. Only set with verified provenance. */
  video?: { desktop: string; mobile: string; poster: string; title: string };
}

const utopiaGallery: CommunityImage[] = Array.from({ length: 10 }, (_, i) => ({
  src: `/images/utopia/utopia-${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `On country in Utopia Homelands — bed delivery trip photo ${i + 1}`,
}));

export const COMMUNITY_MEDIA: Record<string, CommunityMedia> = {
  'tennant-creek': {
    hero: {
      src: '/images/community/tennant-creek.jpg',
      alt: 'Tennant Creek community — where Goods on Country began',
    },
  },
  'utopia-homelands': {
    hero: {
      src: '/images/utopia/utopia-01.jpg',
      alt: 'On country in Utopia Homelands',
    },
    gallery: utopiaGallery,
  },
};

/** Media for a community id. Always returns an object; fields may be absent. */
export function communityMedia(id: string): CommunityMedia {
  return COMMUNITY_MEDIA[id] ?? {};
}
