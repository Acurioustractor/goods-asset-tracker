// POST → swap a media field on an EL story's media_metadata.blocks payload.
// The client sends a dot-path into the blocks array (e.g. "3.media.image"
// or "7.items.2.src") and a new URL. The server reads the current blocks,
// navigates to that path, sets the new value, PATCHes the EL row.
//
// Goods admin only. Service-role key never reaches the browser.

import { NextResponse } from 'next/server';
import { blocksToHtml } from '@/lib/stories/blocks-to-html';
import type { TripBlock } from '@/lib/data/trip-stories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';

interface SwapBody {
  path: string;
  value: string;
}

function setByPath(obj: unknown, path: string, value: unknown): boolean {
  const parts = path.split('.');
  let cur: Record<string, unknown> | unknown[] = obj as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (Array.isArray(cur)) {
      const idx = Number(key);
      if (!Number.isFinite(idx) || !(idx in cur)) return false;
      cur = cur[idx] as Record<string, unknown> | unknown[];
    } else if (cur && typeof cur === 'object' && key in cur) {
      cur = (cur as Record<string, unknown>)[key] as Record<string, unknown> | unknown[];
    } else {
      return false;
    }
  }
  const last = parts[parts.length - 1];
  if (Array.isArray(cur)) {
    const idx = Number(last);
    if (!Number.isFinite(idx)) return false;
    cur[idx] = value;
  } else if (cur && typeof cur === 'object') {
    (cur as Record<string, unknown>)[last] = value;
  } else {
    return false;
  }
  return true;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!EL_URL || !EL_KEY) {
    return NextResponse.json({ error: 'EL env vars missing' }, { status: 500 });
  }
  let body: SwapBody;
  try {
    body = (await req.json()) as SwapBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.path || typeof body.value !== 'string') {
    return NextResponse.json({ error: 'Missing path or value' }, { status: 400 });
  }

  // Load current story
  const getRes = await fetch(
    `${EL_URL}/rest/v1/stories?id=eq.${id}&select=media_metadata`,
    { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } },
  );
  if (!getRes.ok) {
    return NextResponse.json({ error: 'Story not found' }, { status: 404 });
  }
  const rows = (await getRes.json()) as Array<{ media_metadata: Record<string, unknown> | null }>;
  const story = rows[0];
  if (!story) {
    return NextResponse.json({ error: 'Story not found' }, { status: 404 });
  }
  const mm = (story.media_metadata as { blocks?: unknown[]; layout?: string } | null) ?? {};
  const blocks = Array.isArray(mm.blocks) ? mm.blocks : [];
  if (blocks.length === 0) {
    return NextResponse.json({ error: 'Story has no blocks' }, { status: 400 });
  }

  const ok = setByPath(blocks, body.path, body.value);
  if (!ok) {
    return NextResponse.json(
      { error: `Path "${body.path}" did not resolve in blocks` },
      { status: 400 },
    );
  }

  // PATCH back. Also mirror blocks → content so EL's native editor shows
  // the same body that Goods is rendering. Blocks remain canonical.
  const content = blocksToHtml(blocks as TripBlock[]);
  const patchRes = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ media_metadata: { ...mm, blocks }, content }),
  });
  if (!patchRes.ok) {
    const text = await patchRes.text();
    return NextResponse.json(
      { error: `EL PATCH failed: ${patchRes.status} ${text}` },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
