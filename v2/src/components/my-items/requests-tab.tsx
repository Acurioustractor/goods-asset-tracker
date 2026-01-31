'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UserRequest {
  id: string;
  asset_id: string | null;
  request_type: string;
  description: string | null;
  priority: string;
  status: string;
  created_at: string;
  fulfilled_at: string | null;
  fulfillment_notes: string | null;
}

interface UserAsset {
  id: string;
  asset_id: string;
  assets: {
    unique_id: string;
    product: string | null;
  };
}

interface RequestsTabProps {
  userItems: UserAsset[];
  onNewRequest: () => void;
}

const REQUEST_TYPE_LABELS: Record<string, string> = {
  blanket: 'Blanket',
  pillow: 'Pillow',
  parts: 'Replacement Parts',
  checkin: 'Check-in',
  pickup: 'Pickup',
  other: 'Other',
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  approved: 'default',
  in_progress: 'default',
  fulfilled: 'outline',
  denied: 'destructive',
};

export function RequestsTab({ userItems, onNewRequest }: RequestsTabProps) {
  const [requests, setRequests] = React.useState<UserRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await fetch('/api/user/requests');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load requests');
      }

      setRequests(data.requests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-5 w-16 bg-muted rounded-full" />
              </div>
              <div className="mt-2 h-3 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">No Requests</h3>
            <p className="text-muted-foreground text-sm mb-4">
              You haven&apos;t made any requests yet
            </p>
            {userItems.length > 0 && (
              <Button onClick={onNewRequest}>Request an Item</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
          <Button onClick={onNewRequest} className="w-full">
            Request an Item
          </Button>
        </>
      )}
    </div>
  );
}

function RequestCard({ request }: { request: UserRequest }) {
  const typeLabel = REQUEST_TYPE_LABELS[request.request_type] || request.request_type;
  const statusVariant = STATUS_VARIANTS[request.status] || 'secondary';
  const statusLabel = request.status.replace(/_/g, ' ');

  const createdDate = new Date(request.created_at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const fulfilledDate = request.fulfilled_at
    ? new Date(request.fulfilled_at).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
      })
    : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="font-semibold text-sm">{typeLabel.toUpperCase()}</div>
          <Badge variant={statusVariant} className="capitalize text-xs">
            {statusLabel}
          </Badge>
        </div>

        <div className="mt-2 text-sm text-muted-foreground space-y-1">
          {request.asset_id && <div>Item: {request.asset_id}</div>}
          <div>
            Created: {createdDate}
            {request.priority && request.priority !== 'normal' && (
              <span className="ml-2">
                • Priority:{' '}
                <span
                  className={cn(
                    request.priority === 'urgent' && 'text-destructive font-medium'
                  )}
                >
                  {request.priority}
                </span>
              </span>
            )}
          </div>
          {request.description && (
            <div className="text-foreground mt-1">{request.description}</div>
          )}
          {fulfilledDate && <div className="mt-1">Fulfilled: {fulfilledDate}</div>}
          {request.fulfillment_notes && (
            <div className="mt-1">Notes: {request.fulfillment_notes}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
