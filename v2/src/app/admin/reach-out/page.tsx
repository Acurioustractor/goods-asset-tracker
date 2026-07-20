import Link from 'next/link';
import { SMART_LISTS, AUDIENCE_SEGMENTS, findAudienceSegment } from '@/lib/ghl/smart-lists';
import { findReportTemplate } from '@/lib/data/report-templates';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Users, Megaphone } from 'lucide-react';
import { ComposeForm } from './compose-form';
import { CampaignSegmentPanel } from './campaign-segment-panel';

export const dynamic = 'force-dynamic';

export default async function ReachOutPage({
  searchParams,
}: {
  searchParams: Promise<{ list?: string; tag?: string; segment?: string }>;
}) {
  const params = await searchParams;
  const selectedListId = params.list || null;
  const selectedCustomTag = params.tag || null;
  const selectedSegmentId = params.segment || null;
  const selectedList = selectedListId ? SMART_LISTS.find((l) => l.id === selectedListId) : null;
  const selectedSegment = selectedSegmentId ? findAudienceSegment(selectedSegmentId) : null;
  const selectedReport = selectedSegment ? findReportTemplate(selectedSegment.recommendedReportId) : null;
  const nothingSelected = !selectedListId && !selectedCustomTag && !selectedSegmentId;

  return (
    <div className="space-y-6 pb-16">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Reach out</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Two ways to reach people. <strong>SMS lists</strong> send a single text in-app (~AU$0.05 per
          160-char segment per recipient — always preview first). <strong>Audience segments</strong> are
          level-of-support email lists that you send via a GHL campaign — this tool only defines the
          segment and the report to attach.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Picker */}
        <div className="lg:col-span-1 space-y-6">
          {/* Audience segments (GHL email campaigns) */}
          <div>
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Megaphone className="h-3.5 w-3.5" /> Audience segments · email via GHL
            </h2>
            <ul className="space-y-2">
              {AUDIENCE_SEGMENTS.map((seg) => {
                const isSelected = seg.id === selectedSegmentId;
                return (
                  <li key={seg.id}>
                    <Link
                      href={`/admin/reach-out?segment=${seg.id}`}
                      className={`block rounded-lg border p-3 transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-foreground">{seg.name}</span>
                        <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          {seg.supportLevel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{seg.description}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* SMS lists */}
          <div>
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Send className="h-3.5 w-3.5" /> SMS lists · send in-app
            </h2>
            <ul className="space-y-2">
              {SMART_LISTS.map((list) => {
                const isSelected = list.id === selectedListId;
                return (
                  <li key={list.id}>
                    <Link
                      href={`/admin/reach-out?list=${list.id}`}
                      className={`block rounded-lg border p-3 transition-colors ${
                        isSelected
                          ? 'border-accent bg-accent/10'
                          : 'border-border bg-card hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-foreground">{list.name}</span>
                        <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{list.description}</p>
                      <div className="mt-2 font-mono text-[10px] text-muted-foreground">{list.tag}</div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 rounded-lg border border-border bg-card p-3">
              <div className="text-sm font-semibold text-foreground">Custom tag (SMS)</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Use any GHL tag, e.g. <code className="rounded bg-muted px-1">goods-asset-gb0-156-1</code>{' '}
                to text only the people linked to a specific bed.
              </p>
              <form method="get" className="mt-2 flex gap-2">
                <input
                  type="text"
                  name="tag"
                  placeholder="goods-…"
                  defaultValue={selectedCustomTag || ''}
                  className="flex-1 rounded border border-input px-2 py-1 text-xs"
                />
                <button
                  type="submit"
                  className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Use
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right pane */}
        <div className="lg:col-span-2">
          {nothingSelected ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Send className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Pick an audience segment (email via GHL) or an SMS list on the left.
                </p>
              </CardContent>
            </Card>
          ) : selectedSegment ? (
            <CampaignSegmentPanel
              key={selectedSegment.id}
              segment={selectedSegment}
              reportName={selectedReport?.name || selectedSegment.recommendedReportId}
              reportHref={`/admin/reports/impact/${selectedSegment.recommendedReportId}`}
            />
          ) : (
            <ComposeForm
              listId={selectedListId}
              customTag={selectedCustomTag}
              listName={selectedList?.name || `Custom tag: ${selectedCustomTag}`}
              listDescription={selectedList?.description || null}
              defaultMessage={selectedList?.defaultMessageSeed || ''}
              softCap={selectedList?.softCap || 100}
              hardCap={selectedList?.hardCap || 250}
            />
          )}
        </div>
      </div>
    </div>
  );
}
