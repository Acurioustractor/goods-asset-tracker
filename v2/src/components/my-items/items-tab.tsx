'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserAsset {
  id: string;
  asset_id: string;
  claimed_at: string;
  claim_status: string;
  assets: {
    unique_id: string;
    name: string | null;
    product: string | null;
    community: string | null;
    place: string | null;
    photo: string | null;
    supply_date: string | null;
  };
}

interface ItemsTabProps {
  items: UserAsset[];
  isLoading: boolean;
  onRequestItem: () => void;
}

export function ItemsTab({ items, isLoading, onRequestItem }: ItemsTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-semibold mb-2">No Items Yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Scan the QR code on your bed or washing machine to claim it
          </p>
          <Button asChild>
            <Link href="/support">Scan QR Code</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Items List */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Your Claimed Items
        </h2>
        <div className="space-y-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <Link href="/support" className="block p-4 text-center">
              <div className="text-3xl mb-2">🎫</div>
              <div className="font-medium text-sm">Report Issue</div>
              <div className="text-xs text-muted-foreground">Get support</div>
            </Link>
          </Card>
          <Card
            className="hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={onRequestItem}
          >
            <div className="p-4 text-center">
              <div className="text-3xl mb-2">🛏️</div>
              <div className="font-medium text-sm">Request Item</div>
              <div className="text-xs text-muted-foreground">Blankets, pillows</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ItemCard({ item }: { item: UserAsset }) {
  const asset = item.assets;
  const isBed = asset.product?.toLowerCase().includes('bed');
  const isWasher =
    asset.product?.toLowerCase().includes('washing') ||
    asset.product?.toLowerCase().includes('machine');

  const icon = isBed ? '🛏️' : isWasher ? '🧺' : '📦';
  const iconBgClass = isBed
    ? 'bg-gradient-to-br from-accent to-accent/80'
    : isWasher
    ? 'bg-gradient-to-br from-primary to-primary/80'
    : 'bg-gradient-to-br from-muted to-muted/80';

  const claimedDate = new Date(item.claimed_at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3 items-start">
          <div
            className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white',
              iconBgClass
            )}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{asset.product || 'Item'}</div>
                <div className="text-sm text-muted-foreground">{asset.unique_id}</div>
              </div>
              <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                Claimed
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-muted/50 rounded-lg p-2.5">
            <div className="text-xs text-muted-foreground">Community</div>
            <div className="text-sm font-medium truncate">{asset.community || '-'}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5">
            <div className="text-xs text-muted-foreground">Claimed</div>
            <div className="text-sm font-medium">{claimedDate}</div>
          </div>
          {asset.name && (
            <div className="col-span-2 bg-muted/50 rounded-lg p-2.5">
              <div className="text-xs text-muted-foreground">Recipient</div>
              <div className="text-sm font-medium">{asset.name}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
