import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  quotes,
  themeDefinitions,
  getThemeCounts,
  communityLocations,
  storytellerProfiles,
  type ThemeId,
} from '@/lib/data/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Insights',
  description:
    'Explore thematic analysis of community voices across health, dignity, co-design, and basic needs.',
};

export default function InsightsPage() {
  const themeCounts = getThemeCounts();
  const totalQuotes = quotes.length;

  // Sort themes by count for the chart
  const sortedThemes = Object.entries(themeCounts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a) as [ThemeId, number][];

  // Get a featured quote for each theme
  const featuredQuotes = sortedThemes.map(([themeId]) => {
    const themeQuotes = quotes.filter((q) => q.theme === themeId);
    const bestQuote = themeQuotes[0]; // First quote as featured
    return { themeId, quote: bestQuote };
  });

  // Communities with storytellers
  const communitiesWithStorytellers = communityLocations
    .filter((c) => c.storytellerCount > 0)
    .sort((a, b) => b.storytellerCount - a.storytellerCount);

  // Impact dimensions stats
  const impactDimensions = [
    {
      id: 'health',
      title: 'Health',
      value: themeCounts.health,
      description: 'Voices connecting beds to health outcomes',
      color: 'red',
    },
    {
      id: 'dignity',
      title: 'Dignity',
      value: themeCounts.dignity,
      description: 'Voices about safety and self-worth',
      color: 'purple',
    },
    {
      id: 'co-design',
      title: 'Co-Design',
      value: themeCounts['co-design'],
      description: 'Voices about community-led solutions',
      color: 'amber',
    },
    {
      id: 'need',
      title: 'Basic Needs',
      value: themeCounts['community-need'] + themeCounts['freight-tax'],
      description: 'Voices about essential access',
      color: 'blue',
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-widest text-background/50 mb-4">
              Thematic Analysis
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-light mb-6"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Community Insights
            </h1>
            <p className="text-xl text-background/70 max-w-2xl mb-10">
              Understanding what communities are telling us, organised by theme.
              Every data point represents a real voice.
            </p>

            {/* Stats summary */}
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-4xl font-bold text-background">{totalQuotes}</p>
                <p className="text-sm text-background/60">Verified quotes</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-background">
                  {storytellerProfiles.length}
                </p>
                <p className="text-sm text-background/60">Storytellers</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-background">
                  {Object.keys(themeCounts).length}
                </p>
                <p className="text-sm text-background/60">Themes identified</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-background">
                  {communitiesWithStorytellers.length}
                </p>
                <p className="text-sm text-background/60">Communities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Distribution */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-light text-foreground mb-4"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Theme Distribution
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              How community voices are distributed across themes
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {sortedThemes.map(([themeId, count]) => {
              const definition = themeDefinitions[themeId];
              const percentage = Math.round((count / totalQuotes) * 100);

              return (
                <div key={themeId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">
                      {definition.title}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {count} quotes ({percentage}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        definition.color === 'amber'
                          ? 'bg-amber-500'
                          : definition.color === 'red'
                            ? 'bg-red-500'
                            : definition.color === 'purple'
                              ? 'bg-purple-500'
                              : definition.color === 'blue'
                                ? 'bg-blue-500'
                                : definition.color === 'green'
                                  ? 'bg-green-500'
                                  : definition.color === 'teal'
                                    ? 'bg-teal-500'
                                    : 'bg-slate-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Voices */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-light text-foreground mb-4"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Featured Voices
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              One powerful quote from each theme
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredQuotes.slice(0, 6).map(({ themeId, quote }) => {
              if (!quote) return null;
              const definition = themeDefinitions[themeId];

              return (
                <Card key={themeId} className="overflow-hidden">
                  <CardContent className="p-6">
                    <span
                      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-4 ${definition.className}`}
                    >
                      {definition.title}
                    </span>
                    <blockquote
                      className="text-lg leading-relaxed text-foreground mb-4"
                      style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                    >
                      &ldquo;{quote.text}&rdquo;
                    </blockquote>
                    <div className="pt-4 border-t border-border">
                      <p className="font-medium text-foreground text-sm">
                        {quote.author}
                      </p>
                      <p className="text-xs text-muted-foreground">{quote.context}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Map */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-light text-foreground mb-4"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Where Voices Come From
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Communities contributing to the Goods on Country story
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {communitiesWithStorytellers.map((community) => (
              <Card key={community.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {community.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{community.region}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {community.storytellerCount}
                      </p>
                      <p className="text-xs text-muted-foreground">storytellers</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {community.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Dimensions */}
      <section className="py-16 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-light mb-4"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Impact Dimensions
            </h2>
            <p className="text-background/60 max-w-xl mx-auto">
              The four pillars of community feedback
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {impactDimensions.map((dimension) => (
              <div
                key={dimension.id}
                className="text-center p-6 rounded-lg bg-background/5 border border-background/10"
              >
                <p
                  className={`text-4xl font-bold mb-2 ${
                    dimension.color === 'red'
                      ? 'text-red-400'
                      : dimension.color === 'purple'
                        ? 'text-purple-400'
                        : dimension.color === 'amber'
                          ? 'text-amber-400'
                          : 'text-blue-400'
                  }`}
                >
                  {dimension.value}
                </p>
                <p className="font-medium text-background mb-1">{dimension.title}</p>
                <p className="text-xs text-background/50">{dimension.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl font-light text-foreground mb-6"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Explore the Stories Behind the Data
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Every quote comes from a real conversation. Dive deeper into the voices
            that shape what we build.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/stories">Read All Stories</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
