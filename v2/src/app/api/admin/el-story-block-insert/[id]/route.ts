// POST → insert a new media block into the story's media_metadata.blocks
// AFTER a given block index. Used by the Goods admin Media panel to
// add new figures, cinema-format videos, or full-bleed overlay videos
// at chosen positions in the article.
//
// Body shape:
//   { afterPath: string ("blockIndex"), kind: 'figure' | 'video-cinema' | 'video-overlay',
//     url: string, poster?: string, title?: string }
//
// Mirrors media_metadata to `content` via blocks-to-html so EL editor
// reflects the new state.

import { NextResponse } from 'next/server';
import { blocksToHtml } from '@/lib/stories/blocks-to-html';
import type { TripBlock } from '@/lib/data/trip-stories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';

interface InsertBody {
  afterIndex: number;
  kind: 'figure' | 'video-cinema' | 'video-overlay';
  url: string;
  poster?: string;
  title?: string;
  caption?: string;
}

function buildBlock(b: InsertBody): TripBlock {
  if (b.kind === 'figure') {
    return {
      kind: 'figure',
      image: b.url,
      alt: b.title || '',
      caption: b.caption,
    } as TripBlock;
  }
  if (b.kind === 'video-overlay') {
    return {
      kind: 'el-video-gallery',
      as: 'overlay',
      heading: b.title,
      sub: b.caption,
      tagQuery: { all: [] },
      limit: 1,
      items: [
        {
          id: 'inserted',
          title: b.title || '',
          caption: b.caption,
          poster: b.poster || '',
          src: b.url,
          isPublic: true,
        },
      ],
    } as unknown as TripBlock;
  }
  // video-cinema
  return {
    kind: 'el-video-gallery',
    heading: b.title,
    sub: b.caption,
    tagQuery: { all: [] },
    limit: 1,
    items: [
      {
        id: 'inserted',
        title: b.title || '',
        caption: b.caption,
        poster: b.poster || '',
        src: b.url,
        isPublic: true,
      },
    ],
  } as unknown as TripBlock;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!EL_URL || !EL_KEY) {
    return NextResponse.json({ error: 'EL env vars missing' }, { status: 500 });
  }
  let body: InsertBody;
  try {
    body = (await req.json()) as InsertBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (typeof body.afterIndex !== 'number' || !body.kind || !body.url) {
    return NextResponse.json(
      { error: 'Missing afterIndex, kind, or url' },
      { status: 400 },
    );
  }

  const getRes = await fetch(
    `${EL_URL}/rest/v1/stories?id=eq.${id}&select=media_metadata`,
    { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } },
  );
  if (!getRes.ok) return NextResponse.json({ error: 'Story not found' }, { status: 404 });
  const rows = (await getRes.json()) as Array<{ media_metadata: Record<string, unknown> | null }>;
  const story = rows[0];
  if (!story) return NextResponse.json({ error: 'Story not found' }, { status: 404 });
  const mm = (story.media_metadata as { blocks?: TripBlock[]; layout?: string } | null) ?? {};
  const blocks = Array.isArray(mm.blocks) ? [...mm.blocks] : [];
  if (blocks.length === 0) {
    return NextResponse.json({ error: 'Story has no blocks' }, { status: 400 });
  }
  const insertAt = Math.min(Math.max(body.afterIndex + 1, 0), blocks.length);
  blocks.splice(insertAt, 0, buildBlock(body));

  const content = blocksToHtml(blocks);
  const patchRes = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      media_metadata: { ...mm, blocks },
      content,
    }),
  });
  if (!patchRes.ok) {
    return NextResponse.json(
      { error: `EL PATCH failed: ${patchRes.status} ${await patchRes.text()}` },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true, insertedAt: insertAt });
}
