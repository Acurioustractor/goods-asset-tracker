'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ItemsTab } from '@/components/my-items/items-tab';
import { MessagesTab } from '@/components/my-items/messages-tab';
import { RequestsTab } from '@/components/my-items/requests-tab';
import { ClaimModal } from '@/components/my-items/claim-modal';
import { RequestModal } from '@/components/my-items/request-modal';
import { cn } from '@/lib/utils';

type Tab = 'items' | 'messages' | 'requests';

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

interface AssetToClaim {
  unique_id: string;
  name: string | null;
  product: string | null;
  community: string | null;
}

export default function MyItemsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = React.useState<Tab>('items');
  const [userItems, setUserItems] = React.useState<UserAsset[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Claim modal state
  const [claimModalOpen, setClaimModalOpen] = React.useState(false);
  const [assetToClaim, setAssetToClaim] = React.useState<AssetToClaim | null>(null);

  // Request modal state
  const [requestModalOpen, setRequestModalOpen] = React.useState(false);

  // Load user items on mount
  React.useEffect(() => {
    loadUserItems();
    loadUnreadCount();
  }, []);

  // Check for claim parameter
  React.useEffect(() => {
    const claimId = searchParams.get('claim');
    if (claimId) {
      // Remove from URL
      router.replace('/my-items');
      // Load asset to claim
      loadAssetToClaim(claimId);
    }
  }, [searchParams, router]);

  const loadUserItems = async () => {
    try {
      const response = await fetch('/api/user/items');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load items');
      }

      setUserItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await fetch('/api/user/messages?count_only=true');
      const data = await response.json();
      if (response.ok) {
        setUnreadCount(data.unread_count || 0);
      }
    } catch {
      // Ignore errors for unread count
    }
  };

  const loadAssetToClaim = async (assetId: string) => {
    try {
      const response = await fetch(`/api/claim/${assetId}`);
      const data = await response.json();

      if (response.ok && data.asset) {
        setAssetToClaim(data.asset);
        setClaimModalOpen(true);
      }
    } catch {
      // Ignore errors
    }
  };

  const handleClaimSuccess = () => {
    setClaimModalOpen(false);
    setAssetToClaim(null);
    loadUserItems();
  };

  const handleRequestSuccess = () => {
    setRequestModalOpen(false);
    // Switch to requests tab to show the new request
    setActiveTab('requests');
  };

  const handleOpenRequestModal = () => {
    if (userItems.length === 0) {
      setError('You need to claim an item first');
      return;
    }
    setRequestModalOpen(true);
  };

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'items', label: 'My Items' },
    { id: 'messages', label: 'Messages', badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'requests', label: 'Requests' },
  ];

  return (
    <div className="pb-20">
      {/* Tabs */}
      <div className="sticky top-0 bg-card border-b z-10">
        <div className="px-4 py-2">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors relative',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'items' && (
          <ItemsTab
            items={userItems}
            isLoading={isLoading}
            onRequestItem={handleOpenRequestModal}
          />
        )}
        {activeTab === 'messages' && (
          <MessagesTab
            userItems={userItems}
            onUnreadCountChange={setUnreadCount}
          />
        )}
        {activeTab === 'requests' && (
          <RequestsTab
            userItems={userItems}
            onNewRequest={handleOpenRequestModal}
          />
        )}
      </div>

      {/* Claim Modal */}
      <ClaimModal
        open={claimModalOpen}
        onOpenChange={setClaimModalOpen}
        asset={assetToClaim}
        onSuccess={handleClaimSuccess}
      />

      {/* Request Modal */}
      <RequestModal
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
        userItems={userItems}
        onSuccess={handleRequestSuccess}
      />
    </div>
  );
}
