'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Copy, Check, FileText, Megaphone, Users, Mail } from 'lucide-react';
import type { AudienceSegment } from '@/lib/ghl/smart-lists';

interface Props {
  segment: AudienceSegment;
  reportName: string;
  reportHref: string;
}

interface SegmentPreview {
  enabled: boolean;
  kind: 'tag' | 'pipeline-stage';
  unit?: 'contacts' | 'opportunities';
  count: number;
  withEmail?: number;
  softCap: number;
  hardCap: number;
  sample?: Array<{ name: string | null; email?: string | null; value?: number; contactName?: string | null }>;
}

export function CampaignSegmentPanel({ segment, reportName, reportHref }: Props) {
  // Starts in the loading state; the parent remounts this per segment (key=id),
  // so the effect only sets state from the fetch callbacks (no sync setState).
  const [preview, setPreview] = useState<SegmentPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/reach-out/preview?segmentId=${encodeURIComponent(segment.id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setError(data.error);
        else setPreview(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [segment.id]);

  const tag = segment.source.kind === 'tag' ? segment.source.tag : null;
  const count = preview?.count ?? 0;
  const overSoft = count > segment.softCap;
  const overHard = count > segment.hardCap;
  const unit = preview?.unit ?? (segment.source.kind === 'tag' ? 'contacts' : 'opportunities');

  function copyTag() {
    if (!tag) return;
    navigator.clipboard.writeText(tag).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <Card>
      <CardContent className="space-y-5">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">{segment.name}</h2>
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-800">
              {segment.supportLevel}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{segment.description}</p>
        </header>

        {/* Live size + cap status */}
        {loading ? (
          <p className="text-sm text-gray-500">Resolving live size from GHL…</p>
        ) : error ? (
          <div className="flex items-start gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : preview ? (
          <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              <Users className="h-3.5 w-3.5" /> Live size
            </div>
            {preview.enabled ? (
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <span>
                  <strong className="text-lg text-gray-900">{count}</strong> {unit}
                </span>
                {typeof preview.withEmail === 'number' && (
                  <span className="text-gray-600">
                    <strong className="text-gray-900">{preview.withEmail}</strong> with an email
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  caps: {segment.softCap} soft · {segment.hardCap} hard
                </span>
              </div>
            ) : (
              <p className="text-amber-700">
                GHL not connected here — build the smart list in GHL to see the size. The recipe below
                still applies.
              </p>
            )}
            {preview.enabled && overSoft && !overHard && (
              <div className="mt-2 flex items-start gap-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>
                  {count} exceeds the recommended {segment.softCap} for this segment. Fine for a
                  broadcast newsletter; double-check for a high-touch list.
                </span>
              </div>
            )}
            {preview.enabled && overHard && (
              <div className="mt-2 flex items-start gap-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>
                  {count} exceeds the hard cap of {segment.hardCap}. Tighten the GHL filter (stage / tag)
                  before sending a campaign this wide.
                </span>
              </div>
            )}
            {preview.enabled && preview.sample && preview.sample.length > 0 && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                  Sample ({preview.sample.length})
                </summary>
                <ul className="mt-2 space-y-1 text-gray-600">
                  {preview.sample.map((s, i) => (
                    <li key={i} className="flex flex-wrap items-center gap-2">
                      <span>{s.name || s.contactName || '(no name)'}</span>
                      {s.email && <span className="font-mono text-gray-400">{s.email}</span>}
                      {typeof s.value === 'number' && s.value > 0 && (
                        <span className="text-gray-400">${s.value.toLocaleString()}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ) : null}

        {/* How to build in GHL */}
        <div className="rounded border border-gray-200 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Megaphone className="h-4 w-4 text-gray-500" /> Build this smart list in GHL
          </div>
          <p className="mt-1 text-sm text-gray-700">{segment.ghlSmartListRecipe}</p>
          {tag && (
            <button
              onClick={copyTag}
              className="mt-2 inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-2 py-1 font-mono text-xs text-gray-700 hover:bg-gray-50"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              {tag}
            </button>
          )}
        </div>

        {/* Recommended report */}
        <Link
          href={reportHref}
          className="flex items-start gap-3 rounded border border-sky-200 bg-sky-50 p-3 transition-colors hover:bg-sky-100"
        >
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
          <div>
            <div className="text-sm font-semibold text-sky-900">Recommended report: {reportName}</div>
            <p className="mt-0.5 text-xs text-sky-800">{segment.campaignNote}</p>
          </div>
        </Link>

        {/* No in-app send */}
        <div className="flex items-start gap-2 rounded border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <span>
            <strong className="text-gray-800">GHL owns the send.</strong> This tool only defines the
            segment. To send: build the smart list above in GHL, attach the recommended report as an
            email campaign / workflow, and send from GHL. There is no in-app send for audience segments —
            that keeps high-value funder/buyer lists off the SMS blast path.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
