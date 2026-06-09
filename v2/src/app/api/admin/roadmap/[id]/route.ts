import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

// Move / reorder a roadmap card (status + position). Admin-gated, service-role write.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  const { id } = await params;
  const body = await request.json();

  const update: Record<string, unknown> = {};
  if (typeof body.status === 'string') {
    if (!['up-next', 'in-progress', 'done'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    update.status = body.status;
  }
  if (typeof body.position === 'number' && Number.isFinite(body.position)) {
    update.position = body.position;
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from('roadmap_items').update(update).eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
