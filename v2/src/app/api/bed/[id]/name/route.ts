import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

const MAX_NAME_LEN = 80;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: { display_name?: string | null; public?: boolean; by?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const display = (body.display_name || '').trim().slice(0, MAX_NAME_LEN);
  if (display && display.length < 1) {
    return NextResponse.json({ error: 'Name too short' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: asset } = await supabase
    .from('assets')
    .select('unique_id')
    .eq('unique_id', id)
    .single();
  if (!asset) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  const { error } = await supabase
    .from('assets')
    .update({
      display_name: display || null,
      display_name_public: body.public !== false,
      display_name_set_at: new Date().toISOString(),
      display_name_set_by: (body.by || 'web-scan').slice(0, 80),
    })
    .eq('unique_id', id);

  if (error) {
    console.error('[bed/name] update failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Mirror into bed_signals for audit
  await supabase.from('bed_signals').insert({
    asset_id: id,
    signal_type: 'name_change',
    signal_value: display || '(cleared)',
    payload: { public: body.public !== false },
    created_by: (body.by || 'web-scan').slice(0, 80),
  });

  return NextResponse.json({ ok: true });
}
