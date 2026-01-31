import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RequestActions } from './request-actions';

interface SearchParams {
  status?: string;
  page?: string;
}

const REQUEST_TYPE_LABELS: Record<string, string> = {
  blanket: 'Blanket',
  pillow: 'Pillow',
  parts: 'Replacement Parts',
  checkin: 'Check-in',
  pickup: 'Pickup',
  other: 'Other',
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Approved', className: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'In Progress', className: 'bg-purple-100 text-purple-800' },
  fulfilled: { label: 'Fulfilled', className: 'bg-green-100 text-green-800' },
  denied: { label: 'Denied', className: 'bg-red-100 text-red-800' },
};

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = createServiceClient();
  const statusFilter = params.status || 'pending';
  const page = parseInt(params.page || '1', 10);
  const pageSize = 20;

  // Build query
  let query = supabase
    .from('user_requests')
    .select(`
      *,
      profiles (
        id,
        phone,
        display_name
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data: requests, count, error } = await query;

  if (error) {
    console.error('Error fetching requests:', error);
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'fulfilled', label: 'Fulfilled' },
    { value: 'denied', label: 'Denied' },
    { value: 'all', label: 'All Requests' },
  ];

  // Get pending count for badge
  const { count: pendingCount } = await supabase
    .from('user_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Requests</h1>
          <p className="text-gray-500 mt-1">
            {pendingCount || 0} pending • {count || 0} total
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <Link
            key={option.value}
            href={`/admin/requests?status=${option.value}`}
          >
            <Button
              variant={statusFilter === option.value ? 'default' : 'outline'}
              size="sm"
            >
              {option.label}
              {option.value === 'pending' && pendingCount ? (
                <Badge className="ml-2 bg-red-500 text-white">{pendingCount}</Badge>
              ) : null}
            </Button>
          </Link>
        ))}
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter === 'all'
              ? 'All Requests'
              : `${STATUS_BADGES[statusFilter]?.label || statusFilter} Requests`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!requests || requests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No requests found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Item</th>
                    <th className="pb-3 font-medium">Details</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b last:border-0">
                      <td className="py-4 font-medium">
                        {REQUEST_TYPE_LABELS[request.request_type] || request.request_type}
                        {request.priority === 'urgent' && (
                          <Badge className="ml-2 bg-red-100 text-red-800">
                            Urgent
                          </Badge>
                        )}
                      </td>
                      <td className="py-4">
                        <div>{request.profiles?.display_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">
                          {request.profiles?.phone}
                        </div>
                      </td>
                      <td className="py-4 text-sm">
                        {request.asset_id || '-'}
                      </td>
                      <td className="py-4 text-sm max-w-xs truncate">
                        {request.description || '-'}
                      </td>
                      <td className="py-4">
                        <Badge className={STATUS_BADGES[request.status]?.className || ''}>
                          {STATUS_BADGES[request.status]?.label || request.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="py-4">
                        <RequestActions
                          requestId={request.id}
                          currentStatus={request.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {page > 1 && (
                <Link
                  href={`/admin/requests?page=${page - 1}&status=${statusFilter}`}
                >
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/admin/requests?page=${page + 1}&status=${statusFilter}`}
                >
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
