'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Send, AlertCircle, CheckCircle2, Phone } from 'lucide-react';

interface Props {
  listId: string | null;
  customTag: string | null;
  listName: string;
  listDescription: string | null;
  defaultMessage: string;
  softCap: number;
  hardCap: number;
}

interface PreviewResult {
  enabled: boolean;
  tag: string;
  count: number;
  withPhone: number;
  sample: Array<{ id: string; name: string | null; phone: string | null; email: string | null }>;
}

interface DispatchResult {
  dryRun: boolean;
  tag: string;
  recipientCount: number;
  successCount?: number;
  failCount?: number;
  segments: number;
  estimatedCostCents: number;
}

export function ComposeForm({
  listId,
  customTag,
  listName,
  listDescription,
  defaultMessage,
  softCap,
  hardCap,
}: Props) {
  const [message, setMessage] = useState(defaultMessage);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<DispatchResult | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Fetch preview on mount
  useEffect(() => {
    setLoadingPreview(true);
    setPreviewError(null);
    setResult(null);
    const qs = listId ? `listId=${encodeURIComponent(listId)}` : `tag=${encodeURIComponent(customTag || '')}`;
    fetch(`/api/admin/reach-out/preview?${qs}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setPreviewError(data.error);
        else setPreview(data);
      })
      .catch((err) => setPreviewError(err.message))
      .finally(() => setLoadingPreview(false));
  }, [listId, customTag]);

  const segments = Math.max(1, Math.ceil(message.length / 160));
  const recipientCount = preview?.withPhone || 0;
  const estCostCents = segments * 5 * recipientCount;
  const overSoft = recipientCount > softCap;
  const overHard = recipientCount > hardCap;

  async function handleSend(dryRun: boolean) {
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch('/api/admin/reach-out/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, customTag, message, dryRun }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendError(data.error || 'Send failed');
      } else {
        setResult(data);
        if (!dryRun) setConfirming(false);
      }
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSending(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-5">
        <header>
          <h2 className="text-base font-semibold">{listName}</h2>
          {listDescription && <p className="mt-1 text-sm text-gray-600">{listDescription}</p>}
        </header>

        {/* Preview */}
        {loadingPreview ? (
          <p className="text-sm text-gray-500">Loading recipient count…</p>
        ) : previewError ? (
          <div className="flex items-start gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{previewError}</span>
          </div>
        ) : preview ? (
          <div className="rounded border border-gray-200 bg-gray-50 p-3 text-xs">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-medium uppercase tracking-wide text-gray-500">Recipients</span>
              <span className="font-mono text-gray-400">{preview.tag}</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span>
                <strong className="text-base text-gray-900">{preview.count}</strong> tagged
              </span>
              <span>
                <strong className="text-base text-gray-900">{preview.withPhone}</strong> with a phone (eligible)
              </span>
            </div>
            {preview.sample.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                  Sample ({preview.sample.length})
                </summary>
                <ul className="mt-2 space-y-1 text-gray-600">
                  {preview.sample.map((s) => (
                    <li key={s.id} className="flex items-center gap-2">
                      <span>{s.name || '(no name)'}</span>
                      {s.phone && (
                        <span className="font-mono text-gray-400">
                          <Phone className="inline h-3 w-3" /> {s.phone}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {!preview.enabled && (
              <p className="mt-2 text-amber-700">GHL is disabled — preview only, can't send.</p>
            )}
          </div>
        ) : null}

        {/* Compose */}
        <div>
          <label htmlFor="reach-message" className="mb-1 block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="reach-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            maxLength={480}
            placeholder="Hi from Goods on Country — …"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
          />
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2 text-xs text-gray-500">
            <span>
              {message.length}/480 chars · {segments} segment{segments === 1 ? '' : 's'}
            </span>
            <span>
              Est. cost: AU${(estCostCents / 100).toFixed(2)} ({recipientCount} × {segments} × $0.05)
            </span>
          </div>
          {overSoft && !overHard && (
            <div className="mt-2 flex items-start gap-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>
                {recipientCount} recipients exceeds the recommended {softCap} for this list. Double-check
                this is intentional.
              </span>
            </div>
          )}
          {overHard && (
            <div className="mt-2 flex items-start gap-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>
                {recipientCount} recipients exceeds the hard cap of {hardCap}. The dispatch endpoint will
                refuse to send. Split the list or raise the cap in code.
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
          <button
            onClick={() => handleSend(true)}
            disabled={sending || !message || recipientCount === 0}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Dry run (estimate only)
          </button>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              disabled={sending || overHard || !message || recipientCount === 0 || !preview?.enabled}
              className="inline-flex items-center gap-2 rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" /> Send to {recipientCount}
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-1.5 text-xs">
              <AlertCircle className="h-3 w-3 text-red-700" />
              <span className="text-red-800">
                This will send to {recipientCount} people. Cost ≈ AU${(estCostCents / 100).toFixed(2)}. Sure?
              </span>
              <button
                onClick={() => handleSend(false)}
                disabled={sending}
                className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {sending ? 'Sending…' : 'Yes, send now'}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={sending}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Result */}
        {sendError && (
          <div className="flex items-start gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{sendError}</span>
          </div>
        )}
        {result && (
          <div className="rounded border border-emerald-200 bg-emerald-50 p-3 text-sm">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              <strong>{result.dryRun ? 'Dry run complete' : 'Dispatch complete'}</strong>
            </div>
            <ul className="mt-2 space-y-0.5 text-xs text-emerald-900">
              <li>Tag: <code className="font-mono">{result.tag}</code></li>
              <li>Recipients: {result.recipientCount}</li>
              {!result.dryRun && (
                <>
                  <li>Sent: {result.successCount}</li>
                  {result.failCount! > 0 && <li className="text-red-700">Failed: {result.failCount}</li>}
                </>
              )}
              <li>Segments per message: {result.segments}</li>
              <li>Total cost estimate: AU${(result.estimatedCostCents / 100).toFixed(2)}</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
