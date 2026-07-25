import Link from 'next/link';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageReplyForm } from './message-reply-form';

interface SearchParams {
  filter?: string;
  page?: string;
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = createServiceClient();
  const filter = params.filter || 'unread';
  const page = parseInt(params.page || '1', 10);
  const pageSize = 20;

  // Build query
  let query = supabase
    .from('messages')
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

  if (filter === 'unread') {
    query = query.is('read_at', null).eq('direction', 'inbound');
  } else if (filter === 'inbound') {
    query = query.eq('direction', 'inbound');
  } else if (filter === 'outbound') {
    query = query.eq('direction', 'outbound');
  }

  const { data: messages, count, error } = await query;

  if (error) {
    console.error('Error fetching messages:', error);
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  const filterOptions = [
    { value: 'unread', label: 'Unread' },
    { value: 'inbound', label: 'From Users' },
    { value: 'outbound', label: 'From Staff' },
    { value: '', label: 'All Messages' },
  ];

  // Get unread count for badge
  const { count: unreadCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('direction', 'inbound')
    .is('read_at', null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount || 0} unread • {count || 0} total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((option) => (
          <Link
            key={option.value}
            href={option.value ? `/admin/messages?filter=${option.value}` : '/admin/messages?filter='}
          >
            <Button
              variant={filter === option.value ? 'default' : 'outline'}
              size="sm"
            >
              {option.label}
              {option.value === 'unread' && unreadCount ? (
                <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>
              ) : null}
            </Button>
          </Link>
        ))}
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === 'unread'
              ? 'Unread Messages'
              : filter === 'inbound'
              ? 'Messages from Users'
              : filter === 'outbound'
              ? 'Messages from Staff'
              : 'All Messages'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!messages || messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages found</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {page > 1 && (
                <Link
                  href={`/admin/messages?page=${page - 1}${filter ? `&filter=${filter}` : ''}`}
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
                  href={`/admin/messages?page=${page + 1}${filter ? `&filter=${filter}` : ''}`}
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

interface Message {
  id: string;
  profile_id: string;
  asset_id: string | null;
  direction: 'inbound' | 'outbound';
  message_text: string;
  sender_name: string | null;
  created_at: string;
  read_at: string | null;
  profiles: {
    id: string;
    phone: string | null;
    display_name: string | null;
  } | null;
}

function MessageCard({ message }: { message: Message }) {
  const isInbound = message.direction === 'inbound';
  const isUnread = isInbound && !message.read_at;

  return (
    <div
      className={`border rounded-lg p-4 ${
        isUnread ? 'bg-blue-50 border-blue-200' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Badge variant={isInbound ? 'default' : 'secondary'}>
            {isInbound ? 'From User' : 'From Staff'}
          </Badge>
          {isUnread && (
            <Badge className="bg-red-100 text-red-800">Unread</Badge>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {new Date(message.created_at).toLocaleString('en-AU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <div className="mb-2">
        <span className="font-medium">
          {message.profiles?.display_name || message.profiles?.phone || 'Unknown User'}
        </span>
        {message.asset_id && (
          <span className="text-sm text-gray-500 ml-2">
            Re: {message.asset_id}
          </span>
        )}
      </div>

      <p className="text-gray-700 whitespace-pre-wrap">{message.message_text}</p>

      {/* Reply Form for inbound messages */}
      {isInbound && message.profile_id && (
        <div className="mt-4 pt-4 border-t">
          <MessageReplyForm
            profileId={message.profile_id}
            assetId={message.asset_id}
            messageId={message.id}
          />
        </div>
      )}
    </div>
  );
}
