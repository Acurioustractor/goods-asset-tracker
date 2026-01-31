'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface RequestActionsProps {
  requestId: string;
  currentStatus: string;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['approved', 'denied'],
  approved: ['in_progress', 'denied'],
  in_progress: ['fulfilled', 'denied'],
  fulfilled: [],
  denied: ['pending'],
};

export function RequestActions({ requestId, currentStatus }: RequestActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const availableTransitions = STATUS_TRANSITIONS[currentStatus] || [];

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  if (availableTransitions.length === 0) {
    return <span className="text-sm text-gray-400">-</span>;
  }

  return (
    <div className="flex gap-1">
      {availableTransitions.includes('approved') && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatusChange('approved')}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-700"
        >
          Approve
        </Button>
      )}
      {availableTransitions.includes('in_progress') && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatusChange('in_progress')}
          disabled={isLoading}
        >
          Start
        </Button>
      )}
      {availableTransitions.includes('fulfilled') && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatusChange('fulfilled')}
          disabled={isLoading}
          className="text-green-600 hover:text-green-700"
        >
          Complete
        </Button>
      )}
      {availableTransitions.includes('denied') && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleStatusChange('denied')}
          disabled={isLoading}
          className="text-red-600 hover:text-red-700"
        >
          Deny
        </Button>
      )}
      {availableTransitions.includes('pending') && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleStatusChange('pending')}
          disabled={isLoading}
        >
          Reopen
        </Button>
      )}
    </div>
  );
}
