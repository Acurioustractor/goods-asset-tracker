import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { empathyLedger } from '@/lib/empathy-ledger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await empathyLedger.getStory(id);

  if (!story) {
    return { title: 'Story Not Found' };
  }

  return {
    title: story.title,
    description: story.summary || story.title,
    openGraph: {
      title: story.title,
      description: story.summary || story.title,
      type: 'article',
      publishedTime: story.publishedAt,
      authors: [story.authorName],
      ...(story.featuredImageUrl && { images: [story.featuredImageUrl] }),
    },
  };
}

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params;
  const story = await empathyLedger.getStory(id);

  if (!story) {
    notFound();
  }

  const publishedDate = new Date(story.publishedAt).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Parse themes - could be string[] or {name: string}[]
  const themeNames = (story.themes || []).map((t: string | { name: string }) =>
    typeof t === 'string' ? t : t.name
  );

  return (
    <main>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {story.featuredImageUrl ? (
          <>
            <Image
              src={story.featuredImageUrl}
              alt={story.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-foreground" />
        )}

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {themeNames.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {themeNames.slice(0, 4).map((theme: string) => (
                  <Badge
                    key={theme}
                    variant="outline"
                    className="text-white/80 border-white/30 text-xs"
                  >
                    {theme}
                  </Badge>
                ))}
              </div>
            )}

            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              {story.title}
            </h1>

            {story.summary && (
              <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
                {story.summary}
              </p>
            )}

            <div className="flex items-center justify-center gap-3 text-white/60 text-sm">
              <span className="font-medium text-white">{story.authorName}</span>
              <span>&middot;</span>
              <time dateTime={story.publishedAt}>{publishedDate}</time>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4">
          <article
            className="max-w-[65ch] mx-auto prose prose-lg prose-stone
              prose-headings:font-light prose-headings:tracking-tight
              prose-p:leading-relaxed prose-p:text-muted-foreground
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-primary/30 prose-blockquote:italic
              prose-img:rounded-xl"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            dangerouslySetInnerHTML={{ __html: formatContent(story.content || '') }}
          />
        </div>
      </section>

      {/* Author + Back */}
      <section className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-[65ch] mx-auto flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Written by <span className="font-medium text-foreground">{story.authorName}</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/stories">Back to Stories</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

/**
 * Convert plain text or markdown-ish content to basic HTML paragraphs.
 * The EL API returns content as plain text with double-newline paragraph breaks.
 */
function formatContent(content: string): string {
  // If content already has HTML tags, return as-is
  if (content.includes('<p>') || content.includes('<h')) {
    return content;
  }

  // Split by double newlines into paragraphs
  return content
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .map((p) => `<p>${p.trim().replace(/\n/g, '<br />')}</p>`)
    .join('\n');
}
