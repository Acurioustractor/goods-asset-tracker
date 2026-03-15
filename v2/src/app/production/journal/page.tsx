import { Metadata } from 'next';
import { ProductionHeader } from '@/components/production/production-header';
import { ProductionNav } from '@/components/production/production-nav';
import { JournalForm } from './journal-form';

export const metadata: Metadata = {
  title: 'Process Journal',
  description: 'Reflections and improvement ideas for on-country production',
};

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-muted/30" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="bg-foreground text-background py-5 sm:py-8" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
        <div className="container mx-auto px-4">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Process Journal
          </h1>
          <p className="text-background/70 mt-0.5 text-sm sm:text-base">
            On-Country Production Facility
          </p>
          <ProductionHeader />
          <ProductionNav />
        </div>
      </div>

      <div className="container mx-auto px-4 py-5 sm:py-8 max-w-2xl">
        <JournalForm />
      </div>
    </main>
  );
}
