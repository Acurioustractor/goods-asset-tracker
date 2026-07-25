// Media Room upload endpoint. The Media Room's "Add media" dialog posts a file
// here; we store it in the public production-media bucket and, when an asset
// (bed) is named, create the compassion_content row the recipient's /bed/[id]
// page reads — the same write the retired /admin/compassion page used to do.
//
// This is the single "add media" primitive the Media Room was missing. It does
// NOT touch the existing /api/admin/compassion route or the /bed/[id] read path.
//
// SECURITY: middleware guards /admin PAGES, not /api/admin/* — self-authorise.

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient, createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'production-media';
const MAX_BYTES = 100 * 1024 * 1024; // 100MB — covers phone video clips
const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif'];
const VIDEO_EXT = ['mp4', 'mov', 'webm', 'm4v'];

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'invalid form data' }, { status: 400 });
  }

  const contentType = String(form.get('content_type') || 'photo');
  if (!['photo', 'video', 'message'].includes(contentType)) {
    return NextResponse.json({ error: 'invalid content type' }, { status: 400 });
  }
  const assetId = (form.get('asset_id') as string | null)?.trim() || null;
  const caption = (form.get('caption') as string | null)?.trim() || null;
  const isPublic = form.get('is_public') !== 'false';
  const file = form.get('file') as File | null;

  // A photo/video needs a file; a message is text-only.
  if (contentType !== 'message' && (!file || file.size === 0)) {
    return NextResponse.json({ error: 'a file is required for photo/video' }, { status: 400 });
  }
  if (file && file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'file too large (max 100MB)' }, { status: 413 });
  }

  const supabase = createServiceClient();
  let mediaUrl: string | null = null;
  let storagePath: string | null = null;

  if (file && file.size > 0) {
    const ext = (file.name.split('.').pop()?.toLowerCase() || '').replace(/[^a-z0-9]/g, '');
    const allowed = contentType === 'video' ? VIDEO_EXT : IMAGE_EXT;
    const safeExt = allowed.includes(ext) ? ext : allowed[0];
    const folder = assetId ? `compassion/${assetId}` : 'compassion/_general';
    storagePath = `${folder}/${Date.now()}.${safeExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, arrayBuffer, { contentType: file.type || undefined, upsert: false });
    if (uploadError) {
      return NextResponse.json({ error: `upload failed: ${uploadError.message}` }, { status: 500 });
    }
    mediaUrl = supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;
  }

  // No asset named → this was a plain file upload; hand back the URL to reuse.
  if (!assetId) {
    return NextResponse.json({ ok: true, url: mediaUrl });
  }

  // Audit: who uploaded (null in local dev).
  let createdBy = 'Staff';
  try {
    const userSupabase = await createClient();
    const {
      data: { user },
    } = await userSupabase.auth.getUser();
    if (user?.email) createdBy = user.email;
  } catch {
    /* local dev: no session */
  }

  // Same write the old /admin/compassion page did — the recipient bed page reads this.
  const { data: content, error } = await supabase
    .from('compassion_content')
    .insert({
      asset_id: assetId,
      content_type: contentType,
      media_url: mediaUrl,
      caption,
      created_by: createdBy,
      is_public: isPublic,
    })
    .select()
    .single();

  if (error) {
    // Don't leave an orphan file when the row didn't land (e.g. a bad asset FK).
    if (storagePath) {
      await supabase.storage.from(BUCKET).remove([storagePath]).catch(() => {});
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, url: mediaUrl, content });
}
