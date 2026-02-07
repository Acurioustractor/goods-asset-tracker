import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { empathyLedger } from '@/lib/empathy-ledger';
import { communityPartnerships } from '@/lib/data/content';
import type { SyndicationStoryteller, ProjectInsights } from '@/lib/empathy-ledger/types';

export const metadata = {
  title: 'Community Dashboard - Goods on Country',
  description: 'Meet the 29 storytellers shaping Goods on Country. Explore community voices, themes, insights, and impact across remote Australia.',
};

// ─── Data fetching ──────────────────────────────────────────

async function getProjectData() {
  const [storytellers, insights, photos] = await Promise.all([
    empathyLedger.getProjectStorytellers({ limit: 50 }),
    empathyLedger.getProjectInsights(),
    empathyLedger.getMedia({ type: 'image', elderApproved: true, limit: 12 }),
  ]);
  return { storytellers, insights, photos };
}

// ─── Server components ──────────────────────────────────────

function StatsBar({ storytellers, insights }: {
  storytellers: SyndicationStoryteller[];
  insights: ProjectInsights | null;
}) {
  const elders = storytellers.filter(s => s.isElder);
  const withAnalysis = storytellers.filter(s => s.themes.length > 0);

  return (
    <section className="py-6 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-bold">{storytellers.length}</p>
            <p className="text-sm font-medium text-primary-foreground/90">Storytellers</p>
            <p className="text-xs text-primary-foreground/60 mt-0.5">{elders.length} elders</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">{insights?.project.transcriptCount ?? '—'}</p>
            <p className="text-sm font-medium text-primary-foreground/90">Conversations</p>
            <p className="text-xs text-primary-foreground/60 mt-0.5">recorded &amp; analyzed</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">{insights?.themes.length ?? '—'}</p>
            <p className="text-sm font-medium text-primary-foreground/90">Themes</p>
            <p className="text-xs text-primary-foreground/60 mt-0.5">identified by analysis</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">{withAnalysis.length}</p>
            <p className="text-sm font-medium text-primary-foreground/90">Analyzed</p>
            <p className="text-xs text-primary-foreground/60 mt-0.5">storyteller profiles</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StorytellersGrid({ storytellers }: { storytellers: SyndicationStoryteller[] }) {
  const elders = storytellers.filter(s => s.isElder);
  const others = storytellers.filter(s => !s.isElder);

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#FDF8F3' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-accent mb-4">
            Meet the People
          </p>
          <h2
            className="text-3xl md:text-4xl font-light text-foreground mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Our Storytellers
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            {storytellers.length} voices shaping what we build. Every quote is from a real conversation.
          </p>
        </div>

        {/* Elders — featured layout */}
        {elders.length > 0 && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {elders.map((person) => (
                <Card key={person.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex gap-0">
                      <div className="relative w-40 md:w-48 flex-shrink-0 bg-muted">
                        {person.avatarUrl ? (
                          <Image
                            src={person.avatarUrl}
                            alt={person.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 160px, 192px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-4xl font-light text-muted-foreground">
                            {person.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
                          <Badge className="bg-emerald-600 text-white text-xs">Elder</Badge>
                        </div>
                        {person.location && (
                          <p className="text-sm text-muted-foreground mb-3">{person.location}</p>
                        )}
                        {person.quotes[0] && (
                          <blockquote className="border-l-2 border-primary/30 pl-3">
                            <p
                              className="text-sm italic text-foreground/80 line-clamp-3"
                              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                            >
                              &ldquo;{person.quotes[0].text}&rdquo;
                            </p>
                          </blockquote>
                        )}
                        {person.themes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {person.themes.slice(0, 3).map(t => (
                              <span key={t.name} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                {t.displayName}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Other storytellers — compact grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {others.map((person) => (
              <Card key={person.id} className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] bg-muted">
                    {person.avatarUrl ? (
                      <Image
                        src={person.avatarUrl}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl font-light text-muted-foreground/50">
                        {person.name.charAt(0)}
                      </div>
                    )}
                    {person.transcriptCount > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                          {person.transcriptCount} transcript{person.transcriptCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-foreground mb-0.5">{person.name}</h3>
                    {person.location && (
                      <p className="text-sm text-muted-foreground mb-3">{person.location}</p>
                    )}
                    {person.quotes[0] && (
                      <p
                        className="text-sm italic text-foreground/70 line-clamp-2"
                        style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                      >
                        &ldquo;{person.quotes[0].text}&rdquo;
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ThemesSection({ insights }: { insights: ProjectInsights }) {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-accent mb-4">
            What People Talk About
          </p>
          <h2
            className="text-3xl font-light text-foreground mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Community Themes
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            AI-assisted analysis of {insights.project.transcriptCount} conversations
            with {insights.project.storytellerCount} storytellers
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.themes.slice(0, 9).map((theme) => (
            <div
              key={theme.name}
              className="rounded-xl border border-border p-6 bg-background hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-foreground">{theme.displayName}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {theme.storytellerCount} voice{theme.storytellerCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, theme.frequency * 10)}%` }}
                />
              </div>
              {theme.culturalContexts.length > 0 && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {theme.culturalContexts[0]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopQuotesSection({ insights }: { insights: ProjectInsights }) {
  if (insights.topQuotes.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-background/50 mb-4">
            In Their Words
          </p>
          <h2
            className="text-3xl font-light mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Highest Impact Quotes
          </h2>
          <p className="max-w-xl mx-auto text-background/60">
            The most powerful words from {insights.project.storytellerCount} storytellers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {insights.topQuotes.slice(0, 6).map((quote, i) => (
            <div
              key={i}
              className="rounded-lg bg-background/5 border border-background/10 p-6"
            >
              <p
                className="text-lg leading-relaxed text-background/90 mb-4"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                &ldquo;{quote.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-background/60">
                  {quote.storytellerName}
                </p>
                {quote.impactScore != null && (
                  <span className="text-xs text-background/40">
                    Impact: {quote.impactScore.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotoGallerySection({ photos }: { photos: { id: string; url: string; title: string | null; altText: string | null; attributionText: string | null }[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-accent mb-4">
            Gallery
          </p>
          <h2
            className="text-3xl font-light text-foreground mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Moments from Country
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            Elder-approved photos shared by community members
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
              <Image
                src={photo.url}
                alt={photo.altText || photo.title || 'Community photo'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {photo.attributionText && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white">{photo.attributionText}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Partnerships (preserved from existing page) ────────────

function PartnershipsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-accent mb-4">
            Our Partners
          </p>
          <h2
            className="text-3xl font-light text-foreground mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Community Partnerships
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            Every product is co-designed, tested, and refined with the people who use them.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {communityPartnerships.map((partnership, index) => (
            <Card key={partnership.id} className={index % 2 === 0 ? '' : 'bg-muted/30'}>
              <CardContent className="p-8 md:p-12">
                <div className="grid gap-8 md:grid-cols-[2fr_1fr] items-start">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-accent mb-2">
                      {partnership.region}
                    </p>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {partnership.name}
                    </h3>
                    <p className="text-lg text-primary font-medium mb-4">
                      {partnership.headline}
                    </p>
                    <p className="text-muted-foreground mb-6">
                      {partnership.description}
                    </p>
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-6">
                      {partnership.highlight}
                    </blockquote>
                    <div className="flex flex-wrap gap-2">
                      {partnership.keyPeople.map((person) => (
                        <span
                          key={person}
                          className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    {partnership.bedsDelivered > 0 && (
                      <div className="inline-block rounded-xl bg-muted p-6">
                        <div className="text-3xl font-bold text-primary">
                          {partnership.bedsDelivered}
                        </div>
                        <div className="text-sm text-muted-foreground">beds delivered</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section className="bg-accent py-16 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h2
          className="text-3xl font-light text-accent-foreground mb-8"
          style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
        >
          Together, we&apos;ve delivered
        </h2>
        <div className="grid gap-8 sm:grid-cols-4 max-w-3xl mx-auto mb-10">
          <div>
            <div className="text-4xl font-bold text-accent-foreground">369+</div>
            <div className="text-sm text-accent-foreground/80 mt-1">Beds delivered</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-foreground">8+</div>
            <div className="text-sm text-accent-foreground/80 mt-1">Communities served</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-foreground">20+</div>
            <div className="text-sm text-accent-foreground/80 mt-1">Washing machines</div>
          </div>
        </div>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/partner">Partner With Us</Link>
        </Button>
      </div>
    </section>
  );
}

// ─── Community Hub (announcements/ideas) ────────────────────

async function CommunityHub() {
  const supabase = await createClient();

  const [{ data: announcements }, { data: topIdeas }] = await Promise.all([
    supabase
      .from('announcements')
      .select('id, title, content, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(3),
    supabase
      .from('community_ideas')
      .select('id, title, vote_count, category')
      .order('vote_count', { ascending: false })
      .limit(3),
  ]);

  const hasAnnouncements = announcements && announcements.length > 0;
  const hasIdeas = topIdeas && topIdeas.length > 0;

  if (!hasAnnouncements && !hasIdeas) return null;

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h2
            className="text-2xl font-light text-foreground mb-2"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Community Hub
          </h2>
          <p className="text-muted-foreground">Stay connected, share ideas, and help shape the future of Goods.</p>
        </div>

        {hasAnnouncements && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Announcements
            </h3>
            <div className="space-y-3">
              {announcements!.map((a) => (
                <Card key={a.id}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1">{a.title}</h4>
                    {a.content && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(a.published_at!).toLocaleDateString('en-AU', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Get Involved
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="hover:bg-muted/50 transition-colors">
              <Link href="/community/ideas" className="block p-4 text-center">
                <div className="text-2xl mb-1">Ideas</div>
                <div className="text-xs text-muted-foreground">Share &amp; vote</div>
              </Link>
            </Card>
            <Card className="hover:bg-muted/50 transition-colors">
              <Link href="/community/ideas/new" className="block p-4 text-center">
                <div className="text-2xl mb-1">Submit</div>
                <div className="text-xs text-muted-foreground">Tell us yours</div>
              </Link>
            </Card>
          </div>
        </div>

        {hasIdeas && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Popular Ideas
              </h3>
              <Link href="/community/ideas" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {topIdeas!.map((idea) => (
                <Card key={idea.id}>
                  <Link href="/community/ideas">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{idea.title}</h4>
                        {idea.category && (
                          <span className="text-xs text-muted-foreground capitalize">{idea.category}</span>
                        )}
                      </div>
                      <span className="font-medium text-sm">{idea.vote_count}</span>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main page ──────────────────────────────────────────────

export default async function CommunityPage() {
  const { storytellers, insights, photos } = await getProjectData();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-widest text-background/50 mb-8">
              Community Dashboard
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              The people who shape<br />
              <span className="text-primary">what we build</span>
            </h1>
            <p className="text-lg text-background/70 max-w-2xl">
              {storytellers.length} storytellers across remote Australia. Their conversations,
              themes, and insights drive every product decision at Goods on Country.
            </p>
            <div className="flex gap-4 mt-8">
              <Button size="lg" asChild>
                <Link href="/stories">Read Their Stories</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-background border-background/30 hover:bg-background/10" asChild>
                <Link href="/partner">Partner With Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      {storytellers.length > 0 && (
        <StatsBar storytellers={storytellers} insights={insights} />
      )}

      {/* Storytellers grid */}
      {storytellers.length > 0 && (
        <StorytellersGrid storytellers={storytellers} />
      )}

      {/* Themes */}
      {insights && insights.themes.length > 0 && (
        <ThemesSection insights={insights} />
      )}

      {/* Top quotes */}
      {insights && (
        <TopQuotesSection insights={insights} />
      )}

      {/* Photo gallery */}
      <PhotoGallerySection photos={photos} />

      {/* Partnerships */}
      <PartnershipsSection />

      {/* Impact stats */}
      <ImpactSection />

      {/* Community hub */}
      <Suspense fallback={null}>
        <CommunityHub />
      </Suspense>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-light mb-6"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Every product starts with a conversation.<br />
            <span className="text-primary">Be part of the next one.</span>
          </h2>
          <p className="text-background/70 max-w-xl mx-auto mb-8">
            When you purchase or sponsor a bed, you become part of this community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/sponsor">Sponsor a Bed</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-background border-background/30 hover:bg-background/10" asChild>
              <Link href="/shop">Shop for Yourself</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
