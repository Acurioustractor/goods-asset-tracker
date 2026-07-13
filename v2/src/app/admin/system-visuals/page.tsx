// Admin: the System visuals board. Reviews every diagram/illustration used to
// explain how Goods works (bed anatomy, assembly, the plastic loop, ownership,
// the cost model, theory of change) against the local generated-illustration
// pool, so a human can decide what to promote, replace, or archive. This is the
// process/concept-diagram twin of /admin/canon (real, consent-gated photography)
// and /admin/media-library (the raw photo/video pool) — those two are for people
// and place; this one is for the drawings that explain the system.
//
// Reads three sources on disk, read-only:
//  - v2/public/**            (live web images, served statically; hardcoded refs below,
//                              verified against actual <Image src> usage in the app)
//  - generated-images/goods-illustrations/**  (gitignored, local-only draft pool)
//  - design/deck-photos/**   (the Pencil investor-deck art)
// generated-images/ is gitignored (CLAUDE.md "no large media in git"), so its
// section is empty on Vercel — this board is most useful run locally.
import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';

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
    live: [{ path: '/goods-community-ownership-v2.png', usedIn: ['process page', 'cost-story page'] }],
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
        '/operating-model.png',
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

function Thumb({ src, caption }: { src: string; caption?: string }) {
  return (
    <div className="w-40 shrink-0">
      <div className="flex h-32 w-40 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-[#FDF8F3]">
        {/* External/dynamic-path images from repo disk; next/image needs static
            dimensions this grid intentionally varies, so plain <img> is simplest. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption || ''} loading="lazy" className="max-h-full max-w-full object-contain" />
      </div>
      {caption && <p className="mt-1 truncate text-[11px] text-gray-500" title={caption}>{caption}</p>}
    </div>
  );
}

export default function SystemVisualsPage() {
  const generatedPool = listGeneratedPool();
  const deckPhotos = listDeckPhotos();
  const staging = checkStagingFolder();
  const unsorted = generatedPool.files.filter((f) => !MAPPED_GENERATED.has(f));

  return (
    <div className="p-2 sm:p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">System visuals</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Every diagram that explains how Goods works — bed anatomy, assembly, the plastic loop,
          ownership, the cost model, theory of change — lined up against the local generated pool,
          so we can decide what to promote to the live site, mirror into the deck, or drop. For real
          consent-gated photography of people and place, use{' '}
          <Link href="/admin/canon" className="underline hover:text-foreground">Canon board</Link>{' '}
          or{' '}
          <Link href="/admin/media-library" className="underline hover:text-foreground">Media library</Link>{' '}
          instead.
        </p>
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
                      <Thumb src={l.path} caption={l.path} />
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
                    <Thumb key={g} src={apiSrc(`${GENERATED_ROOT}/${g}`)} caption={g} />
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
                  {c.scriptFamily.files.map((f) => <Thumb key={f} src={f} caption={f} />)}
                </div>
              </div>
            )}

            {c.calibration && c.calibration.length > 0 && (
              <div className="mt-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Reference / calibration set</p>
                {c.calibrationNote && <p className="mb-2 text-xs text-gray-600">{c.calibrationNote}</p>}
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {c.calibration.map((f) => <Thumb key={f} src={`/images/brand/${f}`} caption={f} />)}
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
              {unsorted.map((g) => <Thumb key={g} src={apiSrc(`${GENERATED_ROOT}/${g}`)} caption={g} />)}
            </div>
          </section>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-4">
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
                <Thumb key={f} src={apiSrc(`${DECK_PHOTOS_ROOT}/${f}`)} caption={f} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
