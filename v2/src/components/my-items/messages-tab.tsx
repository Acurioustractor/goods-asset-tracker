'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  asset_id: string | null;
  direction: 'inbound' | 'outbound';
  message_text: string;
  sender_name: string | null;
  created_at: string;
  read_at: string | null;
}

interface UserAsset {
  id: string;
  asset_id: string;
  assets: {
    unique_id: string;
    product: string | null;
  };
}

interface MessagesTabProps {
  userItems: UserAsset[];
  onUnreadCountChange: (count: number) => void;
}

export function MessagesTab({ userItems, onUnreadCountChange }: MessagesTabProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [messageText, setMessageText] = React.useState('');
  const [selectedAsset, setSelectedAsset] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const loadMessages = React.useCallback(async () => {
    try {
      const response = await fetch('/api/user/messages');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load messages');
      }

      setMessages(data.messages || []);
      // Reset unread count since we've now read them
      onUnreadCountChange(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [onUnreadCountChange]);

  React.useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  React.useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch('/api/user/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_text: messageText.trim(),
          asset_id: selectedAsset || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setMessageText('');
      setSelectedAsset('');
      // Add the new message to the list
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'animate-pulse rounded-xl p-3 max-w-[85%]',
              i % 2 === 0 ? 'ml-auto bg-primary/20' : 'bg-muted'
            )}
          >
            <div className="h-4 w-32 bg-muted-foreground/20 rounded" />
          </div>
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

      {/* Messages Thread */}
      <div className="min-h-[200px] max-h-[400px] overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
              <p className="text-muted-foreground text-sm">
                Messages from the Goods on Country team will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Compose */}
      <div className="border rounded-xl p-3 space-y-3 bg-card">
        {userItems.length > 0 && (
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-muted border-0 text-sm"
          >
            <option value="">About which item? (optional)</option>
            {userItems.map((item) => (
              <option key={item.asset_id} value={item.asset_id}>
                {item.assets.product} ({item.asset_id})
              </option>
            ))}
          </select>
        )}

        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Write a message to the Goods on Country team..."
          rows={3}
          className="w-full p-2.5 rounded-lg bg-muted border-0 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSend}
            disabled={isSending || !messageText.trim()}
            className="bg-accent hover:bg-accent/90"
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isInbound = message.direction === 'inbound';
  const time = new Date(message.created_at).toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const header = message.asset_id
    ? `About ${message.asset_id}`
    : message.sender_name
    ? message.sender_name
    : '';

  return (
    <div
      className={cn(
        'max-w-[85%] rounded-xl px-3 py-2',
        isInbound
          ? 'ml-auto bg-primary/10 border border-primary/20'
          : 'bg-muted'
      )}
    >
      <p className="text-sm whitespace-pre-wrap break-words">{message.message_text}</p>
      <p className="text-xs text-muted-foreground mt-1">
        {[header, time].filter(Boolean).join(' • ')}
      </p>
    </div>
  );
}
