import Image from 'next/image';
import { stretchBedBOM } from '@/lib/data/supplier-quotes';

type Props = {
  productNoun: string;
  productionPhotos: string[];
  recentOperators: { operator: string; lastShift: string; sheetsThisYear: number }[];
  isMachine: boolean;
};

const SUPPLIER_STORIES: Record<string, { location: string; note: string }> = {
  'Defy Design': {
    location: 'Sydney',
    note: 'Recycled HDPE pressed and CNC-routed into the legs. Training Ebony + Jahvan to bring this on-Country.',
  },
  'DNA Steel Direct': {
    location: 'Alice Springs',
    note: 'Galvanised steel poles cut and supplied locally.',
  },
  'Centre Canvas': {
    location: 'Alice Springs',
    note: 'Heavy-duty Australian canvas, sewn locally with pole sleeves.',
  },
  'Hardware Supplier': {
    location: 'Australia',
    note: 'Ribbed end caps to seal the pole ends.',
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function BehindThisBed({ productNoun, productionPhotos, recentOperators, isMachine }: Props) {
  if (isMachine) return null; // BOM is bed-specific; machine version comes later

  const totalSheets = recentOperators.reduce((sum, op) => sum + op.sheetsThisYear, 0);

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b bg-gradient-to-br from-amber-50 to-stone-50 dark:from-amber-950/30 dark:to-stone-950/30">
        <p className="font-display text-lg font-bold">Behind this {productNoun.toLowerCase()}</p>
        <p className="text-xs text-muted-foreground">
          Where the parts came from, who pressed the plastic, and how it ended up here.
        </p>
      </div>

      {/* Materials + suppliers */}
      <div className="p-5 border-b">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
          What it&apos;s made of
        </p>
        <ul className="space-y-3">
          {stretchBedBOM.map((item) => {
            const story = SUPPLIER_STORIES[item.supplier];
            return (
              <li key={`${item.component}-${item.supplier}`} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center mt-0.5">
                  {item.qty}×
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{item.component}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.supplier}
                    {story?.location ? ` · ${story.location}` : ''}
                  </p>
                  {story?.note && (
                    <p className="text-xs text-muted-foreground mt-1 italic">{story.note}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* The Alice plant team */}
      {recentOperators.length > 0 && (
        <div className="p-5 border-b">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            At the Alice Springs plant
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            {totalSheets > 0 ? (
              <>
                {totalSheets} plastic sheets pressed this year by the team. Recent shifts:
              </>
            ) : (
              <>The crew running the plant right now:</>
            )}
          </p>
          <ul className="space-y-2">
            {recentOperators.slice(0, 5).map((op) => {
              // First name only on the public page — operators didn't opt in to full-name attribution
              const firstName = op.operator.trim().split(/\s+/)[0] || op.operator;
              return (
                <li
                  key={op.operator}
                  className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-semibold">{firstName}</span>
                    {op.sheetsThisYear > 0 && (
                      <span className="text-muted-foreground"> · {op.sheetsThisYear} sheets</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">last on {formatDate(op.lastShift)}</span>
                </li>
              );
            })}
          </ul>
          <p className="text-[11px] text-muted-foreground italic mt-3">
            Per-bed maker attribution is coming. For now we can show who&apos;s been on shift at the plant.
          </p>
        </div>
      )}

      {/* Production floor photos */}
      {productionPhotos.length > 0 && (
        <div className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
            From the production floor
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {productionPhotos.slice(0, 6).map((url, idx) => (
              <div key={url + idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={url}
                  alt={`Production floor photo ${idx + 1}`}
                  fill
                  sizes="(min-width: 640px) 220px, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
