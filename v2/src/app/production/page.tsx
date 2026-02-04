import { Metadata } from 'next';
import { ShiftLogForm } from './shift-log-form';
import { ProductionHeader } from '@/components/production/production-header';

export const metadata: Metadata = {
  title: 'Production Shift Log',
  description: 'Shift logging for Goods on Country on-country production facility',
};

export default function ProductionPage() {
  return (
    <main className="min-h-screen bg-muted/30" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Header */}
      <div className="bg-foreground text-background py-5 sm:py-8" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
        <div className="container mx-auto px-4">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Production Shift Log
          </h1>
          <p className="text-background/70 mt-0.5 text-sm sm:text-base">
            On-Country Production Facility
          </p>
          <ProductionHeader />
        </div>
      </div>

      {/* Form + Recent Shifts (all client-side) */}
      <div className="container mx-auto px-4 py-5 sm:py-8 max-w-2xl">
        <ShiftLogForm />
      </div>
    </main>
  );
}
