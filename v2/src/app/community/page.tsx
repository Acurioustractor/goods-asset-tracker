import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { communityPartnerships } from '@/lib/data/content';

export const metadata = {
  title: 'Community - Goods on Country',
  description: 'Meet the communities shaping Goods on Country — from Tennant Creek to Palm Island.',
};

export default async function CommunityPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get published announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, content, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  // Get top ideas
  const { data: topIdeas } = await supabase
    .from('community_ideas')
    .select('id, title, vote_count, category')
    .order('vote_count', { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Our Partners
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Community Partnerships
            </h1>
            <p className="text-lg text-muted-foreground">
              Goods on Country exists because of community. Every product is co-designed,
              tested, and refined with the people who use them.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Stories */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {communityPartnerships.map((partnership, index) => (
              <Card key={partnership.id} className={index % 2 === 0 ? '' : 'bg-muted/30'}>
                <CardContent className="p-8 md:p-12">
                  <div className="grid gap-8 md:grid-cols-[2fr_1fr] items-start">
                    <div>
                      <p className="text-sm uppercase tracking-widest text-accent mb-2">
                        {partnership.region}
                      </p>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {partnership.name}
                      </h2>
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

      {/* Total Impact */}
      <section className="bg-accent py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-accent-foreground mb-8">
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
            <div>
              <div className="text-4xl font-bold text-accent-foreground">40%</div>
              <div className="text-sm text-accent-foreground/80 mt-1">Back to community</div>
            </div>
          </div>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/partner">Partner With Us</Link>
          </Button>
        </div>
      </section>

      {/* Community Hub - announcements and ideas */}
      <section className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Community Hub</h2>
            <p className="text-muted-foreground">Stay connected, share ideas, and help shape the future of Goods.</p>
          </div>

          {/* Announcements */}
          {announcements && announcements.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Announcements
              </h3>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <Card key={announcement.id}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1">{announcement.title}</h4>
                      {announcement.content && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {announcement.content}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(announcement.published_at!).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Get Involved
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="hover:bg-muted/50 transition-colors">
                <Link href="/community/ideas" className="block p-4 text-center">
                  <div className="text-3xl mb-2" role="img" aria-label="ideas">&#x1F4A1;</div>
                  <div className="font-medium text-sm">Ideas</div>
                  <div className="text-xs text-muted-foreground">Share &amp; vote</div>
                </Link>
              </Card>
              <Card className="hover:bg-muted/50 transition-colors">
                <Link href="/community/ideas/new" className="block p-4 text-center">
                  <div className="text-3xl mb-2" role="img" aria-label="submit">&#x2728;</div>
                  <div className="font-medium text-sm">Submit Idea</div>
                  <div className="text-xs text-muted-foreground">Tell us yours</div>
                </Link>
              </Card>
            </div>
          </div>

          {/* Top Ideas */}
          {topIdeas && topIdeas.length > 0 && (
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
                {topIdeas.map((idea) => (
                  <Card key={idea.id}>
                    <Link href="/community/ideas">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{idea.title}</h4>
                          {idea.category && (
                            <span className="text-xs text-muted-foreground capitalize">
                              {idea.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <span>&#x1F44D;</span>
                          <span className="font-medium">{idea.vote_count}</span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
