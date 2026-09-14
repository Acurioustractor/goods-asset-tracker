import { ModelPlacematFrame } from '@/components/model/model-placemat';
import { PLACEMAT_READ_AT, RAISE, aud, audRange } from '@/lib/data/model-placemat';

export const metadata = {
  title: 'The model placemat | Goods admin',
  robots: { index: false, follow: false },
};

/**
 * The model placemat: one sheet, A3 landscape, composed in code. Words and
 * figures come from src/lib/data/model-placemat.ts; change them there. The
 * sheet scales to the window; at a window wider than about 1900px it renders
 * 1:1, which is the size the PNG export is taken at.
 */
export default function ModelPlacematPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold">The model placemat</h1>
        <p className="text-sm text-muted-foreground">
          Proposed model, read {PLACEMAT_READ_AT}. QBE {aud(RAISE.qbeAud)} plus other philanthropy{' '}
          {audRange(RAISE.otherLowAud, RAISE.otherHighAud)}. Nothing signed.
        </p>
      </div>
      <ModelPlacematFrame />
      <p className="text-xs text-muted-foreground">
        Words and figures live in <code>src/lib/data/model-placemat.ts</code>. Photographs are the Media Room starred set.
        The only drawing is the kit container cut from the accepted plant workflow.
      </p>
    </div>
  );
}
