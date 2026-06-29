// Admin: the Canon photo board. The visual twin of design/image-canon.json —
// the ONE approved LOCAL image per subject, organised by QBE diagnostic area —
// PLUS a live Empathy Ledger picker so you can browse the whole EL photo library
// and pin EL photos to any area without copying files. Consent badges throughout;
// one-click copy of the path (for Pencil) or web URL (for the site). The raw,
// unfiltered local pool is /admin/media-library. Edit the curated local canon in
// design/image-canon.json; EL picks live in v2/data/canon-el-picks.json.
import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { safeImageUrl } from '@/lib/empathy-ledger/media-tier';
import { getCanonElPicks } from '@/lib/data/canon-el-picks';
import {
  type CanonImage,
  type CanonGap,
  type CanonSlot,
  type ElPhoto,
} from './canon-client';
import { CanonShell, type Candidate } from './canon-studio';
import { getLocalImages } from '@/lib/data/local-images';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// QBE diagnostic area names (mirror the QBE Diagnostic Artifact Database).
const AREA_NAMES: Record<string, string> = {
  '01': 'Vision & Ambition',
  '02': 'Social Objective & Impact',
  '03': 'Business Model',
  '04': 'Financial Management',
  '05': 'Strategic Planning & Risk',
  '06': 'Process & Technology',
  '07': 'Governance, Data & Reporting',
  '08': 'People & Organisation',
  '09': 'Legal Structure',
  '10': 'Investors & Capital Raising',
  '11': 'Cost Model',
  '12': 'Investor Alignment',
};

// EL content-hub API (the legacy EL Supabase keys were disabled org-wide
// 2026-06-17, so the old /rest/v1 path is dead — we read the public content-hub).
const EL_API = (process.env.EMPATHY_LEDGER_API_URL || 'https://empathy-ledger-v2.vercel.app').replace(/\/$/, '');
const EL_API_KEY = process.env.EMPATHY_LEDGER_API_KEY || '';
const EL_PCODE = process.env.EMPATHY_LEDGER_PROJECT_CODE || 'goods-on-country';
const EL_SLUG = process.env.EMPATHY_LEDGER_SITE_SLUG || 'goods-asset-register';
const EL_PID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';

function repoRoot(): string {
  const cwd = process.cwd();
  return cwd.endsWith(`${path.sep}v2`) ? path.resolve(cwd, '..') : cwd;
}

interface RawImage {
  subject: string;
  type: string;
  dataClass: string;
  caption?: string;
  qbeAreas?: string[];
  canonicalPath: string;
  consentCleared?: boolean;
  slot?: string;
}

function loadCanon(): { asOf: string; images: CanonImage[]; gaps: CanonGap[]; error: string | null } {
  try {
    const p = path.join(repoRoot(), 'design', 'image-canon.json');
    const raw = JSON.parse(fs.readFileSync(p, 'utf8')) as {
      asOf?: string;
      images?: RawImage[];
      gaps?: CanonGap[];
    };
    const images: CanonImage[] = (raw.images ?? []).map((im) => ({
      subject: im.subject,
      type: (['photo', 'illustration', 'chart', 'logo'].includes(im.type)
        ? im.type
        : 'photo') as CanonImage['type'],
      dataClass: (['green', 'amber', 'red'].includes(im.dataClass)
        ? im.dataClass
        : 'green') as CanonImage['dataClass'],
      caption: im.caption || '',
      qbeAreas: im.qbeAreas ?? [],
      canonicalPath: im.canonicalPath,
      consentCleared: !!im.consentCleared,
      slot: im.slot,
      src: `/api/admin/canon-image?path=${encodeURIComponent(im.canonicalPath)}`,
      webUrl: im.canonicalPath.startsWith('v2/public/')
        ? '/' + im.canonicalPath.slice('v2/public/'.length)
        : null,
    }));
    return { asOf: raw.asOf || '', images, gaps: raw.gaps ?? [], error: null };
  } catch (e) {
    return { asOf: '', images: [], gaps: [], error: e instanceof Error ? e.message : String(e) };
  }
}

interface ElMediaRow {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  title: string | null;
  altText: string | null;
  culturalTags: string[] | null;
  consentObtained: boolean | null;
  elderApproved: boolean | null;
  isHero: boolean | null;
}

// Fetch the EL photo library via the content-hub API. Consent flags come straight
// from EL; most project uploads carry none yet, so they surface as "not flagged"
// and the human still holds the final community-consent call.
async function fetchElPhotos(): Promise<ElPhoto[]> {
  if (!EL_API_KEY) return [];
  try {
    const url = `${EL_API}/api/v1/content-hub/media?project_code=${EL_PCODE}&type=image&limit=300`;
    const res = await fetch(url, { headers: { 'X-API-Key': EL_API_KEY }, cache: 'no-store' });
    if (!res.ok) return [];
    const rows = (((await res.json()) as { media?: ElMediaRow[] })?.media ?? []);
    return rows
      .map((m): ElPhoto | null => {
        if (!m.url || !safeImageUrl(m.url)) return null;
        return {
          id: m.id,
          url: m.url,
          thumb: m.thumbnailUrl || m.url,
          title: m.title || m.altText || '',
          tags: m.culturalTags || [],
          isPublic: false, // content-hub exposes no public flag; nothing is public by default
          consent: !!m.consentObtained,
          elderOk: !!m.elderApproved,
          location: '',
          kind: 'image' as const,
        };
      })
      .filter((p): p is ElPhoto => p !== null);
  } catch {
    return [];
  }
}

// EL videos (content-hub). Same consent semantics; thumb is the poster frame.
async function fetchElVideos(): Promise<ElPhoto[]> {
  if (!EL_API_KEY) return [];
  try {
    const url = `${EL_API}/api/v1/content-hub/media?project_code=${EL_PCODE}&type=video&limit=100`;
    const res = await fetch(url, { headers: { 'X-API-Key': EL_API_KEY }, cache: 'no-store' });
    if (!res.ok) return [];
    const rows = (((await res.json()) as { media?: ElMediaRow[] })?.media ?? []);
    return rows
      .filter((m) => m.url)
      .map((m) => ({
        id: m.id,
        url: m.url,
        thumb: m.thumbnailUrl || m.url,
        title: m.title || m.altText || '',
        tags: m.culturalTags || [],
        isPublic: false,
        consent: !!m.consentObtained,
        elderOk: !!m.elderApproved,
        location: '',
        kind: 'video' as const,
      }));
  } catch {
    return [];
  }
}

// EL storyteller portraits (syndication). Always RED — consent-gated faces.
async function fetchElPortraits(): Promise<ElPhoto[]> {
  if (!EL_API_KEY || !EL_SLUG || !EL_PID) return [];
  try {
    const url = `${EL_API}/api/v1/sites/${EL_SLUG}/projects/${EL_PID}/storytellers?limit=100`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${EL_API_KEY}` }, cache: 'no-store' });
    if (!res.ok) return [];
    const rows = (((await res.json()) as { storytellers?: { id: string; name?: string; avatarUrl?: string; isElder?: boolean; location?: string }[] })?.storytellers ?? []);
    return rows
      .filter((s) => s.avatarUrl && safeImageUrl(s.avatarUrl))
      .map((s) => ({
        id: s.id,
        url: s.avatarUrl as string,
        thumb: s.avatarUrl as string,
        title: s.name || '',
        tags: s.isElder ? ['elder'] : [],
        isPublic: false,
        consent: false, // RED: the human holds the consent call
        elderOk: false,
        location: s.location || '',
        kind: 'portrait' as const,
      }));
  } catch {
    return [];
  }
}

interface RawSlot {
  key: string; label: string; group: string; type: string; dataClass: string;
  areas?: string[]; use?: string; note?: string; seed?: string | null;
}
function loadSlots(): CanonSlot[] {
  try {
    const p = path.join(repoRoot(), 'design', 'canon-slots.json');
    const raw = JSON.parse(fs.readFileSync(p, 'utf8')) as { slots?: RawSlot[] };
    return (raw.slots ?? []).map((s) => ({
      key: s.key, label: s.label, group: s.group, type: s.type, dataClass: s.dataClass,
      areas: s.areas ?? [], use: s.use, note: s.note, seed: s.seed ?? null,
      seedSrc: s.seed && s.type !== 'video' && fs.existsSync(path.join(repoRoot(), s.seed))
        ? `/api/admin/canon-image?path=${encodeURIComponent(s.seed)}`
        : null,
    }));
  } catch {
    return [];
  }
}

export default async function CanonBoardPage() {
  const { asOf, images, gaps, error } = loadCanon();
  const [imgPhotos, vids, portraits] = await Promise.all([
    fetchElPhotos(),
    fetchElVideos(),
    fetchElPortraits(),
  ]);
  const elPhotos = [...imgPhotos, ...vids, ...portraits];
  const slots = loadSlots();
  const elPicks = getCanonElPicks();
  const elMissing = !EL_API_KEY;

  // Unified candidate pool for the Studio: every EL asset + every repo image.
  const elConsentStr = (p: ElPhoto) =>
    p.isPublic ? 'el:public' : p.consent && p.elderOk ? 'el:gated-ok' : p.consent ? 'el:consent-elder-pending' : 'el:not-flagged';
  const elCandidates: Candidate[] = elPhotos.map((p) => ({
    id: p.id, source: 'el', kind: p.kind || 'image',
    thumb: p.thumb, full: p.url, title: p.title, tags: p.tags,
    area: p.tags[0]?.split(':').pop() || '', url: p.url, consent: elConsentStr(p),
  }));
  const repoCandidates: Candidate[] = getLocalImages().map((im) => ({
    id: im.url, source: 'repo',
    kind: /\/people\//.test(im.url) ? 'portrait' : 'image',
    thumb: im.url, full: im.url,
    title: im.filename.replace(/\.[a-z0-9]+$/i, ''), tags: im.tags, area: im.area,
    path: `v2/public${im.url}`,
  }));
  const candidates = [...repoCandidates, ...elCandidates];

  const canonBySlot: Record<string, { canonicalPath: string; src: string; subject: string }> = {};
  for (const im of images) if (im.slot) canonBySlot[im.slot] = { canonicalPath: im.canonicalPath, src: im.src, subject: im.subject };

  return (
    <div className="p-2 sm:p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Canon studio</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Fill each purpose the raise needs with its best asset. The <strong>Studio</strong> tab walks
          you slot by slot: for each, the whole pool (Empathy Ledger photos, videos, faces + every repo
          image) is ranked best-first, one click pins the winner and jumps to the next empty slot. The{' '}
          <strong>By QBE area</strong> tab is the reference view. Picks save instantly and regenerate{' '}
          <code className="text-xs">design/canon-resolved.json</code>, so every artifact pulls the
          winner. Raw pool: {' '}
          <Link href="/admin/media-library" className="underline hover:text-foreground">
            Media library
          </Link>
          .
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500 align-middle" /> green
            = public-safe
          </span>
          <span>
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500 align-middle" /> red =
            consent-gated (storyteller)
          </span>
          {asOf && <span>canon as of {asOf}</span>}
          <span>{elPhotos.length} EL photos available</span>
        </div>
        {error && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Could not read <code>design/image-canon.json</code> ({error}). On Vercel the design/ tree
            may not be deployed — run this board locally.
          </p>
        )}
        {elMissing && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Empathy Ledger is unavailable (env var <code>EMPATHY_LEDGER_API_KEY</code> not set). The
            EL picker will be empty.
          </p>
        )}
      </header>

      <CanonShell
        images={images}
        gaps={gaps}
        areaNames={AREA_NAMES}
        slots={slots}
        elPhotos={elPhotos}
        elPicks={elPicks}
        candidates={candidates}
        canonBySlot={canonBySlot}
      />
    </div>
  );
}
