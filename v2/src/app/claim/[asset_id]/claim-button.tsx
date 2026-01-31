'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ClaimButtonProps {
  assetId: string;
}

export function ClaimButton({ assetId }: ClaimButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClaim = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/claim/${assetId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim item');
      }

      // Redirect to my-items on success
      router.push('/my-items');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim item');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push('/my-items')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-accent hover:bg-accent/90"
          onClick={handleClaim}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Claiming...
            </>
          ) : (
            'Yes, Claim It'
          )}
        </Button>
      </div>
    </div>
  );
}
