import Link from 'next/link';

type SiblingAsset = {
  unique_id: string;
  display_name: string | null;
  display_name_public: boolean | null;
  product: string | null;
  status: string | null;
};

type Props = {
  community: string;
  communityId: string | null;
  currentUniqueId: string;
  siblings: SiblingAsset[];
  totalCount: number;
};

export function CommunityBeds({
  community,
  communityId,
  currentUniqueId,
  siblings,
  totalCount,
}: Props) {
  if (totalCount === 0) return null;
  const others = siblings.filter((s) => s.unique_id !== currentUniqueId).slice(0, 8);

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold">
            {totalCount} {totalCount === 1 ? 'Goods item' : 'Goods items'} in {community}
          </p>
          <p className="text-xs text-muted-foreground">
            Your {currentUniqueId} is one of them. See the others.
          </p>
        </div>
        {communityId && (
          <Link
            href={`/admin/communities/${communityId}`}
            className="text-xs underline hover:text-foreground"
          >
            See all
          </Link>
        )}
      </div>
      {others.length > 0 ? (
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3">
          {others.map((sib) => (
            <li key={sib.unique_id}>
              <Link
                href={`/bed/${sib.unique_id}`}
                className="block rounded-lg border hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 p-3 transition-colors"
              >
                <p className="text-xs font-mono text-amber-700 dark:text-amber-300 truncate">
                  {sib.unique_id}
                </p>
                {sib.display_name && sib.display_name_public ? (
                  <p className="text-sm font-semibold truncate mt-0.5">&ldquo;{sib.display_name}&rdquo;</p>
                ) : (
                  <p className="text-sm font-medium truncate mt-0.5 text-muted-foreground">
                    {sib.product || 'Goods item'}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {sib.status === 'deployed' ? 'In community' : sib.status || 'Pending'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-4 text-sm text-muted-foreground">
          You&apos;re the first one to scan here.
        </p>
      )}
    </div>
  );
}
