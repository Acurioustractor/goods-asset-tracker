// Registry — every storyteller, every quote on file, every local photo, one page.
//
// Driven ENTIRELY by repo truth: storyteller-registry.ts (the canonical lockdown)
// + curated-quotes.ts + community-narrative.ts overrides + a filesystem scan of
// /public/images. No Empathy Ledger dependency, so this page never comes up
// empty while EL is mid privacy migration. Gaps are shown loudly, not hidden.
//
// Enforcement partner: `npm run check:storytellers`.

import type { Metadata } from 'next';
import Link from 'next/link';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  STORYTELLER_REGISTRY,
  type StorytellerRecord,
  type VoiceTier,
} from '@/lib/data/storyteller-registry';
import { getCuratedQuotes } from '@/lib/data/curated-quotes';
import { transcriptQuoteOverrides, anonymousFieldEvidence } from '@/lib/data/community-narrative';

export const metadata: Metadata = {
  title: 'Registry · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

// ── Filesystem photo index ───────────────────────────────────────────────────

const IMAGE_DIRS = ['images/people', 'images/stories', 'images/media-pack', 'images/community', 'images/utopia', 'images/build'];
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

function collectImages(): string[] {
  const publicDir = join(process.cwd(), 'public');
  const found: string[] = [];
  const walk = (dir: string) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (IMAGE_EXT.test(entry)) found.push('/' + full.slice(publicDir.length + 1).split('\\').join('/'));
    }
  };
  for (const d of IMAGE_DIRS) walk(join(publicDir, d));
  return found;
}

/** Token appears in the filename bounded by non-letters ("mark" ✓ mark.jpg ✗ marker.jpg). */
function matchesToken(path: string, token: string): boolean {
  const base = path.toLowerCase().split('/').pop() ?? '';
  return new RegExp(`(^|[^a-z])${token.replace(/[-\s]/g, '[-_ ]')}([^a-z]|$)`).test(base);
}

function photosFor(rec: StorytellerRecord, allImages: string[]): string[] {
  const tokens = new Set<string>([rec.slug]);
  const nameTokens = rec.slug.split('-');
  if (nameTokens.length >= 2) tokens.add(nameTokens.join('-'));
  // Single-name voices only match their bounded token; multi-name also match "first-last".
  if (nameTokens.length === 1) tokens.add(nameTokens[0]);
  else tokens.add(nameTokens.slice(0, 2).join('-'));
  const hits = allImages.filter((img) => [...tokens].some((t) => matchesToken(img, t)));
  // Always include the declared portrait first if it exists on disk.
  if (rec.portrait && !hits.includes(rec.portrait)) hits.unshift(rec.portrait);
  return [...new Set(hits)];
}

// ── Presentation helpers ─────────────────────────────────────────────────────

const TIER_ORDER: VoiceTier[] = ['external', 'website', 'pending', 'hold', 'funder', 'internal'];

const TIER_META: Record<VoiceTier, { label: string; badge: string; blurb: string }> = {
  external: {
    label: 'External — cleared for web + funder',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    blurb: 'The 32 voices from the 2026-06-17 consent pass. Safe everywhere, with practitioner labels where marked.',
  },
  website: {
    label: 'Website only',
    badge: 'bg-sky-100 text-sky-800 border-sky-300',
    blurb: 'Fine on goodsoncountry.com. Never in funder exports.',
  },
  pending: {
    label: 'Pending Ben — tier unconfirmed',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    blurb: 'Foundation says external, allowlist says no. Confirm to unlock (checkpoint B-1).',
  },
  hold: {
    label: 'Hold — do not use externally',
    badge: 'bg-red-100 text-red-800 border-red-300',
    blurb: 'Not consent-cleared. The guard blocks these names on rendered surfaces.',
  },
  funder: {
    label: 'Funder testimonial only',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    blurb: 'Never in the community storyteller set.',
  },
  internal: {
    label: 'Internal',
    badge: 'bg-muted text-foreground border-border',
    blurb: 'Goods team, not community voices.',
  },
};

const QUOTE_BADGE: Record<string, string> = {
  primary: 'bg-emerald-600 text-white',
  approved: 'bg-muted text-foreground',
  hold: 'bg-red-600 text-white',
};

function normaliseText(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 80);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function StorytellerRegistryPage() {
  const allImages = collectImages();
  const publicDir = join(process.cwd(), 'public');

  const byTier = new Map<VoiceTier, StorytellerRecord[]>();
  for (const tier of TIER_ORDER) byTier.set(tier, []);
  for (const rec of STORYTELLER_REGISTRY) byTier.get(rec.tier)?.push(rec);

  const externalCount = byTier.get('external')?.length ?? 0;
  const portraitGaps = STORYTELLER_REGISTRY.filter(
    (r) => (r.tier === 'external' || r.tier === 'website') && (!r.portrait || !existsSync(join(publicDir, r.portrait.slice(1)))),
  );
  const quoteless = STORYTELLER_REGISTRY.filter(
    (r) => r.tier === 'external' && r.quotes.length === 0 && !r.narratedBy,
  );

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-2xl font-bold tracking-tight font-display">Registry</h1>
        <p className="mt-1 max-w-prose text-sm text-muted-foreground">
          Every voice, every quote on file, every local photo. Driven by{' '}
          <code className="rounded bg-muted px-1">storyteller-registry.ts</code> (the canonical
          lockdown) and a live scan of <code className="rounded bg-muted px-1">/public/images</code>.
          No Empathy Ledger dependency, so nothing here goes blank while EL is migrating. The
          registry wins over every other file; drift fails{' '}
          <code className="rounded bg-muted px-1">npm run check:storytellers</code>. EL profiles
          themselves live on{' '}
          <Link href="/admin/el-storytellers" className="text-orange-700 hover:underline">
            Storytellers (EL)
          </Link>.
        </p>
      </header>

      {/* Status strip */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span><span className="font-bold text-foreground">{STORYTELLER_REGISTRY.length}</span> voices</span>
        <span><span className="font-bold text-foreground">{externalCount}</span> cleared external</span>
        <span className={portraitGaps.length ? 'text-red-700' : ''}>
          <span className="font-bold">{portraitGaps.length}</span> portrait gaps
          {portraitGaps.length > 0 && ': ' + portraitGaps.map((r) => r.name).join(', ')}
        </span>
        {quoteless.length > 0 && (
          <span className="text-amber-700">
            <span className="font-bold">{quoteless.length}</span> external without quotes:{' '}
            {quoteless.map((r) => r.name).join(', ')}
          </span>
        )}
      </div>

      {/* Tier sections */}
      {TIER_ORDER.map((tier) => {
        const records = byTier.get(tier) ?? [];
        if (records.length === 0) return null;
        const meta = TIER_META[tier];
        return (
          <section key={tier} className="space-y-4">
            <div className="sticky top-0 z-10 -mx-2 border-b border-border bg-card/95 px-2 py-2 backdrop-blur">
              <h2 className="flex items-center gap-3 text-lg font-semibold">
                <span className={`rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wide ${meta.badge}`}>
                  {records.length}
                </span>
                {meta.label}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{meta.blurb}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {records.map((rec) => {
                const photos = photosFor(rec, allImages);
                const portraitOnDisk = rec.portrait && existsSync(join(publicDir, rec.portrait.slice(1)));
                const registryTexts = new Set(rec.quotes.map((q) => normaliseText(q.text)));
                const extraLines = [
                  ...(getCuratedQuotes(rec.name) ?? []).map((q) => ({ text: q.text, context: q.context ?? 'curated' })),
                  ...(transcriptQuoteOverrides[rec.name] ?? []).map((q) => ({ text: q.text, context: q.context })),
                ].filter((q) => !registryTexts.has(normaliseText(q.text)));

                return (
                  <article key={rec.slug} id={rec.slug} className="rounded-lg border border-border bg-card shadow-sm">
                    <div className="flex gap-4 p-4">
                      {/* Portrait */}
                      <div className="shrink-0">
                        {portraitOnDisk ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={rec.portrait!}
                            alt={rec.name}
                            className="h-24 w-24 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-md border-2 border-dashed border-red-300 bg-red-50 p-1 text-center text-[10px] font-bold uppercase leading-tight text-red-600">
                            {rec.portrait ? 'file missing on disk' : 'no portrait'}
                          </div>
                        )}
                      </div>

                      {/* Identity */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-foreground">{rec.name}</h3>
                          {rec.practitioner && (
                            <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent">
                              practitioner
                            </span>
                          )}
                          {rec.narratedBy && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-900">
                              narrated by {rec.narratedBy}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground">{rec.role}</p>
                        <p className="text-xs text-muted-foreground">
                          {rec.community}
                          {rec.turns ? ` · turn ${rec.turns}` : ''}
                        </p>
                        {(rec.aliases?.length || rec.misspellings?.length) ? (
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {rec.aliases?.length ? <>aliases: {rec.aliases.join(' · ')}</> : null}
                            {rec.aliases?.length && rec.misspellings?.length ? ' — ' : null}
                            {rec.misspellings?.length ? (
                              <span className="text-red-500">banned spellings: {rec.misspellings.join(' · ')}</span>
                            ) : null}
                          </p>
                        ) : null}
                        {rec.notes && <p className="mt-1 text-xs italic text-muted-foreground">{rec.notes}</p>}
                      </div>
                    </div>

                    {/* Quotes */}
                    <div className="space-y-2 border-t border-border px-4 py-3">
                      {rec.quotes.length === 0 && !rec.narratedBy && (
                        <p className="text-xs text-amber-700">No blessed quotes on file.</p>
                      )}
                      {rec.narratedBy && (
                        <p className="text-xs text-muted-foreground">
                          No direct quotes by design — see {rec.narratedBy}&rsquo;s card for the narration lines.
                        </p>
                      )}
                      {rec.quotes.map((q, i) => (
                        <blockquote key={i} className="flex items-start gap-2 text-sm">
                          <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${QUOTE_BADGE[q.status]}`}>
                            {q.status}
                          </span>
                          <div className="min-w-0">
                            <p className={q.status === 'hold' ? 'text-muted-foreground line-through decoration-red-300' : 'text-foreground'}>
                              &ldquo;{q.text}&rdquo;
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {q.context}
                              {q.note ? ` — ${q.note}` : ''}
                            </p>
                          </div>
                        </blockquote>
                      ))}
                      {extraLines.length > 0 && (
                        <details className="pt-1">
                          <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                            {extraLines.length} more line{extraLines.length === 1 ? '' : 's'} on file (curated / transcript overrides)
                          </summary>
                          <div className="mt-2 space-y-1.5">
                            {extraLines.map((q, i) => (
                              <p key={i} className="text-xs text-muted-foreground">
                                &ldquo;{q.text}&rdquo; <span className="text-muted-foreground">— {q.context}</span>
                              </p>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>

                    {/* Photos on file */}
                    <div className="border-t border-border px-4 py-3">
                      {photos.length === 0 ? (
                        <p className="text-xs text-red-600">No photos found under /public/images for &ldquo;{rec.slug}&rdquo;.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {photos.slice(0, 8).map((src) => (
                            <a key={src} href={src} target="_blank" rel="noreferrer" title={src}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt={src} className="h-14 w-14 rounded object-cover ring-1 ring-border hover:ring-primary/50" />
                            </a>
                          ))}
                          {photos.length > 8 && (
                            <span className="self-center text-xs text-muted-foreground">+{photos.length - 8} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Anonymous field evidence */}
      <section className="space-y-3">
        <div className="border-b border-border pb-2">
          <h2 className="text-lg font-semibold">Anonymous field evidence — use unnamed only</h2>
          <p className="text-xs text-muted-foreground">Arlparra / Arawerr lines, marked cleared for anonymous use in community-narrative.ts.</p>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {anonymousFieldEvidence.map((q, i) => (
            <div key={i} className="rounded border border-border bg-muted p-3 text-sm">
              <p className="text-foreground">&ldquo;{q.text}&rdquo;</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{q.context} — {q.use}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
