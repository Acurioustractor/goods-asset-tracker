'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Idea {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  vote_count: number;
  created_at: string;
  has_voted: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  product: 'Product',
  service: 'Service',
  community: 'Community',
  other: 'Other',
};

const STATUS_BADGES: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  submitted: { label: 'Submitted', variant: 'secondary' },
  reviewing: { label: 'Under Review', variant: 'default' },
  planned: { label: 'Planned', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'default' },
  completed: { label: 'Completed', variant: 'outline' },
  declined: { label: 'Declined', variant: 'secondary' },
};

export default function IdeasPage() {
  const [ideas, setIdeas] = React.useState<Idea[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<'votes' | 'recent'>('votes');

  React.useEffect(() => {
    loadIdeas();
  }, [sortBy]);

  const loadIdeas = async () => {
    try {
      const response = await fetch(`/api/community/ideas?sort=${sortBy}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load ideas');
      }

      setIdeas(data.ideas || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ideas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (ideaId: string, hasVoted: boolean) => {
    try {
      const response = await fetch(`/api/community/ideas/${ideaId}/vote`, {
        method: hasVoted ? 'DELETE' : 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to vote');
      }

      // Update local state
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === ideaId
            ? {
                ...idea,
                has_voted: !hasVoted,
                vote_count: hasVoted ? idea.vote_count - 1 : idea.vote_count + 1,
              }
            : idea
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Ideas</h1>
              <p className="text-sm opacity-90">Share and vote on ideas</p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link href="/community/ideas/new">Submit Idea</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Sort Options */}
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'votes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('votes')}
          >
            Most Votes
          </Button>
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('recent')}
          >
            Most Recent
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Ideas List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-5 w-3/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-lg font-semibold mb-2">No Ideas Yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Be the first to share an idea!
              </p>
              <Button asChild>
                <Link href="/community/ideas/new">Submit an Idea</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} onVote={handleVote} />
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="text-center pt-4">
          <Link href="/community" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Community
          </Link>
        </div>
      </main>
    </div>
  );
}

function IdeaCard({
  idea,
  onVote,
}: {
  idea: Idea;
  onVote: (id: string, hasVoted: boolean) => void;
}) {
  const status = STATUS_BADGES[idea.status] || STATUS_BADGES.submitted;
  const categoryLabel = idea.category ? CATEGORY_LABELS[idea.category] : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Vote Button */}
          <button
            onClick={() => onVote(idea.id, idea.has_voted)}
            className={cn(
              'flex flex-col items-center justify-center w-14 h-14 rounded-lg border transition-colors',
              idea.has_voted
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-muted border-transparent hover:border-muted-foreground/20'
            )}
          >
            <span className="text-lg">👍</span>
            <span className="text-sm font-medium">{idea.vote_count}</span>
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{idea.title}</h3>
              <Badge variant={status.variant} className="text-xs shrink-0">
                {status.label}
              </Badge>
            </div>
            {idea.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {idea.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              {categoryLabel && <span>{categoryLabel}</span>}
              <span>•</span>
              <span>
                {new Date(idea.created_at).toLocaleDateString('en-AU', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
