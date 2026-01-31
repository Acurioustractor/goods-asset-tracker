'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Asset {
  unique_id: string;
  product: string | null;
  community: string | null;
}

interface CompassionUploadFormProps {
  assets: Asset[];
}

export function CompassionUploadForm({ assets }: CompassionUploadFormProps) {
  const router = useRouter();
  const [assetId, setAssetId] = React.useState('');
  const [contentType, setContentType] = React.useState<'photo' | 'video' | 'message'>('photo');
  const [mediaUrl, setMediaUrl] = React.useState('');
  const [caption, setCaption] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assetId) {
      setError('Please select an asset');
      return;
    }

    if (contentType !== 'message' && !mediaUrl) {
      setError('Please enter a media URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/compassion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: assetId,
          content_type: contentType,
          media_url: mediaUrl || null,
          caption: caption || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload content');
      }

      setSuccess(true);
      setAssetId('');
      setMediaUrl('');
      setCaption('');
      router.refresh();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload content');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-600">
          Content uploaded successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="asset">Asset</Label>
          <select
            id="asset"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select an asset...</option>
            {assets.map((asset) => (
              <option key={asset.unique_id} value={asset.unique_id}>
                {asset.unique_id} - {asset.product} ({asset.community})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Content Type</Label>
          <select
            id="type"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as 'photo' | 'video' | 'message')}
            className="w-full p-2 border rounded-md"
          >
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="message">Message Only</option>
          </select>
        </div>
      </div>

      {contentType !== 'message' && (
        <div className="space-y-2">
          <Label htmlFor="url">Media URL</Label>
          <Input
            id="url"
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://..."
          />
          <p className="text-xs text-gray-500">
            Upload the file to Supabase Storage first, then paste the URL here
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="A message for the recipient..."
          rows={2}
          className="w-full p-2 border rounded-md resize-none"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload Content'}
      </Button>
    </form>
  );
}
