import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { processSteps } from '@/lib/data/content';
import { processStepMedia } from '@/lib/data/media';
import { MediaSlot, VideoSlot } from '@/components/ui/media-slot';

export const metadata = {
  title: 'How It\'s Made | Goods on Country',
  description: 'Follow the journey of a Stretch Bed — from recycled plastic to community-owned sleeping solutions.',
};

function StepIcon({ icon, step }: { icon: string; step: number }) {
  const icons: Record<string, React.ReactNode> = {
    recycle: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
      </svg>
    ),
    flame: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
    scissors: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083-.128m-1.083.128l-.003.004m1.083-.132l2.768 1.598m0 0a2.165 2.165 0 012.083-.128m-2.083.128l-.003.004m2.083-.132l2.768 1.598M12 21l-1.5-1.5m0 0l-3.25-3.25a2.121 2.121 0 010-3L12 9m-4.75 8.25L12 21m0 0l4.75-4.75a2.121 2.121 0 000-3L12 9" />
      </svg>
    ),
    wrench: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    weave: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    truck: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  };

  return (
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary relative">
      {icons[icon] || icons.wrench}
      <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {step}
      </span>
    </div>
  );
}

export default function ProcessPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              The Journey
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How It&apos;s Made
            </h1>
            <p className="text-lg text-muted-foreground">
              Every Stretch Bed starts as recycled plastic and ends as a health resource
              for remote communities. Here&apos;s the journey from waste to rest.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {index < processSteps.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-px top-full h-12 w-0.5 bg-border hidden md:block" />
                )}

                <Card className={index % 2 === 0 ? '' : 'bg-muted/30'}>
                  <CardContent className="p-8 md:p-12">
                    <div className="grid gap-8 md:grid-cols-[1fr_2fr] items-center">
                      {/* Step info */}
                      <div className="text-center md:text-left">
                        <StepIcon icon={step.icon} step={step.step} />
                        <h2 className="text-2xl font-bold text-foreground mb-1">
                          {step.title}
                        </h2>
                        <p className="text-sm text-accent font-medium">
                          {step.subtitle}
                        </p>
                      </div>

                      {/* Description + media */}
                      <div>
                        <p className="text-muted-foreground mb-6">
                          {step.description}
                        </p>
                        {/* Video or photo — /public/images/process/0X-<step>.jpg */}
                        {(() => {
                          const stepKey = step.icon === 'flame' ? 'process' : step.icon === 'recycle' ? 'source' : step.icon === 'scissors' ? 'cut' : step.icon === 'wrench' ? 'build' : step.icon === 'weave' ? 'weave' : 'deliver';
                          const stepMedia = processStepMedia[stepKey];
                          if (stepMedia?.video) {
                            return <VideoSlot src={stepMedia.video} label={`${step.title} — ${step.subtitle}`} />;
                          }
                          if (stepMedia?.photo) {
                            return <MediaSlot src={stepMedia.photo} alt={`${step.title} — ${step.subtitle}`} aspect="video" />;
                          }
                          return <VideoSlot label={`${step.title} video coming soon`} />;
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Summary */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Every Bed Tells a Story
            </h2>
            <div className="grid gap-6 sm:grid-cols-3 mb-10">
              <div>
                <div className="text-3xl font-bold text-primary">25kg</div>
                <div className="text-sm text-muted-foreground mt-1">Plastic diverted from landfill per bed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">5 min</div>
                <div className="text-sm text-muted-foreground mt-1">Assembly time, no tools required</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">40%</div>
                <div className="text-sm text-muted-foreground mt-1">Of every sale returns to community</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/shop/weave-bed-single">Shop the Stretch Bed</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/partner">Partner With Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
