import Link from 'next/link';
import { moduleDetail, moduleFocusFor, TRANSFER_NOTE, WHOSE_MODULE_RULE } from '@/lib/data/portal-modules';

/**
 * The one line every portal sub-page carries under its heading: which of the nine modules this
 * screen is, and the standing fact that whose module is whose is agreed in writing. Renders
 * nothing if the route has no mapping, so adding a portal page never breaks the build — the
 * guard test is what catches a missing entry.
 */
export function ModuleLine({ route }: { route: string }) {
  const focus = moduleFocusFor(route);
  if (!focus) return null;
  const m = moduleDetail(focus.module);

  return (
    <div className="mb-6 rounded-xl border border-stone-200 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-widest text-stone-500">
        Module {m.position} of {m.total}
      </p>
      <p className="mt-1 text-sm font-bold text-stone-900">{m.label}</p>
      <p className="mt-1 text-sm text-stone-600">{focus.does}</p>
      <p className="mt-2 text-xs text-stone-500">
        {WHOSE_MODULE_RULE} At Transfer: {TRANSFER_NOTE.toLowerCase()}.{' '}
        <Link href="/partners" className="font-medium text-green-700 underline">
          See all nine modules
        </Link>
      </p>
    </div>
  );
}
