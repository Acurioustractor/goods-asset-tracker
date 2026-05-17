import Link from 'next/link';
import { SMART_LISTS } from '@/lib/ghl/smart-lists';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Users } from 'lucide-react';
import { ComposeForm } from './compose-form';

export const dynamic = 'force-dynamic';

export default async function ReachOutPage({
  searchParams,
}: {
  searchParams: Promise<{ list?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const selectedListId = params.list || null;
  const selectedCustomTag = params.tag || null;
  const selectedList = selectedListId ? SMART_LISTS.find((l) => l.id === selectedListId) : null;

  return (
    <div className="space-y-6 pb-16">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Reach out</h1>
        <p className="mt-1 text-sm text-gray-600">
          Send a single SMS to everyone in a tag-based smart list. Outbound texts cost
          ~AU$0.05 per 160-character segment per recipient. Always preview before sending.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* List picker */}
        <div className="lg:col-span-1">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Smart lists
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
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-900">{list.name}</span>
                      <Users className="h-4 w-4 shrink-0 text-gray-400" />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{list.description}</p>
                    <div className="mt-2 font-mono text-[10px] text-gray-400">{list.tag}</div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-3">
            <div className="text-sm font-semibold text-gray-900">Custom tag</div>
            <p className="mt-1 text-xs text-gray-600">
              Use any GHL tag, e.g. <code className="rounded bg-gray-100 px-1">goods-asset-gb0-156-1</code>{' '}
              to text only the people linked to a specific bed.
            </p>
            <form method="get" className="mt-2 flex gap-2">
              <input
                type="text"
                name="tag"
                placeholder="goods-…"
                defaultValue={selectedCustomTag || ''}
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
              />
              <button
                type="submit"
                className="rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white hover:bg-gray-700"
              >
                Use
              </button>
            </form>
          </div>
        </div>

        {/* Compose form */}
        <div className="lg:col-span-2">
          {!selectedListId && !selectedCustomTag ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Send className="h-10 w-10 text-gray-300" />
                <p className="mt-4 text-sm text-gray-600">
                  Pick a smart list on the left to compose a message.
                </p>
              </CardContent>
            </Card>
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
