// Goods-side editor for an EL story. The Goods admin can edit basic
// metadata (title, summary, themes, tags) and the rich layout payload
// (media_metadata.layout + blocks) in one place. The form action PATCHes
// the EL row directly via Supabase REST; EL is the canonical store. No
// data lives on Goods.
//
// Edits show on /stories/[id] immediately because getStory uses
// revalidate: 0 (single-detail fetches are always fresh).

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MediaSwapPanel } from './media-swap-panel';

export const metadata: Metadata = {
  title: 'Edit story · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';

interface ElStoryRow {
  id: string;
  title: string | null;
  summary: string | null;
  story_image_url: string | null;
  themes: string[] | null;
  tags: string[] | null;
  is_public: boolean;
  syndication_enabled: boolean;
  has_explicit_consent: boolean;
  media_metadata: Record<string, unknown> | null;
}

async function fetchStory(id: string): Promise<ElStoryRow | null> {
  if (!EL_URL || !EL_KEY) return null;
  const url = `${EL_URL}/rest/v1/stories?id=eq.${id}&select=id,title,summary,story_image_url,themes,tags,is_public,syndication_enabled,has_explicit_consent,media_metadata&limit=1`;
  const res = await fetch(url, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as ElStoryRow[];
  return rows[0] ?? null;
}

async function saveStory(formData: FormData) {
  'use server';

  const id = String(formData.get('id') || '');
  if (!id) throw new Error('Missing id');

  const title = String(formData.get('title') || '').trim();
  const summary = String(formData.get('summary') || '').trim();
  const storyImageUrl = String(formData.get('story_image_url') || '').trim();
  const themesRaw = String(formData.get('themes') || '').trim();
  const tagsRaw = String(formData.get('tags') || '').trim();
  const layout = String(formData.get('layout') || 'article');
  const blocksJson = String(formData.get('blocks_json') || '').trim();
  const isPublic = formData.get('is_public') === 'on';

  const themes = themesRaw ? themesRaw.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const tags = tagsRaw ? tagsRaw.split(',').map((s) => s.trim()).filter(Boolean) : [];

  let blocks: unknown[] | undefined;
  if (blocksJson) {
    try {
      blocks = JSON.parse(blocksJson);
      if (!Array.isArray(blocks)) {
        throw new Error('blocks must be a JSON array');
      }
    } catch (err) {
      throw new Error(`Invalid blocks JSON: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }

  const payload: Record<string, unknown> = {
    title,
    summary,
    story_image_url: storyImageUrl || null,
    themes,
    tags,
    is_public: isPublic,
  };
  // Only write media_metadata if the user supplied blocks (or kept the
  // layout choice). Empty blocks_json + missing layout = leave alone.
  if (blocks !== undefined) {
    payload.media_metadata = { layout, blocks };
  }

  const res = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`EL PATCH failed: ${res.status} ${text}`);
  }

  redirect(`/stories/${id}?saved=1`);
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStoryPage({ params }: Props) {
  const { id } = await params;
  const story = await fetchStory(id);
  if (!story) notFound();

  const themesValue = (story.themes ?? []).join(', ');
  const tagsValue = (story.tags ?? []).join(', ');
  const mediaMetadata = (story.media_metadata as { blocks?: unknown[]; layout?: string } | null) ?? {};
  const layoutValue = mediaMetadata.layout ?? 'article';
  const blocksValue = mediaMetadata.blocks ? JSON.stringify(mediaMetadata.blocks, null, 2) : '';

  return (
    <div className="space-y-6 pb-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit story</h1>
          <p className="mt-1 text-sm text-gray-500 max-w-prose">
            Edits PATCH the EL row directly. EL is canonical; Goods reads from it.{' '}
            <Link href={`/stories/${id}`} target="_blank" className="underline">View live</Link>{' '}
            after saving (page revalidates on every request).
          </p>
        </div>
        <Link
          href="/admin/el-stories"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Back to list
        </Link>
      </header>

      <form action={saveStory} className="space-y-6 rounded-lg border bg-white p-6">
        <input type="hidden" name="id" value={story.id} />

        <Field label="Title" name="title" defaultValue={story.title ?? ''} required />
        <Field label="Summary (dek)" name="summary" defaultValue={story.summary ?? ''} multiline rows={3} />
        <Field
          label="Hero image URL"
          name="story_image_url"
          defaultValue={story.story_image_url ?? ''}
          sub="Used as the article hero. Full https URL, or a /images/... path served by Goods."
        />

        <Field
          label="Themes (comma-separated)"
          name="themes"
          defaultValue={themesValue}
          sub={
            <>
              These render as badges on the story page. Brand guide: <em>never</em>{' '}
              use &quot;co-design&quot;. Use &quot;Designed in community&quot;,{' '}
              &quot;On-Country&quot;, &quot;Director reflection&quot;, &quot;Community-led design&quot;.
            </>
          }
        />

        <Field
          label="Tags (comma-separated)"
          name="tags"
          defaultValue={tagsValue}
          sub="Used by the field-notes resolver and other tag-query surfaces. Same brand rules apply."
        />

        {Array.isArray(mediaMetadata.blocks) && mediaMetadata.blocks.length > 0 && (
          <MediaSwapPanel
            storyId={story.id}
            blocks={mediaMetadata.blocks as unknown[]}
            defaultTag="trip:may-2026"
          />
        )}

        <div className="rounded-md border border-amber-200 bg-amber-50/50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">Layout and blocks</h2>
          <p className="mt-1 text-xs text-amber-800">
            <strong>article</strong> (default): magazine column, centered prose, inline figures and pullquotes.{' '}
            For director notes, blog posts, reflections.<br />
            <strong>rich</strong>: full field-notes scrollytelling with hero video and full-bleed beats.{' '}
            Use sparingly, for trip stories.
          </p>
          <div className="mt-4 grid gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Layout
              <select
                name="layout"
                defaultValue={layoutValue}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="article">article</option>
                <option value="rich">rich</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Blocks (JSON array)
              <textarea
                name="blocks_json"
                defaultValue={blocksValue}
                rows={26}
                spellCheck={false}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs"
                placeholder='[
  { "kind": "read", "paragraphs": ["..."] },
  { "kind": "pullquote", "quote": "...", "attribution": "..." }
]'
              />
              <span className="mt-1 block text-xs text-gray-500">
                Block kinds: <code>read</code>, <code>pullquote</code>, <code>figure</code>,{' '}
                <code>hero-photo</code>, <code>manual-gallery</code>, <code>el-gallery</code>,{' '}
                <code>el-video-gallery</code>, <code>before-after-split</code>, <code>close</code>.{' '}
                Rich-only: <code>masthead</code>, <code>immersive</code>, <code>bleedquote</code>,{' '}
                <code>pathways</code>, <code>portal</code>, <code>partner-credit</code>,{' '}
                atoms (<code>goods-facts</code> etc.).
              </span>
            </label>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="is_public" defaultChecked={story.is_public} className="h-4 w-4" />
          <span>Public (visible at <code>/stories/{story.id}</code> without auth)</span>
        </label>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button type="submit" className="rounded-md bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700">
            Save
          </button>
          <Link
            href={`/stories/${id}`}
            target="_blank"
            className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Preview
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  multiline,
  rows,
  sub,
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  sub?: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}{required && <span className="text-red-500"> *</span>}
      {multiline ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          rows={rows ?? 3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      )}
      {sub && <span className="mt-1 block text-xs text-gray-500 font-normal">{sub}</span>}
    </label>
  );
}
