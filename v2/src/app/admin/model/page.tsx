import { PlacematSvgFrame } from '@/components/model/placemat-svg';
import { PLACEMAT_READ_AT, RAISE, dollars } from '@/lib/data/model-placemat';

export const metadata = {
  title: 'The model placemat | Goods admin',
  robots: { index: false, follow: false },
};

/**
 * The model placemat: one sheet, A3 landscape, drawn as one SVG from
 * src/lib/model/placemat-svg.ts on a 12 by 13 grid. Words and figures come from
 * src/lib/data/model-placemat.ts; change them there and the sheet redraws, the
 * arrows follow the boxes and the labels find a clear spot. The photographs sit
 * inside the panels. `node --import ./scripts/lib/register-ts.mjs
 * scripts/render-placemat.mjs` writes the same sheet to the diagram catalog.
 */
export default function ModelPlacematPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold">The model placemat</h1>
        <p className="text-sm text-muted-foreground">
          Proposed model, read {PLACEMAT_READ_AT}. Asked {dollars(RAISE.totalShownAud)}: QBE {dollars(RAISE.qbeAud)} for two facilities plus{' '}
          {dollars(RAISE.bedsShownAud)} of beds, three grants of 133 at $750, plus a {dollars(RAISE.loanAud)} SEFA loan. Nothing signed.
        </p>
      </div>
      <PlacematSvgFrame />
    </div>
  );
}
