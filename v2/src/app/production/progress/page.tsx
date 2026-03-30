import { Metadata } from 'next';
import { ProductionHeader } from '@/components/production/production-header';
import { ProductionNav } from '@/components/production/production-nav';
import { ProgressDashboard } from './progress-dashboard';

export const metadata: Metadata = {
  title: 'My Progress',
  description: 'Track your production progress, goals, and efficiency improvements',
};

export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-muted/30" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="bg-foreground text-background py-5 sm:py-8" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
        <div className="container mx-auto px-4">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            My Progress
          </h1>
          <p className="text-background/70 mt-0.5 text-sm sm:text-base">
            Track your wins, goals &amp; efficiency
          </p>
          <ProductionHeader />
          <ProductionNav />
        </div>
      </div>

      <div className="container mx-auto px-4 py-5 sm:py-8 max-w-2xl">
        <ProgressDashboard />
      </div>
    </main>
  );
}
