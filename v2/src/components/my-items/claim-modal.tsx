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

interface AssetToClaim {
  unique_id: string;
  name: string | null;
  product: string | null;
  community: string | null;
}

interface ClaimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: AssetToClaim | null;
  onSuccess: () => void;
}

export function ClaimModal({ open, onOpenChange, asset, onSuccess }: ClaimModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!open || !asset) return null;

  const isBed = asset.product?.toLowerCase().includes('bed');
  const isWasher =
    asset.product?.toLowerCase().includes('washing') ||
    asset.product?.toLowerCase().includes('machine');
  const icon = isBed ? '🛏️' : isWasher ? '🧺' : '📦';

  const handleClaim = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/claim/${asset.unique_id}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim item');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim item');
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
        <CardHeader className="bg-gradient-to-r from-accent to-accent/80 text-white text-center pb-6">
          <div className="text-5xl mb-2">{icon}</div>
          <CardTitle className="text-xl text-white">Claim This Item?</CardTitle>
          <CardDescription className="text-white/80">
            Register this item to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="bg-muted rounded-lg p-4 space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Product</span>
              <span className="font-medium text-sm">{asset.product || 'Item'}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-muted-foreground text-sm">ID</span>
              <span className="font-medium text-sm">{asset.unique_id}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-muted-foreground text-sm">Community</span>
              <span className="font-medium text-sm">{asset.community || '-'}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-accent hover:bg-accent/90"
              onClick={handleClaim}
              disabled={isLoading}
            >
              {isLoading ? 'Claiming...' : 'Yes, Claim It'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
