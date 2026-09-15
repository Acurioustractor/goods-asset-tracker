import Link from 'next/link';
import { StructureSvgFrame } from '@/components/model/structure-svg';
import { APPLICANT, STRUCTURE_READ_AT } from '@/lib/data/structure-diagram';

export const metadata = {
  title: 'Structure and funding flow | Goods admin',
  robots: { index: false, follow: false },
};

/**
 * The QBE Stage 2 Q3 attachment: one A4 page showing who applies, who owns what
 * and how money moves. Drawn as one SVG from src/lib/model/structure-svg.ts;
 * the words live in src/lib/data/structure-diagram.ts. `node --import
 * ./scripts/lib/register-ts.mjs scripts/render-structure.mjs` writes it to the
 * diagram catalog and the QBE deliverables folder.
 */
export default function StructureDiagramPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold">Structure and funding flow</h1>
        <p className="text-sm text-muted-foreground">
          QBE Stage 2, Q3. {APPLICANT.name}, {APPLICANT.tradingAs}, applies and receives. Read {STRUCTURE_READ_AT}.{' '}
          <Link href="/admin/model">The placemat</Link>.
        </p>
      </div>
      <StructureSvgFrame />
    </div>
  );
}
