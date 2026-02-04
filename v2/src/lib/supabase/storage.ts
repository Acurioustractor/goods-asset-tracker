import { createClient } from './client';

/**
 * Upload a file to the production-media storage bucket.
 * Returns the public URL on success, or throws on failure.
 */
export async function uploadProductionMedia(
  file: Blob,
  userId: string,
  shiftDate: string,
  fileName: string
): Promise<string> {
  const supabase = createClient();

  const ext = fileName.split('.').pop() || 'bin';
  const path = `${userId}/${shiftDate}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('production-media')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('production-media')
    .getPublicUrl(path);

  return urlData.publicUrl;
}
