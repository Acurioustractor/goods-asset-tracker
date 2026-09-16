import { cn } from '@/lib/utils';
import { describeAsAt, isStale, type AsAt as AsAtStamp } from '@/lib/data/as-at';

/**
 * The freshness stamp. One component, so every surface says when it was read the same way.
 *
 * Five of ninety-seven admin pages carried any stamp at all before this, and four of those five
 * were hardcoded strings that could not move when the data did. A stamp that cannot move is
 * worse than none: it looks like a check somebody did today.
 *
 * `source` and `check` go in the title attribute, off the page. The date is what you
 * scan for; where it came from is what you reach for once the date looks wrong.
 */
export function AsAt({ stamp, className, showSource = false }: {
  stamp: AsAtStamp;
  className?: string;
  /** Print the source inline. For a page footer, where there is room to be explicit. */
  showSource?: boolean;
}) {
  const stale = isStale(stamp);
  return (
    <span
      className={cn('text-[10px] leading-snug', stale ? 'text-goods-terracotta' : 'text-muted-foreground', className)}
      title={`${stamp.source}. ${stamp.check === 'auto' ? 'A script can re-derive this.' : 'A person has to re-read this.'}${stamp.owner ? ` ${stamp.owner} owns it.` : ''}`}
    >
      {describeAsAt(stamp)}
      {stale && ' · due a re-read'}
      {showSource && <span className="opacity-80"> · {stamp.source}</span>}
    </span>
  );
}
