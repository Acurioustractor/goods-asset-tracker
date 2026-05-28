# Field-notes authoring guide

How a new trip becomes a published Goods field note. Designed so anyone on the team can do it without rebuilding the system, and so every story stays in sync with the canonical facts in `products.ts` + `story-atoms.ts`.

This guide assumes you have already followed [`CONSENT_PROCESS.md`](./CONSENT_PROCESS.md) for any voices and faces you want to use.

---

## The two surfaces that do all the work

| Surface | What it's for | URL |
|---|---|---|
| **Block library** | Every block kind with examples + copy-as-snippet buttons. Your authoring atlas. | `/admin/field-notes/library` |
| **Stories index** | Every story with its state, block breakdown, internal/public preview links. Your dashboard. | `/admin/field-notes` |

If you're new to this, start at `/admin/field-notes/library`.

---

## The one file you edit

**`v2/src/lib/data/trip-stories.ts`** — exports `tripStories: TripStory[]`. Each entry is one story. Add a new entry, the new story appears in `/admin/field-notes` immediately.

You will not need to touch:
- The renderer (`v2/src/components/stories/trip-story.tsx`)
- The atoms (`v2/src/lib/data/story-atoms.ts`) unless you want to update universal copy
- The community map data (`v2/src/lib/data/content.ts`) unless you're adding a new community pin

---

## The block kinds, briefly

| Category | Kinds | Source of content |
|---|---|---|
| **Atom** (universal, edit-once) | `problem-statement` · `goods-facts` · `health-facts` · `production-plant-facts` · `live-map` | `story-atoms.ts` + `products.ts` + `communityLocations` |
| **Bespoke** (hand-written per trip) | `masthead` · `immersive` · `read` · `bleedquote` · `stats` · `voices` · `videos` · `pathways` · `close` | The story file. Your prose. |
| **Structural** (self-aware) | `portal` | Auto-pulls other field notes |

A typical 12-block story is **~7 bespoke + 4 atom + 1 portal**. The bespoke beats carry the trip's specific story. The atoms keep the universal claims (bed specs, health framing, plant status, deployment map) accurate forever without you having to remember them.

Every block kind is documented at `/admin/field-notes/library` with a copy-as-snippet button.

---

## Step-by-step: from trip-done to published

### 1. Photos to Empathy Ledger (already covered by `v2/scripts/upload-real-trip-photos.mjs`)

Drop your AirDropped JPGs into a folder and run:

```bash
node v2/scripts/upload-real-trip-photos.mjs
```

(Edit the folder path inside the script for new trips, or use the generic `upload-trip-photos-to-el.mjs` with CLI flags.)

Each photo becomes an EL story with default tags: `trip:<slug>`, `community:<community>`, `goods-staff-capture`, `pending-elder-review`, `is_public:false`. They land in `/admin/photos`.

### 2. Videos to Empathy Ledger (when edited)

Premiere export with the filename convention:

```
{use}_{community}_{subject}_{duration}s.mp4

hero-overlay_utopia_outstation-arrival_12s.mp4
testimonial_utopia_ray-nelson_42s.mp4
setup_universal_stretch-bed-assembly_85s.mp4
behind_alice_production-plant_98s.mp4
per-bed_utopia_gb0-156-96_22s.mp4
```

Then:

```bash
node v2/scripts/upload-videos.mjs "/path/to/edits"
```

Tags auto-derive from filenames. ffmpeg extracts a poster + re-encodes for web. Idempotent via manifest.

### 3. Stills for the scrollytelling background (~11 photos)

Pick 11 hero stills and drop them in `v2/public/images/stories/<slug>/01-...jpg ... 11-...jpg`. Update the manifest at `wiki/outputs/<slug>-media/MANIFEST.txt` so the source is traceable.

These are the background images for the masthead, immersive scenes, bleedquote, and close blocks.

### 4. Add the TripStory entry

Open `v2/src/lib/data/trip-stories.ts`. Add an entry to the `tripStories` array. Use Utopia (`utopia-may-2026`) as your template.

Start with:

```ts
const tennantCreekOrigin: TripStory = {
  slug: 'tennant-creek-origin',
  title: 'Where it began',
  summary: 'How the first bed reached Dianne in Tennant Creek, and why she came back asking for twenty more.',
  dateline: 'Tennant Creek, NT · 2023 onward',
  published: false,
  blocks: [
    // start with masthead, end with portal, fill the middle with the 7-beat spine
  ],
};

export const tripStories: TripStory[] = [utopia, tennantCreekOrigin];
```

### 5. Fill the blocks using the 7-beat spine

| Beat | Block kind(s) |
|---|---|
| Anchor | `masthead` |
| Setting | `problem-statement` (atom) + `read` (setting-specific prose) |
| First voice | `bleedquote` |
| The work | 2-3 `immersive` and `read` alternating + `goods-facts` (atom) + `health-facts` (atom) |
| Voices grid | `voices` |
| Future | `production-plant-facts` (atom) + `read` (place-specific future) + `live-map` (atom) |
| Pathways | `close` + `pathways` + `portal` |

Use the [block library](http://localhost:3004/admin/field-notes/library) to copy each snippet, paste, edit the bespoke fields.

### 6. Preview at `/admin/field-notes/<slug>` (internal)

The internal route shows voices marked `consent: 'pending'`. Iterate until the prose sings.

### 7. Capture consent for every voice + face

Follow [`CONSENT_PROCESS.md`](./CONSENT_PROCESS.md). For each voice:
- Create the EL storyteller record + the story record
- Capture verbatim quote, language preference, attribution preference, sharing scope (Goods only / public / specific outlets)
- For young people: family/guardian consent plus the appropriate cultural facilitation (e.g. Oonchiumpa for Mykel)
- Update [`CONSENT_BACKLOG.md`](./CONSENT_BACKLOG.md)

### 8. Flip the voices to cleared

In `trip-stories.ts`, for each cleared voice change `consent: 'pending'` → `consent: 'cleared'`. If you've created a storyteller page, add `storytellerSlug: 'their-slug'` and the voice card auto-links.

### 9. Approve the hero photos in `/admin/photos`

Open `/admin/photos`, filter to your trip's tag (or `canon-r6` for the Canon shots), tap "✓ Approve public" on 6-12 hero photos. They flip `is_public=true` + `elder_reviewed=true` and become available to the deck renderer.

Also use the **🏷️ Bulk tag** action on the selection footer to add structured tags at scale:

```
participant:ray-nelson, theme:family, use:hero-photo
```

### 10. Set `published: true`

Only when:
- Every voice card on the story is `consent: 'cleared'`
- The story has been reviewed by Goods leadership
- Any community partners named (e.g. Oonchiumpa) have signed off

Then in `trip-stories.ts`:

```ts
published: true,
```

The public route `/field-notes/<slug>` flips from 404 to live.

### 11. Commit on a branch (NOT main)

```bash
git checkout -b field-notes-<slug>
git add v2/src/lib/data/trip-stories.ts v2/public/images/stories/<slug>
git commit -m "Add <slug> field note"
git push origin field-notes-<slug>
```

Open a PR for review before merging to main.

---

## Voice rules (non-negotiable, see [`01-voice-and-tone.md`](./01-voice-and-tone.md))

- **No em dashes.** Use colons, periods, parentheticals.
- **Sentence case** for headings (not Title Case).
- **Verbatim quotes only.** Never combine quotes across speakers. Always attribute by name.
- **Name people.** "Ray Nelson" not "a recipient". Hold names only when consent isn't there yet.
- **Lead with impact, not charity.** "Beds in homes" not "beneficiaries served".
- **Verified numbers only.** If you can't source it from `products.ts`, `compendium.ts`, the asset register, or an EL story, don't use it.
- **Always "On Country" / "On-Country"** capitalised. Country is a proper noun.
- **No "donate" / "charity" / "empower" / "unlock" / "beneficiaries".**

---

## The atom library — universal copy

Currently in `story-atoms.ts`:

| Atom | Variants |
|---|---|
| `problemStatement` | One, the universal Goods framing. Edit here, every story updates. |
| `healthFramings` | Three: `rhd-prevention`, `sleep-and-skin`, `washing-machine-cycle`. Pick the angle that fits the scene. |
| `productionPlantFacts` | One, with status + capacity + components. Edit when plant changes. |
| `goodsBedStats` | Aliased from `products.ts`. Edit specs there, this updates. |

Add a new atom: define an exported constant in `story-atoms.ts`, add a new block kind in `trip-stories.ts`, render case in `trip-story.tsx`. Three small touches.

---

## Replicating for other communities

The atom system means Tennant Creek and Palm Island stories reuse the **universal** atoms verbatim. Each story only writes the **bespoke** beats — the masthead, the immersive scenes, the bleedquotes, the voice cards, the close, the pathways. About ~50 lines of TypeScript per story.

Suggested first three:

| Story | Anchor | First bleedquote | Closing emphasis |
|---|---|---|---|
| **Tennant Creek** (origin) | The first bed reached Dianne. | "Hardly anyone around the community has beds." — Ivy | Buy a bed (the bed proven first). |
| **Palm Island** (scale) | 141 beds. One island. Started with two voices. | "Palm Island Community Company offered to buy the plant outright." | Partner with us (community ownership). |
| **Utopia** (current chapter) | Young people built the beds. One wanted to keep building. | "Comfortable as. Smooth, tight, hard, fancy. It's not trampoline." — Mykel | Support scale (Centrecorp commitment closing). |

When all three exist, every story's `portal` block auto-shows the other two as siblings — no manual cross-linking.

---

## Where to ask for help

- Block kinds: `/admin/field-notes/library`
- Photo curation: `/admin/photos`
- Funder reports (related, separate engine): `/admin/funders` and `/admin/reports`
- Consent process: `CONSENT_PROCESS.md`
- Voice rules: `01-voice-and-tone.md`
- Storyteller library: `02-storyteller-voices.md`
