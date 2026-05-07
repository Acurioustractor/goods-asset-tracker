// Brand voice linter API.
// POST { "text": "..." } → { clean, violations: [...], errorCount, warningCount }
// GET ?text=... → same shape (for quick curl testing)

import { NextResponse } from 'next/server';
import { lintBrandText } from '@/lib/brand-lint';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const text = url.searchParams.get('text') ?? '';
  if (!text) {
    return NextResponse.json(
      { error: 'Provide ?text=<draft> or POST { "text": "..." }' },
      { status: 400, headers: corsHeaders }
    );
  }
  const result = lintBrandText(text);
  return NextResponse.json(result, { headers: corsHeaders });
}

export async function POST(request: Request) {
  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: corsHeaders });
  }
  if (!body.text || typeof body.text !== 'string') {
    return NextResponse.json(
      { error: 'Body must include { "text": "..." } as a string' },
      { status: 400, headers: corsHeaders }
    );
  }
  if (body.text.length > 200_000) {
    return NextResponse.json(
      { error: 'Text exceeds 200KB limit' },
      { status: 413, headers: corsHeaders }
    );
  }
  const result = lintBrandText(body.text);
  return NextResponse.json(result, { headers: corsHeaders });
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}
