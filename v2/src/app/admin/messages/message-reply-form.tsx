'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface MessageReplyFormProps {
  profileId: string;
  assetId: string | null;
  messageId: string;
}

export function MessageReplyForm({ profileId, assetId, messageId }: MessageReplyFormProps) {
  const router = useRouter();
  const [replyText, setReplyText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: profileId,
          asset_id: assetId,
          message_text: replyText.trim(),
          mark_read_id: messageId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reply');
      }

      setSuccess(true);
      setReplyText('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-sm text-green-600">
        Reply sent successfully!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write a reply..."
        rows={2}
        className="w-full p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isLoading || !replyText.trim()}>
          {isLoading ? 'Sending...' : 'Send Reply'}
        </Button>
      </div>
    </form>
  );
}
