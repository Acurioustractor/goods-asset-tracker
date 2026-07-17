// Admin: the System visuals board. Reviews every diagram/illustration used to
// explain how Goods works (bed anatomy, assembly, the plastic loop, ownership,
// the cost model, theory of change), plus canon/deck images, storyteller
// portraits, and community images — one page to review and pick from.
//
// The process-diagram concepts below are hand-verified against actual
// <Image src> usage in the app (accuracy matters there, so they're a
// hardcoded list you edit deliberately). The Canon / Storytellers /
// Communities sections are the opposite by design: they read LIVE from the
// same sources their own admin pages write to, so adding a new one there
// (pin a canon image in /admin/canon, tag a photo with a community in
// /admin/media-library) makes it show up here automatically — no code change.
//
// Reads five sources, read-only:
//  - v2/public/**                              (live web images; hardcoded refs, verified)
//  - generated-images/goods-illustrations/**    (gitignored, local-only draft pool)
//  - design/deck-photos/**                      (the Pencil investor-deck art)
//  - design/image-canon.json                    (the Canon board's index)
//  - storyteller-registry.ts + content_items    (portraits; community-tagged photos)
// generated-images/ is gitignored (CLAUDE.md "no large media in git"), so its
// section is empty on Vercel — this board is most useful run locally.
import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { STORYTELLER_REGISTRY } from '@/lib/data/storyteller-registry';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GENERATED_ROOT = 'generated-images/goods-illustrations';
const DECK_PHOTOS_ROOT = 'design/deck-photos';

function repoRoot(): string {
  const cwd = process.cwd();
  return cwd.endsWith(`${path.sep}v2`) ? path.resolve(cwd, '..') : cwd;
}

function apiSrc(relPath: string): string {
  return `/api/admin/system-visual-image?path=${encodeURIComponent(relPath)}`;
}

// Turns any string into a valid, unique-enough HTML id for the lightbox anchor.
function slug(s: string): string {
  return `lb-${s.replace(/[^A-Za-z0-9_-]+/g, '-')}`;
}

interface LiveRef {
  path: string; // public path, e.g. /goods-bed-anatomy.jpg
  usedIn: string[];
  note?: string;
}

interface Concept {
  key: string;
  label: string;
  blurb: string;
  live: LiveRef[];
  generated: string[]; // relative to GENERATED_ROOT
  calibration?: string[]; // filenames under /images/brand/
  calibrationNote?: string;
  scriptFamily?: { note: string; source: string; files: string[] }; // public paths
  warning?: string;
}

// Verified 2026-07-13 by grepping every <Image src> in the live app for goods-*
// / theory-of-change / operating-model references. Keep this list honest: if a
// page stops using an image, move its entry out of `live`.
const CONCEPTS: Concept[] = [
  {
    key: 'bed-anatomy',
    label: 'Bed anatomy — what it is made of',
    blurb: 'X-trestle recycled-HDPE legs, galvanised steel poles, structural canvas.',
    live: [
      {
        path: '/images/pitch/bed-seq-3-all-parts.jpg',
        usedIn: ['stretch-bed page (overview)', 'cost-story page'],
        note: 'Swapped 2026-07-13 from the rendered goods-bed-anatomy.jpg infographic to real photography, per direction: use real photos, not illustrated/rendered ones.',
      },
      { path: '/images/pitch/bed-poles.jpg', usedIn: ['stretch-bed page (component tile: poles)'] },
      { path: '/images/pitch/bed-canvas.jpg', usedIn: ['stretch-bed page (component tile: canvas)'] },
      { path: '/images/pitch/bed-frame-legs.jpg', usedIn: ['stretch-bed page (component tile: legs)'] },
    ],
    generated: [],
    warning: 'Illustrated/rendered calibration images for this concept (goods-ill-leg.png, goods-leg-studio-v1.png, goods-bed-studio-v3.png, etc.) were retired from the live pages in favour of the real pitch/ photoset above — do not reintroduce them here.',
  },
  {
    key: 'bed-assembly',
    label: 'Bed assembly — how it goes together',
    blurb: 'Thread the poles, seat the ends in the X-legs, tension it taut. No tools, ~5 minutes.',
    live: [{
      path: '/images/pitch/bed-assembled.jpg',
      usedIn: ['stretch-bed page (overview)', 'cost-story page'],
      note: 'Swapped 2026-07-13 from the rendered goods-bed-assembly.jpg infographic (which also had an unresolved "wit"->"with" label typo) to a real photo of the finished bed. The step-by-step breakdown on stretch-bed page already uses real photos (the `steps` array).',
    }],
    generated: [
      'assembly-guide/01-in-the-box.png',
      'assembly-guide/02-thread-pole.png',
      'assembly-guide/03-seat-pole-ends.png',
      'assembly-guide/04-pull-taut.png',
      'assembly-guide/05-done.png',
      'assembly-guide/06-canvas-care.png',
      'test-batch/02-assembly-thread-pole.png',
    ],
    calibration: ['goods-ill-assembly.png'],
    warning: 'Illustrated 6-step assembly-guide/ sequence and goods-ill-assembly.png calibration image are superseded by real photography on the live pages — treat as archive, not a candidate to place.',
  },
  {
    key: 'plastic-loop',
    label: 'The plastic loop',
    blurb: 'Collect, shred, press. 20kg of HDPE diverted per bed.',
    live: [{ path: '/goods-plastic-journey.jpg', usedIn: ['process page', 'cost-story page'] }],
    generated: ['process-anchors/01-plastic-loop-v2.png', 'test-batch/01-plastic-loop.png'],
    calibration: ['goods-ill-plastic-loop.png', 'goods-plastic-loop-v1.png', 'goods-20kg-plastic-one-bed.png'],
  },
  {
    key: 'plant',
    label: 'The on-Country plant',
    blurb: 'Container-scale production, built to move to community ownership.',
    live: [{
      path: '/goods-container-plant.png',
      usedIn: ['process page ("A factory inside a shipping container")', 'cost-story page (Beat 5, before the real container-factory.jpg photo)'],
      note: 'Promoted 2026-07-13 from the generated pool below. Supplements, not replaces, the real container-factory.jpg photography per the brand guide’s "real photography over stock" rule.',
    }],
    generated: ['process-anchors/02-container-plant.png'],
    calibration: ['goods-ill-plant.png'],
  },
  {
    key: 'ownership',
    label: 'Community ownership — the transfer',
    blurb: '"We don’t license. We transfer." Goods’s goal is to become unnecessary.',
    // Held pending checkpoint 25 (Ben, 2026-07-17): pulled off /process +
    // /cost-story and moved behind the admin-gated held-asset route.
    live: [{ path: '/api/admin/held-asset/goods-community-ownership-v2.png', usedIn: ['pitch proof drawer (admin review only)'] }],
    generated: ['qbe-09-ownership/01-handover.png', 'test-batch/03-ownership-handover.png'],
    calibration: ['goods-community-ownership.jpg'],
    calibrationNote: 'v1 of the ownership image, superseded on the live site by -v2 in the public root; this file sits unused in the calibration folder.',
  },
  {
    key: 'theory-of-change',
    label: 'Theory of change (results chain)',
    blurb: 'Problem, inputs, the operating cycle, outputs, outcomes, the five domains, the three shifts.',
    live: [{ path: '/theory-of-change.png', usedIn: ['impact page'] }],
    generated: [],
    warning: 'Computed by scripts/generate_theory_of_change.py — a different system to the terracotta hand-drawn illustrations above. Not part of the goods-illustrations generation pool.',
  },
  {
    key: 'cost-model',
    label: 'Cost model diagrams (cost-down, breakeven, sankey, scenarios...)',
    blurb: 'Quantitative diagrams generated by Python scripts against the verified cost engine.',
    live: [],
    generated: [
      'cost-lab-pack/01-containers-fund-containers.png',
      'cost-lab-pack/01-containers-fund-containers-v2.png',
      'cost-lab-pack/02-sourdough-starter.png',
      'cost-lab-pack/03-solar-on-the-shed.png',
      'cost-lab-pack/04-food-truck-rent.png',
      'cost-lab-pack/05-mates-ute-match.png',
    ],
    scriptFamily: {
      note: 'None of these are currently wired into any live page — the live cost-story page computes its charts directly with Recharts instead of rendering these static exports. They exist for deck/print/download use.',
      source: 'scripts/generate_goods_*.py',
      files: [
        '/goods-cost-down.png', '/goods-cost-curve.png', '/goods-breakeven.png',
        '/goods-marginal-vs-fixed.png', '/goods-sankey-money.svg', '/goods-sankey-plastic.png',
        '/goods-scenarios.png', '/goods-idiot-index.svg', '/goods-model-engine.png',
        '/goods-fully-loaded-volume.svg', '/goods-anatomy-bed.png', '/goods-where-750-goes.svg',
        // Held pending checkpoint 25 — moved out of public/, admin-gated route.
        '/api/admin/held-asset/operating-model.png',
      ],
    },
    warning: 'Naming collision: goods-anatomy-bed.png (this orphaned script family) is a different file from goods-bed-anatomy.jpg (the live illustration above). Easy to grab the wrong one.',
  },
  {
    key: 'health-chain',
    label: 'The health case (scabies to RHD)',
    blurb: 'The bed as the thing that breaks the pathway. This is the WHY, never a claimed outcome.',
    live: [],
    generated: ['health-chain/01-bed-breaks-the-chain.png', 'health-chain/01-bed-breaks-the-chain-v2.png'],
    warning: 'CLAIMS HOLD, not just unplaced: the headline "THE BED BREAKS THE CHAIN" plus a visually severed chain link asserts a causal claim. src/components/dashboard/health-pathway.tsx documents the actual claim ceiling for this exact chain — "never claim Goods independently reduces RHD" / "we never present a bed as a cure" / "a contribution... never the cure" — and grades every claim by evidence tier. This image reads stronger than that copy allows. Don\'t place it on a public page as-is; either regenerate with a softer verb ("part of the chain", no severed link) or run it past /ground before shipping.',
  },
  {
    key: 'journeys',
    label: 'Journey / narrative illustrations',
    blurb: 'Story so far, the sponsor journey, Basket Bed to Stretch Bed, order to Country.',
    live: [],
    generated: [
      'journeys/01-story-so-far.png',
      'journeys/02-sponsor-journey.png',
      'journeys/03-basket-to-stretch.png',
      'order-to-country/01-order-to-country-journey.png',
    ],
    warning: 'Drafted locally, not placed on any page yet.',
  },
  {
    key: 'qbe-deck',
    label: 'Investor deck illustrations (QBE diagnostic areas)',
    blurb: 'Risk, governance, people, alignment — Pencil-deck-only, not on the live website.',
    live: [],
    generated: [
      'qbe-05-risk/01-risk-horizon.png',
      'qbe-07-governance/01-governance-signoff.png',
      'qbe-08-people/01-jobs-on-country.png',
      'qbe-12-alignment/01-alignment-matrix.png',
    ],
    warning: 'Generated then hand-copied into design/deck-photos/area-NN-*.* as the deck art — see the deck reference grid at the bottom of this page.',
  },
];

const MAPPED_GENERATED = new Set(CONCEPTS.flatMap((c) => c.generated));

function listGeneratedPool(): { files: string[]; available: boolean } {
  const root = path.join(repoRoot(), GENERATED_ROOT);
  try {
    const files: string[] = [];
    for (const dir of fs.readdirSync(root, { withFileTypes: true })) {
      if (!dir.isDirectory()) continue;
      for (const f of fs.readdirSync(path.join(root, dir.name))) {
        if (/\.(png|jpe?g|webp)$/i.test(f)) files.push(`${dir.name}/${f}`);
      }
    }
    return { files, available: true };
  } catch {
    return { files: [], available: false };
  }
}

function listDeckPhotos(): { files: string[]; available: boolean } {
  const root = path.join(repoRoot(), DECK_PHOTOS_ROOT);
  try {
    const files = fs.readdirSync(root).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
    return { files, available: true };
  } catch {
    return { files: [], available: false };
  }
}

const STAGING_ROOT = 'design/system-visuals';

function checkStagingFolder(): { built: boolean; linkCount: number } {
  try {
    let count = 0;
    for (const sub of ['real-photos', 'illustrations', 'named']) {
      const dir = path.join(repoRoot(), STAGING_ROOT, sub);
      const walk = (d: string) => {
        for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
          const full = path.join(d, entry.name);
          if (entry.isDirectory()) walk(full);
          else count++;
        }
      };
      if (fs.existsSync(dir)) walk(dir);
    }
    return { built: count > 0, linkCount: count };
  } catch {
    return { built: false, linkCount: 0 };
  }
}

// ── Canon / deck images (design/image-canon.json) ──────────────────────────
// Same source /admin/canon writes to. Read-only here: pin a new one there and
// it appears on this page next load, no code change.
interface CanonEntry {
  subject: string;
  type: string;
  dataClass: string;
  qbeAreas: string[];
  canonicalPath: string;
  caption?: string;
}

function loadCanonImages(): { images: CanonEntry[]; available: boolean } {
  try {
    const raw = JSON.parse(
      fs.readFileSync(path.join(repoRoot(), 'design', 'image-canon.json'), 'utf8'),
    ) as { images?: CanonEntry[] };
    return { images: raw.images ?? [], available: true };
  } catch {
    return { images: [], available: false };
  }
}

// Mirrors the src resolution in /admin/canon: v2/public/** is already served
// statically; anything else (design/deck-assets/**) goes through the
// allowlisted canon-image API route.
function canonImageSrc(canonicalPath: string): string {
  if (canonicalPath.startsWith('v2/public/')) return '/' + canonicalPath.slice('v2/public/'.length);
  return `/api/admin/canon-image?path=${encodeURIComponent(canonicalPath)}`;
}

// ── Storyteller portraits (storyteller-registry.ts) ─────────────────────────
// Same source /admin/storytellers reads. Adding a portrait there (editing the
// registry) is still a code change by design (it's the consent-governed
// canonical list) — but nothing else needs to change for it to show here too.
function loadStorytellerPortraits() {
  return STORYTELLER_REGISTRY
    .filter((s) => s.portrait)
    .map((s) => ({ slug: s.slug, name: s.name, community: s.community, role: s.role, portrait: s.portrait as string }));
}

// ── Community images (content_items, tagged via /admin/media-library) ──────
// Live DB read: tag a photo with a community in the media library and it
// shows up in the right bucket here on next load. RED-consent media is never
// rendered, same rule as /admin/community-stories.
interface CommunityImageBucket { id: string; name: string; images: { id: string; url: string }[] }

async function loadCommunityImages(): Promise<{ buckets: CommunityImageBucket[]; available: boolean }> {
  try {
    const supabase = createServiceClient();
    const [communities, media] = await Promise.all([
      supabase.from('communities').select('id, name').order('name'),
      supabase
        .from('content_items')
        .select('id, url, community_id, media_type, consent_tier')
        .not('community_id', 'is', null)
        .eq('media_type', 'image'),
    ]);
    if (communities.error || media.error) return { buckets: [], available: false };

    const byId = new Map<string, CommunityImageBucket>();
    for (const c of (communities.data ?? []) as { id: string; name: string }[]) {
      byId.set(c.id, { id: c.id, name: c.name, images: [] });
    }
    type MediaRow = { id: string; url: string | null; community_id: string; consent_tier: string | null };
    for (const m of (media.data ?? []) as MediaRow[]) {
      if (!m.url || m.consent_tier === 'red') continue;
      byId.get(m.community_id)?.images.push({ id: m.id, url: m.url });
    }
    return { buckets: Array.from(byId.values()).filter((b) => b.images.length > 0), available: true };
  } catch {
    return { buckets: [], available: false };
  }
}

// ── Known site videos (hardcoded, hand-verified) ────────────────────────────
// Verified 2026-07-13 by grepping every /video/*.mp4 reference in the live app.
// Keep this honest the same way as CONCEPTS: if a page stops using a video,
// move its entry or update usedIn.
interface SiteVideo {
  src: string;
  poster?: string;
  person?: string;
  place?: string;
  usedIn: string[];
  note?: string;
}

const SITE_VIDEOS: SiteVideo[] = [
  {
    src: '/video/partners/oonchiumpa/mykel-building-the-bed.mp4',
    poster: '/video/partners/oonchiumpa/mykel-building-the-bed-poster.jpg',
    person: 'Mykel',
    place: 'Alice Springs (Oonchiumpa)',
    usedIn: ['partners/oonchiumpa page', 'impact page'],
  },
  {
    src: '/video/partners/oonchiumpa/karen-liddle-on-beds.mp4',
    poster: '/video/partners/oonchiumpa/karen-liddle-on-beds-poster.jpg',
    person: 'Karen Liddle',
    place: 'Alice Springs (Oonchiumpa)',
    usedIn: ['partners/oonchiumpa page'],
  },
  {
    src: '/video/partners/centrecorp/utopia-good-news-full.mp4',
    poster: '/video/partners/centrecorp/utopia-good-news-full-poster.jpg',
    place: 'Utopia Homelands (Centrecorp)',
    usedIn: ['partners/centrecorp page'],
  },
  {
    src: '/video/recycling-plant-desktop.mp4',
    poster: '/video/recycling-plant-poster.jpg',
    place: 'the on-Country plant',
    usedIn: ['process page (background loop)'],
  },
  {
    src: '/video/building-together-desktop.mp4',
    poster: '/video/building-together-poster.jpg',
    place: 'the on-Country plant / community build',
    usedIn: ['process page (closing band)', 'home page (feature video)'],
  },
  {
    src: '/video/stretch-bed/assembly.mp4',
    poster: '/video/stretch-bed/assembly-poster.jpg',
    usedIn: ['stretch-bed page ("Watch a bed go together")'],
  },
  {
    src: '/video/jaquilane-testimony.mp4',
    poster: '/video/jaquilane-poster.jpg',
    person: 'Jaquilane',
    usedIn: [],
    note: 'CONSENT HOLD, not live: story/page.tsx has a code comment confirming this section is removed pending clearance ("re-add this section once cleared"). Do not wire it back in without confirming consent first.',
  },
];

// ── Community & storyteller-tagged videos (content_items) ──────────────────
// Live DB read, same pattern as loadCommunityImages: tag a video's storyteller
// or community elsewhere and it shows up here on next load.
interface VideoItem { id: string; url: string; poster: string | null; storyteller: string | null; community: string | null }

async function loadTaggedVideos(): Promise<{ items: VideoItem[]; available: boolean }> {
  try {
    const supabase = createServiceClient();
    const [communities, storytellersRes, media] = await Promise.all([
      supabase.from('communities').select('id, name'),
      supabase.from('storytellers').select('id, display_name'),
      supabase
        .from('content_items')
        .select('id, url, poster_url, consent_tier, community_id, storyteller_id')
        .eq('media_type', 'video'),
    ]);
    if (communities.error || storytellersRes.error || media.error) return { items: [], available: false };

    const communityName = new Map(((communities.data ?? []) as { id: string; name: string }[]).map((c) => [c.id, c.name]));
    const storytellerName = new Map(
      ((storytellersRes.data ?? []) as { id: string; display_name: string }[]).map((s) => [s.id, s.display_name]),
    );
    type Row = {
      id: string; url: string | null; poster_url: string | null; consent_tier: string | null;
      community_id: string | null; storyteller_id: string | null;
    };
    const items = ((media.data ?? []) as Row[])
      .filter((m) => m.url && m.consent_tier !== 'red')
      .map((m) => ({
        id: m.id,
        url: m.url as string,
        poster: m.poster_url,
        storyteller: m.storyteller_id ? storytellerName.get(m.storyteller_id) ?? null : null,
        community: m.community_id ? communityName.get(m.community_id) ?? null : null,
      }));
    return { items, available: true };
  } catch {
    return { items: [], available: false };
  }
}

// id must be unique across the whole page (callers pass a concept/section-scoped
// string through slug()). CSS-only lightbox: the thumb links to `#id`, the
// overlay below is that same id and only shows when it matches the URL
// fragment (the :target pseudo-class) — no client JS needed on this page.
function Thumb({ src, caption, id }: { src: string; caption?: string; id: string }) {
  return (
    <div className="w-40 shrink-0">
      <a
        href={`#${id}`}
        className="flex h-32 w-40 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-[#FDF8F3] cursor-zoom-in transition hover:border-gray-400"
      >
        {/* External/dynamic-path images from repo disk; next/image needs static
            dimensions this grid intentionally varies, so plain <img> is simplest. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption || ''} loading="lazy" className="max-h-full max-w-full object-contain" />
      </a>
      {caption && <p className="mt-1 truncate text-[11px] text-gray-500" title={caption}>{caption}</p>}

      <a
        href="#"
        id={id}
        className="fixed inset-0 z-50 hidden cursor-zoom-out items-center justify-center bg-black/90 p-6 target:flex"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption || ''} className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
        {caption && (
          <span className="absolute bottom-6 left-1/2 max-w-[90vw] -translate-x-1/2 truncate rounded bg-black/70 px-3 py-1.5 text-xs text-white">
            {caption}
          </span>
        )}
      </a>
    </div>
  );
}

// Video lightbox: unlike Thumb, the overlay must NOT be a single clickable
// anchor around the video, or clicking the native play/scrub controls would
// also fire the close-navigation. So the target id lives on a plain <div>,
// with a separate full-bleed backdrop <a> behind the video for click-to-close,
// and an explicit Close link too.
function VideoThumb({ src, poster, caption, id }: { src: string; poster?: string | null; caption?: string; id: string }) {
  return (
    <div className="w-40 shrink-0">
      <a
        href={`#${id}`}
        className="relative flex h-32 w-40 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-900 cursor-zoom-in"
      >
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt={caption || ''} loading="lazy" className="max-h-full max-w-full object-cover opacity-90" />
        ) : (
          <span className="px-2 text-center text-[10px] text-gray-500">no poster</span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/10">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-sm text-white">▶</span>
        </span>
      </a>
      {caption && <p className="mt-1 truncate text-[11px] text-gray-500" title={caption}>{caption}</p>}

      <div id={id} className="fixed inset-0 z-50 hidden items-center justify-center bg-black/90 p-6 target:flex">
        <a href="#" className="absolute inset-0" aria-label="Close" />
        <div className="relative z-10 flex max-w-[90vw] flex-col items-center gap-3">
          <video src={src} poster={poster ?? undefined} controls className="max-h-[75vh] max-w-full rounded-lg shadow-2xl" />
          {caption && (
            <span className="max-w-full truncate rounded bg-black/70 px-3 py-1.5 text-xs text-white">{caption}</span>
          )}
          <a href="#" className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20">Close ✕</a>
        </div>
      </div>
    </div>
  );
}

const JUMP_LINKS = [
  { href: '#section-process', label: 'Process diagrams' },
  { href: '#section-canon', label: 'Canon & deck' },
  { href: '#section-storytellers', label: 'Storytellers' },
  { href: '#section-communities', label: 'Communities' },
  { href: '#section-videos', label: 'Videos' },
  { href: '#section-deck-art', label: 'Deck art' },
];

export default async function SystemVisualsPage() {
  const generatedPool = listGeneratedPool();
  const deckPhotos = listDeckPhotos();
  const staging = checkStagingFolder();
  const unsorted = generatedPool.files.filter((f) => !MAPPED_GENERATED.has(f));
  const canon = loadCanonImages();
  const storytellers = loadStorytellerPortraits();
  const [communityImages, taggedVideos] = await Promise.all([loadCommunityImages(), loadTaggedVideos()]);

  return (
    <div className="p-2 sm:p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">System visuals</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Everything used to explain Goods, one page: process diagrams (bed anatomy, assembly, the
          plastic loop, ownership, the cost model, theory of change), canon/deck images, storyteller
          portraits, and community images. The <strong>Canon</strong>, <strong>Storytellers</strong> and{' '}
          <strong>Communities</strong> sections below read live from the same places their own admin
          pages write to — pin a canon image, edit the registry, or tag a photo with a community
          elsewhere, and it shows up here automatically, no code change. For the raw, un-curated photo
          pool, use{' '}
          <Link href="/admin/media-library" className="underline hover:text-foreground">Media library</Link>.
        </p>
        <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {JUMP_LINKS.map((j) => (
            <a key={j.href} href={j.href} className="text-accent underline hover:text-foreground">{j.label}</a>
          ))}
        </nav>
        <p className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
          This page mirrors onto disk at <code>{STAGING_ROOT}/</code> — three folders of symlinks
          (<code>real-photos/</code>, <code>illustrations/</code>, <code>named/</code>) for browsing
          outside the browser, e.g. to drag into Pencil or hand to a designer. Nothing is duplicated;
          they point straight at the live files. {staging.built
            ? `${staging.linkCount} links currently built.`
            : 'Not built yet on this machine — run scripts/build-system-visuals-staging.sh.'}
        </p>
        {!generatedPool.available && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Local generated-illustration pool not found at <code>{GENERATED_ROOT}/</code>. It is
            gitignored (local-only), so this section is empty on Vercel — run this page locally to
            see draft/generated candidates.
          </p>
        )}
      </header>

      <h2 id="section-process" className="mb-3 text-lg font-bold scroll-mt-4">Process diagrams</h2>
      <div className="space-y-6">
        {CONCEPTS.map((c) => (
          <section key={c.key} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-base font-semibold">{c.label}</h2>
              {c.live.length > 0 ? (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">LIVE</span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">NO LIVE IMAGE</span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
            {c.warning && <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">{c.warning}</p>}

            {c.live.length > 0 && (
              <div className="mt-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Live on site</p>
                <div className="flex flex-wrap gap-3">
                  {c.live.map((l) => (
                    <div key={l.path} className="flex gap-3">
                      <Thumb src={l.path} caption={l.path} id={slug(`${c.key}-live-${l.path}`)} />
                      <div className="max-w-xs text-xs text-gray-600">
                        <p className="font-medium text-gray-700">Used in</p>
                        <ul className="list-inside list-disc">
                          {l.usedIn.map((u) => <li key={u}>{u}</li>)}
                        </ul>
                        {l.note && <p className="mt-1 text-amber-700">{l.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {c.generated.length > 0 && (
              <div className="mt-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Generated pool (local only) — {c.generated.length}
                </p>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {c.generated.map((g) => (
                    <Thumb key={g} src={apiSrc(`${GENERATED_ROOT}/${g}`)} caption={g} id={slug(`${c.key}-gen-${g}`)} />
                  ))}
                </div>
              </div>
            )}

            {c.scriptFamily && (
              <div className="mt-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Script-generated family ({c.scriptFamily.source}) — orphaned
                </p>
                <p className="mb-2 text-xs text-gray-600">{c.scriptFamily.note}</p>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {c.scriptFamily.files.map((f) => <Thumb key={f} src={f} caption={f} id={slug(`${c.key}-sf-${f}`)} />)}
                </div>
              </div>
            )}

            {c.calibration && c.calibration.length > 0 && (
              <div className="mt-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Reference / calibration set</p>
                {c.calibrationNote && <p className="mb-2 text-xs text-gray-600">{c.calibrationNote}</p>}
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {c.calibration.map((f) => <Thumb key={f} src={`/images/brand/${f}`} caption={f} id={slug(`${c.key}-cal-${f}`)} />)}
                </div>
              </div>
            )}
          </section>
        ))}

        {unsorted.length > 0 && (
          <section className="rounded-xl border border-amber-300 bg-amber-50 p-4">
            <h2 className="text-base font-semibold text-amber-800">Unsorted generated files</h2>
            <p className="mt-1 text-sm text-amber-700">
              New files in <code>{GENERATED_ROOT}/</code> not yet assigned to a concept above. Add them
              to a concept in this page (or a new one) once their purpose is decided.
            </p>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {unsorted.map((g) => <Thumb key={g} src={apiSrc(`${GENERATED_ROOT}/${g}`)} caption={g} id={slug(`unsorted-${g}`)} />)}
            </div>
          </section>
        )}

        <section id="section-canon" className="scroll-mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold">Canon & deck images</h2>
            <Link href="/admin/canon" className="text-xs text-accent underline hover:text-foreground">
              Open Canon studio to add/change picks →
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            The QBE-diagnostic-area image set from <code>design/image-canon.json</code> — the deck, the
            investor materials, the &ldquo;one best image per subject&rdquo; board. Live read: pin a new
            one in Canon studio and it appears here on next load.
          </p>
          {!canon.available && (
            <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Could not read <code>design/image-canon.json</code> in this environment (may not deploy to
              Vercel) — run locally.
            </p>
          )}
          {canon.available && (
            ['photo', 'illustration', 'chart', 'logo'].map((t) => {
              const items = canon.images.filter((im) => im.type === t);
              if (items.length === 0) return null;
              return (
                <div key={t} className="mt-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    {t} — {items.length}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {items.map((im, i) => (
                      <Thumb
                        // canonicalPath is not guaranteed unique — the same photo can be
                        // the canonical pick for more than one subject — so key/id fold
                        // in the subject and index too.
                        key={`${im.canonicalPath}::${im.subject}::${i}`}
                        src={canonImageSrc(im.canonicalPath)}
                        caption={`${im.subject}${im.qbeAreas.length ? ' · area ' + im.qbeAreas.join(',') : ''}`}
                        id={slug(`canon-${t}-${i}-${im.canonicalPath}-${im.subject}`)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </section>

        <section id="section-storytellers" className="scroll-mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold">Storyteller portraits</h2>
            <Link href="/admin/storytellers" className="text-xs text-accent underline hover:text-foreground">
              Open Registry to edit →
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {storytellers.length} of {STORYTELLER_REGISTRY.length} storytellers have a portrait on file
            (from <code>storyteller-registry.ts</code>, the consent-governed canonical list —
            {' '}{STORYTELLER_REGISTRY.length - storytellers.length} gaps).
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {storytellers.map((s) => (
              <Thumb
                key={s.slug}
                src={s.portrait}
                caption={`${s.name} · ${s.community}`}
                id={slug(`storyteller-${s.slug}`)}
              />
            ))}
          </div>
        </section>

        <section id="section-communities" className="scroll-mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold">Community images</h2>
            <Link href="/admin/community-stories" className="text-xs text-accent underline hover:text-foreground">
              Open Community stories →
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Photos tagged with a community, grouped by place. Live read from{' '}
            <code>content_items</code> — tag a photo with a community in{' '}
            <Link href="/admin/media-library" className="underline hover:text-foreground">Media library</Link>{' '}
            and it appears in the right bucket here on next load. RED-consent media is never shown.
          </p>
          {!communityImages.available && (
            <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Could not read community-tagged media (Supabase unavailable in this environment).
            </p>
          )}
          {communityImages.available && communityImages.buckets.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">No community-tagged images yet.</p>
          )}
          {communityImages.buckets.map((b) => (
            <div key={b.id} className="mt-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {b.name} — {b.images.length}
              </p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {b.images.map((im) => (
                  <Thumb key={im.id} src={im.url} caption={b.name} id={slug(`community-${im.id}`)} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section id="section-videos" className="scroll-mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-base font-semibold">Videos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Click to play, not just zoom. For coverage gaps (which themes have no video at all), see{' '}
            <Link href="/admin/media-gaps" className="underline hover:text-foreground">Media gaps</Link>{' '}
            — this section is the browsable pool, not a second gap-tracker.
          </p>

          <div className="mt-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Known site videos (hand-verified) — {SITE_VIDEOS.length}
            </p>
            <div className="flex flex-wrap gap-4">
              {SITE_VIDEOS.map((v) => (
                <div key={v.src} className="flex gap-3">
                  <VideoThumb
                    src={v.src}
                    poster={v.poster}
                    caption={[v.person, v.place].filter(Boolean).join(' · ') || v.src}
                    id={slug(`video-site-${v.src}`)}
                  />
                  <div className="max-w-xs text-xs text-gray-600">
                    {v.person && <p className="font-medium text-gray-700">{v.person}</p>}
                    {v.place && <p>{v.place}</p>}
                    {v.usedIn.length > 0 && (
                      <ul className="mt-1 list-inside list-disc">
                        {v.usedIn.map((u) => <li key={u}>{u}</li>)}
                      </ul>
                    )}
                    {v.note && <p className="mt-1 text-amber-700">{v.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Tagged in content_items (live) — {taggedVideos.items.length}
              </p>
              <Link href="/admin/media-library" className="text-xs text-accent underline hover:text-foreground">
                Tag storyteller/community on a video →
              </Link>
            </div>
            {!taggedVideos.available && (
              <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Could not read tagged video media (Supabase unavailable in this environment).
              </p>
            )}
            {taggedVideos.available && taggedVideos.items.length === 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                No videos in <code>content_items</code> with a storyteller or community tag yet.
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-3">
              {taggedVideos.items.map((v) => (
                <VideoThumb
                  key={v.id}
                  src={v.url}
                  poster={v.poster}
                  caption={[v.storyteller, v.community].filter(Boolean).join(' · ') || 'untitled'}
                  id={slug(`video-tagged-${v.id}`)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="section-deck-art" className="scroll-mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-base font-semibold">Investor deck art (design/deck-photos/)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The full Pencil-deck image set, for cross-reference against the concepts above. Synced by{' '}
            <code>v2/scripts/sync-pencil-photos.mjs</code>.
          </p>
          {!deckPhotos.available && (
            <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
              <code>{DECK_PHOTOS_ROOT}/</code> not found in this environment.
            </p>
          )}
          {deckPhotos.available && (
            <div className="mt-3 flex flex-wrap gap-3">
              {deckPhotos.files.map((f) => (
                <Thumb key={f} src={apiSrc(`${DECK_PHOTOS_ROOT}/${f}`)} caption={f} id={slug(`deck-${f}`)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
