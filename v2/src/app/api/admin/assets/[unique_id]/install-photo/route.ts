import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

const STORAGE_BUCKET = 'ticket-photos';
const MAX_BYTES = 12 * 1024 * 1024; // 12MB — covers most iPhone JPEGs

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ unique_id: string }> }
) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  const { unique_id } = await params;
  if (!unique_id || !/^[A-Za-z0-9_-]{1,64}$/.test(unique_id)) {
    return NextResponse.json({ error: 'invalid unique_id' }, { status: 400 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'invalid form data' }, { status: 400 });
  }

  const photo = form.get('photo') as File | null;
  if (!photo || photo.size === 0) {
    return NextResponse.json({ error: 'no photo provided' }, { status: 400 });
  }
  if (photo.size > MAX_BYTES) {
    return NextResponse.json({ error: 'photo too large (max 12MB)' }, { status: 413 });
  }

  const supabase = createServiceClient();
  const ext = (photo.name.split('.').pop()?.toLowerCase() || 'jpg').replace(/[^a-z0-9]/g, '');
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(ext) ? ext : 'jpg';
  const path = `bed-installs/${unique_id}/install-${Date.now()}.${safeExt}`;
  const arrayBuffer = await photo.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, arrayBuffer, {
      contentType: photo.type || 'image/jpeg',
      upsert: false,
    });
  if (uploadError) {
    return NextResponse.json(
      { error: `upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }

  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  const publicUrl = pub.publicUrl;

  // Write the URL straight onto the asset row so the bed page can show it
  const { error: updateError } = await supabase
    .from('assets')
    .update({ install_photo_url: publicUrl })
    .eq('unique_id', unique_id);

  if (updateError) {
    return NextResponse.json(
      { error: `db update failed: ${updateError.message}`, url: publicUrl },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, url: publicUrl, path });
}
