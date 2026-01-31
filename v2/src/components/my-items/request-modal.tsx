'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface UserAsset {
  id: string;
  asset_id: string;
  assets: {
    unique_id: string;
    product: string | null;
  };
}

interface RequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userItems: UserAsset[];
  onSuccess: () => void;
}

const REQUEST_TYPES = [
  { value: 'blanket', label: 'Blanket' },
  { value: 'pillow', label: 'Pillow' },
  { value: 'parts', label: 'Replacement Parts' },
  { value: 'checkin', label: 'Schedule a Check-in' },
  { value: 'pickup', label: 'Request Pickup' },
  { value: 'other', label: 'Other' },
];

export function RequestModal({ open, onOpenChange, userItems, onSuccess }: RequestModalProps) {
  const [requestType, setRequestType] = React.useState('');
  const [assetId, setAssetId] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setRequestType('');
      setAssetId('');
      setDescription('');
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!requestType) {
      setError('Please select what you need');
      return;
    }
    if (!assetId) {
      setError('Please select which item');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_type: requestType,
          asset_id: assetId,
          description: description || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center pb-6">
          <div className="text-5xl mb-2">📦</div>
          <CardTitle className="text-xl text-white">Request an Item</CardTitle>
          <CardDescription className="text-white/80">
            Let us know what you need
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="request-type">What do you need?</Label>
            <select
              id="request-type"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full p-3 rounded-lg bg-muted border-0 text-sm"
            >
              <option value="">Select item...</option>
              {REQUEST_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="request-asset">For which item?</Label>
            <select
              id="request-asset"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full p-3 rounded-lg bg-muted border-0 text-sm"
            >
              <option value="">Select item...</option>
              {userItems.map((item) => (
                <option key={item.asset_id} value={item.asset_id}>
                  {item.assets.product} ({item.asset_id})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="request-description">Details (optional)</Label>
            <textarea
              id="request-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any additional details..."
              rows={3}
              className="w-full p-3 rounded-lg bg-muted border-0 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-amber-500 hover:bg-amber-600"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
