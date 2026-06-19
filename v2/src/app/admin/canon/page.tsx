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
  CanonBoardClient,
  type CanonImage,
  type CanonGap,
  type ElPhoto,
} from './canon-client';

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

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
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

interface ElRow {
  id: string;
  title: string | null;
  tags: string[] | null;
  is_public: boolean;
  has_explicit_consent: boolean;
  requires_elder_review: boolean;
  elder_reviewed: boolean;
  location_text: string | null;
  story_image_url: string | null;
  media_url: string | null;
}

// Fetch the EL photo library (same query + privacy guard as the dashboard picker).
async function fetchElPhotos(): Promise<ElPhoto[]> {
  if (!EL_URL || !EL_KEY || !EL_PID) return [];
  const url =
    `${EL_URL}/rest/v1/stories?project_id=eq.${EL_PID}` +
    `&select=id,title,tags,is_public,has_explicit_consent,requires_elder_review,elder_reviewed,location_text,story_image_url,media_url` +
    `&or=(story_image_url.not.is.null,media_url.not.is.null)&order=created_at.desc&limit=500`;
  const res = await fetch(url, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const rows = (await res.json()) as ElRow[];
  return rows
    .map((s): ElPhoto | null => {
      const u = s.story_image_url || s.media_url;
      if (!u || /\.(mp4|mov|m4v|webm)(\?|$)/i.test(u)) return null;
      if (!safeImageUrl(u)) return null;
      const thumb = u.includes('/storage/v1/object/public/story-images/')
        ? u.replace('/object/public/', '/render/image/public/') + '?width=480&quality=60&resize=cover'
        : u;
      return {
        id: s.id,
        url: u,
        thumb,
        title: s.title || '',
        tags: s.tags || [],
        isPublic: !!s.is_public,
        consent: !!s.has_explicit_consent,
        elderOk: !s.requires_elder_review || !!s.elder_reviewed,
        location: s.location_text || '',
      };
    })
    .filter((p): p is ElPhoto => p !== null);
}

export default async function CanonBoardPage() {
  const { asOf, images, gaps, error } = loadCanon();
  const elPhotos = await fetchElPhotos();
  const elPicks = getCanonElPicks();
  const elMissing = !EL_URL || !EL_KEY || !EL_PID;

  return (
    <div className="p-2 sm:p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Canon photo board</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          The approved image per subject, organised by QBE diagnostic area. Click any image to copy
          its path for Pencil or its web URL for the site. To pull a different shot, hit{' '}
          <strong>Add from Empathy Ledger</strong> on any area and browse the whole EL library. The
          raw local pool is in{' '}
          <Link href="/admin/media-library" className="underline hover:text-foreground">
            Media library
          </Link>
          . Local canon lives in <code className="text-xs">design/image-canon.json</code>; EL picks
          in <code className="text-xs">data/canon-el-picks.json</code>.
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
            Empathy Ledger is unavailable (env vars{' '}
            <code>EMPATHY_LEDGER_SUPABASE_URL/KEY/PROJECT_ID</code> not set). The EL picker will be
            empty.
          </p>
        )}
      </header>

      <CanonBoardClient
        images={images}
        gaps={gaps}
        areaNames={AREA_NAMES}
        elPhotos={elPhotos}
        elPicks={elPicks}
      />
    </div>
  );
}
