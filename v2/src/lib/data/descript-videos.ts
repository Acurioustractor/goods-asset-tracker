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
  // ── Voices. Cleared people speaking for themselves, not audience cuts. ──
  // Added 2026-09-16. Both had been cleared in storyteller-registry.ts for weeks but
  // were never registered here, so neither could reach a surface through the media
  // pipeline: the registry knows the words are usable, this file is what makes the
  // recording reachable. Quotes were being cited from transcripts of videos the app
  // had no record of.
  {
    viewId: 'QOpJepwNzo9',
    title: 'Georgina Byron AM, reflections on the Tennant Creek trip',
    beat: 'funder',
    poster: '/images/media-pack/snow-tennant-creek-april-2025.jpg',
    cleared: true,
    canonFresh: true,
    note:
      'The funder-witness recording. Source of the catalytic-capital and backing-the-founder quotes in storyteller-registry.ts (georgina-byron). Tier is `funder`: label her as Snow Foundation, NEVER place her in the community storyteller set. Two quotes from this recording are at status `hold` (a proper noun the auto-transcript damaged, and a referendum passage that is Snow\'s to publish, not ours). Check any quote against this audio before printing it: the transcript has known ASR errors.',
  },
  {
    viewId: '6hVl3CzxdqR',
    title: 'Jahvan Oui, Defy Design factory visit',
    beat: 'ownership',
    poster: '/images/people/jahvan-oui.jpg',
    cleared: true,
    canonFresh: true,
    note:
      'Jahvan cleared by Ben 2026-07-26 (storyteller-registry.ts, jahvan-oui). The Palm Island ownership voice, and the human outcome of the VFFF/FRRR Backing the Future grant, acquitted Mar 2026. WARNING before publishing the cut whole: the unnamed washing-machine recipients (Speakers 22 and 23) are NOT consent-cleared and none of their words may be used. Clipped quotes of Jahvan are fine; the full recording needs a review pass first. Ebony Oui is not cleared as her own voice.',
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
