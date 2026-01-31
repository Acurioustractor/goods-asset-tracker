import Link from 'next/link';

const stats = [
  { value: '369+', label: 'beds delivered' },
  { value: '8', label: 'communities' },
  { value: '40%', label: 'back to community' },
  { value: '25kg', label: 'plastic diverted per bed' },
];

export function ImpactBanner() {
  return (
    <div className="bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm overflow-x-auto gap-6 sm:gap-0">
          <div className="flex items-center gap-6 sm:gap-8 md:gap-12 flex-1 justify-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-bold">{stat.value}</span>
                <span className="text-background/60">{stat.label}</span>
              </div>
            ))}
          </div>
          <Link
            href="/impact"
            className="hidden lg:inline-flex items-center gap-1 text-background/60 hover:text-background transition-colors whitespace-nowrap ml-6"
          >
            Our impact
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
