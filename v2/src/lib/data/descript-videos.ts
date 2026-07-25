// Curated Descript video cuts, surfaced as first-class items in the Media Room.
// These are hosted on Descript (share.descript.com), not local .mp4 files, so they
// carry their own consent + canon flags here and embed via an iframe in the viewer.
//
// Source of truth for the mapping + flags is the Notion "Goods Video Map" page
// (3a6ebcf981cf81b3a6cee03c36d24f92). Keep the two in sync when a cut is added,
// re-recorded, or cleared. Posters reference real hosted /images or /video files.

export interface DescriptVideo {
  /** The share.descript.com/view/<viewId> id. */
  viewId: string;
  title: string;
  /** Storyboard beat / area this cut belongs to (used as the grid `area`). */
  beat: string;
  /** Real hosted poster image (/images/... or /video/...). */
  poster: string;
  /** Consent cleared for external use. false = held (do not surface publicly). */
  cleared: boolean;
  /** true = figures are current canon. false = older cut with stale numbers. */
  canonFresh: boolean;
  /** Short human note (shown in the viewer). */
  note?: string;
}

export const DESCRIPT_VIDEOS: DescriptVideo[] = [
  {
    viewId: 'haRZJbfJadJ',
    title: 'The walkthrough (Nic, production facility)',
    beat: 'walkthrough',
    poster: '/images/process/20260329-factory-panorama.jpg',
    cleared: true,
    canonFresh: false,
    note: 'Main walkthrough. Cut Feb 2026 — if bed counts are spoken they read 496/16/2660 (behind canon 540/22/3540). Fine as a facility tour; re-cut only if figures are on screen.',
  },
  {
    viewId: 'Xtrc5ZYsym6',
    title: 'Stretch Bed timelapse',
    beat: '05 the loop',
    poster: '/images/process/pressed-sheets-stacked.jpg',
    cleared: true,
    canonFresh: true,
    note: 'Object only, no consent gate. Wired to slide 05.',
  },
  {
    viewId: 'YQwAcYfxzkn',
    title: 'Fred and Xavier',
    beat: '07 built by them',
    poster: '/images/build/build-001.jpg',
    cleared: true,
    canonFresh: true,
    note: 'Cleared voices. Xavier under the narration rule (Fred narrates, no direct Xavier quotes). Wired to slide 07.',
  },
  {
    viewId: 'LAT0KNJMxmH',
    title: 'Jaquilane, Alice Springs',
    beat: 'people',
    poster: '/video/jaquilane-poster.jpg',
    cleared: false,
    canonFresh: true,
    note: 'HELD. Live on the site but not in cleared-voices.ts; confirm consent before placing on a new external slide.',
  },
  // The six Feb-2026 audience walkthroughs — stale canon. Kept for reference /
  // re-record, never sent as current.
  {
    viewId: 'bkukTRVlJI9',
    title: 'Snow Foundation cut',
    beat: 'audience',
    poster: '/images/media-pack/lying-on-stretch-bed.jpg',
    cleared: true,
    canonFresh: false,
    note: 'Audience cut, Feb 2026. Stale figures (496/16/2660). Re-record before use.',
  },
  {
    viewId: 'pZ1S0ACn1Fd',
    title: 'PICC cut',
    beat: 'audience',
    poster: '/images/media-pack/lying-on-stretch-bed.jpg',
    cleared: true,
    canonFresh: false,
    note: 'Audience cut, Feb 2026. Stale figures. Re-record before use.',
  },
  {
    viewId: 'jJlpylKEh51',
    title: 'Community general cut',
    beat: 'audience',
    poster: '/images/media-pack/lying-on-stretch-bed.jpg',
    cleared: true,
    canonFresh: false,
    note: 'Audience cut, Feb 2026. Stale figures. Re-record before use.',
  },
  {
    viewId: 'wuBq1QFnI9p',
    title: 'Oonchiumpa cut',
    beat: 'audience',
    poster: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg',
    cleared: true,
    canonFresh: false,
    note: 'Audience cut, Feb 2026. Stale figures. Re-record before use.',
  },
  {
    viewId: '7MgH5VVhZVc',
    title: 'The Funding Network cut',
    beat: 'audience',
    poster: '/images/media-pack/lying-on-stretch-bed.jpg',
    cleared: true,
    canonFresh: false,
    note: 'Audience cut, Feb 2026. Stale figures. Re-record before use.',
  },
];

/** view/embed URL helpers. */
export const descriptViewUrl = (viewId: string) => `https://share.descript.com/view/${viewId}`;
export const descriptEmbedUrl = (viewId: string) => `https://share.descript.com/embed/${viewId}`;
