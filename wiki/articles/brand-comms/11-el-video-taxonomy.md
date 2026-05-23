# EL video taxonomy — how to tag a Goods video

> **What this is.** The shared vocabulary every Goods video gets tagged
> with when it lands in Empathy Ledger. The taxonomy is intentionally
> small so it stays memorable. If you can't remember the axes, the
> system isn't worth it.
>
> **Why it matters.** Trip stories, hero overlays, funder decks and
> gallery blocks all retrieve videos from EL by tag. A video tagged
> wrong is a video nobody finds.

## The four axes

Every Goods video carries **at least one tag per axis**.

### 1. `use:*` — what role does the video play? (pick ONE of 5)

| value          | when to use                                                                       | typical length |
| -------------- | --------------------------------------------------------------------------------- | -------------- |
| `atmosphere`   | Silent loop, drives mood. Backgrounds. No on-camera text. Loops cleanly.          | 8–20s          |
| `voice`        | Someone speaking on camera. Audio is the point. Subtitle when public.             | 15–90s         |
| `process`      | Showing how something works. Assembly, plant operation, manufacturing.            | 30–120s        |
| `moment`       | Captured event. The unloading, the nod, the handover. Has emotional weight.      | 5–45s          |
| `establishing` | Wide shot, place + scale. Drone footage, landscape, community arrival.            | 5–30s          |

### 2. `placement:*` — where can it sit on a page? (pick ONE OR MORE of 3)

| value                  | meaning                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `overlay-fullscreen`   | Can be used as a hero background. Must have a stable poster + no on-camera text + loop.  |
| `under-text`           | Sits below a paragraph in a section. Audio with captions when public.                    |
| `standalone-card`      | Own tile in a video gallery. Any use type works here.                                    |

A drone arrival shot is typically `use:establishing` + `placement:overlay-fullscreen` + `placement:standalone-card` — three tags, two axes.

### 3. Context (the existing canonical set)

| tag                          | required? | example                       |
| ---------------------------- | --------- | ----------------------------- |
| `community:<slug>`           | yes       | `community:utopia-homelands`  |
| `trip:<slug>`                | yes       | `trip:may-2026`               |
| `participant:<slug>`         | optional  | `participant:mykel` — ONLY when a single person is the subject AND has consented |
| `theme:<slug>`               | optional  | `theme:family`, `theme:health` (multiple OK) |
| `product:<slug>`             | optional  | `product:stretch-bed`         |

### 4. Consent + provenance

| tag                          | when                                                                |
| ---------------------------- | ------------------------------------------------------------------- |
| `consent:elder-pending`      | default — private until elder review                                |
| `consent:public`             | explicit consent verified, cleared for public use                   |
| `goods-staff-capture`        | filmed by Goods team                                                |
| `community-submitted`        | submitted by community member via /bed/[id] flow                    |
| `format:video`               | always (set by uploader)                                            |
| `media-type:video`           | always (set by uploader)                                            |

## Two ways to upload

### A. One-off form: `/admin/videos/new`

Best for single videos when you don't want to think about filenames.

Drag the file in, pick the four dropdowns, tick consent if you have it,
hit upload. ffmpeg runs locally to extract a 1s poster + re-encode to
H.264 1080p. Story lands in EL with all canonical tags.

Only works on local dev (`npm run dev`) because ffmpeg isn't available
in Vercel's runtime.

### B. Bulk script: `scripts/upload-videos.mjs`

Best for trips when you have 5+ videos all from the same event.

Filename convention encodes the most important axes:

```
{use}_{placement}_{community}_{subject-or-participant}_{durationS}s.mp4
```

The `{placement}` slot is optional — if absent, defaults apply:
- `atmosphere` + `establishing` → also get `placement:overlay-fullscreen`
- `voice` + `moment` → also get `placement:under-text`
- All videos always get `placement:standalone-card`

Examples:

```
atmosphere_overlay-fullscreen_alice_shed-build-loop_14s.mp4
voice_under-text_utopia_mykel-bed-reflection_42s.mov
moment_standalone-card_ampilatwatja_elder-nod_8s.mp4
establishing_alice_drone-arrival_18s.mp4              # placement defaults apply
voice_utopia_unidentified-builder_28s.mov              # placement + name minimal
```

Then run from `v2/`:

```bash
node scripts/upload-videos.mjs /path/to/folder \
  --trip trip-may-2026 \
  --community utopia-homelands \
  --theme family,health
```

CLI flags are fallbacks — filename overrides them per file. Idempotent
via `/tmp/el-videos-upload.json` manifest, so re-running the same folder
skips already-uploaded videos.

## Curation loop

1. **Upload** via form or script. Default consent is pending.
2. **Open `/admin/photos`**, switch to the `🎬 Videos` filter chip.
3. **Review** each video. Click "Approve public" on the ones with
   verified consent.
4. **Retrieve**: any trip-story `el-video-gallery` block or hero
   `fromTag` query picks up approved videos automatically the next
   time the page loads. No code change needed.

## Hero auto-pull (advanced)

Trip-story `MediaRef` fields (masthead, immersive, bleedquote, close)
accept an optional `fromTag` field:

```ts
media: {
  image: '/images/utopia/01-hero.jpg',
  videoDesktop: '/video/utopia/hero-fallback.mp4',  // fallback if no EL match
  fromTag: { all: ['trip:may-2026'] },
}
```

The server resolver appends `placement:overlay-fullscreen` automatically
and fetches the first matching video. The declared image + video paths
act as fallback if no match is found. Upload a new tagged video to swap
the hero, no code edit required.

## When in doubt

- If you can't decide between two `use:*` values, pick the one that
  matches the **audio expectation**. Atmosphere = silent. Voice = audio.
  Process = audio with narration. Moment = audio OR silent. Establishing
  = usually silent.
- If you can't decide on `placement:*`, just pick `standalone-card`.
  The video can always be re-tagged later.
- If consent is unclear, leave it as `consent:elder-pending`. Don't
  publish until the person on camera has personally cleared it.
